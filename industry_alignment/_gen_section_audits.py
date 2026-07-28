#!/usr/bin/env python3
"""Generate 52 per-section audit summaries (S01.md ... S52.md) for Phase 5."""
import json
import os
from collections import defaultdict

BASE = '/home/z/my-project/pyarcana_repo/industry_alignment'
OUT_DIR = f'{BASE}/section_audits'
os.makedirs(OUT_DIR, exist_ok=True)

with open(f'{BASE}/curriculum_skill_graph.json') as f:
    cur = json.load(f)
with open(f'{BASE}/curriculum_gap_matrix.json') as f:
    gap = json.load(f)
with open(f'{BASE}/industry_skill_graph.json') as f:
    ind = json.load(f)

# Build skill-name lookup
SKILL_NAME = {n['skill_id']: n['name'] for n in ind['skill_nodes']}
SKILL_CAT = {n['skill_id']: n['category'] for n in ind['skill_nodes']}
CRIT_COMPS_BY_SKILL = defaultdict(list)
for cc in ind['critical_competencies']:
    for sid in cc['skill_ids']:
        CRIT_COMPS_BY_SKILL[sid].append(cc['competency_id'])

# Build per-section skill inventory
section_data = {}
for sec in cur['sections']:
    snum = sec['sectionNumber']
    sid = sec['sectionId']
    acts = [a for a in cur['activities'] if a.get('section_id') == f'S{snum:02d}']
    by_type = defaultdict(int)
    cred_elig = 0
    skills = defaultdict(int)
    cred_skills = set()
    for a in acts:
        by_type[a['activity_type']] += 1
        if a.get('credential_eligible'):
            cred_elig += 1
            for sk in a.get('skill_nodes') or []:
                cred_skills.add(sk)
        for sk in a.get('skill_nodes') or []:
            skills[sk] += 1
    section_data[snum] = {
        'sectionId': sid,
        'shortTitle': sec.get('shortTitle', ''),
        'title': sec['title'],
        'phase': sec['phase'],
        'hours': sec['estimatedHours'],
        'level': sec['level'],
        'tagline': sec.get('tagline', ''),
        'filePath': sec.get('filePath', ''),
        'sourceLines': sec.get('sourceLines', 0),
        'learningOutcomes': sec.get('learningOutcomes', {}).get('count', 0),
        'capstones': sec.get('youDo', {}).get('capstoneRefs', []) if sec.get('youDo', {}).get('hasCapstoneRef') else [],
        'activity_counts': dict(by_type),
        'credential_eligible': cred_elig,
        'skills': dict(skills),
        'cred_skills': cred_skills,
        'self_check_qs': sec.get('selfCheck', {}).get('questionCount', 0),
        'topic_evals': sec.get('topicEvaluations', {}).get('count', 0),
        'youDo': sec.get('youDo', {}) or {},
    }

# Map each gap_id -> set of section numbers it touches (based on insertion point text)
GAP_TO_SECTIONS = {
    'GAP-P0-001': {10, 33, 39},
    'GAP-P0-002': {15, 17, 43},
    'GAP-P0-003': {37},
    'GAP-P0-004': {24},
    'GAP-P0-005': {40},
    'GAP-P0-006': set(),
    'GAP-P1-001': {6, 10},
    'GAP-P1-002': {10, 33},
    'GAP-P1-003': {33, 29},
    'GAP-P1-004': {39, 52},
    'GAP-P1-005': {39},
    'GAP-P1-006': {24},
    'GAP-P1-007': set(range(1, 53)),
    'GAP-P1-008': {27, 30, 43},
    'GAP-P1-009': {39, 52},
    'GAP-P1-010': {11, 21, 40, 48},
    'GAP-P1-011': {2, 7, 13, 25},
    'GAP-P2-001': {33, 43},
    'GAP-P2-002': {28, 32, 38},
    'GAP-P2-003': {43, 45},
    'GAP-P2-004': {19, 37},
    'GAP-P2-005': {25, 36, 52},
    'GAP-P2-006': {8, 18},
    'GAP-P2-007': {34, 43},
    'GAP-P2-008': {41, 43},
    'GAP-P2-009': {4, 8, 13, 18, 21, 25, 30, 34, 38, 43, 47},
    'GAP-P2-010': {39, 52},
    'GAP-P2-011': {7, 18, 22, 31},
    'GAP-P2-012': {36, 42, 47},
    'GAP-P2-013': set(),
    'GAP-P3-001': {47, 50},
    'GAP-P3-002': {25},
    'GAP-P3-003': {26},
    'GAP-P3-004': set(),
    'GAP-P3-005': set(),
    'GAP-P4-001': set(),
    'GAP-P4-002': {5, 8, 14, 19, 20, 27, 30, 36, 39, 41, 42, 43, 48, 50},
    'GAP-P4-003': set(range(27, 40)),
    'GAP-P4-004': {27},
    'GAP-P4-005': set(),
    'GAP-P4-006': {8},
}

SEC_TO_GAPS = defaultdict(list)
for gid, secs in GAP_TO_SECTIONS.items():
    for s in secs:
        SEC_TO_GAPS[s].append(gid)

for n in range(1, 53):
    if section_data[n]['self_check_qs'] < 5:
        SEC_TO_GAPS[n].append('GAP-P4-005')

SCORES = {
    1: 8.2, 2: 7.5, 3: 5.5, 4: 6.5, 5: 8.0, 6: 9.0, 7: 7.5, 8: 8.0,
    9: None, 10: None, 11: None, 12: None, 13: None, 14: 7.4,
    15: None, 16: None, 17: None, 18: 5.5, 19: 4.5, 20: 5.0,
    21: None, 22: None, 23: 9.5, 24: None, 25: 7.0, 26: None,
    27: 7.6, 28: None, 29: 8.0, 30: 8.4, 31: None, 32: 7.4,
    33: 8.5, 34: 7.5, 35: 7.5, 36: 8.4, 37: None, 38: None,
    39: 7.2, 40: None, 41: 5.8, 42: None, 43: 8.2, 44: None,
    45: None, 46: None, 47: 7.0, 48: 6.5, 49: 9.5, 50: 8.6,
    51: 6.3, 52: 7.5
}

