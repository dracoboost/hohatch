export interface Settings {
  language: "en" | "ja";
  last_image_dir: string;
  special_k_folder_path: string;
  texconv_executable_path: string;
  imageHeight: number;
  imageWidth: number;
  last_active_view: "dump" | "inject";
  dump_folder_path: string;
  inject_folder_path: string;
  theme: "dark" | "light";
}
