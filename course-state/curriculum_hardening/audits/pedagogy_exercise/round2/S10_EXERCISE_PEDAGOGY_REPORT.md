# S10 Exercise Pedagogy Report (Round 2)

## Section
- **title:** Módulos, packaging y CLI profesional
- **id:** `sklearn` (index 10; archivo histórico `s10-sklearn.ts` — contenido es packaging/CLI de `familiarity_core`, no scikit-learn)
- **source file:** `src/lib/course/sections/s10-sklearn.ts`
- **counts:** iDo 8, weDo 24 (8 subtemas × E1/E2/E3), youDo 1
- **subtopics:** T1-A imports/`__main__` · T1-B API pública · T2-A layout/src · T2-B SemVer/deps · T3-A argparse/exit codes · T3-B stdio · T4-A precedencia · T4-B secretos/validación
- **live:** https://pillb.github.io/pyarcana/
- **Round 1 context:** `round1/S10_EXERCISE_PEDAGOGY_REPORT.md` (histórico only — not acceptance proof)

## Method
- Re-read `PEDAGOGY_EXERCISE_SPEC.md` (field roles, length targets, preamble/retrospective checklists, E1→E2→E3 fade, anti-aberration)
- Manually re-inspected **every** `iDo.steps[]`, `weDo.steps[]`, and `youDo` in the **current** source after Round-1 fixes
- Scored residual quality for a true newbie (what / why / success / what sticks), not mere field presence
- Word counts measured only for length gates (no generators of educational prose)
- No bulk generation; **no source edits** in this round

## Round-1 fix verification (schema shell)

| Expectation after R1 | Status in current source |
|----------------------|--------------------------|
| All iDo have `preamble` + `retrospective` | **Met** (8/8) |
| All We Do have `title` + `preamble` + task-style `instruction` + `retrospective` | **Met** (24/24) |
| You Do has `retrospective` | **Met** |
| E1→E2→E3 fade preserved | **Met** (guided / independent / transfer per subtopic; distinct surfaces) |
| Tasks, starters, solutions, tests largely intact | **Met** (exact outputs preserved; `# DEFECT:` still named) |
| Feedback expanded beyond one line on high-stakes units | **Mostly met** (reasoning present; some still thin or echo retro) |

**Verdict:** Round-1 closed the systemic P0 “missing pedagogy shell.” Round-2 finds **no new missing-field crisis**. Residual work is **quality**: thin retrospectives, feedback↔retrospective collapse, a few transfer instructions that over-spoon-feed, thin I Do `why`/preamble on late demos, and leftover harness cosmetics.

---

## Scoring key (residual quality for a true newbie)

| Score | Meaning |
|-------|---------|
| **Strong** | Checklist solid; lengths OK; no spoiler; misconception + transfer clear; no required change |
| **Adequate** | Usable; small nits only (length, polish, mild overlap) |
| **Needs residual** | Spoiler, thin metacognition, feedback/retro collapse, or clear length/role failure |

Checklist items: **context · goal · success · constraints · retrospective** → pass / partial / fail.

When **no residual text** is proposed: Fixer may leave the unit unchanged.

---

## Global residual findings

| Residual gap | Evidence | Impact | Severity |
|--------------|----------|--------|----------|
| **Thin retrospectives** | Many weDo + late iDo under ~40 words (spec 40–80); often principle only + “E2: …” without self-check | Newbie closes the tab without a sticky misconception | **P1** (worst units below) · **P2** elsewhere |
| **Feedback ≈ retrospective** | Shared core sentence on T1-B-E1, T2-A-E1, T2-A-E3, T2-B-E2, T3-A-E1/E2, T3-B-E1/E2/E3, T4-A-E1/E2, T4-B-E2 | Deliberate-practice loop collapses; retro loses metacognitive job | **P1** on high-stakes pairs |
| **I Do why ↔ retro copy** | T4-A-DEMO and T4-B-DEMO: same slogan in `why` and `retrospective` | No new close after the demo | **P1** |
| **Transfer over-instruction** | T4-A-E3 steps are the full `if flag is not None` algorithm; T3-A-E3 gives `pad = max(1, width - len(left))` | E3 becomes copy-from-instruction, not transfer | **P1** (T4-A-E3) · **P2** (T3-A-E3) |
| **Thin I Do preambles / why** | T4-B pre ~46 w; several `why` ~30–36 (target 40–90) | Demo “watch this” under-motivated | **P2** (cluster) · **P1** if retro also thin (T4-*) |
| **Thin We Do preambles** | T3-A-E1 ~37 w (weakest job hook of the section) | argparse E1 is the fragile newbie surface | **P1** |
| **Thin feedback** | T1-B-E2 ~21 w; T3-B-E2 ~23 w (target 25–60) | Corrective loop too thin | **P2** |
| **Hints ≈ instruction** | T3-A-E1, T3-B-E1: `hint`/`hints[0]` restates steps | Progressive tiering weak | **P2** |
| **Harness cosmetics (from R1)** | T1-B-E2 starter `compare("A","a")` vs solution `("Z"," z ")`; T3-B-E2 `f.txt` vs `file.csv`; T3-B-E3 starter omits `stderr_only` path | Only matters if harness diffs starter print path vs solution output | **P2** (align only if verification requires it) |
| **lower vs casefold** | T1-B-E1 solution still uses `.lower()` while rest of section prefers casefold | Not an output bug; do **not** “unify” without execute-and-diff | **P2 note** (no forced change) |

