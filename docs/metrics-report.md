# Metrics Report — Week 13

> **Period:** Sprint 1 / Week 13 · Measured: 2025-05
> Companion document: [`docs/kpis.md`](kpis.md)

---

## Summary Table

| KPI | Current | Target | Status | Action |
|---|---|---|---|---|
| 1 — API Route P95 Response Time | ~800 ms (estimated, no prod traffic yet) | ≤ 800 ms P95 | 🟡 Baseline only | Add request-time logging; measure once deployed |
| 2 — Test Coverage (`lib/`) | ~45 % (estimated, `@vitest/coverage-v8` not installed) | ≥ 70 % | 🔴 Below target | Install coverage tooling; write missing tests |
| 3 — Parallel / Sequential Latency Ratio | **0.32** (88.2 ms → 28.2 ms) | ≤ 0.40 | 🟢 Passing | Maintain; re-run on architecture changes |
| 4 — Open Sev-1 / Sev-2 Defects at Sprint Close | 0 Sev-1 · 0 Sev-2 | 0 Sev-1 / ≤ 1 Sev-2 | 🟢 Passing | Continue triage discipline |
| 5 — CI Pass Rate (rolling 4 weeks) | 26/26 tests passing; build green locally | ≥ 90 % | 🟡 No CI runs yet | Enable GitHub Actions workflows |

---

## KPI 1 — API Route Response Time

### Measurement

`@api/commodity/latest` has not been exercised under production load. Estimated upper-bound based on:

- One upstream `/rates/latest` call (external API, ~200–400 ms typically).
- Up to 10 parallel `/rates/historical` calls resolved in one wave; slowest call dominates (~200–400 ms).
- Total wall time: potentially 400–800 ms in the common case.

### Interpretation

The endpoint is architecturally sound (parallelised historical resolution, single latest call), but no real P95 measurement exists yet. Logging middleware added this sprint (see §Monitoring) will produce real numbers on first deployment.

### Action Plan

1. Deploy to a staging environment.
2. Read `X-Response-Time` headers from the request log.
3. Establish a real P95 baseline; revisit target if upstream API proves slower than 400 ms.
4. Add `revalidate` caching (tech-debt #3) to reduce upstream call frequency.

---

## KPI 2 — Test Coverage (`lib/`)

### Measurement

`@vitest/coverage-v8` is not installed (`pnpm exec vitest run --coverage` fails). Estimated coverage from file audit:

| File | Tested? | Notes |
|---|---|---|
| `lib/commodity-format.ts` (229 lines) | ✅ Partial | `formatChangeLabel`, `sessionChangeFromPrevious`, `buildSnapshot`, `chartYAxisPadding`, `buildMarketPulseSummary` covered. `buildChartSeries` (synthetic series, tech-debt #1) not tested. |
| `lib/commodity-service.ts` | ✅ Partial | URL builders + `formatUtcDateYYYYMMDD` + `resolveHistoricalBaseUrl` covered. `fetchLatestCommodityRates`, `fetchHistoricalCommodityRates`, `resolvePreviousClosesForSymbols` (main logic) **not covered** (tech-debt #4). |
| `lib/commodity-types.ts` | ✅ Implicitly | Type-only + `isCommoditySymbol`; exercised by other tests. |
| `lib/gas-price.ts` | ✅ Good | 10 tests covering formatters, filters, sort, freshness, URL builder. |
| `lib/utils.ts` | ❌ Not tested | `cn()` helper only; low risk but adds to gap. |

Estimated statement coverage across `lib/`: **~45 %** — below the 70 % target.

### Interpretation

The gap is concentrated in `fetchLatestCommodityRates`, historical parsing, and `resolvePreviousClosesForSymbols` — exactly the code most likely to break silently (tech-debt #4 and #5 in `docs/tech-debt.md`).

### Action Plan

1. `pnpm add -D @vitest/coverage-v8` — add coverage tooling to devDependencies.
2. Add `coverage` script to `package.json`: `"coverage": "vitest run --coverage"`.
3. Write mocked-fetch unit tests for `fetchLatestCommodityRates` and `fetchHistoricalCommodityRates`.
4. Write integration test for `app/api/commodity/latest/route.ts` (503 on missing key, 502 on upstream error, valid payload shape).
5. Set coverage threshold in `vitest.config.ts`: `{ statements: 70 }`.

---

## KPI 3 — Parallel vs Sequential Latency Ratio

### Measurement (real — from `pnpm run measure:previous-closes`)

```
mock delay 25 ms/call
sequential ~88.2 ms  (3 awaited round-trips × 25 ms + overhead)
parallel   ~28.2 ms  (10 calls in one Promise.all wave ≈ 1 round-trip)
ratio      0.32
```

Run 2 (same session, stable): sequential ~87.1 ms · parallel ~28.9 ms · ratio **0.33**.

### Interpretation

The parallelisation refactor (retired tech-debt #2) delivers a consistent **3× wall-time reduction** under mocked latency. The ratio of ~0.32 comfortably meets the ≤ 0.40 target. The test also verifies correctness — both paths return identical merged `previousCloses`.

### Action Plan

Keep passing. Re-run if `resolvePreviousClosesForSymbols` is refactored or if `MAX_PRIOR_DAYS_TO_SCAN` changes.

---

## KPI 4 — Defect Rate

### Measurement

From `docs/defect-log.md`:

| Severity | Open | Closed |
|---|---|---|
| Sev-1 | 0 | 1 (BUG-001 — closed 2026-04-12) |
| Sev-2 | 0 | 0 |

### Interpretation

The only recorded defect (BUG-001: root page showed create-next-app starter content) was identified and closed within the same sprint. No outstanding blockers.

### Action Plan

Continue logging defects in `docs/defect-log.md` with severity, owner, and resolution notes. The 13 open tech-debt items in `docs/tech-debt.md` are not defects but should be triaged for severity before Sprint 2.

---

## KPI 5 — Build & CI Pass Rate

### Measurement

- Local `pnpm run ci` (lint → test → build): **green**.
- Test suite: **26/26 tests pass** in 301 ms total.
- GitHub Actions workflow files exist under `.github/workflows/` but no run history is available (workflows may be disabled — see tech-debt audit).

### Interpretation

The codebase is in a healthy local state, but CI has not been exercised in the current sprint. A passing local build is necessary but not sufficient — branch protection and automated CI runs are needed to make this KPI meaningful.

### Action Plan

1. Audit `.github/workflows/` — confirm workflows are enabled and triggers are correct.
2. Push a branch and verify a workflow run completes successfully.
3. Enable branch protection on `main` to require CI to pass before merge.

---

## Monitoring & Logging Added This Sprint

See `lib/logger.ts` and `app/api/commodity/latest/route.ts` (updated) for implementation.

### What was added

| Layer | What | How to read it |
|---|---|---|
| Request logger middleware (`lib/logger.ts`) | Logs method, path, status, and response time in ms for every `/api/*` request | `console.log` in JSON format; visible in Vercel function logs or local `pnpm dev` terminal |
| `X-Response-Time` response header | Millisecond duration header on every API response | `curl -I http://localhost:3000/api/commodity/latest` |
| Upstream error logging | Logs upstream status and error message when the commodity API returns an error | Visible in server logs alongside the 502 response |
| Missing-key warning | Logs a `WARN` when `COMMODITY_API_KEY` is absent | Helps distinguish misconfiguration from upstream failure |
| Health check endpoint (`/api/health`) | Returns `{ ok: true }` — already existed; documented here as the uptime check target | Ping with `curl http://localhost:3000/api/health` or an uptime monitor |
