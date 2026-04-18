"use client";

import { useEffect, useState } from "react";
import { ShieldCheck, CircleDashed, AlertCircle } from "lucide-react";
import { fetchOnChainInfo, formatLastUpdated, type OnChainWalletInfo } from "../../lib/onchain";

interface Props {
  wallet: string | null;
  className?: string;
}

type State =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "verified"; info: OnChainWalletInfo }
  | { status: "missing" }
  | { status: "error"; message: string };

export default function OnChainBadge({ wallet, className = "" }: Props) {
  const [state, setState] = useState<State>({ status: "idle" });

  useEffect(() => {
    let cancelled = false;
    if (!wallet) {
      setState({ status: "idle" });
      return;
    }

    setState({ status: "loading" });
    fetchOnChainInfo(wallet).then((result) => {
      if (cancelled) return;
      if (result.error) {
        setState({ status: "error", message: result.error });
        return;
      }
      if (result.info) {
        setState({ status: "verified", info: result.info });
      } else {
        setState({ status: "missing" });
      }
    });

    return () => {
      cancelled = true;
    };
  }, [wallet]);

  if (state.status === "idle") return null;

  if (state.status === "loading") {
    return (
      <div
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs ${className}`}
        style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--foreground-muted)" }}
      >
        <CircleDashed size={12} className="animate-spin" />
        Checking on-chain…
      </div>
    );
  }

  if (state.status === "verified") {
    return (
      <div
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${className}`}
        style={{ background: "#22c55e20", border: "1px solid #22c55e", color: "#22c55e" }}
        title={`Score ${state.info.score} · ${state.info.risk} risk · on-chain`}
      >
        <ShieldCheck size={12} />
        On-chain verified · {formatLastUpdated(state.info.lastUpdated)}
      </div>
    );
  }

  if (state.status === "missing") {
    return (
      <div
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs ${className}`}
        style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--foreground-muted)" }}
        title="This wallet's score has not been published on-chain yet."
      >
        <CircleDashed size={12} />
        Not yet on-chain
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs ${className}`}
      style={{ background: "#ef444420", border: "1px solid #ef4444", color: "#ef4444" }}
      title={state.message}
    >
      <AlertCircle size={12} />
      On-chain check failed
    </div>
  );
}
