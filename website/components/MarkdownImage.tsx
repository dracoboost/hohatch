"use client";

import Image from "next/image";
import React, {useEffect, useState} from "react";

import {type ImageProps} from "../lib/types";

interface MarkdownImageProps extends Omit<ImageProps, "src"> {
  src?: string | Blob;
  width?: number;
  height?: number;
  onClick?: () => void;
}

export const MarkdownImage: React.FC<MarkdownImageProps> = ({alt, src, width, height, onClick}) => {
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (src instanceof Blob) {
      const objectUrl = URL.createObjectURL(src);
      setImageUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else if (typeof src === "string") {
      setImageUrl(src);
    } else {
      setImageUrl(undefined);
    }
  }, [src]);

  if (!imageUrl) return null;

  // next/image requires width and height. If not provided by rehype-img-size, it will throw an error.
  // This check ensures that we don't try to render an image without dimensions, which is crucial for CLS.
  if (!width || !height) {
    // For external images, dimensions might be missing. We can either use layout="fill"
    // or simply fall back to a standard <img> tag if we want to display them without fixed sizes.
    // However, for this project, we'll enforce dimensions to maintain layout stability.
    console.error("Image dimensions (width, height) not provided for next/image:", imageUrl);
    return null; // Don't render the image if dimensions are missing.
  }

  const image = (
    <Image
      alt={alt || ""}
      className="rounded-lg shadow-md" // Keep simple styling, let width/height control size
      height={height}
      src={imageUrl}
      width={width}
    />
  );

  if (onClick) {
    return (
      <button
        className="mt-2 w-full transform transition-transform duration-300 hover:scale-105"
        type="button"
        onClick={onClick}
      >
        {image}
      </button>
    );
  }

  return image;
};
