"use client";

import { motion } from "framer-motion";
import { Users, TrendingUp, AlertTriangle, Activity } from "lucide-react";

const METRICS = [
  {
    label: "Average Liquidity Score",
    value: "74.2",
    change: "+2.4%",
    trend: "up",
    icon: Activity,
    color: "var(--primary)",
  },
  {
    label: "Active Wallets Monitored",
    value: "1,284",
    change: "+124",
    trend: "up",
    icon: Users,
    color: "#3b82f6",
  },
  {
    label: "Low Risk User-Base",
    value: "68%",
    change: "-2%",
    trend: "down",
    icon: TrendingUp,
    color: "#22c55e",
  },
  {
    label: "High Risk Alerts",
    value: "12",
    change: "+3",
    trend: "up",
    icon: AlertTriangle,
    color: "#ef4444",
  },
];

export default function ProtocolMetrics() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {METRICS.map((m, i) => (
        <motion.div
          key={m.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          style={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: 20,
          }}
          className="p-5 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-4">
            <div
              style={{
                background: `${m.color}15`,
                color: m.color,
                borderRadius: 10,
              }}
              className="w-10 h-10 flex items-center justify-center"
            >
              <m.icon size={20} />
            </div>
            <span
              style={{
                color: m.trend === "up" ? "#22c55e" : "#ef4444",
                background: m.trend === "up" ? "#22c55e15" : "#ef444415",
                fontSize: 12,
                fontWeight: 700,
              }}
              className="px-2 py-0.5 rounded-full"
            >
              {m.change}
            </span>
          </div>
          <div>
            <p
              style={{ color: "var(--foreground-muted)", fontSize: 13 }}
              className="mb-1"
            >
              {m.label}
            </p>
            <h3
              style={{ color: "var(--foreground)", fontWeight: 900, fontSize: 24 }}
            >
              {m.value}
            </h3>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
