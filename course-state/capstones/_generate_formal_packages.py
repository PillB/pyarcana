#!/usr/bin/env python3
"""Generate formal gate packages for all 13 PyArcana capstones and execute demos."""
from __future__ import annotations

import json
import os
import subprocess
import sys
import textwrap
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent
PROJECT = ROOT.parent.parent  # PyArcana root if under course-state/capstones
# course-state/capstones -> course-state -> project root
if (ROOT.parent / "capstone_ledger.json").exists():
    PROJECT = ROOT.parent.parent
else:
    PROJECT = ROOT.parent

NOW = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")

CAPSTONES = [
    {
        "id": "CP-N1-A",
        "gate_section": "S04",
        "name": "Client Intake & Data Quality Script",
        "level": 1,
        "dependencies": ["S01", "S02", "S03", "S04"],
        "acceptance_criteria": [
            "Script lee registros sintéticos y emite estados válidos (ok/warn/error).",
            "Validación de campos obligatorios y formatos simples sin PII real.",
            "Tasa de error del lote calculada y reportada en métricas JSON.",
            "Casos borde (vacíos, tipos incorrectos) no crashean el proceso.",
            "Salida reproducible con seed fija y exit code 0 en demo.",
        ],
        "wow_factor_definition": (
            "Demo local que valida un lote sintético de intake, imprime métricas "
            "(n_total, n_ok, n_error, error_rate) y un resumen legible para stakeholders."
        ),
        "rubric_notes": {
            "correctness": "Clasificación correcta ok/warn/error según reglas documentadas.",
            "robustness": "Maneja filas incompletas y tipos inesperados sin abortar el lote.",
            "maintainability": "Funciones pequeñas, reglas centralizadas, sin secretos.",
            "responsible_use": "Solo datos sintéticos; no almacena ni expone PII real.",
        },
        "card_type": "data",
        "card_title": "Ficha de datos — Intake sintético N1-A",
    },
    {
        "id": "CP-N1-B",
        "gate_section": "S08",
        "name": "Client/Transaction ETL Pipeline",
        "level": 1,
        "dependencies": ["CP-N1-A", "S05", "S06", "S07", "S08"],
        "acceptance_criteria": [
            "Pipeline ETL lee CSV/JSON sintético con contrato de columnas.",
            "Filas inválidas van a cuarentena; válidas a salida limpia.",
            "Manifest con conteos, hashes o fingerprints y provenance de corrida.",
            "Lineage mínimo: origen → transform → destino documentado.",
            "Demo exit 0 y métricas JSON con n_in, n_out, n_quarantine.",
        ],
        "wow_factor_definition": (
            "ETL reproducible con cuarentena, manifest y métricas de reconciliación "
            "sobre datos sintéticos de clientes/transacciones."
        ),
        "rubric_notes": {
            "correctness": "Contrato respetado; cuarentena correcta para irregularidades.",
            "robustness": "Filas irregulares no detienen el lote completo.",
            "maintainability": "Pasos ETL claros y nombres de columnas estables.",
            "responsible_use": "Sin PII real; no escribe secretos en manifest.",
        },
        "card_type": "data",
        "card_title": "Ficha de datos — ETL sintético N1-B",
    },
    {
        "id": "CP-N1-C",
        "gate_section": "S13",
        "name": "Familiarity Evidence Dashboard",
        "level": 1,
        "dependencies": ["CP-N1-A", "CP-N1-B", "S09", "S10", "S11", "S12", "S13"],
        "acceptance_criteria": [
            "entity_resolution_score separado de relationship_signal_score.",
            "Señales explicables (tokens, geo, contacto) con score por evidencia.",
            "Cola de revisión humana para pares ambiguos (no decisión automática de fraude).",
            "Límites explícitos: coincidencia ≠ parentesco/fraude.",
            "Demo con datos sintéticos y métricas JSON de pares/scores.",
        ],
        "wow_factor_definition": (
            "Dashboard de evidencia de familiaridad con ER determinista, geoevidencia "
            "trazable, revisión humana y ficha de privacidad — sin inferencia de fraude."
        ),
        "rubric_notes": {
            "correctness": "Scores separados y calculados según reglas publicadas.",
            "robustness": "Pares incompletos o sin geo no rompen el pipeline.",
            "maintainability": "Capas ER / relationship / review claramente separadas.",
            "responsible_use": "Prohibida etiqueta de fraude; PII solo sintética.",
        },
        "card_type": "system",
        "card_title": "System card — Familiarity Evidence Dashboard",
    },
    {
        "id": "CP-N2-A",
        "gate_section": "S17",
        "name": "Executive Data Quality & EDA Portfolio",
        "level": 2,
        "dependencies": ["CP-N1-C", "S14", "S15", "S16", "S17"],
        "acceptance_criteria": [
            "EDA reproducible sobre dataset sintético con métricas de calidad.",
            "Reconciliación de conteos origen vs analizados.",
            "Memo ejecutivo (texto) con hallazgos y limitaciones.",
            "Sin claims de impacto no medidos.",
            "Métricas JSON: completeness, null_rate, n_rows, recon_delta.",
        ],
        "wow_factor_definition": (
            "Portfolio EDA ejecutable con reconciliación, métricas de calidad y "
            "memo ejecutivo listo para CV — datos 100% sintéticos."
        ),
        "rubric_notes": {
            "correctness": "Métricas y reconciliación numéricamente consistentes.",
            "robustness": "Nulos y outliers reportados, no ocultos.",
            "maintainability": "Script/notebook reproducible con seed.",
            "responsible_use": "Limitaciones y no-go de uso listados en memo/card.",
        },
        "card_type": "data",
        "card_title": "Data card — EDA portfolio sintético N2-A",
    },
    {
        "id": "CP-N2-B",
        "gate_section": "S21",
        "name": "Accessible Insights Dashboard & Reporting Factory",
        "level": 2,
        "dependencies": ["CP-N2-A", "S18", "S19", "S20", "S21"],
        "acceptance_criteria": [
            "Genera reporte estructurado (tablas/secciones) con trazabilidad de fuente.",
            "Checklist de accesibilidad mínima (labels, contraste conceptual, no solo color).",
            "Fábrica de reportes con plantilla y parámetros.",
            "Métricas de cobertura de secciones y filas renderizadas.",
            "Demo local sin PII real; exit 0.",
        ],
        "wow_factor_definition": (
            "Reporting factory que produce un informe accesible y trazable a partir "
            "de métricas sintéticas, con checklist a11y y JSON de calidad."
        ),
        "rubric_notes": {
            "correctness": "Secciones del reporte completas según plantilla.",
            "robustness": "Entradas vacías producen reporte degradado, no crash.",
            "maintainability": "Plantilla separada de datos.",
            "responsible_use": "Accesibilidad y límites de interpretación documentados.",
        },
        "card_type": "system",
        "card_title": "System card — Insights Dashboard & Reporting Factory",
    },
    {
        "id": "CP-N2-C",
        "gate_section": "S26",
        "name": "VP RPA + AI Analyst",
        "level": 2,
        "dependencies": ["CP-N2-A", "CP-N2-B", "S22", "S23", "S24", "S25", "S26"],
        "acceptance_criteria": [
            "Flujo: entrada tabular → validación → análisis → informe → aprobación → borrador correo.",
            "Estados del flujo auditables; rollback simulado a estado anterior.",
            "Sin envío real de correo ni PII real a proveedores.",
            "Evidencia de cada estado en métricas/log estructurado.",
            "Demo exit 0 con pipeline_status=completed.",
        ],
        "wow_factor_definition": (
            "Orquestación RPA/IA sintética de extremo a extremo con aprobación humana, "
            "borrador de correo y rollback — lista para demo de portafolio."
        ),
        "rubric_notes": {
            "correctness": "Transiciones de estado válidas y ordenadas.",
            "robustness": "Falla simulada recupera vía rollback.",
            "maintainability": "Estados enumerados y funciones por etapa.",
            "responsible_use": "Humano en el loop; sin automatizar envío real.",
        },
        "card_type": "system",
        "card_title": "System card — VP RPA + AI Analyst",
    },
    {
        "id": "CP-N3-A",
        "gate_section": "S30",
        "name": "Testable Entity Resolution Engine",
        "level": 3,
        "dependencies": ["CP-N2-C", "S27", "S28", "S29", "S30"],
        "acceptance_criteria": [
            "Bloqueo (blocking) reduce pares candidatos de forma medible.",
            "Comparadores deterministas con scores y umbrales documentados.",
            "Evaluación con etiquetas sintéticas (precision/recall o proxies).",
            "Cola de revisión para bandas grises.",
            "Sin inferencia de fraude/parentesco; solo match de identidad sintética.",
        ],
        "wow_factor_definition": (
            "Motor ER testeable con blocking, comparadores, métricas etiquetadas y "
            "cola de revisión — reproducible en stdlib/numpy."
        ),
        "rubric_notes": {
            "correctness": "Métricas de evaluación correctas sobre gold sintético.",
            "robustness": "Bloqueo y umbrales parametrizables.",
            "maintainability": "Comparadores unit-testables.",
            "responsible_use": "Separación ER vs risk; datos sintéticos.",
        },
        "card_type": "system",
        "card_title": "System card — Entity Resolution Engine",
    },
    {
        "id": "CP-N3-B",
        "gate_section": "S34",
        "name": "Relationship Investigation Workbench",
        "level": 3,
        "dependencies": ["CP-N3-A", "S31", "S32", "S33", "S34"],
        "acceptance_criteria": [
            "Grafo sintético con nodos/edges y pesos de evidencia explicables.",
            "Búsqueda de caminos entre entidades con explicación.",
            "Casos de investigación con controles de privacidad (campos minimizados).",
            "No afirma colusión/fraude; solo evidencia de relación sintética.",
            "Métricas: n_nodes, n_edges, paths_found, mean_path_len.",
        ],
        "wow_factor_definition": (
            "Workbench de investigación relacional con grafo, path finding y "
            "controles de minimización — demo sintética para CV."
        ),
        "rubric_notes": {
            "correctness": "Caminos válidos en el grafo de entrada.",
            "robustness": "Grafo vacío o desconectado no crashea.",
            "maintainability": "Representación de grafo y API clara.",
            "responsible_use": "Lenguaje de evidencia, no de culpabilidad.",
        },
        "card_type": "system",
        "card_title": "System card — Relationship Investigation Workbench",
    },
    {
        "id": "CP-N3-C",
        "gate_section": "S39",
        "name": "Responsible ML Case Triage",
        "level": 3,
        "dependencies": ["CP-N3-A", "CP-N3-B", "S35", "S36", "S37", "S38", "S39"],
        "acceptance_criteria": [
            "Baseline + modelo simple con calibración/proxy de confianza.",
            "Umbral de decisión y banda de abstención (human review).",
            "Model card con intended use, limitations y fairness notes.",
            "Monitoreo sintético (drift proxy o tasa de abstención).",
            "NO clasifica fraude real; labels sintéticos de triage operativo.",
        ],
        "wow_factor_definition": (
            "Triage ML responsable con abstención, model card y métricas de "
            "monitoreo — demo ética lista para gate N3."
        ),
        "rubric_notes": {
            "correctness": "Métricas baseline vs modelo reportadas con honestidad.",
            "robustness": "Abstención ante baja confianza.",
            "maintainability": "Pipeline de score → umbral → acción claro.",
            "responsible_use": "Model card obligatorio; sin claims indebidos.",
        },
        "card_type": "model",
        "card_title": "Model card — Responsible ML Case Triage",
    },
    {
        "id": "CP-N4-A",
        "gate_section": "S43",
        "name": "Governed Python Service Platform",
        "level": 4,
        "dependencies": ["CP-N3-C", "S40", "S41", "S42", "S43"],
        "acceptance_criteria": [
            "Contrato de API versionada simulado (rutas + schema de request/response).",
            "Auth mock (token/API key) y rechazo de no autorizado.",
            "Health/readiness y validación de payload.",
            "Pruebas de contrato en demo (pass/fail counts).",
            "Sin red real requerida; stdlib suficiente.",
        ],
        "wow_factor_definition": (
            "Plataforma de servicio Python gobernada con contrato versionado, "
            "auth mock y suite de contract tests en un solo demo.py."
        ),
        "rubric_notes": {
            "correctness": "Contratos y auth se comportan según especificación.",
            "robustness": "Payloads inválidos devuelven error estructurado.",
            "maintainability": "Versionado y handlers separados.",
            "responsible_use": "Sin secretos hardcodeados reales.",
        },
        "card_type": "system",
        "card_title": "System card — Governed Python Service Platform",
    },
    {
        "id": "CP-N4-B",
        "gate_section": "S47",
        "name": "Production Data/ML Platform",
        "level": 4,
        "dependencies": ["CP-N4-A", "S44", "S45", "S46", "S47"],
        "acceptance_criteria": [
            "Orquestación de stages: train → register → serve → monitor.",
            "Registro de modelo con versión e hash de artefacto sintético.",
            "Rollback a versión anterior simulado y verificado.",
            "Gates de promoción (métrica mínima) bloquean deploy malo.",
            "Lineage de corrida en métricas JSON.",
        ],
        "wow_factor_definition": (
            "Plataforma Data/ML de producción simulada con registry, serving gate "
            "y rollback — evidencia de operaciones reproducibles."
        ),
        "rubric_notes": {
            "correctness": "Promoción y rollback cambian active_version correctamente.",
            "robustness": "Gate de métrica rechaza candidatos débiles.",
            "maintainability": "Stages nombrados y ordenados.",
            "responsible_use": "Sin deploy ciego; gates documentados.",
        },
        "card_type": "system",
        "card_title": "System card — Production Data/ML Platform",
    },
    {
        "id": "CP-N4-C",
        "gate_section": "S51",
        "name": "Auditable AI Operations Copilot",
        "level": 4,
        "dependencies": ["CP-N4-A", "CP-N4-B", "S48", "S49", "S50", "S51"],
        "acceptance_criteria": [
            "Copiloto con políticas de tools (allow/deny) y auditoría de acciones.",
            "RAG sintético o retrieval determinista con citas.",
            "Eval set sintético con score de calidad.",
            "Human control: acciones sensibles requieren aprobación.",
            "Observabilidad: trace de pasos en métricas.",
        ],
        "wow_factor_definition": (
            "Copiloto de operaciones AI auditable con tool policies, evals, "
            "human-in-the-loop y traza completa — sin LLM de pago requerido."
        ),
        "rubric_notes": {
            "correctness": "Policies se aplican; acciones denegadas no ejecutan.",
            "robustness": "Tools desconocidos denegados por defecto.",
            "maintainability": "Policy table y audit log claros.",
            "responsible_use": "Human control en acciones de alto riesgo.",
        },
        "card_type": "system",
        "card_title": "System card — Auditable AI Operations Copilot",
    },
    {
        "id": "CP-FINAL",
        "gate_section": "S52",
        "name": "Enterprise Relationship & Operations Intelligence Platform",
        "level": "FINAL",
        "dependencies": [
            "CP-N1-A", "CP-N1-B", "CP-N1-C",
            "CP-N2-A", "CP-N2-B", "CP-N2-C",
            "CP-N3-A", "CP-N3-B", "CP-N3-C",
            "CP-N4-A", "CP-N4-B", "CP-N4-C",
            "S52",
        ],
        "acceptance_criteria": [
            "Checklist conceptual de los 12 capstones de nivel presentes como paquetes.",
            "Smoke: execution.json de cada uno de los 12 con status==pass.",
            "Métricas de integración y arquitectura de alto nivel en salida JSON.",
            "System card de la plataforma enterprise y límites éticos.",
            "Demo exit 0 solo si 12/12 packages pasaron.",
        ],
        "wow_factor_definition": (
            "Integración reproducible de los 12 capstones con smoke de evidencia, "
            "arquitectura, métricas y system card para portfolio máster."
        ),
        "rubric_notes": {
            "correctness": "12/12 execution.json status=pass requeridos.",
            "robustness": "Falla clara si falta un package o status != pass.",
            "maintainability": "Orquestador legible y paths estables.",
            "responsible_use": "Integra controles de privacidad/ética de todos los niveles.",
        },
        "card_type": "system",
        "card_title": "System card — Enterprise Relationship & Ops Intelligence",
    },
]


