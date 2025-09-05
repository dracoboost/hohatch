"use client";

import {CircularProgress, Tab, Tabs, Tooltip} from "@heroui/react";
import {Download, Folder, FolderCheck, FolderPen, MoveHorizontal, MoveVertical} from "lucide-react";
import {useTheme} from "next-themes";
import React, {useEffect, useState} from "react";
import {Toaster, toast} from "sonner";

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
  output_width?: number;
  last_active_view: "dump" | "inject";
}

export default function SettingsScreen() {
  const [settings, setSettings] = useState<SettingsData>({
    language: "en",
    last_image_dir: "",
    special_k_folder_path: "",
    texconv_executable_path: "",
    output_height: 0,
    last_active_view: "dump",
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

  const i18n = settings?.language ? I18N[settings.language] : I18N.en;

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
      setSettings(currentSettings);
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
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const {output_width: _, ...settingsToSend} = settings;
        const result = await window.pywebview.api.save_settings(settingsToSend);
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

  const output_width = settings.output_height ? Math.round(settings.output_height * (53 / 64)) : 0;

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

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-gray-200 text-black dark:bg-gray-900 dark:text-white">
        <Toaster richColors position="bottom-right" />
        <Header mounted={mounted} page="settings" theme={theme} />
        <main className="flex flex-grow items-center justify-center">
          <CircularProgress aria-label="Loading..." color="primary" />
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-200 text-black dark:bg-gray-900 dark:text-white">
      <Toaster richColors position="bottom-right" />
      <Header mounted={mounted} page="settings" theme={theme} />

      <main className="flex flex-grow items-center justify-center">
        <div className="flex w-full flex-col items-start gap-4 p-4 sm:p-2 lg:w-2/3">
          <div className="gap-0">
            <label className="mb-2 block text-sm font-medium text-gray-800 dark:text-gray-400">
              {i18n.language_setting || "Language"}
            </label>
            <Tabs
              aria-label="Language"
              color="secondary"
              selectedKey={settings.language}
              variant="bordered"
              onSelectionChange={(key) => setSettings({...settings, language: key as "en" | "ja"})}
            >
              <Tab key="en" title="English" />
              <Tab key="ja" title="Japanese" />
            </Tabs>
          </div>

          <div className="flex w-full flex-col items-center gap-y-2 pb-4 sm:flex-row sm:gap-x-2 sm:px-0">
            <div className="relative w-full flex-grow">
              <FloatingUnderlineInput
                readOnly
                errorMessage={
                  skFolderValidation.isValid === false
                    ? skFolderValidation.message || undefined
                    : undefined
                }
                label={i18n.sk_folder_path_title || "Special K Folder Path"}
                startContent={folderIcon}
                value={settings.special_k_folder_path || ""}
              />
            </div>
            <Button
              isIconOnly
              aria-label="Select Folder"
              buttonSize="size-10"
              onClick={handleSelectSpecialKFolder}
            >
              <Folder size={24} />
            </Button>
            <Tooltip
              color={mounted && theme === "light" ? "foreground" : "default"}
              content={i18n.download_special_k_btn}
              placement="bottom"
            >
              <Button
                isIconOnly
                aria-label="Download Special K Installer"
                buttonSize="size-10"
                onClick={handleDownloadSpecialK}
              >
                <Download size={24} />
              </Button>
            </Tooltip>
          </div>

          <div className="flex w-full flex-row items-center gap-2">
            <div className="flex w-full flex-col items-center gap-y-4 px-8 sm:flex-row sm:gap-x-4 sm:gap-y-0 sm:px-0">
              <div className="relative w-full flex-grow">
                <FloatingUnderlineInput
                  label={i18n.dds_to_jpg_height_label || "Image Height"}
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

            <div className="flex w-full flex-col items-center gap-y-4 px-8 sm:flex-row sm:gap-x-4 sm:gap-y-0 sm:px-0">
              <div className="relative w-full flex-grow">
                <FloatingUnderlineInput
                  readOnly
                  label={i18n.dds_to_jpg_width_label || "Image Width (auto-calculated)"}
                  startContent={<MoveHorizontal size={18} />}
                  type="number"
                  value={output_width?.toString() || ""}
                />
              </div>
            </div>
          </div>

          <div className="w-full items-start gap-y-2 sm:flex-row sm:gap-x-2 sm:px-0">
            <label className="flex items-center text-sm font-medium text-gray-800 dark:text-gray-400">
              {i18n.cache_settings || "Cache"}
              <Tooltip
                color={mounted && theme === "light" ? "foreground" : "default"}
                content={i18n.open_cache_folder_btn || "Open Cache Folder"}
              >
                <Button
                  isIconOnly
                  aria-label={i18n.open_cache_folder_btn || "Open Cache Folder"}
                  buttonSize="size-10"
                  onClick={handleOpenCacheFolder}
                >
                  <Folder size={18} />
                </Button>
              </Tooltip>
            </label>
          </div>
        </div>
      </main>
    </div>
  );
}
