"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

interface FreighterContextType {
  address: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
}

const FreighterContext = createContext<FreighterContextType | undefined>(undefined);

export function FreighterProvider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connect = useCallback(async () => {
    setIsConnecting(true);
    setError(null);

    try {
      if (typeof window === "undefined") {
        throw new Error("Window not available");
      }

const freighter = await import("@stellar/freighter-api");
       
      const connected = (await freighter.isConnected()) as boolean;
      
      if (!connected) {
        throw new Error("Freighter wallet not installed. Please install Freighter to continue.");
      }

      const result = await freighter.getPublicKey() as { publicKey?: string; error?: string };
      const publicKey = result.publicKey;
      const freighterError = result.error;
      
      if (freighterError) {
        throw new Error(freighterError);
      }

      if (publicKey) {
        setAddress(publicKey);
        localStorage.setItem("fluxid_wallet_address", publicKey);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to connect wallet";
      setError(message);
      console.error("Wallet connection error:", err);
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setAddress(null);
    localStorage.removeItem("fluxid_wallet_address");
    setError(null);
  }, []);

  useEffect(() => {
    const storedAddress = localStorage.getItem("fluxid_wallet_address");
    if (storedAddress) {
      setAddress(storedAddress);
    }
  }, []);

  return (
    <FreighterContext.Provider
      value={{
        address,
        isConnected: !!address,
        isConnecting,
        error,
        connect,
        disconnect,
      }}
    >
      {children}
    </FreighterContext.Provider>
  );
}

export function useFreighter() {
  const context = useContext(FreighterContext);
  if (context === undefined) {
    throw new Error("useFreighter must be used within a FreighterProvider");
  }
  return context;
}

export function truncateAddress(address: string, start = 6, end = 4): string {
  if (!address || address.length <= start + end) return address;
  return `${address.slice(0, start)}...${address.slice(-end)}`;
}