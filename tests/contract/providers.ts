// PyArcana — in-process contract-test provider stubs (Gap D).
//
// Twelve lightweight provider stubs — one per FINAL_INTERFACES entry. Each
// stub takes a request, validates it against the contract request schema, and
// returns a deterministic synthetic response derived from the shared
// synthetic-scenario.json fixture. No live server, no network.
//
// Each stub also stamps the shared traceId into the response so the
// end-to-end trace test can assert one traceId spans all twelve calls.
//
// The mlplatform stub additionally exposes a `rollback(rollback_target)`
// helper that restores the prior scenario snapshot — used by the
// backup/restore/rollback test.

import { CONTRACTS, validateAgainstSchema, type Contract, type JsonSchema } from "./contracts";
import scenario from "./synthetic-scenario.json";

export interface ProviderResponse<T = unknown> {
  status: number;
  body: T;
  traceId: string;
  error?: string;
}

export type Provider = (
  request: unknown,
  ctx?: { traceId?: string; scenario?: typeof scenario },
) => ProviderResponse;

const TRACE_ID = scenario.shared_trace_id as string;

function ok<T>(body: T, traceId: string = TRACE_ID): ProviderResponse<T> {
  return { status: 200, body, traceId };
}

function bad(error: string, traceId: string = TRACE_ID): ProviderResponse {
  return { status: 400, body: { error }, traceId, error };
}

function validateRequest(req: unknown, schema: JsonSchema): string | null {
  return validateAgainstSchema(req, schema);
}

// ─────────────────────────── 1. intake.ingest ───────────────────────────

const intakeProvider: Provider = (req, ctx = {}) => {
  const c = ctx.scenario ?? scenario;
  const contract = CONTRACTS[0];
  const err = validateRequest(req, contract.requestSchema);
  if (err) return bad(`intake.ingest: ${err}`);
  const r = req as { records: { record_id: string }[] };
  return ok({
    accepted: r.records.map((x) => x.record_id),
    rejected: [],
    review: [],
  }, ctx.traceId ?? TRACE_ID);
};

// ─────────────────────────── 2. etl.run ───────────────────────────

const etlProvider: Provider = (req, ctx = {}) => {
  const c = ctx.scenario ?? scenario;
  const contract = CONTRACTS[1];
  const err = validateRequest(req, contract.requestSchema);
  if (err) return bad(`etl.run: ${err}`);
  return ok({
    manifest: c.etl.manifest,
    outputs: c.etl.outputs,
    quarantined: c.etl.quarantined,
  }, ctx.traceId ?? TRACE_ID);
};

// ─────────────────────────── 3. familiarity.review ───────────────────────────

const familiarityProvider: Provider = (req, ctx = {}) => {
  const c = ctx.scenario ?? scenario;
  const contract = CONTRACTS[2];
  const err = validateRequest(req, contract.requestSchema);
  if (err) return bad(`familiarity.review: ${err}`);
  const r = req as { pair_id: string };
  if (r.pair_id !== c.familiarity.pair_id) {
    return ok({
      er: { confidence: 0.0 },
      relationship: "unknown",
      risk: "unknown",
      provenance: [],
    }, ctx.traceId ?? TRACE_ID);
  }
  return ok({
    er: { confidence: c.familiarity.er_confidence },
    relationship: c.familiarity.relationship_type,
    risk: c.familiarity.risk_band,
    provenance: c.familiarity.provenance,
  }, ctx.traceId ?? TRACE_ID);
};

// ─────────────────────────── 4. eda.profile ───────────────────────────

const edaProvider: Provider = (req, ctx = {}) => {
  const c = ctx.scenario ?? scenario;
  const contract = CONTRACTS[3];
  const err = validateRequest(req, contract.requestSchema);
  if (err) return bad(`eda.profile: ${err}`);
  return ok({
    dictionary: c.eda.dictionary,
    missingness: c.eda.missingness,
    distributions: c.eda.distributions,
  }, ctx.traceId ?? TRACE_ID);
};

// ─────────────────────────── 5. reporting.render ───────────────────────────

const reportingProvider: Provider = (req, ctx = {}) => {
  const c = ctx.scenario ?? scenario;
  const contract = CONTRACTS[4];
  const err = validateRequest(req, contract.requestSchema);
  if (err) return bad(`reporting.render: ${err}`);
  return ok({
    pdf: c.reporting.pdf,
    claims: c.reporting.claims,
  }, ctx.traceId ?? TRACE_ID);
};

