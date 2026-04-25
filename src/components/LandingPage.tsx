"use client"
import React from 'react';
import { Navbar } from './landing/Navbar';
import { HeroSection } from './landing/HeroSection';
import { FeatureCards } from './landing/FeatureCards';
import { Ticker } from './landing/Ticker';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen relative flex flex-col">
      <Navbar />
      <HeroSection />
      <FeatureCards />
      <Ticker />
    </div>
  );
};
