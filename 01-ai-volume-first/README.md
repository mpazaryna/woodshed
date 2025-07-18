# AI and ML Projects and Learning Experiments

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue)](https://www.linkedin.com/in/mpazaryna/)

## Development Tasks

We use `tasks.py` to manage common development tasks. This file contains various commands that help streamline our workflow, such as formatting code and running tests.

## Conda Environment

```shell
conda env export > environment.yml
```

## Gitflow with AI

This is a nuanced question that touches on both practical development workflow and collaboration best practices. Let me share my perspective:

For AI-assisted development specifically:

- Making frequent small commits while working with AI is actually a good practice because:
  1. It helps you track which changes were AI-suggested vs your own modifications
  2. It makes it easier to roll back if an AI suggestion breaks something
  3. It creates natural checkpoints when experimenting with AI suggestions

However, when it comes to pushing to the shared repository:

- Squashing these micro-commits often makes sense because:
  1. Each commit in the main repo should represent a logical, complete change
  2. The commit history should tell a clear story to other developers
  3. Having too many tiny commits can make code review more difficult

My recommendation would be:

1. Make frequent local commits while working with AI
2. Before pushing, use interactive rebase (`git rebase -i`) to squash related commits into logical units
3. Each final commit should be:
   - Working (passes tests)
   - Complete (implements a full feature/fix)
   - Coherent (changes are related to each other)

## Github Desktop

This can be done in github desktop.

- Select the commits to squash and drop them on the commit you want to combine them with.
- You can select one commit or select multiple commits using Command or Shift.
- Modify the commit message of your new commit.
- The commit messages of the selected commits you want to squash are pre-filled into the Summary and Description fields.
