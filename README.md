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

## Development Commands

### Frontend
```bash
npm run dev          # Start development server
npm run build        # Production build
npm run lint         # ESLint check
npm run fmt          # Format code with Prettier
```

### Move Smart Contract
```bash
npm run move:compile  # Compile the contract
npm run move:test     # Run Move unit tests
npm run move:publish  # Deploy contract
npm run move:upgrade  # Upgrade existing contract
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
npm run deploy
```

## License

This project is developed for the NYU Blockchain Lab.

---

*Sponsored by Aptos Labs*
