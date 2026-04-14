'use client'

import { useState } from "react";
import { motion } from "framer-motion";
import { useAccount } from "wagmi";
import Image from "next/image";
import { TrendingUp, Layers, DollarSign, Activity, ArrowUpRight, ArrowDownLeft, Wallet, RefreshCw, BarChart2 } from "lucide-react";
import type { Variants } from "framer-motion";

const stagger: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const item: Variants = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.45 } } };

// Mock transaction data - in production would come from Horizon API
const MOCK_TRANSACTIONS = [
  { id: 1, date: "2024-04-14", amount: 150, type: "inflow", address: "G...A2B3" },
  { id: 2, date: "2024-04-13", amount: 75, type: "outflow", address: "G...C4D5" },
  { id: 3, date: "2024-04-12", amount: 200, type: "inflow", address: "G...E6F7" },
  { id: 4, date: "2024-04-11", amount: 50, type: "outflow", address: "G...G8H9" },
  { id: 5, date: "2024-04-10", amount: 300, type: "inflow", address: "G...I0J1" },
];

const MOCK_FLOW_DATA = [
  { day: "Apr 10", inflow: 300, outflow: 0 },
  { day: "Apr 11", inflow: 100, outflow: 50 },
  { day: "Apr 12", inflow: 200, outflow: 25 },
  { day: "Apr 13", inflow: 50, outflow: 75 },
  { day: "Apr 14", inflow: 150, outflow: 100 },
];

