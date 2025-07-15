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
    <div className="min-h-screen" style={{ background: 'var(--primary-bg)' }}>
      {/* Header */}
      <div className="nav">
        <div className="nav-content">
          <h1 className="nav-brand">Gemini Chat</h1>
          <div className="nav-actions">
            <div className="dark-mode-toggle">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-6">
        {/* Welcome Section */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl font-light mb-4" style={{ color: 'var(--primary-text)' }}>
            Hello, <span className="gradient-text">how can I help you today?</span>
          </h1>
          <p className="text-lg" style={{ color: 'var(--secondary-text)' }}>
            Start a new conversation or continue where you left off
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <input
              className="input w-full pl-12 pr-4 py-4 text-lg rounded-full shadow-soft"
              placeholder="Search your conversations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                background: 'var(--surface-bg)',
                borderColor: 'var(--border-color)',
                color: 'var(--primary-text)'
              }}
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
            </div>
          </div>
        </div>

        {/* Create New Chatroom */}
        <div className="card max-w-2xl mx-auto mb-8 animate-slide-in">
          <h2 className="text-xl font-medium mb-4" style={{ color: 'var(--primary-text)' }}>
            Start New Conversation
          </h2>
          <form onSubmit={handleCreate} className="flex gap-3">
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
              className="btn btn-primary px-6"
              disabled={!newRoom.trim()}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
              </svg>
              Create
            </button>
          </form>
        </div>

        {/* Chatrooms List */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-xl font-medium mb-4" style={{ color: 'var(--primary-text)' }}>
            Your Conversations
          </h2>
          
          {!hydrated ? (
            <div className="text-center py-8">
              <div className="spinner mx-auto mb-4"></div>
              <p style={{ color: 'var(--secondary-text)' }}>Loading conversations...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ background: 'var(--secondary-bg)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              </div>
              <p className="text-lg mb-2" style={{ color: 'var(--primary-text)' }}>
                {search ? "No conversations found" : "No conversations yet"}
              </p>
              <p style={{ color: 'var(--secondary-text)' }}>
                {search ? "Try adjusting your search terms" : "Start your first conversation above"}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((room, index) => (
                <div 
                  key={room.id} 
                  className="card-elevated hover:shadow-medium transition-all duration-200"
                  style={{ 
                    animationDelay: `${index * 0.1}s`,
                    animation: 'fadeInUp 0.5s ease forwards'
                  }}
                >
                  <div className="flex items-center justify-between">
                    <Link 
                      href={`/chatroom/${room.id}`}
                      className="flex-1 group"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'var(--gemini-gradient)' }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
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
                      className="ml-4 p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors group"
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
  );
} 