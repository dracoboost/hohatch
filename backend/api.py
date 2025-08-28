import webview
from backend_api import HoHatchBackend, get_special_k_dir
from pathlib import Path
import sys


class Api:
    def __init__(self):
        self.backend = HoHatchBackend()
        self.window = None

    def set_window(self, window):
        """Store the window object for later use."""
        self.window = window
        print("[Api.set_window] Window object has been set.")

    def frontend_ready(self, window):
        """Called by the frontend when it's ready to receive data."""
        self.set_window(window)
        print("\n--- [PYTHON LOG] ---")
        print("[Api.frontend_ready] Received notification from frontend and set window object.")
        print(
            "[Api.frontend_ready] The frontend now fetches data using its own useEffect hooks, so no need to push initial data."
        )
        print("--- [PYTHON LOG END] ---\n")

    def load_url(self, url_path):
        """Loads a new URL in the webview."""
        if self.window:
            # Resolve the path to the HTML file within the bundled frontend/dist directory
            # Assuming url_path is like '/settings' or '/'
            html_file_name = "index.html" if url_path == "/" else f"{url_path.lstrip('/')}.html"

            if getattr(sys, "frozen", False):
                # Running in a PyInstaller bundle
                frontend_dist_dir = Path(sys._MEIPASS) / "frontend" / "dist"
            else:
                # Running in a normal Python environment
                frontend_dist_dir = Path(__file__).parent.parent / "frontend" / "dist"

            full_html_path = frontend_dist_dir / html_file_name

            if full_html_path.is_file():
                print(f"[Api.load_url] Loading HTML file: {full_html_path.resolve()}")
                self.window.load_url(str(full_html_path.resolve()))
                return {"success": True}
            else:
                print(f"[Api.load_url] ERROR: HTML file not found at {full_html_path.resolve()}")
                return {"success": False, "error": f"HTML file not found: {url_path}"}
        else:
            print("[Api.load_url] ERROR: Window object not set.")
            return {"success": False, "error": "Window object not set."}

    def test_binding(self):
        print("DEBUG: test_binding called from Python")
        return "Hello from Python. This binding works."

    def get_image_list(self, folder_type, use_hash_check=False):
        print(f"DEBUG: get_image_list called! folder_type: {folder_type}, use_hash_check: {use_hash_check}")
        return self.backend.get_image_list(folder_type, use_hash_check)

    def convert_dds_for_display(self, dds_path):
        print(f"DEBUG: convert_dds_for_display called! dds_path: {dds_path}")
        return self.backend.convert_dds_for_display(dds_path)

    def get_image_counts(self):
        print("DEBUG: get_image_counts called from Python")
        return self.backend.get_image_counts()

    def get_settings(self):
        print("DEBUG: get_settings called from Python")
        return self.backend.get_current_settings()

    def save_settings(self, settings):
        print("DEBUG: save_settings called from Python with settings:", settings)
        # The settings object now includes 'imageHeight'
        return self.backend.save_config(settings)

    def delete_texconv(self):
        print("DEBUG: delete_texconv called from Python")
        return self.backend.delete_texconv()

    def download_texconv(self):
        print("DEBUG: download_texconv called from Python")
        return self.backend.download_texconv()

    def download_special_k(self):
        print("DEBUG: download_special_k called from Python")
        return self.backend.download_special_k()

    def get_language_data(self, lang):
        print(f"DEBUG: get_language_data called from Python for lang: {lang}")
        return self.backend.get_language_data(lang)

    def open_file_dialog(self, dialog_type, options=None):
        options = options or {}
        print(f"DEBUG: open_file_dialog called! type: {dialog_type}, options: {options}")

        if not self.window:
            print("[Api.open_file_dialog] ERROR: Window object not set.")
            return {"success": False, "error": "Window object not set."}

        dialog_map = {
            "file_open": webview.OPEN_DIALOG,
            "file_save": webview.SAVE_DIALOG,
            "folder": webview.FOLDER_DIALOG,
        }

        dialog_mode = dialog_map.get(dialog_type)
        if not dialog_mode:
            return {"success": False, "error": "Invalid dialog type"}

        # Ensure directory is a string
        directory = options.get("directory", self.backend.last_image_dir.as_posix())
        if not isinstance(directory, str):
            print(
                f"[Api.open_file_dialog] WARNING: Invalid type for directory option. Expected str, got {type(directory).__name__}."
            )
            directory = ""

        # Process file_types for webview.create_file_dialog
        processed_file_types = []
        for desc, ext in options.get("file_types", []):
            processed_file_types.append(f"{desc} ({ext})")
        file_types_tuple = tuple(processed_file_types)

        result = self.window.create_file_dialog(
            dialog_mode,
            directory=directory,
            allow_multiple=options.get("multiple", False),
            file_types=file_types_tuple,
        )

        print(f"DEBUG: File dialog result: {result}")
        if result:
            return {"success": True, "files": result if isinstance(result, list) else [result]}
        else:
            return {"success": False, "error": "Dialog cancelled or failed"}

    def select_dump_folder(self):
        """ダンプフォルダ選択"""
        if self.window:
            result = self.window.create_file_dialog(webview.FOLDER_DIALOG)
            return result[0] if result and len(result) > 0 else None
        return None

    def select_output_file(self):
        """出力ファイル選択"""
        if self.window:
            file_types = ("Image Files (*.png;*.jpg)", "All files (*.*)")
            result = self.window.create_file_dialog(webview.SAVE_DIALOG, file_types=file_types)
            return result if result else None
        return None

    def convert_single_dds_to_jpg(self, dds_path, output_folder):
        print(f"DEBUG: convert_single_dds_to_jpg called! dds_path: {dds_path}, output_folder: {output_folder}")
        return self.backend.download_single_dds_as_jpg(dds_path, output_folder)

    def replace_dds(self, target_dds_path, replacement_image_path, is_dump_image):
        # If the replacement path is a list/tuple, extract the first element.
        if isinstance(replacement_image_path, (list, tuple)) and replacement_image_path:
            replacement_image_path = replacement_image_path[0]

        target_path = Path(target_dds_path)
        replacement_path = Path(replacement_image_path)

        if target_path.stem == replacement_path.stem:
            return {
                "success": False,
                "error": "Target and replacement filenames cannot be the same.",
            }

        print(
            f"DEBUG: replace_dds called! target_dds_path: {target_dds_path}, replacement_image_path: {replacement_image_path}"
        )
        return self.backend.replace_dds(None, target_dds_path, replacement_image_path, is_dump_image)

    def batch_convert_dump_to_jpg(self, output_folder):
        print(f"DEBUG: batch_convert_dump_to_jpg called! output_folder: {output_folder}")
        return self.backend.batch_convert_dump_to_jpg(output_folder)

    def batch_download_selected_dds_as_jpg(self, dds_path_list, output_folder):
        print(
            f"DEBUG: batch_download_selected_dds_as_jpg called! dds_path_list: {dds_path_list}, output_folder: {output_folder}"
        )
        return self.backend.batch_download_selected_dds_as_jpg(dds_path_list, output_folder)

    def delete_dds_file(self, dds_path_str):
        print(f"DEBUG: delete_dds_file called! dds_path_str: {dds_path_str}")
        return self.backend.delete_dds_file(dds_path_str)

    def batch_delete_selected_dds_files(self, dds_path_list):
        print(f"DEBUG: batch_delete_selected_dds_files called! dds_path_list: {dds_path_list}")
        return self.backend.batch_delete_selected_dds_files(dds_path_list)

    def open_dump_folder(self):
        print("DEBUG: open_dump_folder called from Python")
        dump_folder_path = self.backend.get_dump_folder_path()
        return self.backend.open_folder_in_explorer(dump_folder_path)

    def open_inject_folder(self):
        print("DEBUG: open_inject_folder called from Python")
        inject_folder_path = self.backend.get_inject_folder_path()
        return self.backend.open_folder_in_explorer(inject_folder_path)

    def get_default_sk_path(self):
        return str(get_special_k_dir())

    def validate_sk_folder(self, path: str):
        print(f"DEBUG: validate_sk_folder called! path: {path}")
        return self.backend.validate_sk_folder(path)

    def validate_texconv_executable(self, path: str):
        print(f"DEBUG: validate_texconv_executable called! path: {path}")
        return self.backend.validate_texconv_executable(path)

    def clean_temp_directories(self):
        print("DEBUG: clean_temp_directories called from Python")
        return self.backend.clean_temp_directories()

    def notify_settings_changed(self):
        """Notifies the frontend that settings have changed, triggering a reload if necessary."""
        print("DEBUG: notify_settings_changed called from Python")
        if self.window:
            # Execute a JavaScript function in the frontend to trigger image reload
            self.window.evaluate_js("window.dispatchEvent(new Event('settingsChanged'));")
            return {"success": True, "message": "Settings change notification sent."}
        return {"success": False, "error": "Window object not set."}