export default function Analytics() {
  const { address, isConnected } = useAccount();
  const [walletToAnalyze, setWalletToAnalyze] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const analyzeWallet = async () => {
    if (!walletToAnalyze) return;
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  // Calculate totals
  const totalInflow = MOCK_TRANSACTIONS.filter(t => t.type === "inflow").reduce((sum, t) => sum + t.amount, 0);
  const totalOutflow = MOCK_TRANSACTIONS.filter(t => t.type === "outflow").reduce((sum, t) => sum + t.amount, 0);
  const avgTransactionSize = MOCK_TRANSACTIONS.reduce((sum, t) => sum + t.amount, 0) / MOCK_TRANSACTIONS.length;
  const transactionCount = MOCK_TRANSACTIONS.length;

  /* ── Not connected ── */
  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen pt-20 px-6 gap-5 text-center">
        <Image src="/logo.svg" alt="FluxID" width={48} height={48} />
        <h2 style={{ color: "var(--foreground)", letterSpacing: "-0.03em" }} className="text-3xl font-black">
          Analytics
        </h2>
        <p style={{ color: "var(--foreground-muted)" }}>Connect your wallet to view transaction analytics.</p>
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
            Analytics
          </h1>
          <p style={{ color: "var(--foreground-muted)" }} className="text-lg">
            View transaction flow patterns and financial behavior analysis.
          </p>
        </div>

        {/* ── Wallet Input ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ background: "var(--card)", border: "1px solid var(--border)" }}
          className="rounded-2xl p-6 mb-6"
        >
          <div className="flex gap-3">
            <input
              type="text"
              value={walletToAnalyze}
              onChange={(e) => setWalletToAnalyze(e.target.value)}
              placeholder="Enter Stellar wallet address to analyze"
              className="flex-1 px-4 py-3 rounded-xl bg-background border border-white/10 focus:border-primary outline-none text-sm"
            />
            <button
              onClick={analyzeWallet}
              disabled={isLoading || !walletToAnalyze}
              className="btn btn-primary flex items-center gap-2"
            >
              {isLoading ? <RefreshCw size={14} className="animate-spin" /> : <BarChart2 size={14} />}
              {isLoading ? "Loading..." : "Analyze"}
            </button>
          </div>
        </motion.div>

        {/* ── Flow Summary Stats ── */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            variants={item}
            initial="hidden"
            animate="show"
            style={{ background: "var(--card)", border: "1px solid var(--border)" }}
            className="rounded-2xl p-5"
          >
            <div className="flex items-center gap-3 mb-3">
              <div style={{ background: "#22c55e20", borderRadius: 10 }} className="w-10 h-10 flex items-center justify-center">
                <ArrowDownLeft size={18} style={{ color: "#22c55e" }} />
              </div>
              <span style={{ color: "var(--foreground-muted)", fontSize: 12, fontWeight: 600 }}>Total Inflow</span>
            </div>
            <p style={{ color: "#22c55e", fontWeight: 900, fontSize: 28 }}>${totalInflow.toLocaleString()}</p>
          </motion.div>

          <motion.div
            variants={item}
            initial="hidden"
            animate="show"
            style={{ background: "var(--card)", border: "1px solid var(--border)" }}
            className="rounded-2xl p-5"
          >
            <div className="flex items-center gap-3 mb-3">
              <div style={{ background: "#ef444420", borderRadius: 10 }} className="w-10 h-10 flex items-center justify-center">
                <ArrowUpRight size={18} style={{ color: "#ef4444" }} />
              </div>
              <span style={{ color: "var(--foreground-muted)", fontSize: 12, fontWeight: 600 }}>Total Outflow</span>
            </div>
            <p style={{ color: "#ef4444", fontWeight: 900, fontSize: 28 }}>${totalOutflow.toLocaleString()}</p>
          </motion.div>

          <motion.div
            variants={item}
            initial="hidden"
            animate="show"
            style={{ background: "var(--card)", border: "1px solid var(--border)" }}
            className="rounded-2xl p-5"
          >
            <div className="flex items-center gap-3 mb-3">
              <div style={{ background: "var(--primary-muted)", borderRadius: 10 }} className="w-10 h-10 flex items-center justify-center">
                <DollarSign size={18} style={{ color: "var(--primary)" }} />
              </div>
              <span style={{ color: "var(--foreground-muted)", fontSize: 12, fontWeight: 600 }}>Avg Transaction</span>
            </div>
            <p style={{ color: "var(--foreground)", fontWeight: 900, fontSize: 28 }}>${avgTransactionSize.toFixed(0)}</p>
          </motion.div>

          <motion.div
            variants={item}
            initial="hidden"
            animate="show"
            style={{ background: "var(--card)", border: "1px solid var(--border)" }}
            className="rounded-2xl p-5"
          >
            <div className="flex items-center gap-3 mb-3">
              <div style={{ background: "var(--primary-muted)", borderRadius: 10 }} className="w-10 h-10 flex items-center justify-center">
                <Activity size={18} style={{ color: "var(--primary)" }} />
              </div>
              <span style={{ color: "var(--foreground-muted)", fontSize: 12, fontWeight: 600 }}>Transactions</span>
            </div>
            <p style={{ color: "var(--foreground)", fontWeight: 900, fontSize: 28 }}>{transactionCount}</p>
          </motion.div>
        </div>

        {/* ── Flow Chart ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{ background: "var(--card)", border: "1px solid var(--border)" }}
          className="rounded-2xl p-6 mb-6"
        >
          <h3 style={{ color: "var(--foreground)", fontWeight: 800, fontSize: 18 }} className="mb-4">
            5-Day Flow Pattern
          </h3>
          <div className="flex items-end justify-between gap-4 h-48">
            {MOCK_FLOW_DATA.map((day, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex gap-1 h-40">
                  <div 
                    style={{ height: `${(day.inflow / 350) * 100}%`, background: "#22c55e" }}
                    className="flex-1 rounded-t-lg opacity-80"
                  />
                  <div 
                    style={{ height: `${(day.outflow / 350) * 100}%`, background: "#ef4444" }}
                    className="flex-1 rounded-t-lg opacity-80"
                  />
                </div>
                <span style={{ color: "var(--foreground-dim)", fontSize: 10 }}>{day.day}</span>
              </div>
            ))}
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
        </motion.div>

        {/* ── Transaction History ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{ background: "var(--card)", border: "1px solid var(--border)" }}
          className="rounded-2xl p-6"
        >
          <h3 style={{ color: "var(--foreground)", fontWeight: 800, fontSize: 18 }} className="mb-4">
            Recent Transactions
          </h3>
          <div className="space-y-3">
            {MOCK_TRANSACTIONS.map((tx) => (
              <div 
                key={tx.id}
                style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
                className="rounded-xl p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div 
                    style={{ 
                      background: tx.type === "inflow" ? "#22c55e20" : "#ef444420",
                      borderRadius: 10 
                    }}
                    className="w-10 h-10 flex items-center justify-center"
                  >
                    {tx.type === "inflow" 
                      ? <ArrowDownLeft size={18} style={{ color: "#22c55e" }} />
                      : <ArrowUpRight size={18} style={{ color: "#ef4444" }} />
                    }
                  </div>
                  <div>
                    <p style={{ color: "var(--foreground)", fontWeight: 700, fontSize: 14 }}>
                      {tx.type === "inflow" ? "Received" : "Sent"}
                    </p>
                    <p style={{ color: "var(--foreground-dim)", fontSize: 12 }}>{tx.date} · {tx.address}</p>
                  </div>
                </div>
                <p style={{ 
                  color: tx.type === "inflow" ? "#22c55e" : "#ef4444", 
                  fontWeight: 800, 
                  fontSize: 16 
                }}>
                  {tx.type === "inflow" ? "+" : "-"}${tx.amount}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
}