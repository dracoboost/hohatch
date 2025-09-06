# 📄 HoHatch Application Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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

## [1.0.0] - 2025-08-29

### Added

- Initial commit.

[unreleased]: https://github.com/dracoboost/hohatch/compare/v1.0.4...HEAD
[1.0.4]: https://github.com/dracoboost/hohatch/releases/tag/v1.0.4
[1.0.3]: https://github.com/dracoboost/hohatch/compare/v1.0.2...v1.0.3
[1.0.2]: https://github.com/dracoboost/hohatch/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/dracoboost/hohatch/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/dracoboost/hohatch/releases/tag/v1.0.0
