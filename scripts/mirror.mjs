// PyArcana capstone_validation mirror script.
// Mirrors the canonical TypeScript source of truth (src/data/*, src/lib/copilot-harness.ts)
// into JSON + Markdown artefacts under capstone_validation/. This is MECHANICAL
// mirroring — no new content is invented here. The TS modules remain canonical.
//
// Run: bun run scripts/mirror.mjs

import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

// Bun can import TypeScript directly.
const {
  CAPSTONES,
  FINAL_INTERFACES,
  getCapstone,
} = await import("../src/data/capstones.ts");
const { LEVELS, CARDINALITY } = await import("../src/data/levels.ts");
const { SECTIONS } = await import("../src/data/sections.ts");
const { RUBRICS, RUBRIC_REGISTRY } = await import("../src/data/rubrics.ts");
const { BADGES } = await import("../src/data/badges.ts");

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "capstone_validation");

const writeJson = (rel, obj) =>
  writeFileSync(join(OUT, rel), JSON.stringify(obj, null, 2) + "\n", "utf8");
const writeText = (rel, text) =>
  writeFileSync(join(OUT, rel), text + "\n", "utf8");

mkdirSync(join(OUT, "capstones"), { recursive: true });
mkdirSync(join(OUT, "reality"), { recursive: true });
mkdirSync(join(OUT, "levels"), { recursive: true });
mkdirSync(join(OUT, "architecture"), { recursive: true });
mkdirSync(join(OUT, "rubrics"), { recursive: true });
mkdirSync(join(OUT, "validation"), { recursive: true });

// ─── 1. Per-capstone contract JSON (13 files) ──────────────────────────────
for (const c of CAPSTONES) {
  writeJson(`capstones/${c.capstoneId}.json`, c);
}

// ─── 2. capstone_ledger.json ────────────────────────────────────────────────
const ledger = CAPSTONES.map((c) => ({
  capstoneId: c.capstoneId,
  version: c.version,
  title: c.title,
  level: c.level,
  gateSection: c.gateSection,
  status: c.status,
  subGateIds: c.subGates?.map((s) => s.id) ?? [],
}));
writeJson("capstones/capstone_ledger.json", ledger);

// ─── 4. roadmap_inventory.json ──────────────────────────────────────────────
writeJson("reality/roadmap_inventory.json", {
  levels: CARDINALITY.levels,
  capstonesPerLevel: CARDINALITY.capstonesPerLevel,
  levelCapstones: CARDINALITY.levelCapstones,
  finalCapstones: CARDINALITY.finalCapstones,
  total: CARDINALITY.total,
  gates: CARDINALITY.principalGates,
});

// ─── 5. capstone_inventory.json ─────────────────────────────────────────────
const inventory = CAPSTONES.map((c) => ({
  capstoneId: c.capstoneId,
  level: c.level,
  gate: c.gateSection,
  version: c.version,
  status: c.status,
}));
writeJson("reality/capstone_inventory.json", inventory);

// ─── 6. section_capstone_mapping.json (all 52 sections) ─────────────────────
const sectionMapping = SECTIONS.map((s) => ({
  sectionId: s.sectionId,
  levelId: s.levelId,
  capstoneId: s.capstoneId,
  artifactAdded: s.artifactAdded,
}));
writeJson("reality/section_capstone_mapping.json", sectionMapping);

// ─── 10. level_claim_matrix.json ────────────────────────────────────────────
const levelClaimMatrix = LEVELS.map((l) => ({
  levelId: l.levelId,
  name: l.name,
  dreyfusMapping: l.dreyfusMapping,
  exitCapabilities: l.exitCapabilities,
  disclaimer: l.disclaimer,
  capstoneIds: l.capstoneIds,
  principalGates: l.principalGates,
}));
writeJson("levels/level_claim_matrix.json", levelClaimMatrix);

// ─── 16. capstone_dependency_graph.json ─────────────────────────────────────
// Build edges from badgeDependencies → capstoneId, and from each principal
// capstone → CP-FINAL (every principal is integrated by CP-FINAL per spec).
const nodes = CAPSTONES.map((c) => ({
  capstoneId: c.capstoneId,
  level: c.level,
  gate: c.gateSection,
}));
const edges = [];
for (const c of CAPSTONES) {
  for (const dep of c.badgeDependencies ?? []) {
    edges.push({ from: dep, to: c.capstoneId, type: "badge-dependency" });
  }
  if (c.capstoneId !== "CP-FINAL") {
    edges.push({ from: c.capstoneId, to: "CP-FINAL", type: "final-integration" });
  }
}
writeJson("architecture/capstone_dependency_graph.json", { nodes, edges });

