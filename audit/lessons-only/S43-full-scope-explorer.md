# S43 Full-Scope Explorer Report — Contenedores y reproducibilidad operativa

## 1. Section Identification & Scope

**Section:** S43 — `Contenedores y reproducibilidad operativa`  
**Stable learner key:** `llmops` — legacy pre-V3 URL/progress key; **do not rename without migration**.  
**Canonical source:** `src/lib/course/sections/s43-llmops.ts`  
**Main commit reviewed:** `535bd4d7b603283af9a39a813a79f05afbc47b48`  
**Source blob:** `77ac056ea519b82bbba5307acd845f819be4b46b`  
**Authoritative roadmap:** `learning_roadmap_52_V3.md`  
**Capstone:** CP-N4-A — `Plataforma de Servicio Python Gobernada` / `Governed Python Service Platform`  
**Canonical gate:** S43.

### Scope audited

This execution audits **S43 only**. No fixes were applied to curriculum source or `main`.

Coverage:

- live public S43 card and crawl state;
- title, tagline and job relevance;
- 8/8 learning outcomes;
- 32/32 theory/reference paragraphs;
- 9/9 theory code/output blocks;
- 9/9 callouts;
- 3/3 figures;
- Theory playground;
- 8/8 I Do demonstrations;
- 24/24 We Do exercises including starter, solution, tests, hints, feedback and retrospectives;
- full You Do, requirements, starter, portfolio note, rubric and retrospective;
- 5/5 self-check questions;
- authenticated S43 question bank: 8 concepts × 3 variants = 24 questions;
- canonical and learner-facing CP-N4-A brief/rubric;
- 17/17 listed resources.

The public crawler exposes the S43 card but not a trustworthy hydrated current lesson body. The crawler is also stale enough to show S43 as 20 h while canonical main says 9 h, alongside an old course total. This remains **`UNRESOLVED_LIVE_SOURCE_DRIFT`**, not a confirmed current deployment defect. Body-level analysis is therefore grounded in canonical `main` source.

### Authoritative S43 contract

Roadmap V3 defines:

- **Prerequisite:** S42.
- **Environment:** local **with containers**.
- **T1:** Dockerfile/layers/cache; base/non-root/size.
- **T2:** config/secrets/volumes; networking/health/signals.
- **T3:** Compose API/worker/DB/cache; migrations/ephemeral data.
- **T4:** locks/multi-stage; scan/resource limits/debugging.
- **Gate:** the Governed Python Service Platform starts with one command, runs tests/health checks, uses non-root and documents configuration/recovery.

The canonical CP-N4-A rubric additionally requires:

1. valid request → 200;
2. rate limit exceeded → 429;
3. no auth → 401;
4. health endpoint → OK;
5. service is non-root;
6. logs redact tokens;
7. migrations are present.

Critical failures are root execution, missing health checks, embedded secrets and missing migrations.

---

## 2. Executive Summary of Quality

### Score: **1.0 / 10 — REPAIR_REQUIRED**

### Verdict

**S43 is not currently a valid closure of CP-N4-A.**

The central failure is not that the section lacks container vocabulary. In fact, several theory paragraphs are technically good. The failure is that the curriculum repeatedly replaces the operational properties it claims to teach with **proxies that merely say those properties are true**:

- `digest_stable=True` instead of two measured builds;
- `uid=10001` instead of runtime identity inspection;
- `runtime_secret=True` instead of a real runtime secret grant plus clean image/history;
- `sigterm_drains=True` instead of sending SIGTERM and observing drain;
- `healthy={api,worker,db,cache}` instead of Compose healthchecks;
- `backup_restored=True` instead of running a restore drill;
- `critical_cves=0` instead of a scanner report bound to the built image;
- four learner-controlled booleans instead of a CP-N4-A evidence manifest.

This would already be a major pedagogical defect in an ordinary lesson. It is a **release blocker** here because S43 is the actual gate section for CP-N4-A.

The audit records **44 material findings**:

| Severity | Count |
|---|---:|
| P0 | 5 |
| P1 | 30 |
| P2 | 9 |
| P3 | 0 |

The five P0s are:

1. **F02 — CP-N4-A closure omits canonical service tests.**
2. **F03 — visible S43 rubric contradicts canonical CP-N4-A rubric.**
3. **F04 — final READY/breach evidence is self-attested or hardcoded.**
4. **F05 — the declared container environment is never used through the Gradual Release chain.**
5. **F28 — exact-digest theory is directly contradicted by I Do/We Do that accept `sha256:abc`.**

