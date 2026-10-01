# Rating the GLM-5.3 lane's S03, and what it takes to adopt it

A second lane (`docs/agents/MODEL_ROUTING.md`: a `glm-5.3-flash` orchestrator routing codex for
authoring) ran its own S03 route-2 rebuild on 2026-09-30, recorded in
`audit/fixer/cycles/SOLARIZE-V22-2026-09-30.json` as "17/17, 14 codex deliveries, all gates
green, browser evidence". It sits uncommitted in the main checkout at base `29f0af20`, which
predates this branch's S02 and instrument work.

Measured here, not taken on report. Both versions were put through this branch's instruments —
which see dict literals and `!r`, and which their base does not have.

## The rating

| | this branch (round 1) | the GLM lane |
|---|---|---|
| S03 surprising uses | 29 | **0** |
| course-wide surprising uses | **127** | 180 |
| `def` / `return` / `for` / dict literals in S03 | 39 / 203 / 35 / 82 | **0 / 0 / 0 / 0** |
| programs | 66 | 66 |
| lines | 2,649 | 4,277 |

**Their section is better than mine and finishes the job mine only started.** Route 2 is complete:
no construct from S05, S06 or S09 survives anywhere in S03, every one of the 66 programs is kept,
and the section grew by 1,628 lines to carry the case-block convention. My round removed 17 of 52
`for` uses and left the `def` validators untouched.

**And it cannot be adopted as it stands**, because it takes the course backwards: course-wide
surprising uses rise 127 → 180. The gate rejects that outright, and it is the one number the
campaign is driving to zero.

## Why the course-wide number rises: three held definitions were removed

A held definition is the earliest explanation of a concept in all 52 sections. Removing one
exposes every use it was masking, at once — the failure class `LEDGER_NOTES` records three times
and `apply_patches.py` now refuses.

| concept | was defined at | now first defined at | uses exposed |
|---|---|---|---|
| `set` | `S03-T1-A.p2`, «Un `set` reúne valores sin repetirlos» | S11 | **63** |
| `return` | `theory[3].p3` | S05 | 14 |
| `parameter` | `theory[3].p1` | S05 | 6 |

`theory[3]` («Una regla con nombre: `def`, llamada y `return`») is gone, which is also what
**O7** forbids: it is the 42nd program against a floor of 41, and a previous round that replaced
it exposed 58 uses and was discarded. The `set` loss is larger than either and was not on
anyone's list: the `match`/`case` subtopic and the `TIPOS_DOC` catalog went with it.

## The owner's decisions it does not meet

None of this is their error. `OWNER_DECISIONS.md` is on this branch, not in their tree, so O1–O9
were never visible to that lane.

| | required | in their S03 |
|---|---|---|
| O1 | money accepts `int` **and** `Decimal` | no dual check |
| O3 | `contacto` aligns to S02's ten characters | no contacto invariant at all |
| O4 | `monto_ingreso`, S02's raw line travels | neither |
| O5 | CP-N1-A label removed | 2 mentions remain |
| O7 | `theory[3]` stays, bridge non-optional | block removed |
| O8 | S03-T1-A-E3 replaced | `is_vs_eq.py` gone — verify it was replaced, not dropped |

Open from the red team and still open here: the guard technique carries four names in their text
(«guarda» 17, English «guard(s)» 4, «salida temprana» 2).

## How it is adopted

Their section is the base; this branch supplies what the base was missing. In order:

1. Restore the three held definitions — `set` in T1-A, and `theory[3]` whole, per O7 — written
   into the case-block convention rather than pasted back.
2. Apply O1, O3, O4, O5 to the rebuilt practice.
3. Fix the guard terminology to one Spanish term, and enumerate every site.
4. Re-gate against this branch's baseline: course-wide must be **≤127**, S03 **0**, and the
   readiness rows unmoved.

Steps 1–3 are codex's to write; the measurement is this branch's.
