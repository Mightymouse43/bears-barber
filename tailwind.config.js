/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        bebas: ['"Bebas Neue"', 'cursive'],
        cinzel: ['"Cinzel Decorative"', 'serif'],
        montserrat: ['Montserrat', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        dark: '#0D0B08',
        surface: '#1C1812',
        gold: '#C9A84C',
        'gold-light': '#EED05C',
        cream: '#F5F0E8',
      },
    },
  },
  plugins: [],
}
