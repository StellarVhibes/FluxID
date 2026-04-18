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
    const res = await fetch(`${AI_BACKEND_URL}/onchain/score/${wallet}`);
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
