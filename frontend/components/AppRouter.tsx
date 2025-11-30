import {CircularProgress} from "@heroui/react";
import React, {useEffect, useState} from "react";
import {Toaster, toast} from "sonner";

interface LangData {
  [key: string]: string;
  special_k_download_success: string;
  jpg_conversion_failed: string;
  replacing_image: string;
  converting_to_jpg: string;
  deleting_image: string;
  batch_deleting_images: string;
  replace_conversion_complete: string;
  replace_conversion_failed: string;
  error: string;
  dumped_dds_images: string;
  injected_dds_images: string;
}

const AppRouter: React.FC = () => {
  const [, setLang] = useState<LangData>({
    special_k_download_success: "",
    jpg_conversion_failed: "",
    replacing_image: "",
    converting_to_jpg: "",
    deleting_image: "",
    batch_deleting_images: "",
    replace_conversion_complete: "",
    replace_conversion_failed: "",
    error: "",
    dumped_dds_images: "",
    injected_dds_images: "",
  });
  const [loading, setLoading] = useState<boolean>(true);

  const loadLangData = async () => {
    try {
      const settings = await window.pywebview.api.get_settings();
      let fetchedLangData: LangData = {
        special_k_download_success: "",
        jpg_conversion_failed: "",
        replacing_image: "",
        converting_to_jpg: "",
        deleting_image: "",
        batch_deleting_images: "",
        replace_conversion_complete: "",
        replace_conversion_failed: "",
        error: "",
        dumped_dds_images: "",
        injected_dds_images: "",
      };

      if (settings) {
        const rawLangData = await window.pywebview.api.get_language_data(settings.language);

        fetchedLangData = {...fetchedLangData, ...rawLangData};
      }
      setLang(fetchedLangData);
    } catch (e: any) {
      toast.error("Failed to load language settings: " + e.message);
    }
  };

  // useEffect(() => {
  //   const initialize = async () => {
  //     await window.pywebview.api.frontend_ready();
  //     await loadLangData();
  //     setLoading(false);
  //   };

  //   initialize();
  // }, []);
  useEffect(() => {
    const onPywebviewReady = async () => {
      await window.pywebview.api.frontend_ready();
      await loadLangData();
      setLoading(false);
    };

    if (window.pywebview) {
      onPywebviewReady();
    } else {
      // Wait event
      window.addEventListener("pywebviewready", onPywebviewReady);
    }

    return () => {
      window.removeEventListener("pywebviewready", onPywebviewReady);
    };
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-300 text-gray-900 dark:bg-gray-900 dark:text-white">
        <CircularProgress aria-label="Loading..." color="primary" />
      </div>
    );
  }

  return (
    <>
      <Toaster position="bottom-right" />
      <div className="App">
        {/* The actual page content will be rendered by Next.js based on the URL */}
      </div>
    </>
  );
};

export default AppRouter;
