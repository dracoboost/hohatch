"use client";

import Image from "next/image";
import React from "react";

import {type ImageProps} from "../lib/types";

interface MarkdownImageProps extends ImageProps {
  onClick?: () => void;
}

export const MarkdownImage: React.FC<MarkdownImageProps> = ({alt, src, width, height, onClick}) => {
  if (!src) return null;

  const image = (
    <Image
      alt={alt || ""}
      className="h-auto w-full rounded-lg shadow-md"
      height={height || 0}
      sizes="100vw"
      src={src}
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
