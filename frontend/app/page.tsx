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

interface ImageSectionProps {
  currentPage: number;
  images: ImageInfo[];
  imagesPerPage: number;
  isOperationInProgress: boolean;
  languageData: typeof I18N.en | typeof I18N.ja;
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
  mounted: boolean;
  theme: string | undefined;
}

const ImageSection: React.FC<ImageSectionProps> = ({
  currentPage,
  images,
  imagesPerPage,
  isOperationInProgress,
  isLoading,
  mounted,
  languageData,
  noImagesMessage,
  selectedImages,
  theme,
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
      className="flex flex-grow flex-col rounded-lg bg-gray-100 p-1 dark:bg-gray-800"
      data-testid={`image-section-${folderType}`}
    >
      <div className="flex w-full flex-row items-center gap-1">
        <div className="flex h-8 w-8 items-center">
          {images.length > 0 && (
            <Tooltip
              color={mounted && theme === "light" ? "foreground" : "default"}
              content={
                isAllSelected
                  ? languageData.unselect_all_btn_tooltip
                  : languageData.select_all_btn_tooltip
              }
              placement="bottom"
            >
              <Button
                isIconOnly
                aria-label="Select All"
                buttonSize="size-8"
                isDisabled={isOperationInProgress}
                onClick={onSelectAll}
              >
                <SelectAllIcon
                  className="text-gray-800 dark:text-white"
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
            </Tooltip>
          )}
        </div>
        {images.length > 0 && (
          <div className="flex flex-grow justify-center">
            <Pagination
              isCompact
              loop
              showControls
              aria-label="Pagination navigation"
              color="secondary"
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
                <div className="aspect-[53/64] w-full bg-white dark:bg-gray-900">
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
                  isOperationInProgress={isOperationInProgress}
                  isSelected={selectedImages.has(image.path)}
                  languageData={languageData}
                  mounted={mounted}
                  theme={theme}
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
                  <div className="aspect-[53/64] w-full bg-white dark:bg-gray-900">
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

export default function MainScreen() {
  interface ImageState {
    images: ImageInfo[];
    currentPage: number;
    isLoading: boolean;
  }

  const [imageStates, setImageStates] = useState<Record<"dump" | "inject", ImageState>>({
    dump: {images: [], currentPage: 1, isLoading: true},
    inject: {images: [], currentPage: 1, isLoading: true},
  });

  const [isOperationInProgress, setIsOperationInProgress] = useState<boolean>(false);
  const [currentLangCode, setCurrentLangCode] = useState<"en" | "ja">("en");
  const [i18n, setI18n] = useState<typeof I18N.en | typeof I18N.ja>(I18N.en);
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());

  const [activeView, setActiveView] = useState<"dump" | "inject">("dump");
  const isInitialMount = useRef(true);
  const [mounted, setMounted] = useState(false);
  const {theme, setTheme} = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

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

      if (!silent) {
        setImageStates((prev) => ({
          ...prev,
          [folderType]: {...prev[folderType], isLoading: true},
        }));
      }
      try {
        const response = await window.pywebview.api.get_image_list(folderType, use_hash_check);
        if (response.success) {
          console.log(`Loaded ${response.images.length} ${folderType} images from backend.`);
          const imagesWithIsDump = ensureArray(response.images).map((img) => ({
            ...img,
            isDumpImage: folderType === "dump",
          }));
          setImageStates((prev) => ({
            ...prev,
            [folderType]: {...prev[folderType], images: imagesWithIsDump},
          }));
        } else {
          console.error(`Failed to load ${folderType} images:`, response.error);
        }
      } catch (e: any) {
        console.error(`Error loading ${folderType} images:`, e);
      } finally {
        if (!silent) {
          setImageStates((prev) => ({
            ...prev,
            [folderType]: {...prev[folderType], isLoading: false},
          }));
        }
      }
    },
    [],
  );

  useEffect(() => {
    const allImages = [...imageStates.dump.images, ...imageStates.inject.images];
    const imagesToFetch = allImages.filter(
      (img) => !img.src && !fetchingImagesRef.current.has(img.path),
    );

    if (imagesToFetch.length === 0) return;

    imagesToFetch.forEach(async (image) => {
      fetchingImagesRef.current.add(image.path);
      try {
        const result = await window.pywebview.api.convert_dds_for_display(
          image.path,
          image.isDumpImage ?? false,
        );
        if (result.success) {
          setImageStates((prev) => {
            const newStates = {...prev};
            let updated = false;

            const updateImages = (type: "dump" | "inject") => {
              newStates[type] = {
                ...newStates[type],
                images: newStates[type].images.map((img) =>
                  img.path === image.path ? {...img, src: result.src} : img,
                ),
              };
              updated = true;
            };

            if (prev.dump.images.some((img) => img.path === image.path)) {
              updateImages("dump");
            }
            if (prev.inject.images.some((img) => img.path === image.path)) {
              updateImages("inject");
            }
            return updated ? newStates : prev;
          });
        }
      } catch (e) {
        console.error(`Failed to convert image ${image.path}`, e);
      } finally {
        fetchingImagesRef.current.delete(image.path);
      }
    });
  }, [imageStates]);

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

        (["dump", "inject"] as const).forEach((folderType) => loadImages(folderType));
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

      (["dump", "inject"] as const).forEach((folderType) => loadImages(folderType));
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
    if (isOperationInProgress) return;
    setIsOperationInProgress(true);

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

      toast.info(i18n.replacing_image);

      const folderType = isDumpImage ? "dump" : "inject";
      setImageStates((prev) => ({
        ...prev,
        [folderType]: {
          ...prev[folderType],
          images: prev[folderType].images.map((img) =>
            img.path === imagePath ? {...img, src: ""} : img,
          ),
        },
      }));

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
        } else {
          await loadImages("inject", {silent: true, use_hash_check: true});
        }
      } else {
        toast.error(replaceResult.error || i18n.replace_conversion_failed || "Replacement failed!");
        if (isDumpImage) {
          await loadImages("dump", {silent: true});
        } else {
          await loadImages("inject", {silent: true});
        }
      }
    } finally {
      setIsOperationInProgress(false);
    }
  };

  const handleDownloadSingle = async (imagePath: string) => {
    if (isOperationInProgress) return;
    setIsOperationInProgress(true);
    toast.info(i18n.converting_to_jpg);
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
      setIsOperationInProgress(false);
    }
  };

  const handleTrash = async (imagePath: string) => {
    if (isOperationInProgress) return;
    setIsOperationInProgress(true);
    toast.info(i18n.deleting_image);
    try {
      const result = await window.pywebview.api.delete_dds_file(imagePath);
      if (result.success) {
        toast.success(result.message || i18n.delete_success);

        setImageStates((prev) => {
          const newStates = {...prev};
          let updated = false;

          if (prev.dump.images.some((img) => img.path === imagePath)) {
            newStates.dump = {
              ...newStates.dump,
              images: newStates.dump.images.filter((img) => img.path !== imagePath),
            };
            updated = true;
          }
          if (prev.inject.images.some((img) => img.path === imagePath)) {
            newStates.inject = {
              ...newStates.inject,
              images: newStates.inject.images.filter((img) => img.path !== imagePath),
            };
            updated = true;
          }

          return updated ? newStates : prev;
        });
      } else {
        toast.error(result.error || i18n.delete_failed);
      }
    } finally {
      setIsOperationInProgress(false);
    }
  };

  const handleBatchDownload = async () => {
    if (isOperationInProgress || selectedImages.size === 0) return;
    setIsOperationInProgress(true);
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
      setIsOperationInProgress(false);
    }
  };

  const handleBatchTrash = async () => {
    if (isOperationInProgress || selectedImages.size === 0) return;
    setIsOperationInProgress(true);
    toast.info(i18n.batch_deleting_images);
    try {
      const result = await window.pywebview.api.batch_delete_selected_dds_files(
        Array.from(selectedImages),
      );
      if (result.success) {
        toast.success(result.message || i18n.batch_delete_success);
        setImageStates((prev) => ({
          ...prev,
          dump: {
            ...prev.dump,
            images: prev.dump.images.filter((image) => !selectedImages.has(image.path)),
          },
          inject: {
            ...prev.inject,
            images: prev.inject.images.filter((image) => !selectedImages.has(image.path)),
          },
        }));
        setSelectedImages(new Set()); // Clear selection
      } else {
        toast.error(result.error || i18n.batch_delete_failed);
      }
    } finally {
      setIsOperationInProgress(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white text-gray-900 dark:bg-gray-900 dark:text-white">
      <Toaster richColors position="bottom-right" />
      <Header
        isOperationInProgress={isOperationInProgress}
        lang={currentLangCode}
        mounted={mounted}
        page="index"
        selectedImagesCount={selectedImages.size}
        theme={theme}
        onBatchDownload={handleBatchDownload}
        onBatchTrash={handleBatchTrash}
        onReload={() => {
          fetchingImagesRef.current.clear();
          (["dump", "inject"] as const).forEach((folderType) =>
            loadImages(folderType, {use_hash_check: true}),
          );
        }}
      />

      <main className="flex grow flex-col gap-2 p-2">
        <div className="flex items-center justify-center gap-2">
          <Tabs
            aria-label="Image types"
            classNames={{
              tabList: "w-full relative rounded-none p-0 border-b border-divider gap-3",
              cursor: "w-full bg-hochan-red",
              tab: "max-w-fit px-0 h-12",
              tabContent: "group-data-[selected=true]:text-hochan-red",
            }}
            color="secondary"
            selectedKey={activeView}
            variant="underlined"
            onSelectionChange={(key) => setActiveView(key as "dump" | "inject")}
          >
            {(["dump", "inject"] as const).map((folderType) => (
              <Tab
                key={folderType}
                title={
                  <div className="flex items-center space-x-2 px-1">
                    <span
                      className={activeView === folderType ? "text-hochan-red" : "text-gray-500"}
                    >
                      {folderType === "dump" ? i18n.dumped_images : i18n.injected_images}
                    </span>
                    <Chip size="sm" variant="faded">
                      {imageStates[folderType].images.length}
                    </Chip>
                    <Tooltip
                      color={mounted && theme === "light" ? "foreground" : "default"}
                      content={
                        folderType === "dump"
                          ? i18n.dump_folder || "Open Dump Folder"
                          : i18n.inject_folder || "Open Inject Folder"
                      }
                    >
                      <div
                        aria-label={
                          folderType === "dump" ? "Open Dump Folder" : "Open Inject Folder"
                        }
                        className="cursor-pointer"
                        role="button"
                        tabIndex={0}
                        onClick={() => handleOpenFolder(folderType)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            handleOpenFolder(folderType);
                          }
                        }}
                      >
                        <Folder size={20} />
                      </div>
                    </Tooltip>
                  </div>
                }
              />
            ))}
          </Tabs>
        </div>
        {(["dump", "inject"] as const).map((folderType) => {
          const state = imageStates[folderType];
          const images = state.images;

          const handlePageChange = (page: number) => {
            setImageStates((prev) => ({
              ...prev,
              [folderType]: {...prev[folderType], currentPage: page},
            }));
          };

          const handleSelectAll = () => {
            const allPaths = images.map((img) => img.path);
            const areAllSelected = allPaths.every((path) => selectedImages.has(path));
            if (areAllSelected) {
              setSelectedImages(
                (prev) => new Set([...prev].filter((path) => !allPaths.includes(path))),
              );
            } else {
              setSelectedImages((prev) => new Set([...prev, ...allPaths]));
            }
          };

          return (
            <div
              key={folderType}
              className={`flex flex-grow flex-col gap-2 ${activeView === folderType ? "" : "hidden"}`}
            >
              <ImageSection
                currentPage={state.currentPage}
                folderType={folderType}
                images={images}
                imagesPerPage={imagesPerPage}
                isAllSelected={
                  selectedImages.size > 0 && images.every((img) => selectedImages.has(img.path))
                }
                isLoading={state.isLoading}
                isOperationInProgress={isOperationInProgress}
                isPartiallySelected={
                  selectedImages.size > 0 &&
                  images.some((img) => selectedImages.has(img.path)) &&
                  !images.every((img) => selectedImages.has(img.path))
                }
                languageData={i18n}
                mounted={mounted}
                noImagesMessage={
                  folderType === "dump" ? i18n.no_dump_images : i18n.no_inject_images
                }
                selectedImages={selectedImages}
                theme={theme}
                onDownloadJPG={handleDownloadSingle}
                onImageSelectionChange={handleImageSelectionChange}
                onPageChange={handlePageChange}
                onReplaceDDS={(imagePath) => handleReplace(imagePath, folderType === "dump")}
                onSelectAll={handleSelectAll}
                onTrash={handleTrash}
              />
            </div>
          );
        })}
      </main>
    </div>
  );
}
