# Frontend Issues - FluxID

This document tracks the detailed UI/UX and integration tasks for the FluxID dashboard.

---

## Phase 1: Foundation

### Issue #FE-1: Project Scaffold & Theme
**Category:** `[UI]`
**Status:** PENDING
**Priority:** Critical
**Description:** Initialize Next.js app with FluxID branding.
- **Tasks:**
  - [ ] Configure `tailwind.config.ts` (Dark mode focus).
  - [ ] Setup `globals.css` colors (Ocean blue/green gradient theme).
  - [ ] Implement `Layout` with sidebar navigation.

### Issue #FE-2: Freighter Wallet Integration
**Category:** `[INTEGRATION]`
**Status:** PENDING
**Priority:** Critical
**Description:** Global wallet state management.
- **Tasks:**
  - [ ] Create `FreighterContext`.
  - [ ] Implement connection logic.
  - [ ] Auto-reconnect on refresh.
  - [ ] Display connected wallet address.

---

## Phase 2: Liquidity Dashboard

### Issue #FE-3: Wallet Connection Flow
**Category:** `[UI/INTEGRATION]`
**Status:** PENDING
**Priority:** High
**Description:** Connect wallet and fetch account data.
- **Tasks:**
  - [ ] "Connect Wallet" button with Freighter detection.
  - [ ] Display connected address truncated.
  - [ ] Show wallet balance (XLM/USDC).
  - [ ] "Disconnect" option.

### Issue #FE-4: Liquidity Score Display
**Category:** `[UI]`
**Status:** PENDING
**Priority:** High
**Description:** Display computed liquidity score prominently.
- **Tasks:**
  - [ ] Fetch transaction history from Horizon.
  - [ ] Calculate score using rule-based engine.
  - [ ] Display score as circular gauge (0-100).
  - [ ] Show breakdown: inflow consistency, outflow stability, frequency.

### Issue #FE-5: Risk Indicator
**Category:** `[UI]`
**Status:** PENDING
**Priority:** High
**Description:** Visual risk level display.
- **Tasks:**
  - [ ] Display risk badge: Low (green), Medium (yellow), High (red).
  - [ ] Show risk factors contributing to level.
  - [ ] Color-coded background based on risk.

---

## Phase 3: Flow Analytics

### Issue #FE-6: Transaction Flow Chart
**Category:** `[UI]`
**Status:** PENDING
**Priority:** Medium
**Description:** Visualize money flow patterns.
- **Tasks:**
  - [ ] Install `recharts`.
  - [ ] Create `FlowChart` component (Area chart).
  - [ ] Display last 30 days of transaction volume.
  - [ ] Distinguish inflow vs outflow.

### Issue #FE-7: Flow Summary Statistics
**Category:** `[UI]`
**Status:** PENDING
**Priority:** Medium
**Description:** Summary metrics of financial behavior.
- **Tasks:**
  - [ ] Total inflow (30 days).
  - [ ] Total outflow (30 days).
  - [ ] Average transaction size.
  - [ ] Transaction count.

---

## Phase 4: Suggestions

### Issue #FE-8: Actionable Recommendations
**Category:** `[UI]`
**Status:** PENDING
**Priority:** Medium
**Description:** AI-powered suggestions based on behavior.
- **Tasks:**
  - [ ] Rule-based suggestion engine.
  - [ ] Display suggestions as cards.
  - [ ] Examples: "Lock portion of incoming funds", "Increase transaction frequency".

---

## Phase 5: Testing & Polish

### Issue #FE-9: Error Handling
**Category:** `[ERROR]`
**Status:** PENDING
**Priority:** Low
**Description:** Graceful error states.
- **Tasks:**
  - [ ] Handle wallet not installed.
  - [ ] Handle network errors.
  - [ ] Handle empty transaction history.

### Issue #FE-10: Responsive Design
**Category:** `[UI]`
**Status:** PENDING
**Priority:** Low
**Description:** Mobile-first PWA.
- [ ] Test on mobile devices.
- [ ] Optimize for small screens.