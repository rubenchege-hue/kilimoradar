"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { RISK_ALERTS, SEVERITY_STYLES, CATEGORY_LABELS } from "@/lib/data";
import { severityOrder } from "@/lib/utils";
import type { AlertCategory, RiskAlert } from "@/lib/data";
import {
  ChevronDown,
  ExternalLink,
  Newspaper,
  Lightbulb,
  AlertTriangle,
  Ship,
  FlaskConical,
  Scale,
  Landmark,
  Sparkles,
  Filter,
} from "lucide-react";

const CATEGORY_ICONS: Record<AlertCategory, React.ElementType> = {
  shipping: Ship,
  inputs: FlaskConical,
  regulation: Scale,
  market: Landmark,
  currency: Landmark,
  opportunity: Sparkles,
};

export function RadarView() {
  const [filter, setFilter] = useState<"all" | AlertCategory>("all");
  const [severityFilter, setSeverityFilter] = useState<"all" | "high" | "medium" | "opportunity">("all");

  const { data: news, isLoading: newsLoading } = useQuery({
    queryKey: ["news"],
    queryFn: async () => {
      const res = await fetch("/api/news");
      if (!res.ok) throw new Error("Failed to load news");
      return res.json() as Promise<{
        items: { id: string; title: string; url: string; snippet: string; source: string; date: string; relevance: string }[];
      }>;
    },
    staleTime: 30 * 60 * 1000,
    retry: 1,
  });

  const alerts = RISK_ALERTS.filter((a) => {
    if (filter !== "all" && a.category !== filter) return false;
    if (severityFilter !== "all" && a.severity !== severityFilter) return false;
    return true;
  }).sort((a, b) => severityOrder(b.severity) - severityOrder(a.severity));

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold sm:text-3xl">Geopolitical Radar</h1>
        <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground leading-relaxed">
          What&apos;s happening in the world right now that changes what your
          harvest earns — with plain-language impact and specific actions for
          your farm. High-impact items first.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap items-center gap-2" role="group" aria-label="Filter alerts">
        <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
          <Filter className="h-3.5 w-3.5" aria-hidden="true" /> Topic:
        </span>
        {(["all", "shipping", "inputs", "regulation", "market", "currency", "opportunity"] as const).map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
              filter === c
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
            }`}
            aria-pressed={filter === c}
          >
            {c === "all" ? "All topics" : CATEGORY_LABELS[c]}
          </button>
        ))}
        <span className="flex items-center gap-1 ml-2 text-xs font-medium text-muted-foreground">
          Impact:
        </span>
        {(["all", "high", "medium", "opportunity"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setSeverityFilter(s)}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
              severityFilter === s
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
            }`}
            aria-pressed={severityFilter === s}
          >
            {s === "all" ? "Any" : s === "high" ? "High" : s === "medium" ? "Medium" : "Opportunities"}
          </button>
        ))}
      </div>

      {/* Alerts list */}
      <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          {alerts.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center text-sm text-muted-foreground">
                No alerts match this filter right now — try another topic.
              </CardContent>
            </Card>
          )}
          {alerts.map((alert) => (
            <AlertCard key={alert.id} alert={alert} />
          ))}
        </div>

        {/* Live news sidebar */}
        <aside aria-label="Latest export news">
          <Card className="lg:sticky lg:top-[4.5rem]">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Newspaper className="h-4 w-4 text-primary" aria-hidden="true" />
                Live export news
              </CardTitle>
              <CardDescription className="text-xs">
                Auto-searched from the web for Kenyan farm exports
              </CardDescription>
            </CardHeader>
            <CardContent className="max-h-[32rem] overflow-y-auto custom-scroll">
              {newsLoading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="space-y-1.5">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-3 w-2/3" />
                    </div>
                  ))}
                </div>
              ) : news && news.items && news.items.length > 0 ? (
                <ul className="space-y-4">
                  {news.items.map((item) => (
                    <li key={item.id} className="border-b border-border pb-3 last:border-0 last:pb-0">
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group text-sm font-medium leading-snug hover:text-primary"
                      >
                        {item.title}
                        <ExternalLink
                          className="ml-1 inline h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100"
                          aria-hidden="true"
                        />
                      </a>
                      <p className="mt-1 line-clamp-2 text-xs text-muted-foreground leading-relaxed">
                        {item.snippet}
                      </p>
                      <p className="mt-1 text-[11px] text-muted-foreground">
                        {item.source}
                        {item.date ? ` · ${item.date}` : ""}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Live news is unavailable right now. Please check back shortly.
                </p>
              )}
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}

function AlertCard({ alert }: { alert: RiskAlert }) {
  const style = SEVERITY_STYLES[alert.severity];
  const Icon = CATEGORY_ICONS[alert.category];

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold ${style.badge}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} aria-hidden="true" />
            {style.label}
          </span>
          <Badge variant="outline" className="gap-1 text-[11px] font-medium">
            <Icon className="h-3 w-3" aria-hidden="true" />
            {CATEGORY_LABELS[alert.category]}
          </Badge>
          <span className="ml-auto text-[11px] text-muted-foreground">
            {new Date(alert.publishedAt).toLocaleDateString("en-KE", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>
        <CardTitle className="mt-1.5 text-lg leading-snug">{alert.title}</CardTitle>
        <CardDescription className="mt-1.5 leading-relaxed">{alert.summary}</CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible>
          <AccordionItem value="impact" className="border-0">
            <AccordionTrigger className="py-2 text-sm font-semibold text-primary hover:no-underline">
              <span className="flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4" aria-hidden="true" />
                What this means for your farm
              </span>
              <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" aria-hidden="true" />
            </AccordionTrigger>
            <AccordionContent className="text-sm leading-relaxed">
              {alert.farmerImpact}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="actions" className="border-0">
            <AccordionTrigger className="py-2 text-sm font-semibold text-primary hover:no-underline">
              <span className="flex items-center gap-1.5">
                <Lightbulb className="h-4 w-4" aria-hidden="true" />
                What you can do now
              </span>
              <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" aria-hidden="true" />
            </AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-2">
                {alert.actionAdvice.map((advice, i) => (
                  <li key={i} className="flex gap-2 text-sm leading-relaxed">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-secondary text-[11px] font-bold text-primary">
                      {i + 1}
                    </span>
                    {advice}
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="mt-2 flex flex-wrap gap-1.5">
          {alert.affectedCrops.map((crop) => (
            <Badge key={crop} variant="secondary" className="text-[11px]">
              {crop}
            </Badge>
          ))}
          <span className="ml-1 text-[11px] text-muted-foreground self-center">
            · {alert.affectedMarkets.join(", ")}
          </span>
        </div>
        <p className="mt-3 text-[11px] text-muted-foreground">Source: {alert.source}</p>
      </CardContent>
    </Card>
  );
}
