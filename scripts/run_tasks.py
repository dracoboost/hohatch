#!/usr/bin/env python3
# $ python scripts/run_tasks.py p
import re
import shutil
import subprocess
import sys
import threading

C_RESET = "\033[m"
C_GRAY = "\033[0;38;5;245m"
C_RED = "\033[0;31;49m"
C_GREEN = "\033[0;32;49m"
C_BLUE = "\033[0;34;49m"
C_YELLOW = "\033[0;33;49m"
C_BOLD_BLUE = "\033[1;34;49m"
C_BOLD = "\033[1;39;49m"

INPUT_FILE = "./input.md"
COLUMN_LIM = min(shutil.get_terminal_size((80, 20)).columns - 10, 120)


def hr(title=""):
    side = "-" * ((COLUMN_LIM - len(title) - 2) // 2)
    print(f"{side} {title} {side}")


def indicator(symbol, *message):
    color = {"$": C_YELLOW, "#": C_BLUE, "!": C_RED, "-": C_RED, "+": C_GREEN}.get(symbol, "")
    print(f"[{color}{symbol}{C_RESET}] {' '.join(message)}")


def get_git_remote_url():
    try:
        # Execute the git command to get the remote origin URL
        result = subprocess.run(
            ["git", "config", "--get", "remote.origin.url"],
            capture_output=True,
            text=True,
            check=True
        )
        # Strip whitespace and return the URL
        return result.stdout.strip()
    except subprocess.CalledProcessError as e:
        indicator("!", f"Error getting git remote URL: {e}")
        return None
    except FileNotFoundError:
        indicator("!", "Git command not found. Please ensure Git is installed and in your PATH.")
        return None


def search(keyword, file_path=INPUT_FILE):
    try:
        with open(file_path, encoding="utf-8") as f:
            for line in f:
                words = line.strip().split()
                for word in words:
                    if re.search(keyword, word):
                        return word, line.strip()
        return None, None
    except FileNotFoundError:
        return None, None


def confirm(message="Do you want to continue?", timeout=10):
    res = [""]

    def user_input():
        try:
            res[0] = input(f"{message} [Y/n]: ").strip().lower()
        except EOFError:
            res[0] = "n"

    thread = threading.Thread(target=user_input)
    thread.daemon = True
    thread.start()
    thread.join(timeout)

    if thread.is_alive():
        print("\nTimed out.")
        return False

    return res[0] in ["", "y", "yes"]


def git_push():
    _, line = search("-m")
    comment = line[3:] if line else "Update"

    if not confirm(f'{C_BOLD_BLUE}-m "{comment}"{C_RESET} has been set.'):
        return

    indicator("$", f"{C_BOLD}python3 backup.py{C_RESET}")
    subprocess.run(["python3", "backup.py"])

    indicator("$", f"{C_BOLD}git add --all{C_RESET}")
    subprocess.run(["git", "add", "--all"])

    indicator("$", f'{C_BOLD}git commit {C_BOLD_BLUE}-m "{comment}"{C_RESET}{C_BOLD} .{C_RESET}')
    subprocess.run(["git", "commit", "-m", comment])

    indicator("$", f"{C_BOLD}git push upstream master{C_RESET}")
    subprocess.run(["git", "push", "upstream", "master"])

    repo_url = get_git_remote_url()
    if repo_url:
        indicator("#", f"{C_BOLD_BLUE} @see {repo_url}{C_RESET}")
    else:
        indicator("#", f"{C_BOLD_BLUE} @see (Repository URL not found){C_RESET}")


def main():
    hr("Execution Result")
    args = sys.argv[1:]
    positional_arg = args[0] if args else ""

    indicator("#", f"positional arg: {positional_arg if positional_arg else f'{C_GRAY}(not found){C_RESET}'}")

    if positional_arg == "":
        # indicator("#", "mdbook build")
        # subprocess.run(["mdbook", "build"])
        # shutil.copy("book/pdf/output.pdf", "book/python_2022.pdf")
        indicator("!", "An error occurred.")
        sys.exit(1)
    elif positional_arg == "p":
        indicator("#", "git push")
        git_push()
    else:
        indicator("!", "An error occurred.")
        sys.exit(1)

    hr()
    sys.exit(0)


if __name__ == "__main__":
    main()
