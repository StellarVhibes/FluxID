"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useFreighter, truncateAddress } from "../context/FreighterContext";
import { Wallet, LogOut, Bell, ChevronDown } from "lucide-react";

export default function Header() {
  const { publicKey: address, isConnected, disconnect } = useFreighter();

  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ 
        background: "var(--card)", 
        border: "1px solid var(--border)",
        borderRadius: 40
      }}
      className="fixed top-6 left-6 right-6 z-40 h-20"
    >
      <div className="h-full max-w-[1600px] mx-auto px-6 flex items-center justify-between">
        {/* Left: Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <Image 
              src="/fluxID-logo.png" 
              alt="FluxID" 
              width={52} 
              height={52}
            />
            <span style={{ fontSize: 22, fontWeight: 700, letterSpacing: "0.04em" }}>
              <span style={{ color: "#8FA828" }}>Flux</span>
              <span style={{ color: "var(--foreground)" }}>ID</span>
            </span>
          </Link>
        </div>

        {/* Right: Notifications + Wallet */}
        <div className="flex items-center gap-4">
          <button 
            style={{ color: "var(--foreground-muted)" }}
            className="p-2 rounded-lg hover:bg-[var(--surface)] transition-colors"
          >
            <Bell size={18} />
          </button>

          {isConnected && address ? (
            <div className="flex items-center gap-2">
              <div 
                style={{ 
                  background: "var(--surface)", 
                  border: "1px solid var(--border)",
                  padding: "6px 12px",
                  borderRadius: 10
                }}
                className="flex items-center gap-2"
              >
                <Wallet size={14} style={{ color: "var(--primary)" }} />
                <span style={{ color: "var(--foreground)", fontSize: 13, fontWeight: 600 }}>
                  {truncateAddress(address)}
                </span>
                <ChevronDown size={14} style={{ color: "var(--foreground-muted)" }} />
              </div>
              <button
                onClick={disconnect}
                style={{ 
                  background: "var(--surface)", 
                  padding: 8,
                  borderRadius: 10
                }}
                className="hover:bg-[var(--border)] transition-colors"
                title="Disconnect"
              >
                <LogOut size={16} style={{ color: "var(--foreground-muted)" }} />
              </button>
            </div>
          ) : (
            <button className="btn btn-primary text-sm py-2">
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    </motion.header>
  );
}
