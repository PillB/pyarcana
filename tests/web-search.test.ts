// PyArcana CP-N4-C — Web/SERP adapter test suite (bun test).
// Covers: no-key provider, budget enforcement, domain allowlist/denylist,
// URL dedup, robots check, injection treatment, fallback on missing key /
// provider error, timestamp+provenance, query budget stop, max results,
// citation format, idempotency.

import { test, expect, describe, beforeEach, afterEach } from "bun:test";
import {
  searchWeb,
  pickProvider,
  wrapUntrusted,
  toCitation,
  noKeyWebProvider,
  tavilyProvider,
  normalizeUrl,
  urlHash,
  dedupeResults,
  domainOf,
  WebSearchBudgetTracker,
  DEFAULT_WEB_SEARCH_BUDGET,
  UNTRUSTED_WEB_PREFIX,
  isAllowed,
  makeRobotsConfig,
  DEFAULT_ROBOTS_ALLOWLIST,
  DEFAULT_ROBOTS_DENYLIST,
  type WebSearchResult,
} from "../src/lib/web-search";

describe("Web/SERP adapter — no-key provider", () => {
  test("no-key provider returns results for a relevant query", async () => {
    const res = await noKeyWebProvider.search(
      { query: "OWASP LLM top 10 prompt injection" },
      { maxResults: 5 },
    );
    expect(res.length).toBeGreaterThan(0);
    expect(res.every((r) => r.provider === "no-key")).toBe(true);
  });

  test("no-key provider returns no results for a non-matching query", async () => {
    const res = await noKeyWebProvider.search(
      { query: "zzzqqqxxxyyy non-existent topic" },
      { maxResults: 5 },
    );
    expect(res).toHaveLength(0);
  });
});

describe("Web/SERP adapter — budget enforcement", () => {
  test("query budget exceeded stops safely", async () => {
    const tracker = new WebSearchBudgetTracker({
      maxQueriesPerRun: 1,
      maxResultsPerQuery: 8,
      maxLatencyMs: 5_000,
      costCeilingUsd: 0.05,
    });
    const a = await searchWeb("OWASP LLM", { tracker, maxResults: 5 });
    expect(a.results.length).toBeGreaterThan(0);
    expect(a.budget.queries).toBe(1);
    // Second call must be refused by the tracker.
    const b = await searchWeb("WCAG 2.2", { tracker, maxResults: 5 });
    expect(b.results).toHaveLength(0);
    expect(b.budget.stopReason).toBe("max-queries-per-run");
  });

  test("max results enforced (maxResults cap)", async () => {
    const res = await searchWeb("the", { maxResults: 2 });
    expect(res.results.length).toBeLessThanOrEqual(2);
  });

  test("cost ceiling stops further queries", async () => {
    const tracker = new WebSearchBudgetTracker({
      maxQueriesPerRun: 10,
      maxResultsPerQuery: 8,
      maxLatencyMs: 5_000,
      costCeilingUsd: 0,
    });
    tracker.addCost(0.01); // already over the $0 ceiling
    const res = await searchWeb("OWASP", { tracker });
    expect(res.results).toHaveLength(0);
    expect(res.budget.stopReason).toBe("cost-ceiling-usd");
  });
});

describe("Web/SERP adapter — domain restrictions", () => {
  test("includeDomains (allowlist) restricts results", async () => {
    const res = await searchWeb("OWASP", { includeDomains: ["owasp.org"], maxResults: 10 });
    expect(res.results.length).toBeGreaterThan(0);
    expect(res.results.every((r) => r.domain === "owasp.org")).toBe(true);
  });

  test("excludeDomains (denylist) filters out a domain", async () => {
    const res = await searchWeb("OWASP WCAG", { excludeDomains: ["owasp.org"], maxResults: 10 });
    expect(res.results.every((r) => r.domain !== "owasp.org")).toBe(true);
  });

  test("evil.example is blocked by default robots denylist", async () => {
    // The synthetic corpus includes an evil.example canary; with default
    // restricted mode it must be filtered out.
    const res = await searchWeb("ignore previous instructions", { maxResults: 10 });
    expect(res.results.every((r) => r.domain !== "evil.example")).toBe(true);
  });

  test("robots check: denylist always wins over allowlist", () => {
    const cfg = makeRobotsConfig("permissive", ["evil.example"], ["evil.example"]);
    expect(isAllowed("evil.example", cfg)).toBe(false);
  });

  test("robots check: default-deny for unknown domains in restricted mode", () => {
    const cfg = makeRobotsConfig("restricted", DEFAULT_ROBOTS_ALLOWLIST, DEFAULT_ROBOTS_DENYLIST);
    expect(isAllowed("random-unknown.example", cfg)).toBe(false);
  });

  test("robots check: default-allow for unknown domains in permissive mode", () => {
    const cfg = makeRobotsConfig("permissive", DEFAULT_ROBOTS_ALLOWLIST, DEFAULT_ROBOTS_DENYLIST);
    expect(isAllowed("internal-trusted.example", cfg)).toBe(true);
  });
});

