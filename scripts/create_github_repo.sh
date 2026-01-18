#!/usr/bin/env bash
# Helper script to create a GitHub repo using the gh CLI and push the current repo.
# Requires: GitHub CLI (gh) installed and authenticated (gh auth login)

set -euo pipefail

if ! command -v gh >/dev/null 2>&1; then
  echo "Please install GitHub CLI (https://cli.github.com/) and run 'gh auth login' before using this script."
  exit 1
fi

if [ -z "${1:-}" ]; then
  echo "Usage: $0 owner/repo"
  exit 1
fi

REPO="$1"

echo "Creating GitHub repo $REPO..."
gh repo create "$REPO" --public --source=. --remote=origin --push
echo "Repo created and pushed. Remember to add secrets: FLY_API_TOKEN, etc."
