# G0 synthesis — the adversarial gate on the 52 → 55 renumber (2026-10-05)

## Outcome
- 15 agents: 3 claim verifiers, then 4 review rounds (anti-challenge → VP + red team).
- Verifiers: 31 load-bearing claims, 18 TRUE, 13 PARTLY, 0 FALSE. Corrections that changed the design:
  RT-B1 (a one-commit renumber removes 0 exercise ids — the sentinel is blind to meaning, not tripped);
  VP-0 (4 of the 5 badge inversions are real, not slug artefacts); RT-G1 (the credential route
  returns 403 for every credential today; no badge holder exists, so no learner is affected yet).
- Blocking issues per round: 7 → 5 → 4 → 3. NOT converged: the cap stopped the loop with 3 open.
- Both reviewers approve placement G with changes in every round from round 2 on.
- Record in this folder: `reviews_round0/` (red team, VP, contract-surface map, lead findings F1–F9),
  `verified_facts.json` (the 31 checked claims), `review_rounds_1-4.json` (every round's VP and red-team
  verdict and blocking issues), `design_G_round4.md` (the anti-challenge's final design),
  `badge_sections_by_title.txt` (every badge's sections by slug and by real title), and
  `render_roadmap.py` (the roadmap renderer: byte-identical on no insertions; falsified once).

## The three round-4 blockers, fixed here (lead)
1. VP R4-B1, wrong statistics. 2/20 vs 7/20 is an absolute difference of +25 pp, a risk ratio of
   3.5, and a relative lift of +250 %. The design called 3.5× the "relative lift". S19-T3-B-E3 reports
   all three under their own names, and bootstraps the CI of the relative lift. The pinned strings
   name `riesgo_relativo=3.5` and `lift_relativo=2.5` separately.
2. Red R4-B1, Phase 0b cannot go green. The guard scripts (old 0b-h) merge FIRST, with their
   mutation test, in the same PR that wires their sentinel-job steps (old 0b-a's step list). No step
   ever calls a missing file. The sentinel's `activeCount === 52` (preservation_sentinel.mjs:159)
   becomes G-11(e) "the roadmap's heading count", and that change is named inside decision 3, so it
   is approved, not assumed.
3. Red R4-B2, decision 17 contradicts the owner's rule. Dropping an untaught claim is a removal with
   no pickup. It is no longer offered as a routine option. It goes to the owner as a genuine conflict
   (question 3 below).

## Placement G
```
old:   S01 … S18 │       S19 … S32 │       S33  S34 │       S35 … S52
new:   S01 … S18 │ S19 │ S20 … S33 │ S34 │ S35  S36 │ S37 │ S38 … S55
shift:      0    │ new │    +1     │ new │   +2     │ new │    +3
```
- S19 Inferencia (N2), after EDA. Joins CP-N2-B (S18–S22).
- S34 Regresión lineal y regularización (N3), heads the ML block. Joins CP-N3-B (S32–S36).
- S37 Diseño experimental y causalidad (N3). Opens CP-N3-C with a randomized pilot of the triage
  threshold. It must follow old S33/S34: IPW needs their logistic model and calibration, and CUPED
  needs S34's OLS slope.
- Levels 13 / 14 / 15 / 13. Hours 491 → 518.

## The owner's answers, 2026-10-05 (OWNER_DECISIONS.md O16–O18)
- **Placement: as ruled**, not G. S19 *Inferencia* and S20 *Diseño experimental* in N2, S35
  *Regresión y regularización* at the head of the N3 ML block. The design is re-cast to it; the
  fifth and last review round (the cap) runs on the re-cast.
- **Gate A: approved in full** — CI and guards on `curriculum/55`, the deploy gate, counts-free
  positional claims with the industry catalog synced, the S18 and glossary edits.
- **Untaught claims** (deep learning, fine-tuning, graph-RAG): teaching debts, never dropped.
- Still open: Gate B (before the renumber) and Gate C (claim text).

## Round 5, the cap, on the ruled placement (2026-10-06)
- The anti-challenge re-cast design G to the ruled placement (`round5/recast_design_before_review.md`).
- The VP and the red team reviewed it once more (`round5/review_A.json`, `review_B.json`): 3 blocking
  issues, all narrow — a sense guard that the owner-ruled titles would fail; the teaching-debt guard
  (O18) with no defined input; S20's You Do leaning on the reports factory taught three sections later.
- The anti-challenge conceded all three and revised (`design_ruled_final.md`, the design of record).
- A closure check, not a sixth round (`round5/closure_check.json`), found all three resolved, no owner
  decision contradicted, and five small factual slips. The lead corrected all five in the design of
  record; each correction is marked "corrected after the closure check".
- Two consecutive quiet rounds were **not** reached within the cap of five: 7 → 5 → 4 → 3 → 3 blocking,
  each round narrower than the last. The record is the closure check plus those corrections.
- The design of record lists the Gate B decisions (§5) and the Gate C text sign-offs.
