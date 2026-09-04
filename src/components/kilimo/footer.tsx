"use client";

import { Radar } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ViewId } from "./header";

export function Footer({ onNavigate }: { onNavigate: (v: ViewId) => void }) {
  return (
    <footer className="mt-auto border-t border-border bg-card">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <div className="flex items-center gap-2 font-bold">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Radar className="h-4 w-4" aria-hidden="true" />
              </span>
              Kilimo<span className="-ml-2">Radar</span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              World events, translated into shillings and actions for Kenyan
              farmers. Always free for farmers and buyers.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-3">Platform</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <button className="hover:text-foreground" onClick={() => onNavigate("radar")}>
                  Geopolitical Radar
                </button>
              </li>
              <li>
                <button className="hover:text-foreground" onClick={() => onNavigate("weather")}>
                  Seasonal Weather
                </button>
              </li>
              <li>
                <button className="hover:text-foreground" onClick={() => onNavigate("markets")}>
                  Export Markets &amp; Prices
                </button>
              </li>
              <li>
                <button className="hover:text-foreground" onClick={() => onNavigate("marketplace")}>
                  Marketplace
                </button>
              </li>
              <li>
                <button className="hover:text-foreground" onClick={() => onNavigate("advisor")}>
                  AI Advisor
                </button>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-3">Verified information</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>KEPHIS — phytosanitary requirements</li>
              <li>Horticultural Crops Directorate</li>
              <li>Central Bank of Kenya — FX rates</li>
              <li>Ministry of Agriculture &amp; Livestock Development</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-border pt-6">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Kilimo Radar. Market intelligence is
            indicative — confirm with your county agriculture office before
            making decisions.
          </p>
          <Button variant="outline" size="sm" onClick={() => onNavigate("join")}>
            Join the platform — Free
          </Button>
        </div>
      </div>
    </footer>
  );
}
