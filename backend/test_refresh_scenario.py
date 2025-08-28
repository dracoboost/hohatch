import pytest
import os
import shutil
import tempfile
from pathlib import Path
from unittest.mock import patch, MagicMock
import time

from backend_api import HoHatchBackend


@pytest.fixture
def backend_instance():
    with tempfile.TemporaryDirectory() as tmpdir:
        original_appdata = os.environ.get("LOCALAPPDATA")
        os.environ["LOCALAPPDATA"] = tmpdir

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
        backend.texconv_executable = dummy_texconv_path  # Ensure backend uses the dummy texconv
        backend.sk_folder_path = dummy_sk_folder  # Ensure backend uses the dummy SK folder

        yield backend

        # Clean up environment variable
        if original_appdata is None:
            del os.environ["LOCALAPPDATA"]
        else:
            os.environ["LOCALAPPDATA"] = original_appdata


@patch("subprocess.run")
@patch("PIL.Image.open")
def test_reload_scenario_no_permission_error(mock_image_open, mock_subprocess_run, backend_instance):
    # Configure mocks
    mock_image_instance = MagicMock()
    mock_image_open.return_value = mock_image_instance
    mock_image_instance.transpose.return_value = mock_image_instance
    mock_image_instance.thumbnail.return_value = None
    mock_image_instance.save.return_value = None
    mock_image_instance.close.return_value = None

    # Simulate texconv successfully creating a JPG file
    def mock_run_side_effect(*args, **kwargs):
        output_dir = Path(args[0][3])  # Assuming -o is the 3rd argument
        input_dds = Path(args[0][4])  # Assuming input DDS is the 4th argument

        # Create a dummy JPG output file
        output_jpg_path = output_dir / f"{input_dds.stem}.jpg"
        output_jpg_path.touch()

        mock_result = MagicMock()
        mock_result.returncode = 0
        mock_result.stdout = "texconv output"
        mock_result.stderr = ""
        return mock_result

    mock_subprocess_run.side_effect = mock_run_side_effect

    # Create dummy DDS files in the dump and inject folders
    dump_dds_dir = (
        backend_instance.sk_folder_path / "Profiles" / "Shadowverse Worlds Beyond" / "SK_Res" / "dump" / "textures"
    )
    inject_dds_dir = (
        backend_instance.sk_folder_path / "Profiles" / "Shadowverse Worlds Beyond" / "SK_Res" / "inject" / "textures"
    )

    (dump_dds_dir / "test_dump_1.dds").touch()
    (dump_dds_dir / "test_dump_2.dds").touch()
    (inject_dds_dir / "test_inject_1.dds").touch()

    # Simulate multiple reload operations
    num_reloads = 5
    for i in range(num_reloads):
        print(f"--- Simulating reload {i+1}/{num_reloads} ---")
        try:
            backend_instance.get_image_list("dump")
            backend_instance.get_image_list("inject")
        except PermissionError as e:
            pytest.fail(f"PermissionError occurred during reload {i+1}: {e}")
        except Exception as e:
            pytest.fail(f"Unexpected error occurred during reload {i+1}: {e}")

    # Verify that cleanup was attempted for all temporary files
    # This is implicitly tested by the absence of PermissionError during cleanup
    # and the fact that the temporary directories are managed by the fixture.
    print("All reload operations completed without PermissionError.")
    assert True  # If we reached here, no PermissionError occurred.


@patch("subprocess.run")
@patch("PIL.Image.open")
def test_reload_scenario_temp_dir_cleanup(mock_image_open, mock_subprocess_run, backend_instance):
    # Configure mocks similar to test_reload_scenario_no_permission_error
    mock_image_instance = MagicMock()
    mock_image_open.return_value = mock_image_instance
    mock_image_instance.transpose.return_value = mock_image_instance
    mock_image_instance.thumbnail.return_value = None
    mock_image_instance.save.return_value = None
    mock_image_instance.close.return_value = None

    def mock_run_side_effect(*args, **kwargs):
        # In the actual code, the command is a list of Path objects and strings.
        # The output directory is the 4th element (index 3) of that list.
        # The input file is the 5th element (index 4).
        cmd_list = args[0]
        output_dir = Path(cmd_list[3])
        input_dds = Path(cmd_list[4])
        output_jpg_path = output_dir / f"{input_dds.stem}.jpg"
        output_jpg_path.touch()
        mock_result = MagicMock()
        mock_result.returncode = 0
        mock_result.stdout = "texconv output"
        mock_result.stderr = ""
        return mock_result

    mock_subprocess_run.side_effect = mock_run_side_effect

    # Create dummy DDS files
    dump_dds_dir = (
        backend_instance.sk_folder_path / "Profiles" / "Shadowverse Worlds Beyond" / "SK_Res" / "dump" / "textures"
    )
    inject_dds_dir = (
        backend_instance.sk_folder_path / "Profiles" / "Shadowverse Worlds Beyond" / "SK_Res" / "inject" / "textures"
    )

    (dump_dds_dir / "test_dump_cleanup_1.dds").touch()
    (inject_dds_dir / "test_inject_cleanup_1.dds").touch()

    # Simulate multiple reload operations
    num_reloads = 3
    for i in range(num_reloads):
        print(f"--- Simulating reload for cleanup test {i+1}/{num_reloads} ---")
        backend_instance._safe_clear_dir(backend_instance.thumb_cache_dir)
        backend_instance.get_image_list("dump")
        backend_instance.get_image_list("inject")

        # After each reload, verify that the temp_dds_comparison_cache_dir is empty
        # This checks if the cleanup logic within _process_dds_images is working
        assert not any(
            backend_instance.thumb_cache_dir.iterdir()
        ), f"Temp directory not empty after reload {i+1}"

    print("All reload operations for cleanup test completed and temp directory was empty after each reload.")
    assert True