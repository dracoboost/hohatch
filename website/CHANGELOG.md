<p align="center">
  <a href="https://hohatch.draco.moe" target="_blank">
    <img alt="HoHatch" src="https://raw.githubusercontent.com/dracoboost/hohatch/refs/heads/master/images/hohatch-logo.png" height="60">
  </a>
  <span align="center">Website 📝CHANGELOG</span>

  <p align="center">
    <a href="https://github.com/dracoboost/hohatch/releases">
      <img alt="website version" src="https://img.shields.io/badge/website%20version-1.0.5-lightgrey">
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

## [1.0.5] - 2025-09-21

### Added

- **Image Optimization**: Automatically detect and embed `width` and `height` for local images in Markdown content to improve performance and prevent layout shift.
- Added tooltips to social media icons for better usability.
- Added `robots.ts` to generate a `robots.txt` file and improve search engine indexing.
- Implemented programmatic sitemap generation (`sitemap.xml/route.ts`) to include detailed image metadata (titles and captions) for enhanced SEO.
- Centralized website metadata and added JSON-LD structured data in `config/consts.ts` for richer search results.
- Added thumbnail navigation to the `Lightbox` component for improved usability.
- Created a custom `MarkdownLink` component to ensure consistent link styling.

### Changed

- **Project Structure**:
  - Consolidated documentation into a new `GEMINI.md` system, removing the old `docs` folder.
  - Updated and standardized all `README.md` and `CHANGELOG.md` headers.
  - Unified `npm` scripts for versioning (`update-versions`).
- Improved image SEO by dynamically adding all guide images to the sitemap.
- Replaced PNG images in the guide with JPGs for better consistency with the application's focus.

### Fixed

- Fixed a server-side crash during image processing by reading images into a buffer before passing them to the `image-size` library.
- Resolved a TypeScript error in the new `MarkdownLink` component by using the correct `LinkProps` type.
- Updated `MarkdownRenderer` to use the new `MarkdownLink` component, fixing a style override issue.

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

[unreleased]: https://github.com/dracoboost/hohatch/compare/v1.0.5...HEAD
[1.0.5]: https://github.com/dracoboost/hohatch/compare/v1.0.4...v1.0.5
[1.0.4]: https://github.com/dracoboost/hohatch/releases/tag/v1.0.4
[1.0.3]: https://github.com/dracoboost/hohatch/compare/v1.0.2...v1.0.3
[1.0.2]: https://github.com/dracoboost/hohatch/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/dracoboost/hohatch/releases/tag/v1.0.1
