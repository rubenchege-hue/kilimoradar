"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MARKET_SEASONS,
  getMarketSeasonStatus,
  type MarketSeason,
} from "@/lib/data";
import { cn } from "@/lib/utils";
import {
  Sun,
  Calendar,
  TrendingDown,
  TrendingUp,
  Minus,
  CheckCircle2,
  XCircle,
  ChevronRight,
  CloudRain,
  CloudSun,
  Ship,
  Sprout,
  ExternalLink,
  RefreshCw,
} from "lucide-react";

interface WeatherItem {
  id: string;
  title: string;
  url: string;
  snippet: string;
  source: string;
  date: string;
  market: string;
  kind: "weather" | "shipping" | "growing";
  relevance: "high" | "medium";
  tempNow: number;
  tempMax: number;
  tempMin: number;
  precipProb: number;
  weatherCode: number;
  condition: string;
  risk: "low" | "medium" | "high";
}

const WEATHER_KIND_LABELS: Record<WeatherItem["kind"], string> = {
  weather: "Market weather",
  shipping: "Shipping & supply",
  growing: "Kenya growing season",
};

const RISK_LABELS: Record<WeatherItem["risk"], string> = {
  low: "Low risk",
  medium: "Watch",
  high: "High risk",
};

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const STATUS_CONFIG = {
  good: {
    label: "High demand — ship now",
    badge: "bg-emerald-100 text-emerald-800 border-emerald-200",
    icon: CheckCircle2,
    color: "text-emerald-600",
    bg: "bg-emerald-50 border-emerald-200",
  },
  okay: {
    label: "Normal demand",
    badge: "bg-amber-100 text-amber-800 border-amber-200",
    icon: Minus,
    color: "text-amber-600",
    bg: "bg-amber-50 border-amber-200",
  },
  avoid: {
    label: "Local surplus — hold off",
    badge: "bg-red-100 text-red-800 border-red-200",
    icon: XCircle,
    color: "text-red-600",
    bg: "bg-red-50 border-red-200",
  },
};

