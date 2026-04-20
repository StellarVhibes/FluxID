"use client";

import { useEffect, useState } from "react";
import { motion, type Variants } from "framer-motion";
import { AlertCircle, Layers, TrendingUp, TrendingDown } from "lucide-react";
import AnimatedScore from "../components/AnimatedScore";
import OnChainBadge from "../components/OnChainBadge";
import { ScoreSkeleton } from "../components/Skeletons";
import Onboarding from "../components/Onboarding";
import { useAnalysis } from "./context/AnalysisContext";

const item: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const RISK_COLORS: Record<"Low" | "Medium" | "High", string> = {
  Low: "#22c55e",
  Medium: "#eab308",
  High: "#ef4444",
};

export default function Dashboard() {
  const { analysis, analyzedAddress, isAnalyzing, error } = useAnalysis();
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("fluxid_onboarding_seen")) setShowOnboarding(true);
  }, []);

  const closeOnboarding = () => {
    setShowOnboarding(false);
    localStorage.setItem("fluxid_onboarding_seen", "true");
  };

  return (
    <>
      <h1 style={{ color: "var(--foreground)", letterSpacing: "-0.03em" }} className="text-3xl font-black mb-2">
        Liquidity Score
      </h1>
      <p style={{ color: "var(--foreground-muted)", fontSize: 14 }} className="mb-6">
        Summary view — enter any address above. Use the sidebar for full charts, transactions, and insights.
      </p>

      {error && (
        <div
          style={{ background: "#ef444420", border: "1px solid #ef4444" }}
          className="rounded-2xl p-4 mb-6 flex items-center gap-3"
        >
          <AlertCircle size={18} style={{ color: "#ef4444" }} />
          <p style={{ color: "#ef4444", fontSize: 14 }}>{error}</p>
        </div>
      )}

      {isAnalyzing && <ScoreSkeleton />}

      {analysis && !isAnalyzing && <DashboardSummary analysis={analysis} analyzedAddress={analyzedAddress} />}

      {!analysis && !isAnalyzing && !error && (
        <div className="text-center py-12">
          <Layers size={48} style={{ color: "var(--primary)", margin: "0 auto 16px" }} />
          <h3 style={{ color: "var(--foreground)", fontWeight: 800, fontSize: 20 }} className="mb-2">
            Score any Stellar wallet
          </h3>
          <p style={{ color: "var(--foreground-muted)", fontSize: 14 }} className="max-w-md mx-auto">
            Paste an address above and click Analyze. Results stay available as you switch
            between Analytics, Transactions, and Insights tabs.
          </p>
        </div>
      )}

      <Onboarding isOpen={showOnboarding} onClose={closeOnboarding} />
    </>
  );
}

