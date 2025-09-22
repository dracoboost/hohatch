"use client";

import {Tooltip} from "@heroui/react";
import {Download, RefreshCw, Settings, Trash2, X} from "lucide-react";
import Image from "next/image";
import {useRouter} from "next/navigation";
import React, {useEffect} from "react";
import {toast} from "sonner";

import {Button} from "@/components/Button";
import {ThemeSwitcher} from "@/components/ThemeSwitcher";
import hoHatchJpg from "@/public/images/icons/hohatch.jpg";

import {I18N, appVersion} from "../config/consts";

interface HeaderProps {
  page: "index" | "settings";
  onReload?: () => void;
  selectedImagesCount?: number;
  isOperationInProgress?: boolean;
  onBatchDownload?: () => Promise<void>;
  onBatchTrash?: () => Promise<void>;
  lang?: "en" | "ja";
  mounted: boolean;
  theme: string | undefined;
}

export const Header: React.FC<HeaderProps> = ({
  isOperationInProgress,
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

  useEffect(() => {
    if (page !== "index") return;

    const checkUpdate = async () => {
      try {
        const currentVersion = appVersion;

        const updateResponse = await window.pywebview.api.check_for_updates();
        if (!updateResponse.success || !updateResponse.latest_version) {
          console.error("Failed to check for updates:", updateResponse.error);
          return;
        }
        const latestVersion = updateResponse.latest_version;

        const compareVersions = (current: string, latest: string): number => {
          const currentParts = current.split(".").map(Number);
          const latestParts = latest.split(".").map(Number);

          for (let i = 0; i < Math.max(currentParts.length, latestParts.length); i++) {
            const currentPart = currentParts[i] || 0;
            const latestPart = latestParts[i] || 0;

            if (latestPart > currentPart) {
              return 1; // latest is newer
            }
            if (latestPart < currentPart) {
              return -1; // current is newer
            }
          }
          return 0; // versions are equal
        };

        const versionComparisonResult = compareVersions(currentVersion, latestVersion);

        if (versionComparisonResult === 1) {
          toast.info(
            <div className="flex flex-col">
              <span>A new version of HoHatch is available!</span>
              <span>
                Current: {currentVersion}, Latest: {latestVersion}
              </span>
              <a
                className="text-blue-400 underline"
                href="https://github.com/dracoboost/hohatch/releases"
                rel="noopener noreferrer"
                target="_blank"
              >
                Download Latest Version
              </a>
            </div>,
            {
              duration: 10000,
              position: "bottom-right",
            },
          );
        } else if (versionComparisonResult === -1) {
          toast.info(
            <div className="flex flex-col">
              <span>
                You are running a newer version of HoHatch than the latest official release.
              </span>
              <span>
                Current: {currentVersion}, Latest Official: {latestVersion}
              </span>
            </div>,
            {
              duration: 10000,
              position: "bottom-right",
            },
          );
        }
      } catch (e) {
        console.error("Error during update check:", e);
      }
    };

    const timer = setTimeout(() => {
      checkUpdate();
    }, 5000);

    return () => clearTimeout(timer);
  }, [appVersion, page]);

  return (
    <header className="flex items-center justify-between px-4 py-2">
      <div className="flex items-center gap-3">
        <Tooltip
          color={mounted && theme === "light" ? "foreground" : "default"}
          content="Visit Website"
        >
          <a href="https://hohatch.draco.moe" rel="noopener noreferrer" target="_blank">
            <div className="flex flex-row items-center gap-2">
              <Image alt="Ho-chan" className="rounded-lg" height={32} src={hoHatchJpg} width={32} />
              <h1 className="font-balootamma2 text-hochan-red relative top-1 text-4xl font-bold">
                HoHatch
              </h1>
            </div>
          </a>
        </Tooltip>
        <Tooltip
          color={mounted && theme === "light" ? "foreground" : "default"}
          content={i18n.view_latest_release_tooltip}
        >
          <a
            className="hidden lg:block"
            href="https://github.com/dracoboost/hohatch/releases"
            rel="noopener noreferrer"
            target="_blank"
          >
            <Image
              alt="version"
              height={20}
              src={`https://img.shields.io/badge/version-${appVersion || "unknown"}-b7465a`}
            />
          </a>
        </Tooltip>
        {page === "index" && (
          <>
            {(selectedImagesCount ?? 0) > 0 && (
              <>
                <Button
                  className="flex items-center gap-2"
                  color="primary"
                  data-testid="batch-download-button"
                  isDisabled={isOperationInProgress}
                  size="sm"
                  onClick={onBatchDownload}
                >
                  <Download color="white" size={16} />
                  {i18n.download_to_btn_text} ({selectedImagesCount})
                </Button>
                <Button
                  className="flex items-center gap-2"
                  color="danger"
                  data-testid="batch-trash-button"
                  isDisabled={isOperationInProgress}
                  size="sm"
                  onClick={onBatchTrash}
                >
                  <Trash2 color="white" size={16} />
                  {i18n.trash_btn_text} ({selectedImagesCount})
                </Button>
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
