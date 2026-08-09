# S10 Exercise Pedagogy Report (Round 1)

## Section
- **title:** Módulos, packaging y CLI profesional
- **id:** `sklearn` (index 10; archivo histórico `s10-sklearn.ts` — contenido es packaging/CLI de `familiarity_core`, no scikit-learn)
- **source:** `src/lib/course/sections/s10-sklearn.ts`
- **counts:** iDo 8, weDo 24 (8 subtemas × E1/E2/E3), youDo 1
- **subtopics:** T1-A imports/`__main__` · T1-B API pública · T2-A layout/src · T2-B SemVer/deps · T3-A argparse/exit codes · T3-B stdio · T4-A precedencia · T4-B secretos/validación

## Method
- Read `PEDAGOGY_EXERCISE_SPEC.md` (preamble checklist, retrospective, E1→E2→E3 fade, length limits)
- Manually inspected every `iDo.steps[]`, `weDo.steps[]`, and `youDo` in the source (código, starter, solution, output, instruction, hint(s), feedback, why)
- Cross-checked against section story (paquete `familiarity_core`, gate CP-N1-B empaquetado / base CP-N1-C, stdlib, datos sintéticos, sin secretos ni PII real)
- No bulk generation, no scripts, no copy-paste across sections

## Global findings (before unit ledger)

| Gap | Where | Impact |
|-----|--------|--------|
| **Zero `preamble`** | All 8 iDo + all 24 weDo | Newbie no ve escenario de empaquetado/CLI → meta → éxito → límites antes del código |
| **Zero `retrospective`** | All iDo + weDo + youDo | Cierre metacognitivo ausente; no hay puente a la siguiente práctica ni defensa del capstone |
| **Zero We Do `title`** | 24 weDo | Solo el prefijo “E1/E2/E3 · T…” dentro de `instruction`; UI carece de encabezado corto |
| **Instructions = drill + fixture** | Most weDo | “Concepto + salida exacta”; poco andamiaje ordenado en pasos para E1; E2/E3 a veces aún suenan a mini-spec |
| **Feedback de una línea** | Most weDo | Señala el síntoma; casi no repara el *razonamiento* (por qué flags > env, por qué `_` no va en `__all__`, etc.) |
| **`why` iDo corto y técnico** | 8 demos | Cumple rol técnico; no sustituye preamble (antes) ni retrospective (después) |
| **youDo bien enmarcado** | context/objectives/requirements/rubric + bootstrap sólido | Fuerte para proyecto instalable; falta solo `retrospective` de defensa |
| **Código/outputs** | Casi todos | Pedagógicamente coherentes; defectos `# DEFECT:` bien nombrados; outputs exactos son el contrato de éxito |
| **E1→E2→E3 fade** | Parcialmente bueno | Los *kinds* y defectos escalan bien en varios subtemas (p. ej. T3-A, T4-A); la prosa no refleja el fade (E1 no guía por pasos, E3 no suelta contexto de transferencia) |

**Severity default for this section:** systematic missing preamble+retrospective is **P0** on every We Do and **P1** on I Do (demos still have `description`+`why`+worked code). youDo retrospective alone is **P1**. Feedback/title polish is often **P2** if preamble/instruction/retrospective land.

---

## Unit ledger

### S10-T1-A-DEMO (iDo)
- **Diagnosis:** Demo útil de separación `normalize` / `main` y de que al “importar” no se dispara el CLI, pero el learner solo ve `assert` + `raise SystemExit(main(...))` sin escena. `description` y `why` son telegráficos. No se nombra qué observar (`__all__`, ausencia de side-effect al import, exit 0). Un newbie de packaging no conecta esto con `python -m familiarity_core`.
- **Checklist:** context fail · goal partial · success partial (output existe) · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  Antes de empaquetar el CLI de **familiarity_core**, la lógica de normalizar nombres debe vivir en una función pura y el entrypoint solo orquestar. En esta demo (datos sintéticos, sin PII) observa tres cosas sin escribir aún: (1) `__all__` declara solo `normalize`; (2) `main` imprime el nombre limpio y devuelve `0`; (3) al “importar” se puede llamar `normalize` con un `assert`, y el CLI se invoca **explícito** vía `main([...])`. Predice la salida de `"  José Pérez "` y compárala con el panel.
- **Proposed instruction/description improvements:**  
  Description opcional: “Separar `normalize` del entrypoint `main` (sin side-effects al importar)”. Ampliar `why` (~50–70 palabras): la guarda de entrada (aquí simulada con llamada explícita a `main`) evita que un `import familiarity_core` ejecute el CLI; en el paquete real usa `if __name__ == "__main__"` o `__main__.py`.
- **Proposed retrospective:**  
  Si puedes explicar por qué `normalize` debe ser usable sin imprimir nada al importar, ya internalizaste el contrato de módulo. El error clásico es meter `print` o `parse_args` a nivel de módulo. En We Do T1-A practicarás API pública, util compartido anti-ciclo y estilos de import.
- **Code/output changes:** none
- **Validation notes:** Output `josé pérez` es el éxito observable; el `assert` no imprime.

---

### S10-T1-A-E1 (weDo, guided)
- **Diagnosis:** Defecto claro (`_ws` solo hace strip; `__all__` exporta el privado). Instruction nombra éxito exacto pero mezcla meta y pasos en un párrafo; sin title/preamble/retrospective. Feedback de una línea no repara el misconception “exportar el helper es más transparente”.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** API pública `clean` sin exportar `_ws`
- **Proposed preamble:**  
  - **Contexto:** en `familiarity_core` el módulo de normalización debe ofrecer un símbolo estable y esconder helpers.  
  - **Meta:** hacer privado el colapso de espacios y exportar solo `clean` con casefold.  
  - **Éxito:** imprimes `['clean']` y luego `x` (de `clean('  X ')`).  
  - **Límites:** no pongas `_ws` en `__all__`; no dejes `print('ok', True)`; solo stdlib.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: `# DEFECT` marca `_ws` incompleto y `__all__` incorrecto.  
  2. Haz que `_ws` colapse espacios con `" ".join(s.split())`.  
  3. En `clean`, aplica casefold sobre el resultado de `_ws`.  
  4. Deja `__all__ = ["clean"]`, imprime `__all__` y `clean("  X ")`, quita la línea extra `ok`.
