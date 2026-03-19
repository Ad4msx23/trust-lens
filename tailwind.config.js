/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"IBM Plex Mono"', 'monospace'],
        sans: ['"IBM Plex Sans"', 'sans-serif'],
      },
      colors: {
        base:           '#0f0f0f',
        surface:        '#1a1a1a',
        accent:         '#68FF7D',
        danger:         '#FF6B6B',
        'text-primary': '#f4f4f4',
        'text-muted':   '#6f6f6f',
        'text-dim':     '#3f3f3f',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fadeUp 0.4s ease-out forwards',
      },
    },
  },
  plugins: [],
}
