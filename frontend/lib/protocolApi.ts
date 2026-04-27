const AI_BACKEND_URL = process.env.NEXT_PUBLIC_AI_BACKEND_URL || "";

export type ProtocolNetwork = "mainnet" | "testnet";

export interface ProtocolHealth {
  generatedAt: string;
  network: ProtocolNetwork;
  windowHours: number;
  totalWallets: number;
  avgScore: number;
  distribution: { low: number; medium: number; high: number };
  lowRiskPct: number;
  highRiskAlerts: number;
  delta: {
    avgScore: number | null;
    totalWallets: number | null;
    lowRiskPct: number | null;
    highRiskAlerts: number | null;
  };
}

export interface ProtocolCohort {
  id: string;
  name: string;
  count: number;
  color: string;
  description: string;
}

export interface ProtocolRiskBand {
  name: string;
  risk: number;
  activity: number;
  walletCount: number;
  avgScore: number;
}

export interface ProtocolAlert {
  id: string;
  title: string;
  desc: string;
  severity: "Low" | "Medium" | "High";
  generatedAt: string;
}

interface ApiEnvelope<T> {
  success: boolean;
  data?: T;
  error?: string;
}

async function getJson<T>(path: string, network?: ProtocolNetwork): Promise<T | null> {
  if (!AI_BACKEND_URL) return null;
  const url = new URL(path, AI_BACKEND_URL.endsWith("/") ? AI_BACKEND_URL : AI_BACKEND_URL + "/");
  if (network) url.searchParams.set("network", network);
  try {
    const res = await fetch(url.toString());
    const body = (await res.json()) as ApiEnvelope<T>;
    if (!body.success || !body.data) return null;
    return body.data;
  } catch {
    return null;
  }
}

export function fetchProtocolHealth(network?: ProtocolNetwork) {
  return getJson<ProtocolHealth>("protocol/health", network);
}

export function fetchProtocolCohorts(network?: ProtocolNetwork) {
  return getJson<{ network: ProtocolNetwork; cohorts: ProtocolCohort[] }>(
    "protocol/cohorts",
    network
  );
}

export function fetchProtocolRiskHeatmap(network?: ProtocolNetwork) {
  return getJson<{ network: ProtocolNetwork; bands: ProtocolRiskBand[] }>(
    "protocol/risk-heatmap",
    network
  );
}

export function fetchProtocolAlerts(network?: ProtocolNetwork) {
  return getJson<{ network: ProtocolNetwork; alerts: ProtocolAlert[] }>(
    "protocol/alerts",
    network
  );
}
