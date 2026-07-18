# FluxID — Smart Contracts

**Liquidity Identity Layer on Stellar** — Soroban smart contracts for on-chain score verification.

[![Rust](https://img.shields.io/badge/Rust-1.70+-DEA584)](https://rust-lang.org)
[![Soroban](https://img.shields.io/badge/Soroban-20.0.0-14B48E)](https://soroban.stellar.org)
[![Stellar](https://img.shields.io/badge/Built%20on-Stellar-14B48E)](https://stellar.org)

---

## Overview

Soroban smart contracts enable **on-chain score storage and verification**.

### Contract Features

| Feature | Description |
|---------|------------|
| Score Storage | Publish liquidity scores on-chain |
| Verification | Anyone can verify a score |
| Trustless | Read scores without backend |
| Access Control | Only authorized publisher can update |
| Inter-contract Comm | `LiquidityIdentity` verifies publishers via `OracleRegistry` |
| Event Streaming | `env.events().publish()` emits real-time score updates |

---

## Architecture (Level 3)

The smart contract architecture has been upgraded to a multi-contract system to support decentralized authorization:

1. **LiquidityIdentity Contract**: The main entry point. Stores wallet trust scores and risk levels. Before saving a score, it makes a cross-contract call to the `OracleRegistry` to verify if the caller is an authorized oracle.
2. **OracleRegistry Contract**: A standalone registry that stores a list of whitelisted oracles (trusted backends/agents) that are allowed to publish scores.

---

## Backend Integration

| File | What It Does |
|------|------------|
| [contract.routes.ts](https://github.com/StellarVhibes/FluxID/blob/main/backend/src/routes/contract.routes.ts) | Soroban calls from backend |
| [publishScore()](https://github.com/StellarVhibes/FluxID/blob/main/backend/src/routes/contract.routes.ts#L35) | Store score |
| [getScore()](https://github.com/StellarVhibes/FluxID/blob/main/backend/src/routes/contract.routes.ts#L71) | Read score |

---

## Contract Interface

```rust
// Core functions
fn publish_score(wallet: Address, score: u32, risk: RiskLevel) -> Result<(), Error>
fn get_score(wallet: Address) -> Option<ScoreData>
fn verify_score(wallet: Address, min_score: u32) -> bool

// Admin
fn set_publisher(address: Address)
fn upgrade_contract(wasm_hash: Hash)
```

---

## Building

```bash
cargo build --all
cargo test
```

---

## Deployment

```bash
# Futurenet
soroban contract deploy --wasm target/... --network testnet

# Mainnet
soroban contract deploy --wasm target/... --network mainnet
```

---

## Related

- [FluxID Frontend](https://github.com/StellarVhibes/FluxID) - Next.js PWA
- [FluxID Backend](https://github.com/StellarVhibes/FluxID) - Node.js scoring engine

---

*Built on Soroban for the Stellar network.*