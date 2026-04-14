import { Activity } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { MarketPulseSummary } from "@/lib/commodity-format";

type GasyncMarketPulseProps = {
  summary: MarketPulseSummary | null;
};

export function GasyncMarketPulse({ summary }: GasyncMarketPulseProps) {
  return (
    <Card className="overflow-hidden border-border/60 bg-linear-to-b from-card to-muted/30 shadow-md ring-1 ring-foreground/5">
      <div className="h-1 w-full bg-linear-to-r from-tertiary/80 via-tertiary/40 to-transparent" />
      <CardHeader className="pb-2 pt-5">
        <CardTitle className="flex items-center gap-3 text-base font-semibold">
          <span className="flex size-9 items-center justify-center rounded-xl bg-tertiary/12 text-tertiary ring-1 ring-tertiary/20 dark:bg-tertiary/20">
            <Activity className="size-4" aria-hidden />
          </span>
          {summary?.title ?? "Market Pulse"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-0 pb-5">
        <p className="text-sm leading-relaxed text-muted-foreground">
          {summary?.body ??
            "Load latest rates to see a quick read on crude spreads and timing."}
        </p>
      </CardContent>
    </Card>
  );
}
