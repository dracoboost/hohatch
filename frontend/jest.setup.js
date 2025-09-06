import {jest} from "@jest/globals";
import "@testing-library/jest-dom";
import {TextDecoder, TextEncoder} from "util";

Object.assign(global, {TextDecoder, TextEncoder});

// Mock the global window.pywebview.api object
Object.defineProperty(window, "pywebview", {
  value: {
    api: {
      get_settings: jest.fn(),
      get_language_data: jest.fn(),
      get_image_list: jest.fn(),
      validate_sk_folder: jest.fn(),
      validate_texconv_executable: jest.fn(),
      open_file_dialog: jest.fn(),
      save_settings: jest.fn(),
      download_texconv: jest.fn(),
      download_special_k: jest.fn(),
      convert_single_dds_to_jpg: jest.fn(),
      replace_dds: jest.fn(),
      batch_download_selected_dds_as_jpg: jest.fn(),
      batch_delete_selected_dds_files: jest.fn(),
      notify_settings_changed: jest.fn(),
      frontend_ready: jest.fn(),
      load_url: jest.fn(),
      delete_dds_file: jest.fn(),
      convert_single_dds_to_jpg: jest.fn(),
      convert_dds_for_display: jest.fn(),
      open_dump_folder: jest.fn(),
      open_inject_folder: jest.fn(),
    },
  },
  writable: true,
});

// Mock the sonner library
jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
  },
  Toaster: () => null, // Mock the Toaster component
}));

jest.mock("react-responsive", () => ({
  useMediaQuery: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} />;
  },
}));

jest.mock("@/config/consts", () => ({
  I18N: {
    en: {
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
      invalid_resolution_input:
        "Invalid resolution input. Please enter a positive integer for height.",
      settings_saved: "Settings saved.",
      error: "Error",
      processing: "Processing...",
      replace_conversion_complete: "Replacement complete!",
      delete_success: "Delete successful!",
      special_k_download_success: "Special K downloaded successfully.",
      select_all_btn_tooltip: "Select All",
      unselect_all_btn_tooltip: "Unselect All",
    },
    ja: {
      settings_window_title: "設定",
      back_btn: "戻る",
      language_setting: "言語",
      sk_folder_path_title: "Special Kフォルダパス",
      select_sk_folder: "参照",
      download_sk: "Special Kをダウンロード",
      sk_folder_invalid: "無効: SKIF.exeが見つからないか、パスが存在しません。",
      texconv_path_title: "Texconv実行可能ファイルパス",
      select_texconv_file: "参照",
      texconv_description:
        "Texconvは、Microsoftが提供する画像形式変換用のコマンドラインツールで、特にDDSテクスチャに適しています。",
      download_texconv: "Texconvをダウンロード",
      texconv_download_success: "Texconvが正常にダウンロードされました。",
      texconv_download_fail: "Texconvのダウンロードに失敗しました。",
      texconv_path_invalid: "無効: ファイルが見つからないか、実行可能ではありません。",
      dds_to_jpg_res_setting: "DDSからJPGへの出力解像度",
      dds_to_jpg_height_label: "画像の高さ",
      dds_to_jpg_width_label: "画像の幅 (自動計算)",
      invalid_resolution_input: "無効な解像度入力です。高さには正の整数を入力してください。",
      settings_saved: "設定が保存されました。",
      error: "エラー",
      processing: "処理中...",
      replace_conversion_complete: "置換完了！",
      delete_success: "削除成功！",
      special_k_download_success: "Special Kが正常にダウンロードされました。",
      select_all_btn_tooltip: "すべて選択",
      unselect_all_btn_tooltip: "すべての選択を解除",
    },
  },
}));
