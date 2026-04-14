import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  COMMODITY_LABELS,
  COMMODITY_SYMBOLS,
  type CommoditySymbol,
} from "@/lib/commodity-types";

const tabs = COMMODITY_SYMBOLS.map((id) => ({
  id,
  label: COMMODITY_LABELS[id],
}));

type GasyncCommodityTabsProps = {
  value: CommoditySymbol;
  onValueChange: (value: CommoditySymbol) => void;
};

export function GasyncCommodityTabs({
  value,
  onValueChange,
}: GasyncCommodityTabsProps) {
  return (
    <Tabs
      value={value}
      onValueChange={(v) => onValueChange(v as CommoditySymbol)}
      className="w-full max-w-full"
    >
      <TabsList className="grid h-auto w-full max-w-full grid-cols-1 gap-1 rounded-2xl border border-border/70 bg-muted/70 p-1.5 shadow-inner backdrop-blur-sm sm:grid-cols-3">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.id}
            value={tab.id}
            className="h-auto min-h-11 w-full flex-none justify-center rounded-xl px-3 py-2.5 text-center text-sm font-medium leading-snug whitespace-normal text-muted-foreground transition-all data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-md data-[state=active]:ring-1 data-[state=active]:ring-border/80 sm:min-h-12 sm:px-4 sm:text-base dark:data-[state=active]:bg-card/90 dark:data-[state=active]:shadow-lg dark:data-[state=active]:ring-white/10"
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