A section with even one of these cannot honestly serve as a capstone gate. S43 has five.

---

## 3. Detailed Issue Registry

### P0 — release blockers

#### S43-F02 — CP-N4-A closure does not execute the canonical capstone contract
**Severity:** P0  
**Evidence:** The canonical rubric requires 200/429/401, token-redacted logs, health, non-root and migrations. The S43 You Do focuses Dockerfile/Compose/runbook and never calls the capstone integration interface `service.serve(request) -> ApiResponse` or verifies the required service behaviors.  
**Impact:** A learner can “close” CP-N4-A while failing auth, rate limiting, response behavior or log redaction. Container packaging can compensate for an ungoverned service even though the capstone contract says it must not.  
**Attack:** Could S40-S42 be assumed to have already proven these? No: S43 is explicitly the capstone gate, the canonical rubric lists these tests at S43, and S42 itself has open P0 audit findings.  
**Defense:** S43 may reasonably focus its new instruction on containers.  
**Verdict:** `CONFIRMED_FINDING`. New instruction may focus on S43, but the **final gate must integrate S40-S43 evidence**.  
**Required repair:** Make the final verifier run all canonical CP-N4-A tests plus S43 container/recovery tests.

#### S43-F03 — learner-visible rubric contradicts canonical CP-N4-A rubric
**Severity:** P0  
**Evidence:** S43 shows a 25/20/15/15/15/10 percentage rubric. Canonical CP-N4-A uses four 0–3 criteria weighted .35/.20/.25/.20 and a gate of weighted >=2.4/3, no critical criterion below 2 and zero P0.  
**Impact:** Two legitimate evaluators can produce different pass/fail outcomes for the same project.  
**Verdict:** `CONFIRMED_FINDING`.  
**Required repair:** Render/use the canonical rubric as the sole scoring contract.

#### S43-F04 — final readiness is self-attested
**Severity:** P0  
**Evidence:** `readiness(bundle)` only tests whether four learner-controlled values are `True`. `gate_case('normal')`, `gate_case('breach')` and the uncertain branch return predetermined tokens based on the supplied label rather than artifact evidence.  
**Impact:** A learner can obtain `READY` without opening Dockerfile, Compose, runbook, building an image, starting a service or running a test.  
**Verdict:** `CONFIRMED_FINDING`.  
**Required repair:** `READY` must be generated from artifact paths/hashes, commands, exit codes and required tests; booleans may summarize evidence but may not constitute it.

#### S43-F05 — environment and Gradual Release are structurally misaligned
**Severity:** P0  
**Evidence:** Roadmap says `local con contenedores`; the 8 I Do and 24 We Do tasks are overwhelmingly Python dictionaries, booleans and text parsers. No guided step actually executes `docker build`, `docker compose up`, `docker inspect`, health requests, SIGTERM, migration, restore or image scanning.  
**Impact:** The learner rehearses a different skill for dozens of tasks and is then expected to perform the real environment independently at the capstone. This is the opposite of faded worked examples.  
**Verdict:** `CONFIRMED_FINDING`.  
**Required repair:** I Do must model real container operations; We Do must fade commands/scaffolds; You Do must integrate them independently.

#### S43-F28 — exact-digest theory is contradicted by reference practice
**Severity:** P0  
**Evidence:** T4-A theory correctly validates `^sha256:[0-9a-f]{64}$` and explicitly demonstrates that a short digest is not pinned. Yet I Do/We Do solutions use `lock_hash.startswith('sha256:')`, allowing values such as `sha256:abc` to pass.  
**Impact:** Reference answers train the exact invalid behavior the theory warns against. This is a high-risk misconception in a reproducibility/supply-chain gate.  
**Verdict:** `CONFIRMED_FINDING`.  
**Required repair:** Reuse a single exact validator and bind the digest to the real lock/base artifact.

### P1 — major integrity and transfer defects

#### S43-F01 — upstream S42 gate integrity is unresolved
S43 assumes the S42 service is ready to package, but the current S42 audit contains P0 security-evidence failures. **Impact:** packaging may legitimize unresolved schema/SSRF/privacy defects. **Repair:** S43 gate must require upstream critical evidence, not merely section progression.

#### S43-F06 — public CP-N4-A brief contains stale pre-V3 learner-facing section names
The brief shown from CapstonesPage identifies S41 as LLM finetuning, S42 as Graph RAG and S43 as LLMOps. **Impact:** the official project map contradicts the current course. **Repair:** update display labels while preserving stable technical IDs internally.

