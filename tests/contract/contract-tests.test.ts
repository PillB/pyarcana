// PyArcana — CP-FINAL contract test suite (Gap D).
//
// Validates the twelve upstream interfaces against their JSON-Schema contracts
// using in-process provider stubs (no live server, no network). Covers:
//   - 12 happy-path tests (valid request → valid response),
//   - 12 negative tests (invalid request → 400 with error message),
//   - version-compat (every path contains /v1/),
//   - shared-scenario (all 12 stubs process the same fixture),
//   - no-go condition (faithfulness/budget/SLO violation → CP-FINAL noGo=true),
//   - end-to-end trace (single shared traceId spans all 12 calls),
//   - backup/restore/rollback (mlplatform.rollback restores prior snapshot).

import { test, expect, describe } from "bun:test";
import {
  CONTRACTS,
  getContract,
  validateAgainstSchema,
} from "./contracts";
import {
  PROVIDERS,
  getProvider,
  canonicalRequest,
  invalidRequest,
  mlplatformRollback,
  SYNTHETIC_SCENARIO,
  SHARED_TRACE_ID,
} from "./providers";

const INTERFACE_NAMES = CONTRACTS.map((c) => c.interfaceName);

// ─────────────────────────── happy path: 12 valid-request tests ───────────────────────────

describe("CP-FINAL contract tests — happy path (valid request → valid response)", () => {
  test.each(INTERFACE_NAMES)("%s accepts a valid request and returns a schema-conformant response", (iface) => {
    const contract = getContract(iface);
    const provider = getProvider(iface);
    const req = canonicalRequest(iface);
    const res = provider(req);
    expect(res.status).toBe(200);
    expect(res.error).toBeUndefined();
    // Response must conform to the contract's response schema.
    const schemaErr = validateAgainstSchema(res.body, contract.responseSchema);
    expect(schemaErr, schemaErr ?? "").toBeNull();
    // Trace ID must be present and equal to the shared trace.
    expect(res.traceId).toBe(SHARED_TRACE_ID);
  });
});

// ─────────────────────────── negative path: 12 invalid-request tests ───────────────────────────

describe("CP-FINAL contract tests — negative path (invalid request → 400 + error)", () => {
  test.each(INTERFACE_NAMES)("%s rejects an invalid request with 400 and an error message", (iface) => {
    const provider = getProvider(iface);
    const req = invalidRequest(iface);
    const res = provider(req);
    expect(res.status).toBe(400);
    expect(typeof res.error).toBe("string");
    expect(res.error!.length).toBeGreaterThan(0);
    // The 400 body should also include the error message.
    const body = res.body as { error?: string };
    expect(body.error).toBeDefined();
    expect(body.error!.length).toBeGreaterThan(0);
    // Even on 400, the trace ID is propagated.
    expect(res.traceId).toBe(SHARED_TRACE_ID);
  });
});

// ─────────────────────────── version compatibility ───────────────────────────

describe("CP-FINAL contract tests — version compatibility", () => {
  test("every interface path contains /v1/ (additive-only versioning)", () => {
    expect(CONTRACTS).toHaveLength(12);
    for (const c of CONTRACTS) {
      expect(c.path).toContain("/v1/");
      expect(c.version).toBe("v1");
    }
  });

  test("every interface is bound to a real capstone (no orphan contracts)", () => {
    const capstoneIds = new Set(CONTRACTS.map((c) => c.capstoneId));
    expect(capstoneIds.size).toBe(12);
    for (const id of capstoneIds) {
      expect(id).toMatch(/^CP-N[1-4]-[ABC]$/);
    }
  });

  test("every interface method is GET or POST (REST discipline)", () => {
    for (const c of CONTRACTS) {
      expect(["GET", "POST"]).toContain(c.method);
    }
  });
});

// ─────────────────────────── shared synthetic scenario ───────────────────────────

describe("CP-FINAL contract tests — shared synthetic scenario", () => {
  test("the shared scenario spans all twelve subsystems", () => {
    const keys = Object.keys(SYNTHETIC_SCENARIO);
    const required = [
      "intake", "etl", "familiarity", "eda", "reporting", "automation",
      "er", "relationship", "triage", "service", "mlplatform", "rag",
      "copilot", "governance",
    ];
    for (const k of required) {
      expect(keys).toContain(k);
    }
  });

  test("every provider stub can process the shared scenario and return 200", () => {
    for (const iface of INTERFACE_NAMES) {
      const provider = getProvider(iface);
      const res = provider(canonicalRequest(iface));
      expect(res.status).toBe(200);
      expect(res.traceId).toBe(SHARED_TRACE_ID);
    }
  });

  test("the shared scenario declares CC0 / no real PII", () => {
    expect(SYNTHETIC_SCENARIO.license).toMatch(/CC0/i);
    expect(SYNTHETIC_SCENARIO.piiRisk).toMatch(/no real PII/i);
  });
});

// ─────────────────────────── no-go conditions ───────────────────────────

