// PyArcana — System Card test suite (Gap C).
//
// Verifies that the CP-N4-C and CP-FINAL system cards:
//   - have all 14 canonical sections present and non-empty,
//   - cover the full OWASP LLM Top 10 (LLM01..LLM10) controls matrix,
//   - declare concrete, measurable no-go conditions,
//   - cross-reference EU AI Act Annex IV in the regulatory mapping.

import { test, expect, describe } from "bun:test";
import {
  CP_N4_C_SYSTEM_CARD,
  CP_FINAL_SYSTEM_CARD,
  validateSystemCard,
  SYSTEM_CARDS,
  getSystemCard,
  OWASP_LLM_IDS,
  SYSTEM_CARD_SECTION_NAMES,
} from "../src/data/system-cards";
import type { SystemCard } from "../src/data/system-card-schema";

const CARDS: { name: string; card: SystemCard }[] = [
  { name: "CP-N4-C", card: CP_N4_C_SYSTEM_CARD },
  { name: "CP-FINAL", card: CP_FINAL_SYSTEM_CARD },
];

describe("System Card — schema validation (Gap C)", () => {
  test("validateSystemCard accepts a well-formed card", () => {
    const res = validateSystemCard(CP_N4_C_SYSTEM_CARD);
    expect(res.valid).toBe(true);
    expect(res.errors).toEqual([]);
  });

  test("validateSystemCard rejects an empty object with 14+ errors", () => {
    const res = validateSystemCard({});
    expect(res.valid).toBe(false);
    expect(res.errors.length).toBeGreaterThanOrEqual(14);
  });

  test("validateSystemCard rejects a card missing the threat model", () => {
    const broken = { ...CP_N4_C_SYSTEM_CARD, threatModel: undefined };
    const res = validateSystemCard(broken);
    expect(res.valid).toBe(false);
    expect(res.errors.some((e) => e.includes("threatModel"))).toBe(true);
  });

  test("validateSystemCard rejects a card with an incomplete OWASP matrix", () => {
    const broken: SystemCard = {
      ...CP_N4_C_SYSTEM_CARD,
      threatModel: {
        overview: CP_N4_C_SYSTEM_CARD.threatModel.overview,
        matrix: CP_N4_C_SYSTEM_CARD.threatModel.matrix.filter((r) => r.id !== "LLM07"),
      },
    };
    const res = validateSystemCard(broken);
    expect(res.valid).toBe(false);
    expect(res.errors.some((e) => e.includes("LLM07"))).toBe(true);
  });

  test("validateSystemCard rejects empty no-go conditions", () => {
    const broken: SystemCard = { ...CP_N4_C_SYSTEM_CARD, noGoConditions: [] };
    const res = validateSystemCard(broken);
    expect(res.valid).toBe(false);
    expect(res.errors.some((e) => e.includes("noGoConditions"))).toBe(true);
  });

  test("SYSTEM_CARD_SECTION_NAMES lists exactly 14 sections", () => {
    expect(SYSTEM_CARD_SECTION_NAMES).toHaveLength(14);
  });

  test("OWASP_LLM_IDS lists exactly 10 risks (LLM01..LLM10)", () => {
    expect(OWASP_LLM_IDS).toHaveLength(10);
    expect(OWASP_LLM_IDS).toEqual([
      "LLM01", "LLM02", "LLM03", "LLM04", "LLM05",
      "LLM06", "LLM07", "LLM08", "LLM09", "LLM10",
    ]);
  });
});

// ─────────────────────── per-section presence (×14 ×2 cards) ───────────────────────

