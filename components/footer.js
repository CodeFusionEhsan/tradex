import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 py-10 px-4 md:px-8 lg:px-16 xl:px-24">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8">
          <div className="flex flex-col items-center md:items-start space-y-2">
            <h2 className="text-2xl font-bold text-white">Tradex</h2>
            <p className="text-sm max-w-xs text-center md:text-left">
              Your AI-powered crypto trading companion.
              <br />
              Real-time data, news, and insights in one place.
            </p>
          </div>
          <div className="flex flex-col items-center md:items-start space-y-2">
            <h3 className="text-lg font-semibold text-gray-200">Quick Links</h3>
            <ul className="space-y-1 flex flex-col items-center md:items-start">
              <li><Link href="/" className="hover:text-white transition">Home</Link></li>
              <li><Link href="/portfolio" className="hover:text-white transition">Portfolio</Link></li>
              <li><Link href="/news" className="hover:text-white transition">News</Link></li>
              <li><Link href="/notes" className="hover:text-white transition">Notes</Link></li>
              <li><Link href="/blogs" className="hover:text-white transition">Blogs</Link></li>
            </ul>
          </div>
          <div className="flex flex-col items-center md:items-start space-y-2">
            <h3 className="text-lg font-semibold text-gray-200">Connect</h3>
            <ul className="space-y-1 flex flex-col items-center md:items-start">
              <li>
                <a
                  href="https://github.com/CodeFusionEhsan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition"
                >
                  GitHub: Ehsan Saleem
                </a>
              </li>
              <li>
                <a href="mailto:ehsan@example.com" className="hover:text-white transition">
                  Email: web.ehsan.dev@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-6 text-center">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Tradex by Ehsan Saleem. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
