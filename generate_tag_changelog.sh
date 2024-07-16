#!/bin/bash

set -e  # Exit immediately if a command exits with a non-zero status.

# Function to log debug messages
debug() {
    echo "DEBUG: $1" >&2
}

# Check if a tag was provided
if [ $# -eq 0 ]; then
    echo "Please provide a tag as an argument."
    echo "Usage: $0 <tag>"
    exit 1
fi

current_tag=$1
output_file="changelog_${current_tag}.txt"

# Function to format commit messages
format_commit() {
    local hash=$1
    local message=$2
    echo "- ${message#* } (${hash:0:7})"
}

# Find the previous tag
previous_tag=$(git describe --tags --abbrev=0 ${current_tag}^ 2>/dev/null || echo "")

# Get the date of the current tag
tag_date=$(git log -1 --format=%ai $current_tag)

# Generate changelog
generate_changelog() {
    echo "## [$current_tag] - $tag_date"
    echo

    if [ -z "$previous_tag" ]; then
        debug "No previous tag found. Including all commits up to $current_tag."
        range="$current_tag"
    else
        debug "Previous tag: $previous_tag"
        range="$previous_tag..$current_tag"
    fi

    local types=("feat" "fix" "docs" "chore")
    local titles=("Features" "Bug Fixes" "Documentation" "Chores")

    for i in "${!types[@]}"; do
        local type="${types[$i]}"
        local title="${titles[$i]}"
        
        commits=$(git log --no-merges $range --pretty=format:"%H§%s" | grep -E "^[^§]+§$type:" || true)
        
        if [ -n "$commits" ]; then
            echo "### $title"
            echo "$commits" | while IFS='§' read -r hash message; do
                format_commit "$hash" "$message"
            done
            echo
        fi
    done
}

# Generate the changelog content
debug "Generating changelog for $current_tag..."
generate_changelog > "$output_file"

echo "Changelog for $current_tag has been written to $output_file"