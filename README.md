# FluxID

**Liquidity Identity Layer on Stellar** — Turn any wallet into a real-time financial identity.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Built on Stellar](https://img.shields.io/badge/Built%20on-Stellar-14B48E)](https://stellar.org)

---

## Overview

FluxID is a liquidity intelligence layer built on Stellar that turns any wallet into a real-time financial identity.

Instead of just showing balances or transaction history, FluxID looks at how money behaves — how it flows in, flows out, and how stable that flow is over time.

At its core, FluxID does one thing:

**It turns wallet behavior into a simple trust score.**

The goal is simple: help people and platforms understand how financially reliable a wallet is, not just how much it holds.

---

## What FluxID Really Is

FluxID is not just an app or a dashboard.

It is a **decision layer**.

It answers one simple question:

> “Can this wallet be trusted financially?”

Instead of guessing, platforms can:

- Query a wallet’s behavior
- Get a simple trust score
- Make decisions instantly

---

## Problem

Right now, both traditional finance and crypto miss something important:

They track what you have, but not how you behave financially.

Because of this:

- Freelancers struggle to prove financial reliability
- Payments get delayed due to lack of trust
- Cross-border transactions come with uncertainty
- Credit systems are slow, fragmented, or unavailable

Even in Web3:

- Wallets are anonymous
- Reputation is fragmented
- There’s no standard trust layer

So trust becomes guesswork.

---

## Solution

FluxID introduces a **Liquidity Identity** — a dynamic score that reflects how money moves through a wallet over time.

It analyzes:

- Income consistency
- Spending patterns
- Transaction frequency
- Flow stability

And produces:

- A **Liquidity Score (0–100)**
- A simple **risk signal (Low / Medium / High)**
- A clear view of financial behavior

---

## Agentic AI Integration (X402 Payments)

FluxID is not just a scoring system — it is designed to work with **AI agents that can pay and act autonomously**.

### The Problem

AI agents today can:

- Analyze data
- Make decisions

But they **cannot natively pay for APIs or financial intelligence**.

---

### The Solution: X402 + Stellar Payments

FluxID integrates an **X402-style payment flow**, enabling agents to:

1. Request wallet analysis
2. Receive a payment requirement (HTTP 402)
3. Pay using Stellar (USDC/XLM)
4. Retry automatically
5. Get the liquidity score instantly

---

### How It Works

1. Agent calls:

## Real Use Cases

FluxID is built as infrastructure — other platforms can plug into it and use it to make decisions.

### Lending Platforms

- Score = 82 → Approve loan
- Score = 34 → Reduce or reject

No paperwork. Just behavior.

---

### Freelance / Job Platforms

- Consistent inflow + stable spending → Reliable worker

Enables better terms, faster payouts, and more trust.

---

### Remittance Apps

- Detect poor saving behavior → Suggest better allocation

Leads to smarter money usage and structured financial decisions.

---

### Marketplaces / Payment Platforms

- Trusted users → Allow pay-later or flexible terms

Unlocks new financial models.

---

## Core Principle

FluxID focuses on one core function:

> Turn wallet history into a trust score.

Everything else (dashboard, suggestions, visuals) exists to support and explain that score.

---

## Target User (MVP Focus)

FluxID is designed as a general-purpose trust layer, but the MVP focuses on a clear starting point:

**Freelancers in emerging markets (starting with West Africa).**

Why:

- Heavy reliance on cross-border payments
- No formal credit systems
- Trust directly impacts income and payment speed

---

## MVP Features

### Core Features

- Wallet connection (Freighter / Stellar wallet)
- Fetch transaction history (Stellar SDK / Horizon)

- Rule-based Liquidity Score:
  - Inflow consistency
  - Outflow volatility
  - Transaction frequency

- Simple dashboard:
  - Large, clear score display
  - Flow summary
  - Risk indicator (Low / Medium / High)

- Lightweight suggestion system
  - Example: “Consider preserving part of incoming funds”

---

### UI/UX Focus

- Clean and minimal
- Score-first (visible immediately)
- Understandable in under 3 seconds
- Mobile-first

---

### What We Keep Simple

- Rule-based logic (no heavy ML for MVP)
- Basic predictions (clear, not overpromised)
- No complex integrations

---

## Demo Flow

### Analyze Any Wallet (Primary)

1. Enter a Stellar wallet address
2. Click “Analyze”
3. System processes transaction history
4. Dashboard displays:
   - Liquidity Score
   - Risk Level
   - Score Breakdown
   - Top Risk Factors
   - Suggestions

---

### Analyze Your Wallet (Optional)

1. Connect wallet
2. Address is auto-filled
3. Analysis runs automatically

---

## API-First Design

FluxID is built as infrastructure.

Any platform or system can query:

GET /score/{wallet}

This enables:

- Lending platforms
- Marketplaces
- Remittance systems
- AI agents

To evaluate wallet trust instantly.

---

## AI Layer (Explainability)

FluxID uses a hybrid approach:

- Rule-based engine → computes score and risk
- AI models → generate explanations and suggestions

This ensures:

- Deterministic scoring
- Clear, human-readable insights
- Better decision support

## Tech Stack

### Blockchain

- Stellar SDK (JavaScript)
- Soroban (minimal usage for extensibility)

### Data / Logic

- Rule-based scoring engine (Node.js)

### Frontend

- Next.js (mobile-first PWA)
- TypeScript
- Tailwind CSS

### Wallet

- Freighter Wallet

---

## Project Structure

---

FluxID/
├── smartcontract/ # Soroban smart contracts
├── frontend/ # Next.js PWA frontend
├── docs/ # Development guides & issue trackers
└── README.md # This file

````

---

## Getting Started

### Prerequisites
- Node.js v18+
- Rust & Cargo (for Soroban)
- Freighter Wallet

### Setup Frontend
```bash
cd frontend
npm install
npm run dev
````

### Setup Smart Contracts

```bash
cd smartcontract
cargo build
```

---

## Documentation

- [Smart Contract Issues](./docs/ISSUES-SMARTCONTRACT.md)
- [Frontend Issues](./docs/ISSUES-FRONTEND.md)
- [Backend & AI Issues](./docs/ISSUES-BACKEND-AI.md)

---

## Vision

FluxID is building a new primitive:
Liquidity Identity
A real-time, behavior-based trust layer for Web3.

---

_Project maintained by @bbkenny and @xqcxx_
