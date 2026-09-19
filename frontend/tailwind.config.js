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
      },
      fontFamily: {
        sans: [
          '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto',
          'Helvetica Neue', 'Arial', 'sans-serif',
        ],
      },
      animation: {
        'spin-slow': 'spin 8s linear infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'float': 'float 4s ease-in-out infinite',
        'gradient': 'gradient-shift 4s ease infinite',
        'shimmer': 'shimmer 1.8s infinite',
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glow-indigo': '0 0 24px rgba(99, 102, 241, 0.4)',
        'glow-green':  '0 0 16px rgba(34, 197, 94, 0.4)',
        'glow-red':    '0 0 16px rgba(239, 68, 68, 0.4)',
      },
    },
  },
  plugins: [],
}
