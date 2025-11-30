import appdirs
import base64
import hashlib
import json
import logging
import os
import shutil
import subprocess
import tempfile
from dataclasses import asdict, fields
from pathlib import Path
from typing import Any, Dict, List

import requests
from PIL import Image

from backend.dto import AppSettings, ImageInfo
from backend.exceptions import ConfigError, DownloadError, FileSystemError, TexconvError


# --- Path Helpers ---
def get_special_k_dir() -> Path:
    return Path(appdirs.user_data_dir("Special K", "Programs"))


def get_config_dir() -> Path:
    return Path(appdirs.user_data_dir("HoHatch", ""))


def get_config_file() -> Path:
    config_dir = get_config_dir()
    config_dir.mkdir(parents=True, exist_ok=True)
    return config_dir / "settings.json"


# --- Service Classes ---
class ConfigService:
    def __init__(self):
        self.settings = self._load_settings()
        logging.info("ConfigService initialized.")

    def _load_settings(self) -> AppSettings:
        config_file = get_config_file()
        if not config_file.exists():
            default = AppSettings(
                special_k_folder_path=str(get_special_k_dir()),
                texconv_executable_path=str(get_config_dir() / "texconv.exe"),
            )
            self.save_settings(default)
            return default
        try:
            with open(config_file, "r", encoding="utf-8") as f:
                return AppSettings(**json.load(f))
        except (json.JSONDecodeError, TypeError) as e:
            raise ConfigError(f"Failed to parse settings.json: {e}")

    def save_settings(self, settings: AppSettings):
        try:
            with open(get_config_file(), "w", encoding="utf-8") as f:
                json.dump(asdict(settings), f, indent=4)
            self.settings = settings
        except (IOError, TypeError) as e:
            raise ConfigError(f"Failed to save settings.json: {e}")

    def get_settings(self) -> AppSettings:
        return self.settings

    def update_settings(self, new_settings: Dict[str, Any]) -> AppSettings:
        # Filter out keys that are not part of AppSettings
        valid_keys = {f.name for f in fields(AppSettings)}
        filtered_new_settings = {k: v for k, v in new_settings.items() if k in valid_keys}

        updated = AppSettings(**{**asdict(self.settings), **filtered_new_settings})
        self.save_settings(updated)
        return updated


class DownloadService:
    TEXCONV_URL = "https://github.com/Microsoft/DirectXTex/releases/latest/download/texconv.exe"
    SPECIAL_K_URL = "https://sk-data.special-k.info/SpecialK.exe"

    def __init__(self, config_service: ConfigService):
        self.config_service = config_service

    def download_texconv(self) -> str:
        path = Path(self.config_service.get_settings().texconv_executable_path)
        path.parent.mkdir(parents=True, exist_ok=True)
        try:
            if path.exists():
                os.remove(path)
            response = requests.get(self.TEXCONV_URL, stream=True, timeout=30)
            response.raise_for_status()
            with open(path, "wb") as f:
                for chunk in response.iter_content(chunk_size=8192):
                    f.write(chunk)
            return str(path)
        except requests.exceptions.RequestException as e:
            raise DownloadError(f"Failed to download Texconv: {e}")

    def download_special_k(self) -> str:
        path = Path("./SpecialK.exe")
        try:
            response = requests.get(self.SPECIAL_K_URL, stream=True, timeout=30)
            response.raise_for_status()
            with open(path, "wb") as f:
                for chunk in response.iter_content(chunk_size=8192):
                    f.write(chunk)
            return str(path)
        except requests.exceptions.RequestException as e:
            raise DownloadError(f"Failed to download Special K: {e}")

    def delete_texconv(self):
        path = Path(self.config_service.get_settings().texconv_executable_path)
        if path.exists():
            try:
                os.remove(path)
            except OSError as e:
                raise FileSystemError(f"Failed to delete texconv.exe: {e}")


