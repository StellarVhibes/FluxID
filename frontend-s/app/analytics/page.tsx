'use client'

import { motion } from "framer-motion";
import { useAccount } from "wagmi";
import { useUserVaults, useIsRegistered } from "@/hooks/useVaultFactory";
import { useVaultData } from "@/hooks/useUserVault";
import Image from "next/image";
import Link from "next/link";
import { formatEther } from "viem";
import { TrendingUp, Layers, DollarSign, Activity, ArrowLeft, BarChart2 } from "lucide-react";
import type { Variants } from "framer-motion";

const stagger: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const item: Variants = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.45 } } };

function fmt(val: bigint | undefined, dec = 4) {
  if (!val) return "0";
  return Number(formatEther(val)).toLocaleString(undefined, { maximumFractionDigits: dec });
}
function fmtUSD(val: bigint | undefined) {
  if (!val) return "$0.00";
  return `$${Number(formatEther(val)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
function yieldPct(total: bigint | undefined, accrued: bigint | undefined) {
  if (!total || !accrued || total === 0n) return "0.00";
  const base = Number(formatEther(total));
  const acc  = Number(formatEther(accrued));
  if (base === 0) return "0.00";
  return (((acc - base) / base) * 100).toFixed(2);
}

function VaultAnalyticsCard({ address, index }: { address: `0x${string}`; index: number }) {
  const v = useVaultData(address);

  const idle = (v.totalAssets ?? 0n) - (v.aaveBalance ?? 0n) - (v.compoundBalance ?? 0n);
  const total = Number(formatEther(v.totalAssets ?? 0n));
  const aavePct  = total > 0 ? (Number(formatEther(v.aaveBalance ?? 0n)) / total) * 100 : 0;
  const cmpPct   = total > 0 ? (Number(formatEther(v.compoundBalance ?? 0n)) / total) * 100 : 0;
  const idlePct  = Math.max(0, 100 - aavePct - cmpPct);
  const yPct     = yieldPct(v.totalAssets, v.totalAssetsAccrued);
  const yieldPositive = parseFloat(yPct) >= 0;

  return (
    <motion.div
      variants={item}
      style={{ background: "var(--card)", border: "1px solid var(--border)" }}
      className="rounded-2xl p-6 space-y-5"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div style={{ background: "var(--primary-muted)", borderRadius: 10, color: "var(--primary)" }}
               className="w-10 h-10 flex items-center justify-center font-black">
            <span style={{ color: "var(--primary)", fontWeight: 900 }}>V{index + 1}</span>
          </div>
          <div>
            <p style={{ color: "var(--foreground)", fontWeight: 800, fontSize: 15 }}>Vault {index + 1}</p>
            <p style={{ color: "var(--foreground-dim)", fontSize: 11, fontFamily: "monospace" }}>
              {address.slice(0, 8)}…{address.slice(-6)}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p style={{ color: yieldPositive ? "#22c55e" : "#ef4444", fontWeight: 900, fontSize: 18 }}>
            {yieldPositive ? "+" : ""}{yPct}%
          </p>
          <p style={{ color: "var(--foreground-dim)", fontSize: 11 }}>Yield accrued</p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Total Assets",   value: fmt(v.totalAssets),        icon: Layers },
          { label: "Total USD Value",value: fmtUSD(v.totalValueUSD),   icon: DollarSign },
          { label: "Accrued Assets", value: fmt(v.totalAssetsAccrued), icon: TrendingUp },
          { label: "Share Price",    value: fmtUSD(v.sharePriceUSD),   icon: Activity },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} style={{ background: "rgba(255,255,255,0.03)", borderRadius: 12 }} className="p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <Icon size={11} style={{ color: "var(--primary)" }} />
              <span className="label" style={{ fontSize: 10 }}>{label}</span>
            </div>
            <p style={{ color: "var(--foreground)", fontWeight: 800, fontSize: 15 }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Protocol allocation bar */}
      <div>
        <p className="label mb-2" style={{ fontSize: 10 }}>Protocol Allocation</p>
        <div className="w-full h-2.5 rounded-full overflow-hidden flex" style={{ background: "var(--border)" }}>
          {aavePct > 0 && (
            <div style={{ width: `${aavePct}%`, background: "#a855f7" }} className="h-full transition-all duration-700" />
          )}
          {cmpPct > 0 && (
            <div style={{ width: `${cmpPct}%`, background: "#22c55e" }} className="h-full transition-all duration-700" />
          )}
          {idlePct > 0 && (
            <div style={{ width: `${idlePct}%`, background: "var(--border-strong)" }} className="h-full transition-all duration-700" />
          )}
        </div>
        <div className="flex items-center gap-4 mt-2">
          <span className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: "#a855f7" }}>
            <span className="w-2 h-2 rounded-full" style={{ background: "#a855f7" }} /> Aave {aavePct.toFixed(0)}%
          </span>
          <span className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: "#22c55e" }}>
            <span className="w-2 h-2 rounded-full" style={{ background: "#22c55e" }} /> Compound {cmpPct.toFixed(0)}%
          </span>
          <span className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: "var(--foreground-dim)" }}>
            <span className="w-2 h-2 rounded-full" style={{ background: "var(--border-strong)" }} /> Idle {idlePct.toFixed(0)}%
          </span>
        </div>
      </div>

      {/* Breakdown */}
      <div className="grid grid-cols-3 gap-2 text-center">
        {[
          { label: "Aave",     value: fmt(v.aaveBalance),     color: "#a855f7" },
          { label: "Compound", value: fmt(v.compoundBalance), color: "#22c55e" },
          { label: "Idle",     value: fmt(idle > 0n ? idle : 0n), color: "var(--foreground-dim)" },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ background: "rgba(255,255,255,0.02)", borderRadius: 10 }} className="p-2">
            <p style={{ color, fontWeight: 800, fontSize: 13 }}>{value}</p>
            <p style={{ color: "var(--foreground-dim)", fontSize: 10, fontWeight: 600 }}>{label}</p>
          </div>
        ))}
      </div>

      {v.isPaused && (
        <div className="text-center py-1 rounded-lg text-xs font-bold"
             style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.2)" }}>
          VAULT PAUSED
        </div>
      )}
    </motion.div>
  );
}

export default function AnalyticsPage() {
  const { isConnected } = useAccount();
  const { data: isRegistered } = useIsRegistered();
  const { data: userVaults } = useUserVaults();

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen pt-20 px-6 gap-5 text-center">
        <Image src="/logo.svg" alt="ForgeX" width={48} height={48} />
        <h2 style={{ color: "var(--foreground)", letterSpacing: "-0.03em" }} className="text-3xl font-black">Connect your wallet</h2>
        <appkit-button />
      </div>
    );
  }

  if (!isRegistered) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen pt-20 px-6 gap-5 text-center">
        <Image src="/logo.svg" alt="ForgeX" width={48} height={48} />
        <p style={{ color: "var(--foreground-muted)" }}>You must be registered to view analytics.</p>
        <Link href="/dashboard" className="btn btn-primary">Go to Dashboard</Link>
      </div>
    );
  }

  const vaultCount = userVaults?.length ?? 0;

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-5 py-8">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
                    className="flex items-end justify-between mb-8">
          <div>
            <Link href="/dashboard" className="flex items-center gap-1.5 mb-3 text-xs font-semibold"
                  style={{ color: "var(--foreground-muted)" }}>
              <ArrowLeft size={12} /> Back to Dashboard
            </Link>
            <span className="label block mb-2">Live On-Chain Data</span>
            <h1 style={{ color: "var(--foreground)", letterSpacing: "-0.04em" }} className="text-5xl font-black">
              Analytics
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <BarChart2 size={18} style={{ color: "var(--primary)" }} />
            <span className="pill pill-primary">{vaultCount} vault{vaultCount !== 1 ? "s" : ""}</span>
          </div>
        </motion.div>

        {vaultCount === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      style={{ border: "2px dashed var(--border)", borderRadius: 20 }}
                      className="py-24 flex flex-col items-center gap-4 text-center">
            <BarChart2 size={36} style={{ color: "var(--primary)", opacity: 0.5 }} />
            <p style={{ color: "var(--foreground-muted)", fontWeight: 700 }}>No vaults to analyse yet</p>
            <Link href="/dashboard" className="btn btn-primary flex items-center gap-2">
              <Layers size={14} /> Create a Vault
            </Link>
          </motion.div>
        ) : (
          <motion.div variants={stagger} initial="hidden" animate="show"
                      className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {userVaults!.map((addr: string, i: number) => (
              <VaultAnalyticsCard key={addr} address={addr as `0x${string}`} index={i} />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
