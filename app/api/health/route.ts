import { logger } from "@/lib/logger";

export async function GET() {
  logger.info("request", { route: "health", method: "GET", status: 200, durationMs: 0 });
  return Response.json({ ok: true });
}