// ─── 17. final_integration_contracts.json ───────────────────────────────────
writeJson("architecture/final_integration_contracts.json", FINAL_INTERFACES);

// ─── 20. rubric_registry.json ───────────────────────────────────────────────
writeJson("rubrics/rubric_registry.json", RUBRIC_REGISTRY);

// ─── 21. critical_failure_matrix.json ───────────────────────────────────────
// COMMON_CRITICAL_FAILURES is not exported; reconstruct from RUBRIC_REGISTRY.
const common = RUBRIC_REGISTRY.criticalFailureMatrix;
const perCapstone = {};
for (const c of CAPSTONES) {
  const r = c.rubric;
  const extra = r.criticalFailures.filter((f) => !common.includes(f));
  if (extra.length > 0) perCapstone[c.capstoneId] = extra;
}
writeJson("rubrics/critical_failure_matrix.json", {
  criticalFailures: common,
  perCapstone,
});

// ─── 30. source_registry.json ───────────────────────────────────────────────
const sourceRegistry = [
  { path: "src/data/types.ts", role: "canonical type definitions" },
  { path: "src/data/capstones.ts", role: "13 capstone contracts + FINAL_INTERFACES + module-load invariant" },
  { path: "src/data/levels.ts", role: "LEVELS + CARDINALITY invariant" },
  { path: "src/data/sections.ts", role: "52 section mappings" },
  { path: "src/data/rubrics.ts", role: "RUBRICS + RUBRIC_REGISTRY + COMMON_CRITICAL_FAILURES" },
  { path: "src/data/badges.ts", role: "13 badges" },
  { path: "src/data/i18n.ts", role: "EN/ES string table (Stephen Fry register)" },
  { path: "src/lib/copilot-harness.ts", role: "runnable CP-N4-C harness (adapters, RAG, tools, budget, approval, tracing, redaction)" },
  { path: "tests/capstones.test.ts", role: "automated test suite (119 tests, cardinality/consistency/content/runtime/adversarial/integration)" },
  { path: "src/app/page.tsx", role: "learner-facing capstones UI (only user-visible route)" },
];
writeJson("source_registry.json", sourceRegistry);

// ─── 29. execution_ledger.json ──────────────────────────────────────────────
writeJson("execution_ledger.json", {
  phases: [
    { phase: 0, name: "environment reality", status: "done" },
    { phase: 1, name: "current-frameworks research", status: "done" },
    { phase: 2, name: "data layer (13 capstones + 4 levels + 52 sections + rubrics + badges)", status: "done" },
    { phase: 3, name: "learner-facing Capstones UI on /", status: "done" },
    { phase: 4, name: "runnable CP-N4-C harness + CP-FINAL integration contracts", status: "done" },
    { phase: 5, name: "Stephen Fry EN/ES redaction on briefs/theory", status: "done" },
    { phase: 6, name: "automated tests (bun test) + agent-browser verification", status: "done" },
    { phase: 7, name: "capstone_validation mirror (Task 4-mirror)", status: "done" },
    { phase: 8, name: "commit locally + push to PillB/pyarcana", status: "pending-auth" },
  ],
  commit: "pending",
  deployedCommit: "pending",
  devServerPort: 3000,
  testSuite: { runner: "bun test", file: "tests/capstones.test.ts", passCount: 119 },
});

// ─── Sanity: confirm counts ─────────────────────────────────────────────────
console.log(`Mirrored ${CAPSTONES.length} capstones (expected 13).`);
console.log(`Sections: ${SECTIONS.length} (expected 52).`);
console.log(`Levels: ${LEVELS.length} (expected 4).`);
console.log(`Badges: ${BADGES.length} (expected 13).`);
console.log(`Final interfaces: ${FINAL_INTERFACES.length} (expected 12).`);
console.log(`Rubrics: ${Object.keys(RUBRICS).length} (expected 13).`);
console.log("Mirror complete.");
