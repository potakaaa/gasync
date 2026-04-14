import { Minus, TrendingDown, TrendingUp } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { ChangeDirection, CommodityPriceSnapshot } from "@/lib/commodity-types";
import { formatChangeLabel, formatCommodityQuote } from "@/lib/commodity-format";

function ChangeBadge({
  direction,
  changePct,
}: {
  direction: ChangeDirection;
  changePct: number;
}) {
  const label = formatChangeLabel(changePct, direction);
  const Icon =
    direction === "up"
      ? TrendingUp
      : direction === "down"
        ? TrendingDown
        : Minus;

  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-1 border px-2 py-0.5 text-xs font-medium tabular-nums",
        direction === "up" &&
          "border-tertiary/30 bg-tertiary/10 text-accent-foreground hover:bg-tertiary/10 dark:border-tertiary/40 dark:bg-tertiary/15",
        direction === "down" &&
          "border-destructive/30 bg-destructive/10 text-destructive hover:bg-destructive/10 dark:bg-destructive/15",
        direction === "flat" &&
          "border-border bg-muted/80 text-muted-foreground hover:bg-muted/80",
      )}
    >
      <Icon className="size-3" aria-hidden />
      {label}
    </Badge>
  );
}

type GasyncOtherCommoditiesProps = {
  items: CommodityPriceSnapshot[];
};

export function GasyncOtherCommodities({ items }: GasyncOtherCommoditiesProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between gap-2 border-b border-border/60 pb-2">
        <h2 className="font-heading text-base font-semibold tracking-tight text-foreground">
          Other commodities
        </h2>
        <span className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
          At a glance
        </span>
      </div>
      <ul className="space-y-2.5">
        {items.map((item) => (
          <li key={item.symbol}>
            <Card
              size="sm"
              className="border-border/50 bg-card/80 shadow-sm ring-1 ring-foreground/[0.04] transition-all duration-200 hover:-translate-y-px hover:bg-muted/25 hover:shadow-md dark:hover:bg-muted/20"
            >
              <CardContent className="flex items-center justify-between gap-3 py-3">
                <span className="text-sm font-medium text-foreground">
                  {item.label}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold tabular-nums text-foreground">
                    {formatCommodityQuote(item.price, item.unit, item.quote)}
                  </span>
                  <ChangeBadge
                    direction={item.direction}
                    changePct={item.changePct}
                  />
                </div>
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>
    </section>
  );
}
