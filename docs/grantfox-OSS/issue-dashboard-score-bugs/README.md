# QA / Verification Report: Dashboard Score & On-Chain Save Bug Fixes

This folder contains verification artifacts and resolution details for GrantFox Campaign Issue #24: `[Bug] Dashboard: Score orb stuck at 0, DNS failure on save, Recent Flow cap, feedback hang`.

## Summary of Fixes

### Bug 1 — Score orb center number stuck at 0 (HIGH)
- **Problem**: After re-analysis, `AnimatedScore`'s center number stayed stuck at 0 while the SVG ring animated, caused by Framer Motion spring unsubscription / unchanged spring target state quirks.
- **Fix**: Reimplemented `AnimatedScore` using precise `requestAnimationFrame` with cubic easing, initializing state directly with target value and smoothly interpolating between re-analysis updates matching the 0.8s SVG ring.
- **Verification**: Center score always synchronizes reliably on initial load, re-analysis, and address updates without getting stuck at 0.

### Bug 2 — Save on-chain DNS failure (CRITICAL)
- **Problem**: `backend/src/config/stellar.config.ts` used unresolvable hostnames `rpc.testnet.stellar.org` and `rpc.mainnet.stellar.org`.
- **Fix**: Updated RPC endpoints to `https://soroban-testnet.stellar.org` and `https://soroban-mainnet.stellar.org` (with environment variable overrides supported). Added comprehensive error handling for RPC timeouts, network errors, and rate limits in `ContractService.syncScore`.
- **Verification**: Backend passes all RPC config tests and captures transaction hash upon confirmed submission.

### Bug 3 — Recent Flow shows only ~30 transactions (MEDIUM)
- **Problem**: `parsePayments` in `scoring.ts` sliced parsed transactions to 30, conflicting with the overall transaction count.
- **Fix**: Removed the artificial 30 slice cap in `parsePayments`. Updated Recent Flow on the dashboard to summarize up to 50 recent transactions and clearly indicate `Showing X of Y tx` with a direct link to the Transactions page.
- **Verification**: No contradiction between Recent Flow and total analyzed transaction counts.

### Bug 4 — Decorative orb PNG has hardcoded "82" (LOW)
- **Problem**: `fluxid_trust_score_orb.png` had a faint hardcoded "82" in its center reading like a duplicate score.
- **Fix**: Cleaned the core glowing gradient of `fluxid_trust_score_orb.png` to remove any text/numbers so it functions as a purely decorative backdrop.
- **Verification**: Asset is clean and free of numeric artifacts.

### Bug 5 — Network toggle keeps stale analysis visible (LOW)
- **Problem**: Switching networks preserved the old network's analysis in state and allowed `Save on-chain` to be clicked for the wrong network.
- **Fix**: `setNetwork` in `AnalysisContext` clears the active analysis and resets `analyzedNetwork`. Added `isStale` visual warning banner when network is switched, and disabled `OnChainSync` until re-analysis on the active network completes.
- **Verification**: Stale analyses are cleanly invalidated and cannot be saved to mismatching networks.

### Bug 6 — Feedback submit hangs (LOW)
- **Problem**: In-app feedback submission lacked an explicit client timeout and hung on "Sending..." if the network stalled.
- **Fix**: Added a 10s `AbortController` timeout to `submitFeedback`. Handled failure/timeout states with a "Failed to send — try again" alert and a retry action button inside the modal.
- **Verification**: Prompt feedback responses, timeouts trigger retry UI, and successful submissions toast and close immediately.