function DashboardSummary({
  analysis,
  analyzedAddress,
}: {
  analysis: NonNullable<ReturnType<typeof useAnalysis>["analysis"]>;
  analyzedAddress: string | null;
}) {
  const riskColor = RISK_COLORS[analysis.score.riskLevel];
  const factors = [
    { label: "Inflow Consistency", value: analysis.score.factors.inflowConsistency },
    { label: "Outflow Stability", value: analysis.score.factors.outflowStability },
    { label: "Transaction Frequency", value: analysis.score.factors.transactionFrequency },
  ];

  // Top risk factors — lowest sub-scores (weakest signals, headline problems).
  const riskFactors = [...factors].sort((a, b) => a.value - b.value).slice(0, 2);

  // Compact flow: summarize the 14 most recent transactions into a single stacked bar per direction.
  const recent = analysis.transactions.slice(0, 14);
  const recentIn = recent.filter((t) => t.type === "inflow").length;
  const recentOut = recent.filter((t) => t.type === "outflow").length;
  const recentTotal = Math.max(recentIn + recentOut, 1);

  return (
    <motion.div initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Score + risk */}
      <motion.div
        variants={item}
        style={{ background: "var(--card)", border: "1px solid var(--border)" }}
        className="rounded-2xl p-6 md:col-span-2 flex items-center gap-6 flex-wrap"
        id="tour-score-display"
      >
        <div className="relative shrink-0">
          <svg width="160" height="160" viewBox="0 0 160 160">
            <circle cx="80" cy="80" r="66" fill="none" stroke="var(--border)" strokeWidth="12" />
            <circle
              cx="80" cy="80" r="66" fill="none"
              stroke={riskColor} strokeWidth="12" strokeLinecap="round"
              strokeDasharray={`${(analysis.score.score / 100) * 414.7} 414.7`}
              transform="rotate(-90 80 80)"
              style={{ transition: "stroke-dasharray 0.8s ease" }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <AnimatedScore
              value={analysis.score.score}
              style={{ color: "var(--foreground)", fontWeight: 900, fontSize: 40 }}
            />
          </div>
        </div>
        <div className="flex-1 min-w-[200px]">
          <div className="flex items-center gap-2 flex-wrap mb-2" id="tour-risk-indicator">
            <span
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold"
              style={{ background: `${riskColor}20`, color: riskColor }}
            >
              <AlertCircle size={12} />
              {analysis.score.riskLevel} Risk
            </span>
            <OnChainBadge wallet={analyzedAddress} />
          </div>
          {analysis.explanation?.insight && (
            <p style={{ color: "var(--foreground)", fontSize: 14, lineHeight: 1.5 }} className="mb-2">
              {analysis.explanation.insight}
            </p>
          )}
          <p style={{ color: "var(--foreground-dim)", fontSize: 11 }}>
            {analysis.metrics.transactionCount} transactions analyzed ·
            {" "}
            {analysis.explanation?.source === "llm"
              ? `AI explanation via ${analysis.explanation.model ?? "Claude"}`
              : "Rule-based explanation"}
          </p>
        </div>
      </motion.div>

      {/* Compact flow snapshot */}
      <motion.div
        variants={item}
        style={{ background: "var(--card)", border: "1px solid var(--border)" }}
        className="rounded-2xl p-6"
        id="tour-recent-flow"
      >
        <h3 style={{ color: "var(--foreground-muted)", fontSize: 11, fontWeight: 700 }} className="uppercase mb-4">
          Recent Flow
        </h3>
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <span style={{ color: "#22c55e" }} className="flex items-center gap-2">
              <TrendingDown size={14} /> Inflows
            </span>
            <span style={{ color: "var(--foreground)", fontWeight: 700 }}>{recentIn}</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--surface)" }}>
            <div
              className="h-full"
              style={{ width: `${(recentIn / recentTotal) * 100}%`, background: "#22c55e" }}
            />
          </div>
          <div className="flex items-center justify-between pt-2">
            <span style={{ color: "#ef4444" }} className="flex items-center gap-2">
              <TrendingUp size={14} /> Outflows
            </span>
            <span style={{ color: "var(--foreground)", fontWeight: 700 }}>{recentOut}</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--surface)" }}>
            <div
              className="h-full"
              style={{ width: `${(recentOut / recentTotal) * 100}%`, background: "#ef4444" }}
            />
          </div>
          <p style={{ color: "var(--foreground-dim)", fontSize: 11 }} className="pt-2">
            Last {recent.length} tx · see Analytics for full charts
          </p>
        </div>
      </motion.div>

      {/* Score breakdown */}
      <motion.div
        variants={item}
        style={{ background: "var(--card)", border: "1px solid var(--border)" }}
        className="rounded-2xl p-6 md:col-span-2"
      >
        <h3 style={{ color: "var(--foreground)", fontWeight: 700, fontSize: 16 }} className="mb-4">
          Score Breakdown
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {factors.map((f) => (
            <div key={f.label}>
              <div className="flex items-center justify-between mb-2">
                <span style={{ color: "var(--foreground-muted)", fontSize: 12 }}>{f.label}</span>
                <span style={{ color: "var(--foreground)", fontWeight: 700, fontSize: 14 }}>{f.value}%</span>
              </div>
              <div style={{ background: "var(--surface)", borderRadius: 4 }} className="h-2">
                <div
                  className="h-full"
                  style={{
                    width: `${f.value}%`,
                    background: f.value >= 70 ? "#22c55e" : f.value >= 40 ? "#eab308" : "#ef4444",
                    borderRadius: 4,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Top risk factors + suggestions */}
      <motion.div
        variants={item}
        style={{ background: "var(--card)", border: "1px solid var(--border)" }}
        className="rounded-2xl p-6"
      >
        <h3 style={{ color: "var(--foreground-muted)", fontSize: 11, fontWeight: 700 }} className="uppercase mb-3">
          Top Risk Factors
        </h3>
        <ul className="space-y-2 mb-4">
          {riskFactors.map((f) => (
            <li key={f.label} style={{ color: "var(--foreground)", fontSize: 13 }} className="flex items-center justify-between">
              <span>{f.label}</span>
              <span style={{ color: f.value < 40 ? "#ef4444" : "#eab308", fontWeight: 700 }}>
                {f.value}%
              </span>
            </li>
          ))}
        </ul>
        {analysis.explanation?.suggestions && analysis.explanation.suggestions.length > 0 && (
          <>
            <h3
              style={{ color: "var(--foreground-muted)", fontSize: 11, fontWeight: 700 }}
              className="uppercase mb-2 pt-3"
            >
              Suggestions
            </h3>
            <ul className="space-y-1">
              {analysis.explanation.suggestions.map((s, i) => (
                <li key={i} style={{ color: "var(--foreground-muted)", fontSize: 12 }} className="flex gap-2">
                  <span style={{ color: "var(--primary)" }}>→</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}
