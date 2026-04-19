import type { PaymentData } from '../types/stellar.types.js';
import type {
  ScoreMetrics,
  ScoreResult,
  RiskLevel,
  AssetsBreakdown,
  AssetDirectionBreakdown,
  UsdValuation,
} from '../types/scoring.types.js';
import type { NetworkType } from '../config/stellar.config.js';
import { classifyAsset } from '../utils/asset.js';
import { getXlmUsdPrice } from './price.service.js';
import { logger } from '../utils/logger.js';

const METRIC_WEIGHTS = {
  inflowConsistency: 0.25,
  outflowVolatility: 0.25,
  frequency: 0.20,
  flowStability: 0.15,
  diversity: 0.10,
  volume: 0.05,
};

const RISK_THRESHOLDS = {
  low: 70,
  medium: 40,
};

function calculateInflowScore(payments: PaymentData[]): number {
  const inflows = payments.filter(p => p.isIncoming);
  if (inflows.length === 0) return 50;

  const timestamps = inflows.map(p => p.timestamp.getTime()).sort((a, b) => a - b);
  if (timestamps.length < 2) return 50;

  const intervals: number[] = [];
  for (let i = 1; i < timestamps.length; i++) {
    intervals.push(timestamps[i] - timestamps[i - 1]);
  }

  const mean = intervals.reduce((a, b) => a + b, 0) / intervals.length;
  const variance = intervals.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / intervals.length;
  const cv = Math.sqrt(variance) / (mean || 1);

  const normalizedScore = Math.max(0, Math.min(100, 100 - (cv * 50)));
  return Math.round(normalizedScore);
}

function calculateOutflowScore(payments: PaymentData[]): number {
  const outflows = payments.filter(p => !p.isIncoming);
  if (outflows.length === 0) return 100;

  const amounts = outflows.map(p => p.amount);
  const mean = amounts.reduce((a, b) => a + b, 0) / amounts.length;
  const variance = amounts.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / amounts.length;
  const cv = Math.sqrt(variance) / (mean || 1);

  const normalizedScore = Math.max(0, Math.min(100, 100 - (cv * 30)));
  return Math.round(normalizedScore);
}

function calculateFrequencyScore(payments: PaymentData[], _daysWindow = 90): number {
  if (payments.length === 0) return 0;

  const now = new Date();
  const windowStart = new Date(now.getTime() - (_daysWindow * 24 * 60 * 60 * 1000));
  const recentPayments = payments.filter(p => p.timestamp >= windowStart);

  const count = recentPayments.length;
  const maxCount = 200;
  const normalizedScore = Math.min(100, (count / maxCount) * 100);
  return Math.round(normalizedScore);
}

function calculateFlowStabilityScore(payments: PaymentData[]): number {
  const inflows = payments.filter(p => p.isIncoming);
  const outflows = payments.filter(p => !p.isIncoming);

  const inflowVolume = inflows.reduce((sum, p) => sum + p.amount, 0);
  const outflowVolume = outflows.reduce((sum, p) => sum + p.amount, 0);

  if (inflowVolume === 0 && outflowVolume === 0) return 50;
  if (inflowVolume === 0 || outflowVolume === 0) return 30;

  const ratio = Math.min(inflowVolume, outflowVolume) / Math.max(inflowVolume, outflowVolume);
  return Math.round(ratio * 100);
}

function calculateDiversityScore(payments: PaymentData[]): number {
  if (payments.length === 0) return 0;

  const counterparties = new Set<string>();
  for (const p of payments) {
    counterparties.add(p.from);
    counterparties.add(p.to);
  }

  const uniqueCount = counterparties.size;
  const maxCounterparties = 50;
  const normalizedScore = Math.min(100, (uniqueCount / maxCounterparties) * 100);
  return Math.round(normalizedScore);
}

function calculateVolumeScore(payments: PaymentData[]): number {
  const totalVolume = payments.reduce((sum, p) => sum + p.amount, 0);
  const maxVolume = 1000000;
  const normalizedScore = Math.min(100, (totalVolume / maxVolume) * 100);
  return Math.round(normalizedScore);
}

function classifyRisk(score: number): RiskLevel {
  if (score >= RISK_THRESHOLDS.low) return 'Low';
  if (score >= RISK_THRESHOLDS.medium) return 'Medium';
  return 'High';
}

function emptyDirection(): AssetDirectionBreakdown {
  return { XLM: 0, USDC: 0, other: [] };
}

function addToDirection(dir: AssetDirectionBreakdown, payment: PaymentData): void {
  const classified = classifyAsset(payment.asset);
  if (classified.kind === 'XLM') {
    dir.XLM += payment.amount;
    return;
  }
  if (classified.kind === 'USDC') {
    dir.USDC += payment.amount;
    return;
  }
  const existing = dir.other.find(
    (o) => o.code === classified.code && o.issuer === classified.issuer
  );
  if (existing) {
    existing.amount += payment.amount;
    existing.count += 1;
  } else {
    dir.other.push({
      code: classified.code,
      issuer: classified.issuer,
      label: classified.label,
      amount: payment.amount,
      count: 1,
    });
  }
}

export function computeAssetsBreakdown(payments: PaymentData[]): AssetsBreakdown {
  const assets: AssetsBreakdown = { inflow: emptyDirection(), outflow: emptyDirection() };
  for (const p of payments) {
    addToDirection(p.isIncoming ? assets.inflow : assets.outflow, p);
  }
  return assets;
}

