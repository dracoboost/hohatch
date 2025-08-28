import pytest
import os
import shutil
from pathlib import Path
from unittest.mock import patch, MagicMock, call

from backend_api import HoHatchBackend, get_config_file


# Fixture for a clean backend instance
@pytest.fixture
def backend(tmp_path):
    """Provides a clean instance of HoHatchBackend for each test,
    with its temporary directories pointed to pytest's tmp_path."""
    # Use patch to control the location of app-specific data directories
    with patch("appdirs.user_data_dir", return_value=str(tmp_path / "app_data")), patch(
        "appdirs.user_config_dir", return_value=str(tmp_path / "config_data")
    ):

        # Mock os.environ to control temp directory location
        with patch("os.environ.get") as mock_getenv:
            mock_getenv.return_value = str(tmp_path)

            b = HoHatchBackend()
            # Clean up any potential config file from previous runs
            config_file = get_config_file()
            if config_file.exists():
                config_file.unlink()

            yield b


# Fixture for a mock texconv executable
@pytest.fixture
def mock_texconv_executable(tmp_path):
    """Creates a mock texconv.exe file and makes it executable."""
    texconv_path = tmp_path / "texconv.exe"
    texconv_path.touch()
    os.chmod(texconv_path, 0o755)
    return texconv_path


# Fixture for a fully mocked Special K folder structure with dummy DDS files
@pytest.fixture
def mock_sk_folder_with_images(tmp_path):
    """Creates a realistic mock of the Special K folder structure,
    including dummy DDS files in dump and inject directories."""
    sk_folder = tmp_path / "Special K"

    # Path for dumped images
    dump_path = sk_folder / "Profiles" / "Shadowverse Worlds Beyond" / "SK_Res" / "dump" / "textures"
    dump_path.mkdir(parents=True, exist_ok=True)
    (dump_path / "dumped_image_01.dds").write_text("dummy dds content 1")
    (dump_path / "dumped_image_02.dds").write_text("dummy dds content 2")

    # Path for injected images
    inject_path = sk_folder / "Profiles" / "Shadowverse Worlds Beyond" / "SK_Res" / "inject" / "textures"
    inject_path.mkdir(parents=True, exist_ok=True)
    (inject_path / "injected_image_01.dds").write_text("dummy dds content 3")

    # Mock SKIF.exe
    (sk_folder / "SKIF.exe").touch()

    return sk_folder


@patch("backend_api.HoHatchBackend._get_file_hash", return_value="dummy_hash")
def test_get_image_list_dump_success(
    mock_get_hash, backend, mock_sk_folder_with_images
):
    """
    Tests if get_image_list successfully finds DDS files in dump folder.
    """
    backend.sk_folder_path = mock_sk_folder_with_images

    # Case 1: No cache
    result = backend.get_image_list("dump")
    assert result["success"] is True
    assert len(result["images"]) == 2
    for image in result["images"]:
        assert image["src"] == ""

    # Case 2: With cache
    # Create dummy cache files
    cache_dir = backend.cache_dir
    (cache_dir / "dumped_image_01.jpg").write_text("dummy jpg")
    (cache_dir / "dumped_image_01.hash").write_text("dummy_hash")

    result = backend.get_image_list("dump")
    assert result["success"] is True
    assert len(result["images"]) == 2
    
    dumped_image_1 = next(filter(lambda i: i['alt'] == 'dumped_image_01.dds', result['images']))
    assert "data:image/jpeg;base64," in dumped_image_1["src"]

    dumped_image_2 = next(filter(lambda i: i['alt'] == 'dumped_image_02.dds', result['images']))
    assert dumped_image_2["src"] == ""


@patch("backend_api.HoHatchBackend._get_file_hash", return_value="dummy_hash")
def test_get_image_list_inject_success(
    mock_get_hash, backend, mock_sk_folder_with_images
):
    """
    Tests if get_image_list successfully finds DDS files in inject folder.
    """
    backend.sk_folder_path = mock_sk_folder_with_images

    # Case 1: No cache
    result = backend.get_image_list("inject")
    assert result["success"] is True
    assert len(result["images"]) == 1
    for image in result["images"]:
        assert image["src"] == ""

    # Case 2: With cache
    # Create dummy cache files
    cache_dir = backend.cache_dir
    (cache_dir / "injected_image_01.jpg").write_text("dummy jpg")
    (cache_dir / "injected_image_01.hash").write_text("dummy_hash")

    result = backend.get_image_list("inject")
    assert result["success"] is True
    assert len(result["images"]) == 1
    
    injected_image_1 = next(filter(lambda i: i['alt'] == 'injected_image_01.dds', result['images']))
    assert "data:image/jpeg;base64," in injected_image_1["src"]