class FileService:
    def __init__(self, config_service: ConfigService):
        self.config_service = config_service

    def delete_file(self, file_path_str: str):
        file_path = Path(file_path_str)
        if not file_path.exists():
            raise FileSystemError(f"File not found: {file_path_str}")

        parent_dir = file_path.parent
        txt_file = parent_dir / f"{file_path.stem}.txt"

        if file_path.suffix.lower() == ".dds" and txt_file.is_file() and parent_dir.is_dir():
            target_to_delete = parent_dir
            logging.info(f"Detected DDS-TXT integrated type. Deleting folder: {target_to_delete}")
        else:
            target_to_delete = file_path
            logging.info(f"Detected single DDS type. Deleting file: {target_to_delete}")

        try:
            if target_to_delete.is_dir():
                shutil.rmtree(target_to_delete)
            else:
                os.remove(target_to_delete)
            logging.info(f"Successfully deleted: {target_to_delete}")
        except OSError as e:
            logging.error(f"Failed to delete {target_to_delete}: {e}")
            raise FileSystemError(f"Failed to delete {target_to_delete}: {e}")

    def batch_delete_files(self, file_paths: List[str]):
        errors = []
        for path_str in file_paths:
            try:
                self.delete_file(path_str)
            except FileSystemError as e:
                errors.append(e.message)

        if errors:
            error_message = "Failed to delete one or more files: " + ", ".join(errors)
            logging.error(error_message)
            raise FileSystemError(error_message)

    def open_folder(self, folder_path: str):
        if not os.path.isdir(folder_path):
            raise FileSystemError(f"Folder not found: {folder_path}")
        os.startfile(folder_path)

    def move_file(self, src: str, dest: str):
        try:
            logging.info(f"Moving file from {src} to {dest}")
            shutil.move(src, dest)
            logging.info(f"Successfully moved file to {dest}")
        except (shutil.Error, OSError) as e:
            logging.error(f"Failed to move file from {src} to {dest}: {e}")
            raise FileSystemError(f"Failed to move file: {e}")

    def clean_directory(self, dir_path: Path):
        if dir_path.exists():
            shutil.rmtree(dir_path, onexc=lambda f, p, e: (os.chmod(p, 0o777), f(p)))
        dir_path.mkdir(parents=True, exist_ok=True)

    def get_log_folder_path(self) -> str:
        return str(Path(appdirs.user_data_dir("HoHatch", "")) / "logs")

    def get_file_hash(self, file_path: Path) -> str:
        hash_md5 = hashlib.md5()
        with open(file_path, "rb") as f:
            for chunk in iter(lambda: f.read(4096), b""):
                hash_md5.update(chunk)
        return hash_md5.hexdigest()

    def open_log_folder(self):
        log_dir = self.get_log_folder_path()
        logging.info(f"Opening log folder: {log_dir}")
        self.open_folder(log_dir)


class ImageService:
    def __init__(self, config_service: ConfigService):
        self.config_service = config_service
        self.cache_dir = get_config_dir() / "cache"
        self.dump_cache_dir = self.cache_dir / "dump"
        self.inject_cache_dir = self.cache_dir / "inject"
        self.cache_dir.mkdir(exist_ok=True)
        self.dump_cache_dir.mkdir(exist_ok=True)
        self.inject_cache_dir.mkdir(exist_ok=True)


class ImageDiscoveryService:
    def __init__(self, config_service: ConfigService):
        self.config_service = config_service

    def get_dump_folder_path(self) -> str | None:
        path = self._get_image_dir("dump")
        return str(path) if path else None

    def get_inject_folder_path(self) -> str | None:
        path = self._get_image_dir("inject")
        return str(path) if path else None

    def _get_image_dir(self, folder_type: str) -> Path | None:
        settings = self.config_service.get_settings()
        sk_path = Path(settings.special_k_folder_path)
        profile_dir = self._get_profile_dir(sk_path)
        if not profile_dir:
            return None
        if folder_type == "dump":
            return profile_dir / "SK_Res" / "dump" / "textures" / "ShadowverseWB.exe"
        return profile_dir / "SK_Res" / "inject" / "textures"

    def _get_profile_dir(self, sk_path: Path) -> Path | None:
        profiles = sk_path / "Profiles"
        if not profiles.is_dir():
            return None
        # First, try to find the specific profile for "Shadowverse Worlds Beyond"
        specific_profile = profiles / "Shadowverse Worlds Beyond"
        if specific_profile.is_dir():
            return specific_profile
        # Fallback for legacy or custom naming
        dirs = [d for d in profiles.iterdir() if d.is_dir()]
        return dirs[0] if len(dirs) == 1 else None

    def discover_images(self, folder_type: str) -> List[ImageInfo]:
        base_path_str = self.get_dump_folder_path() if folder_type == "dump" else self.get_inject_folder_path()
        if not base_path_str:
            return []
        base_path = Path(base_path_str)
        pattern = "**/*.dds"
        return [ImageInfo(src="", alt=f.name, path=f.as_posix()) for f in base_path.glob(pattern)]

    def get_image_counts(self) -> Dict[str, int]:
        dump_dir_str = self.get_dump_folder_path()
        inject_dir_str = self.get_inject_folder_path()
        dump_dir = Path(dump_dir_str) if dump_dir_str else None
        inject_dir = Path(inject_dir_str) if inject_dir_str else None
        return {
            "dump_count": len(list(dump_dir.rglob("*.dds"))) if dump_dir and dump_dir.is_dir() else 0,
            "inject_count": len(list(inject_dir.rglob("*.dds"))) if inject_dir and inject_dir.is_dir() else 0,
        }