**Section severity theme (Round 2):** solid shell after R1; residual is **P1 polish where learning integrity or metacognition fails**, else **P2 length/dedup**. No unit should be rewritten from scratch.

---

## Unit ledger

### I Do

### S10-T1-A-DEMO (iDo)
- **Scores:** preamble **Strong** · why **Strong** · retrospective **Strong**
- **Checklist:** context pass · goal pass · success pass (output `josé pérez`) · constraints pass (sintéticos, no PII) · retrospective pass
- **Diagnosis:** R1 prose landed. Watch targets (1)(2)(3) are concrete; `why` explains simulated main-guard; retro names classic error (print/parse_args at module level) and bridges to We Do.
- **Severity residual:** — (none required)
- **Proposed residual:** none
- **Code/output changes:** none

### S10-T1-B-DEMO (iDo)
- **Scores:** preamble **Strong** · why **Adequate** (~36 w) · retrospective **Adequate** (~33 w, slightly under target)
- **Checklist:** all pass for demo tier
- **Diagnosis:** Excellent watch list and predict prompt. Retro is a bit telegraphic; optional +1 self-check would hit length target.
- **Severity residual:** P2
- **Proposed residual retrospective (full text):**  
  Si el consumidor solo conoce la fachada, puedes refactorizar `_private_token` sin romper pipelines. El error clásico es «exportar todo por comodidad». Pregunta de auto-chequeo: ¿cuántos símbolos de tu `__all__` defenderías en un major? We Do: filtrar públicos, armar `__all__` y documentar un breaking de firma.
- **Code/output changes:** none

### S10-T2-A-DEMO (iDo)
- **Scores:** preamble **Adequate** (~57 w, a bit short of 80) · why **Adequate** · retrospective **Needs residual** (~29 w)
- **Checklist:** context pass · goal pass · success pass · constraints partial (no explicit “simulación, no pip real en el playground”) · retrospective partial
- **Diagnosis:** Clear CP-N1-B hook. Retro is bridge-only; misses the name-vs-folder misconception that theory already teaches. Optional one sentence that this demo is a *contrato de layout*, not a live install, reduces playground confusion.
- **Severity residual:** P2
- **Proposed residual retrospective (full text):**  
  Si el import y la carpeta no coinciden, o no instalaste editable, aparece `ModuleNotFoundError`. Esta demo lista el contrato; el install real vive en el You Do. Pregunta: ¿por qué `familiarity-core` (guion) no es el mismo string que `import familiarity_core`? We Do: normalizar metadata, listar el layout y diagnosticar por hechos.
- **Code/output changes:** none

### S10-T2-B-DEMO (iDo)
- **Scores:** preamble **Adequate** · why **Needs residual** (~33 w) · retrospective **Needs residual** (~26 w)
- **Checklist:** pass with thin close
- **Diagnosis:** Predict major/patch mentally is good. `why` and retro both short; retro does not name CHANGELOG as the human half of SemVer.
- **Severity residual:** P2
- **Proposed residual `why` (full text):**  
  Feature compatible = minor; breaking de API pública = major; fix de help = patch. La aritmética del bump es inútil sin nota: anota el cambio en CHANGELOG (aunque sea una línea Added/Changed) para que el consumidor sepa *qué* subió de `0.1.0` a `0.2.0`.
- **Proposed residual retrospective (full text):**  
  Si clasificas mal un rename como patch, rompes a consumidores sin aviso. El error clásico es bumpear solo el string de versión y olvidar la nota de migración. We Do: clasificar en español, separar deps runtime/dev y políticas hacia entidades de S11.
- **Code/output changes:** none

### S10-T3-A-DEMO (iDo)
- **Scores:** preamble **Adequate** · why **Adequate** · retrospective **Needs residual** (~25 w)
- **Checklist:** success pass (0 y 2 visibles) · retrospective partial
- **Diagnosis:** Strong watch targets on subparsers and empty argv. Retro is bridge-only; under-sells the `main(argv) -> int` testability principle already in `why`.
- **Severity residual:** P2
- **Proposed residual retrospective (full text):**  
  Si siempre devuelves 0, el CI no detecta usage roto. Separar `main(argv) -> int` del `sys.exit` es lo que permite unit-testear sin spawn. Pregunta: ¿por qué un argv vacío debe ser 2 y no 1? We Do: armar subcomando report, mapear 0/1/2 y escribir ayuda alineada.
