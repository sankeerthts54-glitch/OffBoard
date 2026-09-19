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
          50: '#eef2ff',
          100: '#e0e7ff',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          900: '#312e81',
        },
        badge: {
          keep: '#10b981',
          transfer: '#3b82f6',
          cancel: '#ef4444',
          close: '#6b7280',
          migrate: '#f59e0b',
        }
      }
    },
  },
  plugins: [],
}
