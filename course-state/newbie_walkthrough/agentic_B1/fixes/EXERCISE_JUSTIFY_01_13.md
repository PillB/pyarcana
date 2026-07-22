# EXERCISE_JUSTIFY_01_13 — agentic_B1 (+ agentic_B2 where present)

- recorded_at: `2026-07-22T01:58:44.276309+00:00`
- scope: sections 01–13 exercise `justification_from_packet` only (code fields untouched)
- sources: `slim_packet.json` theory / iDo / weDo instruction+hints (no correctIndex/solutions)
- rule: each justification unique per exercise_id; quotes instruction + iDo demoId/fragment + 1–2 code tokens
- tones: Explorer (newbie_a) vs Skeptic (newbie_b) differ in wording
- forbidden solo phrase: `Completé starterCode con patrones del iDo`

## agentic_B1

- exercises rewritten: **624** (24 per section × 13 × 2 agents)
- validation issues: **0**
- persona prefixes: `[B1/Explorer]` / `[B1/Skeptic]`

| Section | Title | weDo | iDo demos | A ex | B ex | Status |
|---|---|---:|---:|---:|---:|---|
| 01 | Setup & Entorno de Desarrollo | 24 | 10 | 24 | 24 | OK |
| 02 | Valores, tipos, operadores e I/O | 24 | 8 | 24 | 24 | OK |
| 03 | Decisiones y reglas de validación | 24 | 8 | 24 | 24 | OK |
| 04 | Iteración y resúmenes transaccionales | 24 | 8 | 24 | 24 | OK |
| 05 | Funciones, contratos y descomposición | 24 | 8 | 24 | 24 | OK |
| 06 | Colecciones y estructuras de datos | 24 | 8 | 24 | 24 | OK |
| 07 | Texto, Unicode y expresiones regulares | 24 | 8 | 24 | 24 | OK |
| 08 | Archivos, CSV, JSON y contratos de inges | 24 | 8 | 24 | 24 | OK |
| 09 | Excepciones, debugging y logging seguro | 24 | 8 | 24 | 24 | OK |
| 10 | Módulos, packaging y CLI profesional | 24 | 8 | 24 | 24 | OK |
| 11 | OOP y modelo de dominio | 24 | 8 | 24 | 24 | OK |
| 12 | APIs, SQL y geodatos responsables | 24 | 8 | 24 | 24 | OK |
| 13 | Familiarity Evidence Dashboard y cierre  | 24 | 8 | 24 | 24 | OK |

## agentic_B2

- sections present: 01–13 (all present)
- exercises rewritten: **624**
- validation issues: **0**
- persona prefixes: `[B2-Explorer]` / `[B2-Skeptic]` (independent wording from B1)

| Section | Title | weDo | iDo demos | A ex | B ex | Status |
|---|---|---:|---:|---:|---:|---|
| 01 | Setup & Entorno de Desarrollo | 24 | 10 | 24 | 24 | OK |
| 02 | Valores, tipos, operadores e I/O | 24 | 8 | 24 | 24 | OK |
| 03 | Decisiones y reglas de validación | 24 | 8 | 24 | 24 | OK |
| 04 | Iteración y resúmenes transaccionales | 24 | 8 | 24 | 24 | OK |
| 05 | Funciones, contratos y descomposición | 24 | 8 | 24 | 24 | OK |
| 06 | Colecciones y estructuras de datos | 24 | 8 | 24 | 24 | OK |
| 07 | Texto, Unicode y expresiones regulares | 24 | 8 | 24 | 24 | OK |
| 08 | Archivos, CSV, JSON y contratos de inges | 24 | 8 | 24 | 24 | OK |
| 09 | Excepciones, debugging y logging seguro | 24 | 8 | 24 | 24 | OK |
| 10 | Módulos, packaging y CLI profesional | 24 | 8 | 24 | 24 | OK |
| 11 | OOP y modelo de dominio | 24 | 8 | 24 | 24 | OK |
| 12 | APIs, SQL y geodatos responsables | 24 | 8 | 24 | 24 | OK |
| 13 | Familiarity Evidence Dashboard y cierre  | 24 | 8 | 24 | 24 | OK |

## Justification shape (per exercise)

1. Persona prefix + exercise_id
2. Quoted weDo instruction snippet («…»)
3. Matched iDo `demoId` + description + code fragment («…»)
4. Optional first hint snippet from packet
5. 1–2 tokens taken from the exercise `code` field (body, not persona header comments)
6. Optional nearest theory heading

Matching for iDo demos prefers `demoId` starting with the exercise subtopic (`Sxx-Ty-Z`), then topic key, then keyword overlap with instruction/code.

