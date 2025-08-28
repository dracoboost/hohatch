import pytest
from unittest.mock import MagicMock, patch
import sys
from io import StringIO

# Import the Api class from your api.py
from api import Api


@pytest.fixture
def mock_api_instance():
    with patch("api.HoHatchBackend") as MockHoHatchBackend, patch("api.webview") as MockWebview:

        # Configure the mock backend
        mock_backend = MockHoHatchBackend.return_value
        mock_backend.get_current_settings.return_value = {"lang": "en"}

        # Configure the mock webview.active_window
        mock_active_window = MagicMock()
        MockWebview.active_window = mock_active_window

        api_instance = Api()
        api_instance.backend = mock_backend  # Ensure the Api instance uses our mock backend
        yield api_instance, mock_backend, MockWebview, mock_active_window


@pytest.mark.parametrize("window_arg", ["mock_active_window", None])
def test_frontend_ready(mock_api_instance, window_arg):
    api_instance, mock_backend, _MockWebview, mock_active_window = mock_api_instance

    # If window_arg is the string "mock_active_window", use the actual mock object
    if window_arg == "mock_active_window":
        window_to_pass = mock_active_window
    else:
        window_to_pass = None

    captured_output = StringIO()
    sys.stdout = captured_output

    api_instance.frontend_ready(window_to_pass)

    sys.stdout = sys.__stdout__

    mock_backend.get_current_settings.assert_not_called()
    mock_active_window.evaluate_js.assert_not_called()

    output = captured_output.getvalue()
    assert "[Api.set_window] Window object has been set." in output
    assert "[Api.frontend_ready] Received notification from frontend and set window object." in output
    assert (
        "[Api.frontend_ready] The frontend now fetches data using its own useEffect hooks, so no need to push initial data."
        in output
    )
