"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Settings,
  LogOut,
  Users,
  FileText,
  Vote,
  Landmark,
  Building2,
  UserPlus,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardSidebarProps {
  onDisconnect: () => void;
  isAdmin?: boolean;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  onDisconnect,
  isAdmin = true,
}) => {
  const pathname = usePathname();

  const sidebarItems = [
    { id: "overview", path: "/overview", icon: LayoutDashboard, label: "Overview" },
    { id: "organizations", path: "/organization", icon: Building2, label: "Organizations" },
    ...(isAdmin
      ? [{ id: "admin", path: "/admin", icon: UserPlus, label: "Admin Access" }]
      : []),
    { id: "treasury", path: "/treasury", icon: Landmark, label: "Treasury" },
    { id: "governance", path: "/governance", icon: Vote, label: "Governance" },
    { id: "reimbursements", path: "/reimbursements", icon: FileText, label: "Reimbursements" },
    { id: "members", path: "/members", icon: Users, label: "Members" },
    { id: "settings", path: "/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <aside className="w-20 lg:w-60 h-screen border-r border-border flex-col hidden md:flex z-20 bg-background shrink-0">
      {/* Wordmark */}
      <Link
        href="/"
        className="h-20 flex items-center justify-center lg:justify-start lg:px-6 border-b border-border"
      >
        <span className="font-display text-xl font-medium uppercase tracking-[0.06em] text-foreground hidden lg:inline">
          Nebulafi
          <span className="text-primary ml-1.5">·</span>
        </span>
        <span className="font-display text-2xl font-medium text-foreground lg:hidden">
          N<span className="text-primary">·</span>
        </span>
      </Link>

      {/* Nav */}
      <nav className="flex-1 py-4 flex flex-col gap-0.5 px-3" aria-label="Primary">
        {sidebarItems.map((item) => {
          const isActive =
            pathname === item.path || pathname.startsWith(`${item.path}/`);
          return (
            <Link
              key={item.id}
              href={item.path}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex items-center rounded-sm text-[13px] font-medium transition-colors",
                "justify-center lg:justify-start h-10 w-full lg:px-3 lg:py-2 lg:gap-3",
                isActive
                  ? "bg-primary-tint text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              <item.icon
                className={cn("w-4 h-4 shrink-0", isActive ? "text-primary" : "")}
                strokeWidth={1.75}
              />
              <span className="hidden lg:inline truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer actions */}
      <div className="border-t border-border py-2 px-3">
        <button
          onClick={onDisconnect}
          className={cn(
            "flex items-center rounded-sm text-[13px] font-medium transition-colors",
            "justify-center lg:justify-start h-10 w-full lg:px-3 lg:py-2 lg:gap-3",
            "text-muted-foreground hover:text-foreground hover:bg-accent"
          )}
        >
          <LogOut className="w-4 h-4 shrink-0" strokeWidth={1.75} />
          <span className="hidden lg:inline">Disconnect</span>
        </button>
      </div>
    </aside>
  );
};
