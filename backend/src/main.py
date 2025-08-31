import webview
import sys
from pathlib import Path

if getattr(sys, "frozen", False):
    # Running in a PyInstaller bundle
    # sys._MEIPASS is the path to the temporary directory where the bundle is extracted
    # We need to add the 'src' directory within the bundle to sys.path
    sys.path.append(str(Path(sys._MEIPASS) / "backend" / "src"))
else:
    # Running in a normal Python environment
    sys.path.append(str(Path(__file__).parent))

# This ensures that imports like 'from backend.src.api import Api' work correctly,
# especially when bundled with PyInstaller.
from backend.src.api import Api

if __name__ == "__main__":
    # Determine the path to the frontend build directory using pathlib for robustness
    if getattr(sys, "frozen", False):

        # Running in a PyInstaller bundle
        frontend_dir = Path(sys._MEIPASS) / "frontend" / "dist"
    else:
        # Running in a normal Python environment
        frontend_dir = Path(__file__).parent.parent.parent / "frontend" / "dist"

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
