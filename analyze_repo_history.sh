#!/bin/bash

echo "All tags in reverse chronological order:"
git tag -l --sort=-v:refname

echo -e "\nLast 5 tags with their creation dates:"
git for-each-ref --sort=-taggerdate --format '%(refname:short) %(taggerdate:short)' refs/tags | head -n 5

echo -e "\nAll commits in the last 30 days:"
git log --since="30 days ago" --pretty=format:"%h %ad %s" --date=short

echo -e "\nAll commits with 'feat:', 'fix:', 'doc:', or 'chore:' in the last 30 days:"
git log --since="30 days ago" --pretty=format:"%h %ad %s" --date=short | grep -E "(feat|fix|doc|chore):"

echo -e "\nTotal number of commits:"
git rev-list --all --count

echo -e "\nFirst commit:"
git log --reverse --pretty=format:"%h %ad %s" --date=short | head -n 1

echo -e "\nMost recent commit:"
git log -1 --pretty=format:"%h %ad %s" --date=short