class TexconvService:
    def __init__(self, config_service: ConfigService, file_service: FileService, image_service: ImageService):
        self.config_service = config_service
        self.file_service = file_service
        self.image_service = image_service

    def _run_texconv(self, args: List[str]):
        settings = self.config_service.get_settings()
        cmd = [str(settings.texconv_executable_path)] + args
        logging.info(f"Running texconv command: {' '.join(cmd)}")
        try:
            result = subprocess.run(cmd, capture_output=True, text=True, check=True, encoding="utf-8", errors="replace")
            logging.info(f"Texconv stdout: {result.stdout}")
            if result.stderr:
                logging.warning(f"Texconv stderr: {result.stderr}")
            return result
        except subprocess.CalledProcessError as e:
            logging.error(f"Texconv execution failed for command: {' '.join(cmd)}")
            logging.error(f"Texconv stdout: {e.stdout}")
            logging.error(f"Texconv stderr: {e.stderr}")
            raise TexconvError(f"Texconv execution failed: {e.stderr}")
        except FileNotFoundError as e:
            logging.error(f"Texconv executable not found at {settings.texconv_executable_path}")
            raise TexconvError(f"Texconv executable not found: {e}")
        except Exception as e:
            logging.error(f"An unexpected error occurred during texconv execution: {e}")
            raise TexconvError(f"An unexpected error occurred during texconv execution: {e}")

    def convert_to_jpg(self, dds_path: str, output_file_path: str) -> str:
        settings = self.config_service.get_settings()
        dds_p, out_p = Path(dds_path), Path(output_file_path)

        with tempfile.TemporaryDirectory() as temp_dir:
            args = [
                "-o",
                str(temp_dir),
                str(dds_p),
                "-ft",
                "jpg",
                "-w",
                str(settings.output_width),
                "-h",
                str(settings.output_height),
                "-r",
                "-y",
            ]
            self._run_texconv(args)

            temp_output_file = Path(temp_dir) / f"{dds_p.stem}.jpg"
            if temp_output_file.is_file():
                out_p.parent.mkdir(parents=True, exist_ok=True)
                shutil.move(str(temp_output_file), str(out_p))
                with Image.open(out_p) as img:
                    img.transpose(Image.FLIP_TOP_BOTTOM).save(out_p)  # type: ignore
                return str(out_p)
            raise TexconvError("Conversion failed: Output file not found in temporary directory.")

    def convert_to_dds(self, jpg_path: str, out_dir: str, new_name: str) -> str:
        # settings = self.config_service.get_settings()
        temp_flipped_path = Path(out_dir) / f"flipped_{Path(jpg_path).name}"
        try:
            with Image.open(jpg_path) as img:
                # Always resize to 1024x1024 for injected DDS images
                resized_img = img.resize((1024, 1024), Image.LANCZOS)  # type: ignore
                resized_img.transpose(Image.FLIP_TOP_BOTTOM).save(temp_flipped_path)  # type: ignore

            args = ["-f", "BC7_UNORM", "-o", out_dir, str(temp_flipped_path), "-m", "11", "-y"]
            self._run_texconv(args)

            created_dds = Path(out_dir) / f"{temp_flipped_path.stem}.dds"
            final_dds = Path(out_dir) / new_name

            if created_dds.is_file():
                created_dds.rename(final_dds)
                return str(final_dds)
            raise TexconvError("Conversion to DDS failed.")
        finally:
            if temp_flipped_path.exists():
                os.remove(temp_flipped_path)

    def get_displayable_image(self, dds_path: str, is_dump_image: bool, base_dir: Path) -> str:
        cache_dir = self.image_service.dump_cache_dir if is_dump_image else self.image_service.inject_cache_dir
        dds_p = Path(dds_path)
        if not dds_p.exists():
            raise FileSystemError(f"DDS file not found: {dds_path}")

        relative_path = dds_p.relative_to(base_dir)
        cache_file = (cache_dir / relative_path).with_suffix(".jpg")
        hash_file = (cache_dir / relative_path).with_suffix(".hash")

        should_recache = True
        if hash_file.exists() and cache_file.exists():
            try:
                current_hash = self.file_service.get_file_hash(dds_p)
                cached_hash = hash_file.read_text(encoding="utf-8")
                if current_hash == cached_hash:
                    should_recache = False
            except (IOError, FileNotFoundError) as e:
                logging.warning(f"Could not read cache or hash file, proceeding to recache: {e}")
                pass

        if should_recache:
            logging.info(f"Recaching display image for {dds_path}")
            cache_file.parent.mkdir(parents=True, exist_ok=True)
            self.convert_to_jpg(dds_path, str(cache_file))
            new_hash = self.file_service.get_file_hash(dds_p)
            try:
                hash_file.write_text(new_hash, encoding="utf-8")
            except IOError as e:
                logging.error(f"Failed to write hash file for {dds_path}: {e}")
        else:
            logging.debug(f"Using existing cache for {dds_path}")

        with open(cache_file, "rb") as f:
            return f"data:image/jpeg;base64,{base64.b64encode(f.read()).decode('utf-8')}"
