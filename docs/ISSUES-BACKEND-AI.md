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
**Status:** PENDING  
**Priority:** Critical

**Description:** Fetch wallet transaction data from Stellar.

**Tasks:**

- [ ] Setup Node.js service (lightweight)
- [ ] Connect to Horizon API
- [ ] Fetch recent transactions for a wallet
- [ ] Extract payment operations only
- [ ] Classify:
  - Inflow (incoming funds)
  - Outflow (outgoing funds)

**Notes:**

- Do NOT overbuild ingestion pipeline
- Only fetch what is needed for scoring

---

### Issue #BK-2: In-Memory Processing (No Heavy DB)

**Category:** [INFRA]  
**Status:** PENDING  
**Priority:** Critical

**Description:** Process transactions without heavy infrastructure.

**Tasks:**

- [ ] Process transactions in-memory
- [ ] Normalize data (amount, timestamp, type)
- [ ] Optional: lightweight caching (Redis or in-app)

**Notes:**

- Avoid full database setup for MVP
- Speed > persistence for demo

---

## Phase 2: Scoring Engine (CORE LOGIC)

### Issue #BK-3: Rule-Based Liquidity Score

**Category:** [AI]  
**Status:** PENDING  
**Priority:** Critical

**Description:** Compute wallet trust score (0–100).

**Tasks:**

- [ ] Inflow consistency:
  - Detect regular income patterns
- [ ] Outflow stability:
  - Detect erratic vs controlled spending
- [ ] Transaction frequency:
  - Measure activity level
- [ ] Combine into final score (0–100)

**Output:**

- `score: number`

**Notes:**

- Keep logic simple and explainable
- No ML for MVP

---

### Issue #BK-4: Risk Classification

**Category:** [AI]  
**Status:** PENDING  
**Priority:** High

**Description:** Convert score into simple risk level.

**Tasks:**

- [ ] Define thresholds:
  - Low: > 70
  - Medium: 40 – 70
  - High: < 40
- [ ] Generate short explanation string

**Output:**

- `risk: Low | Medium | High`
- `insight: string`

---

## Phase 3: API Layer (Demo Critical)

### Issue #BK-5: Core Score Endpoint

**Category:** [API]  
**Status:** PENDING  
**Priority:** Critical

**Description:** Serve score to frontend.

**Tasks:**

- [ ] Setup Express or Fastify server
- [ ] Endpoint: `GET /score/{wallet}`
- [ ] Response format:

```json
{
  "score": 82,
  "risk": "Low",
  "insight": "Consistent inflow and stable spending",
  "suggestion": "Consider saving a portion of incoming funds"
}
```

Add basic caching (optional)

Notes:

This endpoint powers the entire demo

Must be fast and reliable

Phase 4: Suggestions Engine (Lightweight)
Issue #BK-6: Recommendation Logic
Category: [AI]
Status: PENDING
Priority: Medium

Description: Generate simple behavioral suggestions.

Tasks:

Rule-based suggestion system

Limit to 1–2 suggestions per wallet

Keep language simple and human

Examples:

“Your spending is inconsistent — try stabilizing outflows.”

“You receive funds regularly — consider saving a fixed portion.”

Phase 5: Optional Integration (If Time Allows)
Issue #BK-7: Smart Contract Sync
Category: [INTEGRATION]
Status: PENDING
Priority: Medium

Description: Push computed score to Soroban contract.

Tasks:

Call set_score(wallet, score)

Sync backend → on-chain storage

Handle failures gracefully

Notes:

Not required for demo

Only implement if time permits

---

Post-Grant Expansion (Future — OmniFlow Level)

These define long-term direction, not MVP.

1. Advanced Data Pipeline
   Persistent storage (PostgreSQL)
   Historical transaction indexing
   Real-time streaming updates
2. Machine Learning Models
   Predict liquidity stress
   Forecast default probability
   Behavioral pattern detection
3. Multi-Wallet Intelligence
   Aggregate identity across wallets
   Cross-platform financial profiles
4. Intelligent Recommendation Engine
   Personalized financial strategies
   Dynamic behavior-based suggestions
5. API for External Platforms
   Public endpoints for:
   Lending platforms
   Remittance apps
   Marketplaces
   Final Guideline

For hackathon success:

Backend must be:

Fast
Simple
Reliable
Demo-ready

Not:

Complex
Overengineered
Feature-heavy
Success Metric

During demo:

Wallet is analyzed instantly
Score is returned correctly
Insight is understandable
No API failures
