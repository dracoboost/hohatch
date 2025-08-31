"use client";

import {Tooltip} from "@heroui/react";
import {Download, Moon, RefreshCw, Settings, Sun, Trash2, X} from "lucide-react";
import {useTheme} from "next-themes";
import Image from "next/image";
import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";

import {Button} from "@/components/Button";
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
  appVersion?: string; // Added appVersion prop
}

export const Header: React.FC<HeaderProps> = ({
  page,
  onReload,
  selectedImagesCount,
  isProcessing,
  onBatchDownload,
  onBatchTrash,
  lang = "en",
  appVersion, // Destructure appVersion
}) => {
  const router = useRouter();
  const i18n = I18N[lang];
  const [mounted, setMounted] = useState(false);
  const {theme, setTheme} = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const ThemeSwitcher = () => {
    if (!mounted) {
      return <div className="size-8" />;
    }

    const handleThemeChange = (newTheme: "dark" | "light") => {
      setTheme(newTheme);
      window.pywebview.api.save_settings({theme: newTheme});
    };

    return (
      <Button
        isIconOnly
        aria-label="Toggle Theme"
        buttonSize="size-8"
        onClick={() => handleThemeChange(theme === "dark" ? "light" : "dark")}
      >
        {theme === "dark" ? <Moon size={20} /> : <Sun size={20} />}
      </Button>
    );
  };

  return (
    <header className="flex items-center justify-between border-b border-gray-700 px-4 py-2">
      <div className="flex items-center gap-4">
        <div className="flex flex-row items-center gap-2">
          <Image alt="Ho-chan" className="rounded-lg" height={32} src={hoHatchJpg} width={32} />
          <h1 className="font-balootamma2 relative top-1 bg-gradient-to-r from-[#B7465A] to-[#D9CAD1] bg-clip-text text-4xl font-bold text-transparent">
            HoHatch
          </h1>
        </div>
        <a href="https://hohatch.draco.moe" rel="noopener noreferrer" target="_blank">
          <Image
            unoptimized
            alt="Website"
            height={20}
            src="https://img.shields.io/badge/Website-hohatch.draco.moe-b7465a"
            width={120}
          />
        </a>
        <a
          className="hidden lg:block"
          href="https://github.com/dracoboost/hohatch/releases"
          rel="noopener noreferrer"
          target="_blank"
        >
          <Image
            unoptimized
            alt="version"
            height={20}
            src={`https://img.shields.io/badge/version-${appVersion || "unknown"}-b7465a`}
            width={120}
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
          <Tooltip content={i18n.reload_btn}>
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
