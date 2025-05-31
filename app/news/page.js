// app/news/page.jsx
'use client';
import axios from 'axios';
import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function NewsPage() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        // Replace with your actual Newsdata.io API key
        const apiKey = 'YOUR_NEWSDATA_IO_API_KEY';
        const res = await axios.get(
          `https://newsdata.io/api/1/news?apikey=pub_3826fd2922e74f55abbd968e61bd37a7&language=en&category=business&q=crypto`
        );
        setNews(res.data.results);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-gray-800 flex items-center justify-center">
        <p className="text-white text-xl">Loading news...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-gray-800 flex items-center justify-center">
        <p className="text-red-400 text-xl">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-gray-800 py-12 px-4 md:px-8">
      <h1 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">
        
      </h1>

      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {news.map((item, index) => (
          <div
            key={index}
            className="bg-black/50 backdrop-blur-sm border border-gray-700 rounded-xl shadow-xl overflow-hidden hover:shadow-indigo-500/20 transition-all duration-200"
          >
            {item.image_url && (
              <div className="relative w-full h-48">
                <Image
                  src={item.image_url}
                  alt={item.title}
                  fill
                  className="object-cover"
                  unoptimized // For external images, use unoptimized or configure next.config.js
                />
              </div>
            )}
            <div className="p-6">
              <h2 className="text-xl font-semibold text-white mb-2 line-clamp-2">
                {item.title}
              </h2>
              <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                {item.description || item.content || 'No description available.'}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-xs">
                  {new Date(item.pubDate).toLocaleDateString()}
                </span>
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
                >
                  Read More
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Hero Section: Invite Friends */}
      <div className="max-w-7xl mx-auto bg-gradient-to-r from-indigo-900/80 to-blue-900/80 border border-indigo-700 rounded-xl shadow-lg p-8 md:p-12 text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Invite Your Friends to Tradex
        </h2>
        <p className="text-gray-200 text-lg mb-6">
          Share the power of crypto trading. Invite your friends and earn rewards!
        </p>
        <button className="bg-white text-indigo-700 hover:bg-indigo-100 font-bold py-3 px-8 rounded-full text-lg transition-all duration-200">
          Invite Now
        </button>
      </div>
    </div>
  );
}
