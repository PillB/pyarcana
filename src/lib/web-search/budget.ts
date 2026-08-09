// Budget tracker for the web-search adapter.
//
// Mirrors the budget envelope pattern in copilot-harness.ts:
//   - hard ceiling on query count
//   - hard ceiling on result count per query
//   - soft cost ceiling (USD)
//   - latency ceiling per call (informational; enforced by the caller via AbortSignal)
//
// The tracker is the ONLY place that mutates the counters — providers and
// the searchWeb() facade consult it before and after each call.

import type { WebSearchBudget } from "./types";

export interface BudgetSnapshot {
  queries: number;
  results: number;
  costUsd: number;
  remainingQueries: number;
  remainingResultsCeiling: number;
  withinBudget: boolean;
  stopReason: string | null;
}

export class WebSearchBudgetTracker {
  readonly budget: WebSearchBudget;
  private queries = 0;
  private results = 0;
  private costUsd = 0;
  private stopReason: string | null = null;

  constructor(budget: WebSearchBudget) {
    this.budget = budget;
  }

  /** True iff a new query can be issued without breaching the budget. */
  canQuery(): boolean {
    if (this.stopReason) return false;
    if (this.queries >= this.budget.maxQueriesPerRun) {
      this.stopReason = "max-queries-per-run";
      return false;
    }
    if (this.costUsd >= this.budget.costCeilingUsd) {
      this.stopReason = "cost-ceiling-usd";
      return false;
    }
    return true;
  }

  /**
   * Reserve a slot for one query. Returns true on success, false (and sets
   * the stop reason) when the budget is exhausted. Idempotent within a tick
   * is not — callers MUST call this once per actual provider call.
   */
  reserveQuery(): boolean {
    if (!this.canQuery()) return false;
    this.queries += 1;
    return true;
  }

  /** Record results returned by a single query. Caps at the per-query max. */
  recordResults(count: number): number {
    if (count <= 0) return 0;
    const accepted = Math.min(count, this.budget.maxResultsPerQuery);
    this.results += accepted;
    return accepted;
  }

  /** Add a (positive) USD cost. */
  addCost(usd: number): void {
    if (usd > 0) this.costUsd = Math.round((this.costUsd + usd) * 1e6) / 1e6;
    if (this.costUsd > this.budget.costCeilingUsd && !this.stopReason) {
      this.stopReason = "cost-ceiling-usd";
    }
  }

  /** Mark the tracker as stopped for an external reason (e.g. provider error). */
  stop(reason: string): void {
    if (!this.stopReason) this.stopReason = reason;
  }

  snapshot(): BudgetSnapshot {
    return {
      queries: this.queries,
      results: this.results,
      costUsd: Math.round(this.costUsd * 1e6) / 1e6,
      remainingQueries: Math.max(0, this.budget.maxQueriesPerRun - this.queries),
      remainingResultsCeiling: this.budget.maxResultsPerQuery,
      withinBudget: this.stopReason === null,
      stopReason: this.stopReason,
    };
  }
}
