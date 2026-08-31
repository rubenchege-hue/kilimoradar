"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkline } from "./sparkline";
import { COMMODITIES, DESTINATION_MARKETS } from "@/lib/data";
import {
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  Globe2,
  CalendarClock,
  Ship,
} from "lucide-react";

export function MarketsView() {
  const [selectedCrop, setSelectedCrop] = useState<string>("all");
  const crops = ["all", ...Array.from(new Set(COMMODITIES.map((c) => c.name)))];
  const shownCrops =
    selectedCrop === "all"
      ? COMMODITIES
      : COMMODITIES.filter((c) => c.name === selectedCrop);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold sm:text-3xl">Export Markets &amp; Prices</h1>
        <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground leading-relaxed">
          Where Kenya&apos;s produce goes, what it earns, and what each market
          requires from you. Prices are indicative farm-gate levels — confirm
          current rates with your buyer or cooperative before contracting.
        </p>
      </div>

      <Tabs defaultValue="commodities" className="space-y-6">
        <TabsList className="h-auto flex-wrap">
          <TabsTrigger value="commodities" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Kenya&apos;s export commodities
          </TabsTrigger>
          <TabsTrigger value="destinations" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Destination markets &amp; requirements
          </TabsTrigger>
        </TabsList>

        {/* Commodities tab */}
        <TabsContent value="commodities" className="space-y-4">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter commodities">
            {crops.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCrop(c)}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                  selectedCrop === c
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
                }`}
                aria-pressed={selectedCrop === c}
              >
                {c === "all" ? "All commodities" : c}
              </button>
            ))}
          </div>

          {shownCrops.map((c) => (
            <Card key={c.id}>
              <CardContent className="p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-start gap-3">
                    <span className="text-3xl" aria-hidden="true">{c.emoji}</span>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-bold">{c.name}</h3>
                        <Badge variant="secondary" className="text-[11px]">
                          #{c.rank} export · {c.exportValue}
                        </Badge>
                      </div>
                      <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground leading-relaxed">
                        {c.note}
                      </p>
                      <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                        <CalendarClock className="h-3.5 w-3.5" aria-hidden="true" />
                        Season: {c.season}
                      </p>
                    </div>
                  </div>
                  <div className="shrink-0 rounded-xl border border-border bg-muted/40 p-3 sm:min-w-[180px]">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                          Farm-gate price
                        </p>
                        <p className="mt-0.5 text-2xl font-bold">
                          KSh {c.price}
                          <span className="text-xs font-medium text-muted-foreground">
                            {" "}/ {c.unit.includes("stem") ? "stem" : "kg"}
                          </span>
                        </p>
                        <p
                          className={`mt-0.5 flex items-center gap-1 text-xs font-semibold ${
                            c.changePct >= 0 ? "text-emerald-600" : "text-red-600"
                          }`}
                        >
                          {c.changePct >= 0 ? (
                            <TrendingUp className="h-3.5 w-3.5" aria-hidden="true" />
                          ) : (
                            <TrendingDown className="h-3.5 w-3.5" aria-hidden="true" />
                          )}
                          {c.changePct >= 0 ? "+" : ""}
                          {c.changePct}% this year
                        </p>
                      </div>
                      <Sparkline data={c.trend} width={80} height={36} positive={c.changePct >= 0} />
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-1.5">
                  <Ship className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
                  <span className="text-xs text-muted-foreground">Main markets:</span>
                  {c.topMarkets.map((m) => (
                    <Badge key={m} variant="outline" className="text-[11px]">
                      {m}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Destinations tab */}
        <TabsContent value="destinations" className="space-y-4">
          <Card className="border-primary/25 bg-secondary/50">
            <CardContent className="p-4 text-sm leading-relaxed">
              <p className="flex items-start gap-2">
                <Globe2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                <span>
                  Kenya exported <strong>$8.2B</strong> of goods in 2024 — the top
                  five markets below take the majority. Each market has its own
                  rules, and the rules are exactly where geopolitics bites:
                  certifications, tariffs and border checks change when politics
                  changes.
                </span>
              </p>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            {DESTINATION_MARKETS.map((m) => (
              <Card key={m.id} className="flex flex-col">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between gap-2">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <span className="text-xl" aria-hidden="true">{m.flag}</span>
                      {m.name}
                    </CardTitle>
                    <div className="text-right">
                      <p className="text-sm font-bold">{m.value}</p>
                      <p className="text-[11px] text-muted-foreground">imports from Kenya/yr</p>
                    </div>
                  </div>
                  <CardDescription>
                    Buys: {m.keyImports.join(" · ")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="mt-auto space-y-3">
                  <div>
                    <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      What this market requires
                    </p>
                    <ul className="space-y-1.5">
                      {m.requirements.map((r, i) => (
                        <li key={i} className="flex gap-2 text-sm leading-relaxed">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                          {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-lg border border-border bg-muted/40 p-2.5">
                    <p className="flex items-start gap-2 text-xs leading-relaxed">
                      <span
                        className={`mt-0.5 inline-block h-2 w-2 shrink-0 rounded-full ${
                          m.riskLevel === "high"
                            ? "bg-red-500"
                            : m.riskLevel === "medium"
                              ? "bg-amber-500"
                              : "bg-emerald-500"
                        }`}
                        aria-hidden="true"
                      />
                      <span>
                        <strong className="capitalize">{m.riskLevel} geopolitical risk:</strong>{" "}
                        {m.riskNote}
                      </span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
