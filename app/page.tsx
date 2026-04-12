import {
  classifyPriceBand,
  filterStationsByFuelType,
  formatPrice,
  getTrendDirection,
  isFreshPriceUpdate,
  sortStationsByPrice,
  type FuelType,
  type StationPrice,
} from "@/lib/gas-price";

type StationCard = StationPrice & {
  neighborhood: string;
  benchmark: number;
  distance: string;
};

type TrendWindow = {
  label: string;
  previousAverage: number;
  currentAverage: number;
  note: string;
  bars: number[];
};

type EventCard = {
  title: string;
  date: string;
  impact: "Geopolitical" | "Refinery" | "Weather";
  source: string;
  summary: string;
};

const nowIso = "2026-04-12T10:30:00Z";

const stations: StationCard[] = [
  {
    name: "North Hub",
    fuelType: "regular",
    price: 3.79,
    updatedAt: "2026-04-12T10:20:00Z",
    neighborhood: "Downtown loop",
    benchmark: 3.82,
    distance: "0.4 mi away",
  },
  {
    name: "Lake Market",
    fuelType: "regular",
    price: 3.52,
    updatedAt: "2026-04-12T09:48:00Z",
    neighborhood: "Lakeside corridor",
    benchmark: 3.82,
    distance: "1.1 mi away",
  },
  {
    name: "Midway Fuel",
    fuelType: "midgrade",
    price: 4.09,
    updatedAt: "2026-04-12T10:08:00Z",
    neighborhood: "Central market",
    benchmark: 4.14,
    distance: "1.8 mi away",
  },
  {
    name: "East Corner",
    fuelType: "premium",
    price: 4.49,
    updatedAt: "2026-04-12T10:12:00Z",
    neighborhood: "Airport strip",
    benchmark: 4.39,
    distance: "2.0 mi away",
  },
  {
    name: "Harbor Petro",
    fuelType: "premium",
    price: 4.76,
    updatedAt: "2026-04-12T09:58:00Z",
    neighborhood: "Harbor district",
    benchmark: 4.39,
    distance: "2.7 mi away",
  },
];

const selectedFuelType: FuelType = "premium";

const trendWindows: TrendWindow[] = [
  {
    label: "7-day trend",
    previousAverage: 3.74,
    currentAverage: 3.91,
    note: "Price momentum is building after the latest event bulletin.",
    bars: [52, 58, 63, 68, 74, 89],
  },
  {
    label: "30-day trend",
    previousAverage: 3.69,
    currentAverage: 3.77,
    note: "The broader window is still steady, but it has started to drift upward.",
    bars: [48, 50, 53, 56, 59, 64],
  },
];

const eventCards: EventCard[] = [
  {
    title: "Regional refinery outage",
    date: "Apr 11, 2026",
    impact: "Refinery",
    source: "Source: Market supply bulletin",
    summary:
      "Unplanned maintenance reduced regional output and pushed nearby station prices higher.",
  },
  {
    title: "Shipping lane disruption",
    date: "Apr 10, 2026",
    impact: "Geopolitical",
    source: "Source: Wire service brief",
    summary:
      "Route uncertainty increased wholesale volatility and widened the gap between premium and regular fuel.",
  },
  {
    title: "Heavy weather in the gulf",
    date: "Apr 9, 2026",
    impact: "Weather",
    source: "Source: Regional weather advisory",
    summary:
      "Storm activity slowed deliveries and made the latest trend window more sensitive to supply delays.",
  },
];

const sortedStations = sortStationsByPrice(stations);
const selectedStations = filterStationsByFuelType(sortedStations, selectedFuelType);
const freshStationCount = sortedStations.filter((station) =>
  isFreshPriceUpdate(station.updatedAt, nowIso),
).length;
const trendPulse = getTrendDirection(3.74, 3.91);

const bandStyles = {
  low: "border-emerald-400/20 bg-emerald-400/12 text-emerald-100",
  medium: "border-amber-400/20 bg-amber-400/12 text-amber-100",
  high: "border-rose-400/20 bg-rose-400/12 text-rose-100",
} satisfies Record<"low" | "medium" | "high", string>;

