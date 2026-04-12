import { describe, expect, it } from "vitest";

import {
  buildSearchHref,
  classifyPriceBand,
  filterStationsByFuelType,
  formatPrice,
  getTrendDirection,
  isFreshPriceUpdate,
  resolveFuelTypeFilter,
  sortStationsByPrice,
  type StationPrice,
} from "./gas-price";

const sampleStations: StationPrice[] = [
  {
    name: "North Hub",
    fuelType: "regular",
    price: 3.79,
    updatedAt: "2026-04-12T10:00:00Z",
  },
  {
    name: "East Corner",
    fuelType: "premium",
    price: 4.49,
    updatedAt: "2026-04-12T09:55:00Z",
  },
  {
    name: "Central Stop",
    fuelType: "premium",
    price: 4.29,
    updatedAt: "2026-04-12T09:58:00Z",
  },
];

describe("gas price helpers", () => {
  it("formats prices to two decimals", () => {
    expect(formatPrice(3.579)).toBe("$3.58");
  });

  it("filters stations by fuel type", () => {
    const premiumStations = filterStationsByFuelType(sampleStations, "premium");

    expect(premiumStations).toHaveLength(2);
    expect(premiumStations.map((station) => station.name)).toEqual([
      "East Corner",
      "Central Stop",
    ]);
  });

  it("sorts stations by price and then by name", () => {
    const sortedStations = sortStationsByPrice(sampleStations);

    expect(sortedStations.map((station) => station.name)).toEqual([
      "North Hub",
      "Central Stop",
      "East Corner",
    ]);
  });

  it("treats updates within the freshness window as fresh", () => {
    expect(
      isFreshPriceUpdate(
        "2026-04-12T09:35:00Z",
        "2026-04-12T10:00:00Z",
      ),
    ).toBe(true);
  });

  it("marks updates older than the freshness window as stale", () => {
    expect(
      isFreshPriceUpdate(
        "2026-04-12T09:25:00Z",
        "2026-04-12T10:00:00Z",
      ),
    ).toBe(false);
  });

  it("detects the direction of the trend", () => {
    expect(getTrendDirection(3.75, 3.9)).toBe("up");
    expect(getTrendDirection(3.9, 3.75)).toBe("down");
    expect(getTrendDirection(3.8, 3.804)).toBe("flat");
  });

  it("classifies prices relative to the benchmark", () => {
    expect(classifyPriceBand(3.5, 3.8)).toBe("low");
    expect(classifyPriceBand(3.8, 3.8)).toBe("medium");
    expect(classifyPriceBand(4.1, 3.8)).toBe("high");
  });

  it("resolves a valid fuel-type query value", () => {
    expect(resolveFuelTypeFilter("regular")).toBe("regular");
  });

  it("falls back to the default fuel type when the query is invalid", () => {
    expect(resolveFuelTypeFilter("diesel")).toBe("premium");
    expect(resolveFuelTypeFilter(["midgrade", "premium"])).toBe("midgrade");
  });

  it("builds a search href that preserves location and fuel type", () => {
    const href = buildSearchHref({
      location: "Detroit, MI",
      fuelType: "premium",
    });

    const params = new URLSearchParams(href.split("?")[1]);

    expect(params.get("location")).toBe("Detroit, MI");
    expect(params.get("fuel")).toBe("premium");
  });
});