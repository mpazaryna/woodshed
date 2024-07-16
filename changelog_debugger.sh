#!/bin/bash

echo "Latest tag:"
git describe --tags --abbrev=0 2>/dev/null || echo "No tags found"

echo -e "\nAll tags:"
git tag -l

echo -e "\nLatest commit:"
git log -1 --pretty=format:"%h %s"

echo -e "\nLast 10 commits:"
git log -n 10 --pretty=format:"%h %s"

echo -e "\nCommits with conventional format:"
git log --pretty=format:"%h %s" | grep -E "^[^ ]+ (feat|fix|doc|chore):"

echo -e "\nGit log output (used by changelog generator):"
git log --pretty=format:"%H %s"

echo -e "\nChecking for line ending issues:"
git log --pretty=format:"%H %s" | od -c
