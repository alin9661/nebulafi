"use client";

import { usePathname } from "next/navigation";
import { RootHeader } from "@/components/RootHeader";
import { RootFooter } from "@/components/RootFooter";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { PropsWithChildren } from "react";

export const LayoutContent = ({ children }: PropsWithChildren) => {
  const pathname = usePathname();

  const isHomePage = pathname === "/";

  const dashboardRoutes = [
    "/overview",
    "/organization",
    "/admin",
    "/treasury",
    "/governance",
    "/reimbursements",
    "/members",
    "/settings",
  ];
  const isDashboardPage = dashboardRoutes.some((route) => pathname.startsWith(route));

  const handleDisconnect = () => {
    console.log("Disconnect wallet");
  };

  if (isHomePage) {
    return <>{children}</>;
  }

  if (isDashboardPage) {
    return (
      <div className="h-screen flex bg-background text-foreground relative">
        <DashboardSidebar onDisconnect={handleDisconnect} isAdmin={true} />
        <main className="flex-1 flex flex-col relative z-10 h-screen">
          <DashboardHeader isAdmin={true} />
          <div className="flex-1 overflow-y-auto scrollbar-hide">{children}</div>
        </main>
      </div>
    );
  }

  return (
    <div className="mx-auto p-6 pb-12 md:px-8 flex flex-col gap-6">
      <RootHeader />
      {children}
      <RootFooter />
    </div>
  );
};