#### S43-F07 — canonical/public brief contradicts current build requirement
The brief says the “container” is only specified by Dockerfile and is not built in the demo. Current S43 says repeatable build in a new environment/one command. **Impact:** authoritative sources disagree on the core gate. **Repair:** require a local build/run; cloud/registry may remain out of scope.

#### S43-F08 — T1-A “digest” evidence is tautological
Both logical digests are constructed from the same input string, so stability is true by construction. **Impact:** a fabricated label becomes “build evidence.” **Repair:** measure BuildKit/cache/image output or explicitly call the string only a conceptual cache key.

#### S43-F09 — cache reuse is conflated with reproducibility
Dependency-layer reuse proves an efficient incremental build, not that two fresh builds are reproducible. **Impact:** learners may equate `CACHED` with deterministic output. **Repair:** separate cache-efficiency tests from clean-build reproducibility tests.

#### S43-F10 — Dockerfile fixtures use invalid `@sha256:demo`
The supposedly transferable Dockerfiles cannot represent a valid OCI digest and contradict the later exact validator. **Repair:** use an actual lab digest or an explicitly non-runnable placeholder that is never graded as valid.

#### S43-F11 — final requirement permits mutable non-latest tags
You Do allows “digest o tag no latest”; Docker tags are mutable. **Impact:** mutable base passes a reproducibility gate. **Repair:** require a digest for graded reproducibility; a tag may accompany the digest for readability.

#### S43-F13 — T1-B E3 parser creates false positives and false negatives
Named non-root users such as `USER appuser` are rejected because parser only recognizes numeric users/root; any string containing `@sha256:` can be treated as pinned. **Repair:** inspect runtime user and exact image metadata rather than infer security from a tiny text parser.

#### S43-F14 — runtime-size domain is not validated
Negative image sizes can satisfy `runtime_mb <= max_mb`. **Repair:** require finite positive measurements and obtain actual size in final evidence.

#### S43-F16 — capabilities outcome is not final-gated
T1-B mentions no extra capabilities, but You Do has no runtime capability evidence. **Repair:** inspect effective/additional capabilities and define an explicit lab policy.

#### S43-F17 — secret scan false-greens common secret forms
Only `SECRET=` and `PASSWORD=` are searched. `TOKEN=`, `API_KEY=`, copied `.env`, ARG/RUN leaks and arbitrary secret names evade it. **Repair:** seed a synthetic secret and use build-context exclusion/history/image scanning.

#### S43-F18 — absence of a baked secret is mistaken for proof of runtime injection
`runtime_only = not baked`. No secret at all satisfies the same condition. **Repair:** prove both sides: secret available to authorized service at runtime **and** absent from image/history; then rotate without rebuild.

#### S43-F19 — secret environment guidance is weaker than available Compose primitive
Sensitive env vars are presented alongside secret mounts without a clear preference/risk explanation. **Repair:** use Compose secrets/mounts as default in this lab; explain env leakage surface.

#### S43-F20 — `.dockerignore`/build-context hygiene is missing
The lesson warns against baking `.env` but never teaches the control that keeps it out of build context. **Repair:** require `.dockerignore` and test that a seeded sensitive fixture cannot enter build context/image.

#### S43-F21 — probes and SIGTERM are self-attested
`health_status(ready,live)` and `on_sigterm(drains=True, grace=30)` never hit an endpoint or send a signal. **Repair:** run service, stop dependency, curl probes, send SIGTERM/docker stop and measure drain/exit.

#### S43-F23 — Compose claims healthchecks but example defines none
`MINI_COMPOSE` has no `healthcheck:` while a manually supplied `healthy` set decides success. **Repair:** define real healthchecks and inspect/wait on them.

#### S43-F24 — a retry token is not retry behavior
`DB_MAX_ATTEMPTS` presence or `retries=True` is accepted as proof. **Repair:** restart/fail DB and observe bounded retry/backoff in the application.

#### S43-F26 — expand/contract lifecycle is broken by reference logic
Theory correctly teaches later `contract`, but reference predicates allow only `migration == 'expand'`. **Impact:** learners may infer all contract migrations are unsafe. **Repair:** model phases and permit contract after old readers are gone.

#### S43-F27 — migration and restore are self-attested
`migrate_before_api=True` and `backup_restored=True` replace actual migration/recovery evidence. **Repair:** run a small migration, backup and restore; verify schema/data state before/after.

