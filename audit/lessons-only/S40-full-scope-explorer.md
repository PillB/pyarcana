# S40 — Full-scope Explorer report

## 1. Section Identification & Scope

- **Section:** S40 — Arquitectura, DDD y decisiones técnicas
- **Canonical source:** `src/lib/course/sections/s40-architecture-ddd.ts`
- **Source commit:** `535bd4d7b603283af9a39a813a79f05afbc47b48`
- **Canonical blob:** `9675cf41438cc5f70456a649fcf4ea35c91c246b`
- **Phase:** 3 — Sistemas de Producción Gobernados
- **Actual capstone relationship:** S40 contributes architecture evidence to **CP-N4-A**, whose canonical gate is **S43**.
- **Reviewed:** title/tagline/job relevance, 8 outcomes, 34/34 theory/reference paragraphs, 33 theory components, 8/8 I Do demos, 24/24 We Do exercises, You Do project/rubric, 8/8 self-check questions and 16/16 resources.
- **Production content modified:** no. This report and JSON shards were added only to `audit/lessons-only-adversarial-20260903`.

The public crawl still exposes the S40 card as “Arquitectura y DDD” with the same tagline as `main`. It reports 20h while source encodes 9h, but the crawl is stale and the same snapshot reports 1040h total versus 491h on `main`; this remains `UNRESOLVED_LIVE_SOURCE_DRIFT`, not a confirmed current deployment defect.

## 2. Executive Summary of Quality

**Score: 1.2 / 10 — REPAIR_REQUIRED — release recommendation: FAIL.**

The theory-only audit already contained **41 material findings**. The full-scope pass adds **17 practice/assessment findings**, producing **58 total: P0=1, P1=48, P2=9**.

The dominant defect is the collapse of **evidence into declaration**. S40 repeatedly teaches architecture governance using key presence, booleans, integer counts, sets of field names and handwritten values. That problem becomes critical in You Do: `readiness()` consumes four editable booleans and returns `READY` without inspecting the QA scenarios, context map, C4 model or ADRs. The learner can therefore satisfy the nominal gate without satisfying the artifact contract.

The second dominant defect is **contract drift**. S40 calls its dossier “evidence/gate CP-N4-A”, while the canonical repository contract places CP-N4-A at S43 and defines a governed Python service with API validation, auth/authz, rate limits, health/readiness, non-root execution, redacted logs and migrations. S40 should contribute architecture evidence to that capstone; it should not redefine the capstone gate.

The Gradual Release sequence also loses fidelity. I Do demonstrates weak proxies; We Do repeats 24 predicate-repair exercises; You Do then asks for a dossier whose real evidence semantics were rarely modeled. Several official We Do solutions false-green cases their own prose says should fail.

## 3. Detailed Issue Registry

### S40-F42 — P1 — QA scenario contract omits `artifact`

SEI quality-attribute scenario practice uses six core parts: source, stimulus, environment, **artifact**, response and response measure. S40 consistently teaches source/stimulus/environment/response/measure/owner and never asks what system element receives the stimulus. `owner` is a useful local governance extension but is not a substitute for `artifact`.

**Learner impact:** a student can write a measurable sentence but cannot bind the requirement to the component, queue, endpoint, process or store whose architecture must satisfy it.

### S40-F43 — P0 — You Do `READY` gate is bypassable by manual booleans

`readiness()` receives a `dict[str,bool]` and returns READY when the four `REQUIRED` flags are True. It does not inspect the actual artifacts. The source comments tell the learner to set those values manually after completion, but nothing enforces that ordering. A direct counterexample with all four flags True returns `('READY', [])` while the starter ADRs can still be draft and `observed_ms` can still be `None`.

**Learner impact:** changing four booleans can substitute for architecture work. This destroys the assessment validity of the independent project.

### S40-F44 — P1 — required context map and starter disagree

