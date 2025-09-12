import json
import re
import urllib.request
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

    def _get_remote_version(self, url: str) -> str:
        try:
            with urllib.request.urlopen(url) as response:
                if response.status == 200:
                    content = response.read().decode("utf-8")
                    package_json = json.loads(content)
                    version = package_json.get("version")
                    if not version:
                        raise ValueError(f"'version' not found in remote file at {url}")
                    return version
                else:
                    # Don't raise an exception for non-critical checks, just print a warning
                    print(f"Warning: Failed to fetch {url}, status code: {response.status}")
                    return "0.0.0"  # Return a base version to avoid breaking comparison
        except Exception as e:
            print(f"Warning: Error fetching remote version from {url}: {e}")
            return "0.0.0"

    def _is_newer(self, local_version: str, remote_version: str) -> bool:
        try:
            local_parts = [int(p) for p in local_version.split(".")]
            remote_parts = [int(p) for p in remote_version.split(".")]

            # Pad shorter version with zeros for safe comparison
            while len(local_parts) < len(remote_parts):
                local_parts.append(0)
            while len(remote_parts) < len(local_parts):
                remote_parts.append(0)

            for i in range(len(local_parts)):
                if local_parts[i] > remote_parts[i]:
                    return True
                if local_parts[i] < remote_parts[i]:
                    return False
            return False  # versions are equal
        except (ValueError, IndexError):
            # Handle cases like "1.0.0-beta" or invalid formats
            print(f"Warning: Could not compare versions '{local_version}' and '{remote_version}'. Assuming not newer.")
            return False

    def check_changelog_updates(self):
        urls = {
            "frontend": "https://raw.githubusercontent.com/dracoboost/hohatch/refs/heads/master/frontend/package.json",
            "website": "https://raw.githubusercontent.com/dracoboost/hohatch/refs/heads/master/website/package.json",
        }

        print("\nChecking for version changes against master branch...")

        # Frontend check
        local_frontend_version = self._read_version_from_package_json("frontend/package.json")
        remote_frontend_version = self._get_remote_version(urls["frontend"])
        if self._is_newer(local_frontend_version, remote_frontend_version):
            print("Warning: frontend version is newer than master. Please update the changelog at frontend/CHANGELOG.md.")

        # Website check
        local_website_version = self._read_version_from_package_json("website/package.json")
        remote_website_version = self._get_remote_version(urls["website"])
        if self._is_newer(local_website_version, remote_website_version):
            print("Warning: website version is newer than master. Please update the changelog at website/CHANGELOG.md.")

    def update_backend_app_version(self):
        try:
            frontend_version = self._read_version_from_package_json("frontend/package.json")

            backend_version_file_path = self.project_root / "backend" / "version.py"
            rc_template_path = self.project_root / "backend" / "version.rc.template"
            rc_output_path = self.project_root / "backend" / "version.rc"

            # Update backend/version.py
            with open(backend_version_file_path, "w", encoding="utf-8") as f:
                f.write(f'APP_VERSION = "{frontend_version}"\n')
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
            self.check_changelog_updates()

            frontend_version = self._read_version_from_package_json("frontend/package.json")

            self.update_backend_app_version()

            # Update website/app/page.tsx
            page_tsx_path = self.project_root / "website" / "app" / "page.tsx"
            page_tsx_patterns = [
                (
                    r'(src="https://img.shields.io/badge/version-)[^"]+-b7465a(")',
                    rf"\g<1>{frontend_version}-b7465a\g<2>",
                ),
                (
                    r'("downloadUrl":\s*"https://github.com/dracoboost/hohatch/releases/latest/download/HoHatch-v)[0-9]+\.[0-9]+\.[0-9]+(\.zip")',
                    rf"\g<1>{frontend_version}\g<2>",
                ),
                (
                    r'(<Link href="https://github.com/dracoboost/hohatch/releases/latest/download/HoHatch-v)[0-9]+\.[0-9]+\.[0-9]+(" isExternal>)"',
                    rf"\g<1>{frontend_version}\g<2>",
                ),
                (r"(Download Latest HoHatch \(v)[0-9]+\.[0-9]+\.[0-9]+(\)\])", rf"\g<1>{frontend_version}\g<2>"),
            ]
            self._update_file_content(page_tsx_path, page_tsx_patterns, "website/app/page.tsx")

            # Update website/components/WebsiteHeader.tsx download link
            website_header_path = self.project_root / "website" / "components" / "WebsiteHeader.tsx"
            website_header_patterns = [
                (
                    r'(<Link href="https://github.com/dracoboost/hohatch/releases/latest/download/HoHatch-v)[0-9]+\.[0-9]+\.[0-9]+(\.zip" isExternal>)"',
                    rf"\g<1>{frontend_version}\g<2>",
                ),
                (r"(Download Latest HoHatch \(v)[0-9]+\.[0-9]+\.[0-9]+(\)\])", rf"\g<1>{frontend_version}\g<2>"),
            ]
            self._update_file_content(
                website_header_path, website_header_patterns, "website/components/WebsiteHeader.tsx"
            )

            # Update website/content/index.md
            index_md_path = self.project_root / "website" / "content" / "index.md"
            index_md_patterns = [
                (r"(\［latest HoHatch \(v)[0-9.]+(\)\])", rf"\g<1>{frontend_version}\g<2>"),
                (
                    r"(\(https://github.com/dracoboost/hohatch/releases/latest/download/HoHatch-v)[0-9.]+(\.zip\))",
                    rf"\g<1>{frontend_version}\g<2>",
                ),
            ]
            self._update_file_content(index_md_path, index_md_patterns, "website/content/index.md")

            # Update frontend/config/consts.ts
            self._update_file_content(
                self.project_root / "frontend" / "config" / "consts.ts",
                [(r'(export const appVersion = ")([0-9]+\.[0-9]+\.[0-9]+)(")', rf"\g<1>{frontend_version}\g<3>")],
                "Frontend consts.ts version",
            )

            # Update main README.md badge
            self._update_file_content(
                self.project_root / "README.md",
                [
                    (
                        r'(<img alt="version" src="https://img.shields.io/badge/version-)[0-9]+\.[0-9]+\.[0-9]+(-[^\"]*"></a>)',
                        rf"\g<1>{frontend_version}\g<2>",
                    )
                ],
                "Main README.md badge",
            )

            # Update website/README.md badge
            self._update_file_content(
                self.project_root / "website" / "README.md",
                [
                    (
                        r"(!\[version\]\(https://img.shields.io/badge/version-)[0-9]+\.[0-9]+\.[0-9]+(-[^)]+\))",
                        rf"\g<1>{frontend_version}\g<2>",
                    )
                ],
                "Website README.md badge",
            )

            # Update README.md download link
            self._update_file_content(
                self.project_root / "README.md",
                [
                    (
                        r"(\[HoHatch-v)[0-9]+\.[0-9]+\.[0-9]+(\]\(https://github.com/dracoboost/hohatch/releases/latest/download/HoHatch-v)[0-9.]+(\.zip\))",
                        rf"\g<1>{frontend_version}\g<2>{frontend_version}\g<3>",
                    )
                ],
                "Main README.md download link",
            )

        except Exception as e:
            print(f"An error occurred during project README version update: {e}")
            raise


# Entry points for external scripts
def update_backend_version_entry_point():
    manager = VersionManager(Path(__file__).parent.parent.parent)
    manager.update_backend_app_version()


def update_all_versions_entry_point():
    manager = VersionManager(Path(__file__).parent.parent.parent)
    manager.update_all_project_versions()


if __name__ == "__main__":
    import sys

    if len(sys.argv) != 2:
        print("Usage: python -m scripts.version_management.manager <entry_point>")
        sys.exit(1)

    entry_point = sys.argv[1]
    if entry_point == "update_backend_version_entry_point":
        update_backend_version_entry_point()
    elif entry_point == "update_all_versions_entry_point":
        update_all_versions_entry_point()
    else:
        print(f"Unknown entry point: {entry_point}")
        sys.exit(1)
