"use client"
import React, { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Search, Mail, MoreHorizontal } from 'lucide-react';
import { InviteModal } from '@/components/modals/InviteModal';
import { useToast } from '@/components/ui/use-toast';

interface Member {
  id: string;
  name: string;
  handle: string;
  role: string;
  joinDate: string;
  status: 'active' | 'inactive';
  avatar: string;
  walletAddress: string;
}

const initialMembers: Member[] = [
  { id: 'm1', name: 'Alice', handle: '@alice', role: 'Admin', joinDate: 'Jan 15, 2024', status: 'active', avatar: 'A', walletAddress: '0x1a...bc9' },
  { id: 'm2', name: 'Bob', handle: '@bob_builds', role: 'Member', joinDate: 'Feb 02, 2024', status: 'active', avatar: 'B', walletAddress: '0x2b...cd1' },
  { id: 'm3', name: 'Charlie', handle: '@charlie_dev', role: 'Contributor', joinDate: 'Mar 10, 2024', status: 'active', avatar: 'C', walletAddress: '0x3c...de2' },
  { id: 'm4', name: 'David', handle: '@dave_invest', role: 'Member', joinDate: 'Apr 05, 2024', status: 'inactive', avatar: 'D', walletAddress: '0x4d...ef3' },
  { id: 'm5', name: 'Eve', handle: '@eve_security', role: 'Admin', joinDate: 'Jan 20, 2024', status: 'active', avatar: 'E', walletAddress: '0x5e...fa4' },
  { id: 'm6', name: 'Frank', handle: '@frankie', role: 'Viewer', joinDate: 'May 12, 2024', status: 'active', avatar: 'F', walletAddress: '0x6f...123' },
];

export default function MembersPage() {
  const [members] = useState<Member[]>(initialMembers);
  const [memberSearch, setMemberSearch] = useState('');
  const { toast } = useToast();

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteFormData, setInviteFormData] = useState({
    recipient: '',
    role: 'Member',
    message: '',
  });

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowInviteModal(false);
    toast({ title: "Invite Sent", description: `Invitation sent to ${inviteFormData.recipient}.` });
    setInviteFormData({ recipient: '', role: 'Member', message: '' });
  };

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

      <InviteModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        formData={inviteFormData}
        onFormChange={setInviteFormData}
        onSubmit={handleInviteSubmit}
      />
    </div>
  );
}
