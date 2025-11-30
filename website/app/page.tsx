import {Link} from "@heroui/react";
import {promises as fs} from "fs";
import {imageSize} from "image-size";
import path from "path";
import React from "react";

import packageJson from "../../frontend/package.json";
import {ContentRenderer} from "../components/ContentRenderer";
import {SocialIconButton} from "../components/SocialIconButton";
import {TableOfContents} from "../components/TableOfContents";
import {WebsiteHeader} from "../components/WebsiteHeader";
import {metadata} from "../config/consts";
import {HeadingItem, getHeadingsFromMarkdown} from "../lib/getHeadingsFromMarkdown";
import {type ImageProps} from "../lib/types";

export {metadata};

export default async function Home() {
  const markdownFilePath = path.join(process.cwd(), "content", "index.md");
  const markdownContent = await fs.readFile(markdownFilePath, "utf-8");

  const nestedHeadings: HeadingItem[] = await getHeadingsFromMarkdown(markdownContent); // Call the function

  const appVersion = packageJson.version;

  const imageRegex = /!\[(.*?)\]\((.*?)\)/g;
  const imagePromises: Promise<ImageProps>[] = [];
  let match;

  while ((match = imageRegex.exec(markdownContent)) !== null) {
    const alt = match[1];
    const src = match[2];

    const promise = new Promise<ImageProps>(async (resolve) => {
      if (src.startsWith("http")) {
        resolve({src, alt, width: undefined, height: undefined});
        return;
      }
      try {
        const imagePath = path.join(process.cwd(), "public", src);
        const buffer = await fs.readFile(imagePath);
        const {width, height} = imageSize(buffer);
        resolve({src, alt, width, height});
      } catch (error) {
        console.error(`Failed to get dimensions for image: ${src}`, error);
        resolve({src, alt, width: undefined, height: undefined});
      }
    });
    imagePromises.push(promise);
  }

  const images = await Promise.all(imagePromises);

  return (
    <div className="container mx-auto px-4 font-sans sm:px-6 lg:px-8">
      <WebsiteHeader version={appVersion} />

      <main>
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
              <ContentRenderer images={images} markdownContent={markdownContent} />
            </div>
          </article>

          {/* Table of Contents - Right (lg only) */}
          <nav className="sticky top-0 h-screen w-[200px] overflow-y-auto border-l border-slate-700 px-6">
            <div className="sticky top-6">
              <TableOfContents headings={nestedHeadings} />
            </div>
          </nav>
        </div>
        {/* Layout for md: 2-column with main content and TOC, icons at bottom */}
        <div className="hidden md:block lg:hidden">
          <div className="flex min-h-screen">
            <article className="flex-1 p-6">
              <div className="prose dark:prose-invert prose-lg prose-p:mb-4 prose-ol:pl-5 max-w-none">
                <ContentRenderer images={images} markdownContent={markdownContent} />
              </div>
            </article>
            <nav className="w-[200px] border-l border-slate-700 p-6">
              <div className="sticky top-4">
                <TableOfContents headings={nestedHeadings} />
              </div>
            </nav>
          </div>
          <div className="flex w-20 items-center justify-center gap-4 border-t border-slate-700 p-4">
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
              <ContentRenderer images={images} markdownContent={markdownContent} />
            </div>
          </article>
          <div className="flex items-center justify-center gap-4 border-t border-slate-700 p-4">
            <SocialIconButton type="reddit" />
            <SocialIconButton type="discord" />
            <SocialIconButton type="x" />
            <SocialIconButton type="github" />
          </div>
        </div>
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
