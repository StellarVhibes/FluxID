# Flux-PRD.md - Product Requirements Document

---

## Overview

FluxID is a liquidity intelligence layer built on Stellar that turns any wallet into a real-time financial identity.

Instead of just showing balances or transaction history, FluxID looks at _how money behaves_ — how it flows in, flows out, and how stable that flow is over time.

At its core, FluxID does one thing:

**It turns wallet behavior into a simple trust score.**

The goal is simple: Help people and platforms understand **how financially reliable a wallet is**, not just how much it holds.

---

## Problem

Right now, both traditional finance and crypto miss something important:

They track **what you have**, but not **how you behave financially**.

Because of this:

- Freelancers (especially in emerging markets like Nigeria/Ghana) struggle to prove financial reliability to clients
- Payments are delayed or split because there is no trust signal
- Cross-border transactions come with uncertainty
- Credit systems are slow, country-specific, or completely absent

Even in Web3:

- Wallets are mostly anonymous
- Reputation is fragmented
- There's no standard way to measure financial reliability

So trust becomes guesswork.

### Real-world example

A freelancer in Lagos finishes a job, but the client delays payment or reduces scope — not because of performance, but because they can’t verify consistency or reliability.

There’s no simple way for that freelancer to prove:

“I earn consistently. I manage money well. I’m low risk.”

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

## What FluxID Really Is (In Simple Terms)

FluxID is not just an app or a dashboard.

It is a **decision layer**.

At its core, it answers one simple question:

> “Can this wallet be trusted financially?”

---

## What This Means in Practice

Instead of platforms guessing or relying on incomplete signals, they can now:

- Query a wallet’s behavior
- Get a simple trust score
- Make decisions instantly

Think of it this way:

Instead of uncertainty, platforms now have a **clear, behavior-based signal**.

FluxID analyzes wallet transaction history and returns:

A Liquidity Score
A Risk Level
A Clear Explanation
Actionable Suggestions

---

## Real Use Cases

### 1. Lending Platforms

Instead of:

“We don’t know this user”

They can do:

- Score = 82 → Low risk → Approve loan
- Score = 34 → High risk → Reduce or reject

No paperwork.  
No traditional credit system.  
Just real behavior.

---

### 2. Freelance / Job Platforms

Instead of:

“This freelancer looks new… risky”

They can do:

- Consistent inflow + stable spending → Reliable worker

This enables:

- Better payment terms
- Faster payouts
- Increased trust

---

### 3. Remittance Apps

Instead of:

Random allocation decisions

They can do:

- “User shows poor saving behavior → suggest higher locked percentage”

This leads to:

- Smarter money usage
- Behavior-driven financial decisions

---

### 4. Marketplaces / Payment Platforms

Instead of:

“Pay upfront or nothing”

They can do:

- “Trusted buyer → allow pay later”

This unlocks more flexible financial models.

---

## The Big Shift

Right now:

- Web2 → Credit scores (slow, country-based)
- Web3 → No trust layer

FluxID introduces:

> A real-time trust layer based on actual financial behavior.

Better because:

- It is real-time
- It is global
- It is based on real money movement

---

## Important Clarification

FluxID is not trying to replace or build all these platforms.

It is building the **infrastructure they can use**.

---

## How to Think About It (Positioning)

Do not frame it as:

“We help freelancers, lenders, and marketplaces”

Instead, frame it as:

> “We give any platform a simple way to measure financial reliability using wallet behavior.”

Example:

“A lending platform can use FluxID to decide who to give loans to instantly.”

---

## One-Line Definition

If asked “What is FluxID?”:

> “FluxID turns wallet transaction history into a simple trust score that other platforms can use to make financial decisions.”

---

## Why This Matters

This approach gives:

- Clarity → One clear function
- Scalability → Many use cases
- Relevance → Solves a real problem
- Strong positioning → Infrastructure, not just an app

---

## Final Note

This shifts FluxID from:

“a cool product”

to:

**a foundational layer for financial trust in Web3**

### Core Principle

FluxID focuses on **one core function**:

> Turn wallet history into a trust score.

Everything else (dashboard, suggestions, visuals) exists to support and explain that score.

---

## Target User (Focused MVP Entry Point)

While FluxID is designed as a general-purpose trust layer that any platform can use, the MVP focuses on a specific starting point:

**Freelancers in emerging markets (starting with West Africa).**

### Why this group:

- They rely heavily on cross-border payments
- They lack formal credit or reputation systems
- Trust directly affects how and when they get paid

