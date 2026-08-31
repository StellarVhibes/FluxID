// Client helpers for the FluxID metrics/feedback backend.
// Mirrors lib/protocolApi.ts: reads NEXT_PUBLIC_AI_BACKEND_URL, unwraps the
// standard { success, data } envelope, and NEVER throws — every call returns a
// value or null so a missing/unreachable backend degrades gracefully.

export type EventType = "wallet_connect" | "score_run" | "contract_call" | "agent_query";

export interface UsageStats {
  totalEvents: number;
  uniqueWallets: number;
  byType: Record<string, number>;
  walletConnects: number;
  scoreRuns: number;
  firstSeen: number | null;
  lastSeen: number | null;
  recentWallets: Array<{ wallet: string; lastSeen: number; events: number }>;
}

export interface FeedbackEntry {
  wallet: string | null;
  rating: number;
  message: string;
  timestamp: number;
}

export interface FeedbackSummary {
  total: number;
  averageRating: number | null;
  ratingCounts: Record<number, number>;
  entries: FeedbackEntry[];
}

export interface SubmitFeedbackResult {
  success: boolean;
  timedOut?: boolean;
  error?: string;
}

function baseUrl(): string {
  const url = process.env.NEXT_PUBLIC_AI_BACKEND_URL || "";
  if (!url) return "/";
  return url.endsWith("/") ? url : url + "/";
}

/**
 * Fire-and-forget usage event. Best-effort: swallows every error so it can
 * never break the wallet-connect or score flow it's attached to.
 */
export async function logEvent(
  type: EventType,
  wallet?: string | null,
  network?: string | null
): Promise<void> {
  const base = baseUrl();
  try {
    await fetch(`${base}events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, wallet: wallet ?? null, network: network ?? null }),
      keepalive: true,
    });
  } catch {
    // ignore — telemetry must never surface to the user
  }
}

export async function submitFeedback(
  rating: number,
  message: string,
  wallet?: string | null
): Promise<SubmitFeedbackResult> {
  const base = baseUrl();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const res = await fetch(`${base}feedback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating, message, wallet: wallet ?? null }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    const body = (await res.json()) as { success?: boolean; error?: string };
    if (!res.ok || !body.success) {
      return { success: false, error: body.error || `HTTP ${res.status}` };
    }
    return { success: true };
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    const isTimeout =
      err instanceof Error &&
      (err.name === "AbortError" ||
        err.message.toLowerCase().includes("timeout") ||
        err.message.toLowerCase().includes("aborted"));
    return {
      success: false,
      timedOut: isTimeout,
      error: isTimeout ? "Failed to send — try again" : (err instanceof Error ? err.message : "Failed to send — try again"),
    };
  }
}

export async function fetchAdminStats(): Promise<UsageStats | null> {
  const base = baseUrl();
  try {
    const res = await fetch(`${base}admin/stats`);
    const body = (await res.json()) as { success?: boolean; stats?: UsageStats };
    if (!body.success || !body.stats) return null;
    return body.stats;
  } catch {
    return null;
  }
}

export async function fetchAdminFeedback(): Promise<FeedbackSummary | null> {
  const base = baseUrl();
  try {
    const res = await fetch(`${base}admin/feedback`);
    const body = (await res.json()) as { success?: boolean; feedback?: FeedbackSummary };
    if (!body.success || !body.feedback) return null;
    return body.feedback;
  } catch {
    return null;
  }
}
