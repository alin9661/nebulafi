"use client"
import React, { useState } from 'react';
import {
  Bell,
  Hexagon,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Check,
  Plus,
} from 'lucide-react';

interface Organization {
  id: string;
  name: string;
  handle: string;
  category: string;
  treasuryBalance: number;
  memberCount: number;
  verified: boolean;
  avatar: string;
}

const organizations: Organization[] = [
  { id: '1', name: 'Nebula DAO', handle: '@nebuladao', category: 'Protocol', treasuryBalance: 4500000, memberCount: 1240, verified: true, avatar: 'N' },
  { id: '2', name: 'Aptos Ventures', handle: '@aptosvc', category: 'Investment', treasuryBalance: 12000000, memberCount: 45, verified: true, avatar: 'A' },
  { id: '3', name: 'Builder Guild', handle: '@builderguild', category: 'Social', treasuryBalance: 150000, memberCount: 300, verified: false, avatar: 'B' },
];

interface DashboardHeaderProps {
  isAdmin?: boolean;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ isAdmin = true }) => {
  const [currentOrg, setCurrentOrg] = useState<Organization>(organizations[0]);
  const [showOrgDropdown, setShowOrgDropdown] = useState(false);

  return (
    <header className="h-24 border-b border-white/10 flex items-center justify-between px-8 sticky top-0 z-30 bg-black/80 backdrop-blur-md shrink-0">
      <div className="md:hidden flex items-center">
         <Hexagon className="text-white w-6 h-6" />
      </div>

      {/* Org Switcher / Context */}
      <div className="flex items-center">
         <div className="relative">
           <button
             onClick={() => setShowOrgDropdown(!showOrgDropdown)}
             className="flex items-center space-x-3 cursor-pointer group hover:bg-white/5 p-2 rounded-lg transition-colors border border-transparent hover:border-white/10 text-left focus:outline-none"
           >
              <div className="w-8 h-8 bg-white text-black flex items-center justify-center font-display font-bold text-sm">
                 {currentOrg.avatar}
              </div>
              <div className="hidden sm:block">
                 <div className="text-xs font-mono text-gray-400 uppercase tracking-wider">Organization</div>
                 <div className="text-sm font-bold font-display flex items-center gap-2">
                     {currentOrg.name}
                     {showOrgDropdown ? (
                        <ChevronUp className="w-3 h-3 text-white" />
                     ) : (
                        <ChevronDown className="w-3 h-3 text-gray-500 group-hover:text-white" />
                     )}
                 </div>
              </div>
           </button>

           {/* Org Dropdown Menu */}
           {showOrgDropdown && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowOrgDropdown(false)}></div>
                <div className="absolute top-full left-0 mt-2 w-72 z-50 animate-fade-in-up shadow-2xl">
                   <div className="bg-[#0a0a0a] border border-white/20 rounded-none overflow-hidden">
                      <div className="max-h-80 overflow-y-auto scrollbar-hide">
                          {organizations.map(org => (
                            <button
                              key={org.id}
                              onClick={() => {
                                 setCurrentOrg(org);
                                 setShowOrgDropdown(false);
                              }}
                              className={`w-full text-left p-4 flex items-center space-x-3 transition-colors border-b border-white/10 last:border-0 ${
                                currentOrg.id === org.id
                                  ? 'bg-white/10'
                                  : 'hover:bg-white/5'
                              }`}
                            >
                                <div className={`w-8 h-8 flex items-center justify-center font-display font-bold text-sm ${currentOrg.id === org.id ? 'bg-white text-black' : 'bg-black border border-white/20'}`}>
                                   {org.avatar}
                                </div>
                                <div>
                                   <div className="text-sm font-bold font-display flex items-center gap-2 text-white">
                                     {org.name}
                                     {org.verified && <ShieldCheck className="w-3 h-3 text-gray-400" />}
                                   </div>
                                   <div className="text-[10px] text-gray-500 font-mono uppercase tracking-wider">{org.category}</div>
                                </div>
                                {currentOrg.id === org.id && <Check className="w-4 h-4 ml-auto text-white" />}
                            </button>
                          ))}
                      </div>
                      <button
                        onClick={() => {
                           setShowOrgDropdown(false);
                        }}
                        className="w-full p-3 bg-white/5 hover:bg-white hover:text-black transition-colors border-t border-white/10 flex items-center justify-center space-x-2 text-xs font-mono font-bold uppercase tracking-wider"
                      >
                         <Plus className="w-3 h-3" />
                         <span>Join / Create New</span>
                      </button>
                   </div>
                </div>
              </>
           )}
         </div>

         <div className="h-8 w-px bg-white/10 mx-6 hidden md:block"></div>
         <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-gray-300">Aptos Testnet</span>
         </div>
      </div>

      <div className="flex items-center space-x-6">
        <button className="relative p-2 hover:bg-white/5 rounded-full transition-colors">
          <Bell className="w-5 h-5 text-gray-300" />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-white rounded-full"></span>
        </button>
        <div className="flex items-center space-x-4 pl-6 border-l border-white/10">
          <div className="text-right hidden sm:block">
            <div className="text-sm font-bold text-white font-mono uppercase">{isAdmin ? 'Admin User' : 'Member User'}</div>
            <div className="text-xs text-gray-400 font-mono">0x1a...bc9</div>
          </div>
          <div className="w-10 h-10 bg-white/10 flex items-center justify-center border border-white/20">
            <span className="font-bold text-sm">{isAdmin ? 'AD' : 'ME'}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
