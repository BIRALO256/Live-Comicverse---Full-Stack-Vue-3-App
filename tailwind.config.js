/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        comic: {
          primary: '#FF6B35',
          secondary: '#4ECDC4',
          accent: '#FFE66D',
          dark: '#2C3E50',
          light: '#F8F9FA',
          bubble: '#FFFFFF',
          outline: '#2C3E50',
        }
      },
      fontFamily: {
        comic: ['Comic Neue', 'cursive'],
        heading: ['Bungee', 'cursive'],
      },
      animation: {
        'panel-reveal': 'panelReveal 0.8s ease-out forwards',
        'bubble-pop': 'bubblePop 0.3s ease-out forwards',
        'slide-in-left': 'slideInLeft 0.6s ease-out forwards',
        'slide-in-right': 'slideInRight 0.6s ease-out forwards',
      },
      keyframes: {
        panelReveal: {
          '0%': { opacity: '0', transform: 'scale(0.8) rotate(-2deg)' },
          '100%': { opacity: '1', transform: 'scale(1) rotate(0deg)' }
        },
        bubblePop: {
          '0%': { opacity: '0', transform: 'scale(0.5)' },
          '80%': { transform: 'scale(1.1)' },
          '100%': { opacity: '1', transform: 'scale(1)' }
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-100%)' },
          '100%': { opacity: '1', transform: 'translateX(0)' }
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(100%)' },
          '100%': { opacity: '1', transform: 'translateX(0)' }
        }
      }
    },
  },
  plugins: [],
}