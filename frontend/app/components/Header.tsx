"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useFreighter, truncateAddress } from "../context/FreighterContext";
import { Wallet, LogOut, Bell, ChevronDown, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function Header() {
  const { publicKey: address, isConnected, isLoading, connect, disconnect } = useFreighter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ 
        background: "var(--card)", 
        border: "1px solid var(--border)",
        borderRadius: 40
      }}
      className="fixed top-4 left-4 right-4 z-40 h-16"
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

        {/* Right: Notifications + Theme + Wallet */}
        <div className="flex items-center gap-2">
          {/* All in one border container */}
          <div 
            style={{ 
              background: "var(--surface)", 
              border: "1px solid var(--border)",
              borderRadius: 10
            }}
            className="flex items-center gap-1 p-1"
          >
            {/* Notification */}
            <button 
              style={{ color: "var(--foreground-muted)" }}
              className="p-2 rounded-lg hover:bg-[var(--border)] transition-colors"
            >
              <Bell size={18} />
            </button>

            {/* Theme Toggle */}
            {mounted && (
              <button 
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                style={{ color: "var(--foreground-muted)" }}
                className="p-2 rounded-lg hover:bg-[var(--border)] transition-colors"
              >
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            )}

            {/* Connect Wallet or Address */}
            {isConnected && address ? (
              <>
                <div 
                  style={{ 
                    background: "var(--card)", 
                    border: "1px solid var(--border)",
                    padding: "6px 12px",
                    borderRadius: 8
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
                    background: "var(--card)", 
                    padding: 8,
                    borderRadius: 8
                  }}
                  className="hover:bg-[var(--border)] transition-colors"
                  title="Disconnect"
                >
                  <LogOut size={16} style={{ color: "var(--foreground-muted)" }} />
                </button>
              </>
            ) : (
              <button
                onClick={connect}
                disabled={isLoading}
                className="btn btn-primary text-sm py-1.5 flex items-center gap-2 disabled:opacity-60"
              >
                <Wallet size={14} />
                {isLoading ? "..." : "Connect"}
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
}
