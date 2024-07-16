#!/bin/bash

# Get the latest tag
latest_tag=$(git describe --tags --abbrev=0)

# Get the commit hash of the latest tag
latest_tag_hash=$(git rev-list -n 1 $latest_tag)

# Get the date of the latest tag
latest_tag_date=$(git log -1 --format=%ai $latest_tag)

# Function to format date (compatible with both BSD and GNU date)
format_date() {
    if date -j >/dev/null 2>&1; then
        # BSD date (macOS)
        date -j -f "%Y-%m-%d %H:%M:%S %z" "$1" "+%Y-%m-%d"
    else
        # GNU date (Linux)
        date -d "$1" "+%Y-%m-%d"
    fi
}

# Function to format commit messages
format_commit() {
    local hash=$1
    local message=$2
    echo "- $message (${hash:0:7})"
}

# Generate changelog
generate_changelog() {
    echo "## [$latest_tag] - $(format_date "$latest_tag_date")"
    echo

    # Features
    echo "### Features"
    git log $latest_tag_hash..HEAD --pretty=format:"%H %s" | grep "^[^ ]* feat:" | while read hash message; do
        format_commit "$hash" "${message#* feat: }"
    done
    echo

    # Bug Fixes
    echo "### Bug Fixes"
    git log $latest_tag_hash..HEAD --pretty=format:"%H %s" | grep "^[^ ]* fix:" | while read hash message; do
        format_commit "$hash" "${message#* fix: }"
    done
    echo

    # Documentation
    echo "### Documentation"
    git log $latest_tag_hash..HEAD --pretty=format:"%H %s" | grep "^[^ ]* doc:" | while read hash message; do
        format_commit "$hash" "${message#* doc: }"
    done
    echo

    # Chores
    echo "### Chores"
    git log $latest_tag_hash..HEAD --pretty=format:"%H %s" | grep "^[^ ]* chore:" | while read hash message; do
        format_commit "$hash" "${message#* chore: }"
    done
    echo
}

# Create a temporary file
temp_file=$(mktemp)

# Generate the new changelog content
generate_changelog > "$temp_file"

# Check if CHANGELOG.md exists
if [ -f CHANGELOG.md ]; then
    # Prepend the new content to the existing CHANGELOG.md
    cat "$temp_file" CHANGELOG.md > CHANGELOG.tmp && mv CHANGELOG.tmp CHANGELOG.md
else
    # If CHANGELOG.md doesn't exist, create it with the new content
    cat "$temp_file" > CHANGELOG.md
fi

# Remove the temporary file
rm "$temp_file"

echo "Changelog updated successfully!"
