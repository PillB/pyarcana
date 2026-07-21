# NEWBIE_B (Skeptic) — batch selfcheck sections 01–13

- **attempt_id:** `agentic_A1`
- **persona:** skeptic
- **method:** `llm_packet_only_no_generator`
- **source:** `quiz_batch_01_13.json` only (no solutions/correctIndex/TypeScript)
- **recorded:** 2026-07-21T22:09:40.273132+00:00
- **agent:** Newbie Subagent B (independent from A)

## Protocol

- Zero external Python knowledge beyond the packet cards.
- Every stem answered with `chosen_index` + Skeptic-toned `justification_from_packet` quoting theory/iDo from the card.
- Exercises left as previously scaffolded; this batch only fills **selfcheck**.
- Forbidden: solutions, correctIndex, attempt_007b, TS sources.

## Per-section answers

### S01 — Setup & Entorno de Desarrollo

| # | chosen | confidence | option text (truncated) |
|---|--------|------------|------------------------|
| 0 | 1 | 0.72 | Para aislar las dependencias (paquetes) por proyecto y evitar confl… |
| 1 | 2 | 0.72 | .venv/ (o venv/) |
| 2 | 2 | 0.72 | "feat: agregar cálculo de churn por segmento" |
| 3 | 2 | 0.72 | pip install -r requirements.txt |
| 4 | 1 | 0.78 | Porque suele contener credenciales (API keys, passwords, tokens) qu… |

- mean confidence: 0.73
- blocked: 0 / 5
- artifact: `section_01/newbie_b_live.json` → `selfcheck`

### S02 — Valores, tipos, operadores e I/O

| # | chosen | confidence | option text (truncated) |
|---|--------|------------|------------------------|
| 0 | 1 | 0.72 | NoneType |
| 1 | 1 | 0.72 | str y False |
| 2 | 1 | 0.78 | Porque no es una cantidad aritmética y puede necesitar ceros o formato |
| 3 | 1 | 0.72 | [1, 2, 3] |
| 4 | 1 | 0.72 | if x is None: |

- mean confidence: 0.73
- blocked: 0 / 5
- artifact: `section_02/newbie_b_live.json` → `selfcheck`

### S03 — Decisiones y reglas de validación

| # | chosen | confidence | option text (truncated) |
|---|--------|------------|------------------------|
| 0 | 1 | 0.72 | if campo is None: |
| 1 | 1 | 0.72 | Se ejecuta esa rama y se omiten las siguientes |
| 2 | 3 | 0.78 | "default" |
| 3 | 1 | 0.72 | Un set de literales y el operador in |
| 4 | 1 | 0.72 | Cuando el sujeto es un literal/estado finito (códigos) y hay case _ |

- mean confidence: 0.73
- blocked: 0 / 5
- artifact: `section_03/newbie_b_live.json` → `selfcheck`

### S04 — Iteración y resúmenes transaccionales

| # | chosen | confidence | option text (truncated) |
|---|--------|------------|------------------------|
| 0 | 1 | 0.72 | [0,1,2] |
| 1 | 1 | 0.72 | Empareja solo (1,10) y (2,20); el 3 se pierde en silencio |
| 2 | 1 | 0.72 | n_total de registros procesados (intentados) |
| 3 | 1 | 0.72 | Salta al siguiente ciclo del bucle |
| 4 | 2 | 0.72 | O(n²) |

- mean confidence: 0.72
- blocked: 0 / 5
- artifact: `section_04/newbie_b_live.json` → `selfcheck`

### S05 — Funciones, contratos y descomposición

| # | chosen | confidence | option text (truncated) |
|---|--------|------------|------------------------|
| 0 | 2 | 0.72 | None |
| 1 | 1 | 0.72 | El default mutable se comparte entre llamadas |
| 2 | 2 | 0.72 | Mismo input → mismo output, sin efectos colaterales |
| 3 | 0 | 0.72 | Local, Enclosing, Global, Builtin |
| 4 | 1 | 0.72 | f(f(x)) == f(x) para entradas del dominio |