describe.each(CARDS)("System Card — $name has all 14 sections non-empty", ({ card }) => {
  test("1. summary present and non-empty", () => {
    expect(typeof card.summary).toBe("string");
    expect(card.summary.trim().length).toBeGreaterThan(0);
  });
  test("2. intendedUse present and non-empty", () => {
    expect(typeof card.intendedUse).toBe("string");
    expect(card.intendedUse.trim().length).toBeGreaterThan(0);
  });
  test("3. outOfScope present and non-empty", () => {
    expect(typeof card.outOfScope).toBe("string");
    expect(card.outOfScope.trim().length).toBeGreaterThan(0);
  });
  test("4. architecture present and non-empty", () => {
    expect(typeof card.architecture).toBe("string");
    expect(card.architecture.trim().length).toBeGreaterThan(0);
  });
  test("5. evaluation present and non-empty", () => {
    expect(typeof card.evaluation).toBe("string");
    expect(card.evaluation.trim().length).toBeGreaterThan(0);
  });
  test("6. ethicalConsiderations present and non-empty", () => {
    expect(typeof card.ethicalConsiderations).toBe("string");
    expect(card.ethicalConsiderations.trim().length).toBeGreaterThan(0);
  });
  test("7. threatModel present with overview + non-empty matrix", () => {
    expect(typeof card.threatModel.overview).toBe("string");
    expect(card.threatModel.overview.trim().length).toBeGreaterThan(0);
    expect(Array.isArray(card.threatModel.matrix)).toBe(true);
    expect(card.threatModel.matrix.length).toBeGreaterThanOrEqual(10);
  });
  test("8. governance present with overview + approvalGates + raci", () => {
    expect(card.governance.overview.trim().length).toBeGreaterThan(0);
    expect(card.governance.approvalGates.length).toBeGreaterThanOrEqual(6);
    expect(card.governance.raci.length).toBeGreaterThanOrEqual(3);
  });
  test("9. incidentResponse present with severityMatrix + runbook", () => {
    expect(card.incidentResponse.overview.trim().length).toBeGreaterThan(0);
    expect(card.incidentResponse.severityMatrix.length).toBeGreaterThanOrEqual(4);
    expect(card.incidentResponse.runbook.length).toBeGreaterThanOrEqual(5);
  });
  test("10. rollbackRecovery present with lastKnownGood + drillCadence + rtoRpo", () => {
    expect(card.rollbackRecovery.overview.trim().length).toBeGreaterThan(0);
    expect(card.rollbackRecovery.lastKnownGood.trim().length).toBeGreaterThan(0);
    expect(card.rollbackRecovery.drillCadence.trim().length).toBeGreaterThan(0);
    expect(card.rollbackRecovery.rtoRpo.trim().length).toBeGreaterThan(0);
  });
  test("11. auditHistory present with non-empty entries", () => {
    expect(card.auditHistory.overview.trim().length).toBeGreaterThan(0);
    expect(card.auditHistory.entries.length).toBeGreaterThanOrEqual(1);
    for (const e of card.auditHistory.entries) {
      expect(e.timestamp.trim().length).toBeGreaterThan(0);
      expect(e.actor.trim().length).toBeGreaterThan(0);
      expect(e.action.trim().length).toBeGreaterThan(0);
    }
  });
  test("12. correctionAppeal present with sla + channel", () => {
    expect(card.correctionAppeal.overview.trim().length).toBeGreaterThan(0);
    expect(card.correctionAppeal.sla.trim().length).toBeGreaterThan(0);
    expect(card.correctionAppeal.channel.trim().length).toBeGreaterThan(0);
  });
  test("13. noGoConditions present and non-empty", () => {
    expect(Array.isArray(card.noGoConditions)).toBe(true);
    expect(card.noGoConditions.length).toBeGreaterThanOrEqual(5);
    for (const c of card.noGoConditions) {
      expect(typeof c).toBe("string");
      expect(c.trim().length).toBeGreaterThan(0);
    }
  });
  test("14. regulatoryMapping present with Annex IV cross-reference", () => {
    expect(card.regulatoryMapping.overview.trim().length).toBeGreaterThan(0);
    expect(card.regulatoryMapping.entries.length).toBeGreaterThanOrEqual(5);
    const json = JSON.stringify(card.regulatoryMapping.entries);
    expect(/annex\s*iv/i.test(json)).toBe(true);
  });
});

// ─────────────────────── OWASP matrix completeness ───────────────────────