- **Code/output changes:** none

### S10-T3-B-DEMO (iDo)
- **Scores:** preamble **Strong** · why **Needs residual** (~30 w) · retrospective **Adequate** (~27 w)
- **Checklist:** pass; thin why
- **Diagnosis:** Pipe/`jq` scene is excellent. `why` is just under target and could name the false belief “menos logs = stdout limpio.”
- **Severity residual:** P2
- **Proposed residual `why` (full text):**  
  Logs en stderr permiten redirigir `2> log.txt` sin ensuciar el archivo de datos. En CLI real usa `print(..., file=sys.stderr)`. El pipe de datos queda limpio para `jq` u otro subcomando: no se trata de “loguear menos”, sino de **otro canal**.
- **Code/output changes:** none

### S10-T4-A-DEMO (iDo)
- **Scores:** preamble **Strong** · why **Adequate** · retrospective **Needs residual** (~21 w; copies why slogan)
- **Checklist:** context pass · goal pass · success pass · constraints pass (sin capa file, honesto) · retrospective fail (duplicate of why)
- **Diagnosis:** Best residual P1 on I Do: `why` already says “Precedencia documentada… evita en mi máquina es DEBUG”; `retrospective` repeats that sentence and only adds the We Do list. Newbie gets no *new* close.
- **Severity residual:** P1
- **Proposed residual retrospective (full text):**  
  Flag ausente (`None`) no es lo mismo que flag `"INFO"`: si tratas ambos igual, pisas el env sin querer. Pregunta de auto-chequeo: en la demo, ¿quién gana con env=DEBUG y sin flag? We Do: traza de capas, merge multi-clave y razón del ganador.
- **Code/output changes:** none (demo intentionally omits file layer — keep)

### S10-T4-B-DEMO (iDo)
- **Scores:** preamble **Adequate** (short) · why **Adequate** · retrospective **Needs residual** (~21 w; copies why)
- **Checklist:** success pass · retrospective fail (duplicate)
- **Diagnosis:** Same collapse as T4-A: “Fail-closed y contextual…” appears in both `why` and `retrospective`. Preamble could name fail-closed al arranque more explicitly.
- **Severity residual:** P1
- **Proposed residual retrospective (full text):**  
  El error clásico es un validador global que exige `input_path` también a `normalize` o, al revés, no validar y fallar a mitad del batch. Pregunta: ¿por qué el mensaje debe nombrar la clave y el comando? We Do: qué va a `.gitignore`, validar claves y endurecer defaults inseguros.
- **Optional residual preamble open (if Fixer expands):** start with “Fail-closed al arranque: …” before the current first sentence.
- **Code/output changes:** none

---

### We Do — T1-A

### S10-T1-A-E1 (weDo, guided)
- **Scores:** title **Strong** · preamble **Adequate** · instruction **Strong** · feedback **Strong** · retrospective **Needs residual** (~31 w)
- **Checklist:** all pass except thin retro
- **Diagnosis:** Model E1: defect named, exact success, feedback repairs `__all__` + strip vs split/join. Retro is short and lacks self-check.
- **Severity residual:** P2
- **Proposed residual retrospective (full text):**  
  Público = contrato; `_` = convención de «no toques esto». Exportar el helper no te hace más transparente: te ata la mano en el próximo rename. Pregunta: ¿qué rompería si un colega hace `from mod import _ws`? Siguiente (E2): util compartido para romper ciclos A↔B.
- **Code/output changes:** none

### S10-T1-A-E2 (weDo, independent)
- **Scores:** all **Strong / Adequate**
- **Checklist:** all pass
- **Diagnosis:** Clear anti-ciclo scene; success three lines; feedback diagnoses inverted suffixes. E2 still lists defect-ish steps but acceptable for packaging novices. No required residual.
- **Severity residual:** —
- **Proposed residual:** none
- **Code/output changes:** none

### S10-T1-A-E3 (weDo, transfer)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Adequate** · feedback **Adequate** · retrospective **Adequate** (~34 w)
- **Checklist:** pass; success relies on “contrato de salida” without quoting the three style strings
- **Diagnosis:** Real transfer (kind vs label). Instruction does not dump the answer strings (good). If the UI does not show expected output until pass, a newbie may invent wrong Spanish styles — optional: quote the three target strings only under **Éxito**, not the algorithm.
- **Severity residual:** P2
- **Proposed residual preamble **Éxito** line (replace that bullet only):**  
  - **Éxito:** tres líneas exactas: `… -> relativo o absoluto del paquete (from . import compare)` / `… -> absoluto (import familiarity_core)` / `… -> python -m familiarity_core` (labels del starter intactos).
