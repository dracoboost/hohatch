# Development Guidelines

This document provides detailed instructions for developing HoHatch and its associated website.

## Development of HoHatch

This project is built with Python (PyWebView) for the backend and React (Next.js, Tailwind CSS) for the frontend.

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

- `npm run preflight`
  Runs a comprehensive check that builds and tests both the frontend and backend. This is recommended before committing changes.

## Development of Website

### Setup of Website

1. Clone the repository

  ```ps1
  > git clone https://github.com/dracoboost/hohatch
  > cd hohatch

  # or
  # > cd (ghq get https://github.com/dracoboost/hohatch | ghq list -p -e)
  ```

2. Install website dependencies

  ```ps1
  > cd website
  > npm install
  ```

1. Launch the development server

  ```ps1
  > npm run dev
  ```

2. Build the website for production

  ```ps1
  > npm run build
  ```

3. Run preflight checks

  ```ps1
  > npm run preflight
  ```
