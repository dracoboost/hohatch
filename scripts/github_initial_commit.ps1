# ./scripts/upload_to_github.ps1
# Upload local project to GitHub with gh CLI

# --- Configuration ---
# Get parent directory of the script's folder
# cf. ./scripts/github_initial_commit.ps1 -> WORK_DIR=.
$WORK_DIR = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Definition)

# Repository description (optional)
$REPO_DESCRIPTION = ""
# --- End of configuration ---

# Ask user whether the repository should be private or public
$choice = Read-Host "Do you want the repository to be private or public? [private/public] (default: private)"

# Remove leading/trailing spaces and convert to lowercase
$choice = $choice.Trim().ToLower()

if ($choice -eq "public") {
    $PRIVATE_OR_PUBLIC_FLAG = "--public"
} else {
    # Default to private for empty input or "private"
    $PRIVATE_OR_PUBLIC_FLAG = "--private"
}

# GitHub repository name
$TRIMMED_WORK_DIR = $WORK_DIR.TrimEnd('\','/')
$REPO_NAME = Split-Path $TRIMMED_WORK_DIR -Leaf

# Change to working directory
if (-not (Test-Path $WORK_DIR)) {
    Write-Error "Error: The specified working directory '$WORK_DIR' was not found."
    exit 1
}
Set-Location $WORK_DIR
Write-Output "Working directory: $(Get-Location)"

# Check if Git is initialized
if (-not (Test-Path ".git")) {
    Write-Output "Initializing Git repository..."
    git init
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Error: Failed to initialize Git."
        exit 1
    }
} else {
    Write-Output "Git repository already initialized."
}

# Stage all files
Write-Output "Staging all changes..."
git add .
if ($LASTEXITCODE -ne 0) {
    Write-Error "Error: git add failed."
    exit 1
}

# Commit
Write-Output "Creating initial commit..."
git commit -m "Initial commit"
if ($LASTEXITCODE -ne 0) {
    Write-Warning "git commit failed. There may be no changes to commit."
    $status = git status --porcelain
    if ($status) {
        Write-Error "However, uncommitted changes still exist."
        exit 1
    } else {
        Write-Output "No changes to commit. Continuing..."
    }
}

# Create repository on GitHub
Write-Output "Creating GitHub repository '$REPO_NAME' ($PRIVATE_OR_PUBLIC_FLAG)..."
if (Get-Command gh -ErrorAction SilentlyContinue) {
    gh repo create "dracoboost/$REPO_NAME" $PRIVATE_OR_PUBLIC_FLAG --source=. --description $REPO_DESCRIPTION --remote=upstream --push
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Error: Failed to create repository with gh CLI. Please check authentication."
        Write-Output "You may need to create the repository manually and set the remote URL:"
        Write-Output "  git remote add origin git@github.com:dracoboost/$REPO_NAME.git"
        Write-Output "  git branch -M main"
        Write-Output "  git push -u origin main"
        exit 1
    }
    Write-Output "Repository '$REPO_NAME' has been created on GitHub and pushed."
} else {
    Write-Error "GitHub CLI (gh) is not installed or not authenticated."
    Write-Output "Please create a repository manually: https://github.com/new"
    Write-Output "After creating it, run the following commands:"
    Write-Output "  git remote add origin git@github.com:dracoboost/$REPO_NAME.git"
    Write-Output "  git branch -M main"
    Write-Output "  git push -u origin main"
    exit 1
}

Write-Output "Script completed successfully!"
Write-Output "GitHub repository URL: https://github.com/dracoboost/$REPO_NAME"
