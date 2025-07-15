"use client";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import Link from "next/link";

interface Message {
  id: string;
  sender: "user" | "ai";
  text?: string;
  image?: string; // base64 string
  timestamp: number;
}

const PAGE_SIZE = 20;

// Dummy message generator
function generateDummyMessages(count: number, before?: number): Message[] {
  const now = before || Date.now();
  return Array.from({ length: count }, (_, i) => {
    const idx = count - i;
    return {
      id: (now - idx * 60000).toString(),
      sender: idx % 2 === 0 ? "user" : "ai",
      text: idx % 2 === 0 ? `Old user message #${idx}` : `Old Gemini reply #${idx}`,
      timestamp: now - idx * 60000,
    };
  });
}

function MessageSkeleton() {
  return (
    <div className="flex justify-start mb-4">
      <div className="w-8 h-8 rounded-full mr-3 animate-pulse" style={{ background: 'var(--secondary-bg)' }} />
      <div className="flex-1 space-y-2">
        <div className="h-4 rounded animate-pulse" style={{ background: 'var(--secondary-bg)', width: '60%' }} />
        <div className="h-4 rounded animate-pulse" style={{ background: 'var(--secondary-bg)', width: '40%' }} />
      </div>
    </div>
  );
}

export default function ChatroomPage() {
  const { id } = useParams();
  const [allMessages, setAllMessages] = useState<Message[]>([]);
  const [page, setPage] = useState(1);
  const [aiTyping, setAiTyping] = useState(false);
  const [input, setInput] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [hoveredMsg, setHoveredMsg] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const messagesTopRef = useRef<HTMLDivElement | null>(null);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isDark, setIsDark] = useState(false);

  // On mount, load initial dummy messages with skeleton and setup theme
  useEffect(() => {
    setInitialLoading(true);
    setTimeout(() => {
      setAllMessages(generateDummyMessages(40)); // 40 dummy messages for demo
      setInitialLoading(false);
    }, 1200); // Simulate loading delay

    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    
    setIsDark(shouldBeDark);
    document.documentElement.classList.toggle('dark', shouldBeDark);
  }, []);

  const toggleDarkMode = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    document.documentElement.classList.toggle('dark', newIsDark);
    localStorage.setItem('theme', newIsDark ? 'dark' : 'light');
  };

  // Paginate messages: show only the latest (page * PAGE_SIZE)
  const paginatedMessages = allMessages.slice(-page * PAGE_SIZE);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [paginatedMessages.length, aiTyping]);

  // Infinite scroll: load older messages when scrolled to top
  useEffect(() => {
    const container = messagesTopRef.current?.parentElement;
    if (!container) return;
    const handleScroll = () => {
      if (container.scrollTop === 0 && !loadingOlder && paginatedMessages.length < allMessages.length) {
        setLoadingOlder(true);
        setTimeout(() => {
          setPage((p) => p + 1);
          setLoadingOlder(false);
        }, 700); // Simulate loading delay
      }
    };
    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [loadingOlder, paginatedMessages.length, allMessages.length]);

  const sendMessage = (text: string, imageData?: string) => {
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: text || undefined,
      image: imageData,
      timestamp: Date.now(),
    };
    setAllMessages((msgs) => [...msgs, userMsg]);
    setAiTyping(true);
    setTimeout(() => {
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: imageData
          ? "Gemini: Nice image!"
          : `Gemini: You said "${text}"`,
        timestamp: Date.now(),
      };
      setAllMessages((msgs) => [...msgs, aiMsg]);
      setAiTyping(false);
    }, 1200); // Simulate AI reply delay
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() || image) {
      sendMessage(input.trim(), image || undefined);
      setInput("");
      setImage(null);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImage(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleCopy = (msg: Message) => {
    if (msg.text) {
      navigator.clipboard.writeText(msg.text);
      toast.success("Message copied!");
    } else if (msg.image) {
      navigator.clipboard.writeText(msg.image);
      toast.success("Image URL copied!");
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--primary-bg)' }}>
      {/* Header */}
      <div className="nav">
        <div className="nav-content">
          <Link href="/dashboard" className="nav-brand">
            ← Gemini Chat
          </Link>
          <div className="nav-actions">
            <h1 className="text-lg font-medium mr-4" style={{ color: 'var(--primary-text)' }}>
              Conversation {id}
            </h1>
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

      {/* Chat Container */}
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full p-4">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto mb-6 space-y-6" style={{ minHeight: '200px', marginLeft: '400px' }}>
          <div ref={messagesTopRef} />
          
          {initialLoading
            ? Array.from({ length: 6 }).map((_, i) => <MessageSkeleton key={i} />)
            : null}
          
          {loadingOlder && !initialLoading && (
            <div className="space-y-6">
              {Array.from({ length: 3 }).map((_, i) => <MessageSkeleton key={i} />)}
            </div>
          )}
          
          {!initialLoading &&
            paginatedMessages.map((msg) => (
              <div key={msg.id} className={`message ${msg.sender === "user" ? "message-user" : "message-ai"}`}>
                <div className="flex items-start space-x-3">
                  <div className="flex-1 min-w-0">
                    <div 
                      className={`message-content ${msg.sender === "user" ? "ml-auto" : "mr-auto"}`}
                      onMouseEnter={() => setHoveredMsg(msg.id)}
                      onMouseLeave={() => setHoveredMsg(null)}
                    >
                      {msg.text && <div className="whitespace-pre-wrap">{msg.text}</div>}
                      {msg.image && (
                        <img
                          src={msg.image}
                          alt="uploaded"
                          className="mt-2 rounded-lg max-w-full max-h-60 border"
                          style={{ borderColor: 'var(--border-color)' }}
                        />
                      )}
                      
                      {(msg.text || msg.image) && hoveredMsg === msg.id && (
                        <button
                          onClick={() => handleCopy(msg)}
                          className="absolute top-2 right-2 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          style={{ 
                            background: 'var(--secondary-bg)',
                            color: 'var(--primary-text)'
                          }}
                          title="Copy to clipboard"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                          </svg>
                        </button>
                      )}
                    </div>
                    
                    <div className={`message-time ${msg.sender === "user" ? "text-right" : "text-left"}`}>
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                  
                  {msg.sender === "user" && (
                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'var(--accent-text)' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            ))}
          
          {aiTyping && !initialLoading && (
            <div className="message message-ai">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 animate-pulse" style={{ background: 'var(--gemini-gradient)' }}>
                  {/* Icon removed */}
                </div>
                <div className="message-content">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--secondary-text)' }}></div>
                    <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--secondary-text)', animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--secondary-text)', animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="card" style={{ marginLeft: '400px', marginRight: 'auto'}}>
          <form onSubmit={handleSubmit} className="flex items-end space-x-3">
            {/* Image Preview */}
            {image && (
              <div className="relative">
                <img
                  src={image}
                  alt="preview"
                  className="w-12 h-12 object-cover rounded-lg border"
                  style={{ borderColor: 'var(--border-color)' }}
                />
                <button
                  type="button"
                  onClick={() => setImage(null)}
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-white text-sm"
                  style={{ background: 'var(--danger-text)' }}
                >
                  ×
                </button>
              </div>
            )}
            
            {/* File Upload */}
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
                disabled={aiTyping}
              />
              <div className="p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" style={{ marginBottom: '10px', marginRight: '10px'}}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <circle cx="9" cy="9" r="2"></circle>
                  <path d="M21 15l-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
                </svg>
              </div>
            </label>
            
            {/* Text Input */}
            <div className="flex-1 relative">
              <input
                className="input pr-12"
                style={{
                  background: 'var(--secondary-bg)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--primary-text)'
                }}
                placeholder="Ask Gemini..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={aiTyping}
              />
              
              {/* Send Button */}
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full transition-colors"
                style={{
                  background: input.trim() || image ? 'var(--accent-text)' : 'var(--secondary-bg)',
                  color: input.trim() || image ? 'white' : 'var(--tertiary-text)'
                }}
                disabled={aiTyping || (!input.trim() && !image)}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22,2 15,22 11,13 2,9 22,2"></polygon>
                </svg>
              </button>
            </div>
          </form>
          
          {/* Footer */}
          <div className="mt-3 text-center">
            <p className="text-xs" style={{ color: 'var(--tertiary-text)' }}>
              Gemini may display inaccurate info, including about people, so double-check its responses.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

