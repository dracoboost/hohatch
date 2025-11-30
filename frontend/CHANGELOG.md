<p align="center">
  <a href="https://hohatch.draco.moe" target="_blank">
    <img alt="HoHatch" src="https://raw.githubusercontent.com/dracoboost/hohatch/refs/heads/master/images/hohatch-logo.png" height="60">
  </a>
  <span>Application 📝CHANGELOG</span>

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
> All notable changes to this project will be documented in this file.
> The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.2.0] - 2025-11-30

### Added

- Added a "Clear Cache" button on the Settings screen.

### Changed

- **Backend**: Refactored the backend architecture by introducing a dedicated `ImageDiscoveryService` for better modularity. The main API class was renamed to `BackendApi`.
- **Frontend**: Refactored state management on the main screen for improved robustness and simplicity.
- JPG to DDS conversions for injected images are now always resized to 1024x1024.

### Fixed

- Images now display a skeleton loader while their thumbnails are being generated.
- Ensured frontend initialization waits for the backend to be ready before fetching data.

## [1.1.0] - 2025-09-21

### Added

- Implemented comprehensive logging for the backend, saving logs to `hohatch.log` in the user data directory.
- Added an "Open Log Folder" button in the settings to easily access log files.
- Added an Aspect Ratio selector in settings, allowing users to lock the aspect ratio for image conversions or set custom dimensions.

### Changed

- **Refactored UI Components**:
  - The `Button` component was completely overhauled with new variants, colors, and sizes for project-wide consistency.
  - Replaced generic "Processing..." notifications with more specific messages for each operation (e.g., "Replacing image...", "Converting to JPG...").
- **Improved Caching**: The logic for caching display images is now more efficient, checking file modification times to avoid unnecessary reconversions.
- **Project Structure**:
  - Consolidated documentation into a new `GEMINI.md` system, removing the old `docs` folder.
  - Updated and standardized all `README.md` and `CHANGELOG.md` headers.
  - Unified `npm` scripts for versioning and dependency management (`update-versions`, corrected `freeze` path).
- Updated the release workflow to use `ncipollo/release-action@v1`, resolving `set-output` deprecation warnings.

### Fixed

- Enhanced backend stability with more robust error handling and logging in `texconv` service and file operations.
- Resolved a critical `ImportError` for relative imports that occurred in the packaged executable by converting all backend imports to absolute paths.
- Removed an unused variable assignment in `backend/services.py`.

## [1.0.4] - 2025-09-06

### Added

- Added logic to `check_for_updates` method in `backend/api.py` to determine major/minor/patch update types.
- Added `sk_folder_path_label` and `image_size_label` i18n keys.
- Added `aria-label` to "Image Height" and "Image Width" `UnderlineInput` components for better accessibility and testability.

### Changed

- Renamed `UnderlineInput` component to `FloatingUnderlineInput` and updated related files and tests.
- Modified `scripts/version_management/manager.py` to ensure `backend/version.py` is correctly updated.
- Fixed regex pattern for version badge in `README.md` to ensure accurate matching.
- Customized Hero UI theme to map `secondary` color to `hochan-red` (`#b7465a`).
- Removed unused i18n keys from `config/consts.ts`, `components/AppRouter.tsx`, and `lib/test-utils.tsx`.
- Restructured "Cache" label and button in Settings screen to fix hit area.
- Moved "Special K Folder Path" text to a separate label in Settings screen.
- Created a new label for "Image Size" in Settings screen.
- Made `label` prop of `UnderlineInput` optional.
- Replaced `UnderlineInput` with `Input` for "Special K Folder Path".

### Fixed

- Improved test stability in `frontend/app/page.test.tsx` (fixed `act` warnings, missing mocks, and assertion mismatches).
- Fixed label lookup errors in `frontend/app/settings/page.test.tsx`.
- Added `jest` and `@testing-library/jest-dom` type definitions to `website/tsconfig.json` and installed related `@types` packages.

## [1.0.3] - 2025-09-05

### Added

- Added tooltips to "Visit Website" and "View Latest Release" links in the Header.

### Changed

- Corrected PyInstaller icon path in `backend/specs/build-windows-release.spec`.

## [1.0.2] - 2025-09-04

### Added

- Updated various frontend dependencies including Next.js, React, Jest, ESLint, and Tailwind CSS.

### Changed

- Simplified `backend-test` and `lint:fix` scripts in `package.json`.
- Updated `backend-test` script to use `set "PYTHONPATH=%CD%\backend\;%PYTHONPATH%"` for correct module resolution.
- Updated `dev:windows` script to use `cross-env HOHATCH_DEBUG=true` for debug mode.
- Updated `freeze:windows` script to use `venv\Scripts\pip freeze > requirements.txt` for freezing dependencies.
- Updated `lint:fix:windows` script to use `npm exec prettier -- --write "**/*.{ts,tsx}" > NUL` to suppress output.

### Fixed

- Corrected image alignment and badge display in `README.md`.

## [1.0.1] - 2025-08-31

### Added

- Explicitly stated that HoHatch is a Windows-only application in `GEMINI.md` and `README.md`.
- Added `settings.json` location example for Windows to `GEMINI.md`.
- Implemented automatic retrieval of repository URL in `scripts/run_tasks.py`.

### Changed

- Updated `npm run` commands documentation across `docs/DEVELOPMENT.md`, `frontend/README.md`, and `GEMINI.md` to reflect `preflight`, `dev`, and `build` scripts.
- Modified `dev` script in `frontend/package.json` to also run `update-readme-version`.
- Changed all download links from direct `.exe` to the latest GitHub releases page in `README.md` and `frontend/README.md`.

### Fixed

- Resolved `AttributeError: 'HoHatchBackend' object has no attribute 'last_image_dir'` by initializing `last_image_dir` in `backend/src/backend_api.py`.
- Resolved `TypeError: argument should be a str or an os.PathLike object where __fspath__ returns a str, not 'list'` by correcting `open_file_dialog` logic in `backend/src/api.py` to properly handle file dialog results.

## 1.0.0 - 2025-08-29

### Added

- Initial commit.

[unreleased]: https://github.com/dracoboost/hohatch/compare/v1.2.0...HEAD
[1.2.0]: https://github.com/dracoboost/hohatch/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/dracoboost/hohatch/compare/v1.0.4...v1.1.0
[1.0.4]: https://github.com/dracoboost/hohatch/releases/tag/v1.0.4
[1.0.3]: https://github.com/dracoboost/hohatch/compare/v1.0.2...v1.0.3
[1.0.2]: https://github.com/dracoboost/hohatch/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/dracoboost/hohatch/releases/tag/v1.0.1
