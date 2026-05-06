/**
 * lib/logger.ts
 *
 * Minimal structured logger for gasync API routes.
 *
 * Usage:
 *   import { logger } from "@/lib/logger";
 *   logger.info("commodity.fetch", { symbol: "NG-FUT", durationMs: 312 });
 *   logger.warn("config.missing", { key: "COMMODITY_API_KEY" });
 *   logger.error("upstream.error", { status: 502, message: "Bad Gateway" });
 *
 * Output is newline-delimited JSON (NDJSON), one object per line.
 * Vercel function logs, Railway, and most hosting platforms ingest this natively.
 */

export type LogLevel = "INFO" | "WARN" | "ERROR";

export interface LogEntry {
  level: LogLevel;
  event: string;
  ts: string; // ISO-8601
  [key: string]: unknown;
}

function emit(level: LogLevel, event: string, fields: Record<string, unknown>): void {
  const entry: LogEntry = {
    level,
    event,
    ts: new Date().toISOString(),
    ...fields,
  };
  console.log(JSON.stringify(entry)); // NDJSON structured log — intentional
}

export const logger = {
  info: (event: string, fields: Record<string, unknown> = {}) =>
    emit("INFO", event, fields),
  warn: (event: string, fields: Record<string, unknown> = {}) =>
    emit("WARN", event, fields),
  error: (event: string, fields: Record<string, unknown> = {}) =>
    emit("ERROR", event, fields),
};

/**
 * withRequestLogging — wraps a Next.js route handler (GET / POST / …) and
 * appends an `X-Response-Time` header plus a structured log line on every call.
 *
 * Example:
 *   export const GET = withRequestLogging("commodity.latest", handler);
 */
export function withRequestLogging(
  routeLabel: string,
  handler: (req: Request) => Promise<Response>,
): (req: Request) => Promise<Response> {
  return async (req: Request): Promise<Response> => {
    const start = performance.now();
    let status = 500;

    try {
      const response = await handler(req);
      status = response.status;
      const durationMs = Math.round(performance.now() - start);

      logger.info("request", {
        route: routeLabel,
        method: req.method,
        status,
        durationMs,
      });

      // Attach timing header so it's visible in curl / browser DevTools.
      const headers = new Headers(response.headers);
      headers.set("X-Response-Time", `${durationMs}ms`);

      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
      });
    } catch (err) {
      const durationMs = Math.round(performance.now() - start);
      logger.error("request.unhandled", {
        route: routeLabel,
        method: req.method,
        status,
        durationMs,
        message: err instanceof Error ? err.message : String(err),
      });
      throw err;
    }
  };
}
