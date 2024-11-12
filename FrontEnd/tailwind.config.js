/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#24072c",
        secondary: "#31052a",
        tertiary: "#9933b5",
      },
    },
  },
  plugins: [],
};