- mean confidence: 0.72
- blocked: 0 / 5
- artifact: `section_05/newbie_b_live.json` → `selfcheck`

### S06 — Colecciones y estructuras de datos

| # | chosen | confidence | option text (truncated) |
|---|--------|------------|------------------------|
| 0 | 1 | 0.72 | [3,4] |
| 1 | 1 | 0.72 | a también ve el append (alias) |
| 2 | 2 | 0.72 | Listar conflicto en conflicts sin silenciar |
| 3 | 1 | 0.72 | None (muta in-place) |
| 4 | 1 | 0.72 | salidas deterministas/reproducibles |

- mean confidence: 0.72
- blocked: 0 / 5
- artifact: `section_06/newbie_b_live.json` → `selfcheck`

### S07 — Texto, Unicode y expresiones regulares

| # | chosen | confidence | option text (truncated) |
|---|--------|------------|------------------------|
| 0 | 1 | 0.72 | Formas Unicode distintas (NFC vs NFD) |
| 1 | 1 | 0.72 | Marcar review y conservar raw |
| 2 | 1 | 0.72 | Cuando la transformación es literal/simple |
| 3 | 1 | 0.72 | None (no es full match) |
| 4 | 2 | 0.72 | Ir a review con evidencia (raw, score) |

- mean confidence: 0.72
- blocked: 0 / 5
- artifact: `section_07/newbie_b_live.json` → `selfcheck`

### S08 — Archivos, CSV, JSON y contratos de ingesta

| # | chosen | confidence | option text (truncated) |
|---|--------|------------|------------------------|
| 0 | 1 | 0.72 | Evita depender del locale del SO (p. ej. Windows) |
| 1 | 1 | 0.72 | escribir temp y os.replace al destino |
| 2 | 2 | 0.72 | Ir a cuarentena con motivo |
| 3 | 1 | 0.72 | n_in == n_clean + n_quarantine |
| 4 | 1 | 0.72 | Fallar (exit non-zero) / fail closed |

- mean confidence: 0.72
- blocked: 0 / 5
- artifact: `section_08/newbie_b_live.json` → `selfcheck`

### S09 — Excepciones, debugging y logging seguro

| # | chosen | confidence | option text (truncated) |
|---|--------|------------|------------------------|
| 0 | 1 | 0.72 | Encadenar la causa en __cause__ sin perder contexto |
| 1 | 1 | 0.72 | Fail-fast (abortar el job) |
| 2 | 1 | 0.55 | Solo datos; diagnóstico a stderr |
| 3 | 1 | 0.78 | a***@ejemplo.pe |
| 4 | 1 | 0.72 | Puede reintentarse con backoff; ValueError de datos no |
| 5 | 1 | 0.72 | La entrada más pequeña que reproduce el bug |

- mean confidence: 0.70
- blocked: 0 / 6
- artifact: `section_09/newbie_b_live.json` → `selfcheck`

### S10 — Módulos, packaging y CLI profesional

| # | chosen | confidence | option text (truncated) |
|---|--------|------------|------------------------|
| 0 | 1 | 0.72 | Ejecutar el CLI/demo solo al correr el módulo, no al importar |
| 1 | 1 | 0.72 | flags > env > file > defaults |
| 2 | 1 | 0.72 | Error de uso/parseo de argumentos |
| 3 | 1 | 0.72 | stderr |
| 4 | 1 | 0.72 | minor |
| 5 | 0 | 0.72 | .env con API_TOKEN |

- mean confidence: 0.72
- blocked: 0 / 6
- artifact: `section_10/newbie_b_live.json` → `selfcheck`

### S11 — OOP y modelo de dominio

| # | chosen | confidence | option text (truncated) |
|---|--------|------------|------------------------|
| 0 | 1 | 0.72 | Evita el default mutable compartido entre instancias |
| 1 | 1 | 0.72 | Una señal/dato numérico, no un veredicto de fraude o familia |
| 2 | 1 | 0.72 | Definir un puerto get/save implementable por fakes y adapters |
| 3 | 1 | 0.72 | En la construcción (__post_init__/validate) |
| 4 | 1 | 0.72 | A menudo es frágil; composición (Client tiene PersonInfo) suele bastar |
| 5 | 1 | 0.72 | is_fraud() automático |