- **Proposed feedback improvement:**  
  `__all__` documenta la API que el equipo puede importar con confianza. Un helper `_ws` es detalle interno: si lo exportas, mañana no puedes renombrarlo. `strip` no colapsa espacios internos; `split`+`join` sí, y casefold unifica mayúsculas de forma más robusta que `lower` en textos con acentos.
- **Proposed retrospective:**  
  Público = contrato; `_` = convención de “no toques esto”. El mismo patrón se repite en la fachada del paquete (normalize, compare…). Siguiente (E2): un util compartido para romper ciclos A↔B.
- **Code/output changes:** none
- **Validation notes:** Starter defect is pedagogical and well-formed.

---

### S10-T1-A-E2 (weDo, independent)
- **Diagnosis:** Buen foco anti-ciclo (util compartido + sufijos). Instruction densa con salida exacta; sin contexto de “por qué no importar A desde B”. Feedback corto. E2 debería fijar meta+éxito con menos migas — hoy aún lista el defect casi completo en la instruction.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Util compartido y sufijos `:a` / `:b`
- **Proposed preamble:**  
  - **Contexto:** si `module_a` y `module_b` se necesitan mutuamente, el import circular rompe el paquete al arrancar.  
  - **Meta:** concentrar la normalización en `util_norm` y dejar que A/B solo orquesten.  
  - **Éxito:** tres líneas `hola:a`, `hola:b`, `ok`.  
  - **Límites:** no crees dependencia A↔B; no dejes el casefold fuera del util; quita `print('ok', True)` y usa `print("ok")` final.
- **Proposed instruction/description improvements:**  
  1. Corrige `util_norm` para strip + casefold.  
  2. Asigna el sufijo correcto: A → `:a`, B → `:b`.  
  3. Imprime ambos procesos y un `ok` final de contrato.  
  4. No hardcodees el texto “hola” fuera de la función.
- **Proposed retrospective:**  
  El util compartido es el primer recurso anti-ciclo; el lazy import es plan B. Si A y B solo llaman al util, el grafo de imports queda acíclico. Luego (E3) elegirás *cómo* importar según el rol (mismo paquete, plugin, CLI).
- **Code/output changes:** none
- **Validation notes:** Solution prints `"ok"` (string) matching contract; starter had `print('ok', True)` to remove.

---

### S10-T1-A-E3 (weDo, transfer)
- **Diagnosis:** Transferencia real (despacho por `kind` estructurado, no por substring del label). Instruction ya narra casi la tabla de decisión; falta escena de “operador vs autor del paquete” y cierre. Feedback aceptable pero no nombra el fail-closed con `ValueError`.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Estilo de import según el rol
- **Proposed preamble:**  
  - **Contexto:** el mismo paquete se consume distinto: módulo hermano, plugin externo o arranque del CLI.  
  - **Meta:** recomendar el estilo de import despachando por `kind`, no por el texto del label.  
  - **Éxito:** tres líneas `label -> estilo` exactamente como en el contrato de salida.  
  - **Límites:** no uses `PYTHONPATH=.` ni manipules `sys.path`; kind desconocido debe fallar (fail-closed), no devolver un default genérico.
- **Proposed instruction/description improvements:**  
  1. Lee el starter: las ramas de `recommend_import_style` están invertidas/incompletas.  
  2. Mapea `same_package`, `external_plugin` y `run_cli` a los strings del contrato.  
  3. Imprime con `f"{label} -> {…}"` usando el kind del tuple.  
  4. Quita el print extra `ok`.
- **Proposed retrospective:**  
  El label es solo UI; la política se decide por un kind tipificado. `python -m familiarity_core` evita pelear con `sys.path`. En T1-B el foco pasa de *cómo importar* a *qué exportar* en la fachada.
- **Code/output changes:** none
- **Validation notes:** Solution raises on unknown kind — good fail-closed; starter default was the pedagogical trap.

---

### S10-T1-B-DEMO (iDo)
- **Diagnosis:** Worked example fuerte de fachada con 4 símbolos y helper `_private_token`. `why` de una frase no ancla el costo de exportar internos ni el vínculo con SemVer. Sin preamble (qué mirar en `__all__`) ni retrospective (puente a mark_private / facade).
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  La fachada de **familiarity_core** debe ser pequeña y estable: el equipo importa pocos nombres y el resto es detalle. En la demo, sigue el código sin reescribirlo: (1) `_private_token` no aparece en `__all__`; (2) `normalize` / `compare` / `ingest_row` / `report` sí; (3) `compare("Ana", " ana ")` devuelve `1.0` porque normaliza ambos lados. Datos sintéticos. Predice `exports` y el último `1` del `report` antes de mirar la salida.
- **Proposed instruction/description improvements:**  
  Mantener description. Ampliar `why`: cuatro símbolos reducen breaking changes; renombrar un público es major; el `_` es convención de privacidad, no enforcement del runtime.
- **Proposed retrospective:**  
  Si el consumidor solo conoce la fachada, puedes refactorizar `_private_token` sin romper pipelines. El error clásico es “exportar todo por comodidad”. We Do: filtrar públicos, armar `__all__` y documentar un breaking de firma.
- **Code/output changes:** none

---

### S10-T1-B-E1 (weDo, guided)
- **Diagnosis:** Defecto guiado claro (`public = names` sin filtrar; falta línea private). Instruction corta; no ancla al criterio `startswith('_')`. Nota pedagógica menor: solution usa `.lower()` no casefold — aceptable aquí porque el foco es API, no normalización Unicode.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Separar nombres públicos y privados
- **Proposed preamble:**  
  - **Contexto:** al auditar un módulo de normalización, el operador de packaging lista qué es API y qué es helper.  
  - **Meta:** filtrar por convención `_` y demostrar que `compare` sigue funcionando.  
  - **Éxito:** `public ['normalize', 'compare']`, `private ['_tokenize']`, y `True`.  
  - **Límites:** no reutilices la lista cruda como “public”; no mutes `names` si no hace falta.
- **Proposed instruction/description improvements:**  
  1. Revisa el starter: `public = names` exporta también `_tokenize`.  
  2. Construye `public` y `private` con `startswith("_")`.  
  3. Imprime con las etiquetas `public` / `private` y luego `compare("A", "a")`.  
  4. Quita `print('ok', True)`.
- **Proposed retrospective:**  
  El prefijo `_` es una promesa al equipo, no un candado del intérprete. Filtrar la lista es el mismo criterio que pondrías en `__all__`. Siguiente: construir la fachada real con casefold.
