import {render} from "@testing-library/react";

// Re-export everything
export * from "@testing-library/react";

export const mockLangData = {
  dumped_dds_images: "Dumped DDS Images",
  injected_dds_images: "Injected DDS Images",
  processing: "Processing...",
  conversion_complete: "Conversion Complete!",
  error: "Error",
  settings_btn: "Settings",
  reload_btn: "Reload",
  config_status_invalid: "Config Invalid!",
  batch_dump_jpg_conversion_btn: "Convert All Dumped DDS to JPG",
  no_images: "No images found.",
  no_images_to_convert: "(No images to convert)",
  getting_image_data: "Getting image data",
  convert_to_jpg_btn: "Convert to JPG",
  select_replace_image_btn_initial: "Replace Image",
  batch_dump_jpg_processing: "Converting all Dump DDS to JPG...",
  batch_dump_jpg_complete: "All Dump DDS converted to JPG!",
  batch_dump_jpg_failed: "Batch Dump DDS to JPG conversion failed: ",
  jpg_conversion_complete: "JPG Conversion Complete!",
  jpg_conversion_failed: "JPG Conversion Failed: ",
  replace_conversion_complete: "Replacement complete!",
  replace_conversion_failed: "Replacement Conversion Failed: ",
  replace_tooltip: "Replace DDS",
  download_as_jpg_tooltip: "Download as JPG",
  trash_btn_tooltip: "Delete",
  batch_download_processing: "Downloading selected images...",
};

const AllTheProviders = ({children}: {children: React.ReactNode}) => {
  return <>{children}</>;
};

const customRender = (ui: React.ReactElement, options?: any) =>
  render(ui, {wrapper: AllTheProviders, ...options});

export {customRender as render};
