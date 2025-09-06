"use client";

import Image from "next/image";
import React, { useRef, useEffect, useState } from "react";
import { Link, Button } from "@heroui/react";

interface WebsiteHeaderProps {
  version: string;
}

export const WebsiteHeader: React.FC<WebsiteHeaderProps> = ({ version }) => {
  const textRef = useRef<HTMLSpanElement>(null);
  const [imageSize, setImageSize] = useState(48); // Default size

  useEffect(() => {
    if (textRef.current) {
      // Get the computed height of the text element
      const textHeight = textRef.current.offsetHeight;
      // Set image size to match text height (assuming 1:1 aspect ratio for the image)
      setImageSize(textHeight);
    }
  }, []); // Run once on mount to get initial size

  // Re-measure on window resize to handle responsive text size changes
  useEffect(() => {
    const handleResize = () => {
      if (textRef.current) {
        setImageSize(textRef.current.offsetHeight);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header className="text-center py-8">
      <div className="flex items-center justify-center">
        <div className="relative">
          <h1 className="flex flex-row items-center gap-2">
            <Image
              src="/images/icons/hohatch.jpg"
              alt="HoHatch App Image"
              className="mb-3 rounded-lg"
              width={imageSize}
              height={imageSize}
            />
            <span
              ref={textRef}
              className="text-5xl font-balootamma2 font-bold tracking-tight text-hochan-red md:text-6xl leading-none"
            >
              HoHatch
            </span>
          </h1>
          <a
            className="absolute -bottom-4 right-0 block"
            href="https://github.com/dracoboost/hohatch/releases"
            rel="noopener noreferrer"
            target="_blank"
          >
            <Image
              alt="version"
              height={20}
              src={`https://img.shields.io/badge/version-${version}-b7465a`}
              width={102}
            />
          </a>
        </div>
      </div>
      <p className="mt-5 max-w-md mx-auto text-base text-muted-foreground sm:text-lg md:text-xl md:max-w-3xl">
        A desktop tool for converting and managing JPG/DDS images to streamline modding for Shadowverse: Worlds Beyond with Special K.
      </p>
      <div className="mt-5 flex justify-center">
        <div className="rounded-md shadow">
          <Link href={`https://github.com/dracoboost/hohatch/releases/latest/download/HoHatch-v${version}.zip`} isExternal>
            <Button className="flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-hochan-red hover:bg-hochan-red/80 md:py-4 md:text-lg md:px-10">
              Download Latest HoHatch (v{version})
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};