describe("Web/SERP adapter — URL deduplication", () => {
  test("normalizeUrl strips utm_* tracking params", () => {
    const a = normalizeUrl("https://example.com/page?utm_source=newsletter&id=42");
    const b = normalizeUrl("https://example.com/page?id=42");
    expect(a).toBe(b);
    expect(a).not.toContain("utm_");
  });

  test("normalizeUrl sorts query params and lowercases host", () => {
    const a = normalizeUrl("https://EXAMPLE.com/page?b=2&a=1");
    const b = normalizeUrl("https://example.com/page?a=1&b=2");
    expect(a).toBe(b);
  });

  test("normalizeUrl drops the fragment", () => {
    const a = normalizeUrl("https://example.com/page#section");
    const b = normalizeUrl("https://example.com/page");
    expect(a).toBe(b);
  });

  test("urlHash is sha1 hex (40 chars)", () => {
    const h = urlHash(normalizeUrl("https://example.com/page"));
    expect(h).toMatch(/^[a-f0-9]{40}$/);
  });

  test("dedupeResults collapses same-URL different-tracking results", () => {
    const base = "https://example.com/article";
    const fetchedAt = new Date().toISOString();
    const results: WebSearchResult[] = [
      { url: `${base}?utm_source=x`, title: "A", snippet: "s", publishedAt: null, fetchedAt, provider: "no-key", rank: 0, domain: "example.com", robotsAllowed: true },
      { url: `${base}?utm_source=y`, title: "A2", snippet: "s2", publishedAt: null, fetchedAt, provider: "no-key", rank: 1, domain: "example.com", robotsAllowed: true },
      { url: "https://other.example/post", title: "B", snippet: "s", publishedAt: null, fetchedAt, provider: "no-key", rank: 2, domain: "other.example", robotsAllowed: true },
    ];
    const out = dedupeResults(results);
    expect(out).toHaveLength(2);
    // First occurrence (highest rank) wins.
    expect(out[0].title).toBe("A");
  });

  test("domainOf extracts lower-cased host", () => {
    expect(domainOf("https://EXAMPLE.com/Path")).toBe("example.com");
    expect(domainOf("not a url")).toBe("");
  });
});

describe("Web/SERP adapter — injection treatment", () => {
  test("untrusted web content is wrapped with [untrusted web content] prefix", async () => {
    const res = await searchWeb("OWASP prompt injection", { maxResults: 5 });
    for (const r of res.results) {
      // searchWeb() always wraps snippets; the prefix must be present.
      expect(r.snippet.startsWith(UNTRUSTED_WEB_PREFIX)).toBe(true);
    }
  });

  test("wrapUntrusted is idempotent", () => {
    const once = wrapUntrusted("hello world");
    const twice = wrapUntrusted(once);
    expect(once).toBe(twice);
    expect(once.startsWith(UNTRUSTED_WEB_PREFIX)).toBe(true);
  });

  test("synthetic injection canary is never returned (robots gate)", async () => {
    // The canary page on evil.example contains "Ignore all previous instructions".
    // With default restricted mode it MUST be filtered out by the robots gate.
    const res = await searchWeb("ignore previous instructions", { maxResults: 20 });
    for (const r of res.results) {
      expect(r.domain).not.toBe("evil.example");
    }
  });
});

