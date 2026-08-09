# S26 Explorer Report — Orquestación y VP RPA + AI Analyst

**Auditor role:** Curriculum Auditor / Pedagogical Analyst / Technical Editor (STORM + Graph + Loop + Harness)  
**Platform section id:** `integrator-phase1`  
**Live URL:** https://pillb.github.io/pyarcana/#integrator-phase1  
**Source file:** `/Users/pabloillescas/Projects/PyArcana/src/lib/course/sections/s26-integrator-phase1.ts`  
**Scope of this run:** Section 26 only (no fixes applied)  
**Analysis date:** 2026-07-24  

---

## 1. Section Identification & Scope

| Field | Value |
| --- | --- |
| Index | 26 |
| Id (hash) | `integrator-phase1` |
| Title | Orquestación y VP RPA + AI Analyst |
| shortTitle (UI) | VP RPA + AI Analyst |
| Level / phase | Competente / phase 1 |
| estimatedHours | 19 |
| Role in roadmap | Cierre **CP-N2-C** del Value Proposition RPA + AI Analyst; regresión N2 (S14–S26) + CF-2 |
| Theory subtopics | T1-A DAG/estados · T1-B límites/metadata/schedules · T2-A checkpoint/retry/DLQ · T2-B idempotencia/concurrencia/rollback · T3-A colas HITL · T3-B approve/reject/edit/audit · T4-A SLO/alerts/runbook · T4-B E2E/seguridad/costo/valor |
| I Do | 8 demos (`S26-T*-*-DEMO`) |
| We Do | 24 ejercicios (8 × guided/independent/transfer) |
| You Do | Portafolio cierre CP-N2-C + notas regresión N2 |
| Self-check | 5 preguntas MCQ |
| Resources | Prefect, Airflow, SRE SLO/postmortem, 12factor, Release It!, Coursera/MIT/CS50P/deeplearning.ai |

**Corpus analyzed**

1. Full source TS object (`section26`) end-to-end: metadata, theory (9 blocks), iDo, weDo, youDo, selfCheck, resources.  
2. Live site catalog entry for Sección 26 (tagline, hours, level) at https://pillb.github.io/pyarcana/ — SPA hash `#integrator-phase1` loads the same curriculum object.  
3. Comparative anchors: S01 (`s01-setup.ts`) as early gold narrative; S13 as prior level-closer; S25 as immediate predecessor on CP-N2-C AI assist.  
4. Automated `S26_AUDIT.json` (ACCEPT, 0 high issues, boilerplate-focused) used only as secondary signal, not as substitute for pedagogical audit.  
5. Pre-round pedagogy: Gradual Release of Responsibility (I/We/You Do) and Cognitive Load Theory (worked examples → completion → independent; simple-to-complex sequencing).

**Out of scope:** editing product TS, Fixer application, other sections except comparative references.

---

## 2. Executive Summary of Quality

### Score: **6.2 / 10**

### Verdict

S26 **acierta el contrato de producto y de seguridad** del cierre N2: pipeline sintético Excel/sistema → validación → análisis → IA → informe → approve → draft, con **cero auto-fraude**, **cero envío sin approve**, HITL triple, DLQ/checkpoint, SLO P0 y notas de regresión N2/CF-2. El orden pedagógico declarado T1→T4 es coherente con el job del VP y con S25 (AI assist) + S22 (email/aprobación).

Sin embargo, como **sección de cierre de nivel (19 h, Competente)**, la fidelidad I Do / We Do / You Do es **débil frente al gold de S01 y a lo que exige un capstone de orquestación**:

- Los **I Do** son micro-funciones sin “thinking aloud” ni pipeline ejecutable de punta a punta.  
- Los **We Do** son en su mayoría `print` / `if` de una línea; el “transfer” (`ver += 1`, imprimir una lista fija) no transfiere orquestación real.  
- Hay **inconsistencias de contrato de pipeline** (`ai_assist` vs omitido; `ai` vs `ai_assist`; `draft` vs `draft_email`; E2E de 3 steps vs path canónico de 7).  
- Hay **meta-leaks** de versionado curricular (legacy id / path V3 / “otra lane” / gate V3) visibles al estudiante.  
- **8/8 demos I Do** imprimen `ok True` pero el `output` declarado **no lo incluye** → desalineación código↔salida en UI.  
- Estilo **telegráfico y cargado de jerga** sin diccionario progresivo (contraste fuerte con S01).

**Promoción de calidad esperada post-Fixer:** 8.0–8.5 si se unifica el DAG canónico, se endurecen I Do/We Do al nivel Competente, se eliminan meta-leaks y se reescriben hints/feedback útiles en es-PE.

