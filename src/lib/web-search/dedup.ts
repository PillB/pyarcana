// URL normalization and deduplication for the web-search adapter.
//
// Two URLs that differ only in tracking parameters, query-param order, or
// host casing are considered the same resource. We compute a sha1 hash of
// the normalized URL so callers can dedup O(1).

import { createHash } from "node:crypto";
import type { WebSearchResult } from "./types";

/** Lower-cased set of tracking params stripped before comparison. */
const TRACKING_PARAM_PREFIXES = ["utm_", "fbclid", "gclid", "mc_", "ref", "igshid", "_hsenc", "_hsmi", "yclid", "msclkid", "twclid"];

/**
 * Strip tracking query params (utm_*, fbclid, gclid, mc_*, …) and fragment,
 * lower-case the host, sort the remaining query params by key, and produce
 * a canonical absolute URL string.
 *
 * Returns the input unchanged (lower-cased host) if parsing fails.
 */
export function normalizeUrl(rawUrl: string): string {
  if (!rawUrl || typeof rawUrl !== "string") return "";
  let u: URL;
  try {
    u = new URL(rawUrl.trim());
  } catch {
    // Not a parseable absolute URL — best-effort: lowercase and return.
    return rawUrl.trim().toLowerCase();
  }
  // Lower-case host (the rest of the URL is case-sensitive on the path).
  u.hostname = u.hostname.toLowerCase();
  // Strip default ports.
  if ((u.protocol === "https:" && u.port === "443") || (u.protocol === "http:" && u.port === "80")) {
    u.port = "";
  }
  // Drop the fragment (#...) entirely.
  u.hash = "";
  // Filter and sort query params.
  const kept: [string, string][] = [];
  u.searchParams.forEach((value, key) => {
    const lk = key.toLowerCase();
    if (TRACKING_PARAM_PREFIXES.some((p) => lk === p || lk.startsWith(p))) return;
    kept.push([lk, value]);
  });
  kept.sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));
  u.search = "";
  for (const [k, v] of kept) u.searchParams.append(k, v);
  // Trailing slash normalization: bare path "/" stays, otherwise strip a single trailing "/".
  if (u.pathname.length > 1 && u.pathname.endsWith("/")) {
    u.pathname = u.pathname.replace(/\/+$/, "");
  }
  return u.toString();
}

/** sha1 hex digest of a normalized URL — used as the dedup key. */
export function urlHash(normalizedUrl: string): string {
  return createHash("sha1").update(normalizedUrl).digest("hex");
}

/** Extract the lower-cased host (domain) from a raw URL string. */
export function domainOf(rawUrl: string): string {
  try {
    return new URL(rawUrl).hostname.toLowerCase();
  } catch {
    return "";
  }
}

/**
 * Deduplicate a list of WebSearchResult by URL hash, preserving the first
 * occurrence (which carries the highest rank from its provider).
 */
export function dedupeResults(results: WebSearchResult[]): WebSearchResult[] {
  const seen = new Set<string>();
  const out: WebSearchResult[] = [];
  for (const r of results) {
    const key = urlHash(normalizeUrl(r.url));
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(r);
  }
  return out;
}
