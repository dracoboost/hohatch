"use client";

import React, {useState} from "react";

import {type ImageProps} from "../lib/types";
import {Lightbox} from "./Lightbox";
import {MarkdownImage} from "./MarkdownImage";
import {MarkdownRenderer} from "./MarkdownRenderer";

interface ContentRendererProps {
  markdownContent: string;
  images: ImageProps[];
}

export const ContentRenderer: React.FC<ContentRendererProps> = ({markdownContent, images}) => {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const openLightbox = (imageSrc: string) => {
    const index = images.findIndex(({src}) => src === imageSrc);
    if (index !== -1) {
      setSelectedImageIndex(index);
      setIsLightboxOpen(true);
    }
  };

  const components = {
    img: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
      const {src, alt} = props;
      if (!src) {
        return null;
      }
      const image = images.find((img) => img.src === src);

      const handleClick = () => {
        if (typeof src === "string") {
          openLightbox(src);
        }
      };

      return (
        <MarkdownImage
          alt={alt}
          height={image?.height}
          src={src}
          width={image?.width}
          onClick={handleClick}
        />
      );
    },
  };

  return (
    <>
      <MarkdownRenderer components={components} markdownContent={markdownContent} />
      {images.length > 0 && (
        <Lightbox
          images={images.map(({src}) => src)}
          initialIndex={selectedImageIndex}
          isOpen={isLightboxOpen}
          onClose={() => setIsLightboxOpen(false)}
        />
      )}
    </>
  );
};
