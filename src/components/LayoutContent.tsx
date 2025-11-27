"use client"
import { usePathname } from 'next/navigation';
import { RootHeader } from '@/components/RootHeader';
import { RootFooter } from '@/components/RootFooter';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { PropsWithChildren } from 'react';

export const LayoutContent = ({ children }: PropsWithChildren) => {
  const pathname = usePathname();

  // Home page has its own complete design (LandingPage/Dashboard)
  const isHomePage = pathname === '/';

  // Dashboard routes use the sidebar + header layout
  const dashboardRoutes = ['/overview', '/organization', '/admin', '/treasury', '/governance', '/reimbursements', '/members', '/settings'];
  const isDashboardPage = dashboardRoutes.some(route => pathname.startsWith(route));

  const handleDisconnect = () => {
    // Wallet disconnect logic - can be implemented later
    console.log('Disconnect wallet');
  };

  if (isHomePage) {
    // For home page, only render children without the default layout chrome
    return <>{children}</>;
  }

  if (isDashboardPage) {
    // For dashboard pages, render with sidebar and header
    return (
      <div className="h-screen flex text-white relative bg-black">
        <DashboardSidebar onDisconnect={handleDisconnect} isAdmin={true} />
        <main className="flex-1 flex flex-col relative z-10 h-screen">
          <DashboardHeader isAdmin={true} />
          <div className="flex-1 overflow-y-auto p-6 md:p-10 scrollbar-hide">
            <div className="max-w-7xl mx-auto w-full pb-20">
              {children}
            </div>
          </div>
        </main>
      </div>
    );
  }

  // For other pages (contact, etc.), render with the standard layout
  return (
    <div className="mx-auto p-6 pb-12 md:px-8 flex flex-col gap-6">
      <RootHeader />
      {children}
      <RootFooter />
    </div>
  );
};
