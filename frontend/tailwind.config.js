/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#4D0B5E",
        boxShadow: {
          evenly: "0 0 5px 2px rgba(0, 0, 0, 0.3)",
        },
      },
    },
    plugins: [],
  },
};
