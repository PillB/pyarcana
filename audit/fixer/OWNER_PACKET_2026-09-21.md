# What still needs you (2026-09-21)

You asked me to answer the open decisions myself with the project's heuristics, researched best
practice and prior art, and to bring you only what that cannot settle. Of 158 questions, 95 are
now answered: 31 were already settled by rulings you had given (D1–D11 and the standing policy),
64 the evidence settles, and 4 were refuted outright. The full record, with the reasoning, the
sources and the adversarial judge's verdict on each, is in `DECISIONS_2026-09-21.md`.

What is left is 59 items, and they are not 59 questions. They are ten, because each group stands
or falls on one choice you have to make — every one of them either changes what a credential says,
relaxes a gate, restructures a practice layer, or edits `learning_roadmap_52_V3.md`, which
AGENTS.md reserves to you. Each carries my recommendation; say "as recommended" and I implement.

They are ordered so the earlier answers unblock the most later work.

---

## 1. Badges: withdraw what the platform cannot evidence?

**Recommendation.** Yes — and publish only two classes for now: the five progress markers (class
A), relabelled as self-reported progress, and knowledge badges (class B) backed by the
server-graded exams, once the exam repairs below land. Suspend classes C and D until the server
stores a submission, a grader result and a recorded defense. Withdraw every `public_claim`,
`skill_node` and rubric criterion that names evidence nothing records, and drop the retroactive
re-issue paths, which D11 already forbids.

**Why it is yours.** Every line of it changes what a credential claims — `badge_catalog.json`,
the signed capability statement, `credential-policy`, the badge notice and the dashboard copy.

**Unblocks.** The award engine, the credential route, the exam work below, and 16 badges whose
`required_sections` point at sections teaching something else.

*Decisions: BSC-01, BSC-03, BSC-05, BSC-06, BSC-07, BSC-08, BSC-09, BSC-11, BSC-13, BSC-15,
AE-03, AE-04, AE-05, AE-09, AE-10, AE-11, AE-15, AE-16, EXAM-03.*

## 2. Exams: one conjunctive rule, and what we say about who took them

**Recommendation.** A badge's exam component requires **≥ 7/8 on the best of at most three
attempts in each required section** — the rule the credential route already applies — through one
shared function, and the claim is worded as that observed rule, not as a statement about true
ability. Say plainly that PyArcana does not supervise exams: declare, don't pretend to defend.
Keep the attempt cap but stop counting abandoned attempts, and publish the badge floor in the
result screen, which today says "Aprobado" at 70 while the badge needs 85.

**Why it is yours.** It sets a gate threshold and it decides what the credential asserts about
identity.

*Decisions: EXAM-09, EXAM-12, EXAM-13, EXAM-16, PG-10.*

## 3. The section lock V3 announces: build it or stop announcing it?

**Recommendation.** Stop announcing it. Remove "70% desbloquea la siguiente sección" from the
self-check and the dashboard, in both languages, rather than building a lock that the static
GitHub Pages edition cannot enforce anyway. Separately, completion must stop being a toggle: a
second passing attempt currently un-completes the section.

**Why it is yours.** The first half edits a learner-facing promise that V3 makes; the second
changes the progress contract.

*Decisions: PG-1, PG-5.*

## 4. Level 1: the practice layer, and CP-N1-A's schema

**Recommendation.** Move the parts of CP-N1-A that need functions, dicts and exceptions to the
sections that teach them (S05, S06, S09), and give each increment a written record schema instead
of changing it silently at every step. This is Q3's route 2, which the evidence supports: the
capstone already assumes knowledge the course has not given, and D11 puts "rewrite the
dependencies" ahead of "move the work" only when a primer suffices, which here it does not.

**Why it is yours.** It restructures a practice layer and moves graded work between sections.

**Unblocks.** The D9/D10 content rows in the work queue (entrypoints and `try`/`except` in
S02–S09), which touch the same starters.

*Decisions: L1Q3-6, L1Q3-7, L1Q3-8, PU-6, PU-11.*

## 5. Capstones: versioned contracts, or a narrower CP-FINAL claim?

