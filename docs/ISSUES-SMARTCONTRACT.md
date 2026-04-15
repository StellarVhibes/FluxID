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
**Status:** PENDING

**Description:** Setup basic Soroban contract structure.

**Tasks:**

- [ ] Initialize `liquidity_identity` contract
- [ ] Setup contract structure and modules
- [ ] Configure build and deployment scripts

---

### Issue #SC-2: Liquidity Score Storage

**Priority:** Critical  
**Status:** PENDING

**Description:** Store and retrieve liquidity scores for wallet addresses.

**Tasks:**

- [ ] Define `DataKey` enum:
  - `Score(Address)`
  - `LastUpdated(Address)`
- [ ] Implement `set_score(env, wallet: Address, score: u32)`
- [ ] Implement `get_score(env, wallet: Address) -> u32`
- [ ] Implement `get_last_updated(env, wallet: Address)`

**Notes:**

- This is the ONLY required on-chain feature for MVP
- Keep storage simple and efficient

---

### Issue #SC-3: Risk Level Mapping (Optional On-Chain)

**Priority:** Medium  
**Status:** PENDING

**Description:** Map score to risk level (optional for MVP).

**Tasks:**

- [ ] Define `RiskLevel` enum:
  - `Low`
  - `Medium`
  - `High`
- [ ] Implement `get_risk(score: u32) -> RiskLevel`

**Notes:**

- Prefer computing risk on frontend/backend for flexibility
- Only include on-chain if needed for demo

---

## Phase 2: Access Control (Lightweight)

### Issue #SC-4: Score Update Authorization

**Priority:** High  
**Status:** PENDING

**Description:** Restrict who can update scores.

**Tasks:**

- [ ] Define `Admin` address
- [ ] Restrict `set_score` to admin/oracle
- [ ] Implement basic auth using Soroban auth framework

**Notes:**

- Keep simple (single admin is enough for MVP)
- No complex roles needed

---

## Phase 3: Integration Layer (Demo Support)

### Issue #SC-5: Public Query Interface

**Priority:** High  
**Status:** PENDING

**Description:** Allow external apps to query scores.

**Tasks:**

- [ ] Expose:
  - `get_score(wallet)`
  - `get_risk(wallet)` (optional)
- [ ] Ensure functions are read-optimized

**Notes:**

- This supports your “decision layer” positioning
- Critical for demo narrative

---

## Phase 4: Testing (Must Work Live)

### Issue #SC-6: Contract Testing

**Priority:** High  
**Status:** PENDING

**Description:** Ensure contract reliability.

**Tasks:**

- [ ] Test score storage and retrieval
- [ ] Test unauthorized access rejection
- [ ] Test edge cases (no score, zero score)
- [ ] Test multiple wallet entries

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
