import {heroui} from "@heroui/theme";

import typography from "@tailwindcss/typography";

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,jsx,ts,tsx}",
    "./styles/**/*.css",
  ],
  safelist: [
    'text-foreground',
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        'hochan-red': '#B7465A',
        'hochan-navy-blue': '#1d253c',
        'hochan-white': '#d9cad1',
        background: '#1d253c',
        foreground: '#d9cad1',
        'link-color': '#B7465A',
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
        balootamma2: ['balootamma2', 'cursive'],
      },
      fontSize: {
        'h1': ['3.5rem', { lineHeight: '1.2' }],
        'h2': ['1.75rem', { lineHeight: '1.2' }],
        'h3': ['1.5rem', { lineHeight: '1.2' }],
        'h4': ['1.5rem', { lineHeight: '1.2' }],
        'h5': ['1.25rem', { lineHeight: '1.2' }],
        'h6': ['1rem', { lineHeight: '1.2' }],
        'sm-h1': ['3rem', { lineHeight: '1.2' }],
        'sm-h2': ['1.5rem', { lineHeight: '1.2' }],
        'sm-h3': ['1.25rem', { lineHeight: '1.2' }],
        'md-h1': ['4rem', { lineHeight: '1.2' }],
        'md-h2': ['2rem', { lineHeight: '1.2' }],
        'md-h3': ['1.75rem', { lineHeight: '1.2' }],
        'lg-h1': ['5rem', { lineHeight: '1.2' }],
        'lg-h2': ['2.5rem', { lineHeight: '1.2' }],
        'lg-h3': ['2rem', { lineHeight: '1.2' }],
      },
      typography: {
        DEFAULT: {
          css: {
            ul: {},
            ol: {},
          },
        },
      },
    },
  },
  plugins: [heroui(), typography],
};

export default config;
