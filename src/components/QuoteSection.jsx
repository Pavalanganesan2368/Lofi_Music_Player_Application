import { useState, useEffect } from 'react'

const FALLBACK_QUOTE = {
  content: "The only way to do great work is to love what you do.",
  author: "Steve Jobs"
}

/**
 * QuoteSection — Fetches a random motivational quote from an API
 * and refreshes it every 5 minutes.
 */
export default function QuoteSection() {
  const [quote, setQuote] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const fetchQuote = async () => {
    setLoading(true)
    setError(false)
    try {
      // Note: api.quotable.io can sometimes be unstable; using a timeout to handle failures gracefully
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000)

      const response = await fetch('https://zenquotes.io/api/random', { signal: controller.signal })
      clearTimeout(timeoutId)

      if (!response.ok) throw new Error('Failed to fetch')
      
      const data = await response.json()
      setQuote(data)
    } catch (err) {
      console.warn('Quote API failed, using fallback:', err.message)
      setQuote(FALLBACK_QUOTE)
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchQuote()
    // Refresh every 5 minutes (300,000 ms)
    const interval = setInterval(fetchQuote, 300000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="card h-full min-h-[200px] bg-gradient-to-br from-indigo-500/5 to-purple-500/5 group/quote overflow-hidden border-indigo-100/20 dark:border-indigo-500/10 flex flex-col md:flex-row items-center gap-6 md:gap-8 px-6 sm:px-10 py-8 md:py-0" id="quote-section">
      <div className="flex flex-col items-center gap-3 shrink-0">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 transition-transform duration-500 group-hover/quote:scale-110">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.75-2-2-2H4c-1.25 0-2 .75-2 2v7c0 1.25.75 2 2 2h4c0 3-4 4-4 4"/><path d="M14 21c3 0 7-1 7-8V5c0-1.25-.75-2-2-2h-4c-1.25 0-2 .75-2 2v7c0 1.25.75 2 2 2h4c0 3-4 4-4 4"/></svg>
        </div>
        <h2 className="font-black text-gray-400 dark:text-gray-500 tracking-[0.3em] text-[10px] uppercase">Wisdom</h2>
      </div>

      <div className="relative flex-1 text-center md:text-left">
        {loading && !quote ? (
          <div className="flex flex-col space-y-3 animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-4/5"></div>
          </div>
        ) : (
          <div className={`transition-all duration-700 ${loading ? 'opacity-50 blur-sm' : 'opacity-100 blur-0'}`}>
            <p className="text-gray-800 dark:text-gray-100 text-lg md:text-xl font-bold leading-relaxed italic">
              "{quote?.content}"
            </p>
            <div className="flex items-center gap-3 mt-4 justify-center md:justify-start">
              <div className="h-[2px] w-6 bg-indigo-500 rounded-full"></div>
              <p className="text-[10px] font-black text-gray-400 dark:text-gray-600 tracking-widest uppercase italic">
                {quote?.author}
              </p>
            </div>
          </div>
        )}
      </div>

      <button 
        onClick={fetchQuote} 
        disabled={loading}
        className="shrink-0 p-4 rounded-2xl bg-white/50 dark:bg-gray-800/50 text-gray-400 hover:text-indigo-500 transition-all duration-300 disabled:opacity-30 border border-gray-100 dark:border-gray-800/50 shadow-sm"
        title="Refresh Quote"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>
      </button>
    </div>
  )
}
