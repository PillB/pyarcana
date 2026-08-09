# S01 Exercise Pedagogy Report (Round 1)

## Section
- **title:** Entorno reproducible y trabajo seguro
- **id:** `setup`
- **source file:** `src/lib/course/sections/s01-setup.ts`
- **counts:** iDo 8, weDo 24, youDo 1
- **live:** https://pillb.github.io/pyarcana/

## Method
- Read `PEDAGOGY_EXERCISE_SPEC.md` (fields, lengths, preamble/retrospective checklists, E1→E2→E3 fade, report template)
- Manually inspected every `iDo.steps[]`, `weDo.steps[]`, and `youDo` in the canonical source
- Cross-checked theory hooks (CASO-LIM-001, CP-N1-A, subtopics S01-T1…T4) only to ground context — not to bulk-copy prose
- No bulk generation, no templates, no copy-paste across sections; every proposed block was written for this section’s skill
- Source files were **not** edited in this round

## Global findings (section-level)

| Gap | Evidence | Impact |
|-----|----------|--------|
| Zero `preamble` / `retrospective` on all exercise units | Grep of section source: no such keys under `iDo` / `weDo` / `youDo` | Newbie cannot answer what / why / success / what sticks |
| Zero We Do `title` fields | Instructions start with “E1 (guiado) — …” inline | UI header is weak; scanability suffers |
| Instruction often doubles as essay | Many steps pack goal + constraints into one long sentence | Violates “instruction = ordered task steps only” |
| Feedback exists but is thin | 1 sentence, transfer-only, rarely names the misconception | Weak deliberate-practice loop |
| Starter comments partially compensate | `# Éxito: …` in many starters | Helps power users; does **not** replace formal preamble for true newbies |
| E1→E2→E3 fade is structurally good | guided → independent → transfer per subtopic | Keep the design; wrap pedagogy fields around it |
| You Do frame is strong | context, objectives, requirements, rubric present | Only missing metacognitive close |

**Section severity theme:** systemic **P0** for missing preamble + retrospective on every unit; content quality of tasks is often **already solid**, so Fixer work is mostly additive fields + instruction cleanup, not rewriting learning goals.

---

## Unit ledger

### S01-T1-A-DEMO (iDo)
- **Diagnosis:** Strong `why` on interpreter/REPL/`python -m pip`, but no pre-code scenario (what to watch) and no after-demo close. A true newbie sees a wall of bash without being told “no escribas aún; observa la cadena version → REPL → pip atado”. Easy to confuse REPL session with a script file later.
- **Checklist:** context fail · goal fail · success fail · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** N/A (iDo uses `description`)
- **Proposed preamble:** Antes de crear un `venv` o instalar paquetes, el analista del día 1 verifica **qué intérprete responde** en la laptop. En esta demo verás el hilo completo: `python3 --version`, una sesión REPL mínima (`2+2`, `type`, `sys.version`) y `python3 -m pip --version` atado al mismo binario. No escribas archivos todavía: sigue el orden de los comandos y la salida. Si en tu máquina solo funciona `python` o `py`, anótalo; el principio es el mismo. Caso de laboratorio: `CASO-LIM-001`.
- **Proposed instruction/description improvements:** Mantener description. Opcional: añadir al final de `description` “— observar, no crear .py aún”.
- **Proposed retrospective:** Si puedes decir en voz alta qué intérprete usaste y por qué `python -m pip` evita el pip huérfano, ya tienes el hábito de inducción. El error clásico es instalar con un `pip` y ejecutar con otro `python`. En We Do completarás el transcript REPL y escribirás tu primer script con entrypoint.
- **Code/output changes:** none
- **Validation notes:** Preserve sample versions as illustrative (3.12.x); document 3.10+ aceptable already in theory.

### S01-T1-B-DEMO (iDo)
- **Diagnosis:** Demo teaches exit 0/1 and `pwd`, but without preamble the learner may treat `echo $?` as trivia. `why` mentions cwd vs PATH and project folder creation — good, but buried after the code. No bridge to `check_arg.py` / CI.
- **Checklist:** context fail · goal fail · success fail · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** N/A
- **Proposed preamble:** Cuando un job de datos “falla”, el primer dato útil suele ser un **entero**, no el color del mensaje. Observa en la terminal: (1) dónde estás (`pwd` / `Get-Location`), (2) un proceso que sale con `0`, (3) uno que sale con `1` y cómo se lee con `$?` o `$LASTEXITCODE`. No instales paquetes aquí. En PowerShell no confíes en `$?` (es booleano): usa `$LASTEXITCODE`.
- **Proposed instruction/description improvements:** Keep description; ensure demo output block remains the success anchor for observers.
- **Proposed retrospective:** El contrato 0 / no-cero es el mismo en CI y en scripts de intake. El malentendido típico es creer que “no hubo traceback” = éxito. En We Do documentarás ambos códigos y luego escribirás un script que elige 0 o 1 según `sys.argv`.
- **Code/output changes:** none
- **Validation notes:** Mention Windows PowerShell variant already in code comments — keep.

### S01-T2-A-DEMO (iDo)
- **Diagnosis:** Clear create/activate/`sys.prefix` demo; missing “watch the prompt `(.venv)` and the path ending in `.venv`”. No retrospective on deactivate / never install global.
- **Checklist:** context fail · goal fail · success fail · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** N/A
- **Proposed preamble:** Un proyecto de equipo necesita **una caja hermética de dependencias**. En esta demo creo `.venv` con el mismo intérprete que acabas de verificar, lo activo y compruebo que `sys.prefix` termina en esa carpeta. Observa la diferencia entre la ruta del entorno y la carpeta del repo. En Windows usa `Activate.ps1` (comentado en el bloque). No subas `.venv` a Git; no es el objetivo de esta demo.
- **Proposed instruction/description improvements:** Description is fine.
- **Proposed retrospective:** Si `sys.prefix` no termina en `.venv`, no estás en el entorno del proyecto — da igual lo que diga el prompt mental. El error clásico: `pip install` sin activar. En We Do crearás, desactivarás y, en E2, recrearás un entorno “roto” sin tocar el código fuente.
- **Code/output changes:** none
- **Validation notes:** Canonical folder name `.venv` already consistent with theory.