- mean confidence: 0.72
- blocked: 0 / 6
- artifact: `section_11/newbie_b_live.json` → `selfcheck`

### S12 — APIs, SQL y geodatos responsables

| # | chosen | confidence | option text (truncated) |
|---|--------|------------|------------------------|
| 0 | 1 | 0.72 | Tratarse como error de cliente (no retry ciego) |
| 1 | 1 | 0.72 | En variable de entorno / secret store |
| 2 | 1 | 0.72 | Inyección / inseguro; usar placeholders `?` |
| 3 | 1 | 0.72 | Viola la política de egress de CP-N1-C |
| 4 | 2 | 0.72 | Una geoseñal de relación, no un veredicto |

- mean confidence: 0.72
- blocked: 0 / 5
- artifact: `section_12/newbie_b_live.json` → `selfcheck`

### S13 — Familiarity Evidence Dashboard y cierre de nivel

| # | chosen | confidence | option text (truncated) |
|---|--------|------------|------------------------|
| 0 | 1 | 0.72 | Mantenerse separados en la ficha de caso |
| 1 | 2 | 0.78 | Error de matching; no es veredicto legal de fraude |
| 2 | 1 | 0.72 | Encolar needs_review / abstenerse según política |
| 3 | 1 | 0.72 | Privacy sheet, acceso, tests, demo y runbook |
| 4 | 1 | 0.72 | Re-chequear paths críticos S01–S13 en runbook (sin editar ledger aquí) |

- mean confidence: 0.73
- blocked: 0 / 5
- artifact: `section_13/newbie_b_live.json` → `selfcheck`

## Batch totals

- sections: 13 (S01–S13)
- selfcheck answers written: 68
- overall mean confidence: 0.72
- blocked stems: 0

## Skeptic notes / thin packet support

- **S09 Q2** (conf=0.55): ¿Qué va a stdout en una CLI bien diseñada? — chosen still forced per protocol; justification flags thinner support.
- **S09 Q2 (stdout vs stderr):** S09 theory emphasizes structured logs and no secrets/PII in logs but does not spell out the stdout=data / stderr=logs split as clearly as later packaging material; still rejected mixed DEBUG+JSON and secret options.
- **S10 exit code 2:** argparse usage error is the best-matching option; packet stresses non-zero for bad CLI usage without always numbering `2` in every paragraph.
- All justifications start with `Skeptic:` and cite headings or literal phrases from the quiz batch theory/iDo.

## Files updated

- `course-state/newbie_walkthrough/agentic_A1/section_01/newbie_b_live.json`
- `course-state/newbie_walkthrough/agentic_A1/section_02/newbie_b_live.json`
- `course-state/newbie_walkthrough/agentic_A1/section_03/newbie_b_live.json`
- `course-state/newbie_walkthrough/agentic_A1/section_04/newbie_b_live.json`
- `course-state/newbie_walkthrough/agentic_A1/section_05/newbie_b_live.json`
- `course-state/newbie_walkthrough/agentic_A1/section_06/newbie_b_live.json`
- `course-state/newbie_walkthrough/agentic_A1/section_07/newbie_b_live.json`
- `course-state/newbie_walkthrough/agentic_A1/section_08/newbie_b_live.json`
- `course-state/newbie_walkthrough/agentic_A1/section_09/newbie_b_live.json`
- `course-state/newbie_walkthrough/agentic_A1/section_10/newbie_b_live.json`
- `course-state/newbie_walkthrough/agentic_A1/section_11/newbie_b_live.json`
- `course-state/newbie_walkthrough/agentic_A1/section_12/newbie_b_live.json`
- `course-state/newbie_walkthrough/agentic_A1/section_13/newbie_b_live.json`

