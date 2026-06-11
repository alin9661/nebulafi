# Treasury M1 — make the treasury real on native multisig

> Status: SHIPPED — PR #59 merged to main 2026-06-10 (merge `0391bfa`), deployed to
> Vercel production behind `NEXT_PUBLIC_TREASURY_V1`. Testnet only.
> Reviews: `/plan-eng-review` (8 issues folded, scope reduced) ·
> `/plan-design-review` (4/10 → 9/10, 12 decisions, 0 unresolved) ·
> post-PR multi-agent + CodeRabbit hardening (`ee1c353`, `ae43c20`).
> Remaining manual step: T1 browser-wallet pass (checklist in PR #59 / README).

## Why this exists

Nebulafi's UI promises an institutional DAO treasury (DESIGN.md names Safe, Tally,
Realms, Squads as peers). The implementation today is a 100-line message-board
contract; every feature screen is hardcoded mock data. Only `/message/[addr]` is real.

Product goal (confirmed, one-way door): a real tool the NYU Blockchain Lab uses to
manage a real club treasury — real APT, real signers, mainnet eventually. Security-
critical: testnet-first, audited custody, no client-side keys.

**M1 = chain-views-first, thinnest loop.** No custom Move, no Rust/indexer, no Diesel
migration. Reads from `0x1::multisig_account` view functions + `0x1::coin::balance`;
writes via wallet-adapter; proposal title/description off-chain in Neon keyed
`(multisig_addr, seq_no)`. Indexed history + on-chain metadata = M2. Mainnet = M3,
gated on an external Move/security audit.

## Architecture (verified against /aptos-labs/developer-docs)

```
  Browser (wallet-adapter ^8.3.3)                Aptos testnet
  ┌───────────────────────────┐                 ┌────────────────────────────┐
  │ /treasury  /governance     │   reads (RSC)   │ 0x1::multisig_account      │
  │  (behind feature flag)      │ ───────────────▶│   get_pending_transactions │
  │  src/view-functions/*       │  getAptosClient │   owners / num_sigs        │
  │   getMultisigBalance        │   .view(...)    │   can_be_executed          │
  │   getPendingTransactions    │◀─────────────── │   (+ per-owner approvals — │
  │   getOwners                 │                 │    verify struct in spike) │
  │   getTransactionApprovals   │                 │ 0x1::coin::balance         │
  │  src/entry-functions/*      │  writes (wallet)│   create_transaction       │
  │   depositToTreasury         │ ───────────────▶│   approve / reject         │
  │   proposeTransfer           │ signAndSubmit   │   execute (as multisig)    │
  │   approveTransfer           │                 │                            │
  │   executeTransfer           │                 │                            │
  └──────────────┬──────────────┘                 └────────────────────────────┘
                 │ title/description only
                 ▼
        Neon Postgres (off-chain labels; money facts live ONLY on-chain)
```

Custody rides the audited framework — no custom Move on the money path. Only
human-readable labels are ours, and they stay off-chain in M1.

## Branching workflow

Each feature ships on its own branch off `main`, its own PR (collaborative repo).

```
main
 ├─ feat/multisig-spike      (A — wallet-adapter execute spike; gates all)
 ├─ feat/treasury-entry-fns  (B — write builders + vitest unit)
 ├─ feat/treasury-views      (C — read layer + vitest unit)
 ├─ feat/treasury-ui         (D — both pages + modal rebuild, behind flag; needs B+C)
 └─ feat/treasury-e2e        (E — scripted testnet loop; needs B+C+D)
```
Execution: A → (B ∥ C) → D → E.

## Design decisions (design review, locked)

- **D3 — Pending-only M1.** No executed/rejected history exists without the indexer.
  Treasury "Recent Activity" → replaced by the awaiting-you card; governance
  Passed/Failed/All tabs → removed (not greyed). History returns in M2.
- **D4 — `/governance` is the canonical queue.** Proposals ARE the pending multisig
  transactions. `/treasury` = balance + compact "Awaiting your signature (N)" card
  linking to governance. KPI rows rebuilt signer-first from real reads only:
  Treasury: `APT balance` (anchor) · `Pending N` · `Awaiting your signature N` ·
  `Signers k-of-n`. Governance: `Pending N` · `Threshold k-of-n` · `Signers N`.
