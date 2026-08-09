// PyArcana — CP-FINAL contract definitions (Gap D).
//
// Twelve consumer-driven contract expectations, one per FINAL_INTERFACES entry.
// Each contract pins: method, path (versioned /v1/), a JSON-Schema subset for
// the request, and a JSON-Schema subset for the response. The schemas are
// intentionally narrow (required fields + types) — they are sufficient for
// the in-process provider stubs (providers.ts) to validate inputs and to
// assert that outputs conform.
//
// Pattern: Pact JS consumer-driven contracts, but with no live broker and no
// network — the stubs are in-process and deterministic. Backward compatibility
// is enforced by the version-compat test (every path contains /v1/) and by
// the additive-only policy encoded in the CP-FINAL system card.

export type JsonType = "string" | "number" | "integer" | "boolean" | "object" | "array" | "null";

/** A minimal JSON-Schema subset sufficient for contract validation. */
export interface JsonSchema {
  type?: JsonType;
  properties?: Record<string, JsonSchema>;
  required?: string[];
  items?: JsonSchema;
  enum?: unknown[];
  additionalProperties?: boolean;
}

export interface Contract {
  capstoneId: string;
  interfaceName: string;
  method: "GET" | "POST";
  path: string;             // e.g. "/intake/v1/ingest"
  version: string;          // e.g. "v1"
  requestSchema: JsonSchema;
  responseSchema: JsonSchema;
}

// ─────────────────────────── 1. intake.ingest (CP-N1-A) ───────────────────────────

const intakeContract: Contract = {
  capstoneId: "CP-N1-A",
  interfaceName: "intake.ingest",
  method: "POST",
  path: "/intake/v1/ingest",
  version: "v1",
  requestSchema: {
    type: "object",
    required: ["records"],
    properties: {
      records: {
        type: "array",
        items: {
          type: "object",
          required: ["record_id", "client_id", "kind"],
          properties: {
            record_id: { type: "string" },
            client_id: { type: "string" },
            kind: { type: "string" },
            amount: { type: "number" },
            currency: { type: "string" },
            counterparty: { type: "string" },
            occurred_at: { type: "string" },
          },
        },
      },
    },
  },
  responseSchema: {
    type: "object",
    required: ["accepted", "rejected", "review"],
    properties: {
      accepted: { type: "array", items: { type: "string" } },
      rejected: { type: "array", items: { type: "string" } },
      review: { type: "array", items: { type: "string" } },
    },
  },
};

// ─────────────────────────── 2. etl.run (CP-N1-B) ───────────────────────────

const etlContract: Contract = {
  capstoneId: "CP-N1-B",
  interfaceName: "etl.run",
  method: "POST",
  path: "/etl/v1/run",
  version: "v1",
  requestSchema: {
    type: "object",
    required: ["source"],
    properties: {
      source: { type: "string" },
      manifest: { type: "object" },
    },
  },
  responseSchema: {
    type: "object",
    required: ["manifest", "outputs", "quarantined"],
    properties: {
      manifest: { type: "object" },
      outputs: { type: "array", items: { type: "object" } },
      quarantined: { type: "array", items: { type: "object" } },
    },
  },
};

// ─────────────────────────── 3. familiarity.review (CP-N1-C) ───────────────────────────

const familiarityContract: Contract = {
  capstoneId: "CP-N1-C",
  interfaceName: "familiarity.review",
  method: "GET",
  path: "/familiarity/v1/evidence",
  version: "v1",
  requestSchema: {
    type: "object",
    required: ["pair_id"],
    properties: {
      pair_id: { type: "string" },
    },
  },
  responseSchema: {
    type: "object",
    required: ["er", "relationship", "risk", "provenance"],
    properties: {
      er: { type: "object" },
      relationship: { type: "string" },
      risk: { type: "string" },
      provenance: { type: "array", items: { type: "string" } },
    },
  },
};

// ─────────────────────────── 4. eda.profile (CP-N2-A) ───────────────────────────

const edaContract: Contract = {
  capstoneId: "CP-N2-A",
  interfaceName: "eda.profile",
  method: "POST",
  path: "/eda/v1/profile",
  version: "v1",
  requestSchema: {
    type: "object",
    required: ["dataset_version"],
    properties: {
      dataset_version: { type: "string" },
    },
  },
  responseSchema: {
    type: "object",
    required: ["dictionary", "missingness", "distributions"],
    properties: {
      dictionary: { type: "array", items: { type: "object" } },
      missingness: { type: "object" },
      distributions: { type: "array", items: { type: "object" } },
    },
  },
};

