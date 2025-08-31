import json
import re
from pathlib import Path

def update_backend_version():
    project_root = Path(__file__).parent.parent
    frontend_package_json_path = project_root / "frontend" / "package.json"
    backend_version_file_path = project_root / "backend" / "src" / "version.py"
    rc_template_path = project_root / "backend" / "version.rc.template"
    rc_output_path = project_root / "backend" / "version.rc"

    try:
        with open(frontend_package_json_path, "r", encoding="utf-8") as f:
            package_json = json.load(f)
        version = package_json.get("version")

        if not version:
            print(f"Error: 'version' not found in {frontend_package_json_path}")
            return

        # Update backend/src/version.py
        with open(backend_version_file_path, "w", encoding="utf-8") as f:
            f.write(f"APP_VERSION = \"{version}\"")
        print(f"Updated backend version to: {version}")

        # Generate backend/version.rc from template
        version_comma = version.replace(".", ",")
        version_dot = version

        with open(rc_template_path, "r", encoding="utf-8") as f:
            rc_template_content = f.read()

        rc_content = rc_template_content.replace("{VERSION_COMMA}", version_comma)
        rc_content = rc_content.replace("{VERSION_DOT}", version_dot)

        with open(rc_output_path, "w", encoding="utf-8") as f:
            f.write(rc_content)
        print(f"Generated version.rc with version: {version}")

    except FileNotFoundError as e:
        print(f"Error: File not found - {e.filename}")
    except json.JSONDecodeError:
        print(f"Error: Invalid JSON in {frontend_package_json_path}")
    except Exception as e:
        print(f"An unexpected error occurred while updating backend version: {e}")

if __name__ == "__main__":
    update_backend_version()