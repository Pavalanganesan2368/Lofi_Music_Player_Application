import { useState, useEffect, useRef, useCallback } from 'react'

/* ─── Curated lofi YouTube videos ─── */
const TRACKS = [
  { id: 'jfKfPfyJRdk', title: 'Lofi Girl — beats to relax/study to', category: 'Classic' },
  { id: 'rUxyKA_-grg', title: 'Lofi Girl — synthwave radio', category: 'Energy' },
  { id: '4xDzrJKXOOY', title: 'Lofi Girl — sleepy beats', category: 'Chill' },
  { id: '5yx6BWlEVcY', title: 'Chillhop — lofi hip hop radio', category: 'Hip Hop' },
  { id: 'MCkTebktHVc', title: 'Aesthetic Lofi Mix', category: 'Aesthetic' },
]

/**
 * MusicPlayer — embeds a YouTube IFrame player for lofi music streams.
 * Uses the YouTube IFrame Player API loaded dynamically.
 */
export default function MusicPlayer() {
  const [currentTrack, setCurrentTrack] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(50)
  const [ready, setReady] = useState(false)
  const playerRef = useRef(null)
  const containerRef = useRef(null)

  // Load the YouTube IFrame API script once
  useEffect(() => {
    if (window.YT && window.YT.Player) {
      initPlayer()
      return
    }

    // Callback invoked by the YouTube API once it's ready
    window.onYouTubeIframeAPIReady = () => initPlayer()

    const tag = document.createElement('script')
    tag.src = 'https://www.youtube.com/iframe_api'
    document.head.appendChild(tag)

    return () => { window.onYouTubeIframeAPIReady = null }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /** Initialize or re-create the YT player */
  const initPlayer = useCallback(() => {
    if (playerRef.current) {
      playerRef.current.destroy()
    }

    playerRef.current = new window.YT.Player(containerRef.current, {
      videoId: TRACKS[currentTrack].id,
      height: '0',
      width: '0',
      playerVars: {
        autoplay: 0,
        controls: 0,
        modestbranding: 1,
        rel: 0,
        origin: window.location.origin,
      },
      events: {
        onReady: (event) => {
          event.target.setVolume(volume)
          setReady(true)
        },
        onStateChange: (event) => {
          // YT.PlayerState: 1 = playing, 2 = paused
          setIsPlaying(event.data === window.YT.PlayerState.PLAYING)
        },
      },
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrack])

  // Initial load only
  useEffect(() => {
    if (window.YT && window.YT.Player && !playerRef.current) {
      initPlayer()
    }
  }, [initPlayer])

  /** Toggle play / pause */
  const togglePlay = () => {
    if (!playerRef.current || !ready) return
    if (isPlaying) {
      playerRef.current.pauseVideo()
    } else {
      playerRef.current.playVideo()
    }
  }

  /** Handle volume change */
  const handleVolume = (e) => {
    const vol = Number(e.target.value)
    setVolume(vol)
    if (playerRef.current && ready) {
      playerRef.current.setVolume(vol)
    }
  }

  /** Switch to a different track smoothly */
  const switchTrack = (index) => {
    if (index === currentTrack) return
    setCurrentTrack(index)
    
    if (playerRef.current && ready) {
      playerRef.current.loadVideoById(TRACKS[index].id)
      setIsPlaying(true)
    }
  }

  return (
    <div className="card flex flex-col gap-8 group" id="music-player">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center shadow-lg shadow-rose-500/20 group-hover:scale-110 transition-transform duration-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
          </div>
          <div>
            <h2 className="font-bold text-gray-800 dark:text-gray-100 tracking-tight text-lg">Music Player</h2>
            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest mt-0.5">Focus Beats</p>
          </div>
        </div>
        {/* Playback state badge */}
        <span className={`badge ${isPlaying ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-gray-50 text-gray-400 dark:bg-gray-800/50 dark:text-gray-500'}`}>
          <span className={`w-1.5 h-1.5 rounded-full mr-2 ${isPlaying ? 'bg-emerald-500 animate-pulse' : 'bg-gray-300 dark:bg-gray-600'}`}></span>
          {isPlaying ? 'Live' : 'Stopped'}
        </span>
      </div>

      {/* Hidden player container */}
      <div ref={containerRef} className="hidden" />

      {/* Now playing card */}
      <div className="bg-gray-50/50 dark:bg-gray-800/30 rounded-[1.5rem] p-6 flex items-center gap-5 border border-gray-100/50 dark:border-gray-800/30 transition-all duration-500 hover:bg-gray-50 dark:hover:bg-gray-800/50">
        {/* Animated bars */}
        <div className="flex items-end gap-1 h-10 w-8 shrink-0 pb-1">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`w-1.5 rounded-full transition-all duration-500 ${
                isPlaying
                  ? 'bg-gradient-to-t from-rose-500 to-orange-400 animate-bounce'
                  : 'bg-gray-200 dark:bg-gray-700'
              }`}
              style={{
                height: isPlaying ? `${Math.random() * 20 + 10}px` : '4px',
                animationDuration: `${Math.random() * 0.5 + 0.5}s`,
                animationDelay: `${i * 100}ms`,
              }}
            />
          ))}
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-gray-800 dark:text-gray-200 truncate leading-tight">
            {TRACKS[currentTrack].title}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span className="w-1 h-1 rounded-full bg-rose-500"></span>
            <p className="text-xs text-gray-400 dark:text-gray-500 font-medium uppercase tracking-wider">Streaming Now</p>
          </div>
        </div>
      </div>

      {/* Track selector */}
      <div className="space-y-4">
        <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] ml-1">Select Vibes</label>
        <div className="grid grid-cols-1 gap-2">
          {TRACKS.map((track, idx) => (
            <button
              key={track.id}
              onClick={() => switchTrack(idx)}
              className={`group/item flex items-center justify-between px-5 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-300 ${
                idx === currentTrack
                  ? 'bg-brand-600 text-white shadow-xl shadow-brand-600/20'
                  : 'bg-white dark:bg-gray-800/20 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 border border-gray-100 dark:border-gray-800/50'
              }`}
            >
              <div className="flex flex-col items-start min-w-0">
                <span className="truncate">{track.title.split('—')[1]?.trim() || track.title}</span>
                <span className={`text-[9px] uppercase tracking-wider font-bold mt-0.5 ${idx === currentTrack ? 'text-white/60' : 'text-gray-400 dark:text-gray-600'}`}>
                  {track.category}
                </span>
              </div>
              {idx === currentTrack ? (
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 opacity-0 group-hover/item:opacity-100 transform translate-x-1 group-hover/item:translate-x-0 transition-all duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-6 pt-2">
        <button
          onClick={togglePlay}
          disabled={!ready}
          className={`w-16 h-16 rounded-[2rem] flex items-center justify-center transition-all duration-500 active:scale-90 
            ${ready 
              ? 'bg-gradient-to-br from-rose-500 to-orange-500 text-white shadow-[0_10px_30px_rgba(244,63,94,0.3)] hover:shadow-[0_15px_40px_rgba(244,63,94,0.4)] hover:-translate-y-1' 
              : 'bg-gray-100 dark:bg-gray-800 text-gray-300 cursor-not-allowed'
            }`}
          id="music-play-btn"
        >
          {isPlaying ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1.5"/><rect x="14" y="4" width="4" height="16" rx="1.5"/></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 ml-1" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          )}
        </button>

        {/* Volume slider */}
        <div className="flex-1 flex flex-col gap-2">
          <div className="flex justify-between items-center mb-1">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/></svg>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Volume</span>
            </div>
            <span className="text-[10px] font-bold text-gray-400 tabular-nums">{volume}%</span>
          </div>
          <div className="relative group/vol h-6 flex items-center">
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={handleVolume}
              className="w-full h-1.5 bg-gray-100 dark:bg-gray-800/80 rounded-full appearance-none cursor-pointer
                         accent-rose-500
                         [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 
                         [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-4 
                         [&::-webkit-slider-thumb]:border-rose-500 [&::-webkit-slider-thumb]:shadow-lg
                         [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:duration-300
                         [&::-webkit-slider-thumb]:hover:scale-125"
              id="volume-slider"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