describe("System Card — OWASP LLM Top 10 matrix completeness", () => {
  test.each(CARDS)("all 10 OWASP risks (LLM01..LLM10) mapped to ≥1 control in $name", ({ card }) => {
    const ids = new Set(card.threatModel.matrix.map((r) => r.id));
    for (const id of OWASP_LLM_IDS) {
      expect(ids.has(id)).toBe(true);
    }
  });

  test.each(CARDS)("every OWASP matrix row has a threat description and ≥1 control in $name", ({ card }) => {
    for (const row of card.threatModel.matrix) {
      expect(row.threat.trim().length).toBeGreaterThan(0);
      expect(Array.isArray(row.controls)).toBe(true);
      expect(row.controls.length).toBeGreaterThanOrEqual(1);
      for (const c of row.controls) {
        expect(c.trim().length).toBeGreaterThan(0);
      }
    }
  });

  test("CP-FINAL threat model inherits the full CP-N4-C matrix plus integration-specific threats", () => {
    // CP-FINAL should reference CP-N4-C's controls and add integration-specific rows.
    const n4cThreats = CP_N4_C_SYSTEM_CARD.threatModel.matrix.map((r) => r.threat);
    const finThreats = CP_FINAL_SYSTEM_CARD.threatModel.matrix.map((r) => r.threat);
    for (const t of n4cThreats) {
      expect(finThreats).toContain(t);
    }
    const integrationKeywords = ["contract mismatch", "cascade", "shared-state", "integration"];
    const joined = finThreats.join(" ").toLowerCase();
    expect(integrationKeywords.some((k) => joined.includes(k))).toBe(true);
  });
});

// ─────────────────────── no-go conditions are concrete ───────────────────────

describe("System Card — no-go conditions are concrete and measurable", () => {
  test.each(CARDS)("every no-go condition names a measurable threshold or stop event in $name", ({ card }) => {
    // Each no-go should reference a concrete signal: a numeric threshold,
    // a budget/trace/approval event, or a missing artefact.
    const signals = [
      /faithfulness/i, /context precision/i, /budget/i, /slo/i, /trace/i,
      /approval/i, /allowlist/i, /redact/i, /injection/i, /outage/i,
      /calibration/i, /latency/i, /contract/i, /rollback/i, /disaster/i,
      /contribution/i, /dependency graph/i, /scenario/i, /threat model/i,
      /system card/i, /runbook/i, /traceId/i,
    ];
    for (const cond of card.noGoConditions) {
      const matched = signals.some((re) => re.test(cond));
      expect(matched).toBe(true);
    }
  });

  test("CP-N4-C no-go conditions include the canonical faithfulness<0.9 stop", () => {
    expect(CP_N4_C_SYSTEM_CARD.noGoConditions.some((c) => /faithfulness\s*<\s*0\.9/i.test(c))).toBe(true);
  });

  test("CP-FINAL no-go conditions include the contract-test and shared-traceId stops", () => {
    expect(CP_FINAL_SYSTEM_CARD.noGoConditions.some((c) => /contract test/i.test(c))).toBe(true);
    expect(CP_FINAL_SYSTEM_CARD.noGoConditions.some((c) => /traceId/i.test(c))).toBe(true);
  });
});

// ─────────────────────── regulatory mapping references Annex IV ───────────────────────

describe("System Card — regulatory mapping references EU AI Act Annex IV", () => {
  test.each(CARDS)("regulatoryMapping.entries cross-reference Annex IV in $name", ({ card }) => {
    expect(card.regulatoryMapping.entries.length).toBeGreaterThanOrEqual(5);
    for (const e of card.regulatoryMapping.entries) {
      expect(/annex\s*iv/i.test(e.annexIvSection)).toBe(true);
    }
  });

  test("CP-FINAL regulatory mapping covers Annex IV sections 1..9", () => {
    const sections = CP_FINAL_SYSTEM_CARD.regulatoryMapping.entries.map((e) => e.annexIvSection);
    for (const n of ["1", "2", "3", "4", "5", "6", "7", "8", "9"]) {
      const re = new RegExp(`annex\\s*iv\\s*${n}\\b`, "i");
      expect(sections.some((s) => re.test(s))).toBe(true);
    }
  });
});

// ─────────────────────── barrel export ───────────────────────

describe("System Card — barrel export", () => {
  test("SYSTEM_CARDS maps both CP-N4-C and CP-FINAL", () => {
    expect(Object.keys(SYSTEM_CARDS).sort()).toEqual(["CP-FINAL", "CP-N4-C"]);
  });

  test("getSystemCard returns the right card and throws on unknown", () => {
    expect(getSystemCard("CP-N4-C")).toBe(CP_N4_C_SYSTEM_CARD);
    expect(getSystemCard("CP-FINAL")).toBe(CP_FINAL_SYSTEM_CARD);
    expect(() => getSystemCard("CP-N1-A")).toThrow();
  });
});
