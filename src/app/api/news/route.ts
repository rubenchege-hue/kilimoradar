import { NextResponse } from "next/server";
import { webSearch } from "@/lib/ai";

interface NewsItem {
  id: string;
  title: string;
  url: string;
  snippet: string;
  source: string;
  date: string;
  relevance: "high" | "medium";
}

const CACHE_TTL = 30 * 60 * 1000;
let cache: { at: number; items: NewsItem[] } | null = null;

const HIGH_SIGNAL = [
  "kenya",
  "fertilizer",
  "shipping",
  "red sea",
  "export",
  "avocado",
  "tea",
  "coffee",
  "macadamia",
  "flower",
  "farmer",
  "agricultur",
  "china",
  "eu ",
  "european union",
  "tariff",
  "trade",
];

function scoreRelevance(item: { title: string; snippet: string; source: string }): "high" | "medium" {
  const text = `${item.source ?? ""} ${item.title ?? ""} ${item.snippet ?? ""}`.toLowerCase();
  const hits = HIGH_SIGNAL.filter((kw) => text.includes(kw)).length;
  return hits >= 3 ? "high" : "medium";
}

export async function GET() {
  if (cache && Date.now() - cache.at < CACHE_TTL) {
    return NextResponse.json({ items: cache.items, cached: true });
  }

  try {
    const queries = [
      "Kenya agricultural exports geopolitics trade news",
      "Kenya farmers fertilizer shipping export market news",
      "Kenya tea coffee avocado flowers export news",
    ];

    const settled = await Promise.allSettled(
      queries.map((q) => webSearch(q, 8))
    );

    const seen = new Set<string>();
    const merged: NewsItem[] = [];

    for (const result of settled) {
      if (result.status !== "fulfilled" || !Array.isArray(result.value)) continue;
      result.value.forEach((item, idx) => {
        if (!item.url || seen.has(item.url)) return;
        if (!item.title) return;
        seen.add(item.url);
        merged.push({
          id: `${item.source ?? "news"}-${merged.length}-${idx}`,
          title: item.title,
          url: item.url,
          snippet: item.snippet ?? "",
          source: item.source ?? "web",
          date: item.date ?? "",
          relevance: scoreRelevance(item),
        });
      });
    }

    const titleSeen = new Set<string>();
    const deduped = merged.filter((item) => {
      const key = (item.title ?? "").toLowerCase().slice(0, 60);
      if (titleSeen.has(key)) return false;
      titleSeen.add(key);
      return true;
    });

    const sorted = deduped
      .sort((a, b) => {
        if (a.relevance !== b.relevance) return a.relevance === "high" ? -1 : 1;
        return (b.date ?? "").localeCompare(a.date ?? "");
      })
      .slice(0, 12);

    cache = { at: Date.now(), items: sorted };

    return NextResponse.json({ items: sorted, cached: false });
  } catch (error) {
    console.error("GET /api/news error:", error);
    return NextResponse.json({ items: [], error: "News unavailable right now" }, { status: 200 });
  }
}
