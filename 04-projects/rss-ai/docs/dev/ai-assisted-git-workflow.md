# AI-Assisted Git Workflow

This project uses an AI-Assisted Git Workflow to manage development and track AI contributions. This approach combines the power of AI-assisted coding with the version control capabilities of Git.

## Workflow Overview

1. **Incremental Development**: Each AI suggestion is implemented and committed separately.
1. **Immediate Testing**: After each AI-suggested change, tests are written or updated and run.
1. **Frequent Commits**: Changes are committed after each successful AI suggestion and passing test.
1. **Clear Commit Messages**: Commits clearly indicate which changes were AI-suggested.
1. **Easy Rollbacks**: The granular commit history allows for easy revertion if an AI suggestion causes issues.

## Commit Message Convention

- AI-suggested changes: `"AI: Brief description of the change"`
- Test additions/updates: `"Add/Update tests for [feature]"`
- Human-made changes: `"Human: Brief description of the change"`

## Benefits

- Detailed history of AI contributions
- Easy identification and isolation of AI-suggested code
- Simplified debugging and rollback process
- Clear separation between AI-suggested and human-written code
- Opportunity for critical evaluation of AI suggestions

## Rollback Procedure

If an AI suggestion needs to be reverted:

1. Use `git log` to identify the commit(s) to revert
1. Use `git revert <commit-hash>` to undo the changes
1. Run tests to ensure the system is in a working state
1. Push the revert commit(s) to the remote repository

This workflow enhances transparency, maintains code quality, and facilitates easier management of AI-assisted development.

## Example code

```bash
git log --oneline
git revert def5678
```