### S01-T2-B-DEMO (iDo)
- **Diagnosis:** Good freeze / pin / import chain; newbie may not know **why** freeze lists more than `requests` (transitive). No explicit success criterion spoken before commands.
- **Checklist:** context fail · goal fail · success fail · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** N/A
- **Proposed preamble:** Con el `.venv` activado, el contrato reproducible del equipo es un **`requirements.txt` pinneado**. Mira el flujo: `python -m pip install requests==2.32.3` → `freeze > requirements.txt` → verificar la línea pinneada e `import requests`. Observa que usamos siempre `python -m pip` (mismo intérprete). La stdlib no entra en requirements. No uses el Python global.
- **Proposed instruction/description improvements:** Description OK.
- **Proposed retrospective:** Freeze captura *lo que hay hoy* en *tu* venv, incluidas dependencias transitivas; no es un lockfile con hashes. El malentendido: copiar `site-packages` a mano entre laptops. En We Do harás freeze, luego `install -r` en un entorno limpio y un forense de `ModuleNotFoundError`.
- **Code/output changes:** none (keep `requests==2.32.3` unless execute-and-diff later requires bump)

### S01-T3-A-DEMO (iDo)
- **Diagnosis:** Models Conventional Commits + `git show`; preamble missing “what a good message looks like before you type”. Retrospective missing “diff reading = PR skill”.
- **Checklist:** context fail · goal fail · success fail · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** N/A
- **Proposed preamble:** Git no es “guardar en la nube”: es un **historial legible**. En esta demo inicializo un repo, hago dos commits con prefijos `docs:`, miro `git log --oneline` y leo `git show HEAD --stat`. Fíjate en el mensaje en imperativo y en qué archivo cambió. No hagas force-push ni subas secretos. El objetivo es ver un historial que un colega entienda en diez segundos.
- **Proposed instruction/description improvements:** Description OK.
- **Proposed retrospective:** Un prefijo `docs:` / `feat:` convierte el log en documentación ejecutable. El error clásico es “wip” o “cambios”. En We Do harás tu primer commit limpio, narrarás un diff y elegirás el mejor mensaje entre candidatos malos.
- **Code/output changes:** none

### S01-T3-B-DEMO (iDo)
- **Diagnosis:** Branch + push + PR plan is professional, but for learners without remote the demo can feel unfinished. Needs preamble: local branch first, remote optional; explicit ban on force-push as success constraint.
- **Checklist:** context fail · goal fail · success fail · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** N/A
- **Proposed preamble:** En equipo no trabajas solo en `main`: creas una **rama de feature**, commiteas ahí y abres un **Pull Request** para revisar el diff. Observa el flujo `git switch -c feat/hello-env` y el `push -u` (si tienes remoto). Si aún no hay `origin`, el hábito vale igual en local. **Prohibido** en este curso: `git push --force` a `main`. La recuperación segura (restore/stash) se comenta, no se reescribe historial compartido.
- **Proposed instruction/description improvements:** Soften description if needed to “flujo local + plan de PR (remoto opcional)”.
- **Proposed retrospective:** Rama + PR es el circuito de confianza del equipo. El malentendido: “force-push arregla un push rechazado”. En We Do crearás `feat/practica-s01`, redactarás un cuerpo de PR y escribirás el procedimiento con `git restore` / `stash`.
- **Code/output changes:** none

### S01-T4-A-DEMO (iDo)
- **Diagnosis:** Excellent worked example (F401 → fix → green), but no “what to watch” before the wall of comments. Newbie may think Ruff is only a VS Code extension.
- **Checklist:** context fail · goal fail · success fail · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** N/A
- **Proposed preamble:** Antes del code review humano, el repo puede atrapar basura barata con **Ruff**. En esta demo instalo el CLI en el venv, corro `python -m ruff check` sobre un archivo con `import sys` sin usar (código **F401**), borro el import y re-corro hasta “All checks passed!”. Observa el ciclo hallazgo → corrección → exit 0. La config vive en `pyproject.toml` (`E`, `F`, `I`), no solo en el editor.
- **Proposed instruction/description improvements:** Description OK.
- **Proposed retrospective:** El mismo `ruff check` lo correrá CI en el PR. El error clásico es silenciar con `noqa` el día 1 en lugar de borrar el import muerto. En We Do escribirás la config mínima, limpiarás un script y argumentarás por qué no `select = ["ALL"]` el primer día.
- **Code/output changes:** none

### S01-T4-B-DEMO (iDo)
- **Diagnosis:** Hygiene demo (ignore, env example, README) is critical for CP-N1-A but under-explained before code. Success (`check-ignore` on `.env`) is only in output.
- **Checklist:** context fail · goal fail · success fail · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** N/A
- **Proposed preamble:** Un clon limpio no adivina secretos ni descarga 200 MB de `site-packages`. Observa el paquete mínimo: `.gitignore` (`.venv/`, `venv/`, `.env`…), `.env.example` **sin secretos**, y README de install. Verifica con `git check-ignore -v .env` que el secreto real no se trackea. Datos y PII reales no entran al repo; el esqueleto CP-N1-A usará CSV sintético.
- **Proposed instruction/description improvements:** Description OK.
- **Proposed retrospective:** Ignore + example + README cierran el circuito “un colega clona y arranca”. El malentendido: “agregar al `.gitignore` saca el archivo del historial” (hace falta `git rm --cached` si ya estaba versionado). En We Do completarás ignore, `.env.example` y el checklist de máquina limpia del capstone.
- **Code/output changes:** none

---

### S01-T1-A-E1 (weDo · guided)
- **Diagnosis:** Solid REPL fill-in with checklist in `tests`, but no formal preamble (context/goal/success/constraints). Instruction is one long sentence mixing meta (“simula…”) with task. No title. Feedback good on REPL vs file; no retrospective. Starter already has success comments — elevate them.
- **Checklist:** context fail · goal fail · success partial (in tests/starter) · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Completar transcript REPL (suma, type, sys)
- **Proposed preamble:**
  - **Contexto:** en inducción te piden “ábrelo en el intérprete” antes de tocar el repo.
  - **Meta:** practicar una sesión REPL mínima (evaluar, inspeccionar tipo, leer versión) y salir bien.
  - **Éxito:** diálogo completo: `2+2 → 4`; `type("…")` es `str`; `sys.version.split()[0]` tipo `3.x.y`; `quit()` vuelve a la shell.
  - **Límites:** no crees un `.py`; no cierres la ventana de la terminal al salir del REPL; usa `python3` si `python` no responde.
