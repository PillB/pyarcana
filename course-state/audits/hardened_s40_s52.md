# S40–S52 hardening checkpoint

Date: 2026-07-22
Scope: active curriculum files S40 through S52 only
Roadmap authority: `learning_roadmap_52_V3.md`, Level 4
Status: content/runtime/type gates green; dual-newbie pedagogy gate remains a separate downstream run

## Outcome

The 13 Master sections now implement the V3 sequence from architecture/DDD through the final enterprise capstone. The learner-facing content no longer exposes authoring notes, preserved platform IDs, copy-the-demo tasks, magic proof strings, generic self-checks, or unfinished capstone scaffolds.

Structural inventory after the change:

| Artifact | Count | Contract |
|---|---:|---|
| Tagged subtopics | 104 | 8 per section |
| Tagged iDo demos | 104 | 8 per section |
| WeDo exercises | 312 | 24 per section; E1/E2/E3 for every subtopic |
| Synthetic fixture identities | 104 | one distinct Peruvian fixture per subtopic |
| YouDo projects | 13 | runnable readiness scaffold, deliverables and rubric |
| Self-check questions | 52 | four content/gate questions per section |

## Research-to-design translation

The implementation applies the benchmark recorded in `course-state/audits/university_github_benchmark.md`:

- [MIT 6.100L](https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/) and [Harvard CS50P](https://cs50.harvard.edu/python/) informed the executable, incremental problem contract: observable input, output and checks rather than prose-only completion.
- [Stanford CS106A](https://web.stanford.edu/class/cs106a/) informed constrained scaffolding: E1 repairs one known defect before E2 removes guidance and E3 introduces failure recovery.
- [Yale Computer Science course listings](https://catalog.yale.edu/ycps/courses/cpsc/) and [Coursera Python for Everybody](https://www.coursera.org/specializations/python) reinforced cumulative outcomes and authentic projects instead of isolated print drills.
- [Practical Python](https://github.com/dabeaz-course/practical-python), [Python Data Science Handbook](https://github.com/jakevdp/PythonDataScienceHandbook), [Made With ML](https://github.com/GokuMohandas/Made-With-ML), and [MLOps Zoomcamp](https://github.com/DataTalksClub/mlops-zoomcamp) informed the evidence-bundle pattern: runnable examples, explicit data/contracts, testing, deployment and operational documentation.

No external learner repository solutions were copied into PyArcana. The references informed sequence and evidence standards; every fixture and solution here is local and synthetic.

## Pedagogical contract implemented

Every tagged subtopic now follows the same learning *shape* without repeating the same task:

1. Theory defines the concept, an operational contract, a measurable gate and a subtopic-specific synthetic Peruvian application.
2. iDo demonstrates the local concept with standard-library Python and explains why the evidence matters.
3. E1 repairs a deliberately wrong domain predicate on that subtopic’s fixture.
4. E2 evaluates three exact routes: valid, adversarial and a named missing field.
5. E3 transfers the rule to fail-closed operation: continue, a subtopic-specific breach action, or a subtopic-specific uncertainty/review action.
6. YouDo assembles the eight artifacts into a section increment with normal/breach/uncertain tests, reproducible commands, risk owner, rollback and residual-risk evidence.

The 104 predicates are domain operations, not magic-string completion. Examples include HTTP status/idempotency, cross-tenant authorization, path/SSRF confinement, Docker non-root/resource gates, artifact digest/provenance matching, queue deduplication and DLQ, watermark/late-event classification, model signature/promotion, ACL-filtered RAG and citations, bounded tool budgets, adversarial eval severity, trace redaction, accessibility/contestability, and CP-FINAL no-go criteria.

## Section coverage

| Section | Hardened operational focus |
|---|---|
| S40 | Quality attributes, boundaries, ports/adapters, bounded contexts, domain model, C4/ADR and compatibility |
| S41 | HTTP semantics, idempotency, FastAPI boundaries, schemas, async/timeouts, test levels and rate observability |
| S42 | Strict schema evolution, authn/authz/RBAC, deny-by-default, input/network/path security, secrets and privacy lifecycle |
| S43 | Docker layers, pinned non-root runtime, config/secrets/volumes, health/signals, Compose, migrations, locks and scanning |
| S44 | CI matrices, caches/artifacts, minimum permissions, SBOM/provenance, approvals, canary/rollback and audit evidence |
| S45 | Store selection, consistency/restore, delivery semantics, dedup/order/DLQ, autoscaling, IAM/egress, IaC and cost/recovery |
| S46 | Event time/watermarks, late data/idempotency, DAG/assets, backfills/checkpoints, contracts/freshness, lineage and data incidents |
| S47 | Experiment lineage, registry/signatures/cards, batch/online parity, latency/fallback, canary and model rollback/retirement |
| S48 | Embedding evaluation, versioning, chunk/dedup, ACL/deletion/provenance, hybrid ranking, citations, grounding and abstention |
| S49 | Workflow-vs-agent choice, bounded roles, narrow tools, schema/scope/idempotency, JIT context, memory, budgets and approval |
| S50 | Task datasets/rubrics, trajectory/recovery, calibrated graders, order bias/holdout, injection/exfiltration and rollback |
| S51 | Prompt/retrieval/tool traces, token/cost/latency redaction, registries, change control, SLO/drift, incidents and accessible UX |
| S52 | Stakeholder revalidation, no-go decisions, bounded integration, human workflow, complete verification, disaster drill and portfolio defense |

## Removed defects

Counts compare repository `HEAD` before this checkpoint with the hardened working tree:

| Rejected marker | Before | After |
|---|---:|---:|
| Generic “Practica con código…” theory | 104 | 0 |
| Generic “Demuestra el outcome…” demo rationale | 104 | 0 |
| Generic “Si el assert/print…” callout | 104 | 0 |
| Copy-the-iDo exercise instruction | 312 | 0 |
| `# TODO` learner-facing markers | 637 | 0 |
| Internal `KEEP_PLATFORM_ID_RETHEME_CONTENT` marker | 26 | 0 |
| `cross_encoder_stub` | 2 | 0 |

The S48 hybrid retrieval example no longer labels a non-implementation as a cross-encoder. The substantive exercise computes deterministic dense/lexical ranking, and the visible demo names its actual weighted method.

## Official references mounted by section

Resources are no longer thirteen copies of the Python documentation. They now point to primary documentation appropriate to the lesson, including C4/Azure/AWS ADR guidance, FastAPI/RFC 9110/OpenAPI, Pydantic/OWASP/NIST, Docker/OCI, GitHub Actions/SLSA/CycloneDX, Terraform/CloudEvents, Beam/Airflow/OpenLineage, MLflow/KServe/Model Cards, RAG and hybrid search guidance, tool/function contracts, OpenAI eval design, OpenTelemetry, WCAG, and the NIST SSDF.

All exercises remain credential-free and stdlib-only. Product-specific references are optional reading, not hidden prerequisites for the exercises.

## Verification evidence

Commands run from the repository root:

```text
python3 tests/adversarial/test_master_curriculum_specificity.py
  4 tests — PASS

python3 tests/adversarial/test_active_v3_curriculum_contract.py
  4 tests — PASS

python3 scripts/v3_invariant_validator.py
  ok=true; warnings=0; v3_tagged=52

python3 scripts/python_content_runtime_audit.py --only 'phase: 3' --workers 8
  sections=13; artifacts=832; pass=832; fail=0; skip=0; P0=0; P1=0

npx tsc --noEmit
  exit=0
```

The permanent specificity regression verifies:

- all 13 Master files exist and contain none of the rejected templates/stubs;
- each section has eight distinct subtopic fixture IDs and at least eight distinct solution predicates;
- every section retains 8 E1, 8 E2 and 8 E3 instructions with explicit outputs;
- all 13 WeDo introductions and all 104 theory gate callouts are distinct;
- official HTTPS resources are present.

## Boundaries and residual work

- This checkpoint does not alter section-hour metadata; the orchestrator owns the separate reconciliation to the V3 provisional 1,040-hour total.
- This checkpoint does not claim the dual-newbie pedagogy gate. Packets must be regenerated after the complete curriculum freezes, and two isolated learners plus validator must still run from the landing page through S52.
- This checkpoint does not edit exam seed banks, attempt logs, checkpoint state or deployment configuration.
- Resource URLs require the normal final link check during the full-site validation/deployment phase.
