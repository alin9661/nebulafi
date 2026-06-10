"use client";

import React, { useState } from "react";
import { ArrowDownLeft, ArrowUpRight, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DepositModal } from "@/components/modals/DepositModal";
import { SendModal } from "@/components/modals/SendModal";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { TREASURY_V1 } from "@/constants";
import { TreasuryLive } from "@/components/treasury/TreasuryLive";

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
  // Mock stays the default until the live loop is verified (M1 plan step 4).
  return TREASURY_V1 ? <TreasuryLive /> : <TreasuryMock />;
}

function TreasuryMock() {
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

  return (
    <div className="space-y-12 px-6 py-12 max-w-[1280px] mx-auto">
      {/* Page header */}
      <header className="flex flex-col gap-6 pb-8 border-b border-border md:flex-row md:items-end md:justify-between">
        <div className="flex-1">
          <div className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground mb-2">
            Dashboard · <span className="font-mono text-foreground">FALL 2025</span>
          </div>
          <h1 className="font-display text-5xl md:text-6xl font-medium tracking-[-0.02em] leading-[1.05] mb-3 text-foreground">
            Treasury Overview
          </h1>
          <p className="text-sm text-muted-foreground">
            NYU Blockchain Lab · Last indexed at block{" "}
            <span className="font-mono text-foreground tabular-nums">247,891,432</span> · 2 minutes ago
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button variant="outline" onClick={() => setShowSendModal(true)} className="gap-2">
            <ArrowUpRight className="w-4 h-4" />
            Send
          </Button>
          <Button onClick={() => setShowDepositModal(true)} className="gap-2 bg-primary text-primary-foreground hover:bg-primary-hover">
            <ArrowDownLeft className="w-4 h-4" />
            Deposit
          </Button>
        </div>
      </header>

      {/* KPI row */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Total Treasury Value" value={`$${currency(totalValue)}`} meta={<span><span className="text-success">▲ 2.4%</span> last 30 days</span>} />
        <KpiCard label="Active Proposals" value="3" meta="2 awaiting your vote" />
        <KpiCard label="Multisig Threshold" value="4 / 7" meta="Quorum requirement" />
        <KpiCard label="Members" value="7" meta="2 new this semester" />
      </section>

      {/* Composition table */}
      <section>
        <Card className="overflow-hidden">
          <div className="flex items-baseline justify-between px-6 pt-6 pb-4 border-b border-border">
            <h2 className="font-display text-xl font-medium tracking-[-0.005em] text-foreground m-0">
              Treasury Composition
            </h2>
            <a className="text-[11px] uppercase tracking-[0.08em] text-muted-foreground hover:text-foreground" href="#">
              View ledger →
            </a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-6 py-4 text-[11px] font-medium uppercase tracking-[0.1em] text-muted-foreground">Asset</th>
                  <th className="text-right px-6 py-4 text-[11px] font-medium uppercase tracking-[0.1em] text-muted-foreground">Amount</th>
                  <th className="text-right px-6 py-4 text-[11px] font-medium uppercase tracking-[0.1em] text-muted-foreground">USD Value</th>
                  <th className="text-right px-6 py-4 text-[11px] font-medium uppercase tracking-[0.1em] text-muted-foreground">Allocation</th>
                  <th className="text-right px-6 py-4 text-[11px] font-medium uppercase tracking-[0.1em] text-muted-foreground">24h</th>
                </tr>
              </thead>
              <tbody>
                {assets.map((a) => (
                  <tr key={a.symbol} className="border-b border-border last:border-b-0">
                    <td className="px-6 py-4 font-medium text-foreground">
                      <span className="inline-flex items-center gap-2">
                        <span className={cn("inline-block w-2 h-2 rounded-sm", tickerDot[a.symbol] ?? "bg-muted-foreground")} />
                        {a.symbol}
                        <span className="text-xs text-muted-foreground font-normal ml-1">{a.name}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-mono tabular-nums text-foreground">{a.balance.toLocaleString()}.00</td>
                    <td className="px-6 py-4 text-right font-mono tabular-nums text-muted-foreground">${currency(a.valueUsd)}</td>
                    <td className="px-6 py-4 text-right font-mono tabular-nums">
                      <span className="inline-flex items-center gap-2 justify-end">
                        <span className="inline-block w-[60px] h-1 rounded-full bg-border overflow-hidden align-middle">
                          <span className="block h-full bg-muted-foreground" style={{ width: `${a.allocation}%` }} />
                        </span>
                        {a.allocation}%
                      </span>
                    </td>
                    <td className={cn("px-6 py-4 text-right font-mono tabular-nums text-xs", a.change24h > 0 ? "text-success" : a.change24h < 0 ? "text-destructive" : "text-muted-foreground")}>
                      {a.change24h > 0 ? "+" : ""}
                      {a.change24h.toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </section>

      {/* Recent activity */}
      <section>
        <Card className="overflow-hidden">
          <div className="flex items-baseline justify-between px-6 pt-6 pb-4 border-b border-border">
            <h2 className="font-display text-xl font-medium tracking-[-0.005em] text-foreground m-0">
              Recent Stablecoin Activity
            </h2>
            <a className="text-[11px] uppercase tracking-[0.08em] text-muted-foreground hover:text-foreground" href="#">
              All transactions →
            </a>
          </div>
          <ul className="divide-y divide-border">
            {treasuryTx.map((tx) => {
              const isIn = tx.type === "inflow";
              return (
                <li key={tx.id} className="grid grid-cols-[28px_1fr_auto_auto] items-center gap-4 px-6 py-4 text-sm">
                  <span className={cn(
                    "w-7 h-7 rounded-sm border flex items-center justify-center",
                    isIn ? "border-success/30 text-success" : "border-border text-muted-foreground"
                  )}>
                    {isIn ? <ArrowDownLeft className="w-3.5 h-3.5" /> : <ArrowUpRight className="w-3.5 h-3.5" />}
                  </span>
                  <div className="min-w-0">
                    <div className="text-foreground">
                      <span className="font-medium">{isIn ? "Received" : "Sent"}</span> ·{" "}
                      <span className="font-mono text-muted-foreground">{tx.counterparty}</span>
                    </div>
                    <div className="text-xs text-muted-foreground font-mono tabular-nums mt-0.5">{tx.date}</div>
                  </div>
                  <div className={cn("text-right font-mono tabular-nums font-medium", isIn ? "text-success" : "text-foreground")}>
                    {isIn ? "+" : "−"}
                    {tx.amount.toLocaleString()} {tx.asset}
                  </div>
                  <StatusPill status={tx.status} />
                </li>
              );
            })}
          </ul>
        </Card>
      </section>

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

function KpiCard({ label, value, meta }: { label: string; value: string; meta: React.ReactNode }) {
  return (
    <Card className="p-6">
      <div className="text-[11px] font-medium uppercase tracking-[0.1em] text-muted-foreground mb-2">
        {label}
      </div>
      <div className="font-mono tabular-nums text-3xl font-medium text-foreground leading-[1.1] mb-1">
        {value}
      </div>
      <div className="text-xs text-muted-foreground">{meta}</div>
    </Card>
  );
}

function StatusPill({ status }: { status: Tx["status"] }) {
  if (status === "completed") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-success/25 bg-success-tint text-success text-[10.5px] font-semibold uppercase tracking-[0.08em]">
        Settled
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-warning/25 bg-warning-tint text-warning text-[10.5px] font-semibold uppercase tracking-[0.08em]">
      Pending
    </span>
  );
}
