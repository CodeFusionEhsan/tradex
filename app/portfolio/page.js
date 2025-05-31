"use client"
import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import  Moralis  from 'moralis';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import axios from 'axios';
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import HeroSection from '@/components/signin';

const CRYPTO_IDS = ['bitcoin', 'ethereum', 'cardano', 'solana', 'ripple', 'dogecoin', 'avalanche'];

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
      <div className="flex space-x-4 overflow-x-auto pb-2 w-full">
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
  const { user, isLoaded, isSignedIn } = useUser();
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [blogs, setBlogs] = useState([])

  const router = useRouter();

  const handleTradeClick = () => {
    router.push('https://portfolio.metamask.io/');
  };

  const handleDelete = async (id) => {
    const res = await fetch(`/api/delete/blog/${id}`)

    const jsres = await res.json()

    if(jsres.success == true) {
        window.location.reload()
    } else {
        console.log("Error In Deleting Note")
    }
  }

  useEffect(() => {
    if (!user) return;

    const fetchBlogs = async () => {
      const user_id  = user?.web3Wallets[0]?.web3Wallet

      try {

        const res = await fetch(`/api/fetch/blog/user/${user_id}`, {
          method: "GET"
        })

        const jsres = await res.json()

        if (jsres.success == true) {
          setBlogs(jsres.results)
        } else {
          console.log("Error In Fetching Blogs")
        }
      } catch (err) {
        console.error(err)
      }
    }

    setLoading(true);
    // Get wallet address from user metadata or prompt
    const walletAddress = user.web3Wallets?.[0]?.web3Wallet || '0xYourDefaultWalletAddress';
    if (!walletAddress) {
      setLoading(false);
      return;
    }

    // Initialize Moralis (only once)
    if (!Moralis.Core.isStarted) {
      Moralis.start({
        apiKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6IjRjYjYwNzJlLTc4NzctNGY4Zi1hNWI1LTJkMjk4MTBkY2Y2ZCIsIm9yZ0lkIjoiNDUwMTEzIiwidXNlcklkIjoiNDYzMTI1IiwidHlwZUlkIjoiMTJiZjkzY2EtNjJlNC00OWZiLWJmMDUtNWZhYThhNWE1OTJmIiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3NDg2MTc3NjcsImV4cCI6NDkwNDM3Nzc2N30.KeNiyqI1yZUG9jufkVRSGc1TP63kvS7NzaaudrgubS4', // Replace with your key
      });
    }

    // Fetch native balance for Ethereum
    Moralis.EvmApi.balance.getNativeBalance({
      address: walletAddress,
      chain: '0x1', // Ethereum Mainnet
    })
      .then(async (response) => {
        console.log(response)
        const jsres = response.jsonResponse
        console.log(jsres)
        const value = jsres.balance;
        setBalance(`${value} $`);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setBalance('Error fetching balance');
        setLoading(false);
      });

      fetchBlogs()
  }, [user, isLoaded, isSignedIn]);

  return (
    <>
    <SignedIn>
    <div className="min-h-screen py-20 bg-gray-900 text-gray-100 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl mt-20 md:text-4xl font-bold mb-6 text-indigo-200">
          Wallet Dashboard
        </h1>

        {user ? (
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-xl p-4 md:p-6 shadow-lg">
              <h2 className="text-xl font-semibold mb-2 text-indigo-100">
                User Details
              </h2>
              <div className="space-y-2">
                <p className="text-gray-300">
                  <span className="font-medium">Wallet Status:</span> {user?.web3Wallets[0]. web3Wallet ? "Connected" : "Not Connected"}
                </p>
                <p className="text-gray-300">
                  <span className="font-medium">Welcome Trader</span>
                </p>
                <p className="text-gray-300">
                  <span className="font-medium">Wallet Address:</span> {user?.web3Wallets[0]?.web3Wallet || "Not set"}
                </p>
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-4 md:p-6 shadow-lg">
              <h2 className="text-xl font-semibold mb-2 text-indigo-100">
                Wallet Balance
              </h2>
              {loading ? (
                <p className="text-gray-400">Loading balance...</p>
              ) : (
                <p className="text-3xl font-bold text-indigo-100">
                  {balance || "No balance data"}
                </p>
              )}
            </div>

            <CryptoGraphsTabs />
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
                      <button
                        onClick={() => handleDelete(blog._id)}
                        className="text-red-400 hover:text-red-300 text-sm self-end transition-colors"
                      >
                        Delete Blog
                      </button>
                    </div>
                  </div>
                ))}
              </section>

              <section className="bg-base-200 text-center w-full my-10">
                <div className="text-center">
                  <div className="w-full text-center">
                    <h1 className="text-5xl w-full mt-20 font-bold text-center">
                      Trade Smarter with AI-Powered Insights
                    </h1>
                    <p className="py-6 text-xl">
                      Get realtime crypto data, breaking news, and expert AI answers—all in one place. 
                      Make notes, publish blogs, and stay ahead in the crypto world.
                    </p>
                    <button
                      onClick={handleTradeClick}
                      className="relative bg-blue inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 bg-indigo-600 transition-colors duration-300 mb-20"
                    >
                      Trade with MetaMask Portfolio
                    </button>
                  </div>
                </div>
              </section>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
            <p className="text-gray-300">Please sign in to view wallet details.</p>
          </div>
        )}
      </div>
    </div>
    </SignedIn>
    <SignedOut>
      <HeroSection />
    </SignedOut>
    </>
  );
}
