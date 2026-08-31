# QA Report: Early Warning System

**Issue:** Early Warning System QA
**Tester:** nnennaokoye
**Date:** 2026-08-31
**App URL:** https://fluxid.vercel.app/dashboard/protocol
**Screenshots:** [`docs/grantfox-OSS/early-warning-qa/`](../grantfox-OSS/early-warning-qa/)

---

## Wallets Tested

### Mainnet Accounts
- `GBRKODQYGNV3XR5PKUMIVXDF6YWBBVRFX4NYGTEBUIMRCEVNEFGD3ECS` - Successfully added, report generated, no banner
- `GABFQIK63R2NETJM7T673EAMZN4RJLLGP3OFUEJU5SZVTGWUKULZJNL6` - Successfully added, report generated, no banner
- `GDKIHQ63VDAIEQ2O35WZSZBSD56PR473JGE3UHWM65DUWQ642AGDS7ST` - Error: "Account not found on mainnet", no banner

### Testnet Accounts
- `GDZUZKSEPHEMSWKPI7SARIPNF6O2GWGLDGNKA27XJ6DJ3RWMLHBCILB2` - Successfully added on testnet, but error when switched to mainnet, no banner

---

## Trigger Path

1. Connected wallet successfully
2. Navigated to `/dashboard/protocol` (Protocol Intelligence Overview)
3. Clicked "Add Wallets" button
4. Added wallet addresses on both mainnet and testnet networks
5. Monitored for Early Warning banner appearance after each wallet addition

**Expected:** Early Warning banner should appear when cohort-level risk crosses threshold
**Actual:** No Early Warning banner appeared in any test scenario

---

## Bugs Found

### Bug 1: Early Warning Banner Not Appearing
- **Severity:** CRITICAL
- **Description:** Early Warning banner does not appear when wallets are added to Protocol Intelligence, even when cohort-level metrics change (Average Liquidity Score changed from 51.0 to 42.0, Active Wallets Monitored increased from 0 to 2)
- **Steps to Reproduce:**
  1. Navigate to `/dashboard/protocol`
  2. Click "Add Wallets"
  3. Add valid mainnet wallet addresses (e.g., GBRKODQYGNV3XR5PKUMIVXDF6YWBBVRFX4NYGTEBUIMRCEVNEFGD3ECS)
  4. Observe metrics update (Average Liquidity Score, Active Wallets Monitored)
  5. Monitor for Early Warning banner appearance
- **Expected Behavior:** Early Warning banner should appear when cohort-level risk crosses threshold, showing affected cohort, drop %, and lookback window
- **Actual Behavior:** No banner appears despite metrics changing and multiple wallet additions
- **Screenshots:**
  - Mainnet: `docs/grantfox-OSS/early-warning-qa/protocol-intelligence-no-banner-mainnet.png`
  - Testnet: `docs/grantfox-OSS/early-warning-qa/protocol-intelligence-no-banner-testnet.png`

### Bug 2: Network Switching Errors
- **Severity:** MEDIUM
- **Description:** When testing the same wallet address on different networks, users get "Account not found on this network" errors without clear guidance
- **Steps to Reproduce:**
  1. Add a testnet wallet address successfully (GDZUZKSEPHEMSWKPI7SARIPNF6O2GWGLDGNKA27XJ6DJ3RWMLHBCILB2)
  2. Switch to mainnet
  3. Try to add the same address
  4. Observe "Account not found on mainnet" error
- **Expected Behavior:** Clear indication that the address belongs to a different network, or automatic network detection
- **Actual Behavior:** Generic error message that may confuse users
- **Screenshots:**
  - Mainnet error: `docs/grantfox-OSS/early-warning-qa/account-not-found-error-mainnet.png`
  - Testnet error: `docs/grantfox-OSS/early-warning-qa/account-not-found-error-testnet.png`

---

## Observations & Suggestions

### What Worked Well
- Wallet connection was fast and successful
- Navigation to Protocol Intelligence page was smooth
- "Add Wallets" functionality worked for valid addresses on correct networks
- Metrics updated correctly when wallets were added successfully

### Areas for Improvement
- **Early Warning banner:** No banner appeared during testing, which suggests the feature may not be implemented or the threshold logic isn't triggering
- **Network error handling:** Better guidance needed when addresses are on the wrong network
- **User feedback:** No indication of what threshold triggers the Early Warning alert

---

## Transaction Hashes
No transactions were signed/submitted during this testing session.

---

## Required Actions Completed
- [x] QA report at `docs/qa-reports/qa-early-warning-nnennaokoye.md`
- [x] Screenshots under `docs/grantfox-OSS/early-warning-qa/`
- [x] Google Form https://forms.gle/kLYwDRdJo8WV1RTE7
- [x] In-app feedback sent once
- [x] Unique walkthrough (own wallets/screenshots)
- [ ] PR with `Closes #[issue-number]` + issue comment tagging `@thebabalola` (add issue number when known)

---

## Console Errors
**Tested:** Opened browser console (F12 → Console tab) during:
- Page load on `/dashboard/protocol`
- Adding wallets to Protocol Intelligence
- Network switching between mainnet/testnet

**Results:** No console errors observed during testing. The page loaded without JavaScript errors, and wallet addition operations completed without console warnings.

---

## Additional Notes
- The Early Warning banner is supposed to show: affected cohort, drop %, and lookback window when cohort-level risk crosses threshold
- Tested with multiple wallet combinations but never saw the banner appear
- This suggests either the feature is not yet implemented, the threshold logic is not working, or the banner is hidden/broken
