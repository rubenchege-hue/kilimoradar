const OPENROUTER_BASE = "https://openrouter.ai/api/v1";

function getApiKey(): string {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key || key === "your-openrouter-api-key-here") {
    throw new Error("OPENROUTER_API_KEY is not set in .env");
  }
  return key;
}

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export async function chatCompletion(
  messages: ChatMessage[],
  opts?: { model?: string; maxTokens?: number }
) {
  const apiKey = getApiKey();
  const model = opts?.model ?? "google/gemini-2.5-flash";

  const res = await fetch(`${OPENROUTER_BASE}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "HTTP-Referer": "https://kilimoradar.com",
      "X-Title": "Kilimo Radar",
    },
    body: JSON.stringify({
      model,
      messages,
      max_tokens: opts?.maxTokens ?? 1024,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenRouter ${res.status}: ${err}`);
  }

  return res.json();
}

export async function webSearch(query: string, numResults = 5) {
  const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    },
  });

  if (!res.ok) throw new Error(`DuckDuckGo ${res.status}`);

  const html = await res.text();
  const results: {
    title: string;
    url: string;
    snippet: string;
    source: string;
    date: string;
  }[] = [];

  const resultRegex =
    /<a[^>]+class="result__a"[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>[\s\S]*?<a[^>]+class="result__snippet"[^>]*>([\s\S]*?)<\/a>/g;

  let match;
  while ((match = resultRegex.exec(html)) !== null && results.length < numResults) {
    const rawUrl = match[1];
    const title = match[2].replace(/<[^>]+>/g, "").trim();
    const snippet = match[3].replace(/<[^>]+>/g, "").trim();
    if (!title || !rawUrl) continue;
    let parsed: URL;
    try {
      const u = new URL(rawUrl);
      const uddg = u.searchParams.get("uddg");
      parsed = uddg ? new URL(uddg) : u;
    } catch {
      continue;
    }
    results.push({
      title,
      url: parsed.href,
      snippet,
      source: parsed.hostname,
      date: "",
    });
  }

  return results;
}
