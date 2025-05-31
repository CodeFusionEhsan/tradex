// app/blogs/[id]/page.jsx
'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';

export default function BlogPage({params}) {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { id } = useParams()

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const { id } = await params
        const response = await fetch(`/api/fetch/blog/${id}`, {
          next: { revalidate: 3600 } // Cache for 1 hour
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch blog');
        }
        
        const data = await response.json();
        setBlog(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  if (loading) return <BlogLoadingSkeleton />;
  if (error) return <BlogError error={error} />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-gray-800">
      <article className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        {/* Blog Header */}
        <div className="mb-8">
          <h1 className="text-3xl mt-8 md:text-4xl font-bold text-white mb-4">
            {blog.title}
          </h1>
          <div className="flex items-center space-x-4 text-gray-400">
            <span className="flex items-center">
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {blog.uploaded_by.user_id}
            </span>
            <span>•</span>
            <span>{blog.reading_time} min read</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-8">
          {blog.tags.split(", ").map((tag, index) => (
            <span 
              key={index}
              className="px-3 py-1 bg-indigo-800/30 text-indigo-400 rounded-full text-sm"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Featured Image */}
        {blog.image && (
          <div className="relative w-full h-64 md:h-96 mb-8 rounded-xl overflow-hidden">
            <Image
              src={blog.image}
              alt={blog.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Blog Content */}
        <div className="prose prose-invert max-w-none">
          <p className="text-xl text-gray-300 mb-6">{blog.excerpt}</p>
          <div className="text-gray-300 leading-relaxed">
            {blog.content}
          </div>
        </div>
      </article>
    </div>
  );
}

// Loading Skeleton Component
const BlogLoadingSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-gray-800 p-8">
    <div className="max-w-4xl mx-auto animate-pulse">
      <div className="h-8 bg-gray-800 rounded w-3/4 mb-6"></div>
      <div className="h-4 bg-gray-800 rounded w-1/2 mb-8"></div>
      <div className="h-64 bg-gray-800 rounded-xl mb-8"></div>
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-4 bg-gray-800 rounded w-full"></div>
        ))}
      </div>
    </div>
  </div>
);

// Error Component
const BlogError = ({ error }) => (
  <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-gray-800 flex items-center justify-center text-center p-4">
    <div className="max-w-md">
      <h2 className="text-2xl font-bold text-red-500 mb-4">Error Loading Blog</h2>
      <p className="text-gray-300 mb-6">{error}</p>
      <a 
        href="/blogs" 
        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition-colors"
      >
        Back to Blogs
      </a>
    </div>
  </div>
);