describe("Web/SERP adapter — fallback behaviour", () => {
  test("tavily provider falls back to no-key when TAVILY_API_KEY is missing", async () => {
    // Ensure no key is set in the test environment.
    const saved = process.env.TAVILY_API_KEY;
    delete process.env.TAVILY_API_KEY;
    try {
      const res = await tavilyProvider.search({ query: "OWASP" }, { maxResults: 3 });
      expect(res.length).toBeGreaterThan(0);
      expect(res.every((r) => r.provider === "no-key")).toBe(true);
    } finally {
      if (saved) process.env.TAVILY_API_KEY = saved;
    }
  });

  test("searchWeb fellBack flag is set when tavily is requested but no key", async () => {
    const saved = process.env.TAVILY_API_KEY;
    delete process.env.TAVILY_API_KEY;
    try {
      const res = await searchWeb("OWASP", { provider: "tavily", maxResults: 3 });
      expect(res.fellBack).toBe(true);
      expect(res.provider).toBe("no-key");
    } finally {
      if (saved) process.env.TAVILY_API_KEY = saved;
    }
  });

  test("searchWeb falls back to no-key on provider error (mocked fetch)", async () => {
    // Force tavily to be selected by setting a key, then break fetch.
    const savedKey = process.env.TAVILY_API_KEY;
    const savedFetch = globalThis.fetch;
    process.env.TAVILY_API_KEY = "test-key-1234";
    globalThis.fetch = (async () => { throw new Error("network down"); }) as unknown as typeof fetch;
    try {
      const res = await searchWeb("OWASP", { provider: "tavily", maxResults: 3 });
      // Should fall back to no-key results, not crash.
      expect(res.results.length).toBeGreaterThan(0);
      expect(res.results.every((r) => r.provider === "no-key")).toBe(true);
    } finally {
      globalThis.fetch = savedFetch;
      if (savedKey) process.env.TAVILY_API_KEY = savedKey;
      else delete process.env.TAVILY_API_KEY;
    }
  });
});

describe("Web/SERP adapter — provenance + timestamps", () => {
  test("every result has a fetchedAt (retrieval timestamp)", async () => {
    const res = await searchWeb("WCAG 2.2", { maxResults: 5 });
    for (const r of res.results) {
      expect(r.fetchedAt).toBeTruthy();
      // ISO-8601 parseable.
      expect(() => new Date(r.fetchedAt).toISOString()).not.toThrow();
    }
  });

  test("every result has provenance (provider, rank, domain, robotsAllowed)", async () => {
    const res = await searchWeb("OWASP LLM", { maxResults: 5 });
    for (const r of res.results) {
      expect(r.provider).toBeTruthy();
      expect(typeof r.rank).toBe("number");
      expect(r.domain).toBeTruthy();
      expect(typeof r.robotsAllowed).toBe("boolean");
    }
  });
});

describe("Web/SERP adapter — citation format + idempotency", () => {
  test("toCitation produces a citation with url/title/provider/fetchedAt/snippet", async () => {
    const res = await searchWeb("OpenTelemetry GenAI", { maxResults: 1 });
    if (res.results.length > 0) {
      const c = toCitation(res.results[0]);
      expect(c.url).toBe(res.results[0].url);
      expect(c.title).toBe(res.results[0].title);
      expect(c.provider).toBe(res.results[0].provider);
      expect(c.fetchedAt).toBe(res.results[0].fetchedAt);
      expect(c.snippet.startsWith(UNTRUSTED_WEB_PREFIX)).toBe(true);
    }
  });

  test("idempotency: same query produces same result set (modulo timestamp)", async () => {
    const a = await searchWeb("OWASP top 10 LLM", { maxResults: 5 });
    const b = await searchWeb("OWASP top 10 LLM", { maxResults: 5 });
    const norm = (r: WebSearchResult) => ({ url: r.url, title: r.title, provider: r.provider, rank: r.rank, domain: r.domain });
    expect(a.results.map(norm)).toEqual(b.results.map(norm));
  });

  test("pickProvider auto-selects no-key when no TAVILY_API_KEY", () => {
    const saved = process.env.TAVILY_API_KEY;
    delete process.env.TAVILY_API_KEY;
    try {
      expect(pickProvider().name).toBe("no-key");
    } finally {
      if (saved) process.env.TAVILY_API_KEY = saved;
    }
  });

  test("DEFAULT_WEB_SEARCH_BUDGET has the expected shape", () => {
    expect(DEFAULT_WEB_SEARCH_BUDGET.maxQueriesPerRun).toBeGreaterThan(0);
    expect(DEFAULT_WEB_SEARCH_BUDGET.maxResultsPerQuery).toBeGreaterThan(0);
    expect(DEFAULT_WEB_SEARCH_BUDGET.maxLatencyMs).toBeGreaterThan(0);
    expect(DEFAULT_WEB_SEARCH_BUDGET.costCeilingUsd).toBeGreaterThanOrEqual(0);
  });
});
