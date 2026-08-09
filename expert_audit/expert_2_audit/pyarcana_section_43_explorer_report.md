# Explorer Report — PyArcana Section 43

## 1. Section Identification & Scope

**Assigned section:** Section 43 only  
**Published short title:** **Contenedores**  
**Source title:** **Contenedores y reproducibilidad operativa**  
**Level / phase / duration:** Master · Phase 3 · 20 estimated hours  
**Primary project gate:** **CP-N4-A — Governed Python Service Platform**  
**Roadmap prerequisite:** Section 42, *Schemas, seguridad y privacidad de servicios*  
**Roadmap successor:** Section 44, *CI/CD y seguridad de la cadena de suministro*  
**Canonical source inspected:** `src/lib/course/sections/s43-llmops.ts`  
**Exam-bank source inspected:** `prisma/seed.ts`, key `'llmops'`  
**Roadmap inspected:** `learning_roadmap_52_V3.md`

### Scope boundary

This audit analyzes only Section 43’s:

- live landing-page representation and route contract;
- title, promise, outcomes, theory, examples and notes;
- I Do demonstrations;
- all 24 We Do exercises, including starter code, solutions, hints, tests and feedback;
- You Do portfolio close;
- five-question public self-check;
- 24 server-side exam variants for the section;
- linked sources and relationship to Sections 42 and 44;
- Peruvian-Spanish redaction, terminology, accessibility and operational realism.

Sections 42, 44 and the early-course Section 1 were sampled only as **comparative anchors**, not audited independently.

### Evidence and method

The live landing page identifies Section 43 as “Contenedores” and promises a platform that runs with one command, includes tests/health, uses a non-root user, and documents configuration and recovery. The public site is a client-side hash application. The text-only live navigator exposed the landing page and Section 43’s card, but did not execute the `#llmops` hash route deeply enough to expose the five lesson tabs. The current repository source was therefore treated as the authoritative lesson payload; the repository itself states that the rendered browser workflow visits all five tabs and compares rendered content with canonical source.

The previous Explorer reports supplied by the user were used **only as structural references**. Their factual claims were not reused.

### External benchmark basis

The audit benchmarked Section 43 against:

- Docker’s official Dockerfile, build-cache, multi-stage, build-secret and Compose documentation;
- Kubernetes’ official liveness, readiness and startup-probe guidance;
- pip/PyPA official repeatable- and secure-install guidance;
- NIST SP 800-190 on application-container security;
- computing-education research on worked examples, self-explanation, fading and authentic software-engineering assessment.

---

## 2. Executive Summary of Quality

### Overall score: **5.7 / 10**

### Key verdict

**Section 43 is structurally complete, security-conscious and unusually explicit about fail-closed operational contracts, but it does not yet validly demonstrate mastery of containers at Master level.** It teaches many correct principles and requires a promising portfolio bundle, yet most instructional and assessed work can be completed by repairing Python booleans or searching strings without building an image, starting a Compose stack, observing a health transition, sending SIGTERM, inspecting a running UID, restoring data or scanning an actual artifact.

The decisive weakness is therefore not “missing content.” It is **construct underrepresentation**: the course claims to assess container operation, while a large share of the evidence measures Python predicate repair and textual token recognition.

### Scorecard

| Dimension | Score | Verdict |
|---|---:|---|
| Scope and roadmap alignment | 8.5/10 | Strong S42 → S43 → S44 progression and clear CP-N4-A role |
| Technical breadth | 8.0/10 | Covers images, runtime, Compose, migration, security and recovery |
| Technical precision | 5.4/10 | Several oversimplified or internally inconsistent contracts |
| I Do fidelity | 4.8/10 | Eight demos exist, but few model the authentic operational workflow |
| We Do fidelity | 5.2/10 | Complete and well-instrumented, but mechanically repetitive |
| You Do authenticity | 6.0/10 | Good artifact list, weak automatic linkage between evidence and artifacts |
| Cognitive load / disclosure | 5.0/10 | Dense jargon front-loading and eight large domains in 20 hours |
| Exercise alignment | 5.6/10 | Strong topic coverage, weak match to real Docker behavior |
| Exam validity | 3.5/10 | 24 variants exist, but answer-position and distractor patterns are gameable |
| Spanish redaction | 5.8/10 | Understandable, but excessive code-switching and awkward calques |
| Safety / security | 7.0/10 | Strong least-privilege intent; missing several practical hardening controls |
| Accessibility / self-guidance | 5.5/10 | Explicit outputs and hints, but environment/setup and troubleshooting gaps |

### Major strengths

1. The roadmap position is coherent: S42 hardens the service, S43 packages and operates it, and S44 secures the delivery pipeline.
2. Eight observable outcomes cover the intended topic map.
3. Synthetic fixtures avoid real secrets and personal data.
4. Every subtopic has I Do, E1, E2 and E3 materials.
5. Missing evidence is usually distinguished from an actual breach.
6. The portfolio brief asks for Dockerfile, Compose, health checks, migration/recovery and resource controls.
7. Official references are generally authoritative and relevant.
8. The section repeatedly reinforces non-root execution, secret separation, durable versus ephemeral state and rollback evidence.

### Major blockers

1. **No mandatory executed container workflow in the core instruction.**
2. **The portfolio gate can be satisfied by editing booleans rather than proving files and commands.**
3. **The “good” Compose specimen omits the health checks the prose and rubric require.**
4. **Dependency reproducibility is represented by arbitrary `sha256:` strings, not hash-checked installs.**
5. **The health model omits startup probes and oversimplifies liveness/readiness behavior.**
6. **The exercise progression repeats inverted predicates instead of fading toward real operational tasks.**
7. **All 24 server exam variants place the correct answer at index 1, and many distractors are implausible.**
8. **Resource ceilings are encoded as universal truths rather than workload-derived policy.**

---

## 3. Detailed Issue Registry

### Issue 1 — **Critical**
### Authentic container competency is replaced by stdlib simulation

**Location:** Section overview; all I Do demos; most E1/E2 exercises  
**Evidence:** The section says students first verify contracts with Python/stdlib “sin exigir un cluster,” and the I Do introduction says eight demos “calculan el contrato.” The Dockerfile-cache demo receives `["base", "deps", "app", ...]`; the runtime demo receives a base string, UID and MB value; the Compose demo receives sets of services and networks.

**Problem:** Simulation is useful for pre-training, but it becomes the dominant learning activity. Students are not required during I Do or E1/E2 to run:

- `docker build`;
- `docker image inspect`;
- `docker history`;
- `docker run --user`;
- `docker compose up --build --wait`;
- a readiness request before and after dependency failure;
- `docker stop` or a SIGTERM drill;
- a scanner or SBOM generator;
- backup/restore commands.

**Pedagogical impact:** The activities measure Boolean reasoning and schema checking more strongly than container operation. Learners may know what a safe outcome should look like while remaining unable to produce or diagnose that outcome in Docker.

**Construct-validity impact:** Critical. The roadmap declares `local con contenedores`; the section mostly uses `local-python`.

**Recommended correction:** Keep the stdlib models as pre-labs, then require an executed micro-lab for every T1–T4 pair.

---

### Issue 2 — **Critical**
### The You Do gate is self-attested and easily gameable

**Location:** `youDo.starterCode`  
**Evidence:** The starter defines four `evidence` booleans initialized to `False`; `readiness()` only checks whether they were changed to `True`. `ARTIFACTS` declares filenames, but the gate never opens, parses, hashes or executes them. `gate_case("normal")` returns `CONTINUE` unconditionally.

**Problem:** The learner can turn four booleans to `True` and receive `READY` without:

- confirming the files exist;
- parsing Dockerfile or Compose;
- verifying a non-root runtime;
- checking health;
- building twice;
- testing a breach;
- restoring durable state.

The comment warns not to do this, but comments are not evidence controls.

**Pedagogical impact:** The project teaches that compliance can be asserted rather than demonstrated—the opposite of the section’s own “no evidence, no promotion” principle.

**Assessment impact:** Critical. The most important assessment is not bound to its artifacts.

**Recommended correction:** Replace Boolean self-attestation with an artifact manifest and executable verifier that fails when files, commands, hashes or expected outputs are absent.

---

### Issue 3 — **High**
### Compose promise and Compose artifact contradict each other

