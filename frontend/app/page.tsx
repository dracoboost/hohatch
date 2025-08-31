"use client";

import {Chip, Pagination, Skeleton, Tab, Tabs, Tooltip} from "@heroui/react";
import {Folder, SearchX, Square, SquareCheck, SquareMinus} from "lucide-react";
import {useTheme} from "next-themes";
import React, {useCallback, useEffect, useRef, useState} from "react";
import {useMediaQuery} from "react-responsive";
import {Toaster, toast} from "sonner";

import {Button} from "@/components/Button";
import {Header} from "@/components/Header";
import {ImageCard, ImageInfo} from "@/components/ImageCard";
import {I18N} from "@/config/consts";

import packageJson from "../package.json";

interface ImageSectionProps {
  currentPage: number;
  images: ImageInfo[];
  imagesPerPage: number;
  isProcessing: boolean;
  languageData: typeof I18N.en;
  isLoading: boolean;
  noImagesMessage: string;
  selectedImages: Set<string>;
  folderType: "dump" | "inject";
  isAllSelected: boolean;
  isPartiallySelected: boolean;
  onDownloadJPG: (imagePath: string) => void;
  onImageSelectionChange: (imagePath: string) => void;
  onPageChange: (page: number) => void;
  onReplaceDDS: (imagePath: string) => void;
  onSelectAll: () => void;
  onTrash: (imagePath: string) => void;
}

