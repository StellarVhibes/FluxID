# Smart Contract Issues - FluxID 🏊🆔

This document tracks the detailed development tasks for FluxID Soroban smart contracts.

---

## 🏛️ Core Architecture

### Issue #SC-1: Liquidity Score Storage
**Priority:** Critical
**Status:** ❌ PENDING
**Description:** Store and retrieve liquidity scores for wallet addresses.
- **Tasks:**
  - [ ] Initialize `liquidity_identity` project.
  - [ ] Define `DataKey` enum: `Score`, `LastUpdated`, `Admin`.
  - [ ] Implement `set_score(env, wallet: Address, score: u32)` function.
  - [ ] Implement `get_score(env, wallet: Address) -> u32` function.

### Issue #SC-2: Risk Level Computation
**Priority:** Critical
**Status:** ❌ PENDING
**Description:** Compute risk levels based on liquidity metrics.
- **Tasks:**
  - [ ] Implement `compute_risk(env, metrics: LiquidityMetrics) -> RiskLevel`.
  - [ ] Define `RiskLevel` enum: `Low`, `Medium`, `High`.
  - [ ] Store risk history for analytics.

### Issue #SC-3: On-Chain Identity Token (Future)
**Priority:** Medium
**Status:** ❌ PENDING
**Description:** Non-transferable identity token representing wallet reliability.
- **Tasks:**
  - [ ] Design token contract structure.
  - [ ] Implement mint/burn logic (admin only).
  - [ ] Link token to liquidity score.

---

## 🔐 Access Control

### Issue #SC-4: Score Update Authorization
**Priority:** High
**Status:** ❌ PENDING
**Description:** Only authorized oracles can update scores.
- **Tasks:**
  - [ ] Implement `update_score` restricted to Oracle/Admin.
  - [ ] Add authorization checks using Soroban Auth framework.

---

## 🧪 Testing

### Issue #SC-5: Score Calculation Tests
**Priority:** High
**Status:** ❌ PENDING
**Description:** Verify score computation logic.
- **Tasks:**
  - [ ] Test score initialization.
  - [ ] Test score update with authorization.
  - [ ] Test risk level computation edge cases.