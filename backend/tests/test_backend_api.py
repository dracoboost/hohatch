import json
import os
from pathlib import Path
from unittest.mock import MagicMock, patch

import pytest

from backend.backend_api import HoHatchBackend
from backend.services import get_config_file


@pytest.fixture
def backend():
    """Provides a backend instance with mocked services."""
    with patch("backend.backend_api.ConfigService") as MockConfigService, \
         patch("backend.backend_api.DownloadService") as MockDownloadService, \
         patch("backend.backend_api.FileService") as MockFileService, \
         patch("backend.backend_api.ImageService") as MockImageService, \
         patch("backend.backend_api.TexconvService") as MockTexconvService, \
         patch("backend.backend_api.HoHatchBackend._ensure_texconv_exists") as mock_ensure_texconv_exists:

        mock_ensure_texconv_exists.return_value = None

        # Setup mock instances for each service
        mock_config_service = MockConfigService.return_value
        mock_download_service = MockDownloadService.return_value
        mock_file_service = MockFileService.return_value
        mock_image_service = MockImageService.return_value
        mock_texconv_service = MockTexconvService.return_value

        # Instantiate the backend - it will get the mocked services
        backend_instance = HoHatchBackend()

        # Attach mocks to the instance for easy access in tests
        backend_instance.mock_config_service = mock_config_service
        backend_instance.mock_download_service = mock_download_service
        backend_instance.mock_file_service = mock_file_service
        backend_instance.mock_image_service = mock_image_service
        backend_instance.mock_texconv_service = mock_texconv_service

        yield backend_instance



class TestHoHatchBackend:
    def test_save_config(self, backend):
        settings_dict = {"language": "ja"}
        backend.save_config(settings_dict)
        backend.mock_config_service.update_settings.assert_called_once_with(settings_dict)

    def test_download_texconv(self, backend):
        backend.download_texconv()
        backend.mock_download_service.download_texconv.assert_called_once()

    def test_download_special_k(self, backend):
        backend.download_special_k()
        backend.mock_download_service.download_special_k.assert_called_once()

    def test_delete_dds_file(self, backend):
        test_path = "/path/to/file.dds"
        backend.delete_dds_file(test_path)
        backend.mock_file_service.delete_file.assert_called_once_with(test_path)

    def test_batch_delete_selected_dds_files(self, backend):
        test_paths = ["/path/to/file1.dds", "/path/to/file2.dds"]
        backend.batch_delete_selected_dds_files(test_paths)
        backend.mock_file_service.batch_delete_files.assert_called_once_with(test_paths)

    def test_get_image_list(self, backend):
        backend.get_image_list("dump")
        backend.mock_image_service.get_image_list.assert_called_once_with("dump")

    def test_get_image_counts(self, backend):
        backend.get_image_counts()
        backend.mock_image_service.get_image_counts.assert_called_once()

    def test_convert_dds_for_display(self, backend):
        test_path = "/path/to/file.dds"
        backend.convert_dds_for_display(test_path)
        backend.mock_texconv_service.get_displayable_image.assert_called_once_with(test_path)

    def test_convert_single_dds_to_jpg(self, backend):
        dds_path = "/path/to/file.dds"
        output_folder = "/path/to/output"
        backend.convert_single_dds_to_jpg(dds_path, output_folder)
        backend.mock_texconv_service.convert_to_jpg.assert_called_once_with(dds_path, output_folder)

    @patch("shutil.move")
    @patch("os.rename")
    def test_replace_dds(self, mock_rename, mock_move, backend):
        old_dds_path = "/path/to/old.dds"
        new_jpg_path = "/path/to/new.jpg"
        is_dump_image = True
        backend.replace_dds(old_dds_path, new_jpg_path, is_dump_image)
        backend.mock_texconv_service.convert_to_dds.assert_called_once()
        backend.mock_file_service.move_file.assert_called_once()

    def test_validate_sk_folder(self, backend):
        folder_path = "/path/to/sk_folder"
        backend.validate_sk_folder(folder_path)
        assert backend.validate_sk_folder(folder_path) == {"is_valid": False}

    def test_validate_texconv_executable(self, backend):
        executable_path = "/path/to/texconv.exe"
        backend.validate_texconv_executable(executable_path)
        assert backend.validate_texconv_executable(executable_path) == {"is_valid": False}

    def test_get_current_settings(self, backend):
        backend.mock_config_service.get_settings.reset_mock()
        backend.get_current_settings()
        backend.mock_config_service.get_settings.assert_called_once()

    def test_check_for_updates(self, backend):
        backend.check_for_updates()
        backend.mock_download_service.check_for_updates.assert_called_once()

    def test_notify_settings_changed(self, backend):
        backend.notify_settings_changed()
        pass

    def test_get_default_sk_path(self, backend):
        backend.get_default_sk_path()
        backend.mock_config_service.get_default_sk_path.assert_called_once()

    def test_open_dump_folder(self, backend):
        backend.open_dump_folder()
        backend.mock_file_service.open_folder.assert_called_once_with(backend.mock_image_service.get_dump_folder_path())

    def test_open_inject_folder(self, backend):
        backend.open_inject_folder()
        backend.mock_file_service.open_folder.assert_called_once_with(backend.mock_image_service.get_inject_folder_path())

