<p align="center">
  <a href="https://hohatch.draco.moe" target="_blank">
    <img alt="HoHatch" src="https://raw.githubusercontent.com/dracoboost/hohatch/refs/heads/master/images/hohatch-logo.png" height="60">
  </a>
  <span>General ✦GEMINI</span>

  <p align="center">
    <a href="https://github.com/dracoboost/hohatch/releases">
      <img alt="version" src="https://img.shields.io/badge/version-1.1.0-b7465a">
    </a>
    <a href="https://github.com/dracoboost/hohatch/blob/master/LICENSE">
      <img alt="license" src="https://img.shields.io/badge/license-MIT-lightgrey.svg">
    </a>
  </p>
</p>

> [!TIP]
> This document serves as the primary source of truth and context for the Gemini CLI, outlining project structure, development guidelines, and coding standards.

## ✦ Gemini CLI

The [Gemini CLI](https://github.com/google-gemini/gemini-cli) is an interactive command-line interface that leverages large language models to assist with software engineering tasks, including code generation, refactoring, and documentation.

## 📖 Project Overview

HoHatch is an application designed for converting image formats, specifically between JPG and DDS, primarily for use with Special K. It is distributed as an executable.

HoHatch is a Windows-only application.

### ✨ Core Functionality

1. **JPG to DDS Conversion**: Convert modded JPG images to DDS format and move them into the `Special K/Profiles/Shadowverse Worlds Beyond/SK_Res/inject/textures` folder for injection.
2. **DDS to JPG Conversion**: Convert DDS images extracted from the `Special K/Profiles/Shadowverse Worlds Beyond/SK_Res/dump/textures/ShadowverseWB.exe` folder (using Special K's dump feature) to JPG format.

### ✨ Detailed Features

The application features a **Main Screen** for image conversion and a **Settings Screen** accessible from the Main Screen.

#### Main Screen

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

#### Settings Screen

- **Language Toggle**: Switch between English (`en`) and Japanese (`ja`).
- **Special K Folder Path**: Provides a `Download` button to download [the Special K setup application](https://sk-data.special-k.info/SpecialK.exe) to the current directory.
- **Texconv Executable Path**: Provides a `Download` button to download [the Texconv executable](https://github.com/Microsoft/DirectXTex/releases/latest/download/texconv.exe) to the current directory.
- **Image Output Dimensions**: Allows users to enter a desired height for converted images; the width is automatically calculated as 53/64 times the height and displayed as non-editable.

#### `settings.json` Location

For applications that are open to the general public, it is most appropriate to store the `settings.json` in the user data directory `C:\Users\<USER_NAME>\AppData\Local\HoHatch\settings.json`. This allows each user to have his/her own settings and avoids permission issues.

### 📝 Image Format Note

Due to known issues with `texconv`, this application exclusively supports JPG files for conversion (and does not support PNG files).

## 🛠️ Codebase Structure

This section outlines the main components and technologies used in the HoHatch project.

- **Frontend**
  - `frontend/`: This directory houses the modern UI, developed using PyWebView, React (with Jest), and Tailwind CSS.
- **Backend**
  - `backend/`: PyWebView
- **Documentation**
  - [`frontend/docs/FEATURES.md`](https://github.com/dracoboost/hohatch/blob/master/frontend/docs/FEATURES.md): Features of HoHatch Application
  - [`website/docs/FEATURES.md`](https://github.com/dracoboost/hohatch/blob/master/website/docs/FEATURES.md): Features of HoHatch Website
- **Support Website**
  - The support website is built with React on Vercel.

## Development Guidelines

> [!IMPORTANT]
> **Pre-Commit Preflight Checks**
> Before every `git commit`, you must run the preflight checks in both the `frontend` and `website` directories to ensure stability and catch errors early. This is a mandatory step to prevent CI/CD pipeline failures.
>
> ```sh
> # From the frontend directory
> cd frontend
> npm run preflight
>
> # From the website directory
> cd ../website
> npm run preflight
> ```

This section provides essential guidelines for contributing to the HoHatch project, covering building, testing, and coding standards.

- HoHatch Application: ✦[`frontend/GEMINI.md`](frontend/GEMINI.md)
- HoHatch Website: ✦[`website/GEMINI.md`](website/GEMINI.md)

## 🌱 Git Repository

The main branch for this project is called `master`.

## 🎨 Code Design Principles

### 🏛️ Service-Oriented Architecture

The backend is structured with a service-oriented architecture, where distinct services handle specific concerns (e.g., configuration, file operations, image processing). This improves modularity, testability, and maintainability.

### 🧩 Feature Separation

Improve reusability, maintainability, and readability by creating components and structures for frequently occurring structures.

### 🛡️ Ensuring Consistency

Improve readability and maintainability, and strengthen security by ensuring consistency in hash functions, environment variable names, and error handling.

### 🐛 Step-by-step Debugging

Resolve multiple errors one by one. Identify the root cause.

### 🔧 Maintainability

Actively structure and functionalize code for maintainability.
