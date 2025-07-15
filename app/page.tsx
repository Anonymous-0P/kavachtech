"use client";
import Link from "next/link";

export default function Home() {
  return (
    <main 
      className="flex min-h-screen flex-col items-center justify-center p-8"
      style={{ background: 'var(--primary-bg)' }}
    >
      <div className="text-center max-w-2xl mx-auto animate-fade-in">
        {/* Logo */}
        <div className="w-24 h-24 mx-auto mb-8 rounded-full flex items-center justify-center" style={{ background: 'var(--gemini-gradient)' }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        </div>

        {/* Title */}
        <h1 className="text-5xl font-light mb-4" style={{ color: 'var(--primary-text)' }}>
          Welcome to <span className="gradient-text">Gemini</span>
        </h1>
        
        {/* Subtitle */}
        <p className="text-xl mb-8" style={{ color: 'var(--secondary-text)' }}>
          Your AI assistant for conversations, creativity, and productivity
        </p>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="card text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ background: 'var(--active-bg)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-2" style={{ color: 'var(--primary-text)' }}>
              Natural Conversations
            </h3>
            <p className="text-sm" style={{ color: 'var(--secondary-text)' }}>
              Chat naturally with advanced AI that understands context
            </p>
          </div>

          <div className="card text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ background: 'var(--active-bg)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="9" cy="9" r="2"></circle>
                <path d="M21 15l-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-2" style={{ color: 'var(--primary-text)' }}>
              Image Understanding
            </h3>
            <p className="text-sm" style={{ color: 'var(--secondary-text)' }}>
              Upload images and get detailed analysis and insights
            </p>
          </div>

          <div className="card text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ background: 'var(--active-bg)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-2" style={{ color: 'var(--primary-text)' }}>
              Creative Assistant
            </h3>
            <p className="text-sm" style={{ color: 'var(--secondary-text)' }}>
              Generate ideas, write content, and solve problems creatively
            </p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="space-y-4">
          <Link href="/auth" className="btn btn-primary inline-flex items-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
              <polyline points="10,17 15,12 10,7"></polyline>
              <line x1="15" y1="12" x2="3" y2="12"></line>
            </svg>
            Get Started
          </Link>
          
          <div className="text-center">
            <p className="text-sm" style={{ color: 'var(--tertiary-text)' }}>
              Already have an account?{' '}
              <Link href="/auth" className="hover:underline" style={{ color: 'var(--accent-text)' }}>
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <p className="text-sm" style={{ color: 'var(--tertiary-text)' }}>
          Powered by Google Gemini AI
        </p>
      </div>
    </main>
  );
}