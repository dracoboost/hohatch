import {act, fireEvent, render, screen, waitFor, within} from "@testing-library/react";
import {useMediaQuery} from "react-responsive";
import {toast} from "sonner";

import MainScreen from "@/app/page";

jest.mock("../package.json", () => ({
  version: "1.0.0",
}));

jest.mock("sonner", () => {
  const Toaster = () => null; // A dummy component
  Toaster.displayName = "Toaster";

  return {
    Toaster,
    toast: {
      success: jest.fn(),
      error: jest.fn(),
      info: jest.fn(),
      warning: jest.fn(),
    },
  };
});

jest.mock("@/config/consts", () => ({
  get I18N() {
    return {
      en: mockLangData,
      ja: mockLangData,
    };
  },
  appVersion: "1.0.0",
}));

const mockLangData = {
  settings_window_title: "Settings",
  back_btn: "Back",
  language_setting: "Language",
  sk_folder_path_title: "Special K Folder Path",
  select_sk_folder: "Browse",
  download_sk: "Download Special K",
  sk_folder_invalid: "Invalid: SKIF.exe not found or path does not exist.",
  texconv_path_title: "Texconv Executable Path",
  select_texconv_file: "Browse",
  texconv_description:
    "Texconv is a command-line tool by Microsoft for converting image formats, especially DDS textures.",
  download_texconv: "Download Texconv",
  texconv_download_success: "Texconv downloaded successfully.",
  texconv_download_fail: "Failed to download Texconv.",
  texconv_path_invalid: "Invalid: File not found or not executable.",
  dds_to_jpg_res_setting: "DDS to JPG Output Resolution",
  dds_to_jpg_height_label: "Image Height",
  dds_to_jpg_width_label: "Image Width (auto-calculated)",
  invalid_resolution_input: "Invalid resolution input. Please enter a positive integer for height.",
  settings_saved: "Settings saved.",
  error: "Error",
  processing: "Processing...",
  replace_conversion_complete: "Replacement complete!",
  delete_success: "Delete successful!",
  special_k_download_success: "Special K downloaded successfully.",
  dumped_images: "Dumped Images",
  injected_images: "Injected Images",
  no_dump_images: "No dumped images found.",
  no_inject_images: "No injected images found.",
  batch_dump_jpg_complete: "Conversion complete!",
  batch_delete_success: "Batch delete successful.",
  download_complete: "Download complete!",
  downloading_selected_images: "Downloading selected images...",
  dump_folder: "Open Dump Folder",
  inject_folder: "Open Inject Folder",
  reload_btn: "Reload",
};

const mockSettings = {
  language: "en",
  last_image_dir: "/mock/path",
  special_k_folder_path: "/mock/sk_path",
  texconv_executable_path: "/mock/texconv.exe",
  output_height: 1024,
  output_width: 874,
};

const mockDumpedImages = [
  {
    src: "",
    alt: "dumped_image_1.dds",
    path: "/dump/dumped_image_1.dds",
    width: 100,
    height: 100,
  },
  {
    src: "",
    alt: "dumped_image_2.dds",
    path: "/dump/dumped_image_2.dds",
    width: 100,
    height: 100,
  },
];

const mockInjectedImages = [
  {
    src: "",
    alt: "injected_image_1.dds",
    path: "/inject/injected_image_1.dds",
    width: 100,
    height: 100,
  },
];

