"use client";

import {CircularProgress, Tab, Tabs, Tooltip} from "@heroui/react";
import {Download, Folder, FolderCheck, FolderPen, MoveHorizontal, MoveVertical} from "lucide-react";
import {useTheme} from "next-themes";
import React, {useEffect, useState} from "react";
import {Toaster, toast} from "sonner";

import {AspectRatioSelector} from "@/components/AspectRatioSelector";
import {Button} from "@/components/Button";
import {FloatingUnderlineInput} from "@/components/FloatingUnderlineInput";
import {Header} from "@/components/Header";
import {I18N} from "@/config/consts";

interface SettingsData {
  language: "en" | "ja";
  last_image_dir: string;
  special_k_folder_path: string;
  texconv_executable_path: string;
  output_height: number;
  output_width: number;
  aspect_ratio: "none" | "53x64";
  last_active_view: "dump" | "inject";
  theme: "dark" | "light";
}

export default function SettingsScreen() {
  const [settings, setSettings] = useState<SettingsData>({
    language: "en",
    last_image_dir: "",
    special_k_folder_path: "",
    texconv_executable_path: "",
    output_height: 0,
    output_width: 0,
    aspect_ratio: "53x64",
    last_active_view: "dump",
    theme: "light",
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [, setIsSaving] = useState<boolean>(false);
  const [skFolderValidation, setSkFolderValidation] = useState<{
    isValid: boolean | null;
    message: string | null;
  }>({isValid: null, message: null});
  const isInitialMount = React.useRef(true);
  const [mounted, setMounted] = useState(false);
  const {theme} = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const i18n: typeof I18N.en | typeof I18N.ja = settings?.language
    ? I18N[settings.language]
    : I18N.en;

  const folderIcon = skFolderValidation.isValid ? (
    <FolderCheck className="text-green-500" size={18} />
  ) : skFolderValidation.isValid === false ? (
    <FolderPen className="text-red-500" size={18} />
  ) : (
    <Folder size={18} />
  );

  // console.log("Settings:", settings);

  const loadSettingsAndLanguage = async () => {
    try {
      setLoading(true);
      const currentSettings = await window.pywebview.api.get_settings();
      setSettings((prev) => ({...prev, ...currentSettings}));
    } catch (e: any) {
      toast.error((i18n.error || "Error") + ": " + e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettingsAndLanguage();
  }, []);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (loading || !Object.keys(settings).length) {
      return;
    }

    const saveChanges = async () => {
      setIsSaving(true);
      try {
        const result = await window.pywebview.api.save_settings(settings);
        if (result.success) {
          toast.success("Settings saved automatically.");
          await window.pywebview.api.notify_settings_changed();
        } else {
          toast.error(result.error);
        }
      } catch (e: any) {
        toast.error((i18n.error || "Error") + ": " + e.message);
      } finally {
        setIsSaving(false);
      }
    };

    const handler = setTimeout(() => {
      saveChanges();
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [settings, loading, i18n.error]);

  useEffect(() => {
    const validateSkFolder = async () => {
      if (settings.special_k_folder_path) {
        try {
          const result = await window.pywebview.api.validate_sk_folder(
            settings.special_k_folder_path,
          );
          setSkFolderValidation(result);
        } catch (e: any) {
          setSkFolderValidation({isValid: false, message: e.message});
        }
      } else {
        setSkFolderValidation({isValid: null, message: null});
      }
    };
    validateSkFolder();
  }, [settings.special_k_folder_path]);

  const output_width =
    settings.aspect_ratio === "53x64" && settings.output_height
      ? Math.round(settings.output_height * (53 / 64))
      : settings.output_width;

  const handleAspectRatioChange = (ratio: "none" | "53x64") => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      aspect_ratio: ratio,
      output_width:
        ratio === "53x64" && prevSettings.output_height
          ? Math.round(prevSettings.output_height * (53 / 64))
          : prevSettings.output_width,
    }));
  };

  const handleSelectSpecialKFolder = async () => {
    try {
      let directory = settings.special_k_folder_path;
      if (!directory) {
        directory = await window.pywebview.api.get_default_sk_path();
      }
      const result = await window.pywebview.api.open_file_dialog("folder", {directory});
      if (result.success && result.files && result.files.length > 0) {
        setSettings({...settings, special_k_folder_path: result.files[0]});
      }
    } catch (e: any) {
      toast.error("Failed to open folder dialog: " + e.message);
    }
  };

  const handleDownloadSpecialK = async () => {
    try {
      await window.pywebview.api.download_special_k();
      toast.success(i18n.special_k_download_success || "Special K downloaded successfully.");
    } catch (e: any) {
      toast.error(i18n.error + ": " + e.message);
    }
  };

  const handleOpenCacheFolder = async () => {
    try {
      const result = await window.pywebview.api.open_cache_folder();
      if (!result.success) {
        toast.error(result.error || "Failed to open cache folder.");
      }
    } catch (e: any) {
      toast.error("Failed to open cache folder: " + e.message);
    }
  };

  const handleOpenLogFolder = async () => {
    try {
      const result = await window.pywebview.api.open_log_folder();
      if (!result.success) {
        toast.error(result.error || "Failed to open log folder.");
      }
    } catch (e: any) {
      toast.error("Failed to open log folder: " + e.message);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-white text-gray-900 dark:bg-gray-900 dark:text-white">
        <Toaster richColors position="bottom-right" />
        <Header mounted={mounted} page="settings" theme={theme} />
        <main className="flex flex-grow items-center justify-center">
          <CircularProgress aria-label="Loading..." color="primary" />
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-white text-gray-900 dark:bg-gray-900 dark:text-white">
      <Toaster richColors position="bottom-right" />
      <Header mounted={mounted} page="settings" theme={theme} />

      <main className="flex flex-grow items-center justify-center">
        <div className="mx-auto flex max-w-3xl flex-col items-start gap-6">
          {/* Language */}
          <div className="flex w-full flex-col items-start gap-2">
            <label className="text-sm font-medium text-gray-800 dark:text-gray-400">
              {i18n.language_setting || "Language"}
            </label>
            <Tabs
              aria-label="Language"
              classNames={{tabList: "border-gray-300 dark:border-gray-700"}}
              color="secondary"
              selectedKey={settings.language}
              variant="bordered"
              onSelectionChange={(key) => setSettings({...settings, language: key as "en" | "ja"})}
            >
              <Tab key="en" title="English" />
              <Tab key="ja" title="Japanese" />
            </Tabs>
          </div>

          {/* Special K Folder Path */}
          <div className="flex w-full flex-col items-start">
            <label className="text-sm font-medium text-gray-800 dark:text-gray-400">
              {i18n.sk_folder_path_title || "Special K Folder Path"}
            </label>
            <div className="flex w-full flex-row items-center gap-2">
              <FloatingUnderlineInput
                containerClassName="w-full md:w-[500px]"
                errorMessage={
                  skFolderValidation.isValid === false
                    ? skFolderValidation.message || undefined
                    : undefined
                }
                label={i18n.sk_folder_path_label}
                startContent={folderIcon}
                value={settings.special_k_folder_path || ""}
                onChange={(e) =>
                  setSettings((prevSettings) => ({
                    ...prevSettings,
                    special_k_folder_path: e.target.value,
                  }))
                }
              />
              <Tooltip
                color={mounted && theme === "light" ? "foreground" : "default"}
                content={i18n.select_folder_btn || "Select Folder"}
                placement="top"
              >
                <Button
                  isIconOnly
                  aria-label="Select Folder"
                  buttonSize="size-8"
                  className="w-10"
                  onClick={handleSelectSpecialKFolder}
                >
                  <Folder size={20} />
                </Button>
              </Tooltip>
              <Tooltip
                color={mounted && theme === "light" ? "foreground" : "default"}
                content={i18n.download_special_k_btn}
                placement="top"
              >
                <Button
                  isIconOnly
                  aria-label="Download Special K Installer"
                  buttonSize="size-8"
                  className="w-10"
                  onClick={handleDownloadSpecialK}
                >
                  <Download size={20} />
                </Button>
              </Tooltip>
            </div>
          </div>

          {/* Download JPG Size */}
          <div className="flex w-full flex-col items-start gap-2">
            <label className="text-sm font-medium text-gray-800 dark:text-gray-400">
              {i18n.download_jpg_size_label || "Download JPG Size"}
            </label>
            <AspectRatioSelector
              languageData={i18n}
              selectedRatio={settings.aspect_ratio}
              onRatioChange={handleAspectRatioChange}
            />
            <div className="flex w-full flex-row items-start gap-6">
              <FloatingUnderlineInput
                aria-label={i18n.dds_to_jpg_width_label || "Width (auto-calculated)"}
                containerClassName="w-full md:w-[150px]"
                label={i18n.dds_to_jpg_width_label}
                min={0}
                readOnly={settings.aspect_ratio === "53x64"}
                startContent={<MoveHorizontal size={18} />}
                type="number"
                value={output_width?.toString() || ""}
                onChange={(e) => {
                  const value = parseInt(e.target.value, 10);
                  setSettings((prevSettings: any) => ({
                    ...prevSettings,
                    output_width: isNaN(value) ? 0 : value,
                  }));
                }}
              />
              <FloatingUnderlineInput
                aria-label={i18n.dds_to_jpg_height_label || "Height"}
                containerClassName="w-full md:w-[150px]"
                label={i18n.dds_to_jpg_height_label}
                min={0}
                startContent={<MoveVertical size={18} />}
                type="number"
                value={settings.output_height}
                onChange={(e) => {
                  const value = parseInt(e.target.value, 10);
                  setSettings((prevSettings: any) => ({
                    ...prevSettings,
                    output_height: isNaN(value) ? 0 : value,
                  }));
                }}
              />
            </div>
          </div>

          {/* Application Folders */}
          <div className="flex w-full flex-col items-start gap-2">
            <label className="text-sm font-medium text-gray-800 dark:text-gray-400">
              {i18n.folder_settings || "Application Folders"}
            </label>
            <div className="flex flex-row gap-4">
              <Button
                className="flex items-center gap-2"
                color="secondary"
                variant="solid"
                onClick={handleOpenCacheFolder}
              >
                <Folder size={18} />
                {i18n.open_cache_folder_btn || "Open Cache Folder"}
              </Button>
              <Button
                className="flex items-center gap-2"
                color="secondary"
                variant="solid"
                onClick={handleOpenLogFolder}
              >
                <Folder size={18} />
                {i18n.open_log_folder_btn || "Open Log Folder"}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