| Dimensión | Nota (1–10) | Comentario breve |
| --- | --- | --- |
| Meta-text / leakage | 5.5 | Varios leaks V3/legacy/lane; DEFECT en starters es patrón intencional del curso |
| Gramática / redacción es-PE | 6.5 | Correcto en general; anglicismos densos; headings en minúscula |
| Connective tissue | 6.0 | Buen mapa T1–T4 al inicio; puentes entre subtemas delgados |
| Pedagogía I/We/You | 5.5 | Estructura presente; profundidad y gradual release insuficientes |
| Carga cognitiva / progressive disclosure | 5.5 | Teoría densa + ejercicios triviales = desajuste |
| Ejercicios / exam | 5.5 | 24 ítems alineados temáticamente; trivialidad y quiz duplicado |
| Consistencia roadmap | 7.0 | Rol N2-C/CF-2 claro; naming de steps inconsistente |
| Comparación externa | 6.5 | Buenas refs Prefect/Airflow/SRE; labs no se acercan a “flow real” |
| Dominio (ops/HITL/safety) | 8.0 | Políticas de control excelentes y repetidas de forma coherente |

---

## 3. Detailed Issue Registry

Severidad: **P0** bloquea aprendizaje o contradice el contrato del VP · **P1** alto impacto pedagógico/consistencia · **P2** medio · **P3** polish.

### Issue 1 — Meta-leak de versionado en `jobRelevance` (P1)

- **Dimensión:** Meta-text / developer leakage  
- **Ubicación:** `jobRelevance` (línea ~15)  
- **Evidencia:**  
  > «Id legacy `integrator-phase1` se conserva; el path V3 es orquestación del VP RPA + AI Analyst.»  
- **Impacto:** El estudiante ve jerga de migración de curriculum (legacy id, path V3) sin valor de aprendizaje. Contamina la motivación laboral del VP.  
- **Graph edge:** `jobRelevance` → confusión de identidad de sección (UI id vs título pedagógico).

### Issue 2 — Meta-leak de autoría/grading en `youDo.portfolioNote` (P1)

- **Dimensión:** Meta-text  
- **Ubicación:** `youDo.portfolioNote`  
- **Evidencia:**  
  > «Otra lane califica PASS; no editar checkpoint/ledger desde autoría de contenido.»  
- **Impacto:** Instrucción interna de pipeline de contenido/grading expuesta al usuario. Rompe la cuarta pared del curso autónomo.  
- **Nota:** Patrón presente en otras secciones; sigue siendo leak en S26.

### Issue 3 — Meta-referencias “gate V3” / “roadmap V3” en rúbrica y self-check (P2)

- **Dimensión:** Meta-text  
- **Ubicaciones:**  
  - `youDo.rubric[0]`: «Alineación al gate V3 de la sección»  
  - `selfCheck` Q2 explanation: «Definición de regresión de nivel en el roadmap V3.»  
- **Impacto:** “V3” es versión de diseño del curso, no concepto de orquestación. El estudiante no tiene glosario de “gate V3”.

### Issue 4 — Path canónico del DAG inconsistente entre teoría, I Do, E2E y You Do (P0)

- **Dimensión:** Consistency / domain contract  
- **Evidencia:**

| Superficie | Steps |
| --- | --- |
| Theory `topo` / T1-A | `ingest → validate → analyze → ai_assist → report → approve → draft_email` (7) |
| I Do T1-A | omite `ai_assist` → 6 steps |
| Theory T4-B `e2e_vp` | `["ingest","validate","analyze","ai","report","approve","draft"]` (nombres distintos) |
| We Do T1-A-E1 | path “parcial” de 4 sin AI/email (OK si se declara; confunde sin ancla visual al full path) |
| We Do T4-B-E1 | `['ingest','validate','draft']` — salta validate→…→approve |
| You Do `STEPS` | 7 canónicos con `ai_assist` / `draft_email` |

- **Impacto:** En un cierre de VP, el **contrato de orden** es el aprendizaje central. Variantes silenciosas generan regresión conceptual y fallos al defender el capstone.  
- **Pedagogía:** Violación de progressive disclosure *coherente*: se introduce un grafo y luego se reescribe sin justificación explícita de “vista parcial”.

### Issue 5 — I Do: outputs no coinciden con el código (`print("ok", True)`) (P1)

- **Dimensión:** Exercise quality / technical writing of demos  
- **Ubicación:** Los 8 bloques `iDo.steps[*].code`  
- **Evidencia:** Todos ejecutan `print("ok", True)` al final; **ningún** `output` incluye la línea `ok True`. Ejemplo T1-A:

```text
code prints: order, n_steps, ok True
output shows: order, n_steps   # falta ok True
```

- **Impacto:** Si el runtime del playground valida o muestra “salida esperada”, el estudiante ve mismatch permanente. Daña confianza en el material (“a mí me da una línea más”).

