"use client";

import { useCallback, useEffect, useState } from "react";
import { ShieldCheck, UploadCloud, Loader2 } from "lucide-react";
import {
  fetchOnChainInfo,
  syncOnChain,
  formatLastUpdated,
  type OnChainWalletInfo,
} from "../../lib/onchain";
import { useToast } from "./Toast";

interface Props {
  wallet: string | null;
  network: string;
}

// Shows the on-chain stamp for a wallet and lets anyone push the latest score
// on-chain. The write itself is signed by the backend oracle — the user just
// asks for it, no wallet signature or admin role required.
export default function OnChainSync({ wallet, network }: Props) {
  const { showToast } = useToast();
  const [info, setInfo] = useState<OnChainWalletInfo | null>(null);
  const [syncing, setSyncing] = useState(false);

  const load = useCallback(async () => {
    if (!wallet) return;
    const result = await fetchOnChainInfo(wallet);
    setInfo(result.info);
  }, [wallet]);

  useEffect(() => {
    let active = true;
    if (wallet) {
      fetchOnChainInfo(wallet).then((result) => {
        if (active) setInfo(result.info);
      });
    }
    return () => {
      active = false;
    };
  }, [wallet]);

  const handleSync = async () => {
    if (!wallet || syncing) return;
    setSyncing(true);
    const result = await syncOnChain(wallet, network);
    setSyncing(false);
    if (result.success) {
      showToast("Score saved on-chain", "success");
      await load();
    } else {
      showToast(result.error || "Could not save on-chain", "error");
    }
  };

  if (!wallet) return null;

  // On-chain writes are only wired up on testnet for now — the contract isn't
  // deployed to mainnet yet. Rather than let the click fail with a raw
  // "Contract not configured" from the backend, disable the button on mainnet
  // and say why. Flip this on once MAINNET_CONTRACT_ID + oracle key exist.
  const isMainnet = network.toLowerCase() === "mainnet";

  return (
    <div className="inline-flex items-center gap-2 flex-wrap">
      {info && (
        <span
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
          style={{ background: "#22c55e20", border: "1px solid #22c55e", color: "#22c55e" }}
          title={`Score ${info.score} · ${info.risk} risk · on-chain`}
        >
          <ShieldCheck size={12} />
          On-chain verified · {formatLastUpdated(info.lastUpdated)}
        </span>
      )}
      {isMainnet ? (
        <span
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
          style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--foreground-dim)" }}
          title="The FluxID scoring contract is currently deployed on testnet. Switch the network to testnet to save a score on-chain."
        >
          <ShieldCheck size={12} />
          On-chain save · testnet only
        </span>
      ) : (
        <button
          onClick={handleSync}
          disabled={syncing}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors disabled:opacity-60"
          style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--foreground-muted)" }}
          title="Sign and store this score on the Soroban contract (signed by the FluxID oracle)"
        >
          {syncing ? <Loader2 size={12} className="animate-spin" /> : <UploadCloud size={12} />}
          {syncing ? "Saving…" : info ? "Update on-chain" : "Save on-chain"}
        </button>
      )}
    </div>
  );
}
