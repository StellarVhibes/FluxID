import { Horizon } from "@stellar/stellar-sdk";

const HORIZON_URL = process.env.NEXT_PUBLIC_HORIZON_URL || "https://horizon-testnet.stellar.org";
const AI_BACKEND_URL = process.env.NEXT_PUBLIC_AI_BACKEND_URL || "";

export interface LiquidityMetrics {
  totalInflow: number;
  totalOutflow: number;
  transactionCount: number;
  inflowCount: number;
  outflowCount: number;
}

export interface LiquidityScore {
  score: number;
  riskLevel: "Low" | "Medium" | "High";
  factors: {
    inflowConsistency: number;
    outflowStability: number;
    transactionFrequency: number;
  };
}

export interface TransactionData {
  id: string;
  date: string;
  amount: number;
  type: "inflow" | "outflow";
  address: string;
}

export interface FlowSummary {
  totalInflow: number;
  totalOutflow: number;
  transactionCount: number;
  averageTransaction: number;
}

export interface WalletAnalysis {
  score: LiquidityScore;
  metrics: LiquidityMetrics;
  transactions: TransactionData[];
  flowSummary: FlowSummary;
  error?: string;
}

type PaymentRecord = {
  id: string;
  from: string;
  to: string;
  amount: string;
  asset_type: string;
  created_at: string;
  transaction_successful?: boolean;
};

export async function fetchWalletPayments(address: string, limit = 100): Promise<PaymentRecord[]> {
  const server = new Horizon.Server(HORIZON_URL);

  try {
    const response = await server
      .payments()
      .forAccount(address)
      .limit(limit)
      .order("desc")
      .call();

    return response.records as unknown as PaymentRecord[];
  } catch (error) {
    console.error("Error fetching payments:", error);
    return [];
  }
}

function parsePayments(payments: PaymentRecord[], walletAddress: string): TransactionData[] {
  const parsed: TransactionData[] = [];

  for (const p of payments) {
    if (p.transaction_successful === false) continue;
    if (p.asset_type !== "native" && !p.asset_type?.startsWith("credit_")) continue;

    const amount = parseFloat(p.amount) || 0;
    const isOutflow = p.from === walletAddress;

    parsed.push({
      id: p.id,
      date: new Date(p.created_at).toISOString().split("T")[0],
      amount,
      type: isOutflow ? "outflow" : "inflow",
      address: isOutflow ? p.to : p.from,
    });
  }

  return parsed.slice(0, 30);
}

export function calculateLiquidityMetrics(payments: PaymentRecord[], walletAddress: string): LiquidityMetrics {
  let totalInflow = 0;
  let totalOutflow = 0;
  let inflowCount = 0;
  let outflowCount = 0;

  for (const p of payments) {
    if (p.transaction_successful === false) continue;
    if (p.asset_type !== "native" && !p.asset_type?.startsWith("credit_")) continue;

    const amount = parseFloat(p.amount) || 0;
    if (p.from === walletAddress) {
      totalOutflow += amount;
      outflowCount++;
    } else if (p.to === walletAddress) {
      totalInflow += amount;
      inflowCount++;
    }
  }

  return {
    totalInflow,
    totalOutflow,
    transactionCount: inflowCount + outflowCount,
    inflowCount,
    outflowCount,
  };
}

export function calculateFlowSummary(metrics: LiquidityMetrics): FlowSummary {
  return {
    totalInflow: metrics.totalInflow,
    totalOutflow: metrics.totalOutflow,
    transactionCount: metrics.transactionCount,
    averageTransaction:
      metrics.transactionCount > 0
        ? (metrics.totalInflow + metrics.totalOutflow) / metrics.transactionCount
        : 0,
  };
}