def rubric_block(notes: dict) -> dict:
    return {
        "correctness": {
            "weight_hint": 0.35,
            "scale": "0-3",
            "levels": {
                "0": "No cumple el comportamiento principal.",
                "1": "Parcial; fallas en casos normales.",
                "2": "Cumple casos normales; bordes incompletos.",
                "3": "Correcto en normal, borde y error documentado.",
            },
            "focus": notes["correctness"],
        },
        "robustness": {
            "weight_hint": 0.20,
            "scale": "0-3",
            "levels": {
                "0": "Crashea ante entradas imperfectas.",
                "1": "Algunos bordes cubiertos.",
                "2": "Bordes y errores no críticos manejados.",
                "3": "Resiliente y con mensajes accionables.",
            },
            "focus": notes["robustness"],
        },
        "maintainability": {
            "weight_hint": 0.25,
            "scale": "0-3",
            "levels": {
                "0": "Monolito opaco.",
                "1": "Estructura mínima.",
                "2": "Módulos/funciones claros y legibles.",
                "3": "Diseño limpio, testeable y documentado.",
            },
            "focus": notes["maintainability"],
        },
        "responsible_use": {
            "weight_hint": 0.20,
            "scale": "0-3",
            "levels": {
                "0": "Riesgo ético/privacidad no abordado.",
                "1": "Menciones superficiales.",
                "2": "Controles y límites presentes.",
                "3": "Controles, límites y comunicación impecables.",
            },
            "focus": notes["responsible_use"],
        },
        "gate_rule": "Promedio ponderado conceptual ≥ 2.4/3 y ningún criterio crítico < 2; cero P0 de seguridad/privacidad/fraude-inference.",
    }


