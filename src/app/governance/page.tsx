"use client"
import React, { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Plus, Clock } from 'lucide-react';
import { ProposalModal } from '@/components/modals/ProposalModal';
import { useToast } from '@/components/ui/use-toast';

const proposals = [
  {
    id: 1,
    title: 'Add New Signer to Multisig',
    description: 'Proposal to add Sarah Chen as a new authorized signer to the multisig wallet.',
    category: 'Governance',
    status: 'active',
    votesFor: 75,
    votesAgainst: 25,
    endDate: '2024-03-20',
  },
  {
    id: 2,
    title: 'Increase Spending Limit',
    description: 'Proposal to increase the daily spending limit from 10,000 USDC to 25,000 USDC.',
    category: 'Treasury',
    status: 'active',
    votesFor: 60,
    votesAgainst: 40,
    endDate: '2024-03-18',
  },
  {
    id: 3,
    title: 'Fund Development Team',
    description: 'Allocate 50,000 USDC for Q2 development team compensation and expenses.',
    category: 'Treasury',
    status: 'passed',
    votesFor: 100,
    votesAgainst: 0,
    endDate: '2024-03-10',
  },
  {
    id: 4,
    title: 'Update Threshold to 4/6',
    description: 'Increase signature threshold from 3/5 to 4/6 for enhanced security.',
    category: 'Governance',
    status: 'active',
    votesFor: 50,
    votesAgainst: 50,
    endDate: '2024-03-22',
  },
  {
    id: 5,
    title: 'Partner Treasury Allocation',
    description: 'Allocate 15,000 USDC to partner organizations for joint marketing initiative.',
    category: 'Treasury',
    status: 'failed',
    votesFor: 40,
    votesAgainst: 60,
    endDate: '2024-03-05',
  },
  {
    id: 6,
    title: 'Remove Inactive Signer',
    description: 'Proposal to remove John Doe from signers list due to 90 days of inactivity.',
    category: 'Governance',
    status: 'passed',
    votesFor: 100,
    votesAgainst: 0,
    endDate: '2024-03-01',
  },
];

export default function GovernancePage() {
  const [activeTab, setActiveTab] = useState('Active');
  const [showProposalModal, setShowProposalModal] = useState(false);
  const [proposalFormData, setProposalFormData] = useState({
    title: '',
    category: 'budget',
    endDate: '7 days',
    description: '',
  });
  const { toast } = useToast();

  const handleProposalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowProposalModal(false);
    toast({ title: "Proposal Created", description: "Your proposal has been submitted for voting." });
    setProposalFormData({ title: '', category: 'budget', endDate: '7 days', description: '' });
  };

  const filteredProposals = proposals.filter(proposal => {
    if (activeTab === 'All') return true;
    return proposal.status.toLowerCase() === activeTab.toLowerCase();
  });

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold mb-2 uppercase tracking-tight">GOVERNANCE</h1>
          <p className="text-gray-400 font-mono text-sm">Update multisig signers and spending limits.</p>
        </div>
        <button
          onClick={() => setShowProposalModal(true)}
          className="px-6 py-3 bg-white text-black font-mono text-sm font-bold uppercase tracking-widest flex items-center justify-center space-x-2 hover:bg-gray-200 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New Proposal</span>
        </button>
      </div>

      {/* Governance Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Proposals', value: '15' },
          { label: 'Participation Rate', value: '100%' },
          { label: 'Active Signers', value: '5' },
          { label: 'Threshold', value: '3/5' },
        ].map((stat, i) => (
          <GlassCard key={i} className="p-4 text-center">
            <div className="text-gray-400 text-[10px] font-mono uppercase tracking-widest mb-2">{stat.label}</div>
            <div className="text-2xl font-bold font-display">{stat.value}</div>
          </GlassCard>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex border-b border-white/10 space-x-6">
        {['Active', 'Passed', 'Failed', 'All'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-xs font-mono font-bold uppercase tracking-widest border-b-2 transition-colors ${tab === activeTab ? 'border-white text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Proposals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredProposals.map((proposal) => (
          <GlassCard key={proposal.id} className="flex flex-col h-full hover:border-white/40 transition-colors group">
            <div className="flex justify-between items-start mb-6">
              <div className={`px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-wider border ${proposal.status === 'active' ? 'bg-white text-black border-white' :
                proposal.status === 'passed' ? 'bg-transparent text-gray-300 border-gray-500' :
                  'bg-transparent text-gray-600 border-gray-800 line-through'
                }`}>
                {proposal.status}
              </div>
              <div className="text-xs text-gray-400 font-mono flex items-center border border-white/10 px-2 py-1">
                <Clock className="w-3 h-3 mr-2" /> {proposal.endDate}
              </div>
            </div>

            <div className="mb-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-blue-300 mb-2 block">{proposal.category}</span>
              <h4 className="text-xl font-bold font-display leading-tight mb-3 group-hover:underline decoration-1 underline-offset-4">{proposal.title}</h4>
              <p className="text-sm text-gray-400 font-mono leading-relaxed">{proposal.description}</p>
            </div>

            <div className="mt-auto pt-6 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono uppercase tracking-wider text-gray-400">
                  <span>For</span>
                  <span>{proposal.votesFor}%</span>
                </div>
                <div className="h-1 w-full bg-gray-800 flex">
                  <div className="h-full bg-white" style={{ width: `${proposal.votesFor}%` }}></div>
                </div>
              </div>

              {proposal.status === 'active' && (
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button className="py-2 border border-white/20 hover:bg-white hover:text-black transition-colors font-mono text-xs font-bold uppercase tracking-wider">
                    Vote For
                  </button>
                  <button className="py-2 border border-white/20 hover:bg-white/10 transition-colors font-mono text-xs font-bold uppercase tracking-wider text-gray-300">
                    Vote Against
                  </button>
                </div>
              )}
            </div>
          </GlassCard>
        ))}
      </div>

      <ProposalModal
        isOpen={showProposalModal}
        onClose={() => setShowProposalModal(false)}
        formData={proposalFormData}
        onFormChange={setProposalFormData}
        onSubmit={handleProposalSubmit}
      />
    </div>
  );
}