Requirements explicitly demand intake / ER / relación / triage / reporting / IA. Starter rows contain only intake / er / triage / reporting. The retrospective itself asks whether relación and IA were added. Because context-map readiness is manually toggled, the missing contexts do not automatically block anything.

### S40-F45 — P1 — `adrs_accepted()` is weaker than S40’s own ADR rubric

The portfolio note says each ADR needs business context, >=2 alternatives, consequences including residual cost/risk, an operable rollback and an accepted status signed by a contactable owner. The helper checks only truthiness of `decision`, `alternatives`, `consequences`, `rollback`, plus `status == 'accepted'`; owner, approval, residual, context quality, alternative count and rollback execution are absent.

A counterexample with two ownerless ADRs, one alternative each and arbitrary truthy rollback strings returns True.

### S40-F46 — P1 — required normal/breach/uncertain acceptance paths are absent

The project requires normal, `BLOCK_ARCHITECTURE` and `REVIEW_ADR`, but starter code contains no common review function, fixtures or asserts demonstrating these routes. The most important fail-closed transfer task exists only as prose.

### S40-F47 — P1 — S40 misrepresents the CP-N4-A gate

Canonical `CP-N4-A/BRIEF.md` and `RUBRIC.json` place the gate at S43. S40 is a contributing section. The canonical acceptance is a governed Python service, not merely an architecture dossier. The S40 phrases “Evidencia de CP-N4-A” and self-check “gate CP-N4-A (mapa de arquitectura gobernado)” obscure that distinction.

### S40-F48 — P1 — visible You Do rubric drifts from both lesson evidence and capstone rubric

The S40 rubric assigns points to SLO/observability and least privilege despite these not being sufficiently modeled/scaffolded in S40. It is also structurally different from the canonical CP-N4-A rubric. A local section rubric is legitimate, but it must be labelled and aligned to S40 outcomes rather than presented beside capstone language as though it were the capstone gate rubric.

### S40-F49 — P1 — official layer-graph solution false-greens an empty graph

`all(edge not in forbidden for edge in [])` is True. Therefore S40-T2-A-E2 returns PASS and E3 can return CONTINUE for no dependency evidence, despite the retrospective explicitly saying an empty graph does not demonstrate clean layers.

### S40-F50 — P1 — residual-risk exercises accept an empty owner

T1-B E2/E3 require the `risk_owner` key but never require a usable value. `risk_owner=''`, a minimum-score selection and residual 2 obtain PASS/CONTINUE. This contradicts the outcome requiring an owner who accepts residual risk.

### S40-F51 — P1 — tactical-model adversarial field is not validated

T3-B's invalid fixture includes a negative amount, but the official predicate never reads `amount`. `amount=-999`, currency PEN, CASE-prefixed id and True flags produce PASS. Either amount is an invariant and must be checked, or it must not appear as a failure cue.

### S40-F52 — P1 — DDD disjoint vocabulary becomes an assessed misconception

The source correctly acknowledges that real bounded contexts may reuse the same word with different local meanings, yet E1/E2/E3 all require `isdisjoint`. The caveat loses to repeated scored practice. DDD needs explicit local models and mappings; token intersection is not itself a breach.

### S40-F53 — P1 — I Do models proxy evidence instead of expert evidence production

The eight demos repeatedly use key-presence validators, handwritten scores, a two-edge blacklist, `implements_port=True`, `vo_frozen=True`, `service_stateless=True`, sets of C4/ADR field names and field-set inclusion. Small demos are appropriate; self-attested controls are not. At least one observable verification per subtopic is needed.

### S40-F54 — P2 — We Do is a 24-exercise predicate-repair monoculture

Nearly every subtopic follows the same E1 comparator/predicate fix, E2 valid-invalid-missing, E3 continue-breach-request structure. This makes the interface predictable but provides too little structural variation for architecture work. Students need to generate/review architecture artifacts, not become specialists in repairing `if` statements around dicts.

### S40-F55 — P1 — self-check collides terminology around Dependency Inversion

