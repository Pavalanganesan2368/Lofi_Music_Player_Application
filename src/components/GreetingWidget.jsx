import { useState, useEffect } from 'react'

export default function GreetingWidget() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const hours = time.getHours()
  let greeting = 'Good Night'
  if (hours >= 5 && hours < 12) greeting = 'Good Morning'
  else if (hours >= 12 && hours < 17) greeting = 'Good Afternoon'
  else if (hours >= 17 && hours < 21) greeting = 'Good Evening'

  const timeString = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  const dateString = time.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })

  return (
    <div className="card bg-gradient-to-br from-brand-500/10 to-transparent border-brand-500/10 flex flex-col justify-between h-full min-h-[160px]">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-black text-gray-800 dark:text-gray-100 tracking-tight mb-1">
            {greeting}, <span className="text-brand-600 dark:text-brand-400">Focus!</span>
          </h2>
          <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">
            {dateString}
          </p>
        </div>
        <div className="px-4 py-2 rounded-2xl bg-white/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800/50 shadow-sm backdrop-blur-sm">
          <span className="text-xl font-black tabular-nums text-gray-800 dark:text-gray-100">
            {timeString}
          </span>
        </div>
      </div>
      
      <div className="mt-4 flex items-center gap-4">
        <div className="flex-1 h-[1px] bg-gradient-to-r from-brand-500/50 to-transparent"></div>
        <div className="flex gap-2">
          <div className="w-2 h-2 rounded-full bg-brand-500 animate-pulse"></div>
          <div className="w-2 h-2 rounded-full bg-brand-400/50"></div>
          <div className="w-2 h-2 rounded-full bg-brand-300/30"></div>
        </div>
      </div>
    </div>
  )
}