**Location:** T3-A theory, I Do and E3  
**Evidence:** The prose requires “healthchecks por servicio” and a healthy stack. The `MINI_COMPOSE` and E3 “GOOD_COMPOSE” declare services, networks, `depends_on` and `DB_MAX_ATTEMPTS`, but contain no `healthcheck` blocks and no `condition: service_healthy`.

**Problem:** The “good” artifact can pass despite omitting a stated contract. Docker’s official guidance distinguishes “container started” from “service ready”; waiting for readiness requires a health check and a `service_healthy` dependency condition where appropriate.

**Pedagogical impact:** Learners may believe `depends_on` plus an environment variable demonstrates a healthy stack.

**Operational impact:** Startup races and false-green local environments remain untested.

**Recommended correction:** Provide real API, DB and cache health checks; use long-form `depends_on`; retain application retries because orchestration ordering does not replace runtime resilience.

---

### Issue 4 — **High**
### “Reproducible build” is represented by a fabricated logical digest

**Location:** T1-A theory/I Do and self-check  
**Evidence:** The lesson constructs `digest_a = f"deps:{lock_hash}"`, duplicates it as `digest_b`, and declares stability when the two strings are equal. The self-check accepts “same logical digest” as evidence.

**Problem:** This cannot detect:

- mutable base images;
- dependency-index changes;
- wheel differences by architecture;
- timestamps or nondeterministic build steps;
- build-context drift;
- environment-dependent compilation;
- source included before lock;
- differing image config or labels.

**Pedagogical impact:** It turns a difficult empirical property into a tautology.

**Technical impact:** Students may use the word “digest” without learning what image/config/layer digests represent.

**Recommended correction:** Compare actual image IDs/digests from two clean builds, state the limits of byte-for-byte reproducibility, and separately verify cache reuse with build logs.

---

### Issue 5 — **High**
### Base-image digest, dependency lock and package hashes are conflated

**Location:** T4-A theory and code; exam bank  
**Evidence:** A generic `lock_hash = "sha256:abc"` is treated as sufficient evidence. Dockerfiles use `requirements.txt` and `pip install -r requirements.txt` or `pip wheel -r requirements.txt`, but do not show pinned transitive dependencies with `--hash` entries or `--require-hashes`.

**Problem:** Three distinct controls are collapsed:

1. base-image digest pinning;
2. dependency version locking;
3. integrity verification of downloaded distributions.

PyPA’s official repeatable-install guidance distinguishes pinned versions from hash-checking mode.

**Pedagogical impact:** Students may falsely conclude that any string beginning with `sha256:` makes Python dependencies reproducible.

**Recommended correction:** Teach separate artifacts: base digest, fully pinned requirements/lock, and hash-checking invocation.

---

### Issue 6 — **High**
### We Do progression is repetitive rather than genuinely faded

**Location:** All 24 We Do exercises  
**Evidence:** Each subtopic repeats the same pattern:

- E1: repair an inverted Boolean on one valid record;
- E2: repair almost the same Boolean across valid/adverse/missing records;
- E3: search tokens in a synthetic text artifact.

**Problem:** E2 often duplicates E1’s central line with only a missing-field branch. The support is not meaningfully faded; it is copied into a table-driven wrapper. E3 changes representation, but often remains token recognition rather than operational transfer.

**Pedagogical impact:** Repetition strengthens a local test-taking pattern—“invert the defective predicate”—instead of flexible diagnostic expertise.

**Learning-science comparison:** Worked examples benefit learners when explanation and self-explanation support schema construction, and fading should gradually remove solution steps. Here, the surface template stays nearly identical.

**Recommended correction:** Use E1 as worked diagnosis, E2 as completion of a partially written operational test, and E3 as an executed failure/recovery scenario with fewer hints.

---

### Issue 7 — **High**
### I Do does not show an expert’s end-to-end operational reasoning

**Location:** `iDo.steps`  
**Evidence:** The I Do demos print small dictionaries and Booleans. They do not show a full trace such as “write Dockerfile → build → inspect → run → observe → break → diagnose → repair.”

**Problem:** A Master-level worked example should make expert decisions visible:

- why a layer invalidated;
- why an app is “running” but not “ready”;
- why UID and filesystem ownership disagree;
- why SIGTERM never reaches the Python process;
- why a secret remains in image history after deleting a file in a later layer;
- why a restore drill matters more than a backup file’s existence.

**Pedagogical impact:** Learners see verdict calculators, not expert troubleshooting.

**Recommended correction:** Add narrated command/output sequences with one intentional fault and a reasoning log.

---

### Issue 8 — **High**
### Probe semantics are incomplete and partly misleading

**Location:** T2-B theory, demo and exercises  
**Evidence:** The section discusses readiness and liveness, but not startup probes. `health_status(ready, live)` returns one HTTP status without modelling two endpoints. E3 searches a whole log for `db_ok=false`, `/readyz` and `status=200`, which can associate tokens from different lines.

**Problem:**

- startup behavior is omitted;
- readiness and liveness are collapsed into one function;
- liveness dependency checks are not cautioned against;
- timeouts, intervals, thresholds and start periods are absent;
- the string parser can create false associations across lines.

Kubernetes’ official guidance distinguishes three probe types and warns that incorrect liveness probes can cause cascading failures.

**Pedagogical impact:** Students learn labels, not lifecycle semantics.

**Recommended correction:** Model separate endpoints and state transitions; add startup probe or explain why Compose healthcheck is the local analogue; parse structured events, not global substrings.

---

### Issue 9 — **High**
### SIGTERM and draining are reduced to a static flag

**Location:** T2-B I Do and We Do  
**Evidence:** One demo declares shutdown graceful when `open_requests == 0` and `grace_seconds >= 20`. Another accepts a precomputed `sigterm_drains` Boolean.

**Problem:** A drain is a transition, not a starting condition. The learner does not see:

- PID 1 signal behavior;
- exec-form `CMD` versus shell wrapping;
- stopping admission of new work;
- waiting for current work;
- closing DB/cache clients;
- timeout and forced termination;
- exit codes;
- worker acknowledgement/requeue semantics.

**Pedagogical impact:** “Graceful shutdown” becomes a label rather than an observable sequence.

**Recommended correction:** Provide a tiny Python HTTP/worker process with a real signal handler and a scripted `docker stop` test.

---

### Issue 10 — **High**
### Container hardening stops short of a defensible runtime profile

**Location:** T1-B, T2-A, T4-B and portfolio requirements  
**Evidence:** The section emphasizes non-root, empty capabilities, no permanent root shell and runtime secrets. It does not require or demonstrate:

- `cap_drop: [ALL]`;
- `security_opt: ["no-new-privileges:true"]`;
- `read_only: true`;
- controlled `tmpfs`;
- `COPY --chown`;
- writable-directory planning;
- privileged-mode prohibition;
- host-network restrictions;
- Docker-socket prohibition in the main lesson;
- bind-mount review.

The exam bank mentions the Docker socket, but the teaching sequence does not operationalize the control.

**Pedagogical impact:** Learners may treat `USER 10001` as complete hardening.

**Recommended correction:** Add a minimal runtime-hardening profile and a test that proves the service still starts with a read-only root filesystem.

---

### Issue 11 — **High**
### Resource ceilings are cargo-culted as universal limits

**Location:** T4-B theory, demos and exercises  
**Evidence:** `0 < memory ≤ 512 MB` and `0 < CPU ≤ 1.0` are encoded repeatedly as the correct contract.

**Problem:** Positive limits are valuable, but the exact ceiling is workload- and SLO-dependent. A worker performing document processing may legitimately need more than 512 MB; a tiny API may need less. The section never derives limits from measurement.

**Pedagogical impact:** Students may copy arbitrary values and call the result governed.

**Recommended correction:** Use `requested_limit > 0` plus a documented measured baseline, headroom policy and OOM/load-test evidence. Keep 512 MB / 1 CPU only as the synthetic case’s explicit budget.

---

### Issue 12 — **High**
### CVE gating is too binary and not connected to artifact identity

**Location:** T4-B  
**Evidence:** The gate is `critical == 0`; the prose briefly permits signed exceptions, but the code has no exception path, scanner identity, database timestamp, image digest or finding disposition.

**Problem:** A defensible vulnerability gate needs at least:

- scanner and version;
- vulnerability DB timestamp;
- scanned image digest;
- severity policy;
- fix availability;
- exception owner and expiry;
- false-positive disposition;
- retained report.

**Pedagogical impact:** Security scanning becomes a count rather than an auditable decision.

