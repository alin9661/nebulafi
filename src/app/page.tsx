"use client"

import { Dashboard } from "@/components/Dashboard";
import { LandingPage } from "@/components/LandingPage";
import { ParticleBackground } from '@/components/ui/ParticleBackground';
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import React from 'react';

export default function HomePage() {
  const { connected, disconnect } = useWallet();

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
