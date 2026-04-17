# Frontend Issues - FluxID

This document tracks UI/UX and integration tasks for the FluxID dashboard.

Core Principle:
The UI must make one thing obvious in under 3 seconds:

> "This wallet has a trust score."

Everything else supports that.

---

## Phase 1: Foundation

### Issue #FE-1: Project Scaffold & Theme

**Category:** [UI]  
**Status:** COMPLETED  
**Priority:** Critical

**Description:** Initialize Next.js app with FluxID branding focused on clarity and minimalism.

**Tasks:**

- [x] Configure `tailwind.config.ts` (dark mode focus)
- [x] Setup `globals.css` (clean, minimal palette)
- [x] Define design tokens (spacing, typography, colors)
- [x] Implement base `Layout`
- [x] Ensure mobile-first structure from start

---

### Issue #FE-2: Freighter Wallet Integration

**Category:** [INTEGRATION]  
**Status:** COMPLETED  
**Priority:** Critical

**Description:** Handle wallet connection globally.

**Tasks:**

- [x] Create `FreighterContext`
- [x] Implement connect/disconnect logic
- [x] Auto-reconnect on refresh
- [x] Display connected wallet address (truncated)
- [x] Handle "wallet not installed" state cleanly

---

## Phase 2: Core Experience (Score First)

### Issue #FE-3: Wallet Connection Flow

**Category:** [UI/INTEGRATION]  
**Status:** COMPLETED  
**Priority:** High

**Description:** Smooth wallet connection experience.

**Tasks:**

- [x] Prominent "Connect Wallet" CTA
- [x] Detect Freighter wallet
- [x] Display wallet address after connection
- [x] Loading state during connection

---

### Issue #FE-4: Liquidity Score Display

**Category:** [UI]  
**Status:** COMPLETED  
**Priority:** Critical

**Description:** The main product moment — must be instantly clear.

**Tasks:**

- [x] Fetch transaction history from Horizon
- [x] Integrate rule-based scoring engine
- [x] Display score prominently (center of screen)
- [x] Large typography (dominant visual element)
- [x] Circular gauge display
- [x] Label clearly: "Liquidity Score"

---

### Issue #FE-5: Risk Indicator

**Category:** [UI]  
**Status:** COMPLETED  
**Priority:** High

**Description:** Simple risk classification tied to score.

**Tasks:**

- [x] Display risk badge: Low (green), Medium (yellow), High (red)
- [x] Position near score
- [x] Keep explanation minimal

---

## Phase 3: Supporting Insights

### Issue #FE-6: Transaction Flow Chart

**Category:** [UI]  
**Status:** COMPLETED  
**Priority:** Medium

**Description:** Simple visualization of money flow.

**Tasks:**

- [x] Create FlowChart component
- [x] Display last 7-30 days activity
- [x] Show inflow vs outflow
- [x] Simple bar chart visualization

---

### Issue #FE-7: Flow Summary

**Category:** [UI]  
**Status:** COMPLETED  
**Priority:** Medium

**Description:** Lightweight supporting stats.

**Tasks:**

- [x] Total inflow (30 days)
- [x] Total outflow (30 days)
- [x] Transaction count
- [x] Average transaction size

---

## Phase 4: Suggestions

### Issue #FE-8: Actionable Recommendations

**Category:** [UI]  
**Status:** COMPLETED  
**Priority:** Medium

**Description:** Provide simple behavioral insights.

**Tasks:**

- [x] Rule-based suggestion engine
- [x] Display 1-2 suggestions max
- [x] Use clear, human language

---

## Phase 5: UX Polish

### Issue #FE-9: Empty & Error States

**Category:** [ERROR]  
**Status:** COMPLETED  
**Priority:** Medium

**Description:** Handle edge cases cleanly.

**Tasks:**

- [x] No transaction history message
- [x] Network errors retry UI with "Try Again" button
- [x] Wallet not connected state

---

### Issue #FE-10: Loading States

**Category:** [UX]  
**Status:** COMPLETED  
**Priority:** High

**Description:** Smooth transitions during data fetch.

**Tasks:**

- [x] Skeleton loader for score
- [x] Loading indicator during analysis
- [x] UI flicker prevention

---

### Issue #FE-11: Responsive Design

**Category:** [UI]  
**Status:** COMPLETED  
**Priority:** Medium

**Description:** Ensure mobile-first usability.

**Tasks:**

- [x] Optimize for small screens
- [x] Responsive grid layouts
- [x] Test on mobile friendly components

---

## Phase 6: UI/UX Patterns

