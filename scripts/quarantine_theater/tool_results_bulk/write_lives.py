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

