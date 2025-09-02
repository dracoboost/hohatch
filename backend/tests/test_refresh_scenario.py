import pytest
import os
import shutil
import tempfile
from pathlib import Path
from unittest.mock import patch, MagicMock
import time

from backend.backend_api import HoHatchBackend
from backend.dto import ImageInfo


@pytest.fixture
def backend_instance():
    with tempfile.TemporaryDirectory() as tmpdir:
        original_appdata = os.environ.get("LOCALAPPDATA")
        os.environ["LOCALAPPDATA"] = tmpdir

        # Mock services that HoHatchBackend uses
        with patch("backend.backend_api.ConfigService") as MockConfigService, \
             patch("backend.backend_api.DownloadService") as MockDownloadService, \
             patch("backend.backend_api.FileService") as MockFileService, \
             patch("backend.backend_api.ImageService") as MockImageService, \
             patch("backend.backend_api.TexconvService") as MockTexconvService, \
             patch("backend.backend_api.HoHatchBackend._ensure_texconv_exists") as mock_ensure_texconv_exists:

            # Prevent auto-download during init
            mock_ensure_texconv_exists.return_value = None

            # Setup mock instances for each service
            mock_config_service = MockConfigService.return_value
            mock_download_service = MockDownloadService.return_value
            mock_file_service = MockFileService.return_value
            mock_image_service = MockImageService.return_value
            mock_texconv_service = MockTexconvService.return_value

            # Mock config settings for paths
            mock_settings = MagicMock()
            mock_settings.special_k_folder_path = str(Path(tmpdir) / "Special K")
            mock_settings.texconv_executable_path = str(Path(tmpdir) / "texconv.exe")
            mock_settings.last_image_dir = str(Path(tmpdir))
            mock_config_service.get_settings.return_value = mock_settings

            # Create dummy texconv.exe
            dummy_texconv_path = Path(tmpdir) / "texconv.exe"
            dummy_texconv_path.touch()

            # Create dummy Special K folder structure
            dummy_sk_folder = Path(tmpdir) / "Special K"
            (dummy_sk_folder).mkdir(parents=True, exist_ok=True)
            (dummy_sk_folder / "SKIF.exe").touch()
            (dummy_sk_folder / "Profiles" / "Shadowverse Worlds Beyond" / "SK_Res" / "dump" / "textures").mkdir(
                parents=True, exist_ok=True
            )
            (dummy_sk_folder / "Profiles" / "Shadowverse Worlds Beyond" / "SK_Res" / "inject" / "textures").mkdir(
                parents=True, exist_ok=True
            )

            backend = HoHatchBackend()
            backend.temp_base_dir.mkdir(parents=True, exist_ok=True) # Ensure temp_base_dir exists

            # Attach mocks to the instance for easy access in tests
            backend.mock_config_service = mock_config_service
            backend.mock_download_service = mock_download_service
            backend.mock_file_service = mock_file_service
            backend.mock_image_service = mock_image_service
            backend.mock_texconv_service = mock_texconv_service

            yield backend

        # Clean up environment variable
        if original_appdata is None:
            del os.environ["LOCALAPPDATA"]
        else:
            os.environ["LOCALAPPDATA"] = original_appdata


def test_reload_scenario_no_permission_error(backend_instance):
    # Mock image_service.get_image_list to return dummy images
    backend_instance.mock_image_service.get_image_list.side_effect = [
        [ImageInfo(src="", alt="dump1.dds", path="/path/to/dump1.dds")],
        [ImageInfo(src="", alt="inject1.dds", path="/path/to/inject1.dds")],
    ] * 5 # Simulate 5 reloads

    # Mock texconv_service.get_displayable_image to return a dummy src
    backend_instance.mock_texconv_service.get_displayable_image.return_value = "data:image/jpeg;base64,dummy"

    # Simulate multiple reload operations
    num_reloads = 5
    for i in range(num_reloads):
        print(f"--- Simulating reload {i+1}/{num_reloads} ---")
        try:
            dump_images = backend_instance.get_image_list("dump")["images"]
            inject_images = backend_instance.get_image_list("inject")["images"]

            for img in dump_images:
                backend_instance.convert_dds_for_display(img["path"])
            for img in inject_images:
                backend_instance.convert_dds_for_display(img["path"])
        except Exception as e:
            pytest.fail(f"Unexpected error occurred during reload {i+1}: {e}")

    # Verify that image_service.get_image_list was called for each reload
    assert backend_instance.mock_image_service.get_image_list.call_count == num_reloads * 2
    # Verify that texconv_service.get_displayable_image was called for each image
    assert backend_instance.mock_texconv_service.get_displayable_image.call_count == num_reloads * 2

    print("All reload operations completed without PermissionError.")
    assert True


def test_reload_scenario_temp_dir_cleanup(backend_instance):
    # Mock image_service.get_image_list to return dummy images
    backend_instance.mock_image_service.get_image_list.side_effect = [
        [ImageInfo(src="", alt="dump1.dds", path="/path/to/dump1.dds")],
        [ImageInfo(src="", alt="inject1.dds", path="/path/to/inject1.dds")],
    ] * 3 # Simulate 3 reloads

    # Mock texconv_service.get_displayable_image to return a dummy src
    backend_instance.mock_texconv_service.get_displayable_image.return_value = "data:image/jpeg;base64,dummy"

    # Simulate multiple reload operations
    num_reloads = 3
    for i in range(num_reloads):
        print(f"--- Simulating reload for cleanup test {i+1}/{num_reloads} ---")
        # Ensure temp directory is cleaned before each reload
        backend_instance.file_service.clean_directory(backend_instance.temp_base_dir)
        backend_instance.get_image_list("dump")
        backend_instance.get_image_list("inject")

        # Verify that the temp_base_dir is empty after each reload
        assert not any(backend_instance.temp_base_dir.iterdir()), f"Temp directory not empty after reload {i+1}"

    print("All reload operations for cleanup test completed and temp directory was empty after each reload.")
    assert True
