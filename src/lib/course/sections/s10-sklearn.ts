import type { CourseSection } from '../../types'

export const section10: CourseSection = {
  // Routing id intentionally stable for deep-link/progress compatibility; do not rename without a coordinated platform migration.
  id: "sklearn",
  index: 10,
  title: "Módulos, packaging y CLI profesional",
  shortTitle: "Módulos & CLI",
  tagline: "Paquete familiarity_core con CLI ingest/normalize/compare/report y config por precedencia",
  estimatedHours: 9,
  level: "Intermedio",
  phase: 0,
  icon: "Package",
  accentColor: "bg-gradient-to-br from-red-500 to-rose-600",
  jobRelevance:
    "Empaquetar un ETL en un CLI instalable es lo que separa un notebook suelto de una herramienta usable por el equipo. Aquí aprendes a convertir tu pipeline en un paquete propio: módulos limpios, un archivo pyproject.toml, subcomandos y configuración por precedencia (esto es, la opción de línea de comandos pisa a la del archivo y esta a la del entorno). El resultado es algo que un colega puede instalar con un comando y ejecutar sin leer tu código.",
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
            heading: "Cuando el código tiene que salir de tu laptop",
      paragraphs: [
        "Alguien del equipo necesita correr tu limpieza de datos el lunes a las siete. Le pasas la carpeta y empiezas a explicar: abre el notebook, ejecuta las celdas de arriba abajo pero salta la tercera, y antes cambia la ruta en la línea catorce. Eso no es una herramienta; es una instrucción oral que se degrada cada vez que se repite.",
        "Empaquetar es la diferencia entre prestar tus apuntes y publicar un manual. El archivo que hace posible ese salto es **`pyproject.toml`**: la ficha técnica del proyecto. Dice cómo se llama, qué versiones de qué bibliotecas necesita y —lo más útil— qué comando queda disponible en la terminal después de instalarlo. Ese último punto no lo hace el archivo por existir: hay que declararlo, en una tabla `[project.scripts]` que asocia el nombre del comando con la función que debe ejecutar. Con esa declaración, `pip install -e .` convierte una carpeta de scripts en algo que se invoca por su nombre; sin ella instala la biblioteca y no aparece ningún comando nuevo.",
        "Ese nombre invocable es la **CLI** (interfaz de línea de comandos): el programa se ejecuta escribiendo una palabra en la terminal, seguida de subcomandos y opciones. La ventaja no es estética. Un comando se puede escribir en la documentación, agendar para que corra solo de madrugada o encadenar con otro; una celda de notebook no.",
        "Queda un problema que aparece en cuanto el programa tiene usuarios: el mismo valor puede llegar por varios caminos. Un umbral puede venir del valor por defecto en el código, de un archivo de configuración, de una variable de entorno o de una bandera escrita en la terminal. Si no hay un orden fijo que decida quién gana, dos ejecuciones aparentemente idénticas dan resultados distintos y nadie sabe por qué. A ese orden fijo se le llama **precedencia**, y declararlo es la mitad del trabajo.",
        "La pregunta que atraviesa la sección la hace alguien que nunca vio este repositorio: **¿qué necesito saber para ejecutarlo bien la primera vez?** Si la respuesta cabe en `--help`, el empaquetado funcionó. Aquí el programa vive en tu máquina y usa solo la biblioteca estándar: publicar en un índice público, servir por HTTP o distribuir binarios son otros oficios y llegan más adelante.",
      ],
      callout: {
        type: "info",
        title: "CP-N1-B empaquetado / base CP-N1-C",
        content:
          "Gate: CLI ingest|normalize|compare|report; install editable; ayuda útil; lógica separada de I/O.",
      },
     },
     {
      heading: "Contrato de la sección (referencia)",
      optional: true,
      paragraphs: [
        "Bloque de referencia. Orden de los subtemas, alcance y criterio de cierre.",
        "**Orden de los subtemas.** T1 trata los módulos: imports estables y separación entre lógica y entrada/salida. T2 pasa a los paquetes y a la metadata de instalación. T3 construye la CLI con subcomandos y códigos de salida. T4 cierra con la configuración por precedencia.",
        "**Qué integra.** El ETL de CP-N1-B que quedó en S08 y la observabilidad de S09: registros sin datos personales y códigos de salida 0, 1 y 2 según el tipo de fallo.",
        "**Criterio de cierre.** Un paquete instalable en modo editable, con los subcomandos `ingest`, `normalize`, `compare` y `report`, una ayuda que sirva sin leer el código, y la lógica separada de la entrada/salida.",
        "**Límites.** Datos sintéticos únicamente. Si la configuración o el schema no cuadran al arrancar, el programa se detiene antes de procesar nada; nunca datos personales reales ni afirmaciones automáticas de fraude.",
      ],
     },
     {
      heading: "Imports, namespaces y __main__",
      subtopicId: "S10-T1-A",
      paragraphs: [
        "`import pkg.mod` y `from pkg.mod import name` cargan el módulo **una vez** en `sys.modules` (un diccionario interno que Python mantiene con todo lo ya importado). **`__name__`** es una variable especial que contiene el nombre del módulo, o el string `'__main__'` cuando el archivo se ejecuta directamente como script. Ejecutar `python -m familiarity_core` corre el paquete sin pelear con `sys.path` (la lista interna que decide de qué carpetas importar). Para que funcione, el paquete necesita un archivo `__main__.py`: eso es lo que `-m` busca y ejecuta. Si falta, Python responde `No module named familiarity_core.__main__` — un error que se lee como si el paquete no existiera y en realidad dice que le falta esa puerta de entrada.",
        "`if __name__ == '__main__':` protege el CLI/demo para que **no** corra al importar. **`__all__`** documenta la API pública — la lista corta de nombres que el equipo puede importar con confianza — y comunica intención. Si el schema de config no cuadra al arranque, aborta (fail-closed) en vez de procesar a ciegas.",
        "Los **imports circulares** (módulo A importa a B y B importa a A: Python se enreda) se rompen extrayendo un tercer módulo compartido, usando *lazy import* — que es postergar el `import` hasta dentro de una función, cuando ya hace falta — o invirtiendo la dirección de dependencias. **Prefiere diseño a hacks**: si A y B se necesitan mutuamente, el util común es el primer recurso. Evita `import` dentro de cada método, salvo como último recurso documentado.",
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
      figure: {
        id: "S10-package-layout",
        caption:
          "Sin src, ejecutar desde la raíz importa la carpeta local y no el paquete instalado; el fallo aparece solo en otra máquina.",
        alt:
          "Tres capas apiladas: el paquete en src, el pyproject.toml y la instalación editable.",
      },
      subtopicId: "S10-T1-B",
      paragraphs: [
        "El prefijo `_` marca helpers **privados** (es una convención: el guion bajo le dice al lector «esto es detalle interno, no lo importes de afuera»). La fachada — el archivo `__init__.py` o `api.py` que el equipo ve como entrada al paquete — reexporta solo lo **estable**. Si un usuario importa `_strip`, mañana no puedes renombrarlo sin romperle el código.",
        "Una **API pública pequeña** (p. ej. 4 símbolos: normalize, compare, report…) reduce breaking changes. SemVer — *Semantic Versioning*, un esquema de versiones de tres números — en simple: **añadir** es minor; **renombrar/eliminar** es major. Fail-closed en contratos rotos.",
        "El *lazy import* dentro de funciones evita ciclos y acelera el arranque del paquete cuando un submódulo es pesado (p. ej. un parser opcional). Úsalo con intención: la API pública sigue declarada en `__all__`, pero el módulo pesado se carga solo al primer uso.",
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
      figure: {
        id: "S10-config-precedence",
        caption:
          "Cada capa pisa a la anterior. Documenta el orden o nadie sabrá por qué su valor no se aplicó.",
        alt:
          "Cuatro etapas en fila —default, archivo, entorno, flag— unidas por flechas.",
      },
      subtopicId: "S10-T2-A",
      paragraphs: [
        "Layout **src/**: poner el código bajo `src/familiarity_core/...` evita que Python importe el paquete desde el repo **sin** instalarlo primero. El archivo `pyproject.toml` declara name, version, requires-python y el build backend — el programa que construye el paquete instalable, p. ej. setuptools o hatchling.",
        "`pip install -e .` instala en **editable** (modo edición): cambias código y el import refleja el cambio al toque, sin reinstalar. Ideal en desarrollo del CLI del gate CP-N1-B/C. Si falta metadata clave (`name`, `version`), el instalador aborta (fail-closed).",
        "Si ves `ModuleNotFoundError` tras instalar, revisa en este orden: (1) ¿`pip install -e .` se ejecutó en el venv activo (el entorno virtual aislado donde instalas paquetes)?; (2) ¿el nombre de import coincide con la carpeta bajo `src/`?; (3) ¿un script homónimo en el cwd — la carpeta actual donde corre Python — tapa el paquete en `sys.path`?",
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
        title: "Biblioteca estándar primero",
        content:
          "En N1 el paquete puede no depender de terceros; declara deps solo cuando existan.",
      },
    },
    {
      heading: "Versionado y compatibilidad",
      subtopicId: "S10-T2-B",
      paragraphs: [
        "**SemVer** — *Semantic Versioning*, un esquema de tres números — en simple: MAJOR.MINOR.PATCH. Un cambio *breaking* (incompatible para quien ya usa el paquete) sube el MAJOR; una *feature* compatible sube el MINOR; un *fix* sin cambio de contrato sube el PATCH. En 0.x es más flexible, pero **documenta igual**. Renombrar la API pública de normalizers es *major* para los consumidores del paquete.",
        "`requires-python` y dependencies pinadas con criterio (mínimos, no caos de upper bounds sin razón). Si falta metadata en pyproject, aborta (fail-closed).",
        "Un **CHANGELOG** real — un archivo donde anotas qué cambió en cada versión — aunque sea breve (Added/Changed/Fixed), evita amnesia entre sprints. Un breaking de firma pública se **anuncia** con versión major y nota de migración; deprecar un símbolo un minor antes reduce el dolor del major.",
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
        "`argparse.ArgumentParser` + **subparsers** — sub-analizadores que modelan cada subcomando del CLI, p. ej. `ingest|normalize|compare|report` — modelan las acciones del paquete. Cada subcomando tiene flags propios (opciones como `--field`) y `help=` en español claro para operadores.",
        "Exit codes — códigos numéricos que devuelve el proceso al terminar: **0** = éxito; **2** = uso/CLI inválido (default de argparse); **1** = error de runtime/negocio. Los scripts y el CI — *Continuous Integration*, el sistema que ejecuta pruebas automáticamente — **dependen** de esto: no devuelvas siempre 0.",
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
        "**stdout** — *standard output*, la salida estándar donde van los datos (JSON, CSV). **stderr** — *standard error*, la salida de error donde van logs y progreso. Así `cmd > out.json` **no** contamina el archivo. Un `print('ok')` extra en stdout rompe el *pipe* — la cadena de comandos conectados con `|` — de quien parsea JSON.",
        "Soportar path o **`-`** para stdin — *standard input*, la entrada estándar — habilita pipes: `cat data.json | familiarity normalize`. Si el schema de entrada no cuadra, aborta (fail-closed).",
        "Soporta **`-`** como path de entrada para pipes (`cat data.json | familiarity normalize -`). En el lab, si capturas stderr a un `StringIO` (un objeto que simula un archivo en memoria), no uses `print` para el progreso: escribe en el stream. En CLI real: `print(..., file=sys.stderr)`.",
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
        "Precedencia canónica: **flags CLI > variables de entorno > archivo de config > defaults**. Es decir, si el operador pasa `--log-level ERROR` en la terminal, ese gana; si no, se mira la variable de entorno; luego el archivo de config; y al final los defaults internos del paquete. Documenta la tabla en README — sin sorpresas en ops.",
        "Un flag `--log-level` debe ganar a la variable `FAMILIARITY_LOG_LEVEL`. Trata `None` en los flags como «no pasado», para no pisar *env* — *environment*, las variables de entorno — con *nulls*.",
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
        title: "None vs. missing",
        content:
          "Trata None en flags como «no pasado» para no pisar env con nulls.",
      },
    },
    {
      heading: "Secretos, defaults y validación temprana",
      subtopicId: "S10-T4-B",
      paragraphs: [
        "Secretos **fuera del repo**: `.env` (el archivo de variables de entorno) va en `.gitignore` (la lista de archivos que git ignora), **nunca** en logs (S09). El ETL local de este nivel **no inventa un token de API**. Defaults seguros (log level INFO, no debug con PII — *Personally Identifiable Information*, datos personales identificables).",
        "`validate_config()` al arranque reporta qué clave falta y qué subcomando la exige: `input_path` para ingest y `manifest_path` para report. Fail-closed — no proceses a ciegas.",
        "Fail-fast de config evita procesar 10k filas con un path mal tipeado. Mensaje de error: nombra la **clave** y el **subcomando** (`config: falta input_path para ingest`); jamás imprimas el valor de un token en el *traceback* — el volcado de errores que Python muestra — aunque el adaptador remoto lo tenga en memoria.",
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
    intro: "Ocho demos I Do (una por subtema, en orden T1→T4). Cada demo te muestra el mecanismo que luego practicarás en We Do: módulos y API, layout/src + SemVer, argparse con exit codes, stdio limpio y config por precedencia. Solo stdlib — la biblioteca estándar de Python — y datos sintéticos. Antes de mirar la salida del panel, predice mentalmente lo que va a imprimir cada demo: esa predicción es lo que consolida el aprendizaje.",
    steps: [
      {
        demoId: "S10-T1-A-DEMO",
        subtopicId: "S10-T1-A",
        environment: "local-python",
        description: "Separar `normalize` del entrypoint `main` (sin *side-effects* al importar)",
        preamble:
          "Antes de empaquetar el CLI de **familiarity_core**, la lógica de normalizar nombres debe vivir en una función pura (que solo devuelve un valor, sin efectos afuera) y el *entrypoint* — la función que arranca el CLI — solo orquesta. En esta demo (datos sintéticos, sin PII) observa tres cosas sin escribir aún: (1) `__all__` declara solo `normalize`; (2) `main` imprime el nombre limpio y devuelve `0`; (3) al «importar» se puede llamar `normalize` con un `assert`, y el CLI se invoca **explícito** vía `main([...])`. Predice la salida de `\"  José Pérez \"` y compárala con el panel.",
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
        why: "La lógica vive en `normalize`; el *entrypoint* solo orquesta. La guarda de entrada (aquí simulada con llamada explícita a `main`) evita que un `import familiarity_core` ejecute el CLI. En el paquete real usa `if __name__ == \"__main__\"` o un archivo `__main__.py` para el mismo contrato: API usable sin *side-effects* (efectos colaterales al importar).",
        retrospective:
          "Si puedes explicar por qué `normalize` debe ser usable sin imprimir nada al importar, ya internalizaste el contrato de módulo. El error clásico es meter `print` o `parse_args` a nivel de módulo. En We Do T1-A practicarás API pública, util compartido anti-ciclo y estilos de import.",
      },
      {
        demoId: "S10-T1-B-DEMO",
        subtopicId: "S10-T1-B",
        environment: "local-python",
        description: "Fachada que exporta solo 4 símbolos públicos.",
        preamble:
          "La fachada — el archivo `__init__.py` que el equipo ve como entrada al paquete — de **familiarity_core** debe ser pequeña y estable: el equipo importa pocos nombres y el resto es detalle. En la demo, sigue el código sin reescribirlo: (1) `_private_token` no aparece en `__all__`; (2) `normalize` / `compare` / `ingest_row` / `report` sí; (3) `compare(\"Ana\", \" ana \")` devuelve `1.0` porque normaliza ambos lados. Datos sintéticos. Predice `exports` y el último `1` del `report` antes de mirar la salida.",
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
        why: "Cuatro símbolos estables reducen breaking changes: renombrar un público es major; el `_` es convención de privacidad, no enforcement del runtime. Helpers como `_private_token` quedan fuera de `__all__` para que el equipo no dependa de ellos.",
        retrospective:
          "Si el consumidor solo conoce la fachada, puedes refactorizar `_private_token` sin romper pipelines. El error clásico es «exportar todo por comodidad». Pregunta de auto-chequeo: ¿cuántos símbolos de tu `__all__` defenderías en un major? We Do: filtrar públicos, armar `__all__` y documentar un breaking de firma.",
      },
      {
        demoId: "S10-T2-A-DEMO",
        subtopicId: "S10-T2-A",
        environment: "local-python",
        description: "Layout src + claves del pyproject mínimo que harán `pip install -e .` usable.",
        preamble:
          "El gate de **CP-N1-B** pide un paquete instalable, no un script suelto en la carpeta del curso. Observa el layout sintético: código bajo `src/familiarity_core/`, metadata en `pyproject.toml`, y el comando `pip install -e .`. Predice el orden de paths y el dict `pyproject.project` antes de leer la salida. No escribas aún; fija mentalmente name, version y requires-python. Esta demo lista el *contrato de layout* (simulación), no un install real en el playground.",
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
        why: "El layout src evita que Python importe el árbol del repo por cwd sin instalar. Editable refleja cambios al toque en desarrollo del CLI. name, version y requires-python son el contrato mínimo de packaging del gate.",
        retrospective:
          "Si el import y la carpeta no coinciden, o no instalaste editable, aparece `ModuleNotFoundError`. Esta demo lista el contrato; el install real vive en el You Do. Pregunta: ¿por qué `familiarity-core` (guion) no es el mismo string que `import familiarity_core`? We Do: normalizar metadata, listar el layout y diagnosticar por hechos.",
      },
      {
        demoId: "S10-T2-B-DEMO",
        subtopicId: "S10-T2-B",
        environment: "local-python",
        description: "Bump 0.1.0 → 0.2.0 por subcomando nuevo (minor).",
        preamble:
          "Antes de publicar `familiarity-core`, cada cambio de API o CLI debe subir la versión con criterio. Observa la demo: la descripción «add subcomando report» se clasifica como **minor** y el bump de `0.1.0` produce `0.2.0`. No reescribas el código; verifica mentalmente que un «rename api» iría a major y un typo a patch.",
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
        why: "Una *feature* compatible sube minor; un breaking de API pública sube major; un fix de help sube patch. La aritmética del bump no sirve sin nota: anota el cambio en el CHANGELOG (aunque sea una línea Added/Changed) para que el consumidor sepa *qué* subió de `0.1.0` a `0.2.0`.",
        retrospective:
          "Si clasificas mal un rename como patch, rompes a consumidores sin aviso. El error clásico es bumpear solo el string de versión y olvidar la nota de migración. We Do: clasificar en español, separar deps runtime/dev y políticas hacia entidades de S11.",
      },
      {
        demoId: "S10-T3-A-DEMO",
        subtopicId: "S10-T3-A",
        environment: "local-python",
        description: "CLI con subcomandos ingest|normalize|compare|report y exit codes.",
        preamble:
          "El CLI del gate expone `ingest|normalize|compare|report` y debe ser operable desde scripts y CI. Observa sin escribir: (1) subparsers con `dest=\"cmd\"` y `required=True`; (2) `report` acepta `--format`; (3) un argv vacío no «cae en 0», devuelve **2**. Predice las líneas `code 0` / `bad_argv 2` y compáralas con la salida.",
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
        why: "Separar `main(argv) -> int` del `sys.exit` permite testear sin spawn de proceso. Códigos: 0 éxito, 1 runtime, 2 uso. Los subparsers con `required=True` hacen que un argv vacío sea usage error, no un cmd silencioso.",
        retrospective:
          "Si siempre devuelves 0, el CI no detecta usage roto. Separar `main(argv) -> int` del `sys.exit` es lo que permite unit-testear sin spawn. Pregunta: ¿por qué un argv vacío debe ser 2 y no 1? We Do: armar subcomando report, mapear 0/1/2 y escribir ayuda alineada.",
      },
      {
        demoId: "S10-T3-B-DEMO",
        subtopicId: "S10-T3-B",
        environment: "local-python",
        description: "Datos a stdout y diagnóstico a stderr (simula pipe normalize).",
        preamble:
          "Cuando un operador hace `… | jq`, solo deben fluir datos por stdout. Observa la demo: `normalize_cmd` escribe eventos de stage en un stream de error y devuelve el JSON limpio; el `print` de datos y el bloque `--- stderr ---` se separan a propósito. Datos sintéticos `{\"name\": \"Ana\"}`. No escribas aún; predice si «stage=» aparece antes o después del JSON.",
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
        why: "Logs en stderr permiten redirigir `2> log.txt` sin ensuciar el archivo de datos. En CLI real usa `print(..., file=sys.stderr)`. El pipe de datos queda limpio para `jq` u otro subcomando: no se trata de «loguear menos», sino de **otro canal**.",
        retrospective:
          "Si el log va a stdout, el consumidor del pipe parsea basura. We Do: escribir en err, elegir stdin vs path, y contrastar BAD vs GOOD CLI.",
      },
      {
        demoId: "S10-T4-A-DEMO",
        subtopicId: "S10-T4-A",
        environment: "local-python",
        description: "`FAMILIARITY_LOG_LEVEL` vs. `--log-level`: gana el flag.",
        preamble:
          "En ops del CLI, un flag de línea de comando debe poder forzar el nivel de log aunque el entorno diga otra cosa. Observa `resolve_log_level`: sin flag gana env; con flag gana el flag; sin nada, INFO. Predice las tres líneas de salida. No hay archivo de config en esta demo — solo el núcleo de la precedencia.",
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
        why: "Orden canónico completo: flags > env > file > defaults. Un flag ausente (`None`) no debe pisar env (lo practicarás en We Do). Precedencia documentada y testeable evita «en mi máquina es DEBUG».",
        retrospective:
          "Flag ausente (`None`) no es lo mismo que flag `\"INFO\"`: si tratas ambos igual, pisas el env sin querer. Pregunta de auto-chequeo: en la demo, ¿quién gana con env=DEBUG y sin flag? We Do: traza de capas, merge multi-clave y razón del ganador.",
      },
      {
        demoId: "S10-T4-B-DEMO",
        subtopicId: "S10-T4-B",
        environment: "local-python",
        description: "Abort con mensaje exacto si falta el path requerido por el subcomando local.",
        preamble:
          "Fail-closed al arranque: no todos los subcomandos necesitan las mismas claves de config. Observa `validate`: `normalize` pasa vacío; `ingest` aborta con mensaje exacto si falta `input_path`; con el path sintético, `ingest ok`. Predice el texto `abort config: falta …` antes de mirar la salida. Sin secretos ni PII real.",
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
        why: "Validar al arranque con mensaje accionable evita fallos a mitad de un batch. Fail-closed y contextual: solo lo que el comando necesita. No exijas tokens de APIs remotas en un ETL local.",
        retrospective:
          "El error clásico es un validador global que exige `input_path` también a `normalize` o, al revés, no validar y fallar a mitad del batch. Pregunta: ¿por qué el mensaje debe nombrar la clave y el comando? We Do: qué va a `.gitignore`, validar claves y endurecer defaults inseguros.",
      },
    ],
  },
  weDo: {
    intro: "Andamiaje: **E1 guiado → E2 independiente → E3 transferencia** × 8 subtemas (24 ejercicios, con 2 *hints* cada uno). Usa solo la biblioteca estándar y lo aprendido hasta S10. Cada starter trae un bug marcado con el comentario `# DEFECT:` al inicio de la línea defectuosa; corrígelo y verifica con la salida esperada. Elimina las líneas extra (p. ej. `print('ok', True)`); la salida debe coincidir exactamente con el contrato.",
    steps: [
      {
        id: "S10-T1-A-E1",
        subtopicId: "S10-T1-A",
        kind: "guided",
        title: "API pública `clean` sin exportar `_ws`",
        preamble:
          "- **Contexto:** en `familiarity_core` el módulo de normalización debe ofrecer un símbolo estable y esconder helpers.\n- **Meta:** hacer privado el colapso de espacios y exportar solo `clean` con casefold.\n- **Éxito:** imprimes `['clean']` y luego `x` (de `clean('  X ')`).\n- **Límites:** no pongas `_ws` en `__all__`; no dejes `print('ok', True)`; solo stdlib.",
        instruction:
          "1. Abre el starter: `# DEFECT` marca `_ws` incompleto y `__all__` incorrecto.\n2. Haz que `_ws` colapse espacios con `\" \".join(s.split())`.\n3. En `clean`, aplica casefold sobre el resultado de `_ws`.\n4. Deja `__all__ = [\"clean\"]`, imprime `__all__` y `clean(\"  X \")`, quita la línea extra `ok`.",
        hint: "Helper privado con _ no va en __all__.",
        hints: [
          "Helper privado con _ no va en __all__.",
          "Imprime __all__ y clean('  X ').",
        ],
        edgeCases: ["import * no es recomendado; __all__ documenta intención."],
        tests: "Contrato ejecutable: corre exactamente los casos visibles del starter; exit 0 y sin traceback; stdout conserva el orden, etiquetas y valores exigidos por la instrucción, sin líneas extra.",
        feedback:
          "`__all__` documenta la API que el equipo puede importar con confianza. Un helper `_ws` es detalle interno: si lo exportas, mañana no puedes renombrarlo. `strip` no colapsa espacios internos; en cambio `split` + `join` sí lo hace. Y `casefold` unifica mayúsculas de forma más robusta que `lower` en textos con acentos.",
        retrospective:
          "Público = contrato; `_` = convención de «no toques esto». Exportar el helper no te hace más transparente: te ata la mano en el próximo rename. Pregunta: ¿qué rompería si un colega hace `from mod import _ws`? Siguiente (E2): util compartido para romper ciclos A↔B.",
        starterCode: {
          language: 'python',
          title: "public_module.py",
          code: `# DEFECT: _ws no colapsa; no exporta clean; quita print('ok', True)
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
        title: "Util compartido y sufijos `:a` / `:b`",
        preamble:
          "- **Contexto:** si `module_a` y `module_b` se necesitan mutuamente, el import circular rompe el paquete al arrancar.\n- **Meta:** concentrar la normalización en `util_norm` y dejar que A/B solo orquesten.\n- **Éxito:** tres líneas `hola:a`, `hola:b`, `ok`.\n- **Límites:** no crees dependencia A↔B; no dejes el casefold fuera del util; quita `print('ok', True)` y usa `print(\"ok\")` final.",
        instruction:
          "1. Corrige `util_norm` para strip + casefold.\n2. Asigna el sufijo correcto: A → `:a`, B → `:b`.\n3. Imprime ambos procesos y un `ok` final de contrato.\n4. No hardcodees el texto «hola» fuera de la función.",
        hint: "La lógica compartida vive en util_norm; A y B solo orquestan.",
        hints: [
          "La lógica compartida vive en util_norm; A y B solo orquestan (evita dependencia A↔B).",
          "module_a debe terminar en :a y module_b en :b; casefold en util_norm.",
        ],
        edgeCases: ["Lazy import dentro de función es plan B si el util compartido no basta."],
        tests: "Contrato ejecutable: corre exactamente los casos visibles del starter; exit 0 y sin traceback; stdout conserva el orden, etiquetas y valores exigidos por la instrucción, sin líneas extra.",
        feedback:
          "Si sale `hola:b` primero u `Hola` sin casefold, los sufijos siguen invertidos o `util_norm` no normaliza del todo. El util compartido es el primer recurso anti-ciclo: A y B solo orquestan.",
        retrospective:
          "El util compartido es el primer recurso anti-ciclo; el lazy import es plan B. Si A y B solo llaman al util, el grafo de imports queda acíclico. Luego (E3) elegirás *cómo* importar según el rol (mismo paquete, plugin, CLI).",
        starterCode: {
          language: 'python',
          title: "shared_util_modules.py",
          code: `# DEFECT: util_norm no casefold; suffixes invertidos; quita print('ok', True)
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
        title: "Estilo de import según el rol",
        preamble:
          "- **Contexto:** el mismo paquete se consume distinto: módulo hermano, plugin externo o arranque del CLI.\n- **Meta:** recomendar el estilo de import despachando por `kind`, no por el texto del label.\n- **Éxito:** tres líneas exactas: `… -> relativo o absoluto del paquete (from . import compare)` / `… -> absoluto (import familiarity_core)` / `… -> python -m familiarity_core` (labels del starter intactos).\n- **Límites:** no uses `PYTHONPATH=.` ni manipules `sys.path`; kind desconocido debe fallar (fail-closed), no devolver un default genérico.",
        instruction:
          "1. Lee el starter: las ramas de `recommend_import_style` están invertidas/incompletas.\n2. Mapea `same_package`, `external_plugin` y `run_cli` a los strings del contrato.\n3. Imprime con `f\"{label} -> {…}\"` usando el kind del tuple.\n4. Quita el print extra `ok`.",
        hint: "Despacha por kind exacto (same_package / external_plugin / run_cli), no por substring del label.",
        hints: [
          "El label es solo para la UI del print; la decisión usa el kind del tuple.",
          "Formato: print(f'{label} -> {recommend_import_style(kind)}').",
        ],
        edgeCases: ["Evita manipular sys.path a mano en prod"],
        tests: "Contrato ejecutable: corre exactamente los casos visibles del starter; exit 0 y sin traceback; stdout conserva el orden, etiquetas y valores exigidos por la instrucción, sin líneas extra.",
        feedback:
          "Si `same_package` devuelve el estilo de plugin, el match por kind está invertido o caíste en el default genérico. Kind desconocido debe lanzar `ValueError` (fail-closed), no devolver `PYTHONPATH=.`.",
        retrospective:
          "El label es solo UI; la política se decide por un kind tipificado. `python -m familiarity_core` evita pelear con `sys.path`. En T1-B el foco pasa de *cómo importar* a *qué exportar* en la fachada.",
        starterCode: {
          language: 'python',
          title: "import_style.py",
          code: `# DEFECT: ramas invertidas / incompletas; quita print('ok', True)
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
        title: "Separar nombres públicos y privados",
        preamble:
          "- **Contexto:** al auditar un módulo de normalización, el operador de packaging lista qué es API y qué es helper.\n- **Meta:** filtrar por convención `_` y demostrar que `compare` sigue funcionando.\n- **Éxito:** `public ['normalize', 'compare']`, `private ['_tokenize']`, y `True`.\n- **Límites:** no reutilices la lista cruda como «public»; no mutes `names` si no hace falta.",
        instruction:
          "1. Revisa el starter: `public = names` exporta también `_tokenize`.\n2. Construye `public` y `private` con `startswith(\"_\")`.\n3. Imprime con las etiquetas `public` / `private` y luego `compare(\"A\", \"a\")`.\n4. Quita `print('ok', True)`.",
        hint: "Imprime lista public vs. private detectada por nombre.",
        hints: [
          "Imprime lista public vs. private detectada por nombre.",
          "Usa startswith('_') sobre la lista names del starter.",
        ],
        edgeCases: ["Un solo _ es convención, no enforcement del runtime."],
        tests: "Contrato ejecutable: corre exactamente los casos visibles del starter; exit 0 y sin traceback; stdout conserva el orden, etiquetas y valores exigidos por la instrucción, sin líneas extra.",
        feedback:
          "Si `public` incluye `_tokenize` o falta la línea `private`, filtra con `startswith('_')` y no reutilices la lista cruda. Imprime con las etiquetas `public` / `private` del contrato; el `True` final solo confirma que `compare` sigue vivo tras el filtro.",
        retrospective:
          "El prefijo `_` es promesa al equipo, no candado del intérprete. Filtrar la lista es el mismo criterio que pondrías en `__all__`. Pregunta: si alguien importa `_tokenize` hoy, ¿puedes renombrarlo mañana sin major? Siguiente: fachada real con casefold.",
        starterCode: {
          language: 'python',
          title: "mark_private.py",
          code: `# DEFECT: exporta _tokenize como público; quita print('ok', True)
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
        title: "Fachada `normalize` + `compare`",
        preamble:
          "- **Contexto:** el `__init__` o `api.py` del paquete reexporta solo lo estable del ETL de familiaridad.\n- **Meta:** implementar normalize (strip+casefold), compare vía normalize, y fijar `__all__`.\n- **Éxito:** `['normalize', 'compare']` y `True` para `compare(\"Z\", \" z \")`.\n- **Límites:** no reexportes helpers con `_`; no compares strings crudos.",
        instruction:
          "1. Completa `normalize` y `compare` del starter.\n2. Asigna `__all__` con los dos nombres públicos.\n3. Imprime `__all__` y el resultado de `compare(\"Z\", \" z \")`.\n4. Elimina líneas de debug.",
        hint: "Las implementaciones pueden ser locales.",
        hints: [
          "Las implementaciones pueden ser locales.",
          "compare debe normalizar ambos lados antes de comparar.",
        ],
        edgeCases: ["No reexportes helpers con _"],
        tests: "Contrato ejecutable: corre exactamente los casos visibles del starter; exit 0 y sin traceback; stdout conserva el orden, etiquetas y valores exigidos por la instrucción, sin líneas extra.",
        feedback:
          "Si `__all__` queda vacío o `compare('Z',' z ')` es False, exporta `normalize`/`compare` y normaliza **ambos** lados con strip+casefold antes de comparar. Comparar strings crudos hace que el «score» de familiaridad mienta con espacios y mayúsculas.",
        retrospective:
          "Compare debe pasar por la misma normalización que el resto del pipeline; si no, el «score» miente. Una fachada chica es el primer paso hacia SemVer sano. E3: documentar un breaking de tipo de retorno.",
        starterCode: {
          language: 'python',
          title: "facade.py",
          code: `# DEFECT: __all__ vacío; compare sin normalize; quita print('ok', True)
def normalize(s: str) -> str:
    return s.strip()

def compare(a: str, b: str) -> bool:
    return a == b

__all__ = []
print(__all__)
print(compare("Z", " z "))
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
        title: "Documentar breaking y major bump",
        preamble:
          "- **Contexto:** el equipo cambió `compare` de `bool` a `float` score; los consumidores con `is True` se rompen.\n- **Meta:** calcular major bump y escribir nota de migración legible.\n- **Éxito:** tres líneas BREAKING / NEW_VERSION / MIGRATION exactas del contrato.\n- **Límites:** no hardcodees `2.0.0` si puedes calcularlo; no uses patch para un cambio de firma pública.",
        instruction:
          "1. Corrige `major_bump` (MAJOR+1, MINOR/PATCH en 0).\n2. Completa el texto de migración del `document_breaking`.\n3. Verifica las tres líneas de salida.\n4. Quita prints extra.",
        hint: "major_bump('1.0.0') → '2.0.0'; no hardcodees 2.0.0 a mano si puedes calcularlo.",
        hints: [
          "major_bump: toma el MAJOR, suma 1, deja MINOR y PATCH en 0.",
          "document_breaking imprime las tres líneas con el formato del contrato.",
        ],
        edgeCases: ["Añadir argumento opcional con default puede ser minor (no este ejercicio)"],
        tests: "Contrato ejecutable: corre exactamente los casos visibles del starter; exit 0 y sin traceback; stdout conserva el orden, etiquetas y valores exigidos por la instrucción, sin líneas extra.",
        feedback:
          "Si NEW_VERSION queda en patch (1.0.1), el bump no trata el cambio de tipo de retorno como major. Cambiar el tipo de un símbolo público es breaking aunque el nombre no cambie.",
        retrospective:
          "Cambiar el tipo de retorno de un símbolo público es major aunque el nombre no cambie. La migración debe decir *qué hacer* (aquí: `compare(a,b) == 1.0`), no solo «breaking». Pregunta: ¿un default nuevo opcional sería major o minor? En T2-A empaquetas el layout que hace instalable esa API.",
        starterCode: {
          language: 'python',
          title: "breaking_change.py",
          code: `# breaking change notes
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
        title: "Normalizar metadata de pyproject",
        preamble:
          "- **Contexto:** un `pyproject` incompleto o con name viejo (`familiarity`) no es el contrato del paquete del curso.\n- **Meta:** normalizar name, version y requires-python para instalación editable.\n- **Éxito:** un dict impreso con name `familiarity-core`, version `0.1.0`, requires-python `>=3.11`.\n- **Límites:** no devuelvas el partial crudo; conserva version si ya viene; solo stdlib.",
        instruction:
          "1. Copia `partial` a un dict nuevo.\n2. Fuerza `name` y `requires-python`; version con default `0.1.0`.\n3. Imprime el resultado de `complete_project({...})`.\n4. Quita `print('ok', True)`.",
        hint: "Copia partial, fuerza name y requires-python; version con setdefault o default.",
        hints: [
          "No devuelvas el dict parcial tal cual: name y requires-python se corrigen siempre.",
          "version: usa partial.get('version') o '0.1.0' si falta.",
        ],
        edgeCases: ["El nombre de distribución puede usar guiones; el import usa guion bajo."],
        tests: "Contrato ejecutable: corre exactamente los casos visibles del starter; exit 0 y sin traceback; stdout conserva el orden, etiquetas y valores exigidos por la instrucción, sin líneas extra.",
        feedback:
          "Si el name sigue siendo `familiarity` o falta `requires-python`, `complete_project` no normaliza el contrato. Copia a un dict nuevo, fuerza name y requires-python, y usa default de version solo si falta — no devuelvas el partial crudo.",
        retrospective:
          "Name de distribución puede llevar guiones; el import usa `familiarity_core`. Metadata mínima incompleta = install frágil en el primer `pip install -e .`. Pregunta: ¿qué clave del dict es la que más duele olvidar en CI? E2: armar las rutas del layout src.",
        starterCode: {
          language: 'python',
          title: "pyproject_fields.py",
          code: `# project metadata
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
        title: "Listar layout `src/` instalable",
        preamble:
          "- **Contexto:** el bootstrap del proyecto —su arranque: qué debe existir antes de que nada funcione— debe listar qué archivos tocan el install editable.\n- **Meta:** construir paths `src/<paquete>/…` desde módulos y anexar `pyproject.toml`.\n- **Éxito:** cuatro líneas en orden: tres bajo src (init, normalize, cli) y pyproject al final.\n- **Límites:** no hardcodees solo dos paths; `pyproject.toml` no va bajo `src/`.",
        instruction:
          "1. Implementa `src_layout(package, modules)` desde los argumentos.\n2. Incluye todos los módulos de la lista.\n3. Añade `pyproject.toml` al final.\n4. Imprime un path por línea.",
        hint: "Por cada módulo: f'src/{package}/{mod}'; luego pyproject.toml.",
        hints: [
          "No hardcodees solo dos paths: construye la lista desde package + modules.",
          "pyproject.toml vive en la raíz del proyecto, no bajo src/.",
        ],
        edgeCases: ["tests/ fuera de src"],
        tests: "Contrato ejecutable: corre exactamente los casos visibles del starter; exit 0 y sin traceback; stdout conserva el orden, etiquetas y valores exigidos por la instrucción, sin líneas extra.",
        feedback:
          "Si falta `cli.py` o `pyproject.toml`, la función aún no arma el layout mínimo instalable. Construye desde `package` + `modules` y anexa `pyproject.toml` en la **raíz**, no bajo `src/`.",
        retrospective:
          "El layout es el mapa mental del paquete: código importable bajo src, metadata en la raíz. Si falta `cli.py`, el entrypoint del gate no existe. E3: diagnosticar por qué el import falla tras install.",
        starterCode: {
          language: 'python',
          title: "layout_list.py",
          code: `# src layout paths
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
        title: "Diagnosticar `ModuleNotFoundError`",
        preamble:
          "- **Contexto:** tras `pip install -e .`, un `import` puede fallar por no install, nombre distinto a la carpeta, o un script homónimo en el cwd.\n- **Meta:** devolver la **primera** causa según un orden fijo de hechos.\n- **Éxito:** tres líneas `cause: …` del contrato, una por caso.\n- **Límites:** no busques palabras en un string libre; no devuelvas siempre «no instalado».",
        instruction:
          "1. Lee las claves de `facts` en orden: installed → igualdad de nombres → shadowing.\n2. Devuelve el string de cause exacto del contrato.\n3. Imprime un diagnose por caso del starter.\n4. Quita el print extra.",
        hint: "Evalúa en este orden: installed → igualdad import_name/package_dir → shadowing_script.",
        hints: [
          "No busques palabras en un string libre: lee las claves del dict facts.",
          "Imprime solo el string cause: … que devuelve diagnose_mnf.",
        ],
        edgeCases: ["venv incorrecto es otra causa clásica; aquí el contrato fija tres hechos."],
        tests: "Contrato ejecutable: corre exactamente los casos visibles del starter; exit 0 y sin traceback; stdout conserva el orden, etiquetas y valores exigidos por la instrucción, sin líneas extra.",
        feedback:
          "Si el segundo caso no detecta el mismatch, compara `import_name` con `package_dir` en vez de devolver siempre la primera causa. Si el tercero no ve shadowing, lee la clave booleana `shadowing_script` — no busques palabras en un string libre.",
        retrospective:
          "Un diagnóstico ordenado evita «probar de todo». El script en el cwd que tapa el paquete es un clásico de demos locales. Pregunta: ¿por qué el orden installed → nombres → shadowing importa? En T2-B versionas y declaras deps con el mismo rigor de contrato.",
        starterCode: {
          language: 'python',
          title: "diagnose_mnf.py",
          code: `# import fail causes (hechos estructurados)
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
        title: "Clasificar cambio y bumpear SemVer",
        preamble:
          "- **Contexto:** el CHANGELOG del CLI habla en español («renombrar», «añadir», «corregir»).\n- **Meta:** clasificar y **calcular** la nueva versión desde `1.0.0`, no inventar el string a mano.\n- **Éxito:** cuatro líneas `descripción: kind -> versión` del contrato.\n- **Límites:** major debe resetear minor/patch a 0; orden de classify: renombrar/eliminar → añadir → typo.",
        instruction:
          "1. Corrige `classify_change` (breaking no es patch).\n2. Corrige `bump` en major a `X.0.0`.\n3. Deja `bump_from_description` como orquestador.\n4. Imprime el formato del contrato; quita `ok`.",
        hint: "Primero classify (orden: renombrar/eliminar → añadir → typo), luego bump numérico; no inventes el string de versión a mano.",
        hints: [
          "classify_change: renombrar/eliminar → major; añadir/agregar → minor; typo/corregir → patch.",
          "bump('1.0.0','major')→'2.0.0'; minor→'1.1.0'; patch→'1.0.1'. Imprime f'{cambio}: {kind} -> {new}'.",
        ],
        edgeCases: ["Deprecar un minor antes del major reduce el dolor del breaking"],
        tests: "Contrato ejecutable: corre exactamente los casos visibles del starter; exit 0 y sin traceback; stdout conserva el orden, etiquetas y valores exigidos por la instrucción, sin líneas extra.",
        feedback:
          "Renombrar o eliminar API/CLI pública es major: subes el primer número y vuelves a cero el resto. Si solo sumas el major dejando residual (p. ej. `1.1.0`→`2.1.0`), mientes el SemVer. Añadir un flag compatible es minor; un typo de help es patch.",
        retrospective:
          "Classify y bump son dos pasos: primero política, luego aritmética. El error clásico es sumar major y dejar residual (`2.1.0` tras un breaking). Pregunta: ¿«añadir flag --format» es major? E2: dónde vive pytest (dev, no runtime).",
        starterCode: {
          language: 'python',
          title: "semver_bump_from_desc.py",
          code: `# classify + bump (no solo etiquetas)
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
        title: "Separar deps runtime y dev",
        preamble:
          "- **Contexto:** en N1 el paquete puede ser solo biblioteca estándar; pytest es herramienta de desarrollo.\n- **Meta:** armar el bloque de deps con runtime vacío y pytest en optional `dev`.\n- **Éxito:** dict con requires-python `>=3.11`, dependencies `[]`, optional-dependencies.dev `['pytest']`.\n- **Límites:** no mezcles pytest en `dependencies`.",
        instruction:
          "1. Corrige `build_deps` para no concatenar dev en runtime.\n2. Pon `optional-dependencies = {\"dev\": list(dev)}`.\n3. Imprime el resultado del caso del starter.\n4. Quita prints de debug.",
        hint: "dependencies = list(runtime); optional-dependencies = {'dev': list(dev)}.",
        hints: [
          "Para N1 stdlib: pasa runtime=[] y dev=['pytest'].",
          "Nunca mezcles pytest en dependencies (runtime).",
        ],
        edgeCases: ["pytest como optional dev, no runtime"],
        tests: "Contrato ejecutable: corre exactamente los casos visibles del starter; exit 0 y sin traceback; stdout conserva el orden, etiquetas y valores exigidos por la instrucción, sin líneas extra.",
        feedback:
          "Si pytest aparece en `dependencies`, `build_deps` aún concatena dev en runtime. Deja `dependencies = list(runtime)` y mueve dev a `optional-dependencies.dev` — el install del operador no debe arrastrar la herramienta del autor.",
        retrospective:
          "Runtime = lo que necesita el operador al instalar el CLI; dev = lo que necesita el autor al testear. Mezclarlos infla el install del equipo y ensucia el gate N1 stdlib-first. E3: política de compat hacia tipos de dominio (S11).",
        starterCode: {
          language: 'python',
          title: "deps_pin.py",
          code: `# deps structure
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
        title: "Política de compat hacia S11",
        preamble:
          "- **Contexto:** más adelante modelarás entidades (p. ej. `ClientRecord`); eso no debe romper en silencio el CLI ya empaquetado.\n- **Meta:** despachar política por `kind` estructurado, no por el label legible.\n- **Éxito:** tres líneas `POLICY: …` exactas.\n- **Límites:** kind desconocido → `ValueError`; no uses substrings del label.",
        instruction:
          "1. Reordena las ramas de `policy_for`.\n2. Completa `keep_cli_stable` con el texto de no romper CLI sin bump/CHANGELOG.\n3. Imprime solo `policy_for(kind)` por escenario.\n4. Quita `ok`.",
        hint: "Despacha por kind exacto (rename_entity / optional_field / keep_cli_stable), no por substring del label.",
        hints: [
          "if kind == 'rename_entity': …; no uses 'renombrar' del label para decidir.",
          "raise ValueError si el kind no está tipificado (fail-closed de política).",
        ],
        edgeCases: ["Si equality de una entidad frozen cambia, también es major aunque el nombre no cambie."],
        tests: "Contrato ejecutable: corre exactamente los casos visibles del starter; exit 0 y sin traceback; stdout conserva el orden, etiquetas y valores exigidos por la instrucción, sin líneas extra.",
        feedback:
          "Si `rename_entity` devuelve MINOR, las ramas están invertidas; si confías en el label en vez del kind, el despacho no es robusto. Mantener el CLI estable entre secciones es parte del gate.",
        retrospective:
          "El label es para humanos; el kind es para código. Mantener el CLI estable entre secciones es parte del gate. En T3-A implementas subcomandos y exit codes que el CI puede leer.",
        starterCode: {
          language: 'python',
          title: "compat_policy.py",
          code: `# API change policy (kinds estructurados)
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
        title: "Subcomando `report` con `--format`",
        preamble:
          "- **Contexto:** el operador lanza `familiarity report --format json` y espera un Namespace usable para el siguiente paso del pipeline (no un dict improvisado).\n- **Meta:** registrar el subparser `report` y el flag de formato con argparse.\n- **Éxito:** `Namespace(cmd='report', format='json')` impreso exactamente.\n- **Límites:** `add_subparsers(..., required=True)`; choices text|json; solo stdlib; sin `sys.path` hacks.",
        instruction:
          "1. Crea `ArgumentParser` y `add_subparsers(dest=\"cmd\", required=True)`.\n2. Añade parser `report` con `--format` (choices text/json, default text).\n3. Parsea `['report', '--format', 'json']`.\n4. Imprime el namespace; quita prints extra.",
        hint: "`sub = p.add_subparsers(dest=\"cmd\", required=True)` antes de `add_parser(\"report\")`.",
        hints: [
          "`sub = p.add_subparsers(dest=\"cmd\", required=True)` antes de `add_parser(\"report\")`.",
          "Si el print no muestra `format='json'`, el flag no está en el subparser correcto o el argv de prueba es incompleto.",
        ],
        edgeCases: ["required=True en subparsers (py3.7+)"],
        tests: "Contrato ejecutable: corre exactamente los casos visibles del starter; exit 0 y sin traceback; stdout conserva el orden, etiquetas y valores exigidos por la instrucción, sin líneas extra.",
        feedback:
          "Si el Namespace no tiene `cmd`/`format`, falta `subparsers` con `dest=\"cmd\"` y `--format` en el parser `report`. Revisa también `choices` y el argv de prueba `['report', '--format', 'json']`.",
        retrospective:
          "`required=True` hace que un argv vacío sea usage error, no un cmd `None` silencioso. El flag por subcomando mantiene el help legible por comando. Pregunta: ¿qué código de salida esperas si omites el subcomando? E2: traducir parse/runtime a 0/1/2.",
        starterCode: {
          language: 'python',
          title: "report_subcmd.py",
          code: `# argparse subparsers
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
        title: "Exit codes 0, 1 y 2 en el CLI",
        preamble:
          "- **Contexto:** scripts y pipelines deciden si reintentar o fallar el job según el código de salida.\n- **Meta:** devolver 2 en usage, 1 en error de negocio/config simulado, 0 en éxito.\n- **Éxito:** cinco líneas `label: code` del contrato.\n- **Límites:** no tragues `SystemExit` devolviendo 0; consulta `runtime_ok` solo tras parse OK.",
        instruction:
          "1. Envuelve `parse_args` en try/except SystemExit y propaga el code (default 2).\n2. Si el parse pasa y `runtime_ok` es False, devuelve 1.\n3. Éxito → 0.\n4. Imprime los cinco casos del starter sin líneas extra.",
        hint: "try/except SystemExit alrededor de parse_args; el código de argparse en usage es 2.",
        hints: [
          "argv=[] o un flag inventado deben devolver 2 vía SystemExit.",
          "runtime_ok=False simula error de negocio/config después de un parse válido → 1.",
        ],
        edgeCases: ["argparse usa 2 por defecto en errores de parseo; no tragues SystemExit sin devolver el code."],
        tests: "Contrato ejecutable: corre exactamente los casos visibles del starter; exit 0 y sin traceback; stdout conserva el orden, etiquetas y valores exigidos por la instrucción, sin líneas extra.",
        feedback:
          "argparse lanza `SystemExit` con código 2 en flags inventados o subcomando ausente. Eso no es «error de Python feo»: es el contrato de uso. Un archivo que no existe o config inválida es runtime (1), distinto del usage. Si unificas todo en 1, pierdes la señal de «el operador escribió mal el comando».",
        retrospective:
          "0/1/2 es lenguaje entre el CLI y el CI: usage roto ≠ archivo ausente. Pregunta de auto-chequeo: en tus cinco líneas, ¿cuántas son 2 y por qué no son 1? E3: ayuda humana alineada con ejemplos y esos mismos códigos.",
        starterCode: {
          language: 'python',
          title: "exit_codes.py",
          code: `# exit codes vía argparse real
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
        title: "Ayuda alineada para el operador",
        preamble:
          "- **Contexto:** en producción el operador copia ejemplos del `--help`, no lee la teoría del curso.\n- **Meta:** alinear notas con `#` en columna fija y documentar códigos de salida.\n- **Éxito:** dos HELP de ejemplo + una línea de códigos 2=uso / 1=error.\n- **Límites:** width=52; no dejes un solo espacio arbitrario; no dejes texto de relleno vago en la tercera línea.",
        instruction:
          "1. Completa `format_help` para alinear el comentario `#` en una columna fija (`width=52`).\n2. Imprime los dos ejemplos del starter con sus notas.\n3. Reemplaza la tercera línea del starter por la frase de códigos de salida del contrato (2=uso / 1=error de datos o config), en lugar del texto de relleno que trae.\n4. Quita prints de debug.",
        hint: "Construye `left = f\"HELP: {cmd}\"` y calcula cuántos espacios faltan hasta `width` (mínimo 1).",
        hints: [
          "Construye `left = f\"HELP: {cmd}\"` y calcula cuántos espacios faltan hasta `width` (mínimo 1).",
          "La tercera línea es texto fijo de 2=uso / 1=error; no pases por `format_help`.",
        ],
        edgeCases: ["Ejemplos concretos > descripciones abstractas"],
        tests: "Contrato ejecutable: corre exactamente los casos visibles del starter; exit 0 y sin traceback; stdout conserva el orden, etiquetas y valores exigidos por la instrucción, sin líneas extra.",
        feedback:
          "Si el `#` no alinea (p. ej. un solo espacio tras el csv) o falta el ejemplo de normalize, revisa `width=52` y cuántos espacios faltan hasta esa columna. Ejemplos concretos superan descripciones abstractas.",
        retrospective:
          "Ejemplos concretos («ingest --input …») superan descripciones abstractas. Alinear el `#` hace escaneable el help en terminal. Pregunta: ¿el operador lee teoría o copia del `--help`? En T3-B el siguiente riesgo es contaminar stdout con logs.",
        starterCode: {
          language: 'python',
          title: "operator_help.py",
          code: `# help examples
# DEFECT: format_help ignora note/width; sin códigos de salida; quita print('ok', True)
def format_help(cmd: str, note: str, width: int = 52) -> str:
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
          code: `def format_help(cmd: str, note: str, width: int = 52) -> str:
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
        title: "Datos por retorno y log en stderr",
        preamble:
          "- **Contexto:** un paso del CLI multiplica un valor de negocio y deja un evento de telemetría.\n- **Meta:** devolver el dato por el return (stdout del demo) y escribir el log en el stream de error.\n- **Éxito:** `6` y `stderr: event=done`.\n- **Límites:** no uses `print` para el log; no inviertas el orden de las líneas de verificación.",
        instruction:
          "1. Abre el starter: `process` hace `print(\"event=done\")` en stdout.\n2. Cambia el log para que se escriba en el stream `err` (con `err.write` y un salto de línea al final) y haz que la función retorne `n * 2`.\n3. Imprime el valor retornado y la línea `stderr: …`.\n4. Quita `ok`.",
        hint: "Función process(n) retorna n*2; log event=done en err.",
        hints: [
          "Función process(n) retorna n*2; log event=done en err.",
          "El StringIO de err simula sys.stderr: escribe ahí y deja el valor de negocio en el return.",
        ],
        edgeCases: ["En CLI real: print(..., file=sys.stderr)"],
        tests: "Contrato ejecutable: corre exactamente los casos visibles del starter; exit 0 y sin traceback; stdout conserva el orden, etiquetas y valores exigidos por la instrucción, sin líneas extra.",
        feedback:
          "Si `event=done` aparece antes del `6` sin prefijo `stderr:`, aún escribes el log con `print` en stdout. Escribe el evento en el stream `err` (con su salto de línea) y deja el valor de negocio en el `return` (el harness lo imprime como «stdout» del demo).",
        retrospective:
          "El canal importa más que el mensaje. Mismo patrón en el CLI real con `sys.stderr`. Pregunta: si alguien hace `cmd | jq`, ¿dónde debe vivir `event=done`? E2: el path `-` como convención de stdin.",
        starterCode: {
          language: 'python',
          title: "stdout_stderr.py",
          code: `# stderr vs return
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
        title: "Leer de stdin o de archivo",
        preamble:
          "- **Contexto:** el operador a veces pasa un archivo y a veces encadena con `|` usando `-`.\n- **Meta:** elegir la fuente de texto según `path_or_dash`.\n- **Éxito:** `desde stdin` y `desde file` en ese orden.\n- **Límites:** no leas siempre `file_text`; simula I/O con los argumentos del starter (sin abrir disco real).",
        instruction:
          "1. Si `path_or_dash == \"-\"`, devuelve `stdin_text`.\n2. Si no, devuelve `file_text` (o `\"\"` si falta).\n3. Imprime ambos modos del starter.\n4. Quita prints extra.",
        hint: "Si path=='-', usa stdin_text.",
        hints: [
          "Si path=='-', usa stdin_text.",
          "Prueba ambos modos del starter.",
        ],
        edgeCases: ["En prod usa pathlib.Path.read_text o sys.stdin.read"],
        tests: "Contrato ejecutable: corre exactamente los casos visibles del starter; exit 0 y sin traceback; stdout conserva el orden, etiquetas y valores exigidos por la instrucción, sin líneas extra.",
        feedback:
          "Si ambos modos devuelven el `file_text`, el branch `path_or_dash == \"-\"` no está leyendo `stdin_text`. El path de archivo solo se usa cuando **no** es guion; aquí simulas I/O con argumentos, sin abrir disco.",
        retrospective:
          "`-` es un contrato de operadores, no magia de Python. En prod usarás `sys.stdin.read` o `Path.read_text`. Pregunta: ¿qué imprime un pipe real si olvidas el branch del guion? E3: JSON limpio vs logs mezclados.",
        starterCode: {
          language: 'python',
          title: "stdin_or_path.py",
          code: `# stdin dash
# DEFECT: ignora path_or_dash; quita print('ok', True)
def read_input(path_or_dash, stdin_text="", file_text=None):
    return file_text or ""

print(read_input("-", stdin_text="desde stdin"))
print(read_input("file.csv", file_text="desde file"))
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
        title: "JSON limpio vs logs mezclados",
        preamble:
          "- **Contexto:** un consumidor `jq` o un pipe a otro subcomando falla si «empezando/fin» contaminan stdout.\n- **Meta:** contrastar un CLI malo (todo en un string) con uno bueno (JSON en return, logs en err).\n- **Éxito:** bloque BAD con tres líneas de basura+JSON; bloque GOOD solo JSON + línea `stderr_only …`.\n- **Límites:** no dejes logs en el return de `good_cli`.",
        instruction:
          "1. Deja `bad_cli` como ejemplo de contaminación.\n2. En `good_cli`, escribe progreso en `err` y retorna solo el JSON.\n3. Imprime BAD/GOOD según el solution (incluye `stderr_only`).\n4. Quita `ok`.",
        hint: "Imprime BAD y luego GOOD; en GOOD solo el JSON final; el progreso va a err.",
        hints: [
          "Imprime BAD y luego GOOD; en GOOD solo el JSON final.",
          "Los mensajes de progreso van al StringIO de err; imprime stderr_only al final.",
        ],
        edgeCases: ["jq falla si hay basura alrededor del JSON"],
        tests: "Contrato ejecutable: corre exactamente los casos visibles del starter; exit 0 y sin traceback; stdout conserva el orden, etiquetas y valores exigidos por la instrucción, sin líneas extra.",
        feedback:
          "En GOOD solo debe quedar el JSON en el return; «empezando»/«fin» van al StringIO de err. Si falta la línea `stderr_only …`, el harness de verificación no está imprimiendo `err.getvalue()` como en la solution.",
        retrospective:
          "GOOD no es «menos logs»: es **otro canal**. El self-check del curso pregunta esto a propósito. Pregunta: ¿`jq` falla por JSON inválido o por basura alrededor? En T4-A el siguiente contrato es *quién gana* entre flag, env y archivo.",
        starterCode: {
          language: 'python',
          title: "clean_stdout.py",
          code: `# JSON on stdout only
# DEFECT: good_cli mezcla logs en stdout; quita print('ok', True)
from io import StringIO

def bad_cli():
    return "empezando\\n{\\"ok\\": true}\\nfin"

def good_cli(err: StringIO) -> str:
    return "empezando\\n{\\"ok\\": true}\\nfin"

print("BAD")
print(bad_cli())
err = StringIO()
print("GOOD")
print(good_cli(err))
print("stderr_only", err.getvalue().replace("\\n", " | ").strip())
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
        title: "Trazar capas de config y el ganador",
        preamble:
          "- **Contexto:** al depurar «¿por qué el log_level es ERROR?», el operador necesita una traza de capas.\n- **Meta:** aplicar defaults → file → env → flags, saltando `None`, e imprimir el winner.\n- **Éxito:** tres `apply …` (sin file) y `winner=ERROR source=flags`.\n- **Límites:** no imprimas `apply file -> None`; flags es la prioridad más alta.",
        instruction:
          "1. Corrige el dict `PREC` (defaults=1 … flags=4).\n2. Al recorrer, `continue` si `val is None`.\n3. Actualiza winner/source y haz print de apply.\n4. Imprime la línea winner; quita `ok`.",
        hint: "Ordena por PREC (defaults=1 … flags=4); recorre y solo aplica valores no-None; actualiza winner/source en cada apply.",
        hints: [
          "PREC = {defaults:1, file:2, env:3, flags:4}; sorted(layers.keys(), key=PREC.get).",
          "Si val is None: continue (sin print); si no: print(f'apply {name} -> {val}') y actualiza winner/source.",
        ],
        edgeCases: ["Un flag None significa «no pasado» y no debe pisar env; aquí file=None simula capa ausente."],
        tests: "Contrato ejecutable: corre exactamente los casos visibles del starter; exit 0 y sin traceback; stdout conserva el orden, etiquetas y valores exigidos por la instrucción, sin líneas extra.",
        feedback:
          "Si aparece `apply file -> None` o winner=INFO, no filtras None o el orden PREC está invertido (flags debe ser el más alto). `None` = capa ausente, no el string `\"None\"`.",
        retrospective:
          "None = «capa ausente», no el string `\"None\"`. La traza enseña el mismo orden que el README del paquete. Pregunta: si inviertes PREC, ¿qué source gana con este fixture? E2: merge de varias claves con el mismo filtro.",
        starterCode: {
          language: 'python',
          title: "precedence_trace.py",
          code: `# apply layers + winner (None = capa ausente)
# DEFECT: orden invertido; no ignora None; quita print('ok', True)
PREC = {"defaults": 4, "file": 3, "env": 2, "flags": 1}

def resolve_with_trace(layers: dict) -> None:
    ordered = sorted(layers.keys(), key=lambda n: PREC[n])
    winner = None
    source = None
    for name in ordered:
        val = layers[name]
        print(f"apply {name} -> {val}")  # DEFECT: imprime None y no filtra
        winner = val
        source = name
    print(f"winner={winner} source={source}")

resolve_with_trace({
    "env": "DEBUG",
    "flags": "ERROR",
    "defaults": "INFO",
    "file": None,  # capa ausente: no debe aparecer en apply
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
    "file": None,
})`,
          output: `apply defaults -> INFO
apply env -> DEBUG
apply flags -> ERROR
winner=ERROR source=flags`,
        },
      },
      {
        id: "S10-T4-A-E2",
        subtopicId: "S10-T4-A",
        kind: "independent",
        title: "Merge de config con precedencia",
        preamble:
          "- **Contexto:** el arranque del CLI fusiona defaults, archivo, entorno y flags en un solo dict.\n- **Meta:** que el flag gane en `log_level` y que `jobs: None` en env **no** borre el default.\n- **Éxito:** `{'log_level': 'ERROR', 'jobs': 1}`.\n- **Límites:** aplica de menor a mayor prioridad; ignora `None` en capas altas.",
        instruction:
          "1. Parte de `dict(defaults)`.\n2. Superpone file → env → flags solo si `v is not None`.\n3. Imprime el merge del caso del starter.\n4. Quita prints extra.",
        hint: "Prueba con log_level en todas las capas.",
        hints: [
          "Aplica capas de menor a mayor prioridad: defaults → file → env → flags.",
          "Si v is None, no actualices esa clave (jobs queda 1).",
        ],
        edgeCases: ["jobs queda 1 porque env manda None"],
        tests: "Contrato ejecutable: corre exactamente los casos visibles del starter; exit 0 y sin traceback; stdout conserva el orden, etiquetas y valores exigidos por la instrucción, sin líneas extra.",
        feedback:
          "Si `log_level` no es ERROR o `jobs` se pierde, el orden de capas o el filtro de `None` está al revés. Un `None` en env no es «apagar jobs»: es «esta capa no opina».",
        retrospective:
          "Un `None` en env no es «apagar jobs»: es «esta capa no opina». Ese detalle evita configs a medias cuando el operador no exportó la variable. Pregunta: ¿qué pasa si haces `out.update(env)` sin filtrar None? E3: devolver también la *razón* del valor final.",
        starterCode: {
          language: 'python',
          title: "merge_config.py",
          code: `# merge precedence
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
        title: "Quién gana entre flag y env",
        preamble:
          "- **Contexto:** `FAMILIARITY_LOG_LEVEL=DEBUG` choca con `--log-level INFO`, o el flag no se pasó.\n- **Meta:** devolver `(valor, razón)` con la regla «flag gana solo si no es None».\n- **Éxito:** dos líneas `result=… razón=…` del contrato.\n- **Límites:** no inventes default INFO en esta función; no dejes que env gane siempre.",
        instruction:
          "1. Implementa `resolve_with_reason(env, flag)` devolviendo `(valor, razón)`.\n2. Regla de negocio: el flag solo gana si **no** es `None`; si el flag está ausente, gana env.\n3. Imprime ambos conflictos del bucle en el formato del contrato (`result=… razón=…`).\n4. Quita `ok` y no inventes un default INFO aquí.",
        hint: "Distingue «flag pasado con valor» de «flag no pasado (`None`)».",
        hints: [
          "Distingue «flag pasado con valor» de «flag no pasado (`None`)».",
          "Las razones del contrato son fijas en texto; no improvises redacciones nuevas.",
        ],
        edgeCases: ["Si el flag no se pasó (None), gana env — no inventes un default INFO aquí."],
        tests: "Contrato ejecutable: corre exactamente los casos visibles del starter; exit 0 y sin traceback; stdout conserva el orden, etiquetas y valores exigidos por la instrucción, sin líneas extra.",
        feedback:
          "Si el primer result=DEBUG, priorizaste env sobre un flag no-None. Si el segundo no es DEBUG, no trataste `flag=None` como ausente. La razón es parte del diagnóstico de arranque, no del payload.",
        retrospective:
          "La razón es parte del diagnóstico de arranque (stderr), no del payload de datos. Pregunta: con env=DEBUG y flag=None, ¿quién gana y por qué no INFO? En T4-B cierras el paquete con secretos fuera del repo y validación fail-closed.",
        starterCode: {
          language: 'python',
          title: "conflict_case.py",
          code: `# CLI vs env con razón derivada
# DEFECT: env siempre gana; no distingue flag=None; quita print('ok', True)
def resolve_with_reason(env, flag):
    return env, "env siempre gana"

for env, flag in [("DEBUG", "INFO"), ("DEBUG", None)]:
    val, why = resolve_with_reason(env, flag)
    print(f"result={val} razón={why}")
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "conflict_case.py",
          code: `def resolve_with_reason(env, flag):
    if flag is not None:
        return flag, "flag gana a env (flag no es None)"
    return env, "sin flag; gana env"

for env, flag in [("DEBUG", "INFO"), ("DEBUG", None)]:
    val, why = resolve_with_reason(env, flag)
    print(f"result={val} razón={why}")`,
          output: `result=INFO razón=flag gana a env (flag no es None)
result=DEBUG razón=sin flag; gana env`,
        },
      },
      {
        id: "S10-T4-B-E1",
        subtopicId: "S10-T4-B",
        kind: "guided",
        title: "Qué secretos van al `.gitignore`",
        preamble:
          "- **Contexto:** el repo del paquete no debe llevar tokens; el equipo sí necesita un template vacío.\n- **Meta:** filtrar candidatos: ignorar secretos reales, **no** `.env.example` ni README.\n- **Éxito:** cuatro líneas `ignore: …` del contrato (sin example ni README).\n- **Límites:** no marques todo como secreto; no ignores el template `.example`.",
        instruction:
          "1. Define el conjunto de patrones/secretos a ignorar.\n2. Excluye explícitamente `.env.example` y `README.md`.\n3. Imprime solo los que deben ignorarse.\n4. Quita `ok`.",
        hint: "`.env.example` se commitea vacío de secretos; `.env` y patrones de credenciales sí van a .gitignore.",
        hints: [
          "Devuelve False para .env.example y README.md.",
          "Imprime solo los que should_ignore_secret marca True, con prefijo ignore:.",
        ],
        edgeCases: [".env.example SÍ se commitea sin secretos"],
        tests: "Contrato ejecutable: corre exactamente los casos visibles del starter; exit 0 y sin traceback; stdout conserva el orden, etiquetas y valores exigidos por la instrucción, sin líneas extra.",
        feedback:
          "`.env.example` documenta variables sin valores secretos; si lo ignoras, el onboarding pierde el mapa. `.env`, PEM y `credentials.json` sí son basura peligrosa en git. Si aparece `.env.example` en la salida, bloqueaste el template del equipo.",
        retrospective:
          "Secretos fuera del repo es parte de la rúbrica del You Do (20% privacidad). El template se versiona; el valor real no. E2: validar config con mensajes de clave faltante.",
        starterCode: {
          language: 'python',
          title: "gitignore_secrets.py",
          code: `# gitignore secrets
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
        title: "Validar claves de config al arranque",
        preamble:
          "- **Contexto:** un CLI que arranca sin `data_dir` falla tarde y con stacktrace confuso.\n- **Meta:** exigir claves con `RuntimeError` que nombre la clave.\n- **Éxito:** `ok` y luego `config: falta clave requerida 'data_dir'`.\n- **Límites:** no imprimas `passed_bad`; captura el error del segundo caso.",
        instruction:
          "1. Exige `log_level` y `data_dir` en un bucle o checks.\n2. Mantén el mensaje con nombre de clave.\n3. Prueba el caso feliz y el incompleto del starter.\n4. Quita prints extra.",
        hint: "Raise RuntimeError con nombre de clave.",
        hints: [
          "Raise RuntimeError con nombre de clave.",
          "Prueba ok (ambas claves) y fail (falta data_dir).",
        ],
        edgeCases: ["Mensajes con nombre de clave ayudan al operador"],
        tests: "Contrato ejecutable: corre exactamente los casos visibles del starter; exit 0 y sin traceback; stdout conserva el orden, etiquetas y valores exigidos por la instrucción, sin líneas extra.",
        feedback:
          "Si sale `passed_bad` o no aparece `data_dir` en el error, `validate_config` aún no exige ambas claves. El caso feliz imprime solo `ok`; el incompleto debe lanzar y capturarse — no dejes pasar el segundo `validate_config` en silencio.",
        retrospective:
          "Mensajes con nombre de clave son documentación ejecutable para el operador. El mismo espíritu que `config: falta input_path para ingest` de la demo. Pregunta: ¿stacktrace crudo o `RuntimeError` con clave? E3: endurecer defaults inseguros (DEBUG, tokens).",
        starterCode: {
          language: 'python',
          title: "validate_cfg.py",
          code: `# validate_config
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
        title: "Endurecer defaults inseguros",
        preamble:
          "- **Contexto:** un default con token hardcodeado o DEBUG ruidoso es un pie de mina en el primer install.\n- **Meta:** transformar un dict inseguro en defaults seguros sin mutar a ciegas el original más de lo necesario.\n- **Éxito:** tres líneas `clave: old -> new` del contrato.\n- **Límites:** no dejes el token truthy; no hardcodees el dict final sin aplicar reglas.",
        instruction:
          "1. Copia `cfg` y aplica reglas por clave.\n2. DEBUG→INFO, echo_sql True→False, api_token truthy→None.\n3. Imprime old → new recorriendo las claves del inseguro.\n4. Quita `ok`.",
        hint: "Copia cfg; aplica reglas por clave; no hardcodees un dict final sin transformar.",
        hints: [
          "out = dict(cfg); luego if out.get('log_level') == 'DEBUG': out['log_level'] = 'INFO'.",
          "Si api_token es truthy, fíjalo a None (sin secretos en defaults).",
        ],
        edgeCases: ["token default None + validate al usar"],
        tests: "Contrato ejecutable: corre exactamente los casos visibles del starter; exit 0 y sin traceback; stdout conserva el orden, etiquetas y valores exigidos por la instrucción, sin líneas extra.",
        feedback:
          "Si el token o DEBUG sobreviven, `harden_defaults` no aplica las reglas: DEBUG→INFO, `echo_sql` True→False, `api_token` truthy→None. Copia el dict y transforma; no hardcodees el dict final sin recorrer claves.",
        retrospective:
          "Defaults seguros + validación al uso del token (si un adaptador remoto lo necesita) es el cierre de T4. En el You Do unes layout, CLI, precedencia y secretos en el paquete instalable del gate.",
        starterCode: {
          language: 'python',
          title: "secure_defaults.py",
          code: `# secure defaults
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
      "Conviertes el ETL de familiaridad en un **paquete instalable** — un conjunto de módulos que cualquiera puede `pip install` y ejecutar — con subcomandos `ingest|normalize|compare|report`, config por precedencia y validación temprana al arranque. Sin secretos en el repositorio; solo datos sintéticos. Al cerrar, prepárate para defender en ~30 s qué invariante demuestras (install editable, exit codes, import sin side-effects).",
    objectives: [
      "Layout src/ + pyproject.toml instalable en editable",
      "Subcomandos ingest, normalize, compare, report",
      "Lógica de dominio separada de I/O CLI",
      "Config por precedencia y validación temprana",
      "Ayuda --help y exit codes documentados",
      "Demostrar exit 2 con argv inválido y exit 0 con normalize sintético",
    ],
    requirements: [
      "`pip install -e .` en un venv fresco — un entorno virtual nuevo, Python ≥3.11, sin extras — y documenta el comando en el README",
      "`python -m familiarity_core --help` o un *entry point* de `console_scripts` (el comando `familiarity` que instala pip)",
      "Sin secretos en el repo; datos sintéticos",
      "Errores de uso vs. runtime distinguibles por exit code (2 vs. 1)",
      "Lógica importable sin *side-effects* (efectos colaterales al importar)",
      "README con la tabla de precedencia de config (flags > env > archivo > defaults)",
      "El subcomando ingest ejecuta una versión simplificada del ETL CSV del S08: parseo de `Decimal` desde texto, partición clean/quarantine (registros válidos vs. descartados) y manifest por fuente reconciliado (reutiliza lo que ya construiste en S08)",
      "`python -m unittest discover -s tests` pasa en un checkout limpio",
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
    retrospective:
      "Antes de marcar listo: (1) ¿qué invariante demuestras con `unittest` o un print de verificación (reconcile_ok, exit codes, import sin side-effects)? (2) ¿dónde viven secretos y PII en tu diseño vs. datos sintéticos del lab? (3) En el README, una frase de impacto medible (p. ej. «install editable + un comando reemplaza el notebook suelto») que puedas defender en 30 segundos ante el gate CP-N1-B/C.",
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
          "Es canónica en ops: flags CLI > variables de entorno > archivo > defaults. Un flag `None` significa «no pasado» y no debe pisar *env*.",
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
          "La salida estándar (stdout) son los datos (JSON/CSV) para los pipes; la salida de error (stderr) es el progreso y el diagnóstico. Un `print('ok')` extra en stdout rompe al consumidor del pipe.",
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
        label: "Click vs. argparse — elegir con criterio",
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