This group provides a clear, real-world use case to demonstrate how wallet-based trust scoring can solve actual financial problems.

## Over time, FluxID expands beyond this group into a broader infrastructure layer usable by lending platforms, marketplaces, and other financial systems.

## MVP Features (5-Day Build Sprint)

### Core Features

- Wallet connection (Freighter / Stellar wallet)
- Fetch recent transaction history (via Stellar SDK / Horizon)

- Rule-based Liquidity Score:
  - Inflow consistency
  - Outflow volatility
  - Transaction frequency

- Simple dashboard:
  - Large, clear Liquidity Score display
  - Flow summary (basic visualization)
  - Risk indicator (Low / Medium / High)

- Lightweight suggestion system
  - Example: “Based on your flow, consider preserving part of incoming funds”

### Address-Based Analysis (Primary Entry)

- Users can input any Stellar wallet address
- System analyzes wallet without requiring ownership
- Enables infrastructure use cases (lending, marketplaces, AI agents)

---

### UI/UX Focus (Critical for Demo)

The interface will be:

- Clean and minimal
- Score-first (visible immediately on load)
- Easy to understand in under 3 seconds
- Mobile-first

Design priority:

> Judges should instantly understand what the product does without explanation.

---

### What We Keep Simple

- AI will be **rule-based + heuristic**, not heavy ML
- Predictions will be **basic but clear** (no overpromising)
- No complex integrations — focus on one clean flow

---

### MVP Outcome

A working product where:

> A user connects their wallet → instantly gets a liquidity score → understands their financial behavior → sees a simple recommendation.

Clean, fast, demo-ready.

---

## Tech Stack

### Blockchain

- Stellar SDK (JavaScript)
- Soroban (minimal usage for extensibility)

### Data / Logic

- Rule-based scoring engine (JavaScript / Node.js)

### Frontend

- Next.js (mobile-first PWA)
- TypeScript
- Tailwind CSS

### Wallet

- Freighter Wallet

---

## Demo Flow

## Demo Flow

### Mode 1: Analyze Any Wallet (Primary)

1. User enters wallet address
2. System fetches transaction history
3. Liquidity score is calculated
4. Dashboard displays:
   - Score
   - Risk level
   - Flow insight
   - Breakdown & factors
5. User sees actionable suggestions

---

### Mode 2: Analyze Your Wallet (Optional)

1. User connects wallet
2. Address is auto-filled
3. Analysis runs automatically

---

## Post-Grant Vision

Once funded, FluxID evolves into a full **Liquidity Identity Infrastructure Layer**.

---

### 1. On-Chain Liquidity Identity (Core Primitive)

- Non-transferable identity token (Soroban-based)
- Represents a wallet's financial behavior over time
- Continuously updated using on-chain transaction data
- Becomes a portable, verifiable financial identity across applications

---

### 2. Advanced Liquidity Intelligence Engine

- Move from rule-based logic to real predictive models
- Analyze:
  - Cash flow patterns
  - Income stability
  - Spending volatility

- Forecast:
  - Liquidity stress
  - Default probability
  - Short-term financial gaps

Transforms FluxID into a real-time risk engine, not just a scoring tool.

---

### 3. Programmable Trust & Integration Layer

FluxID becomes infrastructure other apps can build on.

- Public query endpoints / smart contract interfaces:
  - `/score/{wallet}`
  - `/risk/{wallet}`

Enables:

- Lending protocols to assess borrowers
- Payroll systems to verify reliability
- Remittance apps (like IntentRemit) to optimize fund allocation

Example:

- "Only unlock funds if score > threshold"
- "Adjust lending terms dynamically based on behavior"

---

### 4. Cross-Platform Reputation Aggregation

- Extend beyond single-wallet analysis
- Combine:
  - On-chain behavior
  - Optional off-chain signals (future phase)

Creates a unified financial identity across ecosystems.

---

### 5. Smart Financial Automation Layer

- Auto-trigger actions based on liquidity behavior:
  - Auto-lock funds
  - Auto-suggest savings allocations
  - Integrate directly into remittance flows

Example:

- "Based on your pattern, 30% of incoming funds will be automatically preserved"

---

### 6. Privacy & Selective Disclosure (Future)

- Privacy-preserving identity sharing (ZK layer later)
- Users control:
  - What data is visible
  - What score components are shared

---

## Long-Term Vision

FluxID becomes:

- A **credit layer for Web3**
- A **risk engine for global finance**
- A **trust infrastructure for emerging markets**

---

## Naming

- Product: **FluxID**
- Concept: **Liquidity Identity Layer**
