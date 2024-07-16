#!/bin/bash

# Get the latest tag
latest_tag=$(git describe --tags --abbrev=0)
echo "Latest tag: $latest_tag"

# Get the commit hash of the latest tag
latest_tag_hash=$(git rev-list -n 1 $latest_tag)
echo "Latest tag hash: $latest_tag_hash"

# Get all commits between the latest tag and HEAD
echo "Commits since last tag:"
git log $latest_tag_hash..HEAD --oneline

echo -e "\nCommits matching conventional commit format:"
git log $latest_tag_hash..HEAD --pretty=format:"%h %s" | grep -E "^[^ ]+ (feat|fix|doc|chore):" || echo "No matching commits found"

echo -e "\nAll commit messages since last tag:"
git log $latest_tag_hash..HEAD --pretty=format:"%h %s"

echo -e "\nNumber of commits since last tag:"
git rev-list $latest_tag_hash..HEAD --count
