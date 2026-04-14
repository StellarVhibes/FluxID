'use client'

import { useState } from "react";
import { motion } from "framer-motion";
import { useAccount } from "wagmi";
import Image from "next/image";
import { GitCompare, TrendingUp, Wallet, AlertCircle, Activity, Plus, X } from "lucide-react";
import type { Variants } from "framer-motion";

const stagger: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
const item: Variants = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

// Mock wallet comparison data
const MOCK_WALLETS = [
  { 
    address: "GABC123XYZ...", 
    score: 78, 
    risk: "Low" as const,
    inflow: 1500,
    outflow: 800,
    frequency: 45,
    lastActivity: "2 hours ago"
  },
  { 
    address: "GDEF456UVW...", 
    score: 52, 
    risk: "Medium" as const,
    inflow: 800,
    outflow: 950,
    frequency: 28,
    lastActivity: "1 day ago"
  },
];

const COMPARISON_METRICS = [
  { key: "score", label: "Liquidity Score", icon: TrendingUp },
  { key: "inflow", label: "Total Inflow (30d)", icon: Wallet },
  { key: "outflow", label: "Total Outflow (30d)", icon: Activity },
  { key: "frequency", label: "Transaction Count", icon: Activity },
  { key: "risk", label: "Risk Level", icon: AlertCircle },
];

export default function Compare() {
  const { isConnected } = useAccount();
  const [wallets, setWallets] = useState(MOCK_WALLETS);
  const [walletInput, setWalletInput] = useState("");

  const addWallet = () => {
    if (!walletInput) return;
    setWallets([...wallets, { 
      address: walletInput.slice(0, 12) + "...", 
      score: 0, 
      risk: "Low" as const,
      inflow: 0,
      outflow: 0,
      frequency: 0,
      lastActivity: "Just now"
    }]);
    setWalletInput("");
  };

  const removeWallet = (index: number) => {
    setWallets(wallets.filter((_, i) => i !== index));
  };

  /* ── Not connected ── */
  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen pt-20 px-6 gap-5 text-center">
        <Image src="/logo.svg" alt="FluxID" width={48} height={48} />
        <h2 style={{ color: "var(--foreground)", letterSpacing: "-0.03em" }} className="text-3xl font-black">
          Compare Wallets
        </h2>
        <p style={{ color: "var(--foreground-muted)" }}>Connect your wallet to compare wallet analyses.</p>
        <appkit-button />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-5 py-8">

        {/* ── Header ── */}
        <div className="mb-8">
          <h1 style={{ color: "var(--foreground)", letterSpacing: "-0.03em" }} className="text-4xl font-black mb-2">
            Compare Wallets
          </h1>
          <p style={{ color: "var(--foreground-muted)" }} className="text-lg">
            Side-by-side comparison of wallet liquidity scores and behavior.
          </p>
        </div>

        {/* ── Add Wallet ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ background: "var(--card)", border: "1px solid var(--border)" }}
          className="rounded-2xl p-4 mb-6 flex items-center gap-3"
        >
          <input
            type="text"
            value={walletInput}
            onChange={(e) => setWalletInput(e.target.value)}
            placeholder="Enter Stellar wallet address to compare"
            className="flex-1 px-4 py-2 rounded-xl bg-background border border-white/10 focus:border-primary outline-none text-sm"
            onKeyDown={(e) => e.key === "Enter" && addWallet()}
          />
          <button onClick={addWallet} className="btn btn-primary flex items-center gap-2">
            <Plus size={14} /> Add
          </button>
        </motion.div>

        {/* ── Comparison Table ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{ background: "var(--card)", border: "1px solid var(--border)" }}
          className="rounded-2xl overflow-hidden"
        >
          {/* Header Row */}
          <div 
            className="grid gap-4 px-6 py-4"
            style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)", gridTemplateColumns: `180px repeat(${wallets.length}, 1fr)` }}
          >
            <span style={{ color: "var(--foreground-dim)", fontSize: 11, fontWeight: 600, letterSpacing: "0.04em" }} className="uppercase">
              Metric
            </span>
            {wallets.map((wallet, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wallet size={14} style={{ color: "var(--primary)" }} />
                  <span style={{ color: "var(--foreground)", fontWeight: 700, fontSize: 13 }}>{wallet.address}</span>
                </div>
                <button 
                  onClick={() => removeWallet(i)}
                  className="p-1 rounded hover:bg-[var(--surface)]"
                >
                  <X size={14} style={{ color: "var(--foreground-dim)" }} />
                </button>
              </div>
            ))}
          </div>

          {/* Metrics Rows */}
          {COMPARISON_METRICS.map((metric, rowIndex) => (
            <motion.div
              key={metric.key}
              variants={item}
              initial="hidden"
              animate="show"
              transition={{ delay: rowIndex * 0.05 }}
              className="grid gap-4 px-6 py-4 items-center border-b border-[var(--border)] last:border-b-0"
              style={{ gridTemplateColumns: `180px repeat(${wallets.length}, 1fr)` }}
            >
              {/* Label */}
              <div className="flex items-center gap-2">
                <metric.icon size={14} style={{ color: "var(--foreground-dim)" }} />
                <span style={{ color: "var(--foreground-muted)", fontSize: 13 }}>{metric.label}</span>
              </div>

              {/* Values */}
              {wallets.map((wallet, colIndex) => {
                const value = wallet[metric.key as keyof typeof wallet];
                const isScore = metric.key === "score";
                const isRisk = metric.key === "risk";

                return (
                  <div key={colIndex} className="text-center">
                    {isScore && typeof value === "number" && (
                      <span 
                        style={{ 
                          color: value >= 70 ? "#22c55e" : value >= 40 ? "#eab308" : "#ef4444",
                          fontWeight: 900,
                          fontSize: 20
                        }}
                      >
                        {value}
                      </span>
                    )}
                    {isRisk && typeof value === "string" && (
                      <span 
                        className="inline-block px-3 py-1 rounded-full text-xs font-bold"
                        style={{ 
                          background: value === "Low" ? "#22c55e20" : value === "Medium" ? "#eab30820" : "#ef444420",
                          color: value === "Low" ? "#22c55e" : value === "Medium" ? "#eab308" : "#ef4444"
                        }}
                      >
                        {value}
                      </span>
                    )}
                    {!isScore && !isRisk && (
                      <span style={{ color: "var(--foreground)", fontWeight: 700, fontSize: 16 }}>
                        {typeof value === "number" ? `$${value.toLocaleString()}` : value}
                      </span>
                    )}
                  </div>
                );
              })}
            </motion.div>
          ))}
        </motion.div>

      </div>
    </div>
  );
}