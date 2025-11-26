"use client"

import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Settings, 
  LogOut, 
  Bell,
  Search,
  MoreHorizontal,
  CreditCard,
  Users,
  Hexagon,
  FileText,
  Vote,
  CheckCircle,
  XCircle,
  Clock,
  Landmark,
  ArrowUpRight,
  ArrowDownLeft,
  Filter,
  Plus,
  PenTool,
  Check,
  Building2,
  Globe,
  ShieldCheck,
  UserPlus,
  Shield,
  ArrowLeft,
  Send,
  Mail,
  ChevronDown,
  X,
  Wallet,
  ChevronUp,
  User,
  Lock,
  ToggleLeft,
  ToggleRight,
  Save,
  AtSign
} from 'lucide-react';
import { GlassCard } from './ui/GlassCard';
import { Transaction, Proposal, Asset, TreasuryTransaction, Organization, JoinRequest, Member } from '../types';

interface DashboardProps {
  onDisconnect: () => void;
}

// Initial Mock Data with Stablecoins and Multisig Fields
const initialActiveProposals: Proposal[] = [
  { id: '1', title: 'Q3 Marketing Budget', description: 'Allocate 15,000 USDC for Q3 influencer campaigns.', votesFor: 75, votesAgainst: 25, status: 'active', endDate: '2 days', category: 'budget' },
  { id: '2', title: 'Add New Signer: Sarah', description: 'Add Sarah.apt as a required signer for the multisig.', votesFor: 40, votesAgainst: 60, status: 'active', endDate: '5 hours', category: 'protocol' },
  { id: '3', title: 'Contributor Grants', description: 'Monthly payout for core contributors (August).', votesFor: 92, votesAgainst: 8, status: 'passed', endDate: 'Ended', category: 'personnel' },
];

const initialReimbursements: Transaction[] = [
  { id: '1', type: 'reimbursement', amount: 450, currency: 'USDC', valueUsd: 450, requester: 'Alice.apt', category: 'Conference Travel', status: 'pending', date: '2 hrs ago', signatures: 1, requiredSignatures: 3, signedByCurrentUser: false },
  { id: '2', type: 'reimbursement', amount: 120, currency: 'USDC', valueUsd: 120, requester: 'Bob.apt', category: 'Software Licenses', status: 'approved', date: '5 hrs ago', signatures: 3, requiredSignatures: 3, signedByCurrentUser: true },
  { id: '3', type: 'reimbursement', amount: 1200, currency: 'USDC', valueUsd: 1200, requester: 'Charlie.apt', category: 'Equipment', status: 'rejected', date: '1 day ago', signatures: 0, requiredSignatures: 3, signedByCurrentUser: false },
  { id: '4', type: 'service', amount: 2750, currency: 'USDC', valueUsd: 2750, requester: 'Audit Firm A', category: 'Smart Contract Audit', status: 'approved', date: '2 days ago', signatures: 3, requiredSignatures: 3, signedByCurrentUser: true },
  { id: '5', type: 'reimbursement', amount: 50, currency: 'USDC', valueUsd: 50, requester: 'David.apt', category: 'Hosting', status: 'pending', date: '3 days ago', signatures: 2, requiredSignatures: 3, signedByCurrentUser: true },
];

const initialAssets: Asset[] = [
  { symbol: 'USDC', name: 'USD Coin', balance: 500000, valueUsd: 500000, change24h: 0.01, allocation: 80, network: 'Aptos' },
  { symbol: 'USDT', name: 'Tether', balance: 100000, valueUsd: 100000, change24h: 0.02, allocation: 15, network: 'Aptos' },
  { symbol: 'APT', name: 'Aptos', balance: 5000, valueUsd: 47250, change24h: 2.4, allocation: 5, network: 'Aptos' },
];

const initialTreasuryTx: TreasuryTransaction[] = [
  { id: 't1', type: 'inflow', amount: 15000, asset: 'USDC', counterparty: 'Protocol Revenue', date: 'Today, 10:00 AM', status: 'confirmed' },
  { id: 't2', type: 'outflow', amount: 1250, asset: 'USDC', counterparty: 'Grant Recipient A', date: 'Yesterday, 2:30 PM', status: 'confirmed' },
  { id: 't3', type: 'inflow', amount: 5000, asset: 'USDT', counterparty: 'Investment Yield', date: 'Sep 20, 2024', status: 'confirmed' },
];

const initialOrganizations: Organization[] = [
  { id: '1', name: 'Nebula DAO', handle: '@nebuladao', description: 'Decentralized infrastructure for the next generation of DeFi apps.', category: 'Protocol', treasuryBalance: 4500000, memberCount: 1240, proposalCount: 45, verified: true, avatar: 'N' },
  { id: '2', name: 'Aptos Ventures', handle: '@aptosvc', description: 'Investment collective focusing on Move-based ecosystem projects.', category: 'Investment', treasuryBalance: 12000000, memberCount: 45, proposalCount: 12, verified: true, avatar: 'A' },
  { id: '3', name: 'Builder Guild', handle: '@builderguild', description: 'A community of developers building open source tools.', category: 'Social', treasuryBalance: 150000, memberCount: 300, proposalCount: 8, verified: false, avatar: 'B' },
  { id: '4', name: 'DeFi Alliance', handle: '@defialliance', description: 'Global accelerator for decentralized finance startups.', category: 'Service', treasuryBalance: 3200000, memberCount: 85, proposalCount: 23, verified: true, avatar: 'D' },
  { id: '5', name: 'Pixel Artists', handle: '@pixelart', description: 'Grants and treasury management for digital artists.', category: 'Social', treasuryBalance: 50000, memberCount: 120, proposalCount: 15, verified: false, avatar: 'P' },
  { id: '6', name: 'Yield Aggregator', handle: '@yieldag', description: 'Automating yield farming strategies across chains.', category: 'Protocol', treasuryBalance: 8500000, memberCount: 2100, proposalCount: 89, verified: true, avatar: 'Y' },
];

const initialJoinRequests: JoinRequest[] = [
  { id: 'j1', username: 'dev_mike', walletAddress: '0x45...ae12', date: '2 hours ago', role: 'Developer', status: 'pending', message: 'Core contributor for the frontend repo.' },
  { id: 'j2', username: 'sarah_design', walletAddress: '0x88...bb34', date: '5 hours ago', role: 'Designer', status: 'pending', message: 'I want to help with the new governance UI.' },
  { id: 'j3', username: 'investor_dao', walletAddress: '0x12...cc90', date: '1 day ago', role: 'Investor', status: 'pending', message: 'Representative from Aptos Capital.' },
];

const initialMembers: Member[] = [
    { id: 'm1', name: 'Alice', handle: '@alice', role: 'Admin', joinDate: 'Jan 15, 2024', status: 'active', avatar: 'A', walletAddress: '0x1a...bc9' },
    { id: 'm2', name: 'Bob', handle: '@bob_builds', role: 'Member', joinDate: 'Feb 02, 2024', status: 'active', avatar: 'B', walletAddress: '0x2b...cd1' },
    { id: 'm3', name: 'Charlie', handle: '@charlie_dev', role: 'Contributor', joinDate: 'Mar 10, 2024', status: 'active', avatar: 'C', walletAddress: '0x3c...de2' },
    { id: 'm4', name: 'David', handle: '@dave_invest', role: 'Member', joinDate: 'Apr 05, 2024', status: 'inactive', avatar: 'D', walletAddress: '0x4d...ef3' },
    { id: 'm5', name: 'Eve', handle: '@eve_security', role: 'Admin', joinDate: 'Jan 20, 2024', status: 'active', avatar: 'E', walletAddress: '0x5e...fa4' },
    { id: 'm6', name: 'Frank', handle: '@frankie', role: 'Viewer', joinDate: 'May 12, 2024', status: 'active', avatar: 'F', walletAddress: '0x6f...123' },
];

