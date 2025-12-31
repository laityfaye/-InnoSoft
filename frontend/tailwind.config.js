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
          50: '#FFEBEE',
          100: '#FFCDD2',
          200: '#EF9A9A',
          300: '#E57373',
          400: '#EF5350',
          500: '#F44336',
          600: '#E53935',
          700: '#D32F2F',
          800: '#C62828',
          900: '#B71C1C',
        },
        secondary: {
          50: '#F5F5F5',
          100: '#EEEEEE',
          200: '#E0E0E0',
          300: '#BDBDBD',
          400: '#9E9E9E',
          500: '#757575',
          600: '#616161',
          700: '#424242',
          800: '#212121',
          900: '#000000',
        },
        accent: {
          50: '#FFFFFF',
          100: '#FFFFFF',
          200: '#FFEBEE',
          300: '#FFCDD2',
          400: '#EF9A9A',
          500: '#FF5252',
          600: '#EF5350',
          700: '#E53935',
          800: '#D32F2F',
          900: '#C62828',
        },
        dark: {
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#EEEEEE',
          300: '#E0E0E0',
          400: '#BDBDBD',
          500: '#000000',
          600: '#000000',
          700: '#000000',
          800: '#000000',
          900: '#000000',
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
          '0%': { boxShadow: '0 0 5px rgba(244, 67, 54, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(244, 67, 54, 0.8), 0 0 30px rgba(211, 47, 47, 0.6)' },
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
        'gradient-primary': 'linear-gradient(135deg, #F44336 0%, #D32F2F 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #C62828 0%, #000000 100%)',
        'gradient-dark': 'linear-gradient(135deg, #000000 0%, #212121 100%)',
        'gradient-light': 'linear-gradient(135deg, #FFFFFF 0%, #FAFAFA 100%)',
        'gradient-mesh': 'radial-gradient(at 0% 0%, rgba(244, 67, 54, 0.1) 0px, transparent 50%), radial-gradient(at 100% 0%, rgba(211, 47, 47, 0.1) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(198, 40, 40, 0.1) 0px, transparent 50%), radial-gradient(at 0% 100%, rgba(244, 67, 54, 0.1) 0px, transparent 50%)',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(244, 67, 54, 0.3)',
        'glow-lg': '0 0 40px rgba(244, 67, 54, 0.4)',
        'glow-accent': '0 0 20px rgba(255, 82, 82, 0.3)',
      },
    },
  },
  plugins: [],
}

