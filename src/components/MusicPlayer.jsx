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
    <div className="card flex flex-col gap-6 group h-full" id="music-player">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center shadow-lg shadow-rose-500/20 group-hover:scale-110 transition-transform duration-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
          </div>
          <div>
            <h2 className="font-black text-gray-800 dark:text-gray-100 tracking-tight text-base">Music</h2>
            <p className="text-[9px] text-brand-600 dark:text-brand-400 font-black uppercase tracking-widest">Lo-Fi Radio</p>
          </div>
        </div>
        <span className={`badge ${isPlaying ? 'bg-emerald-500/10 text-emerald-500' : 'bg-gray-500/10 text-gray-500'}`}>
          {isPlaying ? 'Live' : 'Paused'}
        </span>
      </div>

      <div ref={containerRef} className="hidden" />

      {/* Track selector — Vertical List */}
      <div className="flex-1 space-y-2 overflow-y-auto pr-1 custom-scrollbar max-h-[160px]">
        {TRACKS.map((track, idx) => (
          <button
            key={track.id}
            onClick={() => switchTrack(idx)}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-300 ${
              idx === currentTrack
                ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20'
                : 'bg-gray-50/50 dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-white/10 border border-gray-100/50 dark:border-white/5'
            }`}
          >
            <span className="truncate mr-2">{track.title.split('—')[1]?.trim() || track.title}</span>
            {idx === currentTrack && <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>}
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4 pt-2 border-t border-gray-100 dark:border-white/5">
        <button
          onClick={togglePlay}
          disabled={!ready}
          className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 active:scale-90 
            ${ready 
              ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20 hover:scale-105' 
              : 'bg-gray-100 dark:bg-gray-800 text-gray-300'
            }`}
        >
          {isPlaying ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 ml-0.5" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          )}
        </button>

        <div className="flex-1 flex flex-col gap-1.5">
          <div className="flex justify-between text-[9px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-widest">
            <span>Volume</span>
            <span>{volume}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={handleVolume}
            className="w-full h-1 bg-gray-100 dark:bg-white/5 rounded-full appearance-none cursor-pointer accent-brand-500"
          />
        </div>
      </div>
    </div>
  )
}
