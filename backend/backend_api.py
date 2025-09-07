import logging
import os
import shutil
from pathlib import Path
from typing import Any, Dict, List

from backend.services import (
    ConfigService,
    DownloadService,
    FileService,
    ImageService,
    TexconvService,
)
from backend.exceptions import HoHatchError, FileSystemError


class HoHatchBackend:
    """The main backend facade that orchestrates all services."""

    def __init__(self):
        logging.info("Initializing HoHatchBackend...")
        self.config_service = ConfigService()
        self.file_service = FileService(self.config_service)
        self.download_service = DownloadService(self.config_service)
        self.image_service = ImageService(self.config_service)
        self.texconv_service = TexconvService(self.config_service, self.file_service, self.image_service)
        self.last_image_dir = Path.home()

        settings = self.config_service.get_settings()
        self.temp_base_dir = Path(settings.texconv_executable_path).parent / "temp"
        self.clean_temp_directories()

        self._ensure_texconv_exists()
        logging.info("HoHatchBackend initialized successfully.")

    def _ensure_texconv_exists(self):
        settings = self.config_service.get_settings()
        texconv_path = Path(settings.texconv_executable_path)
        if not (texconv_path.is_file() and os.access(texconv_path, os.X_OK)):
            logging.warning(f"Texconv not found at {texconv_path}. Attempting download.")
            try:
                self.download_service.download_texconv()
                logging.info("Texconv downloaded successfully during initialization.")
            except HoHatchError as e:
                logging.error(f"Failed to auto-download texconv: {e.message}")

    def _handle_error(self, e: Exception, message: str = "An unexpected error occurred."):
        logging.error(f"{message}: {e}")
        return {"success": False, "error": str(e)}

    def save_config(self, settings_dict: Dict[str, Any]):
        try:
            self.config_service.update_settings(settings_dict)
            return {"success": True, "message_key": "settings_saved"}
        except HoHatchError as e:
            return self._handle_error(e, "Error saving configuration")

    def get_current_settings(self) -> Dict[str, Any]:
        settings = self.config_service.get_settings()
        return {
            "language": settings.language,
            "last_image_dir": settings.last_image_dir,
            "special_k_folder_path": settings.special_k_folder_path,
            "texconv_executable_path": settings.texconv_executable_path,
            "output_height": settings.output_height,
            "output_width": settings.output_width,
            "last_active_view": settings.last_active_view,
            "theme": settings.theme,
            "dump_folder_path": self.image_service.get_dump_folder_path(),
            "inject_folder_path": self.image_service.get_inject_folder_path(),
        }

    def download_texconv(self):
        try:
            path = self.download_service.download_texconv()
            return {"success": True, "texconv_executable": path}
        except HoHatchError as e:
            return self._handle_error(e, "Failed to download texconv")

    def download_special_k(self):
        try:
            path = self.download_service.download_special_k()
            return {"success": True, "message": f"Special K downloaded to {path}"}
        except HoHatchError as e:
            return self._handle_error(e, "Failed to download Special K")

    def delete_texconv(self):
        try:
            self.download_service.delete_texconv()
            return {"success": True, "message": "Texconv deleted successfully."}
        except FileSystemError as e:
            return self._handle_error(e, "Failed to delete texconv")

    def delete_dds_file(self, dds_path_str: str):
        try:
            self.file_service.delete_file(dds_path_str)
            return {"success": True}
        except HoHatchError as e:
            return self._handle_error(e, f"Failed to delete {dds_path_str}")

    def batch_delete_selected_dds_files(self, dds_path_list: List[str]):
        try:
            self.file_service.batch_delete_files(dds_path_list)
            return {"success": True}
        except HoHatchError as e:
            return self._handle_error(e, "Failed to delete selected files")

    def open_dump_folder(self):
        try:
            self.file_service.open_folder(self.image_service.get_dump_folder_path())
            return {"success": True}
        except HoHatchError as e:
            return self._handle_error(e, "Failed to open dump folder")

    def open_inject_folder(self):
        try:
            self.file_service.open_folder(self.image_service.get_inject_folder_path())
            return {"success": True}
        except HoHatchError as e:
            return self._handle_error(e, "Failed to open inject folder")

    def get_cache_folder_path(self) -> str:
        return str(self.image_service.cache_dir)

    def open_cache_folder(self):
        try:
            self.file_service.open_folder(self.get_cache_folder_path())
            return {"success": True}
        except HoHatchError as e:
            return self._handle_error(e, "Failed to open cache folder")

    def clean_temp_directories(self):
        try:
            self.file_service.clean_directory(self.temp_base_dir)
            return {"success": True}
        except HoHatchError as e:
            return self._handle_error(e, "Failed to clean temp directories")

    def get_language_data(self, lang=None):
        settings = self.config_service.get_settings()
        effective_lang = lang or settings.language
        return {"language": effective_lang}

    def set_language(self, lang):
        if lang in ["en", "ja"]:
            self.save_config({"language": lang})
            return {"success": True, "message_key": "language_set_success", "lang": lang}
        return {"success": False, "error": "Language not supported."}

    def get_image_list(self, folder_type: str, use_hash_check: bool = False):
        try:
            images = self.image_service.get_image_list(folder_type)
            return {"success": True, "images": [img.__dict__ for img in images]}
        except HoHatchError as e:
            return self._handle_error(e, f"Failed to get image list for {folder_type}")

    def get_image_counts(self):
        try:
            return {"success": True, **self.image_service.get_image_counts()}
        except HoHatchError as e:
            return self._handle_error(e, "Failed to get image counts")

    def convert_dds_for_display(self, dds_path_str: str):
        try:
            src = self.texconv_service.get_displayable_image(dds_path_str)
            return {"success": True, "src": src}
        except HoHatchError as e:
            return self._handle_error(e, f"Failed to convert {dds_path_str} for display")

    def convert_single_dds_to_jpg(self, dds_path: str, output_folder: str):
        try:
            path = self.texconv_service.convert_to_jpg(dds_path, output_folder)
            return {"success": True, "output_path": path}
        except HoHatchError as e:
            return self._handle_error(e, f"Failed to convert {dds_path} to JPG")

    def batch_download_selected_dds_as_jpg(self, dds_path_list: List[str], output_folder: str):
        try:
            for dds_path in dds_path_list:
                self.texconv_service.convert_to_jpg(dds_path, output_folder)
            return {"success": True}
        except HoHatchError as e:
            return self._handle_error(e, "Failed during batch conversion")

    def replace_dds(self, target_dds_path: str, replacement_image_path: str, is_dump_image: bool):
        try:
            # This is a simplified orchestration. A real implementation might have more complex temp dir handling.
            temp_dir = self.temp_base_dir / f"replace_{Path(target_dds_path).stem}"
            self.file_service.clean_directory(temp_dir)

            # In a real scenario, you might process the replacement image first (e.g., resize)
            # For now, we assume it's ready for conversion.

            final_dds = self.texconv_service.convert_to_dds(
                replacement_image_path, str(temp_dir), Path(target_dds_path).name
            )

            inject_folder = self.image_service.get_inject_folder_path()
            if not inject_folder:
                raise FileSystemError("Could not determine inject folder path.")

            final_path = Path(inject_folder) / Path(final_dds).name
            self.file_service.move_file(final_dds, final_path)

            if is_dump_image:
                self.file_service.delete_file(target_dds_path)

            return {"success": True, "output_path": str(final_path)}
        except HoHatchError as e:
            return self._handle_error(e, "Failed to replace DDS file")

    def validate_sk_folder(self, path: str) -> Dict[str, Any]:
        is_valid = Path(path).is_dir() and (Path(path) / "SKIF.exe").is_file()
        return {"is_valid": is_valid}

    def validate_texconv_executable(self, path: str) -> Dict[str, Any]:
        is_valid = Path(path).is_file() and os.access(path, os.X_OK)
        return {"is_valid": is_valid}

    def check_for_updates(self):
        try:
            return self.download_service.check_for_updates()
        except HoHatchError as e:
            return self._handle_error(e, "Failed to check for updates")

    def notify_settings_changed(self):
        # This method is a placeholder for now.
        return {"success": True}

    def get_default_sk_path(self):
        return self.config_service.get_default_sk_path()
