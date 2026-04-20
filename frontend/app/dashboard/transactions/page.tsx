"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowDownLeft, ArrowUpRight, Activity, Filter, ArrowLeftRight } from "lucide-react";
import { useAnalysis } from "../context/AnalysisContext";
import { truncateAddress } from "../../context/FreighterContext";
import type { TransactionData } from "../../../lib/scoring";

type DirectionFilter = "all" | "inflow" | "outflow" | "swap";

function formatAmount(amount: number): string {
  return amount.toLocaleString(undefined, { maximumFractionDigits: 4 });
}

function assetLabel(asset: string): string {
  if (!asset || asset === "XLM" || asset === "native") return "XLM";
  const [code, issuer] = asset.split(":");
  if (code === "USDC") return "USDC";
  return issuer ? `${code}` : code;
}

export default function TransactionsPage() {
  const { analysis, analyzedAddress, isAnalyzing } = useAnalysis();
  const [filter, setFilter] = useState<DirectionFilter>("all");

  const txs: TransactionData[] = analysis?.transactions ?? [];

  const filtered = useMemo(() => {
    if (filter === "all") return txs;
    return txs.filter((t) => t.type === filter);
  }, [txs, filter]);

  const stats = useMemo(() => {
    const inCount = txs.filter((t) => t.type === "inflow").length;
    const outCount = txs.filter((t) => t.type === "outflow").length;
    const swapCount = txs.filter((t) => t.type === "swap").length;
    return { inCount, outCount, swapCount, total: txs.length };
  }, [txs]);

  return (
    <>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 style={{ color: "var(--foreground)", fontWeight: 800, fontSize: 28 }} className="mb-1">
            Transactions
          </h1>
          <p style={{ color: "var(--foreground-muted)", fontSize: 14 }}>
            {analyzedAddress
              ? "Complete transaction history for this wallet"
              : "Analyze a wallet to see its transactions."}
          </p>
        </div>
      </div>

      {isAnalyzing && (
        <div style={{ background: "var(--card)", border: "1px solid var(--border)" }} className="rounded-2xl p-6 text-center">
          <p style={{ color: "var(--foreground-muted)", fontSize: 14 }}>Loading transactions…</p>
        </div>
      )}

      {!isAnalyzing && !analysis && (
        <div style={{ background: "var(--card)", border: "1px solid var(--border)" }} className="rounded-2xl p-8 text-center">
          <Activity size={32} style={{ color: "var(--foreground-muted)", margin: "0 auto 12px" }} />
          <p style={{ color: "var(--foreground-muted)", fontSize: 14 }}>
            No wallet analyzed yet. Paste an address above to see its transactions here.
          </p>
        </div>
      )}

      {analysis && !isAnalyzing && (
        <>
          <div className="grid grid-cols-4 gap-4 mb-6">
            <StatCard label="Total" value={stats.total} color="var(--foreground)" />
            <StatCard label="Inflows" value={stats.inCount} color="#22c55e" />
            <StatCard label="Outflows" value={stats.outCount} color="#ef4444" />
            <StatCard label="Swaps" value={stats.swapCount} color="#8FA828" />
          </div>

          <div
            style={{ background: "var(--card)", border: "1px solid var(--border)" }}
            className="rounded-2xl overflow-hidden"
          >
            <div
              className="flex items-center justify-between px-5 py-3"
              style={{ borderBottom: "1px solid var(--border)" }}
            >
              <span style={{ color: "var(--foreground-muted)", fontSize: 12 }} className="flex items-center gap-1.5">
                <Filter size={12} /> {filtered.length} transaction{filtered.length === 1 ? "" : "s"}
              </span>
              <div
                style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10 }}
                className="flex items-center p-0.5"
              >
                {(["all", "inflow", "outflow", "swap"] as DirectionFilter[]).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    style={{
                      background: filter === f ? "var(--primary)" : "transparent",
                      color: filter === f ? "var(--background)" : "var(--foreground-muted)",
                      fontSize: 11,
                      fontWeight: 700,
                    }}
                    className="px-3 py-1.5 rounded-md uppercase transition-colors"
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="p-8 text-center">
                <p style={{ color: "var(--foreground-muted)", fontSize: 13 }}>
                  No transactions matching the filter.
                </p>
              </div>
            ) : (
              <div className="max-h-[60vh] overflow-y-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ color: "var(--foreground-muted)", fontSize: 11 }}>
                      <th className="text-left px-5 py-3 font-semibold uppercase">Date</th>
                      <th className="text-left px-5 py-3 font-semibold uppercase">Direction</th>
                      <th className="text-left px-5 py-3 font-semibold uppercase">Counterparty</th>
                      <th className="text-right px-5 py-3 font-semibold uppercase">Amount</th>
                      <th className="text-right px-5 py-3 font-semibold uppercase">Asset</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((tx, i) => (
                      <motion.tr
                        key={tx.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: Math.min(i * 0.01, 0.3) }}
                        style={{ borderTop: "1px solid var(--border)" }}
                      >
                        <td className="px-5 py-3" style={{ color: "var(--foreground-muted)", fontSize: 12 }}>
                          {tx.date}
                        </td>
                        <td className="px-5 py-3">
                          {tx.type === "inflow" ? (
                            <span style={{ color: "#22c55e" }} className="inline-flex items-center gap-1 text-xs font-semibold">
                              <ArrowDownLeft size={12} /> IN
                            </span>
                          ) : tx.type === "outflow" ? (
                            <span style={{ color: "#ef4444" }} className="inline-flex items-center gap-1 text-xs font-semibold">
                              <ArrowUpRight size={12} /> OUT
                            </span>
                          ) : (
                            <span style={{ color: "#8FA828" }} className="inline-flex items-center gap-1 text-xs font-semibold">
                              <ArrowLeftRight size={12} /> SWAP
                            </span>
                          )}
                        </td>
                        <td
                          className="px-5 py-3 font-mono"
                          style={{ color: "var(--foreground-muted)", fontSize: 12 }}
                          title={tx.address}
                        >
                          {truncateAddress(tx.address)}
                        </td>
                        <td
                          className="px-5 py-3 text-right font-semibold"
                          style={{
                            color: tx.type === "inflow" ? "#22c55e" : tx.type === "outflow" ? "#ef4444" : "#8FA828"
                          }}
                        >
                          {tx.type === "swap" && tx.swapDetails ? (
                            <>
                              ⇄ {formatAmount(tx.swapDetails.fromAmount)} {tx.swapDetails.fromAsset}
                              {" → "}
                              {formatAmount(tx.swapDetails.toAmount)} {tx.swapDetails.toAsset.split(":")[0]}
                            </>
                          ) : (
                            <>
                              {tx.type === "inflow" ? "+" : "−"}
                              {formatAmount(tx.amount)}
                            </>
                          )}
                        </td>
                        <td className="px-5 py-3 text-right" style={{ color: "var(--foreground-muted)", fontSize: 12 }}>
                          {tx.type === "swap" ? "—" : assetLabel(tx.asset)}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div
      style={{ background: "var(--card)", border: "1px solid var(--border)" }}
      className="rounded-xl p-4"
    >
      <p style={{ color: "var(--foreground-muted)", fontSize: 11, fontWeight: 600 }} className="uppercase mb-1">
        {label}
      </p>
      <p style={{ color, fontSize: 24, fontWeight: 900 }}>{value}</p>
    </div>
  );
}