- **Code/output changes:** none

### S10-T1-B-E1 (weDo, guided)
- **Scores:** instruction **Strong** · feedback **Needs residual** (≈ retro) · retrospective **Needs residual**
- **Checklist:** pass on task; metacognition partial
- **Diagnosis:** Feedback and retro both open with “prefijo `_` es promesa / no candado.” Collapse is the residual.
- **Severity residual:** P1
- **Proposed residual feedback (full text — keep symptom-first):**  
  Si `public` incluye `_tokenize` o falta la línea `private`, filtra con `startswith('_')` y no reutilices la lista cruda. Imprime con las etiquetas `public` / `private` del contrato; el `True` final solo confirma que `compare` sigue vivo tras el filtro.
- **Proposed residual retrospective (full text):**  
  El prefijo `_` es promesa al equipo, no candado del intérprete. Filtrar la lista es el mismo criterio que pondrías en `__all__`. Pregunta: si alguien importa `_tokenize` hoy, ¿puedes renombrarlo mañana sin major? Siguiente: fachada real con casefold.
- **Code/output changes:** none (keep `.lower()` in this solution; do not force casefold without re-diff)

### S10-T1-B-E2 (weDo, independent)
- **Scores:** preamble **Adequate** (thin) · feedback **Needs residual** (~21 w) · retrospective **Strong**
- **Checklist:** pass; feedback under target
- **Diagnosis:** Good independent surface. Feedback is symptom-only. Starter still prints `compare("A","a")` while solution uses `("Z"," z ")` — harness note only.
- **Severity residual:** P2
- **Proposed residual feedback (full text):**  
  Si `__all__` queda vacío o `compare('Z',' z ')` es False, exporta `normalize`/`compare` y normaliza **ambos** lados con strip+casefold antes de comparar. Comparar strings crudos hace que el “score” de familiaridad mienta con espacios y mayúsculas.
- **Code/output changes:** optional harness: align starter final `print(compare(...))` args with solution if verification runs starter as-is against solution output

### S10-T1-B-E3 (weDo, transfer)
- **Scores:** preamble **Strong** · instruction **Adequate** (short) · feedback/retro **Adequate** with mild overlap on “tipo de retorno es major”
- **Checklist:** all pass
- **Diagnosis:** Strong transfer story (bool→float). Mild fb∩retro overlap acceptable if retro keeps migration self-check.
- **Severity residual:** P2 (optional de-dupe)
- **Proposed residual retrospective tweak (full text):**  
  Cambiar el tipo de retorno de un símbolo público es major aunque el nombre no cambie. La migración debe decir *qué hacer* (aquí: `compare(a,b) == 1.0`), no solo “breaking”. Pregunta: ¿un default nuevo opcional sería major o minor? En T2-A empaquetas el layout que hace instalable esa API.
- **Code/output changes:** none

---

### We Do — T2-A / T2-B

### S10-T2-A-E1 (weDo, guided)
- **Scores:** title **Strong** · instruction **Adequate** (short) · feedback/retro **Needs residual** (same “guiones vs guion bajo” sentence)
- **Checklist:** pass on task; retro thin (~23 w) and overlaps feedback
- **Severity residual:** P1
- **Proposed residual feedback (full text):**  
  Si el name sigue siendo `familiarity` o falta `requires-python`, `complete_project` no normaliza el contrato. Copia a un dict nuevo, fuerza name y requires-python, y usa default de version solo si falta — no devuelvas el partial crudo.
- **Proposed residual retrospective (full text):**  
  Name de distribución puede llevar guiones; el import usa `familiarity_core`. Metadata mínima incompleta = install frágil en el primer `pip install -e .`. Pregunta: ¿qué clave del dict es la que más duele olvidar en CI? E2: armar las rutas del layout src.
- **Code/output changes:** none

### S10-T2-A-E2 (weDo, independent)
- **Scores:** **Strong / Adequate**
- **Checklist:** all pass
- **Diagnosis:** Clean E2; feedback ~24 w just under target — optional pad only.
- **Severity residual:** P2 optional
- **Proposed residual feedback (full text, optional):**  
  Si falta `cli.py` o `pyproject.toml`, la función aún no arma el layout mínimo instalable. Construye desde `package` + `modules` y anexa `pyproject.toml` en la **raíz**, no bajo `src/`.
- **Code/output changes:** none