- **Proposed instruction/description improvements:**
  1. Abre el REPL con el mismo comando que usaste en el I Do.
  2. Completa los `____` del transcript (suma, `type`, `import sys`, versión corta, salida).
  3. Reproduce la sesión en tu terminal real.
  4. Verifica el checklist del ejercicio (no solo rellenar el archivo-guía).
- **Proposed retrospective:** El REPL es laboratorio de bolsillo; el script es lo que versionas. El malentendido: creer que `quit()` cierra la laptop o la shell. Pregunta de auto-chequeo: ¿qué comando te devuelve al prompt `$`/`PS>` sin matar la terminal? Siguiente: un `.py` con entrypoint.
- **Code/output changes:** none
- **Validation notes:** Keep non-executable transcript nature explicit.

### S01-T1-A-E2 (weDo · independent)
- **Diagnosis:** Good jump to script + `if __name__`; success criteria live in tests. Instruction still essay-like. Missing title/preamble/retro. Fade from E1 is appropriate (less breadcrumbs, still names entrypoint).
- **Checklist:** context fail · goal fail · success partial · constraints partial · retrospective fail
- **Severity:** P1
- **Proposed title:** Script `hello_sys.py` con entrypoint
- **Proposed preamble:**
  - **Contexto:** el smoke del entorno en equipos se entrega como archivo, no como chat del REPL.
  - **Meta:** escribir un script que imprima nombre sintético y versión de Python con `sys`.
  - **Éxito:** `python hello_sys.py` → exit 0; stdout con nombre y `Python 3.x…`; usa `if __name__ == "__main__":`.
  - **Límites:** no PII real; no `pip install`; no entregar solo líneas pegadas en el REPL.
- **Proposed instruction/description improvements:**
  1. Completa los `____` en `main` (nombre sintético, `sys.version`).
  2. Completa el guardián `if __name__ == "__main__":` llamando a `main()`.
  3. Ejecuta `python hello_sys.py` (o `python3`) y confirma exit 0.
- **Proposed retrospective:** El entrypoint deja claro qué corre en producción vs import. El malentendido: “si imprime en el REPL, ya entregué”. Auto-chequeo: ¿qué línea evita que `main()` corra al importar el módulo? Transfer: mismo patrón en `scripts/hello_env.py` del You Do.
- **Code/output changes:** none (synthetic name “Maria Quispe” is fine PE-friendly)

### S01-T1-A-E3 (weDo · transfer)
- **Diagnosis:** Strong diagnostic transfer (Windows PATH vs macOS `python3`). Instruction is long but on-mission. Needs preamble framing “procedimiento revisable, no ensayo libre” and retrospective on “qué python responde”.
- **Checklist:** context fail · goal fail · success partial (rúbrica) · constraints partial · retrospective fail
- **Severity:** P1
- **Proposed title:** Diagnosticar intérprete ausente (Win/Unix)
- **Proposed preamble:**
  - **Contexto:** un compañero de inducción no puede correr `python --version` y te escribe por chat.
  - **Meta:** dejar un procedimiento de 4–6 pasos verificable (fuente oficial + OS).
  - **Éxito:** rúbrica del ejercicio: fuente oficial; verifica `--version`; distingue Windows vs Unix; 4–6 pasos claros; sin hacks inseguros.
  - **Límites:** solo python.org / instaladores oficiales; no “desactivar seguridad del SO”; no force-push ni trucos de admin innecesarios.
- **Proposed instruction/description improvements:**
  1. Lee los casos A (Windows) y B (macOS/Linux) del starter.
  2. Completa los pasos numerados y la verificación final.
  3. Entrega el markdown; no hace falta instalar por el revisor si documentas comandos y resultado esperado.
- **Proposed retrospective:** Diagnosticar “qué binario responde” antes de culpar a pandas ahorra horas. El malentendido: instalar un segundo Python sin anotar cuál está en el PATH. Auto-chequeo: tras cambiar PATH, ¿qué haces con la terminal abierta? Transfer: mismo reflejo con `venv` y con CI.
- **Code/output changes:** none

### S01-T1-B-E1 (weDo · guided)
- **Diagnosis:** Exit-code lab is concrete; success in tests. Instruction buries PowerShell constraint. Bare-ish terminal fill-in without formal preamble — high newbie risk on `$?` vs `$LASTEXITCODE`.
- **Checklist:** context fail · goal fail · success partial · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Documentar exit 0 y exit 1 en tu shell
- **Proposed preamble:**
  - **Contexto:** CI y cron leen un entero al terminar tu script, no el emoji del log.
  - **Meta:** ejecutar salidas controladas `0` y `1` y **leer** el código en tu shell.
  - **Éxito:** documentas `codigo_ok=0` y `codigo_fail=1` (o equivalentes) y nombras la shell (bash/zsh/PowerShell).
  - **Límites:** sin rutas de usuario reales ni secretos; en PowerShell usa `$LASTEXITCODE`, no `$?`.
- **Proposed instruction/description improvements:**
  1. Completa los `sys.exit(____)` del lab (0 luego 1).
  2. Tras cada comando, imprime el código de salida de tu shell.
  3. Anota `SHELL_USADA=…`.
  4. Guarda el transcript sin PII.
- **Proposed retrospective:** Mensaje en pantalla y exit code son canales distintos. El malentendido: “imprimió ok, entonces exit 0”. Auto-chequeo: ¿qué variable lees en PowerShell? Siguiente: un script que elige 0/1 según argumentos.
- **Code/output changes:** none

