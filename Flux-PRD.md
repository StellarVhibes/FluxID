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

### Core Principle

FluxID focuses on **one core function**:

> Turn wallet history into a trust score.

Everything else (dashboard, suggestions, visuals) exists to support and explain that score.

---

## Target User (Focused Scope)

For MVP, FluxID focuses on:

**Freelancers in emerging markets (starting with West Africa)**

Why this group:

- They rely heavily on cross-border payments  
- They lack formal credit or reputation systems  
- Trust directly affects how and when they get paid  

---

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

1. User connects wallet  
2. System fetches transaction history  
3. Liquidity score is calculated  
4. Dashboard displays:
   - Score  
   - Risk level  
   - Flow insight  
5. User sees a simple actionable suggestion  

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
