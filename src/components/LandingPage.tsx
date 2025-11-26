"use client"
import React from 'react';
import { Shield, Zap, Globe, ArrowRight, Wallet, Hexagon, FileText, Users } from 'lucide-react';
import { GlassCard } from './ui/GlassCard';

interface LandingPageProps {
  onConnect: () => void;
}

const Ticker = () => {
  const coins = [
    { name: 'USDC', price: '$1.00', change: '+0.0%' },
    { name: 'APT', price: '$9.45', change: '+2.1%' },
    { name: 'USDT', price: '$1.00', change: '-0.1%' },
    { name: 'DAI', price: '$1.00', change: '+0.0%' },
    { name: 'MOD', price: '$1.00', change: '+0.0%' },
  ];

  return (
    <div className="w-full bg-black border-y border-white/10 py-3 overflow-hidden flex relative z-20">
      <div className="animate-ticker flex whitespace-nowrap">
        {[...coins, ...coins, ...coins, ...coins].map((coin, i) => (
          <div key={i} className="mx-12 flex items-center space-x-3 text-sm font-mono">
            <span className="font-bold text-white">{coin.name}</span>
            <span className="text-gray-300">{coin.price}</span>
            <span className={coin.change.startsWith('+') ? 'text-gray-300' : 'text-gray-500'}>
              {coin.change}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const LandingPage: React.FC<LandingPageProps> = ({ onConnect }) => {
  return (
    <div className="min-h-screen relative flex flex-col">
      {/* Navbar */}
      <nav className="relative z-50 w-full px-6 py-8 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 border border-white flex items-center justify-center">
            <Hexagon className="text-white w-5 h-5" fill="white" />
          </div>
          <span className="text-2xl font-display font-bold text-white tracking-widest uppercase">
            NebulaFi
          </span>
        </div>
        <div className="hidden md:flex space-x-12 text-xs font-mono uppercase tracking-widest text-gray-300">
          <a href="#" className="hover:text-white transition-colors">Org</a>
          <a href="#" className="hover:text-white transition-colors">Treasury</a>
          <a href="#" className="hover:text-white transition-colors">Governance</a>
          <a href="#" className="hover:text-white transition-colors">Contact</a>
        </div>
        <button 
          onClick={onConnect}
          className="group relative px-6 py-2 bg-white text-black font-mono text-sm font-bold uppercase tracking-wider hover:bg-gray-200 transition-colors"
        >
          <span className="flex items-center space-x-2">
            <Wallet className="w-4 h-4" />
            <span>Connect Wallet</span>
          </span>
        </button>
      </nav>

      {/* Hero Section */}
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
              <button 
                onClick={onConnect}
                className="px-8 py-4 bg-white text-black font-bold font-mono uppercase tracking-widest hover:scale-105 transition-transform flex items-center justify-center space-x-3"
              >
                <span>Launch Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
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

      <div className="max-w-7xl mx-auto w-full px-6 pb-24 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <GlassCard className="hover:bg-white hover:text-black group">
            <div className="mb-6 opacity-70 group-hover:opacity-100 transition-opacity">
              <FileText className="w-8 h-8" strokeWidth={1} />
            </div>
            <h3 className="text-xl font-bold mb-4 font-display tracking-wide uppercase">Expense Tracking</h3>
            <p className="text-gray-300 text-sm leading-relaxed font-mono group-hover:text-black/70">
              Submit and track reimbursement requests on-chain. Immutable records for every stablecoin spent.
            </p>
          </GlassCard>
          <GlassCard className="hover:bg-white hover:text-black group">
            <div className="mb-6 opacity-70 group-hover:opacity-100 transition-opacity">
              <Shield className="w-8 h-8" strokeWidth={1} />
            </div>
            <h3 className="text-xl font-bold mb-4 font-display tracking-wide uppercase">Multisig Security</h3>
            <p className="text-gray-300 text-sm leading-relaxed font-mono group-hover:text-black/70">
              Require multiple approvals for transactions. Built on Aptos Managed Fungible Assets.
            </p>
          </GlassCard>
          <GlassCard className="hover:bg-white hover:text-black group">
            <div className="mb-6 opacity-70 group-hover:opacity-100 transition-opacity">
              <Users className="w-8 h-8" strokeWidth={1} />
            </div>
            <h3 className="text-xl font-bold mb-4 font-display tracking-wide uppercase">Member Mgmt</h3>
            <p className="text-gray-300 text-sm leading-relaxed font-mono group-hover:text-black/70">
              Manage permissions, signer roles, and contributor payouts seamlessly.
            </p>
          </GlassCard>
        </div>
      </div>

      <Ticker />
    </div>
  );
};
