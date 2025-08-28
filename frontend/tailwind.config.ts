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
