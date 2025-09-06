"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";

interface MarkdownImageProps {
  alt?: string;
  src?: string | Blob;
  openLightbox: (src: string) => void;
}

export const MarkdownImage: React.FC<MarkdownImageProps> = ({
  alt,
  src,
  openLightbox,
}) => {
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

  return (
    <Image
      src={imageUrl}
      alt={alt || ""}
      width={800} // Placeholder, actual size will be determined by object-contain
      height={600} // Placeholder
      className="cursor-zoom-in rounded-lg shadow-md"
      onClick={() => openLightbox(imageUrl)}
    />
  );
};
