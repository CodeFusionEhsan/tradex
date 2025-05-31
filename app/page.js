// app/page.jsx
'use client';
import { useUser } from '@clerk/nextjs';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const CRYPTO_IDS = ['bitcoin', 'ethereum', 'cardano', 'solana', 'ripple'];

function CryptoGraphsTabs() {
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(CRYPTO_IDS[0]);

  useEffect(() => {
    const fetchData = async () => {
      const data = {};
      for (const id of CRYPTO_IDS) {
        try {
          const res = await axios.get(
            `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=7&interval=daily`
          );
          data[id] = res.data.prices.map(([timestamp, price]) => ({
            date: new Date(timestamp).toLocaleDateString(),
            price,
          }));
        } catch (error) {
          console.error(`Error fetching data for ${id}:`, error);
        }
      }
      setChartData(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return <div className="text-white">Loading crypto graphs...</div>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mt-6"
    >
      <div className="flex space-x-4 overflow-x-auto pb-2">
        {CRYPTO_IDS.map((id) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-colors duration-200 ${
              activeTab === id 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {id.charAt(0).toUpperCase() + id.slice(1)}
          </button>
        ))}
      </div>

      <div className="bg-black/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4 shadow-lg mt-4">
        <h3 className="text-lg font-bold text-white capitalize mb-3">
          {activeTab} Price Chart (7 Days)
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData[activeTab]}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
              <XAxis dataKey="date" stroke="#cbd5e0" />
              <YAxis stroke="#cbd5e0" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1a202c', 
                  borderColor: '#4a5568',
                  borderRadius: '0.5rem'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="price" 
                stroke="#4f46e5" 
                fill="#4f46e5" 
                fillOpacity={0.2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
}

export default function Home() {
  const { isSignedIn, user } = useUser();
  const [news, setNews] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchCryptoNews = async () => {
    const res = await axios.get('https://newsdata.io/api/1/news?apikey=pub_3826fd2922e74f55abbd968e61bd37a7&language=en&category=business&q=crypto');
    return res.data.results.slice(0, 4);
  }

  const handleSubmit = async (e) => {
    setIsLoading(true)

    e.preventDefault()

    if (prompt.length > 0) {
      const formData = new FormData()
      formData.append("prompt", prompt)

      const res = await fetch('/api/ai', {
        method: "POST",
        body: formData
      })


      const jsres = await res.json()

      
      if (!jsres.ok) {
        console.log("Error In Fetching Response")
      }

      setResponse(jsres.output)

      setIsLoading(false)

    } else {  
      return ;
      setIsLoading(false)
    }
  }

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
    fetchCryptoNews().then(setNews)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-gray-800 p-4 md:p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Wallet Details Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-black/50 backdrop-blur-sm border border-gray-700 rounded-xl shadow-xl p-6 flex flex-col"
        >
          {isSignedIn && user ? (
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-4">
                Welcome, {user.firstName || 'Trader'}!
              </h2>
              <div className="bg-gray-800/80 rounded-lg p-4 mb-4">
                <h3 className="text-lg font-semibold text-gray-200 mb-2">Wallet Details</h3>
                <p className="text-gray-300 text-sm mb-1">
                  <span className="font-medium">Address:</span> {user.web3Wallets?.[0]?.web3Wallet || 'Not connected'}
                </p>
                <p className="text-gray-300 text-sm">
                  <span className="font-medium">Status:</span> {user.web3Wallets?.[0] ? 'Connected' : 'Not connected'}
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200"
                onClick={() => { window.location = "/portfolio"}}
              >
                Check Portfolio
              </motion.button>
              
              {/* Crypto Graphs Tabs */}
              <CryptoGraphsTabs />
            </div>
          ) : (
            <div className="flex-1 flex flex-col justify-center items-center text-center">
              <h2 className="text-2xl font-bold text-white mb-4">Welcome to Tradex</h2>
              <p className="text-gray-300 mb-6">Please sign in to view your wallet details and portfolio.</p>
              <Link href="/sign-in">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 text-white font-medium py-2 px-6 rounded-lg transition-all duration-200"
                >
                  Sign In
                </motion.button>
              </Link>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-black/50 backdrop-blur-sm border border-gray-700 rounded-xl shadow-xl p-6 flex flex-col" // Double height + extra
        >
          <h2 className="text-2xl font-bold text-white mb-4">Top Crypto News</h2>
          <div className="space-y-4 flex-1 overflow-y-auto">
            {news.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
                className="bg-gray-800/80 rounded-lg p-4"
              >
                <h3 className="text-lg font-semibold text-gray-200 mb-2">{item.title}</h3>
                <p className="text-gray-300 text-sm mb-3">{item.content}</p>
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
                >
                  Read more
                </a>
              </motion.div>
            ))}
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="mt-4 w-full bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200"
            onClick={() => { window.location = "/news"}}
          >
            Check News
          </motion.button>
        </motion.div>
      </div>
      <section className="max-w-7xl mx-auto my-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                          className="inline-block bg-indigo-700 bg-opacity-50 rounded-full mb-4 px-3 py-1"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </section>

             <div className="w-full bg-black/50 rounded-lg shadow-md pt-10 pb-10 pl-6 pr-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-6">Ask from AI</h1>
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter your prompt here..."
              className="flex-grow px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Generating...' : 'Generate Response'}
            </button>
          </div>
        </form>
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-white mb-4">AI Response</h2>
          <div
            className="bg-gray-100 p-4 rounded-lg min-h-32 border border-gray-200"
            style={{ whiteSpace: 'pre-wrap' }}
          >
            {isLoading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{response}</ReactMarkdown> || 'Your AI response will appear here.'
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
