# FluxID

**Liquidity Identity Layer on Stellar — Turn any wallet into a real-time financial identity.**

---

## Overview

FluxID is a liquidity intelligence layer built on Stellar that turns any wallet into a real-time financial identity.

Instead of just showing balances or transaction history, FluxID looks at how money behaves — how it flows in, flows out, and how stable that flow is over time.

At its core, FluxID does one thing:

It turns wallet behavior into a simple, explainable trust score.

The goal is simple: help people and platforms understand how financially reliable a wallet is, not just how much it holds.

---

## What FluxID Really Is

FluxID is not just an app or a dashboard.

It is a decision layer.

It answers one simple question:

“Can this wallet be trusted financially?”

Instead of guessing, platforms can:

- Query a wallet’s behavior
- Get a trust score
- Understand why that score exists
- Make decisions instantly

---

## Core Product Principle

FluxID can analyze any wallet address without requiring ownership.

This means:

- No login required
- No wallet connection required
- No permission needed

Wallet connection exists only for:

- Convenience (auto-fill)
- Future identity features

Not for access.

---

## Problem

Both traditional finance and crypto miss something critical:

They track what you have, but not how you behave financially.

Because of this:

- Freelancers struggle to prove reliability
- Payments get delayed due to lack of trust
- Cross-border transactions carry uncertainty
- Credit systems are slow, fragmented, or unavailable

In Web3:

- Wallets are anonymous
- Reputation is fragmented
- No standard trust layer exists

So trust becomes guesswork.

---

## Solution

FluxID introduces a Liquidity Identity — a dynamic score based on financial behavior.

It analyzes:

- Income consistency
- Spending patterns
- Transaction frequency
- Flow stability

And produces:

- Liquidity Score (0–100)
- Risk Level (Low / Medium / High)
- Score Breakdown (inflow, outflow, frequency)
- Key Risk Factors
- Human-readable insights
- Actionable suggestions

---

## Explainability (Core Differentiator)

FluxID does not just output a score.

It explains it.

For every wallet, users can see:

- Why the score was given
- What patterns were detected
- A breakdown of contributing factors
- Transaction flow over time

This ensures:

- Transparency
- Trust
- Immediate understanding

---

## Why On-Chain Storage Matters

While scoring is computed off-chain for speed and flexibility, storing results on-chain provides:

- Verifiability → Scores can be independently checked
- Portability → Any app can read the same trust signal
- Transparency → No hidden or mutable backend logic

This makes the smart contract the **source of truth**, while the backend remains the **computation engine**.

---

## Agentic AI Integration (X402 Payments)

FluxID is designed for AI agents that can pay and act autonomously.

### Problem

AI agents can make decisions but cannot natively pay for APIs.

### Solution

FluxID integrates an X402-style payment flow:

- Agent requests score
- API returns 402 Payment Required
- Agent pays using Stellar (XLM / USDC)
- Request is retried automatically
- Score is returned

This enables:

- Pay-per-request intelligence
- Autonomous financial decision systems

---

## Real Use Cases

FluxID is infrastructure — not just a product.

### Lending Platforms

- Score = 82 → Approve loan
- Score = 34 → Reduce or reject

### Freelance Platforms

- Consistent inflow + stable spending → Reliable user

### Remittance Apps

- Detect behavior patterns → Suggest better allocation

### Marketplaces

- Trusted users → Enable flexible payments

---

## MVP Features

### Core Features

- Address-based wallet analysis (primary flow)
- Optional wallet connection (Freighter)
- Transaction fetch via Stellar Horizon

- Rule-based scoring engine:
  - Inflow consistency
  - Outflow stability
  - Transaction frequency

- Dashboard:
  - Liquidity score
  - Risk level
  - Score breakdown
  - Key factors
  - Flow visualization
  - Insights & suggestions

---

## Demo Flow

### Analyze Any Wallet (Primary)

1. Enter wallet address
2. Click “Analyze”
3. System fetches transactions
4. Score is computed

Dashboard displays:

- Score
- Risk level
- Breakdown
- Factors
- Flow graph
- Insights
- Suggestions

---

### Analyze Your Wallet (Optional)

1. Connect wallet
2. Address auto-fills
3. Analysis runs

---

## API Design

FluxID is API-first.
`GET /score/{wallet}`

Returns:

- Score
- Risk
- Breakdown
- Factors
- Insights
- Suggestions

---

## AI Layer (Explainability)

FluxID uses a hybrid model:

- Rule-based engine → scoring logic (deterministic)
- AI models → explanations, reasoning, suggestions

This ensures:

- Consistent scoring
- Clear explanations
- Better usability

---

## Tech Stack

### Blockchain

- Stellar SDK (JavaScript)
- Soroban (optional layer)

### Backend

- Node.js (scoring engine)

### Frontend

- Next.js
- TypeScript
- Tailwind CSS

### Wallet

- Freighter Wallet

---

## Project Structure

FluxID/
├── smartcontract/ # Soroban smart contracts
├── frontend/ # Next.js PWA frontend
├── docs/ # Development guides & issue trackers
└── README.md # This file

---

## Getting Started

### Prerequisites

- Node.js v18+
- Rust & Cargo (for Soroban)
- Freighter Wallet

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Smart Contracts

```bash
cd smartcontract
cargo build

```

## Documentation

./docs/ISSUES-SMARTCONTRACT.md
./docs/ISSUES-FRONTEND.md
./docs/ISSUES-BACKEND-AI.md

---

---

## Post-MVP Roadmap

### Overview

After MVP, FluxID evolves from:

- **Scoring one wallet**

to:

- **Understanding entire user bases**

> **Protocol Intelligence Layer**

FluxID becomes a system for analyzing groups of wallets using trust scores.

---

### 1. User-Base Health Dashboard

Platforms can monitor overall user quality.

- Average score
- Distribution (Low / Medium / High)
- Score trends over time
- Risk concentration

---

### 2. Cohort & Segmentation Engine

Query wallets based on behavior.

**Examples:**

- Score > threshold
- Monthly inflow > threshold
- Interaction with contracts

**Used for:**

- Lead generation
- Risk filtering
- User targeting

---

### 3. Risk Heatmaps

Understand where risk is concentrated.

- High-risk clusters
- Risky counterparties
- Transaction relationships

---

### 4. Early Warning System

Detect sudden changes in risk.

- Score drops
- Risk spikes
- Behavioral anomalies

**Example:**

> "12% of users dropped below score 50 in 24 hours"

---

### 5. AI Agent Layer

Enable autonomous systems to:

- Query scores
- Make decisions
- Pay per request (X402)

---

## Vision

FluxID is building a new primitive:

> **Liquidity Identity**

A real-time, behavior-based trust layer for financial systems.

---

## Naming

| Type    | Name                     |
| ------- | ------------------------ |
| Product | FluxID                   |
| Concept | Liquidity Identity Layer |

---

## Maintainers

Project maintained by @bbkenny and @xqcxx

//////
