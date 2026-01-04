"use client"
import React, { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Plus, Clock, CheckCircle, XCircle, PenTool, MoreHorizontal } from 'lucide-react';
import { ReimbursementModal } from '@/components/modals/ReimbursementModal';
import { useToast } from '@/components/ui/use-toast';

interface Transaction {
  id: string;
  type: string;
  amount: number;
  currency: string;
  valueUsd: number;
  requester: string;
  category: string;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
  signatures: number;
  requiredSignatures: number;
  signedByCurrentUser: boolean;
}

const initialReimbursements: Transaction[] = [
  { id: '1', type: 'reimbursement', amount: 450, currency: 'USDC', valueUsd: 450, requester: 'Alice.apt', category: 'Conference Travel', status: 'pending', date: '2 hrs ago', signatures: 1, requiredSignatures: 3, signedByCurrentUser: false },
  { id: '2', type: 'reimbursement', amount: 120, currency: 'USDC', valueUsd: 120, requester: 'Bob.apt', category: 'Software Licenses', status: 'approved', date: '5 hrs ago', signatures: 3, requiredSignatures: 3, signedByCurrentUser: true },
  { id: '3', type: 'reimbursement', amount: 1200, currency: 'USDC', valueUsd: 1200, requester: 'Charlie.apt', category: 'Equipment', status: 'rejected', date: '1 day ago', signatures: 0, requiredSignatures: 3, signedByCurrentUser: false },
  { id: '4', type: 'service', amount: 2750, currency: 'USDC', valueUsd: 2750, requester: 'Audit Firm A', category: 'Smart Contract Audit', status: 'approved', date: '2 days ago', signatures: 3, requiredSignatures: 3, signedByCurrentUser: true },
  { id: '5', type: 'reimbursement', amount: 50, currency: 'USDC', valueUsd: 50, requester: 'David.apt', category: 'Hosting', status: 'pending', date: '3 days ago', signatures: 2, requiredSignatures: 3, signedByCurrentUser: true },
];

export default function ReimbursementsPage() {
  const [reimbursements, setReimbursements] = useState<Transaction[]>(initialReimbursements);
  const { toast } = useToast();

  const [showReimbursementModal, setShowReimbursementModal] = useState(false);
  const [reimbursementFormData, setReimbursementFormData] = useState({
    category: 'General',
    currency: 'USDC',
    amount: '',
    description: '',
  });

  const handleReimbursementSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowReimbursementModal(false);
    toast({ title: "Request Submitted", description: "Your reimbursement request is pending approval." });
    setReimbursementFormData({ category: 'General', currency: 'USDC', amount: '', description: '' });
  };

  const handleApprove = (id: string) => {
    setReimbursements(prevReimbursements =>
      prevReimbursements.map(tx => {
        if (tx.id === id) {
          const newSignatures = tx.signatures + 1;
          return {
            ...tx,
            signatures: newSignatures,
            signedByCurrentUser: true,
            status: newSignatures >= tx.requiredSignatures ? 'approved' : tx.status
          };
        }
        return tx;
      })
    );
  };

  return (
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

      <ReimbursementModal
        isOpen={showReimbursementModal}
        onClose={() => setShowReimbursementModal(false)}
        formData={reimbursementFormData}
        onFormChange={setReimbursementFormData}
        onSubmit={handleReimbursementSubmit}
      />
    </div>
  );
}
