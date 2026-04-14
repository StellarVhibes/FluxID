# FluxID — Frontend

**Liquidity Identity Layer on Stellar** — Turn any wallet into a real-time financial identity.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-14.2-000000)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-18.3-61DAFB)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6)](https://typescriptlang.org)
[![Stellar](https://img.shields.io/badge/Stellar-Soroban-14B48E)](https://stellar.org)

---

## Overview

FluxID is a liquidity intelligence layer built on Stellar. The frontend is a Next.js PWA that connects to the Stellar network via Freighter Wallet and displays wallet liquidity analysis.

---

## Tech Stack

- **Next.js** 14.2 - App Router, SSR, file-based routing
- **React** 18.3 - UI rendering
- **TypeScript** 5.x - Full type safety
- **Tailwind CSS** - Utility styling with CSS variables
- **Stellar SDK** - Blockchain interaction
- **Freighter Wallet** - Wallet connection
- **Framer Motion** - Animations and transitions
- **Lucide React** - Icon library
- **Recharts** - Data visualization

---

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

---

## Project Structure

```
frontend/
├── app/                  # Next.js App Router pages
│   ├── dashboard/        # Main dashboard with wallet analysis
│   ├── analytics/        # Transaction flow analytics
│   ├── portfolio/        # Tracked wallets
│   ├── compare/         # Wallet comparison
│   ├── history/          # Analysis history
│   └── learn/            # Educational content
├── components/           # Reusable UI components
├── hooks/               # Custom React hooks
├── lib/                 # Utilities and helpers
└── context/             # React context providers
```

---

## Documentation

- [Frontend Issues](./docs/ISSUES-FRONTEND.md) - Task tracker
- [Frontend Integration Guide](./docs/FRONTEND_GUIDE.md) - Stellar integration
- [Smart Contract Guide](../docs/SMARTCONTRACT_GUIDE.md) - Soroban contracts

---

## Related Projects

- [FluxID Smart Contracts](https://github.com/StellarVhibes/FluxID)
- [IntentRemit](https://github.com/StellarVhibes/IntentRemit) - Programmable remittance

---

*Built on Stellar by @bbkenny*