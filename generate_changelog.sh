#!/bin/bash

# Get the latest tag
latest_tag=$(git describe --tags --abbrev=0)

# Get the commit hash of the latest tag
latest_tag_hash=$(git rev-list -n 1 $latest_tag)

# Function to format commit messages
format_commit() {
    local hash=$1
    local message=$2
    echo "- $message (${hash:0:7})"
}

# Generate changelog
echo "Changelog"
echo "========="
echo

# Features
echo "Features:"
git log $latest_tag_hash..HEAD --pretty=format:"%H %s" | grep "^[^ ]* feat:" | while read hash message; do
    format_commit "$hash" "${message#* }"
done
echo

# Bug Fixes
echo "Bug Fixes:"
git log $latest_tag_hash..HEAD --pretty=format:"%H %s" | grep "^[^ ]* fix:" | while read hash message; do
    format_commit "$hash" "${message#* }"
done
echo

# Documentation
echo "Documentation:"
git log $latest_tag_hash..HEAD --pretty=format:"%H %s" | grep "^[^ ]* doc:" | while read hash message; do
    format_commit "$hash" "${message#* }"
done
echo

# Chores
echo "Chores:"
git log $latest_tag_hash..HEAD --pretty=format:"%H %s" | grep "^[^ ]* chore:" | while read hash message; do
    format_commit "$hash" "${message#* }"
done
