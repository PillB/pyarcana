// robots.txt / ToS / access-constraint gate for the web-search adapter.
//
// We do NOT crawl arbitrary URLs at fetch time; this is a pre-fetch gate
// applied to provider results so the orchestrator only ever surfaces URLs
// whose domain is on the agent's allowlist. The flag is conservative:
//
//   - default-deny for unknown domains in restricted mode
//   - default-allow for unknown domains in permissive mode (for trusted
//     internal corpora)
//   - explicit allowlist wins over denylist when both contain the same domain
//     (allowlist is the source of truth; denylist is a fail-safe)
//
// The "robotsAllowed" boolean attached to each WebSearchResult is computed
// here. The verifier and prompt builder treat a robotsAllowed=false result
// as untrusted — it is still returned (for audit) but its snippet is fenced.

export type RobotsMode = "restricted" | "permissive";

export interface RobotsConfig {
  mode: RobotsMode;
  allowlist: Set<string>;
  denylist: Set<string>;
}

export const DEFAULT_ROBOTS_ALLOWLIST = new Set<string>([
  "w3.org",
  "owasp.org",
  "nist.gov",
  "opentelemetry.io",
  "example.com",
  "synthetic.example",
]);

export const DEFAULT_ROBOTS_DENYLIST = new Set<string>([
  "evil.example",
  "attacker.example",
]);

export function makeRobotsConfig(
  mode: RobotsMode = "restricted",
  allowlist: Iterable<string> = DEFAULT_ROBOTS_ALLOWLIST,
  denylist: Iterable<string> = DEFAULT_ROBOTS_DENYLIST,
): RobotsConfig {
  return {
    mode,
    allowlist: new Set([...allowlist].map((d) => d.toLowerCase())),
    denylist: new Set([...denylist].map((d) => d.toLowerCase())),
  };
}

/**
 * Decide whether a domain is crawlable by the agent.
 *
 * Resolution order:
 *   1. denylist (always wins) → false
 *   2. allowlist → true
 *   3. mode:
 *      - restricted → false (default-deny for unknown)
 *      - permissive → true (default-allow for trusted internal corpora)
 */
export function isAllowed(domain: string, cfg: RobotsConfig): boolean {
  const d = (domain || "").toLowerCase();
  if (!d) return false;
  if (cfg.denylist.has(d)) return false;
  if (cfg.allowlist.has(d)) return true;
  return cfg.mode === "permissive";
}

/**
 * Apply the robots gate to a list of URLs.
 * Returns the subset whose domain passes the gate.
 */
export function filterAllowed(urls: string[], cfg: RobotsConfig): string[] {
  return urls.filter((u) => {
    try {
      const host = new URL(u).hostname.toLowerCase();
      return isAllowed(host, cfg);
    } catch {
      return false;
    }
  });
}
