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

  // On mount, load initial dummy messages with skeleton
  useEffect(() => {
    setInitialLoading(true);
    setTimeout(() => {
      setAllMessages(generateDummyMessages(40)); // 40 dummy messages for demo
      setInitialLoading(false);
    }, 1200); // Simulate loading delay
  }, []);

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
            <h1 className="text-lg font-medium" style={{ color: 'var(--primary-text)' }}>
              Conversation {id}
            </h1>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full p-4">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto mb-6 space-y-6" style={{ minHeight: '400px' }}>
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
                  {msg.sender === "ai" && (
                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'var(--gemini-gradient)' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    </div>
                  )}
                  
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
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
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
        <div className="card">
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
              <div className="p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
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
