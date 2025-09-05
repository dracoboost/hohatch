import { Link } from "@heroui/react";
import { promises as fs } from "fs";

import type { Metadata } from 'next';
import path from "path";
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { SocialIconButton } from "../components/SocialIconButton";
import { TableOfContents } from '../components/TableOfContents';

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
        "downloadUrl": "https://github.com/dracoboost/hohatch/releases/latest/download/HoHatch-v1.0.3.zip",
        "image": "https://hohatch.draco.moe/og/ogp.png"
      })
    }
  ]
}

import { WebsiteHeader } from "../components/WebsiteHeader";

export default async function Home() {
  const markdownFilePath = path.join(process.cwd(), "content", "index.md");
  const markdownContent = await fs.readFile(markdownFilePath, "utf-8");

  const appVersion = "1.0.3"; // Hardcoded version for now, will be dynamic later

  interface AnchorProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    href?: string;
  }

  interface Components {
    a: React.FC<AnchorProps>;
    blockquote: React.FC<React.QuoteHTMLAttributes<HTMLQuoteElement>>; 
    h1: React.FC<React.HTMLAttributes<HTMLHeadingElement>>; 
    h2: React.FC<React.HTMLAttributes<HTMLHeadingElement>>; 
    h3: React.FC<React.HTMLAttributes<HTMLHeadingElement>>; 
    h4: React.FC<React.HTMLAttributes<HTMLHeadingElement>>; 
    h5: React.FC<React.HTMLAttributes<HTMLHeadingElement>>; 
    h6: React.FC<React.HTMLAttributes<HTMLHeadingElement>>; 
  }

  const components: Components = {
    a: (props: AnchorProps) => {
      const isExternal =
        props.href && (props.href.startsWith("http://") || props.href.startsWith("https://"));
      return (
        <Link
          className="text-link-color hover:opacity-60 active:opacity-40"
          href={props.href}
          isExternal={isExternal ? true : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
          showAnchorIcon
          target={isExternal ? "_blank" : undefined}
        >
          {props.children}
        </Link>
      );
    },
    blockquote: ({ children }) => {
      return (
        <div className="mt-2 bg-slate-700 text-base text-white rounded-lg px-4 py-0.5" role="alert">
          {children}
        </div>
      );
    },
    h1: ({children}) => <h1 className="text-h1 sm:text-sm-h1 md:text-md-h1 lg:text-lg-h1" id={String(children).toLowerCase().replace(/\s/g, "-")}>{children}</h1>,
    h2: ({children}) => <h2 className="text-h2 sm:text-sm-h2 md:text-md-h2 lg:text-lg-h2 scroll-mt-2" id={String(children).toLowerCase().replace(/\s/g, "-")}>{children}</h2>,
    h3: ({children}) => <h3 className="text-h3 sm:text-sm-h3 md:text-md-h3 lg:text-lg-h3 scroll-mt-2" id={String(children).toLowerCase().replace(/\s/g, "-")}>{children}</h3>,
    h4: ({children}) => <h4 id={String(children).toLowerCase().replace(/\s/g, "-")}>{children}</h4>,
    h5: ({children}) => <h5 id={String(children).toLowerCase().replace(/\s/g, "-")}>{children}</h5>,
    h6: ({children}) => <h6 id={String(children).toLowerCase().replace(/\s/g, "-")}>{children}</h6>,
  };

  return (
    <div className="font-sans container mx-auto px-4 sm:px-6 lg:px-8">
      <WebsiteHeader version={appVersion} />

      <main>
        {/* Layout for lg: 3-column with sticky sidebar and TOC */}
        <div className="hidden lg:flex min-h-screen">
          {/* Social Icons Sidebar - Left (lg only) */}
          <aside className="w-20 flex flex-col justify-start items-center gap-4 pt-6 border-r border-slate-700 sticky top-0 h-screen">
            <SocialIconButton type="discord" />
            <SocialIconButton type="x" />
            <SocialIconButton type="github" />
          </aside>

          {/* Main Content Area */}
          <article className="flex-1 p-8">
            <div className="prose dark:prose-invert prose-lg max-w-none prose-p:mb-4 prose-ol:pl-5">
              <ReactMarkdown components={components} remarkPlugins={[remarkGfm]}>
                {markdownContent}
              </ReactMarkdown>
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
                <ReactMarkdown components={components} remarkPlugins={[remarkGfm]}>
                  {markdownContent}
                </ReactMarkdown>
              </div>
            </article>
            <nav className="w-[200px] p-6 border-l border-slate-700 bg-muted/30">
              <div className="sticky top-4">
                <TableOfContents />
              </div>
            </nav>
          </div>
          <div className="w-20 flex justify-center items-center gap-4 p-4 border-t border-slate-700 bg-muted/10">
            <SocialIconButton type="discord" />
            <SocialIconButton type="x" />
            <SocialIconButton type="github" />
          </div>
        </div>

        {/* Layout for sm: single column with main content, icons at bottom, TOC hidden */}
        <div className="block md:hidden">
          <article className="p-1">
            <div className="prose dark:prose-invert prose-lg max-w-none prose-p:mb-4 prose-ol:pl-5">
              <ReactMarkdown components={components} remarkPlugins={[remarkGfm]}>
                {markdownContent}
              </ReactMarkdown>
            </div>
          </article>
          <div className="flex justify-center items-center gap-4 p-4 border-t border-slate-700 bg-muted/10">
            <SocialIconButton type="discord" />
            <SocialIconButton type="x" />
            <SocialIconButton type="github" />
          </div>
        </div>
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
