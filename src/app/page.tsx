"use client"

import { Dashboard } from "@/components/Dashboard";
import { LandingPage } from "@/components/LandingPage";
import { ParticleBackground } from '@/components/ui/ParticleBackground';
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Loader2 } from "lucide-react";
import React from 'react';

export default function HomePage() {
  const { connected, disconnect, isLoading } = useWallet();

  if (isLoading) {
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
