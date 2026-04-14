/** Symbols returned by Commodity Price API (latest rates), stable tab order. */
export const COMMODITY_SYMBOLS = ["NG-FUT", "BRENTOIL-FUT", "WTIOIL-FUT"] as const;

export type CommoditySymbol = (typeof COMMODITY_SYMBOLS)[number];

export const COMMODITY_LABELS: Record<CommoditySymbol, string> = {
  "NG-FUT": "Natural Gas",
  "BRENTOIL-FUT": "Crude Oil Brent",
  "WTIOIL-FUT": "Crude Oil WTI",
};

export function isCommoditySymbol(value: string): value is CommoditySymbol {
  return (COMMODITY_SYMBOLS as readonly string[]).includes(value);
}

export type CommodityMetadataEntry = {
  unit: string;
  quote: string;
};

/** Normalized latest-rates payload (full symbol set). */
export type CommodityLatestRates = {
  success: boolean;
  timestamp: number;
  rates: Record<CommoditySymbol, number>;
  metadata: Record<CommoditySymbol, CommodityMetadataEntry>;
};

/**
 * Latest rates plus prior session closes from `/rates/historical` (server-composed).
 * Used for daily % vs previous close.
 */
export type CommodityRatesPayload = CommodityLatestRates & {
  previousCloses: Partial<Record<CommoditySymbol, number>>;
};

export type ChangeDirection = "up" | "down" | "flat";

export type CommodityPriceSnapshot = {
  symbol: CommoditySymbol;
  label: string;
  price: number;
  changePct: number;
  direction: ChangeDirection;
  unit: string;
  quote: string;
};

export type ChartPoint = {
  i: number;
  price: number;
};
