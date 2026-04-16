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

export interface ScoreResult {
  accountId: string;
  score: number;
  risk: RiskLevel;
  insight: string;
  suggestion: string;
  metrics: ScoreMetrics;
  lastUpdated: string;
}

export interface WalletScore {
  score: number;
  risk: RiskLevel;
  last_updated: number;
}