// ─────────────────────────── 5. reporting.render (CP-N2-B) ───────────────────────────

const reportingContract: Contract = {
  capstoneId: "CP-N2-B",
  interfaceName: "reporting.render",
  method: "POST",
  path: "/reporting/v1/render",
  version: "v1",
  requestSchema: {
    type: "object",
    required: ["template", "data"],
    properties: {
      template: { type: "string" },
      data: { type: "object" },
    },
  },
  responseSchema: {
    type: "object",
    required: ["pdf", "claims"],
    properties: {
      pdf: { type: "string" },
      claims: { type: "array", items: { type: "string" } },
    },
  },
};

// ─────────────────────────── 6. automation.run (CP-N2-C) ───────────────────────────

const automationContract: Contract = {
  capstoneId: "CP-N2-C",
  interfaceName: "automation.run",
  method: "POST",
  path: "/automation/v1/run",
  version: "v1",
  requestSchema: {
    type: "object",
    required: ["input", "dry_run"],
    properties: {
      input: { type: "object" },
      dry_run: { type: "boolean" },
    },
  },
  responseSchema: {
    type: "object",
    required: ["run_id", "audit", "approval_required"],
    properties: {
      run_id: { type: "string" },
      audit: { type: "array", items: { type: "string" } },
      approval_required: { type: "boolean" },
    },
  },
};

// ─────────────────────────── 7. er.resolve (CP-N3-A) ───────────────────────────

const erContract: Contract = {
  capstoneId: "CP-N3-A",
  interfaceName: "er.resolve",
  method: "POST",
  path: "/er/v1/resolve",
  version: "v1",
  requestSchema: {
    type: "object",
    required: ["records"],
    properties: {
      records: { type: "array", items: { type: "object" } },
    },
  },
  responseSchema: {
    type: "object",
    required: ["clusters", "ambiguous_queue", "metrics"],
    properties: {
      clusters: { type: "array", items: { type: "object" } },
      ambiguous_queue: { type: "array", items: { type: "object" } },
      metrics: { type: "object" },
    },
  },
};

// ─────────────────────────── 8. relationship.graph (CP-N3-B) ───────────────────────────

const relationshipContract: Contract = {
  capstoneId: "CP-N3-B",
  interfaceName: "relationship.graph",
  method: "POST",
  path: "/relationship/v1/graph",
  version: "v1",
  requestSchema: {
    type: "object",
    required: ["entities", "evidence"],
    properties: {
      entities: { type: "array", items: { type: "string" } },
      evidence: { type: "array", items: { type: "string" } },
    },
  },
  responseSchema: {
    type: "object",
    required: ["graph", "paths", "edges_meta"],
    properties: {
      graph: { type: "object" },
      paths: { type: "array", items: { type: "array", items: { type: "string" } } },
      edges_meta: { type: "array", items: { type: "object" } },
    },
  },
};

// ─────────────────────────── 9. triage.score (CP-N3-C) ───────────────────────────

const triageContract: Contract = {
  capstoneId: "CP-N3-C",
  interfaceName: "triage.score",
  method: "POST",
  path: "/triage/v1/score",
  version: "v1",
  requestSchema: {
    type: "object",
    required: ["case"],
    properties: {
      case: { type: "object" },
    },
  },
  responseSchema: {
    type: "object",
    required: ["score", "calibrated_prob", "abstain", "model_card_ref"],
    properties: {
      score: { type: "number" },
      calibrated_prob: { type: "number" },
      abstain: { type: "boolean" },
      model_card_ref: { type: "string" },
    },
  },
};

// ─────────────────────────── 10. service.api (CP-N4-A) ───────────────────────────
// CP-N4-A exposes REST /service/v1/{ingest,resolve,score} with authz, rate limits,
// /healthz, /readyz. The canonical contract tested here is /service/v1/score.

