# Technical debt register

This document lists known technical debt in **gasync** so it can be prioritized and retired deliberately. Items are ordered roughly by user impact and operational risk, not by ease of fix.

| # | Area | Debt | Impact | Direction to fix |
|---|------|------|--------|------------------|
| 1 | Data / UX | The price chart uses a **synthetic series** (`SERIES_RATIOS` in `lib/commodity-format.ts`) anchored to the latest quote, not real historical candles. Axis labels still read “6 Weeks Ago” / “Today”. | Users may believe the chart is market history; copy and visualization are misaligned. | Feed real historical points from `/rates/historical` (or another time-series source), or relabel the chart as illustrative / remove time claims. |
| 2 | Security / abuse | `app/api/commodity/latest/route.ts` exposes upstream commodity data **without authentication** on the app’s API. | Anyone can trigger server-side fetches that consume `COMMODITY_API_KEY` quota and add load. | Require auth for the route, add edge/server rate limiting, or proxy only from trusted contexts. |
| 3 | Caching | Commodity fetches use `cache: "no-store"` in `lib/commodity-service.ts`. | Every user navigation hits the network; no shared cache across users or regions. | Introduce `revalidate`/TTL caching where correctness allows, or cache at the route with explicit freshness rules. |
| 4 | Testing | `vitest` is run with `--passWithNoTests` in `package.json`, and `lib/commodity-service.test.ts` covers **URL helpers only**, not `fetchLatestCommodityRates`, historical parsing, or `resolvePreviousClosesForSymbols`. | Regressions in parsing and orchestration can ship unnoticed. | Add mocked-fetch unit tests for parsers and integration tests for the API route; fail CI when no tests match changed code. |
| 5 | Testing | There are **no tests** for `app/api/commodity/latest/route.ts` (status codes, 503 when key missing, payload shape). | Contract drift between client and server is easy to miss. | Add route handler tests with mocked env and fetch. |
| 6 | Product copy | Root `metadata` in `app/layout.tsx` still describes **“Real-time fuel prices”** while the product surface is **commodity futures** (see header and dashboard). | SEO and social previews misrepresent the app. | Align `title` / `description` with the actual commodity scope. |
| 7 | Naming / structure | `lib/gas-price.ts` encodes **gas-station** concepts (`StationPrice`, fuel types) while the dashboard uses commodity symbols; only helpers like `formatPrice` are shared. | Onboarding and refactors are harder; names suggest the wrong domain. | Split shared formatting into neutral `lib/format-money.ts` (or similar) or rename module boundaries to match commodities. |
| 8 | Configuration | `next.config.ts` is effectively **empty** (no security headers, redirects, or bundle/analysis options). | Defaults may be fine for a demo, but production hardening is unspecified. | Add headers (CSP where feasible), review image/asset needs, document intentional omissions. |
| 9 | React / themes | `app/layout.tsx` sets `suppressHydrationWarning` on `<html>` for theme compatibility. | Can mask unrelated hydration bugs if overused. | Keep documented; periodically verify no other mismatches rely on suppression. |
| 10 | Linting | `components/gasync/gasync-theme-settings.tsx` disables `react-hooks/set-state-in-effect` for a **mount gate** before rendering Radix + `next-themes`. | Rule is bypassed locally; pattern must stay intentional. | Prefer a documented pattern (e.g. `useSyncExternalStore` for `mounted`) if the ecosystem catches up. |
| 11 | Correctness | When a **prior close is missing**, `sessionChangeFromPrevious` in `lib/commodity-format.ts` reports **0% / flat** instead of an explicit “unknown baseline”. | Daily change can look settled when data is incomplete. | Surface “—” or copy when `previousCloses` lacks a symbol; distinguish missing data from true flat. |
| 12 | Documentation drift | `docs/testing-strategy.md` still refers to **“Gas Price Viewer”** and flows (search, alerts) that do not match the current Next.js commodity UI. | New contributors follow the wrong mental model. | Rewrite the doc to describe Vitest usage for the actual app, or archive it with a pointer to current scope. |
| 13 | Process / docs | `docs/deployment-plan.md` notes production may track **`main` or `development`** depending on team convention. | Ambiguity increases wrong-branch deploy mistakes. | Pick a single production branch in the doc and Vercel settings, or table environments explicitly. |

## Retired

| Former # | Resolution |
|----------|------------|
| 2 | Prior closes: `resolvePreviousClosesForSymbols` now loads up to ten `/rates/historical` days in **parallel** (`Promise.all`) so latency is one upstream wave instead of ten sequential round-trips. Run `pnpm run measure:previous-closes` (prints sequential vs parallel ms; uses `--reporter=verbose`) or `vitest run scripts/previous-closes-performance.test.ts --reporter=verbose` for before/after timing with a mocked network delay. |

## How to use this list

- Link fixes to items by number in pull requests.
- When an item is fully addressed, remove it from the table or move it to a short “Retired” subsection with the merge reference.
