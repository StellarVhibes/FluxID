"use client";

import { motion } from "framer-motion";
import { FlowSummary as FlowSummaryType } from "../../lib/scoring";
import { ArrowDownLeft, ArrowUpRight, Activity, DollarSign } from "lucide-react";

interface FlowSummaryProps {
  data: FlowSummaryType | null;
  isLoading?: boolean;
  className?: string;
}

export default function FlowSummary({ data, isLoading, className = "" }: FlowSummaryProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="animate-pulse h-24 bg-var(--surface) rounded-xl" />
        ))}
      </div>
    );
  }

  if (!data) return null;

  const stats = [
    { 
      label: "Total Inflow", 
      value: `$${data.totalInflow.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, 
      icon: ArrowDownLeft, 
      color: "#22c55e" 
    },
    { 
      label: "Total Outflow", 
      value: `$${data.totalOutflow.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, 
      icon: ArrowUpRight, 
      color: "#ef4444" 
    },
    { 
      label: "Transactions", 
      value: data.transactionCount.toString(), 
      icon: Activity, 
      color: "var(--primary)" 
    },
    { 
      label: "Avg Transaction", 
      value: `$${data.averageTransaction.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, 
      icon: DollarSign, 
      color: "var(--foreground)" 
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          style={{ background: "var(--card)", border: "1px solid var(--border)" }}
          className="rounded-xl p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <stat.icon size={14} style={{ color: stat.color }} />
            <span style={{ color: "var(--foreground-muted)", fontSize: 11, fontWeight: 600 }} className="uppercase">
              {stat.label}
            </span>
          </div>
          <p style={{ color: stat.color, fontWeight: 900, fontSize: 20 }}>
            {stat.value}
          </p>
        </motion.div>
      ))}
    </div>
  );
}