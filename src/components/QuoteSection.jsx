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
    <div className="card bg-gradient-to-br from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/5 dark:to-purple-500/5 group/quote overflow-hidden border-indigo-100/30 dark:border-indigo-500/10 flex flex-col items-center justify-center text-center" id="quote-section">
      <div className="flex flex-col items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 transition-transform duration-500 group-hover/quote:scale-110">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.75-2-2-2H4c-1.25 0-2 .75-2 2v7c0 1.25.75 2 2 2h4c0 3-4 4-4 4"/><path d="M14 21c3 0 7-1 7-8V5c0-1.25-.75-2-2-2h-4c-1.25 0-2 .75-2 2v7c0 1.25.75 2 2 2h4c0 3-4 4-4 4"/></svg>
        </div>
        <h2 className="font-bold text-gray-800 dark:text-gray-100 tracking-tight text-sm uppercase tracking-[0.3em]">Motivation</h2>
      </div>

      <div className="relative w-full">
        {loading && !quote ? (
          <div className="flex flex-col items-center space-y-3 animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-2/3"></div>
            <div className="h-3 bg-gray-100 dark:bg-gray-900 rounded w-1/3 mt-6"></div>
          </div>
        ) : (
          <div className={`transition-all duration-700 ${loading ? 'opacity-50 blur-sm' : 'opacity-100 blur-0'}`}>
            <p className="text-gray-800 dark:text-gray-200 text-xl font-semibold leading-relaxed italic px-2">
              "{quote?.content}"
            </p>
            <div className="flex flex-col items-center gap-3 mt-6">
              <div className="h-[2px] w-12 bg-indigo-400 dark:bg-indigo-600 rounded-full"></div>
              <p className="text-xs font-black text-gray-500 dark:text-gray-400 tracking-widest uppercase transition-colors duration-300 group-hover/quote:text-indigo-500">
                {quote?.author}
              </p>
            </div>
          </div>
        )}
        
        {/* Decorative elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none transition-transform duration-700 group-hover/quote:scale-150"></div>
      </div>

      <button 
        onClick={fetchQuote} 
        disabled={loading}
        className="mt-8 px-5 py-2 rounded-full border border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 text-[10px] font-bold text-gray-400 hover:text-indigo-500 hover:border-indigo-200 dark:text-gray-600 dark:hover:text-indigo-400 dark:hover:border-indigo-900/50 uppercase tracking-widest flex items-center gap-2 transition-all duration-300 disabled:opacity-30"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>
        {loading ? 'Refreshing...' : 'New Quote'}
      </button>
    </div>
  )
}