### Issue 6 — I Do demasiado delgado para “Yo hago” en cierre N2 (P1)

- **Dimensión:** Pedagogical structure (I Do fidelity)  
- **Evidencia:** Demos de 3–8 líneas que no modelan un run con estados, ni unen T1–T4, ni narran decisión/error. `why` es un eslogan (“El orden del VP es el contrato del flow.”).  
- **Impacto (GRR / worked example):** El I Do debería ser un **worked example** completo del pipeline con thinking aloud. Aquí el estudiante observa micro-snippets y salta a 24 ejercicios triviales o a un You Do grande → “sudden release”, no gradual.  
- **Comparación S01:** S01 define diccionario, motiva, demuestra verificación de intérprete con contexto de error real.

### Issue 7 — We Do trivial para nivel Competente / 19 h (P1)

- **Dimensión:** Cognitive load / exercise quality  
- **Evidencias representativas:**  
  - T1-B-E1: `print(m['run_id'])`  
  - T3-B-E3 (transfer): `ver += 1; print(ver)`  
  - T3-A-E3 (transfer): `print(['metrics','narrative','recipient'])`  
  - T4-A-E3: `print('disable_schedule -> drain -> page')`  
- **Impacto:** Intrinsic load de la teoría (DAG + resiliencia + HITL + SRE + regresión) **no** se practica en We Do. El learner puede “pasar” sin poder orquestar. Desalinea estimatedHours=19 y learning outcomes (“Implementar checkpoints…”, “Operar aprobación…”).  
- **CLT:** Tras worked examples se esperan *completion problems* parciales, no re-prints de constantes.

### Issue 8 — Hints / feedback / tests boilerplate idénticos (P2)

- **Dimensión:** Redaction / pedagogy  
- **Evidencia:** En los 24 ejercicios, `hints` ≈  
  `["contrato I/O en instruction", "compara output con solution", "datos sintéticos only"]`  
  `feedback` ≈ «Compara tu salida con la solución.»  
  `tests` ≈ «salida coincide con solution output»  
- **Impacto:** Hints no guían el concepto (backoff, membership de ckpt, any-pending). “datos sintéticos only” es política global, no hint. Feedback no remedia el error del DEFECT del starter.

### Issue 9 — Self-check: pregunta duplicada approve/draft (P2)

- **Dimensión:** Exam quality  
- **Evidencia:**  
  - Q1: «El orden draft_email respecto a approve es:» → approve antes  
  - Q5: «draft_email respecto a approve en el VP debe…» → solo después de approve con audit  
- **Impacto:** Reduce cobertura del quiz (5 ítems ya son pocos para 8 subtemas). No evalúa DLQ, idempotencia, SLO runbook, metadata inmutable, ni regresión N2 con profundidad.

### Issue 10 — Teoría vs código: retry/backoff no aparece en `process_with_dlq` (P2)

- **Dimensión:** Domain clarity / theory–code alignment  
- **Evidencia:** T2-A promesa de retry exponencial + DLQ tras agotar; el lab solo mueve `flaky_ids` a DLQ sin attempts. `backoff_sleep_ms` se imprime aparte, desconectado del loop.  
- **Impacto:** El estudiante puede creer que “flaky ⇒ DLQ inmediato” es la política, contradiciendo el párrafo de retry.

### Issue 11 — Teoría vs código: rollback borra report, prosa dice “superseded” (P2)

- **Dimensión:** Domain consistency  
- **Evidencia:**  
  - Prosa T2-B: si falla draft tras report → borrar draft y marcar report `superseded`.  
  - `rollback()`: `pop` de **drafts y reports**.  
  - I Do T2-B: solo quita `draft` (mejor alineado a compensación parcial).  
- **Impacto:** Tres semánticas de compensación en la misma sección.

### Issue 12 — Naming de alertas SLO inconsistente (P3)

- **Dimensión:** Consistency  
- **Evidencia:** Prosa «`alert_success_rate`»; código theory `success_rate_low`; I Do `alert_success_rate`; We Do `alert`.  
- **Impacto:** Bajo, pero en ops el nombre de la alerta es contrato de runbook.

### Issue 13 — Typo en starter You Do: `evidenciace` (P3)

- **Dimensión:** Grammar / redaction  
- **Ubicación:** `youDo.starterCode` comment  
- **Evidencia:** `# ... e2e evidenciace, n2 regression notes`  
- **Fix lexical:** `evidencia`.

### Issue 14 — Headings de teoría en minúscula y sin anclaje narrativo (P3)

- **Dimensión:** Redaction / connective tissue  
- **Evidencia:** «límites, metadata y schedules», «checkpoints, retry/backoff y dead-letter», «revisión de análisis/reporte/destinatario»…  
- **Impacto:** Frente a S01 (“El intérprete Python y el REPL”), se siente checklist de syllabus, no lección. Menos scannable y menos “sección de cierre memorable”.

