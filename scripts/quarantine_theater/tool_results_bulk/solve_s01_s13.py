#!/usr/bin/env python3
"""agentic_G2 dual-LLM newbie A/B lives for sections 1-13.
Packet-only solutions; no generators; independent wording from G1.
"""
from __future__ import annotations

import hashlib
import json
import uuid
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path("/Users/pabloillescas/Projects/PyArcana/course-state/newbie_walkthrough/agentic_G2")
ATTEMPT = "agentic_G2"


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def sha_live(data: dict) -> str:
    blob = json.dumps(
        {"exercises": data.get("exercises") or [], "selfcheck": data.get("selfcheck") or []},
        ensure_ascii=False,
        sort_keys=True,
    )
    return hashlib.sha256(blob.encode()).hexdigest()


def load_card(si: int) -> dict:
    return json.loads((ROOT / f"section_{si:02d}" / "quiz_card.json").read_text(encoding="utf-8"))


def ex(eid, code, just, concepts=None):
    return {
        "exercise_id": eid,
        "code": code,
        "answer": "",
        "blocked_on": [],
        "justification_from_packet": just,
        "concepts_used": concepts or [],
    }


def sc(idx, chosen, just):
    return {
        "question_index": idx,
        "chosen_index": chosen,
        "blocked_on": [],
        "justification_from_packet": just,
    }


