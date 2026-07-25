# S01 Exercise Pedagogy Report (Round 2)

## Section
- **title:** Entorno reproducible y trabajo seguro
- **id:** `setup`
- **source file:** `src/lib/course/sections/s01-setup.ts`
- **counts:** iDo 8, weDo 24, youDo 1
- **live:** https://pillb.github.io/pyarcana/

## Method
- Re-read `PEDAGOGY_EXERCISE_SPEC.md` (field roles, length targets, preamble/retrospective checklists, E1→E2→E3 fade, anti-aberration)
- Manually re-inspected **every** `iDo.steps[]`, `weDo.steps[]`, and `youDo` in the **current** source after Round-1 fixes
- Used Round-1 report only as historical context — **not** as acceptance proof
- Scored residual quality for a true newbie (what / why / success / what sticks), not mere field presence
- No bulk generation; no source edits in this round

## Round-1 fix verification (schema shell)

| Expectation after R1 | Status in current source |
|----------------------|--------------------------|
| All iDo have `preamble` + `retrospective` | **Met** (8/8) |
| All We Do have `title` + `preamble` + task-style `instruction` + `retrospective` | **Met** (24/24) |
| You Do has `retrospective` | **Met** |
| E1→E2→E3 fade preserved | **Met** (guided / independent / transfer per subtopic) |
| Tasks, starters, solutions, tests largely intact | **Met** |

**Verdict:** Round-1 closed the systemic P0 “missing pedagogy shell.” Round-2 finds **no new missing-field crisis**. Residual work is **quality**: spoilers, thin `why`/feedback, feedback↔retrospective duplication, a few length/clarity nits, and one description/code mismatch.

---

## Global residual findings

| Residual gap | Evidence | Impact | Severity |
|--------------|----------|--------|----------|
| Transfer spoiler | `S01-T3-A-E3` preamble **Éxito** says “eliges **B**” before the learner chooses | Nullifies judgment task; E3 becomes copy, not transfer | **P1** |
| Independent spoiler in starter comments | `S01-T4-A-E2` starter: “elimina imports sin usar (sys, os)” | E2 names the exact dead imports before `ruff check` | **P1** |
| Feedback ≈ retrospective | Many We Do units reuse the same misconception + transfer sentence in both fields | Weak deliberate-practice loop; retrospective loses metacognitive job | **P1** (section-wide polish; fix only the worst pairs) |
| Thin I Do `why` | T3-A ~30 w; T3-B ~23 w (spec target 40–90) | Newbie sees commands without enough technical “why this demo” | **P1** (T3-B); **P2** (T3-A, T2-B) |
| Short feedback | T3-A-E1 ~22 w; T3-A-E3 ~19 w; T4-A-E3 ~23 w (target 25–60) | Corrective loop too thin | **P2** |
| Description vs demo mismatch | T2-B-DEMO description mentions “reinstall -r”; code has no `install -r` | False success expectation | **P2** |
| Demo `why` scope creep | T1-B-DEMO `why` adds `mkdir` project folder not in the demo block; T4-B-DEMO `why` jumps to remote push | Cognitive load / order confusion | **P2** |
| You Do retrospective slightly long | ~87 words (target 40–80) | Minor bloat; content is strong | **P2** |

**Section severity theme (Round 2):** mostly **P2 polish** on a solid shell; **P1** only where learning integrity is at risk (spoiler + thin critical demos + feedback/retro collapse).

---

## Unit ledger

Scoring key for residual quality (true newbie):
- **Strong** — checklist solid; lengths OK; no spoiler; misconception + transfer clear
- **Adequate** — usable; small nits only
- **Needs residual** — spoiler, missing piece for newbie, or clear length/role failure

When **no residual text** is proposed: Fixer may leave the unit unchanged.

---

### I Do

### S01-T1-A-DEMO (iDo)
- **Scores:** preamble **Strong** · why **Strong** · retrospective **Strong**
- **Checklist:** context pass · goal pass · success partial (implied by output, not named as criterion) · constraints pass · retrospective pass
- **Diagnosis:** R1 prose landed well. Newbie is told not to write files yet; chain version → REPL → `python -m pip` is clear. Success is watchable via output block. Optional residual only: one explicit “éxito de observación” phrase if Fixer wants full preamble checklist symmetry with We Do (not required).
- **Severity:** — (no required change) / optional P2
- **Proposed residual:** none required
- **Code/output changes:** none
- **Validation notes:** Sample 3.12.x remains illustrative; theory already allows 3.10+.

