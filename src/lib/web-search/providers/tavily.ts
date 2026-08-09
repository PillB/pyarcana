// Tavily web-search adapter.
//
// Calls the Tavily REST API if TAVILY_API_KEY is set; otherwise falls back
// to the no-key provider. This mirrors the commercialTestAdapter pattern
// in copilot-harness.ts: no mandatory paid key for the basic validation
// suite.
//
// Reference: https://docs.tavily.com/api-reference/search
//
// The adapter applies include_domains/exclude_domains at the provider layer
// (Tavily supports both natively) AND re-applies them locally so a provider
// bug or a hostile payload cannot bypass the gate.

import type { WebSearchProvider, WebSearchQuery, WebSearchOptions, WebSearchResult } from "../types";
import { domainOf } from "../dedup";
import { isAllowed, makeRobotsConfig, DEFAULT_ROBOTS_ALLOWLIST, DEFAULT_ROBOTS_DENYLIST } from "../robots";
import { noKeyWebProvider } from "./no-key";

interface TavilyResponse {
  results?: Array<{
    url?: string;
    title?: string;
    content?: string;
    published_date?: string;
    score?: number;
  }>;
  [k: string]: unknown;
}

const TAVILY_ENDPOINT = "https://api.tavily.com/search";

export const tavilyProvider: WebSearchProvider = {
  name: "tavily",
  mode: "live",
  async search(query: WebSearchQuery, opts: WebSearchOptions): Promise<WebSearchResult[]> {
    const key = process?.env?.TAVILY_API_KEY;
    if (!key) {
      // Fallback — no paid key required for the basic validation suite.
      return noKeyWebProvider.search(query, opts);
    }
    const maxResults = opts.maxResults ?? 8;
    const body = {
      api_key: key,
      query: query.query,
      max_results: maxResults,
      include_domains: opts.includeDomains ?? [],
      exclude_domains: opts.excludeDomains ?? [],
      include_answer: false,
      include_raw_content: false,
    };
    let data: TavilyResponse;
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), opts.budget?.maxLatencyMs ?? 5_000);
      const res = await fetch(TAVILY_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: ctrl.signal,
      });
      clearTimeout(timer);
      if (!res.ok) throw new Error(`tavily HTTP ${res.status}`);
      data = (await res.json()) as TavilyResponse;
    } catch {
      // Provider outage → fallback to no-key.
      return noKeyWebProvider.search(query, opts);
    }
    const cfg = makeRobotsConfig(
      "restricted",
      opts.includeDomains && opts.includeDomains.length > 0
        ? opts.includeDomains
        : DEFAULT_ROBOTS_ALLOWLIST,
      opts.excludeDomains && opts.excludeDomains.length > 0
        ? [...DEFAULT_ROBOTS_DENYLIST, ...opts.excludeDomains]
        : DEFAULT_ROBOTS_DENYLIST,
    );
    const fetchedAt = new Date().toISOString();
    const inc = new Set((opts.includeDomains ?? []).map((d) => d.toLowerCase()));
    const exc = new Set((opts.excludeDomains ?? []).map((d) => d.toLowerCase()));
    const out: WebSearchResult[] = [];
    let rank = 0;
    for (const r of data.results ?? []) {
      if (!r.url) continue;
      const domain = domainOf(r.url);
      // Local re-application of domain gates (defence-in-depth).
      if (inc.size > 0 && !inc.has(domain)) continue;
      if (exc.has(domain)) continue;
      if (!opts.skipRobots && !isAllowed(domain, cfg)) continue;
      out.push({
        url: r.url,
        title: r.title ?? "(untitled)",
        snippet: (r.content ?? "").slice(0, 280),
        publishedAt: r.published_date ?? null,
        fetchedAt,
        provider: "tavily",
        rank: rank++,
        domain,
        robotsAllowed: opts.skipRobots ? true : isAllowed(domain, cfg),
      });
      if (out.length >= maxResults) break;
    }
    return out;
  },
};
