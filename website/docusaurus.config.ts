import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";
// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)
const config: Config = {
  title: "HoHatch",
  tagline: "JPG/DDS image converter for Shadowverse: Worlds Beyond",
  favicon: "img/favicon.ico",
  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },
  // Set the production url of your site here
  url: "https://hohatch.draco.moe",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/",
  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "dracoboost", // Usually your GitHub org/user name.
  projectName: "hohatch", // Usually your repo name.
  onBrokenLinks: "throw",
  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en", "ja"],
    localeConfigs: {
      en: {
        label: "English",
      },
      ja: {
        label: "日本語",
      },
    },
  },
  clientModules: [require.resolve("./src/clientModules/vercel.js")],
  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          // editUrl: "https://github.com/dracoboost/hohatch/tree/master/website/",
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ["rss", "atom"],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          // editUrl: "https://github.com/dracoboost/hohatch/tree/master/website/",
          // Useful options to enforce blogging best practices
          onInlineTags: "warn",
          onInlineAuthors: "warn",
          onUntruncatedBlogPosts: "warn",
        },
        sitemap: {
          changefreq: "weekly",
          priority: 0.5,
          ignorePatterns: ["/tags/**", "/search/**"],
          filename: "sitemap.xml",
        },
        theme: {
          customCss: ["./src/css/custom.css"],
        },
        gtag: {
          trackingID: "G-ZMBEYWE7BW",
          anonymizeIP: true,
        },
      } satisfies Preset.Options,
    ],
  ],
  plugins: [
    async function myPlugin(context, options) {
      return {
        name: "docusaurus-tailwindcss",
      };
    },
  ],
  themes: ["@easyops-cn/docusaurus-search-local"],
  themeConfig: {
    image: "img/og/hohatch-og-1200x630.png",
    colorMode: {
      defaultMode: "dark",
      disableSwitch: false,
      respectPrefersColorScheme: false,
    },
    navbar: {
      logo: {
        alt: "HoHatch Logo",
        src: "img/logos/hohatch-logo.png",
      },
      items: [
        // Left side
        {
          to: "/docs/intro",
          label: "Guides",
          position: "left",
        },
        {
          to: "/blog", // Releases as blog format
          label: "Releases",
          position: "left",
        },
        // Right side - Searchbox
        {
          type: "search",
          position: "right",
        },
        // Right side - Locale
        {
          type: "localeDropdown",
          position: "right",
        },
        // Right side - Icons
        {
          type: "html",
          position: "right",
          value: `
            <a href="https://github.com/dracoboost/hohatch" target="_blank" rel="noopener noreferrer" class="social-icon-link" style="margin-right: 8px;">
              <img src="/img/icons/github-white.svg" alt="GitHub" class="social-icon social-icon-dark" />
              <img src="/img/icons/github-black.svg" alt="GitHub" class="social-icon social-icon-light" />
            </a>
          `,
        },
        {
          type: "html",
          position: "right",
          value: `
            <a href="https://www.reddit.com/r/ShadowverseMods/" target="_blank" rel="noopener noreferrer" class="social-icon-link" style="margin-right: 8px;">
              <img src="/img/icons/reddit-white.svg" alt="Reddit" class="social-icon social-icon-dark" />
              <img src="/img/icons/reddit-black.svg" alt="Reddit" class="social-icon social-icon-light" />
            </a>
          `,
        },
        {
          type: "html",
          position: "right",
          value: `
            <a href="https://discord.gg/fEUMrTGb23" target="_blank" rel="noopener noreferrer" class="social-icon-link" style="margin-right: 8px;">
              <img src="/img/icons/discord-white.svg" alt="Discord" class="social-icon social-icon-dark" />
              <img src="/img/icons/discord-black.svg" alt="Discord" class="social-icon social-icon-light" />
            </a>
          `,
        },
      ],
    },
    footer: {
      style: "dark",
      links: [],
      copyright: `
        <div style="text-align: center;">
          <div>© 2025 dracoboost. CC-BY / MIT</div>
          <div style="margin-top: 8px; display: flex; justify-content: center; gap: 16px;">
            <a href="https://www.draco.moe" target="_blank" rel="noopener noreferrer">
              <img src="/img/icons/home-white.svg" alt="Homepage" style="height:24px;width:24px;" />
            </a>
            <a href="https://x.com/dracoboost" target="_blank" rel="noopener noreferrer">
              <img src="/img/icons/x-white.svg" alt="X" style="height:24px;width:24px;" />
            </a>
            <a href="https://github.com/dracoboost" target="_blank" rel="noopener noreferrer">
              <img src="/img/icons/github-white.svg" alt="GitHub" style="height:24px;width:24px;" />
            </a>
          </div>
        </div>
      `,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};
export default config;
