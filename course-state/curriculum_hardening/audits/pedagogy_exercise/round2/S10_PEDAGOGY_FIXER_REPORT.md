# S10 Pedagogy Fixer Report (Round 2)

## Section
- **title:** Módulos, packaging y CLI profesional
- **id:** `sklearn` (index 10; archivo histórico `s10-sklearn.ts` — contenido packaging/CLI de `familiarity_core`)
- **source file:** `src/lib/course/sections/s10-sklearn.ts`
- **inputs:** `PEDAGOGY_EXERCISE_SPEC.md`, `round2/S10_EXERCISE_PEDAGOGY_REPORT.md`
- **method:** Hand-applied residual prose only; no generators, templates, or bulk replace of pedagogy text

## Acceptance checklist

- [x] Every non-trivial unit retains `preamble` + `retrospective` (R1 shell intact)
- [x] We Do units retain short `title`
- [x] `instruction` remains task-only where edited (T4-A-E3 and T3-A-E3 detuned for transfer)
- [x] Exact solution outputs preserved (harness cosmetics only on starter print paths)
- [x] Spanish PE; no real PII
- [x] No generators used
- [x] Section source typechecks (`tsc --noEmit` exit 0)

## Changes applied

### P1 — learning integrity / metacognition

| Unit | Change |
|------|--------|
| **S10-T4-A-DEMO** | Rewrote `retrospective` (stop copying why slogan). New close: flag `None` ≠ flag `"INFO"` + self-check on env=DEBUG sin flag. |
| **S10-T4-B-DEMO** | Rewrote `retrospective` (stop copying fail-closed slogan). Classic error: global validator vs mid-batch fail. Preamble opens with “Fail-closed al arranque”. |
| **S10-T4-A-E3** | Detuned instruction (goal + rule + print format; no paste-the-if). Hints no longer paste return tuples. Retro thickened with self-check. |
| **S10-T3-A-E1** | Expanded preamble (pipeline Namespace hook). Feedback symptom-first without retro echo. Retro: usage code question. Hints progressive (subparsers then format debug). |
| **S10-T3-A-E2** | Retrospective without “unificas todo en 1”; self-check on count of exit 2. Feedback kept as diagnostic reasoning. |
| **S10-T1-B-E1** | Feedback de-duped from `_` promesa (symptom + labels + True). Retro keeps promesa + rename-without-major self-check. |
| **S10-T2-A-E1** | Feedback symptom-only (name/requires-python/partial). Retro: guiones vs import + CI key self-check. |
| **S10-T2-A-E3** | Feedback: mismatch/shadowing facts. Retro: ordered diagnosis + why order matters. |
| **S10-T2-B-E2** | Feedback: concat vs optional-dev. Retro: runtime/dev + stdlib-first gate. |
| **S10-T3-B-E1** | Feedback: err.write path. Retro: `cmd \| jq` self-check. Hint 2 teaches why StringIO. |
| **S10-T3-B-E2** | Feedback: branch `-` vs file. Retro: operator contract + pipe self-check. Starter path aligned to `file.csv`. |
| **S10-T3-B-E3** | Feedback: JSON return + stderr_only harness. Retro: “otro canal” + jq self-check. Starter print path includes `stderr_only`. |
| **S10-T4-A-E1** | Retrospective thickened with PREC invert self-check; feedback kept symptom-first. |
| **S10-T4-A-E2** | Retrospective: half-config + `out.update(env)` self-check. |
| **S10-T4-B-E2** | Feedback: passed_bad / both keys. Retro: RuntimeError-with-key vs stacktrace self-check. |

### P2 — length, hints, harness polish

| Unit | Change |
|------|--------|
| **S10-T1-B-DEMO** | Retro + self-check on `__all__` symbols defended in major. |
| **S10-T2-A-DEMO** | Preamble notes layout *contrato* (simulación); retro: name-vs-folder + guion question. |
| **S10-T2-B-DEMO** | `why` names CHANGELOG as human half of SemVer; retro: bump-without-migration classic error. |
| **S10-T3-A-DEMO** | Retro: `main(argv)->int` testability + argv vacío = 2 vs 1. |
| **S10-T3-B-DEMO** | `why`: not “loguear menos”, **otro canal**. |
| **S10-T1-A-E1** | Retro: export helper locks rename + `_ws` import self-check. |
| **S10-T1-A-E3** | Éxito bullet quotes the three style strings (not the algorithm). |
| **S10-T1-B-E2** | Feedback thickened (raw compare lies). Starter `compare("Z"," z ")` aligned with solution. |
| **S10-T1-B-E3** | Retro: migration *qué hacer* + optional-default major/minor question. |
| **S10-T2-A-E2** | Feedback: pyproject on root not under `src/`. |
| **S10-T2-B-E1** | Retro: residual major bump classic error + flag minor question. |
| **S10-T3-A-E3** | Instruction without pad formula spoiler; hints without exact space counts; feedback/retro de-spoiled; retro operator self-check. |
| **S10-T4-B-E3** | Feedback symptom-first (DEBUG/echo_sql/token rules) without “cierre de T4” (belongs to retro). |

### Not changed (per report)

- **S10-T1-A-DEMO**, **S10-T1-A-E2**, **S10-T2-B-E3**, **S10-T4-B-E1**, **S10-YOU-DO** — Strong / no residual required.
- **T1-B-E1** solution still uses `.lower()` (do not force casefold without execute-and-diff).
- Platform id `sklearn` left as legacy routing only.
- Solution `output` strings and solution logic unchanged except starter harness print-path cosmetics listed above.

## Validation notes

- P1 why↔retro collapse on T4-A/B demos: slogans no longer duplicated; retros add misconception + self-check.
- Transfer integrity: T4-A-E3 and T3-A-E3 no longer hand the full algorithm/formula in instruction/hints.
- Feedback≠retrospective on high-stakes pairs (T1-B-E1, T2-A-E1/E3, T2-B-E2, T3-A-E1/E2, T3-B-E1/E2/E3, T4-A-E1/E2, T4-B-E2): feedback stays symptom-first; retro owns principle + self-check + transfer.
- Exact solution outputs preserved; optional starter alignments: T1-B-E2 compare args, T3-B-E2 path name, T3-B-E3 `stderr_only` print path.
- Typecheck: `npx tsc --noEmit -p tsconfig.json` → exit 0.

## Residual risks (post-fix)

1. **Platform id `sklearn`:** still legacy routing; learner-facing prose correctly says `familiarity_core`.
2. **Simulated packaging:** several We Do units model layout/install without a real filesystem; prose keeps *contrato / simulación* framing (T2-A).
3. **E3 spoiler regression:** do not re-paste `if flag is not None` or `pad = max(1, …)` into transfer instructions.
4. **Mild fb∩retro overlap** may remain on Strong units not in the residual list; out of Round-2 scope.
5. **Harness cosmetics:** starter still has `# DEFECT` and `print('ok', True)` to remove; only print-path names were aligned where listed.

## Anti-aberration

All residual sentences written by hand against the Round-2 unit ledger. No script manufactured preambles, feedback, or retrospectives. No bulk search-replace of a single template across 24 We Dos.

---

Section 10 exercise pedagogy has been fixed and validated under strict anti-aberration rules. Ready for the next section.
