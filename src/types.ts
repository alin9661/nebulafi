export interface Transaction {
  id: string;
  type: "reimbursement" | "deposit" | "service";
  amount: number;
  currency: string;
  valueUsd: number;
  requester: string;
  category: string;
  status: "approved" | "pending" | "rejected" | "executed";
  date: string;
  signatures: number;
  requiredSignatures: number;
  signedByCurrentUser: boolean;
}

export interface Proposal {
  id: string;
  title: string;
  description: string;
  votesFor: number;
  votesAgainst: number;
  status: "active" | "passed" | "failed";
  endDate: string;
  category: "budget" | "protocol" | "personnel";
}

export interface CoinPrice {
  symbol: string;
  price: number;
  change: number;
}

export interface Asset {
  symbol: string;
  name: string;
  balance: number;
  valueUsd: number;
  change24h: number;
  allocation: number;
  icon?: string;
  network?: string;
}

export interface TreasuryTransaction {
  id: string;
  type: "inflow" | "outflow";
  amount: number;
  asset: string;
  counterparty: string;
  date: string;
  status: "confirmed" | "pending";
}

export interface Organization {
  id: string;
  name: string;
  handle: string;
  description: string;
  category: "Protocol" | "Investment" | "Service" | "Social";
  treasuryBalance: number;
  memberCount: number;
  proposalCount: number;
  verified: boolean;
  avatar: string; // Initial or symbol
}

export interface JoinRequest {
  id: string;
  username: string;
  walletAddress: string;
  date: string;
  role: string;
  status: "pending" | "approved" | "rejected";
  message: string;
}

export interface Member {
  id: string;
  name: string;
  handle: string;
  role: "Admin" | "Member" | "Contributor" | "Viewer";
  joinDate: string;
  status: "active" | "inactive";
  avatar: string;
  walletAddress: string;
}
