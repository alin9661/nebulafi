"use client"
import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { ConnectWalletDialog } from '@/components/wallet/WalletSelector';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';

export const HeroSection: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <main className="flex-grow flex flex-col justify-center relative z-10 px-6 pt-10 pb-20">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        <div className="space-y-10 animate-fade-in-up">
          <div className="inline-block border border-white/20 px-3 py-1 rounded-full">
            <span className="text-xs font-mono uppercase tracking-widest text-gray-300">
              Running on Aptos Testnet
            </span>
          </div>
          <h1 className="text-6xl md:text-8xl font-display font-bold leading-tight tracking-tighter">
            MULTISIG <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-400 to-gray-600">
              TREASURY
            </span>
          </h1>
          <p className="text-lg text-gray-300 max-w-lg leading-relaxed font-mono">
            Manage organization reimbursements and assets with secure multi-signature authorization on Aptos. USD Stablecoin native.
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <button
                  className="px-8 py-4 bg-white text-black font-bold font-mono uppercase tracking-widest hover:scale-105 transition-transform flex items-center justify-center space-x-3"
                >
                  <span>Launch Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </DialogTrigger>
              <ConnectWalletDialog close={() => setIsDialogOpen(false)} />
            </Dialog>
          </div>
        </div>

        <div className="relative h-[400px] md:h-[600px] flex items-center justify-center">
           {/* Minimalist Abstract Shape representing Organization/Nodes */}
           <div className="relative w-64 h-64 md:w-96 md:h-96 preserve-3d animate-[float_8s_ease-in-out_infinite]">
              {/* Outer Ring */}
              <div className="absolute inset-0 border border-white/20 rounded-full animate-[spin_30s_linear_infinite]"></div>

              {/* Connecting Nodes */}
              <div className="absolute inset-0 flex items-center justify-center">
                  <div className="absolute w-[120%] h-[1px] bg-white/10 rotate-0"></div>
                  <div className="absolute w-[120%] h-[1px] bg-white/10 rotate-45"></div>
                  <div className="absolute w-[120%] h-[1px] bg-white/10 rotate-90"></div>
                  <div className="absolute w-[120%] h-[1px] bg-white/10 rotate-135"></div>
              </div>

              {/* Core */}
              <div className="absolute inset-[35%] bg-white/5 backdrop-blur-md rounded-full border border-white/30 z-10 animate-pulse-slow"></div>

              {/* Floating Cards */}
              <div className="absolute -right-8 top-16 bg-black border border-white/30 p-4 w-56 animate-[float_5s_ease-in-out_infinite_1s] z-20">
                 <div className="flex items-center justify-between mb-2">
                    <div className="text-[10px] font-mono uppercase text-gray-400">Reimbursement</div>
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                 </div>
                 <div className="font-mono text-xs text-white">Travel Expenses</div>
                 <div className="font-mono text-sm font-bold text-white mt-1">1,200 USDC</div>
                 <div className="mt-2 text-[10px] font-mono text-gray-400 uppercase">Approvals: 2/3</div>
              </div>

              <div className="absolute -left-12 bottom-20 bg-black border border-white/30 p-4 w-48 animate-[float_6s_ease-in-out_infinite_0.5s] z-20">
                 <div className="flex items-center justify-between mb-2">
                    <div className="text-[10px] font-mono uppercase text-gray-400">Governance</div>
                 </div>
                 <div className="font-mono text-xs text-white">Add Signer</div>
                 <div className="w-full bg-gray-800 h-1 mt-3">
                    <div className="bg-white h-full w-[75%]"></div>
                 </div>
              </div>
           </div>
        </div>

      </div>
    </main>
  );
};
