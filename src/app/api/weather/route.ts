import { NextResponse } from "next/server";

// ─────────────────────────────────────────────────────────────
// Live weather intelligence via Open-Meteo (free, no API key)
// https://open-meteo.com/
// ─────────────────────────────────────────────────────────────

type Kind = "growing" | "weather" | "shipping";

interface Location {
  id: string;
  market: string;
  country: string;
  lat: number;
  lon: number;
  kind: Kind;
  label: string;
  blurb: string;
}

interface WeatherItem {
  id: string;
  title: string;
  url: string;
  snippet: string;
  source: string;
  date: string;
  market: string;
  kind: Kind;
  relevance: "high" | "medium";
  tempNow: number;
  tempMax: number;
  tempMin: number;
  precipProb: number;
  weatherCode: number;
  condition: string;
  risk: "low" | "medium" | "high";
}

const CACHE_TTL = 20 * 60 * 1000; // refresh every 20 minutes
let cache: { at: number; items: WeatherItem[] } | null = null;

// Markets actively monitored. Kenya = growing conditions;
// EU/UK/Netherlands = export-market weather; South Africa = shipping/supply signal.
// Coordinates are capital/capital-region points for each market.
const LOCATIONS: Location[] = [
  {
    id: "kenya",
    market: "Kenya",
    country: "KE",
    lat: -1.29,
    lon: 36.82,
    kind: "growing",
    label: "Nairobi & Central Highlands",
    blurb: "Conditions for your fields and for road transport to port.",
  },
  {
    id: "eu",
    market: "European Union",
    country: "BE",
    lat: 50.85,
    lon: 4.35,
    kind: "weather",
    label: "Brussels (gateway)",
    blurb: "EU summer heat or storms signal how hard your exports compete with local produce.",
  },
  {
    id: "uk",
    market: "United Kingdom",
    country: "GB",
    lat: 51.51,
    lon: -0.13,
    kind: "weather",
    label: "London",
    blurb: "Cool, wet weather keeps UK fields quiet and supermarket shelves thin — good for imports.",
  },
  {
    id: "netherlands",
    market: "Netherlands",
    country: "NL",
    lat: 52.37,
    lon: 4.9,
    kind: "weather",
    label: "Amsterdam & Aalsmeer flower hub",
    blurb: "Greenhouse supply and the Dutch auction floor set flower and herb demand.",
  },
  {
    id: "south-africa",
    market: "South Africa",
    country: "ZA",
    lat: -33.92,
    lon: 18.42,
    kind: "shipping",
    label: "Cape Town (Southern Cone route)",
    blurb: "Storms around the Cape can delay the shipping route your containers use.",
  },
];

// WMO weather interpretation codes → plain English
const WMO: Record<number, { label: string; risk: "low" | "medium" | "high" }> = {
  0: { label: "Clear", risk: "low" },
  1: { label: "Mostly clear", risk: "low" },
  2: { label: "Partly cloudy", risk: "low" },
  3: { label: "Overcast", risk: "low" },
  45: { label: "Fog", risk: "medium" },
  48: { label: "Fog (rime)", risk: "medium" },
  51: { label: "Light drizzle", risk: "low" },
  53: { label: "Drizzle", risk: "low" },
  55: { label: "Dense drizzle", risk: "medium" },
  56: { label: "Freezing drizzle", risk: "high" },
  57: { label: "Freezing drizzle (heavy)", risk: "high" },
  61: { label: "Light rain", risk: "low" },
  63: { label: "Rain", risk: "medium" },
  65: { label: "Heavy rain", risk: "high" },
  66: { label: "Freezing rain", risk: "high" },
  67: { label: "Freezing rain (heavy)", risk: "high" },
  71: { label: "Light snow", risk: "medium" },
  73: { label: "Snow", risk: "high" },
  75: { label: "Heavy snow", risk: "high" },
  77: { label: "Snow grains", risk: "medium" },
  80: { label: "Light showers", risk: "low" },
  81: { label: "Showers", risk: "medium" },
  82: { label: "Violent showers", risk: "high" },
  85: { label: "Snow showers", risk: "high" },
  86: { label: "Heavy snow showers", risk: "high" },
  95: { label: "Thunderstorm", risk: "high" },
  96: { label: "Thunderstorm with hail", risk: "high" },
  99: { label: "Severe thunderstorm", risk: "high" },
};

function conditionFor(code: number): string {
  return WMO[code]?.label ?? "Variable";
}

function riskFor(code: number): "low" | "medium" | "high" {
  return WMO[code]?.risk ?? "medium";
}