## Samples (B1 section_01)

### newbie_a (Explorer) S01-T1-A-E1

```
[B1/Explorer] Armo S01-T1-A-E1 siguiendo el texto de la instrucción: «E1 (guiado) — Completa el transcript de una sesión REPL: suma, type() e import de sys. No crees un archivo .py; simula el diálogo en comentarios y luego…». Replico la forma del demo `S01-T1-B-DEMO` (Verificar el intérprete y abrir una sesión REPL mínima): «python --version python3 --version python». Pista del paquete: «En el REPL el prompt es >>>. Tras import sys, usa sys.version.split()[0] para la versión…». Tokens que copié al code: `sys.version` / `import sys`. Teoría cercana: «Por qué el setup importa más de lo que crees».
```

### newbie_b (Skeptic) S01-T1-A-E1

```
[B1/Skeptic] Firmo S01-T1-A-E1 solo con soporte del slim packet. Instrucción: «E1 (guiado) — Completa el transcript de una sesión REPL: suma, type() e import de sys. No crees un archivo .py; simula el diálogo en comentarios y luego…». Contraste con demo `S01-T1-B-DEMO` (Verificar el intérprete y abrir una sesión REPL mínima): «python --version python3 --version python». Hint packet: «En el REPL el prompt es >>>. Tras import sys, usa sys.version.split()[0] para la versión…». Mi code solo usa `sys.version` / `import sys` tal como aparecen en instruction/iDo. Heading de teoría: «Por qué el setup importa más de lo que crees».
```

### B1 section_02 Explorer S02-T1-A-E1

```
[B1/Explorer] Armo S02-T1-A-E1 siguiendo el texto de la instrucción: «E1 (guiado) — Clasifica estos literales imprimiendo `repr(valor)` y `type(valor).__name__` para cada uno: `0`, `3.14`, `"Lima"`, `False`, `None`.». Cruce con iDo `S02-T1-B-DEMO` (Literales de un registro de cliente y type() de cada campo): «nombres = "María José" apellido_paterno = "Quispe" edad = 34». Pista del paquete: «Recorre una lista de literales con un for. Usa type(x).__name__ para un nombre legible…». Tokens que copié al code: `__name__` / `literales`. Teoría cercana: «Literales y tipos básicos».
```

## B2 wording independence

- B2 uses distinct openers (`[B2-Explorer]` / `[B2-Skeptic]`) and different connectors (`→`, `+` token join) vs B1 (`[B1/Explorer]` / `[B1/Skeptic]`).
- Validation: no B2 justification identical to B1 counterpart; A≠B within B2; 0 issues after reword pass.
- B2 exercises rewritten: **624** across sections 01–13.

### B2 sample (section_01)

#### newbie_a S01-T1-A-E1

```
[B2-Explorer] Para S01-T1-A-E1 arranco citando el weDo: «E1 (guiado) — Completa el transcript de una sesión REPL: suma, type() e import de sys. No crees un archivo .py; simula el diálogo en comentarios y luego…». Demo de referencia `S01-T1-B-DEMO` (Verificar el intérprete y abrir una sesión REPL mínima) → «python --version python3 --version python». Hint weDo: «En el REPL el prompt es >>>. Tras import sys, usa sys.version.split()[0] para la versión…». Traigo al code `sys.version` + `import sys` copiados del patrón. Teoria packet: «Por qué el setup importa más de lo que crees».
```

#### newbie_b S01-T1-A-E1

```
[B2-Skeptic] Gate packet-only para S01-T1-A-E1. Instruction: «E1 (guiado) — Completa el transcript de una sesión REPL: suma, type() e import de sys. No crees un archivo .py; simula el diálogo en comentarios y luego…». iDo obligatorio `S01-T1-B-DEMO` (Verificar el intérprete y abrir una sesión REPL mínima) → «python --version python3 --version python». Hint: «En el REPL el prompt es >>>. Tras import sys, usa sys.version.split()[0] para la versión…». Huellas en code: `sys.version` + `import sys`. Teory heading: «Por qué el setup importa más de lo que crees».
```

## Validation notes

- All justifications non-empty
- Unique per (section, agent, exercise_id)
- A≠B tone wording for every exercise
- Include exercise_id + instruction quotes («…») + iDo demoId/fragment
- 1–2 code tokens present in every justification and found in the exercise `code` body (624/624)
- Never used solo template `Completé starterCode con patrones del iDo`
- Selfcheck justifications left untouched

## Code fields

- Left unchanged for every exercise (only `justification_from_packet` rewritten)
- Empty-code check: 0 empty codes across B1+B2 sections 01–13
