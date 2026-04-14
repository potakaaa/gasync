import { RefreshCw, Sparkles } from "lucide-react";

import { GasyncThemeSettings } from "@/components/gasync/gasync-theme-settings";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type GasyncHeaderProps = {
  onRefresh: () => void;
  loading?: boolean;
};

export function GasyncHeader({ onRefresh, loading }: GasyncHeaderProps) {
  return (
    <header className="flex flex-col gap-10">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-3">
          <span
            className="flex size-11 items-center justify-center rounded-2xl bg-linear-to-br from-primary to-primary/85 text-primary-foreground shadow-md ring-2 ring-tertiary/25 ring-offset-2 ring-offset-background dark:ring-tertiary/20"
            aria-hidden
          >
            <svg
              className="size-6 shrink-0"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M16 4L28 26H4L16 4Z"
                fill="currentColor"
                className="opacity-95"
              />
            </svg>
          </span>
          <div className="flex flex-col gap-0.5">
            <span className="text-lg font-semibold tracking-tight text-foreground">
              Gasync
            </span>
            <span className="inline-flex w-fit items-center gap-1 rounded-full border border-tertiary/25 bg-tertiary/10 px-2 py-0.5 text-[11px] font-medium tracking-wide text-accent-foreground uppercase dark:border-tertiary/35 dark:bg-tertiary/15 dark:text-emerald-200/90">
              <Sparkles className="size-3 text-tertiary" aria-hidden />
              Live quotes
            </span>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2 sm:pt-0.5">
          <GasyncThemeSettings />
          <Button
            type="button"
            size="default"
            disabled={loading}
            className="gap-2 rounded-xl bg-primary px-4 text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-md active:scale-[0.98] disabled:opacity-70"
            onClick={onRefresh}
          >
            <RefreshCw
              className={cn("size-4", loading && "animate-spin")}
              aria-hidden
            />
            Refresh Prices
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        <h1 className="gasync-hero-gradient max-w-[20ch] text-balance text-3xl font-semibold tracking-tight sm:max-w-none sm:text-4xl md:text-[2.65rem] md:leading-[1.12]">
          Real-time commodity prices, simplified.
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
          Live futures and spot quotes from global markets—clear numbers, calm
          layout, updates when you need them.
        </p>
      </div>
    </header>
  );
}
