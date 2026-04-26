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

## Project Execution & Phases

FluxID is structured across three definitive phases. This ensures we deliver on our promises step by step.

- ✅ **Phase 1: MVP (Single Wallet Scoring) — COMPLETED**
  Core scoring logic, AI insights, and address-based analysis are live.

- 🏗️ **Phase 2: Scale (Protocol Intelligence) — IN PROGRESS**

  - **User-base health metrics**: Aggregating risk across groups of wallets.
  - **Risk heatmaps & alerts**: Real-time network-level risk visualization.
  - **API-first infrastructure**: Infrastructure-as-a-Service for trust signaling.
  - **X402 agentic payments**: Machine-to-machine financial primitives.


- 🔮 **Phase 3: Outcome (Internet of Value) — UPCOMING (FINAL PHASE)**
  Establishing global credit primitives and decentralized reputation.

---

## Post-MVP Roadmap (Entering Phase 2)

### Overview

After the MVP phase, FluxID evolves beyond single-wallet analysis into a broader intelligence layer designed for platforms, not just individual users.

In the MVP, FluxID answers:

> “Can this wallet be trusted?”

Post-MVP, FluxID expands to answer:

> “What is the financial health of an entire user base, and how is it changing over time?”

This shift moves FluxID from:

- A scoring tool for individual wallets

To:

- A **protocol-level risk intelligence system** that platforms can rely on for decision-making

This is where FluxID begins to transition into real infrastructure.

---

## Protocol Intelligence Layer

The Protocol Intelligence Layer enables platforms to analyze groups of wallets collectively, using liquidity scores as the foundation.

Instead of looking at isolated scores, platforms gain visibility into patterns, trends, and risks across their entire ecosystem.

This unlocks a new level of insight that is not possible with raw transaction data alone.

---

### 1. User-Base Health Dashboard

This feature provides platforms with a clear, high-level view of the financial quality of their users.

Instead of manually inspecting individual wallets, platforms can instantly understand the overall health of their ecosystem.

#### Features

- Average liquidity score across all users
- Distribution of users across risk levels (Low / Medium / High)
- Percentage of high-risk wallets
- Score trends over time (daily, weekly, monthly)
- Risk concentration indicators

#### Example Insight

> “Your borrower cohort’s average score dropped from 78 to 64 over the past month.”

#### Value

- Enables portfolio-level risk visibility
- Helps detect gradual deterioration in user quality
- Supports better lending, payment, and onboarding decisions
- Provides a simple, actionable summary for non-technical stakeholders

---

### 2. Cohort & Segmentation Engine

This layer allows platforms to filter and group wallets based on behavior, score, and activity patterns.

Instead of treating all users equally, platforms can identify and act on specific segments.

#### Capabilities

- Query wallets using multiple conditions:
  - Score thresholds (e.g., score > 75)
  - Inflow levels (e.g., monthly inflow > $500)
  - Transaction frequency
  - Interaction with specific contracts or applications

#### Example Queries

- “Show wallets with score > 75 and consistent monthly inflow”
- “List users who interacted with contract X and have medium risk”
- “Find high-activity wallets with improving score trends”

#### Use Cases

- Identifying high-quality users for premium offerings
- Creating lending or credit approval lists
- Segmenting users for risk-based pricing
- Targeting users for onboarding or retention campaigns

#### Value

- Converts raw wallet data into structured, actionable insights
- Enables smarter business decisions at scale
- Bridges the gap between blockchain data and real-world operations

---

### 3. Risk Heatmaps

Risk Heatmaps provide a visual understanding of where financial risk is concentrated across a network.

Instead of isolated scores, platforms can see relationships and clusters of risky behavior.

#### Features

- Identification of high-risk wallet clusters
- Detection of risky counterparties
- Visualization of transaction relationships between wallets
- Highlighting of risk-heavy interaction zones

#### Example Insight

> “High-risk activity is concentrated among wallets interacting with contract X.”

#### Use Cases

- Fraud detection and prevention
- Identifying suspicious transaction networks
- Monitoring ecosystem-level risk exposure
- Evaluating the impact of specific integrations or partners

#### Value

- Enables network-level risk awareness
- Helps platforms proactively manage threats
- Provides deeper insight beyond individual wallet analysis

---

### 4. Early Warning System

The Early Warning System continuously monitors wallet behavior and detects significant changes in risk patterns.

Rather than reacting after problems occur, platforms are alerted in real time.

#### Triggers

- Sudden drop in average user scores
- Increase in percentage of high-risk wallets
- Abnormal transaction behavior patterns
- Rapid changes in inflow/outflow stability

#### Example Alert

> “12% of your users dropped below a score of 50 within the last 24 hours.”

#### Value

- Enables proactive risk management
- Helps detect potential defaults, fraud, or system stress early
- Supports automated responses and intervention strategies
- Reduces financial exposure for platforms

---

### 5. AI Agent Integration (Advanced Layer)

FluxID becomes accessible not only to human users but also to autonomous systems.

This allows AI agents and backend services to directly interact with FluxID for decision-making.

#### Capabilities

- API-based wallet score queries
- Automated evaluation of financial reliability
- Integration into decision pipelines (e.g., approvals, risk checks)
- Optional payment-gated access (X402) for per-request usage

#### Use Cases

- Autonomous lending agents evaluating borrowers
- Payment systems routing transactions based on risk
- Smart contracts making conditional decisions
- Backend systems automating credit checks

#### Value

- Extends FluxID into machine-to-machine ecosystems
- Enables real-time, automated financial decisions
- Positions FluxID as a foundational data layer for intelligent systems

---

## Strategic Positioning

With the Protocol Intelligence Layer, FluxID evolves into:

> A programmable trust layer for financial systems

It is no longer just:

- A dashboard
- A scoring tool

It becomes:

- An intelligence infrastructure that powers decisions across platforms

---

## Implementation Note

This roadmap is intentionally post-MVP.

The current focus remains:

- Single-wallet scoring
- Clear and explainable insights
- Reliable and deterministic output
- A clean, intuitive dashboard experience

The Protocol Intelligence Layer builds on top of a stable and trusted core system.

---

## Long-Term Vision

As these capabilities mature, FluxID becomes:

- A **credit layer for Web3**
- A **risk intelligence API for platforms**
- A **decision engine for both humans and autonomous systems**

It enables a future where:

- Financial trust is measurable in real time
- Platforms can act instantly on reliable signals
- Wallet behavior becomes a universal standard for financial identity

---

## Naming

- Product: **FluxID**
- Concept: **Liquidity Identity Layer**
