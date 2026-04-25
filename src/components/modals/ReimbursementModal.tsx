"use client"
import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Send } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';

interface ReimbursementFormData {
  category: string;
  currency: string;
  amount: string;
  description: string;
}

interface ReimbursementModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: ReimbursementFormData;
  onFormChange: (data: ReimbursementFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const ReimbursementModal: React.FC<ReimbursementModalProps> = ({
  isOpen,
  onClose,
  formData,
  onFormChange,
  onSubmit,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="absolute inset-0 cursor-pointer" onClick={onClose} aria-hidden="true"></div>
      <GlassCard className="w-full max-w-md relative z-10 p-8" variant="high">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        <h3 className="text-2xl font-display font-bold mb-1">New Request</h3>
        <p className="text-sm text-gray-400 font-mono mb-6">Submit a reimbursement for approval.</p>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-gray-400 uppercase mb-1">Category</label>
            <select
              value={formData.category}
              onChange={(e) => onFormChange({ ...formData, category: e.target.value })}
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
                value={formData.currency}
                onChange={(e) => onFormChange({ ...formData, currency: e.target.value })}
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
                value={formData.amount}
                onChange={(e) => onFormChange({ ...formData, amount: e.target.value })}
                placeholder="0.00"
                className="w-full bg-white/10 border border-white/10 text-white text-sm px-3 py-2.5 focus:outline-none focus:border-white font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-gray-400 uppercase mb-1">Description</label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => onFormChange({ ...formData, description: e.target.value })}
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
    </div>,
    document.body
  );
};
