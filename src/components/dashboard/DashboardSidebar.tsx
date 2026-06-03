"use client";

import React, { useEffect, useState } from "react";
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
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface DashboardSidebarProps {
  onDisconnect: () => void;
  isAdmin?: boolean;
}

const COLLAPSE_KEY = "nebulafi.sidebar.collapsed";

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  onDisconnect,
  isAdmin = true,
}) => {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [mounted, setMounted] = useState(false);

  // Hydrate from localStorage on mount so the choice persists across navs
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(COLLAPSE_KEY);
      if (stored === "1") setCollapsed(true);
    } catch {
      /* ignore */
    }
    setMounted(true);
  }, []);

  const toggle = () => {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        window.localStorage.setItem(COLLAPSE_KEY, next ? "1" : "0");
      } catch {
        /* ignore */
      }
      return next;
    });
  };

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
    <TooltipProvider delayDuration={120} skipDelayDuration={0}>
      <aside
        className={cn(
          "h-screen border-r border-border flex-col hidden md:flex z-20 bg-background shrink-0",
          // Width transitions smoothly; only swap once mounted to avoid hydration flash
          mounted ? "transition-[width] duration-200 ease-out" : "",
          collapsed ? "w-[68px]" : "w-60"
        )}
        aria-label="Primary navigation"
      >
        {/* Wordmark */}
        <Link
          href="/"
          className={cn(
            "h-20 flex items-center border-b border-border",
            collapsed ? "justify-center px-0" : "px-6"
          )}
        >
          {collapsed ? (
            <span
              className="font-display text-2xl font-medium text-foreground tracking-tight"
              aria-label="Nebulafi"
            >
              N<span className="text-primary">·</span>
            </span>
          ) : (
            <span className="font-display text-xl font-medium uppercase tracking-[0.06em] text-foreground">
              Nebulafi
              <span className="text-primary ml-1.5">·</span>
            </span>
          )}
        </Link>

        {/* Nav */}
        <nav className="flex-1 py-4 flex flex-col gap-0.5 px-3">
          {sidebarItems.map((item) => {
            const isActive =
              pathname === item.path || pathname.startsWith(`${item.path}/`);
            const link = (
              <Link
                href={item.path}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "group/item flex items-center rounded-sm text-[13px] font-medium transition-colors",
                  collapsed
                    ? "justify-center h-10 w-full"
                    : "px-3 py-2 gap-3 w-full",
                  isActive
                    ? "bg-primary-tint text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                {/* Active-state coral indicator on the left edge */}
                {!collapsed && (
                  <span
                    className={cn(
                      "absolute left-0 w-[2px] h-5 rounded-r",
                      isActive ? "bg-primary" : "bg-transparent"
                    )}
                  />
                )}
                <item.icon
                  className={cn("w-4 h-4 shrink-0", isActive ? "text-primary" : "")}
                  strokeWidth={1.75}
                />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );

            return (
              <div key={item.id} className="relative">
                {collapsed ? (
                  <Tooltip>
                    <TooltipTrigger asChild>{link}</TooltipTrigger>
                    <TooltipContent side="right">{item.label}</TooltipContent>
                  </Tooltip>
                ) : (
                  link
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer actions: disconnect + collapse toggle */}
        <div className="border-t border-border py-2 px-3 flex flex-col gap-0.5">
          {collapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={onDisconnect}
                  className="flex items-center justify-center h-10 w-full rounded-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                  aria-label="Disconnect wallet"
                >
                  <LogOut className="w-4 h-4" strokeWidth={1.75} />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">Disconnect</TooltipContent>
            </Tooltip>
          ) : (
            <button
              onClick={onDisconnect}
              className="flex items-center gap-3 px-3 py-2 rounded-sm text-[13px] font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              <LogOut className="w-4 h-4" strokeWidth={1.75} />
              <span>Disconnect</span>
            </button>
          )}

          {collapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={toggle}
                  className="flex items-center justify-center h-10 w-full rounded-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                  aria-label="Expand sidebar"
                  aria-expanded="false"
                >
                  <PanelLeftOpen className="w-4 h-4" strokeWidth={1.75} />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">Expand sidebar</TooltipContent>
            </Tooltip>
          ) : (
            <button
              onClick={toggle}
              className="flex items-center gap-3 px-3 py-2 rounded-sm text-[13px] font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              aria-label="Collapse sidebar"
              aria-expanded="true"
            >
              <PanelLeftClose className="w-4 h-4" strokeWidth={1.75} />
              <span>Collapse</span>
            </button>
          )}
        </div>
      </aside>
    </TooltipProvider>
  );
};