// ─────────────────────────── 6. automation.run ───────────────────────────

const automationProvider: Provider = (req, ctx = {}) => {
  const c = ctx.scenario ?? scenario;
  const contract = CONTRACTS[5];
  const err = validateRequest(req, contract.requestSchema);
  if (err) return bad(`automation.run: ${err}`);
  return ok({
    run_id: c.automation.run_id,
    audit: c.automation.audit,
    approval_required: c.automation.approval_required,
  }, ctx.traceId ?? TRACE_ID);
};

// ─────────────────────────── 7. er.resolve ───────────────────────────

const erProvider: Provider = (req, ctx = {}) => {
  const c = ctx.scenario ?? scenario;
  const contract = CONTRACTS[6];
  const err = validateRequest(req, contract.requestSchema);
  if (err) return bad(`er.resolve: ${err}`);
  return ok({
    clusters: c.er.clusters,
    ambiguous_queue: c.er.ambiguous_queue,
    metrics: c.er.metrics,
  }, ctx.traceId ?? TRACE_ID);
};

// ─────────────────────────── 8. relationship.graph ───────────────────────────

const relationshipProvider: Provider = (req, ctx = {}) => {
  const c = ctx.scenario ?? scenario;
  const contract = CONTRACTS[7];
  const err = validateRequest(req, contract.requestSchema);
  if (err) return bad(`relationship.graph: ${err}`);
  return ok({
    graph: c.relationship.graph,
    paths: c.relationship.paths,
    edges_meta: c.relationship.edges_meta,
  }, ctx.traceId ?? TRACE_ID);
};

// ─────────────────────────── 9. triage.score ───────────────────────────

const triageProvider: Provider = (req, ctx = {}) => {
  const c = ctx.scenario ?? scenario;
  const contract = CONTRACTS[8];
  const err = validateRequest(req, contract.requestSchema);
  if (err) return bad(`triage.score: ${err}`);
  return ok({
    score: c.triage.score,
    calibrated_prob: c.triage.calibrated_prob,
    abstain: c.triage.abstain,
    model_card_ref: c.triage.model_card_ref,
  }, ctx.traceId ?? TRACE_ID);
};

// ─────────────────────────── 10. service.api (POST /service/v1/score) ───────────────────────────

const serviceProvider: Provider = (req, ctx = {}) => {
  const c = ctx.scenario ?? scenario;
  const contract = CONTRACTS[9];
  const err = validateRequest(req, contract.requestSchema);
  if (err) return bad(`service.api: ${err}`);
  return ok({
    case_id: c.triage.case.case_id,
    score: c.triage.score,
    rate_limit_remaining: c.service.rate_limit_remaining,
    healthz: c.service.healthz,
    readyz: c.service.readyz,
  }, ctx.traceId ?? TRACE_ID);
};

// ─────────────────────────── 11. mlplatform.deploy (+ rollback) ───────────────────────────

export interface MlplatformDeployResponse {
  deployment_id: string;
  slo: Record<string, unknown>;
  rollback_target: string;
}

const mlplatformProvider: Provider = (req, ctx = {}) => {
  const c = ctx.scenario ?? scenario;
  const contract = CONTRACTS[10];
  const err = validateRequest(req, contract.requestSchema);
  if (err) return bad(`mlplatform.deploy: ${err}`);
  return ok({
    deployment_id: c.mlplatform.deployment_id,
    slo: c.mlplatform.slo,
    rollback_target: c.mlplatform.rollback_target,
  } satisfies MlplatformDeployResponse, ctx.traceId ?? TRACE_ID);
};

/**
 * Restore the prior scenario snapshot by invoking the rollback_target
 * returned by mlplatform.deploy. Returns the restored state.
 */
