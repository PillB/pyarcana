// PyArcana CP-N4-C — provider-neutral Web/SERP search abstraction.
//
// Mirrors the existing ModelAdapter pattern in src/lib/copilot-harness.ts:
//   - provider abstraction (WebSearchProvider interface)
//   - query budget (WebSearchBudget)
//   - domain restrictions (allowlist + denylist)
//   - source provenance (provider, rank, domain, fetchedAt)
//   - retrieval timestamp (fetchedAt, ISO-8601)
//   - result deduplication (see dedup.ts)
//   - citation (url, title, snippet)
//   - robots/terms/access constraints (robotsAllowed flag)
//   - injection treatment — snippets are wrapped "[untrusted web content] …"
//     at the searchWeb() boundary so the verifier NEVER sees raw web text as
//     trusted instruction. (See index.ts.)
//   - fallback when search is unavailable (no-key provider, see providers/no-key.ts)

export type WebSearchProviderName =
  | "no-key"
  | "tavily"
  | "brave"
  | "searxng";

export interface WebSearchResult {
  /** Canonical absolute URL (normalized via dedup.normalizeUrl). */
  url: string;
  /** Result page title. */
  title: string;
  /** Short snippet from the search provider. Wrapped as untrusted by searchWeb(). */
  snippet: string;
  /** Published date if known (ISO-8601), null if unavailable. */
  publishedAt: string | null;
  /** Retrieval timestamp (ISO-8601). Always set when the result is returned. */
  fetchedAt: string;
  /** Provider that produced this result. */
  provider: WebSearchProviderName;
  /** 0-based rank within the provider's result set. */
  rank: number;
  /** Lower-cased host (e.g. "example.com"). */
  domain: string;
  /** Whether the domain's robots.txt allows crawling for our agent. */
  robotsAllowed: boolean;
}

export interface WebSearchBudget {
  /** Maximum number of provider queries per run. */
  maxQueriesPerRun: number;
  /** Maximum results returned per query. */
  maxResultsPerQuery: number;
  /** Maximum latency for a single provider call, in ms. */
  maxLatencyMs: number;
  /** Soft cost ceiling in USD for the whole run. */
  costCeilingUsd: number;
}

export interface WebSearchOptions {
  /** Override the auto-selected provider. */
  provider?: WebSearchProviderName;
  /** Restrict results to these domains (allowlist). */
  includeDomains?: string[];
  /** Exclude results from these domains (denylist). */
  excludeDomains?: string[];
  /** Maximum results to return after dedup. */
  maxResults?: number;
  /** Budget override (otherwise uses DEFAULT_WEB_SEARCH_BUDGET). */
  budget?: WebSearchBudget;
  /** Caller-provided tracker (otherwise a fresh one is created). */
  tracker?: import("./budget").WebSearchBudgetTracker;
  /** Skip the robots.txt gate (use only for trusted internal corpora). */
  skipRobots?: boolean;
}

export interface WebSearchQuery {
  /** The user-facing query string. */
  query: string;
  /** Optional temporal anchor — restrict to pages published after this date. */
  publishedAfter?: string;
}

export interface WebSearchProvider {
  name: WebSearchProviderName;
  /** Mode flag mirroring ProviderMode in copilot-harness.ts. */
  mode: "no-key" | "live";
  /**
   * Run a single query against the provider.
   * Implementations MUST:
   *   - apply includeDomains/excludeDomains filtering
   *   - tag each result with provider, rank, domain, fetchedAt
   *   - return at most `maxResults` rows
   *   - never throw on a soft error — return [] and let the caller fall back
   */
  search(query: WebSearchQuery, opts: WebSearchOptions): Promise<WebSearchResult[]>;
}

export const DEFAULT_WEB_SEARCH_BUDGET: WebSearchBudget = {
  maxQueriesPerRun: 5,
  maxResultsPerQuery: 8,
  maxLatencyMs: 5_000,
  costCeilingUsd: 0.05,
};

/**
 * Mark applied to every snippet emitted from the open web. The verifier and
 * the LLM prompt builder look for this exact prefix to know the content is
 * untrusted and MUST NOT be treated as an instruction.
 */
export const UNTRUSTED_WEB_PREFIX = "[untrusted web content]";