- **Code/output changes:** none (mantener `.lower()` en solution si el output no cambia; no forzar casefold en este E1)

---

### S10-T1-B-E2 (weDo, independent)
- **Diagnosis:** Fachada mínima bien planteada; starter con `__all__` vacío y `compare` crudo. Instruction casi es el contrato completo. Sin escena de “reexport en `__init__.py`” ni retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Fachada `normalize` + `compare`
- **Proposed preamble:**  
  - **Contexto:** el `__init__` o `api.py` del paquete reexporta solo lo estable del ETL de familiaridad.  
  - **Meta:** implementar normalize (strip+casefold), compare vía normalize, y fijar `__all__`.  
  - **Éxito:** `['normalize', 'compare']` y `True` para `compare("Z", " z ")`.  
  - **Límites:** no reexportes helpers con `_`; no compares strings crudos.
- **Proposed instruction/description improvements:**  
  1. Completa `normalize` y `compare` del starter.  
  2. Asigna `__all__` con los dos nombres públicos.  
  3. Imprime `__all__` y el resultado de `compare` del caso del solution.  
  4. Elimina líneas de debug.
- **Proposed retrospective:**  
  Compare debe pasar por la misma normalización que el resto del pipeline; si no, el “score” miente. Una fachada chica es el primer paso hacia SemVer sano. E3: documentar un breaking de tipo de retorno.
- **Code/output changes:** none  
  (Nota: starter prueba `compare("A","a")` y solution `compare("Z"," z ")` — el Fixer debe asegurar que el harness use el caso de solution; no cambiar el output canónico.)

---

### S10-T1-B-E3 (weDo, transfer)
- **Diagnosis:** Transferencia a política de versionado (major + migración). Starter hace patch por error — excelente. Instruction mezcla tres prints en un solo bloque; falta anclar “por qué un cambio de bool→float es breaking para consumidores”.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Documentar breaking y major bump
- **Proposed preamble:**  
  - **Contexto:** el equipo cambió `compare` de `bool` a `float` score; los consumidores con `is True` se rompen.  
  - **Meta:** calcular major bump y escribir nota de migración legible.  
  - **Éxito:** tres líneas BREAKING / NEW_VERSION / MIGRATION exactas del contrato.  
  - **Límites:** no hardcodees `2.0.0` si puedes calcularlo; no uses patch para un cambio de firma pública.
- **Proposed instruction/description improvements:**  
  1. Corrige `major_bump` (MAJOR+1, MINOR/PATCH en 0).  
  2. Completa el texto de migración del `document_breaking`.  
  3. Verifica las tres líneas de salida.  
  4. Quita prints extra.
- **Proposed retrospective:**  
  Cambiar el tipo de retorno de un símbolo público es major, aunque “sea el mismo nombre”. La migración debe decir *qué hacer* (aquí: comparar con `1.0`). En T2-A empaquetas el layout que hace instalable esa API.
- **Code/output changes:** none

---

### S10-T2-A-DEMO (iDo)
- **Diagnosis:** Demo clara de rutas `src/` + claves mínimas de pyproject + mensaje de editable install. `why` decente pero sin preamble que diga *por qué* src evita importar el repo sin instalar. Sin retrospective hacia complete_project / diagnose_mnf.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  El gate de **CP-N1-B** pide un paquete instalable, no un script suelto en la carpeta del curso. Observa el layout sintético: código bajo `src/familiarity_core/`, metadata en `pyproject.toml`, y el comando `pip install -e .`. Predice el orden de paths y el dict `pyproject.project` antes de leer la salida. No escribas aún; fija mentalmente name, version y requires-python.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: layout src evita que Python importe el árbol del repo por cwd; editable refleja cambios al toque en desarrollo del CLI.
- **Proposed retrospective:**  
  Si el import y la carpeta no coinciden, o no instalaste editable, aparece `ModuleNotFoundError`. We Do: normalizar metadata, listar el layout y diagnosticar fallos de import por hechos estructurados.
- **Code/output changes:** none

---

### S10-T2-A-E1 (weDo, guided)
- **Diagnosis:** `complete_project` con defect de identidad (devuelve partial tal cual) es un buen E1. Instruction es casi solo el dict de éxito; no explica name con guiones vs import con guion bajo (edgeCases lo menciona, no el learner-facing core).
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Normalizar metadata de pyproject
- **Proposed preamble:**  
  - **Contexto:** un `pyproject` incompleto o con name viejo (`familiarity`) no es el contrato del paquete del curso.  
  - **Meta:** normalizar name, version y requires-python para instalación editable.  
  - **Éxito:** un dict impreso con name `familiarity-core`, version `0.1.0`, requires-python `>=3.11`.  
  - **Límites:** no devuelvas el partial crudo; conserva version si ya viene; solo stdlib.
- **Proposed instruction/description improvements:**  
  1. Copia `partial` a un dict nuevo.  
  2. Fuerza `name` y `requires-python`; version con default `0.1.0`.  
  3. Imprime el resultado de `complete_project({...})`.  
  4. Quita `print('ok', True)`.
- **Proposed retrospective:**  
  Name de distribución puede llevar guiones; el import usa `familiarity_core`. Metadata mínima incompleta = install frágil. E2: armar las rutas del layout src.
- **Code/output changes:** none

---

### S10-T2-A-E2 (weDo, independent)
- **Diagnosis:** Buen E2 de construcción de paths; starter omite `cli.py` y `pyproject.toml`. Instruction lista la salida línea a línea (éxito claro) pero sin meta de “layout instalable mínimo”.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Listar layout `src/` instalable
- **Proposed preamble:**  
  - **Contexto:** el bootstrap del proyecto debe listar qué archivos tocan el install editable.  
  - **Meta:** construir paths `src/<paquete>/…` desde módulos y anexar `pyproject.toml`.  
  - **Éxito:** cuatro líneas en orden: tres bajo src (init, normalize, cli) y pyproject al final.  
  - **Límites:** no hardcodees solo dos paths; `pyproject.toml` no va bajo `src/`.
- **Proposed instruction/description improvements:**  
  1. Implementa `src_layout(package, modules)` desde los argumentos.  
  2. Incluye todos los módulos de la lista.  
  3. Añade `pyproject.toml` al final.  
  4. Imprime un path por línea.
- **Proposed retrospective:**  
  El layout es el mapa mental del paquete: código importable bajo src, metadata en la raíz. Si falta `cli.py`, el entrypoint del gate no existe. E3: diagnosticar por qué el import falla tras install.
