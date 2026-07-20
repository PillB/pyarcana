import type { CourseSection } from '../../types'

export const section01: CourseSection = {
  id: 'setup',
  index: 1,
  title: 'Setup & Entorno de Desarrollo',
  shortTitle: 'Setup & Entorno',
  tagline: 'Python, VS Code, venv y Git listos para producción desde el día 1',
  estimatedHours: 4,
  level: 'Principiante',
  phase: 0,
  icon: 'Wrench',
  accentColor: 'bg-gradient-to-br from-violet-500 to-violet-700',
  jobRelevance:
    'El 90% de los problemas en equipos de data science no son de código, son de entorno. Un analista que sabe configurar venv, git y VS Code correctamente ahorra horas al equipo y se gana la confianza del líder técnico. En empresas peruanas como Interbank, BBVA o Caja Arequipa, el primer día te piden clonar un repo, levantar el entorno y correr un notebook. Si te trabas ahí, no pasas la semana de prueba.',
  learningOutcomes: [
    { text: 'Seleccionar e invocar el intérprete Python correcto y usar el REPL para inspección rápida' },
    { text: 'Interpretar códigos de salida (0 vs no-cero) y distinguir PATH del directorio de trabajo' },
    { text: 'Instalar Python 3.12+ y verificarlo desde la terminal (PowerShell, bash o zsh)' },
    { text: 'Crear y activar entornos virtuales con venv (.venv) por proyecto' },
    { text: 'Configurar VS Code con extensiones Python esenciales (Pylance, Ruff, Jupyter)' },
    { text: 'Inicializar un repo Git, hacer commit/push y abrir un Pull Request en GitHub' },
    { text: 'Escribir un archivo requirements.txt reproducible y un .gitignore correcto' },
  ],
  theory: [
    {
      heading: 'Por qué el setup importa más de lo que crees',
      paragraphs: [
        'Mucha gente salta el setup porque "ya aprenderá en el camino". Error. En producción, un entorno mal configurado genera errores fantasma: "a mí me funciona" es la frase más temida en Slack. Cuando trabajas en un equipo de data science, tu colega clona tu repo, ejecuta `pip install -r requirements.txt` y todo debería andar. Si no anda, perdiste credibilidad. Por eso esta sección no es un trámite — es la base sobre la que se construye todo lo demás.',
        'En Perú, el stack que vas a encontrar en empresas medianas y grandes es bastante consistente: Python 3.11 o 3.12, VS Code o PyCharm, Git + GitHub (algunos usan GitLab), y entornos virtuales con `venv` (más común) o `conda` (en equipos más legacy o de investigación). Las startups más nuevas están migrando a `uv` que es brutalmente más rápido, pero todavía no es estándar. Vamos con `venv` porque es lo que vas a encontrar en el 95% de los puestos.',
        'La regla de oro: **un proyecto = un entorno virtual = un requirements.txt**. Nunca instales paquetes globales. Nunca. Si lo haces, en 3 meses no vas a saber qué versión de pandas tenías cuando algo funcionaba y ahora no. El entorno virtual aísla las dependencias por proyecto, igual que una caja hermética. Cuando algo se rompe, sabes exactamente dónde buscar.',
      ],
    },
    {
      heading: 'El intérprete Python y el REPL',
      subtopicId: 'S01-T1-A',
      paragraphs: [
        'Cuando instalas Python, lo que realmente instalas es un **intérprete**: un programa que lee tu código y lo ejecuta. En la terminal, ese programa suele llamarse `python` o `python3`. La primera habilidad profesional no es escribir un algoritmo: es **verificar qué intérprete estás usando**. En Windows a veces el comando `python` no está en el PATH (la lista de carpetas donde el sistema busca programas). En macOS/Linux es común tener `python3` como comando principal. Por eso siempre empiezas con `python --version` (o `python3 --version`) y anotas la respuesta. Para este curso apuntamos a **Python 3.12 o superior**.',
        'El **REPL** (Read–Eval–Print Loop) es el modo interactivo del intérprete. Lo abres escribiendo solo `python` (o `python3`) y Enter. Verás el prompt `>>>`. Ahí puedes escribir una expresión, presionar Enter, y Python la evalúa al instante: `2 + 2` devuelve `4`, `type("hola")` devuelve `<class \'str\'>`. Es ideal para probar una idea en 10 segundos sin crear un archivo. Para salir: `quit()` o `exit()`, o el carácter de fin de archivo (Ctrl-D en macOS/Linux, Ctrl-Z y Enter en Windows). Salir del REPL **no cierra** tu terminal: vuelves al prompt de la shell (`$` o `PS>`).',
        'Hay una diferencia crítica entre **sesión REPL** y **script `.py`**. En el REPL cada línea se ejecuta al presionar Enter. En un script, escribes el programa completo en un archivo y lo lanzas con `python hello.py`. El script es lo que subes a GitHub y lo que corre en producción o en un pipeline. El REPL es tu laboratorio de bolsillo. Cuando un colega dice "ábrelo en el intérprete y mira el tipo", te está pidiendo el REPL. Cuando dice "corre el entrypoint", te está pidiendo un archivo. Confundir ambos genera la sensación de que "a mí me funciona" en la laptop y falla en el servidor.',
      ],
      code: {
        language: 'bash',
        title: 'Verificar intérprete y entrar al REPL',
        code: `# 1) ¿Qué intérprete responde?
python --version
# o, si en tu máquina el comando es python3:
python3 --version

# 2) Entrar al REPL (luego escribe código en >>>)
python
# >>> 2 + 2
# 4
# >>> import sys
# >>> sys.version.split()[0]
# '3.12.3'
# >>> quit()`,
        output: 'Python 3.12.3  (ejemplo; tu versión puede variar si es 3.12+)',
      },
      callout: {
        type: 'tip',
        title: 'Regla práctica',
        content:
          'Si `python --version` falla pero `python3 --version` funciona, usa `python3` de forma consistente en esta sección (o configura el alias/PATH). En Windows, al instalar desde python.org, marca "Add python.exe to PATH". Nunca instales paquetes "a ciegas" sin saber qué `python` los va a recibir.',
      },
    },
    {
      heading: 'Terminal, rutas y códigos de salida',
      subtopicId: 'S01-T1-B',
      paragraphs: [
        'La **terminal** (bash, zsh o PowerShell) es el lugar donde lanzas procesos: `python`, `git`, `mkdir`. Cada comando que escribes es un **proceso** hijo de la shell. Cuando termina, devuelve un **código de salida** (exit status): por convención, **0 significa éxito** y **cualquier valor distinto de 0 significa fallo**. En bash/zsh lo lees con `echo $?`. En PowerShell, con `echo $LASTEXITCODE`. CI, scripts y pipelines usan ese número para decidir si continúan o se detienen. Un mensaje de error en pantalla y un código 0 (o al revés) son cosas distintas: siempre mira el código cuando automatizas.',
        'No confundas el **directorio de trabajo actual** (cwd: dónde “estás” con `cd` y `pwd` / `Get-Location`) con el **PATH** (lista de carpetas donde el sistema busca ejecutables como `python`). Puedes estar en `~/proyectos/python-ds-journey` y aun así fallar `python` si ese ejecutable no está en el PATH. Al revés: puedes tener Python en el PATH y fallar al abrir un archivo si tu cwd no es la carpeta del proyecto. `mkdir` y `cd` mueven o crean rutas relativas al cwd; no “instalan” Python en el PATH.',
        'En Python, `sys.exit(n)` termina el proceso con código `n`. Es la forma limpia de señalizar éxito o error a la shell y a herramientas externas. Ejemplo: un script de validación sale con `0` si los argumentos son correctos y con `1` si faltan. En data ops verás el mismo contrato: un job ETL “failed” casi siempre es exit code distinto de cero, no solo un print rojo. Practica leer `$?` / `$LASTEXITCODE` después de cada comando crítico antes de culpar a la librería.',
      ],
      code: {
        language: 'bash',
        title: 'cwd, PATH conceptual y códigos de salida',
        code: `# Directorio actual (bash/zsh)
pwd
mkdir -p demo_ruta && cd demo_ruta
pwd

# Éxito → 0
python3 -c "import sys; sys.exit(0)"
echo $?          # bash/zsh → 0
# PowerShell:  python -c "import sys; sys.exit(0)"; echo $LASTEXITCODE

# Fallo controlado → 1
python3 -c "import sys; sys.exit(1)"
echo $?          # → 1

# Comando inexistente también deja código no cero
comando_que_no_existe 2>/dev/null
echo $?          # distinto de 0`,
        output: `.../demo_ruta
0
1
127   # ejemplo típico en bash para "command not found"`,
      },
      callout: {
        type: 'warning',
        title: 'PATH ≠ carpeta del proyecto',
        content:
          'Si `python` “no se reconoce”, el problema suele ser PATH o el nombre del comando (`python` vs `python3`), no que falte un archivo dentro de tu repo. Si `python script.py` dice que no encuentra el archivo, ahí sí revisa el cwd y la ruta al script. Diagnostica en ese orden: (1) ¿el ejecutable responde? (2) ¿estoy en la carpeta correcta? (3) ¿el proceso salió con 0?',
      },
    },
    {
      heading: 'Componentes del stack que vamos a instalar',
      paragraphs: [
        'Vamos a instalar 4 cosas, en este orden: (1) Python 3.12 desde python.org, (2) VS Code desde code.visualstudio.com, (3) Git desde git-scm.com, y (4) las extensiones de Python en VS Code. Cada una tiene su rol específico y no se mezclan. Python es el lenguaje. VS Code es el editor donde escribes código. Git es el sistema de control de versiones que registra cada cambio. GitHub es la nube donde publicas tu código para que otros lo vean y colaboren.',
        'Una decisión clave: **¿venv o conda?** Para data science en Perú, `venv` es suficiente y es lo estándar. `conda` es más pesado (descarga 3-5 GB) y tiene su propio sistema de paquetes que a veces entra en conflicto con pip. Solo te recomiendo conda si trabajas con investigadores que ya lo usan, o si necesitas CUDA/GPU para deep learning. En el 90% de los casos de data analysis (pandas, numpy, sklearn, matplotlib), `venv` + pip es lo correcto.',
        'Python viene con una biblioteca estándar que incluye módulos como `sys` (información del sistema), `datetime` (fechas y horas), `os` (sistema operativo), y `json` (manejo de JSON). Estos módulos **no necesitan `pip install`** — funcionan con solo hacer `import sys` o `from datetime import datetime`. En contraste, paquetes de terceros como `pandas`, `numpy`, o `matplotlib` NO vienen con Python y sí necesitan `pip install` antes de poder importarlos. Esta distinción es la causa #1 del error `ModuleNotFoundError` en principiantes: intentan `import pandas` sin haber hecho `pip install pandas` primero.',
      ],
      callout: {
        type: 'info',
        title: 'Biblioteca estándar vs paquetes de terceros',
        content:
          'Biblioteca estándar (sin pip install): sys, datetime, os, json, csv, pathlib, math, random. Paquetes de terceros (con pip install): pandas, numpy, matplotlib, scikit-learn, requests. Si te sale `ModuleNotFoundError`, primero revisa si es de la biblioteca estándar (no necesita install) o de terceros (necesita `pip install nombre_paquete`).',
      },
    },
    {
      heading: 'Entornos virtuales con venv',
      subtopicId: 'S01-T2-A',
      paragraphs: [
        'Un **entorno virtual** es una carpeta autocontenida con su propio intérprete Python y su propio directorio de paquetes. La herramienta estándar de la biblioteca es el módulo **`venv`**: `python -m venv .venv`. La regla de oro no cambia: **un proyecto = un entorno = un conjunto de dependencias**. Así evitas que el pandas 2.x de un cliente rompa el notebook legacy de otro. Instalar paquetes “en el Python global” del sistema es la vía rápida al caos en tres meses.',
        '**Nombre de la carpeta:** la documentación oficial de Python recomienda **`.venv`** (con punto): queda semi-oculto en listados Unix y se distingue de archivos `.env` de secretos. El nombre `venv` (sin punto) también es válido y lo verás en muchos tutoriales; en este curso el canónico es **`.venv`**, y tratamos `venv` como alias aceptado si ya lo usas. Ambos deben ir en `.gitignore` — nunca subas el entorno a GitHub (pesa decenas o cientos de MB y se regenera).',
        '**Activación** engancha la shell al Python del entorno: en macOS/Linux, `source .venv/bin/activate`; en Windows PowerShell, `.venv\\Scripts\\Activate.ps1`. El prompt suele mostrar `(.venv)`. **`deactivate`** vuelve al Python anterior. Si rompes el entorno, no “reparas a mano” el site-packages: borras la carpeta `.venv` y la recreas con el mismo comando. `conda` sigue siendo alternativa en investigación o GPU, pero **no es el default** de este curso. Herramientas más nuevas como `uv` son tendencia; aquí dominas `venv` porque es lo que encontrarás en la mayoría de onboarding corporativos.',
      ],
      code: {
        language: 'bash',
        title: 'Crear, activar y desactivar .venv',
        code: `# Desde la raíz del proyecto
python3 -m venv .venv

# Activar
# macOS / Linux (bash, zsh):
source .venv/bin/activate
# Windows PowerShell:
# .venv\\Scripts\\Activate.ps1

# Verificar que python apunta al entorno
which python3    # Unix: .../proyecto/.venv/bin/python3
# Windows: where python

python3 -c "import sys; print(sys.prefix)"
# debe incluir .../.venv

deactivate`,
        output: `.../python-ds-journey/.venv/bin/python3
.../python-ds-journey/.venv`,
      },
      callout: {
        type: 'tip',
        title: '.venv vs .env',
        content:
          '`.venv` = entorno virtual (código y paquetes). `.env` = variables de entorno y secretos (no va al repo). No los mezcles ni los subas. En `.gitignore` incluye ambos: `.venv/`, `venv/` y `.env`.',
      },
    },
    {
      heading: 'pip, freeze y requirements.txt',
      subtopicId: 'S01-T2-B',
      paragraphs: [
        'Con el `.venv` activado, instalas dependencias de **terceros** con **`python -m pip`**. El prefijo `python -m` ata pip al mismo intérprete que acabas de verificar: evita el clásico “pip instaló en un Python y `import` usa otro”. Comandos del día a día: `python -m pip install paquete`, pin con `paquete==1.2.3`, listar con `python -m pip list`, y exportar un snapshot con `python -m pip freeze > requirements.txt`. Para restaurar en otra máquina o en un entorno limpio: `python -m pip install -r requirements.txt`. La biblioteca estándar (`sys`, `datetime`, `pathlib`, `csv`, `json`…) **no** va a requirements: se importa sin `pip install`.',
        '**`pip freeze`** escribe *todo* lo instalado en el entorno activo, incluidas **dependencias transitivas** (si instalas `requests`, también aparecen `urllib3`, `certifi`, etc.). Eso es un **snapshot reproducible** muy útil para clonar el entorno de un analista. No es un lockfile moderno con hashes y resolución completa (Poetry, PDM, `uv lock` van más allá). En S01 usamos freeze + `==` porque es el mínimo que encontrarás en onboarding corporativo y en muchos repos de data. Entiende el límite: freeze captura *lo que hay hoy* en *tu* venv; no resuelve conflictos multiplataforma ni firma paquetes.',
        'Flujo profesional: (1) activar `.venv`, (2) instalar lo necesario, (3) `python -m pip freeze > requirements.txt`, (4) commitear el archivo (no la carpeta `.venv/`). Si un colega clona y hace `install -r`, debería obtener las mismas versiones pinneadas. Si ves `ModuleNotFoundError`, primero pregunta: ¿estoy en el venv correcto? ¿usé `python -m pip`? ¿el paquete es stdlib o de terceros? Diagnosticar en ese orden ahorra horas de “a mí me funciona”.',
      ],
      code: {
        language: 'bash',
        title: 'python -m pip: install, freeze, install -r',
        code: `# Con .venv activado
python -m pip install requests==2.32.3

# Snapshot del entorno (incluye transitivas)
python -m pip freeze > requirements.txt
# requests==2.32.3
# urllib3==...
# certifi==...

# En un entorno limpio (otro .venv o otra máquina):
python -m pip install -r requirements.txt
python -c "import requests; print(requests.__version__)"

# Stdlib: NO va en requirements.txt
python -c "import sys, datetime; print('stdlib ok')"`,
        output: `2.32.3
stdlib ok`,
      },
      callout: {
        type: 'info',
        title: 'Límites de freeze (honestidad técnica)',
        content:
          'freeze ≠ Poetry.lock / uv.lock: no trae hashes ni grafo de resolución multi-OS. Para este curso y la mayoría de equipos de analytics en Perú, `requirements.txt` pinneado con freeze es el contrato mínimo aceptable. Si el equipo usa poetry/uv, te lo dirán en el README; aquí dominas el estándar portable primero.',
      },
    },
    {
      heading: 'Git: commits y lectura de diffs',
      subtopicId: 'S01-T3-A',
      paragraphs: [
        'Git es un **sistema de control de versiones**: registra *quién cambió qué y por qué*, no solo “guardar en la nube”. Flujo local mínimo: `git init` (una vez por repo), editas archivos, `git status` (¿qué cambió?), `git add` (staging), `git commit -m "..."` (punto de retorno con mensaje). Cada commit es un snapshot recuperable. GitHub/GitLab son **remotos** donde publicas esos commits; el historial útil empieza en tu máquina con mensajes claros.',
        'La convención **Conventional Commits** usa un prefijo + descripción en **imperativo** y en minúsculas tras el prefijo: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`. Ejemplos: `feat: agregar script hello_env`, `docs: documentar instalación del venv`, `fix: corregir ruta en README`. Evita “cambios”, “wip”, “arreglé algo”: en seis meses nadie (ni tú) sabrá qué mirar. Equipos de datos en bancos y fintech en Perú suelen pedir este estilo en code review.',
        'Leer un **diff** es tan importante como escribir el commit. `git diff` muestra cambios *sin* stage; `git diff --staged` lo ya agregado; `git show` el último commit (o un hash). Líneas con `+` se añadieron; con `-` se quitaron. Un archivo nuevo aparece como todo `+`. Antes de `commit`, lee el diff: es tu última revisión de calidad y la misma habilidad que usarás al revisar un Pull Request de un colega.',
      ],
      code: {
        language: 'bash',
        title: 'init, commit Conventional Commits, show',
        code: `git init
# identidad solo la primera vez en la máquina (global):
# git config --global user.name "Tu Nombre"
# git config --global user.email "tu@correo.com"

echo "# Mi proyecto" > README.md
git add README.md
git status
git commit -m "docs: agregar README inicial"

echo "" >> README.md
echo "Setup con venv." >> README.md
git add README.md
git commit -m "docs: documentar setup con venv"

git log --oneline
git show HEAD   # mira +/- del último commit`,
        output: `docs: documentar setup con venv
docs: agregar README inicial
# git show: líneas + con el texto nuevo del README`,
      },
      callout: {
        type: 'tip',
        title: 'Mensaje vacío y commits basura',
        content:
          'Git puede rechazar un mensaje vacío según configuración. Aunque acepte “.” o “wip”, no lo hagas en main. Prefiere commits pequeños y con prefijo: un feat de código y un docs de README separados son más fáciles de revertir y de revisar que un mega-commit “todo el setup”.',
      },
    },
    {
      heading: 'Ramas, Pull Requests y recuperación segura',
      subtopicId: 'S01-T3-B',
      paragraphs: [
        'Trabajar siempre en `main` es el atajo del principiante y el riesgo del equipo. El flujo profesional: crea una **rama de feature** con `git switch -c feat/nombre-corto`, haz commits ahí, publica con `git push -u origin feat/nombre-corto`, y abre un **Pull Request (PR)** en GitHub para revisar antes de integrar a `main`. El PR no es burocracia: es el lugar donde un colega lee el diff, comenta y aprueba. Nombres útiles: `feat/hello-env`, `docs/readme-install`, `fix/gitignore-env`.',
        'Un **conflicto** aparece cuando dos ramas editaron las mismas líneas. Git marca el archivo; tú eliges el contenido final, `git add` y un commit de merge o de resolución. En S01 no necesitas ser experto en merges complejos: sí necesitas no paniquear y no “arreglar” con historial destructivo. La regla de oro de este curso: **no hagas `git push --force` a `main`**. Reescribe historial solo en ramas tuyas no compartidas y con permiso del equipo; en onboarding, ni eso.',
        'Recuperación **no destructiva** del día a día: `git restore archivo` descarta cambios *sin commitear* en el working tree (vuelve a la última versión commiteada o staged, según el caso). `git stash` guarda cambios temporales y deja el árbol limpio; `git stash pop` los recupera. Prefiere restore/stash a `reset --hard` como primer reflejo: hard borra trabajo no commiteado de forma fácil de lamentar. Aprende primero a no perder trabajo; después, a reescribir con cuidado.',
      ],
      code: {
        language: 'bash',
        title: 'Rama feature, restore y stash (sin force-push)',
        code: `# Desde main actualizado
git switch -c feat/hello-env
# ... editas scripts/hello_env.py ...
git add scripts/hello_env.py
git commit -m "feat: agregar smoke hello_env"
git push -u origin feat/hello-env
# Luego en GitHub: New Pull Request → base main ← compare feat/hello-env

# Descartar un cambio local no deseado (archivo no commiteado):
# git restore README.md

# Guardar trabajo a medias y volver al árbol limpio:
# git stash push -m "wip experimento"
# git stash pop`,
        output: `# Rama local feat/hello-env creada; push -u configura upstream
# PR se abre en la UI de GitHub (o: gh pr create)`,
      },
      callout: {
        type: 'danger',
        title: 'Errores típicos + prohibido force-push a main',
        content:
          'Del material original del curso: (1) subir `.venv/`/`venv/` a GitHub, (2) subir `.env` con secretos, (3) commits "cambios"/"wip", (4) trabajar solo en `main`. Si ya trackeaste un secreto: rotar + `git rm --cached .env` (`.gitignore` solo no limpia historial). **Prohibido:** `git push --force` a `main` — puede borrar commits ajenos. Recuperación segura: restore, stash, PR. Force-push nunca es la respuesta a “push rechazado” en main.',
      },
    },
    {
      heading: 'VS Code y Ruff como calidad mínima',
      subtopicId: 'S01-T4-A',
      paragraphs: [
        'El editor recomendado en este curso es **VS Code** con la extensión de **Python** (Pylance para tipos e IntelliSense) y **Ruff** (linter/formateador ultra rápido escrito en Rust). No sustituyen pensar: atrapan errores baratos antes del code review — imports sin usar, errores de sintaxis obvios, imports desordenados. En equipos de datos, un linter en el repo es el primer “CI humano” que corre en tu laptop.',
        'La configuración mínima vive en **`pyproject.toml`** en la raíz del proyecto, sección `[tool.ruff]` y opcionalmente `[tool.ruff.lint]`. Valores sensatos para empezar: `line-length = 88`, `target-version` acorde a tu Python, y `select = ["E", "F", "I"]` (pycodestyle errores, pyflakes, isort). Instala el CLI en el venv: `python -m pip install ruff`. Ejecuta: `python -m ruff check ruta/` o un archivo. `ruff format` formatea; en S01 el foco es **`ruff check`**.',
        'Flujo: escribes código → `ruff check` reporta (ej. **F401** import sin usar) → corriges o, en casos justificados avanzados, documentas un `noqa` (en S01 prefiere corregir). No habilites `select = ["ALL"]` el primer día: el ruido abruma y nadie arregla 200 reglas a la vez. Un mínimo que el equipo respeta vale más que un máximo que todos ignoran.',
      ],
      code: {
        language: 'toml',
        title: 'pyproject.toml — Ruff mínimo',
        code: `[tool.ruff]
line-length = 88
target-version = "py312"

[tool.ruff.lint]
select = ["E", "F", "I"]

# Terminal (con venv activado y ruff instalado):
# python -m ruff check scripts/hello_env.py
# # F401: import sin usar → quita el import o úsalo
# python -m ruff check scripts/hello_env.py   # exit 0 cuando está limpio`,
        output: 'All checks passed!  (tras corregir violaciones)',
      },
      callout: {
        type: 'tip',
        title: 'Extensión + CLI',
        content:
          'La extensión Ruff en VS Code subraya problemas mientras escribes; el CLI es lo que CI y tus compañeros pueden correr igual. Configura ambos con el mismo `pyproject.toml` para no pelear “en el editor pasa y en CI no”.',
      },
    },
    {
      heading: 'Archivos de calidad: ignore, secretos y README',
      subtopicId: 'S01-T4-B',
      paragraphs: [
        '**.gitignore** le dice a Git qué no trackear. Mínimo Python/data: `.venv/`, `venv/`, `__pycache__/`, `*.pyc`, `.env`, `.ipynb_checkpoints/`, y a menudo `data/raw/` o dumps grandes si tu política es no versionar datos pesados. Incluye **ambos** nombres de entorno (`.venv/` y `venv/`) porque el ecosistema usa los dos. Plantilla base: https://github.com/github/gitignore (Python.gitignore). Ojo: si un archivo **ya** está trackeado, agregarlo al ignore no lo saca del historial: necesitas `git rm --cached archivo` y un commit.',
        '**.env** guarda secretos y variables locales (API keys, contraseñas). **Nunca** va al repo. **`.env.example`** sí: lista las *claves* con valores vacíos o ficticios para que un colega sepa qué copiar a su `.env` privado. Ejemplo: `DATABASE_URL=` y `API_TOKEN=` sin valores reales. Si subiste un secreto por error, rotarlo (cambiar la clave en el proveedor) es más importante que solo borrar el archivo del commit siguiente: el historial puede conservarlo.',
        '**README.md** es el onboarding del clon limpio: título, qué hace el repo, mención al **esqueleto CP-N1-A** (Client Intake & Data Quality), instalación (`python -m venv .venv`, activate, `python -m pip install -r requirements.txt`), uso (`python scripts/hello_env.py`), y una nota de seguridad (no commitear `.env`, datos sintéticos). Para S01 agrega `data/clients_synthetic.csv` (PII falsa) y `data/data_dictionary.md` describiendo columnas. Un repo sin README ni diccionario de datos no se puede auditar ni reutilizar en S02–S04.',
      ],
      code: {
        language: 'bash',
        title: '.gitignore + .env.example (verificación)',
        code: `# Fragmento mínimo de .gitignore
# .venv/
# venv/
# __pycache__/
# *.pyc
# .env
# .ipynb_checkpoints/

# Verificar que .env queda ignorado (tras git init y .gitignore commiteable)
git check-ignore -v .env
# .gitignore:N:.env    .env

# .env.example SÍ se trackea (claves sin secretos)
# SECRET_KEY=
# API_URL=https://example.com`,
        output: `.gitignore:5:.env    .env`,
      },
      callout: {
        type: 'warning',
        title: 'Secretos, PII y datos sintéticos',
        content:
          'En el esqueleto CP-N1-A usa solo datos sintéticos (nombres inventados, DNI ficticios). No subas extractos reales de clientes, ni dumps de producción, ni capturas con información personal. responsible_use en la rúbrica es tan importante como “que el script corra”.',
      },
    },
  ],
  iDo: {
    intro:
      'Te muestro paso a paso cómo configuro un entorno completo desde cero en una laptop con Windows 11 (el caso más común en Perú). Si usas macOS o Linux, los comandos son casi idénticos — voy a anotar las diferencias. Acompáñame con tu laptop abierta y repite cada paso. Empezamos por el intérprete/REPL (S01-T1-A) y los códigos de salida (S01-T1-B) antes de crear entornos virtuales.',
    steps: [
      {
        demoId: 'S01-T1-A-DEMO',
        subtopicId: 'S01-T1-A',
        environment: 'local-python',
        description: 'Verificar el intérprete y abrir una sesión REPL mínima',
        code: {
          language: 'bash',
          title: 'Terminal + REPL',
          code: `# 1) Verificar qué intérprete responde (anota la versión)
python --version
# Si falla, prueba:
python3 --version

# 2) Entrar al REPL (modo interactivo)
python
# En el prompt >>> escribe exactamente:

# >>> 2 + 2
# 4
# >>> import sys
# >>> sys.version.split()[0]
# '3.12.3'   # ejemplo; la tuya puede ser otra 3.x
# >>> type("Hola Perú")
# <class 'str'>
# >>> quit()

# 3) Tras quit(), vuelves a la shell. El proceso Python ya terminó.
# Crear carpeta del proyecto (siguiente paso del setup)
mkdir python-ds-journey
cd python-ds-journey

# Preferir python -m pip para atar pip al mismo intérprete
python -m pip --version`,
          output: `Python 3.12.3
4
'3.12.3'
<class 'str'>
pip 24.0 from ... (python 3.12)`,
        },
        why: 'Si no sabes qué intérprete responde, todo lo demás (venv, pip, scripts) puede apuntar a otro Python y generar errores fantasma. El REPL confirma que el intérprete evalúa código; `quit()` demuestra que sales del REPL sin cerrar la terminal. Usar `python -m pip` evita instalar paquetes en un Python distinto al que ejecutas.',
      },
      {
        demoId: 'S01-T1-B-DEMO',
        subtopicId: 'S01-T1-B',
        environment: 'local-python',
        description: 'Observar códigos de salida 0 y no-cero con sys.exit',
        code: {
          language: 'bash',
          title: 'Terminal — exit codes',
          code: `# Éxito: el proceso Python termina con 0
python3 -c "import sys; print('ok'); sys.exit(0)"
echo "exit_ok=$?"
# PowerShell:
# python -c "import sys; print('ok'); sys.exit(0)"; echo "exit_ok=$LASTEXITCODE"

# Fallo controlado: termina con 1 (la shell sigue viva)
python3 -c "import sys; print('fallo controlado'); sys.exit(1)"
echo "exit_fail=$?"

# Comando inexistente → también no-cero (mensaje distinto, mismo tipo de señal a CI)
false
echo "exit_false=$?"

# Rutas: cwd vs carpeta
pwd
mkdir -p /tmp/s01_t1b_demo && cd /tmp/s01_t1b_demo
pwd
# Estar en /tmp/s01_t1b_demo NO "arregla" un Python ausente del PATH`,
          output: `ok
exit_ok=0
fallo controlado
exit_fail=1
exit_false=1
/Users/...
/tmp/s01_t1b_demo`,
        },
        why: 'El código de salida es el contrato entre tu script y todo lo que lo invoca (shell, CI, orquestadores). 0 = sigamos; no-cero = detente o reintenta. Separar cwd (dónde estoy) de PATH (qué ejecutables existen) evita el clásico "en mi máquina funciona" cuando solo cambió la carpeta o el PATH del job.',
      },
      {
        description: 'Verificar instalación de Python y crear carpeta del proyecto',
        code: {
          language: 'bash',
          title: 'Terminal',
          code: `# Verificar que Python está instalado
python --version
# Python 3.12.3  <- lo que deberías ver

# Si no está instalado, bajarlo de https://python.org/downloads
# En Windows, MARCAR la casilla "Add Python to PATH" durante la instalación

# Crear carpeta del proyecto
mkdir python-ds-journey
cd python-ds-journey

# Verificar que pip (gestor de paquetes) funciona — preferir python -m pip
python -m pip --version
# pip 24.0 from ... (python 3.12)`,
        },
        why: 'Siempre empezamos verificando que Python responde. En Windows, el PATH es el problema #1 — si te dice "python no se reconoce como comando", es porque no marcaste la casilla durante la instalación. La solución es reinstalar y asegurarte de marcarla.',
      },
      {
        demoId: 'S01-T2-A-DEMO',
        subtopicId: 'S01-T2-A',
        environment: 'local-python',
        description: 'Crear y activar entorno virtual con .venv',
        code: {
          language: 'bash',
          title: 'Terminal — python -m venv .venv',
          code: `# Canónico del curso: carpeta .venv (docs.python.org también la recomienda)
python3 -m venv .venv
# Equivalente aceptado si ya usas el nombre sin punto:
# python3 -m venv venv

# Activar en Windows (PowerShell)
# .venv\\Scripts\\Activate.ps1

# Activar en macOS/Linux
source .venv/bin/activate

# El prompt suele mostrar (.venv). Verifica el intérprete del entorno:
which python3
python3 -c "import sys; print(sys.prefix)"
# .../tu-proyecto/.venv

# Para desactivar (vuelves al Python anterior):
deactivate`,
          output: `.../python-ds-journey/.venv/bin/python3
.../python-ds-journey/.venv`,
        },
        why: 'El entorno virtual aísla las dependencias por proyecto. `python -m venv` usa el mismo intérprete que acabas de verificar. Si rompes paquetes, borras `.venv/` y la recreas — no reinstalas el sistema. Activar no es opcional en el flujo diario: sin activar, `pip` puede caer en el Python global.',
      },
      {
        demoId: 'S01-T2-B-DEMO',
        subtopicId: 'S01-T2-B',
        environment: 'local-python',
        description: 'Instalar con python -m pip, freeze y reinstall -r',
        code: {
          language: 'bash',
          title: 'Terminal — pip install / freeze / install -r',
          code: `# .venv activado (prompt (.venv))
python -m pip install requests==2.32.3

# Snapshot (incluye transitivas: urllib3, certifi, ...)
python -m pip freeze > requirements.txt
head -5 requirements.txt

# Replicar en entorno limpio (demo rápida):
deactivate
python3 -m venv .venv_clean
source .venv_clean/bin/activate   # Windows: .venv_clean\\Scripts\\Activate.ps1
python -m pip install -r requirements.txt
python -c "import requests; print(requests.__version__)"
# 2.32.3

# Stdlib no necesita pip:
python -c "import sys; print(sys.version.split()[0])"

# En el proyecto real del curso también instalarás pandas/numpy/etc.
# y dejarás un solo requirements.txt pinneado en la raíz.`,
          output: `requests==2.32.3
...
2.32.3
3.12.3`,
        },
        why: 'python -m pip ata el instalador al intérprete del venv. freeze genera el contrato reproducible; install -r lo aplica en un entorno limpio. Eso es lo que un colega hará el día 1 al clonar tu repo.',
      },
      {
        demoId: 'S01-T3-A-DEMO',
        subtopicId: 'S01-T3-A',
        environment: 'local-python',
        description: 'Primer commit Conventional Commits y lectura de git show',
        code: {
          language: 'bash',
          title: 'Terminal — git init / commit / show',
          code: `git init
# git config --global user.name "Tu Nombre"   # solo 1ª vez
# git config --global user.email "tu@correo.com"

echo "# python-ds-journey" > README.md
git add README.md
git commit -m "docs: agregar README inicial"

echo "" >> README.md
echo "Esqueleto CP-N1-A." >> README.md
git add README.md
git commit -m "docs: mencionar esqueleto CP-N1-A"

git log --oneline
git show HEAD --stat
# Lee las líneas +/− : qué se agregó o quitó en el último commit`,
          output: `docs: mencionar esqueleto CP-N1-A
docs: agregar README inicial
 README.md | 2 ++
 1 file changed, 2 insertions(+)`,
        },
        why: 'Un commit con prefijo docs:/feat: es legible en el historial y en el PR. git show es la misma habilidad de lectura de diff que usarás al revisar código ajeno.',
      },
      {
        demoId: 'S01-T3-B-DEMO',
        subtopicId: 'S01-T3-B',
        environment: 'local-python',
        description: 'Rama feature, push -u y plan de PR (sin force-push)',
        code: {
          language: 'bash',
          title: 'Terminal — branch + PR',
          code: `# Asegura estar en main con working tree limpio
git switch main

git switch -c feat/hello-env
# ... edita o crea scripts/hello_env.py ...
git add scripts/hello_env.py
git commit -m "feat: agregar smoke hello_env"

# Publicar rama (requiere remote origin ya configurado)
git push -u origin feat/hello-env

# Abrir PR en GitHub (UI) o con GitHub CLI:
# gh pr create --title "feat: smoke hello_env" --body "- Agrega scripts/hello_env.py\\n- Smoke del entorno"

# Recuperación local (demo):
# echo "temp" >> README.md
# git restore README.md          # descarta cambio no commiteado
# git stash push -m "wip"        # guarda a medias
# NUNCA: git push --force origin main`,
          output: `branch 'feat/hello-env' set up to track 'origin/feat/hello-env'
# PR abierto en la UI de GitHub`,
        },
        why: 'La rama + PR es el flujo de equipo. restore/stash recuperan sin reescribir historial compartido. force-push a main está prohibido en este curso.',
      },
      {
        demoId: 'S01-T4-A-DEMO',
        subtopicId: 'S01-T4-A',
        environment: 'local-python',
        description: 'Ruff check sobre un archivo con import sin usar',
        code: {
          language: 'bash',
          title: 'Terminal + pyproject.toml',
          code: `# pyproject.toml en la raíz (mínimo):
# [tool.ruff]
# line-length = 88
# target-version = "py312"
# [tool.ruff.lint]
# select = ["E", "F", "I"]

python -m pip install ruff
# hello_bad.py con: import sys  (sin usar) + print("hola")
python -m ruff check hello_bad.py
# F401 [*] \`sys\` imported but unused

# Tras quitar el import:
python -m ruff check hello_bad.py
# All checks passed!`,
          output: `F401 [*] \`sys\` imported but unused
All checks passed!`,
        },
        why: 'Ruff atrapa basura barata (imports muertos, errores F/E) antes del review. La config en pyproject.toml es el contrato del repo, no solo del editor.',
      },
      {
        demoId: 'S01-T4-B-DEMO',
        subtopicId: 'S01-T4-B',
        environment: 'local-python',
        description: '.gitignore, .env.example y README de instalación',
        code: {
          language: 'bash',
          title: 'Terminal — ignore + env example',
          code: `# .gitignore mínimo (incluye .venv/ Y venv/)
# .venv/
# venv/
# __pycache__/
# *.pyc
# .env
# .ipynb_checkpoints/

echo "API_TOKEN=supersecreto" > .env
echo "API_TOKEN=" > .env.example
git add .gitignore .env.example README.md
git status --short
# .env NO debe aparecer como staged
git check-ignore -v .env
# .gitignore:N:.env    .env

# README debe documentar:
# python -m venv .venv
# source .venv/bin/activate
# python -m pip install -r requirements.txt
# python scripts/hello_env.py`,
          output: `A  .env.example
A  .gitignore
A  README.md
.gitignore:5:.env    .env`,
        },
        why: '.env se ignora; .env.example se versiona sin secretos. El README cierra el circuito: un clon limpio debe poder instalar y correr el smoke sin adivinar.',
      },
      {
        description: 'Crear repo remoto en GitHub y subir main (cierre del setup)',
        code: {
          language: 'bash',
          title: 'Terminal — remote + push main',
          code: `# Opción 1: GitHub CLI
# gh auth login
# gh repo create python-ds-journey --public --source=. --remote=origin --push

# Opción 2: Manual
# 1. Crear repo vacío en https://github.com/new
git remote add origin https://github.com/TU_USUARIO/python-ds-journey.git
git branch -M main
git push -u origin main

# Features posteriores: siempre rama + PR (demo S01-T3-B), no commits directos eternos en main`,
        },
        why: 'GitHub es tu portafolio público. El remote conecta tu historial local con el equipo y con reclutadores; el trabajo diario de calidad sigue siendo rama + PR + ignore de secretos.',
      },
    ],
  },
  weDo: {
    intro:
      'Andamiaje decreciente por subtema: **E1 guiado → E2 independiente → E3 transferencia**. Completa T1–T4 (24 ejercicios con id S01-T*-E*). Usa las dos pistas si te trabas; solo entonces revisa la solución. Al final, el You Do cierra el **esqueleto CP-N1-A**.',
    steps: [
      {
        id: 'S01-T1-A-E1',
        subtopicId: 'S01-T1-A',
        kind: 'guided',
        instruction:
          'E1 (guiado) — Completa el transcript de una sesión REPL: suma, type() e import de sys. No crees un archivo .py; simula el diálogo en comentarios y luego pruébalo en tu terminal real.',
        hint: 'En el REPL el prompt es >>>. Tras import sys, usa sys.version.split()[0] para la versión corta.',
        hints: [
          'En el REPL el prompt es >>>. Tras import sys, usa sys.version.split()[0] para la versión corta.',
          'Para salir usa quit() o exit(). Eso no cierra la terminal: vuelves al prompt de bash/PowerShell/zsh.',
        ],
        edgeCases: [
          'Confundir quit() del REPL con cerrar la ventana de la terminal',
          'Usar python en un OS donde solo existe python3',
        ],
        tests:
          'Checklist: (1) 2+2 → 4; (2) type("x") es str; (3) sys.version.split()[0] es string tipo 3.x.y; (4) quit() regresa a la shell.',
        feedback:
          'Si completaste el diálogo y lo reproduciste en tu máquina, ya separas "probar en REPL" de "guardar en archivo". Siguiente: escribir un script real.',
        starterCode: {
          language: 'python',
          title: 'repl_transcript.py (solo como guía — ejecuta en el REPL real)',
          code: `# Completa las líneas marcadas con ____
# Esto NO se ejecuta como script: cópialo al REPL línea por línea.

# >>> ____ + ____
# 4

# >>> type("____")
# <class 'str'>

# >>> import ____
# >>> sys.version.____()[0]
# '3.x.y'

# >>> ____()   # salir del REPL`,
        },
        solutionCode: {
          language: 'python',
          title: 'repl_transcript — solución',
          code: `# Sesión REPL esperada (local-python):
# >>> 2 + 2
# 4
# >>> type("Hola")
# <class 'str'>
# >>> import sys
# >>> sys.version.split()[0]
# '3.9.6'   # o la versión de tu máquina
# >>> quit()`,
          output: `4
<class 'str'>
'3.9.6'`,
        },
      },
      {
        id: 'S01-T1-A-E2',
        subtopicId: 'S01-T1-A',
        kind: 'independent',
        instruction:
          'E2 (independiente) — Crea `hello_sys.py` que imprima tu nombre sintético y la versión de Python con sys. Debe usar `if __name__ == "__main__":` y salir con código 0 al correrse como script (no en el REPL).',
        hint: 'Importa sys. La versión corta es sys.version.split()[0]. Envuelve la lógica en main().',
        hints: [
          'Importa sys. La versión corta es sys.version.split()[0]. Envuelve la lógica en main().',
          'El bloque if __name__ == "__main__": llama a main(). Así el archivo es un entrypoint claro cuando haces: python hello_sys.py',
        ],
        edgeCases: [
          'Ejecutar pedazos en el REPL sin guardar el archivo',
          'Olvidar if __name__ == "__main__" (el script igual puede correr, pero pierdes el patrón profesional)',
        ],
        tests:
          'python hello_sys.py → exit 0; stdout contiene una versión 3.x y un nombre; no requiere pip install.',
        feedback:
          'Si el script corre con un solo comando y no dependiste del REPL para la entrega, ya diste el salto script vs interactivo.',
        starterCode: {
          language: 'python',
          title: 'hello_sys.py',
          code: `import sys

def main() -> None:
    nombre = "____"  # usa un nombre sintético, no datos reales de terceros
    version = sys.____.split()[0]
    print(f"Hola, soy {nombre}")
    print(f"Python {version}")

# Completa el entrypoint profesional (no dejes el script sin if __name__)
if ____ == "____":
    ____()`
        },
        solutionCode: {
          language: 'python',
          title: 'hello_sys.py',
          code: `import sys

def main() -> None:
    nombre = "Maria Quispe"
    version = sys.version.split()[0]
    print(f"Hola, soy {nombre}")
    print(f"Python {version}")

if __name__ == "__main__":
    main()`,
          output: `Hola, soy Maria Quispe
Python 3.9.6`,
        },
      },
      {
        id: 'S01-T1-A-E3',
        subtopicId: 'S01-T1-A',
        kind: 'transfer',
        instruction:
          'E3 (transferencia) — Diagnóstico: en una laptop Windows el usuario escribe `python --version` y obtiene "no se reconoce como comando". En macOS, `python` falla pero `python3 --version` muestra 3.12.1. Escribe un procedimiento de 4–6 pasos numerados (como comentarios en un .txt o .md) para dejar un intérprete usable y verificable. No inventes instalaciones pirata ni descargas no oficiales.',
        hint: 'En Windows el culpable típico es el PATH o el alias de la Microsoft Store. En macOS/Linux suele bastar usar python3 de forma consistente.',
        hints: [
          'En Windows el culpable típico es el PATH o el alias de la Microsoft Store. En macOS/Linux suele bastar usar python3 de forma consistente.',
          'Cierra y reabre la terminal después de cambiar PATH. Verifica siempre con --version antes de pip install. Fuente oficial: https://www.python.org/downloads/',
        ],
        edgeCases: [
          'Instalar un segundo Python y no saber cuál responde',
          'Usar el alias de Microsoft Store que abre la tienda en lugar del intérprete',
        ],
        tests:
          'Rúbrica: menciona fuente oficial; verifica --version; distingue Windows vs Unix; no recomienda force-push ni desactivar seguridad del SO; 4–6 pasos claros.',
        feedback:
          'Un analista que diagnostica "qué python responde" antes de pedir ayuda en Slack ahorra horas al equipo. Este es el mismo reflejo que usarás con venv y con CI.',
        starterCode: {
          language: 'markdown',
          title: 'diagnostico_interprete.md',
          code: `# Diagnóstico: intérprete no encontrado

## Contexto
- Caso A (Windows): \`python --version\` → no se reconoce
- Caso B (macOS/Linux): \`python\` falla; \`python3 --version\` OK

## Mi procedimiento
1. ____
2. ____
3. ____
4. ____
5. ____ (opcional)
6. ____ (opcional)

## Verificación final
- Comando: ____
- Resultado esperado: Python 3.12+ (o 3.x del curso)`,
        },
        solutionCode: {
          language: 'markdown',
          title: 'diagnostico_interprete.md',
          code: `# Diagnóstico: intérprete no encontrado

## Contexto
- Caso A (Windows): \`python --version\` → no se reconoce
- Caso B (macOS/Linux): \`python\` falla; \`python3 --version\` OK

## Mi procedimiento
1. Confirmar el sistema operativo y abrir una terminal nueva.
2. Probar \`python --version\` y, si falla, \`python3 --version\` y (en Windows) \`py --version\`.
3. Windows: reinstalar desde https://www.python.org/downloads/ marcando "Add python.exe to PATH"; desactivar el alias de Microsoft Store si redirige a la tienda.
4. macOS/Linux: usar \`python3\` de forma consistente o crear un alias documentado en el README del proyecto; no mezclar sin documentar.
5. Cerrar y reabrir la terminal; repetir \`python --version\` o \`python3 --version\`.
6. Solo después de ver 3.x, usar \`python -m pip --version\` (o \`python3 -m pip --version\`).

## Verificación final
- Comando: \`python3 --version\` (o \`python --version\` si ese es el que responde)
- Resultado esperado: una línea \`Python 3.12.x\` (o la 3.x instalada, ≥ 3.10 recomendado para el curso)`,
          output: 'Procedimiento revisable; sin secretos; fuente oficial citada.',
        },
      },
      {
        id: 'S01-T1-B-E1',
        subtopicId: 'S01-T1-B',
        kind: 'guided',
        instruction:
          'E1 (guiado) — Completa el transcript de terminal: ejecuta un Python que sale con 0, otro con 1, y anota `$?` (bash/zsh) o `$LASTEXITCODE` (PowerShell). No subas secretos ni rutas de usuario reales en la entrega.',
        hint: 'Tras cada comando, imprime el código de salida. En bash: echo $?. En PowerShell: echo $LASTEXITCODE.',
        hints: [
          'Tras cada comando, imprime el código de salida. En bash: echo $?. En PowerShell: echo $LASTEXITCODE.',
          'python3 -c "import sys; sys.exit(0)" debe dejar 0; sys.exit(1) debe dejar 1. El mensaje print y el código son independientes.',
        ],
        edgeCases: [
          'Olvidar leer $? y asumir éxito solo porque no hubo traceback visible',
          'En PowerShell usar $? (booleano) en lugar de $LASTEXITCODE (entero del último programa nativo)',
        ],
        tests:
          'Checklist: (1) exit 0 documentado; (2) exit 1 documentado; (3) shell nombrada (bash/zsh/PowerShell); (4) sin PII en rutas.',
        feedback:
          'Si leíste el código de salida dos veces seguidas, ya tienes el hábito que CI usa en cada job. Siguiente: un script que elija 0 o 1 según argumentos.',
        starterCode: {
          language: 'bash',
          title: 'exit_codes_lab.sh (o .ps1 equivalente)',
          code: `# Completa los ____ y ejecuta en tu shell

# 1) Éxito
python3 -c "import sys; print('ok'); sys.exit(____)"
echo "codigo_ok=$____"    # bash/zsh: $?  |  PowerShell: $LASTEXITCODE

# 2) Fallo controlado
python3 -c "import sys; print('fail'); sys.exit(____)"
echo "codigo_fail=$____"

# 3) Anota tu shell: bash | zsh | powershell
# SHELL_USADA=____`,
        },
        solutionCode: {
          language: 'bash',
          title: 'exit_codes_lab.sh',
          code: `python3 -c "import sys; print('ok'); sys.exit(0)"
echo "codigo_ok=$?"
# → codigo_ok=0

python3 -c "import sys; print('fail'); sys.exit(1)"
echo "codigo_fail=$?"
# → codigo_fail=1

# PowerShell equivalente:
# python -c "import sys; print('ok'); sys.exit(0)"
# echo "codigo_ok=$LASTEXITCODE"
# python -c "import sys; print('fail'); sys.exit(1)"
# echo "codigo_fail=$LASTEXITCODE"`,
          output: `ok
codigo_ok=0
fail
codigo_fail=1`,
        },
      },
      {
        id: 'S01-T1-B-E2',
        subtopicId: 'S01-T1-B',
        kind: 'independent',
        instruction:
          'E2 (independiente) — Escribe `check_arg.py`: si recibe exactamente un argumento de línea de comandos, imprime `OK:<arg>` y termina con código 0; si no hay argumentos (o hay más de uno), imprime un mensaje de uso en stderr y termina con código 1. Usa `sys.argv` y `sys.exit`.',
        hint: 'sys.argv[0] es el nombre del script; los argumentos del usuario empiezan en sys.argv[1].',
        hints: [
          'sys.argv[0] es el nombre del script; los argumentos del usuario empiezan en sys.argv[1].',
          'print(..., file=sys.stderr) para el mensaje de error. sys.exit(0) vs sys.exit(1). Prueba: python check_arg.py ok  y  python check_arg.py',
        ],
        edgeCases: [
          'Más de un argumento debe fallar (código 1), no tomar solo el primero en silencio',
          'Argumento vacío "" cuenta como un argumento presente — documenta el comportamiento que elijas',
        ],
        tests:
          'python check_arg.py hola → exit 0 y stdout contiene OK:hola; python check_arg.py → exit 1; python check_arg.py a b → exit 1.',
        feedback:
          'Un entrypoint con códigos de salida predecibles es la base de scripts de intake y de jobs en cron/CI. En S02–S04 reutilizarás este patrón al validar registros de cliente.',
        starterCode: {
          language: 'python',
          title: 'check_arg.py',
          code: `import sys

def main() -> None:
    # sys.argv: [script, arg1, arg2, ...]
    args = sys.argv[1:]
    if ____(args) != ____:
        print("Uso: python check_arg.py <un_valor>", file=sys.____)
        sys.exit(____)
    print(f"OK:{args[0]}")
    sys.exit(____)

if __name__ == "__main__":
    main()`,
        },
        solutionCode: {
          language: 'python',
          title: 'check_arg.py',
          code: `import sys

def main() -> None:
    args = sys.argv[1:]
    if len(args) != 1:
        print("Uso: python check_arg.py <un_valor>", file=sys.stderr)
        sys.exit(1)
    print(f"OK:{args[0]}")
    sys.exit(0)

if __name__ == "__main__":
    main()`,
          output: `$ python check_arg.py hola
OK:hola
$ echo $?
0
$ python check_arg.py
Uso: python check_arg.py <un_valor>
$ echo $?
1`,
        },
      },
      {
        id: 'S01-T1-B-E3',
        subtopicId: 'S01-T1-B',
        kind: 'transfer',
        instruction:
          'E3 (transferencia) — Caso: un colega corre `pip install pandas` y ve error. En un escenario el mensaje es "pip no se reconoce como comando"; en otro, pip corre pero `python -c "import pandas"` falla con ModuleNotFoundError. Clasifica cada escenario (PATH/ejecutable vs intérprete distinto / paquete en otro env) y escribe 3 pasos de verificación por escenario. Entrega en markdown.',
        hint: 'Pregunta siempre: ¿qué ejecutable falló? ¿qué python usa import? Preferir python -m pip para atar pip al mismo intérprete.',
        hints: [
          'Pregunta siempre: ¿qué ejecutable falló? ¿qué python usa import? Preferir python -m pip para atar pip al mismo intérprete.',
          'Escenario A: el shell no encuentra pip → PATH o nombre de comando. Escenario B: pip y python no son la misma instalación → wrong interpreter / venv no activado.',
        ],
        edgeCases: [
          'Múltiples Python instalados (Store + python.org + conda)',
          'venv no activado: pip global vs python del proyecto',
        ],
        tests:
          'Rúbrica: clasifica A vs B; propone python -m pip; verifica --version de python y pip; no inventa reinstalls de SO innecesarios; sin secretos.',
        feedback:
          'Separar "no está en el PATH" de "instalé en otro Python" es el 80% de los tickets de onboarding en equipos de datos. Llévalo a tu checklist del día 1.',
        starterCode: {
          language: 'markdown',
          title: 'diagnostico_pip_vs_path.md',
          code: `# pip falla: ¿PATH o paquete/intérprete?

## Escenario A — "pip no se reconoce como comando"
- Clasificación: ____
- Pasos:
  1. ____
  2. ____
  3. ____

## Escenario B — pip corre, pero import pandas falla
- Clasificación: ____
- Pasos:
  1. ____
  2. ____
  3. ____

## Comando preferido del curso
- ____`,
        },
        solutionCode: {
          language: 'markdown',
          title: 'diagnostico_pip_vs_path.md',
          code: `# pip falla: ¿PATH o paquete/intérprete?

## Escenario A — "pip no se reconoce como comando"
- Clasificación: fallo de PATH / ejecutable no encontrado (la shell no localiza \`pip\`).
- Pasos:
  1. Verificar intérprete: \`python --version\` o \`python3 --version\` (y en Windows \`py --version\`).
  2. Evitar depender de un \`pip\` suelto: usar \`python -m pip --version\` (o \`python3 -m pip --version\`).
  3. Si el intérprete no existe, reparar instalación/PATH (python.org, "Add to PATH"); no es un problema de pandas todavía.

## Escenario B — pip corre, pero import pandas falla
- Clasificación: pip e intérprete no coinciden, o el paquete no está en el entorno activo (venv no activado / otro Python).
- Pasos:
  1. \`python -c "import sys; print(sys.executable)"\` y \`python -m pip --version\` — deben referirse al mismo prefijo.
  2. Reinstalar en ese intérprete: \`python -m pip install pandas\` (con venv activado si el proyecto usa venv).
  3. Reprobar: \`python -c "import pandas; print(pandas.__version__)"\` y confirmar exit code 0.

## Comando preferido del curso
- \`python -m pip install ...\` / \`python -m pip install -r requirements.txt\` (atado al mismo intérprete).`,
          output: 'Clasificación A=PATH; B=intérprete/entorno; verificación con sys.executable.',
        },
      },
      {
        id: 'S01-T2-A-E1',
        subtopicId: 'S01-T2-A',
        kind: 'guided',
        instruction:
          'E1 (guiado) — En una carpeta de práctica, crea un entorno `.venv` con `python -m venv`, actívalo y verifica que `sys.prefix` apunta a esa carpeta. Luego ejecuta `deactivate`.',
        hint: 'Comando de creación: python3 -m venv .venv. Activación Unix: source .venv/bin/activate. Windows: .venv\\Scripts\\Activate.ps1',
        hints: [
          'Comando de creación: python3 -m venv .venv. Activación Unix: source .venv/bin/activate. Windows: .venv\\Scripts\\Activate.ps1',
          'Verifica con: python -c "import sys; print(sys.prefix)" — debe terminar en .venv. which/where python también ayuda.',
        ],
        edgeCases: [
          'PowerShell: política de ejecución puede bloquear Activate.ps1 — usar Set-ExecutionPolicy -Scope CurrentUser RemoteSigned o el activate.bat',
          'Crear .venv fuera del proyecto y olvidar la ruta al activar',
        ],
        tests:
          'Checklist: existe carpeta .venv; tras activate, sys.prefix contiene .venv; tras deactivate, el prefijo ya no es el del proyecto (o el prompt pierde (.venv)).',
        feedback:
          'Si creaste, activaste y desactivaste sin instalar nada global, ya dominas el ciclo de vida mínimo del entorno. Siguiente: recuperarte cuando el entorno se rompe.',
        starterCode: {
          language: 'bash',
          title: 'lab_venv.sh',
          code: `mkdir -p lab_venv_t2a && cd lab_venv_t2a

# 1) Crear
python3 -m venv ____

# 2) Activar (Unix)
source ____/bin/activate
# Windows: .venv\\Scripts\\Activate.ps1

# 3) Verificar
python -c "import sys; print(sys.____)"

# 4) Salir
____`,
        },
        solutionCode: {
          language: 'bash',
          title: 'lab_venv.sh',
          code: `mkdir -p lab_venv_t2a && cd lab_venv_t2a
python3 -m venv .venv
source .venv/bin/activate
python -c "import sys; print(sys.prefix)"
# .../lab_venv_t2a/.venv
deactivate`,
          output: `.../lab_venv_t2a/.venv`,
        },
      },
      {
        id: 'S01-T2-A-E2',
        subtopicId: 'S01-T2-A',
        kind: 'independent',
        instruction:
          'E2 (independiente) — Simula un entorno “roto”: con `.venv` ya creado, borra la carpeta del entorno (o renómbrala) y recrea un `.venv` limpio sin tocar tu código fuente. Documenta los comandos en orden. No uses conda ni reinstales el Python del sistema.',
        hint: 'El código (.py, README) vive fuera de .venv. Borrar .venv no borra tus scripts si están en la raíz del proyecto.',
        hints: [
          'El código (.py, README) vive fuera de .venv. Borrar .venv no borra tus scripts si están en la raíz del proyecto.',
          'rm -rf .venv  (Unix) o Remove-Item -Recurse -Force .venv (PowerShell), luego python3 -m venv .venv y volver a activar.',
        ],
        edgeCases: [
          'Intentar “arreglar” site-packages a mano en lugar de recrear',
          'Estar dentro de .venv/bin al borrar (cd .. primero)',
        ],
        tests:
          'Tras recrear: activate funciona; sys.prefix apunta al nuevo .venv; archivos .py del proyecto siguen existiendo.',
        feedback:
          'Recrear el entorno es la respuesta profesional a un site-packages corrupto. En equipos se dice “borra el venv y reinstala desde requirements” — el hábito empieza aquí (el freeze viene en T2-B).',
        starterCode: {
          language: 'bash',
          title: 'recrear_venv.sh',
          code: `# Supón que ya tienes hello.py en el proyecto y un .venv roto.
# Completa:

# 0) Asegúrate de no estar usando el venv viejo
____ 2>/dev/null || true

# 1) Eliminar entorno roto
____ .venv

# 2) Recrear
python3 -m venv ____

# 3) Activar y verificar
source .venv/bin/activate
python -c "import sys; print(sys.prefix)"
# hello.py u otros .py NO se borran`,
        },
        solutionCode: {
          language: 'bash',
          title: 'recrear_venv.sh',
          code: `deactivate 2>/dev/null || true
rm -rf .venv
# PowerShell: Remove-Item -Recurse -Force .venv
python3 -m venv .venv
source .venv/bin/activate
python -c "import sys; print(sys.prefix)"
ls hello.py 2>/dev/null || echo "(tu código fuente permanece en el proyecto)"`,
          output: `.../proyecto/.venv`,
        },
      },
      {
        id: 'S01-T2-A-E3',
        subtopicId: 'S01-T2-A',
        kind: 'transfer',
        instruction:
          'E3 (transferencia) — Un colega propone instalar pandas con `pip install pandas` en el Python global “para no perder tiempo con venv”. Escribe un párrafo (5–8 oraciones) o un markdown corto que: (1) explique el riesgo con dos proyectos que necesitan versiones distintas; (2) proponga el flujo con `.venv`; (3) mencione que `venv` es stdlib y no requiere descarga extra. Sin afirmaciones salariales.',
        hint: 'Usa el escenario: Proyecto A necesita pandas 1.x; Proyecto B necesita 2.x. Un solo site-packages global no puede satisfacer ambos.',
        hints: [
          'Usa el escenario: Proyecto A necesita pandas 1.x; Proyecto B necesita 2.x. Un solo site-packages global no puede satisfacer ambos.',
          'Cierra con el flujo: python -m venv .venv → activate → python -m pip install ... por proyecto.',
        ],
        edgeCases: [
          'Justificar conda/uv como único camino (válidos, pero no obligatorios en S01)',
          'Recomendar sudo pip install (peor práctica)',
        ],
        tests:
          'Rúbrica: menciona conflicto de versiones; propone .venv o venv por proyecto; no recomienda install global ni sudo; tono profesional en español.',
        feedback:
          'Saber argumentar el aislamiento de dependencias es parte del onboarding: no solo “cómo”, sino “por qué no lo hacemos global”.',
        starterCode: {
          language: 'markdown',
          title: 'por_que_venv.md',
          code: `# ¿Por qué no instalar pandas en el Python global?

## Escenario de conflicto
____

## Flujo recomendado (este curso)
1. ____
2. ____
3. ____

## Nota sobre la herramienta
- venv es ____ (stdlib / terceros)
- Nombre canónico de carpeta: ____`,
        },
        solutionCode: {
          language: 'markdown',
          title: 'por_que_venv.md',
          code: `# ¿Por qué no instalar pandas en el Python global?

## Escenario de conflicto
El Proyecto A (reporte legacy) necesita una API de pandas 1.x. El Proyecto B (pipeline nuevo) necesita pandas 2.x. Si ambos instalan en el mismo site-packages global, actualizar B rompe A (o al revés). El error aparece semanas después y parece “de código”, pero es de entorno.

## Flujo recomendado (este curso)
1. En cada repo: \`python3 -m venv .venv\` y activar.
2. Instalar solo ahí: \`python -m pip install ...\` / \`-r requirements.txt\`.
3. Si el entorno se rompe: borrar \`.venv\` y recrearlo; el código fuente no se toca.

## Nota sobre la herramienta
- venv es **stdlib** (viene con Python; no requiere descarga extra como gestor aparte).
- Nombre canónico de carpeta en este curso: **\`.venv\`** (\`venv\` es alias aceptado).
- conda/uv existen y son útiles en otros contextos; aquí el default es venv por portabilidad en onboarding.`,
          output: 'Argumento de aislamiento con escenario de dos versiones; flujo .venv claro.',
        },
      },
      {
        id: 'S01-T2-B-E1',
        subtopicId: 'S01-T2-B',
        kind: 'guided',
        instruction:
          'E1 (guiado) — Con `.venv` activado, instala un paquete de terceros pinneado (ej. `requests==2.32.3`), genera `requirements.txt` con freeze y verifica que el archivo contiene `paquete==versión`. No uses el Python global.',
        hint: 'Siempre: python -m pip install ... y python -m pip freeze > requirements.txt',
        hints: [
          'Siempre: python -m pip install ... y python -m pip freeze > requirements.txt',
          'Si freeze lista paquetes del sistema y no del proyecto, no activaste el venv. Revisa sys.prefix antes de freeze.',
        ],
        edgeCases: [
          'freeze sin activar venv → snapshot del entorno equivocado',
          'Usar pip suelto que apunta a otro intérprete',
        ],
        tests:
          'requirements.txt existe; contiene al menos una línea name==version del paquete instalado; no incluye secretos ni rutas absolutas de usuario.',
        feedback:
          'Si el freeze refleja solo tu venv de proyecto, ya tienes el hábito de snapshot. Siguiente: instalar desde -r en limpio.',
        starterCode: {
          language: 'bash',
          title: 'lab_freeze.sh',
          code: `source .venv/bin/activate   # o Activate.ps1 en Windows

python -m pip install requests==____
python -m ____ freeze > ____.txt

# Verifica:
grep -i "requests==" requirements.txt
python -c "import requests; print(requests.____)"`,
        },
        solutionCode: {
          language: 'bash',
          title: 'lab_freeze.sh',
          code: `source .venv/bin/activate
python -m pip install requests==2.32.3
python -m pip freeze > requirements.txt
grep -i "requests==" requirements.txt
python -c "import requests; print(requests.__version__)"`,
          output: `requests==2.32.3
2.32.3`,
        },
      },
      {
        id: 'S01-T2-B-E2',
        subtopicId: 'S01-T2-B',
        kind: 'independent',
        instruction:
          'E2 (independiente) — Dado un `requirements.txt` de plantilla (puede ser el de E1), crea un **segundo** entorno limpio (`.venv_replica` o borra y recrea `.venv`), actívalo e instala con `python -m pip install -r requirements.txt`. Confirma con `pip list` o un import que el paquete está presente.',
        hint: 'No copies site-packages a mano. El contrato es el archivo -r.',
        hints: [
          'No copies site-packages a mano. El contrato es el archivo -r.',
          'python3 -m venv .venv_replica && source .venv_replica/bin/activate && python -m pip install -r requirements.txt',
        ],
        edgeCases: [
          'requirements.txt vacío → install -r no instala terceros (comportamiento esperado)',
          'Olvidar activar el env limpio y “verificar” en el viejo',
        ],
        tests:
          'En el env limpio: import del paquete pinneado exitoso; versión alineada con requirements.txt.',
        feedback:
          'Replicar desde -r es exactamente lo que hará un colega o CI. Si funciona en limpio, tu snapshot es útil.',
        starterCode: {
          language: 'bash',
          title: 'lab_install_r.sh',
          code: `# Parte de un requirements.txt existente en la raíz
python3 -m venv .venv_replica
source .venv_replica/bin/activate
python -m pip install -r ____
python -m pip list | head
python -c "import requests; print('ok', requests.__version__)"`,
        },
        solutionCode: {
          language: 'bash',
          title: 'lab_install_r.sh',
          code: `python3 -m venv .venv_replica
source .venv_replica/bin/activate
python -m pip install -r requirements.txt
python -c "import requests; print('ok', requests.__version__)"`,
          output: `ok 2.32.3`,
        },
      },
      {
        id: 'S01-T2-B-E3',
        subtopicId: 'S01-T2-B',
        kind: 'transfer',
        instruction:
          'E3 (transferencia) — Forense ModuleNotFoundError: el usuario corre `python -c "import requests"` y falla. En un caso, nunca instaló el paquete; en otro, lo instaló con un `pip` de otro Python. Escribe un protocolo de 5 pasos en markdown que use `sys.executable`, `python -m pip`, y distinga stdlib vs terceros. Sin reinstalls de SO innecesarios.',
        hint: 'Primero identifica el intérprete; luego pregunta si el módulo es stdlib; luego instala con python -m pip en ese intérprete/venv.',
        hints: [
          'Primero identifica el intérprete; luego pregunta si el módulo es stdlib; luego instala con python -m pip en ese intérprete/venv.',
          'requests es de terceros; sys/datetime no. Si pip list muestra el paquete pero import falla, casi seguro hay dos Pythons.',
        ],
        edgeCases: [
          'Paquete instalado en global y script corrido con venv vacío',
          'Confundir ModuleNotFoundError con error de red al pip install',
        ],
        tests:
          'Rúbrica: usa sys.executable; recomienda python -m pip; clasifica stdlib vs terceros; contempla wrong interpreter; sin secretos.',
        feedback:
          'Este protocolo es el mismo que usarás cuando pandas “desaparece” tras cambiar de terminal o de IDE.',
        starterCode: {
          language: 'markdown',
          title: 'forense_modulenotfound.md',
          code: `# Forense ModuleNotFoundError

## Hipótesis A — nunca instalado
____

## Hipótesis B — instalado en otro intérprete
____

## Protocolo (5 pasos)
1. ____
2. ____
3. ____
4. ____
5. ____

## ¿stdlib o terceros?
- requests: ____
- datetime: ____`,
        },
        solutionCode: {
          language: 'markdown',
          title: 'forense_modulenotfound.md',
          code: `# Forense ModuleNotFoundError

## Hipótesis A — nunca instalado
El módulo de terceros no está en el site-packages del intérprete actual.

## Hipótesis B — instalado en otro intérprete
\`pip\` (u otro Python) instaló el paquete en un prefijo distinto al de \`python\` que ejecuta el import.

## Protocolo (5 pasos)
1. \`python -c "import sys; print(sys.executable); print(sys.prefix)"\`
2. Confirmar si el módulo es stdlib (no pip) o terceros (sí pip).
3. \`python -m pip show requests\` (o el paquete) con **el mismo** python.
4. Si falta: activar \`.venv\` del proyecto y \`python -m pip install ...\` o \`-r requirements.txt\`.
5. Reprobar import y anotar versión; no reinstalar el SO.

## ¿stdlib o terceros?
- requests: **terceros** (requiere pip)
- datetime: **stdlib** (no va en requirements.txt)`,
          output: 'Protocolo atado a sys.executable + python -m pip.',
        },
      },
      {
        id: 'S01-T3-A-E1',
        subtopicId: 'S01-T3-A',
        kind: 'guided',
        instruction:
          'E1 (guiado) — En una carpeta de práctica: `git init`, crea un archivo, haz un commit con mensaje Conventional Commits (`docs:` o `feat:`). Verifica con `git log -1`. No uses mensajes vacíos ni “wip”.',
        hint: 'git add <archivo> && git commit -m "docs: ..." — el prefijo va en minúsculas seguido de dos puntos y espacio.',
        hints: [
          'git add <archivo> && git commit -m "docs: ..." — el prefijo va en minúsculas seguido de dos puntos y espacio.',
          'Si Git pide identidad: git config user.email y user.name (en el repo con --local si no quieres global).',
        ],
        edgeCases: [
          'commit sin add → “nothing to commit”',
          'mensaje vacío rechazado o inútil',
        ],
        tests:
          'git log -1 --pretty=%s coincide con patrón ^(feat|fix|docs|chore|refactor|test): .+',
        feedback:
          'Un solo commit bien nombrado ya es más profesional que diez “cambios”. Siguiente: leer el diff.',
        starterCode: {
          language: 'bash',
          title: 'lab_commit.sh',
          code: `mkdir -p lab_git_t3a && cd lab_git_t3a
git init
echo "# lab" > README.md
git ____ README.md
git commit -m "____: agregar README de practica"
git log -1 --oneline`,
        },
        solutionCode: {
          language: 'bash',
          title: 'lab_commit.sh',
          code: `mkdir -p lab_git_t3a && cd lab_git_t3a
git init
echo "# lab" > README.md
git add README.md
git commit -m "docs: agregar README de practica"
git log -1 --oneline`,
          output: `abc1234 docs: agregar README de practica`,
        },
      },
      {
        id: 'S01-T3-A-E2',
        subtopicId: 'S01-T3-A',
        kind: 'independent',
        instruction:
          'E2 (independiente) — Modifica un README ya commiteado (agrega una línea), haz commit, y responde en un markdown corto: (1) qué muestra `git show HEAD` en líneas `+`; (2) diferencia entre archivo nuevo vs modificado; (3) una frase de qué cambió el commit.',
        hint: 'Tras el segundo commit, git show HEAD sin pager: GIT_PAGER=cat git show HEAD',
        hints: [
          'Tras el segundo commit, git show HEAD sin pager: GIT_PAGER=cat git show HEAD',
          'Archivo nuevo: todo el contenido aparece con +. Modificado: solo las líneas tocadas con +/−.',
        ],
        edgeCases: [
          'Mirar git diff después del commit (vacío) en lugar de git show',
          'No stagear y creer que el commit incluye el cambio',
        ],
        tests:
          'Markdown responde las 3 preguntas; menciona +/−; commit existe en log.',
        feedback:
          'Leer diffs es la mitad del trabajo en code review. Si narras el cambio en una frase, ya redactas un buen cuerpo de PR.',
        starterCode: {
          language: 'markdown',
          title: 'lectura_diff.md',
          code: `# Lectura de diff

## Comandos usados
____

## 1) ¿Qué líneas aparecen con + en git show HEAD?
____

## 2) ¿Archivo nuevo o modificado? ¿Cómo se nota?
____

## 3) Resumen en una frase
____`,
        },
        solutionCode: {
          language: 'markdown',
          title: 'lectura_diff.md',
          code: `# Lectura de diff

## Comandos usados
\`echo "Setup con venv." >> README.md && git add README.md && git commit -m "docs: documentar venv" && git show HEAD\`

## 1) ¿Qué líneas aparecen con + en git show HEAD?
Las líneas añadidas al README (p. ej. \`+Setup con venv.\`).

## 2) ¿Archivo nuevo o modificado? ¿Cómo se nota?
Modificado: el header del diff muestra el path existente y un conteo pequeño de inserciones; no es un "new file mode" con todo el contenido en +.

## 3) Resumen en una frase
El commit documenta en el README que el setup usa venv.`,
          output: 'Respuestas alineadas a un git show real.',
        },
      },
      {
        id: 'S01-T3-A-E3',
        subtopicId: 'S01-T3-A',
        kind: 'transfer',
        instruction:
          'E3 (transferencia) — Te entregan tres mensajes candidatos para el mismo cambio (añadir `scripts/hello_env.py` que imprime la versión de Python): (A) `wip`, (B) `feat: agregar smoke hello_env`, (C) `Actualicé cosas del setup`. Elige el mejor, justifica en 3–5 oraciones y reescribe los otros dos al estilo Conventional Commits si fueran otros cambios plausibles.',
        hint: 'El mejor es claro, con prefijo de tipo y descripción imperativa del *porqué/qué* observable.',
        hints: [
          'El mejor es claro, con prefijo de tipo y descripción imperativa del *porqué/qué* observable.',
          'wip no es aceptable en main; “Actualicé cosas” no dice qué archivo ni qué valor aporta.',
        ],
        edgeCases: [
          'Elegir wip por “es honesto” (honesto pero inútil en historial)',
          'Prefijos inventados no estándar como update:',
        ],
        tests:
          'Elige B; justificación menciona legibilidad/historial; reescrituras usan feat/docs/fix/chore válidos.',
        feedback:
          'Elegir mensajes es diseño de comunicación del equipo. El historial es documentación ejecutable.',
        starterCode: {
          language: 'markdown',
          title: 'mejor_mensaje.md',
          code: `# Mejor mensaje de commit

Candidatos:
- A: \`wip\`
- B: \`feat: agregar smoke hello_env\`
- C: \`Actualicé cosas del setup\`

## Elección
____

## Justificación
____

## Reescritura de A (si fuera un commit temporal local que luego se limpia)
____

## Reescritura de C
____`,
        },
        solutionCode: {
          language: 'markdown',
          title: 'mejor_mensaje.md',
          code: `# Mejor mensaje de commit

## Elección
**B** — \`feat: agregar smoke hello_env\`

## Justificación
Informa el tipo (nueva capacidad), el artefacto y el propósito (smoke). Un colega en \`git log\` entiende el cambio sin abrir el diff. A no aporta contexto; C es vago y no usa Conventional Commits.

## Reescritura de A
\`chore: guardar progreso local de hello_env\` (solo en rama personal; preferible no pushear wip a main).

## Reescritura de C
\`docs: aclarar pasos de setup en README\` o \`feat: agregar smoke hello_env\` según el diff real.`,
          output: 'B correcto; A/C reescritos con prefijos útiles.',
        },
      },
      {
        id: 'S01-T3-B-E1',
        subtopicId: 'S01-T3-B',
        kind: 'guided',
        instruction:
          'E1 (guiado) — Desde un repo con al menos un commit en `main`, crea la rama `feat/practica-s01`, añade un archivo pequeño, commit con `feat:` y lista las ramas. No hagas force-push. Si no tienes remote, basta el flujo local.',
        hint: 'git switch -c feat/practica-s01  (equivalente moderno a checkout -b)',
        hints: [
          'git switch -c feat/practica-s01  (equivalente moderno a checkout -b)',
          'git branch debe mostrar * feat/practica-s01. El commit debe vivir en esa rama, no solo en main.',
        ],
        edgeCases: [
          'Crear archivos en main por error sin switch',
          'Usar espacios en el nombre de rama',
        ],
        tests:
          'branch feat/practica-s01 existe; HEAD en esa rama; log -1 con prefijo feat:',
        feedback:
          'Si el commit quedó en la feature branch, ya separas trabajo en curso de main. Siguiente: narrar el PR.',
        starterCode: {
          language: 'bash',
          title: 'lab_branch.sh',
          code: `git switch main
git switch -c ____/practica-s01
echo "ok" > nota.txt
git add nota.txt
git commit -m "____: agregar nota de practica"
git branch`,
        },
        solutionCode: {
          language: 'bash',
          title: 'lab_branch.sh',
          code: `git switch main
git switch -c feat/practica-s01
echo "ok" > nota.txt
git add nota.txt
git commit -m "feat: agregar nota de practica"
git branch`,
          output: `* feat/practica-s01
  main`,
        },
      },
      {
        id: 'S01-T3-B-E2',
        subtopicId: 'S01-T3-B',
        kind: 'independent',
        instruction:
          'E2 (independiente) — Redacta la descripción de un Pull Request (markdown) para una rama que agrega `scripts/hello_env.py` y actualiza el README de instalación. Incluye: título, resumen (3 bullets), plan de prueba, y checklist de seguridad (sin secretos). No hace falta abrir el PR real si no tienes remote; entrega el archivo.',
        hint: 'Título al estilo Conventional Commits; cuerpo orientado al revisor, no a ti.',
        hints: [
          'Título al estilo Conventional Commits; cuerpo orientado al revisor, no a ti.',
          'Plan de prueba: comandos concretos (venv, install -r, python scripts/hello_env.py).',
        ],
        edgeCases: [
          'PR vacío (“ver commits”) sin bullets',
          'Incluir tokens o rutas con datos personales',
        ],
        tests:
          'Archivo con título, ≥3 bullets, pasos de prueba, mención de .env/secretos; sin PII real.',
        feedback:
          'Una buena descripción de PR reduce ida y vuelta en review y documenta el “por qué” que el diff no cuenta solo.',
        starterCode: {
          language: 'markdown',
          title: 'pr_hello_env.md',
          code: `# Título del PR
____

## Resumen
- ____
- ____
- ____

## Plan de prueba
1. ____
2. ____
3. ____

## Seguridad
- [ ] No incluye \`.env\` ni secretos
- [ ] ____`,
        },
        solutionCode: {
          language: 'markdown',
          title: 'pr_hello_env.md',
          code: `# Título del PR
feat: agregar smoke hello_env y documentar install

## Resumen
- Agrega \`scripts/hello_env.py\` como smoke del entorno
- Documenta en README: venv, activate, pip install -r
- Prepara el esqueleto CP-N1-A para S02–S04

## Plan de prueba
1. \`python -m venv .venv\` && activate
2. \`python -m pip install -r requirements.txt\`
3. \`python scripts/hello_env.py\` → exit 0

## Seguridad
- [x] No incluye \`.env\` ni secretos
- [x] Solo datos sintéticos si hay CSV de ejemplo
- [x] \`.gitignore\` cubre \`.venv/\`, \`venv/\`, \`.env\``,
          output: 'PR listo para copiar a GitHub.',
        },
      },
      {
        id: 'S01-T3-B-E3',
        subtopicId: 'S01-T3-B',
        kind: 'transfer',
        instruction:
          'E3 (transferencia) — Escenario: editaste `README.md` sin commit y el cambio está mal. Un colega te dice “usa `reset --hard`” y otro “`push --force` a main”. Escribe el procedimiento correcto con `git restore` (y cuándo usarías `stash` en su lugar). Explica por qué force-push a main no es opción. Entrega en markdown.',
        hint: 'restore descarta cambios no deseados en working tree; stash guarda para después. Ninguno reescribe main remoto.',
        hints: [
          'restore descarta cambios no deseados en working tree; stash guarda para después. Ninguno reescribe main remoto.',
          'reset --hard borra trabajo no commiteado sin red de seguridad; no es el default de este curso.',
        ],
        edgeCases: [
          'Archivo ya staged: puede hacer falta git restore --staged y luego restore',
          'Confundir restore con revert (revert es para commits ya hechos)',
        ],
        tests:
          'Menciona git restore; menciona stash como alternativa de guardado; prohíbe force-push a main; no recomienda reset --hard como primera opción.',
        feedback:
          'La recuperación no destructiva es parte de la cultura de equipo. Quien no destruye historial ajeno genera confianza.',
        starterCode: {
          language: 'markdown',
          title: 'recuperacion_segura.md',
          code: `# Recuperación no destructiva

## Situación
README.md modificado, sin commit, cambio indeseado.

## Procedimiento con restore
1. ____
2. ____

## ¿Cuándo stash en su lugar?
____

## Por qué NO force-push a main
____

## Por qué no reset --hard como default
____`,
        },
        solutionCode: {
          language: 'markdown',
          title: 'recuperacion_segura.md',
          code: `# Recuperación no destructiva

## Situación
README.md modificado, sin commit, cambio indeseado.

## Procedimiento con restore
1. \`git status\` para confirmar que el cambio es solo local y no commiteado.
2. \`git restore README.md\` para volver al último contenido commiteado (si estaba staged: \`git restore --staged README.md\` y luego \`git restore README.md\`).

## ¿Cuándo stash en su lugar?
Si *podrías* querer el cambio después: \`git stash push -m "wip readme"\` y más tarde \`git stash pop\`.

## Por qué NO force-push a main
Reescribe historial compartido y puede borrar commits de otras personas. El rechazo de un push se resuelve con pull/rebase en tu rama o con PR, no con force a main.

## Por qué no reset --hard como default
Borra cambios no commiteados de forma fácil de lamentar. Primero restore/stash; hard solo con conciencia y backup.`,
          output: 'restore/stash primero; force-push a main prohibido.',
        },
      },
      {
        id: 'S01-T4-A-E1',
        subtopicId: 'S01-T4-A',
        kind: 'guided',
        instruction:
          'E1 (guiado) — Completa un `pyproject.toml` mínimo con `[tool.ruff]` (line-length 88, target-version) y `[tool.ruff.lint] select = ["E", "F", "I"]`. No hace falta publicar en PyPI; solo config local.',
        hint: 'TOML usa secciones entre corchetes y listas con corchetes para select.',
        hints: [
          'TOML usa secciones entre corchetes y listas con corchetes para select.',
          'target-version como "py312" (string). line-length es número sin comillas.',
        ],
        edgeCases: [
          'Poner la config bajo [tool.black] por error',
          'select = "E,F,I" como string en lugar de lista',
        ],
        tests:
          'Archivo contiene [tool.ruff], line-length = 88, select con E F I.',
        feedback:
          'Con la config en el repo, el linter deja de ser “gusto personal del IDE” y pasa a ser contrato del proyecto.',
        starterCode: {
          language: 'toml',
          title: 'pyproject.toml',
          code: `[tool.____]
line-length = ____
target-version = "py312"

[tool.ruff.lint]
select = ["____", "____", "____"]`,
        },
        solutionCode: {
          language: 'toml',
          title: 'pyproject.toml',
          code: `[tool.ruff]
line-length = 88
target-version = "py312"

[tool.ruff.lint]
select = ["E", "F", "I"]`,
          output: 'Config mínima válida para ruff check.',
        },
      },
      {
        id: 'S01-T4-A-E2',
        subtopicId: 'S01-T4-A',
        kind: 'independent',
        instruction:
          'E2 (independiente) — Dado un script con imports sin usar, instala `ruff` en el venv, corre `python -m ruff check` y corrige hasta exit 0. Entrega el script limpio (sin imports muertos).',
        hint: 'F401 = imported but unused. La corrección habitual es borrar el import.',
        hints: [
          'F401 = imported but unused. La corrección habitual es borrar el import.',
          'python -m pip install ruff && python -m ruff check archivo.py',
        ],
        edgeCases: [
          'Usar noqa en S01 sin justificación (preferir borrar import)',
          'Formatear solo con format y no corregir F401 de check',
        ],
        tests:
          'ruff check sobre el archivo final exit 0; el script sigue siendo válido Python.',
        feedback:
          'Cerrar el ciclo check → fix es el mismo músculo que usarás cuando CI falle por lint en un PR.',
        starterCode: {
          language: 'python',
          title: 'hello_lint.py',
          code: `import sys
import os
from datetime import datetime

def main() -> None:
    print("hola")
    print(datetime.now().date())

if __name__ == "__main__":
    main()

# Tarea del estudiante: ruff check → quitar imports sin usar (sys, os)`,
        },
        solutionCode: {
          language: 'python',
          title: 'hello_lint.py',
          code: `from datetime import datetime

def main() -> None:
    print("hola")
    print(datetime.now().date())

if __name__ == "__main__":
    main()`,
          output: `All checks passed!`,
        },
      },
      {
        id: 'S01-T4-A-E3',
        subtopicId: 'S01-T4-A',
        kind: 'transfer',
        instruction:
          'E3 (transferencia) — Un lead propone `select = ["ALL"]` el día 1 en un repo de analytics con notebooks. Justifica por escrito un `select` mínimo (E/F/I u otro set pequeño) para S01: qué ganas, qué ruido evitas, y cuándo ampliarías reglas. 1 página corta en markdown.',
        hint: 'ALL genera cientos de hallazgos; el equipo deja de mirar el linter. Empieza por errores reales (F) y estilo básico (E/I).',
        hints: [
          'ALL genera cientos de hallazgos; el equipo deja de mirar el linter. Empieza por errores reales (F) y estilo básico (E/I).',
          'Ampliar cuando el check limpio en E/F/I ya es hábito y hay acuerdo de equipo.',
        ],
        edgeCases: [
          'Copiar configs de backends web sin adaptar a scripts de datos',
          'Desactivar el linter por completo',
        ],
        tests:
          'Propone set acotado; argumenta ruido vs señal; plan de ampliación; tono profesional.',
        feedback:
          'Gobernar la calidad es priorizar señales. Un linter respetado vale más que uno “perfecto” ignorado.',
        starterCode: {
          language: 'markdown',
          title: 'ruff_select_minimo.md',
          code: `# Select mínimo para repo de datos (S01)

## Propuesta
\`select = [____]\`

## Por qué no ALL el día 1
____

## Qué cubren E, F, I
____

## Cuándo ampliar
____`,
        },
        solutionCode: {
          language: 'markdown',
          title: 'ruff_select_minimo.md',
          code: `# Select mínimo para repo de datos (S01)

## Propuesta
\`select = ["E", "F", "I"]\` con \`line-length = 88\`.

## Por qué no ALL el día 1
ALL enciende decenas de reglas (complejidad, opiniones de estilo avanzadas, plugins). En un repo nuevo con notebooks y scripts, el ruido entierra los hallazgos útiles y el equipo aprende a ignorar CI.

## Qué cubren E, F, I
- **F (pyflakes):** imports sin usar, nombres indefinidos — bugs baratos.
- **E (pycodestyle errores):** problemas claros de estilo/sintaxis básica.
- **I (isort):** orden de imports reproducible en review.

## Cuándo ampliar
Cuando E/F/I pasan en verde de forma habitual y el equipo acuerda reglas extra (p. ej. bugbear) con un PR de adopción, no por sorpresa en main.`,
          output: 'Mínimo defendible; plan de ampliación.',
        },
      },
      {
        id: 'S01-T4-B-E1',
        subtopicId: 'S01-T4-B',
        kind: 'guided',
        instruction:
          'E1 (guiado) — Completa un `.gitignore` mínimo de Python/data que incluya `.venv/`, `venv/`, `__pycache__/`, `*.pyc`, `.env` e ipynb checkpoints. Verifica con `git check-ignore -v .env` en un repo de prueba.',
        hint: 'Una entrada por línea. Las barras finales marcan directorios.',
        hints: [
          'Una entrada por línea. Las barras finales marcan directorios.',
          'Incluye AMBOS: .venv/ y venv/. Si .env ya estaba trackeado, git rm --cached .env tras el ignore.',
        ],
        edgeCases: [
          'Archivo ya trackeado: ignore no lo saca solo',
          'Olvidar .venv/ y solo poner venv/ (o al revés)',
        ],
        tests:
          'git check-ignore -v .env exit 0; check-ignore aplica a .venv o ruta de entorno.',
        feedback:
          'Un ignore correcto evita el push de 200MB de site-packages y de secretos. Es higiene, no opcional.',
        starterCode: {
          language: 'gitignore',
          title: '.gitignore',
          code: `# Entornos
____/
____/

# Bytecode
____/
____

# Secretos
____

# Jupyter
.ipynb_checkpoints/`,
        },
        solutionCode: {
          language: 'gitignore',
          title: '.gitignore',
          code: `# Entornos
.venv/
venv/

# Bytecode
__pycache__/
*.pyc

# Secretos
.env

# Jupyter
.ipynb_checkpoints/`,
          output: `git check-ignore -v .env
.gitignore:8:.env    .env`,
        },
      },
      {
        id: 'S01-T4-B-E2',
        subtopicId: 'S01-T4-B',
        kind: 'independent',
        instruction:
          'E2 (independiente) — Crea `.env.example` con al menos 3 claves de un proyecto de intake (ej. `API_URL`, `DB_HOST`, `LOG_LEVEL`) con valores vacíos o ficticios no sensibles. Confirma que `.env` real no se commitea. Nunca copies tokens reales.',
        hint: 'Clave=valor; el valor en example es placeholder. El .env local puede tener secretos pero queda ignorado.',
        hints: [
          'Clave=valor; el valor en example es placeholder. El .env local puede tener secretos pero queda ignorado.',
          'Patrones prohibidos en example: sk-..., passwords reales, connection strings con password.',
        ],
        edgeCases: [
          'Subir .env “solo un momentito”',
          'Poner el secreto en README “para que funcione”',
        ],
        tests:
          'Archivo tiene ≥3 KEY=; sin patrones obvios de secreto; .env en gitignore.',
        feedback:
          'El example es el contrato de configuración. El secreto vive solo en la máquina o en un gestor de secretos del equipo.',
        starterCode: {
          language: 'bash',
          title: '.env.example',
          code: `# Copia a .env y completa valores locales (nunca commitees .env)
API_URL=
DB_HOST=
LOG_LEVEL=
# TODO: añade solo placeholders`,
        },
        solutionCode: {
          language: 'bash',
          title: '.env.example',
          code: `# Copia a .env y completa valores locales (nunca commitees .env)
API_URL=https://example.com/api
DB_HOST=localhost
LOG_LEVEL=INFO
# Sin passwords ni tokens reales`,
          output: 'Trackeable; sin secretos.',
        },
      },
      {
        id: 'S01-T4-B-E3',
        subtopicId: 'S01-T4-B',
        kind: 'transfer',
        instruction:
          'E3 (transferencia) — Checklist de “máquina limpia” para el esqueleto CP-N1-A: escribe 5 ítems verificables (clon → venv → install -r → smoke → ignore de .env) que un revisor pueda tildar. Incluye mención a data dictionary + dataset sintético. Markdown.',
        hint: 'Cada ítem debe ser observable (comando + resultado esperado), no “que se vea bonito”.',
        hints: [
          'Cada ítem debe ser observable (comando + resultado esperado), no “que se vea bonito”.',
          'Incluye: git check-ignore .env; python scripts/hello_env.py exit 0; existencia de data/data_dictionary.md.',
        ],
        edgeCases: [
          'Checklist que asume paths de tu laptop (Users/tu_nombre)',
          'Olvidar responsible_use (PII real)',
        ],
        tests:
          '≥5 ítems; comandos concretos; menciona datos sintéticos/diccionario; sin secretos.',
        feedback:
          'Si un revisor puede clonar y pasar el checklist en 10 minutos, tu repo es profesional. Eso es el listón de S01.',
        starterCode: {
          language: 'markdown',
          title: 'checklist_maquina_limpia.md',
          code: `# Checklist máquina limpia — esqueleto CP-N1-A

- [ ] 1. ____
- [ ] 2. ____
- [ ] 3. ____
- [ ] 4. ____
- [ ] 5. ____

## Datos
- [ ] data/clients_synthetic.csv es sintético
- [ ] data/data_dictionary.md describe columnas
`,
        },
        solutionCode: {
          language: 'markdown',
          title: 'checklist_maquina_limpia.md',
          code: `# Checklist máquina limpia — esqueleto CP-N1-A

- [ ] 1. \`git clone <url> && cd python-ds-journey\` completa sin error
- [ ] 2. \`python -m venv .venv\` + activate; \`python -c "import sys; print(sys.prefix)"\` contiene \`.venv\`
- [ ] 3. \`python -m pip install -r requirements.txt\` exit 0
- [ ] 4. \`python scripts/hello_env.py\` exit 0
- [ ] 5. \`git check-ignore -v .env\` confirma ignore; \`.env.example\` está trackeado

## Datos
- [ ] \`data/clients_synthetic.csv\` es sintético (sin PII real)
- [ ] \`data/data_dictionary.md\` describe cada columna del CSV
- [ ] README menciona esqueleto CP-N1-A e instrucciones install/run`,
          output: '5+ ítems observables para review.',
        },
      },
    ],
  },
  youDo: {
    title: 'Esqueleto CP-N1-A — Reproducible Client Intake Repo',
    context:
      'Este You Do es el **primer incremento del capstone CP-N1-A** (Client Intake & Data Quality Script), que se cierra formalmente en S04. En S01 no construyes aún el validador completo: dejas un **repo clonable** con entorno reproducible, higiene Git, calidad mínima (Ruff), datos **sintéticos** y diccionario de datos. S02–S04 montarán el script de intake sobre este esqueleto. El repo puede llamarse `python-ds-journey` o similar; lo importante es la estructura y que un compañero arranque en minutos.',
    objectives: [
      'Publicar un repo clonable con `.gitignore` (`.venv/` y `venv/`), `.env.example`, `requirements.txt` y `pyproject.toml` (Ruff)',
      'Documentar en README install/run y la frase “esqueleto de CP-N1-A”',
      'Incluir `data/clients_synthetic.csv` (sintético) + `data/data_dictionary.md`',
      'Smoke `scripts/hello_env.py` con exit 0; mínimo 3 commits Conventional Commits y 1 rama feature (merge o PR abierto)',
    ],
    requirements: [
      'Repo público accesible (GitHub u otro remoto del curso)',
      '.gitignore excluye: .venv/, venv/, __pycache__/, *.pyc, .env, .ipynb_checkpoints/',
      '.env.example trackeado sin secretos; .env nunca en el historial de la entrega',
      'requirements.txt pinneado (python -m pip freeze) usable con install -r',
      'pyproject.toml con [tool.ruff] mínimo; ruff check limpio en scripts/hello_env.py',
      'README: título, descripción, install (venv + pip -r), uso, mención esqueleto CP-N1-A, nota de seguridad',
      'data/clients_synthetic.csv + data/data_dictionary.md (columnas del CSV; PII falsa)',
      'scripts/hello_env.py con if __name__ == "__main__" y exit 0',
      '≥3 commits Conventional Commits; 1 rama feat/* con PR o merge documentado',
    ],
    starterCode: `# Estructura esperada (esqueleto CP-N1-A):
# python-ds-journey/
# ├── .gitignore
# ├── .env.example
# ├── README.md
# ├── requirements.txt
# ├── pyproject.toml
# ├── data/
# │   ├── clients_synthetic.csv
# │   └── data_dictionary.md
# ├── scripts/
# │   └── hello_env.py
# └── section_01/          # opcional: notas de la sección
#
# scripts/hello_env.py — smoke del entorno
import sys

def main() -> None:
    print(f"Python {sys.version.split()[0]}")
    print("CP-N1-A skeleton OK")

if __name__ == "__main__":
    main()
`,
    portfolioNote:
      'Este repositorio es la base de tu portafolio de Nivel 1. Cuando llegues al gate de S04 (CP-N1-A completo), el revisor valorará que el esqueleto de S01 ya era clonable, sin secretos y con datos sintéticos. Cada sección suma evidencia; no reinicies el repo desde cero sin necesidad.',
    rubric: [
      { criterion: 'Correctness — clone + venv + install -r + hello_env exit 0', weight: '30%' },
      { criterion: 'Robustness — README sirve en Windows y Unix (comandos de activate)', weight: '15%' },
      { criterion: 'Maintainability — commits Conventional Commits, estructura clara, Ruff config', weight: '25%' },
      { criterion: 'Responsible use — .env ignorado, .env.example sin secretos, datos sintéticos + diccionario', weight: '20%' },
      { criterion: 'Git flow — rama feature y PR o merge documentado', weight: '10%' },
    ],
  },
  selfCheck: {
    questions: [
      {
        question: '¿Para qué sirve un entorno virtual (venv) en Python?',
        options: [
          'Para acelerar la ejecución del código Python',
          'Para aislar las dependencias (paquetes) por proyecto y evitar conflictos de versiones',
          'Para conectarse a internet más rápido al instalar paquetes',
          'Para compilar Python a código de máquina más eficiente',
        ],
        correctIndex: 1,
        explanation:
          'venv crea una carpeta con su propia instalación de Python y paquetes. Esto evita que actualizar pandas en un proyecto rompa otro proyecto que depende de una versión anterior.',
      },
      {
        question: '¿Cuál de los siguientes archivos SÍ debería estar en tu .gitignore?',
        options: [
          'requirements.txt',
          'README.md',
          '.venv/ (o venv/)',
          'hello.py',
        ],
        correctIndex: 2,
        explanation:
          '`.venv/` y `venv/` pesan 100MB+ y se regeneran con `python -m pip install -r requirements.txt`. No subas el entorno: ensucia el repo y no aporta. requirements.txt y README.md sí van al remoto. hello.py es tu código fuente.',
      },
      {
        question: '¿Cuál es un buen mensaje de commit siguiendo Conventional Commits?',
        options: [
          '"cambios"',
          '"wip"',
          '"feat: agregar cálculo de churn por segmento"',
          '"arreglé el bug de ayer"',
        ],
        correctIndex: 2,
        explanation:
          'Conventional Commits usa prefijos como feat:, fix:, docs:, refactor: seguidos de una descripción corta e imperativa. Esto permite generar changelogs automáticamente y hace el historial legible.',
      },
      {
        question: '¿Qué comando te permite replicar el entorno de otro desarrollador?',
        options: [
          'pip install pandas numpy',
          'python -m venv venv',
          'pip install -r requirements.txt',
          'git clone https://github.com/usuario/repo.git',
        ],
        correctIndex: 2,
        explanation:
          'Preferible `python -m pip install -r requirements.txt` (atado al mismo intérprete). Lee versiones pinneadas e instala el snapshot. `git clone` solo trae código; `python -m venv` crea el entorno vacío sin paquetes de terceros.',
      },
      {
        question: '¿Por qué NO debes subir el archivo .env a GitHub?',
        options: [
          'Porque pesa demasiado y ralentiza el git push',
          'Porque suele contener credenciales (API keys, passwords, tokens) que son secretos',
          'Porque GitHub no soporta archivos sin extensión',
          'Porque entra en conflicto con requirements.txt',
        ],
        correctIndex: 1,
        explanation:
          'Los archivos .env guardan variables de entorno con secretos. Si los subes a un repo público, cualquiera puede usar tus credenciales. Es uno de los errores de seguridad más comunes y costosos en desarrollo. Usa `.env.example` sin secretos y deja `.env` en `.gitignore`.',
      },
    ],
  },
  // Evaluaciones formativas por tema (V3); render opcional en You Do tab
  topicEvaluations: [
    {
      id: 'S01-T1-TE',
      topic_id: 'S01-T1',
      title: 'Evaluación formativa — Runtime',
      subtopics_covered: ['S01-T1-A', 'S01-T1-B'],
      tasks: [
        {
          id: 'S01-T1-TE-1',
          title: 'Verificar intérprete y capturar versión',
          authentic: true,
          deliverable: 'Transcript: python --version + REPL (expresión, type, quit)',
        },
        {
          id: 'S01-T1-TE-2',
          title: 'Demostrar exit code no cero',
          authentic: true,
          deliverable: 'Comando con sys.exit(1) + código de salida ($? o $LASTEXITCODE)',
        },
      ],
      rubric_0_3: {
        correctness: '¿El intérprete y los exit codes son los correctos?',
        robustness: '¿Funciona en su SO documentado?',
        maintainability: '¿El transcript es claro y reproducible?',
        responsible_use: '¿No incluye secretos ni rutas con datos sensibles?',
      },
    },
    {
      id: 'S01-T2-TE',
      topic_id: 'S01-T2',
      title: 'Evaluación formativa — Entornos',
      subtopics_covered: ['S01-T2-A', 'S01-T2-B'],
      tasks: [
        {
          id: 'S01-T2-TE-1',
          title: 'Crear .venv e instalar desde requirements',
          authentic: true,
          deliverable: 'Transcript: python -m venv .venv → activate → python -m pip install -r requirements.txt',
        },
        {
          id: 'S01-T2-TE-2',
          title: 'Generar freeze y explicar una línea pinneada',
          authentic: true,
          deliverable: 'requirements.txt + 2–3 oraciones sobre paquete==versión',
        },
      ],
      rubric_0_3: {
        correctness: '¿El entorno se activa y las deps instalan?',
        robustness: '¿Funciona tras desactivar/reactivar?',
        maintainability: '¿requirements.txt es usable por un colega?',
        responsible_use: '¿No pinnea secretos ni rutas locales?',
      },
    },
    {
      id: 'S01-T3-TE',
      topic_id: 'S01-T3',
      title: 'Evaluación formativa — Git',
      subtopics_covered: ['S01-T3-A', 'S01-T3-B'],
      tasks: [
        {
          id: 'S01-T3-TE-1',
          title: 'Dos commits Conventional Commits + un diff explicado',
          authentic: true,
          deliverable: 'git log --oneline (2+) + explicación de 1 diff (git show)',
        },
        {
          id: 'S01-T3-TE-2',
          title: 'Rama feature y plan de PR',
          authentic: true,
          deliverable: 'Nombre feat/* + título PR + 3 bullets; sin force-push',
        },
      ],
      rubric_0_3: {
        correctness: '¿Los commits y la rama son correctos?',
        robustness: '¿Recuperación sin destruir historial?',
        maintainability: '¿Mensajes legibles para un colega?',
        responsible_use: '¿No hay secretos en el historial del ejercicio?',
      },
    },
    {
      id: 'S01-T4-TE',
      topic_id: 'S01-T4',
      title: 'Evaluación formativa — Calidad inicial',
      subtopics_covered: ['S01-T4-A', 'S01-T4-B'],
      tasks: [
        {
          id: 'S01-T4-TE-1',
          title: 'Ruff config + ruff check limpio',
          authentic: true,
          deliverable: 'pyproject.toml [tool.ruff] + salida ruff check exit 0',
        },
        {
          id: 'S01-T4-TE-2',
          title: 'Paquete ignore/env/README de seguridad',
          authentic: true,
          deliverable: '.gitignore + .env.example + sección README Seguridad',
        },
      ],
      rubric_0_3: {
        correctness: '¿Ruff e ignore funcionan?',
        robustness: '¿Un clon limpio arranca?',
        maintainability: '¿README suficiente para un colega?',
        responsible_use: '¿Cero secretos y cero PII real?',
      },
    },
  ],
  resources: {
    docs: [
      { label: 'Python.org — Downloads', url: 'https://python.org/downloads/', note: 'Instalador oficial de Python' },
      { label: 'VS Code — Python extension', url: 'https://marketplace.visualstudio.com/items?itemName=ms-python.python', note: 'Extensión oficial de Microsoft' },
      { label: 'Git — official book', url: 'https://git-scm.com/book/es/v2', note: 'Libro gratuito de Git en español' },
      { label: 'Conventional Commits', url: 'https://www.conventionalcommits.org/', note: 'Estándar para mensajes de commit' },
      { label: 'GitHub Docs — Quickstart', url: 'https://docs.github.com/es/get-started/quickstart', note: 'Primeros pasos con GitHub' },
      { label: 'Ruff — documentation', url: 'https://docs.astral.sh/ruff/', note: 'Linter/formateador; pyproject.toml [tool.ruff]' },
      { label: 'pip — User Guide', url: 'https://pip.pypa.io/en/stable/user_guide/', note: 'python -m pip, requirements, freeze' },
    ],
    books: [
      { label: 'Python 101', note: 'Capítulo sobre instalación y setup. Base para entender el entorno.' },
      { label: 'Python Apprentice to Master', note: 'Capítulo inicial sobre entorno profesional y convenciones.' },
    ],
    courses: [
      { label: 'CS50P — Harvard', url: 'https://cs50.harvard.edu/python', note: 'Semana 0 cubre setup detalladamente' },
      { label: 'GitHub Learning Lab', url: 'https://lab.github.com/', note: 'Cursos interactivos gratuitos de Git/GitHub' },
    ],
  },
}
