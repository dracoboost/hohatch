<p align="center">
  <a href="https://hohatch.draco.moe" target="_blank">
    <img alt="HoHatch" src="https://raw.githubusercontent.com/dracoboost/hohatch/refs/heads/master/images/hohatch-logo.png" height="60">
  </a>
  <span>Application ✨FEATURES</span>

  <p align="center">
    <a href="https://github.com/dracoboost/hohatch/releases">
      <img alt="version" src="https://img.shields.io/badge/version-1.2.0-b7465a">
    </a>
    <a href="https://github.com/dracoboost/hohatch/actions/workflows/preflight.yml">
      <img alt="Preflight" src="https://github.com/dracoboost/hohatch/actions/workflows/preflight.yml/badge.svg">
    </a>
    <a href="https://github.com/dracoboost/hohatch/actions/workflows/release.yml">
      <img alt="Release Application" src="https://github.com/dracoboost/hohatch/actions/workflows/release.yml/badge.svg">
    </a>
    <a href="https://github.com/dracoboost/hohatch/blob/master/LICENSE">
      <img alt="license" src="https://img.shields.io/badge/license-MIT-lightgrey.svg">
    </a>
  </p>
</p>

> [!TIP]
> This document outlines the features of the HoHatch frontend, a React application built with Next.js and served via PyWebView. It provides a modern, interactive UI for managing DDS image conversions.

## Main Screen (`app/page.tsx`)

The main screen is the central hub for viewing and managing DDS images. It's divided into two primary sections: "Dumped DDS Images" (from the game) and "Injected DDS Images" (for modding).

### Core Features:

- **Dual Image Sections:** Displays images from the dump and inject folders in separate, side-by-side panels. Each panel shows a title with the current count of images.
- **Image Grid Display:**
  - Images are presented in a responsive grid layout using a dedicated `ImageCard` component.
  - While images are loading, a skeleton placeholder UI is shown to indicate progress.
  - If no images are found in a directory, a "No images found" message is displayed.
- **Pagination:** Each image section has its own pagination controls to navigate through large collections of images efficiently.
- **Image Selection:**
  - Users can select multiple images for batch operations by clicking on them.
  - A "Select All" button is available for each section to select all images within that panel. The button icon changes to reflect the selection state (none, partial, all).
- **Batch Actions Footer:** When one or more images are selected, a footer menu appears with the following actions:
  - **Download Selected:** Converts all selected DDS images to JPG and saves them to a user-specified folder.
  - **Trash Selected:** Deletes all selected DDS files from their respective folders.
- **Individual Image Actions:** Each `ImageCard` has buttons for:
  - **Convert to JPG:** Converts the single DDS image to a JPG file.
  - **Replace:** Opens a file dialog to select a new JPG image, which then replaces the existing DDS file.
  - **Trash:** Deletes the single DDS file.
- **Dynamic API Integration:**
  - Fully integrates with the Python backend via the `window.pywebview.api`.
  - Fetches image lists, settings, and language data dynamically.
  - Executes all file operations (conversion, replacement, deletion) by calling backend functions.
- **User Feedback:** Uses the `sonner` library to provide clear and immediate toast notifications for all operations (e.g., "Processing...", "Conversion complete!", "Delete failed").
- **Reload Functionality:** A reload button in the header allows users to reload the image lists for both sections.

## Settings Screen (`app/settings/page.tsx`)

The settings screen allows users to configure the application's behavior.

### Configurable Options:

- **Language Toggle:** Switch the application's display language between English (`en`) and Japanese (`ja`).
- **Special K Folder Path:**
  - Displays the currently configured path to the Special K installation folder.
  - A "Select Folder" button opens a native dialog to choose the correct directory.
  - The application validates the selected path to ensure it's a valid Special K folder.
  - A "Download" button is provided to download the Special K setup application directly.
- **Image Output Dimensions:**
  - Users can specify a desired height for converted JPG images.
  - The corresponding width is automatically calculated (as 53/64 of the height) and displayed as a read-only value.
- **Automatic Saving:** Settings are saved automatically a short moment after a change is made, with a toast notification confirming the save.

## Technology Stack

- **Framework:** React (with Next.js)
- **UI Components:** HeroUI (`@heroui/react`) and Lucide React (`lucide-react`) for icons.
- **Styling:** Tailwind CSS
- **Backend Communication:** `pywebview` API bridge, interacting with a Python backend structured with a service-oriented architecture.
- **Notifications:** `sonner`
- **State Management:** React Hooks (`useState`, `useEffect`, `useCallback`, `useTransition`)