### S01-T1-B-E2 (weDo · independent)
- **Diagnosis:** Best-in-section script contract (`OK:<arg>`, stderr, argc). Needs title/preamble/retro; instruction already close to task-only if shortened. Fade correct.
- **Checklist:** context fail · goal fail · success partial · constraints partial · retrospective fail
- **Severity:** P1
- **Proposed title:** `check_arg.py`: un arg → 0; si no → 1
- **Proposed preamble:**
  - **Contexto:** los jobs de intake fallan con código no cero cuando faltan argumentos.
  - **Meta:** implementar el contrato argc con `sys.argv` y `sys.exit`.
  - **Éxito:** `python check_arg.py hola` → exit 0 y `OK:hola`; sin args o con dos → exit 1 y uso en **stderr**.
  - **Límites:** no ignores args extra; no imprimas el uso solo en stdout.
- **Proposed instruction/description improvements:**
  1. Completa `len(args)`, `sys.stderr` y los `sys.exit`.
  2. Prueba: un arg, cero args, dos args.
  3. Confirma códigos con `echo $?` / `$LASTEXITCODE`.
- **Proposed retrospective:** Entrypoint predecible es la base de validadores y cron. El malentendido: tomar solo el primer arg y silenciar el resto. Auto-chequeo: ¿dónde debe ir el mensaje de uso? Transfer: S02–S04 reutilizan el patrón al validar registros.
- **Code/output changes:** none

### S01-T1-B-E3 (weDo · transfer)
- **Diagnosis:** Excellent classification PATH vs wrong interpreter. Missing formal preamble bullets and retrospective. Instruction is dense — split into task steps.
- **Checklist:** context fail · goal fail · success partial · constraints partial · retrospective fail
- **Severity:** P1
- **Proposed title:** Clasificar fallo de pip: PATH vs intérprete
- **Proposed preamble:**
  - **Contexto:** ticket de inducción: “pip install pandas no me funciona”.
  - **Meta:** separar “la shell no encuentra `pip`” de “instalé en otro Python”.
  - **Éxito:** clasificas A y B; 3 pasos por escenario; priorizas `python -m pip` y `sys.executable`; sin reinstalls de SO innecesarios.
  - **Límites:** sin secretos; no culpes a pandas hasta verificar el intérprete.
- **Proposed instruction/description improvements:**
  1. Clasifica escenario A y B en el markdown.
  2. Escribe 3 pasos de verificación por escenario.
  3. Completa el “comando preferido del curso”.
- **Proposed retrospective:** El 80 % de tickets de setup son PATH o wrong interpreter. El malentendido: “si `pip` corrió, el import tiene que funcionar”. Auto-chequeo: ¿qué imprimes con `sys.executable`? Transfer: checklist del día 1 del You Do.
- **Code/output changes:** none

### S01-T2-A-E1 (weDo · guided)
- **Diagnosis:** Classic create/activate/deactivate drill; success in tests. Without preamble, Windows PowerShell policy trap is only in edgeCases (invisible to many UIs). Severity high for bare terminal feel.
- **Checklist:** context fail · goal fail · success partial · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Crear, activar y desactivar `.venv`
- **Proposed preamble:**
  - **Contexto:** un proyecto = un entorno aislado; no mezcles dependencias en el Python del sistema.
  - **Meta:** crear `.venv`, activarlo y probar que `sys.prefix` apunta a esa carpeta; luego `deactivate`.
  - **Éxito:** carpeta `.venv` existe; tras activate, `sys.prefix` contiene `.venv`; tras deactivate, sales del entorno del proyecto.
  - **Límites:** no instales paquetes aún; no uses el Python global a propósito; en PowerShell, si `Activate.ps1` falla por política, documenta `RemoteSigned` (CurrentUser) o `activate.bat`.
- **Proposed instruction/description improvements:**
  1. Entra a la carpeta de práctica del starter.
  2. Completa create / activate / print `sys.prefix` / deactivate.
  3. Marca el checklist del ejercicio.
- **Proposed retrospective:** Activar no es ceremonia: sin activar, `pip` cae en el global. El malentendido: confundir la carpeta del repo con el PATH. Auto-chequeo: ¿qué string debe terminar `sys.prefix`? Siguiente: recrear un entorno roto.
- **Code/output changes:** none

### S01-T2-A-E2 (weDo · independent)
- **Diagnosis:** Professional recovery skill; instruction clear. Needs preamble that code lives *outside* `.venv`. Feedback already strong.
- **Checklist:** context fail · goal fail · success partial · constraints partial · retrospective fail
- **Severity:** P1
- **Proposed title:** Recrear un `.venv` roto sin tocar el código
- **Proposed preamble:**
  - **Contexto:** un `site-packages` corrupto se repara recreando el entorno, no “a mano”.
  - **Meta:** borrar/recrear `.venv` limpio preservando scripts del proyecto.
  - **Éxito:** activate funciona; `sys.prefix` es el nuevo `.venv`; los `.py` del proyecto siguen existiendo.
  - **Límites:** no uses conda ni reinstales el Python del sistema; no borres la raíz del proyecto.
- **Proposed instruction/description improvements:**
  1. `deactivate` si estás dentro del venv viejo.
  2. Elimina `.venv` y créalo de nuevo.
  3. Activa y verifica `sys.prefix`.
  4. Confirma que tu código fuente permanece.
- **Proposed retrospective:** “Borra el venv y reinstala desde requirements” es frase de equipo. El malentendido: editar archivos dentro de `site-packages`. Auto-chequeo: ¿dónde viven tus `.py` respecto a `.venv`? Transfer: T2-B cierra el freeze/`install -r`.
- **Code/output changes:** none

### S01-T2-A-E3 (weDo · transfer)
- **Diagnosis:** Argumentation task (why not global pip) fits transfer tier. Needs preamble with success rubric surface and anti-sudo constraint.
- **Checklist:** context fail · goal fail · success partial · constraints partial · retrospective fail
- **Severity:** P1
- **Proposed title:** Argumentar por qué no `pip` global
- **Proposed preamble:**
  - **Contexto:** un colega quiere `pip install pandas` en el Python global “para no perder tiempo”.
  - **Meta:** explicar el riesgo de versiones cruzadas y proponer el flujo `.venv`.
  - **Éxito:** conflicto de versiones A vs B; flujo create→activate→pip por proyecto; `venv` es stdlib; tono profesional; sin sudo ni install global.
  - **Límites:** sin afirmaciones salariales; conda/uv pueden mencionarse como opcionales, no como único camino.
