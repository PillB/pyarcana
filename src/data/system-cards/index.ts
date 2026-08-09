// PyArcana — System Cards barrel export (Gap C).
//
// Maps capstoneId → SystemCard. Currently exposes CP-N4-C (the multi-agent
// harness) and CP-FINAL (the transversal integration that aggregates the
// twelve upstream capstones). Other capstones may add cards later; they
// are not required by the Gap-C spec.

import type { SystemCard } from "../system-card-schema";
import { CP_N4_C_SYSTEM_CARD } from "./CP-N4-C.system-card";
import { CP_FINAL_SYSTEM_CARD } from "./CP-FINAL.system-card";

export { CP_N4_C_SYSTEM_CARD, CP_FINAL_SYSTEM_CARD };
export { validateSystemCard, SYSTEM_CARD_SECTION_NAMES, OWASP_LLM_IDS } from "../system-card-schema";
export type { SystemCard, OwaspLlmId, OwaspThreatControl, IncidentSeverity, IncidentSeverityRow, RegulatoryMappingEntry, GovernanceRole, AuditEntry, SystemCardValidationResult } from "../system-card-schema";

/** Map of capstoneId → SystemCard. */
export const SYSTEM_CARDS: Record<string, SystemCard> = {
  "CP-N4-C": CP_N4_C_SYSTEM_CARD,
  "CP-FINAL": CP_FINAL_SYSTEM_CARD,
};

/** Lookup helper — throws if the capstone has no system card yet. */
export function getSystemCard(capstoneId: string): SystemCard {
  const card = SYSTEM_CARDS[capstoneId];
  if (!card) {
    throw new Error(`No system card for capstone ${capstoneId}`);
  }
  return card;
}

/** All capstone IDs that currently have a system card. */
export const SYSTEM_CARD_CAPSTONE_IDS = Object.keys(SYSTEM_CARDS);
