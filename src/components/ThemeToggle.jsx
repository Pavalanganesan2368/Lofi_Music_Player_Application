/**
 * ThemeToggle — switches between light and dark mode.
 * Uses a sun/moon icon with smooth rotation animation.
 */
export default function ThemeToggle({ darkMode, setDarkMode }) {
  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      className="group relative w-12 h-12 rounded-2xl bg-gray-50 dark:bg-gray-900 hover:bg-white dark:hover:bg-gray-800
                 flex items-center justify-center transition-all duration-500 active:scale-90
                 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md
                 focus:outline-none focus:ring-2 focus:ring-brand-400/50 focus:ring-offset-2 dark:focus:ring-offset-gray-950"
      aria-label="Toggle theme"
      id="theme-toggle"
    >
      {/* Sun icon (shown in dark mode → click to go light) */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`w-5 h-5 absolute transition-all duration-500 ${
          darkMode ? 'rotate-0 opacity-100 text-amber-400' : 'rotate-90 opacity-0 text-amber-400'
        }`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="5" />
        <line x1="12" y1="1" x2="12" y2="3" />
        <line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" />
        <line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
      </svg>

      {/* Moon icon (shown in light mode → click to go dark) */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`w-5 h-5 absolute transition-all duration-500 ${
          darkMode ? '-rotate-90 opacity-0 text-gray-600' : 'rotate-0 opacity-100 text-gray-600'
        }`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    </button>
  )
}