- **Proposed instruction/description improvements:**
  1. Completa el escenario de conflicto (dos proyectos, dos versiones).
  2. Lista el flujo recomendado en 3 pasos.
  3. Anota que `venv` es stdlib y el nombre canónico `.venv`.
- **Proposed retrospective:** Aislar dependencias es decisión de inducción, no preferencia estética. El malentendido: “un solo Python global siempre es más simple”. Auto-chequeo: ¿qué pasa si A necesita pandas 1.x y B 2.x? Transfer: lo defenderás en el README del You Do.
- **Code/output changes:** none

### S01-T2-B-E1 (weDo · guided)
- **Diagnosis:** Pin + freeze drill; success clear in tests. Needs preamble “venv must be active before freeze” as constraint (currently only in hints).
- **Checklist:** context fail · goal fail · success partial · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Pin, freeze y verificar `requirements.txt`
- **Proposed preamble:**
  - **Contexto:** el snapshot pinneado es lo que un colega o CI reinstala el día 1.
  - **Meta:** instalar un tercero pinneado, generar freeze y comprobar la línea `paquete==versión`.
  - **Éxito:** existe `requirements.txt` con al menos `requests==…` (o el paquete que uses); sin secretos ni rutas absolutas de usuario.
  - **Límites:** solo con `.venv` activado; siempre `python -m pip` (no `pip` suelto); no freezes del Python global.
- **Proposed instruction/description improvements:**
  1. Activa el venv.
  2. Completa install pinneado y `freeze > requirements.txt`.
  3. Verifica con `grep` e `import`.
- **Proposed retrospective:** Freeze del entorno equivocado es peor que no tener freeze. El malentendido: “si listó muchos paquetes, está mal” (transitivas son normales). Auto-chequeo: ¿qué miras en `sys.prefix` antes de freeze? Siguiente: `install -r` en limpio.
- **Code/output changes:** none

### S01-T2-B-E2 (weDo · independent)
- **Diagnosis:** Clean-room install is the real team skill. Instruction good; elevate success to preamble; retrospective should stress “no copies site-packages”.
- **Checklist:** context fail · goal fail · success partial · constraints partial · retrospective fail
- **Severity:** P1
- **Proposed title:** Replicar deps con `install -r` en limpio
- **Proposed preamble:**
  - **Contexto:** un clon limpio no hereda tu carpeta `.venv`; hereda el archivo de contrato.
  - **Meta:** crear un segundo entorno e instalar solo desde `requirements.txt`.
  - **Éxito:** en el env limpio, import del paquete pinneado OK y versión alineada al archivo.
  - **Límites:** no copies `site-packages`; no verifiques en el venv viejo por error.
- **Proposed instruction/description improvements:**
  1. Crea `.venv_replica` (o recrea limpio).
  2. Activa e `install -r requirements.txt`.
  3. Confirma con import / `pip list`.
- **Proposed retrospective:** Si funciona en limpio, tu snapshot es útil para el equipo. El malentendido: “funciona en mi venv viejo, basta”. Auto-chequeo: ¿qué archivo es el contrato, no la carpeta? Transfer: paso 3 del checklist de máquina limpia del You Do.
- **Code/output changes:** none

### S01-T2-B-E3 (weDo · transfer)
- **Diagnosis:** ModuleNotFoundError forensics is high-value. Protocol structure exists; needs preamble + retrospective on stdlib vs terceros.
- **Checklist:** context fail · goal fail · success partial · constraints partial · retrospective fail
- **Severity:** P1
- **Proposed title:** Forense de `ModuleNotFoundError`
- **Proposed preamble:**
  - **Contexto:** `import requests` falla; a veces nunca se instaló, a veces se instaló en otro Python.
  - **Meta:** protocolo de 5 pasos con `sys.executable` y `python -m pip`.
  - **Éxito:** hipótesis A/B; 5 pasos; clasifica stdlib vs terceros; sin reinstalls de SO.
  - **Límites:** no trates `datetime`/`sys` como paquetes de pip; no subas secretos en el informe.
- **Proposed instruction/description improvements:**
  1. Completa hipótesis A y B.
  2. Rellena el protocolo de 5 pasos.
  3. Marca requests vs datetime (terceros vs stdlib).
- **Proposed retrospective:** Primero el intérprete, después el paquete. El malentendido: reinstalar el sistema operativo porque falló un import. Auto-chequeo: ¿`pip show` debe usarse con el mismo `python`? Transfer: cuando “pandas desaparece” al cambiar de terminal o de IDE.
- **Code/output changes:** none

### S01-T3-A-E1 (weDo · guided)
- **Diagnosis:** First commit lab; success regex in tests is excellent but invisible in preamble. Instruction is almost steps already.
- **Checklist:** context fail · goal fail · success partial · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Primer commit Conventional Commits
- **Proposed preamble:**
  - **Contexto:** el historial es la memoria del equipo; un mensaje vacío no sirve en review.
  - **Meta:** `git init`, un archivo, un commit con prefijo `docs:` o `feat:`.
  - **Éxito:** `git log -1` muestra un subject que cumple `feat|fix|docs|chore|refactor|test:` + descripción.
  - **Límites:** no “wip”, no mensaje vacío, no subas `.venv` ni secretos.
- **Proposed instruction/description improvements:**
  1. Inicializa el repo de práctica.
  2. Crea el README y haz `git add`.
  3. Commit con mensaje Conventional Commits.
  4. Verifica con `git log -1 --oneline`.
- **Proposed retrospective:** Un commit bien nombrado supera diez “cambios”. El malentendido: commitear sin `add`. Auto-chequeo: ¿el prefijo va en minúsculas con `:` y espacio? Siguiente: leer el diff del HEAD.
- **Code/output changes:** none

### S01-T3-A-E2 (weDo · independent)
- **Diagnosis:** Diff literacy task is well designed. Needs preamble that `git show` (not post-commit `git diff`) is the tool. Retrospective should nail “new file vs modified”.
- **Checklist:** context fail · goal fail · success partial · constraints partial · retrospective fail
- **Severity:** P1
- **Proposed title:** Leer `git show` y narrar el diff
- **Proposed preamble:**
  - **Contexto:** en un PR pasas más tiempo leyendo `+`/`−` que escribiendo código nuevo.
  - **Meta:** hacer un segundo commit y explicar qué muestra `git show HEAD`.
  - **Éxito:** markdown con las 3 respuestas; menciona líneas `+`/`−`; el commit existe en el log.
  - **Límites:** no mires solo `git diff` vacío post-commit; no entregues sin `git add`.
