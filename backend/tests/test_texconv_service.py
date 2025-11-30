import pytest
from unittest.mock import MagicMock, patch
from pathlib import Path
from PIL import Image

from backend.services import TexconvService
from backend.dto import AppSettings


@pytest.fixture
def texconv_service_fixture():
    with patch("backend.services.ConfigService") as MockConfigService, patch(
        "backend.services.FileService"
    ) as MockFileService, patch("backend.services.ImageService") as MockImageService:

        mock_config_service = MockConfigService.return_value
        mock_file_service = MockFileService.return_value
        mock_image_service = MockImageService.return_value

        # Mock settings for TexconvService
        mock_settings = AppSettings(
            special_k_folder_path="/mock/sk",
            texconv_executable_path="/mock/texconv.exe",
            output_height=512,  # Irrelevant for this test, but needed by AppSettings
        )
        mock_config_service.get_settings.return_value = mock_settings

        # Mock texconv executable existence
        mock_file_service.open.return_value.__enter__.return_value = MagicMock()

        # Ensure the Texconv executable exists for _run_texconv
        with patch("os.access", return_value=True):
            service = TexconvService(mock_config_service, mock_file_service, mock_image_service)
        yield service, mock_config_service, mock_file_service, mock_image_service


@patch("backend.services.subprocess.run")
@patch("backend.services.Image.open")
def test_convert_to_dds_resizes_to_1024x1024(mock_image_open, mock_subprocess_run, texconv_service_fixture, tmp_path):
    texconv_service, _, _, _ = texconv_service_fixture

    # Create a mock for the Image object returned by Image.open
    mock_pil_image = MagicMock()
    mock_image_open.return_value.__enter__.return_value = mock_pil_image

    # Configure mock_pil_image.resize to return another mock
    mock_resized_image = MagicMock()
    mock_pil_image.resize.return_value = mock_resized_image

    # Configure mock_resized_image.transpose to return another mock
    mock_transposed_image = MagicMock()
    mock_resized_image.transpose.return_value = mock_transposed_image

    # Configure the save method on the final transposed image mock
    mock_transposed_image.save = MagicMock()

    jpg_path = str(tmp_path / "test.jpg")
    Path(jpg_path).write_text("dummy jpg content")

    out_dir = str(tmp_path / "output")
    Path(out_dir).mkdir()
    new_name = "output.dds"

    mock_subprocess_run.return_value = MagicMock(stdout="texconv output", stderr="", returncode=0)

    # Simulate creation of the output DDS file by texconv
    (Path(out_dir) / "flipped_test.dds").touch()  # This is the file renamed to new_name

    result = texconv_service.convert_to_dds(jpg_path, out_dir, new_name)

    mock_pil_image.resize.assert_called_once_with((1024, 1024), Image.LANCZOS)  # type: ignore
    mock_resized_image.transpose.assert_called_once_with(Image.FLIP_TOP_BOTTOM)  # type: ignore
    mock_transposed_image.save.assert_called_once()
    assert result == str(Path(out_dir) / new_name)
    mock_subprocess_run.assert_called_once()
