import {act, fireEvent, render, screen, waitFor} from "@testing-library/react";
import {toast} from "sonner";

import SettingsScreen from "@/app/settings/page";

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

const mockSettings = {
  language: "en",
  last_image_dir: "/mock/path",
  special_k_folder_path: "/mock/sk_path",
  texconv_executable_path: "/mock/texconv.exe",
  output_height: 1024,
  output_width: 848,
};

const mockLangData = {
  settings_window_title: "Settings",
  back_btn: "Back",
  language_setting: "Language",
  sk_folder_path_title: "Special K Folder Path",
  sk_folder_path_label: "Path",
  select_sk_folder: "Browse",
  download_special_k_btn: "Download Special K Installer",
  special_k_download_success: "Special K downloaded successfully.",
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
  settings_saved: "Settings saved automatically.",
  error: "Error",
  open_cache_folder_btn: "Open Cache Folder",
};

describe("SettingsScreen", () => {
  let mockedApi: any;

  beforeEach(() => {
    mockedApi = {
      get_settings: jest.fn().mockResolvedValue(mockSettings),
      get_language_data: jest.fn().mockResolvedValue(mockLangData),
      get_image_list: jest.fn().mockResolvedValue({success: true, images: []}),
      validate_sk_folder: jest.fn().mockResolvedValue({isValid: true}),
      open_file_dialog: jest.fn().mockResolvedValue({success: true, files: ["/new/sk/path"]}),
      save_settings: jest.fn().mockResolvedValue({success: true}),
      download_special_k: jest.fn().mockResolvedValue({success: true}),
      get_default_sk_path: jest.fn().mockResolvedValue("/mock/default/sk/path"),
      open_cache_folder: jest.fn().mockResolvedValue({success: true}),
      notify_settings_changed: jest.fn().mockResolvedValue({success: true}),
    };
    window.pywebview = {
      api: mockedApi,
    };
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it("renders without crashing and loads initial settings", async () => {
    await act(async () => {
      render(<SettingsScreen />);
    });

    await waitFor(() => {
      expect(mockedApi.get_settings).toHaveBeenCalled();
      const heightInput = screen.getByRole("spinbutton", {name: "Image Height"}); // Assuming a label or aria-label is present
      expect(heightInput).toHaveValue(mockSettings.output_height);
    });
  });

  describe("Language Selection", () => {
    it("should change language to Japanese when tab is clicked and save settings", async () => {
      await act(async () => {
        render(<SettingsScreen />);
      });

      const japaneseTab = screen.getByRole("tab", {name: "Japanese"});
      fireEvent.click(japaneseTab);

      act(() => {
        jest.advanceTimersByTime(500);
      });

      await waitFor(() => {
        expect(mockedApi.save_settings).toHaveBeenCalledWith(
          expect.objectContaining({language: "ja"}),
        );
        expect(mockedApi.notify_settings_changed).toHaveBeenCalled();
      });
    });
  });

  describe("Special K Folder", () => {
    it("should open file dialog and save new path when browse button is clicked", async () => {
      await act(async () => {
        render(<SettingsScreen />);
      });

      const browseButton = screen.getByLabelText("Select Folder");
      fireEvent.click(browseButton);

      await waitFor(() => {
        expect(mockedApi.open_file_dialog).toHaveBeenCalledWith("folder", {
          directory: mockSettings.special_k_folder_path,
        });
      });

      act(() => {
        jest.advanceTimersByTime(500);
      });

      await waitFor(() => {
        expect(mockedApi.save_settings).toHaveBeenCalledWith(
          expect.objectContaining({special_k_folder_path: "/new/sk/path"}),
        );
      });
    });

    it("should handle cancelled file dialog for SK folder", async () => {
      await act(async () => {
        render(<SettingsScreen />);
      });

      const browseButton = screen.getByLabelText("Select Folder");
      mockedApi.open_file_dialog.mockResolvedValueOnce({success: false, files: []});

      fireEvent.click(browseButton);

      await waitFor(() => {
        expect(toast.error).not.toHaveBeenCalled();
      });
    });

    it("should handle failed file dialog for SK folder", async () => {
      await act(async () => {
        render(<SettingsScreen />);
      });

      const browseButton = screen.getByLabelText("Select Folder");
      mockedApi.open_file_dialog.mockImplementationOnce(() =>
        Promise.reject(new Error("Dialog error")),
      );

      fireEvent.click(browseButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith("Failed to open folder dialog: Dialog error");
      });
    });

    it("should update Special K folder path on input change", async () => {
      await act(async () => {
        render(<SettingsScreen />);
      });

      const skPathInput = screen.getByDisplayValue(mockSettings.special_k_folder_path);
      fireEvent.change(skPathInput, {target: {value: "/manual/path"}});

      act(() => {
        jest.advanceTimersByTime(500);
      });

      await waitFor(() => {
        expect(mockedApi.save_settings).toHaveBeenCalledWith(
          expect.objectContaining({special_k_folder_path: "/manual/path"}),
        );
      });
    });

    it("should download Special K when download button is clicked", async () => {
      await act(async () => {
        render(<SettingsScreen />);
      });

      const downloadButton = screen.getByLabelText("Download Special K Installer");
      fireEvent.click(downloadButton);

      await waitFor(() => {
        expect(mockedApi.download_special_k).toHaveBeenCalled();
        expect(toast.success).toHaveBeenCalledWith(mockLangData.special_k_download_success);
      });
    });

    it("should handle failed Special K download", async () => {
      await act(async () => {
        render(<SettingsScreen />);
      });

      const downloadButton = screen.getByLabelText("Download Special K Installer");
      mockedApi.download_special_k.mockImplementationOnce(() =>
        Promise.reject(new Error("Download error")),
      );

      fireEvent.click(downloadButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith("Error: Download error");
      });
    });

    it("should show validation error for invalid SK folder", async () => {
      mockedApi.validate_sk_folder.mockResolvedValueOnce({
        isValid: false,
        message: "Invalid path",
      });

      await act(async () => {
        render(<SettingsScreen />);
      });

      await waitFor(() => {
        expect(screen.getByText("Invalid path")).toBeInTheDocument();
      });
    });
  });

  describe("Image Resolution", () => {
    it("should update width automatically when height is changed and save settings", async () => {
      await act(async () => {
        render(<SettingsScreen />);
      });

      const heightInput = screen.getByRole("spinbutton", {name: "Image Height"});
      fireEvent.change(heightInput, {target: {value: "2048"}});

      await waitFor(() => {
        const widthInput = screen.getByLabelText("Image Width (auto-calculated)");
        expect(widthInput).toHaveValue(1696);
      });

      act(() => {
        jest.advanceTimersByTime(500);
      });

      await waitFor(() => {
        expect(mockedApi.save_settings).toHaveBeenCalledWith(
          expect.objectContaining({output_height: 2048}),
        );
      });
    });
  });

  describe("Cache Folder", () => {
    it("should open cache folder when button is clicked", async () => {
      await act(async () => {
        render(<SettingsScreen />);
      });

      const cacheButton = screen.getByRole("button", {name: "Open Cache Folder"});
      fireEvent.click(cacheButton);

      await waitFor(() => {
        expect(mockedApi.open_cache_folder).toHaveBeenCalled();
      });
    });

    it("should handle failed cache folder opening", async () => {
      await act(async () => {
        render(<SettingsScreen />);
      });

      const cacheButton = screen.getByRole("button", {name: "Open Cache Folder"});
      mockedApi.open_cache_folder.mockResolvedValueOnce({success: false, error: "Failed to open"});

      fireEvent.click(cacheButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith("Failed to open");
      });
    });

    it("should handle save settings failure", async () => {
      mockedApi.save_settings.mockResolvedValueOnce({success: false, error: "Save failed"});

      await act(async () => {
        render(<SettingsScreen />);
      });

      const japaneseTab = screen.getByRole("tab", {name: "Japanese"});
      fireEvent.click(japaneseTab);

      act(() => {
        jest.advanceTimersByTime(500);
      });

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith("Save failed");
      });
    });
  });
});