### S10-T2-A-E3 (weDo, transfer)
- **Scores:** preamble **Strong** · instruction **Strong** · feedback/retro **Needs residual** (share “diagnóstico ordenado evita probar de todo”)
- **Checklist:** pass; mild collapse
- **Severity residual:** P1
- **Proposed residual feedback (full text):**  
  Si el segundo caso no detecta el mismatch, compara `import_name` con `package_dir` en vez de devolver siempre la primera causa. Si el tercero no ve shadowing, lee la clave booleana `shadowing_script` — no busques palabras en un string libre.
- **Proposed residual retrospective (full text):**  
  Un diagnóstico ordenado evita «probar de todo». El script en el cwd que tapa el paquete es un clásico de demos locales. Pregunta: ¿por qué el orden installed → nombres → shadowing importa? En T2-B versionas y declaras deps con el mismo rigor de contrato.
- **Code/output changes:** none

### S10-T2-B-E1 (weDo, guided)
- **Scores:** preamble **Strong** · instruction **Adequate** · feedback **Strong** · retrospective **Adequate** (thin)
- **Checklist:** all pass
- **Diagnosis:** Double defect still excellent pedagogy. Feedback already has reasoning (major reset). Retro under 40 w — light expand.
- **Severity residual:** P2
- **Proposed residual retrospective (full text):**  
  Classify y bump son dos pasos: primero política, luego aritmética. El error clásico es sumar major y dejar residual (`2.1.0` tras un breaking). Pregunta: ¿«añadir flag --format» es major? E2: dónde vive pytest (dev, no runtime).
- **Code/output changes:** none

### S10-T2-B-E2 (weDo, independent)
- **Scores:** preamble **Adequate** (thin) · feedback/retro **Needs residual** (Runtime/dev slogan shared)
- **Checklist:** pass; collapse
- **Severity residual:** P1
- **Proposed residual feedback (full text):**  
  Si pytest aparece en `dependencies`, `build_deps` aún concatena dev en runtime. Deja `dependencies = list(runtime)` y mueve dev a `optional-dependencies.dev` — el install del operador no debe arrastrar la herramienta del autor.
- **Proposed residual retrospective (full text):**  
  Runtime = lo que necesita el operador al instalar el CLI; dev = lo que necesita el autor al testear. Mezclarlos infla el install del equipo y ensucia el gate N1 stdlib-first. E3: política de compat hacia tipos de dominio (S11).
- **Code/output changes:** none

### S10-T2-B-E3 (weDo, transfer)
- **Scores:** **Adequate / Strong**
- **Checklist:** all pass
- **Diagnosis:** Good transfer to S11 policy kinds. Mild fb∩retro on “label vs kind / CLI estable.”
- **Severity residual:** P2 optional
- **Proposed residual:** none required (optional: move “label es para humanos” only into retrospective; keep branch-invert diagnosis in feedback)
- **Code/output changes:** none

---

### We Do — T3-A / T3-B

### S10-T3-A-E1 (weDo, guided)
- **Scores:** title **Strong** · preamble **Needs residual** (~37 w, weakest job scene) · instruction **Strong** · feedback/retro **Needs residual** (required=True / cmd None shared)
- **Checklist:** context partial · goal pass · success pass · constraints pass · retrospective partial
- **Diagnosis:** Instruction steps are now the E1 scaffold R1 demanded — good. Preamble is too short for argparse newbies (R1 risk still live). Hints largely restate instruction (P2).
- **Severity residual:** P1
- **Proposed residual preamble (full text):**  
  - **Contexto:** el operador lanza `familiarity report --format json` y espera un Namespace usable para el siguiente paso del pipeline (no un dict improvisado).  
  - **Meta:** registrar el subparser `report` y el flag de formato con argparse.  
  - **Éxito:** `Namespace(cmd='report', format='json')` impreso exactamente.  
  - **Límites:** `add_subparsers(..., required=True)`; choices text|json; solo stdlib; sin `sys.path` hacks.
- **Proposed residual feedback (full text):**  
  Si el Namespace no tiene `cmd`/`format`, falta `subparsers` con `dest="cmd"` y `--format` en el parser `report`. Revisa también `choices` y el argv de prueba `['report', '--format', 'json']`.
- **Proposed residual retrospective (full text):**  
  `required=True` hace que un argv vacío sea usage error, no un cmd `None` silencioso. El flag por subcomando mantiene el help legible por comando. Pregunta: ¿qué código de salida esperas si omites el subcomando? E2: traducir parse/runtime a 0/1/2.
- **Proposed residual hints (optional P2):**  
  1. `sub = p.add_subparsers(dest="cmd", required=True)` antes de `add_parser("report")`.  
  2. Si el print no muestra `format='json'`, el flag no está en el subparser correcto o el argv de prueba es incompleto.
- **Code/output changes:** none

