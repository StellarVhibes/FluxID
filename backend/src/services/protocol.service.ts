import type { NetworkType } from '../config/stellar.config.js';
import { getAllScoreHistory, type ScoreHistoryEntry } from './history.service.js';

export type RiskLevel = 'Low' | 'Medium' | 'High';

const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;

function latestPerWallet(entries: ScoreHistoryEntry[]): Map<string, ScoreHistoryEntry> {
  const map = new Map<string, ScoreHistoryEntry>();
  for (const e of entries) {
    const existing = map.get(e.wallet);
    if (!existing || e.timestamp > existing.timestamp) map.set(e.wallet, e);
  }
  return map;
}

function distributionOf(entries: ScoreHistoryEntry[]): Record<RiskLevel, number> {
  const dist: Record<RiskLevel, number> = { Low: 0, Medium: 0, High: 0 };
  for (const e of entries) dist[e.risk]++;
  return dist;
}

function avgScore(entries: ScoreHistoryEntry[]): number {
  if (entries.length === 0) return 0;
  const sum = entries.reduce((s, e) => s + e.score, 0);
  return sum / entries.length;
}

export interface ProtocolHealth {
  generatedAt: string;
  network: NetworkType;
  windowHours: number;
  totalWallets: number;
  avgScore: number;
  distribution: { low: number; medium: number; high: number };
  lowRiskPct: number;
  highRiskAlerts: number;
  delta: {
    avgScore: number | null;
    totalWallets: number | null;
    lowRiskPct: number | null;
    highRiskAlerts: number | null;
  };
}

export async function getHealthMetrics(
  network: NetworkType,
  windowHours = 24 * 30
): Promise<ProtocolHealth> {
  const now = Date.now();
  const windowStart = now - windowHours * HOUR_MS;
  const priorStart = windowStart - windowHours * HOUR_MS;

  const all = await getAllScoreHistory({ network });
  const inWindow = all.filter((e) => e.timestamp >= windowStart);
  const inPrior = all.filter((e) => e.timestamp >= priorStart && e.timestamp < windowStart);

  const currentLatest = Array.from(latestPerWallet(inWindow).values());
  const priorLatest = Array.from(latestPerWallet(inPrior).values());

  const dist = distributionOf(currentLatest);
  const total = currentLatest.length;
  const lowRiskPct = total > 0 ? (dist.Low / total) * 100 : 0;
  const avg = avgScore(currentLatest);

  const priorDist = distributionOf(priorLatest);
  const priorTotal = priorLatest.length;
  const priorLowPct = priorTotal > 0 ? (priorDist.Low / priorTotal) * 100 : null;
  const priorAvg = priorTotal > 0 ? avgScore(priorLatest) : null;

  return {
    generatedAt: new Date(now).toISOString(),
    network,
    windowHours,
    totalWallets: total,
    avgScore: Number(avg.toFixed(1)),
    distribution: { low: dist.Low, medium: dist.Medium, high: dist.High },
    lowRiskPct: Number(lowRiskPct.toFixed(1)),
    highRiskAlerts: dist.High,
    delta: {
      avgScore: priorAvg === null ? null : Number((avg - priorAvg).toFixed(1)),
      totalWallets: priorTotal === 0 ? null : total - priorTotal,
      lowRiskPct: priorLowPct === null ? null : Number((lowRiskPct - priorLowPct).toFixed(1)),
      highRiskAlerts: priorTotal === 0 ? null : dist.High - priorDist.High,
    },
  };
}

export interface Cohort {
  id: string;
  name: string;
  count: number;
  color: string;
  description: string;
}

const VOLATILITY_THRESHOLD = 15;
const STEADY_MIN_OBSERVATIONS = 2;

export async function getCohorts(network: NetworkType): Promise<{ network: NetworkType; cohorts: Cohort[] }> {
  const all = await getAllScoreHistory({ network });
  const byWallet = new Map<string, ScoreHistoryEntry[]>();
  for (const e of all) {
    const arr = byWallet.get(e.wallet) ?? [];
    arr.push(e);
    byWallet.set(e.wallet, arr);
  }

  let highTrust = 0;
  let steady = 0;
  let volatile = 0;
  let dormant = 0;
  const now = Date.now();

  for (const [, entries] of byWallet) {
    entries.sort((a, b) => b.timestamp - a.timestamp);
    const latest = entries[0];

    if (latest.score >= 75) highTrust++;

    if (entries.length >= STEADY_MIN_OBSERVATIONS && entries.every((e) => e.risk === 'Low')) {
      steady++;
    }

    if (entries.length >= 2) {
      const scores = entries.map((e) => e.score);
      const range = Math.max(...scores) - Math.min(...scores);
      if (range >= VOLATILITY_THRESHOLD) volatile++;
    }

    if (now - latest.timestamp > 7 * DAY_MS) dormant++;
  }

  const cohorts: Cohort[] = [
    {
      id: 'high-trust',
      name: 'High Trust',
      count: highTrust,
      color: 'var(--primary)',
      description: 'Wallets currently scoring 75 or above.',
    },
    {
      id: 'steady-earners',
      name: 'Steady Earners',
      count: steady,
      color: '#22c55e',
      description: 'Multiple observations, all at Low risk.',
    },
    {
      id: 'high-volatility',
      name: 'High Volatility',
      count: volatile,
      color: '#eab308',
      description: `Score range across observations ≥ ${VOLATILITY_THRESHOLD}.`,
    },
    {
      id: 'dormant',
      name: 'Dormant Wallets',
      count: dormant,
      color: 'var(--foreground-dim)',
      description: 'No score updates in the last 7 days.',
    },
  ];

  return { network, cohorts };
}