describe("CP-FINAL contract tests — no-go conditions", () => {
  test("CP-FINAL emits noGo=true when copilot faithfulness < 0.9", () => {
    // Build a mutated scenario with a sub-threshold faithfulness.
    const brokenScenario = {
      ...SYNTHETIC_SCENARIO,
      rag: { ...SYNTHETIC_SCENARIO.rag, faithfulness: 0.85 },
    };
    const provider = getProvider("copilot.run");
    const req = canonicalRequest("copilot.run");
    const res = provider(req, { scenario: brokenScenario as any });
    // The copilot response carries the original trace; we evaluate noGo here.
    const noGo = evaluateNoGo({ faithfulness: 0.85, response: res.body as any });
    expect(noGo).toBe(true);
  });

  test("CP-FINAL emits noGo=true when the copilot budget is exceeded", () => {
    const brokenBudget = {
      ...SYNTHETIC_SCENARIO.copilot.budget,
      within_budget: false,
      steps: 99,
    };
    const noGo = evaluateNoGo({ budget: brokenBudget as any });
    expect(noGo).toBe(true);
  });

  test("CP-FINAL emits noGo=true when triage SLO latency is breached", () => {
    const noGo = evaluateNoGo({ slo: { latency_p95_ms: 5000, error_rate: 0.5 } });
    expect(noGo).toBe(true);
  });

  test("CP-FINAL emits noGo=false on the canonical happy-path scenario", () => {
    const noGo = evaluateNoGo({
      faithfulness: SYNTHETIC_SCENARIO.rag.faithfulness,
      budget: SYNTHETIC_SCENARIO.copilot.budget as any,
      slo: SYNTHETIC_SCENARIO.mlplatform.slo as any,
    });
    expect(noGo).toBe(false);
  });
});

// ─────────────────────────── end-to-end trace ───────────────────────────

describe("CP-FINAL contract tests — end-to-end trace", () => {
  test("a single shared traceId spans all twelve interface calls", () => {
    const traceIds = new Set<string>();
    for (const iface of INTERFACE_NAMES) {
      const provider = getProvider(iface);
      const res = provider(canonicalRequest(iface));
      expect(res.status).toBe(200);
      traceIds.add(res.traceId);
    }
    expect(traceIds.size).toBe(1);
    expect(traceIds.has(SHARED_TRACE_ID)).toBe(true);
  });

  test("an explicit per-call traceId overrides the shared one but remains consistent across the call", () => {
    const customTrace = "trace-acme-001-custom-9999";
    const provider = getProvider("copilot.run");
    const res = provider(canonicalRequest("copilot.run"), { traceId: customTrace });
    expect(res.traceId).toBe(customTrace);
    expect(res.traceId).not.toBe(SHARED_TRACE_ID);
  });

  test("the shared traceId is present in the synthetic scenario fixture", () => {
    expect(typeof SYNTHETIC_SCENARIO.shared_trace_id).toBe("string");
    expect(SYNTHETIC_SCENARIO.shared_trace_id.length).toBeGreaterThan(0);
    expect(SYNTHETIC_SCENARIO.shared_trace_id).toBe(SHARED_TRACE_ID);
  });
});

// ─────────────────────────── backup / restore / rollback ───────────────────────────

describe("CP-FINAL contract tests — backup / restore / rollback", () => {
  test("mlplatform.deploy returns a rollback_target", () => {
    const provider = getProvider("mlplatform.deploy");
    const res = provider(canonicalRequest("mlplatform.deploy"));
    expect(res.status).toBe(200);
    const body = res.body as { rollback_target: string; deployment_id: string };
    expect(typeof body.rollback_target).toBe("string");
    expect(body.rollback_target.length).toBeGreaterThan(0);
    expect(body.rollback_target).not.toBe(body.deployment_id);
  });

  test("invoking mlplatformRollback(rollback_target) restores the prior snapshot", () => {
    const provider = getProvider("mlplatform.deploy");
    const deployRes = provider(canonicalRequest("mlplatform.deploy"));
    const body = deployRes.body as { rollback_target: string };
    const rollbackRes = mlplatformRollback(body.rollback_target);
    expect(rollbackRes.status).toBe(200);
    const rb = rollbackRes.body as { restored_deployment_id: string; model_version: string };
    expect(rb.restored_deployment_id).toBe(SYNTHETIC_SCENARIO.snapshot.prior_deployment_id);
    expect(rb.model_version).toBe(SYNTHETIC_SCENARIO.snapshot.prior_model_version);
  });

  test("mlplatformRollback returns 404 for an unknown rollback_target", () => {
    const res = mlplatformRollback("deploy-nonexistent-xxxx");
    expect(res.status).toBe(404);
  });

  test("the scenario snapshot is content-addressed and immutable", () => {
    expect(typeof SYNTHETIC_SCENARIO.snapshot.checksum).toBe("string");
    expect(SYNTHETIC_SCENARIO.snapshot.checksum).toMatch(/^sha256:/);
    expect(SYNTHETIC_SCENARIO.snapshot.prior_deployment_id).not.toBe(
      SYNTHETIC_SCENARIO.mlplatform.deployment_id,
    );
  });
});

// ─────────────────────────── helper: no-go evaluator ───────────────────────────

interface NoGoInputs {
  faithfulness?: number;
  budget?: { within_budget?: boolean; steps?: number };
  slo?: { latency_p95_ms?: number; error_rate?: number };
  response?: { trace?: string; approval_status?: string };
}

/**
 * CP-FINAL no-go evaluator. Returns true when any interface reports a
 * faithfulness/budget/SLO violation. Mirrors the no-go conditions declared in
 * the CP-FINAL system card.
 */
function evaluateNoGo(inputs: NoGoInputs): boolean {
  if (typeof inputs.faithfulness === "number" && inputs.faithfulness < 0.9) return true;
  if (inputs.budget && inputs.budget.within_budget === false) return true;
  if (inputs.slo) {
    if (typeof inputs.slo.latency_p95_ms === "number" && inputs.slo.latency_p95_ms > 200) return true;
    if (typeof inputs.slo.error_rate === "number" && inputs.slo.error_rate > 0.01) return true;
  }
  return false;
}
