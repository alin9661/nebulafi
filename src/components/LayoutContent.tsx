"use client"
import { usePathname } from 'next/navigation';
import { RootHeader } from '@/components/RootHeader';
import { RootFooter } from '@/components/RootFooter';
import { TopBanner } from '@/components/TopBanner';
import { WrongNetworkAlert } from '@/components/WrongNetworkAlert';
import { PropsWithChildren } from 'react';

export const LayoutContent = ({ children }: PropsWithChildren) => {
  const pathname = usePathname();

  // Home page has its own complete design (LandingPage/Dashboard)
  const isHomePage = pathname === '/';

  if (isHomePage) {
    // For home page, only render children without the default layout chrome
    return <>{children}</>;
  }

  // For other pages (analytics, etc.), render with the standard layout
  return (
    <div className="max-w-[1000px] mx-auto p-6 pb-12 md:px-8 flex flex-col gap-6">
      <WrongNetworkAlert />
      <TopBanner />
      <RootHeader />
      {children}
      <RootFooter />
    </div>
  );
};