export function WeatherView() {
  const now = new Date();
  const currentMonth = now.getMonth() + 1; // 1-12
  const currentYear = now.getFullYear();
  const [selectedMarket, setSelectedMarket] = useState<string | null>(null);

  const enriched = MARKET_SEASONS.map((m) =>
    getMarketSeasonStatus(m, currentMonth)
  );

  const favourable = enriched.filter((m) => m.status === "good");
  const unfavourable = enriched.filter((m) => m.status === "avoid");
  const neutral = enriched.filter((m) => m.status === "okay");

  const selected = selectedMarket
    ? enriched.find((m) => m.id === selectedMarket)
    : null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold sm:text-3xl">Weather &amp; Seasonal Intelligence</h1>
        <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground leading-relaxed">
          Know when your buyer&apos;s country is flooded with local produce — or
          hit by weather that disrupts your shipping — so you don&apos;t bet your
          harvest on the wrong window.
        </p>
      </div>

      <Tabs defaultValue="seasons" className="space-y-6">
        <TabsList className="h-auto flex-wrap">
          <TabsTrigger value="seasons" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Calendar className="mr-1.5 h-4 w-4" aria-hidden="true" />
            Market seasons
          </TabsTrigger>
          <TabsTrigger value="live" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <CloudSun className="mr-1.5 h-4 w-4" aria-hidden="true" />
            Live weather
          </TabsTrigger>
        </TabsList>

        {/* Season market view */}
        <TabsContent value="seasons" className="space-y-6">
          {/* Current month banner */}
          <div className="flex flex-wrap items-center gap-3 rounded-xl border border-primary/25 bg-secondary/60 p-4">
            <Calendar className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
            <div>
              <p className="text-sm font-semibold">
                {MONTH_NAMES[currentMonth - 1]} {currentYear} — Right now
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {unfavourable.length > 0 && (
                  <>
                    <span className="font-medium text-red-600">{unfavourable.length} markets</span> are in their local harvest season — expect lower demand.
                  </>
                )}
                {favourable.length > 0 && (
                  <>
                    {" "}<span className="font-medium text-emerald-600">{favourable.length} markets</span> need imports right now — best time to ship.
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Summary cards row */}
          <div className="grid gap-4 sm:grid-cols-3">
            <SummaryCard
              title="Ship now"
              count={favourable.length}
              icon={TrendingUp}
              color="text-emerald-600"
              bg="bg-emerald-50 border-emerald-200"
              markets={favourable}
              onClick={setSelectedMarket}
            />
            <SummaryCard
              title="Normal demand"
              count={neutral.length}
              icon={Minus}
              color="text-amber-600"
              bg="bg-amber-50 border-amber-200"
              markets={neutral}
              onClick={setSelectedMarket}
            />
            <SummaryCard
              title="Hold off"
              count={unfavourable.length}
              icon={TrendingDown}
              color="text-red-600"
              bg="bg-red-50 border-red-200"
              markets={unfavourable}
              onClick={setSelectedMarket}
            />
          </div>

          {/* Market detail or all markets */}
          <div className="grid gap-4 lg:grid-cols-[1fr_380px]">
            {/* Market cards */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold">All export markets</h2>
              {enriched
                .sort((a, b) => {
                  const order = { avoid: 0, okay: 1, good: 2 };
                  return order[a.status] - order[b.status];
                })
                .map((market) => (
                  <MarketCard
                    key={market.id}
                    market={market}
                    month={currentMonth}
                    isSelected={selectedMarket === market.id}
                    onSelect={setSelectedMarket}
                  />
                ))}
            </div>

            {/* Season calendar sidebar */}
            <aside aria-label="Seasonal calendar">
              <Card className="lg:sticky lg:top-[4.5rem]">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Sun className="h-4 w-4 text-primary" aria-hidden="true" />
                    12-month demand calendar
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selected ? (
                    <SeasonCalendar market={selected} currentMonth={currentMonth} />
                  ) : (
                    <div>
                      <p className="mb-4 text-xs text-muted-foreground leading-relaxed">
                        Click a market to see its full 12-month demand pattern. Red = local harvest
                        (avoid). Green = peak import demand (ship). Grey = normal.
                      </p>
                      {/* Quick view: top markets */}
                      <div className="space-y-3">
                        {enriched
                          .filter((m) => m.status === "avoid")
                          .map((m) => (
                            <div key={m.id} className="rounded-lg border border-red-200 bg-red-50 p-3">
                              <div className="flex items-center gap-2">
                                <span className="text-lg" aria-hidden="true">{m.flag}</span>
                                <div>
                                  <p className="text-xs font-semibold text-red-800">{m.name}</p>
                                  <p className="text-[11px] text-red-600 leading-relaxed">
                                    Local harvest: {m.peakLocalSupply.map((m) => MONTH_NAMES[m - 1]).join(", ")}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </aside>
          </div>
        </TabsContent>

        {/* Live weather tab */}
        <TabsContent value="live" className="space-y-6">
          <LiveWeatherFeed />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Live weather intelligence
// ─────────────────────────────────────────────────────────────

function LiveWeatherFeed() {
  const {
    data: weather,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["weather"],
    queryFn: async () => {
      const res = await fetch("/api/weather");
      if (!res.ok) throw new Error("Failed to load weather");
      return res.json() as Promise<{
        items: WeatherItem[];
        cached: boolean;
        generatedAt: string;
        error?: string;
      }>;
    },
    staleTime: 30 * 60 * 1000,
    retry: 1,
  });

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-3 p-8 text-center">
          <CloudRain className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
          <p className="text-sm text-muted-foreground">
            We couldn&apos;t fetch live weather right now.
          </p>
          <p className="text-xs text-muted-foreground">
            {error instanceof Error ? error.message : "Please try again shortly."}
          </p>
          <button
            onClick={() => refetch()}
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted"
          >
            <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" /> Try again
          </button>
        </CardContent>
      </Card>
    );
  }

  const items = weather?.items ?? [];

  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-3 p-8 text-center">
          <Sun className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
          <p className="text-sm text-muted-foreground">
            No live weather updates available right now. Check back later.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Group by kind: growing (Kenya) first, then market weather, then shipping
  const groups: { kind: WeatherItem["kind"]; label: string; icon: React.ElementType; items: WeatherItem[] }[] = (
    [
      { kind: "growing", label: "Kenya growing conditions", icon: Sprout },
      { kind: "weather", label: "Export-market weather", icon: CloudRain },
      { kind: "shipping", label: "Shipping & supply signal", icon: Ship },
    ] as { kind: WeatherItem["kind"]; label: string; icon: React.ElementType }[]
  ).map((g) => ({ ...g, items: items.filter((i) => i.kind === g.kind) }));

  return (
    <div className="space-y-6">
      {/* Summary strip */}
      <div className="rounded-xl border border-primary/25 bg-secondary/60 p-4 text-sm leading-relaxed">
        <p className="font-semibold">Why weather matters for your exports</p>
        <p className="mt-1 text-xs text-muted-foreground">
          A heatwave in Europe means local peppers and tomatoes flood the shelves —
          your exports compete harder. Floods or port storms delay your containers.
          Rain in Kenya can disrupt harvest and road transport to port. Watch the
          live signals below before you contract a shipment.
        </p>
      </div>

      {groups
        .filter((g) => g.items.length > 0)
        .map((group) => (
          <section key={group.kind} aria-label={group.label}>
            <h2 className="mb-3 flex items-center gap-2 text-base font-bold">
              <group.icon className="h-4 w-4 text-primary" aria-hidden="true" />
              {group.label}
            </h2>
            <div className="grid gap-3 md:grid-cols-2">
              {group.items.map((item) => (
                <WeatherCard key={item.id} item={item} />
              ))}
            </div>
          </section>
        ))}

      {weather?.generatedAt && (
        <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <RefreshCw className="h-3 w-3" aria-hidden="true" />
          Updated {new Date(weather.generatedAt).toLocaleString()} · refreshed every 30 min
        </p>
      )}
    </div>
  );
}

function WeatherCard({ item }: { item: WeatherItem }) {
  const KindIcon =
    item.kind === "growing" ? Sprout : item.kind === "shipping" ? Ship : CloudRain;

  const riskStyles: Record<WeatherItem["risk"], string> = {
    low: "bg-emerald-100 text-emerald-800 border-emerald-200",
    medium: "bg-amber-100 text-amber-800 border-amber-200",
    high: "bg-red-100 text-red-800 border-red-200",
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="mb-1.5 flex items-center gap-2">
          <Badge variant="secondary" className="gap-1 text-[10px]">
            <KindIcon className="h-3 w-3" aria-hidden="true" />
            {WEATHER_KIND_LABELS[item.kind]}
          </Badge>
          <Badge variant="outline" className={cn("text-[10px]", riskStyles[item.risk])}>
            {RISK_LABELS[item.risk]}
          </Badge>
          {item.market && (
            <span className="ml-auto text-[11px] font-medium text-muted-foreground">
              {item.market}
            </span>
          )}
        </div>

        {/* Weather readout */}
        <div className="mb-2 flex items-center gap-3 rounded-lg bg-muted/40 p-3">
          <span className="text-3xl font-bold tracking-tight">
            {item.tempNow}°
          </span>
          <div className="text-xs leading-snug">
            <p className="font-semibold">{item.condition}</p>
            <p className="text-muted-foreground">
              High {item.tempMax}° / Low {item.tempMin}° · Rain {item.precipProb}%
            </p>
          </div>
        </div>

        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group block"
        >
          <h3 className="text-sm font-semibold leading-snug group-hover:text-primary">
            {item.title}
          </h3>
          {item.snippet && (
            <p className="mt-1 line-clamp-3 text-xs text-muted-foreground leading-relaxed">
              {item.snippet}
            </p>
          )}
        </a>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-[11px] text-muted-foreground">{item.source}</span>
          {item.date && <span className="text-[11px] text-muted-foreground">· {item.date}</span>}
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto inline-flex items-center gap-1 text-[11px] font-medium text-primary hover:underline"
          >
            Read <ExternalLink className="h-3 w-3" aria-hidden="true" />
          </a>
        </div>
      </CardContent>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────

function SummaryCard({
  title,
  count,
  icon: Icon,
  color,
  bg,
  markets,
  onClick,
}: {
  title: string;
  count: number;
  icon: React.ElementType;
  color: string;
  bg: string;
  markets: MarketSeason[];
  onClick: (id: string) => void;
}) {
  return (
    <div className={cn("rounded-xl border p-4", bg)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className={cn("h-5 w-5", color)} aria-hidden="true" />
          <p className="text-sm font-semibold">{title}</p>
        </div>
        <span className={cn("text-2xl font-bold", color)}>{count}</span>
      </div>
      {markets.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {markets.map((m) => (
            <button
              key={m.id}
              onClick={() => onClick(m.id)}
              className="inline-flex items-center gap-1 rounded-full border border-border bg-background/80 px-2 py-0.5 text-[11px] font-medium text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
            >
              {m.flag} {m.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function MarketCard({
  market,
  month,
  isSelected,
  onSelect,
}: {
  market: MarketSeason & { status: "good" | "okay" | "avoid" };
  month: number;
  isSelected: boolean;
  onSelect: (id: string) => void;
}) {
  const config = STATUS_CONFIG[market.status];
  const StatusIcon = config.icon;
  const nextBestMonths = market.peakImportDemand.filter((m) => m > month);
  const wrapAround = market.peakImportDemand.filter((m) => m <= month);

  return (
    <button
      onClick={() => onSelect(market.id)}
      className={cn(
        "w-full rounded-xl border p-4 text-left transition-all hover:shadow-md",
        isSelected ? "ring-2 ring-primary shadow-md" : "border-border",
        config.bg
      )}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl" aria-hidden="true">{market.flag}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">{market.name}</h3>
            <Badge variant="secondary" className={cn("text-[11px]", config.badge)}>
              <StatusIcon className="mr-1 h-3 w-3" aria-hidden="true" />
              {config.label}
            </Badge>
          </div>
          <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
            {market.currentNote}
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {market.keyCrops.map((crop) => (
              <Badge key={crop} variant="outline" className="text-[11px]">
                {crop}
              </Badge>
            ))}
          </div>
          {market.status === "avoid" && (
            <p className="mt-2 text-xs text-red-600 font-medium">
              Best next window: {nextBestMonths.concat(wrapAround).slice(0, 3).map((m) => MONTH_NAMES[m - 1]).join(", ")}
            </p>
          )}
          {market.status === "good" && (
            <p className="mt-2 text-xs text-emerald-600 font-medium">
              This is a peak demand window — prioritise shipments to this market.
            </p>
          )}
        </div>
        <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
      </div>
    </button>
  );
}

function SeasonCalendar({
  market,
  currentMonth,
}: {
  market: MarketSeason;
  currentMonth: number;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl" aria-hidden="true">{market.flag}</span>
        <h3 className="text-sm font-bold">{market.name}</h3>
      </div>

      {/* Month grid */}
      <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-6">
        {MONTH_NAMES.map((name, i) => {
          const m = i + 1;
          const isCurrent = m === currentMonth;
          const isPeak = market.peakLocalSupply.includes(m);
          const isDemand = market.peakImportDemand.includes(m);

          return (
            <div
              key={name}
              className={cn(
                "rounded-lg border p-1.5 text-center text-[11px] font-medium",
                isCurrent && "ring-2 ring-primary",
                isPeak && "bg-red-100 text-red-800 border-red-200",
                isDemand && "bg-emerald-100 text-emerald-800 border-emerald-200",
                !isPeak && !isDemand && "bg-muted/50 text-muted-foreground border-border"
              )}
            >
              <p>{name}</p>
              {isPeak && <TrendingDown className="mx-auto mt-0.5 h-3 w-3" aria-hidden="true" />}
              {isDemand && <TrendingUp className="mx-auto mt-0.5 h-3 w-3" aria-hidden="true" />}
              {isCurrent && !isPeak && !isDemand && (
                <div className="mx-auto mt-0.5 h-1.5 w-1.5 rounded-full bg-primary" />
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-3 flex flex-wrap gap-3 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1">
          <span className="h-2.5 w-2.5 rounded bg-red-400" aria-hidden="true" /> Local harvest (avoid)
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2.5 w-2.5 rounded bg-emerald-400" aria-hidden="true" /> Peak import demand
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2.5 w-2.5 rounded bg-muted" aria-hidden="true" /> Normal
        </span>
      </div>

      {/* Crops bought */}
      <div className="mt-3 rounded-lg bg-muted/50 p-2.5">
        <p className="text-[11px] font-medium text-muted-foreground">Key crops from Kenya:</p>
        <p className="mt-0.5 text-xs font-medium">{market.keyCrops.join(", ")}</p>
      </div>

      {/* Current impact */}
      {market.currentNote && (
        <div className="mt-3 rounded-lg bg-secondary/50 p-2.5">
          <p className="text-xs text-muted-foreground leading-relaxed">{market.currentNote}</p>
        </div>
      )}
    </div>
  );
}
