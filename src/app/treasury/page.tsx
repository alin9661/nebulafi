"use client"
import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Hexagon, ArrowDownLeft, ArrowUpRight } from 'lucide-react';

const assets = [
  {
    symbol: 'APT',
    name: 'Aptos',
    network: 'Aptos Mainnet',
    balance: 12543,
    valueUsd: 118532,
    change24h: 2.1,
    allocation: 45,
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    network: 'Aptos Mainnet',
    balance: 85000,
    valueUsd: 85000,
    change24h: 0.0,
    allocation: 32,
  },
  {
    symbol: 'USDT',
    name: 'Tether',
    network: 'Aptos Mainnet',
    balance: 60000,
    valueUsd: 60000,
    change24h: -0.1,
    allocation: 23,
  },
];

const treasuryTx = [
  {
    id: 1,
    type: 'inflow',
    asset: 'USDC',
    amount: 25000,
    counterparty: '0x1a2b...3c4d',
    date: '2024-03-15',
    status: 'completed',
  },
  {
    id: 2,
    type: 'outflow',
    asset: 'USDC',
    amount: 1200,
    counterparty: '0x5e6f...7g8h',
    date: '2024-03-14',
    status: 'completed',
  },
  {
    id: 3,
    type: 'outflow',
    asset: 'APT',
    amount: 500,
    counterparty: '0x9i0j...1k2l',
    date: '2024-03-14',
    status: 'pending',
  },
  {
    id: 4,
    type: 'inflow',
    asset: 'USDT',
    amount: 10000,
    counterparty: '0x3m4n...5o6p',
    date: '2024-03-13',
    status: 'completed',
  },
  {
    id: 5,
    type: 'outflow',
    asset: 'USDC',
    amount: 3500,
    counterparty: '0x7q8r...9s0t',
    date: '2024-03-12',
    status: 'completed',
  },
];

export default function TreasuryPage() {
  const totalValue = assets.reduce((sum, asset) => sum + asset.valueUsd, 0);

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold mb-2 uppercase tracking-tight">TREASURY</h1>
          <p className="text-gray-400 font-mono text-sm">
            Total Value: <span className="text-white font-bold">${totalValue.toLocaleString()}</span>
          </p>
        </div>
        <div className="flex space-x-2">
          <button className="px-4 py-2 bg-white text-black font-mono text-xs font-bold uppercase tracking-wider flex items-center space-x-2 hover:bg-gray-200">
            <ArrowDownLeft className="w-4 h-4" />
            <span>Deposit</span>
          </button>
          <button className="px-4 py-2 border border-white text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center space-x-2 hover:bg-white hover:text-black transition-colors">
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
                  <td className="p-4">
                    <span className="text-sm text-gray-300 font-mono">{tx.counterparty}</span>
                  </td>
                  <td className="p-4 text-sm font-mono text-gray-400">{tx.date}</td>
                  <td className="p-4 text-right">
                    <span className={`text-[10px] font-mono uppercase tracking-wider px-2 py-1 border ${tx.status === 'completed' ? 'border-white text-white' : 'border-gray-600 text-gray-400'}`}>
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
