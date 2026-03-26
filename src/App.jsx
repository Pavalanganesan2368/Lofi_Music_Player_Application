import { useState, useEffect } from 'react'
import ThemeToggle from './components/ThemeToggle'
import MusicPlayer from './components/MusicPlayer'
import PomodoroTimer from './components/PomodoroTimer'
import TaskPanel from './components/TaskPanel'
import QuoteSection from './components/QuoteSection'
import GreetingWidget from './components/GreetingWidget'

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('lofocus-theme')
    if (saved !== null) return saved === 'dark'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
    localStorage.setItem('lofocus-theme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  return (
    <div className="min-h-screen transition-colors duration-500 pb-12">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-2xl bg-white/60 dark:bg-black/60 border-b border-gray-200/30 dark:border-white/5">
        <div className="max-w-[1400px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-xl shadow-brand-500/20">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" stroke="none"/>
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-gray-900 dark:text-white">
                LoFocus
              </h1>
              <p className="text-[10px] text-brand-600 dark:text-brand-400 font-black -mt-1 tracking-[0.2em] uppercase">
                Stay Productive
              </p>
            </div>
          </div>
          <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
        </div>
      </header>

      {/* Main Content — Bento Grid */}
      <main className="max-w-[1400px] mx-auto px-6 pt-12">
        <div className="bento-grid">
          
          {/* Top Section: Greeting & Quick Info */}
          <div className="bento-col-8 animate-in" style={{ animationDelay: '0ms' }}>
            <GreetingWidget />
          </div>

          {/* Right Section: Tasks (Full height on large screens) */}
          <div className="lg:col-span-4 lg:row-span-3 animate-in" style={{ animationDelay: '300ms' }}>
            <TaskPanel />
          </div>

          {/* Middle Section: Music & Pomodoro */}
          <div className="bento-col-4 animate-in" style={{ animationDelay: '100ms' }}>
            <MusicPlayer />
          </div>
          <div className="bento-col-4 animate-in" style={{ animationDelay: '200ms' }}>
            <PomodoroTimer />
          </div>

          {/* Bottom Section: Quote */}
          <div className="bento-col-8 animate-in" style={{ animationDelay: '400ms' }}>
            <QuoteSection />
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-[1400px] mx-auto px-6 mt-12 flex justify-between items-center text-[10px] font-bold text-gray-400 dark:text-gray-600 uppercase tracking-widest">
        <p>© 2026 LoFocus. All rights reserved.</p>
        <p>Built with ♥ for productivity</p>
      </footer>
    </div>
  )
}

export default App
