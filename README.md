# Nebulafi Treasury Management System

A blockchain treasury management system built for the **NYU Blockchain Lab**, sponsored by **Aptos Labs**. This project manages crypto-to-crypto sponsorship flows with secure multi-signature operations and comprehensive governance controls.

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Blockchain** | Aptos with Move smart contracts |
| **Multisig** | MSafe integration for secure treasury operations |
| **Frontend** | React / Next.js with shadcn/ui + TailwindCSS |
| **Backend** | Supabase / PostgreSQL |
| **Deployment** | Vercel |
| **Wallets** | Petra, Martian, Pontem, Fewcha |

## Core Features

- **Eboard Governance Voting** - Democratic decision-making for treasury operations
- **Multi-Signature Transactions** - MSafe-powered secure treasury management
- **Audit Trails** - Complete transaction history and accountability
- **Multi-Wallet Support** - Connect with Petra, Martian, Pontem, or Fewcha wallets
- **Sponsorship Flow Management** - Track and manage crypto-to-crypto sponsorship flows

## Architecture

This project follows a **minimal on-chain principle**—smart contracts handle only essential logic while most functionality lives off-chain for flexibility and cost efficiency.

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (Next.js)                      │
│                     Deployed on Vercel                       │
└─────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│  Supabase/PG    │  │  Aptos Chain    │  │     MSafe       │
│  (Off-chain)    │  │  (On-chain)     │  │  (Multisig)     │
└─────────────────┘  └─────────────────┘  └─────────────────┘
```

### Project Structure

- **`src/`** - Next.js frontend application
- **`contract/`** - Move smart contracts for Aptos
- **`indexer/`** - Rust-based custom indexer (Aptos Indexer SDK)

## Security

- **Formal Verification** - Move Prover for mathematical correctness guarantees
- **Multi-Layer Protection** - Defense-in-depth security patterns
- **Multi-Signature Requirements** - MSafe integration for treasury operations

## Treasury M1 (testnet)

The live treasury runs on the audited native `0x1::multisig_account` framework —
no custom Move on the money path. Reads come from chain view functions
(`src/view-functions/`), writes go through the wallet adapter
(`src/entry-functions/`), and only proposal titles/descriptions live off-chain
in Neon (`proposal_metadata`, keyed by `multisig_addr` + `seq_no`).

### Setup

```bash
bun run db:setup:treasury                      # one-time: create proposal_metadata in Neon
bun run scripts/bootstrap-multisig.testnet.ts  # create the treasury multisig, prints the address
# optional: --owners 0xYOURWALLET --threshold 2 to make your browser wallet an owner
```

Then set in `.env`:

```
NEXT_PUBLIC_MULTISIG_ADDRESS=<printed address>
NEXT_PUBLIC_TREASURY_V1=true   # feature flag; unset/false renders the mock pages
```

### Tests

```bash
bun run test               # Vitest unit tests (builders, view parsers, error mapper)
bun run test:e2e:treasury  # live testnet loop: create → deposit → propose → approve → execute
```

### Browser-wallet spike checklist (T1)

The E2E proves the loop with SDK-signed transactions. To verify the same shapes
through a browser wallet: bootstrap a multisig with your wallet as an owner
(`--owners`), set the env vars, run `bun run dev`, then from the UI:
deposit → propose a transfer → approve with a second owner → execute, and
confirm each transaction lands on the explorer.

## Development Commands

### Frontend
```bash
bun run dev          # Start development server
bun run build        # Production build
bun run test         # Vitest unit tests
bun run lint         # ESLint check
bun run fmt          # Format code with Prettier
```

### Move Smart Contract
```bash
bun run move:compile  # Compile the contract
bun run move:test     # Run Move unit tests
bun run move:publish  # Deploy contract
bun run move:upgrade  # Upgrade existing contract
```

### Indexer
```bash
cd indexer
cargo build           # Build the indexer
cargo run             # Run the indexer
```

## Deployment

Deploy to Vercel:
```bash
bun run deploy
```

## License

This project is developed for the NYU Blockchain Lab.

---

*Sponsored by Aptos Labs*
