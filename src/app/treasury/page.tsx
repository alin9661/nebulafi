"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { DepositModal } from "@/components/modals/DepositModal";
import { SendModal } from "@/components/modals/SendModal";
import { useToast } from "@/components/ui/use-toast";

type Asset = {
  symbol: string;
  name: string;
  network: string;
  balance: number;
  valueUsd: number;
  change24h: number;
  allocation: number;
};

type Tx = {
  id: number;
  type: "inflow" | "outflow";
  asset: string;
  amount: number;
  counterparty: string;
  date: string;
  status: "completed" | "pending";
};

const assets: Asset[] = [
  { symbol: "APT", name: "Aptos", network: "Aptos Mainnet", balance: 12543, valueUsd: 118532, change24h: 2.1, allocation: 45 },
  { symbol: "USDC", name: "USD Coin", network: "Aptos Mainnet", balance: 85000, valueUsd: 85000, change24h: 0.0, allocation: 32 },
  { symbol: "USDT", name: "Tether", network: "Aptos Mainnet", balance: 60000, valueUsd: 60000, change24h: -0.1, allocation: 23 },
];

const treasuryTx: Tx[] = [
  { id: 1, type: "inflow", asset: "USDC", amount: 25000, counterparty: "0x1a2b…3c4d", date: "2026-03-15", status: "completed" },
  { id: 2, type: "outflow", asset: "USDC", amount: 1200, counterparty: "0x5e6f…7a8b", date: "2026-03-14", status: "completed" },
  { id: 3, type: "outflow", asset: "APT", amount: 500, counterparty: "0x9c0d…1e2f", date: "2026-03-14", status: "pending" },
  { id: 4, type: "inflow", asset: "USDT", amount: 10000, counterparty: "0x3a4b…5c6d", date: "2026-03-13", status: "completed" },
  { id: 5, type: "outflow", asset: "USDC", amount: 3500, counterparty: "0x7e8f…9a0b", date: "2026-03-12", status: "completed" },
];

const currency = (n: number) =>
  n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const tickerDot: Record<string, string> = {
  APT: "bg-info",
  USDC: "bg-info",
  USDT: "bg-success",
};

export default function TreasuryPage() {
  const totalValue = assets.reduce((sum, a) => sum + a.valueUsd, 0);
  const { toast } = useToast();

  const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositFormData, setDepositFormData] = useState({ asset: "USDC", amount: "" });

  const [showSendModal, setShowSendModal] = useState(false);
  const [sendFormData, setSendFormData] = useState({ recipient: "", asset: "USDC", amount: "" });

  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowDepositModal(false);
    toast({
      title: "Deposit Initiated",
      description: `Depositing ${depositFormData.amount} ${depositFormData.asset} to treasury.`,
    });
    setDepositFormData({ asset: "USDC", amount: "" });
  };

  const handleSendSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSendModal(false);
    toast({ title: "Transaction Created", description: "Awaiting multisig approval (3/5)." });
    setSendFormData({ recipient: "", asset: "USDC", amount: "" });
  };

  // Scaffolded; data wiring lands as the page sections are built up.
  void totalValue;
  void treasuryTx;
  void currency;
  void tickerDot;

  return (
    <div className="space-y-12 px-6 py-12 max-w-[1280px] mx-auto">
      <Card className="p-6">
        <div className="font-display text-2xl text-foreground">Treasury Overview</div>
        <div className="text-sm text-muted-foreground mt-1">
          Page scaffold — sections land in follow-up commits.
        </div>
      </Card>

      <DepositModal
        isOpen={showDepositModal}
        onClose={() => setShowDepositModal(false)}
        formData={depositFormData}
        onFormChange={setDepositFormData}
        onSubmit={handleDepositSubmit}
      />

      <SendModal
        isOpen={showSendModal}
        onClose={() => setShowSendModal(false)}
        formData={sendFormData}
        onFormChange={setSendFormData}
        onSubmit={handleSendSubmit}
      />
    </div>
  );
}
