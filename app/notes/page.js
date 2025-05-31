// app/notes/page.jsx
'use client';
import { useState, useEffect } from 'react';
import getuser from '@/actions/getuser.action';
import { useUser } from '@clerk/nextjs';
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import HeroSection from '@/components/signin';

export default function NotesPage() {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [title, setTitle] = useState("")

  const {user, isLoaded, isSignedIn} = useUser()

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newNote.trim()) {
      setNotes([{ id: Date.now(), text: newNote }, ...notes]);
      setNewNote('');
    }
  };

  const addNote = async (e) => {
    e.preventDefault()
    const user_json = {
        user_id: user.web3Wallets[0].web3Wallet,
        user_image: user.imageUrl
    }
    const formData = new FormData()
    formData.append("title", title)
    formData.append("content", newNote)
    formData.append("user", JSON.stringify(user_json))

    try {
        const res = await fetch('/api/store/note', {
            method: "POST",
            body: formData
        })

        const jsres = await res.json()

        if (!jsres.ok) {
            console.log("Error In Adding Note")
        }

        if (jsres.success == true) {
            window.location.reload()
        }

    } catch (err) {
        console.log(err)
    }
  }

  const fetchNotes = async () => {

    const res = await fetch(`/api/fetch/note/${user.web3Wallets[0].web3Wallet}`, {
        method: "GET"
    })

    const js_res = await res.json()

    if (!js_res.ok) {
        console.log("Error in fetching Notes")
    }

    setNotes(js_res.results)
  }

  useEffect(() => {
    if (isLoaded) {
        fetchNotes()
    }
  }, [user, isLoaded, isSignedIn])

  const handleDelete = async (id) => {
    
    const res = await fetch(`/api/delete/note/${id}`)

    const jsres = await res.json()

    if(jsres.success == true) {
        window.location.reload()
    } else {
        console.log("Error In Deleting Note")
    }
  };

  return (
    <>
    <SignedIn>
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-gray-800 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Add Note Form */}
        <div className="bg-black/50 backdrop-blur-sm border border-gray-700 rounded-xl shadow-xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Add a Note</h2>
          <form onSubmit={addNote} className="flex flex-col gap-4">
            <input 
                className="w-full bg-gray-800/80 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all min-h-[30px]"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Write your note here..."
              className="w-full bg-gray-800/80 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all min-h-[100px]"
              required
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 self-end"
            >
              Add Note
            </button>
          </form>
        </div>

        {/* Notes List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white mb-4">Your Notes</h2>
          {notes ? notes.length === 0 ? (
            <p className="text-gray-400">No notes yet. Add your first note above!</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {notes.map((note) => (
                <div
                  key={note._id}
                  className="bg-black/50 backdrop-blur-sm border border-gray-700 rounded-xl shadow-lg p-4 flex flex-col"
                >
                  <p className="text-gray-300 mb-4 flex-1">{note.title}</p>
                  <p className="text-gray-300 mb-4 flex-1">{note.content}</p>
                  <button
                    onClick={() => handleDelete(note._id)}
                    className="text-red-400 hover:text-red-300 text-sm self-end transition-colors"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          ): <></>}
        </div>
      </div>
    </div>
    </SignedIn>
    <SignedOut>
      <HeroSection />
    </SignedOut>
    </>
  );
}
