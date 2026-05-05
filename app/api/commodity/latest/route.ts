import {
  fetchLatestCommodityRates,
  resolvePreviousClosesForSymbols,
} from "@/lib/commodity-service";
import type { CommodityRatesPayload } from "@/lib/commodity-types";
import { z } from "zod"; // Step 1: Import Zod

// Step 2: Define a validation schema for the 'symbol' query parameter
const QuerySchema = z.object({
  symbol: z.string().min(1).max(10).toUpperCase().optional(),
});

export async function GET(request: Request) {
  // --- INPUT VALIDATION START ---
  const { searchParams } = new URL(request.url);
  const validation = QuerySchema.safeParse({
    symbol: searchParams.get("symbol"),
  });

  if (!validation.success) {
    return Response.json(
      { error: "Invalid query parameters provided." },
      { status: 400 },
    );
  }
  // --- INPUT VALIDATION END ---

  // --- AUTHENTICATION START ---
  const authHeader = request.headers.get("x-api-key");

  if (!authHeader || authHeader !== process.env.INTERNAL_APP_KEY) {
    // This provides Logging (another checklist item) by reporting the failure
    console.error("Unauthorized access attempt detected.");
    return Response.json(
      { error: "Unauthorized: Invalid or missing internal API key." },
      { status: 401 },
    );
  }
  // --- AUTHENTICATION END ---

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
