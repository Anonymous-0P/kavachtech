"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useChatroomStore } from "@/store/chatroomStore";
import { toast } from "react-hot-toast";

export default function DashboardPage() {
  const { chatrooms, addChatroom, deleteChatroom, hydrated, setHydrated } = useChatroomStore();
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [newRoom, setNewRoom] = useState("");
  const [isDark, setIsDark] = useState(false);

  // Hydrate the store on client-side only
  useEffect(() => {
    setHydrated();
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    
    setIsDark(shouldBeDark);
    document.documentElement.classList.toggle('dark', shouldBeDark);
  }, [setHydrated]);

  const toggleDarkMode = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    document.documentElement.classList.toggle('dark', newIsDark);
    localStorage.setItem('theme', newIsDark ? 'dark' : 'light');
  };

  // Hydrate the store on client-side only
  useEffect(() => {
    setHydrated();
  }, [setHydrated]);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(search), 300);
    return () => clearTimeout(handler);
  }, [search]);

  const filtered = hydrated ? chatrooms.filter((room) =>
    room.title.toLowerCase().includes(debounced.toLowerCase())
  ) : [];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (newRoom.trim()) {
      addChatroom(newRoom.trim());
      toast.success("Chatroom created!");
      setNewRoom("");
    }
  };

  const handleDelete = (id: string) => {
    deleteChatroom(id);
    toast.success("Chatroom deleted!");
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--primary-bg)' }}>
      {/* Header */}
      <div className="nav">
        <div className="nav-content">
          <h1 className="nav-brand">Gemini Chat</h1>
          <div className="nav-actions">
            <button
              onClick={toggleDarkMode}
              className="dark-mode-toggle"
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                {isDark ? (
                  // Sun icon for light mode
                  <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z"/>
                ) : (
                  // Moon icon for dark mode
                  <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z"/>
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content - Centered Container */}
      <div className="flex-1 flex items-center justify-center px-6 py-8">
        <div className="max-w-4xl w-full flex flex-col items-center space-y-12">
          {/* Welcome Section */}
          <div className="text-center animate-fade-in">
            <h1 className="text-4xl font-light mb-6" style={{ color: 'var(--primary-text)' }}>
              Hello, <span className="gradient-text">how can I help you today?</span>
            </h1>
            <p className="text-lg" style={{ color: 'var(--secondary-text)' }}>
              Start a new conversation or continue where you left off
            </p>
          </div>

          {/* Search Bar */}
          <div className="w-full flex justify-center">
            <div className="relative max-w-2xl w-full">
              <input
                className="input w-full pr-4 py-4 text-lg rounded-full shadow-soft"
                placeholder="Search your conversations..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  background: 'var(--surface-bg)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--primary-text)',
                  paddingLeft: '52px',
                  marginBottom: '20px'
                }}
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--tertiary-text)', marginBottom: '16px' }}>
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
              </div>
            </div>
          </div>

          {/* Create New Chatroom */}
          <div className="card max-w-2xl w-full animate-slide-in">
            <h2 className="text-xl font-medium mb-6 text-center" style={{ color: 'var(--primary-text)' }}>
              Start New Conversation
            </h2>
            <form onSubmit={handleCreate} className="flex gap-4 justify-center">
              <input
                className="input flex-1"
                placeholder="What would you like to talk about?"
                value={newRoom}
                onChange={(e) => setNewRoom(e.target.value)}
                style={{
                  background: 'var(--secondary-bg)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--primary-text)'
                }}
              />
              <button
                type="submit"
                className="btn btn-primary px-8"
                disabled={!newRoom.trim()}
              >
                Create
              </button>
            </form>
          </div>

          {/* Chatrooms List */}
          <div className="max-w-2xl w-full flex flex-col items-center">
            <h2 className="text-xl font-medium mb-6 text-center" style={{ color: 'var(--primary-text)' }}>
              Your Conversations
            </h2>
            
            {!hydrated ? (
              <div className="text-center py-12">
                <div className="spinner mx-auto mb-6"></div>
                <p style={{ color: 'var(--secondary-text)' }}>Loading conversations...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-16">
                
                <p className="text-lg mb-3" style={{ color: 'var(--primary-text)' }}>
                  {search ? "No conversations found" : "No conversations yet"}
                </p>
                <p style={{ color: 'var(--secondary-text)' }}>
                  {search ? "Try adjusting your search terms" : "Start your first conversation above"}
                </p>
              </div>
            ) : (
              <div className="space-y-4 w-full">
                {filtered.map((room, index) => (
                  <div 
                    key={room.id} 
                    className="card-elevated hover:shadow-medium transition-all duration-200 w-full relative"
                    style={{ 
                      animationDelay: `${index * 0.1}s`,
                      animation: 'fadeInUp 0.5s ease forwards'
                    }}
                  >
                    <div className="flex items-center justify-between w-full rounded">
                      <Link 
                        href={`/chatroom/${room.id}`}
                        className="flex-1 group"
                      >
                        <div className="flex items-center space-x-4">
                         
                          <div className="flex-1 min-w-0" style={{ marginLeft: '10px', marginTop: '5px' }}>
                            <h3 className="font-medium group-hover:text-blue-600 transition-colors truncate" style={{ color: 'var(--primary-text)' }}>
                              {room.title}
                            </h3>
                            <p className="text-sm mt-1" style={{ color: 'var(--secondary-text)' }}>
                              Created {new Date(parseInt(room.id)).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </Link>
                      <button
                        onClick={() => handleDelete(room.id)}
                        className="p-3 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors group ml-4"
                        title="Delete conversation"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:stroke-red-500">
                          <polyline points="3,6 5,6 21,6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          <line x1="10" y1="11" x2="10" y2="17"></line>
                          <line x1="14" y1="11" x2="14" y2="17"></line>
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}