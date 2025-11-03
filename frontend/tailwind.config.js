/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  safelist: ["bg-[#0013FF]", "bg-[#FF9900]", "bg-[#FF000F]", "bg-[#00E752]"],
  theme: {
    extend: {
      colors: {
        primary: "#4D0B5E",
      },
      boxShadow: {
        evenly: "0 0 5px 2px rgba(0, 0, 0, 0.3)",
        info: "0px 1.23px 4.1px 0px rgba(0, 0, 0, 0.25)",
        "testimonial-card": "2.04px 2.04px 10.2px 0px #8BA9C65E;",
      },
      backgroundImage: {
        "footer-gradient":
          "linear-gradient(51.27deg, #0013FF 0%, rgba(77, 11, 94, 0.98) 97.85%)",
      },
    },
    screens: {
      xxsm: "360px",
      xsm: "412px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
  },
  plugins: [],
};