export function mlplatformRollback(
  rollbackTarget: string,
  ctx: { traceId?: string; scenario?: typeof scenario } = {},
): { status: number; body: { restored_deployment_id: string; model_version: string }; traceId: string } {
  const c = ctx.scenario ?? scenario;
  if (rollbackTarget !== c.mlplatform.rollback_target) {
    return {
      status: 404,
      body: { restored_deployment_id: "", model_version: "" },
      traceId: ctx.traceId ?? TRACE_ID,
    };
  }
  return {
    status: 200,
    body: {
      restored_deployment_id: c.snapshot.prior_deployment_id,
      model_version: c.snapshot.prior_model_version,
    },
    traceId: ctx.traceId ?? TRACE_ID,
  };
}

// ─────────────────────────── 12. copilot.run ───────────────────────────

const copilotProvider: Provider = (req, ctx = {}) => {
  const c = ctx.scenario ?? scenario;
  const contract = CONTRACTS[11];
  const err = validateRequest(req, contract.requestSchema);
  if (err) return bad(`copilot.run: ${err}`);
  return ok({
    run_id: c.copilot.run_id,
    steps: c.copilot.steps,
    citations: c.copilot.citations,
    trace: c.copilot.trace,
    approval_status: c.copilot.approval_status,
  }, ctx.traceId ?? TRACE_ID);
};

// ─────────────────────────── registry ───────────────────────────

export const PROVIDERS: Record<string, Provider> = {
  "intake.ingest": intakeProvider,
  "etl.run": etlProvider,
  "familiarity.review": familiarityProvider,
  "eda.profile": edaProvider,
  "reporting.render": reportingProvider,
  "automation.run": automationProvider,
  "er.resolve": erProvider,
  "relationship.graph": relationshipProvider,
  "triage.score": triageProvider,
  "service.api": serviceProvider,
  "mlplatform.deploy": mlplatformProvider,
  "copilot.run": copilotProvider,
};

export function getProvider(interfaceName: string): Provider {
  const p = PROVIDERS[interfaceName];
  if (!p) throw new Error(`Unknown provider: ${interfaceName}`);
  return p;
}

export { scenario as SYNTHETIC_SCENARIO };
export { TRACE_ID as SHARED_TRACE_ID };

/** Build the canonical valid request for a given interface, sourced from the
 *  synthetic scenario. Used by the contract tests. */
export function canonicalRequest(interfaceName: string): unknown {
  const c = scenario as any;
  switch (interfaceName) {
    case "intake.ingest":
      return { records: c.intake.records };
    case "etl.run":
      return { source: c.etl.source, manifest: c.etl.manifest };
    case "familiarity.review":
      return { pair_id: c.familiarity.pair_id };
    case "eda.profile":
      return { dataset_version: c.eda.dataset_version };
    case "reporting.render":
      return { template: c.reporting.template, data: c.reporting.data };
    case "automation.run":
      return { input: c.automation.input, dry_run: c.automation.dry_run };
    case "er.resolve":
      return { records: c.er.records };
    case "relationship.graph":
      return { entities: c.relationship.entities, evidence: c.relationship.evidence };
    case "triage.score":
      return { case: c.triage.case };
    case "service.api":
      return { authz_subject: c.service.authz_subject, case: c.triage.case };
    case "mlplatform.deploy":
      return { model_version: c.mlplatform.model_version, strategy: c.mlplatform.strategy };
    case "copilot.run":
      return { task: c.copilot.task, provider_mode: c.copilot.provider_mode, budget: c.copilot.budget };
    default:
      throw new Error(`No canonical request for ${interfaceName}`);
  }
}

/** A request that is missing a required field, for the negative contract test. */
export function invalidRequest(interfaceName: string): unknown {
  switch (interfaceName) {
    case "intake.ingest":
      return {}; // missing records
    case "etl.run":
      return {}; // missing source
    case "familiarity.review":
      return {}; // missing pair_id
    case "eda.profile":
      return {}; // missing dataset_version
    case "reporting.render":
      return { template: "x" }; // missing data
    case "automation.run":
      return { input: {} }; // missing dry_run
    case "er.resolve":
      return {}; // missing records
    case "relationship.graph":
      return { entities: [] }; // missing evidence
    case "triage.score":
      return {}; // missing case
    case "service.api":
      return { case: {} }; // missing authz_subject
    case "mlplatform.deploy":
      return { model_version: "x" }; // missing strategy
    case "copilot.run":
      return { task: "x", budget: {} }; // missing provider_mode
    default:
      throw new Error(`No invalid request template for ${interfaceName}`);
  }
}

export type { Contract };