### S10-T3-A-E2 (weDo, independent)
- **Scores:** preamble **Strong** · instruction **Strong** · feedback **Strong** (long but on-mission) · retrospective **Needs residual** (echoes “unificas todo en 1”)
- **Checklist:** all pass on task; retro overlap
- **Diagnosis:** Still one of the section’s best exercises. Feedback is excellent reasoning; retro should not repeat the “unificas todo en 1” line.
- **Severity residual:** P1
- **Proposed residual retrospective (full text):**  
  0/1/2 es lenguaje entre el CLI y el CI: usage roto ≠ archivo ausente. Pregunta de auto-chequeo: en tus cinco líneas, ¿cuántas son 2 y por qué no son 1? E3: ayuda humana alineada con ejemplos y esos mismos códigos.
- **Code/output changes:** none

### S10-T3-A-E3 (weDo, transfer)
- **Scores:** preamble **Strong** · instruction **Needs residual** (formula spoiler) · feedback **Adequate** · retrospective **Needs residual** (thin)
- **Checklist:** pass; transfer integrity partial
- **Diagnosis:** Help-alignment is a good transfer surface, but step 1 hands the full pad formula. Hints even give exact space counts (2 y 12) — overkill for E3.
- **Severity residual:** P2 (instruction) · P2 (hints)
- **Proposed residual instruction (full text):**  
  1. Completa `format_help` para alinear el comentario `#` en una columna fija (`width=52`).  
  2. Imprime los dos ejemplos del starter con sus notas.  
  3. Añade la línea de códigos de salida del contrato (sin el placeholder «buen luck»).  
  4. Quita prints de debug.
- **Proposed residual hints:**  
  1. Construye `left = f"HELP: {cmd}"` y calcula cuántos espacios faltan hasta `width` (mínimo 1).  
  2. La tercera línea es texto fijo de 2=uso / 1=error; no pases por `format_help`.
- **Proposed residual retrospective (full text):**  
  Ejemplos concretos («ingest --input …») superan descripciones abstractas. Alinear el `#` hace escaneable el help en terminal. Pregunta: ¿el operador lee teoría o copia del `--help`? En T3-B el siguiente riesgo es contaminar stdout con logs.
- **Code/output changes:** none (do not touch pad math without re-checking output widths)

### S10-T3-B-E1 (weDo, guided)
- **Scores:** preamble **Strong** · instruction **Strong** · feedback **Adequate** · retrospective **Needs residual** (~23 w; shares “canal importa” with feedback)
- **Checklist:** pass; retro thin + overlap
- **Severity residual:** P1
- **Proposed residual feedback (full text):**  
  Si `event=done` aparece antes del `6` sin prefijo `stderr:`, aún escribes el log con `print` en stdout. Usa `err.write(...\n)` y deja el valor de negocio en el `return` (el harness lo imprime como “stdout” del demo).
- **Proposed residual retrospective (full text):**  
  El canal importa más que el mensaje. Mismo patrón en el CLI real con `sys.stderr`. Pregunta: si alguien hace `cmd | jq`, ¿dónde debe vivir `event=done`? E2: el path `-` como convención de stdin.
- **Code/output changes:** none
- **Hints residual (P2):** replace near-duplicate hints so hint 2 teaches “why StringIO” not “don’t print.”

### S10-T3-B-E2 (weDo, independent)
- **Scores:** preamble **Strong** · instruction **Adequate** · feedback **Needs residual** (~23 w) · retrospective **Needs residual** (~22 w; shares “`-` es contrato”)
- **Checklist:** pass; thin close + harness name nit
- **Severity residual:** P1 (prose) · P2 (harness)
- **Proposed residual feedback (full text):**  
  Si ambos modos devuelven el `file_text`, el branch `path_or_dash == "-"` no está leyendo `stdin_text`. El path de archivo solo se usa cuando **no** es guion; aquí simulas I/O con argumentos, sin abrir disco.
- **Proposed residual retrospective (full text):**  
  `-` es un contrato de operadores, no magia de Python. En prod usarás `sys.stdin.read` o `Path.read_text`. Pregunta: ¿qué imprime un pipe real si olvidas el branch del guion? E3: JSON limpio vs logs mezclados.
- **Code/output changes:** optional: unify `"f.txt"` vs `"file.csv"` in starter/solution if harness compares call sites

### S10-T3-B-E3 (weDo, transfer)
- **Scores:** preamble **Strong** · instruction **Adequate** · feedback/retro **Needs residual** (both lead with GOOD = otro canal)
- **Checklist:** pass; collapse + starter harness note
- **Severity residual:** P1
- **Proposed residual feedback (full text):**  
  En GOOD solo debe quedar el JSON en el return; «empezando»/«fin» van al StringIO de err. Si falta la línea `stderr_only …`, el harness de verificación no está imprimiendo `err.getvalue()` como en la solution.
