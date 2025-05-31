// components/Navbar.jsx
'use client';
import { useState } from 'react';
import Link from 'next/link';
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'

const Navbar = () => {
  const [isLoginHovered, setIsLoginHovered] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // SVG Icons for each nav link
  const navIcons = {
    Home: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    News: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
      </svg>
    ),
    Portfolio: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
    Notes: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    Blogs: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
      </svg>
    )
  };

  // Animated, colorful logo SVG
  const Logo = () => (
    <div className="flex items-center cursor-pointer">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="h-10 w-10">
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#ff3366', stopOpacity: 1 }} />
            <stop offset="50%" style={{ stopColor: '#3a86ff', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#2ec4b6', stopOpacity: 1 }} />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="40" fill="url(#logoGradient)" />
        <text x="50" y="60" textAnchor="middle" fill="white" fontFamily="Arial" fontSize="40" fontWeight="bold">T</text>
      </svg>
      <span className="ml-2 text-xl font-bold text-white">Tradex</span>
    </div>
  );

  return (
    <nav className="w-full fixed top-0 z-50 backdrop-blur-lg bg-gradient-to-b from-black/90 to-black/70 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Logo />
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {['Home', 'News', 'Portfolio', 'Notes', 'Blogs'].map((item) => (
                  <Link
                    key={item}
                    href={item != "Home" ? `/${item.toLowerCase()}`: `/`}
                    className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-indigo-600/30 transition-colors duration-200"
                  >
                    {navIcons[item]}
                    <span className="ml-2">{item}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <SignedOut>
              <SignInButton className={`relative bg-blue inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isLoginHovered ? 'bg-indigo-600' : 'bg-indigo-500'} transition-colors duration-300`} />
            </SignedOut>
            <SignedIn>
              <UserButton className={`relative bg-blue inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isLoginHovered ? 'bg-indigo-600' : 'bg-indigo-500'} transition-colors duration-300`}/>
            </SignedIn>
            <div className="ml-4 flex items-center md:hidden">
              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Mobile menu */}
      <div className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {['Home', 'News', 'Portfolio', 'Notes', 'Blogs'].map((item) => (
            <Link
              key={item}
              href={item != "Home" ? `/${item.toLowerCase()}`: `/`}
              className="flex items-center px-3 py-2 rounded-md text-base font-medium text-white hover:bg-indigo-600/30"
            >
              {navIcons[item]}
              <span className="ml-2">{item}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