### Issue 15 — jobRelevance denso sin progressive disclosure de términos (P2)

- **Dimensión:** Connective tissue / cognitive load  
- **Evidencia:** Un solo párrafo empaqueta CP-N2-C, regresión N2, auto-fraude, approve, legacy id, path V3.  
- **Comparación S01:** Define entorno, venv, Git, PR con ejemplos PE y diccionario.  
- **Impacto:** El estudiante que llega desde S25 no recibe un “puente emocional/operativo” al cierre; recibe un checklist de gates.

### Issue 16 — Mezcla es-PE / anglicismos sin glosa en momentos clave (P3)

- **Dimensión:** Grammatical correctness / accessibility (es-PE)  
- **Evidencia:** «pages on-call», «fail-closed», «must-match», «burst», «drain», «owner/SLA» sin micro-glosa en el primer uso de la sección.  
- **Impacto:** Aceptable en Competente si se glosa una vez; aquí se asume dominio de jerga SRE/RPA. Para audiencia LATAM del curso, conviene 1 frase de diccionario al inicio de T2/T4.

### Issue 17 — We Do T4-B-E1 E2E incompleto como “E2E del cierre” (P2)

- **Dimensión:** Exercise–theory alignment  
- **Evidencia:** steps solo `ingest, validate, draft` con all success → enseña `all(...)` pero **no** el path ni el gate de approve.  
- **Impacto:** El nombre “E2E sintético” en instrucción sobrevende el ejercicio y debilita el mensaje “draft solo tras approve”.

### Issue 18 — I Do T4-B `n2_regression: "planned"` vs cierre “pass” (P3)

- **Dimensión:** Motivation / honesty of demo  
- **Evidencia:** Demo de cierre imprime regresión como `"planned"` mientras e2e es `"pass"`.  
- **Impacto:** Envía señal de que la regresión N2 es opcional/planificada, no evidencia del cierre. You Do y theory exigen re-run real.

### Issue 19 — Ausencia de un I Do o theory lab “runner” de estados end-to-end (P1)

- **Dimensión:** Pedagogy / domain  
- **Evidencia:** Nunca se muestra un dict `state` avanzando nodo a nodo con `run_id`, fallo, resume y HITL block en **una** demo cohesiva. You Do starter solo imprime STEPS.  
- **Impacto:** El outcome “Modelar tasks/flows/DAG con estados” queda en abstracto. External materials (Prefect flows, Airflow DAG runs) siempre muestran un run lifecycle.

### Issue 20 — Rubric genérica + bonus checklist poco operable (P3)

- **Dimensión:** You Do quality  
- **Evidencia:** Criterios 25/20/20/15/10/10 genéricos del template V3; bonus “Notas de regresión N2 y CF-2” sin rúbrica de qué debe contener la nota.  
- **Impacto:** Portafolio difícil de autoevaluar; no lista artefactos mínimos (manifest de estados, audit log sample, cost line, privacy note).

---

## 4. Meta-Leak Report

| # | Exact leaked / internal text | Location | Classification | Student-facing harm |
| --- | --- | --- | --- | --- |
| M1 | `Id legacy \`integrator-phase1\` se conserva; el path V3 es orquestación del VP RPA + AI Analyst.` | `jobRelevance` | Curriculum versioning / migration note | Confunde id de plataforma con aprendizaje |
| M2 | `Otra lane califica PASS; no editar checkpoint/ledger desde autoría de contenido.` | `youDo.portfolioNote` | Authoring / grading pipeline instruction | Rompe cuarta pared; irrelevante para el learner |
| M3 | `Alineación al gate V3 de la sección` | `youDo.rubric[0].criterion` | Internal gate naming | “V3” no definido en la lección |
| M4 | `Definición de regresión de nivel en el roadmap V3.` | `selfCheck` Q2 `explanation` | Internal roadmap version | Mismo problema |
| M5 | `# DEFECT: …` en todos los starters We Do | `weDo.steps[*].starterCode` | Authoring scaffold (intentional pattern) | **Borderline:** útil como “código roto a reparar” si se explica; hoy no se glosa “DEFECT” en intro We Do de S26 |
| M6 | Hints `contrato I/O en instruction` / `datos sintéticos only` | `weDo.hints` | Author checklist language | Suena a rúbrica de generador, no a pista de aprendizaje |

**Meta-leak count (clear user-facing internal voice):** **4** (M1–M4).  
M5–M6 se reportan como **pattern leaks / scaffolding smell** (recomendados de glosar o reescribir, no necesariamente borrar el patrón DEFECT del curso).

**No se halló:** comentarios del tipo “moved from section X”, “TODO fix later”, instrucciones a un modelo, o English developer notes largas fuera de los strings de código.