SECTION_NOTES = {
    1: {
        'strengths': ['Strong I Do/We Do/You Do fidelity (8/24/1) tied to a real reproducible-repo contract (CP-N1-A).', 'Gold-standard "Mapa de la seccion" advance-organizer.'],
        'market_aligned': ['python_core, git_workflow, packaging_reproducibility, security_mindset -- all foundation PySE/DS/AIML requirements.'],
        'misconceptions': ['Learners may believe `pip install` is reproducible without a lockfile (S17 addresses this later).', 'Learners may treat .env as safe-by-default; S01 explicitly trains .env.example + .gitignore.'],
        'badge_evidence': 'CP-N1-A you_do (reproducible repo) + S01 exam -- sufficient for foundation reproducibility_determinism evidence.',
    },
    2: {
        'strengths': ['Best-in-class I Do/We Do/You Do fidelity with authentic Peruvian context (intake de cliente, soles, IGV, Unicode nahui).', 'Tight "raw/clean/errors" contract that recurs across theory->demo->exercises->capstone.'],
        'market_aligned': ['python_core, python_idioms -- foundation requirement for all 5 roles.'],
        'misconceptions': ['`is` vs `==` confusion; `None` vs "empty" semantics; truthiness of 0/""/[]/{}.', 'Unicode normalization (NFC vs NFD) for Latin-American names.'],
        'badge_evidence': 'CP-N1-A you_do (intake parser) + S02 exam -- foundation python_core evidence.',
    },
    3: {
        'strengths': ['Single "Test rojo: frontera inclusiva en edad 18" project framing -- direct practice with boundary testing.', 'Sets up the testing_discipline scaffold that S11 + S21 deepen.'],
        'market_aligned': ['python_core, data_validation -- foundation requirements.'],
        'misconceptions': ['Off-by-one errors; inclusive vs exclusive boundaries; how `range()` interacts with both.', 'Treating tests as after-the-fact instead of as design contracts.'],
        'badge_evidence': 'CP-N1-A you_do + S03 exam -- foundation data_validation evidence.',
    },
    4: {
        'strengths': ['"Reescribe conteo n^2 a O(n)" -- direct big-O practice tied to a real refactor.', 'Closes CP-N1-A with iteration + summary skills.'],
        'market_aligned': ['python_core, performance_tuning -- foundation for PySE/DS.'],
        'misconceptions': ['Confusing O(n) with O(n^2); when dict lookup is O(1) vs O(n); premature optimization.', 'Audit flagged 6 broken code<->output pairs + an unpassable _run_tests assertion -- gate integrity risk.'],
        'badge_evidence': 'CP-N1-A you_do + S04 exam -- but audit-flagged broken assertions need fix before badge issuance.',
    },
    5: {
        'strengths': ['Strong narrative thread (normalize_nombre/email/telefono/direccion); honest CASO-LIM-005 contract.', 'Strict I Do/We Do/You Do fidelity (8/24/1 + 8 self-check questions).'],
        'market_aligned': ['python_core, python_idioms, code_review_literacy -- foundation for PySE/DS/AIML.'],
        'misconceptions': ['Pure vs impure functions; default-argument mutability trap; contract vs implementation.', 'Audit flagged stale id="oop" on a Functions section + "Practica clases y herencia" demo leak (GAP-P4-002).'],
        'badge_evidence': 'CP-N1-B you_do (normalizadores puros) + S05 exam -- foundation python_idioms evidence.',
    },
    6: {
        'strengths': ['Highest expert-audit score in Phase 0 (9.0/10); membership list vs set framing teaches data-structure choice by cost.', 'Pure-stdlib pedagogy; no premature pandas.'],
        'market_aligned': ['pandas_numpy, descriptive_stats, python_core -- foundation for DA/DS/AIML.'],
        'misconceptions': ['Set membership O(1) vs list O(n); hashability; when to pay the set-construction cost.', 'Treating NumPy as "just faster lists" -- misses vectorization semantics.'],
        'badge_evidence': 'CP-N1-B you_do (modelo tabular en memoria) + S06 exam -- foundation pandas_numpy + descriptive_stats evidence.',
    },
    7: {
        'strengths': ['Normalizacion latinoamericana (Quispe, Nahui, Larco) -- directly addresses Peruvian-Spanish fidelity.', 'Anti-parentesco / anti-identidad guardrail is the curriculum ethical spine.'],
        'market_aligned': ['data_cleaning, data_validation, python_core -- foundation for DA/DS.'],
        'misconceptions': ['PII handling; redaction vs hashing; Unicode normalization for names/addresses.', 'Treating "Acuna" and "Acuna" (without tilde) as the same entity without explicit policy.'],
        'badge_evidence': 'CP-N1-B you_do + S07 exam -- foundation data_cleaning evidence.',
    },
    8: {
        'strengths': ['"run fail-closed con exit_code 0 o 1" -- explicit production-grade exit-code contract from day 8.', 'Strong I Do/We Do/You Do fidelity (8/24/1) with 11 self-check questions.'],
        'market_aligned': ['data_cleaning, data_validation, pandas_numpy -- foundation for DA/DS/PySE.'],
        'misconceptions': ['Atomic writes; newlines (\\r\\n vs \\n); CSV dialect handling; JSON null vs Python None.', 'Audit flagged voseo/tuteo inconsistency (5 voseo imperatives in a Peruvian-Spanish section) and 2 run-on sentences.'],
        'badge_evidence': 'CP-N1-B you_do (ETL pipeline) + S08 exam -- foundation data_cleaning + data_validation evidence.',
    },
    9: {
        'strengths': ['"Clave de idempotencia para re-ingesta" -- direct practice with idempotency keys for re-ingestable pipelines.', 'Strong Python-stdlib logging pedagogy.'],
        'market_aligned': ['observability, data_validation, packaging_reproducibility -- foundation for PySE/AIML.'],
        'misconceptions': ['Idempotency keys; structured logs vs print; re-ingesta without duplicate writes.', 'Confusing exceptions with logical errors.'],
        'badge_evidence': 'CP-N1-C you_do (bitacora auditable) + S09 exam -- foundation observability evidence.',
    },
    10: {
        'strengths': ['"Endurecer defaults inseguros" -- direct practice hardening sklearn defaults.', 'Sets up model_evaluation + classical_ml that S33 + S34 deepen.'],
        'market_aligned': ['classical_ml, model_evaluation, security_mindset -- foundation for DS/AIML.'],
        'misconceptions': ['Defaults are not safe; train/test split mechanics without leakage reasoning; accuracy vs F1 tradeoff.', 'CRITICAL: leakage_prevention is NOT named here (GAP-P0-001) -- must be added.'],
        'badge_evidence': 'CP-N1-B you_do + S10 exam -- foundation classical_ml evidence. But leakage_prevention gap means DS/AIML independent+ badge cannot cite this section alone.',
    },
    11: {
        'strengths': ['"Extraer decide_fraud; dejar solo signal_score" -- direct refactoring practice separating decisions from signals.', 'Closes CP-N1-C with OOP dominio.'],
        'market_aligned': ['testing_discipline, code_review_literacy, python_core -- foundation for PySE/DS.'],
        'misconceptions': ['Decision vs signal separation; OOP domain modeling; when to extract a method.', 'Testing as after-the-fact vs design-first.'],
        'badge_evidence': 'CP-N1-C you_do + S11 exam -- foundation testing_discipline evidence.',
    },
    12: {
        'strengths': ['"Distancia como geosenal, no parentesco" -- explicitly trains anti-parentesco guardrail with geographic features.', 'Adapters (HTTP + SQLite + geoevidencia) tie together multiple foundation skills.'],
        'market_aligned': ['performance_tuning, python_core -- foundation for PySE/DS.'],
        'misconceptions': ['Geographic distance as a feature vs a parentesco claim; API adapter patterns; SQLite vs Postgres tradeoffs.'],
        'badge_evidence': 'CP-N1-C you_do + S12 exam -- foundation performance_tuning evidence.',
    },
    13: {
        'strengths': ['"Incidente PII y regresion N1" -- explicitly trains PII-incident response, rare in bootcamps.', 'Closes Phase 0 + CP-N1-C with the first formal "regression test from incident" pattern.'],
        'market_aligned': ['python_rpa_browser, exception_handling_rpa, process_analysis -- foundation for RPA/PySE.'],
        'misconceptions': ['PII handling; regression tests as incident outputs; RPA as browser automation, not human-replacement.', 'Selector fragility (covered deeper in S24).'],
        'badge_evidence': 'CP-N1-C you_do (Evidence Dashboard) + S13 exam -- foundation RPA + exception_handling_rpa evidence.',
    },
    14: {
        'strengths': ['Strong "apertura de nivel" section; Ancla/Mecanismo/Caso sintetico/Borde schema applied uniformly.', 'Every We Do starter carries a single deliberate defect (CASO-LIM-014) -- gold-standard defect-driven pedagogy.'],
        'market_aligned': ['security_mindset, python_core -- Competente-level for PySE/AIML.'],
        'misconceptions': ['`x == np.nan` is always False; axis=0 collapses rows; view != copy; `np.unique` != `len(ids)/len(ids)`.', 'Audit flagged stale id="security" on a NumPy section + wrong-section playground demo (GAP-P4-002).'],
        'badge_evidence': 'CP-N2-A you_do + S14 exam -- Competente security_mindset + python_core evidence.',
    },
    15: {
        'strengths': ['Pandas ingesta tipada -- direct practice with typed intake (clientes/transacciones).', 'Bridges S14 (NumPy) -> S16 (Quality gate).'],
        'market_aligned': ['pandas_numpy, packaging_reproducibility, data_validation -- Competente for DA/DS/PySE.'],
        'misconceptions': ['dtype handling; CSV type inference; manifest de corrida; reproducibility via lockfile.', 'CRITICAL: python_type_safety (mypy/Pyright) NOT named here (GAP-P0-002) -- must be added.'],
        'badge_evidence': 'CP-N2-A you_do + S15 exam -- Competente pandas_numpy + packaging_reproducibility evidence.',
    },
    16: {
        'strengths': ['"metrics.pass False si hay cuarentena" -- direct fail-closed metric contract.', 'Quality gate explicable ante schema drift -- production-grade framing.'],
        'market_aligned': ['data_validation, code_review_literacy, security_mindset -- Competente for PySE/DA.'],
        'misconceptions': ['Schema drift; quality gates as fail-closed contracts; metric pass/fail semantics.'],
        'badge_evidence': 'CP-N2-A you_do + S16 exam -- Competente data_validation evidence.',
    },
    17: {
        'strengths': ['"Mini-integracion join + cutoff + delta" -- direct integration practice.', 'Closes CP-N2-A with packaging discipline.'],
        'market_aligned': ['packaging_reproducibility, ci_cd, git_workflow -- Competente for PySE/AIML.'],
        'misconceptions': ['pyproject.toml vs setup.py; lockfile reproducibility; CI gating on tests.', 'python_type_safety not in CI here (GAP-P0-002 reinforcement point).'],
        'badge_evidence': 'S17 you_do (no capstone ref) + S17 exam -- Competente packaging_reproducibility + ci_cd evidence. NOTE: S17 is the only Phase-1 section without a capstone ref -- verify intentional.',
    },
    18: {
        'strengths': ['"Nota post-filtro con seed 42" -- explicit reproducibility-via-seed practice.', 'EDA honesto para CP-N2-B (inicio).'],
        'market_aligned': ['data_cleaning, data_validation, descriptive_stats -- Competente for DA/DS.'],
        'misconceptions': ['Random seeds for reproducibility; post-filter notes; honest EDA (no overclaiming).', 'Audit flagged 5.5/10 -- needs review for specific defects.'],
        'badge_evidence': 'CP-N2-A + CP-N2-B you_do + S18 exam -- Competente data_cleaning evidence.',
    },
    19: {
        'strengths': ['Macro pedagogy is gold-standard: Ancla/Mecanismo/Caso/Borde schema; a11y guardrails (alt text, parity chart<->table) repeated as refrain.', 'Rubric weights sum to 100%.'],
        'market_aligned': ['python_visualization, bi_tools -- Competente for DA.'],
        'misconceptions': ['Accessibility (alt text, parity); baseline 0; overclaiming with viz.', 'CRITICAL: audit flagged code/output mismatches in 3 I-Do demos + 11/24 We-Do exercises (45.8%) -- section is currently unlearnable on live site. Plus id drift (databases-orm on a viz section).'],
        'badge_evidence': 'CP-N2-B you_do (Dashboard accesible) + S19 exam -- Competente python_visualization evidence. BLOCKED until fixer pass closes the code/output mismatch.',
    },
    20: {
        'strengths': ['Excel factory CP-N2-B -- direct openpyxl-based Excel automation.', 'Workbook, formulas vs materialized values, styles, reconciliation, idempotency, manifest -- production-grade Excel ops.'],
        'market_aligned': ['code_review_literacy, packaging_reproducibility, data_cleaning -- Competente for PySE/DA.'],
        'misconceptions': ['Formulas vs materialized values; idempotency keys; reconciliation; batch vs streaming writes.', 'Audit flagged id drift (rag on an Excel section) + structural meta-leak (GAP-P4-002).'],
        'badge_evidence': 'CP-N2-B you_do (Excel factory) + S20 exam -- Competente code_review_literacy + packaging_reproducibility evidence.',
    },
    21: {
        'strengths': ['"ready con all sobre la checklist" -- direct readiness-checklist contract.', 'Closes CP-N2-B with reporting factory.'],
        'market_aligned': ['system_design, testing_discipline, packaging_reproducibility -- Competente for PySE/AIML.'],
        'misconceptions': ['Readiness checklists; system design; testing as gate; FastAPI serving patterns.'],
        'badge_evidence': 'CP-N2-B you_do (Reporting Factory) + S21 exam -- Competente system_design + testing_discipline evidence.',
    },
    22: {
        'strengths': ['Email y aprobacion -- direct practice with .eml drafts + approval workflow.', 'RapidFuzz entity resolution -- production-grade fuzzy matching.'],
        'market_aligned': ['data_cleaning, data_validation, code_review_literacy -- Competente for PySE/DA.'],
        'misconceptions': ['Fuzzy matching thresholds; retry_hit patterns; duplicate detection.', 'Audit not yet extracted; verify code/output pairs.'],
        'badge_evidence': 'CP-N2-C you_do + S22 exam -- Competente data_cleaning + data_validation evidence.',
    },
    23: {
        'strengths': ['Playwright RPA -- production-grade Python browser automation (CP-N2-C).', 'Trace + web adapter contract -- direct observability for RPA.'],
        'market_aligned': ['python_rpa_browser, classical_ml, deep_learning -- Competente for RPA/AIML.'],
        'misconceptions': ['Playwright vs Selenium tradeoffs; trace as evidence; CV as RPA assist, not replacement.'],
        'badge_evidence': 'CP-N2-C you_do + S23 exam -- Competente python_rpa_browser + classical_ml evidence.',
    },
    24: {
        'strengths': ['OCR Document AI -- direct practice with document intake.', 'Gate mime/size + fallback human_rescan -- explicit fail-closed contract.'],
        'market_aligned': ['selector_design, exception_handling_rpa, python_rpa_browser -- Competente for RPA.'],
        'misconceptions': ['Selector resilience; exception taxonomies; OCR confidence thresholds; human fallback.', 'CRITICAL: reframework (state-machine + dispatcher/performer) NOT named here (GAP-P0-004) -- must be added.'],
        'badge_evidence': 'CP-N2-C you_do + S24 exam -- Competente RPA evidence. But reframework gap means RPA Independent+ badge cannot cite this section alone.',
    },
    25: {
        'strengths': ['IA endpoints y prompts -- direct practice with AI assistant evaluation.', 'Streamlit dashboard contract -- production-grade Python web app.'],
        'market_aligned': ['bi_tools, llmops, ai_code_review_literacy -- Competente for DA/AIML.'],
        'misconceptions': ['Streamlit as BI substitute; AI endpoint contracts; prompt evaluation.', 'bi_tools (Tableau/Power BI/Looker) only covered via Streamlit substitute (GAP-P3-002) -- badge should disclose.'],
        'badge_evidence': 'CP-N2-C you_do + S25 exam -- Competente bi_tools + llmops evidence.',
    },
    26: {
        'strengths': ['VP RPA + AI Analyst -- first formal capstone integrator (closes CP-N2-A + CP-N2-C).', 'Capstone_integration edge in the curriculum graph (3 of 13 capstones have integrators).'],
        'market_aligned': ['python_rpa_browser, process_analysis, stakeholder_translation, business_framing -- Competente for RPA/AIML/DA.'],
        'misconceptions': ['End-to-end ownership; stakeholder translation; process analysis for automation candidates.'],
        'badge_evidence': 'CP-N2-A + CP-N2-C capstone + S26 exam -- Competente capstone-level evidence across multiple skills. Gold standard for capstone integrator design.',
    },
    27: {
        'strengths': ['"De bug_repro a regression_test" -- closest the curriculum comes to teaching debugging as a named skill (GAP-P1-008).', 'Strong pytest contract pedagogy (AAA, fixtures, parametrize, coverage by rama).'],
        'market_aligned': ['python_async, async_testing, testing_discipline -- Senior for PySE/AIML.'],
        'misconceptions': ['Bug repro -> regression test; AAA pattern; fixture scopes; mutation testing.', 'CRITICAL: id drift (async-concurrency on a pytest section) + level mismatch (Competente vs Phase-2 Senior) -- GAP-P4-002 + GAP-P4-003.'],
        'badge_evidence': 'CP-N3-A you_do + S27 exam -- Senior testing_discipline + async_testing evidence.',
    },
    28: {
        'strengths': ['"run(seed) determinista con sorted" -- explicit determinism-via-seed+sorted contract.', 'LLM agents QA suite -- properties, golpes, contratos.'],
        'market_aligned': ['python_async, llmops, testing_discipline, packaging_reproducibility -- Senior for AIML/PySE.'],
        'misconceptions': ['Determinism for LLM agents; property-based testing; idempotency of agent loops.'],
        'badge_evidence': 'CP-N3-A you_do + S28 exam -- Senior llmops + testing_discipline evidence.',
    },
    29: {
        'strengths': ['"pending_count real con NOT EXISTS" -- direct SQL practice with anti-pattern detection.', 'SQL almacen ER -- production-grade feature/backfill store.'],
        'market_aligned': ['mlops_pipelines, model_deployment, drift_monitoring, sql_fundamentals -- Senior for AIML/DA.'],
        'misconceptions': ['NOT EXISTS vs NOT IN; pending_count semantics; feature store patterns; drift detection wiring.'],
        'badge_evidence': 'CP-N3-A you_do + S29 exam -- Senior mlops_pipelines + model_deployment + drift_monitoring evidence.',
    },
    30: {
        'strengths': ['Highest audit score in Phase 2 (8.4/10); tight 4x2 subtopic grid with consistent vocabulary.', 'Union-Find + pair completeness/quality metrics -- production-grade ER.'],
        'market_aligned': ['observability, security_mindset, system_design, cloud_platform -- Senior for PySE/AIML/DA.'],
        'misconceptions': ['ER != fraude/parentesco (curriculum ethical spine); pair completeness vs quality; Union-Find for clusters.', 'Audit flagged id drift (security-infra on an ER section) -- GAP-P4-002.'],
        'badge_evidence': 'CP-N3-A you_do + S30 exam -- Senior observability + system_design evidence.',
    },
    31: {
        'strengths': ['"Politica de escala: render o summarize" -- direct scale-policy contract for streaming data.', 'Grafo temporal con caminos de evidencia -- production-grade temporal graph.'],
        'market_aligned': ['python_async, observability, system_design, cloud_platform -- Senior for PySE/AIML.'],
        'misconceptions': ['Streaming vs batch; render vs summarize policy; temporal graphs; backpressure.'],
        'badge_evidence': 'CP-N3-B you_do + S31 exam -- Senior python_async + observability evidence.',
    },
    32: {
        'strengths': ['"Fail-closed: REQUEST_FEATURE_SET_ID hacia S33" -- explicit fail-closed cross-service contract.', 'Features sin leakage -- direct practice with leakage-aware feature tables.'],
        'market_aligned': ['python_async, system_design, testing_discipline, packaging_reproducibility -- Senior for PySE/AIML.'],
        'misconceptions': ['Fail-closed cross-service contracts; feature set versioning; leakage-aware feature tables.'],
        'badge_evidence': 'CP-N3-B you_do + S32 exam -- Senior python_async + system_design evidence.',
    },
    33: {
        'strengths': ['"REQUEST_GROUP_IDS sin lista de entidades" -- explicit anti-PII contract for group features.', 'Baselines ML responsables -- production-grade baseline vs model framing.'],
        'market_aligned': ['classical_ml, deep_learning, uncertainty_quantification, model_evaluation -- Senior for AIML/DS.'],
        'misconceptions': ['Group features without entity lists; baseline vs model framing; uncertainty quantification; model evaluation by slice.', 'feature_engineering NOT named here (GAP-P1-003) -- must be added. regression NOT named here (GAP-P1-002).'],
        'badge_evidence': 'CP-N3-B you_do + S33 exam -- Senior classical_ml + deep_learning evidence. But feature_engineering + regression gaps mean DS/AIML independent+ badge cannot cite this section alone.',
    },
    34: {
        'strengths': ['"Fail-closed: REQUEST_ABSTAIN_BAND" -- direct abstention-band contract (uncertainty quantification in production).', 'Workbench metricas + thr versionado + abstencion -- production-grade ML serving.'],
        'market_aligned': ['classical_ml, deep_learning, uncertainty_quantification -- Senior for AIML.'],
        'misconceptions': ['Abstain bands; threshold versioning; metric workbench; fail-closed ML serving.'],
        'badge_evidence': 'CP-N3-B you_do + S34 exam -- Senior uncertainty_quantification + classical_ml evidence.',
    },
    35: {
        'strengths': ['"Fail-closed de override en cola" -- direct override-fail-closed contract for queues.', 'Explicabilidad y equidad -- production-grade XAI + fairness framing.'],
        'market_aligned': ['system_design, tradeoff_articulation, code_review_literacy -- Senior for PySE/AIML.'],
        'misconceptions': ['Override fail-closed; explainability vs accuracy tradeoff; fairness metrics.'],
        'badge_evidence': 'CP-N3-C you_do + S35 exam -- Senior system_design + tradeoff_articulation evidence.',
    },
    36: {
        'strengths': ['"Elegir P@k con labels ralos" -- direct practice with precision@k under sparse labels.', 'Clustering y anomalias -- production-grade backtesting for rarity signals.'],
        'market_aligned': ['llmops, deep_learning, classical_ml, tradeoff_articulation -- Senior for AIML.'],
        'misconceptions': ['P@k with sparse labels; clustering vs anomaly detection; backtesting discipline.'],
        'badge_evidence': 'CP-N3-C you_do + S36 exam -- Senior llmops + classical_ml evidence.',
    },
    37: {
        'strengths': ['"Reporte: dataset y hardware incluidos" -- direct practice with reproducible-report metadata.', 'dbt + BigQuery -- production-grade SQL analytics engineering.'],
        'market_aligned': ['sql_fundamentals, sql_window_ctes, packaging_reproducibility, performance_tuning -- Senior for DA/DS.'],
        'misconceptions': ['dbt model versioning; BigQuery slot accounting; window functions; CTEs; materialized views.', 'CRITICAL: sql_performance_tuning NOT named here (GAP-P0-003) -- must be added. Plus sql_window_ctes only taught here (GAP-P2-004) -- thin coverage.'],
        'badge_evidence': 'S37 you_do (no capstone ref) + S37 exam -- Senior sql_fundamentals + sql_window_ctes evidence. NOTE: S37 is the only Phase-2 section without a capstone ref -- verify intentional.',
    },
    38: {
        'strengths': ['"Runbook on-call con restart_worker" -- direct on-call runbook contract.', 'Concurrencia y resiliencia -- production-grade async pipeline with resume + trace.'],
        'market_aligned': ['python_async, performance_tuning, observability, packaging_reproducibility -- Senior for PySE/AIML.'],
        'misconceptions': ['On-call runbooks; concurrency vs parallelism; resumable pipelines; trace as evidence.'],
        'badge_evidence': 'CP-N3-C you_do + S38 exam -- Senior python_async + performance_tuning evidence.',
    },
    39: {
        'strengths': ['Pedagogically gold-standard (full I Do/We Do/You Do/Self-Check/Resources; 8 demos + 24 exercises + capstone bundle with manifest, audit log, 3 cards, postmortem).', 'Honest anti-fraud / anti-parentesco / anti-self-promotion guardrails woven through every paragraph.'],
        'market_aligned': ['system_design, stakeholder_translation, business_framing, metric_design -- Senior for PySE/AIML/DA.'],
        'misconceptions': ['Responsible ML case triage; postmortem blameless; metric design; stakeholder translation.', 'Audit flagged off-topic CI/CD demo drift + PDF mislabel (GAP-P4-002). Plus 2 run-on sentences in core theory.'],
        'badge_evidence': 'CP-N3-C capstone + S39 exam -- Senior capstone-level evidence across multiple skills. Gold standard for capstone integrator design.',
    },
    40: {
        'strengths': ['"Fail-closed: NEGOTIATE_VERSION" -- direct version-negotiation contract for cross-service architectures.', 'Arquitectura, DDD y decisiones tecnicas -- production-grade architecture decision records.'],
        'market_aligned': ['architecture_leadership, system_design, code_review_literacy -- Master for PySE/AIML.'],
        'misconceptions': ['DDD bounded contexts; architecture decision records; version negotiation; fail-closed contracts.', 'CRITICAL: DIV-001 (GAP-P0-005) -- prisma seed has "agentic-architecture" but section source has "architecture-ddd-decisions"; S40 exam is unattainable on the dynamic LMS until fixed.'],
        'badge_evidence': 'CP-N4-A you_do + S40 exam -- Master architecture_leadership + system_design evidence. BLOCKED on dynamic LMS until DIV-001 fix.',
    },
    41: {
        'strengths': ['Pedagogically gold-standard (8 demos + 24 E1/E2/E3 fail-closed exercises + readiness() capstone).', 'FastAPI + HTTP contracts -- production-grade API serving.'],
        'market_aligned': ['system_design, python_async, llmops, packaging_reproducibility -- Master for PySE/AIML.'],
        'misconceptions': ['HTTP status semantics; Idempotency-Key; dependency injection; 422 validation; sync/async/background boundaries; timeout cascades; rate-limiting; PII redaction.', 'CRITICAL: id drift (llm-finetuning on a FastAPI section) + PDF mislabel "FineTune" + QLoRA demo leak -- GAP-P4-002.'],
        'badge_evidence': 'CP-N4-A you_do + S41 exam -- Master system_design + python_async evidence.',
    },
    42: {
        'strengths': ['"Cierre de ticket: CONTINUE o VERIFY_DELETION" -- direct ticket-closure contract.', 'Schemas, seguridad y privacidad de servicios -- production-grade service security.'],
        'market_aligned': ['system_design, security_mindset, packaging_reproducibility -- Master for PySE/AIML/PySE.'],
        'misconceptions': ['Ticket closure contracts; schema security; service privacy; fail-closed deletion.'],
        'badge_evidence': 'CP-N4-A you_do + S42 exam -- Master system_design + security_mindset evidence.',
    },
    43: {
        'strengths': ['Production-grade section (audit 8.2/10); no meta-leaks; tight V3 roadmap alignment.', 'Contenedores y reproducibilidad operativa -- production-grade container discipline.'],
        'market_aligned': ['observability, packaging_reproducibility, ci_cd, mlops_pipelines -- Master for PySE/AIML.'],
        'misconceptions': ['Multistage Dockerfiles; non-root runtime; compose; reproducibility via containers.', 'CRITICAL: id drift (llmops on a containers section) -- GAP-P4-002. Also: docker is taught here per audit but activity map says packaging_reproducibility + observability + ci_cd, not docker -- GAP-P2-003 reinforcement point. python_type_safety reinforcement point (GAP-P0-002).'],
        'badge_evidence': 'CP-N4-A you_do + S43 exam -- Master observability + ci_cd + packaging_reproducibility evidence.',
    },
    44: {
        'strengths': ['"Fail-closed: asignar dueno del incidente" -- direct incident-owner contract.', 'CI/CD + supply chain security -- production-grade CI/CD with supply-chain hardening.'],
        'market_aligned': ['security_mindset, ci_cd, code_review_literacy, packaging_reproducibility -- Master for PySE/AIML.'],
        'misconceptions': ['Incident ownership; CI/CD supply chain; SBOM; signed artifacts.'],
        'badge_evidence': 'CP-N4-B you_do + S44 exam -- Master security_mindset + ci_cd evidence.',
    },
    45: {
        'strengths': ['"Decide FinOps: CONTINUE o COST_OWNER_REVIEW" -- direct FinOps decision contract.', 'Cloud + almacenamiento + colas + IaC -- production-grade IaC.'],
        'market_aligned': ['cloud_platform, docker, kubernetes, ci_cd, packaging_reproducibility -- Master for PySE/AIML.'],
        'misconceptions': ['FinOps decisions; IaC patterns; cloud storage; queue patterns; k8s manifests.', 'kubernetes taught here per activity map (GAP-P2-003 reinforcement point -- verify k8s depth).'],
        'badge_evidence': 'CP-N4-B you_do + S45 exam -- Master cloud_platform + docker + kubernetes evidence.',
    },
    46: {
        'strengths': ['"Decide ops: CONTINUE o activa runbook" -- direct ops-decision contract.', 'Data engineering produccion (Huancayo CASO-HYO) -- production-grade incremental pipeline.'],
        'market_aligned': ['python_async, performance_tuning, observability, cloud_platform -- Master for PySE/AIML.'],
        'misconceptions': ['Ops decisions; runbooks; incremental pipelines; cloud GPU ops.'],
        'badge_evidence': 'CP-N4-B you_do + S46 exam -- Master python_async + performance_tuning evidence.',
    },
    47: {
        'strengths': ['"Decide rollback: CONTINUE o REVIEW" -- direct rollback-decision contract.', 'MLOps serving -- production-grade experiment platform.'],
        'market_aligned': ['code_review_literacy, mentoring, git_workflow, mlops_pipelines -- Master for PySE/AIML.'],
        'misconceptions': ['Rollback decisions; OSS licensing; MLOps serving; mentoring junior PRs.'],
        'badge_evidence': 'CP-N4-B you_do + S47 exam -- Master code_review_literacy + mentoring evidence.',
    },
    48: {
        'strengths': ['Technically dense RAG lab with strong I Do/We Do/You Do fidelity + fail-closed contracts.', 'T1 retrieval/holdout -> T2 chunking/ACL -> T3 hybrid/citas -> T4 grounding/abstencion -- full RAG pipeline.'],
        'market_aligned': ['llmops, security_mindset, ai_code_review_literacy, packaging_reproducibility -- Master for AIML.'],
        'misconceptions': ['RAG with citations; ACLs before ranking; abstention when retrieval does not support the answer; hybrid fusion (lexical + vector).', 'Audit flagged id drift (ai-governance on a RAG section) -- GAP-P4-002. Plus ai_code_review_literacy only taught here (GAP-P1-010) -- too late for Phase 0-2 learners.'],
        'badge_evidence': 'CP-N4-C you_do + S48 exam -- Master llmops + ai_code_review_literacy evidence.',
    },
    49: {
        'strengths': ['Highest audit score in Phase 3 (9.5/10); gold-standard pedagogy.', 'Agentes, herramientas y context engineering -- production-grade agentic systems.'],
        'market_aligned': ['llmops, system_design, stakeholder_translation, packaging_reproducibility -- Master for AIML.'],
        'misconceptions': ['Agent tool design; context engineering; data contracts; fail-closed gates.'],
        'badge_evidence': 'CP-N4-C you_do + S49 exam -- Master llmops + system_design + stakeholder_translation evidence.',
    },
    50: {
        'strengths': ['Highest audit score in Phase 3 (8.6/10); 24-exercise E1/E2/E3 lattice is densest in course.', 'Evals, red teaming y fiabilidad de IA -- production-grade LLM eval + red team + SLO.'],
        'market_aligned': ['written_communication, oral_communication, mentoring, architecture_leadership -- Master for AIML/PySE.'],
        'misconceptions': ['Eval suites with holdouts; calibrated judges; red team injection/exfil/misuse; SLO + rollback.', 'Audit flagged id drift (tech-leadership on an Evals section) -- GAP-P4-002. Communication skills taught here but too late for foundation (GAP-P1-011).'],
        'badge_evidence': 'CP-N4-C you_do (scorecard + readiness artifact) + S50 exam -- Master written/oral_communication + architecture_leadership evidence.',
    },
    51: {
        'strengths': ['"Decide a11y: CONTINUE o enrutar contestacion" -- direct a11y-decision contract.', 'Portafolio CF-5: Observabilidad, gobernanza, UX copiloto -- production-grade final-integrator capstone.'],
        'market_aligned': ['architecture_leadership, stakeholder_translation, system_design, business_framing -- Master for PySE/AIML.'],
        'misconceptions': ['a11y decisions; observability + governance + UX copilot integration; final capstone integration.'],
        'badge_evidence': 'CP-N4-C capstone + S51 exam -- Master capstone-level evidence across multiple skills. Gold standard for capstone integrator design.',
    },
    52: {
        'strengths': ['Pedagogically one of the strongest sections (audit 7.5/10); forces a defensible, fail-closed, ethics-hardened portfolio at Master exit.', '80h final capstone synthesizing the entire curriculum.'],
        'market_aligned': ['business_framing, oral_communication, written_communication, stakeholder_management -- Master for all roles.'],
        'misconceptions': ['Career strategy as defense bundle; end-to-end ownership; portfolio integrity; bundle decisions (CONTINUE or DEFENSE).', 'Communication skills taught here but too late for foundation (GAP-P1-011). Plus: only 4 objectives despite 80h -- verify scope.'],
        'badge_evidence': 'CP-FINAL + CP-N4-C capstone -- Master capstone-level evidence across all 5 roles. Gold standard for course-final capstone design.',
    },
}

