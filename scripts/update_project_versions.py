import json
import re
from pathlib import Path


def _update_readme_badge(
    project_root: Path,
    package_json_relative_path: str,
    readme_relative_path: str,
    version_badge_regex: str,
    description: str,
):
    package_json_path = project_root / package_json_relative_path
    readme_path = project_root / readme_relative_path

    try:
        # Read version from package.json
        with open(package_json_path, "r", encoding="utf-8") as f:
            package_json = json.load(f)
        version = package_json.get("version")

        if not version:
            print(f"Error: 'version' not found in {package_json_path}")
            return

        # Read README.md content
        with open(readme_path, "r", encoding="utf-8") as f:
            readme_content = f.read()

        # Regex to find and replace the version in the README.md badge
        new_readme_content = re.sub(version_badge_regex, r"\g<1>" + version + r"\g<2>", readme_content)

        if readme_content == new_readme_content:
            print(f"{description} version is already up to date.")
        else:
            with open(readme_path, "w", encoding="utf-8") as f:
                f.write(new_readme_content)
            print(f"Updated {description} with version: {version}")

    except FileNotFoundError as e:
        print(f"Error: File not found - {e.filename}")
    except json.JSONDecodeError:
        print(f"Error: Invalid JSON in {package_json_path}")
    except Exception as e:
        print(f"An unexpected error occurred while updating {description}: {e}")


def _update_download_link(
    project_root: Path,
    file_relative_path: str,
    version: str,
    regex_pattern: str,
    replacement_format: str,
    description: str,
):
    file_path = project_root / file_relative_path

    try:
        with open(file_path, "r", encoding="utf-8") as f:
            file_content = f.read()

        new_content = re.sub(regex_pattern, replacement_format.format(version=version), file_content)

        if file_content == new_content:
            print(f"{description} download link is already up to date.")
        else:
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(new_content)
            print(f"Updated {description} download link with version: {version}")

    except FileNotFoundError as e:
        print(f"Error: File not found - {e.filename}")
    except Exception as e:
        print(f"An unexpected error occurred while updating {description} download link: {e}")


def update_readme_versions():
    project_root = Path(__file__).parent.parent

    # Get frontend version (used for all download links)
    frontend_package_json_path = project_root / "frontend" / "package.json"
    try:
        with open(frontend_package_json_path, "r", encoding="utf-8") as f:
            frontend_package_json = json.load(f)
        frontend_version = frontend_package_json.get("version")
        if not frontend_version:
            print(f"Error: 'version' not found in {frontend_package_json_path}. Cannot update download links.")
            return
    except (FileNotFoundError, json.JSONDecodeError) as e:
        print(f"Error reading frontend package.json: {e}. Cannot update download links.")
        return

    # Update main README.md badge
    _update_readme_badge(
        project_root,
        "frontend/package.json",
        "README.md",
        r'(<img alt="version" src="https://img\.shields\.io/badge/version-)[0-9]+\\.[0-9]+\\.[0-9]+(-.*?">)',
        "Main README.md badge",
    )

    # Update website/README.md badge
    _update_readme_badge(
        project_root,
        "website/package.json",
        "website/README.md",
        r'(!\[version\]\\(https://img\.shields\.io/badge/version-)[0-9]+\\.[0-9]+\\.[0-9]+(-[^\]]+\\))',
        "Website README.md badge",
    )

    # Update README.md download link
    _update_download_link(
        project_root,
        "README.md",
        frontend_version,
        r'\[HoHatch\\.zip\]\\(https://github\\.com/dracoboost/hohatch/releases/latest/download/HoHatch\\.zip\\)',
        r'[HoHatch-v{version}\\.zip](https://github.com/dracoboost/hohatch/releases/latest/download/HoHatch-v{version}.zip)',
        "Main README.md download link",
    )

    # Update website/app/page.tsx download links
    _update_download_link(
        project_root,
        "website/app/page.tsx",
        frontend_version,
        r'"downloadUrl": "https://github\\.com/dracoboost/hohatch/releases/latest"' ,
        r'"downloadUrl": "https://github.com/dracoboost/hohatch/releases/latest/download/HoHatch-v{version}.zip"' ,
        "Website app/page.tsx JSON-LD downloadUrl",
    )
    _update_download_link(
        project_root,
        "website/app/page.tsx",
        frontend_version,
        r'Link href="https://github\\.com/dracoboost/hohatch/releases/latest"' ,
        r'Link href="https://github.com/dracoboost/hohatch/releases/latest/download/HoHatch-v{version}.zip"' ,
        "Website app/page.tsx Button download link",
    )

    # Update website/content/index.md download link
    _update_download_link(
        project_root,
        "website/content/index.md",
        frontend_version,
        r'\[latest HoHatch\]\\(https://github\\.com/dracoboost/hohatch/releases/latest\)',
        r'\[latest HoHatch\](https://github.com/dracoboost/hohatch/releases/latest/download/HoHatch-v{version}.zip)',
        "Website content/index.md download link",
    )


if __name__ == "__main__":
    update_readme_versions()
