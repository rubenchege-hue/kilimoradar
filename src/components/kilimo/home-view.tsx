"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkline } from "./sparkline";
import {
  COMMODITIES,
  KENYA_STATS,
  RISK_ALERTS,
  SEVERITY_STYLES,
} from "@/lib/data";
import type { ViewId } from "./header";
import {
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Globe2,
  Bell,
  Users,
  ShieldCheck,
  MessageSquareText,
  Store,
  Radar,
} from "lucide-react";

export function HomeView({ onNavigate }: { onNavigate: (v: ViewId) => void }) {
  const topAlerts = [...RISK_ALERTS]
    .sort((a, b) => severityOrder(b.severity) - severityOrder(a.severity))
    .slice(0, 3);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div
          className="absolute inset-0 bg-gradient-to-br from-secondary via-background to-background"
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-6xl px-4 py-12 sm:py-16 lg:py-20">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div>
              <Badge variant="secondary" className="mb-4 gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                </span>
                Live geopolitical monitoring for your farm
              </Badge>
              <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl leading-tight">
                World events move your prices.
                <span className="block text-primary">We help you move first.</span>
              </h1>
              <p className="mt-4 max-w-xl text-base text-muted-foreground leading-relaxed">
                A war in the Gulf raises your fertilizer. A shipping crisis
                delays your buyer&apos;s payment. New China rules open duty-free
                markets. Kilimo Radar translates what&apos;s happening in the
                world into plain advice for your farm — and connects you
                directly with buyers. <strong>Free, forever, for farmers and buyers.</strong>
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button size="lg" onClick={() => onNavigate("join")}>
                  <Users className="h-4 w-4 mr-2" aria-hidden="true" />
                  Join as a farmer — Free
                </Button>
                <Button size="lg" variant="outline" onClick={() => onNavigate("radar")}>
                  <Radar className="h-4 w-4 mr-2" aria-hidden="true" />
                  See today&apos;s alerts
                </Button>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                No fees. No commissions. No middlemen. Built for Kenyan
                smallholders and the buyers who source from them.
              </p>
            </div>

            {/* Alert snapshot card */}
            <Card className="relative">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Bell className="h-4 w-4 text-primary" aria-hidden="true" />
                  Right now, affecting Kenyan exports
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {topAlerts.map((alert) => {
                  const style = SEVERITY_STYLES[alert.severity];
                  return (
                    <button
                      key={alert.id}
                      onClick={() => onNavigate("radar")}
                      className="w-full rounded-lg border border-border p-3 text-left transition-colors hover:bg-muted/60 focus-visible:outline-2 focus-visible:outline-ring"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                          <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} aria-hidden="true" />
                          {style.label}
                        </span>
                        <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
                      </div>
                      <p className="mt-1 text-sm font-medium leading-snug">{alert.title}</p>
                    </button>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Kenya export stats strip */}
      <section className="border-b border-border bg-card" aria-label="Kenya export profile">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <StatBlock icon={Globe2} label="Total exports" value={KENYA_STATS.totalExports} sub="goods per year" />
            <StatBlock icon={Radar} label="Top export" value="Tea" sub={KENYA_STATS.topExport} />
            <StatBlock icon={TrendingUp} label="Flower power" value="#1" sub={KENYA_STATS.flowersRank} />
            <StatBlock icon={Users} label="Farmers" value="70%+" sub={KENYA_STATS.smallholders} />
          </div>
        </div>
      </section>

      {/* Commodities preview */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold sm:text-2xl">What Kenya exports — and today&apos;s prices</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Farm-gate indicative prices. Click a commodity for market requirements.
            </p>
          </div>
          <Button variant="ghost" size="sm" className="hidden sm:inline-flex" onClick={() => onNavigate("markets")}>
            All markets <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {COMMODITIES.slice(0, 6).map((c) => (
            <Card key={c.id} className="transition-shadow hover:shadow-md">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl" aria-hidden="true">{c.emoji}</span>
                    <div>
                      <p className="font-semibold">{c.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Export value: <span className="font-medium text-foreground">{c.exportValue}</span>
                      </p>
                    </div>
                  </div>
                  <Sparkline data={c.trend} positive={c.changePct >= 0} />
                </div>
                <div className="mt-3 flex items-baseline justify-between">
                  <p className="text-2xl font-bold">
                    <span className="text-sm font-medium text-muted-foreground">KSh </span>
                    {c.price}
                    <span className="text-xs font-medium text-muted-foreground"> / {c.unit.includes("stem") ? "stem" : "kg"}</span>
                  </p>
                  <span
                    className={`flex items-center gap-1 text-xs font-semibold ${
                      c.changePct >= 0 ? "text-emerald-600" : "text-red-600"
                    }`}
                  >
                    {c.changePct >= 0 ? (
                      <TrendingUp className="h-3.5 w-3.5" aria-hidden="true" />
                    ) : (
                      <TrendingDown className="h-3.5 w-3.5" aria-hidden="true" />
                    )}
                    {c.changePct >= 0 ? "+" : ""}
                    {c.changePct}%
                  </span>
                </div>
                <p className="mt-2 line-clamp-2 text-xs text-muted-foreground leading-relaxed">{c.note}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-border bg-card" aria-label="How the platform works">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <h2 className="text-xl font-bold sm:text-2xl">How Kilimo Radar works</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <FeatureCard
              icon={Radar}
              title="1. Watch the world for you"
              description="We monitor shipping routes, fertilizer supply, regulations and trade deals — anything that changes what your harvest earns. Every alert explains what it means for your farm, in plain language, with specific actions."
            />
            <FeatureCard
              icon={Store}
              title="2. Connect directly with buyers"
              description="List your produce where verified buyers from Europe, China, the Gulf and across Africa are looking. No broker commissions eating your margin. Buyers join free and post what they need."
            />
            <FeatureCard
              icon={ShieldCheck}
              title="3. Get ready for big markets"
              description="Export requirements explained step by step — GlobalG.A.P., EUDR GPS mapping, China protocols, pesticide limits. Know exactly what a market needs before you plant."
            />
          </div>
          <div className="mt-8 rounded-xl border border-primary/25 bg-secondary/60 p-5 sm:p-6">
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <MessageSquareText className="mt-0.5 h-6 w-6 shrink-0 text-primary" aria-hidden="true" />
                <div>
                  <h3 className="font-semibold">Confused by the news? Ask the AI Advisor.</h3>
                  <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                    &ldquo;How does the Red Sea crisis affect my avocado price?&rdquo; — ask anything and get
                    a practical answer in farmer&apos;s language.
                  </p>
                </div>
              </div>
              <Button onClick={() => onNavigate("advisor")} className="shrink-0">
                Ask the Advisor <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function severityOrder(s: string): number {
  return s === "high" ? 3 : s === "medium" ? 2 : s === "low" ? 1 : 2.5;
}

function StatBlock({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-background p-3.5">
      <div className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        <Icon className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
        {label}
      </div>
      <p className="mt-1 text-xl font-bold sm:text-2xl">{value}</p>
      <p className="mt-0.5 text-[11px] text-muted-foreground leading-snug">{sub}</p>
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-background p-5">
      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-primary">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <h3 className="mt-3 font-semibold">{title}</h3>
      <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}
