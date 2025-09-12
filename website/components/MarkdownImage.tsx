"use client";

import Image from "next/image";
import React, {useEffect, useState} from "react";

interface MarkdownImageProps {
  alt?: string;
  src?: string | Blob;
}

export const MarkdownImage: React.FC<MarkdownImageProps> = ({alt, src}) => {
  // Removed openLightbox
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
      alt={alt || ""}
      className="rounded-lg shadow-md" // Removed cursor-zoom-in
      height={600} // Placeholder
      src={imageUrl}
      width={800} // Placeholder, actual size will be determined by object-contain
      // onClick={() => openLightbox(imageUrl)} // Removed
    />
  );
};
