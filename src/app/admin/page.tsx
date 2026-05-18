"use client"
import React, { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Shield, CheckCircle, Check } from 'lucide-react';

interface JoinRequest {
  id: string;
  username: string;
  walletAddress: string;
  date: string;
  role: string;
  status: 'pending' | 'approved' | 'rejected';
  message: string;
}

const initialJoinRequests: JoinRequest[] = [
  { id: 'j1', username: 'dev_mike', walletAddress: '0x45...ae12', date: '2 hours ago', role: 'Developer', status: 'pending', message: 'Core contributor for the frontend repo.' },
  { id: 'j2', username: 'sarah_design', walletAddress: '0x88...bb34', date: '5 hours ago', role: 'Designer', status: 'pending', message: 'I want to help with the new governance UI.' },
  { id: 'j3', username: 'investor_dao', walletAddress: '0x12...cc90', date: '1 day ago', role: 'Investor', status: 'pending', message: 'Representative from Aptos Capital.' },
];

export default function AdminPage() {
  const [joinRequests, setJoinRequests] = useState<JoinRequest[]>(initialJoinRequests);

  const handleJoinRequest = (id: string, action: 'approve' | 'reject') => {
    setJoinRequests(prevRequests =>
      prevRequests.map(req =>
        req.id === id ? { ...req, status: action === 'approve' ? 'approved' : 'rejected' } : req
      )
    );
  };

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
                             <p className="text-sm text-gray-300 font-mono italic">&ldquo;{req.message}&rdquo;</p>
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
}
