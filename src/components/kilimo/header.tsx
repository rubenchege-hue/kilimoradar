"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";
import {
  Radar,
  Home,
  TrendingUp,
  Store,
  UserPlus,
  MessageSquareText,
  Menu,
  Sprout,
  CloudSun,
} from "lucide-react";

export type ViewId = "home" | "radar" | "markets" | "marketplace" | "weather" | "join" | "advisor";

const NAV_ITEMS: { id: ViewId; label: string; icon: React.ElementType }[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "radar", label: "Geo Radar", icon: Radar },
  { id: "weather", label: "Seasons", icon: CloudSun },
  { id: "markets", label: "Markets", icon: TrendingUp },
  { id: "marketplace", label: "Marketplace", icon: Store },
  { id: "advisor", label: "AI Advisor", icon: MessageSquareText },
];

export function Header({
  activeView,
  onNavigate,
}: {
  activeView: ViewId;
  onNavigate: (view: ViewId) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  const go = (view: ViewId) => {
    onNavigate(view);
    setMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4">
        {/* Logo */}
        <button
          onClick={() => go("home")}
          className="flex items-center gap-2 font-bold text-lg shrink-0"
          aria-label="Kilimo Radar home"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Radar className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="hidden xs:block sm:block">
            Kilimo<span className="text-primary">Radar</span>
          </span>
        </button>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1 mx-auto" aria-label="Main navigation">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => go(item.id)}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                activeView === item.id
                  ? "bg-secondary text-secondary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
              aria-current={activeView === item.id ? "page" : undefined}
            >
              <item.icon className="h-4 w-4" aria-hidden="true" />
              {item.label}
            </button>
          ))}
        </nav>

        {/* Join CTA (desktop) */}
        <div className="ml-auto md:ml-0 flex items-center gap-2">
          <ThemeToggle />
          <Button
            onClick={() => go("join")}
            size="sm"
            className="hidden md:inline-flex"
            aria-label="Join free"
          >
            <UserPlus className="h-4 w-4 mr-1" aria-hidden="true" />
            Join Free
          </Button>
          <Badge />

          {/* Mobile menu */}
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="md:hidden"
                aria-label="Open navigation menu"
              >
                <Menu className="h-5 w-5" aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 p-0">
              <SheetTitle className="sr-only">Navigation menu</SheetTitle>
              <nav className="flex flex-col gap-1 p-4 pt-8" aria-label="Mobile navigation">
                {NAV_ITEMS.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => go(item.id)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors min-h-[44px]",
                      activeView === item.id
                        ? "bg-secondary text-secondary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                    aria-current={activeView === item.id ? "page" : undefined}
                  >
                    <item.icon className="h-4 w-4" aria-hidden="true" />
                    {item.label}
                  </button>
                ))}
                <div className="my-2 border-t border-border" />
                <button
                  onClick={() => go("join")}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold min-h-[44px] transition-colors",
                    activeView === "join"
                      ? "bg-primary text-primary-foreground"
                      : "bg-primary text-primary-foreground hover:opacity-90"
                  )}
                >
                  <Sprout className="h-4 w-4" aria-hidden="true" />
                  Join as Farmer / Buyer — Free
                </button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

function Badge() {
  return (
    <span className="hidden sm:inline-flex items-center rounded-full border border-primary/30 bg-secondary px-2.5 py-0.5 text-[11px] font-semibold text-primary">
      100% Free
    </span>
  );
}