**Recommendation.** Versioned contracts. Each capstone emits a declared interface, the next one
consumes it, and CP-FINAL integrates them for real; the eleven packages that ship
`assert True  # placeholder` get tests that can fail, and the briefs stop describing their
contributing sections with another curriculum's topics. If you would rather not fund that,
the alternative is honest and much cheaper: CP-FINAL stops claiming integration and becomes a
thirteenth independent project.

**Why it is yours.** It rewrites public briefs and rubrics, and either answer changes what the
final credential represents.

*Decisions: CC-01, CC-04, CC-06, CC-07, CC-2, CC-3, CC-4, CC-6, CC-7, CC-8, CC-10, CC-11.*

## 6. Hours: which number do we advertise?

**Recommendation.** Publish **bands, not point estimates**, and make the advertised total follow
the content: the code sums to 491 h, V3 and the README say 1,040 h, and the certificate prints a
fixed "1040h". Recompute per section from the model, publish P25–P75 bands, and add a gate that
fails when a section's declared hours drift from its content. On measuring real time on task: my
recommendation is **not** to collect it — the static edition has no server, and the privacy cost
outweighs a number you can validate with a small supervised pilot instead.

**Why it is yours.** The certificate is a credential claim, and measurement is a privacy and
product-scope decision.

*Decisions: H-2, H-3, H-11, H-12, CC-11 (S52's 29 h against its own 80 h plan).*

## 7. Green gates: CI runs what the repository claims

**Recommendation.** Yes — CI runs all 13 capstone suites and the completion gate, and the
repository stops describing itself as complete while `course_complete` reads false. Retire the
award vocabulary (`formally_passed`) from the build ledger; correct past product claims by dated
supersession, never by editing the captures in place.

**Why it is yours.** It changes `.github/workflows/`, a protected path, and what the repository
publicly claims about itself.

*Decisions: GGL-03, GGL-05, GGL-08, GGL-09, GGL-10.*

## 8. Artefact sections: hosted CI first, or keep simulating?

**Recommendation.** Hosted-CI-first with a local path offered. S41, S43, S44 and S47 grade a
FastAPI service, a Dockerfile and Compose file, a CI workflow and a model registry that the
learner never actually builds or runs; the fix is for the default execution surface to be a
GitHub Actions run in the learner's own repository, with the run URL and image digest as
evidence. Separately: Level 2 spends seven sections on pandas, NumPy and matplotlib and then no
section after S20 uses them — either bring the data stack back into later work or stop claiming
it as a level outcome.

**Why it is yours.** It adds an external dependency to the learner's path and changes what four
badges may claim.

*Decisions: SIM-03, SIM-04, SIM-09, SIM-12.*

## 9. Authentic evaluation: fund the 196 missing topic evaluations, or amend V3?

**Recommendation.** Fund it, built level by level, with the topics feeding gate sections first,
and keep the ratchet visible in CI so the shortfall is never hidden behind a green gate. V3
prices this layer into every section's hours; 196 of 208 were never built — 392 tasks, the
largest single authoring cost left in the campaign. If you narrow it instead, the hour figures
and every learner-facing statement about authentic evaluation get restated in the same change.

**Why it is yours.** It is the biggest remaining spend, and the alternative amends V3.

*Decisions: PU-13.*

## 10. V3 itself: may I amend it?

**Recommendation.** Yes, for two narrow classes only: the capstone briefs' "Prerrequisitos" lines
that name sections by pre-V3 topics, and the level-exit lines the evidence shows the course does
not deliver. Every edit dated and listed, nothing else touched.

**Why it is yours.** `learning_roadmap_52_V3.md` is a protected path and the curriculum contract.

*Decisions: AV3-5, AV3-8.*

---

## What I am doing meanwhile, without waiting

The 64 self-answered decisions need nothing from you, and I am implementing them in the queue's
order — beginning with the ones that unblock content work: D9's entrypoint removal across S02–S09
(L1Q3-1, which your D9 already settles), `try`/`except` before S09 (L1Q3-2), `lambda` and
`unittest` before the sections that teach them (L1Q3-3, L1Q3-4), and the playground that runs
another section's topic (AV3-6). The 31 already-decided ones are being applied as what they were:
your existing rulings, now with the sites listed.