## First-Time Experience

### Issue #FE-11: Onboarding Product Tour

**Category:** [UX PATTERN]  
**Status:** COMPLETED  
**Priority:** High

**Description:** Guide first-time users with a simple walkthrough.

**Tasks:**

- [x] Create onboarding modal (first visit only)
- [x] Multi-step product tour (2–4 steps max)
- [x] Highlight:
  - Score
  - Risk level
  - Flow chart
- [x] CTA: "Got it" / "Start exploring"
- [x] Store completion state (localStorage)

---

### Issue #FE-12: Navigation Pattern

**Category:** [UX PATTERN]  
**Status:** COMPLETED  
**Priority:** Medium

**Description:** Keep navigation simple and intuitive.

**Tasks:**

- [x] Top navigation bar with logo, tab navigation, and wallet controls
- [x] Sidebar with icon + label navigation (island style)
- [x] Main content area as island with content from clicked sidebar item
- [x] Clear active state indicators

---

## Phase 6: UI States

### Issue #FE-13: Loading States

**Category:** [UI STATE]  
**Status:** COMPLETED  
**Priority:** High

**Description:** Smooth transitions during data fetch.

**Tasks:**

- [x] Skeleton loader for score
- [x] Loading indicator during analysis
- [x] Prevent layout shift/flicker

---

### Issue #FE-14: Empty States

**Category:** [UI STATE]  
**Status:** COMPLETED  
**Priority:** Medium

**Description:** Guide users when no data exists.

**Tasks:**

- [x] “No transactions found” message
- [x] Suggest next action (e.g., “Use active wallet”)

---

### Issue #FE-15: Error States

**Category:** [UI STATE]  
**Status:** COMPLETED  
**Priority:** Medium

**Description:** Handle failures gracefully.

**Tasks:**

- [x] Network error UI
- [x] Retry button
- [x] Wallet not connected state

---

### Issue #FE-16: Success & Feedback States

**Category:** [UI STATE]  
**Status:** COMPLETED  
**Priority:** Medium

**Description:** Provide feedback for user actions.

**Tasks:**

- [x] Toast notification for:
  - Wallet connected
  - Score loaded
- [x] Subtle confirmation messages
- [x] Non-intrusive alerts

---

## Phase 7: Motion & Micro-Interactions

### Issue #FE-17: Motion Design

**Category:** [MOTION]  
**Status:** COMPLETED  
**Priority:** Low

**Description:** Improve perceived quality with subtle animations.

**Tasks:**

- [x] Smooth score animation (count-up effect)
- [x] Fade-in for dashboard elements
- [x] Hover states on cards
- [x] Soft transitions between states

---

## Phase 8: Responsive Design

### Issue #FE-18: Mobile Optimization

**Category:** [UI]  
**Status:** COMPLETED  
**Priority:** Medium

**Description:** Ensure mobile-first usability.

**Tasks:**

- [x] Optimize for small screens
- [x] Responsive layouts
- [x] Stack components vertically
- [x] Ensure score remains primary focus

---

## Design System Reference (For Consistency)

### UX Patterns

- Onboarding Modal (Product Tour)
- Navigation (Minimal / Single screen)

### UI States

- Loading (Skeleton, Spinner)
- Empty (No data guidance)
- Error (Retry flows)
- Success (Toasts, confirmations)

### Motion Design

- Transitions
- Micro-interactions
- Score animation

### Design Style

- Minimalism (clean, uncluttered)
- High contrast focus on score

---

## Success Metrics

- Connect wallet -> See score -> Understand instantly
- Score displayed prominently in under 3 seconds
- Clean, minimal UI focused on one idea

## Implementation Complete

All frontend issues have been implemented:

- Phase 1: Foundation (COMPLETE)
- Phase 2: Core Experience (COMPLETE)
- Phase 3: Supporting Insights (COMPLETE)
- Phase 4: Suggestions (COMPLETE)
- Phase 5: UX Polish (COMPLETE)
- Phase 6: UI/UX Patterns (COMPLETE)
- Phase 7: Motion & Micro-Interactions (COMPLETE)
- Phase 8: Responsive Design (COMPLETE)

Additional hardening during this pass:

- Fixed broken `@stellar/stellar-sdk` import in `lib/scoring.ts` (now `Horizon.Server`)
- Switched transaction-history fetch to the dedicated `/payments` endpoint for accurate inflow/outflow classification
- Wired `analyzeWallet` to call the backend `/score/:accountId` first when `NEXT_PUBLIC_AI_BACKEND_URL` is set, with local scoring as a fallback
