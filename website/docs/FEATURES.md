<p align="center">
  <a href="https://hohatch.draco.moe" target="_blank">
    <img alt="HoHatch" src="https://raw.githubusercontent.com/dracoboost/hohatch/refs/heads/master/images/hohatch-logo.png" height="60">
  </a>
  <span>Website ✨FEATURES</span>

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
> This document outlines the key features of the HoHatch support website, a Next.js application designed to provide users with comprehensive guides, downloads, and community links.

## 🎯 Purpose

The HoHatch support website serves as the central information hub for the HoHatch application. It is built with Next.js and deployed on Vercel, offering a fast, responsive, and user-friendly experience.

## ✨ Core Features

### Main Page (`app/page.tsx`)

The main page delivers all essential content in a responsive, multi-column layout.

- **Dynamic Header (`components/WebsiteHeader.tsx`):**
  - Displays the HoHatch logo and branding.
  - Features a prominent **Download** button that dynamically fetches the latest application version from `package.json`, ensuring users always get the most up-to-date release.
  - Includes social media icons linking to Discord, X (Twitter), and GitHub for community engagement.

- **Content & Navigation:**
  - **Sticky Table of Contents:** A ToC remains visible on the side, automatically highlighting the user's current section as they scroll through the guide.
  - **Markdown-Powered Content:** The main content is rendered from a Markdown file (`content/index.md`), making it easy to update.
  - **Interactive Image Lightbox:** All guide images can be clicked to open in a full-screen lightbox, which includes thumbnail navigation for easily browsing through all images.
  - **Custom Components:** Uses custom `MarkdownImage` and `MarkdownLink` components to ensure consistent styling and behavior across the site.

### 🚀 SEO & Performance

The website is optimized for search engines and performance.

- **Programmatic Sitemap:** A sitemap is automatically generated (`sitemap.xml/route.ts`), including metadata for all guide images (titles, captions) to enhance image search visibility.
- **`robots.txt` Generation:** A `robots.ts` file generates a `robots.txt` to properly guide search engine crawlers.
- **Structured Data (JSON-LD):** Website metadata is centralized and used to generate JSON-LD structured data, helping search engines understand the content and display rich results.
- **Vercel Deployment:** Hosted on Vercel with Analytics and Speed Insights enabled for continuous performance monitoring.

## 🛠️ Technology Stack

- **Framework:** [Next.js](https://nextjs.org) (React)
- **Styling:** [Tailwind CSS](https://tailwindcss.com)
- **Content:** [React Markdown](https://github.com/remarkjs/react-markdown) with Remark GFM plugin.
- **Deployment:** [Vercel](https://vercel.com) (with Analytics and Speed Insights)
