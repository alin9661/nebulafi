"use client";

import React, { useState } from "react";
import { Plus, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProposalModal } from "@/components/modals/ProposalModal";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

type ProposalStatus = "active" | "passed" | "failed";
type Proposal = {
  id: number;
  title: string;
  description: string;
  category: "Treasury" | "Governance";
  status: ProposalStatus;
  votesFor: number;
  votesAgainst: number;
  endDate: string;
};

const proposals: Proposal[] = [
  { id: 1, title: "Add New Signer to Multisig", description: "Proposal to add Sarah Chen as a new authorized signer to the multisig wallet.", category: "Governance", status: "active", votesFor: 75, votesAgainst: 25, endDate: "2026-03-20" },
  { id: 2, title: "Increase Spending Limit", description: "Proposal to increase the daily spending limit from 10,000 USDC to 25,000 USDC.", category: "Treasury", status: "active", votesFor: 60, votesAgainst: 40, endDate: "2026-03-18" },
  { id: 3, title: "Fund Development Team", description: "Allocate 50,000 USDC for Q2 development team compensation and expenses.", category: "Treasury", status: "passed", votesFor: 100, votesAgainst: 0, endDate: "2026-03-10" },
  { id: 4, title: "Update Threshold to 4/6", description: "Increase signature threshold from 3/5 to 4/6 for enhanced security.", category: "Governance", status: "active", votesFor: 50, votesAgainst: 50, endDate: "2026-03-22" },
  { id: 5, title: "Partner Treasury Allocation", description: "Allocate 15,000 USDC to partner organizations for joint marketing initiative.", category: "Treasury", status: "failed", votesFor: 40, votesAgainst: 60, endDate: "2026-03-05" },
  { id: 6, title: "Remove Inactive Signer", description: "Proposal to remove John Doe from signers list due to 90 days of inactivity.", category: "Governance", status: "passed", votesFor: 100, votesAgainst: 0, endDate: "2026-03-01" },
];

const TABS = ["Active", "Passed", "Failed", "All"] as const;
type Tab = (typeof TABS)[number];

const stats = [
  { label: "Total Proposals", value: "15" },
  { label: "Participation Rate", value: "100%" },
  { label: "Active Signers", value: "5" },
  { label: "Threshold", value: "3 / 5" },
];

export default function GovernancePage() {
  const [activeTab, setActiveTab] = useState<Tab>("Active");
  const [showProposalModal, setShowProposalModal] = useState(false);
  const [proposalFormData, setProposalFormData] = useState({
    title: "",
    category: "budget",
    endDate: "7 days",
    description: "",
  });
  const { toast } = useToast();

  const handleProposalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowProposalModal(false);
    toast({ title: "Proposal Created", description: "Your proposal has been submitted for voting." });
    setProposalFormData({ title: "", category: "budget", endDate: "7 days", description: "" });
  };

  const filteredProposals = proposals.filter((p) =>
    activeTab === "All" ? true : p.status === activeTab.toLowerCase()
  );

  return (
    <div className="space-y-12 px-6 py-12 max-w-[1280px] mx-auto">
      {/* Page header */}
      <header className="flex flex-col gap-6 pb-8 border-b border-border md:flex-row md:items-end md:justify-between">
        <div className="flex-1">
          <div className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground mb-2">
            Governance · <span className="font-mono text-foreground">FALL 2025</span>
          </div>
          <h1 className="font-display text-5xl md:text-6xl font-medium tracking-[-0.02em] leading-[1.05] mb-3 text-foreground">
            Proposals
          </h1>
          <p className="text-sm text-muted-foreground">
            Update multisig signers, set spending limits, and steer treasury operations.
          </p>
        </div>
        <Button
          onClick={() => setShowProposalModal(true)}
          className="gap-2 bg-primary text-primary-foreground hover:bg-primary-hover shrink-0"
        >
          <Plus className="w-4 h-4" />
          New proposal
        </Button>
      </header>

      {/* Stats row */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label} className="p-5">
            <div className="text-[11px] font-medium uppercase tracking-[0.1em] text-muted-foreground mb-2">
              {s.label}
            </div>
            <div className="font-mono tabular-nums text-3xl font-medium text-foreground leading-[1.1]">
              {s.value}
            </div>
          </Card>
        ))}
      </section>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-border">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "pb-3 -mb-px text-[11px] font-medium uppercase tracking-[0.12em] border-b-2 transition-colors",
              tab === activeTab
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Proposals grid */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredProposals.map((p) => (
          <ProposalCard key={p.id} proposal={p} />
        ))}
        {filteredProposals.length === 0 && (
          <div className="col-span-full py-16 text-center text-muted-foreground text-sm">
            No proposals in this view.
          </div>
        )}
      </section>

      <ProposalModal
        isOpen={showProposalModal}
        onClose={() => setShowProposalModal(false)}
        formData={proposalFormData}
        onFormChange={setProposalFormData}
        onSubmit={handleProposalSubmit}
      />
    </div>
  );
}

