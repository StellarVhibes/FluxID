# Backend & AI Issues - FluxID

This document tracks backend infrastructure and scoring logic for FluxID.

Core Principle:
The backend exists to do ONE thing:

> Turn wallet transaction history into a trust score.

Everything else supports that.

---

## Phase 1: Data Ingestion (Minimal Pipeline)

### Issue #BK-1: Transaction Data Fetching

**Category:** [DATA]  
**Status:** COMPLETED  
**Priority:** Critical

**Description:** Fetch wallet transaction data from Stellar.

**Tasks:**

- [x] Setup Node.js service (Fastify — lightweight)
- [x] Connect to Horizon API (testnet + mainnet)
- [x] Fetch recent payments for a wallet (with retry + timeout)
- [x] Extract payment operations only (filter native + credit_alphanum)
- [x] Classify:
  - Inflow (incoming funds)
  - Outflow (outgoing funds)

**Notes:**

- Implemented in `src/services/horizon.service.ts`
- Only payment operations used — ingestion stays lean

---

### Issue #BK-2: In-Memory Processing (No Heavy DB)

**Category:** [INFRA]  
**Status:** COMPLETED  
**Priority:** Critical

**Description:** Process transactions without heavy infrastructure.

**Tasks:**

- [x] Process transactions in-memory (no DB dependency)
- [x] Normalize data (amount, timestamp, type)
- [x] Lightweight in-memory TTL cache (`src/services/cache.service.ts`)

**Notes:**

- Speed > persistence for MVP
- Cache TTL configurable via `CACHE_TTL_SECONDS`

---

## Phase 2: Scoring Engine (CORE LOGIC)

### Issue #BK-3: Rule-Based Liquidity Score

**Category:** [AI]  
**Status:** COMPLETED  
**Priority:** Critical

**Description:** Compute wallet trust score (0–100).

**Tasks:**

- [x] Inflow consistency (coefficient-of-variation on inter-arrival times)
- [x] Outflow stability (coefficient-of-variation on amounts)
- [x] Transaction frequency (normalized activity level)
- [x] Flow stability (inflow/outflow ratio)
- [x] Counterparty diversity
- [x] Volume component
- [x] Weighted combination into final score (0–100)

**Output:**

- `score: number`
- `metrics: ScoreMetrics` (all sub-scores exposed for transparency)

**Notes:**

- Implemented in `src/services/scoring.service.ts`
- Pure functions, deterministic, no ML

---

### Issue #BK-4: Risk Classification

**Category:** [AI]  
**Status:** COMPLETED  
**Priority:** High

**Description:** Convert score into simple risk level.

**Tasks:**

- [x] Thresholds:
  - Low: >= 70
  - Medium: 40 – 69
  - High: < 40
- [x] Generate short explanation string (driven by sub-scores)

**Output:**

- `risk: Low | Medium | High`
- `insight: string`

---

## Phase 3: API Layer (Demo Critical)

### Issue #BK-5: Core Score Endpoint

**Category:** [API]  
**Status:** COMPLETED  
**Priority:** Critical

**Description:** Serve score to frontend.

**Tasks:**

- [x] Fastify server setup (`src/app.ts`)
- [x] `GET /score/:accountId?network=&refresh=&sync=`
- [x] Response format:

```json
{
  "success": true,
  "data": {
    "accountId": "G...",
    "score": 82,
    "risk": "Low",
    "insight": "Consistent inflow patterns, stable spending behavior",
    "suggestion": "Consider saving a portion of incoming funds",
    "metrics": { "...": "..." },
    "lastUpdated": "2026-04-17T...",
    "cached": false
  }
}
```

- [x] TTL-based caching
- [x] Input validation (Stellar key format + network)
- [x] Supporting endpoints: `/payments/:accountId`, `/transactions/:accountId`, `/health`

**Notes:**

- This endpoint powers the entire demo
- 400 on malformed address, 404 on missing account, 503 on Horizon failure

---

## Phase 4: Suggestions Engine (Lightweight)

### Issue #BK-6: Recommendation Logic

**Category:** [AI]  
**Status:** COMPLETED  
**Priority:** Medium

**Description:** Generate simple behavioral suggestions.

**Tasks:**

- [x] Rule-based suggestion system (`generateInsightAndSuggestion`)
- [x] Limit to 1 primary suggestion per wallet
- [x] Simple, human language

**Examples:**

- "Try to establish more consistent income sources"
- "Consider stabilizing your outflows for better financial health"
- "Consider saving a portion of incoming funds"

---

## Phase 5: Optional Integration (If Time Allows)

### Issue #BK-7: Smart Contract Sync

**Category:** [INTEGRATION]  
**Status:** COMPLETED  
**Priority:** Medium

**Description:** Push computed score to Soroban contract.

**Tasks:**

- [x] `ContractService.syncScore(wallet, score, risk)` — real Soroban RPC call
- [x] Calls `set_score(admin, wallet, score, risk)` on deployed contract
- [x] Confirms transaction status (polls until SUCCESS/FAIL)
- [x] Graceful no-op when `ADMIN_SECRET_KEY` or `CONTRACT_ID` unset
- [x] Exposed via `POST /score/:accountId/sync` and `GET /score/:accountId?sync=true`
- [x] Handle failures gracefully (returns structured `ContractSyncResult` with error)

**Notes:**

- Implemented in `src/services/contract.service.ts`
- Requires `TESTNET_CONTRACT_ID` / `MAINNET_CONTRACT_ID` + `ADMIN_SECRET_KEY`

---

## Post-Grant Expansion (Future — OmniFlow Level)

These define long-term direction, not MVP.

### 1. Advanced Data Pipeline

- Persistent storage (PostgreSQL)
- Historical transaction indexing
- Real-time streaming updates

### 2. Machine Learning Models

- Predict liquidity stress
- Forecast default probability
- Behavioral pattern detection

### 3. Multi-Wallet Intelligence

- Aggregate identity across wallets
- Cross-platform financial profiles

### 4. Intelligent Recommendation Engine

- Personalized financial strategies
- Dynamic behavior-based suggestions

### 5. API for External Platforms

Public endpoints for:

- Lending platforms
- Remittance apps
- Marketplaces

---

## Final Guideline

For hackathon success:

Backend must be:

- Fast
- Simple
- Reliable
- Demo-ready

Not:

- Complex
- Overengineered
- Feature-heavy

## Success Metric

During demo:

- Wallet is analyzed instantly
- Score is returned correctly
- Insight is understandable
- No API failures

---

## Implementation Complete

All backend issues have been implemented:

- Phase 1: Data Ingestion (COMPLETE) — BK-1, BK-2
- Phase 2: Scoring Engine (COMPLETE) — BK-3, BK-4
- Phase 3: API Layer (COMPLETE) — BK-5
- Phase 4: Suggestions Engine (COMPLETE) — BK-6
- Phase 5: Optional Integration (COMPLETE) — BK-7
