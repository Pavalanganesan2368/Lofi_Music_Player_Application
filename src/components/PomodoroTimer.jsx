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
    <div className="card flex flex-col gap-8 group" id="pomodoro-timer">
      {/* Completion flash overlay */}
      {showAlert && (
        <div className="fixed inset-0 z-[100] bg-emerald-500/10 animate-pulse pointer-events-none" />
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/20 group-hover:scale-110 transition-transform duration-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </div>
          <div>
            <h2 className="font-bold text-gray-800 dark:text-gray-100 tracking-tight text-lg">Focus Timer</h2>
            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest mt-0.5">Deep Work</p>
          </div>
        </div>
        <span className={`badge ${statusBadge[status]}`}>
          {status === 'idle' ? 'Ready' : status === 'running' ? 'Focusing' : 'Paused'}
        </span>
      </div>

      {/* Timer display with circular progress */}
      <div className="flex flex-col items-center py-6">
        <div className="relative w-56 h-56 flex items-center justify-center">
          {/* Background circle */}
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 200 200">
            <circle cx="100" cy="100" r="92" fill="none" stroke="currentColor" strokeWidth="4" className="text-gray-100 dark:text-gray-800/50" />
            <circle
              cx="100" cy="100" r="92"
              fill="none"
              strokeWidth="8"
              strokeLinecap="round"
              className="text-violet-500 dark:text-violet-400 transition-all duration-1000 ease-linear"
              style={{
                strokeDasharray: `${2 * Math.PI * 92}`,
                strokeDashoffset: `${2 * Math.PI * 92 * (1 - progress / 100)}`,
                filter: 'drop-shadow(0 0 8px rgba(139, 92, 246, 0.3))'
              }}
              stroke="currentColor"
            />
          </svg>
          {/* Time display */}
          <div className="text-center z-10">
            <span className="text-6xl font-black tabular-nums tracking-tighter text-gray-800 dark:text-gray-100">
              {formatTime(secondsLeft)}
            </span>
            <div className="flex items-center justify-center gap-2 mt-2">
              <span className={`w-1.5 h-1.5 rounded-full ${status === 'running' ? 'bg-emerald-500 animate-pulse' : 'bg-gray-300 dark:bg-gray-600'}`}></span>
              <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                {status === 'running' ? 'Session active' : status === 'paused' ? 'Paused' : 'Idle'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        {status === 'running' ? (
          <button onClick={pause} className="btn-primary bg-amber-500 hover:bg-amber-400 shadow-amber-500/20 w-32" id="pomo-pause-btn">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1.5"/><rect x="14" y="4" width="4" height="16" rx="1.5"/></svg>
            Pause
          </button>
        ) : (
          <button onClick={start} className="btn-primary bg-violet-600 hover:bg-violet-500 shadow-violet-600/20 w-32" id="pomo-start-btn">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            {status === 'paused' ? 'Resume' : 'Start'}
          </button>
        )}
        <button onClick={reset} className="btn-secondary w-32 group/reset" id="pomo-reset-btn">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 group-hover/reset:rotate-180 transition-transform duration-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
          Reset
        </button>
      </div>

      {/* Session counter */}
      <div className="flex items-center justify-between px-2 pt-6 border-t border-gray-100 dark:border-gray-800/50">
        <div className="flex items-center gap-2.5 text-xs text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest">
          <div className="w-1.5 h-1.5 rounded-full bg-violet-500"></div>
          Sessions: <span className="text-gray-800 dark:text-gray-200">{sessions}</span>
        </div>

        {/* Completion alert badge */}
        {showAlert ? (
          <span className="badge bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 animate-bounce">
            Excellent! 🎉
          </span>
        ) : (
          <div className="flex gap-1">
            {[...Array(4)].map((_, i) => (
              <div key={i} className={`w-1.5 h-1.5 rounded-full ${i < (sessions % 4) ? 'bg-violet-500' : 'bg-gray-200 dark:bg-gray-800'}`}></div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
