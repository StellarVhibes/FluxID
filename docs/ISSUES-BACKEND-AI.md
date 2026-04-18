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
- [x] Fetch recent payments for a wallet (retry + timeout)
- [x] Extract payment operations only (native + credit_alphanum)
- [x] Classify:
  - Inflow (incoming funds)
  - Outflow (outgoing funds)

**Evidence:** `backend/src/services/horizon.service.ts`

---

### Issue #BK-2: In-Memory Processing (No Heavy DB)

**Category:** [INFRA]  
**Status:** COMPLETED  
**Priority:** Critical

**Description:** Process transactions without heavy infrastructure.

**Tasks:**

- [x] Process transactions in-memory (no DB dependency)
- [x] Normalize data (amount, timestamp, type)
- [x] Lightweight in-memory TTL cache

**Evidence:** `backend/src/services/cache.service.ts`

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

**Output:** `score: number`, `metrics: ScoreMetrics`  
**Evidence:** `backend/src/services/scoring.service.ts`

---

### Issue #BK-4: Risk Classification

**Category:** [AI]  
**Status:** COMPLETED  
**Priority:** High

**Description:** Convert score into simple risk level.

**Tasks:**

- [x] Thresholds: Low >= 70, Medium 40–69, High < 40
- [x] Generate short explanation string driven by sub-scores

**Output:** `risk: Low | Medium | High`, `insight: string`

---

## Phase 3: API Layer (Demo Critical)

### Issue #BK-5: Core Score Endpoint

**Category:** [API]  
**Status:** COMPLETED  
**Priority:** Critical

**Description:** Serve score to frontend.

**Tasks:**

- [x] Fastify server (`src/app.ts`)
- [x] `GET /score/:accountId?network=&refresh=&sync=`
- [x] JSON response with score, risk, insight, suggestion, metrics
- [x] TTL-based caching
- [x] Input validation (Stellar key format + network)
- [x] Support endpoints: `/payments/:accountId`, `/transactions/:accountId`, `/health`

**Evidence:** `backend/src/routes/score.routes.ts`

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

---

## Phase 5: Optional Integration (If Time Allows)

### Issue #BK-7: Smart Contract Sync

**Category:** [INTEGRATION]  
**Status:** COMPLETED  
**Priority:** Medium

**Description:** Push computed score to Soroban contract.

**Tasks:**

- [x] `ContractService.syncScore(wallet, score, risk)` invokes `set_score` via Soroban RPC
- [x] Prepare → sign → send → poll until SUCCESS/FAIL
- [x] Graceful no-op when `ADMIN_SECRET_KEY` / contract ID unset
- [x] Exposed via `POST /score/:accountId/sync` and `?sync=true` on GET
- [x] Returns structured `ContractSyncResult` with error on failure

**Evidence:** `backend/src/services/contract.service.ts`

---

## Phase 6: Agentic AI Payments (X402 Integration)

### Issue #BK-8: 402 Payment Middleware

**Category:** [AI / PAYMENTS]  
**Status:** COMPLETED  
**Priority:** High

**Description:** Enable pay-per-request API access using Stellar payments.

**Tasks:**

- [x] Intercept protected endpoint `/paid/score/:accountId`
- [x] Return HTTP 402 when no `requestId` supplied
- [x] Response includes:
  - `payTo` (Stellar payment address)
  - `amount` (required XLM amount)
  - `memo` (unique `FLX-xxxxxxxx` identifier)
  - `expiresAt`, `retryUrl`, human-readable `instructions`
- [x] Pending requests stored in-memory with TTL (default 15 min)

**Evidence:** `backend/src/routes/paid.routes.ts`, `backend/src/services/payment.service.ts`

---

### Issue #BK-9: Payment Verification (Stellar)

**Category:** [BLOCKCHAIN]  
**Status:** COMPLETED  
**Priority:** Critical

**Description:** Verify incoming payments on-chain.

**Tasks:**

- [x] Query Horizon `/accounts/:payTo/transactions` for recent txs
- [x] Match text memo exactly against the request's `FLX-xxxxxxxx`
- [x] Fetch operations for the matched tx via `/transactions/:hash/operations`
- [x] Confirm native XLM payment to the receive address with `amount >= required`
- [x] Mark request as paid and remember `txHash`

