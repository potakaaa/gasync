import {
  fetchLatestCommodityRates,
  resolvePreviousClosesForSymbols,
} from "@/lib/commodity-service";
import { logger, withRequestLogging } from "@/lib/logger";
import type { CommodityRatesPayload } from "@/lib/commodity-types";

async function handler(): Promise<Response> {
  const apiKey = process.env.COMMODITY_API_KEY;
  if (!apiKey?.trim()) {
    logger.warn("config.missing", { key: "COMMODITY_API_KEY" });
    return Response.json(
      { error: "COMMODITY_API_KEY is not configured." },
      { status: 503 },
    );
  }

  const result = await fetchLatestCommodityRates(apiKey);
  if (!result.ok) {
    logger.error("upstream.error", {
      route: "commodity.latest",
      upstreamStatus: result.status,
      message: result.error,
    });
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

export const GET = withRequestLogging("commodity.latest", handler);
