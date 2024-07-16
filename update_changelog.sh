#!/bin/bash

set -e  # Exit immediately if a command exits with a non-zero status.

# Function to log debug messages
debug() {
    echo "DEBUG: $1" >&2
}

# Get all tags sorted by creation date (newest first)
tags=$(git for-each-ref --sort=-creatordate --format '%(refname:short)' refs/tags)
debug "All tags: $tags"

# Function to format commit messages
format_commit() {
    local hash=$1
    local message=$2
    echo "- $message (${hash:0:7})"
}

# Generate changelog
generate_changelog() {
    echo "# Changelog"
    echo

    local prev_tag=""
    for tag in $tags; do
        debug "Processing tag: $tag"
        echo "## [$tag] - $(git log -1 --format=%ai $tag)"
        echo

        local types=("feat" "fix" "doc" "chore")
        local titles=("Features" "Bug Fixes" "Documentation" "Chores")

        for i in "${!types[@]}"; do
            local type="${types[$i]}"
            local title="${titles[$i]}"
            
            echo "### $title"
            
            if [ -z "$prev_tag" ]; then
                commits=$(git log --no-merges $tag --pretty=format:"%H§%s" | grep -E "^[^§]+§$type:" || true)
            else
                commits=$(git log --no-merges $prev_tag..$tag --pretty=format:"%H§%s" | grep -E "^[^§]+§$type:" || true)
            fi
            debug "Found commits for $type: $commits"
            
            if [ -n "$commits" ]; then
                echo "$commits" | while IFS='§' read -r hash message; do
                    debug "Processing commit: $hash $message"
                    format_commit "$hash" "${message#* $type: }"
                done
            else
                echo "No $type changes in this release."
            fi
            echo
        done

        prev_tag=$tag
    done
}

# Generate the changelog content
debug "Generating changelog content..."
generate_changelog > CHANGELOG.md

echo "Changelog updated successfully!"