function ProposalCard({ proposal }: { proposal: Proposal }) {
  const totalVotes = proposal.votesFor + proposal.votesAgainst;
  const yeaPct = totalVotes ? (proposal.votesFor / totalVotes) * 100 : 0;
  const nayPct = totalVotes ? (proposal.votesAgainst / totalVotes) * 100 : 0;

  return (
    <Card className="flex flex-col p-6 hover:border-border-strong transition-colors group">
      <div className="flex items-start justify-between gap-4 mb-5">
        <StatusPill status={proposal.status} />
        <div className="inline-flex items-center gap-1.5 text-[11px] font-mono tabular-nums text-muted-foreground">
          <Clock className="w-3 h-3" />
          {proposal.endDate}
        </div>
      </div>

      <div className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground mb-2">
        {proposal.category}
      </div>
      <h3 className="font-display text-2xl font-medium tracking-[-0.01em] leading-[1.2] text-foreground mb-3 group-hover:underline decoration-1 underline-offset-4">
        {proposal.title}
      </h3>
      <p className="text-sm text-muted-foreground leading-relaxed mb-6 flex-1">{proposal.description}</p>

      {/* Vote bar */}
      <div className="space-y-2 mt-auto">
        <div className="flex items-center justify-between text-[11px] font-medium uppercase tracking-[0.1em] text-muted-foreground">
          <span>
            Yea <span className="font-mono tabular-nums text-foreground ml-1">{proposal.votesFor}%</span>
          </span>
          <span>
            Nay <span className="font-mono tabular-nums text-foreground ml-1">{proposal.votesAgainst}%</span>
          </span>
        </div>
        <div className="flex h-1.5 w-full rounded-full overflow-hidden bg-border">
          <div className="bg-success" style={{ width: `${yeaPct}%` }} />
          <div className="bg-destructive" style={{ width: `${nayPct}%` }} />
        </div>
      </div>

      {proposal.status === "active" && (
        <div className="grid grid-cols-2 gap-2 pt-5 mt-5 border-t border-border">
          <Button className="bg-primary text-primary-foreground hover:bg-primary-hover">Cast vote</Button>
          <Button variant="outline">View details</Button>
        </div>
      )}
    </Card>
  );
}

function StatusPill({ status }: { status: ProposalStatus }) {
  const map: Record<ProposalStatus, { label: string; cls: string }> = {
    active: { label: "Voting", cls: "border-primary/25 bg-primary-tint text-primary" },
    passed: { label: "Passed", cls: "border-success/25 bg-success-tint text-success" },
    failed: { label: "Failed", cls: "border-destructive/25 bg-destructive/10 text-destructive" },
  };
  const { label, cls } = map[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10.5px] font-semibold uppercase tracking-[0.08em]",
        cls
      )}
    >
      {label}
    </span>
  );
}