- **D5 — Payload-truth confirmation step.** Before any approve/execute signing: a
  dialog showing the DECODED on-chain payload — amount (mono tabular-nums), full
  recipient with copy + explorer link, proposer, seq no — as primary truth; the
  off-chain title visually subordinate. Copy: "You are approving a transfer of
  120.00 APT to 0x4f2…. This is signature 2 of 2 — execution becomes possible after
  you sign." Closes the label≠payload multisig attack.
- **D6 — ONE Propose-Transfer modal.** recipient + amount (APT) + title + optional
  description. Replaces SendModal's role; ProposalModal's category/duration fields
  deleted (multisig txns have neither). "Send" on /treasury and "New proposal" on
  /governance open the same component.
- **D7 — Hero APT balance; all USD cut.** Composition table collapses to one large
  APT balance stat (octas→APT, 2 decimals, Geist Mono tabular-nums). USD values,
  24h change, allocation bars, asset selects deleted (no price feed in M1). Caption:
  "as of <ledger timestamp>" + manual refresh (replaces the fake indexer block line).
- **D8 — Fix bundle:**
  1. **Modal rebuild** — all modals ported to the light system (white `--surface`,
     `--border-strong` inputs, coral focus ring, `--radius-lg`, ONE coral primary
     button). GlassCard/glassmorphism dies — DESIGN.md hard-rejection. Threshold +
     multisig address read from chain.
  2. **Per-viewer button state machine** per pending txn:
     `not-connected → not-an-owner (read-only) → owner-unapproved (Approve/Reject)
     → owner-approved-waiting ("Approved ✓ — waiting on N more", disabled)
     → can_be_executed (EXECUTE — the page's single coral CTA)
     → executing → executed (inline receipt)`.
  3. **Loading + success** — skeletons matching final geometry (no spinners on
     financial data); in-flight button labels ("Confirm in wallet…",
     "Submitting…"); success = inline receipt (tx hash + explorer link + balance
     delta); react-query `invalidateQueries` on balance + pending after every
     confirmed write; pending row exits with a 150–250ms ease-out.
  4. **Empty states** — zero-pending: "No transactions awaiting signatures."
     (governance's quiet pattern); zero-balance: `0.00 APT` + Deposit nudge
     surfacing the multisig address.
  5. **Copy-kill list** — every string with a number traces to a view function or
     dies: "Recent Stablecoin Activity", "FALL 2025", "Quorum requirement",
     "(3/5)", "2 new this semester", "View ledger →", `tickerDot` colors, all
     mock arrays.
  6. **A11y/responsive** — 44px touch targets on money actions; full keyboard flow
     with the DESIGN.md focus ring; `aria-live="polite"` on approval updates;
     modals become full-screen sheets under 640px; KPI grid 4→2→1.
- **Pending-transaction card** (replaces ProposalCard's yea/nay-percentage model —
  k-of-n multisig has no percentages): off-chain title (Fraunces) · decoded payload
  line (`Send 120.00 APT → 0x4f2…a1c`, mono) · status pill with count per DESIGN.md
  (`Awaiting 1/2` → warning; `Executable 2/2` → accent) · approver list (truncated,
  mono) · per-viewer action per D8.2. Yea/nay bars deleted.

## Build steps

0. **Spike (gates all):** prove `create_transaction → approve → execute` entirely
   through wallet-adapter `signAndSubmitTransaction` on testnet (CLI signing proves
   nothing about the adapter). Record working tx shapes. Verify the pending-txn
   struct exposes per-owner votes (needed for "waiting on N more"); if not, find
   the view that does.
1. **Bootstrap multisig:** `aptos multisig create … --num-signatures-required 2`,
   fund with testnet APT, set `NEXT_PUBLIC_MULTISIG_ADDRESS`.
2. **Write builders** (`src/entry-functions/`): `depositToTreasury.ts`,
   `proposeTransfer.ts`, `approveTransfer.ts`, `executeTransfer.ts` — mirror
   `createMessage.ts` (`InputTransactionData`); pure args→payload; vitest unit each.
3. **Read layer** (`src/view-functions/`): `getMultisigBalance.ts`,
   `getPendingTransactions.ts`, `getOwners.ts`, `getTransactionApprovals.ts` —
   wrap `getAptosClient().view(...)`. Server-side reads (RSC); client refetch via
   react-query with short `staleTime` + D8.3 invalidation. Unit-test parsers
   (empty / single / many).
4. **UI** (`feat/treasury-ui`, behind a feature flag until the loop verifies):
   implement D3–D8. Explicit write-error states: user-rejected, not-an-owner,
   threshold-not-met, insufficient-gas, stale-sequence-number — each distinct and
   recoverable. Per DESIGN.md: Execute is the page's only coral CTA; light mode;
   Geist Mono tabular-nums on every number and address.
5. **Config:** `NEXT_PUBLIC_MULTISIG_ADDRESS` in `.env`. Never expose
   `NEXT_MODULE_PUBLISHER_ACCOUNT_PRIVATE_KEY` client-side.

## Tests (first harness in the repo)

```
entry-functions (4 builders)   payload shape              [vitest unit]
view-functions (4 reads)       parse empty/single/many    [vitest unit]
propose → approve → execute    scripts/treasury-loop.testnet.ts  [E2E]
                               asserts balance delta + seq_no
write error states (5)         surfaced, not silent       [unit/component + E2E]
button state machine (D8.2)    each viewer state renders  [component]
```

## Failure modes

| Codepath | Failure | Test | Handling | User sees |
|----------|---------|------|----------|-----------|
| execute | threshold unmet / payload mismatch | unit+E2E | yes | "needs N more approvals" |
| execute | multisig out of gas | E2E | yes | "treasury can't cover gas" |
| propose | caller not an owner | unit | yes | "only owners can propose" |
| any write | user rejects in wallet | component | yes | non-blocking "cancelled" |
| reads | fullnode timeout/RPC error | unit (mock) | retry + error UI | "couldn't load, retry" |
| post-write | stale cached reads | D8.3 invalidation | yes | balance/queue update in place |

## What already exists (reused, not rebuilt)

`0x1::multisig_account` (audited custody) · `createMessage.ts` (builder template) ·
`getAptosClient()` in `src/lib/aptos.ts` (`.view()` primitive) · react-query (via
wallet-adapter) · parameterized-query style from PR #43 · DESIGN.md tokens, KpiCard,
StatusPill-with-count, table conventions, governance's quiet empty state.

## NOT in scope (deferred)

History/tabs (M2, indexer) · USD/price feed/multi-asset (M2) · custom Move metadata
module + indexer storers (M2) · in-app multisig creation + owner management (M2) ·
pending-txn pagination (M2) · members/reimbursements/overview screens (later) ·
mainnet (M3, external audit gate).

## Verification (testnet)

- `bun run test` green; `scripts/treasury-loop.testnet.ts` passes.
- `bun run dev`: connect wallet → deposit → real balance → propose (one modal) →
  payload-truth confirm → approve from k owners (state machine walks) → Execute
  (coral) → inline receipt → balance + queue update without reload.
- Empty-state pass (fresh multisig) and keyboard-only pass (full loop with visible
  focus rings). `bun run lint` + `bun run fmt`; no private key in client bundle.

## Implementation tasks

| ID | Pri | Component | Task |
|----|-----|-----------|------|
| T1 | P1 | spike | Wallet-adapter multisig execute + verify per-owner votes in struct |
| T2 | P1 | tests | Vitest harness + unit coverage for builders & parsers |
| T3 | P1 | tests | Scripted testnet E2E loop |
| T4 | P1 | ui | Five explicit write-error states |
| T5 | P2 | reads | view-functions layer + react-query caching/invalidation |
| T6 | P2 | config | Bootstrap testnet multisig; set env |
| T7 | P1 | ui | Pending-transaction card + per-viewer button state machine |
| T8 | P1 | ui | Single Propose-Transfer modal; port modals to light system |
| T9 | P1 | ui | Payload-truth approve/execute confirmation dialog |
| T10 | P2 | ui | Signer-first KPIs, hero APT balance, history cut, states, copy-kill |
| T11 | P2 | ui | A11y/responsive: 44px targets, keyboard flow, aria-live, mobile sheets |

## Roadmap beyond M1

- **M2** — indexer history + on-chain metadata module, multi-asset + price feed,
  in-app owner management, pagination.
- **M3** — spending-limit policy, multi-org, threat model, mainnet gate requiring an
  external Move/security audit.