---

## 5. Pedagogical & Redaction Deep Dive

### 5.1 Pre-round research (aplicado)

- **Gradual Release (I/We/You):** el mentor modela con thinking aloud → práctica guiada con andamiaje → independencia.  
- **CLT:** limitar element interactivity; worked examples; completion problems; simple-to-complex.  
- **Capstone closer:** debe re-integrar skills previos (S14–S25) con evidencia, no solo listar keywords.

### 5.2 I Do / We Do / You Do fidelity

| Fase | Estado en S26 | Hallazgo |
| --- | --- | --- |
| Theory | Presente, 4 temas × 2 | Buen mapa; densidad alta; poco diccionario |
| I Do | 8 demos 1:1 subtopic | Forma correcta; sustancia de worked example insuficiente |
| We Do | 24 = guided/indep/transfer | Estructura de kinds correcta; **contenido** no escala en challenge |
| You Do | Portafolio CP-N2-C | Objetivos/requirements buenos; starter y rúbrica flojos |
| Self-check | 5 MCQ | Active recall mínimo; solapamiento Q1/Q5 |

**Connective tissue:** El primer bloque (“Cierre CP-N2-C…”) hace bien el “por qué esta sección” y el orden T1–T4. Faltan frases puente del tipo “Acabas de fijar el DAG; ahora sin límites el schedule tumba el export” entre T1-A y T1-B, y “Con el path estable, el crash a mitad de analyze exige checkpoint” hacia T2.

**Progressive disclosure:** Se declara stack didáctico sin Prefect/Airflow instalado (bien). Pero se introduce jargon HITL/DLQ/SLO/CF-2/CP-N2-* en ráfaga. Los ejercicios no construyen un mini-orquestador incremental (nodos → edges → runner → resume → HITL → draft).

### 5.3 Cognitive load profile

- **Intrinsic:** Alto (orquestación + resiliencia + HITL + SRE + governance de fraude/email + regresión de nivel).  
- **Extraneous:** Meta V3/legacy, naming drift del DAG, outputs incorrectos, hints boilerplate.  
- **Germane:** Bajo-medio: las ideas de control (triple gate, P0 unapproved send, fraud_labels=0) se repiten bien y son el mejor aprendizaje de la sección.

**Desajuste principal:** teoría high-intrinsic + práctica low-challenge → ilusión de maestría o abandono por aburrimiento en We Do y pánico en You Do.

### 5.4 Safety / ethics / PE localization (fortalezas)

- Casos San Isidro / Lima / America/Lima bien situados.  
- Datos sintéticos y prohibición de RUC/nombres reales.  
- Matching/score ≠ fraude; draft ≠ send; audit append-only; reject con reason.  
- Mensaje de regresión N2 y CF-2 alineado con el roadmap de promoción.

Estas fortalezas sostienen gran parte del score y deben preservarse en cualquier fix.

### 5.5 Redaction (es-PE)

- Ortografía general correcta; un typo claro (`evidenciace`).  
- Tono profesional pero seco; pierde la voz didáctica cálida de S01.  
- Anglicismos de ops aceptables si se glosan.  
- Callouts (tip/info/warning/danger) bien usados; el danger de P0 unapproved send es ejemplar.

### 5.6 Comparison — early gold (S01) & external

| Criterio | S01 gold | S26 actual | Gap |
| --- | --- | --- | --- |
| Diccionario de sección | Explícito | Ausente | Alto |
| Motivación laboral situada | Narrativa rica | Checklist de gates | Medio |
| Worked example | Paso a paso | Micro-snippets | Alto |
| We Do challenge curve | Gradual | Plana/trivial | Alto |
| Identidad de sección | Clara | Legacy id leak | Medio |

**Externos (Prefect docs, Airflow concepts, Google SRE SLO workbook):** S26 cita bien las fuentes en `resources`, pero el lab no demuestra un flow run con estados observables de punta a punta — el diferencial que esas fuentes enseñan de inmediato.

### 5.7 Alignment with previous sections (S25 → S26)

- S25 entrega AI assist evaluado; S26 debe **orquestarlo** en el VP. El step `ai_assist` en teoría/You Do lo refleja; su **omisión en I Do T1-A** debilita el handoff S25→S26.  
- Controles anti-fraude y anti-auto-send son consistentes con S22–S25 — fortaleza de grafo curricular.

### 5.8 Automated audit cross-check

`S26_AUDIT.json`: verdict ACCEPT, `high_issue_count: 0`, focus en boilerplate de párrafos visibles. **No contradice** este Explorer: el auditor automático no mide GRR, naming de DAG ni meta-leaks de rúbrica. Explorer = capa pedagógica más estricta.

---

## 6. Proposed GitHub-style Diffs

> Diffs **propuestos** para el Fixer; **no aplicados** en este run. Paths relativos al repo.

