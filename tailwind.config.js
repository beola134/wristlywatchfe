/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        "phone-sm": { max: "480px" },
        "phone-lg": { min: "481px", max: "767px" },
        tablet: { min: "768px", max: "1024px" },
        laptop: { min: "1025px", max: "1170px" },
      },
      width: {
        calc: "calc(100% / 3 - 30px)",
      },
    },
  },
  plugins: [],
};
