Good — this is the piece that keeps your team from stepping on each other.

I’ll map this like an actual execution flow, not theory. This is exactly how your app should behave during demo.

FluxID — End-to-End Request Flow
High-Level Architecture
Frontend (Next.js)
↓
Backend API (Node.js)
↓
Stellar Horizon (data source)
↓
Scoring Engine (logic)
↓
(Optional) Smart Contract (store score)
↓
Response → Frontend (UI)
⚡ MAIN FLOW (This is your demo path)
Step 1: User Connects Wallet (Frontend)
Trigger:

User clicks “Connect Wallet”

Frontend does:
Uses Freighter
Gets wallet address
walletAddress = "GABC123...XYZ"
Step 2: Frontend Calls Backend
API Request:
GET /score/GABC123XYZ

This is your MOST IMPORTANT request

Step 3: Backend Fetches Transactions
Backend → Stellar Horizon
GET https://horizon.stellar.org/accounts/{wallet}/payments
Backend extracts:
Amount
Direction (inflow/outflow)
Timestamp
Step 4: Backend Runs Scoring Engine
Input:
transactions = [...]
Processing:
Inflow consistency → Are payments regular?
Outflow stability → Is spending controlled?
Frequency → Is wallet active?
Output:
{
"score": 82,
"risk": "Low",
"insight": "Consistent inflow and stable spending",
"suggestion": "Consider saving a portion of incoming funds"
}
Step 5 (OPTIONAL): Backend Writes to Smart Contract

Only if you implement it

Backend → Soroban Contract
set_score(wallet, 82)
Why:
Proves on-chain capability
Strengthens demo narrative
If skipped:

Your demo still works perfectly

Step 6: Backend Responds to Frontend
{
"score": 82,
"risk": "Low",
"insight": "Consistent inflow and stable spending",
"suggestion": "Consider saving a portion of incoming funds"
}
Step 7: Frontend Renders UI
UI Updates:
Big Score → 82
Risk Badge → Low (Green)
Insight → short sentence
Suggestion → one action

THIS = your demo moment

COMPLETE DEMO FLOW (What judges see)
Click “Connect Wallet”
Loading → “Analyzing wallet…”
Score appears:
82
LIQUIDITY SCORE
LOW RISK
You say:

“We turn wallet behavior into a trust score.”

DONE.

OPTIONAL FLOW (Smart Contract Read)

If you want to flex more:

After writing score:

Frontend can also call:

contract.get_score(wallet)

Then show:

“Stored on-chain”

This is a bonus, not required

Responsibilities (So your team doesn’t clash)
🖥 Frontend
Connect wallet
Call /score/{wallet}
Display:
Score
Risk
Insight
Suggestion

No heavy logic here

Backend
Fetch transactions (Horizon)
Compute score
Return response

This is the brain

Smart Contract (Optional)
Store score
Return score

👉This is credibility layer, not core logic

Common Mistakes (Avoid This)
Mistake 1: Putting scoring logic in contract

→ Too complex, slows you down

Mistake 2: Frontend calculating score

→ Breaks separation, messy

Mistake 3: Overbuilding API

→ You only need ONE endpoint

Final Architecture (Simplified)
User
↓
Frontend (Connect Wallet)
↓
GET /score/{wallet}
↓
Backend
↓
Horizon → Transactions
↓
Scoring Engine
↓
(Optional) Contract write
↓
Return score
↓
Frontend UI (BIG NUMBER)
🏁 Final Rule

If everything fails… but this works:

GET /score/{wallet}

and returns a clean result

You still have a winning demo
