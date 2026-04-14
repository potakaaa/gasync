import {
  fetchLatestCommodityRates,
  resolvePreviousClosesForSymbols,
} from "@/lib/commodity-service";
import type { CommodityRatesPayload } from "@/lib/commodity-types";

export async function GET() {
  const apiKey = process.env.COMMODITY_API_KEY;
  if (!apiKey?.trim()) {
    return Response.json(
      { error: "COMMODITY_API_KEY is not configured." },
      { status: 503 },
    );
  }

  const result = await fetchLatestCommodityRates(apiKey);
  if (!result.ok) {
    return Response.json(
      { error: result.error },
      { status: result.status && result.status >= 400 ? result.status : 502 },
    );
  }

  const previousCloses = await resolvePreviousClosesForSymbols(
    apiKey,
    result.data.timestamp,
  );

  const payload: CommodityRatesPayload = {
    ...result.data,
    previousCloses,
  };

  return Response.json(payload);
}
