# Review of the GLM lane's exam-bank work (2026-10-06/07)

The GLM lane (a glm-5.3-flash orchestrator routing codex; `docs/agents/MODEL_ROUTING.md` in the
owner's checkout) left exam-bank work uncommitted in the owner's working tree at base 29f0af20:
118 rewritten questions in five banks (S05, S08–S11), answer-position rebalancing, an applier, a
rebalancer, schemas and new audit checks. This folder records a read-only validation of it.

- `synthesis.md` — the recommendation: adopt 110 of the 118 rewrites, send 8 back to Codex, do not
  land the tooling as it stands, record the decision as D21 (D15 collides with main), and seven
  owner decisions.
- `lanes.json` — the five analysis lanes: diff integrity, tooling review, item quality (against
  the NBME Item-Writing Guide), docs check, and the first cue-measurement attempt (failed: a
  permission prompt was rejected overnight).
- `cue_measurement_retry.json` — the retried cue measurement: the length-cue ratchet falls
  1125 → 1079; correct answers at position B 952 → 916 of 1248; 29 banks still all-B.

The "five banks are missing" premise of the GLM lane's D15 (and of an earlier claim by the lead) is
false: all 52 active sections had 24-question banks at the base. The five keys were double-quoted
in `prisma/seed.ts`, and parsers that read only single-quoted keys missed them. The real authoring
gap is S12 and S13, whose 48 questions are a single templated stem.