Theory uses “inversión de dependencias (DIP)” for the correct inward dependency direction. Q5 then calls domain→framework “Invertir la dependencia”. The parenthetical direction helps, but retrieval practice should not use the same phrase for the principle and its violation.

### S40-F56 — P1 — self-check's ADR answer contradicts S40’s local ADR rubric

Q7 says decision + alternatives + consequences + rollback + accepted is the minimum acceptable ADR, omitting the context, >=2 evaluated alternatives, residual risk/cost and signed owner approval that the section itself says are required for promotion.

### S40-F57 — P1 — self-check reinforces the additive-compatibility myth

Q8 treats preservation of v1 fields plus debt owner/date as sufficient to keep the old consumer contract green. Compatibility depends on the declared extensibility/behavior policy and actual consumer contract tests; preserving fields is only one condition.

### S40-F58 — P2 — context-map relationship vocabulary is unstable

Starter uses `customer`, `supplier`, `downstream`, `consumer` as peer `relation` values. Some resemble DDD Context Mapping vocabulary, others are generic flow roles. No taxonomy or semantics explains direction, power/ownership or translation responsibility. A learner cannot tell whether these are official patterns or local labels.

## 4. Meta-Leak Report

No new learner-facing developer meta-text was confirmed. The legacy-id comment is source-only. The old multi-agent Theory playground remains a confirmed topic leak (`S40-F05`) because S40 explicitly excludes agent orchestration; it should be repaired at the shared playground mapping, not by weakening the S40 scope paragraph.

The live 20h/source 9h mismatch remains unresolved rather than promoted to a finding because the available public crawl is stale.

## 5. Pedagogical & Redaction Deep Dive

### Gradual Release

I Do is too representational: it shows what a finished metadata object looks like without sufficiently showing how evidence is obtained. We Do then trains a narrow predicate-repair grammar. You Do expects the learner to bridge the missing epistemic step independently: “How do I know this ADR is accepted?”, “How do I know an adapter satisfies the port?”, “How do I know compatibility remains green?”, “How do I know this p95 came from the claimed environment?”

This is not desirable difficulty; it is an **unmodeled prerequisite**.

### Cognitive load and progressive disclosure

The section’s prose often provides useful mental models, but the code creates competing rules. Examples: the text says empty graph is not evidence while the solution accepts it; the text says real DDD permits shared vocabulary while all three exercises grade disjointness; the text requires an owner-signed ADR while the helper never models an owner. The resulting extraneous load is not architectural complexity—it is reconciliation of contradictory instructional channels.

### Technical writing / es-PE

The strongest prose is concrete and causal. The weakest prose treats English labels (`owner`, `residual`, `downstream`, `consumer`, `accepted`) as if their local operational meaning were self-evident. Keep necessary technical English, but introduce the local contract. The DIP wording in the quiz requires immediate disambiguation.

### External benchmark comparison

- **SEI:** QA scenario requires the system artifact in addition to source/stimulus/environment/response/measure.
- **C4:** a container diagram communicates element responsibilities, technology choices and labeled relationships. A set/list of `context`/`container` names is only schema scaffolding.
- **Cockburn Ports & Adapters:** the value is isolation and replaceability/testability through adapters. A boolean or declared test count does not demonstrate this.
- **DDD/Fowler:** bounded contexts may share concepts with different local models; explicit interrelationships/mappings matter more than lexical disjointness.

## 6. Proposed GitHub-style Diffs

### Diff A — complete the QA-scenario model

```diff
@@ S40-T1-A definition / I Do / We Do / You Do
- source, stimulus, environment, response, measure/target, owner
+ source, stimulus, environment, artifact, response, response_measure
+ owner_id                     # S40 governance extension
+ benchmark_result_id          # required when an observed value is claimed
```

```diff
@@ selfCheck.Q1
- escenario QA completo con umbral y dueño
+ escenario con fuente, estímulo, entorno, artefacto, respuesta y medida;
+ S40 añade dueño y referencia de la medición para gobernarlo
```