### S01-T1-B-DEMO (iDo)
- **Scores:** preamble **Strong** · why **Adequate** · retrospective **Strong**
- **Checklist:** context pass · goal pass · success pass (0 and 1 visible) · constraints pass (no packages; PowerShell note) · retrospective pass
- **Diagnosis:** Preamble is excellent for “integer, not color.” Residual: `why` packs a second skill (create project folder with `mkdir`) that the demo does not show — distracts from exit codes.
- **Severity:** P2
- **Proposed residual `why` (full text):**  
  El código de salida es el contrato entre tu script y todo lo que lo invoca (shell, CI, orquestadores): **0** = sigamos; **no-cero** = detente o reintenta. Leer `$?` o `$LASTEXITCODE` es el hábito; el mensaje en pantalla y el código son canales distintos. Separar **cwd** (dónde estás) de **PATH** (qué ejecutables existen) evita el clásico “en mi máquina funciona” cuando solo cambió la carpeta o el PATH del job.
- **Proposed residual retrospective:** none (keep)
- **Code/output changes:** none

### S01-T2-A-DEMO (iDo)
- **Scores:** preamble **Strong** · why **Strong** · retrospective **Strong**
- **Checklist:** all pass for demo tier
- **Diagnosis:** Clear watch targets (`sys.prefix`, Windows activate comment). No residual required.
- **Severity:** —
- **Proposed residual:** none
- **Code/output changes:** none

### S01-T2-B-DEMO (iDo)
- **Scores:** preamble **Strong** · why **Adequate** (slightly short) · retrospective **Strong**
- **Checklist:** context/goal/constraints pass · success pass · retrospective pass
- **Diagnosis:** Preamble and retro are solid (including freeze ≠ lockfile). Description claims “reinstall -r” but the worked example never runs `install -r` (that skill lives in We Do E2). `why` is ~37 words — just under target.
- **Severity:** P2
- **Proposed residual `description`:**  
  `Instalar con python -m pip, freeze y verificar el pin (install -r se practica en We Do)`
- **Proposed residual `why` (full text):**  
  `python -m pip` ata el instalador al intérprete del venv (no al `pip` suelto del sistema). `freeze` genera el snapshot pinneado — el contrato que un colega o CI reinstalará el día 1 — e incluye dependencias transitivas. Verificar con `grep` e `import` confirma que el pin y el entorno coinciden antes de confiar en el archivo.
- **Code/output changes:** none (do not force `install -r` into this demo unless intentionally expanding the demo)

### S01-T3-A-DEMO (iDo)
- **Scores:** preamble **Strong** · why **Needs residual** (thin) · retrospective **Adequate**
- **Checklist:** pass except thin why
- **Diagnosis:** Good model of Conventional Commits + `git show`. `why` (~30 w) under-explains why `git show` matters vs empty post-commit `git diff`.
- **Severity:** P2
- **Proposed residual `why` (full text):**  
  Un commit con prefijo `docs:` / `feat:` vuelve legible el historial y el PR. `git show HEAD` enseña a leer el diff del último snapshot (`+` / `−`); es la misma habilidad que usarás al revisar código ajeno. Tras el commit, `git diff` suele verse vacío: eso no significa que “Git falló”, sino que ya no hay cambios sin confirmar.
- **Proposed residual retrospective:** optional bump (keep if space tight):  
  Un prefijo `docs:` / `feat:` convierte el log en documentación ejecutable. El error clásico es “wip” o “cambios”. Pregunta de auto-chequeo: ¿miras `git show` o un `git diff` vacío post-commit? En We Do harás tu primer commit limpio, narrarás un diff y elegirás el mejor mensaje entre candidatos malos.
- **Code/output changes:** none

