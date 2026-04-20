"use client";

import { motion } from "framer-motion";

export function ScoreSkeleton() {
  return (
    <div className="text-center">
      <div className="relative inline-block">
        <svg width="240" height="240" viewBox="0 0 240 240">
          <circle 
            cx="120" 
            cy="120" 
            r="100" 
            fill="none" 
            stroke="var(--border)" 
            strokeWidth="16" 
          />
          <motion.circle 
            cx="120" 
            cy="120" 
            r="100" 
            fill="none" 
            stroke="var(--primary)" 
            strokeWidth="16"
            strokeLinecap="round"
            strokeDasharray="628"
            initial={{ strokeDasharray: "0 628" }}
            animate={{ strokeDasharray: ["200 628", "400 628", "628 0"] }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0.5 }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="flex flex-col items-center gap-2"
          >
            <div className="w-8 h-8 border-2 border-t-transparent border-primary rounded-full" style={{ borderTopColor: 'transparent', animation: 'spin 1s linear infinite' }} />
            <span style={{ color: 'var(--foreground-muted)', fontSize: 12 }}>Analyzing...</span>
          </motion.div>
        </div>
      </div>
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        style={{ color: 'var(--foreground-muted)', fontSize: 13, marginTop: 16 }}
      >
        Fetching transactions and computing score
      </motion.p>
    </div>
  );
}

export function AnalyzingButton() {
  return (
    <motion.div
      animate={{ scale: [1, 1.05, 1] }}
      transition={{ duration: 1, repeat: Infinity }}
      className="flex items-center gap-2"
    >
      <motion.span
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        style={{ display: 'inline-block' }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
      </motion.span>
      Analyzing...
    </motion.div>
  );
}

export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div 
      className={`animate-pulse bg-var(--surface) rounded ${className}`}
    />
  );
}

export function CardSkeleton() {
  return (
    <div style={{ background: "var(--card)", border: "1px solid var(--border)" }} className="rounded-2xl p-6">
      <div className="animate-pulse h-6 w-32 bg-var(--surface) rounded mb-4" />
      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i}>
            <div className="animate-pulse h-4 w-20 bg-var(--surface) rounded mb-2" />
            <div className="animate-pulse h-8 w-full bg-var(--surface) rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}