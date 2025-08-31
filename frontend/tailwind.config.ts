import {heroui} from "@heroui/theme";

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,jsx,ts,tsx}",
    "./styles/**/*.css",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "hochan-red": "#B7465A",
        "hochan-navy-blue": "#1d253c",
        "hochan-white": "#d9cad1",
        background: "#1d253c",
        foreground: "#d9cad1",
        "link-color": "#B7465A",
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
        balootamma2: ["balootamma2", "cursive"],
      },
    },
  },
  plugins: [heroui()],
};

module.exports = config;
