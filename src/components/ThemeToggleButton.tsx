"use client";
import { useTheme } from "@/context/ThemeContext";

export default function ThemeToggleButton() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      className="mt-2 px-2 py-1 rounded text-xs font-semibold border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#222] hover:bg-gray-100 dark:hover:bg-[#333] transition"
      aria-label="Toggle dark/light mode"
    >
      {theme === "dark" ? "🌙 Dark" : "☀️ Light"}
    </button>
  );
}
