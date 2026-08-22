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
    'Imagina tu primer día en un equipo distribuido: dos colegas en ciudades distintas deben correr el mismo proyecto y obtener el mismo resultado. Aquí aprendes a crear un entorno virtual (una carpeta con su propio Python y librerías), a usar Git para conservar el historial de cambios y a comprobar cada paso desde la terminal. El objetivo no es instalar cosas: es construir una cadena de evidencia que otra persona pueda repetir sin adivinar.',
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
    { text: 'Instalar VS Code y añadir las extensiones Python y Ruff, que son las que usarás en esta sección' },
    {
      text: 'Inicializar un repositorio Git (repo: carpeta con historial), hacer commit/push y abrir un Pull Request (propuesta de cambios) en GitHub',
    },
    {
      text: 'Escribir un requirements.txt (lista de paquetes y versiones) reproducible y un .gitignore (qué no subir a Git)',
    },
  ],
  theory: [
    {
            heading: "Dos equipos, dos unidades, una nave perdida",
      paragraphs: [
        "En 1999 la misión Mars Climate Orbiter se perdió porque dos equipos representaron las mismas medidas con unidades distintas. Nadie mintió y nadie se equivocó al calcular; simplemente, cada lado dio por supuesto algo que el otro no compartía. La versión cotidiana de ese desastre no destruye una nave: dos personas creen ejecutar «el mismo proyecto» con intérpretes o dependencias diferentes, los números salen distintos, y nada avisa.",
        "De ahí sale la única prueba que importa en esta sección, y no es un examen sino una escena: una colega en Nairobi, otra en Berlín, ambas clonan tu repositorio, crean su propio entorno aislado y ejecutan `python -m pip install -r requirements.txt`; después, la prueba mínima debe producir el resultado que tú documentaste. Si solo funciona en tu laptop, todavía no tienes un proyecto reproducible: tienes una casualidad local.",
        "Para llegar ahí hacen falta cuatro piezas y conviene saber qué hace cada una. El **intérprete** es el programa `python` que lee tu código y lo ejecuta; la **terminal** es la ventana de texto donde le das órdenes. El **entorno virtual** (una carpeta aislada con el Python y los paquetes del proyecto), que crea el módulo `venv`, es una cocina de laboratorio: guarda los ingredientes de este proyecto separados y etiquetados, para que instalar algo aquí no altere lo que otro proyecto ya usaba. **pip** es quien trae esos ingredientes de fuera, y **`requirements.txt`** es la lista escrita de cuáles son y en qué versión. Sin esa lista, «instala lo que haga falta» es una instrucción que cada persona interpreta distinto.",
        "La cuarta pieza guarda la historia en lugar del estado. **Git** (el sistema que conserva el historial de cambios) registra cómo el proyecto llegó a ser lo que es; la carpeta bajo su control se llama **repositorio**, copiarla desde un servidor como GitHub se llama **clonar**, y cada punto guardado del historial es un **commit** con su mensaje. Cuando quieres que alguien revise tus cambios antes de integrarlos, abres un **pull request**. Ninguna de estas palabras es difícil; lo difícil es que casi nunca te las explican antes de usarlas.",
        "La regla que ordena todo cabe en una línea: **un proyecto, un entorno virtual, un archivo de dependencias**. Y la pregunta que te acompaña de principio a fin es la de tu colega al otro lado del mundo: **¿podría reproducir esto sin preguntarme nada?** Cada afirmación que hagas en el caso `CASO-LIM-001` tendrá que dejar evidencia observable —la versión del intérprete, la ruta del entorno, las dependencias declaradas, el historial de Git y la ausencia de secretos en el repositorio—, porque en reproducibilidad la palabra de nadie cuenta.",
        "Usaremos Python 3.12, VS Code, Git y el módulo estándar `venv`. Existen alternativas válidas —PyCharm, GitLab, `conda`, `uv`—, pero introducirlas todas a la vez ocultaría el modelo mental. Primero dominarás una ruta portable y explícita; cuando entiendas qué problema resuelve cada pieza, cambiar de herramienta será una decisión informada y no un acto de fe.",
      ],
      callout: {
        type: 'tip',
        title: 'Si una palabra te frena, no la memorices todavía',
        content:
          'Los términos en negrita de este bloque vuelven a aparecer más adelante, cada uno con su demostración y su comprobación. Basta con que sepas a qué se refiere cada uno; el dominio llega al usarlos. Y si algo no funciona en tu máquina, ese es el material de la sección, no una interrupción de la sección.',
      },
     },
     {
      heading: "Contrato de la sección (referencia)",
      optional: true,
      paragraphs: [
        "Bloque de referencia. Ritmo, criterio de cierre y límites del caso.",
        "**Ritmo orientativo (unas 18 horas).** De tres a cuatro horas para el núcleo: Python, `venv`, `pip` y Git en local. De seis a ocho para GitHub, el pull request, Ruff y el `.gitignore`. El resto, para pulir el esqueleto CP-N1-A y la lista de comprobación de máquina limpia. No hace falta terminar el portafolio en un solo día: con el núcleo de tres o cuatro horas ya tendrás un intérprete, un entorno y un commit limpio.",
        "**Criterio de cierre (CASO-LIM-001).** Cada afirmación deja evidencia: versión del intérprete, ruta del entorno, dependencias declaradas con versión, historial de Git y ausencia de secretos en el repositorio. Ese esqueleto es la base de tu capstone, que cerrarás en S04.",
        "**Límites.** Sin datos personales reales y sin credenciales en el repositorio. Si una comprobación no se puede demostrar en una máquina recién instalada, todavía no cuenta como cerrada.",
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
     },
     {
      heading: 'El intérprete Python y el REPL',
      subtopicId: 'S01-T1-A',
      paragraphs: [
        'Un texto de Python no se ejecuta por sí solo, del mismo modo que una partitura no produce música sin intérprete. El **intérprete Python** lee las instrucciones y las convierte en acciones; por eso la primera pregunta no es «¿mi código está bien?», sino «¿qué Python está leyendo este código?». En la terminal puede responder como `python`, `python3` o `py`. Empieza con `--version`, anota la respuesta y conserva esa evidencia: para el curso apuntamos a **Python 3.12 o superior** (3.10+ es aceptable si lo documentas).',
        'El **REPL** (Read–Eval–Print Loop) es el modo interactivo del intérprete. Lo abres escribiendo solo `python` (o `python3`) y Enter. Verás el prompt `>>>` (el *prompt* es el indicador que muestra que el intérprete está esperando una instrucción tuya). Ahí puedes escribir una expresión, presionar Enter, y Python la evalúa al instante: `2 + 2` devuelve `4`, `type("hola")` devuelve `<class \'str\'>`. Es ideal para probar una idea en 10 segundos sin crear un archivo. Para salir: `quit()` o `exit()`, o el carácter de fin de archivo (Ctrl-D en macOS/Linux, Ctrl-Z y Enter en Windows). Salir del REPL **no cierra** tu terminal: vuelves al prompt de la shell (`$` o `PS>`).',
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
        'Supón que tu editor muestra Python 3.12, pero la terminal invoca Python 3.10. Ambos pueden ejecutar un `print`, de modo que el desacuerdo permanece oculto hasta que una dependencia falla. Para desenmascararlo, verifica **desde la shell** y en orden: versión del intérprete, una expresión en el REPL y la ruta de `pip` atada a ese mismo binario. La versión exacta es el ancla de todo lo que sigue.',
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
        'En un centro de operaciones, nadie puede mirar miles de pantallas para decidir qué proceso «parece» haber terminado bien. Las máquinas necesitan un contrato más sobrio: un entero. La **terminal** (bash, zsh o PowerShell) lanza procesos como `python`, `git` o `mkdir`; al terminar, cada uno devuelve un **código de salida**. Por convención, **0 significa éxito** y **cualquier valor distinto de 0 indica que el siguiente paso no debe darse por seguro**. Bash/zsh lo exponen con `echo $?`; PowerShell, con `echo $LASTEXITCODE`.',
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
      heading: 'Leer una línea de terminal: los conectores del día 1',
      subtopicId: 'S01-T1-B',
      paragraphs: [
        'Una receta dice «pica la cebolla **y luego** sofríela». El «y luego» no es un ingrediente: es el pegamento entre dos acciones. Las líneas de terminal funcionan igual. Además de los comandos hay unos pocos símbolos que deciden **a dónde va el resultado** y **qué ocurre después**. Sin ellos, las demos de hoy se vuelven caracteres que copias sin entender, y un error se vuelve imposible de diagnosticar. Son seis conectores y cinco comandos; con eso se lee cada línea que verás en esta sección.',
        '**Guardar la salida en un archivo.** Por omisión un comando escribe su resultado en pantalla. La **redirección** `>` envía la salida a un archivo en lugar de mostrarla, y **borra lo que ese archivo tuviera antes**. `>>` hace lo mismo pero **añade al final, sin borrar lo anterior**. Por eso `python -m pip freeze > requirements.txt` escribe la lista de paquetes desde cero, mientras que `echo "Setup con venv." >> README.md` agrega una línea al README existente. Confusión frecuente: usar `>` cuando querías `>>` deja el archivo con una sola línea y sin aviso.',
        '**Pasar la salida a otro comando.** La **tubería** `|` toma la salida del comando de la izquierda y la entrega como entrada al de la derecha, sin crear archivos intermedios. Así, `python -m pip list | head` significa «lista los paquetes y muéstrame solo el principio». **`head`** muestra las primeras líneas de lo que recibe. **`grep`** filtra y busca las líneas que contienen un texto: `grep -i "requests==" requirements.txt` busca esa dependencia ignorando mayúsculas.',
        '**Encadenar dos comandos.** `&&` ejecuta el segundo comando **solo si el anterior tuvo éxito**, es decir si devolvió código de salida 0: `mkdir -p lab_venv && cd lab_venv` entra a la carpeta únicamente si se pudo crear. `||` es el complemento: ejecuta el segundo **si el primero falla**. Por eso `which python || where python` prueba primero el comando de macOS/Linux y recurre al de Windows cuando el primero no existe. Ambos operadores se apoyan en el código de salida que acabas de aprender.',
        '**Carpetas y ubicación de programas.** **`mkdir`** crea una carpeta, y con la opción `-p` no falla si esa carpeta ya existía. **`rm -rf`** borra una carpeta con todo su contenido y no pide confirmación, así que escríbelo despacio y úsalo solo sobre carpetas de práctica. **`which`** (macOS/Linux) y **`where`** (Windows) responden dónde está el programa que se ejecutaría: la ruta que el PATH encontró primero.',
        '**Silenciar un error esperado.** Un programa tiene dos salidas separadas: el resultado normal y los mensajes de error. `2>` redirige **solo los errores**, y `/dev/null` es un destino especial que descarta todo lo que recibe. Por eso `comando 2>/dev/null` ejecuta el comando y descarta sus mensajes de error en vez de ensuciar la pantalla. En un starter verás `2>/dev/null || true`: «no muestres el error y, si el comando falla, continúa igual». El equivalente habitual en PowerShell es `2>$null`.',
      ],
      code: {
        language: 'bash',
        title: 'Los conectores, uno por uno',
        code: `# 1) mkdir -p crea la carpeta; && entra solo si se creó bien
mkdir -p lab_conectores && cd lab_conectores

# 2) > escribe desde cero (borra lo anterior)
echo "primera linea" > notas.txt

# 3) >> anade al final (conserva lo anterior)
echo "segunda linea" >> notas.txt

# 4) | pasa la salida de un comando al siguiente; head muestra el principio
cat notas.txt | head -1

# 5) grep filtra las lineas que contienen un texto
grep "segunda" notas.txt

# 6) || ejecuta el segundo solo si el primero falla
which python3 || where python3

# 7) 2>/dev/null descarta el mensaje de error de un comando que no existe
comando_que_no_existe 2>/dev/null
echo $?

# 8) limpieza: rm -rf borra la carpeta de practica y su contenido
cd ..
rm -rf lab_conectores`,
        output: `primera linea
segunda linea
/usr/bin/python3
127`,
      },
    },
    {
      heading: 'cwd, PATH y códigos de salida en la shell',
      subtopicId: 'S01-T1-B',
      paragraphs: [
        'Piensa en **cwd** y **PATH** como dos respuestas a preguntas distintas: «¿en qué habitación estoy?» y «¿en qué directorios busca herramientas el sistema?». Ya viste `sys.exit` dentro de Python; ahora comprobarás desde la shell que cambiar de habitación no instala una herramienta y que encontrar la herramienta no garantiza encontrar tu archivo. El código de salida confirma el resultado sin depender del color o del texto de la consola.',
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
        'Un taller ordenado no confunde el banco de trabajo con la herramienta ni con el cuaderno de registro. Nuestro stack también separa responsabilidades: Python ejecuta, VS Code ayuda a escribir e inspeccionar, Git conserva la historia y GitHub aloja una copia remota para colaborar. Instala y verifica cada pieza por separado; si una falla, sabrás qué contrato reparar en vez de reinstalar todo al azar.',
        'Una decisión clave es **qué frontera de dependencias usar**. `venv` viene con Python y resuelve el alcance de esta sección sin introducir otro gestor. `conda` puede ser adecuado cuando un equipo ya depende de su ecosistema o necesita gestionar componentes no Python; `uv`, Poetry y PDM ofrecen otros flujos. No los descartamos: los posponemos para que primero puedas explicar qué se aísla, cómo se reproduce y qué herramienta es responsable de cada paso.',
        'Python trae una **biblioteca estándar** con módulos como `sys`, `datetime`, `os` y `json`; se importan sin `pip install`. Paquetes de terceros como `pandas`, `numpy` o `matplotlib` se distribuyen por separado y deben instalarse en el entorno activo. Ante `ModuleNotFoundError`, no instales por reflejo: identifica primero si el nombre pertenece a la biblioteca estándar, a un paquete externo ausente o a un módulo de tu propio proyecto.',
        '**Antes de instalar nada, abre la terminal**, porque es donde comprobarás cada pieza. En **Windows** pulsa la tecla Windows, escribe `PowerShell` y ábrelo. En **macOS** pulsa Command + Espacio, escribe `Terminal` y pulsa Enter. En **Linux** (Ubuntu y derivados) usa Ctrl + Alt + T, o busca «Terminal» en el menú de aplicaciones. Se abrirá una ventana con una línea de texto esperando: eso es el **prompt**, el punto donde escribes un comando y pulsas Enter. No necesitas configurarla; solo tenerla abierta a un lado mientras avanzas.',
        '**Instalar Git y GitHub CLI.** Git no viene preinstalado en Windows y en macOS puede pedirte las herramientas de desarrollo. Descarga el instalador desde `https://git-scm.com/downloads`, acepta las opciones por defecto y **cierra y vuelve a abrir la terminal** para que reconozca el comando nuevo. En macOS con Homebrew basta `brew install git`; en Ubuntu, `sudo apt install git`. **GitHub CLI** (el comando `gh`) es una herramienta aparte que sirve para iniciar sesión en GitHub desde la terminal: instálala desde `https://cli.github.com/` (o con `brew install gh` / `sudo apt install gh`). Necesitarás además una **cuenta gratuita** en `https://github.com/signup`. Verifica ambas con `git --version` y `gh --version` antes de continuar: si el sistema responde «comando no encontrado», la instalación no terminó o la terminal sigue siendo la anterior.',
        'Después de instalar, **verifica en la terminal** (no asumas que el instalador “ya quedó”). El bloque de abajo es el checklist copy-paste del día 1: Python responde con 3.12.x, Git responde con su versión, y el editor está listo (CLI `code` o menú de VS Code). Solo entonces pasas a crear `.venv` y a `python -m pip`. Si un comando falla, repara esa pieza antes de seguir — no encadenes installs a ciegas.',
      ],
      code: {
        language: 'bash',
        title: 'Orden del stack: verificar lo instalado',
        code: `# 1) Python 3.12+ (instalador: https://www.python.org/downloads/)
python3 --version
# Python 3.12.3   (o python --version / py --version en Windows)

# 2) Git (instalador: https://git-scm.com/downloads)
git --version
# git version 2.43.0

# 2b) GitHub CLI, el comando gh (instalador: https://cli.github.com/)
#     Sirve para iniciar sesion en GitHub desde la terminal (lo usaras en T3).
gh --version
# gh version 2.40.0

# 3) VS Code (https://code.visualstudio.com/) — CLI opcional:
#    Paleta de comandos → "Shell Command: Install 'code' command in PATH"
code --version
# 1.85.0  (si no hay CLI, abre VS Code desde el menú y sigue)

# 4) Extensiones en VS Code (UI Extensions): Python + Ruff (+ Jupyter si usas notebooks)
# Luego: File → Open Folder del proyecto y Terminal integrada
`,
        output: `Python 3.12.3
git version 2.43.0
gh version 2.40.0
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
        'Una receta puede ser la misma aunque dos cocinas guarden los utensilios en cajones distintos. Windows y macOS/Linux comparten el modelo **intérprete → entorno → pip atado**; cambian los nombres de comandos y las rutas de activación. Aprende la correspondencia, no una secuencia mágica de caracteres: así un «comando no reconocido» se convierte en una pista sobre el sistema operativo, no en una crisis sobre Python.',
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
        'Dos proyectos pueden necesitar versiones incompatibles del mismo paquete sin que ninguno esté equivocado. El **entorno virtual** resuelve esa convivencia: es una carpeta autocontenida con su propio intérprete y su propio directorio de paquetes. Con `python -m venv .venv` creas una frontera deliberada; lo que instales dentro pertenece a este proyecto y no negocia silenciosamente con los demás.',
        '**Nombre de la carpeta:** la documentación oficial de Python recomienda **`.venv`** (con punto): queda semi-oculto en listados Unix y se distingue de archivos `.env` de secretos. El nombre `venv` (sin punto) también es válido y lo verás en muchos tutoriales; en este curso el canónico es **`.venv`**, y tratamos `venv` como alias aceptado si ya lo usas. Ambos deben ir en `.gitignore` — nunca subas el entorno a GitHub (pesa decenas o cientos de MB y se regenera).',
        '**Activación** coloca el Python del entorno al inicio de la búsqueda de la shell: en macOS/Linux, `source .venv/bin/activate`; en Windows PowerShell, `.venv\\Scripts\\Activate.ps1`. El prompt suele mostrar `(.venv)`. **`deactivate`** vuelve al intérprete anterior. Si rompes el entorno, no «reparas a mano» `site-packages`: borras `.venv` y la recreas desde los archivos versionados. `conda` o `uv` pueden cambiar el mecanismo, pero no esta idea de frontera regenerable.',
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
        'Crear una caja aislada no basta: también necesitas una lista de ingredientes que otra persona pueda comprar. Con `.venv` activado, **`python -m pip`** instala dependencias de terceros en el intérprete correcto, y `requirements.txt` registra versiones concretas para reconstruir el entorno. El prefijo `python -m` es causal, no decorativo: obliga a que el instalador pertenezca al Python que acabas de verificar.',
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
          '`freeze` ≠ `poetry.lock` / `uv.lock`: no aporta hashes ni una resolución diseñada para varios sistemas operativos. En esta sección, `requirements.txt` pinneado es el contrato mínimo que aprenderás a producir y comprobar. Si un proyecto usa Poetry, PDM o uv, su README debe describir ese flujo; el principio sigue siendo reconstruir desde archivos versionados.',
      },
    },
    {
      heading: 'Git: commits y lectura de diffs',
      subtopicId: 'S01-T3-A',
      paragraphs: [
        'Imagina abrir dentro de seis meses un análisis cuyo resultado cambió y necesitar saber cuándo, cómo y por qué. Una carpeta con archivos finales no responde; Git sí puede hacerlo si el historial está bien narrado. Git es un **sistema de control de versiones** local: `status` muestra el presente, `add` selecciona lo que entrará en la próxima fotografía y `commit` conserva esa fotografía con una explicación. GitHub o GitLab publican el historial, pero no lo sustituyen.',
        'En este curso usamos **Conventional Commits**: un prefijo + una descripción concreta, en minúsculas tras el prefijo (`feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`). Ejemplos: `feat: agregar script hello_env`, `docs: documentar instalación del venv`, `fix: corregir ruta en README`. Evita «cambios», «wip» o «arreglé algo»: obligan a abrir el diff para descubrir la intención.',
        '**Antes del primer commit, Git necesita saber quién eres.** Cada commit guarda un nombre y un correo, así que en una máquina nueva Git rechaza el commit hasta que los configures una sola vez con `git config --global user.name "Tu Nombre"` y `git config --global user.email "tu@correo.com"`. `--global` los aplica a todos tus repos; si prefieres una identidad distinta solo en este proyecto, usa `--local` dentro de la carpeta del repo. No es un dato decorativo: es lo que aparece como autor en el historial que otra persona leerá.',
        'Leer un **diff** es tan importante como escribir el commit. `git diff` muestra cambios *sin* stage; `git diff --staged` lo ya agregado; `git show` el último commit (o un hash). Líneas con `+` se añadieron; con `-` se quitaron. Un archivo nuevo aparece como todo `+`. Antes de `commit`, lee el diff: es tu última revisión de calidad y la misma habilidad que usarás al revisar un Pull Request de un colega.',
      ],
      code: {
        language: 'bash',
        title: 'init, commit Conventional Commits, show',
        code: `# Identidad: Git firma cada commit con un nombre y un correo.
# La primera vez en una maquina nueva, configuralos o el commit se rechaza.
git config --global user.name "Tu Nombre"
git config --global user.email "tu@correo.com"

git init -b main
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
        'Un cirujano no ensaya una técnica nueva sobre la única copia del paciente; un equipo de software tampoco debería experimentar sobre `main`. Una **rama** crea una línea de trabajo separada y un **Pull Request (PR)** presenta su diff para revisión antes de integrarlo. El objetivo no es añadir ceremonia, sino crear un punto explícito donde otra persona pueda preguntar, comprobar y aprobar sin bloquear el historial estable.',
        'Hasta aquí Git ha trabajado dentro de tu laptop. Para que otra persona pueda ver tu rama y revisar un PR necesitas además un **remoto**: una copia del repositorio alojada en GitHub. Si todavía no tienes una cuenta de GitHub, créala en el navegador. Luego usa el menú **+ → New repository**, llámalo `python-ds-journey` y, como tu proyecto local ya contiene archivos, déjalo sin README, `.gitignore` ni licencia iniciales. Así evitas dos historias que Git tendría que reconciliar.',
        'Antes del primer `push`, autentica GitHub CLI con `gh auth login --web`: el comando abre un flujo seguro en el navegador, por lo que no debes pegar contraseñas ni tokens en archivos del proyecto. Después conecta la carpeta local con `git remote add origin URL`; **origin** es solo el apodo convencional de esa dirección. `git remote -v` permite comprobarla antes de publicar. Si ya existe un `origin`, no lo agregues de nuevo: verifica que apunta al repositorio correcto.',
        'Publica primero `main` y después tu rama. Al abrir el repositorio en GitHub aparecerá **Compare & pull request** para la rama recién publicada: revisa el diff, explica qué cambiaste y crea el PR. El PR no es otro archivo ni otro commit; es la conversación de revisión alrededor de una comparación entre ramas.',
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

# Una sola vez: autentica y conecta el repo local con GitHub.
gh auth login --web
git remote add origin https://github.com/TU-USUARIO/python-ds-journey.git
git remote -v
git switch main
git push -u origin main

# Publica la rama y abre el PR desde "Compare & pull request" en GitHub.
git switch feat/hello-env
git push -u origin feat/hello-env

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
        'En una imprenta, la corrección tipográfica no decide si una idea es verdadera, pero evita que errores baratos distraigan de ella. VS Code y **Ruff** cumplen ese papel: no sustituyen pensar, pero detectan imports sin usar, sintaxis sospechosa y orden inconsistente antes de pedir tiempo a un revisor. La meta del día 1 no es una configuración perfecta; es un ciclo compartido y repetible: comprobar, corregir y comprobar otra vez.',
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
        'Un repositorio profesional comunica tanto por lo que contiene como por lo que se niega a contener. **`.gitignore`** excluye artefactos regenerables y datos locales; **`.env.example`** declara qué configuración hace falta sin revelar secretos; **README.md** permite que una persona nueva reproduzca el arranque. Juntos responden tres preguntas: «¿qué no debo subir?», «¿qué debo configurar?» y «¿cómo demuestro que funciona?».',
        '**.env** guarda secretos y variables locales (API keys, contraseñas). **Nunca** va al repo. **`.env.example`** sí: lista las *claves* con valores vacíos o ficticios para que un colega sepa qué copiar a su `.env` privado. Ejemplo: `DATABASE_URL=` y `API_TOKEN=` sin valores reales. Si subiste un secreto por error, rotarlo (cambiar la clave en el proveedor) es más importante que solo borrar el archivo del commit siguiente: el historial puede conservarlo.',
        '**README.md** es la guía de arranque del clon limpio: título, qué hace el repo, mención al **esqueleto CP-N1-A** (Validación de admisión de clientes y calidad de datos — *Client Intake & Data Quality*; capstone de Nivel 1 que se cierra en S04), instalación (`python -m venv .venv`, activate, `python -m pip install -r requirements.txt`), uso (`python scripts/hello_env.py`), y una nota de seguridad (no versionar `.env`, datos sintéticos). En S01 **no** construyes el validador de admisión: solo dejas estructura y smoke. Agrega `data/clients_synthetic.csv` (PII falsa) y `data/data_dictionary.md` describiendo columnas. Un repo sin README ni diccionario no se puede auditar ni reutilizar en S02–S04.',
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
      'Te muestro paso a paso cómo configuro un entorno desde cero. Los bloques son comandos **copy-paste reales**: en macOS/Linux verás `python3` y `source .venv/bin/activate`; en Windows puedes usar `python` o `py` y activar con `.venv\\Scripts\\Activate.ps1` (PowerShell) o `activate.bat` (cmd). Mantén la laptop abierta, predice cada resultado y **repite cada comprobación** en tu shell. Empezamos por identificar el intérprete y leer códigos de salida antes de crear entornos virtuales.',
    steps: [
      {
        demoId: 'S01-T1-A-DEMO',
        subtopicId: 'S01-T1-A',
        environment: 'local-python',
        description: 'Verificar el intérprete y abrir una sesión REPL mínima — observar, no crear .py aún',
        preamble:
          'Antes de crear un `venv` o instalar paquetes, verifica **qué intérprete responde**. Sigue el hilo como una investigación: `python3 --version` identifica al ejecutor; el REPL prueba que evalúa expresiones; `python3 -m pip --version` revela qué instalador está unido a él. Antes de mirar la salida, predice qué partes dependen de tu máquina y cuáles deben conservar la misma forma. Si solo funciona `python` o `py`, anótalo: cambia el nombre del comando, no el modelo mental.',
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
          'Comprueba tu explicación sin memorizar la receta: ¿qué evidencia identifica al intérprete, cuál demuestra que el REPL está activo y cuál vincula `pip` con ese Python? Si respondes las tres, ya puedes diagnosticar el error clásico de instalar con un `pip` y ejecutar con otro `python`. En We Do convertirás esa observación en un transcript y luego en un script reproducible.',
      },
      {
        demoId: 'S01-T1-B-DEMO',
        subtopicId: 'S01-T1-B',
        environment: 'local-python',
        description: 'Observar códigos de salida 0 y no-cero con sys.exit',
        preamble:
          'Cuando un proceso imprime «fallo controlado», ¿ha fallado realmente o solo ha escrito esas palabras? Predice el código de salida antes de ejecutar cada comando. Después compara tu predicción con `$?` en bash/zsh o `$LASTEXITCODE` en PowerShell. La demostración separa tres evidencias: ubicación actual, mensaje visible y entero devuelto; no instales paquetes ni mezcles todavía problemas de dependencias.',
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
          'El mensaje está pensado para personas; el código de salida, para procesos que deben decidir. Repara esta idea errónea: «si no hubo traceback, hubo éxito». Un programa puede imprimir un aviso y devolver 0, o guardar silencio y devolver 1. En We Do observarás ambos canales y escribirás un script que elige 0 o 1 según su entrada.',
      },
      {
        demoId: 'S01-T2-A-DEMO',
        subtopicId: 'S01-T2-A',
        environment: 'local-python',
        description: 'Crear y activar entorno virtual con .venv',
        preamble:
          'Ya sabes identificar al intérprete; ahora vas a darle una frontera por proyecto. Antes de ejecutar, predice qué cambiará al activar `.venv`: ¿la carpeta del repo, la ruta de `python`, `sys.prefix` o las tres? Crea el entorno con el mismo intérprete verificado, actívalo y usa las rutas impresas para comprobar tu respuesta. En Windows, sustituye la activación por `Activate.ps1`. La carpeta `.venv` es regenerable y no se sube a Git.',
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
          'La activación no mueve el repo: cambia qué `python` encuentra primero la shell. Esa distinción explica por qué `sys.prefix` y la ruta del ejecutable deben apuntar a `.venv` mientras tus archivos siguen fuera. Si la evidencia no coincide, detente antes de instalar. En We Do crearás, desactivarás y recrearás el entorno sin tocar el código fuente.',
      },
      {
        demoId: 'S01-T2-B-DEMO',
        subtopicId: 'S01-T2-B',
        environment: 'local-python',
        description: 'Instalar con python -m pip, freeze y verificar el pin (install -r se practica en We Do)',
        preamble:
          'Con `.venv` activo, pasamos de aislar a **describir** el entorno. Antes de ejecutar, predice qué líneas aparecerán en `requirements.txt`: ¿solo `requests` o también paquetes que este necesita? Sigue la cadena install → freeze → inspección del archivo → import verificable. Usa siempre `python -m pip` para conservar el vínculo con el intérprete y recuerda que la biblioteca estándar no se instala ni se declara aquí.',
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
          '`freeze` fotografía el entorno; no explica por qué cada paquete está allí ni garantiza por sí solo todos los sistemas operativos. Repara dos confusiones: `requirements.txt` no es la carpeta `.venv`, y copiar `site-packages` no reconstruye un entorno de forma auditable. En We Do probarás la fotografía donde importa: en un entorno limpio mediante `install -r`.',
      },
      {
        demoId: 'S01-T3-A-DEMO',
        subtopicId: 'S01-T3-A',
        environment: 'local-python',
        description: 'Primer commit Conventional Commits y lectura de git show',
        preamble:
          'Git no es «guardar en la nube»: es construir una secuencia de decisiones que otra persona pueda leer. Antes de ejecutar, predice qué commit aparecerá primero en `git log --oneline -2` y qué archivo resumirá `git show HEAD --stat`. Después verifica la relación causal: editar cambia el working tree; `add` selecciona; `commit` conserva; `show` vuelve visible la fotografía elegida.',
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
          'Un historial útil permite reconstruir intención, no solo fechas. Si `git diff` queda vacío después del commit, no perdiste el cambio: ya forma parte de `HEAD`, y `git show HEAD` es la lente correcta. En We Do practicarás los tres niveles de responsabilidad: crear una fotografía, narrar su diff y juzgar si su mensaje sirve a un colega futuro.',
      },
      {
        demoId: 'S01-T3-B-DEMO',
        subtopicId: 'S01-T3-B',
        environment: 'local-python',
        description: 'Flujo local de rama feature y plan de PR (remoto opcional, sin force-push)',
        preamble:
          'Partes de un historial estable en `main` y necesitas experimentar sin convertirlo en borrador público. Predice qué mostrará `git branch --show-current` (una *branch* o rama es una línea de trabajo paralela: commits que aún no tocan `main`) después de `git switch -c feat/hello-env`; esa respuesta es la evidencia de aislamiento. El `push` y el PR requieren un remoto, pero la rama local no. Observa también el límite ético del flujo: recuperar cambios con `restore` o `stash` no autoriza a reescribir `main` con force-push.',
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
          'La rama reduce el radio de impacto; el PR hace visible la decisión antes de integrarla. Repara la confusión «push rechazado = debo forzar»: el rechazo suele pedir sincronizar o revisar, no borrar historia ajena. En We Do crearás una rama, redactarás la evidencia que necesita un revisor y practicarás recuperación sin destrucción.',
      },
      {
        demoId: 'S01-T4-A-DEMO',
        subtopicId: 'S01-T4-A',
        environment: 'local-python',
        description: 'Ruff check sobre un archivo con import sin usar',
        preamble:
          'Un revisor humano debería discutir decisiones, no gastar su atención señalando un import muerto. Antes de correr Ruff, predice qué línea marcará y por qué el programa puede funcionar pese al defecto. Luego observa el ciclo completo: hallazgo F401 → corrección mínima → nueva comprobación → exit 0. `pyproject.toml` convierte ese criterio en contrato del repo, aunque cada persona use un editor distinto.',
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
          'Que el script «corra» y que el repo cumpla su contrato de calidad son preguntas distintas. Ruff no reemplaza pruebas ni criterio; elimina ruido barato de manera reproducible. En We Do configurarás el mínimo, repararás una violación real y decidirás por qué una política gradual suele enseñar mejor que activar todas las reglas de golpe.',
      },
      {
        demoId: 'S01-T4-B-DEMO',
        subtopicId: 'S01-T4-B',
        environment: 'local-python',
        description: '.gitignore, .env.example y README de instalación',
        preamble:
          'Imagina entregar el repo a una persona que no puede preguntarte nada. Debe descubrir qué instalar sin recibir tu `.venv`, qué variables configurar sin recibir tus secretos y qué comando ejecutar sin adivinar. Antes de mirar `git status`, predice cuál archivo debe aparecer (`.env.example`) y cuál debe permanecer invisible (`.env`). Después usa `git check-ignore -v` como prueba, no como promesa.',
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
          'El trío cumple funciones distintas: ignore excluye, example documenta y README guía. Repara la idea peligrosa de que agregar `.env` al ignore borra un secreto ya versionado: hay que retirarlo del seguimiento de Git y rotarlo. En We Do construirás cada pieza y terminarás con un checklist que otra persona pueda ejecutar en una máquina limpia.',
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
        hint: 'Abre el REPL con `python3` y observa el prompt; el resto es completar el diálogo línea por línea.',
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
          'Reconstruye la secuencia sin mirar: shell → REPL → expresión → `quit()` → shell. Si no puedes señalar en qué momento Python evalúa y en cuál la shell vuelve a escuchar, repite el transcript. El REPL sirve para una pregunta breve; el siguiente ejercicio convierte esa exploración en un archivo que otra persona puede versionar y ejecutar.',
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
        hint: 'Empieza importando `sys` y envolviendo la lógica en una función `main`; el guardián la llamará.',
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
          'Predice dos escenas: `python hello_sys.py` y `import hello_sys`. En la primera debe correr `main`; en la segunda, no debe imprimir nada por accidente. El guardián explica la diferencia y transforma un experimento en un módulo reutilizable. Llevarás exactamente ese contrato a `scripts/hello_env.py` en el You Do.',
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
        hint: 'Separa los dos sistemas operativos antes de escribir pasos; cada uno tiene su trampa típica.',
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
          'Un diagnóstico útil termina con evidencia, no con «reinstalé y ahora funciona». Registra qué comando fallaba, qué binario responde después y qué cambió en PATH; abre una terminal nueva para que herede la configuración. Este mismo protocolo —identidad, cambio, verificación— reaparecerá con `.venv`, paquetes y CI.',
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
        hint: 'El hábito clave es leer el código justo después de cada comando, no solo mirar el texto en pantalla.',
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
          'Compara tus dos ejecuciones: el texto explica a una persona; el entero gobierna la automatización. En PowerShell, confirma que lees `$LASTEXITCODE`, no el booleano `$?`. Si un job «se ve bien» pero el pipeline se detiene, consulta primero ese contrato. A continuación harás que el propio script decida entre 0 y 1.',
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
          '- **Contexto:** los jobs de admisión fallan con código no cero cuando faltan argumentos.\n- **Meta:** implementar el contrato argc con `sys.argv` y `sys.exit`.\n- **Éxito:** `python check_arg.py hola` → exit 0 y `OK:hola`; sin args o con dos → exit 1 y uso en **stderr**.\n- **Límites:** no ignores args extra; no imprimas el uso solo en stdout.',
        id: 'S01-T1-B-E2',
        instruction:
          '1. Completa `len(args)`, `sys.stderr` y los `sys.exit`.\n2. Prueba: un arg, cero args, dos args.\n3. Confirma códigos con `echo $?` / `$LASTEXITCODE`.',
        hint: 'Cuenta los argumentos con `len(sys.argv)`; solo uno debe pasar, los demás van al uso en stderr.',
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
          'Un entrypoint con códigos de salida predecibles es la base de scripts de admisión y de jobs en cron/CI. El malentendido: tomar solo el primer arg y silenciar el resto. En S02–S04 reutilizarás este patrón al validar registros.',
        retrospective:
          'Prueba mentalmente tres entradas: ningún argumento, uno y dos. Solo una satisface el contrato; las demás deben explicar el uso por stderr y devolver 1. Esa tabla de casos vale más que «probé una vez». S02–S04 reutilizarán el mismo patrón cuando un validador de datos reciba entradas incompletas.',
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
        hint: 'Clasifica primero: ¿el shell no encuentra `pip`, o `pip` corre pero `import` falla? Son fallos distintos.',
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
          'Separa «el ejecutable no está en PATH» de «el paquete se instaló en otro Python». El malentendido es creer que cualquier `pip` y cualquier `python` forman pareja. Registra `sys.executable`, usa ese intérprete con `-m pip` y lleva la evidencia al checklist del día 1.',
        retrospective:
          'No confundas cuatro hechos: el ejecutable existe, el cwd contiene el archivo, el paquete está instalado y **este** intérprete puede importarlo. `sys.executable` identifica al último actor de la cadena. Si `pip` terminó bien pero otro Python ejecuta el script, no hay contradicción: hay dos entornos. Convertirás esta secuencia en el checklist del You Do.',
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
        hint: 'El ciclo es crear, activar, verificar con `sys.prefix` y salir con `deactivate`; practícalo en orden.',
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
          'La activación modifica la búsqueda de ejecutables de la shell; no «entra» mágicamente a la carpeta del proyecto. Compruébalo con `sys.prefix` y la ruta de `python`. Si ambas apuntan a `.venv`, puedes instalar con confianza. El siguiente ejercicio prueba la consecuencia más valiosa del aislamiento: poder borrar y recrear sin perder el código.',
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
        hint: 'Separa lo regenerable (`.venv`) de lo irremplazable (tus `.py` y `requirements.txt`); solo borras lo primero.',
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
          'Separa lo **regenerable** de lo **irremplazable**: `.venv` se reconstruye; tu código y `requirements.txt` se conservan. Editar `site-packages` mezcla ambas categorías y crea una reparación imposible de repetir. Si el entorno nuevo reproduce el smoke, acabas de demostrar el valor que T2-B formalizará con `freeze` e `install -r`.',
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
        hint: 'Construye el argumento sobre un conflicto concreto de versiones, no sobre un «venv es mejor» abstracto.',
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
          'Tu argumento debe explicar un conflicto concreto, no repetir «venv es mejor». Si el proyecto A necesita una versión y B otra, el Python global obliga a negociar; dos entornos permiten coexistir. Añade el costo honesto —activación y espacio— y explica por qué es menor que una dependencia compartida e impredecible. Ese razonamiento irá al README del You Do.',
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
        hint: 'Verifica con `sys.prefix` antes de freeze; si no apunta a `.venv`, estás congelando el entorno equivocado.',
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
          'Antes de confiar en el archivo, une tres evidencias: `sys.prefix` apunta al entorno correcto, `requirements.txt` contiene el pin esperado y el import informa la misma versión. Que aparezcan dependencias transitivas no prueba un error; describe la fotografía completa. El próximo ejercicio somete esa fotografía a su prueba real: reconstruir desde cero.',
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
        hint: 'Crea un entorno limpio desde cero y deja que `install -r` haga el trabajo; no traslades carpetas.',
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
          'El entorno viejo recuerda instalaciones manuales que quizá nunca documentaste; el entorno limpio no concede ese privilegio. Si `install -r` seguido del smoke funciona allí, `requirements.txt` merece llamarse contrato. Si falla, no maquilles la prueba: encuentra la dependencia ausente. Este será uno de los pasos observables del checklist de máquina limpia.',
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
        hint: 'Sigue el árbol: ¿qué Python corre?, ¿conoce `pip` el paquete?, ¿es stdlib o de terceros?, ¿el venv está activo?',
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
          'Explica el diagnóstico como un árbol: ¿qué Python ejecuta?, ¿su `pip` conoce el paquete?, ¿el paquete pertenece a stdlib o a terceros?, ¿el entorno activo es el esperado? Reinstalar sin responder esas preguntas borra pistas. Practica el árbol ahora; volverá a servir cuando un paquete «desaparezca» al cambiar de terminal, IDE o job de CI.',
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
        hint: 'El mensaje lleva un prefijo (`docs:`, `feat:`...) en minúsculas, dos puntos y una descripción breve.',
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
          'Lee `git log -1` como si no conocieras el proyecto: ¿el mensaje permite anticipar qué cambió y por qué categoría? Si falta el archivo en el commit, revisa la cadena `status` → `add` → `commit`; Git no adivina qué querías seleccionar. En el siguiente ejercicio abrirás esa fotografía y narrarás su diff.',
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
        hint: 'Recuerda distinguir `git diff` (cambios sin confirmar) de `git show HEAD` (la última fotografía guardada).',
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
          'Distingue tres lentes: `git diff` mira cambios aún no confirmados, `git diff --staged` mira la próxima fotografía y `git show HEAD` mira la última ya guardada. Un diff vacío puede significar orden, no pérdida. Si puedes explicar qué archivo cambió y qué representan `+` y `-`, ya posees la unidad básica de lectura de un PR.',
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
        hint: 'Piensa en el colega que leerá `git log` sin abrir el diff: ¿qué tipo y qué artefacto le anticipan el cambio?',
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
          'La mejor opción no es la más solemne, sino la que reduce el costo de búsqueda de otra persona. Defiende tu elección con dos criterios observables: tipo de cambio y artefacto afectado. Después reescribe las alternativas sin revelar la solución por letra. En el You Do, tus tres commits deberán sostener esa misma prueba de legibilidad.',
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
        hint: 'Crea la rama con `git switch -c` antes de editar; confirma con `git branch` que el asterisco se movió.',
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
          'La rama no es una etiqueta decorativa: determina a qué historia pertenece el próximo commit. Verifica el nombre antes de editar y confirma después dónde quedó la fotografía. Cambiar de rama al final no deshace el riesgo de haber confirmado en `main`. El siguiente paso será explicar ese cambio a un revisor mediante un PR.',
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
        hint: 'Escribe el cuerpo como si el revisor no pudiera preguntarte nada: contexto, plan de prueba y límites.',
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
          'Lee tu PR desde la silla del revisor: ¿entiende el propósito, el alcance y una prueba que pueda repetir sin preguntarte? Si solo dice «listo», traslada el costo de pensamiento al equipo. Un buen cuerpo no promete perfección; entrega evidencia y límites. Aplicarás este formato al PR real del You Do.',
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
        hint: 'Clasifica antes de actuar: ¿descartar (`restore`), guardar para después (`stash`) o integrar? Force-push nunca.',
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
          'Clasifica antes de actuar: ¿quieres descartar un cambio local, guardar trabajo temporal o resolver una divergencia remota? `restore`, `stash` y sincronizar ramas responden a problemas distintos; force-push no es un martillo universal. Escribe en el README del capstone una regla que explique tanto la prohibición como la alternativa segura.',
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
          '- **Contexto:** el linter —la herramienta que revisa el estilo y los errores del código sin ejecutarlo— debe ser el mismo en tu laptop y en CI.\n- **Meta:** completar `[tool.ruff]` y `select = ["E","F","I"]`.\n- **Éxito:** archivo con `line-length = 88`, `target-version`, y select E/F/I.\n- **Límites:** no pongas la config bajo `[tool.black]`; `select` es lista, no string `"E,F,I"`; no `ALL` el día 1.',
        id: 'S01-T4-A-E1',
        instruction:
          '1. Completa `line-length` y `target-version`.\n2. Completa la lista `select`.\n3. Guarda en la raíz del proyecto de práctica.',
        hint: 'En TOML, las secciones van entre corchetes y `select` es una lista de strings, no un string con comas.',
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
          'La configuración versionada hace que dos editores y CI juzguen con la misma regla. Explica qué aporta cada familia `E`, `F` e `I`; si no puedes, la lista es magia copiada. Un mínimo comprensible crea hábito y deja espacio para ampliar con evidencia. Ahora comprobarás ese contrato sobre código defectuoso.',
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
        hint: 'El código F401 marca imports sin usar; la corrección más limpia en S01 es borrarlos, no silenciarlos.',
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
          'Compara las dos corridas: mismo archivo, una corrección y distinto código de salida. Esa repetición demuestra que el criterio es ejecutable, no una preferencia visual del editor. F401 nombra la clase de defecto; eliminar la causa vale más que silenciarla. Repetirás el ciclo sobre `scripts/hello_env.py` en el You Do.',
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
        hint: 'Defiende el set mínimo con un argumento de señal vs ruido; ALL el día 1 ahoga al equipo.',
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
          'Tu política debe equilibrar señal, costo de adopción y posibilidad de cumplimiento. Activar todas las reglas puede producir más mensajes y menos aprendizaje si nadie entiende cómo responder. Propón un núcleo, una justificación y una condición para ampliarlo. Esa decisión convertirá Ruff en una norma defendible del esqueleto CP-N1-A.',
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
        hint: 'Una entrada por línea; la barra final marca directorio. Incluye `.venv/` y `venv/` porque ambos nombres circulan.',
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
          'No declares «está ignorado»: demuéstralo con `git check-ignore -v` y explica qué regla coincidió. Incluye `.venv/` y `venv/` porque el nombre de la carpeta es convención, no garantía universal. El siguiente ejercicio completa el otro lado del contrato: documentar las claves necesarias sin publicar sus valores.',
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
          '- **Contexto:** el example es el contrato de configuración; el secreto vive fuera del repo.\n- **Meta:** ≥3 claves de un caso de admisión sintético con valores vacíos o ficticios no sensibles.\n- **Éxito:** archivo versionable con `KEY=`; sin patrones de secreto reales; `.env` real ignorado.\n- **Límites:** prohibido `sk-…`, passwords reales, connection strings con password; no subas `.env` “un momentito”.',
        id: 'S01-T4-B-E2',
        instruction:
          '1. Completa `API_URL`, `DB_HOST`, `LOG_LEVEL` (o equivalentes) con placeholders.\n2. Confirma que `.env` está en `.gitignore`.\n3. Revisa que no pegaste tokens de algún tutorial.',
        hint: 'El example documenta los nombres de las variables con valores ficticios; los secretos reales viven solo en tu `.env`.',
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
          'Una persona nueva necesita conocer **los nombres** de las variables, no tus credenciales. `.env.example` hace visible el esquema; `.env` conserva los valores fuera del historial. Revisa que los ejemplos sean inequívocamente ficticios y que el README nunca contenga un atajo secreto. Ese límite alimenta el criterio de uso responsable del You Do.',
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
          output: 'Versionable; sin secretos.',
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
        hint: 'Cada ítem del checklist debe poder ejecutarse en una laptop ajena: comando concreto y resultado esperado.',
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
          'Un checklist útil produce evidencia binaria o una observación concreta: ruta correcta, exit 0, import exitoso, archivo ignorado. Sustituye «se ve ordenado» por un comando que otra persona pueda copiar. Si cada ítem puede ejecutarse en una máquina limpia, ya tienes el puente entre esta sección, el You Do y el gate de S04.',
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
      'Una organización internacional recibe archivos de clientes desde oficinas con sistemas distintos. Antes de discutir reglas de calidad, el equipo necesita una base común que cualquiera pueda clonar y ejecutar. Este You Do es el **primer incremento del capstone CP-N1-A** (un capstone, que es el proyecto final que integra lo aprendido en un nivel; este corresponde a *Client Intake & Data Quality* y se cierra en S04). En S01 no construyes el validador: entregas su pista de aterrizaje —entorno reproducible, historial Git legible, Ruff, datos sintéticos y diccionario—. S02–S04 añadirán el script de admisión sin rehacer esta base.',
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
      'data/clients_synthetic.csv con las columnas client_id, full_name, country, signup_date, monthly_amount y 5–10 filas inventadas (ninguna persona real); data/data_dictionary.md describe cada una de esas columnas — ver la plantilla del starter',
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
# ---------------------------------------------------------------------------
# data/clients_synthetic.csv — un CSV es un archivo de texto donde cada linea
# es una fila y las comas separan las columnas. La primera linea son los
# nombres de columna. Copia estas 5 columnas y escribe 5 a 10 filas inventadas
# (datos falsos, ninguna persona real):
#
# client_id,full_name,country,signup_date,monthly_amount
# C001,Maria Quispe,PE,2026-01-15,150.50
# C002,John Smith,US,2026-02-03,420.00
# C003,Ana Ferreira,BR,2026-02-20,89.90
#
# ---------------------------------------------------------------------------
# data/data_dictionary.md — explica cada columna del CSV para quien lo reciba.
# Una fila por columna, con este formato:
#
# | columna         | tipo   | ejemplo      | descripcion                        |
# |-----------------|--------|--------------|------------------------------------|
# | client_id       | texto  | C001         | Identificador unico del cliente     |
# | full_name       | texto  | Maria Quispe | Nombre sintetico, no persona real   |
# | country         | texto  | PE           | Codigo de pais de dos letras        |
# | signup_date     | fecha  | 2026-01-15   | Fecha de alta en formato AAAA-MM-DD |
# | monthly_amount  | numero | 150.50       | Monto mensual en soles              |
# ---------------------------------------------------------------------------
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
      'Este repositorio es la base de tu portafolio de Nivel 1. Cuando llegues al gate de S04 (CP-N1-A completo), el revisor valorará que el esqueleto de S01 ya era clonable, sin secretos y con datos sintéticos. Cada sección suma evidencia; no reinicies el repo desde cero sin necesidad. En S01 basta el smoke y la higiene del repo — el validador de admisión llega después.',
    retrospective:
      'Defiende la entrega como si no pudieras ayudar a quien la recibe. ¿Qué secuencia exacta del README prueba `venv` → `install -r` → smoke? ¿Qué evidencia demuestra que `.env` queda fuera y que el CSV es sintético? ¿Puede una colega distinguir qué se regenera de qué se versiona? Si alguna respuesta depende de «yo le explicaría», aún falta documentación. S04 añadirá validación de datos; no reparará un entorno irreproducible ni un secreto filtrado.',
    rubric: [
      { criterion: 'Correctness — clone + venv + install -r + hello_env exit 0', weight: '30%' },
      { criterion: 'Robustness — README sirve en Windows y Unix (comandos de activate)', weight: '15%' },
      { criterion: 'Maintainability — commits Conventional Commits, estructura clara, Ruff config', weight: '25%' },
      { criterion: 'Uso responsable — .env ignorado, .env.example sin secretos, datos sintéticos + diccionario', weight: '20%' },
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
          'Un `venv` crea una frontera de dependencias por proyecto. Así, dos proyectos pueden usar versiones distintas del mismo paquete sin negociar sobre un único Python global. La prueba no es el nombre de la carpeta: `sys.prefix` y la ruta del ejecutable deben apuntar al entorno activo.',
      },
      {
        question: '¿Cuál de los siguientes archivos SÍ debería estar en tu .gitignore?',
        options: ['requirements.txt', 'README.md', '.venv/ (o venv/)', 'hello.py'],
        correctIndex: 2,
        explanation:
          '`.venv/` y `venv/` son artefactos regenerables y específicos de la máquina; se reconstruyen a partir de `requirements.txt`. El README, el archivo de dependencias y `hello.py` sí son evidencia versionable: explican, declaran y ejecutan el proyecto.',
      },
      {
        question: '¿Cuál es un buen mensaje de commit siguiendo Conventional Commits?',
        options: ['"cambios"', '"wip"', '"arreglé el bug de ayer"', '"feat: agregar cálculo de churn por segmento"'],
        correctIndex: 3,
        explanation:
          'Conventional Commits combina un tipo (`feat:`, `fix:`, `docs:`…) con una descripción concreta. `feat: agregar cálculo de churn por segmento` permite anticipar alcance e intención; «cambios» y «wip» obligan a abrir el diff para descubrirlos.',
      },
      {
        question: '¿Qué comando te permite replicar el entorno de otro desarrollador?',
        options: ['pip install pandas numpy', 'python -m pip install -r requirements.txt', 'python -m venv venv', 'git clone https://github.com/usuario/repo.git'],
        correctIndex: 1,
        explanation:
          '`python -m pip install -r requirements.txt` une dos contratos: usa el instalador del intérprete activo y lee el snapshot de versiones. `git clone` trae archivos; `venv` crea una frontera vacía. Replicar exige las tres acciones, pero solo `install -r` instala las dependencias declaradas.',
      },
      {
        question: '¿Por qué NO debes subir el archivo .env a GitHub?',
        options: ['Porque suele contener credenciales (API keys, passwords, tokens) que son secretos', 'Porque pesa demasiado y ralentiza el git push', 'Porque GitHub no soporta archivos sin extensión', 'Porque entra en conflicto con requirements.txt'],
        correctIndex: 0,
        explanation:
          '`.env` puede contener credenciales que conceden acceso, no simples preferencias del editor. Debe quedar fuera del historial; `.env.example` documenta únicamente los nombres y valores ficticios. Si un secreto ya fue versionado, ignorar el archivo no basta: hay que retirarlo y rotar la credencial.',
      },
      {
        question: '¿Qué significa un código de salida (exit code) igual a 1 en un script de Python?',
        options: ['Éxito', 'Que el script está pausado', 'Fallo controlado o error', 'Que faltan paquetes por instalar'],
        correctIndex: 2,
        explanation:
          'Por convención, 0 autoriza a continuar y un valor distinto de 0 señala que el proceso no cumplió su contrato. `sys.exit(1)` comunica ese estado a la shell, CI u otro orquestador, aunque el programa no muestre un traceback.',
      },
      {
        question: '¿En qué archivo se configura Ruff para un proyecto?',
        options: ['ruff.json', '.ruffrc', 'setup.cfg', 'pyproject.toml (sección tool.ruff)'],
        correctIndex: 3,
        explanation:
          'Ruff lee `[tool.ruff]` y `[tool.ruff.lint]` desde `pyproject.toml`. Al versionar esa configuración, el editor, la terminal y CI comparten el mismo criterio; una preferencia local se convierte en un contrato comprobable del repo.',
      },
      {
        question: '¿Por qué está prohibido hacer `git push --force` a `main`?',
        options: ['Porque borra tu rama local', 'Porque puede borrar commits ajenos del historial compartido', 'Porque es lento', 'Porque GitHub no lo permite'],
        correctIndex: 1,
        explanation:
          'Force-push reescribe la referencia remota y puede hacer desaparecer commits que otras personas ya consideran parte de `main`. Un push rechazado pide diagnosticar o sincronizar, no borrar historia. Para trabajo local usa `restore` o `stash`; para integrar, una rama y un PR.',
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
