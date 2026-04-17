import Server from "@stellar/stellar-sdk";

const HORIZON_URL = process.env.NEXT_PUBLIC_HORIZON_URL || "https://horizon-testnet.stellar.org";

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

export async function fetchWalletTransactions(address: string, limit = 50): Promise<any[]> {
  const server = new Server(HORIZON_URL);
  
  try {
    const transactions = await server.transactions()
      .forAccount(address)
      .limit(limit)
      .order("desc")
      .call();
    
    return transactions.records;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return [];
  }
}

function parseTransactions(transactions: any[], walletAddress: string): TransactionData[] {
  const parsed: TransactionData[] = [];
  
  for (const tx of transactions) {
    if (!tx.successful || tx.operation_count === 0) continue;
    
    const txDate = new Date(tx.created_at).toISOString().split('T')[0];
    const isOutflow = tx.source === walletAddress;
    
    for (const op of tx.operations) {
      if (op.type === "payment") {
        const amount = parseFloat(op.amount) || 0;
        parsed.push({
          id: tx.id,
          date: txDate,
          amount,
          type: isOutflow ? "outflow" : "inflow",
          address: isOutflow ? op.destination : op.source
        });
      }
    }
  }
  
  return parsed.slice(0, 30);
}

export function calculateLiquidityMetrics(transactions: any[], walletAddress?: string): LiquidityMetrics {
  let totalInflow = 0;
  let totalOutflow = 0;
  let inflowCount = 0;
  let outflowCount = 0;

  for (const tx of transactions) {
    if (tx.successful && tx.operation_count > 0) {
      const isOutflow = walletAddress && tx.source === walletAddress;
      
      for (const op of tx.operations) {
        if (op.type === "payment") {
          const amount = parseFloat(op.amount) || 0;
          if (isOutflow) {
            totalOutflow += amount;
            outflowCount++;
          } else if (!walletAddress || op.source !== walletAddress) {
            totalInflow += amount;
            inflowCount++;
          } else {
            totalOutflow += amount;
            outflowCount++;
          }
        }
      }
    }
  }

  return {
    totalInflow,
    totalOutflow,
    transactionCount: transactions.length,
    inflowCount,
    outflowCount
  };
}

export function calculateFlowSummary(metrics: LiquidityMetrics): FlowSummary {
  return {
    totalInflow: metrics.totalInflow,
    totalOutflow: metrics.totalOutflow,
    transactionCount: metrics.transactionCount,
    averageTransaction: metrics.transactionCount > 0 
      ? (metrics.totalInflow + metrics.totalOutflow) / metrics.transactionCount 
      : 0
  };
}

export function calculateLiquidityScore(metrics: LiquidityMetrics): LiquidityScore {
  const { totalInflow, totalOutflow, transactionCount, inflowCount, outflowCount } = metrics;
  
  if (transactionCount === 0) {
    return {
      score: 0,
      riskLevel: "High",
      factors: {
        inflowConsistency: 0,
        outflowStability: 0,
        transactionFrequency: 0
      }
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
      transactionFrequency: frequencyScore
    }
  };
}

export async function analyzeWallet(address: string): Promise<WalletAnalysis> {
  const transactions = await fetchWalletTransactions(address);
  const metrics = calculateLiquidityMetrics(transactions, address);
  const score = calculateLiquidityScore(metrics);
  const flowData = parseTransactions(transactions, address);
  
  return {
    score,
    metrics,
    transactions: flowData,
    flowSummary: calculateFlowSummary(metrics)
  };
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