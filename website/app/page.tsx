import { Link } from "@heroui/react";
import { promises as fs } from "fs";

import type { Metadata } from 'next';
import path from "path";
import React from "react";
import { SocialIconButton } from "../components/SocialIconButton";
import { TableOfContents } from '../components/TableOfContents';
import { WebsiteHeader } from "../components/WebsiteHeader";
import { Lightbox } from "../components/Lightbox";
import { MarkdownRenderer } from "../components/MarkdownRenderer";

export const metadata: Metadata = {
  title: 'HoHatch - JPG/DDS Image Converter for ShadowverseWB',
  description: 'HoHatch is a desktop application for converting JPG and DDS images, designed to streamline the modding workflow for Shadowverse: Worlds Beyond with Special K. Easily inject JPG mods as DDS files or extract game assets from DDS to JPG.',
  alternates: {
    canonical: 'https://hohatch.draco.moe',
  },
  openGraph: {
    title: 'HoHatch',
    description: 'A desktop application for converting JPG/DDS images to streamline the modding workflow for Shadowverse: Worlds Beyond with Special K.',
    url: 'https://hohatch.draco.moe',
    siteName: 'HoHatch',
    images: [
      {
        url: 'https://hohatch.draco.moe/og/ogp.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HoHatch',
    description: 'A desktop application for converting JPG/DDS images to streamline the modding workflow for Shadowverse: Worlds Beyond with Special K.',
    images: ['https://hohatch.draco.moe/og/ogp.png'],
  },
  // @ts-expect-error: The 'script' property is not officially part of the 'Metadata' type yet.
  // This is a valid workaround to inject JSON-LD structured data for enhanced SEO.
  // See: https://github.com/vercel/next.js/issues/56320
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "HoHatch",
        "operatingSystem": "Windows",
        "applicationCategory": "MultimediaApplication",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "description": "HoHatch is a desktop application for converting JPG and DDS images, designed to streamline the modding workflow for Shadowverse: Worlds Beyond with Special K. Easily inject JPG mods as DDS files or extract game assets from DDS to JPG.",
        "softwareRequirements": "Windows OS",
        "url": "https://hohatch.draco.moe",
        "downloadUrl": `https://github.com/dracoboost/hohatch/releases/latest/download/HoHatch-v${packageJson.version}.zip`,
        "image": "https://hohatch.draco.moe/og/ogp.png"
      })
    }
  ]
}

import packageJson from "../../frontend/package.json";

export default async function Home() {
  const markdownFilePath = path.join(process.cwd(), "content", "index.md");
  const markdownContent = await fs.readFile(markdownFilePath, "utf-8");

  const appVersion = packageJson.version;

  return (
    <div className="font-sans container mx-auto px-4 sm:px-6 lg:px-8">
      <WebsiteHeader version={appVersion} />

      <main>
        <Lightbox>
          {/* Layout for lg: 3-column with sticky sidebar and TOC */}
          <div className="hidden lg:flex min-h-screen">
            {/* Social Icons Sidebar - Left (lg only) */}
            <aside className="w-20 flex flex-col justify-start items-center gap-4 pt-6 border-r border-slate-700 sticky top-0 h-screen">
              <SocialIconButton type="reddit" />
              <SocialIconButton type="discord" />
              <SocialIconButton type="x" />
              <SocialIconButton type="github" />
            </aside>

            {/* Main Content Area */}
            <article className="flex-1 p-8">
              <div className="prose dark:prose-invert prose-lg max-w-none prose-p:mb-4 prose-ol:pl-5">
                <MarkdownRenderer markdownContent={markdownContent} />
              </div>
            </article>

            {/* Table of Contents - Right (lg only) */}
            <nav className="w-[200px] px-6 border-l border-slate-700 bg-muted/30 sticky top-0 h-screen overflow-y-auto">
              <div className="sticky top-6">
                <TableOfContents />
              </div>
            </nav>
          </div>

          {/* Layout for md: 2-column with main content and TOC, icons at bottom */}
          <div className="hidden md:block lg:hidden">
            <div className="flex min-h-screen">
              <article className="flex-1 p-6">
                <div className="prose dark:prose-invert prose-lg max-w-none prose-p:mb-4 prose-ol:pl-5">
                  <MarkdownRenderer markdownContent={markdownContent} />
                </div>
              </article>
              <nav className="w-[200px] p-6 border-l border-slate-700 bg-muted/30">
                <div className="sticky top-4">
                  <TableOfContents />
                </div>
              </nav>
            </div>
            <div className="w-20 flex justify-center items-center gap-4 p-4 border-t border-slate-700 bg-muted/10">
              <SocialIconButton type="reddit" />
              <SocialIconButton type="discord" />
              <SocialIconButton type="x" />
              <SocialIconButton type="github" />
            </div>
          </div>

          {/* Layout for sm: single column with main content, icons at bottom, TOC hidden */}
          <div className="block md:hidden">
            <article className="p-1">
              <div className="prose dark:prose-invert prose-lg max-w-none prose-p:mb-4 prose-ol:pl-5">
                <MarkdownRenderer markdownContent={markdownContent} />
              </div>
            </article>
            <div className="flex justify-center items-center gap-4 p-4 border-t border-slate-700 bg-muted/10">
              <SocialIconButton type="reddit" />
              <SocialIconButton type="discord" />
              <SocialIconButton type="x" />
              <SocialIconButton type="github" />
            </div>
          </div>
        </Lightbox>
      </main>

      <footer className="text-center py-6 mt-2">
        <p suppressHydrationWarning>
          &copy; {new Date().getFullYear()}{" "}
          <Link href="https://x.com/dracoboost" isExternal className="text-link-color hover:opacity-75 active:opacity-50">
            dracoboost
          </Link>
        </p>
      </footer>
    </div>
  );
}
