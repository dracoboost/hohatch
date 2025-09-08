"use client";

import {Button, Link} from "@heroui/react";
import Image from "next/image";
import React from "react";

interface WebsiteHeaderProps {
  version: string;
}

export const WebsiteHeader: React.FC<WebsiteHeaderProps> = ({version}) => {
  return (
    <header className="py-8 text-center">
      <div className="flex items-center justify-center">
        <div className="relative">
          <Image alt="HoHatch Logo" height={72} src="/images/logos/hohatch-logo.png" width={420} />
          <a
            className="absolute right-0 -bottom-7 block"
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
      <p className="text-muted-foreground mx-auto mt-10 max-w-md text-base sm:text-lg md:max-w-3xl md:text-xl">
        A desktop tool for converting and managing JPG/DDS images to streamline modding for
        Shadowverse: Worlds Beyond with Special K.
      </p>
      <div className="mt-5 flex justify-center">
        <div className="rounded-md shadow">
          <Link
            isExternal
            href={`https://github.com/dracoboost/hohatch/releases/latest/download/HoHatch-v${version}.zip`}
          >
            <Button className="bg-hochan-red hover:bg-hochan-red/80 flex items-center justify-center rounded-md border border-transparent px-8 py-3 text-base font-medium text-white md:px-10 md:py-4 md:text-lg">
              Download Latest HoHatch (v{version})
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};
