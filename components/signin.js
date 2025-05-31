import React from 'react';
import { useRouter } from 'next/router';
import { SignInButton } from '@clerk/nextjs';

const HeroSection = () => {
  const router = useRouter();

  return (
    <div className="relative min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
      {/* Background gradient for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/30 to-gray-900" />
      <div className="relative z-10 w-full max-w-4xl mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
          Welcome to <span className="text-indigo-400">Tradex</span>
        </h1>
        <p className="text-xl sm:text-2xl text-gray-300 mb-8">
          Your AI-powered trading companion for crypto news, notes, blogs, and real-time charts.
        </p>
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 w-full sm:w-auto max-w-xs">
            <h3 className="text-lg font-semibold text-indigo-300 mb-2">Crypto News</h3>
            <p className="text-gray-300">Stay updated with the latest crypto news, powered by AI.</p>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 w-full sm:w-auto max-w-xs">
            <h3 className="text-lg font-semibold text-indigo-300 mb-2">Notes & Blogs</h3>
            <p className="text-gray-300">Make notes and publish or read blogs about crypto.</p>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 w-full sm:w-auto max-w-xs">
            <h3 className="text-lg font-semibold text-indigo-300 mb-2">Real-time Charts</h3>
            <p className="text-gray-300">Analyze real-time crypto data with interactive charts.</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <SignInButton className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-medium transition-colors"/>
          
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
