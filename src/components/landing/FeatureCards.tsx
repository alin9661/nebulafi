"use client"
import React from 'react';
import { Shield, FileText, Users } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';

export const FeatureCards: React.FC = () => {
  return (
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
  );
};