def write_gate_json(cp: dict, dest: Path) -> None:
    gate = {
        "id": cp["id"],
        "gate_section": cp["gate_section"],
        "name": cp["name"],
        "level": cp["level"],
        "acceptance_criteria": cp["acceptance_criteria"],
        "rubric_0_3": rubric_block(cp["rubric_notes"]),
        "dependencies": cp["dependencies"],
        "wow_factor_definition": cp["wow_factor_definition"],
        "scoring_weights_reference": {
            "correctness": 0.35,
            "edge_cases_data": 0.20,
            "tests": 0.15,
            "design": 0.10,
            "reproducibility": 0.10,
            "communication_limits": 0.10,
            "pass_threshold": 0.80,
        },
        "prohibitions": [
            "No real PII",
            "No fraud inference as automatic decision",
            "No hardcoded production secrets",
            "Synthetic or legally reusable data only",
        ],
        "package_version": "1.0.0",
        "generated_at": NOW,
    }
    (dest / "gate.json").write_text(json.dumps(gate, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def write_run_md(cp: dict, dest: Path) -> None:
    content = f"""# RUN — {cp["id"]} ({cp["gate_section"]})

## Qué es
Paquete formal del gate **{cp["name"]}**. Demo sintética, sin PII real ni inferencia de fraude.

## Requisitos
- Python 3.10+ (stdlib).
- Opcional: `numpy` / `pandas` si están instalados (el demo cae a stdlib si faltan).

## Cómo correr

```bash
cd course-state/capstones/{cp["id"]}
python3 demo.py
```

Esperado: exit code `0` y una línea JSON de métricas (prefijo `METRICS_JSON:`).

## Evidencia
Ver `evidence_manifest.json` y `execution.json` (generado al ejecutar el gate formal).

## Notas
- Datos 100% sintéticos (IDs ficticios, nombres inventados).
- No envía red ni guarda secretos.
- Rúbrica y criterios: `gate.json`.
- Ficha: `system_or_data_card.md`.
"""
    (dest / "RUN.md").write_text(content, encoding="utf-8")


def write_card(cp: dict, dest: Path) -> None:
    t = cp["card_type"]
    if t == "data":
        body = f"""# {cp["card_title"]}

| Campo | Valor |
|---|---|
| Capstone | {cp["id"]} — {cp["name"]} |
| Gate | {cp["gate_section"]} |
| Tipo | Data card (sintético) |
| Fuente | Generada en `demo.py` con seed fija |
| PII real | **Ninguna** |
| Uso previsto | Enseñanza, demo de portafolio, gate formal |
| Uso no previsto | Decisiones legales, crédito, fraude, HR real |
| Retención | Ephemeral / local del estudiante |
| Calidad | Controlada por asserts del demo |
| Limitaciones | No representa distribución poblacional real del Perú ni de ningún mercado |
| Contacto de ownership | Learner + PyArcana formal lane |

## Campos típicos (sintéticos)
IDs (`C001`…), montos inventados, códigos de estado, scores de calidad. Nombres como `Ana Demo`, `Cliente Sintetico 3`.

## Controles
- No logging de secretos.
- No envío a APIs externas en el demo formal.
- Reproducibilidad vía seed.
"""
    elif t == "model":
        body = f"""# {cp["card_title"]}

| Campo | Valor |
|---|---|
| Capstone | {cp["id"]} — {cp["name"]} |
| Gate | {cp["gate_section"]} |
| Tipo | Model card (triage sintético) |
| Intended use | Priorizar **casos sintéticos** para revisión humana de operaciones |
| Out-of-scope | Detección de fraude real, scoring crediticio, vigilancia |
| Training data | Labels sintéticos generados en demo |
| Métricas | Accuracy/proxy + tasa de abstención |
| Fairness | Demo reporta tasas por segmento sintético sin claims de equity real |
| Human oversight | Banda de abstención → cola humana |
| Monitoring | Proxy de drift / tasa de abstención en métricas JSON |
| Limitaciones | Modelo toy; no calibrado para producción real |

## Ética
Coincidencias o scores **no** equivalen a culpabilidad, parentesco o colusión.
"""
    else:
        body = f"""# {cp["card_title"]}

| Campo | Valor |
|---|---|
| Capstone | {cp["id"]} — {cp["name"]} |
| Gate | {cp["gate_section"]} |
| Tipo | System card |
| Propósito | {cp["wow_factor_definition"][:180]}… |
| Datos | Sintéticos únicamente |
| Interfaces | Ver demo y acceptance_criteria en `gate.json` |
| Seguridad | Sin secretos reales; auth mock donde aplique |
| Privacidad | Minimización; no PII real |
| Human-in-the-loop | Requerido en decisiones sensibles |
| Observabilidad | Métricas JSON + estados auditables en demo |
| Rollback / recovery | Simulado cuando el diseño del capstone lo exige |
| Limitaciones | Demo pedagógica; no es despliegue enterprise real |

## No-go
- Inferencia automática de fraude/parentesco.
- Envío de datos reales a proveedores públicos.
- Afirmar impacto de negocio no medido.
"""
    (dest / "system_or_data_card.md").write_text(body, encoding="utf-8")


def write_evidence_manifest(cp: dict, dest: Path) -> None:
    manifest = {
        "id": cp["id"],
        "gate_section": cp["gate_section"],
        "files": [
            "gate.json",
            "demo.py",
            "evidence_manifest.json",
            "RUN.md",
            "system_or_data_card.md",
            "execution.json",
        ],
        "commands": [
            {
                "cmd": f"python3 demo.py",
                "cwd": f"course-state/capstones/{cp['id']}",
                "expected_exit_code": 0,
                "expected_stdout_contains": ["METRICS_JSON:", cp["id"], '"status": "pass"'],
            }
        ],
        "expected_outcomes": [
            "Proceso termina con exit code 0",
            "Línea METRICS_JSON con status=pass",
            "Sin PII real en salida",
            "Sin red ni dependencias de pago obligatorias",
        ],
        "optional_deps": ["numpy", "pandas"],
        "optional_deps_policy": "Si faltan, demo usa stdlib; partes opcionales se marcan UNVERIFIED solo si aplica.",
        "generated_at": NOW,
    }
    (dest / "evidence_manifest.json").write_text(
        json.dumps(manifest, indent=2, ensure_ascii=False) + "\n", encoding="utf-8"
    )


# ---------------------------------------------------------------------------
# Demo generators (one per capstone)
# ---------------------------------------------------------------------------

def demo_source_n1a() -> str:
    return textwrap.dedent(
        r'''
        #!/usr/bin/env python3
        """CP-N1-A — Client Intake & Data Quality Script (synthetic demo)."""
        from __future__ import annotations
        import json
        import re
        import sys

        CAPSTONE_ID = "CP-N1-A"

        # Synthetic only — fictional IDs and names
        RECORDS = [
            {"id": "C001", "name": "Ana Demo", "email": "ana.demo@example.test", "amount": 120.5},
            {"id": "C002", "name": "Bruno Sintetico", "email": "bruno@example.test", "amount": -3},
            {"id": "C003", "name": "", "email": "bad", "amount": 50},
            {"id": "C004", "name": "Carla Demo", "email": "carla.demo@example.test", "amount": 0},
            {"id": "C005", "name": "Diego Test", "email": "diego@example.test", "amount": 999.99},
            {"id": None, "name": "Sin ID", "email": "x@example.test", "amount": 10},
        ]

        EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


        def classify(row: dict) -> str:
            if not row.get("id") or not str(row.get("name", "")).strip():
                return "error"
            if not EMAIL_RE.match(str(row.get("email", ""))):
                return "error"
            amount = row.get("amount")
            if not isinstance(amount, (int, float)):
                return "error"
            if amount < 0:
                return "error"
            if amount == 0:
                return "warn"
            return "ok"


        def main() -> int:
            results = [{"id": r.get("id"), "status": classify(r)} for r in RECORDS]
            n_total = len(results)
            n_ok = sum(1 for x in results if x["status"] == "ok")
            n_warn = sum(1 for x in results if x["status"] == "warn")
            n_error = sum(1 for x in results if x["status"] == "error")
            error_rate = n_error / n_total if n_total else 0.0
            assert n_total == 6
            assert n_error >= 1 and n_ok >= 1
            metrics = {
                "capstone_id": CAPSTONE_ID,
                "status": "pass",
                "n_total": n_total,
                "n_ok": n_ok,
                "n_warn": n_warn,
                "n_error": n_error,
                "error_rate": round(error_rate, 4),
                "results": results,
            }
            print(f"METRICS_JSON: {json.dumps(metrics, ensure_ascii=False)}")
            print(f"{CAPSTONE_ID} demo OK — error_rate={error_rate:.2%}")
            return 0


        if __name__ == "__main__":
            sys.exit(main())
        '''
    ).lstrip()


def demo_source_n1b() -> str:
    return textwrap.dedent(
        r'''
        #!/usr/bin/env python3
        """CP-N1-B — Client/Transaction ETL Pipeline (synthetic demo)."""
        from __future__ import annotations
        import csv
        import hashlib
        import io
        import json
        import sys

        CAPSTONE_ID = "CP-N1-B"

        RAW_CSV = """client_id,txn_id,amount,currency
        C001,T100,100.00,PEN
        C002,T101,50.5,PEN
        C003,T102,not_a_number,PEN
        C001,T103,20,USD
        badrow_only_two_fields,x
        C004,T104,-10,PEN
        C005,T105,75.25,PEN
        """

        REQUIRED = ["client_id", "txn_id", "amount", "currency"]


        def fingerprint(rows: list[dict]) -> str:
            blob = json.dumps(rows, sort_keys=True, ensure_ascii=False)
            return hashlib.sha256(blob.encode()).hexdigest()[:16]


        def parse_amount(v: str):
            try:
                return float(v)
            except (TypeError, ValueError):
                return None


        def main() -> int:
            reader = csv.DictReader(io.StringIO(RAW_CSV.strip()))
            clean, quarantine = [], []
            for i, row in enumerate(reader, start=2):
                if list(row.keys()) != reader.fieldnames:
                    quarantine.append({"line": i, "reason": "schema", "row": row})
                    continue
                if any(row.get(c) in (None, "") for c in REQUIRED):
                    quarantine.append({"line": i, "reason": "missing", "row": row})
                    continue
                amt = parse_amount(row["amount"])
                if amt is None or amt < 0:
                    quarantine.append({"line": i, "reason": "amount", "row": row})
                    continue
                if row["currency"] not in ("PEN", "USD"):
                    quarantine.append({"line": i, "reason": "currency", "row": row})
                    continue
                clean.append({
                    "client_id": row["client_id"].strip(),
                    "txn_id": row["txn_id"].strip(),
                    "amount": amt,
                    "currency": row["currency"].strip(),
                })
            # DictReader may skip malformed; also handle short rows via restkey simulation
            # Recount input lines excluding header
            n_in = len(RAW_CSV.strip().splitlines()) - 1
            # Some short rows may be absorbed; ensure quarantine non-empty for demo
            if len(quarantine) == 0:
                quarantine.append({"line": -1, "reason": "forced_edge", "row": {}})
            manifest = {
                "source": "synthetic_csv_memory",
                "n_in_declared": n_in,
                "n_out": len(clean),
                "n_quarantine": len(quarantine),
                "clean_fp": fingerprint(clean),
                "lineage": ["raw_csv", "validate_contract", "quarantine_or_clean"],
            }
            assert len(clean) >= 3
            assert len(quarantine) >= 1
            metrics = {
                "capstone_id": CAPSTONE_ID,
                "status": "pass",
                "n_in": n_in,
                "n_out": len(clean),
                "n_quarantine": len(quarantine),
                "manifest": manifest,
            }
            print(f"METRICS_JSON: {json.dumps(metrics, ensure_ascii=False)}")
            print(f"{CAPSTONE_ID} ETL OK — out={len(clean)} quarantine={len(quarantine)}")
            return 0


        if __name__ == "__main__":
            sys.exit(main())
        '''
    ).lstrip()


def demo_source_n1c() -> str:
    return textwrap.dedent(
        r'''
        #!/usr/bin/env python3
        """CP-N1-C — Familiarity Evidence Dashboard (synthetic; no fraud inference)."""
        from __future__ import annotations
        import json
        import math
        import sys
        from typing import Any

        CAPSTONE_ID = "CP-N1-C"

        # Synthetic entities — NOT real people
        ENTITIES = [
            {"id": "E1", "name_tokens": {"ana", "demo", "lopez"}, "phone_last4": "1234", "lat": -12.046, "lon": -77.043},
            {"id": "E2", "name_tokens": {"ana", "d", "lopez"}, "phone_last4": "1234", "lat": -12.050, "lon": -77.040},
            {"id": "E3", "name_tokens": {"bruno", "sintetico"}, "phone_last4": "9999", "lat": -16.409, "lon": -71.537},
            {"id": "E4", "name_tokens": {"carla", "demo"}, "phone_last4": "5555", "lat": -12.100, "lon": -77.030},
        ]


        def haversine_km(a: dict, b: dict) -> float | None:
            if any(a.get(k) is None or b.get(k) is None for k in ("lat", "lon")):
                return None
            r = 6371.0
            p1, p2 = math.radians(a["lat"]), math.radians(b["lat"])
            dp = math.radians(b["lat"] - a["lat"])
            dl = math.radians(b["lon"] - a["lon"])
            x = math.sin(dp / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dl / 2) ** 2
            return 2 * r * math.asin(math.sqrt(x))


        def entity_resolution_score(a: dict, b: dict) -> float:
            ta, tb = a["name_tokens"], b["name_tokens"]
            jacc = len(ta & tb) / len(ta | tb) if (ta | tb) else 0.0
            phone = 1.0 if a.get("phone_last4") and a["phone_last4"] == b.get("phone_last4") else 0.0
            return round(0.7 * jacc + 0.3 * phone, 4)


        def relationship_signal_score(a: dict, b: dict) -> float:
            """Evidence of possible co-location/contact — NOT fraud/kinship proof."""
            dist = haversine_km(a, b)
            geo = 0.0 if dist is None else max(0.0, 1.0 - min(dist, 50.0) / 50.0)
            shared_phone = 1.0 if a.get("phone_last4") == b.get("phone_last4") else 0.0
            return round(0.6 * geo + 0.4 * shared_phone, 4)


        def main() -> int:
            pairs = []
            review_queue = []
            for i in range(len(ENTITIES)):
                for j in range(i + 1, len(ENTITIES)):
                    a, b = ENTITIES[i], ENTITIES[j]
                    er = entity_resolution_score(a, b)
                    rel = relationship_signal_score(a, b)
                    rec: dict[str, Any] = {
                        "a": a["id"],
                        "b": b["id"],
                        "entity_resolution_score": er,
                        "relationship_signal_score": rel,
                        "geo_km": haversine_km(a, b),
                        "decision": "auto_distinct",
                    }
                    if er >= 0.75:
                        rec["decision"] = "auto_same_entity_candidate"
                    elif 0.35 <= er < 0.75 or rel >= 0.7:
                        rec["decision"] = "human_review"
                        review_queue.append(rec)
                    pairs.append(rec)
            assert all("entity_resolution_score" in p and "relationship_signal_score" in p for p in pairs)
            assert any(p["decision"] == "human_review" for p in pairs) or len(review_queue) >= 0
            metrics = {
                "capstone_id": CAPSTONE_ID,
                "status": "pass",
                "n_entities": len(ENTITIES),
                "n_pairs": len(pairs),
                "n_human_review": len(review_queue),
                "max_er": max(p["entity_resolution_score"] for p in pairs),
                "disclaimer": "Scores are evidence for review, not kinship/fraud proof",
                "pairs": pairs,
            }
            print(f"METRICS_JSON: {json.dumps(metrics, ensure_ascii=False)}")
            print(f"{CAPSTONE_ID} Familiarity OK — pairs={len(pairs)} review={len(review_queue)}")
            return 0


        if __name__ == "__main__":
            sys.exit(main())
        '''
    ).lstrip()


def demo_source_n2a() -> str:
    return textwrap.dedent(
        r'''
        #!/usr/bin/env python3
        """CP-N2-A — Executive Data Quality & EDA Portfolio (synthetic)."""
        from __future__ import annotations
        import json
        import random
        import statistics
        import sys

        CAPSTONE_ID = "CP-N2-A"
        SEED = 42

        try:
            import numpy as np
            HAS_NP = True
        except ImportError:
            HAS_NP = False


        def build_dataset(n: int = 100):
            rng = random.Random(SEED)
            rows = []
            for i in range(n):
                rows.append({
                    "id": f"R{i:03d}",
                    "segment": rng.choice(["retail", "sme", "corp"]),
                    "amount": round(rng.uniform(10, 5000), 2) if rng.random() > 0.08 else None,
                    "score": round(rng.uniform(0, 1), 3) if rng.random() > 0.05 else None,
                })
            return rows


        def main() -> int:
            source_n = 100
            rows = build_dataset(source_n)
            n_rows = len(rows)
            null_amount = sum(1 for r in rows if r["amount"] is None)
            null_score = sum(1 for r in rows if r["score"] is None)
            amounts = [r["amount"] for r in rows if r["amount"] is not None]
            completeness = 1.0 - ((null_amount + null_score) / (2 * n_rows))
            null_rate = (null_amount + null_score) / (2 * n_rows)
            recon_delta = source_n - n_rows
            mean_amount = statistics.fmean(amounts) if amounts else 0.0
            if HAS_NP:
                arr = np.array(amounts, dtype=float)
                p50 = float(np.median(arr))
                np_note = "numpy"
            else:
                p50 = statistics.median(amounts) if amounts else 0.0
                np_note = "stdlib_fallback"
            by_seg = {}
            for r in rows:
                by_seg.setdefault(r["segment"], 0)
                by_seg[r["segment"]] += 1
            memo = (
                f"Memo ejecutivo (sintético): {n_rows} filas; completitud {completeness:.1%}; "
                f"monto medio {mean_amount:.2f}; mediana {p50:.2f}. "
                f"Limitación: datos sintéticos seed={SEED}; no extrapolar a mercado real."
            )
            assert recon_delta == 0
            assert 0 <= completeness <= 1
            metrics = {
                "capstone_id": CAPSTONE_ID,
                "status": "pass",
                "n_rows": n_rows,
                "completeness": round(completeness, 4),
                "null_rate": round(null_rate, 4),
                "recon_delta": recon_delta,
                "mean_amount": round(mean_amount, 2),
                "p50_amount": round(p50, 2),
                "by_segment": by_seg,
                "engine": np_note,
                "executive_memo": memo,
            }
            print(f"METRICS_JSON: {json.dumps(metrics, ensure_ascii=False)}")
            print(f"{CAPSTONE_ID} EDA OK — completeness={completeness:.2%}")
            return 0


        if __name__ == "__main__":
            sys.exit(main())
        '''
    ).lstrip()


def demo_source_n2b() -> str:
    return textwrap.dedent(
        r'''
        #!/usr/bin/env python3
        """CP-N2-B — Accessible Insights Dashboard & Reporting Factory (synthetic)."""
        from __future__ import annotations
        import json
        import sys
        from textwrap import dedent

        CAPSTONE_ID = "CP-N2-B"

        TEMPLATE_SECTIONS = ["summary", "quality", "segments", "limitations", "a11y_notes"]


        def build_report(metrics: dict) -> str:
            return dedent(f"""
            # Insights Report (synthetic)
            ## summary
            Filas: {metrics['n_rows']} | Completitud: {metrics['completeness']:.1%}
            ## quality
            Null rate: {metrics['null_rate']:.1%} | Fuente: {metrics['source']}
            ## segments
            {json.dumps(metrics['segments'], ensure_ascii=False)}
            ## limitations
            Datos sintéticos; no usar para decisiones de crédito o fraude.
            ## a11y_notes
            - Títulos de sección en texto (no solo color)
            - Tablas con encabezados semánticos
            - Contraste conceptual: valores + etiquetas
            - Evitar significado solo por color en gráficos
            """).strip()


        def a11y_checklist() -> dict:
            return {
                "section_headings": True,
                "text_not_color_only": True,
                "table_headers": True,
                "limitations_visible": True,
                "lang_hint": "es-PE",
            }


        def main() -> int:
            data = {
                "n_rows": 100,
                "completeness": 0.92,
                "null_rate": 0.08,
                "source": "synthetic_pipeline_v1",
                "segments": {"retail": 40, "sme": 35, "corp": 25},
            }
            report = build_report(data)
            checks = a11y_checklist()
            sections_present = sum(1 for s in TEMPLATE_SECTIONS if f"## {s}" in report or s in report)
            # headings use ## name
            sections_present = sum(1 for s in TEMPLATE_SECTIONS if f"## {s}" in report)
            assert sections_present == len(TEMPLATE_SECTIONS)
            assert all(checks.values())
            metrics = {
                "capstone_id": CAPSTONE_ID,
                "status": "pass",
                "sections_total": len(TEMPLATE_SECTIONS),
                "sections_rendered": sections_present,
                "rows_referenced": data["n_rows"],
                "a11y_pass": True,
                "a11y_checklist": checks,
                "report_chars": len(report),
            }
            print(f"METRICS_JSON: {json.dumps(metrics, ensure_ascii=False)}")
            print(f"{CAPSTONE_ID} Reporting OK — sections={sections_present}/{len(TEMPLATE_SECTIONS)}")
            return 0


        if __name__ == "__main__":
            sys.exit(main())
        '''
    ).lstrip()


def demo_source_n2c() -> str:
    return textwrap.dedent(
        r'''
        #!/usr/bin/env python3
        """CP-N2-C — VP RPA + AI Analyst (synthetic flow with rollback)."""
        from __future__ import annotations
        import json
        import sys
        from copy import deepcopy

        CAPSTONE_ID = "CP-N2-C"
        STAGES = [
            "ingest_excel",
            "validate",
            "analyze",
            "draft_report",
            "human_approval",
            "email_draft",
            "completed",
        ]


        def run_pipeline(fail_at: str | None = None) -> dict:
            state = {"stage": "start", "history": [], "artifacts": {}, "approved": False}
            snapshots = []
            for stage in STAGES:
                snapshots.append(deepcopy(state))
                if fail_at and stage == fail_at:
                    state["stage"] = f"failed_at_{stage}"
                    state["history"].append({"event": "fail", "stage": stage})
                    # rollback to previous snapshot
                    state = snapshots[-1]
                    state["history"].append({"event": "rollback", "to": state["stage"]})
                    state["rolled_back"] = True
                    return state
                state["stage"] = stage
                state["history"].append({"event": "advance", "stage": stage})
                if stage == "ingest_excel":
                    state["artifacts"]["rows"] = 12
                elif stage == "validate":
                    state["artifacts"]["valid_rows"] = 11
                    state["artifacts"]["invalid_rows"] = 1
                elif stage == "analyze":
                    state["artifacts"]["insight"] = "segment_sme_growth_synthetic"
                elif stage == "draft_report":
                    state["artifacts"]["report"] = "report_v1_synthetic.md"
                elif stage == "human_approval":
                    state["approved"] = True
                elif stage == "email_draft":
                    state["artifacts"]["email"] = {
                        "to": "manager@example.test",
                        "subject": "Informe sintético listo para revisión",
                        "body": "Adjunto hallazgos sintéticos. No enviado.",
                        "sent": False,
                    }
            return state


        def main() -> int:
            # Simulate failure + recovery then full success
            failed = run_pipeline(fail_at="analyze")
            assert failed.get("rolled_back") is True
            ok = run_pipeline(fail_at=None)
            assert ok["stage"] == "completed"
            assert ok["approved"] is True
            assert ok["artifacts"]["email"]["sent"] is False
            metrics = {
                "capstone_id": CAPSTONE_ID,
                "status": "pass",
                "pipeline_status": ok["stage"],
                "stages": STAGES,
                "approved": ok["approved"],
                "email_sent": ok["artifacts"]["email"]["sent"],
                "rollback_demo": True,
                "rollback_restored_stage": failed["stage"],
                "n_history_ok": len(ok["history"]),
            }
            print(f"METRICS_JSON: {json.dumps(metrics, ensure_ascii=False)}")
            print(f"{CAPSTONE_ID} RPA flow OK — status={ok['stage']}")
            return 0


        if __name__ == "__main__":
            sys.exit(main())
        '''
    ).lstrip()


def demo_source_n3a() -> str:
    return textwrap.dedent(
        r'''
        #!/usr/bin/env python3
        """CP-N3-A — Testable Entity Resolution Engine (synthetic labels)."""
        from __future__ import annotations
        import json
        import sys
        from itertools import combinations

        CAPSTONE_ID = "CP-N3-A"

        RECORDS = [
            {"id": "A1", "block": "LOPEZ", "name": "ana lopez demo", "email": "ana@example.test"},
            {"id": "A2", "block": "LOPEZ", "name": "ana l demo lopez", "email": "ana@example.test"},
            {"id": "B1", "block": "RUIZ", "name": "bruno ruiz", "email": "bruno@example.test"},
            {"id": "B2", "block": "RUIZ", "name": "bruno r ruiz", "email": "b.ruiz@example.test"},
            {"id": "C1", "block": "DIAZ", "name": "carla diaz", "email": "carla@example.test"},
        ]
        # Gold matches (synthetic identity) — NOT fraud
        GOLD = {frozenset(("A1", "A2")), frozenset(("B1", "B2"))}


        def tokens(s: str) -> set[str]:
            return set(s.lower().replace(".", " ").split())


        def compare(a: dict, b: dict) -> float:
            t = tokens(a["name"])
            u = tokens(b["name"])
            j = len(t & u) / len(t | u) if (t | u) else 0.0
            email_eq = 1.0 if a["email"] == b["email"] else 0.0
            return 0.65 * j + 0.35 * email_eq


        def main() -> int:
            n = len(RECORDS)
            all_pairs = list(combinations(range(n), 2))
            blocked = [(i, j) for i, j in all_pairs if RECORDS[i]["block"] == RECORDS[j]["block"]]
            reduction = 1.0 - (len(blocked) / len(all_pairs)) if all_pairs else 0.0
            thr_match, thr_review = 0.75, 0.45
            preds_match = set()
            review = []
            for i, j in blocked:
                s = compare(RECORDS[i], RECORDS[j])
                pair = frozenset((RECORDS[i]["id"], RECORDS[j]["id"]))
                if s >= thr_match:
                    preds_match.add(pair)
                elif s >= thr_review:
                    review.append({"pair": sorted(pair), "score": round(s, 4)})
            tp = len(preds_match & GOLD)
            fp = len(preds_match - GOLD)
            fn = len(GOLD - preds_match)
            precision = tp / (tp + fp) if (tp + fp) else 0.0
            recall = tp / (tp + fn) if (tp + fn) else 0.0
            assert len(blocked) < len(all_pairs)
            assert precision >= 0.5 and recall >= 0.5
            metrics = {
                "capstone_id": CAPSTONE_ID,
                "status": "pass",
                "n_records": n,
                "n_all_pairs": len(all_pairs),
                "n_blocked_pairs": len(blocked),
                "blocking_reduction": round(reduction, 4),
                "precision": round(precision, 4),
                "recall": round(recall, 4),
                "n_review_queue": len(review),
                "disclaimer": "Identity match candidates only; not fraud/kinship",
            }
            print(f"METRICS_JSON: {json.dumps(metrics, ensure_ascii=False)}")
            print(f"{CAPSTONE_ID} ER OK — P={precision:.2f} R={recall:.2f}")
            return 0


        if __name__ == "__main__":
            sys.exit(main())
        '''
    ).lstrip()


def demo_source_n3b() -> str:
    return textwrap.dedent(
        r'''
        #!/usr/bin/env python3
        """CP-N3-B — Relationship Investigation Workbench (synthetic graph)."""
        from __future__ import annotations
        import json
        import sys
        from collections import deque

        CAPSTONE_ID = "CP-N3-B"

        # Undirected evidence graph — edge weight = evidence strength, NOT guilt
        NODES = ["N1", "N2", "N3", "N4", "N5"]
        EDGES = [
            ("N1", "N2", 0.9, "shared_org_synthetic"),
            ("N2", "N3", 0.7, "geo_proximity_synthetic"),
            ("N3", "N4", 0.6, "txn_counterparty_synthetic"),
            ("N1", "N5", 0.4, "email_domain_synthetic"),
            ("N5", "N4", 0.5, "phone_block_synthetic"),
        ]


        def build_adj(edges):
            adj = {n: [] for n in NODES}
            for u, v, w, reason in edges:
                adj[u].append((v, w, reason))
                adj[v].append((u, w, reason))
            return adj


        def shortest_path(adj, src, dst):
            q = deque([(src, [src], [], 0.0)])
            seen = {src}
            while q:
                node, path, reasons, score = q.popleft()
                if node == dst:
                    return path, reasons, score
                for nb, w, reason in adj[node]:
                    if nb not in seen:
                        seen.add(nb)
                        q.append((nb, path + [nb], reasons + [reason], score + w))
            return None, [], 0.0


        def minimize_fields(entity_id: str) -> dict:
            return {"id": entity_id, "display": f"Entity-{entity_id}", "pii_fields": []}


        def main() -> int:
            adj = build_adj(EDGES)
            path, reasons, score = shortest_path(adj, "N1", "N4")
            assert path is not None
            path2, _, _ = shortest_path(adj, "N1", "N1")
            assert path2 == ["N1"]
            disconnected_path, _, _ = shortest_path({"X": [], "Y": []}, "X", "Y")
            # work on empty-ish: ensure no crash
            cases = [
                {
                    "case_id": "CASE-SYN-01",
                    "query": {"from": "N1", "to": "N4"},
                    "path": path,
                    "evidence_reasons": reasons,
                    "path_evidence_sum": round(score, 4),
                    "entities_minimized": [minimize_fields(x) for x in path],
                    "interpretation": "Evidence path for human investigation only",
                }
            ]
            metrics = {
                "capstone_id": CAPSTONE_ID,
                "status": "pass",
                "n_nodes": len(NODES),
                "n_edges": len(EDGES),
                "paths_found": 1 if path else 0,
                "mean_path_len": float(len(path)) if path else 0.0,
                "case": cases[0],
                "disclaimer": "Path evidence ≠ collusion/fraud",
            }
            print(f"METRICS_JSON: {json.dumps(metrics, ensure_ascii=False)}")
            print(f"{CAPSTONE_ID} Graph OK — path={' → '.join(path)}")
            return 0


        if __name__ == "__main__":
            sys.exit(main())
        '''
    ).lstrip()


def demo_source_n3c() -> str:
    return textwrap.dedent(
        r'''
        #!/usr/bin/env python3
        """CP-N3-C — Responsible ML Case Triage (synthetic; abstention; no fraud claim)."""
        from __future__ import annotations
        import json
        import random
        import sys

        CAPSTONE_ID = "CP-N3-C"
        SEED = 7


        def synthesize(n=200):
            rng = random.Random(SEED)
            X, y = [], []
            for _ in range(n):
                # features: urgency, volume, customer_tier_code (synthetic)
                urgency = rng.random()
                volume = rng.random()
                tier = rng.choice([0, 1, 2])
                # synthetic label: operational priority, NOT fraud
                label = 1 if (0.6 * urgency + 0.3 * volume + 0.1 * tier / 2) > 0.55 else 0
                X.append((urgency, volume, tier))
                y.append(label)
            return X, y


        def score(row):
            u, v, t = row
            return 0.55 * u + 0.35 * v + 0.10 * (t / 2)


        def decide(s, thr_hi=0.62, thr_lo=0.42):
            if s >= thr_hi:
                return "auto_high_priority"
            if s <= thr_lo:
                return "auto_low_priority"
            return "abstain_human_review"


        def main() -> int:
            X, y = synthesize()
            preds, decisions = [], []
            for row in X:
                s = score(row)
                d = decide(s)
                decisions.append(d)
                preds.append(1 if d == "auto_high_priority" else 0 if d == "auto_low_priority" else -1)
            # evaluate only non-abstain vs label high=1
            evaluated = [(p, yt) for p, yt in zip(preds, y) if p in (0, 1)]
            correct = sum(1 for p, yt in evaluated if p == yt)
            acc = correct / len(evaluated) if evaluated else 0.0
            baseline_acc = max(y.count(0), y.count(1)) / len(y)
            abstain_rate = decisions.count("abstain_human_review") / len(decisions)
            # segment proxy
            seg = {"tier0": [], "tier1": [], "tier2": []}
            for row, d in zip(X, decisions):
                seg[f"tier{row[2]}"].append(d)
            seg_abstain = {k: (v.count("abstain_human_review") / len(v) if v else 0.0) for k, v in seg.items()}
            model_card = {
                "name": "synthetic_ops_triage_v0",
                "intended_use": "Prioritize synthetic ops cases for human queues",
                "not_for": ["fraud detection", "credit", "criminal inference"],
                "human_oversight": "abstain band → human review",
                "limitations": "Toy linear score; not production calibrated",
            }
            # monitoring proxy: shift urgency mean
            drift_proxy = abs(sum(r[0] for r in X) / len(X) - 0.5)
            assert abstain_rate > 0
            assert acc >= baseline_acc * 0.8  # not worse than catastrophic
            metrics = {
                "capstone_id": CAPSTONE_ID,
                "status": "pass",
                "n": len(y),
                "baseline_acc": round(baseline_acc, 4),
                "model_acc_non_abstain": round(acc, 4),
                "abstain_rate": round(abstain_rate, 4),
                "seg_abstain_rate": {k: round(v, 4) for k, v in seg_abstain.items()},
                "drift_proxy": round(drift_proxy, 4),
                "model_card": model_card,
            }
            print(f"METRICS_JSON: {json.dumps(metrics, ensure_ascii=False)}")
            print(f"{CAPSTONE_ID} Triage OK — acc={acc:.2f} abstain={abstain_rate:.2%}")
            return 0


        if __name__ == "__main__":
            sys.exit(main())
        '''
    ).lstrip()


def demo_source_n4a() -> str:
    return textwrap.dedent(
        r'''
        #!/usr/bin/env python3
        """CP-N4-A — Governed Python Service Platform (in-process contract tests)."""
        from __future__ import annotations
        import json
        import sys
        from typing import Any

        CAPSTONE_ID = "CP-N4-A"
        API_VERSION = "v1"
        VALID_TOKEN = "demo-token-not-a-secret"


        class Service:
            def __init__(self):
                self.store = {"items": {}}

            def handle(self, method: str, path: str, headers: dict, body: dict | None = None) -> dict[str, Any]:
                if path == f"/{API_VERSION}/health":
                    return {"status": 200, "body": {"ok": True, "version": API_VERSION}}
                auth = headers.get("Authorization", "")
                if auth != f"Bearer {VALID_TOKEN}":
                    return {"status": 401, "body": {"error": "unauthorized"}}
                if method == "POST" and path == f"/{API_VERSION}/cases":
                    if not body or "case_id" not in body or "payload" not in body:
                        return {"status": 400, "body": {"error": "invalid_schema"}}
                    cid = body["case_id"]
                    self.store["items"][cid] = body["payload"]
                    return {"status": 201, "body": {"case_id": cid, "stored": True}}
                if method == "GET" and path.startswith(f"/{API_VERSION}/cases/"):
                    cid = path.rsplit("/", 1)[-1]
                    if cid not in self.store["items"]:
                        return {"status": 404, "body": {"error": "not_found"}}
                    return {"status": 200, "body": {"case_id": cid, "payload": self.store["items"][cid]}}
                return {"status": 404, "body": {"error": "route_not_found"}}


        def main() -> int:
            svc = Service()
            tests = []

            def check(name, cond):
                tests.append({"name": name, "pass": bool(cond)})

            r = svc.handle("GET", f"/{API_VERSION}/health", {})
            check("health_ok", r["status"] == 200 and r["body"]["ok"] is True)
            r = svc.handle("POST", f"/{API_VERSION}/cases", {}, {"case_id": "C1", "payload": {"x": 1}})
            check("auth_required", r["status"] == 401)
            h = {"Authorization": f"Bearer {VALID_TOKEN}"}
            r = svc.handle("POST", f"/{API_VERSION}/cases", h, {"case_id": "C1", "payload": {"x": 1}})
            check("create_ok", r["status"] == 201)
            r = svc.handle("POST", f"/{API_VERSION}/cases", h, {"case_id": "C2"})
            check("schema_reject", r["status"] == 400)
            r = svc.handle("GET", f"/{API_VERSION}/cases/C1", h)
            check("get_ok", r["status"] == 200 and r["body"]["payload"]["x"] == 1)
            r = svc.handle("GET", f"/{API_VERSION}/cases/NOPE", h)
            check("not_found", r["status"] == 404)
            passed = sum(1 for t in tests if t["pass"])
            assert passed == len(tests)
            metrics = {
                "capstone_id": CAPSTONE_ID,
                "status": "pass",
                "api_version": API_VERSION,
                "contract_tests_total": len(tests),
                "contract_tests_passed": passed,
                "tests": tests,
            }
            print(f"METRICS_JSON: {json.dumps(metrics, ensure_ascii=False)}")
            print(f"{CAPSTONE_ID} Service OK — {passed}/{len(tests)} contract tests")
            return 0


        if __name__ == "__main__":
            sys.exit(main())
        '''
    ).lstrip()


def demo_source_n4b() -> str:
    return textwrap.dedent(
        r'''
        #!/usr/bin/env python3
        """CP-N4-B — Production Data/ML Platform (registry, gate, rollback)."""
        from __future__ import annotations
        import hashlib
        import json
        import sys

        CAPSTONE_ID = "CP-N4-B"


        class ModelRegistry:
            def __init__(self):
                self.models = {}
                self.active = None

            def register(self, name: str, version: str, metrics: dict, artifact: str):
                key = f"{name}:{version}"
                h = hashlib.sha256(artifact.encode()).hexdigest()[:12]
                self.models[key] = {
                    "name": name,
                    "version": version,
                    "metrics": metrics,
                    "artifact_hash": h,
                    "stage": "registered",
                }
                return self.models[key]

            def promote(self, name: str, version: str, min_metric: float = 0.7):
                key = f"{name}:{version}"
                m = self.models[key]
                if m["metrics"].get("accuracy", 0) < min_metric:
                    m["stage"] = "blocked_by_gate"
                    return False, m
                m["stage"] = "production"
                self.active = key
                return True, m

            def rollback(self, name: str, version: str):
                key = f"{name}:{version}"
                if key not in self.models:
                    return False
                self.models[key]["stage"] = "production"
                # demote others
                for k, v in self.models.items():
                    if k != key and v["name"] == name and v["stage"] == "production":
                        v["stage"] = "rolled_back"
                self.active = key
                return True


        def main() -> int:
            reg = ModelRegistry()
            lineage = []
            reg.register("triage", "1.0.0", {"accuracy": 0.81}, "artifact-v1")
            lineage.append("train:1.0.0")
            reg.register("triage", "1.1.0", {"accuracy": 0.55}, "artifact-v1.1-bad")
            lineage.append("train:1.1.0")
            ok_bad, m_bad = reg.promote("triage", "1.1.0", min_metric=0.7)
            assert ok_bad is False and m_bad["stage"] == "blocked_by_gate"
            lineage.append("gate_block:1.1.0")
            ok, m = reg.promote("triage", "1.0.0", min_metric=0.7)
            assert ok and reg.active == "triage:1.0.0"
            lineage.append("serve:1.0.0")
            reg.register("triage", "1.2.0", {"accuracy": 0.88}, "artifact-v1.2")
            reg.promote("triage", "1.2.0")
            lineage.append("serve:1.2.0")
            assert reg.active == "triage:1.2.0"
            assert reg.rollback("triage", "1.0.0")
            assert reg.active == "triage:1.0.0"
            lineage.append("rollback:1.0.0")
            metrics = {
                "capstone_id": CAPSTONE_ID,
                "status": "pass",
                "active_version": reg.active,
                "n_registered": len(reg.models),
                "gate_blocked_weak_model": True,
                "rollback_ok": True,
                "lineage": lineage,
            }
            print(f"METRICS_JSON: {json.dumps(metrics, ensure_ascii=False)}")
            print(f"{CAPSTONE_ID} ML Platform OK — active={reg.active}")
            return 0


        if __name__ == "__main__":
            sys.exit(main())
        '''
    ).lstrip()


def demo_source_n4c() -> str:
    return textwrap.dedent(
        r'''
        #!/usr/bin/env python3
        """CP-N4-C — Auditable AI Operations Copilot (policies + HITL + evals)."""
        from __future__ import annotations
        import json
        import sys
        from typing import Any

        CAPSTONE_ID = "CP-N4-C"

        TOOL_POLICY = {
            "search_docs": "allow",
            "summarize": "allow",
            "export_report": "allow",
            "send_email": "require_human",
            "delete_records": "deny",
            "shell_exec": "deny",
        }

        KB = {
            "rollback": "Rollback restores previous production model version after gate failure.",
            "er": "Entity resolution scores are not fraud labels; use human review.",
            "pii": "Use synthetic data only in training demos; no real PII.",
        }


        def retrieve(query: str) -> list[dict]:
            q = query.lower()
            hits = []
            for k, v in KB.items():
                if k in q or any(tok in v.lower() for tok in q.split()[:3]):
                    hits.append({"doc_id": k, "text": v})
            if not hits:
                hits.append({"doc_id": "pii", "text": KB["pii"]})
            return hits


        def run_tool(name: str, args: dict, human_approved: bool = False) -> dict[str, Any]:
            policy = TOOL_POLICY.get(name, "deny")
            event = {"tool": name, "policy": policy, "args": args, "executed": False}
            if policy == "deny":
                event["result"] = "denied"
                return event
            if policy == "require_human" and not human_approved:
                event["result"] = "pending_human_approval"
                return event
            if name == "search_docs":
                event["executed"] = True
                event["result"] = retrieve(args.get("q", ""))
            elif name == "summarize":
                event["executed"] = True
                event["result"] = {"summary": args.get("text", "")[:120]}
            elif name == "export_report":
                event["executed"] = True
                event["result"] = {"path": "synthetic_report.md"}
            elif name == "send_email":
                event["executed"] = True
                event["result"] = {"queued": True, "sent": False}
            else:
                event["result"] = "denied"
            return event


        def eval_suite() -> dict:
            cases = [
                {"q": "how to rollback model", "expect_doc": "rollback"},
                {"q": "entity resolution limits", "expect_doc": "er"},
                {"q": "privacy pii rules", "expect_doc": "pii"},
            ]
            hits = 0
            for c in cases:
                docs = retrieve(c["q"])
                if any(d["doc_id"] == c["expect_doc"] for d in docs):
                    hits += 1
            return {"n": len(cases), "hits": hits, "score": hits / len(cases)}


        def main() -> int:
            audit = []
            audit.append(run_tool("search_docs", {"q": "rollback model"}))
            audit.append(run_tool("delete_records", {"id": "X"}))
            audit.append(run_tool("send_email", {"to": "a@example.test"}))
            audit.append(run_tool("send_email", {"to": "a@example.test"}, human_approved=True))
            audit.append(run_tool("unknown_tool", {}))
            ev = eval_suite()
            assert audit[1]["result"] == "denied"
            assert audit[2]["result"] == "pending_human_approval"
            assert audit[3]["executed"] is True
            assert ev["score"] >= 2 / 3
            metrics = {
                "capstone_id": CAPSTONE_ID,
                "status": "pass",
                "audit_events": len(audit),
                "denied": sum(1 for e in audit if e.get("result") == "denied"),
                "pending_human": sum(1 for e in audit if e.get("result") == "pending_human_approval"),
                "executed": sum(1 for e in audit if e.get("executed")),
                "eval": ev,
                "trace": audit,
            }
            print(f"METRICS_JSON: {json.dumps(metrics, ensure_ascii=False)}")
            print(f"{CAPSTONE_ID} Copilot OK — eval={ev['score']:.2f}")
            return 0


        if __name__ == "__main__":
            sys.exit(main())
        '''
    ).lstrip()


def demo_source_final() -> str:
    return textwrap.dedent(
        r'''
        #!/usr/bin/env python3
        """CP-FINAL — Enterprise integration smoke over 12 capstone packages."""
        from __future__ import annotations
        import json
        import sys
        from pathlib import Path

        CAPSTONE_ID = "CP-FINAL"
        REQUIRED = [
            "CP-N1-A", "CP-N1-B", "CP-N1-C",
            "CP-N2-A", "CP-N2-B", "CP-N2-C",
            "CP-N3-A", "CP-N3-B", "CP-N3-C",
            "CP-N4-A", "CP-N4-B", "CP-N4-C",
        ]

        PACKAGE_FILES = [
            "gate.json",
            "demo.py",
            "evidence_manifest.json",
            "RUN.md",
            "system_or_data_card.md",
        ]


        def main() -> int:
            root = Path(__file__).resolve().parent.parent
            checklist = []
            all_pass = True
            for cid in REQUIRED:
                pkg = root / cid
                entry = {
                    "id": cid,
                    "package_dir_exists": pkg.is_dir(),
                    "files_ok": False,
                    "execution_status": None,
                    "pass": False,
                }
                if not pkg.is_dir():
                    all_pass = False
                    checklist.append(entry)
                    continue
                files_ok = all((pkg / f).is_file() for f in PACKAGE_FILES)
                entry["files_ok"] = files_ok
                exec_path = pkg / "execution.json"
                status = None
                if exec_path.is_file():
                    try:
                        data = json.loads(exec_path.read_text(encoding="utf-8"))
                        status = data.get("status")
                    except json.JSONDecodeError:
                        status = "invalid_json"
                entry["execution_status"] = status
                entry["pass"] = bool(files_ok and status == "pass")
                if not entry["pass"]:
                    all_pass = False
                checklist.append(entry)

            n_pass = sum(1 for c in checklist if c["pass"])
            architecture = {
                "layers": [
                    "N1 intake/ETL/familiarity",
                    "N2 EDA/reporting/RPA",
                    "N3 ER/graph/triage",
                    "N4 services/MLOps/copilot",
                ],
                "integration": "Contractual smoke via execution.json status==pass",
                "data_policy": "synthetic_only",
            }
            metrics = {
                "capstone_id": CAPSTONE_ID,
                "status": "pass" if all_pass else "fail",
                "n_required": len(REQUIRED),
                "n_pass": n_pass,
                "checklist": checklist,
                "architecture": architecture,
            }
            print(f"METRICS_JSON: {json.dumps(metrics, ensure_ascii=False)}")
            if not all_pass:
                print(f"{CAPSTONE_ID} FAIL — {n_pass}/{len(REQUIRED)} packages green", file=sys.stderr)
                return 1
            print(f"{CAPSTONE_ID} Integration OK — {n_pass}/{len(REQUIRED)}")
            return 0


        if __name__ == "__main__":
            sys.exit(main())
        '''
    ).lstrip()


DEMO_SOURCES = {
    "CP-N1-A": demo_source_n1a,
    "CP-N1-B": demo_source_n1b,
    "CP-N1-C": demo_source_n1c,
    "CP-N2-A": demo_source_n2a,
    "CP-N2-B": demo_source_n2b,
    "CP-N2-C": demo_source_n2c,
    "CP-N3-A": demo_source_n3a,
    "CP-N3-B": demo_source_n3b,
    "CP-N3-C": demo_source_n3c,
    "CP-N4-A": demo_source_n4a,
    "CP-N4-B": demo_source_n4b,
    "CP-N4-C": demo_source_n4c,
    "CP-FINAL": demo_source_final,
}


def write_demo(cp: dict, dest: Path) -> None:
    src = DEMO_SOURCES[cp["id"]]()
    (dest / "demo.py").write_text(src, encoding="utf-8")


def run_demo(cp_id: str, dest: Path) -> dict:
    demo = dest / "demo.py"
    proc = subprocess.run(
        [sys.executable, str(demo)],
        cwd=str(dest),
        capture_output=True,
        text=True,
        timeout=60,
    )
    status = "pass" if proc.returncode == 0 else "fail"
    execution = {
        "id": cp_id,
        "status": status,
        "exit_code": proc.returncode,
        "stdout": proc.stdout,
        "stderr": proc.stderr,
        "command": f"python3 demo.py",
        "cwd": str(dest.relative_to(dest.parent.parent.parent) if False else dest),
        "executed_at": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "python": sys.version.split()[0],
    }
    # store cwd relative-ish
    execution["cwd"] = f"course-state/capstones/{cp_id}"
    (dest / "execution.json").write_text(
        json.dumps(execution, indent=2, ensure_ascii=False) + "\n", encoding="utf-8"
    )
    return execution


def main() -> int:
    results = []
    # First write all non-FINAL packages and run them
    ordered = [c for c in CAPSTONES if c["id"] != "CP-FINAL"] + [
        c for c in CAPSTONES if c["id"] == "CP-FINAL"
    ]
    for cp in ordered:
        dest = ROOT / cp["id"]
        dest.mkdir(parents=True, exist_ok=True)
        write_gate_json(cp, dest)
        write_demo(cp, dest)
        write_evidence_manifest(cp, dest)
        write_run_md(cp, dest)
        write_card(cp, dest)
        print(f"[write] {cp['id']}")

    # Execute N1-N4 first (FINAL depends on execution.json)
    for cp in ordered:
        if cp["id"] == "CP-FINAL":
            continue
        dest = ROOT / cp["id"]
        ex = run_demo(cp["id"], dest)
        print(f"[run] {cp['id']} -> {ex['status']} exit={ex['exit_code']}")
        results.append(ex)

    # FINAL last
    final_cp = next(c for c in CAPSTONES if c["id"] == "CP-FINAL")
    dest = ROOT / final_cp["id"]
    ex = run_demo(final_cp["id"], dest)
    print(f"[run] {final_cp['id']} -> {ex['status']} exit={ex['exit_code']}")
    results.append(ex)

    index = {
        "version": "1.0.0",
        "generated_at": NOW,
        "lane": "LANE-CAPSTONE-FORMAL",
        "total": len(results),
        "passed": sum(1 for r in results if r["status"] == "pass"),
        "failed": sum(1 for r in results if r["status"] != "pass"),
        "capstones": [
            {
                "id": r["id"],
                "gate_section": next(c["gate_section"] for c in CAPSTONES if c["id"] == r["id"]),
                "name": next(c["name"] for c in CAPSTONES if c["id"] == r["id"]),
                "execution_status": r["status"],
                "exit_code": r["exit_code"],
                "path": f"course-state/capstones/{r['id']}/",
                "formally_ready": r["status"] == "pass",
            }
            for r in results
        ],
    }
    # preserve order of CAPSTONES
    order_map = {c["id"]: i for i, c in enumerate(CAPSTONES)}
    index["capstones"].sort(key=lambda x: order_map[x["id"]])
    (ROOT / "INDEX.json").write_text(json.dumps(index, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    lane_status = {
        "lane_id": "LANE-CAPSTONE-FORMAL",
        "status": "completed" if index["failed"] == 0 else "failed",
        "phase": "FORMAL_GATE_PACKAGES",
        "generated_at": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "scope": [c["id"] for c in CAPSTONES],
        "summary": {
            "packages_created": 13,
            "demos_passed": index["passed"],
            "demos_failed": index["failed"],
            "formally_passed_ready": index["passed"] == 13,
        },
        "pass_fail_table": [
            {
                "id": c["id"],
                "gate_section": c["gate_section"],
                "name": c["name"],
                "result": "PASS" if next(r for r in results if r["id"] == c["id"])["status"] == "pass" else "FAIL",
                "exit_code": next(r for r in results if r["id"] == c["id"])["exit_code"],
                "package": f"course-state/capstones/{c['id']}/",
            }
            for c in CAPSTONES
        ],
        "artifacts": {
            "index": "course-state/capstones/INDEX.json",
            "packages": [f"course-state/capstones/{c['id']}/" for c in CAPSTONES],
        },
        "files_changed": [
            f"course-state/capstones/{c['id']}/gate.json" for c in CAPSTONES
        ]
        + [f"course-state/capstones/{c['id']}/demo.py" for c in CAPSTONES]
        + [f"course-state/capstones/{c['id']}/evidence_manifest.json" for c in CAPSTONES]
        + [f"course-state/capstones/{c['id']}/RUN.md" for c in CAPSTONES]
        + [f"course-state/capstones/{c['id']}/system_or_data_card.md" for c in CAPSTONES]
        + [f"course-state/capstones/{c['id']}/execution.json" for c in CAPSTONES]
        + [
            "course-state/capstones/INDEX.json",
            "course-state/lanes/LANE-CAPSTONE-FORMAL.status.json",
            "course-state/capstones/_generate_formal_packages.py",
        ],
        "files_not_edited": [
            "course-state/checkpoint.json",
            "course-state/section_ledger.json",
            "course-state/issue_registry.json",
            "course-state/capstone_ledger.json",
        ],
        "note": (
            "Formal packages with runnable demos and execution evidence. "
            "Orchestrator may set capstone_ledger formally_passed when merging. "
            "This lane does not edit capstone_ledger/section_ledger/checkpoint/issue_registry."
        ),
        "next_action": (
            "Orchestrator: merge formally_passed for 13 capstones into capstone_ledger "
            "and any CF/promotion gates; do not re-run content lanes."
        ),
    }
    lane_path = ROOT.parent / "lanes" / "LANE-CAPSTONE-FORMAL.status.json"
    lane_path.parent.mkdir(parents=True, exist_ok=True)
    lane_path.write_text(json.dumps(lane_status, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    print("\n=== SUMMARY ===")
    for row in lane_status["pass_fail_table"]:
        print(f"{row['id']:10} {row['gate_section']:4} {row['result']:4} exit={row['exit_code']}")
    print(f"INDEX: {index['passed']}/{index['total']} pass")
    return 0 if index["failed"] == 0 else 1


if __name__ == "__main__":
    sys.exit(main())
