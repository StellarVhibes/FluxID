"use client";

import { motion } from "framer-motion";
import { TransactionData } from "../../lib/scoring";

interface FlowChartProps {
  transactions: TransactionData[];
  isLoading?: boolean;
  className?: string;
}

export default function FlowChart({ transactions, isLoading, className = "" }: FlowChartProps) {
  if (isLoading) {
    return (
      <div style={{ background: "var(--card)", border: "1px solid var(--border)" }} className="rounded-2xl p-6">
        <div className="h-48 flex items-center justify-center">
          <div className="animate-pulse w-full h-32 bg-var(--surface) rounded-lg" />
        </div>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div style={{ background: "var(--card)", border: "1px solid var(--border)" }} className="rounded-2xl p-6 text-center">
        <p style={{ color: "var(--foreground-muted)", fontSize: 14 }}>
          No transaction data available
        </p>
      </div>
    );
  }

  const groupedByDate: Record<string, { inflow: number; outflow: number }> = {};
  
  for (const tx of transactions) {
    if (!groupedByDate[tx.date]) {
      groupedByDate[tx.date] = { inflow: 0, outflow: 0 };
    }
    if (tx.type === "inflow") {
      groupedByDate[tx.date].inflow += tx.amount;
    } else {
      groupedByDate[tx.date].outflow += tx.amount;
    }
  }

  const sortedDates = Object.keys(groupedByDate).sort().slice(-7);
  const maxValue = Math.max(
    ...sortedDates.map(d => groupedByDate[d].inflow + groupedByDate[d].outflow),
    1
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ background: "var(--card)", border: "1px solid var(--border)" }}
      className="rounded-2xl p-6"
    >
      <h3 style={{ color: "var(--foreground)", fontWeight: 700, fontSize: 16 }} className="mb-4">
        7-Day Flow Pattern
      </h3>
      
      <div className="flex items-end justify-between gap-2 h-40">
        {sortedDates.map((date) => {
          const { inflow, outflow } = groupedByDate[date];
          const dateLabel = date.slice(5);
          
          return (
            <div key={date} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full flex gap-1 h-36">
                <div 
                  style={{ 
                    height: `${(inflow / maxValue) * 100}%`, 
                    background: "#22c55e",
                    borderRadius: 2
                  }}
                  className="flex-1"
                />
                <div 
                  style={{ 
                    height: `${(outflow / maxValue) * 100}%`, 
                    background: "#ef4444",
                    borderRadius: 2
                  }}
                  className="flex-1"
                />
              </div>
              <span style={{ color: "var(--foreground-dim)", fontSize: 10 }}>
                {dateLabel}
              </span>
            </div>
          );
        })}
      </div>
      
      <div className="flex items-center gap-6 mt-4 justify-center">
        <div className="flex items-center gap-2">
          <div style={{ width: 12, height: 12, background: "#22c55e", borderRadius: 2 }} />
          <span style={{ color: "var(--foreground-muted)", fontSize: 12 }}>Inflow</span>
        </div>
        <div className="flex items-center gap-2">
          <div style={{ width: 12, height: 12, background: "#ef4444", borderRadius: 2 }} />
          <span style={{ color: "var(--foreground-muted)", fontSize: 12 }}>Outflow</span>
        </div>
      </div>
    </motion.div>
  );
}