- **Proposed instruction/description improvements:**
  1. Modifica el README, stage y commit.
  2. Ejecuta `git show HEAD` (sin pager si hace falta).
  3. Responde las tres preguntas del starter.
- **Proposed retrospective:** Narrar el cambio en una frase es el cuerpo de un buen PR. El malentendido: `git diff` después del commit “no muestra nada, Git está roto”. Auto-chequeo: ¿archivo nuevo o modificado y cómo se ve? Transfer: review de colegas en T3-B.
- **Code/output changes:** none

### S01-T3-A-E3 (weDo · transfer)
- **Diagnosis:** Message-choice transfer is sharp (A/B/C). Needs title/preamble/retro; instruction can drop essay tone.
- **Checklist:** context fail · goal fail · success partial · constraints partial · retrospective fail
- **Severity:** P1
- **Proposed title:** Elegir el mejor mensaje de commit
- **Proposed preamble:**
  - **Contexto:** tres mensajes candidatos para el mismo cambio (`scripts/hello_env.py` smoke).
  - **Meta:** elegir el legible y reescribir los otros al estilo Conventional Commits.
  - **Éxito:** eliges **B**; justificación 3–5 oraciones; reescrituras con prefijos válidos.
  - **Límites:** no defiendas `wip` en `main`; evita prefijos inventados tipo `update:`.
- **Proposed instruction/description improvements:**
  1. Elige A, B o C y justifica.
  2. Reescribe A y C como si fueran commits útiles.
  3. Entrega el markdown.
- **Proposed retrospective:** El historial es documentación ejecutable. El malentendido: “wip es honesto, basta”. Auto-chequeo: ¿qué tipo y artefacto comunica B en una línea? Transfer: mensajes del You Do (≥3 Conventional Commits).
- **Code/output changes:** none

### S01-T3-B-E1 (weDo · guided)
- **Diagnosis:** Branch creation guided well; force-push ban only in nearby demos. Elevate “commit must live on feature branch” to success criteria.
- **Checklist:** context fail · goal fail · success partial · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Crear rama `feat/practica-s01` y commitear
- **Proposed preamble:**
  - **Contexto:** el trabajo en curso no se mezcla a ciegas con `main`.
  - **Meta:** crear `feat/practica-s01`, un commit `feat:` y listar ramas.
  - **Éxito:** la rama existe; HEAD en esa rama; `git log -1` con prefijo `feat:`.
  - **Límites:** no force-push; no nombres con espacios; remoto opcional (flujo local basta).
- **Proposed instruction/description improvements:**
  1. Parte de `main`.
  2. `git switch -c feat/practica-s01`.
  3. Añade archivo, commit `feat:…`, lista ramas.
- **Proposed retrospective:** Si el commit quedó en la feature branch, ya separas WIP de `main`. El malentendido: editar en `main` “y ya cambio de rama después”. Auto-chequeo: ¿qué muestra el `*` en `git branch`? Siguiente: redactar el PR.
- **Code/output changes:** none

### S01-T3-B-E2 (weDo · independent)
- **Diagnosis:** PR description writing is authentic. Strong tests. Needs preamble oriented to the *reviewer*, not the author ego.
- **Checklist:** context fail · goal fail · success partial · constraints partial · retrospective fail
- **Severity:** P1
- **Proposed title:** Redactar descripción de Pull Request
- **Proposed preamble:**
  - **Contexto:** el diff no cuenta solo el “por qué”; el cuerpo del PR lo hace.
  - **Meta:** título + resumen (3 bullets) + plan de prueba + checklist de seguridad para `hello_env` + README.
  - **Éxito:** archivo con esos bloques; pasos de prueba concretos; mención `.env`/secretos; sin PII.
  - **Límites:** no tokens reales; no “ver commits” vacío; remoto no obligatorio para la entrega del markdown.
- **Proposed instruction/description improvements:**
  1. Completa título al estilo Conventional Commits.
  2. Escribe 3 bullets de resumen orientados al revisor.
  3. Lista 3 comandos de prueba (venv, install -r, smoke).
  4. Cierra el checklist de seguridad.
- **Proposed retrospective:** Una buena descripción reduce ida y vuelta en review. El malentendido: el PR es solo el botón verde. Auto-chequeo: ¿un revisor puede copiar tu plan de prueba sin adivinar? Transfer: PR real del You Do.
- **Code/output changes:** none

### S01-T3-B-E3 (weDo · transfer)
- **Diagnosis:** Safe recovery vs force-push is culture-critical. Instruction already structured; formalize preamble constraints.
- **Checklist:** context fail · goal fail · success partial · constraints partial · retrospective fail
- **Severity:** P1
- **Proposed title:** Recuperar con `restore`/`stash` (sin force-push)
- **Proposed preamble:**
  - **Contexto:** editaste `README.md` sin commit y el cambio está mal; te proponen `reset --hard` o force-push a `main`.
  - **Meta:** procedimiento correcto no destructivo y por qué force-push a `main` no es opción.
  - **Éxito:** menciona `git restore`; `stash` como alternativa de guardado; prohíbe force-push a `main`; no pone `reset --hard` como default.
  - **Límites:** no reescribas historial compartido; distingue restore (working tree) de revert (commits hechos).
- **Proposed instruction/description improvements:**
  1. Completa el procedimiento con `restore` (y staged si aplica).
  2. Explica cuándo usar `stash`.
  3. Justifica el no a force-push y el no a hard como primer reflejo.
- **Proposed retrospective:** Quien no destruye historial ajeno genera confianza. El malentendido: “force-push arregla push rechazado en main”. Auto-chequeo: ¿qué comando descartaría un cambio local no commiteado sin borrar el repo? Transfer: política del equipo en el README del capstone.
- **Code/output changes:** none

