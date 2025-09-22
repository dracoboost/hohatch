"use client";

import Image from "next/image";
import React, {useEffect, useState} from "react";

interface MarkdownImageProps {
  alt?: string;
  src?: string | Blob;
  width?: number; // Add width
  height?: number; // Add height
}

export const MarkdownImage: React.FC<MarkdownImageProps> = ({alt, src, width, height}) => {
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

  // next/image requires width and height. If not provided by rehype-img-size (e.g., external images),
  // we can provide a fallback or handle it. For now, let's assume they are always provided for local images.
  // If width or height are undefined, next/image will throw an error.
  // We should ensure that for local images, these are always provided by rehype-img-size.
  // For external images, we might need to fetch dimensions or use layout="fill" with a parent container.
  // For simplicity, let's assume width and height are always numbers here, as rehype-img-size will provide them.
  // If they are not provided, next/image will error, which is a good indicator something is wrong.
  // next/image requires width and height. If not provided by rehype-img-size (e.g., external images),
  // it will throw an error. For local images, these should always be provided by rehype-img-size.
  // If width or height are missing, it indicates a problem with rehype-img-size or the image source.
  // We will not provide a fallback <img> tag to ensure all images are optimized by next/image.
  // If dimensions are truly unknown for external images, consider using layout="fill" with a parent container.
  if (!width || !height) {
    console.error("Image dimensions (width, height) not provided for next/image:", imageUrl);
    // In a production environment, you might want to return null or a placeholder here,
    // but for development, an error is more informative.
    return null; // Or throw new Error("Missing image dimensions");
  }

  return (
    <Image
      alt={alt || ""}
      className="rounded-lg shadow-md"
      height={height} // Use dynamic height
      src={imageUrl}
      width={width} // Use dynamic width
    />
  );
};