#### S43-F29 — lock hash is detached from the actual lock file
A digest-looking string can represent arbitrary text. **Repair:** hash the actual lock file and enforce it during dependency installation.

#### S43-F31 — signed CVE exception is named but impossible to represent
Prose allows signed exceptions; executable policy only permits `critical==0`. **Repair:** either remove exceptions from scope or model ID/rationale/owner/expiry/compensating control.

#### S43-F32 — scanner evidence is not bound to the deployed image
A critical-count integer/text can come from another image, scanner version or stale DB. **Repair:** persist image digest, scanner/tool version, vulnerability DB timestamp and report hash.

#### S43-F34 — one-command clean-environment claim is not executed
Artifact filenames are listed but never opened/run. **Repair:** a real `make verify` or equivalent builds, starts, waits for health, runs canonical tests, stops/cleans and emits an evidence manifest.

#### S43-F35 — visible rubric grades unscaffolded/future constructs
SLO/observability/lineage are scored although S43 starter does not create them and canonical rubric is different. **Repair:** use canonical rubric and only grade explicit evidence.

#### S43-F36 — obsolete LLMOps/RAG playground leaks into learner-facing S43
`SectionView` maps the stable `llmops` key to a tracing/RAG/RAGAS/cost exercise. **Impact:** unrelated conceptual graph interferes with the container lesson and resurrects the old section identity. **Repair:** keep stable key but replace its mapped content with on-topic container preflight or remove it.

#### S43-F37 — self-check reinforces false evidence and incomplete gate
Q1 treats logical deps digest as proof; Q3 defines CP-N4-A only through container properties. **Repair:** ask learners to distinguish cache vs reproducibility and include canonical service tests in gate question.

#### S43-F38 — self-check under-samples section/gate
Five recognition items cannot cover eight outcomes + integrated capstone. **Repair:** scenario items for migration, lock/digest, scan provenance and recovery.

#### S43-F39 — authenticated exam has breadth but low transfer
The 24 questions broadly cover concepts but largely test definitions. **Repair:** variants should include Dockerfile diffs, Compose snippets, migration runbooks, scan reports and runtime configs.

#### S43-F40 — critical exam items are not enforceable
Global scoring has no `critical` field and uses only total >=70%, while roadmap requires 100% critical items. **Repair:** add critical metadata and a non-compensable critical gate.

#### S43-F44 — figures are attached to the wrong conceptual nodes
T1-A shows builder→runtime/toolchain (T4-A concept); T1-B shows source-before-deps cache invalidation (T1-A concept). **Repair:** move cache figure to T1-A and multi-stage figure to T4-A; give T1-B a base/non-root/capability/size visual.

### P2 — important but secondary defects

#### S43-F12 — UID >=1000 is false precision
UID 0 is root; >=1000 is a useful lab convention, not the definition. Label it explicitly as course policy.

#### S43-F15 — `slim` and distroless are overgeneralized
`slim` does not necessarily remove the shell as distroless does. Separate their operational/debug trade-offs.

#### S43-F22 — `grace >=20` becomes a magic number
20/30 seconds may be a lab budget; graceful means observed drain within configured budget, not universal >=20.

#### S43-F25 — literal `front`/`back` network names are overprescribed
Grade least exposure/trust-boundary behavior, not topology vocabulary.

#### S43-F30 — toolchain detection via `gcc`/`g++` substring is brittle
It misses clang/make/rust/build-essential and can match comments. Inspect installed runtime content/policy instead.

#### S43-F33 — 512 MiB/1 CPU presented with false universality
These are valid **case budgets**, not global container best practices. Name them `LAB_*_BUDGET` and explain derivation.

#### S43-F41 — 24 We Do tasks form a predicate-repair monoculture
E1 inverted predicate, E2 valid/breach/missing, E3 text parser repeats eight times. This enables task-grammar learning rather than Docker transfer.

#### S43-F42 — widow terms and operational density
Capabilities, distroless, digest, restore drill, OOM, CVE, expand/contract and builder/runtime accumulate faster than real operations make them meaningful.

#### S43-F43 — resources are partly misallocated
Primary Docker/NIST/OWASP sources are strong; generic Python beginner resources add noise. Add direct Docker docs for Compose secrets, startup/service_healthy, resource constraints, cache/reproducible builds and `.dockerignore`.

---

## 4. Meta-Leak Report

### Confirmed learner-facing leak

**Location:** `src/components/course/SectionView.tsx`, playground mapping for stable key `llmops`.

