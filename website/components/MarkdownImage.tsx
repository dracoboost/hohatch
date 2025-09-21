"use client";

import Image from "next/image";
import React, {useEffect, useState} from "react";

import {type ImageProps} from "../lib/types";

interface MarkdownImageProps extends Omit<ImageProps, "src"> {
  src?: string | Blob;
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

  const image = (
    <Image
      alt={alt || ""}
      className="h-auto w-full rounded-lg shadow-md"
      height={height || 0}
      sizes="100vw"
      src={imageUrl}
      width={width || 0}
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
