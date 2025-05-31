// app/blogs/page.jsx
'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';

// Mock blog data - replace with real data fetching logic
const mockBlogs = [
  {
    id: 1,
    title: 'Understanding Crypto Trading Basics',
    excerpt: 'A beginner’s guide to crypto trading and market fundamentals.',
    reading_time: 5,
    tags: ['crypto', 'trading', 'basics'],
  },
  {
    id: 2,
    title: 'Top 5 Cryptocurrencies to Watch in 2025',
    excerpt: 'An analysis of promising cryptocurrencies for the upcoming year.',
    reading_time: 7,
    tags: ['crypto', 'analysis', '2025'],
  },
  {
    id: 3,
    title: 'How to Secure Your Crypto Wallet',
    excerpt: 'Best practices to keep your crypto assets safe and secure.',
    reading_time: 6,
    tags: ['security', 'wallet', 'crypto'],
  },
];

export default function BlogsPage() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
        const res = await fetch('/api/fetch/blog', {
            method: "GET"
        }).catch((err) => {
            console.log(err)
        })

        const jsres = await res.json()

        setBlogs(jsres.result)
    } 

    fetchBlogs()
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-gray-800 py-14 md:p-8">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto text-center mt-14 mb-12 px-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
          Welcome to Tradex Blogs
        </h1>
        <p className="text-gray-300 text-lg md:text-xl mb-6">
          Stay updated with the latest insights, tips, and news in crypto trading.
        </p>
        <Link href="/write">
          <button className="bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200">
            Write a Blog
          </button>
        </Link>
      </section>

      {/* Blogs List */}
      <section className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <div
            key={blog._id}
            className="bg-black/50 backdrop-blur-sm border border-gray-700 rounded-xl shadow-xl p-6 flex flex-col justify-between hover:shadow-indigo-500/50 transition-shadow duration-300"
          >
            <Link href={`/blogs/${blog._id}`}><img className='h-50 w-full' src={blog.image}/></Link>
            <div>
              <h2 className="text-xl font-bold text-white mt-2 mb-2">{blog.title}</h2>
              <p className="text-gray-300 mb-4 line-clamp-3">{blog.excerpt.slice(0, 350) + "..."}</p>
            </div>
            <div className="flex justify-between items-center text-gray-400 text-sm">
              <span>{blog.reading_time} min read</span>
              <div className="space-x-2">
                {blog.tags.split(", ").map((tag, idx) => (
                  <span
                    key={idx}
                    className="inline-block bg-indigo-700 bg-opacity-50 rounded-full px-3 py-1"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
