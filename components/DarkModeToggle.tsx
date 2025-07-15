"use client";
import { useEffect, useState } from "react";

export default function DarkModeToggle() {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Check saved preference and system preference only on client side
    const saved = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    const shouldBeDark = saved === "dark" || (!saved && prefersDark);
    
    setDark(shouldBeDark);
    
    // Apply theme immediately
    if (shouldBeDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    
    console.log("Initial theme setup:", { shouldBeDark, htmlClasses: document.documentElement.className });
  }, []);

  const toggle = () => {
    const newDark = !dark;
    setDark(newDark);
    
    if (newDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
    
    console.log("Theme toggled to:", newDark);
    console.log("HTML element classes:", document.documentElement.className);
    console.log("HTML element has dark class:", document.documentElement.classList.contains("dark"));
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="fixed top-4 right-4 z-50 bg-gray-200 dark:bg-gray-700 rounded-full p-2 shadow w-10 h-10 animate-pulse" />
    );
  }

  return (
   <button
  onClick={toggle}
  aria-label="Toggle dark mode"
  className="fixed top-4 right-4 z-50 bg-gray-200 dark:bg-gray-700 rounded-full p-2 shadow hover:bg-gray-300 dark:hover:bg-gray-600 transition"
>
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-black dark:text-white">
    {dark ? (
      // Sun icon for light mode
      <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z"/>
    ) : (
      // Moon icon for dark mode
      <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z"/>
    )}
  </svg>
</button>

  );
}