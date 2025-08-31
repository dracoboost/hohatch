import json
from pathlib import Path

def update_backend_version():
    project_root = Path(__file__).parent.parent
    frontend_package_json_path = project_root / "frontend" / "package.json"
    backend_version_file_path = project_root / "backend" / "src" / "version.py"

    try:
        with open(frontend_package_json_path, "r", encoding="utf-8") as f:
            package_json = json.load(f)
        version = package_json.get("version")

        if not version:
            print(f"Error: 'version' not found in {frontend_package_json_path}")
            return

        with open(backend_version_file_path, "w", encoding="utf-8") as f:
            f.write(f"APP_VERSION = \"{version}\"")
        print(f"Updated backend version to: {version}")

    except FileNotFoundError as e:
        print(f"Error: File not found - {e.filename}")
    except json.JSONDecodeError:
        print(f"Error: Invalid JSON in {frontend_package_json_path}")
    except Exception as e:
        print(f"An unexpected error occurred while updating backend version: {e}")

if __name__ == "__main__":
    update_backend_version()
