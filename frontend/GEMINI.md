<p align="center">
  <a href="https://hohatch.draco.moe" target="_blank">
    <img alt="HoHatch" src="https://raw.githubusercontent.com/dracoboost/hohatch/refs/heads/master/images/hohatch-logo.png" height="60">
  </a>
  <span>Application ✦GEMINI</span>

  <p align="center">
    <a href="https://github.com/dracoboost/hohatch/releases">
      <img alt="version" src="https://img.shields.io/badge/version-1.2.2-b7465a">
    </a>
    <a href="https://github.com/dracoboost/hohatch/blob/master/LICENSE">
      <img alt="license" src="https://img.shields.io/badge/license-MIT-lightgrey.svg">
    </a>
  </p>
</p>

> [!TIP]
> This document serves as the primary source of truth and context for the Gemini AI assistant regarding the HoHatch application.

## 🚀 Development Guidelines

This document provides detailed instructions for developing HoHatch.

### Technology Stack Overview

This application provides a user-friendly interface to manage and convert images for game modding purposes. The frontend is built with [Next.js](https://nextjs.org), [React](https://react.dev), and [Tailwind CSS](https://tailwindcss.com), while the backend logic is handled by a Python server using [PyWebView](https://pywebview.flowrl.com).

### Prerequisites

- Node.js & npm (Recommend [nvm](https://github.com/nvm-sh/nvm))
- [Python 3.x](https://www.python.org/downloads/)
- [Git](https://git-scm.com/downloads)

### Setup of HoHatch

1. Clone the repository

  ```ps1
  > git clone https://github.com/dracoboost/hohatch
  > cd hohatch

  # or
  # > cd (ghq get https://github.com/dracoboost/hohatch | ghq list -p -e)
  ```

2. Install frontend dependencies

  ```ps1
  > cd frontend
  > npm install
  ```

3. Install Python (backend) dependencies (preferably in a virtual environment)

  ```ps1
  > npm run init
  ```

### Available Commands

Commands run within the `frontend` directory:

- `npm init`
  Install the frontend and backend requirements.

- `npm run dev`
  Starts the frontend development server and the Python backend for local development.

- `npm run backend`
  Creates a standalone executable for production. This command bundles the frontend and backend into a single file located in the project's root `dist/` directory.

- `npm run freeze`
  Generates or updates `backend/requirements.txt` with the currently installed Python dependencies. This is useful for managing exact versions of dependencies.

- `npm run preflight`
  Runs a comprehensive check that builds and tests both the frontend and backend. This is recommended before committing changes.

### 🧹 ESLint Strategy

This project uses ESLint for maintaining code quality and consistency. The ESLint configuration is defined in `eslint.config.mjs` and is part of the `npm run preflight` check.

**Key Principles:**

- **Automated Formatting**: Prettier is integrated with ESLint to handle code formatting automatically. Many formatting issues can be fixed by running `npx prettier --write .` from the `frontend` directory.
- **Import Order**: Imports are strictly ordered to improve readability and maintain consistency across the codebase. The `import/order` rule is configured to group imports by type (e.g., `builtin`, `external`, `internal`, `parent`, `sibling`, `index`) with blank lines between groups.
- **Unused Imports/Variables**: Unused imports and variables are flagged as warnings to keep the codebase clean and prevent dead code.
- **React Best Practices**: ESLint is configured with `eslint-plugin-react` and `eslint-plugin-react-hooks` to enforce React best practices, including rules for hooks and JSX.
- **TypeScript Specific Rules**: `@typescript-eslint/eslint-plugin` is used to apply TypeScript-specific linting rules, ensuring type safety and catching common TypeScript-related issues.
- **Accessibility (A11Y)**: `eslint-plugin-jsx-a11y` is used to enforce accessibility standards in JSX, promoting inclusive UI development.
- **Padding Lines**: Rules are in place to ensure consistent blank lines between certain statements (e.g., `return` statements, variable declarations) for improved readability.
- **JSX Prop Sorting**: JSX props are sorted alphabetically, with callbacks and shorthand props handled specifically, to maintain consistent component declarations.

**Troubleshooting ESLint Warnings/Errors:**

- **`prettier/prettier` warnings**: These indicate formatting issues that can often be automatically fixed by running `npx prettier --write .`.
- **`import/order` warnings**: These suggest that import statements are not ordered according to the project's guidelines. Manually reorder them or use an IDE extension that supports `eslint-plugin-import`'s ordering rules.
- **`unused-imports/no-unused-imports` or `@typescript-eslint/no-unused-vars` warnings**: Remove the unused import or variable.
- **`react/jsx-sort-props` warnings**: Reorder the JSX props according to the specified sorting rules (shorthand first, then alphabetical, then callbacks last).

### 📜 JavaScript/TypeScript Coding Standards

When contributing to this React, Node, and TypeScript codebase, prioritize the use of plain JavaScript objects with accompanying TypeScript interface or type declarations over JavaScript class syntax. This approach offers significant advantages, especially concerning interoperability with React and overall code maintainability.

#### 🧱 Preferring Plain Objects over Classes

JavaScript classes, by their nature, are designed to encapsulate internal state and behavior. While this can be useful in some object-oriented paradigms, it often introduces unnecessary complexity and friction when working with React's component-based architecture. Plain objects are preferred because:

- **Seamless React Integration**: React components thrive on explicit props and state management. Plain objects are inherently immutable (when used thoughtfully) and can be easily passed as props, simplifying data flow and reducing unexpected side effects.
- **Reduced Boilerplate and Increased Conciseness**: TypeScript interface and type declarations provide powerful static type checking without the runtime overhead or verbosity of class definitions, leading to more succinct and readable code.
- **Enhanced Readability and Predictability**: Plain objects, especially with clear TypeScript interfaces, are often easier to read and understand, leading to fewer bugs and a more maintainable codebase.
- **Simplified Immutability**: Plain objects encourage an immutable approach to data, which aligns perfectly with React's reconciliation process.
- **Better Serialization and Deserialization**: Plain JavaScript objects are naturally easy to serialize to JSON and deserialize back, a common requirement in web development.

#### 📦 Embracing ES Module Syntax for Encapsulation

Rather than relying on Java-esque private or public class members, we strongly prefer leveraging ES module syntax (`import`/`export`) for encapsulating private and public APIs.

- **Clearer Public API Definition**: Anything exported is part of the public API; anything not exported is private to that module.
- **Enhanced Testability (Without Exposing Internals)**: Encourages testing the public API of modules. If an unexported function needs to be spied on or stubbed for testing, it often indicates a need for refactoring into a separate, testable module.
- **Reduced Coupling**: Explicitly defined module boundaries reduce coupling between different parts of the codebase.

#### 🚫 Avoiding `any` Types and Type Assertions; Preferring `unknown`

TypeScript's power lies in its ability to provide static type checking. To fully leverage this, avoid the `any` type and be judicious with type assertions.

- **The Dangers of `any`**: Using `any` bypasses TypeScript's type checking, leading to loss of type safety, reduced readability, and masking underlying issues.
- **Preferring `unknown` over `any`**: When the type is truly unknown, use `unknown`. This forces type narrowing (e.g., `typeof` or `instanceof` checks) before operations, preventing runtime errors.
- **Type Assertions (`as Type`) - Use with Caution**: Use sparingly. They bypass type checking and can introduce runtime errors if incorrect. Avoid using them to test "private" implementation details; refactor instead.

#### 🧰 Embracing JavaScript's Array Operators

Leverage JavaScript's rich set of array operators (`.map()`, `.filter()`, `.reduce()`, `.slice()`, `.sort()`, etc.) for cleaner and more functional code.

- **Promotes Immutability**: Most array operators return new arrays, preventing unintended side effects.
- **Improves Readability**: Chaining operators leads to more concise and expressive code.
- **Facilitates Functional Programming**: Encourages pure functions, beneficial for robust and testable code.

### ⚛️ React Development Guidelines

As a React assistant, these guidelines aim to help users write efficient and optimizable React code, enabling the React Compiler to apply optimizations effectively.

- **Use Functional Components with Hooks**: Avoid class components. Manage state with `useState` or `useReducer`, and side effects with `useEffect`.
- **Keep Components Pure and Side-Effect-Free During Rendering**: Side effects (subscriptions, network requests) should be wrapped in `useEffect` or performed in event handlers.
- **Respect One-Way Data Flow**: Pass data down through props. Lift state up or use React Context for shared data.
- **Never Mutate State Directly**: Always update state immutably (e.g., using spread syntax).
- **Accurately Use `useEffect` and Other Effect Hooks**: Use `useEffect` primarily for synchronization. Avoid `setState` within `useEffect`. Include all necessary dependencies. Place logic for user actions in event handlers, not `useEffect`. Effects should return a cleanup function.
- **Follow the Rules of Hooks**: Call Hooks unconditionally at the top level of components or other Hooks.
- **Use `refs` Only When Necessary**: Avoid `useRef` unless truly required (e.g., focusing controls, animations). Never write to or read from `ref.current` during rendering (except for initial setup).
- **Prefer Composition and Small Components**: Break UI into small, reusable components. Abstract repetitive logic into custom Hooks.
- **Optimize for Concurrency**: Write code that remains correct even if the component function runs multiple times. Include cleanup functions in effects.
- **Optimize to Reduce Network Waterfalls**: Use parallel data fetching. Leverage Suspense for data loading.
- **Rely on React Compiler**: Avoid premature optimization with manual memoization (`useMemo`, `useCallback`, `React.memo`) if React Compiler is enabled.

#### 🔄 React Process

1. **Analyze the user's code for optimization opportunities**:
    - Check for React anti-patterns that prevent compiler optimization.
    - Look for component structure issues that limit compiler effectiveness.
    - Consult React docs for best practices.
2. **Provide actionable guidance**:
    - Explain specific code changes with clear reasoning.
    - Show before/after examples when suggesting changes.
    - Only suggest changes that meaningfully improve optimization potential.

#### 📈 React Optimization Guidelines

- State updates should be structured to enable granular updates.
- Side effects should be isolated and dependencies clearly defined.

### 🎨 ESLint: Prop Sorting

Bad sorting with warning: Callbacks (such as `onChange`, `onClick`, `onPress`) must be listed after all other props eslint(react/jsx-sort-props)

```js
<Button
  color="primary"
  isDisabled={isProcessing || images.length === 0}
  onPress={onSelectAll}
  size="sm"
>
```

Better

```js
<Button
  color="primary"
  isDisabled={isProcessing || images.length === 0}
  size="sm"
  onPress={onSelectAll}
>
```

### 💬 Comments Policy

- Only write high-value comments if at all. Avoid talking to the user through comments.
- Do not leave removed code as commented out; delete it.
- Write comments in English.
