import type {
  CommodityLatestRates,
  CommodityMetadataEntry,
  CommoditySymbol,
} from "@/lib/commodity-types";
import { COMMODITY_SYMBOLS, isCommoditySymbol } from "@/lib/commodity-types";

/** Real JSON API (marketing domain `/rates/latest` serves HTML and breaks JSON parsing). */
const DEFAULT_LATEST_URL = "https://api.commoditypriceapi.com/v2/rates/latest";

const DEFAULT_HISTORICAL_URL =
  "https://api.commoditypriceapi.com/v2/rates/historical";

const MAX_PRIOR_DAYS_TO_SCAN = 10;

/**
 * v2 `/rates/latest` requires `symbols` as query params (comma-separated).
 * Exported for tests and callers overriding {@link DEFAULT_LATEST_URL}.
 */
export function buildCommodityLatestRatesUrl(base: string): string {
  const url = new URL(base);
  url.searchParams.set("symbols", COMMODITY_SYMBOLS.join(","));
  return url.toString();
}

/**
 * v2 `/rates/historical` requires `symbols` and `date` (YYYY-MM-DD).
 * Exported for tests and callers overriding the historical base URL.
 */
export function buildCommodityHistoricalRatesUrl(
  base: string,
  date: string,
): string {
  const url = new URL(base);
  url.searchParams.set("symbols", COMMODITY_SYMBOLS.join(","));
  url.searchParams.set("date", date);
  return url.toString();
}

/**
 * Derives `/rates/historical` URL from the same base as latest, or falls back to
 * {@link DEFAULT_HISTORICAL_URL}.
 */
export function resolveHistoricalBaseUrl(
  latestUrl: string = process.env.COMMODITY_API_URL ?? DEFAULT_LATEST_URL,
): string {
  if (latestUrl.includes("/latest")) {
    return latestUrl.replace(/\/latest$/, "/historical");
  }
  return DEFAULT_HISTORICAL_URL;
}