**Recommended correction:** Model a scan report bound to an image digest and an explicit, expiring exception process.

---

### Issue 13 — **High**
### Migration safety is incorrectly reduced to `migration == "expand"`

**Location:** T3-B theory, I Do, E1 and E2  
**Evidence:** The solution passes only when `migration == "expand"`. The prose names expand/contract, but the tests never represent a safe later contract step after old code is gone.

**Problem:** Expand/contract is a sequence. A contract migration can be safe after compatibility conditions are satisfied. Conversely, an expand migration can still fail operationally.

**Pedagogical impact:** Learners memorize “expand good, contract bad” rather than release sequencing.

**Recommended correction:** Represent phases, deployed app versions, compatibility window, backup/restore evidence and forward/rollback decision.

---

### Issue 14 — **Medium-High**
### Secret detection is superficial and environment-variable guidance is ambiguous

**Location:** T2-A code and prose  
**Evidence:** The detector only searches for uppercase `SECRET=` or `PASSWORD=`. The prose allows runtime injection through an orchestrator environment, while official Docker guidance warns that build args and environment variables are inappropriate for build secrets because they persist in images.

**Problem:** The check misses tokens, lowercase names, private keys, URLs with credentials and secrets copied as files. It also does not distinguish build-time secrets from runtime configuration.

**Pedagogical impact:** Students may mistake a two-token regex for secret assurance.

**Recommended correction:** Teach build-secret mounts, Compose secrets/runtime mounts, image-history inspection and repository secret scanning as separate controls.

---

### Issue 15 — **Medium**
### Cache instruction is directionally right but operationally incomplete

**Location:** T1-A  
**Strength:** Stable dependencies before frequently changing source is good guidance.

**Missing elements:**

- `.dockerignore`;
- BuildKit cache mounts;
- cache invalidation from metadata and instruction text;
- base-image pull/freshness;
- package-manager cache behavior;
- multi-platform cache differences;
- clean-build comparison.

**Pedagogical impact:** Learners may equate one `COPY` ordering rule with full cache literacy.

**Recommended correction:** Add a before/after build log and a `.dockerignore` exercise.

---

### Issue 16 — **Medium**
### UID ≥1000 is treated as a universal law

**Location:** outcomes and T1-B  
**Evidence:** The contract repeatedly requires UID ≥1000.

**Problem:** A non-zero unprivileged UID is the security property. UID ≥1000 is a reasonable course convention, but it is not universally required across distroless images, platform policies or predefined service users. More importantly, the section does not test ownership of copied files or writable paths.

**Pedagogical impact:** Students may pass the numeric test while the application fails at runtime—or reject a valid secure image for the wrong reason.

**Recommended correction:** Label UID ≥1000 as the synthetic platform policy and add ownership/writability checks.

---

### Issue 17 — **High**
### All 24 server-exam variants place the correct answer at index 1

**Location:** `prisma/seed.ts`, Section 43 key `'llmops'`  
**Evidence:** The eight concepts each have three variants, and every visible item uses `correctIndex: 1`.

**Problem:** A learner can answer “the second option” across the entire Section 43 bank. This conflicts with the repository’s stated answer-position variation and undermines three-attempt integrity.

**Assessment impact:** High. The item bank can report mastery without content knowledge.

**Recommended correction:** Deliberately rotate answer positions within every A/B/C family and add a static per-section entropy gate.

---

### Issue 18 — **High**
### Exam distractors are frequently implausible, humorous or unrelated

**Location:** Section 43 exam bank  
**Examples:** “Root obligatorio,” “GPU free,” “salarios,” “el color del logo,” “F1 de ER,” and similar choices.

**Problem:** Many items test whether the learner can identify the only professionally worded option, not whether they can discriminate between plausible container decisions.

**Pedagogical impact:** Recognition is inflated; misconceptions are not diagnosed.

**Recommended correction:** Replace distractors with realistic near-misses, such as mutable tags, startup-only checks, orchestrator retries without app retries, UID without file ownership, or pinned versions without hashes.

---

### Issue 19 — **High**
### Public self-check under-samples the section’s outcomes

**Location:** `selfCheck.questions`  
**Evidence:** Five questions cover cache, fail-closed response, the overall gate, secrets and copy order. Eight learning outcomes include Compose, migrations, multi-stage, scanning, limits and debugging.

**Problem:** Several outcomes receive no direct retrieval-practice item.

**Pedagogical impact:** Learners can pass the visible quiz with major gaps.

**Recommended correction:** Use at least one question per subtopic or a rotating eight-item self-check.

---

### Issue 20 — **Medium-High**
### The lesson front-loads too much jargon without a dictionary

**Location:** first theory block  
**Evidence:** The first paragraph introduces layer cache, non-root, secret injection, health/readiness, Compose, multi-stage, resource limits and SBOM/scan in one dense map.

**Comparison:** Sections 42 and 44 start with an explicit “Diccionario de la sección”; Section 1 defines day-one terms before using them deeply. Section 43 does not.

**Pedagogical impact:** High extraneous load even for experienced Python learners who are new to operations.

**Recommended correction:** Add a short glossary and split the map into “build,” “runtime,” “multi-service” and “promotion evidence.”

---

### Issue 21 — **Medium**
### Peruvian-Spanish redaction relies excessively on English calques

**Recurring terms:** `layers`, `cache`, `lock`, `source`, `runtime`, `health`, `readiness`, `liveness`, `shutdown`, `grace period`, `breach`, `toolchain`, `scan`, `debugging`, `deploy`, `recovery`, `volumes durable`.

**Problem:** Some English terms are standard in industry, but the section rarely defines them once and then uses a stable bilingual form.

**Examples of awkward phrasing:**

- “un kill abrupto”;
- “lock hasheado”;
- “volumes durable vs efímero”;
- “reintentar conexión”;
- “debug shell”;
- “CVE críticos” instead of “vulnerabilidades críticas” when discussing counts.

**Pedagogical impact:** Language itself becomes an unnecessary barrier and creates inconsistent es-PE style.

**Recommended correction:** Define the standard English term once, use clear Spanish thereafter, and retain code identifiers in English.

---

### Issue 22 — **Medium**
### Historical LLMOps identifiers leak into source and public routing

**Location:** filename, section ID and exam-bank key  
**Exact text:**

- `src/lib/course/sections/s43-llmops.ts`;
- `id: "llmops"`;
- `'llmops': [` in the question bank;
- live hash route implied as `#llmops`.

**Problem:** Section 43 is now about containers, not LLMOps. The mismatch can confuse maintainers, analytics, links, agents and future migrations.

**Meta-leak classification:** Source-level taxonomy leak; usually not visible in body copy, but visible in shareable URLs and developer surfaces.

**Recommended correction:** Migrate to `containers` with a backward-compatible hash alias.

---

### Issue 23 — **Medium**
### `[FINAL]` is an authoring-state marker in learner-facing copy

**Location:** You Do title  
**Exact text:** `[FINAL] Contenedores y reproducibilidad operativa · CP-N4-A (cierre)`

**Problem:** `[FINAL]` reads like internal workflow metadata rather than instructional language.

**Pedagogical impact:** Low but avoidable credibility loss.

**Recommended correction:** Replace with “Proyecto de cierre” or “Entrega final de la sección.”

---

### Issue 24 — **Medium**
### The 20-hour estimate lacks an explicit core/extension path

**Location:** section metadata and content volume  
**Problem:** The section asks one learner to understand and evidence Dockerfile caching, image hardening, secret handling, volumes, networking, probes, signals, Compose, retries, migrations, restore, locks, multi-stage builds, vulnerability scanning, resource limits and debugging.

**Comparison:** Section 1 offers a core-hours path and extension hours. Section 43 gives one 20-hour estimate without distinguishing conceptual labs from full local execution.

**Pedagogical impact:** Self-paced learners cannot plan a viable route and may skip the only authentic work.

**Recommended correction:** Publish a core path and an advanced hardening path.

---

### Issue 25 — **Medium**
### Environment prerequisites and troubleshooting are under-specified

**Location:** roadmap versus section body  
**Evidence:** The roadmap says “local con contenedores,” but the lesson does not provide a concrete preflight for Docker Engine/Desktop, Compose v2, architecture, ports, disk, Windows/WSL/macOS/Linux differences or fallback.

**Pedagogical impact:** Failures caused by environment setup are easily misdiagnosed as conceptual failures.