**Current learner-facing title:**

> `Practica tracing y eval (simulado)`

The content then simulates:

- LangSmith-like tracing;
- retriever/generator functions;
- a RAG pipeline;
- RAGAS-like `faithfulness`, `answer_relevancy`, `context_precision`, `context_recall`;
- token/cost tracking.

This is not S43 container content. It is a surviving pre-V3 LLMOps artifact.

**Verdict:** `CONFIRMED_FINDING` — S43-F36.

### Important non-leak distinction

The stable id/file name `llmops` is **not itself a learner-content defect to rename**. Source explicitly documents it as a pre-V3 URL/progress key. Renaming without migration risks learner progress. The correct repair is to change the **content mapped to that key**, not the key.

### Learner-facing stale capstone content

The public CP-N4-A brief is also learner-visible through the Capstones page and lists stale names:

- S41 `(LLM finetuning)`;
- S42 `(graph RAG ...)`;
- S43 `(LLMOps)`.

This is categorized primarily as **curriculum/content drift** (F06), not an internal developer-comment leak, because it is intentionally written as a learner prerequisite section but is obsolete.

No AI-to-developer instruction such as “moved from section X” was newly confirmed inside the canonical S43 lesson prose.

---

## 5. Pedagogical & Redaction Deep Dive

### A. The section's best theory is undermined by its own practice

The audit deliberately rejected several possible false positives.

The T4-A paragraph that distinguishes a **base image digest** from a **dependency lock** is strong. It explicitly says they are different pins and uses a strict 64-hex digest regex. This paragraph is retained as `SIN_CAMBIO_DEFENDIDO`.

Likewise, the T2-B distinction between **readiness** and **liveness** is conceptually useful: one asks whether the service can accept traffic; the other whether the process is still viable. The problem is not that explanation. The problem is that practice changes “send SIGTERM and observe drain” into `sigterm_drains=True`.

That pattern recurs:

| Theory property | Practice proxy |
|---|---|
| build actually repeatable | `digest_stable=True` / fabricated string |
| non-root runtime | `uid=10001` |
| secret injected at runtime | `runtime_secret=True` |
| healthcheck passes | `healthy` set |
| retry/backoff works | `DB_MAX_ATTEMPTS` token / `retries=True` |
| SIGTERM drains | `sigterm_drains=True` |
| backup restores | `backup_restored=True` |
| scan clean for this image | `critical_cves=0` |

The learner is repeatedly asked to reason about the **representation of success**, not to generate success evidence.

### B. I Do → We Do → You Do fidelity is broken

The roadmap requires local containers. A sound Gradual Release would look like:

1. **I Do:** instructor builds/runs/inspects one real minimal container while narrating causal decisions.
2. **We Do E1:** learner completes one missing command/config piece with strong guidance.
3. **We Do E2:** learner diagnoses a real broken artifact with partial guidance.
4. **We Do E3:** learner transfers to a new real artifact/failure mode.
5. **You Do:** learner independently verifies the integrated service from a clean environment.

Current S43 instead repeats the same abstract grammar 24 times and then asks for real files in You Do. EEF worked-example guidance emphasizes fading support so the gap to independent practice is not too large; when a new procedure/stage appears, worked support should return. Here, the **actual container procedure appears almost entirely at the final stage**, so the leap is maximal rather than faded.

### C. External benchmark: official Docker learning material is more authentic

Current Docker documentation/labs model the exact operations S43 currently simulates:

- multi-stage builds;
- `.dockerignore` to control build context;
- actual image build/test;
- base digest pinning because tags are mutable;
- Compose `healthcheck` and `depends_on.condition: service_healthy`;
- Compose secrets instead of ordinary env for sensitive values;
- explicit resource constraints;
- runtime user/security practices.

S43 should not be more abstract than the primary tool's own instructional material at the point where it claims “Producción gobernada.”

### D. Cognitive load: the problem is not simply “too advanced”

The vocabulary load is high, but cutting terms is not sufficient. The better correction is to make each new term operational:

- **digest** → show exact image reference and inspect it;
- **capability** → show actual effective/granted capabilities;
- **readiness** → curl endpoint before/after DB failure;
- **SIGTERM** → send signal and observe timestamps;
- **restore drill** → restore a backup and query a known fixture;
- **scan provenance** → image digest + scanner version + DB timestamp + report hash.

A trigger→command→observable-result chain lowers ambiguity more effectively than adding more prose definitions.

