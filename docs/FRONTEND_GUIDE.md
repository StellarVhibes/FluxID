# Stellar Frontend Integration Guide

This guide covers how to build a modern frontend that interacts with Stellar smart contracts (Soroban). We will focus on using the **Freighter Wallet** and the **Stellar SDK**.

---

## 1. The Stack

To build a robust Stellar dApp, you'll typically use:
- **Frontend Framework:** Next.js (React) is standard.
- **Wallet Connection:** `@stellar/freighter-api`.
- **Blockchain Interaction:** `@stellar/stellar-sdk` (handles XDR encoding/decoding and RPC calls).
- **Network:** Testnet or Mainnet (during development).

---

## 2. Installation

Add the necessary packages to your project:
```bash
npm install @stellar/freighter-api @stellar/stellar-sdk
```

### 2.1 Prerequisites: Funding Your Test Wallet

Before you can send any transaction, your Freighter wallet needs testnet XLM.

1.  Open Freighter and switch to **Testnet**.
2.  Copy your wallet address.
3.  Go to the [Stellar Laboratory Account Creator](https://laboratory.stellar.org/#account-creator?network=test).
4.  Paste your address into the "Friendbot" section and click "Get Test Network XLM".

---

## 3. Wallet Connection (Freighter)

Freighter is the "MetaMask" of Stellar. You need to check if it's installed and request access.

### Hook: `useFreighter.ts`
```typescript
import { isConnected, requestAccess, setAllowed } from "@stellar/freighter-api";
import { useState, useEffect } from "react";

export function useFreighter() {
  const [address, setAddress] = useState<string>("");
  
  useEffect(() => {
    async function checkConnection() {
      const connected = await isConnected();
      if (connected) {
        const addr = await requestAccess();
        if (addr) setAddress(addr);
      }
    }
    checkConnection();
  }, []);

  const connect = async () => {
    if (!await isConnected()) {
      alert("Please install Freighter!");
      return;
    }
    const addr = await requestAccess();
    if (addr) {
      await setAllowed();
      setAddress(addr);
    }
  };

  return { address, connect };
}
```

---

## 4. Fetching Transaction History 📊

FluxID fetches transaction data from Horizon to analyze wallet behavior.

```typescript
import { Server } from "@stellar/stellar-sdk";

const HORIZON_URL = "https://horizon-testnet.stellar.org";

async function fetchTransactions(address: string) {
  const server = new Server(HORIZON_URL);
  const transactions = await server.transactions()
    .forAccount(address)
    .limit(50)
    .call();
  
  return transactions.records;
}
```

### Analyzing Liquidity Behavior

```typescript
interface LiquidityMetrics {
  totalInflow: number;
  totalOutflow: number;
  transactionCount: number;
  inflowCount: number;
  outflowCount: number;
}

function analyzeTransactions(transactions: any[]): LiquidityMetrics {
  let totalInflow = 0;
  let totalOutflow = 0;
  let inflowCount = 0;
  let outflowCount = 0;

  for (const tx of transactions) {
    // Check if transaction is a payment
    if (tx.operation_count > 0) {
      // Analyze operations for in/out flows
      // Implementation depends on specific transaction structure
    }
  }

  return {
    totalInflow,
    totalOutflow,
    transactionCount: transactions.length,
    inflowCount,
    outflowCount
  };
}
```

---

## 5. Calculating Liquidity Score 🎯

FluxID uses a rule-based scoring engine:

```typescript
interface LiquidityScore {
  score: number;        // 0-100
  riskLevel: "Low" | "Medium" | "High";
  factors: {
    inflowConsistency: number;
    outflowStability: number;
    transactionFrequency: number;
  };
}

function calculateLiquidityScore(metrics: LiquidityMetrics): LiquidityScore {
  const { totalInflow, totalOutflow, transactionCount, inflowCount, outflowCount } = metrics;
  
  // Inflow consistency (0-40 points)
  const inflowRatio = inflowCount > 0 ? totalInflow / inflowCount : 0;
  const inflowConsistency = Math.min(40, Math.floor(inflowRatio / 100));
  
  // Outflow stability (0-30 points)
  const outflowRatio = outflowCount > 0 ? totalOutflow / outflowCount : 0;
  const outflowStability = Math.max(0, 30 - Math.floor(outflowRatio / 200));
  
  // Transaction frequency (0-30 points)
  const frequencyScore = Math.min(30, Math.floor(transactionCount / 5) * 3);
  
  const score = inflowConsistency + outflowStability + frequencyScore;
  
  let riskLevel: "Low" | "Medium" | "High" = "Low";
  if (score < 40) riskLevel = "High";
  else if (score < 70) riskLevel = "Medium";
  
  return {
    score: Math.min(100, score),
    riskLevel,
    factors: { inflowConsistency, outflowStability, transactionFrequency: frequencyScore }
  };
}
```

---

## 6. Invoking Smart Contracts

Interacting with a Soroban contract involves three steps:
1.  **Build Transaction:** Create an operation to invoke the contract function.
2.  **Sign:** Request the user to sign it via Freighter.
3.  **Submit:** Send the signed transaction (XDR) to the Soroban RPC.

### Example: Query Liquidity Score from Contract

```typescript
import { 
  Contract, 
  TransactionBuilder, 
  SorobanRpc, 
  xdr, 
  TimeoutInfinite 
} from "@stellar/stellar-sdk";
import { signTransaction } from "@stellar/freighter-api";

const CONTRACT_ID = "C...";
const RPC_URL = "https://soroban-testnet.stellar.org";
const NETWORK_PASSPHRASE = "Test SDF Network ; September 2015";

async function queryLiquidityScore(userAddress: string) {
  const server = new SorobanRpc.Server(RPC_URL);
  const account = await server.getAccount(userAddress);
  
  const contract = new Contract(CONTRACT_ID);
  const tx = new TransactionBuilder(account, { 
    fee: "100", 
    networkPassphrase: NETWORK_PASSPHRASE 
  })
  .addOperation(contract.call("get_liquidity_score", [
    xdr.ScVal.scvAddress(userAddress)
  ]))
  .setTimeout(TimeoutInfinite)
  .build();

  const sim = await server.simulateTransaction(tx);
  if (!SorobanRpc.isSimulationSuccess(sim)) {
    throw new Error("Simulation failed");
  }

  const preparedTx = SorobanRpc.assembleTransaction(tx, sim);
  const signedXdr = await signTransaction(preparedTx.toXDR(), {
    networkPassphrase: NETWORK_PASSPHRASE
  });

  const result = await server.sendTransaction(
    TransactionBuilder.fromXDR(signedXdr, NETWORK_PASSPHRASE)
  );

  return result;
}
```

---

## 7. Checklist for Integration

- [ ] **Network Config:** Ensure your app points to the right RPC (Testnet vs Mainnet).
- [ ] **Passphrase:** Use the correct Network Passphrase.
- [ ] **Simulation:** ALWAYS simulate before asking the user to sign. It catches errors early and calculates gas.
- [ ] **XDR:** Familiarize yourself with Stellar's data format (XDR) if you aren't using generated bindings.

---

*Ready to build the future of financial identity on Stellar.*