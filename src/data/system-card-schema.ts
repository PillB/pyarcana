// PyArcana — System Card schema (Gap C).
//
// Canonical 14-section template synthesised from:
//   - EU AI Act Annex IV (technical documentation for high-risk AI systems)
//   - Anthropic Responsible Scaling Policy + Claude system card
//   - OpenAI GPT-4 system card
//   - OWASP LLM Top 10 (2025) controls mapping
//   - NIST AI 600-1 (generative AI risk profile, govern-map-measure-manage)
//
// Used by CP-N4-C (the multi-agent harness) and CP-FINAL (the transversal
// integration capstone that aggregates the twelve upstream subsystems).
//
// Invariants enforced by validateSystemCard():
//   - all 14 sections present
//   - all 14 sections non-empty
//   - threat model matrix covers all 10 OWASP LLM risks (LLM01..LLM10)
//   - regulatory mapping cross-references EU AI Act Annex IV

export type OwaspLlmId =
  | "LLM01"
  | "LLM02"
  | "LLM03"
  | "LLM04"
  | "LLM05"
  | "LLM06"
  | "LLM07"
  | "LLM08"
  | "LLM09"
  | "LLM10";

/** One row of the OWASP LLM Top 10 → controls matrix. */
export interface OwaspThreatControl {
  id: OwaspLlmId;
  threat: string;
  controls: string[];
}

/** Severity band for the incident-response matrix. */
export type IncidentSeverity = "SEV-1" | "SEV-2" | "SEV-3" | "SEV-4";

export interface IncidentSeverityRow {
  severity: IncidentSeverity;
  definition: string;
  responseSla: string;
  escalation: string;
}

/** One entry of the regulatory mapping (EU AI Act Annex IV cross-reference). */
export interface RegulatoryMappingEntry {
  annexIvSection: string;   // e.g. "1(a) description of intended purpose"
  systemCardSection: keyof SystemCard;
  evidence: string;
}

export interface GovernanceRole {
  role: string;
  responsibilities: string[];
}

export interface AuditEntry {
  timestamp: string;     // ISO 8601
  actor: string;
  action: string;
  artifactRef: string;
}

/** The canonical 14-section system card. */
export interface SystemCard {
  capstoneId: string;            // e.g. "CP-N4-C" or "CP-FINAL"
  version: string;               // semver — matches the capstone version
  publishedAt: string;           // ISO 8601
  owner: string;                 // capstone owner / accountable role
  /** 1. Executive summary — purpose, scope, capabilities, and at-a-glance risk posture. */
  summary: string;
  /** 2. Intended use — what the system is designed to do, who it serves, in what context. */
  intendedUse: string;
  /** 3. Out of scope — explicit prohibitions and non-uses. */
  outOfScope: string;
  /** 4. Architecture — components, data flow, model adapters, retrieval, tools, budgets, approval gates, tracing. */
  architecture: string;
  /** 5. Evaluation — metrics, SLOs, holdouts, red-team results, calibration. */
  evaluation: string;
  /** 6. Ethical considerations — fairness, dual-use, environmental, labour-displacement. */
  ethicalConsiderations: string;
  /** 7. Threat model — OWASP LLM Top 10 (LLM01..LLM10) → controls matrix. */
  threatModel: {
    overview: string;
    matrix: OwaspThreatControl[];
  };
  /** 8. Governance — approval gates, RACI, versioning, change-control. */
  governance: {
    overview: string;
    approvalGates: string[];
    raci: GovernanceRole[];
  };
  /** 9. Incident response — severity matrix, runbook, on-call, comms. */
  incidentResponse: {
    overview: string;
    severityMatrix: IncidentSeverityRow[];
    runbook: string[];
  };
  /** 10. Rollback and recovery — last-known-good, drill cadence, RTO/RPO. */
  rollbackRecovery: {
    overview: string;
    lastKnownGood: string;
    drillCadence: string;
    rtoRpo: string;
  };
  /** 11. Audit history — append-only trail of card changes. */
  auditHistory: {
    overview: string;
    entries: AuditEntry[];
  };
  /** 12. Correction and appeal — how affected users contest decisions. */
  correctionAppeal: {
    overview: string;
    sla: string;
    channel: string;
  };
  /** 13. No-go conditions — concrete, measurable stop conditions. */
  noGoConditions: string[];
  /** 14. Regulatory mapping — EU AI Act Annex IV cross-reference. */
  regulatoryMapping: {
    overview: string;
    entries: RegulatoryMappingEntry[];
  };
}

