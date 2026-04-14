# Backend & AI Roadmap

This document tracks the backend infrastructure and AI scoring engine for FluxID.

---

## Phase 1: Data Pipeline

### Issue #BK-1: Transaction Data Ingestion
**Category:** `[DATA]`
**Status:** PENDING
**Priority:** Critical
**Description:** Fetch and process transaction data from Horizon.
- **Tasks:**
  - [ ] Setup Node.js data service.
  - [ ] Connect to Horizon API.
  - [ ] Fetch transaction history for wallet addresses.
  - [ ] Parse payment operations (inflow/outflow).

### Issue #BK-2: Transaction Storage
**Category:** `[INFRA]`
**Status:** PENDING
**Priority:** Critical
**Description:** Store processed transactions for analysis.
- **Tasks:**
  - [ ] Table: `transactions` (wallet, amount, type, timestamp).
  - [ ] Table: `wallets` (address, last_analyzed).
  - [ ] Implement caching for performance.

---

## Phase 2: Scoring Engine

### Issue #BK-3: Rule-Based Scoring Logic
**Category:** `[AI]`
**Status:** PENDING
**Priority:** Critical
**Description:** Implement liquidity score calculation.
- **Tasks:**
  - [ ] Implement inflow consistency algorithm.
  - [ ] Implement outflow stability algorithm.
  - [ ] Implement transaction frequency scoring.
  - [ ] Combine into final score (0-100).

### Issue #BK-4: Risk Level Classification
**Category:** `[AI]`
**Status:** PENDING
**Priority:** High
**Description:** Classify risk based on score.
- **Tasks:**
  - [ ] Define thresholds: Low (>70), Medium (40-70), High (<40).
  - [ ] Add contextual factors.
  - [ ] Generate risk summary.

---

## Phase 3: API Layer

### Issue #BK-5: Score API Endpoint
**Category:** `[API]`
**Status:** PENDING
**Priority:** High
**Description:** Serve scores to frontend.
- **Tasks:**
  - [ ] Setup Express/Fastify server.
  - [ ] Endpoint: `GET /score/{wallet}`.
  - [ ] Endpoint: `GET /history/{wallet}` (score history).
  - [ ] Cache responses.

---

## Phase 4: Suggestions Engine

### Issue #BK-6: Recommendation System
**Category:** `[AI]`
**Status:** PENDING
**Priority:** Medium
**Description:** Generate actionable financial suggestions.
- **Tasks:**
  - [ ] Rule-based suggestion logic.
  - [ ] Examples: "Lock funds", "Increase savings ratio".
  - [ ] Endpoint: `GET /suggestions/{wallet}`.

---

## Phase 5: Future Enhancements

### Issue #BK-7: ML Model Integration (Future)
**Category:** `[AI]`
**Status:** PENDING
**Priority:** Low
**Description:** Upgrade from rule-based to ML predictions.
- **Tasks:**
  - [ ] Train model on historical wallet behavior.
  - [ ] Predict liquidity stress.
  - [ ] Forecast default probability.