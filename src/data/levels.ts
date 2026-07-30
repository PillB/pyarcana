import type { CardinalityInvariant, LevelFramework } from "./types";

// The thirteen-capstone invariant. Locked. Any change requires a full migration
// per ADR-capstone-cardinality.md.
export const CARDINALITY: CardinalityInvariant = {
  levels: 4,
  capstonesPerLevel: 3,
  levelCapstones: 12,
  finalCapstones: 1,
  total: 13,
  principalGates: {
    1: ["S04", "S08", "S13"],
    2: ["S17", "S21", "S26"],
    3: ["S30", "S34", "S39"],
    4: ["S43", "S47", "S51"],
    final: ["S52"],
  },
  n4dDecision: "fold_into_n4c",
  cpN4CSubGates: [
    { id: "CP-N4-C.1", sectionId: "S49", title: "Harness, adapters, RAG, tools, web/SERP, budget and approval" },
    { id: "CP-N4-C.2", sectionId: "S50", title: "Evaluation, red-team, reliability and recovery" },
    { id: "CP-N4-C.3", sectionId: "S51", title: "Observability, governance, incident-response, UX and final CP-N4-C gate" },
  ],
};

export const LEVELS: LevelFramework[] = [
  {
    levelId: 1,
    stableId: "L1",
    name: "Guided Foundations",
    spanishName: "Fundaciones Guiadas",
    sectionRange: "S01–S13",
    principalGates: ["S04", "S08", "S13"],
    capstoneIds: ["CP-N1-A", "CP-N1-B", "CP-N1-C"],
    dreyfusMapping: "Novice → Advanced beginner (curricular skill, not workplace rank)",
    exitCapabilities: [
      "Follow, modify, test and explain bounded data-processing programs with explicit support.",
      "Validate, normalise and quarantine synthetic records while preserving provenance.",
      "Run a reproducible local ETL pipeline with deterministic outputs and safe reruns.",
      "Assemble a human-review dashboard that separates evidence from decisions.",
    ],
    disclaimer:
      "PyArcana curricular proficiency levels describe evidence demonstrated inside the course. They do not by themselves establish workplace seniority, professional licensure, employment level, or years of experience.",
  },
  {
    levelId: 2,
    stableId: "L2",
    name: "Independent Applied Practice",
    spanishName: "Práctica Aplicada Independiente",
    sectionRange: "S14–S26",
    principalGates: ["S17", "S21", "S26"],
    capstoneIds: ["CP-N2-A", "CP-N2-B", "CP-N2-C"],
    dreyfusMapping: "Advanced beginner → independent competent practice (curricular skill, not workplace rank)",
    exitCapabilities: [
      "Complete defined analytical, reporting and automation work using established methods and explicit review gates.",
      "Produce a reproducible EDA portfolio that distinguishes observation from recommendation.",
      "Build an accessible dashboard and reporting factory with source-to-claim traceability.",
      "Operate a human-approved RPA and AI analyst workflow with audit trail, rollback and test mode.",
    ],
    disclaimer:
      "PyArcana curricular proficiency levels describe evidence demonstrated inside the course. They do not by themselves establish workplace seniority, professional licensure, employment level, or years of experience.",
  },
  {
    levelId: 3,
    stableId: "L3",
    name: "Advanced Integration and Evaluation",
    spanishName: "Integración y Evaluación Avanzadas",
    sectionRange: "S27–S39",
    principalGates: ["S30", "S34", "S39"],
    capstoneIds: ["CP-N3-A", "CP-N3-B", "CP-N3-C"],
    dreyfusMapping: "Competent practice → advanced integrated capability (curricular skill, not workplace rank)",
    exitCapabilities: [
      "Design and evaluate entity resolution, graph, data and machine-learning workflows under ambiguity and human review.",
      "Build a testable entity-resolution engine with blocking, comparators, precision/recall and threshold selection.",
      "Operate a relationship-investigation workbench that preserves source, uncertainty and correction.",
      "Triage cases responsibly with a deterministic baseline, calibration, abstention and a model card.",
    ],
    disclaimer:
      "PyArcana curricular proficiency levels describe evidence demonstrated inside the course. They do not by themselves establish workplace seniority, professional licensure, employment level, or years of experience.",
  },
  {
    levelId: 4,
    stableId: "L4",
    name: "Governed Production Systems",
    spanishName: "Sistemas de Producción Gobernados",
    sectionRange: "S40–S52",
    principalGates: ["S43", "S47", "S51"],
    capstoneIds: ["CP-N4-A", "CP-N4-B", "CP-N4-C"],
    dreyfusMapping: "Advanced integrated capability → curriculum-level systems mastery (curricular skill, not workplace rank)",
    exitCapabilities: [
      "Integrate, deploy, observe, secure and defend a bounded production-style data and AI system.",
      "Operate a governed Python service platform with versioned API, authz, health checks and rollback.",
      "Run a production data and ML platform with lineage, registry, shadow/canary, SLOs and last-known-good recovery.",
      "Operate an auditable multi-agent AI operations copilot and harness with bounded orchestration, RAG, tools, web/SERP, evaluations, tracing and incident response.",
    ],
    disclaimer:
      "PyArcana curricular proficiency levels describe evidence demonstrated inside the course. They do not by themselves establish workplace seniority, professional licensure, employment level, or years of experience.",
  },
];
