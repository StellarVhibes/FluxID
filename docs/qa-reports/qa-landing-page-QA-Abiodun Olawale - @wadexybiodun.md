# QA Report: Landing Page Mainnet Prep

**Tester:** QA Walkthrough  
**Date:** 2026-08-18  
**Site:** https://fluxid.vercel.app/  
**Issue:** Landing Page UI/UX QA for mainnet launch readiness
**Name:** Abiodun Samson Olawale - @wadexybiodun

---

## 🐛 Bugs / Observations Found


### [Bug #1] Analyze Button Not Responding After Wallet Connection

- **Location:** Dashboard wallet analysis section
- **Platform:** Laptop / PC
- **Network:** Mainnet
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
- **Actual:** After analyzing the wallet, FluxID reports **“No transaction history available for this wallet”** and **“0 transactions analyzed.”** However, the connected wallet extension shows that transactions have previously been made from/to the wallet, including both sending and receiving activity.
- **Impact:** High - displaying an empty transaction history when the wallet has existing activity makes the wallet analysis inaccurate and can significantly affect the reliability of FluxID's liquidity and risk assessment.
- **Evidence:** Screenshot showing the FluxID analysis result with **0 transactions / no transaction history**. The tester also verified existing send/receive activity in the wallet extension.




### [Bug #5] Freighter Wallet Redirects to Download Page Despite Being Installed

- **Location:** Connect Wallet → Freighter Wallet
- **Platform:** Mobile
- **Wallet:** Freighter
- **Expected:** When Freighter is already installed, selecting it should detect/use the installed wallet or initiate its supported connection flow.
- **Actual:** Selecting Freighter redirects to the Freighter website/download page even though the Freighter app is already installed on the device.
- **Impact:** Medium - may prevent mobile users with an existing Freighter installation from connecting their wallet.

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

### [Bug #8] Mobile Layout Shifts When Wallet Address Input Is Selected

- **Location:** Wallet address input field
- **Platform:** Mobile
- **Expected:** Selecting or highlighting text in the wallet address field should not change the responsive page layout. The interface should remain within the viewport and accessible.
- **Actual:** Double-tapping the wallet address field and highlighting the address causes the page layout to shift horizontally. Content becomes misaligned/clipped and a large empty area appears on the right side.
- **Impact:** Medium - creates a broken mobile layout and can make parts of the interface difficult to view or use.
- **Screenshot:** Mobile screenshots showing the normal layout and the shifted layout after the address is highlighted.



### [UX Suggestion #1] Provide a General Stellar Wallet Connection Option

- **Location:** Connect Wallet popup
- **Observation:** The wallet connection popup lists individual supported wallets. A general Stellar wallet connection option is not apparent.
- **Suggestion:** Consider providing a general Stellar-compatible wallet connection option, using the appropriate Stellar connection protocol, to make the connection flow more flexible for compatible wallets that are not directly listed.
- **Classification:** UX improvement / feature suggestion, not a confirmed bug.

---

## 📸 Screenshot Evidence

All screenshots are placed in:
```
docs/grantfox-OSS/issue7-QA_landing-page/
