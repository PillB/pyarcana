import type { CourseSection } from '../../types'

export const section10: CourseSection = {
  // Platform id `sklearn` is legacy stable for routing only — never surface to learners.
  id: "sklearn",
  index: 10,
  title: "Módulos, packaging y CLI profesional",
  shortTitle: "Módulos & CLI",
  tagline: "Paquete familiarity_core con CLI ingest/normalize/compare/report y config por precedencia",
  estimatedHours: 18,
  level: "Intermedio",
  phase: 0,
  icon: "Package",
  accentColor: "bg-gradient-to-br from-red-500 to-rose-600",
  jobRelevance:
    "Empaquetar un ETL en un CLI instalable es lo que separa un notebook suelto de una herramienta usable por el equipo. Aquí conviertes el pipeline de familiaridad en el paquete **familiarity_core**: módulos limpios, `pyproject.toml`, subcomandos y config por precedencia — cierre de empaquetado de **CP-N1-B** y base de **CP-N1-C**.",
  learningOutcomes: [
    { text: "Organizar imports, evitar ciclos y usar if __name__ == '__main__'" },
    { text: "Definir API pública estable y helpers privados" },
    { text: "Crear paquete instalable con layout src y pyproject.toml" },
    { text: "Aplicar semver simple y requires-python / deps con criterio" },
    { text: "Implementar subcomandos argparse con exit codes 0/1/2" },
    { text: "Separar stdout (datos) de stderr (diagnóstico)" },
    { text: "Implementar precedencia flags > env > archivo > defaults" },
    { text: "Mantener secretos fuera del repo y validar config al arranque" },
  ],
  theory: [
    {
      heading: "Del notebook suelto al paquete instalable (mapa)",
      paragraphs: [
        "Hasta S09 tu lógica vive en scripts y módulos sueltos. Aquí empaquetas **familiarity_core**: imports estables, **pyproject.toml**, **CLI** con subcomandos y **config por precedencia** — la herramienta que el equipo puede `pip install -e .` y correr sin notebook.",
        "Integra el ETL de CP-N1-B (S08) y la observabilidad de S09 (logs sin PII, exit codes). Entorno local con stdlib: argparse, pathlib y metadata de empaquetado. Fail-closed si config o schema no cuadran al arranque.",
        "Orden: **T1 Módulos** → **T2 Paquetes** → **T3 CLI** → **T4 Configuración**. Caso de lab: CLI local con datos sintéticos y exit codes 0/1/2 — **nunca** PII real ni claims de fraude.",
      ],
      callout: {
        type: "info",
        title: "CP-N1-B empaquetado / base CP-N1-C",
        content:
          "Gate: CLI ingest|normalize|compare|report; install editable; ayuda útil; lógica separada de I/O.",
      },
    },
    {
      heading: "Imports, namespaces y __main__",
      subtopicId: "S10-T1-A",
      paragraphs: [
        "`import pkg.mod` y `from pkg.mod import name` cargan el módulo **una vez** en `sys.modules`. **`__name__`** es el nombre del módulo, o `'__main__'` si se ejecuta como script. Ejecutar `python -m familiarity_core` usa el paquete como `__main__` sin pelear con `sys.path`.",
        "`if __name__ == '__main__':` protege el CLI/demo para que **no** corra al importar. **`__all__`** documenta la API pública (y comunica intención). Fail-closed si el schema de config no cuadra al arranque.",
        "Los **imports circulares** se rompen extrayendo un tercer módulo compartido, con lazy import o invirtiendo la dirección de dependencias. **Prefiere diseño a hacks**: si A y B se necesitan mutuamente, el util común es el primer recurso — no `import` dentro de cada método salvo como último recurso documentado.",
      ],
      code: {
        language: 'python',
        title: "main_guard.py",
        code: `# simulación en un solo archivo
__all__ = ["normalize_name"]

def normalize_name(s: str) -> str:
    return " ".join(s.split()).casefold()

def _cli() -> None:
    print(normalize_name("  Ana  PEREZ "))

# Camino import: la API es usable sin side-effects de CLI
print("import_safe", normalize_name("José"))

# Camino script: solo aquí corre el entrypoint
if __name__ == "__main__":
    _cli()`,
        output: `import_safe josé
ana perez`,
      },
      callout: {
        type: "tip",
        title: "python -m",
        content:
          "Ejecutar `python -m familiarity_core` usa el paquete como __main__ sin pelear con sys.path.",
      },
    },
    {
      heading: "Dependencias cíclicas y API pública",
      subtopicId: "S10-T1-B",
      paragraphs: [
        "Prefijo `_` marca helpers **privados** (convención). La fachada (`__init__.py` o `api.py`) reexporta solo lo **estable**. Si un usuario importa `_strip`, mañana no puedes renombrarlo sin romperlo.",
        "Una **API pública pequeña** (p. ej. 4 símbolos: normalize, compare, report…) reduce breaking changes. Semver simple: **añadir** es minor; **renombrar/eliminar** es major. Fail-closed en contratos rotos.",
        "Lazy import dentro de funciones evita ciclos y acelera el import del paquete cuando un submódulo es pesado (p. ej. un parser opcional). Úsalo con intención: la API pública sigue en `__all__`, pero el módulo pesado se carga solo al primer uso.",
      ],
      code: {
        language: 'python',
        title: "public_api.py",
        code: `def _strip(s: str) -> str:
    return s.strip()

def normalize(s: str) -> str:
    return _strip(s).casefold()

def compare(a: str, b: str) -> bool:
    return normalize(a) == normalize(b)

__all__ = ["normalize", "compare"]
print("public", __all__)
print(compare(" Ana ", "ana"))`,
        output: `public ['normalize', 'compare']
True`,
      },
      callout: {
        type: "warning",
        title: "No exportes _internals",
        content:
          "Si un usuario importa `_strip`, mañana no puedes renombrarlo sin romperlo.",
      },
    },
    {
      heading: "Layout src, pyproject.toml y builds",
      subtopicId: "S10-T2-A",
      paragraphs: [
        "Layout **src/**: `src/familiarity_core/...` evita importar el paquete desde el repo **sin** instalar. `pyproject.toml` declara name, version, requires-python y el build backend (setuptools/hatchling).",
        "`pip install -e .` instala en **editable**: cambias código y el import refleja al toque. Ideal en desarrollo del CLI del gate CP-N1-B/C. Fail-closed si metadata falta (`name`, `version`).",
        "Si ves `ModuleNotFoundError` post-install, revisa en este orden: (1) ¿`pip install -e .` en el venv activo?, (2) ¿el nombre de import coincide con la carpeta bajo `src/`?, (3) ¿un script homónimo en el cwd tapa el paquete en `sys.path`?",
      ],
      code: {
        language: 'python',
        title: "pyproject_min.py",
        code: `def s10_th_3():
    # Representamos el pyproject mínimo que luego copiarás como TOML real
    toml = '''
[build-system]
requires = ["setuptools>=61"]
build-backend = "setuptools.build_meta"

[project]
name = "familiarity-core"
version = "0.1.0"
requires-python = ">=3.11"
dependencies = []
'''
    print(toml.strip())
    print("layout", "src/familiarity_core/__init__.py")

s10_th_3()`,
        output: `[build-system]
requires = ["setuptools>=61"]
build-backend = "setuptools.build_meta"

[project]
name = "familiarity-core"
version = "0.1.0"
requires-python = ">=3.11"
dependencies = []
layout src/familiarity_core/__init__.py`,
      },
      callout: {
        type: "info",
        title: "stdlib first",
        content:
          "En N1 el paquete puede no depender de terceros; declara deps solo cuando existan.",
      },
    },
    {
      heading: "Versionado y compatibilidad",
      subtopicId: "S10-T2-B",
      paragraphs: [
        "**SemVer** simple: MAJOR.MINOR.PATCH. Breaking → major; feature compatible → minor; fix → patch. En 0.x es más flexible, pero **documenta igual**. Renombrar API pública de normalizers es major para consumidores del paquete.",
        "`requires-python` y dependencies pinadas con criterio (mínimos, no caos de upper bounds sin razón). Fail-closed si falta metadata en pyproject.",
        "Un **CHANGELOG** real, aunque breve (Added/Changed/Fixed), evita amnesia entre sprints. Breaking de firma pública se **anuncia** con versión major y nota de migración; deprecar un símbolo un minor antes reduce el dolor del major.",
      ],
      code: {
        language: 'python',
        title: "semver_bump.py",
        code: `def bump(version: str, level: str) -> str:
    maj, minor, patch = map(int, version.split("."))
    if level == "major":
        return f"{maj+1}.0.0"
    if level == "minor":
        return f"{maj}.{minor+1}.0"
    if level == "patch":
        return f"{maj}.{minor}.{patch+1}"
    raise ValueError(level)

print("0.1.0 + feature subcomando", bump("0.1.0", "minor"))
print("0.2.0 + fix help text", bump("0.2.0", "patch"))
print("1.0.0 + rename API", bump("1.0.0", "major"))`,
        output: `0.1.0 + feature subcomando 0.2.0
0.2.0 + fix help text 0.2.1
1.0.0 + rename API 2.0.0`,
      },
      callout: {
        type: "tip",
        title: "Hacia S11",
        content:
          "En S11 modelarás entidades de dominio (p. ej. un futuro `ClientRecord`). Si renombras un tipo o firma pública del paquete, es breaking: documenta migración y sube major.",
      },
    },
    {
      heading: "argparse, subcomandos y exit codes",
      subtopicId: "S10-T3-A",
      paragraphs: [
        "`argparse.ArgumentParser` + **subparsers** modelan `ingest|normalize|compare|report`. Cada subcomando tiene flags propios y `help=` en español claro para operadores.",
        "Exit codes: **0** éxito, **2** uso/CLI inválido (argparse default), **1** error de runtime/negocio. Scripts y CI **dependen** de esto — no devuelvas siempre 0.",
        "Separa el parse de args de la lógica: `main(argv) -> int` retorna el código; el entrypoint hace `sys.exit(main())`. Así puedes unit-testear `main([...])` sin spawn de proceso y simular usage errors (código 2) con argv inválidos.",
      ],
      code: {
        language: 'python',
        title: "argparse_subs.py",
        code: `import argparse

def build_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(prog="familiarity")
    sub = p.add_subparsers(dest="cmd", required=True)
    sub.add_parser("ingest", help="ingerir archivos")
    n = sub.add_parser("normalize", help="normalizar registros")
    n.add_argument("--field", default="name")
    sub.add_parser("compare")
    r = sub.add_parser("report")
    r.add_argument("--format", choices=["text", "json"], default="text")
    return p

def try_parse(argv: list[str]) -> int:
    """0 = parse OK; 2 = uso inválido (argparse)."""
    try:
        ns = build_parser().parse_args(argv)
        print(ns)
        return 0
    except SystemExit as e:
        code = int(e.code) if e.code is not None else 2
        print("usage_error exit", code)
        return code

print("code", try_parse(["normalize", "--field", "email"]))
print("code", try_parse(["report", "--format", "json"]))
print("code", try_parse([]))  # sin subcomando → exit 2`,
        output: `Namespace(cmd='normalize', field='email')
code 0
Namespace(cmd='report', format='json')
code 0
usage_error exit 2
code 2`,
      },
      callout: {
        type: "tip",
        title: "Ayuda humana",
        content:
          "help= y epilog en español claro reducen tickets de operadores.",
      },
    },
    {
      heading: "stdin/stdout/stderr y ayuda",
      subtopicId: "S10-T3-B",
      paragraphs: [
        "**stdout** = datos (JSON, CSV). **stderr** = logs y progreso. Así `cmd > out.json` **no** contamina el archivo. Un `print('ok')` extra rompe el pipe de quien parsea JSON.",
        "Soportar path o **`-`** para stdin habilita pipes: `cat data.json | familiarity normalize`. Fail-closed si el schema de entrada no cuadra.",
        "No mezcles `print` de debug en stdout. Progress y logs (S09) van a **stderr**. Si un operador hace `familiarity report --manifest m.json > out.json`, cualquier `print('ok')` extra rompe el JSON del pipe.",
      ],
      code: {
        language: 'python',
        title: "stdio_split.py",
        code: `from io import StringIO

def normalize_stream(inp: str) -> str:
    return inp.strip().casefold()

# simula: datos a stdout, log a stderr (capturado para la demo)
data_in = "  Ana Perez  "
log = StringIO()
log.write("stage=normalize event=start\\n")
out = normalize_stream(data_in)
log.write("stage=normalize event=done\\n")
print(out)  # stdout = datos
print("--- stderr ---")
print(log.getvalue().strip())`,
        output: `ana perez
--- stderr ---
stage=normalize event=start
stage=normalize event=done`,
      },
      callout: {
        type: "warning",
        title: "Contaminación de stdout",
        content:
          "Un print('ok') extra rompe el pipe de quien parsea JSON.",
      },
    },
    {
      heading: "Archivo/env/flags y precedencia",
      subtopicId: "S10-T4-A",
      paragraphs: [
        "Precedencia canónica: **flags CLI > variables de entorno > archivo de config > defaults**. Documenta la tabla en README — sin sorpresas en ops.",
        "Un flag `--log-level` debe ganar a `FAMILIARITY_LOG_LEVEL`. Trata `None` en flags como “no pasado” para no pisar env con nulls.",
        "Implementa un `merge_config` **puro y testeable**: dicts por capa, reduce de menor a mayor prioridad. Casos de borde: `None` en flags significa “no pasado” (no pisa env); una clave solo en defaults sobrevive si nadie la redefine.",
      ],
      code: {
        language: 'python',
        title: "config_merge.py",
        code: `def merge_config(defaults, file_cfg, env_cfg, flags):
    out = {}
    out.update(defaults)
    out.update({k: v for k, v in file_cfg.items() if v is not None})
    out.update({k: v for k, v in env_cfg.items() if v is not None})
    out.update({k: v for k, v in flags.items() if v is not None})
    return out

cfg = merge_config(
    {"log_level": "INFO", "jobs": 1},
    {"log_level": "WARNING"},
    {"log_level": "DEBUG"},
    {"log_level": "ERROR"},
)
print(cfg)`,
        output: `{'log_level': 'ERROR', 'jobs': 1}`,
      },
      callout: {
        type: "info",
        title: "None vs missing",
        content:
          "Trata None en flags como 'no pasado' para no pisar env con nulls.",
      },
    },
    {
      heading: "Secretos, defaults y validación temprana",
      subtopicId: "S10-T4-B",
      paragraphs: [
        "Secretos **fuera del repo**: `.env` en `.gitignore`, **nunca** en logs (S09). El ETL local de este nivel **no inventa un API token**. Defaults seguros (log level INFO, no debug con PII).",
        "`validate_config()` al arranque reporta qué clave falta y qué subcomando la exige: `input_path` para ingest y `manifest_path` para report. Fail-closed — no proceses a ciegas.",
        "Fail-fast de config evita procesar 10k filas con un path mal tipeado. Mensaje de error: nombra la **clave** y el **subcomando** (`config: falta input_path para ingest`); jamás imprimas el valor de un token en traceback aunque el adaptador remoto lo tenga en memoria.",
      ],
      code: {
        language: 'python',
        title: "validate_config.py",
        code: `def validate_config(cfg: dict, command: str) -> None:
    required_always = ["log_level"]
    for k in required_always:
        if not cfg.get(k):
            raise RuntimeError(f"config: falta {k}")
    required_by_command = {"ingest": "input_path", "report": "manifest_path"}
    required = required_by_command.get(command)
    if required and not cfg.get(required):
        raise RuntimeError(f"config: falta {required} para {command}")

validate_config({"log_level": "INFO"}, "normalize")
print("normalize ok")
try:
    validate_config({"log_level": "INFO"}, "ingest")
except RuntimeError as e:
    print(e)`,
        output: `normalize ok
config: falta input_path para ingest`,
      },
      callout: {
        type: "danger",
        title: "Secretos",
        content:
          "No agregues secretos que el comando local no usa. Si un adaptador remoto usa token, valídalo solo allí y jamás lo incluyas en traceback/log.",
      },
    },
  ],
  iDo: {
    intro: "Ocho demos I Do (uno por subtema, orden T1→T4). Cada demo muestra el mecanismo que luego practicarás en We Do: módulos y API, layout/src + SemVer, argparse con exit codes, stdio limpio y config por precedencia. Solo stdlib; datos sintéticos.",
    steps: [
      {
        demoId: "S10-T1-A-DEMO",
        subtopicId: "S10-T1-A",
        environment: "local-python",
        description: "Separar normalize y cli en funciones; demo con guard __main__.",
        code: {
          language: 'python',
          title: "normalize_cli_split.py",
          code: `__all__ = ["normalize"]

def normalize(text: str) -> str:
    return " ".join(text.split()).casefold()

def main(argv=None) -> int:
    import sys
    args = argv if argv is not None else ["  Ana  "]
    print(normalize(args[0]))
    return 0

# al importar no corre main; lo invocamos explícito
assert normalize("X") == "x"
raise SystemExit(main(["  José Pérez "]))`,
          output: `josé pérez`,
        },
        why: "La lógica vive en normalize; el entrypoint solo orquesta.",
      },
      {
        demoId: "S10-T1-B-DEMO",
        subtopicId: "S10-T1-B",
        environment: "local-python",
        description: "Fachada que exporta solo 4 símbolos públicos.",
        code: {
          language: 'python',
          title: "facade_exports.py",
          code: `def _private_token(s: str) -> list[str]:
    return s.split()

def normalize(s: str) -> str:
    return " ".join(_private_token(s)).casefold()

def compare(a: str, b: str) -> float:
    return 1.0 if normalize(a) == normalize(b) else 0.0

def ingest_row(row: dict) -> dict:
    return {**row, "name": normalize(row.get("name", ""))}

def report(rows: list) -> int:
    return len(rows)

__all__ = ["normalize", "compare", "ingest_row", "report"]
print("exports", __all__)
print(compare("Ana", " ana "))
print(report([ingest_row({"name": " Luis "})]))`,
          output: `exports ['normalize', 'compare', 'ingest_row', 'report']
1.0
1`,
        },
        why: "Cuatro símbolos estables; helpers con _ fuera de la API.",
      },
      {
        demoId: "S10-T2-A-DEMO",
        subtopicId: "S10-T2-A",
        environment: "local-python",
        description: "Layout src + claves del pyproject mínimo que harán `pip install -e .` usable.",
        code: {
          language: 'python',
          title: "src_layout.py",
          code: `def s10_ido_3():
    from pathlib import PurePosixPath

    layout = [
        "src/familiarity_core/__init__.py",
        "src/familiarity_core/normalize.py",
        "src/familiarity_core/cli.py",
        "pyproject.toml",
        "README.md",
    ]
    for p in layout:
        print(PurePosixPath(p))
    # mismas claves que el fragmento TOML de la teoría
    meta = {
        "name": "familiarity-core",
        "version": "0.1.0",
        "requires-python": ">=3.11",
    }
    print("pyproject.project", meta)
    print("editable_install", "pip install -e .")

s10_ido_3()`,
          output: `src/familiarity_core/__init__.py
src/familiarity_core/normalize.py
src/familiarity_core/cli.py
pyproject.toml
README.md
pyproject.project {'name': 'familiarity-core', 'version': '0.1.0', 'requires-python': '>=3.11'}
editable_install pip install -e .`,
        },
        why: "El layout src + metadatos de pyproject es el contrato de packaging: instalas editable y el import refleja al toque.",
      },
      {
        demoId: "S10-T2-B-DEMO",
        subtopicId: "S10-T2-B",
        environment: "local-python",
        description: "Bump 0.1.0 → 0.2.0 por subcomando nuevo (minor).",
        code: {
          language: 'python',
          title: "version_bump_demo.py",
          code: `def classify_change(description: str) -> str:
    d = description.lower()
    if "breaking" in d or "rename api" in d:
        return "major"
    if "add" in d or "subcomando" in d or "feature" in d:
        return "minor"
    return "patch"

def bump(v: str, kind: str) -> str:
    a, b, c = map(int, v.split("."))
    return {
        "major": f"{a+1}.0.0",
        "minor": f"{a}.{b+1}.0",
        "patch": f"{a}.{b}.{c+1}",
    }[kind]

ch = "add subcomando report"
kind = classify_change(ch)
print(ch, "->", kind, bump("0.1.0", kind))`,
          output: `add subcomando report -> minor 0.2.0`,
        },
        why: "Feature compatible sube minor; documenta en CHANGELOG.",
      },
      {
        demoId: "S10-T3-A-DEMO",
        subtopicId: "S10-T3-A",
        environment: "local-python",
        description: "CLI con subcomandos ingest|normalize|compare|report y exit codes.",
        code: {
          language: 'python',
          title: "cli_subcommands.py",
          code: `import argparse

def main(argv: list[str]) -> int:
    p = argparse.ArgumentParser(prog="familiarity")
    sub = p.add_subparsers(dest="cmd", required=True)
    sub.add_parser("ingest")
    sub.add_parser("normalize")
    sub.add_parser("compare")
    r = sub.add_parser("report")
    r.add_argument("--format", default="text")
    try:
        ns = p.parse_args(argv)
    except SystemExit as e:
        # argparse ya usa 2 en usage errors cuando no se intercepta;
        # aquí re-lanzamos código
        return int(e.code) if e.code is not None else 2
    if ns.cmd == "report":
        print(f"report format={ns.format}")
        return 0
    print(f"run {ns.cmd}")
    return 0

print("code", main(["report", "--format", "json"]))
print("code", main(["normalize"]))
print("bad_argv", main([]))  # sin subcomando → usage / exit 2`,
          output: `report format=json
code 0
run normalize
code 0
bad_argv 2`,
        },
        why: "Subparsers + return codes hacen la CLI operable en scripts; argv inválido debe devolver 2.",
      },
      {
        demoId: "S10-T3-B-DEMO",
        subtopicId: "S10-T3-B",
        environment: "local-python",
        description: "Datos a stdout y diagnóstico a stderr (simula pipe normalize).",
        code: {
          language: 'python',
          title: "stdio_demo.py",
          code: `import sys
from io import StringIO

def normalize_cmd(raw: str, err: StringIO) -> str:
    err.write("stage=normalize event=start\\n")
    out = raw.strip().casefold()
    err.write("stage=normalize event=done\\n")
    return out

stderr = StringIO()
data = normalize_cmd('  {"name": "Ana"}  ', stderr)
print(data)  # stdout
print("--- stderr ---")
print(stderr.getvalue().strip())`,
          output: `{"name": "ana"}
--- stderr ---
stage=normalize event=start
stage=normalize event=done`,
        },
        why: "El pipe de datos queda limpio; logs viven en stderr.",
      },
      {
        demoId: "S10-T4-A-DEMO",
        subtopicId: "S10-T4-A",
        environment: "local-python",
        description: "FAMILIARITY_LOG_LEVEL vs --log-level: gana el flag.",
        code: {
          language: 'python',
          title: "log_level_prec.py",
          code: `def resolve_log_level(default="INFO", env=None, flag=None) -> str:
    level = default
    if env:
        level = env
    if flag:
        level = flag
    return level

print("solo env", resolve_log_level(env="DEBUG"))
print("flag gana", resolve_log_level(env="DEBUG", flag="ERROR"))
print("default", resolve_log_level())`,
          output: `solo env DEBUG
flag gana ERROR
default INFO`,
        },
        why: "Precedencia flags > env > default documentada y testeable.",
      },
      {
        demoId: "S10-T4-B-DEMO",
        subtopicId: "S10-T4-B",
        environment: "local-python",
        description: "Abort con mensaje exacto si falta el path requerido por el subcomando local.",
        code: {
          language: 'python',
          title: "command_config_validate.py",
          code: `REQUIRED = {"ingest": "input_path", "report": "manifest_path"}

def validate(command: str, cfg: dict) -> None:
    key = REQUIRED.get(command)
    if key and not cfg.get(key):
        raise SystemExit(f"config: falta {key} para {command}")

validate("normalize", {})
print("normalize ok")
try:
    validate("ingest", {})
except SystemExit as e:
    print("abort", e)
validate("ingest", {"input_path": "data/clients.csv"})
print("ingest ok")`,
          output: `normalize ok
abort config: falta input_path para ingest
ingest ok`,
        },
        why: "Validación temprana y contextual, sin exigir secretos irrelevantes al ETL local.",
      },
    ],
  },
  weDo: {
    intro: "Andamiaje: **E1 guiado → E2 independiente → E3 transferencia** × 8 subtemas (24 ejercicios, 2 hints c/u). Usa solo stdlib y lo aprendido hasta S10; cada starter trae un defecto marcado con `# DEFECT`. Elimina líneas extra (p. ej. `ok True`); la salida debe coincidir exactamente con el contrato.",
    steps: [
      {
        id: "S10-T1-A-E1",
        subtopicId: "S10-T1-A",
        kind: "guided",
        instruction:
          "E1 (guiado) · S10-T1-A — Arregla el módulo del starter (`CASO-LIM-010`): `clean` debe colapsar espacios, hacer casefold y exportarse en `__all__` (no exportes helpers con `_`). Salida esperada exacta:\n['clean']\nx",
        hint: "Helper privado con _ no va en __all__.",
        hints: [
          "Helper privado con _ no va en __all__.",
          "Imprime __all__ y clean('  X ').",
        ],
        edgeCases: ["import * no es recomendado; __all__ documenta intención"],
        tests: "Contrato ejecutable: corre exactamente los casos visibles del starter; exit 0 y sin traceback; stdout conserva el orden, etiquetas y valores exigidos por la instrucción, sin líneas extra.",
        feedback: "Si ves `_ws` en __all__ o espacios sin colapsar, el helper aún no es privado o clean no hace casefold/join.",
        starterCode: {
          language: 'python',
          title: "public_module.py",
          code: `# CASO-LIM-010 · clean + __all__
# DEFECT: _ws no colapsa; no exporta clean; quita print('ok', True)
def _ws(s: str) -> str:
    return s.strip()

def clean(s: str) -> str:
    return _ws(s)

__all__ = ["_ws"]
print(__all__)
print(clean("  X "))
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "public_module.py",
          code: `def _ws(s: str) -> str:
    return " ".join(s.split())

def clean(s: str) -> str:
    return _ws(s).casefold()

__all__ = ["clean"]
print(__all__)
print(clean("  X "))`,
          output: `['clean']
x`,
        },
      },
      {
        id: "S10-T1-A-E2",
        subtopicId: "S10-T1-A",
        kind: "independent",
        instruction:
          "E2 (independiente) · S10-T1-A — Un util compartido alimenta `module_a_process` y `module_b_process` (patrón anti-ciclo: lógica común fuera de A↔B). Corrige `util_norm` (strip+casefold) y los sufijos `:a`/`:b` invertidos. Salida esperada exacta:\nhola:a\nhola:b\nok",
        hint: "La lógica compartida vive en util_norm; A y B solo orquestan.",
        hints: [
          "La lógica compartida vive en util_norm; A y B solo orquestan (evita dependencia A↔B).",
          "module_a debe terminar en :a y module_b en :b; casefold en util_norm.",
        ],
        edgeCases: ["Lazy import dentro de función es plan B si el util compartido no basta"],
        tests: "Contrato ejecutable: corre exactamente los casos visibles del starter; exit 0 y sin traceback; stdout conserva el orden, etiquetas y valores exigidos por la instrucción, sin líneas extra.",
        feedback: "Si sale hola:b primero o Hola sin casefold, los sufijos siguen invertidos o util_norm no normaliza del todo.",
        starterCode: {
          language: 'python',
          title: "shared_util_modules.py",
          code: `# CASO-LIM-010 · util compartido (anti-ciclo A↔B)
# DEFECT: util_norm no casefold; suffixes invertidos; quita print('ok', True)
def util_norm(s: str) -> str:
    return s.strip()

def module_a_process(s: str) -> str:
    return util_norm(s) + ":b"

def module_b_process(s: str) -> str:
    return util_norm(s) + ":a"

print(module_a_process(" Hola "))
print(module_b_process(" Hola "))
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "shared_util_modules.py",
          code: `def util_norm(s: str) -> str:
    return s.strip().casefold()

def module_a_process(s: str) -> str:
    return util_norm(s) + ":a"

def module_b_process(s: str) -> str:
    return util_norm(s) + ":b"

print(module_a_process(" Hola "))
print(module_b_process(" Hola "))
print("ok")`,
          output: `hola:a
hola:b
ok`,
        },
      },
      {
        id: "S10-T1-A-E3",
        subtopicId: "S10-T1-A",
        kind: "transfer",
        instruction:
          "E3 (transferencia) · S10-T1-A — Implementa `recommend_import_style(kind)` con kinds estructurados (`CASO-LIM-010`): `same_package` → relativo/absoluto del paquete; `external_plugin` → import absoluto del paquete instalado; `run_cli` → `python -m familiarity_core`. Imprime etiqueta -> estilo. Salida esperada exacta:\nnormalize.py importa compare en el mismo paquete -> relativo o absoluto del paquete (from . import compare)\nplugin externo usa familiarity_core -> absoluto (import familiarity_core)\nejecutar el CLI del paquete -> python -m familiarity_core",
        hint: "Despacha por kind exacto (same_package / external_plugin / run_cli), no por substring del label.",
        hints: [
          "El label es solo para la UI del print; la decisión usa el kind del tuple.",
          "Formato: print(f'{label} -> {recommend_import_style(kind)}').",
        ],
        edgeCases: ["Evita manipular sys.path a mano en prod"],
        tests: "Contrato ejecutable: corre exactamente los casos visibles del starter; exit 0 y sin traceback; stdout conserva el orden, etiquetas y valores exigidos por la instrucción, sin líneas extra.",
        feedback: "Si same_package devuelve el estilo de plugin, el match por kind está invertido o caíste en el default genérico.",
        starterCode: {
          language: 'python',
          title: "import_style.py",
          code: `# CASO-LIM-010 · relative vs absolute import (kinds estructurados)
# DEFECT: ramas invertidas / incompletas; quita print('ok', True)
def recommend_import_style(kind: str) -> str:
    if kind == "external_plugin":
        return "relativo (from . import)"
    if kind == "same_package":
        return "absoluto siempre (import compare)"
    return "PYTHONPATH=."

scenarios = [
    ("normalize.py importa compare en el mismo paquete", "same_package"),
    ("plugin externo usa familiarity_core", "external_plugin"),
    ("ejecutar el CLI del paquete", "run_cli"),
]
for label, kind in scenarios:
    print(f"{label} -> {recommend_import_style(kind)}")
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "import_style.py",
          code: `def recommend_import_style(kind: str) -> str:
    if kind == "same_package":
        return "relativo o absoluto del paquete (from . import compare)"
    if kind == "external_plugin":
        return "absoluto (import familiarity_core)"
    if kind == "run_cli":
        return "python -m familiarity_core"
    raise ValueError(f"kind no tipificado: {kind}")

scenarios = [
    ("normalize.py importa compare en el mismo paquete", "same_package"),
    ("plugin externo usa familiarity_core", "external_plugin"),
    ("ejecutar el CLI del paquete", "run_cli"),
]
for label, kind in scenarios:
    print(f"{label} -> {recommend_import_style(kind)}")`,
          output: `normalize.py importa compare en el mismo paquete -> relativo o absoluto del paquete (from . import compare)
plugin externo usa familiarity_core -> absoluto (import familiarity_core)
ejecutar el CLI del paquete -> python -m familiarity_core`,
        },
      },
      {
        id: "S10-T1-B-E1",
        subtopicId: "S10-T1-B",
        kind: "guided",
        instruction:
          "E1 (guiado) · S10-T1-B — Separa API pública y privada: imprime `public` = nombres sin `_` y `private` = nombres con `_` a partir de la lista del starter; `compare` debe seguir normalizando. Salida esperada exacta:\npublic ['normalize', 'compare']\nprivate ['_tokenize']\nTrue",
        hint: "Imprime lista public vs private detectada por nombre.",
        hints: [
          "Imprime lista public vs private detectada por nombre.",
          "Usa startswith('_') sobre la lista names del starter.",
        ],
        edgeCases: ["Un solo _ es convención, no enforcement del runtime"],
        tests: "Contrato ejecutable: corre exactamente los casos visibles del starter; exit 0 y sin traceback; stdout conserva el orden, etiquetas y valores exigidos por la instrucción, sin líneas extra.",
        feedback: "Si public incluye `_tokenize` o falta la línea private, filtra con startswith('_') y no reutilices la lista cruda.",
        starterCode: {
          language: 'python',
          title: "mark_private.py",
          code: `# CASO-LIM-010 · public vs private names
# DEFECT: exporta _tokenize como público; quita print('ok', True)
def _tokenize(s):
    return s.split()

def normalize(s):
    return " ".join(_tokenize(s)).lower()

def compare(a, b):
    return normalize(a) == normalize(b)

names = ["_tokenize", "normalize", "compare"]
public = names
print(public)
print(compare("A", "a"))
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "mark_private.py",
          code: `def _tokenize(s):
    return s.split()

def normalize(s):
    return " ".join(_tokenize(s)).lower()

def compare(a, b):
    return normalize(a) == normalize(b)

names = ["_tokenize", "normalize", "compare"]
public = [n for n in names if not n.startswith("_")]
private = [n for n in names if n.startswith("_")]
print("public", public)
print("private", private)
print(compare("A", "a"))`,
          output: `public ['normalize', 'compare']
private ['_tokenize']
True`,
        },
      },
      {
        id: "S10-T1-B-E2",
        subtopicId: "S10-T1-B",
        kind: "independent",
        instruction:
          "E2 (independiente) · S10-T1-B — Implementa la fachada: `normalize` con casefold, `compare` vía normalize, e imprime `__all__ = ['normalize', 'compare']`. Salida esperada exacta:\n['normalize', 'compare']\nTrue",
        hint: "Las implementaciones pueden ser locales.",
        hints: [
          "Las implementaciones pueden ser locales.",
          "compare debe normalizar ambos lados antes de comparar.",
        ],
        edgeCases: ["No reexportes helpers con _"],
        tests: "Contrato ejecutable: corre exactamente los casos visibles del starter; exit 0 y sin traceback; stdout conserva el orden, etiquetas y valores exigidos por la instrucción, sin líneas extra.",
        feedback: "Si __all__ queda vacío o compare('Z',' z ') es False, exporta normalize/compare y normaliza ambos lados.",
        starterCode: {
          language: 'python',
          title: "facade.py",
          code: `# CASO-LIM-010 · facade __all__
# DEFECT: __all__ vacío; compare sin normalize; quita print('ok', True)
def normalize(s: str) -> str:
    return s.strip()

def compare(a: str, b: str) -> bool:
    return a == b

__all__ = []
print(__all__)
print(compare("A", "a"))
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "facade.py",
          code: `def normalize(s: str) -> str:
    return s.strip().casefold()

def compare(a: str, b: str) -> bool:
    return normalize(a) == normalize(b)

# facade reexport
__all__ = ["normalize", "compare"]
print(__all__)
print(compare("Z", " z "))`,
          output: `['normalize', 'compare']
True`,
        },
      },
      {
        id: "S10-T1-B-E3",
        subtopicId: "S10-T1-B",
        kind: "transfer",
        instruction:
          "E3 (transferencia) · S10-T1-B — Implementa `major_bump(version)` y `document_breaking(...)` para un cambio de firma pública: imprime BREAKING, NEW_VERSION (major) y MIGRATION. Salida esperada exacta:\nBREAKING: compare(a,b)->bool  =>  compare(a,b)->float score\nNEW_VERSION: 1.0.0 -> 2.0.0\nMIGRATION: usar compare(a,b) == 1.0 en vez de is True",
        hint: "major_bump('1.0.0') → '2.0.0'; no hardcodees 2.0.0 a mano si puedes calcularlo.",
        hints: [
          "major_bump: toma el MAJOR, suma 1, deja MINOR y PATCH en 0.",
          "document_breaking imprime las tres líneas con el formato del contrato.",
        ],
        edgeCases: ["Añadir argumento opcional con default puede ser minor (no este ejercicio)"],
        tests: "Contrato ejecutable: corre exactamente los casos visibles del starter; exit 0 y sin traceback; stdout conserva el orden, etiquetas y valores exigidos por la instrucción, sin líneas extra.",
        feedback: "Si NEW_VERSION queda en patch (1.0.1), el bump no trata el cambio de tipo de retorno como major.",
        starterCode: {
          language: 'python',
          title: "breaking_change.py",
          code: `# CASO-LIM-010 · breaking change notes
# DEFECT: major_bump hace patch; migración vacía; quita print('ok', True)
def major_bump(version: str) -> str:
    maj, minor, patch = version.split(".")
    return f"{maj}.{minor}.{int(patch) + 1}"

def document_breaking(old_sig: str, new_sig: str, old_ver: str, migration: str) -> None:
    print(f"BREAKING: {old_sig}  =>  {new_sig}")
    print(f"NEW_VERSION: {old_ver} -> {major_bump(old_ver)}")
    print(f"MIGRATION: {migration}")

document_breaking(
    "compare(a,b)->bool",
    "compare(a,b)->float score",
    "1.0.0",
    "none",
)
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "breaking_change.py",
          code: `def major_bump(version: str) -> str:
    maj, _, _ = version.split(".")
    return f"{int(maj) + 1}.0.0"

def document_breaking(old_sig: str, new_sig: str, old_ver: str, migration: str) -> None:
    print(f"BREAKING: {old_sig}  =>  {new_sig}")
    print(f"NEW_VERSION: {old_ver} -> {major_bump(old_ver)}")
    print(f"MIGRATION: {migration}")

document_breaking(
    "compare(a,b)->bool",
    "compare(a,b)->float score",
    "1.0.0",
    "usar compare(a,b) == 1.0 en vez de is True",
)`,
          output: `BREAKING: compare(a,b)->bool  =>  compare(a,b)->float score
NEW_VERSION: 1.0.0 -> 2.0.0
MIGRATION: usar compare(a,b) == 1.0 en vez de is True`,
        },
      },
      {
        id: "S10-T2-A-E1",
        subtopicId: "S10-T2-A",
        kind: "guided",
        instruction:
          "E1 (guiado) · S10-T2-A — Implementa `complete_project(partial)` (`CASO-LIM-010`) que normaliza metadata instalable: name → `familiarity-core`, conserva `version` si existe (default `0.1.0`), y fija `requires-python` a `>=3.11`. Salida esperada exacta:\n{'name': 'familiarity-core', 'version': '0.1.0', 'requires-python': '>=3.11'}",
        hint: "Copia partial, fuerza name y requires-python; version con setdefault o default.",
        hints: [
          "No devuelvas el dict parcial tal cual: name y requires-python se corrigen siempre.",
          "version: usa partial.get('version') o '0.1.0' si falta.",
        ],
        edgeCases: ["El nombre de distribución puede usar guiones; el import usa guion bajo"],
        tests: "Contrato ejecutable: corre exactamente los casos visibles del starter; exit 0 y sin traceback; stdout conserva el orden, etiquetas y valores exigidos por la instrucción, sin líneas extra.",
        feedback: "Si el name sigue siendo 'familiarity' o falta requires-python, complete_project no está normalizando el contrato de pyproject.",
        starterCode: {
          language: 'python',
          title: "pyproject_fields.py",
          code: `# CASO-LIM-010 · project metadata
# DEFECT: complete_project no corrige name ni requires-python; quita print('ok', True)
def complete_project(partial: dict) -> dict:
    return dict(partial)

print(complete_project({"name": "familiarity", "version": "0.1.0"}))
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "pyproject_fields.py",
          code: `def complete_project(partial: dict) -> dict:
    out = dict(partial)
    out["name"] = "familiarity-core"
    out["version"] = out.get("version") or "0.1.0"
    out["requires-python"] = ">=3.11"
    return out

print(complete_project({"name": "familiarity", "version": "0.1.0"}))`,
          output: `{'name': 'familiarity-core', 'version': '0.1.0', 'requires-python': '>=3.11'}`,
        },
      },
      {
        id: "S10-T2-A-E2",
        subtopicId: "S10-T2-A",
        kind: "independent",
        instruction:
          "E2 (independiente) · S10-T2-A — Implementa `src_layout(package, modules)` que arma rutas `src/<paquete>/…` y añade `pyproject.toml` al final. Módulos: `__init__.py`, `normalize.py`, `cli.py`. Salida esperada exacta:\nsrc/familiarity_core/__init__.py\nsrc/familiarity_core/normalize.py\nsrc/familiarity_core/cli.py\npyproject.toml",
        hint: "Por cada módulo: f'src/{package}/{mod}'; luego pyproject.toml.",
        hints: [
          "No hardcodees solo dos paths: construye la lista desde package + modules.",
          "pyproject.toml vive en la raíz del proyecto, no bajo src/.",
        ],
        edgeCases: ["tests/ fuera de src"],
        tests: "Contrato ejecutable: corre exactamente los casos visibles del starter; exit 0 y sin traceback; stdout conserva el orden, etiquetas y valores exigidos por la instrucción, sin líneas extra.",
        feedback: "Si falta cli.py o pyproject.toml, la función aún no arma el layout mínimo instalable.",
        starterCode: {
          language: 'python',
          title: "layout_list.py",
          code: `# CASO-LIM-010 · src layout paths
# DEFECT: no construye rutas; omite módulos y pyproject; quita print('ok', True)
def src_layout(package: str, modules: list[str]) -> list[str]:
    return [f"src/{package}/__init__.py", f"src/{package}/normalize.py"]

for p in src_layout("familiarity_core", ["__init__.py", "normalize.py", "cli.py"]):
    print(p)
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "layout_list.py",
          code: `def src_layout(package: str, modules: list[str]) -> list[str]:
    paths = [f"src/{package}/{mod}" for mod in modules]
    paths.append("pyproject.toml")
    return paths

for p in src_layout("familiarity_core", ["__init__.py", "normalize.py", "cli.py"]):
    print(p)`,
          output: `src/familiarity_core/__init__.py
src/familiarity_core/normalize.py
src/familiarity_core/cli.py
pyproject.toml`,
        },
      },
      {
        id: "S10-T2-A-E3",
        subtopicId: "S10-T2-A",
        kind: "transfer",
        instruction:
          "E3 (transferencia) · S10-T2-A — Implementa `diagnose_mnf(facts)` que inspecciona un dict de hechos post-install (`CASO-LIM-010`): (1) `installed` falso → falta `pip install -e .`; (2) `import_name` ≠ `package_dir` → nombre de import distinto de la carpeta; (3) `shadowing_script` verdadero → script en cwd tapa el paquete. Salida esperada exacta:\ncause: paquete no instalado (falta pip install -e .)\ncause: nombre import != nombre de carpeta (familiarity_core)\ncause: se ejecuta un script que tapa el paquete en sys.path",
        hint: "Evalúa en este orden: installed → igualdad import_name/package_dir → shadowing_script.",
        hints: [
          "No busques palabras en un string libre: lee las claves del dict facts.",
          "Imprime solo el string cause: … que devuelve diagnose_mnf.",
        ],
        edgeCases: ["venv incorrecto es otra causa clásica; aquí el contrato fija tres hechos"],
        tests: "Contrato ejecutable: corre exactamente los casos visibles del starter; exit 0 y sin traceback; stdout conserva el orden, etiquetas y valores exigidos por la instrucción, sin líneas extra.",
        feedback: "Si el segundo caso no detecta el mismatch, compara import_name con package_dir en vez de devolver siempre la primera causa.",
        starterCode: {
          language: 'python',
          title: "diagnose_mnf.py",
          code: `# CASO-LIM-010 · import fail causes (hechos estructurados)
# DEFECT: ignora facts y devuelve siempre "no instalado"; quita print('ok', True)
def diagnose_mnf(facts: dict) -> str:
    return "cause: paquete no instalado (falta pip install -e .)"

cases = [
    {"installed": False, "import_name": "familiarity_core", "package_dir": "familiarity_core", "shadowing_script": False},
    {"installed": True, "import_name": "familiarity", "package_dir": "familiarity_core", "shadowing_script": False},
    {"installed": True, "import_name": "familiarity_core", "package_dir": "familiarity_core", "shadowing_script": True},
]
for facts in cases:
    print(diagnose_mnf(facts))
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "diagnose_mnf.py",
          code: `def diagnose_mnf(facts: dict) -> str:
    if not facts.get("installed"):
        return "cause: paquete no instalado (falta pip install -e .)"
    if facts.get("import_name") != facts.get("package_dir"):
        return "cause: nombre import != nombre de carpeta (familiarity_core)"
    if facts.get("shadowing_script"):
        return "cause: se ejecuta un script que tapa el paquete en sys.path"
    raise ValueError(f"hechos no tipificados: {facts}")

cases = [
    {"installed": False, "import_name": "familiarity_core", "package_dir": "familiarity_core", "shadowing_script": False},
    {"installed": True, "import_name": "familiarity", "package_dir": "familiarity_core", "shadowing_script": False},
    {"installed": True, "import_name": "familiarity_core", "package_dir": "familiarity_core", "shadowing_script": True},
]
for facts in cases:
    print(diagnose_mnf(facts))`,
          output: `cause: paquete no instalado (falta pip install -e .)
cause: nombre import != nombre de carpeta (familiarity_core)
cause: se ejecuta un script que tapa el paquete en sys.path`,
        },
      },
      {
        id: "S10-T2-B-E1",
        subtopicId: "S10-T2-B",
        kind: "guided",
        instruction:
          "E1 (guiado) · S10-T2-B — Implementa `bump_from_description(version, descripcion)` (`CASO-LIM-010`): clasifica el cambio (renombrar/eliminar → major; añadir → minor; typo/corregir → patch) y **calcula** la versión nueva con `bump`. Base fija `1.0.0`. Salida esperada exacta:\nrenombrar normalize a clean_name (API pública): major -> 2.0.0\nañadir flag --format a report: minor -> 1.1.0\ncorregir typo en help: patch -> 1.0.1\neliminar subcomando compare: major -> 2.0.0",
        hint: "Primero classify (orden: renombrar/eliminar → añadir → typo), luego bump numérico; no inventes el string de versión a mano.",
        hints: [
          "classify_change: renombrar/eliminar → major; añadir/agregar → minor; typo/corregir → patch.",
          "bump('1.0.0','major')→'2.0.0'; minor→'1.1.0'; patch→'1.0.1'. Imprime f'{cambio}: {kind} -> {new}'.",
        ],
        edgeCases: ["Deprecar un minor antes del major reduce el dolor del breaking"],
        tests: "Contrato ejecutable: corre exactamente los casos visibles del starter; exit 0 y sin traceback; stdout conserva el orden, etiquetas y valores exigidos por la instrucción, sin líneas extra.",
        feedback: "Si renombrar queda en 1.0.1 o 'patch', classify invierte el breaking; si major imprime 1.1.0, bump no resetea minor/patch a 0.",
        starterCode: {
          language: 'python',
          title: "semver_bump_from_desc.py",
          code: `# CASO-LIM-010 · classify + bump (no solo etiquetas)
# DEFECT: classify invierte niveles; bump major no resetea; quita print('ok', True)
def classify_change(descripcion: str) -> str:
    d = descripcion.casefold()
    if "renombrar" in d or "eliminar" in d:
        return "patch"
    if "añadir" in d or "agregar" in d:
        return "major"
    if "typo" in d or "corregir" in d:
        return "minor"
    return "patch"

def bump(version: str, level: str) -> str:
    maj, minor, patch = map(int, version.split("."))
    if level == "major":
        return f"{maj+1}.{minor}.{patch}"  # no resetea
    if level == "minor":
        return f"{maj}.{minor+1}.0"
    if level == "patch":
        return f"{maj}.{minor}.{patch+1}"
    raise ValueError(level)

def bump_from_description(version: str, descripcion: str) -> tuple[str, str]:
    level = classify_change(descripcion)
    return level, bump(version, level)

BASE = "1.0.0"
for cambio in [
    "renombrar normalize a clean_name (API pública)",
    "añadir flag --format a report",
    "corregir typo en help",
    "eliminar subcomando compare",
]:
    kind, new = bump_from_description(BASE, cambio)
    print(f"{cambio}: {kind} -> {new}")
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "semver_bump_from_desc.py",
          code: `def classify_change(descripcion: str) -> str:
    d = descripcion.casefold()
    if "renombrar" in d or "eliminar" in d:
        return "major"
    if "añadir" in d or "agregar" in d:
        return "minor"
    if "typo" in d or "corregir" in d:
        return "patch"
    return "patch"

def bump(version: str, level: str) -> str:
    maj, minor, patch = map(int, version.split("."))
    if level == "major":
        return f"{maj+1}.0.0"
    if level == "minor":
        return f"{maj}.{minor+1}.0"
    if level == "patch":
        return f"{maj}.{minor}.{patch+1}"
    raise ValueError(level)

def bump_from_description(version: str, descripcion: str) -> tuple[str, str]:
    level = classify_change(descripcion)
    return level, bump(version, level)

BASE = "1.0.0"
for cambio in [
    "renombrar normalize a clean_name (API pública)",
    "añadir flag --format a report",
    "corregir typo en help",
    "eliminar subcomando compare",
]:
    kind, new = bump_from_description(BASE, cambio)
    print(f"{cambio}: {kind} -> {new}")`,
          output: `renombrar normalize a clean_name (API pública): major -> 2.0.0
añadir flag --format a report: minor -> 1.1.0
corregir typo en help: patch -> 1.0.1
eliminar subcomando compare: major -> 2.0.0`,
        },
      },
      {
        id: "S10-T2-B-E2",
        subtopicId: "S10-T2-B",
        kind: "independent",
        instruction:
          "E2 (independiente) · S10-T2-B — Implementa `build_deps(runtime, dev, requires_python)`: runtime vacío, pytest solo en optional `dev`, requires-python `>=3.11`. Salida esperada exacta:\n{'requires-python': '>=3.11', 'dependencies': [], 'optional-dependencies': {'dev': ['pytest']}}",
        hint: "dependencies = list(runtime); optional-dependencies = {'dev': list(dev)}.",
        hints: [
          "Para N1 stdlib: pasa runtime=[] y dev=['pytest'].",
          "Nunca mezcles pytest en dependencies (runtime).",
        ],
        edgeCases: ["pytest como optional dev, no runtime"],
        tests: "Contrato ejecutable: corre exactamente los casos visibles del starter; exit 0 y sin traceback; stdout conserva el orden, etiquetas y valores exigidos por la instrucción, sin líneas extra.",
        feedback: "Si pytest aparece en dependencies, build_deps aún no separa runtime de optional-dependencies.dev.",
        starterCode: {
          language: 'python',
          title: "deps_pin.py",
          code: `# CASO-LIM-010 · deps structure
# DEFECT: mete pytest en runtime; no arma optional-dependencies; quita print('ok', True)
def build_deps(runtime: list[str], dev: list[str], requires_python: str) -> dict:
    return {
        "requires-python": requires_python,
        "dependencies": list(runtime) + list(dev),
        "optional-dependencies": {},
    }

print(build_deps([], ["pytest"], ">=3.11"))
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "deps_pin.py",
          code: `def build_deps(runtime: list[str], dev: list[str], requires_python: str) -> dict:
    return {
        "requires-python": requires_python,
        "dependencies": list(runtime),
        "optional-dependencies": {"dev": list(dev)},
    }

print(build_deps([], ["pytest"], ">=3.11"))`,
          output: `{'requires-python': '>=3.11', 'dependencies': [], 'optional-dependencies': {'dev': ['pytest']}}`,
        },
      },
      {
        id: "S10-T2-B-E3",
        subtopicId: "S10-T2-B",
        kind: "transfer",
        instruction:
          "E3 (transferencia) · S10-T2-B — Implementa `policy_for(kind)` con kinds estructurados hacia entidades de dominio futuras (p. ej. `ClientRecord` en S11): `rename_entity` → MAJOR + migración; `optional_field` → MINOR; `keep_cli_stable` → no romper CLI sin bump/CHANGELOG. El label solo se imprime. Salida esperada exacta:\nPOLICY: renombrar ClientRecord es MAJOR; documentar migración\nPOLICY: añadir campo opcional con default es MINOR\nPOLICY: S11 no rompe CLI de S10 sin bump y CHANGELOG",
        hint: "Despacha por kind exacto (rename_entity / optional_field / keep_cli_stable), no por substring del label.",
        hints: [
          "if kind == 'rename_entity': …; no uses 'renombrar' del label para decidir.",
          "raise ValueError si el kind no está tipificado (fail-closed de política).",
        ],
        edgeCases: ["Si equality de una entidad frozen cambia, también es major aunque el nombre no cambie"],
        tests: "Contrato ejecutable: corre exactamente los casos visibles del starter; exit 0 y sin traceback; stdout conserva el orden, etiquetas y valores exigidos por la instrucción, sin líneas extra.",
        feedback: "Si rename_entity devuelve MINOR, las ramas están invertidas; si confías en el label en vez del kind, el despacho no es robusto.",
        starterCode: {
          language: 'python',
          title: "compat_policy.py",
          code: `# CASO-LIM-010 · API change policy (kinds estructurados)
# DEFECT: ramas invertidas / incompletas; quita print('ok', True)
def policy_for(kind: str) -> str:
    if kind == "optional_field":
        return "POLICY: renombrar ClientRecord es MAJOR; documentar migración"
    if kind == "rename_entity":
        return "POLICY: añadir campo opcional con default es MINOR"
    return "POLICY: S11 puede romper CLI de S10 sin bump"

scenarios = [
    ("renombrar ClientRecord", "rename_entity"),
    ("añadir campo opcional con default", "optional_field"),
    ("S11 y CLI de S10", "keep_cli_stable"),
]
for _label, kind in scenarios:
    print(policy_for(kind))
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "compat_policy.py",
          code: `def policy_for(kind: str) -> str:
    if kind == "rename_entity":
        return "POLICY: renombrar ClientRecord es MAJOR; documentar migración"
    if kind == "optional_field":
        return "POLICY: añadir campo opcional con default es MINOR"
    if kind == "keep_cli_stable":
        return "POLICY: S11 no rompe CLI de S10 sin bump y CHANGELOG"
    raise ValueError(f"kind no tipificado: {kind}")

scenarios = [
    ("renombrar ClientRecord", "rename_entity"),
    ("añadir campo opcional con default", "optional_field"),
    ("S11 y CLI de S10", "keep_cli_stable"),
]
for _label, kind in scenarios:
    print(policy_for(kind))`,
          output: `POLICY: renombrar ClientRecord es MAJOR; documentar migración
POLICY: añadir campo opcional con default es MINOR
POLICY: S11 no rompe CLI de S10 sin bump y CHANGELOG`,
        },
      },
      {
        id: "S10-T3-A-E1",
        subtopicId: "S10-T3-A",
        kind: "guided",
        instruction:
          "E1 (guiado) · S10-T3-A — Añade subcomando `report` con `--format text|json` y parsea `['report', '--format', 'json']`. Salida esperada exacta:\nNamespace(cmd='report', format='json')",
        hint: "Usa argparse subparsers.",
        hints: [
          "Usa argparse subparsers con dest='cmd' y required=True.",
          "Imprime el namespace parseado.",
        ],
        edgeCases: ["required=True en subparsers (py3.7+)"],
        tests: "Contrato ejecutable: corre exactamente los casos visibles del starter; exit 0 y sin traceback; stdout conserva el orden, etiquetas y valores exigidos por la instrucción, sin líneas extra.",
        feedback: "Si el Namespace no tiene cmd/format, falta subparsers required y --format en el parser report.",
        starterCode: {
          language: 'python',
          title: "report_subcmd.py",
          code: `# CASO-LIM-010 · argparse subparsers
# DEFECT: sin required subparser; sin --format; quita print('ok', True)
import argparse
p = argparse.ArgumentParser()
ns = p.parse_args([])
print(ns)
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "report_subcmd.py",
          code: `import argparse
p = argparse.ArgumentParser()
sub = p.add_subparsers(dest="cmd", required=True)
r = sub.add_parser("report")
r.add_argument("--format", choices=["text", "json"], default="text")
ns = p.parse_args(["report", "--format", "json"])
print(ns)`,
          output: `Namespace(cmd='report', format='json')`,
        },
      },
      {
        id: "S10-T3-A-E2",
        subtopicId: "S10-T3-A",
        kind: "independent",
        instruction:
          "E2 (independiente) · S10-T3-A — Implementa `run_cli(argv, runtime_ok=True)`: parsea con argparse (subcomando `normalize` requerido); captura `SystemExit` de usage → **2**; si el parse es OK pero `runtime_ok` es False → **1**; éxito → **0**. Salida esperada exacta:\nnormalize ok: 0\narchivo de input no existe: 1\nflag desconocido: 2\nsubcomando ausente: 2\nvalidación de config falla al arrancar: 1",
        hint: "try/except SystemExit alrededor de parse_args; el código de argparse en usage es 2.",
        hints: [
          "argv=[] o un flag inventado deben devolver 2 vía SystemExit.",
          "runtime_ok=False simula error de negocio/config después de un parse válido → 1.",
        ],
        edgeCases: ["argparse usa 2 por defecto en errores de parseo; no tragues SystemExit sin devolver el code"],
        tests: "Contrato ejecutable: corre exactamente los casos visibles del starter; exit 0 y sin traceback; stdout conserva el orden, etiquetas y valores exigidos por la instrucción, sin líneas extra.",
        feedback: "Si usage sale 0, no estás capturando SystemExit; si runtime sale 0, no consultaste runtime_ok tras el parse.",
        starterCode: {
          language: 'python',
          title: "exit_codes.py",
          code: `# CASO-LIM-010 · exit codes vía argparse real
# DEFECT: usage y runtime devuelven 0; no propaga el code de SystemExit; ignora runtime_ok; quita print('ok', True)
import argparse

def run_cli(argv: list[str], runtime_ok: bool = True) -> int:
    p = argparse.ArgumentParser(prog="familiarity")
    sub = p.add_subparsers(dest="cmd", required=True)
    sub.add_parser("normalize")
    try:
        p.parse_args(argv)
    except SystemExit:
        return 0  # DEFECT: usage debe ser 2
    return 0  # DEFECT: debe devolver 1 si runtime_ok es False

cases = [
    ("normalize ok", ["normalize"], True),
    ("archivo de input no existe", ["normalize"], False),
    ("flag desconocido", ["normalize", "--no-existe"], True),
    ("subcomando ausente", [], True),
    ("validación de config falla al arrancar", ["normalize"], False),
]
for label, argv, runtime_ok in cases:
    print(f"{label}: {run_cli(argv, runtime_ok=runtime_ok)}")
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "exit_codes.py",
          code: `import argparse

def run_cli(argv: list[str], runtime_ok: bool = True) -> int:
    p = argparse.ArgumentParser(prog="familiarity")
    sub = p.add_subparsers(dest="cmd", required=True)
    sub.add_parser("normalize")
    try:
        p.parse_args(argv)
    except SystemExit as e:
        return int(e.code) if e.code is not None else 2
    if not runtime_ok:
        return 1
    return 0

cases = [
    ("normalize ok", ["normalize"], True),
    ("archivo de input no existe", ["normalize"], False),
    ("flag desconocido", ["normalize", "--no-existe"], True),
    ("subcomando ausente", [], True),
    ("validación de config falla al arrancar", ["normalize"], False),
]
for label, argv, runtime_ok in cases:
    print(f"{label}: {run_cli(argv, runtime_ok=runtime_ok)}")`,
          output: `normalize ok: 0
archivo de input no existe: 1
flag desconocido: 2
subcomando ausente: 2
validación de config falla al arrancar: 1`,
        },
      },
      {
        id: "S10-T3-A-E3",
        subtopicId: "S10-T3-A",
        kind: "transfer",
        instruction:
          "E3 (transferencia) · S10-T3-A — Implementa `format_help(cmd, note, width=48)` y genera 2 ejemplos de operador + 1 línea de códigos de salida. Salida esperada exacta:\nHELP: familiarity ingest --input data/clientes.csv  # carga el archivo de clientes\nHELP: familiarity normalize --field name            # limpia espacios y mayúsculas\nHELP: Si falla, revise el código de salida: 2=uso, 1=error de datos/config",
        hint: "Alinea el `#` con espacios hasta width; la tercera línea no usa format_help.",
        hints: [
          "left = f'HELP: {cmd}'; pad = max(1, width - len(left)); luego ' # ' + note.",
          "No uses jerga de frameworks: comandos concretos que un operador pueda copiar.",
        ],
        edgeCases: ["Ejemplos concretos > descripciones abstractas"],
        tests: "Contrato ejecutable: corre exactamente los casos visibles del starter; exit 0 y sin traceback; stdout conserva el orden, etiquetas y valores exigidos por la instrucción, sin líneas extra.",
        feedback: "Si el `#` no alinea o falta el ejemplo de normalize, format_help aún no construye el ancho del contrato.",
        starterCode: {
          language: 'python',
          title: "operator_help.py",
          code: `# CASO-LIM-010 · help examples
# DEFECT: format_help ignora note/width; sin códigos de salida; quita print('ok', True)
def format_help(cmd: str, note: str, width: int = 48) -> str:
    return f"HELP: {cmd}"

examples = [
    ("familiarity ingest --input data/clientes.csv", "carga el archivo de clientes"),
    ("familiarity normalize --field name", "limpia espacios y mayúsculas"),
]
for cmd, note in examples:
    print(format_help(cmd, note))
print("HELP: buen luck")
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "operator_help.py",
          code: `def format_help(cmd: str, note: str, width: int = 48) -> str:
    left = f"HELP: {cmd}"
    pad = max(1, width - len(left))
    return f"{left}{' ' * pad}# {note}"

examples = [
    ("familiarity ingest --input data/clientes.csv", "carga el archivo de clientes"),
    ("familiarity normalize --field name", "limpia espacios y mayúsculas"),
]
for cmd, note in examples:
    print(format_help(cmd, note))
print("HELP: Si falla, revise el código de salida: 2=uso, 1=error de datos/config")`,
          output: `HELP: familiarity ingest --input data/clientes.csv  # carga el archivo de clientes
HELP: familiarity normalize --field name            # limpia espacios y mayúsculas
HELP: Si falla, revise el código de salida: 2=uso, 1=error de datos/config`,
        },
      },
      {
        id: "S10-T3-B-E1",
        subtopicId: "S10-T3-B",
        kind: "guided",
        instruction:
          "E1 (guiado) · S10-T3-B — `process` retorna n*2 por el valor de retorno (stdout) y escribe `event=done` en el stream de error (StringIO). Salida esperada exacta:\n6\nstderr: event=done",
        hint: "Función process(n) retorna n*2; log event=done en err.",
        hints: [
          "Función process(n) retorna n*2; log event=done en err.",
          "No uses print para el log; escribe en err.",
        ],
        edgeCases: ["En CLI real: print(..., file=sys.stderr)"],
        tests: "Contrato ejecutable: corre exactamente los casos visibles del starter; exit 0 y sin traceback; stdout conserva el orden, etiquetas y valores exigidos por la instrucción, sin líneas extra.",
        feedback: "Si event=done aparece antes del 6 sin prefijo stderr:, aún escribes el log con print en stdout.",
        starterCode: {
          language: 'python',
          title: "stdout_stderr.py",
          code: `# CASO-LIM-010 · stderr vs return
# DEFECT: imprime en stdout; no usa err; quita print('ok', True)
from io import StringIO

def process(n: int, err: StringIO) -> int:
    print("event=done")
    return n * 2

err = StringIO()
out = process(3, err)
print(out)
print("stderr:", err.getvalue().strip())
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "stdout_stderr.py",
          code: `from io import StringIO

def process(n: int, err: StringIO) -> int:
    err.write("event=done\\n")
    return n * 2

err = StringIO()
out = process(3, err)
print(out)
print("stderr:", err.getvalue().strip())`,
          output: `6
stderr: event=done`,
        },
      },
      {
        id: "S10-T3-B-E2",
        subtopicId: "S10-T3-B",
        kind: "independent",
        instruction:
          "E2 (independiente) · S10-T3-B — Implementa `read_input(path_or_dash, stdin_text, file_text)`: si path es `-` usa stdin; si no, el texto de archivo. Salida esperada exacta:\ndesde stdin\ndesde file",
        hint: "Si path=='-', usa stdin_text.",
        hints: [
          "Si path=='-', usa stdin_text.",
          "Prueba ambos modos del starter.",
        ],
        edgeCases: ["En prod usa pathlib.Path.read_text o sys.stdin.read"],
        tests: "Contrato ejecutable: corre exactamente los casos visibles del starter; exit 0 y sin traceback; stdout conserva el orden, etiquetas y valores exigidos por la instrucción, sin líneas extra.",
        feedback: "Si ambos modos devuelven el file_text, el branch path=='-' no está leyendo stdin_text.",
        starterCode: {
          language: 'python',
          title: "stdin_or_path.py",
          code: `# CASO-LIM-010 · stdin dash
# DEFECT: ignora path_or_dash; quita print('ok', True)
def read_input(path_or_dash, stdin_text="", file_text=None):
    return file_text or ""

print(read_input("-", stdin_text="desde stdin"))
print(read_input("f.txt", file_text="desde file"))
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "stdin_or_path.py",
          code: `def read_input(path_or_dash, stdin_text="", file_text=None):
    if path_or_dash == "-":
        return stdin_text
    return file_text if file_text is not None else ""

print(read_input("-", stdin_text="desde stdin"))
print(read_input("file.csv", file_text="desde file"))`,
          output: `desde stdin
desde file`,
        },
      },
      {
        id: "S10-T3-B-E3",
        subtopicId: "S10-T3-B",
        kind: "transfer",
        instruction:
          "E3 (transferencia) · S10-T3-B — Separa logs de progreso (stderr) del JSON limpio en stdout. Salida esperada exacta:\nBAD\nempezando\n{\"ok\": true}\nfin\nGOOD\n{\"ok\": true}\nstderr_only empezando | fin |",
        hint: "Imprime BAD y GOOD; GOOD solo JSON final.",
        hints: [
          "Imprime BAD y GOOD; GOOD solo JSON final.",
          "Los mensajes de progreso van al StringIO de err.",
        ],
        edgeCases: ["jq falla si hay basura alrededor del JSON"],
        tests: "Contrato ejecutable: corre exactamente los casos visibles del starter; exit 0 y sin traceback; stdout conserva el orden, etiquetas y valores exigidos por la instrucción, sin líneas extra.",
        feedback: "En GOOD solo debe quedar el JSON; 'empezando'/'fin' van al StringIO de err, no al return.",
        starterCode: {
          language: 'python',
          title: "clean_stdout.py",
          code: `# CASO-LIM-010 · JSON on stdout only
# DEFECT: good_cli mezcla logs en stdout; quita print('ok', True)
from io import StringIO

def bad_cli():
    return "empezando\n{\"ok\": true}\nfin"

def good_cli(err: StringIO) -> str:
    return "empezando\n{\"ok\": true}\nfin"

print("BAD")
print(bad_cli())
print("GOOD")
print(good_cli(StringIO()))
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "clean_stdout.py",
          code: `from io import StringIO

def bad_cli():
    return "empezando\\n{\\"ok\\": true}\\nfin"

def good_cli(err: StringIO) -> str:
    err.write("empezando\\n")
    err.write("fin\\n")
    return '{"ok": true}'

print("BAD")
print(bad_cli())
err = StringIO()
print("GOOD")
print(good_cli(err))
print("stderr_only", err.getvalue().replace("\\n", " | ").strip())`,
          output: `BAD
empezando
{"ok": true}
fin
GOOD
{"ok": true}
stderr_only empezando | fin |`,
        },
      },
      {
        id: "S10-T4-A-E1",
        subtopicId: "S10-T4-A",
        kind: "guided",
        instruction:
          "E1 (guiado) · S10-T4-A — Implementa `resolve_with_trace(layers)` (`CASO-LIM-010`): aplica capas en orden canónico (defaults → file → env → flags), ignora `None`, imprime cada aplicación y el ganador final. Entrada desordenada a propósito. Salida esperada exacta:\napply defaults -> INFO\napply file -> WARNING\napply env -> DEBUG\napply flags -> ERROR\nwinner=ERROR source=flags",
        hint: "Ordena por PREC (defaults=1 … flags=4); recorre y solo aplica valores no-None; actualiza winner/source en cada apply.",
        hints: [
          "PREC = {defaults:1, file:2, env:3, flags:4}; sorted(layers, key=PREC.get).",
          "Si val is None: no imprimas apply; si no: print(f'apply {name} -> {val}') y actualiza winner/source.",
        ],
        edgeCases: ["Un flag None significa 'no pasado' y no debe pisar env"],
        tests: "Contrato ejecutable: corre exactamente los casos visibles del starter; exit 0 y sin traceback; stdout conserva el orden, etiquetas y valores exigidos por la instrucción, sin líneas extra.",
        feedback: "Si winner=INFO o el primer apply es flags, el orden de capas está invertido; si aparece apply env -> None, no estás filtrando None.",
        starterCode: {
          language: 'python',
          title: "precedence_trace.py",
          code: `# CASO-LIM-010 · apply layers + winner (no solo ranks)
# DEFECT: orden invertido; no ignora None; quita print('ok', True)
PREC = {"defaults": 4, "file": 3, "env": 2, "flags": 1}

def resolve_with_trace(layers: dict) -> None:
    ordered = sorted(layers.keys(), key=lambda n: PREC[n])
    winner = None
    source = None
    for name in ordered:
        val = layers[name]
        print(f"apply {name} -> {val}")
        winner = val
        source = name
    print(f"winner={winner} source={source}")

resolve_with_trace({
    "env": "DEBUG",
    "flags": "ERROR",
    "defaults": "INFO",
    "file": "WARNING",
})
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "precedence_trace.py",
          code: `PREC = {"defaults": 1, "file": 2, "env": 3, "flags": 4}

def resolve_with_trace(layers: dict) -> None:
    ordered = sorted(layers.keys(), key=lambda n: PREC[n])
    winner = None
    source = None
    for name in ordered:
        val = layers[name]
        if val is None:
            continue
        winner = val
        source = name
        print(f"apply {name} -> {val}")
    print(f"winner={winner} source={source}")

resolve_with_trace({
    "env": "DEBUG",
    "flags": "ERROR",
    "defaults": "INFO",
    "file": "WARNING",
})`,
          output: `apply defaults -> INFO
apply file -> WARNING
apply env -> DEBUG
apply flags -> ERROR
winner=ERROR source=flags`,
        },
      },
      {
        id: "S10-T4-A-E2",
        subtopicId: "S10-T4-A",
        kind: "independent",
        instruction:
          "E2 (independiente) · S10-T4-A — Implementa `merge(defaults, file_cfg, env_cfg, flags)` ignorando `None` en capas altas; el flag gana. Salida esperada exacta:\n{'log_level': 'ERROR', 'jobs': 1}",
        hint: "Prueba con log_level en todas las capas.",
        hints: [
          "Aplica capas de menor a mayor prioridad: defaults → file → env → flags.",
          "Si v is None, no actualices esa clave (jobs queda 1).",
        ],
        edgeCases: ["jobs queda 1 porque env manda None"],
        tests: "Contrato ejecutable: corre exactamente los casos visibles del starter; exit 0 y sin traceback; stdout conserva el orden, etiquetas y valores exigidos por la instrucción, sin líneas extra.",
        feedback: "Si log_level no es ERROR o jobs se pierde, el orden de capas o el filtro de None está al revés.",
        starterCode: {
          language: 'python',
          title: "merge_config.py",
          code: `# CASO-LIM-010 · merge precedence
# DEFECT: flags no pisan; defaults ganan; quita print('ok', True)
def merge(defaults, file_cfg, env_cfg, flags):
    out = dict(flags)
    for layer in (env_cfg, file_cfg, defaults):
        out.update({k: v for k, v in layer.items() if v is not None})
    return out

print(merge({"log_level": "INFO", "jobs": 1},
    {"log_level": "WARNING"},
    {"log_level": "DEBUG", "jobs": None},
    {"log_level": "ERROR"}))
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "merge_config.py",
          code: `def merge(defaults, file_cfg, env_cfg, flags):
    out = dict(defaults)
    for layer in (file_cfg, env_cfg, flags):
        for k, v in layer.items():
            if v is not None:
                out[k] = v
    return out

print(merge(
    {"log_level": "INFO", "jobs": 1},
    {"log_level": "WARNING"},
    {"log_level": "DEBUG", "jobs": None},
    {"log_level": "ERROR"},
))`,
          output: `{'log_level': 'ERROR', 'jobs': 1}`,
        },
      },
      {
        id: "S10-T4-A-E3",
        subtopicId: "S10-T4-A",
        kind: "transfer",
        instruction:
          "E3 (transferencia) · S10-T4-A — Conflicto env=DEBUG vs flag=INFO: resuelve con una función y explica por qué. Salida esperada exacta:\nresult=INFO\nrazón=el flag CLI tiene mayor precedencia que la variable de entorno",
        hint: "Una línea result= y una razón.",
        hints: [
          "Si flag no es None, gana el flag; si no, gana env.",
          "Imprime result= y razón= en español claro.",
        ],
        edgeCases: ["Si el flag no se pasó (None), gana env"],
        tests: "Contrato ejecutable: corre exactamente los casos visibles del starter; exit 0 y sin traceback; stdout conserva el orden, etiquetas y valores exigidos por la instrucción, sin líneas extra.",
        feedback: "Si result=DEBUG, resolve aún prioriza env; el flag no-None debe ganar y la razón debe decirlo en español.",
        starterCode: {
          language: 'python',
          title: "conflict_case.py",
          code: `# CASO-LIM-010 · CLI vs env precedence
# DEFECT: dice env gana; no resuelve con función; quita print('ok', True)
def resolve(env, flag):
    return env

print(f"result={resolve('DEBUG', 'INFO')}")
print("razón=la variable de entorno tiene mayor precedencia que el flag CLI")
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "conflict_case.py",
          code: `def resolve(env, flag):
    return flag if flag is not None else env

print(f"result={resolve('DEBUG', 'INFO')}")
print("razón=el flag CLI tiene mayor precedencia que la variable de entorno")`,
          output: `result=INFO
razón=el flag CLI tiene mayor precedencia que la variable de entorno`,
        },
      },
      {
        id: "S10-T4-B-E1",
        subtopicId: "S10-T4-B",
        kind: "guided",
        instruction:
          "E1 (guiado) · S10-T4-B — Implementa `should_ignore_secret(path)` y filtra la lista candidata: ignora secretos reales; **no** ignores `.env.example` ni `README.md`. Salida esperada exacta:\nignore: .env\nignore: .env.*\nignore: *.pem\nignore: credentials.json",
        hint: "`.env.example` se commitea vacío de secretos; `.env` y patrones de credenciales sí van a .gitignore.",
        hints: [
          "Devuelve False para .env.example y README.md.",
          "Imprime solo los que should_ignore_secret marca True, con prefijo ignore:.",
        ],
        edgeCases: [".env.example SÍ se commitea sin secretos"],
        tests: "Contrato ejecutable: corre exactamente los casos visibles del starter; exit 0 y sin traceback; stdout conserva el orden, etiquetas y valores exigidos por la instrucción, sin líneas extra.",
        feedback: "Si aparece .env.example en la salida, la función está bloqueando el template seguro del equipo.",
        starterCode: {
          language: 'python',
          title: "gitignore_secrets.py",
          code: `# CASO-LIM-010 · gitignore secrets
# DEFECT: ignora todo o casi nada; no distingue .env.example; quita print('ok', True)
CANDIDATES = [".env", ".env.example", ".env.*", "*.pem", "credentials.json", "README.md"]

def should_ignore_secret(path: str) -> bool:
    return path == ".env"

for x in CANDIDATES:
    if should_ignore_secret(x):
        print("ignore:", x)
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "gitignore_secrets.py",
          code: `CANDIDATES = [".env", ".env.example", ".env.*", "*.pem", "credentials.json", "README.md"]
SECRETS = {".env", ".env.*", "*.pem", "credentials.json"}

def should_ignore_secret(path: str) -> bool:
    if path.endswith(".example") or path == "README.md":
        return False
    return path in SECRETS

for x in CANDIDATES:
    if should_ignore_secret(x):
        print("ignore:", x)`,
          output: `ignore: .env
ignore: .env.*
ignore: *.pem
ignore: credentials.json`,
        },
      },
      {
        id: "S10-T4-B-E2",
        subtopicId: "S10-T4-B",
        kind: "independent",
        instruction:
          "E2 (independiente) · S10-T4-B — Implementa `validate_config(cfg)` que exige `log_level` y `data_dir` con errores claros. Salida esperada exacta:\nok\nconfig: falta clave requerida 'data_dir'",
        hint: "Raise RuntimeError con nombre de clave.",
        hints: [
          "Raise RuntimeError con nombre de clave.",
          "Prueba ok (ambas claves) y fail (falta data_dir).",
        ],
        edgeCases: ["Mensajes con nombre de clave ayudan al operador"],
        tests: "Contrato ejecutable: corre exactamente los casos visibles del starter; exit 0 y sin traceback; stdout conserva el orden, etiquetas y valores exigidos por la instrucción, sin líneas extra.",
        feedback: "Si sale passed_bad o no aparece data_dir en el error, validate_config aún no exige ambas claves.",
        starterCode: {
          language: 'python',
          title: "validate_cfg.py",
          code: `# CASO-LIM-010 · validate_config
# DEFECT: no valida data_dir; quita print('ok', True)
def validate_config(cfg: dict) -> None:
    if not cfg.get("log_level"):
        raise RuntimeError("config: falta clave requerida 'log_level'")

validate_config({"log_level": "INFO", "data_dir": "data"})
print("ok")
try:
    validate_config({"log_level": "INFO"})
    print("passed_bad")
except RuntimeError as e:
    print(e)
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "validate_cfg.py",
          code: `def validate_config(cfg: dict) -> None:
    for k in ("log_level", "data_dir"):
        if not cfg.get(k):
            raise RuntimeError(f"config: falta clave requerida '{k}'")

validate_config({"log_level": "INFO", "data_dir": "data"})
print("ok")
try:
    validate_config({"log_level": "INFO"})
except RuntimeError as e:
    print(e)`,
          output: `ok
config: falta clave requerida 'data_dir'`,
        },
      },
      {
        id: "S10-T4-B-E3",
        subtopicId: "S10-T4-B",
        kind: "transfer",
        instruction:
          "E3 (transferencia) · S10-T4-B — Implementa `harden_defaults(cfg)` que corrige defaults inseguros: DEBUG→INFO, echo_sql True→False, cualquier api_token truthy→None. Imprime old → new por clave. Salida esperada exacta:\nlog_level: 'DEBUG' -> 'INFO'\necho_sql: True -> False\napi_token: 'hardcoded' -> None",
        hint: "Copia cfg; aplica reglas por clave; no hardcodees un dict final sin transformar.",
        hints: [
          "out = dict(cfg); luego if out.get('log_level') == 'DEBUG': out['log_level'] = 'INFO'.",
          "Si api_token es truthy, fíjalo a None (sin secretos en defaults).",
        ],
        edgeCases: ["token default None + validate al usar"],
        tests: "Contrato ejecutable: corre exactamente los casos visibles del starter; exit 0 y sin traceback; stdout conserva el orden, etiquetas y valores exigidos por la instrucción, sin líneas extra.",
        feedback: "Si el token o DEBUG sobreviven, harden_defaults no está aplicando las reglas de endurecimiento.",
        starterCode: {
          language: 'python',
          title: "secure_defaults.py",
          code: `# CASO-LIM-010 · secure defaults
# DEFECT: harden_defaults no cambia nada; quita print('ok', True)
def harden_defaults(cfg: dict) -> dict:
    return dict(cfg)

inseguro = {"log_level": "DEBUG", "echo_sql": True, "api_token": "hardcoded"}
seguro = harden_defaults(inseguro)
for k in inseguro:
    print(f"{k}: {inseguro[k]!r} -> {seguro[k]!r}")
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "secure_defaults.py",
          code: `def harden_defaults(cfg: dict) -> dict:
    out = dict(cfg)
    if out.get("log_level") == "DEBUG":
        out["log_level"] = "INFO"
    if out.get("echo_sql") is True:
        out["echo_sql"] = False
    if out.get("api_token"):
        out["api_token"] = None
    return out

inseguro = {"log_level": "DEBUG", "echo_sql": True, "api_token": "hardcoded"}
seguro = harden_defaults(inseguro)
for k in inseguro:
    print(f"{k}: {inseguro[k]!r} -> {seguro[k]!r}")`,
          output: `log_level: 'DEBUG' -> 'INFO'
echo_sql: True -> False
api_token: 'hardcoded' -> None`,
        },
      },
    ],
  },
  youDo: {
    title: "Paquete familiarity_core + CLI profesional",
    context:
      "Conviertes el ETL de familiaridad en **paquete instalable** con subcomandos ingest|normalize|compare|report, config por precedencia y validación temprana. Sin secretos en el repositorio; solo datos sintéticos.",
    objectives: [
      "Layout src/ + pyproject.toml instalable en editable",
      "Subcomandos ingest, normalize, compare, report",
      "Lógica de dominio separada de I/O CLI",
      "Config por precedencia y validación temprana",
      "Ayuda --help y exit codes documentados",
    ],
    requirements: [
      "pip install -e . funciona en entorno limpio (documentado)",
      "python -m familiarity_core --help o entry point console_scripts",
      "Sin secretos en repo; datos sintéticos",
      "Errores de uso vs runtime distinguibles por exit code",
      "Lógica importable sin side-effects",
      "README de precedencia de config",
      "ingest ejecuta ETL CSV real: Decimal desde texto, clean/quarantine y manifest por fuente reconciliado",
      "python -m unittest discover -s tests pasa en un checkout limpio",
    ],
    starterCode: `"""bootstrap_familiarity.py — crea un paquete real, instalable y testeable.
Ejecuta: python bootstrap_familiarity.py; cd familiarity_core_project;
python -m pip install -e .; python -m unittest discover -s tests.
"""
from pathlib import Path

FILES = {
    "pyproject.toml": '''
[build-system]
requires = ["setuptools>=69"]
build-backend = "setuptools.build_meta"

[project]
name = "familiarity-core"
version = "0.1.0"
requires-python = ">=3.11"
dependencies = []

[project.scripts]
familiarity = "familiarity_core.cli:entrypoint"

[tool.setuptools.packages.find]
where = ["src"]
''',
    "src/familiarity_core/__init__.py": '''
from .core import compare, normalize, parse_monto, run_ingest

__all__ = ["compare", "normalize", "parse_monto", "run_ingest"]
''',
    "src/familiarity_core/config.py": '''
DEFAULTS = {"log_level": "INFO"}

def merge_config(defaults, file_cfg, env_cfg, flags):
    result = dict(defaults)
    for layer in (file_cfg, env_cfg, flags):
        result.update({key: value for key, value in layer.items() if value is not None})
    return result

def validate_config(config, command):
    if config.get("log_level") not in {"DEBUG", "INFO", "WARNING", "ERROR"}:
        raise ValueError("config: log_level inválido")
    required = {"ingest": "input_path", "report": "manifest_path"}.get(command)
    if required and not config.get(required):
        raise ValueError("config: falta %s para %s" % (required, command))
''',
    "src/familiarity_core/core.py": '''
from __future__ import annotations

import csv
import hashlib
import json
from decimal import Decimal, InvalidOperation
from pathlib import Path

CENT = Decimal("0.01")

def normalize(text: str) -> str:
    return " ".join(text.split()).casefold()

def compare(left: str, right: str) -> Decimal:
    return Decimal("1.00") if normalize(left) == normalize(right) else Decimal("0.00")

def parse_monto(raw: object) -> Decimal:
    try:
        value = Decimal(str(raw).strip().replace(",", ".")).quantize(CENT)
        if not value.is_finite():
            raise InvalidOperation
    except (InvalidOperation, ValueError):
        raise ValueError("monto inválido: %r" % (raw,)) from None
    if value < Decimal("0"):
        raise ValueError("monto negativo: %s" % value)
    return value

def _sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()

def run_ingest(input_path: Path, out_dir: Path) -> dict:
    clean, quarantine = [], []
    with input_path.open(encoding="utf-8", newline="") as handle:
        reader = csv.DictReader(handle)
        required = {"id", "name", "monto"}
        if not reader.fieldnames or not required.issubset(reader.fieldnames):
            raise ValueError("CSV requiere columnas id,name,monto")
        for line_no, row in enumerate(reader, start=2):
            try:
                record_id = row["id"].strip()
                if not record_id:
                    raise ValueError("id vacío")
                clean.append({
                    "id": record_id,
                    "name": normalize(row["name"]),
                    "monto": str(parse_monto(row["monto"])),
                })
            except (KeyError, ValueError) as exc:
                quarantine.append({"line": line_no, "reason": str(exc)})
    source = {
        "name": input_path.name,
        "sha256": _sha256(input_path),
        "n_in": len(clean) + len(quarantine),
        "n_clean": len(clean),
        "n_quarantine": len(quarantine),
    }
    source["reconcile_ok"] = source["n_in"] == source["n_clean"] + source["n_quarantine"]
    manifest = {
        "sources": [source],
        "n_in": source["n_in"],
        "n_clean": source["n_clean"],
        "n_quarantine": source["n_quarantine"],
        "reconcile_ok": source["reconcile_ok"],
    }
    out_dir.mkdir(parents=True, exist_ok=True)
    (out_dir / "clean.json").write_text(json.dumps(clean, ensure_ascii=False, indent=2), encoding="utf-8")
    (out_dir / "quarantine.json").write_text(json.dumps(quarantine, ensure_ascii=False, indent=2), encoding="utf-8")
    (out_dir / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
    if not manifest["reconcile_ok"]:
        raise RuntimeError("reconciliación falló")
    return manifest
''',
    "src/familiarity_core/cli.py": '''
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

from .config import DEFAULTS, merge_config, validate_config
from .core import compare, normalize, run_ingest

def build_parser():
    parser = argparse.ArgumentParser(prog="familiarity")
    parser.add_argument("--log-level", choices=["DEBUG", "INFO", "WARNING", "ERROR"])
    commands = parser.add_subparsers(dest="command", required=True)
    ingest = commands.add_parser("ingest")
    ingest.add_argument("--input", required=True)
    ingest.add_argument("--out-dir", required=True)
    normal = commands.add_parser("normalize")
    normal.add_argument("text")
    comp = commands.add_parser("compare")
    comp.add_argument("left")
    comp.add_argument("right")
    report = commands.add_parser("report")
    report.add_argument("--manifest", required=True)
    return parser

def main(argv=None):
    args = build_parser().parse_args(argv)
    flags = {"log_level": args.log_level}
    command_cfg = {
        "input_path": getattr(args, "input", None),
        "manifest_path": getattr(args, "manifest", None),
    }
    config = merge_config(DEFAULTS, {}, {}, {**flags, **command_cfg})
    try:
        validate_config(config, args.command)
        if args.command == "normalize":
            print(normalize(args.text))
        elif args.command == "compare":
            print(compare(args.left, args.right))
        elif args.command == "ingest":
            print(json.dumps(run_ingest(Path(args.input), Path(args.out_dir)), sort_keys=True))
        elif args.command == "report":
            manifest = json.loads(Path(args.manifest).read_text(encoding="utf-8"))
            print(json.dumps(manifest, sort_keys=True))
        return 0
    except (OSError, ValueError, RuntimeError, json.JSONDecodeError) as exc:
        print("error: %s" % exc, file=sys.stderr)
        return 1

def entrypoint():
    raise SystemExit(main())
''',
    "src/familiarity_core/__main__.py": '''
from .cli import entrypoint

entrypoint()
''',
    "tests/test_core.py": '''
import tempfile
import unittest
from decimal import Decimal
from pathlib import Path

from familiarity_core import compare, parse_monto, run_ingest

class CoreTests(unittest.TestCase):
    def test_decimal_and_compare(self):
        self.assertEqual(parse_monto("10,5"), Decimal("10.50"))
        self.assertEqual(compare(" Ana ", "ana"), Decimal("1.00"))

    def test_etl_reconciles_and_quarantines(self):
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            source = root / "clients.csv"
            source.write_text(chr(10).join([
                "id,name,monto", "C1,Ana,10.50", "C2,Luis,abc",
            ]) + chr(10), encoding="utf-8")
            manifest = run_ingest(source, root / "out")
            self.assertEqual((manifest["n_in"], manifest["n_clean"], manifest["n_quarantine"]), (2, 1, 1))
            self.assertTrue(manifest["sources"][0]["reconcile_ok"])

if __name__ == "__main__":
    unittest.main()
''',
    "README.md": '''
# familiarity-core

1. python -m pip install -e .
2. python -m unittest discover -s tests
3. familiarity ingest --input data/clients.csv --out-dir out
4. familiarity report --manifest out/manifest.json

Precedencia: flags > entorno > archivo > defaults. Esta base local no necesita secretos.
Exit 0 = éxito, 1 = runtime/config, 2 = uso inválido de argparse.
''',
}

root = Path("familiarity_core_project")
for relative, body in FILES.items():
    target = root / relative
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(body.strip() + chr(10), encoding="utf-8")
print("created", len(FILES), "files in", root)`,
    portfolioNote:
      "Incluye captura de --help, tabla de exit codes y ejemplo de pipe `... | normalize > out.json 2> log.txt` con datos sintéticos.",
    rubric: [
      { criterion: "Paquete editable + CLI ingest|normalize|compare|report operables", weight: "25%" },
      { criterion: "Correctitud técnica en entorno declarado", weight: "20%" },
      { criterion: "Privacidad / sin PII real / sin secretos", weight: "20%" },
      { criterion: "Pruebas o casos de borde documentados", weight: "15%" },
      { criterion: "Código legible y límites claros", weight: "10%" },
      { criterion: "Documentación en español profesional", weight: "10%" },
    ],
  },
  selfCheck: {
    questions: [
      {
        question: "¿Para qué sirve `if __name__ == '__main__'`?",
        options: ["Acelerar el interpreter", "Ejecutar el CLI/demo solo al correr el módulo, no al importar", "Definir __all__", "Instalar dependencias"],
        correctIndex: 1,
        explanation:
          "Al importar, `__name__` es el nombre del módulo: la guarda evita que el CLI corra como side-effect. Solo al ejecutar el archivo (o `python -m …`) vale `'__main__'` y arranca el entrypoint.",
      },
      {
        question: "¿Cuál es la precedencia correcta de configuración?",
        options: ["defaults > flags > env > file", "env > flags > file > defaults", "file > flags > env > defaults", "flags > env > file > defaults"],
        correctIndex: 3,
        explanation:
          "Canónica en ops: flags CLI > variables de entorno > archivo > defaults. Un flag None significa “no pasado” y no debe pisar env.",
      },
      {
        question: "Exit code 2 en CLI argparse suele significar…",
        options: ["Error de uso/parseo de argumentos", "Éxito", "Timeout de red", "Fraude detectado"],
        correctIndex: 0,
        explanation:
          "Convención Unix/Python: 0 = éxito, 1 = error de runtime/negocio, 2 = uso inválido (argv mal formado). CI y scripts dependen de distinguirlos.",
      },
      {
        question: "¿Dónde van los logs de progreso?",
        options: ["stdout con el JSON", "en el nombre del archivo", "stderr", "en __all__"],
        correctIndex: 2,
        explanation:
          "stdout = datos (JSON/CSV) para pipes; stderr = progreso y diagnóstico. Un `print('ok')` extra en stdout rompe al consumidor del pipe.",
      },
      {
        question: "Añadir un subcomando nuevo compatible es típicamente…",
        options: ["major", "minor", "borrar el repo", "patch obligatorio siempre"],
        correctIndex: 1,
        explanation:
          "SemVer: feature compatible → minor; rename/eliminar API pública → major; fix sin cambio de contrato → patch. Documenta en CHANGELOG.",
      },
      {
        question: "¿Qué no debe ir al git del paquete?",
        options: ["README.md", "pyproject.toml", "src/.../__init__.py", ".env con API_TOKEN"],
        correctIndex: 3,
        explanation:
          "Secretos fuera del repo. Commitea `.env.example` vacío de secretos; valida tokens solo donde el adaptador remoto los necesite, nunca en logs.",
      },
    ],
  },
  resources: {
    docs: [
      {
        label: "Modules — Python Tutorial",
        url: "https://docs.python.org/3/tutorial/modules.html",
        note: "imports, packages, __main__",
      },
      {
        label: "argparse — Parser for command-line options",
        url: "https://docs.python.org/3/library/argparse.html",
        note: "subparsers, exit codes",
      },
      {
        label: "Writing pyproject.toml (packaging)",
        url: "https://packaging.python.org/en/latest/guides/writing-pyproject-toml/",
        note: "src layout, project table",
      },
      {
        label: "Python Packaging User Guide",
        url: "https://packaging.python.org/en/latest/",
        note: "Editable install y metadata",
      },
      {
        label: "SemVer specification",
        url: "https://semver.org/",
        note: "MAJOR.MINOR.PATCH",
      },
      {
        label: "PyPA sampleproject",
        url: "https://github.com/pypa/sampleproject",
        note: "Layout de referencia; adaptar a familiarity_core",
      },
    ],
    books: [
      {
        label: "Python Packaging User Guide",
        url: "https://packaging.python.org/en/latest/",
        note: "Referencia de instalación editable y metadata.",
      },
      {
        label: "Click vs argparse — elegir con criterio",
        url: "https://click.palletsprojects.com/en/stable/",
        note: "En el curso usamos argparse stdlib; Click es opcional después.",
      },
    ],
    courses: [
      {
        label: "Real Python — Python application layout",
        url: "https://realpython.com/python-application-layouts/",
        note: "src layout y packages",
      },
      {
        label: "MIT 6.100L",
        url: "https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/",
        note: "Módulos y abstracción",
      },
      {
        label: "Harvard CS50P",
        url: "https://cs50.harvard.edu/python/",
        note: "Libraries y CLI",
      },
      {
        label: "Coursera — Python for Everybody",
        url: "https://www.coursera.org/specializations/python",
        note: "Módulos y scripts",
      },
    ],
  },
}
