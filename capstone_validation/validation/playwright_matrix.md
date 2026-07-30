# Playwright / agent-browser verification matrix

> Governing spec Section 13 (Harness Artifacts / Validation) and the build plan
> item 5 (automated tests + agent-browser verification).
> Source of truth: `src/app/page.tsx` (UI regions), `src/lib/copilot-harness.ts`
> (harness flow).
> Tool: agent-browser (Rust headless browser automation CLI).

The agent-browser verification matrix covers every user-visible region of the
`/` route and the two interactive harness dialogs. Each check opens
`http://localhost:3000/`, performs the listed action, and snapshots the result.

## 1. Levels (4)

| Check | Expected |
|---|---|
| L1 section renders | Section header `L1 · Guided Foundations`, `S01–S13`, Dreyfus mapping, principal-gate pills `S04 S08 S13`, collapsible Exit capabilities list. |
| L2 section renders | `L2 · Independent Applied Practice`, `S14–S26`, gates `S17 S21 S26`. |
| L3 section renders | `L3 · Advanced Integration and Evaluation`, `S27–S39`, gates `S30 S34 S39`. |
| L4 section renders | `L4 · Governed Production Systems`, `S40–S52`, gates `S43 S47 S51`. |

## 2. Capstone cards (3 per level = 12)

| Check | Expected |
|---|---|
| 3 cards per level | Each level section contains a 3-column grid of capstone cards (CP-N1-A/B/C, CP-N2-A/B/C, CP-N3-A/B/C, CP-N4-A/B/C). |
| Card content | Each card shows capstoneId, title, version pill, level pill, status pill (text + border, not colour-only). |
| Card dialog opens | Clicking a card opens a detail dialog with brief, prerequisites, dataset, I-Do/We-Do/You-Do, assessment, rubric, evidence, remediation, security, final-integration. |

## 3. Final capstone card + interfaces

| Check | Expected |
|---|---|
| CP-FINAL card present | Violet-framed card with `CP-FINAL · S52` pill. |
| 12 interfaces listed | Side panel lists all 12 `FINAL_INTERFACES` rows (capstoneId + interfaceName). |
| CP-FINAL dialog opens | Dialog shows 12 upstream dependencies, versioned contracts, rollback drill requirement, contribution statement requirement. |

## 4. CP-N4-C interactive harness dialog (full flow)

| Step | Action | Expected |
|:-:|---|---|
| 1 | Open the CP-N4-C card dialog and click "Run harness". | Harness dialog opens. |
| 2 | Select **provider mode** (`no-key` / `local` / `commercial-test` / `commercial-approved`). | Mode pill updates. |
| 3 | Enter a **task** (e.g. *"draft email to ana.review about ACME-001 KYC refresh"*). | Task text reflected. |
| 4 | Click **Run**. | The harness executes synchronously via `runCopilotHarness()`. |
| 5 | Inspect **retrieval** results. | 1+ hits from the synthetic corpus, each with `doc`, `scope`, `score`, `snippet`, `chunkId`, `indexVersion`. |
| 6 | Inspect **proposed tool**. | `draft_email` proposed (allowlisted, sideEffect=`write`). |
| 7 | Click **Approve** in the approval gate. | `approval.granted` span appears. |
| 8 | Inspect **verifier** result. | `passed: true`, `faithfulness ≥ 0.90`, `contextPrecision ≥ 0.70`. |
| 9 | Inspect **trace**. | Redacted OTel spans: `run.start`, `agent.plan`, `rag.retrieve`, `model.generate`, `tool.propose`, `approval.gate`, `verifier.check`, `run.end`. No raw email/SSN/card/ID patterns visible. |
| 10 | Inspect **budget** meter. | `withinBudget: true`, steps ≤ 12, toolCalls ≤ 5, cost ≤ $0.05, elapsed ≤ 10s. |
| 11 | Inspect **cited output**. | Text + citations[] referencing the retrieved chunks. |

## 5. CP-FINAL integration dialog (full flow)

| Step | Action | Expected |
|:-:|---|---|
| 1 | Open the CP-FINAL card dialog. | Integration dialog opens. |
| 2 | Inspect **12 dependencies**. | All 12 principal capstone IDs listed. |
| 3 | Inspect **versioned interface contracts**. | All 12 `FINAL_INTERFACES` rows shown with interface name and contract. |
| 4 | Inspect **rollback** requirement. | Critical criterion `DR` (Backup, restore, rollback and disaster exercise executed) listed. |
| 5 | Inspect **contribution** statement requirement. | Truthful personal contribution statement requirement present (CP-FINAL critical failure for unsupported claims). |

## 6. EN/ES toggle

| Check | Expected |
|---|---|
| Toggle button present | Header shows the EN/ES toggle button. |
| Toggle to ES | All visible strings flip to Spanish: appName, appTagline, levelDisclaimer, nav labels, level names (`Fundaciones Guiadas`, etc.), section titles, badge names. |
| Toggle back to EN | All visible strings flip back to English. |
| Disclaimer parity | The curricular-not-workplace disclaimer renders verbatim in both languages. |

## 7. Sticky footer

| Check | Expected |
|---|---|
| Footer visible at page bottom | `footerNote` + appName + year. |
| Footer stays in normal flow | Not fixed; scrolls with the page (sticky header is `position: sticky`, footer is `mt-auto`). |
| Footer text in current lang | Footer text flips with the EN/ES toggle. |

## Execution status

- The dev server on port 3000 returns HTTP 200 (see
  `validation/deployment_evidence.md`).
- The above matrix defines the agent-browser verification plan. Execution
  snapshots are collected by the agent-browser skill; results are appended to
  this file as each check runs.