### S01-T3-B-DEMO (iDo)
- **Scores:** preamble **Strong** · why **Needs residual** · retrospective **Adequate**
- **Checklist:** constraints pass (force-push ban; remote optional) · success softer if no `origin`
- **Diagnosis:** Description correctly softened for local-only. Preamble is good. `why` (~23 w) is the thinnest I Do rationale in the section — true newbie needs more on *why* branch+PR and *why* restore/stash vs force.
- **Severity:** P1
- **Proposed residual `why` (full text):**  
  La rama de feature + PR es el circuito de confianza del equipo: el diff se revisa antes de tocar `main`. `git push -u` solo aplica si ya hay remoto; el hábito de la rama vale igual en local. `restore` / `stash` recuperan trabajo sin reescribir historial compartido. `git push --force` a `main` está prohibido en este curso: puede borrar commits ajenos y no “arregla” un push rechazado.
- **Proposed residual retrospective:** none required (optional: add self-check “¿necesitas origin para practicar la rama?”)
- **Code/output changes:** none; keep remote lines commented/optional as now

### S01-T4-A-DEMO (iDo)
- **Scores:** preamble **Strong** · why **Strong** · retrospective **Strong**
- **Diagnosis:** Excellent F401 → green cycle; CLI vs editor called out. No residual.
- **Severity:** —
- **Proposed residual:** none
- **Code/output changes:** none

### S01-T4-B-DEMO (iDo)
- **Scores:** preamble **Strong** · why **Adequate** · retrospective **Strong**
- **Diagnosis:** Hygiene package is clear; `check-ignore` anchors success. Residual: `why` ends with full remote `git push -u origin main` while the demo is local add/status/ignore — premature for this block (You Do / later steps own remote publish).
- **Severity:** P2
- **Proposed residual `why` (full text):**  
  `.env` se ignora; `.env.example` se versiona **sin secretos**. El README cierra el circuito de un clon limpio: install + smoke sin adivinar. `git check-ignore -v .env` es la prueba observable de que el secreto real no entra al stage. Si un archivo ya estaba versionado, el ignore solo no lo saca: hace falta `git rm --cached` y un commit.
- **Code/output changes:** none

---

### We Do · T1-A

### S01-T1-A-E1 (weDo · guided)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · retrospective **Strong** · feedback **Strong**
- **Checklist:** all pass (4-bullet preamble)
- **Diagnosis:** True-newbie friendly; REPL vs terminal exit is explicit. Feedback and retro slightly overlap but both meet length; acceptable.
- **Severity:** —
- **Proposed residual:** none
- **Code/output changes:** none

### S01-T1-A-E2 (weDo · independent)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Adequate** (short but clear) · retrospective **Strong**
- **Diagnosis:** Good fade from E1. Instruction ~30 w is under the 40 w soft target but still ordered and complete.
- **Severity:** optional P2
- **Proposed residual `instruction` (optional full text):**  
  1. Completa los `____` en `main` (nombre sintético, `sys.version`).  
  2. Completa el guardián `if __name__ == "__main__":` llamando a `main()`.  
  3. Ejecuta `python hello_sys.py` (o `python3`) y confirma exit 0.  
  4. Comprueba que el stdout muestra nombre y una versión `3.x`.
- **Code/output changes:** none

### S01-T1-A-E3 (weDo · transfer)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · retrospective **Strong**
- **Diagnosis:** Transfer surface (procedure for peer) is authentic; no answer spoiler in preamble. Strong residual-free unit.
- **Severity:** —
- **Proposed residual:** none
- **Code/output changes:** none

---

### We Do · T1-B

### S01-T1-B-E1 (weDo · guided)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · retrospective **Adequate** · feedback **Strong**
- **Diagnosis:** PowerShell constraint correctly elevated to **Límites**. Feedback and retrospective nearly twin sentences (print vs exit code).
- **Severity:** P2
- **Proposed residual `retrospective` (full text — differentiate from feedback):**  
  Mensaje en pantalla y exit code son canales distintos: CI lee el entero. Auto-chequeo: en PowerShell, ¿qué variable da el código del último programa nativo? Cuando un job “se ve bien” pero el pipeline para, mira ese número antes de culpar a la librería. Siguiente: un script que elige 0/1 según argumentos.
- **Code/output changes:** none

### S01-T1-B-E2 (weDo · independent)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · retrospective **Strong**
- **Diagnosis:** Best-in-section contract exercise; stderr + argc + multi-arg edge all clear. No residual.
- **Severity:** —
- **Proposed residual:** none
- **Code/output changes:** none

