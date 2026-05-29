"use client";

import React, { useState } from "react";
import {
  Bell,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Check,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Organization {
  id: string;
  name: string;
  handle: string;
  category: string;
  treasuryBalance: number;
  memberCount: number;
  verified: boolean;
  avatar: string;
}

const organizations: Organization[] = [
  { id: "1", name: "Nebula DAO", handle: "@nebuladao", category: "Protocol", treasuryBalance: 4500000, memberCount: 1240, verified: true, avatar: "N" },
  { id: "2", name: "Aptos Ventures", handle: "@aptosvc", category: "Investment", treasuryBalance: 12000000, memberCount: 45, verified: true, avatar: "A" },
  { id: "3", name: "Builder Guild", handle: "@builderguild", category: "Social", treasuryBalance: 150000, memberCount: 300, verified: false, avatar: "B" },
];

interface DashboardHeaderProps {
  isAdmin?: boolean;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ isAdmin = true }) => {
  const [currentOrg, setCurrentOrg] = useState<Organization>(organizations[0]);
  const [showOrgDropdown, setShowOrgDropdown] = useState(false);

  return (
    <header className="h-16 border-b border-border flex items-center justify-between px-6 sticky top-0 z-30 bg-background/85 backdrop-blur-md shrink-0">
      {/* Org switcher */}
      <div className="flex items-center gap-4 min-w-0">
        <div className="relative">
          <button
            onClick={() => setShowOrgDropdown(!showOrgDropdown)}
            className="flex items-center gap-3 px-2 py-1.5 rounded-md text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary hover:bg-accent transition-colors"
          >
            <div className="w-8 h-8 bg-secondary text-foreground flex items-center justify-center font-display font-semibold text-sm rounded-md border border-border">
              {currentOrg.avatar}
            </div>
            <div className="hidden sm:block">
              <div className="text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
                Organization
              </div>
              <div className="text-sm font-medium font-display flex items-center gap-1.5 text-foreground">
                {currentOrg.name}
                {showOrgDropdown ? (
                  <ChevronUp className="w-3 h-3 text-foreground" />
                ) : (
                  <ChevronDown className="w-3 h-3 text-muted-foreground" />
                )}
              </div>
            </div>
          </button>

          {showOrgDropdown && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowOrgDropdown(false)}
              />
              <div className="absolute top-full left-0 mt-2 w-72 z-50 animate-fade-in-up">
                <div className="bg-card border border-border rounded-md overflow-hidden shadow-sm">
                  <div className="max-h-80 overflow-y-auto scrollbar-hide">
                    {organizations.map((org) => {
                      const isSelected = currentOrg.id === org.id;
                      return (
                        <button
                          key={org.id}
                          onClick={() => {
                            setCurrentOrg(org);
                            setShowOrgDropdown(false);
                          }}
                          className={cn(
                            "w-full text-left p-3 flex items-center gap-3 transition-colors border-b border-border last:border-0",
                            isSelected ? "bg-primary-tint" : "hover:bg-accent"
                          )}
                        >
                          <div
                            className={cn(
                              "w-8 h-8 flex items-center justify-center font-display font-semibold text-sm rounded-md",
                              isSelected
                                ? "bg-primary text-primary-foreground"
                                : "bg-secondary text-foreground border border-border"
                            )}
                          >
                            {org.avatar}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-sm font-medium font-display flex items-center gap-1.5 text-foreground">
                              {org.name}
                              {org.verified && (
                                <ShieldCheck className="w-3 h-3 text-muted-foreground" />
                              )}
                            </div>
                            <div className="text-[10px] text-muted-foreground font-mono uppercase tracking-[0.08em]">
                              {org.category}
                            </div>
                          </div>
                          {isSelected && (
                            <Check className="w-4 h-4 ml-auto text-primary" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                  <button
                    onClick={() => setShowOrgDropdown(false)}
                    className="w-full p-3 bg-muted hover:bg-accent transition-colors border-t border-border flex items-center justify-center gap-2 text-[11px] font-medium uppercase tracking-[0.08em] text-foreground"
                  >
                    <Plus className="w-3 h-3" />
                    Join / Create new
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="h-6 w-px bg-border mx-2 hidden md:block" />
        <div className="hidden md:flex items-center gap-2 px-2.5 py-1 bg-success-tint border border-success/20 rounded-full">
          <span className="w-1.5 h-1.5 bg-success rounded-full" />
          <span className="text-[10px] font-medium uppercase tracking-[0.1em] text-success">
            Aptos Testnet
          </span>
        </div>
      </div>

      {/* Right cluster */}
      <div className="flex items-center gap-3">
        <button
          className="relative p-2 hover:bg-accent rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4 text-muted-foreground" strokeWidth={1.75} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-primary rounded-full" />
        </button>
        <div className="flex items-center gap-3 pl-3 border-l border-border">
          <div className="text-right hidden sm:block">
            <div className="text-[12px] font-medium text-foreground">
              {isAdmin ? "Admin User" : "Member User"}
            </div>
            <div className="text-[11px] text-muted-foreground font-mono tabular-nums">
              0x1a…bc9
            </div>
          </div>
          <div className="w-9 h-9 bg-secondary border border-border flex items-center justify-center rounded-md">
            <span className="font-mono font-medium text-xs text-foreground">
              {isAdmin ? "AD" : "ME"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
