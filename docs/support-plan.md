# Support Plan: gasync

This document defines how issues with the deployed **gasync** application are reported, triaged, escalated, and how quickly responders aim to reply.

## Scope

- **In scope**: Availability and correctness of the Vercel-hosted app, broken builds or deploys, environment misconfiguration on Vercel, and defects in released features covered by the current milestone.
- **Out of scope**: General course IT (e.g. lab machine setup), unless explicitly agreed with the team.

## How to report issues

**Primary channel**: **GitHub Issues** in this repository (create a new issue and use the bug template if one exists).

Include:

- **URL** of the deployment (production or preview).
- **Time** (with timezone) when the problem was seen.
- **Browser and OS** (e.g. Safari / macOS).
- **Steps to reproduce** and **expected vs actual** behavior.
- **Screenshot** or short screen recording if UI-related.

For **security-sensitive** findings (e.g. exposed credentials), do not post details in public issues; contact the maintainers or instructor per course policy.

## Common issues

| Symptom | Things to check |
|--------|------------------|
| 404 or old content | Wrong branch deployed; CDN cache — hard refresh; confirm production branch in Vercel. |
| Build fails on Vercel | Compare Node version with local; read build log; missing env vars in Vercel. |
| API or data errors | Environment variables for Production; upstream API status; browser network tab. |
| Slow first load | Cold start on serverless — often expected; check bundle size and Vercel region. |

## Triage and ownership

1. **New issues** are labeled (e.g. `bug`, `deployment`) when possible.
2. **Severity**: Blocker (site unusable) vs normal vs minor — set in the issue description or a comment.
3. **Assignment**: Rotating or designated maintainer accepts the issue or delegates.

## Escalation

| Level | When | Action |
|-------|------|--------|
| **L1** | Default | Reporter opens GitHub Issue; team responds within target times below. |
| **L2** | Blocker or no response within L1 window | Ping in team channel or assign secondary maintainer / TA. |
| **L3** | Security, data loss, or prolonged outage | Escalate to course instructor or org owner as required. |

Adjust names (TA, instructor) to match your course roster.

## Response times (targets)

These are **best-effort targets** for a student team project, not a formal SLA.

| Severity | First response | Resolution aim |
|----------|----------------|----------------|
| **Blocker** (production down or data-breaking) | Within **24 hours** on business days | Same day if possible; rollback per [deployment plan](deployment-plan.md) if needed |
| **Normal** (bug with workaround) | Within **2–3 business days** | Next sprint or patch as capacity allows |
| **Minor** (cosmetic, nice-to-have) | Within **5 business days** | Backlog prioritization |

Times assume issues filed on GitHub with enough detail to reproduce. Incomplete reports may delay triage.

## Related documents

- [Deployment plan](deployment-plan.md) — rollback and Vercel operations.
- [Release checklist](release-checklist.md) — pre-release gates.
