/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#0a0a0c',
          surface: '#141417',
          elevated: '#1a1a1f',
        },
        surface: {
          DEFAULT: '#141417',
          elevated: '#1a1a1f',
          hover: '#1e1e24',
        },
        border: {
          DEFAULT: '#232326',
          subtle: '#1b1b1e',
          hover: '#323238',
        },
        brand: {
          DEFAULT: '#6366f1',
          cyan: '#38bdf8',
          purple: '#a855f7',
        },
        status: {
          live: '#ef4444',
          active: '#10b981',
          warning: '#f59e0b',
        },
      },
      fontFamily: {
        sans: ['Outfit', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'logo-gradient': 'linear-gradient(135deg, #a855f7 0%, #38bdf8 100%)',
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
      },
      boxShadow: {
        'subtle': '0 4px 20px rgba(0,0,0,0.3)',
        'elevated': '0 8px 30px rgba(0,0,0,0.5)',
      },
    },
  },
  plugins: [],
}