- **Code/output changes:** none

---

### S10-T2-A-E3 (weDo, transfer)
- **Diagnosis:** Excelente transferencia (árbol de decisión ordenado sobre hechos, no strings libres). Instruction larga y casi es la solución en prosa; falta contexto de “checklist del on-call” y retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Diagnosticar `ModuleNotFoundError`
- **Proposed preamble:**  
  - **Contexto:** tras `pip install -e .`, un `import` puede fallar por no install, nombre distinto a la carpeta, o un script homónimo en el cwd.  
  - **Meta:** devolver la **primera** causa según un orden fijo de hechos.  
  - **Éxito:** tres líneas `cause: …` del contrato, una por caso.  
  - **Límites:** no busques palabras en un string libre; no devuelvas siempre “no instalado”.
- **Proposed instruction/description improvements:**  
  1. Lee las claves de `facts` en orden: installed → igualdad de nombres → shadowing.  
  2. Devuelve el string de cause exacto del contrato.  
  3. Imprime un diagnose por caso del starter.  
  4. Quita el print extra.
- **Proposed retrospective:**  
  Un diagnóstico ordenado evita “probar de todo”. El script en el cwd que tapa el paquete es un clásico de demos locales. En T2-B versionas y declaras deps con el mismo rigor de contrato.
- **Code/output changes:** none

---

### S10-T2-B-DEMO (iDo)
- **Diagnosis:** Demo corta de classify+bump para un subcomando nuevo → minor. `why` menciona CHANGELOG pero no se ve en código. Sin escena “cuándo major vs minor” ni cierre.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  Antes de publicar `familiarity-core`, cada cambio de API o CLI debe subir la versión con criterio. Observa la demo: la descripción “add subcomando report” se clasifica como **minor** y el bump de `0.1.0` produce `0.2.0`. No reescribas el código; verifica mentalmente que un “rename api” iría a major y un typo a patch.
- **Proposed instruction/description improvements:**  
  Ampliar `why`: feature compatible = minor; breaking de API pública = major; fix de help = patch; anota el cambio en CHANGELOG aunque sea breve.
- **Proposed retrospective:**  
  Si clasificas mal un rename como patch, rompes a consumidores sin aviso. We Do: clasificar en español, separar deps runtime/dev y políticas hacia entidades de S11.
- **Code/output changes:** none

---

### S10-T2-B-E1 (weDo, guided)
- **Diagnosis:** Doble defecto rico (classify invertido + major sin resetear) — excelente E1. Instruction densa con cuatro casos; se beneficia de pasos guiados y de nombrar el misconception “major deja minor/patch”.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Clasificar cambio y bumpear SemVer
- **Proposed preamble:**  
  - **Contexto:** el CHANGELOG del CLI habla en español (“renombrar”, “añadir”, “corregir”).  
  - **Meta:** clasificar y **calcular** la nueva versión desde `1.0.0`, no inventar el string a mano.  
  - **Éxito:** cuatro líneas `descripción: kind -> versión` del contrato.  
  - **Límites:** major debe resetear minor/patch a 0; orden de classify: renombrar/eliminar → añadir → typo.
- **Proposed instruction/description improvements:**  
  1. Corrige `classify_change` (breaking no es patch).  
  2. Corrige `bump` en major a `X.0.0`.  
  3. Deja `bump_from_description` como orquestador.  
  4. Imprime el formato del contrato; quita `ok`.
- **Proposed feedback improvement:**  
  Renombrar o eliminar API/CLI pública es major: subes el primer número y vuelves a cero el resto. Si solo sumas el major dejando `1.1.0` residual, mientes el SemVer. Añadir un flag compatible es minor; un typo de help es patch.
- **Proposed retrospective:**  
  Classify y bump son dos pasos: primero política, luego aritmética. El mismo criterio se usa en el gate cuando renombramos un subcomando. E2: dónde vive pytest (dev, no runtime).
- **Code/output changes:** none

---

### S10-T2-B-E2 (weDo, independent)
- **Diagnosis:** Defecto clásico (pytest en dependencies). Instruction es el dict de éxito; falta el porqué de N1 stdlib-first.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Separar deps runtime y dev
- **Proposed preamble:**  
  - **Contexto:** en N1 el paquete puede ser solo biblioteca estándar; pytest es herramienta de desarrollo.  
  - **Meta:** armar el bloque de deps con runtime vacío y pytest en optional `dev`.  
  - **Éxito:** dict con requires-python `>=3.11`, dependencies `[]`, optional-dependencies.dev `['pytest']`.  
  - **Límites:** no mezcles pytest en `dependencies`.
- **Proposed instruction/description improvements:**  
  1. Corrige `build_deps` para no concatenar dev en runtime.  
  2. Pon `optional-dependencies = {"dev": list(dev)}`.  
  3. Imprime el resultado del caso del starter.  
  4. Quita prints de debug.
- **Proposed retrospective:**  
  Runtime = lo que necesita el operador al instalar el CLI; dev = lo que necesita el autor al testear. Mezclarlos infla el install del equipo. E3: política de compat hacia tipos de dominio (S11).
- **Code/output changes:** none

---

### S10-T2-B-E3 (weDo, transfer)
- **Diagnosis:** Transferencia a política de compat (rename_entity / optional_field / keep_cli_stable) con ramas invertidas en starter. Instruction larga; falta anclar “S11 no rompe el CLI de S10 sin bump”.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Política de compat hacia S11
- **Proposed preamble:**  
  - **Contexto:** más adelante modelarás entidades (p. ej. `ClientRecord`); eso no debe romper en silencio el CLI ya empaquetado.  
  - **Meta:** despachar política por `kind` estructurado, no por el label legible.  
  - **Éxito:** tres líneas `POLICY: …` exactas.  
  - **Límites:** kind desconocido → `ValueError`; no uses substrings del label.
- **Proposed instruction/description improvements:**  
  1. Reordena las ramas de `policy_for`.  
  2. Completa `keep_cli_stable` con el texto de no romper CLI sin bump/CHANGELOG.  
  3. Imprime solo `policy_for(kind)` por escenario.  
  4. Quita `ok`.
- **Proposed retrospective:**  
  El label es para humanos; el kind es para código. Mantener el CLI estable entre secciones es parte del gate. En T3-A implementas subcomandos y exit codes que el CI puede leer.
- **Code/output changes:** none

---

