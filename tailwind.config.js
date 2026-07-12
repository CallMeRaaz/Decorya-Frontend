/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  theme: {
    extend: {
      colors: {
        'salmon-pink': 'hsl(353, 100%, 78%)',
        'eerie-black': 'hsl(0, 0%, 13%)',
      },
      maxHeight: {
        '450': '450px',
      },
      spacing: {
        '6': '1.5rem',
      },
    },
  },
}