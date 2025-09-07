# 📄 HoHatch Website Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.4] - 2025-09-06

### Changed

- Removed hardcoded version from `website/app/page.tsx` and made it dynamically fetched from `package.json`.
- Dynamically updated download link and button text in `website/components/WebsiteHeader.tsx`.
- Updated download link in `WebsiteHeader.tsx` via `update_project_versions.py`.

## [1.0.3] - 2025-09-05

### Added

- Implemented Lightbox feature for images in markdown content.
- Created `Lightbox` component with Context API.
- Created `MarkdownImage` component for rendering images in markdown.
- Created `MarkdownRenderer` component for rendering markdown content.

### Changed

- Integrated `Lightbox` and `MarkdownRenderer` into `app/page.tsx`.
- Refactored `app/page.tsx` to use `WebsiteHeader` component.

## [1.0.2] - 2025-09-04

### Added

- Added `sitemap.ts` to generate a sitemap for the website, improving SEO.

## [1.0.1] - 2025-08-31

### Added

- Implemented a responsive, multi-column layout for the website.
- Added a sticky Table of Contents that highlights the current section based on scroll position.
- Included social media sharing links for Discord, X (Twitter), and GitHub.
- Added JSON-LD structured data for improved SEO.

### Changed

- Updated `npm run` commands documentation in `website/GEMINI.md` and `website/README.md` to reflect `preflight`, `dev`, and `build` scripts.
- Updated all download links to point to the `v1.0.1` release zip file on the GitHub releases page.
- Refined the overall styling and user interface for better readability and user experience.

## 1.0.0 - 2025-08-29

### Added

- Initial commit.

[unreleased]: https://github.com/dracoboost/hohatch/compare/v1.0.4...HEAD
[1.0.4]: https://github.com/dracoboost/hohatch/releases/tag/v1.0.4
[1.0.3]: https://github.com/dracoboost/hohatch/compare/v1.0.2...v1.0.3
[1.0.2]: https://github.com/dracoboost/hohatch/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/dracoboost/hohatch/releases/tag/v1.0.1