### S10-T3-A-DEMO (iDo)
- **Diagnosis:** Demo sólida de subparsers + captura de `SystemExit` → código 2. `why` bueno y corto. Falta preamble que diga *qué líneas* mirar (required subparsers, try/except, prints de code).
- **Checklist:** context fail · goal partial · success pass · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  El CLI del gate expone `ingest|normalize|compare|report` y debe ser operable desde scripts y CI. Observa sin escribir: (1) subparsers con `dest="cmd"` y `required=True`; (2) `report` acepta `--format`; (3) un argv vacío no “cae en 0”, devuelve **2**. Predice las líneas `code 0` / `bad_argv 2` y compáralas con la salida.
- **Proposed instruction/description improvements:**  
  Ampliar `why` ligeramente: separar `main(argv) -> int` del `sys.exit` permite testear sin spawn; 0 éxito, 1 runtime, 2 uso.
- **Proposed retrospective:**  
  Si siempre devuelves 0, el CI no detecta usage roto. We Do: armar subcomando report, mapear exit codes reales y escribir ayuda alineada para operadores.
- **Code/output changes:** none

---

### S10-T3-A-E1 (weDo, guided)
- **Diagnosis:** Starter mínimo (parser vacío) es un buen hueco guiado, pero la instruction es demasiado corta (“usa argparse subparsers”) y no guía por pasos al newbie de argparse. Hints cargan el andamiaje que debería estar en instruction E1.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Subcomando `report` con `--format`
- **Proposed preamble:**  
  - **Contexto:** el operador lanza `familiarity report --format json` y espera un Namespace usable.  
  - **Meta:** registrar subparser `report` y el flag de formato.  
  - **Éxito:** `Namespace(cmd='report', format='json')`.  
  - **Límites:** subparsers `required=True`; choices text|json; solo stdlib argparse.
- **Proposed instruction/description improvements:**  
  1. Crea `ArgumentParser` y `add_subparsers(dest="cmd", required=True)`.  
  2. Añade parser `report` con `--format` (choices text/json, default text).  
  3. Parsea `['report', '--format', 'json']`.  
  4. Imprime el namespace; quita prints extra.
- **Proposed retrospective:**  
  `required=True` hace que un argv vacío sea usage error, no un cmd `None` silencioso. El flag por subcomando mantiene el help legible. E2: traducir parse/runtime a exit codes 0/1/2.
- **Code/output changes:** none

---

### S10-T3-A-E2 (weDo, independent)
- **Diagnosis:** Uno de los mejores ejercicios de la sección (argparse real + SystemExit + runtime_ok). Instruction ya lista casos; falta contexto de por qué CI depende de 1 vs 2. Feedback corto pero certero.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Exit codes 0, 1 y 2 en el CLI
- **Proposed preamble:**  
  - **Contexto:** scripts y pipelines deciden si reintentar o fallar el job según el código de salida.  
  - **Meta:** devolver 2 en usage, 1 en error de negocio/config simulado, 0 en éxito.  
  - **Éxito:** cinco líneas `label: code` del contrato.  
  - **Límites:** no tragues `SystemExit` devolviendo 0; consulta `runtime_ok` solo tras parse OK.
- **Proposed instruction/description improvements:**  
  1. Envuelve `parse_args` en try/except SystemExit y propaga el code (default 2).  
  2. Si el parse pasa y `runtime_ok` es False, devuelve 1.  
  3. Éxito → 0.  
  4. Imprime los cinco casos del starter sin líneas extra.
- **Proposed feedback improvement:**  
  argparse lanza `SystemExit` con código 2 en flags inventados o subcomando ausente. Eso no es “error de Python feo”: es el contrato de uso. Un archivo que no existe o config inválida es runtime (1), distinto del usage.
- **Proposed retrospective:**  
  0/1/2 es lenguaje entre el CLI y el CI. Si unificas todo en 1, pierdes la señal de “el operador escribió mal el comando”. E3: ayuda humana alineada con ejemplos y esos mismos códigos.
- **Code/output changes:** none

---

### S10-T3-A-E3 (weDo, transfer)
- **Diagnosis:** Transferencia a UX de operador (padding de `#` a columna 52). Más “formato de texto” que argparse, pero enseña ayuda útil del gate. Instruction densa; el starter con “buen luck” es un defect memorable.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Ayuda alineada para el operador
- **Proposed preamble:**  
  - **Contexto:** en producción el operador copia ejemplos del `--help`, no lee la teoría del curso.  
  - **Meta:** alinear notas con `#` en columna fija y documentar códigos de salida.  
  - **Éxito:** dos HELP de ejemplo + una línea de códigos 2=uso / 1=error.  
  - **Límites:** width=52; no dejes un solo espacio arbitrario; no uses el placeholder “buen luck”.
- **Proposed instruction/description improvements:**  
  1. Implementa `format_help` con pad = max(1, width - len(left)).  
  2. Imprime los dos ejemplos del starter.  
  3. Añade la línea de códigos de salida del contrato.  
  4. Quita prints de debug.
- **Proposed retrospective:**  
  Ejemplos concretos (“ingest --input …”) superan descripciones abstractas. Alinear el `#` hace escaneable el help en terminal. En T3-B el siguiente riesgo es contaminar stdout con logs.
- **Code/output changes:** none  
  (Validar longitudes de pad en ejecución si el Fixer toca el string; el output canónico ya está fijado.)

---

### S10-T3-B-DEMO (iDo)
- **Diagnosis:** Demo limpia de datos en “stdout” (return/print) y logs en StringIO (stderr simulado). `why` de una frase. Falta decir *por qué* un pipe a `jq` se rompe si mezclas logs.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  Cuando un operador hace `… | jq`, solo deben fluir datos por stdout. Observa la demo: `normalize_cmd` escribe eventos de stage en un stream de error y devuelve el JSON limpio; el `print` de datos y el bloque `--- stderr ---` se separan a propósito. Datos sintéticos `{"name": "Ana"}`. No escribas aún; predice si “stage=” aparece antes o después del JSON.
- **Proposed instruction/description improvements:**  
  Ampliar `why`: logs en stderr permiten redirigir `2> log.txt` sin ensuciar el archivo de datos; en CLI real usa `print(..., file=sys.stderr)`.
- **Proposed retrospective:**  
  Si el log va a stdout, el consumidor del pipe parsea basura. We Do: escribir en err, elegir stdin vs path, y contrastar BAD vs GOOD CLI.
