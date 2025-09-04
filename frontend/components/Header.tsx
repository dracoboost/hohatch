"use client";

import {Tooltip} from "@heroui/react";
import {Download, RefreshCw, Settings, Trash2, X} from "lucide-react";
import Image from "next/image";
import {useRouter} from "next/navigation";

import {Button} from "@/components/Button";
import {ThemeSwitcher} from "@/components/ThemeSwitcher";
import hoHatchJpg from "@/public/images/icons/hohatch.jpg";

import {I18N} from "../config/consts";

interface HeaderProps {
  page: "index" | "settings";
  onReload?: () => void;
  selectedImagesCount?: number;
  isProcessing?: boolean;
  onBatchDownload?: () => Promise<void>;
  onBatchTrash?: () => Promise<void>;
  lang?: "en" | "ja";
  appVersion?: string;
  mounted: boolean;
  theme: string | undefined;
}

export const Header: React.FC<HeaderProps> = ({
  isProcessing,
  appVersion,
  selectedImagesCount,
  lang = "en",
  mounted,
  page,
  theme,
  onBatchDownload,
  onBatchTrash,
  onReload,
}) => {
  const router = useRouter();
  const i18n = I18N[lang];

  return (
    <header className="flex items-center justify-between px-4 py-2">
      <div className="flex items-center gap-3">
        <a href="https://hohatch.draco.moe" rel="noopener noreferrer" target="_blank">
          <div className="flex flex-row items-center gap-2">
            <Image alt="Ho-chan" className="rounded-lg" height={32} src={hoHatchJpg} width={32} />
            <h1 className="font-balootamma2 text-hochan-red relative top-1 text-4xl font-bold">
              HoHatch
            </h1>
          </div>
        </a>
        <a
          className="hidden lg:block"
          href="https://github.com/dracoboost/hohatch/releases"
          rel="noopener noreferrer"
          target="_blank"
        >
          <Image
            alt="version"
            height={20}
            src={`https://img.shields.io/badge/version-${appVersion || "0.0.0"}-b7465a`}
          />
        </a>
        {page === "index" && (
          <>
            {(selectedImagesCount ?? 0) > 0 && (
              <>
                <button
                  className="inline-flex items-center justify-center rounded-md bg-sky-500 px-3 py-1 text-sm font-semibold text-white transition-colors duration-200 hover:bg-sky-600"
                  data-testid="batch-download-button"
                  disabled={isProcessing}
                  onClick={onBatchDownload}
                >
                  <Download color="white" size={16} />
                  {i18n.download_to_btn_text} ({selectedImagesCount})
                </button>
                <button
                  className="inline-flex items-center justify-center rounded-md bg-rose-500 px-3 py-1 text-sm font-semibold text-white transition-colors duration-200 hover:bg-rose-600"
                  data-testid="batch-trash-button"
                  disabled={isProcessing}
                  onClick={onBatchTrash}
                >
                  <Trash2 color="white" size={16} />
                  {i18n.trash_btn_text} ({selectedImagesCount})
                </button>
              </>
            )}
          </>
        )}
      </div>
      <div className="flex items-center gap-2">
        {page === "index" && (
          <Tooltip
            color={mounted && theme === "light" ? "foreground" : "default"}
            content={i18n.reload_btn}
          >
            <Button isIconOnly aria-label="Reload" buttonSize="size-8" onClick={onReload}>
              <RefreshCw size={20} />
            </Button>
          </Tooltip>
        )}
        <ThemeSwitcher />
        {page === "index" ? (
          <Button
            isIconOnly
            aria-label="Settings"
            buttonSize="size-8"
            onClick={() => router.push("/settings")}
          >
            <Settings size={20} />
          </Button>
        ) : (
          <Button
            isIconOnly
            aria-label="Close"
            buttonSize="size-8"
            onClick={() => router.push("/")}
          >
            <X size={20} />
          </Button>
        )}
      </div>
    </header>
  );
};
