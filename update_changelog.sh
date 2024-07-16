#!/bin/bash

set -e  # Exit immediately if a command exits with a non-zero status.

# Function to log debug messages
debug() {
    echo "DEBUG: $1" >&2
}

# Get the latest tag
latest_tag=$(git describe --tags --abbrev=0)
debug "Latest tag: $latest_tag"

# Get the commit hash of the latest tag
latest_tag_hash=$(git rev-list -n 1 $latest_tag)
debug "Latest tag hash: $latest_tag_hash"

# Get the date of the latest tag
latest_tag_date=$(git log -1 --format=%ai $latest_tag)
debug "Latest tag date: $latest_tag_date"

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

    local types=("feat" "fix" "doc" "chore")
    local titles=("Features" "Bug Fixes" "Documentation" "Chores")

    for i in "${!types[@]}"; do
        local type="${types[$i]}"
        local title="${titles[$i]}"
        
        echo "### $title"
        
        commits=$(git log $latest_tag_hash..HEAD --pretty=format:"%H %s" | grep "^[^ ]* $type:" || true)
        if [ -n "$commits" ]; then
            echo "$commits" | while read hash message; do
                format_commit "$hash" "${message#* $type: }"
            done
        else
            echo "No ${type} changes in this release."
        fi
        echo
    done
}

# Create a temporary file
temp_file=$(mktemp)
debug "Temporary file created: $temp_file"

# Generate the new changelog content
debug "Generating changelog content..."
generate_changelog > "$temp_file"

# Check if there's any content in the temp file
if [ -s "$temp_file" ]; then
    debug "New changelog content generated."
    
    # Check if CHANGELOG.md exists
    if [ -f CHANGELOG.md ]; then
        debug "Existing CHANGELOG.md found. Prepending new content."
        # Prepend the new content to the existing CHANGELOG.md
        cat "$temp_file" CHANGELOG.md > CHANGELOG.tmp && mv CHANGELOG.tmp CHANGELOG.md
    else
        debug "No existing CHANGELOG.md. Creating new file."
        # If CHANGELOG.md doesn't exist, create it with the new content
        cat "$temp_file" > CHANGELOG.md
    fi
    
    echo "Changelog updated successfully!"
else
    debug "No new changes to add to the changelog."
    echo "No new changes since the last tag. Changelog not updated."
fi

# Remove the temporary file
rm "$temp_file"
debug "Temporary file removed."
