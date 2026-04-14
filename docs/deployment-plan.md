# Deployment Plan: gasync

This document describes how the **gasync** Next.js application is deployed to production, the chosen rollout strategy, and how to roll back a bad release.

## Purpose

Provide a single, repeatable path from source control to a live Vercel deployment for the Gas Price Viewer (gasync) app, with explicit rollback steps if a deployment fails or misbehaves in production.

## Target environment

| Item | Detail |
|------|--------|
| **Host** | [Vercel](https://vercel.com) |
| **Application** | Next.js 16 (`next build` / Node runtime as selected by Vercel) |
| **Repository** | Connected Git repository (GitHub); production deploys track the configured production branch (typically `main` or `development` per team convention) |
| **Regions** | Vercel default region unless overridden in project settings |
| **Secrets** | API keys and tokens live in **Vercel → Project → Settings → Environment Variables**. Never commit secrets to the repo. |

High-level flow: **Git push → Vercel build (`npm run build`) → edge/serverless deployment → production URL** (e.g. `*.vercel.app` or a custom domain).

## Rollout strategy: big-bang

We use **big-bang deployment**: each production release replaces the previous deployment in one step when the new build succeeds.

- **When it runs**: Merging to the production branch (or manual “Deploy” from the Vercel dashboard) triggers a full new build; on success, traffic immediately serves the new version.
- **Why it fits**: The app is a small team / course deliverable; traffic splitting (canary/blue-green) is optional complexity. Vercel still keeps **deployment history**, so rollback is “promote an older deployment,” not a separate long-lived stack.
- **Risk note**: There is no gradual traffic shift. Mitigate with CI, tests, and preview deployments on pull requests before merging.

## Rollback steps

If the live site is broken after a deploy, follow these steps in order.

1. **Confirm the issue**  
   Open the production URL in a private window, note the error (5xx, blank page, wrong behavior). Check **Vercel → Project → Deployments** for the latest deployment status (Ready / Error).

2. **Identify last known good**  
   In **Deployments**, find the most recent deployment that was healthy (timestamp, commit SHA, or “Promoted” state). Copy its deployment URL if you need to verify it before promoting.

3. **Rollback on Vercel (preferred)**  
   Open the good deployment → use **⋯ (overflow) → Promote to Production** (wording may vary slightly). This points production traffic back to that build without needing a new Git revert.

4. **Rollback via Git (if you must align `main` with production)**  
   On the default branch, either:
   - `git revert` the offending merge commit and push (clean history for shared branches), or  
   - reset and force-push only if your team policy allows it (avoid on shared `main` unless agreed).

5. **Verify**  
   Hard-refresh the production URL; run a short smoke test (home loads, primary navigation, any API routes in use).

6. **Follow-up**  
   Fix the root cause on a branch, add tests if applicable, merge after review, and redeploy.

## Monitoring and verification

- **Build**: Vercel build logs must show `next build` completing without errors.
- **Runtime**: Use Vercel deployment **Logs** for serverless/edge errors after release.
- **Smoke test**: After each production deploy, confirm the main page and one critical user path.

## Related documents

- [Release checklist](release-checklist.md) — pre-release gates.
- [Support plan](support-plan.md) — how issues are reported and triaged.
