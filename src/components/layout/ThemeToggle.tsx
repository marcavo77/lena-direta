"use client"

import { useState, useEffect } from "react"
import { Sun, Moon } from "lucide-react"

export function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem("theme")
    if (stored === "light") {
      setTheme("light")
      document.documentElement.classList.add("light")
      document.documentElement.classList.remove("dark")
    } else {
      setTheme("dark")
      document.documentElement.classList.add("dark")
      document.documentElement.classList.remove("light")
    }
  }, [])

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark"
    setTheme(nextTheme)
    localStorage.setItem("theme", nextTheme)

    if (nextTheme === "light") {
      document.documentElement.classList.add("light")
      document.documentElement.classList.remove("dark")
    } else {
      document.documentElement.classList.add("dark")
      document.documentElement.classList.remove("light")
    }
  }

  if (!mounted) {
    return (
      <div
        className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-stone-800/80 border border-stone-700/60 opacity-0"
        aria-hidden="true"
      />
    )
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={
        theme === "dark"
          ? "Activer le mode clair"
          : "Activer le mode sombre"
      }
      title={
        theme === "dark"
          ? "Passer en mode clair"
          : "Passer en mode sombre"
      }
      className="theme-toggle-btn inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-stone-800/90 hover:bg-stone-700 text-amber-400 hover:text-amber-300 border border-stone-700/80 transition-all shadow-sm active:scale-95 shrink-0"
    >
      {theme === "dark" ? (
        <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 transition-transform hover:rotate-45" />
      ) : (
        <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500 transition-transform hover:-rotate-12" />
      )}
    </button>
  )
}