### Diff A — Issue 1: limpiar `jobRelevance` (meta-leak)

```diff
--- a/src/lib/course/sections/s26-integrator-phase1.ts
+++ b/src/lib/course/sections/s26-integrator-phase1.ts
@@
-  jobRelevance:
-    "Cierras **CP-N2-C** orquestando Excel/sistema → validación → análisis → IA → informe → aprobación → borrador de correo, con regresión N2 y costo acotado. Sin auto-fraude ni envío sin approve. Id legacy `integrator-phase1` se conserva; el path V3 es orquestación del VP RPA + AI Analyst.",
+  jobRelevance:
+    "Cierras **CP-N2-C** orquestando el Value Proposition **RPA + AI Analyst**: Excel/sistema → validación → análisis → IA asistida → informe → aprobación humana → borrador de correo. En un escritorio de operaciones (p. ej. Lima) demuestras evidencia por estado, recuperación ante fallas, regresión N2 reproducible y costo acotado. Sin auto-fraude ni envío sin approve registrado en audit.",
```

### Diff B — Issues 2–3: portfolioNote + rúbrica + self-check sin “lane/V3”

```diff
--- a/src/lib/course/sections/s26-integrator-phase1.ts
+++ b/src/lib/course/sections/s26-integrator-phase1.ts
@@
-    portfolioNote:
-      "Paquete de cierre CP-N2-C: pipeline con evidencia, HITL y draft sandbox. Incluye sección de **regresión N2** (S14–S26) y **CF-2**. Otra lane califica PASS; no editar checkpoint/ledger desde autoría de contenido.",
+    portfolioNote:
+      "Paquete de cierre CP-N2-C para portafolio: pipeline con evidencia por estado, HITL triple, draft en sandbox y sección explícita de **regresión N2** (S14–S26) más contratos **CF-2** (Familiarity ↔ reporting ↔ automatización). Documenta límites: datos sintéticos, fraud_labels=0 y cero envíos reales.",
@@
-      { criterion: "Alineación al gate V3 de la sección", weight: "25%" },
+      { criterion: "Cobertura del pipeline VP y de los criterios de cierre CP-N2-C", weight: "25%" },
@@
-          "Definición de regresión de nivel en el roadmap V3.",
+          "La regresión N2 revalida tests críticos de capstones, E2E del tramo y controles de privacidad/seguridad.",
```

### Diff C — Issue 4 + 19: unificar path canónico en I Do T1-A y theory E2E

```diff
--- a/src/lib/course/sections/s26-integrator-phase1.ts
+++ b/src/lib/course/sections/s26-integrator-phase1.ts
@@ iDo T1-A
-    return ["ingest", "validate", "analyze", "report", "approve", "draft_email"]
+    return ["ingest", "validate", "analyze", "ai_assist", "report", "approve", "draft_email"]
@@
-          output: `['ingest', 'validate', 'analyze', 'report', 'approve', 'draft_email']
-n_steps 6`,
+          output: `['ingest', 'validate', 'analyze', 'ai_assist', 'report', 'approve', 'draft_email']
+n_steps 7
+ok True`,
@@ e2e_vp steps
-    steps = ["ingest", "validate", "analyze", "ai", "report", "approve", "draft"]
+    steps = ["ingest", "validate", "analyze", "ai_assist", "report", "approve", "draft_email"]
```

*(Ajustar prints de `e2e_vp` que indexan `ev["draft"]` → `ev["draft_email"]`.)*

### Diff D — Issue 5: alinear outputs I Do con `print("ok", True)`

Para **cada** demo I Do, añadir la línea final `ok True` al string `output`, p.ej.:

```diff
-          output: `{'run_id': 'r1', 'api_rpm': 30, 'tz': 'America/Lima'}`,
+          output: `{'run_id': 'r1', 'api_rpm': 30, 'tz': 'America/Lima'}
+ok True`,
```

(Repetir en T2-A, T2-B, T3-A, T3-B, T4-A, T4-B y T1-A como en Diff C.)

### Diff E — Issue 6 + 19: I Do cohesivo mínimo (sketch de runner)

Sustituir o ampliar al menos **una** demo (recomendado T4-B o nuevo paso final) con un mini-runner:

```python
STEPS = ["ingest", "validate", "analyze", "ai_assist", "report", "approve", "draft_email"]

def run_vp(fail_at=None):
    state, audit = {s: "pending" for s in STEPS}, []
    for s in STEPS:
        if fail_at == s:
            state[s] = "failed"
            break
        if s == "draft_email" and not any(a["action"] == "approve" for a in audit):
            state[s] = "blocked"
            break
        state[s] = "success"
        if s == "approve":
            audit.append({"action": "approve", "actor": "r1"})
    return state, audit

st, au = run_vp()
print([st[s] for s in STEPS])
print("audit", len(au), "fraud_labels", 0)
print("ok", True)
```

