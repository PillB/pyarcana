# Lesson readiness and validation

The procedure for readying and validating one section. Run it on every round that changes a
section, and on every review of one.

It exists because zero surprising uses is not the same as ready. A section is ready when nothing is
used before it is explained **and** the skills it teaches keep pace with what its learning
outcomes, badges, projects, capstones and levels claim. A round can reach the first and miss the
second. Route 2 moved CP-N1-A's parser out of S02–S04 while the capstone's gate stayed at S04, and
no concept measure could see that. Both maps are therefore read and diffed every time: the concept
map and the required-skills map.

Work in a worktree of `audit/consolidated-issues-20260910`. Run lesson Python with
`.venv-content/bin/python` (3.12). Never run an audit while a gate holds `.fixer/reports.lock`.

## Artifacts

| What | Produced by | Path |
|---|---|---|
| Event stream | `npx tsx scripts/course_event_extractor.mts > .fixer/events.json` (gate.py writes it) | `.fixer/events.json` |
| Syntax/proper-name rules | edited by hand, tested | `scripts/concept_syntax.mts`, `tests/adversarial/concept-syntax.test.mjs` |
| Concept map | `python3 scripts/concept_map.py` | `course-state/concept_map.json`, `docs/concept-map/SXX.md`, `INDEX.md` |
| Required-skills map | `python3 scripts/badge_readiness_audit.py` | `course-state/badge_readiness_report.json` |
| What credentials claim | source | `src/lib/eligibility/badge_catalog.json` (required_sections, required_activities, critical_competencies), `src/lib/eligibility/engine.ts` |
| Capstones | source | `course-state/capstones/INDEX.json`, `src/lib/capstones/catalog.ts` |
| Outcomes and practice | source | `src/lib/course/sections/sNN-*.ts` (`learningOutcomes`, theory, iDo, weDo, youDo, selfCheck) |
| Vocabulary | source | `src/lib/glossary/terms.ts` (aliases, firstSectionId) |
| Gate | `python3 tools/fixer/gate.py snapshot SXX` / `check SXX` | `.fixer/SXX.gate-before.json` |
| Brief, codex, apply | `tools/fixer/build_concept_prompt.py SXX [--practice-layer]`; `tools/fixer/run_codex.py TAG gpt-5.6-sol medium`; `tools/fixer/apply_patches.py .fixer/TAG.result.json --apply` | `.fixer/TAG.*`, `.fixer/SXXk.held_definitions.json` |
| Ratchets | tests | `tests/adversarial/glossary-first-use-ratchet.test.mjs` (DECLARED_LATE_OWED), `tests/adversarial/test_forward_dependencies.py` (D10_OWED) |
| Records | hand | `audit/fixer/LEDGER_NOTES.md`, `WORK_QUEUE.md`, `decisions.md`, `writing_rules.md`, `OPEN_QUESTIONS.md` |
| Browser | `npm run dev` (port 3000) in the worktree being validated | local preview of the branch; after merge, the live site `https://pillb.github.io/pyarcana/#<slug>` |

## Procedure

1. **Baseline.** `gate.py snapshot SXX`. Copy the section file and the derived reports to
   `.fixer/SXX.pre-concepts.*` so a failed round can be restored. Save the current
   `badge_readiness_report.json` as the skills baseline.
2. **Read both maps for the section.** `docs/concept-map/SXX.md`: used / explained / exemplified /
   exercised / self-checked / surprising. The readiness report: every finding for a badge whose
   `required_sections` include SXX, and every capstone gated at or after SXX
   (PREREQUISITE_TAUGHT_LATER, CLAIMS_UNTAUGHT_VOCABULARY, CAPSTONE_GATE_VOCABULARY_GAP).
3. **Read the code, not just the measures.** The maps only see glossary names and the syntax
   rules. Scan the section's code for constructs used without their name (`assert`, `repr`/`!r`,
   dict literals, imports, methods, `in`, slicing) and check each is taught before first use.
4. **Outcomes ↔ practice ↔ credentials.** Every `learningOutcome` must be taught AND exercised
   (weDo/youDo/selfCheck). Every badge requiring SXX needs its `SXX-YOUDO`/`SXX-EXAM` activities
   present, and its competencies must be practised by then. A capstone must not claim a skill
   moved later. On any gap use the open-questions decision tree (`audit/fixer/OPEN_QUESTIONS.md`, decision D11): primer → rewrite (D14) → move →
   re-raise. Never award retroactively. Changing `badge_catalog.json` or moving a project is
   Ask-first.
5. **Brief codex.** Verify every factual claim in the brief before sending it: section ids,
   detector verb lists, Python behaviour. Name the defining blocks that must stay. Never pin a
   phrase that carries an anglicism. Give every location, never a sample.
6. **Review the patches before applying.** Run every snippet and every claim on 3.12. Check
   D14 (not watered down), best practice (PEP 8/Ruff), the self-check `correctIndex` and answer
   balance, and that the definitional sentence marks the bare name (**`X`** + verb).
7. **Gate.** `gate.py check SXX` against the step-1 snapshot. An instrument change goes in its
   own commit, and you prove it leaves the baseline unchanged, or you re-snapshot.
8. **Re-run both maps and diff.** Concept map: no new surprising or never-explained entries.
   Readiness: no new finding for any badge or capstone touching SXX. Treat a regression in
   either as a failed round. The gate enforces the totals (`surprising_uses_course_wide`,
   `readiness_findings_course_wide`, since b596f785). Diff the rows by hand anyway: a total can
   hold while one badge gains a finding and another loses one.
9. **Verify in the browser.** Local preview of the branch now; the live site after merge. Check
   theory, iDo, weDo, youDo and self-check as a learner meets them, and the console.
10. **Record and commit.** Lower any ratchet that moved. Put lessons in LEDGER_NOTES and deferred
    items in WORK_QUEUE, and re-raise judgment calls in OPEN_QUESTIONS. Stage named files only,
    commit, push. Report what is still open.
