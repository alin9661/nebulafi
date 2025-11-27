"use client"
import React from 'react';
import Link from 'next/link';
import { GlassCard } from '@/components/ui/GlassCard';
import { Hexagon, CreditCard, Clock, PenTool, Users } from 'lucide-react';

// Mock data for overview page
const currentOrg = {
  id: '1',
  name: 'Nebula DAO',
  handle: '@nebuladao',
  description: 'Decentralized infrastructure for the next generation of DeFi apps.',
  category: 'Protocol',
  treasuryBalance: 4500000,
  memberCount: 1240,
  proposalCount: 45,
  verified: true,
  avatar: 'N'
};

const activeProposals = [
  { id: '1', title: 'Q3 Marketing Budget', description: 'Allocate 15,000 USDC for Q3 influencer campaigns.', votesFor: 75, votesAgainst: 25, status: 'active', endDate: '2 days', category: 'budget' },
  { id: '2', title: 'Add New Signer: Sarah', description: 'Add Sarah.apt as a required signer for the multisig.', votesFor: 40, votesAgainst: 60, status: 'active', endDate: '5 hours', category: 'protocol' },
];

const reimbursements = [
  { id: '1', type: 'reimbursement', amount: 450, currency: 'USDC', valueUsd: 450, requester: 'Alice.apt', category: 'Conference Travel', status: 'pending', date: '2 hrs ago', signatures: 1, requiredSignatures: 3, signedByCurrentUser: false },
  { id: '2', type: 'reimbursement', amount: 120, currency: 'USDC', valueUsd: 120, requester: 'Bob.apt', category: 'Software Licenses', status: 'approved', date: '5 hrs ago', signatures: 3, requiredSignatures: 3, signedByCurrentUser: true },
  { id: '5', type: 'reimbursement', amount: 50, currency: 'USDC', valueUsd: 50, requester: 'David.apt', category: 'Hosting', status: 'pending', date: '3 days ago', signatures: 2, requiredSignatures: 3, signedByCurrentUser: true },
];

