# Performance notes

This document records intentional performance work in **gasync** and how to reproduce measurements locally. Numbers below are from **mocked** network delay unless stated otherwise; real upstream latency and quota depend on the Commodity Price API and network conditions.

## Prior session closes (`/rates/historical`)

### Context

The `/api/commodity/latest` route composes latest quotes with **prior session closes** so the UI can show daily change vs the previous close. Those closes come from the upstream `/rates/historical` endpoint, walking back up to ten UTC calendar days until each tracked symbol has a baseline.

### Change (retired tech-debt #2)

| | Before | After |
|---|--------|--------|
| **Behavior** | Up to ten **sequential** `fetch` calls (one awaited round-trip after another). | Up to ten historical days requested in **one parallel wave** via `Promise.all` in `resolvePreviousClosesForSymbols` (`lib/commodity-service.ts`). |
| **Wall-clock** | Roughly the **sum** of per-call latencies along the path taken (e.g. several hundred milliseconds when multiple days are needed). | Roughly **one** upstream round-trip time for the slowest call in that wave (plus parsing), instead of stacking delays. |

Merge order is unchanged: results are still applied from the nearest prior day outward, so the merged `previousCloses` map matches the previous sequential implementation for the same API responses.

### Trade-offs

- **Upstream calls per request:** The parallel path issues **up to ten** historical requests whenever prior closes are resolved, even if earlier days would have filled every symbol. The old sequential loop could **stop early** once all symbols had a baseline, using fewer calls in the best case. Parallelization optimizes **latency**, not minimum call count.
- **Quota:** More calls in some scenarios; monitor `COMMODITY_API_KEY` usage if traffic grows. Further options (not implemented here) include TTL caching or a batch/time-series API if the vendor adds one.

### Reproduce timings (mocked delay)

The Vitest file `scripts/previous-closes-performance.test.ts` stubs `fetch` with a fixed per-call delay, runs a **sequential** helper that mirrors the pre-change behavior, then runs the current `resolvePreviousClosesForSymbols`, and asserts both paths return the same merged map while sequential wall time is much higher than parallel.

```bash
pnpm run measure:previous-closes
```

Example output line (illustrative; values vary by machine load):

```text
[previous-closes-performance] mock delay 25ms/call | sequential ~88ms | parallel ~28ms
```

Use `--reporter=verbose` if you invoke Vitest directly so the `console.log` line appears.
