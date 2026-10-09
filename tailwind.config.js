/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
        'outfit': ['Outfit', 'sans-serif'],
      },
      colors: {
        'sonora-base': '#121212',
        'sonora-surface': '#1A1A1A',
        'sonora-surface-hover': '#2A2A2A',
        'sonora-primary': '#D9A05B', // Warm accent
        'sonora-primary-hover': '#C1884B',
        'sonora-text': '#F3F4F6',
        'sonora-text-muted': '#9CA3AF',
        'sonora-border': '#333333',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}