"use client";

import { motion } from "framer-motion";
import { TrendingUp, Layers, Cpu, ArrowUpRight, Zap } from "lucide-react";

const float = {
  animate: { y: [0, -8, 0] },
  transition: { duration: 3.5, repeat: Infinity, ease: "easeInOut" as const },
};
const floatAlt = {
  animate: { y: [0, -6, 0], rotate: [0, 1, 0] },
  transition: { duration: 4.2, repeat: Infinity, ease: "easeInOut" as const, delay: 0.8 },
};

export default function HeroIllustration() {
  return (
    <div className="relative w-full h-[420px] select-none pointer-events-none">

      {/* Background grid faint lines */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.06]" viewBox="0 0 400 420">
        {Array.from({ length: 9 }).map((_, i) => (
          <line key={`v${i}`} x1={i * 50} y1="0" x2={i * 50} y2="420" stroke="#8FA828" strokeWidth="1"/>
        ))}
        {Array.from({ length: 9 }).map((_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 52} x2="400" y2={i * 52} stroke="#8FA828" strokeWidth="1"/>
        ))}
      </svg>

      {/* Central hook mark — large watermark */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      >
        <svg width="180" height="180" viewBox="0 0 44 44" fill="none">
          <line x1="12" y1="12" x2="28" y2="30" stroke="#8FA828" strokeWidth="2" strokeLinecap="round" opacity="0.25"/>
          <path d="M32 12 L22 22 L22 28 C22 32 17.5 33.5 15 31" stroke="#8FA828" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.25"/>
          <circle cx="12" cy="30" r="2.8" fill="#C8BFA2" opacity="0.18"/>
        </svg>
      </motion.div>

      {/* Float card 1 — Vault yield */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, ...float.animate }}
        transition={{ ...float.transition, delay: 0.2 }}
        style={{ background: "var(--card)", border: "1px solid var(--border-strong)", top: "14%", left: "4%" }}
        className="absolute rounded-2xl px-4 py-3 w-48 shadow-xl"
      >
        <div className="flex items-center gap-2 mb-2">
          <div style={{ background: "var(--primary-muted)", borderRadius: 8 }} className="w-7 h-7 flex items-center justify-center">
            <TrendingUp size={13} color="#8FA828" />
          </div>
          <span className="label">ERC-4626 Vault</span>
        </div>
        <div style={{ color: "var(--primary)", fontWeight: 900, fontSize: 22, letterSpacing: "-0.03em" }}>
          12.4% APY
        </div>
        <div style={{ color: "var(--foreground-muted)", fontSize: 11, marginTop: 2 }}>
          Base · WETH vault
        </div>
      </motion.div>

      {/* Float card 2 — Uniswap v4 fees */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, ...floatAlt.animate }}
        transition={{ ...floatAlt.transition, delay: 0.4 }}
        style={{ background: "var(--card)", border: "1px solid var(--border-strong)", top: "10%", right: "2%"  }}
        className="absolute rounded-2xl px-4 py-3 w-46 shadow-xl"
      >
        <div className="flex items-center gap-2 mb-2">
          <div style={{ background: "rgba(200,191,162,0.08)", borderRadius: 8 }} className="w-7 h-7 flex items-center justify-center">
            <Zap size={13} color="#C8BFA2" />
          </div>
          <span className="label">Swap Fees</span>
        </div>
        <div style={{ color: "var(--accent)", fontWeight: 900, fontSize: 22, letterSpacing: "-0.03em" }}>
          +4.1%
        </div>
        <div style={{ color: "var(--foreground-muted)", fontSize: 11, marginTop: 2 }}>
          Uniswap v4 hook
        </div>
      </motion.div>

      {/* Float card 3 — AI strategy */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: [0, -6, 0] }}
        transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
        style={{ background: "var(--card)", border: "1px solid var(--border-strong)", bottom: "16%", left: "8%" }}
        className="absolute rounded-2xl px-4 py-3 w-52 shadow-xl"
      >
        <div className="flex items-center gap-2 mb-2">
          <div style={{ background: "var(--primary-muted)", borderRadius: 8 }} className="w-7 h-7 flex items-center justify-center">
            <Cpu size={13} color="#8FA828" />
          </div>
          <span className="label">AI Strategy</span>
        </div>
        <div style={{ color: "var(--foreground)", fontWeight: 700, fontSize: 13, lineHeight: 1.4 }}>
          Rebalancing vault allocation for optimal fee capture
        </div>
        <div className="flex items-center gap-1 mt-2">
          <span style={{ background: "var(--primary-muted)", color: "var(--primary)", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 999 }}>
            ACTIVE
          </span>
        </div>
      </motion.div>

      {/* Float card 4 — Total stacked */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: [0, -7, 0] }}
        transition={{ duration: 4.0, repeat: Infinity, ease: "easeInOut", delay: 1.0 }}
        style={{ background: "var(--card)", border: "1px solid rgba(143,168,40,0.28)", bottom: "12%", right: "4%" }}
        className="absolute rounded-2xl px-4 py-3 w-44 shadow-xl"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="label">Total Stacked</span>
          <ArrowUpRight size={12} color="#8FA828" />
        </div>
        <div style={{ color: "var(--primary)", fontWeight: 900, fontSize: 24, letterSpacing: "-0.03em" }}>
          16.5%
        </div>
        <div style={{ color: "var(--foreground-muted)", fontSize: 11 }}>
          Vault + Hook APY
        </div>
        {/* Mini bar */}
        <div style={{ background: "var(--border)", borderRadius: 999, height: 4, marginTop: 8 }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "75%" }}
            transition={{ delay: 1.2, duration: 1, ease: "easeOut" }}
            style={{ background: "var(--primary)", borderRadius: 999, height: "100%" }}
          />
        </div>
      </motion.div>

      {/* Float card 5 — Protocol layers badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1, y: [0, -5, 0] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: 1.4 }}
        style={{ background: "var(--surface)", border: "1px solid var(--border)", top: "50%", left: "38%", transform: "translateY(-50%)" }}
        className="absolute rounded-xl px-3 py-2 flex items-center gap-2"
      >
        <Layers size={14} color="#C8BFA2" />
        <span style={{ color: "var(--accent)", fontSize: 12, fontWeight: 700 }}>VultHook v1</span>
      </motion.div>
    </div>
  );
}
