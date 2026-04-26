# Contributing to ukelonn-public

Thank you for considering contributing! This guide explains how to propose changes.

## Code of Conduct

Be respectful and constructive. Harassment or abusive behaviour will not be tolerated.

## How to Contribute

### 1. Fork the repository

Click **Fork** in the top-right corner of the GitHub page to create your own copy.

### 2. Clone your fork and create a branch

```bash
git clone https://github.com/<your-username>/ukelonn-public.git
cd ukelonn-public
git checkout -b feat/my-feature   # or fix/my-bug
```

Use descriptive branch names, e.g. `feat/add-savings-goal` or `fix/pin-validation`.

### 3. Set up the project locally

```bash
npm install
cd functions && npm install && cd ..
cp .env.local.example .env.local   # fill in your Firebase config
npm run dev
```

See [README.md](README.md) for full setup details.

### 4. Run quality checks

Before opening a PR, make sure all checks pass:

```bash
npm run lint
npm run build
```

Fix any lint errors or TypeScript issues before submitting.

### 5. Commit your changes

Write clear, imperative-style commit messages:

```
feat: add weekly summary view for parents
fix: prevent negative balance on child page
docs: update Firebase setup steps
```

### 6. Open a Pull Request

Push your branch to your fork and open a PR against the `master` branch of this repository:

```bash
git push origin feat/my-feature
```

Then go to GitHub and click **New pull request**.

- Fill in the PR template completely.
- Link any related issues using `Closes #<issue-number>`.
- Keep PRs focused — one logical change per PR.

### 7. Review process

- `@stianwetterstad` will review your PR.
- Address any requested changes by pushing new commits to the same branch.
- Once approved, the PR will be merged.

## Coding Standards

- **Language**: TypeScript (strict where possible).
- **Framework**: Next.js App Router conventions.
- **Styling**: Tailwind CSS utility classes.
- **Linting**: ESLint with the `eslint-config-next` ruleset (`npm run lint`).
- **Formatting**: Keep code style consistent with the surrounding file.
- No secrets or Firebase API keys should ever be committed — use `.env.local` or runtime config.

## Reporting Bugs and Requesting Features

Use [GitHub Issues](../../issues) and select the appropriate template (Bug Report or Feature Request).

For security vulnerabilities, please follow the [Security Policy](SECURITY.md) instead.

## Questions?

Use [GitHub Discussions](../../discussions) for questions, ideas and general conversation.
