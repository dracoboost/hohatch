import appdirs
import base64
import hashlib
import io
import json
import os
import shutil
from pathlib import Path
from PIL import Image
import requests
import subprocess
import time


DEFAULT_LANG = "en"


def get_special_k_dir():
    return Path(appdirs.user_data_dir("Special K", "Programs"))


def get_config_dir():
    return Path(appdirs.user_data_dir("HoHatch", ""))


def get_config_file():
    return get_config_dir() / "settings.json"


class HoHatchBackend:
    def __init__(self):
        # Initialize with default values
        self.current_lang = DEFAULT_LANG
        self.last_image_dir = Path.cwd()
        self.sk_folder_path = get_special_k_dir()
        self.texconv_executable = get_config_dir() / "texconv.exe"
        self.dds_to_jpg_output_height = 1024
        self.last_active_view = "dump"
        self.theme = "dark"  # Add theme default

        # Ensure config directory exists
        get_config_dir().mkdir(parents=True, exist_ok=True)
        self.cache_dir = get_config_dir() / "cache"
        self.cache_dir.mkdir(exist_ok=True)

        print("[HoHatchBackend.__init__] Initializing...")
        print(f"[HoHatchBackend.__init__] Default sk_folder_path: {self.sk_folder_path}")
        print(f"[HoHatchBackend.__init__] Texconv executable path is fixed to: {self.texconv_executable}")

        # Load settings and update attributes
        loaded_settings = self.load_config()
        self.current_lang = loaded_settings.get("language", DEFAULT_LANG)
        self.last_image_dir = Path(loaded_settings.get("last_image_dir", str(Path.cwd())))
        self.sk_folder_path = Path(loaded_settings.get("special_k_folder_path", str(get_special_k_dir())))
        self.dds_to_jpg_output_height = loaded_settings.get("output_height", 1024)
        self.last_active_view = loaded_settings.get("last_active_view", "dump")
        self.theme = loaded_settings.get("theme", "dark")  # Load theme

        # Auto-download texconv if not found or not executable
        if not (self.texconv_executable.is_file() and os.access(self.texconv_executable, os.X_OK)):
            print(
                f"[HoHatchBackend.__init__] Texconv not found or not executable at {self.texconv_executable}. Attempting to download..."
            )
            download_result = self.download_texconv()
            if download_result["success"]:
                print("[HoHatchBackend.__init__] Texconv downloaded successfully during initialization.")
                self.texconv_executable = Path(download_result["texconv_executable"])
            else:
                print(f"[HoHatchBackend.__init__] Failed to auto-download texconv: {download_result['error']}")
        else:
            # If texconv exists, we still want to make sure the config file is up-to-date
            # in case it had a user-defined path before.
            print("[HoHatchBackend.__init__] Texconv found. Ensuring config is up-to-date.")
            self.save_config({})  # This will re-save with the correct fixed path.

        print(f"[HoHatchBackend.__init__] Loaded sk_folder_path: {self.sk_folder_path}")
        print(f"[HoHatchBackend.__init__] Using texconv_executable: {self.texconv_executable}")

        # Define a dedicated temp directory inside the config directory
        # to avoid deleting settings.json and texconv.exe on startup.
        self.temp_base_dir = get_config_dir() / "temp"
        self.general_tmp_dir = self.temp_base_dir / "dds_convert_temp"
        self.conv_tmp_dir = self.temp_base_dir / "dds_conversion_temp"
        self.thumb_cache_dir = self.temp_base_dir / "dds_compare_cache"

        # Ensure temp directories are clean and exist
        if self.temp_base_dir.exists():
            try:
                shutil.rmtree(self.temp_base_dir, onexc=self._handle_remove_readonly)
            except Exception as e:
                print(f"ERROR: Failed to remove temp_base_dir during init: {e}")
        self.temp_base_dir.mkdir(exist_ok=True, parents=True)
        self.general_tmp_dir.mkdir(exist_ok=True, parents=True)
        self.conv_tmp_dir.mkdir(exist_ok=True, parents=True)
        self.thumb_cache_dir.mkdir(exist_ok=True, parents=True)

        self.allowed_image_extensions = [".jfif", ".jpeg", ".jpg", ".png"]

    def _handle_remove_readonly(self, func, path, exc_info):
        """Error handler for shutil.rmtree. If the error is due to an access error (read-only file)
        it changes the file's permissions and retries.
        For other errors, it re-raises the exception.
        """
        import stat

        if not os.access(path, os.W_OK):
            # Change the file to be writable
            os.chmod(path, stat.S_IWUSR)
            func(path)
        else:
            raise

    def _get_profile_dir(self, sk_path: Path) -> Path | None:
        profiles_path = sk_path / "Profiles"
        if not profiles_path.is_dir():
            return None

        profile_dirs = [d for d in profiles_path.iterdir() if d.is_dir()]
        if len(profile_dirs) == 1:
            return profile_dirs[0]

        # Fallback for specific known name, though the above should be preferred
        specific_profile = profiles_path / "Shadowverse Worlds Beyond"
        if specific_profile.is_dir():
            return specific_profile

        return None

    def load_config(self):
        config_path = get_config_file()
        if config_path.exists():
            try:
                with open(config_path, "r", encoding="utf-8") as f:
                    config = json.load(f)
                # Return the loaded config directly
                return {
                    "language": config.get("language", DEFAULT_LANG),
                    "last_image_dir": str(Path(config.get("last_image_dir", str(Path.cwd())))),
                    "special_k_folder_path": str(
                        Path(
                            config.get(
                                "special_k_folder_path",
                                str(get_special_k_dir()),
                            )
                        )
                    ),
                    "texconv_executable_path": str(Path(config.get("texconv_executable_path", "./texconv.exe"))),
                    "output_height": config.get("output_height", 1024),
                    "last_active_view": config.get("last_active_view", "dump"),
                    "theme": config.get("theme", "dark"),
                }
            except (FileNotFoundError, json.JSONDecodeError) as e:
                print(f"Warning: Error loading configuration file: {e}")
                return {}  # Return empty dict on error
        return {}  # Return empty dict if file not found

    def save_config(self, settings):
        # Ensure settings is a dictionary
        if not isinstance(settings, dict):
            error_msg = f"Invalid settings format: expected a dictionary, but got {type(settings).__name__}"
            print(f"ERROR: {error_msg}")
            return {"success": False, "error": error_msg}

        # Update internal state from provided settings
        self.current_lang = settings.get("language", self.current_lang)
        self.last_image_dir = Path(settings.get("last_image_dir", str(self.last_image_dir)))

        sk_folder_path = settings.get("special_k_folder_path", str(self.sk_folder_path))
        if isinstance(sk_folder_path, list) and sk_folder_path:
            sk_folder_path = sk_folder_path[0]
        self.sk_folder_path = Path(sk_folder_path)

        texconv_executable_path = settings.get("texconv_executable_path", str(self.texconv_executable))
        if isinstance(texconv_executable_path, list) and texconv_executable_path:
            texconv_executable_path = texconv_executable_path[0]
        self.texconv_executable = Path(texconv_executable_path)

        self.dds_to_jpg_output_height = settings.get("imageHeight", self.dds_to_jpg_output_height)
        self.last_active_view = settings.get("last_active_view", self.last_active_view)
        self.theme = settings.get("theme", self.theme)

        config = {
            "language": self.current_lang,
            "last_image_dir": str(self.last_image_dir),
            "special_k_folder_path": str(self.sk_folder_path),
            "texconv_executable_path": str(self.texconv_executable),
            "output_height": self.dds_to_jpg_output_height,
            "last_active_view": self.last_active_view,
            "theme": self.theme,
        }
        try:
            config_file = get_config_file()
            config_file.parent.mkdir(parents=True, exist_ok=True)
            with open(config_file, "w", encoding="utf-8") as f:
                json.dump(config, f, indent=4)
            return {"success": True, "message_key": "settings_saved"}
        except Exception as e:
            print(f"Warning: Error saving configuration file: {e}")
            return {"success": False, "error": str(e)}

    def download_texconv(self):
        self.delete_texconv()  # Delete existing file first
        TEXCONV_URL = "https://github.com/Microsoft/DirectXTex/releases/latest/download/texconv.exe"
        download_path = get_config_dir() / "texconv.exe"
        download_path.parent.mkdir(parents=True, exist_ok=True)

        try:
            session = requests.Session()
            response = session.get(TEXCONV_URL, stream=True, allow_redirects=True)
            response.raise_for_status()

            with open(download_path, "wb") as f:
                for chunk in response.iter_content(chunk_size=8192):
                    f.write(chunk)

            self.texconv_executable = download_path
            self.save_config({"texconv_executable_path": str(download_path)})  # Save updated path
            return {
                "success": True,
                "message": "Texconv downloaded successfully.",
                "texconv_executable": str(download_path),
            }

        except requests.exceptions.RequestException as e:
            return {"success": False, "error": f"Failed to download Texconv: {e}"}
        except Exception as e:
            return {"success": False, "error": f"Failed to download Texconv: {e}"}

    def delete_texconv(self):
        """Deletes the texconv.exe file."""
        texconv_path = get_config_dir() / "texconv.exe"
        if texconv_path.exists():
            try:
                os.remove(texconv_path)
                return {"success": True, "message": "Texconv deleted successfully."}
            except Exception as e:
                return {"success": False, "error": f"Failed to delete texconv: {e}"}
        return {"success": True, "message": "Texconv not found, nothing to delete."}

    def get_language_data(self, lang=None):
        effective_lang = lang or self.current_lang
        return {"language": effective_lang}

    def set_language(self, lang):
        # LANG_DATA is now in the frontend, so we only validate the language here.
        if lang in ["en", "ja"]:
            self.current_lang = lang
            self.save_config({"language": lang})
            return {"success": True, "message_key": "language_set_success", "lang": lang}
        return {"success": False, "error": "Language not supported."}

    def download_special_k(self):
        SPECIAL_K_URL = "https://sk-data.special-k.info/SpecialK.exe"
        download_path = Path("./SpecialK.exe")

        try:
            session = requests.Session()
            response = session.get(SPECIAL_K_URL, stream=True, allow_redirects=True)
            response.raise_for_status()

            with open(download_path, "wb") as f:
                for chunk in response.iter_content(chunk_size=8192):
                    f.write(chunk)

            return {"success": True, "message": "Special K downloaded successfully."}

        except requests.exceptions.RequestException as e:
            return {"success": False, "error": f"Failed to download Special K: {e}"}
        except Exception as e:
            return {"success": False, "error": f"Failed to download Special K: {e}"}

    def _safe_clear_dir(self, dir_path):
        if dir_path.exists():
            for _ in range(5):  # Retry up to 5 times
                try:
                    shutil.rmtree(dir_path)
                    break  # If successful, break the loop
                except (PermissionError, OSError) as e:
                    print(f"Could not remove {dir_path} during cleanup: {e}. Retrying...")
                    time.sleep(0.1)  # Wait before retrying
            else:
                print(f"Failed to remove {dir_path} after multiple retries.")
        dir_path.mkdir(parents=True, exist_ok=True)

    def _get_file_hash(self, file_path):
        sha256_hash = hashlib.sha256()
        with open(file_path, "rb") as f:
            for byte_block in iter(lambda: f.read(4096), b""):
                sha256_hash.update(byte_block)
        return sha256_hash.hexdigest()

    def get_image_list(self, folder_type, use_hash_check=False):
        print(f"[HoHatchBackend.get_image_list] Entering for {folder_type}, use_hash_check={use_hash_check}")
        sk_path = Path(self.sk_folder_path)
        profile_dir = self._get_profile_dir(sk_path)
        if not profile_dir:
            return {"success": False, "error": "Could not find a unique profile directory in Special K/Profiles."}

        if folder_type == 'dump':
            base_path = profile_dir / "SK_Res" / "dump" / "textures"
            is_recursive = True
        elif folder_type == 'inject':
            base_path = profile_dir / "SK_Res" / "inject" / "textures"
            is_recursive = False
        else:
            return {"success": False, "error": "Invalid folder type"}

        if not base_path.is_dir():
            return {"success": True, "images": []}

        glob_pattern = "**/*.dds" if is_recursive else "*.dds"
        dds_files = list(base_path.glob(glob_pattern))

        image_list = []
        for dds_file in dds_files:
            src = None
            cache_filename = self.cache_dir / f"{dds_file.stem}.jpg"
            hash_filename = self.cache_dir / f"{dds_file.stem}.hash"

            cache_exists = cache_filename.exists()
            hash_exists = hash_filename.exists()
            should_use_cache = False

            if cache_exists and hash_exists:
                if use_hash_check:
                    try:
                        stored_hash = hash_filename.read_text(encoding='utf-8')
                        current_hash = self._get_file_hash(dds_file)
                        if stored_hash == current_hash:
                            should_use_cache = True
                    except Exception as e:
                        print(f"Error checking hash for {dds_file}: {e}")
                else:
                    should_use_cache = True

            if should_use_cache:
                try:
                    with open(cache_filename, "rb") as f:
                        img_bytes = f.read()
                    img_str = base64.b64encode(img_bytes).decode("utf-8")
                    src = f"data:image/jpeg;base64,{img_str}"
                except Exception as e:
                    print(f"Could not load cached image {cache_filename}: {e}")
                    src = None

            image_list.append({
                "src": src or "",
                "alt": dds_file.name,
                "path": dds_file.as_posix(),
            })

        key = "dumped_images" if folder_type == 'dump' else 'injected_images'
        return {"success": True, "images": image_list}

    def convert_dds_for_display(self, dds_path_str):
        dds_file = Path(dds_path_str)
        print(f"[HoHatchBackend.convert_dds_for_display] Converting {dds_file}")

        if not dds_file.exists():
            return {"success": False, "error": "DDS file not found"}

        cache_filename = self.cache_dir / f"{dds_file.stem}.jpg"
        hash_filename = self.cache_dir / f"{dds_file.stem}.hash"

        try:
            texconv_path = Path(self.texconv_executable)
            cmd = [
                str(texconv_path.resolve()), "-o", str(self.cache_dir.resolve()),
                str(dds_file.resolve()), "-ft", "jpg", "-y",
            ]
            result = subprocess.run(cmd, capture_output=True, text=True, check=False)

            if result.returncode == 0 and cache_filename.is_file():
                img = Image.open(cache_filename)
                img = img.transpose(Image.FLIP_TOP_BOTTOM)
                img.save(cache_filename, "JPEG")

                current_hash = self._get_file_hash(dds_file)
                with open(hash_filename, "w") as f:
                    f.write(current_hash)

                buffered = io.BytesIO()
                img.save(buffered, format="JPEG")
                img.close()
                img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")
                src = f"data:image/jpeg;base64,{img_str}"

                return {"success": True, "src": src}
            else:
                error_msg = f"Texconv failed for {dds_file.name}. Stderr: {result.stderr.strip()}"
                print(f"ERROR: {error_msg}")
                return {"success": False, "error": error_msg}

        except Exception as e:
            print(f"ERROR: Unexpected issue during display conversion of {dds_file.name}: {e}")
            return {"success": False, "error": str(e)}

    def get_image_counts(self):
        print("[HoHatchBackend.get_image_counts] Entering function.")
        sk_path = Path(self.sk_folder_path)

        profile_dir = self._get_profile_dir(sk_path)
        if not profile_dir:
            return {"success": False, "dump_count": 0, "inject_count": 0}

        dds_dump_root_path = profile_dir / "SK_Res" / "dump" / "textures"
        dds_inject_path = profile_dir / "SK_Res" / "inject" / "textures"

        dump_count = len(list(dds_dump_root_path.rglob("*.dds"))) if dds_dump_root_path.is_dir() else 0
        inject_count = len(list(dds_inject_path.glob("*.dds"))) if dds_inject_path.is_dir() else 0

        return {"success": True, "dump_count": dump_count, "inject_count": inject_count}

    def get_current_settings(self):
        print("[HoHatchBackend.get_current_settings] Getting current settings.")
        return {
            "language": self.current_lang,
            "last_image_dir": str(self.last_image_dir),
            "special_k_folder_path": str(self.sk_folder_path),
            "texconv_executable_path": str(self.texconv_executable),
            "imageHeight": self.dds_to_jpg_output_height,
            "imageWidth": int(self.dds_to_jpg_output_height * (53 / 64)),
            "dump_folder_path": self.get_dump_folder_path(),
            "inject_folder_path": self.get_inject_folder_path(),
            "last_active_view": self.last_active_view,
            "theme": self.theme,
        }

    def get_dump_folder_path(self):
        profile_dir = self._get_profile_dir(self.sk_folder_path)
        if profile_dir:
            return str(profile_dir / "SK_Res" / "dump" / "textures")
        return None

    def get_inject_folder_path(self):
        profile_dir = self._get_profile_dir(self.sk_folder_path)
        if profile_dir:
            return str(profile_dir / "SK_Res" / "inject" / "textures")
        return None

    def open_folder_in_explorer(self, folder_path):
        if folder_path and Path(folder_path).is_dir():
            os.startfile(folder_path)
            return {"success": True}
        return {"success": False, "error": "Folder not found."}

    def download_single_dds_as_jpg(self, dds_file_path_str, output_folder_str):
        if isinstance(output_folder_str, list):
            if not output_folder_str:
                return {"success": False, "error": "Output folder not provided."}
            output_folder_str = output_folder_str[0]

        dds_file_path = Path(dds_file_path_str)
        output_folder = Path(output_folder_str)
        output_path = output_folder / f"{dds_file_path.stem}.jpg"

        target_height = self.dds_to_jpg_output_height
        target_width = int(target_height * (53 / 64))

        current_op_temp_dir = self.conv_tmp_dir / f"jpg_conv_{dds_file_path.stem}"
        self._safe_clear_dir(current_op_temp_dir)

        temp_dds_input_for_texconv = None

        try:
            temp_dds_input_for_texconv = current_op_temp_dir / f"{dds_file_path.stem}.dds"
            with open(dds_file_path, "rb") as src_file:
                with open(temp_dds_input_for_texconv, "wb") as dest_file:
                    dest_file.write(src_file.read())

            cmd = [
                str(self.texconv_executable.resolve()),
                "-o",
                str(output_path.parent.resolve()),
                str(temp_dds_input_for_texconv.resolve()),
                "-ft",
                "jpg",
                "-w",
                str(target_width),
                "-h",
                str(target_height),
                "-r",
            ]

            print(f"DEBUG: Running texconv for single DDS to JPG: {' '.join(cmd)}")
            result = subprocess.run(cmd, capture_output=True, text=True, check=False)
            time.sleep(0.5)  # Increased sleep duration

            if output_path.is_file():
                for i in range(5):
                    try:
                        img = Image.open(output_path)
                        flipped_img = img.transpose(Image.FLIP_TOP_BOTTOM)
                        flipped_img.save(output_path)
                        img.close()
                        break
                    except (IOError, PermissionError) as img_err:
                        print(
                            f"Warning: Could not open/flip converted JPG for verification: {img_err}. Retrying... ({i+1}/5)"
                        )
                        time.sleep(0.5)
                else:
                    return {
                        "success": False,
                        "error": "JPG Conversion Failed: Flipping/Verification failed after multiple retries",
                    }
                return {
                    "success": True,
                    "message": "JPG Conversion Complete!",
                    "output_path": str(output_path),
                }
            else:
                error_msg = f"Texconv failed or no output file. Return code: {result.returncode}. Stderr: {result.stderr.strip()}"
                print(f"Warning: Single DDS to JPG conversion failed: {error_msg}")
                return {"success": False, "error": f"JPG Conversion Failed: {error_msg}"}

        except (IOError, PermissionError, subprocess.CalledProcessError) as e:
            error_msg = f"Issue during single DDS to JPG conversion: {e}"
            print(f"Error: {error_msg}")
            return {"success": False, "error": f"JPG Conversion Failed: {error_msg}"}
        except Exception as e:
            error_msg = f"Unexpected issue during single DDS to JPG conversion: {e}"
            print(f"Error: {error_msg}")
            return {"success": False, "error": f"JPG Conversion Failed: {error_msg}"}

    def replace_dds(self, _dummy_arg, target_dds_path_str, replacement_image_file_str, is_dump_image: bool):
        print("[HoHatchBackend.replace_dds] --- Starting DDS replacement ---")
        print(f"[HoHatchBackend.replace_dds] Target DDS: {target_dds_path_str}")
        print(f"[HoHatchBackend.replace_dds] Replacement Image: {replacement_image_file_str}")
        print(f"[HoHatchBackend.replace_dds] Is Dump Image: {is_dump_image}")

        target_dds_path = Path(target_dds_path_str)
        replacement_image_file = Path(replacement_image_file_str)

        # Define constants for clarity
        RESIZE_DIM = (1024, 1024)
        TARGET_DDS_FORMAT = "BC7_UNORM"
        MIPMAP_LEVELS = "11"

        # Setup a dedicated temporary directory for this operation
        current_op_temp_dir = self.conv_tmp_dir / f"replace_{target_dds_path.stem}_{os.urandom(4).hex()}"
        try:
            self._safe_clear_dir(current_op_temp_dir)
            print(f"[HoHatchBackend.replace_dds] Prepared temporary directory: {current_op_temp_dir}")

            # 1. Process the replacement image: convert, flip, resize
            img = Image.open(replacement_image_file).convert("RGB")
            img = img.transpose(Image.FLIP_TOP_BOTTOM)  # pyright: ignore[reportAttributeAccessIssue]
            img = img.resize(RESIZE_DIM, Image.LANCZOS)  # pyright: ignore[reportAttributeAccessIssue]

            # Save the processed image to a temporary JPG file
            temp_jpg_for_dds_conversion = current_op_temp_dir / f"{replacement_image_file.stem}_processed.jpg"
            img.save(temp_jpg_for_dds_conversion, "JPEG")
            img.close()  # Close the image immediately after saving
            print(f"[HoHatchBackend.replace_dds] Saved processed replacement image to: {temp_jpg_for_dds_conversion}")

            # 2. Convert the processed JPG to DDS using texconv
            # The output DDS file will have the same stem as the input JPG, but with .dds extension
            texconv_output_dds_name = temp_jpg_for_dds_conversion.stem + ".dds"
            texconv_output_dds_path = current_op_temp_dir / texconv_output_dds_name

            texconv_path = Path(self.texconv_executable)
            if not texconv_path.is_absolute():
                texconv_path = Path(__file__).parent.parent / texconv_path

            cmd = [
                str(texconv_path.resolve()),
                "-f",
                TARGET_DDS_FORMAT,
                "-o",
                str(current_op_temp_dir.resolve()),  # Output directory
                str(temp_jpg_for_dds_conversion.resolve()),  # Input file
                "-m",
                MIPMAP_LEVELS,
                "-y",  # Overwrite existing files
            ]
            print(f"[HoHatchBackend.replace_dds] Running texconv command: {' '.join(cmd)}")
            result = subprocess.run(cmd, capture_output=True, text=True, check=False)
            time.sleep(0.5)

            # Always print stdout and stderr for debugging
            if result.stdout:
                print(f"  Texconv stdout: {result.stdout.strip()}")
            if result.stderr:
                print(f"  Texconv stderr: {result.stderr.strip()}")

            if result.returncode != 0:
                error_msg = f"Texconv failed. Return code: {result.returncode}. Stdout: {result.stdout.strip()}. Stderr: {result.stderr.strip()}"
                print(f"[HoHatchBackend.replace_dds] ERROR: {error_msg}")
                raise Exception(error_msg)

            print(f"[HoHatchBackend.replace_dds] Texconv conversion successful. Output: {texconv_output_dds_path}")

            # Rename the newly created DDS file to the target DDS filename
            final_dds_name_in_inject = target_dds_path.name  # e.g., 3F3054A1.dds
            final_dds_path_in_temp = current_op_temp_dir / final_dds_name_in_inject

            # Rename the file
            texconv_output_dds_path.rename(final_dds_path_in_temp)
            print(f"[HoHatchBackend.replace_dds] Renamed temporary DDS to: {final_dds_path_in_temp}")

            # 3. Move the new DDS to the inject folder
            profile_dir = self._get_profile_dir(self.sk_folder_path)
            if not profile_dir:
                error_msg = "Could not find a unique profile directory in Special K/Profiles."
                print(f"[HoHatchBackend.replace_dds] ERROR: {error_msg}")
                raise Exception(error_msg)

            inject_dds_dir_actual = profile_dir / "SK_Res" / "inject" / "textures"
            inject_dds_dir_actual.mkdir(exist_ok=True, parents=True)

            # Use shutil.copy2 and then unlink to handle potential permission issues during move
            final_dds_path_in_inject_folder = inject_dds_dir_actual / final_dds_name_in_inject
            shutil.copy2(str(final_dds_path_in_temp), str(final_dds_path_in_inject_folder))
            final_dds_path_in_temp.unlink(missing_ok=True)  # Clean up temp file
            print(
                f"[HoHatchBackend.replace_dds] Moved converted DDS to inject folder: {final_dds_path_in_inject_folder}"
            )

            # If the original image was from the dump folder, delete it
            if is_dump_image:
                try:
                    os.remove(target_dds_path)
                    print(f"[HoHatchBackend.replace_dds] Deleted original dump DDS: {target_dds_path}")
                except OSError as e:
                    print(
                        f"[HoHatchBackend.replace_dds] WARNING: Could not delete original dump DDS {target_dds_path}: {e}"
                    )

            # 4. Save the last used directory and return success
            self.save_config({"last_image_dir": str(replacement_image_file.parent)})
            return {
                "success": True,
                "message_key": "replace_conversion_complete",
                "output_path": str(final_dds_path_in_inject_folder),
            }

        except (IOError, PermissionError, subprocess.CalledProcessError) as e:
            error_msg = f"Issue during DDS replacement: {e}"
            print(f"[HoHatchBackend.replace_dds] ERROR: {error_msg}")
            return {
                "success": False,
                "error_key": "replace_conversion_failed",
                "error_detail": error_msg,
            }
        except Exception as e:
            error_msg = f"An unexpected error occurred: {e}"
            print(f"[HoHatchBackend.replace_dds] ERROR: {error_msg}")
            return {
                "success": False,
                "error_key": "replace_conversion_failed",
                "error_detail": error_msg,
            }
        finally:
            # Ensure cleanup of the dedicated temporary directory
            if current_op_temp_dir.exists():
                shutil.rmtree(current_op_temp_dir)
            print("[HoHatchBackend.replace_dds] --- DDS replacement finished ---")

    def download_all_dump_as_jpg(self, output_folder_str):
        profile_dir = self._get_profile_dir(self.sk_folder_path)
        if not profile_dir:
            return {"success": False, "error": "Could not find a unique profile directory in Special K/Profiles."}

        dump_dds_path = profile_dir / "SK_Res" / "dump" / "textures"
        output_folder = Path(output_folder_str)

        if not dump_dds_path.is_dir():
            return {"success": False, "error": "Dump DDS directory not found."}

        batch_tmp_dir = self.temp_base_dir / "batch_tmp_dir"
        if batch_tmp_dir.exists():
            shutil.rmtree(batch_tmp_dir)
        batch_tmp_dir.mkdir(parents=True, exist_ok=True)

        try:
            dds_files = list(dump_dds_path.rglob("*.dds"))
            total_files = len(dds_files)
            processed_count = 0

            for dds_file in dds_files:
                processed_count += 1
                # In a real PyWebView app, you might send progress updates back to the frontend
                print(f"Converting {dds_file.name} ({processed_count}/{total_files})...")

                output_jpg_path = output_folder / f"{dds_file.stem}.jpg"

                temp_dds_input_for_texconv = batch_tmp_dir / f"{dds_file.stem}.dds"
                with open(dds_file, "rb") as src_file:
                    with open(temp_dds_input_for_texconv, "wb") as dest_file:
                        dest_file.write(src_file.read())

                cmd = [
                    str(self.texconv_executable.resolve()),
                    "-o",
                    str(output_folder.resolve()),
                    str(temp_dds_input_for_texconv.resolve()),
                    "-ft",
                    "jpg",
                    "-w",
                    str(int(self.dds_to_jpg_output_height * (53 / 64))),
                    "-h",
                    str(self.dds_to_jpg_output_height),
                    "-r",
                ]
                print(f"DEBUG: Running texconv for batch dump JPG: {' '.join(cmd)}")
                result = subprocess.run(cmd, capture_output=True, text=True, check=False)
                time.sleep(0.5)  # Increased sleep duration

                # Always print stdout and stderr for debugging
                if result.stdout:
                    print(f"  Texconv stdout: {result.stdout.strip()}")
                if result.stderr:
                    print(f"  Texconv stderr: {result.stderr.strip()}")

                if output_jpg_path.is_file():
                    try:
                        img = Image.open(output_jpg_path)
                        flipped_img = img.transpose(
                            Image.FLIP_TOP_BOTTOM
                        )  # pyright: ignore[reportAttributeAccessIssue]
                        flipped_img.save(output_jpg_path)
                        img.close()
                        print(
                            f"DEBUG: Successfully converted and flipped {dds_file.name} to JPG: {str(output_jpg_path.resolve())}"
                        )
                    except (IOError, PermissionError) as img_err:
                        print(f"Warning: Could not open/flip converted JPG for {dds_file.name}: {img_err}")
                else:
                    print(
                        f"Warning: Batch DDS to JPG conversion failed (no output file): {str(output_jpg_path.resolve())}"
                    )

                if temp_dds_input_for_texconv.exists():
                    temp_dds_input_for_texconv.unlink(missing_ok=True)

            return {"success": True, "message_key": "batch_dump_jpg_complete"}

        except (IOError, PermissionError, subprocess.CalledProcessError) as e:
            error_msg = f"Issue during batch dump JPG conversion: {e}"
            print(f"Error: {error_msg}")
            return {"success": False, "error_key": "batch_dump_jpg_failed", "error_detail": error_msg}
        except Exception as e:
            error_msg = f"Unexpected issue during batch dump JPG conversion: {e}"
            print(f"Error: {error_msg}")
            return {"success": False, "error_key": "batch_dump_jpg_failed", "error_detail": error_msg}
        finally:
            for _ in range(5):  # Retry up to 5 times
                try:
                    if batch_tmp_dir.exists():
                        shutil.rmtree(batch_tmp_dir, onexc=self._handle_remove_readonly)
                    break  # If successful, break the loop
                except PermissionError as e:
                    print(f"PermissionError during cleanup: {e}. Retrying...")
                    time.sleep(0.1)  # Wait before retrying
                except Exception as e:
                    print(f"Unexpected error during cleanup: {e}")
                    break

    def delete_dds_file(self, dds_path_str):
        try:
            dds_path = Path(dds_path_str)
            if dds_path.exists():
                os.remove(dds_path)
                return {"success": True, "message": "Image deleted successfully."}
            else:
                return {"success": False, "error": "File not found."}
        except Exception as e:
            return {"success": False, "error": f"Failed to delete image: {e}"}

    def batch_delete_selected_dds_files(self, dds_path_list):
        errors = []
        for path_str in dds_path_list:
            result = self.delete_dds_file(path_str)
            if not result["success"]:
                errors.append(f"{path_str}: {result['error']}")
        if errors:
            return {"success": False, "error": f"Failed to delete selected images: {''.join(errors)}"}
        return {"success": True, "message": "Selected images deleted successfully."}

    def batch_download_selected_dds_as_jpg(self, dds_path_list, output_folder_str):
        errors = []
        for path_str in dds_path_list:
            result = self.download_single_dds_as_jpg(path_str, output_folder_str)
            if not result["success"]:
                errors.append(f"{path_str}: {result['error']}")
        if errors:
            return {
                "success": False,
                "error": f"Failed to download selected images: {''.join(errors)}",
            }
        return {"success": True, "message": "Selected images downloaded successfully."}

    def validate_sk_folder(self, sk_folder_path_str):
        if not sk_folder_path_str or not isinstance(sk_folder_path_str, str):
            return {
                "is_valid": False,
                "message": "Invalid Special K Folder. 'SKIF.exe' not found or path does not exist.",
            }
        sk_folder_path = Path(sk_folder_path_str)
        is_valid = sk_folder_path.is_dir() and (sk_folder_path / "SKIF.exe").is_file()
        return {
            "is_valid": is_valid,
            "message": (
                "Valid" if is_valid else "Invalid Special K Folder. 'SKIF.exe' not found or path does not exist."
            ),
        }

    def validate_texconv_executable(self, texconv_path_str):
        if not texconv_path_str or not isinstance(texconv_path_str, str):
            return {
                "is_valid": False,
                "message": "Invalid Texconv 'texconv.exe' path. File not found or not executable.",
            }
        texconv_path = Path(texconv_path_str)
        is_valid = texconv_path.is_file() and os.access(texconv_path, os.X_OK)
        return {
            "is_valid": is_valid,
            "message": "Valid" if is_valid else "Invalid Texconv 'texconv.exe' path. File not found or not executable.",
        }

    def clean_temp_directories(self):
        """Cleans up all temporary directories used by the application."""
        print("[HoHatchBackend.clean_temp_directories] Cleaning temporary directories...")
        try:
            if self.temp_base_dir.exists():
                shutil.rmtree(self.temp_base_dir, onexc=self._handle_remove_readonly)
            self.temp_base_dir.mkdir(exist_ok=True, parents=True)
            self.general_tmp_dir.mkdir(exist_ok=True, parents=True)
            self.conv_tmp_dir.mkdir(exist_ok=True, parents=True)
            self.thumb_cache_dir.mkdir(exist_ok=True, parents=True)
            print("[HoHatchBackend.clean_temp_directories] Temporary directories cleaned successfully.")
            return {"success": True, "message": "Temporary directories cleaned successfully."}
        except Exception as e:
            error_msg = f"Failed to clean temporary directories: {e}"
            print(f"ERROR: [HoHatchBackend.clean_temp_directories] {error_msg}")
            return {"success": False, "error": error_msg}
