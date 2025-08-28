import webview
from pathlib import Path
import sys

# Add the parent directory of main.py to the Python path
# This ensures that imports like 'from api import Api' work correctly,
# especially when bundled with PyInstaller.
sys.path.insert(0, str(Path(__file__).parent.resolve()))

from api import Api

if __name__ == "__main__":
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

        webview.start(debug=True)  # dev
        # webview.start(debug=False)  # prod
    except Exception as e:
        print(f"Error: {e}")
