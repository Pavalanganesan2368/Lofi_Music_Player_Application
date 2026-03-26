import { useState, useEffect } from 'react'
import ThemeToggle from './components/ThemeToggle'
import MusicPlayer from './components/MusicPlayer'
import PomodoroTimer from './components/PomodoroTimer'
import TaskPanel from './components/TaskPanel'
import QuoteSection from './components/QuoteSection'

function App() {
  // Initialize theme from localStorage or system preference
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('lofocus-theme')
    if (saved !== null) return saved === 'dark'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  // Apply dark class to <html> element whenever darkMode changes
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
    localStorage.setItem('lofocus-theme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  return (
    <div className="min-h-screen transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 dark:bg-gray-950/70 border-b border-gray-200/50 dark:border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Logo */}
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-lg shadow-brand-500/30">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" stroke="none"/>
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight bg-gradient-to-r from-brand-600 to-brand-800 dark:from-brand-400 dark:to-brand-600 bg-clip-text text-transparent">
                LoFocus
              </h1>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 font-medium -mt-0.5 tracking-wider uppercase">
                Stay productive
              </p>
            </div>
          </div>
          <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
        </div>
      </header>

      {/* Main Content — Responsive Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (Music & Pomodoro) */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="animate-in" style={{ animationDelay: '100ms' }}>
              <MusicPlayer />
            </div>
            <div className="animate-in" style={{ animationDelay: '200ms' }}>
              <PomodoroTimer />
            </div>
            {/* Motivational Quote — Secondary focus */}
            <div className="md:col-span-2 animate-in flex justify-center w-full" style={{ animationDelay: '250ms' }}>
              <div className="w-full max-w-2xl">
                <QuoteSection />
              </div>
            </div>
          </div>
          
          {/* Right Column (Tasks) */}
          <div className="lg:col-span-4 animate-in" style={{ animationDelay: '300ms' }}>
            <TaskPanel />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-4 text-xs text-gray-400 dark:text-gray-600">
        Built with ♥ using React & Tailwind CSS
      </footer>
    </div>
  )
}

export default App