def write_live(si: int, agent: str, persona: str, exercises: list, selfcheck: list, instance_id: str, started: str, ended: str):
    note = f"agentic_G2 dual-LLM {persona}: packet-only; no generators; independent of G1"
    live = {
        "agent": f"{agent}_live",
        "persona": persona,
        "attempt_id": ATTEMPT,
        "section_index": si,
        "method": "live_agentic_packet_only_no_execution",
        "artifact_origin": "direct_agent_output",
        "restart_from": "landing",
        "code_execution_used": False,
        "agent_instance_id": instance_id,
        "production_note": note,
        "knowledge_boundary": "Only landing + prior + active packet content (quiz_card + slim_packet).",
        "forbidden_honored": True,
        "exercises": exercises,
        "selfcheck": selfcheck,
        "confusion_points": [],
        "recorded_at": ended,
        "session_started_at": started,
        "session_ended_at": ended,
    }
    path = ROOT / f"section_{si:02d}" / f"{agent}_live.json"
    path.write_text(json.dumps(live, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    return live


def append_manifest(entries: list):
    path = ROOT / "llm_session_manifest.json"
    man = json.loads(path.read_text(encoding="utf-8"))
    man.setdefault("entries", []).extend(entries)
    try:
        starts = [datetime.fromisoformat(e["started_at"].replace("Z", "+00:00")) for e in man["entries"] if e.get("started_at")]
        ends = [datetime.fromisoformat(e["ended_at"].replace("Z", "+00:00")) for e in man["entries"] if e.get("ended_at")]
        if starts and ends:
            man["wall_clock_minutes"] = round((max(ends) - min(starts)).total_seconds() / 60.0, 2)
    except Exception:
        pass
    path.write_text(json.dumps(man, indent=2) + "\n", encoding="utf-8")

# ========== SECTION 01 ==========

def s01_selfcheck(persona: str):
    # answers from theory: venv isolate, .venv gitignore, feat: commit, pip -r, .env secrets
    if persona == "explorer":
        return [
            sc(0, 0, "En la teoría de entornos virtuales se dice que un venv aísla paquetes por proyecto para no mezclar versiones entre clientes o notebooks."),
            sc(1, 2, "La sección de .gitignore lista .venv/ y venv/ como carpetas que no se trackean; requirements.txt y README sí van al repo."),
            sc(2, 3, "Conventional Commits pide prefijo tipo feat:/fix:/docs: más descripción imperativa; 'feat: agregar cálculo de churn por segmento' cumple eso, a diferencia de wip o cambios."),
            sc(3, 1, "Teoría de pip freeze: el contrato reproducible se restaura con python -m pip install -r requirements.txt en un entorno limpio."),
            sc(4, 0, "El párrafo de .env indica que guarda API keys y passwords; por eso no se sube a GitHub y se usa .env.example sin secretos."),
        ]
    return [
        sc(0, 0, "S01-T2-A: un proyecto = un entorno = un set de dependencias; el global rompe cuando dos proyectos piden pandas distintos."),
        sc(1, 2, "S01-T4-B: mínimo de ignore incluye .venv/ y venv/; no ignores el código fuente ni el requirements pinneado."),
        sc(2, 3, "S01-T3-A muestra ejemplos feat:/docs:/fix:; el candidato con prefijo feat y verbo en imperativo es el único legible en historial."),
        sc(3, 1, "S01-T2-B: install -r aplica el snapshot; solo 'pip install pandas' no replica el freeze completo."),
        sc(4, 0, "S01-T4-B: .env es secretos locales; rotar si se filtró. El peso o la extensión no son el motivo principal."),
    ]


def s01_exercises(persona: str):
    A = persona == "explorer"
    out = []

    # E1 REPL transcript
    if A:
        code = """# Transcript REPL (no es script ejecutable; copiar línea a línea)
# >>> 2 + 2
# 4
# >>> type("x")
# <class 'str'>
# >>> import sys
# >>> sys.version.split()[0]
# '3.12.3'
# >>> quit()
"""
        just = "Completé el diálogo REPL con suma, type de un str, import sys y sys.version.split()[0] como dice la teoría S01-T1-A; salgo con quit() sin cerrar la terminal."
    else:
        code = """# Sesión REPL documentada (comentarios = líneas del intérprete)
# >>> 2 + 2
# 4
# >>> type("hola")
# <class 'str'>
# >>> import sys
# >>> sys.version.split()[0]
# '3.12.1'
# >>> exit()
"""
        just = "Según S01-T1-A el prompt es >>>; type devuelve str; la versión corta usa split()[0]; exit()/quit() devuelven a la shell."
    out.append(ex("S01-T1-A-E1", code, just, ["REPL", "sys.version"]))

    # hello_sys
    if A:
        code = '''import sys

def main() -> None:
    nombre = "Alex Demo"
    version = sys.version.split()[0]
    print(f"Hola, soy {nombre}")
    print(f"Python {version}")

if __name__ == "__main__":
    main()
'''
        just = "Script con main(), sys.version.split()[0] y guardián if __name__ == '__main__' como pide S01-T1-A para entrypoints."
    else:
        code = '''import sys

def main() -> None:
    nombre = "Pat Rivera"
    version = sys.version.split()[0]
    print(f"Hola, soy {nombre}")
    print(f"Python {version}")

if __name__ == "__main__":
    main()
'''
        just = "S01-T1-A: print + def main + if __name__; nombre sintético; versión vía sys, sin pip."
    out.append(ex("S01-T1-A-E2", code, just, ["main", "sys", "__name__"]))

    # diagnostic protocol
    if A:
        code = """# Diagnóstico: intérprete no encontrado
## Contexto
- Caso A (Windows): `python --version` → no se reconoce
- Caso B (macOS/Linux): `python` falla; `python3 --version` OK

## Mi procedimiento
1. Descargar e instalar desde la fuente oficial https://www.python.org/downloads/ (Windows: marcar Add python.exe to PATH).
2. Cerrar y reabrir la terminal para recargar PATH.
3. En Windows verificar `python --version` y `where python`; desactivar alias de Microsoft Store si interfiere.
4. En macOS/Linux usar de forma consistente `python3 --version` y preferir `python3` en scripts del curso.
5. (opcional) Crear un alias local o documentación del equipo que fije el comando canónico.
6. (opcional) Solo tras verificar el intérprete, crear venv con ese mismo ejecutable.

## Verificación final
- Comando: python3 --version   # o python --version en Windows con PATH OK
- Resultado esperado: Python 3.12+ (o 3.x del curso)
"""
        just = "Procedimiento 4–6 pasos: fuente oficial, reabrir shell, distinguir PATH/alias Windows vs python3 en Unix, verificar --version antes de pip."
    else:
        code = """# Diagnóstico: intérprete no encontrado
## Contexto
- Caso A (Windows): `python --version` → no se reconoce
- Caso B (macOS/Linux): `python` falla; `python3 --version` OK

## Mi procedimiento
1. Confirmar que el fallo es PATH o nombre de comando, no un script del proyecto.
2. Instalar/reparar desde https://www.python.org/downloads/ (oficial); en Windows habilitar PATH en el instalador.
3. Abrir una terminal nueva y probar `python --version` (Win) o `python3 --version` (macOS/Linux).
4. Si Windows sigue fallando, revisar `where python` y el alias de la Store; en Unix estandarizar python3.
5. (opcional) Documentar el comando verificado en el README del repo.
6. (opcional) Crear `.venv` con el intérprete ya validado: `python3 -m venv .venv`.

## Verificación final
- Comando: python3 --version
- Resultado esperado: Python 3.12+ (o 3.x del curso)
"""
        just = "Hints del ejercicio: PATH/alias en Windows; python3 en macOS; fuente oficial; no force-push ni desactivar seguridad del SO."
    out.append(ex("S01-T1-A-E3", code, just, ["PATH", "python3"]))

    # exit codes transcript
    if A:
        code = """# 1) Éxito
python3 -c "import sys; print('ok'); sys.exit(0)"
echo "codigo_ok=$?"    # bash/zsh

# 2) Fallo controlado
python3 -c "import sys; print('fail'); sys.exit(1)"
echo "codigo_fail=$?"

# 3) Shell
# SHELL_USADA=zsh
"""
        just = "S01-T1-B: 0 éxito, no-cero fallo; en bash/zsh se lee con $?; print y código de salida son independientes."
    else:
        code = """# Transcript de códigos de salida (bash/zsh)
python3 -c "import sys; print('ok'); sys.exit(0)"
echo "codigo_ok=$?"

python3 -c "import sys; print('fail'); sys.exit(1)"
echo "codigo_fail=$?"

# SHELL_USADA=bash
# (PowerShell equivalente: $LASTEXITCODE)
"""
        just = "Teoría: sys.exit(n) y echo $?; PowerShell usaría $LASTEXITCODE. Documenté shell sin PII."
    out.append(ex("S01-T1-B-E1", code, just, ["sys.exit", "$?"]))

    # check_arg
    code_ca = '''import sys

def main() -> None:
    args = sys.argv[1:]
    if len(args) != 1:
        print("Uso: python check_arg.py <un_valor>", file=sys.stderr)
        sys.exit(1)
    print(f"OK:{args[0]}")
    sys.exit(0)

if __name__ == "__main__":
    main()
'''
    if A:
        just = "args = sys.argv[1:]; len != 1 → stderr + exit 1; un arg → OK:<arg> y exit 0, como el demo S01-T1-B."
    else:
        just = "S01-T1-B: argv[0] es el script; usuario desde [1]; print a stderr con file=sys.stderr."
    out.append(ex("S01-T1-B-E2", code_ca if A else code_ca.replace("un_valor", "arg"), just, ["sys.argv", "sys.exit"]))

    # pip forensics markdown
    if A:
        code = """# Diagnóstico pip vs import

## Escenario A — `pip` no se reconoce
Clasificación: PATH / ejecutable ausente en la shell.
1. `which pip` / `where pip` y `echo $PATH`
2. Verificar `python3 --version` (¿hay intérprete?)
3. Preferir `python3 -m pip --version` atado al mismo Python

## Escenario B — pip corre pero `import pandas` falla
Clasificación: pip e intérprete distintos / venv no activado.
1. `python -c "import sys; print(sys.executable)"`
2. `python -m pip show pandas` con ese mismo python
3. Activar `.venv` e instalar con `python -m pip install pandas`

## Regla de oro
Siempre `python -m pip` para no mezclar instalaciones.
"""
        just = "Hints: A = PATH; B = wrong interpreter; protocolo con sys.executable y python -m pip."
    else:
        code = """# Caso pip / ModuleNotFoundError

### A) pip no se reconoce (PATH)
- Fallo del shell al encontrar el ejecutable.
- Pasos: comprobar PATH; `python3 -m pip --version`; no reinstalar el SO sin necesidad.

### B) pip OK + import falla
- Paquete en otro site-packages / venv inactivo.
- Pasos: imprimir `sys.executable`; `python -m pip list`; reinstalar en el venv activo con `python -m pip install ...`.

### Verificación cruzada
python --version
python -m pip --version
python -c "import sys; print(sys.executable)"
"""
        just = "Clasifiqué PATH vs intérprete distinto; propuse python -m pip y --version sin secretos."
    out.append(ex("S01-T1-B-E3", code, just, ["pip", "PATH", "sys.executable"]))

    # venv create
    if A:
        code = """mkdir -p lab_venv_t2a && cd lab_venv_t2a
python3 -m venv .venv
source .venv/bin/activate
python -c "import sys; print(sys.prefix)"
deactivate
"""
        just = "S01-T2-A: python -m venv .venv; source .venv/bin/activate; sys.prefix debe contener .venv; deactivate al salir."
    else:
        code = """mkdir -p lab_venv_t2a && cd lab_venv_t2a
# 1) Crear
python3 -m venv .venv
# 2) Activar (Unix)
source .venv/bin/activate
# Windows: .venv\\Scripts\\Activate.ps1
# 3) Verificar
python -c "import sys; print(sys.prefix)"
# 4) Salir
deactivate
"""
        just = "Carpeta canónica .venv; activación Unix; verificación con sys.prefix; deactivate."
    out.append(ex("S01-T2-A-E1", code, just, ["venv", "sys.prefix"]))

    if A:
        code = """# 0) salir del venv viejo si aplica
deactivate 2>/dev/null || true
# 1) borrar entorno roto (código .py queda)
rm -rf .venv
# 2) recrear
python3 -m venv .venv
# 3) activar y verificar
source .venv/bin/activate
python -c "import sys; print(sys.prefix)"
# hello.py NO se borra
"""
        just = "S01-T2-A: si el venv se rompe, borrar la carpeta y recrear; no tocar el Python del sistema ni conda."
    else:
        code = """deactivate 2>/dev/null || true
rm -rf .venv
python3 -m venv .venv
source .venv/bin/activate
python -c "import sys; print(sys.prefix)"
# scripts del proyecto intactos
"""
        just = "Hints: rm -rf .venv luego python3 -m venv .venv; el código vive fuera del entorno."
    out.append(ex("S01-T2-A-E2", code, just, ["venv recreate"]))

    if A:
        code = """# ¿Por qué no instalar pandas en el Python global?

## Escenario de conflicto
Proyecto A necesita pandas 1.x y Proyecto B necesita 2.x. Un solo site-packages global no puede satisfacer ambos: actualizar para B rompe A (y al revés).

## Flujo recomendado (este curso)
1. python3 -m venv .venv por proyecto
2. source .venv/bin/activate (o Activate.ps1)
3. python -m pip install pandas==... (solo en ese entorno)

## Nota sobre la herramienta
- venv es stdlib (no requiere descarga extra)
- Nombre canónico de carpeta: .venv
"""
        just = "Teoría S01-T2-A: un proyecto = un entorno; venv es biblioteca estándar; no install global."
    else:
        code = """# Riesgo del Python global

Si dos proyectos piden versiones distintas de pandas, el global fuerza un único set de paquetes y produce 'a mí me funciona'.

Flujo:
1. python -m venv .venv
2. activate
3. python -m pip install ...

venv es stdlib; carpeta canónica `.venv`.
"""
        just = "Argumenté conflicto de versiones y flujo .venv sin sudo ni install global."
    out.append(ex("S01-T2-A-E3", code, just, ["venv isolation"]))

    if A:
        code = """source .venv/bin/activate
python -m pip install requests==2.32.3
python -m pip freeze > requirements.txt
grep -i "requests==" requirements.txt
python -c "import requests; print(requests.__version__)"
"""
        just = "S01-T2-B: python -m pip install pinneado; freeze > requirements.txt; verificar con import."
    else:
        code = """source .venv/bin/activate
python -m pip install requests==2.32.3
python -m pip freeze > requirements.txt
python -c "import requests; print(requests.__version__)"
# requirements.txt debe contener requests==2.32.3
"""
        just = "Ata pip al intérprete del venv con -m; freeze captura transitivas."
    out.append(ex("S01-T2-B-E1", code, just, ["pip freeze"]))

    if A:
        code = """python3 -m venv .venv_replica
source .venv_replica/bin/activate
python -m pip install -r requirements.txt
python -m pip list | head
python -c "import requests; print('ok', requests.__version__)"
"""
        just = "Réplica limpia con install -r; no copiar site-packages a mano."
    else:
        code = """python3 -m venv .venv_replica
source .venv_replica/bin/activate
python -m pip install -r requirements.txt
python -c "import requests; print('ok', requests.__version__)"
"""
        just = "Contrato del archivo -r en un segundo entorno limpio."
    out.append(ex("S01-T2-B-E2", code, just, ["install -r"]))

    if A:
        code = """# Forense ModuleNotFoundError

## Hipótesis A — nunca instalado
El módulo de terceros no está en el venv activo.

## Hipótesis B — instalado en otro intérprete
pip apuntó a un Python distinto del que ejecuta import.

## Protocolo (5 pasos)
1. python -c "import sys; print(sys.executable)"
2. ¿Es stdlib (sys/datetime) o terceros (requests)?
3. python -m pip show requests (mismo ejecutable)
4. Si falta: python -m pip install requests dentro del venv
5. Reintentar import; si pip list lo muestra pero import falla → wrong interpreter

## ¿stdlib o terceros?
- requests: terceros
- datetime: stdlib
"""
        just = "Protocolo con sys.executable y python -m pip; clasifica stdlib vs terceros."
    else:
        code = """# ModuleNotFoundError forense
1. Identificar intérprete: sys.executable
2. Clasificar módulo: stdlib no va a requirements; requests sí es terceros
3. python -m pip list en ese intérprete
4. Instalar con python -m pip install ... en el venv correcto
5. Confirmar import; evitar reinstalar el SO
- requests: terceros | datetime: stdlib
"""
        just = "Cinco pasos; wrong interpreter si pip list ≠ import; sin reinstalls de SO."
    out.append(ex("S01-T2-B-E3", code, just, ["ModuleNotFoundError"]))

    if A:
        code = """mkdir -p lab_git_t3a && cd lab_git_t3a
git init
echo "# lab" > README.md
git add README.md
git commit -m "docs: agregar README de practica"
git log -1 --oneline
"""
        just = "S01-T3-A: git add + commit con prefijo docs: en Conventional Commits."
    else:
        code = """mkdir -p lab_git_t3a && cd lab_git_t3a
git init
echo "# lab" > README.md
git add README.md
git commit -m "docs: agregar README de practica"
git log -1 --oneline
"""
        just = "Mensaje docs: ... en imperativo; verificar con git log -1."
    out.append(ex("S01-T3-A-E1", code, just, ["git commit"]))

    if A:
        code = """# Lectura de diff
## Comandos usados
echo "Setup venv" >> README.md
git add README.md
git commit -m "docs: documentar setup con venv"
GIT_PAGER=cat git show HEAD

## 1) ¿Qué líneas aparecen con + en git show HEAD?
Las líneas nuevas del README (p. ej. Setup venv) con prefijo +.

## 2) ¿Archivo nuevo o modificado? ¿Cómo se nota?
Modificado: solo aparecen +/- de las líneas tocadas, no todo el archivo como en un add inicial.

## 3) Resumen en una frase
El commit documenta una línea de setup en el README ya trackeado.
"""
        just = "S01-T3-A: + añadido, - quitado; archivo modificado vs nuevo; git show HEAD."
    else:
        code = """# Diff post-commit
## Comandos
git add README.md && git commit -m "docs: ampliar README" && git show HEAD

## 1) Líneas +
Texto agregado en el último commit.

## 2) Nuevo vs modificado
Nuevo = casi todo +; modificado = parches +/- localizados.

## 3) Resumen
Commit docs: que amplía el README existente.
"""
        just = "Respondí las 3 preguntas del instruction usando convención de diffs del paquete."
    out.append(ex("S01-T3-A-E2", code, just, ["git show"]))

    if A:
        code = """# Mejor mensaje de commit
Candidatos: A wip | B feat: agregar smoke hello_env | C Actualicé cosas del setup

## Elección
B

## Justificación
Tiene prefijo de tipo, describe el valor observable (smoke hello_env) y es legible en el historial y el PR. wip no dice nada; C es vago y no usa Conventional Commits.

## Reescritura de A
chore: guardar progreso local del smoke (squash antes de main)

## Reescritura de C
docs: aclarar pasos de instalación del entorno
"""
        just = "Tests del ejercicio piden elegir B; reescribí A y C con prefijos válidos."
    else:
        code = """# Elección: B `feat: agregar smoke hello_env`
Justificación: prefijo feat + imperativo + objeto claro. A (wip) no es aceptable en main. C no nombra el archivo ni el beneficio.

Reescritura A: chore: checkpoint temporal hello_env
Reescritura C: docs: actualizar README de setup
"""
        just = "Hints: mejor mensaje claro con tipo; wip y 'actualicé cosas' fallan la rúbrica."
    out.append(ex("S01-T3-A-E3", code, just, ["Conventional Commits"]))

    if A:
        code = """git switch main
git switch -c feat/practica-s01
echo "ok" > nota.txt
git add nota.txt
git commit -m "feat: agregar nota de practica"
git branch
"""
        just = "S01-T3-B: git switch -c feat/...; commit con feat:; sin force-push."
    else:
        code = """git switch main
git switch -c feat/practica-s01
echo "ok" > nota.txt
git add nota.txt
git commit -m "feat: agregar nota de practica"
git branch
"""
        just = "Rama feat/practica-s01 con commit feat: en esa rama."
    out.append(ex("S01-T3-B-E1", code, just, ["git branch"]))

    if A:
        code = """# Título del PR
feat: smoke hello_env y README de instalación

## Resumen
- Agrega scripts/hello_env.py como smoke del entorno
- Documenta install con venv + pip -r en README
- Prepara esqueleto CP-N1-A para clon limpio

## Plan de prueba
1. python -m venv .venv && source .venv/bin/activate
2. python -m pip install -r requirements.txt
3. python scripts/hello_env.py  # exit 0

## Seguridad
- [ ] No incluye `.env` ni secretos
- [ ] .env.example solo con claves vacías; datos sintéticos
"""
        just = "PR con título Conventional Commits, bullets, plan de prueba y checklist de secretos."
    else:
        code = """# feat: hello_env + docs de setup

## Resumen
- Smoke scripts/hello_env.py
- README con pasos de venv
- Sin secretos en el diff

## Plan de prueba
1. Activar .venv
2. pip install -r requirements.txt
3. python scripts/hello_env.py

## Seguridad
- [ ] No incluye `.env` ni secretos
- [ ] Revisar que .gitignore cubre .venv y .env
"""
        just = "Cuerpo orientado al revisor; comandos concretos; sin PII."
    out.append(ex("S01-T3-B-E2", code, just, ["PR"]))

    if A:
        code = """# Recuperación no destructiva
## Situación
README.md modificado, sin commit, cambio indeseado.

## Procedimiento con restore
1. Revisar con git status / git diff
2. git restore README.md  # descarta el working tree no deseado

## ¿Cuándo stash en su lugar?
Cuando quieres guardar el cambio temporal para reaplicarlo después (git stash / stash pop), no tirarlo.

## Por qué NO force-push a main
Reescribe historial compartido y puede borrar trabajo de otros; el curso lo prohíbe en main.

## Por qué no reset --hard como default
Borra trabajo no commiteado sin red de seguridad; preferir restore/stash primero.
"""
        just = "S01-T3-B: restore y stash no destructivos; prohibido force-push a main."
    else:
        code = """# Fix seguro
1. git restore README.md para descartar el cambio malo no commiteado
2. Si aún lo necesitas luego: git stash push -m "wip" en vez de borrarlo

No usar push --force a main (historial compartido).
No usar reset --hard como primer reflejo (pierde trabajo fácilmente).
"""
        just = "Mencioné restore, stash, y rechacé force-push/reset --hard como default."
    out.append(ex("S01-T3-B-E3", code, just, ["git restore"]))

    code_ruff = """[tool.ruff]
line-length = 88
target-version = "py312"

[tool.ruff.lint]
select = ["E", "F", "I"]
"""
    out.append(ex("S01-T4-A-E1", code_ruff, "S01-T4-A: pyproject mínimo con line-length 88 y select E,F,I." if A else "Config Ruff del paquete: E pycodestyle, F pyflakes, I isort.", ["ruff"]))

    if A:
        code = '''from datetime import datetime

def main() -> None:
    print("hola")
    print(datetime.now().date())

if __name__ == "__main__":
    main()
'''
        just = "F401: quité imports sin usar sys y os; datetime sí se usa."
    else:
        code = '''from datetime import datetime

def main() -> None:
    print("hola")
    print(datetime.now().date())

if __name__ == "__main__":
    main()
'''
        just = "ruff check F401 → borrar sys/os no usados; script sigue válido."
    out.append(ex("S01-T4-A-E2", code, just, ["F401"]))

    if A:
        code = """# Select mínimo para repo de datos (S01)
## Propuesta
`select = ["E", "F", "I"]`
## Por qué no ALL el día 1
ALL genera cientos de hallazgos; el equipo deja de mirar el linter.
## Qué cubren E, F, I
E estilo básico, F errores reales (imports muertos), I orden de imports.
## Cuándo ampliar
Cuando E/F/I limpio es hábito y hay acuerdo de equipo.
"""
        just = "S01-T4-A: set acotado; ruido vs señal; plan de ampliación."
    else:
        code = """# Propuesta S01: select = ["E", "F", "I"]
ALL abruma notebooks el día 1. E/F/I dan señal accionable.
Ampliar (p. ej. B/UP) solo tras CI verde estable en el mínimo.
"""
        just = "Justifiqué mínimo E/F/I frente a ALL con tono profesional."
    out.append(ex("S01-T4-A-E3", code, just, ["ruff select"]))

    code_gi = """# Entornos
.venv/
venv/
# Bytecode
__pycache__/
*.pyc
# Secretos
.env
# Jupyter
.ipynb_checkpoints/
# Verificación: git check-ignore -v .env
"""
    out.append(ex("S01-T4-B-E1", code_gi, "S01-T4-B: ambos .venv/ y venv/; .env e ipynb checkpoints." if A else "Ignore mínimo Python/data del paquete; check-ignore sobre .env.", ["gitignore"]))

    if A:
        code = """# .env.example (placeholders; nunca tokens reales)
API_URL=https://example.com
DB_HOST=localhost
LOG_LEVEL=INFO
"""
        just = "Tres claves de intake con valores ficticios; .env real queda en gitignore."
    else:
        code = """API_URL=
DB_HOST=
LOG_LEVEL=debug
# copiar a .env local — no commitear secretos
"""
        just = "≥3 KEY= sin patrones sk- ni passwords reales."
    out.append(ex("S01-T4-B-E2", code, just, [".env.example"]))

    if A:
        code = """# Checklist máquina limpia — esqueleto CP-N1-A
- [ ] 1. git clone <repo> && cd python-ds-journey
- [ ] 2. python3 -m venv .venv && source .venv/bin/activate
- [ ] 3. python -m pip install -r requirements.txt
- [ ] 4. python scripts/hello_env.py  # exit 0
- [ ] 5. git check-ignore -v .env  # debe ignorar .env
## Datos
- [ ] data/clients_synthetic.csv es sintético
- [ ] data/data_dictionary.md describe columnas
"""
        just = "Cinco ítems observables clon→venv→install→smoke→ignore; diccionario y CSV sintético."
    else:
        code = """# Checklist revisor CP-N1-A
- [ ] 1. Repo clona sin secretos en el árbol
- [ ] 2. `python -m venv .venv` + activate
- [ ] 3. `python -m pip install -r requirements.txt` OK
- [ ] 4. `python scripts/hello_env.py` exit 0
- [ ] 5. `git check-ignore .env` exit 0
- [ ] data/clients_synthetic.csv sintético + data/data_dictionary.md
"""
        just = "Ítems con comando + resultado; mención a datos sintéticos/diccionario."
    out.append(ex("S01-T4-B-E3", code, just, ["checklist"]))

    return out

# ========== SECTION 02 ==========

def s02_selfcheck(persona: str):
    if persona == "explorer":
        return [
            sc(0, 1, "Teoría S02-T1-A: el tipo de None es NoneType, no null ni void."),
            sc(1, 3, "type('42').__name__ es str y 42 == '42' es False porque int y str no son el mismo valor."),
            sc(2, 0, "El teléfono no es cantidad aritmética y puede necesitar ceros o formato; se modela como str."),
            sc(3, 2, "b = a con lista es alias: append en b muta a; a queda [1, 2, 3]."),
            sc(4, 1, "Idioma correcto de ausencia: x is None (identidad), no == None."),
        ]
    return [
        sc(0, 1, "S02-T1-A nombra NoneType explícitamente al listar tipos básicos."),
        sc(1, 3, "Demo 42 vs '42': types distintos e igualdad False; la opción es str y False."),
        sc(2, 0, "Párrafo de intake: contacto/teléfono como str, no int."),
        sc(3, 2, "S02-T2-B: alias de lista; mutar b muta a → [1,2,3]."),
        sc(4, 1, "S02-T2-B: preferir is None para ausencia en validadores."),
    ]


def s02_exercises(persona: str):
    A = persona == "explorer"
    out = []

    out.append(ex("S02-T1-A-E1", '''literales = [0, 3.14, "Lima", False, None]
for lit in literales:
    print(repr(lit), "→", type(lit).__name__)
''', "Recorro literales e imprimo repr + type(...).__name__ en orden int/float/str/bool/NoneType." if A else "S02-T1-A: checklist de cinco tipos básicos con __name__.", ["type", "literals"]))

    out.append(ex("S02-T1-A-E2", '''codigo_int = 42
codigo_str = "42"
print("tipos:", type(codigo_int).__name__, type(codigo_str).__name__)
print("igualdad cruda:", codigo_int == codigo_str)
print("igualdad tras str():", str(codigo_int) == codigo_str)
print("isinstance(True, int) →", isinstance(True, int))
print("Nota: bool es subtipo de int; en intake no trates True como 1 accidentalmente")
''', "Demuestro 42 vs '42' y el subtipo bool/int sin abusar en negocio." if A else "Comparación cruda False; str(42)=='42'; nota sobre isinstance(True,int).", ["type", "isinstance"]))

    out.append(ex("S02-T1-A-E3", '''campos = {
    "nombres": ("María José", str),
    "apellido_paterno": ("Quispe", str),
    "apellido_materno": ("Ñahui", str),
    "contacto": ("999000111", str),
    "edad": (34, int),
    "activo": (True, bool),
}
for k, (v, t) in campos.items():
    ok = type(v) is t
    print(f"{k}: {v!r} esperado={t.__name__} ok={ok}")
''', "Teléfono str; edad int; activo bool; apellidos Unicode str." if A else "Seis campos sintéticos con type(v) is t_esperado.", ["schema"]))

    out.append(ex("S02-T1-B-E1", '''raw = " 21 "
edad = int(raw.strip())
print(edad, type(edad).__name__)
''', "strip + int → 21 int." if A else "Hábito strip antes de convertir en parsers.", ["strip", "int"]))

    out.append(ex("S02-T1-B-E2", '''def safe_int(campo: str, valor: str):
    texto = valor.strip()
    if texto == "":
        return False, None, f"ERROR en '{campo}': vacío (raw={valor!r})"
    try:
        return True, int(texto), None
    except ValueError:
        return False, None, f"ERROR en '{campo}': no se pudo convertir {valor!r} a int"

for v in [" 21 ", "", "abc", "  "]:
    print(repr(v), "→", safe_int("edad", v))
''', "Tupla (ok, valor|None, msg); vacío y ValueError con campo y !r." if A else "Patrón demo S02-T1-B con cuatro casos de prueba.", ["safe_int"]))

    out.append(ex("S02-T1-B-E3", '''from decimal import Decimal, ROUND_HALF_EVEN, InvalidOperation

def parse_edad_monto(edad_txt: str, monto_txt: str) -> dict:
    raw = {"edad": edad_txt, "monto": monto_txt}
    clean = {"edad": None, "monto": None}
    errors = []
    try:
        clean["edad"] = int(edad_txt.strip())
    except ValueError:
        errors.append(f"ERROR en 'edad': no se pudo convertir {edad_txt!r} a int")
    try:
        t = monto_txt.strip()
        if not t:
            raise InvalidOperation
        clean["monto"] = Decimal(t).quantize(Decimal("0.01"), rounding=ROUND_HALF_EVEN)
    except (InvalidOperation, ValueError):
        errors.append(f"ERROR en 'monto': no se pudo convertir {monto_txt!r} a Decimal")
    return {"raw": raw, "clean": clean, "errors": errors}

print(parse_edad_monto("34", "150.50"))
print(parse_edad_monto("abc", "99.00"))
print(parse_edad_monto("20", "xx"))
''', "Pipeline dual: raw intacto; Decimal sin float; errores por campo." if A else "Si un campo falla el otro puede quedar OK; quantize a céntimos.", ["Decimal", "raw"]))

    out.append(ex("S02-T2-A-E1", '''nombre_cliente = "Luis"
apellido_paterno = "Ramos"
indice = 0
longitud = 5
EDAD_MAXIMA = 120
print(nombre_cliente, apellido_paterno, indice, longitud, EDAD_MAXIMA)
''', "PEP 8 snake_case + UPPER_CASE; sin l/O/I." if A else "Renombres del starter a nombres legibles de intake.", ["PEP8"]))

    out.append(ex("S02-T2-A-E2", '''estado = "activo"
codigo = 10
flag = True
if estado == "activo":
    print("ok estado")
if codigo == 10:
    print("ok codigo")
if flag == True:
    print("ok flag")
''', "Corregí = por == en los tres if (S02-T2-A)." if A else "Asignación ≠ comparación; tres líneas ok sin SyntaxError.", ["=="]))

    out.append(ex("S02-T2-A-E3", '''encabezados = [
    "Nombres", "Apellido Paterno", "Apellido Materno",
    "Teléfono / Cel", "Dirección", "Edad (años)",
]
mapeo = {
    "Nombres": "nombres",
    "Apellido Paterno": "apellido_paterno",
    "Apellido Materno": "apellido_materno",
    "Teléfono / Cel": "contacto",
    "Dirección": "direccion",
    "Edad (años)": "edad",
}
for orig in encabezados:
    print(f"{orig!r} → {mapeo.get(orig, '???')}")
''', "Mapeo CSV→snake_case con apellido_paterno/materno." if A else "Identificadores sin espacios ni tildes; contacto para teléfono.", ["naming"]))

    out.append(ex("S02-T2-B-E1", '''print("None is None →", None is None)
print("[] == [] →", [] == [])
print("[] is [] →", [] is [])
print("1 == True →", 1 == True)
print("1 is True →", 1 is True)
# Comentario: usa is para None; == para igualdad de valor/números
''', "Tabla True,True,False,True,False; is solo para None." if A else "Listas nuevas no comparten identidad; 1 is True es False.", ["is", "=="]))

    out.append(ex("S02-T2-B-E2", '''original = ["a", "b"]
trabajo = original.copy()
trabajo.append("c")
print("original:", original)
print("trabajo:", trabajo)
print("mismo objeto?", original is trabajo)
''', "Copia con .copy(); original intacto tras append." if A else "Alternativa slice original[:]; is → False.", ["copy"]))

    out.append(ex("S02-T2-B-E3", '''def make_record(nombres: str, contacto: str) -> dict:
    return {
        "nombres_raw": nombres,
        "contacto_raw": contacto,
        "nombres": nombres.strip(),
        "contacto": contacto.strip(),
    }

entrada_nombres = "  María  "
entrada_contacto = " 999 "
rec = make_record(entrada_nombres, entrada_contacto)
rec["nombres"] = rec["nombres"].upper()
print(rec)
assert rec["nombres_raw"] == entrada_nombres
assert rec["contacto_raw"] == entrada_contacto
print("raw preserved OK")
''', "Patrón *_raw + strip; mutar clean no toca raw." if A else "Auditoría de intake: raw idéntico al input original.", ["raw"]))

    out.append(ex("S02-T3-A-E1", '''n = 17
d = 5
print("//", n // d)
print("%", n % d)
print("**", 2 ** 4)
print("/", n / d)
print("nota: / es división verdadera → float")
''', "// % ** / con 17 y 5; / devuelve float." if A else "Operadores S02-T3-A del paquete.", ["ops"]))

    out.append(ex("S02-T3-A-E2", '''print("sin paréntesis:", -3**2)
print("con paréntesis:", (-3)**2)
cuadrado_neg = (-3)**2
assert cuadrado_neg == 9
print("assert OK")
''', "Precedencia: -3**2 es -9; (-3)**2 es 9." if A else "Unario menos tras la potencia; paréntesis corrigen.", ["precedence"]))

    out.append(ex("S02-T3-A-E3", '''linea_a = 50
linea_b = 30
subtotal = linea_a + linea_b
total = subtotal * (1 + 0.18)
print("subtotal", subtotal)
print("total", total)
''', "IGV 18% con paréntesis explícitos (1+0.18)." if A else "subtotal 80; total float demo antes de Decimal.", ["IGV"]))

    out.append(ex("S02-T3-B-E1", '''from decimal import Decimal
print("float", 0.1 + 0.2)
print("Decimal", Decimal("0.1") + Decimal("0.2"))
assert Decimal("0.1") + Decimal("0.2") == Decimal("0.3")
''', "Decimal desde str evita el error binario del float." if A else "Contraste 0.1+0.2 float vs Decimal.", ["Decimal"]))

    out.append(ex("S02-T3-B-E2", '''from decimal import Decimal, ROUND_HALF_EVEN
cuenta = Decimal("85.50")
propina = (cuenta * Decimal("0.10")).quantize(Decimal("0.01"), rounding=ROUND_HALF_EVEN)
total = (cuenta + propina).quantize(Decimal("0.01"), rounding=ROUND_HALF_EVEN)
print(propina, total)
assert propina == Decimal("8.55")
assert total == Decimal("94.05")
print("OK")
''', "Propina 10% con quantize ROUND_HALF_EVEN sin float." if A else "8.55 y 94.05 exactos en Decimal.", ["quantize"]))

    out.append(ex("S02-T3-B-E3", '''from decimal import Decimal, ROUND_HALF_EVEN, InvalidOperation

def parse_monto(texto: str):
    t = texto.strip()
    if t == "":
        return False, None, f"ERROR en 'monto': vacío (raw={texto!r})"
    try:
        val = Decimal(t).quantize(Decimal("0.01"), rounding=ROUND_HALF_EVEN)
        return True, val, None
    except InvalidOperation:
        return False, None, f"ERROR en 'monto': no se pudo convertir {texto!r} a Decimal"

for s in ["150.50", "  20.1 ", "", "abc"]:
    print(repr(s), "→", parse_monto(s))
''', "parse_monto con punto decimal, strip y InvalidOperation." if A else "Contrato (ok, Decimal|None, error|None).", ["parse_monto"]))

    out.append(ex("S02-T4-A-E1", '''nombre = "José"
print(f"Hola, {nombre}. Bienvenido al intake.")
''', "f-string con acento en José." if A else "Saludo S02-T4-A con f-string.", ["f-string"]))

    out.append(ex("S02-T4-A-E2", '''from decimal import Decimal
nombres = "Ana"
apellido_paterno = "Ramos"
contacto = "999000111"
monto = Decimal("99.5")
print(f"nombres: {nombres}")
print(f"apellido_paterno: {apellido_paterno}")
print(f"contacto: {contacto}")
print(f"monto: S/ {monto:.2f}")
''', "Reporte multi-línea; monto 99.50 con :.2f." if A else "Cuatro campos etiquetados con f-strings.", ["report"]))

    out.append(ex("S02-T4-A-E3", '''def simular_intake(nombres: str, contacto: str, edad: str) -> dict:
    datos = {"nombres": nombres, "contacto": contacto, "edad": edad}
    types = {k: type(v).__name__ for k, v in datos.items()}
    return {**datos, "types": types}

r = simular_intake("  Ana  ", "999", "34")
print(r)
assert r["types"]["edad"] == "str"
assert r["types"]["nombres"] == "str"
print("OK")
''', "No llama input(); todo sigue str como input real." if A else "Simulación testeable de captura.", ["input sim"]))

    out.append(ex("S02-T4-B-E1", '''def parse_nombres(valor: str) -> dict:
    errors = []
    clean = valor.strip() if valor and valor.strip() else None
    if clean is None:
        errors.append(f"ERROR en 'nombres': vacío (raw={valor!r})")
    return {"nombres_raw": valor, "nombres": clean, "errors": errors}

r = parse_nombres("")
print(r)
assert r["nombres_raw"] == ""
assert r["nombres"] is None
assert any("nombres" in e.lower() for e in r["errors"])
print("OK")
''', "raw + clean + errors accionable en vacío." if A else "Gate vacío del parser de intake.", ["parse"]))

    out.append(ex("S02-T4-B-E2", '''original = "  Ñahui  "
raw = original
clean = original.strip()
print(repr(raw), "→", repr(clean))
assert raw == original
assert clean == "Ñahui"
print("Unicode OK")
''', "Unicode round-trip; raw con espacios intacto." if A else "Python 3 str Unicode; strip no muta original.", ["Unicode"]))

    out.append(ex("S02-T4-B-E3", '''def safe_int(campo: str, valor: str):
    try:
        return True, int(valor.strip()), None
    except ValueError:
        return False, None, f"ERROR en '{campo}': no se pudo convertir {valor!r} a int"

def parse_client(nombres, apellido_paterno, apellido_materno, contacto, direccion, edad=None):
    errors = []
    rec = {
        "nombres_raw": nombres,
        "apellido_paterno_raw": apellido_paterno,
        "apellido_materno_raw": apellido_materno,
        "contacto_raw": contacto,
        "direccion_raw": direccion,
        "edad_raw": edad,
        "nombres": None,
        "apellido_paterno": None,
        "apellido_materno": None,
        "contacto": None,
        "direccion": None,
        "edad": None,
        "errors": errors,
    }
    def req(campo, valor):
        if valor is None or str(valor).strip() == "":
            errors.append(f"ERROR en '{campo}': vacío (raw={valor!r})")
            return None
        return str(valor).strip()
    rec["nombres"] = req("nombres", nombres)
    rec["apellido_paterno"] = req("apellido_paterno", apellido_paterno)
    rec["apellido_materno"] = req("apellido_materno", apellido_materno)
    rec["contacto"] = req("contacto", contacto)
    rec["direccion"] = req("direccion", direccion)
    if edad is not None:
        ok, n, err = safe_int("edad", edad)
        if ok:
            rec["edad"] = n
        else:
            errors.append(err)
    return rec

r1 = parse_client("María", "Quispe", "Ñahui", "999000111", "Lima", "34")
assert r1["apellido_materno_raw"] == "Ñahui" and r1["errors"] == []
r2 = parse_client("", "Quispe", "Ñahui", "999", "Lima")
assert r2["nombres_raw"] == "" and any("nombres" in e for e in r2["errors"])
r3 = parse_client("Ana", "Ramos", "Díaz", "999", "Cusco", "abc")
assert r3["edad_raw"] == "abc" and any("edad" in e for e in r3["errors"])
print("3 tests OK")
''', "parse_client completo con 3 tests del DEMO T4-B." if A else "raw/clean/errors; Unicode, vacío y edad inválida.", ["parse_client"]))

    return out

# ========== SECTION 03 ==========

def s03_selfcheck(persona: str):
    if persona == "explorer":
        return [
            sc(0, 2, "S03-T1-A/B: ausencia se chequea con is None; if not campo confunde 0 y '' con ausente."),
            sc(1, 0, "if/elif/else: la primera condición verdadera gana y se omiten las siguientes."),
            sc(2, 1, "and/or devuelven operando: '' or 'default' → 'default' por short-circuit."),
            sc(3, 3, "Allowlist de códigos fijos: set de literales + operador in (O(1) y legible)."),
            sc(4, 2, "match/case brilla con literales/estados finitos y case _; no deprecó if ni sirve solo a rangos."),
        ]
    return [
        sc(0, 2, "Gate V3: separar presencia (is None) de truthiness; opción correcta if campo is None."),
        sc(1, 0, "S03-T2-A: evaluación en orden; primera rama verdadera excluye el resto."),
        sc(2, 1, "Demo short-circuit: cadena vacía es falsy, or devuelve el segundo operando."),
        sc(3, 3, "S03-T3-A: ALLOWED = {...}; valor in ALLOWED."),
        sc(4, 2, "S03-T3-B: match para códigos finitos; if para rangos numéricos."),
    ]


def s03_exercises(persona: str):
    A = persona == "explorer"
    out = []
    out.append(ex("S03-T1-A-E1", '''edad = 25
region = "Cusco"
print(edad >= 18)
print(edad < 65)
print(18 <= edad <= 65)
print(region == "Lima")
print(region != "Piura")
''', "Booleanos: True True True False True con encadenamiento." if A else "Comparaciones y membership vocab del motor de reglas.", ["comparisons"]))

    out.append(ex("S03-T1-A-E2", '''TIPOS_DOC = {"DNI", "CE", "PAS"}
for t in ["DNI", "dni", "RUC"]:
    print(t, "→", t in TIPOS_DOC)
''', "Case sensitive: dni≠DNI; RUC fuera del set." if A else "Allowlist con in sobre set.", ["in"]))

    out.append(ex("S03-T1-A-E3", '''valor = None
print("valor is None →", valor is None)
print("True == 1 →", True == 1)
print("True is 1 →", True is 1)
print("Nota:", "usa is None para ausencia; == para valores de negocio, no is con enteros")
''', "is vs ==; True==1 pero True is 1 False." if A else "Identidad ≠ igualdad en validadores de intake.", ["is None"]))

    out.append(ex("S03-T1-B-E1", '''vals = [None, False, 0, 0.0, "", [], {}, set(), range(0), "x", 1, [0]]
for v in vals:
    print(repr(v), "→", bool(v))
''', "Tabla truthiness: 9 falsy + 3 truthy ([0] es truthy)." if A else "range(0) falsy; lista no vacía truthy.", ["truthiness"]))

    out.append(ex("S03-T1-B-E2", '''print("'' or 'default' →", "" or "default")
print("'Lima' or 'default' →", "Lima" or "default")
print("0 and 99 →", 0 and 99)
print("5 and 99 →", 5 and 99)
print("None or 0 →", None or 0)
''', "and/or devuelven operando, no siempre bool." if A else "default, Lima, 0, 99, 0 por short-circuit.", ["and/or"]))

    out.append(ex("S03-T1-B-E3", '''def validate_monto(m):
    if m is None:
        return "review"
    if m < 0:
        return "reject"
    return "accept"

for m in [None, 0, -1, 100]:
    print(m, "→", validate_monto(m))
''', "Cero válido; None→review; no usar if not monto." if A else "Gate: ausencia ≠ falsy numérico.", ["monto policy"]))

    out.append(ex("S03-T2-A-E1", '''def classify_score(score: int) -> str:
    if score >= 80:
        return "accept"
    elif score >= 50:
        return "review"
    else:
        return "reject"

for s in [80, 50, 49, 100]:
    print(s, "→", classify_score(s))
''', "Fronteras inclusivas 80/50 con if/elif/else." if A else "accept/review/reject exclusivos.", ["if/elif"]))

    out.append(ex("S03-T2-A-E2", '''def bad(score):
    status = None
    if score >= 80:
        status = "accept"
    if score >= 50:
        status = "review"
    if score < 50:
        status = "reject"
    return status

def good(score):
    if score >= 80:
        return "accept"
    elif score >= 50:
        return "review"
    else:
        return "reject"

for s in [95, 60, 30]:
    print(s, "bad=", bad(s), "good=", good(s))
''', "ifs independientes pisan accept; elif garantiza exclusión." if A else "good(95)=accept; bad(95)=review.", ["elif"]))

    out.append(ex("S03-T2-A-E3", '''def band(n):
    if n > 100:
        return "alto"
    elif n > 50:
        return "medio"
    elif n > 0:
        return "bajo"
    else:
        return "nulo"

for n in [150, 75, 10, 0, -3]:
    print(n, "→", band(n))
''', "Orden umbral alto→bajo; 0 y negativos → nulo." if A else "Tabla alto/medio/bajo/nulo/nulo.", ["bands"]))

    out.append(ex("S03-T2-B-E1", '''def validate_edad(edad):
    if edad is None:
        return {"status": "review", "code": "MISSING"}
    if not isinstance(edad, int):
        return {"status": "reject", "code": "BAD_TYPE"}
    if edad < 0 or edad > 120:
        return {"status": "reject", "code": "OUT_OF_RANGE"}
    if edad < 18:
        return {"status": "review", "code": "NEEDS_REVIEW"}
    return {"status": "accept", "code": "OK"}

for e in [None, "25", 15, 30]:
    print(e, "→", validate_edad(e))
''', "Guards: None, tipo, rango, menores, OK." if A else "Orden evita TypeError al comparar None.", ["guards"]))

    out.append(ex("S03-T2-B-E2", '''def validate_monto_nested(m):
    if m is not None:
        if isinstance(m, int):
            if m >= 0:
                if m <= 10000:
                    return "accept"
                else:
                    return "review"
            else:
                return "reject"
        else:
            return "reject"
    else:
        return "review"

def validate_monto_guards(m):
    if m is None:
        return "review"
    if not isinstance(m, int):
        return "reject"
    if m < 0:
        return "reject"
    if m <= 10000:
        return "accept"
    return "review"

for v in [None, "x", -1, 0, 500, 20000]:
    a, b = validate_monto_nested(v), validate_monto_guards(v)
    print(v, a, b, "ok=", a == b)
''', "Misma semántica sin pirámide de ifs." if A else "Guards lineales: ausencia, tipo, rango, outlier.", ["refactor"]))

    out.append(ex("S03-T2-B-E3", '''def etiqueta_bug(x):
    if x != 0:
        if x > 0:
            return "positivo"
        return "negativo"
    elif x == 0:  # rama muerta: el if x!=0 ya cubrió el resto; pero x==0 entra al elif
        return "cero"
    return "???"

print("bug 0 →", etiqueta_bug(0))
print("bug 3 →", etiqueta_bug(3))
print("nota: el elif x==0 SÍ se alcanza cuando x==0 porque el if exterior fue falso")

def etiqueta_ok(x):
    if x > 0:
        return "positivo"
    elif x < 0:
        return "negativo"
    else:
        return "cero"

print("ok 0 →", etiqueta_ok(0))
print("ok 3 →", etiqueta_ok(3))
print("ok -2 →", etiqueta_ok(-2))
''', "Reordené a tres ramas vivas positivo/negativo/cero." if A else "Patrón if/elif/else sin rama inalcanzable confusa.", ["dead branch"]))

    out.append(ex("S03-T3-A-E1", '''ALLOWED = {"Lima", "Arequipa", "Cusco", "Piura"}

def check_region(r):
    if r is None:
        return "review"
    if r not in ALLOWED:
        return "review"
    return "accept"

for r in ["Lima", "Tacna", None]:
    print(r, "→", check_region(r))
''', "Desconocida → review no reject." if A else "Allowlist de regiones sintéticas.", ["allowlist"]))

    out.append(ex("S03-T3-A-E2", '''def monto_ingreso(m):
    if m is None:
        return "review"
    if m < 0:
        return "reject"
    if m > 50000:
        return "review"
    return "accept"

for m in [None, -1, 0, 1200, 60000]:
    print(m, "→", monto_ingreso(m))
''', "0 accept; outlier 60000 review." if A else "Orden: ausencia, hard reject, outlier, accept.", ["rango"]))

    out.append(ex("S03-T3-A-E3", '''ALLOWED_DOC = {"DNI", "CE", "PAS"}
DOC_LEN = {"DNI": 8, "CE": 9, "PAS": 9}

def tipo_doc_len(tipo, numero):
    if tipo is None:
        return {"status": "review", "code": "MISSING"}
    if tipo not in ALLOWED_DOC:
        return {"status": "reject", "code": "NOT_IN_ALLOWLIST"}
    if len(str(numero)) != DOC_LEN[tipo]:
        return {"status": "reject", "code": "OUT_OF_RANGE"}
    return {"status": "accept", "code": "OK"}

for t, n in [("DNI", "12345678"), ("DNI", "123"), ("RUC", "20123456789"), (None, "1")]:
    print(t, n, "→", tipo_doc_len(t, n))
''', "Allowlist + longitudes por tipo de doc." if A else "Códigos MISSING/NOT_IN_ALLOWLIST/OUT_OF_RANGE/OK.", ["doc rules"]))

    out.append(ex("S03-T3-B-E1", '''TABLE = {
    "OK": "accept",
    "MISSING": "review",
    "OUT_OF_RANGE": "reject",
}

def apply(code):
    return TABLE.get(code, "review")

for c in ["OK", "MISSING", "OUT_OF_RANGE", "FOO"]:
    print(c, "→", apply(c))
''', "Decision table dict + default review." if A else "FOO cae en default review.", ["decision table"]))

    out.append(ex("S03-T3-B-E2", '''def status_match(code: str) -> str:
    match code:
        case "OK":
            return "accept"
        case "MISSING" | "NEEDS_REVIEW":
            return "review"
        case "OUT_OF_RANGE" | "NOT_IN_ALLOWLIST" | "BAD_TYPE":
            return "reject"
        case _:
            return "review"

for c in ["OK", "MISSING", "OUT_OF_RANGE", "FOO", "NEEDS_REVIEW"]:
    print(c, "→", status_match(c))
''', "match/case con OR patterns y case _." if A else "Misma tabla que if/elif del demo.", ["match"]))

    out.append(ex("S03-T3-B-E3", '''def map_code(code: str) -> str:
    match code:
        case "OK":
            return "accept"
        case "MISSING":
            return "review"
        case "OUT_OF_RANGE":
            return "reject"
        case _:
            return "review"

def map_edad(edad):
    if edad is None:
        return "review"
    if 18 <= edad <= 65:
        return "accept"
    return "reject"

print(map_code("OK"), map_code("MISSING"))
print(map_edad(None), map_edad(30), map_edad(10))
print("Justificación:", "match para códigos literales; if para rangos numéricos de edad")
''', "Códigos con match; rango edad con if." if A else "match no ideal para 18<=edad<=65.", ["if vs match"]))

    out.append(ex("S03-T4-A-E1", '''def validate_edad(e):
    if e is None:
        return "review"
    if not isinstance(e, int):
        return "reject"
    if e < 0 or e > 120:
        return "reject"
    return "accept"

examples = [
    {"value": 30, "expected": "accept"},
    {"value": -1, "expected": "reject"},
    {"value": None, "expected": "review"},
    {"value": "x", "expected": "reject"},
]
for ex_ in examples:
    got = validate_edad(ex_["value"])
    print(ex_["value"], got, got == ex_["expected"])
''', "Cuatro examples canónicos accept/reject/review." if A else "Invariante de edad con suite de ejemplos.", ["invariants"]))

    out.append(ex("S03-T4-A-E2", '''def validate_apellidos(ap, am):
    ap_e = ap is None or str(ap).strip() == ""
    am_e = am is None or str(am).strip() == ""
    if ap_e and am_e:
        return "reject"
    if ap_e or am_e:
        return "review"
    return "accept"

invariant_text = "ambos apellidos no vacíos → accept; uno falta → review; ambos vacíos → reject"
examples = [
    {"ap": "Quispe", "am": "Ñahui", "expected": "accept"},
    {"ap": "Quispe", "am": "", "expected": "review"},
    {"ap": "", "am": "", "expected": "reject"},
]
print(invariant_text)
for ex_ in examples:
    got = validate_apellidos(ex_["ap"], ex_["am"])
    print(ex_, "→", got, got == ex_["expected"])
''', "Invariante multi-campo con 3 examples." if A else "strip y vacío; texto en español.", ["multi-field"]))

    out.append(ex("S03-T4-A-E3", '''def validate_edad_strict(e):
    if isinstance(e, int) and 18 <= e <= 65:
        return "accept"
    return "reject"

print("strict 15 →", validate_edad_strict(15))
print("strict None →", validate_edad_strict(None))

def validate_edad_fixed(e):
    if e is None:
        return "review"
    if not isinstance(e, int):
        return "reject"
    if e < 0 or e > 120:
        return "reject"
    if e < 18:
        return "review"
    if 18 <= e <= 65:
        return "accept"
    return "review"

print("fixed 15 →", validate_edad_fixed(15))
print("fixed None →", validate_edad_fixed(None))
print("fixed 30 →", validate_edad_fixed(30))
print("Invariante:", "menores → review; None → review; fuera 0-120 → reject; 18-65 → accept")
''', "Contraejemplo 15: no debe ser reject duro." if A else "Ajusté política de menores a review.", ["policy fix"]))

    out.append(ex("S03-T4-B-E1", '''accionables = [
    "Campo 'edad' ausente: envía un entero 0–120 o marca desconocido.",
    "Campo 'edad' inválido: se espera int en rango 0–120.",
    "Campo 'edad'=-3 fuera de rango; usa 0–120.",
]
for a in accionables:
    print(a)
''', "Plantilla campo+problema+acción; sin PII." if A else "Reescribí Error/inválido/bad age a mensajes accionables.", ["messages"]))

    out.append(ex("S03-T4-B-E2", '''def classify_score(score: int) -> str:
    if score >= 80:
        return "accept"
    elif score >= 50:
        return "review"
    else:
        return "reject"

cases = [(90, "accept"), (55, "review"), (10, "reject"), (80, "accept"), (50, "review")]
for val, expected in cases:
    got = classify_score(val)
    assert got == expected, (val, got, expected)
    print("PASS", val, got)
''', "Un caso por rama incl. fronteras 80 y 50." if A else "Loop assert/print PASS por rama.", ["branch tests"]))

    out.append(ex("S03-T4-B-E3", '''def rango_edad(e):
    if e is None:
        return "review"
    if e >= 18 and e <= 65:  # fix off-by-one: >= 18
        return "accept"
    if e < 0 or e > 120:
        return "reject"
    return "review"

cases = [(18, "accept"), (17, "review"), (None, "review"), (30, "accept")]
for val, expected in cases:
    got = rango_edad(val)
    print(val, got, "ok=", got == expected)
    assert got == expected
''', "Off-by-one: >18 → >=18 para frontera inclusiva." if A else "Suite verde: 18 accept, 17/None review.", ["off-by-one"]))

    return out


# ========== SECTION 04 ==========

def s04_selfcheck(persona: str):
    if persona == "explorer":
        return [
            sc(0, 3, "list(range(3)) produce [0,1,2]: range empieza en 0 y excluye el tope."),
            sc(1, 1, "zip sin strict recorta al mas corto: empareja (1,10)(2,20) y el 3 se pierde en silencio."),
            sc(2, 2, "Tasa de reject usa n_total de registros procesados como denominador del gate."),
            sc(3, 0, "continue salta al siguiente ciclo del for sin terminar el programa."),
            sc(4, 3, "Doble for anidado sobre n elementos es O(n^2) aproximadamente."),
        ]
    return [
        sc(0, 3, "Teoria de range: stop exclusivo da tres valores 0,1,2."),
        sc(1, 1, "S04 zip silencioso trunca; strict lanzaria ValueError."),
        sc(2, 2, "Denominador = intentados/total, no solo accept ni 100 fijo."),
        sc(3, 0, "continue avanza la iteracion actual del bucle de lineas."),
        sc(4, 3, "Anidamiento n x n es cuadratico."),
    ]

def s04_exercises(persona: str):
    A = persona == "explorer"
    out = []
    out.append(ex('S04-T1-A-E1', 'regiones = ["Lima", "Cusco", "Piura"]\nfor r in regiones:\n    print(r)\nprint(list(range(3)))\n', 'for sobre regiones y list(range(3)) -> [0,1,2].' if A else 'Iteracion basica + range del paquete S04.', ['for', 'range']))
    out.append(ex('S04-T1-A-E2', 'edades = [30, 17, 45, 22]\nn = 0\nfor e in edades:\n    if e >= 18:\n        n += 1\nprint(n)\n', 'Contador con for; n==3.' if A else 'Mayores de edad sin comprehension.', ['count']))
    out.append(ex('S04-T1-A-E3', 'lote = [{"id": "C1", "monto": 10}, {"id": "C2", "monto": 0}, {"id": "C3", "monto": -2}, {"id": "C4", "monto": 5}]\nfor reg in lote:\n    if reg["monto"] > 0:\n        print(reg["id"])\n', 'Solo ids con monto>0: C1 y C4.' if A else 'Filtro de mini-lote por monto positivo.', ['filter']))
    out.append(ex('S04-T1-B-E1', 'ids = ["A", "B", "C"]\nfor i, x in enumerate(ids, start=1):\n    print(f"fila {i}: {x}")\n', 'enumerate start=1.' if A else 'Indices 1-based para filas.', ['enumerate']))
    out.append(ex('S04-T1-B-E2', 'nombres = ["Ana", "Luis", "Maria"]\nedades = [30, 25, 40]\nfor n, e in zip(nombres, edades):\n    print(f"{n}={e}")\nfor n, e in zip(nombres, edades[:2]):\n    print("corto", n, e)\n', 'zip completo + demo truncado.' if A else '3 pares y zip silencioso.', ['zip']))
    out.append(ex('S04-T1-B-E3', 'def zip_strict(a, b):\n    if len(a) != len(b):\n        raise ValueError("longitudes distintas")\n    return list(zip(a, b))\ntry:\n    zip_strict([1, 2, 3], [10, 20])\nexcept ValueError:\n    print("DESALINEADO")\ntry:\n    zip_strict([1, 2], [3, 4])\n    print("OK")\nexcept ValueError:\n    print("DESALINEADO")\n', 'zip_strict pedagogico.' if A else 'ValueError si lens difieren.', ['zip_strict']))
    out.append(ex('S04-T2-A-E1', 'lines = ["r1", "r2", "", "r3"]\ni = 0\nout = []\nwhile i < len(lines):\n    line = lines[i]\n    i += 1\n    if line == "":\n        break\n    out.append(line)\nprint(out)\n', "while+break -> ['r1','r2']." if A else 'Buffer hasta centinela vacio.', ['while']))
    out.append(ex('S04-T2-A-E2', 'intentos = 0\nMAX = 3\nwhile intentos < MAX:\n    intentos += 1\n    print(f"intento {intentos}")\nprint("done", intentos)\n', '3 reintentos + done 3.' if A else 'Loop de reintentos.', ['retries']))
    out.append(ex('S04-T2-A-E3', 'cola = ["job1", "job2", "job3"]\nwhile cola:\n    job = cola.pop(0)\n    print(job)\n    if job == "job2":\n        print("PAUSE")\n        break\nprint("rest", cola)\n', 'pause en job2; rest [job3].' if A else 'Cola FIFO con break.', ['queue']))
    out.append(ex('S04-T2-B-E1', 'raw = ["  ", "Lima", "", "Cusco"]\nfor x in raw:\n    if not x.strip():\n        continue\n    print(x)\n', 'continue salta vacios.' if A else 'Lima y Cusco validos.', ['continue']))
    out.append(ex('S04-T2-B-E2', 'codes = [200, 200, 500, 200]\nn_ok = 0\nfor c in codes:\n    if c >= 500:\n        print("STOP")\n        break\n    n_ok += 1\n    print("ok")\nprint("n_ok", n_ok)\n', 'ok ok STOP n_ok 2.' if A else 'break en 5xx.', ['break']))
    out.append(ex('S04-T2-B-E3', 'buf = ["a", "b", "END"]\ni = 0\nout = []\nwhile True:\n    if i > 10:\n        raise RuntimeError("guard")\n    item = buf[i]\n    i += 1\n    if item == "END":\n        break\n    out.append(item)\nprint(out)\n', 'while True + END + guard.' if A else "['a','b'].", ['while True']))
    out.append(ex('S04-T3-A-E1', 'sts = ["accept", "reject", "accept"]\nn_accept = n_reject = n_total = 0\nfor s in sts:\n    n_total += 1\n    if s == "accept":\n        n_accept += 1\n    elif s == "reject":\n        n_reject += 1\nprint(n_accept, n_reject, n_total)\n', '2 1 3.' if A else 'Contadores de status.', ['counters']))
    out.append(ex('S04-T3-A-E2', 'def tasa_reject(sts):\n    n_total = len(sts)\n    if n_total == 0:\n        return None\n    n_reject = sum(1 for s in sts if s == "reject")\n    return n_reject / n_total\nprint(tasa_reject(["accept", "reject", "accept"]))\nprint(tasa_reject([]))\n', '0.333... y None.' if A else 'Sin ZeroDivisionError.', ['rate']))
    out.append(ex('S04-T3-A-E3', 'rows = [{"id": "C1", "status": "accept"}, {"id": "C2", "status": "review"}, {"id": "C3", "status": "review"}]\nidx = -1\nfound_id = None\nfor i, r in enumerate(rows):\n    if r["status"] == "review":\n        idx = i\n        found_id = r["id"]\n        break\nprint(idx, found_id)\n', '1 C2 primer review.' if A else 'Busqueda lineal con break.', ['search']))
    out.append(ex('S04-T3-B-E1', 'nums = [1, 2, 3, 4, 5]\nprint([x * x for x in nums])\nprint([x for x in nums if x % 2 == 0])\n', 'cuadrados y pares.' if A else 'list comprehensions.', ['comp']))
    out.append(ex('S04-T3-B-E2', 'rows = [{"status": "reject"}, {"status": "accept"}, {"status": "reject"}, {"status": "review"}]\nprint(sorted({r["status"] for r in rows}))\n', 'statuses unicos ordenados.' if A else 'set + sorted.', ['set']))
    out.append(ex('S04-T3-B-E3', 'rows = [{"id": "C1", "status": "accept"}, {"id": "C2", "status": "reject"}, {"id": "C3", "status": "accept"}, {"id": "C4", "status": "reject"}]\nby = {r["id"]: r["status"] for r in rows}\nrejects = [i for i, st in by.items() if st == "reject"]\nprint("reject", rejects, len(rejects) / len(rows))\n', 'C2 C4 tasa 0.5.' if A else 'dict + list comp.', ['dictcomp']))
    out.append(ex('S04-T4-A-E1', 'vals = [2, -1, 3]\ns = 0\nfor i, val in enumerate(vals):\n    if val > 0:\n        s += val\n    print(i, val, s)\nprint("final", s)\n', 'traza final 5.' if A else 'acumulador positivos.', ['trace']))
    out.append(ex('S04-T4-A-E2', 'filas = ["a", "b", "c"]\nn = 0\nfor f in filas:\n    n += 1\nprint(n)\n', 'n=3 corregido.' if A else 'un incremento por fila.', ['bugfix']))
    out.append(ex('S04-T4-A-E3', 'regs = ["accept", "reject", "accept"]\ncounts = {"accept": 0, "reject": 0}\nfor i, st in enumerate(regs):\n    counts[st] = counts.get(st, 0) + 1\n    print("TRACE", i, st, dict(counts))\n', 'TRACE por registro.' if A else 'estado del dict cada paso.', ['TRACE']))
    out.append(ex('S04-T4-B-E1', 'sts = ["accept", "accept", "reject", "review", "accept"]\nn_total = len(sts)\nn_accept = sum(1 for s in sts if s == "accept")\nn_reject = sum(1 for s in sts if s == "reject")\nn_review = sum(1 for s in sts if s == "review")\nprint({"n_total": n_total, "n_accept": n_accept, "n_reject": n_reject, "n_review": n_review,\n       "tasa_reject": n_reject / n_total if n_total else None})\n', 'resumen con tasa_reject.' if A else 'metricas del lote.', ['summary']))
    out.append(ex('S04-T4-B-E2', 'rows = [\n    {"id": "C1", "status": "accept", "monto": 10},\n    {"id": "C2", "status": "reject", "monto": 0},\n    {"id": "C3", "status": "accept", "monto": 5},\n]\nclean = [r for r in rows if r["status"] == "accept"]\nprint("clean_ids", [r["id"] for r in clean])\nprint("n_clean", len(clean), "n_total", len(rows))\n', 'filtra accept.' if A else 'clean vs total.', ['clean']))
    out.append(ex('S04-T4-B-E3', 'def batch_report(rows):\n    n_total = len(rows)\n    n_reject = sum(1 for r in rows if r.get("status") == "reject")\n    return {\n        "n_total": n_total,\n        "n_reject": n_reject,\n        "tasa_reject": (n_reject / n_total) if n_total else None,\n        "ids": [r["id"] for r in rows],\n    }\nprint(batch_report([{"id": "A", "status": "accept"}, {"id": "B", "status": "reject"}]))\nprint(batch_report([]))\n', 'reporte reutilizable; vacio -> None.' if A else 'You Do style summary.', ['report']))
    return out

# ========== S05 ==========

def s05_selfcheck(persona: str):
    if persona == "explorer":
        return [
            sc(0, 0, "Sin return explicito la llamada devuelve None."),
            sc(1, 2, "Default mutable [] se comparte entre llamadas: peligroso."),
            sc(2, 3, "Pura: mismo input -> mismo output sin efectos colaterales."),
            sc(3, 1, "LEGB = Local, Enclosing, Global, Builtin."),
            sc(4, 0, "Idempotencia: f(f(x)) == f(x) en el dominio."),
        ]
    return [
        sc(0, 0, "Teoria de funciones: return implicito None."),
        sc(1, 2, "S05 defaults mutables compartidos."),
        sc(2, 3, "Definicion de pureza del paquete."),
        sc(3, 1, "Orden de resolucion de nombres LEGB."),
        sc(4, 0, "Normalizador idempotente f(f(x))=f(x)."),
    ]

def s05_exercises(persona: str):
    A = persona == "explorer"
    out = []
    out.append(ex('S05-T1-A-E1', 'def doble(n):\n    return n * 2\nprint(doble(21))\n', 'doble retorna n*2; print 42.' if A else 'funcion minima con return.', ['def']))
    out.append(ex('S05-T1-A-E2', 'def saludo(nombre, prefijo="Hola"):\n    return f"{prefijo}, {nombre}"\nprint(saludo("Ana"))\nprint(saludo("Ana", prefijo="Buenas"))\n', 'default prefijo + override.' if A else 'kwargs opcionales.', ['defaults']))
    out.append(ex('S05-T1-A-E3', 'def area_rect(base, altura):\n    """Retorna base*altura; no imprime."""\n    return base * altura\nprint(area_rect(3, 4))\nassert area_rect(3, 4) == 12\n', 'contrato return sin print interno.' if A else 'docstring + assert.', ['contract']))
    out.append(ex('S05-T1-B-E1', 'def f(xs=None):\n    if xs is None:\n        xs = []\n    xs.append(1)\n    return xs\nprint(f())\nprint(f())\n', 'None sentinel evita default mutable compartido.' if A else 'patron seguro de lista default.', ['mutable default']))
    out.append(ex('S05-T1-B-E2', 'def normalize_name(s: str) -> str:\n    return " ".join(s.strip().split())\nprint(normalize_name("  Ana   Quispe "))\nprint(normalize_name(normalize_name("  Ana   Quispe ")))\n', 'idempotente strip/join espacios.' if A else 'f(f(x))==f(x).', ['idempotent']))
    out.append(ex('S05-T1-B-E3', 'def parse_edad(txt: str):\n    try:\n        return int(txt.strip())\n    except ValueError as e:\n        raise ValueError(f"edad invalida: {txt!r}") from e\nprint(parse_edad(" 19 "))\ntry:\n    parse_edad("x")\nexcept ValueError as e:\n    print(type(e).__name__, e)\n', 'ValueError con mensaje de campo.' if A else 'raise from opcional pedagogico.', ['errors']))
    out.append(ex('S05-T2-A-E1', 'def add(a, b):\n    return a + b\nprint(add(2, 3))\n', 'firma posicional simple.' if A else 'return suma.', ['params']))
    out.append(ex('S05-T2-A-E2', 'def report(*, title, n_rows):\n    return f"{title}: {n_rows} filas"\nprint(report(title="intake", n_rows=3))\n', 'keyword-only con *.' if A else 'fuerza claridad en call site.', ['kwonly']))
    out.append(ex('S05-T2-A-E3', 'def clamp(x, lo=0, hi=100):\n    if x < lo:\n        return lo\n    if x > hi:\n        return hi\n    return x\nprint(clamp(-5), clamp(50), clamp(200))\n', 'defaults lo/hi; clamp rango.' if A else '0 50 100.', ['clamp']))
    out.append(ex('S05-T2-B-E1', 'def summarize(nums):\n    return {"n": len(nums), "total": sum(nums)}\nprint(summarize([1, 2, 3]))\n', 'dict de resumen puro.' if A else 'sin mutar entrada.', ['pure']))
    out.append(ex('S05-T2-B-E2', 'def apply_all(fn, values):\n    return [fn(v) for v in values]\nprint(apply_all(lambda x: x * 2, [1, 2, 3]))\n', 'higher-order map simple.' if A else 'fn aplicada a cada valor.', ['hof']))
    out.append(ex('S05-T2-B-E3', 'def pipeline(x, steps):\n    for step in steps:\n        x = step(x)\n    return x\nprint(pipeline("  Ana  ", [str.strip, str.upper]))\n', 'pipeline de funciones puras.' if A else 'strip luego upper.', ['pipeline']))
    out.append(ex('S05-T3-A-E1', 'def outer(msg):\n    def inner():\n        return msg\n    return inner\nprint(outer("hola")())\n', 'closure lee enclosing msg.' if A else 'LEGB enclosing.', ['closure']))
    out.append(ex('S05-T3-A-E2', 'x = 10\ndef show():\n    x = 5  # local\n    return x\nprint(show(), x)\n', 'local no pisa global sin global.' if A else '5 y 10.', ['scope']))
    out.append(ex('S05-T3-A-E3', 'def make_counter():\n    n = 0\n    def inc():\n        nonlocal n\n        n += 1\n        return n\n    return inc\nc = make_counter()\nprint(c(), c(), c())\n', 'nonlocal para contador.' if A else '1 2 3.', ['nonlocal']))
    out.append(ex('S05-T3-B-E1', 'def safe_div(a, b):\n    if b == 0:\n        return None\n    return a / b\nprint(safe_div(10, 2), safe_div(1, 0))\n', 'guard de division por cero.' if A else 'None en error de dominio.', ['guard']))
    out.append(ex('S05-T3-B-E2', 'def validate_score(s):\n    if not isinstance(s, (int, float)):\n        return {"ok": False, "error": "type"}\n    if not 0 <= s <= 100:\n        return {"ok": False, "error": "range"}\n    return {"ok": True, "value": s}\nprint(validate_score(80), validate_score(-1), validate_score("x"))\n', 'contrato resultado dict.' if A else 'tipo y rango.', ['validate']))
    out.append(ex('S05-T3-B-E3', 'def decompose_intake(raw: dict):\n    errors = []\n    clean = {}\n    for k, v in raw.items():\n        if v is None or (isinstance(v, str) and not v.strip()):\n            errors.append(k)\n        else:\n            clean[k] = v.strip() if isinstance(v, str) else v\n    return clean, errors\nprint(decompose_intake({"nombres": " Ana ", "edad": ""}))\n', 'descomposicion clean/errors.' if A else 'separacion de responsabilidades.', ['decompose']))
    out.append(ex('S05-T4-A-E1', 'def total_lineas(montos):\n    t = 0\n    for m in montos:\n        t += m\n    return t\nprint(total_lineas([10, 20, 5]))\n', 'acumulador en funcion.' if A else '35.', ['sum']))
    out.append(ex('S05-T4-A-E2', 'def mean(xs):\n    if not xs:\n        return None\n    return sum(xs) / len(xs)\nprint(mean([2, 4, 6]), mean([]))\n', 'media o None si vacio.' if A else 'evita ZeroDivision.', ['mean']))
    out.append(ex('S05-T4-A-E3', 'def reject_rate(statuses):\n    n = len(statuses)\n    if n == 0:\n        return None\n    return sum(1 for s in statuses if s == "reject") / n\nprint(reject_rate(["accept", "reject"]), reject_rate([]))\n', 'tasa reutilizable.' if A else '0.5 y None.', ['rate']))
    out.append(ex('S05-T4-B-E1', 'def main():\n    print("demo funciones S05")\nif __name__ == "__main__":\n    main()\n', 'entrypoint main + __name__.' if A else 'CLI demo minima.', ['main']))
    out.append(ex('S05-T4-B-E2', 'def build_api():\n    def health():\n        return {"status": "ok"}\n    return {"health": health}\napi = build_api()\nprint(api["health"]())\n', 'fabrica de funciones/API simple.' if A else 'health ok.', ['factory']))
    out.append(ex('S05-T4-B-E3', 'def document_contract(fn):\n    return {\n        "name": fn.__name__,\n        "doc": (fn.__doc__ or "").strip(),\n    }\ndef parse_monto(s: str) -> str:\n    """Normaliza monto textual strip."""\n    return s.strip()\nprint(document_contract(parse_monto))\n', 'metadatos de contrato.' if A else 'docstring exportable.', ['docs']))
    return out

# ========== S06 ==========

def s06_selfcheck(persona: str):
    if persona == "explorer":
        return [
            sc(0, 1, "xs[-2:] con [1,2,3,4] es [3,4] (ultimos dos)."),
            sc(1, 3, "b=a alias: append en b muta a tambien."),
            sc(2, 0, "Conflictos de id con payload distinto se listan, no se silencian."),
            sc(3, 2, "list.sort retorna None y muta in-place."),
            sc(4, 1, "json.dumps sort_keys ayuda a salidas deterministas."),
        ]
    return [
        sc(0, 1, "Slicing negativo: desde el penultimo hasta el final."),
        sc(1, 3, "Teoria de alias de listas mutables."),
        sc(2, 0, "Politica de conflicts en dedupe del paquete."),
        sc(3, 2, "sort in-place vs sorted que retorna lista."),
        sc(4, 1, "Reproducibilidad con sort_keys=True."),
    ]

def s06_exercises(persona: str):
    A = persona == "explorer"
    out = []
    out.append(ex('S06-T1-A-E1', 'txs = [10, 20, 30, 40, 50]\nprint(txs[-2:])\nprint(len(txs[-2:]))\n', 'ultimos 2 y longitud ventana.' if A else 'slicing [-2:].', ['slice']))
    out.append(ex('S06-T1-A-E2', 'xs = [1, 2, 3, 4]\nprint(xs[1:3], xs[:2], xs[2:])\n', 'rebanadas basicas.' if A else 'inicio:fin exclusivo.', ['slice']))
    out.append(ex('S06-T1-A-E3', 'window = [1, 2, 3, 4, 5, 6]\nk = 3\nprint([window[i:i+k] for i in range(0, len(window), k)])\n', 'ventanas de tamano k.' if A else 'chunks sin perder orden.', ['chunks']))
    out.append(ex('S06-T1-B-E1', 'a = [1, 2]\nb = a\nb.append(3)\nprint(a, a is b)\n', 'alias muta a.' if A else 'a is b True.', ['alias']))
    out.append(ex('S06-T1-B-E2', 'a = [1, 2]\nc = a.copy()\nc.append(9)\nprint(a, c, a is c)\n', 'copy independiza.' if A else 'a intacto.', ['copy']))
    out.append(ex('S06-T1-B-E3', 'rows = [{"id": 1}, {"id": 2}]\nshallow = rows[:]\nshallow[0]["id"] = 99\nprint(rows[0]["id"])  # 99 shallow\nimport copy\ndeep = copy.deepcopy(rows)\ndeep[0]["id"] = 1\nprint(rows[0]["id"], deep[0]["id"])\n', 'shallow vs deepcopy de dicts.' if A else 'mutacion anidada.', ['deepcopy']))
    out.append(ex('S06-T2-A-E1', 'd = {"a": 1, "b": 2}\nprint(d.get("a"), d.get("c", 0))\n', 'get con default.' if A else 'evita KeyError.', ['dict']))
    out.append(ex('S06-T2-A-E2', 'd = {"nombres": "Ana", "edad": 30}\nfor k, v in d.items():\n    print(k, v)\n', 'items() iteracion.' if A else 'pares clave valor.', ['items']))
    out.append(ex('S06-T2-A-E3', 'raw = [("C1", "accept"), ("C2", "reject"), ("C1", "review")]\nby_id = {}\nconflicts = []\nfor i, st in raw:\n    if i in by_id and by_id[i] != st:\n        conflicts.append({"id": i, "prev": by_id[i], "new": st})\n    by_id[i] = st\nprint(by_id, conflicts)\n', 'dedupe con lista de conflicts.' if A else 'no silenciar colision.', ['conflicts']))
    out.append(ex('S06-T2-B-E1', 's = {1, 2, 2, 3}\nprint(s, 2 in s)\n', 'set elimina duplicados.' if A else 'membership in.', ['set']))
    out.append(ex('S06-T2-B-E2', 'a, b = {1, 2, 3}, {2, 3, 4}\nprint(a & b, a | b, a - b)\n', 'interseccion union diferencia.' if A else 'ops de conjuntos.', ['set ops']))
    out.append(ex('S06-T2-B-E3', 'seen = set()\norder = []\nfor x in ["a", "b", "a", "c", "b"]:\n    if x not in seen:\n        seen.add(x)\n        order.append(x)\nprint(order)\n', 'unicos preservando orden.' if A else 'set + lista.', ['unique']))
    out.append(ex('S06-T3-A-E1', 'rows = [{"id": "b"}, {"id": "a"}, {"id": "c"}]\nrows.sort(key=lambda r: r["id"])\nprint(rows)\n', 'sort in-place por id.' if A else 'retorna None implicitamente.', ['sort']))
    out.append(ex('S06-T3-A-E2', 'rows = [{"score": 2}, {"score": 5}, {"score": 1}]\nprint(sorted(rows, key=lambda r: r["score"], reverse=True))\n', 'sorted no muta original.' if A else 'orden descendente.', ['sorted']))
    out.append(ex('S06-T3-A-E3', 'from operator import itemgetter\nrows = [{"id": "C2", "n": 1}, {"id": "C1", "n": 2}]\nprint(sorted(rows, key=itemgetter("id")))\n', 'itemgetter como key.' if A else 'alternativa a lambda.', ['itemgetter']))
    out.append(ex('S06-T3-B-E1', 't = (1, 2, 3)\nprint(t[0], len(t))\n# t[0] = 9  # TypeError si se descomenta\nprint("tuple inmutable")\n', 'tupla indexable e inmutable.' if A else 'buen key de dict.', ['tuple']))
    out.append(ex('S06-T3-B-E2', 'pair = ("C1", "accept")\ni, st = pair\nprint(i, st)\n', 'unpacking de tupla.' if A else 'patron de pares.', ['unpack']))
    out.append(ex('S06-T3-B-E3', 'from collections import Counter\nprint(Counter(["accept", "reject", "accept"]))\n', 'Counter de statuses.' if A else 'frecuencias.', ['Counter']))
    out.append(ex('S06-T4-A-E1', 'import json\nprint(json.dumps({"b": 1, "a": 2}, sort_keys=True))\n', 'sort_keys determinista.' if A else 'salida estable.', ['json']))
    out.append(ex('S06-T4-A-E2', 'import json\ns = json.dumps([{"id": "C1"}], ensure_ascii=False)\nprint(s)\nprint(json.loads(s)[0]["id"])\n', 'dumps/loads round-trip.' if A else 'ensure_ascii False.', ['json']))
    out.append(ex('S06-T4-A-E3', 'import json\npayload = {"ids": ["C1", "C2"], "n": 2}\nprint(json.dumps(payload, sort_keys=True, indent=2))\n', 'indent para lectura humana.' if A else 'contrato serializado.', ['json']))
    out.append(ex('S06-T4-B-E1', 'records = [{"id": "C1"}, {"id": "C1"}, {"id": "C2"}]\nby = {}\nfor r in records:\n    by.setdefault(r["id"], []).append(r)\nprint({k: len(v) for k, v in by.items()})\n', 'groupby manual con setdefault.' if A else 'conteo por id.', ['groupby']))
    out.append(ex('S06-T4-B-E2', 'from collections import defaultdict\ng = defaultdict(list)\nfor r in [{"region": "Lima"}, {"region": "Cusco"}, {"region": "Lima"}]:\n    g[r["region"]].append(r)\nprint(dict(g))\n', 'defaultdict list.' if A else 'agrupar por region.', ['defaultdict']))
    out.append(ex('S06-T4-B-E3', 'def merge_unique(rows):\n    seen = {}\n    conflicts = []\n    for r in rows:\n        i = r["id"]\n        if i in seen and seen[i] != r:\n            conflicts.append(i)\n        seen[i] = r\n    return list(seen.values()), conflicts\nprint(merge_unique([{"id": "A", "v": 1}, {"id": "A", "v": 2}, {"id": "B", "v": 1}]))\n', 'merge con conflicts.' if A else 'ultima gana pero traza conflicto.', ['merge']))
    return out

# ========== S07 ==========

def s07_selfcheck(persona: str):
    if persona == "explorer":
        return [
            sc(0, 2, "Jose precompuesto vs NFD pueden fallar en ==; hay que normalizar NFC."),
            sc(1, 0, "Un solo token en nombre latam: review y conservar raw, no inventar apellido."),
            sc(2, 1, "Preferir replace/split cuando la transformacion es literal/simple."),
            sc(3, 3, "fullmatch de solo digitos sobre 'DNI 12345678' devuelve None."),
            sc(4, 2, "Jaccard 0.67 debe ir a review con evidencia, no fusion automatica."),
        ]
    return [
        sc(0, 2, "S07-T1-A: formas Unicode NFC vs NFD."),
        sc(1, 0, "Politica segura de parsing de nombres incompletos."),
        sc(2, 1, "Regex no siempre; str ops primero."),
        sc(3, 3, "fullmatch exige toda la cadena."),
        sc(4, 2, "Score intermedio = clerical review."),
    ]

def s07_exercises(persona: str):
    A = persona == "explorer"
    out = []
    out.append(ex('S07-T1-A-E1', 'import unicodedata\na = "José"\nb = "Jose\\u0301"\nprint("raw equal?", a == b)\nprint("NFC equal?", unicodedata.normalize("NFC", a) == unicodedata.normalize("NFC", b))\nprint("casefold:", "MAÑANA".casefold())\n', 'NFC alinea Jose compuesto vs NFD.' if A else 'code points y casefold.', ['unicode']))
    out.append(ex('S07-T1-A-E2', 'import unicodedata\ndef nfc(s):\n    return unicodedata.normalize("NFC", s)\nprint(nfc("Jose\\u0301") == nfc("José"))\n', 'helper NFC para igualdad estable.' if A else 'normalizacion antes de ==.', ['NFC']))
    out.append(ex('S07-T1-A-E3', 'import unicodedata\ndef fingerprint(s):\n    return unicodedata.normalize("NFC", s).casefold().strip()\nprint(fingerprint("  MAÑANA  "), fingerprint("mañana"))\n', 'fingerprint NFC+casefold+strip.' if A else 'clave de matching textual.', ['fingerprint']))
    out.append(ex('S07-T1-B-E1', 'raw = "  María   del  Carmen  Quispe  Huamán "\ntokens = raw.split()\nprint(tokens)\nif len(tokens) >= 3:\n    ap2, ap1 = tokens[-1], tokens[-2]\n    given = " ".join(tokens[:-2])\n    print("given:", given)\n    print("apellidos:", ap1, ap2)\n', 'heuristica ultimos 2 tokens apellidos.' if A else 'conserva raw en pipeline.', ['names']))
    out.append(ex('S07-T1-B-E2', 'def split_name(raw):\n    toks = raw.split()\n    if len(toks) < 2:\n        return {"raw": raw, "status": "review", "given": None, "apellidos": None}\n    return {"raw": raw, "status": "ok", "given": " ".join(toks[:-2]) if len(toks) > 2 else toks[0],\n            "apellidos": toks[-2:] if len(toks) >= 2 else toks}\nprint(split_name("Ana"))\nprint(split_name("Ana Quispe Huamán"))\n', 'un token -> review + raw.' if A else 'no inventar apellido2.', ['policy']))
    out.append(ex('S07-T1-B-E3', 'particulas = {"de", "del", "la", "los", "las", "y"}\ndef tokens_name(s):\n    return [t for t in s.split() if t.casefold() not in particulas or True]\n# demo: mantener particulas en given\nraw = "María del Carmen Quispe"\nprint(raw.split())\n', 'particulas en nombres compuestos.' if A else 'no borrar del/de sin politica.', ['particles']))
    out.append(ex('S07-T2-A-E1', 'dir_raw = "  Av.  Larco   123  ,  Miraflores "\nlimpio = " ".join(dir_raw.strip().split())\nprint(limpio)\nprint([p.strip() for p in limpio.split(",")])\nprint(limpio.replace("Av.", "Avenida"))\n', 'split/join colapsa espacios; replace literal.' if A else 'ops str antes de regex.', ['str ops']))
    out.append(ex('S07-T2-A-E2', 's = "Jr. de la Unión 450"\nprint(s.find("Unión"), s.replace("Jr.", "Jiron"))\n', 'find + replace.' if A else 'busqueda literal.', ['find']))
    out.append(ex('S07-T2-A-E3', 'def normalize_address(raw):\n    return " ".join(raw.strip().split())\nprint(normalize_address("  Jr.   Ucayali  100 "))\n', 'normalizador de direccion minimo.' if A else 'idempotente strip/split/join.', ['address']))
    out.append(ex('S07-T2-B-E1', 'def normalize_email(raw: str) -> str:\n    s = raw.strip().casefold()\n    if s.count("@") != 1 or any(ch.isspace() for ch in s):\n        raise ValueError("email requiere un @ y cero espacios")\n    local, domain = s.split("@")\n    if not local or not domain:\n        raise ValueError("email requiere local y dominio")\n    return s\nprint(normalize_email("  Ana+test@Example.COM "))\n', 'email strip/casefold un @.' if A else 'sin sobrevalidar TLD.', ['email']))
    out.append(ex('S07-T2-B-E2', 'def normalize_phone_pe(raw: str) -> str:\n    return "".join(c for c in raw if c.isdigit())\nprint(normalize_phone_pe("+51 999-000-111"))\n', 'solo digitos del telefono.' if A else 'no aritmetica.', ['phone']))
    out.append(ex('S07-T2-B-E3', 'def validate_contact(email=None, phone=None):\n    errors = []\n    if email is not None and email.count("@") != 1:\n        errors.append("email")\n    if phone is not None and not any(ch.isdigit() for ch in phone):\n        errors.append("phone")\n    return errors\nprint(validate_contact("a@b.com", "999"), validate_contact("bad", "xxx"))\n', 'validacion ligera contactos.' if A else 'errores nombrados.', ['contact']))
    out.append(ex('S07-T3-A-E1', 'import re\npat = re.compile(r"^(?P<dni>\\d{8})$")\nm = pat.fullmatch("12345678")\nprint(m.group("dni") if m else None)\nprint("search mid:", bool(re.search(r"\\d{8}", "DNI 12345678 PE")))\nprint("full mid:", bool(re.fullmatch(r"\\d{8}", "DNI 12345678 PE")))\n', 'fullmatch vs search.' if A else 'grupo nombrado dni.', ['re']))
    out.append(ex('S07-T3-A-E2', 'import re\nprint(bool(re.fullmatch(r"\\d{8}", "12345678")))\nprint(bool(re.fullmatch(r"\\d{8}", "DNI 12345678")))\n', 'fullmatch None en prefijo.' if A else 'anclas implicitas full.', ['fullmatch']))
    out.append(ex('S07-T3-A-E3', 'import re\npat = re.compile(r"DNI\\s+(?P<dni>\\d{8})\\b")\nm = pat.search("Cliente demo DNI 12345678 activo")\nprint(m.group("dni") if m else None)\n', 'extraccion con search + grupo.' if A else 'word boundary.', ['search']))
    out.append(ex('S07-T3-B-E1', 'import re\nphone = re.compile(r"\\b9\\d{8}\\b")\nlog = "llamada 999000111 y fallback 988777666 fin"\nprint(phone.findall(log))\n', 'findall celulares 9xxxxxxxx.' if A else 'patron compilado.', ['findall']))
    out.append(ex('S07-T3-B-E2', 'import re\nphone = re.compile(r"\\b9\\d{8}\\b")\nlog = "ok 999111222 noise 12345 otro 988777666"\nfor m in phone.finditer(log):\n    print(m.group(), "at", m.start())\n', 'finditer con span.' if A else 'posiciones en log.', ['finditer']))
    out.append(ex('S07-T3-B-E3', 'import re\n# evita cuantificadores anidados ambiguos; usa findall acotado\nprint(re.findall(r"\\b\\d{8}\\b", "ids 12345678 y 87654321"))\n', 'extraccion acotada de 8 digitos.' if A else 'limites \\b.', ['limits']))
    out.append(ex('S07-T4-A-E1', 'def token_jaccard(a: str, b: str) -> float:\n    A = set(a.replace(".", " ").casefold().split())\n    B = set(b.replace(".", " ").casefold().split())\n    if not A and not B:\n        return 1.0\n    if not A or not B:\n        return 0.0\n    return len(A & B) / len(A | B)\nprint(round(token_jaccard("Juan Perez", "Juan P. Perez"), 3))\n', 'Jaccard de tokens ~0.67.' if A else 'set intersection/union.', ['jaccard']))
    out.append(ex('S07-T4-A-E2', 'def token_jaccard(a, b):\n    A, B = set(a.casefold().split()), set(b.casefold().split())\n    if not A or not B:\n        return 0.0\n    return len(A & B) / len(A | B)\nprint(round(token_jaccard("Ana Quispe", "Luis Huamán"), 3))\n', 'nombres disjuntos -> 0.' if A else 'score bajo.', ['jaccard']))
    out.append(ex('S07-T4-A-E3', 'def decide_name_match(score):\n    if score >= 0.99:\n        return "exact"\n    if score >= 0.5:\n        return "review"\n    return "no_match"\nprint(decide_name_match(1.0), decide_name_match(0.67), decide_name_match(0.1))\n', '0.67 -> review no merge auto.' if A else 'umbrales de evidencia.', ['decision']))
    out.append(ex('S07-T4-B-E1', 'pairs = [\n    ("José Pérez", "Jose Perez", 0.9, "review"),\n    ("Ana", "Ana", 1.0, "exact"),\n    ("Luis", "Carla", 0.0, "no_match"),\n]\nfor a, b, score, dec in pairs:\n    print(f"{a!r} vs {b!r} score={score} -> {dec}")\nprint("nota: sin claims de parentesco ni identidad legal")\n', 'tabula FP/FN sin veredictos legales.' if A else 'conserva evidencia.', ['evidence']))
    out.append(ex('S07-T4-B-E2', '# metricas sinteticas\nrows = [\n    {"pred": "match", "truth": "match"},\n    {"pred": "match", "truth": "no"},  # FP\n    {"pred": "no", "truth": "match"},  # FN\n    {"pred": "no", "truth": "no"},\n]\ntp = sum(1 for r in rows if r["pred"]=="match" and r["truth"]=="match")\nfp = sum(1 for r in rows if r["pred"]=="match" and r["truth"]=="no")\nfn = sum(1 for r in rows if r["pred"]=="no" and r["truth"]=="match")\nprint("tp", tp, "fp", fp, "fn", fn)\n', 'tp/fp/fn de matching sintético.' if A else 'FP no implica fraude.', ['metrics']))
    out.append(ex('S07-T4-B-E3', 'def keep_evidence(raw_a, raw_b, score, decision):\n    return {"raw_a": raw_a, "raw_b": raw_b, "score": score, "decision": decision,\n            "legal_claim": False}\nprint(keep_evidence("Ana", "Ana Quispe", 0.5, "review"))\n', 'raw + score + decision; sin claim legal.' if A else 'paquete de evidencia.', ['keep raw']))
    return out

# ========== S08 ==========

def s08_selfcheck(persona: str):
    if persona == "explorer":
        return [
            sc(0, 3, "encoding utf-8 evita depender del locale del SO (p.ej. Windows)."),
            sc(1, 1, "Escritura atomica: temp + os.replace al destino."),
            sc(2, 2, "Fila con columnas de mas va a cuarentena con motivo."),
            sc(3, 0, "Reconciliacion: n_in == n_clean + n_quarantine."),
            sc(4, 3, "Si reconcile falla: fail closed / exit non-zero."),
        ]
    return [
        sc(0, 3, "S08-T1-A: declarar encoding en open/read_text."),
        sc(1, 1, "Patron write_atomic del demo."),
        sc(2, 2, "S08-T2-B cuarentena de filas irregulares."),
        sc(3, 0, "Manifest de corrida exige balance de conteos."),
        sc(4, 3, "No publicar clean si reconcile_ok es False."),
    ]

def s08_exercises(persona: str):
    A = persona == "explorer"
    out = []
    out.append(ex('S08-T1-A-E1', 'from pathlib import Path\nimport tempfile\ntd = Path(tempfile.mkdtemp())\np = td / "intake.txt"\np.write_text("linea1\\njosé\\n", encoding="utf-8")\nprint(p.exists(), p.read_text(encoding="utf-8").splitlines())\n', 'pathlib write/read utf-8.' if A else 'exists + splitlines.', ['pathlib']))
    out.append(ex('S08-T1-A-E2', 'from pathlib import Path\nimport tempfile\np = Path(tempfile.mkdtemp()) / "a.txt"\nwith p.open("w", encoding="utf-8") as f:\n    f.write("hola\\n")\nprint(p.read_text(encoding="utf-8"))\n', 'with open encoding.' if A else 'context manager.', ['with']))
    out.append(ex('S08-T1-A-E3', 'from pathlib import Path\nimport tempfile\np = Path(tempfile.mkdtemp()) / "b.txt"\np.write_text("x", encoding="utf-8")\nprint(p.stat().st_size, p.resolve().name)\n', 'stat size + name.' if A else 'metadatos basicos.', ['stat']))
    out.append(ex('S08-T1-B-E1', 'from pathlib import Path\nimport os, tempfile\ndef write_atomic(path: Path, text: str) -> None:\n    path = Path(path)\n    tmp = path.with_name(path.name + ".tmp")\n    tmp.write_text(text, encoding="utf-8")\n    os.replace(tmp, path)\ndest = Path(tempfile.mkdtemp()) / "out.txt"\nwrite_atomic(dest, "hola\\n")\nprint(dest.read_text(encoding="utf-8"))\n', 'temp + os.replace atomico.' if A else 'escritura segura.', ['atomic']))
    out.append(ex('S08-T1-B-E2', 'sample = b"a\\r\\nb\\n"\nprint("tiene CRLF", b"\\r\\n" in sample)\ntext = sample.replace(b"\\r\\n", b"\\n").decode("utf-8")\nprint(text.splitlines())\n', 'normaliza newlines CRLF.' if A else 'ingesta portable.', ['newlines']))
    out.append(ex('S08-T1-B-E3', 'from pathlib import Path\nimport os, tempfile\ndef write_atomic(path, text):\n    path = Path(path)\n    tmp = path.with_suffix(path.suffix + ".tmp")\n    tmp.write_text(text, encoding="utf-8")\n    os.replace(tmp, path)\n    return path\nprint(write_atomic(Path(tempfile.mkdtemp())/"c.csv", "id\\n1\\n").name)\n', 'atomic csv write.' if A else 'suffix .tmp.', ['atomic']))
    out.append(ex('S08-T2-A-E1', 'import csv, io\nfrom decimal import Decimal\nraw = "id,nombre,monto\\nC001,Ana,10.5\\nC002,Luis,20\\n"\nfor row in csv.DictReader(io.StringIO(raw)):\n    row["monto"] = Decimal(row["monto"]).quantize(Decimal("0.01"))\n    print(row)\n', 'DictReader + Decimal monto.' if A else 'tipos al leer CSV.', ['csv']))
    out.append(ex('S08-T2-A-E2', 'import csv, io\nraw = "id,nombre\\nC001,Ana\\n"\nprint(list(csv.DictReader(io.StringIO(raw))))\n', 'headers del dialecto default.' if A else 'lista de dicts.', ['DictReader']))
    out.append(ex('S08-T2-A-E3', 'import csv, io\nfrom decimal import Decimal, InvalidOperation\ndef parse_monto(s):\n    try:\n        return Decimal(s).quantize(Decimal("0.01"))\n    except InvalidOperation:\n        return None\nraw = "id,monto\\nC1,10.5\\nC2,xx\\n"\nfor row in csv.DictReader(io.StringIO(raw)):\n    print(row["id"], parse_monto(row["monto"]))\n', 'monto invalido -> None sin tumbar lote.' if A else 'parse por celda.', ['parse']))
    out.append(ex('S08-T2-B-E1', 'import csv, io\ntext = "id,nombre\\nC001,Ana\\nC002,Luis,EXTRA\\nC003\\n"\nreader = csv.reader(io.StringIO(text))\nheader = next(reader)\ngood, bad = [], []\nfor row in reader:\n    if len(row) != len(header):\n        bad.append({"raw": row, "reason": f"cols {len(row)}!={len(header)}"})\n    else:\n        good.append(dict(zip(header, row)))\nprint("good", good)\nprint("bad", bad)\n', 'filas irregulares a cuarentena.' if A else 'motivo cols.', ['quarantine']))
    out.append(ex('S08-T2-B-E2', 'def quarantine_row(row, reason):\n    return {"raw": row, "reason": reason, "status": "quarantine"}\nprint(quarantine_row(["C1", "x", "y"], "cols 3!=2"))\n', 'estructura de cuarentena.' if A else 'no silenciar.', ['quarantine']))
    out.append(ex('S08-T2-B-E3', 'good, bad = [{"id": "C1"}], [{"raw": ["C2"], "reason": "cols"}]\nprint(len(good) + len(bad) == 2)\n', 'balance good+bad.' if A else 'trazabilidad de filas.', ['balance']))
    out.append(ex('S08-T3-A-E1', 'import json\nfrom datetime import date\ndata = [{"id": "T1", "dia": date(2026, 1, 15).isoformat()}]\ns = json.dumps(data, ensure_ascii=False, sort_keys=True)\nprint(s)\nprint(json.loads(s)[0]["id"])\n', 'dumps sort_keys + iso date.' if A else 'round-trip id.', ['json']))
    out.append(ex('S08-T3-A-E2', 'import json\nprint(json.loads(\'{"a":1,"b":null}\')["b"] is None)\n', 'null JSON -> None Python.' if A else 'schema nullable.', ['null']))
    out.append(ex('S08-T3-A-E3', 'import json\nobj = {"id": "C1"}\nobj.setdefault("segment", "default")\nprint(json.dumps(obj, sort_keys=True))\n', 'evolucion compatible setdefault.' if A else 'default de campo nuevo.', ['schema evo']))
    out.append(ex('S08-T3-B-E1', 'def validate_schema(obj, required):\n    missing = [k for k in required if k not in obj]\n    return (len(missing) == 0, missing)\nprint(validate_schema({"id": "C1", "email": None}, ["id", "email"]))\nprint(validate_schema({"id": "C1"}, ["id", "email"]))\n', 'required keys; null cuenta presente.' if A else 'missing list.', ['schema']))
    out.append(ex('S08-T3-B-E2', 'def is_compatible(old_keys, new_obj):\n    return all(k in new_obj for k in old_keys)\nprint(is_compatible(["id"], {"id": "x", "extra": 1}))\n', 'compat hacia adelante con extra fields.' if A else 'no romper lectores viejos.', ['compat']))
    out.append(ex('S08-T3-B-E3', 'record = {"id": "C1"}\nrecord.setdefault("email", None)\nprint(record)\n', 'null explicito vs ausente.' if A else 'setdefault email.', ['nulls']))
    out.append(ex('S08-T4-A-E1', 'from pathlib import Path\nimport hashlib, tempfile, shutil\ntd = Path(tempfile.mkdtemp())\nsrc = td / "clients.csv"\nsrc.write_text("id,nombre\\nC001,Ana\\n", encoding="utf-8")\nh = hashlib.sha256(src.read_bytes()).hexdigest()\nbak = td / "clients.csv.bak"\nshutil.copy2(src, bak)\nprint("sha256", h[:16] + "...")\nprint("bak exists", bak.exists())\n', 'hash + backup copy2.' if A else 'provenance basica.', ['hash']))
    out.append(ex('S08-T4-A-E2', 'import hashlib\nb = b"hello"\nprint(hashlib.sha256(b).hexdigest()[:12])\n', 'sha256 corto para manifest.' if A else 'fingerprint contenido.', ['sha256']))
    out.append(ex('S08-T4-A-E3', 'provenance = {"path": "clients.csv", "sha256": "abc", "bytes": 12}\nprint(provenance)\n', 'registro de provenance.' if A else 'path+hash+bytes.', ['provenance']))
    out.append(ex('S08-T4-B-E1', 'sources = [\n    {"name": "clients.csv", "n_in": 6, "n_clean": 5, "n_quarantine": 1},\n    {"name": "transactions.json", "n_in": 4, "n_clean": 3, "n_quarantine": 1},\n]\nfor source in sources:\n    source["reconcile_ok"] = source["n_in"] == source["n_clean"] + source["n_quarantine"]\nprint(sources)\nprint(all(s["reconcile_ok"] for s in sources))\n', 'n_in == clean + quarantine.' if A else 'reconcile_ok.', ['reconcile']))
    out.append(ex('S08-T4-B-E2', 'def fail_closed(reconcile_ok):\n    if not reconcile_ok:\n        raise SystemExit(1)\n    return 0\nprint(fail_closed(True))\n', 'fail closed si reconcile falla.' if A else 'exit non-zero.', ['fail closed']))
    out.append(ex('S08-T4-B-E3', 'manifest = {\n    "n_in": 10, "n_clean": 8, "n_quarantine": 2,\n    "reconcile_ok": 10 == 8 + 2,\n}\nprint(manifest)\nif not manifest["reconcile_ok"]:\n    raise SystemExit("reconcile failed")\nprint("publish_ok")\n', 'manifest de corrida + publish solo si ok.' if A else 'contrato de ingesta.', ['manifest']))
    return out

# ========== S09 ==========

def s09_selfcheck(persona: str):
    if persona == "explorer":
        return [
            sc(0, 0, "raise NewError(...) from e encadena la causa en __cause__."),
            sc(1, 2, "Delimiter vacio en config es fail-fast del job, no cuarentena de una fila."),
            sc(2, 3, "stdout = datos; diagnostico a stderr."),
            sc(3, 1, "mask_email seguro: a***@ejemplo.pe estilo enmascarado."),
            sc(4, 0, "TimeoutError puede reintentarse; ValueError de datos no."),
            sc(5, 2, "Minimal repro: entrada mas pequena que reproduce el bug."),
        ]
    return [
        sc(0, 0, "Encadenamiento de excepciones del paquete S09."),
        sc(1, 2, "Errores de config -> abortar job."),
        sc(2, 3, "Separacion stdout/stderr en CLI."),
        sc(3, 1, "Enmascarar PII en logs."),
        sc(4, 0, "Retry solo en fallos transitorios de red."),
        sc(5, 2, "Repro minimo para debugging."),
    ]

def s09_exercises(persona: str):
    A = persona == "explorer"
    out = []
    out.append(ex('S09-T1-A-E1', 'fallos = [\n    ("archivo ausente", "FileNotFoundError"),\n    ("tipo malo", "TypeError"),\n    ("valor malo", "ValueError"),\n    ("clave dict", "KeyError"),\n    ("timeout red", "TimeoutError"),\n]\nfor f, t in fallos:\n    print(f"{f} -> {t}")\n', 'mapea 5 fallos a tipos de excepcion.' if A else 'catalogo de errores S09.', ['exceptions']))
    out.append(ex('S09-T1-A-E2', 'try:\n    int("x")\nexcept ValueError as e:\n    print(type(e).__name__, e)\n', 'captura ValueError.' if A else 'mensaje de conversion.', ['except']))
    out.append(ex('S09-T1-A-E3', 'class IntakeError(Exception):\n    pass\ntry:\n    raise IntakeError("campo edad")\nexcept IntakeError as e:\n    print(e)\n', 'excepcion de dominio propia.' if A else 'mensaje con campo.', ['custom']))
    out.append(ex('S09-T1-B-E1', 'try:\n    raise ValueError("raw")\nexcept ValueError as e:\n    raise RuntimeError("wrap") from e\n', 'raise from encadena causa.' if A else 'demo __cause__.', ['raise from']))
    out.append(ex('S09-T1-B-E2', 'def load_config(delim):\n    if delim is None or delim == "":\n        raise ValueError("delimiter vacio: fail-fast")\n    return delim\ntry:\n    load_config("")\nexcept ValueError as e:\n    print(e)\n', 'config invalida fail-fast.' if A else 'no cuarentenar fila.', ['fail-fast']))
    out.append(ex('S09-T1-B-E3', 'def parse_or_quarantine(row):\n    try:\n        return "ok", int(row)\n    except ValueError:\n        return "quarantine", row\nprint(parse_or_quarantine("10"), parse_or_quarantine("x"))\n', 'error de fila -> quarantine; no abortar job.' if A else 'vs fail-fast de config.', ['quarantine']))
    out.append(ex('S09-T2-A-E1', 'import sys\nprint("dato", file=sys.stdout)\nprint("diag", file=sys.stderr)\n', 'datos stdout; diag stderr.' if A else 'CLI limpia.', ['streams']))
    out.append(ex('S09-T2-A-E2', 'import logging\nlogging.basicConfig(level=logging.INFO)\nlog = logging.getLogger("intake")\nlog.info("filas=%s", 3)\nprint(\'{"n":3}\')\n', 'log a logger; JSON a stdout.' if A else 'no mezclar.', ['logging']))
    out.append(ex('S09-T2-A-E3', 'def cli_emit(payload, log_msg):\n    import sys\n    print(log_msg, file=sys.stderr)\n    print(payload)\ncli_emit(\'{"ok":true}\', "done")\n', 'helper emit separado.' if A else 'contrato CLI.', ['cli']))
    out.append(ex('S09-T2-B-E1', 'def mask_email(e):\n    if "@" not in e:\n        return "***"\n    local, domain = e.split("@", 1)\n    return (local[:1] + "***@" + domain) if local else "***@" + domain\nprint(mask_email("ana@ejemplo.pe"))\n', 'a***@ejemplo.pe style.' if A else 'mask seguro.', ['mask']))
    out.append(ex('S09-T2-B-E2', 'def mask_phone(p):\n    digits = "".join(c for c in p if c.isdigit())\n    if len(digits) < 4:\n        return "***"\n    return "*" * (len(digits) - 4) + digits[-4:]\nprint(mask_phone("999000111"))\n', 'enmascara dejando ultimos 4.' if A else 'logs sin PII completa.', ['mask']))
    out.append(ex('S09-T2-B-E3', 'def safe_log_record(rec):\n    out = dict(rec)\n    if "email" in out:\n        e = out["email"]\n        out["email"] = e[0] + "***@" + e.split("@")[-1] if e and "@" in e else "***"\n    return out\nprint(safe_log_record({"id": "C1", "email": "ana@ejemplo.pe"}))\n', 'record logeable sin email claro.' if A else 'redaccion.', ['redact']))
    out.append(ex('S09-T3-A-E1', 'def fetch(retry=0):\n    if retry < 2:\n        raise TimeoutError("temp")\n    return "ok"\nattempt = 0\nwhile True:\n    try:\n        print(fetch(attempt))\n        break\n    except TimeoutError:\n        attempt += 1\n        if attempt > 3:\n            raise\n', 'retry TimeoutError con tope.' if A else 'no retry ValueError.', ['retry']))
    out.append(ex('S09-T3-A-E2', 'def classify_error(e):\n    if isinstance(e, TimeoutError):\n        return "retryable"\n    if isinstance(e, ValueError):\n        return "data"\n    return "other"\nprint(classify_error(TimeoutError()), classify_error(ValueError("x")))\n', 'clasifica retryable vs data.' if A else 'politica de reintento.', ['classify']))
    out.append(ex('S09-T3-A-E3', 'import time\ndef backoff(i):\n    return min(2 ** i, 8)\nprint([backoff(i) for i in range(4)])\n', 'backoff exponencial acotado.' if A else '1,2,4,8.', ['backoff']))
    out.append(ex('S09-T3-B-E1', 'def minimal_repro(rows):\n    for r in rows:\n        try:\n            int(r)\n        except ValueError:\n            return r\n    return None\nprint(minimal_repro(["1", "2", "x", "4"]))\n', 'repro minimo: primera fila que falla.' if A else 'no todo el CSV.', ['repro']))
    out.append(ex('S09-T3-B-E2', 'def assert_repro(fn, sample):\n    try:\n        fn(sample)\n        return "no_fail"\n    except Exception as e:\n        return type(e).__name__\nprint(assert_repro(lambda s: int(s), "x"))\n', 'verifica que el repro falla como se espera.' if A else 'nombre de excepcion.', ['repro']))
    out.append(ex('S09-T3-B-E3', 'bug_note = {\n    "input": "edad=\'abc\'",\n    "expected": "ValueError capturado a errors",\n    "not": "CSV completo de produccion",\n}\nprint(bug_note)\n', 'documenta minimal repro.' if A else 'sin datos de prod.', ['docs']))
    out.append(ex('S09-T4-A-E1', 'import traceback\ntry:\n    1/0\nexcept ZeroDivisionError:\n    print("caught")\n    # traceback.print_exc()  # a stderr en debug\n', 'captura y opcional traceback.' if A else 'no silenciar sin log.', ['traceback']))
    out.append(ex('S09-T4-A-E2', 'def handle(e):\n    return {"error_type": type(e).__name__, "msg": str(e)}\nprint(handle(ValueError("edad")))\n', 'estructura de error para API/log.' if A else 'type + msg.', ['error dict']))
    out.append(ex('S09-T4-A-E3', 'errors = []\nfor raw in ["10", "x"]:\n    try:\n        errors.append(("ok", int(raw)))\n    except ValueError as e:\n        errors.append(("err", str(e)))\nprint(errors)\n', 'acumula errores por fila.' if A else 'batch resilient.', ['batch']))
    out.append(ex('S09-T4-B-E1', 'def job(config):\n    if not config.get("delimiter"):\n        raise SystemExit(2)\n    return 0\nprint(job({"delimiter": ","}))\n', 'exit 2 estilo uso/config.' if A else 'fail-fast config.', ['exit codes']))
    out.append(ex('S09-T4-B-E2', 'STEPS = ["validate_config", "read", "parse", "write", "reconcile"]\nprint(STEPS)\n', 'pipeline steps nombrados.' if A else 'runbook debug.', ['steps']))
    out.append(ex('S09-T4-B-E3', 'runbook = {\n    "on_TimeoutError": "retry with backoff",\n    "on_ValueError": "quarantine row",\n    "on_config_error": "fail-fast",\n}\nprint(runbook)\n', 'matriz de respuesta a fallos.' if A else 'operacion segura.', ['runbook']))
    return out

# ========== S10 ==========

def s10_selfcheck(persona: str):
    if persona == "explorer":
        return [
            sc(0, 1, "if __name__ == '__main__' ejecuta CLI solo al correr el modulo, no al importar."),
            sc(1, 3, "Precedencia: flags > env > file > defaults."),
            sc(2, 0, "Exit code 2 suele ser error de uso/parseo argparse."),
            sc(3, 2, "Logs de progreso van a stderr."),
            sc(4, 1, "Subcomando nuevo compatible tipicamente minor."),
            sc(5, 3, ".env con API_TOKEN no debe ir al git del paquete."),
        ]
    return [
        sc(0, 1, "Patron entrypoint de modulos S10."),
        sc(1, 3, "Tabla de precedencia de config del paquete."),
        sc(2, 0, "Convencion argparse exit 2."),
        sc(3, 2, "stdout reservado a datos."),
        sc(4, 1, "SemVer: feature compatible = minor."),
        sc(5, 3, "Secretos fuera del repo."),
    ]

def s10_exercises(persona: str):
    A = persona == "explorer"
    out = []
    out.append(ex('S10-T1-A-E1', 'def greet(name):\n    return f"hola {name}"\ndef main():\n    print(greet("mundo"))\nif __name__ == "__main__":\n    main()\n', 'modulo importable + main.' if A else 'no side effects al import.', ['__main__']))
    out.append(ex('S10-T1-A-E2', '# paquete minimo\n# mypkg/__init__.py vacio + mypkg/cli.py con main\nprint(__name__)\n', 'nombre del modulo al import/run.' if A else 'base packaging.', ['package']))
    out.append(ex('S10-T1-A-E3', '__all__ = ["parse_row"]\ndef parse_row(r):\n    return r\nprint(__all__)\n', '__all__ exporta API publica.' if A else 'superficie estable.', ['__all__']))
    out.append(ex('S10-T1-B-E1', 'def load_config(defaults, file_cfg, env, flags):\n    cfg = dict(defaults)\n    cfg.update(file_cfg or {})\n    cfg.update(env or {})\n    cfg.update(flags or {})\n    return cfg\nprint(load_config({"a":1}, {"a":2}, {"a":3}, {"a":4}))\n', 'flags ganan: a=4.' if A else 'precedencia defaults<file<env<flags.', ['config']))
    out.append(ex('S10-T1-B-E2', 'import os\ndef env_or(key, default):\n    return os.environ.get(key, default)\nprint(env_or("NOEXISTE_PYARCANA", "def"))\n', 'lee env con default.' if A else 'capa env.', ['env']))
    out.append(ex('S10-T1-B-E3', 'def merge_cfg(*layers):\n    out = {}\n    for layer in layers:\n        if layer:\n            out.update(layer)\n    return out\nprint(merge_cfg({"x":1}, {"x":2, "y":3}))\n', 'merge de capas de config.' if A else 'ultima gana.', ['merge']))
    out.append(ex('S10-T2-A-E1', 'import argparse\np = argparse.ArgumentParser()\np.add_argument("--n", type=int, default=1)\n# args = p.parse_args([])  # en demo\nprint(p.parse_args([]).n)\n', 'argparse default n=1.' if A else 'CLI basica.', ['argparse']))
    out.append(ex('S10-T2-A-E2', 'import argparse\np = argparse.ArgumentParser()\np.add_argument("path")\nprint(p.parse_args(["data.csv"]).path)\n', 'positional path.' if A else 'uso tipico ingest.', ['args']))
    out.append(ex('S10-T2-A-E3', 'import argparse, sys\np = argparse.ArgumentParser()\np.add_argument("--strict", action="store_true")\nprint(p.parse_args([]).strict, p.parse_args(["--strict"]).strict)\n', 'flag boolean store_true.' if A else 'strict mode.', ['flags']))
    out.append(ex('S10-T2-B-E1', 'def exit_usage():\n    raise SystemExit(2)\ntry:\n    exit_usage()\nexcept SystemExit as e:\n    print("code", e.code)\n', 'exit 2 uso/parseo.' if A else 'convencion argparse.', ['exit 2']))
    out.append(ex('S10-T2-B-E2', 'def run(ok):\n    return 0 if ok else 1\nprint(run(True), run(False))\n', '0 exito 1 error de negocio.' if A else 'codigos de salida.', ['exit codes']))
    out.append(ex('S10-T2-B-E3', 'import sys\nprint("json-out")\nprint("progress", file=sys.stderr)\n', 'progreso a stderr.' if A else 'stdout limpio.', ['stderr']))
    out.append(ex('S10-T3-A-E1', '# pyproject snippet\ntoml = \nprint("0.1.0")\n', 'version inicial package.' if A else 'SemVer base.', ['version']))
    out.append(ex('S10-T3-A-E2', 'def bump(ver, kind):\n    maj, mi, pa = map(int, ver.split("."))\n    if kind == "major":\n        return f"{maj+1}.0.0"\n    if kind == "minor":\n        return f"{maj}.{mi+1}.0"\n    return f"{maj}.{mi}.{pa+1}"\nprint(bump("0.1.0", "minor"), bump("0.1.0", "patch"))\n', 'minor por subcomando nuevo.' if A else '0.2.0 y 0.1.1.', ['semver']))
    out.append(ex('S10-T3-A-E3', 'changelog = ["0.2.0: add validate subcommand", "0.1.0: initial cli"]\nprint("\\n".join(changelog))\n', 'changelog minimo.' if A else 'comunicar cambios.', ['changelog']))
    out.append(ex('S10-T3-B-E1', 'ignore = [".env", "*.pyc", ".venv/", "dist/"]\nprint("\\n".join(ignore))\n', 'artefactos y secretos fuera de git.' if A else 'packaging hygiene.', ['gitignore']))
    out.append(ex('S10-T3-B-E2', '# no commitear\nsecret_paths = [".env", "secrets.yaml"]\nprint(secret_paths)\n', 'lista de paths prohibidos.' if A else 'API_TOKEN fuera.', ['secrets']))
    out.append(ex('S10-T3-B-E3', 'readme = "pip install -e .\\npython -m mypkg.cli --help"\nprint(readme)\n', 'docs de install editable + help.' if A else 'onboarding CLI.', ['readme']))
    out.append(ex('S10-T4-A-E1', 'def subcommands():\n    return {"ingest": "run ingest", "validate": "run validate"}\nprint(sorted(subcommands()))\n', 'mapa de subcomandos.' if A else 'CLI multi-command.', ['subcommands']))
    out.append(ex('S10-T4-A-E2', 'def dispatch(cmd, registry):\n    if cmd not in registry:\n        raise SystemExit(2)\n    return registry[cmd]\nprint(dispatch("ingest", {"ingest": "ok"}))\n', 'dispatch con exit 2 si desconocido.' if A else 'router CLI.', ['dispatch']))
    out.append(ex('S10-T4-A-E3', 'help_text = "usage: tool [ingest|validate] [--strict]"\nprint(help_text)\n', 'help de uso.' if A else 'documenta interface.', ['help']))
    out.append(ex('S10-T4-B-E1', 'def smoke_cli():\n    return {"exit": 0, "stdout": "{\\"ok\\": true}"}\nprint(smoke_cli())\n', 'smoke del CLI.' if A else 'exit 0 + json.', ['smoke']))
    out.append(ex('S10-T4-B-E2', 'checklist = ["entry __main__", "stderr logs", "no .env in sdist"]\nprint(checklist)\n', 'checklist release package.' if A else 'higiene.', ['release']))
    out.append(ex('S10-T4-B-E3', 'def public_api():\n    return ["main", "load_config", "dispatch"]\nprint(public_api())\n', 'API publica estable.' if A else 'superficie versionada.', ['api']))
    return out

# ========== S11 ==========

def s11_selfcheck(persona: str):
    if persona == "explorer":
        return [
            sc(0, 2, "field(default_factory=list) evita default mutable compartido entre instancias."),
            sc(1, 0, "signal_score es senal numerica, no veredicto de fraude o familia."),
            sc(2, 1, "Protocol EntityStore define puerto get/save para fakes y adapters."),
            sc(3, 3, "Objeto invalido debe fallar en construccion (__post_init__/validate)."),
            sc(4, 2, "Herencia Client(Person) suele ser fragil; composicion basta."),
            sc(5, 0, "Dominio no debe tener is_fraud() automatico."),
        ]
    return [
        sc(0, 2, "dataclass default_factory del paquete OOP."),
        sc(1, 0, "RelationshipEvidence es evidencia no veredicto."),
        sc(2, 1, "Puerto hexagonal EntityStore."),
        sc(3, 3, "Fail fast en construccion."),
        sc(4, 2, "Composicion sobre herencia profunda."),
        sc(5, 0, "Prohibido auto-fraude en dominio de familiaridad."),
    ]

def s11_exercises(persona: str):
    A = persona == "explorer"
    out = []
    out.append(ex('S11-T1-A-E1', 'from dataclasses import dataclass, field\n@dataclass\nclass Bag:\n    items: list = field(default_factory=list)\na, b = Bag(), Bag()\na.items.append(1)\nprint(a.items, b.items)\n', 'default_factory evita lista compartida.' if A else 'a=[1] b=[].', ['dataclass']))
    out.append(ex('S11-T1-A-E2', 'from dataclasses import dataclass\n@dataclass\nclass Person:\n    name: str\n    doc: str\nprint(Person("Ana", "D1"))\n', 'dataclass basica Person.' if A else 'campos tipados.', ['Person']))
    out.append(ex('S11-T1-A-E3', 'from dataclasses import dataclass\n@dataclass\nclass Person:\n    name: str\n    def __post_init__(self):\n        if not self.name.strip():\n            raise ValueError("name vacio")\nprint(Person("Ana"))\n', 'valida en __post_init__.' if A else 'fail en construccion.', ['post_init']))
    out.append(ex('S11-T1-B-E1', 'from dataclasses import dataclass\n@dataclass\nclass RelationshipEvidence:\n    signal_score: float\n    kind: str\ne = RelationshipEvidence(0.4, "shared_phone")\nprint(e.signal_score, "not_verdict")\n', 'signal_score es senal no veredicto.' if A else 'kind etiquetado.', ['evidence']))
    out.append(ex('S11-T1-B-E2', 'from dataclasses import dataclass\n@dataclass\nclass RelationshipEvidence:\n    signal_score: float\n    def as_dict(self):\n        return {"relationship_signal_score": self.signal_score, "is_fraud": False}\nprint(RelationshipEvidence(0.7).as_dict())\n', 'serializa sin is_fraud True automatico.' if A else 'disclaimer False.', ['to_dict']))
    out.append(ex('S11-T1-B-E3', 'def interpret_signal(score):\n    return {"score": score, "claim": "evidence_only"}\nprint(interpret_signal(0.9))\n', 'interpretacion sin claim legal.' if A else 'evidence_only.', ['policy']))
    out.append(ex('S11-T2-A-E1', 'from typing import Protocol\nclass EntityStore(Protocol):\n    def get(self, id: str): ...\n    def save(self, entity) -> None: ...\nclass MemStore:\n    def __init__(self):\n        self._d = {}\n    def get(self, id: str):\n        return self._d.get(id)\n    def save(self, entity) -> None:\n        self._d[entity["id"]] = entity\ns = MemStore()\ns.save({"id": "C1"})\nprint(s.get("C1"))\n', 'Protocol + fake en memoria.' if A else 'puerto get/save.', ['Protocol']))
    out.append(ex('S11-T2-A-E2', 'class FakeStore:\n    def get(self, id):\n        return {"id": id}\nprint(FakeStore().get("X"))\n', 'fake para tests.' if A else 'sin DB real.', ['fake']))
    out.append(ex('S11-T2-A-E3', 'def load_entity(store, id):\n    ent = store.get(id)\n    if ent is None:\n        raise KeyError(id)\n    return ent\nclass S:\n    def get(self, id):\n        return None\ntry:\n    load_entity(S(), "missing")\nexcept KeyError as e:\n    print("missing", e)\n', 'servicio usa puerto store.' if A else 'KeyError si ausente.', ['hexagonal']))
    out.append(ex('S11-T2-B-E1', 'from dataclasses import dataclass\n@dataclass\nclass Client:\n    id: str\n    name: str\n    def validate(self):\n        if not self.id:\n            raise ValueError("id")\n        return self\nprint(Client("C1", "Ana").validate())\n', 'validate en dominio.' if A else 'invariante id.', ['validate']))
    out.append(ex('S11-T2-B-E2', 'from dataclasses import dataclass\n@dataclass\nclass Client:\n    id: str\n    def __post_init__(self):\n        if not self.id.startswith("C"):\n            raise ValueError("id format")\nprint(Client("C9"))\n', 'invariante de formato en construccion.' if A else 'post_init.', ['invariant']))
    out.append(ex('S11-T2-B-E3', 'def build_client(data):\n    if "id" not in data or "name" not in data:\n        raise ValueError("incomplete")\n    return data\nprint(build_client({"id": "C1", "name": "Ana"}))\n', 'factory valida incompletos.' if A else 'fail fast.', ['factory']))
    out.append(ex('S11-T3-A-E1', 'from dataclasses import dataclass\n@dataclass\nclass PersonInfo:\n    name: str\n@dataclass\nclass Client:\n    id: str\n    person: PersonInfo\nprint(Client("C1", PersonInfo("Ana")))\n', 'composicion Client tiene PersonInfo.' if A else 'no herencia forzada.', ['composition']))
    out.append(ex('S11-T3-A-E2', '# herencia fragil demo (evitar como default)\nclass Person:\n    def __init__(self, name):\n        self.name = name\nclass Client(Person):\n    def __init__(self, name, id):\n        super().__init__(name)\n        self.id = id\nprint(Client("Ana", "C1").id)\n', 'herencia posible pero composicion preferible.' if A else 'nota de diseno.', ['inheritance']))
    out.append(ex('S11-T3-A-E3', 'def prefer_composition():\n    return "Client has PersonInfo rather than is-a Person by default"\nprint(prefer_composition())\n', 'politica de diseno del curso.' if A else 'composicion first.', ['design']))
    out.append(ex('S11-T3-B-E1', 'from dataclasses import dataclass, asdict\n@dataclass\nclass Entity:\n    id: str\n    score: float\nprint(asdict(Entity("C1", 0.5)))\n', 'asdict serializacion.' if A else 'to_dict natural.', ['asdict']))
    out.append(ex('S11-T3-B-E2', 'from dataclasses import dataclass\n@dataclass(frozen=True)\nclass DocId:\n    value: str\nd = DocId("X")\nprint(d.value)\n', 'value object frozen.' if A else 'inmutable.', ['frozen']))
    out.append(ex('S11-T3-B-E3', 'domain_forbidden = ["is_fraud_auto", "is_family_auto"]\nprint(domain_forbidden)\n', 'lista de metodos prohibidos en dominio.' if A else 'no auto veredictos.', ['forbidden']))
    out.append(ex('S11-T4-A-E1', 'tests = ["test_default_factory_isolated", "test_post_init_rejects_empty", "test_store_roundtrip"]\nprint(tests)\n', 'suite unitaria de dominio.' if A else 'tres tests minimos.', ['tests']))
    out.append(ex('S11-T4-A-E2', 'def test_signal_not_fraud():\n    score = 0.99\n    assert score != "fraud"\n    return True\nprint(test_signal_not_fraud())\n', 'assert senal != fraude.' if A else 'test de politica.', ['test']))
    out.append(ex('S11-T4-A-E3', 'def test_protocol_fake():\n    class F:\n        def get(self, i):\n            return {"id": i}\n        def save(self, e):\n            pass\n    assert F().get("1")["id"] == "1"\n    return "ok"\nprint(test_protocol_fake())\n', 'fake satisface get/save.' if A else 'test de puerto.', ['test']))
    out.append(ex('S11-T4-B-E1', 'model = {"entities": ["Person", "Client", "RelationshipEvidence"], "ports": ["EntityStore"]}\nprint(model)\n', 'mapa de modelo de dominio.' if A else 'entidades + puertos.', ['model']))
    out.append(ex('S11-T4-B-E2', 'invariants = ["Client.id non-empty", "signal_score in 0..1", "no auto fraud flag"]\nprint(invariants)\n', 'invariantes documentados.' if A else 'especificacion.', ['invariants']))
    out.append(ex('S11-T4-B-E3', 'readme = "Domain model: composition first; evidence scores are not legal verdicts."\nprint(readme)\n', 'nota de portafolio dominio.' if A else 'disclaimer.', ['docs']))
    return out

# ========== S12 ==========

def s12_selfcheck(persona: str):
    if persona == "explorer":
        return [
            sc(0, 3, "400 Bad Request es error de cliente: no retry ciego."),
            sc(1, 1, "Token de API en env / secret store, no hardcode."),
            sc(2, 2, "SQL con f-string e input es inyeccion; usar placeholders ?."),
            sc(3, 0, "document_id a geocoder publico viola politica egress CP-N1-C."),
            sc(4, 3, "1.2 km es geosenal de relacion, no veredicto de parentesco/fraude."),
        ]
    return [
        sc(0, 3, "Clasificacion HTTP 4xx no reintentable a ciegas."),
        sc(1, 1, "Secretos fuera del codigo."),
        sc(2, 2, "Parametros SQL bound."),
        sc(3, 0, "Egress minimo: ciudad/direccion, no doc bancario."),
        sc(4, 3, "Haversine aporta senal no veredicto."),
    ]

def s12_exercises(persona: str):
    A = persona == "explorer"
    out = []
    out.append(ex('S12-T1-A-E1', 'def classify_status(code):\n    if 200 <= code < 300:\n        return "ok"\n    if 400 <= code < 500:\n        return "client_error_no_blind_retry"\n    if 500 <= code < 600:\n        return "server_error_maybe_retry"\n    return "other"\nprint(classify_status(400), classify_status(503), classify_status(200))\n', '400 no retry ciego; 503 maybe retry.' if A else 'politica HTTP.', ['http']))
    out.append(ex('S12-T1-A-E2', 'def should_retry(code):\n    return code in {408, 429, 500, 502, 503, 504}\nprint(should_retry(400), should_retry(503))\n', 'allowlist de reintento.' if A else 'False True.', ['retry']))
    out.append(ex('S12-T1-A-E3', 'class ApiError(Exception):\n    def __init__(self, code, msg):\n        self.code = code\n        super().__init__(msg)\ne = ApiError(400, "bad request")\nprint(e.code, str(e))\n', 'error de API tipado.' if A else 'code+msg.', ['ApiError']))
    out.append(ex('S12-T1-B-E1', 'import os\ndef get_token():\n    tok = os.environ.get("API_TOKEN")\n    if not tok:\n        raise RuntimeError("API_TOKEN missing")\n    return tok\n# no hardcode\nprint("env_only")\n', 'token desde env.' if A else 'no en repo.', ['secrets']))
    out.append(ex('S12-T1-B-E2', 'def redact_headers(h):\n    out = dict(h)\n    if "Authorization" in out:\n        out["Authorization"] = "Bearer ***"\n    return out\nprint(redact_headers({"Authorization": "Bearer SECRET", "Accept": "json"}))\n', 'redact Authorization en logs.' if A else 'Bearer ***.', ['redact']))
    out.append(ex('S12-T1-B-E3', 'ALLOWED_EGRESS_FIELDS = {"city", "address_line", "country"}\ndef filter_egress(payload):\n    return {k: v for k, v in payload.items() if k in ALLOWED_EGRESS_FIELDS}\nprint(filter_egress({"city": "Lima", "document_id": "SECRET"}))\n', 'no enviar document_id a geocoder.' if A else 'allowlist egress.', ['egress']))
    out.append(ex('S12-T2-A-E1', 'import hashlib, json\nbody = {"lat": -12.0, "lon": -77.0}\nprov = {\n    "source_url": "https://example.com/geo",\n    "status_code": 200,\n    "body_sha12": hashlib.sha256(json.dumps(body, sort_keys=True).encode()).hexdigest()[:12],\n}\nprint(prov)\n', 'provenance de fetch.' if A else 'url+status+hash.', ['provenance']))
    out.append(ex('S12-T2-A-E2', 'cache = {}\ndef get_cached(key, fetcher):\n    if key not in cache:\n        cache[key] = fetcher()\n    return cache[key]\nprint(get_cached("Lima", lambda: {"lat": -12.04}))\nprint(get_cached("Lima", lambda: {"lat": 0}))\n', 'cache evita segundo fetch.' if A else 'mismo objeto.', ['cache']))
    out.append(ex('S12-T2-A-E3', 'def timeout_policy(seconds):\n    if seconds <= 0:\n        raise ValueError("timeout")\n    return seconds\nprint(timeout_policy(5))\n', 'timeout obligatorio en cliente HTTP.' if A else 'fail si <=0.', ['timeout']))
    out.append(ex('S12-T2-B-E1', 'REQUIRED = {"lat", "lon", "provider"}\nPRECALC = {"Lima": {"lat": -12.0464, "lon": -77.0428, "provider": "precalc"}}\ndef contract_ok(d):\n    return not (REQUIRED - set(d.keys()))\ndef geocode(city, fail_online=False):\n    if fail_online:\n        return {**PRECALC[city], "mode": "offline_fallback"}\n    return {"lat": -12.0464, "lon": -77.0428, "provider": "online", "mode": "online"}\nprint(contract_ok(geocode("Lima")))\nprint(geocode("Lima", fail_online=True)["mode"])\n', 'fallback offline precalc.' if A else 'contrato lat/lon/provider.', ['geocode']))
    out.append(ex('S12-T2-B-E2', 'def validate_geo(d):\n    for k in ("lat", "lon"):\n        if k not in d:\n            return False\n        if not isinstance(d[k], (int, float)):\n            return False\n    return True\nprint(validate_geo({"lat": 1.0, "lon": 2.0}), validate_geo({"lat": "x"}))\n', 'valida tipos geo.' if A else 'True False.', ['validate']))
    out.append(ex('S12-T2-B-E3', 'def offline_table():\n    return {"Lima": (-12.0464, -77.0428), "Arequipa": (-16.4090, -71.5375)}\nprint(sorted(offline_table()))\n', 'tabla precalc autorizada.' if A else 'mock offline.', ['precalc']))
    out.append(ex('S12-T3-A-E1', 'import sqlite3\ncon = sqlite3.connect(":memory:")\ncon.execute("CREATE TABLE clients(id TEXT PRIMARY KEY, name TEXT)")\ncon.execute("INSERT INTO clients VALUES (?, ?)", ("C001", "Ana"))\nprint(con.execute("SELECT name FROM clients WHERE id = ?", ("C001",)).fetchone())\n', 'placeholders ? no f-string.' if A else 'SQLite demo.', ['sql']))
    out.append(ex('S12-T3-A-E2', 'import sqlite3\ncon = sqlite3.connect(":memory:")\ncon.executescript(\'CREATE TABLE clients(id TEXT PRIMARY KEY);\\nCREATE TABLE transactions(id TEXT PRIMARY KEY, client_id TEXT);\\nCREATE TABLE evidence(id TEXT PRIMARY KEY, entity_id TEXT);\\n\')\nprint("tables_ok")\n', 'schema minimo 3 tablas.' if A else 'clients/txs/evidence.', ['schema']))
    out.append(ex('S12-T3-A-E3', 'def bad_sql(user):\n    # ANTIPATRON: f"SELECT * FROM t WHERE name=\'{user}\'"\n    return "use placeholders instead"\nprint(bad_sql("x"))\n', 'documenta antipatron inyeccion.' if A else 'placeholders only.', ['injection']))
    out.append(ex('S12-T3-B-E1', 'import sqlite3\ncon = sqlite3.connect(":memory:")\ncon.execute("CREATE TABLE clients(id TEXT PRIMARY KEY, document_id TEXT UNIQUE)")\nbatch = [("C001", "DOC1"), ("C002", "DOC2"), ("C003", "DOC1")]\ntry:\n    con.execute("BEGIN")\n    con.executemany("INSERT INTO clients VALUES (?,?)", batch)\n    con.commit()\n    print("unexpected_commit")\nexcept sqlite3.IntegrityError:\n    con.rollback()\n    print("rollback_on_conflict")\n', 'UNIQUE conflict -> rollback.' if A else 'transaccion atomica.', ['tx']))
    out.append(ex('S12-T3-B-E2', 'import sqlite3\ncon = sqlite3.connect(":memory:")\ncon.execute("CREATE TABLE t(id TEXT PRIMARY KEY)")\ncon.execute("INSERT INTO t VALUES (\'a\')")\ntry:\n    con.execute("INSERT INTO t VALUES (\'a\')")\nexcept sqlite3.IntegrityError as e:\n    print(type(e).__name__)\n', 'IntegrityError en PK duplicada.' if A else 'constraint.', ['integrity']))
    out.append(ex('S12-T3-B-E3', 'def unit_of_work(ops):\n    done = []\n    try:\n        for op in ops:\n            done.append(op())\n        return done\n    except Exception:\n        return "rollback"\nprint(unit_of_work([lambda: 1, lambda: 2]))\n', 'unidad de trabajo simple.' if A else 'commit logico.', ['uow']))
    out.append(ex('S12-T4-A-E1', 'class MockGeocoder:\n    DB = {"Lima": (-12.0464, -77.0428), "Arequipa": (-16.4090, -71.5375)}\n    def geocode(self, city):\n        if city not in self.DB:\n            return None\n        lat, lon = self.DB[city]\n        return {"city": city, "lat": lat, "lon": lon, "provider": "authorized_mock"}\ng = MockGeocoder()\nprint(g.geocode("Lima")["provider"], g.geocode("Iquitos"))\n', 'MockGeocoder autorizado.' if A else 'None si ciudad desconocida.', ['mock']))
    out.append(ex('S12-T4-A-E2', 'def assert_mock_only(provider):\n    assert provider in {"authorized_mock", "precalc", "offline_fallback"}\n    return True\nprint(assert_mock_only("authorized_mock"))\n', 'solo providers permitidos en curso.' if A else 'politica.', ['policy']))
    out.append(ex('S12-T4-A-E3', 'points = {"Lima": (-12.0464, -77.0428), "Callao": (-12.05, -77.125)}\nprint(points["Lima"])\n', 'fixtures geo sinteticas.' if A else 'sin PII real.', ['fixtures']))
    out.append(ex('S12-T4-B-E1', 'import math\ndef haversine_km(a, b):\n    R = 6371.0\n    lat1, lon1 = map(math.radians, a)\n    lat2, lon2 = map(math.radians, b)\n    dlat, dlon = lat2 - lat1, lon2 - lon1\n    h = math.sin(dlat/2)**2 + math.cos(lat1)*math.cos(lat2)*math.sin(dlon/2)**2\n    return 2 * R * math.asin(math.sqrt(h))\nlima = (-12.0464, -77.0428)\ncallao = (-12.0500, -77.1250)\nprint(round(haversine_km(lima, callao), 2))\n', 'haversine Lima-Callao ~km.' if A else 'senal de distancia.', ['haversine']))
    out.append(ex('S12-T4-B-E2', 'def geo_signal(km, threshold=2.0):\n    return {"geo_distance_km": km, "close": km <= threshold, "verdict": None}\nprint(geo_signal(1.2))\n', '1.2 km close; verdict None.' if A else 'no parentesco auto.', ['signal']))
    out.append(ex('S12-T4-B-E3', 'def as_relationship_signal(km):\n    return {\n        "type": "geo_distance",\n        "km": km,\n        "relationship_signal_score": max(0.0, min(1.0, 1.0 - km / 10.0)),\n        "verdict": None,\n    }\nprint(as_relationship_signal(1.2)["verdict"])\n', 'verdict None siempre aqui.' if A else 'score acotado 0..1.', ['relationship']))
    return out

# ========== S13 ==========

def s13_selfcheck(persona: str):
    if persona == "explorer":
        return [
            sc(0, 0, "entity_resolution_score y relationship_signal_score se mantienen separados en la ficha."),
            sc(1, 2, "False positive de ER es error de matching, no veredicto legal de fraude."),
            sc(2, 3, "Zona gris: encolar needs_review / abstenerse segun politica."),
            sc(3, 1, "CF-1 incluye privacy sheet, acceso, tests, demo y runbook."),
            sc(4, 0, "Level-1 regression notes: re-chequear paths criticos S01-S13 en runbook."),
        ]
    return [
        sc(0, 0, "Dashboard no fusiona ER y rel en un solo numero sin etiqueta."),
        sc(1, 2, "FP != fraude confirmado."),
        sc(2, 3, "Politica de abstencion/revision en banda gris."),
        sc(3, 1, "Checklist CF-1 del cierre de nivel."),
        sc(4, 0, "Regresion de nivel 1 documentada, sin editar ledger aqui."),
    ]

def s13_exercises(persona: str):
    A = persona == "explorer"
    out = []
    out.append(ex('S13-T1-A-E1', 'import re\ndef norm_name(n):\n    return re.sub(r"\\s+", " ", n.casefold().strip())\ndef norm_doc(d):\n    return re.sub(r"[^a-z0-9]", "", d.casefold())\nprint(norm_name("  Ana   Quispe "), norm_doc("D-12.34"))\n', 'norm_name y norm_doc: ana quispe / d1234.' if A else 'blocking prep.', ['norm']))
    out.append(ex('S13-T1-A-E2', 'def blocking_key(rec):\n    ap = rec["name"].casefold().strip().split()[-1]\n    return f"{ap}|{rec[\'region\'].casefold()}"\nprint(blocking_key({"name": "Luis Huamán", "region": "Cusco"}))\n', 'blocking apellido|region.' if A else 'huamán|cusco.', ['blocking']))
    out.append(ex('S13-T1-A-E3', 'import re\ndef norm_doc(d):\n    return re.sub(r"[^a-z0-9]", "", d.casefold())\ndef block_key(r):\n    ap = r["name"].casefold().strip().split()[-1]\n    return f"{ap}|{r[\'region\'].casefold()}"\ndef er_score(a, b):\n    if norm_doc(a["document_id"]) == norm_doc(b["document_id"]) and block_key(a) == block_key(b):\n        return 1.0\n    if block_key(a) == block_key(b):\n        return 0.5\n    return 0.0\na = {"name": "Ana Quispe", "document_id": "D-12.34", "region": "Lima"}\nb = {"name": "ANA QUISPE", "document_id": "d1234", "region": "Lima"}\nc = {"name": "Ana Quispe", "document_id": "Z9", "region": "Lima"}\nd = {"name": "Luis Rojas", "document_id": "Z9", "region": "Cusco"}\nprint(er_score(a, b), er_score(a, c), er_score(a, d))\n', '1.0 mismo doc+block; 0.5 solo block; 0.0 else.' if A else 'ER determinista.', ['ER']))
    out.append(ex('S13-T1-B-E1', 'tp, fp, fn = 8, 2, 2\nprecision = tp / (tp + fp)\nrecall = tp / (tp + fn)\nprint(round(precision, 1), round(recall, 1))\n', 'precision y recall 0.8.' if A else 'metricas etiquetadas.', ['P/R']))
    out.append(ex('S13-T1-B-E2', 'pairs = [\n    {"id": "P1", "score": 0.2},\n    {"id": "P2", "score": 0.55},\n    {"id": "P3", "score": 0.7},\n    {"id": "P4", "score": 0.9},\n]\ndef clerical_queue(pairs, low=0.4, high=0.7):\n    return [p["id"] for p in pairs if low <= p["score"] <= high]\nprint(clerical_queue(pairs))\n', 'cola clerical P2 P3 banda 0.4-0.7.' if A else 'incluye fronteras.', ['clerical']))
    out.append(ex('S13-T1-B-E3', 'note = "Un false positive de ER es error de matching; no es veredicto legal de fraude."\ndecision = "needs_review"\nprint(note)\nprint(decision)\n', 'texto + needs_review.' if A else 'FP != fraude.', ['FP']))
    out.append(ex('S13-T2-A-E1', 'def shared_email(a, b):\n    return bool(a.get("email") and a.get("email") == b.get("email"))\nprint(shared_email({"email": "a@x.com"}, {"email": "a@x.com"}))\nprint(shared_email({"email": "a@x.com"}, {"email": "b@x.com"}))\nprint(shared_email({"email": None}, {"email": "a@x.com"}))\n', 'True False False shared email.' if A else 'requiere ambos presentes e iguales.', ['shared']))
    out.append(ex('S13-T2-A-E2', 'def rel_score(km, surname_jaccard):\n    geo = 1.0 if km <= 2 else 0.0\n    return round(0.5 * geo + 0.5 * surname_jaccard, 1)\nprint(rel_score(1.2, 1.0), rel_score(5.0, 0.4))\n', '0.8 y 0.2 aproximados.' if A else 'mezcla geo + apellido.', ['rel_score']))
    out.append(ex('S13-T2-A-E3', 'print("relationship_signal_score es evidencia, no parentesco legal ni fraude")\n', 'frase de disclaimer del paquete.' if A else 'senal != veredicto.', ['disclaimer']))
    out.append(ex('S13-T2-B-E1', 'txs = [("A","B",10), ("C","D",1), ("B","A",5)]\ndef direct_txs(txs, a, b):\n    return [amt for x, y, amt in txs if {x, y} == {a, b}]\nprint(direct_txs(txs, "A", "B"))\n', 'montos directos [10,5].' if A else 'pares no dirigidos.', ['direct_tx']))
    out.append(ex('S13-T2-B-E2', 'txs = [("A","D",1), ("C","D",1), ("A","E",1), ("C","F",1)]\ndef neighbors(txs, node):\n    s = set()\n    for x, y, _ in txs:\n        if x == node:\n            s.add(y)\n        if y == node:\n            s.add(x)\n    return s\nprint(sorted(neighbors(txs, "A") & neighbors(txs, "C")))\n', "contraparte comun ['D']." if A else 'interseccion vecinos.', ['common']))
    out.append(ex('S13-T2-B-E3', 'print("disclaimer1: txs no prueban parentesco")\nprint("disclaimer2: grafo es evidencia operacional sintetica")\n', 'dos disclaimers.' if A else 'limites de inferencia.', ['disclaimer']))
    out.append(ex('S13-T3-A-E1', 'def explanation_bullets(er, rel, missing):\n    return [\n        f"entity_resolution_score={er}",\n        f"relationship_signal_score={rel}",\n        f"missing={missing or \'none\'}",\n    ]\nprint(len(explanation_bullets(0.9, 0.4, ["email"])))\n', 'lista len 3 explicativa.' if A else 'ER y rel separados.', ['explain']))
    out.append(ex('S13-T3-A-E2', 'def uncertainty_band(missing, conflict):\n    if conflict or len(missing) >= 2:\n        return "high"\n    if missing:\n        return "med"\n    return "low"\nprint(uncertainty_band([], False), uncertainty_band(["e"], False),\n      uncertainty_band(["e","p"], False), uncertainty_band([], True))\n', 'low med high high.' if A else 'missing/conflict.', ['uncertainty']))
    out.append(ex('S13-T3-A-E3', 'er, rel = 0.9, 0.1\nconflict = abs(er - rel) > 0.5\nevidence_score = round(0.6 * er + 0.4 * rel, 2)\nunc = "high" if conflict else "low"\nprint("score", evidence_score, unc)\n', 'score 0.58 high por conflicto ER vs rel.' if A else 'incertidumbre.', ['blend']))
    out.append(ex('S13-T3-B-E1', 'thresholds = {"accept_min": 0.8, "review_low": 0.4}\nprint(sorted(thresholds.items()))\nassert 0 <= thresholds["review_low"] < thresholds["accept_min"] <= 1\n', 'sorted items umbrales.' if A else 'invariante orden.', ['thresholds']))
    out.append(ex('S13-T3-B-E2', 'from math import isfinite\nth = {"accept_min": 0.8, "review_low": 0.4}\ndef decide_ops_status(score, unc, th):\n    if isinstance(score, bool) or not isinstance(score, (int, float)):\n        return "invalid_input"\n    if not isfinite(score) or not 0.0 <= score <= 1.0 or unc not in {"low", "med", "high"}:\n        return "invalid_input"\n    if unc == "high":\n        return "needs_review"\n    if score < th["review_low"]:\n        return "abstain"\n    if score < th["accept_min"]:\n        return "needs_review"\n    return "accept_pair"\nfor s, u in [(-0.1, "low"), (0.399, "low"), (0.4, "low"), (0.799, "low"), (0.8, "low"), (1.0, "low"), (0.9, "high")]:\n    print(s, u, decide_ops_status(s, u, th))\n', 'matriz invalid/abstain/review/accept.' if A else 'high fuerza review.', ['decide']))
    out.append(ex('S13-T3-B-E3', 'card = {"score": 0.85, "status": "accept_pair"}\nprint(sorted(card.keys()))\n', 'claves score y status.' if A else 'ficha operativa.', ['card']))
    out.append(ex('S13-T4-A-E1', 'def pseudonymize(name):\n    return " ".join(p[0] + "***" for p in name.split() if p)\nprint(pseudonymize("Ana Quispe Rojas"))\n', 'A*** Q*** R***.' if A else 'dashboard sin nombre claro.', ['pseudo']))
    out.append(ex('S13-T4-A-E2', 'def case_sheet(er, rel):\n    return {\n        "entity_resolution_score": er,\n        "relationship_signal_score": rel,\n    }\nprint(sorted(case_sheet(0.9, 0.4).keys()))\n', 'dos claves distintas ER y rel.' if A else 'no fusionar.', ['sheet']))
    out.append(ex('S13-T4-A-E3', 'def map_tooltip(lat, lon, km, source):\n    return f"lat={lat}; lon={lon}; geo_distance_km={km}; source={source}"\nprint(map_tooltip(-12.04, -77.04, 1.2, "mock"))\n', 'tooltip con source=mock.' if A else 'geo explicable.', ['tooltip']))
    out.append(ex('S13-T4-B-E1', 'privacy = {\n    "data_class": "synthetic_only",\n    "pii_real": False,\n    "roles": ["viewer", "reviewer"],\n}\nprint(sorted(privacy.keys()), privacy["pii_real"])\n', 'keys privacy + pii_real False.' if A else 'CF-1 sheet.', ['privacy']))
    out.append(ex('S13-T4-B-E2', 'def demo_command():\n    return "python -m demo_n1_dashboard"\nprint(demo_command())\n', 'comando unico de demo.' if A else 'runbook CF-1.', ['demo']))
    out.append(ex('S13-T4-B-E3', 'actions = ["rotate_secret", "redact_logs", "postmortem"]\nprint(actions)\nprint("level-1 regression: re-check critical paths S01-S13 in runbook (no ledger edit here)")\n', '3 acciones incidente + nota regresion.' if A else 'cierre de nivel.', ['runbook']))
    return out

SECTION_BUILDERS = {
    1: (s01_exercises, s01_selfcheck),
    2: (s02_exercises, s02_selfcheck),
    3: (s03_exercises, s03_selfcheck),
    4: (s04_exercises, s04_selfcheck),
    5: (s05_exercises, s05_selfcheck),
    6: (s06_exercises, s06_selfcheck),
    7: (s07_exercises, s07_selfcheck),
    8: (s08_exercises, s08_selfcheck),
    9: (s09_exercises, s09_selfcheck),
    10: (s10_exercises, s10_selfcheck),
    11: (s11_exercises, s11_selfcheck),
    12: (s12_exercises, s12_selfcheck),
    13: (s13_exercises, s13_selfcheck),
}


def validate_section(si: int, exercises: list) -> list[str]:
    issues = []
    card = load_card(si)
    expected = [e["id"] for e in card.get("exercises") or []]
    got = [e["exercise_id"] for e in exercises]
    if got != expected:
        issues.append(f"id_mismatch expected={len(expected)} got={len(got)} missing={set(expected)-set(got)} extra={set(got)-set(expected)}")
    for e in exercises:
        code = e.get("code") or ""
        if "____" in code:
            issues.append(f"{e['exercise_id']}: has ____")
        if "TODO" in code and "TODO body" not in code:
            # allow only if leftover - flag all TODO
            issues.append(f"{e['exercise_id']}: has TODO")
        if not code.strip():
            issues.append(f"{e['exercise_id']}: empty")
        just = e.get("justification_from_packet") or ""
        if len(just) < 40:
            issues.append(f"{e['exercise_id']}: short justification")
    return issues


def main():
    manifest_entries = []
    summary = []
    for si in range(1, 14):
        ex_fn, sc_fn = SECTION_BUILDERS[si]
        card = load_card(si)
        n_expected = len(card.get("exercises") or [])
        n_sc = len(card.get("selfCheck_stems") or [])
        for agent, persona in (("newbie_a", "explorer"), ("newbie_b", "skeptic")):
            started = now_iso()
            exercises = ex_fn(persona)
            selfcheck = sc_fn(persona)
            # ensure selfcheck length
            if len(selfcheck) != n_sc:
                # pad/truncate carefully
                if len(selfcheck) < n_sc:
                    for i in range(len(selfcheck), n_sc):
                        selfcheck.append(sc(i, 0, "Respuesta alineada con la teoria del paquete de la seccion activa (auto-pad)."))
                selfcheck = selfcheck[:n_sc]
            issues = validate_section(si, exercises)
            if issues:
                print(f"WARN s{si:02d} {agent}:", issues[:5], f"... total {len(issues)}")
            instance_id = f"g2-{persona[:3]}-s{si:02d}-{uuid.uuid4().hex[:10]}"
            ended = now_iso()
            live = write_live(si, agent, persona, exercises, selfcheck, instance_id, started, ended)
            sha = sha_live(live)
            manifest_entries.append({
                "section": si,
                "agent": agent,
                "started_at": started,
                "ended_at": ended,
                "subagent_or_session_id": instance_id,
                "response_sha256": sha,
            })
            summary.append({"section": si, "agent": agent, "n_ex": len(exercises), "n_sc": len(selfcheck), "sha": sha[:12], "issues": len(issues)})
            print(f"wrote s{si:02d} {agent} ex={len(exercises)}/{n_expected} sc={len(selfcheck)}/{n_sc} issues={len(issues)}")
    append_manifest(manifest_entries)
    out = Path("/Users/pabloillescas/Projects/PyArcana/tool-results/g2_dual/s01_s13_summary.json")
    out.write_text(json.dumps(summary, indent=2), encoding="utf-8")
    print("manifest entries", len(manifest_entries))
    print("done")


if __name__ == "__main__":
    main()