def section_priority(snum):
    gaps = SEC_TO_GAPS.get(snum, [])
    p0 = [g for g in gaps if g.startswith('GAP-P0-')]
    p1 = [g for g in gaps if g.startswith('GAP-P1-')]
    p2 = [g for g in gaps if g.startswith('GAP-P2-')]
    if p0:
        return 'P0', p0
    if p1:
        return 'P1', p1
    if p2:
        return 'P2', p2
    return 'P3', gaps

GAP_TITLE = {g['gap_id']: g['title'] for g in gap['gaps']}

for n in range(1, 53):
    d = section_data[n]
    notes = SECTION_NOTES.get(n, {})
    score = SCORES.get(n)
    prio, gap_ids = section_priority(n)

    skills_taught = sorted(d['skills'].keys(), key=lambda s: -d['skills'][s])
    cred_skills = sorted(d['cred_skills'])
    capstones = ','.join(d['capstones']) if d['capstones'] else '--'
    ac = d['activity_counts']

    lines = []
    lines.append(f"# S{n:02d} -- Per-Section Audit Summary (Phase 5)")
    lines.append("")
    lines.append(f"**Section number:** {n}  ")
    lines.append(f"**File:** `{d['filePath']}` ({d['sourceLines']:,} LOC)  ")
    lines.append(f"**Live slug (id):** `{d['sectionId']}`  ")
    lines.append(f"**Actual topic (shortTitle):** {d['shortTitle']}  ")
    lines.append(f"**You Do project title:** {d['title']}  ")
    lines.append(f"**Phase / level / hours:** Phase {d['phase']} / {d['level']} / {d['hours']}h  ")
    lines.append(f"**Capstones referenced:** {capstones}  ")
    lines.append(f"**Tagline:** {d['tagline'][:160]}{'...' if len(d['tagline']) > 160 else ''}  ")
    lines.append(f"**Learning outcomes:** {d['learningOutcomes']}  ")
    lines.append(f"**Activity counts:** theory={ac.get('theory',0)} / i_do={ac.get('i_do',0)} / we_do={ac.get('we_do',0)} / you_do={ac.get('you_do',0)} / self_check={ac.get('self_check',0)} / topic_evaluation={ac.get('topic_evaluation',0)} / exam={ac.get('exam',0)} / capstone={ac.get('capstone',0)}  ")
    lines.append(f"**Self-check questions:** {d['self_check_qs']}  ")
    lines.append(f"**Credential-eligible activities:** {d['credential_eligible']}  ")
    if score is not None:
        lines.append(f"**Expert-audit composite score:** {score}/10  ")
    else:
        lines.append(f"**Expert-audit composite score:** not extracted (see `expert_audit/S{n:02d}_report.md`)  ")
    lines.append(f"**Cross-reference:** `expert_audit/S{n:02d}_report.md` and `curriculum_skill_graph.json#sections[{n-1}]`  ")
    lines.append("")
    lines.append("---")
    lines.append("")
    lines.append("## 1. Existing strengths")
    lines.append("")
    for s in notes.get('strengths', ['--']):
        lines.append(f"- {s}")
    lines.append("")
    lines.append("## 2. Market-aligned capabilities")
    lines.append("")
    for s in notes.get('market_aligned', ['--']):
        lines.append(f"- {s}")
    lines.append("")
    skills_str = ', '.join(f'`{s}` ({d["skills"][s]} acts)' for s in skills_taught[:8])
    if len(skills_taught) > 8:
        skills_str += ', ...'
    lines.append(f"**Skills taught in this section ({len(skills_taught)}):** {skills_str}")
    lines.append("")
    lines.append("## 3. Missing capabilities (from Phase 4 gap analysis)")
    lines.append("")
    if gap_ids:
        for gid in gap_ids:
            g = next((x for x in gap['gaps'] if x['gap_id'] == gid), None)
            if g:
                lines.append(f"- **`{gid}` ({g['severity']}):** {g['title']}")
                ip = g['exact_section_and_insertion_point']
                lines.append(f"  - Insertion point: {ip[:200]}{'...' if len(ip) > 200 else ''}")
    else:
        lines.append("- No Phase 4 gaps directly touch this section.")
    lines.append("")
    lines.append("## 4. Assessment independence (guided vs independent)")
    lines.append("")
    we_do_total = ac.get('we_do', 0)
    perf_acts = ac.get('you_do', 0) + ac.get('capstone', 0)
    guided_acts = ac.get('theory', 0) + ac.get('i_do', 0) + (we_do_total * 2 // 3)
    indep_acts = (we_do_total // 3) + perf_acts
    lines.append(f"- **Guided (theory + i_do + we_do E1/E2):** ~{guided_acts} activities")
    lines.append(f"- **Independent (we_do E3 + you_do + capstone):** ~{indep_acts} activities")
    lines.append(f"- **Performance-graded (you_do + capstone):** {perf_acts} activities")
    lines.append(f"- **Recall-graded (self_check + exam):** {ac.get('self_check',0) + ac.get('exam',0)} activities (MCQ-style)")
    if perf_acts >= 1:
        rating = 'strong' if perf_acts >= 2 else 'moderate'
        lines.append(f"- **Independence rating:** {rating} -- at least one performance-graded artifact exists.")
    else:
        lines.append("- **Independence rating:** weak -- no performance-graded artifact; depends entirely on MCQ recall.")
    lines.append("")
    lines.append("## 5. Potential badge evidence")
    lines.append("")
    lines.append(f"- {notes.get('badge_evidence', '--')}")
    if cred_skills:
        lines.append(f"- **Credential-eligible skills evidenced here:** {', '.join(f'`{s}`' for s in cred_skills)}")
    lines.append("")
    lines.append("## 6. Critical misconceptions")
    lines.append("")
    for s in notes.get('misconceptions', ['--']):
        lines.append(f"- {s}")
    lines.append("")
    lines.append("## 7. Recommended changes")
    lines.append("")
    if gap_ids:
        for gid in gap_ids:
            g = next((x for x in gap['gaps'] if x['gap_id'] == gid), None)
            if g:
                lines.append(f"- **`{gid}` ({g['severity']}):** {g['proposed_content_type']}")
    else:
        lines.append("- No changes recommended beyond the global polish items (GAP-P4-005 self-check count, GAP-P4-006 inactive files).")
    lines.append("")
    lines.append("## 8. Priority")
    lines.append("")
    lines.append(f"**{prio}** -- based on the highest-severity gap touching this section.")
    if gap_ids:
        lines.append("")
        lines.append("Gaps touching this section:")
        for gid in gap_ids:
            g = next((x for x in gap['gaps'] if x['gap_id'] == gid), None)
            if g:
                lines.append(f"- `{gid}` ({g['severity']}): {g['title']}")
    lines.append("")
    lines.append("---")
    lines.append("")
    lines.append(f"*Generated by `curriculum_gap_auditor` node, Phase 5. Cross-reference: `industry_alignment/curriculum_gap_matrix.json`, `industry_alignment/curriculum_gap_matrix.md`, `expert_audit/S{n:02d}_report.md`.*")
    lines.append("")

    with open(f'{OUT_DIR}/S{n:02d}.md', 'w') as f:
        f.write('\n'.join(lines))

print(f"Generated 52 per-section audit summaries in {OUT_DIR}")
print(f"Sample (S01) priority: {section_priority(1)}")
print(f"Sample (S40) priority: {section_priority(40)}")
print(f"Sample (S10) priority: {section_priority(10)}")
print(f"Sample (S24) priority: {section_priority(24)}")
print(f"Sample (S37) priority: {section_priority(37)}")
print(f"Sample (S52) priority: {section_priority(52)}")
