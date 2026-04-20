"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TransactionData, UsdValuation } from "../../lib/scoring";

const COINGECKO_URL = "https://api.coingecko.com/api/v3/simple/price?ids=stellar&vs_currencies=usd";

// Fetch XLM price from CoinGecko (frontend fallback)
async function fetchXlmPrice(): Promise<number | null> {
  try {
    const res = await fetch(COINGECKO_URL, { signal: AbortSignal.timeout(4000) });
    if (!res.ok) return null;
    const data = (await res.json()) as { stellar?: { usd?: number } };
    return data?.stellar?.usd ?? null;
  } catch {
    return null;
  }
}

interface FlowChartProps {
  transactions: TransactionData[];
  usd?: UsdValuation;
  isLoading?: boolean;
  className?: string;
}

// Mirror backend/src/utils/asset.ts — keep USDC detection consistent.
function classifyAsset(
  asset: string | undefined
): "XLM" | "USDC" | "OTHER" {
  if (!asset || asset === "XLM" || asset === "native") return "XLM";
  const [code] = asset.split(":");
  if (code === "USDC") return "USDC";
  return "OTHER";
}

// Convert a single transaction to a USD-comparable magnitude, or null if we
// can't price it. Never fabricate — skip unknown assets from the chart.
function txToUsd(
  tx: TransactionData & { asset?: string },
  xlmPriceUsd: number | null
): number | null {
  const kind = classifyAsset(tx.asset);
  if (kind === "USDC") return tx.amount;
  if (kind === "XLM" && xlmPriceUsd !== null) return tx.amount * xlmPriceUsd;
  return null;
}

export default function FlowChart({ transactions, usd, isLoading, className = "" }: FlowChartProps) {
  const [frontendPrice, setFrontendPrice] = useState<number | null>(null);

  // Fetch XLM price from frontend if backend didn't provide it
  useEffect(() => {
    if (!usd?.xlmPriceUsd) {
      fetchXlmPrice().then(setFrontendPrice);
    }
  }, [usd?.xlmPriceUsd]);

  if (isLoading) {
    return (
      <div
        style={{ background: "var(--card)", border: "1px solid var(--border)" }}
        className={`rounded-2xl p-6 ${className}`}
      >
        <div className="h-48 flex items-center justify-center">
          <div className="animate-pulse w-full h-32 bg-var(--surface) rounded-lg" />
        </div>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div
        style={{ background: "var(--card)", border: "1px solid var(--border)" }}
        className={`rounded-2xl p-6 text-center ${className}`}
      >
        <p style={{ color: "var(--foreground-muted)", fontSize: 14 }}>
          No transaction data available
        </p>
      </div>
    );
  }

  const xlmPrice = usd?.xlmPriceUsd ?? frontendPrice;
  const canShowUsd = xlmPrice !== null;

  const groupedByDate: Record<string, { inflow: number; outflow: number; skipped: number }> = {};

  for (const tx of transactions) {
    const bucket = (groupedByDate[tx.date] ??= { inflow: 0, outflow: 0, skipped: 0 });
    const usdValue = txToUsd(tx, xlmPrice);
    if (usdValue === null) {
      bucket.skipped += 1;
      continue;
    }
    if (tx.type === "inflow") bucket.inflow += usdValue;
    else bucket.outflow += usdValue;
  }

  const sortedDates = Object.keys(groupedByDate).sort().slice(-7);
  const maxValue = Math.max(
    ...sortedDates.map((d) => groupedByDate[d].inflow + groupedByDate[d].outflow),
    1
  );
  const totalSkipped = sortedDates.reduce((sum, d) => sum + groupedByDate[d].skipped, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ background: "var(--card)", border: "1px solid var(--border)" }}
      className={`rounded-2xl p-6 ${className}`}
    >
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h3 style={{ color: "var(--foreground)", fontWeight: 700, fontSize: 16 }}>
          7-Day Flow Pattern
        </h3>
        <span style={{ color: "var(--foreground-muted)", fontSize: 11 }}>
          {canShowUsd ? "USD (XLM + USDC) via CoinGecko" : "XLM price unavailable — showing USDC only"}
        </span>
      </div>

      <div className="flex items-end justify-between gap-2 h-40">
        {sortedDates.map((date) => {
          const { inflow, outflow } = groupedByDate[date];
          const dateLabel = date.slice(5);

          return (
            <div key={date} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full flex items-end gap-1 h-36">
                <div
                  style={{
                    height: `${(inflow / maxValue) * 100}%`,
                    background: "#22c55e",
                    borderRadius: 2,
                  }}
                  className="flex-1"
                  title={`Inflow ${date}: $${inflow.toFixed(2)}`}
                />
                <div
                  style={{
                    height: `${(outflow / maxValue) * 100}%`,
                    background: "#ef4444",
                    borderRadius: 2,
                  }}
                  className="flex-1"
                  title={`Outflow ${date}: $${outflow.toFixed(2)}`}
                />
              </div>
              <span style={{ color: "var(--foreground-dim)", fontSize: 10 }}>{dateLabel}</span>
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-6 mt-4 justify-center">
        <div className="flex items-center gap-2">
          <div style={{ width: 12, height: 12, background: "#22c55e", borderRadius: 2 }} />
          <span style={{ color: "var(--foreground-muted)", fontSize: 12 }}>Inflow</span>
        </div>
        <div className="flex items-center gap-2">
          <div style={{ width: 12, height: 12, background: "#ef4444", borderRadius: 2 }} />
          <span style={{ color: "var(--foreground-muted)", fontSize: 12 }}>Outflow</span>
        </div>
      </div>

      {totalSkipped > 0 && (
        <p
          style={{ color: "var(--foreground-dim)", fontSize: 11 }}
          className="mt-3 text-center italic"
        >
          {totalSkipped} transaction{totalSkipped === 1 ? "" : "s"} in other assets excluded — no
          reliable USD conversion available.
        </p>
      )}
    </motion.div>
  );
}
