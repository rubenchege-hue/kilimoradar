import { NextResponse } from "next/server";
import ZAI from "z-ai-web-dev-sdk";

interface NewsItem {
  id: string;
  title: string;
  url: string;
  snippet: string;
  source: string;
  date: string;
  relevance: "high" | "medium";
}

interface NewsResult {
  name: string;
  title?: string;
  url: string;
  snippet?: string;
  host_name?: string;
  date?: string;
}

// Simple in-memory cache (30 min) so we don't hit search on every visit
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

function scoreRelevance(item: NewsResult): "high" | "medium" {
  const text = `${item.name ?? ""} ${item.title ?? ""} ${item.snippet ?? ""}`.toLowerCase();
  const hits = HIGH_SIGNAL.filter((kw) => text.includes(kw)).length;
  return hits >= 3 ? "high" : "medium";
}

function toNewsItem(item: NewsResult, idx: number): NewsItem {
  return {
    id: `${item.host_name ?? "news"}-${idx}`,
    title: item.name ?? item.title ?? "News",
    url: item.url,
    snippet: item.snippet ?? "",
    source: item.host_name ?? "web",
    date: item.date ?? "",
    relevance: scoreRelevance(item),
  };
}

export async function GET() {
  if (cache && Date.now() - cache.at < CACHE_TTL) {
    return NextResponse.json({ items: cache.items, cached: true });
  }

  try {
    const zai = await ZAI.create();

    const queries = [
      { query: "Kenya agricultural exports geopolitics trade news", num: 8 },
      { query: "Kenya farmers fertilizer shipping export market news", num: 6 },
      { query: "Kenya tea coffee avocado flowers export news", num: 6 },
    ];

    const settled = await Promise.allSettled(
      queries.map((q) => zai.functions.invoke("web_search", q))
    );

    const seen = new Set<string>();
    const merged: NewsItem[] = [];

    for (const result of settled) {
      if (result.status !== "fulfilled" || !Array.isArray(result.value)) continue;
      (result.value as NewsResult[]).forEach((item, idx) => {
        if (!item.url || seen.has(item.url)) return;
        if (!item.name && !item.title) return;
        seen.add(item.url);
        merged.push(toNewsItem(item, `${merged.length}-${idx}`));
      });
    }

    // Dedupe by title similarity as well
    const titleSeen = new Set<string>();
    const deduped = merged.filter((item) => {
      const key = (item.title ?? "").toLowerCase().slice(0, 60);
      if (titleSeen.has(key)) return false;
      titleSeen.add(key);
      return true;
    });

    // High relevance first, keep top 12
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
