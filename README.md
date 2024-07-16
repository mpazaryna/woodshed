# woodshed

## Learning in Public

This is a mono repository of all learning projects that I've done over the course of my developer career.

## Generate CHANGELOG.md

# Ensure you're on the branch you want to release (e.g., main or master)
git checkout main

# Pull the latest changes
git pull origin main

# Run the changelog generator
./update_changelog.sh

# Review the changes in CHANGELOG.md
# Edit if necessary

# Commit the updated changelog
git add CHANGELOG.md
git commit -m "docs: update changelog for version X.Y.Z"

# Create the new tag
git tag -a vX.Y.Z -m "Release X.Y.Z"

# Push the commit and the new tag
git push origin main
git push origin vX.Y.Z