### E. Redaction and Peruvian Spanish

Spanish quality is generally serviceable and noticeably better than early auto-generated sections. The largest redaction issues are semantic rather than grammatical:

- English terms are sometimes used before a stable Spanish mechanism exists (`capabilities`, `distroless`, `restore drill`).
- `non-root = UID >=1000` reads as a technical definition rather than a lab convention.
- numerical examples (`20s`, `512Mi`, `1 CPU`) read like universal thresholds because they are encoded directly in predicates.
- “slim/distroless recortan shell” compresses two different base-image choices into one claim.

Recommendation: Spanish-first mechanism once, English term in parentheses, then abbreviated reuse.

### F. Assessment alignment

The authenticated bank has good **coverage breadth**—24 S43 items across all eight concepts—but too much of the demand is declarative recognition. More importantly, the platform scorer makes critical failures compensable because it has no critical-item concept. For a section with root/secrets/migrations/health critical failures, this is an assessment-integrity defect, not just a style preference.

---

## 6. Proposed GitHub-style Diffs

These are proposals only. **Do not apply in Explorer phase.**

### Diff A — replace self-attested final gate with integrated CP-N4-A verifier

```diff
@@ youDo.starterCode
- evidence = {
-   "dockerfile_multi_stage_fijado": False,
-   "compose_con_api_worker_db_cache_y_health_checks": False,
-   "config_secrets_volumes_documentados": False,
-   "runbook_de_migracion_senales_limites_y_recuperacion": False,
- }
-
- def readiness(bundle):
-     missing = [name for name in REQUIRED if bundle.get(name) is not True]
-     return ("READY", []) if not missing else ("BLOCKED", missing)
-
- def gate_case(kind):
-     if kind == "normal": return "CONTINUE"
-     if kind == "breach": return "QUARANTINE_IMAGE"
-     return "TRIAGE_SCAN_FINDING"
+ # Evidence is generated by verify_cp_n4_a.py, not typed by the learner.
+ # Each check records artifact SHA-256, command, exit code and observed result.
+ manifest = verify_cp_n4_a(
+     dockerfile="Dockerfile",
+     compose="compose.yaml",
+     runbook="runbook.md",
+ )
+
+ assert manifest.required_tests == {
+     "valid_request_200": "PASS",
+     "rate_limit_429": "PASS",
+     "unauthenticated_401": "PASS",
+     "health_ok": "PASS",
+     "non_root": "PASS",
+     "token_logs_redacted": "PASS",
+     "migrations_present_and_tested": "PASS",
+ }
+ assert manifest.critical_failures == []
+ assert manifest.container_checks.all_pass
```

### Diff B — make visible rubric canonical

```diff
@@ youDo.rubric
- 25% Corrección técnica del contrato y gate
- 20% Pruebas normal/breach/uncertain y recuperación
- 15% Seguridad, privacidad y least privilege
- 15% Reproducibilidad, lineage y evidencia
- 15% Operación: SLO, observabilidad y rollback
- 10% Comunicación de trade-offs y límites
+ correctness: 0.35
+ robustness: 0.20
+ maintainability: 0.25
+ responsible_use: 0.20
+
+ Gate: promedio ponderado >= 2.4/3
+       y ningún criterio crítico < 2
+       y cero P0
+       y todos los tests requeridos PASS
```

### Diff C — use one exact digest validator everywhere

```diff
@@ T4-A I Do / We Do
- pinned = lock_hash.startswith("sha256:")
+ DIGEST = re.compile(r"^sha256:[0-9a-f]{64}$")
+ pinned = bool(DIGEST.fullmatch(lock_hash))

+ assert not pinned_digest("sha256:abc")
+ assert not pinned_digest("sha256:demo")
+ assert pinned_digest("sha256:" + "3f" * 32)
```

Better still, hash the actual lock file and record that file hash separately from the OCI base/image digest.

### Diff D — make Compose health executable

```diff
@@ compose.yaml teaching example
 services:
   api:
-    depends_on: [db, cache]
+    depends_on:
+      db:
+        condition: service_healthy
+      cache:
+        condition: service_healthy
     environment:
       DB_MAX_ATTEMPTS: "5"
   db:
     networks: [back]
+    healthcheck:
+      test: ["CMD-SHELL", "...known fixture readiness command..."]
+      interval: 2s
+      timeout: 1s
+      retries: 15

@@ acceptance
- healthy = {"api", "worker", "db", "cache"}
- retries = True
+ docker compose up --build --wait
+ assert compose_health("api") == "healthy"
+ restart("db")
+ assert application_log_shows_bounded_backoff()
```

