/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Default Emerald Theme
        'emerald-primary': '#10b981',
        'emerald-secondary': '#059669',
        'emerald-accent': '#6ee7b7',
        
        // Cobalt Blue Theme
        'cobalt-primary': '#3b82f6',
        'cobalt-secondary': '#1d4ed8',
        'cobalt-accent': '#93c5fd',
        
        // Magenta Theme
        'magenta-primary': '#d946ef',
        'magenta-secondary': '#a21caf',
        'magenta-accent': '#f0abfc',
        
        // Crimson Theme
        'crimson-primary': '#dc2626',
        'crimson-secondary': '#991b1b',
        'crimson-accent': '#fca5a5',
        
        // Tangerine Theme
        'tangerine-primary': '#ea580c',
        'tangerine-secondary': '#c2410c',
        'tangerine-accent': '#fed7aa',
        
        // Dark Base Colors
        'dark': {
          900: '#0f0f0f',
          800: '#1a1a1a',
          700: '#262626',
          600: '#404040',
          500: '#525252',
          400: '#737373',
          300: '#a3a3a3',
          200: '#d4d4d4',
          100: '#f5f5f5'
        },
        'smokey': {
          900: '#18181b',
          800: '#27272a',
          700: '#3f3f46',
          600: '#52525b',
          500: '#71717a',
          400: '#a1a1aa',
          300: '#d4d4d8',
          200: '#e4e4e7',
          100: '#f4f4f5'
        }
      },
      fontFamily: {
        'ovi': ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 8s linear infinite',
        'bounce-slow': 'bounce 3s infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px currentColor' },
          '100%': { boxShadow: '0 0 20px currentColor, 0 0 30px currentColor' },
        }
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}