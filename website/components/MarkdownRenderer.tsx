"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import {useLightbox} from "./Lightbox";
import {MarkdownImage} from "./MarkdownImage";
import {MarkdownLink} from "./MarkdownLink";

interface MarkdownRendererProps {
  markdownContent: string;
}

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
  img: React.FC<React.ImgHTMLAttributes<HTMLImageElement>>;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({markdownContent}) => {
  const {openLightbox} = useLightbox();

  const components: Components = {
    a: (props: AnchorProps) => {
      const isExternal =
        props.href && (props.href.startsWith("http://") || props.href.startsWith("https://"));
      return (
        <MarkdownLink
          href={props.href}
          rel={isExternal ? "noopener noreferrer" : undefined}
          target={isExternal ? "_blank" : undefined}
        >
          {props.children}
        </MarkdownLink>
      );
    },
    blockquote: ({children}) => {
      return (
        <div className="mt-2 rounded-lg bg-slate-700 px-4 py-0.5 text-base text-white" role="alert">
          {children}
        </div>
      );
    },
    h1: ({children}) => (
      <h1
        className="text-h1 sm:text-sm-h1 md:text-md-h1 lg:text-lg-h1"
        id={String(children).toLowerCase().replace(/\s/g, "-")}
      >
        {children}
      </h1>
    ),
    h2: ({children}) => (
      <h2
        className="text-h2 sm:text-sm-h2 md:text-md-h2 lg:text-lg-h2 scroll-mt-2"
        id={String(children).toLowerCase().replace(/\s/g, "-")}
      >
        {children}
      </h2>
    ),
    h3: ({children}) => (
      <h3
        className="text-h3 sm:text-sm-h3 md:text-md-h3 lg:text-lg-h3 scroll-mt-2"
        id={String(children).toLowerCase().replace(/\s/g, "-")}
      >
        {children}
      </h3>
    ),
    h4: ({children}) => <h4 id={String(children).toLowerCase().replace(/\s/g, "-")}>{children}</h4>,
    h5: ({children}) => <h5 id={String(children).toLowerCase().replace(/\s/g, "-")}>{children}</h5>,
    h6: ({children}) => <h6 id={String(children).toLowerCase().replace(/\s/g, "-")}>{children}</h6>,
    img: ({alt, src}) => {
      return <MarkdownImage alt={alt} openLightbox={openLightbox} src={src} />;
    },
  };

  return (
    <ReactMarkdown components={components} remarkPlugins={[remarkGfm]}>
      {markdownContent}
    </ReactMarkdown>
  );
};
