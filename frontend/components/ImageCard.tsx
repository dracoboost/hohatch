import {Skeleton, Tooltip} from "@heroui/react";
import {AlertCircle, Download, PencilLine, Trash2} from "lucide-react";
import Image from "next/image";
import React, {useState} from "react";

import {Button} from "@/components/Button";
import {cn} from "@/lib/utils";

export interface ImageInfo {
  src: string;
  alt: string;
  path: string;
  width: number;
  height: number;
  isDumpImage?: boolean;
}

interface ImageCardProps {
  image: ImageInfo;
  onDownloadJPG: (path: string) => void;
  onReplaceDDS: (path: string, isDumpImage: boolean) => void;
  onTrash: (path: string) => void;
  languageData: {[key: string]: string};
  isProcessing: boolean;
  isSelected: boolean;
  onSelectionChange: (path: string) => void;
  mounted: boolean;
  theme: string | undefined;
}

export const ImageCard: React.FC<ImageCardProps> = ({
  image,
  languageData,
  isProcessing,
  isSelected,
  mounted,
  theme,
  onDownloadJPG,
  onReplaceDDS,
  onTrash,
  onSelectionChange,
}) => {
  const [hasError, setHasError] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const uniqueId = `checkbox-${image.path.replace(/[^a-zA-Z0-9]/g, "-")}`;
  const displayName = image.alt.replace(/\.dds$/, "");

  return (
    <div>
      <input
        checked={isSelected}
        className="peer hidden"
        id={uniqueId}
        type="checkbox"
        value={image.path}
        onChange={() => onSelectionChange(image.path)}
      />
      <label
        className={cn(
          "group relative m-0 inline-flex w-full max-w-md cursor-pointer rounded-lg border border-gray-700 p-0 shadow-md transition-shadow duration-300",
          "items-center justify-start overflow-hidden hover:shadow-lg",
          "peer-checked:border-primary peer-checked:ring-primary peer-checked:ring-2",
          {"border-red-500 ring-2 ring-red-500": hasError},
        )}
        htmlFor={uniqueId}
      >
        <div className="aspect-[53/64] w-full bg-gray-900">
          {isImageLoading && !hasError && <Skeleton className="h-full w-full" />}
          {!hasError && (
            <Image
              alt={image.alt}
              className={cn(
                "h-full w-full object-fill",
                isImageLoading ? "hidden" : "inline-block",
              )}
              height={image.height}
              src={image.src}
              width={image.width}
              onError={() => {
                setHasError(true);
                setIsImageLoading(false);
              }}
              onLoad={() => setIsImageLoading(false)}
            />
          )}
          {hasError && (
            <div className="flex h-full w-full flex-col items-center justify-center bg-gray-800 text-red-500">
              <AlertCircle size={48} />
              <p className="mt-2 text-center text-sm">
                {languageData.image_load_error || "Image Load Error"}
              </p>
            </div>
          )}
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/50 p-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:bg-black/50">
          <p className="mb-2 truncate text-sm font-semibold text-black dark:text-white">
            {displayName}
          </p>
          <div className="inline-flex rounded-full p-0.5 dark:border-neutral-700">
            <Tooltip
              color={mounted && theme === "light" ? "foreground" : "default"}
              content={languageData.download_as_jpg_tooltip || "Convert to JPG"}
              placement="bottom"
            >
              <Button
                isIconOnly
                aria-label="Convert to JPG"
                buttonSize="size-6"
                isDisabled={isProcessing}
                onClick={() => onDownloadJPG(image.path)}
              >
                <Download color={mounted && theme === "light" ? "black" : "white"} size={16} />
              </Button>
            </Tooltip>
            <Tooltip
              color={mounted && theme === "light" ? "foreground" : "default"}
              content={languageData.replace_tooltip || "Replace"}
              placement="bottom"
            >
              <Button
                isIconOnly
                aria-label="Replace DDS"
                buttonSize="size-6"
                isDisabled={isProcessing}
                onClick={() => onReplaceDDS(image.path, image.isDumpImage ?? false)}
              >
                <PencilLine color={mounted && theme === "light" ? "black" : "white"} size={16} />
              </Button>
            </Tooltip>
            <Tooltip
              color={mounted && theme === "light" ? "foreground" : "default"}
              content={languageData.trash_btn_tooltip || "Trash"}
              placement="bottom"
            >
              <Button
                isIconOnly
                aria-label="Trash"
                buttonSize="size-6"
                data-testid="trash-button"
                isDisabled={isProcessing}
                onClick={() => onTrash(image.path)}
              >
                <Trash2 color="red" size={16} />
              </Button>
            </Tooltip>
          </div>
        </div>
      </label>
    </div>
  );
};
