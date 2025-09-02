import pytest
from unittest.mock import MagicMock, patch
from pathlib import Path

from .backend_api import HoHatchBackend
from .services import get_config_file
from backend.dto import ImageInfo


@pytest.fixture
def backend():
    """Provides a backend instance with mocked services."""
    with patch("backend.backend_api.ConfigService") as MockConfigService, \
         patch("backend.backend_api.DownloadService") as MockDownloadService, \
         patch("backend.backend_api.FileService") as MockFileService, \
         patch("backend.backend_api.ImageService") as MockImageService, \
         patch("backend.backend_api.TexconvService") as MockTexconvService, \
         patch("backend.backend_api.HoHatchBackend._ensure_texconv_exists"):

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


def test_get_image_list_dump_success(backend):
    mock_images = [
        ImageInfo(src="", alt="dumped_image_01.dds", path="/mock/dump/dumped_image_01.dds"),
        ImageInfo(src="", alt="dumped_image_02.dds", path="/mock/dump/dumped_image_02.dds"),
    ]
    backend.mock_image_service.get_image_list.return_value = mock_images

    result = backend.get_image_list("dump")
    assert result["success"] is True
    assert len(result["images"]) == 2