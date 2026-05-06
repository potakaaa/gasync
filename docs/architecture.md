# Architecture Overview

Date: 2026-05-06

## Summary
This document describes the high-level architecture for the `gasync` Next.js application, components, and data flow. It is intended to support release‑readiness and DevOps planning.

## Components
- Web Frontend: Next.js app (app/). Renders dashboards, charts, and UI components under `components/`.
- API Routes: Serverless routes under `app/api/` (e.g., `api/commodity/latest/route.ts`, `api/health/route.ts`). These are deployed as serverless functions on Vercel.
- Data / Services: In-repo services under `lib/` (commodity-service.ts, gas-price.ts) that fetch/process external data.
- CI/CD: GitHub Actions pipeline (`.github/workflows/ci.yml`) which runs lint, tests, build and deploys to Vercel.

## Deployment Targets
- Production: Vercel deployment triggered on `main` (see CI workflow).
- Suggested Staging: a `development` branch preview deployed to a Vercel preview or staging alias for acceptance testing before production.

## Data Flow (ASCII diagram)

Developer -> GitHub (push/PR)
  | 
  v
CI (Actions): install -> lint -> test -> build
  |
  +--> Deploy to Vercel (preview/staging) [development branch]
  +--> Deploy to Vercel (production) [main branch]

Browser <-> Vercel Frontend (Next.js)
               |
               +-> Serverless API routes (Vercel Functions)
               |
               +-> External data sources (APIs) via `lib/commodity-service.ts`

## Notes on scaling and resilience
- Serverless functions auto-scale on Vercel; keep cold-start-sensitive workloads light or use background jobs if needed.
- For higher throughput, move long-running data processing off the request path into scheduled jobs or background workers and persist results in a cache or DB.

## Observability
- Recommend adding structured logs (JSON) and a lightweight metrics/monitoring stack (see `docs/devops-practices.md`).

## Where to find code
- App entry: `app/page.tsx`
- CI config: `.github/workflows/ci.yml`
- API routes: `app/api/`
- Services: `lib/`