### S01-T1-B-E3 (weDo · transfer)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · retrospective **Strong** · feedback **Adequate**
- **Diagnosis:** PATH vs wrong-interpreter transfer is high value; preamble does not spoil A/B labels. Mild feedback/retro overlap (acceptable at P2 only if Fixer is already touching the unit).
- **Severity:** —
- **Proposed residual:** none required
- **Code/output changes:** none

---

### We Do · T2-A

### S01-T2-A-E1 (weDo · guided)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Adequate** · retrospective **Strong**
- **Diagnosis:** PowerShell execution policy in **Límites** fixes the R1 bare-terminal risk. Instruction is short but matches guided fill-in.
- **Severity:** —
- **Proposed residual:** none
- **Code/output changes:** none

### S01-T2-A-E2 (weDo · independent)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · retrospective **Strong**
- **Diagnosis:** Recovery skill well framed; code lives outside `.venv`. Hints cover Windows remove; instruction is Unix-leaning but OK for this course.
- **Severity:** optional P2
- **Proposed residual `instruction` step (optional add after step 2):**  
  2b. En PowerShell usa `Remove-Item -Recurse -Force .venv` si no usas `rm -rf`.
- **Code/output changes:** none

### S01-T2-A-E3 (weDo · transfer)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · retrospective **Strong**
- **Diagnosis:** Argumentation transfer fits tier; anti-sudo in tests. No residual.
- **Severity:** —
- **Proposed residual:** none
- **Code/output changes:** none

---

### We Do · T2-B

### S01-T2-B-E1 (weDo · guided)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Adequate** (very short) · retrospective **Strong**
- **Diagnosis:** Constraint “venv activo + python -m pip” is in preamble. Instruction is three thin steps — works with starter, but a verify step helps newbies who stop after freeze without reading the file.
- **Severity:** P2
- **Proposed residual `instruction` (full text):**  
  1. Activa el venv y confirma con `sys.prefix` (debe contener `.venv`).  
  2. Completa install pinneado y `python -m pip freeze > requirements.txt`.  
  3. Verifica con `grep` e `import` que la versión del paquete coincide con el archivo.
- **Code/output changes:** none

### S01-T2-B-E2 (weDo · independent)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · retrospective **Strong**
- **Diagnosis:** Clean-room install is the real team skill; anti site-packages copy is explicit. No residual.
- **Severity:** —
- **Proposed residual:** none
- **Code/output changes:** none

### S01-T2-B-E3 (weDo · transfer)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · retrospective **Strong**
- **Diagnosis:** Forensics protocol + stdlib vs terceros is excellent transfer. No residual.
- **Severity:** —
- **Proposed residual:** none
- **Code/output changes:** none

---

### We Do · T3-A

### S01-T3-A-E1 (weDo · guided)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · retrospective **Adequate** · feedback **Needs residual** (short)
- **Diagnosis:** Success regex in tests is good; preamble states Conventional Commits success. Feedback ~22 w under target.
- **Severity:** P2
- **Proposed residual `feedback` (full text):**  
  Un solo commit bien nombrado ya es más profesional que diez “cambios”. El malentendido: hacer `commit` sin `git add` (o un mensaje vacío/`wip`). Si `git log -1` muestra `docs:` o `feat:` con descripción, cumpliste el contrato del historial. Siguiente: leer el diff del HEAD.
- **Code/output changes:** none

### S01-T3-A-E2 (weDo · independent)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · retrospective **Strong**
- **Diagnosis:** Correctly steers away from empty post-commit `git diff`. Strong unit.
- **Severity:** —
- **Proposed residual:** none
- **Code/output changes:** none

### S01-T3-A-E3 (weDo · transfer)
- **Scores:** title **Strong** · preamble **Needs residual** · instruction **Strong** · retrospective **Strong** · feedback **Needs residual**
- **Checklist:** success criterion **fails learning integrity** — spoils the choice
- **Diagnosis:** **Highest residual priority in the section.** Preamble line:  
  `Éxito: eliges **B**; justificación 3–5 oraciones; reescrituras con prefijos válidos.`  
  That is the answer key. Transfer requires the learner to *choose*; tests may still expect B, but the learner-facing preamble must not name B. Feedback is also under length (~19 w).
