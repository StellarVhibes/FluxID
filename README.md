# FluxID 🌊🆔

> **Liquidity Identity Layer on Stellar** — Turn any wallet into a real-time financial identity.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Built on Stellar](https://img.shields.io/badge/Built%20on-Stellar-purple)](https://stellar.org)

## 🧠 Overview

FluxID is a liquidity intelligence layer built on Stellar that turns any wallet into a real-time financial identity.

Instead of just showing balances or transaction history, FluxID looks at _how money behaves_ — how it flows in, flows out, and how stable that flow is over time.

The goal is simple:

> Help people and platforms understand **how financially reliable a wallet is**, not just how much it holds.

---

## ❗ Problem

Right now, both traditional finance and crypto miss something important:

They track **what you have**, but not **how you behave financially**.

Because of this:

- SMEs struggle to access capital due to lack of trust signals
- Freelancers get delayed payments or poor terms
- Cross-border transactions come with uncertainty
- Credit systems are slow, country-specific, or completely absent

Even in Web3:

- Wallets are mostly anonymous
- Reputation is fragmented
- There's no standard way to measure financial reliability

So trust becomes guesswork.

---

## 💡 Solution

FluxID introduces a **Liquidity Identity** — a dynamic score that reflects how money moves through a wallet over time.

It analyzes:

- Income consistency
- Spending patterns
- Transaction frequency
- Flow stability

And produces:

- A **Liquidity Score**
- A simple **risk signal**
- A clear view of financial behavior

---

## 🚀 MVP Features (5-Day Build Sprint)

### Core Features

- Wallet connection (Freighter / Stellar wallet)
- Fetch recent transaction history (via Stellar SDK / Horizon)
- Rule-based Liquidity Score:
  - Inflow consistency
  - Outflow volatility
  - Transaction frequency
- Simple dashboard:
  - Liquidity score
  - Flow summary (basic visualization)
  - Risk indicator (Low / Medium / High)
- Lightweight suggestion system:
  - Example: "Based on your flow, consider locking a portion of incoming funds"

### What We Keep Simple

- AI will be **rule-based + heuristic**, not heavy ML
- Predictions will be **basic but clear** (no overpromising)
- No complex integrations — focus on one clean flow

### MVP Outcome

> A user connects their wallet → instantly gets a liquidity score → understands their financial behavior → sees a simple recommendation.

Clean, fast, demo-ready.

---

## 🛠 Tech Stack

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

## ⚡ Demo Flow

1. User connects wallet
2. System fetches transaction history
3. Liquidity score is calculated
4. Dashboard displays:
   - Score
   - Risk level
   - Flow insight
5. User sees a simple actionable suggestion

---

## 🔮 Post-Grant Vision

Once funded, FluxID evolves into a full **Liquidity Identity Infrastructure Layer**.

### Bold Features

1. **Liquidity Identity Token (On-Chain)**
   - Non-transferable identity token (Soroban-based)
   - Represents wallet's financial reliability
   - Continuously updated based on behavior

2. **Advanced Predictive Engine**
   - Forecast: Cash flow stress, Default probability, Liquidity gaps
   - Move from rule-based → real ML models

3. **Programmable Trust Layer**
   - Other apps can query FluxID:
     - Lending protocols
     - Remittance apps (e.g., IntentRemit)
     - Payroll systems

4. **Smart Financial Actions**
   - Auto-lock funds based on behavior
   - Suggest goal-based allocations
   - Integrate directly into remittance flows

5. **Privacy Layer (Future)**
   - Selective disclosure (ZK-based in later phase)
   - Users control what part of their identity is shared

### Long-Term Vision

FluxID becomes:

- A **credit layer for Web3**
- A **trust engine for global transactions**
- A **financial identity system for emerging markets**

---

## 📂 Project Structure

```
FluxID/
├── smartcontract/     # Soroban smart contracts
├── frontend/          # Next.js PWA frontend
├── docs/             # Development guides & issue trackers
├── README.md         # This file
├── STYLE.md          # Code style guidelines
├── MAINTAINERS.md    # Project maintainers
├── CONTRIBUTING.md   # Contribution guidelines
└── CODE_OF_CONDUCT.md # Community code of conduct
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- Rust & Cargo (for Soroban)
- Freighter Wallet

### Setup Frontend
```bash
cd frontend
npm install
npm run dev
```

### Setup Smart Contracts
```bash
cd smartcontract
cargo build
```

---

## 📚 Documentation & Trackers

- 🧠 **[Smart Contract Issues](./docs/ISSUES-SMARTCONTRACT.md)**
- 🎨 **[Frontend Issues](./docs/ISSUES-FRONTEND.md)**
- 🤖 **[Backend & AI Issues](./docs/ISSUES-BACKEND-AI.md)**

Guides:
- 📘 **[Smart Contract Guide](./docs/SMARTCONTRACT_GUIDE.md)**
- 🌐 **[Frontend Integration Guide](./docs/FRONTEND_GUIDE.md)**

---

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

---

*Project maintained by @bbkenny.*