- **Code/output changes:** none

---

### S10-T3-B-E1 (weDo, guided)
- **Diagnosis:** Defecto simple y correcto (`print` vs `err.write`). Instruction y hints casi idénticos (redundantes). Falta escena de pipe.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Datos por retorno y log en stderr
- **Proposed preamble:**  
  - **Contexto:** un paso del CLI multiplica un valor de negocio y deja un evento de telemetría.  
  - **Meta:** devolver el dato por el return (stdout del demo) y escribir el log en el stream de error.  
  - **Éxito:** `6` y `stderr: event=done`.  
  - **Límites:** no uses `print` para el log; no inviertas el orden de las líneas de verificación.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: `process` hace `print("event=done")` en stdout.  
  2. Cambia a `err.write("event=done\\n")` y retorna `n * 2`.  
  3. Imprime el valor y la línea `stderr: …`.  
  4. Quita `ok`.
- **Proposed retrospective:**  
  El canal importa más que el mensaje. Mismo patrón en el CLI real con `sys.stderr`. E2: el path `-` como convención de stdin.
- **Code/output changes:** none

---

### S10-T3-B-E2 (weDo, independent)
- **Diagnosis:** Convención Unix `-` bien elegida; starter ignora path. Instruction mínima (casi solo éxito). Falta meta de “pipeable CLI”.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Leer de stdin o de archivo
- **Proposed preamble:**  
  - **Contexto:** el operador a veces pasa un archivo y a veces encadena con `|` usando `-`.  
  - **Meta:** elegir la fuente de texto según `path_or_dash`.  
  - **Éxito:** `desde stdin` y `desde file` en ese orden.  
  - **Límites:** no leas siempre `file_text`; simula I/O con los argumentos del starter (sin abrir disco real).
- **Proposed instruction/description improvements:**  
  1. Si `path_or_dash == "-"`, devuelve `stdin_text`.  
  2. Si no, devuelve `file_text` (o `""` si falta).  
  3. Imprime ambos modos del starter.  
  4. Quita prints extra.
- **Proposed retrospective:**  
  `-` es un contrato de operadores, no magia de Python. En prod usarás `sys.stdin.read` o `Path.read_text`. E3: JSON limpio vs logs mezclados.
- **Code/output changes:** none  
  (Starter usa `"f.txt"` y solution `"file.csv"` — cosmético; el harness debe alinear el caso impreso con el output esperado.)

---

### S10-T3-B-E3 (weDo, transfer)
- **Diagnosis:** Contraste BAD/GOOD excelente pedagógicamente. Instruction un poco críptica (“Imprime BAD y GOOD”); el contrato de salida es largo y el learner necesita saber qué va a err. Feedback bueno.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** JSON limpio vs logs mezclados
- **Proposed preamble:**  
  - **Contexto:** un consumidor `jq` o un pipe a otro subcomando falla si “empezando/fin” contaminan stdout.  
  - **Meta:** contrastar un CLI malo (todo en un string) con uno bueno (JSON en return, logs en err).  
  - **Éxito:** bloque BAD con tres líneas de basura+JSON; bloque GOOD solo JSON + línea `stderr_only …`.  
  - **Límites:** no dejes logs en el return de `good_cli`.
- **Proposed instruction/description improvements:**  
  1. Deja `bad_cli` como ejemplo de contaminación.  
  2. En `good_cli`, escribe progreso en `err` y retorna solo el JSON.  
  3. Imprime BAD/GOOD según el solution (incluye `stderr_only`).  
  4. Quita `ok`.
- **Proposed retrospective:**  
  GOOD no es “menos logs”: es **otro canal**. El self-check del curso pregunta esto a propósito. En T4-A el siguiente contrato es *quién gana* entre flag, env y archivo.
- **Code/output changes:** none  
  (Asegurar que el starter harness imprima `stderr_only` como la solution; hoy el starter no lo hace — el Fixer debe alinear la verificación con el output canónico, sin cambiar el output.)

---

### S10-T4-A-DEMO (iDo)
- **Diagnosis:** Demo mínima y clara de flags > env > default. Sin mencionar capa archivo ni el significado de flag `None`. `why` telegráfico.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  En ops del CLI, un flag de línea de comando debe poder forzar el nivel de log aunque el entorno diga otra cosa. Observa `resolve_log_level`: sin flag gana env; con flag gana el flag; sin nada, INFO. Predice las tres líneas de salida. No hay archivo de config en esta demo — solo el núcleo de la precedencia.
- **Proposed instruction/description improvements:**  
  Ampliar `why`: orden canónico completo es flags > env > file > defaults; un flag ausente (`None`) no debe pisar env (lo practicarás en We Do).
- **Proposed retrospective:**  
  Precedencia documentada y testeable evita “en mi máquina es DEBUG”. We Do: traza de capas, merge multi-clave y razón del ganador.
- **Code/output changes:** none

---

### S10-T4-A-E1 (weDo, guided)
- **Diagnosis:** Excelente E1 (PREC invertido + imprime None). Instruction larga pero didáctica; aún mezcla meta y pasos. Feedback nombra bien los síntomas.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Trazar capas de config y el ganador
- **Proposed preamble:**  
  - **Contexto:** al depurar “¿por qué el log_level es ERROR?”, el operador necesita una traza de capas.  
  - **Meta:** aplicar defaults → file → env → flags, saltando `None`, e imprimir el winner.  
  - **Éxito:** tres `apply …` (sin file) y `winner=ERROR source=flags`.  
  - **Límites:** no imprimas `apply file -> None`; flags es la prioridad más alta.
- **Proposed instruction/description improvements:**  
  1. Corrige el dict `PREC` (defaults=1 … flags=4).  
  2. Al recorrer, `continue` si `val is None`.  
  3. Actualiza winner/source y haz print de apply.  
  4. Imprime la línea winner; quita `ok`.
- **Proposed retrospective:**  
  None = “capa ausente”, no el string `"None"`. La traza enseña el mismo orden que el README del paquete. E2: merge de varias claves con el mismo filtro.
- **Code/output changes:** none

---

### S10-T4-A-E2 (weDo, independent)
- **Diagnosis:** Starter aplica capas al revés (flags base, defaults pisan). Instruction corta con éxito dict. Buen E2 independiente.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Merge de config con precedencia
- **Proposed preamble:**  
  - **Contexto:** el arranque del CLI fusiona defaults, archivo, entorno y flags en un solo dict.  
  - **Meta:** que el flag gane en `log_level` y que `jobs: None` en env **no** borre el default.  
  - **Éxito:** `{'log_level': 'ERROR', 'jobs': 1}`.  
  - **Límites:** aplica de menor a mayor prioridad; ignora `None` en capas altas.
