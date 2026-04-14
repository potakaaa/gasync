"use client";

import { Clock, Minus, TrendingDown, TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import type { ChangeDirection, ChartPoint, CommodityPriceSnapshot } from "@/lib/commodity-types";
import {
  chartYAxisPadding,
  formatChangeLabel,
  formatCommodityQuote,
} from "@/lib/commodity-format";

const chartConfig = {
  price: {
    label: "Price",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

function ChangeBadge({
  direction,
  changePct,
  className,
}: {
  direction: ChangeDirection;
  changePct: number;
  className?: string;
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
        "h-auto! min-h-0 items-center gap-1 border px-2.5 py-1 text-xs font-medium tabular-nums leading-none!",
        direction === "up" &&
          "border-tertiary/30 bg-tertiary/10 text-accent-foreground hover:bg-tertiary/10 dark:border-tertiary/40 dark:bg-tertiary/15",
        direction === "down" &&
          "border-destructive/30 bg-destructive/10 text-destructive hover:bg-destructive/10 dark:bg-destructive/15",
        direction === "flat" &&
          "border-border bg-muted/80 text-muted-foreground hover:bg-muted/80",
        className,
      )}
    >
      <Icon className="size-3" aria-hidden />
      {label}
    </Badge>
  );
}

function formatUpdatedAt(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(date);
}

type GasyncPriceChartCardProps = {
  snapshot: CommodityPriceSnapshot;
  series: ChartPoint[];
  updatedAt: Date;
};

export function GasyncPriceChartCard({
  snapshot,
  series,
  updatedAt,
}: GasyncPriceChartCardProps) {
  const lastIndex = Math.max(0, series.length - 1);
  const prices = series.map((p) => p.price);
  const minP = Math.min(...prices);
  const maxP = Math.max(...prices);
  const [yMin, yMax] = chartYAxisPadding(minP, maxP);

  return (
    <Card className="overflow-hidden border-border/60 bg-card shadow-lg ring-1 ring-foreground/6">
      <CardHeader className="relative gap-3 pb-2">
        <CardDescription className="relative text-xs font-semibold tracking-wider text-muted-foreground uppercase">
          Current price · {snapshot.label}
        </CardDescription>
        {/* Inline line box (not flex): flex ignores vertical-align; align-middle matches the pill to the large type */}
        <p className="relative m-0 max-w-full text-4xl font-semibold leading-none tabular-nums tracking-tight text-balance text-foreground sm:whitespace-nowrap sm:text-5xl">
          <span>{formatCommodityQuote(snapshot.price, snapshot.unit, snapshot.quote)}</span>
          <span className="ms-3 inline-block align-middle">
            <ChangeBadge
              direction={snapshot.direction}
              changePct={snapshot.changePct}
              className="shrink-0"
            />
          </span>
        </p>
        <div className="relative flex items-center gap-1.5 text-sm text-muted-foreground">
          <Clock className="size-4 shrink-0 text-muted-foreground" aria-hidden />
          <span>Updated {formatUpdatedAt(updatedAt)}</span>
        </div>
      </CardHeader>
      <CardContent className="relative pb-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[240px] w-full">
          <LineChart data={series} margin={{ left: 0, right: 8, top: 12, bottom: 0 }}>
            <CartesianGrid
              vertical={false}
              strokeDasharray="4 4"
              className="stroke-border/50"
            />
            <XAxis
              dataKey="i"
              type="number"
              domain={[0, lastIndex]}
              ticks={[0, lastIndex]}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) =>
                v === 0 ? "6 Weeks Ago" : v === lastIndex ? "Today" : ""
              }
              className="text-xs text-muted-foreground"
            />
            <YAxis domain={[yMin, yMax]} hide />
            <ChartTooltip
              cursor={{ stroke: "var(--border)", strokeWidth: 1 }}
              content={<ChartTooltipContent />}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke="var(--color-price)"
              strokeWidth={2.75}
              strokeLinecap="round"
              dot={false}
              activeDot={{ r: 5, fill: "var(--color-price)", strokeWidth: 0 }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