export function calculateLiquidityScore(metrics: LiquidityMetrics): LiquidityScore {
  const { totalInflow, totalOutflow, transactionCount, inflowCount, outflowCount } = metrics;

  if (transactionCount === 0) {
    return {
      score: 0,
      riskLevel: "High",
      factors: { inflowConsistency: 0, outflowStability: 0, transactionFrequency: 0 },
    };
  }

  const avgInflow = inflowCount > 0 ? totalInflow / inflowCount : 0;
  const inflowConsistency = Math.min(40, Math.floor(avgInflow / 100));

  const avgOutflow = outflowCount > 0 ? totalOutflow / outflowCount : 0;
  const outflowStability = Math.max(0, 30 - Math.floor(avgOutflow / 200));

  const frequencyScore = Math.min(30, Math.floor(transactionCount / 5) * 3);

  const score = inflowConsistency + outflowStability + frequencyScore;

  let riskLevel: "Low" | "Medium" | "High" = "Low";
  if (score < 40) riskLevel = "High";
  else if (score < 70) riskLevel = "Medium";

  return {
    score: Math.min(100, Math.max(0, score)),
    riskLevel,
    factors: {
      inflowConsistency,
      outflowStability,
      transactionFrequency: frequencyScore,
    },
  };
}

function localAnalyze(address: string, payments: PaymentRecord[]): WalletAnalysis {
  const metrics = calculateLiquidityMetrics(payments, address);
  const score = calculateLiquidityScore(metrics);
  const transactions = parsePayments(payments, address);
  return {
    score,
    metrics,
    transactions,
    flowSummary: calculateFlowSummary(metrics),
  };
}

type BackendScoreResponse = {
  success: boolean;
  data?: {
    score: number;
    risk: "Low" | "Medium" | "High";
    insight: string;
    suggestion: string;
    metrics: {
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
    };
  };
  error?: string;
};

async function fetchFromBackend(address: string): Promise<WalletAnalysis | null> {
  if (!AI_BACKEND_URL) return null;

  try {
    const response = await fetch(`${AI_BACKEND_URL}/score/${address}`);
    const json = (await response.json()) as BackendScoreResponse;
    if (!json.success || !json.data) return null;

    const d = json.data;
    const payments = await fetchWalletPayments(address);
    const transactions = parsePayments(payments, address);

    const metrics: LiquidityMetrics = {
      totalInflow: d.metrics.inflowVolume,
      totalOutflow: d.metrics.outflowVolume,
      transactionCount: d.metrics.transactionCount,
      inflowCount: d.metrics.inflowCount,
      outflowCount: d.metrics.outflowCount,
    };

    return {
      score: {
        score: d.score,
        riskLevel: d.risk,
        factors: {
          inflowConsistency: d.metrics.inflowScore,
          outflowStability: d.metrics.outflowScore,
          transactionFrequency: d.metrics.frequencyScore,
        },
      },
      metrics,
      transactions,
      flowSummary: calculateFlowSummary(metrics),
    };
  } catch (error) {
    console.error("Backend fetch failed:", error);
    return null;
  }
}

export async function analyzeWallet(address: string): Promise<WalletAnalysis> {
  const fromBackend = await fetchFromBackend(address);
  if (fromBackend) return fromBackend;

  const payments = await fetchWalletPayments(address);
  return localAnalyze(address, payments);
}

export function getSuggestions(score: LiquidityScore, metrics: LiquidityMetrics): string[] {
  const suggestions: string[] = [];

  if (metrics.inflowCount === 0) {
    suggestions.push("No incoming transactions detected. Consider receiving regular funds to build your score.");
  }

  if (metrics.outflowCount > metrics.inflowCount * 0.8) {
    suggestions.push("Your outflows are consistently high — consider building a reserve before making large transactions.");
  }

  if (score.riskLevel === "High") {
    suggestions.push("Your risk level is high. Focus on consistent, smaller transactions to improve reliability.");
  }

  if (metrics.transactionCount < 10) {
    suggestions.push("Increase transaction frequency to demonstrate financial activity and build your liquidity history.");
  }

  if (score.riskLevel === "Low" && suggestions.length === 0) {
    suggestions.push("Great job! Your wallet shows strong financial behavior.");
  }

  return suggestions.slice(0, 2);
}
