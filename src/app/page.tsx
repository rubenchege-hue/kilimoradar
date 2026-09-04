"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Header, type ViewId } from "@/components/kilimo/header";
import { PriceTicker } from "@/components/kilimo/ticker";
import { Footer } from "@/components/kilimo/footer";
import { HomeView } from "@/components/kilimo/home-view";
import { RadarView } from "@/components/kilimo/radar-view";
import { MarketsView } from "@/components/kilimo/markets-view";
import { MarketplaceView } from "@/components/kilimo/marketplace-view";
import { JoinView } from "@/components/kilimo/join-view";
import { AdvisorView } from "@/components/kilimo/advisor-view";
import { WeatherView } from "@/components/kilimo/weather-view";

function KilimoRadarApp() {
  const [activeView, setActiveView] = useState<ViewId>("home");

  const navigate = (view: ViewId) => {
    setActiveView(view);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header activeView={activeView} onNavigate={navigate} />
      <PriceTicker />
      <main className="flex-1">
        {activeView === "home" && <HomeView onNavigate={navigate} />}
        {activeView === "radar" && <RadarView />}
        {activeView === "weather" && <WeatherView />}
        {activeView === "markets" && <MarketsView />}
        {activeView === "marketplace" && <MarketplaceView />}
        {activeView === "join" && <JoinView />}
        {activeView === "advisor" && <AdvisorView />}
      </main>
      <Footer onNavigate={navigate} />
    </div>
  );
}

export default function Home() {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <KilimoRadarApp />
    </QueryClientProvider>
  );
}
