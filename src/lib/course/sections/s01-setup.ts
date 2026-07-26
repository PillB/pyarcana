import type { CourseSection } from '../../types'

export const section01: CourseSection = {
  id: 'setup',
  index: 1,
  title: 'Entorno reproducible y trabajo seguro',
  shortTitle: 'Entorno reproducible',
  tagline:
    'Python, editor, entorno aislado (venv) y control de versiones (Git) listos desde el día 1 · Ritmo sugerido: 3–4 h núcleo, 6–8 h GitHub/Ruff, resto para pulir CP-N1-A',
  estimatedHours: 18,
  level: 'Principiante',
  phase: 0,
  icon: 'Wrench',
  accentColor: 'bg-gradient-to-br from-violet-500 to-violet-700',
  jobRelevance:
    'El 90 % de los problemas en equipos de data science no son de código: son de **entorno** (la máquina, el Python y los paquetes con los que corres el proyecto). Un analista que sabe crear un **entorno virtual** (una carpeta aislada con el Python y los paquetes del proyecto), usar **Git** (el sistema que conserva el historial de cambios) y trabajar en un editor como VS Code ahorra horas al equipo. En empresas peruanas como Interbank, BBVA o Caja Arequipa, el primer día suelen pedirte **clonar un repo** (repositorio: la carpeta del proyecto con su historial Git en GitHub u otro remoto), **activar el entorno virtual** y correr un notebook. Si te trabas ahí, no pasas la semana de prueba. Esta sección te enseña cada una de esas palabras antes de usarlas a fondo.',
  learningOutcomes: [
    {
      text: 'Seleccionar el intérprete Python correcto (el programa que ejecuta tu código) y usar el REPL (modo interactivo) para inspección rápida',
    },
    {
      text: 'Interpretar códigos de salida (0 = éxito, no-cero = error) y distinguir PATH (dónde el sistema busca programas) del directorio de trabajo',
    },
    { text: 'Instalar Python 3.12+ y verificarlo desde la terminal (PowerShell, bash o zsh)' },
    {
      text: 'Crear y activar un entorno virtual con venv (carpeta `.venv` por proyecto, aislada del Python global)',
    },
    { text: 'Configurar VS Code con extensiones Python esenciales (Pylance, Ruff, Jupyter)' },
    {
      text: 'Inicializar un repositorio Git (repo: carpeta con historial), hacer commit/push y abrir un Pull Request (propuesta de cambios) en GitHub',
    },
    {
      text: 'Escribir un requirements.txt (lista de paquetes y versiones) reproducible y un .gitignore (qué no subir a Git)',
    },
  ],
  theory: [
    {
      heading: 'Por qué el setup importa más de lo que crees',
      paragraphs: [
        '**Diccionario del día 1.** Léelo antes de seguir; el resto de la sección profundiza cada término.',
        '**Intérprete y terminal (T1):** *Intérprete* — el programa `python`/`python3` que ejecuta tu código. *Terminal (shell)* — la ventana de texto donde escribes comandos.',
        '**Entornos (T2):** *Entorno virtual (`venv`)* — una carpeta del proyecto (canónica: `.venv`) con su propio Python y paquetes, para no mezclar dependencias entre proyectos. *pip* — instalador de paquetes de terceros. *requirements.txt* — archivo que lista esas dependencias con versión.',
        '**Git (T3):** *Repo (repositorio)* — la carpeta del proyecto bajo **Git** (control de versiones: historial de quién cambió qué). *Clonar* — copiar un repo desde un remoto (p. ej. **GitHub**) a tu laptop. *Commit* — guardar un snapshot del historial con un mensaje. *Pull Request (PR)* — pedir que revisen e integren tus cambios.',
        'Vuelve a este bloque cuando veas una palabra en negrita y no la recuerdes.',
        'Mucha gente salta el setup porque "ya aprenderá en el camino". Error. En producción, un entorno mal configurado genera errores fantasma: "a mí me funciona" es la frase más temida en Slack. Cuando trabajas en un equipo de data science, tu colega **clona tu repo** (copia el repositorio), crea su propio **entorno virtual**, ejecuta `python -m pip install -r requirements.txt` (instala los paquetes listados atados al mismo intérprete) y todo debería andar. Si no anda, perdiste credibilidad. Por eso esta sección no es un trámite — es la base sobre la que se construye todo lo demás.',
        'En Perú, el stack que vas a encontrar en empresas medianas y grandes es bastante consistente: Python 3.11 o 3.12, VS Code o PyCharm, Git + GitHub (algunos usan GitLab), y **entornos virtuales** con el módulo `venv` (más común) o `conda` (en equipos más legacy o de investigación). Las startups más nuevas están migrando a `uv` (más rápido), pero todavía no es estándar. Vamos con `venv` porque es lo que vas a encontrar en el 95% de los puestos.',
        'La regla de oro: **un proyecto = un entorno virtual = un requirements.txt**. Nunca instales paquetes en el Python global del sistema. Nunca. Si lo haces, en 3 meses no vas a saber qué versión de pandas tenías cuando algo funcionaba y ahora no. El entorno virtual aísla las **dependencias** (paquetes que tu código necesita) por proyecto, igual que una caja hermética. Cuando algo se rompe, sabes exactamente dónde buscar. Caso sintético de laboratorio: `CASO-LIM-001` (setup reproducible sin secretos en el repo).',
      ],
      code: {
        language: 'python',
        title: 'contrato_seccion.py — gates del día 1',
        code: `def section_contract():
    return {
        "case": "CASO-LIM-001",
        "gates": ["venv_per_project", "requirements_pinned", "secrets_out_of_repo", "git_smoke"],
        "zero_prior_baseline": True,
        "secrets_in_repo_ok": False,
    }

c = section_contract()
print("case", c["case"])
print("zero_prior_baseline", c["zero_prior_baseline"])
print("secrets_in_repo_ok", c["secrets_in_repo_ok"])
`,
        output: `case CASO-LIM-001
zero_prior_baseline True
secrets_in_repo_ok False`,
      },
      callout: {
        type: 'tip',
        title: 'Diccionario del día 1 + ritmo sugerido (18 h totales)',
        content:
          'Si una palabra en negrita no te queda clara, vuelve a este bloque. **Ritmo sugerido (18 h totales):** 3–4 h de núcleo (Python + `venv` + `pip` + `git` local); 6–8 h para GitHub/PR/Ruff/`.gitignore`; el resto, para pulir el esqueleto CP-N1-A y el checklist de máquina limpia. No hace falta terminar el portafolio en un solo día. Con el núcleo de 3–4 h ya tendrás un intérprete, un `venv` y un commit limpio.',
      },
    },
    {
      heading: 'El intérprete Python y el REPL',
      subtopicId: 'S01-T1-A',
      paragraphs: [
        'Con el diccionario en mente, pasamos al primer objeto real del día: el **intérprete**. Cuando instalas Python, lo que realmente instalas es un programa que lee tu código y lo ejecuta. En la terminal suele llamarse `python` o `python3`. La primera habilidad profesional no es escribir un algoritmo: es **verificar qué intérprete estás usando**. En Windows a veces el comando `python` no está en el PATH (la lista de carpetas donde el sistema busca programas). En macOS/Linux es común tener `python3` como comando principal. Por eso siempre empiezas con `python --version` (o `python3 --version`) y anotas la respuesta. Para este curso apuntamos a **Python 3.12 o superior** (3.10+ aceptable si lo documentas).',
        'El **REPL** (Read–Eval–Print Loop) es el modo interactivo del intérprete. Lo abres escribiendo solo `python` (o `python3`) y Enter. Verás el prompt `>>>`. Ahí puedes escribir una expresión, presionar Enter, y Python la evalúa al instante: `2 + 2` devuelve `4`, `type("hola")` devuelve `<class \'str\'>`. Es ideal para probar una idea en 10 segundos sin crear un archivo. Para salir: `quit()` o `exit()`, o el carácter de fin de archivo (Ctrl-D en macOS/Linux, Ctrl-Z y Enter en Windows). Salir del REPL **no cierra** tu terminal: vuelves al prompt de la shell (`$` o `PS>`).',
        'Hay una diferencia crítica entre **sesión REPL** y **script `.py`**. En el REPL cada línea se ejecuta al presionar Enter. En un script, escribes el programa completo en un archivo y lo lanzas con `python hello.py`. El script es lo que subes a GitHub y lo que corre en producción o en un pipeline. El REPL es tu laboratorio de bolsillo. Cuando un colega dice "ábrelo en el intérprete y mira el tipo", te está pidiendo el REPL. Cuando dice "corre el entrypoint", te está pidiendo un archivo. Confundir ambos genera la sensación de que "a mí me funciona" en la laptop y falla en el servidor.',
        'Tu primer script usa tres piezas mínimas: (1) **`print(...)`** escribe texto a la salida estándar (lo ves en la terminal). (2) **`def nombre():`** define una función — un bloque indentado que puedes reutilizar; por convención el entrypoint se llama `main`. (3) el guardián **`if __name__ == "__main__":`** solo corre `main()` cuando ejecutas el archivo con `python archivo.py` (no cuando alguien lo importa como módulo). Para la versión de Python dentro del script: `import sys` y `sys.version.split()[0]`. Un **f-string** formatea texto con variables: `print(f"Hola {nombre}")` — la `f` delante de las comillas permite `{expresiones}` dentro.',
        '**Anotaciones de tipo (opcional, no las necesitas hoy):** en la demostración `check_arg.py` verás `def main() -> None:` («esta función no devuelve un valor útil»). Es una **pista** para editores y Ruff; en S01 Python **no** la exige en tiempo de ejecución. Los demás demos y ejercicios pueden usar `def main():` sin anotaciones; las reencontrarás cuando S02–S03 profundicen en tipos. Si la copias o la omites, la lógica del script no cambia.',
      ],
      code: {
        language: 'python',
        title: 'hello_sys.py — primer script con entrypoint',
        code: `import sys

def main():
    nombre = "Estudiante"
    version = sys.version.split()[0]
    print(f"Hola {nombre}")
    print(version)

if __name__ == "__main__":
    main()
# Ejecutar: python hello_sys.py  → exit 0 si no hay error`,
        output: `Hola Estudiante
3.12.3`,
      },
      callout: {
        type: 'tip',
        title: 'REPL vs script en un minuto',
        content:
          'En el REPL pruebas `2+2`. En un `.py` escribes def + if __name__ y lanzas `python archivo.py`. Ambos usan el mismo intérprete.',
      },
    },
    {
      heading: 'El intérprete en la terminal (comandos de verificación)',
      subtopicId: 'S01-T1-A',
      paragraphs: [
        'Además del script `hello_sys.py`, verifica el intérprete **desde la shell** antes de crear venvs o instalar paquetes. El orden del día 1 es corto y repetible: (1) `python3 --version` (o `python --version` si ese es el que responde), (2) entrar al REPL con el mismo comando sin argumentos, probar una expresión y salir con `quit()`, (3) atar pip al mismo binario con `python3 -m pip --version`. Anota la versión exacta que ves (ej. 3.12.3): es el ancla de todo lo que sigue.',
        'Si `python` falla y `python3` funciona, usa **`python3` de forma consistente** en esta sección (o configura el alias/PATH). En Windows, al instalar desde python.org, marca "Add python.exe to PATH"; el launcher `py --version` también sirve para diagnosticar. Nunca instales paquetes "a ciegas" sin saber qué `python` los va a recibir: el prefijo `python3 -m pip` evita el pip huérfano que apunta a otro intérprete.',
        'Los comandos de abajo son **copy-paste real** de terminal (bash/zsh o PowerShell con `python`/`py`). La salida de ejemplo usa Python 3.12.x — tu número de parche puede variar si es 3.12+; 3.10+ es aceptable si lo documentas en el README del proyecto. Cuando el REPL muestre `>>>`, escribes la expresión y Enter; `quit()` te devuelve al prompt de la shell, no cierra la ventana. Repite estos tres pasos en cada máquina nueva (laptop de casa, de la oficina, VM de lab).',
      ],
      code: {
        language: 'bash',
        title: 'Verificar intérprete y entrar al REPL',
        code: `# Verifica el intérprete (usa python3 si python no responde)
python3 --version
# Python 3.12.3

# Entra al REPL, prueba y sal
python3
# >>> 2 + 2
# 4
# >>> quit()

# Ata pip al mismo intérprete
python3 -m pip --version
`,
        output: `Python 3.12.3
pip 24.0 from ... (python 3.12)`,
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
        '**Argumentos de línea de comandos:** `sys.argv` es una lista de strings. `sys.argv[0]` es el nombre del script; los argumentos del usuario empiezan en `sys.argv[1]`. **`len(sys.argv)`** cuenta cuántos elementos hay (incluye el nombre del script). Ejemplo: `python check_arg.py ok` → `sys.argv == ["check_arg.py", "ok"]` y `len(sys.argv) == 2`. **Rebanado (slice):** `sys.argv[1:]` es la sublista desde el índice 1 hasta el final (todos los args del usuario, sin el nombre del script). La forma general es `lista[inicio:fin]` (fin excluido); omitir `fin` llega al final. Para errores al usuario usa `print("uso: ...", file=sys.stderr)` y luego `sys.exit(1)`.',
        '**Qué intérprete es este proceso:** `sys.executable` es la ruta absoluta del binario Python que está corriendo tu script (ej. `.../.venv/bin/python`). Si `import requests` falla, compara `sys.executable` con el `pip` que usaste: la regla de oro es instalar con `python -m pip install ...` usando **el mismo** ejecutable. Así evitas el clásico "lo instalé pero ModuleNotFoundError".',
      ],
      code: {
        language: 'python',
        title: 'check_arg.py — argv, len y exit codes',
        code: `import sys

def main() -> None:
    # sys.argv[0] = script; usuario desde [1]
    if len(sys.argv) != 2:
        print("uso: python check_arg.py <arg>", file=sys.stderr)
        sys.exit(1)
    print("OK:" + sys.argv[1])
    print("executable:", sys.executable)
    sys.exit(0)

if __name__ == "__main__":
    main()`,
        output: `OK:hola
executable: /ruta/a/python`,
      },
    },
    {
      heading: 'cwd, PATH y códigos de salida en la shell',
      subtopicId: 'S01-T1-B',
      paragraphs: [
        'Ya viste `sys.exit` desde un script. Ahora confirma el mismo contrato **desde la shell**: el cwd (dónde estás), un comando que no existe (exit 127 en bash) y los códigos 0/1 con los mismos números. En bash/zsh: `echo $?`. En PowerShell: `echo $LASTEXITCODE` (no confundas con `$?`, que en PowerShell es booleano).',
        'El **PATH** es la lista de carpetas donde el sistema busca ejecutables (`python`, `git`, `code`). No es la carpeta de tu proyecto: puedes estar en `~/proyectos/python-ds-journey` y aun así fallar `python` si ese binario no está en el PATH. Al revés: Python en el PATH y un `FileNotFoundError` al abrir un script casi siempre es **cwd incorrecto** o ruta mal escrita. Diagnostica en este orden: (1) ¿el ejecutable responde (`python3 --version`)? (2) ¿`pwd` / `Get-Location` es la carpeta del repo? (3) ¿el proceso salió con 0?',
        'Los bloques de abajo son la misma lección en **comandos reales**: `pwd` ancla el cwd; un one-liner con `sys.exit(0)` y otro con `sys.exit(1)` te dejan ver el contrato 0/no-cero; un comando inexistente suele devolver **127** en bash/zsh (en PowerShell el número puede diferir — anota el de tu shell). Cuando un pipeline o un colega diga “el job falló”, el primer dato útil es ese entero, no solo el color del mensaje en pantalla.',
      ],
      code: {
        language: 'bash',
        title: 'cwd, PATH conceptual y códigos de salida',
        code: `# 1) ¿Dónde estoy? (cwd)
pwd
# .../demo_ruta   (o Get-Location en PowerShell)

# 2) Éxito → exit 0
python3 -c "import sys; print('ok'); sys.exit(0)"
echo $?
# 0

# 3) Fallo controlado → exit 1
python3 -c "import sys; sys.exit(1)"
echo $?
# 1

# 4) Comando inexistente (bash/zsh) → suele ser 127
comando_que_no_existe 2>/dev/null
echo $?
# 127
`,
        output: `.../demo_ruta
ok
0
1
127`,
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
        'Después de instalar, **verifica en la terminal** (no asumas que el instalador “ya quedó”). El bloque de abajo es el checklist copy-paste del día 1: Python responde con 3.12.x, Git responde con su versión, y el editor está listo (CLI `code` o menú de VS Code). Solo entonces pasas a crear `.venv` y a `python -m pip`. Si un comando falla, repara esa pieza antes de seguir — no encadenes installs a ciegas.',
      ],
      code: {
        language: 'bash',
        title: 'Orden del stack: verificar lo instalado',
        code: `# 1) Python 3.12+ (instalador: https://www.python.org/downloads/)
python3 --version
# Python 3.12.3   (o python --version / py --version en Windows)

# 2) Git (instalador: https://git-scm.com/)
git --version
# git version 2.43.0

# 3) VS Code (https://code.visualstudio.com/) — CLI opcional:
#    Paleta de comandos → "Shell Command: Install 'code' command in PATH"
code --version
# 1.85.0  (si no hay CLI, abre VS Code desde el menú y sigue)

# 4) Extensiones en VS Code (UI Extensions): Python + Ruff (+ Jupyter si usas notebooks)
# Luego: File → Open Folder del proyecto y Terminal integrada
`,
        output: `Python 3.12.3
git version 2.43.0
1.85.0
...`,
      },
      callout: {
        type: 'info',
        title: 'Biblioteca estándar vs paquetes de terceros',
        content:
          'Biblioteca estándar (sin pip install): sys, datetime, os, json, csv, pathlib, math, random. Paquetes de terceros (con pip install): pandas, numpy, matplotlib, scikit-learn, requests. Si te sale `ModuleNotFoundError`, primero revisa si es de la biblioteca estándar (no necesita install) o de terceros (necesita `pip install nombre_paquete`).',
      },
    },
    {
      heading: 'Mapa rápido Windows · macOS/Linux (día 1)',
      paragraphs: [
        'Antes de crear el `.venv`, fíjate en esta tabla mental de **comandos por sistema**. No son lenguajes distintos: es la misma idea (intérprete → entorno → pip atado) con rutas y nombres que cambian. Si copias el bloque de un SO en otro, el error típico es “no se reconoce el comando” o “no such file or directory” — no es que Python “esté mal”, es la ruta o el nombre del binario.',
        '**Intérprete:** Windows suele responder a `python` o `py`; macOS/Linux a `python3` (a veces también `python`). **Activar venv:** Unix → `source .venv/bin/activate`; PowerShell → `.venv\\Scripts\\Activate.ps1`; cmd → `.venv\\Scripts\\activate.bat`. **Código de salida:** bash/zsh → `echo $?`; PowerShell → `echo $LASTEXITCODE` (en PowerShell `$?` es booleano, no el entero del programa). **Dónde estoy:** `pwd` vs `Get-Location`. Guarda esta correspondencia: la usarás en cada demo de esta sección.',
        'Si un comando del I Do falla, pregunta en este orden: (1) ¿estoy en el SO correcto para ese snippet? (2) ¿el intérprete responde con `--version`? (3) ¿activé el venv antes de `pip`? (4) ¿leí el código de salida? Ese hábito reduce la carga cognitiva cuando el material muestra un camino y tu laptop usa el otro.',
      ],
      callout: {
        type: 'tip',
        title: 'Tabla de bolsillo (skimmers)',
        content:
          '**Versión:** `python --version` / `py --version` (Win) · `python3 --version` (macOS/Linux). **Venv on:** `.venv\\Scripts\\Activate.ps1` (Win PS) · `source .venv/bin/activate` (Unix). **Exit code:** `$LASTEXITCODE` (Win PS) · `$?` (bash/zsh). **pip atado:** siempre `python -m pip …` o `python3 -m pip …` con el mismo binario que acabas de verificar.',
      },
    },
    {
      heading: 'Entornos virtuales con venv',
      subtopicId: 'S01-T2-A',
      paragraphs: [
        'Un **entorno virtual** es una carpeta autocontenida con su propio intérprete Python y su propio directorio de paquetes. La herramienta estándar de la biblioteca es el módulo **`venv`**: `python -m venv .venv`. La regla de oro no cambia: **un proyecto = un entorno = un conjunto de dependencias**. Así evitas que el pandas 2.x de un cliente rompa el notebook legacy de otro. Instalar paquetes “en el Python global” del sistema es la vía rápida al caos en tres meses.',
        '**Nombre de la carpeta:** la documentación oficial de Python recomienda **`.venv`** (con punto): queda semi-oculto en listados Unix y se distingue de archivos `.env` de secretos. El nombre `venv` (sin punto) también es válido y lo verás en muchos tutoriales; en este curso el canónico es **`.venv`**, y tratamos `venv` como alias aceptado si ya lo usas. Ambos deben ir en `.gitignore` — nunca subas el entorno a GitHub (pesa decenas o cientos de MB y se regenera).',
        '**Activación** engancha la shell al Python del entorno: en macOS/Linux, `source .venv/bin/activate`; en Windows PowerShell, `.venv\\Scripts\\Activate.ps1`. El prompt suele mostrar `(.venv)`. **`deactivate`** vuelve al Python anterior. Si rompes el entorno, no “reparas a mano” el site-packages: borras la carpeta `.venv` y la recreas con el mismo comando. `conda` sigue siendo alternativa en investigación o GPU, pero **no es el default** de este curso. Herramientas más nuevas como `uv` son tendencia; aquí dominas `venv` porque es lo que encontrarás en la mayoría de inducción corporativa.',
      ],
      code: {
        language: 'bash',
        title: 'Crear, activar y desactivar .venv',
        code: `python3 -m venv .venv
# macOS/Linux:
source .venv/bin/activate
# Windows PowerShell:
# .venv\\Scripts\\Activate.ps1

python -c "import sys; print(sys.executable); print(sys.prefix)"
which python || where python
# deactivate   # cuando termines
`,
        output: `.../python-ds-journey/.venv/bin/python3
.../python-ds-journey/.venv
.../python-ds-journey/.venv/bin/python`,
      },
      callout: {
        type: 'tip',
        title: '.venv vs .env · activar por SO',
        content:
          '`.venv` = entorno virtual (código y paquetes). `.env` = secretos locales (no va al repo). **Activar:** macOS/Linux → `source .venv/bin/activate` · Windows PowerShell → `.venv\\Scripts\\Activate.ps1` · cmd → `.venv\\Scripts\\activate.bat`. Verifica con `python -c "import sys; print(sys.prefix)"` (debe terminar en `.venv`). En `.gitignore`: `.venv/`, `venv/` y `.env`.',
      },
    },
    {
      heading: 'pip, freeze y requirements.txt',
      subtopicId: 'S01-T2-B',
      paragraphs: [
        'Con el `.venv` activado, instalas dependencias de **terceros** con **`python -m pip`**. El prefijo `python -m` ata pip al mismo intérprete que acabas de verificar: evita el clásico “pip instaló en un Python y `import` usa otro”. Comandos del día a día: `python -m pip install paquete`, pin con `paquete==1.2.3`, listar con `python -m pip list`, y exportar un snapshot con `python -m pip freeze > requirements.txt`. Para restaurar en otra máquina o en un entorno limpio: `python -m pip install -r requirements.txt`. La biblioteca estándar (`sys`, `datetime`, `pathlib`, `csv`, `json`…) **no** va a requirements: se importa sin `pip install`.',
        '**`pip freeze`** escribe *todo* lo instalado en el entorno activo, incluidas **dependencias transitivas** (si instalas `requests`, también aparecen `urllib3`, `certifi`, etc.). Eso es un **snapshot reproducible** muy útil para clonar el entorno de un analista. No es un lockfile moderno con hashes y resolución completa (Poetry, PDM, `uv lock` van más allá). En S01 usamos freeze + `==` porque es el mínimo que encontrarás en inducción corporativa y en muchos repos de data. Entiende el límite: freeze captura *lo que hay hoy* en *tu* venv; no resuelve conflictos multiplataforma ni firma paquetes.',
        'Flujo profesional: (1) activar `.venv`, (2) instalar lo necesario, (3) `python -m pip freeze > requirements.txt`, (4) hacer commit del archivo (no de la carpeta `.venv/`). Si un colega clona y hace `install -r`, debería obtener las mismas versiones pinneadas. Si ves `ModuleNotFoundError`, primero pregunta: ¿estoy en el venv correcto? ¿usé `python -m pip`? ¿el paquete es stdlib o de terceros? Diagnosticar en ese orden ahorra horas de “a mí me funciona”.',
      ],
      code: {
        language: 'bash',
        title: 'python -m pip: install, freeze, install -r',
        code: `# Con .venv activado:
python -m pip install requests==2.32.3
python -m pip freeze > requirements.txt
grep -i "requests==" requirements.txt

python -c "import requests; print(requests.__version__)"
# stdlib (sin pip): import sys / datetime — no van en requirements.txt
`,
        output: `requests==2.32.3
2.32.3`,
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
        code: `git init -b main
echo "# python-ds-journey" > README.md
git add README.md
git commit -m "docs: agregar README inicial"
echo "Setup con venv." >> README.md
git add README.md
git commit -m "docs: documentar setup con venv"
git log --oneline -2
git show HEAD --stat
`,
        output: `docs: documentar setup con venv
docs: agregar README inicial
 README.md | 1 +
 1 file changed, 1 insertion(+)`,
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
        'Un **conflicto** aparece cuando dos ramas editaron las mismas líneas. Git marca el archivo; tú eliges el contenido final, `git add` y un commit de fusión o de resolución. En S01 no necesitas ser experto en merges complejos: sí necesitas no entrar en pánico y no “arreglar” con historial destructivo. La regla de oro de este curso: **no hagas `git push --force` a `main`**. Reescribe historial solo en ramas tuyas no compartidas y con permiso del equipo; en inducción, ni eso.',
        'Recuperación **no destructiva** del día a día: `git restore archivo` descarta cambios *sin commit* en el working tree (vuelve a la última versión confirmada o staged, según el caso). `git stash` guarda cambios temporales y deja el árbol limpio; `git stash pop` los recupera. Prefiere restore/stash a `reset --hard` como primer reflejo: hard borra trabajo sin commit de forma fácil de lamentar. Aprende primero a no perder trabajo; después, a reescribir con cuidado.',
      ],
      code: {
        language: 'bash',
        title: 'Rama feature, restore y stash (sin force-push)',
        code: `git switch main
git switch -c feat/hello-env
# edita, add, commit…
git branch --show-current

# Si \`git remote -v\` muestra origin, publica y abre el PR:
# git push -u origin feat/hello-env
# gh pr create   # o abre el PR en la UI de GitHub

# Recuperación no destructiva (sin force-push a main):
# git restore archivo.md
# git stash push -m "wip" && git stash pop
`,
        output: `feat/hello-env
# El push/PR requiere un remoto origin configurado`,
      },
      callout: {
        type: 'danger',
        title: 'Errores típicos + prohibido force-push a main',
        content:
          'Errores típicos a evitar: (1) subir `.venv/`/`venv/` a GitHub, (2) subir `.env` con secretos, (3) commits "cambios"/"wip", (4) trabajar solo en `main`. Si ya versionaste un secreto: rotar + `git rm --cached .env` (`.gitignore` solo no limpia historial). **Prohibido:** `git push --force` a `main` — puede borrar commits ajenos. Recuperación segura: restore, stash, PR. Force-push nunca es la respuesta a “push rechazado” en main.',
      },
    },
    {
      heading: 'VS Code y Ruff como calidad mínima',
      subtopicId: 'S01-T4-A',
      paragraphs: [
        'El editor recomendado en este curso es **VS Code** con la extensión de **Python** (Pylance para tipos e IntelliSense) y **Ruff** (linter y formateador ultrarrápido escrito en Rust). No sustituyen pensar: atrapan errores baratos antes de la revisión de código — imports sin usar, errores de sintaxis obvios, imports desordenados. En equipos de datos, un linter en el repo es el primer “CI humano” que corre en tu laptop.',
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
`,
        output: 'All checks passed!  (tras corregir violaciones con: python -m ruff check .)',
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
        '**.gitignore** le dice a Git qué archivos no debe rastrear. Mínimo para Python/data: `.venv/`, `venv/`, `__pycache__/`, `*.pyc`, `.env`, `.ipynb_checkpoints/`, y a menudo `data/raw/` o dumps grandes si tu política es no versionar datos pesados. Incluye **ambos** nombres de entorno (`.venv/` y `venv/`) porque el ecosistema usa los dos. Plantilla base: https://github.com/github/gitignore (Python.gitignore). Ojo: si un archivo **ya** está bajo control de versiones, agregarlo al `.gitignore` no lo saca del historial; necesitas `git rm --cached archivo` y un commit.',
        '**.env** guarda secretos y variables locales (API keys, contraseñas). **Nunca** va al repo. **`.env.example`** sí: lista las *claves* con valores vacíos o ficticios para que un colega sepa qué copiar a su `.env` privado. Ejemplo: `DATABASE_URL=` y `API_TOKEN=` sin valores reales. Si subiste un secreto por error, rotarlo (cambiar la clave en el proveedor) es más importante que solo borrar el archivo del commit siguiente: el historial puede conservarlo.',
        '**README.md** es la guía de arranque del clon limpio: título, qué hace el repo, mención al **esqueleto CP-N1-A** (Validación de admisión de clientes y calidad de datos — *Client Intake & Data Quality*; capstone de Nivel 1 que se cierra en S04), instalación (`python -m venv .venv`, activate, `python -m pip install -r requirements.txt`), uso (`python scripts/hello_env.py`), y una nota de seguridad (no versionar `.env`, datos sintéticos). En S01 **no** construyes el validador de intake: solo dejas estructura y smoke. Agrega `data/clients_synthetic.csv` (PII falsa) y `data/data_dictionary.md` describiendo columnas. Un repo sin README ni diccionario no se puede auditar ni reutilizar en S02–S04.',
      ],
      code: {
        language: 'bash',
        title: '.gitignore + .env.example (verificación)',
        code: `# .gitignore mínimo (fragmento)
# .venv/
# venv/
# __pycache__/
# *.pyc
# .env
# .ipynb_checkpoints/

# .env.example (sí se versiona; sin secretos)
# API_TOKEN=
# DATABASE_URL=

git check-ignore -v .env
`,
        output: `.gitignore:5:.env    .env`,
      },
      callout: {
        type: 'warning',
        title: 'Secretos, PII y datos sintéticos',
        content:
          'En el esqueleto CP-N1-A usa solo datos sintéticos (nombres inventados, DNI ficticios). No subas extractos reales de clientes, ni dumps de producción, ni capturas con información personal. El uso responsable de los datos pesa en la rúbrica tanto como “que el script corra”.',
      },
    },
  ],
  iDo: {
    intro:
      'Te muestro paso a paso cómo configuro un entorno completo desde cero. Los bloques son comandos **copy-paste reales** de terminal: en macOS/Linux verás `python3` y `source .venv/bin/activate`; en Windows 11 (muy común en Perú) usa `python` o `py`, y activa con `.venv\\Scripts\\Activate.ps1` (PowerShell) o `activate.bat` (cmd). Acompáñame con tu laptop abierta y **repite cada paso** en tu shell. Empezamos por el intérprete/REPL (S01-T1-A) y los códigos de salida (S01-T1-B) antes de crear entornos virtuales.',
    steps: [
      {
        demoId: 'S01-T1-A-DEMO',
        subtopicId: 'S01-T1-A',
        environment: 'local-python',
        description: 'Verificar el intérprete y abrir una sesión REPL mínima — observar, no crear .py aún',
        preamble:
          'Antes de crear un `venv` o instalar paquetes, el analista del día 1 verifica **qué intérprete responde** en la laptop. En esta demo verás el hilo completo: `python3 --version`, una sesión REPL mínima (`2+2`, `type`, `sys.version`) y `python3 -m pip --version` atado al mismo binario. No escribas archivos todavía: sigue el orden de los comandos y la salida. Si en tu máquina solo funciona `python` o `py`, anótalo; el principio es el mismo. Caso de laboratorio: `CASO-LIM-001`.',
        code: {
          language: 'bash',
          title: 'Terminal + REPL',
          code: `python3 --version
python3
# >>> 2 + 2
# 4
# >>> import sys
# >>> sys.version.split()[0]
# '3.12.3'
# >>> type("hola")
# <class 'str'>
# >>> quit()
python3 -m pip --version
`,
          output: `Python 3.12.3
4
'3.12.3'
<class 'str'>
pip 24.0 from ... (python 3.12)`,
        },
        why: 'Si no sabes qué intérprete responde, todo lo demás (venv, pip, scripts) puede apuntar a otro Python y generar errores fantasma. El REPL confirma que el intérprete evalúa código; `quit()` demuestra que sales del REPL sin cerrar la terminal. Usar `python -m pip` evita instalar paquetes en un Python distinto al que ejecutas.',
        retrospective:
          'Si puedes decir en voz alta qué intérprete usaste y por qué `python -m pip` evita el pip huérfano, ya tienes el hábito de inducción. El error clásico es instalar con un `pip` y ejecutar con otro `python`. En We Do completarás el transcript REPL y escribirás tu primer script con entrypoint.',
      },
      {
        demoId: 'S01-T1-B-DEMO',
        subtopicId: 'S01-T1-B',
        environment: 'local-python',
        description: 'Observar códigos de salida 0 y no-cero con sys.exit',
        preamble:
          'Cuando un job de datos “falla”, el primer dato útil suele ser un **entero**, no el color del mensaje. Observa en la terminal: (1) dónde estás (`pwd` / `Get-Location`), (2) un proceso que sale con `0`, (3) uno que sale con `1` y cómo se lee con `$?` o `$LASTEXITCODE`. No instales paquetes aquí. En PowerShell no confíes en `$?` (es booleano): usa `$LASTEXITCODE`.',
        code: {
          language: 'bash',
          title: 'Terminal — exit codes',
          code: `pwd
# .../python-ds-journey  (o Get-Location en PowerShell)

python3 -c "import sys; print('ok'); sys.exit(0)"
echo $?
# 0   # PowerShell: echo $LASTEXITCODE

python3 -c "import sys; print('fallo controlado'); sys.exit(1)"
echo $?
# 1
`,
          output: `.../python-ds-journey
ok
0
fallo controlado
1`,
        },
        why: 'El código de salida es el contrato entre tu script y todo lo que lo invoca (shell, CI, orquestadores): **0** = sigamos; **no-cero** = detente o reintenta. Leer `$?` o `$LASTEXITCODE` es el hábito; el mensaje en pantalla y el código son canales distintos. Separar **cwd** (dónde estás) de **PATH** (qué ejecutables existen) evita el clásico “en mi máquina funciona” cuando solo cambió la carpeta o el PATH del job.',
        retrospective:
          'El contrato 0 / no-cero es el mismo en CI y en scripts de intake. El malentendido típico es creer que “no hubo traceback” = éxito. En We Do documentarás ambos códigos y luego escribirás un script que elige 0 o 1 según `sys.argv`.',
      },
      {
        demoId: 'S01-T2-A-DEMO',
        subtopicId: 'S01-T2-A',
        environment: 'local-python',
        description: 'Crear y activar entorno virtual con .venv',
        preamble:
          'Un proyecto de equipo necesita **una caja hermética de dependencias**. En esta demo creo `.venv` con el mismo intérprete que acabas de verificar, lo activo y compruebo que `sys.prefix` termina en esa carpeta. Observa la diferencia entre la ruta del entorno y la carpeta del repo. En Windows usa `Activate.ps1` (comentado en el bloque). No subas `.venv` a Git; no es el objetivo de esta demo.',
        code: {
          language: 'bash',
          title: 'Terminal — python -m venv .venv',
          code: `python3 -m venv .venv
# macOS/Linux:
source .venv/bin/activate
# Windows PowerShell:
# .venv\\Scripts\\Activate.ps1

python -c "import sys; print(sys.prefix)"
which python || where python
`,
          output: `.../python-ds-journey/.venv
.../python-ds-journey/.venv/bin/python`,
        },
        why: 'El entorno virtual aísla las dependencias por proyecto. `python -m venv` usa el mismo intérprete que acabas de verificar. Si rompes paquetes, borras `.venv/` y la recreas — no reinstalas el sistema. Activar no es opcional en el flujo diario: sin activar, `pip` puede caer en el Python global.',
        retrospective:
          'Si `sys.prefix` no termina en `.venv`, no estás en el entorno del proyecto — da igual lo que diga el prompt mental. El error clásico: `pip install` sin activar. En We Do crearás, desactivarás y, en E2, recrearás un entorno “roto” sin tocar el código fuente.',
      },
      {
        demoId: 'S01-T2-B-DEMO',
        subtopicId: 'S01-T2-B',
        environment: 'local-python',
        description: 'Instalar con python -m pip, freeze y verificar el pin (install -r se practica en We Do)',
        preamble:
          'Con el `.venv` activado, el contrato reproducible del equipo es un **`requirements.txt` pinneado**. Mira el flujo: `python -m pip install requests==2.32.3` → `freeze > requirements.txt` → verificar la línea pinneada e `import requests`. Observa que usamos siempre `python -m pip` (mismo intérprete). La stdlib no entra en requirements. No uses el Python global.',
        code: {
          language: 'bash',
          title: 'Terminal — pip install / freeze / verificar pin',
          code: `# Con .venv activado:
python -m pip install requests==2.32.3
python -m pip freeze > requirements.txt
grep -i "requests==" requirements.txt
python -c "import requests; print(requests.__version__)"
python -c "import sys; print(sys.version.split()[0])"
`,
          output: `requests==2.32.3
2.32.3
3.12.3`,
        },
        why: '`python -m pip` ata el instalador al intérprete del venv (no al `pip` suelto del sistema). `freeze` genera el snapshot pinneado — el contrato que un colega o CI reinstalará el día 1 — e incluye dependencias transitivas. Verificar con `grep` e `import` confirma que el pin y el entorno coinciden antes de confiar en el archivo.',
        retrospective:
          'Freeze captura *lo que hay hoy* en *tu* venv, incluidas dependencias transitivas; no es un lockfile con hashes. El malentendido: copiar `site-packages` a mano entre laptops. En We Do harás freeze, luego `install -r` en un entorno limpio y un forense de `ModuleNotFoundError`.',
      },
      {
        demoId: 'S01-T3-A-DEMO',
        subtopicId: 'S01-T3-A',
        environment: 'local-python',
        description: 'Primer commit Conventional Commits y lectura de git show',
        preamble:
          'Git no es “guardar en la nube”: es un **historial legible**. En esta demo inicializo un repo, hago dos commits con prefijos `docs:`, miro `git log --oneline` y leo `git show HEAD --stat`. Fíjate en el mensaje en imperativo y en qué archivo cambió. No hagas force-push ni subas secretos. El objetivo es ver un historial que un colega entienda en diez segundos.',
        code: {
          language: 'bash',
          title: 'Terminal — git init / commit / show',
          code: `git init -b main
echo "# python-ds-journey" > README.md
git add README.md
git commit -m "docs: agregar README inicial"
echo "Esqueleto CP-N1-A" >> README.md
git add README.md
git commit -m "docs: mencionar esqueleto CP-N1-A"
git log --oneline -2
git show HEAD --stat
`,
          output: `docs: mencionar esqueleto CP-N1-A
docs: agregar README inicial
 README.md | 1 +
 1 file changed, 1 insertion(+)`,
        },
        why: 'Un commit con prefijo `docs:` / `feat:` vuelve legible el historial y el PR. `git show HEAD` enseña a leer el diff del último snapshot (`+` / `−`); es la misma habilidad que usarás al revisar código ajeno. Tras el commit, `git diff` suele verse vacío: eso no significa que “Git falló”, sino que ya no hay cambios sin confirmar.',
        retrospective:
          'Un prefijo `docs:` / `feat:` convierte el log en documentación ejecutable. El error clásico es “wip” o “cambios”. Pregunta de auto-chequeo: ¿miras `git show` o un `git diff` vacío post-commit? En We Do harás tu primer commit limpio, narrarás un diff y elegirás el mejor mensaje entre candidatos malos.',
      },
      {
        demoId: 'S01-T3-B-DEMO',
        subtopicId: 'S01-T3-B',
        environment: 'local-python',
        description: 'Flujo local de rama feature y plan de PR (remoto opcional, sin force-push)',
        preamble:
          'En equipo no trabajas solo en `main`: creas una **rama de feature**, haces commit ahí y abres un **Pull Request** para revisar el diff. Observa el flujo `git switch -c feat/hello-env` y el `push -u` (si tienes remoto). Si aún no hay `origin`, el hábito vale igual en local. **Prohibido** en este curso: `git push --force` a `main`. La recuperación segura (restore/stash) se comenta, no se reescribe historial compartido.',
        code: {
          language: 'bash',
          title: 'Terminal — branch + PR',
          code: `git switch main
git switch -c feat/hello-env
# edita scripts/hello_env.py, add, commit con feat: …
git branch --show-current
# Con origin configurado:
# git push -u origin feat/hello-env
# gh pr create   # o abre el PR en la UI de GitHub
# Nunca: git push --force origin main
`,
          output: `feat/hello-env
# El push/PR requiere un remoto origin configurado`,
        },
        why: 'La rama de feature + PR es el circuito de confianza del equipo: el diff se revisa antes de tocar `main`. `git push -u` solo aplica si ya hay remoto; el hábito de la rama vale igual en local. `restore` / `stash` recuperan trabajo sin reescribir historial compartido. `git push --force` a `main` está prohibido en este curso: puede borrar commits ajenos y no “arregla” un push rechazado.',
        retrospective:
          'Rama + PR es el circuito de confianza del equipo. El malentendido: “force-push arregla un push rechazado”. En We Do crearás `feat/practica-s01`, redactarás un cuerpo de PR y escribirás el procedimiento con `git restore` / `stash`.',
      },
      {
        demoId: 'S01-T4-A-DEMO',
        subtopicId: 'S01-T4-A',
        environment: 'local-python',
        description: 'Ruff check sobre un archivo con import sin usar',
        preamble:
          'Antes del code review humano, el repo puede atrapar basura barata con **Ruff**. En esta demo instalo el CLI en el venv, corro `python -m ruff check` sobre un archivo con `import sys` sin usar (código **F401**), borro el import y re-corro hasta “All checks passed!”. Observa el ciclo hallazgo → corrección → exit 0. La config vive en `pyproject.toml` (`E`, `F`, `I`), no solo en el editor.',
        code: {
          language: 'bash',
          title: 'Terminal + pyproject.toml',
          code: `# pyproject.toml ya tiene [tool.ruff] select = ["E","F","I"]
python -m pip install ruff

# Contenido inicial de hello_lint.py (import sin usar a propósito):
# import sys
# def main():
#     print("hola")
# if __name__ == "__main__":
#     main()

python -m ruff check hello_lint.py
# hello_lint.py:1:8: F401 [*] \`sys\` imported but unused
# → borra la línea "import sys" y repite:
python -m ruff check hello_lint.py
# All checks passed!
`,
          output: `hello_lint.py:1:8: F401 [*] \`sys\` imported but unused
All checks passed!`,
        },
        why: 'Ruff atrapa basura barata (imports muertos, errores F/E) antes del review. La config en pyproject.toml es el contrato del repo, no solo del editor. Ves el hallazgo, corriges y re-corres hasta exit 0 — el mismo ciclo que CI usará en el PR.',
        retrospective:
          'El mismo `ruff check` lo correrá CI en el PR. El error clásico es silenciar con `noqa` el día 1 en lugar de borrar el import muerto. En We Do escribirás la config mínima, limpiarás un script y argumentarás por qué no `select = ["ALL"]` el primer día.',
      },
      {
        demoId: 'S01-T4-B-DEMO',
        subtopicId: 'S01-T4-B',
        environment: 'local-python',
        description: '.gitignore, .env.example y README de instalación',
        preamble:
          'Un clon limpio no adivina secretos ni descarga 200 MB de `site-packages`. Observa el paquete mínimo: `.gitignore` (`.venv/`, `venv/`, `.env`…), `.env.example` **sin secretos**, y README de install. Verifica con `git check-ignore -v .env` que el secreto real no se versiona. Datos y PII reales no entran al repo; el esqueleto CP-N1-A usará CSV sintético.',
        code: {
          language: 'bash',
          title: 'Terminal — ignore + env example',
          code: `# Crea .gitignore (.venv/, venv/, .env, …), .env.example y README
git add .gitignore .env.example README.md
git status
git check-ignore -v .env
`,
          output: `A  .env.example
A  .gitignore
A  README.md
.gitignore:5:.env    .env`,
        },
        why: '`.env` se ignora; `.env.example` se versiona **sin secretos**. El README cierra el circuito de un clon limpio: install + smoke sin adivinar. `git check-ignore -v .env` es la prueba observable de que el secreto real no entra al stage. Si un archivo ya estaba versionado, el ignore solo no lo saca: hace falta `git rm --cached` y un commit.',
        retrospective:
          'Ignore + example + README cierran el circuito “un colega clona y arranca”. El malentendido: “agregar al `.gitignore` saca el archivo del historial” (hace falta `git rm --cached` si ya estaba versionado). En We Do completarás ignore, `.env.example` y el checklist de máquina limpia del capstone.',
      },
    ],
  },
  weDo: {
    intro:
      'Andamiaje decreciente por subtema: **E1 guiado → E2 independiente → E3 transferencia**. Completa T1–T4 (24 ejercicios con id `S01-T*-E*`). Los demos del I Do ya te mostraron comandos reales; aquí rellenas huecos, diagnosticas y trasladas lo aprendido a escenarios de equipo. Usa las dos pistas si te trabas; solo entonces revisa la solución. Al final, el You Do cierra el **esqueleto CP-N1-A** (sin validador aún — solo repo clonable).',
    steps: [
      {
        subtopicId: 'S01-T1-A',
        kind: 'guided',
        title: 'Completar transcript REPL (suma, type, sys)',
        preamble:
          '- **Contexto:** en inducción te piden “ábrelo en el intérprete” antes de tocar el repo.\n- **Meta:** practicar una sesión REPL mínima (evaluar, inspeccionar tipo, leer versión) y salir bien.\n- **Éxito:** diálogo completo: `2+2 → 4`; `type("…")` es `str`; `sys.version.split()[0]` tipo `3.x.y`; `quit()` vuelve a la shell.\n- **Límites:** no crees un `.py`; no cierres la ventana de la terminal al salir del REPL; usa `python3` si `python` no responde.',
        id: 'S01-T1-A-E1',
        instruction:
          '1. Abre el REPL con el mismo comando que usaste en el I Do.\n2. Completa los `____` del transcript (suma, `type`, `import sys`, versión corta, salida).\n3. Reproduce la sesión en tu terminal real.\n4. Verifica el checklist del ejercicio (no solo rellenar el archivo-guía).',
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
          'Si completaste el diálogo y lo reproduciste en tu máquina, ya separas "probar en REPL" de "guardar en archivo". El malentendido típico: creer que `quit()` cierra la laptop. Siguiente: un script real.',
        retrospective:
          'El REPL es laboratorio de bolsillo; el script es lo que versionas. El malentendido: creer que `quit()` cierra la laptop o la shell. Pregunta de auto-chequeo: ¿qué comando te devuelve al prompt `$`/`PS>` sin matar la terminal? Siguiente: un `.py` con entrypoint.',
        starterCode: {
          language: 'python',
          title: 'repl_transcript.py (solo como guía — ejecuta en el REPL real)',
          code: `# CASO-LIM-001 · laboratorio REPL
# TAREA: completa los ____ y reproduce la sesión en tu terminal real
# Éxito: cumple el checklist (suma, type, sys.version, quit)
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
# '3.12.3'   # o la 3.12+ de tu máquina; 3.10+ aceptable si documentas
# >>> quit()`,
          output: `4
<class 'str'>
'3.12.3'`,
        },
      },
      {
        subtopicId: 'S01-T1-A',
        kind: 'independent',
        title: 'Script `hello_sys.py` con entrypoint',
        preamble:
          '- **Contexto:** el smoke del entorno en equipos se entrega como archivo, no como chat del REPL.\n- **Meta:** escribir un script que imprima nombre sintético y versión de Python con `sys`.\n- **Éxito:** `python hello_sys.py` → exit 0; stdout con nombre y `Python 3.x…`; usa `if __name__ == "__main__":`.\n- **Límites:** no PII real; no `pip install`; no entregar solo líneas pegadas en el REPL.',
        id: 'S01-T1-A-E2',
        instruction:
          '1. Completa los `____` en `main` (nombre sintético, `sys.version`).\n2. Completa el guardián `if __name__ == "__main__":` llamando a `main()`.\n3. Ejecuta `python hello_sys.py` (o `python3`) y confirma exit 0.',
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
          'Si el script corre con un solo comando y no dependiste del REPL para la entrega, ya diste el salto script vs interactivo. El malentendido: “si imprime en el REPL, ya entregué”.',
        retrospective:
          'El entrypoint deja claro qué corre en producción vs import. El malentendido: “si imprime en el REPL, ya entregué”. Auto-chequeo: ¿qué línea evita que `main()` corra al importar el módulo? Transfer: mismo patrón en `scripts/hello_env.py` del You Do.',
        starterCode: {
          language: 'python',
          title: 'hello_sys.py',
          code: `# CASO-LIM-001 · hello_sys.py nombre+versión
# TAREA: completa los ____ (nombre, sys.version, entrypoint)
# Éxito: python hello_sys.py → exit 0 con nombre y versión 3.x
import sys

def main():
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

def main():
    nombre = "Maria Quispe"
    version = sys.version.split()[0]
    print(f"Hola, soy {nombre}")
    print(f"Python {version}")

if __name__ == "__main__":
    main()`,
          output: `Hola, soy Maria Quispe
Python 3.12.3`,
        },
      },
      {
        subtopicId: 'S01-T1-A',
        kind: 'transfer',
        title: 'Diagnosticar intérprete ausente (Win/Unix)',
        preamble:
          '- **Contexto:** un compañero de inducción no puede correr `python --version` y te escribe por chat.\n- **Meta:** dejar un procedimiento de 4–6 pasos verificable (fuente oficial + OS).\n- **Éxito:** rúbrica del ejercicio: fuente oficial; verifica `--version`; distingue Windows vs Unix; 4–6 pasos claros; sin hacks inseguros.\n- **Límites:** solo python.org / instaladores oficiales; no “desactivar seguridad del SO”; no force-push ni trucos de admin innecesarios.',
        id: 'S01-T1-A-E3',
        instruction:
          '1. Lee los casos A (Windows) y B (macOS/Linux) del starter.\n2. Completa los pasos numerados y la verificación final.\n3. Entrega el markdown; no hace falta instalar por el revisor si documentas comandos y resultado esperado.',
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
          'Un analista que diagnostica "qué python responde" antes de pedir ayuda en Slack ahorra horas al equipo. El malentendido: instalar un segundo Python sin anotar cuál está en el PATH. Mismo reflejo con venv y CI.',
        retrospective:
          'Diagnosticar “qué binario responde” antes de culpar a pandas ahorra horas. El malentendido: instalar un segundo Python sin anotar cuál está en el PATH. Auto-chequeo: tras cambiar PATH, ¿qué haces con la terminal abierta? Transfer: mismo reflejo con `venv` y con CI.',
        starterCode: {
          language: 'markdown',
          title: 'diagnostico_interprete.md',
          code: `# CASO-LIM-001 · diagnóstico Windows python
# TAREA: completa los ____ del procedimiento (fuente oficial + OS)
# Éxito: 4–6 pasos claros y verificación final 3.12+
# Diagnóstico: intérprete no encontrado

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
        subtopicId: 'S01-T1-B',
        kind: 'guided',
        title: 'Documentar exit 0 y exit 1 en tu shell',
        preamble:
          '- **Contexto:** CI y cron leen un entero al terminar tu script, no el emoji del log.\n- **Meta:** ejecutar salidas controladas `0` y `1` y **leer** el código en tu shell.\n- **Éxito:** documentas `codigo_ok=0` y `codigo_fail=1` (o equivalentes) y nombras la shell (bash/zsh/PowerShell).\n- **Límites:** sin rutas de usuario reales ni secretos; en PowerShell usa `$LASTEXITCODE`, no `$?`.',
        id: 'S01-T1-B-E1',
        instruction:
          '1. Completa los `sys.exit(____)` del lab (0 luego 1).\n2. Tras cada comando, imprime el código de salida de tu shell.\n3. Anota `SHELL_USADA=…`.\n4. Guarda el transcript sin PII.',
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
          'Si leíste el código de salida dos veces seguidas, ya tienes el hábito que CI usa en cada job. El malentendido: “imprimió ok, entonces exit 0”. Siguiente: un script que elija 0 o 1 según argumentos.',
        retrospective:
          'Mensaje en pantalla y exit code son canales distintos: CI lee el entero. Auto-chequeo: en PowerShell, ¿qué variable da el código del último programa nativo? Cuando un job “se ve bien” pero el pipeline para, mira ese número antes de culpar a la librería. Siguiente: un script que elige 0/1 según argumentos.',
        starterCode: {
          language: 'bash',
          title: 'exit_codes_lab.sh (o .ps1 equivalente)',
          code: `# CASO-LIM-001 · exit codes 0 y non-zero
# TAREA: completa los ____ y ejecuta en tu shell
# Éxito: documentas exit 0 y exit 1 con $? o $LASTEXITCODE

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
        subtopicId: 'S01-T1-B',
        kind: 'independent',
        title: '`check_arg.py`: un arg → 0; si no → 1',
        preamble:
          '- **Contexto:** los jobs de intake fallan con código no cero cuando faltan argumentos.\n- **Meta:** implementar el contrato argc con `sys.argv` y `sys.exit`.\n- **Éxito:** `python check_arg.py hola` → exit 0 y `OK:hola`; sin args o con dos → exit 1 y uso en **stderr**.\n- **Límites:** no ignores args extra; no imprimas el uso solo en stdout.',
        id: 'S01-T1-B-E2',
        instruction:
          '1. Completa `len(args)`, `sys.stderr` y los `sys.exit`.\n2. Prueba: un arg, cero args, dos args.\n3. Confirma códigos con `echo $?` / `$LASTEXITCODE`.',
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
          'Un entrypoint con códigos de salida predecibles es la base de scripts de intake y de jobs en cron/CI. El malentendido: tomar solo el primer arg y silenciar el resto. En S02–S04 reutilizarás este patrón al validar registros.',
        retrospective:
          'Entrypoint predecible es la base de validadores y cron. El malentendido: tomar solo el primer arg y silenciar el resto. Auto-chequeo: ¿dónde debe ir el mensaje de uso? Transfer: S02–S04 reutilizan el patrón al validar registros.',
        starterCode: {
          language: 'python',
          title: 'check_arg.py',
          code: `# CASO-LIM-001 · check_arg.py argc
# TAREA: completa los ____ (len, stderr, exit 0/1)
# Éxito: un arg → OK:… exit 0; sin arg o >1 → uso en stderr exit 1
import sys

def main():
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

def main():
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
        subtopicId: 'S01-T1-B',
        kind: 'transfer',
        title: 'Clasificar fallo de pip: PATH vs intérprete',
        preamble:
          '- **Contexto:** ticket de inducción: “pip install pandas no me funciona”.\n- **Meta:** separar “la shell no encuentra `pip`” de “instalé en otro Python”.\n- **Éxito:** clasificas A y B; 3 pasos por escenario; priorizas `python -m pip` y `sys.executable`; sin reinstalls de SO innecesarios.\n- **Límites:** sin secretos; no culpes a pandas hasta verificar el intérprete.',
        id: 'S01-T1-B-E3',
        instruction:
          '1. Clasifica escenario A y B en el markdown.\n2. Escribe 3 pasos de verificación por escenario.\n3. Completa el “comando preferido del curso”.',
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
          'Separar "no está en el PATH" de "instalé en otro Python" es el 80 % de los tickets de inducción. El malentendido: “si `pip` corrió, el import tiene que funcionar”. Llévalo al checklist del día 1.',
        retrospective:
          'El 80 % de tickets de setup son PATH o wrong interpreter. El malentendido: “si `pip` corrió, el import tiene que funcionar”. Auto-chequeo: ¿qué imprimes con `sys.executable`? Transfer: checklist del día 1 del You Do.',
        starterCode: {
          language: 'markdown',
          title: 'diagnostico_pip_vs_path.md',
          code: `# CASO-LIM-001 · pip PATH vs intérprete
# TAREA: clasifica A/B y completa los 3 pasos por escenario
# Éxito: priorizas python -m pip y sys.executable
# pip falla: ¿PATH o paquete/intérprete?

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
        subtopicId: 'S01-T2-A',
        kind: 'guided',
        title: 'Crear, activar y desactivar `.venv`',
        preamble:
          '- **Contexto:** un proyecto = un entorno aislado; no mezcles dependencias en el Python del sistema.\n- **Meta:** crear `.venv`, activarlo y probar que `sys.prefix` apunta a esa carpeta; luego `deactivate`.\n- **Éxito:** carpeta `.venv` existe; tras activate, `sys.prefix` contiene `.venv`; tras deactivate, sales del entorno del proyecto.\n- **Límites:** no instales paquetes aún; no uses el Python global a propósito; en PowerShell, si `Activate.ps1` falla por política, documenta `RemoteSigned` (CurrentUser) o `activate.bat`.',
        id: 'S01-T2-A-E1',
        instruction:
          '1. Entra a la carpeta de práctica del starter.\n2. Completa create / activate / print `sys.prefix` / deactivate.\n3. Marca el checklist del ejercicio.',
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
          'Si creaste, activaste y desactivaste sin instalar nada global, ya dominas el ciclo de vida mínimo del entorno. El malentendido: confundir la carpeta del repo con el PATH. Siguiente: recrear un entorno roto.',
        retrospective:
          'Activar no es ceremonia: sin activar, `pip` cae en el global. El malentendido: confundir la carpeta del repo con el PATH. Auto-chequeo: ¿qué string debe terminar `sys.prefix`? Siguiente: recrear un entorno roto.',
        starterCode: {
          language: 'bash',
          title: 'lab_venv.sh',
          code: `# CASO-LIM-001 · crear .venv y activar
# TAREA: completa los ____ (carpeta, activate, sys.prefix, deactivate)
# Éxito: sys.prefix termina en .venv; luego deactivate
mkdir -p lab_venv_t2a && cd lab_venv_t2a

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
        subtopicId: 'S01-T2-A',
        kind: 'independent',
        title: 'Recrear un `.venv` roto sin tocar el código',
        preamble:
          '- **Contexto:** un `site-packages` corrupto se repara recreando el entorno, no “a mano”.\n- **Meta:** borrar/recrear `.venv` limpio preservando scripts del proyecto.\n- **Éxito:** activate funciona; `sys.prefix` es el nuevo `.venv`; los `.py` del proyecto siguen existiendo.\n- **Límites:** no uses conda ni reinstales el Python del sistema; no borres la raíz del proyecto.',
        id: 'S01-T2-A-E2',
        instruction:
          '1. `deactivate` si estás dentro del venv viejo.\n2. Elimina `.venv` y créalo de nuevo.\n3. Activa y verifica `sys.prefix`.\n4. Confirma que tu código fuente permanece.',
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
          'Recrear el entorno es la respuesta profesional a un site-packages corrupto. El malentendido: editar archivos dentro de `site-packages`. En equipos: “borra el venv y reinstala desde requirements”.',
        retrospective:
          '“Borra el venv y reinstala desde requirements” es frase de equipo. El malentendido: editar archivos dentro de `site-packages`. Auto-chequeo: ¿dónde viven tus `.py` respecto a `.venv`? Transfer: T2-B cierra el freeze/`install -r`.',
        starterCode: {
          language: 'bash',
          title: 'recrear_venv.sh',
          code: `# CASO-LIM-001 · venv roto recrear
# TAREA: completa los ____ para borrar y recrear .venv sin tocar el código
# Éxito: activate funciona y hello.py sigue en el proyecto
# Supón que ya tienes hello.py en el proyecto y un .venv roto.
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
        subtopicId: 'S01-T2-A',
        kind: 'transfer',
        title: 'Argumentar por qué no `pip` global',
        preamble:
          '- **Contexto:** un colega quiere `pip install pandas` en el Python global “para no perder tiempo”.\n- **Meta:** explicar el riesgo de versiones cruzadas y proponer el flujo `.venv`.\n- **Éxito:** conflicto de versiones A vs B; flujo create→activate→pip por proyecto; `venv` es stdlib; tono profesional; sin sudo ni install global.\n- **Límites:** sin afirmaciones salariales; conda/uv pueden mencionarse como opcionales, no como único camino.',
        id: 'S01-T2-A-E3',
        instruction:
          '1. Completa el escenario de conflicto (dos proyectos, dos versiones).\n2. Lista el flujo recomendado en 3 pasos.\n3. Anota que `venv` es stdlib y el nombre canónico `.venv`.',
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
          'Saber argumentar el aislamiento de dependencias es parte de la inducción: no solo “cómo”, sino “por qué no lo hacemos global”. El malentendido: “un solo Python global siempre es más simple”.',
        retrospective:
          'Aislar dependencias es decisión de inducción, no preferencia estética. El malentendido: “un solo Python global siempre es más simple”. Auto-chequeo: ¿qué pasa si A necesita pandas 1.x y B 2.x? Transfer: lo defenderás en el README del You Do.',
        starterCode: {
          language: 'markdown',
          title: 'por_que_venv.md',
          code: `# CASO-LIM-001 · no pip global
# TAREA: completa escenario, flujo .venv y nota sobre stdlib
# Éxito: argumentas aislamiento sin pip global ni sudo
# ¿Por qué no instalar pandas en el Python global?

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
- conda/uv existen y son útiles en otros contextos; aquí el default es venv por portabilidad en inducción.`,
          output: 'Argumento de aislamiento con escenario de dos versiones; flujo .venv claro.',
        },
      },
      {
        subtopicId: 'S01-T2-B',
        kind: 'guided',
        title: 'Pin, freeze y verificar `requirements.txt`',
        preamble:
          '- **Contexto:** el snapshot pinneado es lo que un colega o CI reinstala el día 1.\n- **Meta:** instalar un tercero pinneado, generar freeze y comprobar la línea `paquete==versión`.\n- **Éxito:** existe `requirements.txt` con al menos `requests==…` (o el paquete que uses); sin secretos ni rutas absolutas de usuario.\n- **Límites:** solo con `.venv` activado; siempre `python -m pip` (no `pip` suelto); no freezes del Python global.',
        id: 'S01-T2-B-E1',
        instruction:
          '1. Activa el venv y confirma con `sys.prefix` (debe contener `.venv`).\n2. Completa install pinneado y `python -m pip freeze > requirements.txt`.\n3. Verifica con `grep` e `import` que la versión del paquete coincide con el archivo.',
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
          'Si el freeze refleja solo tu venv de proyecto, ya tienes el hábito de snapshot. El malentendido: “si listó muchos paquetes, está mal” (transitivas son normales). Siguiente: `install -r` en limpio.',
        retrospective:
          'Freeze del entorno equivocado es peor que no tener freeze. El malentendido: “si listó muchos paquetes, está mal” (transitivas son normales). Auto-chequeo: ¿qué miras en `sys.prefix` antes de freeze? Siguiente: `install -r` en limpio.',
        starterCode: {
          language: 'bash',
          title: 'lab_freeze.sh',
          code: `# CASO-LIM-001 · pip pin + freeze
# TAREA: completa versión pinneada, freeze y verificación
# Éxito: requirements.txt contiene requests==…
source .venv/bin/activate   # o Activate.ps1 en Windows

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
        subtopicId: 'S01-T2-B',
        kind: 'independent',
        title: 'Replicar deps con `install -r` en limpio',
        preamble:
          '- **Contexto:** un clon limpio no hereda tu carpeta `.venv`; hereda el archivo de contrato.\n- **Meta:** crear un segundo entorno e instalar solo desde `requirements.txt`.\n- **Éxito:** en el env limpio, import del paquete pinneado OK y versión alineada al archivo.\n- **Límites:** no copies `site-packages`; no verifiques en el venv viejo por error.',
        id: 'S01-T2-B-E2',
        instruction:
          '1. Crea `.venv_replica` (o recrea limpio).\n2. Activa e `install -r requirements.txt`.\n3. Confirma con import / `pip list`.',
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
          'Replicar desde -r es exactamente lo que hará un colega o CI. El malentendido: “funciona en mi venv viejo, basta”. Si funciona en limpio, tu snapshot es útil.',
        retrospective:
          'Si funciona en limpio, tu snapshot es útil para el equipo. El malentendido: “funciona en mi venv viejo, basta”. Auto-chequeo: ¿qué archivo es el contrato, no la carpeta? Transfer: paso 3 del checklist de máquina limpia del You Do.',
        starterCode: {
          language: 'bash',
          title: 'lab_install_r.sh',
          code: `# CASO-LIM-001 · requirements clean
# TAREA: instala desde -r en un entorno limpio y verifica import
# Éxito: import requests OK en .venv_replica
# Parte de un requirements.txt existente en la raíz
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
        subtopicId: 'S01-T2-B',
        kind: 'transfer',
        title: 'Forense de `ModuleNotFoundError`',
        preamble:
          '- **Contexto:** `import requests` falla; a veces nunca se instaló, a veces se instaló en otro Python.\n- **Meta:** protocolo de 5 pasos con `sys.executable` y `python -m pip`.\n- **Éxito:** hipótesis A/B; 5 pasos; clasifica stdlib vs terceros; sin reinstalls de SO.\n- **Límites:** no trates `datetime`/`sys` como paquetes de pip; no subas secretos en el informe.',
        id: 'S01-T2-B-E3',
        instruction:
          '1. Completa hipótesis A y B.\n2. Rellena el protocolo de 5 pasos.\n3. Marca requests vs datetime (terceros vs stdlib).',
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
          'Este protocolo es el mismo que usarás cuando pandas “desaparece” tras cambiar de terminal o de IDE. El malentendido: reinstalar el SO porque falló un import.',
        retrospective:
          'Primero el intérprete, después el paquete. El malentendido: reinstalar el sistema operativo porque falló un import. Auto-chequeo: ¿`pip show` debe usarse con el mismo `python`? Transfer: cuando “pandas desaparece” al cambiar de terminal o de IDE.',
        starterCode: {
          language: 'markdown',
          title: 'forense_modulenotfound.md',
          code: `# CASO-LIM-001 · ModuleNotFoundError forense
# TAREA: completa hipótesis A/B y el protocolo de 5 pasos
# Éxito: usas sys.executable y python -m pip; clasificas stdlib vs terceros
# Forense ModuleNotFoundError

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
        subtopicId: 'S01-T3-A',
        kind: 'guided',
        title: 'Primer commit Conventional Commits',
        preamble:
          '- **Contexto:** el historial es la memoria del equipo; un mensaje vacío no sirve en review.\n- **Meta:** `git init`, un archivo, un commit con prefijo `docs:` o `feat:`.\n- **Éxito:** `git log -1` muestra un subject que cumple `feat|fix|docs|chore|refactor|test:` + descripción.\n- **Límites:** no “wip”, no mensaje vacío, no subas `.venv` ni secretos.',
        id: 'S01-T3-A-E1',
        instruction:
          '1. Inicializa el repo de práctica.\n2. Crea el README y haz `git add`.\n3. Commit con mensaje Conventional Commits.\n4. Verifica con `git log -1 --oneline`.',
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
          'Un solo commit bien nombrado ya es más profesional que diez “cambios”. El malentendido: hacer `commit` sin `git add` (o un mensaje vacío/`wip`). Si `git log -1` muestra `docs:` o `feat:` con descripción, cumpliste el contrato del historial. Siguiente: leer el diff del HEAD.',
        retrospective:
          'Un commit bien nombrado supera diez “cambios”. El malentendido: hacer commit sin `add`. Auto-chequeo: ¿el prefijo va en minúsculas con `:` y espacio? Siguiente: leer el diff del HEAD.',
        starterCode: {
          language: 'bash',
          title: 'lab_commit.sh',
          code: `# CASO-LIM-001 · git init commit
# TAREA: completa la rama inicial, git add y el mensaje Conventional Commits
# Éxito: la rama es main y git log -1 muestra docs: o feat: …
mkdir -p lab_git_t3a && cd lab_git_t3a
git init -b ____
echo "# lab" > README.md
git ____ README.md
git commit -m "____: agregar README de practica"
git branch --show-current
git log -1 --oneline`,
        },
        solutionCode: {
          language: 'bash',
          title: 'lab_commit.sh',
          code: `mkdir -p lab_git_t3a && cd lab_git_t3a
git init -b main
echo "# lab" > README.md
git add README.md
git commit -m "docs: agregar README de practica"
git branch --show-current
git log -1 --oneline`,
          output: `main
abc1234 docs: agregar README de practica`,
        },
      },
      {
        subtopicId: 'S01-T3-A',
        kind: 'independent',
        title: 'Leer `git show` y narrar el diff',
        preamble:
          '- **Contexto:** en un PR pasas más tiempo leyendo `+`/`−` que escribiendo código nuevo.\n- **Meta:** hacer un segundo commit y explicar qué muestra `git show HEAD`.\n- **Éxito:** markdown con las 3 respuestas; menciona líneas `+`/`−`; el commit existe en el log.\n- **Límites:** no mires solo `git diff` vacío post-commit; no entregues sin `git add`.',
        id: 'S01-T3-A-E2',
        instruction:
          '1. Modifica el README, stage y commit.\n2. Ejecuta `git show HEAD` (sin pager si hace falta).\n3. Responde las tres preguntas del starter.',
        hint: 'Tras el segundo commit, git show HEAD sin pager: GIT_PAGER=cat git show HEAD.',
        hints: [
          'Tras el segundo commit, git show HEAD sin pager: GIT_PAGER=cat git show HEAD.',
          'Archivo nuevo: todo el contenido aparece con +. Modificado: solo las líneas tocadas con +/−.',
        ],
        edgeCases: [
          'Mirar git diff después del commit (vacío) en lugar de git show',
          'No pasar el archivo a staging (`git add`) y creer que el commit incluye el cambio',
        ],
        tests:
          'Markdown responde las 3 preguntas; menciona +/−; commit existe en log.',
        feedback:
          'Leer diffs es la mitad del trabajo en code review. El malentendido: `git diff` después del commit “no muestra nada, Git está roto”. Si narras el cambio en una frase, ya redactas un buen cuerpo de PR.',
        retrospective:
          'Narrar el cambio en una frase es el cuerpo de un buen PR. El malentendido: `git diff` después del commit “no muestra nada, Git está roto”. Auto-chequeo: ¿archivo nuevo o modificado y cómo se ve? Transfer: review de colegas en T3-B.',
        starterCode: {
          language: 'markdown',
          title: 'lectura_diff.md',
          code: `# CASO-LIM-001 · git diff lectura
# TAREA: responde las 3 preguntas tras un commit real
# Éxito: narras líneas +/− y un resumen en una frase
# Lectura de diff

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
        subtopicId: 'S01-T3-A',
        kind: 'transfer',
        title: 'Elegir el mejor mensaje de commit',
        preamble:
          '- **Contexto:** tres mensajes candidatos para el mismo cambio (`scripts/hello_env.py` smoke).\n- **Meta:** elegir el más legible en historial de equipo y reescribir los otros al estilo Conventional Commits.\n- **Éxito:** una elección justificada en 3–5 oraciones; reescrituras de los rechazados con prefijos válidos (`feat`/`fix`/`docs`/`chore`/…); sin defender `wip` en `main`.\n- **Límites:** no defiendas `wip` en `main`; evita prefijos inventados tipo `update:`; la justificación debe hablar de legibilidad para un colega, no solo de “gusto”.',
        id: 'S01-T3-A-E3',
        instruction:
          '1. Elige A, B o C y justifica.\n2. Reescribe los candidatos que rechaces como si fueran commits útiles.\n3. Entrega el markdown.',
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
          'Elegir mensajes es diseño de comunicación del equipo, no adorno. El malentendido: “wip es honesto, basta”. Un subject con tipo + artefacto permite leer el log sin abrir el diff. Si reescribiste los candidatos débiles con prefijos útiles, ya entrenas el hábito del You Do (≥3 Conventional Commits).',
        retrospective:
          'El historial es documentación ejecutable. El malentendido: “wip es honesto, basta”. Auto-chequeo: ¿qué tipo y artefacto comunica tu elección en una línea? Transfer: mensajes del You Do (≥3 Conventional Commits).',
        starterCode: {
          language: 'markdown',
          title: 'mejor_mensaje.md',
          code: `# CASO-LIM-001 · conventional commit
# TAREA: elige el mejor mensaje y reescribe los que rechaces
# Éxito: justificación legible + prefijos válidos
# Mejor mensaje de commit

Candidatos:
- A: \`wip\`
- B: \`feat: agregar smoke hello_env\`
- C: \`Actualicé cosas del setup\`

## Elección
____

## Justificación
____

## Reescritura del candidato rechazado 1
____

## Reescritura del candidato rechazado 2
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
        subtopicId: 'S01-T3-B',
        kind: 'guided',
        title: 'Crear rama `feat/practica-s01` y hacer commit',
        preamble:
          '- **Contexto:** el trabajo en curso no se mezcla a ciegas con `main`.\n- **Meta:** crear `feat/practica-s01`, un commit `feat:` y listar ramas.\n- **Éxito:** la rama existe; HEAD en esa rama; `git log -1` con prefijo `feat:`.\n- **Límites:** no force-push; no nombres con espacios; remoto opcional (flujo local basta).',
        id: 'S01-T3-B-E1',
        instruction:
          '1. Parte de `main`.\n2. `git switch -c feat/practica-s01`.\n3. Añade archivo, commit `feat:…`, lista ramas.',
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
          'Si el commit quedó en la feature branch, ya separas trabajo en curso de main. El malentendido: editar en `main` “y ya cambio de rama después”. Siguiente: narrar el PR.',
        retrospective:
          'Si el commit quedó en la feature branch, ya separas WIP de `main`. El malentendido: editar en `main` “y ya cambio de rama después”. Auto-chequeo: ¿qué muestra el `*` en `git branch`? Siguiente: redactar el PR.',
        starterCode: {
          language: 'bash',
          title: 'lab_branch.sh',
          code: `# CASO-LIM-001 · rama feat desde main
# TAREA: completa el nombre de rama y el prefijo del commit
# Éxito: HEAD en feat/practica-s01 con mensaje feat:
git switch main
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
        subtopicId: 'S01-T3-B',
        kind: 'independent',
        title: 'Redactar descripción de Pull Request',
        preamble:
          '- **Contexto:** el diff no cuenta solo el “por qué”; el cuerpo del PR lo hace.\n- **Meta:** título + resumen (3 bullets) + plan de prueba + checklist de seguridad para `hello_env` + README.\n- **Éxito:** archivo con esos bloques; pasos de prueba concretos; mención `.env`/secretos; sin PII.\n- **Límites:** no tokens reales; no “ver commits” vacío; remoto no obligatorio para la entrega del markdown.',
        id: 'S01-T3-B-E2',
        instruction:
          '1. Completa título al estilo Conventional Commits.\n2. Escribe 3 bullets de resumen orientados al revisor.\n3. Lista 3 comandos de prueba (venv, install -r, smoke).\n4. Cierra el checklist de seguridad.',
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
          'Una buena descripción de PR reduce ida y vuelta en review. El malentendido: el PR es solo el botón verde. Documenta el “por qué” que el diff no cuenta solo.',
        retrospective:
          'Una buena descripción reduce ida y vuelta en review. El malentendido: el PR es solo el botón verde. Auto-chequeo: ¿un revisor puede copiar tu plan de prueba sin adivinar? Transfer: PR real del You Do.',
        starterCode: {
          language: 'markdown',
          title: 'pr_hello_env.md',
          code: `# CASO-LIM-001 · PR description
# TAREA: completa título, resumen, plan de prueba y checklist
# Éxito: revisor puede copiar el cuerpo a GitHub sin adivinar
# Título del PR
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
        subtopicId: 'S01-T3-B',
        kind: 'transfer',
        title: 'Recuperar con `restore`/`stash` (sin force-push)',
        preamble:
          '- **Contexto:** editaste `README.md` sin commit y el cambio está mal; te proponen `reset --hard` o force-push a `main`.\n- **Meta:** procedimiento correcto no destructivo y por qué force-push a `main` no es opción.\n- **Éxito:** menciona `git restore`; `stash` como alternativa de guardado; prohíbe force-push a `main`; no pone `reset --hard` como default.\n- **Límites:** no reescribas historial compartido; distingue restore (working tree) de revert (commits hechos).',
        id: 'S01-T3-B-E3',
        instruction:
          '1. Completa el procedimiento con `restore` (y staged si aplica).\n2. Explica cuándo usar `stash`.\n3. Justifica el no a force-push y el no a hard como primer reflejo.',
        hint: 'restore descarta cambios no deseados en working tree; stash guarda para después. Ninguno reescribe main remoto.',
        hints: [
          'restore descarta cambios no deseados en working tree; stash guarda para después. Ninguno reescribe main remoto.',
          'reset --hard borra trabajo sin commit sin red de seguridad; no es el default de este curso.',
        ],
        edgeCases: [
          'Archivo ya staged: puede hacer falta git restore --staged y luego restore',
          'Confundir restore con revert (revert es para commits ya hechos)',
        ],
        tests:
          'Menciona git restore; menciona stash como alternativa de guardado; prohíbe force-push a main; no recomienda reset --hard como primera opción.',
        feedback:
          'La recuperación no destructiva es parte de la cultura de equipo. El malentendido: “force-push arregla push rechazado en main”. Quien no destruye historial ajeno genera confianza.',
        retrospective:
          'Quien no destruye historial ajeno genera confianza. El malentendido: “force-push arregla push rechazado en main”. Auto-chequeo: ¿qué comando descartaría un cambio local sin commit sin borrar el repo? Transfer: política del equipo en el README del capstone.',
        starterCode: {
          language: 'markdown',
          title: 'recuperacion_segura.md',
          code: `# CASO-LIM-001 · recuperación no destructiva
# TAREA: completa restore, stash y por qué no force-push a main
# Éxito: priorizas restore/stash; prohíbes force-push a main
# Recuperación no destructiva

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
1. \`git status\` para confirmar que el cambio es solo local y aún no tiene commit.
2. \`git restore README.md\` para volver al último contenido con commit (si estaba staged: \`git restore --staged README.md\` y luego \`git restore README.md\`).

## ¿Cuándo stash en su lugar?
Si *podrías* querer el cambio después: \`git stash push -m "wip readme"\` y más tarde \`git stash pop\`.

## Por qué NO force-push a main
Reescribe historial compartido y puede borrar commits de otras personas. El rechazo de un push se resuelve con pull/rebase en tu rama o con PR, no con force a main.

## Por qué no reset --hard como default
Borra cambios sin commit de forma fácil de lamentar. Primero restore/stash; hard solo con conciencia y backup.`,
          output: 'restore/stash primero; force-push a main prohibido.',
        },
      },
      {
        subtopicId: 'S01-T4-A',
        kind: 'guided',
        title: 'Config mínima de Ruff en `pyproject.toml`',
        preamble:
          '- **Contexto:** el linter del equipo debe ser el mismo en tu laptop y en CI.\n- **Meta:** completar `[tool.ruff]` y `select = ["E","F","I"]`.\n- **Éxito:** archivo con `line-length = 88`, `target-version`, y select E/F/I.\n- **Límites:** no pongas la config bajo `[tool.black]`; `select` es lista, no string `"E,F,I"`; no `ALL` el día 1.',
        id: 'S01-T4-A-E1',
        instruction:
          '1. Completa `line-length` y `target-version`.\n2. Completa la lista `select`.\n3. Guarda en la raíz del proyecto de práctica.',
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
          'Con la config en el repo, el linter deja de ser “gusto personal del IDE” y pasa a ser contrato del proyecto. El malentendido: copiar `select = ["ALL"]` de un blog el día 1.',
        retrospective:
          'Config en el repo convierte el gusto del IDE en contrato. El malentendido: copiar `select = ["ALL"]` de un blog. Auto-chequeo: ¿qué tres letras cubren errores baratos e imports? Siguiente: correr `ruff check` de verdad.',
        starterCode: {
          language: 'toml',
          title: 'pyproject.toml',
          code: `# CASO-LIM-001 · pyproject ruff mínimo
# TAREA: completa line-length, target-version y select (E, F, I)
# Éxito: config válida para ruff check con el mínimo del curso
[tool.ruff]
line-length = ____
target-version = "____"

[tool.ruff.lint]
select = [____, ____, ____]
`,
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
        subtopicId: 'S01-T4-A',
        kind: 'independent',
        title: 'Limpiar imports con `ruff check`',
        preamble:
          '- **Contexto:** CI fallará el PR por imports muertos antes de que un humano revise lógica.\n- **Meta:** instalar Ruff en el venv, chequear y corregir hasta exit 0.\n- **Éxito:** `python -m ruff check hello_lint.py` exit 0; el script sigue siendo Python válido y corre.\n- **Límites:** en S01 prefiere borrar imports sin usar; no abuses de `noqa`; no te limites a `format` sin arreglar F401.',
        id: 'S01-T4-A-E2',
        instruction:
          '1. Con venv activo, instala `ruff`.\n2. Corre `python -m ruff check hello_lint.py`.\n3. Elimina imports no usados y re-corre hasta verde.',
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
          'Cerrar el ciclo check → fix es el mismo músculo que usarás cuando CI falle por lint en un PR. El malentendido: “el editor no subrayó, entonces está bien” — el CLI es la fuente de verdad compartida.',
        retrospective:
          'El músculo check → fix es el de CI en rojo. El malentendido: “el editor no subrayó, entonces está bien” (el CLI es la fuente de verdad compartida). Auto-chequeo: ¿qué código Ruff es import sin usar? Transfer: `ruff check` limpio en `scripts/hello_env.py` del You Do.',
        starterCode: {
          language: 'python',
          title: 'hello_lint.py',
          code: `# CASO-LIM-001 · ruff check imports
# TAREA: instala ruff, corre ruff check y corrige hasta exit 0
# Éxito: python -m ruff check hello_lint.py → exit 0; el script sigue corriendo
import sys
import os
from datetime import datetime


def main():
    print("hola")
    print(datetime.now().date())


if __name__ == "__main__":
    main()
`,
        },
        solutionCode: {
          language: 'python',
          title: 'hello_lint.py',
          code: `from datetime import datetime


def main():
    print("hola")
    print(datetime.now().date())


if __name__ == "__main__":
    main()`,
          output: `hola
...`,
        },
      },
      {
        subtopicId: 'S01-T4-A',
        kind: 'transfer',
        title: 'Defender `select` mínimo (no ALL día 1)',
        preamble:
          '- **Contexto:** un lead propone `select = ["ALL"]` el día 1 en un repo con notebooks.\n- **Meta:** justificar un set pequeño (E/F/I) y un plan de ampliación.\n- **Éxito:** propuesta acotada; argumento ruido vs señal; cuándo ampliar; tono profesional.\n- **Límites:** no desactives el linter por completo; no copies configs de web backends sin adaptar.',
        id: 'S01-T4-A-E3',
        instruction:
          '1. Propón el `select`.\n2. Explica por qué no ALL el día 1.\n3. Resume qué cubren E, F e I.\n4. Define cuándo ampliar con acuerdo de equipo.',
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
          'Gobernar la calidad es priorizar señales. El malentendido: más reglas = más calidad automática. Un linter que el equipo respeta (E/F/I en verde) vale más que `ALL` ignorado el día 1. Si argumentaste ruido vs señal y un plan de ampliación, cumpliste el transfer.',
        retrospective:
          'Un linter respetado vale más que uno “perfecto” ignorado. El malentendido: más reglas = más calidad automática. Auto-chequeo: ¿qué pasa con la atención del equipo si CI grita 200 hallazgos el día 1? Transfer: política de calidad del esqueleto CP-N1-A.',
        starterCode: {
          language: 'markdown',
          title: 'ruff_select_minimo.md',
          code: `# CASO-LIM-001 · select ALL día 1
# TAREA: propone select mínimo y justifica por qué no ALL el día 1
# Éxito: set acotado + plan de ampliación
# Select mínimo para repo de datos (S01)

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
        subtopicId: 'S01-T4-B',
        kind: 'guided',
        title: 'Completar `.gitignore` mínimo Python/data',
        preamble:
          '- **Contexto:** un push accidental de `.venv` o `.env` es el error de higiene más caro del día 1.\n- **Meta:** ignore de entornos, bytecode, secretos y checkpoints Jupyter.\n- **Éxito:** `git check-ignore -v .env` confirma ignore; también cubre `.venv/` **y** `venv/`.\n- **Límites:** si un archivo ya estaba versionado, el ignore solo no lo saca (`git rm --cached`).',
        id: 'S01-T4-B-E1',
        instruction:
          '1. Completa las entradas del starter.\n2. En un repo de prueba, crea `.env` dummy y corre `git check-ignore -v .env`.\n3. Confirma que ambos nombres de entorno están listados.',
        hint: 'Una entrada por línea. Las barras finales marcan directorios.',
        hints: [
          'Una entrada por línea. Las barras finales marcan directorios.',
          'Incluye AMBOS: .venv/ y venv/. Si .env ya estaba versionado, git rm --cached .env tras el ignore.',
        ],
        edgeCases: [
          'Archivo ya versionado: el ignore no lo saca solo',
          'Olvidar .venv/ y solo poner venv/ (o al revés)',
        ],
        tests:
          'git check-ignore -v .env exit 0; check-ignore aplica a .venv o ruta de entorno.',
        feedback:
          'Un ignore correcto evita el push de 200MB de site-packages y de secretos. El malentendido: “con ignorar `.venv` basta; `venv` no se usa”. Es higiene, no opcional.',
        retrospective:
          'Ignore es higiene, no opcional. El malentendido: “con ignorar `.venv` basta; `venv` no se usa” (el ecosistema usa ambos). Auto-chequeo: ¿qué comando prueba el ignore de `.env`? Siguiente: `.env.example` sin secretos.',
        starterCode: {
          language: 'gitignore',
          title: '.gitignore',
          code: `# CASO-LIM-001 · .gitignore python/data
# TAREA: completa los ____ (entornos, bytecode, secretos)
# Éxito: git check-ignore -v .env confirma el ignore
# Entornos
____/
____/

# Bytecode
____/
____

# Secretos
____

# Jupyter
.ipynb_checkpoints/
`,
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
        subtopicId: 'S01-T4-B',
        kind: 'independent',
        title: 'Crear `.env.example` sin secretos',
        preamble:
          '- **Contexto:** el example es el contrato de configuración; el secreto vive fuera del repo.\n- **Meta:** ≥3 claves de un intake sintético con valores vacíos o ficticios no sensibles.\n- **Éxito:** archivo versionable con `KEY=`; sin patrones de secreto reales; `.env` real ignorado.\n- **Límites:** prohibido `sk-…`, passwords reales, connection strings con password; no subas `.env` “un momentito”.',
        id: 'S01-T4-B-E2',
        instruction:
          '1. Completa `API_URL`, `DB_HOST`, `LOG_LEVEL` (o equivalentes) con placeholders.\n2. Confirma que `.env` está en `.gitignore`.\n3. Revisa que no pegaste tokens de algún tutorial.',
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
          'El example es el contrato de configuración. El malentendido: poner el secreto en el README “para que funcione”. El secreto vive solo en la máquina o en un gestor de secretos del equipo.',
        retrospective:
          'Archivo de ejemplo versionado + `.env` local es el patrón de inducción. El malentendido: poner el secreto en el README “para que funcione”. Auto-chequeo: ¿qué archivo se versiona y cuál no? Transfer: criterio de uso responsable del You Do (20 %).',
        starterCode: {
          language: 'dotenv',
          title: '.env.example',
          code: `# CASO-LIM-001 · .env.example sintético
# TAREA: rellena placeholders de ejemplo (valores ficticios, sin secretos reales)
# Éxito: ≥3 KEY= con ejemplos no sensibles; .env real no se versiona
# Copia a .env y completa valores locales (nunca versiones .env)
API_URL=____
DB_HOST=____
LOG_LEVEL=____
`,
        },
        solutionCode: {
          language: 'dotenv',
          title: '.env.example',
          code: `# Copia a .env y completa valores locales (nunca versiones .env)
API_URL=https://example.com/api
DB_HOST=localhost
LOG_LEVEL=INFO
# Sin passwords ni tokens reales`,
          output: 'Trackeable; sin secretos.',
        },
      },
      {
        subtopicId: 'S01-T4-B',
        kind: 'transfer',
        title: 'Checklist de máquina limpia CP-N1-A',
        preamble:
          '- **Contexto:** un revisor debe clonar y validar tu esqueleto en ~10 minutos.\n- **Meta:** 5 ítems verificables (clon → venv → install -r → smoke → ignore `.env`) + datos sintéticos/diccionario.\n- **Éxito:** ≥5 ítems con comando y resultado esperado; menciona diccionario y CSV sintético; sin secretos ni paths de tu usuario.\n- **Límites:** no asumas `/Users/tu_nombre`; no PII real en el dataset de ejemplo.',
        id: 'S01-T4-B-E3',
        instruction:
          '1. Escribe 5 checkboxes observables del flujo de arranque.\n2. Completa la sección de datos (CSV + diccionario).\n3. Revisa que un desconocido podría tildarlos en otra laptop.',
        hint: 'Cada ítem debe ser observable (comando + resultado esperado), no “que se vea bonito”.',
        hints: [
          'Cada ítem debe ser observable (comando + resultado esperado), no “que se vea bonito”.',
          'Incluye: git check-ignore .env; python scripts/hello_env.py exit 0; existencia de data/data_dictionary.md.',
        ],
        edgeCases: [
          'Checklist que asume paths de tu laptop (Users/tu_nombre)',
          'Olvidar el uso responsable de los datos (PII real)',
        ],
        tests:
          '≥5 ítems; comandos concretos; menciona datos sintéticos/diccionario; sin secretos.',
        feedback:
          'Si un revisor puede clonar y pasar el checklist en 10 minutos, tu repo es profesional. El malentendido: criterios estéticos (“se ve ordenado”) en lugar de comandos. Ese es el listón de S01.',
        retrospective:
          'Si el checklist pasa, el repo es profesional. El malentendido: criterios estéticos (“se ve ordenado”) en lugar de comandos. Auto-chequeo: ¿puedes copiar un ítem y ejecutarlo en una VM limpia? Transfer: es el listón del You Do y del gate de S04.',
        starterCode: {
          language: 'markdown',
          title: 'checklist_maquina_limpia.md',
          code: `# CASO-LIM-001 · checklist máquina limpia CP-N1-A
# TAREA: escribe 5 ítems verificables (comando + resultado esperado)
# Éxito: clon → venv → install -r → smoke → ignore .env + datos sintéticos
# Checklist máquina limpia — esqueleto CP-N1-A

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
- [ ] 5. \`git check-ignore -v .env\` confirma ignore; \`.env.example\` está versionado

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
      'Este You Do es el **primer incremento del capstone CP-N1-A** (Validación de admisión de clientes y calidad de datos — *Client Intake & Data Quality*), que se cierra formalmente en S04. En S01 no construyes aún el validador completo; dejas un **repo clonable** con entorno reproducible, higiene Git, calidad mínima (Ruff), datos **sintéticos** y diccionario de datos. S02–S04 montarán el script de intake sobre este esqueleto. El repo puede llamarse `python-ds-journey` o similar; lo importante es la estructura y que un compañero arranque en minutos.',
    objectives: [
      'Publicar un repo clonable con `.gitignore` (`.venv/` y `venv/`), `.env.example`, `requirements.txt` y `pyproject.toml` (Ruff)',
      'Documentar en README install/run y la frase “esqueleto de CP-N1-A”',
      'Incluir `data/clients_synthetic.csv` (sintético) + `data/data_dictionary.md`',
      'Smoke `scripts/hello_env.py` con exit 0; mínimo 3 commits Conventional Commits y 1 rama feature (merge o PR abierto)',
    ],
    requirements: [
      'Repo público accesible (GitHub u otro remoto del curso)',
      '.gitignore excluye: .venv/, venv/, __pycache__/, *.pyc, .env, .ipynb_checkpoints/',
      '.env.example versionado sin secretos; .env nunca en el historial de la entrega',
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
# scripts/hello_env.py — smoke del entorno (sin type hints; S01 no los exige)
import sys

def main():
    print(f"Python {sys.version.split()[0]}")
    print("CP-N1-A skeleton OK")

if __name__ == "__main__":
    main()
`,
    portfolioNote:
      'Este repositorio es la base de tu portafolio de Nivel 1. Cuando llegues al gate de S04 (CP-N1-A completo), el revisor valorará que el esqueleto de S01 ya era clonable, sin secretos y con datos sintéticos. Cada sección suma evidencia; no reinicies el repo desde cero sin necesidad. En S01 basta el smoke y la higiene del repo — el validador de intake llega después.',
    retrospective:
      'Antes de marcar listo: (1) ¿qué comando del README demuestra en máquina limpia `venv` + `install -r` + smoke? (2) ¿qué cambia con datos reales de clientes vs. CSV sintético (PII, `.env`)? (3) Una frase de impacto medible en el README (p. ej. “clon → smoke en <10 min”) que puedas defender en 30 s en inducción. Malentendido: creer que el validador de S04 “arregla” un repo sin ignore, sin freeze o con secretos.',
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
        options: ['Para aislar las dependencias (paquetes) por proyecto y evitar conflictos de versiones', 'Para acelerar la ejecución del código Python', 'Para conectarse a internet más rápido al instalar paquetes', 'Para compilar Python a código de máquina más eficiente'],
        correctIndex: 0,
        explanation:
          'venv crea una carpeta con su propia instalación de Python y paquetes. Esto evita que actualizar pandas en un proyecto rompa otro proyecto que depende de una versión anterior.',
      },
      {
        question: '¿Cuál de los siguientes archivos SÍ debería estar en tu .gitignore?',
        options: ['requirements.txt', 'README.md', '.venv/ (o venv/)', 'hello.py'],
        correctIndex: 2,
        explanation:
          '`.venv/` y `venv/` pesan 100MB+ y se regeneran con `python -m pip install -r requirements.txt`. No subas el entorno: ensucia el repo y no aporta. requirements.txt y README.md sí van al remoto. hello.py es tu código fuente.',
      },
      {
        question: '¿Cuál es un buen mensaje de commit siguiendo Conventional Commits?',
        options: ['"cambios"', '"wip"', '"arreglé el bug de ayer"', '"feat: agregar cálculo de churn por segmento"'],
        correctIndex: 3,
        explanation:
          'Conventional Commits usa prefijos como feat:, fix:, docs:, refactor: seguidos de una descripción corta e imperativa. Esto permite generar changelogs automáticamente y hace el historial legible.',
      },
      {
        question: '¿Qué comando te permite replicar el entorno de otro desarrollador?',
        options: ['pip install pandas numpy', 'python -m pip install -r requirements.txt', 'python -m venv venv', 'git clone https://github.com/usuario/repo.git'],
        correctIndex: 1,
        explanation:
          '`python -m pip install -r requirements.txt` ata el instalador al mismo intérprete y lee versiones pinneadas del snapshot. `git clone` solo trae código; `python -m venv` crea el entorno vacío sin paquetes de terceros. Evita un `pip` suelto que pueda apuntar a otro Python.',
      },
      {
        question: '¿Por qué NO debes subir el archivo .env a GitHub?',
        options: ['Porque suele contener credenciales (API keys, passwords, tokens) que son secretos', 'Porque pesa demasiado y ralentiza el git push', 'Porque GitHub no soporta archivos sin extensión', 'Porque entra en conflicto con requirements.txt'],
        correctIndex: 0,
        explanation:
          'Los archivos .env guardan variables de entorno con secretos. Si los subes a un repo público, cualquiera puede usar tus credenciales. Es uno de los errores de seguridad más comunes y costosos en desarrollo. Usa `.env.example` sin secretos y deja `.env` en `.gitignore`.',
      },
      {
        question: '¿Qué significa un código de salida (exit code) igual a 1 en un script de Python?',
        options: ['Éxito', 'Que el script está pausado', 'Fallo controlado o error', 'Que faltan paquetes por instalar'],
        correctIndex: 2,
        explanation:
          'Por convención, exit 0 = éxito y cualquier valor distinto de 0 = fallo. `sys.exit(1)` señala a la shell, a CI o a un orquestador que el proceso falló y debe detenerse o reintentarse.',
      },
      {
        question: '¿En qué archivo se configura Ruff para un proyecto?',
        options: ['ruff.json', '.ruffrc', 'setup.cfg', 'pyproject.toml (sección [tool.ruff])'],
        correctIndex: 3,
        explanation:
          'Ruff lee su configuración de `pyproject.toml` bajo `[tool.ruff]` y `[tool.ruff.lint]`. Es el contrato del repo, no solo del editor: CI y tus compañeros usan el mismo archivo.',
      },
      {
        question: '¿Por qué está prohibido hacer `git push --force` a `main`?',
        options: ['Porque borra tu rama local', 'Porque puede borrar commits ajenos del historial compartido', 'Porque es lento', 'Porque GitHub no lo permite'],
        correctIndex: 1,
        explanation:
          'Force-push a `main` reescribe el historial compartido y puede borrar commits de otras personas. La recuperación segura es restore/stash/PR, no force-push. Reescribir historial solo es aceptable en ramas personales no compartidas y con permiso del equipo.',
      },
    ],
  },
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
      { label: 'Python — venv', url: 'https://docs.python.org/3/library/venv.html', note: 'Entornos virtuales oficiales (stdlib)' },
      { label: 'VS Code — Python extension', url: 'https://marketplace.visualstudio.com/items?itemName=ms-python.python', note: 'Extensión oficial de Microsoft' },
      { label: 'Git — official book', url: 'https://git-scm.com/book/es/v2', note: 'Libro gratuito de Git en español' },
      { label: 'Conventional Commits', url: 'https://www.conventionalcommits.org/', note: 'Estándar para mensajes de commit' },
      { label: 'GitHub Docs — Quickstart', url: 'https://docs.github.com/es/get-started/quickstart', note: 'Primeros pasos con GitHub' },
      { label: 'Ruff — documentation', url: 'https://docs.astral.sh/ruff/', note: 'Linter/formateador; pyproject.toml [tool.ruff]' },
      { label: 'pip — User Guide', url: 'https://pip.pypa.io/en/stable/user_guide/', note: 'python -m pip, requirements, freeze' },
    ],
    books: [
      {
        label: 'Python 101 (2nd ed.) — Michael Driscoll',
        note: 'Capítulos de instalación y setup del entorno. ISBN-13: 978-0996062879 · https://python101.pythonlibrary.org/',
      },
      {
        label: 'Python Basics / Real Python',
        note: 'Base de entorno profesional y convenciones. https://realpython.com/products/python-basics-book/ · también: https://realpython.com/python-virtual-environments-a-primer/',
      },
    ],
    courses: [
      { label: 'CS50P — Harvard', url: 'https://cs50.harvard.edu/python', note: 'Semana 0 cubre setup detalladamente' },
      { label: 'GitHub Skills', url: 'https://skills.github.com/', note: 'Labs interactivos oficiales de Git/GitHub (sucesor de Learning Lab)' },
    ],
  },
}