export const Dashboard: React.FC<DashboardProps> = ({ onDisconnect }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [reimbursements, setReimbursements] = useState<Transaction[]>(initialReimbursements);
  const [assets] = useState<Asset[]>(initialAssets);
  const [treasuryTx, setTreasuryTx] = useState<TreasuryTransaction[]>(initialTreasuryTx);
  const [organizations] = useState<Organization[]>(initialOrganizations);
  const [orgSearch, setOrgSearch] = useState('');
  const [joinRequests, setJoinRequests] = useState<JoinRequest[]>(initialJoinRequests);
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [memberSearch, setMemberSearch] = useState('');
  const [activeProposals, setActiveProposals] = useState<Proposal[]>(initialActiveProposals);
  
  // Organization Context State
  const [currentOrg, setCurrentOrg] = useState<Organization>(initialOrganizations[0]);
  const [showOrgDropdown, setShowOrgDropdown] = useState(false);

  // Organization Detail View State (Directory)
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [myJoinRequests, setMyJoinRequests] = useState<Record<string, 'none' | 'pending' | 'joined'>>({});
  const [joinForm, setJoinForm] = useState({ role: 'Contributor', message: '' });
  
  // Admin Role Simulation & Settings
  const [isAdmin, setIsAdmin] = useState(true);
  const [profileForm, setProfileForm] = useState({ displayName: 'Admin User', email: 'admin@nebula.fi', bio: 'Building the future of finance.' });
  const [notifications, setNotifications] = useState({ email: true, push: false });
  const [twoFactor, setTwoFactor] = useState(false);

  // Modal States
  const [showReimbursementModal, setShowReimbursementModal] = useState(false);
  const [reimbursementForm, setReimbursementForm] = useState({
    amount: '',
    category: 'General',
    description: '',
    currency: 'USDC'
  });

  const [showProposalModal, setShowProposalModal] = useState(false);
  const [proposalForm, setProposalForm] = useState({
    title: '',
    description: '',
    category: 'budget',
    endDate: '7 days'
  });

  const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositForm, setDepositForm] = useState({
    asset: 'USDC',
    amount: ''
  });

  const [showSendModal, setShowSendModal] = useState(false);
  const [sendForm, setSendForm] = useState({
    asset: 'USDC',
    recipient: '',
    amount: ''
  });

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteForm, setInviteForm] = useState({
    recipient: '',
    role: 'Member',
    message: ''
  });

  // Handle Approve/Sign Interaction
  const handleApprove = (id: string) => {
    setReimbursements(prev => prev.map(tx => {
      if (tx.id === id && !tx.signedByCurrentUser && tx.status === 'pending') {
        const newSigCount = tx.signatures + 1;
        // Check if threshold reached
        const newStatus = newSigCount >= tx.requiredSignatures ? 'approved' : 'pending';
        return {
          ...tx,
          signatures: newSigCount,
          signedByCurrentUser: true,
          status: newStatus
        };
      }
      return tx;
    }));
  };

  const handleJoinRequest = (id: string, action: 'approve' | 'reject') => {
    setJoinRequests(prev => prev.map(req => 
      req.id === id ? { ...req, status: action === 'approve' ? 'approved' : 'rejected' } : req
    ));
  };

  const submitJoinApplication = (orgId: string) => {
      // Simulate API call
      setTimeout(() => {
          setMyJoinRequests(prev => ({ ...prev, [orgId]: 'pending' }));
          setJoinForm({ role: 'Contributor', message: '' }); // Reset form
      }, 500);
  };

  const handleSubmitReimbursement = (e: React.FormEvent) => {
    e.preventDefault();
    const newReimbursement: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'reimbursement',
      amount: parseFloat(reimbursementForm.amount),
      currency: reimbursementForm.currency,
      valueUsd: parseFloat(reimbursementForm.amount), // Assuming 1:1 for stablecoins for simplicity
      requester: 'Me.apt', // Hardcoded for demo
      category: reimbursementForm.category,
      status: 'pending',
      date: 'Just now',
      signatures: 0,
      requiredSignatures: 3,
      signedByCurrentUser: false
    };

    setReimbursements([newReimbursement, ...reimbursements]);
    setShowReimbursementModal(false);
    setReimbursementForm({ amount: '', category: 'General', description: '', currency: 'USDC' });
  };

  const handleProposalSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const newProposal: Proposal = {
          id: Math.random().toString(36).substr(2, 9),
          title: proposalForm.title,
          description: proposalForm.description,
          votesFor: 0,
          votesAgainst: 0,
          status: 'active',
          endDate: proposalForm.endDate,
          category: proposalForm.category as any
      };
      setActiveProposals([newProposal, ...activeProposals]);
      setShowProposalModal(false);
      setProposalForm({ title: '', description: '', category: 'budget', endDate: '7 days' });
  };

  const handleDepositSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const newTx: TreasuryTransaction = {
          id: Math.random().toString(36).substr(2, 9),
          type: 'inflow',
          amount: parseFloat(depositForm.amount),
          asset: depositForm.asset,
          counterparty: 'Self Deposit',
          date: 'Just now',
          status: 'confirmed'
      };
      setTreasuryTx([newTx, ...treasuryTx]);
      setShowDepositModal(false);
      setDepositForm({ asset: 'USDC', amount: '' });
  };

  const handleSendSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const newTx: TreasuryTransaction = {
          id: Math.random().toString(36).substr(2, 9),
          type: 'outflow',
          amount: parseFloat(sendForm.amount),
          asset: sendForm.asset,
          counterparty: sendForm.recipient,
          date: 'Just now',
          status: 'pending' // Outflows typically need multisig approval
      };
      setTreasuryTx([newTx, ...treasuryTx]);
      setShowSendModal(false);
      setSendForm({ asset: 'USDC', recipient: '', amount: '' });
  };

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate Invite
    setShowInviteModal(false);
    setInviteForm({ recipient: '', role: 'Member', message: '' });
  };

  const renderOverview = () => (
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
                <button 
                  onClick={() => setActiveTab('governance')}
                  className="text-gray-400 text-xs font-mono hover:text-white uppercase tracking-wider border-b border-transparent hover:border-white transition-all"
                >
                  View All
                </button>
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
                <button 
                  onClick={() => setActiveTab('reimbursements')}
                  className="text-gray-400 text-xs font-mono hover:text-white uppercase tracking-wider border-b border-transparent hover:border-white transition-all"
                >
                  View All
                </button>
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

  const renderTreasury = () => (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-display font-bold">TREASURY</h2>
        <div className="flex space-x-2">
           <button 
             onClick={() => setShowDepositModal(true)}
             className="px-4 py-2 bg-white text-black font-mono text-xs font-bold uppercase tracking-wider flex items-center space-x-2 hover:bg-gray-200"
           >
             <ArrowDownLeft className="w-4 h-4" />
             <span>Deposit</span>
           </button>
           <button 
             onClick={() => setShowSendModal(true)}
             className="px-4 py-2 border border-white text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center space-x-2 hover:bg-white hover:text-black transition-colors"
           >
             <ArrowUpRight className="w-4 h-4" />
             <span>Send</span>
           </button>
        </div>
      </div>

      {/* Asset Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {assets.map((asset) => (
          <GlassCard key={asset.symbol} className="relative overflow-hidden group">
             <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-colors"></div>
             <div className="relative z-10 flex justify-between items-start mb-6">
                <div className="flex items-center space-x-3">
                   <div className="w-10 h-10 border border-white/20 flex items-center justify-center font-display font-bold text-lg bg-black">
                      {asset.symbol === 'APT' ? <Hexagon className="w-5 h-5" /> : asset.symbol[0]}
                   </div>
                   <div>
                      <div className="font-bold font-display text-lg">{asset.name}</div>
                      <div className="text-xs text-gray-400 font-mono">{asset.network}</div>
                   </div>
                </div>
                <div className={`text-xs font-mono px-2 py-1 border ${asset.change24h >= 0 ? 'border-white text-white' : 'border-gray-600 text-gray-400'}`}>
                   {asset.change24h > 0 ? '+' : ''}{asset.change24h}%
                </div>
             </div>
             <div className="space-y-1">
                <div className="text-2xl font-bold font-mono tracking-tighter">{asset.balance.toLocaleString()} {asset.symbol}</div>
                <div className="text-sm text-gray-400 font-mono tracking-wide">${asset.valueUsd.toLocaleString()}</div>
             </div>
             <div className="mt-6">
                <div className="flex justify-between text-[10px] uppercase font-mono text-gray-400 mb-2">
                   <span>Portfolio Allocation</span>
                   <span>{asset.allocation}%</span>
                </div>
                <div className="w-full h-1 bg-gray-800">
                   <div className="h-full bg-white" style={{ width: `${asset.allocation}%` }}></div>
                </div>
             </div>
          </GlassCard>
        ))}
      </div>

      {/* Treasury Transactions */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold font-display uppercase tracking-wide">Recent Stablecoin Activity</h3>
        <div className="border border-white/10 bg-black/20">
          <table className="w-full text-left">
            <thead>
               <tr className="border-b border-white/10 text-gray-400 text-xs font-mono uppercase tracking-wider">
                  <th className="p-4 font-normal">Type</th>
                  <th className="p-4 font-normal">Asset</th>
                  <th className="p-4 font-normal">Amount</th>
                  <th className="p-4 font-normal">Counterparty</th>
                  <th className="p-4 font-normal">Date</th>
                  <th className="p-4 font-normal text-right">Status</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
               {treasuryTx.map((tx) => (
                  <tr key={tx.id} className="hover:bg-white/[0.02] transition-colors">
                     <td className="p-4">
                        <div className={`inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider ${tx.type === 'inflow' ? 'text-white' : 'text-gray-400'}`}>
                           {tx.type === 'inflow' ? <ArrowDownLeft className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                           <span>{tx.type}</span>
                        </div>
                     </td>
                     <td className="p-4 font-mono text-sm">{tx.asset}</td>
                     <td className="p-4 font-mono font-bold text-sm">{tx.amount.toLocaleString()}</td>
                     <td className="p-4 text-sm text-gray-300 font-mono">{tx.counterparty}</td>
                     <td className="p-4 text-xs text-gray-400 font-mono">{tx.date}</td>
                     <td className="p-4 text-right">
                        <span className="text-[10px] border border-white/20 px-2 py-1 text-gray-300 uppercase tracking-wider">{tx.status}</span>
                     </td>
                  </tr>
               ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderGovernance = () => (
    <div className="space-y-8 animate-fade-in-up">
       <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
           <h2 className="text-3xl font-display font-bold mb-2">GOVERNANCE</h2>
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
              className={`pb-3 text-xs font-mono font-bold uppercase tracking-widest border-b-2 transition-colors ${tab === 'Active' ? 'border-white text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
            >
              {tab}
            </button>
         ))}
      </div>

      {/* Proposals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {activeProposals.map((proposal) => (
          <GlassCard key={proposal.id} className="flex flex-col h-full hover:border-white/40 transition-colors group">
              <div className="flex justify-between items-start mb-6">
                <div className={`px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-wider border ${
                  proposal.status === 'active' ? 'bg-white text-black border-white' : 
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
    </div>
  );

  const renderOrganizations = () => {
    // If an organization is selected, show its detail dashboard
    if (selectedOrg) {
        const joinStatus = myJoinRequests[selectedOrg.id] || 'none';

        return (
            <div className="space-y-8 animate-fade-in-up">
                {/* Header / Navigation */}
                <button 
                  onClick={() => setSelectedOrg(null)}
                  className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors group mb-4"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-mono text-xs font-bold uppercase tracking-wider">Back to Directory</span>
                </button>

                {/* Org Hero */}
                <GlassCard className="p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
                    <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start justify-between">
                        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start text-center md:text-left">
                            <div className="w-24 h-24 bg-white text-black text-4xl font-display font-bold flex items-center justify-center shadow-lg shadow-white/10">
                                {selectedOrg.avatar}
                            </div>
                            <div>
                                <h1 className="text-4xl font-display font-bold mb-2 flex items-center justify-center md:justify-start gap-3">
                                    {selectedOrg.name} 
                                    {selectedOrg.verified && <ShieldCheck className="w-6 h-6 text-white" fill="white" stroke="black" />}
                                </h1>
                                <p className="text-gray-400 font-mono text-sm mb-4 max-w-lg">{selectedOrg.description}</p>
                                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                                    <div className="flex items-center space-x-2 text-xs font-mono text-gray-300 bg-white/5 px-3 py-1.5 border border-white/10">
                                        <Building2 className="w-3 h-3" />
                                        <span>{selectedOrg.category}</span>
                                    </div>
                                    <div className="flex items-center space-x-2 text-xs font-mono text-gray-300 bg-white/5 px-3 py-1.5 border border-white/10">
                                        <Globe className="w-3 h-3" />
                                        <span>{selectedOrg.handle}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Join / Status Action */}
                        <div className="w-full md:w-auto mt-6 md:mt-0">
                           {joinStatus === 'none' && (
                               <div className="w-full md:w-80 p-6 border border-white/20 bg-black/50 backdrop-blur-xl">
                                   <h3 className="font-bold font-display text-lg mb-4">Request Access</h3>
                                   <div className="space-y-4">
                                       <div>
                                           <label className="block text-xs font-mono text-gray-400 uppercase mb-1">Role</label>
                                           <select 
                                             value={joinForm.role}
                                             onChange={(e) => setJoinForm({...joinForm, role: e.target.value})}
                                             className="w-full bg-white/10 border border-white/10 text-white text-sm px-3 py-2 focus:outline-none focus:border-white"
                                           >
                                               <option>Contributor</option>
                                               <option>Investor</option>
                                               <option>Developer</option>
                                               <option>Designer</option>
                                           </select>
                                       </div>
                                       <div>
                                           <label className="block text-xs font-mono text-gray-400 uppercase mb-1">Message</label>
                                           <textarea 
                                             value={joinForm.message}
                                             onChange={(e) => setJoinForm({...joinForm, message: e.target.value})}
                                             placeholder="Briefly describe why you want to join..."
                                             className="w-full bg-white/10 border border-white/10 text-white text-sm px-3 py-2 h-20 focus:outline-none focus:border-white resize-none"
                                           />
                                       </div>
                                       <button 
                                          onClick={() => submitJoinApplication(selectedOrg.id)}
                                          className="w-full py-3 bg-white text-black font-mono text-sm font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
                                       >
                                           <Send className="w-4 h-4" />
                                           <span>Submit Request</span>
                                       </button>
                                   </div>
                               </div>
                           )}
                           {joinStatus === 'pending' && (
                               <div className="w-full md:w-64 p-6 border border-yellow-500/30 bg-yellow-500/5 text-center">
                                   <Clock className="w-10 h-10 mx-auto text-yellow-500 mb-3" />
                                   <h3 className="font-bold text-white mb-1">Application Pending</h3>
                                   <p className="text-xs text-gray-400 font-mono">Your request is being reviewed by the admins.</p>
                               </div>
                           )}
                           {joinStatus === 'joined' && (
                               <div className="w-full md:w-64 p-6 border border-green-500/30 bg-green-500/5 text-center">
                                   <CheckCircle className="w-10 h-10 mx-auto text-green-500 mb-3" />
                                   <h3 className="font-bold text-white mb-1">Member</h3>
                                   <p className="text-xs text-gray-400 font-mono">You are a confirmed member of this organization.</p>
                               </div>
                           )}
                        </div>
                    </div>
                </GlassCard>

                {/* Public Org Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <GlassCard className="p-4 flex flex-col justify-between h-32 group hover:border-white/30">
                        <div className="text-xs font-mono text-gray-400 uppercase tracking-widest">Public Treasury</div>
                        <div className="text-3xl font-bold font-display">${(selectedOrg.treasuryBalance / 1000000).toFixed(2)}M</div>
                        <div className="w-full bg-gray-800 h-1 mt-2 overflow-hidden">
                            <div className="h-full bg-white w-[65%]"></div>
                        </div>
                    </GlassCard>
                    <GlassCard className="p-4 flex flex-col justify-between h-32 group hover:border-white/30">
                        <div className="text-xs font-mono text-gray-400 uppercase tracking-widest">Active Proposals</div>
                        <div className="text-3xl font-bold font-display">{selectedOrg.proposalCount}</div>
                        <div className="flex items-center space-x-2 text-[10px] font-mono text-gray-400">
                            <span className="text-green-400">●</span> <span>3 voting now</span>
                        </div>
                    </GlassCard>
                    <GlassCard className="p-4 flex flex-col justify-between h-32 group hover:border-white/30">
                        <div className="text-xs font-mono text-gray-400 uppercase tracking-widest">Members</div>
                        <div className="text-3xl font-bold font-display">{selectedOrg.memberCount}</div>
                        <div className="flex -space-x-2 overflow-hidden">
                             {[1,2,3,4,5].map(i => (
                                 <div key={i} className="inline-block h-6 w-6 rounded-full bg-gray-800 border border-black ring-2 ring-black"></div>
                             ))}
                             <div className="h-6 w-6 rounded-full bg-gray-800 border border-black ring-2 ring-black flex items-center justify-center text-[8px] font-mono text-gray-400">+</div>
                        </div>
                    </GlassCard>
                </div>

                {/* Public Activity Feed */}
                <div className="space-y-4">
                    <h3 className="text-xl font-bold font-display uppercase tracking-wide">Public Proposals</h3>
                    <div className="opacity-75 pointer-events-none">
                         {initialActiveProposals.slice(0, 2).map((proposal) => (
                             <GlassCard key={proposal.id} className="mb-4 p-6 border-l-4 border-l-white">
                                 <div className="flex justify-between items-start">
                                     <div>
                                         <h4 className="font-bold font-display text-lg mb-1">{proposal.title}</h4>
                                         <p className="text-sm text-gray-400 font-mono">{proposal.description}</p>
                                     </div>
                                     <div className="px-3 py-1 text-[10px] font-mono border border-white/20 uppercase tracking-wider">
                                         {proposal.status}
                                     </div>
                                 </div>
                             </GlassCard>
                         ))}
                         <div className="text-center py-4">
                            <p className="text-xs font-mono text-gray-500 uppercase tracking-widest">Join organization to view full governance details</p>
                         </div>
                    </div>
                </div>
            </div>
        );
    }

    // Default Directory View
    const filteredOrgs = organizations.filter(org => 
       org.name.toLowerCase().includes(orgSearch.toLowerCase()) || 
       org.category.toLowerCase().includes(orgSearch.toLowerCase())
    );

    return (
      <div className="space-y-8 animate-fade-in-up">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h2 className="text-3xl font-display font-bold mb-2">ORGANIZATIONS</h2>
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
                  onClick={() => setSelectedOrg(org)}
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
  };

  const renderAdminPanel = () => {
    const pendingRequests = joinRequests.filter(req => req.status === 'pending');

    return (
      <div className="space-y-6 animate-fade-in-up">
         <div className="flex justify-between items-end pb-4 border-b border-white/10">
            <div>
              <div className="flex items-center gap-3 mb-2">
                 <Shield className="w-8 h-8 text-white" />
                 <h2 className="text-3xl font-display font-bold">ADMIN ACCESS</h2>
              </div>
              <p className="text-gray-400 font-mono text-sm">Review pending organization join requests.</p>
            </div>
            <div className="text-right">
               <div className="text-3xl font-bold font-display">{pendingRequests.length}</div>
               <div className="text-xs text-gray-400 font-mono uppercase tracking-wider">Pending</div>
            </div>
         </div>

         {pendingRequests.length === 0 ? (
             <GlassCard className="p-12 text-center flex flex-col items-center justify-center space-y-4">
                 <CheckCircle className="w-16 h-16 text-gray-600" strokeWidth={1} />
                 <h3 className="text-xl font-bold font-display">All Caught Up</h3>
                 <p className="text-gray-400 font-mono text-sm">No pending requests at this time.</p>
             </GlassCard>
         ) : (
            <div className="grid grid-cols-1 gap-4">
                {pendingRequests.map(req => (
                   <GlassCard key={req.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:border-white/40">
                       <div className="flex items-start gap-4">
                           <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-lg font-bold font-display">
                               {req.username.slice(0, 2).toUpperCase()}
                           </div>
                           <div>
                               <h4 className="font-bold text-lg font-display flex items-center gap-2">
                                  {req.username}
                                  <span className="px-2 py-0.5 border border-white/20 text-[10px] font-mono uppercase text-gray-300">{req.role}</span>
                               </h4>
                               <div className="font-mono text-xs text-gray-400 mb-2">{req.walletAddress} • {req.date}</div>
                               <p className="text-sm text-gray-300 font-mono italic">"{req.message}"</p>
                           </div>
                       </div>
                       <div className="flex items-center gap-3 md:pl-6 md:border-l border-white/10">
                           <button 
                             onClick={() => handleJoinRequest(req.id, 'reject')}
                             className="px-4 py-2 border border-white/10 text-gray-400 hover:text-white hover:border-white transition-colors font-mono text-xs font-bold uppercase tracking-wider"
                           >
                             Reject
                           </button>
                           <button 
                             onClick={() => handleJoinRequest(req.id, 'approve')}
                             className="px-4 py-2 bg-white text-black hover:bg-gray-200 transition-colors font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2"
                           >
                             <Check className="w-3 h-3" />
                             Approve
                           </button>
                       </div>
                   </GlassCard>
                ))}
            </div>
         )}
         
         <div className="pt-8 mt-8 border-t border-white/10">
            <h3 className="text-lg font-bold font-display uppercase tracking-wide mb-4 text-gray-500">History</h3>
            <div className="opacity-50 pointer-events-none grayscale">
                <table className="w-full text-left font-mono text-xs">
                    <thead>
                        <tr className="border-b border-white/10 text-gray-500">
                            <th className="py-2">User</th>
                            <th className="py-2">Date</th>
                            <th className="py-2 text-right">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {joinRequests.filter(r => r.status !== 'pending').map(req => (
                            <tr key={req.id}>
                                <td className="py-2">{req.username}</td>
                                <td className="py-2 text-gray-500">{req.date}</td>
                                <td className="py-2 text-right uppercase">{req.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
         </div>
      </div>
    );
  };

  const renderReimbursements = () => (
    <div className="space-y-6 animate-fade-in-up">
       <div className="flex justify-between items-end pb-4 border-b border-white/10">
          <div>
            <h2 className="text-3xl font-display font-bold mb-2">REIMBURSEMENTS</h2>
            <p className="text-gray-400 font-mono text-sm">Multisig approval needed for all stablecoin outflows.</p>
          </div>
          <div className="flex space-x-4">
             <button 
                onClick={() => setShowReimbursementModal(true)}
                className="px-4 py-2 bg-white text-black hover:bg-gray-200 transition-colors font-mono text-xs font-bold uppercase tracking-wider flex items-center space-x-2"
             >
                <Plus className="w-4 h-4" />
                <span>New Request</span>
             </button>
             <button className="px-4 py-2 border border-white/10 hover:bg-white/5 transition-colors font-mono text-xs font-bold uppercase tracking-wider text-white">
                Export CSV
             </button>
          </div>
       </div>
       
       <div className="border border-white/10 bg-black/20">
          <div className="overflow-x-auto">
             <table className="w-full text-left">
                <thead>
                   <tr className="border-b border-white/10 text-gray-400 text-xs font-mono uppercase tracking-wider">
                      <th className="p-6 font-normal">Requester</th>
                      <th className="p-6 font-normal">Category</th>
                      <th className="p-6 font-normal">Amount</th>
                      <th className="p-6 font-normal">Approvals</th>
                      <th className="p-6 font-normal">Status</th>
                      <th className="p-6 font-normal text-right">Action</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                   {reimbursements.map((tx) => (
                      <tr key={tx.id} className="hover:bg-white/[0.02] transition-colors group">
                         <td className="p-6">
                            <div className="flex items-center space-x-3">
                               <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-xs font-bold font-mono">
                                  {tx.requester.substring(0,2).toUpperCase()}
                               </div>
                               <div>
                                  <div className="font-bold text-white text-sm font-display tracking-wide">
                                     {tx.requester}
                                  </div>
                                  <div className="text-xs text-gray-400 font-mono">{tx.date}</div>
                               </div>
                            </div>
                         </td>
                         <td className="p-6">
                            <span className="text-sm text-gray-300 font-mono border border-white/10 px-2 py-1 rounded-sm">
                               {tx.category}
                            </span>
                         </td>
                         <td className="p-6">
                            <div className="font-bold text-white font-mono">
                               {tx.amount} {tx.currency}
                            </div>
                            <div className="text-xs text-gray-400 font-mono">${tx.valueUsd.toLocaleString()}</div>
                         </td>
                         <td className="p-6">
                            <div className="flex items-center space-x-2">
                                <div className="text-sm font-mono text-gray-300">
                                    {tx.signatures}/{tx.requiredSignatures}
                                </div>
                                <div className="w-16 h-1 bg-gray-800 rounded-full">
                                    <div 
                                        className="h-full bg-white rounded-full transition-all duration-500" 
                                        style={{ width: `${(tx.signatures / tx.requiredSignatures) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                         </td>
                         <td className="p-6">
                            <span className={`inline-flex items-center space-x-2 px-2 py-1 text-[10px] font-mono font-bold uppercase tracking-wider border ${
                               tx.status === 'approved' ? 'border-white text-white bg-white/10' : 
                               tx.status === 'pending' ? 'border-gray-500 text-gray-300' :
                               'border-gray-700 text-gray-500 line-through decoration-white/50'
                            }`}>
                               {tx.status === 'approved' && <CheckCircle className="w-3 h-3 mr-1" />}
                               {tx.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                               {tx.status === 'rejected' && <XCircle className="w-3 h-3 mr-1" />}
                               {tx.status}
                            </span>
                         </td>
                         <td className="p-6 text-right">
                            {tx.status === 'pending' && !tx.signedByCurrentUser ? (
                                <button 
                                    onClick={() => handleApprove(tx.id)}
                                    className="px-3 py-1.5 bg-white text-black font-mono text-xs font-bold uppercase tracking-wider hover:bg-gray-200 transition-colors flex items-center ml-auto"
                                >
                                    <PenTool className="w-3 h-3 mr-2" />
                                    Approve
                                </button>
                            ) : tx.status === 'pending' && tx.signedByCurrentUser ? (
                                <span className="text-xs font-mono text-gray-500 uppercase tracking-wider">Signed</span>
                            ) : (
                                <button className="p-2 hover:bg-white hover:text-black border border-transparent hover:border-white transition-colors inline-block">
                                    <MoreHorizontal className="w-4 h-4" />
                                </button>
                            )}
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
       </div>

    </div>
  );

  const renderMembers = () => {
    const filteredMembers = members.filter(m => 
        m.name.toLowerCase().includes(memberSearch.toLowerCase()) || 
        m.handle.toLowerCase().includes(memberSearch.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex justify-between items-end pb-4 border-b border-white/10">
                <div>
                   <h2 className="text-3xl font-display font-bold mb-2">MEMBERS</h2>
                   <p className="text-gray-400 font-mono text-sm">Manage organization access and roles.</p>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Find member..."
                            value={memberSearch}
                            onChange={(e) => setMemberSearch(e.target.value)}
                            className="bg-white/5 border border-white/10 py-2 pl-9 pr-4 text-xs text-white focus:outline-none focus:border-white font-mono placeholder:text-gray-600 w-48"
                        />
                    </div>
                    <button 
                        onClick={() => setShowInviteModal(true)}
                        className="px-4 py-2 bg-white text-black font-mono text-xs font-bold uppercase tracking-wider flex items-center space-x-2 hover:bg-gray-200 transition-colors"
                    >
                        <Mail className="w-3 h-3" />
                        <span>Invite</span>
                    </button>
                </div>
            </div>

            <div className="border border-white/10 bg-black/20">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/10 text-gray-400 text-xs font-mono uppercase tracking-wider">
                                <th className="p-6 font-normal">Member</th>
                                <th className="p-6 font-normal">Role</th>
                                <th className="p-6 font-normal">Joined</th>
                                <th className="p-6 font-normal">Status</th>
                                <th className="p-6 font-normal text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredMembers.map((member) => (
                                <tr key={member.id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="p-6">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-10 h-10 bg-white text-black font-display font-bold text-lg flex items-center justify-center">
                                                {member.avatar}
                                            </div>
                                            <div>
                                                <div className="font-bold text-white font-display text-sm">{member.name}</div>
                                                <div className="text-xs text-gray-400 font-mono">{member.handle}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <span className={`px-2 py-1 text-[10px] font-mono uppercase tracking-wider border ${
                                            member.role === 'Admin' ? 'border-purple-500 text-purple-400' :
                                            member.role === 'Member' ? 'border-white text-white' :
                                            'border-gray-600 text-gray-400'
                                        }`}>
                                            {member.role}
                                        </span>
                                    </td>
                                    <td className="p-6 text-sm text-gray-300 font-mono">
                                        {member.joinDate}
                                    </td>
                                    <td className="p-6">
                                        <div className="flex items-center space-x-2">
                                            <div className={`w-2 h-2 rounded-full ${member.status === 'active' ? 'bg-green-500' : 'bg-gray-600'}`}></div>
                                            <span className="text-xs font-mono uppercase text-gray-400">{member.status}</span>
                                        </div>
                                    </td>
                                    <td className="p-6 text-right">
                                        <button className="text-gray-400 hover:text-white transition-colors">
                                            <MoreHorizontal className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
  };

  const renderSettings = () => (
    <div className="space-y-8 animate-fade-in-up">
       <div className="mb-8">
          <h2 className="text-3xl font-display font-bold mb-2">SETTINGS</h2>
          <p className="text-gray-400 font-mono text-sm">Manage your account and organization preferences.</p>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Profile Section */}
           <div className="lg:col-span-2 space-y-6">
              <GlassCard>
                 <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/10">
                    <User className="w-6 h-6 text-white" />
                    <h3 className="text-lg font-bold font-display uppercase tracking-wide">Profile</h3>
                 </div>
                 
                 <div className="flex items-start gap-8">
                    <div className="w-24 h-24 bg-white/5 border border-white/20 flex items-center justify-center relative group cursor-pointer">
                        <div className="text-4xl font-display font-bold text-white">AD</div>
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-xs font-mono text-white uppercase">Edit</span>
                        </div>
                    </div>
                    <div className="flex-1 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-mono text-gray-400 uppercase mb-1">Display Name</label>
                                <input 
                                  type="text"
                                  value={profileForm.displayName}
                                  onChange={(e) => setProfileForm({...profileForm, displayName: e.target.value})}
                                  className="w-full bg-white/5 border border-white/10 py-2 px-3 text-sm text-white focus:outline-none focus:border-white font-mono"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-mono text-gray-400 uppercase mb-1">Email</label>
                                <input 
                                  type="email"
                                  value={profileForm.email}
                                  onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                                  className="w-full bg-white/5 border border-white/10 py-2 px-3 text-sm text-white focus:outline-none focus:border-white font-mono"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-mono text-gray-400 uppercase mb-1">Bio</label>
                            <textarea 
                              value={profileForm.bio}
                              onChange={(e) => setProfileForm({...profileForm, bio: e.target.value})}
                              className="w-full bg-white/5 border border-white/10 py-2 px-3 text-sm text-white focus:outline-none focus:border-white font-mono h-20 resize-none"
                            />
                        </div>
                        <button className="px-4 py-2 bg-white text-black font-mono text-xs font-bold uppercase tracking-wider flex items-center space-x-2 hover:bg-gray-200 transition-colors">
                           <Save className="w-3 h-3" />
                           <span>Save Changes</span>
                        </button>
                    </div>
                 </div>
              </GlassCard>

              {/* Notification Settings */}
              <GlassCard>
                  <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/10">
                    <Bell className="w-6 h-6 text-white" />
                    <h3 className="text-lg font-bold font-display uppercase tracking-wide">Notifications</h3>
                 </div>
                 <div className="space-y-4">
                     <div className="flex items-center justify-between p-4 bg-white/5 border border-white/5">
                        <div>
                            <div className="font-bold text-sm font-display text-white">Email Notifications</div>
                            <div className="text-xs font-mono text-gray-400">Receive updates about governance and transactions.</div>
                        </div>
                        <button 
                          onClick={() => setNotifications(prev => ({ ...prev, email: !prev.email }))}
                          className={`w-10 h-5 rounded-full relative transition-colors ${notifications.email ? 'bg-white' : 'bg-gray-700'}`}
                        >
                            <div className={`w-3 h-3 rounded-full bg-black absolute top-1 transition-all ${notifications.email ? 'left-6' : 'left-1'}`}></div>
                        </button>
                     </div>
                     <div className="flex items-center justify-between p-4 bg-white/5 border border-white/5">
                        <div>
                            <div className="font-bold text-sm font-display text-white">Push Notifications</div>
                            <div className="text-xs font-mono text-gray-400">Browser alerts for urgent actions.</div>
                        </div>
                        <button 
                          onClick={() => setNotifications(prev => ({ ...prev, push: !prev.push }))}
                          className={`w-10 h-5 rounded-full relative transition-colors ${notifications.push ? 'bg-white' : 'bg-gray-700'}`}
                        >
                            <div className={`w-3 h-3 rounded-full bg-black absolute top-1 transition-all ${notifications.push ? 'left-6' : 'left-1'}`}></div>
                        </button>
                     </div>
                 </div>
              </GlassCard>
           </div>

           {/* Sidebar Settings */}
           <div className="space-y-6">
               {/* Role Simulator */}
               <GlassCard className="bg-white/5 border-white/20">
                   <div className="flex items-center gap-3 mb-4">
                       <Shield className="w-5 h-5 text-white" />
                       <h3 className="font-bold font-display uppercase tracking-wide text-sm">Role Simulator</h3>
                   </div>
                   <p className="text-xs text-gray-400 font-mono mb-4">Toggle permissions to test the dashboard as different user types.</p>
                   <div className="flex items-center justify-between bg-black p-2 border border-white/10">
                       <span className="text-xs font-mono font-bold uppercase pl-2">{isAdmin ? 'Admin' : 'Member'}</span>
                        <button 
                            onClick={() => setIsAdmin(!isAdmin)}
                            className={`w-12 h-6 rounded-full p-0.5 transition-colors ${isAdmin ? 'bg-white' : 'bg-gray-800'}`}
                        >
                            <div className={`w-5 h-5 rounded-full bg-black shadow-lg transform transition-transform ${isAdmin ? 'translate-x-6' : 'translate-x-0'}`}></div>
                        </button>
                   </div>
               </GlassCard>

               {/* Security */}
               <GlassCard>
                   <div className="flex items-center gap-3 mb-4">
                       <Lock className="w-5 h-5 text-white" />
                       <h3 className="font-bold font-display uppercase tracking-wide text-sm">Security</h3>
                   </div>
                   
                   <div className="space-y-4">
                       <div>
                           <div className="text-[10px] text-gray-400 uppercase font-mono mb-1">Connected Wallet</div>
                           <div className="flex items-center justify-between p-2 bg-white/5 border border-white/10 text-xs font-mono">
                               <span>0x1a...bc9</span>
                               <span className="text-green-400 text-[10px] uppercase">Active</span>
                           </div>
                       </div>
                       
                       <div className="flex items-center justify-between">
                            <span className="text-xs font-mono text-gray-300">2FA Enabled</span>
                             <button 
                                onClick={() => setTwoFactor(!twoFactor)}
                                className={`w-8 h-4 rounded-full relative transition-colors ${twoFactor ? 'bg-green-500' : 'bg-gray-700'}`}
                            >
                                <div className={`w-2 h-2 rounded-full bg-white absolute top-1 transition-all ${twoFactor ? 'left-5' : 'left-1'}`}></div>
                            </button>
                       </div>
                   </div>
               </GlassCard>

               {/* Org Preferences (Admin Only) */}
               {isAdmin && (
                   <GlassCard>
                       <div className="flex items-center gap-3 mb-4">
                           <Building2 className="w-5 h-5 text-white" />
                           <h3 className="font-bold font-display uppercase tracking-wide text-sm">Organization</h3>
                       </div>
                       <div className="space-y-3">
                           <div>
                               <label className="block text-[10px] font-mono text-gray-400 uppercase mb-1">Default Currency</label>
                               <select className="w-full bg-black border border-white/10 text-white text-xs px-2 py-1.5 focus:outline-none">
                                   <option>USDC</option>
                                   <option>USDT</option>
                               </select>
                           </div>
                           <div className="flex items-center justify-between pt-2">
                                <span className="text-xs font-mono text-gray-300">Public Profile</span>
                                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                           </div>
                       </div>
                   </GlassCard>
               )}
           </div>
       </div>
    </div>
  );

  const sidebarItems = [
    { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
    { id: 'organizations', icon: Building2, label: 'Organizations' },
    ...(isAdmin ? [{ id: 'admin', icon: UserPlus, label: 'Admin Access' }] : []),
    { id: 'treasury', icon: Landmark, label: 'Treasury' },
    { id: 'governance', icon: Vote, label: 'Governance' },
    { id: 'reimbursements', icon: FileText, label: 'Reimbursements' },
    { id: 'members', icon: Users, label: 'Members' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="h-screen flex text-white relative">
      {/* Sidebar */}
      <aside className="w-20 lg:w-64 h-screen border-r border-white/10 flex-col hidden md:flex z-20 bg-black/50 backdrop-blur-md">
        <div className="h-24 flex items-center justify-center lg:justify-start lg:px-8 border-b border-white/10">
          <Hexagon className="text-white w-6 h-6" strokeWidth={1.5} />
          <span className="ml-4 font-display font-bold text-xl hidden lg:block tracking-widest uppercase">NebulaFi</span>
        </div>

        <nav className="flex-1 py-8 flex flex-col space-y-1 px-4">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                  setActiveTab(item.id);
                  if (item.id !== 'organizations') setSelectedOrg(null); // Reset org selection when changing main tabs
              }}
              className={`w-full flex items-center p-3 transition-all duration-200 group ${
                activeTab === item.id 
                  ? 'bg-white text-black' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon className="w-5 h-5" strokeWidth={1.5} />
              <span className="ml-4 hidden lg:block font-mono text-sm uppercase tracking-wider">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button 
            onClick={onDisconnect}
            className="w-full flex items-center p-3 text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="ml-4 hidden lg:block font-mono text-sm uppercase tracking-wider">Disconnect</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative z-10 h-screen">
        {/* Header */}
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
                               setActiveTab('organizations');
                               setSelectedOrg(null);
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

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 scrollbar-hide">
          <div className="max-w-7xl mx-auto w-full pb-20">
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'organizations' && renderOrganizations()}
            {activeTab === 'admin' && isAdmin && renderAdminPanel()}
            {activeTab === 'treasury' && renderTreasury()}
            {activeTab === 'governance' && renderGovernance()}
            {activeTab === 'reimbursements' && renderReimbursements()}
            {activeTab === 'members' && renderMembers()}
            {activeTab === 'settings' && renderSettings()}
          </div>
        </div>
      </main>

       {/* Reimbursement Modal */}
       {showReimbursementModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
             <div className="absolute inset-0" onClick={() => setShowReimbursementModal(false)}></div>
             <GlassCard className="w-full max-w-md relative z-10 p-8" variant="high">
                <button 
                   onClick={() => setShowReimbursementModal(false)}
                   className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                >
                   <X className="w-5 h-5" />
                </button>
                <h3 className="text-2xl font-display font-bold mb-1">New Request</h3>
                <p className="text-sm text-gray-400 font-mono mb-6">Submit a reimbursement for approval.</p>
                
                <form onSubmit={handleSubmitReimbursement} className="space-y-4">
                   <div>
                      <label className="block text-xs font-mono text-gray-400 uppercase mb-1">Category</label>
                      <select 
                        value={reimbursementForm.category}
                        onChange={(e) => setReimbursementForm({...reimbursementForm, category: e.target.value})}
                        className="w-full bg-white/10 border border-white/10 text-white text-sm px-3 py-2.5 focus:outline-none focus:border-white font-mono"
                      >
                         <option>General</option>
                         <option>Travel</option>
                         <option>Software</option>
                         <option>Equipment</option>
                         <option>Services</option>
                      </select>
                   </div>
                   
                   <div className="grid grid-cols-2 gap-4">
                      <div>
                         <label className="block text-xs font-mono text-gray-400 uppercase mb-1">Currency</label>
                         <select 
                           value={reimbursementForm.currency}
                           onChange={(e) => setReimbursementForm({...reimbursementForm, currency: e.target.value})}
                           className="w-full bg-white/10 border border-white/10 text-white text-sm px-3 py-2.5 focus:outline-none focus:border-white font-mono"
                         >
                            <option>USDC</option>
                            <option>USDT</option>
                            <option>DAI</option>
                         </select>
                      </div>
                      <div>
                         <label className="block text-xs font-mono text-gray-400 uppercase mb-1">Amount</label>
                         <input 
                           type="number"
                           required
                           min="0"
                           step="0.01"
                           value={reimbursementForm.amount}
                           onChange={(e) => setReimbursementForm({...reimbursementForm, amount: e.target.value})}
                           placeholder="0.00"
                           className="w-full bg-white/10 border border-white/10 text-white text-sm px-3 py-2.5 focus:outline-none focus:border-white font-mono"
                         />
                      </div>
                   </div>

                   <div>
                      <label className="block text-xs font-mono text-gray-400 uppercase mb-1">Description</label>
                      <textarea 
                        required
                        value={reimbursementForm.description}
                        onChange={(e) => setReimbursementForm({...reimbursementForm, description: e.target.value})}
                        placeholder="Reason for expense..."
                        className="w-full bg-white/10 border border-white/10 text-white text-sm px-3 py-2.5 h-24 focus:outline-none focus:border-white resize-none font-mono"
                      />
                   </div>

                   <button 
                      type="submit"
                      className="w-full py-3 bg-white text-black font-mono text-sm font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2 mt-4"
                   >
                       <Send className="w-4 h-4" />
                       <span>Submit Request</span>
                   </button>
                </form>
             </GlassCard>
          </div>
       )}

      {/* New Proposal Modal */}
      {showProposalModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="absolute inset-0" onClick={() => setShowProposalModal(false)}></div>
            <GlassCard className="w-full max-w-lg relative z-10 p-8" variant="high">
              <button 
                  onClick={() => setShowProposalModal(false)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              >
                  <X className="w-5 h-5" />
              </button>
              <h3 className="text-2xl font-display font-bold mb-1">New Proposal</h3>
              <p className="text-sm text-gray-400 font-mono mb-6">Create a governance proposal for voting.</p>
              
              <form onSubmit={handleProposalSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono text-gray-400 uppercase mb-1">Title</label>
                    <input 
                      type="text"
                      required
                      value={proposalForm.title}
                      onChange={(e) => setProposalForm({...proposalForm, title: e.target.value})}
                      placeholder="Proposal Title"
                      className="w-full bg-white/10 border border-white/10 text-white text-sm px-3 py-2.5 focus:outline-none focus:border-white font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <div>
                       <label className="block text-xs font-mono text-gray-400 uppercase mb-1">Category</label>
                       <select 
                         value={proposalForm.category}
                         onChange={(e) => setProposalForm({...proposalForm, category: e.target.value})}
                         className="w-full bg-white/10 border border-white/10 text-white text-sm px-3 py-2.5 focus:outline-none focus:border-white font-mono"
                       >
                           <option value="budget">Budget</option>
                           <option value="protocol">Protocol</option>
                           <option value="personnel">Personnel</option>
                       </select>
                     </div>
                     <div>
                       <label className="block text-xs font-mono text-gray-400 uppercase mb-1">Duration</label>
                       <select 
                         value={proposalForm.endDate}
                         onChange={(e) => setProposalForm({...proposalForm, endDate: e.target.value})}
                         className="w-full bg-white/10 border border-white/10 text-white text-sm px-3 py-2.5 focus:outline-none focus:border-white font-mono"
                       >
                           <option value="3 days">3 Days</option>
                           <option value="7 days">7 Days</option>
                           <option value="14 days">14 Days</option>
                       </select>
                     </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-gray-400 uppercase mb-1">Description</label>
                    <textarea 
                      required
                      value={proposalForm.description}
                      onChange={(e) => setProposalForm({...proposalForm, description: e.target.value})}
                      placeholder="Describe your proposal..."
                      className="w-full bg-white/10 border border-white/10 text-white text-sm px-3 py-2.5 h-32 focus:outline-none focus:border-white resize-none font-mono"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-3 bg-white text-black font-mono text-sm font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2 mt-4"
                  >
                      <Vote className="w-4 h-4" />
                      <span>Submit Proposal</span>
                  </button>
              </form>
            </GlassCard>
        </div>
      )}

      {/* Deposit Modal */}
      {showDepositModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="absolute inset-0" onClick={() => setShowDepositModal(false)}></div>
            <GlassCard className="w-full max-w-sm relative z-10 p-8" variant="high">
              <button 
                  onClick={() => setShowDepositModal(false)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              >
                  <X className="w-5 h-5" />
              </button>
              <h3 className="text-2xl font-display font-bold mb-1">Deposit Funds</h3>
              <p className="text-sm text-gray-400 font-mono mb-6">Add assets to the organization treasury.</p>
              
              <form onSubmit={handleDepositSubmit} className="space-y-4">
                  <div className="p-3 bg-white/5 border border-white/10 text-center mb-4">
                      <div className="text-[10px] text-gray-400 uppercase font-mono mb-1">Treasury Address</div>
                      <div className="text-xs font-mono text-white select-all">0x1a2...b3c9</div>
                  </div>

                  <div>
                     <label className="block text-xs font-mono text-gray-400 uppercase mb-1">Asset</label>
                     <select 
                       value={depositForm.asset}
                       onChange={(e) => setDepositForm({...depositForm, asset: e.target.value})}
                       className="w-full bg-white/10 border border-white/10 text-white text-sm px-3 py-2.5 focus:outline-none focus:border-white font-mono"
                     >
                        <option>USDC</option>
                        <option>USDT</option>
                        <option>APT</option>
                     </select>
                  </div>

                  <div>
                     <label className="block text-xs font-mono text-gray-400 uppercase mb-1">Amount</label>
                     <input 
                       type="number"
                       required
                       min="0"
                       step="0.01"
                       value={depositForm.amount}
                       onChange={(e) => setDepositForm({...depositForm, amount: e.target.value})}
                       placeholder="0.00"
                       className="w-full bg-white/10 border border-white/10 text-white text-sm px-3 py-2.5 focus:outline-none focus:border-white font-mono"
                     />
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-3 bg-white text-black font-mono text-sm font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2 mt-4"
                  >
                      <ArrowDownLeft className="w-4 h-4" />
                      <span>Confirm Deposit</span>
                  </button>
              </form>
            </GlassCard>
        </div>
      )}

      {/* Send Modal */}
      {showSendModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="absolute inset-0" onClick={() => setShowSendModal(false)}></div>
            <GlassCard className="w-full max-w-md relative z-10 p-8" variant="high">
              <button 
                  onClick={() => setShowSendModal(false)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              >
                  <X className="w-5 h-5" />
              </button>
              <h3 className="text-2xl font-display font-bold mb-1">Send Funds</h3>
              <p className="text-sm text-gray-400 font-mono mb-6">Initiate a transfer from the treasury.</p>
              
              <form onSubmit={handleSendSubmit} className="space-y-4">
                  <div>
                     <label className="block text-xs font-mono text-gray-400 uppercase mb-1">Recipient Address</label>
                     <input 
                       type="text"
                       required
                       value={sendForm.recipient}
                       onChange={(e) => setSendForm({...sendForm, recipient: e.target.value})}
                       placeholder="0x..."
                       className="w-full bg-white/10 border border-white/10 text-white text-sm px-3 py-2.5 focus:outline-none focus:border-white font-mono"
                     />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                      <div>
                         <label className="block text-xs font-mono text-gray-400 uppercase mb-1">Asset</label>
                         <select 
                           value={sendForm.asset}
                           onChange={(e) => setSendForm({...sendForm, asset: e.target.value})}
                           className="w-full bg-white/10 border border-white/10 text-white text-sm px-3 py-2.5 focus:outline-none focus:border-white font-mono"
                         >
                            <option>USDC</option>
                            <option>USDT</option>
                            <option>APT</option>
                         </select>
                      </div>

                      <div>
                         <label className="block text-xs font-mono text-gray-400 uppercase mb-1">Amount</label>
                         <input 
                           type="number"
                           required
                           min="0"
                           step="0.01"
                           value={sendForm.amount}
                           onChange={(e) => setSendForm({...sendForm, amount: e.target.value})}
                           placeholder="0.00"
                           className="w-full bg-white/10 border border-white/10 text-white text-sm px-3 py-2.5 focus:outline-none focus:border-white font-mono"
                         />
                      </div>
                  </div>

                  <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 text-yellow-200 text-xs font-mono flex items-start gap-2">
                      <Shield className="w-4 h-4 shrink-0 mt-0.5" />
                      <div>This transaction will require multisig approval (3/5) before execution.</div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-3 bg-white text-black font-mono text-sm font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2 mt-4"
                  >
                      <Send className="w-4 h-4" />
                      <span>Create Transaction</span>
                  </button>
              </form>
            </GlassCard>
        </div>
      )}

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="absolute inset-0" onClick={() => setShowInviteModal(false)}></div>
            <GlassCard className="w-full max-w-md relative z-10 p-8" variant="high">
              <button 
                  onClick={() => setShowInviteModal(false)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              >
                  <X className="w-5 h-5" />
              </button>
              <h3 className="text-2xl font-display font-bold mb-1">Invite Member</h3>
              <p className="text-sm text-gray-400 font-mono mb-6">Send an invitation to join the organization.</p>
              
              <form onSubmit={handleInviteSubmit} className="space-y-4">
                  <div>
                     <label className="block text-xs font-mono text-gray-400 uppercase mb-1">Wallet Address or ENS</label>
                     <input 
                       type="text"
                       required
                       value={inviteForm.recipient}
                       onChange={(e) => setInviteForm({...inviteForm, recipient: e.target.value})}
                       placeholder="0x... or user.apt"
                       className="w-full bg-white/10 border border-white/10 text-white text-sm px-3 py-2.5 focus:outline-none focus:border-white font-mono"
                     />
                  </div>

                  <div>
                     <label className="block text-xs font-mono text-gray-400 uppercase mb-1">Role</label>
                     <select 
                       value={inviteForm.role}
                       onChange={(e) => setInviteForm({...inviteForm, role: e.target.value})}
                       className="w-full bg-white/10 border border-white/10 text-white text-sm px-3 py-2.5 focus:outline-none focus:border-white font-mono"
                     >
                        <option>Member</option>
                        <option>Admin</option>
                        <option>Contributor</option>
                        <option>Viewer</option>
                     </select>
                  </div>

                  <div>
                     <label className="block text-xs font-mono text-gray-400 uppercase mb-1">Personal Message</label>
                     <textarea 
                       value={inviteForm.message}
                       onChange={(e) => setInviteForm({...inviteForm, message: e.target.value})}
                       placeholder="Optional note..."
                       className="w-full bg-white/10 border border-white/10 text-white text-sm px-3 py-2.5 h-20 focus:outline-none focus:border-white resize-none font-mono"
                     />
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-3 bg-white text-black font-mono text-sm font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2 mt-4"
                  >
                      <Mail className="w-4 h-4" />
                      <span>Send Invite</span>
                  </button>
              </form>
            </GlassCard>
        </div>
      )}

    </div>
  );
};