export async function buildUsdValuation(assets: AssetsBreakdown): Promise<UsdValuation> {
  const quote = await getXlmUsdPrice();

  const unsupportedInflowCount = assets.inflow.other.reduce((sum, o) => sum + o.count, 0);
  const unsupportedOutflowCount = assets.outflow.other.reduce((sum, o) => sum + o.count, 0);

  if (!quote) {
    const usdcOnlyInflow = assets.inflow.USDC;
    const usdcOnlyOutflow = assets.outflow.USDC;
    // If the wallet only transacted in USDC we can still report USD; otherwise null.
    const canValue = (dir: AssetDirectionBreakdown): boolean =>
      dir.XLM === 0 && dir.other.every((o) => o.amount === 0);
    return {
      inflow: canValue(assets.inflow) ? usdcOnlyInflow : null,
      outflow: canValue(assets.outflow) ? usdcOnlyOutflow : null,
      xlmPriceUsd: null,
      priceSource: null,
      priceFetchedAt: null,
      unsupportedInflowCount,
      unsupportedOutflowCount,
      note:
        'XLM price unavailable — USD totals shown only if the wallet trades USDC exclusively. Other assets are tracked separately and not converted.',
    };
  }

  const inflowUsd = assets.inflow.XLM * quote.usd + assets.inflow.USDC;
  const outflowUsd = assets.outflow.XLM * quote.usd + assets.outflow.USDC;

  return {
    inflow: inflowUsd,
    outflow: outflowUsd,
    xlmPriceUsd: quote.usd,
    priceSource: quote.source,
    priceFetchedAt: quote.fetchedAt,
    unsupportedInflowCount,
    unsupportedOutflowCount,
    note:
      unsupportedInflowCount + unsupportedOutflowCount > 0
        ? 'Totals include XLM (converted) and USDC. Other assets tracked separately but not converted to USD.'
        : 'Totals include XLM (converted at the live CoinGecko rate) and USDC (pegged 1:1).',
  };
}

// NOTE: the sub-scores below (CV-based metrics) still operate on raw amounts regardless of asset.
// This means a wallet mixing XLM + USDC gets amounts summed as if they were the same unit, which
// inflates volume-like components. Fix-up requires picking a canonical unit (USD) and changing every
// wallet's score. Out of scope for the asset-breakdown pass; tracked for a future scoring overhaul.
export function computeScore(payments: PaymentData[]): { score: number; metrics: Omit<ScoreMetrics, 'overallScore'> } {
  const inflowScore = calculateInflowScore(payments);
  const outflowScore = calculateOutflowScore(payments);
  const frequencyScore = calculateFrequencyScore(payments);
  const flowStabilityScore = calculateFlowStabilityScore(payments);
  const diversityScore = calculateDiversityScore(payments);
  const volumeScore = calculateVolumeScore(payments);

  const metrics: ScoreMetrics = {
    totalVolumeXLM: payments.reduce((sum, p) => sum + p.amount, 0),
    transactionCount: payments.length,
    uniqueCounterparties: new Set(payments.flatMap(p => [p.from, p.to])).size,
    avgTransactionSize: payments.length > 0 
      ? payments.reduce((sum, p) => sum + p.amount, 0) / payments.length 
      : 0,
    inflowVolume: payments.filter(p => p.isIncoming).reduce((sum, p) => sum + p.amount, 0),
    outflowVolume: payments.filter(p => !p.isIncoming).reduce((sum, p) => sum + p.amount, 0),
    inflowCount: payments.filter(p => p.isIncoming).length,
    outflowCount: payments.filter(p => !p.isIncoming).length,
    inflowScore,
    outflowScore,
    frequencyScore,
    diversityScore,
    flowStabilityScore,
    volumeScore,
  };

  const score = Math.round(
    metrics.inflowScore * METRIC_WEIGHTS.inflowConsistency +
    metrics.outflowScore * METRIC_WEIGHTS.outflowVolatility +
    metrics.frequencyScore * METRIC_WEIGHTS.frequency +
    metrics.flowStabilityScore * METRIC_WEIGHTS.flowStability +
    metrics.diversityScore * METRIC_WEIGHTS.diversity +
    metrics.volumeScore * METRIC_WEIGHTS.volume
  );

  return { score, metrics };
}

export async function calculateWalletScore(
  accountId: string,
  network: NetworkType = 'testnet',
  horizonService: { getAccountPayments: (id: string, limit?: number) => Promise<PaymentData[]> }
): Promise<ScoreResult> {
  logger.info({ accountId, network }, 'Calculating wallet score');

  const payments = await horizonService.getAccountPayments(accountId, 200);
  
  if (payments.length === 0) {
    logger.warn({ accountId }, 'No payments found for account');
    const emptyAssets: AssetsBreakdown = {
      inflow: { XLM: 0, USDC: 0, other: [] },
      outflow: { XLM: 0, USDC: 0, other: [] },
    };
    return {
      accountId,
      score: 0,
      risk: 'High',
      metrics: {
        totalVolumeXLM: 0,
        transactionCount: 0,
        uniqueCounterparties: 0,
        avgTransactionSize: 0,
        inflowVolume: 0,
        outflowVolume: 0,
        inflowCount: 0,
        outflowCount: 0,
        inflowScore: 0,
        outflowScore: 0,
        frequencyScore: 0,
        diversityScore: 0,
        flowStabilityScore: 0,
        volumeScore: 0,
      },
      assets: emptyAssets,
      usd: await buildUsdValuation(emptyAssets),
      lastUpdated: new Date().toISOString(),
    };
  }

  const { score, metrics } = computeScore(payments);
  const risk = classifyRisk(score);
  const assets = computeAssetsBreakdown(payments);
  const usd = await buildUsdValuation(assets);

  logger.info({ accountId, score, risk }, 'Score calculated');

  return {
    accountId,
    score,
    risk,
    metrics,
    assets,
    usd,
    lastUpdated: new Date().toISOString(),
  };
}
