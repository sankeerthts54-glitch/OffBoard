/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
        midnight: {
          900: '#060612',
          800: '#0a0a1a',
          700: '#0f0f24',
          600: '#14142e',
        },
        electric: {
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
        },
      },
      fontFamily: {
        sans: [
          'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto',
          'Helvetica Neue', 'Arial', 'sans-serif',
        ],
      },
      animation: {
        'spin-slow': 'spin 8s linear infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'float': 'float 4s ease-in-out infinite',
        'float-delayed': 'float 4s ease-in-out 2s infinite',
        'gradient': 'gradient-shift 4s ease infinite',
        'shimmer': 'shimmer 1.8s infinite',
        'drift': 'drift 20s ease-in-out infinite',
        'drift-reverse': 'drift-reverse 25s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 4s ease-in-out infinite',
        'fade-up': 'fade-up 0.8s ease-out forwards',
        'slide-up': 'slide-up 0.6s ease-out forwards',
        'scale-in': 'scale-in 0.5s ease-out forwards',
        'orbit': 'orbit 30s linear infinite',
        'orbit-reverse': 'orbit-reverse 35s linear infinite',
        'flow': 'flow 3s ease-in-out infinite',
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glow-indigo': '0 0 24px rgba(99, 102, 241, 0.4)',
        'glow-green':  '0 0 16px rgba(34, 197, 94, 0.4)',
        'glow-red':    '0 0 16px rgba(239, 68, 68, 0.4)',
        'glow-violet': '0 0 32px rgba(139, 92, 246, 0.3)',
        'glow-cyan':   '0 0 24px rgba(34, 211, 238, 0.25)',
        'landing-card': '0 4px 40px rgba(0,0,0,0.5), 0 0 1px rgba(255,255,255,0.1)',
        'landing-card-hover': '0 8px 60px rgba(0,0,0,0.6), 0 0 1px rgba(255,255,255,0.15), 0 0 40px rgba(99,102,241,0.1)',
      },
    },
  },
  plugins: [],
}