### Diff F — Issue 7 + 8: elevar un ejercicio transfer y hints (ejemplo T2-A-E3 ya decente; T3-B-E3 no)

```diff
--- a/src/lib/course/sections/s26-integrator-phase1.ts
+++ b/src/lib/course/sections/s26-integrator-phase1.ts
@@ S26-T3-B-E3
-        instruction:
-          "Edit versiona artefacto del informe sintético: partiendo de ver=1, al editar incrementa a 2 e imprime ver. ...",
+        instruction:
+          "Edit con audit append-only: parte de ver=1 y audit=[]. Al editar, incrementa ver y append {'action':'edit','actor':'ana','from':1,'to':2}. Imprime (ver, len(audit), audit[-1]['action']). Contrato: no borrar eventos previos. Pass: (2, 1, 'edit').",
@@
-        hints: [
-          "contrato I/O en instruction",
-          "compara output con solution",
-          "datos sintéticos only",
-        ],
+        hints: [
+          "Primero ver += 1; luego audit.append(...).",
+          "Usa las claves action/actor/from/to del contrato.",
+          "len(audit) debe ser 1 tras un solo edit.",
+        ],
+        feedback: "El versionado sin evento de audit no es defendible en CP-N2-C.",
```

*(Aplicar el mismo patrón de hints específicos a los 24 ítems en el pass del Fixer; no se listan todos aquí por brevedad, pero Issue 8 exige el barrido completo.)*

### Diff G — Issue 9: reemplazar Q5 duplicada

```diff
-      {
-        question: "draft_email respecto a approve en el VP debe…",
-        options: ["enviarse antes de approve para ahorrar tiempo", "ejecutarse solo después de approve humano con audit", "omitir audit si el SLO está en verde", "etiquetar fraude si el análisis tiene score alto"],
-        correctIndex: 1,
-        explanation:
-          "Aprobación humana precede el borrador/envío; fraud_labels=0 y audit son parte del gate CP-N2-C.",
-      }
+      {
+        question: "Un item agota reintentos de timeout de export. ¿Dónde debe quedar y con qué atributo mínimo?",
+        options: [
+          "Reinyectado en success sin registro",
+          "En DLQ con owner y razón (p. ej. timeout_exhausted)",
+          "Marcado fraud_labels=1 automáticamente",
+          "Borrado del checkpoint para rehacer todo el batch",
+        ],
+        correctIndex: 1,
+        explanation:
+          "DLQ no es basurero: conserva el item con owner/SLA; no se convierte en fraude ni se pierde sin rastro.",
+      }
```

### Diff H — Issues 10–11: alinear labs de resiliencia

```diff
@@ process_with_dlq (teoría T2-A) — sketch
 def process_with_dlq(items, flaky_ids, max_attempts=3):
     ok, dlq, ckpt = [], [], set()
     for it in items:
         if it in ckpt:
             continue
         attempts = 0
         while attempts < max_attempts:
             attempts += 1
             if it not in flaky_ids or attempts == max_attempts and it in flaky_ids:
                 # flaky siempre falla: tras max_attempts → DLQ
                 if it in flaky_ids:
                     dlq.append({"id": it, "reason": "timeout_exhausted", "owner": "ops_rpa"})
                 else:
                     ok.append(it); ckpt.add(it)
                 break
     return ok, dlq, sorted(ckpt)
@@ rollback
 def rollback(run_id):
     store["drafts"].pop(run_id, None)
-    store["reports"].pop(run_id, None)
+    if run_id in store["reports"]:
+        store["reports"][run_id] = {"status": "superseded"}
```

### Diff I — Issue 12 + 17: nombres de alert y E2E We Do

```diff
@@ theory alerts
-        out.append("success_rate_low")
+        out.append("alert_success_rate")
@@ S26-T4-B-E1 instruction/code
-          "E2E sintético: steps=['ingest','validate','draft'] ...
+          "Gate E2E mínimo del path: steps canónicos hasta draft_email; status success en todos **y** audit con approve. Imprime True solo si ambas condiciones se cumplen. ..."
```

### Diff J — Issue 13: typo starter You Do

```diff
-# Orden: path canónico, HITL gates, draft tras approve, e2e evidenciace, n2 regression notes
+# Orden: path canónico, HITL gates, draft tras approve, e2e evidencia, n2 regression notes
```

### Diff K — Issue 14 + 16: headings y micro-glosa (ejemplo T2-A heading + primer párrafo)

```diff
-      heading: "checkpoints, retry/backoff y dead-letter",
+      heading: "Checkpoints, reintentos con backoff y dead-letter (DLQ)",
@@
+        "Glosa rápida: **checkpoint** = marca de progreso persistida; **backoff** = espera creciente entre reintentos; **DLQ (dead-letter queue)** = cola de ítems que agotaron reintentos y requieren dueño humano.",
```

