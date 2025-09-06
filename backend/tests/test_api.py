import pytest
from unittest.mock import MagicMock, patch
from pathlib import Path

from backend.api import Api


@pytest.fixture
def mock_api_instance():
    with patch("backend.api.HoHatchBackend") as MockHoHatchBackend, \
         patch("backend.api.webview") as MockWebview, \
         patch("backend.api.logging.info") as mock_logging_info, \
         patch("backend.api.logging.error") as mock_logging_error:

        mock_backend = MockHoHatchBackend.return_value
        mock_backend.get_current_settings.return_value = {"lang": "en"}

        mock_active_window = MagicMock()
        MockWebview.active_window = mock_active_window

        api_instance = Api()
        api_instance.backend = mock_backend
        api_instance.window = mock_active_window # Set the window here
        yield api_instance, mock_backend, MockWebview, mock_active_window, mock_logging_info, mock_logging_error


@pytest.mark.parametrize("window_arg", ["mock_active_window", None])
def test_frontend_ready(mock_api_instance, window_arg):
    api_instance, mock_backend, _MockWebview, mock_active_window, mock_logging_info, _ = mock_api_instance

    if window_arg == "mock_active_window":
        window_to_pass = mock_active_window
    else:
        window_to_pass = None

    api_instance.frontend_ready(window_to_pass)

    mock_backend.get_current_settings.assert_not_called()
    mock_active_window.evaluate_js.assert_not_called()

    mock_logging_info.assert_any_call("Window object has been set.")
    mock_logging_info.assert_any_call("Frontend is ready. Initial data fetch will be triggered by frontend.")


def test_load_url_success(mock_api_instance):
    api_instance, _, MockWebview, mock_active_window, mock_logging_info, mock_logging_error = mock_api_instance
    
    with patch.object(Path, 'is_file', return_value=True):
        result = api_instance.load_url("/settings")
        assert result["success"] is True
        mock_active_window.load_url.assert_called_once()
        mock_logging_info.assert_called_with(f"Loading HTML file: {Path(__file__).parent.parent.parent / 'frontend' / 'dist' / 'settings.html'}")

def test_load_url_window_not_set(mock_api_instance):
    api_instance, _, _, _, _, mock_logging_error = mock_api_instance
    api_instance.window = None 
    result = api_instance.load_url("/settings")
    assert result["success"] is False
    assert "Window object not set." in result["error"]
    mock_logging_error.assert_called_once_with("Window object not set, cannot load URL.")

def test_open_file_dialog_window_not_set(mock_api_instance):
    api_instance, _, _, _, _, mock_logging_error = mock_api_instance
    api_instance.window = None 
    result = api_instance.open_file_dialog("file_open")
    assert result["success"] is False
    assert "Window object not set." in result["error"]
    mock_logging_error.assert_called_once_with("Window object not set, cannot open file dialog.")

def test_open_file_dialog_invalid_type(mock_api_instance):
    api_instance, _, _, _, _, _ = mock_api_instance
    result = api_instance.open_file_dialog("invalid_type")
    assert result["success"] is False
    assert "Invalid dialog type" in result["error"]

def test_open_file_dialog_success(mock_api_instance):
    api_instance, _, MockWebview, mock_active_window, _, _ = mock_api_instance
    mock_active_window.create_file_dialog.return_value = ["/mock/path/selected.jpg"]
    result = api_instance.open_file_dialog("file_open", {"file_types": [["Image files", "*.jpg"]]})
    assert result["success"] is True
    assert result["files"] == ["/mock/path/selected.jpg"]
    mock_active_window.create_file_dialog.assert_called_once()

def test_open_file_dialog_cancelled(mock_api_instance):
    api_instance, _, MockWebview, mock_active_window, _, _ = mock_api_instance
    mock_active_window.create_file_dialog.return_value = None
    result = api_instance.open_file_dialog("file_open")
    assert result["success"] is False
    assert "Dialog cancelled or failed" in result["error"]

def test_load_url_file_not_found(mock_api_instance):
    api_instance, _, MockWebview, mock_active_window, mock_logging_info, mock_logging_error = mock_api_instance
    
    with patch.object(Path, 'is_file', return_value=False):
        result = api_instance.load_url("/non_existent_page")
        assert result["success"] is False
        assert "HTML file not found" in result["error"]
        mock_active_window.load_url.assert_not_called()
        mock_logging_error.assert_called_once_with(f"HTML file not found at {Path(__file__).parent.parent.parent / 'frontend' / 'dist' / 'non_existent_page.html'}")

def test_open_file_dialog_exception(mock_api_instance):
    api_instance, _, MockWebview, mock_active_window, _, mock_logging_error = mock_api_instance
    mock_active_window.create_file_dialog.side_effect = Exception("Mock dialog error")
    with pytest.raises(Exception, match="Mock dialog error"):
        api_instance.open_file_dialog("file_open")