**Recommended correction:** Add `docker version`, `docker compose version`, a hello-world smoke test, expected failure modes and a no-Docker conceptual fallback clearly marked as non-mastery practice.

---

### Issue 26 — **Medium**
### Text-token auditors can pass malformed or semantically wrong artifacts

**Location:** E3 solutions  
**Examples:**

- Compose checks `f"{name}:" in text`;
- Dockerfile checks `find("COPY requirements")`;
- secret checks search two substrings;
- health-log checks scan global text;
- runtime compiler checks look for `gcc` or `g++`.

**Problem:** These checks are brittle and can be fooled by comments, unrelated strings, duplicated keys, invalid YAML or misleading text.

**Pedagogical impact:** Learners are rewarded for string shape rather than artifact semantics.

**Recommended correction:** Parse YAML with a controlled parser in local mode, use Docker’s own config/build inspection where possible, and reserve token scanning as an introductory anti-pattern detector.

---

### Issue 27 — **Medium**
### The rubric includes outcomes not adequately taught or evidenced

**Location:** You Do rubric  
**Evidence:** The rubric assigns 15% to “Operación: SLO, observabilidad y rollback” and 15% to “Reproducibilidad, lineage y evidencia.”

**Problem:** SLO design, observability instrumentation and lineage are not developed as explicit Section 43 subtopics. The learner is evaluated on concepts mostly taught elsewhere or only mentioned.

**Pedagogical impact:** Hidden curriculum and unfair scoring.

**Recommended correction:** Either teach and practice these constructs explicitly or narrow the rubric to evidence actually taught in S43.

---

### Issue 28 — **Low-Medium**
### Resource list is authoritative but not sequenced into the learning path

**Location:** `resources.docs/courses`  
**Strength:** Docker, OCI, OWASP, NIST, Python signals and Kubernetes probes are appropriate sources.

**Problem:** The learner receives a long list at the end without “read before T1/T2/T3/T4,” required excerpts, or questions that require using the documentation.

**Pedagogical impact:** Sources become decorative rather than epistemic tools.

**Recommended correction:** Attach one primary source and one retrieval question to each subtopic.

---

## 4. Meta-Leak Report

### A. Confirmed learner-facing meta-text

| Severity | Exact text | Location | Assessment |
|---|---|---|---|
| Low | `[FINAL]` | You Do title | Authoring-state marker; replace with learner-facing wording |
| Low-Medium | Repeated machine labels such as `REORDER_DOCKERFILE`, `DRAIN_AND_ISOLATE`, `QUARANTINE_IMAGE` | Theory, exercises and feedback | Not a secret developer note, but overexposed internal workflow vocabulary increases noise |
| Low | “breach” used untranslated throughout | Prose and exercise feedback | Operational term, but inconsistent with otherwise Spanish narration |

### B. Confirmed source-level taxonomy leakage

| Severity | Exact text | Location | Assessment |
|---|---|---|---|
| Medium | `s43-llmops.ts` | Source filename | Historical topic remains in file taxonomy |
| Medium | `id: "llmops"` | Section object | Produces a misleading public hash/analytics key |
| Medium | `'llmops': [` | Exam bank | Dynamic assessment key no longer names the taught domain |
| Low | `// === Section 43: ... (llmops) ===` | Exam-bank source comment | Explicit historical mismatch in authoring surface |

### C. Intentionally pedagogical text, not a leak

The `# DEFECT:` and `# TAREA:` comments in starter code are intentional exercise scaffolds. They should not be removed merely because they sound editorial. Their problem is repetition and over-signalling, not leakage.

### D. AI/developer notes

No direct AI-to-developer prompt, TODO, “moved from section X,” hidden chain-of-thought, generation instruction or unresolved author note was found in the learner-facing lesson body.

---

## 5. Pedagogical & Redaction Deep Dive

### 5.1 Graph-engineering view

#### Principal concept nodes

- **T1-A:** Dockerfile layers and cache
- **T1-B:** base image, non-root identity and runtime size
- **T2-A:** configuration, secrets and state
- **T2-B:** networking, probes and signals
- **T3-A:** API/worker/DB/cache composition
- **T3-B:** migration and durable/ephemeral recovery
- **T4-A:** dependency locks and multi-stage images
- **T4-B:** vulnerability scan, resource limits and debugging

#### Intended dependency edges

`S42 secure service`
→ `T1 build image`
→ `T2 operate single service`
→ `T3 compose dependent services`
→ `T4 harden and verify`
→ `CP-N4-A`
→ `S44 CI/CD supply-chain gates`

This macro-graph is strong. The local edges are weaker:

- T1-A’s “logical digest” does not support T4-A’s claim of hash-verified reproducibility.
- T2-B’s health model does not support T3-A’s “healthy Compose stack” because the sample Compose lacks health checks.
- T3-B’s restore evidence is not executed by You Do’s verifier.
- T4-B’s scan does not bind a report to the image produced by T4-A.
- The You Do starter does not connect any artifact node to any evidence node.

The most important repair is therefore **edge integrity**, not adding more topics.

### 5.2 I Do audit

#### What works

- Eight demos match the eight subtopics.
- Inputs and outputs are short and readable.
- The demonstrations are executable in a browser/local Python environment.
- Each demo has a concise “why.”
- Security decisions are usually fail-closed.
- Synthetic data avoids external dependencies and privacy risk.

#### What fails

The landing page promises: “Te muestro paso a paso cómo se resuelve un problema real, explicando el porqué de cada línea.” Section 43’s demos usually do not model a real container problem. They model a record that already contains the answer.

A true worked example for T2-B would show:

1. a service starts;
2. `/healthz` passes;
3. `/readyz` fails while DB is unavailable;
4. Compose does not route/declare healthy;
5. DB becomes ready;
6. readiness turns 200;
7. a long request begins;
8. SIGTERM is sent;
9. new requests are rejected;
10. the current request finishes before the grace period;
11. exit code and logs are inspected.

That sequence externalizes expert thinking. `health_status(True, True)` does not.

### 5.3 We Do audit

#### Structural fidelity

The section satisfies the numeric contract: 24 exercises, three per subtopic, with starters, hints, solutions, tests and feedback. This is a substantial strength.

#### Gradual-release fidelity

The release is nominal rather than cognitive:

- E1 and E2 usually expose the same rule and same defect.
- Hints explicitly list every field needed.
- Exact status outputs tell the learner which branch must win.
- E3 often remains a three-case classifier with the same status vocabulary.
- The learner rarely chooses a tool, observes a runtime or interprets an unfamiliar failure.

A better fade would change what is withheld:

- **E1:** complete worked diagnosis with highlighted evidence.
- **E2:** partial command/test script; learner supplies checks and explains output.
- **E3:** new operational failure with no listed defect and a minimal runbook.

### 5.4 You Do audit

#### Strong requirements

The project brief is the best part of Section 43. It asks for:

- a pinned multi-stage Dockerfile;
- API/worker/DB/cache Compose;
- health checks and segmented networks;
- runtime secrets and persistent state;
- migration/runbook/recovery;
- CPU and memory limits;
- normal, breach and uncertain paths;
- commands, expected output, owner, rollback and residual risk.

This is authentic and portfolio-relevant.

#### Weak gate

The starter does not operationalize these requirements. It is a checklist represented as editable booleans. The portfolio therefore depends on learner honesty or a human reviewer, but the course markets self-guided, verifiable evidence.

#### Required redesign

The project should include an executable `verify_s43.py` or shell/Make target that:

- verifies artifact existence;
- runs `docker compose config`;
- builds the image;
- inspects user/config;
- starts the stack with wait/timeout;
- checks healthy services;
- breaks one dependency;
- checks readiness behavior;
- sends SIGTERM;
- runs a restore smoke test;
- verifies resource configuration;
- records image digest and scan report;
- emits a machine-readable evidence manifest.

### 5.5 Assessment audit

#### Public self-check

The five questions are clear and generally non-tricky. They reinforce safety and evidence. However, they under-sample the section and remain recognition-based.

#### Server exam bank

The bank meets the count contract—eight concepts, three variants each—but not the spirit of parallel authentic assessment:

- every answer is in position two;
- distractors are often obviously unserious;
- many questions are isolated definitions;
- none require interpreting a Dockerfile/Compose fragment of meaningful size;
- none ask the learner to order a response to an incident;
- none distinguish version pinning from hash verification;
- none test startup probe semantics;
- none test a safe contract phase of expand/contract.