- **Proposed instruction/description improvements:**  
  1. Parte de `dict(defaults)`.  
  2. Superpone file → env → flags solo si `v is not None`.  
  3. Imprime el merge del caso del starter.  
  4. Quita prints extra.
- **Proposed retrospective:**  
  Un `None` en env no es “apagar jobs”: es “esta capa no opina”. Ese detalle evita configs a medias. E3: devolver también la *razón* del valor final.
- **Code/output changes:** none

---

### S10-T4-A-E3 (weDo, transfer)
- **Diagnosis:** Micro-transferencia clara (flag no-None vs flag None). Instruction casi da el if/else; OK para transfer si se enmarca como conflicto real flag/env. Falta retrospective de “documenta la razón en logs de arranque”.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Quién gana entre flag y env
- **Proposed preamble:**  
  - **Contexto:** `FAMILIARITY_LOG_LEVEL=DEBUG` choca con `--log-level INFO`, o el flag no se pasó.  
  - **Meta:** devolver `(valor, razón)` con la regla “flag gana solo si no es None”.  
  - **Éxito:** dos líneas `result=… razón=…` del contrato.  
  - **Límites:** no inventes default INFO en esta función; no dejes que env gane siempre.
- **Proposed instruction/description improvements:**  
  1. Si `flag is not None`, gana el flag con su razón.  
  2. Si no, gana env con la razón “sin flag”.  
  3. Imprime ambos conflictos del bucle.  
  4. Quita `ok`.
- **Proposed retrospective:**  
  La razón es parte del diagnóstico de arranque (stderr), no del payload. En T4-B cierras el paquete con secretos fuera del repo y validación fail-closed.
- **Code/output changes:** none

---

### S10-T4-B-DEMO (iDo)
- **Diagnosis:** Demo de validación contextual por subcomando (ingest exige path; normalize no). Clara. Falta preamble de “fail-closed al arranque” y retrospective hacia gitignore/validate/harden.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  No todos los subcomandos necesitan las mismas claves de config. Observa `validate`: `normalize` pasa vacío; `ingest` aborta con mensaje exacto si falta `input_path`; con el path sintético, `ingest ok`. Predice el texto `abort config: falta …` antes de mirar la salida. Sin secretos ni PII real.
- **Proposed instruction/description improvements:**  
  Ampliar `why`: validar al arranque con mensaje accionable evita fallos a mitad de un batch; no exijas tokens de APIs remotas en un ETL local.
- **Proposed retrospective:**  
  Fail-closed y contextual: solo lo que el comando necesita. We Do: qué va a `.gitignore`, validar claves y endurecer defaults inseguros.
- **Code/output changes:** none

---

### S10-T4-B-E1 (weDo, guided)
- **Diagnosis:** Distinción `.env` vs `.env.example` es el misconception clave; starter demasiado permisivo (solo `.env`). Instruction lista el éxito; falta el “por qué el template se commitea”.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Qué secretos van al `.gitignore`
- **Proposed preamble:**  
  - **Contexto:** el repo del paquete no debe llevar tokens; el equipo sí necesita un template vacío.  
  - **Meta:** filtrar candidatos: ignorar secretos reales, **no** `.env.example` ni README.  
  - **Éxito:** cuatro líneas `ignore: …` del contrato (sin example ni README).  
  - **Límites:** no marques todo como secreto; no ignores el template `.example`.
- **Proposed instruction/description improvements:**  
  1. Define el conjunto de patrones/secretos a ignorar.  
  2. Excluye explícitamente `.env.example` y `README.md`.  
  3. Imprime solo los que deben ignorarse.  
  4. Quita `ok`.
- **Proposed feedback improvement:**  
  `.env.example` documenta variables sin valores secretos; si lo ignoras, el onboarding pierde el mapa. `.env`, PEM y `credentials.json` sí son basura peligrosa en git.
- **Proposed retrospective:**  
  Secretos fuera del repo es parte de la rúbrica del You Do (20% privacidad). El template se versiona; el valor real no. E2: validar config con mensajes de clave faltante.
- **Code/output changes:** none

---

### S10-T4-B-E2 (weDo, independent)
- **Diagnosis:** Validación de `log_level` + `data_dir`; starter solo revisa log_level. Instruction mínima. Feedback nombra `passed_bad` (buen ancla al defect de “no lanzar”).
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Validar claves de config al arranque
- **Proposed preamble:**  
  - **Contexto:** un CLI que arranca sin `data_dir` falla tarde y con stacktrace confuso.  
  - **Meta:** exigir claves con `RuntimeError` que nombre la clave.  
  - **Éxito:** `ok` y luego `config: falta clave requerida 'data_dir'`.  
  - **Límites:** no imprimas `passed_bad`; captura el error del segundo caso.
- **Proposed instruction/description improvements:**  
  1. Exige `log_level` y `data_dir` en un bucle o checks.  
  2. Mantén el mensaje con nombre de clave.  
  3. Prueba el caso feliz y el incompleto del starter.  
  4. Quita prints extra.
- **Proposed retrospective:**  
  Mensajes con nombre de clave son documentación ejecutable para el operador. El mismo espíritu que `config: falta input_path para ingest` de la demo. E3: endurecer defaults inseguros (DEBUG, tokens).
- **Code/output changes:** none

---

### S10-T4-B-E3 (weDo, transfer)
- **Diagnosis:** Transferencia a hardening de defaults (DEBUG→INFO, echo_sql, api_token). Starter es no-op. Instruction clara con éxito por clave. Falta anclar “defaults seguros del paquete, no del secreto del usuario”.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Endurecer defaults inseguros
- **Proposed preamble:**  
  - **Contexto:** un default con token hardcodeado o DEBUG ruidoso es un pie de mina en el primer install.  
  - **Meta:** transformar un dict inseguro en defaults seguros sin mutar a ciegas el original más de lo necesario.  
  - **Éxito:** tres líneas `clave: old -> new` del contrato.  
  - **Límites:** no dejes el token truthy; no hardcodees el dict final sin aplicar reglas.
