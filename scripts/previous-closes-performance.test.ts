/**
 * Measures wall-clock time for **before** (sequential historical fetches) vs
 * **after** (`resolvePreviousClosesForSymbols` with parallel `Promise.all`)
 * using a mocked `fetch` that sleeps a fixed delay per call.
 *
 * Run: `pnpm run measure:previous-closes` or
 * `pnpm exec vitest run scripts/previous-closes-performance.test.ts`
 */
import { describe, expect, it, vi } from "vitest";

import {
  fetchHistoricalCommodityRates,
  formatUtcDateYYYYMMDD,
  resolveHistoricalBaseUrl,
  resolvePreviousClosesForSymbols,
} from "@/lib/commodity-service";
import { COMMODITY_SYMBOLS, type CommoditySymbol } from "@/lib/commodity-types";

const MAX_PRIOR_DAYS_TO_SCAN = 10;
const MOCK_DELAY_MS = 25;
const LATEST_TS = Math.floor(Date.UTC(2024, 5, 15, 12, 0, 0) / 1000);
const API_KEY = "test-key";
const UPSTREAM =
  "https://api.commoditypriceapi.com/v2/rates/latest";

/** UTC calendar dates for prior days 1..10 (same construction as commodity-service). */
function priorDayDateStrings(latestTimestamp: number): string[] {
  const anchorMs = latestTimestamp * 1000;
  const dates: string[] = [];
  for (let dayOffset = 1; dayOffset <= MAX_PRIOR_DAYS_TO_SCAN; dayOffset++) {
    const d = new Date(anchorMs);
    d.setUTCDate(d.getUTCDate() - dayOffset);
    dates.push(formatUtcDateYYYYMMDD(d));
  }
  return dates;
}

function delay(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * Each prior day returns **one** symbol’s close so the old sequential path must
 * await multiple round-trips; the parallel path still completes in one wave.
 */
function historicalJsonBodyForDate(
  dateStr: string,
  priorDates: readonly string[],
) {
  const idx = priorDates.indexOf(dateStr);
  const partial: Partial<Record<CommoditySymbol, { close: number }>> = {};
  if (idx === 0) {
    partial["NG-FUT"] = { close: 100 };
  } else if (idx === 1) {
    partial["BRENTOIL-FUT"] = { close: 101 };
  } else if (idx === 2) {
    partial["WTIOIL-FUT"] = { close: 102 };
  }
  return {
    success: true,
    date: dateStr,
    rates: partial,
  };
}

/**
 * Pre–debt-#2 behavior: one `await fetchHistoricalCommodityRates` per day in
 * order (up to ten sequential upstream round-trips).
 */
async function sequentialResolvePreviousClosesForSymbols(
  apiKey: string,
  latestTimestamp: number,
  latestUpstreamUrl: string,
): Promise<Partial<Record<CommoditySymbol, number>>> {
  const trimmed = apiKey.trim();
  if (!trimmed) {
    return {};
  }

  const historicalBase = resolveHistoricalBaseUrl(latestUpstreamUrl);
  const anchorMs = latestTimestamp * 1000;
  const out: Partial<Record<CommoditySymbol, number>> = {};

  for (let dayOffset = 1; dayOffset <= MAX_PRIOR_DAYS_TO_SCAN; dayOffset++) {
    const d = new Date(anchorMs);
    d.setUTCDate(d.getUTCDate() - dayOffset);
    const dateStr = formatUtcDateYYYYMMDD(d);
    const result = await fetchHistoricalCommodityRates(
      trimmed,
      dateStr,
      historicalBase,
    );
    if (!result.ok) {
      continue;
    }
    for (const sym of COMMODITY_SYMBOLS) {
      if (out[sym] !== undefined) {
        continue;
      }
      const c = result.data.closes[sym];
      if (c !== undefined && Number.isFinite(c)) {
        out[sym] = c;
      }
    }
    if (COMMODITY_SYMBOLS.every((s) => out[s] !== undefined)) {
      break;
    }
  }

  return out;
}

function installMockFetch(priorDates: readonly string[]) {
  const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
    const url = typeof input === "string" ? input : input.toString();
    if (!url.includes("/rates/historical")) {
      return new Response("{}", { status: 404 });
    }
    const parsed = new URL(url);
    const dateStr = parsed.searchParams.get("date") ?? "1970-01-01";
    await delay(MOCK_DELAY_MS);
    return new Response(
      JSON.stringify(historicalJsonBodyForDate(dateStr, priorDates)),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  });
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

describe("previous closes: sequential vs parallel wall time", () => {
  it("reports before/after timings and keeps merged prior closes aligned", async () => {
    const priorDates = priorDayDateStrings(LATEST_TS);
    installMockFetch(priorDates);

    const t0 = performance.now();
    const sequential = await sequentialResolvePreviousClosesForSymbols(
      API_KEY,
      LATEST_TS,
      UPSTREAM,
    );
    const sequentialMs = performance.now() - t0;

    vi.unstubAllGlobals();

    installMockFetch(priorDates);

    const t1 = performance.now();
    const parallel = await resolvePreviousClosesForSymbols(
      API_KEY,
      LATEST_TS,
      UPSTREAM,
    );
    const parallelMs = performance.now() - t1;

    expect(parallel).toEqual(sequential);
    expect(sequential).toMatchObject({
      "NG-FUT": 100,
      "BRENTOIL-FUT": 101,
      "WTIOIL-FUT": 102,
    });

    // Sequential path: three prior days, three awaited round-trips.
    expect(sequentialMs).toBeGreaterThanOrEqual(MOCK_DELAY_MS * 3 - 5);
    // Parallel path: ten requests in one wave ≈ one per-call delay.
    expect(parallelMs).toBeLessThan(MOCK_DELAY_MS * 2);

    console.log(
      `[previous-closes-performance] mock delay ${MOCK_DELAY_MS}ms/call | sequential ~${sequentialMs.toFixed(1)}ms | parallel ~${parallelMs.toFixed(1)}ms`,
    );
  });
});