const serviceContract: Contract = {
  capstoneId: "CP-N4-A",
  interfaceName: "service.api",
  method: "POST",
  path: "/service/v1/score",
  version: "v1",
  requestSchema: {
    type: "object",
    required: ["authz_subject", "case"],
    properties: {
      authz_subject: { type: "string" },
      case: { type: "object" },
    },
  },
  responseSchema: {
    type: "object",
    required: ["case_id", "score", "rate_limit_remaining", "healthz", "readyz"],
    properties: {
      case_id: { type: "string" },
      score: { type: "number" },
      rate_limit_remaining: { type: "integer" },
      healthz: { type: "string" },
      readyz: { type: "string" },
    },
  },
};

// ─────────────────────────── 11. mlplatform.deploy (CP-N4-B) ───────────────────────────

const mlplatformContract: Contract = {
  capstoneId: "CP-N4-B",
  interfaceName: "mlplatform.deploy",
  method: "POST",
  path: "/mlplatform/v1/deploy",
  version: "v1",
  requestSchema: {
    type: "object",
    required: ["model_version", "strategy"],
    properties: {
      model_version: { type: "string" },
      strategy: { type: "string" },
    },
  },
  responseSchema: {
    type: "object",
    required: ["deployment_id", "slo", "rollback_target"],
    properties: {
      deployment_id: { type: "string" },
      slo: { type: "object" },
      rollback_target: { type: "string" },
    },
  },
};

// ─────────────────────────── 12. copilot.run (CP-N4-C) ───────────────────────────

const copilotContract: Contract = {
  capstoneId: "CP-N4-C",
  interfaceName: "copilot.run",
  method: "POST",
  path: "/copilot/v1/run",
  version: "v1",
  requestSchema: {
    type: "object",
    required: ["task", "provider_mode", "budget"],
    properties: {
      task: { type: "string" },
      provider_mode: { type: "string", enum: ["no-key", "local", "commercial-test", "commercial-approved"] },
      budget: { type: "object" },
    },
  },
  responseSchema: {
    type: "object",
    required: ["run_id", "steps", "citations", "trace", "approval_status"],
    properties: {
      run_id: { type: "string" },
      steps: { type: "array", items: { type: "string" } },
      citations: { type: "array", items: { type: "string" } },
      trace: { type: "string" },
      approval_status: { type: "string" },
    },
  },
};

export const CONTRACTS: Contract[] = [
  intakeContract,
  etlContract,
  familiarityContract,
  edaContract,
  reportingContract,
  automationContract,
  erContract,
  relationshipContract,
  triageContract,
  serviceContract,
  mlplatformContract,
  copilotContract,
];

export function getContract(interfaceName: string): Contract {
  const c = CONTRACTS.find((x) => x.interfaceName === interfaceName);
  if (!c) throw new Error(`Unknown interface: ${interfaceName}`);
  return c;
}

/** Minimal JSON-Schema validator (subset). Returns the first missing-required
 *  field name, or null if the value conforms. */
export function validateAgainstSchema(value: unknown, schema: JsonSchema): string | null {
  if (schema.type) {
    const t = Array.isArray(value) ? "array" : value === null ? "null" : typeof value;
    const expected = schema.type;
    // Loosen: javascript 'number' covers 'integer'.
    if (t !== expected && !(expected === "integer" && t === "number" && Number.isInteger(value))) {
      return `type mismatch (expected ${expected}, got ${t})`;
    }
  }
  if (schema.type === "object" && typeof value === "object" && value !== null && !Array.isArray(value)) {
    const obj = value as Record<string, unknown>;
    if (schema.required) {
      for (const r of schema.required) {
        if (!(r in obj)) return `missing required field: ${r}`;
      }
    }
    if (schema.properties) {
      for (const [k, sub] of Object.entries(schema.properties)) {
        if (k in obj) {
          const subErr = validateAgainstSchema(obj[k], sub);
          if (subErr) return `field '${k}': ${subErr}`;
        }
      }
    }
  }
  if (schema.type === "array" && Array.isArray(value)) {
    if (schema.items) {
      for (let i = 0; i < value.length; i++) {
        const subErr = validateAgainstSchema(value[i], schema.items);
        if (subErr) return `index ${i}: ${subErr}`;
      }
    }
  }
  if (schema.enum && !schema.enum.includes(value)) {
    return `value not in enum (${JSON.stringify(schema.enum)})`;
  }
  return null;
}
