# S07 Pedagogy Fixer Report (Round 2)

## Section
- **title:** Texto, Unicode y expresiones regulares
- **id:** `data-acquisition` (index 7)
- **source:** `src/lib/course/sections/s07-data-acquisition.ts`
- **spec:** `course-state/curriculum_hardening/audits/pedagogy_exercise/PEDAGOGY_EXERCISE_SPEC.md`
- **round2 review:** `course-state/curriculum_hardening/audits/pedagogy_exercise/round2/S07_EXERCISE_PEDAGOGY_REPORT.md`
- **method:** hand edits only; no generators, loops, templates, or bulk prose manufacture

## Summary

Round-2 residuals from the review report were applied by hand on Section 7 only. Field coverage was already complete after Round 1; this pass fixed **starter integrity**, **free-form stdout anchors**, and **thin metacognitive closes** (retrospectives / feedback / selected iDo why-retro).

| Priority | Action | Result |
|----------|--------|--------|
| **P1** | Strip residual `print('ok', True)` from weDo starters | **23** starters cleaned (T1-A-E2 already clean). T1-A-E1 instruction step 4 rewritten (no longer tells learner to drop a print that is gone). |
| **P1** | Anchor free-form stdout units to solution-panel phrases | **6** instruction micro-edits (T1-A-E3, T2-B-E3, T3-A-E3, T3-B-E3, T4-B-E2, T4-B-E3). |
| **P2** | Expand thin retrospectives / feedback / iDo closes | Applied full or near-full replacements from the R2 report on priority units; T2-B-E2 feedback↔retro deduped. |
| **P3** | Optional self-checks | T1-A-DEMO and T3-B-DEMO retrospectives gained one self-check question each. |

**Code/outputs:** no solution `output` strings changed. Starter defects (pedagogical) preserved; only residual `print('ok', True)` noise removed from starters.

## Changes by unit

### P1 — Starter integrity
Removed trailing `print('ok', True)` from weDo starters:

T1-A-E1, T1-A-E3, T1-B-E1, T1-B-E2, T1-B-E3, T2-A-E1, T2-A-E2, T2-A-E3, T2-B-E1, T2-B-E2, T2-B-E3, T3-A-E1, T3-A-E2, T3-A-E3, T3-B-E1, T3-B-E2, T3-B-E3, T4-A-E1, T4-A-E2, T4-A-E3, T4-B-E1, T4-B-E2, T4-B-E3.

Legitimate `print('ok', normalize_email(...))` in T2-B-E1 left intact (canonical success format).

### P1 — Free-form stdout anchors
| Unit | Instruction change |
|------|--------------------|
| T1-A-E3 | Step 3: `causa` must name compuesta vs combining mark; align to solution panel if exact compare |
| T2-B-E3 | Step 3: política line aligned to panel (un @, local/dominio, cero espacios; sin entregabilidad) |
| T3-A-E3 | Step 3: uso line aligned to panel (search=extraer; fullmatch=validar campo exacto) |
| T3-B-E3 | Step 1: four prints match panel policy (peligroso / hang-CPU / mitigación / preferir pasos) |
| T4-B-E2 | Step 3: `reason` must mention similitud parcial + revisión humana; canonical panel phrase if exact compare |
| T4-B-E3 | Step 1: three prints match canonical panel lines |

### P2 — Retrospectives expanded (hand)
| Unit | What stuck / misconception / transfer |
|------|--------------------------------------|
| T1-A-E1 | NFC unifies ≠ invents; empty stays empty; bridge casefold |
| T1-A-DEMO | Self-check on NFD code points; classic CRM blame |
| T1-B-DEMO | first/last US or delete `del`; conserve raw |
| T1-B-E1 | Losing second given token |
| T1-B-E2 | No magic particle deletion; `de la Cruz` limit → review |
| T1-B-E3 | fail-closed / CP-N1-B mononym risk |
| T2-A-DEMO | Premature “smart” regex for hyphen/abbrev |
| T2-A-E1 | `split` does not strip; compare `' Ana '` vs `'Ana'` |
| T2-A-E2 | `+` loop garbage at edges |
| T2-A-E3 | “I need re because it looks like a phone” |
| T2-B-DEMO | Stricter ≠ better quality (plus tags) |
| T2-B-E1 | Empty local/domain after `@` |
| T2-B-E2 | Dedup: feedback = symbols; retro = operator misconception |
| T3-A-DEMO | Log pattern reused as form validator |
| T3-A-E3 | Copy log pattern into form gate |
| T3-B-DEMO | Self-check: findall vs finditer position info |
| T3-B-E1 | Any 9 digits ≠ PE mobile |
| T3-B-E2 | Silent case → empty list |
| T3-B-E3 | Do not run hostile strings “to prove hang” |
| T4-A-DEMO | 0.67 → auto-merge accounts |
| T4-A-E1 | Jump straight to similarity |
| T4-A-E2 | Partial score ≠ “same person” |
| T4-A-E3 | Soft threshold fabricates merges |
| T4-B-DEMO | Accuracy without naming error type |
| T4-B-E1 | Inverted FP/FN trains bad review policy |

### P2 — Feedback expanded
| Unit | Repair |
|------|--------|
| T1-B-E1 | Heurística ≠ RENIEC / parentesco |
| T2-A-E3 | isalnum vs digits; no operator/length here |
| T4-A-E1 | Full pipeline; FN / fragile merges |
| T4-A-E3 | Soft exact fabricates merges; no “same person” |

### Unchanged (already A / no residual required)
- youDo (context/objectives/requirements/rubric/retrospective)
- Theory blocks
- Solution code and expected outputs
- T1-A-E2 (no residual print; strong casefold pedagogy)

## Acceptance checklist (spec §11)

- [x] Every non-trivial unit has `preamble` + `retrospective`
- [x] We Do has short `title`
- [x] `instruction` is task-only (not the whole essay)
- [x] Exact outputs preserved (no solution output edits)
- [x] Spanish PE; no real PII
- [x] No generators used
- [x] Section source typechecks (`tsc --noEmit` exit 0)

## Residual risks (post-fix)

1. **Prose exact-match** still depends on UI using solution panel phrases; anchors reduce but do not eliminate learner paraphrase risk if graders ignore the panel hint.
2. **T1-B-E1 / E2** still share `given = toks[0]` defect surface — intentional; prose remains non-clone.
3. **T2-A-E3 vs T2-B-E2** phone reinforcement remains intentional (PE framing only on T2-B).
4. Ethics wall intact: no parentesco/identidad legal auto-claims; no scraping/HTTP/SQL scope creep.

## Validation

- Manual re-read of edited pedagogical fields against R2 priority list
- Grep: no residual `print('ok', True)` in starters
- `npx tsc --noEmit -p tsconfig.json` → success

Section 7 exercise pedagogy has been fixed and validated under strict anti-aberration rules. Ready for the next section.
