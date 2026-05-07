# DevOps Practices

Date: 2026-05-06

## Goals
- Reliable CI/CD, repeatable deployments, clear feedback loops, and measurable service health.

## CI/CD
- Use GitHub Actions pipeline in `.github/workflows/ci.yml`:
  - `verify` job: checkout, install, lint, test, build.
  - `deploy` job: links Vercel project and runs `vercel deploy` for production on `main`.
- Best practices:
  - Keep pipelines fast by caching dependencies and running only affected tests when possible.
  - Fail fast on lint/test errors.

## Environments
- `development`: branch for active feature work. Use preview/staging deployments for acceptance.
- `main`: protected branch; deploys to production.

## Automation
- Use `pnpm` lockfiles and actions for consistent dependency installs.
- Automate releases with tags and changelogs.

## Monitoring & Alerts
- Add simple uptime and health checks (existing `api/health` route used in CI smoke tests).
- Recommended: integrate Vercel integrations + a lightweight APM (e.g., Sentry or Datadog Real User Monitoring) for errors and performance.
- Example alert: page error rate > 1% over 5 minutes → trigger an on-call pager.

## Feedback Loop
- Capture metrics: error rates, response times, deployment frequency, and lead time for changes.
- Run post-deploy smoke tests and surface results in PRs.

## Release Process
1. Create a release branch or merge to `main` via PR.
2. Ensure `verify` job passes in CI.
3. Tag the commit with semantic version (e.g., `v1.0`) and push the tag.
4. CI deploy runs and smoke tests validate the deployment.

## Improvement suggestions (prioritized)
1. Add a Dockerfile for local parity and containerized testing.
2. Add a staging preview deployment for `development` branch.
3. Add basic monitoring (Sentry + uptime checks) and alerting for critical endpoints.

## Where to find useful files
- CI workflow: `.github/workflows/ci.yml`
- Health check: `app/api/health/route.ts`
- Tests: `lib/*.test.ts`, `scripts/*.test.ts`