The bank should contain plausible operational choices and vary position within every family.

### 5.6 Cognitive-load analysis

Section 43’s intrinsic load is legitimately high. The problem is added extraneous load:

- jargon introduced in one paragraph;
- mixed English/Spanish naming;
- many machine-status codes;
- eight outcomes and four large operational domains;
- no preflight environment map;
- no “core versus extension” pacing;
- similar exercises that require repeatedly decoding the same template.

Recommended sequence:

1. **Preflight and mental model:** image, container, registry, volume, network, Compose.
2. **Single process:** build, run, inspect, non-root, filesystem.
3. **Lifecycle:** config, secret, health, signal.
4. **Multi-service:** dependency readiness, app retries, state.
5. **Reproducibility/security:** pinned inputs, multi-stage, scan, budget.
6. **Integrated incident drill.**

### 5.7 Narrative and connective tissue

#### Strong transitions

The opening explains that S43 packages the hardened S42 service and that S44 will connect gates to CI/CD. Each T block usually references the preceding block.

#### Weak transitions

The prose often moves from a principle directly to a Boolean contract without showing the operational event that connects them. For example:

- “readiness 503 when DB is down” → Boolean `ready=False`;
- “restore drill” → Boolean `restored=True`;
- “scan clean” → integer `critical=0`.

The missing connective tissue is **evidence acquisition**: how did the system learn the Boolean?

### 5.8 Comparison with the best early section pattern

Section 1 and neighboring advanced sections use explicit dictionaries before deep terminology. Section 43 instead begins with a compressed map. The early pattern also distinguishes core pacing from extended work. Section 43 would benefit from copying those two structural features:

- define terms before combining them;
- publish a minimum viable route before the full capstone route.

Section 43 is stronger than early sections in security consciousness and artifact ambition, but weaker in novice-to-domain onboarding.

### 5.9 Comparison with external best-in-class materials

#### Docker official material

Best-in-class Docker teaching uses actual Dockerfiles and build output to show cache, pinning and multi-stage behavior. It distinguishes tags from digests and explains the trade-off between reproducibility and receiving security updates. Section 43 names these topics but does not demonstrate the trade-off or update workflow.

#### Docker Compose official material

Official Compose guidance demonstrates a real `healthcheck` and long-form `depends_on` with `condition: service_healthy`. Section 43 explains the limitation of `depends_on`, but its “good” file lacks the mechanism it describes.

#### Kubernetes probe guidance

Official guidance distinguishes startup, liveness and readiness and warns that bad liveness checks can cause cascading failure. Section 43 covers two terms and omits the caution and startup state.

#### PyPA/pip guidance

Official guidance distinguishes pinned versions from hash-checking mode. Section 43 uses a generic “lock hash” that does not demonstrate either a complete lock or hash-checked install.

#### NIST container security

NIST treats image, registry, orchestrator, runtime and host threats as a broader system. Section 43’s least-privilege direction is good, but the operational hardening profile and artifact-to-scan linkage need strengthening.

#### Computing-education research

Worked examples and self-explanation can reduce cognitive load, especially for novices. Fading should remove steps as expertise grows. Section 43 has abundant examples but limited explanation of expert evidence collection, and it repeats the same correction pattern rather than fading toward tool-mediated diagnosis.

#### Authentic software-engineering assessment

Authentic assessment should approximate workplace process and deliverables. The You Do requirements do this conceptually, but the starter’s Boolean self-attestation weakens authenticity.

### 5.10 Redaction guide

| Current form | Recommended first-use form |
|---|---|
| non-root | usuario sin privilegios (`non-root`) |
| layers | capas (`layers`) |
| cache | caché de compilación |
| lock | archivo de bloqueo (`lockfile`) |
| source | código fuente |
| runtime | imagen/entorno de ejecución (`runtime`) |
| health check | comprobación de salud (`health check`) |
| readiness | disponibilidad para recibir tráfico (`readiness`) |
| liveness | vitalidad del proceso (`liveness`) |
| startup probe | comprobación de arranque (`startup probe`) |
| shutdown | apagado/cierre controlado |
| grace period | periodo de gracia |
| breach | incumplimiento de seguridad |
| scan | análisis de vulnerabilidades |
| debugging | depuración |
| deploy | despliegue |
| recovery | recuperación |
| durable volume | volumen persistente |
| ephemeral volume | volumen efímero |
| “un kill abrupto” | una terminación forzada |
| “lock hasheado” | lockfile con hashes verificados |
| “reintentar conexión” | reintentar la conexión |

---

## 6. Proposed GitHub-Style Diffs

> These patches are proposals only. They are deliberately scoped to Section 43 and its exam assets. They must not be applied blindly; line positions may move.

### Diff 1 — Rename the section taxonomy while preserving old links

```diff
diff --git a/src/lib/course/sections/s43-llmops.ts b/src/lib/course/sections/s43-containers.ts
similarity index 99%
rename from src/lib/course/sections/s43-llmops.ts
rename to src/lib/course/sections/s43-containers.ts
--- a/src/lib/course/sections/s43-llmops.ts
+++ b/src/lib/course/sections/s43-containers.ts
@@
 export const section43: CourseSection = {
-  id: "llmops",
+  id: "containers",
   index: 43,
```

```diff
diff --git a/src/app/page.tsx b/src/app/page.tsx
@@
-        const section = COURSE_SECTIONS.find((s) => s.id === hash)
+        const legacySectionAliases: Record<string, string> = {
+          llmops: "containers",
+        }
+        const resolvedHash = legacySectionAliases[hash] ?? hash
+        const section = COURSE_SECTIONS.find((s) => s.id === resolvedHash)
         if (section) {
-          setActiveSectionId(hash)
+          setActiveSectionId(section.id)
```

```diff
diff --git a/prisma/seed.ts b/prisma/seed.ts
@@
-  // === Section 43: Contenedores y reproducibilidad operativa (llmops) ===
-  'llmops': [
+  // === Section 43: Contenedores y reproducibilidad operativa ===
+  'containers': [
```

**Issues addressed:** 22, Meta-Leak B.

---

### Diff 2 — Replace the authoring marker and improve the tagline

```diff
@@
-  tagline: "Governed Python Service Platform: un comando, tests/health, non-root, config y recuperación documentadas",
+  tagline: "Plataforma gobernada de servicios Python: un comando, pruebas y salud verificables, usuario sin privilegios, configuración y recuperación documentadas",
@@
-    title: "[FINAL] Contenedores y reproducibilidad operativa · CP-N4-A (cierre)",
+    title: "Proyecto de cierre · Contenedores y reproducibilidad operativa · CP-N4-A",
```

**Issues addressed:** 21, 23.

---

### Diff 3 — Add a dictionary, prerequisites and pacing before the idea map

```diff
@@
       heading: "Ruta de S43: Contenedores y reproducibilidad operativa",
       paragraphs: [
-        "**Mapa de ideas (luego T1 las aterriza con un Dockerfile real).** **Layer cache:** ...",
+        "**Prerrequisitos de laboratorio.** Necesitas Docker Engine o Docker Desktop, Docker Compose v2 y al menos 4 GB libres. Verifica `docker version`, `docker compose version` y `docker run --rm hello-world`. Si no tienes Docker, puedes completar los modelos stdlib como preentrenamiento, pero el gate CP-N4-A queda `BLOCKED_ENVIRONMENT` hasta ejecutar los artefactos reales.",
+        "**Diccionario de la sección.** **Imagen:** plantilla inmutable por contenido. **Contenedor:** proceso aislado creado desde una imagen. **Capa (`layer`):** cambio de filesystem reutilizable por el build. **Caché de build:** reutilización de capas cuya entrada no cambió. **Readiness:** disponibilidad para recibir tráfico. **Liveness:** capacidad del proceso de seguir avanzando. **Startup:** finalización del arranque. **Volumen persistente:** estado que sobrevive al contenedor. **Lockfile:** resolución exacta de dependencias; no equivale al digest de la imagen base.",
+        "**Ritmo sugerido.** 8–10 h núcleo: build/run/inspect, usuario sin privilegios, config/secret, health y Compose. 6–8 h ampliación: migración/restore, multi-stage y límites. 4–6 h cierre: scan, incidente y evidencia CP-N4-A.",
+        "**Mapa de ideas.** **Caché de capas:** dependencias antes del código fuente. **Usuario sin privilegios:** UID de aplicación y permisos de archivos. **Secretos:** inyección en ejecución, nunca en capas. **Salud:** startup/readiness/liveness con semántica distinta. **Compose:** API/worker/DB/cache con redes, health y reintentos. **Multi-stage:** toolchain fuera de la imagen final. **Recursos:** límites derivados de medición. **Scan:** reporte vinculado al digest antes de promover.",
```

