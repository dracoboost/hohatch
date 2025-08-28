/** @type {import("prettier").Config} */
const config = {
  arrowParens: "always",
  bracketSpacing: false,
  endOfLine: "lf",
  importOrder: ["<THIRD_PARTY_MODULES>", "^@/(.*)", "^[./]"],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  plugins: ["@trivago/prettier-plugin-sort-imports", "prettier-plugin-tailwindcss"],
  printWidth: 100,
  semi: true,
  singleQuote: false,
  tabWidth: 2,
  trailingComma: "all",
  useTabs: false,
};

module.exports = config;