**Evidence:** `PaymentService.verify()` in `backend/src/services/payment.service.ts`

---

### Issue #BK-10: Agent Retry Flow

**Category:** [AI]  
**Status:** COMPLETED  
**Priority:** High

**Description:** Enable seamless retry after payment.

**Tasks:**

- [x] Request state persisted by `requestId` in `PaymentService`
- [x] Retry via `GET /paid/score/:accountId?requestId=...`
- [x] If already paid → return cached score (no re-verification)
- [x] If pending → re-verify on Horizon, return 402 again if still pending
- [x] Expired / unknown requestId → 404 / 410 with recovery guidance

---

### Issue #BK-11: Paid Endpoint Wrapper

**Category:** [API]  
**Status:** COMPLETED  
**Priority:** High

**Description:** Wrap scoring endpoint with payment requirement.

**Tasks:**

- [x] `GET /paid/score/:accountId` — 402 challenge or paid score
- [x] Response is agent-friendly (structured JSON on 402 and 200)
- [x] Returns score only when payment verified
- [x] Optional `?sync=true` to push the score on-chain immediately after payment
- [x] Free-tier preserved via existing unauthenticated `GET /score/:accountId`

---

### Issue #BK-12: MCP / Agent Compatibility

**Category:** [AI]  
**Status:** COMPLETED  
**Priority:** Medium

**Description:** Make FluxID usable by AI agents via an MCP-style tool interface.

**Tasks:**

- [x] `GET /mcp/tools` — returns tool manifest including `analyze_wallet` schema
- [x] `POST /mcp/tools/analyze_wallet` — direct invocation with `{ wallet_address, network? }`
- [x] `POST /mcp/tools/call` — generic dispatch `{ name, arguments }`
- [x] Returns structured JSON (`success`, `tool`, `result` / `error`)
- [x] Compatible with Claude / Gemini / ChatGPT tool-calling conventions

**Evidence:** `backend/src/routes/mcp.routes.ts`

---## Phase X: AI Augmentation Layer

### Issue #BK-AI-1: Insight Generation

**Category:** [AI]
**Status:** COMPLETED
**Priority:** Medium

**Description:** Generate human-readable explanations from scoring output.

**Tasks:**

- [x] Send structured scoring data to LLM (Anthropic Claude, native `fetch`, no new deps)
- [x] Generate 1-line insight (max ~25 words, neutral tone, grounded in sub-scores)
- [x] Generate enhanced explanation (surfaced as `aiInsight` in `/score` response)

**Fallback:** When `ANTHROPIC_API_KEY` is unset or the API call fails/timeouts, the
response still includes the deterministic rule-based `insight` field. AI augmentation
is strictly additive — it never blocks the score response.

**Evidence:** `backend/src/services/ai.service.ts`, integrated in `backend/src/routes/score.routes.ts`.

---

### Issue #BK-AI-2: Suggestion Generation

**Category:** [AI]
**Status:** COMPLETED
**Priority:** Medium

**Description:** Generate actionable financial suggestions.

**Tasks:**

- [x] Convert scoring signals into advice (prompt is weighted toward weakest sub-scores)
- [x] Limit to 1–2 suggestions (enforced in the prompt and parser)
- [x] Ensure clarity and simplicity (max ~15 words each, positive phrasing)

Returned as `aiSuggestions: string[]` in the `/score` response; frontend renders them
under an "AI Insight" card above the rule-based suggestions.

**Evidence:** Same as BK-AI-1 — single `generateAiAugmentation()` call returns both.

---

### Issue #BK-AI-3: Pattern Interpretation (Optional)

**Category:** [AI]  
**Priority:** Low

**Description:** Use AI to detect deeper behavioral patterns.

**Tasks:**

- [ ] Identify irregular income cycles
- [ ] Detect spending spikes
- [ ] Generate pattern-based insights

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

Public endpoints for lending platforms, remittance apps, marketplaces.

---

## Final Guideline

Backend must be: Fast, Simple, Reliable, Demo-ready.  
Not: Complex, Overengineered, Feature-heavy.

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
- Phase 6: Agentic AI Payments / X402 (COMPLETE) — BK-8, BK-9, BK-10, BK-11, BK-12
- Phase X: AI Augmentation Layer (PARTIAL) — BK-AI-1, BK-AI-2 complete; BK-AI-3 deferred (Priority Low)
