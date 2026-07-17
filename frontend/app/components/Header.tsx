"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useFreighter, truncateAddress } from "../context/FreighterContext";
import { Wallet, LogOut, Bell, ChevronDown, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState, useRef } from "react";

export default function Header() {
  const { publicKey: address, isConnected, isLoading, connect, disconnect } = useFreighter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  // Dropdown state
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [balances, setBalances] = useState<{ xlm: string; usdc: string }>({ xlm: "...", usdc: "..." });
  const [isFetchingBalances, setIsFetchingBalances] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch balances when dropdown opens
  useEffect(() => {
    if (isDropdownOpen && address) {
      setIsFetchingBalances(true);
      fetch(`https://horizon-testnet.stellar.org/accounts/${address}`)
        .then((res) => res.json())
        .then((data) => {
          let xlm = "0.00";
          let usdc = "0.00";
          
          if (data.balances) {
            for (const b of data.balances) {
              if (b.asset_type === "native") {
                xlm = parseFloat(b.balance).toFixed(2);
              } else if (b.asset_code === "USDC") {
                usdc = parseFloat(b.balance).toFixed(2);
              }
            }
          }
          setBalances({ xlm, usdc });
        })
        .catch((err) => {
          console.error("Failed to fetch balances", err);
          setBalances({ xlm: "Error", usdc: "Error" });
        })
        .finally(() => setIsFetchingBalances(false));
    }
  }, [isDropdownOpen, address]);

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
      className="fixed top-4 left-4 right-4 z-40 h-[4.5rem]"
    >
      <div className="h-full max-w-7xl mx-auto px-6 flex items-center justify-between">
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
              <div className="flex items-center gap-2 relative" ref={dropdownRef}>
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  style={{ 
                    background: isDropdownOpen ? "var(--border)" : "var(--card)", 
                    border: "1px solid var(--border)",
                    padding: "6px 12px",
                    borderRadius: 8
                  }}
                  className="flex items-center gap-2 hover:bg-[var(--border)] transition-colors cursor-pointer"
                >
                  <Wallet size={14} style={{ color: "var(--primary)" }} />
                  <span style={{ color: "var(--foreground)", fontSize: 13, fontWeight: 600 }}>
                    {truncateAddress(address)}
                  </span>
                  <ChevronDown 
                    size={14} 
                    style={{ 
                      color: "var(--foreground-muted)", 
                      transform: isDropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.2s ease"
                    }} 
                  />
                </button>

                {/* Dropdown Panel */}
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    style={{
                      position: "absolute",
                      top: "calc(100% + 8px)",
                      right: 0,
                      background: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: 12,
                      boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
                      width: 220,
                      padding: 16,
                      zIndex: 50
                    }}
                  >
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xs font-bold uppercase tracking-wider text-[var(--foreground-muted)]">Balances</span>
                      {isFetchingBalances && <div className="w-3 h-3 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin"></div>}
                    </div>
                    
                    <div className="flex flex-col gap-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-semibold flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-[var(--foreground)]"></div>
                          XLM
                        </span>
                        <span className="text-sm font-mono">{balances.xlm}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-semibold flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-[#2775CA]"></div>
                          USDC
                        </span>
                        <span className="text-sm font-mono">{balances.usdc}</span>
                      </div>
                    </div>

                    <div className="h-[1px] w-full bg-[var(--border)] my-4"></div>

                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        disconnect();
                      }}
                      className="w-full flex items-center gap-2 justify-center text-sm font-bold text-[var(--error)] hover:bg-[var(--surface)] py-2 rounded-lg transition-colors"
                    >
                      <LogOut size={14} />
                      Disconnect
                    </button>
                  </motion.div>
                )}
              </div>
            ) : (
              <button
                onClick={connect}
                disabled={isLoading}
                className="btn btn-outline text-sm py-1.5 flex items-center gap-2 disabled:opacity-60"
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
