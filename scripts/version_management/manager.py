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

    def _update_readme_badge(
        self,
        package_json_relative_path: str,
        readme_relative_path: str,
        version_badge_regex: str,
        description: str,
    ):
        try:
            version = self._read_version_from_package_json(package_json_relative_path)
            readme_path = self.project_root / readme_relative_path

            with open(readme_path, "r", encoding="utf-8") as f:
                readme_content = f.read()

            new_readme_content = re.sub(version_badge_regex, r"\g<1>" + version + r"\g<2>", readme_content)

            if readme_content == new_readme_content:
                print(f"{description} version is already up to date.")
            else:
                with open(readme_path, "w", encoding="utf-8") as f:
                    f.write(new_readme_content)
                print(f"Updated {description} with version: {version}")
        except Exception as e:
            print(f"An error occurred while updating {description} badge: {e}")
            raise

    def _update_download_link(
        self,
        file_relative_path: str,
        version: str,
        regex_pattern: str,
        replacement_format: str,
        description: str,
    ):
        try:
            file_path = self.project_root / file_relative_path

            with open(file_path, "r", encoding="utf-8") as f:
                file_content = f.read()

            new_content = re.sub(regex_pattern, replacement_format.format(version=version), file_content)

            if file_content == new_content:
                print(f"{description} download link is already up to date.")
            else:
                with open(file_path, "w", encoding="utf-8") as f:
                    f.write(new_content)
                print(f"Updated {description} download link with version: {version}")
        except Exception as e:
            print(f"An error occurred while updating {description} download link: {e}")
            raise

    def update_project_readme_versions(self):
        try:
            frontend_version = self._read_version_from_package_json("frontend/package.json")

            # Update main README.md badge
            self._update_readme_badge(
                "frontend/package.json",
                "README.md",
                r'(<img alt="version" src="https://img\.shields\.io/badge/version-)[0-9]+\.[0-9]+\.[0-9]+(-.*?">)',
                "Main README.md badge",
            )

            # Update website/README.md badge
            self._update_readme_badge(
                "website/package.json",
                "website/README.md",
                r"(!\[version\]\(https://img\.shields\.io/badge/version-)[0-9]+\.[0-9]+\.[0-9]+(-[^\]]+\))",
                "Website README.md badge",
            )

            # Update README.md download link
            self._update_download_link(
                "README.md",
                frontend_version,
                r"\[HoHatch\.zip\]\(https://github\.com/dracoboost/hohatch/releases/latest/download/HoHatch\.zip\)",
                r"[HoHatch-v{version}\.zip](https://github.com/dracoboost/hohatch/releases/latest/download/HoHatch-v{version}.zip)",
                "Main README.md download link",
            )

            # Update website/app/page.tsx download links
            self._update_download_link(
                "website/app/page.tsx",
                frontend_version,
                r'"downloadUrl": "https://github\.com/dracoboost/hohatch/releases/latest"',
                r'"downloadUrl": "https://github.com/dracoboost/hohatch/releases/latest/download/HoHatch-v{version}.zip"',
                "Website app/page.tsx JSON-LD downloadUrl",
            )
            self._update_download_link(
                "website/app/page.tsx",
                frontend_version,
                r'Link href="https://github\.com/dracoboost/hohatch/releases/latest"',
                r'Link href="https://github.com/dracoboost/hohatch/releases/latest/download/HoHatch-v{version}.zip"',
                "Website app/page.tsx Button download link",
            )

            # Update website/content/index.md download link
            self._update_download_link(
                "website/content/index.md",
                frontend_version,
                r"\[latest HoHatch\](https://github\.com/dracoboost/hohatch/releases/latest)",
                r"[latest HoHatch](https://github.com/dracoboost/hohatch/releases/latest/download/HoHatch-v{version}.zip)",
                "Website content/index.md download link",
            )
        except Exception as e:
            print(f"An error occurred during project README version update: {e}")
            raise


# Entry points for external scripts
def update_backend_version_entry_point():
    manager = VersionManager(Path(__file__).parent.parent.parent)
    manager.update_backend_app_version()


def update_project_readme_versions_entry_point():
    manager = VersionManager(Path(__file__).parent.parent.parent)
    manager.update_project_readme_versions()


if __name__ == "__main__":
    import sys

    if len(sys.argv) != 2:
        print("Usage: python -m scripts.version_management.manager <entry_point>")
        sys.exit(1)

    entry_point = sys.argv[1]
    if entry_point == "update_backend_version_entry_point":
        update_backend_version_entry_point()
    elif entry_point == "update_project_readme_versions_entry_point":
        update_project_readme_versions_entry_point()
    else:
        print(f"Unknown entry point: {entry_point}")
        sys.exit(1)
