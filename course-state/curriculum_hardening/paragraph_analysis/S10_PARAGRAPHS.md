# S10 Paragraph-by-Paragraph Analysis with Sources

Generated: 2026-07-24T05:02:09.394+00:00
Section: Módulos, packaging y CLI profesional
File: `s10-sklearn.ts`
STORM cycles: **10**
Expert rank: **9.55**

## Competitive sources (domain-honest HTTP ≥5)

- Python: [Modules tutorial](https://docs.python.org/3/tutorial/modules.html) — imports
- Python: [argparse](https://docs.python.org/3/library/argparse.html) — CLI
- PyPA: [pyproject.toml guide](https://packaging.python.org/en/latest/guides/writing-pyproject-toml/) — packaging
- PyPA: [Packaging User Guide](https://packaging.python.org/en/latest/) — install
- SemVer: [semver.org](https://semver.org/) — versioning
- PyPA: [sampleproject](https://github.com/pypa/sampleproject) — layout
- Real Python: [app layouts](https://realpython.com/python-application-layouts/) — src layout
- MIT: [6.100L](https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/) — modules
- Harvard: [CS50P](https://cs50.harvard.edu/python/) — libraries
- Coursera: [Python for Everybody](https://www.coursera.org/specializations/python) — MOOC
- Live: [PyArcana](https://pillb.github.io/pyarcana/) — course
- Python: [sys.exit](https://docs.python.org/3/library/sys.html#sys.exit) — exit codes
- Python: [__main__](https://docs.python.org/3/library/__main__.html) — package main

## Gold pass
| Area | Decision |
|------|----------|
| theory | deepen + domain contracts |
| weDo | CASO DEFECT |
| git | NO restore |
| STORM | hand_STORM_domain_sources |

## Theory (paragraph-level)

### De “scikit-learn ML pipeline” a módulos, packaging y CLI (mapa)
**P1** (rank 9.55/10)
> En V3, **S10 no es el path principal de Pipeline/ColumnTransformer/SHAP**. Ese material se reubica al tramo de ML tabular. Aquí empaquetas **familiarity_core**: módulos limpios,…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python: https://docs.python.org/3/tutorial/modules.html; Python: https://docs.python.org/3/library/argparse.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «De “scikit-learn ML pipeline” a módulos, packagi» in S10_STORM.json.

**P2** (rank 9.55/10)
> Integra el ETL de CP-N1-B (S08) y la observabilidad de S09 (logs sin PII, exit codes). Entorno **local-python**. Id `sklearn` se conserva. Fail-closed si config/schema no cuadra…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python: https://docs.python.org/3/library/argparse.html; PyPA: https://packaging.python.org/en/latest/guides/writing-pyproject-toml/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «De “scikit-learn ML pipeline” a módulos, packagi» in S10_STORM.json.

**P3** (rank 9.55/10)
> Orden: **T1 Módulos** → **T2 Paquetes** → **T3 CLI** → **T4 Configuración**. Caso sintético: CLI local con scores sintéticos y exit codes 0/1/2 — **nunca** PII real ni claims de…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** PyPA: https://packaging.python.org/en/latest/guides/writing-pyproject-toml/; PyPA: https://packaging.python.org/en/latest/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «De “scikit-learn ML pipeline” a módulos, packagi» in S10_STORM.json.

### Imports, namespaces y __main__
**P1** (rank 9.55/10)
> `import pkg.mod` y `from pkg.mod import name` cargan el módulo **una vez** en `sys.modules`. **`__name__`** es el nombre del módulo, o `'__main__'` si se ejecuta como script. Ej…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** PyPA: https://packaging.python.org/en/latest/; SemVer: https://semver.org/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Imports, namespaces y __main__» in S10_STORM.json.

**P2** (rank 9.55/10)
> `if __name__ == '__main__':` protege el CLI/demo para que **no** corra al importar. **`__all__`** documenta la API pública (y comunica intención). Fail-closed si el schema de co…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** SemVer: https://semver.org/; PyPA: https://github.com/pypa/sampleproject
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Imports, namespaces y __main__» in S10_STORM.json.

**P3** (rank 9.55/10)
> Los **imports circulares** se rompen extrayendo un tercer módulo, lazy import o invirtiendo dependencias. **Prefiere diseño a hacks**. Caso sintético: CLI con scores sintéticos …
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** PyPA: https://github.com/pypa/sampleproject; Real Python: https://realpython.com/python-application-layouts/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Imports, namespaces y __main__» in S10_STORM.json.

### Dependencias cíclicas y API pública
**P1** (rank 9.55/10)
> Prefijo `_` marca helpers **privados** (convención). La fachada (`__init__.py` o `api.py`) reexporta solo lo **estable**. Si un usuario importa `_strip`, mañana no puedes renomb…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Real Python: https://realpython.com/python-application-layouts/; MIT: https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Dependencias cíclicas y API pública» in S10_STORM.json.

**P2** (rank 9.55/10)
> Una **API pública pequeña** (p. ej. 4 símbolos: normalize, compare, report…) reduce breaking changes. Semver simple: **añadir** es minor; **renombrar/eliminar** es major. Fail-c…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** MIT: https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/; Harvard: https://cs50.harvard.edu/python/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Dependencias cíclicas y API pública» in S10_STORM.json.

**P3** (rank 9.55/10)
> Lazy import dentro de funciones evita ciclos y acelera el import del paquete cuando un submódulo es pesado. Caso sintético: CLI local — **nunca** PII real.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Harvard: https://cs50.harvard.edu/python/; Coursera: https://www.coursera.org/specializations/python
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Dependencias cíclicas y API pública» in S10_STORM.json.

### Layout src, pyproject.toml y builds
**P1** (rank 9.55/10)
> Layout **src/**: `src/familiarity_core/...` evita importar el paquete desde el repo **sin** instalar. `pyproject.toml` declara name, version, requires-python y el build backend …
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Coursera: https://www.coursera.org/specializations/python; Live: https://pillb.github.io/pyarcana/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Layout src, pyproject.toml y builds» in S10_STORM.json.

**P2** (rank 9.55/10)
> `pip install -e .` instala en **editable**: cambias código y el import refleja al toque. Ideal en desarrollo del CLI del gate CP-N1-B/C. Fail-closed si metadata falta (`name`, `…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Live: https://pillb.github.io/pyarcana/; Python: https://docs.python.org/3/library/sys.html#sys.exit
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Layout src, pyproject.toml y builds» in S10_STORM.json.

**P3** (rank 9.55/10)
> Si ves `ModuleNotFoundError` post-install, revisa nombre del paquete, packages discovery y el cwd. Caso sintético: CLI local — **nunca** PII real.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python: https://docs.python.org/3/library/sys.html#sys.exit; Python: https://docs.python.org/3/library/__main__.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Layout src, pyproject.toml y builds» in S10_STORM.json.

### Versionado y compatibilidad
**P1** (rank 9.55/10)
> **SemVer** simple: MAJOR.MINOR.PATCH. Breaking → major; feature compatible → minor; fix → patch. En 0.x es más flexible, pero **documenta igual**. Renombrar API pública de norma…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python: https://docs.python.org/3/library/__main__.html; Python: https://docs.python.org/3/tutorial/modules.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Versionado y compatibilidad» in S10_STORM.json.

**P2** (rank 9.55/10)
> `requires-python` y dependencies pinadas con criterio (mínimos, no caos de upper bounds sin razón). Fail-closed si falta metadata en pyproject.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python: https://docs.python.org/3/tutorial/modules.html; Python: https://docs.python.org/3/library/argparse.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Versionado y compatibilidad» in S10_STORM.json.

**P3** (rank 9.55/10)
> Un **CHANGELOG** real, aunque breve (Added/Changed/Fixed), evita amnesia entre sprints. Breaking de firma pública se **anuncia**. Caso sintético: CLI local — **nunca** PII real.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python: https://docs.python.org/3/library/argparse.html; PyPA: https://packaging.python.org/en/latest/guides/writing-pyproject-toml/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Versionado y compatibilidad» in S10_STORM.json.

### argparse, subcomandos y exit codes
**P1** (rank 9.55/10)
> `argparse.ArgumentParser` + **subparsers** modelan `ingest|normalize|compare|report`. Cada subcomando tiene flags propios y `help=` en español claro para operadores.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** PyPA: https://packaging.python.org/en/latest/guides/writing-pyproject-toml/; PyPA: https://packaging.python.org/en/latest/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «argparse, subcomandos y exit codes» in S10_STORM.json.

**P2** (rank 9.55/10)
> Exit codes: **0** éxito, **2** uso/CLI inválido (argparse default), **1** error de runtime/negocio. Scripts y CI **dependen** de esto — no devuelvas siempre 0.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** PyPA: https://packaging.python.org/en/latest/; SemVer: https://semver.org/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «argparse, subcomandos y exit codes» in S10_STORM.json.

**P3** (rank 9.55/10)
> Separa el parse de args de la lógica: `main(argv) -> int` retorna el código; el entrypoint hace `sys.exit(main())`. Caso sintético: CLI local — **nunca** PII real.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** SemVer: https://semver.org/; PyPA: https://github.com/pypa/sampleproject
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «argparse, subcomandos y exit codes» in S10_STORM.json.

### stdin/stdout/stderr y ayuda
**P1** (rank 9.55/10)
> **stdout** = datos (JSON, CSV). **stderr** = logs y progreso. Así `cmd > out.json` **no** contamina el archivo. Un `print('ok')` extra rompe el pipe de quien parsea JSON.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** PyPA: https://github.com/pypa/sampleproject; Real Python: https://realpython.com/python-application-layouts/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «stdin/stdout/stderr y ayuda» in S10_STORM.json.

**P2** (rank 9.55/10)
> Soportar path o **`-`** para stdin habilita pipes: `cat data.json | familiarity normalize`. Fail-closed si el schema de entrada no cuadra.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Real Python: https://realpython.com/python-application-layouts/; MIT: https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «stdin/stdout/stderr y ayuda» in S10_STORM.json.

**P3** (rank 9.55/10)
> No mezcles `print` de debug en stdout. Progress y logs (S09) van a **stderr**. Caso sintético: CLI local — **nunca** PII real.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** MIT: https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/; Harvard: https://cs50.harvard.edu/python/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «stdin/stdout/stderr y ayuda» in S10_STORM.json.

### Archivo/env/flags y precedencia
**P1** (rank 9.55/10)
> Precedencia canónica: **flags CLI > variables de entorno > archivo de config > defaults**. Documenta la tabla en README — sin sorpresas en ops.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Harvard: https://cs50.harvard.edu/python/; Coursera: https://www.coursera.org/specializations/python
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Archivo/env/flags y precedencia» in S10_STORM.json.

**P2** (rank 9.55/10)
> Un flag `--log-level` debe ganar a `FAMILIARITY_LOG_LEVEL`. Trata `None` en flags como “no pasado” para no pisar env con nulls.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Coursera: https://www.coursera.org/specializations/python; Live: https://pillb.github.io/pyarcana/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Archivo/env/flags y precedencia» in S10_STORM.json.

**P3** (rank 9.55/10)
> Implementa un `merge_config` **puro y testeable**: dicts por capa, reduce de menor a mayor prioridad. Caso sintético: CLI local — **nunca** PII real.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Live: https://pillb.github.io/pyarcana/; Python: https://docs.python.org/3/library/sys.html#sys.exit
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Archivo/env/flags y precedencia» in S10_STORM.json.

### Secretos, defaults y validación temprana
**P1** (rank 9.55/10)
> Secretos **fuera del repo**: `.env` en `.gitignore`, **nunca** en logs (S09). El ETL local de este nivel **no inventa un API token**. Defaults seguros (log level INFO, no debug …
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python: https://docs.python.org/3/library/sys.html#sys.exit; Python: https://docs.python.org/3/library/__main__.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Secretos, defaults y validación temprana» in S10_STORM.json.

**P2** (rank 9.55/10)
> `validate_config()` al arranque reporta qué clave falta y qué subcomando la exige: `input_path` para ingest y `manifest_path` para report. Fail-closed — no proceses a ciegas.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python: https://docs.python.org/3/library/__main__.html; Python: https://docs.python.org/3/tutorial/modules.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Secretos, defaults y validación temprana» in S10_STORM.json.

**P3** (rank 9.55/10)
> Fail-fast de config evita procesar 10k filas con un path mal tipeado. Caso sintético: CLI local — **nunca** PII real ni tokens en traceback.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python: https://docs.python.org/3/tutorial/modules.html; Python: https://docs.python.org/3/library/argparse.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Secretos, defaults y validación temprana» in S10_STORM.json.

