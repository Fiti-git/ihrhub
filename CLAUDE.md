# Project rules

## Git

- **Do NOT add `Co-Authored-By: Claude ...` trailers to commit messages.** All commits are authored solely by the human developer.
- **Do NOT add `🤖 Generated with Claude Code` footers to PR descriptions.**
- Otherwise follow standard commit-message conventions (imperative summary, wrapped body, one topic per commit).

## Secrets

- This is a **public** repo. Never commit `.env`, tokens, API keys, or credentials of any kind.
- `.env.example` files are safe to commit and should stay in sync with the real env vars each app reads.

## Scope

- Prefer small, focused commits. Don't bundle theme changes with logic fixes.
- Ask before mass file renames, destructive git operations, or history rewrites once anyone else has cloned the repo.
