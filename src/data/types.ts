// PyArcana canonical types — single source of truth for the capstone system.
// Aligns with the governing spec's Capstone Contract schema (Section 6).

export type LevelId = 1 | 2 | 3 | 4;
export type CapstoneStatus =
  | "missing"
  | "partial"
  | "implemented"
  | "verified"
  | "deployed";

export interface SubGate {
  id: string;          // e.g. "CP-N4-C.1"
  sectionId: string;   // e.g. "S49"
  title: string;
  scope: string[];
}

export interface SectionContribution {
  sectionId: string;        // e.g. "S01"
  artifact: string;         // what artifact this section adds
  theory: string;           // what theory explains the contribution
  iDo: string;              // I Do demonstration
  weDo: string;             // We Do practice
  youDo: string;            // You Do independent work
  assessment: string;       // what assessment verifies it
  finalInterface: string;   // how the final interface reuses it
}

export interface SyntheticDataContract {
  generator: string;        // how the data is produced (no real PII)
  schema: string;            // fields and types
  size: string;              // row count / volume
  license: string;           // synthetic / CC0 / etc.
  piiRisk: string;           // explicit PII risk statement
}

export interface RubricCriterion {
  id: string;
  name: string;
  weight: number;            // 0..1
  levels: { level: string; description: string }[];
  critical: boolean;         // non-compensatory if true
}

export interface Rubric {
  version: string;
  passThreshold: number;     // 0..100
  criteria: RubricCriterion[];
  criticalFailures: string[];
}

export interface CapstoneContract {
  capstoneId: string;        // e.g. "CP-N1-A"
  version: string;           // semver
  title: string;
  titleEs: string;  // Stephen Fry Spanish redaction
  level: LevelId;
  gateSection: string;       // e.g. "S04"
  subGates: SubGate[];
  problemStatement: string;
  problemStatementEs: string;  // Stephen Fry Spanish redaction
  intendedUsers: string[];
  jobsToBeDone: string[];
  learningOutcomes: string[];
  prerequisites: string[];
  sectionContributions: SectionContribution[];
  requiredArtifacts: string[];
  requiredEvidence: string[];
  syntheticDataContract: SyntheticDataContract;
  acceptanceCriteria: string[];
  criticalCriteria: string[];
  securityRequirements: string[];
  privacyRequirements: string[];
  accessibilityRequirements: string[];
  responsibleUseRequirements: string[];
  testRequirements: string[];
  demoRequirements: string[];
  rubric: Rubric;
  remediationPaths: string[];
  badgeDependencies: string[];
  finalIntegrationInterfaces: string[];
  status: CapstoneStatus;
  // Stephen Fry redaction metadata (passes per language)
  redactionPasses: { en: number; es: number; lastUpdated: string };
}

export interface LevelFramework {
  levelId: LevelId;
  stableId: string;          // "L1".."L4" — never changes
  name: string;              // learner-facing
  spanishName: string;
  sectionRange: string;      // "S01–S13"
  principalGates: string[];  // ["S04","S08","S13"]
  capstoneIds: string[];     // exactly 3
  dreyfusMapping: string;    // skill-acquisition mapping (curricular, not workplace)
  exitCapabilities: string[];
  disclaimer: string;        // what these levels do NOT certify
}

export interface SectionMapping {
  sectionId: string;         // S01..S52
  levelId: LevelId;
  title: string;
  spanishTitle: string;
  capstoneId: string | null; // principal capstone it contributes to
  artifactAdded: string;
  theory: string;
  iDo: string;
  weDo: string;
  youDo: string;
  assessment: string;
  finalInterfaceReuse: string;
}

export interface Badge {
  badgeId: string;
  capstoneId: string;
  name: string;
  spanishName: string;
  description: string;
  eligibility: string[];
  icon: string;              // lucide icon name
}

export interface FinalIntegrationInterface {
  capstoneId: string;
  interfaceName: string;
  contract: string;          // API/event contract description
  direction: "produces" | "consumes" | "bidirectional";
}

export interface CardinalityInvariant {
  levels: number;
  capstonesPerLevel: number;
  levelCapstones: number;
  finalCapstones: number;
  total: number;
  principalGates: Record<LevelId | "final", string[]>;
  n4dDecision: "fold_into_n4c";
  cpN4CSubGates: { id: string; sectionId: string; title: string }[];
}
