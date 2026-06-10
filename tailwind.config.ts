import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: [
    'transition-all',
    'duration-300',
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          base: 'var(--bg-base)',
          card: 'var(--bg-card)',
          elevated: 'var(--bg-elevated)',
        },
        border: {
          DEFAULT: 'var(--border)',
          active: 'var(--border-active)',
        },
        brand: {
          from: '#00D4FF',
          to: '#CC00FF',
        },
        accent: {
          purple: 'var(--accent-purple)',
          violet: 'var(--accent-violet)',
          // Original accent color preserved under nested structure
          DEFAULT: '#00FF7F',
        },
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          muted: 'var(--text-muted)',
        },
        success: 'var(--success)',
        warning: 'var(--warning)',
        // Custom colors from Tailwind CDN
        primary: '#00F3FF',
        secondary: '#FF00E5',
        'dark-bg': '#0A0A0A',
        'card-bg': '#151515',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        syne: ['var(--font-syne)', 'sans-serif'],
        inter: ['var(--font-inter)', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'monospace'],
      },
      spacing: {
        4: '4px',
        8: '8px',
        12: '12px',
        16: '16px',
        20: '20px',
        24: '24px',
        32: '32px',
        40: '40px',
        48: '48px',
        64: '64px',
        80: '80px',
        96: '96px',
        120: '120px',
      },
      fontSize: {
        12: '12px',
        14: '14px',
        16: '16px',
        18: '18px',
        20: '20px',
        24: '24px',
        32: '32px',
        36: '36px',
        40: '40px',
        48: '48px',
        56: '56px',
        64: '64px',
        80: '80px',
        96: '96px',
        120: '120px',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, var(--brand-from), var(--brand-to))',
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      boxShadow: {
        'brand-glow': '0 0 40px -10px rgba(255, 69, 0, 0.3)',
        'brand-glow-hover': '0 0 60px -15px rgba(255, 69, 0, 0.5)',
        'card': '0 4px 24px -8px rgba(0, 0, 0, 0.4)',
        'card-hover': '0 8px 32px -12px rgba(0, 0, 0, 0.5)',
      },
      animation: {
        'gradient-x': 'gradient-x 15s ease infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 3s infinite',
        'fade-in': 'fade-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-up': 'slide-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-down': 'slide-down 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center',
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center',
          },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(16px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-down': {
          '0%': { transform: 'translateY(-16px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
