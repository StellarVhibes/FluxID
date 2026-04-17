# Smart Contract Issues - FluxID

This document tracks the development tasks for FluxID Soroban smart contracts.

Core Principle:
Smart contracts are NOT the product.

They support one core function:

> Store and expose a wallet’s trust score.

Keep contracts minimal, fast, and demo-ready.

---

## Phase 1: MVP Contract (Minimal & Functional)

### Issue #SC-1: Project Initialization

**Priority:** Critical  
**Status:** COMPLETED

**Description:** Setup basic Soroban contract structure.

**Tasks:**

- [x] Initialize `liquidity_identity` contract
- [x] Setup contract structure and modules
- [x] Configure build and deployment scripts
- [x] Use `wasm32v1-none` target for compatibility

---

### Issue #SC-2: Liquidity Score Storage

**Priority:** Critical  
**Status:** COMPLETED

**Description:** Store and retrieve liquidity scores for wallet addresses.

**Tasks:**

- [x] Define `DataKey` enum:
  - `Score(Address)`
  - `LastUpdated(Address)`
  - `RiskLevel(Address)`
- [x] Implement `set_score(env, admin: Address, wallet: Address, score: u32, risk: RiskLevel)`
- [x] Implement `get_score(env, wallet: Address) -> u32`
- [x] Implement `get_last_updated(env, wallet: Address) -> Option<u64>`

**Notes:**

- This is the ONLY required on-chain feature for MVP
- Keep storage simple and efficient

---

### Issue #SC-3: Risk Level Mapping (Optional On-Chain)

**Priority:** Medium  
**Status:** COMPLETED

**Description:** Map score to risk level (optional for MVP).

**Tasks:**

- [x] Define `RiskLevel` enum:
  - `Low`
  - `Medium`
  - `High`
- [x] Store risk alongside score (`RiskLevel(Address)` key)
- [x] Expose `get_risk(env, wallet: Address) -> Option<RiskLevel>`

**Notes:**

- Risk is computed off-chain (backend) and stored on-chain for flexibility
- Frontend/backend remain authoritative for computation

---

## Phase 2: Access Control (Lightweight)

### Issue #SC-4: Score Update Authorization

**Priority:** High  
**Status:** COMPLETED

**Description:** Restrict who can update scores.

**Tasks:**

- [x] Define `Admin` address (stored in instance storage via `init`)
- [x] Restrict `set_score` to admin using `require_auth` + stored-admin check
- [x] `transfer_admin` for future rotation

**Notes:**

- Single admin model (MVP)
- No complex roles

---

## Phase 3: Integration Layer (Demo Support)

### Issue #SC-5: Public Query Interface

**Priority:** High  
**Status:** COMPLETED

**Description:** Allow external apps to query scores.

**Tasks:**

- [x] Expose `get_score(wallet)`
- [x] Expose `get_risk(wallet)`
- [x] Expose `get_wallet_info(wallet)` (score + risk + last_updated)
- [x] Expose `get_last_updated(wallet)`
- [x] Expose `get_all_wallets_with_scores(wallets)` for batch queries
- [x] Read functions use persistent storage and are read-optimized

**Notes:**

- Supports the “decision layer” positioning
- Critical for demo narrative

---

## Phase 4: Testing (Must Work Live)

### Issue #SC-6: Contract Testing

**Priority:** High  
**Status:** COMPLETED

**Description:** Ensure contract reliability.

**Tasks:**

- [x] Test score storage and retrieval
- [x] Test unauthorized access rejection (admin-only `set_score`)
- [x] Test edge cases (no score returns 0, missing risk returns None)
- [x] Test multiple wallet entries
- [x] Test `transfer_admin`
- [x] Test `last_updated` timestamp recording
- [x] Test `get_wallet_info` happy + nonexistent paths

10/10 tests pass (`cargo test`).

---

## What We Are NOT Building (For MVP)

To avoid overengineering:

- ❌ No identity token (NFT) yet
- ❌ No complex analytics on-chain
- ❌ No historical tracking
- ❌ No multi-oracle system
- ❌ No heavy computation logic

---

## Post-Grant Expansion (Future — OmniFlow Level)

These features are intentionally NOT part of MVP but define future direction.

---

### 1. On-Chain Liquidity Identity Token

- Non-transferable identity token
- Represents wallet reliability over time
- Continuously updated based on behavior

---

### 2. Advanced On-Chain Risk Logic

- Move from simple mapping → deeper computation
- Enable verifiable on-chain scoring components

---

### 3. Multi-Oracle System

- Multiple trusted sources updating scores
- Improves decentralization and reliability

---

### 4. Cross-Platform Identity Layer

- Extend identity beyond single wallet
- Aggregate behavior across systems

---

### 5. Privacy Layer (ZK Future)

- Selective disclosure of score components
- Privacy-preserving identity verification

---

## Final Guideline

For hackathon success:

- Contracts must be:
  - Simple
  - Working
  - Demo-ready

Not:

- Complex
- Overengineered
- Incomplete

---

## Success Metric

During demo:

- Score can be stored on-chain
- Score can be retrieved instantly
- Contract interaction does not fail

That’s enough to prove the concept.

---

## Implementation Complete

All smart contract issues have been implemented and tested:

- Phase 1: MVP Contract (COMPLETE) — SC-1, SC-2, SC-3
- Phase 2: Access Control (COMPLETE) — SC-4
- Phase 3: Integration Layer (COMPLETE) — SC-5
- Phase 4: Testing (COMPLETE) — SC-6 (10/10 tests passing)
