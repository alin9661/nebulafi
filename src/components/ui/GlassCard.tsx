import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'low' | 'high';
  onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className = '', 
  variant = 'low',
  onClick
}) => {
  const baseClass = variant === 'high' ? 'glass-high' : 'glass';
  return (
    <div 
      onClick={onClick}
      className={`${baseClass} rounded-none border border-white/10 p-6 transition-all duration-300 hover:border-white/30 hover:bg-white/[0.03] ${className}`}
    >
      {children}
    </div>
  );
};