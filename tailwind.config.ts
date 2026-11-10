// ============================================================
// GIVORA — TAILWIND CSS CONFIGURATION
// Design system tokens
// ============================================================
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Givora Brand Palette
        ivory: '#F5F0EB',
        champagne: '#E8D5B7',
        taupe: '#B5A49A',
        charcoal: '#1C1C1C',
        gold: '#C9A96E',
        'off-white': '#FAF8F5',
      },
      fontFamily: {
        sans: ['Nunito Sans', 'system-ui', 'sans-serif'],
        arabic: ['Noto Naskh Arabic', 'system-ui', 'sans-serif'],
        display: ['Cormorant Garamond', 'Georgia', 'serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
      },
      boxShadow: {
        'luxury': '0 4px 24px -4px rgba(28, 28, 28, 0.08), 0 1px 4px rgba(28, 28, 28, 0.04)',
        'luxury-lg': '0 12px 48px -8px rgba(28, 28, 28, 0.12), 0 2px 8px rgba(28, 28, 28, 0.06)',
        'gold': '0 4px 16px -4px rgba(201, 169, 110, 0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
