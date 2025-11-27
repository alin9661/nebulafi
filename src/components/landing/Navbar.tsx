"use client"
import React from 'react';
import Link from 'next/link';
import { Wallet, Hexagon } from 'lucide-react';

interface NavbarProps {
  onConnect: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onConnect }) => {
  return (
    <nav className="relative z-50 w-full px-6 py-8 flex justify-between items-center max-w-7xl mx-auto">
      <Link href="/" className="flex items-center space-x-3">
        <div className="w-10 h-10 border border-white flex items-center justify-center">
          <Hexagon className="text-white w-5 h-5" fill="white" />
        </div>
        <span className="text-2xl font-display font-bold text-white tracking-widest uppercase">
          NebulaFi
        </span>
      </Link>
      <div className="hidden md:flex space-x-12 text-xs font-mono uppercase tracking-widest text-gray-300">
        <Link href="/organization" className="hover:text-white transition-colors">Org</Link>
        <Link href="/treasury" className="hover:text-white transition-colors">Treasury</Link>
        <Link href="/governance" className="hover:text-white transition-colors">Governance</Link>
        <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
      </div>
      <button
        onClick={onConnect}
        className="group relative px-6 py-2 bg-white text-black font-mono text-sm font-bold uppercase tracking-wider hover:bg-gray-200 transition-colors"
      >
        <span className="flex items-center space-x-2">
          <Wallet className="w-4 h-4" />
          <span>Connect Wallet</span>
        </span>
      </button>
    </nav>
  );
};
