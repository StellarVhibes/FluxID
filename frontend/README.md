# FluxID — Frontend

**Liquidity Identity Layer on Stellar** — Turn any wallet into a real-time financial identity.

[![Next.js](https://img.shields.io/badge/Next.js-14.2-000000)](https://nextjs.org)
[![Stellar](https://img.shields.io/badge/Built%20on-Stellar-14B48E)](https://stellar.org)
[![AI](https://img.shields.io/badge/AI-Anthropic%20Claude-orange)](https://anthropic.com/)

---

## Overview

Next.js PWA frontend for FluxID — analyzes Stellar wallets and displays liquidity scores with AI insights.

### Key Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page with features |
| `/dashboard` | Main wallet analysis |
| `/dashboard/analytics` | Flow charts & breakdown |
| `/dashboard/transactions` | Transaction history with filters |
| `/dashboard/insights` | AI behavior explanations |
| `/dashboard/agent` | Agent payment demo |
| `/dashboard/settings` | User preferences |

---

## Stellar Integration

### Freighter Wallet

| File | What It Does |
|------|------------|
| [FreighterContext.tsx](https://github.com/StellarVhibes/FluxID/blob/main/frontend/app/context/FreighterContext.tsx#L27) | Full wallet state management |
| [useFreighter hook](https://github.com/StellarVhibes/FluxID/blob/main/frontend/app/context/FreighterContext.tsx#L189) | Connect/disconnect functions |
| [Header connection](https://github.com/StellarVhibes/FluxID/blob/main/frontend/app/components/Header.tsx#L12) | Connect button in header |

### Analyze Bar

| File | What It Does |
|------|------------|
| [AnalyzeBar.tsx](https://github.com/StellarVhibes/FluxID/blob/main/frontend/app/dashboard/components/AnalyzeBar.tsx) | Address input + Analyze button |
| [Auto-fill](https://github.com/StellarVhibes/FluxID/blob/main/frontend/app/dashboard/components/AnalyzeBar.tsx#L26) | Uses connected wallet |

---

## AI Insights Display

### Behavior Summary

| File | What It Does |
|------|------------|
| [ExplanationCard.tsx](https://github.com/StellarVhibes/FluxID/blob/main/frontend/app/components/ExplanationCard.tsx) | AI-generated insights display |
| [FlowSummary.tsx](https://github.com/StellarVhibes/FluxID/blob/main/frontend/app/components/FlowSummary.tsx) | Analytics cards (inflow/outflow/swaps) |

### Score Display

| File | What It Does |
|------|------------|
| [AnimatedScore](https://github.com/StellarVhibes/FluxID/blob/main/frontend/app/components/AnimatedScore.tsx) | Animated score gauge |
| [OnChainBadge](https://github.com/StellarVhibes/FluxID/blob/main/frontend/app/components/OnChainBadge.tsx) | On-chain verification badge |

---

## Agent Demo

| File | What It Does |
|------|------------|
| [AgentDemo.tsx](https://github.com/StellarVhibes/FluxID/blob/main/frontend/app/components/AgentDemo.tsx) | Full X402 payment demo |
| [agentDemo.ts](https://github.com/StellarVhibes/FluxID/blob/main/frontend/lib/agentDemo.ts) | Request + signing logic |
| [Freighter signing](https://github.com/StellarVhibes/FluxID/blob/main/frontend/lib/agentDemo.ts#L10) | Transaction signing |

---

## Scoring Integration

| File | What It Does |
|------|------------|
| [scoring.ts](https://github.com/StellarVhibes/FluxID/blob/main/frontend/lib/scoring.ts) | Client-side scoring utilities |
| [Transaction types](https://github.com/StellarVhibes/FluxID/blob/main/frontend/lib/scoring.ts#L34) | inflow/outflow/swap tracking |

---

## Onboarding

| File | What It Does |
|------|------------|
| [Onboarding.tsx](https://github.com/StellarVhibes/FluxID/blob/main/frontend/app/components/Onboarding.tsx) | Welcome tour flow |
| [Tour steps](https://github.com/StellarVhibes/FluxID/blob/main/frontend/app/components/Onboarding.tsx#L17) | Dashboard walkthrough |

---

## Tech Stack

| Technology | Usage |
|------------|-------|
| Next.js 14 | App Router, SSR |
| React 18 | UI rendering |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| Framer Motion | Animations |
| Stellar SDK | Blockchain |
| Freighter | Wallet |

---

## Getting Started

```bash
npm install
npm run dev
```

---

## Related

- [FluxID Backend](https://github.com/StellarVhibes/FluxID) - Node.js scoring engine
- [FluxID Smart Contracts](https://github.com/StellarVhibes/FluxID) - Soroban contracts

---

*Built on Stellar by @bbkenny*