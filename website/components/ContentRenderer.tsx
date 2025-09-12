"use client";

import Image from "next/image";
import React, {ImgHTMLAttributes, useState} from "react";

import {Lightbox} from "./Lightbox";
import {MarkdownRenderer} from "./MarkdownRenderer";

interface ContentRendererProps {
  markdownContent: string;
  imageUrls: string[];
}

export const ContentRenderer: React.FC<ContentRendererProps> = ({markdownContent, imageUrls}) => {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const openLightbox = (imageSrc: string) => {
    const index = imageUrls.findIndex((url) => url === imageSrc);
    if (index !== -1) {
      setSelectedImageIndex(index);
      setIsLightboxOpen(true);
    }
  };

  const components = {
    img: (props: ImgHTMLAttributes<HTMLImageElement>) => {
      const {src, alt} = props;

      if (!src || typeof src !== "string") {
        return null;
      }

      return (
        <button
          className="mt-2 w-full transform transition-transform duration-300 hover:scale-105"
          onClick={() => openLightbox(src)}
        >
          <Image
            alt={alt || ""}
            className="h-auto w-full rounded-lg"
            height={0}
            sizes="100vw"
            src={src}
            width={0}
          />
        </button>
      );
    },
  };

  return (
    <>
      <MarkdownRenderer components={components} markdownContent={markdownContent} />
      {imageUrls.length > 0 && (
        <Lightbox
          images={imageUrls}
          initialIndex={selectedImageIndex}
          isOpen={isLightboxOpen}
          onClose={() => setIsLightboxOpen(false)}
        />
      )}
    </>
  );
};
