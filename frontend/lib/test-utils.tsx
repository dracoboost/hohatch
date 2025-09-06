import {render} from "@testing-library/react";

// Re-export everything
export * from "@testing-library/react";

export const mockLangData = {
  dumped_dds_images: "Dumped DDS Images",
  injected_dds_images: "Injected DDS Images",
  processing: "Processing...",
  error: "Error",
  batch_download_processing: "Downloading selected images...",
};

const AllTheProviders = ({children}: {children: React.ReactNode}) => {
  return <>{children}</>;
};

const customRender = (ui: React.ReactElement, options?: any) =>
  render(ui, {wrapper: AllTheProviders, ...options});

export {customRender as render};
