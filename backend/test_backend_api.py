import base64
import io
import json
import os
import shutil
import subprocess
import time
from pathlib import Path
from unittest.mock import MagicMock, patch

import pytest
import appdirs
import requests
from PIL import Image

from backend_api import (
    HoHatchBackend,
    get_config_file,
    get_config_dir,
    get_special_k_dir,
)


# Mock appdirs to use a temporary directory for tests
@pytest.fixture(autouse=True)
def mock_appdirs_user_data_dir(tmp_path):
    with patch("appdirs.user_data_dir", return_value=str(tmp_path / "mock_appdata")) as mock_user_data_dir:
        yield mock_user_data_dir  # Yield the mock object itself


# Fixture for a clean backend instance for each test
@pytest.fixture
def backend(tmp_path):
    with patch("backend_api.get_special_k_dir", return_value=tmp_path / "mock_special_k_dir"), patch(
        "backend_api.get_config_dir", return_value=tmp_path / "mock_config_dir"
    ):
        backend = HoHatchBackend()
        backend.current_lang = "en"
        return backend


# Fixture for a mock texconv executable path
@pytest.fixture
def mock_texconv_executable(tmp_path):
    texconv_path = tmp_path / "texconv.exe"
    with open(texconv_path, "w") as f:
        f.write("mock_texconv_content")
    os.chmod(texconv_path, 0o755)  # Make it executable
    return texconv_path


