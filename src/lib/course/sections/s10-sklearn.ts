import type { CourseSection } from '../../types'

export const section10: CourseSection = {
  id: "sklearn",
  index: 10,
  title: "Módulos, packaging y CLI profesional",
  shortTitle: "Módulos & CLI",
  tagline: "Paquete familiarity_core con CLI ingest/normalize/compare/report y config por precedencia",
  estimatedHours: 10,
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
        "En V3, **S10 no es el path principal de Pipeline/ColumnTransformer/SHAP**. Ese material se reubica al tramo de ML tabular. Aquí empaquetas **familiarity_core**: módulos limpios, **pyproject.toml**, **CLI** con subcomandos y **config por precedencia**.",
        "Integra el ETL de CP-N1-B y la observabilidad de S09. Entorno **local-python**. Id de plataforma `sklearn` se conserva.",
        "Orden: **T1 Módulos** → **T2 Paquetes** → **T3 CLI** → **T4 Configuración**.",
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
        "`import pkg.mod` y `from pkg.mod import name` cargan el módulo una vez en `sys.modules`. **`__name__`** es el nombre del módulo, o `'__main__'` si se ejecuta como script.",
        "`if __name__ == '__main__':` protege el CLI/demo para que no corra al importar. **`__all__`** documenta la API pública de `from mod import *` (y comunica intención).",
        "Los **imports circulares** se rompen extrayendo un tercer módulo, importando dentro de funciones (lazy) o invirtiendo dependencias. Prefiere diseño a hacks.",
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
        "Prefijo `_` marca helpers **privados** (convención). La fachada (`__init__.py` o `api.py`) reexporta solo lo estable.",
        "Una **API pública pequeña** (p. ej. 4 símbolos) reduce breaking changes. Versiona la intención: añadir es minor; renombrar/eliminar es major.",
        "Lazy import dentro de funciones evita ciclos y acelera el import del paquete cuando un submódulo es pesado.",
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
        "Layout **src/**: `src/familiarity_core/...` evita importar el paquete desde el repo sin instalar. `pyproject.toml` declara name, version, requires-python y el build backend (setuptools/hatchling).",
        "`pip install -e .` instala en editable: cambias código y el import refleja al toque. Ideal en desarrollo del CLI.",
        "Si ves `ModuleNotFoundError` post-install, revisa nombre del paquete, packages discovery y el cwd.",
      ],
      code: {
        language: 'python',
        title: "pyproject_min.py",
        code: `# fragmento conceptual de pyproject (como dict)
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
print("layout", "src/familiarity_core/__init__.py")`,
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
        "**SemVer** simple: MAJOR.MINOR.PATCH. Breaking → major; feature compatible → minor; fix → patch. En 0.x es más flexible, pero documenta igual.",
        "`requires-python` y dependencies pinadas con criterio (mínimos, no caos de upper bounds sin razón).",
        "Un **CHANGELOG** stub (Added/Changed/Fixed) evita amnesia entre sprints. Breaking de firma pública se anuncia.",
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
        "`argparse.ArgumentParser` + **subparsers** modelan `ingest|normalize|compare|report`. Cada subcomando tiene flags propios.",
        "Exit codes: **0** éxito, **2** uso/CLI inválido (argparse default), **1** error de runtime/negocio. Scripts y CI dependen de esto.",
        "Separa el parse de args de la lógica: `main(argv) -> int` retorna el código; el entrypoint hace `sys.exit(main())`.",
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
        "**stdout** = datos (JSON, CSV). **stderr** = logs y progreso. Así `cmd > out.json` no contamina el archivo.",
        "Soportar path o **`-`** para stdin habilita pipes: `cat data.json | familiarity normalize`.",
        "No mezcles `print` de debug en stdout. Progress bars y logs van a stderr.",
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
        "Precedencia canónica: **flags CLI > variables de entorno > archivo de config > defaults**.",
        "Documenta la tabla en README. Un flag `--log-level` debe ganar a `FAMILIARITY_LOG_LEVEL`.",
        "Implementa un `merge_config` puro y testeable: dicts por capa, reduce de menor a mayor prioridad.",
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
        "Secretos **fuera del repo**: `.env` en `.gitignore`, nunca en logs. Defaults seguros (TLS on, log level INFO, no debug PII).",
        "`validate_config()` al arranque con errores claros (qué clave falta, qué subcomando la exige).",
        "Fail-fast de config evita procesar 10k filas con un path mal tipeado.",
      ],
      code: {
        language: 'python',
        title: "validate_config.py",
        code: `def validate_config(cfg: dict, command: str) -> None:
    required_always = ["log_level"]
    for k in required_always:
        if not cfg.get(k):
            raise RuntimeError(f"config: falta {k}")
    if command in {"ingest", "report"} and not cfg.get("api_token"):
        raise RuntimeError(f"config: api_token requerido para {command}")

validate_config({"log_level": "INFO"}, "normalize")
print("normalize ok sin token")
try:
    validate_config({"log_level": "INFO"}, "ingest")
except RuntimeError as e:
    print(e)`,
        output: `normalize ok sin token
config: api_token requerido para ingest`,
      },
      callout: {
        type: "danger",
        title: "Secretos",
        content:
          "Si el token aparece en un traceback de DEBUG, ya se filtró. Redacta.",
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
          code: `from pathlib import PurePosixPath

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
print("editable_install", f"pip install -e .  # {meta}")`,
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
        description: "Abort si falta API_TOKEN solo cuando el subcomando lo requiere.",
        code: {
          language: 'python',
          title: "token_validate.py",
          code: `def need_token(command: str) -> bool:
    return command in {"ingest", "report"}

def validate(command: str, cfg: dict) -> None:
    if need_token(command) and not cfg.get("API_TOKEN"):
        raise SystemExit(f"config: API_TOKEN requerido para {command}")

validate("normalize", {})
print("normalize ok")
try:
    validate("ingest", {})
except SystemExit as e:
    print("abort", e)
validate("ingest", {"API_TOKEN": "secret-demo"})
print("ingest ok")`,
          output: `normalize ok
abort config: API_TOKEN requerido para ingest
ingest ok`,
        },
        why: "Validación temprana y contextual al subcomando.",
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
          "Crea un módulo lógico con función pública `clean` y `__all__ = ['clean']`.",
        hint: "Helper privado con _ no va en __all__.",
        hints: [
          "Helper privado con _ no va en __all__.",
          "Imprime __all__ y clean('  X ').",
        ],
        edgeCases: ["import * no es recomendado; __all__ documenta intención"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "public_module.py",
          code: `# TODO: clean + __all__`,
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
          "Simula un import circular y arréglalo extrayendo un util compartido.",
        hint: "a importa b y b importa a → rompe; mueve la función común a util.",
        hints: [
          "a importa b y b importa a → rompe; mueve la función común a util.",
          "Imprime ok desde ambos lados.",
        ],
        edgeCases: ["Lazy import dentro de función es plan B"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "fix_circular.py",
          code: `# circular roto conceptualmente:
# a.f -> b.g -> a.f
# TODO: versión sana con util`,
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
          "Elige import absoluto vs relativo en layout src: imprime la recomendación para 3 casos.",
        hint: "Dentro del paquete: relativo OK; plugins externos: absoluto; scripts: -m.",
        hints: [
          "Dentro del paquete: relativo OK; plugins externos: absoluto; scripts: -m.",
          "Formato caso -> recomendación.",
        ],
        edgeCases: ["Evita manipular sys.path a mano en prod"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "import_style.py",
          code: `casos = [
    "normalize.py importa compare en el mismo paquete",
    "plugin externo usa familiarity_core",
    "ejecutar el CLI del paquete",
]
# TODO`,
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
          "Marca helpers privados con _ y deja públicas solo `normalize` y `compare`.",
        hint: "Imprime lista public vs private detectada por nombre.",
        hints: [
          "Imprime lista public vs private detectada por nombre.",
          "Usa dir() filtrado o una lista explícita.",
        ],
        edgeCases: ["Un solo _ es convención, no enforcement del runtime"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "mark_private.py",
          code: `def tokenize(s):
    return s.split()

def normalize(s):
    return " ".join(tokenize(s)).lower()

def compare(a, b):
    return normalize(a) == normalize(b)

# TODO: renombrar y reportar`,
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
          "Implementa una fachada que reexporta normalize y compare e imprime __all__.",
        hint: "Las implementaciones pueden ser locales.",
        hints: [
          "Las implementaciones pueden ser locales.",
          "from-style reexport simulado.",
        ],
        edgeCases: ["No reexportes _tokenize"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "facade.py",
          code: `# TODO facade`,
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
          "Documenta un breaking change de firma pública: old → new y versión major.",
        hint: "Imprime BREAKING y NEW_VERSION.",
        hints: [
          "Imprime BREAKING y NEW_VERSION.",
          "Ejemplo: compare(a,b)->bool se vuelve compare(a,b)->float score.",
        ],
        edgeCases: ["Añadir argumento opcional con default puede ser minor"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "breaking_change.py",
          code: `# TODO`,
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
          "Completa un dict estilo pyproject con name y version e imprímelos.",
        hint: "name=familiarity-core version=0.1.0",
        hints: [
          "name=familiarity-core version=0.1.0",
          "Incluye requires-python >=3.11.",
        ],
        edgeCases: ["El nombre de distribución puede usar guiones; el import usa guion bajo"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "pyproject_fields.py",
          code: `project = {
    # TODO
}
print(project)`,
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
          "Lista el layout src mínimo de un paquete importable e imprime cada path.",
        hint: "Incluye __init__.py, normalize.py, cli.py, pyproject.toml.",
        hints: [
          "Incluye __init__.py, normalize.py, cli.py, pyproject.toml.",
          "Usa prefijo src/familiarity_core/.",
        ],
        edgeCases: ["tests/ fuera de src"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "layout_list.py",
          code: `# TODO paths`,
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
          "Diagnostica ModuleNotFoundError: imprime 3 causas probables post-install.",
        hint: "Piensa en nombre, editable, y cwd.",
        hints: [
          "Piensa en nombre, editable, y cwd.",
          "Formato cause: ...",
        ],
        edgeCases: ["venv incorrecto es causa clásica"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "diagnose_mnf.py",
          code: `# TODO`,
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
          "Clasifica 4 cambios en major/minor/patch.",
        hint: "Breaking → major; feature → minor; fix → patch.",
        hints: [
          "Breaking → major; feature → minor; fix → patch.",
          "Imprime cambio: nivel.",
        ],
        edgeCases: ["Deprecar primero reduce dolor del major"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "semver_classify.py",
          code: `cambios = [
    "renombrar normalize a clean_name (API pública)",
    "añadir flag --format a report",
    "corregir typo en help",
    "eliminar subcomando compare",
]
# TODO`,
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
          "Fija dependencies mínimas del paquete (puede ser lista vacía + note) e imprime requires-python.",
        hint: "Para N1 stdlib: dependencies=[].",
        hints: [
          "Para N1 stdlib: dependencies=[].",
          "requires-python>=3.11.",
        ],
        edgeCases: ["pytest como optional dev, no runtime"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "deps_pin.py",
          code: `# TODO`,
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
          "Escribe una política de compatibilidad hacia S11 dominio (3 bullets).",
        hint: "Cubrir renames de entidades y versiones.",
        hints: [
          "Cubrir renames de entidades y versiones.",
          "Imprime POLICY líneas.",
        ],
        edgeCases: ["Frozen entities pueden forzar major si cambia equality"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "compat_policy.py",
          code: `# TODO`,
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
          "Añade subcomando report con --format text|json y parsea un argv de ejemplo.",
        hint: "Usa argparse subparsers.",
        hints: [
          "Usa argparse subparsers.",
          "Imprime el namespace.",
        ],
        edgeCases: ["required=True en subparsers (py3.7+)"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "report_subcmd.py",
          code: `import argparse
# TODO`,
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
          "Mapea situaciones a exit codes 0/1/2 e imprime `caso: code`.",
        hint: "0 éxito, 1 runtime, 2 usage.",
        hints: [
          "0 éxito, 1 runtime, 2 usage.",
          "Cinco casos.",
        ],
        edgeCases: ["argparse usa 2 por defecto en errores de parseo"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exit_codes.py",
          code: `casos = [
    "normalize ok",
    "archivo de input no existe",
    "flag desconocido",
    "subcomando ausente",
    "validación de config falla al arrancar",
]
# TODO`,
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
          "Escribe 3 líneas de ayuda --help orientadas a operador no dev.",
        hint: "Evita jerga de frameworks.",
        hints: [
          "Evita jerga de frameworks.",
          "Imprime HELP: ...",
        ],
        edgeCases: ["Ejemplos concretos > descripciones abstractas"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "operator_help.py",
          code: `# TODO`,
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
          "Escribe resultado a stdout y un log a stderr (capturado con StringIO en la demo).",
        hint: "Función process(n) retorna n*2; log event=done.",
        hints: [
          "Función process(n) retorna n*2; log event=done.",
          "Imprime ambos streams.",
        ],
        edgeCases: ["En CLI real: print(..., file=sys.stderr)"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "stdout_stderr.py",
          code: `from io import StringIO
# TODO`,
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
          "Implementa `read_input(path_or_dash, stdin_text)` que lee path o '-' como stdin.",
        hint: "Si path=='-', usa stdin_text.",
        hints: [
          "Si path=='-', usa stdin_text.",
          "Prueba ambos modos.",
        ],
        edgeCases: ["En prod usa pathlib.Path.read_text o sys.stdin.read"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "stdin_or_path.py",
          code: `def read_input(path_or_dash, stdin_text="", file_text=None):
    # TODO
    ...

print(read_input("-", stdin_text="desde stdin"))
print(read_input("file.csv", file_text="desde file"))`,
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
          "Revisa un CLI que contamina stdout con prints de progreso y propón la salida limpia.",
        hint: "Imprime BAD y GOOD.",
        hints: [
          "Imprime BAD y GOOD.",
          "GOOD solo JSON final.",
        ],
        edgeCases: ["jq falla si hay basura alrededor del JSON"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "clean_stdout.py",
          code: `def bad_cli():
    print("empezando")
    print('{"ok": true}')
    print("fin")

# TODO good_cli`,
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
          "Imprime la tabla de precedencia de 4 capas (1=más baja … 4=más alta).",
        hint: "defaults < file < env < flags.",
        hints: [
          "defaults < file < env < flags.",
          "Formato rank:layer",
        ],
        edgeCases: ["Documenta si algún flag es global vs por subcomando"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "precedence_table.py",
          code: `# TODO`,
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
          "Implementa `merge(defaults, file_cfg, env_cfg, flags)` ignorando None en capas altas.",
        hint: "Prueba con log_level en todas las capas.",
        hints: [
          "Prueba con log_level en todas las capas.",
          "El flag debe ganar.",
        ],
        edgeCases: ["jobs queda 1 porque env manda None"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "merge_config.py",
          code: `def merge(defaults, file_cfg, env_cfg, flags):
    # TODO
    ...

print(merge(
    {"log_level": "INFO", "jobs": 1},
    {"log_level": "WARNING"},
    {"log_level": "DEBUG", "jobs": None},
    {"log_level": "ERROR"},
))`,
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
          "Caso conflictivo: env=DEBUG y flag=INFO — imprime el resultado esperado y por qué.",
        hint: "Una línea result= y una razón.",
        hints: [
          "Una línea result= y una razón.",
          "Español claro.",
        ],
        edgeCases: ["Si el flag no se pasó (None), gana env"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "conflict_case.py",
          code: `# TODO`,
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
          "Checklist de secretos en .gitignore: imprime 4 entradas típicas.",
        hint: "Incluye .env, *.pem, credentials.json, .venv opcional no es secreto pero sí local.",
        hints: [
          "Incluye .env, *.pem, credentials.json, .venv opcional no es secreto pero sí local.",
          "Formato ignore: ...",
        ],
        edgeCases: [".env.example SÍ se commitea sin secretos"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "gitignore_secrets.py",
          code: `# TODO`,
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
          "Implementa `validate_config(cfg)` que exige log_level y data_dir; errores claros.",
        hint: "Raise RuntimeError con nombre de clave.",
        hints: [
          "Raise RuntimeError con nombre de clave.",
          "Prueba ok y fail.",
        ],
        edgeCases: ["Mensajes con nombre de clave ayudan al operador"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "validate_cfg.py",
          code: `def validate_config(cfg: dict) -> None:
    # TODO
    ...

validate_config({"log_level": "INFO", "data_dir": "data"})
print("ok")
try:
    validate_config({"log_level": "INFO"})
except RuntimeError as e:
    print(e)`,
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
          "Dado un default inseguro (log_level=DEBUG y echo_sql=True), propone defaults seguros.",
        hint: "Imprime old → new por clave.",
        hints: [
          "Imprime old → new por clave.",
          "Sin secretos en defaults.",
        ],
        edgeCases: ["token default None + validate al usar"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "secure_defaults.py",
          code: `inseguro = {"log_level": "DEBUG", "echo_sql": True, "api_token": "hardcoded"}
# TODO`,
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
    ],
    starterCode: `"""familiarity_core — packaging + CLI (CP-N1-B/C).
Este stub simula la estructura; en tu repo real usa src/ + pyproject.toml.
"""
from __future__ import annotations
import argparse
import sys
from typing import Optional

__all__ = ["normalize", "compare", "main"]

def normalize(text: str) -> str:
    return " ".join(text.split()).casefold()

def compare(a: str, b: str) -> float:
    return 1.0 if normalize(a) == normalize(b) else 0.0

def build_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(
        prog="familiarity",
        description="CLI de familiaridad (datos sintéticos).",
    )
    sub = p.add_subparsers(dest="cmd", required=True)
    sub.add_parser("ingest", help="ingerir archivos de entrada")
    n = sub.add_parser("normalize", help="normalizar texto")
    n.add_argument("text")
    c = sub.add_parser("compare", help="comparar dos textos")
    c.add_argument("a")
    c.add_argument("b")
    r = sub.add_parser("report", help="reporte simple")
    r.add_argument("--format", choices=["text", "json"], default="text")
    return p

def main(argv: Optional[list[str]] = None) -> int:
    ns = build_parser().parse_args(argv)
    if ns.cmd == "normalize":
        print(normalize(ns.text))
        return 0
    if ns.cmd == "compare":
        print(compare(ns.a, ns.b))
        return 0
    if ns.cmd == "report":
        print("{"status": "ok"}" if ns.format == "json" else "status=ok")
        return 0
    if ns.cmd == "ingest":
        print("ingest: ok", file=sys.stderr)
        return 0
    return 2

if __name__ == "__main__":
    raise SystemExit(main())`,
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
        options: [
          "Acelerar el interpreter",
          "Ejecutar el CLI/demo solo al correr el módulo, no al importar",
          "Definir __all__",
          "Instalar dependencias",
        ],
        correctIndex: 1,
        explanation:
          "Evita side-effects al importar el paquete.",
      },
      {
        question: "Precedencia correcta de config…",
        options: [
          "defaults > flags > env > file",
          "flags > env > file > defaults",
          "env > flags > file > defaults",
          "file > flags > env > defaults",
        ],
        correctIndex: 1,
        explanation:
          "Flags CLI ganan; defaults son la base.",
      },
      {
        question: "Exit code 2 en CLI argparse suele significar…",
        options: [
          "Éxito",
          "Error de uso/parseo de argumentos",
          "Timeout de red",
          "Fraude detectado",
        ],
        correctIndex: 1,
        explanation:
          "Convención: 2 usage; 1 runtime; 0 ok.",
      },
      {
        question: "¿Dónde van los logs de progreso?",
        options: [
          "stdout con el JSON",
          "stderr",
          "en el nombre del archivo",
          "en __all__",
        ],
        correctIndex: 1,
        explanation:
          "stderr deja stdout limpio para pipes.",
      },
      {
        question: "Añadir un subcomando nuevo compatible es tipicamente…",
        options: [
          "major",
          "minor",
          "borrar el repo",
          "patch obligatorio siempre",
        ],
        correctIndex: 1,
        explanation:
          "Feature compatible → minor en semver.",
      },
      {
        question: "¿Qué no debe ir al git del paquete?",
        options: [
          ".env con API_TOKEN",
          "README.md",
          "pyproject.toml",
          "src/.../__init__.py",
        ],
        correctIndex: 0,
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
        label: "PyPA sample project",
        url: "https://github.com/pypa/sampleproject",
        note: "Layout de referencia; adaptar a familiarity_core.",
      },
    ],
  },
}
