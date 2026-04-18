'use client'

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useFreighter, truncateAddress } from "../context/FreighterContext";
import { analyzeWallet, getSuggestions, WalletAnalysis } from "../../lib/scoring";
import FlowChart from "../components/FlowChart";
import FlowSummary from "../components/FlowSummary";
import { ScoreSkeleton } from "../components/Skeletons";
import Onboarding from "../components/Onboarding";
import { useToast } from "../components/Toast";
import AnimatedScore from "../components/AnimatedScore";
import OnChainBadge from "../components/OnChainBadge";
import { Layers, Wallet, TrendingUp, AlertCircle, RefreshCw, AlertTriangle, Info } from "lucide-react";

const STELLAR_ADDRESS_RE = /^G[A-Z2-7]{55}$/;
function isValidStellarAddress(addr: string): boolean {
  return STELLAR_ADDRESS_RE.test(addr.trim());
}

import type { Variants } from "framer-motion";

const item: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

export default function Dashboard() {
  const { publicKey: address, isConnected, isLoading: isConnecting, error: freighterError, connect } = useFreighter();
  const { showToast } = useToast();
  const [analyzeAddress, setAnalyzeAddress] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<WalletAnalysis | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [analyzedAddress, setAnalyzedAddress] = useState<string | null>(null);

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem("fluxid_onboarding_seen");
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    }
  }, []);

  const handleCloseOnboarding = () => {
    setShowOnboarding(false);
    localStorage.setItem("fluxid_onboarding_seen", "true");
  };

  const trimmedInput = analyzeAddress.trim();
  const inputLooksLikeAddress = trimmedInput.length > 0;
  const inputIsValid = isValidStellarAddress(trimmedInput);
  const showInvalidWarning = inputLooksLikeAddress && !inputIsValid;

  const handleAnalyze = async () => {
    if (!inputIsValid) {
      setAnalysisError("Enter a valid Stellar address (starts with G, 56 chars).");
      return;
    }

    setIsAnalyzing(true);
    setAnalysisError(null);
    try {
      const result = await analyzeWallet(trimmedInput);
      setAnalysis(result);
      setAnalyzedAddress(trimmedInput);
      setSuggestions(getSuggestions(result.score, result.metrics));
      showToast(`Score loaded: ${result.score.score}/100`, "success");
    } catch (err) {
      setAnalysisError(err instanceof Error ? err.message : "Analysis failed. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleUseMyWallet = async () => {
    if (isConnected && address) {
      setAnalyzeAddress(address);
      return;
    }
    await connect();
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 style={{ color: "var(--foreground)", letterSpacing: "-0.03em" }} className="text-3xl font-black mb-2">
          Liquidity Score
        </h1>
        <p style={{ color: "var(--foreground-muted)", fontSize: 14 }}>
          Enter any Stellar wallet address to see its liquidity score and risk profile.
        </p>
        {analyzedAddress && (
          <p style={{ color: "var(--foreground-dim)", fontSize: 13 }} className="mt-1">
            Analyzing: {truncateAddress(analyzedAddress)}
          </p>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ background: "var(--card)", border: "1px solid var(--border)" }}
        className="rounded-2xl p-6 mb-8"
      >
        <div className="flex gap-3">
          <input
            type="text"
            value={analyzeAddress}
            onChange={(e) => setAnalyzeAddress(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && inputIsValid && !isAnalyzing) handleAnalyze();
            }}
            placeholder="Enter Stellar wallet address (G...)"
            spellCheck={false}
            autoComplete="off"
            className="flex-1 px-4 py-3 rounded-xl bg-background border border-white/10 focus:border-primary outline-none text-sm font-mono"
          />
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !inputIsValid}
            className="btn btn-primary flex items-center gap-2"
          >
            {isAnalyzing ? <RefreshCw size={16} className="animate-spin" /> : <TrendingUp size={16} />}
            {isAnalyzing ? "Analyzing..." : "Analyze"}
          </button>
        </div>

        {showInvalidWarning && (
          <p style={{ color: "#eab308", fontSize: 12 }} className="mt-2 flex items-center gap-1">
            <AlertTriangle size={12} />
            Invalid address format. Stellar addresses start with G and are 56 characters long.
          </p>
        )}

        <div className="mt-3 flex items-center justify-between flex-wrap gap-2">
          <button
            onClick={handleUseMyWallet}
            disabled={isConnecting}
            style={{ color: "var(--primary)", fontSize: 13 }}
            className="text-sm flex items-center gap-1 hover:underline disabled:opacity-60"
          >
            <Wallet size={13} />
            {isConnected && address
              ? `Use my wallet (${truncateAddress(address)})`
              : isConnecting
                ? "Connecting…"
                : "Connect Freighter to autofill your address"}
          </button>
          <span
            style={{ color: "var(--foreground-dim)", fontSize: 11 }}
            className="flex items-center gap-1"
          >
            <Info size={11} />
            No signature needed — scoring uses public on-chain data.
          </span>
        </div>

        {freighterError && (
          <p style={{ color: "#ef4444", fontSize: 12 }} className="mt-2">
            {freighterError}
          </p>
        )}
      </motion.div>

      {analysisError && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ background: "#ef444420", border: "1px solid #ef4444" }}
          className="rounded-2xl p-4 mb-6 flex items-center gap-3"
        >
          <AlertTriangle size={18} style={{ color: "#ef4444" }} />
          <p style={{ color: "#ef4444", fontSize: 14 }}>{analysisError}</p>
          <button 
            onClick={handleAnalyze}
            style={{ marginLeft: "auto", color: "var(--primary)", fontSize: 13 }}
            className="text-sm font-bold"
          >
            Try Again
          </button>
        </motion.div>
      )}

      {isAnalyzing && (
        <div className="mb-8">
          <ScoreSkeleton />
        </div>
      )}

      {analysis && !isAnalyzing && (
        <>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center mb-8"
          >
            <div className="relative inline-block mb-6">
              <svg width="240" height="240" viewBox="0 0 240 240">
                <circle cx="120" cy="120" r="100" fill="none" stroke="var(--border)" strokeWidth="16" />
                <circle 
                  cx="120" cy="120" r="100" 
                  fill="none" 
                  stroke={analysis.score.riskLevel === "Low" ? "#22c55e" : analysis.score.riskLevel === "Medium" ? "#eab308" : "#ef4444"}
                  strokeWidth="16"
                  strokeLinecap="round"
                  strokeDasharray={`${(analysis.score.score / 100) * 628} 628`}
                  transform="rotate(-90 120 120)"
                  style={{ transition: "stroke-dasharray 1s ease" }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <AnimatedScore 
                  value={analysis.score.score} 
                  style={{ color: "var(--foreground)", fontWeight: 900, fontSize: 64 }}
                />
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 mb-8 flex-wrap">
              <span
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold"
                style={{
                  background: analysis.score.riskLevel === "Low" ? "#22c55e20" : analysis.score.riskLevel === "Medium" ? "#eab30820" : "#ef444420",
                  color: analysis.score.riskLevel === "Low" ? "#22c55e" : analysis.score.riskLevel === "Medium" ? "#eab308" : "#ef4444"
                }}
              >
                <AlertCircle size={16} />
                {analysis.score.riskLevel} Risk
              </span>
              <OnChainBadge wallet={analyzedAddress} />
            </div>
          </motion.div>

          <FlowSummary data={analysis.flowSummary} isLoading={isAnalyzing} className="mb-6" />

          <FlowChart transactions={analysis.transactions} isLoading={isAnalyzing} className="mb-6" />

          <motion.div
            variants={item}
            initial="hidden"
            animate="show"
            style={{ background: "var(--card)", border: "1px solid var(--border)" }}
            className="rounded-2xl p-6 mb-6"
          >
            <h3 style={{ color: "var(--foreground)", fontWeight: 700, fontSize: 16 }} className="mb-4">
              Score Breakdown
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Inflow Consistency", value: analysis.score.factors.inflowConsistency },
                { label: "Outflow Stability", value: analysis.score.factors.outflowStability },
                { label: "Transaction Frequency", value: analysis.score.factors.transactionFrequency },
              ].map((factor, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-2">
                    <span style={{ color: "var(--foreground-muted)", fontSize: 12 }}>{factor.label}</span>
                    <span style={{ color: "var(--foreground)", fontWeight: 700, fontSize: 14 }}>{factor.value}%</span>
                  </div>
                  <div style={{ background: "var(--surface)", borderRadius: 4 }} className="h-2">
                    <div 
                      style={{ 
                        width: `${factor.value}%`, 
                        background: factor.value >= 70 ? "#22c55e" : factor.value >= 40 ? "#eab308" : "#ef4444",
                        borderRadius: 4
                      }}
                      className="h-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {(analysis.aiInsight || (analysis.aiSuggestions?.length ?? 0) > 0) && (
            <motion.div
              variants={item}
              initial="hidden"
              animate="show"
              style={{ background: "var(--card)", border: "1px solid var(--primary)" }}
              className="rounded-2xl p-6 mb-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <h3 style={{ color: "var(--foreground)", fontWeight: 700, fontSize: 16 }}>
                  AI Insight
                </h3>
                <span
                  style={{
                    background: "var(--primary)",
                    color: "var(--background)",
                    fontSize: 10,
                    fontWeight: 700,
                    padding: "2px 8px",
                    borderRadius: 999,
                  }}
                >
                  AI
                </span>
              </div>
              {analysis.aiInsight && (
                <p style={{ color: "var(--foreground)", fontSize: 14, lineHeight: 1.55 }} className="mb-3">
                  {analysis.aiInsight}
                </p>
              )}
              {analysis.aiSuggestions && analysis.aiSuggestions.length > 0 && (
                <ul className="space-y-2">
                  {analysis.aiSuggestions.map((s, i) => (
                    <li
                      key={i}
                      style={{ color: "var(--foreground-muted)", fontSize: 13 }}
                      className="flex gap-2"
                    >
                      <span style={{ color: "var(--primary)" }}>→</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>
          )}

          {suggestions.length > 0 && (
            <motion.div
              variants={item}
              initial="hidden"
              animate="show"
              style={{ background: "var(--card)", border: "1px solid var(--border)" }}
              className="rounded-2xl p-6"
            >
              <h3 style={{ color: "var(--foreground)", fontWeight: 700, fontSize: 16 }} className="mb-4">
                Rule-based Insights
              </h3>
              <div className="space-y-3">
                {suggestions.map((suggestion, i) => (
                  <p key={i} style={{ color: "var(--foreground-muted)", fontSize: 14 }}>
                    {suggestion}
                  </p>
                ))}
              </div>
            </motion.div>
          )}
        </>
      )}

      {!analysis && !isAnalyzing && (
        <div className="text-center py-12">
          <Layers size={48} style={{ color: "var(--primary)", margin: "0 auto 16px" }} />
          <h3 style={{ color: "var(--foreground)", fontWeight: 800, fontSize: 20 }} className="mb-2">
            Score any Stellar wallet
          </h3>
          <p style={{ color: "var(--foreground-muted)", fontSize: 14 }} className="max-w-md mx-auto">
            Paste an address above to get its liquidity score, risk level, and flow breakdown.
            Wallet connection is optional — the score is computed from public on-chain history.
          </p>
        </div>
      )}

      <Onboarding isOpen={showOnboarding} onClose={handleCloseOnboarding} />
    </div>
  );
}
