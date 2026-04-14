import { describe, expect, it } from "vitest";

import {
  buildCommodityHistoricalRatesUrl,
  buildCommodityLatestRatesUrl,
  formatUtcDateYYYYMMDD,
  resolveHistoricalBaseUrl,
} from "@/lib/commodity-service";
import { COMMODITY_SYMBOLS } from "@/lib/commodity-types";

describe("buildCommodityLatestRatesUrl", () => {
  it("appends required symbols query for v2 latest rates", () => {
    const url = buildCommodityLatestRatesUrl(
      "https://api.commoditypriceapi.com/v2/rates/latest",
    );
    const parsed = new URL(url);
    expect(parsed.searchParams.get("symbols")).toBe(
      COMMODITY_SYMBOLS.join(","),
    );
  });
});

describe("buildCommodityHistoricalRatesUrl", () => {
  it("appends symbols and date for v2 historical rates", () => {
    const url = buildCommodityHistoricalRatesUrl(
      "https://api.commoditypriceapi.com/v2/rates/historical",
      "2019-01-04",
    );
    const parsed = new URL(url);
    expect(parsed.searchParams.get("symbols")).toBe(
      COMMODITY_SYMBOLS.join(","),
    );
    expect(parsed.searchParams.get("date")).toBe("2019-01-04");
  });
});

describe("resolveHistoricalBaseUrl", () => {
  it("replaces /latest with /historical", () => {
    expect(
      resolveHistoricalBaseUrl(
        "https://api.commoditypriceapi.com/v2/rates/latest",
      ),
    ).toBe("https://api.commoditypriceapi.com/v2/rates/historical");
  });
});

describe("formatUtcDateYYYYMMDD", () => {
  it("formats UTC calendar date", () => {
    const d = new Date(Date.UTC(2019, 0, 4, 15, 30, 0));
    expect(formatUtcDateYYYYMMDD(d)).toBe("2019-01-04");
  });
});
