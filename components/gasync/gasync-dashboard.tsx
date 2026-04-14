"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { GasyncCommodityTabs } from "@/components/gasync/gasync-commodity-tabs";
import { GasyncHeader } from "@/components/gasync/gasync-header";
import { GasyncMarketPulse } from "@/components/gasync/gasync-market-pulse";
import { GasyncOtherCommodities } from "@/components/gasync/gasync-other-commodities";
import { GasyncPriceChartCard } from "@/components/gasync/gasync-price-chart-card";
import {
  buildMarketPulseSummary,
  buildSnapshot,
  getChartSeries,
  getOtherCommoditySnapshots,
} from "@/lib/commodity-format";
import type { CommodityRatesPayload, CommoditySymbol } from "@/lib/commodity-types";

export function GasyncDashboard() {
  const [symbol, setSymbol] = useState<CommoditySymbol>("NG-FUT");
  const [data, setData] = useState<CommodityRatesPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/commodity/latest");
      const body: unknown = await res.json();

      if (!res.ok) {
        const err = body as { error?: string };
        setError(
          typeof err.error === "string"
            ? err.error
            : "Failed to load commodity rates.",
        );
        return;
      }

      const next = body as CommodityRatesPayload;
      setData(next);
    } catch {
      setError("Could not reach the server.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const snapshot = useMemo(() => {
    if (!data) {
      return null;
    }
    return buildSnapshot(symbol, data, data.previousCloses);
  }, [data, symbol]);

  const series = useMemo(() => {
    if (!snapshot) {
      return [];
    }
    return getChartSeries(snapshot.price);
  }, [snapshot]);

  const otherItems = useMemo(() => {
    if (!data) {
      return [];
    }
    return getOtherCommoditySnapshots(symbol, data, data.previousCloses);
  }, [data, symbol]);

  const marketSummary = useMemo(
    () =>
      data
        ? buildMarketPulseSummary(symbol, data, data.previousCloses)
        : null,
    [data, symbol],
  );

  const updatedAt = useMemo(
    () =>
      data ? new Date(data.timestamp * 1000) : new Date(),
    [data],
  );

  return (
    <div className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
      <GasyncHeader onRefresh={() => void load()} loading={loading} />

      {error ? (
        <div
          className="mt-8 flex items-start gap-3 rounded-xl border border-destructive/25 bg-destructive/5 px-4 py-3.5 text-sm text-destructive shadow-sm ring-1 ring-destructive/10"
          role="alert"
        >
          <span
            className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-destructive/15 text-xs font-bold"
            aria-hidden
          >
            !
          </span>
          <span className="leading-relaxed">{error}</span>
        </div>
      ) : null}

      {!data && loading ? (
        <div className="mt-12 space-y-8" aria-busy="true" aria-label="Loading">
          <div className="gasync-shimmer h-12 max-w-md rounded-xl bg-muted/80" />
          <div className="grid gap-8 lg:grid-cols-[1fr_minmax(0,320px)]">
            <div className="space-y-4 rounded-2xl border border-border/60 bg-card/60 p-6 shadow-sm ring-1 ring-foreground/5 backdrop-blur-sm">
              <div className="gasync-shimmer h-6 w-48 rounded-md bg-muted/90" />
              <div className="gasync-shimmer h-14 max-w-xs rounded-lg bg-muted/90" />
              <div className="gasync-shimmer mt-4 h-[220px] w-full rounded-lg bg-muted/70" />
            </div>
            <div className="flex flex-col gap-8">
              <div className="space-y-3 rounded-2xl border border-border/60 bg-card/60 p-5 shadow-sm ring-1 ring-foreground/5 backdrop-blur-sm">
                <div className="gasync-shimmer h-5 w-36 rounded-md bg-muted/90" />
                <div className="gasync-shimmer h-20 w-full rounded-md bg-muted/70" />
              </div>
              <div className="space-y-2">
                <div className="gasync-shimmer h-5 w-40 rounded-md bg-muted/80" />
                <div className="gasync-shimmer h-14 w-full rounded-xl bg-muted/70" />
                <div className="gasync-shimmer h-14 w-full rounded-xl bg-muted/70" />
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {data && snapshot ? (
        <>
          <div className="mt-8">
            <GasyncCommodityTabs value={symbol} onValueChange={setSymbol} />
          </div>

          <div
            className={
              loading
                ? "mt-8 opacity-70 transition-opacity duration-300"
                : "mt-8"
            }
          >
            <div className="grid gap-8 lg:grid-cols-[1fr_minmax(0,320px)]">
              <GasyncPriceChartCard
                snapshot={snapshot}
                series={series}
                updatedAt={updatedAt}
              />
              <div className="flex flex-col gap-8">
                <GasyncMarketPulse summary={marketSummary} />
                <GasyncOtherCommodities items={otherItems} />
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
