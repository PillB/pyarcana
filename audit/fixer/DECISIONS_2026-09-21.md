# Owner decisions, decided (2026-09-21)

The self-answering pass over the questions the red team and the fixer campaign had left for the
owner. Thirteen clusters, one decider each, then an adversarial judge per cluster that re-read
every cited ruling and source and tried to refute the decision. Where the judge corrected the
classification, the judge's stands. 158 decisions.

- **ALREADY_DECIDED** — an existing ruling settles it (cited).
- **SELF_ANSWERED** — heuristics, research and prior art settle it, and nothing on AGENTS.md's
  Ask-first list is needed to implement it.
- **RECOMMENDED_ASK_FIRST** — settled on the merits; implementing it touches something reserved.
- **OWNER_CALL** — research cannot settle it; a recommendation is given anyway.

The residue that still needs you is in `OWNER_PACKET_2026-09-21.md`. Full agent transcripts:
`.claude/projects/…/subagents/workflows/wf_8fde40a5-0b4/`.

| Classification | Count |
|---|---|
| SELF_ANSWERED | 64 |
| RECOMMENDED_ASK_FIRST | 50 |
| ALREADY_DECIDED | 31 |
| OWNER_CALL | 9 |
| REFUTED | 4 |

## Exam validity and grading

**EXAM-01 · ALREADY_DECIDED** · judge: amended

*Q.* What could the credential-issuance 403 fix (task_c415ab04) merge, and when can section-exam
scores count toward a signed credential? (gap rank 1)

*A.* Keep the decision, but (a) state the closed switch as D12's amended rule, not the
gradingVersion filter alone: isEvidence(a) = completed AND gradingVersion >= 1 AND exposedItems
=== 0 (src/lib/exam-scoring.ts:73-82 on the branch, GRADED_AS_EVIDENCE = { gradingVersion: {
gte: 1 }, exposedItems: 0 }); (b) replace the ICE 1100 benchmark with ICE 1100 §3.3(c) and
§3.2(i), which say what was claimed; (c) drop the implementation line 'a server verifier writing
CredentialEvidence rows' until the route actually creates a Credential row — today it cannot
(see missed item 1).

*Implementation:* Review and merge PR #70 (branch claude/brave-boyd-5da0c7). Its change to
src/app/api/credentials/issue/route.ts spreads GRADED_AS_EVIDENCE into the… | Keep
unverifiedRequirements() in src/lib/credential-gates.ts as the closed switch. Remove a component
from it only in the same PR that adds a server… | In audit/fixer/WORK_QUEUE.md under 'Spun off',
record that task_c415ab04 landed as PR #67 and that gap rank 1's coordination item is closed.
Point to…

**EXAM-04 · ALREADY_DECIDED** · judge: amended

*Q.* exam/submit grades question ids the client chooses and scores over the answers sent. How
should grading be fixed, and what happens to rows graded before the fix? (gap rank 31; red team
P0)

*A.* Keep D12 and PR #70. Delete the two 'follow-ups owed' — both already landed on PR #70's
head — and delete the two tests built on them. What actually remains owed is D12's amendment:
exposedItems, the four-tier draw order in exam/start, and isEvidence as the single rule read by
credentials, cohorts, the PDF and admin. Add the missing surface: src/lib/firebase/sync.ts
syncExamAttempt mirrors the answers string, which commit ea51d9b8 had to strip.

*Implementation:* Review and merge PR #70. Its migration 20260918230000_exam_grading_integrity
is additive and D12 authorises it. | src/app/api/cohorts/[id]/dashboard/route.ts: compute
examsPassed as the number of distinct canonical sections whose best non-legacy score is >= 70… |
src/app/api/admin/analytics/route.ts, src/app/api/admin/students/route.ts and [id]/route.ts,
src/app/api/admin/export/route.ts: exclude legacy rows… | Remove the corresponding items from
WORK_QUEUE 'Exam grading integrity' as each one lands.

**EXAM-05 · ALREADY_DECIDED** · judge: amended

*Q.* The answer key is returned and persisted after every attempt. How should V3:93 'nunca
expone claves ni variantes futuras' be read? (gap rank 33; RC-12 owner question 2)

*A.* Same reading of V3:93. Two corrections. (1) The i18n string is not simply 'kept':
DCR-2026-09-19-exam-correct-answer-string is already filed with status 'pending' in audit/safe-
agent/destructive-change-register.json on PR #70, with human_approval and verifier_approval both
null — so this is an owner approval sitting on the desk, not a decision to leave the string in
place. (2) The deep-scan test must cover src/lib/firebase/sync.ts as well as the four routes;
the Firestore mirror is a fifth learner-reachable surface and is the one PR #70's last commit
had to fix.

*Implementation:* Merge PR #70 (withoutAnswerKey, redactAttemptsForLearner in src/lib/exam-
scoring.ts; redaction in the submit, attempts, progress and start routes). | Keep the now-unused
i18n string exam.correctAnswer. The deletion budget is zero without a DestructiveChangeRequest;
WORK_QUEUE already records it. | If PR #70's tests only check named fields, add the deep-scan
test below.

**EXAM-09 · OWNER_CALL**

*Q.* How do section-exam scores combine into a badge's exam component, and is 85 the right cut
on 8-item exams taken best-of-3? Today engine.ts averages across required sections, while
credential-gates.ts requires ≥85 in each section.

