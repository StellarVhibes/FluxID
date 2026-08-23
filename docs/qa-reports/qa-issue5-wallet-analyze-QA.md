# QA Report: Wallet Connect + Analyze Flow — Issue #5

**Tester:** QA Walkthrough  
**Date:** 2026-08-18  
**Site:** https://fluxid.vercel.app/  
**Issue:** Dashboard wallet analysis — analyze button + network toggle

---

## ✅ Acceptance Criteria Overview

| Criteria | Status | Notes |
|----------|--------|-------|
| Wallet connects successfully (Freighter/Mainnet) | | |
| Analyze button responds after wallet connection | 🐛 Bug #1 | No response on click |
| Network defaults to Mainnet when wallet on Mainnet | 🐛 Bug #2 | Defaults to Testnet; selection doesn't persist on refresh |
| Network toggle persists selection after refresh | 🐛 Bug #2 | Switching to Mainnet then refreshing reverts to Testnet |
| Screenshots captured (analyze flow, network toggle) | 📝 See below | |
| PR will link issue with `Closes #5` | | |
| PR will tag `@thebabalola` for review | | |

---

## 🐛 Bugs / Observations Found

### [Bug #1] Analyze Button Not Responding After Wallet Connection

- **Location:** Dashboard wallet analysis section
- **Expected:** After successfully connecting the wallet and selecting Mainnet, clicking **Analyze** should start the wallet analysis.
- **Actual:** The Freighter wallet connects successfully and Mainnet is selected, but clicking **Analyze** produces no response and the wallet analysis does not start.
- **Impact:** High - prevents the primary wallet analysis flow from being initiated.
- **Screenshot:** `analyze button not responding.PNG`

### [Bug #2] Network Defaults to Testnet and Does Not Persist Mainnet Selection

- **Location:** Network dropdown / wallet connection area
- **Platform:** Laptop / PC (desktop)
- **Expected:** When a wallet connected to Mainnet is active, the network selection should default to Mainnet. If the user manually switches the network to Mainnet, that selection should persist after refreshing the page.
- **Actual:** The connected wallet is on Mainnet, but the network dropdown defaults to **Testnet**. After manually switching the dropdown to **Mainnet**, refreshing the page causes the selection to switch back to **Testnet**.
- **Impact:** High - users may analyze a wallet against the wrong Stellar network, potentially resulting in incorrect wallet information and confusion about the selected network.
- **Evidence:** Screenshot showing the network dropdown with Testnet selected after refreshing, despite Mainnet having been selected previously.

---

## 📸 Screenshot Evidence

All screenshots should be placed in:
```
docs/grantfox-OSS/issue5-QA_wallet-analyze/
├─ analyze button not responding.PNG
├─ After refreshing the page the drop down selects testnet toggle even after switching before refreshing.PNG
├─ Before Refreshing the result page of the analyze wallet.PNG
├─ Before Refreshing.PNG
└─ [additional evidence]
```

---

## ✅ Flow Verification Summary

| Flow | Result |
|------|--------|
| Connect wallet (Freighter) → select Mainnet | ⏳ In progress |
| Click Analyze after wallet connected | ❌ Bug #1 - no response |
| Switch network to Mainnet | ⏳ In progress |
| Refresh page with Mainnet selected | ❌ Bug #2 - reverts to Testnet |
| [Other flows] | ✅/❌ |

---

## 📋 Submission Requirements

- [ ] QA report Markdown file created at `docs/qa-reports/qa-issue5-wallet-analyze-QA.md`
- [ ] Screenshots placed in `docs/grantfox-OSS/issue5-QA_wallet-analyze/`
- [ ] Google Form submitted: https://forms.gle/kLYwDRdJo8WV1RTE7
- [ ] In-app feedback sent via floating button (bottom-right)
- [ ] Telegram group joined: https://t.me/stellarvhibes
- [ ] PR will link issue with `Closes #5`
- [ ] PR will tag `@thebabalola` for review