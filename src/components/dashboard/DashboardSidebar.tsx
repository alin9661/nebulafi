"use client"
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Settings,
  LogOut,
  Users,
  Hexagon,
  FileText,
  Vote,
  Landmark,
  Building2,
  UserPlus,
} from 'lucide-react';

interface DashboardSidebarProps {
  onDisconnect: () => void;
  isAdmin?: boolean;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  onDisconnect,
  isAdmin = true,
}) => {
  const pathname = usePathname();

  const sidebarItems = [
    { id: 'overview', path: '/overview', icon: LayoutDashboard, label: 'Overview' },
    { id: 'organizations', path: '/organization', icon: Building2, label: 'Organizations' },
    ...(isAdmin ? [{ id: 'admin', path: '/admin', icon: UserPlus, label: 'Admin Access' }] : []),
    { id: 'treasury', path: '/treasury', icon: Landmark, label: 'Treasury' },
    { id: 'governance', path: '/governance', icon: Vote, label: 'Governance' },
    { id: 'reimbursements', path: '/reimbursements', icon: FileText, label: 'Reimbursements' },
    { id: 'members', path: '/members', icon: Users, label: 'Members' },
    { id: 'settings', path: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <aside className="w-20 lg:w-64 h-screen border-r border-white/10 flex-col hidden md:flex z-20 bg-black/50 backdrop-blur-md">
      <a
        className="h-24 flex items-center justify-center lg:justify-start lg:px-8 border-b border-white/10"
        href="/"
      >
        <Hexagon className="text-white w-6 h-6" strokeWidth={1.5} />
        <span className="ml-4 font-display font-bold text-xl hidden lg:block tracking-widest uppercase">NebulaFi</span>
      </a>

      <nav className="flex-1 py-8 flex flex-col space-y-1 px-4">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.id}
              href={item.path}
              className={`w-full flex items-center p-3 transition-all duration-200 group ${isActive
                  ? 'bg-white text-black'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
            >
              <item.icon className="w-5 h-5" strokeWidth={1.5} />
              <span className="ml-4 hidden lg:block font-mono text-sm uppercase tracking-wider">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <button
          onClick={onDisconnect}
          className="w-full flex items-center p-3 text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="ml-4 hidden lg:block font-mono text-sm uppercase tracking-wider">Disconnect</span>
        </button>
      </div>
    </aside>
  );
};