export default function OverviewPage() {
  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Top Section: Organization Wallet & KPI */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Organization Wallet Card - Aptos Style */}
        <div className="lg:col-span-1 space-y-4">
          <div className="relative h-56 bg-white text-black p-8 flex flex-col justify-between overflow-hidden group shadow-[0_0_50px_rgba(255,255,255,0.1)] transition-all hover:shadow-[0_0_80px_rgba(255,255,255,0.2)]">
            <div className="absolute top-0 right-0 p-32 bg-gray-100 rounded-full blur-3xl opacity-50 -mr-16 -mt-16"></div>

            <div className="relative z-10 flex justify-between items-start">
               <div className="flex items-center space-x-2">
                 <Hexagon className="w-6 h-6" strokeWidth={1.5} />
                 <span className="font-mono text-sm font-bold tracking-widest uppercase">Org Treasury</span>
               </div>
               <div className="px-2 py-0.5 border border-black text-[10px] font-mono font-bold uppercase">Aptos</div>
            </div>

            <div className="relative z-10">
              <div className="text-black/60 text-xs font-mono uppercase tracking-widest mb-1">Total Stablecoins</div>
              <div className="text-4xl font-bold font-display tracking-tight">${(currentOrg.treasuryBalance / 1000000).toFixed(2)}M</div>
            </div>

            <div className="relative z-10 flex justify-between items-end border-t border-black/10 pt-4">
              <div className="font-mono text-xs tracking-widest truncate w-32">
                0x1a2...b3c9
              </div>
              <div className="flex items-center space-x-2">
                 <CreditCard className="w-4 h-4" />
                 <span className="text-xs font-bold">MULTISIG (3/5)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
           <GlassCard className="flex flex-col justify-between group hover:border-white/30 transition-colors">
              <div className="flex justify-between items-start">
                 <div>
                    <div className="text-gray-300 font-mono text-xs uppercase tracking-wider mb-2">Pending Reimbursements</div>
                    <div className="text-3xl font-display font-bold text-white">
                        {reimbursements.filter(r => r.status === 'pending').length}
                    </div>
                 </div>
                 <div className="p-2 bg-white/5 rounded-full group-hover:bg-white/10 transition-colors">
                    <Clock className="text-white w-5 h-5" />
                 </div>
              </div>
              <div className="mt-4 text-xs font-mono text-gray-400">
                 Total Pending: <span className="text-white font-bold">$500.00</span>
              </div>
           </GlassCard>

           <GlassCard className="flex flex-col justify-between group hover:border-white/30 transition-colors">
              <div className="flex justify-between items-start">
                 <div>
                    <div className="text-gray-300 font-mono text-xs uppercase tracking-wider mb-2">Signatures Needed</div>
                    <div className="text-3xl font-display font-bold text-white">
                        {reimbursements.filter(r => r.status === 'pending' && !r.signedByCurrentUser).length}
                    </div>
                 </div>
                 <div className="p-2 bg-white/5 rounded-full group-hover:bg-white/10 transition-colors">
                    <PenTool className="text-white w-5 h-5" />
                 </div>
              </div>
              <div className="mt-4 text-xs font-mono text-gray-400">
                 Action Required
              </div>
           </GlassCard>

           <GlassCard className="flex flex-col justify-between group hover:border-white/30 transition-colors md:col-span-2 h-32">
              <div className="flex justify-between items-center h-full">
                <div className="flex items-center space-x-4">
                   <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                   </div>
                   <div>
                      <div className="text-gray-300 font-mono text-xs uppercase tracking-wider">Active Signers</div>
                      <div className="text-2xl font-display font-bold text-white">5</div>
                   </div>
                </div>
                <div className="h-full w-px bg-white/10 mx-4"></div>
                <div className="flex-1 px-4">
                   <div className="flex justify-between text-xs font-mono mb-2">
                      <span className="text-gray-400">Treasury Utilization</span>
                      <span className="text-white font-bold">12%</span>
                   </div>
                   <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                      <div className="h-full bg-white w-[12%]"></div>
                   </div>
                </div>
              </div>
           </GlassCard>
        </div>
      </div>

      {/* Recent Activity Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <div className="flex justify-between items-end mb-4">
                <h3 className="text-lg font-bold font-display uppercase tracking-wide">Recent Proposals</h3>
                <Link
                  href="/governance"
                  className="text-gray-400 text-xs font-mono hover:text-white uppercase tracking-wider border-b border-transparent hover:border-white transition-all"
                >
                  View All
                </Link>
            </div>
            <div className="space-y-3">
               {activeProposals.slice(0,2).map(p => (
                 <GlassCard key={p.id} className="p-4 flex items-center justify-between hover:bg-white/5 cursor-pointer">
                    <div>
                      <h4 className="font-bold text-sm font-display mb-1">{p.title}</h4>
                      <p className="text-xs text-gray-400 font-mono">{p.endDate} remaining</p>
                    </div>
                    <div className="text-right">
                       <span className="block text-xs font-bold bg-white text-black px-2 py-1 rounded-sm uppercase tracking-wider">{p.status}</span>
                    </div>
                 </GlassCard>
               ))}
            </div>
          </div>
          <div>
            <div className="flex justify-between items-end mb-4">
                <h3 className="text-lg font-bold font-display uppercase tracking-wide">Recent Reimbursements</h3>
                <Link
                  href="/reimbursements"
                  className="text-gray-400 text-xs font-mono hover:text-white uppercase tracking-wider border-b border-transparent hover:border-white transition-all"
                >
                  View All
                </Link>
            </div>
            <div className="space-y-3">
               {reimbursements.slice(0,3).map(r => (
                 <GlassCard key={r.id} className="p-4 flex items-center justify-between hover:bg-white/5 cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-xs font-bold">
                        {r.requester.substring(0,2).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm font-display">{r.requester}</h4>
                        <p className="text-xs text-gray-400 font-mono">{r.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                       <span className="block font-bold font-mono text-sm">{r.amount} {r.currency}</span>
                       <span className={`text-[10px] uppercase font-bold tracking-wider ${r.status === 'approved' ? 'text-green-400' : 'text-gray-500'}`}>{r.status}</span>
                    </div>
                 </GlassCard>
               ))}
            </div>
          </div>
      </div>
    </div>
  );
}