export interface RiskBand {
  name: string;
  risk: number;
  activity: number;
  walletCount: number;
  avgScore: number;
}

const SCORE_BANDS: { label: string; min: number; max: number }[] = [
  { label: '0–20', min: 0, max: 20 },
  { label: '20–40', min: 20, max: 40 },
  { label: '40–60', min: 40, max: 60 },
  { label: '60–80', min: 60, max: 80 },
  { label: '80–100', min: 80, max: 101 },
];

export async function getRiskHeatmap(
  network: NetworkType
): Promise<{ network: NetworkType; bands: RiskBand[] }> {
  const all = await getAllScoreHistory({ network });
  const latest = Array.from(latestPerWallet(all).values());

  const buckets = SCORE_BANDS.map((b) => {
    const inBand = latest.filter((e) => e.score >= b.min && e.score < b.max);
    const bandAvg = avgScore(inBand);
    return { band: b, count: inBand.length, bandAvg };
  });

  const maxCount = Math.max(1, ...buckets.map((b) => b.count));

  const bands: RiskBand[] = buckets
    .filter((b) => b.count > 0)
    .map((b) => ({
      name: `Score ${b.band.label}`,
      risk: Math.round(100 - b.bandAvg),
      activity: Math.round((b.count / maxCount) * 100),
      walletCount: b.count,
      avgScore: Number(b.bandAvg.toFixed(1)),
    }));

  return { network, bands };
}

export interface ProtocolAlert {
  id: string;
  title: string;
  desc: string;
  severity: 'Low' | 'Medium' | 'High';
  generatedAt: string;
}

export async function getAlerts(
  network: NetworkType,
  lookbackHours = 24
): Promise<{ network: NetworkType; alerts: ProtocolAlert[] }> {
  const now = Date.now();
  const windowStart = now - lookbackHours * HOUR_MS;
  const priorStart = windowStart - lookbackHours * HOUR_MS;
  const generatedAt = new Date(now).toISOString();

  const all = await getAllScoreHistory({ network });
  const current = all.filter((e) => e.timestamp >= windowStart);
  const prior = all.filter((e) => e.timestamp >= priorStart && e.timestamp < windowStart);

  const alerts: ProtocolAlert[] = [];
  if (current.length === 0) {
    return { network, alerts };
  }

  const currentLatest = Array.from(latestPerWallet(current).values());
  const priorLatest = Array.from(latestPerWallet(prior).values());

  // Detection 1: avg score drop
  const currentAvg = avgScore(currentLatest);
  if (priorLatest.length > 0) {
    const priorAvg = avgScore(priorLatest);
    const drop = priorAvg - currentAvg;
    if (drop >= 5) {
      const severity: ProtocolAlert['severity'] = drop >= 10 ? 'High' : 'Medium';
      alerts.push({
        id: `avg-drop-${windowStart}`,
        title: 'Protocol Health Shift',
        desc: `Average liquidity score dropped ${drop.toFixed(1)} points in the last ${lookbackHours}h (from ${priorAvg.toFixed(1)} to ${currentAvg.toFixed(1)}).`,
        severity,
        generatedAt,
      });
    }
  }

  // Detection 2: % of wallets newly classified High
  const priorRiskByWallet = new Map<string, RiskLevel>();
  for (const e of priorLatest) priorRiskByWallet.set(e.wallet, e.risk);

  let newlyHigh = 0;
  let comparable = 0;
  for (const e of currentLatest) {
    const prev = priorRiskByWallet.get(e.wallet);
    if (!prev) continue;
    comparable++;
    if (prev !== 'High' && e.risk === 'High') newlyHigh++;
  }

  if (comparable > 0) {
    const pct = (newlyHigh / comparable) * 100;
    if (pct >= 10) {
      const severity: ProtocolAlert['severity'] = pct >= 15 ? 'High' : 'Medium';
      alerts.push({
        id: `risk-spike-${windowStart}`,
        title: 'Anomalous Risk Shift Detected',
        desc: `${pct.toFixed(0)}% of tracked wallets dropped into High risk within the last ${lookbackHours}h.`,
        severity,
        generatedAt,
      });
    }
  }

  // Detection 3: drop below score 50
  let droppedBelow50 = 0;
  const priorScoreByWallet = new Map<string, number>();
  for (const e of priorLatest) priorScoreByWallet.set(e.wallet, e.score);
  for (const e of currentLatest) {
    const prev = priorScoreByWallet.get(e.wallet);
    if (prev === undefined) continue;
    if (prev >= 50 && e.score < 50) droppedBelow50++;
  }
  if (comparable > 0 && droppedBelow50 > 0) {
    const pct = (droppedBelow50 / comparable) * 100;
    if (pct >= 10) {
      alerts.push({
        id: `score-50-${windowStart}`,
        title: 'Trust Erosion Warning',
        desc: `${pct.toFixed(0)}% of tracked wallets fell below a score of 50 in the last ${lookbackHours}h.`,
        severity: pct >= 20 ? 'High' : 'Medium',
        generatedAt,
      });
    }
  }

  return { network, alerts };
}
