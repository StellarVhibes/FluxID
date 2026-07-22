# 💭 Idea Submission — FluxID + AgriTrust

> Stellar Journey to Mastery — Level 4 (Green Belt) gate.
> Submitted for the Builder Track. AgriTrust is the vertical / go-to-market proof.

---

## What is your idea?

FluxID is programmable trust infrastructure for Stellar. It turns wallet behavior into a real-time, explainable trust score that any platform, protocol, or AI agent can query. AgriTrust is the first vertical built on top of it: a behavioral financial identity layer that lets smallholder farmers borrow against their track record instead of land titles they do not have.

---

## 1. Problem Statement

Financial systems measure balances and collateral. They do not measure behavior, which is what actually predicts reliability. That gap leaves billions of people financially invisible: freelancers with no credit history, lending protocols with no way to assess an on-chain borrower, and smallholder farmers who feed their regions but get classified as high risk by default because they lack formal records. In Web3 the problem is sharper. Wallets are pseudonymous, reputation does not travel, and there is no standard trust layer, so every platform reinvents risk assessment with guesswork.

## 2. Why Stellar?

Stellar is a payments network first, which means it carries the kind of high-volume, real-world transaction behavior our scoring depends on. It settles fast and cheap, so on-chain trust records and per-query agent payments stay economical. Its stablecoin and anchor ecosystem is the settlement rail AgriTrust needs to move value to farmers, and its strongest adoption is exactly where the trust gap hurts most: emerging markets. We build on the existing rails rather than replacing them. We read behavior through Horizon, connect through Freighter, and use Soroban for the on-chain trust record and inter-contract verification.

## 3. Target Users

Two layers. FluxID serves platforms and machines: lending protocols evaluating borrowers, payroll and marketplace systems checking counterparty reliability, and AI agents that pay per query to make autonomous financial decisions. AgriTrust serves the end market: smallholder farmers in West Africa first, plus the cooperatives, microlenders, and insurers who finance them. The entry wedge for early adoption is freelancers and farmers in emerging markets who feel the trust gap directly in their income.

## 4. Technical Architecture

**Frontend:** a Next.js dashboard split into Wallet Intelligence (single-wallet scoring, analytics, transactions, insights) and Protocol Intelligence (ecosystem health, cohorts, risk heatmaps, alerts). Freighter for wallet connection.

**Backend:** a deterministic scoring engine that ingests transactions from Horizon, normalizes XLM and USDC to a common USD value, and computes six behavioral sub-scores (inflow consistency, outflow stability, transaction frequency, flow stability, counterparty diversity, volume). An API-first layer exposes scores, insights, and protocol sync. An AI layer explains scores in plain language but never replaces the deterministic math.

**Contracts (Soroban):** `liquidity_identity` stores each score with a SHA-256 hash of its inputs so anyone can independently re-derive it from public Horizon data and confirm the on-chain record was not tampered with. It emits an event on every write for off-chain indexers, and calls `oracle_registry` to verify that only authorized providers can write scores.

**Data flow:** wallet activity → Horizon ingestion → scoring engine → on-chain verifiable record and API response. For the AgriTrust vertical, that score flows into the `agritrust_vyc` contract, which mints a Verifiable Yield Certificate a lender or insurer can finance.

## 5. Complexity Evaluation

The hard parts are real. Correctly classifying inflows, outflows, and swaps so an asset conversion is never counted as new income, or the score is meaningless. Normalizing multiple assets to a common unit so a USDC wallet and an XLM wallet are compared honestly. Making the score trustless through input-hash verification rather than asking users to trust an admin key. Scaling from single-wallet scoring to whole-protocol analysis, which means asynchronous background sync over thousands of wallets and millions of transactions rather than one HTTP request. And exposing all of it to autonomous agents through pay-per-query access. None of this is a CRUD app.

## 6. Roadmap

**MVP (done):** single-wallet scoring, explainable output, live dashboard, two deployed testnet contracts with verifiable on-chain records, API foundations. Live at fluxid.vercel.app.

**User acquisition:** prove 10+ real testnet users for Green Belt, then 50+ with features driven directly by their feedback for Blue Belt. Onboard test wallets, run demo-driven validation, iterate.

**Mainnet vision:** redeploy the verifiable `liquidity_identity` contract to mainnet with a self-audit, prove real mainnet usage, then launch the AgriTrust vertical on top: farmers build a behavioral identity through supplier and stablecoin activity, FluxID scores it, and VYCs unlock microcredit and parametric insurance. The long-term goal is for FluxID to become the machine-readable trust layer the Stellar ecosystem queries by default.

---

## Notes for submission

- The idea submission gates the Builder Track (Levels 4–7), so this leads with FluxID (the Green Belt horse) and positions AgriTrust as the vertical / go-to-market proof — the stronger pitch. A Startup Track version would lead with AgriTrust instead.
- The form is a single essay field, so the six requirements are labeled sections inside one answer. They split cleanly if separate fields are needed.
- Grounded in what is actually built: testnet only (no mainnet claim), and the AgriTrust frontend does not exist yet (contract + tests do, in a separate repo).
