// app/write/page.jsx
'use client';
import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { CldUploadWidget } from 'next-cloudinary';
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import HeroSection from '@/components/signin';

export default function WritePage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [reading_time, setReadingTime] = useState('');
  const [tags, setTags] = useState('');
  const [resource, setResource] = useState('')

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const {user, isLoaded, isSignedIn} = useUser()

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData()
    formData.append("title", title)
    formData.append("content", content)
    formData.append("excerpt", excerpt)
    formData.append("reading_time", reading_time)
    formData.append("tags", tags)
    formData.append("image", resource)
    const user_data = {
      user_id: user.web3Wallets[0]?.web3Wallet,
      user_image: user.imageUrl
    }
    formData.append("user", JSON.stringify(user_data))

    const res = await fetch('/api/store/blog', {
        method: "POST",
        body: formData
    })

    const jsres = await res.json()

    if (jsres.success == true) {
        window.location = "/blogs"
    } else {
        console.log("Error in uploading blog")
    }
  };

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-gray-800 flex flex-col items-center justify-center p-4 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Sign In Required</h2>
        <p className="text-gray-300 mb-6">Please sign in to create a blog post.</p>
        <Link href="/sign-in" className="bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 text-white font-medium py-2 px-6 rounded-lg transition-all duration-200">
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <>
    <SignedIn>
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-gray-800 p-4 md:p-8">
      <div className="max-w-4xl mx-auto bg-black/50 backdrop-blur-sm border border-gray-700 rounded-xl shadow-xl p-6 md:p-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-8">Write a Blog Post</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full bg-gray-800/80 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Excerpt</label>
            <textarea
              name="excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              required
              className="w-full bg-gray-800/80 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              rows="3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Content</label>
            <textarea
              name="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              className="w-full bg-gray-800/80 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              rows="8"
            />
          </div>

          <div>
            <CldUploadWidget
            className="w-full text-gray-300 bg-gray-800/80 border border-gray-700 rounded-lg px-3 py-2 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 transition-all"
        uploadPreset="ajiy2qfo"
        onSuccess={(result, { widget }) => {
          setResource(result?.info.secure_url);
          console.log(resource)
          setImagePreview(result?.info.secure_url)
          widget.close();
        }}
      >
        {({ open }) => {
          function handleOnClick() {
            setResource(undefined);
            open();
          }
          return (
            <button onClick={handleOnClick}>
              Upload an Image
            </button>
          );
        }}
      </CldUploadWidget>
            {imagePreview && (
              <div className="mt-2">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-32 w-auto rounded-lg object-cover"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Reading Time (minutes)</label>
            <input
              type="number"
              name="reading_time"
              value={reading_time}
              onChange={(e) => setReadingTime(e.target.value)}
              required
              min="1"
              className="w-full bg-gray-800/80 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Tags (comma-separated)</label>
            <input
              type="text"
              name="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="crypto, trading, blockchain"
              className="w-full bg-gray-800/80 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 text-white font-medium py-2 px-6 rounded-lg transition-all duration-200"
            >
              Publish
            </button>
          </div>
        </form>
      </div>
    </div>
    </SignedIn>
    <SignedOut>
      <HeroSection />
    </SignedOut>
    </>
  );
}
