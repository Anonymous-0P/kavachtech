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
      {dark ? (
        <span role="img" aria-label="Light mode">🌞</span>
      ) : (
        <span role="img" aria-label="Dark mode">🌙</span>
      )}
    </button>
  );
}