const ImageSection: React.FC<ImageSectionProps> = ({
  currentPage,
  images,
  imagesPerPage,
  isProcessing,
  isLoading,
  languageData,
  noImagesMessage,
  selectedImages,
  folderType,
  isAllSelected,
  isPartiallySelected,
  onDownloadJPG,
  onImageSelectionChange,
  onPageChange,
  onReplaceDDS,
  onSelectAll,
  onTrash,
}) => {
  const paginatedImages = images.slice(
    (currentPage - 1) * imagesPerPage,
    currentPage * imagesPerPage,
  );

  const SelectAllIcon = isAllSelected ? SquareCheck : isPartiallySelected ? SquareMinus : Square;

  return (
    <div
      className="flex flex-grow flex-col rounded-lg bg-slate-500 p-1 dark:bg-gray-800"
      data-testid={`image-section-${folderType}`}
    >
      <div className="flex w-full flex-row items-center gap-1">
        <div className="flex h-8 w-8 items-center">
          {images.length > 0 && (
            <Button
              isIconOnly
              aria-label="Select All"
              buttonSize="size-8"
              isDisabled={isProcessing}
              onClick={onSelectAll}
            >
              <SelectAllIcon
                className="text-black dark:text-white"
                data-testid={
                  isAllSelected
                    ? "icon-square-check"
                    : isPartiallySelected
                      ? "icon-square-minus"
                      : "icon-square"
                }
                size={20}
              />
            </Button>
          )}
        </div>
        {images.length > 0 && (
          <div className="flex flex-grow justify-center">
            <Pagination
              isCompact
              showControls
              aria-label="Pagination navigation"
              initialPage={1}
              page={currentPage}
              total={Math.ceil(images.length / imagesPerPage)}
              onChange={onPageChange}
            />
          </div>
        )}
        <div className="w-6" />
      </div>
      <div className="flex flex-grow flex-col overflow-y-auto px-2 py-1">
        {isLoading ? (
          <div className="grid grid-cols-10 gap-2 md:grid-cols-14 lg:grid-cols-16">
            {Array.from({length: imagesPerPage}).map((_, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-lg border border-gray-700 shadow-md transition-shadow duration-300"
              >
                <div className="aspect-[53/64] w-full bg-gray-200 dark:bg-gray-900">
                  <Skeleton className="h-full w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : images.length > 0 ? (
          <div className="grid grid-cols-10 gap-2 md:grid-cols-14 lg:grid-cols-16">
            {paginatedImages.map((image) =>
              image.src ? (
                <ImageCard
                  key={image.path}
                  image={image}
                  isProcessing={isProcessing}
                  isSelected={selectedImages.has(image.path)}
                  languageData={languageData}
                  onDownloadJPG={onDownloadJPG}
                  onReplaceDDS={onReplaceDDS}
                  onSelectionChange={onImageSelectionChange}
                  onTrash={onTrash}
                />
              ) : (
                <div
                  key={image.path}
                  className="group relative overflow-hidden rounded-lg border border-gray-700 shadow-md transition-shadow duration-300"
                >
                  <div className="aspect-[53/64] w-full bg-gray-200 dark:bg-gray-900">
                    <Skeleton className="h-full w-full" />
                  </div>
                </div>
              ),
            )}
          </div>
        ) : (
          <div className="flex flex-grow flex-col items-center justify-center text-gray-500">
            <SearchX size={48} />
            {noImagesMessage}
          </div>
        )}
      </div>
    </div>
  );
};

type LangData = typeof I18N.en;

export default function MainScreen() {
  const [injectImages, setInjectImages] = useState<ImageInfo[]>([]);
  const [dumpImages, setDumpImages] = useState<ImageInfo[]>([]);
  const [currentPageDump, setCurrentPageDump] = useState(1);
  const [currentPageInject, setCurrentPageInject] = useState(1);
  const [isLoadingDump, setIsLoadingDump] = useState<boolean>(true);
  const [isLoadingInject, setIsLoadingInject] = useState<boolean>(true);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [currentLangCode, setCurrentLangCode] = useState<"en" | "ja">("en");
  const [i18n, setI18n] = useState<LangData>(I18N.en);
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
  const [appVersion, setAppVersion] = useState<string | undefined>(undefined); // New state for app version

  const [activeView, setActiveView] = useState<"dump" | "inject">("dump");
  const isInitialMount = useRef(true);
  const {setTheme} = useTheme();

  const isMd = useMediaQuery({minWidth: 768});
  const isLg = useMediaQuery({minWidth: 1024});
  const imagesPerPage = isLg ? 64 : isMd ? 42 : 20;

  const fetchingImagesRef = useRef(new Set<string>());

  const ensureArray = (data: unknown): ImageInfo[] => {
    if (Array.isArray(data)) {
      return data.filter((item): item is ImageInfo => {
        return typeof item === "object" && item !== null && "path" in item && "alt" in item;
      });
    }

    return [];
  };

  const loadImages = useCallback(
    async (
      folderType: "dump" | "inject",
      options: {use_hash_check?: boolean; silent?: boolean} = {},
    ) => {
      const {use_hash_check = false, silent = false} = options;
      const setIsLoading = folderType === "dump" ? setIsLoadingDump : setIsLoadingInject;
      const setImages = folderType === "dump" ? setDumpImages : setInjectImages;

      if (!silent) {
        setIsLoading(true);
      }
      try {
        const response = await window.pywebview.api.get_image_list(folderType, use_hash_check);
        if (response.success) {
          setImages(ensureArray(response.images));
        } else {
          console.error(`Failed to load ${folderType} images:`, response.error);
        }
      } catch (e: any) {
        console.error(`Error loading ${folderType} images:`, e);
      } finally {
        if (!silent) {
          setIsLoading(false);
        }
      }
    },
    [],
  );

  useEffect(() => {
    const allImages = [...dumpImages, ...injectImages];
    const imagesToFetch = allImages.filter(
      (img) => !img.src && !fetchingImagesRef.current.has(img.path),
    );

    if (imagesToFetch.length === 0) return;

    imagesToFetch.forEach(async (image) => {
      fetchingImagesRef.current.add(image.path);
      try {
        const result = await window.pywebview.api.convert_dds_for_display(image.path);
        if (result.success) {
          const updateState = (setter: React.Dispatch<React.SetStateAction<ImageInfo[]>>) => {
            setter((prevImages) =>
              prevImages.map((img) => (img.path === image.path ? {...img, src: result.src} : img)),
            );
          };

          if (dumpImages.some((img) => img.path === image.path)) {
            updateState(setDumpImages);
          }
          if (injectImages.some((img) => img.path === image.path)) {
            updateState(setInjectImages);
          }
        }
      } catch (e) {
        console.error(`Failed to convert image ${image.path}`, e);
      } finally {
        fetchingImagesRef.current.delete(image.path);
      }
    });
  }, [dumpImages, injectImages]);

  const handleOpenFolder = async (folderType: "dump" | "inject") => {
    if (activeView !== folderType) return;

    try {
      let result;
      if (folderType === "dump") {
        result = await window.pywebview.api.open_dump_folder();
      } else {
        result = await window.pywebview.api.open_inject_folder();
      }
      if (!result.success) {
        toast.error(result.error || "Failed to open folder.");
      }
    } catch (e: any) {
      console.error("Error opening folder:", e);
      toast.error("Error opening folder.");
    }
  };

  useEffect(() => {
    let isMounted = true;
    const loadInitialData = async () => {
      if (!isMounted) return;
      try {
        const settings = await window.pywebview.api.get_settings();
        if (!isMounted) return;
        setCurrentLangCode(settings.language);
        setI18n(I18N[settings.language]);
        setActiveView(settings.last_active_view || "dump");
        setTheme(settings.theme || "dark");

        // Set app version from package.json
        setAppVersion(packageJson.version);

        loadImages("dump");
        loadImages("inject");
      } catch (e: any) {
        console.error("Failed to load initial data:", e);
      }
    };

    const handleSettingsChanged = async () => {
      if (!isMounted) return;
      console.log("Settings changed, reloading images...");
      const settings = await window.pywebview.api.get_settings();
      if (!isMounted) return;
      setCurrentLangCode(settings.language);
      setI18n(I18N[settings.language]);

      loadImages("dump");
      loadImages("inject");
    };

    if (window.pywebview && window.pywebview.api) {
      loadInitialData();
    } else {
      window.addEventListener("pywebviewready", loadInitialData);
    }

    window.addEventListener("settingsChanged", handleSettingsChanged);

    return () => {
      isMounted = false;
      window.removeEventListener("pywebviewready", loadInitialData);
      window.removeEventListener("settingsChanged", handleSettingsChanged);
    };
  }, [loadImages, setTheme]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const saveActiveView = async () => {
      try {
        await window.pywebview.api.save_settings({last_active_view: activeView});
      } catch (e: any) {
        console.error("Failed to save active view:", e);
      }
    };

    saveActiveView();
  }, [activeView]);

  useEffect(() => {
    // Only run checkUpdate if appVersion is available
    if (!appVersion) return;

    const checkUpdate = async () => {
      try {
        const currentVersion = appVersion; // Use appVersion state

        const updateResponse = await window.pywebview.api.check_for_updates();
        if (!updateResponse.success || !updateResponse.latest_version) {
          console.error("Failed to check for updates:", updateResponse.error);
          return;
        }
        const latestVersion = updateResponse.latest_version;

        // Simple version comparison (e.g., "1.0.0" vs "1.0.1")
        // This assumes semantic versioning (major.minor.patch)
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
          // A new official version is available
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
              duration: 10000, // Show for 10 seconds
              position: "bottom-right",
            },
          );
        } else if (versionComparisonResult === -1) {
          // Local version is newer than latest official
          toast.info(
            <div className="flex flex-col">
              <span>
                You are running a newer version of HoHatch than the latest official release.
              </span>
              <span>
                Current: {currentVersion}, Latest Official: {latestVersion}
              </span>
              <span>This might be a development or unreleased version.</span>
            </div>,
            {
              duration: 10000, // Show for 10 seconds
              position: "bottom-right",
            },
          );
        }
      } catch (e) {
        console.error("Error during update check:", e);
      }
    };

    // Run update check after initial data load, or after a short delay
    const timer = setTimeout(() => {
      checkUpdate();
    }, 5000); // Check 5 seconds after app starts

    return () => clearTimeout(timer);
  }, [appVersion]); // Dependency array now includes appVersion

  const handleImageSelectionChange = (imagePath: string) => {
    setSelectedImages((prevSelected) => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(imagePath)) {
        newSelected.delete(imagePath);
      } else {
        newSelected.add(imagePath);
      }
      return newSelected;
    });
  };

  const handleReplace = async (imagePath: string, isDumpImage: boolean) => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      const replacementImageResult = await window.pywebview.api.open_file_dialog("file_open", {
        file_types: [["Image files", "*.jpg"]],
      });

      if (
        !replacementImageResult.success ||
        !replacementImageResult.files ||
        replacementImageResult.files.length === 0
      ) {
        toast.warning("Replacement image selection cancelled.");
        return;
      }

      toast.info(i18n.processing || "Replacing DDS image...");

      const setImages = isDumpImage ? setDumpImages : setInjectImages;
      setImages((prev) => prev.map((img) => (img.path === imagePath ? {...img, src: ""} : img)));

      const replacementImage = replacementImageResult.files[0];
      const replaceResult = await window.pywebview.api.replace_dds(
        imagePath,
        replacementImage,
        isDumpImage,
      );

      if (replaceResult.success) {
        toast.success(
          replaceResult.message || i18n.replace_conversion_complete || `DDS replaced: ${imagePath}`,
        );
        if (isDumpImage) {
          await loadImages("dump", {silent: true, use_hash_check: true});
        }
        await loadImages("inject", {silent: true, use_hash_check: true});
      } else {
        toast.error(replaceResult.error || i18n.replace_conversion_failed || "Replacement failed!");
        if (isDumpImage) {
          await loadImages("dump", {silent: true});
        } else {
          await loadImages("inject", {silent: true});
        }
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadSingle = async (imagePath: string) => {
    if (isProcessing) return;
    setIsProcessing(true);
    toast.info(i18n.processing || "Converting single DDS to JPG...");
    try {
      const outputFolderResult = await window.pywebview.api.open_file_dialog("folder");

      if (
        outputFolderResult.success &&
        outputFolderResult.files &&
        outputFolderResult.files.length > 0
      ) {
        const outputFolder = outputFolderResult.files[0];
        const conversionResult = await window.pywebview.api.convert_single_dds_to_jpg(
          imagePath,
          outputFolder,
        );

        if (conversionResult.success) {
          toast.success(
            conversionResult.message || i18n.batch_dump_jpg_complete || "Conversion complete!",
          );
        } else {
          toast.error(conversionResult.error || i18n.jpg_conversion_failed || "Conversion failed!");
        }
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTrash = async (imagePath: string) => {
    if (isProcessing) return;
    setIsProcessing(true);
    toast.info(i18n.processing || "Deleting image...");
    try {
      const result = await window.pywebview.api.delete_dds_file(imagePath);
      if (result.success) {
        toast.success(result.message || i18n.delete_success);
        if (dumpImages.some((image) => image.path === imagePath)) {
          setDumpImages(dumpImages.filter((image) => image.path !== imagePath));
        }
        if (injectImages.some((image) => image.path === imagePath)) {
          setInjectImages(injectImages.filter((image) => image.path !== imagePath));
        }
      } else {
        toast.error(result.error || i18n.delete_failed);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBatchDownload = async () => {
    if (isProcessing || selectedImages.size === 0) return;
    setIsProcessing(true);
    toast.info(i18n.batch_download_processing || "Downloading selected images...");
    try {
      const outputFolderResult = await window.pywebview.api.open_file_dialog("folder");
      if (
        outputFolderResult.success &&
        outputFolderResult.files &&
        outputFolderResult.files.length > 0
      ) {
        const outputFolder = outputFolderResult.files[0];
        const result = await window.pywebview.api.batch_download_selected_dds_as_jpg(
          Array.from(selectedImages),
          outputFolder,
        );
        if (result.success) {
          toast.success(result.message || i18n.batch_download_complete);
          setSelectedImages(new Set()); // Clear selection
        } else {
          toast.error(result.error || i18n.batch_download_failed);
        }
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBatchTrash = async () => {
    if (isProcessing || selectedImages.size === 0) return;
    setIsProcessing(true);
    toast.info(i18n.processing || "Deleting selected images...");
    try {
      const result = await window.pywebview.api.batch_delete_selected_dds_files(
        Array.from(selectedImages),
      );
      if (result.success) {
        toast.success(result.message || i18n.batch_delete_success);
        setDumpImages(dumpImages.filter((image) => !selectedImages.has(image.path)));
        setInjectImages(injectImages.filter((image) => !selectedImages.has(image.path)));
        setSelectedImages(new Set()); // Clear selection
      } else {
        toast.error(result.error || i18n.batch_delete_failed);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-300 text-black dark:bg-gray-900 dark:text-white">
      <Toaster richColors position="bottom-right" />
      <Header
        appVersion={appVersion}
        isProcessing={isProcessing}
        lang={currentLangCode}
        page="index"
        selectedImagesCount={selectedImages.size}
        onBatchDownload={handleBatchDownload}
        onBatchTrash={handleBatchTrash}
        onReload={() => {
          fetchingImagesRef.current.clear();
          loadImages("dump", {use_hash_check: true});
          loadImages("inject", {use_hash_check: true});
        }}
      />

      <main className="flex grow flex-col gap-2 p-2">
        <div className="flex items-center justify-center gap-2">
          <Tabs
            aria-label="Image types"
            classNames={{
              tabList: "w-full relative rounded-none p-0 border-b border-divider gap-6",
              cursor: "w-full bg-[#22d3ee]",
              tab: "max-w-fit px-0 h-12",
              tabContent: "group-data-[selected=true]:text-[#06b6d4]",
            }}
            color="primary"
            selectedKey={activeView}
            variant="underlined"
            onSelectionChange={(key) => setActiveView(key as "dump" | "inject")}
          >
            <Tab
              key="dump"
              title={
                <div className="flex items-center space-x-2">
                  <span>{i18n.dumped_images}</span>
                  <Chip size="sm" variant="faded">
                    {dumpImages.length}
                  </Chip>
                  <Tooltip
                    content={i18n.dump_folder || "Open Dump Folder"}
                    isDisabled={activeView !== "dump"}
                  >
                    <div
                      aria-label="Open Dump Folder"
                      className="cursor-pointer"
                      role="button"
                      tabIndex={0}
                      onClick={() => handleOpenFolder("dump")}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          handleOpenFolder("dump");
                        }
                      }}
                    >
                      <Folder size={20} />
                    </div>
                  </Tooltip>
                </div>
              }
            />
            <Tab
              key="inject"
              title={
                <div className="flex items-center space-x-2">
                  <span>{i18n.injected_images}</span>
                  <Chip size="sm" variant="faded">
                    {injectImages.length}
                  </Chip>
                  <Tooltip
                    content={i18n.inject_folder || "Open Inject Folder"}
                    isDisabled={activeView !== "inject"}
                  >
                    <div
                      aria-label="Open Inject Folder"
                      className="cursor-pointer"
                      role="button"
                      tabIndex={0}
                      onClick={() => handleOpenFolder("inject")}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          handleOpenFolder("inject");
                        }
                      }}
                    >
                      <Folder size={20} />
                    </div>
                  </Tooltip>
                </div>
              }
            />
          </Tabs>
        </div>
        <div className={`flex flex-grow flex-col gap-2 ${activeView === "dump" ? "" : "hidden"}`}>
          <ImageSection
            currentPage={currentPageDump}
            folderType="dump"
            images={dumpImages}
            imagesPerPage={imagesPerPage}
            isAllSelected={
              selectedImages.size > 0 && dumpImages.every((img) => selectedImages.has(img.path))
            }
            isLoading={isLoadingDump}
            isPartiallySelected={
              selectedImages.size > 0 &&
              dumpImages.some((img) => selectedImages.has(img.path)) &&
              !dumpImages.every((img) => selectedImages.has(img.path))
            }
            isProcessing={isProcessing}
            languageData={i18n}
            noImagesMessage={i18n.no_dump_images}
            selectedImages={selectedImages}
            onDownloadJPG={handleDownloadSingle}
            onImageSelectionChange={handleImageSelectionChange}
            onPageChange={setCurrentPageDump}
            onReplaceDDS={(imagePath) => handleReplace(imagePath, true)}
            onSelectAll={() => {
              const allDumpPaths = dumpImages.map((img) => img.path);
              const areAllSelected = allDumpPaths.every((path) => selectedImages.has(path));
              if (areAllSelected) {
                setSelectedImages(
                  (prev) => new Set([...prev].filter((path) => !allDumpPaths.includes(path))),
                );
              } else {
                setSelectedImages((prev) => new Set([...prev, ...allDumpPaths]));
              }
            }}
            onTrash={handleTrash}
          />
        </div>
        <div className={`flex flex-grow flex-col gap-2 ${activeView === "inject" ? "" : "hidden"}`}>
          <ImageSection
            currentPage={currentPageInject}
            folderType="inject"
            images={injectImages}
            imagesPerPage={imagesPerPage}
            isAllSelected={
              selectedImages.size > 0 && injectImages.every((img) => selectedImages.has(img.path))
            }
            isLoading={isLoadingInject}
            isPartiallySelected={
              selectedImages.size > 0 &&
              injectImages.some((img) => selectedImages.has(img.path)) &&
              !injectImages.every((img) => selectedImages.has(img.path))
            }
            isProcessing={isProcessing}
            languageData={i18n}
            noImagesMessage={i18n.no_inject_images}
            selectedImages={selectedImages}
            onDownloadJPG={handleDownloadSingle}
            onImageSelectionChange={handleImageSelectionChange}
            onPageChange={setCurrentPageInject}
            onReplaceDDS={(imagePath) => handleReplace(imagePath, false)}
            onSelectAll={() => {
              const allInjectPaths = injectImages.map((img) => img.path);
              const areAllSelected = allInjectPaths.every((path) => selectedImages.has(path));
              if (areAllSelected) {
                setSelectedImages(
                  (prev) => new Set([...prev].filter((path) => !allInjectPaths.includes(path))),
                );
              } else {
                setSelectedImages((prev) => new Set([...prev, ...allInjectPaths]));
              }
            }}
            onTrash={handleTrash}
          />
        </div>
      </main>
    </div>
  );
}
