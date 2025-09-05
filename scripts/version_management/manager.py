import json
import re
from pathlib import Path


class VersionManager:
    def __init__(self, project_root: Path):
        self.project_root = project_root

    def _read_version_from_package_json(self, package_json_relative_path: str) -> str:
        package_json_path = self.project_root / package_json_relative_path
        try:
            with open(package_json_path, "r", encoding="utf-8") as f:
                package_json = json.load(f)
            version = package_json.get("version")
            if not version:
                raise ValueError(f"'version' not found in {package_json_path}")
            return version
        except FileNotFoundError:
            raise FileNotFoundError(f"Package.json not found at {package_json_path}")
        except json.JSONDecodeError:
            raise ValueError(f"Invalid JSON in {package_json_path}")

    def update_backend_app_version(self):
        try:
            frontend_version = self._read_version_from_package_json("frontend/package.json")

            backend_version_file_path = self.project_root / "backend" / "version.py"
            rc_template_path = self.project_root / "backend" / "version.rc.template"
            rc_output_path = self.project_root / "backend" / "version.rc"

            # Update backend/version.py
            with open(backend_version_file_path, "w", encoding="utf-8") as f:
                f.write(f'APP_VERSION = "{frontend_version}"')
            print(f"Updated backend version to: {frontend_version}")

            # Generate backend/version.rc from template
            version_parts = frontend_version.split(".")
            version_tuple_str = f"({version_parts[0]}, {version_parts[1]}, {version_parts[2]}, 0)"
            version_dot = frontend_version

            with open(rc_template_path, "r", encoding="utf-8") as f:
                rc_template_content = f.read()

            rc_content = rc_template_content.replace("{VERSION_TUPLE}", version_tuple_str)
            rc_content = rc_content.replace("{VERSION_DOT}", version_dot)

            with open(rc_output_path, "w", encoding="utf-8") as f:
                f.write(rc_content)
            print(f"Generated version.rc with version: {frontend_version}")

        except Exception as e:
            print(f"An error occurred during backend version update: {e}")
            raise

    def _update_file_content(self, file_path: Path, patterns: list[tuple[str, str]], description: str):
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                content = f.read()

            original_content = content

            for pattern, replacement in patterns:
                content = re.sub(pattern, replacement, content)

            if original_content == content:
                print(f"{description} is already up to date.")
            else:
                with open(file_path, "w", encoding="utf-8") as f:
                    f.write(content)
                print(f"Updated {description}.")
        except Exception as e:
            print(f"An error occurred while updating {description}: {e}")
            raise

    def update_all_project_versions(self):
        try:
            frontend_version = self._read_version_from_package_json("frontend/package.json")
            website_version = self._read_version_from_package_json("website/package.json")

            # Update website/app/page.tsx
            page_tsx_path = self.project_root / "website" / "app" / "page.tsx"
            page_tsx_patterns = [
                (
                    r'(src="https://img.shields.io/badge/version-)[^"]+-b7465a(")',
                    rf"\g<1>{website_version}-b7465a\g<2>",
                ),
                (
                    r'("downloadUrl":\s*"https://github.com/dracoboost/hohatch/releases/latest/download/HoHatch-v)[0-9]+\.[0-9]+\.[0-9]+(\.zip")',
                    rf"\g<1>{website_version}\g<2>",
                ),
                (
                    r'(<Link href="https://github.com/dracoboost/hohatch/releases/latest/download/HoHatch-v)[0-9]+\.[0-9]+\.[0-9]+(" isExternal>)',
                    rf"\g<1>{website_version}\g<2>",
                ),
                (r"(Download Latest HoHatch \(v)[0-9]+\.[0-9]+\.[0-9]+(\))", rf"\g<1>{website_version}\g<2>"),
            ]
            self._update_file_content(page_tsx_path, page_tsx_patterns, "website/app/page.tsx")

            # Update website/content/index.md
            index_md_path = self.project_root / "website" / "content" / "index.md"
            index_md_patterns = [
                (r"(\[latest HoHatch \(v)[0-9.]+\)\]", rf"\g<1>{website_version}\g<2>"),
                (
                    r"(\(https://github.com/dracoboost/hohatch/releases/latest/download/HoHatch-v)[0-9.]+(\.zip\))",
                    rf"\g<1>{website_version}\g<2>",
                ),
            ]
            self._update_file_content(index_md_path, index_md_patterns, "website/content/index.md")

            # Update frontend/config/consts.ts
            self._update_file_content(
                self.project_root / "frontend" / "config" / "consts.ts",
                [(r'(export const appVersion = ")([0-9]+\.[0-9]+\.[0-9]+)(")', rf"\g<1>{frontend_version}\g<3>