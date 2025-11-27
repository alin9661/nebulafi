"use client"
import React from 'react';
import { X, Vote } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';

interface ProposalFormData {
  title: string;
  category: string;
  endDate: string;
  description: string;
}

interface ProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: ProposalFormData;
  onFormChange: (data: ProposalFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const ProposalModal: React.FC<ProposalModalProps> = ({
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
      <GlassCard className="w-full max-w-lg relative z-10 p-8" variant="high">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        <h3 className="text-2xl font-display font-bold mb-1">New Proposal</h3>
        <p className="text-sm text-gray-400 font-mono mb-6">Create a governance proposal for voting.</p>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-gray-400 uppercase mb-1">Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => onFormChange({ ...formData, title: e.target.value })}
              placeholder="Proposal Title"
              className="w-full bg-white/10 border border-white/10 text-white text-sm px-3 py-2.5 focus:outline-none focus:border-white font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-gray-400 uppercase mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => onFormChange({ ...formData, category: e.target.value })}
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
                value={formData.endDate}
                onChange={(e) => onFormChange({ ...formData, endDate: e.target.value })}
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
              value={formData.description}
              onChange={(e) => onFormChange({ ...formData, description: e.target.value })}
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
  );
};
