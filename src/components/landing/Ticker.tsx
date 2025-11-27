"use client"
import React from 'react';

export interface CoinData {
  name: string;
  price: string;
  change: string;
}

interface TickerProps {
  coins?: CoinData[];
}

export const Ticker: React.FC<TickerProps> = ({ coins }) => {
  const defaultCoins: CoinData[] = [
    { name: 'USDC', price: '$1.00', change: '+0.0%' },
    { name: 'APT', price: '$9.45', change: '+2.1%' },
    { name: 'USDT', price: '$1.00', change: '-0.1%' },
    { name: 'DAI', price: '$1.00', change: '+0.0%' },
    { name: 'MOD', price: '$1.00', change: '+0.0%' },
  ];

  const displayCoins = coins || defaultCoins;

  return (
    <div className="w-full bg-black border-y border-white/10 py-3 overflow-hidden flex relative z-20">
      <div className="animate-ticker flex whitespace-nowrap">
        {[...displayCoins, ...displayCoins, ...displayCoins, ...displayCoins].map((coin, i) => (
          <div key={i} className="mx-12 flex items-center space-x-3 text-sm font-mono">
            <span className="font-bold text-white">{coin.name}</span>
            <span className="text-gray-300">{coin.price}</span>
            <span className={coin.change.startsWith('+') ? 'text-gray-300' : 'text-gray-500'}>
              {coin.change}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
