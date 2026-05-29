import "./globals.css";

import { ThemeProvider } from "@/components/ThemeProvider";
import { WalletProvider } from "@/components/WalletProvider";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Fraunces } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { PropsWithChildren } from "react";
import { QueryProvider } from "@/components/QueryProvider";
import { LayoutContent } from "@/components/LayoutContent";
import { WrongNetworkAlert } from "@/components/WrongNetworkAlert";

const fontDisplay = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

// Geist + Geist Mono ship as a separate package on Next 14.
const fontSans = GeistSans;
const fontMono = GeistMono;

export const metadata: Metadata = {
  title: "Nebulafi · Treasury Management",
  description:
    "Multi-signature blockchain treasury management for the NYU Blockchain Lab, sponsored by Aptos Labs.",
};

const RootLayout = ({ children }: PropsWithChildren) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "flex justify-center min-h-screen bg-background font-sans antialiased",
          fontDisplay.variable,
          fontSans.variable,
          fontMono.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <WalletProvider>
              <main className="flex flex-col w-full">
                <WrongNetworkAlert />
                <LayoutContent>{children}</LayoutContent>
                <Toaster />
              </main>
            </WalletProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