### Diff E — teach secrets with build-context exclusion and Compose secrets

```diff
+ # .dockerignore
+ .env
+ *.secret
+ tests/fixtures/seeded-secret.txt

@@ compose.yaml
+ secrets:
+   app_token:
+     file: ./secrets/app_token.synthetic
+
 services:
   api:
+    secrets: [app_token]

@@ evidence
+ assert synthetic_token_available_to("api")
+ assert not synthetic_token_available_to("worker")
+ assert synthetic_token not in docker_history()
+ assert synthetic_token not in image_scan_strings()
+ rotate_secret_without_rebuild()
```

### Diff F — model the full expand/contract lifecycle

```diff
- ok = migration == "expand" and old_ok and ephemeral_reset and restored
+ if phase == "expand":
+     ok = old_reader_tests_pass and migration_exit == 0
+ elif phase == "contract":
+     ok = no_old_readers_remain and new_reader_tests_pass and migration_exit == 0
+ else:
+     ok = False
+
+ assert backup_created_before_change
+ assert restore_command_exit == 0
+ assert restored_fixture_query == expected_fixture
```

### Diff G — repair learner-facing `llmops` playground without renaming the stable key

```diff
@@ SectionView playground mapping
 'llmops': {
-  title: 'Practica tracing y eval (simulado)',
-  code: `...RAG / RAGAS / token cost...`
+  title: 'Practica el preflight de una imagen reproducible',
+  code: `
+  # Browser-safe preflight only: cache order, exact digest format,
+  # non-root policy and expected Docker commands.
+  # Final evidence still comes from local Docker in S43 labs.
+  `
 }
```

### Diff H — repair public CP-N4-A brief

```diff
@@ public/capstones/CP-N4-A_BRIEF.md
- S41 (LLM finetuning)
- S42 (graph RAG ...)
- S43 (LLMOps)
+ S41 (API FastAPI)
+ S42 (Schemas, seguridad y privacidad de servicios)
+ S43 (Contenedores y reproducibilidad operativa)

- El 'contenedor' se especifica via Dockerfile (no se construye en el demo).
+ El demo construye y ejecuta el contenedor localmente.
+ No requiere registry, cluster ni servicio cloud.
+ El gate conserva build, health, test, shutdown y recovery evidence.
```

### Diff I — enforce critical exam items

```diff
@@ QuestionKey
 type QuestionKey = {
   id: string
+  critical?: boolean
   ...
 }

@@ gradeExamAnswers
+ const criticalPassed = detailedAnswers
+   .filter(a => a.critical)
+   .every(a => a.correct)

- passed: clamped >= PASS_THRESHOLD
+ passed: clamped >= PASS_THRESHOLD && criticalPassed
```

Mark at least root execution, embedded secret, missing health, missing migration and other canonical security failures as critical.

### Diff J — correct figure-to-concept edges

```diff
@@ T1-A
- figure: S43-multistage  # builder -> runtime / gcc
+ figure: S43-image-layers  # deps-before-source cache invalidation

@@ T1-B
- figure: S43-image-layers
+ figure: NEW S43-runtime-privilege
+ # base digest -> USER/non-root -> capabilities -> image-size budget

@@ T4-A
+ figure: S43-multistage
```

---

## 7. Recommended Priority Order for Fixing

### Priority 0 — restore gate validity
1. **F02:** integrate canonical CP-N4-A required tests into final S43 verifier.
2. **F03:** eliminate competing visible rubric; use canonical rubric.
3. **F04:** remove learner-controlled READY and label-driven `gate_case`.
4. **F05:** rebuild I Do/We Do around actual container operations.
5. **F28:** remove all prefix-only digest false-greens immediately.

### Priority 1 — repair the authoritative learner contract
6. **F06:** update stale S41/S42/S43 names in public/canonical CP-N4-A brief.
7. **F07:** resolve “container is not built” vs current build-required contract.

### Priority 2 — make operational evidence real
8. F08–F11: separate cache from reproducibility and require exact base/image evidence.
9. F13–F20: runtime identity/capabilities, secret mechanism and `.dockerignore`.
10. F21–F27: health/SIGTERM, actual Compose health/retry, complete expand/contract and restore.
11. F29–F34: actual lock binding, scan provenance, lab resource budgets and one-command verification.

