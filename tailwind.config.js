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
          DEFAULT: '#1DB954',
          dark: '#1ed760',
          light: '#1fdf64',
        },
        background: {
          DEFAULT: '#121212',
          light: '#1a1a1a',
          lighter: '#2a2a2a',
        },
      },
      boxShadow: {
        'glow': '0 0 20px rgba(29, 185, 84, 0.5)',
        'glow-lg': '0 0 30px rgba(29, 185, 84, 0.7)',
      },
    },
  },
  plugins: [],
}

