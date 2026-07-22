const AI_BACKEND_URL = process.env.NEXT_PUBLIC_AI_BACKEND_URL || "";

export interface OnChainWalletInfo {
  wallet: string;
  score: number;
  risk: "Low" | "Medium" | "High";
  lastUpdated: number;
  onChain: true;
}

export interface OnChainLookupResult {
  info: OnChainWalletInfo | null;
  configured: boolean;
  error?: string;
}

export async function fetchOnChainInfo(wallet: string): Promise<OnChainLookupResult> {
  if (!AI_BACKEND_URL) {
    return { info: null, configured: false, error: "Backend URL not configured" };
  }

  try {
    const res = await fetch(`${AI_BACKEND_URL}/onchain/wallet/${wallet}`);
    const json = await res.json().catch(() => ({}));

    if (res.status === 404) {
      return { info: null, configured: true };
    }

    if (!res.ok || !json.success) {
      return { info: null, configured: true, error: json.error || `HTTP ${res.status}` };
    }

    return { info: json.data as OnChainWalletInfo, configured: true };
  } catch (err) {
    return {
      info: null,
      configured: true,
      error: err instanceof Error ? err.message : "Network error",
    };
  }
}

export interface SyncResult {
  success: boolean;
  txHash?: string;
  error?: string;
}

/**
 * Ask the backend to stamp this wallet's latest score on-chain.
 *
 * The backend is a registered oracle: it recomputes (or reuses the cached)
 * score and signs a set_score transaction with its own key, so no admin
 * approval and no user signature is needed here. The contract stores the
 * score, risk, timestamp, and a hash of the scoring inputs, and emits a
 * score_set event — a tamper-evident stamp anyone can verify or track.
 */
export async function syncOnChain(wallet: string, network: string): Promise<SyncResult> {
  if (!AI_BACKEND_URL) {
    return { success: false, error: "Backend URL not configured" };
  }
  try {
    const res = await fetch(`${AI_BACKEND_URL}/wallet/${wallet}/sync`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ network }),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok || !json.success) {
      return { success: false, error: json?.data?.error || json.error || `HTTP ${res.status}` };
    }
    return { success: true, txHash: json.data?.txHash };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Network error" };
  }
}

export function formatLastUpdated(unixSeconds: number): string {
  const ms = unixSeconds * 1000;
  const diff = Date.now() - ms;
  const mins = Math.round(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min${mins === 1 ? "" : "s"} ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days} day${days === 1 ? "" : "s"} ago`;
  return new Date(ms).toLocaleDateString();
}