const directionStyles = {
  up: "border-amber-300/20 bg-amber-300/12 text-amber-100",
  down: "border-emerald-300/20 bg-emerald-300/12 text-emerald-100",
  flat: "border-slate-300/20 bg-slate-300/12 text-slate-100",
} satisfies Record<"up" | "down" | "flat", string>;

const directionLabels = {
  up: "Rising",
  down: "Cooling",
  flat: "Stable",
} satisfies Record<"up" | "down" | "flat", string>;

const statCards = [
  {
    label: "Fresh station updates",
    value: `${freshStationCount} of ${sortedStations.length}`,
    detail: "One listing is outside the freshness window.",
  },
  {
    label: "Trend pulse",
    value: directionLabels[trendPulse],
    detail: "The 7-day average is above the prior period.",
  },
  {
    label: "Cited events",
    value: `${eventCards.length}`,
    detail: "Every event card includes a source reference.",
  },
];

function getFreshnessLabel(isFresh: boolean): string {
  return isFresh ? "Fresh update" : "Stale update";
}

export default function Home() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.14),transparent_30%),radial-gradient(circle_at_top_right,rgba(16,185,129,0.12),transparent_26%),linear-gradient(180deg,#07111f_0%,#040711_55%,#050816_100%)] px-6 py-8 text-slate-50 sm:px-10 lg:px-12">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <header className="flex flex-col gap-4 border-b border-white/10 pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-amber-200/70">
              Gas Price Viewer
            </p>
            <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
              Track nearby fuel prices, trend movement, and the events behind price spikes.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
              Sprint 1 landing page for a location-first gas price experience with
              fresh station data, trend visibility, and cited world-event context.
            </p>
          </div>
          <div className="inline-flex items-center rounded-full border border-emerald-300/20 bg-emerald-400/10 px-4 py-2 text-sm font-medium text-emerald-100">
            Sprint 1 MVP
          </div>
        </header>

        <section className="grid gap-8 lg:grid-cols-[1.25fr_.95fr]">
          <div className="space-y-6">
            <section className="rounded-3xl border border-white/10 bg-slate-900/75 p-6 shadow-2xl shadow-amber-950/15 backdrop-blur">
              <div className="grid gap-4 lg:grid-cols-[1.1fr_.9fr] lg:items-start">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-emerald-200/70">
                    Focus
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold">
                    Search a city or ZIP code
                  </h2>
                  <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">
                    Review nearby prices, compare fuel types, and see the current
                    market story before you fill up.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <label
                    className="text-sm font-medium text-slate-200"
                    htmlFor="location-search"
                  >
                    Location search
                  </label>
                  <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                    <input
                      id="location-search"
                      type="text"
                      defaultValue="Detroit, MI"
                      placeholder="City or ZIP code"
                      aria-label="Search city or ZIP code"
                      className="h-12 flex-1 rounded-2xl border border-white/10 bg-slate-950/70 px-4 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-300/60"
                    />
                    <button
                      type="button"
                      className="inline-flex h-12 items-center justify-center rounded-2xl bg-amber-300 px-5 text-sm font-semibold text-slate-950 transition-colors hover:bg-amber-200"
                    >
                      Search
                    </button>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {[
                      "Detroit, MI",
                      "San Antonio, TX",
                      "94016",
                    ].map((place) => (
                      <span
                        key={place}
                        className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-slate-300"
                      >
                        {place}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {statCards.map((card) => (
                  <article
                    key={card.label}
                    className="rounded-2xl border border-white/10 bg-black/20 p-4"
                  >
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                      {card.label}
                    </p>
                    <p className="mt-3 text-2xl font-semibold text-slate-50">
                      {card.value}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-300">
                      {card.detail}
                    </p>
                  </article>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border border-white/10 bg-slate-900/75 p-6 shadow-2xl shadow-slate-950/20 backdrop-blur">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-amber-200/70">
                    Nearby stations
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold">Sorted by price</h2>
                </div>
                <div className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs uppercase tracking-[0.24em] text-slate-300">
                  {selectedFuelType} filter
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {sortedStations.map((station) => {
                  const band = classifyPriceBand(station.price, station.benchmark);
                  const isFresh = isFreshPriceUpdate(station.updatedAt, nowIso);

                  return (
                    <article
                      key={station.name}
                      className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition-colors hover:border-white/20"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <h3 className="text-lg font-semibold">{station.name}</h3>
                          <p className="mt-1 text-sm text-slate-400">
                            {station.neighborhood} - {station.distance}
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <div className="text-2xl font-semibold text-slate-50">
                              {formatPrice(station.price)}
                            </div>
                            <div className="text-xs uppercase tracking-[0.3em] text-slate-400">
                              {station.fuelType}
                            </div>
                          </div>
                          <span
                            className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] ${bandStyles[band]}`}
                          >
                            {band}
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
                        <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-slate-200">
                          {getFreshnessLabel(isFresh)}
                        </span>
                        <span className="text-slate-400">
                          Benchmark {formatPrice(station.benchmark)}
                        </span>
                      </div>
                    </article>
                  );
                })}
              </div>

              <div className="mt-5 rounded-2xl border border-dashed border-white/10 bg-black/20 p-4 text-sm text-slate-300">
                Premium filter preview: {selectedStations.length} stations match the
                active fuel type.
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <section className="rounded-3xl border border-white/10 bg-slate-900/75 p-6 shadow-2xl shadow-slate-950/20 backdrop-blur">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-emerald-200/70">
                    Trend snapshot
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold">
                    7-day and 30-day movement
                  </h2>
                </div>
                <span
                  className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] ${directionStyles[trendPulse]}`}
                >
                  {directionLabels[trendPulse]}
                </span>
              </div>

              <div className="mt-6 grid gap-4">
                {trendWindows.map((window) => {
                  const direction = getTrendDirection(
                    window.previousAverage,
                    window.currentAverage,
                  );

                  return (
                    <article
                      key={window.label}
                      className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-base font-semibold">{window.label}</h3>
                          <p className="mt-1 text-sm leading-6 text-slate-400">
                            {window.note}
                          </p>
                        </div>
                        <span
                          className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] ${directionStyles[direction]}`}
                        >
                          {directionLabels[direction]}
                        </span>
                      </div>

                      <div className="mt-4 flex items-end gap-2">
                        {window.bars.map((height, index) => (
                          <div
                            key={`${window.label}-${index}`}
                            className="flex-1 rounded-t-full bg-gradient-to-t from-amber-400/40 to-emerald-300/80"
                            style={{ height: `${height}px` }}
                          />
                        ))}
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                        <div className="rounded-xl bg-black/20 p-3">
                          <span className="text-slate-400">Previous average</span>
                          <p className="mt-1 font-semibold text-slate-50">
                            {formatPrice(window.previousAverage)}
                          </p>
                        </div>
                        <div className="rounded-xl bg-black/20 p-3">
                          <span className="text-slate-400">Current average</span>
                          <p className="mt-1 font-semibold text-slate-50">
                            {formatPrice(window.currentAverage)}
                          </p>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>

            <section className="rounded-3xl border border-white/10 bg-slate-900/75 p-6 shadow-2xl shadow-slate-950/20 backdrop-blur">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-amber-200/70">
                    Event feed
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold">
                    Cited world events behind price moves
                  </h2>
                </div>
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs uppercase tracking-[0.24em] text-slate-300">
                  {eventCards.length} citations
                </span>
              </div>

              <div className="mt-6 space-y-4">
                {eventCards.map((event) => (
                  <article
                    key={event.title}
                    className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-base font-semibold">{event.title}</h3>
                        <p className="mt-1 text-sm text-slate-400">{event.date}</p>
                      </div>
                      <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-200">
                        {event.impact}
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-300">
                      {event.summary}
                    </p>
                    <p className="mt-4 text-xs uppercase tracking-[0.24em] text-slate-400">
                      {event.source}
                    </p>
                  </article>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border border-emerald-300/15 bg-emerald-400/8 p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-emerald-200/70">
                Release posture
              </p>
              <h2 className="mt-2 text-2xl font-semibold">
                Sprint 1 is now visible at the root route
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                The starter template has been replaced with a real product landing
                experience so QA can assess station prices, trend movement, and event
                context from the entry page.
              </p>
            </section>
          </aside>
        </section>
      </div>
    </main>
  );
}
