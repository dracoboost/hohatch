import {Link} from "@heroui/react";
import {promises as fs} from "fs";
import type {Metadata} from "next";
import path from "path";
import React from "react";

import packageJson from "../../frontend/package.json";
import {Lightbox} from "../components/Lightbox";
import {MarkdownRenderer} from "../components/MarkdownRenderer";
import {SocialIconButton} from "../components/SocialIconButton";
import {TableOfContents} from "../components/TableOfContents";
import {WebsiteHeader} from "../components/WebsiteHeader";

export const metadata: Metadata = {
  title: "HoHatch - JPG/DDS Image Converter for Shadowverse: Worlds Beyond",
  description:
    "This page provides a comprehensive guide to HoHatch, a desktop application for converting JPG and DDS images to streamline the modding workflow for Shadowverse: Worlds Beyond with Special K. Learn how to inject JPG mods as DDS files and extract game assets from DDS to JPG with step-by-step instructions. The guide covers downloading the latest version, using the main screen features for image conversion, replacement, and deletion, and configuring settings like language and output resolution. Join the modding community on Discord for support and to share your creations.",
  alternates: {
    canonical: "https://hohatch.draco.moe",
  },
  openGraph: {
    title: "HoHatch",
    description:
      "This page provides a comprehensive guide to HoHatch, a desktop application for converting JPG and DDS images to streamline the modding workflow for Shadowverse: Worlds Beyond with Special K. Learn how to inject JPG mods as DDS files and extract game assets from DDS to JPG with step-by-step instructions. The guide covers downloading the latest version, using the main screen features for image conversion, replacement, and deletion, and configuring settings like language and output resolution. Join the modding community on Discord for support and to share your creations.",
    url: "https://hohatch.draco.moe",
    siteName: "HoHatch",
    images: [
      {
        url: "https://hohatch.draco.moe/og/ogp.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HoHatch",
    description:
      "This page provides a comprehensive guide to HoHatch, a desktop application for converting JPG and DDS images to streamline the modding workflow for Shadowverse: Worlds Beyond with Special K. Learn how to inject JPG mods as DDS files and extract game assets from DDS to JPG with step-by-step instructions. The guide covers downloading the latest version, using the main screen features for image conversion, replacement, and deletion, and configuring settings like language and output resolution. Join the modding community on Discord for support and to share your creations.",
    images: ["https://hohatch.draco.moe/og/ogp.png"],
  },
  // @ts-expect-error: The 'script' property is not officially part of the 'Metadata' type yet.
  // This is a valid workaround to inject JSON-LD structured data for enhanced SEO.
  // See: https://github.com/vercel/next.js/issues/56320
  script: [
    {
      type: "application/ld+json",
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: "HoHatch",
        operatingSystem: "Windows",
        applicationCategory: "MultimediaApplication",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        description:
          "This page provides a comprehensive guide to HoHatch, a desktop application for converting JPG and DDS images to streamline the modding workflow for Shadowverse: Worlds Beyond with Special K. Learn how to inject JPG mods as DDS files and extract game assets from DDS to JPG with step-by-step instructions. The guide covers downloading the latest version, using the main screen features for image conversion, replacement, and deletion, and configuring settings like language and output resolution. Join the modding community on Discord for support and to share your creations.",
        softwareRequirements: "Windows OS",
        url: "https://hohatch.draco.moe",
        downloadUrl: `https://github.com/dracoboost/hohatch/releases/latest/download/HoHatch-v${packageJson.version}.zip`,
        image: "https://hohatch.draco.moe/og/ogp.png",
      }),
    },
  ],
};

export default async function Home() {
  const markdownFilePath = path.join(process.cwd(), "content", "index.md");
  const markdownContent = await fs.readFile(markdownFilePath, "utf-8");

  const appVersion = packageJson.version;

  return (
    <div className="container mx-auto px-4 font-sans sm:px-6 lg:px-8">
      <WebsiteHeader version={appVersion} />

      <main>
        <Lightbox>
          {/* Layout for lg: 3-column with sticky sidebar and TOC */}
          <div className="hidden min-h-screen lg:flex">
            {/* Social Icons Sidebar - Left (lg only) */}
            <aside className="sticky top-0 flex h-screen w-20 flex-col items-center justify-start gap-4 border-r border-slate-700 pt-6">
              <SocialIconButton type="reddit" />
              <SocialIconButton type="discord" />
              <SocialIconButton type="x" />
              <SocialIconButton type="github" />
            </aside>

            {/* Main Content Area */}
            <article className="flex-1 p-8">
              <div className="prose dark:prose-invert prose-lg prose-p:mb-4 prose-ol:pl-5 max-w-none">
                <MarkdownRenderer markdownContent={markdownContent} />
              </div>
            </article>

            {/* Table of Contents - Right (lg only) */}
            <nav className="bg-muted/30 sticky top-0 h-screen w-[200px] overflow-y-auto border-l border-slate-700 px-6">
              <div className="sticky top-6">
                <TableOfContents />
              </div>
            </nav>
          </div>

          {/* Layout for md: 2-column with main content and TOC, icons at bottom */}
          <div className="hidden md:block lg:hidden">
            <div className="flex min-h-screen">
              <article className="flex-1 p-6">
                <div className="prose dark:prose-invert prose-lg prose-p:mb-4 prose-ol:pl-5 max-w-none">
                  <MarkdownRenderer markdownContent={markdownContent} />
                </div>
              </article>
              <nav className="bg-muted/30 w-[200px] border-l border-slate-700 p-6">
                <div className="sticky top-4">
                  <TableOfContents />
                </div>
              </nav>
            </div>
            <div className="bg-muted/10 flex w-20 items-center justify-center gap-4 border-t border-slate-700 p-4">
              <SocialIconButton type="reddit" />
              <SocialIconButton type="discord" />
              <SocialIconButton type="x" />
              <SocialIconButton type="github" />
            </div>
          </div>

          {/* Layout for sm: single column with main content, icons at bottom, TOC hidden */}
          <div className="block md:hidden">
            <article className="p-1">
              <div className="prose dark:prose-invert prose-lg prose-p:mb-4 prose-ol:pl-5 max-w-none">
                <MarkdownRenderer markdownContent={markdownContent} />
              </div>
            </article>
            <div className="bg-muted/10 flex items-center justify-center gap-4 border-t border-slate-700 p-4">
              <SocialIconButton type="reddit" />
              <SocialIconButton type="discord" />
              <SocialIconButton type="x" />
              <SocialIconButton type="github" />
            </div>
          </div>
        </Lightbox>
      </main>

      <footer className="mt-2 py-6 text-center">
        <p suppressHydrationWarning>
          &copy; {new Date().getFullYear()}{" "}
          <Link
            isExternal
            className="text-link-color hover:opacity-75 active:opacity-50"
            href="https://x.com/dracoboost"
          >
            dracoboost
          </Link>
        </p>
      </footer>
    </div>
  );
}
