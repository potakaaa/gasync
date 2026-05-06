# KPIs — gasync

> **Week 13 deliverable** — last updated: 2025-05

This document defines the five key performance indicators used to measure the health, quality, and delivery pace of **gasync**. Each KPI includes a rationale, measurement method, and target threshold.

---

## KPI 1 — API Route Response Time (`/api/commodity/latest`)

| Field | Detail |
|---|---|
| **What** | End-to-end server response time for the primary data endpoint, including upstream API calls and previous-closes resolution. |
| **Why** | This is the critical path for every page load. Slow responses directly degrade the user experience. |
| **Unit** | Milliseconds (ms) |
| **Measurement method** | Timed locally with `curl -o /dev/null -s -w "%{time_total}"`, or via request log middleware (`X-Response-Time` header). |
| **Target** | P95 ≤ 800 ms under normal conditions (upstream API + parallel historical resolution). |
| **Warning threshold** | > 1 500 ms |

---

## KPI 2 — Test Coverage (statement coverage, `lib/`)

| Field | Detail |
|---|---|
| **What** | Percentage of statements in `lib/` covered by Vitest unit tests. |
| **Why** | `lib/` contains all business logic (price parsing, historical resolution, formatting). Gaps here let regressions ship silently (see tech-debt #4). |
| **Unit** | Percentage (%) |
| **Measurement method** | `pnpm exec vitest run --coverage` (requires `@vitest/coverage-v8`). |
| **Target** | ≥ 70 % statement coverage across `lib/`. |
| **Warning threshold** | < 50 % |

---

## KPI 3 — Parallel vs Sequential Previous-Closes Latency Ratio

| Field | Detail |
|---|---|
| **What** | Ratio of parallel `resolvePreviousClosesForSymbols` wall time to equivalent sequential wall time (mocked network). |
| **Why** | The parallelisation refactor (retired tech-debt #2) is the most significant performance investment to date. This KPI verifies the gain is preserved. |
| **Unit** | Ratio (parallel ms / sequential ms); lower is better. |
| **Measurement method** | `pnpm run measure:previous-closes` — the Vitest performance script in `scripts/previous-closes-performance.test.ts`. |
| **Target** | Ratio ≤ 0.40 (parallel should be ≤ 40 % of sequential time). |
| **Warning threshold** | Ratio > 0.60 |

---

## KPI 4 — Defect Rate (open severity-1 and severity-2 bugs per sprint)

| Field | Detail |
|---|---|
| **What** | Number of open severity-1 ("release blocker") and severity-2 ("major failure") defects at sprint close. |
| **Why** | Directly reflects product stability and the team's ability to close high-impact issues within a sprint. |
| **Unit** | Count |
| **Measurement method** | Manual count from `docs/defect-log.md` at the end of each sprint cycle. |
| **Target** | 0 open Sev-1 defects at sprint close; ≤ 1 open Sev-2. |
| **Warning threshold** | Any open Sev-1 past sprint close, or ≥ 3 open Sev-2. |

---

## KPI 5 — Build & CI Pass Rate

| Field | Detail |
|---|---|
| **What** | Percentage of `pnpm run ci` (lint → test → build) runs that pass on the main/development branch. |
| **Why** | A healthy CI pipeline is a prerequisite for confident, fast delivery. Failing builds block all merges. |
| **Unit** | Percentage (%) |
| **Measurement method** | GitHub Actions workflow run history (`.github/workflows/`), or local tracking in `docs/release-checklist.md`. |
| **Target** | ≥ 90 % pass rate over any rolling 4-week window. |
| **Warning threshold** | < 80 % |
