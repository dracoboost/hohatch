import logging
import sys
from pathlib import Path

import webview
import requests

from backend.backend_api import BackendApi


class Api:
    def __init__(self):
        self.backend = BackendApi()
        self.window = None

    def set_window(self, window):
        """Store the window object for later use."""
        self.window = window
        logging.info("Window object has been set.")

    def frontend_ready(self, window):
        """Called by the frontend when it's ready to receive data."""
        self.set_window(window)
        logging.info("Frontend is ready. Initial data fetch will be triggered by frontend.")

    def load_url(self, url_path):
        """Loads a new URL in the webview."""
        if not self.window:
            logging.error("Window object not set, cannot load URL.")
            return {"success": False, "error": "Window object not set."}

        html_file_name = "index.html" if url_path == "/" else f"{url_path.lstrip('/')}.html"

        if getattr(sys, "frozen", False):
            frontend_dist_dir = Path(sys._MEIPASS) / "frontend" / "dist"  # type: ignore
        else:
            frontend_dist_dir = Path(__file__).parent.parent / "frontend" / "dist"

        full_html_path = frontend_dist_dir / html_file_name

        if full_html_path.is_file():
            logging.info(f"Loading HTML file: {full_html_path.resolve()}")
            self.window.load_url(str(full_html_path.resolve()))
            return {"success": True}
        else:
            logging.error(f"HTML file not found at {full_html_path.resolve()}")
            return {"success": False, "error": f"HTML file not found: {url_path}"}

    def get_image_list(self, folder_type, use_hash_check=False):
        logging.debug(f"get_image_list called with type: {folder_type}, hash_check: {use_hash_check}")
        return self.backend.get_image_list(folder_type, use_hash_check)

    def convert_dds_for_display(self, dds_path, is_dump_image):
        logging.debug(f"convert_dds_for_display called for path: {dds_path}")
        return self.backend.convert_dds_for_display(dds_path, is_dump_image)

    def get_image_counts(self):
        logging.debug("get_image_counts called")
        return self.backend.get_image_counts()

    def get_settings(self):
        logging.debug("get_settings called")
        return self.backend.get_current_settings()

    def save_settings(self, settings):
        logging.debug(f"save_settings called with: {settings}")
        return self.backend.save_config(settings)

    def delete_texconv(self):
        logging.debug("delete_texconv called")
        return self.backend.delete_texconv()

    def download_texconv(self):
        logging.debug("download_texconv called")
        return self.backend.download_texconv()

    def download_special_k(self):
        logging.debug("download_special_k called")
        return self.backend.download_special_k()

    def get_language_data(self, lang):
        logging.debug(f"get_language_data called for lang: {lang}")
        return self.backend.get_language_data(lang)

    def open_file_dialog(self, dialog_type, options=None):
        options = options or {}
        logging.debug(f"open_file_dialog called with type: {dialog_type}, options: {options}")

        if not self.window:
            logging.error("Window object not set, cannot open file dialog.")
            return {"success": False, "error": "Window object not set."}

        dialog_map = {
            "file_open": webview.OPEN_DIALOG,
            "file_save": webview.SAVE_DIALOG,
            "folder": webview.FOLDER_DIALOG,
        }
        dialog_mode = dialog_map.get(dialog_type)
        if not dialog_mode:
            return {"success": False, "error": "Invalid dialog type"}

        directory = options.get("directory", self.backend.last_image_dir.as_posix())
        if not isinstance(directory, str):
            logging.warning(f"Invalid type for directory option. Got {type(directory).__name__}, expected str.")
            directory = ""

        file_types_tuple = tuple(f"{desc} ({ext})" for desc, ext in options.get("file_types", []))

        result = self.window.create_file_dialog(
            dialog_mode,
            directory=directory,
            allow_multiple=options.get("multiple", False),
            file_types=file_types_tuple,
        )

        logging.debug(f"File dialog result: {result}")
        if result:
            files = []
            if isinstance(result, str):
                files = [result]
            elif isinstance(result, (list, tuple)):
                files = list(result)

            if files:
                first_result = files[0]
                p = Path(first_result)
                if p.is_dir():
                    self.backend.last_image_dir = p
                else:
                    self.backend.last_image_dir = p.parent

            return {"success": True, "files": files}
        else:
            return {"success": False, "error": "Dialog cancelled or failed"}

    def convert_single_dds_to_jpg(self, dds_path, output_folder):
        logging.debug(f"convert_single_dds_to_jpg called for path: {dds_path}")
        return self.backend.convert_single_dds_to_jpg(dds_path, output_folder)

    def replace_dds(self, target_dds_path, replacement_image_path, is_dump_image):
        if isinstance(replacement_image_path, (list, tuple)) and replacement_image_path:
            replacement_image_path = replacement_image_path[0]

        if Path(target_dds_path).stem == Path(replacement_image_path).stem:
            return {"success": False, "error": "Target and replacement filenames cannot be the same."}

        logging.debug(f"replace_dds called for target: {target_dds_path}")
        return self.backend.replace_dds(target_dds_path, replacement_image_path, is_dump_image)

    def batch_download_selected_dds_as_jpg(self, dds_path_list, output_folder):
        logging.debug("batch_download_selected_dds_as_jpg called")
        return self.backend.batch_download_selected_dds_as_jpg(dds_path_list, output_folder)

    def delete_dds_file(self, dds_path_str):
        logging.debug(f"delete_dds_file called for path: {dds_path_str}")
        return self.backend.delete_dds_file(dds_path_str)

    def batch_delete_selected_dds_files(self, dds_path_list):
        logging.debug("batch_delete_selected_dds_files called")
        return self.backend.batch_delete_selected_dds_files(dds_path_list)

    def open_dump_folder(self):
        logging.debug("open_dump_folder called")
        dump_folder_path = self.backend.get_dump_folder_path()
        if not dump_folder_path:
            return {"success": False, "error": "Dump folder not found"}
        try:
            self.backend.file_service.open_folder(dump_folder_path)
            return {"success": True}
        except Exception as e:
            return {"success": False, "error": str(e)}

    def open_inject_folder(self):
        logging.debug("open_inject_folder called")
        inject_folder_path = self.backend.get_inject_folder_path()
        if not inject_folder_path:
            return {"success": False, "error": "Inject folder not found"}
        try:
            self.backend.file_service.open_folder(inject_folder_path)
            return {"success": True}
        except Exception as e:
            return {"success": False, "error": str(e)}

    def get_default_sk_path(self):
        from backend.services import get_special_k_dir
        logging.debug("get_default_sk_path called")
        return str(get_special_k_dir())

    def validate_sk_folder(self, path: str):
        logging.debug(f"validate_sk_folder called for path: {path}")
        return self.backend.validate_sk_folder(path)

    def validate_texconv_executable(self, path: str):
        logging.debug(f"validate_texconv_executable called for path: {path}")
        return self.backend.validate_texconv_executable(path)

    def clean_temp_directories(self):
        logging.debug("clean_temp_directories called")
        return self.backend.clean_temp_directories()

    def open_cache_folder(self):
        logging.debug("open_cache_folder called")
        return self.backend.open_cache_folder()

    def clear_cache(self):
        logging.debug("clear_cache called")
        return self.backend.clear_cache()

    def open_log_folder(self):
        logging.debug("open_log_folder called")
        return self.backend.open_log_folder()

    def notify_settings_changed(self):
        logging.debug("notify_settings_changed called")
        if self.window:
            self.window.evaluate_js("window.dispatchEvent(new Event('settingsChanged'));")
            return {"success": True, "message": "Settings change notification sent."}
        return {"success": False, "error": "Window object not set."}

    def get_app_version(self):
        logging.debug("get_app_version called")
        # In a real application, this would be read from a version file generated during build
        from backend.version import APP_VERSION

        return {"success": True, "version": APP_VERSION}

    def check_for_updates(self):
        logging.debug("check_for_updates called")
        try:
            from backend.version import APP_VERSION

            response = requests.get("https://api.github.com/repos/dracoboost/hohatch/releases/latest")
            response.raise_for_status()  # Raise an exception for HTTP errors
            latest_release = response.json()
            latest_version = latest_release["tag_name"].lstrip("v")  # Remove 'v' prefix if present

            current_major, current_minor, current_patch = map(int, APP_VERSION.split("."))
            latest_major, latest_minor, latest_patch = map(int, latest_version.split("."))

            update_type = "none"
            if latest_major > current_major:
                update_type = "major"
            elif latest_minor > current_minor:
                update_type = "minor"
            elif latest_patch > current_patch:
                update_type = "patch"

            return {
                "success": True,
                "current_version": APP_VERSION,
                "latest_version": latest_version,
                "update_type": update_type,
            }
        except requests.exceptions.RequestException as e:
            logging.error(f"Error checking for updates: {e}")
            return {"success": False, "error": f"Failed to check for updates: {e}"}
