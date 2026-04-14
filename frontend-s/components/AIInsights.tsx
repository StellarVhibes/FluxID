"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { getDashboardInsights, getStrategyAdvice, getRiskAssessment } from "@/lib/ai";
import { Cpu, TrendingUp, ShieldCheck, ChevronRight, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";

type Tab = "insights" | "strategy" | "risk";

const TABS: { key: Tab; label: string; icon: React.ElementType }[] = [
  { key: "insights",  label: "Insights",  icon: TrendingUp },
  { key: "strategy",  label: "Strategy",  icon: ChevronRight },
  { key: "risk",      label: "Risk",      icon: ShieldCheck },
];

const RISK_PREFS = ["conservative", "balanced", "aggressive"] as const;

export default function AIInsights() {
  const { address } = useAccount();
  const [activeTab, setActiveTab] = useState<Tab>("insights");
  const [contents, setContents] = useState<Record<Tab, string>>({ insights: "", strategy: "", risk: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [riskPref, setRiskPref] = useState("balanced");

  const content = contents[activeTab];

  const fetchData = async (tab: Tab) => {
    if (!address) return;
    setIsLoading(true);
    setContents((prev) => ({ ...prev, [tab]: "" }));
    try {
      let result: string;
      if (tab === "insights") result = await getDashboardInsights(address);
      else if (tab === "strategy") result = await getStrategyAdvice(address, riskPref);
      else result = await getRiskAssessment(address);
      setContents((prev) => ({ ...prev, [tab]: result }));
    } catch {
      setContents((prev) => ({ ...prev, [tab]: "Unable to reach AI backend. Make sure it is running on localhost:8000." }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 20, overflow: "hidden" }}
    >
      {/* Header */}
      <div
        style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", background: "var(--surface)" }}
        className="flex items-center gap-3"
      >
        <div
          style={{ background: "var(--primary-muted)", borderRadius: 10 }}
          className="w-8 h-8 flex items-center justify-center shrink-0"
        >
          <Cpu size={15} style={{ color: "var(--primary)" }} />
        </div>
        <div>
          <p style={{ color: "var(--foreground)", fontWeight: 800, fontSize: 15 }}>ForgeX Intelligence</p>
          <p style={{ color: "var(--foreground-muted)", fontSize: 11 }}>AI-powered portfolio analysis</p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ borderBottom: "1px solid var(--border)", display: "flex" }}>
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            style={{
              flex: 1,
              padding: "10px 0",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.02em",
              transition: "all 150ms",
              borderBottom: activeTab === key ? "2px solid var(--primary)" : "2px solid transparent",
              color: activeTab === key ? "var(--primary)" : "var(--foreground-muted)",
              background: "transparent",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 5,
            }}
          >
            <Icon size={11} />
            {label}
          </button>
        ))}
      </div>

      {/* Body */}
      <div style={{ padding: 20 }}>

        {/* Risk pref selector */}
        {activeTab === "strategy" && (
          <div className="flex gap-2 mb-4">
            {RISK_PREFS.map((pref) => (
              <button
                key={pref}
                onClick={() => setRiskPref(pref)}
                style={{
                  flex: 1,
                  padding: "5px 0",
                  borderRadius: 8,
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: "capitalize",
                  cursor: "pointer",
                  transition: "all 150ms",
                  border: riskPref === pref ? "1px solid rgba(143,168,40,0.30)" : "1px solid var(--border)",
                  background: riskPref === pref ? "var(--primary-muted)" : "transparent",
                  color: riskPref === pref ? "var(--primary-hover)" : "var(--foreground-muted)",
                }}
              >
                {pref}
              </button>
            ))}
          </div>
        )}

        {/* Generate button */}
        <button
          onClick={() => fetchData(activeTab)}
          disabled={isLoading || !address}
          style={{
            width: "100%",
            padding: "10px 0",
            borderRadius: 10,
            marginBottom: 16,
            fontSize: 13,
            fontWeight: 700,
            cursor: isLoading || !address ? "not-allowed" : "pointer",
            opacity: isLoading || !address ? 0.5 : 1,
            border: "1px solid var(--border-strong)",
            background: "var(--surface)",
            color: "var(--foreground)",
            transition: "all 150ms",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 7,
          }}
          onMouseEnter={(e) => {
            if (!isLoading && address) {
              (e.target as HTMLElement).style.borderColor = "var(--primary-dark)";
              (e.target as HTMLElement).style.color = "var(--primary-hover)";
            }
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLElement).style.borderColor = "var(--border-strong)";
            (e.target as HTMLElement).style.color = "var(--foreground)";
          }}
        >
          {isLoading ? (
            <><Loader2 size={13} className="animate-spin" /> Analyzing…</>
          ) : (
            <>
              <Cpu size={13} />
              Generate {TABS.find((t) => t.key === activeTab)?.label}
            </>
          )}
        </button>

        {/* Content */}
        {isLoading && (
          <div className="space-y-2">
            {[100, 85, 92, 70].map((w, i) => (
              <div key={i} className="skeleton h-3" style={{ width: `${w}%` }} />
            ))}
          </div>
        )}

        {content && !isLoading && (
          <div
            style={{
              fontSize: 13,
              lineHeight: 1.65,
              color: "var(--foreground-muted)",
              maxHeight: 280,
              overflowY: "auto",
              padding: "2px 0",
            }}
          >
            <ReactMarkdown
              components={{
                p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                ul: ({ children }) => <ul className="list-disc pl-4 mb-2 space-y-1">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal pl-4 mb-2 space-y-1">{children}</ol>,
                li: ({ children }) => <li>{children}</li>,
                strong: ({ children }) => <strong className="font-bold" style={{ color: "var(--foreground)" }}>{children}</strong>,
                code: ({ children }) => <code className="px-1 py-0.5 rounded text-xs" style={{ background: "var(--surface)", fontFamily: "monospace" }}>{children}</code>,
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        )}

        {!content && !isLoading && (
          <p style={{ color: "var(--foreground-dim)", fontSize: 12, textAlign: "center", padding: "16px 0" }}>
            Generate AI-powered analysis of your ForgeX portfolio.
          </p>
        )}
      </div>
    </div>
  );
}
