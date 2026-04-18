# FluxID Project Flow

A comprehensive guide to FluxID's architecture, request flow, and team responsibilities.

---

## Architecture Overview

```
┌─────────────┐     ┌─────────────┐     ┌──────────────────┐
│   Frontend  │────▶│   Backend   │────▶│ Stellar Horizon  │
│  (Next.js)  │     │  (Node.js)  │     │  (Data Source)   │
└─────────────┘     └─────────────┘     └──────────────────┘
       ▲                   │
       │                   ▼
       │            ┌─────────────┐
       │            │   Scoring   │
       │            │   Engine    │
       │            └─────────────┘
       │                   │
       │                   ▼
       │            ┌────────────────────┐
       │            │  Smart Contract     │
       │            │    (Optional)       │
       │            └────────────────────┘
       │                   │
       └───────────────────┘
              Response
```

---

## Core Product Principle

FluxID must be able to score **ANY wallet address** without requiring ownership.

This enables:
- Lending platforms to evaluate borrowers
- Marketplaces to assess buyers
- Remittance apps to analyze recipients
- AI agents to query wallet trust

Wallet connection is only used for:
- Convenience (auto-fill)
- Future identity features

**NOT for access control.**

---

## Main Demo Flow

### Step 1: User Enters Wallet Address (Frontend)
- **Trigger**: User pastes or types a Stellar wallet address
- **Frontend**: Input field + "Analyze Wallet" button
- **Result**: `walletAddress = "GABC123...XYZ"`

### Optional: User Connects Wallet (Convenience Only)
- User connects Freighter wallet
- Address is auto-filled into input field
- No authorization required

> Wallet connection is NOT required for scoring

---

### Step 2: Frontend Calls Backend

```http
GET /score/GABC123XYZ
```

### Step 3: Backend Fetches Transactions
- Backend → Stellar Horizon
- `GET https://horizon.stellar.org/accounts/{wallet}/payments`

**Extracts:**
- Amount
- Direction (inflow/outflow)
- Timestamp

---

### Step 4: Backend Runs Scoring Engine

**Input:**
```json
{ "transactions": [...] }
```

**Processing:**
- Inflow consistency → Are payments regular?
- Outflow stability → Is spending controlled?
- Frequency → Is wallet active?

---

### Step 5 (OPTIONAL): Backend Writes to Smart Contract
- Backend → Soroban Contract: `set_score(wallet, score)`
- **Purpose**: Demonstrate on-chain capability

---

### Step 6: Backend Responds to Frontend

```json
{
  "score": 82,
  "risk": "Low",
  "breakdown": {
    "inflow": 30,
    "outflow": 28,
    "frequency": 24
  },
  "factors": [
    "Stable income pattern",
    "Controlled spending behavior"
  ],
  "insight": "Consistent inflow and stable spending behavior.",
  "suggestions": [
    "Consider increasing savings rate"
  ]
}
```

---

### Step 7: Frontend Renders UI
- Big Score (Primary focus)
- Risk Badge (color-coded)
- Top Risk Factors (short, scannable)
- Score Breakdown (visual bars or chart)
- Transaction Flow Graph (inflow vs outflow)
- Insight (1-line explanation)
- Suggestions (1–2 actions)

---

## UX Models

### Primary (Infrastructure Mode)
```
[ Enter Wallet Address ] → [ Analyze Wallet ] → [ Results ]
```

### Secondary (User Mode)
```
[ Connect Wallet ] → [ Auto-fill address ] → [ Analyze ]
```

---

## Team Responsibilities

### Frontend
- Accept wallet address input
- Call `/score/{wallet}`
- Display:
  - Score
  - Risk
  - Breakdown
  - Factors
  - Suggestions
- No heavy logic

### Backend
- Fetch transactions (Horizon)
- Compute score
- Generate explanations
- Return structured response

> This is the core intelligence layer

### Smart Contract (Optional)
- Store score
- Return score

> This is the credibility layer, not core logic

---

## AI Architecture

### Layer 1 — CORE (Rule-Based)

Must stay:
- Deterministic
- Fast
- Explainable

Handles:
- Score (0–100)
- Risk level (Low / Medium / High)
- Breakdown (inflow, outflow, frequency)

> Must produce consistent output for the same wallet

---

### Layer 2 — AI Augmentation (Optional)

AI models handle:
- Insight rewriting (natural language)
- Risk explanation clarity
- Suggestion phrasing

> AI does NOT compute the score

---

## Response Format

```json
{
  "score": 34,
  "risk": "High",
  "breakdown": {
    "inflow": 10,
    "outflow": 12,
    "frequency": 12
  },
  "factors": [
    "Irregular income pattern",
    "High spending volatility"
  ],
  "insight": "This wallet shows inconsistent income and unstable spending behavior.",
  "ai_insight": "Spending spikes following irregular deposits indicate weak financial stability.",
  "suggestions": [
    "Maintain more consistent inflow",
    "Reduce large irregular withdrawals"
  ]
}
```

---

## Final Rules

1. Primary interaction = Enter wallet address → Analyze
2. Wallet connection is optional (auto-fill only)
3. Backend uses rule-based scoring (no AI for logic)
4. Output must include:
   - Score
   - Risk
   - Breakdown
   - Factors
   - Suggestions
5. Frontend must answer instantly:
   - What is the score?
   - Why is it that score?
   - What should I do?
6. X402 and AI agents are future-facing — NOT required for MVP

---

## Common Mistakes

| Mistake | Problem |
|---------|---------|
| Putting scoring logic in contract | Slows development |
| Frontend calculating score | Breaks architecture |
| Overbuilding API | Only one endpoint needed |

---

## Best Options

### 🟢 Fast + Reliable
Use LLMs (e.g. OpenAI / Claude) for:
- Insight rewriting
- Explanation clarity
- Suggestions

### 🟡 Open Source Alternative
- `mistralai/Mistral-7B-Instruct`
- `meta-llama/Llama-3-8B-Instruct`

> Heavier setup — not ideal for hackathon

### 🔴 Not Recommended
- Custom ML scoring models
- Deep learning pipelines

---

## Future: Agentic Access (X402)

FluxID can support AI agents that query wallet scores autonomously.

Possible extensions:
- Payment-gated API access (X402)
- Autonomous decision systems

> NOT required for MVP  
> Do NOT block development for this

---

This version is now:

✅ Fully aligned with your **address-first architecture**  
✅ Matches your **AI explanation upgrade**  
✅ Clean for **team execution + demo + judging**
