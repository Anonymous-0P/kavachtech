import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import DarkModeToggle from "../components/DarkModeToggle";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Gemini Chat - AI Assistant",
  description: "Chat with Google's Gemini AI assistant",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: 'var(--surface-bg)',
              color: 'var(--primary-text)',
              border: '1px solid var(--border-color)',
            },
          }}
        />
        <div className="fixed top-6 right-6 z-50">
          <DarkModeToggle />
        </div>
        {children}
      </body>
    </html>
  );
}
