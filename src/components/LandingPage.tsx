"use client"
import React from 'react';
import { Navbar } from './landing/Navbar';
import { HeroSection } from './landing/HeroSection';
import { FeatureCards } from './landing/FeatureCards';
import { Ticker } from './landing/Ticker';

interface LandingPageProps {
  onConnect: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onConnect }) => {
  return (
    <div className="min-h-screen relative flex flex-col">
      <Navbar onConnect={onConnect} />
      <HeroSection onConnect={onConnect} />
      <FeatureCards />
      <Ticker />
    </div>
  );
};