- **Proposed instruction/description improvements:**  
  1. Copia `cfg` y aplica reglas por clave.  
  2. DEBUG→INFO, echo_sql True→False, api_token truthy→None.  
  3. Imprime old → new recorriendo las claves del inseguro.  
  4. Quita `ok`.
- **Proposed retrospective:**  
  Defaults seguros + validación al uso del token (si un adaptador remoto lo necesita) es el cierre de T4. En el You Do unes layout, CLI, precedencia y secretos en el paquete instalable del gate.
- **Code/output changes:** none

---

### S10-YOU-DO (youDo)
- **Diagnosis:** Proyecto fuerte: bootstrap crea paquete real, tests unittest, subcomandos, merge/validate, README de precedencia y exit codes. `context` / `objectives` / `requirements` / `rubric` / `portfolioNote` están bien. **Falta `retrospective`** de defensa (invariantes, PII/secretos, impacto medible). El learner puede “crear archivos” sin articlar qué demuestra el gate CP-N1-B/C.
- **Checklist:** context pass · goal pass · success partial (rúbrica existe; no hay cierre metacognitivo) · constraints pass (sin secretos, sintéticos) · retrospective fail
- **Severity:** P1
- **Proposed title:** (ya existe) Paquete familiarity_core + CLI profesional
- **Proposed preamble:** N/A como campo We Do; el `context` actual es suficiente como marco de proyecto. Opcional (Fixer): 1–2 frases al final del context anclando “defensa de 30s” — preferible meter eso en retrospective.
- **Proposed instruction/description improvements:**  
  Ningún cambio mayor a requirements. Opcional: hacer explícito en objectives “poder demostrar exit 2 con argv inválido y exit 0 con normalize sintético”.
- **Proposed retrospective:**  
  Antes de marcar listo: (1) ¿qué invariante demuestras con `unittest` o un print de verificación (reconcile_ok, exit codes, import sin side-effects)? (2) ¿dónde viven secretos y PII en tu diseño vs. datos sintéticos del lab? (3) En el README, una frase de impacto medible (p. ej. “install editable + un comando reemplaza el notebook suelto”) que puedas defender en 30 segundos ante el gate CP-N1-B/C.
- **Code/output changes:** none (bootstrap y tests se ven coherentes con el gate; no tocar en round de prosa)
- **Validation notes:** Starter bootstrap is large but pedagogically on-mission; retrospective is the only systematic gap.

---

## Priority order

### P0 (We Do — missing preamble + title + retrospective; instruction often drill-shaped)
1. **S10-T1-A-E1** — API `clean` / `__all__` (base del hábito de módulo público)
2. **S10-T1-A-E2** — util compartido anti-ciclo
3. **S10-T1-A-E3** — estilos de import por kind
4. **S10-T1-B-E1** — public vs private names
5. **S10-T1-B-E2** — fachada normalize/compare
6. **S10-T1-B-E3** — breaking + major
7. **S10-T2-A-E1** — metadata pyproject
8. **S10-T2-A-E2** — layout src list
9. **S10-T2-A-E3** — diagnose ModuleNotFound
10. **S10-T2-B-E1** — SemVer classify+bump (doble defecto rico)
11. **S10-T2-B-E2** — runtime vs dev deps
12. **S10-T2-B-E3** — policy hacia S11
13. **S10-T3-A-E1** — subcomando report (instruction hoy demasiado corta para E1)
14. **S10-T3-A-E2** — exit codes 0/1/2 (crítico para gate/CI)
15. **S10-T3-A-E3** — help alineada
16. **S10-T3-B-E1** — stdout vs stderr
17. **S10-T3-B-E2** — stdin `-` vs path
18. **S10-T3-B-E3** — JSON limpio (y alinear harness starter con `stderr_only` al fijar)
19. **S10-T4-A-E1** — traza de precedencia
20. **S10-T4-A-E2** — merge multi-clave
21. **S10-T4-A-E3** — flag vs env con razón
22. **S10-T4-B-E1** — gitignore secrets vs `.env.example`
23. **S10-T4-B-E2** — validate_config
24. **S10-T4-B-E3** — harden defaults

### P1
- **All 8 iDo demos** — add `preamble` + `retrospective`; optionally enrich short `why`/`description`
- **S10-YOU-DO** — add `retrospective` de defensa del gate

### P2
- Expand one-line `feedback` on high-stakes units (T1-A-E1, T2-B-E1, T3-A-E2, T3-B-E3, T4-A-E1, T4-B-E1) to 25–60 words with reasoning
- Minor harness consistency: E1-B-E2 starter case vs solution case; T3-B-E2 path name; T3-B-E3 starter missing `stderr_only` print path (only if verification compares against solution output)
- Deduplicate near-identical `hint` / `hints[0]` where redundant after instruction rewrite

---

## Residual risks

1. **Nombre de plataforma `sklearn`:** confunde si alguien busca scikit-learn; el contenido es packaging — el Fixer no debe “arreglar” el id (routing legacy), pero la prosa learner-facing ya habla de `familiarity_core` (bien).
2. **Simulación de packaging en un solo archivo:** varios ejercicios *hablan* de layout/install sin un filesystem real; la prosa debe dejar claro que son contratos/listas/diagnósticos, no un `pip` real dentro del playground (el You Do sí materializa el paquete).
3. **E1 de argparse (T3-A-E1)** es el más frágil para newbies: si solo se pega preamble sin steps, el hint carga todo el andamiaje.
4. **Normalización lower vs casefold** inconsistente entre T1-B-E1 (lower) y el resto (casefold): no es bug de output, pero el Fixer no debe “unificar” sin re-ejecutar y diff de salidas.
5. **You Do bootstrap muy largo:** la retrospective debe anclar defensa, no añadir más requisitos de código.
6. **Anti-aberration en el Fix:** cada unidad debe recibir prosa propia; no copiar preambles entre subtemas con solo un nombre cambiado.

---

## Counts summary for Fixer

| Kind | Units | preamble | retrospective | title (weDo) |
|------|------:|:--------:|:-------------:|:------------:|
| iDo | 8 | 0 → add 8 | 0 → add 8 | N/A |
| weDo | 24 | 0 → add 24 | 0 → add 24 | 0 → add 24 |
| youDo | 1 | N/A (context OK) | 0 → add 1 | exists |

**Code/output policy:** preserve exact solution outputs unless an execute-and-diff justifies a harness alignment (documented above as optional P2). Do not invent new exercises.

---

Section 10 exercise pedagogy review complete. Ready for the Fixer prompt.
