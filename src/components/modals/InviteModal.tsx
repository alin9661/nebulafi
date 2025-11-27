"use client"
import React from 'react';
import { X, Mail } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';

interface InviteFormData {
  recipient: string;
  role: string;
  message: string;
}

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: InviteFormData;
  onFormChange: (data: InviteFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const InviteModal: React.FC<InviteModalProps> = ({
  isOpen,
  onClose,
  formData,
  onFormChange,
  onSubmit,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="absolute inset-0" onClick={onClose}></div>
      <GlassCard className="w-full max-w-md relative z-10 p-8" variant="high">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        <h3 className="text-2xl font-display font-bold mb-1">Invite Member</h3>
        <p className="text-sm text-gray-400 font-mono mb-6">Send an invitation to join the organization.</p>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-gray-400 uppercase mb-1">Wallet Address or ENS</label>
            <input
              type="text"
              required
              value={formData.recipient}
              onChange={(e) => onFormChange({ ...formData, recipient: e.target.value })}
              placeholder="0x... or user.apt"
              className="w-full bg-white/10 border border-white/10 text-white text-sm px-3 py-2.5 focus:outline-none focus:border-white font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-gray-400 uppercase mb-1">Role</label>
            <select
              value={formData.role}
              onChange={(e) => onFormChange({ ...formData, role: e.target.value })}
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
              value={formData.message}
              onChange={(e) => onFormChange({ ...formData, message: e.target.value })}
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
  );
};
