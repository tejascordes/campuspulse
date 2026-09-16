/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Airbnb brand palette
        rausch: '#FF5A5F',        // Primary red
        babu: '#00A699',          // Teal accent
        arches: '#FC642D',        // Orange accent
        hof: '#484848',           // Dark text
        foggy: '#767676',         // Secondary text
        // Surface system
        surface: {
          DEFAULT: '#FFFFFF',
          subtle: '#F7F7F7',
          hover: '#F0F0F0',
        },
        border: {
          DEFAULT: '#DDDDDD',
          subtle: '#EBEBEB',
          hover: '#B0B0B0',
        },
        // Category tints for card banners
        category: {
          tech: '#EBF4FF',
          nontech: '#EDFAF4',
          hackathon: '#FFF3E0',
          prizes: '#FDF4FF',
          refreshments: '#FFF8ED',
        },
      },
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'airbnb-gradient': 'linear-gradient(135deg, #FF5A5F 0%, #FC642D 100%)',
        'logo-gradient': 'linear-gradient(135deg, #FF5A5F 0%, #FC642D 100%)',
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'card': '0 2px 16px rgba(0,0,0,0.12)',
        'card-hover': '0 4px 24px rgba(0,0,0,0.18)',
        'pill': '0 1px 6px rgba(0,0,0,0.14)',
        'nav': '0 -1px 0 #EBEBEB',
        'modal': '0 8px 40px rgba(0,0,0,0.24)',
        'subtle': '0 1px 4px rgba(0,0,0,0.08)',
      },
    },
  },
  plugins: [],
}