### Diff L — Issue 18: demo T4-B regresión honesta

```diff
-        "n2_regression": "planned",
+        "n2_regression": "pass",
```

### Diff M — Issue 20: rúbrica operable (bonus)

```diff
-      { criterion: "Notas de regresión N2 y CF-2 presentes y accionables", weight: "bonus checklist" },
+      { criterion: "Notas de regresión N2 y CF-2 con: lista de tests re-ejecutados, resultado, y interfaces CF-2 verificadas", weight: "bonus checklist" },
```

### Diff N — We Do intro: glosar DEFECT (Issue M5)

```diff
-    intro: "24 ejercicios de DAG, limits, checkpoint/DLQ, rollback, colas HITL, audit, SLO y E2E/regresión.",
+    intro: "24 ejercicios de DAG, limits, checkpoint/DLQ, rollback, colas HITL, audit, SLO y E2E/regresión. Cada starter trae un **DEFECT** (fallo intencional) marcado en un comentario: tu trabajo es corregirlo hasta igualar el output de la solución.",
```

---

## 7. Recommended Priority Order for Fixing

| Priority | Issues | Rationale |
| --- | --- | --- |
| **1 — P0 contrato** | #4, #19 (Diff C, E) | Sin path canónico único, el VP no es enseñable ni defendible |
| **2 — P1 trust en demos** | #5 (Diff D) | Mismatch output/código en 8/8 I Do es regresión de confianza inmediata |
| **3 — P1 meta-leaks** | #1, #2, #3 (Diff A, B) | Texto de desarrollador en superficie de estudiante |
| **4 — P1 pedagogía** | #6, #7, #8 (Diff E, F, N) | Cierre de nivel no puede vivir de `print` de constantes |
| **5 — P2 domain alignment** | #10, #11, #12, #17 (Diff H, I) | Resiliencia y E2E deben coincidir con la prosa |
| **6 — P2 assessment** | #9, #18, #20 (Diff G, L, M) | Quiz y rúbrica deben cubrir el grafo de skills |
| **7 — P3 polish** | #13, #14, #15, #16 (Diff J, K + reescritura jobRelevance ya en A) | Redacción es-PE y scannability |

**No tocar sin necesidad:** callouts de seguridad (P0 unapproved send, fraud_labels=0, triple gate), resources externos, learning outcomes (salvo si se renombran steps), estructura 8 subtopics × 3 kinds.

---

## 8. Graph Memory Update Notes

Para archivos compartidos de contexto curricular / hardening:

```yaml
section: 26
id: integrator-phase1
title: Orquestación y VP RPA + AI Analyst
role: CP-N2-C closer + N2 regression + CF-2 notes
score_explorer: 6.2
status_explorer: complete
strengths:
  - safety_controls: [no_auto_fraud, no_send_without_approve, hitl_triple, audit_append_only]
  - topic_map: [T1_orchestration, T2_resilience, T3_hitl, T4_ops_e2e]
  - pe_localization: [America/Lima, San_Isidro_limits, synthetic_only]
  - resources: [Prefect, Airflow, SRE_SLO, Release_It]
p0_contract:
  canonical_dag: [ingest, validate, analyze, ai_assist, report, approve, draft_email]
  naming_debt: [ai_vs_ai_assist, draft_vs_draft_email, iDo_missing_ai_assist]
meta_leaks:
  - jobRelevance_legacy_V3
  - portfolioNote_other_lane_ledger
  - rubric_gate_V3
  - selfCheck_roadmap_V3
pedagogy_debt:
  - iDo_too_thin_for_capstone
  - weDo_trivial_vs_19h_Competente
  - boilerplate_hints_feedback_tests
  - selfCheck_duplicate_approve_draft
  - iDo_output_missing_ok_True_x8
theory_code_mismatches:
  - retry_promised_but_not_in_process_with_dlq
  - rollback_deletes_report_vs_superseded_prose
  - alert_name_alert_success_rate_vs_success_rate_low
edges:
  prev: S25_ai_assist_handoff
  next: S27_pytest_contracts_N3_start
  regression_span: S14-S26
  cf: CF-2
fixer_entrypoints:
  - src/lib/course/sections/s26-integrator-phase1.ts
do_not_regress:
  - fraud_labels_must_be_zero_messaging
  - P0_unapproved_send
  - triple_queue_block_before_draft_email
```

**Comparative memory:** S26 is **policy-strong, pedagogy-compressed**. Treat as “integrator closer template” that needs the same narrative oxygen as S01/S13 closers, not only gate keywords.

---

This is the complete Explorer report for Section 26. Ready for the Fixer prompt.
