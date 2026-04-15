🎯 FluxID UI Wireframe (Demo-Optimized)
🖥️ Screen 1: Landing / Connect State
Goal:

Immediately communicate what the product does + push to action.

## Layout (Centered, Minimal)

| |
| FLUXID LOGO |
| |
| Turn wallet activity into a |
| simple financial trust score |
| |
| [ Connect Wallet ] |
| |
| (Freighter required) |
| |

---

Notes:
No navbar. No distractions.
One CTA only.
Subtitle = your positioning (VERY important)
Clean spacing, lots of white/dark space
⚡ Screen 2: Loading State (Short but Polished)
Goal:

Make system feel intelligent (not static)

---

| Analyzing wallet... |
| |
| [ animated loader / dots ] |
| |
| Fetching transaction history |
| Calculating liquidity score |

---

Notes:
This builds perceived intelligence
Keep under 2–3 seconds ideally
🧠 Screen 3: MAIN DASHBOARD (CORE MOMENT)
Goal:

User instantly understands:
👉 “This wallet is trustworthy (or not)”

## Layout (CRITICAL — follow this strictly)

## | Wallet: GABCD...X9K2 |

              82
        LIQUIDITY SCORE

         🟢 LOW RISK

---

Your wallet shows consistent inflow
and stable spending behavior.

---

Suggestion:
Consider saving 20% of incoming funds
to improve long-term stability.

---

🔥 Design Rules (NON-NEGOTIABLE)

1. Score is KING
   Biggest element on screen
   Font size: VERY large
   Centered
   Nothing competes with it
2. Risk is SECOND
   Color-coded:
   Green = Low
   Yellow = Medium
   Red = High
   Must be immediately visible
3. Insight = SIMPLE SENTENCE
   Not paragraphs
   Not analytics-heavy

Just:

“You’re consistent” OR “Your flow is unstable”

4. Suggestion = ONE ONLY
   Don’t show multiple cards
   Keep it tight and actionable
   📊 Screen 4: Supporting Insight (Below Fold or Section)
   Goal:

Add credibility WITHOUT clutter

---

        FLOW OVERVIEW (30 days)

        [ simple line / area chart ]

---

Inflow: $2,400
Outflow: $1,950
Tx Count: 34

---

Notes:
This is supporting, not primary
If removed → product should still make sense
❌ What NOT to Build (Very Important)

Do NOT:

❌ Add multiple dashboards
❌ Add tabs (Overview, Analytics, etc.)
❌ Add complex filters
❌ Add too many charts
❌ Show raw transaction tables

👉 That’s how teams lose.

🎬 Demo Flow (What Judges Will See)
Step 1:

Open app
→ Clean screen
→ “Connect Wallet”

Step 2:

Click connect
→ Loading state (“Analyzing wallet…”)

Step 3 (WOW MOMENT):

Score appears:

82 — Low Risk

Judge instantly understands:
👉 “This is a trust score”

Step 4:

You say:

“We turn wallet behavior into a trust score.”

Step 5:

Scroll slightly → show chart

“And here’s how we derive it from flow patterns.”

DONE.

🧩 Component Breakdown (For Your Frontend Guy)
Core Components
ConnectCard
ScoreDisplay ⭐ (most important)
RiskBadge
InsightText
SuggestionCard
FlowChart
Layout Structure
<App>
<WalletProvider>
<MainContainer>
<HeaderWallet />
<ScoreDisplay />
<RiskBadge />
<InsightText />
<SuggestionCard />
<FlowChart />
</MainContainer>
</WalletProvider>
</App>
