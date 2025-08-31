# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- No unreleased content.

## [1.0.2] - 2025-08-31

### Changed

- Simplified `backend-test` and `lint:fix` scripts in `package.json`.

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

[unreleased]: https://github.com/dracoboost/hohatch/compare/v1.0.2...HEAD
[1.0.2]: https://github.com/dracoboost/hohatch/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/dracoboost/hohatch/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/dracoboost/hohatch/releases/tag/v1.0.0