### S01-T4-A-E1 (weDo · guided)
- **Diagnosis:** TOML fill-in is focused; easy to put values under wrong table. Needs preamble on “contrato del repo, no del IDE”.
- **Checklist:** context fail · goal fail · success partial · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Config mínima de Ruff en `pyproject.toml`
- **Proposed preamble:**
  - **Contexto:** el linter del equipo debe ser el mismo en tu laptop y en CI.
  - **Meta:** completar `[tool.ruff]` y `select = ["E","F","I"]`.
  - **Éxito:** archivo con `line-length = 88`, `target-version`, y select E/F/I.
  - **Límites:** no pongas la config bajo `[tool.black]`; `select` es lista, no string `"E,F,I"`; no `ALL` el día 1.
- **Proposed instruction/description improvements:**
  1. Completa `line-length` y `target-version`.
  2. Completa la lista `select`.
  3. Guarda en la raíz del proyecto de práctica.
- **Proposed retrospective:** Config en el repo convierte el gusto del IDE en contrato. El malentendido: copiar `select = ["ALL"]` de un blog. Auto-chequeo: ¿qué tres letras cubren errores baratos e imports? Siguiente: correr `ruff check` de verdad.
- **Code/output changes:** none

### S01-T4-A-E2 (weDo · independent)
- **Diagnosis:** Real fix loop (F401). Starter has dead imports — good defect. Needs preamble naming F401 without spoiling every line if possible; success = exit 0.
- **Checklist:** context fail · goal fail · success partial · constraints partial · retrospective fail
- **Severity:** P1
- **Proposed title:** Limpiar imports con `ruff check`
- **Proposed preamble:**
  - **Contexto:** CI fallará el PR por imports muertos antes de que un humano revise lógica.
  - **Meta:** instalar Ruff en el venv, chequear y corregir hasta exit 0.
  - **Éxito:** `python -m ruff check hello_lint.py` exit 0; el script sigue siendo Python válido y corre.
  - **Límites:** en S01 prefiere borrar imports sin usar; no abuses de `noqa`; no te limites a `format` sin arreglar F401.
- **Proposed instruction/description improvements:**
  1. Con venv activo, instala `ruff`.
  2. Corre `python -m ruff check hello_lint.py`.
  3. Elimina imports no usados y re-corre hasta verde.
- **Proposed retrospective:** El músculo check → fix es el de CI en rojo. El malentendido: “el editor no subrayó, entonces está bien” (el CLI es la fuente de verdad compartida). Auto-chequeo: ¿qué código Ruff es import sin usar? Transfer: `ruff check` limpio en `scripts/hello_env.py` del You Do.
- **Code/output changes:** none

### S01-T4-A-E3 (weDo · transfer)
- **Diagnosis:** Governance of `select` is advanced-good for S01 transfer. Needs preamble on signal vs noise.
- **Checklist:** context fail · goal fail · success partial · constraints partial · retrospective fail
- **Severity:** P1
- **Proposed title:** Defender `select` mínimo (no ALL día 1)
- **Proposed preamble:**
  - **Contexto:** un lead propone `select = ["ALL"]` el día 1 en un repo con notebooks.
  - **Meta:** justificar un set pequeño (E/F/I) y un plan de ampliación.
  - **Éxito:** propuesta acotada; argumento ruido vs señal; cuándo ampliar; tono profesional.
  - **Límites:** no desactives el linter por completo; no copies configs de web backends sin adaptar.
- **Proposed instruction/description improvements:**
  1. Propón el `select`.
  2. Explica por qué no ALL el día 1.
  3. Resume qué cubren E, F e I.
  4. Define cuándo ampliar con acuerdo de equipo.
- **Proposed retrospective:** Un linter respetado vale más que uno “perfecto” ignorado. El malentendido: más reglas = más calidad automática. Auto-chequeo: ¿qué pasa con la atención del equipo si CI grita 200 hallazgos el día 1? Transfer: política de calidad del esqueleto CP-N1-A.
- **Code/output changes:** none

### S01-T4-B-E1 (weDo · guided)
- **Diagnosis:** `.gitignore` fill-in is essential; both `.venv/` and `venv/` often missed. Make dual names a success constraint in preamble.
- **Checklist:** context fail · goal fail · success partial · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Completar `.gitignore` mínimo Python/data
- **Proposed preamble:**
  - **Contexto:** un push accidental de `.venv` o `.env` es el error de higiene más caro del día 1.
  - **Meta:** ignore de entornos, bytecode, secretos y checkpoints Jupyter.
  - **Éxito:** `git check-ignore -v .env` confirma ignore; también cubre `.venv/` **y** `venv/`.
  - **Límites:** si un archivo ya estaba versionado, el ignore solo no lo saca (`git rm --cached`).
- **Proposed instruction/description improvements:**
  1. Completa las entradas del starter.
  2. En un repo de prueba, crea `.env` dummy y corre `git check-ignore -v .env`.
  3. Confirma que ambos nombres de entorno están listados.
- **Proposed retrospective:** Ignore es higiene, no opcional. El malentendido: “con ignorar `.venv` basta; `venv` no se usa” (el ecosistema usa ambos). Auto-chequeo: ¿qué comando prueba el ignore de `.env`? Siguiente: `.env.example` sin secretos.
- **Code/output changes:** none

### S01-T4-B-E2 (weDo · independent)
- **Diagnosis:** `.env.example` practice is clear; strengthen “never real tokens” in preamble success/constraints.
- **Checklist:** context fail · goal fail · success partial · constraints partial · retrospective fail
- **Severity:** P1
- **Proposed title:** Crear `.env.example` sin secretos
- **Proposed preamble:**
  - **Contexto:** el example es el contrato de configuración; el secreto vive fuera del repo.
  - **Meta:** ≥3 claves de un intake sintético con valores vacíos o ficticios no sensibles.
  - **Éxito:** archivo trackeable con `KEY=`; sin patrones de secreto reales; `.env` real ignorado.
  - **Límites:** prohibido `sk-…`, passwords reales, connection strings con password; no subas `.env` “un momentito”.
- **Proposed instruction/description improvements:**
  1. Completa `API_URL`, `DB_HOST`, `LOG_LEVEL` (o equivalentes) con placeholders.
  2. Confirma que `.env` está en `.gitignore`.
  3. Revisa que no pegaste tokens de algún tutorial.
