const { heroui } = require("@heroui/theme");
const typography = require("@tailwindcss/typography");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './docs/**/*.mdx',
    './blog/**/*.mdx',
    "./node_modules/@heroui/theme/dist/**/*.{js,jsx,ts,tsx}",
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
      },
      fontSize: {
        h1: ["3.5rem", {lineHeight: "1.2"}],
        h2: ["1.75rem", {lineHeight: "1.2"}],
        h3: ["1.5rem", {lineHeight: "1.2"}],
        h4: ["1.5rem", {lineHeight: "1.2"}],
        h5: ["1.25rem", {lineHeight: "1.2"}],
        h6: ["1rem", {lineHeight: "1.2"}],
        "sm-h1": ["3rem", {lineHeight: "1.2"}],
        "sm-h2": ["1.5rem", {lineHeight: "1.2"}],
        "sm-h3": ["1.25rem", {lineHeight: "1.2"}],
        "md-h1": ["4rem", {lineHeight: "1.2"}],
        "md-h2": ["2rem", {lineHeight: "1.2"}],
        "md-h3": ["1.75rem", {lineHeight: "1.2"}],
        "lg-h1": ["5rem", {lineHeight: "1.2"}],
        "lg-h2": ["2.5rem", {lineHeight: "1.2"}],
        "lg-h3": ["2rem", {lineHeight: "1.2"}],
      },
      typography: ({theme}) => ({
        DEFAULT: {
          css: {
            a: {
              color: theme('colors.link-color'),
              "&:hover": {
                opacity: "0.75",
              },
              "&:active": {
                opacity: "0.50",
              },
            },
            ul: {},
            ol: {},
          },
        },
      }),
    },
  },
  corePlugins: { preflight: false },
  plugins: [heroui(), typography],
};
