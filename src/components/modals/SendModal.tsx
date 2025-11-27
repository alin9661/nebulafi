"use client"
import React from 'react';
import { X, Send, Shield } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';

interface SendFormData {
  recipient: string;
  asset: string;
  amount: string;
}

interface SendModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: SendFormData;
  onFormChange: (data: SendFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const SendModal: React.FC<SendModalProps> = ({
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
        <h3 className="text-2xl font-display font-bold mb-1">Send Funds</h3>
        <p className="text-sm text-gray-400 font-mono mb-6">Initiate a transfer from the treasury.</p>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-gray-400 uppercase mb-1">Recipient Address</label>
            <input
              type="text"
              required
              value={formData.recipient}
              onChange={(e) => onFormChange({ ...formData, recipient: e.target.value })}
              placeholder="0x..."
              className="w-full bg-white/10 border border-white/10 text-white text-sm px-3 py-2.5 focus:outline-none focus:border-white font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-gray-400 uppercase mb-1">Asset</label>
              <select
                value={formData.asset}
                onChange={(e) => onFormChange({ ...formData, asset: e.target.value })}
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
                value={formData.amount}
                onChange={(e) => onFormChange({ ...formData, amount: e.target.value })}
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
  );
};