*A.* Recommendation: (a), a conjunctive rule. Each required section's best counted attempt must
be ≥ 7/8. That is the rule PR #67 already applies to credentials; apply it identically in
engine.ts through one shared function. Word the claim as the observed rule ('al menos 7 de 8 en
su mejor intento de hasta tres, en cada examen'), not as a true-accuracy claim. Publish a
decision-consistency table from scripts/exam_decision_consistency.py, and recompute it from data
once each variant has n ≥ 50 (V3:95). Whatever the owner picks, three things are not optional:
one shared rule, observed-rule wording,…

*Reserved:* badge_catalog.json section_exams description and required_score_pct (what the
credential certifies).; Wording of the exam claim in public_claim and the credential policy page
(with…

**EXAM-13 · OWNER_CALL** · judge: amended

*Q.* Must the exam-backed badge resist key-sharing and identity fraud? With right/wrong
feedback, several accounts can rebuild a section's key. (RC-12 owner question 3)

*A.* Keep the OWNER_CALL, but narrow it to what the owner actually has to decide: (a) declare-
don't-defend versus (c) buy supervision, which is the credential-class question in C-badge-
scope-claims. Option (b) is not an owner call and should not be offered as one — per-attempt
shuffling is already EXAM-07 item 1, and rate-limiting exam/start plus one account per verified
email are ordinary boundary hardening under AGENTS.md › Always ('Validate untrusted input at
boundaries; fail closed'). Ship (b) regardless of which way the owner goes on (a) versus (c).

**EXAM-03 · RECOMMENDED_ASK_FIRST** · judge: amended

*Q.* Should the fixed capability statement signed at credentials/issue/route.ts be withdrawn? It
reads 'The holder independently demonstrated … including critical evidence, hidden validation,
and independent review'.

*A.* Same decision and same ask. Add AGENTS.md › Never: 'Present mocks or placeholders as
production features' to rulings_cited — the current sentence claims 'hidden validation, and
independent review' that no code performs and no row records, so withdrawing it is already
required, and only the replacement wording is the owner's to approve. Replace the ICE 1100 §6.3
citation with §3.3(c) and §3.2(i).

*Reserved:* Changing what a credential claims: the signed capabilityStatement in
src/app/api/credentials/issue/route.ts:152 (AGENTS.md Ask first).; Matching wording in
badge_catalog.json public_claim /…

**EXAM-12 · RECOMMENDED_ASK_FIRST** · judge: amended

*Q.* After three failed attempts a learner is locked out of that section's exam, and of every
badge that requires it, for life. Should there be a remedial reopen (V3:91), and what does it
need first? (RC-12 owner question 4; gap rank 34's link to RC-2)

*A.* Keep the remedial route and all four ask-first items. Fix the supply invariant, which is
wrong for the same reason as EXAM-07's: define distinct variants by option set and key text, not
by whole item. Stated as 'their variants are clones', the invariant does not fail today — S12
and S13 each have three distinct stems per concept; what is cloned is the four options and the
index-1 key. Also correct the page reference: the retest sentence is on page 115 of the 2014
Standards, not 114.

*Reserved:* badge_catalog.json retake_rules text for section exams (credential policy).;
learning_roadmap_52_V3.md:91 is a protected path; implementing its remedial review needs the
owner to name who reviews.

**EXAM-16 · RECOMMENDED_ASK_FIRST** · judge: amended

*Q.* The seven misaligned badges gate on sections whose exams test other topics, and
applied_deep_learning_practice has no exam item anywhere. Should their required_sections be
repointed, and should the badge with no evidence be struck?

*A.* Keep the repoint and the ask. Three corrections before the diff goes to the owner. (1) The
list covers only 5 of the 7 badges: production_python_delivery_foundations (S15, S17, S21) is
given no destination at all, and 'containers -> S43-S45' belongs to
container_platform_engineering_practice, which is not one of the 7. (2) Reconcile with
OPEN_QUESTIONS Q1, which independently names three further drifted badges the list omits —
reliable_automation_development (S13, S24; skill in S23), independent_data_preparation (S06-S18;
real pandas cleaning in S14-S17) and applied_analytical_reasoning (S09,…

*Reserved:* badge_catalog.json required_sections for 7 badges (changes what each credential
claims).; Striking applied_deep_learning_practice (deleting tracked content:
DestructiveChangeRequest with human and…

**EXAM-02 · SELF_ANSWERED** · judge: amended

*Q.* Who sets specificationVersion on an issued credential? Today the client sends it, and the
route signs it and publishes it.

*A.* Same decision, two corrections. (1) Read the version from the badge's own catalog entry
(badge_catalog.json badges[].version, '1.0.0' today), not the catalog-wide top-level version:
OB3 §B.1.1 scopes version to an Achievement, and the badge's own public_claim already says 'bajo
la especificación PyArcana 1.0.0'. (2) Sequence it with EXAM-03, not before it: both rewrite the
same signed string at route.ts:152, and EXAM-03 is Ask-first, so shipping EXAM-02 alone would
change the rendered text of a signed claim under a SELF_ANSWERED label.

*Implementation:* src/lib/credential-gates.ts: export CREDENTIAL_SPECIFICATION_VERSION read from
badgeCatalog.version. | Extract a pure buildCredentialPayload(spec, userId, now) from
src/app/api/credentials/issue/route.ts, so tests can reach it without opening issuance. |
route.ts: remove specificationVersion from CredentialIssuanceRequest and from the 400 check
(:91-97). Use the constant in credentialWithoutSig and in… | docs/ELI5_DYNAMIC_LMS_SETUP.md:
update the request example.

**EXAM-06 · SELF_ANSWERED** · judge: amended

*Q.* Under D12 the key is never shown. What feedback should a learner get after an attempt?

*A.* Same two-layer feedback design. Correct the identifier: the repo's subtopic ids are Sxx-
Ty-A / Sxx-Ty-B (src/lib/course/sections/s04-iteration-summaries.ts:80 `subtopicId: "S04-T1-A"`
through :336 `"S04-T4-B"`), matching AGENTS.md's exercise invariant Sxx-Ty-Z-En. There is no
Sxx.Tn.U1/U2 scheme anywhere. Link to the S04-T1-A style anchor.

*Implementation:* Use the concept-to-subtopic map from EXAM-15 (course-
state/exam_concept_map.json), exposed through a helper in src/lib/exam-scoring.ts. |
src/components/course/ExamView.tsx result screen: a 'Qué repasar' block listing the wrong
concepts' subtopics as links to their anchors in the… | src/lib/i18n.ts: new strings for es-PE,
es and en; codex authors the learner-facing Spanish. | No API change: redacted detailedAnswers
already carry concept and correct.

**EXAM-07 · SELF_ANSWERED** · judge: amended

*Q.* The bank gives away its key through position (952 of 1,248 keys are B; answering B to
everything passes 33 of 52 sections with certainty), through length (the key is the uniquely
longest option in 1,156), and through cloned variants (16 concepts in S12/S13). How should it be
repaired, what gate keeps it repaired, and…

*A.* Keep all seven parts, but fix the clone criterion and two implementation lines. (1) Define
a distinct variant by its OPTION SET and key text, not 'normalised stem + options + key'.
Measured with the repo's own parser: 0 of 416 concepts have a single distinct (stem, options,
key) triple, but exactly 16 concepts — all 8 in apis-sql-geo (S12) and all 8 in evidence-
dashboard (S13) — have three distinct stems sharing ONE option set with the key at index 1 in
all three. Under the decision's own definition the ratchet does not fire on S12/S13 and its
proof test passes. (2) The CI wiring line is…

*Implementation:* src/app/api/exam/start/route.ts (on top of PR #70): per selected question,
draw a random permutation. Store options in permuted order and… | src/lib/exam-scoring.ts:
toFormItem accepts a permutation and adds contentHash = sha256(normalised stem + sorted options
+ key text). | scripts/exam_selfcheck_pedagogy_audit.py: add --ratchet computing, per section,
exact P(pass first attempt) for the strategies {A, B, C, D, longest,… | prisma/seed.ts: section-
by-section rewrite (codex authors; tooling applies), starting with gate sections S04, S08, S13
and S12's and S13's cloned…

**EXAM-08 · SELF_ANSWERED**

*Q.* Which attempt counts toward a knowledge badge or credential: first, best, or 0.9 × best +
0.1 × worst? (gap rank 35; RC-12 owner question 1)

*A.* Option B. The best counted attempt per section counts: completed, gradingVersion ≥ 1, not
legacy. Every attempt is kept. The evidence record for each section carries the best score, the
attempt number that produced it, and the number of counted attempts. The chance inflation that
best-of-3 introduces is handled by the aggregation and the cut (EXAM-09), not by throwing
attempts away. The rule applies only to attempts graded from now on (D11).

*Implementation:* src/lib/exam-scoring.ts: add examEvidenceBySection(attempts) returning, per
canonical section, {score, attemptNumber, countedAttempts,… | src/lib/credential-gates.ts
countPassedSections, src/components/course/PdfReport.tsx, and
src/app/api/cohorts/[id]/dashboard/route.ts use it. The… | The credential and evidence payload
records attemptNumber and countedAttempts per section, as an OB3 Result with resultType Percent
linked to a…

**EXAM-10 · SELF_ANSWERED**

*Q.* The attempt cap counts abandoned attempts, and there is no way to resume. On PR #70,
reloading the page during an attempt starts a new one, and the open one later closes at 0 and
uses up one of the three attempts. Resume, or count only completed attempts? (gap rank 34)

*A.* Resume. exam/start returns the learner's open, unexpired attempt for that section: the same
attemptId, the same questions in the same option order from its ExamAttemptForm (without the
key), and the remaining time computed from the server's startedAt. It creates a new attempt only
when none is open. D12's rule is unchanged: an attempt past its deadline is closed at 0 and
counts. At most one open attempt per learner per section. ExamView labels the button 'Continuar
intento n' and runs the countdown from the server's startedAt.

*Implementation:* src/app/api/exam/start/route.ts (on PR #70): after closeExpiredAttempts, if a
non-completed attempt exists, load its ExamAttemptForm and return… |
src/components/course/ExamView.tsx: on mount, if /api/exam/attempts lists an open attempt, show
'Continuar intento n'. The countdown uses the… | src/lib/i18n.ts: exam.resume strings (codex
authors the Spanish).

**EXAM-11 · SELF_ANSWERED**

*Q.* The badge floor is hidden. A learner told 'passed' at 75 can never earn a badge that lists
that exam, and the engine promises a cool-down retake that exams do not have. What should
learners be told?

*A.* The exam intro and the result screen say: - the section pass mark (70); - the badge and
credential floor, read from provisional_floors.section_exam_pct (85), and that a pass between 70
and 84 does not reach it; - the combination rule once EXAM-09 is decided; - that the best
counted attempt is what counts (EXAM-08); - how many attempts remain, and that an expired
attempt counts; - that keys are never shown (D12); - what happens after three failed attempts
(EXAM-12, or 'no hay más intentos' until it exists). The blocking reason at engine.ts:325 must
stop promising 'You can re-attempt this after…

*Implementation:* src/components/course/ExamView.tsx: the intro card and result card render the
floor from badgeCatalog.provisional_floors.section_exam_pct. For a… | src/lib/i18n.ts: update
exam.rulesDesc and exam.antiPlagiarismDesc in es-PE (:101, :114), es (:376, :389) and en (:651,
:664), with {floor} and the… | src/lib/eligibility/engine.ts:320-326: component-specific
blocking reasons. For section_exams, cite the attempt rule, not a cool-down.

**EXAM-14 · SELF_ANSWERED** · judge: amended

*Q.* How should exam variants for code concepts be written, so that forms are truly parallel,
keys are correct, and the bank can grow (for the bank repair, the reopen and collusion
resistance)?

*A.* Keep the generator. Add the constraint the decision omits: distractors must be homogeneous
with the key in form, not merely different from it. Haladyna guideline 23 ('Keep choices
homogeneous in content and grammatical structure') and 24 ('Keep the length of choices about
equal') mean a 'predice la salida' item whose key is the only clean stdout and whose three
distractors are tracebacks or error text has simply swapped the length cue for a shape cue.
Require every mutation to produce well-formed output of the same shape as the key, and feed the
generated items through EXAM-07's own…

*Implementation:* scripts/exam_item_generator.py (new): reads course-
state/exam_generators/Sxx.json templates, runs under .venv-content (refuses under any other… |
scripts/exam_selfcheck_pedagogy_audit.py: add an 'execution-keyed' check. It re-runs every
generated item and fails if the keyed option differs from… | Start with the gate sections' code
concepts (S04, S08, S13), then the sections with the heaviest length cue.

**EXAM-15 · SELF_ANSWERED** · judge: amended

*Q.* Exam concepts carry no link to the subtopic or skill they test, so nothing can check that a
badge's exam evidence measures the skill it claims. Research found 7 of 16 applied-skill badges
with zero on-claim items. How should concepts be tagged and alignment checked?

*A.* Keep the tagging and both checks, with two corrections. (1) Tag against the ids that exist:
src/lib/course/sections/*.ts carry subtopicId values of the form S04-T1-A ... S04-T4-B (eight
per section, matching AGENTS.md's Sxx-Ty-Z-En invariant). There is no Sxx.Tn.U1/U2 scheme in
learning_roadmap_52_V3.md or anywhere in the repo. (2) Do not pin the baseline at 7. Regenerate
the misaligned-badge set with the new tagger and pin whatever it computes; the 7 comes from the
red team's self-described 'heuristic' regex match of stems against claim vocabulary, and pinning
an unreproduced heuristic as a…

*Implementation:* course-state/exam_concept_map.json: {sectionId, concept, subtopicId,
skill_nodes[]}. Codex proposes it; tooling validates it against COURSE_SECTIONS… |
scripts/exam_selfcheck_pedagogy_audit.py or a new scripts/exam_alignment_audit.py: coverage and
alignment report, written to… | src/lib/exam-scoring.ts: a subtopicForConcept() helper, used by
EXAM-06.

*Judge's note on what the cluster missed:*

- Revocation, and the fact that the issue route never creates a Credential row. origin/main
src/app/api/credentials/issue/route.ts:164 writes `db.notification.create({ type:
'credential_issued', body:…
- D12's 2026-09-19 amendment is absent from the whole cluster. The governing rule on PR #70's
head is isEvidence(a) = completed AND gradingVersion >= 1 AND exposedItems === 0 (src/lib/exam-
scoring.ts:73-82), plus a…
- The self-check bank is never audited. self_check is one of the five entries in
unverifiedRequirements, scripts/exam_selfcheck_pedagogy_audit.py already parses selfCheck blocks
across src/lib/course/sections/s*.ts, and…
- V3:91's critical items have no instrument and no owner. The approved spec requires '100% de
los ítems marcados críticos' on every section exam, and `grep -c critical prisma/seed.ts`
returns 0 — not one of the 1,248…
- Extended time and accommodation for D12's 60-minute limit. D12 introduces a hard timer where
V3 set none, and the cluster states the trade-off in terms of learners who abandon a tab
(EXAM-10) but never in terms of…

## Platform gates: locks, completion, self-check

**PG-2 · ALREADY_DECIDED** · judge: amended

*Q.* The self-check tells the learner '70% desbloquea la siguiente sección' and the dashboard
repeats it in both languages. Nothing locks. What happens to that copy now?

*A.* The unlock promise comes out now, independently of PG-1. Replace it with what is true: the
self-check is formative, 70% is the readiness signal the course recommends before moving on, and
the next section is already open. If the owner later approves the lock (PG-1's alternative), the
promise returns when the lock ships — not before.

*Implementation:*
/Users/pabloillescas/Documents/GitHub/pyarcana/src/components/course/SectionView.tsx:871 — the
QuizTab callout 'Si sacas 70% o más, desbloqueas la… |
/Users/pabloillescas/Documents/GitHub/pyarcana/src/components/course/Dashboard.tsx:541 — both
strings: 'Necesitas 70% para desbloquear la siguiente… | Run npm run test:i18n-parity so the
es/en pair stays matched. | Codex authors the replacement Spanish per
audit/fixer/writing_rules.md; re-run npm run test:prose-quality.

**PG-1 · RECOMMENDED_ASK_FIRST** · judge: amended

*Q.* Does the platform build the section lock V3:91 announces (pass the exam to reach the next
section), or does it keep every section reachable and move the gate onto the credential?

*A.* Keep the path open and gate the credential, not the content. No section lock is built.
Amend learning_roadmap_52_V3.md:91 so that what a missing or failed exam withholds is the
section record, the badge's exam component and the level promotion — never access to the next
section — and amend :44 so 'promoción' names a credential rather than access. Keep the enforce
branch on the shelf: it becomes worth revisiting only after the item bank is valid (C-exam-
validity) and a fourth variant per concept exists to feed a remedial re-open. Record the
amendment as D12 in audit/fixer/decisions.md.

*Reserved:* Amending learning_roadmap_52_V3.md:44 and :91 — a protected path, beyond an ordinary
content round; The amendment removes a spec-level access gate, which is on AGENTS.md's 'relaxing
a gate threshold'…

**PG-10 · RECOMMENDED_ASK_FIRST** · judge: amended

*Q.* V3:91 requires '100% de los ítems marcados críticos' on every section exam. QuestionBank
has no such column, no item is marked, and nothing could enforce it. Build the gate or remove
the clause?

*A.* Remove the non-compensatory per-item clause from the MCQ exam and keep criticality where a
rubric can carry it: V3:89's topic evaluation, which already reads 'sin criterio crítico menor
que 2', and badge_catalog's critical_competency_floor. Amend learning_roadmap_52_V3.md:91
accordingly and do not add a `critical` column to QuestionBank. State the removal in D12
alongside PG-1 rather than letting it lapse silently.

*Reserved:* Amending learning_roadmap_52_V3.md:91 — protected path; Removing a spec-level gate
clause, which falls under 'relaxing a gate threshold'

**PG-5 · RECOMMENDED_ASK_FIRST** · judge: amended

*Q.* Completion is a toggle: QuizTab calls onDone on every pass, so a second pass un-completes
the section, and completedSections never comes back from the server. Is completion idempotent,
and is it derived from the sub-steps?

*A.* Yes to both, with the storage contract untouched. (a) Add idempotent setters
markSubStepDone(sectionId, step) and markSectionComplete(sectionId) and use them from every
automatic call site — QuizTab's onDone and the exam path; keep toggleSubStep only for buttons a
learner deliberately un-checks. (b) Derive completedSections as the union of the stored list and
every section whose completedSubSteps holds all five SUB_STEPS, so the server's sub-step rows
reconstitute completion on hydrate without the API having to return completedSections. (c) Keep
the storage key python-ds-progress and every…

*Reserved:* Editing src/lib/progress-store.ts — protected path, behaviour change beyond a
content round; Editing src/lib/progress-sanitize.ts — protected path, changes what hydrate
returns

**PG-7 · REFUTED** · judge: refuted

*Q.* exam/start creates an attempt row before the learner answers anything, so opening the exam
and closing the tab burns one of three attempts for life; the UI counts only completed attempts
and offers a button the server refuses; and the 'reset to allow reuse' branch would re-show an
item whose key was already published.…

*Refuted:* One of the three rules cannot be built, and the decision leaves its own governing
clause breached. (a) RULE 2 INVENTS A VALUE THAT DOES NOT EXIST. There is no exam time limit
anywhere: prisma/schema.prisma's ExamAttempt has startedAt and timeSpentSec but no limit;
neither route nor ExamView.tsx…

**PG-3 · SELF_ANSWERED** · judge: amended

*Q.* S13, S26 and S39 announce a level promotion that requires three capstones, a level
regression and a CF package. No route or Prisma model records any of the three, so every learner
is promoted by default. What do those paragraphs say?

*A.* Keep the three 'Promoción de nivel' paragraphs as written — they state a standard and grant
nothing. Record, under D11, that nothing will be back-awarded when the machinery lands. Put the
'not yet recorded' status on the product surface (dashboard/roadmap), not in section content
that also ships as the static site.

*Implementation:*
/Users/pabloillescas/Documents/GitHub/pyarcana/src/lib/course/sections/s13-evidence-
dashboard.ts:61 |
/Users/pabloillescas/Documents/GitHub/pyarcana/src/lib/course/sections/s26-integrator-
phase1.ts:60 |
/Users/pabloillescas/Documents/GitHub/pyarcana/src/lib/course/sections/s39-integrator-
phase2.ts:61 | Codex authors the three paragraphs per audit/fixer/writing_rules.md; ordinary
content round, protected dir but within the allowed scope.

**PG-4 · SELF_ANSWERED** · judge: amended

*Q.* For a signed-in learner, ExamView replaces QuizTab and nothing ever writes the section's
'quiz' sub-step, so no signed-in learner ever completes a section anywhere — report, admin view
or cohort view. Where does that record come from?

*A.* /api/exam/submit records the section's 'quiz' sub-step when the server-graded score reaches
PASS_THRESHOLD, in the same handler that writes the attempt, keyed by the canonical section id
and written as an upsert. A failed attempt writes nothing. What the record means is fixed in one
place and stated in the report: 'aprobó el examen de sección (opción múltiple, servidor, >=70)'
— a progress fact, not a mastery claim.

*Implementation:*
/Users/pabloillescas/Documents/GitHub/pyarcana/src/app/api/exam/submit/route.ts — after
db.examAttempt.update, upsert Progress {userId, sectionId:… | Extract the rule as a pure helper
(e.g. subStepsEarnedBy(score) in /Users/pabloillescas/Documents/GitHub/pyarcana/src/lib/exam-
scoring.ts) so the… | Confirm the Progress unique key in prisma/schema.prisma supports the
upsert; no schema change expected. | No change to /api/progress: it already canonicalises ids
through renameSectionId.

**PG-6 · SELF_ANSWERED** · judge: amended

*Q.* The PDF is headed 'Certificado de Finalización' at 8 of 52 self-reported sections, carries
a client-generated PYDS- id that /verify can never resolve, prints a fixed 1040h and a fixed 13
integrator projects, and labels sections with topics they do not teach. What is that document?

*A.* It becomes a progress report whose every figure comes from the learner's own records.
Rename it 'Reporte de progreso'. Delete the client-generated id (do not print an id at all until
issuance goes through /api/credentials/issue, whose ids /verify can resolve). Compute hours as
the sum of estimatedHours over the sections that learner completed, and the course total from
COURSE_META, never from a literal. Print the learner's submitted integrator projects — which is
zero today, so the tile goes. Delete the hand-written SECTION_NAMES map and print each section's
own index and title. Leave the…

*Implementation:*
/Users/pabloillescas/Documents/GitHub/pyarcana/src/components/course/PdfReport.tsx:603 — heading
to 'Reporte de progreso'; :609 keep the existing… | PdfReport.tsx:479 — delete `const certId =
...`; :638 — delete the printed id. | PdfReport.tsx:618 — hours computed from
COURSE_SECTIONS[].estimatedHours over the learner's completed sections, with the course total
read from… | PdfReport.tsx:622-623 — remove the '13 / Proyectos integradores' tile until a
submitted-project record exists.

**PG-8 · SELF_ANSWERED** · judge: amended

*Q.* The result screen says 'Aprobado' at 70 and never mentions that the badge's exam component
requires 85, so a learner can be told they passed every section and still earn nothing.

*A.* The result screen states both numbers, each from one source: the section record passes at
PASS_THRESHOLD (70) and the badge's exam component requires 85
(industry_alignment/badge_catalog.json:1104, 'Exams are server-graded MCQs (pass@70 baseline);
the badge floor is stricter at 85%'). Read the floor from a helper that resolves it from the
catalog for that section, never a literal 85 in the component, and say nothing when no badge
covers the section. Neither number changes here — changing a floor is reserved, and whether 85
survives belongs to C-exam-validity.

*Implementation:* New helper (e.g. badgeExamFloorForSection in src/lib/eligibility/) reading
industry_alignment/badge_catalog.json's required_score_pct for the… |
/Users/pabloillescas/Documents/GitHub/pyarcana/src/components/course/ExamView.tsx:296-322 —
under the pass/fail line, print the section result and… | New i18n keys in src/lib/i18n.ts (es
and en), then npm run test:i18n-parity. | Do not touch PASS_THRESHOLD in src/lib/exam-scoring.ts
or any value in badge_catalog.json.

**PG-9 · SELF_ANSWERED** · judge: amended

*Q.* The self-check highlights the correct option after every submission and its retry only
clears the answers, so the second attempt is the same eight items with the key already shown.
What does a retry show?

*A.* Split 'whether you were right' from 'what the right answer was', as Moodle's review options
do. On a failed attempt, show which items were wrong and the concept-level explanation; do not
reveal the correct option. Reveal the key when the learner passes, or when they explicitly ask
for it (an opt-in 'ver respuestas' that ends the round). Shuffle the option order on each render
so position stops being a cue. Drawing genuinely different items on retry waits on the bank
repair (C-exam-validity) — until then, do not ship the same eight items with their keys already
on screen.

*Implementation:*
/Users/pabloillescas/Documents/GitHub/pyarcana/src/components/course/SectionView.tsx:889 — gate
the `showCorrect` styling on (passed ||… | SectionView.tsx:852-853 (handleRetry) — keep clearing
answers; add the per-attempt option shuffle (a seeded permutation per render so the mapping… |
Extract the view rule into a pure helper (e.g. selfCheckReview(answers, questions, {passed,
revealed})) so it is testable without the DOM. | Add the opt-in 'ver respuestas y terminar'
control plus its es/en i18n keys; re-run npm run test:i18n-parity.

*Judge's note on what the cluster missed:*

- V3:93's 'nunca expone claves' is breached in the live API and no decision addresses it.
gradeExamAnswers writes correctIndex into every graded answer, submit/route.ts:75 stores the
array, /api/exam/attempts returns…
- Exam options are never shuffled. start/route.ts:145 serves `options: JSON.parse(q.options)` in
stored order, and 952 of 1,248 keys are index 1 (31 sections are 24/24 option B). Shuffling exam
options with a stored…
- Progress sync is pull-only. useServerProgressSync (progress-store.ts:218-233) hydrates server
to local and nothing ever pushes local to server; syncToServer fires only inside toggleSubStep.
A learner who worked signed…
- /api/credentials/issue counts rows, not distinct sections: route.ts:117 is
`examAttempts.filter((a) => a.score >= 70).length` against a `passedGates < 13` check, so
passing five gate sections three times each yields 15…
- V3:113 declares a second unimplemented access gate ('Un CF abierto o sin evidencia bloquea el
siguiente CF y bloquea S52'), and V3:105's checkpoint table column is 'Criterio PASS y bloqueo'.
PG-1 amends only :44 and…

## Which roadmap is the curriculum authority

**AV3-1 · ALREADY_DECIDED** · judge: amended

*Q.* Which roadmap is the curriculum authority for section identity (index, title, topic) and
the curriculum contract, and which of the two byte-identical V3 copies is canonical? (ranks 15
first half, 84; red team stale-pre-v3-numbering-is-one-regeneration)

*A.* Keep the ruling (V3 is the sole curriculum authority; nothing deleted; root copy canonical,
upload/ mirror held byte-identical by a new test). Correct the scope: course_requirements.json
is NOT the only dissenting artifact. 25 course-state artifacts assert the opposite — course-
state/s06_phase0.json:190 'learning_roadmap.md = primary IDs', s13_phase0.json:205-206
'learning_roadmap.md authority' / 'learning_roadmap.md = id/title platform',
s16_phase0.json:190, s21_phase0.json:190-191, and 21 more (grep 'learning_roadmap.md =
primary|authority|= id/title' over course-state/ returns 25 files; 80…

*Implementation:* course-state/course_requirements.json: replace authority_hierarchy[2] (:7)
with 'learning_roadmap_52_V3.md (52 sections; primary curriculum contract;… | Same file,
CONTRADICTION-001 (:45-53): keep the entry and add superseded: {date, by: 'AGENTS.md protected
paths;… | Prepend a one-paragraph 'Documento histórico (pre-V3) — no es autoritativo; ver
learning_roadmap_52_V3.md' banner to learning_roadmap.md and… | Record the entry in
audit/fixer/decisions.md as a derived decision (D12) that cites the rulings above and is marked
for owner confirmation…

**AV3-2 · ALREADY_DECIDED** · judge: amended

*Q.* PR #67 (task_c415ab04) has merged. What may open the credential-issuance switch now, and
what is still owed before it can? (rank 1, COORD)

*A.* Keep option (a) and the named-blocker predicate. Correct three pieces of evidence before
relying on it: (1) origin/main is no longer a020c3a4 — it is 70c1d840, the PR #68 merge, whose
first parent is a020c3a4; the route on the current tip is still closed (route.ts:126 refuses
while unverifiedRequirements is non-empty), but 'main's tip is pinned closed' must be re-
verified at the tip that is actually deployed, not at a SHA from three days ago. (2)
expiration_policy and legacy_progress_policy are per-badge objects inside
src/lib/eligibility/badge_catalog.json, not top-level keys; cite them as…

*Implementation:* Start from origin/main. The audit branch HEAD (42337401) still has the pre-#67
route with the S04…S52 id list. | src/lib/credential-gates.ts: add issuanceBlockers(spec)
returning named blockers: every unverified component (existing), 'exam_grading_version'… |
src/app/api/credentials/issue/route.ts: refuse with 403 and the blocker list whenever
issuanceBlockers(spec) is non-empty. Ignore the client… | audit/fixer/WORK_QUEUE.md 'Spun off'
row: record that PR #67 merged by merge commit, that cc165af2 stays in history under AGENTS.md's
Never rule, and…

**AV3-3 · ALREADY_DECIDED** · judge: amended

*Q.* Do rows recorded before a section's V3 release (under a slug that now names another topic,
e.g. `numpy` → `collections`) count as evidence or completion for the V3 section the rename
moved them into? Is pre-V3 local (localStorage) completion kept? (rank 83)

*A.* Keep rules (1)-(4) and (6) unchanged. Rewrite rule (5) and the closing step. (5) The
premise is wrong: localStorage progress does carry a timestamp — progress-store.ts:21
'startDate: string | null', listed as a progress field in AGENTS.md:137-139. There are no per-
section timestamps, so nothing can be relabelled per section, but a profile whose startDate
precedes its section's cutover can carry the 'versión anterior del curso' banner without
touching a single completion, which is the honest treatment and costs nothing. Keep the migrated
keys exactly as they are (AGENTS.md:110, :135). Closing…

*Implementation:* New src/lib/section-content-versions.ts: V3_CUTOVER keyed by section index,
holding the ISO time of the first commit whose section file carries its… | New src/lib/exam-
bank-concepts.json (section index → concept names), generated from prisma/seed.ts by a script
with a --check mode. | src/lib/credential-gates.ts countPassedSections: filter attempts through
isCurrentEvidence before bestScoreBySection. | src/app/api/exam/start/route.ts: restrict
byConcept to the current concept list for the section.

**AV3-5 · RECOMMENDED_ASK_FIRST**

*Q.* How are the capstone briefs' 'Prerrequisitos' lines fixed, when they name sections by
pre-V3 topics? For example, CP-N1-B lists 'S05 (OOP), S06 (NumPy), S07 (adquisición de datos),
S08 (pandas)', where V3 teaches functions, collections, text/regex and files. (rank 80)

*A.* Generate each brief's '## Prerrequisitos' block from src/lib/capstones/catalog.ts: the
previous capstone, plus the sections from the previous gate+1 through this gate, each labelled
by its V3 title through AV3-4's module. Write it to course-state/capstones/<id>/BRIEF.md (the
source) and public/capstones/<id>_BRIEF.md (the served copy), with a --check mode that fails CI
on any difference. Resolve the one existing divergence (CP-FINAL, 4 differing lines) by reading
both copies and keeping the newer text as the source. The Remediación blocks name no sections
and are untouched.

*Reserved:* Write generated Prerrequisitos lines into 13 files under public/capstones/
(protected path, AGENTS.md:144-146).; Make public/capstones/*_BRIEF.md a generated copy of…

**AV3-8 · RECOMMENDED_ASK_FIRST** · judge: amended

*Q.* Which V3 lines does this cluster's evidence say must be amended, and in what form? (rank 3
item 2, the level-exits red-team finding, rank 85's V3:254)

*A.* Keep the three amendments and both Ask-first items, and add the line the list misses:
V3:703 reads 'Promoción a máster: 52/52 secciones, 12/12 capstones de nivel, CP-FINAL y
regresión S1–S52 aprobados…'. Grepping the ADR's forbidden terms over V3 returns exactly six
lines — 5, 41, 42, 415, 560 and 703 — so amending only the listed ones and then adding V3 to
test_level_language.py's scan leaves the strengthened test red at :703. Derive the line list
from the ADR's term list programmatically and include it in the owner's diff, so the test that
is being tightened actually passes when the packet…

*Reserved:* Edit learning_roadmap_52_V3.md (protected path, AGENTS.md:146; sections/AGENTS.md:29
'changed first, by a human') at lines 3, 5, 39-42, 53, 125, 270, 415, 560.; Edit…

**AV3-10 · SELF_ANSWERED** · judge: amended

*Q.* Where does the course teach SQL aggregation (GROUP BY/HAVING)? Do entry-level roles screen
it? Does V3:254 need amending? (rank 85)

*A.* Keep the placement, the supporting-block shape, the S17 and S29 recall sentences and the
S19 rewrite. Change the answer to the second half of the question. 'V3:254 is not amended'
should become 'V3:254 gains a clause naming basic aggregation (…esquema, CRUD, joins y
agregación básica…), folded into AV3-8's already-reserved amendment packet.' The cluster's own
rule (AV3-9: a V3 line governs its topic, and a departure is either conformance work or a dated
V3 amendment) and its own docs-as-code benchmark both say the authority document must describe
what the section teaches; leaving S12's topic…

*Implementation:* S12 (src/lib/course/sections/s12-apis-sql-geo.ts): add the supporting block,
worked example, figure (table-shape archetype) and check; declared… | Glossary: add a `GROUP
BY`/`HAVING` entry to src/lib/glossary/terms.ts so test:first-use-all detects any earlier use. |
S17-T3 recall sentence; S29-T2 recall bridge; rewrite s19-databases-orm.ts:359-360 as recall (D6
q1). | Report the hour delta to C-hours; hand the applied_sql required_sections change to
C-badge-scope-claims.

**AV3-4 · SELF_ANSWERED**

*Q.* How do app-side artifacts label sections so they cannot drift from V3 again? First output:
the PdfReport a learner hands an employer. (ranks 15 generator part, 81)

*A.* One module, src/lib/course/section-labels.ts, derives every app-side section label from
COURSE_SECTIONS by index (`${index}. ${title}`) and resolves ids through sectionIdAliases, so no
rename can orphan a label. PdfReport.tsx deletes its hand-kept SECTION_NAMES map
(PdfReport.tsx:40-92; about 29 of 52 labels name a topic the section does not teach, e.g.
'security: 14. Security' where S14 is NumPy) and uses the module. Any later consumer — admin
export, cohort views, Python tooling via the same title parse as
test_active_v3_curriculum_contract.py — uses it too. Regenerating badge…

*Implementation:* Add src/lib/course/section-labels.ts: sectionLabel(index) and
sectionLabelById(id) (via renameSectionId/sectionIdAliases); throws on an unknown id. |
src/components/course/PdfReport.tsx: remove SECTION_NAMES and render labels through
sectionLabelById, iterating COURSE_SECTIONS in index order. | Allow the PDF table cell to wrap;
do not truncate. | Hand the module to C-badge-scope-claims for its required_sections/skill_nodes
regeneration (Ask first there).

**AV3-6 · SELF_ANSWERED** · judge: amended

*Q.* What should the theory-tab playground run, now that it shows other sections' topics? For
example, S10 runs scikit-learn, S11 imports numpy (taught at S14), S27 runs asyncio, and S52
prints fabricated CV impact. (rank 82)

*A.* Keep the module, the index keying, the INACTIVE_PRESERVED parking file and the S52 rewrite.
Change two things. (1) Drop 'S27 runs asyncio' from the evidence: the S27 demo
(SectionView.tsx:2394) is titled 'Practica concurrencia con asyncio' but its code says '# Sin
asyncio real - simulamos con generators' and imports only time. It is still off-topic for a
section that teaches pytest, but the decision's own test rule (2), which gates on imported
modules, would not catch it. Add a rule that each demo is derived from a code block in its own
section file (or from a named on-topic source), which…

*Implementation:* Create src/components/course/playground/demos.ts (index → {title, code,
expectedOutput, hint}) and have InteractivePlaygroundDemo look up… | Populate from each
section's own I Do demo where runnable in Pyodide, keep the on-topic legacy demos, and relocate
sklearn → S33 and semver → S10 if… | Move all remaining off-topic demos verbatim to
src/components/course/playground/legacy-demos.ts with an INACTIVE_PRESERVED header, not
imported. | Rewrite S52's demo, authored by codex per the campaign rule, so its output lines are
derived from values in the code.

**AV3-7 · SELF_ANSWERED** · judge: amended

*Q.* What must a reference to another section ('en S09 lo verás', 'como viste en S09') satisfy
before a D11 primer can rely on it? (red team primer-must-name-a-lesson-that-exists-and-recalls-
it)

*A.* Keep both rules and the S19 fix, but measure before gating. Rule (a) is proposed as a hard
fail on a population that has never been counted: across the 52 active section files there are
roughly 900 references of the form Sxx outside id fields (S13 alone about 69), and exactly one
has been checked. Run the audit first, publish the count, then gate hard on new violations with
a dated, shrinking allowlist of the existing ones — the repo's own ratchet pattern
(scripts/complexity_gate.mjs), which tightens and never silently relaxes. A hard gate whose
current violation count is unknown can red…

*Implementation:* scripts/section_reference_audit.py: extract learner-visible sentences (reuse
the extractor behind the first-use gates) that contain /\bS\d{2}\b/;… |
audit/fixer/section_reference_baseline.json holds today's (b) count; the test fails if the count
rises. | Fix s19-databases-orm.ts:361's 'como viste en S09' in the same change (codex authors
the replacement; tooling applies it).

**AV3-9 · SELF_ANSWERED**

*Q.* Are the program's owner decisions independent? If not, in what order should they be taken,
and which does V3 already settle? (rank 3, META)

*A.* They are not independent. The rule: once V3 is the authority (AV3-1), a V3 line governs its
topic, and any departure is either conformance work or a dated V3 amendment the owner approves,
never a silent divergence. Order: (0) Now: issuance held closed (AV3-2, in force since PR #67);
the claim-text withdrawals (C-badge-scope-claims); the RC-12 submit fix (C-exam-validity); the
route-independent D9/D10 changes (C-level1-q3); the S32 tie fix. (1) One V3 amendment packet:
AV3-8, plus the other clusters' V3 lines — V3:91 remedial gating with its variant cost, the
owner's reading of V3:93 'nunca…

*Implementation:* Create audit/fixer/owner_packet.json listing every open item with {id,
question, cluster, group (0-3), v3_line, depends_on, status}. | Create
tools/fixer/owner_packet.py --check: fails on a dependency cycle, on an item whose status is
'decided' or 'building' while any depends_on is… | Reference the packet from
audit/fixer/WORK_QUEUE.md 'In flight' so every round reads it.

*Judge's note on what the cluster missed:*

- Two badge catalogs, both claiming version 1.0.0, diverge on what credentials claim — and no
decision in an authority cluster names a canonical one. src/lib/eligibility/badge_catalog.json
(read at runtime through…
- No live-site verification anywhere in the cluster, against the owner's standing policy that
content is verified on the live site and not only in source. AV3-4, AV3-5 and AV3-6 all assert
their defects from source files…
- The question bank's own keys are left undecided. prisma/seed.ts keys V3 content under pre-V3
slugs — line 1685 reads '// S06 V3 — Colecciones y estructuras de datos (platform id: numpy)' —
which is why AV3-3 needs alias…
- The Firestore mirror, the one off-GitHub datastore the repository actually configures, appears
in no decision. src/lib/firebase/sync.ts dual-writes users, progress, examAttempts and
exerciseAttempts and is imported by…
- A third authority the cluster leaves unranked. RED_TEAM_2026-09-18.md:296 records that
industry_alignment's role taxonomy proposes inserting topics (BI tools, deep learning, fine-
tuning, graph-RAG, Kubernetes, GPU,…

## Level 1: the Q3 practice layer, D9 and D10

**L1Q3-1 · ALREADY_DECIDED** · judge: amended

*Q.* Should def main() and the if __name__ == "__main__" guard come out of S02-S09 learner code,
the CP-N1-A/B starters and S09's separate test module now, before any Q3 route is chosen, with
test_s04_independent_contract.py:102 repointed?

*A.* Keep the decision and the 20-site list. Amend the live check to match the bundle's escaping
(assert on 'Incluye una funci' or decode JS escapes before grepping) and prove it fails today by
asserting the string is present before the change. Add the s08:521 interaction to the plan: its
body carries a D10 catch, so unwrapping it is not route-independent — either land it together
with L1Q3-2's rewrite of that snippet or leave s08:521 to L1Q3-2. Soften the Helsinki claim to
what the page says (the autograder does not run code inside the block) rather than "imports
student files".

*Implementation:* src/lib/course/sections/s02-basics.ts: delete the requirement at :2228
('Incluye una función `main()` y el guard ...') and the main()/guard at… | s03-decisions-
rules.ts: in the requirement at :2276, change the demo line to 'demo reproducible al final del
archivo', and unwrap the main()/guard at… | s09-exceptions-logging.ts: in the requirement at
:2245, change the demo line to 'demo reproducible al final del archivo'. Change :2246 and :2258
from… | s10-modules-packaging-cli.ts, T1 (V3:230 'imports, namespaces y `__main__`'): open
__name__ with the S09 case. Move those asserts to…

**L1Q3-2 · ALREADY_DECIDED** · judge: amended

*Q.* How should every try/except before S09 be removed, including the Theory-tab playgrounds
'basics', 'functions-contracts' and 'files-ingestion', and which predicates replace the catches?

*A.* Keep ALREADY_DECIDED and the 98-site plan. Replace the "show the failure" mechanism: a
snippet that raises is a P0 nonzero_exit in the runtime audit, so present the traceback the way
S09 already does — as a declared string literal or prose showing the last line — never as a
runnable block that exits non-zero. Restate the failing proofs: the S03 fix is `isascii() and
isdecimal()` against a 9-character non-ASCII decimal ('١٢٣٤٥٦٧٨٩' is accepted today), not
against '²' and not against an int() gate. Correct the seed.ts citation to :1228 and to what
that option actually says. Split the S02/S04…

*Implementation:* Get the list: python3 -c 'import sys; sys.path.insert(0,"tests/adversarial");
import re, test_forward_dependencies as t;… | S02 (s02-basics.ts:551-557, 760-766, 1054-1157,
1775-1814, 2149-2151, starter comment :2252): safe_int and parse_monto become check-first with
the… | S04-S08: KeyError uses `in`/.get (S06 teaches pertenencia and acceso seguro);
AttributeError and TypeError use isinstance; StopIteration uses… |
src/components/course/SectionView.tsx playgrounds: 'basics' (:1028-1050) check-first safe_int;
'functions-contracts' (:1114-1140) checks '@' before…

**L1Q3-5 · ALREADY_DECIDED** · judge: amended

*Q.* S09 defines custom exceptions (`class ValidationError(Exception): pass`, 9 sites) before
S11 teaches classes. Primer or rewrite? And what happens to the `@` part of the same gap?

*A.* Keep ALREADY_DECIDED and the primer. Correct the count to 8 definitions plus the prose
mention at :71, matching L1Q3-3. Change the shared ratchet to match `class\s+\w+\s*\(` anywhere
rather than line-anchored, so s09:857 and s09:981 are actually checked, and prove it fails by
giving one of them a method body. Make the prose at :71 and the primer show the same body form.

*Implementation:* s09-exceptions-logging.ts:71: add the primer sentence, naming S11 (oop-
domain). | Confirm that the S09 custom exception classes (:78, :81, :478, :481, :531, :857,
:963, :981) keep a one-line pass body. Any future body with methods… | Codex authors the
Spanish. Run npm run test:ux-gates.

**L1Q3-6 · RECOMMENDED_ASK_FIRST** · judge: amended

*Q.* Q3/RC-5: CP-N1-A grades multi-field, multi-record work at S02-S04, while functions (S05),
dicts (S06) and exceptions (S09) come later. Which route: (1) rewrite the capstone to V3's own
S2/S4 lines, (2) move the gate, or (3) a spiral that teaches dicts in S02?

*A.* Keep RECOMMENDED_ASK_FIRST and route 1. Re-measure and restate the dict figure (115 matches
/ 94 lines, S02 3, S03 59, S04 32) and specify the ratchet against that. Widen the annotation
test to all 32 `->` sites before S05 plus the two __future__ and one typing import, and match
annotations rather than bare '->'. Drop "no evidence to migrate": add an explicit item for
ExerciseAttempt, SelfCheckAttempt and CredentialEvidence — what happens to stored attempts on
rewritten exercise IDs and reseeded quiz options, and whether ContentVersion is enough — and add
it to ask_first_items, since…

*Reserved:* Restructuring a practice layer: S02-S04 We Do, You Do, TEs and playgrounds
(AGENTS.md:97); Protected paths beyond an ordinary content round:
public/capstones/CP-N1-A_BRIEF.md and _RUBRIC.json…

**L1Q3-7 · RECOMMENDED_ASK_FIRST** · judge: amended

*Q.* CP-N1-A changes its record schema at every increment (S01 CSV, S02 parse_client, S03
validators, S04 raw_line, the brief). What single schema carries from S01 onward, and where is
its single source of truth?

*A.* Keep RECOMMENDED_ASK_FIRST and the single Table Schema source of truth. Add an ask_first
item for the acceptance-criteria change: "amount=0 -> warn" and the email-format rule are
published criteria of a graded capstone (BRIEF.md:22, :24; enrich_capstone_packages.py:11 SPECS
tests; tests/test_demo.py test_1/test_3), and replacing them with 'monto_mensual 0 accepted' and
'exactly one @' is a rubric change, not a data-dictionary change. Keep the rest as written.

*Reserved:* Restructuring a practice layer: S01's You Do data spec and the S02-S04 field names
(AGENTS.md:97); Protected path public/capstones/CP-N1-A_BRIEF.md and _RUBRIC.json regenerated,
beyond an ordinary…

**L1Q3-8 · RECOMMENDED_ASK_FIRST** · judge: amended

*Q.* The Level-1 briefs publish CP-FINAL integration interfaces at the gates (CP-N1-A
`intake_cli.run(records) -> IntakeResult` over dicts at S04; CP-N1-B `etl.run(batch) ->
EtlManifest` at S08), but V3 defers packaging to S10. Where is the interface first graded?

*A.* Keep RECOMMENDED_ASK_FIRST and S10 as the first graded point. Add a prerequisite step:
correct CP-N1-A's published interface detail to the real contract (rows, not results; no
error_rate; malformed_handled required) in enrich_capstone_packages.py's SPECS and the
regenerated briefs, before S10's You Do is written against it — otherwise the contract test
cannot pass. Either add the etl.run(batch) -> EtlManifest requirement to S10's You Do alongside
intake_cli.run, or say plainly that CP-N1-B's interface is first graded elsewhere and where.
Note that adding firstGradedAt to CapstoneDescriptor…

*Reserved:* Restructuring a practice layer: S10's You Do gains the intake interface
(AGENTS.md:97); Protected path public/capstones/*_BRIEF.md regenerated for CP-N1-A and CP-N1-B

**L1Q3-3 · SELF_ANSWERED** · judge: amended

*Q.* S10's You Do tests use unittest.TestCase classes (s10:2308-2331), but classes are taught in
S11. What replaces them, and what primer does the learner get?

*A.* Keep the decision. Change the ratchet to match `class\s+\w+\s*\(` anywhere in the source,
not line-anchored, so it sees s09:857 and s09:981; prove it fails by planting a class after a
`code: \`` opener. Correct the measurement to 8 S09 exception definitions plus the prose mention
at :71, and reconcile it with L1Q3-5 so the two decisions state the same number.

*Implementation:* s10-modules-packaging-cli.ts: change requirement :2127 and the bootstrap
docstring :2131 to 'python tests/test_core.py'. Rewrite the… | s27 (pytest section): add one
retrieval line at its opening: run S10's tests/test_core.py with pytest, unchanged. | If D9's
S10 teaching step (L1Q3-1) uses tests/test_audit_log.py, write it in the same plain-function
style.

**L1Q3-4 · SELF_ANSWERED** · judge: amended

*Q.* lambda is used from S05 onward without ever being taught. Should it be replaced with named
functions, or taught, and where?

*A.* Keep SELF_ANSWERED and the placement at S06-T4-A. Upgrade the treatment to what D3 requires
and D6 permits: a supporting block carrying no subtopicId, with orientation, the named-key ->
lambda worked pair at identical output, a figure, and a check the learner performs — not a
paragraph appended to the existing block. Keep the glossary term at firstSectionId 'collections'
and the S05 replacements as written.

*Implementation:* s06-collections.ts S06-T4-A theory (:362-380): add a paragraph and a
code/output pair (named key -> lambda, same output). Keep it inside the existing… |
src/lib/glossary/terms.ts: add term 'lambda' (firstSectionId: 'collections'; definition in
Spanish, one sentence: una función de una sola expresión,… | s05-functions-contracts.ts:1479,
:1501, :1511: norm=lambda s: s.strip().upper() -> def mayusculas(s): return s.strip().upper();
process(...,… | Codex authors the Spanish (campaign rule). Run npm run test:ux-gates (glossary
first-use) and test:python-strict.

*Judge's note on what the cluster missed:*

- `raise` before S09 is untouched: 90 sites (S02 3, S04 12, S05 47, S06 5, S07 12, S08 11).
D10's ratchet only matches try/except, but V3:219 puts "tipos específicos, `raise` y chaining"
in S09-T1 alongside them. The…
- `npm run test:python-content` fails a theory/demo/solution snippet on non-zero exit —
scripts/python_content_runtime_audit.py classify_run returns reason 'nonzero_exit', severity P0.
No decision names this, yet D10's…
- The published CP-N1-A integration interface contradicts CP-FINAL's real contract, and both
L1Q3-7 (which owns the schema) and L1Q3-8 (which owns the interface) miss it. BRIEF.md:40 and
enrich_capstone_packages.py:11…
- Server-side attempt evidence is treated as non-existent. prisma/schema.prisma:110
ExerciseAttempt(userId, sectionId, exerciseId), :536 SelfCheckAttempt(questionIndex,
selectedIndex, correctIndex, contentVersion) and…
- Type hints before S05 are named but not measured: 32 `->` sites in S02-S04 (S02 14, S03 13,
S04 5), all in code, plus `from __future__` x2 and `from typing` x1, against V3:121 "Desde S5:
funciones pequeñas y type hints…

## What a badge may claim

**BSC-02 · ALREADY_DECIDED**

*Q.* Should the live Dashboard badge explainer, badge-notice's 'vista previa' paragraph and the
capstone badge chips keep describing a local eligibility preview, supervisor verification, a 70%
rubric threshold and badge ids that do not exist?

*A.* No. Replace them now with what exists: PyArcana issues no badges or credentials yet, the
'Hecho' marks are the learner's own record, and exam scores are graded on the server. Remove the
'70% o más' line, the 'Vista previa local' and 'Insignia verificada'/supervisor cards, badge-
notice's preview paragraph, and the Award chips on the capstone cards until BSC-01 is settled.
This removes a description of features that do not exist; it adds no credential claim. Any new
claim wording goes through BSC-03.

*Implementation:* src/components/course/Dashboard.tsx, the section with aria-labelledby 'badge-
explainer-title' (HEAD lines 735-835): Codex authors a short replacement… | src/app/badge-
notice/page.tsx:10: delete the 'vista previa de tu elegibilidad' paragraph. The 'prueba'
paragraphs at :7 and :13 go to BSC-03. | src/components/course/CapstonesPage.tsx:251-259 and
:418-423: stop rendering the Award chip. Keep the badgeId data in src/lib/capstones/catalog.ts…
| After deploy, check the content at the deployed SHA and on the live Pages HTML (AGENTS.md
'Shipped means live').

**BSC-04 · ALREADY_DECIDED** · judge: amended

*Q.* Do the catalog's retroactive paths stay? These are the pilot-to-active re-issue 'without
requiring existing holders to re-test' (26 badges), 'reinstatement is automatic once the
underlying issue is resolved' (31), 'Legacy exam scores >=85% MAY be carried forward' (26), and
the engine's forced 'awarded' state in…

*A.* Keep the decision. Two corrections to its citations: (1) the forced-award comment is at
src/lib/eligibility/engine.ts:519 (the assignment at :520), not :518; (2) OPEN_QUESTIONS Q1's
'Reading 2 is settled: it is a bug, not a design' is about prerequisite ordering, not about
awardIdempotent, and Q1's own sentence 'awardIdempotent just calls evaluate' is factually wrong
— the same round must correct that line in OPEN_QUESTIONS.md, citing the code, rather than lean
on Q1 for the awardIdempotent clause. Cite D11 plus AGENTS.md:86 for that clause.

*Implementation:* src/lib/eligibility/badge_catalog.json: the last sentence of
evidence_rules.gap_closure_policy (26), revocation_policy.reinstatement_policy (31), and… | The
same fields in industry_alignment/badge_catalog.json until BSC-06. |
src/lib/eligibility/engine.ts:507-524 awardIdempotent: evaluate; take prior awards only from a
server-supplied list of BadgeAward rows with a… | Record in audit/fixer/decisions.md that this
implements D11, and re-raise it for human review as D11's last sentence requires.

**BSC-16 · ALREADY_DECIDED**

*Q.* May course_complete_gate.py, course-state/capstone_ledger.json and checkpoint.json
('capstones_formally_passed': 13) report capstones as passed on package tests that are `assert
True # placeholder`?

*A.* No. Ledger state is derived by running the package tests. A test body that is only assert
True or a placeholder counts as missing. The 11 affected capstones are recomputed and read
content_authored until real tests pass. No badge or capstone status may be claimed from a hand-
set ledger field.

*Implementation:* course_complete_gate.py: execute each capstone package's tests and refuse
'formally_passed' when any test body is a placeholder. | course-state/capstone_ledger.json and
checkpoint.json: regenerate from the gate's output. Coordinate with C-green-gates-ledger.

**BSC-17 · ALREADY_DECIDED** · judge: amended

*Q.* Can evidence produced before the V3 content, which the rename migration carried into V3
slugs, or graded before the exam fix, count toward any badge or credential?

*A.* Keep the decision. Three corrections. (1) D12 is quoted correctly but exists only on
origin/claude/brave-boyd-5da0c7 (decisions.md:297); the checked-out decisions.md ends at D11, so
the gradingVersion cutoff is ALREADY_DECIDED only once PR #70 merges — say so. (2) The commit
attribution is wrong: 6290f0c0 (2026-07-20) is the V3 content production commit and it kept `id:
'numpy'`; the slug rename lives in src/lib/section-id-migrations.ts:20 (`numpy: 'collections'`)
and prisma/migrations/20260918030000_rename_section_ids_batch_a. Cite the content-switch date
and the rename map separately. (3)…

*Implementation:* Merge PR #70, which adds gradingVersion. | src/lib/credential-gates.ts
countPassedSections: exclude gradingVersion 0. | Engine adapter (when built): apply a content-
version cutoff to Progress and SelfCheckAttempt rows.

**BSC-01 · OWNER_CALL**

*Q.* Until a server-side performance grader exists, which non-progress badges does PyArcana
issue or show? Class B could become (a) publicly verifiable knowledge badges backed by the
server-graded exams, (b) knowledge markers visible only on the learner's dashboard, or (c)
nothing at all. Separately, is building that…

*A.* Recommendation: (b) now. Commit to building the grader, and publish class B only as
performance-backed badges once it exists. Four points hold under every option. First, classes C
and D stay unissuable until the server stores a submission, a grader result and a recorded
defense; PR #67 already refuses them. Second, no badge of any kind rests on exams before the
exam-validity fixes land: D12 in PR #70, plus the bank repair in C-exam-validity. Third, the
static Pages edition shows class A markers only. Fourth, nothing issued earlier is ever upgraded
(D11).

*Reserved:* Changing what badge_catalog.json claims (adding the assessment fields and rewriting
claims), AGENTS.md:96; A new Prisma migration for Submission/GraderResult (prisma/migrations is
protected)

**BSC-03 · RECOMMENDED_ASK_FIRST**

*Q.* Should every credential claim that names evidence the platform never records be withdrawn
now, before the class decision in BSC-01?

*A.* Yes, now and under every BSC-01 option. Strike the following: 'pruebas ocultas' in the 15
class B claims; the evidence clause of the English llmops_production_delivery claim; 'revisión
independiente' in the 5 class C claims; 'evaluación con defensa', 'evidencia a prueba de
manipulación' and 'verificación pública' in the 5 class D claims; 'independientemente' in every
badge whose last required section is at or before S13, since level 1 is 'Fundamentos Guiados …
con apoyo' (catalog.ts:27-28); credential-policy/page.tsx:31-33, :38-40 and :44-48, including
'con identidad verificada';…

*Reserved:* Changing what badge_catalog.json claims (26 badges), AGENTS.md:96; Changing the
credential policy's statement of what credentials attest, and the signed capabilityStatement

**BSC-05 · RECOMMENDED_ASK_FIRST**

*Q.* When a badge version is superseded or retired, what happens to credentials already issued
under it? The catalog's revocation trigger revokes them if the evidence does not meet the
successor. credential-policy.tsx:80-82 and badge-notice:19 keep them valid, labelled 'versión
anterior'.

*A.* Keep them valid under the version they were issued for, shown as 'versión anterior (vX)'.
Never upgrade one without new assessment. Revoke only for plagiarism or gaming, for issuance
error, or when the evidence is later found invalid; that last case covers anything issued on the
leaky bank or on pre-fix rows. Strike the trigger "Badge status changed to 'retired' or
'superseded' and the learner's evidence does not meet the successor badge's requirements" from
all 31 badges. Keep credential-policy:80-82 and badge-notice:19, adding 'no se actualizan a una
versión nueva sin nueva evaluación'.…

*Reserved:* Changing badge_catalog.json revocation triggers (what a credential attests over its
lifetime), AGENTS.md:96

**BSC-06 · RECOMMENDED_ASK_FIRST**

*Q.* Two catalogs both say version 1.0.0 and disagree (public_claim in 26 badges,
credential_class missing from one), and the TypeScript and Python engines read different files.
Which catalog is canonical, and how does a credential's specification version come to name
exactly one document?

*A.* src/lib/eligibility/badge_catalog.json is canonical: production reads it (badge-
specs.ts:21, and credential-gates.ts:18 on main). industry_alignment/badge_catalog.json and its
generator industry_alignment/_phase6_build/build_badge_architecture.py become INACTIVE_PRESERVED
history, not deleted, with a note naming the canonical file. The Python reference in
tests/adversarial/test_eligibility_engine.py:44 loads the canonical file. Add four things: a
parity test that runs both engines on one fixture set, including the no-supplementary case; a
real sha256 of the canonical bytes in each…

*Reserved:* Changing badge_catalog.json content and version (AGENTS.md:96); Repointing an
existing test under tests/ (protected path), a strengthening change

**BSC-07 · RECOMMENDED_ASK_FIRST**

*Q.* May a badge's public_claim, skill_nodes or rubric criteria name a skill or tool the course
does not teach at or before the badge's last required section? Examples today: bi_tools, deep
learning, Kubernetes, mentoring, fine-tuning, graph-RAG, GPU, Power BI/Tableau at S09-S10, and
PyTorch/CI/coverage in L1 rubrics.

*A.* No. One rule applies: every skill_node, public_claim clause and rubric criterion maps to a
topic id in the course as built (src/lib/course/sections, now V3-titled) at or before
max(required_sections). Strike from skill_nodes and claims: bi_tools (7 badges), deep_learning
(12), kubernetes (3), mentoring (3), and the fine-tuning, graph-RAG, GPU, Power BI/Tableau and
PyTorch claim text. Move them to a gap register as V3 amendment proposals, each with an hour
cost, for C-authority-v3 and C-hours to decide. Skills V3 schedules but the course only
simulates (async, Docker/Compose, CI, FastAPI,…

*Reserved:* Changing what badge_catalog.json claims (skill_nodes, public_claim), AGENTS.md:96

**BSC-08 · RECOMMENDED_ASK_FIRST** · judge: amended

*Q.* Do Level-1 badges keep reproducibility_determinism as a non-compensatory critical
competency that must score 100%, with criteria requiring CI, coverage and NumPy/PyTorch/scikit-
learn seeds? The alternatives are the existing weighted criterion scoped to S01, or a yes/no
clean-clone check.

*A.* Keep the four-item S01 reproducibility criterion and the clean-clone rerun at weight 0.40,
but make the removal of reproducibility_determinism from critical_competencies conditional, not
immediate. Two preconditions must land first: (1) the spec loader and engine must actually read
rubric criteria and enforce each criterion's floor_pct as a blocking gate — today BadgeSpec
(types.ts:161-178) carries no criteria at all, badge-specs.ts has zero references to
criteria/rubric/floor_pct, and the engine's only per-criterion check is Gate 6 for critical
competencies (engine.ts:356-361); and (2)…

*Reserved:* Relaxing a gate threshold: removing a 100% non-compensatory critical competency from
three badges (AGENTS.md:96); Changing what badge_catalog.json claims and its rubric criteria

**BSC-09 · RECOMMENDED_ASK_FIRST** · judge: amended

*Q.* Can a supplementary 'gap-closure' exercise serve as credential evidence for a competency
the course does not teach before the badge? Examples: auditing a public Kaggle notebook for
leakage, or running EXPLAIN ANALYZE on Postgres/MySQL when the course teaches SQLite.

*A.* Same decision, but split the authority. The curriculum treatment — primer, else rewrite the
dependency, else move, applied per competency — is ALREADY_DECIDED by D11 and the standing
policy and needs no permission. The catalog edit does: removing '(For gap-affected competencies)
Supplementary independent exercise completed per the badge rubric's gap-closure specification'
from evidence_rules.acceptable_evidence and gap_closure_policy on 26 badges changes what the
credential will accept as evidence, which is AGENTS.md:96 'Changing what a credential claims
(badge_catalog.json)'. Add that…

**BSC-11 · RECOMMENDED_ASK_FIRST**

*Q.* What may a PyArcana credential say about who holds it ('con identidad verificada' at
credential-policy:46, or less), and what holder binding is built?

*A.* Strike 'con identidad verificada' together with BSC-03. Bind the credential to a verified
email, carried as OB3's salted sha256 identityHash and never as the raw email, and to a display
name the learner affirms and consents to publish. Add an honesty pledge at each graded
submission (CS50 and freeCodeCamp pattern). State 'sin verificación de identidad' in the EU
Annex I identity field. No government-ID proofing. If the owner later wants proctored or ID-
verified credentials, that changes BSC-01's product scope.

*Reserved:* A new Prisma migration adding User.emailVerified (prisma/migrations is protected);
Changing what a credential claims about its holder

**BSC-13 · RECOMMENDED_ASK_FIRST**

*Q.* What may the five progress markers (class A) claim, what is the 'legacy' clause, and may a
self-reported marker be a prerequisite of a verified credential?

*A.* Class A claims describe a self-kept record, for example 'marcaste como completadas las
secciones S01–S13 en tu registro de progreso'. They drop 'including the You Do project and self-
check'. Rename the legacy_progress_policy wording to what it is: the learner's own record in
localStorage python-ds-progress, which is the current store, self-reported, and accepted for
class A only. Class A carries no skill_nodes; today progress_phase0_walked lists bi_tools and
classical_ml for S01-S13. Remove progress_* from the prerequisite_badges of the four class D
credentials that list them. The engine…

*Reserved:* Changing what badge_catalog.json claims and what credentials require
(prerequisite_badges)

**BSC-15 · RECOMMENDED_ASK_FIRST** · judge: amended

*Q.* What shape should the badge prerequisite graph have, given that phase credentials require
badges whose sections end after the phase, and that retiring one badge locks others?

*A.* Keep invariant 1 (a prerequisite's last required section is at or before the dependent
badge's) and invariant 4 (retiring or superseding a badge removes it from every prerequisite
list in the same change). Replace invariants 2 and 3. Invariant 2 becomes: a prerequisite must
be of the same credential class or lower and must be section-ordered — class B badges keep their
chains. Invariant 3 becomes: a class D credential may require class B, class C or an earlier
class D badge, never a class A progress marker (per BSC-13). Then apply them after
C-authority-v3 regenerates required_sections, as…

*Reserved:* Changing what credentials require (badge_catalog.json prerequisite_badges)

**BSC-10 · SELF_ANSWERED**

*Q.* How must /verify and the credential record work before any credential is issued? Three
parts: ADR 5's server-only verification, revocation and expiry read from real rows, and the
signing format for a publicly shared credential.

*A.* Implement ADR 5 now. Drop `signature` from /api/credentials/verify's response. Delete the
client HMAC path in src/app/verify/page.tsx (CLIENT_VERIFY_KEY, importKey at :60-80). Correct
the 'published public key' comment at verify/route.ts:159-162. Issuance writes Credential and
CredentialEvidence rows, which the schema already has, instead of a Notification body. Verify
reads Credential by verificationId, revocation from CredentialRevocation, and expiry from
Credential.expiresAt, set from the catalog's expiration_period_days. It shows 'revocada',
'vencida' or 'versión anterior'. Before any…

*Implementation:* src/app/api/credentials/verify/route.ts: query db.credential by
verificationId, join CredentialRevocation, compare expiresAt with now, remove… |
src/app/verify/page.tsx:37-80, :112-116: remove the client re-verification. |
src/app/api/credentials/issue/route.ts (main :141-171): create Credential and CredentialEvidence
rows (evidenceType exam_attempt, evidenceRefId the… | Before public issuance:
src/lib/credentials/ob3.ts builds an AchievementCredential with an eddsa-rdfc-2022 proof (key in
a server env var, never…

**BSC-12 · SELF_ANSWERED**

*Q.* With PR #67 merged, issuance stays closed only because unverifiedRequirements is never
empty. What keeps it closed if a later catalog edit makes a credential exam-only, and which
fields must the route take from the server?

*A.* Add an explicit issuance allowlist in src/lib/credential-gates.ts. It starts empty and is
checked before any evidence query, independently of the catalog's component list. A badge enters
it only by a recorded owner decision naming its preconditions (BSC-01, D12 and the bank repair
in C-exam-validity, BSC-10, BSC-11). The route also changes in four ways. It takes
specificationVersion and the catalog hash from the canonical catalog and ignores the request
body (main route.ts:91). It takes capabilityStatement from the catalog claim for that version,
with the text governed by BSC-03. It sets…

*Implementation:* src/lib/credential-gates.ts: export ISSUABLE_BADGES: ReadonlySet<string> = new
Set() and an issuanceOpen(badgeId) check. The route returns 403… |
src/app/api/credentials/issue/route.ts (main): drop specificationVersion from the request type;
read version and hash from BSC-06's lock; build… | countPassedSections filters gradingVersion >=
1 once PR #70 lands.

**BSC-14 · SELF_ANSWERED**

*Q.* Before any adapter feeds the engine evidence, must it enforce the evidence rules the
catalog already states: the learner's own evidence, server verification, grading and content
version, and expiry?

*A.* Yes. Every evidence row carries learner_id, a source id, a grader id, graded_at and a
grading/content version. The engine refuses: evidence belonging to another learner; unverified
evidence where verification_mode or server_verification_required demands it; evidence graded
before gradingVersion 1 or against another content version; and expired badges. Supplementary
evidence is refused outright, which supersedes the synthesis's 'below 85' because BSC-09 retires
it. TIER_MIN_FOR_CAPSTONE is either applied to capstone defense evidence or removed as dead
code. Write one refusal test per rule in…

*Implementation:* src/lib/eligibility/types.ts:110-132: make learner_id, grader_id, graded_at
and grading_version required on evidence records. | src/lib/eligibility/engine.ts: a Gate 0
refusal set (owner, verification, version, expiry). Mirror it in the Python reference in…

*Judge's note on what the cluster missed:*

- The catalog's revocation_process survives every decision in the cluster and promises three
things the platform never does: the learner 'is notified with the specific trigger and evidence
pointer', 'may appeal within 30…
- Nothing decides who promotes a badge from 'pilot' to 'active', or on what evidence. The
catalog has 9 pilot and 22 active badges. BSC-04 correctly removes the clause that auto-promoted
pilots without re-test, but that…
- Issuance is self-service. origin/main src/app/api/credentials/issue/route.ts:74-82
authenticates the caller and issues the credential to that same caller, with no admin gate, no
reviewer and no rate limit. BSC-12 closes…
- The cluster contradicts itself on whether tests/ counts as a protected path. tests/ is on
AGENTS.md's protected list and Ask-first reserves 'Changing a protected path.' BSC-06 lists
'Repointing an existing test under…
- No decision covers the paid-product side. prisma/schema.prisma has SubscriptionPlan, Payment
and Subscription models; BSC-01 names them as an input to the business case and BSC-02 cites DL
1044 Art. 8 for the UI, but…

## Simulated tools and what the course really runs

**SIM-01 · ALREADY_DECIDED** · judge: amended

*Q.* Levels 2–4 practise predicates over dictionaries of flags while outcomes, capstone role
statements and badges claim the learner authored and ran the artefact. Does the course keep the
simulation as the graded surface, or must every graded claim be backed by code that really runs
the tool it names?

*A.* Keep the rule. Split the classification and fix the ask-first list: the anchor-coverage
test as written cannot pass without repointing `required_sections`, and SIM-01's own remedies
route through SIM-12 (V3, protected) and SIM-13 (credential status, reserved), so
`ask_first_items: []` and `depends_on: [SIM-02, SIM-03]` are both incomplete — add SIM-12,
SIM-13 and OPEN_QUESTIONS Q1.

*Implementation:* Add an anchor manifest, `course-state/executed_anchors.json`: one row per
capstone (13) and per applied badge, naming the section, the block id, the… | Record the
contract as D12 in `audit/fixer/decisions.md`: simulation is a rung, never the top rung; every
block that models instead of running says… | Sweep the blocks that say the opposite of what they
do: `s38-performance-extreme.ts:234` ('En async real: asyncio.wait_for cancela la tarea; aquí… |
Order the work: SIM-02 (machinery) → SIM-03 (tiers) → anchors. An anchor written before the
machinery is unverified content, which AGENTS.md forbids…

**SIM-02 · ALREADY_DECIDED** · judge: amended

*Q.* The only gate that executes lesson code turns a missing module into `"status": "skip",
"reason": "missing_dependency"` and a missing course module or fixture into `expected_fail_ok`
(a pass). Should it keep skipping, or refuse — and how are the dependencies each level may use
declared?

*A.* Keep refuse-not-skip and the end of `expected_fail_ok` for course modules and fixtures. Fix
the level map: numpy and pandas are Level-2 dependencies, not Level-3 — S14 has 65 `import
numpy`, S15/S16/S17 have 65/60/59 `import pandas`, S18 has 40+7. As written, the rule would mark
five Level-2 sections `undeclared_dependency` on its first run. Also fold `OPTIONAL_MODULES`
(:36-67) into the level map, or the script keeps two competing notions of "optional" (:378
probe, :694 per-snippet).

*Implementation:* Add `constraints-content.txt` (every pinned version, including transitive) and
`requirements/level1.txt` … `requirements/level4.txt`. L1: stdlib… | Rewrite `requirements-
content.txt` as the index: `-c constraints-content.txt` then `-r requirements/level1.txt` … `-r
requirements/level4.txt`. CI's… | `scripts/python_content_runtime_audit.py`: replace
`CORE_TEACHING_MODULES` (:312) with a level→modules map read from the pins files; in the… | Same
file, :525-556: drop `ModuleNotFoundError`, `ImportError` and `FileNotFoundError` from the
`good` list when the missing name matches a course…

**SIM-13 · ALREADY_DECIDED** · judge: amended

*Q.* `applied_mlops_pipeline_delivery` is status active and
`container_platform_engineering_practice` is status pilot, and both claim the learner 'demostró
independientemente … mediante tarea práctica' for skills no section executes. May they be
awarded while the anchors are being built?

*A.* Keep the hold, with two corrections. (1) Scope it to `credential_type` competency_badge and
verified_credential. As written ("any claim whose skill node has no manifest row") it also holds
the four `progress_*` markers, whose `non_claims` already read "Marcador de progreso local. No
constituye evidencia de competencia profesional" — punishing the one credential in the catalog
that labels itself honestly. (2) Say what happens to credentials already issued:
`applied_mlops_pipeline_delivery` is status active, and the decision's own benchmark invokes
revocation (Open Badges 3.0 §3.12 and…

*Implementation:* Wire the SIM-01 manifest into the eligibility engine as a precondition:
`src/lib/eligibility/engine.ts` refuses to award a badge any of whose skill… | Do not silently
flip `status` in
`src/lib/eligibility/claim_evidence_contracts/applied_mlops_pipeline_delivery.json` or… | Write
the hold and its release rule into `audit/fixer/decisions.md` alongside D12, with the list of
currently-held claims, so a later round cannot… | Add a learner-facing explanation where the
badge would have appeared: what is still being built and what will release it.

**SIM-09 · OWNER_CALL**

*Q.* S41 (FastAPI), S43 (Dockerfile + Compose), S44 (a CI workflow) and S47 (a model registry)
grade artefacts the learner never saw built, and the badges named 'Delivery' and 'Engineering
Practice' claim they did. Does the course fund real, locally run builds — and if so, on whose
machine?

*A.* Recommendation: **option B, hosted-CI-first with a local path offered.** The learner's
artefact is real — a Dockerfile, a Compose file, a workflow, a registry — and it is really built
and run, but the default execution surface is a GitHub Actions run in the learner's own
repository rather than a local Docker daemon. The learner's evidence is the run URL plus the
image digest the build printed; local Docker or Podman stays as the preferred path for anyone
who can install it. Under every option, three repairs happen regardless: the S43 digest self-
check stops teaching a tautology (`digest_a`…

*Reserved:* Which of A / B / C the course adopts; Whether learners may be required to install a
container runtime (option A) or to hold a GitHub account (option B)

**SIM-03 · RECOMMENDED_ASK_FIRST**

*Q.* The snippet tier runs each block alone as `snippet.py` in an empty temp directory with no
services and no earlier module on the path. Where do the executed anchors and the carry-forward
capstone increments actually get verified?

*A.* Add two tiers beside the 8-second snippet tier, both in CI, both keeping transcripts. (a) A
**lab tier**: a separate job that installs the level pins, starts what each anchor needs
(Chromium via `playwright install --with-deps`, a uvicorn process for S41, Docker for S43 if
SIM-09 goes that way), runs each anchor end to end with a generous timeout, and writes `course-
state/lab_tier_report.json` plus a per-anchor transcript. (b) A **project tier**: extend the
existing `capstone-pytest` job from 2 packages to all 13, running each You Do and carry-forward
starter inside its capstone package…

*Reserved:* Adding a `lab-tier` job to `.github/workflows/tests.yml` (protected path);
Converting `capstone-pytest` in the same file from 2 packages to a 13-package matrix (protected
path)

**SIM-04 · RECOMMENDED_ASK_FIRST** · judge: amended

*Q.* Level 2 spends seven sections on pandas, NumPy and matplotlib; from S21 on no active
section's code uses them again, and scikit-learn — pinned in requirements and auto-loaded by the
playground — is imported by zero active sections while four badges claim `classical_ml` and
`pandas_numpy`. Does Level 3 go…

*A.* Keep option 3 on the merits. But the vehicle collides with the authority document:
learning_roadmap_52_V3.md:34 states "Cada subtema contiene un I Do y tres ejercicios… Cada tema
suma exactamente seis ejercicios". Adding ~23 new exercises to Level-3 topics contradicts V3
(protected path, and ranked above section content in course-
state/course_requirements.json:4-11), and adding a new practice rung across a whole level is
"restructuring a practice layer" on AGENTS.md's Ask-first list. Either amend V3 (ask first), or
carry the transfer rung in a vehicle V3 already allows — a supporting block…

*Reserved:* Only if the owner prefers converting existing E3s instead of adding rungs — that
restructures a practice layer and is reserved. The recommendation avoids it.

**SIM-12 · RECOMMENDED_ASK_FIRST** · judge: amended

*Q.* Outcomes in S12, S16, S22, S23, S34 and S51 and the V3 level exits (V3:39-42, :125, :270,
:415, :560) claim more than the course practises, and `test_level_language.py` forbids 'experto
· máster · master · senior' in learner-facing text while V3's own level headings read
'Competente a experto' and 'Experto a máster'.…

*A.* Keep the rewording of the six sections' `learningOutcomes` — it stands on SIM-01's merits
as the honest interim. Drop the claim that extending the test to V3 merely closes a gate-scope
gap. The ADR the test enforces (`capstone_validation/architecture/ADR-level-language.md`,
Accepted 2026-07-29) forbids those terms in *learner-facing* text and fixes approved names (L1
Fundamentos Guiados … L4 Sistemas de Producción Gobernados); V3 is an internal planning document
whose novato → principiante avanzado → competente → experto → máster ladder is the Dreyfus
skill-acquisition framing. Extending the…

*Reserved:* Editing `learning_roadmap_52_V3.md` — protected path and the curriculum's authority
document; Extending `tests/adversarial/test_level_language.py`'s scope, which makes V3 fail
until it is amended

**SIM-08 · REFUTED** · judge: refuted

*Q.* S30 requires Levenshtein and S46 requires a Kahn topological sort, both from uncommented
code; S42 grades a threat model and S48 a chunking strategy and lexical baseline, with no worked
example anywhere. Teach them, or reword the requirement?

*Refuted:* D3, D5 and D6 are quoted accurately, but the decision fails its own authority in the
opposite direction: D5 records that "a figure earns its place only by removing work the prose
was doing badly — Mayer's coherence principle", and adding supporting blocks for three concepts
the sections already…

**SIM-05 · SELF_ANSWERED** · judge: amended

*Q.* Four Level-3 I Dos declare their parameters instead of fitting them
(`params["penalty"]="l2"`, hand-set weights, a literal depth flag, `a=0.8, b=0.1`, PCA weights
`w0,w1` documented by hand) while the prose says 'acabas de ajustar'. Do they become real fits,
or library calls?

*A.* Keep the rule — a parameter the section says it fitted is computed — and keep the
perturbation test, which is genuinely non-tautological. Drop the S33 implementation step: the
block at s33:245-285 is "De la regresión logística a una red neuronal diminuta", an `optional:
true` XOR neural net that carries `subtopicId: S33-T2-B`. It is not a logistic-regression
gradient-descent loop, it cannot be "promoted" into T2-A, and moving a block that owns a
subtopicId touches the eight-to-eight spine D6 protects. The T2-A fit has to be written.

*Implementation:* `src/lib/course/sections/s33-advanced-models.ts`: replace the declared
`params` block (~:190-205) with the gradient-descent fit from :252-285,… |
`src/lib/course/sections/s34-cv-ai-integration.ts:310-322`: fit `a`, `b` on `holdout_v1` (a
short GD or least-squares on logits) instead of passing… | `src/lib/course/sections/s36-ai-apis-
advanced.ts:223`: compute the first component with `eigh` on the covariance of the z-scored
points; report real… | Regenerate every changed `output:` under `.venv-content` and re-run `npm
run test:python-strict` (D8, line-by-line).

**SIM-06 · SELF_ANSWERED** · judge: amended

*Q.* CP-N2-C is the RPA capstone and `reliable_automation_development` claims
`python_rpa_browser` and `selector_design`, but S23 states outright that its graded exercises
model the page tree and the session with dictionaries so they run without a browser, and the
only Playwright code in the course is an `optional: true`…

*A.* Build the practice site and the executed Playwright rung in S23 — that part is settled and
is ordinary content. But say plainly that it does not make `reliable_automation_development`
honest: that badge's `required_sections` are S13 and S24, so SIM-01's own "anchor in a required
section" test still fails after this lands. Closing it needs a `required_sections` repoint in
badge_catalog.json (reserved) and is blocked on OPEN_QUESTIONS Q1, which this decision must
cite.

*Implementation:* Add `course-state/capstones/CP-N2-C/practice_site/` — 3–4 static pages with a
table, a filter form and a CSV download link, plus the golden CSV, all… |
`src/lib/course/sections/s23-computer-vision.ts`: promote the sketch at :63-69 out of `optional:
true` into a real I Do plus an exercise with a… | Add a second rung in `s24-rpa-advanced.ts`
only if the owner also wants the OCR side executed; otherwise leave S24 as-is and note in the
manifest… | Register the anchor in `course-state/executed_anchors.json` with tier `lab`.

**SIM-07 · SELF_ANSWERED** · judge: amended

*Q.* S38's async demo classifies a mock latency against a budget with a comment saying real
async would use `asyncio.wait_for`; S39's drift, S48's chunking and lexical scoring and S50's
judge validation are gated on numbers nothing computes. These need only the standard library —
do they wait for the lab tier?

*A.* Keep S38 and S48; re-cite S39; drop S50. S39 has no PSI anywhere in the file — the real
target is `def mode(drift_high, incident)` at s39:315-318, where drift arrives as a boolean
argument, so cite that and present PSI as the new computation. S50 is refuted as stated:
s50:190's block *computes* `agreement_rate` from a list of pairs and prints 0.75, and TPR/TNR
appear nowhere in the section. Adding them is new content, not de-simulation, and D6's first
question ("is this use necessary, or throwaway?") applies.

*Implementation:* `src/lib/course/sections/s38-performance-extreme.ts` (~:230-240): replace
`fetch_with_timeout`'s mock classification with a real coroutine that… |
`src/lib/course/sections/s39-integrator-phase2.ts`: compute PSI from two binned score lists with
the standard library; keep the decision framing. | `src/lib/course/sections/s48-ai-
governance.ts` (~:1942, :2103-2104): a chunker with overlap over a synthetic document, a lexical
scorer, and… | `src/lib/course/sections/s50-tech-leadership.ts` (~:190): compute the judge's TPR
and TNR from a small labelled fixture; the S50-T2 primer names…

**SIM-10 · SELF_ANSWERED** · judge: amended

*Q.* pytest is optional at S27 and never used after S28, yet S29, S31, S44 and CP-FINAL grade
test suites; `logging` is imported only in S09 but S13, S38 and S51 grade log hygiene; pandas
stops at S20 and is needed from S32. What stops a gate from grading a tool the learner last
touched 13 to 32 sections earlier?

*A.* Keep the ratchet, the S29 single-failing-test starter, the S09-logger requirement and the
`requires-python` fix. Two corrections. First, the citation: s27:1634 is a `bug_repro →
regression_test` transfer exercise and does not contain the quoted sentence; the real
optionality is at s27:30 ("pytest o assert equivalente"), :156 ("En este navegador no está
disponible el programa que ejecuta pytest, por eso los bloques de la sección llaman las pruebas
a mano") and :190 ("si aún no instalas pytest, modelamos el criterio con try/except"). Second,
clause (a) — "from S28 every You Do keeps its tests…

*Implementation:* `src/lib/course/sections/s27-async-concurrency.ts:1634`: drop the 'o, si aún
no instalas pytest, un módulo con assert equivalentes' escape; declare… |
`src/lib/course/sections/s29-mlops.ts` starter (~:2250): ship one failing AAA test in
`tests/test_store.py`; leave `schema.sql`, `seed.py`,… | `s13-evidence-dashboard.ts:1959`,
`s38-performance-extreme.ts`, `s51-integrator-final.ts`: require the S09 logger and masking
filter by import, not a… | `s14-security.ts`: supporting block (no `subtopicId`, D6) with the
install command, the pinned versions and a one-line import-and-print check;…

**SIM-11 · SELF_ANSWERED**

*Q.* Demos declare `environment: 'local-python'`, but no component reads the field: every demo
renders under a callout saying it runs real Python in the browser and needs nothing installed,
while the playground's Pyodide 0.26.2 ships pandas 2.2.0, numpy 1.26.4 and scikit-learn 1.4.2
against pins of pandas 3.0.5, numpy…

*A.* `environment` becomes load-bearing, and the browser stops being the verification surface
for pinned outputs. (a) `SectionView` passes `demo.environment` to the playground; a block
marked `local-python` renders with its run affordance replaced by a short 'corre en tu entorno
local' note and the exact command, and the blanket callout 'No necesitas instalar nada' is shown
only for `browser-pyodide` blocks. (b) Every block whose declared `output:` depends on a pinned
library version is marked `local-python`, which covers the SIM-04 library rungs and the
S19/S20/S21/S23 third-party blocks the…

*Implementation:* `src/components/course/SectionView.tsx:4141-4152`: pass `demo.environment`;
render the local-only variant of the callout and the `python3 …` command… |
`src/components/course/CodePlayground.tsx:11`: bump `PYODIDE_VERSION` and recompute
`script.integrity` with the command already documented at :31-34;… | Mark `environment: 'local-
python'` on every block importing matplotlib (S19), openpyxl (S20),
reportlab/jinja2/docx/pypdf/fitz (S21), playwright… | Add the shipped-versions table to the S14
install block (SIM-10) so the learner sees why the two environments differ.

*Judge's note on what the cluster missed:*

- OPEN_QUESTIONS.md Q1 is never cited by any decision in the cluster, yet it is the governing
open item. It already tabulates that `reliable_automation_development` requires S13/S24 while
the skill lives in S23, that…
- learning_roadmap_52_V3.md:34 — "Cada subtema contiene un I Do y tres ejercicios… Cada tema
suma exactamente seis ejercicios" — is invisible to the whole cluster. SIM-04's ~23 new
exercises, SIM-06's new S23 exercise and…
- The cluster equates "the course's block executes in CI" with "the learner demonstrated the
skill". The badges' own evidence_rules say the evidence is the learner's submitted You Do and
integrator project with rubric…
- The static GitHub Pages edition is never addressed. `engine.ts` already returns
`eligible_pending_verification` there and refuses capstone credentials outright, and a static
learner has no lab tier, no project tier and,…
- `OPTIONAL_MODULES` (python_content_runtime_audit.py:36-67, used at :378 and :694) is the set
that actually drives dependency visibility and per-snippet skipping; SIM-02 replaces only
`CORE_TEACHING_MODULES` (:312) and…

## How capstones compose into CP-FINAL

**CC-1 · ALREADY_DECIDED** · judge: amended

*Q.* Is the repair to the non-composing capstones treatment (a) carry-forward through versioned
contracts, or treatment (b) rewrite CP-FINAL as a brownfield integration of course-provided
reference subsystems?

*A.* Carry-forward through versioned contracts. The (a)/(b) choice is not open:
learning_roadmap_52_V3.md already specifies the integration spine, and AGENTS.md ranks an
approved spec above existing behaviour. V3:103 'Los checkpoints transversales son gates, no
notas informales'; the CF table (V3:107-111) defines CF-1 at S13 as 'stakeholders, jobs-to-be-
done, métricas de éxito, restricciones/no-go, contratos y demo base', CF-2 at S26 as 'interfaces
Familiarity<->reporting<->RPA/IA, schemas y flujo de aprobación | contract tests y regresión
N1/N2 verdes', CF-3 at S39 as 'contratos…

*Implementation:* Record this in audit/fixer/decisions.md as a new standing entry (D12) so a
later round does not reopen (a)/(b): the CF spine is V3's, and any… | Treat
learning_roadmap_52_V3.md:103-113 as the contract for CC-2, CC-4 and CC-6; do not edit V3 to
match the code. | Add the CF row texts to audit/fixer/LEDGER_NOTES.md as the source of truth
every closer round reads.

**CC-5 · ALREADY_DECIDED** · judge: amended

*Q.* All five transversal checkpoints are recorded 'passed' in course-state/capstone_ledger.json
on evidence from somewhere else in the course, and no gate reads the field. What happens to
those states?

*A.* Withdraw all five 'passed' states and derive each one from running its contract tests.
D11's closing sentence settles it exactly: 'Never award a capstone or a badge retroactively, and
never mark one as earned because the evidence for it appears somewhere else in the course.'
CF-1's ledger row is state 'passed' with evidence 'CP-N1-C package + S13 phase6' for an artefact
— 'stakeholders, jobs-to-be-done, success metrics, constraints, contracts, base demo' — that S13
never asks for and never contained; CF-5's row is 'manifest of 12 capstones, stable interfaces'
with evidence 'CP-N4-C + CP-FINAL…

*Implementation:* Set state to 'not_passed' and evidence to null for CF-1..CF-5 in course-
state/capstones/capstone_ledger.json (course-state/capstone_ledger.json is… | Add a derivation
step: each CF's state comes from running that level's contract tests, written by the same runner
CC-4 introduces, and the row… | Extend scripts/course_complete_gate.py to read
transversal_checkpoints and to return course_complete false while any CF is unproven — a
tightening,… | Record the withdrawal in audit/fixer/decisions.md and re-raise for owner review
per D11.

**CC-9 · ALREADY_DECIDED** · judge: amended

*Q.* The Level-1 briefs declare typed, importable module interfaces (intake_cli.run(records) ->
IntakeResult at S04, etl.run(batch) -> EtlManifest at S08). Is that the Level-1 deliverable?

*A.* No. Level 1's contract is the record schema and the stdout format; the typed importable
interface is first emitted at S10 and frozen at S13 as part of CF-1. V3:169 is explicit about
the timing — the S04 increment 'procesa múltiples registros por stdin/stdout, resume errores y
tasas con denominadores correctos… La CLI instalable llega en S10' — and D9 settles the rest:
main() and __name__ are taught only where they become strictly necessary, 'the point at which a
learner stops treating a file as a script and starts importing it as a module', which D9 names
as S10. A brief that asks for…

*Implementation:* Rewrite the 'Interfaz de integración final' section of
public/capstones/CP-N1-A_BRIEF.md:40 and CP-N1-B_BRIEF.md:40 (and their course-state twins) to…
| Add the Level-1 contract (schema + stdout format) to CF-1's artefact list at S13 (CC-4). |
Check the remaining Level-1 briefs and section files for the same pattern, as D9 requires,
rather than assuming S04 and S08 are the only two.

**CC-11 · OWNER_CALL** · judge: amended

*Q.* S52 declares estimatedHours 29 while its own You Do plans 'Hitos 80 h' over nine weeks, and
the five closers are 9 hours each while carrying a capstone, a CF and a level regression. Which
number moves?

*A.* The present state is already ruled out — V3:777 says 'Cada sección parte de 16–24 horas
según dificultad… se ajusta alcance o soporte, no se falsifican horas para conservar un número
comercial' — so the course must either price the work honestly or cut it. Which one is yours,
because it changes the course's total time commitment and what the final credential represents.
Option 1: price honestly — raise s52's estimatedHours toward the ~80 h the section plans and the
closers toward the work CC-4 gives them; the course's advertised hours rise by roughly 50 h on
S52 alone and by up to 35 h across…

**CC-10 · RECOMMENDED_ASK_FIRST** · judge: amended

*Q.* The twelve reference subsystems exist but no learner can reach them. Publish them, and if
so, gated on what?

*A.* Publish them, ungated, as clearly labelled course reference material, and use provenance
rather than secrecy as the control. Three facts decide it. First, a reveal gate cannot be built:
src/lib/progress-store.ts persists only completedSections, completedSubSteps, quizScores,
lastVisited, bookmarks and startDate — there is no You Do submission record anywhere, so 'reveal
after submit' would need new infrastructure this cluster does not own. Second, the exposure is
smaller than it looks: the references are deliberately bounded — CP-FINAL_BRIEF.md says 'Los
subsistemas son versiones acotadas y…

*Reserved:* Changing a protected path beyond an ordinary content round: publishing ~2,200 lines
of new learner-reachable material under public/.; It changes what a learner can reach at a
capstone gate, which is…

**CC-2 · RECOMMENDED_ASK_FIRST** · judge: amended

*Q.* How does each capstone gate emit its contract, and how does the next increment consume the
previous one without an early failure blocking every later section?

*A.* Each gate You Do emits the contract its catalog entry already declares, and each later
starter consumes the previous increment through that contract — but as a data artefact in Levels
1-2 and as an imported module only from S10 onward, with a mechanical fallback. Concretely: (1)
every gate You Do writes its contract payload to a file in the contract shape (for example
out/CP-N1-A.intake_result.json); (2) the next section's starter reads that file if it is present
and validates against the contract, otherwise reads the course-shipped fixture of the same
shape; (3) from S10 — the section that…

*Reserved:* Restructuring a practice layer: the You Do layer of all 13 gate sections changes
shape.; Changing a protected path beyond an ordinary content round: src/lib/course/sections/ (13
files) and public/…

**CC-3 · RECOMMENDED_ASK_FIRST** · judge: amended

*Q.* CP-N1-A changes its record schema at every increment (S01 CSV, S02 parse_client, S03
validators, S04 batch dicts, and the brief) while the prose promises continuity. Which schema
wins?

*A.* One record schema from S01's CSV onward, and it is S01's: client_id, full_name, country,
signup_date, monthly_amount, extended (not replaced) where a later section needs a field. S02's
parse_client takes those fields, S03's validators validate those fields, S04's batch carries
those fields plus raw_line, and CP-N1-A_BRIEF.md declares the same set. The alternative —
deleting the continuity sentences so the drift becomes honest — is the wrong repair under the
standing policy, which prefers replacing with a better-scoped version over removal, and the
sentences are not decoration: s01:2336…

*Reserved:* Restructuring a practice layer: S02-S04's demos, We Dos and You Do starters all move
onto one record.; Changing a protected path beyond an ordinary content round:
public/capstones/CP-N1-A_BRIEF.md…

**CC-4 · RECOMMENDED_ASK_FIRST** · judge: amended

*Q.* What do the level closers actually have to produce, given that their CF artefacts are local
substitutes and their level regressions are typed in rather than run?

*A.* Each of the five closers emits its CF artefact as V3 defines it, and the level regression
is executed, not annotated. CF-1 at S13: a stakeholder / jobs-to-be-done / success-metric / no-
go matrix plus the Level-1 contract (record schema and stdout format), replacing 'CF-1: privacy
sheet + roles viewer/reviewer + notes de acceso' (s13:1960). CF-2 at S26: contract tests between
Level-1 and Level-2 outputs — S26 currently mentions CP-N1 zero times. CF-3 at S39:
ER<->graph<->triage contracts plus a cross-regression. CF-4 at S47: deploy one earlier capstone
through the S43-S47 path — the synthesis…

*Reserved:* Restructuring a practice layer: five closing You Dos change what they require and
what their starters contain.; Changing a protected path beyond an ordinary content round: five
files in…

**CC-6 · RECOMMENDED_ASK_FIRST** · judge: amended

*Q.* What may CP-FINAL claim, what provenance must it declare, and what is the S1–S52
regression?

*A.* Three parts, all settled by existing rulings. (1) Provenance: CP-FINAL declares, per
subsystem, whether the integrated module is the learner's own or the course reference, and a
reference module never counts as evidence toward the matching CP-N* capstone or badge — D11's
'never mark one as earned because the evidence for it appears somewhere else in the course'. The
claim at CP-FINAL_BRIEF.md:66, 'integré doce capstones de un curso de Python mediante interfaces
versionadas…', stays but is qualified by that declaration; s52-career-strategy.ts:2006 already
has the field (personal_contribution)…

**CC-7 · RECOMMENDED_ASK_FIRST** · judge: amended

*Q.* Late capstone starters ship the graded skill already implemented, so authorship demanded of
the learner falls level by level. What is done to them?

*A.* Blank the functions that carry the graded skill in every capstone-gate starter from Level 2
onward, keeping the fixtures, the harness and the acceptance criteria. Named: S26's regression
runner, S27's tests (s27:1689 test_threshold_branches already asserts the three branches the
section grades), S34's decide and build_workbench_report, S39's build_bundle stages, S43's
gate_case — which today returns CONTINUE, QUARANTINE_IMAGE and TRIAGE_SCAN_FINDING, exactly the
three values requirement s43:2345 asks the learner to produce — S44's equivalent, S47's
breach_action, and S13's defect repairs.…

*Reserved:* Restructuring a practice layer: eight capstone gate starters change what the learner
must write.; Changing a protected path beyond an ordinary content round: eight files in
src/lib/course/sections/.

**CC-8 · RECOMMENDED_ASK_FIRST** · judge: amended

*Q.* CP-N1-C's dashboard: rewrite the deliverable, or give the learner a primer? And what is
missing either way?

*A.* Neither is open — V3 already chose the primer route and the artefact is what is missing.
V3:268: 'La UI usa un scaffold estático o plantilla proporcionada; el diseño visual completo se
aprende en S19 y ER probabilístico en S30.' That is D11's pill-of-knowledge route written into
the spec. Build the provided static scaffold, and build it to the objective S13 actually states:
s13:33 'Ensamblar scaffold de dashboard/mapa con fichas de caso pseudonimizadas' and the You Do
requirement s13:1948 'Dashboard scaffold 3 casos + mapa/tooltips'. What exists today — the
dashboard_scaffold.py theory block…

*Judge's note on what the cluster missed:*

- The credential engine makes CC-2's fallback a permanent lock, and nobody says so.
src/lib/eligibility/engine.ts:156-182 (Gate 2) returns STATE_LOCKED when any prerequisite badge
is not already awarded, evaluated before…
- CP-FINAL's AST guard forbids the carry-forward shape CC-2 teaches. public/capstones/CP-
FINAL_BRIEF.md:39 makes 'ningún subsistema importa a otro (comunican vía contratos)' an
acceptance criterion, enforced at…
- The carry-forward graph already exists in code and no decision reads it.
src/lib/capstones/catalog.ts gives every capstone a `dependencies` list (CP-N1-B -> CP-N1-A,
CP-N2-A -> CP-N1-C, ... CP-FINAL -> all twelve) and a…
- CP-N4-C's three sub-gates are ignored in a cluster about composition. catalog.ts SUB_N4C
splits CP-N4-C across S49, S50 and S51 (runtime/adapters, evaluation/red-team,
observability/governance). CC-4 treats S51 as a…
- CP-FINAL is encoded as a one-section capstone. catalog.ts gives it contributingSections
['S52'] with twelve prerequisites and 29 declared hours. That encoding, not the prose, is what
makes 'integration happens once, at…

## The award engine and its gates

**AE-01 · ALREADY_DECIDED** · judge: amended

*Q.* May credential issuance open once the section-id keying bug is fixed, or must it stay
closed until every requirement the catalog lists has a server-side verifier? And what mitigates
the intermediate commit cc165af2, which issues a signed Class D credential on exam scores alone
and is now in main's history?

*A.* Unchanged in substance. Replace the merge-base evidence with `git log origin/main
--format=%H | grep cc165af2` (and `git branch -a --contains`), per AGENTS.md's explicit ban on
merge-base as proof, and correct the branch line cites to :92-98 / :108-126.

*Implementation:* Merge origin/main into audit/consolidated-issues-20260910 so
src/lib/credential-gates.ts, the rewritten src/app/api/credentials/issue/route.ts and… | Keep
`unverifiedRequirements()` (src/lib/credential-gates.ts:80-85) as the single switch: a verifier
is added by removing its component id from that… | Record the 2026-09-18 owner ruling (85%
floor, per-badge sections, closed issuance) as a numbered entry in audit/fixer/decisions.md, so
it binds… | Add to audit/fixer/decisions.md the note that cc165af2 is reachable from main and
must never be deployed, with the SHA named, per AGENTS.md 'Deploy…

**AE-14 · ALREADY_DECIDED** · judge: amended

*Q.* The V3 slug rename moves ExamAttempt and Progress rows by slug, so pre-V3 NumPy work is now
credited as S06 'Colecciones' and the credential gate counts it. Does pre-V3 evidence count
toward V3 credentials, and what happens to the rows?

*A.* Policy unchanged: pre-V3 evidence does not count and the rows are preserved. Fix the D9
attribution to decisions.md, soften the Moodle reading to 'fixed unless explicitly regraded',
and add to the implementation the attemptNumber renumbering and the Progress collision
resolution the applied migration performed, which the new migration must reverse. Flag the
prisma/migrations/ work as protected-path change requiring owner sign-off on the migration
design, even though the credit rule itself is settled.

*Implementation:* Run the live check first: on each server database, `SELECT COUNT(*) FROM
"ExamAttempt" WHERE "completedAt" < '2026-07-20T16:55Z'` and the same for… | New migration under
prisma/migrations/ (additive; never edit 20260918030000_rename_section_ids_batch_a): move
pre-2026-07-20T16:55Z rows back to, or… | src/lib/credential-gates.ts:67-74
(`countPassedSections`): add the `completedAt` lower bound and a `variantSeed` check that every
concept is present… | src/app/api/exam/start: stop drawing concepts absent from the current
bank.

**AE-16 · OWNER_CALL** · judge: amended

*Q.* Once the verifiers exist, what is the award engine permitted to issue: honestly-labelled
knowledge badges from the server-graded exams (class B), dashboard-only local markers, or
nothing until a performance grader ships?

*A.* Recommendation unchanged — (a) gated on the bank repair, with C and D suspended. Correct
option (c): use status 'retired' or 'superseded', or add 'suspended' to BadgeStatus and to Gate
1; 'suspended' as written is a no-op. Name the class B component drop as a relaxation of the
badge's requirements.

*Reserved:* Rewriting the 16 class B public_claims and setting achievementType in
badge_catalog.json; Suspending badges (status change) in badge_catalog.json

**AE-03 · RECOMMENDED_ASK_FIRST** · judge: amended

*Q.* What may the signed capabilityStatement say? Today it asserts 'The holder independently
demonstrated ${badgeId} … including critical evidence, hidden validation, and independent
review.'

*A.* Same decision; correct the sweep list. Replace 'Dashboard.tsx:770,817' with 'credential-
policy/page.tsx:32, :40, :47'. Raise Dashboard.tsx:770 (70% vs the 85 credential floor) and :817
(a supervisor-verification workflow with no route behind it) as separate findings under
AGENTS.md 'Never present mocks or placeholders as production features'.

*Reserved:* Rewriting the signed capabilityStatement in src/app/api/credentials/issue/route.ts
(what the credential claims); Editing the corresponding sentences in src/app/credential-
policy/page.tsx and…

**AE-04 · RECOMMENDED_ASK_FIRST** · judge: amended

*Q.* 'Verificación pública' is claimed, but credentials are signed with symmetric HMAC-SHA256,
so only PyArcana can check one. Correct the claim, or publish an asymmetric key?

*A.* Same order of operations. Pick the proof stack first: RS256 under OB3 §8.2's JWT format, or
EdDSA/Ed25519 under the JSON-LD linked-data-proof stack — not §8.2 with Ed25519. Add the
NODE_ENV fallback: the repo-visible dev key must fail closed on every non-local deploy, not only
when NODE_ENV === 'production'.

*Reserved:* Removing 'verificación pública' from the five class D public_claim strings in
badge_catalog.json

**AE-05 · RECOMMENDED_ASK_FIRST** · judge: amended

*Q.* Three mechanisms grandfather an award that current evaluation would refuse: awardIdempotent
forces AWARDED for anything in the caller's record, the policy pages say badges issued under
earlier criteria 'conservan su validez', and 26 gap_closure_policy clauses re-issue a pilot
badge as active 'without requiring…

*A.* Split it. (a) Delete the awardIdempotent force block and source awarded_badges from server-
side rows: ALREADY_DECIDED under D11, land it now. (b) The 26 gap_closure clauses and the two
'conservan su validez' sentences: RECOMMENDED_ASK_FIRST — D11 governs awarding, not the
invalidation of awards already issued, and the Moodle benchmark supports version-bound validity
rather than blanket carry-forward failure. (c) Note that catalog_version needs a BadgeAward
column and a new migration under prisma/migrations/.

**AE-09 · RECOMMENDED_ASK_FIRST** · judge: amended

*Q.* The catalog side of the same mismatch: no badge lists SELFCHECK in required_activities
although every badge has a self_check component; the five integrated badges list YOUDO only;
`legacy_only` is defined and read nowhere; and `progress_phase0_walked` — satisfiable from self-
reported localStorage toggles — is a…

*A.* Unchanged. Correct the scope: the progress_* prerequisite must be removed from four
credentials (_foundations, _independent, _advanced_applied, _integrated_mastery);
evidence_grounded_ai_systems_capstone has none, and no competency badge has one.

*Reserved:* Adding SELFCHECK/EXAM to required_activities in badge_catalog.json, or dropping the
matching components; Removing progress_* badges from competency and credential
prerequisite_badges

**AE-10 · RECOMMENDED_ASK_FIRST** · judge: amended

*Q.* Prerequisites point forward in the course, so every phase credential is unreachable at the
end of its own phase, and retiring one badge locks eight others plus three credentials. What
shape should the prerequisite graph have, and what invariant enforces it?

*A.* Unchanged in substance. Correct the count: the invariant fails on 5 edges today, listed
above, and 4 badges are permanently unreachable. Pin the test to the enumerated edge list rather
than to a number.

*Reserved:* Rewriting prerequisite_badges in badge_catalog.json to the recommended shape; Any
badge retirement, which must land with the prerequisite rewrite in the same change

**AE-11 · RECOMMENDED_ASK_FIRST** · judge: amended

*Q.* Gap-closure supplementary exercises tell the learner to take an artifact from outside the
course ('a public ML tutorial notebook', 'a slow SQL query from a public Postgres/MySQL
tutorial'), and their ids do not match the ids the engine looks up. Can a competency claim rest
on them?

*A.* Unchanged, plus a fourth supplementary: author a selector_resilience gap-closure exercise
sourced from the learner's own CP-N2-C RPA flow, or the three badges that list it as critical
stay blocked by Gate 7 forever. Fix the cite to :248-255, and say the prompts 'permit' rather
than 'instruct'.

*Reserved:* Rewriting gap_closure exercise prompts and ids in industry_alignment/badge_rubrics/
and badge_requirements/ (changes what the badge requires and claims)

**AE-15 · RECOMMENDED_ASK_FIRST** · judge: amended

*Q.* Every class D credential requires a defense scored at 100%, and the shared communication
rubric requires a recorded 5-minute audience-tuned presentation with slides — but V3 teaches
'video y defensa técnica' only at S52-T4. Four of the five credentials therefore demand a
performance the course first teaches after…

*A.* Same route, wider scope: repoint the defense/presentation criterion for all eight badges
whose last required section precedes S52 — the L1, L2, L3 and L4 credentials plus the seven
competency badges listed — keeping the recorded oral presentation only for
evidence_grounded_ai_systems_capstone at S52. Cite assessment_validity_report.md:48, which
already admits a written defense as tier 6.

*Reserved:* Repointing the defense component and rubric criterion for the L1-L3 credentials in
badge_catalog.json and badge_requirements/; Demoting communication_audience_tuned from critical
to weighted at L1-L3…

**AE-02 · SELF_ANSWERED**

*Q.* Where do the facts inside an issued credential come from — the client, or the server?
Specifically specificationVersion, expiresAt, and the evidence an employer can inspect.

*A.* Every field of an issued credential is computed on the server from the catalog and from the
learner's own rows; the request body may carry only `badgeId`. `specificationVersion` comes from
badge_catalog.json's `version` (1.0.0), never from `body`. `expiresAt` comes from the badge's
own `expiration_policy.expiration_period_days` (1095 for every class D badge), so a credential
that the catalog says expires actually expires. The issuance record stops being a Notification
row and becomes a `Credential` row plus one `CredentialEvidence` row per piece of evidence, each
pointing at the learner's own…

*Implementation:* src/app/api/credentials/issue/route.ts: delete `specificationVersion` from
`CredentialIssuanceRequest` and from the destructure at :91; read it from… | Add
`credentialValidity(spec)` to src/lib/credential-gates.ts returning `issuedAt +
expiration_policy.expiration_period_days` when `expires` is true,… | Replace the
`db.notification.create` call (route.ts:164-171) with `db.credential.create` plus
`db.credentialEvidence.createMany`, one row per… | src/app/api/credentials/verify/route.ts:
return the CredentialEvidence summaries and the `validUntil`/`revocationStatus` pair alongside
the…

**AE-06 · SELF_ANSWERED** · judge: amended

*Q.* The engine never reads learner_id, server_verified, submitted_at, verification_mode or any
expiry, and a supplementary exercise scored 0 satisfies its gate. What refusal rules does it
need before any adapter is written?

*A.* Keep rules 1, 3, 4 and 6. Rewrite rule 2 to refuse evidence with server_verified !== true
for any badge whose verification_mode is not 'local_only', and add 'server_authoritative' to the
VerificationMode union. Drop rule 5: leave evidenceTierMinimum at TIER_YOU_DO for section
activities and enforce TIER_MIN_FOR_CAPSTONE where it belongs — on the defense component's own
evidence — or leave the constant unused with a comment saying why.

*Implementation:* src/lib/eligibility/types.ts: add `learner_id`, `source_id`, `grader_id`,
`graded_at`, `content_version` to ActivityEvidence and to a new… |
src/lib/eligibility/engine.ts: add a single `admissible(evidence, spec, progress, now)`
predicate applied in `indexEvidence` and before every… | engine.ts:84-89: return
`TIER_MIN_FOR_CAPSTONE` for `isCapstone(spec)`. | engine.ts:391: require `score >=
PROVISIONAL_FLOORS.integrator_project_pct` (85) rather than merely defined.

**AE-07 · SELF_ANSWERED**

*Q.* A CriticalCompetencyScore carries no badge, project, defense, grader or date, and the
engine matches on competency_id alone — so one rubric row satisfies the same critical gate in
every badge. Separately, Gate 3 demands tier ≥4 for every required activity including section
exams, and the tier ladder has no rung for a…

*A.* Two changes, one commit. (1) A critical competency score is keyed by its source as well as
its competency: `{competency_id, source_id, badge_id, grader_id, graded_at, rubric_score_pct,
criteria_scores}`, and the engine accepts it only when `source_id` is one of the badge being
evaluated's own `required_projects`, its defense id, or one of its supplementary ids. (2)
Section exams get an evidence kind of their own, outside the independence ladder, and Gate 3's
tier ≥4 rule applies only to project-shaped activities (YOUDO and above); exams are held to
their own floor of 85, which is stricter…

*Implementation:* src/lib/eligibility/types.ts:117-123: extend CriticalCompetencyScore with
`source_id`, `badge_id`, `grader_id`, `graded_at`. | src/lib/eligibility/engine.ts:334-336:
replace the `find((s) => s.competency_id === comp_id)` lookup with one that also requires
`source_id` ∈… | types.ts: add an `EvidenceKind` ('exam' | 'self_check' | 'project') to
ActivityEvidence; engine.ts:204-206 applies the tier floor only where kind ===… | Mirror both in
tests/adversarial/test_eligibility_engine.py:480-481, which reads the list the same way.

**AE-08 · SELF_ANSWERED**

*Q.* Progress markers return before Gate 4 and component scores average only the sections that
happen to have evidence. Should the engine gate what the badge claims, or should the claim be
lowered to what is gated?

*A.* Gate what is claimed — on the engine side, which needs no catalog edit and no claim change.
`finalizeProgress` runs after Gate 4, so a phase marker that says 'all 13 capstones' requires
its `required_projects`. Every aggregate (`aggregateSelfCheck`, `aggregateYouDo`,
`aggregateExams`, `aggregateSectionCompletion`) treats a required section with no evidence as a
null input that fails the component, instead of skipping it — the component's denominator is
`required_sections.length`, always. The catalog-side half of the mismatch (required_activities
that omit SELFCHECK everywhere and EXAM for the…

*Implementation:* src/lib/eligibility/engine.ts:254-257: move the `isProgress(spec)` early
return to after Gate 4 (:259) so progress markers require… | engine.ts:596-602, :624-630 and the
sibling aggregates: replace `if (!e || e.score_pct === null) continue` with pushing `null`, and
return null for… | Mirror both in tests/adversarial/test_eligibility_engine.py:409-413, which
repeats the Gate-4 bypass. | Keep `aggregateIntegrator`'s exclusion of defense and supplementary
ids; they have their own gates.

**AE-12 · SELF_ANSWERED** · judge: amended

*Q.* Capstone cards show badge ids that exist in no catalog, and CP-N4-C's and CP-FINAL's are
swapped relative to the issuance map. What does a card show while issuance is closed?

*A.* Unchanged, plus: make scripts/generate_capstone_validation.py read the derived map instead
of its own literal column, regenerate capstone_validation/capstones/CP-*.json, and extend the
agreement test to the generated artifacts so no third copy can drift.

*Implementation:* src/lib/capstones/catalog.ts: replace the five literal `badgeId` values with
the catalog's `badge_id`s, or derive them from badge_catalog.json at… |
src/components/course/CapstonesPage.tsx:250-260: hide the Award chip while the credential is
unissuable; keep the version chip. | Add the derived map to the same module the issuance route
reads, so one source defines both directions.

**AE-13 · SELF_ANSWERED**

*Q.* course-state/capstone_ledger.json reports 13 capstones 'formally_passed' and
course_complete_gate.py reads that field as truth, while 66 of 77 package tests are `assert
True` placeholders. Where does capstone state come from?

*A.* From running the tests, never from a stored verdict. `scripts/course_complete_gate.py`
stops reading `state` out of the ledger and instead runs each capstone's package tests under
`.venv-content`, and a test body that contains only `assert True` (or no assertion at all) is
rejected as no test, so the capstone cannot report pass. Every capstone whose package has no
executing test drops to `content_authored`. On today's evidence that is 11 of 13 — the ledger's
`formally_passed: 13` becomes 2 at most, and the `capstones_formally_passed_13` gate goes red
until real tests exist. That is the…

*Implementation:* scripts/course_complete_gate.py:15-23: replace the `good = {'formally_passed',
…}` string match with an execution result; compute… | Add a placeholder detector: parse each
course-state/capstones/*/tests/*.py, and fail any module whose every test function body is
`pass`, `assert… | tools/fixer/ledger.py: regenerate course-state/capstone_ledger.json's `state`
and `execution_status` from the run, so the ledger is computed like… | Record the downgrade and
the 11 affected capstone ids in audit/fixer/OPEN_QUESTIONS.md so the content work is queued
rather than lost.

*Judge's note on what the cluster missed:*

- TWO DIVERGENT BADGE CATALOGS. src/lib/eligibility/badge_catalog.json (what the TypeScript
engine loads) and industry_alignment/badge_catalog.json are different files — different md5,
366,281 vs 371,929 bytes — and all…
- NO REVOCATION PATH, WHICH AE-01's CLOSED ISSUANCE MAKES THE NEXT BLOCKER. prisma/schema.prisma
defines CredentialRevocation and nothing writes it; badge_catalog.json's revocation_policy
(server-side flip to 'revoked',…
- THE STATIC EDITION ISSUES NOTHING BUT CLAIMS ELIGIBILITY. engine.ts:475-487 returns
STATE_ELIGIBLE_PENDING_VERIFICATION with eligible: true for a competency badge on the static
GitHub Pages edition, computed entirely…
- SELECTOR_RESILIENCE HAS NO GAP-CLOSURE RUBRIC AT ALL. It is gap-affected in types.ts
GAP_AFFECTED_COMPETENCIES and is a critical competency of reliable_automation_development,
integrated_automation_engineering_practice…
- THE DEV SIGNING KEY IS LIVE OUTSIDE PRODUCTION. issue/route.ts:42-58 falls back to the literal
'dev-only-key-not-for-production-use', committed in this repository, on any deploy where
NODE_ENV !== 'production'. The…

## The capstone contract across three artifacts

**CC-05 · ALREADY_DECIDED** · judge: amended

*Q.* CP-N1-A and CP-N1-B briefs publish importable typed module interfaces
(`intake_cli.run(records) -> IntakeResult`, `etl.run(batch) -> EtlManifest`) at S04 and S08, but
the installable CLI is taught at S10. Do the Level-1 gates get a primer for it, or does the
contract change shape?

*A.* ALREADY_DECIDED is upheld — D11 plus V3:169's explicit "La CLI instalable llega en S10" do
settle that the Level-1 contract is rewritten rather than primed, and the brief's
`intake_cli.run(records) -> IntakeResult` / `etl.run(batch) -> EtlManifest` come out. But the
replacement shape must be stated from the sections as they are, not as described: S04's You Do
currently requires `if __name__ == '__main__'` (objective and requirement), so the Level-1
contract is not "top-level statements plus a _run_tests() fixture" today. Reconcile with D9
first (see missed items), then write the contract…

*Implementation:* Regenerate course-state/capstones/CP-N1-A/{BRIEF.md,FINAL_INTERFACE.md} and
CP-N1-B's equivalents so 'Interfaz de integración final' states the dict… | Keep
`finalIntegrationInterface` in catalog.ts as the Level-3 integration identity but add a
`contractForm` field per capstone ('dict+stdout' for… | Record the change and re-raise it in
audit/fixer/OPEN_QUESTIONS.md as D11 requires, linking Q3 (the S02–S04 cumulative practice
layer), which is the… | Mirror to public/capstones under CC-09.

**CC-12 · ALREADY_DECIDED** · judge: amended

*Q.* CP-N1-C's P0 'Sin mecanismo de corrección' demands an override-and-appeal mechanism at a
Level-1 gate, and S13 does not grade one. Primer, rewrite, or move?

*A.* ALREADY_DECIDED is upheld for the P0 rewrite: D11's tree plus V3:268 (which names ER
determinista, the two separated scores, geoevidencia trazable, revisión humana, límites
explícitos and the provided UI scaffold, and does not name a correction mechanism) settle that
the dependency is rewritten, not primed, and the standing policy's "prefer deleting and
replacing with a better-scoped version" supports 'Sin cola clerical operativa'. One thing must
be resolved in the same breath: `correction_mechanism` is a declared field of CP-N1-C's own
integration contract…

*Implementation:* Regenerate course-state/capstones/CP-N1-C/{BRIEF.md,RUBRIC.json} under CC-01
so the P0 reads 'Sin cola clerical operativa' and the acceptance… | Edit
/Users/pabloillescas/Documents/GitHub/pyarcana/src/lib/capstones/catalog.ts CP-N1-C
`criticalFailures`: 'Sin mecanismo de corrección' → 'Sin… | Build the V3:268 UI scaffold and
carry the primer text above verbatim into S13's You Do context, naming S19 as where accessible
view design is taught. | Confirm CP-N3-C's brief and S39 do grade override and appeal; if they
do not, that is a finding for the C-level3 clusters, not a reason to keep the…

**CC-01 · RECOMMENDED_ASK_FIRST** · judge: amended

*Q.* When the public brief/rubric, the gate section's You Do increment and the course-state
package disagree about what a capstone grades, which artifact is canonical, and what is the rule
for reconciling them?

*A.* Keep the three-tier authority (V3 gate line > gate-section You Do > generated
package/mirror/catalog views) and record it as D12, but (a) strike the "if the gate line names
the disputed capability it is ADDED to the You Do" branch from D12's self-executing rule and
route every ADD through Ask-first, and (b) scope tools/capstone/sync.py to the twelve packages
the old SPECS dict actually generated, excluding CP-N4-C and CP-FINAL. With those two carve-outs
it is SELF_ANSWERED.

**CC-04 · RECOMMENDED_ASK_FIRST** · judge: amended

*Q.* Every capstone declares a `finalIntegrationInterface` that CP-FINAL is supposed to invoke,
yet none of the 13 signatures is named anywhere in the 52 sections, and the registry CP-FINAL
reads stores the wrong field. Where does the integration contract live, and who states it to the
learner?

*A.* Split the decision. (a) Fix scripts/generate_capstone_validation.py:50 to read c[9]
(finalIntegrationInterface) instead of c[10] (criticalFailures), compute contractTestsPresent
from a real scan, regenerate final_integration_contracts.json, and extend
test_capstone_consistency.py to cover the interface field — SELF_ANSWERED, do it. (b) Adding a
new requirement line naming the contract to all thirteen gate sections' youDo.requirements is
RECOMMENDED_ASK_FIRST under AGENTS.md's "Restructuring a practice layer", and it must be
resolved together with CC-12 before it is proposed.

**CC-06 · RECOMMENDED_ASK_FIRST** · judge: amended

*Q.* CP-N3-B's brief grades a graph investigation workbench and S34's You Do grades a
calibrated-threshold workbench. Which is the middle Level-3 gate?

*A.* Option (a), the union, is upheld and RECOMMENDED_ASK_FIRST is the right classification. Two
corrections: the gate line is at learning_roadmap_52_V3.md:503, not :504; and add V3:57 as
supporting evidence — the capstone table's Evidencia publicable cell for CP-N3-B reads "grafo
explicable, búsqueda de caminos, casos y controles de privacidad", which independently promises
the graph half. That makes option (b) strictly worse than stated: narrowing to ranking-only
would require amending both V3:503 and V3:57, i.e. two protected-spec edits, and would leave the
published evidence promise unmet.

*Reserved:* Add the graph-and-evidence half to S34's You Do — restructuring a practice layer; If
option (b) instead: amend learning_roadmap_52_V3.md:504 (protected path, approved spec)

**CC-07 · RECOMMENDED_ASK_FIRST** · judge: amended

*Q.* CP-FINAL's brief grades `platform.integrate(scenario) -> IntegrationBundle`, a name that
occurs zero times in the 52 sections, while S52's You Do grades six bounded contexts, an RPO/RTO
drill, eight evidence artefacts and a `curriculum_gate`. Which survives?

*A.* The union is right — keep `platform.integrate(scenario) -> IntegrationBundle` and S52's
eight artefacts, RPO/RTO drill and curriculum_gate, and regenerate CP-FINAL's brief as their
union. Two corrections: drop the claim that CP-FINAL holds the only non-placeholder tests
(CP-N4-C's tests/test_demo.py and tests/test_otel_export.py also contain zero `assert True` and
real subprocess assertions on a METRICS_JSON contract), and route the two new S52
youDo.requirements through the same Ask-first decision as CC-04(b), since adding graded
requirements to the final capstone changes what CP-FINAL…

**CC-02 · REFUTED** · judge: refuted

*Q.* V3 contradicts itself about CP-N2-A: the summary table at V3:53 says 'memo ejecutivo', the
S17 gate line at V3:314 says 'memo de límites'. Which one binds, and does V3 get amended?

*Refuted:* I ran CC-02's own proposed test. Normalising accents/case and splitting each table
cell on commas, every one of the 13 rows reports missing phrases against its gate line — CP-N1-A
misses 'script stdin/stdout', 'entradas sintéticas', 'validación', 'README y demo'; CP-N1-C
misses all four; CP-FINAL…

**CC-03 · SELF_ANSWERED** · judge: amended

*Q.* S17's You Do is titled 'Portfolio ejecutivo de calidad + EDA (cierre del nivel)', but Level
2 closes at S26. Is CP-N2-A a level closer?

*A.* Retitle S17's You Do to "Portfolio ejecutivo de calidad + EDA (cierre CP-N2-A)" — upheld.
Correct the stated convention and the test: the rule the repository actually follows is that
every gate section's youDo.title reads "cierre <CP-ID>", and no youDo.title anywhere says
"cierre de(l) nivel". The test should therefore be an absolute prohibition on that phrase in any
youDo.title, not a conditional permission for level-closing gates.

*Implementation:* Edit
/Users/pabloillescas/Documents/GitHub/pyarcana/src/lib/course/sections/s17-packaging.ts:1596:
`title: "Portfolio ejecutivo de calidad + EDA… | Check the same phrase in S17's theory and weDo
prose and in course-state/capstones/CP-N2-A/YOUDO.md; correct any that call S17 a level closer.

**CC-08 · SELF_ANSWERED** · judge: amended

*Q.* Eleven capstone packages ship 66 `assert True # placeholder` test functions, and
RUBRIC.json's `tests_required` and BRIEF.md's acceptance criteria present exactly those
placeholders to the learner as the checks that decide the gate. What may a rubric list as a
required test?

*A.* Upheld and SELF_ANSWERED: a rubric may list a check only when a real falsifiable assertion
enforces it, fix the emitter, gate on tautological assertions, and keep
scripts/enrich_capstone_packages.py as INACTIVE_PRESERVED rather than deleting it. Add one
artifact to the recompute set: course-state/capstone_ledger.json declares `"state":
"formally_passed"` for every capstone on the same placeholder evidence and is read by
tests/adversarial/test_capstone_consistency.py, so recomputing only INDEX.json leaves a second
green claim standing. Also settle the scope conflict with CC-01 in favour of…

*Implementation:* Rewrite the test emitter (the code at scripts/enrich_capstone_packages.py:85)
inside CC-01's tools/capstone/sync.py: each acceptance criterion… | Regenerate course-
state/capstones/*/tests/test_demo.py for the eleven affected packages; run each under .venv-
content per CLAUDE.md and record real… | Recompute course-state/capstones/INDEX.json
`execution_status`, `passed` and `formally_ready` from that run instead of the 2026-07-20
snapshot; make… | Add the placeholder check to scripts/capstone_contract_gate.py and to `npm run
test:course-complete`.

**CC-09 · SELF_ANSWERED** · judge: amended

*Q.* public/capstones/<ID>_{BRIEF.md,RUBRIC.json} and course-
state/capstones/<ID>/{BRIEF.md,RUBRIC.json} are byte-identical copies of each other for 25 of 26
files, and the learner reads only the public copy. Which is the source, and how is drift
prevented?

*A.* Single source plus a `--check` mirror gate is upheld and SELF_ANSWERED. Reverse the one-off
resolution direction: merge the public copy's version of the `contribution_statement` bullet
back into course-state, then mirror — do not overwrite public with course-state. git shows
public/capstones has been touched by exactly two commits, 5505b74a "make briefs and rubrics
self-contained on the website" and d2af3788, and the single divergence is of exactly that kind:
the bullet moved up and the now-false cross-reference "más abajo" was dropped so the public copy
reads standalone. `public/` is a…

*Implementation:* Add a `--check` and a `--write` mode to CC-01's tools/capstone/sync.py that
mirrors course-state/capstones/<ID>/BRIEF.md →… | Run `--write` once to resolve the existing CP-
FINAL divergence in the direction of course-state (the source), then re-read the rendered page
to… | Add `--check` to scripts/capstone_contract_gate.py and to the `npm run test:course-
complete` chain. | Add a one-line header comment to each public mirror saying it is generated
and naming the source path, so a future editor is warned before…

**CC-10 · SELF_ANSWERED** · judge: amended

*Q.* Eleven of thirteen briefs describe their contributing sections with topics from a different
curriculum — 'S16 (wxPython GUI)', 'S32 (microservices)', 'S45 (IaC)', 'S17 (packaging)'. How
are section references in generated artifacts produced?

*A.* Generate section references rather than hand-writing them — upheld and SELF_ANSWERED. Three
corrections. (1) The generator must gloss on first use rather than copy V3 headings verbatim:
the briefs today carry D1-style inline glosses ("S20 (RAG (esto es, Generación Aumentada por
Recuperación: antes de responder, el sistema busca documentos y cita de dónde sacó cada
afirmación))"), and emitting "S17 — Joins, reshape, groupby y cierre analítico" verbatim would
strip them and inject un-glossed anglicisms into learner-facing Spanish. (2) The regex `S\d{2}
\(([^)]+)\)` breaks on those nested…

*Implementation:* In CC-01's tools/capstone/sync.py, parse the 52 `### Sxx — <title>` headings
from learning_roadmap_52_V3.md into a lookup, and emit the brief's '##… | Regenerate all
thirteen briefs; mirror to public/ under CC-09; re-read the rendered pages. | Open a follow-up
item (not this round) on whether the eleven stale section file slugs under
src/lib/course/sections/ should be renamed to match V3 —…

**CC-11 · SELF_ANSWERED** · judge: amended

*Q.* Every capstone card displays a badge id that does not exist in badge_catalog.json, and the
two Level-4 ids are assigned to the wrong capstones. What should a capstone declare and show?

*A.* The forward assignment is right and SELF_ANSWERED stands (no badge_catalog.json edit, no
award-path change — badgeId is read only by CapstonesPage.tsx:258 and :422, while issue/route.ts
keys its own capstoneMap off the request body's badgeId, already in full form). Three fixes. (1)
Restate the rule: a capstone's badgeId is the `integrated_python_ai_capstone_*` credential for
its level, or `evidence_grounded_ai_systems_capstone` for CP-FINAL. "The badge whose
required_projects contains that capstone" is under-determined — CP-N2-A appears in
progress_phase1_walked as well, and all thirteen…

*Implementation:* Edit
/Users/pabloillescas/Documents/GitHub/pyarcana/src/lib/capstones/catalog.ts: replace the five
bare badge strings in the `mk(...)` calls with the… | Edit
/Users/pabloillescas/Documents/GitHub/pyarcana/src/components/course/CapstonesPage.tsx:258 and
:422 to render the badge's `name` from… | Regenerate capstone_validation/capstones/CP-*.json
(which carry the same wrong `badgeId`) from catalog.ts via
scripts/generate_capstone_validation.py. | Record in audit/fixer/LEDGER_NOTES.md that catalog.ts
badge ids are derived from badge_catalog.json `required_projects`, so a future round does not…

**CC-13 · SELF_ANSWERED** · judge: amended

*Q.* CP-N3-A's rubric requires 'separación train/dev/test respetada' and its P0 is 'Sin
separación train/dev/test', while S30 teaches and grades train / test / cross_split and never
uses the word 'dev'. Which naming is graded?

*A.* The substance holds — S30's three roles (train / test / cross_split) are what is taught and
graded, 'dev' is untaught, and the brief, rubric and P0 adopt S30's vocabulary; escalating the
methodological question to C-level3-data-roles rather than deciding it inside a rename is the
right call and honestly stated. But the file does not exist under the cited name. S30 is
/Users/pabloillescas/Documents/GitHub/pyarcana/src/lib/course/sections/s30-security-infra.ts,
not s30-entity-resolution.ts. Both source citations and, critically, both proposed tests must
point at the real path — and better, must…

*Implementation:* Regenerate course-state/capstones/CP-N3-A/{BRIEF.md,RUBRIC.json} under CC-01
so the acceptance criterion and the P0 read 'separación por entidad… | Edit
/Users/pabloillescas/Documents/GitHub/pyarcana/src/lib/capstones/catalog.ts CP-N3-A
`criticalFailures`: 'Sin separación train/dev/test' → 'Sin… | Before running the generator,
check with the C-level3-data-roles cluster's decision on whether S30 gains a dev/validation
split; if it does, take the… | Mirror to public/ under CC-09 and re-read the rendered brief.

*Judge's note on what the cluster missed:*

- D9/D10 collide with D12 and nobody notices. S04's You Do lists "Demo reproducible con if
__name__ == '__main__'" as both an objective and a requirement (s04-iteration-summaries.ts; 2
occurrences of __name__ in the file,…
- The generator's real scope is twelve, not thirteen. scripts/enrich_capstone_packages.py's
SPECS dict holds only CP-N1-A through CP-N4-B; CP-N4-C and CP-FINAL were authored by hand, which
is why they are the only…
- Nine of the fourteen required package artifacts fall out of scope.
tests/adversarial/test_capstone_package_content.py requires each package to ship BRIEF.md,
RUBRIC.json, demo.py, data/generate.py, tests/test_demo.py,…
- A second artifact declares every capstone passed. course-state/capstone_ledger.json carries
"state": "formally_passed" for each capstone, with evidence_required strings lifted from V3's
Evidencia publicable column, and…
- The learner-facing briefs sit outside every prose gate. Nothing under scripts/ or tests/
references public/capstones, so the glossary, first-use, anglicism, a11y and contrast gates
listed in CLAUDE.md do not cover the…

## Where the learner works unaided

**PU-1 · ALREADY_DECIDED** · judge: amended

*Q.* The code marks all 416 E2 exercises kind:'independent' and the UI prints 'Independiente',
while V3 defines E2 as the reduced-scaffolding rung and E3 as the independent transfer rung.
Which definition governs, and what may the practice card claim about a rung?

*A.* Keep ALREADY_DECIDED for the naming question only: V3 governs, E1=Guiado, E2=Apoyo
reducido, E3=Transferencia independiente, and 'Independiente' stops being applied to E2. State
that types.ts:102 already accepts the new value (open union) so this is a documentation and
label fix, not a type change. Move the 'no rung may claim independence while its starter hands
over the answer' clause to PU-2/PU-6, where it is decided on the merits. Correct the eligibility
citation to src/lib/eligibility/types.ts:53-54 and :67-68.

*Implementation:* src/lib/types.ts:102 — add 'scaffolded' to the WeDoStep.kind union and
document the V3 mapping (E1=guided, E2=scaffolded, E3=transfer) in the doc… |
src/components/course/SectionView.tsx:590-600 — replace the three-way label expression: guided
-> 'Guiado', scaffolded -> 'Apoyo reducido', transfer… |
src/components/course/SectionView.tsx:543-545 — rewrite the 'Manos a la obra' callout so it does
not tell the learner to open the solution when stuck. | src/lib/course/sections/*.ts —
mechanical: every id matching -E2 gets kind:'scaffolded', every -E3 gets kind:'transfer'.
Exercise ids are untouched,…

**PU-9 · ALREADY_DECIDED** · judge: amended

*Q.* RC-6 says to hand-write the missing topic evaluations 'to the S02 standard'. That standard
requires functions, dicts and handled exceptions, which D9 and D10 forbid in the early sections
and Q3 has not resolved. What is authored first, and what happens to S02's existing four TEs?

*A.* Keep the build order — Level 2 first (S17 and S21 ahead of the rest), then Level 3, Level
4, and Level 1 only after Q3's route is recorded — and keep the extension of the D9/D10 scan to
TopicEvaluation title, deliverable and rubric_0_3 prose. Cite D1 alongside D10 for the
ValueError reference, since D10 governs the construct and D1 governs the undefined term. Remove
the instruction to rewrite S02's four TEs now; it belongs behind Q3 with the rest of S01-S04,
and the decision's own build order already says so.

*Implementation:* src/lib/course/sections/s02-basics.ts:2427-2520 — rewrite the four TEs so the
tasks use check-first validation (str.isdigit, explicit membership) and… |
tests/adversarial/test_forward_dependencies.py — extend the D9/D10 scan beyond code blocks to
TopicEvaluation deliverable, title and rubric_0_3… | audit/fixer/OPEN_QUESTIONS.md Q3 — add a
line recording that S01-S04 TE authoring is blocked on Q3's route, so the blockage is visible
rather than… | Author order in the work queue: Level 2 (S14-S26, gate sections S17/S21 first),
then Level 3, then Level 4, then Level 1 once Q3 is answered.

**PU-13 · OWNER_CALL**

*Q.* V3 prices a per-topic authentic-evaluation layer into every section's hours, and 196 of 208
evaluations were never built — 392 tasks, the largest single authoring cost in the campaign.
Fund it, or amend the contract?

*A.* Recommendation: fund it, built by level and sequenced so the topics feeding gate sections
come first, with the PU-8 ratchet making the remaining shortfall visible in CI at all times. Do
not leave the promise unbuilt behind a green gate, and do not quietly narrow it — if it is
narrowed, V3:777's hour figures and every learner-facing statement about authentic evaluation
are restated in the same change.

**PU-11 · RECOMMENDED_ASK_FIRST** · judge: amended

*Q.* Eight late capstone starters already contain the skill the capstone grades. Does the
starter get blanked, and what does that do to the capstone's regression fields?

*A.* Same decision and same RECOMMENDED_ASK_FIRST classification, with the badge mapping
corrected from badge_catalog.json: S43 backs applied_mlops_pipeline_delivery (active, with S29)
and llmops_production_delivery (active, with S41 and S42);
container_platform_engineering_practice (pilot) rests on S45 and S46, so those two sections join
the sequencing even though their starters were not in the original eight. Replace the
identifier-matching test with a per-capstone allowlist of graded symbols, declared next to the
rubric, since the objectives are prose. Add the S26 fabricated-evidence finding —…

*Reserved:* Changing a protected path (src/lib/course/sections/) beyond an ordinary content
round: removing implemented code from eight capstone starters.; Changing the evidence behind
live credential claims —…

**PU-6 · RECOMMENDED_ASK_FIRST**

*Q.* Where does the rung live where the learner writes code unaided — E3 in every subtopic, the
topic evaluation, or the section You Do? The synthesis treats these as competing options costing
the same 416 tasks.

*A.* Both, because they are not the same artefact and do not do the same job. E3 becomes the
per-subtopic generative rung: a blank body with the signature, fixtures and a declared expected
output given, small (3-6 lines in Level 1), immediately after the subtopic, run in the card's
runner. The topic evaluation stays what V3 defines — one integrated authentic artefact per topic
covering both subtopics, graded once on 12. The You Do remains the section project and is never
the first place a skill is written. The existing planted-defect repair content is not deleted:
it moves down to E1, or stays as…

*Reserved:* Restructuring a practice layer: rewriting the E3 rung of all 416 subtopics from
repair to generative, course-wide.; Relocating the displaced planted-defect content to E1 or to
new non-canonical…

**PU-5 · REFUTED** · judge: refuted

*Q.* The theory tab's playground is the only runnable Python on the page, and in several
sections it runs a topic the course has not taught yet. Is that a forward dependency to repair,
and what happens to the legacy demos?

*Refuted:* The classification survives but the decision's central factual claim is false, and it
would misdirect the repair. Verified first: the three named demos are exactly as described
('modules-packaging-cli' runs LogisticRegression, cross_val_score and numpy under the title
'Practica scikit-learn' at…

**PU-10 · SELF_ANSWERED**

*Q.* In the Level-2 data core the practice never passes a one-line edit, and then the S17 You Do
requires a multi-step pandas function written from a stub. What is added between them?

*A.* A faded worked example immediately before the S17 You Do, plus the S15-S17 topic-evaluation
tasks carrying the 4-6 line pandas functions. The fade is explicit and three-staged across
S17-T1 and S17-T2: stage 1 shows the whole merge -> anti-join -> as-of sum -> leakage delta ->
reconciliation chain worked out; stage 2 leaves the last step blank; stage 3 leaves the last two
blank. The added blocks carry no subtopicId, which D6 makes explicit is how depth is added
without breaking the eight-to-eight theory/demo alignment, so nothing structural moves and no
existing exercise is displaced.

*Implementation:* src/lib/course/sections/s17-packaging.ts — add three supporting theory/I Do
blocks before the You Do, each with a worked example carrying one more… |
src/lib/course/sections/s15-stdlib-deep.ts, s16-wxpython-gui.ts, s17-packaging.ts — when the TEs
for these topics are authored under PU-7, their… | Declare environment for these snippets
honestly: if the pinned pandas is beyond Pyodide 0.26.2, mark local-python so the runner does
not claim an… | Re-run scripts/python_content_strict_output_audit.py so every added example's
declared output matches what .venv-content prints (D8).

**PU-12 · SELF_ANSWERED** · judge: amended

*Q.* From S32 onward, E2 exercises across sections are the same assess(record) decision
template. Does the practice have to exercise the section's own anchor tool?

*A.* Same rule and same ratchet. Derive the per-section anchor from identifiers already present
in that section's I Do demos rather than from a declared field that does not exist, or add the
field and name populating it for 52 sections as owed work. Replace the anonymous internal
reviewer with a named benchmark — Morris, Bransford & Franks 1977 on transfer-appropriate
processing and Schmidt & Bjork 1992 on variability of practice — and keep V3:87 as the contract
the benchmark is applied to.

*Implementation:* New tests/adversarial/test_practice_variety.py — ratchet: no single top-level
function signature may appear in more than N exercises course-wide, N… | Per-section rounds
(tools/fixer/run_round.sh SXX) rewrite the E2/E3 pairs so the exercise calls the section's
anchor tool; the assess/decide framing… | audit/fixer/writing_rules.md or the section AGENTS.md
— add the single checklist the synthesis asks for, so the template requirements live in one…

**PU-2 · SELF_ANSWERED** · judge: amended

*Q.* Exercises whose instruction, hints or starter comments contain the exact code the solution
adds. Is a 'dictated fix' a defect to remove, and how is it kept out once removed?

*A.* Same rule, scoped to E2 and E3 (and any future transfer rung), with E1 explicitly exempt as
the worked-example rung V3:87 defines. Lead the benchmark with Kornell, Hays & Bjork 2009 and
cite Prather et al. 2024 as convergent evidence about completion without struggle, not as a
direct test of instruction leakage. Say plainly that the ratchet helper pins an exact count, so
every content round that removes a leak lowers LEAK_OWED in the same commit.

*Implementation:* New tests/adversarial/test_practice_leaks.py with the ratchet helper copied
from tests/adversarial/test_forward_dependencies.py:69-95 (D10_OWED… | Leak rule, implementable
and narrow: for each exercise, delta = solution lines absent from the starter; offenders = any
backticked span in… | Content repair rides the normal per-section rounds
(tools/fixer/run_round.sh SXX --apply), codex authoring the replacement instruction and hints;…
| audit/fixer/decisions.md — record the rule as a standing decision so later rounds do not
reintroduce dictation.

**PU-3 · SELF_ANSWERED** · judge: amended

*Q.* The owner question left unanswered by research: should hints be staged, and should 'Ver
solución' require an attempt first?

*A.* Keep staged hints and the attempt gate, with three corrections. Cite Open edX
showanswer='attempted' and Khan Academy's hint cost as the prior art; cite Exercism #4172
honestly as a practitioner objection to gating, which is the trade-off the decision is accepting
rather than evidence for it. Name the third-hint shortfall as owed work and size it (~1,154
exercises) so it competes for budget alongside PU-13. State that the runner path creates a
retrieval event and the 'Ya lo intenté' path does not, and that the second exists to keep help
reachable, not to satisfy the Bjork rationale.

*Implementation:* src/components/course/SectionView.tsx:578-588 — render hints progressively:
keep a per-exercise revealed-hint index in state, show hint n+1 only… |
src/components/course/SectionView.tsx:612-626 — disable the 'Ver solución' button until
attempted[i] is true; add an 'Ya lo intenté' button that sets… | Persist attempted state per
exercise id in localStorage so a reload does not re-lock; in the dynamic edition also POST to
/api/exercise/attempt… | src/lib/types.ts:95 — correct the comment to V3's three hints and allow
hints.length===3.

**PU-4 · SELF_ANSWERED** · judge: amended

*Q.* An 'attempt' can only be required if the learner can attempt something on the page. The We
Do starter is a read-only CodeBlock and the card has no runner. Does the practice card get one?

*A.* Same decision, with the schema step made explicit: add `environment?: 'browser-pyodide' |
'local-python'` to WeDoStep and populate it on the ~83 starters that import third-party modules,
before the runner ships. Replace exact string equality with D8's tolerance shape (scrub numbers,
honour an ellipsis, treat a line that differs between runs as non-comparable), and do not render
a pass/fail verdict on an unmodified starter — show output only until the learner edits the
code.

*Implementation:* src/components/course/SectionView.tsx WeDoTab — replace the read-only
CodeBlock at :598-606 with CodePlayground seeded from step.starterCode.code,… |
src/components/course/CodePlayground.tsx — accept an onRun callback so the card can mark the
exercise attempted; keep the existing SRI-pinned loader… | Respect
step.environment/IDoStep.environment: when the snippet needs pinned pandas/sklearn beyond
Pyodide 0.26.2, render the editor with the run… | Keep the existing code-fidelity contract: the
starter text in the DOM must stay byte-identical to data-code-source
(scripts/code_rendering.spec.ts),…

**PU-7 · SELF_ANSWERED** · judge: amended

*Q.* RC-6 names an 'S02/S30 standard' for topic evaluations — a given signature, fixtures, tests
and a blank body — that exists in neither the schema nor the content. What is a topic-evaluation
task, concretely?

*A.* Same artefact shape and the same self-assessment disclaimer, with the gate expressed as a
ratchet on the shortfall (24 mounted tasks owed a starter and critical tests, decreasing) so it
can go green, and with a separate zero-tolerance assertion that any newly mounted TE task must
carry them. State explicitly that 'no TE feeds a credential' describes what badge_catalog.json
already requires, so the disclaimer is a truth-in-labelling fix and not a relaxation of V3:89.

*Implementation:* src/lib/types.ts:147-152 — extend TopicEvaluationTask with starter?:
CodeExample, fixtures?: string, criticalTests?: string[] (signature optional;… |
src/components/course/SectionView.tsx:773-800 — render the starter in the runner, list the
critical tests, and add a visible line stating the rubric… |
src/lib/course/sections/s01-setup.ts:2470, s02-basics.ts:2427, s30-security-infra.ts:2058 —
bring the 24 mounted tasks up to the new shape (S02's… | course-state/topic_evaluations/* —
leave in place as a checklist; add a README line recording that they are drafts, never mounted,
and why (one…

**PU-8 · SELF_ANSWERED**

*Q.* The gate that should report the 196 missing topic evaluations asserts a constant in
course_requirements.json rather than reading the course. Should the invariant be computed from
content?

*A.* Yes. Add a content-computed floor audit — at least 4 mounted topic evaluations per section,
at least 1 TE task per subtopic, at least 3 exercises per subtopic — read from COURSE_SECTIONS,
wired into npm run test:v3, and expressed as a ratchet with the shortfall recorded so it can
only go down. This is a tightening: nothing is relaxed and no existing assertion is removed.
Stated as undone: repointing scripts/v3_regression.spec.ts:59 so it stops asserting the JSON to
itself needs owner approval (scripts/*regression* is a protected path), so until then the
vacuous assertion stays and the new…

*Implementation:* New scripts/topic_evaluation_floor_audit.py — dump COURSE_SECTIONS (the tsx
dump path already used by scripts/export_interaction_catalog.mjs) and… | package.json — add
test:v3-te-floor and include it in the test:v3 chain (package.json is not a protected path). |
Record the baseline shortfall (196 TEs, 392 tasks) in the script as a ratchet constant, with the
same comment style as D10_OWED. | Named as reserved, not done here: adding a comment or a
content-computed assertion to scripts/v3_regression.spec.ts:59, and adding topic_evaluations…

*Judge's note on what the cluster missed:*

- badge_catalog.json's required_sections track the legacy slugs, so live credential claims name
the wrong sections — and PU-1 concluded the opposite ('badge_catalog.json is untouched').
applied_mlops_pipeline_delivery…
- The root cause of PU-5 and of the badge drift is one thing and nothing names it. Commit
a492d8ea renamed only S01-S13's ids ('give S01-S13 ids that describe what the sections teach');
S14-S52 still carry pre-V3 slugs…
- Nobody decided what happens to the five duplicate section files, and every ratchet in this
cluster is about to be pinned to a contaminated baseline. src/lib/course/sections/ holds 57
files for 52 sections: s07-pandas.ts…
- The third hint does not exist for 89% of exercises, and nobody prices it. V3:87 requires 'tres
pistas' per exercise. The tree has 2 hints for 1,109 exercises, 1 for 45, 3 for only 93, 4 for
1. PU-3 corrects the type…
- The deprecated scalar `hint` field is a leak vector the leak rule under-covers. WeDoStep
carries both `hint` ('Primary hint (always present for backward compatibility)', types.ts:94)
and `hints[]`, and…

## Level 3: data roles and modelling honesty

**L3D-1 · ALREADY_DECIDED** · judge: amended

*Q.* CP-N3-A (gate S30) makes "Sin separación train/dev/test" a P0 and a rubric line, but no
section before S50 uses the word `dev` as a data role, S30 teaches two roles plus `cross_split`,
and the criterion's package test is `assert True`. Do we teach a third role at S30, or rewrite
the criterion to S30's own contract?

*A.* Keep the criterion rewrite and the real test_6 as written (D11 authorises the rewrite and
mandates the record-and-re-raise the decision already includes). Split off the CP-FINAL half:
renaming train_dev_test_split touches a cross-subsystem capstone contract and a no-go gate, so
it is reserved, and its implementation list must name all four consumers. Extend the placeholder
fix to the whole CP-N3-A file (7 placeholders), and raise the 66-placeholder pattern as its own
finding rather than fixing one line of it.

*Implementation:*
/Users/pabloillescas/Documents/GitHub/pyarcana/scripts/enrich_capstone_packages.py:17 — in the
CP-N3-A SPEC, edit `problem`, `remediation`,… |
/Users/pabloillescas/Documents/GitHub/pyarcana/scripts/generate_capstone_validation.py:18 — same
string in the CP-N3-A tuple's criticalFailures list. |
/Users/pabloillescas/Documents/GitHub/pyarcana/src/lib/capstones/catalog.ts:86 — same string in
the `mk('CP-N3-A', ...)` criticalFailures array; this… | Regenerate, then verify the four
generated artifacts changed: /Users/pabloillescas/Documents/GitHub/pyarcana/course-
state/capstones/CP-N3-A/BRIEF.md…

**L3D-8 · ALREADY_DECIDED** · judge: amended

*Q.* S19-T4-B — a subtopic on colour, contrast, alt text and not overclaiming — carries a
paragraph that teaches leakage prevention, `fit_transform`, `Pipeline` and `X_train`, and tells
the learner 'como viste en S09'. S09 is 'Excepciones y logging' and teaches none of it. What is
the treatment?

*A.* Unchanged in substance — rewrite s19:361 in place, keep the describe-versus-decide rule,
cut fit_transform/Pipeline/X_train and 'como viste en S09', point forward to S32, and leave
s09-sklearn.ts untouched as INACTIVE_PRESERVED. One correction: s32-microservices.ts also
contains fit_transform (s32:82) and is active (index.ts:35), so the ratchet's baseline is two
matches in one active section (fit_transform and X_train at s19:361), and S32's occurrence is
the legitimate one the boundary is drawn around.

*Implementation:*
/Users/pabloillescas/Documents/GitHub/pyarcana/src/lib/course/sections/s19-databases-orm.ts:361
— rewrite the paragraph: keep the… | Same file, s19:362 — the retrospective paragraph repeats
the leakage framing ('La fuga de datos es el enemigo común de ambas'); trim it to match the… |
Do not touch
/Users/pabloillescas/Documents/GitHub/pyarcana/src/lib/course/sections/s09-sklearn.ts. It is
tracked but not imported by… | Out of scope but noted, not absorbed: s19:359-360 carry two
further bolt-on paragraphs — Codd and the 1970 relational paper, and the four SQL…

**L3D-2 · SELF_ANSWERED** · judge: amended

*Q.* S34-T4-A's I Do and the S34 You Do starter choose the decision threshold on the same scores
and labels they then report metrics on — in the section whose own T3-B theory forbids exactly
that for the calibrator. Where is the third data role taught, and how is the leak closed?

*A.* Keep the decision — the threshold is chosen on validation and test is read once, built at
S34-T4-A. Correct three things: (a) the validation fixture does not exist yet, so this decision
depends on L3D-4, not the reverse; (b) drop 'the out-of-fold scores S33's group CV already
produces' — S33 has three fold-level literals, not out-of-fold scores; (c) the same pass must
rename S34-T2-A's fold boxes, which today call the held-out half 'test'.

*Implementation:* /Users/pabloillescas/Documents/GitHub/pyarcana/src/lib/course/sections/s34-cv-
ai-integration.ts — insert a supporting theory block with no… | Same file, s34:345-368 — change
`choose_thr(scores, labels, ...)` call site to `choose_thr(val_scores, val_labels, c_fp=2,
c_fn=10, capacity=2)` over… | Same file, s34:2292-2296 and 2331-2387 — split `SCORES`/`LABELS`
into `VAL_SCORES`/`VAL_LABELS` and `TEST_SCORES`/`TEST_LABELS`; change… | Same file,
s34:2389-2408 — update `portfolioNote`, the rubric criterion at 'Correctitud técnica de
confusión, Brier y choose_thr por búsqueda', and…

**L3D-3 · SELF_ANSWERED**

*Q.* S34-T3-B teaches that the calibrator's coefficients are fitted only on the versioned
holdout and enforces `REJECT_IN_SAMPLE_CAL`, but `a=0.8, b=0.1` are handed to the learner as
literals with the comment `# a, b «ajustados»`. Should the calibrator actually be fitted?

*A.* Yes — fit `a` and `b` on `holdout_v1` in the S34-T3-B demo, with a five-line least-squares
on the holdout pairs, and report Brier on a set that is neither the base model's train nor the
holdout. Keep the affine map and keep the honest disclaimer that it is not Platt (s34:306
already distinguishes the affine line from the sigmoid correctly); the change is that the
coefficients stop being declared. The contract codes REJECT_IN_SAMPLE_CAL and REQUEST_CAL_SET
become demonstrable instead of asserted, because the section can now show the same code
producing different coefficients from the two sets.

*Implementation:* /Users/pabloillescas/Documents/GitHub/pyarcana/src/lib/course/sections/s34-cv-
ai-integration.ts:310-326 — replace the literal `a=0.8, b=0.1` in… | Same file, s34:306-308 —
update the prose so the worked numbers match what the fit produces, and keep the sentence that
names where the calibrator… | Same file, s34:313-315 — the docstring 'implementación
simplificada de Platt en holdout' contradicts the outcome at s34:44 which says it is not… | Re-
run `python3 scripts/python_content_strict_output_audit.py` and regenerate the declared
`output:` block from the actual run under .venv-content.

**L3D-4 · SELF_ANSWERED** · judge: amended

*Q.* S33, S34, S39, S47 and S50 hold aggregate fixtures — a mean of folds, a list of scores,
`log_run({"depth": 4}, 0.81, 0.805, 42, 0.01)`, a model card of hand-written numbers. Nothing
downstream can be computed from them. Do we build one per-case fixture family?

*A.* Build the per-case family, but state the real cost and fix the test. (a) Drop the promise
that today's printed numbers survive: 0.6/0.7/0.65 cannot be produced by S33's 4-row, 3-entity
fixture, so either the fixture grows roughly fifteenfold or those numbers change in at least
twelve places in S33 alone plus the prose and selfCheck text that quote them. (b) The
traceability test must require each number be computed from the fixture, not merely appear in a
declared output — s39:406/420 already prints a hardcoded 0.55 and 90. (c) This decision precedes
L3D-2, not follows it. (d) If the family…

*Implementation:* Create the fixture family as a named, versioned Python snippet reproduced in
each section (the course has no cross-section import mechanism for… |
/Users/pabloillescas/Documents/GitHub/pyarcana/src/lib/course/sections/s33-advanced-
models.ts:426-500 — replace the literal `scores = [0.6, 0.7,… |
/Users/pabloillescas/Documents/GitHub/pyarcana/src/lib/course/sections/s34-cv-ai-integration.ts
— the validation and test fixtures L3D-2 introduces… |
/Users/pabloillescas/Documents/GitHub/pyarcana/src/lib/course/sections/s39-integrator-
phase2.ts:2434-2445 — the model-card string's numbers…

**L3D-5 · SELF_ANSWERED** · judge: amended

*Q.* S39 treats drift as a boolean flag (`drift_high`) that arrives from nowhere, and writes a
model card whose numbers are hand-typed. Should drift be computed, and the card generated from
computed values?

*A.* Keep the PSI block and the generated model card. Correct the test claim — 0.55 and 90 are
already printed by a declared output at s39:420, so the test as specified does not fail on them,
and it must demand the value be computed from the fixture rather than appear in an output. Add
the gate this decision feeds: CP-N3-C's P0 'Fuga de datos' is graded by eight 'assert True'
placeholders, so rebuilding S39's teaching without touching CP-N3-C leaves the same green-check-
over-nothing one layer down.

*Implementation:*
/Users/pabloillescas/Documents/GitHub/pyarcana/src/lib/course/sections/s39-integrator-phase2.ts
— insert a supporting theory block with no… | Same file, s39:315-320 and s39:611-627 — change
the demos so `drift_high` is derived: `drift_high = psi >= 0.10`. Keep the `incident > drift >…
| Same file, s39:2434-2445 — build the model-card string from computed values: slice metrics
from the family, `thr` from the S34 selection (L3D-2),… | Same file, learningOutcomes — s39:32
'Monitorear drift, activar human_only, rollback...' currently uses `drift` without a gloss;
under D1 gloss it at…

**L3D-6 · SELF_ANSWERED** · judge: amended

*Q.* From S33 to S50 the course promotes a candidate over a baseline on two point estimates —
s47:131 promotes 0.82 over 0.78, and `comparable()` returns True on `run["score"] > baseline`
alone. Should the course require uncertainty before a promote decision?

*A.* Keep the requirement — no promote on two point estimates — and keep the S18 primer and the
comparable() tightening. Replace the expert claim: Reimers & Gurevych's remedy is score
distributions over repeated runs, not a resample of one run's test cases, and Berg-Kirkpatrick
et al. find the bootstrap less conservative (more type-I error) than approximate randomization.
So teach both variance sources, say which one the interval covers, and use S47's existing seed
in log_run for the repeated-run half. Make the new key fail closed rather than raising KeyError
on today's run dicts.

*Implementation:*
/Users/pabloillescas/Documents/GitHub/pyarcana/src/lib/course/sections/s47-opensource.ts:127-140
— add a supporting block with no `subtopicId` before… | Same file, s47:136-139 — extend
`comparable(run, baseline)` so the `versioned` conjunction also requires `run["diff_ci_low"] >
0`; keep every… | Same file, s47:131 — rewrite the `CASO-TAC-047-1B` worked example so the
0.82-vs-0.78 gap is reported with its interval, computed over the L3D-4… | Same file,
s47:1947,1965 — `log_run({"depth": 4}, 0.81, 0.805, 42, 0.01)` gains the interval alongside
`metric` and `rerun`, so the run log carries…

**L3D-7 · SELF_ANSWERED** · judge: amended

*Q.* S30 uses 'calibración' for tuning comparator weights and thresholds; S34 uses it four
sections later for turning a score into a probability. The learner meets the ML sense second,
already attached to the wrong referent. Which word gives way?

*A.* S30 still gives way, and the forward-naming sentence stays. But the scope is wrong: the
learner does not meet the ML sense second. Extend the pass to s11:2559 (a selfCheck option
reading 'La probabilidad calibrada de que la relación exista' — the S34 sense, 23 sections
early) and s24:362 ('el umbral de abstención está mal calibrado' — the S30 sense, six sections
early), and decide s15:532 and s25:44 explicitly. Fix the citation: the train-test-split entry
is terms.ts:801-807, not 785-789, and there is no glossary entry for calibración at all, so the
advice against splitting one is moot.

*Implementation:*
/Users/pabloillescas/Documents/GitHub/pyarcana/src/lib/course/sections/s30-security-infra.ts:305
— heading 'calibración, cola clerical y consistencia… | Same file, s30:308 — the paragraph that
defines '**Calibración**: ajusta pesos o umbrales con pares etiquetados sintéticos' →
'**Ajuste**: …', and… | Same file, s30:33 (learningOutcomes[6]) — '`train` reúne los pares para
calibrar pesos y umbrales' → '…para ajustar pesos y umbrales'. The rest of… | Same file,
s30:355-356 and s30:360 — figure caption 'Train calibra el motor', the alt text 'train calibra
pesos y umbrales', and the prose 'Antes de…

**L3D-9 · SELF_ANSWERED** · judge: amended

*Q.* The cluster's open research question, never answered: must the learner's first contact with
data roles show all three at once? And consequently, is CONCEPT_QUEUE #194 amended from two
roles to three, and where do #166 and #193 stand?

*A.* The spiral stands — two roles at S30, folds and valid at S33, selection on validation with
test read once at S34 — and #194 is applied with two roles, not amended to three. Three
corrections. (a) Citation: the Inria MOOC places train/test and cross-validation in Module 2,
hyperparameter tuning in Module 3 and nested cross-validation in Module 7, not 'tuning and
nested CV (module 3)'. (b) #166's remaining work is one gloss, not two: S33 outcome[7] already
reads 'group CV (validación cruzada por entidad, sin repartir una entidad entre train y valid)';
only S34 outcome[2]'s 'política CV-safe' is…

*Implementation:* Record the spiral as a standing decision in
/Users/pabloillescas/Documents/GitHub/pyarcana/audit/fixer/decisions.md — 'S30 two roles by
entity → S33… |
/Users/pabloillescas/Documents/GitHub/pyarcana/audit/fixer/CONCEPT_QUEUE.md:1640-1644 (#194) —
mark applied, not amended; the block exists at… | Same file, :1466-1470 (#166) — mark applied;
the supporting block exists at s33:426-468 with the `S33-group-folds` figure and computed folds.
Its two… | Same file, :1634-1638 (#193) — mark applied on the gloss, open on the verb; closes
when L3D-7 lands.

*Judge's note on what the cluster missed:*

- Systemic tautology: 66 'assert True # placeholder' tests across 11 capstone packages (CP-N3-C
8, CP-N4-B 7, CP-N4-A 7, CP-N3-A 7, CP-N3-B 6, CP-N2-C 6, CP-N2-A/B 5, CP-N1-A/B/C 5). L3D-1
rewrites one of them.…
- CP-N3-C's own P0 'Fuga de datos' (course-state/capstones/CP-N3-C/BRIEF.md:32, RUBRIC.json:29,
catalog.ts:94) is graded by the eight placeholder tests above. L3D-5 rebuilds the drift teaching
in S39, the section that…
- S33's You Do starter instructs the leak the cluster fixes at S34: s33:2515 'thr = 0.9 #
DEFECT: umbral demasiado alto — elígelo tú para este fixture', over the same y=[1,1,0,0] / x it
then scores for model_acc,…
- S34-T2-A names the fold's held-out box 'test', not 'valid': 'Piensa cada fold como dos cajas:
train y test', the template flag test_untouched=True, and learningOutcomes[2] 'política CV-safe
(test intacto)'. This…
- Calibración is used in five active sections before S30, including both senses the cluster is
trying to separate: s11:2559 offers 'La probabilidad calibrada de que la relación exista' as a
selfCheck option (the S34…

## Green gates over placeholder evidence

**GGL-01 · ALREADY_DECIDED** · judge: amended

*Q.* Must `course-state/capstone_ledger.json` state be computed from a recorded run of each
package, rather than hand-set by an "orchestrator" step that never ran the tests?

*A.* Unchanged in substance. Re-cite AGENTS.md 'Always' ("never invent missing values") as the
on-point ruling; state that the 11 traces were destroyed by commit 9a3febf5 rather than never
produced; and have scripts/capstone_execution_ledger.py pin the interpreter (3.12, matching CI)
and record it in every execution.json.

*Implementation:* Add `scripts/capstone_execution_ledger.py`: for each of the 13 directories
under `course-state/capstones/`, run `python3 demo.py` and `python3 -m… | Have the same script
derive `course-state/capstones/INDEX.json` and `course-state/capstone_ledger.json` from those
`execution.json` files. `state`… | Edit `scripts/course_complete_gate.py`: before the `good =
{"formally_passed", ...}` membership check at lines 22-24, require every capstone entry to… |
Add a `--check` staleness mode mirroring `tools/fixer/ledger.py --check`: fail when a package's
`executed_at` predates the newest git blob sha…

**GGL-04 · ALREADY_DECIDED** · judge: amended

*Q.* Should the 11 capstones whose named `tests` evidence is placeholders — and the 5
transversal checkpoints whose evidence points at those same packages — be reset out of
`formally_passed`, even though `course_complete` then reads false?

*A.* Same reset, corrected scope: `summary` becomes {formally_passed: 2, content_authored: 11}
and `checkpoints_passed: 1` (CF-5 only); CF-1, CF-2, CF-3 AND CF-4 lose `passed`. The test must
derive the checkpoint list from each checkpoint's own `evidence` string rather than hardcoding
three ids.

*Implementation:* Run `scripts/capstone_execution_ledger.py` (GGL-01) after GGL-02's marker
change; the 11 packages' test runs then fail and the derived state is… | `course-
state/capstone_ledger.json` `summary` becomes `{formally_passed: 2, content_authored: 11}` and
`checkpoints_passed` falls to whatever… | `course-state/course_complete_report.json` regenerates
with `capstones_formally_passed_13: false` and `course_complete: false`. | Register the gap in
`course-state/issue_registry.json` as an open P1 with the red-team slug `capstone-ledger-green-
on-placeholder-tests` (see…

**GGL-10 · OWNER_CALL** · judge: amended

*Q.* Once `course_complete` reads false, what should the repository claim about itself — and
should a product build ledger keep using award vocabulary (`formally_passed`) at all?

*A.* Still the owner's call, narrowed: (b) or (b)+(c), with (a) ruled out by AGENTS.md's
'Never'. Correct the Open Badges 3.0 quote to the spec's actual Evidence definition; restate
option (c) as touching only scripts/course_complete_gate.py and the ledger JSON; and correct
product claims by dated supersession rather than by editing Phase-0 captures in place.

*Reserved:* Product-voice claims in `industry_alignment/phase0_bootstrap_report.md`,
`industry_alignment/source_registry.json`, README.md and DEPLOY.md; Renaming ledger states and
the gate's output key…

**GGL-03 · RECOMMENDED_ASK_FIRST** · judge: amended

*Q.* Should the repository gate on tests whose body cannot fail, and if so with an absolute
threshold or a ratchet?

*A.* Same gate, three changes: classify RECOMMENDED_ASK_FIRST with 'editing AGENTS.md's Done-
means-these-pass block' as the ask-first item; make the threshold zero for any package whose
ledger state claims a terminal good state and a ratchet elsewhere; and extend the AST walk to
catch constant-comparison asserts and, critically, test_*.py files that yield zero collectible
tests.

**GGL-05 · RECOMMENDED_ASK_FIRST** · judge: amended

*Q.* Should CI run all 13 capstone test suites and the course-completion gate, rather than 2
suites and no completion gate at all?

*A.* Same wiring, with the matrix made additive to the three existing package-specific steps
(OTLP, integration-deep, contract+e2e) rather than replacing them; the red-pipeline trade-off
restated as a cluster-level sequencing question the owner decides before GGL-01 lands, not
before GGL-05; and the Fowler citation replaced with the article's actual section title and
sentence.

*Reserved:* Editing `.github/workflows/tests.yml` (protected path); If the owner prefers
untracking `course-state/course_complete_report.json` over the `--check` step, that is a tracked
deletion and needs a…

**GGL-08 · RECOMMENDED_ASK_FIRST** · judge: amended

*Q.* The eligibility suite calls itself the executable specification but tests a Python
reference implementation living in the same file, while the shipped TypeScript engine runs in no
CI job. Should the contract become shared fixtures that both implementations run?

*A.* Unchanged in substance. Re-describe step 1 as rewriting the suite body around a new
cases.json rather than extracting an existing fixture table; add dashboard_resources.spec.ts to
the orphaned-spec list; and name the trade-off that the parity test can turn main red on its
first run.

*Reserved:* Modifying `tests/adversarial/test_eligibility_engine.py` (protected path). Narrowing
its docstring changes what a test claims, so it goes to the owner even though the net effect is
a tightening —…

**GGL-09 · RECOMMENDED_ASK_FIRST** · judge: amended

*Q.* `test_credential_tamper_resistance.py` claims to prove that localStorage manipulation
cannot produce a verified credential and that forged credentials fail signature verification,
but only greps route files for substrings. What replaces it?

*A.* Keep both parts and add a third that is prior to them: convert the file to a
unittest.TestCase so it actually runs, and make the runner refuse a test_*.py that yields zero
collectible tests. Narrowing the docstring of a file that executes nowhere corrects a claim
without recovering a check.

*Reserved:* Modifying and renaming `tests/adversarial/test_credential_tamper_resistance.py` — a
protected path, and a rename is a tracked path change.; Changing what a test claims. The net
effect is a…

**GGL-02 · SELF_ANSWERED** · judge: amended

*Q.* What must change in the package generators before real capstone tests can be written —
given that one of them hardcodes `"tests_pass": true` and overwrites every `tests/test_demo.py`
with placeholders?

*A.* Keep the three changes, and add a fourth that does the work change (2) was claimed to do:
rewrite the 66 existing placeholder bodies in course-state/capstones/CP-*/tests/test_demo.py to
`raise NotImplementedError("PYARCANA_PLACEHOLDER: " + <criterion>)` as a direct edit. Widen
change (1) from test_demo.py to all 18 artifacts main() writes: refuse to overwrite any existing
file without an explicit per-package --force. Record commit 9a3febf5 as the realised precedent.

*Implementation:* `scripts/enrich_capstone_packages.py:146`: write `tests/test_demo.py` only
when the file does not exist, or when `--force <CP-ID>` names one package… |
`scripts/enrich_capstone_packages.py:161`: delete the `execution.json` write entirely.
`execution.json` is produced only by… | `scripts/enrich_capstone_packages.py:87-131`: change the
emitted placeholder body from `assert True # placeholder — replace with real check` to… |
`course-state/capstones/_generate_formal_packages.py` around line 1705: point the package
validator at the one agreed schema key and remove the…

**GGL-06 · SELF_ANSWERED** · judge: amended

*Q.* The completion gate's third input, `issue_registry.json`, holds 8 rows and reports no open
P0/P1 while the repository's own red-team file carries 47 distinct P0/P1 findings. How should
that check be made truthful?

*A.* Same fail-closed gate. Correct the count to 57 distinct slugs (and have the test parse
rather than hardcode any number). Replace hand-registration with a generator: a script that
parses audit/fixer/RED_TEAM_*.md into course-state/issue_registry.json, stamping `derived_from`
and the source blob sha, so the registry is derived like everything else this cluster is
repairing.

*Implementation:* `scripts/course_complete_gate.py`: read `issues.get("generated_at")` and
compare it against the newest git commit date among… | Register each distinct P0/P1 slug from
`audit/fixer/RED_TEAM_2026-09-18.md` in `course-state/issue_registry.json` with `status: open`,
deduplicating… | Print the registry's provenance (`generated_at` and the artifact it was derived
from) into `course-state/course_complete_report.json`, so a reader…

**GGL-07 · SELF_ANSWERED** · judge: amended

*Q.* `tools/fixer/ledger.py` — the tool CLAUDE.md holds up as the computed-not-hand-ticked
standard — ticks boxes green when its evidence file is missing. Should it fail closed?

*A.* Unchanged in substance. Correct 68 to 64 and the three line references (:52, :53, :77), and
state explicitly that load_required changes registry/prose/runtime from fail-closed-and-report
to refuse-to-run — a deliberate tightening, not a no-op.

*Implementation:* `tools/fixer/ledger.py:33-37`: add `load_required(path)` that prints `MISSING
EVIDENCE: <path>` and returns exit code 2; use it for… | Render `vocab`, `ids` and `runtime` as
`?` when their artifact is absent, and add a legend line so a reader can tell a missing artifact
from a clean… | Make `runtime` per-section by keying `python_runtime_audit_report.json` results
by section id, or rename the column header to state the course-wide… | Reconcile `concepts`:
either compute a proxy, or move the column into `audit/fixer/LEDGER_NOTES.md`, which the script
appends verbatim and therefore…

*Judge's note on what the cluster missed:*

- THE BIGGEST MISS: 17 of the 57 files in tests/adversarial/ define no unittest.TestCase and no
module-level test function, so `npm run test:adversarial:py` (`python3 -m unittest discover -s
tests/adversarial -p…
- The 11 execution traces were DESTROYED by a tracked commit, not merely never produced. `git
show 6290f0c0:course-state/capstones/CP-N1-B/execution.json` returns a real run record — status
pass, exit_code 0, full…
- scripts/enrich_capstone_packages.py:141-163 unconditionally rewrites EIGHTEEN artifacts per
package, not the two GGL-02 guards: BRIEF.md, RUBRIC.json, data/generate.py, tests/test_demo.py,
SECURITY.md, PRIVACY.md,…
- course-state/capstones/INDEX.json is a second unsourced claim the cluster only half-addresses.
It reads total 13 / passed 13 / failed 0, with `"execution_status": "pass", "exit_code": 0,
"formally_ready": true` for all…
- course-state/checkpoint.json is a fourth completion claim nobody derives or refuses on. Its
`resume_preconditions` list "course_complete true", "section_ledger 52 passed", "capstone_ledger
13 formally_passed", "zero…

## Course hours

**H-1 · ALREADY_DECIDED** · judge: amended

*Q.* Does the owner pick the advertised course length — 491 h (code), 1,040 h (V3/README), or a
re-estimate?

*A.* Unchanged on the merits: 1,040 stays labelled as V3's planning budget, the displayed figure
stays derived. Add to the implementation: extend --write to rewrite src/lib/course/index.ts
totalHours and the four phase hours: fields (index.ts:93-96) — a protected-path edit that
nothing in this cluster currently owns. Drop the separate hours_single_source_audit.py and fold
its README/PdfReport checks into H-8's hours_parity_audit.py, with README.md:8, s48:276/540,
s45:143 and s52:1935/1942 on the exemption list. Also state plainly what the cluster never says:
the claimed 491 is already 2% off its…

*Implementation:* Keep src/lib/course/index.ts:64 totalHours as the single derived authority,
written only by scripts/calibrate_section_duration.py --write (never… | README.md:8 keeps 1,040
h but relabels it as V3's planning budget for fully built sections, and prints the derived
figure next to it with a one-line… | No change to learning_roadmap_52_V3.md — it is a protected
path and it is already correct. | Add scripts/hours_single_source_audit.py: fail on any hour
literal (\d+\s*h|horas) outside src/lib/course/index.ts, the section estimatedHours fields…

**H-12 · OWNER_CALL**

*Q.* V3:777 promises that a pilot replaces the estimate with measured median, P25/P75, dropout
and time-per-asset. Should the platform measure time on task?

*A.* Genuinely the owner's. Research settles that an estimate should be validated against
measurement — ECTS, Carnegie-hour practice and Barre's estimator all say so — but it cannot
settle whether this course collects behavioural data from its learners. That is a product-scope,
privacy and values decision, and it is structurally awkward here: the GitHub Pages edition has
no server, so any measurement either stays in the browser or exists only for signed-in learners
on the Next.js edition, which means two different truths about the same course. Until it is
decided, V3:777's promise stays unkept and…

**H-11 · RECOMMENDED_ASK_FIRST** · judge: amended

*Q.* Should the course and section figures be published as bands rather than point estimates?

*A.* Split it. Settled and reserved: publishing the model's constants and its sensitivity table
so the assumptions are inspectable, which is what Barre's estimator actually models and what
S50-F02's 'evitar falsa precisión' actually asks for. Ask-first items unchanged
(src/lib/course/index.ts protected; CourseMeta/CourseSection shape change). NOT settled: whether
the landing page shows a band, a point estimate with a footnote, or a point estimate with the
constants a click away — that is presentation and product, it changes what the course
advertises, and it belongs with H-12. If a band does ship,…

*Reserved:* src/lib/course/index.ts — protected path; changing the CourseMeta data contract from
a point value to a band, which is beyond an ordinary content round; src/lib/types.ts —
CourseMeta / CourseSection…

**H-2 · RECOMMENDED_ASK_FIRST** · judge: amended

*Q.* The completion certificate prints a fixed '1040h'. Is changing it a credential-claim change
that must be asked first?

*A.* Same fix, asked rather than assumed. Replace PdfReport.tsx:618's '1040h' with hours
attributable to the learner's completed sections (or drop the stat), and do the same for the
'13' at :622-623. Ask-first item: AGENTS.md 'Changing what a credential claims' — the
certificate is a credential surface even though it is not badge_catalog.json. Ground it on H-1
and on V3:775/:777 (the number is false against totalHours: 491 whichever figure wins), not on
D11. Note for the owner while asking: the bigger integrity defect on the same component is
untouched by this cluster — the certificate is issued…

**H-3 · RECOMMENDED_ASK_FIRST** · judge: amended

*Q.* Does anything enforce that estimatedHours follows content, so that adding blocks changes
the number?

*A.* The equality assertion is right and should be built. Ask-first items: (a) tests/ —
protected path; rewriting a contract test's assertions is beyond a content round; (b) removal of
the assertLessEqual(h, 20) per-section ceiling. Keep the tightening honest by ADDING equality
rather than SUBTRACTING the bounds: assert each section's estimatedHours == round(computed) and
totalHours == the rounded total, and keep an absolute sanity bound (widened once, deliberately,
to cover S52 at ~89 h and the post-H-4 totals) so a constant edit in an unprotected script
cannot move the course silently. Also fix…

**H-10 · SELF_ANSWERED** · judge: amended

*Q.* Should a post-deploy gate assert the live hour figures match the deployed SHA, so the next
drift is caught rather than crawled?

*A.* Build it, without asking. Add to scripts/deployment_parity_audit.py — unprotected, already
SHA-aware, already mandated by AGENTS.md 'When shipping' — an assertion that the deployed course
page's total equals COURSE_META.totalHours and each section card equals that section's
estimatedHours, failing with the observed-versus-expected pair. Prove it non-tautological by
pointing it at the superseded 1040h/20h snapshot values and watching it fail. Only the CI wiring
remains reserved: RECOMMENDED_ASK_FIRST applies to .github/workflows/ alone if the owner wants
it to run automatically post-deploy,…

*Implementation:* scripts/static_public.spec.ts (PROTECTED) — add an assertion that the rendered
course total equals COURSE_META.totalHours and each section card… | .github/workflows/
(PROTECTED) — invoke it in the existing post-deploy job. | Fallback if the protected edits are
declined: scripts/live_hours_parity.mjs plus a package.json test:live-hours script, run manually
after deploy.…

**H-4 · SELF_ANSWERED** · judge: amended

*Q.* Why do 25 new blocks carry no hour cost — is the content too thin, or is the model
incomplete?

*A.* Unchanged: add MIN_PER_TE_TASK and an exam/remediation term to minutes(), plus the capstone
term from H-7. Correct the evidence: three sections (S01, S02, S30) carry four topic evaluations
with TWO authentic tasks each = 8 per section, 24 of V3's 416 exist, 49 sections have none. Rest
the pricing argument on ECTS ('preparation of projects, examinations' is inside workload), not
on the WFU estimator, which prices reading and writing and not assessment. Fix the
discrimination test: S30 computes 9.3 WITH four TEs, so a test comparing S01/S02 against S03/S04
must include S30 or it will pass for…

*Implementation:* scripts/calibrate_section_duration.py — extend measure() to count topic-
evaluation authentic tasks (id pattern S\d+-T\d+-TE-\d+ and authentic: true)… |
scripts/calibrate_section_duration.py — add MIN_PER_TE_TASK (start at 20 min: an authentic task
is unaided and has no seeded defect or hints, unlike… | scripts/calibrate_section_duration.py —
extend the tail sensitivity table to vary MIN_PER_TE_TASK as well as MIN_PER_EXERCISE, since it
becomes a… | Re-run --write and let H-3's equality test rewrite the section files and index.ts.

**H-5 · SELF_ANSWERED** · judge: amended

*Q.* Teaching prose is priced at 175 wpm citing Brysbaert. Is that the right rate, and what
should a new supporting block cost?

*A.* Set WPM_TEACHING = 130, citing the WFU understand/many-new cell and recording why
Brysbaert's 175 was the wrong cell (his meta-analysis excludes study-for-retrieval; his own
studying figures run 39–171 wpm). Remove the 'in a second language for some' justification from
the docstring. Fix the test so it can pass: either drop the D6-block floor to 8 min, or build
the fixture D6 actually describes — model, guided practice, INDEPENDENT practice and check —
which adds an exercise (11 min x 1.25) and lands at ~22.6 min, comfortably over a 15-min floor.
Drop the claim that a prose-only block 'is not…

*Implementation:* scripts/calibrate_section_duration.py:50 — set WPM_TEACHING = 130 and rewrite
the comment to name the Workload Estimator cell (understand x many new… |
scripts/calibrate_section_duration.py — the docstring's justification 'in a second language for
some' is removed: the course is written in Peruvian… | Document in the same docstring that a
prose-only supporting block is near-free by design, and that D6-shaped blocks earn hours through
their worked…

**H-6 · SELF_ANSWERED** · judge: amended

*Q.* S52 declares 29 h while its own capstone text plans 80 h. Which is right?

*A.* Unchanged: 80 h, derived from S52's own declared milestone budget rather than restated as a
constant, with CP-FINAL's budget shown as a line separate from S52's curricular hours per
V3:775's 960 + 80 split. Add the missing step: extend --write to rewrite index.ts totalHours and
the four phase hours: fields, or this decision ships a red suite. While rewriting s52:59's Ritmo
paragraph under H-8, note that it currently reads 'unas 29 horas' and gives 'seis u ocho para el
núcleo' — a split that will also be wrong at 89 h, so H-8's proportion rewrite has to be re-
derived for S52, not just stripped…

*Implementation:* scripts/calibrate_section_duration.py:63 — replace the MIN_CP_FINAL literal
with a value parsed from S52's declared milestone budget (the 'Hitos NN… | Re-run --write:
s52-career-strategy.ts:19 estimatedHours moves from 29 toward ~89; src/lib/course/index.ts phase
3 hours and :64 totalHours follow. | s52-career-strategy.ts:59 — rewrite the 'unas 29 horas'
Ritmo paragraph under H-8's rule (keep the split, drop the stale absolute). | Report CP-FINAL's
budget as a separate line from S52's curricular hours wherever the section card renders,
matching V3:775's own 960 + 80 split.

**H-7 · SELF_ANSWERED** · judge: amended

*Q.* The 12 level capstones carry no hour cost anywhere. Should they?

*A.* Add estimatedHours to CapstoneDescriptor — but the prerequisite is a content round, not a
catalog edit: each capstone's BRIEF.md must first DECLARE a milestone budget the way s52:1935
does, so the brief the learner reads owns the number and the catalog reads it. Until that round
runs, this decision cannot be implemented as written and should not be reported as ready. Change
the pricing shape from substitution to a net increment (capstone budget minus the skeleton You
Do work already priced across the level's thirteen sections) so the gate section's own You Do is
not deleted. CP-FINAL's value…

*Implementation:* src/lib/capstones/catalog.ts — add estimatedHours: number to
CapstoneDescriptor and populate all 13 entries from their… |
scripts/calibrate_section_duration.py — for a gate section (S04, S08, S13, S17, S21, S26, S30,
S34, S39, S43, S47, S51 per LEVELS.gates), substitute… | Re-run --write; H-3's equality test
rewrites the section files and index.ts.

**H-8 · SELF_ANSWERED**

*Q.* Fourteen sections restate their hour figure in learner prose. Should the number live there
at all?

*A.* No — the narrative split stays, the absolute total goes. Twelve sections state a total in a
'Ritmo' paragraph, and it has already gone stale in at least one file: s45-iac.ts:19 declares
estimatedHours: 9 while :50 says the ~20 h break down as ~6 h theory and demos, ~8 h weDo and ~6
h youDo, and :60 says 'Alrededor de veinte horas' — one file, two contracts, and the source of
S45-F02. Two sections make it worse by citing the calibration they contradict:
s32-microservices.ts:19 and s50-tech-leadership.ts:49 both say 'según la calibración actual'
next to a hard-coded figure. Every one of these…

*Implementation:* Add scripts/hours_parity_audit.py: extract every hour literal from each
section's learner-visible strings (tagline, theory paragraphs, intros,… | Rewrite the twelve
absolute totals as proportions, keeping the narrative split, in: s01-setup.ts:19 and :69,
s02-basics.ts:60,… | s03-decisions-rules.ts:61 needs no change — its Ritmo paragraph already
describes order and pacing without an absolute, and is the model for the… | Exempt CP-FINAL's
milestone budget (s52:1935, :1942) from the audit: it is the capstone's own declared contract
and the authority H-6 derives from,…

**H-9 · SELF_ANSWERED** · judge: amended

*Q.* The live site is reported showing 20h per section and 1040h while main says 9h and 491h.
Which is deployed?

*A.* Close S14-U01, S38-U02, S38-X09, S44-X-LIVE-HOURS, S47-F02, S48-F02, S49-F02 and S51-F02 as
NOT_REPRODUCIBLE_ON_LIVE, citing today's render. HOLD S52-F07 open and route its roadmap half to
H-1 — the live half is dead, the README/V3 half is not. Add S50-F02 and S52-F06 to the same
review: this render falsifies their live premises too, and S52-F06's source-internal 29-vs-80
half belongs to H-6. Keep S45-F02 open and routed to H-8. Record the render as landing-page-only
evidence; the per-section sweep is H-10's job.

*Implementation:* audit/consolidated/findings.csv and the matching
audit/consolidated/sections/*.md — set S14-U01, S38-U02, S38-X09, S44-X-LIVE-HOURS, S47-F02,… |
Leave S45-F02 open and route it to H-8; note explicitly in its row that the live check does not
clear it because the contradiction is source-internal. | audit/consolidated/registry.json —
mirror the status changes so the ledger recomputes from the artifact.

*Judge's note on what the cluster missed:*

- The pricing script cannot write index.ts, so four decisions rest on a step that does not
exist. H-1, H-3, H-6 and H-7 all say totalHours and the phase hours 'follow' from
`scripts/calibrate_section_duration.py --write`.…
- The You Do is mispriced by roughly 4x in the 39 sections none of these decisions touch.
MIN_PER_YOUDO = 65 min x 1.25 friction = 1.35 h, while the sections' own Ritmo paragraphs give
the block project about a third of…
- H-8 removes the only evidence that the You Do is mispriced, and its audit will not catch the
replacement. The Ritmo paragraphs are the sole place the course states how a section's hours
divide, and they are the artefact…
- No decision asks V3:777's own question: is the shortfall a model gap or a content gap? H-4
rules 'the model is incomplete' and closes the alternative in one sentence. Every section
computes 9-10 h against V3's stated…
- The two course editions can drift on hours and nothing checks it. H-9 and H-10 verify the
static GitHub Pages edition. PdfReport.tsx — H-2's subject, and the only surface in the repo
still printing 1040h in shipped code…