const OWASP_REQUIRED: OwaspLlmId[] = [
  "LLM01", "LLM02", "LLM03", "LLM04", "LLM05",
  "LLM06", "LLM07", "LLM08", "LLM09", "LLM10",
];

const SECTION_KEYS: (keyof SystemCard)[] = [
  "summary",
  "intendedUse",
  "outOfScope",
  "architecture",
  "evaluation",
  "ethicalConsiderations",
  "threatModel",
  "governance",
  "incidentResponse",
  "rollbackRecovery",
  "auditHistory",
  "correctionAppeal",
  "noGoConditions",
  "regulatoryMapping",
];

export interface SystemCardValidationResult {
  valid: boolean;
  errors: string[];
}

function nonEmptyString(s: unknown): s is string {
  return typeof s === "string" && s.trim().length > 0;
}

function nonEmptyArray(a: unknown): a is unknown[] {
  return Array.isArray(a) && a.length > 0;
}

/**
 * Validate that a SystemCard has all 14 sections present and non-empty.
 * Also verifies the OWASP matrix completeness and Annex IV cross-reference.
 */
export function validateSystemCard(card: unknown): SystemCardValidationResult {
  const errors: string[] = [];
  if (!card || typeof card !== "object") {
    return { valid: false, errors: ["system card is not an object"] };
  }
  const c = card as Record<string, unknown>;

  // Required scalar-string sections (sections 1..6).
  const stringSections: (keyof SystemCard)[] = [
    "summary", "intendedUse", "outOfScope", "architecture",
    "evaluation", "ethicalConsiderations",
  ];
  for (const k of stringSections) {
    if (!nonEmptyString(c[k])) {
      errors.push(`section '${k}' is missing or empty`);
    }
  }

  // Card-level metadata.
  if (!nonEmptyString(c.capstoneId)) errors.push("capstoneId is missing or empty");
  if (!nonEmptyString(c.version)) errors.push("version is missing or empty");
  if (!nonEmptyString(c.publishedAt)) errors.push("publishedAt is missing or empty");
  if (!nonEmptyString(c.owner)) errors.push("owner is missing or empty");

  // Section 7 — threatModel.
  if (!c.threatModel || typeof c.threatModel !== "object") {
    errors.push("section 'threatModel' is missing");
  } else {
    const tm = c.threatModel as Record<string, unknown>;
    if (!nonEmptyString(tm.overview)) {
      errors.push("threatModel.overview is missing or empty");
    }
    if (!nonEmptyArray(tm.matrix)) {
      errors.push("threatModel.matrix is missing or empty");
    } else {
      const ids = new Set<string>();
      for (const row of tm.matrix as unknown[]) {
        if (!row || typeof row !== "object") {
          errors.push("threatModel.matrix row is not an object");
          continue;
        }
        const r = row as Record<string, unknown>;
        if (!nonEmptyString(r.id)) {
          errors.push("threatModel.matrix row missing id");
          continue;
        }
        ids.add(r.id as string);
        if (!nonEmptyString(r.threat)) {
          errors.push(`threatModel.matrix row ${r.id} missing threat description`);
        }
        if (!nonEmptyArray(r.controls) || !(r.controls as unknown[]).every(nonEmptyString)) {
          errors.push(`threatModel.matrix row ${r.id} has missing/empty controls`);
        }
      }
      for (const required of OWASP_REQUIRED) {
        if (!ids.has(required)) {
          errors.push(`threatModel.matrix missing OWASP risk ${required}`);
        }
      }
    }
  }

  // Section 8 — governance.
  if (!c.governance || typeof c.governance !== "object") {
    errors.push("section 'governance' is missing");
  } else {
    const g = c.governance as Record<string, unknown>;
    if (!nonEmptyString(g.overview)) errors.push("governance.overview is missing or empty");
    if (!nonEmptyArray(g.approvalGates) || !(g.approvalGates as unknown[]).every(nonEmptyString)) {
      errors.push("governance.approvalGates missing or contains empty entries");
    }
    if (!nonEmptyArray(g.raci)) {
      errors.push("governance.raci is missing or empty");
    }
  }

  // Section 9 — incidentResponse.
  if (!c.incidentResponse || typeof c.incidentResponse !== "object") {
    errors.push("section 'incidentResponse' is missing");
  } else {
    const ir = c.incidentResponse as Record<string, unknown>;
    if (!nonEmptyString(ir.overview)) errors.push("incidentResponse.overview is missing or empty");
    if (!nonEmptyArray(ir.severityMatrix)) {
      errors.push("incidentResponse.severityMatrix is missing or empty");
    }
    if (!nonEmptyArray(ir.runbook) || !(ir.runbook as unknown[]).every(nonEmptyString)) {
      errors.push("incidentResponse.runbook missing or contains empty entries");
    }
  }

  // Section 10 — rollbackRecovery.
  if (!c.rollbackRecovery || typeof c.rollbackRecovery !== "object") {
    errors.push("section 'rollbackRecovery' is missing");
  } else {
    const rr = c.rollbackRecovery as Record<string, unknown>;
    if (!nonEmptyString(rr.overview)) errors.push("rollbackRecovery.overview is missing or empty");
    if (!nonEmptyString(rr.lastKnownGood)) errors.push("rollbackRecovery.lastKnownGood is missing or empty");
    if (!nonEmptyString(rr.drillCadence)) errors.push("rollbackRecovery.drillCadence is missing or empty");
    if (!nonEmptyString(rr.rtoRpo)) errors.push("rollbackRecovery.rtoRpo is missing or empty");
  }

  // Section 11 — auditHistory.
  if (!c.auditHistory || typeof c.auditHistory !== "object") {
    errors.push("section 'auditHistory' is missing");
  } else {
    const ah = c.auditHistory as Record<string, unknown>;
    if (!nonEmptyString(ah.overview)) errors.push("auditHistory.overview is missing or empty");
    if (!nonEmptyArray(ah.entries)) {
      errors.push("auditHistory.entries is missing or empty");
    }
  }

  // Section 12 — correctionAppeal.
  if (!c.correctionAppeal || typeof c.correctionAppeal !== "object") {
    errors.push("section 'correctionAppeal' is missing");
  } else {
    const ca = c.correctionAppeal as Record<string, unknown>;
    if (!nonEmptyString(ca.overview)) errors.push("correctionAppeal.overview is missing or empty");
    if (!nonEmptyString(ca.sla)) errors.push("correctionAppeal.sla is missing or empty");
    if (!nonEmptyString(ca.channel)) errors.push("correctionAppeal.channel is missing or empty");
  }

  // Section 13 — noGoConditions (string[]).
  if (!nonEmptyArray(c.noGoConditions) || !(c.noGoConditions as unknown[]).every(nonEmptyString)) {
    errors.push("section 'noGoConditions' is missing, empty, or contains empty entries");
  }

  // Section 14 — regulatoryMapping.
  if (!c.regulatoryMapping || typeof c.regulatoryMapping !== "object") {
    errors.push("section 'regulatoryMapping' is missing");
  } else {
    const rm = c.regulatoryMapping as Record<string, unknown>;
    if (!nonEmptyString(rm.overview)) errors.push("regulatoryMapping.overview is missing or empty");
    if (!nonEmptyArray(rm.entries)) {
      errors.push("regulatoryMapping.entries is missing or empty");
    } else {
      const annexIvRefs = (rm.entries as unknown[]).filter(
        (e) => e && typeof e === "object" && /annex\s*iv/i.test(JSON.stringify(e)),
      );
      if (annexIvRefs.length === 0) {
        errors.push("regulatoryMapping.entries does not cross-reference Annex IV");
      }
    }
  }

  // Cross-check: all 14 top-level keys present.
  for (const k of SECTION_KEYS) {
    if (!(k in c)) {
      errors.push(`top-level section '${k}' is absent`);
    }
  }

  return { valid: errors.length === 0, errors };
}

export const SYSTEM_CARD_SECTION_NAMES = SECTION_KEYS;
export const OWASP_LLM_IDS = OWASP_REQUIRED;
