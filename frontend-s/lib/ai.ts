import { AI_BACKEND_URL } from "./constants";

interface AIResponse {
  success: boolean;
  data: string;
  error?: string;
}

async function aiRequest(endpoint: string, body: Record<string, unknown>): Promise<AIResponse> {
  const res = await fetch(`${AI_BACKEND_URL}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(`AI request failed: ${res.statusText}`);
  }
  return res.json();
}

export async function getStrategyAdvice(userAddress: string, riskPreference = "balanced"): Promise<string> {
  const res = await aiRequest("/api/strategy", { user_address: userAddress, risk_preference: riskPreference });
  if (!res.success) throw new Error(res.error || "Strategy request failed");
  return res.data;
}

export async function getRiskAssessment(userAddress: string): Promise<string> {
  const res = await aiRequest("/api/risk", { user_address: userAddress });
  if (!res.success) throw new Error(res.error || "Risk assessment failed");
  return res.data;
}

export async function chatWithAI(
  message: string,
  userAddress?: string,
  history?: { role: string; content: string }[]
): Promise<string> {
  const res = await aiRequest("/api/chat", {
    message,
    user_address: userAddress || null,
    history: history || null,
  });
  if (!res.success) throw new Error(res.error || "Chat request failed");
  return res.data;
}

export async function getDashboardInsights(userAddress: string): Promise<string> {
  const res = await aiRequest("/api/insights", { user_address: userAddress });
  if (!res.success) throw new Error(res.error || "Insights request failed");
  return res.data;
}