### Diff B — remove the manual evidence bypass

```diff
@@ youDo.starterCode
-evidence = {
-  "qa_scenarios": False,
-  "context_map": False,
-  "c4_context_container": False,
-  "adrs_x2": False,
-}
-
-def readiness(bundle: dict[str, bool]):
-    missing = [name for name in REQUIRED if bundle.get(name) is not True]
+def readiness(dossier):
+    results = {
+        "qa_scenarios": validate_qa_scenarios(dossier["qa_scenarios"]),
+        "context_map": validate_context_map(dossier["context_map"]),
+        "c4_context_container": validate_c4(dossier["c4"]),
+        "adrs_x2": validate_adrs(dossier["adrs"]),
+    }
+    missing = [name for name, result in results.items() if not result.ok]
     return ("READY", []) if not missing else ("BLOCKED", missing)
```

No learner-editable boolean may be accepted as proof.

### Diff C — make the context map satisfy its own scope

```diff
@@ You Do starter
+REQUIRED_CONTEXTS = {
+    "intake", "er", "relation", "triage", "reporting", "ai_aux"
+}
 context_map = {
   "rows": [
     ...
+    {"bc": "relation", ...},
+    {"bc": "ai_aux", ...},
   ],
-  "translations": {"case": "record"},
+  "edges": [
+    {"from": "intake", "to": "er", "pattern": "customer_supplier", ...},
+    ...
+  ]
 }
```

### Diff D — enforce the local ADR rubric instead of field truthiness

```diff
@@ You Do ADR schema
 {
   "context": ...,
   "decision": ...,
-  "alternatives": [],
-  "consequences": [],
+  "alternatives": [{"name": ..., "evidence": ...}, ...],
+  "benefits": [...],
+  "residual_risks": [...],
   "rollback": ...,
-  "status": "draft"
+  "rollback_test": ...,
+  "decision_owner": ...,
+  "accepted_by": null,
+  "accepted_at": null,
+  "status": "draft"
 }
@@
-def adrs_accepted(items):
-    return len(items) >= 2 and all(... truthy fields ...)
+def validate_adr(adr):
+    # nonempty business context, >=2 alternatives, both benefit and residual,
+    # executable rollback evidence, owner + acceptance record
+    ...
```

### Diff E — implement the three required You Do paths

```diff
+def review_dossier(dossier) -> str:
+    ...
+
+assert review_dossier(normal_fixture) == "READY_FOR_ARCH_REVIEW"
+assert review_dossier(boundary_breach_fixture) == "BLOCK_ARCHITECTURE"
+assert review_dossier(uncertain_adr_fixture) == "REVIEW_ADR"
```

### Diff F — fix CP-N4-A naming

```diff
- Evidencia de CP-N4-A · mapa de arquitectura gobernado
+ Evidencia arquitectónica de S40 que contribuirá a CP-N4-A
+
+ CP-N4-A se evalúa en S43, después de integrar la evidencia de S40–S43.
```

```diff
@@ selfCheck.Q3
- ¿Cuál resultado demuestra el gate CP-N4-A (mapa de arquitectura gobernado)?
+ ¿Cuál resultado demuestra el gate incremental de arquitectura de S40 antes de continuar hacia CP-N4-A?
```

### Diff G — repair reference-solution false greens

```diff
@@ S40-T2-A-E2/E3
+if not record["dependencies"]:
+    return "REVIEW_LAYER_OWNER"
```

```diff
@@ S40-T1-B-E2/E3
+if not str(record.get("risk_owner", "")).strip():
+    return "REQUEST_RISK_OWNER"
```

```diff
@@ S40-T3-B-E2/E3
- # invalid fixture includes amount=-1 but predicate ignores it
+ # Either validate the declared amount invariant...
+and record["vo"]["amount"] >= 0
+ # ...or remove negative amount as an adversarial signal if no such invariant exists.
```

### Diff H — stop grading vocabulary disjointness as DDD