export function formatUtcDateYYYYMMDD(d: Date): string {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function resolveCommoditySymbolKey(raw: string): CommoditySymbol | null {
  const u = raw.toUpperCase();
  for (const sym of COMMODITY_SYMBOLS) {
    if (sym.toUpperCase() === u) {
      return sym;
    }
  }
  return null;
}

export type FetchLatestOk = { ok: true; data: CommodityLatestRates };

export type FetchLatestErr = {
  ok: false;
  error: string;
  status?: number;
};

export type FetchLatestResult = FetchLatestOk | FetchLatestErr;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function upstreamErrorMessage(body: unknown, status: number): string {
  if (isRecord(body)) {
    if (typeof body.message === "string" && body.message.trim()) {
      return body.message;
    }
    if (typeof body.error === "string" && body.error.trim()) {
      return body.error;
    }
  }
  return `Commodity API error (${status})`;
}

function parseRates(value: unknown): Partial<Record<CommoditySymbol, number>> | null {
  if (!isRecord(value)) {
    return null;
  }
  const out: Partial<Record<CommoditySymbol, number>> = {};
  for (const [k, v] of Object.entries(value)) {
    if (!isCommoditySymbol(k)) {
      continue;
    }
    if (typeof v === "number" && Number.isFinite(v)) {
      out[k] = v;
    }
  }
  return out;
}

function parseMetadata(
  value: unknown,
): Partial<Record<CommoditySymbol, CommodityMetadataEntry>> | null {
  if (!isRecord(value)) {
    return null;
  }
  const out: Partial<Record<CommoditySymbol, CommodityMetadataEntry>> = {};
  for (const [k, v] of Object.entries(value)) {
    if (!isCommoditySymbol(k) || !isRecord(v)) {
      continue;
    }
    const unit = v.unit;
    const quote = v.quote;
    if (typeof unit === "string" && typeof quote === "string") {
      out[k] = { unit, quote };
    }
  }
  return out;
}

function parseLatestPayload(json: unknown): CommodityLatestRates | null {
  if (!isRecord(json)) {
    return null;
  }
  if (json.success !== true) {
    return null;
  }
  if (typeof json.timestamp !== "number" || !Number.isFinite(json.timestamp)) {
    return null;
  }
  const rates = parseRates(json.rates);
  const metadata = parseMetadata(json.metadata);
  if (!rates || !metadata) {
    return null;
  }
  for (const sym of COMMODITY_SYMBOLS) {
    if (rates[sym] === undefined || metadata[sym] === undefined) {
      return null;
    }
  }
  return {
    success: true,
    timestamp: json.timestamp,
    rates: rates as Record<CommoditySymbol, number>,
    metadata: metadata as Record<CommoditySymbol, CommodityMetadataEntry>,
  };
}

export async function fetchLatestCommodityRates(
  apiKey: string,
  upstreamUrl: string = process.env.COMMODITY_API_URL ?? DEFAULT_LATEST_URL,
): Promise<FetchLatestResult> {
  const trimmed = apiKey.trim();
  if (!trimmed) {
    return { ok: false, error: "API key is empty." };
  }

  const url = buildCommodityLatestRatesUrl(upstreamUrl);

  let response: Response;
  try {
    response = await fetch(url, {
      headers: { "x-api-key": trimmed },
      cache: "no-store",
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Network error";
    return { ok: false, error: message };
  }

  const rawText = await response.text();
  let body: unknown;
  try {
    body = rawText.trim() === "" ? null : JSON.parse(rawText);
  } catch {
    return {
      ok: false,
      error:
        "Commodity API returned non-JSON (check COMMODITY_API_URL or upstream status).",
      status: response.status,
    };
  }

  if (isRecord(body) && body.success === false) {
    const err =
      typeof body.error === "string"
        ? body.error
        : "Commodity API reported failure.";
    return { ok: false, error: err, status: response.ok ? undefined : response.status };
  }

  if (!response.ok) {
    const msg = upstreamErrorMessage(body, response.status);
    return { ok: false, error: msg, status: response.status };
  }

  const parsed = parseLatestPayload(body);
  if (!parsed) {
    return { ok: false, error: "Unexpected commodity API response shape." };
  }

  return { ok: true, data: parsed };
}

export type HistoricalDayRates = {
  date: string;
  /** Prior session close per symbol for that historical day. */
  closes: Partial<Record<CommoditySymbol, number>>;
};

export type FetchHistoricalOk = { ok: true; data: HistoricalDayRates };

export type FetchHistoricalErr = {
  ok: false;
  error: string;
  status?: number;
};

export type FetchHistoricalResult = FetchHistoricalOk | FetchHistoricalErr;

function parseHistoricalClose(value: unknown): number | null {
  if (!isRecord(value)) {
    return null;
  }
  const close = value.close;
  if (typeof close !== "number" || !Number.isFinite(close)) {
    return null;
  }
  return close;
}

function parseHistoricalRatesPayload(json: unknown): HistoricalDayRates | null {
  if (!isRecord(json) || json.success !== true) {
    return null;
  }
  if (typeof json.date !== "string") {
    return null;
  }
  if (!isRecord(json.rates)) {
    return null;
  }
  const closes: Partial<Record<CommoditySymbol, number>> = {};
  for (const [k, v] of Object.entries(json.rates)) {
    const sym = resolveCommoditySymbolKey(k);
    if (!sym) {
      continue;
    }
    const close = parseHistoricalClose(v);
    if (close === null) {
      continue;
    }
    closes[sym] = close;
  }
  return { date: json.date, closes };
}

export async function fetchHistoricalCommodityRates(
  apiKey: string,
  date: string,
  upstreamUrl: string = resolveHistoricalBaseUrl(),
): Promise<FetchHistoricalResult> {
  const trimmed = apiKey.trim();
  if (!trimmed) {
    return { ok: false, error: "API key is empty." };
  }

  const url = buildCommodityHistoricalRatesUrl(upstreamUrl, date);

  let response: Response;
  try {
    response = await fetch(url, {
      headers: { "x-api-key": trimmed },
      cache: "no-store",
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Network error";
    return { ok: false, error: message };
  }

  const rawText = await response.text();
  let body: unknown;
  try {
    body = rawText.trim() === "" ? null : JSON.parse(rawText);
  } catch {
    return {
      ok: false,
      error:
        "Commodity API returned non-JSON (check COMMODITY_API_URL or upstream status).",
      status: response.status,
    };
  }

  if (isRecord(body) && body.success === false) {
    const err =
      typeof body.error === "string"
        ? body.error
        : "Commodity API reported failure.";
    return { ok: false, error: err, status: response.ok ? undefined : response.status };
  }

  if (!response.ok) {
    const msg = upstreamErrorMessage(body, response.status);
    return { ok: false, error: msg, status: response.status };
  }

  const parsed = parseHistoricalRatesPayload(body);
  if (!parsed) {
    return { ok: false, error: "Unexpected commodity historical API response shape." };
  }

  return { ok: true, data: parsed };
}

/**
 * Walks back up to {@link MAX_PRIOR_DAYS_TO_SCAN} UTC calendar days from
 * `latestTimestamp` and merges prior closes until each commodity symbol has a
 * baseline (for daily % vs previous close).
 */
export async function resolvePreviousClosesForSymbols(
  apiKey: string,
  latestTimestamp: number,
  latestUpstreamUrl: string = process.env.COMMODITY_API_URL ?? DEFAULT_LATEST_URL,
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