class TestHoHatchBackend:
    def test_initialization(
        self, backend, mock_appdirs_user_data_dir, tmp_path
    ):  # Add mock_appdirs_user_data_dir to arguments
        assert isinstance(backend, HoHatchBackend)
        assert backend.current_lang == "en"
        # Assert that sk_folder_path is a Path object and exists, and that it's based on the mocked appdirs path
        assert isinstance(backend.sk_folder_path, Path)
        assert (
            backend.sk_folder_path.is_dir() or not backend.sk_folder_path.exists()
        )  # It might not exist if the mock path is new
        assert str(backend.sk_folder_path) == str(tmp_path / "mock_special_k_dir")

        # Assert that texconv_executable is a Path object and exists, and that it's based on the mocked appdirs path
        assert isinstance(backend.texconv_executable, Path)
        assert (
            backend.texconv_executable.is_file() or not backend.texconv_executable.exists()
        )  # It might not exist if the mock path is new
        assert str(backend.texconv_executable) == str(tmp_path / "mock_config_dir" / "texconv.exe")

        assert backend.dds_to_jpg_output_height == 1024
        assert backend.temp_base_dir.exists()
        assert backend.general_tmp_dir.exists()
        assert backend.conv_tmp_dir.exists()
        assert backend.thumb_cache_dir.exists()

    @pytest.mark.parametrize(
        "config_setup",
        [
            "no_file",
            "invalid_json",
        ],
    )
    def test_load_config_failures(self, backend, config_setup):
        config_file = get_config_file()
        config_file.parent.mkdir(parents=True, exist_ok=True)

        if config_setup == "no_file":
            if config_file.exists():
                config_file.unlink()
        elif config_setup == "invalid_json":
            with open(config_file, "w") as f:
                f.write("{invalid json")

        config = backend.load_config()
        assert config == {}

    def test_load_config_valid_file(self, backend):
        config_file = get_config_file()
        config_file.parent.mkdir(parents=True, exist_ok=True)
        with open(config_file, "w") as f:
            json.dump({"language": "en", "special_k_folder_path": "/test/sk", "output_height": 500}, f)
        config = backend.load_config()
        assert config["language"] == "en"
        assert Path(config["special_k_folder_path"]) == Path("/test/sk")
        assert config["output_height"] == 500

    def test_save_config(self, backend):
        settings = {"language": "en", "special_k_folder_path": "/new/sk", "imageHeight": 700}
        result = backend.save_config(settings)
        assert result["success"]
        loaded_config = backend.load_config()
        assert loaded_config["language"] == "en"
        assert Path(loaded_config["special_k_folder_path"]) == Path("/new/sk")
        assert loaded_config["output_height"] == 700

    def test_save_config_invalid_format(self, backend):
        result = backend.save_config("not_a_dict")
        assert not result["success"]
        assert "Invalid settings format" in result["error"]

    @patch("requests.Session.get")
    def test_download_texconv_success(self, mock_get, backend):
        mock_response = MagicMock()
        mock_response.raise_for_status.return_value = None
        mock_response.iter_content.return_value = [b"texconv_content"]
        mock_get.return_value = mock_response

        result = backend.download_texconv()
        assert result["success"]
        assert "Texconv downloaded successfully" in result["message"]
        assert backend.texconv_executable.exists()
        assert backend.texconv_executable.read_bytes() == b"texconv_content"

    @patch("requests.Session.get", side_effect=requests.exceptions.RequestException("Download error"))
    def test_download_texconv_failure(self, mock_get, backend):
        result = backend.download_texconv()
        assert not result["success"]
        assert "Failed to download Texconv" in result["error"]

    def test_set_language(self, backend):
        result = backend.set_language("en")
        assert result["success"]
        assert backend.current_lang == "en"
        loaded_config = backend.load_config()
        assert loaded_config["language"] == "en"

    def test_set_language_unsupported(self, backend):
        result = backend.set_language("fr")
        assert not result["success"]
        assert "Language not supported" in result["error"]

    @patch("requests.Session.get")
    def test_download_special_k_success(self, mock_get, backend):
        mock_response = MagicMock()
        mock_response.raise_for_status.return_value = None
        mock_response.iter_content.return_value = [b"special_k_content"]
        mock_get.return_value = mock_response

        result = backend.download_special_k()
        assert result["success"]
        assert "Special K downloaded successfully" in result["message"]
        assert Path("./SpecialK.exe").exists()
        assert Path("./SpecialK.exe").read_bytes() == b"special_k_content"
        Path("./SpecialK.exe").unlink()  # Clean up

    @patch("requests.Session.get", side_effect=requests.exceptions.RequestException("Download error"))
    def test_download_special_k_failure(self, mock_get, backend):
        result = backend.download_special_k()
        assert not result["success"]
        assert "Failed to download Special K" in result["error"]

    def test_replace_dds_success(
        self,
        backend,
        mock_texconv_executable,
        tmp_path,
    ):
        backend.texconv_executable = mock_texconv_executable
        backend.sk_folder_path = tmp_path / "SK"  # Mock SK folder for inject path
        inject_dir = (
            backend.sk_folder_path / "Profiles" / "Shadowverse Worlds Beyond" / "SK_Res" / "inject" / "textures"
        )
        inject_dir.mkdir(parents=True)

        with patch("backend_api.subprocess.run") as mock_subprocess_run, patch(
            "PIL.Image.open"
        ) as mock_pil_open, patch("backend_api.HoHatchBackend.save_config") as mock_save_config:

            def create_mock_output(cmd, **kwargs):
                output_dir = Path(cmd[4])
                input_file = Path(cmd[5])
                output_file = output_dir / (input_file.stem + ".dds")
                output_file.touch()
                return MagicMock(returncode=0, stdout="Success", stderr="")

            mock_subprocess_run.side_effect = create_mock_output

            mock_img = MagicMock()
            mock_img.convert.return_value = mock_img
            mock_img.transpose.return_value = mock_img
            mock_img.resize.return_value = mock_img
            mock_img.save.return_value = None
            mock_pil_open.return_value = mock_img

            target_dds = tmp_path / "target.dds"
            target_dds.touch()
            replacement_img = tmp_path / "replacement.jpg"
            replacement_img.touch()

            result = backend.replace_dds(None, str(target_dds), str(replacement_img), False)

            assert result["success"]
            mock_subprocess_run.assert_called_once()
            mock_pil_open.assert_called_once()
            mock_save_config.assert_called_once()
            assert (inject_dir / target_dds.name).exists()

    def test_replace_dds_cleanup_failure_texconv(
        self,
        backend,
        mock_texconv_executable,
        tmp_path,
    ):
        backend.texconv_executable = mock_texconv_executable
        backend.sk_folder_path = tmp_path / "SK"  # Mock SK folder for inject path
        (backend.sk_folder_path / "Profiles" / "Shadowverse Worlds Beyond" / "SK_Res" / "inject" / "textures").mkdir(
            parents=True
        )

        with patch("backend_api.subprocess.run") as mock_subprocess_run:
            with patch("PIL.Image.open") as mock_pil_open:
                mock_subprocess_run.return_value = MagicMock(returncode=1, stdout="", stderr="Texconv error")

                mock_img = MagicMock()
                mock_img.convert.return_value = mock_img
                mock_img.transpose.return_value = mock_img
                mock_img.resize.return_value = mock_img
                mock_img.save.return_value = None
                mock_pil_open.return_value = mock_img

                target_dds = tmp_path / "target_cleanup_fail_texconv.dds"
                target_dds.touch()
                replacement_img = tmp_path / "replacement_cleanup_fail_texconv.jpg"
                replacement_img.touch()

                result = backend.replace_dds(None, str(target_dds), str(replacement_img), False)

                assert not result["success"]

    def test_replace_dds_cleanup_failure_pil(
        self,
        backend,
        mock_texconv_executable,
        tmp_path,
    ):
        backend.texconv_executable = mock_texconv_executable
        backend.sk_folder_path = tmp_path / "SK"  # Mock SK folder for inject path
        (backend.sk_folder_path / "Profiles" / "Shadowverse Worlds Beyond" / "SK_Res" / "inject" / "textures").mkdir(
            parents=True
        )

        with patch("backend_api.subprocess.run") as mock_subprocess_run:
            with patch("PIL.Image.open", side_effect=Exception("PIL error")) as mock_pil_open:
                mock_subprocess_run.return_value = MagicMock(returncode=0, stdout="Success", stderr="")

                target_dds = tmp_path / "target_cleanup_fail_pil.dds"
                target_dds.touch()
                replacement_img = tmp_path / "replacement_cleanup_fail_pil.jpg"
                replacement_img.touch()

                result = backend.replace_dds(None, str(target_dds), str(replacement_img), False)

                assert not result["success"]

    def test_download_single_dds_as_jpg_success(
        self,
        backend,
        mock_texconv_executable,
        tmp_path,
    ):
        backend.texconv_executable = mock_texconv_executable
        backend.dds_to_jpg_output_height = 512

        with patch("backend_api.subprocess.run") as mock_subprocess_run:
            with patch("PIL.Image.open") as mock_pil_open:
                mock_subprocess_run.return_value = MagicMock(returncode=0, stdout="Success", stderr="")

                mock_img = MagicMock()
                mock_img.transpose.return_value = mock_img
                mock_img.save.return_value = None
                mock_pil_open.return_value = mock_img

                dds_file = tmp_path / "test.dds"
                dds_file.touch()
                output_folder = tmp_path / "output"
                output_folder.mkdir()
                (output_folder / "test.jpg").touch()  # Simulate texconv output

                result = backend.download_single_dds_as_jpg(str(dds_file), str(output_folder))

                assert result["success"]
                mock_subprocess_run.assert_called_once()
                mock_pil_open.assert_called_once()
                mock_img.transpose.assert_called_once_with(Image.FLIP_TOP_BOTTOM)
                mock_img.save.assert_called_once_with(output_folder / "test.jpg")

    def test_download_single_dds_as_jpg_texconv_failure(
        self,
        backend,
        mock_texconv_executable,
        tmp_path,
    ):
        backend.texconv_executable = mock_texconv_executable
        backend.dds_to_jpg_output_height = 512

        with patch("backend_api.subprocess.run") as mock_subprocess_run:
            with patch("PIL.Image.open") as mock_pil_open:
                mock_subprocess_run.return_value = MagicMock(returncode=1, stdout="", stderr="Texconv error")

                dds_file = tmp_path / "test.dds"
                dds_file.touch()
                output_folder = tmp_path / "output"
                output_folder.mkdir()

                result = backend.download_single_dds_as_jpg(str(dds_file), str(output_folder))

                assert not result["success"]
                assert "JPG Conversion Failed" in result["error"]
                assert "Texconv error" in result["error"]
                mock_subprocess_run.assert_called_once()
                mock_pil_open.assert_not_called()  # Should not try to open if texconv failed

    def test_download_single_dds_as_jpg_pil_failure(
        self,
        backend,
        mock_texconv_executable,
        tmp_path,
    ):
        backend.texconv_executable = mock_texconv_executable
        backend.dds_to_jpg_output_height = 512

        with patch("backend_api.subprocess.run") as mock_subprocess_run:
            with patch("PIL.Image.open", side_effect=IOError("PIL open error")) as mock_pil_open:
                mock_subprocess_run.return_value = MagicMock(returncode=0, stdout="Success", stderr="")

                dds_file = tmp_path / "test.dds"
                dds_file.touch()
                output_folder = tmp_path / "output"
                output_folder.mkdir()
                (output_folder / "test.jpg").touch()  # Simulate texconv output

                result = backend.download_single_dds_as_jpg(str(dds_file), str(output_folder))

                assert not result["success"]
                assert "JPG Conversion Failed" in result["error"]
                assert "Flipping/Verification failed after multiple retries" in result["error"]
                mock_subprocess_run.assert_called_once()
                assert mock_pil_open.call_count == 5

    def test_delete_dds_file_success(self, backend, tmp_path):
        test_file = tmp_path / "test.dds"
        test_file.touch()
        assert test_file.exists()
        result = backend.delete_dds_file(str(test_file))
        assert result["success"]
        assert "Image deleted successfully." in result["message"]
        assert not test_file.exists()

    def test_delete_dds_file_not_found(self, backend, tmp_path):
        test_file = tmp_path / "non_existent.dds"
        assert not test_file.exists()
        result = backend.delete_dds_file(str(test_file))
        assert not result["success"]
        assert "File not found." in result["error"]

    def test_delete_dds_file_permission_error(self, backend, tmp_path):
        test_file = tmp_path / "permission.dds"
        test_file.touch()
        os.chmod(test_file, 0o444)  # Make read-only
        result = backend.delete_dds_file(str(test_file))
        assert not result["success"]
        assert result["error"].startswith("Failed to delete image: ")
        os.chmod(test_file, 0o644)  # Change back to writable for cleanup

    @patch("backend_api.HoHatchBackend.delete_dds_file")
    def test_batch_delete_selected_dds_files_success(self, mock_delete_dds_file, backend):
        mock_delete_dds_file.return_value = {"success": True}
        file_list = ["file1.dds", "file2.dds"]
        result = backend.batch_delete_selected_dds_files(file_list)
        assert result["success"]
        assert "Selected images deleted successfully." in result["message"]
        assert mock_delete_dds_file.call_count == len(file_list)

    @patch("backend_api.HoHatchBackend.delete_dds_file")
    def test_batch_delete_selected_dds_files_failure(self, mock_delete_dds_file, backend):
        mock_delete_dds_file.side_effect = [{"success": True}, {"success": False, "error": "Error deleting file2"}]
        file_list = ["file1.dds", "file2.dds"]
        result = backend.batch_delete_selected_dds_files(file_list)
        assert not result["success"]
        assert "Failed to delete selected images" in result["error"]
        assert "Error deleting file2" in result["error"]
        assert mock_delete_dds_file.call_count == len(file_list)

    @patch("backend_api.HoHatchBackend.download_single_dds_as_jpg")
    def test_batch_download_selected_dds_as_jpg_success(self, mock_download_single, backend):
        mock_download_single.return_value = {"success": True}
        file_list = ["file1.dds", "file2.dds"]
        output_folder = "/mock/output"
        result = backend.batch_download_selected_dds_as_jpg(file_list, output_folder)
        assert result["success"]
        assert "Selected images downloaded successfully." in result["message"]
        assert mock_download_single.call_count == len(file_list)

    @patch("backend_api.HoHatchBackend.download_single_dds_as_jpg")
    def test_batch_download_selected_dds_as_jpg_failure(self, mock_download_single, backend):
        mock_download_single.side_effect = [{"success": True}, {"success": False, "error": "Error downloading file2"}]
        file_list = ["file1.dds", "file2.dds"]
        output_folder = "/mock/output"
        result = backend.batch_download_selected_dds_as_jpg(file_list, output_folder)
        assert not result["success"]
        assert "Failed to download selected images" in result["error"]
        assert "Error downloading file2" in result["error"]
        assert mock_download_single.call_count == len(file_list)

    def test_validate_sk_folder_success(self, backend, tmp_path):
        sk_path = tmp_path / "SK"
        sk_path.mkdir()
        (sk_path / "SKIF.exe").touch()
        result = backend.validate_sk_folder(str(sk_path))
        assert result["is_valid"]
        assert result["message"] == "Valid"

    def test_validate_sk_folder_invalid_path(self, backend, tmp_path):
        result = backend.validate_sk_folder(str(tmp_path / "non_existent"))
        assert not result["is_valid"]
        assert "Invalid Special K Folder" in result["message"]

    def test_validate_sk_folder_no_skif_exe(self, backend, tmp_path):
        sk_path = tmp_path / "SK"
        sk_path.mkdir()
        result = backend.validate_sk_folder(str(sk_path))
        assert not result["is_valid"]
        assert "Invalid Special K Folder" in result["message"]

    def test_validate_texconv_executable_success(self, backend, mock_texconv_executable):
        result = backend.validate_texconv_executable(str(mock_texconv_executable))
        assert result["is_valid"]
        assert result["message"] == "Valid"

    def test_validate_texconv_executable_not_found(self, backend, tmp_path):
        result = backend.validate_texconv_executable(str(tmp_path / "non_existent_texconv.exe"))
        assert not result["is_valid"]
        assert "Invalid Texconv" in result["message"]

    def test_validate_texconv_executable_not_executable(self, backend, tmp_path):
        texconv_path = tmp_path / "not_executable.exe"
        texconv_path.touch()
        os.chmod(texconv_path, 0o644)  # Not executable
        with patch("os.access", return_value=False):
            result = backend.validate_texconv_executable(str(texconv_path))
            assert not result["is_valid"]
            assert "Invalid Texconv" in result["message"]

    def test_clean_temp_directories(self, backend):
        # Create some dummy files in temp directories
        (backend.general_tmp_dir / "file1.txt").touch()
        (backend.conv_tmp_dir / "file2.txt").touch()
        (backend.thumb_cache_dir / "file3.txt").touch()

        assert (backend.general_tmp_dir / "file1.txt").exists()
        assert (backend.conv_tmp_dir / "file2.txt").exists()
        assert (backend.thumb_cache_dir / "file3.txt").exists()

        result = backend.clean_temp_directories()
        assert result["success"]
        assert "Temporary directories cleaned successfully." in result["message"]

        # Check if directories are empty (or recreated empty)
        assert not (backend.general_tmp_dir / "file1.txt").exists()
        assert not (backend.conv_tmp_dir / "file2.txt").exists()
        assert not (backend.thumb_cache_dir / "file3.txt").exists()
        assert backend.general_tmp_dir.is_dir()
        assert backend.conv_tmp_dir.is_dir()
        assert backend.thumb_cache_dir.is_dir()
