import {act, render, waitFor} from "@testing-library/react";

import SettingsScreen from "@/app/settings/page";

const mockSettings = {
  language: "en",
  last_image_dir: "/mock/path",
  special_k_folder_path: "/mock/sk_path",
  texconv_executable_path: "/mock/texconv.exe",
  output_height: 1024,
  output_width: 874,
};

const mockLangData = {
  settings_window_title: "Settings",
  back_btn: "Back",
  language_setting: "Language",
  sk_folder_path_title: "Special K Folder Path",
  select_sk_folder: "Browse",
  download_special_k_btn: "Download Special K Installer",
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
};

describe("SettingsScreen", () => {
  beforeEach(() => {
    window.pywebview = {
      api: {
        get_settings: jest.fn().mockResolvedValue(mockSettings),
        get_language_data: jest.fn().mockResolvedValue(mockLangData),
        get_image_list: jest.fn().mockResolvedValue({success: true, images: []}), // Added mock
        get_inject_images: jest.fn().mockResolvedValue({success: true, injected_images: []}),
        get_dump_images: jest.fn().mockResolvedValue({success: true, dumped_images: []}),
        validate_sk_folder: jest.fn().mockResolvedValue({isValid: true}),
        validate_texconv_executable: jest.fn().mockResolvedValue({isValid: true}),
        open_file_dialog: jest
          .fn()
          .mockResolvedValueOnce({success: true, files: ["/new/sk/path"]}) // For Special K folder
          .mockResolvedValueOnce({success: true, files: ["/new/texconv.exe"]}), // For Texconv executable
        save_settings: jest.fn().mockResolvedValue({success: true}),
        download_texconv: jest.fn().mockResolvedValue({success: true}),
        download_special_k: jest.fn().mockResolvedValue({success: true}),
        convert_single_dds_to_jpg: jest.fn().mockResolvedValue({success: true}),
        replace_dds: jest.fn().mockResolvedValue({success: true}),
        batch_convert_dump_to_jpg: jest.fn().mockResolvedValue({success: true}),
        batch_download_selected_dds_as_jpg: jest.fn().mockResolvedValue({success: true}),
        convert_dds_for_display: jest.fn().mockResolvedValue({success: true, src: "mock_src"}), // Added mock
        frontend_ready: jest.fn().mockResolvedValue(undefined),
        load_url: jest.fn().mockResolvedValue(undefined),
        open_dump_folder: jest.fn().mockResolvedValue({success: true}),
        open_inject_folder: jest.fn().mockResolvedValue({success: true}),
        delete_dds_file: jest.fn().mockResolvedValue({success: true}),
        batch_delete_selected_dds_files: jest.fn().mockResolvedValue({success: true}),
        get_default_sk_path: jest.fn().mockResolvedValue("/mock/default/sk/path"),
        open_cache_folder: jest.fn().mockResolvedValue({success: true}),
        notify_settings_changed: jest.fn().mockResolvedValue({success: true}),
        get_app_version: jest.fn().mockResolvedValue({success: true, version: "1.0.0"}),
        check_for_updates: jest.fn().mockResolvedValue({success: true, latest_version: "1.0.0"}),
      },
    };
  });

  it("renders without crashing", async () => {
    await act(async () => {
      render(<SettingsScreen />);
    });

    await waitFor(() => {
      expect(window.pywebview.api.get_settings).toHaveBeenCalled();
    });
  });
});
