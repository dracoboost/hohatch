import { Button, Link, Tooltip } from "@heroui/react";
import { promises as fs } from "fs";
import { ChevronRight } from "lucide-react";
import type { Metadata } from 'next';
import Image from "next/image";
import path from "path";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { TableOfContents } from '../components/TableOfContents';

export const metadata: Metadata = {
  title: 'HoHatch - JPG/DDS Image Converter for ShadowverseWB',
  description: 'A desktop application for converting JPG and DDS images, especially for Shadowverse: Worlds Beyond. Download the latest version and learn how to use it for modding games like Shadowverse: Worlds Beyond.',
  openGraph: {
    title: 'HoHatch',
    description: 'A desktop application for converting JPG and DDS images, especially for Shadowverse: Worlds Beyond.',
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
    description: 'A desktop application for converting JPG and DDS images, especially for Special K.',
    images: ['https://hohatch.draco.moe/og/ogp.png'],
  },
}

export default async function Home() {
  const markdownFilePath = path.join(process.cwd(), "content", "index.md");
  const markdownContent = await fs.readFile(markdownFilePath, "utf-8");

  interface AnchorProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    href?: string;
  }

  interface Components {
    a: React.FC<AnchorProps>;
    li: React.FC<React.LiHTMLAttributes<HTMLLIElement>>;
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
          className="text-link-color hover:opacity-75 active:opacity-50"
          href={props.href}
          isExternal={isExternal ? true : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
          target={isExternal ? "_blank" : undefined}
        >
          {props.children}
        </Link>
      );
    },
    li: ({children}) => (
      <li className="flex items-start">
        <ChevronRight className="h-5 w-5 mt-1 text-foreground flex-shrink-0" />
        <span className="ml-2">{children}</span>
      </li>
    ),
    h1: ({children}) => <h1 className="text-h1 sm:text-sm-h1 md:text-md-h1 lg:text-lg-h1" id={String(children).toLowerCase().replace(/\s/g, "-")}>{children}</h1>,
    h2: ({children}) => <h2 className="text-h2 sm:text-sm-h2 md:text-md-h2 lg:text-lg-h2 scroll-mt-2" id={String(children).toLowerCase().replace(/\s/g, "-")}>{children}</h2>,
    h3: ({children}) => <h3 className="text-h3 sm:text-sm-h3 md:text-md-h3 lg:text-lg-h3 scroll-mt-2" id={String(children).toLowerCase().replace(/\s/g, "-")}>{children}</h3>,
    h4: ({children}) => <h4 id={String(children).toLowerCase().replace(/\s/g, "-")}>{children}</h4>,
    h5: ({children}) => <h5 id={String(children).toLowerCase().replace(/\s/g, "-")}>{children}</h5>,
    h6: ({children}) => <h6 id={String(children).toLowerCase().replace(/\s/g, "-")}>{children}</h6>,
  };

  return (
    <div className="font-sans container mx-auto px-4 sm:px-6 lg:px-8">
      <header className="text-center py-8">
        <div className="flex items-center justify-center">
          <Image src="/images/icons/hohatch.jpg" alt="HoHatch App Image" className="rounded-lg mr-4" width={48} height={48} />
          <h1 className="relative top-1 text-3xl font-balootamma2 font-bold tracking-tight bg-gradient-to-r from-[#B7465A] to-[#D9CAD1] text-transparent bg-clip-text sm:text-5xl md:text-6xl leading-tight">
            HoHatch
          </h1>
        </div>
        <p className="mt-3 max-w-md mx-auto text-base text-muted-foreground sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          A desktop application for converting JPG and DDS images, especially for Special K.
        </p>
        <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
          <div className="rounded-md shadow">
            <Link href="https://github.com/dracoboost/hohatch/releases/latest/download/HoHatch.exe" isExternal>
              <Button className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10">
                Download Latest
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="bg-background">
        {/* Layout for lg: 3-column with sticky sidebar and TOC */}
        <div className="hidden lg:flex min-h-screen">
          {/* Social Icons Sidebar - Left (lg only) */}
          <aside className="flex flex-col justify-start items-center gap-4 p-6 w-20 border-r border-slate-700 sticky top-0 h-screen">
            <Tooltip content="Join Discord Server">
              <Link href="https://discord.gg/fEUMrTGb23" isExternal>
                <Button isIconOnly variant="light" className="rounded-full">
                  <Image src="/images/icons/discord-white.svg" alt="Join Discord" width={32} height={32} />
                </Button>
              </Link>
            </Tooltip>
            <Tooltip content="Share on X">
              <Link href="https://x.com/intent/tweet?text=Check%20out%20Ho%20Hatch!%20https://github.com/dracoboost/hohatch" isExternal>
                <Button isIconOnly variant="light" className="rounded-full">
                  <Image src="/images/icons/x-white.svg" alt="Share on X" width={32} height={32} />
                </Button>
              </Link>
            </Tooltip>
            <Tooltip content="View Source Code">
              <Link href="https://github.com/dracoboost/hohatch" isExternal>
                <Button isIconOnly variant="light" className="rounded-full">
                  <Image src="/images/icons/github-white.svg" alt="Source Code" width={32} height={32} />
                </Button>
              </Link>
            </Tooltip>
          </aside>

          {/* Main Content Area */}
          <article className="flex-1 p-8 max-w-4xl">
            <div className="prose dark:prose-invert prose-lg max-w-none">
              <ReactMarkdown components={components} remarkPlugins={[remarkGfm]}>
                {markdownContent}
              </ReactMarkdown>
            </div>
          </article>

          {/* Table of Contents - Right (lg only) */}
          <nav className="w-64 p-8 border-l border-slate-700 bg-muted/30 sticky top-0 h-screen overflow-y-auto">
            <div className="sticky top-4">
              <h3 id="table-of-contents-heading" className="text-lg font-semibold mb-4">
                Table of Contents
              </h3>
              <TableOfContents />
            </div>
          </nav>
        </div>

        {/* Layout for md: 2-column with main content and TOC, icons at bottom */}
        <div className="hidden md:block lg:hidden">
          <div className="flex min-h-screen">
            <article className="flex-1 p-6">
              <div className="prose dark:prose-invert prose-lg max-w-none">
                <ReactMarkdown components={components} remarkPlugins={[remarkGfm]}>
                  {markdownContent}
                </ReactMarkdown>
              </div>
            </article>
            <nav className="w-64 p-6 border-l border-slate-700 bg-muted/30">
              <div className="sticky top-4">
                <h3 id="table-of-contents-heading" className="text-lg font-semibold mb-4">
                  Table of Contents
                </h3>
                <TableOfContents />
              </div>
            </nav>
          </div>
          <div className="flex justify-center items-center gap-4 p-4 border-t border-slate-700 bg-muted/10">
            <Tooltip content="Join Discord Server">
              <Link href="https://discord.gg/fEUMrTGb23" isExternal>
                <Button isIconOnly variant="light" className="rounded-full">
                  <Image src="/images/icons/discord-white.svg" alt="Join Discord" width={32} height={32} />
                </Button>
              </Link>
            </Tooltip>
            <Tooltip content="Share on X">
              <Link href="https://x.com/intent/tweet?text=HoHatch%20|%20JPG/DDS%20Image%20Converter%20for%20ShadowverseWB%20https://hohatch.draco.moe" isExternal>
                <Button isIconOnly variant="light" className="rounded-full">
                  <Image src="/images/icons/x-white.svg" alt="Share on X" width={32} height={32} />
                </Button>
              </Link>
            </Tooltip>
            <Tooltip content="View Source Code">
              <Link href="https://github.com/dracoboost/hohatch" isExternal>
                <Button isIconOnly variant="light" className="rounded-full">
                  <Image src="/images/icons/github-white.svg" alt="Source Code" width={32} height={32} />
                </Button>
              </Link>
            </Tooltip>
          </div>
        </div>

        {/* Layout for sm: single column with main content, icons at bottom, TOC hidden */}
        <div className="block md:hidden">
          <article className="p-6">
            <div className="prose dark:prose-invert prose-lg max-w-none">
              <ReactMarkdown components={components} remarkPlugins={[remarkGfm]}>
                {markdownContent}
              </ReactMarkdown>
            </div>
          </article>
          <div className="flex justify-center items-center gap-4 p-4 border-t border-slate-700 bg-muted/10">
            <Tooltip content="Join Discord Server">
              <Link href="https://discord.gg/fEUMrTGb23" isExternal>
                <Button isIconOnly variant="light" className="rounded-full">
                  <Image src="/images/icons/discord-white.svg" alt="Join Discord" width={32} height={32} />
                </Button>
              </Link>
            </Tooltip>
            <Tooltip content="Share on X">
              <Link href="https://x.com/intent/tweet?text=Check%20out%20Ho%20Hatch!%20https://github.com/dracoboost/hohatch" isExternal>
                <Button isIconOnly variant="light" className="rounded-full">
                  <Image src="/images/icons/x-white.svg" alt="Share on X" width={32} height={32} />
                </Button>
              </Link>
            </Tooltip>
            <Tooltip content="View Source Code">
              <Link href="https://github.com/dracoboost/hohatch" isExternal>
                <Button isIconOnly variant="light" className="rounded-full">
                  <Image src="/images/icons/github-white.svg" alt="Source Code" width={32} height={32} />
                </Button>
              </Link>
            </Tooltip>
          </div>
        </div>
      </main>

      <footer className="text-center py-6 mt-2">
        <p suppressHydrationWarning>
          &copy; {new Date().getFullYear()}{" "}
          <Link href="https://x.com/dracoboost" isExternal className="text-link-color hover:opacity-75 active:opacity-50">
            dracoboost
          </Link>
          . All rights reserved.
        </p>
      </footer>
    </div>
  );
}
