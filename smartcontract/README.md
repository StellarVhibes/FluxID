# FluxID Smart Contracts 🧠

This directory contains the **Soroban** smart contracts for FluxID — the Liquidity Identity Layer on Stellar.

## 📚 Documentation

- **[Smart Contract Issues Tracker](../docs/ISSUES-SMARTCONTRACT.md)**: Roadmap for liquidity scoring contracts.
- **[Development Guide](../docs/SMARTCONTRACT_GUIDE.md)**: Setup, build, and deploy instructions.

## 🚀 Quick Start

```bash
cargo build --all
cargo test
```

## Architecture

The smart contracts handle:
- Liquidity score calculation and storage
- Risk signal computation
- On-chain identity tokens (future phase)
- Programmable trust queries from external apps

---

*Built on Soroban for the Stellar network.*