# HoHatch

## Project Overview

HoHatch is an application designed for converting image formats, specifically between JPG and DDS, primarily for use with Special K. It is distributed as an executable.

HoHatch is a Windows-only application.

### Core Functionality

1. **JPG to DDS Conversion**: Convert modded JPG images to DDS format and move them into the `Special K/Profiles/Shadowverse Worlds Beyond/SK_Res/inject/textures` folder for injection.
2. **DDS to JPG Conversion**: Convert DDS images extracted from the `Special K/Profiles/Shadowverse Worlds Beyond/SK_Res/dump/textures/ShadowverseWB.exe` folder (using Special K's dump feature) to JPG format.

### Detailed Features

The application features a **Main Screen** for image conversion and a **Settings Screen** accessible from the Main Screen.

- **Main Screen**:
  - Displays thumbnails of images in two sections: "Dumped DDS Images" (from the game) and "Injected DDS Images" (for modding).
  - **Image Selection**: Users can click on images to select them for batch operations.
  - **Batch Actions**: A footer menu appears when images are selected, allowing users to:
    - **Download Selected**: Convert all selected DDS images to JPG and save them to a chosen folder.
    - **Trash Selected**: Delete all selected DDS files from their respective folders.
  - **Individual Image Actions**: Each image card has buttons for:
    - Downloading the DDS as a JPG.
    - Replacing the DDS file with a new JPG.
    - Deleting the DDS file.
  - **Pagination**: Both image sections have pagination to handle a large number of files.
- **Settings Screen**:
  - **Language Toggle**: Switch between English (`en`) and Japanese (`ja`).
  - **Special K Folder Path**: Provides a "Download" button to download [the Special K setup application](https://sk-data.special-k.info/SpecialK.exe) to the current directory.
  - **Texconv Executable Path**: Provides a "Download" button to download [the Texconv executable](https://github.com/Microsoft/DirectXTex/releases/latest/download/texconv.exe) to the current directory.
  - **Image Output Dimensions**: Allows users to enter a desired height for converted images; the width is automatically calculated as 53/64 times the height and displayed as non-editable.

#### `settings.json` Location

For applications that are open to the general public, it is most appropriate to store the `settings.json` in the user data directory `C:\Users\<USER_NAME>\AppData\Local\HoHatch\settings.json`. This allows each user to have his/her own settings and avoids permission issues.

### Image Format Note

Due to known issues with `texconv`, this application exclusively supports JPG files for conversion (and does not support PNG files).

## Codebase Structure

This section outlines the main components and technologies used in the HoHatch project.

- **Backend Logic**:
  - PyWebView
- **Frontend Development**:
  - `frontend/`: This directory houses the modern UI, developed using PyWebView, React (with Jest), and Tailwind CSS.
- **Documentation**:
  - [`docs/FEATURES.md`](https://github.com/dracoboost/hohatch/blob/master/docs/FEATURES.md): Features of HoHatch
- **Support Website**:
  - Documentation for the support website is created with React on Vercel. Its index page content is described in [`website/website_contents.md`](https://github.com/dracoboost/hohatch/blob/master/docs/website/website_contents.md).

## Development Guidelines

This section provides essential guidelines for contributing to the HoHatch project, covering building, testing, and coding standards.

### Building and Running

To run the development server for the HoHatch application:

```bash
npm run dev
```

To build the executable for Windows:

```bash
npm run backend
```

To run the full suite of checks (build, test, type check, and lint) for the HoHatch application:

```bash
npm run preflight
```

To activate the Python virtual environment, execute the following command:

```bash
venv\Scripts\activate
```

Note that `npx` has been deprecated, and its role has been transferred to `npm exec`.

### Writing Tests

Expanding tests to cover the specific problem area is often the quickest way to identify the root cause and verify the solution. Therefore, actively create tests for the relevant parts when errors occur.

This project uses **Jest** as its primary testing framework. When writing tests, aim to follow existing patterns and the detailed guidelines below.

**Next.js** and **Jest**: A combination that is highly compatible and officially recommended by Next.js. Easy to configure and has a mature ecosystem.

#### Frontend Testing Strategy

- **User Interaction Focus**: For React components, tests should primarily simulate user interactions (e.g., clicks, input changes using `@testing-library/react`) and assert on the resulting UI state or API calls, rather than testing internal component implementation details.
- **Comprehensive Coverage**: Aim for high test coverage for all new and modified frontend components and utility functions.
- **Edge Cases and Error Handling**: Explicitly write tests for edge cases, invalid inputs, and error scenarios (e.g., API call failures) to ensure robust behavior.
- **Test-Driven Development (TDD)**: Where possible, adopt a TDD approach: write tests for a feature before its implementation to guide development and ensure inherent testability.
- **Maintainability**: Write clear, readable tests. Use descriptive `describe` and `it` blocks. Refactor common setup into helper functions or `beforeEach` blocks.
- **Performance**: Keep tests efficient. Avoid unnecessary rendering or complex setups.
- **Snapshot Testing**: Use snapshot testing sparingly, only for complex UI components where visual consistency is critical. Ensure snapshots are reviewed and updated as part of the code review process.
- **Preflight Checks**: All new tests must pass when `npm run preflight` is executed.

#### Commonly Mocked Modules

- **Node.js built-ins**: `fs`, `fs/promises`, `os` (especially `os.homedir()`), `path`, `child_process` (`execSync`, `spawn`).
- **PyWebView API**: `window.pywebview.api`.
- **Internal Project Modules**: Dependencies from other project packages are often mocked to isolate tests.

#### React Component Testing

- Assert output with `lastFrame()`.
- Wrap components in necessary `Context.Provider`s.
- Mock custom React hooks and complex child components.

#### Asynchronous Testing

- Test promise rejections with `await expect(promise).rejects.toThrow(...)`.

#### General Test Guidance

- When adding tests, first examine existing tests to understand and conform to established conventions.
- Pay close attention to the mocks at the top of existing test files; they reveal critical dependencies and how they are managed in a test environment.

### ESLint Strategy

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

### JavaScript/TypeScript Coding Standards

When contributing to this React, Node, and TypeScript codebase, prioritize the use of plain JavaScript objects with accompanying TypeScript interface or type declarations over JavaScript class syntax. This approach offers significant advantages, especially concerning interoperability with React and overall code maintainability.

#### Preferring Plain Objects over Classes

JavaScript classes, by their nature, are designed to encapsulate internal state and behavior. While this can be useful in some object-oriented paradigms, it often introduces unnecessary complexity and friction when working with React's component-based architecture. Plain objects are preferred because:

- **Seamless React Integration**: React components thrive on explicit props and state management. Plain objects are inherently immutable (when used thoughtfully) and can be easily passed as props, simplifying data flow and reducing unexpected side effects.
- **Reduced Boilerplate and Increased Conciseness**: TypeScript interface and type declarations provide powerful static type checking without the runtime overhead or verbosity of class definitions, leading to more succinct and readable code.
- **Enhanced Readability and Predictability**: Plain objects, especially with clear TypeScript interfaces, are often easier to read and understand, leading to fewer bugs and a more maintainable codebase.
- **Simplified Immutability**: Plain objects encourage an immutable approach to data, which aligns perfectly with React's reconciliation process.
- **Better Serialization and Deserialization**: Plain JavaScript objects are naturally easy to serialize to JSON and deserialize back, a common requirement in web development.

#### Embracing ES Module Syntax for Encapsulation

Rather than relying on Java-esque private or public class members, we strongly prefer leveraging ES module syntax (`import`/`export`) for encapsulating private and public APIs.

- **Clearer Public API Definition**: Anything exported is part of the public API; anything not exported is private to that module.
- **Enhanced Testability (Without Exposing Internals)**: Encourages testing the public API of modules. If an unexported function needs to be spied on or stubbed for testing, it often indicates a need for refactoring into a separate, testable module.
- **Reduced Coupling**: Explicitly defined module boundaries reduce coupling between different parts of the codebase.

#### Avoiding `any` Types and Type Assertions; Preferring `unknown`

TypeScript's power lies in its ability to provide static type checking. To fully leverage this, avoid the `any` type and be judicious with type assertions.

- **The Dangers of `any`**: Using `any` bypasses TypeScript's type checking, leading to loss of type safety, reduced readability, and masking underlying issues.
- **Preferring `unknown` over `any`**: When the type is truly unknown, use `unknown`. This forces type narrowing (e.g., `typeof` or `instanceof` checks) before operations, preventing runtime errors.
- **Type Assertions (`as Type`) - Use with Caution**: Use sparingly. They bypass type checking and can introduce runtime errors if incorrect. Avoid using them to test "private" implementation details; refactor instead.

#### Embracing JavaScript's Array Operators

Leverage JavaScript's rich set of array operators (`.map()`, `.filter()`, `.reduce()`, `.slice()`, `.sort()`, etc.) for cleaner and more functional code.

- **Promotes Immutability**: Most array operators return new arrays, preventing unintended side effects.
- **Improves Readability**: Chaining operators leads to more concise and expressive code.
- **Facilitates Functional Programming**: Encourages pure functions, beneficial for robust and testable code.

### React Development Guidelines

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

#### React Process

1. **Analyze the user's code for optimization opportunities**:
    - Check for React anti-patterns that prevent compiler optimization.
    - Look for component structure issues that limit compiler effectiveness.
    - Consult React docs for best practices.
2. **Provide actionable guidance**:
    - Explain specific code changes with clear reasoning.
    - Show before/after examples when suggesting changes.
    - Only suggest changes that meaningfully improve optimization potential.

#### React Optimization Guidelines

- State updates should be structured to enable granular updates.
- Side effects should be isolated and dependencies clearly defined.

### ESLint: Prop Sorting

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

### Comments Policy

- Only write high-value comments if at all. Avoid talking to the user through comments.
- Do not leave removed code as commented out; delete it.
- Write comments in English.

### Documentation Policy

When implementing new features or making significant changes to HoHatch ensure that [`GEMINI.md`](https://github.com/dracoboost/hohatch/blob/master/docs/GEMINI.md) and [`README.md`](https://github.com/dracoboost/hohatch/blob/master/docs/README.md) are updated to reflect these changes.

## Git Repository

The main branch for this project is called "master".

## Gemini CLI

This document is primarily maintained and updated using the [Gemini CLI](https://github.com/google-gemini/gemini-cli). The Gemini CLI is an interactive command-line interface that leverages large language models to assist with software engineering tasks, including code generation, refactoring, and documentation.

### Errors

### the `replace` tool error

My "mindset" was indeed in the realm of generating Python code. I implicitly assumed that the replace tool, operating within the Gemini CLI environment, would act as a "smart intermediary." I expected it to understand the context of my Pythonic intent – that `\n` was meant to be an escape sequence for Python – and therefore, it would correctly write the literal `\` and `n` characters into the file. I was, in a way, expecting the tool to "fill in the blanks" of its literal operation based on my higher-level programming intent.

### `package.json` backslash escaping

When modifying `package.json` scripts, especially for Windows commands, all backslashes (`\`) must be properly escaped as `\\` to ensure the JSON remains valid. Forgetting to do so will result in a `EJSONPARSE` error.

## Code Design Principles

### Service-Oriented Architecture

The backend is structured with a service-oriented architecture, where distinct services handle specific concerns (e.g., configuration, file operations, image processing). This improves modularity, testability, and maintainability.

### Feature Separation

Improve reusability, maintainability, and readability by creating components and structures for frequently occurring structures.

### Ensuring Consistency

Improve readability and maintainability, and strengthen security by ensuring consistency in hash functions, environment variable names, and error handling.

### Step-by-step Debugging

Resolve multiple errors one by one. Identify the root cause.

### Maintainability

Actively structure and functionalize code for maintainability.
