import type { CourseSection } from '../../types'

export const section10: CourseSection = {
  id: "sklearn",
  index: 10,
  title: "Módulos, packaging y CLI profesional",
  shortTitle: "Módulos & CLI",
  tagline: "Paquete familiarity_core con CLI ingest/normalize/compare/report y config por precedencia",
  estimatedHours: 19,
  level: "Intermedio",
  phase: 0,
  icon: "Package",
  accentColor: "bg-gradient-to-br from-red-500 to-rose-600",
  jobRelevance:
    "Empaquetar un ETL en un CLI instalable es lo que separa un notebook suelto de una herramienta usable por el equipo. Esta sección (id `sklearn` conservado) retematiza S10 a **módulos, packaging y CLI**: cierra empaquetado de **CP-N1-B** y base de **CP-N1-C**. scikit-learn se difiere al tramo ML.",
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
      heading: "De “scikit-learn ML pipeline” a módulos, packaging y CLI (mapa)",
      paragraphs: [
        "En V3, **S10 no es el path principal de Pipeline/ColumnTransformer/SHAP**. Ese material se reubica al tramo de ML tabular. Aquí empaquetas **familiarity_core**: módulos limpios, **pyproject.toml**, **CLI** con subcomandos y **config por precedencia** — la herramienta que el equipo puede `pip install -e .` y correr sin notebook.",
        "Integra el ETL de CP-N1-B (S08) y la observabilidad de S09 (logs sin PII, exit codes). Entorno **local-python**. Id `sklearn` se conserva. Fail-closed si config/schema no cuadra. Stack: importlib, argparse, pyproject conceptual — **no** sklearn real.",
        "Orden: **T1 Módulos** → **T2 Paquetes** → **T3 CLI** → **T4 Configuración**. Caso sintético: CLI local con scores sintéticos y exit codes 0/1/2 — **nunca** PII real ni claims de fraude.",
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
        "Los **imports circulares** se rompen extrayendo un tercer módulo, lazy import o invirtiendo dependencias. **Prefiere diseño a hacks**. Caso sintético: CLI con scores sintéticos — **nunca** PII real.",
      ],
      code: {
        language: 'python',
        title: "main_guard.py",
        code: `# simulación en un solo archivo
__all__ = ["normalize_name"]

def normalize_name(s: str) -> str:
    return " ".join(s.split()).casefold()

def _cli():
    print(normalize_name("  Ana  PEREZ "))

if __name__ == "__main__":
    _cli()
print("import_safe", normalize_name("José"))`,
        output: `ana perez
import_safe josé`,
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
        "Lazy import dentro de funciones evita ciclos y acelera el import del paquete cuando un submódulo es pesado. Caso sintético: CLI local — **nunca** PII real.",
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
        "Si ves `ModuleNotFoundError` post-install, revisa nombre del paquete, packages discovery y el cwd. Caso sintético: CLI local — **nunca** PII real.",
      ],
      code: {
        language: 'python',
        title: "pyproject_min.py",
        code: `def s10_th_3():
    # fragmento conceptual de pyproject (como dict)
    pyproject = {
        "project": {
            "name": "familiarity-core",
            "version": "0.1.0",
            "requires-python": ">=3.11",
            "dependencies": [],
        },
        "build-system": {
            "requires": ["setuptools>=61"],
            "build-backend": "setuptools.build_meta",
        },
    }
    print(pyproject["project"]["name"], pyproject["project"]["version"])
    print("layout", "src/familiarity_core/__init__.py")

s10_th_3()`,
        output: `familiarity-core 0.1.0
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
        "Un **CHANGELOG** real, aunque breve (Added/Changed/Fixed), evita amnesia entre sprints. Breaking de firma pública se **anuncia**. Caso sintético: CLI local — **nunca** PII real.",
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
          "Si el dominio cambia nombres de entidades públicas, es breaking para consumidores del paquete.",
      },
    },
    {
      heading: "argparse, subcomandos y exit codes",
      subtopicId: "S10-T3-A",
      paragraphs: [
        "`argparse.ArgumentParser` + **subparsers** modelan `ingest|normalize|compare|report`. Cada subcomando tiene flags propios y `help=` en español claro para operadores.",
        "Exit codes: **0** éxito, **2** uso/CLI inválido (argparse default), **1** error de runtime/negocio. Scripts y CI **dependen** de esto — no devuelvas siempre 0.",
        "Separa el parse de args de la lógica: `main(argv) -> int` retorna el código; el entrypoint hace `sys.exit(main())`. Caso sintético: CLI local — **nunca** PII real.",
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

for argv in [["normalize", "--field", "email"], ["report", "--format", "json"]]:
    ns = build_parser().parse_args(argv)
    print(ns)`,
        output: `Namespace(cmd='normalize', field='email')
Namespace(cmd='report', format='json')`,
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
        "No mezcles `print` de debug en stdout. Progress y logs (S09) van a **stderr**. Caso sintético: CLI local — **nunca** PII real.",
      ],
      code: {
        language: 'python',
        title: "stdio_split.py",
        code: `import sys
from io import StringIO

def normalize_stream(inp: str) -> str:
    return inp.strip().casefold()

# simula: datos a stdout, log a stderr
data_in = "  Ana Perez  "
log = StringIO()
log.write("stage=normalize event=start\\n")
out = normalize_stream(data_in)
log.write("stage=normalize event=done\\n")
print(out)  # stdout data
print(log.getvalue().strip(), file=sys.stderr)`,
        output: `ana perez`,
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
        "Implementa un `merge_config` **puro y testeable**: dicts por capa, reduce de menor a mayor prioridad. Caso sintético: CLI local — **nunca** PII real.",
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
        "Fail-fast de config evita procesar 10k filas con un path mal tipeado. Caso sintético: CLI local — **nunca** PII real ni tokens en traceback.",
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
    intro: "Ocho demos I Do (uno por subtema). Orden T1→T4. familiarity_core: módulos, packaging, CLI y config. local-python; datos sintéticos.",
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
        description: "Modelo mínimo de layout src + metadatos instalables.",
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
    meta = {"name": "familiarity-core", "version": "0.1.0"}
    print("editable_install", f"pip install -e .  # {meta}")

s10_ido_3()`,
          output: `src/familiarity_core/__init__.py
src/familiarity_core/normalize.py
src/familiarity_core/cli.py
pyproject.toml
README.md
editable_install pip install -e .  # {'name': 'familiarity-core', 'version': '0.1.0'}`,
        },
        why: "El layout src + pyproject es el contrato de packaging del curso.",
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
print("code", main(["normalize"]))`,
          output: `report format=json
code 0
run normalize
code 0`,
        },
        why: "Subparsers + return codes hacen la CLI operable en scripts.",
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
    intro: "Andamiaje: **E1 guiado → E2 independiente → E3 transferencia** × 8 subtemas (24 ejercicios, 2 hints c/u). Sin scikit-learn en este incremento V3.",
    steps: [
      {
        id: "S10-T1-A-E1",
        subtopicId: "S10-T1-A",
        kind: "guided",
        instruction:
          "E1 (guiado) — Concepto: S10-T1-A (Módulos, packaging y CLI). Entrada: fixture sintético del starter (`CASO`/ids C00x) en packaging y CLI. Tarea: Crea un módulo lógico con función pública `clean` y `__all__ = ['clean']`. Salida/pass: `['clean'] | x`. Conserva el contrato del starter (no borres asserts ni datos); no sklearn real, no packaging cloud; solo importlib, argparse, pyproject conceptual (S01–S10).",
        hint: "Helper privado con _ no va en __all__.",
        hints: [
          "Helper privado con _ no va en __all__.",
          "Imprime __all__ y clean('  X ').",
        ],
        edgeCases: ["import * no es recomendado; __all__ documenta intención"],
        tests: "Contrato ejecutable: corre exactamente los casos visibles del starter; exit 0 y sin traceback; stdout conserva el orden, etiquetas y valores exigidos por la instrucción, sin líneas extra.",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "public_module.py",
          code: `# CASO-LIM-010 · clean + __all__
# DEFECT: _ws no colapsa; no exporta clean
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
          "E2 (independiente) — Concepto: S10-T1-A (Módulos, packaging y CLI). Entrada: fixture sintético del starter (`CASO`/ids C00x) en packaging y CLI. Tarea: Simula un import circular y arréglalo extrayendo un util compartido. Salida/pass: `hola:a | hola:b | ok`. Conserva el contrato del starter (no borres asserts ni datos); no sklearn real, no packaging cloud; solo importlib, argparse, pyproject conceptual (S01–S10).",
        hint: "a importa b y b importa a → rompe; mueve la función común a util.",
        hints: [
          "a importa b y b importa a → rompe; mueve la función común a util.",
          "Imprime ok desde ambos lados.",
        ],
        edgeCases: ["Lazy import dentro de función es plan B"],
        tests: "Contrato ejecutable: corre exactamente los casos visibles del starter; exit 0 y sin traceback; stdout conserva el orden, etiquetas y valores exigidos por la instrucción, sin líneas extra.",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "fix_circular.py",
          code: `# CASO-LIM-010 · shared util modules
# DEFECT: util_norm no casefold; suffixes invertidos
def util_norm(s: str) -> str:
    return s.strip()

def module_a_process(s: str) -> str:
    return util_norm(s) + ":b"

def module_b_process(s: str) -> str:
    return util_norm(s) + ":a"

print(module_a_process(" A "))
print(module_b_process(" A "))
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "fix_circular.py",
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
          "E3 (transferencia) — Concepto: S10-T1-A (Módulos, packaging y CLI). Entrada: fixture sintético del starter (`CASO`/ids C00x) en packaging y CLI. Tarea: Elige import absoluto vs relativo en layout src: imprime la recomendación para 3 casos. Salida/pass: salida exacta del solution output del starter. Conserva el contrato del starter (no borres asserts ni datos); no sklearn real, no packaging cloud; solo importlib, argparse, pyproject conceptual (S01–S10).",
        hint: "Dentro del paquete: relativo OK; plugins externos: absoluto; scripts: -m.",
        hints: [
          "Dentro del paquete: relativo OK; plugins externos: absoluto; scripts: -m.",
          "Formato caso -> recomendación.",
        ],
        edgeCases: ["Evita manipular sys.path a mano en prod"],
        tests: "Contrato ejecutable: corre exactamente los casos visibles del starter; exit 0 y sin traceback; stdout conserva el orden, etiquetas y valores exigidos por la instrucción, sin líneas extra.",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "import_style.py",
          code: `# CASO-LIM-010 · relative vs absolute import
# DEFECT: recomendaciones invertidas
recs = {
    "normalize.py importa compare en el mismo paquete": "absoluto siempre (import compare)",
    "plugin externo usa familiarity_core": "relativo (from . import)",
    "ejecutar e": "PYTHONPATH=.",
}
for k, v in recs.items():
    print(k, "->", v)
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "import_style.py",
          code: `recs = {
    "normalize.py importa compare en el mismo paquete": "relativo o absoluto del paquete (from . import compare)",
    "plugin externo usa familiarity_core": "absoluto (import familiarity_core)",
    "ejecutar el CLI del paquete": "python -m familiarity_core",
}
for c, r in recs.items():
    print(f"{c} -> {r}")`,
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
          "E1 (guiado) — Concepto: S10-T1-B (Módulos, packaging y CLI). Entrada: fixture sintético del starter (`CASO`/ids C00x) en packaging y CLI. Tarea: Marca helpers privados con _ y deja públicas solo importlib, argparse, pyproject conceptual (S01–S10).",
        hint: "Imprime lista public vs private detectada por nombre.",
        hints: [
          "Imprime lista public vs private detectada por nombre.",
          "Usa dir() filtrado o una lista explícita.",
        ],
        edgeCases: ["Un solo _ es convención, no enforcement del runtime"],
        tests: "Contrato ejecutable: corre exactamente los casos visibles del starter; exit 0 y sin traceback; stdout conserva el orden, etiquetas y valores exigidos por la instrucción, sin líneas extra.",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "mark_private.py",
          code: `# CASO-LIM-010 · public vs private names
# DEFECT: exporta _tokenize como público
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
          "E2 (independiente) — Concepto: S10-T1-B (Módulos, packaging y CLI). Entrada: fixture sintético del starter (`CASO`/ids C00x) en packaging y CLI. Tarea: Implementa una fachada que reexporta normalize y compare e imprime __all__. Salida/pass: `['normalize', 'compare'] | True`. Conserva el contrato del starter (no borres asserts ni datos); no sklearn real, no packaging cloud; solo importlib, argparse, pyproject conceptual (S01–S10).",
        hint: "Las implementaciones pueden ser locales.",
        hints: [
          "Las implementaciones pueden ser locales.",
          "from-style reexport simulado.",
        ],
        edgeCases: ["No reexportes _tokenize"],
        tests: "Contrato ejecutable: corre exactamente los casos visibles del starter; exit 0 y sin traceback; stdout conserva el orden, etiquetas y valores exigidos por la instrucción, sin líneas extra.",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "facade.py",
          code: `# CASO-LIM-010 · facade __all__
# DEFECT: __all__ vacío; compare sin normalize
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
          "E3 (transferencia) — Concepto: S10-T1-B (Módulos, packaging y CLI). Entrada: fixture sintético del starter (`CASO`/ids C00x) en packaging y CLI. Tarea: Documenta un breaking change de firma pública: old → new y versión major. Salida/pass: primeros tokens de `BREAKING: compare(a,b)->bool  =>  compare(a,b)->fl…` según solution. Conserva el contrato del starter (no borres asserts ni datos); no sklearn real, no.",
        hint: "Imprime BREAKING y NEW_VERSION.",
        hints: [
          "Imprime BREAKING y NEW_VERSION.",
          "Ejemplo: compare(a,b)->bool se vuelve compare(a,b)->float score.",
        ],
        edgeCases: ["Añadir argumento opcional con default puede ser minor"],
        tests: "Contrato ejecutable: corre exactamente los casos visibles del starter; exit 0 y sin traceback; stdout conserva el orden, etiquetas y valores exigidos por la instrucción, sin líneas extra.",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "breaking_change.py",
          code: `# CASO-LIM-010 · breaking change notes
# DEFECT: dice PATCH y sin migración
print("BREAKING: compare(a,b)->bool  =>  compare(a,b)->float score")
print("NEW_VERSION: 1.0.0 -> 1.0.1")
print("MIGRATION: none")
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "breaking_change.py",
          code: `print("BREAKING: compare(a,b)->bool  =>  compare(a,b)->float score")
print("NEW_VERSION: 1.0.0 -> 2.0.0")
print("MIGRATION: usar compare(a,b) == 1.0 en vez de is True")`,
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
          "E1 (guiado) — Concepto: S10-T2-A (Módulos, packaging y CLI). Entrada: fixture sintético del starter (`CASO`/ids C00x) en packaging y CLI. Tarea: Completa un dict estilo pyproject con name y version e imprímelos. Salida/pass: primeros tokens de `{'name': 'familiarity-core', 'version': '0.1.0', '…` según solution. Conserva el contrato del starter (no borres asserts ni datos); no sklearn real, no packaging cloud;.",
        hint: "name=familiarity-core version=0.1.0",
        hints: [
          "name=familiarity-core version=0.1.0",
          "Incluye requires-python >=3.11.",
        ],
        edgeCases: ["El nombre de distribución puede usar guiones; el import usa guion bajo"],
        tests: "Contrato ejecutable: corre exactamente los casos visibles del starter; exit 0 y sin traceback; stdout conserva el orden, etiquetas y valores exigidos por la instrucción, sin líneas extra.",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "pyproject_fields.py",
          code: `# CASO-LIM-010 · project metadata
# DEFECT: omite requires-python; name wrong
project = {
    "name": "familiarity",
    "version": "0.1.0",
}
print(project)
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "pyproject_fields.py",
          code: `project = {
    "name": "familiarity-core",
    "version": "0.1.0",
    "requires-python": ">=3.11",
}
print(project)`,
          output: `{'name': 'familiarity-core', 'version': '0.1.0', 'requires-python': '>=3.11'}`,
        },
      },
      {
        id: "S10-T2-A-E2",
        subtopicId: "S10-T2-A",
        kind: "independent",
        instruction:
          "E2 (independiente) — Concepto: S10-T2-A (Módulos, packaging y CLI). Entrada: fixture sintético del starter (`CASO`/ids C00x) en packaging y CLI. Tarea: Lista el layout src mínimo de un paquete importable e imprime cada path. Salida/pass: primeros tokens de `src/familiarity_core/__init__.py | src/familiarity…` según solution. Conserva el contrato del starter (no borres asserts ni datos); no sklearn real, no.",
        hint: "Incluye __init__.py, normalize.py, cli.py, pyproject.toml.",
        hints: [
          "Incluye __init__.py, normalize.py, cli.py, pyproject.toml.",
          "Usa prefijo src/familiarity_core/.",
        ],
        edgeCases: ["tests/ fuera de src"],
        tests: "Contrato ejecutable: corre exactamente los casos visibles del starter; exit 0 y sin traceback; stdout conserva el orden, etiquetas y valores exigidos por la instrucción, sin líneas extra.",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "layout_list.py",
          code: `# CASO-LIM-010 · src layout paths
# DEFECT: omite pyproject y cli
paths = [
    "src/familiarity_core/__init__.py",
    "src/familiarity_core/normalize.py",
]
for p in paths:
    print(p)
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "layout_list.py",
          code: `paths = [
    "src/familiarity_core/__init__.py",
    "src/familiarity_core/normalize.py",
    "src/familiarity_core/cli.py",
    "pyproject.toml",
]
for p in paths:
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
          "E3 (transferencia) — Concepto: S10-T2-A (Módulos, packaging y CLI). Entrada: fixture sintético del starter (`CASO`/ids C00x) en packaging y CLI. Tarea: Diagnostica ModuleNotFoundError: imprime 3 causas probables post-install. Salida/pass: primeros tokens de `cause: paquete no instalado (falta pip install -e …` según solution. Conserva el contrato del starter (no borres asserts ni datos); no sklearn real, no.",
        hint: "Piensa en nombre, editable, y cwd.",
        hints: [
          "Piensa en nombre, editable, y cwd.",
          "Formato cause: ...",
        ],
        edgeCases: ["venv incorrecto es causa clásica"],
        tests: "Contrato ejecutable: corre exactamente los casos visibles del starter; exit 0 y sin traceback; stdout conserva el orden, etiquetas y valores exigidos por la instrucción, sin líneas extra.",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "diagnose_mnf.py",
          code: `# CASO-LIM-010 · import fail causes
# DEFECT: una sola causa genérica
causes = ["cause: error desconocido"]
for c in causes:
    print(c)
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "diagnose_mnf.py",
          code: `causes = [
    "cause: paquete no instalado (falta pip install -e .)",
    "cause: nombre import != nombre de carpeta (familiarity_core)",
    "cause: se ejecuta un script que tapa el paquete en sys.path",
]
for c in causes:
    print(c)`,
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
          "E1 (guiado) — Concepto: S10-T2-B (Módulos, packaging y CLI). Entrada: fixture sintético del starter (`CASO`/ids C00x) en packaging y CLI. Tarea: Clasifica 4 cambios en major/minor/patch. Salida/pass: salida exacta del solution output del starter. Conserva el contrato del starter (no borres asserts ni datos); no sklearn real, no packaging cloud; solo importlib, argparse, pyproject conceptual (S01–S10).",
        hint: "Breaking → major; feature → minor; fix → patch.",
        hints: [
          "Breaking → major; feature → minor; fix → patch.",
          "Imprime cambio: nivel.",
        ],
        edgeCases: ["Deprecar primero reduce dolor del major"],
        tests: "Contrato ejecutable: corre exactamente los casos visibles del starter; exit 0 y sin traceback; stdout conserva el orden, etiquetas y valores exigidos por la instrucción, sin líneas extra.",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "semver_classify.py",
          code: `# CASO-LIM-010 · semver levels
# DEFECT: renombrar API pública = patch
niveles = {
    "renombrar normalize a clean_name (API pública)": "patch",
    "añadir flag --format a report": "major",
    "corregir typo en help": "minor",
    "eliminar subcomando compare": "minor",
}
for c, n in niveles.items():
    print(f"{c}: {n}")
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "semver_classify.py",
          code: `niveles = {
    "renombrar normalize a clean_name (API pública)": "major",
    "añadir flag --format a report": "minor",
    "corregir typo en help": "patch",
    "eliminar subcomando compare": "major",
}
for c, n in niveles.items():
    print(f"{c}: {n}")`,
          output: `renombrar normalize a clean_name (API pública): major
añadir flag --format a report: minor
corregir typo en help: patch
eliminar subcomando compare: major`,
        },
      },
      {
        id: "S10-T2-B-E2",
        subtopicId: "S10-T2-B",
        kind: "independent",
        instruction:
          "E2 (independiente) — Concepto: S10-T2-B (Módulos, packaging y CLI). Entrada: fixture sintético del starter (`CASO`/ids C00x) en packaging y CLI. Tarea: Fija dependencies mínimas del paquete (puede ser lista vacía + note) e imprime requires-python. Salida/pass: primeros tokens de `{'requires-python': '>=3.11', 'dependencies': [], …` según solution. Conserva el contrato del starter (no borres asserts ni datos); no.",
        hint: "Para N1 stdlib: dependencies=[].",
        hints: [
          "Para N1 stdlib: dependencies=[].",
          "requires-python>=3.11.",
        ],
        edgeCases: ["pytest como optional dev, no runtime"],
        tests: "Contrato ejecutable: corre exactamente los casos visibles del starter; exit 0 y sin traceback; stdout conserva el orden, etiquetas y valores exigidos por la instrucción, sin líneas extra.",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "deps_pin.py",
          code: `# CASO-LIM-010 · deps structure
# DEFECT: pytest en dependencies runtime
deps = {
    "requires-python": ">=3.11",
    "dependencies": ["pytest"],
    "optional-dependencies": {},
}
print(deps)
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "deps_pin.py",
          code: `deps = {
    "requires-python": ">=3.11",
    "dependencies": [],
    "optional-dependencies": {"dev": ["pytest"]},
}
print(deps)`,
          output: `{'requires-python': '>=3.11', 'dependencies': [], 'optional-dependencies': {'dev': ['pytest']}}`,
        },
      },
      {
        id: "S10-T2-B-E3",
        subtopicId: "S10-T2-B",
        kind: "transfer",
        instruction:
          "E3 (transferencia) — Concepto: S10-T2-B (Módulos, packaging y CLI). Entrada: fixture sintético del starter (`CASO`/ids C00x) en packaging y CLI. Tarea: Escribe una política de compatibilidad hacia S11 dominio (3 bullets). Salida/pass: primeros tokens de `POLICY: renombrar ClientRecord es MAJOR; documenta…` según solution. Conserva el contrato del starter (no borres asserts ni datos); no sklearn real, no packaging.",
        hint: "Cubrir renames de entidades y versiones.",
        hints: [
          "Cubrir renames de entidades y versiones.",
          "Imprime POLICY líneas.",
        ],
        edgeCases: ["Frozen entities pueden forzar major si cambia equality"],
        tests: "Contrato ejecutable: corre exactamente los casos visibles del starter; exit 0 y sin traceback; stdout conserva el orden, etiquetas y valores exigidos por la instrucción, sin líneas extra.",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "compat_policy.py",
          code: `# CASO-LIM-010 · API change policy
# DEFECT: renombrar ClientRecord es MINOR
for line in [
    "POLICY: renombrar ClientRecord es MINOR; no documentar",
    "POLICY: añadir campo opcional con default es MAJOR",
    "POLICY: S11 puede romper CLI de S10 sin bump",
]:
    print(line)
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "compat_policy.py",
          code: `for line in [
    "POLICY: renombrar ClientRecord es MAJOR; documentar migración",
    "POLICY: añadir campo opcional con default es MINOR",
    "POLICY: S11 no rompe CLI de S10 sin bump y CHANGELOG",
]:
    print(line)`,
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
          "E1 (guiado) — Concepto: S10-T3-A (Módulos, packaging y CLI). Entrada: fixture sintético del starter (`CASO`/ids C00x) en packaging y CLI. Tarea: Añade subcomando report con --format text|json y parsea un argv de ejemplo. Salida/pass: `Namespace(cmd='report', format='json')`. Conserva el contrato del starter (no borres asserts ni datos); no sklearn real, no packaging cloud; solo importlib, argparse, pyproject conceptual (S01–S10).",
        hint: "Usa argparse subparsers.",
        hints: [
          "Usa argparse subparsers.",
          "Imprime el namespace.",
        ],
        edgeCases: ["required=True en subparsers (py3.7+)"],
        tests: "Contrato ejecutable: corre exactamente los casos visibles del starter; exit 0 y sin traceback; stdout conserva el orden, etiquetas y valores exigidos por la instrucción, sin líneas extra.",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "report_subcmd.py",
          code: `# CASO-LIM-010 · argparse subparsers
# DEFECT: sin required subparser; sin --format
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
          "E2 (independiente) — Concepto: S10-T3-A (Módulos, packaging y CLI). Entrada: fixture sintético del starter (`CASO`/ids C00x) en packaging y CLI. Tarea: Mapea situaciones a exit codes 0/1/2 e imprime `caso: code`. Salida/pass: salida exacta del solution output del starter. Conserva el contrato del starter (no borres asserts ni datos); no sklearn real, no packaging cloud; solo importlib, argparse, pyproject conceptual (S01–S10).",
        hint: "0 éxito, 1 runtime, 2 usage.",
        hints: [
          "0 éxito, 1 runtime, 2 usage.",
          "Cinco casos.",
        ],
        edgeCases: ["argparse usa 2 por defecto en errores de parseo"],
        tests: "Contrato ejecutable: corre exactamente los casos visibles del starter; exit 0 y sin traceback; stdout conserva el orden, etiquetas y valores exigidos por la instrucción, sin líneas extra.",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exit_codes.py",
          code: `# CASO-LIM-010 · exit codes
# DEFECT: todo exit 0
codes = {
    "normalize ok": 0,
    "archivo de input no existe": 0,
    "flag desconocido": 0,
    "subcomando ausente": 0,
    "validación de config falla al arrancar": 0,
}
for c, code in codes.items():
    print(f"{c}: {code}")
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "exit_codes.py",
          code: `codes = {
    "normalize ok": 0,
    "archivo de input no existe": 1,
    "flag desconocido": 2,
    "subcomando ausente": 2,
    "validación de config falla al arrancar": 1,
}
for c, code in codes.items():
    print(f"{c}: {code}")`,
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
          "E3 (transferencia) — Concepto: S10-T3-A (Módulos, packaging y CLI). Entrada: fixture sintético del starter (`CASO`/ids C00x) en packaging y CLI. Tarea: Escribe 3 líneas de ayuda --help orientadas a operador no dev. Salida/pass: salida exacta del solution output del starter. Conserva el contrato del starter (no borres asserts ni datos); no sklearn real, no packaging cloud; solo importlib, argparse, pyproject conceptual (S01–S10).",
        hint: "Evita jerga de frameworks.",
        hints: [
          "Evita jerga de frameworks.",
          "Imprime HELP: ...",
        ],
        edgeCases: ["Ejemplos concretos > descripciones abstractas"],
        tests: "Contrato ejecutable: corre exactamente los casos visibles del starter; exit 0 y sin traceback; stdout conserva el orden, etiquetas y valores exigidos por la instrucción, sin líneas extra.",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "operator_help.py",
          code: `# CASO-LIM-010 · help examples
# DEFECT: help sin ejemplos de comando
for h in [
    "HELP: ver --help",
    "HELP: buen luck",
]:
    print(h)
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "operator_help.py",
          code: `for h in [
    "HELP: familiarity ingest --input data/clientes.csv  # carga el archivo de clientes",
    "HELP: familiarity normalize --field name            # limpia espacios y mayúsculas",
    "HELP: Si falla, revise el código de salida: 2=uso, 1=error de datos/config",
]:
    print(h)`,
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
          "E1 (guiado) — Concepto: S10-T3-B (Módulos, packaging y CLI). Entrada: fixture sintético del starter (`CASO`/ids C00x) en packaging y CLI. Tarea: Escribe resultado a stdout y un log a stderr (capturado con StringIO en la demo). Salida/pass: `6 | stderr: event=done`. Conserva el contrato del starter (no borres asserts ni datos); no sklearn real, no packaging cloud; solo importlib, argparse, pyproject conceptual (S01–S10).",
        hint: "Función process(n) retorna n*2; log event=done.",
        hints: [
          "Función process(n) retorna n*2; log event=done.",
          "Imprime ambos streams.",
        ],
        edgeCases: ["En CLI real: print(..., file=sys.stderr)"],
        tests: "Contrato ejecutable: corre exactamente los casos visibles del starter; exit 0 y sin traceback; stdout conserva el orden, etiquetas y valores exigidos por la instrucción, sin líneas extra.",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "stdout_stderr.py",
          code: `# CASO-LIM-010 · stderr vs return
# DEFECT: imprime en stdout; no usa err
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
import sys

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
          "E2 (independiente) — Concepto: S10-T3-B (Módulos, packaging y CLI). Entrada: fixture sintético del starter (`CASO`/ids C00x) en packaging y CLI. Tarea: Implementa `read_input(path_or_dash, stdin_text)` que lee path o '-' como stdin. Salida/pass: salida exacta del solution output del starter. Conserva el contrato del starter (no borres asserts ni datos); no sklearn real, no packaging cloud; solo importlib, argparse, pyproject conceptual (S01–S10).",
        hint: "Si path=='-', usa stdin_text.",
        hints: [
          "Si path=='-', usa stdin_text.",
          "Prueba ambos modos.",
        ],
        edgeCases: ["En prod usa pathlib.Path.read_text o sys.stdin.read"],
        tests: "Contrato ejecutable: corre exactamente los casos visibles del starter; exit 0 y sin traceback; stdout conserva el orden, etiquetas y valores exigidos por la instrucción, sin líneas extra.",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "stdin_or_path.py",
          code: `# CASO-LIM-010 · stdin dash
# DEFECT: ignora path_or_dash
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
          "E3 (transferencia) — Concepto: S10-T3-B (Módulos, packaging y CLI). Entrada: fixture sintético del starter (`CASO`/ids C00x) en packaging y CLI. Tarea: Revisa un CLI que contamina stdout con prints de progreso y propón la salida limpia. Salida/pass: salida exacta del solution output del starter. Conserva el contrato del starter (no borres asserts ni datos); no sklearn real, no packaging cloud; solo importlib, argparse, pyproject conceptual (S01–S10).",
        hint: "Imprime BAD y GOOD.",
        hints: [
          "Imprime BAD y GOOD.",
          "GOOD solo JSON final.",
        ],
        edgeCases: ["jq falla si hay basura alrededor del JSON"],
        tests: "Contrato ejecutable: corre exactamente los casos visibles del starter; exit 0 y sin traceback; stdout conserva el orden, etiquetas y valores exigidos por la instrucción, sin líneas extra.",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "clean_stdout.py",
          code: `# CASO-LIM-010 · JSON on stdout only
# DEFECT: good_cli mezcla logs en stdout
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
          "E1 (guiado) — Concepto: S10-T4-A (Módulos, packaging y CLI). Entrada: fixture sintético del starter (`CASO`/ids C00x) en packaging y CLI. Tarea: Imprime la tabla de precedencia de 4 capas (1=más baja … 4=más alta). Salida/pass: `1:defaults | 2:file | 3:env | 4:flags`. Conserva el contrato del starter (no borres asserts ni datos); no sklearn real, no packaging cloud; solo importlib, argparse, pyproject conceptual (S01–S10).",
        hint: "defaults < file < env < flags.",
        hints: [
          "defaults < file < env < flags.",
          "Formato rank:layer",
        ],
        edgeCases: ["Documenta si algún flag es global vs por subcomando"],
        tests: "Contrato ejecutable: corre exactamente los casos visibles del starter; exit 0 y sin traceback; stdout conserva el orden, etiquetas y valores exigidos por la instrucción, sin líneas extra.",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "precedence_table.py",
          code: `# CASO-LIM-010 · config layers order
# DEFECT: flags primero (invertido)
layers = ["flags", "env", "file", "defaults"]
for i, name in enumerate(layers, 1):
    print(f"{i}:{name}")
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "precedence_table.py",
          code: `layers = ["defaults", "file", "env", "flags"]
for i, name in enumerate(layers, 1):
    print(f"{i}:{name}")`,
          output: `1:defaults
2:file
3:env
4:flags`,
        },
      },
      {
        id: "S10-T4-A-E2",
        subtopicId: "S10-T4-A",
        kind: "independent",
        instruction:
          "E2 (independiente) — Concepto: S10-T4-A (Módulos, packaging y CLI). Entrada: fixture sintético del starter (`CASO`/ids C00x) en packaging y CLI. Tarea: Implementa `merge(defaults, file_cfg, env_cfg, flags)` ignorando None en capas altas. Salida/pass: salida exacta del solution output del starter. Conserva el contrato del starter (no borres asserts ni datos); no sklearn real, no packaging cloud; solo importlib, argparse, pyproject conceptual (S01–S10).",
        hint: "Prueba con log_level en todas las capas.",
        hints: [
          "Prueba con log_level en todas las capas.",
          "El flag debe ganar.",
        ],
        edgeCases: ["jobs queda 1 porque env manda None"],
        tests: "Contrato ejecutable: corre exactamente los casos visibles del starter; exit 0 y sin traceback; stdout conserva el orden, etiquetas y valores exigidos por la instrucción, sin líneas extra.",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "merge_config.py",
          code: `# CASO-LIM-010 · merge precedence
# DEFECT: flags no pisan; defaults ganan
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
          "E3 (transferencia) — Concepto: S10-T4-A (Módulos, packaging y CLI). Entrada: fixture sintético del starter (`CASO`/ids C00x) en packaging y CLI. Tarea: Caso conflictivo: env=DEBUG y flag=INFO — imprime el resultado esperado y por qué. Salida/pass: primeros tokens de `result=INFO | razon=el flag CLI tiene mayor preced…` según solution. Conserva el contrato del starter (no borres asserts ni datos); no sklearn real,.",
        hint: "Una línea result= y una razón.",
        hints: [
          "Una línea result= y una razón.",
          "Español claro.",
        ],
        edgeCases: ["Si el flag no se pasó (None), gana env"],
        tests: "Contrato ejecutable: corre exactamente los casos visibles del starter; exit 0 y sin traceback; stdout conserva el orden, etiquetas y valores exigidos por la instrucción, sin líneas extra.",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "conflict_case.py",
          code: `# CASO-LIM-010 · CLI vs env precedence
# DEFECT: dice env gana
print("result=DEBUG")
print("razon=la variable de entorno tiene mayor precedencia que el flag CLI")
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "conflict_case.py",
          code: `print("result=INFO")
print("razon=el flag CLI tiene mayor precedencia que la variable de entorno")`,
          output: `result=INFO
razon=el flag CLI tiene mayor precedencia que la variable de entorno`,
        },
      },
      {
        id: "S10-T4-B-E1",
        subtopicId: "S10-T4-B",
        kind: "guided",
        instruction:
          "E1 (guiado) — Concepto: S10-T4-B (Módulos, packaging y CLI). Entrada: fixture sintético del starter (`CASO`/ids C00x) en packaging y CLI. Tarea: Checklist de secretos en .gitignore: imprime 4 entradas típicas. Salida/pass: primeros tokens de `ignore: .env | ignore: .env.* | ignore: *.pem | ig…` según solution. Conserva el contrato del starter (no borres asserts ni datos); no sklearn real, no packaging cloud solo importlib, argparse, pyproject conceptual (S01–S10).",
        hint: "Incluye .env, *.pem, credentials.json, .venv opcional no es secreto pero sí local.",
        hints: [
          "Incluye .env, *.pem, credentials.json, .venv opcional no es secreto pero sí local.",
          "Formato ignore: ...",
        ],
        edgeCases: [".env.example SÍ se commitea sin secretos"],
        tests: "Contrato ejecutable: corre exactamente los casos visibles del starter; exit 0 y sin traceback; stdout conserva el orden, etiquetas y valores exigidos por la instrucción, sin líneas extra.",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "gitignore_secrets.py",
          code: `# CASO-LIM-010 · gitignore secrets
# DEFECT: ignora solo .env
for x in [".env"]:
    print("ignore:", x)
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "gitignore_secrets.py",
          code: `for x in [".env", ".env.*", "*.pem", "credentials.json"]:
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
          "E2 (independiente) — Concepto: S10-T4-B (Módulos, packaging y CLI). Entrada: fixture sintético del starter (`CASO`/ids C00x) en packaging y CLI. Tarea: Implementa `validate_config(cfg)` que exige log_level y data_dir; errores claros. Salida/pass: salida exacta del solution output del starter. Conserva el contrato del starter (no borres asserts ni datos); no sklearn real, no packaging cloud; solo importlib, argparse, pyproject conceptual (S01–S10).",
        hint: "Raise RuntimeError con nombre de clave.",
        hints: [
          "Raise RuntimeError con nombre de clave.",
          "Prueba ok y fail.",
        ],
        edgeCases: ["Mensajes con nombre de clave ayudan al operador"],
        tests: "Contrato ejecutable: corre exactamente los casos visibles del starter; exit 0 y sin traceback; stdout conserva el orden, etiquetas y valores exigidos por la instrucción, sin líneas extra.",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "validate_cfg.py",
          code: `# CASO-LIM-010 · validate_config
# DEFECT: no valida data_dir
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
          "E3 (transferencia) — Concepto: S10-T4-B (Módulos, packaging y CLI). Entrada: fixture sintético del starter (`CASO`/ids C00x) en packaging y CLI. Tarea: Dado un default inseguro (log_level=DEBUG y echo_sql=True), propone defaults seguros. Salida/pass: primeros tokens de `log_level: 'DEBUG' -> 'INFO' | echo_sql: True -> F…` según solution. Conserva el contrato del starter (no borres asserts ni datos); no sklearn.",
        hint: "Imprime old → new por clave.",
        hints: [
          "Imprime old → new por clave.",
          "Sin secretos en defaults.",
        ],
        edgeCases: ["token default None + validate al usar"],
        tests: "Contrato ejecutable: corre exactamente los casos visibles del starter; exit 0 y sin traceback; stdout conserva el orden, etiquetas y valores exigidos por la instrucción, sin líneas extra.",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "secure_defaults.py",
          code: `# CASO-LIM-010 · secure defaults
# DEFECT: mantiene DEBUG y token hardcoded como "seguro"
inseguro = {"log_level": "DEBUG", "echo_sql": True, "api_token": "hardcoded"}
seguro = dict(inseguro)
for k in inseguro:
    print(f"{k}: {inseguro[k]!r} -> {seguro[k]!r}")
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "secure_defaults.py",
          code: `inseguro = {"log_level": "DEBUG", "echo_sql": True, "api_token": "hardcoded"}
seguro = {"log_level": "INFO", "echo_sql": False, "api_token": None}
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
      "Conviertes el ETL de familiaridad en **paquete instalable** con subcomandos ingest|normalize|compare|report, config por precedencia y validación temprana. Sin secretos en repo. Reemplaza el legado de churn sklearn.",
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
      { criterion: "Alineación al gate V3 de la sección", weight: "25%" },
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
          "Evita side-effects al importar el paquete.",
      },
      {
        question: "Precedencia correcta de config…",
        options: ["defaults > flags > env > file", "env > flags > file > defaults", "file > flags > env > defaults", "flags > env > file > defaults"],
        correctIndex: 3,
        explanation:
          "Flags CLI ganan; defaults son la base.",
      },
      {
        question: "Exit code 2 en CLI argparse suele significar…",
        options: ["Error de uso/parseo de argumentos", "Éxito", "Timeout de red", "Fraude detectado"],
        correctIndex: 0,
        explanation:
          "Convención: 2 usage; 1 runtime; 0 ok.",
      },
      {
        question: "¿Dónde van los logs de progreso?",
        options: ["stdout con el JSON", "en el nombre del archivo", "stderr", "en __all__"],
        correctIndex: 2,
        explanation:
          "stderr deja stdout limpio para pipes.",
      },
      {
        question: "Añadir un subcomando nuevo compatible es tipicamente…",
        options: ["major", "minor", "borrar el repo", "patch obligatorio siempre"],
        correctIndex: 1,
        explanation:
          "Feature compatible → minor en semver.",
      },
      {
        question: "¿Qué no debe ir al git del paquete?",
        options: ["README.md", "pyproject.toml", "src/.../__init__.py", ".env con API_TOKEN"],
        correctIndex: 3,
        explanation:
          "Secretos fuera del repo; usa .env.example sin valores reales.",
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
        note: "Referencia de instalación editable y metadata.",
      },
      {
        label: "Click vs argparse — elegir con criterio",
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
