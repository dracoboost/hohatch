import webview
import os
import sys
import logging
from pathlib import Path
import appdirs

# Add the project root to sys.path to allow for absolute imports from the 'backend' package.
if getattr(sys, "frozen", False):
    # When bundled with PyInstaller, sys._MEIPASS is the root directory.
    project_root = Path(sys._MEIPASS)
    sys.path.insert(0, str(project_root))
else:
    # In a normal development environment, the project root is two levels up from this file.
    project_root = Path(__file__).resolve().parent.parent
    sys.path.insert(0, str(project_root))


# This ensures that imports like 'from backend.api import Api' work correctly,
# especially when bundled with PyInstaller.
from datetime import datetime
from backend.api import Api

def setup_logging():
    log_dir = Path(appdirs.user_data_dir("HoHatch", "")) / "logs"
    log_dir.mkdir(parents=True, exist_ok=True)
    log_file = log_dir / f"{datetime.now().strftime('%Y-%m-%d')}.log"

    # Configure root logger
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s - %(levelname)s - %(name)s - %(message)s",
        handlers=[
            logging.StreamHandler(sys.stdout),
            logging.FileHandler(log_file, encoding="utf-8"),
        ],
    )
    logging.info("Logging initialized.")
    logging.info(f"Log file path: {log_file}")

if __name__ == "__main__":
    setup_logging()
    # Determine the path to the frontend build directory using pathlib for robustness
    if getattr(sys, "frozen", False):

        # Running in a PyInstaller bundle
        frontend_dir = Path(sys._MEIPASS) / "frontend" / "dist"
    else:
        # Running in a normal Python environment
        frontend_dir = Path(__file__).parent.parent / "frontend" / "dist"

    html_file_path = frontend_dir / "index.html"

    if not html_file_path.exists():
        print(f"ERROR: Frontend entry point not found at {html_file_path.resolve()}")
    else:
        print(f"DEBUG: Attempting to load HTML file from: {html_file_path.resolve()}")

    try:
        api = Api()
        window = webview.create_window(
            "HoHatch", url=str(html_file_path.resolve()), width=1280, height=720, js_api=api
        )

        def on_loaded():
            api.set_window(window)
            api.frontend_ready(window)

        window.events.loaded += on_loaded

        debug_mode = os.environ.get("HOHATCH_DEBUG", "false").lower() == "true"
        webview.start(debug=debug_mode)
    except Exception as e:
        print(f"Error: {e}")