- **Proposed residual retrospective (full text):**  
  GOOD no es «menos logs»: es **otro canal**. El self-check del curso pregunta esto a propósito. Pregunta: ¿`jq` falla por JSON inválido o por basura alrededor? En T4-A el siguiente contrato es *quién gana* entre flag, env y archivo.
- **Code/output changes:** none to output; if starter is auto-run for tests, align print path with solution’s `stderr_only` (R1 P2 still open)

---

### We Do — T4-A / T4-B

### S10-T4-A-E1 (weDo, guided)
- **Scores:** preamble **Strong** · instruction **Strong** · feedback **Strong** · retrospective **Needs residual** (shares None slogan)
- **Checklist:** all pass on task
- **Severity residual:** P1
- **Proposed residual retrospective (full text):**  
  None = «capa ausente», no el string `"None"`. La traza enseña el mismo orden que el README del paquete. Pregunta: si inviertes PREC, ¿qué source gana con este fixture? E2: merge de varias claves con el mismo filtro.
- **Keep feedback as-is** (symptom: `apply file -> None` / winner=INFO) — do not copy into retro.
- **Code/output changes:** none

### S10-T4-A-E2 (weDo, independent)
- **Scores:** **Strong** on task · retro **Needs residual** (shares None/jobs line with feedback)
- **Severity residual:** P1
- **Proposed residual retrospective (full text):**  
  Un `None` en env no es «apagar jobs»: es «esta capa no opina». Ese detalle evita configs a medias cuando el operador no exportó la variable. Pregunta: ¿qué pasa si haces `out.update(env)` sin filtrar None? E3: devolver también la *razón* del valor final.
- **Code/output changes:** none

### S10-T4-A-E3 (weDo, transfer)
- **Scores:** preamble **Strong** · instruction **Needs residual** (full algorithm) · feedback **Strong** · retrospective **Needs residual** (thin)
- **Checklist:** transfer integrity **partial fail**
- **Diagnosis:** Worst E3 spoon-feed in the section: steps 1–2 are the complete solution. Hints also paste the return tuples. For transfer, instruction should state goal + print format; leave the if/else to the learner.
- **Severity residual:** P1
- **Proposed residual instruction (full text):**  
  1. Implementa `resolve_with_reason(env, flag)` devolviendo `(valor, razón)`.  
  2. Regla de negocio: el flag solo gana si **no** es `None`; si el flag está ausente, gana env.  
  3. Imprime ambos conflictos del bucle en el formato del contrato (`result=… razón=…`).  
  4. Quita `ok` y no inventes un default INFO aquí.
- **Proposed residual hints:**  
  1. Distingue “flag pasado con valor” de “flag no pasado (`None`)”.  
  2. Las razones del contrato son fijas en texto; no improvises redacciones nuevas.
- **Proposed residual retrospective (full text):**  
  La razón es parte del diagnóstico de arranque (stderr), no del payload de datos. Pregunta: con env=DEBUG y flag=None, ¿quién gana y por qué no INFO? En T4-B cierras el paquete con secretos fuera del repo y validación fail-closed.
- **Code/output changes:** none

### S10-T4-B-E1 (weDo, guided)
- **Scores:** preamble **Strong** · instruction **Adequate** (short) · feedback **Strong** · retrospective **Adequate**
- **Checklist:** all pass
- **Diagnosis:** Best secrets misconception (`.env.example` vs `.env`). Instruction ~24 w slightly short but clear.
- **Severity residual:** P2 optional (pad instruction step on patterns)
- **Proposed residual:** none required
- **Code/output changes:** none

### S10-T4-B-E2 (weDo, independent)
- **Scores:** preamble **Adequate** (thin) · feedback/retro **Needs residual** (“mensajes con nombre de clave” shared)
- **Severity residual:** P1
- **Proposed residual feedback (full text):**  
  Si sale `passed_bad` o no aparece `data_dir` en el error, `validate_config` aún no exige ambas claves. El caso feliz imprime solo `ok`; el incompleto debe lanzar y capturarse — no dejes pasar el segundo `validate_config` en silencio.
- **Proposed residual retrospective (full text):**  
  Mensajes con nombre de clave son documentación ejecutable para el operador. El mismo espíritu que `config: falta input_path para ingest` de la demo. Pregunta: ¿stacktrace crudo o `RuntimeError` con clave? E3: endurecer defaults inseguros (DEBUG, tokens).
- **Code/output changes:** none

### S10-T4-B-E3 (weDo, transfer)
- **Scores:** preamble **Strong** · instruction **Adequate** · feedback **Adequate** · retrospective **Strong**
- **Checklist:** all pass
- **Diagnosis:** Solid transfer close of T4. Mild optional: feedback could avoid restating “cierre de T4” (belongs to retro only).
- **Severity residual:** P2 optional
- **Proposed residual feedback (optional full text):**  
  Si el token o DEBUG sobreviven, `harden_defaults` no aplica las reglas: DEBUG→INFO, `echo_sql` True→False, `api_token` truthy→None. Copia el dict y transforma; no hardcodees el dict final sin recorrer claves.
