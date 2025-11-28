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
          50: '#E6F2FF',
          100: '#CCE5FF',
          200: '#99CBFF',
          300: '#66B1FF',
          400: '#3397FF',
          500: '#0066FF',
          600: '#0052CC',
          700: '#003D99',
          800: '#002966',
          900: '#001433',
        },
        secondary: {
          50: '#F0EEFC',
          100: '#E1DDF9',
          200: '#C3BBF3',
          300: '#A599ED',
          400: '#8777E7',
          500: '#6C5CE7',
          600: '#5649B9',
          700: '#41378B',
          800: '#2B245C',
          900: '#16122E',
        },
        accent: {
          50: '#FFF4F0',
          100: '#FFE9E1',
          200: '#FFD3C3',
          300: '#FFBDA5',
          400: '#FFA787',
          500: '#FF6B35',
          600: '#CC5629',
          700: '#99401F',
          800: '#662B14',
          900: '#33150A',
        },
        dark: {
          50: '#E6E8ED',
          100: '#CCD1DB',
          200: '#99A3B7',
          300: '#667593',
          400: '#33476F',
          500: '#0A0E27',
          600: '#080B1F',
          700: '#060817',
          800: '#040510',
          900: '#020308',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'gradient': 'gradient 8s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'fade-in': 'fadeIn 0.6s ease-out',
      },
      keyframes: {
        gradient: {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(0, 102, 255, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(0, 102, 255, 0.8), 0 0 30px rgba(0, 212, 255, 0.6)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-100px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #0066FF 0%, #00D4FF 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #6C5CE7 0%, #A599ED 100%)',
        'gradient-dark': 'linear-gradient(135deg, #0A0E27 0%, #1a1f3a 100%)',
        'gradient-light': 'linear-gradient(135deg, #FFFFFF 0%, #F9FAFB 100%)',
        'gradient-mesh': 'radial-gradient(at 0% 0%, rgba(0, 102, 255, 0.1) 0px, transparent 50%), radial-gradient(at 100% 0%, rgba(108, 92, 231, 0.1) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(255, 107, 53, 0.1) 0px, transparent 50%), radial-gradient(at 0% 100%, rgba(0, 212, 255, 0.1) 0px, transparent 50%)',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(0, 102, 255, 0.3)',
        'glow-lg': '0 0 40px rgba(0, 102, 255, 0.4)',
        'glow-accent': '0 0 20px rgba(255, 107, 53, 0.3)',
      },
    },
  },
  plugins: [],
}