describe("MainScreen", () => {
  let mockedApi: any;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    // Mock window.pywebview directly and assign to mockedApi
    mockedApi = {
      get_settings: jest.fn().mockResolvedValue(mockSettings),
      get_language_data: jest.fn().mockResolvedValue(mockLangData),
      get_image_list: jest
        .fn()
        .mockImplementation(async (folderType: string, _use_hash_check: boolean) => {
          if (folderType === "dump") {
            return Promise.resolve({
              success: true,
              images: mockDumpedImages,
            });
          }
          if (folderType === "inject") {
            return Promise.resolve({
              success: true,
              images: mockInjectedImages,
            });
          }
          return Promise.resolve({success: false, error: "Invalid folder type"});
        }),
      open_file_dialog: jest.fn().mockResolvedValue({
        success: true,
        files: ["/mock/selected/file.jpg"],
      }),
      save_settings: jest.fn().mockResolvedValue({success: true}),
      replace_dds: jest.fn().mockResolvedValue({
        success: true,
        message: "Replacement complete!",
      }),
      convert_single_dds_to_jpg: jest.fn().mockResolvedValue({
        success: true,
        message: "Conversion complete!",
      }),
      batch_download_selected_dds_as_jpg: jest.fn().mockResolvedValue({success: true}),
      open_dump_folder: jest.fn().mockResolvedValue({success: true}),
      open_inject_folder: jest.fn().mockResolvedValue({success: true}),
      delete_dds_file: jest.fn().mockResolvedValue({success: true}),
      batch_delete_selected_dds_files: jest.fn().mockResolvedValue({success: true}),
      check_for_updates: jest.fn().mockResolvedValue({success: true, latest_version: "1.0.0"}),
      convert_dds_for_display: jest.fn().mockImplementation(async (imagePath: string) => {
        return Promise.resolve({
          success: true,
          src: `data:image/png;base64,MOCK_DATA_FOR_${imagePath.replace(/[^a-zA-Z0-9]/g, "_")}`,
        });
      }),
    };
    window.pywebview = {
      api: mockedApi,
    };

    // Mock react-responsive
    (useMediaQuery as jest.Mock).mockImplementation((settings) => {
      if (settings.minWidth === 1024) return true;
      if (settings.minWidth === 768) return true;
      return false;
    });

    // Mock window.addEventListener for pywebviewready
    window.addEventListener = jest.fn((event, callback) => {
      if (event === "pywebviewready") {
        (callback as () => void)();
      }
    });
    window.removeEventListener = jest.fn();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    consoleErrorSpy.mockRestore();
  });

  it("renders MainScreen component and loads data successfully", async () => {
    await act(async () => {
      render(<MainScreen />);
    });

    await waitFor(() => {
      expect(screen.getByText("Dumped Images")).toBeInTheDocument();
      expect(
        within(screen.getByRole("tab", {name: /dumped images/i})).getByText("2"),
      ).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText("Injected Images")).toBeInTheDocument();
      expect(
        within(screen.getByRole("tab", {name: /injected images/i})).getByText("1"),
      ).toBeInTheDocument();
    });
  });

  describe("handleReplace", () => {
    it("should successfully replace a DDS image", async () => {
      await act(async () => {
        render(<MainScreen />);
      });

      await waitFor(() => {
        expect(screen.getByAltText("dumped_image_1.dds")).toBeInTheDocument();
      });

      const imageCardCheckbox = screen.getByRole("checkbox", {
        name: "dumped_image_1.dds dumped_image_1",
      });

      const imageCardLabel = imageCardCheckbox.parentElement as HTMLElement;

      const replaceButton = within(imageCardLabel).getByRole("button", {name: "Replace DDS"});
      await act(async () => {
        fireEvent.click(replaceButton);
      });

      await waitFor(() => {
        expect(toast.info).toHaveBeenCalledWith(mockLangData.processing);
      });

      await waitFor(() => {
        expect(mockedApi.open_file_dialog).toHaveBeenCalledWith("file_open", {
          file_types: [["Image files", "*.jpg"]],
        });
        expect(mockedApi.replace_dds).toHaveBeenCalledWith(
          "/dump/dumped_image_1.dds",
          "/mock/selected/file.jpg",
          true,
        );
        expect(toast.success).toHaveBeenCalledWith(mockLangData.replace_conversion_complete);
      });
    });

    it("should handle cancelled replacement image selection", async () => {
      await act(async () => {
        render(<MainScreen />);
      });

      const imageCardCheckbox = screen.getByRole("checkbox", {
        name: "dumped_image_1.dds dumped_image_1",
      });
      const imageCardLabel = imageCardCheckbox.parentElement as HTMLElement;
      const replaceButton = within(imageCardLabel).getByRole("button", {name: "Replace DDS"});

      mockedApi.open_file_dialog.mockResolvedValueOnce({success: false});

      await act(async () => {
        fireEvent.click(replaceButton);
      });

      await waitFor(() => {
        expect(toast.warning).toHaveBeenCalledWith("Replacement image selection cancelled.");
      });
    });

    it("should handle failed DDS replacement", async () => {
      await act(async () => {
        render(<MainScreen />);
      });

      const imageCardCheckbox = screen.getByRole("checkbox", {
        name: "dumped_image_1.dds dumped_image_1",
      });
      const imageCardLabel = imageCardCheckbox.parentElement as HTMLElement;
      const replaceButton = within(imageCardLabel).getByRole("button", {name: "Replace DDS"});

      mockedApi.open_file_dialog.mockResolvedValueOnce({
        success: true,
        files: ["/mock/selected/file.jpg"],
      });
      mockedApi.replace_dds.mockResolvedValueOnce({success: false, error: "Replacement failed!"});

      await act(async () => {
        fireEvent.click(replaceButton);
      });

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith("Replacement failed!");
      });
    });
  });

  describe("handleTrash", () => {
    it("should successfully delete a DDS image", async () => {
      await act(async () => {
        render(<MainScreen />);
      });

      await waitFor(() => {
        expect(screen.getByAltText("dumped_image_1.dds")).toBeInTheDocument();
      });

      const imageCardCheckbox = screen.getByRole("checkbox", {
        name: "dumped_image_1.dds dumped_image_1",
      });
      const imageCardLabel = imageCardCheckbox.parentElement as HTMLElement;

      const trashButton = within(imageCardLabel).getByRole("button", {name: "Trash"});

      mockedApi.delete_dds_file.mockResolvedValueOnce({
        success: true,
        message: "Delete successful!",
      });

      await act(async () => {
        fireEvent.click(trashButton);
      });

      await waitFor(() => {
        expect(toast.info).toHaveBeenCalledWith(mockLangData.processing);
      });

      await waitFor(() => {
        expect(mockedApi.delete_dds_file).toHaveBeenCalledWith("/dump/dumped_image_1.dds");
        expect(toast.success).toHaveBeenCalledWith(mockLangData.delete_success);
      });
    });

    it("should handle failed DDS deletion", async () => {
      await act(async () => {
        render(<MainScreen />);
      });

      const imageCardCheckbox = screen.getByRole("checkbox", {
        name: "dumped_image_1.dds dumped_image_1",
      });
      const imageCardLabel = imageCardCheckbox.parentElement as HTMLElement;
      const trashButton = within(imageCardLabel).getByRole("button", {name: "Trash"});

      mockedApi.delete_dds_file.mockResolvedValueOnce({success: false, error: "Deletion failed!"});

      await act(async () => {
        fireEvent.click(trashButton);
      });

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith("Deletion failed!");
      });
    });
  });

  describe("handleBatchTrash", () => {
    it("should successfully delete selected DDS images", async () => {
      await act(async () => {
        render(<MainScreen />);
      });

      await waitFor(() => {
        expect(screen.getByAltText("dumped_image_1.dds")).toBeInTheDocument();
        expect(screen.getByAltText("dumped_image_2.dds")).toBeInTheDocument();
      });

      await act(async () => {
        fireEvent.click(screen.getByDisplayValue("/dump/dumped_image_1.dds"));
      });
      await act(async () => {
        fireEvent.click(screen.getByDisplayValue("/dump/dumped_image_2.dds"));
      });

      mockedApi.batch_delete_selected_dds_files.mockResolvedValueOnce({
        success: true,
        message: "Batch delete successful.",
      });

      const trashButton = screen.getByTestId("batch-trash-button");
      await act(async () => {
        fireEvent.click(trashButton);
      });

      await waitFor(() => {
        expect(toast.info).toHaveBeenCalledWith(mockLangData.processing);
      });

      await waitFor(() => {
        expect(mockedApi.batch_delete_selected_dds_files).toHaveBeenCalledWith([
          "/dump/dumped_image_1.dds",
          "/dump/dumped_image_2.dds",
        ]);
        expect(toast.success).toHaveBeenCalledWith("Batch delete successful.");
      });
    });
  });

  describe("handleBatchDownload", () => {
    it("should successfully download selected DDS images", async () => {
      await act(async () => {
        render(<MainScreen />);
      });

      await waitFor(() => {
        expect(screen.getByAltText("dumped_image_1.dds")).toBeInTheDocument();
        expect(screen.getByAltText("dumped_image_2.dds")).toBeInTheDocument();
      });

      await act(async () => {
        fireEvent.click(screen.getByDisplayValue("/dump/dumped_image_1.dds"));
      });
      await act(async () => {
        fireEvent.click(screen.getByDisplayValue("/dump/dumped_image_2.dds"));
      });

      mockedApi.open_file_dialog.mockResolvedValueOnce({
        success: true,
        files: ["/mock/output/folder"],
      });

      mockedApi.batch_download_selected_dds_as_jpg.mockResolvedValueOnce({
        success: true,
        message: "Download complete!",
      });

      const downloadButton = screen.getByTestId("batch-download-button");
      await act(async () => {
        fireEvent.click(downloadButton);
      });

      await waitFor(() => {
        expect(toast.info).toHaveBeenCalledWith(mockLangData.downloading_selected_images);
      });

      await waitFor(() => {
        expect(mockedApi.open_file_dialog).toHaveBeenCalledWith("folder");
        expect(mockedApi.batch_download_selected_dds_as_jpg).toHaveBeenCalledWith(
          ["/dump/dumped_image_1.dds", "/dump/dumped_image_2.dds"],
          "/mock/output/folder",
        );
        expect(toast.success).toHaveBeenCalledWith("Download complete!");
      });
    });

    it("should handle cancelled single DDS download", async () => {
      await act(async () => {
        render(<MainScreen />);
      });

      const imageCardCheckbox = screen.getByRole("checkbox", {
        name: "dumped_image_1.dds dumped_image_1",
      });
      const imageCardLabel = imageCardCheckbox.parentElement as HTMLElement;
      const downloadButton = within(imageCardLabel).getByRole("button", {name: "Convert to JPG"});

      mockedApi.open_file_dialog.mockResolvedValueOnce({success: false});

      await act(async () => {
        fireEvent.click(downloadButton);
      });

      await waitFor(() => {
        expect(toast.warning).not.toHaveBeenCalledWith("Replacement image selection cancelled.");
      });
    });

    it("should handle failed single DDS conversion", async () => {
      await act(async () => {
        render(<MainScreen />);
      });

      const imageCardCheckbox = screen.getByRole("checkbox", {
        name: "dumped_image_1.dds dumped_image_1",
      });
      const imageCardLabel = imageCardCheckbox.parentElement as HTMLElement;
      const downloadButton = within(imageCardLabel).getByRole("button", {name: "Convert to JPG"});

      mockedApi.open_file_dialog.mockResolvedValueOnce({
        success: true,
        files: ["/mock/output/folder"],
      });
      mockedApi.convert_single_dds_to_jpg.mockResolvedValueOnce({
        success: false,
        error: "Conversion failed!",
      });

      await act(async () => {
        fireEvent.click(downloadButton);
      });

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith("Conversion failed!");
      });
    });

    it("should handle failed batch download", async () => {
      await act(async () => {
        render(<MainScreen />);
      });

      await act(async () => {
        fireEvent.click(screen.getByDisplayValue("/dump/dumped_image_1.dds"));
      });

      mockedApi.open_file_dialog.mockResolvedValueOnce({
        success: true,
        files: ["/mock/output/folder"],
      });
      mockedApi.batch_download_selected_dds_as_jpg.mockResolvedValueOnce({
        success: false,
        error: "Batch download failed",
      });

      const downloadButton = screen.getByTestId("batch-download-button");
      await act(async () => {
        fireEvent.click(downloadButton);
      });

      await waitFor(() => {
        expect(mockedApi.batch_download_selected_dds_as_jpg).toHaveBeenCalled();
        expect(toast.error).toHaveBeenCalledWith("Batch download failed");
      });
    });
  });

  describe("Folder Buttons", () => {
    it("should open dump folder when button is clicked", async () => {
      await act(async () => {
        render(<MainScreen />);
      });

      const dumpFolderButton = screen.getByLabelText("Open Dump Folder");
      await act(async () => {
        fireEvent.click(dumpFolderButton);
      });

      await waitFor(() => {
        expect(mockedApi.open_dump_folder).toHaveBeenCalled();
      });
    });

    it("should open inject folder when button is clicked", async () => {
      await act(async () => {
        render(<MainScreen />);
      });

      await waitFor(() => {
        expect(screen.getByText(/Injected Images/i)).toBeInTheDocument();
      });

      const injectViewButton = screen.getByText(/Injected Images/i);
      await act(async () => {
        fireEvent.click(injectViewButton);
      });

      await waitFor(() => {
        expect(screen.getByLabelText("Open Inject Folder")).toBeInTheDocument();
      });

      const injectFolderButton = screen.getByLabelText("Open Inject Folder");
      await act(async () => {
        fireEvent.click(injectFolderButton);
      });

      await waitFor(() => {
        expect(mockedApi.open_inject_folder).toHaveBeenCalled();
      });
    });
  });

  describe("Reload Button", () => {
    it("should reload images when reload button is clicked", async () => {
      await act(async () => {
        render(<MainScreen />);
      });

      await waitFor(() => {
        expect(mockedApi.get_image_list).toHaveBeenCalledWith("dump", false);
        expect(mockedApi.get_image_list).toHaveBeenCalledWith("inject", false);
      });

      mockedApi.get_image_list.mockClear();

      const reloadButton = screen.getByLabelText("Reload");
      await act(async () => {
        fireEvent.click(reloadButton);
      });

      await waitFor(() => {
        expect(mockedApi.get_image_list).toHaveBeenCalledWith("dump", true);
        expect(mockedApi.get_image_list).toHaveBeenCalledWith("inject", true);
      });
    });

    it("should handle failed image list loading", async () => {
      mockedApi.get_image_list.mockResolvedValueOnce({
        success: false,
        error: "Failed to load images",
      });

      await act(async () => {
        render(<MainScreen />);
      });

      await waitFor(() => {
        expect(mockedApi.get_image_list).toHaveBeenCalled();
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          "Failed to load dump images:",
          "Failed to load images",
        );
      });
    });
  });

  describe("Update Notifications", () => {
    it("should show notification for new version", async () => {
      mockedApi.check_for_updates.mockResolvedValueOnce({
        success: true,
        latest_version: "1.0.1",
      });

      await act(async () => {
        render(<MainScreen />);
      });

      act(() => {
        jest.advanceTimersByTime(5000);
      });

      await waitFor(() => {
        expect(toast.info).toHaveBeenCalled();
      });
    });

    it("should show notification for dev version", async () => {
      mockedApi.check_for_updates.mockResolvedValueOnce({
        success: true,
        latest_version: "0.9.0",
      });

      await act(async () => {
        render(<MainScreen />);
      });

      act(() => {
        jest.advanceTimersByTime(5000);
      });

      await waitFor(() => {
        expect(toast.info).toHaveBeenCalled();
      });
    });

    it("should not show notification if versions are same", async () => {
      await act(async () => {
        render(<MainScreen />);
      });

      act(() => {
        jest.advanceTimersByTime(5000);
      });

      await waitFor(() => {
        expect(toast.info).not.toHaveBeenCalled();
      });
    });
  });
});
