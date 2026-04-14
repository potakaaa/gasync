import { describe, expect, it } from "vitest";

import {
  buildMarketPulseSummary,
  buildSnapshot,
  chartYAxisPadding,
  formatChangeLabel,
  formatCommodityQuote,
  sessionChangeFromPrevious,
} from "@/lib/commodity-format";
import type { CommodityLatestRates } from "@/lib/commodity-types";

const fixtureRates: CommodityLatestRates = {
  success: true,
  timestamp: 1_776_172_739,
  rates: {
    "NG-FUT": 2.63,
    "BRENTOIL-FUT": 97.72,
    "WTIOIL-FUT": 96.15,
  },
  metadata: {
    "NG-FUT": { unit: "MMBtu", quote: "USD" },
    "BRENTOIL-FUT": { unit: "Bbl", quote: "USD" },
    "WTIOIL-FUT": { unit: "Bbl", quote: "USD" },
  },
};

describe("formatChangeLabel", () => {
  it("formats flat as 0.00%", () => {
    expect(formatChangeLabel(0, "flat")).toBe("0.00%");
  });

  it("formats positive and negative", () => {
    expect(formatChangeLabel(1.25, "up")).toBe("+1.25%");
    expect(formatChangeLabel(-0.5, "down")).toBe("-0.50%");
  });
});

describe("formatCommodityQuote", () => {
  it("includes unit and quote", () => {
    expect(formatCommodityQuote(96.15, "Bbl", "USD")).toBe("$96.15 / Bbl · USD");
  });
});

describe("sessionChangeFromPrevious", () => {
  it("is flat when no previous", () => {
    expect(sessionChangeFromPrevious(null, 100)).toEqual({
      changePct: 0,
      direction: "flat",
    });
  });

  it("detects up and down", () => {
    expect(sessionChangeFromPrevious(100, 101)).toMatchObject({
      direction: "up",
    });
    expect(sessionChangeFromPrevious(100, 99)).toMatchObject({
      direction: "down",
    });
  });
});

describe("buildSnapshot", () => {
  it("computes change vs prior close", () => {
    const snap = buildSnapshot("NG-FUT", fixtureRates, { "NG-FUT": 2.5 });
    expect(snap.direction).toBe("up");
    expect(snap.changePct).toBe(5.2);
  });
});

describe("chartYAxisPadding", () => {
  it("pads min and max", () => {
    const [a, b] = chartYAxisPadding(90, 100);
    expect(Number(a)).toBeLessThan(90);
    expect(Number(b)).toBeGreaterThan(100);
  });
});

describe("buildMarketPulseSummary", () => {
  const prev = {
    "NG-FUT": 2.5,
    "BRENTOIL-FUT": 96.0,
    "WTIOIL-FUT": 95.5,
  };

  it("natural gas: session change and rule line", () => {
    const s = buildMarketPulseSummary("NG-FUT", fixtureRates, prev);
    expect(s.title).toContain("Natural Gas");
    expect(s.body).toContain("MMBtu");
    expect(s.body).toContain("prior session");
    expect(s.body).toContain("As of");
  });

  it("Brent: pairs WTI and spread context", () => {
    const s = buildMarketPulseSummary("BRENTOIL-FUT", fixtureRates, prev);
    expect(s.title).toContain("Brent");
    expect(s.body).toContain("WTI");
    expect(s.body).toContain("Brent");
    expect(s.body).toContain("As of");
  });

  it("WTI: pairs Brent and discount wording", () => {
    const s = buildMarketPulseSummary("WTIOIL-FUT", fixtureRates, prev);
    expect(s.title).toContain("WTI");
    expect(s.body).toContain("Brent");
    expect(s.body).toContain("below Brent");
    expect(s.body).toContain("As of");
  });
});
