/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      boxShadow: {
        'evenly': '0 0 5px 2px rgba(0, 0, 0, 0.3)',
      },
    },
  },
  plugins: [],
}
