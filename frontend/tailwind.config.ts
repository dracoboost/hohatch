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
        background: "#0d1117",
        foreground: "#f0f6fc",
        "hochan-red": "#B7465A",
        "hochan-white": "#d9cad1",
        "link-color": "#B7465A",
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
        balootamma2: ["balootamma2", "cursive"],
      },
    },
  },
  plugins: [
    heroui({
      themes: {
        light: {
          colors: {
            secondary: {
              DEFAULT: "#b7465a",
            },
          },
        },
        dark: {
          colors: {
            secondary: {
              DEFAULT: "#b7465a",
            },
          },
        },
      },
    }),
  ],
};

module.exports = config;
