import { useState, useEffect, useRef, useCallback } from 'react'

/** Total seconds for one Pomodoro session */
const POMODORO_DURATION = 25 * 60 // 1500 seconds

/**
 * PomodoroTimer — a 25-minute focus timer with start/pause/reset,
 * session counter, audible + visual alerts on completion.
 */
export default function PomodoroTimer() {
  const [secondsLeft, setSecondsLeft] = useState(POMODORO_DURATION)
  const [status, setStatus] = useState('idle') // 'idle' | 'running' | 'paused'
  const [sessions, setSessions] = useState(0)
  const [showAlert, setShowAlert] = useState(false)
  const intervalRef = useRef(null)

  /** Play a short beep using the Web Audio API */
  const playBeep = useCallback(() => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.type = 'sine'
      osc.frequency.setValueAtTime(880, ctx.currentTime) // A5 note
      gain.gain.setValueAtTime(0.3, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8)
      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + 0.8)
    } catch {
      // Audio not supported — silently fail
    }
  }, [])

  /** Handle timer completion */
  const handleComplete = useCallback(() => {
    clearInterval(intervalRef.current)
    intervalRef.current = null
    setStatus('idle')
    setSecondsLeft(POMODORO_DURATION)
    setSessions((prev) => prev + 1)
    playBeep()
    setShowAlert(true)
    setTimeout(() => setShowAlert(false), 3000)
  }, [playBeep])

  // Countdown effect
  useEffect(() => {
    if (status !== 'running') return

    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          handleComplete()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(intervalRef.current)
  }, [status, handleComplete])

  // Cleanup on unmount
  useEffect(() => {
    return () => clearInterval(intervalRef.current)
  }, [])

  /** Start or resume the timer */
  const start = () => setStatus('running')

  /** Pause the timer */
  const pause = () => setStatus('paused')

  /** Reset back to 25:00 idle state */
  const reset = () => {
    clearInterval(intervalRef.current)
    intervalRef.current = null
    setStatus('idle')
    setSecondsLeft(POMODORO_DURATION)
  }

  /** Format seconds as MM:SS */
  const formatTime = (s) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0')
    const sec = (s % 60).toString().padStart(2, '0')
    return `${m}:${sec}`
  }

  /** Calculate progress percentage (0 → 100) */
  const progress = ((POMODORO_DURATION - secondsLeft) / POMODORO_DURATION) * 100

  /** Status badge styling */
  const statusBadge = {
    idle:    'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400',
    running: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
    paused:  'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
  }

  return (
    <div className="card flex flex-col gap-6 group h-full" id="pomodoro-timer">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/20 group-hover:scale-110 transition-transform duration-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </div>
          <div>
            <h2 className="font-black text-gray-800 dark:text-gray-100 tracking-tight text-base">Timer</h2>
            <p className="text-[9px] text-brand-600 dark:text-brand-400 font-black uppercase tracking-widest">Focus Mode</p>
          </div>
        </div>
        <span className={`badge ${statusBadge[status]}`}>
          {status}
        </span>
      </div>

      {/* Timer display — More compact */}
      <div className="flex flex-col items-center py-2">
        <div className="relative w-32 h-32 flex items-center justify-center">
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 200 200">
            <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-100 dark:text-white/5" />
            <circle
              cx="100" cy="100" r="90"
              fill="none"
              strokeWidth="6"
              strokeLinecap="round"
              className="text-violet-500 transition-all duration-1000 ease-linear"
              style={{
                strokeDasharray: `${2 * Math.PI * 90}`,
                strokeDashoffset: `${2 * Math.PI * 90 * (1 - progress / 100)}`,
              }}
              stroke="currentColor"
            />
          </svg>
          <span className="text-3xl font-black tabular-nums tracking-tighter text-gray-800 dark:text-gray-100">
            {formatTime(secondsLeft)}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        {status === 'running' ? (
          <button onClick={pause} className="flex-1 py-3 bg-amber-500 hover:bg-amber-400 text-white font-bold rounded-2xl transition-all duration-300">
            Pause
          </button>
        ) : (
          <button onClick={start} className="flex-1 py-3 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-2xl transition-all duration-300">
            {status === 'paused' ? 'Resume' : 'Start'}
          </button>
        )}
        <button onClick={reset} className="p-3 bg-gray-100 dark:bg-white/5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-2xl transition-all duration-300">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
        </button>
      </div>

      {/* Sessions */}
      <div className="flex items-center justify-between px-2 pt-4 border-t border-gray-100 dark:border-white/5">
        <span className="text-[9px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-widest">Sessions</span>
        <div className="flex gap-1">
          {[...Array(4)].map((_, i) => (
            <div key={i} className={`w-1.5 h-1.5 rounded-full ${i < (sessions % 4) ? 'bg-violet-500' : 'bg-gray-200 dark:bg-white/10'}`}></div>
          ))}
        </div>
      </div>
    </div>
  )
}
