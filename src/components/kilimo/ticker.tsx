"use client";

import {
  COMMODITIES,
  MARKET_SEASONS,
  getMarketSeasonStatus,
} from "@/lib/data";
import { TrendingUp, TrendingDown, Sun } from "lucide-react";

export function PriceTicker() {
  const currentMonth = new Date().getMonth() + 1;
  const seasonal = MARKET_SEASONS.map((m) => getMarketSeasonStatus(m, currentMonth));
  const favourable = seasonal.filter((m) => m.status === "good");
  const unfavourable = seasonal.filter((m) => m.status === "avoid");

  const items = [...COMMODITIES, ...COMMODITIES]; // duplicate for seamless loop

  return (
    <div
      className="border-b border-border bg-card overflow-hidden"
      aria-label="Export commodity price ticker"
    >
      <div className="flex items-center">
        <span className="hidden sm:flex shrink-0 items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-primary bg-secondary border-r border-border h-full">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
          </span>
          Farm-gate prices
        </span>

        <div className="relative flex-1 overflow-hidden py-1.5">
          <div className="flex w-max animate-ticker gap-8 px-4">
            {items.map((c, i) => (
              <span key={`${c.id}-${i}`} className="flex items-center gap-2 text-xs whitespace-nowrap">
                <span aria-hidden="true">{c.emoji}</span>
                <span className="font-medium">{c.name}</span>
                <span className="text-muted-foreground">
                  KSh {c.price}/{c.unit.includes("stem") ? "stem" : "kg"}
                </span>
                <span
                  className={
                    c.changePct >= 0
                      ? "font-semibold text-emerald-600"
                      : "font-semibold text-red-600"
                  }
                >
                  {c.changePct >= 0 ? "▲" : "▼"} {Math.abs(c.changePct).toFixed(1)}%
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Seasonal strip */}
      {(favourable.length > 0 || unfavourable.length > 0) && (
        <div className="flex items-center gap-4 overflow-hidden px-4 py-1 border-t border-border bg-secondary/40 text-[11px]">
          <span className="flex shrink-0 items-center gap-1 font-semibold text-primary uppercase tracking-wide">
            <Sun className="h-3 w-3" aria-hidden="true" />
            This month
          </span>
          {favourable.length > 0 && (
            <span className="flex items-center gap-1.5 text-emerald-700 whitespace-nowrap">
              <TrendingUp className="h-3 w-3" aria-hidden="true" />
              Ship to: {favourable.map((m) => m.flag + " " + m.name).join(" · ")}
            </span>
          )}
          {unfavourable.length > 0 && (
            <span className="flex items-center gap-1.5 text-red-600 whitespace-nowrap">
              <TrendingDown className="h-3 w-3" aria-hidden="true" />
              Hold off: {unfavourable.map((m) => m.flag + " " + m.name).join(" · ")}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