### Priority 3 — remove learner interference
12. **F36:** replace obsolete LLMOps/RAG playground while preserving stable key.
13. **F44:** relocate/replace mismatched figures.

### Priority 4 — assessment integrity
14. F37–F38: rewrite self-check around evidence and complete gate.
15. F39: convert authenticated variants to artifact interpretation.
16. F40: implement non-compensable critical exam gate.

### Priority 5 — refinement after correctness
17. F12/F15/F22/F25/F30/F33/F41/F42/F43: terminology precision, exercise variety and resource focus.

Do not spend the first fix wave polishing prose while READY can still be manufactured from four booleans.

---

## 8. Graph Memory Update Notes

### Stable graph nodes worth preserving

`S43.T1.cache_order` → **USABLE**  
Dependencies/lock before frequently changing app source is a sound cache-efficiency rule.

`S43.T1.base_digest_exact` → **USABLE_IN_THEORY / BROKEN_IN_PRACTICE**  
Strict 64-hex digest theory should become the shared validator everywhere.

`S43.T2.readiness_vs_liveness` → **USABLE**  
Good conceptual distinction; requires executed probe evidence.

`S43.T2.runtime_secret_not_baked` → **USABLE_CONCEPT / PARTIAL_IMPLEMENTATION**

`S43.T3.depends_on_vs_app_retry` → **USABLE**  
Compose startup readiness and application resilience are complementary.

`S43.T3.durable_vs_ephemeral` → **USABLE**

`S43.T3.expand_contract` → **USABLE_IN_PROSE / CONTRADICTED_BY_REFERENCE_CODE**

`S43.T4.lock_vs_base_digest` → **GOLD_NODE**  
One of the strongest technical explanations in S43. Do not rewrite it to match defective practice; repair practice.

`S43.T4.multi_stage_builder_runtime` → **USABLE**

### High-risk misconception edges to retain in shared graph memory

- cache hit → reproducible build = **FALSE_EDGE**;
- non-latest tag → immutable base = **FALSE_EDGE**;
- UID >=1000 → definition of non-root = **FALSE_EDGE**;
- `svc/USER` string → runtime security property = **PROXY_RISK**;
- absence of `SECRET=` → secret injected safely at runtime = **FALSE_EDGE**;
- `sigterm_drains=True` → graceful shutdown proven = **SELF_ATTESTATION**;
- `healthy` set → Compose healthcheck proven = **SELF_ATTESTATION**;
- `DB_MAX_ATTEMPTS` token → retry/backoff behavior proven = **PROXY_RISK**;
- all `contract` migrations → unsafe = **FALSE_EDGE**;
- `backup_restored=True` → recovery tested = **SELF_ATTESTATION**;
- `sha256:abc` → pinned artifact = **DIRECT_MISCONCEPTION**;
- `critical_cves=0` → exact built image is clean = **UNBOUND_EVIDENCE**;
- four booleans True → CP-N4-A READY = **INVALID_GATE**;
- S43 container subset → entire CP-N4-A = **MISSING_INTEGRATION**;
- `llmops` stable id → LLMOps/RAG learner content belongs here = **LEGACY_CONTENT_LEAK**.

### Cross-section edges

- S42 → S43: prerequisite remains **BLOCKED_BY_UPSTREAM_AUDIT** until S42 P0s are repaired.
- S40/S41/S42/S43 → CP-N4-A: final S43 gate must consume evidence from all contributing sections.
- S43 → S44: S43 should output an immutable/build-and-test evidence bundle that S44 CI/CD can later automate; it must not pre-empt S44 by grading hidden CI/CD constructs.

### Audit artifacts created

- `audit/lessons-only/sections/S43.json`
- `audit/lessons-only/sections/S43.supplement-01.json`
- `audit/lessons-only/sections/S43.paragraphs-01.json` … `S43.paragraphs-07.json`
- `audit/lessons-only/sections/S43.components.json`
- `audit/lessons-only/sections/S43.practice-audit-01a.json`
- `audit/lessons-only/sections/S43.practice-audit-01b.json`
- `audit/lessons-only/sections/S43.practice-audit-02.json`
- `audit/lessons-only/sections/S43.full-scope-index.json`
- this Explorer report.

The seven paragraph shards retain the requested current content, problems, attack, defense, verdict, improved paragraph and justification for all **32/32** theory/reference paragraphs. Practice ledgers retain current task/behavior and proposed improved task architecture for all **8 I Do and 24 We Do**.

---

**This is the complete Explorer report for Section 43. Ready for the Fixer prompt.**