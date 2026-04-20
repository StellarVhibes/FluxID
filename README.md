# FluxID

**Liquidity Identity Layer on Stellar — Turn any wallet into a real-time financial identity.**

[![Stellar](https://img.shields.io/badge/Built%20on-Stellar-14B48E)](https://stellar.org)
[![AI](https://img.shields.io/badge/AI-Anthropic%20Claude-orange)](https://anthropic.com/)
[![Hackathon](https://img.shields.io/badge/Hackathon-Stellar--Hub-blueviolet)]()

---

## Overview

FluxID is a liquidity intelligence layer built on **Stellar** that turns any wallet into a real-time financial identity.

Instead of just showing balances, FluxID analyzes **how money behaves** — inflow patterns, outflow stability, transaction frequency, and flow consistency — and produces a simple, explainable trust score.

> **The Problem:** Traditional finance and crypto both track what you have, but not how you behave financially. Trust becomes guesswork.
> 
> **FluxID's Solution:** A dynamic Liquidity Identity — analyze any Stellar wallet address without permission, get a 0-100 trust score with risk level, and understand why through AI-generated insights.

---

## Architecture

```mermaid
graph TD
    User((User)) -->|enter address| IB[Input Bar]
    IB -->|analyze| FE[Frontend Next.js]
    
    subgraph "Backend - Scoring Engine"
        FE -->|API request| BE[Backend Node.js]
        BE -->|fetch transactions| HR[Horizon API]
        HR -->|payments| BE
        BE -->|score + analyze| AI[Claude AI]
        AI -->|insights| BE
    end
    
    BE -->|score + insights| FE
    FE -->|display| Dashboard
    
    subgraph "Optional On-Chain"
        BE -->|publish score| SC[Soroban Contract]
    end
```

---

## Stellar Integration

FluxID is built natively on **Stellar** for all blockchain operations.

### Horizon API — Transaction Fetching

| Function | What It Does |
|----------|-------------|
| [`getPayments()`](https://github.com/StellarVhibes/FluxID/blob/main/backend/src/services/horizon.service.ts#L36) | Fetches wallet payments via Horizon API |
| [`getAccountTransactions()`](https://github.com/StellarVhibes/FluxID/blob/main/backend/src/services/horizon.service.ts#L85) | Full transaction history |
| [Swap filtering](https://github.com/StellarVhibes/FluxID/blob/main/backend/src/services/horizon.service.ts#L62) | Excludes self-swaps from inflow/outflow |

### Freighter Wallet — Connection

| Function | What It Does |
|----------|-------------|
| [`useFreighter()`](https://github.com/StellarVhibes/FluxID/blob/main/frontend/app/context/FreighterContext.tsx#L189) | Wallet connection hook |
| [`connect()`](https://github.com/StellarVhibes/FluxID/blob/main/frontend/app/context/FreighterContext.tsx#L27) | Connect to Freighter |
| [Sign payment](https://github.com/StellarVhibes/FluxID/blob/main/frontend/lib/agentDemo.ts#L10) | Agent payment signing |

### Soroban — On-Chain Storage (Optional)

| Contract | What It Does |
|----------|-------------|
| [Score storage](https://github.com/StellarVhibes/FluxID/blob/main/backend/src/routes/contract.routes.ts#L35) | Store scores on-chain |
| [Get score](https://github.com/StellarVhibes/FluxID/blob/main/backend/src/routes/contract.routes.ts#L71) | Read from contract |

---

## AI Integration

FluxID uses **Anthropic Claude** for explainable behavior insights.

### Claude AI — Behavior Analysis

| Function | What It Does |
|----------|-------------|
| [`explainBehavior()`](https://github.com/StellarVhibes/FluxID/blob/main/backend/src/services/explainability/llm.ts#L10) | Claude Haiku integration |
| [`getExplanation()`](https://github.com/StellarVhibes/FluxID/blob/main/backend/src/services/explainability/index.ts#L8) | Entry point for AI |
| [Score + AI](https://github.com/StellarVhibes/FluxID/blob/main/backend/src/routes/score.routes.ts#L66) | Combined score + AI response |

**What Claude Analyzes:**
- Inflow/outflow consistency
- Transaction patterns over time
- Volume trends
- Risk factors
- Asset diversity

**Response:**
```json
{
  "insight": "This wallet shows consistent incoming payments...",
  "suggestions": ["Increase transaction frequency", "Diversify counterparties"]
}
```

---

## Agentic AI — X402 Payments

FluxID enables AI agents to **pay for intelligence** using Stellar.

### Payment Flow

| Step | What Happens |
|------|------------|
| 1. Request | Agent requests `/paid/score/{wallet}` |
| 2. 402 Response | [`HTTP 402 Payment Required`](https://github.com/StellarVhibes/FluxID/blob/main/backend/src/routes/paid.routes.ts#L184) |
| 3. Payment | Agent pays XLM via Freighter |
| 4. Verify | [On-chain verification](https://github.com/StellarVhibes/FluxID/blob/main/backend/src/services/payment.service.ts#L92) |
| 5. Score | Return score after payment |

### Agent Demo

Live demo showing AI agent:
- [Requesting score](https://github.com/StellarVhibes/FluxID/blob/main/frontend/lib/agentDemo.ts#L69)
- [Signing payment](https://github.com/StellarVhibes/FluxID/blob/main/frontend/lib/agentDemo.ts#L58)
- [Polling for result](https://github.com/StellarVhibes/FluxID/blob/main/frontend/lib/agentDemo.ts#L145)

---

## Core Features

| Feature | Description |
|---------|------------|
| Address-based analysis | Analyze any wallet without permission |
| Liquidity Score | 0-100 trust score |
| Risk Level | Low / Medium / High |
| Flow breakdown | Inflows, outflows, swaps tracked separately |
| Behavior insights | AI-generated explanation |
| Suggestions | Actionable recommendations |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Blockchain | Stellar (Horizon + Soroban) |
| Backend | Node.js + Fastify |
| Frontend | Next.js + TypeScript |
| AI | Anthropic Claude (Haiku) |
| Wallet | Freighter |
| Styling | Tailwind CSS |

---

## Project Structure

```
FluxID/
├── frontend/           # Next.js PWA
│   ├── app/
│   │   ├── dashboard/   # Main analysis
│   │   ├── analytics/  # Flow charts
│   │   ├── transactions/ # History
│   │   ├── insights/   # AI explanations
│   │   └── agent/     # Agent demo
│   ├── components/     # UI components
│   └── lib/          # Scoring + agent
├── backend/           # Node.js scoring
│   ├── src/
│   │   ├── routes/     # API endpoints
│   │   ├── services/   # Horizon + AI
│   │   └── utils/     # Scoring
├── smartcontract/     # Soroban contracts
└── docs/            # Documentation
```

---

## Getting Started

```bash
# Frontend
cd frontend && npm install && npm run dev

# Backend  
cd backend && npm install && npm run dev
```

---

## Key Links

- [Frontend](https://github.com/StellarVhibes/FluxID/tree/main/frontend)
- [Backend](https://github.com/StellarVhibes/FluxID/tree/main/backend)
- [Smart Contracts](https://github.com/StellarVhibes/FluxID/tree/main/smartcontract)

---

*Built on Stellar by @bbkenny*