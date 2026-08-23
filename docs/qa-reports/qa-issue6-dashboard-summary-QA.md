# QA Report: Dashboard Score Summary — Issue #6

**Tester:** QA Walkthrough  
**Date:** 2026-08-18  
**Site:** https://fluxid.vercel.app/  
**Issue:** Dashboard wallet analysis — results refresh + balance/asset detection

---

## ✅ Acceptance Criteria Overview

| Criteria | Status | Notes |
|----------|--------|-------|
| Wallet analysis results persist after page refresh | 🐛 Bug #3 | Results wiped on refresh |
| Wallet transaction history shows correct count | 🐛 Bug #4 | Reports "No transactions" despite on-chain activity |
| Wallet balance and asset detection are accurate | 🐛 Bug #7 | Displays $0.16 XLM vs actual 5.99999 XLM; Assets: None |
| Wallet analysis results survive mobile↔desktop view switch | 🐛 Bug #6 | Results disappear on view switch |
| Screenshots captured (before/after refresh, balance/asset) | 📝 See below | |
| PR will link issue with `Closes #6` | | |
| PR will tag `@thebabalola` for review | | |

---

## 🐛 Bugs / Observations Found

### [Bug #3] Wallet Analysis Results Disappear After Page Refresh

- **Location:** Dashboard wallet analysis results
- **Platform:** Laptop / PC (desktop)
- **Expected:** After a wallet has been successfully analyzed, the analysis results should remain available when the page is refreshed.
- **Actual:** The wallet analysis results are displayed before refreshing, but after refreshing the page, the analysis result is wiped/removed and the dashboard returns to the state where the analysis results are no longer displayed.
- **Impact:** High - users can lose previously generated wallet analysis results after a normal page refresh and may need to repeat the analysis.
- **Evidence:** Before/after screenshots provided showing the dashboard state before and after refreshing the page.

### [Bug #4] Wallet Transaction History Incorrectly Shows No Transactions

- **Location:** Wallet analysis results / transaction history
- **Platform:** Laptop / PC (desktop)
- **Network:** Mainnet
- **Expected:** The wallet analysis should reflect the wallet's actual on-chain transaction history, including both sent and received transactions.
- **Actual:** After analyzing the wallet, FluxID reports **"No transaction history available for this wallet"** and **"0 transactions analyzed."** However, the connected wallet extension shows that transactions have previously been made from/to the wallet, including both sending and receiving activity.
- **Impact:** High - displaying an empty transaction history when the wallet has existing activity makes the wallet analysis inaccurate and can significantly affect the reliability of FluxID's liquidity and risk assessment.
- **Evidence:** Screenshot showing the FluxID analysis result with **0 transactions / no transaction history**. The tester also verified existing send/receive activity in the wallet extension.

### [Bug #6] Wallet Analysis Results Disappear When Switching Between Mobile and Desktop Views

- **Location:** Wallet analysis results / responsive layout
- **Platform:** Mobile testing
- **Expected:** Existing wallet analysis results should remain available when switching between mobile and desktop views, provided the session/page has not intentionally been reset.
- **Actual:** After a wallet is analyzed, the result disappears when switching between mobile and desktop views, including when switching back from desktop to mobile.
- **Impact:** Medium - users may lose analysis results and be forced to analyze the wallet again.

### [Bug #7] Incorrect Wallet Balance, Asset Detection, and Transaction History

- **Location:** Wallet analysis / Analytics
- **Network:** Stellar Mainnet
- **Expected:** FluxID should accurately reflect the wallet's XLM balance, recognized assets, and on-chain transaction history, including incoming transfers.
- **Actual:** The tested Freighter wallet shows **5.99999 XLM (~$0.94)**, while FluxID displays **XLM = $0.16** and **Assets: None**. FluxID also reports **0 Transactions**, **$0.00 Total Inflow**, **$0.00 Total Outflow**, and no activity, even though the wallet address has previously received a token/asset.
- **Impact:** High - inaccurate wallet and transaction data can significantly affect user trust in FluxID's financial analysis.
- **Evidence:** Screenshots showing the Freighter wallet balance and the corresponding FluxID analysis results.

---

## 📸 Screenshot Evidence

All screenshots should be placed in:
```
docs/grantfox-OSS/issue6-QA_dashboard-summary/
├─ Before Refreshing.PNG
├─ Before Refreshing the result page of the analyze wallet.PNG
├─ After refreshing the page the drop down selects testnet toggle even after switching before refreshing.PNG
├─ analyze button not responding.PNG
├─ No Transaction error.PNG
├─ Analytics page not showing correct result.PNG
├─ Wallet balance mismatch 5.99999 XLM vs $0.16.PNG (or similar)
└─ [additional evidence]
```

---

## ✅ Flow Verification Summary

| Flow | Result |
|------|--------|
| Connect wallet (Freighter) → select Mainnet | ⏳ In progress |
| Click Analyze after wallet connected | ❌ Bug #1 - no response (covered in PR #5) |
| Refresh page with analysis results | ❌ Bug #3 - results wiped |
| Switch between mobile/desktop views | ❌ Bug #6 - results disappear |
| View transaction history | ❌ Bug #4 - shows 0 transactions |
| Check balance/asset detection | ❌ Bug #7 - incorrect XLM amount/assets |
| [Other flows] | ✅/❌ |

---

## 📋 Submission Requirements

- [ ] QA report Markdown file created at `docs/qa-reports/qa-issue6-dashboard-summary-QA.md`
- [ ] Screenshots placed in `docs/grantfox-OSS/issue6-QA_dashboard-summary/`
- [ ] Google Form submitted: https://forms.gle/kLYwDRdJo8WV1RTE7
- [ ] In-app feedback sent via floating button (bottom-right)
- [ ] Telegram group joined: https://t.me/stellarvhibes
- [ ] PR will link issue with `Closes #6`
- [ ] PR will tag `@thebabalola` for review