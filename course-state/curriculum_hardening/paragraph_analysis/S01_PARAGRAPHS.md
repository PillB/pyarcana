# S1 Paragraph-by-Paragraph Analysis with Sources

Generated: 2026-07-24T04:50:39.071+00:00
Section: Entorno reproducible y trabajo seguro
File: `s01-setup.ts`
STORM cycles: **1**
Expert rank: **9.55**

## Competitive sources (domain-honest HTTP ≥5)

- Python: [Downloads](https://python.org/downloads/) — install
- Python: [venv docs](https://docs.python.org/3/library/venv.html) — venv
- pip: [User Guide](https://pip.pypa.io/en/stable/user_guide/) — pip
- VS Code: [Python extension](https://marketplace.visualstudio.com/items?itemName=ms-python.python) — editor
- Git: [Book ES](https://git-scm.com/book/es/v2) — git
- GitHub: [Quickstart](https://docs.github.com/es/get-started/quickstart) — github
- Conventional Commits: [Spec](https://www.conventionalcommits.org/) — commits
- Ruff: [Docs](https://docs.astral.sh/ruff/) — lint
- MIT: [6.100L](https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/) — foundations
- Harvard: [CS50P](https://cs50.harvard.edu/python/) — projects
- Py4E: [Python for Everybody](https://www.py4e.com) — progressive
- Coursera: [Python specialization](https://www.coursera.org/specializations/python) — MOOC
- Live: [PyArcana](https://pillb.github.io/pyarcana/) — course

## Gold pass
| Area | Decision |
|------|----------|
| theory | expert refresh / deepen |
| weDo | CASO DEFECT |
| git | NO restore |
| STORM | hand_STORM_domain_sources |

## Theory (paragraph-level)

### Por qué el setup importa más de lo que crees
**P1** (rank 9.55/10)
> **Diccionario de la sección** (léelo antes de seguir; el resto profundiza cada término). **Intérprete:** el programa `python`/`python3` que ejecuta tu código. **Terminal (shell)…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python: https://python.org/downloads/; Python: https://docs.python.org/3/library/venv.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Por qué el setup importa más de lo que crees» in S01_STORM.json.

**P2** (rank 9.55/10)
> Mucha gente salta el setup porque 
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python: https://docs.python.org/3/library/venv.html; pip: https://pip.pypa.io/en/stable/user_guide/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Por qué el setup importa más de lo que crees» in S01_STORM.json.

**P3** (rank 9.55/10)
> . Error. En producción, un entorno mal configurado genera errores fantasma: 
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** pip: https://pip.pypa.io/en/stable/user_guide/; VS Code: https://marketplace.visualstudio.com/items?itemName=ms-python.python
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Por qué el setup importa más de lo que crees» in S01_STORM.json.

**P4** (rank 9.55/10)
>  es la frase más temida en Slack. Cuando trabajas en un equipo de data science, tu colega **clona tu repo** (copia el repositorio), crea su propio **entorno virtual**, ejecuta `…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** VS Code: https://marketplace.visualstudio.com/items?itemName=ms-python.python; Git: https://git-scm.com/book/es/v2
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Por qué el setup importa más de lo que crees» in S01_STORM.json.

**P5** (rank 9.55/10)
> En Perú, el stack que vas a encontrar en empresas medianas y grandes es bastante consistente: Python 3.11 o 3.12, VS Code o PyCharm, Git + GitHub (algunos usan GitLab), y **ento…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Git: https://git-scm.com/book/es/v2; GitHub: https://docs.github.com/es/get-started/quickstart
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Por qué el setup importa más de lo que crees» in S01_STORM.json.

**P6** (rank 9.55/10)
> La regla de oro: **un proyecto = un entorno virtual = un requirements.txt**. Nunca instales paquetes en el Python global del sistema. Nunca. Si lo haces, en 3 meses no vas a sab…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** GitHub: https://docs.github.com/es/get-started/quickstart; Conventional Commits: https://www.conventionalcommits.org/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Por qué el setup importa más de lo que crees» in S01_STORM.json.

### El intérprete Python y el REPL
**P1** (rank 9.55/10)
> Cuando instalas Python, lo que realmente instalas es un **intérprete**: un programa que lee tu código y lo ejecuta. En la terminal, ese programa suele llamarse `python` o `pytho…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Conventional Commits: https://www.conventionalcommits.org/; Ruff: https://docs.astral.sh/ruff/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «El intérprete Python y el REPL» in S01_STORM.json.

**P2** (rank 9.55/10)
> El **REPL** (Read–Eval–Print Loop) es el modo interactivo del intérprete. Lo abres escribiendo solo `python` (o `python3`) y Enter. Verás el prompt `>>>`. Ahí puedes escribir un…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Ruff: https://docs.astral.sh/ruff/; MIT: https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «El intérprete Python y el REPL» in S01_STORM.json.

**P3** (rank 9.55/10)
> )` devuelve `<class 'str'>`. Es ideal para probar una idea en 10 segundos sin crear un archivo. Para salir: `quit()` o `exit()`, o el carácter de fin de archivo (Ctrl-D en macOS…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** MIT: https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/; Harvard: https://cs50.harvard.edu/python/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «El intérprete Python y el REPL» in S01_STORM.json.

**P4** (rank 9.55/10)
> Hay una diferencia crítica entre **sesión REPL** y **script `.py`**. En el REPL cada línea se ejecuta al presionar Enter. En un script, escribes el programa completo en un archi…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Harvard: https://cs50.harvard.edu/python/; Py4E: https://www.py4e.com
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «El intérprete Python y el REPL» in S01_STORM.json.

**P5** (rank 9.55/10)
> , te está pidiendo el REPL. Cuando dice 
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Py4E: https://www.py4e.com; Coursera: https://www.coursera.org/specializations/python
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «El intérprete Python y el REPL» in S01_STORM.json.

**P6** (rank 9.55/10)
> , te está pidiendo un archivo. Confundir ambos genera la sensación de que 
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Coursera: https://www.coursera.org/specializations/python; Live: https://pillb.github.io/pyarcana/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «El intérprete Python y el REPL» in S01_STORM.json.

**P7** (rank 9.55/10)
>  en la laptop y falla en el servidor.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Live: https://pillb.github.io/pyarcana/; Python: https://python.org/downloads/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «El intérprete Python y el REPL» in S01_STORM.json.

**P8** (rank 9.55/10)
> Tu primer script usa tres piezas mínimas: (1) **`print(...)`** escribe texto a la salida estándar (lo ves en la terminal). (2) **`def nombre():`** define una función — un bloque…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python: https://python.org/downloads/; Python: https://docs.python.org/3/library/venv.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «El intérprete Python y el REPL» in S01_STORM.json.

**P9** (rank 9.55/10)
> :`** solo corre `main()` cuando ejecutas el archivo con `python archivo.py` (no cuando alguien lo importa como módulo). Para la versión de Python dentro del script: `import sys`…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python: https://docs.python.org/3/library/venv.html; pip: https://pip.pypa.io/en/stable/user_guide/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «El intérprete Python y el REPL» in S01_STORM.json.

**P10** (rank 9.55/10)
> )` — la `f` delante de las comillas permite `{expresiones}` dentro.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** pip: https://pip.pypa.io/en/stable/user_guide/; VS Code: https://marketplace.visualstudio.com/items?itemName=ms-python.python
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «El intérprete Python y el REPL» in S01_STORM.json.

**P11** (rank 9.55/10)
> **Anotaciones de tipo opcionales (pistas):** `def main() -> None:` dice “esta función no devuelve un valor útil”. `-> None` y `: str` en parámetros son **anotaciones** (type hin…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** VS Code: https://marketplace.visualstudio.com/items?itemName=ms-python.python; Git: https://git-scm.com/book/es/v2
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «El intérprete Python y el REPL» in S01_STORM.json.

### El intérprete en la terminal (comandos de verificación)
**P1** (rank 9.55/10)
> Además del script, sigue verificando el intérprete desde la shell antes de crear venvs o instalar paquetes.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Git: https://git-scm.com/book/es/v2; GitHub: https://docs.github.com/es/get-started/quickstart
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «El intérprete en la terminal (comandos de verifi» in S01_STORM.json.

### Terminal, rutas y códigos de salida
**P1** (rank 9.55/10)
> La **terminal** (bash, zsh o PowerShell) es el lugar donde lanzas procesos: `python`, `git`, `mkdir`. Cada comando que escribes es un **proceso** hijo de la shell. Cuando termin…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** GitHub: https://docs.github.com/es/get-started/quickstart; Conventional Commits: https://www.conventionalcommits.org/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Terminal, rutas y códigos de salida» in S01_STORM.json.

**P2** (rank 9.55/10)
> No confundas el **directorio de trabajo actual** (cwd: dónde “estás” con `cd` y `pwd` / `Get-Location`) con el **PATH** (lista de carpetas donde el sistema busca ejecutables com…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Conventional Commits: https://www.conventionalcommits.org/; Ruff: https://docs.astral.sh/ruff/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Terminal, rutas y códigos de salida» in S01_STORM.json.

**P3** (rank 9.55/10)
> En Python, `sys.exit(n)` termina el proceso con código `n`. Es la forma limpia de señalizar éxito o error a la shell y a herramientas externas. Ejemplo: un script de validación …
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Ruff: https://docs.astral.sh/ruff/; MIT: https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Terminal, rutas y códigos de salida» in S01_STORM.json.

**P4** (rank 9.55/10)
> **Argumentos de línea de comandos:** `sys.argv` es una lista de strings. `sys.argv[0]` es el nombre del script; los argumentos del usuario empiezan en `sys.argv[1]`. **`len(sys.…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** MIT: https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/; Harvard: https://cs50.harvard.edu/python/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Terminal, rutas y códigos de salida» in S01_STORM.json.

**P5** (rank 9.55/10)
> ]` y `len(sys.argv) == 2`. **Rebanado (slice):** `sys.argv[1:]` es la sublista desde el índice 1 hasta el final (todos los args del usuario, sin el nombre del script). La forma …
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Harvard: https://cs50.harvard.edu/python/; Py4E: https://www.py4e.com
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Terminal, rutas y códigos de salida» in S01_STORM.json.

**P6** (rank 9.55/10)
> , file=sys.stderr)` y luego `sys.exit(1)`.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Py4E: https://www.py4e.com; Coursera: https://www.coursera.org/specializations/python
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Terminal, rutas y códigos de salida» in S01_STORM.json.

**P7** (rank 9.55/10)
> **Qué intérprete es este proceso:** `sys.executable` es la ruta absoluta del binario Python que está corriendo tu script (ej. `.../.venv/bin/python`). Si `import requests` falla…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Coursera: https://www.coursera.org/specializations/python; Live: https://pillb.github.io/pyarcana/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Terminal, rutas y códigos de salida» in S01_STORM.json.

### cwd, PATH y códigos de salida en la shell
**P1** (rank 9.55/10)
> Desde la shell, confirma cwd, PATH conceptual y códigos de salida con los mismos números 0/1 que usa `sys.exit`.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Live: https://pillb.github.io/pyarcana/; Python: https://python.org/downloads/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «cwd, PATH y códigos de salida en la shell» in S01_STORM.json.

### Componentes del stack que vamos a instalar
**P1** (rank 9.55/10)
> Vamos a instalar 4 cosas, en este orden: (1) Python 3.12 desde python.org, (2) VS Code desde code.visualstudio.com, (3) Git desde git-scm.com, y (4) las extensiones de Python en…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python: https://python.org/downloads/; Python: https://docs.python.org/3/library/venv.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Componentes del stack que vamos a instalar» in S01_STORM.json.

**P2** (rank 9.55/10)
> Una decisión clave: **¿venv o conda?** Para data science en Perú, `venv` es suficiente y es lo estándar. `conda` es más pesado (descarga 3-5 GB) y tiene su propio sistema de paq…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python: https://docs.python.org/3/library/venv.html; pip: https://pip.pypa.io/en/stable/user_guide/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Componentes del stack que vamos a instalar» in S01_STORM.json.

**P3** (rank 9.55/10)
> Python viene con una biblioteca estándar que incluye módulos como `sys` (información del sistema), `datetime` (fechas y horas), `os` (sistema operativo), y `json` (manejo de JSO…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** pip: https://pip.pypa.io/en/stable/user_guide/; VS Code: https://marketplace.visualstudio.com/items?itemName=ms-python.python
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Componentes del stack que vamos a instalar» in S01_STORM.json.

### Entornos virtuales con venv
**P1** (rank 9.55/10)
> Un **entorno virtual** es una carpeta autocontenida con su propio intérprete Python y su propio directorio de paquetes. La herramienta estándar de la biblioteca es el módulo **`…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** VS Code: https://marketplace.visualstudio.com/items?itemName=ms-python.python; Git: https://git-scm.com/book/es/v2
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Entornos virtuales con venv» in S01_STORM.json.

**P2** (rank 9.55/10)
> **Nombre de la carpeta:** la documentación oficial de Python recomienda **`.venv`** (con punto): queda semi-oculto en listados Unix y se distingue de archivos `.env` de secretos…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Git: https://git-scm.com/book/es/v2; GitHub: https://docs.github.com/es/get-started/quickstart
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Entornos virtuales con venv» in S01_STORM.json.

**P3** (rank 9.55/10)
> **Activación** engancha la shell al Python del entorno: en macOS/Linux, `source .venv/bin/activate`; en Windows PowerShell, `.venv\\Scripts\\Activate.ps1`. El prompt suele mostr…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** GitHub: https://docs.github.com/es/get-started/quickstart; Conventional Commits: https://www.conventionalcommits.org/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Entornos virtuales con venv» in S01_STORM.json.

### pip, freeze y requirements.txt
**P1** (rank 9.55/10)
> Con el `.venv` activado, instalas dependencias de **terceros** con **`python -m pip`**. El prefijo `python -m` ata pip al mismo intérprete que acabas de verificar: evita el clás…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Conventional Commits: https://www.conventionalcommits.org/; Ruff: https://docs.astral.sh/ruff/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «pip, freeze y requirements.txt» in S01_STORM.json.

**P2** (rank 9.55/10)
> **`pip freeze`** escribe *todo* lo instalado en el entorno activo, incluidas **dependencias transitivas** (si instalas `requests`, también aparecen `urllib3`, `certifi`, etc.). …
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Ruff: https://docs.astral.sh/ruff/; MIT: https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «pip, freeze y requirements.txt» in S01_STORM.json.

**P3** (rank 9.55/10)
> Flujo profesional: (1) activar `.venv`, (2) instalar lo necesario, (3) `python -m pip freeze > requirements.txt`, (4) commitear el archivo (no la carpeta `.venv/`). Si un colega…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** MIT: https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/; Harvard: https://cs50.harvard.edu/python/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «pip, freeze y requirements.txt» in S01_STORM.json.

### Git: commits y lectura de diffs
**P1** (rank 9.55/10)
> Git es un **sistema de control de versiones**: registra *quién cambió qué y por qué*, no solo “guardar en la nube”. Flujo local mínimo: `git init` (una vez por repo), editas arc…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Harvard: https://cs50.harvard.edu/python/; Py4E: https://www.py4e.com
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Git: commits y lectura de diffs» in S01_STORM.json.

**P2** (rank 9.55/10)
> ` (punto de retorno con mensaje). Cada commit es un snapshot recuperable. GitHub/GitLab son **remotos** donde publicas esos commits; el historial útil empieza en tu máquina con …
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Py4E: https://www.py4e.com; Coursera: https://www.coursera.org/specializations/python
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Git: commits y lectura de diffs» in S01_STORM.json.

**P3** (rank 9.55/10)
> La convención **Conventional Commits** usa un prefijo + descripción en **imperativo** y en minúsculas tras el prefijo: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`. …
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Coursera: https://www.coursera.org/specializations/python; Live: https://pillb.github.io/pyarcana/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Git: commits y lectura de diffs» in S01_STORM.json.

**P4** (rank 9.55/10)
> Leer un **diff** es tan importante como escribir el commit. `git diff` muestra cambios *sin* stage; `git diff --staged` lo ya agregado; `git show` el último commit (o un hash). …
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Live: https://pillb.github.io/pyarcana/; Python: https://python.org/downloads/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Git: commits y lectura de diffs» in S01_STORM.json.

### Ramas, Pull Requests y recuperación segura
**P1** (rank 9.55/10)
> Trabajar siempre en `main` es el atajo del principiante y el riesgo del equipo. El flujo profesional: crea una **rama de feature** con `git switch -c feat/nombre-corto`, haz com…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python: https://python.org/downloads/; Python: https://docs.python.org/3/library/venv.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Ramas, Pull Requests y recuperación segura» in S01_STORM.json.

**P2** (rank 9.55/10)
> Un **conflicto** aparece cuando dos ramas editaron las mismas líneas. Git marca el archivo; tú eliges el contenido final, `git add` y un commit de merge o de resolución. En S01 …
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python: https://docs.python.org/3/library/venv.html; pip: https://pip.pypa.io/en/stable/user_guide/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Ramas, Pull Requests y recuperación segura» in S01_STORM.json.

**P3** (rank 9.55/10)
> Recuperación **no destructiva** del día a día: `git restore archivo` descarta cambios *sin commitear* en el working tree (vuelve a la última versión commiteada o staged, según e…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** pip: https://pip.pypa.io/en/stable/user_guide/; VS Code: https://marketplace.visualstudio.com/items?itemName=ms-python.python
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Ramas, Pull Requests y recuperación segura» in S01_STORM.json.

### VS Code y Ruff como calidad mínima
**P1** (rank 9.55/10)
> El editor recomendado en este curso es **VS Code** con la extensión de **Python** (Pylance para tipos e IntelliSense) y **Ruff** (linter/formateador ultra rápido escrito en Rust…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** VS Code: https://marketplace.visualstudio.com/items?itemName=ms-python.python; Git: https://git-scm.com/book/es/v2
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «VS Code y Ruff como calidad mínima» in S01_STORM.json.

**P2** (rank 9.55/10)
> La configuración mínima vive en **`pyproject.toml`** en la raíz del proyecto, sección `[tool.ruff]` y opcionalmente `[tool.ruff.lint]`. Valores sensatos para empezar: `line-leng…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Git: https://git-scm.com/book/es/v2; GitHub: https://docs.github.com/es/get-started/quickstart
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «VS Code y Ruff como calidad mínima» in S01_STORM.json.

**P3** (rank 9.55/10)
> ]` (pycodestyle errores, pyflakes, isort). Instala el CLI en el venv: `python -m pip install ruff`. Ejecuta: `python -m ruff check ruta/` o un archivo. `ruff format` formatea; e…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** GitHub: https://docs.github.com/es/get-started/quickstart; Conventional Commits: https://www.conventionalcommits.org/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «VS Code y Ruff como calidad mínima» in S01_STORM.json.

**P4** (rank 9.55/10)
> Flujo: escribes código → `ruff check` reporta (ej. **F401** import sin usar) → corriges o, en casos justificados avanzados, documentas un `noqa` (en S01 prefiere corregir). No h…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Conventional Commits: https://www.conventionalcommits.org/; Ruff: https://docs.astral.sh/ruff/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «VS Code y Ruff como calidad mínima» in S01_STORM.json.

**P5** (rank 9.55/10)
> ]` el primer día: el ruido abruma y nadie arregla 200 reglas a la vez. Un mínimo que el equipo respeta vale más que un máximo que todos ignoran.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Ruff: https://docs.astral.sh/ruff/; MIT: https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «VS Code y Ruff como calidad mínima» in S01_STORM.json.

### Archivos de calidad: ignore, secretos y README
**P1** (rank 9.55/10)
> **.gitignore** le dice a Git qué no trackear. Mínimo Python/data: `.venv/`, `venv/`, `__pycache__/`, `*.pyc`, `.env`, `.ipynb_checkpoints/`, y a menudo `data/raw/` o dumps grand…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** MIT: https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/; Harvard: https://cs50.harvard.edu/python/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Archivos de calidad: ignore, secretos y README» in S01_STORM.json.

**P2** (rank 9.55/10)
> **.env** guarda secretos y variables locales (API keys, contraseñas). **Nunca** va al repo. **`.env.example`** sí: lista las *claves* con valores vacíos o ficticios para que un …
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Harvard: https://cs50.harvard.edu/python/; Py4E: https://www.py4e.com
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Archivos de calidad: ignore, secretos y README» in S01_STORM.json.

**P3** (rank 9.55/10)
> **README.md** es el onboarding del clon limpio: título, qué hace el repo, mención al **esqueleto CP-N1-A** (Client Intake & Data Quality), instalación (`python -m venv .venv`, a…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Py4E: https://www.py4e.com; Coursera: https://www.coursera.org/specializations/python
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Archivos de calidad: ignore, secretos y README» in S01_STORM.json.