- **Severity:** **P1**
- **Proposed residual `preamble` (full text):**  
  - **Contexto:** tres mensajes candidatos para el mismo cambio (`scripts/hello_env.py` smoke).  
  - **Meta:** elegir el más legible en historial de equipo y reescribir los otros al estilo Conventional Commits.  
  - **Éxito:** una elección justificada en 3–5 oraciones; reescrituras de los rechazados con prefijos válidos (`feat`/`fix`/`docs`/`chore`/…); sin defender `wip` en `main`.  
  - **Límites:** no defiendas `wip` en `main`; evita prefijos inventados tipo `update:`; la justificación debe hablar de legibilidad para un colega, no solo de “gusto”.
- **Proposed residual `feedback` (full text):**  
  Elegir mensajes es diseño de comunicación del equipo, no adorno. El malentendido: “wip es honesto, basta”. Un subject con tipo + artefacto permite leer el log sin abrir el diff. Si reescribiste los candidatos débiles con prefijos útiles, ya entrenas el hábito del You Do (≥3 Conventional Commits).
- **Code/output changes:** none (keep solution choosing B; do not leak B in preamble/instruction)
- **Validation notes:** `tests` may still say “Elige B” for automated/rubric use — that is reviewer-facing; keep learner-facing fields clean.

### S01-T3-B-E1 (weDo · guided)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Adequate** (thin) · retrospective **Strong**
- **Diagnosis:** Success (HEAD on feature, `feat:` commit) is clear. Instruction 3 short steps are enough for guided blanks.
- **Severity:** —
- **Proposed residual:** none required
- **Code/output changes:** none

### S01-T3-B-E2 (weDo · independent)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · retrospective **Strong**
- **Diagnosis:** Reviewer-oriented PR body; concrete test plan. No residual.
- **Severity:** —
- **Proposed residual:** none
- **Code/output changes:** none

### S01-T3-B-E3 (weDo · transfer)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · retrospective **Strong**
- **Diagnosis:** Culture-critical recovery without force-push; success criteria complete. No residual.
- **Severity:** —
- **Proposed residual:** none
- **Code/output changes:** none

---

### We Do · T4-A

### S01-T4-A-E1 (weDo · guided)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · retrospective **Strong**
- **Diagnosis:** TOML pitfalls (wrong table, string vs list, no ALL) in constraints. No residual.
- **Severity:** —
- **Proposed residual:** none
- **Code/output changes:** none

### S01-T4-A-E2 (weDo · independent)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · retrospective **Strong** · starter comments **Needs residual**
- **Diagnosis:** Learning goal is fine. Residual integrity issue: starter header says  
  `# TAREA: corre ruff check y elimina imports sin usar (sys, os)`  
  which spoils the independent discovery that `ruff check` is meant to drive. Hints may name F401; the starter should not list exact dead imports.
- **Severity:** **P1**
- **Proposed residual starter comment block (replace the TAREA/Éxito comment lines only):**  
  ```
  # CASO-LIM-001 · ruff check imports
  # TAREA: instala ruff, corre ruff check y corrige hasta exit 0
  # Éxito: python -m ruff check hello_lint.py → exit 0; el script sigue corriendo
  ```
  (Leave the defective `import sys` / `import os` body unchanged.)
- **Proposed residual:** no change to preamble/instruction if starter spoiler is removed
- **Code/output changes:** comment text only; solution unchanged

### S01-T4-A-E3 (weDo · transfer)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · retrospective **Strong** · feedback **Adequate** (slightly short)
- **Diagnosis:** Governance transfer is appropriate; no spoiler of the exact select in success (proposes “set acotado”). Feedback ~23 w.
- **Severity:** P2
- **Proposed residual `feedback` (full text):**  
  Gobernar la calidad es priorizar señales. El malentendido: más reglas = más calidad automática. Un linter que el equipo respeta (E/F/I en verde) vale más que `ALL` ignorado el día 1. Si argumentaste ruido vs señal y un plan de ampliación, cumpliste el transfer.
- **Code/output changes:** none

---

### We Do · T4-B

### S01-T4-B-E1 (weDo · guided)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · retrospective **Strong**
- **Diagnosis:** Dual `.venv/` + `venv/` success constraint is essential and present. No residual.
- **Severity:** —
- **Proposed residual:** none
- **Code/output changes:** none