- **Code/output changes:** none

---

### You Do

### S10-YOU-DO (youDo)
- **Scores:** context **Strong** · objectives **Strong** · requirements **Strong** · rubric **Strong** · retrospective **Strong** (~65 w, within 40–80)
- **Checklist:** context pass · goal pass · success pass (rúbrica + defensa 30s anclada en context y retro) · constraints pass (sin secretos, sintéticos) · retrospective pass
- **Diagnosis:** R1 gap closed cleanly. Context now mentions 30s defense; objectives include exit 2 / normalize sintético; retrospective has three defense prompts (invariant, secrets/PII, impacto medible). Bootstrap remains large but on-mission — no prose expansion needed.
- **Severity residual:** — (none required)
- **Proposed residual:** none
- **Code/output changes:** none

---

## Priority order (Round 2 Fixer)

### P1 — learning integrity / metacognition (do first)
1. **S10-T4-A-DEMO** — rewrite retrospective (stop copying why slogan)
2. **S10-T4-B-DEMO** — rewrite retrospective (stop copying why slogan)
3. **S10-T4-A-E3** — detune instruction (+ hints) so E3 is transfer, not paste-the-if
4. **S10-T3-A-E1** — expand preamble; de-dupe feedback vs retro; optional better hints
5. **S10-T3-A-E2** — retrospective without repeating feedback’s “unificas todo en 1”
6. **S10-T1-B-E1** — de-dupe feedback / retrospective (`_` promesa)
7. **S10-T2-A-E1** — de-dupe guiones/import + thicken retro
8. **S10-T2-A-E3** — de-dupe “diagnóstico ordenado”
9. **S10-T2-B-E2** — de-dupe Runtime vs dev slogan
10. **S10-T3-B-E1 / E2 / E3** — de-dupe canal / `-` / “otro canal”; thicken thin retros
11. **S10-T4-A-E1 / E2** — de-dupe None slogans into retro-only with self-check
12. **S10-T4-B-E2** — de-dupe “mensajes con nombre de clave”

### P2 — length, hints, harness cosmetics
- I Do thin why/retro: **T1-B, T2-A, T2-B, T3-A, T3-B** (use full texts above where provided)
- We Do thin retro pad: **T1-A-E1, T1-B-E3, T2-B-E1, T3-A-E3**
- Thin feedback: **T1-B-E2, T2-A-E2**
- **T3-A-E3** instruction formula + over-specific pad counts in hints
- **T1-A-E3** optional: quote three success style strings under Éxito
- Hints dedup: **T3-A-E1, T3-B-E1**
- Harness only if needed: **T1-B-E2** compare args; **T3-B-E2** path name; **T3-B-E3** starter `stderr_only` print path
- Do **not** force casefold on **T1-B-E1** without execute-and-diff

### No change required
- **S10-T1-A-DEMO**, **S10-T1-A-E2**, **S10-T2-A-E2** (optional only), **S10-T2-B-E3** (optional), **S10-T4-B-E1**, **S10-T4-B-E3** (optional), **S10-YOU-DO**

---

## Residual risks

1. **Platform id `sklearn`:** still legacy routing; learner-facing prose correctly says `familiarity_core` — do not “fix” the id.
2. **Simulated packaging in one file:** several We Do units model layout/install/MNF without a real filesystem; prose should keep saying *contrato / hechos / simulación* where relevant (T2-A especially). You Do is the real package.
3. **E3 formula spoilers:** Fixer must resist “clearer steps” that re-paste the solution (especially T4-A-E3).
4. **Feedback/retro collapse is section-wide:** fix the P1 list by rewriting *one* of the two fields per unit — usually thicken retro with self-check and keep feedback symptom-first.
5. **Anti-aberration:** every residual paragraph must stay hand-written; no bulk search-replace of a single template across 24 We Dos.
6. **Outputs:** preserve exact solution outputs unless an execute-and-diff justifies a harness alignment (document it).

---

## Counts summary for Round-2 Fixer

| Kind | Units | Shell after R1 | Residual focus |
|------|------:|:--------------:|----------------|
| iDo | 8 | complete | 2× P1 why/retro copy (T4-A/B); several thin why/retro P2 |
| weDo | 24 | complete | ~12 P1 de-dupe or transfer/instruction; rest P2 polish |
| youDo | 1 | complete | none |

**Code/output policy:** preserve exact solution outputs. Optional harness alignments only where listed as P2. Do not invent new exercises.

---

Section 10 exercise pedagogy review complete. Ready for the Fixer prompt.