async function fetchLocation(loc: Location): Promise<WeatherItem | null> {
  const params = new URLSearchParams({
    latitude: String(loc.lat),
    longitude: String(loc.lon),
    current: "temperature_2m,weather_code,precipitation",
    daily: "temperature_2m_max,temperature_2m_min,precipitation_probability_max",
    timezone: "auto",
    forecast_days: "3",
  });
  const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`, {
    headers: { "User-Agent": "KilimoRadar/1.0" },
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) throw new Error(`Open-Meteo ${res.status}`);
  const data = await res.json();

  const tempNow = data?.current?.temperature_2m as number | undefined;
  const weatherCode = (data?.current?.weather_code as number | undefined) ?? 0;
  const precipNow = (data?.current?.precipitation as number | undefined) ?? 0;
  const tMax =
    (data?.daily?.temperature_2m_max?.[0] as number | undefined) ?? tempNow ?? 0;
  const tMin =
    (data?.daily?.temperature_2m_min?.[0] as number | undefined) ?? tempNow ?? 0;
  const precipProb =
    (data?.daily?.precipitation_probability_max?.[0] as number | undefined) ?? 0;

  if (tempNow === undefined) return null;

  // Farmers need a plain-language read. Compose title + snippet from the numbers.
  const condition = conditionFor(weatherCode);
  const risk = riskFor(weatherCode);

  const title =
    loc.kind === "growing"
      ? `${condition} in ${loc.market} — ${Math.round(tempNow)}°C right now`
      : `${condition} in ${loc.market} — ${Math.round(tempNow)}°C now, high ${Math.round(tMax)}°C`;

  let snippet: string;
  if (loc.kind === "growing") {
    snippet =
      `${loc.label}. Rain chance ${precipProb}% (${precipNow > 0 ? "rain falling now" : "dry now"}). ` +
      `${loc.blurb} High ${Math.round(tMax)}°C / low ${Math.round(tMin)}°C. ` +
      (precipProb >= 60
        ? "Heavy rain ahead — plan harvest and delivery to port to avoid mud delays."
        : precipProb >= 30
        ? "Possible showers — time picking and transport accordingly."
        : "Dry window ahead — good for harvesting and getting produce to cooler stores quickly.");
  } else if (loc.kind === "weather") {
    snippet =
      `${loc.label}. Local summer harvest depends on warmth: high ${Math.round(tMax)}°C. ` +
      `${loc.blurb} Rain chance ${precipProb}%. ` +
      (tMax >= 30
        ? "Hot — local produce is abundant and competition for your exports is strong."
        : tMax <= 20
        ? "Cool — local fields are slow, leaving shelf space your exports can fill."
        : "Mild season — normal import demand.");
  } else {
    snippet =
      `${loc.label}. ${loc.blurb} Windy or stormy weather here can add days to ocean transit. ` +
      `Rain chance ${precipProb}%, high ${Math.round(tMax)}°C. ` +
      (risk === "high"
        ? "Storm risk — ask your buyer about potential routing delays and plan a buffer."
        : "Generally settled — transit should be on schedule.");
  }

  const dateStr = data?.current?.time ?? "";
  const relevance: "high" | "medium" =
    risk === "high" || precipProb >= 60 ? "high" : "medium";

  return {
    id: `${loc.id}-${dateStr}`,
    title,
    url: `https://open-meteo.com/en/docs#latitude=${loc.lat}&longitude=${loc.lon}`,
    snippet,
    source: "Open-Meteo",
    date: dateStr,
    market: loc.market,
    kind: loc.kind,
    relevance,
    tempNow: Math.round(tempNow),
    tempMax: Math.round(tMax),
    tempMin: Math.round(tMin),
    precipProb,
    weatherCode,
    condition,
    risk,
  };
}

export async function GET() {
  if (cache && Date.now() - cache.at < CACHE_TTL) {
    return NextResponse.json({
      items: cache.items,
      cached: true,
      generatedAt: new Date(cache.at).toISOString(),
    });
  }

  try {
    const settled = await Promise.allSettled(LOCATIONS.map(fetchLocation));
    const items: WeatherItem[] = [];

    settled.forEach((result) => {
      if (result.status !== "fulfilled") {
        console.error("Open-Meteo error:", result.reason);
        return;
      }
      if (result.value) items.push(result.value);
    });

    const sortOrder: Kind[] = ["growing", "weather", "shipping"];
    items.sort((a, b) => sortOrder.indexOf(a.kind) - sortOrder.indexOf(b.kind));

    cache = { at: Date.now(), items };

    return NextResponse.json({
      items,
      cached: false,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("GET /api/weather error:", error);
    return NextResponse.json(
      { items: [], error: "Weather intelligence unavailable right now" },
      { status: 200 }
    );
  }
}
