"use client";

import { Dashboard } from "@/components/Dashboard";
import { LandingPage } from "@/components/LandingPage";
import { ParticleBackground } from "@/components/ui/ParticleBackground";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Loader2 } from "lucide-react";
import React from "react";

// `wallet-adapter-react` v8 has a bug where `useWallet().isLoading` never
// resolves to false if no wallet extension is detected (see autoConnect
// useEffect early-return in node_modules/@aptos-labs/wallet-adapter-react
// /dist/index.js:630-683). Two guards keep PR #42's spinner intent intact
// without trapping anonymous visitors:
//   1. Only show the spinner if there is actually a stored session to
//      rehydrate. `AptosWalletName` is the localStorage key the adapter
//      reads at the same call site.
//   2. Safety-net timeout so the spinner is bounded even when the adapter
//      semantics shift again in a future bump.
const SPINNER_TIMEOUT_MS = 1500;

export default function HomePage() {
  const { connected, disconnect, isLoading } = useWallet();
  const [hasStoredWallet, setHasStoredWallet] = React.useState(false);
  const [forceShow, setForceShow] = React.useState(false);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      setHasStoredWallet(!!window.localStorage.getItem("AptosWalletName"));
    }
    const t = setTimeout(() => setForceShow(true), SPINNER_TIMEOUT_MS);
    return () => clearTimeout(t);
  }, []);

  if (isLoading && hasStoredWallet && !forceShow) {
    return (
      <div className="antialiased font-sans bg-black text-white min-h-screen flex items-center justify-center">
        <ParticleBackground />
        <div className="relative z-10 flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-white/60" />
          <span className="text-sm font-mono text-gray-400 uppercase tracking-widest">
            Connecting wallet...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="antialiased font-sans bg-black text-white min-h-screen">
      <ParticleBackground />
      <div className="relative z-10">
        {connected ? (
          <Dashboard onDisconnect={disconnect} />
        ) : (
          <LandingPage />
        )}
      </div>
    </div>
  );
}
