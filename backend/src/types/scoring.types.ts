export type RiskLevel = 'Low' | 'Medium' | 'High';

export interface ScoreMetrics {
  totalVolumeXLM: number;
  transactionCount: number;
  uniqueCounterparties: number;
  avgTransactionSize: number;
  inflowVolume: number;
  outflowVolume: number;
  inflowCount: number;
  outflowCount: number;
  inflowScore: number;
  outflowScore: number;
  frequencyScore: number;
  diversityScore: number;
  flowStabilityScore: number;
  volumeScore: number;
}

export interface AssetDirectionBreakdown {
  XLM: number;
  USDC: number;
  other: Array<{ code: string; issuer?: string; label: string; amount: number; count: number }>;
}

export interface AssetsBreakdown {
  inflow: AssetDirectionBreakdown;
  outflow: AssetDirectionBreakdown;
}

export interface UsdValuation {
  inflow: number | null;
  outflow: number | null;
  xlmPriceUsd: number | null;
  priceSource: string | null;
  priceFetchedAt: string | null;
  unsupportedInflowCount: number;
  unsupportedOutflowCount: number;
  note: string;
}

export interface ScoreResult {
  accountId: string;
  score: number;
  risk: RiskLevel;
  metrics: ScoreMetrics;
  assets: AssetsBreakdown;
  usd: UsdValuation;
  lastUpdated: string;
}

export interface WalletScore {
  score: number;
  risk: RiskLevel;
  last_updated: number;
}