- **Proposed retrospective:** Example versionado + `.env` local es el patrón de inducción. El malentendido: poner el secreto en el README “para que funcione”. Auto-chequeo: ¿qué archivo se commitea y cuál no? Transfer: rúbrica Responsible use del You Do (20%).
- **Code/output changes:** none

### S01-T4-B-E3 (weDo · transfer)
- **Diagnosis:** Machine-clean checklist is the right bridge to You Do. Needs preamble that items must be *observable* (command + expected result).
- **Checklist:** context fail · goal fail · success partial · constraints partial · retrospective fail
- **Severity:** P1
- **Proposed title:** Checklist de máquina limpia CP-N1-A
- **Proposed preamble:**
  - **Contexto:** un revisor debe clonar y validar tu esqueleto en ~10 minutos.
  - **Meta:** 5 ítems verificables (clon → venv → install -r → smoke → ignore `.env`) + datos sintéticos/diccionario.
  - **Éxito:** ≥5 ítems con comando y resultado esperado; menciona diccionario y CSV sintético; sin secretos ni paths de tu usuario.
  - **Límites:** no asumas `/Users/tu_nombre`; no PII real en el dataset de ejemplo.
- **Proposed instruction/description improvements:**
  1. Escribe 5 checkboxes observables del flujo de arranque.
  2. Completa la sección de datos (CSV + diccionario).
  3. Revisa que un desconocido podría tildarlos en otra laptop.
- **Proposed retrospective:** Si el checklist pasa, el repo es profesional. El malentendido: criterios estéticos (“se ve ordenado”) en lugar de comandos. Auto-chequeo: ¿puedes copiar un ítem y ejecutarlo en una VM limpia? Transfer: es el listón del You Do y del gate de S04.
- **Code/output changes:** none

---

### youDo · Esqueleto CP-N1-A (youDo)
- **Diagnosis:** Strong project frame: context, objectives, requirements, rubric, portfolio note, starter structure. **Missing `retrospective`** only major pedagogy field gap. Context already answers much of the preamble checklist for a project; still worth a short “before you mark done” reflection (spec exemplar 8.3). Risk: learner ships smoke without defending reproducibility or responsible data use in their own words.
- **Checklist:** context pass · goal pass (objectives) · success pass (rubric/requirements) · constraints pass · retrospective **fail**
- **Severity:** P1
- **Proposed title:** (already present) Esqueleto CP-N1-A — Reproducible Client Intake Repo
- **Proposed preamble:** N/A as new field if `context` stays canonical; optional 4-bullet “Antes de empezar” only if schema wants symmetry — **prefer adding retrospective only** to avoid bloat.
- **Proposed instruction/description improvements:** None required for Round-1 pedagogy fields; optional clarification already in context that S01 does **not** build the full intake validator.
- **Proposed retrospective:** Antes de marcar listo: (1) ¿qué comando de tu README demuestra en una máquina limpia que el entorno es reproducible (`venv` + `install -r` + smoke)? (2) ¿qué harías distinto con datos reales de clientes vs. el CSV sintético (PII, `.env`)? (3) Escribe en el README una frase de impacto medible (p. ej. “clon → smoke en &lt;10 min”) que puedas defender en 30 segundos en inducción. El malentendido a evitar: creer que el validador de S04 “arregla” un repo sin ignore, sin freeze o con secretos.
- **Code/output changes:** none
- **Validation notes:** Rubric weights already align with section gates; keep exact structure paths.

---

## Priority order

### P0 (do first — true-newbie blockers)
1. **All 8 iDo demos** — add `preamble` + `retrospective` (keep `why` / `description` / code)
2. **We Do bare terminal / high-risk drills:**  
   `S01-T1-A-E1`, `S01-T1-B-E1`, `S01-T2-A-E1`, `S01-T2-B-E1`, `S01-T3-A-E1`, `S01-T3-B-E1`, `S01-T4-A-E1`, `S01-T4-B-E1`  
   — add `title` + `preamble` + task-only `instruction` + `retrospective`; keep starter/solution/tests
3. **Section-wide schema fill** for remaining We Do titles (even if content P1) so UI is consistent

### P1 (next — complete gradual-release shell)
- All remaining We Do E2/E3 units: `title`, `preamble`, tighten `instruction` to steps, `retrospective`; mildly enrich `feedback` only if &lt;25 words or transfer-only without misconception
- **You Do:** add `retrospective` (defense / reflection)
- Optional: promote key success criteria from `tests` into preamble **Éxito** without deleting `tests`

### P2 (polish)
- Align feedback length to 25–60 words with one named misconception where currently only celebratory
- Soften iDo descriptions that assume remote when local-only is valid (T3-B)
- Ensure every E3 mentions “new surface, same principle” implicitly (already mostly true — verify after fix)

---

## Residual risks
- **Volume:** 33 units × new fields is a large Fixer patch; risk of accidental solution leakage if preambles over-hint (especially E3). Prefer success criteria and constraints over line-level spoilers in E2/E3.
- **Platform variance:** Windows vs Unix appears in many units; preambles must keep dual paths without doubling instruction into essays.
- **Local vs remote Git:** learners without GitHub can still complete most T3 work; Fixer must not make remote mandatory in success criteria where source currently allows local-only.
- **Version drift:** pinned `requests==2.32.3` and sample Python `3.12.3` are pedagogical fixtures — do not “upgrade for fashion” unless execute-and-diff fails.
- **You Do / CP-N1-A scope creep:** retrospective must reinforce “skeleton only, no full validator in S01” so learners do not overbuild.
- **Anti-aberration:** Fixer must hand-apply prose from this report (or rewrite with equal care), not script generation from the ledger bullets.

## Fixer notes (non-binding)
- Prefer optional schema fields already named in the spec: iDo `preamble`/`retrospective`; We Do `title`/`preamble`/`instruction`/`retrospective`; You Do `retrospective`.
- Keep `instruction` task-only; move goal/success/constraints into `preamble`.
- Preserve starter `____` defects and solution outputs unless a pedagogical bug is proven by execution.
- Spanish: professional Peruvian register; tú form consistent with existing section voice; no real PII.

---

Section 1 exercise pedagogy review complete. Ready for the Fixer prompt.