**Issues addressed:** 20, 21, 24, 25.

---

### Diff 4 — Turn T1-A into an executed cache experiment

```diff
@@
-        "Contrato de cache. Entrada: secuencia de layers ... digest lógico estable ...",
+        "Contrato de caché y build. Entrada: Dockerfile, `.dockerignore`, lockfile y dos cambios controlados. Salida: (a) un cambio solo de código reutiliza la capa de dependencias; (b) un cambio del lock invalida esa capa; (c) dos builds limpios registran el image ID y las limitaciones de reproducibilidad. El caché acelera, pero no prueba por sí solo que dos imágenes sean idénticas.",
@@
-      environment: "local-python",
+      environment: "local-container",
@@
-      code: {
-        language: "python",
-        title: "demo_dockerfile_layers_cache.py",
-        code: `def dockerfile_steps(...`
+      code: {
+        language: "bash",
+        title: "demo_t1a_cache.sh",
+        code: `set -euo pipefail
+docker build --progress=plain -t s43:cache-a .
+first_id="$(docker image inspect s43:cache-a --format '{{.Id}}')"
+printf '\n# cambio controlado\n' >> src/app.py
+docker build --progress=plain -t s43:cache-b . | tee build-second.log
+second_id="$(docker image inspect s43:cache-b --format '{{.Id}}')"
+grep -E 'CACHED|requirements|pip install' build-second.log
+printf 'first=%s\nsecond=%s\n' "$first_id" "$second_id"`,
```

**Issues addressed:** 1, 4, 7, 15.

---

### Diff 5 — Separate base digest, dependency lock and hash checking

```diff
@@
-RUN pip wheel --no-cache-dir -r requirements.txt -w /wheels
+RUN python -m pip wheel \
+    --require-hashes \
+    --only-binary=:all: \
+    --no-cache-dir \
+    -r requirements.lock \
+    -w /wheels
@@
-RUN pip install --no-cache-dir /wheels/*
+RUN python -m pip install \
+    --no-index \
+    --find-links=/wheels \
+    --no-deps \
+    -r requirements.lock
@@
-def multistage_plan(dockerfile: str, lock_hash: str) -> dict:
-    pinned = lock_hash.startswith("sha256:")
+def multistage_plan(
+    dockerfile: str,
+    base_has_digest: bool,
+    requirements_fully_pinned: bool,
+    hashes_required: bool,
+) -> dict:
@@
-    ok = pinned and has_builder ...
+    ok = (
+        base_has_digest
+        and requirements_fully_pinned
+        and hashes_required
+        and has_builder
+        and has_runtime
+        and has_copy
+        and not compiler_in_runtime
+    )
```

**Issues addressed:** 4, 5.

---

### Diff 6 — Provide a Compose specimen that actually implements health

```diff
@@
 GOOD_COMPOSE = """
 services:
   api:
+    build: .
     networks: [front, back]
-    depends_on: [db, cache]
+    depends_on:
+      db:
+        condition: service_healthy
+      cache:
+        condition: service_healthy
     environment:
       DB_MAX_ATTEMPTS: "5"
+    healthcheck:
+      test: ["CMD", "python", "-m", "app.healthcheck"]
+      interval: 5s
+      timeout: 2s
+      retries: 5
+      start_period: 10s
   worker:
     networks: [back]
   db:
     networks: [back]
+    healthcheck:
+      test: ["CMD-SHELL", "pg_isready -U $${POSTGRES_USER}"]
+      interval: 5s
+      timeout: 3s
+      retries: 10
   cache:
     networks: [back]
+    healthcheck:
+      test: ["CMD", "redis-cli", "ping"]
+      interval: 5s
+      timeout: 2s
+      retries: 10
 networks:
   front: {}
   back: {}
 """
```

```diff
@@
-    required_svcs = all(f"{name}:" in text for name in ("api", "worker", "db", "cache"))
-    nets = "front:" in text and "back:" in text
-    app_retries = "DB_MAX_ATTEMPTS" in text or "retries" in text.lower()
-    ok = required_svcs and nets and app_retries
+    config = yaml.safe_load(text)
+    services = config.get("services", {})
+    required_svcs = {"api", "worker", "db", "cache"} <= set(services)
+    nets = {"front", "back"} <= set(config.get("networks", {}))
+    health = all("healthcheck" in services[name] for name in ("api", "db", "cache"))
+    api_depends = services["api"].get("depends_on", {})
+    waits_for_db = api_depends.get("db", {}).get("condition") == "service_healthy"
+    app_retries = "DB_MAX_ATTEMPTS" in services["api"].get("environment", {})
+    ok = required_svcs and nets and health and waits_for_db and app_retries
```

**Issues addressed:** 3, 26.

---

### Diff 7 — Teach startup/readiness/liveness and a real signal transition

```diff
@@
-        "**Readiness** (`/readyz`) responde 200 solo si deps críticas ... **Liveness** (`/healthz`) detecta bloqueo ...",
+        "**Startup** confirma que la aplicación terminó de inicializarse; mientras falla, todavía no evaluamos liveness/readiness. **Readiness** (`/readyz`) responde 200 solo si el proceso puede recibir tráfico y sus dependencias estrictas están disponibles. **Liveness** (`/healthz`) comprueba que el proceso progresa; no debe fallar solo porque una dependencia externa esté temporalmente caída, pues un reinicio masivo puede agravar el incidente.",
@@
-def on_sigterm(open_requests: int, grace_seconds: int) -> dict:
-    drained = open_requests == 0 and grace_seconds >= 20
-    return {"graceful": drained, "grace_seconds": grace_seconds}
+def on_sigterm(state: dict, grace_seconds: int) -> dict:
+    state["accepting_new_work"] = False
+    completed = state["in_flight"] <= state["drain_capacity"]
+    return {
+        "accepting_new_work": state["accepting_new_work"],
+        "drained": completed,
+        "forced": not completed,
+        "grace_seconds": grace_seconds,
+    }
```

Add an executed lab:

```diff
+instruction: "Inicia una request de 8 s, ejecuta `docker stop --time 20 s43-api`, y conserva logs que demuestren: SIGTERM recibido, readiness desactivada, request en curso finalizada y salida 0 antes del límite."
```

**Issues addressed:** 8, 9.

---

### Diff 8 — Add a minimum hardening profile

```diff
@@
   api:
+    user: "10001:10001"
+    read_only: true
+    tmpfs:
+      - /tmp:size=64m,mode=1777
+    cap_drop:
+      - ALL
+    security_opt:
+      - no-new-privileges:true
@@
-    volumes:
-      - .:/app
+    # No Docker socket, no privileged mode, no bind mount del source en el perfil prod.
```

```diff
@@ Dockerfile
-COPY src/ ./src/
+COPY --chown=10001:10001 src/ ./src/
 USER 10001
```

Add checks:

```diff
+docker compose run --rm api id -u | grep -qx '10001'
+docker compose run --rm api sh -c 'test ! -w / && test -w /tmp'
+docker compose config | grep -q 'no-new-privileges:true'
```

**Issues addressed:** 10, 16.

---

### Diff 9 — Derive resource limits from measurements

```diff
@@
-def scan_gate(critical: int, mem_mb: int, cpu: float, debug_shell: bool, logs_redacted: bool) -> dict:
-    limits_ok = 0 < mem_mb <= 512 and 0 < cpu <= 1.0
+def scan_gate(
+    critical: int,
+    mem_limit_mb: int,
+    cpu_limit: float,
+    measured_peak_mb: int,
+    required_headroom: float,
+    debug_shell: bool,
+    logs_redacted: bool,
+) -> dict:
+    memory_ok = (
+        mem_limit_mb > 0
+        and measured_peak_mb > 0
+        and mem_limit_mb >= measured_peak_mb * required_headroom
+    )
+    cpu_ok = cpu_limit > 0
+    limits_ok = memory_ok and cpu_ok
```

```diff
@@
-        "En CASO-TRU-043 ... 512Mi/1 CPU ...",
+        "En el fixture CASO-TRU-043, el presupuesto de laboratorio es 512 MiB y 1 CPU. No es un valor universal: conserva medición de carga, pico observado y margen elegido."
```

**Issues addressed:** 11.

---

### Diff 10 — Bind scan evidence to an image and model exceptions

```diff
+from dataclasses import dataclass
+
+@dataclass(frozen=True)
+class ScanEvidence:
+    image_digest: str
+    scanner: str
+    scanner_version: str
+    database_updated_at: str
+    critical_fixable: int
+    exception_id: str | None
+    exception_expires_at: str | None
+
+def scan_decision(e: ScanEvidence, built_digest: str) -> str:
+    if e.image_digest != built_digest:
+        return "TRIAGE_SCAN_FINDING"
+    if e.critical_fixable == 0:
+        return "CONTINUE"
+    if e.exception_id and e.exception_expires_at:
+        return "CONTINUE_WITH_EXCEPTION"
+    return "QUARANTINE_IMAGE"
```

**Issues addressed:** 12.

---

### Diff 11 — Model expand/contract as a sequence

```diff
@@
-def migration_gate(migration: str, old_ok: bool, ephemeral_reset: bool, restored: bool) -> dict:
-    ok = migration == "expand" and old_ok and ephemeral_reset and restored
+def migration_gate(
+    phase: str,
+    old_code_deployed: bool,
+    old_code_compatible: bool,
+    new_code_compatible: bool,
+    restored: bool,
+) -> dict:
+    if not restored:
+        return {"ok": False, "action": "RUN_RESTORE_DRILL"}
+    if phase == "expand":
+        ok = old_code_compatible and new_code_compatible
+    elif phase == "contract":
+        ok = not old_code_deployed and new_code_compatible
+    else:
+        return {"ok": False, "action": "REVIEW_MIGRATION_PHASE"}
+    return {"ok": ok, "action": "CONTINUE" if ok else "ROLL_BACK_MIGRATION"}
```

**Issues addressed:** 13.

---

### Diff 12 — Replace weak secret substring checks with layered evidence

```diff
@@
-def inspect_image_layers(layers: list, durable: set, ephemeral: set) -> dict:
-    baked = any("SECRET=" in layer or "PASSWORD=" in layer for layer in layers)
+def inspect_secret_evidence(
+    history_text: str,
+    filesystem_findings: list[str],
+    repo_scan_findings: list[str],
+    runtime_secret_mounts: set[str],
+) -> dict:
+    suspicious_history = any(
+        token in history_text.lower()
+        for token in ("secret=", "password=", "token=", "private_key", "api_key")
+    )
+    baked = suspicious_history or bool(filesystem_findings)
+    repo_clean = not repo_scan_findings
+    runtime_only = bool(runtime_secret_mounts) and not baked and repo_clean
```

Add an official build-secret example:

```diff
+RUN --mount=type=secret,id=pypi_token \
+    PIP_INDEX_URL="$(cat /run/secrets/pypi_token)" \
+    python -m pip wheel --require-hashes -r requirements.lock -w /wheels
```

**Issues addressed:** 14.

---

### Diff 13 — Redesign E1/E2/E3 fading

```diff
@@ S43-T2-B-E1
-kind: "guided",
-instruction: "Reemplaza la expresión booleana defectuosa..."
+kind: "guided",
+instruction: "Lee el timeline de arranque y explica, paso a paso, qué endpoint debe responder 200/503 y por qué. Completa dos asserts faltantes."

@@ S43-T2-B-E2
-kind: "independent",
-instruction: "El starter contiene el mismo criterio invertido..."
+kind: "faded",
+instruction: "Completa un test de integración que inicia la app sin DB, confirma readiness 503, habilita DB y confirma readiness 200. Se entregan comandos, pero no los asserts ni el diagnóstico."

@@ S43-T2-B-E3
-kind: "transfer",
-instruction: "Audita un log sintético..."
+kind: "transfer",
+instruction: "Ejecuta el stack, inicia una request lenta, envía SIGTERM y entrega el log/exit code. No se indica cuál componente fallará; decide si corresponde CONTINUE, DRAIN_AND_ISOLATE o DIAGNOSE_HEALTH_SIGNAL."
```

Apply the same fade principle to all eight subtopics.

**Issues addressed:** 1, 6, 7.

---

### Diff 14 — Make the You Do gate verify artifacts

```diff
@@
-from pathlib import Path
+from pathlib import Path
+import hashlib
+import json
+import subprocess
@@
-evidence = {
-    "dockerfile_multi_stage_fijado": False,
-    ...
-}
+def run(*args: str) -> str:
+    return subprocess.run(
+        args,
+        check=True,
+        text=True,
+        capture_output=True,
+    ).stdout.strip()
+
+def sha256_file(path: Path) -> str:
+    return hashlib.sha256(path.read_bytes()).hexdigest()
+
+def collect_evidence() -> dict:
+    paths = {name: Path(value) for name, value in ARTIFACTS.items()}
+    missing_files = sorted(name for name, path in paths.items() if not path.is_file())
+    if missing_files:
+        return {"status": "BLOCKED", "missing_files": missing_files}
+
+    run("docker", "compose", "config", "--quiet")
+    run("docker", "compose", "build", "--pull")
+    run("docker", "compose", "up", "-d", "--wait", "--wait-timeout", "120")
+    uid = run("docker", "compose", "exec", "-T", "api", "id", "-u")
+    if uid == "0":
+        return {"status": "REBUILD_NONROOT", "uid": uid}
+
+    return {
+        "status": "READY",
+        "uid": uid,
+        "files": {name: sha256_file(path) for name, path in paths.items()},
+        "compose_ps": run("docker", "compose", "ps", "--format", "json"),
+    }
+
+evidence = collect_evidence()
+Path("evidence/s43-manifest.json").write_text(
+    json.dumps(evidence, indent=2, ensure_ascii=False),
+    encoding="utf-8",
+)
```

**Issues addressed:** 2, 25, 26.

---

### Diff 15 — Align the rubric with taught evidence

```diff
@@
-      { criterion: "Reproducibilidad, lineage y evidencia", weight: "15%" },
-      { criterion: "Operación: SLO, observabilidad y rollback", weight: "15%" },
+      { criterion: "Reproducibilidad: inputs fijados, build/inspect repetible y manifest", weight: "15%" },
+      { criterion: "Operación: health, SIGTERM, restore y rollback ensayados", weight: "15%" },
```

Alternatively, add explicit SLO/observability instruction and exercises before retaining the current rubric.

**Issues addressed:** 27.

---

### Diff 16 — Expand the visible self-check to eight outcomes

```diff
@@ selfCheck.questions
+      {
+        question: "¿Qué distingue una startup probe de readiness y liveness?",
+        options: [
+          "Solo se ejecuta al terminar el contenedor",
+          "Protege el periodo de inicialización antes de activar las otras comprobaciones",
+          "Mide el tamaño de la imagen",
+          "Reemplaza el manejo de SIGTERM",
+        ],
+        correctIndex: 1,
+        explanation: "Startup cubre inicialización; readiness controla tráfico y liveness decide reinicio ante incapacidad de progresar.",
+      },
+      {
+        question: "¿Qué evidencia falta si el Compose declara `depends_on` pero no `healthcheck`?",
+        options: [
+          "Ninguna: started equivale a ready",
+          "Una prueba de que la dependencia está saludable antes de tratarla como lista",
+          "Un segundo Dockerfile",
+          "Un UID menor que 1000",
+        ],
+        correctIndex: 1,
+        explanation: "Compose puede ordenar el arranque sin demostrar disponibilidad; healthcheck y retries cubren problemas distintos.",
+      },
+      {
+        question: "¿Por qué un requirements con versiones no equivale siempre a instalación hash-verificada?",
+        options: [
+          "Porque los hashes solo sirven para imágenes base",
+          "Porque pinning fija versiones y `--require-hashes` verifica los artefactos descargados",
+          "Porque pip nunca soporta hashes",
+          "Porque un lockfile elimina la necesidad de TLS",
+        ],
+        correctIndex: 1,
+        explanation: "Version pinning e integridad por hash son controles relacionados pero distintos.",
+      },
```

**Issues addressed:** 19.

---

### Diff 17 — Repair the Section 43 exam bank’s position and distractor quality

Representative family:

```diff
@@ concept: "dockerfile-layers-cache"
       options: [
-        "Invalidar cache en cada cambio de código de negocio",
-        "Reutilizar capas de deps cuando solo cambia el source",
-        "Imágenes siempre más grandes",
-        "Root obligatorio",
+        "Reutilizar la capa de dependencias cuando cambia solo el código fuente",
+        "Forzar una descarga de dependencias en cada build para asegurar frescura",
+        "Hacer que el digest final sea idéntico aunque cambie el código",
+        "Evitar la necesidad de un lockfile",
       ],
-      correctIndex: 1,
+      correctIndex: 0,
@@ second variant
       options: [
-        "Un pod de K8s",
-        "Una capa de imagen (con impacto en cache/tamaño)",
-        "Un secret de AWS",
-        "Un ADR",
+        "Un contenedor en ejecución listo para tráfico",
+        "Una entrada del historial/configuración que puede afectar las capas y la caché",
+        "Una comprobación automática de CVE",
+        "Una garantía de que el build es byte-a-byte reproducible",
       ],
       correctIndex: 1,
@@ third variant
       options: [
-        "Dejar índices viejos en capas separadas",
-        "Consistencia de índices y limpieza en la misma capa",
-        "Evitar non-root",
-        "Saltar healthchecks",
+        "Separar `apt-get update` para que siempre quede cacheado",
+        "Eliminar la necesidad de fijar versiones del sistema operativo",
+        "Mantener actualización, instalación y limpieza en una única instrucción coherente",
+        "Hacer innecesario `--no-install-recommends`",
       ],
-      correctIndex: 1,
+      correctIndex: 2,
```

Add a static gate:

```diff
diff --git a/scripts/exam_selfcheck_pedagogy_audit.py b/scripts/exam_selfcheck_pedagogy_audit.py
@@
+    by_section_positions: dict[str, list[int]] = {}
+    ...
+    for section, positions in by_section_positions.items():
+        counts = Counter(positions)
+        if len(counts) < 3 or max(counts.values()) / len(positions) > 0.5:
+            issues.append({
+                "severity": "P1",
+                "reason": "predictable_correct_position",
+                "section": section,
+                "distribution": dict(counts),
+            })
```

Repeat the distractor/position repair for all eight Section 43 families.

**Issues addressed:** 17, 18.

---

### Diff 18 — Sequence primary sources by subtopic

```diff
@@ resources.docs
       {
         label: "Docker best practices",
         ...
-        note: "Cache, non-root y tamaño",
+        note: "Obligatorio antes de T1-A/T1-B: cache, base, USER y actualización",
       },
@@
       {
         label: "Docker Compose Specification",
         ...
-        note: "Servicios, networks, health y volumes",
+        note: "Obligatorio antes de T2-B/T3-A: healthcheck, depends_on, networks y volumes",
       },
+      {
+        label: "pip secure and repeatable installs",
+        url: "https://pip.pypa.io/en/stable/topics/secure-installs/",
+        note: "Obligatorio antes de T4-A: pinning, hashes y `--require-hashes`",
+      },
```

Add one documentation-retrieval question per subtopic.

**Issues addressed:** 5, 28.

---

## 7. Recommended Priority Order for Fixing

### P0 — Before calling Section 43 Master-level or release-ready

1. **Bind You Do to real artifacts and executed commands** (Issue 2).
2. **Require authentic Docker execution in I Do/We Do** (Issues 1 and 7).
3. **Correct the Compose healthcheck contradiction** (Issue 3).
4. **Repair Section 43’s exam answer-position pattern and distractors** (Issues 17 and 18).
5. **Separate base digest, dependency lock and package hash verification** (Issues 4 and 5).

### P1 — Technical correctness and operational safety

6. Correct probe/startup/SIGTERM instruction (Issues 8 and 9).
7. Replace universal resource ceilings with measured policy (Issue 11).
8. Model scan evidence and exceptions against image digest (Issue 12).
9. Correct expand/contract sequencing (Issue 13).
10. Add minimum hardening controls and ownership tests (Issues 10 and 16).
11. Strengthen secret evidence (Issue 14).
12. Replace brittle token auditors with parsers/real commands (Issue 26).

### P2 — Pedagogical effectiveness

13. Redesign E1/E2/E3 fading (Issue 6).
14. Add dictionary, preflight and core/extension pacing (Issues 20, 24 and 25).
15. Expand self-check coverage (Issue 19).
16. Align rubric to taught constructs (Issue 27).
17. Sequence external sources into the lesson (Issue 28).

### P3 — Editorial and maintainability cleanup

18. Migrate the `llmops` identifiers with compatibility alias (Issue 22).
19. Remove `[FINAL]` and reduce workflow-code noise (Issue 23).
20. Normalize Peruvian-Spanish terminology and first-use definitions (Issue 21).

### Suggested acceptance gate after fixes

Section 43 should not be marked ready until a clean machine can run one command that:

1. builds the pinned multi-stage image;
2. starts API/worker/DB/cache;
3. waits for real health;
4. proves UID and hardening;
5. runs tests;
6. demonstrates readiness failure;
7. demonstrates SIGTERM drain;
8. restores durable state from a test backup;
9. records limits and a scan bound to the image digest;
10. emits a redacted manifest and exits non-zero on any critical failure.

---

## 8. Graph Memory Update Notes

### Section node

```yaml
section:
  id_current: llmops
  id_recommended: containers
  index: 43
  title: Contenedores y reproducibilidad operativa
  level: Master
  phase: 3
  prerequisite: S42
  successor: S44
  capstone_gate: CP-N4-A
  score: 5.7
  verdict: structurally_complete_but_operationally_under_verified
```

### Concept nodes

```yaml
concepts:
  - S43-T1-A: dockerfile_layers_cache
  - S43-T1-B: base_nonroot_size
  - S43-T2-A: config_secrets_volumes
  - S43-T2-B: networking_probes_signals
  - S43-T3-A: compose_api_worker_db_cache
  - S43-T3-B: migration_state_restore
  - S43-T4-A: locks_multistage
  - S43-T4-B: scan_resources_debug
```

### Broken or weak edges

```yaml
weak_edges:
  - logical_digest -> actual_reproducible_image
  - prose_healthchecks -> sample_compose
  - lock_hash_string -> hash_verified_python_install
  - sigterm_boolean -> graceful_drain_observation
  - backup_restored_boolean -> restore_drill
  - scan_count -> scanned_image_digest
  - artifact_paths -> evidence_manifest
  - 24_exam_variants -> robust_assessment
```

### Strong edges to preserve

```yaml
strong_edges:
  - S42_secure_service -> S43_containerized_platform
  - S43_containerized_platform -> S44_supply_chain_pipeline
  - synthetic_case -> privacy_safe_practice
  - missing_evidence -> explicit_uncertainty_route
  - nonroot_secret_separation_restore -> operational_governance
```

### Issue-memory entries

```yaml
issues:
  - id: S43-AUTH-001
    severity: critical
    summary: Most learning evidence is stdlib predicate simulation rather than executed container behavior.
  - id: S43-GATE-002
    severity: critical
    summary: You Do READY state is self-attested through editable booleans.
  - id: S43-COMPOSE-003
    severity: high
    summary: Good Compose artifacts omit required healthchecks.
  - id: S43-REPRO-004
    severity: high
    summary: Logical digest and generic lock_hash overclaim reproducibility.
  - id: S43-ASSESS-005
    severity: high
    summary: All 24 exam answers use correctIndex 1; distractors are often implausible.
  - id: S43-PROBE-006
    severity: high
    summary: Startup probe and realistic SIGTERM lifecycle are absent.
  - id: S43-POLICY-007
    severity: high
    summary: 512 MiB and 1 CPU are taught as universal instead of case budget.
  - id: S43-META-008
    severity: medium
    summary: Historical llmops taxonomy remains in file, ID, route and exam key.
```

### Research-memory notes

- Worked examples should show evidence acquisition and expert reasoning, not only final predicates.
- Fading must remove support across E1→E2→E3; duplicating the same inverted condition does not create meaningful transfer.
- Authentic container assessment requires executed build/run/inspect/fail/recover evidence.
- Version pinning, base digest pinning and package hash verification are distinct controls.
- Startup, readiness and liveness have different lifecycle meanings.
- A Compose service being started is not equivalent to being ready.
- Resource limits must be positive **and justified by measurement**, not copied as universal constants.
- Exam-position entropy and plausible distractors need per-section gates.

---

## Final Statement

**This is the complete Explorer report for Section 43. Ready for the Fixer prompt.**