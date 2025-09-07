import sys
import re
import os


def get_release_notes(version, changelog_path):
    """
    Extracts release notes for a specific version from a CHANGELOG.md file.
    """
    try:
        with open(changelog_path, "r", encoding="utf-8") as f:
            changelog_content = f.read()
    except FileNotFoundError:
        return "No CHANGELOG.md file found."

    # Define the regex pattern to find the section for the given version.
    # It looks for a heading like '## [VERSION] - YYYY-MM-DD' and captures content
    # until the next heading or the end of the file.
    escaped_version = re.escape(version)
    pattern = r"##\s*\[\s*" + escaped_version + r"\s*\]\s*-\s*\d{4}-\d{2}-\d{2}\s*\n([\s\S]*?)(?=(?:\n##\s*\[|$))"

    match = re.search(pattern, changelog_content)

    if match:
        return match.group(1).strip()
    else:
        return "No release notes found for this version."


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Error: Version number not provided.")
        sys.exit(1)

    # Get the version from command-line arguments.
    version = sys.argv[1]

    # Construct the correct path to CHANGELOG.md relative to the script's location.
    script_dir = os.path.dirname(os.path.abspath(__file__))
    changelog_path = os.path.join(script_dir, "..", "frontend", "CHANGELOG.md")

    release_notes = get_release_notes(version, changelog_path)

    print(release_notes)