```diff
@@ S40-T3-A E1/E2/E3
-meets_contract = intake_terms.isdisjoint(er_terms) and translations.get("case") == "record"
+meets_contract = (
+    local_definitions_are_complete(contexts)
+    and relationships_are_typed(context_map)
+    and required_translations_are_explicit(context_map)
+)
```

A shared word is not automatically a breach.

### Diff I — diversify We Do

Keep selected E1 repairs, but replace at least half of E2/E3 with tasks such as:

- complete a six-part QA scenario from raw stakeholder notes;
- compare two architecture graphs and explain the coupling consequence;
- run one contract suite against two adapters;
- repair a context map with a legitimate shared term;
- review two ADRs and reject the one with weak evidence;
- execute an old consumer against candidate vNext payloads under an explicit compatibility policy.

### Diff J — repair assessment terminology

```diff
@@ selfCheck.Q5 explanation
-Invertir la dependencia (dominio → framework) acopla...
+Hacer que el dominio dependa directamente del framework acopla...
+El principio DIP busca la dirección contraria: infraestructura hacia abstracciones estables del núcleo.
```

```diff
@@ selfCheck.Q7
- decision + alternatives + consequences + rollback con status accepted
+ En la rúbrica local de S40: contexto + decisión + >=2 alternativas evaluadas
+ + consecuencias (beneficio y costo/riesgo residual) + rollback verificable
+ + aprobación del dueño.
```

```diff
@@ selfCheck.Q8
-cuando v1_fields ⊆ v11_fields ...
+cuando el cambio respeta la política pública de compatibilidad y los contract tests
+de consumidores v1 siguen verdes; conservar campos es una condición, no la prueba completa.
```

## 7. Recommended Priority Order for Fixing

1. **P0 — F43:** delete manual-evidence readiness and make the project gate derive from artifacts.
2. **P1 — F47/F48:** restore the S40-vs-CP-N4-A contract; S43 closes CP-N4-A.
3. **P1 — F44/F45/F46:** make context-map scope, ADR rubric and three acceptance paths executable.
4. **P1 — F42 + inherited F08–F11:** repair QA scenario structure and measurement provenance.
5. **P1 — F49/F50/F51:** remove false-green official solutions.
6. **P1 — F52/F55/F56/F57/F58:** repair assessed misconceptions and terminology.
7. **P1/P2 — F53/F54:** rebuild Gradual Release fidelity and task variation.
8. Then resolve the remaining inherited theory findings (figures, playground, provenance, C4, ports/adapters, compatibility, debt lifecycle) before release.

## 8. Graph Memory Update Notes

### USABLE

- S40 is an architecture-evidence contributor to CP-N4-A; **S43 is the canonical CP-N4-A gate**.
- C4 context/container are legitimate core views, but their names alone are not diagrams.
- Ports/adapters is fundamentally about isolation/substitution/testing through ports and adapters.
- Bounded contexts can share concepts; local semantics and explicit mappings matter.
- A local ADR rubric may legitimately be stricter than the minimal ADR concept if clearly attributed.

### PARTIAL

- QA scenarios: artifact + measurement provenance missing.
- Tradeoffs: actual weights/risk acceptance evidence missing.
- Dependency graphs: completeness/cycles/vocabulary missing.
- Ports/adapters: executable contract-suite evidence missing.
- Context map: full scope, typed relationships and lineage missing.
- C4/ADR: actual relationships/approval/rollback proof missing.
- API compatibility: explicit extensibility policy + contract suite missing.

### MISCONCEPTION_RISK

- Four True flags = validated dossier.
- QA scenario does not need an artifact.
- Empty dependency graph = clean architecture.
- Empty `risk_owner` = accountable owner.
- Bounded contexts require disjoint vocabulary.
- `status='accepted'` proves ADR approval.
- Field inclusion proves API compatibility.
- S40 itself proves CP-N4-A.
- “Dependency inversion” can mean domain → framework.

**This is the complete Explorer report for Section 40. Ready for the Fixer prompt.**
