# Release Checklist

Use this checklist before promoting a change to production on Vercel (big-bang deploy).

## Pre-merge / pre-deploy

- [ ] **CI script**: `pnpm run ci` passes locally (same as GitHub Actions **CI / CD** workflow: lint, test, build).
- [ ] **CI**: Required GitHub checks are green on the release branch/commit.
- [ ] **Environment**: Any new or renamed variables are documented and set in **Vercel → Environment Variables** for Production (and Preview if needed).
- [ ] **GitHub secrets**: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, and `VERCEL_PROJECT_ID` are configured for the deploy workflow.
- [ ] **Secrets**: No secrets added to the repository; values only in Vercel (or other approved secret stores).

## Version control (optional but recommended)

- [ ] **Tag**: If the team uses semver tags for releases, create the tag after merge or on the deployed commit.
- [ ] **Changelog**: Update [release notes](release-notes.md) or team notes if required by the course or sprint.

## Deployment readiness

- [ ] **Rollback known**: At least one maintainer knows how to [promote a previous deployment](deployment-plan.md#rollback-steps) in Vercel.
- [ ] **Preview**: For risky changes, a **Vercel Preview** deployment from the PR was reviewed.

## Post-deploy

- [ ] **Smoke test**: Production URL loads; `/api/health` returns 200; critical paths work (see [deployment plan](deployment-plan.md#monitoring-and-verification)).
- [ ] **Monitor**: Brief check of Vercel logs for errors in the first minutes after release.
