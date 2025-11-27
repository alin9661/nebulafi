"use client"
import React, { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Search, Filter, ShieldCheck, ArrowUpRight } from 'lucide-react';

const organizations = [
  {
    id: 1,
    name: 'Aptos Foundation',
    handle: '@aptosfdn',
    avatar: 'AF',
    category: 'Foundation',
    description: 'Building the safest and most scalable Layer 1 blockchain.',
    treasuryBalance: 50000000,
    memberCount: 127,
    verified: true,
  },
  {
    id: 2,
    name: 'Movement Labs',
    handle: '@movementlabs',
    avatar: 'ML',
    category: 'Protocol',
    description: 'Infrastructure for the next generation of decentralized applications.',
    treasuryBalance: 12500000,
    memberCount: 45,
    verified: true,
  },
  {
    id: 3,
    name: 'Thala Labs',
    handle: '@thalalabs',
    avatar: 'TL',
    category: 'DeFi',
    description: 'Leading DeFi protocol on Aptos with innovative liquidity solutions.',
    treasuryBalance: 8300000,
    memberCount: 32,
    verified: true,
  },
  {
    id: 4,
    name: 'Pontem Network',
    handle: '@pontemnet',
    avatar: 'PN',
    category: 'Infrastructure',
    description: 'Product studio building core infrastructure and applications.',
    treasuryBalance: 6700000,
    memberCount: 28,
    verified: true,
  },
  {
    id: 5,
    name: 'Echelon Market',
    handle: '@echelonmkt',
    avatar: 'EM',
    category: 'DeFi',
    description: 'Decentralized exchange and AMM protocol for Aptos ecosystem.',
    treasuryBalance: 4200000,
    memberCount: 19,
    verified: false,
  },
  {
    id: 6,
    name: 'Aries Markets',
    handle: '@ariesmkts',
    avatar: 'AM',
    category: 'DeFi',
    description: 'Lending and borrowing protocol with competitive rates.',
    treasuryBalance: 3100000,
    memberCount: 15,
    verified: true,
  },
];

export default function OrganizationPage() {
  const [orgSearch, setOrgSearch] = useState('');

  const filteredOrgs = organizations.filter(org =>
    org.name.toLowerCase().includes(orgSearch.toLowerCase()) ||
    org.category.toLowerCase().includes(orgSearch.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold mb-2 uppercase tracking-tight">ORGANIZATIONS</h1>
          <p className="text-gray-400 font-mono text-sm">Explore verified DAOs and Companies on NebulaFi.</p>
        </div>
        <div className="flex items-center space-x-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search organizations..."
              value={orgSearch}
              onChange={(e) => setOrgSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-white/50 font-mono placeholder:text-gray-600"
            />
          </div>
          <button className="px-4 py-2.5 border border-white/10 bg-white/5 hover:bg-white/10 text-white transition-colors">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOrgs.map((org) => (
          <GlassCard key={org.id} className="group hover:border-white/40 transition-all duration-300">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white text-black font-display font-bold text-xl flex items-center justify-center">
                  {org.avatar}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-display font-bold text-lg">{org.name}</h3>
                    {org.verified && <ShieldCheck className="w-4 h-4 text-white" fill="white" stroke="black" />}
                  </div>
                  <div className="text-xs font-mono text-gray-400">{org.handle}</div>
                </div>
              </div>
              <div className="px-2 py-1 border border-white/10 text-[10px] font-mono uppercase tracking-wider text-gray-300">
                {org.category}
              </div>
            </div>

            <p className="text-sm text-gray-400 leading-relaxed font-mono mb-6 h-10 line-clamp-2">
              {org.description}
            </p>

            <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-4 mb-6">
              <div>
                <div className="text-[10px] text-gray-500 font-mono uppercase tracking-widest mb-1">Treasury</div>
                <div className="font-bold font-mono text-white">${(org.treasuryBalance / 1000000).toFixed(1)}M</div>
              </div>
              <div>
                <div className="text-[10px] text-gray-500 font-mono uppercase tracking-widest mb-1">Members</div>
                <div className="font-bold font-mono text-white">{org.memberCount.toLocaleString()}</div>
              </div>
            </div>

            <button
              className="w-full py-2 bg-white/5 border border-white/10 text-white hover:bg-white hover:text-black transition-all font-mono text-xs font-bold uppercase tracking-widest flex items-center justify-center space-x-2 group-hover:bg-white group-hover:text-black"
            >
              <span>View Dashboard</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
