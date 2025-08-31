import React, {useEffect, useState} from "react";
import {Toaster, toast} from "sonner";

interface LangData {
  [key: string]: string;
  download_sk: string;
  download_texconv: string;
  download_complete: string;
  special_k_download_success: string;
  texconv_download_success: string;
  batch_dump_jpg_processing: string;
  batch_dump_jpg_complete: string;
  jpg_conversion_failed: string;
  processing: string;
  replace_conversion_complete: string;
  replace_conversion_failed: string;
  error: string;
  dumped_dds_images: string;
  injected_dds_images: string;
  no_images: string;
  batch_dump_jpg_conversion_btn: string;
}

const AppRouter: React.FC = () => {
  const [, setLang] = useState<LangData>({
    download_sk: "",
    download_texconv: "",
    download_complete: "",
    special_k_download_success: "",
    texconv_download_success: "",
    batch_dump_jpg_processing: "",
    batch_dump_jpg_complete: "",
    jpg_conversion_failed: "",
    processing: "",
    replace_conversion_complete: "",
    replace_conversion_failed: "",
    error: "",
    dumped_dds_images: "",
    injected_dds_images: "",
    no_images: "",
    batch_dump_jpg_conversion_btn: "",
  });
  const [loading, setLoading] = useState<boolean>(true);

  const loadLangData = async () => {
    try {
      const settings = await window.pywebview.api.get_settings();
      let fetchedLangData: LangData = {
        batch_dump_jpg_processing: "",
        batch_dump_jpg_complete: "",
        jpg_conversion_failed: "",
        processing: "",
        replace_conversion_complete: "",
        replace_conversion_failed: "",
        error: "",
        dumped_dds_images: "",
        injected_dds_images: "",
        no_images: "",
        batch_dump_jpg_conversion_btn: "",
        download_sk: "",
        download_texconv: "",
        download_complete: "",
        special_k_download_success: "",
        texconv_download_success: "",
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

  useEffect(() => {
    const initialize = async () => {
      await window.pywebview.api.frontend_ready();
      await loadLangData();
      setLoading(false);
    };

    initialize();
  }, []);

  // const handleLanguageChange = async () => {
  //   setLoading(true);
  //   await loadLangData();
  //   setLoading(false);
  // };

  if (loading) {
    return <div>Loading...</div>;
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
