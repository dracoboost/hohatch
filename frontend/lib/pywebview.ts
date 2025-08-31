import {Settings} from "@/lib/types";

declare global {
  interface Window {
    pywebview: {
      api: {
        get_settings: () => Promise<Settings>;
        get_language_data: (lang: string) => Promise<any>;
        get_image_list: (folderType: string, use_hash_check?: boolean) => Promise<any>; // Added
        get_inject_images: (reload?: boolean) => Promise<any>;
        get_dump_images: (reload?: boolean) => Promise<any>;
        validate_sk_folder: (path: string) => Promise<any>;
        validate_texconv_executable: (path: string) => Promise<any>;
        open_file_dialog: (dialog_type: string, options?: any) => Promise<any>;
        save_settings: (settings: Partial<Settings>) => Promise<any>;
        download_texconv: () => Promise<any>;
        download_special_k: () => Promise<any>;
        convert_single_dds_to_jpg: (dds_path: string, output_folder: string) => Promise<any>;
        replace_dds: (
          target_dds_path: string,
          replacement_image_path: string,
          is_dump_image: boolean,
        ) => Promise<any>;
        batch_convert_dump_to_jpg: (output_folder: string) => Promise<any>;
        batch_download_selected_dds_as_jpg: (
          dds_path_list: string[],
          output_folder: string,
        ) => Promise<any>;
        convert_dds_for_display: (dds_path: string) => Promise<any>; // Added
        frontend_ready: () => Promise<void>;
        load_url: (url: string) => Promise<any>;
        open_dump_folder: () => Promise<any>;
        open_inject_folder: () => Promise<any>;
        delete_dds_file: (dds_path: string) => Promise<any>;
        batch_delete_selected_dds_files: (dds_path_list: string[]) => Promise<any>;
        get_default_sk_path: () => Promise<string>;
        open_cache_folder: () => Promise<any>;
        notify_settings_changed: () => Promise<any>;
        get_app_version: () => Promise<{success: boolean; version?: string; error?: string}>;
        check_for_updates: () => Promise<{
          success: boolean;
          latest_version?: string;
          error?: string;
        }>;
      };
    };
  }
}