### S01-T4-B-E2 (weDo · independent)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · retrospective **Strong**
- **Diagnosis:** No-real-tokens constraints are explicit. No residual.
- **Severity:** —
- **Proposed residual:** none
- **Code/output changes:** none

### S01-T4-B-E3 (weDo · transfer)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · retrospective **Strong**
- **Diagnosis:** Observable checklist bridge to You Do is excellent. No residual.
- **Severity:** —
- **Proposed residual:** none
- **Code/output changes:** none

---

### youDo · Esqueleto CP-N1-A

- **Scores:** context/objectives/requirements/rubric **Strong** · retrospective **Strong** (slightly long)
- **Checklist:** context pass · goals pass · success pass (rubric) · constraints pass · retrospective pass (content) · length slightly over
- **Diagnosis:** R1 retrospective addition works: three defense questions + S04-will-not-fix-bad-skeleton misconception. ~87 words vs 40–80 target — trim only for anti-bloat, not content loss.
- **Severity:** P2
- **Proposed residual `retrospective` (full text, tightened):**  
  Antes de marcar listo: (1) ¿qué comando del README demuestra en máquina limpia `venv` + `install -r` + smoke? (2) ¿qué cambia con datos reales de clientes vs. CSV sintético (PII, `.env`)? (3) Una frase de impacto medible en el README (p. ej. “clon → smoke en &lt;10 min”) que puedas defender en 30 s en inducción. Malentendido: creer que el validador de S04 “arregla” un repo sin ignore, sin freeze o con secretos.
- **Proposed preamble:** N/A — keep `context` as project frame
- **Code/output changes:** none

---

## Priority order (Round 2 Fixer)

### P1 (do first — learning integrity / critical rationale)
1. **S01-T3-A-E3** — remove answer spoiler “eliges **B**” from learner-facing preamble; enrich feedback
2. **S01-T4-A-E2** — remove `(sys, os)` spoiler from starter TAREA comment
3. **S01-T3-B-DEMO** — expand thin `why` (branch/PR/restore vs force)

### P2 (polish — length, scope, differentiation)
4. **S01-T1-B-DEMO** — trim `why` scope creep (`mkdir` not in demo)
5. **S01-T2-B-DEMO** — align `description` with demo (no false `install -r`); slightly expand `why`
6. **S01-T3-A-DEMO** — expand thin `why` (and optional retro self-check)
7. **S01-T4-B-DEMO** — keep `why` local to ignore/example/README (drop premature remote push)
8. **S01-T1-B-E1** — differentiate retrospective from feedback
9. **S01-T2-B-E1** — slightly richer instruction (verify prefix + grep/import)
10. **S01-T3-A-E1**, **S01-T4-A-E3** — bring feedback into 25–60 words
11. **youDo** — optional retrospective trim to ≤80 words
12. Optional: S01-T1-A-E2 / S01-T2-A-E2 instruction micro-adds only if Fixer is already in those files

### Not required
- Units scored **Strong** across pedagogy fields with no spoiler: leave unchanged (majority of T1–T4 exercises)

---

## Residual risks
- **Spoiler regression:** any Fixer “clarifying” Éxito with the correct multiple-choice letter will re-break E3 transfer — prefer rubric criteria (“justificación + reescrituras válidas”).
- **Feedback/retro collapse:** if Fixer only copies the same sentence into both fields again, Round-2 intent is missed; retrospective must add principle / self-check / transfer, not restate feedback.
- **Platform variance:** keep dual Win/Unix paths in preambles without turning instruction into essays.
- **Local vs remote Git:** success criteria must not require `origin` where the source allows local-only (T3-B).
- **Version fixtures:** keep `requests==2.32.3` and sample Python 3.12.x unless execute-and-diff fails.
- **You Do scope:** do not expand S01 You Do into the full intake validator.
- **Anti-aberration:** hand-apply residual prose; no generators or section-wide template paste.

## Fixer notes (non-binding)
- Prefer surgical edits: only units listed under P1/P2 with proposed full text.
- Preserve starters’ `____` defects, solution outputs, and tests unless a spoiler forces a comment-only change.
- Spanish: professional Peruvian register; tú form; no real PII.
- Do not re-open Round-1 “add missing fields” work — fields are present.

---

Section 1 exercise pedagogy review complete. Ready for the Fixer prompt.
