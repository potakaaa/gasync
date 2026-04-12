export type FuelType = "regular" | "midgrade" | "premium";

export const fuelTypeOptions: FuelType[] = ["regular", "midgrade", "premium"];

export const fuelTypeLabels: Record<FuelType, string> = {
  regular: "Regular",
  midgrade: "Midgrade",
  premium: "Premium",
};

export type StationPrice = {
  name: string;
  fuelType: FuelType;
  price: number;
  updatedAt: string;
};

type SearchHrefOptions = {
  location?: string;
  fuelType?: FuelType;
  pathname?: string;
};

export function isFuelType(value: string | null | undefined): value is FuelType {
  return fuelTypeOptions.includes(value as FuelType);
}

export function resolveFuelTypeFilter(
  value: string | string[] | undefined,
  fallback: FuelType = "premium",
): FuelType {
  const candidate = Array.isArray(value) ? value[0] : value;

  if (candidate && isFuelType(candidate)) {
    return candidate;
  }

  return fallback;
}

export function buildSearchHref({
  location,
  fuelType,
  pathname = "/",
}: SearchHrefOptions): string {
  const params = new URLSearchParams();

  if (location?.trim()) {
    params.set("location", location.trim());
  }

  if (fuelType) {
    params.set("fuel", fuelType);
  }

  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
}

export function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`;
}

export function filterStationsByFuelType<T extends StationPrice>(
  stations: T[],
  fuelType: FuelType,
): T[] {
  return stations.filter((station) => station.fuelType === fuelType);
}

export function sortStationsByPrice<T extends StationPrice>(stations: T[]): T[] {
  return [...stations].sort((left, right) => {
    if (left.price !== right.price) {
      return left.price - right.price;
    }

    return left.name.localeCompare(right.name);
  });
}

export function isFreshPriceUpdate(
  updatedAtIso: string,
  nowIso: string,
  freshnessWindowMinutes = 30,
): boolean {
  const updatedAt = Date.parse(updatedAtIso);
  const now = Date.parse(nowIso);

  if (Number.isNaN(updatedAt) || Number.isNaN(now)) {
    return false;
  }

  const ageMillis = now - updatedAt;
  return ageMillis >= 0 && ageMillis <= freshnessWindowMinutes * 60_000;
}

export function getTrendDirection(
  previousAverage: number,
  currentAverage: number,
  tolerance = 0.01,
): "down" | "flat" | "up" {
  const delta = currentAverage - previousAverage;

  if (delta > tolerance) {
    return "up";
  }

  if (delta < -tolerance) {
    return "down";
  }

  return "flat";
}

export function classifyPriceBand(
  price: number,
  benchmark: number,
  spread = 0.25,
): "low" | "medium" | "high" {
  if (price <= benchmark - spread) {
    return "low";
  }

  if (price >= benchmark + spread) {
    return "high";
  }

  return "medium";
}