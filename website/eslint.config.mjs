import {fixupConfigRules, fixupPluginRules} from "@eslint/compat";
import {FlatCompat} from "@eslint/eslintrc";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import _import from "eslint-plugin-import";
import jsxA11Y from "eslint-plugin-jsx-a11y";
import prettier from "eslint-plugin-prettier";
import react from "eslint-plugin-react";
import unusedImports from "eslint-plugin-unused-imports";
import {defineConfig, globalIgnores} from "eslint/config";
import globals from "globals";
import path from "node:path";
import {fileURLToPath} from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: {},
});

export default defineConfig([
  globalIgnores([
    "public/*",
    "**/.next",
    "**/build",
    "**/dist",
    "**/node_modules",
    "**/*.css",
    "**/*.config.mjs",
    "**/next-env.d.ts",
    "!**/jest.config.cjs",
    "jest.setup.js",
  ]),
  {
    extends: fixupConfigRules(
      compat.extends(
        "next/core-web-vitals",
        "plugin:react/recommended",
        "prettier",
        "plugin:react-hooks/recommended",
        "plugin:jsx-a11y/recommended",
        "plugin:import/recommended",
      ),
    ),
    plugins: {
      react: fixupPluginRules(react),
      "unused-imports": unusedImports,
      import: fixupPluginRules(_import),
      "@typescript-eslint": typescriptEslint,
      "jsx-a11y": fixupPluginRules(jsxA11Y),
      prettier: fixupPluginRules(prettier),
    },
    languageOptions: {
      globals: {
        ...Object.fromEntries(Object.entries(globals.browser).map(([key]) => [key, "off"])),
        ...globals.node,
      },
      parser: tsParser,
      ecmaVersion: 12,
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      "import/resolver": {
        alias: {
          map: [["@", "."]],
          extensions: [".js", ".jsx", ".ts", ".tsx"],
        },
      },
      react: {
        version: "detect",
      },
    },
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      "no-console": "off",
      "react/prop-types": "off",
      "react/jsx-uses-react": "off",
      "react/react-in-jsx-scope": "off",
      "react-hooks/exhaustive-deps": "off",
      "jsx-a11y/click-events-have-key-events": "warn",
      "jsx-a11y/interactive-supports-focus": "warn",
      "prettier/prettier": ["warn", {endOfLine: "lf"}],
      "no-unused-vars": "off",
      "unused-imports/no-unused-vars": "off",
      "unused-imports/no-unused-imports": "warn",
      
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          args: "after-used",
          ignoreRestSiblings: false,
          argsIgnorePattern: "^_.*?$",
        },
      ],
      "react/self-closing-comp": "warn",
      "react/jsx-sort-props": [
        "warn",
        {
          callbacksLast: true,
          shorthandFirst: true,
          noSortAlphabetically: false,
          reservedFirst: true,
        },
      ],
      "padding-line-between-statements": "off",
    },
  },
]);
