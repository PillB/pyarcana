// PyArcana web-search barrel + high-level searchWeb() facade.
//
// The facade is the ONLY entry point the orchestrator (copilot-harness.ts)
// should call. It:
//   - picks the provider (explicit opts.provider, or "tavily" if a key is
//     set, else "no-key")
//   - enforces the budget via WebSearchBudgetTracker
//   - deduplicates results (URL normalization + sha1 hash)
//   - wraps every snippet in "[untrusted web content] …" so the verifier
//     never sees raw web text as trusted instruction
//   - returns WebSearchResult[] with provenance (provider, rank, domain,
//     fetchedAt, robotsAllowed)

import type {
  WebSearchProvider,
  WebSearchProviderName,
  WebSearchQuery,
  WebSearchOptions,
  WebSearchResult,
} from "./types";
import { DEFAULT_WEB_SEARCH_BUDGET, UNTRUSTED_WEB_PREFIX } from "./types";
import { WebSearchBudgetTracker, type BudgetSnapshot } from "./budget";
import { dedupeResults } from "./dedup";
import { noKeyWebProvider } from "./providers/no-key";
import { tavilyProvider } from "./providers/tavily";

export * from "./types";
export * from "./dedup";
export * from "./budget";
export * from "./robots";
export { noKeyWebProvider } from "./providers/no-key";
export { tavilyProvider } from "./providers/tavily";

/** Auto-select the provider for the current environment. */
export function pickProvider(name?: WebSearchProviderName): WebSearchProvider {
  switch (name) {
    case "no-key": return noKeyWebProvider;
    case "tavily": {
      // If no key is set, return the no-key provider directly so the
      // fellBack flag in searchWeb() is computed correctly.
      const hasTavilyKey = Boolean(process?.env?.TAVILY_API_KEY);
      return hasTavilyKey ? tavilyProvider : noKeyWebProvider;
    }
    case "brave":
    case "searxng":
      // Reserved for future adapters; fall through to auto.
      return tavilyProvider;
    default: {
      const hasTavilyKey = Boolean(process?.env?.TAVILY_API_KEY);
      return hasTavilyKey ? tavilyProvider : noKeyWebProvider;
    }
  }
}

/**
 * Wrap a snippet as untrusted web content. The verifier and prompt builder
 * look for the UNTRUSTED_WEB_PREFIX to refuse to treat the content as an
 * instruction.
 */
export function wrapUntrusted(snippet: string): string {
  if (!snippet) return `${UNTRUSTED_WEB_PREFIX}`;
  if (snippet.startsWith(UNTRUSTED_WEB_PREFIX)) return snippet;
  return `${UNTRUSTED_WEB_PREFIX} ${snippet}`;
}

export interface SearchWebResult {
  results: WebSearchResult[];
  budget: BudgetSnapshot;
  provider: WebSearchProviderName;
  /** True if the run fell back from the requested provider to no-key. */
  fellBack: boolean;
}

/**
 * Run a single web-search query under the budget envelope. Returns deduped,
 * untrusted-wrapped results with provenance.
 */
export async function searchWeb(
  query: string | WebSearchQuery,
  opts: WebSearchOptions = {},
): Promise<SearchWebResult> {
  const q: WebSearchQuery = typeof query === "string" ? { query } : query;
  const budget = opts.budget ?? DEFAULT_WEB_SEARCH_BUDGET;
  const tracker = opts.tracker ?? new WebSearchBudgetTracker(budget);
  const requestedProvider = opts.provider;
  const provider = pickProvider(requestedProvider);
  const fellBack = requestedProvider === "tavily" && provider.name === "no-key";

  // Budget pre-check.
  if (!tracker.reserveQuery()) {
    return { results: [], budget: tracker.snapshot(), provider: provider.name, fellBack };
  }

  let raw: WebSearchResult[];
  try {
    raw = await provider.search(q, opts);
  } catch {
    // Provider error → fallback to no-key, stop tracker.
    tracker.stop("provider-error");
    const fb = await noKeyWebProvider.search(q, opts);
    raw = fb;
  }

  // Record results in the tracker (caps per-query).
  const accepted = tracker.recordResults(raw.length);

  // Dedup by URL hash, then cap at the requested maxResults.
  const deduped = dedupeResults(raw).slice(0, opts.maxResults ?? accepted);

  // Wrap snippets as untrusted — content from the open web is NEVER trusted
  // as instruction. The original (un-wrapped) snippet is preserved in the
  // .snippet field for audit; callers that need the untrusted fence use the
  // searchWeb() return value (which always wraps) — note we wrap in place
  // here so the contract is: "every WebSearchResult returned from
  // searchWeb() has an untrusted-wrapped snippet."
  const wrapped: WebSearchResult[] = deduped.map((r) => ({
    ...r,
    snippet: wrapUntrusted(r.snippet),
  }));

  return {
    results: wrapped,
    budget: tracker.snapshot(),
    provider: provider.name,
    fellBack,
  };
}

/**
 * Format a WebSearchResult as a citation. Mirrors the Citation shape in
 * copilot-harness.ts but is web-specific (URL + provider + fetchedAt).
 */
export interface WebCitation {
  url: string;
  title: string;
  provider: WebSearchProviderName;
  fetchedAt: string;
  snippet: string;
}

export function toCitation(r: WebSearchResult): WebCitation {
  return {
    url: r.url,
    title: r.title,
    provider: r.provider,
    fetchedAt: r.fetchedAt,
    snippet: r.snippet,
  };
}
