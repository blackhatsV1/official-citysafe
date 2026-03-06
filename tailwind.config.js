/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./views/**/*.ejs",
    "./public/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        glass: {
          light: 'rgba(255, 255, 255, 0.7)',
          dark: 'rgba(17, 24, 39, 0.7)',
          border: 'rgba(255, 255, 255, 0.18)',
          'border-dark': 'rgba(255, 255, 255, 0.05)'
        }
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
