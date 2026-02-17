# Git Workflow — udemy-hp

> Last updated: 2026-02-17

---

## Table of Contents

1. [Repository Setup](#1-repository-setup)
2. [Branch Strategy](#2-branch-strategy)
3. [Branch Naming Convention](#3-branch-naming-convention)
4. [Commit Convention](#4-commit-convention)
5. [Pull Request Checklist](#5-pull-request-checklist)
6. [Code Review Guidelines](#6-code-review-guidelines)
7. [Release Tagging](#7-release-tagging)
8. [Merge Strategy](#8-merge-strategy)
9. [.gitignore](#9-gitignore)
10. [Common Git Commands](#10-common-git-commands)

---

## 1. Repository Setup

### Initial Clone

```bash
git clone <repository-url>
cd udemy-hp
pnpm install
pnpm prepare
```

### Post-Clone Verification

```bash
# Verify everything works
pnpm dev          # Dev server starts on port 5173
pnpm check        # TypeScript/Svelte checks pass
pnpm lint         # Linting passes
pnpm test:unit -- --run  # Tests pass
```

### Recommended IDE Setup

- **VS Code** with the following extensions:
  - Svelte for VS Code (`svelte.svelte-vscode`)
  - ESLint (`dbaeumer.vscode-eslint`)
  - Prettier (`esbenp.prettier-vscode`)
  - GitLens (`eamodio.gitlens`)

### Git Hooks (Optional)

Install Husky for pre-commit hooks:

```bash
pnpm add -D husky
npx husky init
```

Add a pre-commit hook:

```bash
# .husky/pre-commit
pnpm lint
pnpm check
```

Add a commit-msg hook for conventional commits:

```bash
pnpm add -D @commitlint/cli @commitlint/config-conventional

# .husky/commit-msg
npx commitlint --edit $1
```

---

## 2. Branch Strategy

This project uses a **GitHub Flow** variant with a protected `main` branch.

```
main (production)
 ├── feature/hero-section
 ├── feature/contact-form
 ├── fix/nav-mobile-overflow
 ├── chore/update-dependencies
 └── release/v1.0.0 (optional, for staged releases)
```

### Branch Roles

| Branch            | Purpose                              | Deploys To      | Protected |
| ----------------- | ------------------------------------ | --------------- | --------- |
| `main`            | Production-ready code                | Production      | Yes       |
| `feature/*`       | New features and enhancements        | Preview         | No        |
| `fix/*`           | Bug fixes                            | Preview         | No        |
| `chore/*`         | Maintenance, deps, config            | Preview         | No        |
| `docs/*`          | Documentation only                   | Preview         | No        |
| `release/v*`      | Release candidates (optional)        | Staging         | No        |
| `hotfix/*`        | Urgent production fixes              | Production      | No        |

### Branch Lifecycle

1. Create branch from `main`
2. Make commits following the commit convention
3. Push to remote
4. Open a Pull Request
5. Pass CI checks and code review
6. Merge to `main` (squash or rebase)
7. Delete the branch after merge

---

## 3. Branch Naming Convention

### Format

```
<type>/<short-description>
```

### Types

| Type      | Use Case                                       |
| --------- | ---------------------------------------------- |
| `feature` | New feature or significant enhancement         |
| `fix`     | Bug fix                                        |
| `chore`   | Dependencies, config, tooling, CI              |
| `docs`    | Documentation changes only                     |
| `refactor`| Code refactoring without behavior change       |
| `test`    | Adding or updating tests                       |
| `style`   | CSS/styling changes only                       |
| `hotfix`  | Urgent fix for production                      |
| `release` | Release preparation                            |

### Rules

- Use lowercase
- Use hyphens (not underscores or camelCase)
- Keep it short but descriptive (2-5 words)
- Include ticket/issue number if applicable

### Examples

```
feature/hero-animation
feature/blog-listing-page
fix/nav-mobile-overflow
fix/contact-form-validation
chore/update-svelte-5.44
docs/add-deployment-runbook
refactor/extract-seo-util
test/add-button-component-tests
hotfix/broken-contact-form
release/v1.0.0
```

### Anti-Patterns (Avoid)

```
# Too vague
feature/update
fix/bug

# Too long
feature/add-hero-section-with-gsap-animations-and-scroll-trigger-and-responsive-design

# Wrong format
Feature/HeroSection
feature_hero_section
```

---

## 4. Commit Convention

This project follows [Conventional Commits](https://www.conventionalcommits.org/).

### Format

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Types

| Type       | When to Use                                   | Example                                    |
| ---------- | --------------------------------------------- | ------------------------------------------ |
| `feat`     | New feature visible to users                  | `feat(blog): add blog listing page`        |
| `fix`      | Bug fix                                       | `fix(nav): resolve mobile overflow issue`  |
| `docs`     | Documentation only                            | `docs: add deployment runbook`             |
| `style`    | CSS/formatting, no logic change               | `style(hero): adjust spacing on mobile`    |
| `refactor` | Code change that neither fixes nor adds       | `refactor(seo): extract meta tag utility`  |
| `test`     | Adding or updating tests                      | `test(button): add component render tests` |
| `chore`    | Build, CI, dependencies, tooling              | `chore: update svelte to 5.44`             |
| `perf`     | Performance improvement                       | `perf(images): add lazy loading`           |
| `ci`       | CI/CD configuration                           | `ci: add github actions deploy workflow`   |
| `revert`   | Reverting a previous commit                   | `revert: revert "feat(blog): add listing"` |

### Scopes (Optional)

Use the component or area name:

```
nav, footer, hero, blog, services, contact, lead-magnet,
case-studies, about, seo, gsap, a11y, config, deps
```

### Rules

1. **Subject line:** Imperative mood, lowercase, no period at end, max 72 characters
2. **Body:** Explain the "why" not the "what", wrap at 72 characters
3. **Breaking changes:** Add `BREAKING CHANGE:` footer or `!` after type

### Examples

```bash
# Simple feature
git commit -m "feat(hero): add animated stat counters"

# Bug fix with body
git commit -m "$(cat <<'EOF'
fix(contact): prevent form double-submission

The submit button was not disabled after the first click, allowing
users to submit the form multiple times. Added a loading state that
disables the button during submission.

Closes #42
EOF
)"

# Breaking change
git commit -m "$(cat <<'EOF'
feat(nav)!: replace slot-based nav with snippet API

BREAKING CHANGE: Nav component no longer accepts slot content.
Use the items prop instead.
EOF
)"

# Chore
git commit -m "chore(deps): update gsap to 3.14.2"

# Documentation
git commit -m "docs: add QA test plan and troubleshooting guide"
```

---

## 5. Pull Request Checklist

Copy this checklist into your PR description.

```markdown
## Summary
<!-- 1-3 bullet points describing what this PR does -->

## Type of Change
- [ ] Feature (new functionality)
- [ ] Fix (bug fix)
- [ ] Refactor (code improvement, no behavior change)
- [ ] Style (CSS/visual changes only)
- [ ] Docs (documentation only)
- [ ] Chore (dependencies, config, CI)
- [ ] Test (adding or updating tests)

## Checklist
- [ ] Code follows project conventions (Svelte 5, TypeScript)
- [ ] Self-reviewed the diff for errors and leftover debug code
- [ ] `pnpm lint` passes
- [ ] `pnpm check` passes
- [ ] `pnpm test:unit -- --run` passes
- [ ] Tested at mobile (375px) and desktop (1280px) viewports
- [ ] New components have associated tests
- [ ] GSAP animations use `onMount` and clean up on destroy
- [ ] No new accessibility violations (checked with axe)
- [ ] SEOHead used on new pages with unique title/description

## Screenshots / Screen Recordings
<!-- Attach if visual changes -->

## Test Plan
<!-- How to manually verify this change -->
```

### PR Title Convention

Follow the same format as commits:

```
feat(blog): add blog listing page with cards
fix(nav): resolve overflow on mobile viewports
chore(deps): update svelte and sveltekit
```

### PR Size Guidelines

| Size  | Lines Changed | Review Time | Recommendation              |
| ----- | ------------- | ----------- | --------------------------- |
| XS    | < 50          | < 15 min    | Quick review, merge fast    |
| S     | 50-200        | 15-30 min   | Standard review             |
| M     | 200-500       | 30-60 min   | Consider splitting          |
| L     | 500-1000      | 1-2 hours   | Split if possible           |
| XL    | > 1000        | 2+ hours    | Must be split               |

---

## 6. Code Review Guidelines

### For Reviewers

#### What to Check

1. **Correctness:** Does the code do what the PR claims?
2. **Svelte 5 Patterns:** Uses `$state`, `$derived`, `$effect`, `$props()` correctly
3. **TypeScript:** Props are typed, no `any` types without justification
4. **Accessibility:** Semantic HTML, ARIA attributes, keyboard navigation
5. **Performance:** No unnecessary re-renders, GSAP cleanup, image optimization
6. **Security:** No XSS vectors, no secrets in code
7. **Tests:** New code has tests, existing tests updated if behavior changed
8. **CSS:** Scoped styles, responsive, follows existing patterns

#### Review Tone

- Be constructive and specific
- Suggest alternatives, do not just say "this is wrong"
- Prefix comments with intent:
  - `nit:` — Minor style suggestion, non-blocking
  - `suggestion:` — Improvement idea, non-blocking
  - `question:` — Seeking clarification
  - `issue:` — Must be addressed before merge
  - `praise:` — Something done well

#### Examples

```
issue: This GSAP animation is created in the script tag but never cleaned up.
It will leak ScrollTrigger instances on navigation. Please add cleanup in
the onMount return function.

suggestion: Consider extracting this into a reusable utility in $utils/animations.ts
since the same pattern is used in 3 other components.

nit: This could be a $derived instead of a manual calculation in $effect.

praise: Really clean implementation of the form validation. The error
message pattern is very accessible.
```

### For Authors

- Keep PRs focused on a single concern
- Write a clear description with context
- Respond to all review comments
- Do not take feedback personally
- If you disagree, discuss constructively

---

## 7. Release Tagging

### Version Format

Follow [Semantic Versioning](https://semver.org/): `vMAJOR.MINOR.PATCH`

| Increment | When                                          | Example          |
| --------- | --------------------------------------------- | ---------------- |
| MAJOR     | Breaking changes (API, URL structure, etc.)   | `v1.0.0 -> v2.0.0` |
| MINOR     | New features, backward compatible             | `v1.0.0 -> v1.1.0` |
| PATCH     | Bug fixes, small improvements                 | `v1.0.0 -> v1.0.1` |

### Creating a Release

```bash
# Ensure you are on main and up to date
git checkout main
git pull origin main

# Create an annotated tag
git tag -a v1.0.0 -m "Release v1.0.0: Initial public launch

Features:
- Homepage with hero, services, blog preview, case studies
- Contact form with validation
- Lead magnet landing page
- Blog and case study listing pages
- Full responsive design (320-1920px)
- GSAP scroll animations
- SEO optimization with meta tags and Open Graph
- Legal pages (privacy, terms, disclaimer)"

# Push the tag
git push origin v1.0.0
```

### Creating a GitHub Release

```bash
gh release create v1.0.0 \
  --title "v1.0.0 — Initial Public Launch" \
  --notes "$(cat <<'EOF'
## What's New

### Features
- Homepage with animated hero section and stat counters
- Services, Blog, and Case Studies listing pages
- Contact form with client-side validation
- Lead magnet landing page with email capture
- Full responsive design (320px - 1920px)
- GSAP scroll-triggered animations
- SEO optimization with meta tags and Open Graph
- Legal pages (Privacy Policy, Terms, Disclaimer)

### Technical
- SvelteKit 2 with Svelte 5 (runes)
- TypeScript throughout
- Vitest + Playwright testing
- mdsvex for Markdown content
EOF
)"
```

### Pre-Release Tags

For release candidates:

```bash
git tag -a v1.0.0-rc.1 -m "Release candidate 1 for v1.0.0"
git push origin v1.0.0-rc.1
```

---

## 8. Merge Strategy

### Preferred: Squash and Merge

Used for most feature and fix branches.

- Combines all branch commits into a single commit on `main`
- Keeps `main` history clean and linear
- The squash commit message should follow the conventional commit format

```bash
# Via GitHub UI: "Squash and merge" button
# Via CLI:
gh pr merge <pr-number> --squash
```

### When to Use Rebase and Merge

Used when the branch has a clean, meaningful commit history worth preserving.

```bash
# Via GitHub UI: "Rebase and merge" button
# Via CLI:
gh pr merge <pr-number> --rebase
```

### When to Use Merge Commit

Rarely. Only for release branches or when preserving the exact branch history matters.

```bash
# Via GitHub UI: "Create a merge commit" button
# Via CLI:
gh pr merge <pr-number> --merge
```

### Merge Strategy Summary

| Scenario                  | Strategy          | Rationale                          |
| ------------------------- | ----------------- | ---------------------------------- |
| Feature branch (typical)  | Squash and merge  | Clean single commit on main        |
| Fix branch (1-2 commits)  | Squash and merge  | Simple, clean                      |
| Release branch            | Merge commit      | Preserve release history           |
| Hotfix                    | Squash and merge  | Get it in fast, clean              |
| Large refactor            | Rebase and merge  | Preserve meaningful commit steps   |

### Keeping Branches Up to Date

```bash
# Rebase your branch on latest main before merging
git checkout feature/my-feature
git fetch origin
git rebase origin/main

# If there are conflicts, resolve them and continue
git rebase --continue

# Force push to update the remote branch (your branch only, NEVER main)
git push --force-with-lease origin feature/my-feature
```

**IMPORTANT:** Never force-push to `main`. Always use `--force-with-lease` on feature branches to prevent overwriting others' work.

---

## 9. .gitignore

The project's `.gitignore` is configured as follows:

```gitignore
# Test results
test-results

# Dependencies
node_modules

# Build output
.output
.vercel
.netlify
.wrangler
/.svelte-kit
/build

# OS files
.DS_Store
Thumbs.db

# Environment variables
.env
.env.*
!.env.example
!.env.test

# Vite temp files
vite.config.js.timestamp-*
vite.config.ts.timestamp-*
```

### What IS Tracked

- All source code (`src/`)
- Configuration files (`svelte.config.js`, `vite.config.js`, `tsconfig.json`, etc.)
- Lock file (`pnpm-lock.yaml`)
- Static assets (`static/`)
- Documentation (`docs/`)
- E2E tests (`e2e/`)
- `.env.example` (template for required env vars, no real secrets)

### What is NOT Tracked

- `node_modules/` — Reinstall with `pnpm install`
- `.svelte-kit/` — Regenerate with `pnpm prepare`
- `build/` — Regenerate with `pnpm build`
- `.env` — Contains secrets, must be set up manually per environment
- `test-results/` — Generated by Playwright
- Platform directories (`.vercel`, `.netlify`, `.wrangler`)

### Adding New Ignore Rules

If you need to ignore additional files:

```bash
# Add to .gitignore
echo "*.local" >> .gitignore

# Remove from tracking if already tracked
git rm --cached <file>
```

---

## 10. Common Git Commands

### Daily Workflow

```bash
# Start a new feature
git checkout main
git pull origin main
git checkout -b feature/my-feature

# Make changes, stage, and commit
git add src/lib/components/NewComponent.svelte
git add src/routes/new-page/+page.svelte
git commit -m "feat(new-page): add new page with component"

# Push to remote
git push -u origin feature/my-feature

# Create a PR
gh pr create --title "feat(new-page): add new page" --body "Description here"
```

### Syncing with Main

```bash
# Fetch latest changes
git fetch origin

# Rebase current branch on main
git rebase origin/main

# If conflicts arise
git status                    # See conflicting files
# Edit files to resolve conflicts
git add <resolved-files>
git rebase --continue
```

### Undoing Changes

```bash
# Unstage a file (keep changes in working directory)
git restore --staged <file>

# Discard changes to a file (DESTRUCTIVE)
git restore <file>

# Undo the last commit (keep changes staged)
git reset --soft HEAD~1

# Amend the last commit message
git commit --amend -m "new message"

# Revert a commit (creates a new commit that undoes it)
git revert <commit-hash>
```

### Viewing History

```bash
# Compact log
git log --oneline -20

# Log with graph
git log --oneline --graph --all -20

# See changes in a commit
git show <commit-hash>

# See changes between branches
git diff main...feature/my-feature

# See what files changed
git diff --name-only main...HEAD
```

### Stashing

```bash
# Stash current changes
git stash

# Stash with a message
git stash push -m "WIP: contact form validation"

# List stashes
git stash list

# Apply most recent stash
git stash pop

# Apply a specific stash
git stash pop stash@{2}

# Drop a stash
git stash drop stash@{0}
```

### Branching

```bash
# List local branches
git branch

# List all branches (including remote)
git branch -a

# Delete a local branch (safe, only if merged)
git branch -d feature/old-feature

# Delete a remote branch
git push origin --delete feature/old-feature

# Rename current branch
git branch -m new-name
```

### Tags

```bash
# List tags
git tag

# Create annotated tag
git tag -a v1.0.0 -m "Release v1.0.0"

# Push a specific tag
git push origin v1.0.0

# Push all tags
git push origin --tags

# Delete a local tag
git tag -d v1.0.0

# Delete a remote tag
git push origin --delete v1.0.0
```

### Troubleshooting Git

```bash
# See what branch you are on and status
git status

# See remote URLs
git remote -v

# Check if branch is behind remote
git fetch origin
git status

# Find a commit that introduced a bug
git bisect start
git bisect bad          # Current commit is bad
git bisect good v1.0.0  # This tag was good
# Git checks out a middle commit; test and mark good/bad
git bisect good  # or git bisect bad
# Repeat until found
git bisect reset
```

### Aliases (Recommended)

Add to `~/.gitconfig`:

```ini
[alias]
  co = checkout
  br = branch
  ci = commit
  st = status
  lg = log --oneline --graph --all -20
  unstage = restore --staged
  last = log -1 HEAD
  pr = "!gh pr create"
```
