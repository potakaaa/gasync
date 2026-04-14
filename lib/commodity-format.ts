import { formatPrice } from "@/lib/gas-price";
import type {
  ChangeDirection,
  ChartPoint,
  CommodityLatestRates,
  CommodityPriceSnapshot,
  CommoditySymbol,
} from "@/lib/commodity-types";
import {
  COMMODITY_LABELS,
  COMMODITY_SYMBOLS,
} from "@/lib/commodity-types";

/** Smooth synthetic series ending at the anchor price (14 points ≈ 6 weeks). */
const SERIES_RATIOS = [
  0.94, 0.95, 0.93, 0.96, 0.97, 0.96, 0.98, 0.99, 0.985, 0.99, 0.995, 1.0, 1.0, 1.0,
];

export function formatChangeLabel(
  changePct: number,
  direction: ChangeDirection,
): string {
  if (direction === "flat") {
    return "0.00%";
  }
  const sign = changePct > 0 ? "+" : "";
  return `${sign}${changePct.toFixed(2)}%`;
}

export function formatCommodityQuote(
  price: number,
  unit: string,
  quote: string,
): string {
  return `${formatPrice(price)} / ${unit} · ${quote}`;
}

export function getChartSeries(anchorPrice: number): ChartPoint[] {
  return SERIES_RATIOS.map((ratio, index) => ({
    i: index,
    price: roundPrice(anchorPrice * ratio),
  }));
}

function roundPrice(n: number): number {
  if (!Number.isFinite(n)) {
    return 0;
  }
  const decimals = n >= 100 ? 2 : n >= 10 ? 2 : 4;
  const f = 10 ** decimals;
  return Math.round(n * f) / f;
}

export function chartYAxisPadding(
  minPrice: number,
  maxPrice: number,
): [string, string] {
  const span = maxPrice - minPrice;
  const pad = Math.max(span * 0.05, Math.abs(maxPrice) * 0.001, 1e-6);
  return [`${minPrice - pad}`, `${maxPrice + pad}`];
}

const EPSILON = 1e-9;

export function sessionChangeFromPrevious(
  previous: number | null,
  current: number,
): { changePct: number; direction: ChangeDirection } {
  if (previous === null || !Number.isFinite(previous) || previous === 0) {
    return { changePct: 0, direction: "flat" };
  }
  const raw = ((current - previous) / previous) * 100;
  const changePct = Math.round(raw * 100) / 100;
  if (Math.abs(current - previous) < EPSILON) {
    return { changePct: 0, direction: "flat" };
  }
  if (changePct > 0) {
    return { changePct, direction: "up" };
  }
  if (changePct < 0) {
    return { changePct, direction: "down" };
  }
  return { changePct: 0, direction: "flat" };
}

export function buildSnapshot(
  symbol: CommoditySymbol,
  data: CommodityLatestRates,
  previousCloses: Partial<Record<CommoditySymbol, number>> | null,
): CommodityPriceSnapshot {
  const price = data.rates[symbol]!;
  const meta = data.metadata[symbol]!;
  const label = COMMODITY_LABELS[symbol];
  const prev = previousCloses?.[symbol];
  const { changePct, direction } = sessionChangeFromPrevious(
    prev ?? null,
    price,
  );
  return {
    symbol,
    label,
    price,
    changePct,
    direction,
    unit: meta.unit,
    quote: meta.quote,
  };
}

export function getOtherCommoditySnapshots(
  current: CommoditySymbol,
  data: CommodityLatestRates,
  previousCloses: Partial<Record<CommoditySymbol, number>> | null,
): CommodityPriceSnapshot[] {
  return COMMODITY_SYMBOLS.filter((s) => s !== current).map((symbol) =>
    buildSnapshot(symbol, data, previousCloses),
  );
}

export type MarketPulseSummary = {
  title: string;
  body: string;
};

function formatMarketPulseAsOf(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(date);
}

function sessionChangeClause(snap: CommodityPriceSnapshot): string {
  if (snap.direction === "flat") {
    return "unchanged from the prior session";
  }
  const dir = snap.direction === "up" ? "up" : "down";
  return `${dir} ${Math.abs(snap.changePct).toFixed(2)}% from the prior session`;
}

/** Rule-based copy keyed by magnitude (percent moves differ by asset). */
function naturalGasRuleSentence(changePct: number): string {
  const a = Math.abs(changePct);
  if (a < 0.5) {
    return "Price action is muted versus the prior session.";
  }
  if (a < 2) {
    return "Session flows show moderate two-way trade.";
  }
  if (a < 5) {
    return "Volatility is elevated relative to a quiet tape.";
  }
  return "Front-month gas is seeing outsized daily movement.";
}

function brentWtiSpreadClause(spread: number): string {
  const s = Math.round(spread * 100) / 100;
  if (s > 3) {
    return "The Brent premium to WTI is unusually wide.";
  }
  if (s > 1.5) {
    return "Brent holds a firm premium to WTI.";
  }
  if (s > 0.75) {
    return "Brent trades with a modest premium to WTI.";
  }
  if (s > 0.05) {
    return "Grades are aligned with Brent slightly above WTI.";
  }
  if (s < -0.05) {
    return "WTI is at a rare premium to Brent.";
  }
  return "Brent and WTI are effectively priced together.";
}

/**
 * Deterministic, rule-based market pulse for the selected commodity (no LLM).
 * Oil tabs include Brent–WTI context; natural gas focuses on gas session behavior.
 */
export function buildMarketPulseSummary(
  symbol: CommoditySymbol,
  data: CommodityLatestRates,
  previousCloses: Partial<Record<CommoditySymbol, number>> | null,
): MarketPulseSummary {
  const snap = buildSnapshot(symbol, data, previousCloses);
  const asOf = formatMarketPulseAsOf(data.timestamp);
  const label = COMMODITY_LABELS[symbol];
  const quote = formatCommodityQuote(snap.price, snap.unit, snap.quote);

  if (symbol === "NG-FUT") {
    return {
      title: `Market Pulse · ${label}`,
      body: `${label} is ${quote}, ${sessionChangeClause(snap)}. ${naturalGasRuleSentence(snap.changePct)} As of ${asOf}.`,
    };
  }

  const wti = data.rates["WTIOIL-FUT"]!;
  const brent = data.rates["BRENTOIL-FUT"]!;
  const spread = brent - wti;
  const spreadAbs = Math.round(Math.abs(spread) * 100) / 100;
  const brentVsWti =
    spread > 0.05
      ? `Brent is $${spreadAbs.toFixed(2)} above WTI`
      : spread < -0.05
        ? `Brent is $${spreadAbs.toFixed(2)} below WTI`
        : "Brent and WTI are at parity";
  const wtiVsBrent =
    spread > 0.05
      ? `WTI is $${spreadAbs.toFixed(2)} below Brent`
      : spread < -0.05
        ? `WTI is $${spreadAbs.toFixed(2)} above Brent`
        : "WTI and Brent are at parity";

  if (symbol === "BRENTOIL-FUT") {
    return {
      title: `Market Pulse · ${label}`,
      body: `${label} is ${quote}, ${sessionChangeClause(snap)}. WTI sits at ${formatPrice(wti)} per barrel; ${brentVsWti}. ${brentWtiSpreadClause(spread)} As of ${asOf}.`,
    };
  }

  return {
    title: `Market Pulse · ${label}`,
    body: `${label} is ${quote}, ${sessionChangeClause(snap)}. Brent sits at ${formatPrice(brent)} per barrel; ${wtiVsBrent}. ${brentWtiSpreadClause(spread)} As of ${asOf}.`,
  };
}
