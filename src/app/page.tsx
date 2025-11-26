"use client"
import { MessageBoard } from "@/components/MessageBoard";
import { CreateMessage } from "@/components/CreateMessage";


import { Dashboard } from "@/components/Dashboard";
import { LandingPage } from "@/components/LandingPage";
import { ParticleBackground } from '@/components/ui/ParticleBackground';
import React, { useState } from 'react';

export default function HomePage() {
  const [isConnected, setIsConnected] = useState(false);

  // Function to simulate wallet connection
  const handleConnect = () => {
    // In a real dApp, this would trigger Metamask/WalletConnect
    setIsConnected(true);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
  };
  return (
    // <div className="space-y-4">
    //   <MessageBoard />
    //   <CreateMessage />
    // </div>
    <div className="antialiased font-sans bg-black text-white min-h-screen">
      <ParticleBackground />
      <div className="relative z-10">
        {isConnected ? (
          <Dashboard onDisconnect={handleDisconnect} />
        ) : (
          <LandingPage onConnect={handleConnect} />
        )}
      </div>
    </div>
  );
}
