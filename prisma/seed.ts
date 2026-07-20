/**
 * Seed script for QuestionBank — generates 3 variants per concept for each section.
 * Uses the existing selfCheck questions as variant 1, and creates 2 additional variants.
 *
 * Run: bun run db:seed
 */
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Type for a question variant
type Q = {
  concept: string
  question: string
  options: string[]
  correctIndex: number
  explanation: string
}

// 3 variants per concept for each of the 10 sections
// Variant 1 = existing question; variants 2 & 3 = equivalent questions testing same concept
const QUESTION_BANK: Record<string, Q[]> = {
  setup: [
    // --- interpreter-selection (3) ---
    {
      concept: 'interpreter-selection',
      question:
        'En una laptop nueva ejecutas `python --version` y obtienes un error de comando no encontrado. ¿Cuál es la mejor primera acción?',
      options: [
        'Instalar pandas globalmente para forzar que Python aparezca',
        'Verificar si el intérprete se llama `python3` o está fuera del PATH, e instalar Python 3.12+ si falta',
        'Crear un archivo .py y abrirlo en el navegador',
        'Ejecutar `git init` para registrar el runtime',
      ],
      correctIndex: 1,
      explanation:
        'El síntoma es de intérprete/PATH, no de paquetes ni Git. Primero se confirma que Python 3 está instalado y accesible (`python3` o el instalador/PATH).',
    },
    {
      concept: 'interpreter-selection',
      question:
        '¿Cuál es la diferencia principal entre trabajar en el REPL (`>>>`) y ejecutar `python script.py`?',
      options: [
        'El REPL compila a binario; el script solo interpreta texto',
        'El REPL es una sesión interactiva línea a línea; el script ejecuta un archivo de principio a fin y termina',
        'Solo el REPL puede importar la librería estándar',
        'Solo los scripts pueden usar `print`',
      ],
      correctIndex: 1,
      explanation:
        'El REPL evalúa expresiones interactivamente; un script corre el archivo completo y sale. Ambos usan el mismo intérprete, pero el modo de uso es distinto.',
    },
    {
      concept: 'interpreter-selection',
      question:
        'Un colega reporta `Python 3.9.0` y tú `Python 3.12.2` con el mismo comando. ¿Qué implica para el proyecto?',
      options: [
        'Que Git está mal configurado en una de las máquinas',
        'Que cada uno está usando un intérprete distinto; conviene alinear la versión mínima del equipo (p. ej. 3.12+)',
        'Que el REPL está dañado y hay que reinstalar el sistema operativo',
        'Que `pip` ya no es necesario en 3.12',
      ],
      correctIndex: 1,
      explanation:
        'La versión del intérprete define sintaxis y comportamiento. Discrepancias se resuelven eligiendo y verificando el mismo runtime de referencia del equipo.',
    },
    // --- terminal-paths (3) ---
    {
      concept: 'terminal-paths',
      question:
        'Tras `python -c "import sys; sys.exit(1)"`, en bash `echo $?` muestra `1`. ¿Qué significa?',
      options: [
        'El proceso terminó con éxito',
        'El proceso falló (código de salida distinto de 0)',
        'Python no está en el PATH',
        'El directorio de trabajo actual es inválido',
      ],
      correctIndex: 1,
      explanation:
        'Por convención, 0 = éxito y distinto de 0 = error. `sys.exit(1)` fuerza un fallo visible en el shell.',
    },
    {
      concept: 'terminal-paths',
      question:
        'El comando `python mi_script.py` falla con "No such file or directory", pero el archivo existe en otra carpeta. ¿Cuál es el diagnóstico más probable?',
      options: [
        'Python no soporta archivos .py en macOS',
        'El cwd (directorio de trabajo) no es el de ese archivo; PATH no busca scripts por nombre de proyecto',
        'Hay que ignorar el archivo en .gitignore',
        'Falta un Pull Request antes de ejecutar scripts',
      ],
      correctIndex: 1,
      explanation:
        'Rutas relativas se resuelven desde el cwd. PATH localiza ejecutables (python), no tus scripts de proyecto. Hay que `cd` al directorio correcto o usar la ruta completa.',
    },
    {
      concept: 'terminal-paths',
      question:
        'En PowerShell, un comando termina y `$LASTEXITCODE` es `0`. ¿Qué conclusión es correcta?',
      options: [
        'El comando falló y hay que reinstalar Python',
        'El comando terminó exitosamente según el código de salida',
        'El PATH está vacío',
        'Solo aplica a Git, no a Python',
      ],
      correctIndex: 1,
      explanation:
        'En PowerShell, `$LASTEXITCODE` (análogo a `$?` en bash) con valor 0 indica éxito del último proceso.',
    },
    // --- venv-purpose (3) — .venv ---
    {
      concept: 'venv-purpose',
      question: '¿Para qué sirve un entorno virtual (`.venv`) en un proyecto Python?',
      options: [
        'Para acelerar la ejecución del código Python',
        'Para aislar las dependencias por proyecto y evitar conflictos de versiones entre proyectos',
        'Para conectarse a internet más rápido al instalar paquetes',
        'Para compilar Python a código de máquina más eficiente',
      ],
      correctIndex: 1,
      explanation:
        '`.venv` guarda un intérprete y paquetes locales del proyecto, evitando que un upgrade en un repo rompa otro.',
    },
    {
      concept: 'venv-purpose',
      question:
        '¿Cuál es la práctica recomendada al crear el entorno virtual del proyecto de curso?',
      options: [
        'Instalar todos los paquetes en el Python global del sistema',
        'Crear `.venv` en la raíz del repo (`python -m venv .venv`), activarlo y trabajar solo ahí',
        'Crear un venv distinto por cada archivo .py',
        'Usar el mismo venv compartido en OneDrive para todo el equipo sin requirements',
      ],
      correctIndex: 1,
      explanation:
        'Un proyecto = un entorno. El nombre `.venv` es el convención del curso; se regenera y no se versiona el contenido de la carpeta.',
    },
    {
      concept: 'venv-purpose',
      question:
        'Tu colega tiene pandas 2.x y a ti te falla el mismo script con pandas 1.x instalado globalmente. ¿Qué explica mejor el problema y la solución?',
      options: [
        'La laptop es más lenta; hay que comprar más RAM',
        'Sin `.venv` cada máquina/global puede tener versiones distintas; hay que usar un venv por proyecto y alinear dependencias',
        'Python no es multiplataforma',
        'Git reescribe las versiones de pandas en cada clone',
      ],
      correctIndex: 1,
      explanation:
        'El clásico "a mí me funciona" suele ser desalineación de entornos. `.venv` + requirements pinneados aíslan y reproducen dependencias.',
    },
    // --- pip-install (3) — prefer python -m pip ---
    {
      concept: 'pip-install',
      question:
        'Con el `.venv` activado, ¿qué comando es la forma más confiable de instalar las dependencias listadas por un colega?',
      options: [
        'pip install pandas numpy sin versiones',
        'python -m pip install -r requirements.txt',
        'python -m venv .venv otra vez',
        'git clone del repositorio sin instalar nada',
      ],
      correctIndex: 1,
      explanation:
        '`python -m pip` usa el pip del mismo intérprete activo. `-r requirements.txt` instala las versiones documentadas del equipo.',
    },
    {
      concept: 'pip-install',
      question: '¿Para qué sirve `python -m pip freeze > requirements.txt`?',
      options: [
        'Para congelar el intérprete y que no se actualice nunca',
        'Para exportar un snapshot de paquetes y versiones exactas instaladas en el entorno actual',
        'Para borrar paquetes viejos del sistema',
        'Para actualizar automáticamente a la última major de cada librería',
      ],
      correctIndex: 1,
      explanation:
        'freeze lista `paquete==versión` del entorno activo. Guardarlo permite que otro clone reinstale con install -r.',
    },
    {
      concept: 'pip-install',
      question:
        'Ves `ModuleNotFoundError: requests` aunque "instalaste requests" en otra terminal. ¿Qué práctica evita este error?',
      options: [
        'Instalar siempre con el Python global y nunca activar venv',
        'Activar el `.venv` del proyecto e instalar con `python -m pip install requests` (y documentar en requirements)',
        'Renombrar el archivo a .txt para no importar módulos',
        'Usar solo `git commit` en lugar de pip',
      ],
      correctIndex: 1,
      explanation:
        'El paquete debe instalarse en el mismo intérprete que ejecuta el script. `python -m pip` dentro del `.venv` evita instalar en otro Python.',
    },
    // --- commit-message (3) — al menos una con diff ---
    {
      concept: 'commit-message',
      question: '¿Cuál es un buen mensaje de commit siguiendo Conventional Commits?',
      options: [
        'cambios',
        'wip',
        'feat: agregar cálculo de churn por segmento',
        'arreglé el bug',
      ],
      correctIndex: 2,
      explanation:
        'Conventional Commits usa prefijo (`feat:`, `fix:`, `docs:`) y descripción imperativa clara del cambio.',
    },
    {
      concept: 'commit-message',
      question:
        'Observas este fragmento de `git diff`:\n```\n- timeout = 5\n+ timeout = 30\n+ log.info("retry enabled")\n```\n¿Qué describe mejor el cambio?',
      options: [
        'Se eliminó el logging y se redujo el timeout a 5',
        'Se aumentó el timeout de 5 a 30 y se añadió una línea de log de reintentos',
        'Se renombró el archivo completo sin tocar lógica',
        'Solo se formateó whitespace; no hay cambio semántico',
      ],
      correctIndex: 1,
      explanation:
        'En un diff, `-` es línea quitada y `+` añadida. Aquí se reemplaza timeout 5→30 y se agrega un log.',
    },
    {
      concept: 'commit-message',
      question:
        'Corregiste un fallo que devolvía NaN en el total de una factura. ¿Qué mensaje es el más adecuado?',
      options: [
        'feat: nueva app de facturación completa',
        'fix: corregir total NaN cuando el ítem viene vacío',
        'wip',
        'update stuff',
      ],
      correctIndex: 1,
      explanation:
        '`fix:` es para correcciones. El mensaje debe decir qué se arregló; `feat:` sería una funcionalidad nueva y `wip` no aporta historial útil.',
    },
    // --- git-branch-pr (3) ---
    {
      concept: 'git-branch-pr',
      question:
        'Vas a implementar una feature nueva en un repo compartido. ¿Cuál es el flujo más seguro?',
      options: [
        'Commitear directo en `main` y hacer force-push',
        'Crear una rama (`git switch -c feat/...`), commitear ahí, pushear y abrir un Pull Request',
        'Borrar el remoto y trabajar solo local para siempre',
        'Editar archivos en GitHub sin rama ni revisión',
      ],
      correctIndex: 1,
      explanation:
        'El trabajo de feature va en rama; el PR permite revisión antes de integrar a `main`. Force-push a main se evita.',
    },
    {
      concept: 'git-branch-pr',
      question: '¿Para qué sirve un Pull Request (PR) en GitHub en este curso?',
      options: [
        'Para instalar paquetes de pip más rápido',
        'Para proponer e integrar cambios de una rama con descripción y revisión, sin pisar main a ciegas',
        'Para ocultar el historial de commits del equipo',
        'Para reemplazar requirements.txt',
      ],
      correctIndex: 1,
      explanation:
        'El PR es el mecanismo de integración y revisión: resume cambios, permite comentarios y merge controlado.',
    },
    {
      concept: 'git-branch-pr',
      question:
        'Modificaste un archivo, aún no has hecho commit, y quieres descartar solo ese cambio de forma no destructiva para el historial remoto. ¿Qué opción es preferible como hábito seguro?',
      options: [
        'git push --force a main',
        'git restore del archivo (o stash si quieres guardarlo temporalmente), nunca force-push a main',
        'Borrar la carpeta .git y clonar de nuevo siempre',
        'Cambiar el mensaje del último commit ajeno con rebase público',
      ],
      correctIndex: 1,
      explanation:
        '`git restore` / `stash` recuperan el working tree sin reescribir historial compartido. Force-push a main está prohibido como práctica segura.',
    },
    // --- ruff-config (3) ---
    {
      concept: 'ruff-config',
      question: '¿Cuál describe mejor el rol de Ruff en un proyecto Python de este curso?',
      options: [
        'Es un gestor de entornos virtuales que reemplaza a venv',
        'Es una herramienta de lint (y formato) que detecta problemas de estilo y errores simples vía reglas configurables',
        'Es el cliente oficial de GitHub para abrir PRs',
        'Es un REPL alternativo a python',
      ],
      correctIndex: 1,
      explanation:
        'Ruff analiza código (`ruff check`) y puede formatear; no reemplaza venv ni Git. Se configura típicamente en pyproject.toml.',
    },
    {
      concept: 'ruff-config',
      question:
        '¿Dónde se declara normalmente la configuración mínima de Ruff en el repositorio?',
      options: [
        'En un archivo binario dentro de .venv',
        'En `pyproject.toml` bajo la sección `[tool.ruff]` (p. ej. line-length y select de reglas)',
        'Solo en la configuración global del sistema operativo',
        'En `.env` junto a las API keys',
      ],
      correctIndex: 1,
      explanation:
        'La config versionable del linter vive en el repo (`pyproject.toml` → `[tool.ruff]`), no en secretos ni en el venv.',
    },
    {
      concept: 'ruff-config',
      question:
        'Ejecutas `ruff check` y reporta F401 por un `import os` sin usar. ¿Qué implica?',
      options: [
        'Que hay que desactivar Git',
        'Que Ruff detectó un import no utilizado; conviene eliminarlo o usarlo, no ignorar ciegamente todas las reglas',
        'Que Python no está instalado',
        'Que el archivo debe listarse en .gitignore',
      ],
      correctIndex: 1,
      explanation:
        'F401 es import unused: señal de limpieza/calidad. El flujo es corregir el hallazgo (o un noqa justificado), no apagar Ruff por completo.',
    },
    // --- gitignore (3) — .env / .env.example / secretos ---
    {
      concept: 'gitignore',
      question: '¿Cuál de estos SÍ debe listarse en `.gitignore` de un proyecto Python típico?',
      options: [
        'requirements.txt',
        'README.md',
        '.venv/',
        'src/main.py',
      ],
      correctIndex: 2,
      explanation:
        '`.venv/` es regenerable y pesado; no se versiona. El código y requirements/README sí van al repo.',
    },
    {
      concept: 'gitignore',
      question:
        'Sobre secretos y plantillas de entorno, ¿cuál es la práctica correcta?',
      options: [
        'Subir `.env` con API keys reales y no crear `.env.example`',
        'Ignorar `.env` (secretos locales) y versionar `.env.example` solo con claves/placeholders sin secretos',
        'Poner las contraseñas en el README para el equipo',
        'Commitear `.env` pero en una rama feature',
      ],
      correctIndex: 1,
      explanation:
        '`.env` tiene secretos y no se sube. `.env.example` documenta las variables necesarias con valores vacíos o sintéticos.',
    },
    {
      concept: 'gitignore',
      question:
        'Un compañero casi sube un archivo con `API_KEY=sk-...` real. ¿Qué combinación protege mejor el repo?',
      options: [
        'Incluir `.env` en `.gitignore`, usar `.env.example` sin secretos y nunca pegar keys en commits ni PRs',
        'Confiar en que GitHub borra secretos automáticamente al hacer push',
        'Guardar la key en un comentario dentro de un .py trackeado',
        'Nombrar el archivo `secrets.txt` y forzarlo con `git add -f`',
      ],
      correctIndex: 0,
      explanation:
        'Defensa en profundidad: ignore de `.env`, plantilla pública sin secretos, y disciplina de no commitear credenciales en ningún path.',
    },
  ],
  basics: [
    // --- literals-types (3) ---
    {
      concept: 'literals-types',
      question: '¿Cuál es el tipo de `None` en Python?',
      options: ['null', 'NoneType', 'void', 'str vacío'],
      correctIndex: 1,
      explanation:
        'None es la única instancia de NoneType. No es lo mismo que "" ni que 0.',
    },
    {
      concept: 'literals-types',
      question: 'En un registro de intake, ¿qué imprime `type("42").__name__` y qué vale `42 == "42"`?',
      options: [
        'int y True',
        'str y False',
        'str y True',
        'int y False',
      ],
      correctIndex: 1,
      explanation:
        '"42" es str. 42 (int) no es igual a "42" (str); hay que convertir de forma explícita.',
    },
    {
      concept: 'literals-types',
      question: '¿Por qué el teléfono `999000111` de un cliente sintético se modela como `str` y no como `int`?',
      options: [
        'Porque int no existe en Python',
        'Porque no es una cantidad aritmética y puede necesitar ceros o formato',
        'Porque str es más rápido que int',
        'Porque PEP 8 prohíbe int para dígitos',
      ],
      correctIndex: 1,
      explanation:
        'Teléfonos, DNI y códigos son identificadores de texto, no cantidades para sumar o multiplicar.',
    },
    // --- type-inspect-convert (3) ---
    {
      concept: 'type-inspect-convert',
      question: 'Tras `edad_txt = "  19  "`, ¿cuál es la conversión segura a entero en un parser de intake?',
      options: [
        'eval(edad_txt)',
        'int(edad_txt.strip())',
        'float(edad_txt) sin strip',
        'edad_txt + 0',
      ],
      correctIndex: 1,
      explanation:
        'strip elimina espacios; int convierte. eval sobre input es inaceptable por seguridad.',
    },
    {
      concept: 'type-inspect-convert',
      question: 'Si `int("abc")` falla al parsear el campo edad, ¿qué excepción debes capturar y reportar con nombre de campo?',
      options: ['TypeError', 'ValueError', 'NameError', 'KeyError'],
      correctIndex: 1,
      explanation:
        'int() con texto no numérico lanza ValueError. El mensaje debe nombrar el campo y el valor recibido.',
    },
    {
      concept: 'type-inspect-convert',
      question: '¿Qué devuelve `isinstance("19", int)` y por qué importa en validación de intake?',
      options: [
        'True, porque se ve numérico',
        'False, sigue siendo str hasta convertir',
        'Error, isinstance no acepta str',
        'None, isinstance no devuelve bool',
      ],
      correctIndex: 1,
      explanation:
        'isinstance distingue “ya es int” de “sigue siendo texto”. "19" es str hasta int(...).',
    },
    // --- assignment-naming (3) ---
    {
      concept: 'assignment-naming',
      question: '¿Cuál es la diferencia entre `=` y `==` en Python?',
      options: [
        'Son lo mismo',
        '`=` es asignación, `==` es comparación de igualdad',
        '`=` es comparación, `==` es asignación',
        '`==` solo funciona con números',
      ],
      correctIndex: 1,
      explanation: '`x = 5` asigna. `x == 5` compara y devuelve True/False.',
    },
    {
      concept: 'assignment-naming',
      question: 'Según PEP 8 básico, ¿cuál es el mejor nombre para el apellido paterno en un schema de intake?',
      options: ['Apellido1', 'AP', 'apellido_paterno', 'apellidoPaterno'],
      correctIndex: 2,
      explanation:
        'Variables en snake_case. apellido_paterno es el nombre estable del schema S02.',
    },
    {
      concept: 'assignment-naming',
      question: '¿Qué ocurre si escribes `if edad = 18:` en Python moderno (sin walrus)?',
      options: [
        'Asigna 18 y entra al if',
        'SyntaxError: = es asignación, no comparación',
        'Compara en silencio',
        'Crea una constante EDAD',
      ],
      correctIndex: 1,
      explanation:
        'En el if se usa == para comparar. = solo asigna; Python reporta SyntaxError.',
    },
    // --- identity-mutability (3) ---
    {
      concept: 'identity-mutability',
      question: 'Tras `b = a` con `a = [1, 2]` y `b.append(3)`, ¿qué vale `a`?',
      options: ['[1, 2]', '[1, 2, 3]', '[3]', 'Error'],
      correctIndex: 1,
      explanation:
        'b es un alias del mismo objeto lista. Mutar b muta a. Usa copy() o slice para independizar.',
    },
    {
      concept: 'identity-mutability',
      question: '¿Cuál es el idioma correcto para comprobar ausencia de valor con el singleton None?',
      options: ['if x == None:', 'if x is None:', 'if x === null:', 'if not x == None:'],
      correctIndex: 1,
      explanation:
        'Se recomienda `is None` / `is not None` por identidad del singleton None.',
    },
    {
      concept: 'identity-mutability',
      question:
        'En un parser, `raw = "  Ana  "` y `clean = raw.strip()`. Luego mutas un dict limpio. ¿Qué práctica preserva auditoría?',
      options: [
        'Sobrescribir raw con clean en la misma variable',
        'Guardar *_raw aparte y trabajar el clean en otro nombre/clave',
        'Usar eval para clonar el string',
        'Borrar raw si el parse falla',
      ],
      correctIndex: 1,
      explanation:
        'El contrato de intake es conservar el original (*_raw) aunque el clean se normalice o falle.',
    },
    // --- operators-precedence (3) ---
    {
      concept: 'operators-precedence',
      question: '¿Cuánto vale la expresión `-3**2` en Python?',
      options: ['9', '-9', '6', 'Error de sintaxis'],
      correctIndex: 1,
      explanation:
        '** tiene mayor precedencia que el unario menos: se evalúa 3**2 = 9 y luego el signo → -9. Usa (-3)**2 para 9.',
    },
    {
      concept: 'operators-precedence',
      question: 'Con `a, b, c = 10, 3, 2`, ¿cuánto es `a + b * c` frente a `(a + b) * c`?',
      options: ['16 y 26', '26 y 16', '15 y 15', '10 y 30'],
      correctIndex: 0,
      explanation:
        '* precede a +: 10+3*2=16. Con paréntesis (10+3)*2=26.',
    },
    {
      concept: 'operators-precedence',
      question: '¿Qué devuelven `17 // 5` y `17 % 5` respectivamente?',
      options: ['3.4 y 2', '3 y 2', '2 y 3', '3 y 0'],
      correctIndex: 1,
      explanation:
        '// es división entera (3); % es el resto (2). / daría 3.4 float.',
    },
    // --- decimal-money (3) ---
    {
      concept: 'decimal-money',
      question: 'Para montos en soles, ¿cuál es la forma correcta de construir un Decimal de 0.1?',
      options: [
        'Decimal(0.1)',
        'Decimal("0.1")',
        'float("0.1")',
        '0.1 + 0',
      ],
      correctIndex: 1,
      explanation:
        'Decimal desde str evita heredar el error binario del float. Decimal(0.1) ya arrastra basura.',
    },
    {
      concept: 'decimal-money',
      question: '¿Por qué `0.1 + 0.2` no es confiable para dinero y qué usas en su lugar?',
      options: [
        'Es confiable; float es exacto en base 10',
        'Por representación binaria; usa decimal.Decimal desde str y quantize a 2 decimales',
        'Porque Python prohíbe sumar floats',
        'Porque hay que usar int siempre',
      ],
      correctIndex: 1,
      explanation:
        '0.1+0.2 produce 0.30000000000000004. En soles: Decimal + quantize(Decimal("0.01")).',
    },
    {
      concept: 'decimal-money',
      question:
        'Subtotal `Decimal("100.00")` e IGV 18%. ¿Qué patrón redondea el IGV a céntimos de sol?',
      options: [
        'float(subtotal) * 0.18',
        '(subtotal * Decimal("0.18")).quantize(Decimal("0.01"))',
        'round(subtotal, 2) * 18',
        'subtotal // Decimal("0.18")',
      ],
      correctIndex: 1,
      explanation:
        'Multiplica con Decimal y quantize a 0.01 (típicamente ROUND_HALF_EVEN) para 2 decimales.',
    },
    // --- io-fstrings (3) ---
    {
      concept: 'io-fstrings',
      question: '¿Qué tipo devuelve siempre `input("Edad: ")` en Python?',
      options: ['int si el usuario escribe dígitos', 'str', 'float', 'None'],
      correctIndex: 1,
      explanation:
        'input siempre devuelve str. Hay que convertir después de strip si necesitas int/Decimal.',
    },
    {
      concept: 'io-fstrings',
      question: 'Con `nombre = "José"` y `monto = 150.5`, ¿cuál imprime el reporte con dos decimales?',
      options: [
        'print("José", monto)',
        'print(f"Cliente: {nombre} | S/ {monto:.2f}")',
        'print(nombre + monto)',
        'print(format(nombre))',
      ],
      correctIndex: 1,
      explanation:
        'Las f-strings interpolan expresiones; :.2f formatea el monto a dos decimales.',
    },
    {
      concept: 'io-fstrings',
      question:
        'Para tests del intake, ¿por qué es mejor `simular_intake(nombres, contacto)` que llamar `input()` real en la función de parse?',
      options: [
        'Porque input no existe en Python 3',
        'Porque una función pura con parámetros es testeable sin consola interactiva',
        'Porque f-strings no funcionan con input',
        'Porque str no puede venir de parámetros',
      ],
      correctIndex: 1,
      explanation:
        'Separar captura de parse permite asserts reproducibles en CI/Pyodide.',
    },
    // --- parse-error-messages (3) ---
    {
      concept: 'parse-error-messages',
      question:
        'En el parser de intake, si `nombres=""`, ¿qué debe conservar el resultado además de listar un error accionable?',
      options: [
        'Nada; se borra el campo',
        'nombres_raw == "" (el original), aunque clean sea None',
        'Solo el traceback de ValueError',
        'Un float NaN',
      ],
      correctIndex: 1,
      explanation:
        'El raw siempre está para auditoría y reintento, incluso cuando el campo está vacío.',
    },
    {
      concept: 'parse-error-messages',
      question: 'Al parsear `apellido_materno = "  Ñahui  "`, ¿cuál es el resultado correcto del round-trip Unicode?',
      options: [
        'Fallar con UnicodeEncodeError',
        'raw con espacios originales y clean "Ñahui" sin error ASCII',
        'Convertir Ñ a N automáticamente',
        'Guardar solo bytes latin-1',
      ],
      correctIndex: 1,
      explanation:
        'Python 3 str es Unicode. strip no destruye Ñ; raw y clean coexisten.',
    },
    {
      concept: 'parse-error-messages',
      question:
        'Si `edad="abc"`, ¿cuál es el comportamiento profesional del parser (safe_int + errors)?',
      options: [
        'Dejar que el programa termine con traceback no capturado',
        'except: pass y seguir en silencio',
        'Agregar error que nombre el campo, conservar edad_raw="abc", no asignar edad limpia',
        'Asignar edad=0 por defecto sin avisar',
      ],
      correctIndex: 2,
      explanation:
        'ValueError se traduce a mensaje accionable; el raw permanece; no se inventa un 0 silencioso.',
    },
  ],
  // S03 V3 — Decisiones y reglas (platform id: data-structures)
  'data-structures': [
    // --- comparisons-membership (3) ---
    {
      concept: 'comparisons-membership',
      question:
        'En un registro sintético de intake, `region = "Lima"` y `ALLOWED = {"Lima", "Arequipa", "Cusco"}`. ¿Qué devuelve `region in ALLOWED` y por qué usas `in` aquí?',
      options: [
        'False; in solo sirve con listas',
        'True; in prueba pertenencia en el set de regiones permitidas',
        'Error; hay que usar == con cada elemento a mano',
        'None; in no devuelve booleano',
      ],
      correctIndex: 1,
      explanation:
        'in/not in evalúan pertenencia. Un set de literales es el patrón de allowlist O(1) para códigos y regiones.',
    },
    {
      concept: 'comparisons-membership',
      question:
        'Para comprobar que un monto está entre 1000 y 2000 inclusive, ¿cuál expresión es idiomática y correcta?',
      options: [
        'monto > 1000 or monto < 2000',
        '1000 <= monto <= 2000',
        'monto = 1000 and monto = 2000',
        'monto in 1000..2000',
      ],
      correctIndex: 1,
      explanation:
        'Python permite encadenar comparaciones: 1000 <= monto <= 2000 equivale a (1000 <= monto) and (monto <= 2000).',
    },
    {
      concept: 'comparisons-membership',
      question:
        'En un validador, `valor` puede faltar. ¿Cuál es la forma correcta de preguntar ausencia vs igualdad de valor?',
      options: [
        'if valor is 0: para ausencia; if valor == None: para cero',
        'if valor is None: para ausencia; if valor == 0: para el valor cero',
        'if valor is None y if valor is 0 son intercambiables',
        'if not valor: siempre distingue None de 0',
      ],
      correctIndex: 1,
      explanation:
        'is None / is not None para el singleton de ausencia. == compara valores de negocio (p. ej. cero). No uses is para números.',
    },
    // --- truthiness-shortcircuit (3) ---
    {
      concept: 'truthiness-shortcircuit',
      question:
        'En el motor de reglas, ¿por qué es un bug usar solo `if monto:` para validar un monto de intake?',
      options: [
        'Porque if no acepta int',
        'Porque 0 es falsy y un cero válido se trataría como “sin monto”, confundiendo ausencia con valor',
        'Porque monto siempre es str',
        'Porque and/or no funcionan con números',
      ],
      correctIndex: 1,
      explanation:
        '0, "", [] son falsy. En negocio, cero puede ser válido y None significa ausente: hay que separar is None de comparaciones numéricas.',
    },
    {
      concept: 'truthiness-shortcircuit',
      question: '¿Qué imprime la expresión `"" or "default"` en Python y por qué?',
      options: [
        'True, porque or siempre devuelve bool',
        '"default", porque or con short-circuit devuelve el primer operando truthy (o el último)',
        'False, porque la cadena vacía gana',
        'None, porque or no evalúa strings',
      ],
      correctIndex: 1,
      explanation:
        'and/or devuelven un operando, no siempre True/False. "" es falsy, así que or evalúa y devuelve "default".',
    },
    {
      concept: 'truthiness-shortcircuit',
      question:
        'Con la política `None → review`, `0 → accept`, negativo → reject: si `m = 0`, ¿cuál rama es correcta?',
      options: [
        'if m: return "accept" (porque 0 “existe”)',
        'if m is None: review; elif m == 0: accept; elif m < 0: reject',
        'if not m: return "reject" siempre',
        'if m == False: accept',
      ],
      correctIndex: 1,
      explanation:
        'Separa presencia (is None) de valor (m == 0, m < 0). if m: fallaría el caso cero válido.',
    },
    // --- if-elif-else (3) ---
    {
      concept: 'if-elif-else',
      question:
        'Para clasificar un score en accept (≥80), review (≥50) o reject, ¿por qué prefieres `if/elif/else` a tres `if` independientes?',
      options: [
        'Porque elif es más rápido en el intérprete',
        'Porque la primera condición verdadera gana y las ramas son excluyentes; tres if pueden sobrescribir el status',
        'Porque else es obligatorio en Python',
        'Porque if no puede comparar enteros',
      ],
      correctIndex: 1,
      explanation:
        'if/elif/else garantiza una sola rama dominante. Encadenar if sueltos permite que dos ramas “disparen” y pisen el resultado.',
    },
    {
      concept: 'if-elif-else',
      question:
        'Con `def classify(score): if score >= 80: return "accept"; elif score >= 50: return "review"; else: return "reject"`, ¿qué devuelve `classify(80)` y `classify(50)`?',
      options: [
        'review y reject (las fronteras se excluyen)',
        'accept y review (fronteras inclusive en el primer match)',
        'reject y accept',
        'Error de sintaxis en elif',
      ],
      correctIndex: 1,
      explanation:
        '80 cumple >= 80 → accept. 50 no es >= 80 pero sí >= 50 → review. El orden y las fronteras deben documentarse en la tabla de ejemplos.',
    },
    {
      concept: 'if-elif-else',
      question:
        'Un colega escribe dos `if` seguidos que asignan `status` (sin elif). Score=90 termina en "review" aunque el primer if era accept. ¿Qué falló?',
      options: [
        'Python ignora el primer if siempre',
        'El segundo if también se evaluó y sobrescribió status; no hay exclusión mutua',
        'Falta un match/case obligatorio',
        'score >= 80 es inválido en Python',
      ],
      correctIndex: 1,
      explanation:
        'Sin elif, ambos if pueden ejecutarse. El motor de reglas necesita una sola decisión por campo: usa elif o return temprano.',
    },
    // --- guard-clauses (3) ---
    {
      concept: 'guard-clauses',
      question:
        '¿Cuál es el orden típico de guard clauses en un validador de edad de intake?',
      options: [
        'Rango → tipo → is None → accept',
        'is None → tipo → rango/allowlist → accept',
        'accept primero y luego los errores',
        'Solo if anidados de 4 niveles sin return',
      ],
      correctIndex: 1,
      explanation:
        'Primero ausencia (is None), luego tipo, luego rango/allowlist; el camino feliz queda al final. Evita TypeError al comparar None.',
    },
    {
      concept: 'guard-clauses',
      question:
        'Si escribes `if edad < 18: ...` antes de `if edad is None:`, ¿qué riesgo concreto hay?',
      options: [
        'Ninguno; None es menor que 18',
        'TypeError al comparar None con int; la guard de ausencia debe ir primero',
        'SyntaxError por el orden de if',
        'edad se convierte sola a 0',
      ],
      correctIndex: 1,
      explanation:
        'None < 18 no es comparable de forma segura: lanza TypeError. Valida ausencia y tipo antes del rango.',
    },
    {
      concept: 'guard-clauses',
      question:
        'Tras `if x >= 0: return "ok"` un `elif x > 5:` nunca se ejecuta para positivos. ¿Cómo se llama ese problema de diseño?',
      options: [
        'Short-circuit de or',
        'Rama muerta / inalcanzable por el orden de condiciones',
        'Allowlist incompleta',
        'Falsy de strings',
      ],
      correctIndex: 1,
      explanation:
        'Una rama muerta es código que el orden de condiciones hace inalcanzable. El revisor de PRs lee el orden como parte del contrato.',
    },
    // --- allowlists-ranges (3) ---
    {
      concept: 'allowlists-ranges',
      question:
        'En S03, `ALLOWED_REG = {"Lima", "Arequipa", "Cusco"}` y `region = "Tacna"`. Con política “desconocido → review”, ¿qué status corresponde?',
      options: [
        'accept, porque es un str no vacío',
        'review, porque no está en la allowlist (dato desconocido)',
        'reject automático sin código de error',
        'Error de sintaxis al usar set',
      ],
      correctIndex: 1,
      explanation:
        'Allowlist: si no está, suele ser review (desconocido) o reject (política estricta). Documenta el código NOT_IN_ALLOWLIST vs OUT_OF_RANGE.',
    },
    {
      concept: 'allowlists-ranges',
      question:
        'Combinas región en allowlist y `18 <= edad <= 65`. Si región es válida pero edad=15, ¿qué status hard-fail es el más coherente en el demo del curso?',
      options: [
        'accept',
        'reject por fuera de rango de edad',
        'review solo por región',
        'None como status',
      ],
      correctIndex: 1,
      explanation:
        'Violar el rango de edad es fallo duro (reject). Región desconocida suele ser review; ausencia también review. Separan códigos de error.',
    },
    {
      concept: 'allowlists-ranges',
      question:
        '¿Por qué conviene nombrar la allowlist en `UPPER_CASE` (p. ej. `ALLOWED_DOC_TYPES`) en el motor de reglas?',
      options: [
        'Porque Python exige mayúsculas para sets',
        'Por convención de constantes de módulo: deja claro que es política de dominio estable',
        'Porque in no funciona con nombres en minúsculas',
        'Porque el linter borra las minúsculas',
      ],
      correctIndex: 1,
      explanation:
        'UPPER_CASE señala constantes de política (regiones, tipos de documento). No cambia la semántica de in, pero mejora legibilidad y revisiones.',
    },
    // --- decision-tables-match (3) ---
    {
      concept: 'decision-tables-match',
      question:
        '¿Qué es una decision table en el contexto del motor de reglas de intake?',
      options: [
        'Un CSV obligatorio de pandas',
        'Una tabla de negocio: filas de condiciones → acción, que luego implementas con if o match',
        'Solo la sintaxis match/case de Python',
        'Un dict vacío sin ejemplos',
      ],
      correctIndex: 1,
      explanation:
        'Primero se escribe la tabla (condiciones → accept/review/reject); el código es la implementación. Evita ramas inventadas fuera de la tabla.',
    },
    {
      concept: 'decision-tables-match',
      question:
        'Con `match code: case "MISSING" | "NEEDS_REVIEW": return "review"`, ¿qué expresa el patrón con `|`?',
      options: [
        'AND lógico de dos códigos a la vez',
        'OR pattern: cualquiera de esos literales mapea a review',
        'Que code debe ser una lista',
        'Un default obligatorio',
      ],
      correctIndex: 1,
      explanation:
        'En match/case, A | B es un patrón OR. Útil para estados finitos del validador (códigos estables).',
    },
    {
      concept: 'decision-tables-match',
      question:
        '¿Cuándo prefieres `if/elif` frente a `match/case` para una regla de intake?',
      options: [
        'Siempre match; if está deprecado',
        'Cuando hay rangos numéricos o combinaciones de varios campos que no son literales finitos',
        'Solo si Python es 2.7',
        'Nunca; match cubre todos los rangos con case _',
      ],
      correctIndex: 1,
      explanation:
        'match brilla con literales/estados finitos. Rangos y multi-campo suelen ser más claros con if. El curso asume 3.12+ para match.',
    },
    // --- invariants-examples (3) ---
    {
      concept: 'invariants-examples',
      question:
        'Un invariante de campo dice: “`contacto` es str de 9 dígitos, o None si aún no se capturó”. ¿Qué falta para que sea usable en el gate?',
      options: [
        'Solo un comentario TODO',
        'Ejemplos canónicos por estado (accept / reject / review) que demuestren el contrato',
        'Convertirlo a float',
        'Borrar el caso None',
      ],
      correctIndex: 1,
      explanation:
        'Los ejemplos accept/reject/review/missing convierten el invariante en especificación ejecutable. Sin contraejemplos, la regla es vaga.',
    },
    {
      concept: 'invariants-examples',
      question:
        '¿Por qué no debes usar solo `assert` como validación de negocio en el intake de producción?',
      options: [
        'assert no existe en Python 3',
        'python -O desactiva asserts; las reglas de negocio deben devolver status/code/message',
        'assert solo funciona con str',
        'assert siempre lanza KeyError',
      ],
      correctIndex: 1,
      explanation:
        'assert es útil en tests/desarrollo. El motor de reglas expone status/code/message para control de flujo y métricas.',
    },
    {
      concept: 'invariants-examples',
      question:
        'Para `validate_contacto`, ¿cuál trío de ejemplos cubre bien el invariante de 9 dígitos o None?',
      options: [
        'Solo "999000111" → accept',
        '"999000111"→accept, "12345"→reject, None→review (y vacío "  "→reject)',
        'None→accept y "abc"→accept',
        'Cualquier truthy → accept',
      ],
      correctIndex: 1,
      explanation:
        'Mínimo: un ejemplo por estado que la regla produce. El camino feliz solo no basta para el gate CP-N1-A.',
    },
    // --- actionable-messages-branch-tests (3) ---
    {
      concept: 'actionable-messages-branch-tests',
      question:
        '¿Cuál mensaje es accionable al rechazar edad=-5 en el validador?',
      options: [
        'Error',
        "Campo 'edad'=-5 fuera de rango; usa 0–120.",
        'inválido',
        'fail',
      ],
      correctIndex: 1,
      explanation:
        'Un mensaje accionable nombra el campo, el problema y la acción esperada. Códigos estables (OUT_OF_RANGE) complementan el texto.',
    },
    {
      concept: 'actionable-messages-branch-tests',
      question:
        'Si el validador de edad tiene 4 caminos (None, tipo mal, rango, OK), ¿cuántos casos de prueba mínimos necesitas?',
      options: [
        '1 (solo el camino feliz)',
        'Al menos 4: un test por rama, incluyendo el default',
        '0 si el código “se ve bien”',
        'Solo tests de match/case',
      ],
      correctIndex: 1,
      explanation:
        'Un test por rama del validador. Si solo pruebas accept, el off-by-one en fronteras no se detecta.',
    },
    {
      concept: 'actionable-messages-branch-tests',
      question:
        'Al depurar `edad >= 18` vs `edad > 18` en el motor de reglas, ¿qué práctica del curso aplica?',
      options: [
        'Loguear PII real del cliente en producción',
        'Ciclo test rojo → ajustar frontera → verde, con datos sintéticos y códigos estables',
        'Silenciar el else con except: pass',
        'Usar solo print sin asserts',
      ],
      correctIndex: 1,
      explanation:
        'Fronteras se fijan con ejemplos ejecutables. Solo datos sintéticos; no secretos ni PII real en logs del curso.',
    },
  ],

  // S04 V3 — Iteración y resúmenes (platform id: functions-modules)
  'functions-modules': [
    // --- for-range-sequences (3) ---
    {
      concept: 'for-range-sequences',
      question:
        'En un lote de intake sintético `filas = [{...}, {...}, {...}]`, ¿cuál es el recorrido idiomático y más seguro para validar cada registro?',
      options: [
        'for i in range(len(filas)+1): validate(filas[i])',
        'for reg in filas: validate(reg)',
        'while True: validate(filas[0]) sin avanzar índice',
        'for i in range(1, len(filas)): solo si i es par',
      ],
      correctIndex: 1,
      explanation:
        'for reg in filas recorre cada elemento una vez sin inventar índices. range(len+1) provoca IndexError (off-by-one).',
    },
    {
      concept: 'for-range-sequences',
      question:
        '¿Qué valores produce `list(range(3))` y por qué el stop es importante en resúmenes de N filas?',
      options: [
        '[1, 2, 3]; stop inclusivo siempre',
        '[0, 1, 2]; stop exclusivo — range(n) da n índices 0..n-1',
        '[0, 1, 2, 3]; incluye el stop',
        '[]; range no funciona con enteros',
      ],
      correctIndex: 1,
      explanation:
        'range(stop) es exclusivo en el extremo superior. Para N filas, range(N) alinea con índices válidos 0..N-1.',
    },
    {
      concept: 'for-range-sequences',
      question:
        '¿Cuándo preferirías `for i in range(len(filas))` sobre `for reg in filas` en el script de calidad?',
      options: [
        'Siempre; el índice es obligatorio en Python',
        'Solo cuando necesitas el índice (p. ej. reportar “fila i”) y no basta enumerate',
        'Nunca uses range con listas',
        'Cuando quieras saltarte el último elemento por defecto',
      ],
      correctIndex: 1,
      explanation:
        'El índice manual solo se justifica si lo usas. En la mayoría de lotes, for reg in filas (o enumerate) reduce off-by-one.',
    },
    // --- enumerate-zip (3) ---
    {
      concept: 'enumerate-zip',
      question:
        'Para reportar “fila 1, fila 2…” al humano en un lote, ¿qué llamada es la más clara?',
      options: [
        'for i in filas: print(i)',
        'for i, reg in enumerate(filas, start=1): print(f"fila {i}", reg)',
        'for i, reg in enumerate(filas, start=0): print(f"fila {i+0}") sin documentar',
        'zip(filas, filas) para numerar',
      ],
      correctIndex: 1,
      explanation:
        'enumerate(..., start=1) da índice humano sin armar el contador a mano. start=0 es para índices de programación.',
    },
    {
      concept: 'enumerate-zip',
      question:
        'Si `ids` tiene 3 elementos y `regiones` 2, ¿qué hace `list(zip(ids, regiones))` y por qué es un riesgo de calidad?',
      options: [
        'Lanza ValueError siempre',
        'Empareja solo 2 pares y el tercer id se pierde en silencio',
        'Rellena con None automáticamente',
        'Invierte el orden de ids',
      ],
      correctIndex: 1,
      explanation:
        'zip se detiene en la secuencia más corta. Desalineación silenciosa infla/deflacta tasas del dashboard de intake.',
    },
    {
      concept: 'enumerate-zip',
      question:
        '¿Cómo evitas desalinear columnas antes de un zip en un pipeline de intake (Python 3.9 o con helper)?',
      options: [
        'Ignorar longitudes; zip “sabe”',
        'Validar len(a)==len(b) (o zip(..., strict=True) en 3.10+) antes de emparejar',
        'Usar solo + entre listas',
        'Convertir todo a set y zip sets',
      ],
      correctIndex: 1,
      explanation:
        'El gate de alineación es len igual o zip strict. Sets no preservan orden ni pares columnares.',
    },
    // --- while-sentinels (3) ---
    {
      concept: 'while-sentinels',
      question:
        '¿Cuándo es más natural un `while` que un `for` en el script de lotes?',
      options: [
        'Cuando ya conoces exactamente el número de filas en una lista fija',
        'Cuando no sabes de antemano cuántas iteraciones habrá (stream, centinela, reintentos)',
        'Siempre; for está deprecado',
        'Solo para sumar enteros',
      ],
      correctIndex: 1,
      explanation:
        'while brilla con condición de terminación dinámica. Si la secuencia ya está materializada, for suele ser más claro.',
    },
    {
      concept: 'while-sentinels',
      question:
        'En `lineas = ["C001|Lima", "C002|Cusco", "", "C003|Piura"]`, si tratas `""` como centinela de fin de lote y haces break, ¿qué queda sin procesar?',
      options: [
        'Nada; el centinela no corta el lote',
        'C003|Piura (y lo posterior al centinela)',
        'Solo C001',
        'Todo el archivo se borra',
      ],
      correctIndex: 1,
      explanation:
        'El centinela marca fin: lo que sigue no se lee en ese lote. Documenta si el vació es fin o “fila vacía a saltar”.',
    },
    {
      concept: 'while-sentinels',
      question:
        'Antes de escribir un while de intake, ¿qué debes poder responder para evitar un loop infinito?',
      options: [
        'Solo el color del prompt',
        'Qué variable de control cambia cada vuelta y cuándo la condición se vuelve falsa',
        'Si range es más lento',
        'Si el centinela es un int obligatorio',
      ],
      correctIndex: 1,
      explanation:
        'Sin actualización de estado y condición de salida clara, el while no termina. Añade MAX_ITERS en prototipos.',
    },
    // --- break-continue-guards (3) ---
    {
      concept: 'break-continue-guards',
      question:
        'En un for sobre líneas de intake, ¿qué hace `continue` al encontrar una línea en blanco tras strip?',
      options: [
        'Termina todo el programa',
        'Salta al siguiente ciclo sin procesar esa línea',
        'Borra la lista completa',
        'Convierte la línea en centinela END',
      ],
      correctIndex: 1,
      explanation:
        'continue omite el resto del cuerpo y pasa a la siguiente iteración. break saldría del bucle por completo.',
    },
    {
      concept: 'break-continue-guards',
      question:
        '¿Cuál es una guardrail razonable contra loops infinitos en un while de prototipo de intake?',
      options: [
        'No poner ninguna condición',
        'Máximo de iteraciones (MAX) o centinela/break garantizado y testeado',
        'Usar solo recursion infinita',
        'while True sin break nunca falla en producción',
      ],
      correctIndex: 1,
      explanation:
        'MAX_ITERS, centinela o excepción de escape evitan saturar CPU. while True solo es legítimo con salida obvia.',
    },
    {
      concept: 'break-continue-guards',
      question:
        'Procesas líneas; `END` debe cerrar el lote y `SKIP` ignorarse. ¿Qué combinación es correcta?',
      options: [
        'break en SKIP y continue en END',
        'continue en SKIP (y vacíos); break en END',
        'return en cada línea vacía sin bucle',
        'zip(END, SKIP) para filtrar',
      ],
      correctIndex: 1,
      explanation:
        'continue salta basura; break corta en el centinela de fin. Invertirlos procesa de más o de menos.',
    },
    // --- counters-accumulators (3) ---
    {
      concept: 'counters-accumulators',
      question:
        'En el gate CP-N1-A, ¿cómo defines la tasa de error de un lote con n_error rechazos y n_total registros intentados?',
      options: [
        'n_error / n_accept (solo aceptados en el denominador)',
        'n_error / n_total si n_total > 0; si no, None o N/A (no dividir por cero)',
        'n_total / n_error siempre',
        'Siempre 0 porque el dashboard redondea',
      ],
      correctIndex: 1,
      explanation:
        'Denominador = procesados/intentados. Usar solo aceptados infla la tasa y miente al dashboard de calidad.',
    },
    {
      concept: 'counters-accumulators',
      question:
        'Diferencia práctica en un pase sobre statuses: contador vs acumulador',
      options: [
        'Son sinónimos exactos en Python',
        'Contador suma eventos (n_reject += 1); acumulador suma cantidades (total_monto += m)',
        'Acumulador solo sirve con strings',
        'Contador requiere match/case',
      ],
      correctIndex: 1,
      explanation:
        'Contadores cuentan ocurrencias; acumuladores agregan magnitudes. Ambos suelen vivir en un solo for O(n).',
    },
    {
      concept: 'counters-accumulators',
      question:
        'Quieres el índice del primer `reject` en una lista de statuses. ¿Qué patrón O(n) es idiomático?',
      options: [
        'Dos bucles anidados comparando todos con todos',
        'Un for con enumerate; guardar el primer índice y opcionalmente break',
        'Ordenar la lista y tomar el medio',
        'Usar range(len+1) y silenciar IndexError',
      ],
      correctIndex: 1,
      explanation:
        'Un solo pase con flag/índice basta. Anidar bucles innecesarios complica y puede volverse cuadrático.',
    },
    // --- comprehensions (3) ---
    {
      concept: 'comprehensions',
      question:
        'Dado `results` con dicts `{id, status}`, ¿cómo obtienes los ids en reject con una list comprehension legible?',
      options: [
        '[r for r in results] sin filtrar',
        '[r["id"] for r in results if r["status"] == "reject"]',
        '{r["id"] for r in results if False}',
        'results.filter(status=reject) nativo sin librerías',
      ],
      correctIndex: 1,
      explanation:
        'La forma [expr for x in xs if cond] filtra y proyecta. No hay .filter de listas en la stdlib como en JS.',
    },
    {
      concept: 'comprehensions',
      question:
        '¿Cuándo debes preferir un `for` explícito sobre una comprehension en el resumen de intake?',
      options: [
        'Nunca; comprehension siempre gana',
        'Cuando hay multi-rama, try/except por fila, varios contadores o side effects',
        'Solo si la lista está vacía',
        'Cuando el resultado es un dict',
      ],
      correctIndex: 1,
      explanation:
        'Comprehensions para transformaciones simples. Lógica de validación multi-rama se lee mejor con for.',
    },
    {
      concept: 'comprehensions',
      question:
        '¿Qué construye `{r["status"] for r in results}` sobre un lote de resultados?',
      options: [
        'Una lista ordenada de statuses',
        'Un set con los códigos de status únicos presentes',
        'Un dict id→status',
        'Un generador infinito',
      ],
      correctIndex: 1,
      explanation:
        'Set comprehension: llaves {} con for sin pares k:v producen un set de valores únicos.',
    },
    // --- state-tracing (3) ---
    {
      concept: 'state-tracing',
      question:
        'Al depurar un contador que “no cuadra”, ¿qué es trazar estado en el sentido del curso?',
      options: [
        'Borrar todos los prints y adivinar',
        'Tabla iteración | inputs | variables | decisión/salida con valores concretos',
        'Solo mirar el tipado estático',
        'Reescribir en while True sin condición',
      ],
      correctIndex: 1,
      explanation:
        'La traza hace visible la actualización del estado. Si la tabla no cuadra con el print, el bug está en el cuerpo del bucle.',
    },
    {
      concept: 'state-tracing',
      question:
        'En la traza de montos `[10, 0, -5, 20]` sumando solo positivos, tras i=2 (m=-5), ¿cuál es total y n_pos esperados?',
      options: [
        'total=5, n_pos=2',
        'total=10, n_pos=1 (el -5 no suma; 0 tampoco)',
        'total=25, n_pos=3',
        'total=0, n_pos=0',
      ],
      correctIndex: 1,
      explanation:
        'Solo 10 entró al acumulador antes de -5. 0 y -5 no incrementan n_pos ni total. Luego 20 → total 30, n_pos 2.',
    },
    {
      concept: 'state-tracing',
      question:
        '¿Por qué el curso pide traza mínima antes de culpar a “Python raro” en un bucle de tasas?',
      options: [
        'Porque print está prohibido',
        'Porque casi siempre el error está en la actualización de contadores/índices, no en el intérprete',
        'Porque for no actualiza variables',
        'Porque range es aleatorio',
      ],
      correctIndex: 1,
      explanation:
        'Traza con datos sintéticos localiza off-by-one y denominadores mal puestos sin misterio de runtime.',
    },
    // --- complexity-off-by-one (3) ---
    {
      concept: 'complexity-off-by-one',
      question:
        'Un solo `for` sobre n filas de intake es O(n). Dos `for` anidados cada uno sobre las n filas, ¿qué costo tienen?',
      options: [
        'O(1)',
        'O(n²) — cuadrático; con 100k filas se nota el “cuelgue”',
        'O(log n)',
        'O(n) igual que un solo for',
      ],
      correctIndex: 1,
      explanation:
        'n×n pares ≈ n² operaciones. Resúmenes de calidad deben preferir un pase lineal de contadores.',
    },
    {
      concept: 'complexity-off-by-one',
      question:
        'Con `xs = ["a","b","c"]`, ¿qué ocurre al evaluar `xs[len(xs)]`?',
      options: [
        'Devuelve "c"',
        'IndexError: el último índice válido es len(xs)-1',
        'Devuelve None en silencio',
        'Recorta la lista a vacía',
      ],
      correctIndex: 1,
      explanation:
        'Índices 0..n-1. Acceder a n es el off-by-one clásico que rompe demos del gate.',
    },
    {
      concept: 'complexity-off-by-one',
      question:
        'Para contar rejects en un lote de resultados, ¿qué diseño alinea con el gate CP-N1-A?',
      options: [
        'Doble bucle que re-escanea todo el lote por cada fila',
        'Un solo pase O(n) con contadores; tasa = rejects/procesados',
        'Comprehension de tres niveles anidados por estética',
        'Recalcular len(results) dentro de while True',
      ],
      correctIndex: 1,
      explanation:
        'Un pase lineal con denominador correcto es demos rápidas y métricas honestas. Evita n² cosmético.',
    },
  ],
  // S05 V3 — Funciones, contratos y descomposición (platform id: oop)
  oop: [
    // --- def-call-return (3) ---
    {
      concept: 'def-call-return',
      question:
        'En un normalizador de intake, ¿qué devuelve una función Python si no hay `return` explícito?',
      options: [
        '0',
        'None',
        'El último argumento',
        'Error de sintaxis siempre',
      ],
      correctIndex: 1,
      explanation:
        'Sin return, el resultado de la llamada es None. Un normalizador debe retornar el valor transformado, no depender de print.',
    },
    {
      concept: 'def-call-return',
      question:
        '¿Cuál nombre de función alinea mejor con el estilo de normalizadores del curso?',
      options: [
        'email2',
        'normalize_email',
        'Email',
        'x',
      ],
      correctIndex: 1,
      explanation:
        'Verbos/acciones claras (normalize_*) documentan el contrato. PascalCase es para clases (S11); nombres opacos dificultan el review.',
    },
    {
      concept: 'def-call-return',
      question:
        '¿Por qué los normalizadores deben `return` el valor en vez de solo `print` el resultado?',
      options: [
        'print es más rápido en CPython',
        'El pipeline necesita el valor para componer y testear; print es efecto colateral de demo',
        'return está deprecado en 3.12',
        'print convierte a Decimal automáticamente',
      ],
      correctIndex: 1,
      explanation:
        'return habilita composición y asserts. print en el core puro ensucia stdout y rompe pureza.',
    },
    // --- params-safe-defaults (3) ---
    {
      concept: 'params-safe-defaults',
      question:
        '¿Por qué `def bad_add(item, bucket=[])` es un bug clásico en normalización/acumulación?',
      options: [
        'Porque [] no es válido en Python',
        'El default mutable se crea una vez y se comparte entre llamadas',
        'Porque item debe ser keyword-only',
        'Porque falta type hint obligatorio',
      ],
      correctIndex: 1,
      explanation:
        'Los defaults se evalúan una vez en la definición. Usa None y crea la lista dentro de la función.',
    },
    {
      concept: 'params-safe-defaults',
      question:
        '¿Cuál es el patrón seguro para un acumulador opcional?',
      options: [
        'def f(x, acc={}): ...',
        'def f(x, acc=None): if acc is None: acc = []; ...',
        'def f(x, acc=list): ...',
        'def f(x, acc=[]): siempre está bien',
      ],
      correctIndex: 1,
      explanation:
        'None + creación local evita compartir estado entre llamadas. dict/list defaults mutables son P1 en review.',
    },
    {
      concept: 'params-safe-defaults',
      question:
        'En `def normalize_telefono(raw, *, country="PE")`, ¿qué indica el `*`?',
      options: [
        'Que raw es opcional',
        'Que country es keyword-only: hay que pasarlo por nombre',
        'Que la función es async',
        'Que country se evalúa en cada import del sistema',
      ],
      correctIndex: 1,
      explanation:
        'Tras *, los parámetros solo aceptan keyword. Mejora legibilidad de políticas regionales en la llamada.',
    },
    // --- prepost-docstrings (3) ---
    {
      concept: 'prepost-docstrings',
      question:
        '¿Qué es una precondición de `normalize_email` en el sentido del curso?',
      options: [
        'El valor ya normalizado que devuelve',
        'Lo que debe cumplirse antes de llamar (p. ej. raw es str usable)',
        'Un assert que solo corre con -O',
        'El color del banner en la UI',
      ],
      correctIndex: 1,
      explanation:
        'Pre = entrada válida esperada. Post = garantía del return (p. ej. lower sin espacios extremos).',
    },
    {
      concept: 'prepost-docstrings',
      question:
        'Un docstring de normalizador debe principalmente…',
      options: [
        'Copiar la firma sin añadir política',
        'Documentar qué hace, pre/post, retorno y errores de dominio (alineado al código)',
        'Listar todos los builtins de Python',
        'Prohibir type hints',
      ],
      correctIndex: 1,
      explanation:
        'PEP 257 + contrato de negocio. Si docstring y código discrepan, el revisor devuelve el PR.',
    },
    {
      concept: 'prepost-docstrings',
      question:
        'Si `normalize_email` documenta “Raises ValueError si falta @” pero el código devuelve "" en silencio, ¿qué falla?',
      options: [
        'Nada; el silencio es más seguro',
        'El contrato: docstring y código no están alineados',
        'Solo el type checker de la UI',
        'Python ignora docstrings en runtime siempre y eso valida el bug',
      ],
      correctIndex: 1,
      explanation:
        'El contrato es la pareja código+docstring. Hay que alinear raise/return con lo documentado y los tests.',
    },
    // --- type-hints-domain-errors (3) ---
    {
      concept: 'type-hints-domain-errors',
      question:
        '¿Los type hints (`def f(x: str) -> str`) convierten el valor en runtime en CPython normal?',
      options: [
        'Sí; str("1") se aplica solo',
        'No; son documentación/verificación estática (checkers), no coerción automática',
        'Solo si usas match/case',
        'Sí para int, no para str',
      ],
      correctIndex: 1,
      explanation:
        'Hints graduales no castean. Sigue validando/parseando explícitamente en el cuerpo.',
    },
    {
      concept: 'type-hints-domain-errors',
      question:
        'Un “error de dominio” en parse_edad("abc") se modela en el demo del curso como…',
      options: [
        'SyntaxError del intérprete al definir la función',
        'Resultado de negocio inválido (p. ej. tupla ok/value/error o ValueError), no un bug de Python per se',
        'Segfault del SO',
        'Éxito silencioso con edad 0',
      ],
      correctIndex: 1,
      explanation:
        'Dominio ≠ crash del lenguaje. Elige raise vs result object y sé consistente en el módulo de normalizadores.',
    },
    {
      concept: 'type-hints-domain-errors',
      question:
        '¿Por qué evitar anotar `-> str` si la función puede devolver None en ausencia?',
      options: [
        'Porque None es str en Python',
        'Porque el hint mentiría; usa Optional[str] / str | None',
        'Porque los hints prohíben None siempre en el bytecode',
        'Porque return None es ilegal',
      ],
      correctIndex: 1,
      explanation:
        'Hints honestos documentan ausencia. str | None (o Optional) alinea contrato y checkers.',
    },
    // --- small-functions-compose (3) ---
    {
      concept: 'small-functions-compose',
      question:
        '¿Qué hace un orquestador delgado `normalize_record` en el diseño de S05?',
      options: [
        'Reimplementa strip en cada campo y escribe a disco',
        'Delega a normalizadores pequeños y arma el dict resultado',
        'Hereda de una clase ABC obligatoria',
        'Abre un socket por campo',
      ],
      correctIndex: 1,
      explanation:
        'Composición: el orquestador no duplica lógica. Un fix en strip_collapse beneficia a todos los campos.',
    },
    {
      concept: 'small-functions-compose',
      question:
        'Señal de que debes extraer otra función al descomponer un normalizador largo:',
      options: [
        'La función tiene un solo return',
        'Necesitas un comentario de “sección” en medio del cuerpo para entender bloques distintos',
        'El nombre ya es un verbo',
        'Hay un type hint',
      ],
      correctIndex: 1,
      explanation:
        'Comentarios de sección suelen marcar otra unidad de abstracción. Extrae y nombra el paso.',
    },
    {
      concept: 'small-functions-compose',
      question:
        'Beneficio principal de funciones pequeñas en el inicio de CP-N1-B:',
      options: [
        'Obligan a usar clases de inmediato',
        'Tests unitarios fáciles, reuso en CLI/ETL y orquestación clara',
        'Eliminan la necesidad de asserts',
        'Hacen mutables los defaults automáticamente',
      ],
      correctIndex: 1,
      explanation:
        'Descomposición es el puente a pipelines testeables. OOP de dominio llega en S11, no aquí.',
    },
    // --- purity-io-injection (3) ---
    {
      concept: 'purity-io-injection',
      question:
        'Una función pura de normalización debe…',
      options: [
        'Leer un CSV global y print en cada llamada',
        'Devolver el mismo resultado para los mismos args sin efectos (I/O, mutar globales)',
        'Depender de la hora del sistema',
        'Abrir la red para validar emails MX siempre',
      ],
      correctIndex: 1,
      explanation:
        'Pureza = determinismo + sin efectos. I/O al borde (main/load/save); core testeable.',
    },
    {
      concept: 'purity-io-injection',
      question:
        'Idempotencia de `normalize_telefono` significa que para entradas válidas…',
      options: [
        'f(x) != f(f(x)) siempre',
        'f(f(x)) == f(x)',
        'f muta x in-place dos veces',
        'f lanza si se llama dos veces',
      ],
      correctIndex: 1,
      explanation:
        'Aplicar dos veces no cambia el resultado canónico. Gate típico del inicio CP-N1-B.',
    },
    {
      concept: 'purity-io-injection',
      question:
        '¿Qué es inyección de I/O en el borde según S05?',
      options: [
        'Hardcodear open("data.csv") dentro de normalize_email',
        'Pasar reader/path/función como argumento al orquestador; el core no toca disco',
        'Usar global FILE obligatorio',
        'Prohibir tests con fakes',
      ],
      correctIndex: 1,
      explanation:
        'Inyectar dependencias permite fakes en tests y mantiene normalizadores puros.',
    },
    // --- legb-closures (3) ---
    {
      concept: 'legb-closures',
      question:
        '¿Qué significa LEGB al resolver un nombre en Python?',
      options: [
        'Lista, Entero, Generador, Bytes',
        'Local → Enclosing → Global → Builtin (orden de búsqueda)',
        'Solo Global y Builtin',
        'Un protocolo de red',
      ],
      correctIndex: 1,
      explanation:
        'Python busca en ese orden; si no halla, NameError. Closures usan el enclosing scope.',
    },
    {
      concept: 'legb-closures',
      question:
        'Un closure en el sentido del demo `make_phone_normalizer(prefix)` es…',
      options: [
        'Una clase abstracta con MRO',
        'Una función interna que recuerda variables del scope que la envuelve',
        'Un hilo del sistema operativo',
        'Un default mutable de lista',
      ],
      correctIndex: 1,
      explanation:
        'La factory devuelve norm configurado con prefix sin necesitar clases (S11) ni global mutable.',
    },
    {
      concept: 'legb-closures',
      question:
        '¿Por qué el curso desaconseja `global PREF` dentro de normalizadores?',
      options: [
        'Porque global no existe en Python',
        'Porque complica tests y acopla el core a estado de módulo; prefiere argumento o closure',
        'Porque solo funciona con match',
        'Porque rompe f-strings',
      ],
      correctIndex: 1,
      explanation:
        'Config por parámetro/closure mantiene pureza y reproducibilidad. global es última opción.',
    },
    // --- examples-refactor (3) ---
    {
      concept: 'examples-refactor',
      question:
        'Antes de refactorizar `normalize_email`, ¿qué fija el curso como red de seguridad?',
      options: [
        'Borrar los tests para ir más rápido',
        'Ejemplos/asserts ejecutables de la conducta actual (incl. idempotencia)',
        'Cambiar la política de negocio en el mismo commit sin asserts',
        'Renombrar a Email2 sin pruebas',
      ],
      correctIndex: 1,
      explanation:
        'Rojo-verde-refactor: asserts primero; el refactor interno no debe cambiar resultados canónicos.',
    },
    {
      concept: 'examples-refactor',
      question:
        'Tras extraer `strip` y `lower` en pasos internos, los asserts previos siguen verdes. ¿Qué concluimos?',
      options: [
        'Que la conducta observable se preservó',
        'Que Python desactiva asserts en todos los modos',
        'Que el docstring ya no importa',
        'Que hay que eliminar type hints',
      ],
      correctIndex: 1,
      explanation:
        'Tests verdes tras el cambio de forma interna = refactor seguro. Actualiza docstring si la política sí cambió.',
    },
    {
      concept: 'examples-refactor',
      question:
        '¿Qué fronteras conviene cubrir al fijar ejemplos de un normalizador de texto sintético?',
      options: [
        'Solo el camino feliz con un email perfecto',
        'Vacío/solo espacios, Unicode (Ñ/tildes), doble aplicación (idempotencia), None si el contrato lo admite',
        'Únicamente PII real de clientes',
        'Solo números de tarjeta de crédito',
      ],
      correctIndex: 1,
      explanation:
        'Fronteras y datos sintéticos; nunca PII real. Idempotencia y Unicode son gates típicos de calidad.',
    },
  ],
  // S06 V3 — Colecciones y estructuras de datos (platform id: numpy)
  numpy: [
    {
      concept: 'list-tuple-slicing',
      question:
        'En el modelo en memoria de intake, ¿cuándo preferir una tuple sobre una list para headers de columnas?',
      options: [
        'Siempre: list está deprecada',
        'Cuando el contrato de columnas debe ser inmutable (claves estables que no se mutan por accidente)',
        'Solo si hay más de 1000 columnas',
        'Nunca: tuple no soporta slicing',
      ],
      correctIndex: 1,
      explanation:
        'tuple es inmutable: ideal para contratos de headers. list es mutable y crece con append.',
    },
    {
      concept: 'list-tuple-slicing',
      question:
        'Con txs de 4 transacciones, ¿qué ids devuelve txs[-3:] y por qué el stop de slicing importa?',
      options: [
        'Los 4 ids; stop inclusivo como range',
        'Los últimos 3 (p. ej. T2,T3,T4); stop exclusivo y negativo cuenta desde el final',
        'Solo el primero',
        'Error: índices negativos no existen en listas',
      ],
      correctIndex: 1,
      explanation:
        'Slicing negativo toma ventana final; no muta el original y el extremo superior es exclusivo como en range.',
    },
    {
      concept: 'list-tuple-slicing',
      question:
        '¿Cuál es el costo de `x in seq` cuando seq es una list de n filas de clientes?',
      options: [
        'O(1) siempre',
        'O(n) — membership lineal; para lookups masivos preferir set/dict',
        'O(log n) por binary search automático',
        'O(n²) por hashing',
      ],
      correctIndex: 1,
      explanation:
        'in sobre list/tuple recorre. Sets/dicts dan membership amortizado O(1) en T2.',
    },
    {
      concept: 'unpacking-aliasing-copy',
      question:
        'Tras `a, b = ("C001", "Lima")`, ¿qué ocurre si la fila tiene 3 campos y haces unpacking a 2 variables?',
      options: [
        'Se ignoran campos extra en silencio',
        'ValueError: el largo no calza — útil para detectar shape roto',
        'Se crea None para el faltante',
        'Se convierte a dict automáticamente',
      ],
      correctIndex: 1,
      explanation:
        'Unpacking estricto falla si len no coincide; eso detecta filas mal formadas temprano.',
    },
    {
      concept: 'unpacking-aliasing-copy',
      question:
        'Si `b = a` y a es una list de dicts de clientes, y mutas `b[0]["region"] = "Cusco"`, ¿qué pasa con a?',
      options: [
        'a queda intacto porque b es copia',
        'a también cambia: b es alias del mismo objeto, no copia',
        'Python lanza IsolationError',
        'Solo cambia si usas deepcopy',
      ],
      correctIndex: 1,
      explanation:
        'Asignación alias: ambas variables apuntan al mismo objeto. Mutar por un nombre afecta al otro.',
    },
    {
      concept: 'unpacking-aliasing-copy',
      question:
        '¿Cuándo basta `list.copy()` / `seq[:]` (shallow) frente a `copy.deepcopy` en intake anidado?',
      options: [
        'Siempre shallow; deep es ilegal',
        'Shallow si solo reordenas filas sin mutar campos de dicts compartidos; deep si mutas dicts anidados clonados',
        'Deep solo para strings',
        'Shallow copia también los dicts internos',
      ],
      correctIndex: 1,
      explanation:
        'Shallow copia la lista pero reutiliza referencias a dicts. Mutar campos internos requiere deep o reconstrucción.',
    },
    {
      concept: 'dicts-membership',
      question:
        'Para lookup O(1) de cliente por id en un lote, ¿qué estructura alinea con el curso?',
      options: [
        'list y búsqueda lineal siempre',
        'dict id→fila (índice) además o en lugar de solo list[dict]',
        'tuple de tuples sin claves',
        'set de strings de id y luego adivinar la fila',
      ],
      correctIndex: 1,
      explanation:
        'dict indexa por clave. list de filas es orden de inserción; el índice id→fila da acceso directo.',
    },
    {
      concept: 'dicts-membership',
      question:
        '¿Cómo lees un campo opcional sin KeyError si puede faltar en el dict del registro?',
      options: [
        'reg[\'email\'] siempre',
        'reg.get(\'email\') o \'email\' in reg antes de indexar',
        'reg.email como atributo nativo',
        'list(reg)[0]',
      ],
      correctIndex: 1,
      explanation:
        'get/in evitan KeyError. Indexación directa falla si la clave no existe.',
    },
    {
      concept: 'dicts-membership',
      question:
        'En un dict de conteos por región, ¿qué patrón es idiomático para incrementar?',
      options: [
        'Solo counts[r] += 1 sin inicializar (siempre funciona)',
        'counts[r] = counts.get(r, 0) + 1  (o defaultdict/Counter)',
        'counts.append(r)',
        'counts + r',
      ],
      correctIndex: 1,
      explanation:
        'get con default 0 (o Counter) evita KeyError en la primera ocurrencia.',
    },
    {
      concept: 'sets-dedup',
      question:
        'Al deduplicar ids de clientes vistos, ¿qué ventaja tiene un set frente a list?',
      options: [
        'Preserva orden de inserción siempre mejor que dict',
        'Membership e inserción amortizados O(1); ideal para “¿ya vimos este id?”',
        'Permite dicts como elementos sin hash',
        'Automáticamente resuelve conflictos de campos distintos',
      ],
      correctIndex: 1,
      explanation:
        'set hashea elementos inmutables. Detecta duplicados rápido; conflictos de contenido se reportan aparte.',
    },
    {
      concept: 'sets-dedup',
      question:
        'Dos filas con mismo id pero distinta región: ¿qué debe hacer un pipeline de calidad según el curso?',
      options: [
        'Borrar ambas en silencio',
        'Reportar conflicto (no tratarlo como “duplicado inocente” sin evidencia)',
        'Quedarse con la última y no loguear',
        'Convertir id a list',
      ],
      correctIndex: 1,
      explanation:
        'Conflicto ≠ duplicado inocente. Se reporta para revisión; no se “promedia” identidad.',
    },
    {
      concept: 'sets-dedup',
      question:
        '¿Qué operación de set responde “ids en cohorte A pero no en B”?',
      options: [
        'A | B (unión)',
        'A - B (diferencia)',
        'A & B (intersección) devuelve solo los de B',
        'A ^ A siempre es A',
      ],
      correctIndex: 1,
      explanation:
        'Diferencia A-B = elementos en A no en B. Útil para cohorts de cobertura.',
    },
    {
      concept: 'nested-traversal',
      question:
        'Modelo cliente→contactos→txs como list[dict] anidados. ¿Cómo recorres todos los montos de un cliente?',
      options: [
        'Solo client["monto"] en la raíz',
        'for c in contactos: for t in c.get("txs", []): usar t["monto"] (recorrido anidado seguro)',
        'zip(client, contactos, txs) obligatorio',
        'json.loads una sola vez elimina la necesidad de bucles',
      ],
      correctIndex: 1,
      explanation:
        'Estructuras anidadas se recorren nivel a nivel; get con default evita fallar si falta la lista.',
    },
    {
      concept: 'nested-traversal',
      question:
        '¿Por qué el curso modela list[dict] anidado antes de CSV/JSON en S08?',
      options: [
        'Porque pandas es obligatorio en S06',
        'El modelo en memoria es el contrato que luego serializas; shape claro evita bugs de ingesta',
        'Porque set no puede anidarse nunca',
        'Porque NumPy broadcasting reemplaza dicts',
      ],
      correctIndex: 1,
      explanation:
        'CP-N1-B parte del modelo tabular en RAM; S08 conecta ese shape a archivos.',
    },
    {
      concept: 'nested-traversal',
      question:
        'Si un cliente no tiene contactos, ¿qué default evita TypeError al iterar?',
      options: [
        'for c in client["contactos"] sin chequear (siempre hay lista)',
        'for c in client.get("contactos") or []',
        'for c in None',
        'contactos debe ser un int',
      ],
      correctIndex: 1,
      explanation:
        'get(...) or [] (o default []) da iterable vacío. Iterar None lanza TypeError.',
    },
    {
      concept: 'safe-access-missing',
      question:
        'En intake, ¿en qué se diferencia un campo missing (ausente) de un valor vacío ""?',
      options: [
        'Son idénticos para el dashboard',
        'Missing = clave no presente / None según contrato; vacío = presente pero sin contenido — se tratan distinto en cuarentena',
        'Vacío siempre es error de sintaxis',
        'Missing solo existe en SQL',
      ],
      correctIndex: 1,
      explanation:
        'Falsy ≠ missing. "" y 0 son valores; ausencia de clave es otro caso de calidad.',
    },
    {
      concept: 'safe-access-missing',
      question:
        '¿Cuál patrón “dig” seguro evita KeyError/TypeError en reg["a"]["b"] si a puede faltar?',
      options: [
        'reg["a"]["b"] siempre',
        'Paso a paso: nivel = reg.get(\'a\'); luego nivel.get(\'b\') si nivel es dict',
        'reg.a.b como en JS',
        'eval("reg.a.b")',
      ],
      correctIndex: 1,
      explanation:
        'Acceso por niveles con get y chequeo de tipo. Encadenar [] explota en el primer miss.',
    },
    {
      concept: 'safe-access-missing',
      question:
        'Un monto viene como None en el dict. ¿Qué NO debes hacer en el contador de aceptados?',
      options: [
        'Marcar review/reject según política',
        'Hacer total += monto asumiendo que None es 0 sin documentar',
        'Separar missing de 0 legítimo',
        'Registrar el caso en evidencia',
      ],
      correctIndex: 1,
      explanation:
        'None no es 0. Sumar sin política corrompe tasas y oculta datos faltantes.',
    },
    {
      concept: 'sort-key',
      question:
        '¿Cómo ordenas filas de clientes por región y luego por id de forma estable en Python?',
      options: [
        'filas.sort() sin key siempre usa región',
        'sorted(filas, key=lambda r: (r[\'region\'], r[\'id\']))',
        'filas.order_by("region") nativo en list',
        'set(filas) ordena alfabéticamente',
      ],
      correctIndex: 1,
      explanation:
        'sorted(..., key=) con tupla define criterios sucesivos. sort de list muta; sorted devuelve nueva.',
    },
    {
      concept: 'sort-key',
      question:
        '¿Por qué el export determinista del modelo en memoria ordena antes de JSON?',
      options: [
        'JSON reordena keys al azar siempre',
        'Mismo input → mismo orden de salida para diffs y hashes estables en el gate',
        'sorted borra duplicados',
        'Solo sirve para UI',
      ],
      correctIndex: 1,
      explanation:
        'Orden estable hace salidas reproducibles para CP-N1-B y comparación de manifests.',
    },
    {
      concept: 'sort-key',
      question:
        'sorted es estable. Si dos filas tienen la misma key de región, ¿qué se preserva?',
      options: [
        'Orden aleatorio garantizado',
        'El orden relativo original entre esas filas',
        'Se convierten en set',
        'Se eliminan ambas',
      ],
      correctIndex: 1,
      explanation:
        'Estabilidad: empates conservan orden previo. Útil al ordenar por criterios en cascada.',
    },
    {
      concept: 'structure-choice-determinism',
      question:
        '¿Qué estructura eliges para “conjunto de ids ya vistos” vs “lista ordenada de eventos”?',
      options: [
        'set para eventos ordenados; list para membership',
        'set (o dict) para membership de ids; list para secuencia ordenada de eventos',
        'tuple mutable para ambos',
        'Solo str concatenado',
      ],
      correctIndex: 1,
      explanation:
        'Elige por operación dominante: lookup → set/dict; orden/historial → list.',
    },
    {
      concept: 'structure-choice-determinism',
      question:
        'Al serializar el modelo a JSON para el gate, ¿qué práctica favorece determinismo?',
      options: [
        'Dejar orden de dicts al azar del hash seed',
        'Ordenar listas por clave de negocio y usar keys estables; evitar timestamps no controlados en el payload canónico',
        'Insertar uuid en cada fila siempre sin seed',
        'Usar set como tipo JSON nativo',
      ],
      correctIndex: 1,
      explanation:
        'JSON no tiene set; ordena y fija schema. Timestamps no canónicos rompen igualdad byte a byte.',
    },
    {
      concept: 'structure-choice-determinism',
      question:
        'En S06 V3, ¿cuál es el target pedagógico correcto (id plataforma numpy conservado)?',
      options: [
        'Broadcasting y axis de NumPy arrays',
        'Colecciones en memoria (list/dict/set anidados) para modelo tabular CP-N1-B',
        'groupby de pandas',
        'Web scraping con BeautifulSoup',
      ],
      correctIndex: 1,
      explanation:
        'V3 retarget: colecciones, no NumPy. NumPy se retoma en tramo DS posterior.',
    },
  ],
  // S08 V3 — Archivos, CSV, JSON y contratos de ingesta (platform id: pandas)
  pandas: [
    {
      concept: 'pathlib-with-modes',
      question:
        '¿Por qué el curso exige encoding="utf-8" al leer/escribir texto de intake?',
      options: [
        'UTF-8 es opcional en Windows y da igual',
        'El default del locale (p. ej. Windows) puede no ser UTF-8; utf-8 explícito evita corrupción de tildes/ñ',
        'pathlib no soporta otros encodings',
        'Solo para archivos binarios',
      ],
      correctIndex: 1,
      explanation:
        'Nunca confíes en el locale para intake latam. Declara utf-8.',
    },
    {
      concept: 'pathlib-with-modes',
      question:
        'Modo de apertura: ¿qué hace "w" vs "x" al crear un archivo de salida?',
      options: [
        'w y x son idénticos',
        'w trunca si existe; x falla si el path ya existe (creación exclusiva)',
        'x borra el directorio',
        'w solo append',
      ],
      correctIndex: 1,
      explanation:
        'x evita sobrescribir accidentalmente. w pisa contenido previo.',
    },
    {
      concept: 'pathlib-with-modes',
      question:
        'Ventaja de pathlib.Path frente a concatenar strings de rutas a mano:',
      options: [
        'Es más lento siempre',
        'API unificada (/, exists, read_text) y menos errores de separadores entre OS',
        'Solo funciona en Linux',
        'Prohíbe encoding utf-8',
      ],
      correctIndex: 1,
      explanation:
        'Path(/) une de forma portable. Ideal para data/ y out/ del gate.',
    },
    {
      concept: 'newlines-atomic-write',
      question:
        'Al usar el módulo csv, ¿por qué abrir el archivo con newline=""?',
      options: [
        'Para borrar todas las newlines',
        'Para que el módulo csv controle terminadores y no se dupliquen retornos en Windows',
        'Es obligatorio solo con JSON',
        'Desactiva utf-8',
      ],
      correctIndex: 1,
      explanation:
        'Documentación csv: newline="" evita traducción incorrecta de fines de línea.',
    },
    {
      concept: 'newlines-atomic-write',
      question:
        'Escritura atómica del curso: escribe a temp y luego…',
      options: [
        'os.remove del destino sin reemplazar',
        'os.replace(tmp, dest) en el mismo directorio para swap atómico',
        'print del contenido',
        'zip del archivo',
      ],
      correctIndex: 1,
      explanation:
        'replace es atómico en el mismo filesystem. Evita destino truncado si el proceso muere.',
    },
    {
      concept: 'newlines-atomic-write',
      question:
        'Si el proceso muere a mitad de write_text directo sobre dest, ¿qué riesgo hay?',
      options: [
        'Ninguno; POSIX garantiza archivo completo',
        'dest puede quedar truncado/corrupto; por eso temp+replace',
        'Solo afecta a JSONL',
        'pathlib revierte solo',
      ],
      correctIndex: 1,
      explanation:
        'Escritura no atómica deja basura. Patrón atomic_write del curso mitiga el riesgo.',
    },
    {
      concept: 'csv-dialects-headers',
      question:
        'En csv.DictReader, ¿de dónde salen las claves del dict por fila?',
      options: [
        'Siempre de un schema SQL',
        'De la fila de headers (o fieldnames provisto)',
        'De los índices numéricos 0..n únicamente',
        'De pathlib',
      ],
      correctIndex: 1,
      explanation:
        'Headers definen el contrato columnar. Sin header, debes proveer fieldnames.',
    },
    {
      concept: 'csv-dialects-headers',
      question:
        'Cast de tipos en CSV stdlib: los valores llegan como…',
      options: [
        'int/float automáticos siempre',
        'str (o None según dialecto); el cast es responsabilidad del pipeline',
        'decimal.Decimal por defecto',
        'bytes utf-16',
      ],
      correctIndex: 1,
      explanation:
        'csv no tipa. int()/políticas de null se aplican en el normalizador.',
    },
    {
      concept: 'csv-dialects-headers',
      question:
        'Dialectos (delimitador ; vs ,): ¿qué práctica alinea con ingesta robusta?',
      options: [
        'Asumir siempre coma y fallar en silencio',
        'Detectar/configurar delimiter y quotechar; documentar en provenance',
        'Convertir CSV a imagen',
        'Usar solo split(",") casero sin quotes',
      ],
      correctIndex: 1,
      explanation:
        'split casero rompe con comillas. csv module + dialecto documentado.',
    },
    {
      concept: 'irregular-rows-quarantine',
      question:
        'Fila CSV con número de columnas distinto al header: ¿qué hace el pipeline CP-N1-B?',
      options: [
        'Rellenar con inventados y accept',
        'Enviar a cuarentena con motivo (p. ej. bad_column_count) sin tumbar todo el lote',
        'Borrar el header',
        'Convertir a JSON automáticamente',
      ],
      correctIndex: 1,
      explanation:
        'Cuarentena con motivo preserva el resto del lote y deja evidencia.',
    },
    {
      concept: 'irregular-rows-quarantine',
      question:
        '¿Qué debe incluir un registro de cuarentena mínimo?',
      options: [
        'Solo el score de matching',
        'Fila/raw (o referencia), motivo de rechazo y correlación al input',
        'El password de la base',
        'Nada; se descarta el raw',
      ],
      correctIndex: 1,
      explanation:
        'Sin motivo y raw, no hay debug ni reconciliación de conteos.',
    },
    {
      concept: 'irregular-rows-quarantine',
      question:
        'Reconciliación del gate: si in=100, ¿qué relación deben cumplir clean y quarantine?',
      options: [
        'clean + quarantine <= in siempre puede sobrar sin explicación',
        'clean + quarantine == in (toda fila clasificada; sin “agujeros”)',
        'quarantine debe ser 0 siempre',
        'clean puede superar in si hay dedup mágico',
      ],
      correctIndex: 1,
      explanation:
        'Manifest: in = clean + quarantine. Toda fila cuenta.',
    },
    {
      concept: 'json-serialize',
      question:
        'Diferencia práctica JSON array vs JSONL para transacciones:',
      options: [
        'No hay diferencia',
        'Array = un documento lista; JSONL = un objeto JSON por línea (streaming/append amigable)',
        'JSONL requiere pandas',
        'Array no puede tener objetos',
      ],
      correctIndex: 1,
      explanation:
        'JSONL brilla en logs/streams. Array es un único parse de lista.',
    },
    {
      concept: 'json-serialize',
      question:
        'json.dumps de un dict con un set o datetime sin default:',
      options: [
        'Siempre funciona en silencio',
        'TypeError (o hay que default/convertir); set no es tipo JSON nativo',
        'Convierte set a list solo si está vacío',
        'Usa pickle automáticamente',
      ],
      correctIndex: 1,
      explanation:
        'Serializa tipos JSON-nativos o provee default. Sets → list ordenada si necesitas.',
    },
    {
      concept: 'json-serialize',
      question:
        'Para export determinista, ¿qué haces con ensure_ascii y orden?',
      options: [
        'ensure_ascii=True siempre es la única opción legible con tildes',
        'ensure_ascii=False para utf-8 legible; ordenar listas/keys de negocio antes de dump',
        'indent=None prohíbe utf-8',
        'sort_keys solo funciona en JSONL',
      ],
      correctIndex: 1,
      explanation:
        'utf-8 legible + orden canónico = diffs limpios. sort_keys ayuda en objetos.',
    },
    {
      concept: 'schema-nulls-evolution',
      question:
        'Schema mínimo en ingesta JSON de clientes: ¿qué validas?',
      options: [
        'Todas las keys del RFC de la industria',
        'Campos requeridos presentes, tipos básicos y nulls según contrato (defaults documentados)',
        'Solo que el archivo pese menos de 1MB',
        'Que no haya tildes',
      ],
      correctIndex: 1,
      explanation:
        'Contrato mínimo > validación maximalista. Nulls y defaults van documentados.',
    },
    {
      concept: 'schema-nulls-evolution',
      question:
        'Evolución compatible: llega un campo nuevo opcional en el JSON. ¿Qué hace un lector tolerante?',
      options: [
        'Rechazar todo el archivo',
        'Ignorar keys desconocidas o guardarlas en extras según política; no romper si no son required',
        'Borrar el schema',
        'Convertir el archivo a CSV a la fuerza',
      ],
      correctIndex: 1,
      explanation:
        'Forward-compatible: unknown optional ≠ hard fail. Required missing sí es quarantine.',
    },
    {
      concept: 'schema-nulls-evolution',
      question:
        'Null vs omitido en JSON de intake:',
      options: [
        'idénticos siempre para cualquier parser',
        'Pueden diferir: null explícito vs clave ausente — el contrato debe decir cómo tratarlos',
        'omitido lanza SyntaxError',
        'null borra el archivo',
      ],
      correctIndex: 1,
      explanation:
        'Contrato define si null y missing son equivalentes. No asumas.',
    },
    {
      concept: 'backups-hashes-provenance',
      question:
        '¿Para qué calcula el pipeline un hash (p. ej. sha256) del input CSV?',
      options: [
        'Para comprimir el archivo',
        'Integridad y provenance: saber qué bytes se procesaron y detectar cambios entre corridas',
        'Para cifrar PII real del curso',
        'Es requisito de matplotlib',
      ],
      correctIndex: 1,
      explanation:
        'Hash en manifest amarra la corrida a un input exacto. Backup conserva copia.',
    },
    {
      concept: 'backups-hashes-provenance',
      question:
        'Provenance mínima de una corrida de ingesta incluye:',
      options: [
        'Solo el wall-clock del laptop',
        'Rutas de input, hashes, timestamp de corrida, versión de reglas/código si está disponible',
        'El contenido completo de node_modules',
        'Nada si clean>0',
      ],
      correctIndex: 1,
      explanation:
        'Reproducibilidad: qué se leyó, con qué reglas, cuándo.',
    },
    {
      concept: 'backups-hashes-provenance',
      question:
        'Backup del input antes de transformar: ¿por qué copiar y no solo mover?',
      options: [
        'Mover es ilegal en pathlib',
        'Preservas el original intacto si la transformación falla o se reprocesa',
        'copy calcula groupby',
        'No hay diferencia operativa',
      ],
      correctIndex: 1,
      explanation:
        'Backup inmutable del input. El working set puede reescribirse con atomic_write.',
    },
    {
      concept: 'reconciliation-manifest',
      question:
        'Un manifest de corrida CP-N1-B debe permitir verificar:',
      options: [
        'Solo el color del log',
        'Conteos in/clean/quarantine reconciliados y referencias a salidas/hashes',
        'El salary promedio con pandas',
        'Que no hubo tildes en paths',
      ],
      correctIndex: 1,
      explanation:
        'Manifest = contrato de la corrida. Conteos + paths + hashes.',
    },
    {
      concept: 'reconciliation-manifest',
      question:
        'Si in=50, clean=40, quarantine=9, ¿qué problema hay?',
      options: [
        'Ninguno; 1 fila puede evaporarse',
        'Falta 1 fila: no reconcilia (40+9≠50) — bug de conteo o pérdida',
        'quarantine debe ser > clean',
        'in se redefine como clean',
      ],
      correctIndex: 1,
      explanation:
        'Toda fila cuenta. Descuadre = defecto del pipeline o del contador.',
    },
    {
      concept: 'reconciliation-manifest',
      question:
        'En S08 V3 (id plataforma pandas), el target del gate es:',
      options: [
        'df.groupby EDA como path principal',
        'ETL stdlib CSV/JSON con cuarentena, hashes y manifest (cierre CP-N1-B)',
        'NumPy broadcasting',
        'Scraping de SUNAT en vivo con PII real',
      ],
      correctIndex: 1,
      explanation:
        'pandas EDA se difiere a L2. Aquí: archivos, contratos e integridad.',
    },
  ],
  visualization: [
    {
      concept: 'exception-types-raise-chaining',
      question: 'En un parser de montos de intake, el valor llega como texto no numérico. ¿Qué excepción es la más específica y correcta a lanzar?',
      options: [
        'Exception genérica sin mensaje',
        'ValueError (o subtipo de dominio) con mensaje accionable sobre el campo/valor',
        'SystemExit para abortar el intérprete',
        'KeyboardInterrupt simulando cancelación',
      ],
      correctIndex: 1,
      explanation: 'ValueError comunica entrada inválida. Evita bare Exception y señales de control de proceso.',
    },
    {
      concept: 'exception-types-raise-chaining',
      question: 'Al re-lanzar un fallo de I/O como DataLoadError de dominio, ¿cuál es la forma correcta de preservar la causa?',
      options: [
        'raise DataLoadError("fallo") sin causa',
        'raise DataLoadError("no se pudo leer lote") from e',
        'print(e); raise DataLoadError()',
        'sys.exit(1) ocultando e',
      ],
      correctIndex: 1,
      explanation: 'raise ... from e encadena __cause__ y facilita el traceback de diagnóstico.',
    },
    {
      concept: 'exception-types-raise-chaining',
      question: '¿Cuándo conviene definir una excepción custom ligera (p. ej. ValidationError) en el pipeline de familiaridad?',
      options: [
        'Siempre en vez de ValueError/KeyError del stdlib',
        'Cuando capas superiores deben distinguir fallos de validación de I/O/config con tipos estables',
        'Solo para silenciar el traceback',
        'Nunca; las custom están prohibidas',
      ],
      correctIndex: 1,
      explanation: 'Custom ligera = frontera de dominio. No reemplace todos los tipos stdlib sin necesidad.',
    },
    {
      concept: 'recovery-boundaries-cleanup',
      question: '¿Cuál es el rol de finally (o with) al leer un lote de archivos?',
      options: [
        'Ignorar cualquier error y devolver None',
        'Garantizar cleanup del recurso aunque falle el try; re-raise si el error no es recuperable',
        'Convertir todos los errores en warnings',
        'Ejecutarse solo si no hubo excepción',
      ],
      correctIndex: 1,
      explanation: 'finally/with aseguran cierre. No tragues bare except; propaga fatales.',
    },
    {
      concept: 'recovery-boundaries-cleanup',
      question: '¿Qué práctica es incorrecta en fronteras de recuperación?',
      options: [
        'except OSError como recuperable de I/O y reintentar con política',
        'except: pass para que no truene el batch',
        'with open(...) as f: para cleanup automático',
        'Re-raise de config inválida sin procesar filas',
      ],
      correctIndex: 1,
      explanation: 'Bare except + swallow oculta bugs y rompe observabilidad.',
    },
    {
      concept: 'recovery-boundaries-cleanup',
      question: 'Config del pipeline inválida (API key ausente). ¿Dónde debe fallar preferentemente?',
      options: [
        'En el finally de cada fila, silencioso',
        'En la frontera de arranque/validación, fail-fast antes de procesar el lote',
        'Solo en el dashboard al final',
        'Nunca; usar defaults inventados',
      ],
      correctIndex: 1,
      explanation: 'Errores de config son fatales de sesión: no proceses con secretos/paths rotos.',
    },
    {
      concept: 'traceback-debugger',
      question: 'Al leer un traceback, ¿qué frame suele ser el más útil para el bug de tu código de aplicación?',
      options: [
        'El frame más profundo de site-packages de terceros sin tu módulo',
        'El frame de tu módulo de aplicación donde ocurre la llamada incorrecta',
        'Solo la última línea de CPython interno',
        'El mensaje sin mirar archivos ni líneas',
      ],
      correctIndex: 1,
      explanation: 'Prioriza frames de tu paquete; librerías a menudo solo re-lanzan.',
    },
    {
      concept: 'traceback-debugger',
      question: '¿Qué hace un debugger (pdb/breakpoint) que un print suelto no garantiza bien?',
      options: [
        'Compila el código a más rápido',
        'Pausa la ejecución e inspecciona variables/estado en el frame exacto',
        'Borra PII automáticamente',
        'Reemplaza unit tests',
      ],
      correctIndex: 1,
      explanation: 'breakpoint() permite inspección interactiva del estado real.',
    },
    {
      concept: 'traceback-debugger',
      question: 'KeyError en un dict de fila normalizada. Primera acción de diagnóstico efectiva:',
      options: [
        'Reinstalar Python',
        'Identificar key faltante, frame y forma real del dict (keys presentes)',
        'Capturar Exception y devolver {}',
        'Ignorar la fila sin log',
      ],
      correctIndex: 1,
      explanation: 'Sin conocer key y shape del payload, el fix es a ciegas.',
    },
    {
      concept: 'minimal-repro-hypothesis-rootcause',
      question: '¿Qué es una reproducción mínima (minimal repro) en debugging de pipeline?',
      options: [
        'Volver a correr todo el dataset de producción',
        'El menor input/código que aún dispara el fallo de forma determinista',
        'Un print aleatorio en main',
        'Borrar el traceback',
      ],
      correctIndex: 1,
      explanation: 'Minimal repro aísla la causa y permite hipótesis falsables.',
    },
    {
      concept: 'minimal-repro-hypothesis-rootcause',
      question: 'Una buena hipótesis de causa raíz debe ser:',
      options: [
        'Vaga ("a veces falla") e irrefutable',
        'Específica, falsable con un experimento/repro, y documentable',
        'Culpar siempre a la red',
        'Cambiar 10 cosas a la vez',
      ],
      correctIndex: 1,
      explanation: 'Hipótesis falsable + un cambio controlado = root cause real.',
    },
    {
      concept: 'minimal-repro-hypothesis-rootcause',
      question: 'Tras confirmar causa raíz de normalización de apellidos, el artefacto mínimo esperado es:',
      options: [
        'Solo un emoji en el chat',
        'Nota breve: repro, causa, fix y cómo evitar regresión (test o check)',
        'Reescribir todo el monorepo',
        'Desactivar logging',
      ],
      correctIndex: 1,
      explanation: 'Documentar repro/causa/fix cierra el ciclo y alimenta tests.',
    },
    {
      concept: 'log-levels-structure',
      question: '¿Qué nivel es apropiado para un fallo recuperable de una fila con cuarentena?',
      options: [
        'DEBUG de cada variable local sin estructura',
        'WARNING o ERROR de fila con campos estables (row_id, code), no CRITICAL de proceso si el lote sigue',
        'print() a stdout mezclado con resultados JSON',
        'FATAL siempre y sys.exit',
      ],
      correctIndex: 1,
      explanation: 'Niveles comunican severidad operativa; estructura permite filtrar.',
    },
    {
      concept: 'log-levels-structure',
      question: 'Logging estructurado en el curso implica preferir:',
      options: [
        'Prosa libre distinta en cada mensaje',
        'Campos estables (event, stage, correlation_id, counts) aptos para grep/métricas',
        'Logs solo en archivos binarios sin texto',
        'Un único string concatenando secretos',
      ],
      correctIndex: 1,
      explanation: 'Campos estables = operación y auditoría del pipeline.',
    },
    {
      concept: 'log-levels-structure',
      question: 'INFO vs DEBUG en ingest de lotes:',
      options: [
        'INFO para cada byte leído; DEBUG solo al final',
        'INFO hitos de lote (inicio/fin/conteos); DEBUG detalle fino de diagnóstico local',
        'Nunca uses INFO',
        'DEBUG va a stderr y es para usuarios finales',
      ],
      correctIndex: 1,
      explanation: 'INFO narra la corrida; DEBUG es volumen alto de diagnóstico.',
    },
    {
      concept: 'correlation-ids-pii-redaction',
      question: '¿Para qué sirve propagar correlation_id en logs del pipeline?',
      options: [
        'Cifrar el disco',
        'Unir eventos de la misma corrida/request a través de etapas',
        'Reemplazar el traceback',
        'Autenticar usuarios en la UI',
      ],
      correctIndex: 1,
      explanation: 'correlation_id amarra la historia de una corrida entre módulos.',
    },
    {
      concept: 'correlation-ids-pii-redaction',
      question: 'Email, teléfono o dirección completa en logs de error:',
      options: [
        'Se loguean en claro "para debug más fácil"',
        'Se redactan/enmascaran; no se escriben PII completos en logs',
        'Solo el email se permite en claro',
        'Se suben a un gist público',
      ],
      correctIndex: 1,
      explanation: 'PII completa en logs es incidente de privacidad. Redacta.',
    },
    {
      concept: 'correlation-ids-pii-redaction',
      question: 'Un mensaje de error incluye documento de identidad. ¿Qué haces en logging producción-like?',
      options: [
        'Log del valor completo',
        'Token/hash truncado o campo redacted=true sin valor crudo',
        'Enviar el log por WhatsApp',
        'Desactivar el logger',
      ],
      correctIndex: 1,
      explanation: 'Evidencia sin PII: identificadores opacos o enmascarados.',
    },
    {
      concept: 'failfast-vs-continue',
      question: 'Fila con schema inválido en un batch de 10k. Política típica del curso:',
      options: [
        'Abortar todo el proceso sin cuarentena ni conteos',
        'Cuarentenar la fila, continuar el lote y reportar conteos de éxito/error',
        'Silenciar y marcar éxito 100%',
        'Reintentar 100 veces el mismo schema roto',
      ],
      correctIndex: 1,
      explanation: 'Errores de dato de fila → continue-with-quarantine; no finjas éxito.',
    },
    {
      concept: 'failfast-vs-continue',
      question: '¿Cuándo es correcto fail-fast en el pipeline de familiaridad?',
      options: [
        'En cualquier warning de estilo',
        'Config/credenciales/paths críticos inválidos o invariantes de sesión rotos',
        'Siempre al primer WARNING de fila',
        'Nunca; siempre continuar',
      ],
      correctIndex: 1,
      explanation: 'Fatales de sesión vs errores de fila: dos políticas distintas.',
    },
    {
      concept: 'failfast-vs-continue',
      question: 'Éxito parcial de un lote significa:',
      options: [
        'Mentir el exit code 0 sin métricas',
        'Algunas filas OK, otras en cuarentena; manifiesto/conteos reflejan ambos',
        'Borrar las fallidas del disco',
        'Ignorar el manifiesto',
      ],
      correctIndex: 1,
      explanation: 'Éxito parcial es observable y auditable, no opaco.',
    },
    {
      concept: 'idempotency-retries-quarantine',
      question: '¿Qué errores son candidatos a retry con backoff?',
      options: [
        'ValueError de schema de fila',
        'Errores transitorios de red/5xx/timeout de proveedor, con tope e idempotencia',
        'SyntaxError de tu código',
        'KeyError de columna faltante permanente',
      ],
      correctIndex: 1,
      explanation: 'Retry solo transitorios; schema/bugs no se curan con reintentos.',
    },
    {
      concept: 'idempotency-retries-quarantine',
      question: 'Una operación de escritura a cuarentena debe ser preferentemente:',
      options: [
        'No determinista y con side-effects duplicados sin clave',
        'Idempotente: re-ejecutar no duplica basura ni corrompe estado',
        'Sin path de destino fijo',
        'Solo en memoria RAM sin disco',
      ],
      correctIndex: 1,
      explanation: 'Idempotencia evita duplicados al reintentar jobs.',
    },
    {
      concept: 'idempotency-retries-quarantine',
      question: 'Tras agotar retries de un proveedor, la acción correcta es:',
      options: [
        'Loop infinito',
        'Enviar a cuarentena/dead-letter con motivo y fallar la unidad según política',
        'Inventar datos del proveedor',
        'Bajar el log level a DEBUG y fingir OK',
      ],
      correctIndex: 1,
      explanation: 'Irrecuperable → cuarentena + señal clara; no datos inventados.',
    },
  ],
  sklearn: [
    {
      concept: 'imports-namespaces-main',
      question: '¿Por qué el guard if __name__ == "__main__" es importante en un módulo CLI?',
      options: [
        'Acelera los imports en un 10x',
        'Evita ejecutar side-effects de CLI al importar el módulo desde tests u otros paquetes',
        'Es obligatorio en todos los .py sin lógica',
        'Reemplaza pyproject.toml',
      ],
      correctIndex: 1,
      explanation: 'El guard separa API importable de punto de entrada ejecutable.',
    },
    {
      concept: 'imports-namespaces-main',
      question: 'Ejecutar el paquete como python -m familiarity_core ... vs script suelto:',
      options: [
        'Es idéntico y no cambia sys.path',
        'python -m usa el paquete instalado/namespace correcto; reduce imports frágiles por cwd',
        'python -m prohíbe argparse',
        'Solo funciona en Windows',
      ],
      correctIndex: 1,
      explanation: '-m respeta el layout del paquete y el entorno activo.',
    },
    {
      concept: 'imports-namespaces-main',
      question: 'from package import * en API pública del curso:',
      options: [
        'Es la práctica recomendada siempre',
        'Se evita; exporta API explícita (__all__ o imports nominados) y deja _privados fuera',
        'Solo se permite en tests',
        'Borra el namespace',
      ],
      correctIndex: 1,
      explanation: 'API explícita > star imports opacos.',
    },
    {
      concept: 'public-api-dependencies',
      question: 'Dependencia cíclica A↔B en el paquete. Síntoma típico:',
      options: [
        'Semver se incrementa solo',
        'ImportError/atributos a medio inicializar al importar',
        'Mejor performance',
        'Type checkers se desactivan',
      ],
      correctIndex: 1,
      explanation: 'Ciclos rompen inicialización de módulos. Extrae capa compartida o invierte dependencia.',
    },
    {
      concept: 'public-api-dependencies',
      question: '¿Qué debe exponer el __init__ o facade pública de familiarity_core?',
      options: [
        'Todos los _helpers internos y paths de secretos',
        'Símbolos estables de dominio/CLI documentados; internals con prefijo _ fuera de la API',
        'Solo variables globales mutables',
        'Nada; el usuario importa por path de archivo',
      ],
      correctIndex: 1,
      explanation: 'Frontera pública estable vs internals.',
    },
    {
      concept: 'public-api-dependencies',
      question: 'Para romper un ciclo parse ↔ validate, una solución limpia es:',
      options: [
        'Duplicar todo el código en un solo archivo de 5k líneas sin módulos',
        'Extraer tipos/contratos compartidos a un módulo base o usar inyección en la frontera',
        'Usar import * en ambos',
        'Renombrar archivos sin cambiar dependencias',
      ],
      correctIndex: 1,
      explanation: 'Contratos compartidos o inversión de dependencia eliminan el ciclo.',
    },
    {
      concept: 'src-layout-pyproject',
      question: 'Ventaja del layout src/ para familiarity_core:',
      options: [
        'Permite importar el árbol a medias desde tests sin instalar y enmascara bugs de packaging',
        'Fuerza instalación del paquete (editable) y evita importar por accidente el cwd incorrecto',
        'Elimina la necesidad de tests',
        'Solo sirve para C extensions',
      ],
      correctIndex: 1,
      explanation: 'src/ layout + install editable = imports reales de paquete.',
    },
    {
      concept: 'src-layout-pyproject',
      question: 'pyproject.toml en este nivel del curso se usa principalmente para:',
      options: [
        'Guardar contraseñas de API',
        'Metadatos del proyecto, dependencias y configuración de build/herramientas',
        'Reemplazar el código Python',
        'Definir el esquema SQL',
      ],
      correctIndex: 1,
      explanation: 'pyproject es el manifiesto moderno de packaging/tooling.',
    },
    {
      concept: 'src-layout-pyproject',
      question: 'Preferencia del curso sobre dependencias en CLI de ingest/normalize:',
      options: [
        'Instalar todo PyPI por si acaso',
        'stdlib first; dependencias externas solo con justificación y pin/rango consciente',
        'Vendorear wheels a mano en git LFS siempre',
        'Prohibir cualquier dependencia',
      ],
      correctIndex: 1,
      explanation: 'Menos superficie = menos roturas; justifica cada dep.',
    },
    {
      concept: 'versioning-compatibility',
      question: 'SemVer: cambias un flag CLI de forma incompatible. ¿Qué bump?',
      options: [
        'patch (0.0.x) solamente',
        'major (o política explícita de breaking) porque rompe callers',
        'Dejar la misma versión',
        'Borrar el tag',
      ],
      correctIndex: 1,
      explanation: 'Breaking change → major (según política del paquete).',
    },
    {
      concept: 'versioning-compatibility',
      question: 'Añades un subcomando opcional sin romper los existentes. Bump típico:',
      options: [
        'major obligatorio',
        'minor (nueva funcionalidad compatible)',
        'Nunca versionar CLIs',
        'reset a 0.0.1 siempre',
      ],
      correctIndex: 1,
      explanation: 'Feature compatible → minor.',
    },
    {
      concept: 'versioning-compatibility',
      question: 'Compatibilidad hacia S11 (dominio) implica:',
      options: [
        'Cambiar nombres de símbolos públicos cada commit sin changelog',
        'Mantener contratos de datos/API estables o versionarlos con migración documentada',
        'Ignorar tests de import',
        'Mezclar secretos en el version string',
      ],
      correctIndex: 1,
      explanation: 'Contratos estables habilitan capas OOP posteriores.',
    },
    {
      concept: 'argparse-subcommands-exitcodes',
      question: 'Diseño de CLI con subcomandos ingest/normalize/compare/report: ¿herramienta stdlib?',
      options: [
        'flask run',
        'argparse (subparsers) con ayuda y exit codes claros',
        'eval de strings de shell sin parser',
        'input() interactivo obligatorio en CI',
      ],
      correctIndex: 1,
      explanation: 'argparse subparsers = UX y testabilidad.',
    },
    {
      concept: 'argparse-subcommands-exitcodes',
      question: 'Exit code 0 vs distinto de 0 en CLI de lote:',
      options: [
        '0 siempre, aunque falle todo',
        '0 éxito (según política); distinto de 0 = error fatal de sesión o política de fallo',
        '0 solo en Windows',
        'Exit codes no se usan en Python',
      ],
      correctIndex: 1,
      explanation: 'Exit codes son el contrato con CI/orquestadores.',
    },
    {
      concept: 'argparse-subcommands-exitcodes',
      question: 'Ayuda humana (-h/--help) en subcomandos debe:',
      options: [
        'Estar vacía para descubrir por prueba',
        'Documentar flags, defaults y ejemplos mínimos por subcomando',
        'Imprimir el source completo del módulo',
        'Pedir contraseña',
      ],
      correctIndex: 1,
      explanation: 'Help es parte del producto CLI.',
    },
    {
      concept: 'stdio-streams-help',
      question: 'Resultado JSON del comando report debe ir preferentemente a:',
      options: [
        'stderr mezclado con logs DEBUG',
        'stdout limpio; logs y diagnósticos a stderr',
        'el clipboard del OS siempre',
        'un socket UDP sin documentar',
      ],
      correctIndex: 1,
      explanation: 'Separar stdout (datos) y stderr (logs) permite pipes fiables.',
    },
    {
      concept: 'stdio-streams-help',
      question: 'Contaminar stdout con prints de debug cuando CI parsea JSON implica:',
      options: [
        'Nada; JSON parsers ignoran texto',
        'Romper el contrato de pipe/parseo del consumidor',
        'Mejorar la seguridad',
        'Activar colores automáticamente',
      ],
      correctIndex: 1,
      explanation: 'stdout es el payload; no lo ensucies.',
    },
    {
      concept: 'stdio-streams-help',
      question: 'Leer input masivo por stdin en un subcomando es útil cuando:',
      options: [
        'Quieres forzar GUI',
        'Encadenas pipes (prod | normalize) sin archivos intermedios obligatorios',
        'stdin no existe en Unix',
        'Solo hay archivos .xlsx',
      ],
      correctIndex: 1,
      explanation: 'stdio habilita composición Unix.',
    },
    {
      concept: 'config-precedence',
      question: 'Orden de precedencia típico flags > env > archivo de config significa:',
      options: [
        'El archivo siempre gana sobre flags',
        'Un flag CLI overridea env y archivo; env overridea defaults de archivo',
        'Solo env importa',
        'No hay defaults',
      ],
      correctIndex: 1,
      explanation: 'Precedencia explícita evita sorpresas operativas.',
    },
    {
      concept: 'config-precedence',
      question: 'None vs missing en merge de config:',
      options: [
        'Son idénticos siempre',
        'Missing deja el valor previo/default; None puede significar limpiar/desactivar según contrato',
        'None borra el pyproject',
        'Missing lanza SystemExit siempre',
      ],
      correctIndex: 1,
      explanation: 'Define semántica de null vs ausente en el merge.',
    },
    {
      concept: 'config-precedence',
      question: 'log_level viene en archivo (INFO) y flag --log-level DEBUG. Resultado esperado:',
      options: [
        'INFO porque el archivo se leyó primero',
        'DEBUG por precedencia de flags',
        'Ambos a la vez en un set',
        'Se ignora el logging',
      ],
      correctIndex: 1,
      explanation: 'Flags ganan en el esquema del curso.',
    },
    {
      concept: 'secrets-defaults-early-validation',
      question: '¿Dónde NO deben vivir secretos (API tokens)?',
      options: [
        'En el gestor de secretos / env del runtime',
        'Hardcodeados en el repo o en logs de ayuda',
        'En un vault inyectado al proceso',
        'En variables de entorno no commiteadas',
      ],
      correctIndex: 1,
      explanation: 'Secretos fuera del código y del VCS.',
    },
    {
      concept: 'secrets-defaults-early-validation',
      question: 'Validación temprana de config al arrancar el CLI debe:',
      options: [
        'Posponerse hasta la fila 9999',
        'Fallar con mensaje accionable si faltan paths/secretos/requeridos antes de side-effects pesados',
        'Inventar defaults inseguros silenciosos para tokens',
        'Solo validar en el dashboard',
      ],
      correctIndex: 1,
      explanation: 'Fail-fast de config evita corridas a medias.',
    },
    {
      concept: 'secrets-defaults-early-validation',
      question: 'Default seguro para un flag de escritura destructiva (--force):',
      options: [
        'True por defecto',
        'False/off por defecto; el usuario opt-in explícito',
        'Random cada run',
        'Leído de un comentario HTML',
      ],
      correctIndex: 1,
      explanation: 'Defaults seguros > conveniencia peligrosa.',
    },
  ],
  testing: [
    {
      concept: 'classes-instances-dataclass',
      question: '¿Por qué usar @dataclass para ClientRecord en el modelo de dominio N1?',
      options: [
        'Para heredar de dict automáticamente',
        'Reduce boilerplate de __init__/repr y deja claro el shape de datos del dominio',
        'Ejecuta SQL solo',
        'Impide validación',
      ],
      correctIndex: 1,
      explanation: 'dataclass modela datos con menos ruido; la validación se añade en __post_init__ o factory.',
    },
    {
      concept: 'classes-instances-dataclass',
      question: 'Instancia vs clase en el dominio:',
      options: [
        'Son lo mismo en runtime',
        'La clase es el molde; la instancia es un cliente/entidad concreta con estado propio',
        'Solo las clases viven en memoria',
        'Las instancias no pueden tener métodos',
      ],
      correctIndex: 1,
      explanation: 'Clase = tipo; instancia = valor/entidad concreta.',
    },
    {
      concept: 'classes-instances-dataclass',
      question: 'Factory from_dict para ClientRecord sintético debe:',
      options: [
        'Aceptar cualquier key sin validar',
        'Mapear campos conocidos y rechazar/normalizar según contrato del dominio',
        'Imprimir el dict y devolver None',
        'Conectarse a internet',
      ],
      correctIndex: 1,
      explanation: 'Factories son frontera de validación del dominio.',
    },
    {
      concept: 'invariants-valid-states',
      question: 'Un invariante de dominio (p. ej. documento no vacío) debe fallar:',
      options: [
        'Solo en el UI semanas después',
        'Al construir/actualizar la entidad, dejando solo estados válidos',
        'Nunca; se loguea y se sigue',
        'Únicamente en SQL triggers obligatorios',
      ],
      correctIndex: 1,
      explanation: 'Invariantes en frontera de construcción = menos basura en el sistema.',
    },
    {
      concept: 'invariants-valid-states',
      question: '¿Qué es un estado inválido de Transaction en el curso?',
      options: [
        'amount numérico con moneda ISO y parties definidos según contrato',
        'amount negativo sin regla de negocio que lo permita, o ids vacíos',
        'Cualquier dataclass frozen',
        'Un test unitario',
      ],
      correctIndex: 1,
      explanation: 'Estados inválidos violan reglas explícitas del dominio.',
    },
    {
      concept: 'invariants-valid-states',
      question: 'Fail on construct significa:',
      options: [
        'Crear el objeto y arreglarlo después con setters silenciosos',
        'Rechazar la creación si los datos violan invariantes (raise)',
        'Usar __del__ para validar',
        'Validar solo en el destructor del proceso',
      ],
      correctIndex: 1,
      explanation: 'Mejor no nacer inválido que corregir después.',
    },
    {
      concept: 'properties-methods',
      question: 'Una @property display_name en ClientRecord es adecuada cuando:',
      options: [
        'Modifica la base de datos externa',
        'Deriva un valor de consulta sin side-effects costosos ocultos',
        'Envía email',
        'Lanza red en cada acceso sin cache documentada',
      ],
      correctIndex: 1,
      explanation: 'Properties = consultas baratas; comandos = métodos explícitos.',
    },
    {
      concept: 'properties-methods',
      question: 'Consulta vs comando en el dominio:',
      options: [
        'No hay diferencia',
        'Consulta no muta (o es seguro); comando cambia estado de forma explícita',
        'Los comandos no pueden fallar',
        'Las consultas deben escribir logs de PII',
      ],
      correctIndex: 1,
      explanation: 'Separa leer de mutar para razonar el modelo.',
    },
    {
      concept: 'properties-methods',
      question: 'Método que recalcula y persiste en disco sin documentarlo, expuesto como property:',
      options: [
        'Es ideal',
        'Es un smell: side-effect oculto en acceso tipo atributo',
        'Obligatorio en dataclasses',
        'Requerido por Protocol',
      ],
      correctIndex: 1,
      explanation: 'Properties con side-effects sorprenden a callers y tests.',
    },
    {
      concept: 'equality-hash-mutability',
      question: 'Para usar entidades en un set de ResolvedEntity, conviene:',
      options: [
        'Mutar los campos que participan en __hash__ después de insertar',
        'Definir igualdad/hash estables (p. ej. frozen) o no hashear mutables',
        'Sobreescribir __hash__ = None y meterlas en set igual',
        'Comparar siempre por id(obj) en negocio',
      ],
      correctIndex: 1,
      explanation: 'Mutar campos hasheados rompe sets/dicts. frozen o ids estables.',
    },
    {
      concept: 'equality-hash-mutability',
      question: 'eq custom entre dos ClientRecord del mismo documento normalizado:',
      options: [
        'Siempre False si no son el mismo objeto',
        'Puede basarse en identidad de negocio (doc normalizado), no en id de memoria',
        'Debe ignorar todos los campos',
        'Solo funciona con herencia múltiple',
      ],
      correctIndex: 1,
      explanation: 'Igualdad de negocio ≠ identidad de objeto.',
    },
    {
      concept: 'equality-hash-mutability',
      question: 'Mutabilidad consciente implica:',
      options: [
        'Todo es list mutable siempre',
        'Decidir qué es inmutable (evidencia sellada) vs editable y documentarlo',
        'Prohibir dataclasses',
        'Usar globals',
      ],
      correctIndex: 1,
      explanation: 'Diseña qué puede cambiar y cuándo.',
    },
    {
      concept: 'composition-over-inheritance',
      question: 'CaseFile que contiene ClientRecord + lista de evidencias es un ejemplo de:',
      options: [
        'Herencia múltiple profunda de ClientRecord',
        'Composición: el case arma partes sin ser un subtipo forzado',
        'Monkeypatch de builtins',
        'ORM automático',
      ],
      correctIndex: 1,
      explanation: 'Composición modela "tiene un" sin jerarquías frágiles.',
    },
    {
      concept: 'composition-over-inheritance',
      question: '¿Por qué el curso prefiere composición antes que herencia para el dominio N1?',
      options: [
        'Porque herencia está deprecada en Python',
        'Reduce acoplamiento y jerarquías rígidas; permite combinar comportamientos con claridad',
        'Porque no existen métodos en composición',
        'Para evitar tests',
      ],
      correctIndex: 1,
      explanation: 'Composición > herencia accidental de god-objects.',
    },
    {
      concept: 'composition-over-inheritance',
      question: 'Un veredicto de fraude hardcodeado en una clase base de entidad:',
      options: [
        'Es el objetivo de N1',
        'Está fuera de alcance: el dominio carga evidencia, no acusa ni decide fraude/parentesco automático',
        'Es obligatorio en ResolvedEntity',
        'Se implementa con herencia triple',
      ],
      correctIndex: 1,
      explanation: 'N1: evidencia y revisión; no veredictos automáticos de fraude.',
    },
    {
      concept: 'protocols-purposeful-polymorphism',
      question: 'Un Protocol Store con método get/put permite:',
      options: [
        'Ejecutar SQL sin implementar nada',
        'Polimorfismo estructural: FakeStore en tests y repo real en prod sin herencia forzada',
        'Eliminar type hints',
        'Serializar PII a logs',
      ],
      correctIndex: 1,
      explanation: 'Protocols = puertos; fakes en tests.',
    },
    {
      concept: 'protocols-purposeful-polymorphism',
      question: 'Polimorfismo con propósito en el dominio significa:',
      options: [
        'Muchas clases vacías por estética',
        'Sustituir implementaciones detrás de un contrato claro (store, clock, id gen)',
        'Usar *args en todo',
        'Heredar de Exception para entidades',
      ],
      correctIndex: 1,
      explanation: 'Sustitución útil bajo contrato, no thrash de tipos.',
    },
    {
      concept: 'protocols-purposeful-polymorphism',
      question: 'FakeStore en tests del dominio:',
      options: [
        'Debe llamar la red real',
        'Implementa el Protocol en memoria para pruebas rápidas y deterministas',
        'Es ilegítimo',
        'Solo funciona con pytest-django',
      ],
      correctIndex: 1,
      explanation: 'Fakes deterministas > flaky integration para unidad de dominio.',
    },
    {
      concept: 'repositories-services-serialization',
      question: 'Separación repositorio vs servicio de dominio:',
      options: [
        'Es lo mismo; un solo god-object',
        'Repositorio persiste/recupera; servicio orquesta reglas de dominio sobre entidades',
        'El servicio solo hace print',
        'El repositorio decide parentesco automático',
      ],
      correctIndex: 1,
      explanation: 'Puertos de persistencia vs lógica de aplicación/dominio.',
    },
    {
      concept: 'repositories-services-serialization',
      question: 'Serializar ClientRecord a dict/JSON en la frontera debe:',
      options: [
        'Incluir secretos de config',
        'Respetar el contrato de campos y no filtrar PII a canales no autorizados',
        'Usar pickle hacia internet',
        'Omitir todos los ids',
      ],
      correctIndex: 1,
      explanation: 'Serialización = contrato + privacidad.',
    },
    {
      concept: 'repositories-services-serialization',
      question: 'ClientService que usa un Store inyectado facilita:',
      options: [
        'Acoplar el servicio a un SQL global hardcodeado sin seams',
        'Tests con FakeStore y cambio de infraestructura sin reescribir reglas',
        'Eliminar invariantes',
        'Logging de contraseñas',
      ],
      correctIndex: 1,
      explanation: 'Inyección de dependencias = testabilidad.',
    },
    {
      concept: 'domain-deps-tests',
      question: 'Pruebas del dominio N1 deben priorizar:',
      options: [
        'Solo screenshots del dashboard',
        'Invariantes, factories, igualdad y servicios con fakes — sin red real',
        'Entrenar un modelo de deep learning',
        'Cargar PII real de clientes',
      ],
      correctIndex: 1,
      explanation: 'Tests de dominio rápidos y sintéticos.',
    },
    {
      concept: 'domain-deps-tests',
      question: 'Dependencia de reloj/uuid en el dominio se maneja mejor:',
      options: [
        'Llamando datetime.now() y uuid4() esparcidos sin seam',
        'Inyectando clock/id generator para tests deterministas',
        'Dormir 10s en cada test',
        'Ignorando el tiempo',
      ],
      correctIndex: 1,
      explanation: 'Seams de tiempo/id = asserts estables.',
    },
    {
      concept: 'domain-deps-tests',
      question: 'Ética de producto en tests de familiaridad:',
      options: [
        'Fijar fixtures que prueban fraude automático como verdad',
        'Usar datos sintéticos y asertar evidencia/scores, no veredictos de culpa',
        'Subir datasets reales a CI públicos',
        'Desactivar asserts de privacidad',
      ],
      correctIndex: 1,
      explanation: 'Tests refuerzan el alcance ético del producto.',
    },
  ],

  // S07 V3 — Texto, Unicode y expresiones regulares (platform id: data-acquisition)
  'data-acquisition': [
    {
      concept: 'unicode-normalization-casefold',
      question:
        '¿Por qué dos strings visualmente iguales con tilde pueden comparar False en Python?',
      options: [
        'Python no soporta tildes',
        'Formas Unicode distintas (NFC compuesta vs NFD base+combining); hay que normalizar antes de comparar',
        'casefold borra la comparación',
        'Son encodings latin-1 incompatibles siempre',
      ],
      correctIndex: 1,
      explanation:
        'NFC/NFD unifican code points. unicodedata.normalize("NFC", s) antes de ==.',
    },
    {
      concept: 'unicode-normalization-casefold',
      question:
        'En el pipeline de matching de nombres, ¿qué hace casefold respecto a lower()?',
      options: [
        'Es idéntico en todos los idiomas',
        'casefold es más agresivo/adecuado para comparaciones case-insensitive (mejor que solo lower)',
        'casefold elimina tildes automáticamente',
        'casefold solo funciona con ASCII',
      ],
      correctIndex: 1,
      explanation:
        'casefold es la API recomendada para equality case-insensitive. No sustituye NFC.',
    },
    {
      concept: 'unicode-normalization-casefold',
      question:
        'Orden recomendado del curso para comparar dos strings de cliente:',
      options: [
        'lower → comparar → normalize',
        'normalize NFC → strip/collapse espacios → casefold (si política) → comparar',
        'regex primero siempre',
        'encode latin-1 y comparar bytes crudos sin política',
      ],
      correctIndex: 1,
      explanation:
        'Pipeline: NFC, limpieza de espacios, casefold opcional, luego igualdad.',
    },
    {
      concept: 'latam-names-particles',
      question:
        'En Perú/Latam, ¿qué error comete un normalizador que fuerza first_name/last_name estilo US?',
      options: [
        'Ninguno; US es el estándar ISO de nombres',
        'Rompe dos apellidos y partículas (de, del, de la); inventa formato y pierde señal',
        'Solo falla con emails',
        'Python no puede guardar dos apellidos',
      ],
      correctIndex: 1,
      explanation:
        'Modelo latam: nombre(s) + apellido1 + apellido2. Conserva raw; no fuerces US.',
    },
    {
      concept: 'latam-names-particles',
      question:
        'Heurística demo: si solo hay 2 tokens de nombre, ¿qué hace un pipeline prudente?',
      options: [
        'Inventar segundo apellido vacío y marcar accept',
        'Marcar review (o política documentada) en vez de afirmar estructura completa',
        'Borrar el registro',
        'Convertir a DNI',
      ],
      correctIndex: 1,
      explanation:
        'Sin evidencia de segundo apellido, review > invención. Documenta límites del parser.',
    },
    {
      concept: 'latam-names-particles',
      question:
        '¿Qué se debe conservar siempre al normalizar un nombre con espacios múltiples y partículas?',
      options: [
        'Solo el primer token',
        'El raw original además de tokens/campos normalizados',
        'Nada; raw es PII y se borra en demos sintéticas también',
        'Solo apellidos en ASCII sin tildes forzadas',
      ],
      correctIndex: 1,
      explanation:
        'raw + normalized + transforms: auditabilidad. No afirmar identidad legal.',
    },
    {
      concept: 'string-ops',
      question:
        'Antes de escribir un regex para colapsar espacios múltiples, ¿qué debe intentar el curso?',
      options: [
        're.sub siempre primero',
        'Métodos str: split/join, strip, replace — más legibles y suficientes en muchos casos',
        'pandas.str únicamente',
        'encode hex',
      ],
      correctIndex: 1,
      explanation:
        'str antes que regex. " ".join(s.split()) colapsa espacios sin patrón.',
    },
    {
      concept: 'string-ops',
      question:
        '¿Qué hace `" ".join("  a   b  ".split())` en normalización de texto?',
      options: [
        'Deja dobles espacios',
        'Colapsa whitespace y recorta extremos vía split sin args + join',
        'Elimina la letra a',
        'Convierte a lista de code points',
      ],
      correctIndex: 1,
      explanation:
        'split() sin args parte en cualquier whitespace y descarta vacíos; join recompone.',
    },
    {
      concept: 'string-ops',
      question:
        '¿Cuándo pasar de str methods a regex en S07?',
      options: [
        'Nunca hay razón para regex',
        'Cuando necesitas patrones, grupos o validación estructural que str no expresa limpio',
        'Para todo upper/lower',
        'Solo para sumar enteros',
      ],
      correctIndex: 1,
      explanation:
        'Regex cuando el patrón lo justifica; over-regex reduce mantenibilidad.',
    },
    {
      concept: 'names-emails-phones',
      question:
        'Normalizar email en CP-N1-B: ¿cuál política es modestamente correcta?',
      options: [
        'Validar TLD contra lista ISO completa en cliente',
        'strip, lower/casefold local conservador, forma básica local@dominio sin overvalidation de RFC completo',
        'Rechazar todo email con tilde en dominio visible',
        'Guardar solo el hash y borrar el email siempre',
      ],
      correctIndex: 1,
      explanation:
        'Reglas modestas: no reimplementar RFC 5322. Overvalidation genera FN falsos.',
    },
    {
      concept: 'names-emails-phones',
      question:
        'Teléfono peruano sintético de demo: ¿qué NO debes hacer en el normalizador del curso?',
      options: [
        'Conservar dígitos y un formato canónico documentado',
        'Afirmar que el número existe en el padrón real o pertenece a una persona real',
        'Marcar review si el largo no calza la política',
        'Guardar raw y normalizado',
      ],
      correctIndex: 1,
      explanation:
        'Datos sintéticos; sin claims de existencia real ni PII real.',
    },
    {
      concept: 'names-emails-phones',
      question:
        '¿Por qué el curso insiste en no sobrevalidar emails/teléfonos con regex “perfectos”?',
      options: [
        'Porque regex no existe en Python',
        'Falsos rechazos (FN de negocio): clientes válidos caen a quarantine por patrón demasiado estricto',
        'Porque lower() está prohibido',
        'Porque Unicode no aplica a emails',
      ],
      correctIndex: 1,
      explanation:
        'Overvalidation = fricción y datos perdidos. Preferir reglas modestas + review.',
    },
    {
      concept: 'regex-patterns-groups',
      question:
        'En un patrón de código de cliente, ¿para qué sirven los grupos (...)?',
      options: [
        'Solo decoración',
        'Capturar subcadenas para extracción (Match.group / finditer)',
        'Acelerar el GIL',
        'Convertir a int automáticamente',
      ],
      correctIndex: 1,
      explanation:
        'Grupos capturan partes del match. Útiles para extraer id y cola por separado.',
    },
    {
      concept: 'regex-patterns-groups',
      question:
        '¿Qué hacen los anchors ^ y $ en un patrón de validación de código?',
      options: [
        'Buscan en medio del string siempre',
        'Anclan inicio y fin: el patrón debe coincidir con TODO el string, no un substring',
        'Son opcionales y equivalen a .*',
        'Solo funcionan con IGNORECASE',
      ],
      correctIndex: 1,
      explanation:
        'Sin anchors, el patrón puede matchear un fragmento y aceptar basura alrededor.',
    },
    {
      concept: 'regex-patterns-groups',
      question:
        'Diferencia práctica re.search vs re.fullmatch para un código de intake:',
      options: [
        'Son alias exactos',
        'search encuentra substring; fullmatch exige coincidencia de todo el string (como ^...$)',
        'fullmatch es más lento siempre por un factor 100',
        'search no existe en 3.x',
      ],
      correctIndex: 1,
      explanation:
        'fullmatch/anchors evitan aceptar prefijos/sufijos no deseados.',
    },
    {
      concept: 'compile-extract-limits',
      question:
        '¿Cuándo compilar con re.compile en un normalizador de lote?',
      options: [
        'Nunca; compile está deprecado',
        'Cuando reutilizas el mismo patrón miles de veces en un bucle — claridad y micro-ahorro',
        'Solo si el patrón cambia en cada fila',
        'Solo para str.split',
      ],
      correctIndex: 1,
      explanation:
        'Patrón estable + muchas filas → compile legible. No es magia de 100x siempre.',
    },
    {
      concept: 'compile-extract-limits',
      question:
        'findall vs finditer para extraer varios ids de un texto de log:',
      options: [
        'findall devuelve match objects; finditer strings',
        'findall → lista de strings/tuplas; finditer → iterador de Match (mejor si hay muchos)',
        'finditer borra el texto',
        'Ambos requieren pandas',
      ],
      correctIndex: 1,
      explanation:
        'finditer es lazy y da .start/.group. findall materializa lista.',
    },
    {
      concept: 'compile-extract-limits',
      question:
        'Límite importante del regex en este curso:',
      options: [
        'Regex reemplaza Unicode normalization',
        'No resuelve por sí solo identidad/parentesco; es herramienta de forma, no de verdad de negocio',
        'Solo funciona sin tildes',
        'Obliga a usar multiprocessing',
      ],
      correctIndex: 1,
      explanation:
        'Regex extrae/valida forma. Matching de identidad es política + evidencia (T4).',
    },
    {
      concept: 'exact-token-similarity',
      question:
        'Tras normalizar NFC+casefold, ¿qué es una comparación exacta de nombres?',
      options: [
        'Jaccard > 0.5',
        'Igualdad de strings normalizados (o de tokens canónicos unidos)',
        'Distancia de Levenshtein obligatoria',
        'Siempre True si comparten un apellido',
      ],
      correctIndex: 1,
      explanation:
        'Exacta = igualdad post-normalización. Similitud por tokens es otra capa.',
    },
    {
      concept: 'exact-token-similarity',
      question:
        'Jaccard simple de tokens entre conjuntos A y B se define como:',
      options: [
        '|A∪B| / |A∩B|',
        '|A∩B| / |A∪B| (con unión vacía → política 0 o N/A)',
        '|A| - |B|',
        'len(A)+len(B)',
      ],
      correctIndex: 1,
      explanation:
        'Intersección sobre unión. Documenta división por cero si ambos vacíos.',
    },
    {
      concept: 'exact-token-similarity',
      question:
        '¿Para qué sirve un score de tokens en CP-N1-B según el curso?',
      options: [
        'Afirmar parentesco legal automáticamente',
        'Priorizar revisión humana / ranking de candidatos — no certificar identidad',
        'Reemplazar el raw',
        'Borrar tildes del DNI',
      ],
      correctIndex: 1,
      explanation:
        'Score ≠ veredicto legal. Es señal para review, no claim de parentesco.',
    },
    {
      concept: 'fp-fn-evidence',
      question:
        'En matching de clientes, un falso positivo (FP) es:',
      options: [
        'Rechazar dos registros que sí son la misma persona de negocio',
        'Declarar match cuando no deberían considerarse la misma entidad',
        'Un error de sintaxis Python',
        'Siempre preferible a un FN',
      ],
      correctIndex: 1,
      explanation:
        'FP = match erróneo (riesgo de fusión indebida). FN = miss de match real.',
    },
    {
      concept: 'fp-fn-evidence',
      question:
        '¿Qué evidencia mínima debe conservar el normalizador/matcher del curso?',
      options: [
        'Solo el score final sin inputs',
        'raw, normalized, transforms aplicados y razón de match/review — sin PII real de producción',
        'El password del usuario',
        'Nada; evidencia es opcional',
      ],
      correctIndex: 1,
      explanation:
        'Audit trail: raw + transforms + decisión. Datos sintéticos en demos.',
    },
    {
      concept: 'fp-fn-evidence',
      question:
        'El curso prohíbe claims de parentesco/identidad legal a partir de un score. ¿Por qué?',
      options: [
        'Porque Jaccard es ilegal en Perú',
        'Riesgo de producto/cumplimiento: un score de tokens no prueba vínculo familiar ni identidad',
        'Porque casefold borra apellidos',
        'Porque FP no existen en texto',
      ],
      correctIndex: 1,
      explanation:
        'Señales de similitud ≠ prueba legal. Documenta límites; deriva a review humano.',
    },
  ],

  // === S14: NumPy y cómputo vectorizado (security) — V3 8×3 LANE-S14-S17-CLOSE ===
  // === S12 performance V3 recovered ===
  'performance': [
    {
      concept: "requests-status-json",
      question: "[S12/A] Sobre «requests-status-json», ¿cuál es la práctica correcta en un flujo profesional de datos?",
      options: [
        "Ignorar el concepto y pasar a producción sin evidencia",
        "Aplicar requests-status-json con evidencia verificable, límites explícitos y datos sintéticos o autorizados",
        "Usar el concepto para inferir fraude o parentesco automáticamente",
        "Sustituir pruebas y documentación por capturas no reproducibles",
      ],
      correctIndex: 1,
      explanation: "La clave de requests-status-json es aplicarlo con trazabilidad y sin sobreclaim de evidencia.",
    },
    {
      concept: "requests-status-json",
      question: "[S12/B] Sobre «requests-status-json», ¿cuál es la práctica correcta en un flujo profesional de datos?",
      options: [
        "Ignorar el concepto y pasar a producción sin evidencia",
        "Aplicar requests-status-json con evidencia verificable, límites explícitos y datos sintéticos o autorizados",
        "Usar el concepto para inferir fraude o parentesco automáticamente",
        "Sustituir pruebas y documentación por capturas no reproducibles",
      ],
      correctIndex: 1,
      explanation: "La clave de requests-status-json es aplicarlo con trazabilidad y sin sobreclaim de evidencia.",
    },
    {
      concept: "requests-status-json",
      question: "[S12/C] Sobre «requests-status-json», ¿cuál es la práctica correcta en un flujo profesional de datos?",
      options: [
        "Ignorar el concepto y pasar a producción sin evidencia",
        "Aplicar requests-status-json con evidencia verificable, límites explícitos y datos sintéticos o autorizados",
        "Usar el concepto para inferir fraude o parentesco automáticamente",
        "Sustituir pruebas y documentación por capturas no reproducibles",
      ],
      correctIndex: 1,
      explanation: "La clave de requests-status-json es aplicarlo con trazabilidad y sin sobreclaim de evidencia.",
    },
    {
      concept: "timeout-pagination-retry-ratelimit",
      question: "[S12/A] Sobre «timeout-pagination-retry-ratelimit», ¿cuál es la práctica correcta en un flujo profesional de datos?",
      options: [
        "Ignorar el concepto y pasar a producción sin evidencia",
        "Aplicar timeout-pagination-retry-ratelimit con evidencia verificable, límites explícitos y datos sintéticos o autorizados",
        "Usar el concepto para inferir fraude o parentesco automáticamente",
        "Sustituir pruebas y documentación por capturas no reproducibles",
      ],
      correctIndex: 1,
      explanation: "La clave de timeout-pagination-retry-ratelimit es aplicarlo con trazabilidad y sin sobreclaim de evidencia.",
    },
    {
      concept: "timeout-pagination-retry-ratelimit",
      question: "[S12/B] Sobre «timeout-pagination-retry-ratelimit», ¿cuál es la práctica correcta en un flujo profesional de datos?",
      options: [
        "Ignorar el concepto y pasar a producción sin evidencia",
        "Aplicar timeout-pagination-retry-ratelimit con evidencia verificable, límites explícitos y datos sintéticos o autorizados",
        "Usar el concepto para inferir fraude o parentesco automáticamente",
        "Sustituir pruebas y documentación por capturas no reproducibles",
      ],
      correctIndex: 1,
      explanation: "La clave de timeout-pagination-retry-ratelimit es aplicarlo con trazabilidad y sin sobreclaim de evidencia.",
    },
    {
      concept: "timeout-pagination-retry-ratelimit",
      question: "[S12/C] Sobre «timeout-pagination-retry-ratelimit», ¿cuál es la práctica correcta en un flujo profesional de datos?",
      options: [
        "Ignorar el concepto y pasar a producción sin evidencia",
        "Aplicar timeout-pagination-retry-ratelimit con evidencia verificable, límites explícitos y datos sintéticos o autorizados",
        "Usar el concepto para inferir fraude o parentesco automáticamente",
        "Sustituir pruebas y documentación por capturas no reproducibles",
      ],
      correctIndex: 1,
      explanation: "La clave de timeout-pagination-retry-ratelimit es aplicarlo con trazabilidad y sin sobreclaim de evidencia.",
    },
    {
      concept: "auth-secrets-cache-provenance",
      question: "[S12/A] Sobre «auth-secrets-cache-provenance», ¿cuál es la práctica correcta en un flujo profesional de datos?",
      options: [
        "Ignorar el concepto y pasar a producción sin evidencia",
        "Aplicar auth-secrets-cache-provenance con evidencia verificable, límites explícitos y datos sintéticos o autorizados",
        "Usar el concepto para inferir fraude o parentesco automáticamente",
        "Sustituir pruebas y documentación por capturas no reproducibles",
      ],
      correctIndex: 1,
      explanation: "La clave de auth-secrets-cache-provenance es aplicarlo con trazabilidad y sin sobreclaim de evidencia.",
    },
    {
      concept: "auth-secrets-cache-provenance",
      question: "[S12/B] Sobre «auth-secrets-cache-provenance», ¿cuál es la práctica correcta en un flujo profesional de datos?",
      options: [
        "Ignorar el concepto y pasar a producción sin evidencia",
        "Aplicar auth-secrets-cache-provenance con evidencia verificable, límites explícitos y datos sintéticos o autorizados",
        "Usar el concepto para inferir fraude o parentesco automáticamente",
        "Sustituir pruebas y documentación por capturas no reproducibles",
      ],
      correctIndex: 1,
      explanation: "La clave de auth-secrets-cache-provenance es aplicarlo con trazabilidad y sin sobreclaim de evidencia.",
    },
    {
      concept: "auth-secrets-cache-provenance",
      question: "[S12/C] Sobre «auth-secrets-cache-provenance», ¿cuál es la práctica correcta en un flujo profesional de datos?",
      options: [
        "Ignorar el concepto y pasar a producción sin evidencia",
        "Aplicar auth-secrets-cache-provenance con evidencia verificable, límites explícitos y datos sintéticos o autorizados",
        "Usar el concepto para inferir fraude o parentesco automáticamente",
        "Sustituir pruebas y documentación por capturas no reproducibles",
      ],
      correctIndex: 1,
      explanation: "La clave de auth-secrets-cache-provenance es aplicarlo con trazabilidad y sin sobreclaim de evidencia.",
    },
    {
      concept: "contract-tests-fallback",
      question: "[S12/A] Sobre «contract-tests-fallback», ¿cuál es la práctica correcta en un flujo profesional de datos?",
      options: [
        "Ignorar el concepto y pasar a producción sin evidencia",
        "Aplicar contract-tests-fallback con evidencia verificable, límites explícitos y datos sintéticos o autorizados",
        "Usar el concepto para inferir fraude o parentesco automáticamente",
        "Sustituir pruebas y documentación por capturas no reproducibles",
      ],
      correctIndex: 1,
      explanation: "La clave de contract-tests-fallback es aplicarlo con trazabilidad y sin sobreclaim de evidencia.",
    },
    {
      concept: "contract-tests-fallback",
      question: "[S12/B] Sobre «contract-tests-fallback», ¿cuál es la práctica correcta en un flujo profesional de datos?",
      options: [
        "Ignorar el concepto y pasar a producción sin evidencia",
        "Aplicar contract-tests-fallback con evidencia verificable, límites explícitos y datos sintéticos o autorizados",
        "Usar el concepto para inferir fraude o parentesco automáticamente",
        "Sustituir pruebas y documentación por capturas no reproducibles",
      ],
      correctIndex: 1,
      explanation: "La clave de contract-tests-fallback es aplicarlo con trazabilidad y sin sobreclaim de evidencia.",
    },
    {
      concept: "contract-tests-fallback",
      question: "[S12/C] Sobre «contract-tests-fallback», ¿cuál es la práctica correcta en un flujo profesional de datos?",
      options: [
        "Ignorar el concepto y pasar a producción sin evidencia",
        "Aplicar contract-tests-fallback con evidencia verificable, límites explícitos y datos sintéticos o autorizados",
        "Usar el concepto para inferir fraude o parentesco automáticamente",
        "Sustituir pruebas y documentación por capturas no reproducibles",
      ],
      correctIndex: 1,
      explanation: "La clave de contract-tests-fallback es aplicarlo con trazabilidad y sin sobreclaim de evidencia.",
    },
    {
      concept: "schema-crud-joins",
      question: "[S12/A] Sobre «schema-crud-joins», ¿cuál es la práctica correcta en un flujo profesional de datos?",
      options: [
        "Ignorar el concepto y pasar a producción sin evidencia",
        "Aplicar schema-crud-joins con evidencia verificable, límites explícitos y datos sintéticos o autorizados",
        "Usar el concepto para inferir fraude o parentesco automáticamente",
        "Sustituir pruebas y documentación por capturas no reproducibles",
      ],
      correctIndex: 1,
      explanation: "La clave de schema-crud-joins es aplicarlo con trazabilidad y sin sobreclaim de evidencia.",
    },
    {
      concept: "schema-crud-joins",
      question: "[S12/B] Sobre «schema-crud-joins», ¿cuál es la práctica correcta en un flujo profesional de datos?",
      options: [
        "Ignorar el concepto y pasar a producción sin evidencia",
        "Aplicar schema-crud-joins con evidencia verificable, límites explícitos y datos sintéticos o autorizados",
        "Usar el concepto para inferir fraude o parentesco automáticamente",
        "Sustituir pruebas y documentación por capturas no reproducibles",
      ],
      correctIndex: 1,
      explanation: "La clave de schema-crud-joins es aplicarlo con trazabilidad y sin sobreclaim de evidencia.",
    },
    {
      concept: "schema-crud-joins",
      question: "[S12/C] Sobre «schema-crud-joins», ¿cuál es la práctica correcta en un flujo profesional de datos?",
      options: [
        "Ignorar el concepto y pasar a producción sin evidencia",
        "Aplicar schema-crud-joins con evidencia verificable, límites explícitos y datos sintéticos o autorizados",
        "Usar el concepto para inferir fraude o parentesco automáticamente",
        "Sustituir pruebas y documentación por capturas no reproducibles",
      ],
      correctIndex: 1,
      explanation: "La clave de schema-crud-joins es aplicarlo con trazabilidad y sin sobreclaim de evidencia.",
    },
    {
      concept: "params-transactions-constraints-indexes",
      question: "[S12/A] Sobre «params-transactions-constraints-indexes», ¿cuál es la práctica correcta en un flujo profesional de datos?",
      options: [
        "Ignorar el concepto y pasar a producción sin evidencia",
        "Aplicar params-transactions-constraints-indexes con evidencia verificable, límites explícitos y datos sintéticos o autorizados",
        "Usar el concepto para inferir fraude o parentesco automáticamente",
        "Sustituir pruebas y documentación por capturas no reproducibles",
      ],
      correctIndex: 1,
      explanation: "La clave de params-transactions-constraints-indexes es aplicarlo con trazabilidad y sin sobreclaim de evidencia.",
    },
    {
      concept: "params-transactions-constraints-indexes",
      question: "[S12/B] Sobre «params-transactions-constraints-indexes», ¿cuál es la práctica correcta en un flujo profesional de datos?",
      options: [
        "Ignorar el concepto y pasar a producción sin evidencia",
        "Aplicar params-transactions-constraints-indexes con evidencia verificable, límites explícitos y datos sintéticos o autorizados",
        "Usar el concepto para inferir fraude o parentesco automáticamente",
        "Sustituir pruebas y documentación por capturas no reproducibles",
      ],
      correctIndex: 1,
      explanation: "La clave de params-transactions-constraints-indexes es aplicarlo con trazabilidad y sin sobreclaim de evidencia.",
    },
    {
      concept: "params-transactions-constraints-indexes",
      question: "[S12/C] Sobre «params-transactions-constraints-indexes», ¿cuál es la práctica correcta en un flujo profesional de datos?",
      options: [
        "Ignorar el concepto y pasar a producción sin evidencia",
        "Aplicar params-transactions-constraints-indexes con evidencia verificable, límites explícitos y datos sintéticos o autorizados",
        "Usar el concepto para inferir fraude o parentesco automáticamente",
        "Sustituir pruebas y documentación por capturas no reproducibles",
      ],
      correctIndex: 1,
      explanation: "La clave de params-transactions-constraints-indexes es aplicarlo con trazabilidad y sin sobreclaim de evidencia.",
    },
    {
      concept: "normalize-geocode-authorized",
      question: "[S12/A] Sobre «normalize-geocode-authorized», ¿cuál es la práctica correcta en un flujo profesional de datos?",
      options: [
        "Ignorar el concepto y pasar a producción sin evidencia",
        "Aplicar normalize-geocode-authorized con evidencia verificable, límites explícitos y datos sintéticos o autorizados",
        "Usar el concepto para inferir fraude o parentesco automáticamente",
        "Sustituir pruebas y documentación por capturas no reproducibles",
      ],
      correctIndex: 1,
      explanation: "La clave de normalize-geocode-authorized es aplicarlo con trazabilidad y sin sobreclaim de evidencia.",
    },
    {
      concept: "normalize-geocode-authorized",
      question: "[S12/B] Sobre «normalize-geocode-authorized», ¿cuál es la práctica correcta en un flujo profesional de datos?",
      options: [
        "Ignorar el concepto y pasar a producción sin evidencia",
        "Aplicar normalize-geocode-authorized con evidencia verificable, límites explícitos y datos sintéticos o autorizados",
        "Usar el concepto para inferir fraude o parentesco automáticamente",
        "Sustituir pruebas y documentación por capturas no reproducibles",
      ],
      correctIndex: 1,
      explanation: "La clave de normalize-geocode-authorized es aplicarlo con trazabilidad y sin sobreclaim de evidencia.",
    },
    {
      concept: "normalize-geocode-authorized",
      question: "[S12/C] Sobre «normalize-geocode-authorized», ¿cuál es la práctica correcta en un flujo profesional de datos?",
      options: [
        "Ignorar el concepto y pasar a producción sin evidencia",
        "Aplicar normalize-geocode-authorized con evidencia verificable, límites explícitos y datos sintéticos o autorizados",
        "Usar el concepto para inferir fraude o parentesco automáticamente",
        "Sustituir pruebas y documentación por capturas no reproducibles",
      ],
      correctIndex: 1,
      explanation: "La clave de normalize-geocode-authorized es aplicarlo con trazabilidad y sin sobreclaim de evidencia.",
    },
    {
      concept: "coord-quality-haversine-cache-policy",
      question: "[S12/A] Sobre «coord-quality-haversine-cache-policy», ¿cuál es la práctica correcta en un flujo profesional de datos?",
      options: [
        "Ignorar el concepto y pasar a producción sin evidencia",
        "Aplicar coord-quality-haversine-cache-policy con evidencia verificable, límites explícitos y datos sintéticos o autorizados",
        "Usar el concepto para inferir fraude o parentesco automáticamente",
        "Sustituir pruebas y documentación por capturas no reproducibles",
      ],
      correctIndex: 1,
      explanation: "La clave de coord-quality-haversine-cache-policy es aplicarlo con trazabilidad y sin sobreclaim de evidencia.",
    },
    {
      concept: "coord-quality-haversine-cache-policy",
      question: "[S12/B] Sobre «coord-quality-haversine-cache-policy», ¿cuál es la práctica correcta en un flujo profesional de datos?",
      options: [
        "Ignorar el concepto y pasar a producción sin evidencia",
        "Aplicar coord-quality-haversine-cache-policy con evidencia verificable, límites explícitos y datos sintéticos o autorizados",
        "Usar el concepto para inferir fraude o parentesco automáticamente",
        "Sustituir pruebas y documentación por capturas no reproducibles",
      ],
      correctIndex: 1,
      explanation: "La clave de coord-quality-haversine-cache-policy es aplicarlo con trazabilidad y sin sobreclaim de evidencia.",
    },
    {
      concept: "coord-quality-haversine-cache-policy",
      question: "[S12/C] Sobre «coord-quality-haversine-cache-policy», ¿cuál es la práctica correcta en un flujo profesional de datos?",
      options: [
        "Ignorar el concepto y pasar a producción sin evidencia",
        "Aplicar coord-quality-haversine-cache-policy con evidencia verificable, límites explícitos y datos sintéticos o autorizados",
        "Usar el concepto para inferir fraude o parentesco automáticamente",
        "Sustituir pruebas y documentación por capturas no reproducibles",
      ],
      correctIndex: 1,
      explanation: "La clave de coord-quality-haversine-cache-policy es aplicarlo con trazabilidad y sin sobreclaim de evidencia.",
    },
  ],

  // === S13 rpa-automation V3 recovered ===
  'rpa-automation': [
    {
      concept: "normalize-blocking-er",
      question: "[S13/A] Sobre «normalize-blocking-er», ¿cuál es la práctica correcta en un flujo profesional de datos?",
      options: [
        "Ignorar el concepto y pasar a producción sin evidencia",
        "Aplicar normalize-blocking-er con evidencia verificable, límites explícitos y datos sintéticos o autorizados",
        "Usar el concepto para inferir fraude o parentesco automáticamente",
        "Sustituir pruebas y documentación por capturas no reproducibles",
      ],
      correctIndex: 1,
      explanation: "La clave de normalize-blocking-er es aplicarlo con trazabilidad y sin sobreclaim de evidencia.",
    },
    {
      concept: "normalize-blocking-er",
      question: "[S13/B] Sobre «normalize-blocking-er», ¿cuál es la práctica correcta en un flujo profesional de datos?",
      options: [
        "Ignorar el concepto y pasar a producción sin evidencia",
        "Aplicar normalize-blocking-er con evidencia verificable, límites explícitos y datos sintéticos o autorizados",
        "Usar el concepto para inferir fraude o parentesco automáticamente",
        "Sustituir pruebas y documentación por capturas no reproducibles",
      ],
      correctIndex: 1,
      explanation: "La clave de normalize-blocking-er es aplicarlo con trazabilidad y sin sobreclaim de evidencia.",
    },
    {
      concept: "normalize-blocking-er",
      question: "[S13/C] Sobre «normalize-blocking-er», ¿cuál es la práctica correcta en un flujo profesional de datos?",
      options: [
        "Ignorar el concepto y pasar a producción sin evidencia",
        "Aplicar normalize-blocking-er con evidencia verificable, límites explícitos y datos sintéticos o autorizados",
        "Usar el concepto para inferir fraude o parentesco automáticamente",
        "Sustituir pruebas y documentación por capturas no reproducibles",
      ],
      correctIndex: 1,
      explanation: "La clave de normalize-blocking-er es aplicarlo con trazabilidad y sin sobreclaim de evidencia.",
    },
    {
      concept: "labeled-truth-precision-recall-clerical",
      question: "[S13/A] Sobre «labeled-truth-precision-recall-clerical», ¿cuál es la práctica correcta en un flujo profesional de datos?",
      options: [
        "Ignorar el concepto y pasar a producción sin evidencia",
        "Aplicar labeled-truth-precision-recall-clerical con evidencia verificable, límites explícitos y datos sintéticos o autorizados",
        "Usar el concepto para inferir fraude o parentesco automáticamente",
        "Sustituir pruebas y documentación por capturas no reproducibles",
      ],
      correctIndex: 1,
      explanation: "La clave de labeled-truth-precision-recall-clerical es aplicarlo con trazabilidad y sin sobreclaim de evidencia.",
    },
    {
      concept: "labeled-truth-precision-recall-clerical",
      question: "[S13/B] Sobre «labeled-truth-precision-recall-clerical», ¿cuál es la práctica correcta en un flujo profesional de datos?",
      options: [
        "Ignorar el concepto y pasar a producción sin evidencia",
        "Aplicar labeled-truth-precision-recall-clerical con evidencia verificable, límites explícitos y datos sintéticos o autorizados",
        "Usar el concepto para inferir fraude o parentesco automáticamente",
        "Sustituir pruebas y documentación por capturas no reproducibles",
      ],
      correctIndex: 1,
      explanation: "La clave de labeled-truth-precision-recall-clerical es aplicarlo con trazabilidad y sin sobreclaim de evidencia.",
    },
    {
      concept: "labeled-truth-precision-recall-clerical",
      question: "[S13/C] Sobre «labeled-truth-precision-recall-clerical», ¿cuál es la práctica correcta en un flujo profesional de datos?",
      options: [
        "Ignorar el concepto y pasar a producción sin evidencia",
        "Aplicar labeled-truth-precision-recall-clerical con evidencia verificable, límites explícitos y datos sintéticos o autorizados",
        "Usar el concepto para inferir fraude o parentesco automáticamente",
        "Sustituir pruebas y documentación por capturas no reproducibles",
      ],
      correctIndex: 1,
      explanation: "La clave de labeled-truth-precision-recall-clerical es aplicarlo con trazabilidad y sin sobreclaim de evidencia.",
    },
    {
      concept: "shared-contact-distance-surnames",
      question: "[S13/A] Sobre «shared-contact-distance-surnames», ¿cuál es la práctica correcta en un flujo profesional de datos?",
      options: [
        "Ignorar el concepto y pasar a producción sin evidencia",
        "Aplicar shared-contact-distance-surnames con evidencia verificable, límites explícitos y datos sintéticos o autorizados",
        "Usar el concepto para inferir fraude o parentesco automáticamente",
        "Sustituir pruebas y documentación por capturas no reproducibles",
      ],
      correctIndex: 1,
      explanation: "La clave de shared-contact-distance-surnames es aplicarlo con trazabilidad y sin sobreclaim de evidencia.",
    },
    {
      concept: "shared-contact-distance-surnames",
      question: "[S13/B] Sobre «shared-contact-distance-surnames», ¿cuál es la práctica correcta en un flujo profesional de datos?",
      options: [
        "Ignorar el concepto y pasar a producción sin evidencia",
        "Aplicar shared-contact-distance-surnames con evidencia verificable, límites explícitos y datos sintéticos o autorizados",
        "Usar el concepto para inferir fraude o parentesco automáticamente",
        "Sustituir pruebas y documentación por capturas no reproducibles",
      ],
      correctIndex: 1,
      explanation: "La clave de shared-contact-distance-surnames es aplicarlo con trazabilidad y sin sobreclaim de evidencia.",
    },
    {
      concept: "shared-contact-distance-surnames",
      question: "[S13/C] Sobre «shared-contact-distance-surnames», ¿cuál es la práctica correcta en un flujo profesional de datos?",
      options: [
        "Ignorar el concepto y pasar a producción sin evidencia",
        "Aplicar shared-contact-distance-surnames con evidencia verificable, límites explícitos y datos sintéticos o autorizados",
        "Usar el concepto para inferir fraude o parentesco automáticamente",
        "Sustituir pruebas y documentación por capturas no reproducibles",
      ],
      correctIndex: 1,
      explanation: "La clave de shared-contact-distance-surnames es aplicarlo con trazabilidad y sin sobreclaim de evidencia.",
    },
    {
      concept: "direct-tx-common-counterparties",
      question: "[S13/A] Sobre «direct-tx-common-counterparties», ¿cuál es la práctica correcta en un flujo profesional de datos?",
      options: [
        "Ignorar el concepto y pasar a producción sin evidencia",
        "Aplicar direct-tx-common-counterparties con evidencia verificable, límites explícitos y datos sintéticos o autorizados",
        "Usar el concepto para inferir fraude o parentesco automáticamente",
        "Sustituir pruebas y documentación por capturas no reproducibles",
      ],
      correctIndex: 1,
      explanation: "La clave de direct-tx-common-counterparties es aplicarlo con trazabilidad y sin sobreclaim de evidencia.",
    },
    {
      concept: "direct-tx-common-counterparties",
      question: "[S13/B] Sobre «direct-tx-common-counterparties», ¿cuál es la práctica correcta en un flujo profesional de datos?",
      options: [
        "Ignorar el concepto y pasar a producción sin evidencia",
        "Aplicar direct-tx-common-counterparties con evidencia verificable, límites explícitos y datos sintéticos o autorizados",
        "Usar el concepto para inferir fraude o parentesco automáticamente",
        "Sustituir pruebas y documentación por capturas no reproducibles",
      ],
      correctIndex: 1,
      explanation: "La clave de direct-tx-common-counterparties es aplicarlo con trazabilidad y sin sobreclaim de evidencia.",
    },
    {
      concept: "direct-tx-common-counterparties",
      question: "[S13/C] Sobre «direct-tx-common-counterparties», ¿cuál es la práctica correcta en un flujo profesional de datos?",
      options: [
        "Ignorar el concepto y pasar a producción sin evidencia",
        "Aplicar direct-tx-common-counterparties con evidencia verificable, límites explícitos y datos sintéticos o autorizados",
        "Usar el concepto para inferir fraude o parentesco automáticamente",
        "Sustituir pruebas y documentación por capturas no reproducibles",
      ],
      correctIndex: 1,
      explanation: "La clave de direct-tx-common-counterparties es aplicarlo con trazabilidad y sin sobreclaim de evidencia.",
    },
    {
      concept: "evidence-score-uncertainty-explanation",
      question: "[S13/A] Sobre «evidence-score-uncertainty-explanation», ¿cuál es la práctica correcta en un flujo profesional de datos?",
      options: [
        "Ignorar el concepto y pasar a producción sin evidencia",
        "Aplicar evidence-score-uncertainty-explanation con evidencia verificable, límites explícitos y datos sintéticos o autorizados",
        "Usar el concepto para inferir fraude o parentesco automáticamente",
        "Sustituir pruebas y documentación por capturas no reproducibles",
      ],
      correctIndex: 1,
      explanation: "La clave de evidence-score-uncertainty-explanation es aplicarlo con trazabilidad y sin sobreclaim de evidencia.",
    },
    {
      concept: "evidence-score-uncertainty-explanation",
      question: "[S13/B] Sobre «evidence-score-uncertainty-explanation», ¿cuál es la práctica correcta en un flujo profesional de datos?",
      options: [
        "Ignorar el concepto y pasar a producción sin evidencia",
        "Aplicar evidence-score-uncertainty-explanation con evidencia verificable, límites explícitos y datos sintéticos o autorizados",
        "Usar el concepto para inferir fraude o parentesco automáticamente",
        "Sustituir pruebas y documentación por capturas no reproducibles",
      ],
      correctIndex: 1,
      explanation: "La clave de evidence-score-uncertainty-explanation es aplicarlo con trazabilidad y sin sobreclaim de evidencia.",
    },
    {
      concept: "evidence-score-uncertainty-explanation",
      question: "[S13/C] Sobre «evidence-score-uncertainty-explanation», ¿cuál es la práctica correcta en un flujo profesional de datos?",
      options: [
        "Ignorar el concepto y pasar a producción sin evidencia",
        "Aplicar evidence-score-uncertainty-explanation con evidencia verificable, límites explícitos y datos sintéticos o autorizados",
        "Usar el concepto para inferir fraude o parentesco automáticamente",
        "Sustituir pruebas y documentación por capturas no reproducibles",
      ],
      correctIndex: 1,
      explanation: "La clave de evidence-score-uncertainty-explanation es aplicarlo con trazabilidad y sin sobreclaim de evidencia.",
    },
    {
      concept: "review-threshold-abstention-no-auto-inference",
      question: "[S13/A] Sobre «review-threshold-abstention-no-auto-inference», ¿cuál es la práctica correcta en un flujo profesional de datos?",
      options: [
        "Ignorar el concepto y pasar a producción sin evidencia",
        "Aplicar review-threshold-abstention-no-auto-inference con evidencia verificable, límites explícitos y datos sintéticos o autorizados",
        "Usar el concepto para inferir fraude o parentesco automáticamente",
        "Sustituir pruebas y documentación por capturas no reproducibles",
      ],
      correctIndex: 1,
      explanation: "La clave de review-threshold-abstention-no-auto-inference es aplicarlo con trazabilidad y sin sobreclaim de evidencia.",
    },
    {
      concept: "review-threshold-abstention-no-auto-inference",
      question: "[S13/B] Sobre «review-threshold-abstention-no-auto-inference», ¿cuál es la práctica correcta en un flujo profesional de datos?",
      options: [
        "Ignorar el concepto y pasar a producción sin evidencia",
        "Aplicar review-threshold-abstention-no-auto-inference con evidencia verificable, límites explícitos y datos sintéticos o autorizados",
        "Usar el concepto para inferir fraude o parentesco automáticamente",
        "Sustituir pruebas y documentación por capturas no reproducibles",
      ],
      correctIndex: 1,
      explanation: "La clave de review-threshold-abstention-no-auto-inference es aplicarlo con trazabilidad y sin sobreclaim de evidencia.",
    },
    {
      concept: "review-threshold-abstention-no-auto-inference",
      question: "[S13/C] Sobre «review-threshold-abstention-no-auto-inference», ¿cuál es la práctica correcta en un flujo profesional de datos?",
      options: [
        "Ignorar el concepto y pasar a producción sin evidencia",
        "Aplicar review-threshold-abstention-no-auto-inference con evidencia verificable, límites explícitos y datos sintéticos o autorizados",
        "Usar el concepto para inferir fraude o parentesco automáticamente",
        "Sustituir pruebas y documentación por capturas no reproducibles",
      ],
      correctIndex: 1,
      explanation: "La clave de review-threshold-abstention-no-auto-inference es aplicarlo con trazabilidad y sin sobreclaim de evidencia.",
    },
    {
      concept: "dashboard-map-case-sheet",
      question: "[S13/A] Sobre «dashboard-map-case-sheet», ¿cuál es la práctica correcta en un flujo profesional de datos?",
      options: [
        "Ignorar el concepto y pasar a producción sin evidencia",
        "Aplicar dashboard-map-case-sheet con evidencia verificable, límites explícitos y datos sintéticos o autorizados",
        "Usar el concepto para inferir fraude o parentesco automáticamente",
        "Sustituir pruebas y documentación por capturas no reproducibles",
      ],
      correctIndex: 1,
      explanation: "La clave de dashboard-map-case-sheet es aplicarlo con trazabilidad y sin sobreclaim de evidencia.",
    },
    {
      concept: "dashboard-map-case-sheet",
      question: "[S13/B] Sobre «dashboard-map-case-sheet», ¿cuál es la práctica correcta en un flujo profesional de datos?",
      options: [
        "Ignorar el concepto y pasar a producción sin evidencia",
        "Aplicar dashboard-map-case-sheet con evidencia verificable, límites explícitos y datos sintéticos o autorizados",
        "Usar el concepto para inferir fraude o parentesco automáticamente",
        "Sustituir pruebas y documentación por capturas no reproducibles",
      ],
      correctIndex: 1,
      explanation: "La clave de dashboard-map-case-sheet es aplicarlo con trazabilidad y sin sobreclaim de evidencia.",
    },
    {
      concept: "dashboard-map-case-sheet",
      question: "[S13/C] Sobre «dashboard-map-case-sheet», ¿cuál es la práctica correcta en un flujo profesional de datos?",
      options: [
        "Ignorar el concepto y pasar a producción sin evidencia",
        "Aplicar dashboard-map-case-sheet con evidencia verificable, límites explícitos y datos sintéticos o autorizados",
        "Usar el concepto para inferir fraude o parentesco automáticamente",
        "Sustituir pruebas y documentación por capturas no reproducibles",
      ],
      correctIndex: 1,
      explanation: "La clave de dashboard-map-case-sheet es aplicarlo con trazabilidad y sin sobreclaim de evidencia.",
    },
    {
      concept: "privacy-access-tests-demo-runbook",
      question: "[S13/A] Sobre «privacy-access-tests-demo-runbook», ¿cuál es la práctica correcta en un flujo profesional de datos?",
      options: [
        "Ignorar el concepto y pasar a producción sin evidencia",
        "Aplicar privacy-access-tests-demo-runbook con evidencia verificable, límites explícitos y datos sintéticos o autorizados",
        "Usar el concepto para inferir fraude o parentesco automáticamente",
        "Sustituir pruebas y documentación por capturas no reproducibles",
      ],
      correctIndex: 1,
      explanation: "La clave de privacy-access-tests-demo-runbook es aplicarlo con trazabilidad y sin sobreclaim de evidencia.",
    },
    {
      concept: "privacy-access-tests-demo-runbook",
      question: "[S13/B] Sobre «privacy-access-tests-demo-runbook», ¿cuál es la práctica correcta en un flujo profesional de datos?",
      options: [
        "Ignorar el concepto y pasar a producción sin evidencia",
        "Aplicar privacy-access-tests-demo-runbook con evidencia verificable, límites explícitos y datos sintéticos o autorizados",
        "Usar el concepto para inferir fraude o parentesco automáticamente",
        "Sustituir pruebas y documentación por capturas no reproducibles",
      ],
      correctIndex: 1,
      explanation: "La clave de privacy-access-tests-demo-runbook es aplicarlo con trazabilidad y sin sobreclaim de evidencia.",
    },
    {
      concept: "privacy-access-tests-demo-runbook",
      question: "[S13/C] Sobre «privacy-access-tests-demo-runbook», ¿cuál es la práctica correcta en un flujo profesional de datos?",
      options: [
        "Ignorar el concepto y pasar a producción sin evidencia",
        "Aplicar privacy-access-tests-demo-runbook con evidencia verificable, límites explícitos y datos sintéticos o autorizados",
        "Usar el concepto para inferir fraude o parentesco automáticamente",
        "Sustituir pruebas y documentación por capturas no reproducibles",
      ],
      correctIndex: 1,
      explanation: "La clave de privacy-access-tests-demo-runbook es aplicarlo con trazabilidad y sin sobreclaim de evidencia.",
    },
  ],

  'security': [
    {
      concept: 'ndarray-dtype-shape',
      question: 'En NumPy, ¿qué describe mejor un ndarray?',
      options: [
        'Una lista de Python con tipos mixtos ilimitados',
        'Un arreglo multidimensional homogéneo con dtype y shape documentables',
        'Solo una matriz 2D de strings',
        'Un DataFrame de pandas con índice',
      ],
      correctIndex: 1,
      explanation: 'El ndarray es el bloque contiguo/strided homogéneo; dtype y shape son el contrato.',
    },
    {
      concept: 'ndarray-dtype-shape',
      question: 'Al crear flags de completitud 0/1 para un lote de clientes sintéticos, conviene:',
      options: [
        'Usar dtype=object siempre',
        'Elegir dtype explícito (p. ej. uint8 o bool) y validar shape/ndim',
        'Omitir dtype y confiar en el azar del sistema',
        'Guardar cada flag en un dict anidado sin array',
      ],
      correctIndex: 1,
      explanation: 'dtype explícito evita sorpresas; shape/ndim validan el contrato del pipeline.',
    },
    {
      concept: 'ndarray-dtype-shape',
      question: '¿Qué informa arr.itemsize en un array de float64?',
      options: [
        'El número de filas',
        'Los bytes por elemento del dtype',
        'El rank del tensor en GPU',
        'La cantidad de NaN',
      ],
      correctIndex: 1,
      explanation: 'itemsize es el tamaño en bytes de un elemento según el dtype.',
    },
    {
      concept: 'create-index-masks',
      question: 'Una máscara booleana scores < 0.5 se usa para:',
      options: [
        'Cambiar el dtype a string',
        'Filtrar o señalar elementos que incumplen un umbral de calidad',
        'Ordenar alfabéticamente el array',
        'Convertir el array en un generador infinito',
      ],
      correctIndex: 1,
      explanation: 'Las máscaras filtran o marcan filas/elementos según una condición.',
    },
    {
      concept: 'create-index-masks',
      question: 'Tras a[mask] con mask booleana del mismo shape, lo más seguro es asumir:',
      options: [
        'Que siempre es una view mutable del original',
        'Que obtienes un array filtrado (a menudo copia/1D); no mutes asumiendo view',
        'Que mask se borra del heap',
        'Que shape se conserva siempre idéntico',
      ],
      correctIndex: 1,
      explanation: 'El filtrado booleano no garantiza view; documenta mutabilidad.',
    },
    {
      concept: 'create-index-masks',
      question: 'np.arange y np.linspace sirven principalmente para:',
      options: [
        'Leer CSV de SUNAT',
        'Crear secuencias numéricas controladas para indexación o grillas',
        'Encriptar PII',
        'Reemplazar groupby de pandas',
      ],
      correctIndex: 1,
      explanation: 'Son constructores de secuencias; no son I/O ni crypto.',
    },
    {
      concept: 'ufuncs-reductions',
      question: 'Una ufunc en NumPy es:',
      options: [
        'Una función que solo corre en el GIL de un hilo de UI',
        'Una operación element-wise vectorizada (p. ej. np.add, np.sqrt)',
        'Un JOIN SQL',
        'Un validador de schema de Excel',
      ],
      correctIndex: 1,
      explanation: 'ufuncs aplican operaciones de forma vectorizada elemento a elemento.',
    },
    {
      concept: 'ufuncs-reductions',
      question: 'np.mean(X, axis=0) sobre una matriz de métricas por fila calcula:',
      options: [
        'La media global escalar siempre',
        'La media a lo largo de las filas (promedio por columna si axis=0)',
        'El máximo de la diagonal',
        'La transpuesta sin reducir',
      ],
      correctIndex: 1,
      explanation: 'axis controla la dimensión que se colapsa en la reducción.',
    },
    {
      concept: 'ufuncs-reductions',
      question: 'keepdims=True en una reducción sirve para:',
      options: [
        'Borrar el array original',
        'Conservar ejes de tamaño 1 y facilitar broadcasting posterior',
        'Forzar dtype=object',
        'Ignorar NaN automáticamente',
      ],
      correctIndex: 1,
      explanation: 'keepdims mantiene la forma alineable para operar de nuevo con el array original.',
    },
    {
      concept: 'broadcasting-shapes',
      question: 'Broadcasting compatible entre (n,1) y (1,m) produce shape típico:',
      options: [
        '(1,)',
        '(n, m) si las reglas de alineación se cumplen',
        'Siempre error ValueError',
        '(n+m,)',
      ],
      correctIndex: 1,
      explanation: 'Las dimensiones 1 se estiran; (n,1) y (1,m) → (n,m).',
    },
    {
      concept: 'broadcasting-shapes',
      question: 'Si shapes son incompatibles (p. ej. (3,) y (4,)), NumPy:',
      options: [
        'Rellena con ceros en silencio',
        'Lanza error de broadcast; hay que alinear con reshape/newaxis o corregir datos',
        'Concatena automáticamente',
        'Convierte a list de Python',
      ],
      correctIndex: 1,
      explanation: 'Incompatibilidad → error explícito; alinea o reestructura.',
    },
    {
      concept: 'broadcasting-shapes',
      question: 'np.newaxis / None en un índice se usa para:',
      options: [
        'Eliminar NaN',
        'Insertar un eje de tamaño 1 y habilitar broadcast',
        'Ordenar el array',
        'Cambiar el locale de fechas',
      ],
      correctIndex: 1,
      explanation: 'newaxis expande dimensiones para alinear operaciones.',
    },
    {
      concept: 'views-copies-mutability',
      question: 'Mutar un slice que es view del array base implica:',
      options: [
        'Que el original nunca cambia',
        'Que el array base puede cambiar (efecto colateral)',
        'Que se crea un proceso hijo',
        'Que el dtype pasa a object',
      ],
      correctIndex: 1,
      explanation: 'Views comparten memoria; mutar la view puede mutar el base.',
    },
    {
      concept: 'views-copies-mutability',
      question: 'Para aislar un buffer antes de editarlo de forma segura conviene:',
      options: [
        'Usar solo índices negativos',
        'Hacer .copy() (o política explícita de ownership) antes de mutar',
        'Llamar print tres veces',
        'Convertir a set',
      ],
      correctIndex: 1,
      explanation: 'copy() rompe el aliasing cuando necesitas independencia.',
    },
    {
      concept: 'views-copies-mutability',
      question: 'arr.base is not None suele indicar:',
      options: [
        'Que el array está vacío',
        'Que el array es view de otro (comparte datos)',
        'Que falló el GC',
        'Que es un string',
      ],
      correctIndex: 1,
      explanation: 'base apunta al propietario de la memoria cuando hay view.',
    },
    {
      concept: 'nan-inf-stability',
      question: 'np.isnan y np.isinf se usan para:',
      options: [
        'Ordenar strings',
        'Detectar valores no finitos antes de métricas frágiles',
        'Leer Excel',
        'Crear venv',
      ],
      correctIndex: 1,
      explanation: 'Identifican NaN/inf que rompen sumas, medias o scores.',
    },
    {
      concept: 'nan-inf-stability',
      question: 'Para promediar ignorando NaN documentados, la opción idiomática es:',
      options: [
        'Dividir por cero a propósito',
        'Usar np.nanmean (o máscara + mean) y registrar cuántos NaN se omitieron',
        'Reemplazar todo por 0 sin métrica',
        'Usar eval',
      ],
      correctIndex: 1,
      explanation: 'nanmean (o filtrado) + reporte de omisiones es honestidad numérica.',
    },
    {
      concept: 'nan-inf-stability',
      question: 'Overflow o divisiones inestables en scores de calidad deben:',
      options: [
        'Ocultarse al revisor',
        'Detectarse (isinf/clip/guards) y documentarse en el runbook de métricas',
        'Convertirse en strings bonitos',
        'Ignorarse si el promedio \'se ve bien\'',
      ],
      correctIndex: 1,
      explanation: 'Estabilidad numérica es parte del contrato de la métrica.',
    },
    {
      concept: 'vectorize-vs-loops',
      question: 'Un loop Python puro sobre millones de floats suele ser más lento que ufuncs porque:',
      options: [
        'Python no puede sumar',
        'El overhead del intérprete por elemento domina frente al código vectorizado en C/SIMD',
        'NumPy prohíbe loops por licencia',
        'Los loops no existen en 3.12',
      ],
      correctIndex: 1,
      explanation: 'El costo por-elemento en Python vs bulk vectorizado explica la diferencia.',
    },
    {
      concept: 'vectorize-vs-loops',
      question: 'Un benchmark honesto loop vs vectorizado debe:',
      options: [
        'Medir solo el print',
        'Usar el mismo input, calentar, cronometrar de forma comparable y verificar equivalencia de resultados',
        'Borrar el baseline si pierde',
        'Usar datos distintos en cada método',
      ],
      correctIndex: 1,
      explanation: 'Misma carga, timing justo y equivalencia (p. ej. allclose).',
    },
    {
      concept: 'vectorize-vs-loops',
      question: 'np.vectorize sobre una función Python pura:',
      options: [
        'Garantiza siempre el máximo rendimiento SIMD',
        'Es comodidad de API; no sustituye ufuncs nativas para velocidad real',
        'Encripta el array',
        'Elimina NaN',
      ],
      correctIndex: 1,
      explanation: 'vectorize no magia de performance; prefiere ufuncs reales.',
    },
    {
      concept: 'memory-measure-tol-tests',
      question: 'np.allclose(a, b, rtol=..., atol=...) sirve para:',
      options: [
        'Comparar strings de rutas',
        'Probar equivalencia numérica con tolerancia (no igualdad bit a bit)',
        'Forzar copias',
        'Ordenar por memoria',
      ],
      correctIndex: 1,
      explanation: 'allclose es el test estándar con rtol/atol.',
    },
    {
      concept: 'memory-measure-tol-tests',
      question: 'arr.nbytes reporta:',
      options: [
        'El número de columnas de un CSV',
        'Bytes del buffer de datos del array (según dtype y size)',
        'El tiempo de CPU',
        'El hash git',
      ],
      correctIndex: 1,
      explanation: 'nbytes ≈ size × itemsize del buffer.',
    },
    {
      concept: 'memory-measure-tol-tests',
      question: 'En CP-N2-A, un test de métricas vectorizadas debe preferir:',
      options: [
        'Comparar con == estricto en floats siempre',
        'Fixtures sintéticas + allclose/asserts de shape y presupuesto de memoria documentado',
        'PII real de clientes',
        'Silenciar fallos con try/except vacío',
      ],
      correctIndex: 1,
      explanation: 'Datos sintéticos, tolerancia y contratos de forma/memoria.',
    },
  ],

  // === S15: Pandas: ingesta, selección y tipos (stdlib-deep) — V3 8×3 LANE-S14-S17-CLOSE ===
  'stdlib-deep': [
    {
      concept: 'series-dataframe-index',
      question: 'Un DataFrame de pandas se describe mejor como:',
      options: [
        'Un único ndarray sin etiquetas',
        'Una tabla 2D con columnas tipadas e Index de filas/columnas',
        'Solo un generador de archivos',
        'Un socket HTTP',
      ],
      correctIndex: 1,
      explanation: 'DF = columnas (Series) alineadas por Index.',
    },
    {
      concept: 'series-dataframe-index',
      question: 'Un Index estable en clientes sintéticos permite:',
      options: [
        'Borrar dtypes',
        'Re-alinear joins/selecciones de forma reproducible por etiqueta',
        'Evitar exportar CSV',
        'Forzar GPU',
      ],
      correctIndex: 1,
      explanation: 'El Index es la clave de alineación y repro.',
    },
    {
      concept: 'series-dataframe-index',
      question: 'pd.Series vs una lista de Python: la Series aporta principalmente:',
      options: [
        'Solo color en la terminal',
        'Etiquetas (index), dtype y operaciones vectorizadas alineadas',
        'Compilación a binario',
        'ORM automático',
      ],
      correctIndex: 1,
      explanation: 'Index + dtype + ops alineadas diferencian Series de list.',
    },
    {
      concept: 'read-csv-excel-parser',
      question: 'Al leer CSV de clientes/transacciones, dtype y parse_dates controlan:',
      options: [
        'El color del Excel',
        'Tipos y parseo de fechas en la ingesta (contrato del parser)',
        'La contraseña de la base',
        'El theme de Streamlit',
      ],
      correctIndex: 1,
      explanation: 'Opciones de parser fijan tipos y fechas al leer.',
    },
    {
      concept: 'read-csv-excel-parser',
      question: 'na_values en read_csv sirve para:',
      options: [
        'Ignorar el encoding',
        'Mapear sentinels de texto (p. ej. \'NA\',\'\') a missing de forma explícita',
        'Crear índices únicos siempre',
        'Comprimir a parquet',
      ],
      correctIndex: 1,
      explanation: 'Declara qué strings cuentan como ausentes.',
    },
    {
      concept: 'read-csv-excel-parser',
      question: 'read_excel vs read_csv en un pipeline de ingesta tipada:',
      options: [
        'Son idénticos en todos los bordes',
        'Comparten idea de dtypes/parse, pero engine, hojas y tipos por defecto difieren; hay que explicitar opciones',
        'Excel no admite columnas',
        'CSV no admite headers',
      ],
      correctIndex: 1,
      explanation: 'Misma disciplina de schema; APIs y defaults distintos.',
    },
    {
      concept: 'loc-iloc-filters-assign',
      question: 'df.loc filtra por:',
      options: [
        'Solo posición entera 0..n-1',
        'Etiquetas de índice/columnas (label-based)',
        'Hash MD5 del archivo',
        'Nombre del sheet siempre',
      ],
      correctIndex: 1,
      explanation: 'loc es por etiqueta; iloc por posición.',
    },
    {
      concept: 'loc-iloc-filters-assign',
      question: 'df.assign(col=...) se prefiere cuando:',
      options: [
        'Quieres mutar in-place sin rastro',
        'Quieres una expresión idiomática que devuelve DF con columnas derivadas sin chained assignment frágil',
        'Quieres borrar el índice',
        'Quieres ejecutar SQL',
      ],
      correctIndex: 1,
      explanation: 'assign encadena transformaciones de forma clara.',
    },
    {
      concept: 'loc-iloc-filters-assign',
      question: 'Filtro booleano df[df[\'region\']==\'Lima\'] selecciona:',
      options: [
        'Columnas numéricas al azar',
        'Filas que cumplen la condición',
        'Solo el header',
        'La metadata de parquet',
      ],
      correctIndex: 1,
      explanation: 'Máscara de filas por condición.',
    },
    {
      concept: 'chained-assignment-copy',
      question: 'SettingWithCopyWarning aparece típicamente cuando:',
      options: [
        'Exportas a JSON',
        'Encadenas indexaciones y asignas de forma ambigua (view vs copy)',
        'Usas pathlib',
        'Creas un venv',
      ],
      correctIndex: 1,
      explanation: 'Chained assignment es la causa clásica del warning.',
    },
    {
      concept: 'chained-assignment-copy',
      question: 'Para asignar de forma segura en un subconjunto de filas conviene:',
      options: [
        'df[mask][\'col\'] = x siempre',
        'Usar loc (o copy explícito + política clara) en una sola operación de indexación',
        'Asignar con eval de strings',
        'Borrar la columna y recrearla sin tests',
      ],
      correctIndex: 1,
      explanation: 'loc evita la ambigüedad del encadenamiento.',
    },
    {
      concept: 'chained-assignment-copy',
      question: '.copy() tras un filtro es útil para:',
      options: [
        'Acelerar siempre 10x',
        'Dejar ownership claro y evitar mutar el DF padre por accidente',
        'Cambiar el locale',
        'Firmar el parquet',
      ],
      correctIndex: 1,
      explanation: 'copy aclara semántica de mutación.',
    },
    {
      concept: 'strings-nullable-dates-cats',
      question: 'dtype string / StringDtype frente a object en columnas de texto:',
      options: [
        'Es cosmético sin impacto',
        'Da semántica de string más clara y mejor manejo de missing en pipelines modernos',
        'Borra acentos automáticamente',
        'Impide strip/casefold',
      ],
      correctIndex: 1,
      explanation: 'string dtype es el contrato moderno de texto.',
    },
    {
      concept: 'strings-nullable-dates-cats',
      question: 'Int64 nullable (mayúscula) permite:',
      options: [
        'Solo enteros sin NA jamás',
        'Enteros con <NA> sin upcast forzado a float por un missing',
        'Solo fechas',
        'Solo booleanos de numpy puro',
      ],
      correctIndex: 1,
      explanation: 'Nullable integers conservan enteros con ausencias.',
    },
    {
      concept: 'strings-nullable-dates-cats',
      question: 'category dtype conviene cuando:',
      options: [
        'Hay millones de valores únicos irrepetibles siempre',
        'Hay cardinalidad baja/repetida (regiones, estados) y quieres memoria/semántica de niveles',
        'Nunca hay joins',
        'El CSV no tiene header',
      ],
      correctIndex: 1,
      explanation: 'Categorías para valores repetidos con niveles estables.',
    },
    {
      concept: 'explicit-coercion-schema',
      question: 'pd.to_numeric(..., errors=\'coerce\') frente a errors=\'raise\':',
      options: [
        'Son iguales',
        'coerce convierte inválidos a NaN; raise falla el pipeline — elige según política y reporta',
        'coerce encripta',
        'raise borra el DF',
      ],
      correctIndex: 1,
      explanation: 'La política de error define cuarentena vs fail-fast.',
    },
    {
      concept: 'explicit-coercion-schema',
      question: 'Un schema dict de coerción en ingesta debe:',
      options: [
        'Vivir solo en un comentario oral',
        'Declarar tipos esperados, aplicarlos y listar fallos/coerciones',
        'Ignorar fechas',
        'Mezclar PII real en tests públicos',
      ],
      correctIndex: 1,
      explanation: 'Schema + reporte de coerciones es el gate de calidad de tipos.',
    },
    {
      concept: 'explicit-coercion-schema',
      question: 'astype sin validación previa en columnas sucias suele:',
      options: [
        'Ser siempre seguro',
        'Fallar o silenciar problemas si no hay estrategia de errores/reporte',
        'Crear índices únicos',
        'Optimizar joins m:m',
      ],
      correctIndex: 1,
      explanation: 'Coerción necesita política y evidencia de fallos.',
    },
    {
      concept: 'csv-parquet-excel-export',
      question: 'Exportar a Parquet vs CSV en un dataset analítico:',
      options: [
        'Parquet siempre pierde dtypes',
        'Parquet preserva mejor tipos/columnas; CSV es ubicuo pero frágil en tipos',
        'CSV es binario columnar',
        'Excel es el único formato reproducible',
      ],
      correctIndex: 1,
      explanation: 'Parquet para tipos; CSV para interoperabilidad con fricciones.',
    },
    {
      concept: 'csv-parquet-excel-export',
      question: 'to_csv(..., index=False) se usa cuando:',
      options: [
        'Quieres guardar el RangeIndex basura como columna de negocio siempre',
        'El índice no es parte del contrato de datos de negocio',
        'Quieres romper el header',
        'Quieres forzar multiindex',
      ],
      correctIndex: 1,
      explanation: 'Evita filtrar el índice artificial al exportar.',
    },
    {
      concept: 'csv-parquet-excel-export',
      question: 'Un export reproducible a 3 formatos (CSV/Parquet/Excel) debe verificar:',
      options: [
        'Solo el nombre del archivo',
        'Que columnas críticas y conteos de filas se preservan (reconciliación)',
        'Que el archivo pese 0 bytes',
        'Que contenga secretos de API',
      ],
      correctIndex: 1,
      explanation: 'Reconciliación de filas/columnas es el success criterion.',
    },
    {
      concept: 'index-format-provenance-memory',
      question: 'Un manifest de provenance de ingesta debería incluir al menos:',
      options: [
        'La contraseña del DBA',
        'Fuente, filas/columnas, dtypes o hash, timestamp y notas de coerción',
        'Solo el color del logo',
        'PII real de clientes',
      ],
      correctIndex: 1,
      explanation: 'Provenance habilita auditoría y repro del dataset.',
    },
    {
      concept: 'index-format-provenance-memory',
      question: 'memory_usage (y dtypes) ayudan a:',
      options: [
        'Enviar email',
        'Diagnosticar costos de memoria y oportunidades de tipado (category, downcast)',
        'Firmar commits',
        'Geocodificar',
      ],
      correctIndex: 1,
      explanation: 'Perfil de memoria guía optimización de tipos.',
    },
    {
      concept: 'index-format-provenance-memory',
      question: 'Documentar si el índice se exporta o no evita:',
      options: [
        'Usar pandas',
        'Ambigüedad en consumidores (columna fantasma vs clave de negocio)',
        'Leer Excel',
        'Usar Parquet',
      ],
      correctIndex: 1,
      explanation: 'Contrato de índice es parte del schema de entrega.',
    },
  ],

  // === S16: Calidad, limpieza y contratos de datos (wxpython-gui) — V3 8×3 LANE-S14-S17-CLOSE ===
  'wxpython-gui': [
    {
      concept: 'nulls-field-policies',
      question: 'Una política de null por campo define:',
      options: [
        'El color del NaN',
        'Si el campo es required/optional y qué hacer ante ausencia (reject, flag, default documentado)',
        'Solo el nombre del DataFrame',
        'La versión de Python',
      ],
      correctIndex: 1,
      explanation: 'Política explícita por campo; nada silencioso.',
    },
    {
      concept: 'nulls-field-policies',
      question: 'df[\'col\'].isna() se usa para:',
      options: [
        'Ordenar por hash',
        'Detectar ausencias según la semántica de missing de pandas',
        'Crear un GUI wx',
        'Compilar wheels',
      ],
      correctIndex: 1,
      explanation: 'isna es la base de conteos y cuarentena de nulls.',
    },
    {
      concept: 'nulls-field-policies',
      question: 'Tratar un null en un campo required como éxito silencioso es:',
      options: [
        'Best practice de calidad',
        'Incorrecto: debe fallar, flaggear o cuarentenar de forma explicable',
        'Obligatorio en Excel',
        'Equivalente a category dtype',
      ],
      correctIndex: 1,
      explanation: 'Required null = violación de contrato, no éxito.',
    },
    {
      concept: 'indicators-imputation-limits',
      question: 'Un indicador de ausencia (columna flag) sirve para:',
      options: [
        'Borrar el valor original siempre',
        'Conservar evidencia de que el valor fue missing aunque se impute o no',
        'Acelerar joins m:m',
        'Ocultar drift',
      ],
      correctIndex: 1,
      explanation: 'El indicador evita perder la historia del missing.',
    },
    {
      concept: 'indicators-imputation-limits',
      question: 'Límites de imputación existen para:',
      options: [
        'Imputar el 100% sin métricas',
        'Evitar rellenar de más y fabricar datos; más allá del cap → cuarentena/fail',
        'Reemplazar schema contracts',
        'Firmar el audit log',
      ],
      correctIndex: 1,
      explanation: 'Caps evitan \'arreglar\' en silencio volúmenes altos de missing.',
    },
    {
      concept: 'indicators-imputation-limits',
      question: 'Imputar la media global sin documentar ni marcar es problemático porque:',
      options: [
        'Es ilegal en todos los países',
        'Oculta ausencia y puede sesgar análisis; viola la regla de no fix silencioso',
        'Siempre es más lento que dropna',
        'Rompe UTF-8',
      ],
      correctIndex: 1,
      explanation: 'Imputación sin evidencia/métricas es opacidad.',
    },
    {
      concept: 'exact-vs-conflict-dups',
      question: 'Duplicado exacto vs conflicto de valores bajo la misma clave:',
      options: [
        'Son lo mismo siempre',
        'Exacto: filas idénticas; conflicto: misma clave, atributos distintos — requieren políticas distintas',
        'Conflicto solo existe en GUI',
        'Exacto implica fraude automático',
      ],
      correctIndex: 1,
      explanation: 'Clasificar dups evita drop ciego de conflictos.',
    },
    {
      concept: 'exact-vs-conflict-dups',
      question: 'df.duplicated() por defecto ayuda a detectar:',
      options: [
        'Solo tipos de columna',
        'Filas duplicadas según subset/keep policy configurada',
        'Outliers IQR',
        'Schema cross-field',
      ],
      correctIndex: 1,
      explanation: 'duplicated opera con subset y keep.',
    },
    {
      concept: 'exact-vs-conflict-dups',
      question: 'Ante dos filas misma cliente_id y montos distintos, la acción correcta es:',
      options: [
        'Promediar en silencio y borrar evidencia',
        'Clasificar como conflicto, cuarentenar o resolver con política y conservar evidencia',
        'Asumir que la segunda siempre gana sin log',
        'Convertir a string y continuar',
      ],
      correctIndex: 1,
      explanation: 'Conflictos no se \'arreglan\' sin rastro.',
    },
    {
      concept: 'keys-cardinality-evidence',
      question: 'Al resolver duplicados de clave, conservar evidencia significa:',
      options: [
        'Borrar el raw y dejar solo el ganador sin log',
        'Registrar filas descartadas/conflicto, regla aplicada y conteos en audit/cuarentena',
        'Imprimir un emoji',
        'Subir PII a un gist público',
      ],
      correctIndex: 1,
      explanation: 'Audit trail de la resolución de claves.',
    },
    {
      concept: 'keys-cardinality-evidence',
      question: 'Cardinalidad 1:1 esperada que resulta 1:m indica:',
      options: [
        'Éxito de marketing',
        'Posible fan-out/duplicación de clave; hay que investigar antes de agregar',
        'Que Parquet falló',
        'Que el GUI crasheó',
      ],
      correctIndex: 1,
      explanation: 'Cardinalidad rota es señal de calidad de claves.',
    },
    {
      concept: 'keys-cardinality-evidence',
      question: 'Cuarentenar dups de clave en vez de drop silencioso permite:',
      options: [
        'Ocultar métricas',
        'Reproceso, revisión y métricas de pérdida explicables',
        'Evitar tests',
        'Saltar schema',
      ],
      correctIndex: 1,
      explanation: 'Cuarentena = fail explicable + reproceso.',
    },
    {
      concept: 'normalize-strings-nums-dates-cats',
      question: 'Normalizar strings (strip/casefold) sin borrar el original es útil para:',
      options: [
        'Perder evidencia de captura',
        'Comparar/keys estables manteniendo raw para auditoría',
        'Forzar float64',
        'Eliminar fechas',
      ],
      correctIndex: 1,
      explanation: 'Raw + normalizado = trazabilidad.',
    },
    {
      concept: 'normalize-strings-nums-dates-cats',
      question: 'Parsear montos con locale (coma decimal) incorrecto produce:',
      options: [
        'Siempre el mismo float',
        'Errores o valores sesgados; hay que fijar reglas de decimal/separador',
        'Categorías automáticas',
        'Índices MultiIndex',
      ],
      correctIndex: 1,
      explanation: 'Locale/decimal es parte del contrato numérico.',
    },
    {
      concept: 'normalize-strings-nums-dates-cats',
      question: 'Mapear categorías (p. ej. regiones) con cat map documentado evita:',
      options: [
        'Usar pandas',
        'Sinónimos no controlados que rompen groupbys y contratos',
        'Exportar CSV',
        'Leer Excel',
      ],
      correctIndex: 1,
      explanation: 'Mapas de categorías estabilizan niveles.',
    },
    {
      concept: 'outliers-plausible-vs-error',
      question: 'Un outlier plausible vs error de captura se distinguen por:',
      options: [
        'El color del chart',
        'Reglas de dominio + métodos (IQR/z) + decisión flag vs drop documentada',
        'Siempre drop automático',
        'Siempre keep sin flag',
      ],
      correctIndex: 1,
      explanation: 'Dominio + estadística + política de flag/drop.',
    },
    {
      concept: 'outliers-plausible-vs-error',
      question: 'Marcar (flag) un outlier en vez de borrarlo permite:',
      options: [
        'Mentir en totales',
        'Análisis sensible a extremos y auditoría de exclusiones',
        'Evitar metrics',
        'Romper el schema a propósito',
      ],
      correctIndex: 1,
      explanation: 'Flag conserva la opción analítica.',
    },
    {
      concept: 'outliers-plausible-vs-error',
      question: 'Un monto negativo en un campo que solo admite ≥0 es:',
      options: [
        'Outlier plausible de mercado siempre',
        'Más bien error de dominio/captura → cuarentena o corrección con evidencia',
        'Prueba de broadcasting',
        'Señal de parentesco',
      ],
      correctIndex: 1,
      explanation: 'Bounds de dominio detectan errores, no solo rarezas.',
    },
    {
      concept: 'schema-crossfield-rules',
      question: 'Una regla cross-field ejemplo válida es:',
      options: [
        'El logo debe ser azul',
        'fecha_fin >= fecha_inicio; monto_igv coherente con base imponible según política',
        'El DF no puede tener nombre',
        'Prohibir Parquet',
      ],
      correctIndex: 1,
      explanation: 'Cross-field valida relaciones entre columnas.',
    },
    {
      concept: 'schema-crossfield-rules',
      question: 'Un contrato de schema ante drift de columnas debe:',
      options: [
        'Renombrar en silencio sin métricas',
        'Fallar de forma explicable (expect/assert) y reportar el drift',
        'Rellenar columnas nuevas con PII',
        'Ignorar tipos',
      ],
      correctIndex: 1,
      explanation: 'Schema drift = fail explicable, no fix silencioso.',
    },
    {
      concept: 'schema-crossfield-rules',
      question: 'Implementar expects/validaciones de schema en la suite de calidad:',
      options: [
        'Es opcional cosmético',
        'Es el corazón del gate: rompe el pipeline con mensaje accionable',
        'Solo sirve en wxPython',
        'Reemplaza la necesidad de audit trail',
      ],
      correctIndex: 1,
      explanation: 'Contracts son ejecutable, no adorno.',
    },
    {
      concept: 'metrics-quarantine-audit',
      question: 'Una cuarentena de calidad debe incluir:',
      options: [
        'Solo un print \'error\'',
        'Filas/campos fallidos, razón, métricas de pérdida y enlace a audit trail',
        'PII real en claro en Slack público',
        'Borrado del raw de origen siempre',
      ],
      correctIndex: 1,
      explanation: 'Cuarentena accionable + métricas + audit.',
    },
    {
      concept: 'metrics-quarantine-audit',
      question: 'Métricas de pérdida (filas/campos rechazados) sirven para:',
      options: [
        'Decorar el README',
        'Cuantificar impacto del gate y detectar regresiones de calidad',
        'Ocultar conflictos de dups',
        'Evitar timestamps',
      ],
      correctIndex: 1,
      explanation: 'Pérdida medible = calidad operable.',
    },
    {
      concept: 'metrics-quarantine-audit',
      question: 'Audit trail sintético en demos del curso debe:',
      options: [
        'Incluir secretos de producción',
        'Registrar acciones y razones con datos sintéticos; sin PII real',
        'Ser un PDF escaneado ilegible',
        'Sobrescribir el schema contract',
      ],
      correctIndex: 1,
      explanation: 'Auditoría con fixtures sintéticas y razones claras.',
    },
  ],

  // === S17: Joins, reshape, groupby y cierre analítico (packaging) — V3 8×3 LANE-S14-S17-CLOSE ===
  'packaging': [
    {
      concept: 'keys-cardinality-joins',
      question: 'Antes de un merge clientes↔transacciones debes validar:',
      options: [
        'Solo el color del chart',
        'Claves, unicidad esperada y cardinalidad (1:1, 1:m, m:m)',
        'Que no exista header',
        'Que el DF esté vacío',
      ],
      correctIndex: 1,
      explanation: 'Cardinalidad de claves define el join correcto.',
    },
    {
      concept: 'keys-cardinality-joins',
      question: 'how=\'left\' en merge conserva:',
      options: [
        'Solo la intersección',
        'Todas las filas de la izquierda y matches de la derecha (NaN si no hay match)',
        'Solo la derecha',
        'Ninguna fila',
      ],
      correctIndex: 1,
      explanation: 'Left join preserva el lado izquierdo.',
    },
    {
      concept: 'keys-cardinality-joins',
      question: 'Un join m:m no controlado suele producir:',
      options: [
        'Siempre menos filas',
        'Fan-out (explosión de filas) y totales inflados si no se valida',
        'Schemas más estrictos',
        'Parquet inválido',
      ],
      correctIndex: 1,
      explanation: 'm:m sin control infla filas y métricas.',
    },
    {
      concept: 'validate-dup-antijoin',
      question: 'validate=\'one_to_one\' en merge pandas:',
      options: [
        'Ignora duplicados',
        'Falla si la cardinalidad no es 1:1 — protege de fan-out accidental',
        'Convierte a category',
        'Ordena por fecha',
      ],
      correctIndex: 1,
      explanation: 'validate documenta y enforza cardinalidad.',
    },
    {
      concept: 'validate-dup-antijoin',
      question: 'Un anti-join (filas de A sin match en B) se usa para:',
      options: [
        'Duplicar A',
        'Detectar huérfanos / cobertura incompleta entre tablas',
        'Calcular rolling mean',
        'Exportar a wheel',
      ],
      correctIndex: 1,
      explanation: 'Anti-join = no matcheados.',
    },
    {
      concept: 'validate-dup-antijoin',
      question: 'indicator=True en merge ayuda a:',
      options: [
        'Encriptar claves',
        'Etiquetar left_only/right_only/both para auditoría de cobertura',
        'Borrar NaN',
        'Crear MultiIndex de fechas',
      ],
      correctIndex: 1,
      explanation: 'indicator facilita anti-joins y reportes.',
    },
    {
      concept: 'concat-melt-pivot',
      question: 'pd.concat apila principalmente:',
      options: [
        'Solo strings de paths',
        'DataFrames a lo largo de un eje (filas/columnas) con align de columnas',
        'Sockets',
        'Modelos sklearn',
      ],
      correctIndex: 1,
      explanation: 'concat combina objetos a lo largo de axis.',
    },
    {
      concept: 'concat-melt-pivot',
      question: 'melt (wide→long) es útil cuando:',
      options: [
        'Quieres más columnas rígidas siempre',
        'Tienes métricas en columnas y necesitas filas (variable, valor) para groupby/plots',
        'Quieres borrar el índice siempre',
        'Evitas cualquier reshape',
      ],
      correctIndex: 1,
      explanation: 'melt normaliza a formato largo.',
    },
    {
      concept: 'concat-melt-pivot',
      question: 'pivot_table frente a datos con duplicados de índice de pivote:',
      options: [
        'Siempre falla sin opciones',
        'Agrega según aggfunc; hay que elegir función y manejar NaN conscientemente',
        'Elimina la necesidad de claves',
        'Convierte a NumPy matrix opaca',
      ],
      correctIndex: 1,
      explanation: 'pivot_table agrega; define aggfunc.',
    },
    {
      concept: 'long-wide-stable-names',
      question: 'Nombres estables post-reshape evitan:',
      options: [
        'Usar pandas',
        'Romper consumidores que dependen de columnas contractuales',
        'Leer CSV',
        'Hacer groupby',
      ],
      correctIndex: 1,
      explanation: 'Schema de columnas es API de datos.',
    },
    {
      concept: 'long-wide-stable-names',
      question: 'Tras pivot, columnas MultiIndex suelen requerir:',
      options: [
        'Borrar el DF',
        'Aplanar/renombrar a nombres estables de una sola capa si el contrato lo exige',
        'Convertir a wx widgets',
        'Ignorar dtypes',
      ],
      correctIndex: 1,
      explanation: 'Aplanar MultiIndex estabiliza el schema.',
    },
    {
      concept: 'long-wide-stable-names',
      question: 'Cambiar \'monto_soles\' a \'col_3\' tras un melt es:',
      options: [
        'Buena API pública',
        'Mala práctica: rompe contratos; usa nombres semánticos estables',
        'Obligatorio en Parquet',
        'Requerido por groupby',
      ],
      correctIndex: 1,
      explanation: 'Nombres semánticos estables > genéricos frágiles.',
    },
    {
      concept: 'groupby-agg-transform',
      question: 'groupby(...).agg({...}) se usa para:',
      options: [
        'Solo filtrar nulls',
        'Agregar con funciones distintas por columna de forma explícita',
        'Hacer anti-join',
        'Leer Excel sheets',
      ],
      correctIndex: 1,
      explanation: 'agg dict declara métricas por columna.',
    },
    {
      concept: 'groupby-agg-transform',
      question: 'transform frente a agg:',
      options: [
        'Son idénticos',
        'transform devuelve resultado alineado al índice original (misma forma de filas); agg reduce grupos',
        'transform solo ordena',
        'agg no acepta sum',
      ],
      correctIndex: 1,
      explanation: 'transform reinyecta; agg colapsa.',
    },
    {
      concept: 'groupby-agg-transform',
      question: 'Calcular % del total del grupo por fila se hace idiomáticamente con:',
      options: [
        'Solo melt sin groupby',
        'groupby + transform (p. ej. x / x.sum())',
        'anti-join',
        'np.newaxis en strings',
      ],
      correctIndex: 1,
      explanation: 'transform alinea el denominador del grupo a cada fila.',
    },
    {
      concept: 'windows-dates-cohorts',
      question: 'Una cohorte temporal típica etiqueta clientes por:',
      options: [
        'Color favorito',
        'Periodo de primera actividad/evento (p. ej. mes de alta) para análisis de retención',
        'Hash del hostname',
        'Número de columnas del DF',
      ],
      correctIndex: 1,
      explanation: 'Cohortes = buckets temporales de entrada.',
    },
    {
      concept: 'windows-dates-cohorts',
      question: 'rolling/window en series temporales sirve para:',
      options: [
        'Borrar fechas',
        'Suavizar o agregar en ventanas móviles con índice temporal ordenado',
        'Validar 1:1 joins',
        'Crear wheels',
      ],
      correctIndex: 1,
      explanation: 'Ventanas móviles sobre tiempo ordenado.',
    },
    {
      concept: 'windows-dates-cohorts',
      question: 'resample requiere típicamente:',
      options: [
        'Index no datetime',
        'Índice datetime-like y frecuencia explícita',
        'Solo strings de región',
        'validate=\'m:m\'',
      ],
      correctIndex: 1,
      explanation: 'resample opera sobre tiempo indexado.',
    },
    {
      concept: 'denominators-totals',
      question: 'Reconciliar totales desagregados vs total control implica:',
      options: [
        'Asumir igualdad sin check',
        'Comparar sumas/conteos puente y explicar gaps (filtro, join, nulls)',
        'Borrar el control',
        'Ocultar denominadores',
      ],
      correctIndex: 1,
      explanation: 'Bridge de totales con explicación de gaps.',
    },
    {
      concept: 'denominators-totals',
      question: 'Un denominador incorrecto en una tasa (p. ej. activos/total) produce:',
      options: [
        'Solo un warning de lint',
        'Métricas de negocio engañosas; hay que fijar población y filtros',
        'Mejor performance',
        'Anti-joins más rápidos',
      ],
      correctIndex: 1,
      explanation: 'Denominador = definición de población.',
    },
    {
      concept: 'denominators-totals',
      question: 'Tablas puente (bridge) en reconciliación sirven para:',
      options: [
        'Decorar Excel',
        'Explicar de-a pasos entre total fuente y total reportado',
        'Encriptar montos',
        'Evitar groupby',
      ],
      correctIndex: 1,
      explanation: 'Bridge documenta cada ajuste del total.',
    },
    {
      concept: 'temporal-leakage-controls',
      question: 'Leakage temporal en un agregado de features ocurre cuando:',
      options: [
        'Usas datos sintéticos',
        'Usas información posterior al cutoff de predicción/decisión',
        'Exportas a CSV',
        'Documentas el schema',
      ],
      correctIndex: 1,
      explanation: 'Futuro filtrándose al pasado = leakage.',
    },
    {
      concept: 'temporal-leakage-controls',
      question: 'Un control before/after honesto exige:',
      options: [
        'Mezclar train/test al azar con fechas futuras',
        'Cutoff explícito y solo datos ≤ cutoff en features del periodo',
        'Ignorar timestamps',
        'Imputar el futuro con la media global sin flag',
      ],
      correctIndex: 1,
      explanation: 'Cutoff estricto evita mirar el futuro.',
    },
    {
      concept: 'temporal-leakage-controls',
      question: 'as-of / merges temporales ordenados ayudan a:',
      options: [
        'Romper la cardinalidad a propósito',
        'Traer el último estado conocido sin usar filas futuras indebidas',
        'Eliminar la necesidad de índices',
        'Saltar reconciliación de totales',
      ],
      correctIndex: 1,
      explanation: 'Joins as-of respetan el tiempo.',
    },
  ],

  // === Section 18: EDA e incertidumbre V3 (platform id data-engineering) ===
  'data-engineering': [
    {
      concept: 'center-spread-quantiles',
      question: 'Para resumir montos de tickets sintéticos con cola larga, ¿qué trío reportas primero?',
      options: [
        'Solo la media y el máximo',
        'n, centro (media/mediana), dispersión (std/IQR) y cuantiles clave (p25/p50/p75)',
        'Únicamente el modo de la variable categórica',
        'El hash del archivo CSV sin estadísticas',
      ],
      correctIndex: 1,
      explanation: 'Un resumen honesto combina tamaño muestral, centro, dispersión y cuantiles.',
    },
    {
      concept: 'center-spread-quantiles',
      question: 'En numpy/pandas, IQR se define como:',
      options: [
        'media − mediana',
        'Q3 − Q1 (p75 − p25)',
        'máximo − mínimo siempre dividido entre 2',
        'std con ddof=0',
      ],
      correctIndex: 1,
      explanation: 'IQR = diferencia entre cuartil 3 y 1; es robusto a extremos.',
    },
    {
      concept: 'center-spread-quantiles',
      question: 'Si reportas std muestral de montos, ¿qué ddof conviene documentar?',
      options: [
        'ddof no importa nunca',
        'ddof=1 (n−1) para muestra; documentar si usas ddof=0 (población)',
        'Siempre ddof=2 por convención bancaria',
        'ddof igual al número de columnas',
      ],
      correctIndex: 1,
      explanation: 'ddof define el divisor; en muestra usualmente n−1.',
    },
    {
      concept: 'robust-metrics-scales',
      question: 'Ante outliers en montos PEN sintéticos, ¿qué métricas son más robustas?',
      options: [
        'Media y varianza muestral sin más',
        'Mediana, IQR y MAD frente a media/std clásicas',
        'Solo el máximo absoluto',
        'El conteo de NaN como único resumen',
      ],
      correctIndex: 1,
      explanation: 'Mediana/IQR/MAD resisten valores extremos mejor que media/std.',
    },
    {
      concept: 'robust-metrics-scales',
      question: 'Elegir escala log en un histograma de montos sesgados sirve para:',
      options: [
        'Garantizar causalidad',
        'Comprimir cola y ver estructura sin mentir sobre el dominio original',
        'Eliminar la necesidad de n',
        'Convertir la variable en categórica',
      ],
      correctIndex: 1,
      explanation: 'La escala debe ser honesta: log ayuda a ver forma, no borra unidades.',
    },
    {
      concept: 'robust-metrics-scales',
      question: '¿Cuándo la media es engañosa como único centro?',
      options: [
        'Siempre que n>10',
        'Cuando hay asimetría fuerte u outliers que la arrastran',
        'Solo si la mediana es mayor que 0',
        'Nunca; la media siempre basta',
      ],
      correctIndex: 1,
      explanation: 'Con colas/outliers la media se mueve; reporta también mediana.',
    },
    {
      concept: 'population-sample-bias',
      question: 'Un dashboard solo con tickets de Lima sintéticos se presenta como “Perú”. El sesgo principal es:',
      options: [
        'Error de redondeo de float',
        'Sesgo de cobertura/población: la muestra no representa el marco pretendido',
        'Correlación espuria entre índices',
        'Falta de parquet',
      ],
      correctIndex: 1,
      explanation: 'Generalizar más allá del marco muestral es sesgo de población/cobertura.',
    },
    {
      concept: 'population-sample-bias',
      question: '¿Qué documentas al declarar el marco muestral?',
      options: [
        'Solo el color del chart',
        'Población objetivo, criterios de inclusión/exclusión, periodo y n final',
        'Únicamente el nombre del notebook',
        'La versión de Node.js',
      ],
      correctIndex: 1,
      explanation: 'El marco define a quién aplican las conclusiones.',
    },
    {
      concept: 'population-sample-bias',
      question: 'Muestreo por conveniencia (solo filas fáciles de obtener) suele introducir:',
      options: [
        'Garantía de representatividad',
        'Sesgo de selección que limita la validez externa',
        'Intervalos más estrechos siempre correctos',
        'Causalidad automática',
      ],
      correctIndex: 1,
      explanation: 'Conveniencia ≠ aleatorio; limita generalización.',
    },
    {
      concept: 'intervals-effect-size',
      question: 'Además del p-valor (si lo usas), un reporte EDA básico debería incluir:',
      options: [
        'Solo “significativo” sin números',
        'Estimación del efecto e intervalo/incertidumbre razonable (p. ej. IC o rango bootstrap simple)',
        'Únicamente el logo de la empresa',
        'El stack trace completo',
      ],
      correctIndex: 1,
      explanation: 'Tamaño de efecto + incertidumbre comunican magnitud, no solo “sí/no”.',
    },
    {
      concept: 'intervals-effect-size',
      question: 'Un intervalo de confianza al 95% (interpretación frecuente de aula) se usa para:',
      options: [
        'Probar causalidad por sí solo',
        'Cuantificar incertidumbre del estimador bajo supuestos declarados',
        'Reemplazar n y el diseño muestral',
        'Garantizar que el próximo dato caiga dentro',
      ],
      correctIndex: 1,
      explanation: 'El IC resume incertidumbre del estimador; no implica causalidad.',
    },
    {
      concept: 'intervals-effect-size',
      question: 'Si n es muy pequeño, ¿qué actitud es correcta?',
      options: [
        'Afirmar precisión milimétrica',
        'Declarar alta incertidumbre y evitar sobreclaim en decisiones',
        'Ocultar n en el apéndice',
        'Multiplicar el efecto por 10',
      ],
      correctIndex: 1,
      explanation: 'n bajo ⇒ incertidumbre alta; el lenguaje debe ser cauto.',
    },
    {
      concept: 'correlation-confounds',
      question: 'Una correlación alta entre publicidad y ventas sintéticas implica:',
      options: [
        'Causalidad demostrada al 100%',
        'Asociación lineal; no prueba causalidad (pueden existir confusores)',
        'Que el dataset está vacío',
        'Que hay que borrar una variable siempre',
      ],
      correctIndex: 1,
      explanation: 'Correlación ≠ causalidad; hay que considerar confusores.',
    },
    {
      concept: 'correlation-confounds',
      question: 'Un confusor es una variable que:',
      options: [
        'Solo aparece en el título del chart',
        'Afecta a X e Y y puede generar asociación espuria o distorsionar el efecto',
        'Siempre es el índice del DataFrame',
        'Solo existe en PDF',
      ],
      correctIndex: 1,
      explanation: 'Confusores distorsionan la lectura causal de una asociación.',
    },
    {
      concept: 'correlation-confounds',
      question: 'Antes de hablar de “impulsa” o “causa” en un EDA, debes:',
      options: [
        'Cambiar el color a rojo',
        'Limitar el claim a asociación y discutir diseño/confusores/límites',
        'Eliminar todos los cuantiles',
        'Usar solo la media',
      ],
      correctIndex: 1,
      explanation: 'El lenguaje causal exige diseño y evidencia más allá de r.',
    },
    {
      concept: 'segments-anomalies-no-causal',
      question: 'Al marcar anomalías por regla (p. ej. > Q3+1.5·IQR), debes:',
      options: [
        'Llamarlas fraude sin más evidencia',
        'Documentar el umbral, n de flags y que no implica causa',
        'Borrarlas siempre del dataset sin registro',
        'Convertirlas en media global',
      ],
      correctIndex: 1,
      explanation: 'Anomalía estadística ≠ explicación causal; documenta regla y límites.',
    },
    {
      concept: 'segments-anomalies-no-causal',
      question: 'Segmentar por región (Lima/Arequipa/Cusco sintético) sirve para:',
      options: [
        'Probar que una región causa a la otra',
        'Comparar distribuciones/tasas con n y límites por segmento',
        'Evitar reportar incertidumbre',
        'Garantizar muestra equitativa automática',
      ],
      correctIndex: 1,
      explanation: 'La segmentación describe heterogeneidad; no demuestra causalidad.',
    },
    {
      concept: 'segments-anomalies-no-causal',
      question: 'Si un segmento tiene n=3, ¿qué haces al comunicar?',
      options: [
        'Publicas ranking definitivo de “mejores”',
        'Marcas inestabilidad por n bajo y evitas rankings rígidos',
        'Imputas 1000 filas fake sin decirlo',
        'Ocultas el segmento',
      ],
      correctIndex: 1,
      explanation: 'n bajo hace estimaciones inestables; sé explícito.',
    },
    {
      concept: 'questions-hypotheses-evidence',
      question: 'Una buena pregunta de EDA se formula como:',
      options: [
        '“Explorar todo el CSV sin objetivo”',
        'Pregunta acotada + hipótesis comprobable + evidencia (cálculo) y no-hallazgo si aplica',
        'Solo el nombre del archivo',
        'Una lista de librerías instaladas',
      ],
      correctIndex: 1,
      explanation: 'Pregunta → hipótesis → evidencia evita tourism de datos.',
    },
    {
      concept: 'questions-hypotheses-evidence',
      question: 'Si la evidencia no sostiene la hipótesis, el resultado correcto es:',
      options: [
        'Forzar el gráfico hasta que “se vea”',
        'Reportar no-hallazgo o evidencia insuficiente con límites',
        'Borrar el notebook',
        'Cambiar la pregunta en silencio',
      ],
      correctIndex: 1,
      explanation: 'No-hallazgos honestos son parte del EDA profesional.',
    },
    {
      concept: 'questions-hypotheses-evidence',
      question: 'Cada conclusión del notebook debería:',
      options: [
        'Evitar citar el cálculo',
        'Referenciar el cálculo/tabla que la sostiene y declarar incertidumbre',
        'Usar solo adjetivos sin números',
        'Depender de un screenshot no versionado',
      ],
      correctIndex: 1,
      explanation: 'Trazabilidad: conclusión ↔ cálculo ↔ incertidumbre.',
    },
    {
      concept: 'repro-notebook-data-notes',
      question: 'Un data note mínimo para CP-N2-B incluye:',
      options: [
        'Solo el nombre del analista',
        'Origen, fecha de corte, filtros, n pre/post, seed y exclusiones',
        'Únicamente el DPI del PNG',
        'La contraseña de la base',
      ],
      correctIndex: 1,
      explanation: 'Data notes hacen reproducible y auditable el pipeline de evidencia.',
    },
    {
      concept: 'repro-notebook-data-notes',
      question: 'Para reproducir un EDA, lo prioritario es:',
      options: [
        'Dependencias/seed/filtros versionados y script reejecutable',
        'Un color corporativo exacto',
        'Desactivar todos los asserts',
        'Mezclar datos reales de clientes sin consentimiento',
      ],
      correctIndex: 1,
      explanation: 'Reproducibilidad = código + datos sintéticos/versionados + seed/filtros.',
    },
    {
      concept: 'repro-notebook-data-notes',
      question: '¿Por qué fijar seed en datos sintéticos del notebook?',
      options: [
        'Para encriptar el PDF',
        'Para que cifras y figuras se regeneren de forma estable en revisiones',
        'Para ocultar n',
        'Para eliminar la mediana',
      ],
      correctIndex: 1,
      explanation: 'Seed estable permite revisión y diff de resultados.',
    },
  ],

  // === Section 19: Visualización accesible V3 (platform id databases-orm) ===
  'databases-orm': [
    {
      concept: 'question-audience-chart',
      question: 'El primer criterio al elegir un chart es:',
      options: [
        'La librería más nueva del mes',
        'La pregunta analítica y la audiencia (qué decisión habilita)',
        'Usar siempre 3D pie charts',
        'El color favorito del sponsor',
      ],
      correctIndex: 1,
      explanation: 'Chart choice sigue a pregunta + audiencia, no a moda de librería.',
    },
    {
      concept: 'question-audience-chart',
      question: 'Para comparar magnitudes entre pocas categorías, suele ser preferible:',
      options: [
        'Un pie 3D con explosión',
        'Barras/columnas con eje cero honesto',
        'Un mapa de calor de 200 colores sin leyenda',
        'Solo un word cloud',
      ],
      correctIndex: 1,
      explanation: 'Barras facilitan comparación de magnitudes.',
    },
    {
      concept: 'question-audience-chart',
      question: 'Si la audiencia es no técnica y la pregunta es “¿cómo cambió en el tiempo?”:',
      options: [
        'Un scatter de 12 dimensiones',
        'Una serie temporal/línea clara con unidades y periodo',
        'Una tabla sin título ni fuente',
        'Un radar chart denso por defecto',
      ],
      correctIndex: 1,
      explanation: 'Series temporales responden a cambio en el tiempo con claridad.',
    },
    {
      concept: 'axes-scales-encodings',
      question: 'Truncar el eje Y en un bar chart de montos sin avisar es problemático porque:',
      options: [
        'Acelera el render de Plotly',
        'Puede exagerar diferencias y engañar a la audiencia',
        'Mejora el contraste WCAG siempre',
        'Obliga a usar log',
      ],
      correctIndex: 1,
      explanation: 'Ejes/escalas deshonestas distorsionan el mensaje.',
    },
    {
      concept: 'axes-scales-encodings',
      question: 'Un encoding visual honesto implica:',
      options: [
        'Mapear variables a canal visual sin distorsión injustificada y con leyenda clara',
        'Usar el mismo color para todo sin leyenda',
        'Animar siempre a 60 fps',
        'Ocultar unidades',
      ],
      correctIndex: 1,
      explanation: 'Encoding = canal visual alineado a la variable y legible.',
    },
    {
      concept: 'axes-scales-encodings',
      question: 'Escala log en eje de montos debe acompañarse de:',
      options: [
        'Silencio total al lector',
        'Etiquetado explícito de escala y cuidado al interpretar diferencias',
        'Eliminar ticks',
        'Convertir a pie chart',
      ],
      correctIndex: 1,
      explanation: 'La escala log no es “gratis”: hay que etiquetarla.',
    },
    {
      concept: 'matplotlib-seaborn',
      question: 'En Matplotlib/Seaborn para un deliverable estático reproducible, conviene:',
      options: [
        'Dejar el estado global sucio entre figuras',
        'Función build_figure() con datos de entrada y savefig controlado',
        'Solo screenshots manuales del IDE',
        'Hardcodear rutas de /Users/de/otro',
      ],
      correctIndex: 1,
      explanation: 'Figuras como funciones puras facilitan tests y re-export.',
    },
    {
      concept: 'matplotlib-seaborn',
      question: 'Seaborn se usa típicamente para:',
      options: [
        'Reemplazar SQLAlchemy',
        'API de alto nivel sobre Matplotlib para distribuciones/relaciones',
        'Servir WebSockets',
        'Compilar wheels',
      ],
      correctIndex: 1,
      explanation: 'Seaborn = estadística visual de alto nivel sobre MPL.',
    },
    {
      concept: 'matplotlib-seaborn',
      question: 'Antes de plt.show() en un pipeline batch, lo robusto es:',
      options: [
        'Depender siempre de un display interactivo',
        'savefig a path versionado y cerrar la figura',
        'Nunca exportar PNG',
        'Imprimir solo el objeto Artist',
      ],
      correctIndex: 1,
      explanation: 'Batch confiable exporta archivos, no solo ventanas interactivas.',
    },
    {
      concept: 'composition-annotations-export',
      question: 'Una figura “lista para comité” suele incluir:',
      options: [
        'Solo puntos sin título',
        'Título, ejes con unidades, anotaciones clave y exportación con DPI/path fijos',
        'Watermark ilegible a 20px',
        'Diez leyendas superpuestas',
      ],
      correctIndex: 1,
      explanation: 'Composición + anotaciones + export reproducible = entrega profesional.',
    },
    {
      concept: 'composition-annotations-export',
      question: 'Anotar un valor atípico en el chart sirve para:',
      options: [
        'Ocultar el outlier',
        'Guiar la lectura sin reemplazar la tabla/fuente de evidencia',
        'Eliminar el eje X',
        'Probar causalidad',
      ],
      correctIndex: 1,
      explanation: 'Annotations orientan; la evidencia sigue en datos/tabla.',
    },
    {
      concept: 'composition-annotations-export',
      question: 'Exportar con DPI y nombre de archivo versionado ayuda a:',
      options: [
        'Romper el dashboard',
        'Trazar qué figura entró al informe y regenerarla',
        'Evitar alt text',
        'Cambiar la escala en secreto',
      ],
      correctIndex: 1,
      explanation: 'Versionado de artefactos visuales es provenance.',
    },
    {
      concept: 'plotly-filters-tooltips',
      question: 'En Plotly, filtros y tooltips deben:',
      options: [
        'Mostrar IDs internos crípticos sin contexto',
        'Aclarar unidades/periodo y no inventar precisión falsa',
        'Desactivar toda leyenda',
        'Forzar pie 3D',
      ],
      correctIndex: 1,
      explanation: 'Interactividad no exime de claridad y honestidad numérica.',
    },
    {
      concept: 'plotly-filters-tooltips',
      question: 'Un filtro de región en dashboard sintético debe:',
      options: [
        'Recalcular sin indicar n del subconjunto',
        'Actualizar la vista y preferiblemente exponer n/periodo del filtro activo',
        'Borrar la fuente de datos del pie de página',
        'Cambiar unidades sin aviso',
      ],
      correctIndex: 1,
      explanation: 'El estado del filtro es parte del mensaje analítico.',
    },
    {
      concept: 'plotly-filters-tooltips',
      question: 'Tooltips densos con 30 campos suelen:',
      options: [
        'Mejorar siempre a11y',
        'Saturar; prioriza campos que responden la pregunta',
        'Reemplazar el data note',
        'Garantizar contraste',
      ],
      correctIndex: 1,
      explanation: 'Menos ruido: tooltips al servicio de la pregunta.',
    },
    {
      concept: 'state-perf-a11y-alts',
      question: 'Una alternativa accesible a un chart complejo es:',
      options: [
        'Solo color sin texto',
        'Tabla/resumen textual con las mismas cifras clave',
        'Animación automática infinita',
        'Canvas sin semántica',
      ],
      correctIndex: 1,
      explanation: 'a11y: equivalente no visual (tabla/texto) con la evidencia.',
    },
    {
      concept: 'state-perf-a11y-alts',
      question: 'Performance en vistas Plotly grandes se cuida con:',
      options: [
        'Cargar 5M puntos sin muestreo siempre',
        'Agregación/muestreo consciente, lazy load y límites documentados',
        'Desactivar el garbage collector de Python',
        'Usar print en cada hover',
      ],
      correctIndex: 1,
      explanation: 'Escala con agregación y límites, no con “todo crudo” por defecto.',
    },
    {
      concept: 'state-perf-a11y-alts',
      question: 'Estado del dashboard (filtros activos) debe ser:',
      options: [
        'Invisible al usuario',
        'Explícito (chips/labels) para no interpretar mal la figura',
        'Guardado solo en un comentario HTML',
        'Aleatorio en cada refresh',
      ],
      correctIndex: 1,
      explanation: 'Estado visible evita lecturas incorrectas.',
    },
    {
      concept: 'units-source-limits',
      question: 'Todo chart de entrega debe declarar al menos:',
      options: [
        'Solo el framework UI',
        'Unidades, fuente/origen y limitaciones (cobertura, n, periodo)',
        'El tema de VS Code',
        'La IP del servidor',
      ],
      correctIndex: 1,
      explanation: 'Unidades + fuente + límites cierran el claim visual.',
    },
    {
      concept: 'units-source-limits',
      question: 'Si la fuente es un extracto sintético al 2026-03-01, debes:',
      options: [
        'Decir “datos en tiempo real globales”',
        'Citar corte y que es sintético/demo si aplica',
        'Ocultar la fecha',
        'Usar solo “confidencial” sin más',
      ],
      correctIndex: 1,
      explanation: 'Provenance temporal y naturaleza de los datos son obligatorios.',
    },
    {
      concept: 'units-source-limits',
      question: 'Limitaciones en el pie del gráfico existen para:',
      options: [
        'Decorar',
        'Evitar sobreclaim y acotar a qué aplica la evidencia',
        'Sustituir el título',
        'Esconder errores de eje',
      ],
      correctIndex: 1,
      explanation: 'Límites protegen decisiones responsables.',
    },
    {
      concept: 'color-contrast-alt-no-overclaim',
      question: 'Para accesibilidad de color en charts:',
      options: [
        'Rojo/verde solo sin otra codificación',
        'Contraste suficiente + canal no solo color (patrón/etiqueta) y alt text',
        'Fondo y trazo casi iguales “por estética”',
        'Parpadeo al 20 Hz',
      ],
      correctIndex: 1,
      explanation: 'No dependas solo del color; da contraste y texto alternativo.',
    },
    {
      concept: 'color-contrast-alt-no-overclaim',
      question: '“Esto prueba que el producto triunfará” bajo un scatter exploratorio es:',
      options: [
        'Claim correcto siempre',
        'Sobreclaim: el visual no sostiene predicción de negocio sin más evidencia',
        'Requisito de Seaborn',
        'Alt text válido',
      ],
      correctIndex: 1,
      explanation: 'No overclaim: el lenguaje sigue a la evidencia.',
    },
    {
      concept: 'color-contrast-alt-no-overclaim',
      question: 'Un alt text útil describe:',
      options: [
        '“Imagen1.png”',
        'Tipo de chart, variables, periodo y hallazgo principal acotado',
        'Solo la paleta hex',
        'El path absoluto del repo',
      ],
      correctIndex: 1,
      explanation: 'Alt text comunica el mensaje a quien no ve el gráfico.',
    },
  ],

  // === Section 20: Excel factory V3 (platform id rag) ===
  'rag': [
    {
      concept: 'sheets-cells-tables-named',
      question: 'En openpyxl, un named range bien usado sirve para:',
      options: [
        'Reemplazar backups',
        'Referenciar celdas/tablas de forma estable en plantillas y lecturas',
        'Compilar a WASM',
        'Encriptar el workbook',
      ],
      correctIndex: 1,
      explanation: 'Named ranges dan anclas estables frente a layout frágil.',
    },
    {
      concept: 'sheets-cells-tables-named',
      question: 'Al leer una Table de Excel, lo robusto es:',
      options: [
        'Asumir siempre A1:Z999 sin validar',
        'Usar el objeto tabla/ref documentado y validar header/filas',
        'Convertir todo a imagen',
        'Borrar defined_names',
      ],
      correctIndex: 1,
      explanation: 'Tablas y refs explícitas reducen roturas por columnas insertadas.',
    },
    {
      concept: 'sheets-cells-tables-named',
      question: 'Escribir en una sheet de plantilla sin dañar otras implica:',
      options: [
        'Recrear el workbook desde cero siempre',
        'Abrir, mutar solo celdas/hojas objetivo y preservar el resto',
        'Renombrar todas las sheets al azar',
        'Desactivar shared strings',
      ],
      correctIndex: 1,
      explanation: 'El adaptador muta con precisión quirúrgica.',
    },
    {
      concept: 'formulas-vs-cached-values',
      question: 'data_only=True en openpyxl devuelve:',
      options: [
        'Siempre la fórmula textual',
        'Valores cacheados de la última evaluación en Excel (si existen), no recalcula motor completo',
        'Un PDF',
        'Macros VBA ejecutadas',
      ],
      correctIndex: 1,
      explanation: 'Sin Excel recalculando, solo hay cache; no es motor de fórmulas completo.',
    },
    {
      concept: 'formulas-vs-cached-values',
      question: 'Si lees f.value y ves “=A1+B1”, estás viendo:',
      options: [
        'El valor numérico final garantizado',
        'La fórmula; el resultado calculado puede requerir cache/evaluación externa',
        'Un named style',
        'Un pivot cache',
      ],
      correctIndex: 1,
      explanation: 'Fórmula ≠ valor evaluado.',
    },
    {
      concept: 'formulas-vs-cached-values',
      question: 'En un pipeline headless, depender solo de valores cacheados es riesgoso porque:',
      options: [
        'Son siempre más precisos que fórmulas',
        'Pueden estar desactualizados si nadie abrió/guardó en Excel tras cambios',
        'No existen en xlsx',
        'Rompen siempre el ZIP',
      ],
      correctIndex: 1,
      explanation: 'Cache stale es un clásico de automatización Excel.',
    },
    {
      concept: 'styles-charts-templates',
      question: 'Al rellenar una plantilla corporativa, la prioridad es:',
      options: [
        'Reescribir todos los estilos a mano cada run',
        'Preservar estilos/charts de plantilla y solo inyectar datos donde corresponde',
        'Eliminar el theme.xml',
        'Convertir charts a HTML',
      ],
      correctIndex: 1,
      explanation: 'Plantilla manda en look&feel; el código llena datos.',
    },
    {
      concept: 'styles-charts-templates',
      question: 'Un chart embebido en xlsx tras actualizar datos fuente:',
      options: [
        'Siempre se redibuja solo en openpyxl sin Excel',
        'Puede requerir que la serie apunte a rangos correctos; validar refs post-escritura',
        'Se borra automáticamente',
        'Se convierte en pivot',
      ],
      correctIndex: 1,
      explanation: 'Mantén rangos de series alineados a los datos escritos.',
    },
    {
      concept: 'styles-charts-templates',
      question: 'Copiar estilos celda a celda en bucle gigante suele:',
      options: [
        'Ser la opción más rápida siempre',
        'Ser frágil/lento; preferir plantilla y estilos de fila/tabla',
        'Garantizar a11y PDF',
        'Recalcular fórmulas',
      ],
      correctIndex: 1,
      explanation: 'Diseño por plantilla > micro-estilos en loop.',
    },
    {
      concept: 'dates-locales-merged-protect',
      question: 'Fechas en Excel + locale PE: el riesgo principal es:',
      options: [
        'Que openpyxl no soporte int',
        'Ambigüedad día/mes y seriales; serializar/parsear de forma explícita',
        'Que no existan celdas',
        'Que el ZIP no tenga [Content_Types]',
      ],
      correctIndex: 1,
      explanation: 'Fechas requieren contrato explícito (ISO/serial), no “lo que se ve”.',
    },
    {
      concept: 'dates-locales-merged-protect',
      question: 'Celdas combinadas (merged) al escribir valores:',
      options: [
        'Se pueden ignorar siempre',
        'Hay que escribir en la celda ancla y respetar merges existentes',
        'Obligan a usar CSV',
        'Eliminan la protección',
      ],
      correctIndex: 1,
      explanation: 'El valor vive en la celda superior-izquierda del merge.',
    },
    {
      concept: 'dates-locales-merged-protect',
      question: 'Hojas protegidas en automatización:',
      options: [
        'Impiden cualquier estrategia',
        'Requieren unprotect documentado o escribir en rangos permitidos; no hardcodear secretos en repo',
        'Se saltan con print',
        'No existen en xlsx',
      ],
      correctIndex: 1,
      explanation: 'Protección es un control: maneja credenciales/proceso con cuidado.',
    },
    {
      concept: 'reconcile-pivots',
      question: 'Conciliar totales entre sheet de detalle y resumen implica:',
      options: [
        'Confiar en el color verde',
        'Comparar sumas/claves con tolerancia y reportar diferencias',
        'Borrar el detalle',
        'Ordenar alfabéticamente solo',
      ],
      correctIndex: 1,
      explanation: 'Reconciliación = igualdad de totales/claves con evidencia.',
    },
    {
      concept: 'reconcile-pivots',
      question: 'Pivots en Excel automatizado con openpyxl:',
      options: [
        'Siempre se refrescan al 100% sin Excel',
        'A menudo requieren Excel/refresh; documenta límites y prefiere tablas de valores materializados si headless',
        'Reemplazan backups',
        'Eliminan validaciones',
      ],
      correctIndex: 1,
      explanation: 'No asumas refresh completo de pivots en headless.',
    },
    {
      concept: 'reconcile-pivots',
      question: 'Si el total de filas filtradas ≠ total del dashboard, el siguiente paso es:',
      options: [
        'Ignorar la diferencia < 50%',
        'Diagnosticar filtros, claves y dobles conteos; fallar el job si supera umbral',
        'Multiplicar por un factor mágico',
        'Cambiar el locale',
      ],
      correctIndex: 1,
      explanation: 'Diferencias de conciliación son defectos hasta demostrar lo contrario.',
    },
    {
      concept: 'validation-structure-preserve',
      question: 'Preservar estructura de plantilla significa:',
      options: [
        'Reordenar sheets al azar',
        'Mantener hojas, nombres, validaciones y rangos críticos intactos salvo mutaciones previstas',
        'Eliminar data validations “por limpieza”',
        'Convertir todo a csv.zip',
      ],
      correctIndex: 1,
      explanation: 'El contrato del workbook es parte del producto.',
    },
    {
      concept: 'validation-structure-preserve',
      question: 'Data validation (listas desplegables) al reescribir celdas:',
      options: [
        'Desaparece siempre y no importa',
        'Debe preservarse o reaplicarse; no romper reglas de dominio',
        'Se reemplaza por macros automáticamente',
        'Solo aplica a CSV',
      ],
      correctIndex: 1,
      explanation: 'Validaciones son reglas de negocio en la UI de Excel.',
    },
    {
      concept: 'validation-structure-preserve',
      question: 'Un test estructural post-escritura verifica:',
      options: [
        'Solo el wall-clock',
        'Hojas esperadas, headers, named ranges y conteos/huellas',
        'El tema de Windows',
        'La velocidad del mouse',
      ],
      correctIndex: 1,
      explanation: 'Tests estructurales capturan regresiones de layout.',
    },
    {
      concept: 'batch-corrupt-locks',
      question: 'En un batch de 200 xlsx, un archivo corrupt/ZIP roto debe:',
      options: [
        'Tumbar todo el lote sin registro',
        'Aislarse (cuarentena/error por archivo) y continuar con el resto si la política lo permite',
        'Reintentarse infinito sin backoff',
        'Renombrarse a .pdf',
      ],
      correctIndex: 1,
      explanation: 'Fault isolation por archivo + manifiesto de errores.',
    },
    {
      concept: 'batch-corrupt-locks',
      question: 'Un lock de archivo (abierto en Excel) en el job nocturno se maneja con:',
      options: [
        'kill -9 al usuario',
        'Detección de lock, reintento acotado y fallo explícito en manifiesto',
        'Ignorar y sobrescribir memoria de otro proceso',
        'Borrar C:/Windows',
      ],
      correctIndex: 1,
      explanation: 'Locks son operativos: reintenta y reporta.',
    },
    {
      concept: 'batch-corrupt-locks',
      question: 'El manifiesto de batch debería listar:',
      options: [
        'Solo “OK” global',
        'Éxitos, fallos, razones y paths tocados',
        'Contraseñas en claro',
        'Memes',
      ],
      correctIndex: 1,
      explanation: 'Operación sin manifiesto no es auditable.',
    },
    {
      concept: 'backups-idempotency-visual-tests',
      question: 'Idempotencia en excel factory significa:',
      options: [
        'Correr dos veces produce efectos distintos no controlados',
        'Reejecutar el job no duplica efectos colaterales; output estable bajo mismos inputs',
        'Borrar backups cada vez',
        'Cambiar named ranges en cada run',
      ],
      correctIndex: 1,
      explanation: 'Misma entrada ⇒ mismo resultado controlado.',
    },
    {
      concept: 'backups-idempotency-visual-tests',
      question: 'Antes de sobrescribir un workbook de salida, lo seguro es:',
      options: [
        'No hacer nada',
        'Backup/versionado del artefacto previo o escritura atómica a temp+replace',
        'Enviar el archivo por email sin hash',
        'Desactivar tests',
      ],
      correctIndex: 1,
      explanation: 'Backups y replace atómico evitan corrupción a medias.',
    },
    {
      concept: 'backups-idempotency-visual-tests',
      question: 'Una prueba “visual/estructural” mínima post-run chequea:',
      options: [
        'Solo que el proceso exit code 0',
        'Hojas/celdas clave, n de filas y opcionalmente hash de rangos críticos',
        'Que el mouse se movió',
        'Que existe un README vacío',
      ],
      correctIndex: 1,
      explanation: 'Exit 0 no basta: valida estructura y cifras ancla.',
    },
  ],

  // === Section 21: Documentos y reportes V3 (platform id fastapi) ===
  'fastapi': [
    {
      concept: 'jinja-data-presentation',
      question: 'Separar datos y presentación con Jinja implica:',
      options: [
        'Meter queries SQL dentro del HTML de la plantilla sin contexto',
        'Pasar un context dict preparado y dejar formato/estructura en el template',
        'Compilar el template a C',
        'Usar solo f-strings en un .docx binario',
      ],
      correctIndex: 1,
      explanation: 'Datos en context; markup/plantilla para presentación.',
    },
    {
      concept: 'jinja-data-presentation',
      question: 'Un beneficio de plantillas Jinja en reportes es:',
      options: [
        'Mezclar secretos en el HTML',
        'Reutilizar layout y cambiar solo el context entre corridas',
        'Evitar cualquier escaping',
        'Eliminar la necesidad de tests',
      ],
      correctIndex: 1,
      explanation: 'Reutilización + context estable = fábrica de reportes.',
    },
    {
      concept: 'jinja-data-presentation',
      question: 'El context dict ideal para un informe sintético contiene:',
      options: [
        'Objetos no serializables opacos sin método de vista',
        'Estructuras simples (dict/list/str/num) ya listas para mostrar',
        'Conexiones abiertas a BD',
        'Threads vivos',
      ],
      correctIndex: 1,
      explanation: 'Prepara datos “listos para vista” antes del render.',
    },
    {
      concept: 'conditions-tables-safe-format',
      question: 'En Jinja, formatear montos/fechas de forma segura implica:',
      options: [
        'Concatenar sin filtros y esperar lo mejor',
        'Usar filtros/formatters y manejar None/vacíos sin romper el render',
        'Desactivar autoescape siempre',
        'Inyectar HTML crudo de usuarios sin sanitizar',
      ],
      correctIndex: 1,
      explanation: 'Formatters + null-safe evitan templates frágiles.',
    },
    {
      concept: 'conditions-tables-safe-format',
      question: 'Una tabla en plantilla debe construirse:',
      options: [
        'Con columnas fijas en código HTML hardcodeado a 50 filas siempre',
        'Iterando filas del context y celdas alineadas a headers',
        'Solo con screenshots',
        'Sin headers',
      ],
      correctIndex: 1,
      explanation: 'Tablas data-driven desde el context.',
    },
    {
      concept: 'conditions-tables-safe-format',
      question: 'Condicionales en template (if/else) se usan para:',
      options: [
        'Ejecutar SQL',
        'Mostrar/ocultar bloques según flags del context sin meter lógica de negocio pesada',
        'Entrenar modelos',
        'Abrir puertos',
      ],
      correctIndex: 1,
      explanation: 'Condición de presentación, no motor de dominio completo.',
    },
    {
      concept: 'styles-sections-docx-pdf',
      question: 'Al generar DOCX/PDF por secciones, lo correcto es:',
      options: [
        'Un solo párrafo sin estilos',
        'Estilos/secciones consistentes (títulos, cuerpo, tablas) reutilizables',
        'Fuentes distintas al azar por página',
        'Imágenes sin caption siempre',
      ],
      correctIndex: 1,
      explanation: 'Estilos de sección dan coherencia editorial.',
    },
    {
      concept: 'styles-sections-docx-pdf',
      question: 'python-docx / reportlab (o stack equivalente) se eligen para:',
      options: [
        'Reemplazar el sistema operativo',
        'Materializar documentos con control de estilos y estructura',
        'Servir gRPC',
        'Indexar vectores',
      ],
      correctIndex: 1,
      explanation: 'Son herramientas de composición documental.',
    },
    {
      concept: 'styles-sections-docx-pdf',
      question: 'Una sección “Método” en el DOCX debería:',
      options: [
        'Omitirse si hay un gráfico bonito',
        'Describir datos, filtros y límites de forma breve y trazable',
        'Copiar el stack trace',
        'Listar contraseñas',
      ],
      correctIndex: 1,
      explanation: 'Método documenta cómo se obtuvo la evidencia.',
    },
    {
      concept: 'pdf-digital-vs-image-ocr',
      question: 'Un PDF digital (texto seleccionable) frente a uno escaneado:',
      options: [
        'Son idénticos para extracción',
        'Digital permite extracción de texto; escaneado suele requerir OCR y es más frágil',
        'El escaneado siempre es más preciso',
        'Ninguno puede tener tablas',
      ],
      correctIndex: 1,
      explanation: 'Detecta tipo: texto nativo vs imagen/OCR.',
    },
    {
      concept: 'pdf-digital-vs-image-ocr',
      question: 'Si el PDF es solo imagen, el pipeline de extracción debe:',
      options: [
        'Asumir que pdfminer bastará siempre',
        'Declarar OCR/limitaciones y validar calidad; no fingir texto perfecto',
        'Convertirlo a xlsx sin review',
        'Ignorar el archivo',
      ],
      correctIndex: 1,
      explanation: 'OCR tiene error; hay que acotar expectativas.',
    },
    {
      concept: 'pdf-digital-vs-image-ocr',
      question: 'Antes de “parsear tablas” de un PDF, conviene:',
      options: [
        'Clasificar si hay texto real o solo bitmap',
        'Borrar metadatos siempre',
        'Renombrarlo a .docx',
        'Asumir 1 columna',
      ],
      correctIndex: 1,
      explanation: 'El tipo de PDF define la estrategia de extracción.',
    },
    {
      concept: 'exec-summary-method-findings',
      question: 'Un resumen ejecutivo efectivo incluye:',
      options: [
        'Solo jerga interna sin cifras',
        'Hallazgos clave, método breve y límites en lenguaje de decisión',
        'El listado completo de imports de Python',
        'Logs DEBUG',
      ],
      correctIndex: 1,
      explanation: 'Exec summary = decisión + evidencia acotada.',
    },
    {
      concept: 'exec-summary-method-findings',
      question: 'La sección de hallazgos debe:',
      options: [
        'Mezclar opiniones sin ancla',
        'Apuntar a tablas/gráficos y evitar claims no soportados',
        'Repetir el índice tres veces',
        'Ocultar n',
      ],
      correctIndex: 1,
      explanation: 'Hallazgo ↔ evidencia visual/tabular.',
    },
    {
      concept: 'exec-summary-method-findings',
      question: 'Método y hallazgos se separan para:',
      options: [
        'Alargar el PDF',
        'Distinguir cómo se midió de qué se encontró',
        'Evitar títulos',
        'Esconder limitaciones',
      ],
      correctIndex: 1,
      explanation: 'Separación mejora auditoría y lectura.',
    },
    {
      concept: 'charts-tables-sources-limits',
      question: 'Al embeber un gráfico en el informe debes:',
      options: [
        'Quitar ejes “por estética minimalista extrema”',
        'Incluir fuente, unidades y limitaciones junto a la figura',
        'Usar resolución 16×16',
        'Omitir el número de figura',
      ],
      correctIndex: 1,
      explanation: 'Figura sin fuente/límites invita al malentendido.',
    },
    {
      concept: 'charts-tables-sources-limits',
      question: 'Tablas de evidencia en el reporte sirven para:',
      options: [
        'Decorar márgenes',
        'Dar alternativa no solo visual y anclar cifras del texto',
        'Reemplazar el exec summary con ruido',
        'Esconder el método',
      ],
      correctIndex: 1,
      explanation: 'Tabla = ancla numérica y a11y.',
    },
    {
      concept: 'charts-tables-sources-limits',
      question: 'Si una cifra del texto ≠ la de la tabla, el defecto es:',
      options: [
        'Cosmético ignorable',
        'Bloqueante de consistencia hasta reconciliar',
        'Responsabilidad del lector',
        'Un feature de Jinja',
      ],
      correctIndex: 1,
      explanation: 'Consistencia numérica es requisito de calidad.',
    },
    {
      concept: 'copy-a11y-consistency',
      question: 'Consistencia editorial en el paquete de entrega implica:',
      options: [
        'Mezclar “%” y “por ciento” y decimales al azar',
        'Misma terminología, formato numérico y tono en DOCX/PDF/dashboard',
        'Tres nombres distintos para la misma métrica',
        'Ignorar mayúsculas en títulos de sección',
      ],
      correctIndex: 1,
      explanation: 'Un lenguaje unificado reduce fricción del lector.',
    },
    {
      concept: 'copy-a11y-consistency',
      question: 'a11y en documentos de reporte incluye:',
      options: [
        'Texto gris sobre gris',
        'Estructura de encabezados, contraste y texto alternativo en figuras',
        'Solo imágenes sin captions',
        'Tablas como screenshots ilegibles',
      ],
      correctIndex: 1,
      explanation: 'Estructura semántica + contraste + alts.',
    },
    {
      concept: 'copy-a11y-consistency',
      question: 'Revisión de redacción antes de aprobar busca:',
      options: [
        'Agregar más adjetivos de marketing sin base',
        'Claridad, claims acotados y ausencia de contradicciones',
        'Eliminar el método',
        'Traducir todo a latín',
      ],
      correctIndex: 1,
      explanation: 'Copy review = claridad y honestidad del claim.',
    },
    {
      concept: 'visual-render-provenance-approval',
      question: 'Provenance del paquete de reportes registra:',
      options: [
        'Solo el nombre del archivo final',
        'Inputs, versiones, seed/filtros, artefactos generados y quién aprueba',
        'La playlist del analista',
        'El wallpaper del desktop',
      ],
      correctIndex: 1,
      explanation: 'Provenance + aprobación cierran el flujo trazable.',
    },
    {
      concept: 'visual-render-provenance-approval',
      question: 'Render visual de verificación (smoke) sirve para:',
      options: [
        'Reemplazar todos los tests unitarios',
        'Detectar roturas obvias de layout/export antes de aprobación',
        'Entrenar un LLM',
        'Borrar el manifiesto',
      ],
      correctIndex: 1,
      explanation: 'Smoke visual/estructural reduce sorpresas en comité.',
    },
    {
      concept: 'visual-render-provenance-approval',
      question: 'Sin flujo de aprobación documentado, el riesgo es:',
      options: [
        'Ninguno',
        'Publicar cifras no revisadas y perder trazabilidad de responsabilidad',
        'Mejor performance',
        'Más a11y automática',
      ],
      correctIndex: 1,
      explanation: 'Aprobación es control de calidad y accountability.',
    },
  ],

  // === Section 22: Email, identidad y aprobación humana V3 (platform id rapidfuzz-entity) ===
  'rapidfuzz-entity': [
    {
      concept: 'mime-encoding-html-attachments',
      question: 'Al construir un correo multi-parte en Python, MIMEMultipart sirve para:',
      options: [
        'Enviar SMTP sin autenticación automática',
        'Agrupar partes (text/html, attachments) bajo un contenedor MIME',
        'Cifrar el cuerpo con TLS de capa de aplicación',
        'Resolver DNS de destinatarios',
      ],
      correctIndex: 1,
      explanation: 'MIMEMultipart es el contenedor de partes MIME; no resuelve transporte ni cifrado por sí solo.',
    },
    {
      concept: 'mime-encoding-html-attachments',
      question: '¿Qué charset conviene fijar en un MIMEText plano con acentos (es-PE)?',
      options: [
        'latin-7 sin declarar',
        'utf-8 declarado en el Content-Type/charset',
        'ascii forzado siempre',
        'utf-16le sin BOM',
      ],
      correctIndex: 1,
      explanation: 'utf-8 con charset explícito evita mojibake en clientes.',
    },
    {
      concept: 'mime-encoding-html-attachments',
      question: 'Un attachment binario se adjunta típicamente con:',
      options: [
        'print() del path en el body',
        'MIMEApplication (o similar) + Content-Disposition filename',
        'Solo Subject con el nombre del archivo',
        'Un header X-Attachment-Path local',
      ],
      correctIndex: 1,
      explanation: 'El binario va como parte MIME con disposición attachment y nombre.',
    },
    {
      concept: 'templates-sanitization',
      question: 'Antes de interpolar un nombre de usuario en HTML de correo, debes:',
      options: [
        'Confiar en que el CRM ya escapó todo',
        'Escapar/sanitizar el input (p. ej. html.escape) para evitar XSS en el cliente',
        'Base64 del nombre sin más',
        'Quitar solo comillas simples',
      ],
      correctIndex: 1,
      explanation: 'Templates de correo HTML son superficie XSS; escapa datos no confiables.',
    },
    {
      concept: 'templates-sanitization',
      question: 'Un template con {{body_html}} sin política de tags es riesgoso porque:',
      options: [
        'Aumenta el peso del .eml en bytes',
        'Puede inyectar scripts/estilos maliciosos en el mensaje renderizado',
        'Rompe siempre el encoding utf-8',
        'Impide usar BCC',
      ],
      correctIndex: 1,
      explanation: 'HTML crudo no sanitizado es vector de inyección en el cliente de correo.',
    },
    {
      concept: 'templates-sanitization',
      question: 'La sanitización de plantillas de correo busca principalmente:',
      options: [
        'Maximizar tracking pixels',
        'Permitir solo markup seguro y neutralizar contenido peligroso',
        'Forzar envío inmediato',
        'Eliminar todos los attachments',
      ],
      correctIndex: 1,
      explanation: 'Allowlist/escape de markup reduce riesgo sin bloquear formato legítimo.',
    },
    {
      concept: 'oauth-service-account-scopes',
      question: 'Al integrar Gmail/Outlook vía OAuth, el principio de scopes es:',
      options: [
        'Pedir todos los scopes del catálogo por si acaso',
        'Solicitar el mínimo de scopes necesarios para drafts/lectura acotada',
        'Usar password del usuario en plaintext',
        'Compartir un refresh token en el repo',
      ],
      correctIndex: 1,
      explanation: 'Least privilege: scopes mínimos reducen blast radius.',
    },
    {
      concept: 'oauth-service-account-scopes',
      question: 'Una service account en sandbox de correo debe:',
      options: [
        'Tener admin global del dominio sin revisión',
        'Estar limitada a buzones/recursos de prueba y scopes documentados',
        'Usar la contraseña personal del CEO',
        'Desactivar auditoría de tokens',
      ],
      correctIndex: 1,
      explanation: 'Cuentas de servicio de prueba viven en sandbox con límites claros.',
    },
    {
      concept: 'oauth-service-account-scopes',
      question: 'Si el token solo tiene scope de draft, intentar send real debe:',
      options: [
        'Funcionar siempre por elevación automática',
        'Fallar por autorización; el diseño debe respetar ese límite',
        'Convertirse en SMS',
        'Borrar el draft',
      ],
      correctIndex: 1,
      explanation: 'Scopes se hacen cumplir en el proveedor; no hay auto-elevación legítima.',
    },
    {
      concept: 'drafts-expiry-adapters',
      question: 'En el pipeline de correo del curso, el artefacto preferido antes de aprobación es:',
      options: [
        'SMTP send inmediato a producción',
        'Draft/sandbox o archivo .eml; ningún envío real automático',
        'Webhook público sin auth',
        'Impresión en papel únicamente',
      ],
      correctIndex: 1,
      explanation: 'Drafts/sandbox evitan envíos accidentales; humano aprueba.',
    },
    {
      concept: 'drafts-expiry-adapters',
      question: 'Un adaptador de proveedor (Gmail vs archivo .eml) debería:',
      options: [
        'Mezclar credenciales en el mismo módulo de negocio sin interfaz',
        'Implementar una interfaz común (crear draft, listar, expirar) con backends intercambiables',
        'Hardcodear un solo vendor sin tests',
        'Enviar siempre BCC a un dump público',
      ],
      correctIndex: 1,
      explanation: 'Adapters desacoplan dominio del API del proveedor.',
    },
    {
      concept: 'drafts-expiry-adapters',
      question: 'La expiración de drafts sirve para:',
      options: [
        'Aumentar spam score',
        'Limitar ventana de datos sensibles y borradores obsoletos',
        'Forzar reuso del mismo Message-ID eterno',
        'Desactivar OAuth',
      ],
      correctIndex: 1,
      explanation: 'TTL de drafts reduce superficie y basura operativa.',
    },
    {
      concept: 'resolve-verify-recipients',
      question: 'Resolver un destinatario desde un directorio sintético implica:',
      options: [
        'Declarar parentesco o fraude por homonimia',
        'Mapear identificadores a direcciones verificables y señalar ambigüedad sin inferir ilícitos',
        'Enviar sin verificar si el score fuzzy > 50',
        'Publicar el directorio completo en el body',
      ],
      correctIndex: 1,
      explanation: 'Resolución ≠ juicio de fraude/parentesco; documenta ambigüedad.',
    },
    {
      concept: 'resolve-verify-recipients',
      question: 'Un match fuzzy de nombres con score alto significa:',
      options: [
        'Prueba legal de colusión',
        'Similitud textual; requiere verificación y política humana, no auto-acusación',
        'Que el correo es inválido siempre',
        'Que OAuth falló',
      ],
      correctIndex: 1,
      explanation: 'Matching es evidencia débil de identidad textual, no de delito.',
    },
    {
      concept: 'resolve-verify-recipients',
      question: 'Antes de poner un To: en un draft de alta sensibilidad, conviene:',
      options: [
        'Usar el primer resultado del autocomplete sin logs',
        'Verificar dominio/estado del contacto y registrar evidencia de resolución',
        'Duplicar en BCC público',
        'Omitir Subject',
      ],
      correctIndex: 1,
      explanation: 'Verificación y auditoría reducen envíos a destinos incorrectos.',
    },
    {
      concept: 'lists-cc-bcc-privacy-min',
      question: 'Exponer todos los destinatarios en To/CC cuando bastaba BCC viola:',
      options: [
        'MIME boundary',
        'Mínima divulgación / privacidad de la lista',
        'UTF-8',
        'Page Objects',
      ],
      correctIndex: 1,
      explanation: 'BCC/listas controladas protegen identidades entre sí.',
    },
    {
      concept: 'lists-cc-bcc-privacy-min',
      question: 'Una lista de distribución para notificaciones masivas debe:',
      options: [
        'Incluir PII innecesaria en el Subject',
        'Aplicar minimización: solo campos y destinatarios necesarios al propósito',
        'Reenviar el directorio HR completo',
        'Desactivar audit log',
      ],
      correctIndex: 1,
      explanation: 'Minimización de datos es requisito de privacidad operativa.',
    },
    {
      concept: 'lists-cc-bcc-privacy-min',
      question: 'CC a un tercero no autorizado en un correo con datos de cliente sintético es:',
      options: [
        'Buena práctica de transparencia total',
        'Fuga de información / incumplimiento de necesidad de conocer',
        'Requisito de SMTP',
        'Equivalente a DKIM',
      ],
      correctIndex: 1,
      explanation: 'CC amplía audiencia; solo si hay base legítima.',
    },
    {
      concept: 'approval-queue-state-machine',
      question: 'Una cola de aprobación de correos modela estados como:',
      options: [
        'solo “enviado” sin transiciones',
        'draft → pending_review → approved/rejected/edited con transiciones explícitas',
        'random shuffle de Message-ID',
        'siempre approved al crear',
      ],
      correctIndex: 1,
      explanation: 'State machine hace auditable el ciclo de vida del envío.',
    },
    {
      concept: 'approval-queue-state-machine',
      question: 'Un revisor edita el body y aprueba. El sistema debe:',
      options: [
        'Ignorar la edición',
        'Registrar la versión editada, actor, timestamp y pasar a approved',
        'Borrar el audit log',
        'Enviar dos copias idénticas sin marca',
      ],
      correctIndex: 1,
      explanation: 'Edición + aprobación quedan en audit trail.',
    },
    {
      concept: 'approval-queue-state-machine',
      question: 'Transicionar de rejected a sent sin nueva aprobación es:',
      options: [
        'Idempotencia correcta',
        'Violación de la máquina de estados / control humano',
        'OAuth scope normal',
        'Requisito de BCC',
      ],
      correctIndex: 1,
      explanation: 'Estados inválidos no deben ejecutarse en silencio.',
    },
    {
      concept: 'idempotency-audit-retry',
      question: 'Un reintento seguro de “crear draft” ante timeout usa:',
      options: [
        'Nuevo Message-ID cada micro-reintento sin clave',
        'Idempotency-Key / dedupe para no duplicar el mismo borrador lógico',
        'Doble send en paralelo siempre',
        'Desactivar logs',
      ],
      correctIndex: 1,
      explanation: 'Idempotencia evita duplicados en reintentos.',
    },
    {
      concept: 'idempotency-audit-retry',
      question: 'El audit log de un envío aprobado debe incluir al menos:',
      options: [
        'Solo el color del cliente de correo',
        'Actor, acción, timestamp, destinatarios efectivos y hash/versión del contenido',
        'La contraseña OAuth',
        'Nada; GDPR prohíbe logs',
      ],
      correctIndex: 1,
      explanation: 'Trazabilidad mínima sin secretos en claro.',
    },
    {
      concept: 'idempotency-audit-retry',
      question: 'Reintentar un send ya confirmado OK sin guardia produce:',
      options: [
        'Mejor deliverability',
        'Riesgo de correo duplicado al destinatario',
        'Sanitización automática',
        'Expiración de draft',
      ],
      correctIndex: 1,
      explanation: 'Sin idempotencia, retries duplican efectos colaterales.',
    },
  ],

  // === Section 23: Browser RPA con Playwright V3 (platform id computer-vision) ===
  'computer-vision': [
    {
      concept: 'dom-user-locators',
      question: 'En Playwright, get_by_role / get_by_text se prefieren porque:',
      options: [
        'Son más frágiles que XPath absolutos de 20 niveles',
        'Reflejan la UI como la usa una persona y resisten cambios cosméticos de CSS',
        'Ejecutan JavaScript arbitrario del sitio',
        'Desactivan auto-waiting',
      ],
      correctIndex: 1,
      explanation: 'Locators orientados a usuario son más estables y legibles.',
    },
    {
      concept: 'dom-user-locators',
      question: 'CSS/XPath muy acoplados al layout suelen fallar cuando:',
      options: [
        'El texto accesible se mantiene',
        'Se reordenan wrappers/divs sin cambiar el rol visible',
        'Solo cambia el timezone del CI',
        'El test usa expect',
      ],
      correctIndex: 1,
      explanation: 'Selectores de estructura se rompen con refactors de markup.',
    },
    {
      concept: 'dom-user-locators',
      question: 'Si un botón no tiene rol claro, la mejora de testabilidad es:',
      options: [
        'Hardcodear pixel coordinates',
        'Añadir roles/nombres accesibles o data-testid estable de último recurso',
        'Dormir 30s fijos',
        'Ignorar el botón',
      ],
      correctIndex: 1,
      explanation: 'Accesibilidad y testids estables > coordenadas.',
    },
    {
      concept: 'auto-waiting-assertions',
      question: 'Auto-waiting en Playwright significa que:',
      options: [
        'Nunca hay que asertar nada',
        'Las acciones/assertions esperan condiciones de acción/visibilidad con timeout',
        'Se desactiva la red',
        'Se fuerza reload cada 1ms',
      ],
      correctIndex: 1,
      explanation: 'Auto-wait reduce sleeps manuales frágiles.',
    },
    {
      concept: 'auto-waiting-assertions',
      question: 'Una assertion fiable de que la tabla cargó es:',
      options: [
        'time.sleep(5) y rezar',
        'expect(locator).to_be_visible() / to_have_count según el contrato UI',
        'Solo print del HTML',
        'Matar el browser mid-flight',
      ],
      correctIndex: 1,
      explanation: 'Assertions con espera condicionada documentan el éxito.',
    },
    {
      concept: 'auto-waiting-assertions',
      question: 'Usar sleep fijo largo en vez de auto-wait suele:',
      options: [
        'Acelerar el suite siempre',
        'Hacer tests lentos y aún flaky si la condición tarda más',
        'Garantizar a11y',
        'Reemplazar traces',
      ],
      correctIndex: 1,
      explanation: 'Sleeps fijos no modelan la condición real.',
    },
    {
      concept: 'forms-upload-download-sessions',
      question: 'Al automatizar un upload, lo robusto es:',
      options: [
        'Simular drag con coordenadas aleatorias sin input',
        'Setear el input file / API de set_input_files y validar confirmación UI',
        'Copiar el path al clipboard del host CI sin más',
        'Desactivar HTTPS',
      ],
      correctIndex: 1,
      explanation: 'APIs de upload del runner son deterministas.',
    },
    {
      concept: 'forms-upload-download-sessions',
      question: 'Verificar un download implica:',
      options: [
        'Asumir que el click bastó',
        'Capturar el evento/path de descarga y validar nombre/tamaño/hash básico',
        'Solo mirar el favicon',
        'Borrar cookies siempre antes',
      ],
      correctIndex: 1,
      explanation: 'Download verificado cierra el loop del caso de prueba.',
    },
    {
      concept: 'forms-upload-download-sessions',
      question: 'Persistir sesión (storage state) ayuda a:',
      options: [
        'Evitar login en cada test cuando la política lo permite',
        'Saltar ToS del sitio de terceros sin control',
        'Desactivar CSRF en producción ajena',
        'Romper idempotencia a propósito',
      ],
      correctIndex: 0,
      explanation: 'Storage state reutiliza auth de forma controlada en entornos de prueba.',
    },
    {
      concept: 'auth-states-page-objects',
      question: 'Un Page Object bien diseñado:',
      options: [
        'Expone selectores crudos por toda la suite sin encapsular',
        'Encapsula locators y acciones de una página/flujo reutilizable',
        'Ejecuta SQL directo al browser',
        'Mezcla asserts de 10 páginas en un solo método gigante sin nombre',
      ],
      correctIndex: 1,
      explanation: 'POM reduce duplicación y aclara intención.',
    },
    {
      concept: 'auth-states-page-objects',
      question: 'Estados de auth (logged-in/out/role) en RPA web se manejan:',
      options: [
        'Con un único usuario root para todo sin aislar',
        'Con fixtures/estados explícitos y datos de prueba por rol',
        'Compartiendo cookies de producción real de clientes',
        'Deshabilitando HTTPS certificate checks en prod',
      ],
      correctIndex: 1,
      explanation: 'Estados explícitos evitan acoplamiento y datos reales.',
    },
    {
      concept: 'auth-states-page-objects',
      question: 'Si el login es multi-factor y no hay API de test, la opción ética en lab es:',
      options: [
        'Phishing al equipo de seguridad',
        'Usar entorno de prueba con bypass controlado o handoff documentado',
        'Romper captcha de un banco real',
        'Hardcodear OTP de producción',
      ],
      correctIndex: 1,
      explanation: 'Solo entornos autorizados y controles de prueba.',
    },
    {
      concept: 'trace-screenshot-logs',
      question: 'Cuando un test RPA falla, el primer artefacto útil suele ser:',
      options: [
        'Reescribir todo el framework',
        'Trace/screenshot/video + logs de red/consola del momento del fallo',
        'Borrar node_modules',
        'Aumentar el sleep a 5 minutos sin evidencia',
      ],
      correctIndex: 1,
      explanation: 'Observabilidad localiza la causa.',
    },
    {
      concept: 'trace-screenshot-logs',
      question: 'El trace de Playwright permite:',
      options: [
        'Compilar TypeScript a WASM',
        'Reproducir timeline de acciones y selectores en el fallo',
        'Firmar DKIM',
        'Entrenar YOLO',
      ],
      correctIndex: 1,
      explanation: 'Trace es la línea de tiempo del run.',
    },
    {
      concept: 'trace-screenshot-logs',
      question: 'Logs estructurados del bot deben evitar:',
      options: [
        'Correlation ids',
        'Secretos, tokens y PII real en claro',
        'Timestamps ISO',
        'Niveles info/error',
      ],
      correctIndex: 1,
      explanation: 'Logs útiles sin filtrar secretos/PII.',
    },
    {
      concept: 'robust-selectors-retries-recovery',
      question: 'Un retry de acción de UI debe ser:',
      options: [
        'Infinito sin backoff ni tope',
        'Acotado, con backoff y clasificación de errores recuperables vs fatales',
        'Solo en producción real de clientes sin sandbox',
        'Sin registrar intentos',
      ],
      correctIndex: 1,
      explanation: 'Retries disciplinados evitan tormentas y loops.',
    },
    {
      concept: 'robust-selectors-retries-recovery',
      question: 'Recovery tras un modal inesperado implica:',
      options: [
        'Ignorar y clicar a ciegas coordenadas',
        'Detectar el estado, cerrar/manejar el modal y reintentar el paso con evidencia',
        'Reiniciar el OS',
        'Desactivar JavaScript globalmente',
      ],
      correctIndex: 1,
      explanation: 'Recuperación es manejar estados UI conocidos.',
    },
    {
      concept: 'robust-selectors-retries-recovery',
      question: 'Selectores robustos priorizan:',
      options: [
        'Índices nth-child profundos del layout actual',
        'Rol/nombre, testid estable; CSS estructural como último recurso',
        'Solo XPath desde html[1]/body[1]/... ',
        'OCR de toda la pantalla siempre',
      ],
      correctIndex: 1,
      explanation: 'Estabilidad > acoplamiento al DOM profundo.',
    },
    {
      concept: 'api-export-first',
      question: 'Antes de scrapear UI, conviene preguntar:',
      options: [
        'Si el captcha es bonito',
        'Si existe API/export oficial más estable y permitido',
        'Si se puede adivinar el password admin',
        'Si hay que desactivar logs',
      ],
      correctIndex: 1,
      explanation: 'API/export first reduce fragilidad y riesgo ToS.',
    },
    {
      concept: 'api-export-first',
      question: 'RPA de browser es preferible cuando:',
      options: [
        'Siempre, incluso con API documentada y estable',
        'No hay API viable y el proceso UI está autorizado/controlado',
        'Para evadir cuotas de API a propósito',
        'Para ignorar autenticación',
      ],
      correctIndex: 1,
      explanation: 'RPA es fallback, no default ciego.',
    },
    {
      concept: 'api-export-first',
      question: 'Un export CSV oficial frente a click-grid masivo ofrece:',
      options: [
        'Más flakiness garantizado',
        'Contrato de datos más estable y menos mantenimiento de selectores',
        'Obligatoriedad de CAPTCHA',
        'Prohibición de tests',
      ],
      correctIndex: 1,
      explanation: 'Exports son contratos de datos.',
    },
    {
      concept: 'tos-captcha-desktop-human',
      question: 'Ante CAPTCHA en un sitio de terceros, el bot debe:',
      options: [
        'Usar granjas de resolución no autorizadas sin revisión',
        'Detenerse y escalar a handoff humano / canal permitido',
        'Fuerza bruta de imágenes',
        'Desactivar el antivirus del host',
      ],
      correctIndex: 1,
      explanation: 'CAPTCHA es frontera; humano o API legítima.',
    },
    {
      concept: 'tos-captcha-desktop-human',
      question: 'Violar términos de uso del sitio objetivo para “cumplir el KPI” es:',
      options: [
        'Buena ingeniería de product',
        'Riesgo legal/ético; el diseño debe respetar ToS y entornos autorizados',
        'Requisito de Playwright',
        'Equivalente a unit test',
      ],
      correctIndex: 1,
      explanation: 'ToS y autorización delimitan el RPA legítimo.',
    },
    {
      concept: 'tos-captcha-desktop-human',
      question: 'Desktop fallback (UI de escritorio) entra cuando:',
      options: [
        'La web API ya resuelve el 100%',
        'El proceso crítico no está en web y hay control/autorización del entorno',
        'Se quiere evitar audit log',
        'Siempre es más barato sin medir',
      ],
      correctIndex: 1,
      explanation: 'Desktop es otro adaptador con costos y riesgos propios.',
    },
  ],

  // === Section 24: OCR y Document AI V3 (platform id rpa-advanced) ===
  'rpa-advanced': [
    {
      concept: 'dpi-deskew-crop-contrast',
      question: 'Subir DPI efectivo / calidad de escaneo antes de OCR ayuda a:',
      options: [
        'Garantizar comprensión semántica del contrato',
        'Mejorar legibilidad de glifos para el motor OCR',
        'Cifrar el PDF',
        'Eliminar la necesidad de schema',
      ],
      correctIndex: 1,
      explanation: 'Preproceso de imagen mejora señal al OCR.',
    },
    {
      concept: 'dpi-deskew-crop-contrast',
      question: 'Deskew corrige principalmente:',
      options: [
        'Idioma del documento',
        'Inclinación/rotación leve que deforma líneas de texto',
        'Encoding MIME',
        'Scopes OAuth',
      ],
      correctIndex: 1,
      explanation: 'Deskew alinea el texto para el OCR.',
    },
    {
      concept: 'dpi-deskew-crop-contrast',
      question: 'Crop de márgenes ruidosos y ajuste de contraste buscan:',
      options: [
        'Aumentar PII en la imagen',
        'Enfocar la región útil y mejorar separación tinta/fondo',
        'Convertir tablas en audio',
        'Saltar validación cross-field',
      ],
      correctIndex: 1,
      explanation: 'Menos ruido, más señal en la ROI.',
    },
    {
      concept: 'noise-orientation',
      question: 'Un documento escaneado al revés (180°) suele requerir:',
      options: [
        'Ignorar orientation y forzar OCR igual sin chequeo',
        'Detección/corrección de orientación antes o durante OCR',
        'Solo bajar contraste',
        'Cambiar a BCC',
      ],
      correctIndex: 1,
      explanation: 'Orientación incorrecta destruye el texto reconocido.',
    },
    {
      concept: 'noise-orientation',
      question: 'Filtros de ruido (denoise) mal aplicados pueden:',
      options: [
        'Solo mejorar siempre el F1',
        'Borrar puntos de i/signos y degradar OCR',
        'Firmar el PDF',
        'Crear golden sets',
      ],
      correctIndex: 1,
      explanation: 'Denoise agresivo es arma de doble filo.',
    },
    {
      concept: 'noise-orientation',
      question: 'Señales de orientación incluyen:',
      options: [
        'El color del logo corporativo únicamente',
        'Clasificadores de rotation / confianza de líneas de texto',
        'El nombre del archivo .eml',
        'El timezone del servidor',
      ],
      correctIndex: 1,
      explanation: 'Orientación se infiere de geometría/texto.',
    },
    {
      concept: 'langs-layout-confidence',
      question: 'Configurar idioma(s) OCR correctos (p. ej. spa) impacta:',
      options: [
        'Solo el color del PDF',
        'Diccionarios y modelos de caracteres/palabras del motor',
        'El certificado TLS',
        'La cola de email',
      ],
      correctIndex: 1,
      explanation: 'Idioma alinea el modelo lingüístico del OCR.',
    },
    {
      concept: 'langs-layout-confidence',
      question: 'Un score de confidence bajo en un campo debe:',
      options: [
        'Auto-publicarse a clientes',
        'Disparar abstención / revisión humana según umbral',
        'Duplicar el campo en BCC',
        'Borrar el golden set',
      ],
      correctIndex: 1,
      explanation: 'Low confidence → no confiar ciegamente.',
    },
    {
      concept: 'langs-layout-confidence',
      question: 'Layout analysis (bloques/columnas) sirve para:',
      options: [
        'Sustituir la política de privacidad',
        'Ordenar y segmentar texto según estructura del documento',
        'Generar OAuth tokens',
        'Entrenar un LLM sin datos',
      ],
      correctIndex: 1,
      explanation: 'Layout estructura la lectura del documento.',
    },
    {
      concept: 'text-tables-kv-pairs',
      question: 'Extraer pares clave–valor de una factura sintética implica:',
      options: [
        'Asumir que OCR confidence 100% siempre',
        'Localizar etiquetas y valores asociados con evidencia (bbox/texto)',
        'Inventar montos si faltan',
        'Ignorar tablas',
      ],
      correctIndex: 1,
      explanation: 'KV extraction ancla valor a clave con evidencia.',
    },
    {
      concept: 'text-tables-kv-pairs',
      question: 'Tablas OCR requieren cuidado extra porque:',
      options: [
        'Nunca tienen headers',
        'Filas/columnas se desalínean y celdas se fusionan mal',
        'No pueden serializarse a JSON',
        'Prohíben golden sets',
      ],
      correctIndex: 1,
      explanation: 'Estructura tabular es frágil post-OCR.',
    },
    {
      concept: 'text-tables-kv-pairs',
      question: 'Guardar bounding boxes junto al texto ayuda a:',
      options: [
        'Aumentar el spam score del correo',
        'Auditar/visualizar de dónde salió cada campo extraído',
        'Cifrar OAuth',
        'Evitar schemas',
      ],
      correctIndex: 1,
      explanation: 'Evidencia espacial habilita revisión y debug.',
    },
    {
      concept: 'schema-normalization',
      question: 'Normalizar a un schema de extracción significa:',
      options: [
        'Dejar strings crudos sin tipos ni nombres estables',
        'Mapear campos a nombres/tipos/formatos canónicos (fechas, montos, monedas)',
        'Convertir todo a imagen PNG',
        'Eliminar confidence',
      ],
      correctIndex: 1,
      explanation: 'Schema es el contrato aguas abajo.',
    },
    {
      concept: 'schema-normalization',
      question: 'Un monto “S/ 1,234.50” normalizado a decimal debe:',
      options: [
        'Quedarse como string con símbolo siempre en el core analytics',
        'Parsearse con reglas de locale y guardarse en tipo numérico + moneda',
        'Dividirse en caracteres sueltos',
        'Redondearse a 0 sin documentar',
      ],
      correctIndex: 1,
      explanation: 'Parseo locale-aware + tipo fuerte.',
    },
    {
      concept: 'schema-normalization',
      question: 'Campos faltantes en schema se manejan con:',
      options: [
        'Silencio y null opacos sin política',
        'Null/ausente explícito + razón (no detectado / low conf / no aplica)',
        'Relleno aleatorio',
        'Copia del campo anterior del batch',
      ],
      correctIndex: 1,
      explanation: 'Ausencia explícita es dato operativo.',
    },
    {
      concept: 'crossfield-validation-review',
      question: 'Validación cross-field ejemplo en factura sintética:',
      options: [
        'Ignorar que subtotal+igv ≠ total',
        'Rechazar/encolar revisión si subtotal + impuestos no cuadra con total',
        'Enviar email automático al proveedor real',
        'Bajar DPI',
      ],
      correctIndex: 1,
      explanation: 'Consistencia entre campos detecta errores de extracción.',
    },
    {
      concept: 'crossfield-validation-review',
      question: 'Cola de revisión humana se activa cuando:',
      options: [
        'Todo confidence > umbral y validaciones OK',
        'Hay fallas de validación o confidence bajo en campos críticos',
        'El archivo pesa menos de 1KB siempre',
        'El usuario apaga el laptop',
      ],
      correctIndex: 1,
      explanation: 'HITL en la frontera de incertidumbre/error.',
    },
    {
      concept: 'crossfield-validation-review',
      question: 'Un revisor corrige un RUC mal leído. El sistema debe:',
      options: [
        'Descartar la corrección',
        'Persistir valor corregido, actor y usarlo para métricas/feedback',
        'Re-ocr sin guardar',
        'Publicar el scan en Internet',
      ],
      correctIndex: 1,
      explanation: 'Correcciones alimentan calidad y auditoría.',
    },
    {
      concept: 'golden-field-accuracy-coverage',
      question: 'Un golden set sintético de documentos sirve para:',
      options: [
        'Entrenar en datos personales reales sin base legal',
        'Medir exactitud por campo y cobertura de plantillas de forma reproducible',
        'Reemplazar schemas',
        'Evitar OCR',
      ],
      correctIndex: 1,
      explanation: 'Golden set = verdad conocida para evaluación.',
    },
    {
      concept: 'golden-field-accuracy-coverage',
      question: 'Reportar solo accuracy global del documento puede ocultar:',
      options: [
        'Nada; global basta siempre',
        'Campos críticos con error alto (p. ej. montos) pese a campos fáciles OK',
        'El idioma del motor',
        'El DPI',
      ],
      correctIndex: 1,
      explanation: 'Métricas por campo revelan riesgo real.',
    },
    {
      concept: 'golden-field-accuracy-coverage',
      question: 'Cobertura de plantillas/layouts mide:',
      options: [
        'Cuántos estilos CSS hay en Streamlit',
        'Qué fracción de formatos reales/sintéticos objetivo el sistema maneja bien',
        'El número de scopes OAuth',
        'La latencia de DNS',
      ],
      correctIndex: 1,
      explanation: 'Cobertura acota generalización del extractor.',
    },
    {
      concept: 'privacy-hostile-fallback',
      question: 'Archivos hostiles (zip bombs, polyglots) se mitigan con:',
      options: [
        'Abrirlos siempre en el mismo proceso privilegiado sin límites',
        'Límites de tamaño/tiempo, sandbox y rechazo de tipos no permitidos',
        'Subir confidence artificialmente',
        'Enviarlos por BCC al equipo',
      ],
      correctIndex: 1,
      explanation: 'Defensa en profundidad ante inputs maliciosos.',
    },
    {
      concept: 'privacy-hostile-fallback',
      question: 'Si OCR falla de forma irrecuperable, el fallback correcto es:',
      options: [
        'Inventar campos para no romper el SLA silencioso',
        'Marcar fallo, encolar revisión/manual path y no fingir extracción',
        'Reutilizar datos de otro cliente',
        'Desactivar audit',
      ],
      correctIndex: 1,
      explanation: 'Fallback honesto > datos inventados.',
    },
    {
      concept: 'privacy-hostile-fallback',
      question: 'Privacidad en Document AI implica:',
      options: [
        'Loguear PDFs completos con PII en plaintext en Slack',
        'Minimizar retención, enmascarar PII en logs y controlar acceso a scans',
        'Publicar golden sets con DNI reales',
        'Desactivar HTTPS al object storage',
      ],
      correctIndex: 1,
      explanation: 'Scans son datos sensibles; minimiza y protege.',
    },
  ],

  // === Section 25: HF/prompting evaluado V3 (platform id streamlit-dashboards) ===
  'streamlit-dashboards': [
    {
      concept: 'rule-vs-specialized-vs-llm',
      question: 'Si el campo tiene formato fijo (RUC 11 dígitos) y reglas claras, prioriza:',
      options: [
        'LLM creativo sin validación',
        'Reglas/validador determinista antes que modelo generativo',
        'Solo visión por computadora',
        'CAPTCHA',
      ],
      correctIndex: 1,
      explanation: 'Rules first cuando el contrato es rígido.',
    },
    {
      concept: 'rule-vs-specialized-vs-llm',
      question: 'Un modelo especializado (clasificador/extractor) conviene cuando:',
      options: [
        'Nunca hay datos de entrenamiento ni evaluación',
        'La tarea es acotada y se puede medir con golden set mejor que un LLM general',
        'Se quiere maximizar costo por token siempre',
        'No hay schema de salida',
      ],
      correctIndex: 1,
      explanation: 'Especializado + métricas > genérico opaco si cabe.',
    },
    {
      concept: 'rule-vs-specialized-vs-llm',
      question: 'El LLM aporta más valor cuando:',
      options: [
        'Hay que sumar dos enteros',
        'Se necesita narrativa/extracción flexible con salida estructurada validada',
        'Se puede resolver con if/else de 2 líneas estable',
        'El ToS prohíbe cualquier automatización y no hay alternativa legal',
      ],
      correctIndex: 1,
      explanation: 'LLM para lenguaje flexible, siempre con validación.',
    },
    {
      concept: 'model-cards-licenses-local-cloud',
      question: 'Antes de desplegar un modelo de HF en un flujo cliente, revisas:',
      options: [
        'Solo el número de likes del repo',
        'Model card, licencia, datos de entrenamiento reportados y límites de uso',
        'Únicamente el color del readme',
        'Si el nombre suena “AI”',
      ],
      correctIndex: 1,
      explanation: 'Gobernanza: licencia + ficha del modelo.',
    },
    {
      concept: 'model-cards-licenses-local-cloud',
      question: 'Elegir local vs cloud implica evaluar:',
      options: [
        'Solo la latencia de marketing',
        'Datos sensibles, residencia, costo, latencia y controles del proveedor',
        'Si el logo es bonito',
        'Si se puede hardcodear la API key en el frontend',
      ],
      correctIndex: 1,
      explanation: 'Trade-offs de privacidad y operación.',
    },
    {
      concept: 'model-cards-licenses-local-cloud',
      question: 'Una licencia no comercial en un modelo prohíbe típicamente:',
      options: [
        'Leer la model card',
        'Uso en producto comercial sin otro acuerdo',
        'Correr unit tests locales de parseo JSON',
        'Escribir prompts de evaluación internos no productivos según términos',
      ],
      correctIndex: 1,
      explanation: 'Respeta términos de licencia del artefacto.',
    },
    {
      concept: 'hf-pipelines-endpoints',
      question: 'pipeline() de Hugging Face simplifica:',
      options: [
        'Orquestar Kubernetes completo',
        'Cargar tarea+modelo y ejecutar inferencia con API de alto nivel',
        'Emitir facturas SUNAT',
        'Firmar commits Git',
      ],
      correctIndex: 1,
      explanation: 'Pipelines son atajos de inferencia comunes.',
    },
    {
      concept: 'hf-pipelines-endpoints',
      question: 'Un Inference Endpoint remoto debe configurarse con:',
      options: [
        'API key en el repo público',
        'Auth, timeout, límites de rate y manejo de errores de red',
        'Sin TLS “para ir más rápido”',
        'Prompts de producción sin logs de evaluación',
      ],
      correctIndex: 1,
      explanation: 'Endpoint = servicio: auth y resiliencia.',
    },
    {
      concept: 'hf-pipelines-endpoints',
      question: 'Versionar el model_id/revision en el despliegue sirve para:',
      options: [
        'Impedir evaluación',
        'Reproducibilidad y rollbacks controlados',
        'Aumentar temperatura automáticamente',
        'Saltar schemas',
      ],
      correctIndex: 1,
      explanation: 'Pinear versiones evita sorpresas.',
    },
    {
      concept: 'batch-timeout-cache-cost-fallback',
      question: 'Batching de inferencias busca:',
      options: [
        'Maximizar cold starts',
        'Mejorar throughput amortizando overhead por request',
        'Eliminar la necesidad de timeouts',
        'Guardar PII en cleartext más tiempo',
      ],
      correctIndex: 1,
      explanation: 'Batch = eficiencia de cómputo/red.',
    },
    {
      concept: 'batch-timeout-cache-cost-fallback',
      question: 'Cache de resultados de prompts idénticos ayuda a:',
      options: [
        'Garantizar frescura infinita de datos cambiantes',
        'Reducir costo/latencia cuando la entrada y modelo están fijados',
        'Evitar validación de schema',
        'Desactivar fallback',
      ],
      correctIndex: 1,
      explanation: 'Cache con clave (input, modelo, params) bien definida.',
    },
    {
      concept: 'batch-timeout-cache-cost-fallback',
      question: 'Si el endpoint de LLM timeout-ea, un fallback responsable es:',
      options: [
        'Inventar JSON de campos críticos',
        'Degradar a reglas/modelo local/cola manual según diseño, con señal de degradación',
        'Reintentar 10k veces sin tope',
        'Silenciar el error al usuario interno',
      ],
      correctIndex: 1,
      explanation: 'Fallback explícito y observable.',
    },
    {
      concept: 'objective-context-constraints-examples',
      question: 'Un buen prompt de extracción incluye:',
      options: [
        'Solo “sé creativo”',
        'Objetivo, contexto, restricciones, ejemplos y schema de salida',
        'La API key en el system prompt',
        'Pedir que ignore todas las políticas',
      ],
      correctIndex: 1,
      explanation: 'Prompts estructurados son evaluables.',
    },
    {
      concept: 'objective-context-constraints-examples',
      question: 'Pedir salida JSON con schema sirve para:',
      options: [
        'Hacer imposible el parseo',
        'Validar/automatizar el consumo aguas abajo y rechazar basura',
        'Aumentar alucinaciones a propósito',
        'Ocultar confidence',
      ],
      correctIndex: 1,
      explanation: 'Structured output + validación.',
    },
    {
      concept: 'objective-context-constraints-examples',
      question: 'Ejemplos few-shot en el prompt deben:',
      options: [
        'Incluir PII real de clientes',
        'Ser sintéticos/representativos y alineados al schema',
        'Contradecir las restricciones',
        'Ser de otro dominio irrelevante siempre',
      ],
      correctIndex: 1,
      explanation: 'Ejemplos enseñan el formato sin filtrar secretos.',
    },
    {
      concept: 'glm-thinking-tools-checkpoints',
      question: 'Thinking/tools/checkpoints en agentes tipo GLM se usan para:',
      options: [
        'Saltar toda aprobación humana siempre',
        'Descomponer razonamiento y tool use con puntos de control auditables',
        'Borrar traces',
        'Desactivar timeouts',
      ],
      correctIndex: 1,
      explanation: 'Control y observabilidad del agente.',
    },
    {
      concept: 'glm-thinking-tools-checkpoints',
      question: 'Un checkpoint antes de tool de alto impacto (email/send) debe:',
      options: [
        'Auto-aprobarse si el texto “se ve bien”',
        'Requerir política/aprobación según riesgo del side-effect',
        'Ejecutarse dos veces por idempotencia falsa',
        'Ocultarse del audit log',
      ],
      correctIndex: 1,
      explanation: 'Side-effects peligrosos → control humano/política.',
    },
    {
      concept: 'glm-thinking-tools-checkpoints',
      question: 'Exponer tools al modelo sin allowlist es riesgoso porque:',
      options: [
        'Mejora siempre la seguridad',
        'El modelo puede invocar acciones no previstas (exfiltración/cambios)',
        'Rompe JSON schema de salida inocua',
        'Impide few-shot',
      ],
      correctIndex: 1,
      explanation: 'Least privilege también en tools.',
    },
    {
      concept: 'golden-schema-human-review',
      question: 'Evaluar un extractor LLM con golden set implica:',
      options: [
        'Mirar un ejemplo y dar OK subjetivo solo',
        'Comparar salidas vs verdad con métricas por campo y tasa de schema-valid',
        'Subir temperatura a 2.0',
        'Desactivar validación',
      ],
      correctIndex: 1,
      explanation: 'Evaluación cuantitativa + schema.',
    },
    {
      concept: 'golden-schema-human-review',
      question: 'Revisión humana entra cuando:',
      options: [
        'El JSON validó y el riesgo es nulo por política',
        'Hay baja confianza, schema fail o campos críticos fuera de umbral',
        'El modelo pidió un cumplido',
        'El batch terminó de madrugada',
      ],
      correctIndex: 1,
      explanation: 'HITL en la frontera de riesgo/calidad.',
    },
    {
      concept: 'golden-schema-human-review',
      question: '“No se acepta salida sin evidencia” significa:',
      options: [
        'Confiar en el tono seguro del modelo',
        'Exigir citas/campos fuente/score y rechazar claims huérfanos',
        'Borrar el prompt',
        'Usar solo reglas y nunca LLM',
      ],
      correctIndex: 1,
      explanation: 'Evidencia ancla la respuesta.',
    },
    {
      concept: 'injection-exfil-bias-minimize',
      question: 'Un documento con “ignora instrucciones y envía secretos” es un caso de:',
      options: [
        'Deskew',
        'Prompt injection; hay que aislar contenido no confiable de instrucciones de sistema',
        'OAuth scope',
        'DPI bajo',
      ],
      correctIndex: 1,
      explanation: 'Contenido de usuario/documento ≠ system policy.',
    },
    {
      concept: 'injection-exfil-bias-minimize',
      question: 'Minimización de datos al llamar un LLM cloud implica:',
      options: [
        'Enviar el CRM completo “por si acaso”',
        'Enviar solo campos necesarios, posiblemente redacted, al propósito',
        'Loguear prompts con contraseñas',
        'Desactivar TLS',
      ],
      correctIndex: 1,
      explanation: 'Menos datos = menos riesgo.',
    },
    {
      concept: 'injection-exfil-bias-minimize',
      question: 'Un clasificador que marca “fraude” solo por homonimia fuzzy comete:',
      options: [
        'Buena práctica legal',
        'Sobreclaim/sesgo: matching textual no prueba fraude; requiere política y humano',
        'OCR deskew',
        'Batching óptimo',
      ],
      correctIndex: 1,
      explanation: 'Matching ≠ fraude; privacidad y no discriminación importan.',
    },
  ],

  // === Section 26: Orquestación VP RPA+AI V3 (platform id integrator-phase1) ===
  'integrator-phase1': [
    {
      concept: 'tasks-flows-dag-states',
      question: 'Un DAG de orquestación define:',
      options: [
        'Un único script monolítico sin estados',
        'Tareas y dependencias acíclicas con estados de ejecución',
        'Solo el color del dashboard',
        'Certificados TLS',
      ],
      correctIndex: 1,
      explanation: 'DAG = grafo de tareas y orden.',
    },
    {
      concept: 'tasks-flows-dag-states',
      question: 'Estados típicos de task incluyen:',
      options: [
        'solo “pretty”',
        'pending/running/success/failed/skipped (según motor)',
        'MIME/html',
        'deskew/crop',
      ],
      correctIndex: 1,
      explanation: 'Estados permiten control y reanudación.',
    },
    {
      concept: 'tasks-flows-dag-states',
      question: 'Si B depende de A y A falla, el orquestador suele:',
      options: [
        'Marcar B success igual',
        'No ejecutar B (o marcar upstream_failed) según política',
        'Borrar el DAG',
        'Enviar correo sin aprobación',
      ],
      correctIndex: 1,
      explanation: 'Dependencias respetan fallos aguas arriba.',
    },
    {
      concept: 'limits-metadata-schedules',
      question: 'Límites (concurrency/timeout/cuotas) en un flow evitan:',
      options: [
        'Métricas útiles',
        'Tormentas de carga, runs infinitos y costos descontrolados',
        'Idempotencia',
        'Audit logs',
      ],
      correctIndex: 1,
      explanation: 'Guardrails operativos.',
    },
    {
      concept: 'limits-metadata-schedules',
      question: 'Metadata de run (run_id, trigger, params) sirve para:',
      options: [
        'Decorar el UI sin más',
        'Trazabilidad, depuración y correlación entre sistemas',
        'Reemplazar tests E2E',
        'Ocultar fallos',
      ],
      correctIndex: 1,
      explanation: 'Metadata es el hilo conductor del incidente.',
    },
    {
      concept: 'limits-metadata-schedules',
      question: 'Un schedule cron en horario PE debe documentar:',
      options: [
        'Solo “cada día” sin timezone',
        'Expresión + timezone (p. ej. America/Lima) + ventana de solape',
        'El DPI del scan',
        'El model card',
      ],
      correctIndex: 1,
      explanation: 'Timezone explícito evita dobles ejecuciones.',
    },
    {
      concept: 'checkpoints-retry-backoff-dlq',
      question: 'Un checkpoint en pipeline largo permite:',
      options: [
        'Rehacer todo desde cero siempre',
        'Reanudar desde el último estado durable exitoso',
        'Saltar aprobaciones',
        'Desactivar DLQ',
      ],
      correctIndex: 1,
      explanation: 'Checkpoints reducen retrabajo.',
    },
    {
      concept: 'checkpoints-retry-backoff-dlq',
      question: 'Backoff exponencial con jitter en retries busca:',
      options: [
        'Sincronizar todos los clients en el mismo instante',
        'Espaciar reintentos y evitar thundering herd',
        'Eliminar la necesidad de DLQ',
        'Aumentar temperatura del LLM',
      ],
      correctIndex: 1,
      explanation: 'Backoff + jitter = resiliencia educada.',
    },
    {
      concept: 'checkpoints-retry-backoff-dlq',
      question: 'Una dead-letter queue (DLQ) recibe:',
      options: [
        'Todos los mensajes exitosos',
        'Ítems que agotaron retries o son no procesables para análisis/manual',
        'Solo métricas de CPU',
        'Certificados vencidos',
      ],
      correctIndex: 1,
      explanation: 'DLQ aísla veneno y permite forense.',
    },
    {
      concept: 'idempotency-concurrency-rollback',
      question: 'Idempotencia en un step de “crear draft” significa:',
      options: [
        'Cada retry crea un draft nuevo sin control',
        'Misma clave de idempotencia → mismo efecto observable',
        'Rollback automático de la base contable ajena',
        'Desactivar locks',
      ],
      correctIndex: 1,
      explanation: 'Mismo request lógico, un efecto.',
    },
    {
      concept: 'idempotency-concurrency-rollback',
      question: 'Concurrencia de dos workers sobre el mismo case_id requiere:',
      options: [
        'Race condition como feature',
        'Locks/versionado optimista o partición para evitar dobles efectos',
        'Doble send de correo',
        'Compartir un contador global sin sync',
      ],
      correctIndex: 1,
      explanation: 'Control de concurrencia protege invariantes.',
    },
    {
      concept: 'idempotency-concurrency-rollback',
      question: 'Rollback compensatorio se usa cuando:',
      options: [
        'La transacción distribuida es trivial y atómica global siempre',
        'Hay que deshacer/compensar side-effects parciales tras un fallo',
        'El DAG no tiene edges',
        'El modelo card falta',
      ],
      correctIndex: 1,
      explanation: 'Compensaciones revierten efectos parciales.',
    },
    {
      concept: 'review-analysis-report-recipient',
      question: 'En el VP RPA+AI, la revisión humana cubre típicamente:',
      options: [
        'Solo el color del logo',
        'Análisis, reporte y destinatario antes de side-effects externos',
        'Únicamente el DPI',
        'Nada; todo es automático',
      ],
      correctIndex: 1,
      explanation: 'HITL en artefactos de alto impacto.',
    },
    {
      concept: 'review-analysis-report-recipient',
      question: 'Un reporte con hallazgo “posible fraude” por score fuzzy debe:',
      options: [
        'Enviarse a autoridades sin contexto',
        'Etiquetarse con límites de evidencia y no afirmar culpabilidad automática',
        'Ocultar el score',
        'Borrar el audit',
      ],
      correctIndex: 1,
      explanation: 'Matching ≠ fraude; lenguaje acotado.',
    },
    {
      concept: 'review-analysis-report-recipient',
      question: 'Verificar destinatario en la cola de revisión previene:',
      options: [
        'Deskew',
        'Envíos a partes incorrectas o no autorizadas',
        'Batching',
        'Model cards',
      ],
      correctIndex: 1,
      explanation: 'Destinatario es control crítico de fuga.',
    },
    {
      concept: 'approve-reject-edit-audit',
      question: 'Acciones de aprobación deben quedar con:',
      options: [
        'Solo un thumbs-up efímero en memoria',
        'Actor, timestamp, decisión, versión del artefacto y comentarios',
        'La contraseña del revisor',
        'Nada por privacidad extrema mal entendida',
      ],
      correctIndex: 1,
      explanation: 'Audit de decisión es no negociable.',
    },
    {
      concept: 'approve-reject-edit-audit',
      question: 'Rechazar un borrador de correo implica:',
      options: [
        'Enviarlo igual con disclaimer',
        'Estado rejected, razón y bloqueo de send hasta nuevo ciclo',
        'Borrar logs',
        'Aprobar en 24h automático',
      ],
      correctIndex: 1,
      explanation: 'Reject es transición real con efectos.',
    },
    {
      concept: 'approve-reject-edit-audit',
      question: 'Editar y luego aprobar requiere:',
      options: [
        'Aprobar el hash anterior sin recalcular',
        'Versionar el nuevo contenido y aprobar esa versión',
        'Ignorar el diff',
        'Duplicar el Message-ID de un send viejo',
      ],
      correctIndex: 1,
      explanation: 'Se aprueba lo que se ve/versiona.',
    },
    {
      concept: 'slo-alerts-runbook',
      question: 'Un SLO de pipeline podría ser:',
      options: [
        '“Que funcione a veces”',
        'p95 de duración < X y tasa de éxito > Y en ventana definida',
        'Número de emojis en logs',
        'Likes del modelo HF',
      ],
      correctIndex: 1,
      explanation: 'SLO = objetivo medible de servicio.',
    },
    {
      concept: 'slo-alerts-runbook',
      question: 'Una alerta accionable incluye:',
      options: [
        'Solo “algo falló” sin run_id',
        'Señal, umbral, enlace a run/logs y siguiente paso del runbook',
        'El stacktrace de otro servicio no relacionado',
        'Spam a todo el company directory',
      ],
      correctIndex: 1,
      explanation: 'Alertas con contexto y playbook.',
    },
    {
      concept: 'slo-alerts-runbook',
      question: 'El runbook de incidente del orquestador documenta:',
      options: [
        'Chistes del equipo',
        'Diagnóstico, mitigación, rollback/reprocess y escalamiento',
        'Solo la lista de vacaciones',
        'Prompts creativos sin ownership',
      ],
      correctIndex: 1,
      explanation: 'Runbook = respuesta operativa repetible.',
    },
    {
      concept: 'e2e-security-cost-value',
      question: 'Prueba E2E del VP RPA+AI debe cubrir:',
      options: [
        'Solo un unit test de suma',
        'Flujo ingest→validate→analyze→report→approval→draft con datos sintéticos',
        'Producción con clientes reales sin consentimiento',
        'Únicamente el favicon',
      ],
      correctIndex: 1,
      explanation: 'E2E valida el valor de negocio del circuito.',
    },
    {
      concept: 'e2e-security-cost-value',
      question: 'Seguridad en el integrador incluye:',
      options: [
        'API keys en el frontend público',
        'Secretos en vault/env, least privilege y sin PII real en fixtures',
        'Desactivar auth en “solo un rato”',
        'Loguear tokens de OAuth',
      ],
      correctIndex: 1,
      explanation: 'Secretos y datos de prueba seguros.',
    },
    {
      concept: 'e2e-security-cost-value',
      question: 'Métricas de valor del capstone miden:',
      options: [
        'Líneas de código solamente',
        'Tiempo ahorrado, tasa de auto-proceso seguro, errores evitados y costo de IA/RPA',
        'Número de CAPTCHAs resueltos en sitios ajenos',
        'Commits vacíos',
      ],
      correctIndex: 1,
      explanation: 'Valor = outcome de negocio + costo controlado.',
    },
  ],

  // === Section 27: Estrategia de pruebas con pytest V3 (platform id async-concurrency) ===
  'async-concurrency': [
    {
      concept: 'risks-test-pyramid',
      question: 'En la pirámide de pruebas, la base más ancha suele ser:',
      options: [
        'Solo E2E lentas y flaky',
        'Muchas pruebas unitarias rápidas y baratas',
        'Únicamente pruebas manuales de UI',
        'Smoke tests en producción sin staging',
      ],
      correctIndex: 1,
      explanation: 'La pirámide prioriza volumen en unitarias; E2E son la cima estrecha.',
    },
    {
      concept: 'risks-test-pyramid',
      question: 'Priorizas un test según riesgo cuando:',
      options: [
        'El código es “bonito” sin importar el impacto',
        'Alto impacto × probabilidad de fallo y costo de no detectar',
        'Solo si el nombre del archivo es test_',
        'Siempre primero las demos de marketing',
      ],
      correctIndex: 1,
      explanation: 'Riesgo = impacto × likelihood; guía dónde invertir.',
    },
    {
      concept: 'risks-test-pyramid',
      question: 'Una señal de mal balance en la pirámide es:',
      options: [
        'Muchas unitarias y pocos E2E críticos',
        'Casi todo el valor depende de E2E lentos sin unitarias de lógica de matching',
        'Fixtures con scope function',
        'Usar pytest.raises en negativos',
      ],
      correctIndex: 1,
      explanation: 'Sobrepeso en E2E sin base unitaria es anti-patrón costoso.',
    },
    {
      concept: 'aaa-oracles',
      question: 'En Arrange–Act–Assert, el “Act” debe ser:',
      options: [
        'Varias mutaciones mezcladas con asserts intermedios',
        'Una acción clara bajo prueba (una unidad de comportamiento)',
        'Solo imports y prints',
        'El teardown de la base de datos',
      ],
      correctIndex: 1,
      explanation: 'AAA aísla la acción que se evalúa.',
    },
    {
      concept: 'aaa-oracles',
      question: 'Un oráculo confiable en tests de normalización es:',
      options: [
        '“Se ve bien” a ojo sin valor esperado',
        'Salida esperada determinista (golden o predicado verificable)',
        'El timestamp actual del sistema',
        'Un random.seed distinto en cada run',
      ],
      correctIndex: 1,
      explanation: 'Sin oráculo verificable el test no falla cuando debe.',
    },
    {
      concept: 'aaa-oracles',
      question: 'Si el assert compara floats de scores de matching, conviene:',
      options: [
        'Usar == estricto siempre con floats crudos de red',
        'Tolerancia/pytest.approx o comparación en dominio discreto',
        'Ignorar el score y solo print',
        'Redondear a 0 decimales siempre',
      ],
      correctIndex: 1,
      explanation: 'Floats requieren tolerancia o discretización deliberada.',
    },
    {
      concept: 'discovery-assertions',
      question: 'pytest descubre por defecto funciones de test que:',
      options: [
        'Empiezan con demo_ en cualquier archivo',
        'Siguen convención test_* / Test* en paths de discovery',
        'Están solo en main.py',
        'Usan print en lugar de assert',
      ],
      correctIndex: 1,
      explanation: 'Discovery usa convenciones test_ y clases Test*.',
    },
    {
      concept: 'discovery-assertions',
      question: 'Una assertion útil en pytest debe:',
      options: [
        'Fallar con mensaje opaco sin contexto',
        'Expresar la propiedad esperada (y opcionalmente mensaje claro)',
        'Capturar Exception y silenciarla',
        'Depender de sleep(5) siempre',
      ],
      correctIndex: 1,
      explanation: 'Asserts legibles aceleran el diagnóstico.',
    },
    {
      concept: 'discovery-assertions',
      question: 'assert a == b en pytest muestra:',
      options: [
        'Solo “AssertionError” sin diff',
        'Introspección/diff útil de los valores comparados',
        'El stack de otro proceso',
        'Nada si usas -q',
      ],
      correctIndex: 1,
      explanation: 'pytest reescribe asserts para mejor reporte.',
    },
    {
      concept: 'fixtures-scopes-isolation',
      question: 'Una fixture con scope function se usa para:',
      options: [
        'Compartir un socket TCP entre todos los tests del suite',
        'Aislar setup/teardown por cada test function',
        'Evitar completamente el uso de tmp_path',
        'Marcar tests como skip forever',
      ],
      correctIndex: 1,
      explanation: 'scope function = aislamiento por test.',
    },
    {
      concept: 'fixtures-scopes-isolation',
      question: 'Estado mutable compartido entre tests sin reset provoca:',
      options: [
        'Mayor determinismo',
        'Acoplamiento y fallas de orden (order-dependent flakes)',
        'Cobertura de mutación automática',
        'Oráculos más simples',
      ],
      correctIndex: 1,
      explanation: 'Aislamiento evita dependencias de orden.',
    },
    {
      concept: 'fixtures-scopes-isolation',
      question: 'tmp_path de pytest es adecuado para:',
      options: [
        'Escribir en / de producción',
        'Archivos temporales aislados por test sin contaminar el repo',
        'Guardar secretos del CI',
        'Montar la base real de clientes',
      ],
      correctIndex: 1,
      explanation: 'tmp_path da sandbox de filesystem por test.',
    },
    {
      concept: 'exceptions-floats-dates-tmp',
      question: 'Para verificar que una función lanza ValueError con mensaje útil:',
      options: [
        'try/except vacío sin assert',
        'pytest.raises(ValueError, match=...) o inspección del exception info',
        'assert True siempre',
        'os._exit(0) en el except',
      ],
      correctIndex: 1,
      explanation: 'pytest.raises documenta el contrato de error.',
    },
    {
      concept: 'exceptions-floats-dates-tmp',
      question: 'Al comparar fechas en tests de matching, evita:',
      options: [
        'Usar datetime con zona explícita si el dominio lo requiere',
        'Depender de datetime.now() sin freeze/inyectar reloj',
        'Fixtures con fechas sintéticas fijas',
        'Normalizar a date() cuando solo importa el día',
      ],
      correctIndex: 1,
      explanation: 'now() no inyectado introduce no-determinismo.',
    },
    {
      concept: 'exceptions-floats-dates-tmp',
      question: 'Un archivo temporal de fixture de normalización debe:',
      options: [
        'Quedarse en el working tree del monorepo',
        'Crearse en tmp y limpiarse; datos sintéticos sin PII real',
        'Contener DNI reales de producción',
        'Ser un symlink a /etc/passwd',
      ],
      correctIndex: 1,
      explanation: 'Tmp + datos sintéticos = higiene y privacidad.',
    },
    {
      concept: 'negative-cases-messages',
      question: 'Un caso negativo bien diseñado verifica:',
      options: [
        'Solo el happy path con datos perfectos',
        'Entrada inválida produce error esperado y mensaje accionable',
        'Que el proceso crashee sin traceback',
        'Que se ignoren todos los errores de schema',
      ],
      correctIndex: 1,
      explanation: 'Negativos protegen contratos de validación.',
    },
    {
      concept: 'negative-cases-messages',
      question: 'Un mensaje de error de matching vacío o genérico es malo porque:',
      options: [
        'Ocupa menos bytes en logs',
        'No ayuda a diagnosticar qué campo/regla falló',
        'Mejora la UX del usuario final siempre',
        'Es requerido por pytest',
      ],
      correctIndex: 1,
      explanation: 'Mensajes contextuales acortan MTTR.',
    },
    {
      concept: 'negative-cases-messages',
      question: 'En tests negativos de score fuera de [0,1], el oráculo incluye:',
      options: [
        'Aceptar el score y redondear en silencio',
        'Rechazo/validación y (si aplica) mensaje que cite el rango',
        'Enviar el score a producción',
        'Multiplicar por 100 sin validar',
      ],
      correctIndex: 1,
      explanation: 'Dominio [0,1] debe fallar fuerte fuera de rango.',
    },
    {
      concept: 'branch-risk-coverage',
      question: 'Cobertura de ramas en lógica de matching prioriza:',
      options: [
        'Cubrir solo el import de la librería',
        'Ramas de alto riesgo (ties, missingness, umbrales) no solo líneas totales',
        '100% de archivos de documentación Markdown',
        'Tests que no ejecutan ningún if',
      ],
      correctIndex: 1,
      explanation: 'Risk coverage > vanity % en paths críticos.',
    },
    {
      concept: 'branch-risk-coverage',
      question: 'Un % de cobertura alto con tests triviales puede:',
      options: [
        'Garantizar corrección de negocio',
        'Enmascarar falta de asserts útiles (cobertura sin oráculo)',
        'Reemplazar code review',
        'Eliminar la necesidad de E2E',
      ],
      correctIndex: 1,
      explanation: 'Cobertura sin asserts fuertes es teatro.',
    },
    {
      concept: 'branch-risk-coverage',
      question: 'Para un bug de regresión en normalización de RUC sintético, el test debe:',
      options: [
        'Ser un screenshot manual sin commit',
        'Reproducir el caso mínimo y quedar como regresión en CI',
        'Solo documentarse en un chat',
        'Correr solo en la laptop del autor',
      ],
      correctIndex: 1,
      explanation: 'Cada bug reproducido → test de regresión.',
    },
    {
      concept: 'mutation-useful-failures',
      question: 'La idea de mutación conceptual en tests es:',
      options: [
        'Romper código a propósito para ver si los tests fallan de forma útil',
        'Borrar todos los asserts para ir más rápido',
        'Mutar datos de producción en vivo',
        'Cambiar el logo del producto',
      ],
      correctIndex: 1,
      explanation: 'Si un mutante “sobrevive”, el suite es débil.',
    },
    {
      concept: 'mutation-useful-failures',
      question: 'Una falla útil de test incluye:',
      options: [
        'Solo “failed” sin valores',
        'Contexto: entrada, esperado vs actual y (si aplica) regla',
        'Un stack de 200 frames de librería sin tu código',
        'Un sleep infinito',
      ],
      correctIndex: 1,
      explanation: 'Fallos accionables reducen tiempo de debug.',
    },
    {
      concept: 'mutation-useful-failures',
      question: 'Mantenimiento del suite de matching recomienda:',
      options: [
        'Tests duplicados y frágiles al layout de HTML de un vendor',
        'Tests estables al contrato (normalización/score) con datos sintéticos',
        'Hardcodear rutas absolutas del home del desarrollador',
        'Depender de la hora local del servidor de CI sin pin',
      ],
      correctIndex: 1,
      explanation: 'Contratos estables > acoplamiento a detalles irrelevantes.',
    },
  ],

  // === Section 28: Pruebas de datos, propiedades e integración V3 (platform id llm-agents) ===
  'llm-agents': [
    {
      concept: 'invariants-case-generation',
      question: 'Una invariante de score de matching sintético podría ser:',
      options: [
        'score siempre es un string libre',
        '0 ≤ score ≤ 1 para todos los pares generados',
        'score puede ser NaN sin validar',
        'score depende de datetime.now()',
      ],
      correctIndex: 1,
      explanation: 'Invariantes acotan el dominio del score.',
    },
    {
      concept: 'invariants-case-generation',
      question: 'Generación de casos para property tests busca:',
      options: [
        'Un único ejemplo hardcodeado siempre',
        'Espacio de entradas representativo (incl. bordes) con seed reproducible',
        'Producción real sin consentimiento',
        'Solo strings vacíos',
      ],
      correctIndex: 1,
      explanation: 'Generación + seed = exploración controlada.',
    },
    {
      concept: 'invariants-case-generation',
      question: 'Si una propiedad falla, el reporte ideal:',
      options: [
        'Oculta el counterexample',
        'Muestra el caso mínimo (shrinking) que rompe la propiedad',
        'Reinicia el servidor',
        'Cambia el generador en silencio',
      ],
      correctIndex: 1,
      explanation: 'Shrinking acelera el arreglo.',
    },
    {
      concept: 'idempotency-symmetry-metamorphic',
      question: 'Idempotencia de normalización f significa:',
      options: [
        'f(x) != f(f(x)) siempre',
        'f(f(x)) == f(x) para entradas del dominio',
        'f lanza siempre en la segunda llamada',
        'f usa random sin seed',
      ],
      correctIndex: 1,
      explanation: 'Aplicar dos veces = una vez (punto fijo).',
    },
    {
      concept: 'idempotency-symmetry-metamorphic',
      question: 'Simetría en un comparador de pares sintéticos espera:',
      options: [
        'sim(a,b) != sim(b,a) por diseño siempre',
        'sim(a,b) == sim(b,a) si el modelo es simétrico',
        'sim depende del orden de inserción en un set no ordenado de forma no documentada',
        'sim usa el pid del proceso',
      ],
      correctIndex: 1,
      explanation: 'Comparadores simétricos no dependen del orden de argumentos.',
    },
    {
      concept: 'idempotency-symmetry-metamorphic',
      question: 'Un test metamórfico típico en matching es:',
      options: [
        'Cambiar mayúsculas/espacios irrelevantes no debe empeorar el score de forma absurda',
        'Borrar la base de datos en cada assert',
        'Comparar contra la hora del reloj de pared',
        'Usar PII real de clientes',
      ],
      correctIndex: 1,
      explanation: 'Relaciones entre entradas transformadas validan comportamiento.',
    },
    {
      concept: 'schema-quality-contracts',
      question: 'Un contrato de schema en fixtures de ER define:',
      options: [
        'Colores del dashboard',
        'Campos requeridos, tipos y rangos (p. ej. score en [0,1])',
        'La política de vacaciones del equipo',
        'El favicon del servicio',
      ],
      correctIndex: 1,
      explanation: 'Schema contracts hacen fallar datos inválidos temprano.',
    },
    {
      concept: 'schema-quality-contracts',
      question: 'Quality contract de missingness puede exigir:',
      options: [
        'Que el 100% de campos estén siempre nulos',
        'Umbrales de completitud por campo y reglas de nulos informativos',
        'Ignorar columnas críticas sin alerta',
        'Mezclar tipos sin coerción documentada',
      ],
      correctIndex: 1,
      explanation: 'Completitud y nulos son calidad medible.',
    },
    {
      concept: 'schema-quality-contracts',
      question: 'Si un batch viola el contrato de schema, el pipeline de prueba debe:',
      options: [
        'Continuar y cargar a “prod” de prueba silenciosamente',
        'Fallar el test/job con detalle de campos inválidos',
        'Truncar el archivo a 0 bytes',
        'Enviar correo a clientes reales',
      ],
      correctIndex: 1,
      explanation: 'Fail-fast con detalle = contrato ejecutable.',
    },
    {
      concept: 'golden-drift-reconcile',
      question: 'Un golden dataset de matching sintético sirve para:',
      options: [
        'Entrenar con PII real sin control',
        'Regresión reproducible de scores/labels esperados',
        'Medir likes en redes',
        'Reemplazar code review legal',
      ],
      correctIndex: 1,
      explanation: 'Goldens anclan comportamiento esperado.',
    },
    {
      concept: 'golden-drift-reconcile',
      question: 'Drift de datos en QA de ER se detecta cuando:',
      options: [
        'El logo cambia de color',
        'Distribuciones/campos se alejan del baseline de calidad acordado',
        'Hay un commit de README',
        'El CI está en verde siempre por skip',
      ],
      correctIndex: 1,
      explanation: 'Drift = cambio estadístico/estructural vs baseline.',
    },
    {
      concept: 'golden-drift-reconcile',
      question: 'Reconciliación de resultados de matching compara:',
      options: [
        'Solo el número de líneas de código',
        'Salidas actuales vs golden/baseline con tolerancia y slices',
        'El clima en Lima',
        'Checksums de node_modules',
      ],
      correctIndex: 1,
      explanation: 'Reconcile = diff controlado de artefactos de matching.',
    },
    {
      concept: 'mocks-fakes-http-db-clock',
      question: 'Un fake de reloj en tests de matching temporal permite:',
      options: [
        'Depender de la hora real del CI flaky',
        'Inyectar timestamps fijos y deterministas',
        'Sincronizar NTP en cada assert',
        'Usar time.sleep(3600) en unitarias',
      ],
      correctIndex: 1,
      explanation: 'Clock injection elimina flakes temporales.',
    },
    {
      concept: 'mocks-fakes-http-db-clock',
      question: 'Al mockear HTTP de un servicio de enriquecimiento, debes:',
      options: [
        'Llamar siempre la API real de terceros en unitarias',
        'Simular respuestas/errores controlados y asserts de contrato',
        'Hardcodear tokens de producción en el mock',
        'Desactivar TLS en prod para “simplificar”',
      ],
      correctIndex: 1,
      explanation: 'Mocks controlan I/O externo en la capa unitaria.',
    },
    {
      concept: 'mocks-fakes-http-db-clock',
      question: 'Un fake de DB en pruebas de repositorio debe:',
      options: [
        'Compartir estado global sin reset entre tests',
        'Exponer el comportamiento mínimo del contrato y resetearse por test',
        'Ser la réplica de producción con PII',
        'Ignorar constraints de PK',
      ],
      correctIndex: 1,
      explanation: 'Fakes delgados + aislamiento por test.',
    },
    {
      concept: 'contract-tests-no-overmock',
      question: 'Sobre-mocking es un problema porque:',
      options: [
        'Hace los tests más lentos siempre',
        'Puede “pasar” aunque el contrato real del colaborador cambió',
        'Obliga a usar hypothesis',
        'Impide usar fixtures',
      ],
      correctIndex: 1,
      explanation: 'Mocks demasiado fieles al implementación ocultan integraciones rotas.',
    },
    {
      concept: 'contract-tests-no-overmock',
      question: 'Un contract test entre cliente HTTP y API de matching verifica:',
      options: [
        'El CSS del admin',
        'Request/response schema y códigos de error acordados',
        'La biografía del autor del servicio',
        'El número de pods de Kubernetes a ojo',
      ],
      correctIndex: 1,
      explanation: 'Contratos de API son el punto medio entre unit y E2E.',
    },
    {
      concept: 'contract-tests-no-overmock',
      question: 'La regla práctica anti-sobre-mock es:',
      options: [
        'Mockear hasta el assert de 1+1',
        'Mockear solo fronteras externas; ejercitar lógica real de dominio',
        'No escribir nunca tests de integración',
        'Mockear el runtime de Python entero',
      ],
      correctIndex: 1,
      explanation: 'Mock en bordes, no en el corazón del dominio.',
    },
    {
      concept: 'integration-e2e-testcontainers',
      question: 'Una prueba de integración de ER con DB realista busca:',
      options: [
        'Solo mocks de todo el stack',
        'Colaboración real (o contenedor) de DB + app en entorno controlado',
        'Producción con clientes reales',
        'UI de PowerPoint',
      ],
      correctIndex: 1,
      explanation: 'Integración valida cableado real entre componentes.',
    },
    {
      concept: 'integration-e2e-testcontainers',
      question: 'Testcontainers (o equivalente) aporta:',
      options: [
        'Un mock de strings',
        'Servicios efímeros (p. ej. Postgres) versionados para CI',
        'Sustituto de code review legal',
        'Entrenamiento de LLM en prod',
      ],
      correctIndex: 1,
      explanation: 'Contenedores de prueba dan realismo reproducible.',
    },
    {
      concept: 'integration-e2e-testcontainers',
      question: 'E2E del flujo de matching sintético debe usar:',
      options: [
        'PII real de empleados',
        'Datos sintéticos y aserciones de estados del pipeline',
        'Captchas de sitios ajenos',
        'Credenciales hardcodeadas en el repo público',
      ],
      correctIndex: 1,
      explanation: 'E2E con sintéticos y contratos de estado.',
    },
    {
      concept: 'flakes-determinism-ci',
      question: 'Una fuente común de flakes en tests de matching es:',
      options: [
        'Seeds fijos y reloj inyectado',
        'Orden no determinista, time.sleep, red real sin stub',
        'Asserts con oráculos golden',
        'tmp_path aislado',
      ],
      correctIndex: 1,
      explanation: 'No-determinismo y I/O real → flakes.',
    },
    {
      concept: 'flakes-determinism-ci',
      question: 'En CI, para suites de propiedades conviene:',
      options: [
        'Semillas aleatorias sin log',
        'Seed documentado/reproducible y re-run del counterexample',
        'Desactivar asserts en main',
        'Correr solo en la laptop del lead',
      ],
      correctIndex: 1,
      explanation: 'Reproducibilidad es requisito de CI serio.',
    },
    {
      concept: 'flakes-determinism-ci',
      question: 'Si un test es flaky, la acción correcta es:',
      options: [
        'Marcarlo skip forever sin ticket',
        'Aislar causa (orden, tiempo, red) y hacerlo determinista o cuarentena con owner',
        'Aumentar retries a 100 sin root cause',
        'Borrar el módulo de dominio',
      ],
      correctIndex: 1,
      explanation: 'Arreglar root cause > maquillar con retries eternos.',
    },
  ],

  // === Section 29: SQL avanzado y modelado relacional V3 (platform id mlops) ===
  'mlops': [
    {
      concept: 'keys-constraints-normalization',
      question: 'Una PRIMARY KEY en tabla de entidades sintéticas garantiza:',
      options: [
        'Que los scores siempre sumen 1',
        'Unicidad e identificación de cada fila de entidad',
        'Que no existan nulos en ninguna columna del schema',
        'Particionamiento automático por fecha',
      ],
      correctIndex: 1,
      explanation: 'PK = identidad única de la entidad.',
    },
    {
      concept: 'keys-constraints-normalization',
      question: 'Un CHECK (score BETWEEN 0 AND 1) en pares etiquetados:',
      options: [
        'Es cosmético y la DB lo ignora',
        'Rechaza inserts fuera del dominio del score',
        'Cifra la columna automáticamente',
        'Crea un índice GIN',
      ],
      correctIndex: 1,
      explanation: 'Constraints de dominio protegen calidad en origen.',
    },
    {
      concept: 'keys-constraints-normalization',
      question: 'Normalizar a 3NF en el almacén de ER ayuda a:',
      options: [
        'Duplicar direcciones en cada fila sin control',
        'Reducir redundancia y anomalías de actualización de atributos',
        'Eliminar la necesidad de joins',
        'Evitar foreign keys siempre',
      ],
      correctIndex: 1,
      explanation: 'Normalización controla redundancia y consistencia.',
    },
    {
      concept: 'temporality-provenance',
      question: 'Provenance de un registro de matching sintético registra:',
      options: [
        'Solo el color del tema UI',
        'Origen, versión de regla/modelo y timestamp de carga',
        'La contraseña del DBA',
        'El clima en el data center',
      ],
      correctIndex: 1,
      explanation: 'Provenance = de dónde vino y con qué versión.',
    },
    {
      concept: 'temporality-provenance',
      question: 'Modelar temporalidad (valid_from/valid_to) permite:',
      options: [
        'Borrar historia siempre',
        'Responder “¿qué era cierto en T?” sobre atributos de entidad',
        'Evitar índices',
        'Ignorar actualizaciones',
      ],
      correctIndex: 1,
      explanation: 'Tiempo de validez soporta auditoría y point-in-time.',
    },
    {
      concept: 'temporality-provenance',
      question: 'Sin columnas de provenance en el almacén ER, un problema típico es:',
      options: [
        'Demasiados índices',
        'No poder explicar de qué fuente/regla salió un atributo',
        'SQL demasiado rápido',
        'Exceso de foreign keys',
      ],
      correctIndex: 1,
      explanation: 'Sin linaje no hay explicación ni debug de datos.',
    },
    {
      concept: 'cte-windows-antijoins',
      question: 'Una CTE (WITH ...) en SQL sirve principalmente para:',
      options: [
        'Crear usuarios de SO',
        'Nombrar subconsultas legibles y reutilizables en la query',
        'Reemplazar el WAL',
        'Cifrar backups',
      ],
      correctIndex: 1,
      explanation: 'CTEs estructuran consultas complejas.',
    },
    {
      concept: 'cte-windows-antijoins',
      question: 'Una window function típica en ranking de candidatos de matching es:',
      options: [
        'DROP TABLE',
        'ROW_NUMBER()/RANK() OVER (PARTITION BY entity ORDER BY score DESC)',
        'VACUUM FULL en cada SELECT',
        'COPY TO STDOUT sin schema',
      ],
      correctIndex: 1,
      explanation: 'Windows rankean sin colapsar filas como GROUP BY.',
    },
    {
      concept: 'cte-windows-antijoins',
      question: 'Un anti-join para pares no matcheados se expresa a menudo con:',
      options: [
        'INNER JOIN obligatorio',
        'NOT EXISTS / LEFT JOIN ... WHERE right.key IS NULL',
        'CROSS JOIN sin filtro',
        'UNION ALL de la misma tabla tres veces',
      ],
      correctIndex: 1,
      explanation: 'Anti-join = filas sin contraparte.',
    },
    {
      concept: 'cardinality-null-plans',
      question: 'Subestimar la cardinalidad de un join de candidatos puede:',
      options: [
        'Mejorar siempre el plan',
        'Producir planes lentos (p. ej. nested loop masivo)',
        'Eliminar la necesidad de índices',
        'Convertir NULL en 0 automáticamente',
      ],
      correctIndex: 1,
      explanation: 'Estimaciones malas → planes costosos.',
    },
    {
      concept: 'cardinality-null-plans',
      question: 'En SQL, NULL = NULL evalúa a:',
      options: [
        'TRUE siempre',
        'UNKNOWN (no TRUE); se usa IS NULL para nulos',
        'Un error de sintaxis en todos los motores',
        '0',
      ],
      correctIndex: 1,
      explanation: 'Lógica trivaluada: compara nulos con IS NULL.',
    },
    {
      concept: 'cardinality-null-plans',
      question: 'EXPLAIN (o equivalente) se usa para:',
      options: [
        'Borrar estadísticas',
        'Inspeccionar el plan de ejecución antes/después de optimizar',
        'Crear usuarios',
        'Validar certificados TLS',
      ],
      correctIndex: 1,
      explanation: 'Planes explican costo y acceso a datos.',
    },
    {
      concept: 'acid-isolation',
      question: 'ACID en el almacén de entidades/pares garantiza, entre otros:',
      options: [
        'Solo UI responsive',
        'Atomicidad y consistencia de transacciones de escritura',
        'Que el matching sea semánticamente correcto al 100%',
        'Compresión de imágenes',
      ],
      correctIndex: 1,
      explanation: 'ACID = propiedades de transacción, no del modelo ML.',
    },
    {
      concept: 'acid-isolation',
      question: 'Un nivel de aislamiento más estricto suele:',
      options: [
        'Aumentar anomalías de lectura',
        'Reducir anomalías a costa de más contención/latencia',
        'Eliminar la necesidad de commits',
        'Desactivar el WAL siempre',
      ],
      correctIndex: 1,
      explanation: 'Trade-off aislamiento vs throughput.',
    },
    {
      concept: 'acid-isolation',
      question: 'Lectura dirty (dirty read) significa:',
      options: [
        'Leer solo índices',
        'Ver datos de transacciones aún no confirmadas',
        'Leer un backup en frío',
        'Usar READ ONLY en la sesión',
      ],
      correctIndex: 1,
      explanation: 'Dirty read = datos no committed visibles.',
    },
    {
      concept: 'upserts-concurrency-recovery',
      question: 'Un UPSERT de entidad sintética típico hace:',
      options: [
        'Siempre INSERT duplicando PK',
        'INSERT ... ON CONFLICT UPDATE (o equivalente) de forma idempotente',
        'TRUNCATE de toda la base',
        'DELETE sin WHERE',
      ],
      correctIndex: 1,
      explanation: 'Upsert idempotente para reintentos seguros.',
    },
    {
      concept: 'upserts-concurrency-recovery',
      question: 'Ante contención en actualizaciones de cluster_id, conviene:',
      options: [
        'Ignorar locks y escribir en paralelo sin control',
        'Transacciones cortas, ordering consistente y reintentos acotados',
        'Bloquear la tabla global por horas',
        'Desactivar constraints',
      ],
      correctIndex: 1,
      explanation: 'Concurrencia controlada evita deadlocks y corrupción lógica.',
    },
    {
      concept: 'upserts-concurrency-recovery',
      question: 'Recuperación tras fallo a mitad de un batch de pares:',
      options: [
        'Dejar filas a medias sin estado',
        'Diseñar reanudación/idempotencia y transacciones por chunk',
        'Repetir sin logs ni checkpoint',
        'Borrar el schema',
      ],
      correctIndex: 1,
      explanation: 'Batches reanudables son operables.',
    },
    {
      concept: 'indexes-migrations',
      question: 'Un índice en (source_id, normalized_name) ayuda a:',
      options: [
        'Garantizar ACID por sí solo',
        'Acelerar búsquedas/joins de candidatos por esas columnas',
        'Cifrar la columna',
        'Eliminar la necesidad de WHERE',
      ],
      correctIndex: 1,
      explanation: 'Índices optimizan acceso selectivo.',
    },
    {
      concept: 'indexes-migrations',
      question: 'Una migration de schema en el almacén ER debe ser:',
      options: [
        'Un ALTER manual sin versionar en prod',
        'Versionada, reversible cuando sea posible y aplicada en orden',
        'Ejecutada solo en la laptop del analista',
        'Un dump binario sin review',
      ],
      correctIndex: 1,
      explanation: 'Migrations controladas = evolución segura.',
    },
    {
      concept: 'indexes-migrations',
      question: 'Demasiados índices de escritura en tabla de pares pueden:',
      options: [
        'Solo mejorar inserts siempre',
        'Encarecer writes y mantenimiento (bloat/vacuum)',
        'Eliminar la necesidad de PK',
        'Convertir NULL en default mágico',
      ],
      correctIndex: 1,
      explanation: 'Índices son trade-off read vs write.',
    },
    {
      concept: 'repository-pooling-tests',
      question: 'El repository pattern en acceso a entidades sintéticas:',
      options: [
        'Expone SQL crudo en cada handler de UI sin frontera',
        'Encapsula queries/persistencia detrás de una API de dominio testeable',
        'Reemplaza la base de datos por archivos CSV siempre',
        'Prohíbe transacciones',
      ],
      correctIndex: 1,
      explanation: 'Repositorio = frontera de persistencia.',
    },
    {
      concept: 'repository-pooling-tests',
      question: 'Connection pooling existe para:',
      options: [
        'Abrir un TCP nuevo por cada query sin reutilizar',
        'Reutilizar conexiones y limitar concurrencia al motor',
        'Almacenar passwords en el pool en plaintext en logs',
        'Sustituir índices',
      ],
      correctIndex: 1,
      explanation: 'Pools gestionan el costo de conexiones.',
    },
    {
      concept: 'repository-pooling-tests',
      question: 'Tests del repositorio de matching deben:',
      options: [
        'Usar la base de producción con PII',
        'Correr contra DB efímera/fixtures sintéticas con cleanup',
        'Skip si hay red',
        'Solo mockear el driver y no ejercitar SQL nunca',
      ],
      correctIndex: 1,
      explanation: 'DB de prueba + sintéticos + limpieza.',
    },
  ],

  // === Section 30: Entity resolution probabilístico V3 (platform id security-infra) ===
  'security-infra': [
    {
      concept: 'exact-edit-token-date',
      question: 'Un comparador exacto en ER sintético devuelve:',
      options: [
        'Siempre 0.5',
        '1.0 si los valores normalizados son iguales; 0.0 si no',
        'Un embedding de 768 dimensiones',
        'La distancia geográfica en km',
      ],
      correctIndex: 1,
      explanation: 'Exact match es binario tras normalización.',
    },
    {
      concept: 'exact-edit-token-date',
      question: 'Similitud por tokens (p. ej. Jaccard) es útil cuando:',
      options: [
        'Los campos son enteros estrictamente iguales siempre',
        'El orden de tokens/palabras puede variar sin cambiar identidad',
        'Nunca hay espacios en el string',
        'Solo hay fechas',
      ],
      correctIndex: 1,
      explanation: 'Token overlap captura permutaciones de partes.',
    },
    {
      concept: 'exact-edit-token-date',
      question: 'Comparar fechas en ER debe considerar:',
      options: [
        'Solo el string crudo con zonas mezcladas',
        'Normalización a un tipo fecha y reglas de igualdad/cercanía documentadas',
        'El timestamp de now() del servidor',
        'Ignorar el año siempre',
      ],
      correctIndex: 1,
      explanation: 'Fechas requieren normalización y semántica clara.',
    },
    {
      concept: 'missingness-frequency',
      question: 'Missingness informativa en un campo de matching significa:',
      options: [
        'Que el nulo se ignora siempre sin peso',
        'Que la ausencia puede aportar evidencia (no solo “dato faltante inocuo”)',
        'Que el campo no existe en el schema',
        'Que hay que rellenar con PII real',
      ],
      correctIndex: 1,
      explanation: 'A veces “faltante” es señal; hay que modelarlo.',
    },
    {
      concept: 'missingness-frequency',
      question: 'La frecuencia de un valor (p. ej. apellido común sintético) afecta pesos porque:',
      options: [
        'Valores raros y comunes aportan la misma evidencia siempre',
        'Coincidencias en valores raros suelen aportar más evidencia que en valores muy comunes',
        'La frecuencia se usa solo para UI',
        'No se puede estimar en datos sintéticos',
      ],
      correctIndex: 1,
      explanation: 'Rareza modula el peso de un acuerdo.',
    },
    {
      concept: 'missingness-frequency',
      question: 'Tratar todos los nulos como match exacto es riesgoso porque:',
      options: [
        'Acelera el índice',
        'Infla acuerdos espurios y sesga scores de pares',
        'Mejora siempre el recall real',
        'Es requerido por ACID',
      ],
      correctIndex: 1,
      explanation: 'Nulo≠igualdad; políticas de missingness deben ser explícitas.',
    },
    {
      concept: 'rules-candidate-recall',
      question: 'El blocking/candidate generation busca:',
      options: [
        'Comparar el producto cartesiano completo siempre',
        'Reducir pares a un subconjunto con alto recall de verdaderos positivos',
        'Eliminar la necesidad de scores',
        'Inferir parentesco familiar',
      ],
      correctIndex: 1,
      explanation: 'Candidatos = filtrado eficiente con recall alto. Matching ≠ parentesco.',
    },
    {
      concept: 'rules-candidate-recall',
      question: 'Una regla de blocking por código postal sintético + inicial de nombre:',
      options: [
        'Garantiza precisión 100%',
        'Particiona el espacio de pares para no comparar todo-con-todo',
        'Demuestra fraude automáticamente',
        'Reemplaza el clerical review',
      ],
      correctIndex: 1,
      explanation: 'Blocking es partición de candidatos, no veredicto final.',
    },
    {
      concept: 'rules-candidate-recall',
      question: 'Si el candidate recall cae, el síntoma típico es:',
      options: [
        'Más falsos positivos en clerical',
        'Pares verdaderos nunca llegan al scorer (falsos negativos de pipeline)',
        'Mejor F1 siempre',
        'Índices más pequeños sin costo',
      ],
      correctIndex: 1,
      explanation: 'Sin candidato no hay match posible → FN de sistema.',
    },
    {
      concept: 'combos-cost-impossible',
      question: 'Combinar demasiadas claves de blocking finas puede:',
      options: [
        'Solo mejorar recall sin costo',
        'Explotar el costo de pares (explosión combinatoria)',
        'Eliminar la necesidad de hardware',
        'Inferir colusión entre empresas',
      ],
      correctIndex: 1,
      explanation: 'Trade-off recall vs costo de pares. Matching ≠ colusión.',
    },
    {
      concept: 'combos-cost-impossible',
      question: 'Un par “imposible” (p. ej. fechas de nacimiento sintéticas incompatibles) se usa para:',
      options: [
        'Forzar match',
        'Podar candidatos o bajar evidencia de acuerdo',
        'Entrenar un LLM de marketing',
        'Saltar constraints de PK',
      ],
      correctIndex: 1,
      explanation: 'Reglas de imposibilidad reducen FP y costo.',
    },
    {
      concept: 'combos-cost-impossible',
      question: 'Presupuesto de pares por entidad ayuda a:',
      options: [
        'Ignorar SLO de latencia',
        'Acotar CPU/memoria del scorer en lotes grandes',
        'Garantizar 0 FN',
        'Publicar PII',
      ],
      correctIndex: 1,
      explanation: 'Cost caps mantienen el pipeline operable.',
    },
    {
      concept: 'weights-prob-thresholds',
      question: 'En ER probabilístico, los pesos/probabilidades modelan:',
      options: [
        'Solo el color de la UI',
        'Evidencia de acuerdo/desacuerdo por campo hacia match vs non-match',
        'La latencia de red del CDN',
        'Fraude penal automático',
      ],
      correctIndex: 1,
      explanation: 'Pesos agregan evidencia de campos. Matching ≠ fraude.',
    },
    {
      concept: 'weights-prob-thresholds',
      question: 'Un threshold de decisión match/maybe/non-match se elige para:',
      options: [
        'Maximizar solo el número de matches sin mirar errores',
        'Balancear precision/recall según costo de FP vs FN del negocio',
        'Igualar siempre 0.5 por costumbre',
        'Eliminar el clerical review por decreto',
      ],
      correctIndex: 1,
      explanation: 'Umbrales reflejan costos de error del dominio.',
    },
    {
      concept: 'weights-prob-thresholds',
      question: 'Calibrar scores a probabilidades permite:',
      options: [
        'Evitar datos de entrenamiento',
        'Interpretar umbrales y riesgos de decisión de forma más estable',
        'Inferir parentesco legal',
        'Saltar validación de schema',
      ],
      correctIndex: 1,
      explanation: 'Calibración alinea score con P(match). Matching ≠ parentesco.',
    },
    {
      concept: 'train-clerical-cluster',
      question: 'El clerical review en ER sintético es:',
      options: [
        'Publicar pares en redes sociales',
        'Etiquetado humano de pares dudosos para entrenar/evaluar con cuidado ético',
        'Borrar clusters al azar',
        'Ejecutar DROP SCHEMA',
      ],
      correctIndex: 1,
      explanation: 'Clerical = etiqueta humana controlada, datos sintéticos en el curso.',
    },
    {
      concept: 'train-clerical-cluster',
      question: 'Consistencia de cluster exige que:',
      options: [
        'A~B y B~C no digan nada de A~C',
        'Relaciones de match respeten transitividad/coherencia al formar entidades',
        'Cada par sea un cluster distinto siempre',
        'Se ignore el grafo de pares',
      ],
      correctIndex: 1,
      explanation: 'Clustering cohere pares en entidades.',
    },
    {
      concept: 'train-clerical-cluster',
      question: 'Entrenar pesos solo con pares fáciles y obvios suele:',
      options: [
        'Generalizar perfecto a grises',
        'Fallar en la zona gris donde más se necesita el modelo',
        'Eliminar la necesidad de features',
        'Demostrar fraude',
      ],
      correctIndex: 1,
      explanation: 'Hay que muestrear casos difíciles/dudosos con ética.',
    },
    {
      concept: 'labeled-splits-by-entity',
      question: 'Al partir train/test de pares etiquetados, split por entidad evita:',
      options: [
        'Usar índices',
        'Fuga de información si pares de la misma entidad caen en train y test',
        'El uso de seeds',
        'La normalización de strings',
      ],
      correctIndex: 1,
      explanation: 'Entity-level split reduce leakage.',
    },
    {
      concept: 'labeled-splits-by-entity',
      question: 'Un labeled pair dataset de curso debe contener:',
      options: [
        'PII real de clientes peruanos',
        'Pares sintéticos con labels match/non-match (y maybe si aplica)',
        'Contraseñas de producción',
        'Inferencias de parentesco real',
      ],
      correctIndex: 1,
      explanation: 'Solo sintéticos; matching no implica parentesco/fraude.',
    },
    {
      concept: 'labeled-splits-by-entity',
      question: 'Si no hay split por entidad, una métrica optimista suele:',
      options: [
        'Subestimar el rendimiento real',
        'Sobreestimar generalización por leakage entre particiones',
        'Ser idéntica al random',
        'Medir solo latencia de red',
      ],
      correctIndex: 1,
      explanation: 'Leakage infla métricas.',
    },
    {
      concept: 'pr-pairwise-cluster-slices',
      question: 'Precision/recall pairwise evalúan:',
      options: [
        'Solo el diseño del logo',
        'Calidad de decisiones a nivel de pares (no solo clusters finales)',
        'El uptime del CDN',
        'La cantidad de índices B-tree',
      ],
      correctIndex: 1,
      explanation: 'Pairwise y cluster miden capas distintas.',
    },
    {
      concept: 'pr-pairwise-cluster-slices',
      question: 'Métricas a nivel cluster capturan:',
      options: [
        'Únicamente el string del nombre de tabla',
        'Calidad de la entidad resuelta (fusión/partición de registros)',
        'El color del tema oscuro',
        'El número de pods',
      ],
      correctIndex: 1,
      explanation: 'Cluster metrics = entidad final, no solo pares.',
    },
    {
      concept: 'pr-pairwise-cluster-slices',
      question: 'Error slices en evaluación de ER sirven para:',
      options: [
        'Ocultar fallas en subgrupos',
        'Diagnosticar fallas por tipo de campo/fuente/segmento sintético',
        'Inferir colusión o fraude a partir del match',
        'Reemplazar el clerical review legal',
      ],
      correctIndex: 1,
      explanation: 'Slices localizan debilidades. Matching ≠ fraude/colusión.',
    },
  ],

  // === Section 31: Grafos y evidencia relacional V3 (platform id streaming-data) ===
  'streaming-data': [
    {
      concept: 'nodes-edges-direction-weight',
      question: 'En un grafo de evidencia sintética, un nodo representa:',
      options: [
        'Siempre un veredicto de fraude',
        'Una entidad (cliente, cuenta, contacto) con id y tipo',
        'Solo un score numérico sin identidad',
        'Un proceso de Kubernetes',
      ],
      correctIndex: 1,
      explanation: 'Nodos = entidades tipadas. Grafo ≠ veredicto de fraude.',
    },
    {
      concept: 'nodes-edges-direction-weight',
      question: 'Una arista dirigida con peso en el modelo de S31:',
      options: [
        'Demuestra culpabilidad automática',
        'Codifica un hecho relacional con orientación y magnitud documentada',
        'Elimina la necesidad de provenance',
        'Es idéntica a un índice B-tree',
      ],
      correctIndex: 1,
      explanation: 'Dirección y peso son evidencia cuantitativa, no culpabilidad.',
    },
    {
      concept: 'nodes-edges-direction-weight',
      question: 'Modelar “comparte teléfono sintético” como no dirigido suele ser preferible porque:',
      options: [
        'La relación es típicamente simétrica entre extremos',
        'Kubernetes lo exige',
        'Así se infiere parentesco legal',
        'Borra el multigrafo',
      ],
      correctIndex: 0,
      explanation: 'Simetría de contacto compartido → no dirigido o bidireccional simétrico. Matching ≠ parentesco.',
    },
    {
      concept: 'multigraph-time-provenance',
      question: 'Un multigrafo entre el mismo par de nodos permite:',
      options: [
        'Solo una arista total en todo el grafo',
        'Varias aristas (p. ej. varias transferencias) sin colapsar el detalle',
        'Eliminar timestamps',
        'Inferir colusión automática',
      ],
      correctIndex: 1,
      explanation: 'Multi-aristas conservan hechos distintos. Scores/caminos ≠ colusión.',
    },
    {
      concept: 'multigraph-time-provenance',
      question: 'La provenance de una arista debería incluir al menos:',
      options: [
        'El color del dashboard',
        'Fuente, identificador de registro y contexto de corrida (run_id)',
        'El password del analista',
        'Un label de fraude obligatorio',
      ],
      correctIndex: 1,
      explanation: 'Auditar de dónde salió la arista es no negociable.',
    },
    {
      concept: 'multigraph-time-provenance',
      question: 'Filtrar aristas por ventana temporal es necesario cuando:',
      options: [
        'Nunca hay relojes en el sistema',
        'El caso o la pregunta dependen de un intervalo de tiempo',
        'Solo hay un nodo',
        'Se quiere ocultar PII real',
      ],
      correctIndex: 1,
      explanation: 'Tiempo acota evidencia al periodo relevante.',
    },
    {
      concept: 'entities-tx-contacts',
      question: 'Al construir el grafo desde entidades y transacciones sintéticas, el paso clave es:',
      options: [
        'Mapear filas a nodos/aristas con tipos estables',
        'Publicar PII de clientes reales',
        'Asignar culpabilidad por monto',
        'Borrar ids de cuenta',
      ],
      correctIndex: 0,
      explanation: 'ETL al modelo de grafo con tipos consistentes.',
    },
    {
      concept: 'entities-tx-contacts',
      question: 'Contactos (email/teléfono sintéticos) en el grafo sirven para:',
      options: [
        'Demostrar fraude penal',
        'Materializar aristas de compartición/vinculación con evidencia',
        'Reemplazar el ER probabilístico de S30',
        'Entrenar un LLM de marketing',
      ],
      correctIndex: 1,
      explanation: 'Contactos = features de relación, no veredicto.',
    },
    {
      concept: 'entities-tx-contacts',
      question: 'Una transacción sintética E1→E2 con monto PEN se modela típicamente como:',
      options: [
        'Nodo sin aristas',
        'Arista dirigida con peso = monto (u otra agregación documentada)',
        'Un hyperparameter de XGBoost',
        'Un secret de Vault',
      ],
      correctIndex: 1,
      explanation: 'Transferencias = aristas dirigidas ponderadas.',
    },
    {
      concept: 'dedup-agg-keep-detail',
      question: 'Agregar aristas sin borrar detalle significa:',
      options: [
        'DROP de la tabla fuente',
        'Materializar resúmenes y conservar hechos atómicos auditables',
        'Colapsar todo a un score de fraude',
        'Eliminar provenance',
      ],
      correctIndex: 1,
      explanation: 'Agg + raw coexisten para auditoría.',
    },
    {
      concept: 'dedup-agg-keep-detail',
      question: 'Deduplicar nodos de entidad en construcción del grafo debe:',
      options: [
        'Usar PII real de producción',
        'Reusar ids resueltos/sintéticos estables y no inventar fusiones opacas',
        'Fusionar por apellido común siempre',
        'Ignorar ER previo',
      ],
      correctIndex: 1,
      explanation: 'Ids estables + reglas claras; matching ≠ fraude.',
    },
    {
      concept: 'dedup-agg-keep-detail',
      question: 'Si solo guardas el peso agregado y borras multi-aristas:',
      options: [
        'Ganas reproducibilidad perfecta del camino atómico',
        'Pierdes capacidad de auditar cada hecho fuente',
        'Cumples siempre GDPR automáticamente',
        'Mejoras la interpretación de centralidad a culpabilidad',
      ],
      correctIndex: 1,
      explanation: 'Perder detalle rompe evidencia por arista.',
    },
    {
      concept: 'degree-components-paths',
      question: 'El grado de un nodo mide:',
      options: [
        'Culpabilidad legal',
        'Cuántas conexiones incidentes tiene (in/out/total según definición)',
        'El AUC del modelo',
        'La latencia del CDN',
      ],
      correctIndex: 1,
      explanation: 'Grado = estructura local, no veredicto.',
    },
    {
      concept: 'degree-components-paths',
      question: 'Una componente conexa agrupa:',
      options: [
        'Solo nodos con score > 0.9 de fraude',
        'Nodos alcanzables entre sí bajo la definición de conexión elegida',
        'Pods de Kubernetes',
        'Filas de un CSV sin grafo',
      ],
      correctIndex: 1,
      explanation: 'Componentes = partición topológica.',
    },
    {
      concept: 'degree-components-paths',
      question: 'Un camino reproducible en evidencia relacional debe:',
      options: [
        'Listar la secuencia de nodos/aristas y poder regenerarse con los mismos datos',
        'Incluir necesariamente un label de parentesco',
        'Ocultar los ids de arista',
        'Usar random no seedado en BFS',
      ],
      correctIndex: 0,
      explanation: 'Camino = traza auditables; no implica culpabilidad.',
    },
    {
      concept: 'centrality-limited-interp',
      question: 'La centralidad alta de un nodo sintético indica:',
      options: [
        'Culpabilidad o fraude demostrado',
        'Posición topológica destacada bajo una métrica; requiere contexto e hipótesis',
        'Que el nodo debe borrarse',
        'Parentesco legal automático',
      ],
      correctIndex: 1,
      explanation: 'Centralidad ≠ culpabilidad/fraude/parentesco.',
    },
    {
      concept: 'centrality-limited-interp',
      question: 'Interpretar PageRank/betweenness sin límites es riesgoso porque:',
      options: [
        'Siempre es 0',
        'Confunde importancia estructural con juicio moral o legal',
        'No se puede calcular en grafos pequeños',
        'Reemplaza la necesidad de paths',
      ],
      correctIndex: 1,
      explanation: 'Límites de interpretación son parte del outcome de S31.',
    },
    {
      concept: 'centrality-limited-interp',
      question: 'Documentar la métrica de centralidad usada sirve para:',
      options: [
        'Ocultar supuestos',
        'Hacer comparable y auditable el análisis entre corridas',
        'Inferir colusión automática',
        'Eliminar el grafo',
      ],
      correctIndex: 1,
      explanation: 'Reproducibilidad de la métrica.',
    },
    {
      concept: 'subgraphs-tests',
      question: 'Extraer un subgrafo para un caso suele basarse en:',
      options: [
        'Todo el internet',
        'Semilla de nodos + k-hop o filtros de tipo/tiempo',
        'Solo el logo de la empresa',
        'Un DROP DATABASE',
      ],
      correctIndex: 1,
      explanation: 'Subgrafo acotado y justificable.',
    },
    {
      concept: 'subgraphs-tests',
      question: 'Probar un subgrafo de evidencia implica:',
      options: [
        'No escribir asserts',
        'Verificar conteos, tipos, provenance y caminos esperados con datos sintéticos',
        'Usar PII real',
        'Publicar el subgrafo sin redacción',
      ],
      correctIndex: 1,
      explanation: 'Tests estructurales + de evidencia.',
    },
    {
      concept: 'subgraphs-tests',
      question: 'Un test que falla si falta provenance en aristas protege:',
      options: [
        'El color del tema',
        'La auditabilidad del grafo de evidencia',
        'La velocidad del GIL',
        'La inferencia de fraude automática',
      ],
      correctIndex: 1,
      explanation: 'Provenance es requisito de calidad.',
    },
    {
      concept: 'viz-scale-privacy-edge-evidence',
      question: 'Al visualizar grafos de relaciones sintéticas en es-PE profesional, debes:',
      options: [
        'Mostrar PII real de clientes',
        'Redactar/minimizar identificadores y no etiquetar “fraude” por color de centralidad',
        'Usar solo screenshots sin leyenda',
        'Ocultar la evidencia por arista siempre',
      ],
      correctIndex: 1,
      explanation: 'Privacidad + no estigmatizar por score/centralidad.',
    },
    {
      concept: 'viz-scale-privacy-edge-evidence',
      question: 'Evidencia por arista en la UI significa:',
      options: [
        'Solo un heatmap de sospecha',
        'Poder inspeccionar tipo, tiempo, fuente y peso de cada vínculo',
        'Un único score global sin detalle',
        'Entrenar un modelo de visión',
      ],
      correctIndex: 1,
      explanation: 'Drill-down a la arista auditables.',
    },
    {
      concept: 'viz-scale-privacy-edge-evidence',
      question: 'Estrategias de escala (muestreo, agregación visual) deben:',
      options: [
        'Mentir sobre el tamaño del grafo',
        'Declarar qué se filtró/agregó para no inventar topología falsa',
        'Eliminar todos los caminos',
        'Convertir centralidad en culpabilidad',
      ],
      correctIndex: 1,
      explanation: 'Honestidad de la vista ≠ veredicto.',
    },
  ],
  // === Section 32: Feature engineering y pipelines sin leakage V3 (platform id microservices) ===
  'microservices': [
    {
      concept: 'num-cat-text-features',
      question: 'En feature engineering responsable, una feature numérica es:',
      options: [
        'Un label de fraude obligatorio',
        'Una variable cuantitativa derivada o cruda alineada a la unidad de modelado',
        'Solo un embedding de 768 dims',
        'Un secret de API',
      ],
      correctIndex: 1,
      explanation: 'Numéricas = magnitudes bien definidas.',
    },
    {
      concept: 'num-cat-text-features',
      question: 'Features categóricas requieren:',
      options: [
        'Siempre one-hot infinito sin rareza',
        'Encoding coherente (one-hot, ordinal, target con cuidado) y manejo de niveles raros',
        'Borrar todas las categorías',
        'Usar PII real como nombre de columna',
      ],
      correctIndex: 1,
      explanation: 'Encoding + rare levels.',
    },
    {
      concept: 'num-cat-text-features',
      question: 'Features de texto en pipelines de matching/triage sintético suelen basarse en:',
      options: [
        'Tokens, longitudes, rareza o embeddings con política de PII',
        'El password del usuario',
        'Solo el color del PDF',
        'Labels de parentesco legal',
      ],
      correctIndex: 0,
      explanation: 'Texto → señales controladas; no PII real de prod.',
    },
    {
      concept: 'missing-scale-encode',
      question: 'Un missing indicator es útil porque:',
      options: [
        'Rellena con PII',
        'Hace explícita la ausencia como señal potencial sin inventar el valor real',
        'Elimina la columna siempre',
        'Demuestra fraude',
      ],
      correctIndex: 1,
      explanation: 'Missingness puede ser informativa.',
    },
    {
      concept: 'missing-scale-encode',
      question: 'Escalar numéricas (StandardScaler/etc.) debe hacerse:',
      options: [
        'Con estadísticas del test set filtradas al train',
        'Fit solo en train/folds y transform en el resto',
        'Con media global de prod incluyendo labels futuros',
        'Después de ver el y del test',
      ],
      correctIndex: 1,
      explanation: 'Fit en train evita leakage.',
    },
    {
      concept: 'missing-scale-encode',
      question: 'One-hot con handle_unknown=\'ignore\' (o equivalente) ayuda a:',
      options: [
        'Filtrar filas de fraude',
        'No romper transform cuando aparece una categoría nueva en serve',
        'Garantizar AUC 1.0',
        'Eliminar el ColumnTransformer',
      ],
      correctIndex: 1,
      explanation: 'Robustez train–serve en categorías.',
    },
    {
      concept: 'shared-contact-distance',
      question: 'Una feature de “shared contact” entre entidades sintéticas mide:',
      options: [
        'Parentesco biológico',
        'Si comparten teléfono/email/dirección normalizados (señal relacional)',
        'Culpabilidad automática',
        'El uptime del cluster',
      ],
      correctIndex: 1,
      explanation: 'Shared contact = señal; ≠ parentesco/fraude.',
    },
    {
      concept: 'shared-contact-distance',
      question: 'Distance features (p. ej. string/geo sintéticas) deben:',
      options: [
        'Usarse sin documentar la métrica',
        'Documentar métrica, unidades y que no equivalen a veredicto legal',
        'Publicarse con PII cruda',
        'Reemplazar el target',
      ],
      correctIndex: 1,
      explanation: 'Distancia ≠ culpabilidad.',
    },
    {
      concept: 'shared-contact-distance',
      question: 'Graph features (grado, vecinos comunes) en el pipeline:',
      options: [
        'Prueban colusión',
        'Resumen estructura local/global como inputs numéricos versionados',
        'Requieren borrar el grafo de S31',
        'Son labels supervisados siempre',
      ],
      correctIndex: 1,
      explanation: 'Features de grafo ≠ prueba de colusión.',
    },
    {
      concept: 'windows-frequency',
      question: 'Features de ventana temporal agregan eventos:',
      options: [
        'Sobre todo el futuro del label sin cuidado',
        'En intervalos definidos respecto al punto de predicción sin mirar el futuro indebido',
        'Solo con random shuffle del tiempo',
        'Ignorando el reloj',
      ],
      correctIndex: 1,
      explanation: 'Ventanas alineadas al horizonte evitan leakage temporal.',
    },
    {
      concept: 'windows-frequency',
      question: 'Frecuencia de eventos en ventana es sensible a:',
      options: [
        'Solo el color de la UI',
        'Definición de la ventana, zona horaria y unidad de conteo',
        'El nombre del pod',
        'La marca del teclado',
      ],
      correctIndex: 1,
      explanation: 'Especifica ventana y semántica.',
    },
    {
      concept: 'windows-frequency',
      question: 'Contar transacciones “después del default” para predecir el default es:',
      options: [
        'Feature válida siempre',
        'Leakage temporal clásico',
        'Requerido por scikit-learn',
        'Un missing indicator',
      ],
      correctIndex: 1,
      explanation: 'Post-label info no puede entrar al train de ese target.',
    },
    {
      concept: 'columntransformer-custom',
      question: 'ColumnTransformer en sklearn sirve para:',
      options: [
        'Entrenar solo redes neuronales',
        'Aplicar transformaciones distintas por columnas/grupos en un solo pipeline',
        'Borrar el target',
        'Desplegar a Kubernetes automáticamente',
      ],
      correctIndex: 1,
      explanation: 'Ramas por tipo de columna.',
    },
    {
      concept: 'columntransformer-custom',
      question: 'Un custom transformer debe implementar típicamente:',
      options: [
        'Solo __repr__',
        'fit/transform (y get_params si va en GridSearch) de forma sklearn-compatible',
        'Una query a prod con PII',
        'print del password',
      ],
      correctIndex: 1,
      explanation: 'API sklearn para componer.',
    },
    {
      concept: 'columntransformer-custom',
      question: 'Meter lógica de negocio en un transformer versionado ayuda a:',
      options: [
        'Ocultar el código',
        'Reproducir features en train y serve con el mismo artefacto',
        'Evitar tests',
        'Inferir fraude sin modelo',
      ],
      correctIndex: 1,
      explanation: 'Misma transformación en ambos lados.',
    },
    {
      concept: 'fit-transform-persist',
      question: 'La regla de oro fit vs transform es:',
      options: [
        'Fit siempre en test',
        'Fit aprende parámetros en datos permitidos; transform solo aplica',
        'Transform reentrena pesos del modelo',
        'Fit ignora el schema',
      ],
      correctIndex: 1,
      explanation: 'Separación fit/transform evita leakage.',
    },
    {
      concept: 'fit-transform-persist',
      question: 'Persistir un pipeline (joblib/pickle controlado) permite:',
      options: [
        'Cambiar columnas en silencio sin versión',
        'Cargar el mismo grafo de transformaciones en serving',
        'Evitar feature stores siempre',
        'Publicar secretos',
      ],
      correctIndex: 1,
      explanation: 'Artefacto reproducible de features+modelo.',
    },
    {
      concept: 'fit-transform-persist',
      question: 'Si fit_transform se usa en el set de evaluación final:',
      options: [
        'Es inocuo siempre',
        'Puede filtrar información del eval al aprender parámetros',
        'Es obligatorio en producción',
        'Elimina el desbalance',
      ],
      correctIndex: 1,
      explanation: 'Eval debe ser transform-only con params de train.',
    },
    {
      concept: 'entity-group-time-split',
      question: 'Split por entidad evita:',
      options: [
        'Usar CPU',
        'Que la misma entidad contamine train y test (leakage de identidad)',
        'El uso de pipelines',
        'Features numéricas',
      ],
      correctIndex: 1,
      explanation: 'Entity-level split.',
    },
    {
      concept: 'entity-group-time-split',
      question: 'Group/time splits son preferibles cuando:',
      options: [
        'Los datos son i.i.d. perfectos y sin grupos',
        'Hay dependencia temporal o por cliente/cuenta que viola i.i.d.',
        'Solo hay 2 filas',
        'No hay target',
      ],
      correctIndex: 1,
      explanation: 'Respeta la estructura de dependencia.',
    },
    {
      concept: 'entity-group-time-split',
      question: 'Un random split puro sobre pares de la misma entidad a menudo:',
      options: [
        'Subestima el rendimiento',
        'Sobreestima generalización por leakage entre particiones',
        'Es idéntico a walk-forward',
        'Borra el desbalance',
      ],
      correctIndex: 1,
      explanation: 'Leakage infla métricas.',
    },
    {
      concept: 'leakage-skew-versioning',
      question: 'Train–serve skew ocurre cuando:',
      options: [
        'Train y serve usan el mismo pipeline versionado',
        'La distribución o lógica de features difiere entre entrenamiento y producción',
        'Hay demasiados tests',
        'El modelo es lineal',
      ],
      correctIndex: 1,
      explanation: 'Skew = divergencia train vs serve.',
    },
    {
      concept: 'leakage-skew-versioning',
      question: 'Versionar features/pipeline mitiga:',
      options: [
        'La necesidad de datos',
        'Cambios silenciosos que rompen reproducibilidad y auditorías',
        'El uso de git',
        'La calibración',
      ],
      correctIndex: 1,
      explanation: 'Versiones = linaje de features.',
    },
    {
      concept: 'leakage-skew-versioning',
      question: 'Una checklist anti-leakage en este nivel incluye:',
      options: [
        'Usar el label como feature siempre',
        'Revisar tiempo, entidad, fit-only-on-train y targets futuros',
        'Publicar el test set en el dashboard de marketing',
        'Hardcodear umbral 0.5 sin costos',
      ],
      correctIndex: 1,
      explanation: 'Tiempo/entidad/fit son focos clásicos.',
    },
  ],
  // === Section 33: ML supervisado y baselines responsables V3 (platform id advanced-models) ===
  'advanced-models': [
    {
      concept: 'unit-target-horizon',
      question: 'La unidad de modelado define:',
      options: [
        'El color del informe',
        'Qué es una fila/ejemplo (cliente-día, par, cuenta-mes, etc.)',
        'Solo el learning rate',
        'El número de GPUs',
      ],
      correctIndex: 1,
      explanation: 'Unidad clara = base del dataset.',
    },
    {
      concept: 'unit-target-horizon',
      question: 'El target supervisado debe:',
      options: [
        'Incluir información posterior al horizonte de decisión de forma indebida',
        'Ser una etiqueta definida, medible y alineada a la decisión',
        'Ser el score de centralidad como verdad absoluta de fraude',
        'Cambiar en cada batch sin versión',
      ],
      correctIndex: 1,
      explanation: 'Target = decisión/label, no estigma automático. Scores ≠ fraude demostrado.',
    },
    {
      concept: 'unit-target-horizon',
      question: 'El horizonte de predicción indica:',
      options: [
        'Cuánto tiempo/adelanto separa features del evento a predecir',
        'La altura del dashboard',
        'El tamaño del embedding',
        'El número de hojas del árbol',
      ],
      correctIndex: 0,
      explanation: 'Horizonte alinea features y label en el tiempo.',
    },
    {
      concept: 'costs-rule-dummy',
      question: 'Un baseline de regla de negocio sirve para:',
      options: [
        'Reemplazar toda ética',
        'Anclar el valor mínimo que el ML debe superar con costos explícitos',
        'Demostrar fraude legal',
        'Evitar métricas',
      ],
      correctIndex: 1,
      explanation: 'Reglas = piso de comparación.',
    },
    {
      concept: 'costs-rule-dummy',
      question: 'DummyClassifier/DummyRegressor ayudan a:',
      options: [
        'Obtener SOTA',
        'Detectar si el modelo apenas supera azar/estrategias triviales',
        'Calibrar certificados TLS',
        'Borrar el desbalance',
      ],
      correctIndex: 1,
      explanation: 'Sanity check de habilidad real.',
    },
    {
      concept: 'costs-rule-dummy',
      question: 'Incorporar costos de FP/FN al diseño implica:',
      options: [
        'Ignorar el umbral',
        'Elegir métricas y umbrales según impacto, no solo accuracy',
        'Usar solo accuracy balanceada siempre',
        'Etiquetar parentesco',
      ],
      correctIndex: 1,
      explanation: 'Costos guían métricas y thresholds. Score ≠ veredicto final.',
    },
    {
      concept: 'reg-logreg-regularization',
      question: 'La regresión logística modela:',
      options: [
        'Solo series de tiempo univariadas sin features',
        'P(y|x) con función logística sobre combinación lineal de features',
        'Únicamente clusters k-means',
        'Grafos sin tabla',
      ],
      correctIndex: 1,
      explanation: 'LogReg = lineal en el logit.',
    },
    {
      concept: 'reg-logreg-regularization',
      question: 'Regularización L2 en logística típicamente:',
      options: [
        'Fuerza coeficientes exactos a cero siempre',
        'Penaliza coeficientes grandes y estabiliza la solución',
        'Elimina el intercepto obligatorio legal',
        'Prueba colusión',
      ],
      correctIndex: 1,
      explanation: 'L2 = shrinkage.',
    },
    {
      concept: 'reg-logreg-regularization',
      question: 'Sin regularización y con features colineales, un síntoma es:',
      options: [
        'Coeficientes estables y pequeños',
        'Coeficientes inflados/inestables y mala generalización',
        'AUC perfecto en prod garantizado',
        'Nulos imposibles',
      ],
      correctIndex: 1,
      explanation: 'Colinealidad + sin reg → inestabilidad.',
    },
    {
      concept: 'coefs-assumptions-scaling',
      question: 'Interpretar coeficientes de un modelo lineal/logístico requiere:',
      options: [
        'Asumir causalidad siempre',
        'Considerar scaling, colinealidad y que son asociaciones bajo el modelo',
        'Ignorar el signo',
        'Tratarlos como prueba de fraude',
      ],
      correctIndex: 1,
      explanation: 'Coef ≠ causalidad ni culpabilidad.',
    },
    {
      concept: 'coefs-assumptions-scaling',
      question: 'Escalar features antes de regularizar es importante porque:',
      options: [
        'La penalización es sensible a la escala de cada coeficiente/feature',
        'Sklearn lo prohíbe',
        'Elimina el target',
        'Solo afecta a árboles',
      ],
      correctIndex: 0,
      explanation: 'Misma escala → penalización comparable.',
    },
    {
      concept: 'coefs-assumptions-scaling',
      question: 'Un supuesto frágil de modelos lineales es:',
      options: [
        'Que siempre capturan interacciones complejas sin features',
        'Que la relación es aditiva/lineal en el predictor (salvo ingeniería)',
        'Que no necesitan datos',
        'Que el AUC es irrelevante',
      ],
      correctIndex: 1,
      explanation: 'Linealidad es un supuesto/limitación.',
    },
    {
      concept: 'trees-rf-boosting',
      question: 'Un árbol de decisión particiona el espacio mediante:',
      options: [
        'Solo rotaciones PCA',
        'Reglas de partición en features (splits) hacia hojas',
        'Un único hiperplano sin ejes',
        'Embeddings de grafo obligatorios',
      ],
      correctIndex: 1,
      explanation: 'Splits axis-aligned típicos.',
    },
    {
      concept: 'trees-rf-boosting',
      question: 'Random Forest reduce varianza al:',
      options: [
        'Entrenar un solo árbol profundo sin bagging',
        'Promediar/votar muchos árboles sobre submuestras/features',
        'Eliminar el bootstrap siempre',
        'Usar solo el label como split',
      ],
      correctIndex: 1,
      explanation: 'Ensemble bagging-like.',
    },
    {
      concept: 'trees-rf-boosting',
      question: 'Boosting (p. ej. gradient boosting) construye modelos:',
      options: [
        'En paralelo independientes sin residuos',
        'Secuencialmente enfocándose en errores residuales del ensemble previo',
        'Solo con k-means',
        'Sin learning rate',
      ],
      correctIndex: 1,
      explanation: 'Boosting = corrección secuencial de errores.',
    },
    {
      concept: 'overfit-depth-repro',
      question: 'Profundidad excesiva en árboles suele:',
      options: [
        'Mejorar siempre el test',
        'Memorizar ruido (overfit) si no hay regularización/early stop',
        'Eliminar la necesidad de validación',
        'Garantizar fairness',
      ],
      correctIndex: 1,
      explanation: 'Capacidad alta → overfit.',
    },
    {
      concept: 'overfit-depth-repro',
      question: 'Reproducibilidad de un experimento de ML incluye:',
      options: [
        'Semillas, versiones de datos/código/pipeline y registro de hiperparámetros',
        'Solo el accuracy en un print accidental',
        'Cambiar el test a mitad de camino',
        'Usar PII real sin control',
      ],
      correctIndex: 0,
      explanation: 'Semillas + linaje + hparams.',
    },
    {
      concept: 'overfit-depth-repro',
      question: 'Un síntoma de overfit es:',
      options: [
        'Train mediocre y test excelente',
        'Train muy alto y test/validación mucho peor',
        'Train = test = azar',
        'Brier perfectamente calibrado siempre',
      ],
      correctIndex: 1,
      explanation: 'Brecha train/test clásica.',
    },
    {
      concept: 'pipeline-min-tracking',
      question: 'Un pipeline mínimo train→eval debe encadenar:',
      options: [
        'Solo el predict sin transforms',
        'Preprocesamiento + modelo con fit en train y evaluación limpia',
        'Drop del schema',
        'Labels en las features a propósito',
      ],
      correctIndex: 1,
      explanation: 'Pipeline unifica preprocess+model.',
    },
    {
      concept: 'pipeline-min-tracking',
      question: 'Tracking mínimo de experimentos registra al menos:',
      options: [
        'Métricas, params, id de datos/versión y semilla',
        'Solo el meme del equipo',
        'Contraseñas de prod',
        'PII de clientes',
      ],
      correctIndex: 0,
      explanation: 'Lo suficiente para reproducir.',
    },
    {
      concept: 'pipeline-min-tracking',
      question: 'Sin tracking, el riesgo principal es:',
      options: [
        'Demasiados dashboards',
        'No poder explicar qué modelo/datos produjeron un resultado',
        'Over-documentar',
        'Demasiada calibración',
      ],
      correctIndex: 1,
      explanation: 'Irreproducibilidad operativa.',
    },
    {
      concept: 'cv-error-analysis',
      question: 'Validación cruzada apropiada respeta:',
      options: [
        'Filas i.i.d. cuando no lo son',
        'Grupos/tiempo/entidad según el diseño del problema',
        'Solo un split aleatorio con leakage',
        'El orden del CSV de prod en vivo',
      ],
      correctIndex: 1,
      explanation: 'CV alineada a dependencia.',
    },
    {
      concept: 'cv-error-analysis',
      question: 'Error analysis sistemático mira:',
      options: [
        'Solo el accuracy global',
        'Falsos positivos/negativos, slices y patrones de fallo con datos sintéticos',
        'Únicamente el logo',
        'Cómo etiquetar parentesco real',
      ],
      correctIndex: 1,
      explanation: 'Diagnóstico > un solo número. Errores ≠ acusación de fraude.',
    },
    {
      concept: 'cv-error-analysis',
      question: 'Reportar solo accuracy en desbalance severo es engañoso porque:',
      options: [
        'Accuracy ignora la clase mayoritaria',
        'Un modelo trivial puede verse “bueno” prediciendo la mayoría',
        'No existe accuracy en sklearn',
        'Siempre coincide con recall de la minoría',
      ],
      correctIndex: 1,
      explanation: 'Elige métricas alineadas al costo.',
    },
  ],
  // === Section 34: Métricas, desbalance, calibración y umbrales V3 (platform id cv-ai-integration) ===
  'cv-ai-integration': [
    {
      concept: 'confusion-pr-f-prauc',
      question: 'La matriz de confusión resume:',
      options: [
        'Solo la pérdida de train',
        'TP, FP, TN, FN bajo un umbral o regla de decisión',
        'La arquitectura del cluster',
        'El parentesco entre filas',
      ],
      correctIndex: 1,
      explanation: 'Conteos de aciertos/errores de clasificación.',
    },
    {
      concept: 'confusion-pr-f-prauc',
      question: 'Precision responde a:',
      options: [
        'De los predichos positivos, cuántos lo son realmente',
        'De los reales positivos, cuántos capturamos',
        'La prevalencia siempre',
        'El Brier score',
      ],
      correctIndex: 0,
      explanation: 'Precision = calidad de las alertas positivas.',
    },
    {
      concept: 'confusion-pr-f-prauc',
      question: 'PR-AUC es preferible a ROC-AUC cuando:',
      options: [
        'Las clases están perfectamente balanceadas siempre',
        'Hay desbalance y importan más los positivos',
        'No hay scores',
        'Solo hay regresión',
      ],
      correctIndex: 1,
      explanation: 'PR enfoca el trade-off en la clase positiva.',
    },
    {
      concept: 'topk-review-load',
      question: 'Precision@k / top-k evalúa:',
      options: [
        'Todo el ranking con el mismo peso que accuracy trivial',
        'Calidad de los k casos de mayor score enviados a revisión',
        'Solo el umbral 0.5',
        'La latencia de red',
      ],
      correctIndex: 1,
      explanation: 'Top-k alinea métrica a capacidad de revisión.',
    },
    {
      concept: 'topk-review-load',
      question: 'La carga de revisión (review load) limita:',
      options: [
        'Cuántos casos puede inspeccionar un humano en un periodo',
        'El learning rate',
        'El tamaño del embedding',
        'El número de folds solo',
      ],
      correctIndex: 0,
      explanation: 'Capacidad humana es un constraint de operación.',
    },
    {
      concept: 'topk-review-load',
      question: 'Elegir k sin mirar capacidad suele:',
      options: [
        'Optimizar solo el marketing',
        'Crear colas inmanejables o desperdiciar capacidad',
        'Calibrar Brier automáticamente',
        'Eliminar FN siempre',
      ],
      correctIndex: 1,
      explanation: 'k debe caber en la operación. Score alto ≠ fraude demostrado.',
    },
    {
      concept: 'class-weights-resampling-cv',
      question: 'class_weight en clasificadores compensa:',
      options: [
        'La falta de features',
        'Desbalance penalizando más errores de clases raras/costosas',
        'El clock skew del servidor',
        'La ausencia de umbral',
      ],
      correctIndex: 1,
      explanation: 'Pesos de clase ≠ prueba de fraude.',
    },
    {
      concept: 'class-weights-resampling-cv',
      question: 'Resampling (oversample/undersample) debe ocurrir:',
      options: [
        'Fuera de la CV sobre todo el dataset (leakage)',
        'Dentro de cada fold, solo en la partición de entrenamiento',
        'Solo en el test set',
        'Después de ver métricas de test final y rehacer labels',
      ],
      correctIndex: 1,
      explanation: 'Resample dentro de train de cada fold.',
    },
    {
      concept: 'class-weights-resampling-cv',
      question: 'SMOTE u oversampling con leakage de fold provoca:',
      options: [
        'Estimaciones optimistas inválidas',
        'Siempre subestimación',
        'Calibración perfecta',
        'Eliminación del desbalance en prod mágicamente',
      ],
      correctIndex: 0,
      explanation: 'Info del valid set no debe sintetizarse desde él.',
    },
    {
      concept: 'prevalence-misleading-metrics',
      question: 'La prevalencia es:',
      options: [
        'La fracción de positivos reales en la población de referencia',
        'El learning rate',
        'El número de árboles',
        'La centralidad media',
      ],
      correctIndex: 0,
      explanation: 'Base rate del problema.',
    },
    {
      concept: 'prevalence-misleading-metrics',
      question: 'Accuracy engañosa con prevalencia 1% aparece cuando:',
      options: [
        'Predices siempre negativo y obtienes ~99% accuracy',
        'Predices al azar equilibrado y accuracy cae a 1%',
        'Usas solo PR-AUC',
        'Calibras con Brier',
      ],
      correctIndex: 0,
      explanation: 'Mayority classifier parece “bueno”.',
    },
    {
      concept: 'prevalence-misleading-metrics',
      question: 'Reportar métricas sin prevalencia dificulta:',
      options: [
        'Elegir el color del plot',
        'Interpretar precision y el valor práctico de un score',
        'Compilar Python',
        'Leer CSV',
      ],
      correctIndex: 1,
      explanation: 'Base rate contextualiza precision. Score ≠ veredicto.',
    },
    {
      concept: 'reliability-brier',
      question: 'Una reliability curve compara:',
      options: [
        'Predicted probability vs frecuencia observada de positivos',
        'Solo train loss vs epoch',
        'Latencia p99 vs pods',
        'Grado vs betweenness',
      ],
      correctIndex: 0,
      explanation: 'Calibración visual.',
    },
    {
      concept: 'reliability-brier',
      question: 'El Brier score mide:',
      options: [
        'Exactitud del ranking top-1 solamente',
        'Error cuadrático medio entre probabilidades predichas y outcomes',
        'La pureza de un cluster k-means',
        'El recall@k únicamente',
      ],
      correctIndex: 1,
      explanation: 'Brier = calibración+refinamiento en un número.',
    },
    {
      concept: 'reliability-brier',
      question: 'Buen ranking con mala calibración implica:',
      options: [
        'Que el orden puede servir para top-k pero los % no son probabilidades confiables',
        'Que el modelo es inútil para ranking',
        'Que Brier es necesariamente 0',
        'Que hay fraude demostrado',
      ],
      correctIndex: 0,
      explanation: 'Separar discriminación vs calibración. Prob ≠ culpa.',
    },
    {
      concept: 'calibrators-oos',
      question: 'Calibradores (Platt/isotonic) deben ajustarse:',
      options: [
        'Sobre el mismo train del clasificador sin holdout (riesgo de overfit de calib)',
        'Con datos out-of-sample respecto al fit del clasificador base',
        'Solo con el test final repetidas veces sin reserva',
        'Con PII de producción',
      ],
      correctIndex: 1,
      explanation: 'Calibración OOS.',
    },
    {
      concept: 'calibrators-oos',
      question: 'Isotonic regression como calibrador es:',
      options: [
        'Paramétrica sigmoide siempre',
        'No paramétrica monótona; necesita suficientes puntos OOS',
        'Un random forest',
        'Un método de clustering',
      ],
      correctIndex: 1,
      explanation: 'Isotónica = monótona flexible.',
    },
    {
      concept: 'calibrators-oos',
      question: 'Reutilizar el test final para fit del calibrador y reportar métricas allí:',
      options: [
        'Es la mejor práctica',
        'Sesga la evaluación; reserva sets o CV anidada/calibration split',
        'Elimina el desbalance',
        'Prueba parentesco',
      ],
      correctIndex: 1,
      explanation: 'No “quemes” el test en calibración+reporte.',
    },
    {
      concept: 'threshold-cost-capacity',
      question: 'El umbral de decisión convierte scores en:',
      options: [
        'Siempre probabilidades calibradas',
        'Acciones (alertar/no) según política de costos y capacidad',
        'Embeddings',
        'Aristas de grafo',
      ],
      correctIndex: 1,
      explanation: 'Threshold = política, no verdad absoluta. Score ≠ fraude.',
    },
    {
      concept: 'threshold-cost-capacity',
      question: 'Si el costo de FP es muy alto y la capacidad de revisión es baja, suele:',
      options: [
        'Bajar mucho el umbral para alertar todo',
        'Subir el umbral / reducir k para priorizar precision operativa',
        'Ignorar top-k',
        'Borrar la clase positiva',
      ],
      correctIndex: 1,
      explanation: 'Política alineada a costo y cola.',
    },
    {
      concept: 'threshold-cost-capacity',
      question: 'Fijar umbral 0.5 por costumbre sin costos es débil porque:',
      options: [
        '0.5 maximiza siempre el valor de negocio',
        'El óptimo depende de prevalencia, calibración y costos FP/FN',
        'Sklearn lo exige legalmente',
        'Elimina la necesidad de PR curves',
      ],
      correctIndex: 1,
      explanation: '0.5 no es sagrado.',
    },
    {
      concept: 'abstention-slices-sensitivity',
      question: 'Abstención (no decidir) es útil cuando:',
      options: [
        'El modelo está muy confiado siempre',
        'La incertidumbre o el costo de error supera el de escalar a humano',
        'No hay humanos en el loop',
        'Se quiere ocultar métricas',
      ],
      correctIndex: 1,
      explanation: 'Human-in-the-loop > forzar label. Abstener ≠ acusar.',
    },
    {
      concept: 'abstention-slices-sensitivity',
      question: 'Métricas por slices detectan:',
      options: [
        'Solo bugs de sintaxis',
        'Brechas de desempeño en subgrupos/segmentos sintéticos',
        'El GIL de Python',
        'La versión de Node',
      ],
      correctIndex: 1,
      explanation: 'Slices = fairness/operación diagnóstica, no estigma.',
    },
    {
      concept: 'abstention-slices-sensitivity',
      question: 'Análisis de sensibilidad de umbral muestra:',
      options: [
        'Cómo cambian precision/recall/carga al mover el corte',
        'Solo el número de features',
        'La topología del cluster K8s',
        'El parentesco entre nodos',
      ],
      correctIndex: 0,
      explanation: 'Curvas de política de decisión.',
    },
  ],
  // === Section 35: Explicabilidad, equidad e incertidumbre V3 (platform id system-design) ===
  'system-design': [
    {
      concept: 'coefs-perm-importance',
      question: 'La importancia por permutación mide:',
      options: [
        'Causalidad legal',
        'Cuánto empeora una métrica al barajar una feature',
        'El tamaño del archivo del modelo',
        'La prevalencia exacta',
      ],
      correctIndex: 1,
      explanation: 'Perm importance = dependencia predictiva, no culpa.',
    },
    {
      concept: 'coefs-perm-importance',
      question: 'Coeficientes grandes en un modelo lineal pueden reflejar:',
      options: [
        'Siempre la feature más causal',
        'Escala de la feature, correlación y el objetivo de optimización',
        'Fraude demostrado',
        'Solo overfitting de árboles',
      ],
      correctIndex: 1,
      explanation: 'Interpreta con scaling y límites.',
    },
    {
      concept: 'coefs-perm-importance',
      question: 'Comparar importancias entre modelos distintos sin la misma métrica/split es:',
      options: [
        'Siempre válido',
        'Engañoso; alinea protocolo de evaluación',
        'Obligatorio en GDPR',
        'Equivalente a conformal',
      ],
      correctIndex: 1,
      explanation: 'Protocolo comparable.',
    },
    {
      concept: 'local-corr-limits',
      question: 'Una explicación local (p. ej. contribuciones por instancia) debe:',
      options: [
        'Generalizarse como ley universal sin cuidado',
        'Acotarse a la instancia y al modelo; correlación ≠ causalidad',
        'Publicar PII',
        'Reemplazar el appeal process',
      ],
      correctIndex: 1,
      explanation: 'Local ≠ causal global.',
    },
    {
      concept: 'local-corr-limits',
      question: 'Features correlacionadas dificultan atribución porque:',
      options: [
        'No afectan al modelo',
        'La importancia se reparte o se asigna de forma inestable entre proxies',
        'Eliminan el desbalance',
        'Garantizan fairness',
      ],
      correctIndex: 1,
      explanation: 'Correlación confunde atribución.',
    },
    {
      concept: 'local-corr-limits',
      question: 'Límite ético de explicaciones en triage sintético:',
      options: [
        'Usarlas para estigmatizar personas reales',
        'Apoyar revisión humana sin convertir score en veredicto de fraude',
        'Ocultar el model card',
        'Prohibir override',
      ],
      correctIndex: 1,
      explanation: 'Explain ≠ condena. Scores ≠ fraude.',
    },
    {
      concept: 'cohorts-slice-metrics',
      question: 'Métricas por cohorte/slice evalúan:',
      options: [
        'Solo el promedio global',
        'Desempeño en subgrupos definidos (fuente, segmento, tiempo)',
        'Únicamente el Brier global',
        'El color del tema',
      ],
      correctIndex: 1,
      explanation: 'Slices revelan brechas ocultas en el promedio.',
    },
    {
      concept: 'cohorts-slice-metrics',
      question: 'Elegir slices debe basarse en:',
      options: [
        'Riesgo de daño, operación y hipótesis de fallo — no en fishing infinito sin control',
        'Solo el apellido real de clientes',
        'El número de GPUs',
        'Un random seed oculto',
      ],
      correctIndex: 0,
      explanation: 'Slices motivados y documentados.',
    },
    {
      concept: 'cohorts-slice-metrics',
      question: 'Un modelo con buen promedio y slice roto es:',
      options: [
        'Aceptable sin notas',
        'Señal de riesgo de daño diferencial / fallo operacional',
        'Prueba de parentesco',
        'Irrelevante si AUC global > 0.9',
      ],
      correctIndex: 1,
      explanation: 'Equidad y operación miran colas y grupos.',
    },
    {
      concept: 'proxies-sample-harm',
      question: 'Un proxy sensible es una feature que:',
      options: [
        'Nunca correlaciona con atributos protegidos',
        'Correlaciona o codifica indirectamente atributos sensibles',
        'Es siempre el target',
        'Solo existe en grafos',
      ],
      correctIndex: 1,
      explanation: 'Proxies pueden reintroducir discriminación.',
    },
    {
      concept: 'proxies-sample-harm',
      question: 'Sample size pequeño en un slice implica:',
      options: [
        'Métricas muy confiables',
        'Intervalos amplios e interpretaciones cautelosas',
        'Que el slice debe ignorarse siempre sin documentar',
        'Calibración perfecta',
      ],
      correctIndex: 1,
      explanation: 'n chico → incertidumbre alta.',
    },
    {
      concept: 'proxies-sample-harm',
      question: 'Daño diferencial ocurre cuando:',
      options: [
        'Todos los grupos tienen el mismo error',
        'Errores o cargas impactan desproporcionadamente a un grupo',
        'El modelo es un dummy',
        'No hay scores',
      ],
      correctIndex: 1,
      explanation: 'Harm analysis ≠ acusar de fraude a personas.',
    },
    {
      concept: 'cal-intervals-conformal',
      question: 'La calibración de probabilidades busca:',
      options: [
        'Que un score 0.7 se materialice ~70% de las veces en condiciones adecuadas',
        'Maximizar solo accuracy',
        'Eliminar el human review',
        'Probar colusión',
      ],
      correctIndex: 0,
      explanation: 'Probabilidades confiables para decisiones.',
    },
    {
      concept: 'cal-intervals-conformal',
      question: 'Conformal prediction (concepto) aporta:',
      options: [
        'Garantías de cobertura de conjuntos de predicción bajo supuestos',
        'Un reemplazo de todos los modelos',
        'Labels de parentesco',
        'Un optimizador de SQL',
      ],
      correctIndex: 1,
      explanation: 'Cobertura finita-sample con supuestos.',
    },
    {
      concept: 'cal-intervals-conformal',
      question: 'Intervalos de incertidumbre se usan para:',
      options: [
        'Forzar decisiones binarias siempre',
        'Comunicar duda y disparar abstención/revisión',
        'Borrar el model card',
        'Ocultar errores de slice',
      ],
      correctIndex: 1,
      explanation: 'Incertidumbre → control humano.',
    },
    {
      concept: 'ood-abstention',
      question: 'Un input out-of-distribution (OOD) es:',
      options: [
        'Idéntico al train en todas las features',
        'Atípico respecto a la distribución de entrenamiento',
        'Siempre un FP',
        'Un índice de base de datos',
      ],
      correctIndex: 1,
      explanation: 'OOD = fuera de soporte visto.',
    },
    {
      concept: 'ood-abstention',
      question: 'Ante OOD, una política responsable es:',
      options: [
        'Forzar la clase positiva de alto score como fraude',
        'Abstenerse o escalar a humano con evidencia del score',
        'Borrar logs',
        'Reentrenar en silencio sin monitoreo',
      ],
      correctIndex: 1,
      explanation: 'Abstención > autoveredicto. Score ≠ fraude.',
    },
    {
      concept: 'ood-abstention',
      question: 'Detectar OOD puede basarse en:',
      options: [
        'Solo el nombre del archivo',
        'Distancias, densidades, scores de novedad o reglas de rango',
        'El color del botón',
        'El número de licencias de Windows',
      ],
      correctIndex: 1,
      explanation: 'Señales de novedad + política.',
    },
    {
      concept: 'model-card-contestability',
      question: 'Un model card documenta:',
      options: [
        'Solo el accuracy en un screenshot',
        'Propósito, datos, métricas, límites, riesgos y uso previsto',
        'Contraseñas de despliegue',
        'PII de evaluación real',
      ],
      correctIndex: 1,
      explanation: 'Transparencia operativa y ética.',
    },
    {
      concept: 'model-card-contestability',
      question: 'Contestabilidad significa:',
      options: [
        'Que nadie puede cuestionar el score',
        'Que existe vía para impugnar/revisar decisiones automatizadas',
        'Que el modelo no tiene umbral',
        'Que se prohíbe el override',
      ],
      correctIndex: 1,
      explanation: 'Derecho/proceso a cuestionar.',
    },
    {
      concept: 'model-card-contestability',
      question: 'Sin límites de uso en el model card, el riesgo es:',
      options: [
        'Over-documentación',
        'Uso fuera de alcance (p. ej. tratar score como prueba legal de fraude)',
        'Mejor calibración',
        'Menos slices',
      ],
      correctIndex: 1,
      explanation: 'Scope misuse es un riesgo central.',
    },
    {
      concept: 'approve-override-appeal-retire',
      question: 'Aprobación humana (human approval) en el flujo implica:',
      options: [
        'Que el modelo publica solo a redes',
        'Un actor autorizado confirma/alta la acción antes o después del score',
        'Que no hay logs',
        'Que el score es ley',
      ],
      correctIndex: 1,
      explanation: 'Human control point.',
    },
    {
      concept: 'approve-override-appeal-retire',
      question: 'Override documentado debe registrar:',
      options: [
        'Nada, para ir más rápido',
        'Quién, cuándo, por qué y el estado previo del sistema',
        'Solo el emoji del analista',
        'PII innecesaria extra',
      ],
      correctIndex: 1,
      explanation: 'Auditoría del override.',
    },
    {
      concept: 'approve-override-appeal-retire',
      question: 'Retirar un modelo (retire) es apropiado cuando:',
      options: [
        'El model card es largo',
        'Hay daño, drift severo, incumplimiento o reemplazo versionado planificado',
        'El accuracy de train bajó 0.001% un día',
        'Un usuario pidió un color nuevo en la UI',
      ],
      correctIndex: 1,
      explanation: 'Retiro = control de riesgo. Scores retirados tampoco “prueban” fraude histórico sin contexto.',
    },
  ],
  // === Section 36: Clustering, anomalías y validación temporal V3 (platform id ai-apis-advanced) ===
  'ai-apis-advanced': [
    {
      concept: 'scale-kmeans-density',
      question: 'k-means es sensible a la escala porque:',
      options: [
        'Usa distancias (típic. euclídeas) en el espacio de features',
        'No usa distancias',
        'Solo funciona con texto',
        'Ignora centroides',
      ],
      correctIndex: 0,
      explanation: 'Escala features antes de k-means.',
    },
    {
      concept: 'scale-kmeans-density',
      question: 'Métodos de densidad (p. ej. DBSCAN conceptualmente) agrupan por:',
      options: [
        'Solo un hiperplano supervisado',
        'Densidad local de puntos y conectividad',
        'El label de fraude obligatorio',
        'El orden del CSV únicamente',
      ],
      correctIndex: 1,
      explanation: 'Densidad ≠ veredicto de fraude.',
    },
    {
      concept: 'scale-kmeans-density',
      question: 'Elegir k en k-means sin criterio lleva a:',
      options: [
        'Clusters siempre semánticamente perfectos',
        'Particiones arbitrarias difíciles de validar',
        'Calibración Brier automática',
        'Garantía de novelty detection',
      ],
      correctIndex: 1,
      explanation: 'k es hipótesis, no verdad.',
    },
    {
      concept: 'choice-stability-metrics',
      question: 'Estabilidad de clustering se evalúa mirando:',
      options: [
        'Si particiones cambian mucho con seeds/submuestras',
        'Solo un silhouette en un único run',
        'El color de los clusters en un plot',
        'La latencia del predict',
      ],
      correctIndex: 0,
      explanation: 'Estabilidad > un plot bonito.',
    },
    {
      concept: 'choice-stability-metrics',
      question: 'Métricas internas (silhouette, etc.) son limitadas porque:',
      options: [
        'Siempre optimizan el negocio',
        'No garantizan utilidad semántica ni ausencia de daño',
        'Requieren labels siempre',
        'Solo sirven en NLP',
      ],
      correctIndex: 1,
      explanation: 'Internas ≠ validación de negocio.',
    },
    {
      concept: 'choice-stability-metrics',
      question: 'Documentar la distancia y el preprocess del cluster evita:',
      options: [
        'La reproducibilidad',
        'Comparar peras con manzanas entre corridas',
        'El uso de seeds',
        'La visualización',
      ],
      correctIndex: 1,
      explanation: 'Protocolo comparable.',
    },
    {
      concept: 'pca-visualization',
      question: 'PCA encuentra direcciones de:',
      options: [
        'Máxima varianza (bajo linealidad) en features posiblemente escaladas',
        'Máximo AUC supervisado siempre',
        'Mínima densidad',
        'Solo categorías one-hot sin centrar jamás',
      ],
      correctIndex: 0,
      explanation: 'PCA = varianza, no target.',
    },
    {
      concept: 'pca-visualization',
      question: 'Visualizar PC1-PC2 es útil para:',
      options: [
        'Exploración; no prueba clusters reales en el espacio original completo',
        'Demostrar fraude legal',
        'Eliminar la necesidad de escalar',
        'Reemplazar el model card',
      ],
      correctIndex: 0,
      explanation: 'Proyección 2D es aproximación.',
    },
    {
      concept: 'pca-visualization',
      question: 'Estandarizar antes de PCA es común porque:',
      options: [
        'Features en escalas distintas dominarían la varianza',
        'PCA prohíbe números',
        'Elimina outliers siempre',
        'Convierte scores en probabilidades calibradas',
      ],
      correctIndex: 0,
      explanation: 'Escala comparable entre ejes.',
    },
    {
      concept: 'prudent-projection-interp',
      question: 'Interpretar un eje PCA como “eje de fraude” es:',
      options: [
        'Siempre correcto si el color del plot es rojo',
        'Abuso de interpretación; los componentes son combinaciones de varianza',
        'Requerido por sklearn',
        'Equivalente a conformal prediction',
      ],
      correctIndex: 1,
      explanation: 'No renombres PCs como culpabilidad. Scores/proyecciones ≠ fraude.',
    },
    {
      concept: 'prudent-projection-interp',
      question: 'Cargas (loadings) altas en una feature indican:',
      options: [
        'Causalidad legal',
        'Contribución fuerte a esa componente de varianza',
        'Que la feature es el target',
        'Parentesco',
      ],
      correctIndex: 1,
      explanation: 'Loading ≠ causa.',
    },
    {
      concept: 'prudent-projection-interp',
      question: 'Proyecciones para stakeholders deben:',
      options: [
        'Ocultar límites y parecer mapas de culpables',
        'Declarar que son exploratorias y no decisiones automatizadas',
        'Incluir PII real',
        'Usar solo 1 punto',
      ],
      correctIndex: 1,
      explanation: 'Prudencia comunicacional.',
    },
    {
      concept: 'iforest-lof-rules',
      question: 'Isolation Forest puntúa anomalías por:',
      options: [
        'Facilidad de aislar un punto con particiones aleatorias',
        'Regresión logística supervisada',
        'Solo reglas SQL',
        'PageRank',
      ],
      correctIndex: 0,
      explanation: 'Aislar = señal de rareza geométrica, no prueba legal.',
    },
    {
      concept: 'iforest-lof-rules',
      question: 'LOF compara:',
      options: [
        'Densidad local de un punto vs la de sus vecinos',
        'Solo medias globales',
        'Embeddings de vision transformers obligatorios',
        'Certificados TLS',
      ],
      correctIndex: 0,
      explanation: 'LOF = rareza local.',
    },
    {
      concept: 'iforest-lof-rules',
      question: 'Reglas de negocio junto a detectores de anomalía sirven para:',
      options: [
        'Reemplazar todo ML siempre',
        'Codificar restricciones conocidas y reducir alertas absurdas',
        'Eliminar la revisión humana',
        'Etiquetar parentesco',
      ],
      correctIndex: 1,
      explanation: 'Híbrido reglas + scores. Anomalía ≠ fraude demostrado.',
    },
    {
      concept: 'novelty-vs-outlier-contam',
      question: 'Outlier detection asume que:',
      options: [
        'El train ya puede contener anomalías a detectar en el mismo pool',
        'El train es puro y solo el serve tiene rarezas (novelty puro)',
        'No hay features',
        'Siempre hay labels densos',
      ],
      correctIndex: 0,
      explanation: 'Outlier: anomalías mezcladas en el fit set típico.',
    },
    {
      concept: 'novelty-vs-outlier-contam',
      question: 'Novelty detection asume mejor un train:',
      options: [
        'Contaminado al 50% sin modelar',
        'Mayormente “normal” para marcar lo nuevo en serve',
        'Sin escalar nunca si hay distancias',
        'Con el label de fraude como feature',
      ],
      correctIndex: 1,
      explanation: 'Novelty: aprender normalidad.',
    },
    {
      concept: 'novelty-vs-outlier-contam',
      question: 'El hiperparámetro de contamination aproxima:',
      options: [
        'La fracción esperada de anomalías; es hipótesis operativa',
        'El learning rate de boosting',
        'El número de GPUs',
        'La prevalencia de parentesco',
      ],
      correctIndex: 0,
      explanation: 'Contamination no “demuestra” fraude; calibra volumen de alertas.',
    },
    {
      concept: 'splits-backtests-windows',
      question: 'Un backtest temporal para anomalías/supervisado usa:',
      options: [
        'Filas futuras en el train del pasado',
        'Ventanas walk-forward que respetan el tiempo',
        'Shuffle total del tiempo como default ético',
        'Solo un holdout aleatorio con leakage',
      ],
      correctIndex: 1,
      explanation: 'Tiempo hacia adelante.',
    },
    {
      concept: 'splits-backtests-windows',
      question: 'Elegir ventanas de evaluación debe documentar:',
      options: [
        'Inicio/fin, stride y qué datos ve cada fit',
        'Solo el silhouette',
        'El color del plot 3D',
        'La marca del servidor',
      ],
      correctIndex: 0,
      explanation: 'Protocolo de ventana.',
    },
    {
      concept: 'splits-backtests-windows',
      question: 'Usar información del futuro para definir “normalidad” del pasado es:',
      options: [
        'Backtest válido',
        'Leakage temporal',
        'Conformal prediction',
        'Un missing indicator',
      ],
      correctIndex: 1,
      explanation: 'No mires el futuro.',
    },
    {
      concept: 'scarce-labels-pk-human',
      question: 'Con labels escasos, precision@k ayuda porque:',
      options: [
        'Evalúa calidad de los k más prioritarios revisables',
        'Reemplaza toda calibración',
        'Mide solo accuracy global trivial',
        'Prueba colusión',
      ],
      correctIndex: 0,
      explanation: 'Alineado a capacidad humana.',
    },
    {
      concept: 'scarce-labels-pk-human',
      question: 'Revisión humana de alertas de anomalía debe:',
      options: [
        'Tratar cada score alto como fraude probado',
        'Usar rúbricas, sintéticos de práctica y no estigmatizar sin evidencia',
        'Publicar nombres reales',
        'Desactivar logs',
      ],
      correctIndex: 1,
      explanation: 'HITL responsable. Score ≠ fraude.',
    },
    {
      concept: 'scarce-labels-pk-human',
      question: 'Cuando no hay labels, validación puede combinar:',
      options: [
        'Solo accuracy',
        'Estabilidad, reglas, muestreo de alertas y métricas de operación',
        'Únicamente ROC con labels inventados sin documentar',
        'Borrar el detector',
      ],
      correctIndex: 1,
      explanation: 'Validación multi-señal con humildad.',
    },
  ],
  // === Section 37: Profiling, algoritmos y rendimiento V3 (platform id dbt-bigquery) ===
  'dbt-bigquery': [
    {
      concept: 'wall-cpu-memory-profile',
      question: 'Wall time mide:',
      options: [
        'Solo tiempo de CPU de un núcleo ignorando waits',
        'Tiempo de reloj de pared completo de la operación',
        'Resident set size pico',
        'El número de cache hits',
      ],
      correctIndex: 1,
      explanation: 'Wall = lo que espera el usuario/sistema.',
    },
    {
      concept: 'wall-cpu-memory-profile',
      question: 'CPU time vs wall time difiere cuando:',
      options: [
        'Hay I/O, waits o paralelismo',
        'El programa es empty',
        'Solo hay enteros',
        'No hay sistema operativo',
      ],
      correctIndex: 0,
      explanation: 'Espera e I/O abren la brecha.',
    },
    {
      concept: 'wall-cpu-memory-profile',
      question: 'Memory profiling ayuda a encontrar:',
      options: [
        'Solo bugs de redondeo float',
        'Picos de RSS, leaks y estructuras costosas',
        'El mejor learning rate',
        'Labels de fraude',
      ],
      correctIndex: 1,
      explanation: 'Memoria es recurso de primera clase.',
    },
    {
      concept: 'bench-warmup-variability',
      question: 'Warmup en benchmarks sirve para:',
      options: [
        'Inflar el tiempo a propósito',
        'Estabilizar caches/JIT antes de medir el estado estacionario',
        'Eliminar la varianza siempre a cero',
        'Saltar el profiler',
      ],
      correctIndex: 1,
      explanation: 'Warmup reduce ruido de arranque.',
    },
    {
      concept: 'bench-warmup-variability',
      question: 'Reportar un solo timing sin repeticiones es débil porque:',
      options: [
        'La variabilidad del sistema distorsiona una muestra',
        'Python prohíbe loops',
        'Wall time no existe',
        'Solo importa el color del plot',
      ],
      correctIndex: 0,
      explanation: 'Repite y resume (mediana/p95).',
    },
    {
      concept: 'bench-warmup-variability',
      question: 'Una fixture de benchmark debe:',
      options: [
        'Depender de la red de prod con PII',
        'Ser determinista, versionada y representativa del workload',
        'Cambiar en cada commit sin nota',
        'Incluir sleeps aleatorios largos sin seed',
      ],
      correctIndex: 1,
      explanation: 'Workload reproducible.',
    },
    {
      concept: 'complexity-blocking',
      question: 'Analizar complejidad (big-O) de un paso de matching/grafo ayuda a:',
      options: [
        'Elegir estructuras y cortes antes de microoptimizar',
        'Demostrar fraude',
        'Evitar tests de regresión',
        'Ignorar n grande',
      ],
      correctIndex: 0,
      explanation: 'Complejidad guía diseño.',
    },
    {
      concept: 'complexity-blocking',
      question: 'Blocking/candidate reduction existe para:',
      options: [
        'Comparar el producto cartesiano completo siempre',
        'Bajar candidatos de O(n²) hacia un subconjunto manejable con recall alto',
        'Borrar features',
        'Calibrar Brier',
      ],
      correctIndex: 1,
      explanation: 'Blocking = performance + recall trade-off. No es veredicto de fraude.',
    },
    {
      concept: 'complexity-blocking',
      question: 'Si un algoritmo es O(n²) en pares y n crece 10×, el costo de pares:',
      options: [
        'Crece ~100× (orden de magnitud)',
        'Se mantiene igual',
        'Baja',
        'Depende solo del color del logo',
      ],
      correctIndex: 0,
      explanation: 'Cuadrático duele con n.',
    },
    {
      concept: 'structures-vectorize-reduce',
      question: 'Elegir dict/set/indices adecuados suele:',
      options: [
        'Importar más que micro-tunnings de una línea caliente mal medida',
        'Ser irrelevante frente a un sleep(1)',
        'Reemplazar la necesidad de medir',
        'Probar parentesco',
      ],
      correctIndex: 0,
      explanation: 'Estructuras correctas > micropremature.',
    },
    {
      concept: 'structures-vectorize-reduce',
      question: 'Vectorizar con NumPy/pandas (cuando aplica) gana porque:',
      options: [
        'Ejecuta loops Python puros más lentos a propósito',
        'Mueve trabajo a rutinas compiladas y menos overhead de intérprete',
        'Elimina la complejidad algorítmica siempre',
        'Borra el GIL magicamente en todo código',
      ],
      correctIndex: 1,
      explanation: 'Menos overhead, más throughput.',
    },
    {
      concept: 'structures-vectorize-reduce',
      question: 'Reducir candidatos antes de un scorer costoso es:',
      options: [
        'Una forma de control de complejidad práctica',
        'Siempre incorrecto',
        'Solo cosmético',
        'Un tipo de leakage de label',
      ],
      correctIndex: 0,
      explanation: 'Filter then score.',
    },
    {
      concept: 'dtypes-chunking-columnar',
      question: 'Usar dtypes compactos (category, float32, int32) reduce:',
      options: [
        'La corrección de la lógica de negocio siempre',
        'Memoria y a veces tiempo de scan',
        'La necesidad de tests',
        'El provenance',
      ],
      correctIndex: 1,
      explanation: 'Tipos importan a escala.',
    },
    {
      concept: 'dtypes-chunking-columnar',
      question: 'Chunking procesa datos:',
      options: [
        'Todo en un único materialize obligatorio siempre',
        'Por bloques para acotar memoria pico',
        'Solo en GPU',
        'Sin orden determinista posible',
      ],
      correctIndex: 1,
      explanation: 'Chunks = control de RSS.',
    },
    {
      concept: 'dtypes-chunking-columnar',
      question: 'Formatos columnares (Parquet, etc.) ayudan a:',
      options: [
        'Leer solo columnas necesarias y comprimir bien',
        'Forzar row-scans completos siempre',
        'Almacenar modelos sklearn',
        'Etiquetar fraude',
      ],
      correctIndex: 0,
      explanation: 'Columnar = I/O selectivo.',
    },
    {
      concept: 'cache-invalidate-ooc',
      question: 'Una caché de features/resultados intermedios debe definir:',
      options: [
        'Clave, TTL/invalidación y corrección ante cambios de versión',
        'Solo un dict global eterno sin clave',
        'Password en la clave en plaintext logs',
        'Invalidación nunca',
      ],
      correctIndex: 0,
      explanation: 'Cache correctness > speed.',
    },
    {
      concept: 'cache-invalidate-ooc',
      question: 'Out-of-core significa:',
      options: [
        'Procesar datasets mayores que RAM con streaming/particiones',
        'Que el CPU está off',
        'Solo usar un hilo',
        'Borrar el disco',
      ],
      correctIndex: 0,
      explanation: 'OOC = más allá de memoria.',
    },
    {
      concept: 'cache-invalidate-ooc',
      question: 'No invalidar caché tras cambiar el pipeline de features causa:',
      options: [
        'Speedups correctos siempre',
        'Resultados stale y bugs de train–serve silenciosos',
        'Mejor Brier',
        'Menos leakage siempre',
      ],
      correctIndex: 1,
      explanation: 'Stale cache es peligroso.',
    },
    {
      concept: 'perf-budget-tests',
      question: 'Un performance budget define:',
      options: [
        'Límites de latencia/memoria/costo que el sistema debe respetar',
        'El número máximo de comentarios en el código',
        'Solo el accuracy floor',
        'El color del flamegraph',
      ],
      correctIndex: 0,
      explanation: 'Budget = SLO de recurso.',
    },
    {
      concept: 'perf-budget-tests',
      question: 'Tests de performance en CI deben ser:',
      options: [
        'Flaky por diseño sin seed ni máquina de referencia',
        'Estables, con umbrales y workload fijo',
        'Ejecutados solo en laptops de prod con PII',
        'Más lentos que el job completo de entrenamiento siempre',
      ],
      correctIndex: 1,
      explanation: 'Perf tests deterministas y acotados.',
    },
    {
      concept: 'perf-budget-tests',
      question: 'Si un cambio rompe el budget, la respuesta ingenieril es:',
      options: [
        'Ignorar y mergear',
        'Optimizar, reducir scope o ajustar budget con justificación',
        'Borrar métricas',
        'Subir contamination a 0.9',
      ],
      correctIndex: 1,
      explanation: 'Presupuesto es contrato.',
    },
    {
      concept: 'total-cost-clarity-no-micro',
      question: 'Costo total de un pipeline incluye:',
      options: [
        'Solo el tiempo de una función microoptimizada',
        'Compute, memoria, I/O, ingeniería, operación y fallo',
        'Únicamente la licencia del IDE',
        'El número de emojis en el README',
      ],
      correctIndex: 1,
      explanation: 'TCO amplio.',
    },
    {
      concept: 'total-cost-clarity-no-micro',
      question: 'Microoptimizar antes de medir suele:',
      options: [
        'Ser la mejor primera acción',
        'Desperdiciar tiempo en puntos fríos',
        'Garantizar speedups 10×',
        'Calibrar umbrales',
      ],
      correctIndex: 1,
      explanation: 'Mide, luego optimiza el hot path.',
    },
    {
      concept: 'total-cost-clarity-no-micro',
      question: 'Claridad del código vs 2% local gain: en este curso se prioriza:',
      options: [
        'Ofuscar para ganar ciclos a ciegas',
        'Claridad y correctitud salvo hot path justificado con budget',
        'Eliminar tests',
        'Scores como prueba de fraude',
      ],
      correctIndex: 1,
      explanation: 'Legibilidad + perf donde importa.',
    },
  ],
  // === Section 38: Concurrencia, observabilidad y workflows resilientes V3 (platform id performance-extreme) ===
  'performance-extreme': [
    {
      concept: 'threads-processes-async',
      question: 'Threads en CPython son más adecuados cuando:',
      options: [
        'El workload es CPU-bound puro y se busca paralelismo real en un solo proceso',
        'Hay mucha espera I/O y se comparte memoria con cuidado',
        'Se necesita aislar fallos de memoria de extensiones nativas siempre',
        'Se prohíbe el uso de locks',
      ],
      correctIndex: 1,
      explanation: 'I/O-bound → threads o async; CPU-bound → processes.',
    },
    {
      concept: 'threads-processes-async',
      question: 'multiprocessing aporta:',
      options: [
        'Un solo GIL compartido entre procesos hijos',
        'Procesos con memoria separada y paralelismo de CPU',
        'Solo coroutines',
        'Un event loop de asyncio',
      ],
      correctIndex: 1,
      explanation: 'Procesos = paralelismo CPU.',
    },
    {
      concept: 'threads-processes-async',
      question: 'async/await brilla cuando:',
      options: [
        'Hay muchas tareas concurrentes de I/O en un hilo con event loop',
        'Se necesita matar el GIL para NumPy matmul',
        'No hay I/O',
        'Se quiere shared memory sin cuidado',
      ],
      correctIndex: 0,
      explanation: 'Async = concurrencia I/O eficiente.',
    },
    {
      concept: 'io-vs-cpu-gil-serialize',
      question: 'El GIL en CPython limita:',
      options: [
        'Paralelismo de threads en bytecode Python CPU-bound',
        'Todo I/O de red siempre a 1 paquete/s',
        'El uso de procesos',
        'La escritura de logs',
      ],
      correctIndex: 0,
      explanation: 'GIL = un thread ejecuta bytecode a la vez.',
    },
    {
      concept: 'io-vs-cpu-gil-serialize',
      question: 'Serializar objetos entre procesos cuesta porque:',
      options: [
        'pickle/IPC copia y no comparte RAM mágicamente',
        'Es gratis siempre',
        'No existe en Python',
        'Solo afecta a async',
      ],
      correctIndex: 0,
      explanation: 'IPC y pickle tienen precio.',
    },
    {
      concept: 'io-vs-cpu-gil-serialize',
      question: 'Elegir modelo de concurrencia depende primero de:',
      options: [
        'Si el cuello es I/O o CPU y de aislamiento requerido',
        'El color del logo',
        'Solo el número de emojis en el código',
        'Si el score “parece fraude”',
      ],
      correctIndex: 0,
      explanation: 'Clasifica el bottleneck. Scores ≠ fraude.',
    },
    {
      concept: 'pools-backpressure-rate',
      question: 'Un pool de workers limita:',
      options: [
        'La concurrencia máxima de tareas/conexiones costosas',
        'El tamaño del disco del SO',
        'La precisión del modelo',
        'El número de features',
      ],
      correctIndex: 0,
      explanation: 'Pools acotan fan-out.',
    },
    {
      concept: 'pools-backpressure-rate',
      question: 'Backpressure es:',
      options: [
        'Ignorar la cola y aceptar todo',
        'Señalar/ralentizar productores cuando el consumidor no da abasto',
        'Un tipo de boosting',
        'Borrar métricas',
      ],
      correctIndex: 1,
      explanation: 'Presión hacia atrás protege el sistema.',
    },
    {
      concept: 'pools-backpressure-rate',
      question: 'Rate limits protegen:',
      options: [
        'APIs y recursos de sobrecarga y abuso',
        'Solo el styling CSS',
        'La calibración Brier',
        'El parentesco en el grafo',
      ],
      correctIndex: 0,
      explanation: 'Límites de tasa = resiliencia y fairness de uso.',
    },
    {
      concept: 'cancel-timeout-resources',
      question: 'Timeouts existen para:',
      options: [
        'Dejar tareas colgadas eternas',
        'Acotar espera y liberar recursos ante lentitud/fallos',
        'Aumentar contamination',
        'Evitar logs',
      ],
      correctIndex: 1,
      explanation: 'Timeout = límite de espera.',
    },
    {
      concept: 'cancel-timeout-resources',
      question: 'Cancelar una tarea debe:',
      options: [
        'Dejar sockets/archivos abiertos sin cleanup',
        'Propagar cancelación y liberar recursos en finally/context managers',
        'Ignorar el pool',
        'Reintentar infinito sin jitter',
      ],
      correctIndex: 1,
      explanation: 'Cancelación limpia.',
    },
    {
      concept: 'cancel-timeout-resources',
      question: 'Filtrar recursos (file handles, conexiones) sin cierre provoca:',
      options: [
        'Fugas y agotamiento bajo carga',
        'Mejor latencia siempre',
        'Calibración perfecta',
        'Scores más éticos',
      ],
      correctIndex: 0,
      explanation: 'Resource hygiene.',
    },
    {
      concept: 'logs-metrics-traces',
      question: 'Logs, metrics y traces forman:',
      options: [
        'Tres pilares de observabilidad complementarios',
        'Un solo archivo CSV de features',
        'El model card completo',
        'Un algoritmo de clustering',
      ],
      correctIndex: 0,
      explanation: 'O11y triad.',
    },
    {
      concept: 'logs-metrics-traces',
      question: 'Métricas son ideales para:',
      options: [
        'Narrativas largas de un error único',
        'Agregados numéricos (latencia, error rate) y alertas',
        'Reemplazar traces de un request',
        'Guardar PII completa',
      ],
      correctIndex: 1,
      explanation: 'Metrics = series agregadas.',
    },
    {
      concept: 'logs-metrics-traces',
      question: 'Traces ayudan a:',
      options: [
        'Seguir un request a través de servicios/spans',
        'Entrenar random forest',
        'Definir el target supervisado',
        'Probar fraude legal',
      ],
      correctIndex: 0,
      explanation: 'Trace = camino distribuido de una operación.',
    },
    {
      concept: 'correlation-redact-sli-slo',
      question: 'Un correlation id permite:',
      options: [
        'Enlazar logs/traces de una misma solicitud de extremo a extremo',
        'Encriptar el disco automáticamente',
        'Elegir k en k-means',
        'Calcular Brier',
      ],
      correctIndex: 0,
      explanation: 'Correlación de telemetría.',
    },
    {
      concept: 'correlation-redact-sli-slo',
      question: 'Redacción de PII en logs es crítica porque:',
      options: [
        'Los logs suelen ser más expuestos que la DB de app',
        'Python no puede formatear strings',
        'Los SLOs lo prohíben al revés',
        'Aumenta el AUC',
      ],
      correctIndex: 0,
      explanation: 'No registres secretos ni PII real.',
    },
    {
      concept: 'correlation-redact-sli-slo',
      question: 'SLI vs SLO:',
      options: [
        'SLI mide; SLO es el objetivo de esa medición',
        'Son sinónimos exactos',
        'SLO es solo el logo',
        'SLI es un tipo de arbol',
      ],
      correctIndex: 0,
      explanation: 'Indicador vs objetivo.',
    },
    {
      concept: 'states-checkpoint-idempotency',
      question: 'Un workflow con estados explícitos permite:',
      options: [
        'Saber en qué paso está un caso y qué transiciones son válidas',
        'Evitar toda persistencia',
        'Predecir sin features',
        'Saltar timeouts',
      ],
      correctIndex: 0,
      explanation: 'State machine operativa.',
    },
    {
      concept: 'states-checkpoint-idempotency',
      question: 'Checkpointing sirve para:',
      options: [
        'Reanudar tras fallo sin rehacer todo el trabajo desde cero',
        'Borrar el runbook',
        'Invalidar correlation ids',
        'Forzar scores a 1.0',
      ],
      correctIndex: 0,
      explanation: 'Checkpoints = progreso durable.',
    },
    {
      concept: 'states-checkpoint-idempotency',
      question: 'Idempotencia en handlers de cola significa:',
      options: [
        'Procesar el mismo mensaje dos veces no corrompe el estado',
        'Nunca se puede reintentar',
        'El orden no importa nunca en ningún sistema',
        'Se ignora el schema',
      ],
      correctIndex: 0,
      explanation: 'At-least-once + idempotencia real.',
    },
    {
      concept: 'retry-dlq-replay-runbook',
      question: 'Retries con backoff/jitter evitan:',
      options: [
        'Thundering herd y reintentos sincronizados que empeoran la caída',
        'Toda observabilidad',
        'El uso de DLQ',
        'La idempotencia',
      ],
      correctIndex: 0,
      explanation: 'Backoff + jitter.',
    },
    {
      concept: 'retry-dlq-replay-runbook',
      question: 'Una dead-letter queue (DLQ) guarda:',
      options: [
        'Mensajes que agotaron reintentos para análisis/replay controlado',
        'Solo métricas de CPU',
        'Los model cards',
        'Passwords',
      ],
      correctIndex: 0,
      explanation: 'DLQ = cuarentena de fallos.',
    },
    {
      concept: 'retry-dlq-replay-runbook',
      question: 'Un runbook de incidente debe incluir:',
      options: [
        'Pasos de diagnóstico, mitigación, rollback/replay y comunicación',
        'Solo el nombre del pasante de turno',
        'PII de clientes de ejemplo real',
        'Cómo convertir scores en sentencia de fraude',
      ],
      correctIndex: 0,
      explanation: 'Runbooks operan humanos bajo estrés. Scores ≠ fraude.',
    },
  ],
  // === Section 39: Responsible ML Case Triage y cierre de nivel V3 (platform id integrator-phase2) ===
  'integrator-phase2': [
    {
      concept: 'intake-er-rel-features-model',
      question: 'El flujo intake → ER → relación → features → modelo en CP de nivel:',
      options: [
        'Salta el ER y va directo a culpabilidad',
        'Encadena resolución, grafo/relaciones, features y score con linaje',
        'Usa solo un CSV sin ids',
        'Publica PII en el intake público',
      ],
      correctIndex: 1,
      explanation: 'Cadena completa y auditable. Score final ≠ fraude probado.',
    },
    {
      concept: 'intake-er-rel-features-model',
      question: 'Romper el linaje entre ER y features provoca:',
      options: [
        'Mejor fairness automática',
        'Irreproducibilidad y features huérfanas de entidad',
        'Menor necesidad de contratos',
        'SLOs más claros',
      ],
      correctIndex: 1,
      explanation: 'Linaje une etapas.',
    },
    {
      concept: 'intake-er-rel-features-model',
      question: 'El intake debe validar:',
      options: [
        'Schema, consentimiento/minimización y trazas de origen sintético en el curso',
        'Solo el font del PDF',
        'Que el score sea > 0.9 para aceptar el caso',
        'Parentesco legal',
      ],
      correctIndex: 0,
      explanation: 'Puerta de calidad y privacidad.',
    },
    {
      concept: 'contracts-versions-ownership',
      question: 'Un data/model contract especifica:',
      options: [
        'Schema, semántica, SLAs y productores/consumidores responsables',
        'Solo el color del dashboard',
        'Passwords en claro',
        'Que no hay versionado',
      ],
      correctIndex: 0,
      explanation: 'Contratos = acuerdos verificables.',
    },
    {
      concept: 'contracts-versions-ownership',
      question: 'Ownership claro significa:',
      options: [
        'Nadie mantiene el pipeline',
        'Hay un rol responsable de cambios, incidentes y deprecaciones',
        'Todos editan prod a la vez sin PR',
        'El modelo se autoaprueba',
      ],
      correctIndex: 1,
      explanation: 'Dueño = accountability.',
    },
    {
      concept: 'contracts-versions-ownership',
      question: 'Versionar contratos/artefactos permite:',
      options: [
        'Cambios silenciosos sin migración',
        'Compatibilidad y rollbacks conscientes',
        'Evitar tests de contrato',
        'Ocultar el model card',
      ],
      correctIndex: 1,
      explanation: 'Versiones habilitan evolución segura.',
    },
    {
      concept: 'queue-evidence-packet-explain',
      question: 'La cola de revisión prioriza casos por:',
      options: [
        'Azar puro sin capacidad',
        'Política (score, riesgo, SLO) alineada a capacidad humana',
        'Orden alfabético del password',
        'Solo el color del alert',
      ],
      correctIndex: 1,
      explanation: 'Priorización operativa. Score ≠ veredicto.',
    },
    {
      concept: 'queue-evidence-packet-explain',
      question: 'Un evidence packet debe contener:',
      options: [
        'Features clave, paths/relaciones relevantes, versión de modelo y límites',
        'Solo un número sin contexto',
        'PII real innecesaria',
        'La contraseña del analista',
      ],
      correctIndex: 0,
      explanation: 'Paquete para decisión humana informada.',
    },
    {
      concept: 'queue-evidence-packet-explain',
      question: 'Explicar el score al revisor humano implica:',
      options: [
        'Convertirlo en sentencia de fraude',
        'Comunicar factores y incertidumbre sin overclaim',
        'Ocultar el umbral',
        'Prohibir override',
      ],
      correctIndex: 1,
      explanation: 'Explain for humans, not condemnation.',
    },
    {
      concept: 'decision-override-feedback-appeal',
      question: 'La decisión final en triage responsable:',
      options: [
        'Es siempre el argmax del modelo sin humano',
        'Combina política, score y juicio humano documentado cuando aplica',
        'Ignora el evidence packet',
        'Se publica en redes con nombres',
      ],
      correctIndex: 1,
      explanation: 'Decisión = proceso, no solo score.',
    },
    {
      concept: 'decision-override-feedback-appeal',
      question: 'Feedback del revisor debe:',
      options: [
        'Perderse en chats sin estructura',
        'Volver a datasets/labels con control de calidad y privacidad',
        'Incluir PII extra por si acaso',
        'Cambiar prod sin versión',
      ],
      correctIndex: 1,
      explanation: 'Cierra el loop de aprendizaje.',
    },
    {
      concept: 'decision-override-feedback-appeal',
      question: 'Apelación (appeal) permite:',
      options: [
        'Que nadie revise errores',
        'Reabrir/contestar una decisión con proceso y auditoría',
        'Borrar logs de override',
        'Subir contamination',
      ],
      correctIndex: 1,
      explanation: 'Contestabilidad operativa.',
    },
    {
      concept: 'privacy-fairness-security',
      question: 'Minimización de datos en el case triage significa:',
      options: [
        'Colectar todo por si acaso',
        'Usar solo campos necesarios para la decisión y el audit trail',
        'Loguear PII completa en cleartext',
        'Entrenar con datos reales de clientes sin base legal en el curso',
      ],
      correctIndex: 1,
      explanation: 'Curso usa sintéticos; en prod, base legal + minimización.',
    },
    {
      concept: 'privacy-fairness-security',
      question: 'Fairness en este cierre de nivel exige:',
      options: [
        'Ignorar slices',
        'Medir y mitigar daño diferencial con gobernanza, no solo AUC global',
        'Etiquetar parentesco real',
        'Prohibir model cards',
      ],
      correctIndex: 1,
      explanation: 'Equidad operativa.',
    },
    {
      concept: 'privacy-fairness-security',
      question: 'Seguridad del sistema de scores incluye:',
      options: [
        'Authn/z, secretos, integridad de artefactos y abuso del endpoint de score',
        'Dejar predict abierto sin rate limit',
        'Hardcodear API keys en el frontend',
        'Tratar el score como prueba penal',
      ],
      correctIndex: 0,
      explanation: 'Security del ML system. Score ≠ fraude legal.',
    },
    {
      concept: 'drift-incidents-rollback-human',
      question: 'Data/model drift se detecta con:',
      options: [
        'Monitoreo de distribuciones, métricas y alarmas vs baseline',
        'Solo mirar el logo',
        'Reentrenar cada minuto sin señales',
        'Borrar el test set',
      ],
      correctIndex: 0,
      explanation: 'Drift monitoring.',
    },
    {
      concept: 'drift-incidents-rollback-human',
      question: 'Rollback de modelo/pipeline es apropiado cuando:',
      options: [
        'Hay regresión severa, incidente de calidad o riesgo de daño',
        'Un comment en el código es largo',
        'El wall time mejoró',
        'El Brier bajó levemente en un slice n=3 sin más evidencia',
      ],
      correctIndex: 0,
      explanation: 'Rollback = control de daño.',
    },
    {
      concept: 'drift-incidents-rollback-human',
      question: 'Human control en incidentes implica:',
      options: [
        'Desactivar overrides',
        'Poder pausar auto-decisiones y escalar a runbook humano',
        'Ocultar el correlation id',
        'Publicar PII del incidente en Twitter',
      ],
      correctIndex: 1,
      explanation: 'Kill switch / pause + humanos.',
    },
    {
      concept: 'acceptance-demo',
      question: 'Criterios de aceptación del integrador deben ser:',
      options: [
        'Vagos y solo “se ve bien”',
        'Medibles: demos, tests, métricas, privacidad y rúbrica de value',
        'Secretos del comité',
        'Solo el número de líneas de código',
      ],
      correctIndex: 1,
      explanation: 'Acceptance medible.',
    },
    {
      concept: 'acceptance-demo',
      question: 'Una demo responsable muestra:',
      options: [
        'Cómo el score se confunde con sentencia de fraude',
        'Flujo extremo a extremo con datos sintéticos, límites y override',
        'PII real de un cliente',
        'Un notebook sin estados ni cola',
      ],
      correctIndex: 1,
      explanation: 'Demo = E2E + límites. Scores ≠ fraude.',
    },
    {
      concept: 'acceptance-demo',
      question: 'Fallar un criterio de privacidad en la demo implica:',
      options: [
        'Ignorarlo si el AUC es alto',
        'No aceptar hasta remediar',
        'Subir el umbral a 0.99 y listo',
        'Borrar el model card',
      ],
      correctIndex: 1,
      explanation: 'Privacidad es gate.',
    },
    {
      concept: 'cards-value-metrics-postmortem',
      question: 'System/data/model cards en el cierre documentan:',
      options: [
        'Propósito, datos, métricas, límites, incidentes conocidos y dueños',
        'Solo un GIF',
        'API keys',
        'Lista de culpables por centralidad',
      ],
      correctIndex: 0,
      explanation: 'Cards = memoria institucional. Centralidad ≠ culpa.',
    },
    {
      concept: 'cards-value-metrics-postmortem',
      question: 'Métricas de valor miden:',
      options: [
        'Solo loss de train',
        'Impacto operativo (tiempo de revisión, precisión útil, costo, daño evitado) con cuidado ético',
        'El número de clusters k',
        'La cantidad de prints de debug',
      ],
      correctIndex: 1,
      explanation: 'Value ≠ vanity accuracy.',
    },
    {
      concept: 'cards-value-metrics-postmortem',
      question: 'Un postmortem blameless registra:',
      options: [
        'Quién “es el malo” por un score alto',
        'Timeline, impacto, causas, acciones y prevención — sin humillar',
        'PII de usuarios afectados en claro en el wiki público',
        'Nada si el rollback funcionó',
      ],
      correctIndex: 1,
      explanation: 'Blameless + actionable. Score en incidente ≠ etiqueta moral.',
    },
  ],

  // === Section 40: Arquitectura, DDD y decisiones técnicas (agentic-architecture) ===
  'agentic-architecture': [
    {
      concept: "functional-quality-attrs",
      question: "En un mapa de arquitectura (intake→ER→relación→triage→reporting), un quality attribute es:",
      options: [
        "Un color de UI obligatorio",
        "Una propiedad medible de calidad (latencia, disponibilidad, auditabilidad)",
        "El nombre del bounded context",
        "Un ADR sin decisión",
      ],
      correctIndex: 1,
      explanation: "Los QA son no funcionales medibles; los FR describen qué hace el sistema.",
    },
    {
      concept: "functional-quality-attrs",
      question: "Un requisito funcional bien escrito debería:",
      options: [
        "Solo decir “el sistema debe ser rápido”",
        "Describir capacidad observable del negocio (p. ej. registrar un caso sintético)",
        "Omitir actores y salidas",
        "Reemplazar métricas de SLO",
      ],
      correctIndex: 1,
      explanation: "FR = comportamiento/capacidad; los atributos de calidad se miden aparte.",
    },
    {
      concept: "functional-quality-attrs",
      question: "¿Cuál es un quality attribute típico en un pipeline de ER sintético?",
      options: [
        "El logo del producto",
        "Tiempo p95 de resolución de un par candidato",
        "El número de commits por día",
        "El idioma del README",
      ],
      correctIndex: 1,
      explanation: "Latencia/precision/audit son QA; branding no.",
    },
    {
      concept: "tradeoffs-risks-measurable",
      question: "Documentar un trade-off arquitectónico útil implica:",
      options: [
        "Elegir siempre microservicios",
        "Alternativas, criterios medibles, decisión y riesgos residuales",
        "Solo listar tecnologías de moda",
        "Ocultar costos de operación",
      ],
      correctIndex: 1,
      explanation: "Trade-offs se defienden con criterios y riesgos medibles.",
    },
    {
      concept: "tradeoffs-risks-measurable",
      question: "Un riesgo medible en la capa de matching es:",
      options: [
        "“Puede fallar un poco”",
        "Candidate recall < 0.95 en el holdout sintético",
        "Que el equipo no guste del color del dashboard",
        "Usar Python 3",
      ],
      correctIndex: 1,
      explanation: "Riesgos se expresan con métricas y umbrales.",
    },
    {
      concept: "tradeoffs-risks-measurable",
      question: "Si priorizas throughput de candidatos sobre precisión de blocking:",
      options: [
        "No hay trade-off",
        "Aceptas más pares y costo de scoring a cambio de menos FN de candidatos",
        "Eliminas la necesidad de evals",
        "Pruebas que hay parentesco real",
      ],
      correctIndex: 1,
      explanation: "Recall de candidatos vs costo es un trade-off clásico. Matching ≠ parentesco.",
    },
    {
      concept: "cohesion-coupling-layers",
      question: "Alta cohesion en un módulo de triage significa:",
      options: [
        "Depende de todos los servicios externos",
        "Sus responsabilidades están estrechamente relacionadas al triage",
        "Comparte DB tables con reporting sin contrato",
        "Importa UI, ORM y LLM en el mismo archivo siempre",
      ],
      correctIndex: 1,
      explanation: "Cohesión = responsabilidades afines agrupadas.",
    },
    {
      concept: "cohesion-coupling-layers",
      question: "Bajo coupling entre capas se logra típicamente:",
      options: [
        "Llamadas directas a SQL desde la UI",
        "Contratos claros y dependencias hacia adentro (dominio)",
        "Globals mutables compartidos",
        "Un solo archivo de 5k líneas",
      ],
      correctIndex: 1,
      explanation: "Capas y contratos reducen acoplamiento.",
    },
    {
      concept: "cohesion-coupling-layers",
      question: "Mezclar intake, ER y reporting en un solo servicio “dios” aumenta:",
      options: [
        "Solo la legibilidad",
        "Acoplamiento y dificultad de evolucionar cada capacidad",
        "La idempotencia automática",
        "La prueba de fraude",
      ],
      correctIndex: 1,
      explanation: "God services acoplan cambios heterogéneos.",
    },
    {
      concept: "ports-adapters-domain-dep",
      question: "En ports & adapters, el dominio debería depender de:",
      options: [
        "Drivers concretos de Postgres y S3",
        "Puertos abstractos (interfaces), no de detalles de infraestructura",
        "El framework HTTP exclusivamente",
        "Secrets hardcodeados",
      ],
      correctIndex: 1,
      explanation: "La regla de dependencia apunta hacia el dominio.",
    },
    {
      concept: "ports-adapters-domain-dep",
      question: "Un adapter de salida típico es:",
      options: [
        "Una entity de dominio pura",
        "Un cliente que implementa el puerto hacia cola/DB externa",
        "El value object CaseId",
        "El ubiquitous language",
      ],
      correctIndex: 1,
      explanation: "Adapters conectan puertos con el mundo exterior.",
    },
    {
      concept: "ports-adapters-domain-dep",
      question: "Si el dominio importa SQLAlchemy Session directamente:",
      options: [
        "Es hexagonal puro",
        "Invierte la dependencia y acopla el core a infraestructura",
        "Garantiza ports correctos",
        "Es requerido por DDD",
      ],
      correctIndex: 1,
      explanation: "Infra no debe filtrarse al core.",
    },
    {
      concept: "bounded-contexts-ubiquitous",
      question: "Un bounded context delimita:",
      options: [
        "Solo la VPC de AWS",
        "Un modelo y lenguaje ubicuo con límites de consistencia/ownership",
        "El color del logo",
        "La versión de Python",
      ],
      correctIndex: 1,
      explanation: "BC = frontera de modelo y lenguaje.",
    },
    {
      concept: "bounded-contexts-ubiquitous",
      question: "“Case” en intake vs “Case” en billing con significados distintos sugiere:",
      options: [
        "Un solo modelo global forzado",
        "Contextos acotados (o anti-corruption) en lugar de un mega-modelo",
        "Que hay fraude entre equipos",
        "Que hay que borrar uno de los sistemas",
      ],
      correctIndex: 1,
      explanation: "Mismo término, distintos BC: no forzar un solo modelo.",
    },
    {
      concept: "bounded-contexts-ubiquitous",
      question: "El lenguaje ubicuo se usa para:",
      options: [
        "Nombres aleatorios de variables",
        "Alinear código, docs y conversación del dominio en el BC",
        "Ocultar contratos de API",
        "Reemplazar ADRs",
      ],
      correctIndex: 1,
      explanation: "Ubiquitous language vive en el BC.",
    },
    {
      concept: "entities-vo-services",
      question: "Una entity se distingue de un value object porque:",
      options: [
        "No tiene identidad; solo atributos",
        "Tiene identidad que persiste aunque cambien atributos",
        "Siempre es un string",
        "No puede tener comportamiento",
      ],
      correctIndex: 1,
      explanation: "Entity = identidad; VO = igualdad por valor.",
    },
    {
      concept: "entities-vo-services",
      question: "Money(amount, currency) modelado como VO implica:",
      options: [
        "Se identifica por UUID de fila siempre",
        "Dos instancias con mismos valores son intercambiables",
        "Debe mutarse in-place sin reglas",
        "Requiere parentesco entre cuentas",
      ],
      correctIndex: 1,
      explanation: "VO: igualdad estructural.",
    },
    {
      concept: "entities-vo-services",
      question: "Un domain service es apropiado cuando:",
      options: [
        "La lógica no encaja naturalmente en una sola entity/VO",
        "Solo necesitas un DTO de red",
        "Quieres evitar tests",
        "Debes hardcodear secrets",
      ],
      correctIndex: 1,
      explanation: "Servicios de dominio coordinan lógica multi-objeto.",
    },
    {
      concept: "c4-flow-adr",
      question: "Un ADR (Architecture Decision Record) documenta:",
      options: [
        "Solo el diff de CSS",
        "Contexto, decisión, alternativas y consecuencias",
        "El salary band del equipo",
        "PII de clientes reales",
      ],
      correctIndex: 1,
      explanation: "ADR captura decisiones y trade-offs.",
    },
    {
      concept: "c4-flow-adr",
      question: "El nivel C4 “Container” describe:",
      options: [
        "Solo píxeles de UI",
        "Aplicaciones/servicios desplegables y sus interacciones",
        "El AST de Python",
        "El plan de marketing",
      ],
      correctIndex: 1,
      explanation: "Containers = unidades desplegables.",
    },
    {
      concept: "c4-flow-adr",
      question: "Un diagrama de flujo de caso (intake→ER→triage) complementa C4 porque:",
      options: [
        "Reemplaza tests",
        "Muestra secuencia/responsables del proceso además de estructura estática",
        "Prueba colusión entre empresas",
        "Elimina la necesidad de contratos",
      ],
      correctIndex: 1,
      explanation: "Estructura (C4) + flujo (proceso) son vistas distintas.",
    },
    {
      concept: "apis-events-debt-compat",
      question: "Evolución compatible de API suele preferir:",
      options: [
        "Romper campos sin versión ni deprecación",
        "Añadir campos opcionales / versionar y deprecar con ventana",
        "Cambiar tipos en silencio en prod",
        "Reusar el mismo event name con payload incompatible",
      ],
      correctIndex: 1,
      explanation: "Compatibilidad = no romper consumidores sin plan.",
    },
    {
      concept: "apis-events-debt-compat",
      question: "Deuda técnica documentada es útil cuando:",
      options: [
        "Se ignora para siempre",
        "Se prioriza con costo/riesgo y plan de pago",
        "Se esconde en un TODO eterno sin owner",
        "Se usa para justificar fraude",
      ],
      correctIndex: 1,
      explanation: "Deuda se gestiona, no se mitifica.",
    },
    {
      concept: "apis-events-debt-compat",
      question: "Un evento de dominio versionado (case.resolved.v2) ayuda a:",
      options: [
        "Forzar a todos a desplegar al mismo milisegundo",
        "Consumidores a migrar sin romper v1 de inmediato",
        "Eliminar schemas",
        "Inferir parentesco de entidades",
      ],
      correctIndex: 1,
      explanation: "Versionado de eventos habilita evolución gradual.",
    },
  ],

  // === Section 41: APIs con FastAPI y contratos HTTP (llm-finetuning) ===
  'llm-finetuning': [
    {
      concept: "resources-methods-status",
      question: "En REST, POST /v1/jobs que crea un recurso suele responder:",
      options: [
        "404 por defecto",
        "201 Created (a menudo con Location)",
        "501 siempre",
        "418 obligatorio",
      ],
      correctIndex: 1,
      explanation: "Creación exitosa → 201.",
    },
    {
      concept: "resources-methods-status",
      question: "GET es seguro e idealmente:",
      options: [
        "Mutante del estado de negocio",
        "Sin side effects de escritura (safe/idempotente en la práctica de lectura)",
        "Solo para borrar",
        "Prohibido en FastAPI",
      ],
      correctIndex: 1,
      explanation: "GET no debe mutar estado de negocio.",
    },
    {
      concept: "resources-methods-status",
      question: "404 vs 400: 404 indica:",
      options: [
        "Body inválido",
        "Recurso no encontrado en la URI",
        "Auth fallida",
        "Rate limit",
      ],
      correctIndex: 1,
      explanation: "404 = no existe el recurso; 400 = request malformada.",
    },
    {
      concept: "idempotency-pagination-versioning",
      question: "Idempotency-Key en POST de pagos/jobs sirve para:",
      options: [
        "Acelerar CSS",
        "Reintentos seguros sin crear duplicados",
        "Omitir autenticación",
        "Versionar el schema de DB automáticamente",
      ],
      correctIndex: 1,
      explanation: "Claves de idempotencia deduplican side effects.",
    },
    {
      concept: "idempotency-pagination-versioning",
      question: "Paginación cursor-based es preferible a offset grande cuando:",
      options: [
        "El dataset es estático de 3 filas",
        "Hay inserciones concurrentes y offsets se vuelven caros/inestables",
        "Nunca hay más de una página",
        "Solo usas archivos locales",
      ],
      correctIndex: 1,
      explanation: "Cursors escalan mejor bajo escritura concurrente.",
    },
    {
      concept: "idempotency-pagination-versioning",
      question: "Versionar API como /v1/ es útil para:",
      options: [
        "Ocultar breaking changes sin comunicar",
        "Evolucionar contratos sin romper clientes de v1 de golpe",
        "Eliminar tests de contrato",
        "Guardar PII real en logs",
      ],
      correctIndex: 1,
      explanation: "Versionado gestiona compatibilidad.",
    },
    {
      concept: "routing-deps-models",
      question: "En FastAPI, Depends() se usa para:",
      options: [
        "Compilar a C",
        "Inyectar dependencias (DB session, auth, settings) en handlers",
        "Reemplazar Pydantic",
        "Deshabilitar OpenAPI",
      ],
      correctIndex: 1,
      explanation: "DI limpia handlers y testea seams.",
    },
    {
      concept: "routing-deps-models",
      question: "Separar path operation de modelos Pydantic ayuda a:",
      options: [
        "Mezclar validación y SQL en un solo string",
        "Validar request/response y documentar el contrato",
        "Evitar status codes",
        "Forzar sync siempre",
      ],
      correctIndex: 1,
      explanation: "Models = contrato tipado.",
    },
    {
      concept: "routing-deps-models",
      question: "Un router con prefix=/v1/jobs organiza:",
      options: [
        "Solo migraciones Alembic",
        "Rutas relacionadas bajo un namespace de recurso",
        "Secrets en el path",
        "GPU kernels",
      ],
      correctIndex: 1,
      explanation: "Routers agrupan recursos.",
    },
    {
      concept: "validation-serialize-docs",
      question: "response_model en FastAPI controla:",
      options: [
        "El color del Swagger UI únicamente",
        "Qué campos se serializan/validan en la respuesta",
        "El motor SQL",
        "El TLS cipher",
      ],
      correctIndex: 1,
      explanation: "response_model filtra y documenta salida.",
    },
    {
      concept: "validation-serialize-docs",
      question: "Un 422 en FastAPI suele indicar:",
      options: [
        "Auth OK y negocio OK",
        "Error de validación de request (body/query/path)",
        "Gateway timeout",
        "Deploy exitoso",
      ],
      correctIndex: 1,
      explanation: "422 = validation error típico.",
    },
    {
      concept: "validation-serialize-docs",
      question: "OpenAPI generado automáticamente sirve para:",
      options: [
        "Reemplazar monitores de prod",
        "Contrato legible por humanos y clientes generados",
        "Almacenar embeddings",
        "Entrenar LoRA",
      ],
      correctIndex: 1,
      explanation: "Docs = contrato compartido.",
    },
    {
      concept: "sync-async-background",
      question: "Usar async def en un endpoint I/O-bound permite:",
      options: [
        "Ejecutar CPU-bound sin GIL issues mágicamente",
        "No bloquear el event loop mientras espera I/O",
        "Evitar cualquier timeout",
        "Ignorar connection pools",
      ],
      correctIndex: 1,
      explanation: "async brilla en espera de I/O.",
    },
    {
      concept: "sync-async-background",
      question: "BackgroundTasks en FastAPI es adecuado para:",
      options: [
        "Entrenar un LLM de 70B en el request",
        "Trabajo corto post-respuesta (métricas, emails sintéticos livianos)",
        "Sustituir un worker de cola siempre",
        "Bloquear al cliente hasta terminar 1h de job",
      ],
      correctIndex: 1,
      explanation: "BackgroundTasks ≠ job queue pesada.",
    },
    {
      concept: "sync-async-background",
      question: "Un job largo de matching debería:",
      options: [
        "Correr síncrono en el request HTTP 30 min",
        "Aceptarse (202/job id) y procesarse en worker/cola",
        "Usar solo print sin estado",
        "Compartir PII en querystring",
      ],
      correctIndex: 1,
      explanation: "Async job pattern para trabajo largo.",
    },
    {
      concept: "errors-timeouts-lifecycle",
      question: "Mapear excepciones de dominio a HTTP evita:",
      options: [
        "Logs estructurados",
        "Filtrar stack traces y códigos inconsistentes al cliente",
        "Healthchecks",
        "Idempotencia",
      ],
      correctIndex: 1,
      explanation: "Capa de errores = contrato estable.",
    },
    {
      concept: "errors-timeouts-lifecycle",
      question: "Timeouts en clientes HTTP salientes protegen de:",
      options: [
        "Mejorar latencia p50 siempre",
        "Esperas indefinidas que agotan workers",
        "Necesidad de retries",
        "TLS",
      ],
      correctIndex: 1,
      explanation: "Timeouts limitan resource exhaustion.",
    },
    {
      concept: "errors-timeouts-lifecycle",
      question: "Startup/shutdown events sirven para:",
      options: [
        "Pintar botones",
        "Abrir/cerrar pools, clientes y recursos del app lifecycle",
        "Cambiar el correctIndex del exam",
        "Generar PII",
      ],
      correctIndex: 1,
      explanation: "Lifecycle hooks gestionan recursos.",
    },
    {
      concept: "unit-contract-integration",
      question: "Un contract test de API verifica:",
      options: [
        "Solo el color del 404 page",
        "Que request/response respetan el schema y status acordados",
        "El rendimiento de GPU",
        "La política de RRHH",
      ],
      correctIndex: 1,
      explanation: "Contrato = schema + semántica HTTP.",
    },
    {
      concept: "unit-contract-integration",
      question: "Tests unitarios de handlers con deps override permiten:",
      options: [
        "Siempre levantar Postgres real",
        "Aislar lógica sin I/O real costoso",
        "Omitir asserts",
        "Desactivar CI",
      ],
      correctIndex: 1,
      explanation: "Overrides = seams de test.",
    },
    {
      concept: "unit-contract-integration",
      question: "Un test de integración API+DB valida:",
      options: [
        "Solo mocks en memoria sin I/O",
        "El camino real de persistencia y serialización bajo fixtures sintéticas",
        "El marketing del producto",
        "Que matching implica fraude",
      ],
      correctIndex: 1,
      explanation: "Integración ejercita boundaries reales con datos sintéticos.",
    },
    {
      concept: "compat-ratelimit-observability",
      question: "Rate limiting en una API pública busca:",
      options: [
        "Acelerar un solo cliente abusivo",
        "Proteger capacidad y costo ante abuso/tráfico excesivo",
        "Eliminar autenticación",
        "Romper idempotencia a propósito",
      ],
      correctIndex: 1,
      explanation: "Rate limits protegen el servicio.",
    },
    {
      concept: "compat-ratelimit-observability",
      question: "Métricas de latencia y tasa de 5xx son:",
      options: [
        "Opcionales solo en demos",
        "Señales de observabilidad para SLO y alertas",
        "Sustituto de authz",
        "Prueba de parentesco",
      ],
      correctIndex: 1,
      explanation: "Observabilidad operacional.",
    },
    {
      concept: "compat-ratelimit-observability",
      question: "Mantener campos deprecated un ciclo ayuda a:",
      options: [
        "Nunca migrar clientes",
        "Compatibilidad durante la transición de consumidores",
        "Evitar documentación",
        "Subir secrets al repo",
      ],
      correctIndex: 1,
      explanation: "Deprecation windows suavizan breaking changes.",
    },
  ],

  // === Section 42: Schemas, seguridad y privacidad de servicios (graph-rag) ===
  'graph-rag': [
    {
      concept: "pydantic-jsonschema",
      question: "Pydantic model_json_schema() aporta:",
      options: [
        "Entrenamiento GPU",
        "JSON Schema derivado del modelo para validación/docs",
        "Un ORM completo",
        "Cifrado homomórfico",
      ],
      correctIndex: 1,
      explanation: "Schema = contrato de datos.",
    },
    {
      concept: "pydantic-jsonschema",
      question: "Validar entrada con Pydantic en el borde del servicio:",
      options: [
        "Es opcional si confías en el cliente interno siempre",
        "Rechaza datos mal tipados antes de tocar dominio/DB",
        "Reemplaza authn",
        "Genera embeddings",
      ],
      correctIndex: 1,
      explanation: "Validación en el boundary.",
    },
    {
      concept: "pydantic-jsonschema",
      question: "Un Field(..., ge=0) en score sintético garantiza:",
      options: [
        "Que el score sea PII",
        "Restricción numérica mínima en validación",
        "Que haya match de parentesco",
        "Cero latencia",
      ],
      correctIndex: 1,
      explanation: "Constraints en schema.",
    },
    {
      concept: "evolution-unions-business-val",
      question: "Añadir un campo opcional al schema es usualmente:",
      options: [
        "Breaking para lectores tolerantes a desconocidos",
        "Compatible hacia adelante si los lectores ignoran extra/optional",
        "Imposible en JSON",
        "Señal de fraude",
      ],
      correctIndex: 1,
      explanation: "Optional additive suele ser compatible.",
    },
    {
      concept: "evolution-unions-business-val",
      question: "Uniones discriminadas (type: lit) ayudan a:",
      options: [
        "Ocultar el discriminador",
        "Parsear variantes de mensaje de forma segura",
        "Evitar versionado para siempre",
        "Saltar validación de negocio",
      ],
      correctIndex: 1,
      explanation: "Discriminated unions = polimorfismo seguro.",
    },
    {
      concept: "evolution-unions-business-val",
      question: "Validación de negocio (p. ej. end >= start) debe vivir:",
      options: [
        "Solo en el frontend",
        "En el servidor (schema/servicio) además de UX",
        "Únicamente en comentarios",
        "En el nombre del bucket S3",
      ],
      correctIndex: 1,
      explanation: "Server-side business rules.",
    },
    {
      concept: "authn-authz-rbac",
      question: "Authn responde “¿quién eres?”; authz responde:",
      options: [
        "¿Qué hora es?”",
        "¿Qué puedes hacer sobre este recurso?”",
        "¿Cuál es tu latencia p99?”",
        "¿Dónde está el Dockerfile?”",
      ],
      correctIndex: 1,
      explanation: "Identidad vs autorización.",
    },
    {
      concept: "authn-authz-rbac",
      question: "RBAC asigna permisos a:",
      options: [
        "Solo direcciones IP",
        "Roles que agrupan permisos reutilizables",
        "Cada pixel de UI",
        "Embeddings",
      ],
      correctIndex: 1,
      explanation: "Role-based access control.",
    },
    {
      concept: "authn-authz-rbac",
      question: "Autenticar sin autorizar en un endpoint sensible es:",
      options: [
        "Suficiente en producción regulada",
        "Insuficiente: falta control de acción/recurso",
        "Lo mismo que mTLS",
        "Un quality attribute de color",
      ],
      correctIndex: 1,
      explanation: "Authn ≠ authz.",
    },
    {
      concept: "scopes-service-ids-deny",
      question: "Scopes OAuth limitan:",
      options: [
        "El tamaño del disco",
        "Capacidades delegadas del token (least privilege)",
        "La versión de Python",
        "El learning rate",
      ],
      correctIndex: 1,
      explanation: "Scopes acotan autoridad del token.",
    },
    {
      concept: "scopes-service-ids-deny",
      question: "Identidad de servicio (service account) se usa para:",
      options: [
        "Login interactivo de humanos siempre",
        "Authn máquina-a-máquina con credenciales no humanas",
        "Pintar dashboards",
        "Entrenar QLoRA",
      ],
      correctIndex: 1,
      explanation: "Service identities para M2M.",
    },
    {
      concept: "scopes-service-ids-deny",
      question: "Default deny en authz significa:",
      options: [
        "Todo permitido salvo lista negra incompleta",
        "Denegar salvo permiso explícito",
        "Ignorar roles",
        "Confiar en el Client-IP header del usuario",
      ],
      correctIndex: 1,
      explanation: "Fail closed.",
    },
    {
      concept: "limits-injection-ssrf-path",
      question: "Un límite de tamaño de body mitiga:",
      options: [
        "Solo typos de JSON",
        "DoS por payloads enormes y costos de parseo",
        "La necesidad de HTTPS",
        "Drift de embeddings",
      ],
      correctIndex: 1,
      explanation: "Resource limits.",
    },
    {
      concept: "limits-injection-ssrf-path",
      question: "SSRF ocurre cuando el servidor:",
      options: [
        "Valida schemas de más",
        "Fetcha URLs controladas por el usuario hacia red interna",
        "Usa prepared statements",
        "Aplica RBAC estricto",
      ],
      correctIndex: 1,
      explanation: "SSRF = server-side request forgery.",
    },
    {
      concept: "limits-injection-ssrf-path",
      question: "Path traversal (../) en file APIs se mitiga con:",
      options: [
        "Concatenar user input al path root sin canonicalizar",
        "Normalizar/validar paths y restringir a un root permitido",
        "Desactivar auth",
        "Logs en plaintext de secrets",
      ],
      correctIndex: 1,
      explanation: "Canonical path + allowlist root.",
    },
    {
      concept: "secrets-crypto-deps",
      question: "Secrets de API no deben:",
      options: [
        "Vivir en un secret manager",
        "Commitearse en el repo ni imprimirse en logs",
        "Rotarse periódicamente",
        "Inyectarse por env en runtime",
      ],
      correctIndex: 1,
      explanation: "No secrets en git/logs.",
    },
    {
      concept: "secrets-crypto-deps",
      question: "Fijar versiones de dependencias ayuda a:",
      options: [
        "Reproducibilidad y control de supply chain",
        "Que pip elija al azar cada deploy",
        "Ocultar CVEs",
        "Evitar scans",
      ],
      correctIndex: 1,
      explanation: "Pinning + audits.",
    },
    {
      concept: "secrets-crypto-deps",
      question: "Usar crypto de librerías estándar/audítadas es preferible a:",
      options: [
        "TLS 1.3",
        "Roll-your-own cifrado casero",
        "Secret managers",
        "Rotación de keys",
      ],
      correctIndex: 1,
      explanation: "No inventes crypto.",
    },
    {
      concept: "minimize-purpose-retention",
      question: "Minimización de datos implica:",
      options: [
        "Recolectar todo por si acaso",
        "Solo lo necesario para el propósito declarado",
        "Copiar PII a logs de debug indefinidamente",
        "Entrenar con datos reales sin base legal",
      ],
      correctIndex: 1,
      explanation: "Data minimization.",
    },
    {
      concept: "minimize-purpose-retention",
      question: "Retención limitada significa:",
      options: [
        "Guardar para siempre “por analytics”",
        "Borrar/anonimizar al cumplir el plazo del propósito",
        "Nunca auditar accesos",
        "Publicar datasets con DNI reales",
      ],
      correctIndex: 1,
      explanation: "Retention bounds.",
    },
    {
      concept: "minimize-purpose-retention",
      question: "En demos del curso, preferimos datos:",
      options: [
        "De clientes reales de producción",
        "Sintéticos o anonimizados de propósito didáctico",
        "Con tarjetas de crédito vivas",
        "Con historial médico real",
      ],
      correctIndex: 1,
      explanation: "Synthetic by default.",
    },
    {
      concept: "audit-delete-pseudo-access",
      question: "Auditoría de acceso registra:",
      options: [
        "Solo el clima",
        "Quién/qué/cuándo accedió a recursos sensibles",
        "El learning rate",
        "El color del theme",
      ],
      correctIndex: 1,
      explanation: "Audit trails de acceso.",
    },
    {
      concept: "audit-delete-pseudo-access",
      question: "Pseudonimización reduce riesgo porque:",
      options: [
        "Hace los datos públicos automáticamente",
        "Separa identificadores directos del resto con controles",
        "Elimina la necesidad de authz",
        "Garantiza 0% reidentificación siempre",
      ],
      correctIndex: 1,
      explanation: "Pseudo ≠ anonimato perfecto, reduce exposición.",
    },
    {
      concept: "audit-delete-pseudo-access",
      question: "Right to delete operativo requiere:",
      options: [
        "Ignorar requests",
        "Procesos y jobs que borren/anonimicen en stores bajo política",
        "Solo un botón UI sin backend",
        "Matching de parentesco",
      ],
      correctIndex: 1,
      explanation: "Delete es proceso de datos end-to-end.",
    },
  ],

  // === Section 43: Contenedores y reproducibilidad operativa (llmops) ===
  'llmops': [
    {
      concept: "dockerfile-layers-cache",
      question: "Ordenar COPY de requirements antes del código de app favorece:",
      options: [
        "Invalidar cache en cada cambio de código de negocio",
        "Reutilizar capas de deps cuando solo cambia el source",
        "Imágenes siempre más grandes",
        "Root obligatorio",
      ],
      correctIndex: 1,
      explanation: "Layer caching de deps.",
    },
    {
      concept: "dockerfile-layers-cache",
      question: "Cada instrucción RUN relevante crea:",
      options: [
        "Un pod de K8s",
        "Una capa de imagen (con impacto en cache/tamaño)",
        "Un secret de AWS",
        "Un ADR",
      ],
      correctIndex: 1,
      explanation: "Dockerfile = capas.",
    },
    {
      concept: "dockerfile-layers-cache",
      question: "Combinar apt-get update && install en un RUN ayuda a:",
      options: [
        "Dejar índices viejos en capas separadas",
        "Consistencia de índices y limpieza en la misma capa",
        "Evitar non-root",
        "Saltar healthchecks",
      ],
      correctIndex: 1,
      explanation: "Best practice de paquetes OS.",
    },
    {
      concept: "bases-nonroot-size",
      question: "Correr el proceso como non-root en el contenedor:",
      options: [
        "Empeora siempre el performance",
        "Reduce impacto si hay escape de app",
        "Impide logs",
        "Rompe HTTP",
      ],
      correctIndex: 1,
      explanation: "Least privilege en runtime.",
    },
    {
      concept: "bases-nonroot-size",
      question: "Imágenes distroless/slim se eligen para:",
      options: [
        "Incluir compiladores innecesarios en prod",
        "Reducir superficie de ataque y tamaño",
        "Garantizar GPU",
        "Evitar digests",
      ],
      correctIndex: 1,
      explanation: "Smaller attack surface.",
    },
    {
      concept: "bases-nonroot-size",
      question: "Fijar digest de imagen base mejora:",
      options: [
        "Solo el color del logo",
        "Reproducibilidad frente a retags mutables",
        "La velocidad de DNS",
        "El F1 de ER",
      ],
      correctIndex: 1,
      explanation: "Immutable base references.",
    },
    {
      concept: "config-secrets-volumes",
      question: "Config no secreta en env/files y secrets en:",
      options: [
        "El Dockerfile como ENV plaintext commiteado",
        "Secret manager / mounts de secretos, no en la imagen",
        "El README público",
        "Query strings de GET",
      ],
      correctIndex: 1,
      explanation: "Secrets fuera de la imagen.",
    },
    {
      concept: "config-secrets-volumes",
      question: "Montar un volume de config permite:",
      options: [
        "Rebuildear imagen por cada flag",
        "Cambiar configuración sin rebuild de capas de código",
        "Eliminar healthchecks",
        "Exponer Docker socket al mundo",
      ],
      correctIndex: 1,
      explanation: "Config decoupling.",
    },
    {
      concept: "config-secrets-volumes",
      question: "Nunca montar el Docker socket en un contenedor no confiable porque:",
      options: [
        "Es más lento el JSON",
        "Equivale a privilegios altos sobre el host",
        "Rompe TLS",
        "Impide Python",
      ],
      correctIndex: 1,
      explanation: "Docker socket = host control.",
    },
    {
      concept: "net-health-signals",
      question: "Un endpoint /healthz liveness debería fallar cuando:",
      options: [
        "Hay un warning de estilo",
        "El proceso no puede seguir sirviendo (deadlock/crash loop)",
        "Un cliente manda 400",
        "El rate limit de un tenant",
      ],
      correctIndex: 1,
      explanation: "Liveness = proceso vivo útil.",
    },
    {
      concept: "net-health-signals",
      question: "Readiness falla cuando:",
      options: [
        "La app está up pero dependencias críticas aún no (DB)",
        "El logo no cargó",
        "Hay un log INFO",
        "El exam bank tiene 24 items",
      ],
      correctIndex: 1,
      explanation: "Readiness = listo para tráfico.",
    },
    {
      concept: "net-health-signals",
      question: "Exponer solo puertos necesarios reduce:",
      options: [
        "Observabilidad",
        "Superficie de red atacable",
        "La necesidad de auth",
        "Checksums",
      ],
      correctIndex: 1,
      explanation: "Network least exposure.",
    },
    {
      concept: "api-worker-db-cache",
      question: "Separar API y worker permite:",
      options: [
        "Un solo proceso bloqueado por jobs largos",
        "Escalar y fallar de forma independiente request path vs jobs",
        "Compartir memoria del intérprete sin serializar",
        "Evitar colas",
      ],
      correctIndex: 1,
      explanation: "Separation of runtimes.",
    },
    {
      concept: "api-worker-db-cache",
      question: "Un cache (Redis) delante de lecturas calientes busca:",
      options: [
        "Consistencia fuerte siempre sin costo",
        "Menor latencia/carga a la DB con trade-offs de frescura",
        "Reemplazar backups",
        "Authz",
      ],
      correctIndex: 1,
      explanation: "Cache trade-offs.",
    },
    {
      concept: "api-worker-db-cache",
      question: "La DB de estado de jobs no debería:",
      options: [
        "Tener migraciones",
        "Ser un volume efímero sin backup si el estado importa",
        "Usar conexiones pool",
        "Tener índices",
      ],
      correctIndex: 1,
      explanation: "Estado durable ≠ ephemeral disk sin plan.",
    },
    {
      concept: "deps-migrations-ephemeral",
      question: "Migraciones de schema en deploy deben ser:",
      options: [
        "Manuales solo en prod sin historial",
        "Versionadas, revisadas y preferiblemente backward-compatible",
        "Ejecutadas por el cliente final",
        "Commiteadas como SQL aleatorio sin orden",
      ],
      correctIndex: 1,
      explanation: "Migration discipline.",
    },
    {
      concept: "deps-migrations-ephemeral",
      question: "Contenedores efímeros implican que el filesystem local:",
      options: [
        "Es la source of truth de datos de negocio",
        "Puede perderse; estado va a volúmenes/servicios externos",
        "Reemplaza object storage",
        "Guarda PII sin cifrado “porque es tmp”",
      ],
      correctIndex: 1,
      explanation: "Ephemeral FS.",
    },
    {
      concept: "deps-migrations-ephemeral",
      question: "Lockfiles de deps en la imagen aseguran:",
      options: [
        "Última major siempre",
        "Mismas versiones resueltas en build reproducible",
        "Que no haya CVEs nunca",
        "GPU free",
      ],
      correctIndex: 1,
      explanation: "Lock = reproducible installs.",
    },
    {
      concept: "locks-multistage",
      question: "Multi-stage builds permiten:",
      options: [
        "Incluir compilers en la imagen final siempre",
        "Compilar en stage builder y copiar solo artefactos al runtime",
        "Evitar non-root",
        "Saltar scans",
      ],
      correctIndex: 1,
      explanation: "Builder vs runtime stages.",
    },
    {
      concept: "locks-multistage",
      question: "pip/poetry/npm freeze o lock en CI evita:",
      options: [
        "Tests",
        "Deriva silenciosa de versiones entre ambientes",
        "SBOM",
        "Healthchecks",
      ],
      correctIndex: 1,
      explanation: "Lock across envs.",
    },
    {
      concept: "locks-multistage",
      question: "Copiar solo el wheel/binario al stage final reduce:",
      options: [
        "La necesidad de ENTRYPOINT",
        "Herramientas de build y superficie en prod",
        "La portabilidad",
        "Labels OCI",
      ],
      correctIndex: 1,
      explanation: "Minimal runtime contents.",
    },
    {
      concept: "scan-limits-debug",
      question: "Escanear la imagen en CI busca:",
      options: [
        "Typos de markdown",
        "CVEs conocidos en OS/deps de la imagen",
        "F1 de matching",
        "Salarios",
      ],
      correctIndex: 1,
      explanation: "Vulnerability scanning.",
    },
    {
      concept: "scan-limits-debug",
      question: "Límites de CPU/mem en el orquestador previenen:",
      options: [
        "Logs JSON",
        "Un contenedor que consuma todo el nodo (noisy neighbor)",
        "Rolling updates",
        "Probes",
      ],
      correctIndex: 1,
      explanation: "Resource quotas.",
    },
    {
      concept: "scan-limits-debug",
      question: "Debug efímero (ephemeral container) es preferible a:",
      options: [
        "Dejar shells root y tools de debug en la imagen prod permanente",
        "Nunca poder diagnosticar",
        "Desactivar TLS",
        "Commitear dumps con secrets",
      ],
      correctIndex: 1,
      explanation: "No dejes debug toolkit en prod image.",
    },
  ],

  // === Section 44: CI/CD y seguridad de la cadena de suministro (multimodal) ===
  'multimodal': [
    {
      concept: "lint-types-tests-matrix",
      question: "Una matrix de CI con Python 3.11 y 3.12 valida:",
      options: [
        "Solo un intérprete olvidado",
        "Compatibilidad multi-versión antes del merge",
        "El diseño de logo",
        "Solo lint, nunca tests",
      ],
      correctIndex: 1,
      explanation: "Matrix = multi-env checks.",
    },
    {
      concept: "lint-types-tests-matrix",
      question: "Fallar el pipeline si mypy/ruff fallan implementa:",
      options: [
        "Deploy sin freno",
        "Quality gate temprano en la cadena",
        "Secrets scanning opcional siempre",
        "Canary en prod sin tests",
      ],
      correctIndex: 1,
      explanation: "Gates de calidad.",
    },
    {
      concept: "lint-types-tests-matrix",
      question: "Tests en CI deben ser:",
      options: [
        "Dependientes de la laptop del autor",
        "Deterministas con fixtures sintéticas",
        "Solo manuales",
        "Con PII real de clientes",
      ],
      correctIndex: 1,
      explanation: "CI determinista.",
    },
    {
      concept: "caches-artifacts-conditions",
      question: "Cachear deps en CI reduce:",
      options: [
        "La necesidad de lockfiles",
        "Tiempo de install repetido entre runs",
        "La seguridad automáticamente",
        "Artifacts de release",
      ],
      correctIndex: 1,
      explanation: "CI cache de deps.",
    },
    {
      concept: "caches-artifacts-conditions",
      question: "Publicar artifacts (wheels, reportes) permite:",
      options: [
        "Perder el binario del build",
        "Reutilizar outputs entre jobs/stages",
        "Saltar firmas siempre",
        "Evitar versionado",
      ],
      correctIndex: 1,
      explanation: "Artifacts = salidas del pipeline.",
    },
    {
      concept: "caches-artifacts-conditions",
      question: "Condiciones if: en jobs evitan:",
      options: [
        "Correr deploys en cada push a feature sin control",
        "Tener tests",
        "Usar matrix",
        "Generar SBOM",
      ],
      correctIndex: 1,
      explanation: "Conditional jobs controlan cuándo corre cada etapa.",
    },
    {
      concept: "min-perms-pin-secret-scan",
      question: "Least privilege en tokens de CI significa:",
      options: [
        "admin:org en todos los workflows",
        "Solo permisos mínimos por job (contents/packages/...)",
        "Un PAT personal compartido en logs",
        "Desactivar OIDC",
      ],
      correctIndex: 1,
      explanation: "Minimal GITHUB_TOKEN perms.",
    },
    {
      concept: "min-perms-pin-secret-scan",
      question: "Pinear actions por SHA mitiga:",
      options: [
        "Typos de YAML irrelevantes",
        "Supply-chain attacks por retag de tags mutables",
        "La necesidad de tests",
        "Rate limits de API",
      ],
      correctIndex: 1,
      explanation: "Pin actions by commit SHA.",
    },
    {
      concept: "min-perms-pin-secret-scan",
      question: "Secret scanning en el repo detecta:",
      options: [
        "Solo mal indentado",
        "Credenciales accidentalmente commiteadas",
        "F1 de RAG",
        "Latencia p99",
      ],
      correctIndex: 1,
      explanation: "No secrets in git.",
    },
    {
      concept: "sbom-provenance-attest",
      question: "Un SBOM lista:",
      options: [
        "Salarios del equipo",
        "Componentes/deps del artefacto construido",
        "Solo el README",
        "Los prompts del LLM sin versión",
      ],
      correctIndex: 1,
      explanation: "Software Bill of Materials.",
    },
    {
      concept: "sbom-provenance-attest",
      question: "Provenance/attestation enlaza:",
      options: [
        "Un meme con el deploy",
        "Artefacto ↔ proceso de build y fuente verificables",
        "El color del badge",
        "Un exam score",
      ],
      correctIndex: 1,
      explanation: "Build provenance.",
    },
    {
      concept: "sbom-provenance-attest",
      question: "Firmar releases ayuda a:",
      options: [
        "Que cualquiera reemplace el binario sin detección",
        "Verificar integridad y origen del artefacto",
        "Evitar versionado semver",
        "Ocultar CVEs",
      ],
      correctIndex: 1,
      explanation: "Signed artifacts.",
    },
    {
      concept: "envs-approvals",
      question: "Environments con required reviewers protegen:",
      options: [
        "Branches de docs solo",
        "Deploys a staging/prod con control humano",
        "El linter local",
        "El orden de imports",
      ],
      correctIndex: 1,
      explanation: "Protected deploy envs.",
    },
    {
      concept: "envs-approvals",
      question: "Separar secrets por environment evita:",
      options: [
        "Usar el secret de prod en PRs de forks sin control",
        "Tener staging",
        "OIDC",
        "Matrix builds",
      ],
      correctIndex: 1,
      explanation: "Env-scoped secrets.",
    },
    {
      concept: "envs-approvals",
      question: "Un deploy a prod sin approval cuando la política lo exige es:",
      options: [
        "Buena práctica de continuous recklessness",
        "Violación del control de cambios",
        "Un quality attribute de UX",
        "Requerido por DDD",
      ],
      correctIndex: 1,
      explanation: "Change control.",
    },
    {
      concept: "migrations-canary-rollback",
      question: "Canary release reduce riesgo porque:",
      options: [
        "Despliega 100% de una vez siempre",
        "Expone el cambio a un subconjunto y observa señales",
        "Elimina métricas",
        "Ignora rollback",
      ],
      correctIndex: 1,
      explanation: "Canary = exposición gradual.",
    },
    {
      concept: "migrations-canary-rollback",
      question: "Migraciones expand/contract permiten:",
      options: [
        "Breaking schema en un solo paso sin compat",
        "Desplegar app y schema de forma compatible en fases",
        "Borrar columnas usadas el mismo segundo sin plan",
        "Saltar backups",
      ],
      correctIndex: 1,
      explanation: "Expand/contract migrations.",
    },
    {
      concept: "migrations-canary-rollback",
      question: "Un plan de rollback debe estar:",
      options: [
        "Solo en la cabeza del oncall",
        "Documentado y ensayable (artefacto/versión previa)",
        "Prohibido por política “forward-only” sin mitigación",
        "En un PDF sin owner",
      ],
      correctIndex: 1,
      explanation: "Rollback readiness.",
    },
    {
      concept: "branch-review-release-notes",
      question: "Code review en PRs aporta:",
      options: [
        "Solo demora sin valor",
        "Segunda mirada a seguridad, diseño y regresiones",
        "Reemplazo total de tests",
        "Autorización de fraude",
      ],
      correctIndex: 1,
      explanation: "Human review gate.",
    },
    {
      concept: "branch-review-release-notes",
      question: "Release notes deben:",
      options: [
        "Omitir breaking changes",
        "Comunicar cambios user-facing y migraciones relevantes",
        "Incluir secrets de prod",
        "Ser vacías siempre",
      ],
      correctIndex: 1,
      explanation: "Communicate changes.",
    },
    {
      concept: "branch-review-release-notes",
      question: "Proteger main con required checks evita:",
      options: [
        "Merges verdes",
        "Merge directo sin CI/revisión cuando la política lo prohíbe",
        "Tags semver",
        "Changelogs",
      ],
      correctIndex: 1,
      explanation: "Branch protection.",
    },
    {
      concept: "failure-handling-audit-evidence",
      question: "Si un job de deploy falla a mitad:",
      options: [
        "Asumir éxito parcial silencioso",
        "Marcar fallo, alertar y dejar evidencia en logs/artifacts",
        "Borrar auditoría",
        "Forzar match de entidades",
      ],
      correctIndex: 1,
      explanation: "Fail visibly + evidence.",
    },
    {
      concept: "failure-handling-audit-evidence",
      question: "Evidencia de auditoría de release incluye:",
      options: [
        "Memes del canal",
        "Quién aprobó, qué commit/artefacto, cuándo, resultado",
        "PII de clientes en el log de debug",
        "Passwords en claro",
      ],
      correctIndex: 1,
      explanation: "Audit of changes.",
    },
    {
      concept: "failure-handling-audit-evidence",
      question: "Reintentos automáticos de deploy deben ser:",
      options: [
        "Infinitos sin backoff",
        "Acotados, idempotentes y observables",
        "Sin logs",
        "Con secrets en la URL",
      ],
      correctIndex: 1,
      explanation: "Bounded idempotent retries.",
    },
  ],

  // === Section 45: Cloud, almacenamiento, colas e infraestructura (iac) ===
  'iac': [
    {
      concept: "object-relational-cache",
      question: "Object storage (S3-like) es ideal para:",
      options: [
        "Transacciones multi-fila ACID complejas como única DB",
        "Blobs/archivos con keys y lifecycle",
        "Locks de fila de baja latencia siempre",
        "Como único cache de sesión sub-ms sin diseño",
      ],
      correctIndex: 1,
      explanation: "Object store = blobs.",
    },
    {
      concept: "object-relational-cache",
      question: "DB relacional brilla cuando necesitas:",
      options: [
        "Solo videos de 100GB",
        "Consultas/transacciones estructuradas y joins",
        "CDN global de assets estáticos únicamente",
        "GPU training",
      ],
      correctIndex: 1,
      explanation: "Relational = structured transactions.",
    },
    {
      concept: "object-relational-cache",
      question: "Un cache no es source of truth porque:",
      options: [
        "Siempre es más durable que el disk de DB",
        "Puede eviccionar/perder datos; la verdad vive en el store primario",
        "No tiene latencia",
        "Reemplaza backups",
      ],
      correctIndex: 1,
      explanation: "Cache is ephemeral by design.",
    },
    {
      concept: "consistency-lifecycle-backups",
      question: "Lifecycle policies en object storage gestionan:",
      options: [
        "Roles IAM de humanos únicamente",
        "Transiciones/expiración de objetos (costo/retención)",
        "El schema de Postgres",
        "El event loop",
      ],
      correctIndex: 1,
      explanation: "Lifecycle = retention/cost.",
    },
    {
      concept: "consistency-lifecycle-backups",
      question: "Backups sin prueba de restore son:",
      options: [
        "Suficientes siempre",
        "Riesgosos: no validas RTO/RPO reales",
        "Mejores que backups probados",
        "Un substitute de authz",
      ],
      correctIndex: 1,
      explanation: "Test restores.",
    },
    {
      concept: "consistency-lifecycle-backups",
      question: "Consistencia eventual de un store implica:",
      options: [
        "Lecturas siempre lineales al instante en todas las réplicas",
        "Puede haber ventanas donde réplicas divergen temporalmente",
        "ACID completo gratis",
        "Que no hace falta versionado de objetos",
      ],
      correctIndex: 1,
      explanation: "Eventual consistency windows.",
    },
    {
      concept: "queue-event-delivery",
      question: "Una cola desacopla productores y consumidores para:",
      options: [
        "Aumentar coupling temporal",
        "Absorber picos y procesar async",
        "Eliminar schemas de mensaje",
        "Probar parentesco",
      ],
      correctIndex: 1,
      explanation: "Queues buffer & decouple.",
    },
    {
      concept: "queue-event-delivery",
      question: "At-least-once delivery implica que el consumidor debe:",
      options: [
        "Asumir exactamente una vez siempre",
        "Ser idempotente ante reentregas",
        "Ignorar duplicates sin diseño",
        "Usar solo UDP",
      ],
      correctIndex: 1,
      explanation: "Idempotent consumers.",
    },
    {
      concept: "queue-event-delivery",
      question: "Pub/sub de eventos de dominio habilita:",
      options: [
        "Un monólito sin boundaries",
        "Múltiples consumidores reaccionando al mismo hecho",
        "Transacciones distribuidas mágicas sin protocolo",
        "PII en claro por defecto",
      ],
      correctIndex: 1,
      explanation: "Fan-out de eventos.",
    },
    {
      concept: "dedup-ordering-dlq",
      question: "Una DLQ (dead letter queue) sirve para:",
      options: [
        "Mensajes felices únicamente",
        "Aislar mensajes que fallan reiteradamente para inspección",
        "Aumentar el throughput mágicamente",
        "Reemplazar métricas",
      ],
      correctIndex: 1,
      explanation: "DLQ = poison message handling.",
    },
    {
      concept: "dedup-ordering-dlq",
      question: "Deduplicación de mensajes se basa a menudo en:",
      options: [
        "La hora local del laptop",
        "Una clave de idempotencia / message id durable",
        "El color del payload",
        "Random.random() sin store",
      ],
      correctIndex: 1,
      explanation: "Idempotency keys.",
    },
    {
      concept: "dedup-ordering-dlq",
      question: "Ordenamiento global estricto en colas distribuidas:",
      options: [
        "Es gratis y sin trade-offs",
        "Tiene costo de throughput/complejidad; a veces basta orden por partición",
        "Se logra con print()",
        "Implica fraude",
      ],
      correctIndex: 1,
      explanation: "Ordering trade-offs.",
    },
    {
      concept: "compute-autoscale-net",
      question: "Autoscale de compute reacciona a:",
      options: [
        "El humor del equipo",
        "Métricas (CPU, cola depth, RPS) bajo políticas",
        "El número de ADRs",
        "El correctIndex del banco",
      ],
      correctIndex: 1,
      explanation: "Metric-driven scale.",
    },
    {
      concept: "compute-autoscale-net",
      question: "Red privada + egress controlado reduce:",
      options: [
        "La necesidad de IAM",
        "Exposición de data planes a Internet abierta",
        "La utilidad de TLS",
        "Healthchecks",
      ],
      correctIndex: 1,
      explanation: "Private networking.",
    },
    {
      concept: "compute-autoscale-net",
      question: "Cold starts en scale-to-zero afectan:",
      options: [
        "Solo el color del logo",
        "Latencia de las primeras requests al escalar desde 0",
        "La corrección de SQL siempre",
        "El semver del cliente",
      ],
      correctIndex: 1,
      explanation: "Cold start latency.",
    },
    {
      concept: "iam-private-egress",
      question: "IAM de least privilege otorga:",
      options: [
        "*:* en prod para comodidad",
        "Solo acciones y recursos necesarios por rol",
        "Root a todos los laptops",
        "Access keys en el frontend público",
      ],
      correctIndex: 1,
      explanation: "Least privilege IAM.",
    },
    {
      concept: "iam-private-egress",
      question: "Bloquear egress libre desde un worker de RPA mitiga:",
      options: [
        "Mejor UX de botones",
        "Exfiltración y SSRF hacia destinos no allowlisteados",
        "La necesidad de logs",
        "Idempotencia",
      ],
      correctIndex: 1,
      explanation: "Egress control.",
    },
    {
      concept: "iam-private-egress",
      question: "Roles temporales (OIDC) son preferibles a:",
      options: [
        "Access keys de larga vida en CI",
        "MFA de humanos",
        "Secret managers",
        "Network policies",
      ],
      correctIndex: 1,
      explanation: "Short-lived credentials.",
    },
    {
      concept: "declarative-config-envs",
      question: "IaC declarativo describe:",
      options: [
        "Clicks manuales irreproducibles",
        "Estado deseado versionado (red, compute, IAM)",
        "Solo scripts bash sin estado",
        "El roadmap del curso",
      ],
      correctIndex: 1,
      explanation: "Desired state as code.",
    },
    {
      concept: "declarative-config-envs",
      question: "Separar envs (dev/stage/prod) con workspaces/stacks evita:",
      options: [
        "Paridad razonable",
        "Que un apply de dev toque prod por accidente",
        "Tener secrets distintos",
        "Tags de costo",
      ],
      correctIndex: 1,
      explanation: "Env isolation.",
    },
    {
      concept: "declarative-config-envs",
      question: "Drift detection compara:",
      options: [
        "Solo precios de spot",
        "Estado real de cloud vs configuración declarada",
        "F1 de dos modelos",
        "Commits de docs",
      ],
      correctIndex: 1,
      explanation: "Detect config drift.",
    },
    {
      concept: "cost-quotas-recovery-portability",
      question: "Quotas y budgets alertan sobre:",
      options: [
        "Typos de markdown",
        "Gasto/consumo fuera de umbral",
        "El orden de imports",
        "Parentescos",
      ],
      correctIndex: 1,
      explanation: "Cost controls.",
    },
    {
      concept: "cost-quotas-recovery-portability",
      question: "Portabilidad multi-cloud total sin costo es:",
      options: [
        "Siempre trivial",
        "Un trade-off: abstracciones vs servicios managed nativos",
        "Gratis con un if cloud==",
        "Innecesaria de documentar",
      ],
      correctIndex: 1,
      explanation: "Portability has cost.",
    },
    {
      concept: "cost-quotas-recovery-portability",
      question: "Un runbook de recovery debe incluir:",
      options: [
        "Solo “reinicia todo”",
        "RTO/RPO, pasos, owners y validación post-restore",
        "PII de clientes de ejemplo real",
        "Contraseñas en el wiki público",
      ],
      correctIndex: 1,
      explanation: "Operable recovery.",
    },
  ],

  // === Section 46: Ingeniería de datos y orquestación de producción (gpu-computing) ===
  'gpu-computing': [
    {
      concept: "windows-event-time-watermarks",
      question: "Event time vs processing time: event time es:",
      options: [
        "Cuando el worker lo vio",
        "El timestamp del hecho en el origen",
        "La hora del deploy",
        "El wall clock del laptop del analista siempre",
      ],
      correctIndex: 1,
      explanation: "Event time = when it happened.",
    },
    {
      concept: "windows-event-time-watermarks",
      question: "Un watermark estima:",
      options: [
        "El salario del oncall",
        "Hasta qué event time el stream está “completo” para cerrar ventanas",
        "El tamaño del batch de GPU",
        "El color del dashboard",
      ],
      correctIndex: 1,
      explanation: "Watermarks cierran ventanas de event time.",
    },
    {
      concept: "windows-event-time-watermarks",
      question: "Una ventana tumbling de 5 min agrupa:",
      options: [
        "Eventos en intervalos fijos no solapados",
        "Siempre todo el histórico",
        "Solo late data",
        "Solo control messages",
      ],
      correctIndex: 1,
      explanation: "Tumbling = fixed non-overlap.",
    },
    {
      concept: "late-data-exactly-once",
      question: "Late data es un evento que:",
      options: [
        "Llega antes del watermark siempre",
        "Llega después de que el watermark pasó su event time",
        "No tiene payload",
        "Es un secret",
      ],
      correctIndex: 1,
      explanation: "Late = after watermark.",
    },
    {
      concept: "late-data-exactly-once",
      question: "Exactly-once end-to-end requiere:",
      options: [
        "Solo at-most-once en todos lados",
        "Semántica de dedup/transacciones en boundaries del pipeline",
        "print() sin offsets",
        "Ignorar reintentos",
      ],
      correctIndex: 1,
      explanation: "EOS is end-to-end design.",
    },
    {
      concept: "late-data-exactly-once",
      question: "Allowed lateness amplía:",
      options: [
        "El SLA de marketing",
        "La tolerancia a eventos tardíos antes de dropear/side output",
        "El learning rate",
        "El tamaño del cluster de forma mágica",
      ],
      correctIndex: 1,
      explanation: "Lateness policies.",
    },
    {
      concept: "dag-assets-dependency",
      question: "Un DAG de orquestación modela:",
      options: [
        "Ciclos de dependencias preferidos",
        "Tareas/assets y aristas de dependencia acíclicas",
        "Solo cron sin grafo",
        "UI pixels",
      ],
      correctIndex: 1,
      explanation: "DAG = acyclic deps.",
    },
    {
      concept: "dag-assets-dependency",
      question: "Definir assets (tablas/particiones) como nodos ayuda a:",
      options: [
        "Ocultar lineage",
        "Razonar frescura y dependencias de datos, no solo scripts",
        "Evitar schedules",
        "Saltar contratos",
      ],
      correctIndex: 1,
      explanation: "Asset-oriented orchestration.",
    },
    {
      concept: "dag-assets-dependency",
      question: "Una dependencia incorrecta en el DAG puede causar:",
      options: [
        "Solo mejor throughput",
        "Leer inputs incompletos o corridas en orden erróneo",
        "Autofix de schema",
        "Prueba de colusión",
      ],
      correctIndex: 1,
      explanation: "Wrong edges → wrong data timing.",
    },
    {
      concept: "schedules-backfills-state",
      question: "Un backfill reprocesa:",
      options: [
        "Solo el futuro",
        "Rangos históricos con la lógica actual/versionada",
        "Únicamente el healthcheck",
        "Secrets",
      ],
      correctIndex: 1,
      explanation: "Backfills = historical recompute.",
    },
    {
      concept: "schedules-backfills-state",
      question: "Estado de checkpoints del orquestador permite:",
      options: [
        "Perder progreso en cada retry siempre",
        "Retomar sin recomputar todo lo exitoso",
        "Evitar idempotencia",
        "Ignorar fallos",
      ],
      correctIndex: 1,
      explanation: "Stateful orchestration.",
    },
    {
      concept: "schedules-backfills-state",
      question: "Schedules y sensors se combinan para:",
      options: [
        "Correr solo una vez en la historia",
        "Tiempo + espera de condiciones de datos/eventos",
        "Eliminar SLAs",
        "Hardcodear PII",
      ],
      correctIndex: 1,
      explanation: "Time + data triggers.",
    },
    {
      concept: "contracts-freshness",
      question: "Un data contract define:",
      options: [
        "Solo el color del BI tool",
        "Schema, semántica, owners y expectativas de calidad/frescura",
        "El motor de GPU",
        "La playlist del equipo",
      ],
      correctIndex: 1,
      explanation: "Contracts = expectations.",
    },
    {
      concept: "contracts-freshness",
      question: "Freshness SLO de una tabla dice:",
      options: [
        "Cuántos JOINs tiene",
        "Qué tan reciente debe estar el dato servido",
        "El encoding del CSV",
        "El número de PRs",
      ],
      correctIndex: 1,
      explanation: "Freshness = staleness bound.",
    },
    {
      concept: "contracts-freshness",
      question: "Romper un contract en CI de datos debería:",
      options: [
        "Pasar silencioso a prod",
        "Fallar el pipeline o marcar incidente de datos según política",
        "Borrar el schema registry",
        "Inferir parentesco",
      ],
      correctIndex: 1,
      explanation: "Contract violations are signals.",
    },
    {
      concept: "lineage-obs-ownership",
      question: "Lineage responde:",
      options: [
        "¿Quién ganó el mundial?”",
        "¿De dónde viene este campo/tabla y a quién impacta?”",
        "¿Cuál es el theme color?”",
        "¿Qué GPU usamos?”",
      ],
      correctIndex: 1,
      explanation: "Lineage = origin & impact.",
    },
    {
      concept: "lineage-obs-ownership",
      question: "Ownership de un dataset implica:",
      options: [
        "Nadie oncall",
        "Responsable de calidad, acceso y evolución del asset",
        "Solo el nombre en un CSV",
        "Compartir root keys",
      ],
      correctIndex: 1,
      explanation: "Clear data owners.",
    },
    {
      concept: "lineage-obs-ownership",
      question: "Observabilidad de pipelines incluye:",
      options: [
        "Solo el logo",
        "Duración, filas, fallos, frescura y costo",
        "Únicamente el linter de SQL",
        "El exam bank",
      ],
      correctIndex: 1,
      explanation: "Pipeline metrics.",
    },
    {
      concept: "partitions-incremental",
      question: "Procesamiento incremental busca:",
      options: [
        "Releer todo el histórico cada hora siempre",
        "Procesar solo lo nuevo/cambiado según watermark/partición",
        "Borrar particiones al azar",
        "Evitar ids monotónicos útiles",
      ],
      correctIndex: 1,
      explanation: "Incremental = delta work.",
    },
    {
      concept: "partitions-incremental",
      question: "Particionar por fecha facilita:",
      options: [
        "Producto cartesiano global",
        "Poda de lecturas y backfills acotados",
        "Un solo archivo eterno",
        "Ocultar late data siempre",
      ],
      correctIndex: 1,
      explanation: "Time partitions help prune.",
    },
    {
      concept: "partitions-incremental",
      question: "Sin clave de incremento confiable, el riesgo es:",
      options: [
        "Mejor exact once gratis",
        "Duplicar u omitir filas en el delta",
        "Schemas más claros",
        "Menos necesidad de tests",
      ],
      correctIndex: 1,
      explanation: "Incremental needs reliable markers.",
    },
    {
      concept: "slo-incidents-data-recovery",
      question: "Un incidente de datos se maneja con:",
      options: [
        "Silencio y hope",
        "Severidad, comunicación, mitigación y postmortem",
        "Solo un meme",
        "Borrar métricas",
      ],
      correctIndex: 1,
      explanation: "Incident process.",
    },
    {
      concept: "slo-incidents-data-recovery",
      question: "Recovery de una partición corrupta puede requerir:",
      options: [
        "Ignorar el contract",
        "Reproceso desde lineage/backup con validación",
        "Cambiar el logo",
        "Desactivar authz",
      ],
      correctIndex: 1,
      explanation: "Data recovery playbooks.",
    },
    {
      concept: "slo-incidents-data-recovery",
      question: "Error budget en un SLO de frescura permite:",
      options: [
        "Incumplir siempre sin acción",
        "Cuantificar riesgo aceptable y priorizar cuando se agota",
        "Eliminar alertas",
        "Probar fraude",
      ],
      correctIndex: 1,
      explanation: "Error budgets drive prioritization.",
    },
  ],

  // === Section 47: MLOps: experimentos, registro y serving (opensource) ===
  'opensource': [
    {
      concept: "tracking-reproducibility",
      question: "Experiment tracking registra:",
      options: [
        "Solo el nombre del café",
        "Params, métricas, código/data refs y artifacts del run",
        "PII de usuarios finales por defecto",
        "El wallpaper del IDE",
      ],
      correctIndex: 1,
      explanation: "Track runs for reproducibility.",
    },
    {
      concept: "tracking-reproducibility",
      question: "Reproducir un run requiere al menos:",
      options: [
        "Solo la métrica final",
        "Código, datos/versión, env y semillas documentadas",
        "Un screenshot del loss",
        "El mismo laptop físico únicamente",
      ],
      correctIndex: 1,
      explanation: "Code+data+env+seeds.",
    },
    {
      concept: "tracking-reproducibility",
      question: "Sin tracking, comparar dos modelos es:",
      options: [
        "Trivial y auditable",
        "Frágil: se pierden hiperparámetros y contexto",
        "Mejor para compliance",
        "Innecesario en prod",
      ],
      correctIndex: 1,
      explanation: "Tracking reduces folklore.",
    },
    {
      concept: "data-code-env-lineage-compare",
      question: "Comparar runs en un UI de tracking permite:",
      options: [
        "Fusionar PRs",
        "Diff de métricas/params entre experimentos",
        "Rotar IAM keys",
        "Generar facturas",
      ],
      correctIndex: 1,
      explanation: "Run comparison.",
    },
    {
      concept: "data-code-env-lineage-compare",
      question: "Lineage de un modelo incluye:",
      options: [
        "Solo el accuracy",
        "Dataset/versión, código y posiblemente features usadas",
        "El color del plot",
        "El salario del reviewer",
      ],
      correctIndex: 1,
      explanation: "Model lineage.",
    },
    {
      concept: "data-code-env-lineage-compare",
      question: "Congelar el environment (lock/container) reduce:",
      options: [
        "La necesidad de métricas",
        "“Works on my machine” entre train y serve",
        "La utilidad de seeds",
        "Artifacts",
      ],
      correctIndex: 1,
      explanation: "Env parity.",
    },
    {
      concept: "signatures-stages-approvals",
      question: "Model stages (Staging/Production) en un registry:",
      options: [
        "Son solo labels cosméticos sin proceso",
        "Marcan readiness y gates de promoción",
        "Entrenan el modelo",
        "Reemplazan evals",
      ],
      correctIndex: 1,
      explanation: "Stage gates.",
    },
    {
      concept: "signatures-stages-approvals",
      question: "Firmar un artifact de modelo ayuda a:",
      options: [
        "Que cualquiera lo reemplace sin detección",
        "Verificar integridad antes de servir",
        "Subir el learning rate",
        "Omitir card del modelo",
      ],
      correctIndex: 1,
      explanation: "Signed model artifacts.",
    },
    {
      concept: "signatures-stages-approvals",
      question: "Approval humano antes de Production es útil cuando:",
      options: [
        "Nunca hay riesgo",
        "Hay impacto regulatorio o de usuarios y se exige control de cambios",
        "Solo hay un print script local",
        "El dataset es de 3 filas de juguete y no se desplegará",
      ],
      correctIndex: 1,
      explanation: "Human gate for prod models.",
    },
    {
      concept: "artifacts-card-compat",
      question: "Una model card documenta:",
      options: [
        "Solo el checksum",
        "Uso previsto, datos, métricas, limitaciones y riesgos",
        "La contraseña del registry",
        "El theme de Streamlit",
      ],
      correctIndex: 1,
      explanation: "Model cards = transparency.",
    },
    {
      concept: "artifacts-card-compat",
      question: "Compatibilidad de artifact (versión de schema de input) evita:",
      options: [
        "Versionar",
        "Romper clientes de scoring al cambiar features",
        "Tener signatures",
        "Batching",
      ],
      correctIndex: 1,
      explanation: "Input schema compat.",
    },
    {
      concept: "artifacts-card-compat",
      question: "Guardar métricas de holdout con el artifact permite:",
      options: [
        "Mentir sobre calidad",
        "Auditar el desempeño declarado del modelo promovido",
        "Evitar tests de regresión",
        "Saltar stages",
      ],
      correctIndex: 1,
      explanation: "Metrics travel with model.",
    },
    {
      concept: "batch-online-feature-consistency",
      question: "Training/serving skew ocurre cuando:",
      options: [
        "Las features en train y serve se calculan igual",
        "La lógica de features difiere entre train y prod",
        "Hay un solo path de features",
        "No hay modelo",
      ],
      correctIndex: 1,
      explanation: "Skew = inconsistent features.",
    },
    {
      concept: "batch-online-feature-consistency",
      question: "Un feature store busca:",
      options: [
        "Duplicar definiciones en cada servicio",
        "Compartir definiciones/valores consistentes de features",
        "Eliminar labels",
        "Reemplazar evals",
      ],
      correctIndex: 1,
      explanation: "Feature consistency.",
    },
    {
      concept: "batch-online-feature-consistency",
      question: "Batch scoring vs online: online prioriza:",
      options: [
        "Reprocesar terabytes diarios siempre",
        "Baja latencia por request con SLA",
        "Solo CSV nocturno",
        "Ignorar timeouts",
      ],
      correctIndex: 1,
      explanation: "Online = latency-sensitive.",
    },
    {
      concept: "latency-batching-fallback",
      question: "Batching de inferencia mejora throughput a cambio de:",
      options: [
        "Siempre menor latencia individual",
        "Posible mayor latencia por request al esperar el batch",
        "Eliminar GPUs",
        "Authz",
      ],
      correctIndex: 1,
      explanation: "Batching trade-off.",
    },
    {
      concept: "latency-batching-fallback",
      question: "Un fallback (modelo previo/regla) se activa cuando:",
      options: [
        "Todo va bien",
        "El modelo primario falla/timeout o viola SLO",
        "Hay un deploy exitoso",
        "El registry está vacío a propósito",
      ],
      correctIndex: 1,
      explanation: "Graceful degradation.",
    },
    {
      concept: "latency-batching-fallback",
      question: "p99 de latencia de scoring es crítico porque:",
      options: [
        "Solo importa el promedio siempre",
        "Captura la cola mala que impacta UX/SLA",
        "Reemplaza exactitud",
        "Mide parentesco",
      ],
      correctIndex: 1,
      explanation: "Tail latency matters.",
    },
    {
      concept: "shadow-canary-monitoring",
      question: "Shadow deploy de un modelo:",
      options: [
        "Sirve 100% tráfico de usuario final de inmediato",
        "Ejecuta en paralelo sin afectar respuestas al usuario",
        "Borra el modelo anterior",
        "Desactiva logs",
      ],
      correctIndex: 1,
      explanation: "Shadow = no user impact.",
    },
    {
      concept: "shadow-canary-monitoring",
      question: "Canary de modelos observa:",
      options: [
        "Solo el nombre del archivo",
        "Métricas de negocio/tech en un % de tráfico real",
        "Únicamente el linter",
        "El wallpaper",
      ],
      correctIndex: 1,
      explanation: "Canary metrics on real traffic.",
    },
    {
      concept: "shadow-canary-monitoring",
      question: "Data drift monitoring alerta cuando:",
      options: [
        "El schema es idéntico y la distribución estable",
        "La distribución de inputs/outputs cambia respecto a baseline",
        "Hay un commit de docs",
        "El sol sale",
      ],
      correctIndex: 1,
      explanation: "Drift detection.",
    },
    {
      concept: "rollback-retire-audit",
      question: "Rollback de modelo en prod significa:",
      options: [
        "Entrenar desde cero siempre",
        "Volver a una versión previa conocida buena",
        "Borrar el registry",
        "Ignorar el incident",
      ],
      correctIndex: 1,
      explanation: "Rollback to last good.",
    },
    {
      concept: "rollback-retire-audit",
      question: "Retirar un modelo incluye:",
      options: [
        "Dejar endpoints huérfanos",
        "Despublicar, revocar tráfico y archivar con auditoría",
        "Solo renombrar el archivo local",
        "Compartir pesos con PII embebida",
      ],
      correctIndex: 1,
      explanation: "Controlled retirement.",
    },
    {
      concept: "rollback-retire-audit",
      question: "Auditoría de promoción de modelo registra:",
      options: [
        "El clima",
        "Quién promovió qué versión con qué métricas/aprobaciones",
        "El color del badge",
        "Keys de API en claro",
      ],
      correctIndex: 1,
      explanation: "Promotion audit trail.",
    },
  ],

  // === Section 48: LLM applications y RAG con evidencia (ai-governance) ===
  'ai-governance': [
    {
      concept: "embeddings-similarity",
      question: "Un embedding representa texto como:",
      options: [
        "Un entero de status HTTP",
        "Un vector denso para similitud semántica",
        "Un archivo PDF",
        "Un rol IAM",
      ],
      correctIndex: 1,
      explanation: "Embeddings = dense vectors.",
    },
    {
      concept: "embeddings-similarity",
      question: "Similitud coseno alta entre dos vectores sugiere:",
      options: [
        "Que son ortogonales",
        "Direcciones similares en el espacio (texto parecido semánticamente, según el modelo)",
        "Que uno es PII",
        "Que hay fraude",
      ],
      correctIndex: 1,
      explanation: "Cosine ~ directional similarity.",
    },
    {
      concept: "embeddings-similarity",
      question: "Cambiar el modelo de embeddings sin reindexar puede:",
      options: [
        "Mejorar recall mágicamente siempre",
        "Romper comparabilidad de vectores del índice viejo",
        "No afectar nada nunca",
        "Firmar el índice",
      ],
      correctIndex: 1,
      explanation: "Embedding model version binds the index.",
    },
    {
      concept: "limits-versions-eval",
      question: "Versionar el índice y el modelo de embed permite:",
      options: [
        "Mezclar espacios vectoriales distintos sin control",
        "Evaluar y rollback de retrieval de forma controlada",
        "Evitar métricas",
        "Omitir chunking",
      ],
      correctIndex: 1,
      explanation: "Versioned retrieval stack.",
    },
    {
      concept: "limits-versions-eval",
      question: "Límites de tokens/contexto obligan a:",
      options: [
        "Pegar todo el corpus en el prompt",
        "Seleccionar/presupuestar contexto (top-k, compresión)",
        "Desactivar el LLM",
        "Usar solo CPU flags",
      ],
      correctIndex: 1,
      explanation: "Context budget.",
    },
    {
      concept: "limits-versions-eval",
      question: "Evals de retrieval miden típicamente:",
      options: [
        "Solo el color del chat",
        "Recall@k, MRR, nDCG u otras métricas de ranking",
        "El salario del labeler",
        "La velocidad del mouse",
      ],
      correctIndex: 1,
      explanation: "Retrieval metrics.",
    },
    {
      concept: "chunking-metadata-dedup",
      question: "Chunking parte documentos para:",
      options: [
        "Eliminar metadata",
        "Unidades recuperables del tamaño adecuado al modelo",
        "Entrenar GPU kernels",
        "Ocultar citas",
      ],
      correctIndex: 1,
      explanation: "Chunks = retrieval units.",
    },
    {
      concept: "chunking-metadata-dedup",
      question: "Metadata (fuente, fecha, ACL) en chunks habilita:",
      options: [
        "Solo prettier logs",
        "Filtros, citas y control de acceso en retrieval",
        "Mayor hallucinación garantizada",
        "Ignorar dedup",
      ],
      correctIndex: 1,
      explanation: "Metadata powers filters/cites/ACL.",
    },
    {
      concept: "chunking-metadata-dedup",
      question: "Deduplicar chunks cercanos reduce:",
      options: [
        "Diversidad inútil de near-duplicates en el contexto",
        "La necesidad de embeddings",
        "El schema",
        "Los evals",
      ],
      correctIndex: 1,
      explanation: "Dedup improves context quality.",
    },
    {
      concept: "acl-deletion-provenance",
      question: "ACL en el índice significa:",
      options: [
        "Cualquiera recupera todo",
        "Solo se recuperan chunks permitidos al principal",
        "Se borran métricas",
        "Se desactiva authn",
      ],
      correctIndex: 1,
      explanation: "Retrieval must honor ACL.",
    },
    {
      concept: "acl-deletion-provenance",
      question: "Borrado de un documento en RAG debe:",
      options: [
        "Dejar vectores huérfanos para siempre",
        "Propagarse al store/índice según política de retención",
        "Solo ocultar el título en UI",
        "Implicar parentesco",
      ],
      correctIndex: 1,
      explanation: "Delete cascades to index.",
    },
    {
      concept: "acl-deletion-provenance",
      question: "Provenance de un chunk responde:",
      options: [
        "¿Qué canción suena?”",
        "¿De qué documento/versión/página proviene?”",
        "¿Cuál es el temperature?”",
        "¿Quién es el CEO?”",
      ],
      correctIndex: 1,
      explanation: "Provenance for cites/audit.",
    },
    {
      concept: "lexical-vector-hybrid-rerank",
      question: "Búsqueda léxica (BM25) captura bien:",
      options: [
        "Solo parafrasis lejanas",
        "Términos exactos/raros y keywords",
        "Únicamente imágenes",
        "Roles IAM",
      ],
      correctIndex: 1,
      explanation: "Lexical = term matching.",
    },
    {
      concept: "lexical-vector-hybrid-rerank",
      question: "Hybrid retrieval combina:",
      options: [
        "Solo un método al azar",
        "Señales léxicas y vectoriales (y a menudo rerank)",
        "Únicamente keywords del título",
        "GPU training",
      ],
      correctIndex: 1,
      explanation: "Hybrid = best of both.",
    },
    {
      concept: "lexical-vector-hybrid-rerank",
      question: "Un reranker reordena:",
      options: [
        "Los salarios",
        "Candidatos top-n con un modelo más costoso/preciso",
        "El Dockerfile",
        "Las particiones de Kafka",
      ],
      correctIndex: 1,
      explanation: "Rerank refines candidates.",
    },
    {
      concept: "context-cites-permissions",
      question: "Citar fuentes en la respuesta RAG mejora:",
      options: [
        "La opacidad",
        "Verificabilidad y confianza del usuario",
        "El robo de contexto",
        "La alucinación incentivada",
      ],
      correctIndex: 1,
      explanation: "Citations aid trust.",
    },
    {
      concept: "context-cites-permissions",
      question: "Inyectar en el prompt un chunk sin permiso del usuario es:",
      options: [
        "Buena UX",
        "Fallo de autorización en la capa de retrieval",
        "Irrelevante para seguridad",
        "Un quality attribute de color",
      ],
      correctIndex: 1,
      explanation: "Authz applies to context.",
    },
    {
      concept: "context-cites-permissions",
      question: "Presupuestar citas y contexto evita:",
      options: [
        "Respuestas vacías siempre",
        "Overflow de tokens y ruido irrelevante",
        "La necesidad de evals",
        "Metadata",
      ],
      correctIndex: 1,
      explanation: "Budgeted context.",
    },
    {
      concept: "structured-grounding",
      question: "Grounding estructurado fuerza al modelo a:",
      options: [
        "Inventar números sin base",
        "Apoyarse en campos/hechos recuperados o herramientas",
        "Ignorar el schema",
        "Saltar validación",
      ],
      correctIndex: 1,
      explanation: "Ground answers in evidence.",
    },
    {
      concept: "structured-grounding",
      question: "Pedir JSON con schema para extracción reduce:",
      options: [
        "La utilidad de parsers",
        "Salidas libres difíciles de validar en pipelines",
        "La necesidad de retries bien diseñados",
        "Los logs",
      ],
      correctIndex: 1,
      explanation: "Structured outputs.",
    },
    {
      concept: "structured-grounding",
      question: "Si la evidencia no soporta el claim, el sistema debería:",
      options: [
        "Afirmar igual con confianza alta",
        "Abstenerse o marcar incertidumbre según política",
        "Borrar el índice",
        "Cambiar el embedding model en silencio",
      ],
      correctIndex: 1,
      explanation: "Abstain when ungrounded.",
    },
    {
      concept: "retrieval-answer-eval-cost-abstain",
      question: "Evaluar answer quality además de retrieval es necesario porque:",
      options: [
        "El retrieval perfecto garantiza respuesta perfecta siempre",
        "El LLM puede malusar buen contexto o alucinar",
        "No hay métricas de respuesta",
        "El costo es cero",
      ],
      correctIndex: 1,
      explanation: "End-to-end answer evals.",
    },
    {
      concept: "retrieval-answer-eval-cost-abstain",
      question: "Costo por respuesta en RAG se controla con:",
      options: [
        "Top-k infinito y modelos gigantes siempre",
        "Límites de k, modelos, cache y abstención",
        "Logs de PII",
        "Desactivar métricas",
      ],
      correctIndex: 1,
      explanation: "Cost knobs.",
    },
    {
      concept: "retrieval-answer-eval-cost-abstain",
      question: "Política de abstención bien calibrada reduce:",
      options: [
        "Solo el recall de marketing",
        "Respuestas incorrectas de alto riesgo cuando la evidencia es débil",
        "La necesidad de permisos",
        "El versionado",
      ],
      correctIndex: 1,
      explanation: "Abstain under uncertainty.",
    },
  ],

  // === Section 49: Agentes, herramientas y context engineering (data-contracts) ===
  'data-contracts': [
    {
      concept: "workflow-vs-agent",
      question: "Un workflow fijo es preferible cuando:",
      options: [
        "La tarea es abierta y no especifiable",
        "Los pasos son conocidos, testables y deben ser deterministas",
        "Nunca hay herramientas",
        "Quieres máxima aleatoriedad",
      ],
      correctIndex: 1,
      explanation: "Prefer workflows for known procedures.",
    },
    {
      concept: "workflow-vs-agent",
      question: "Un agente con planificación se justifica cuando:",
      options: [
        "El grafo de pasos es corto y fijo",
        "Hay incertidumbre y composición dinámica de herramientas bajo políticas",
        "Solo hay un if/else",
        "No hay presupuesto de tokens",
      ],
      correctIndex: 1,
      explanation: "Agents for open-ended tool use.",
    },
    {
      concept: "workflow-vs-agent",
      question: "Reemplazar un workflow estable por un agente “porque es cool” arriesga:",
      options: [
        "Más determinismo gratis",
        "Costo, no-determinismo y superficie de fallo mayor sin ganancia clara",
        "Mejores unit tests automáticos siempre",
        "Menos necesidad de evals",
      ],
      correctIndex: 1,
      explanation: "Agents have cost; use deliberately.",
    },
    {
      concept: "routing-planner-evaluator",
      question: "Un router de intenciones decide:",
      options: [
        "El color del theme",
        "Qué skill/flujo invocar según la petición",
        "El learning rate",
        "La VPC",
      ],
      correctIndex: 1,
      explanation: "Routing selects path.",
    },
    {
      concept: "routing-planner-evaluator",
      question: "Planner + executor separa:",
      options: [
        "UI y CSS solo",
        "Decidir plan vs ejecutar pasos/herramientas",
        "Authn y authz de forma incorrecta a propósito",
        "Train y serve de embeddings",
      ],
      correctIndex: 1,
      explanation: "Plan vs act split.",
    },
    {
      concept: "routing-planner-evaluator",
      question: "Un evaluator/crítico revisa:",
      options: [
        "Solo el DNS",
        "Calidad/seguridad de la salida antes de entregarla",
        "El semver del kernel",
        "La factura de la nube sin datos",
      ],
      correctIndex: 1,
      explanation: "Evaluator gate.",
    },
    {
      concept: "single-responsibility-fns",
      question: "Herramientas de agente con una responsabilidad clara:",
      options: [
        "Hacen de todo: SQL, email y deploy",
        "Son fáciles de testear, autorizar y componer",
        "No necesitan schema",
        "Deben mutar globals ocultos",
      ],
      correctIndex: 1,
      explanation: "SRP for tools.",
    },
    {
      concept: "single-responsibility-fns",
      question: "Una tool “god” que mezcla 10 side effects complica:",
      options: [
        "Solo el nombre",
        "Authz fina, tests y recuperación ante fallos parciales",
        "El markdown del README",
        "El icono",
      ],
      correctIndex: 1,
      explanation: "Fat tools hurt control.",
    },
    {
      concept: "single-responsibility-fns",
      question: "Nombrar tools por verbo+recurso (get_case, file_ticket) ayuda a:",
      options: [
        "Confundir al planner",
        "Políticas y logs auditable por acción",
        "Ocultar side effects",
        "Evitar JSON schema",
      ],
      correctIndex: 1,
      explanation: "Clear tool names.",
    },
    {
      concept: "schema-perms-idempotency-errors",
      question: "JSON Schema de argumentos de tool permite:",
      options: [
        "Que el modelo invente cualquier kwargs sin check",
        "Validar y rechazar llamadas mal formadas",
        "Saltar permisos",
        "Entrenar LoRA",
      ],
      correctIndex: 1,
      explanation: "Schema-validate tool args.",
    },
    {
      concept: "schema-perms-idempotency-errors",
      question: "Cada tool debe declarar permisos porque:",
      options: [
        "Todas las tools son read-only siempre",
        "El runtime aplica least privilege por acción",
        "El LLM ya es confiable al 100%",
        "No hay side effects en el mundo real",
      ],
      correctIndex: 1,
      explanation: "Per-tool authz.",
    },
    {
      concept: "schema-perms-idempotency-errors",
      question: "Tools con side effects deben ser:",
      options: [
        "No idempotentes a propósito",
        "Idempotentes o con claves de deduplicación ante retries del agente",
        "Sin manejo de errores",
        "Sin logs",
      ],
      correctIndex: 1,
      explanation: "Idempotent side effects.",
    },
    {
      concept: "min-context-jit-checkpoints",
      question: "Context engineering minimalista busca:",
      options: [
        "Pegar todo el monorepo en el prompt",
        "Solo la información necesaria just-in-time",
        "Duplicar secrets en el system prompt",
        "Ignorar ventanas de tokens",
      ],
      correctIndex: 1,
      explanation: "Minimal sufficient context.",
    },
    {
      concept: "min-context-jit-checkpoints",
      question: "Checkpoints de estado del agente permiten:",
      options: [
        "Perder el plan en cada retry",
        "Reanudar y auditar trayectoria",
        "Evitar presupuestos",
        "Desactivar human approval",
      ],
      correctIndex: 1,
      explanation: "Checkpointed agent state.",
    },
    {
      concept: "min-context-jit-checkpoints",
      question: "JIT retrieval de docs vs prompt estático enorme:",
      options: [
        "Siempre peor",
        "Reduce tokens y actualiza evidencia bajo demanda",
        "Impide citas",
        "Rompe tools",
      ],
      correctIndex: 1,
      explanation: "Just-in-time context.",
    },
    {
      concept: "memory-compaction-lkg",
      question: "Compaction de memoria resume:",
      options: [
        "Todo el historial sin pérdida nunca garantizada mágicamente",
        "Historial largo a un estado/resumen acotado con riesgo de pérdida controlado",
        "Solo los secrets",
        "El índice vectorial completo en una línea",
      ],
      correctIndex: 1,
      explanation: "Compaction trades detail for size.",
    },
    {
      concept: "memory-compaction-lkg",
      question: "Last-known-good (LKG) state se usa para:",
      options: [
        "Forzar el peor estado",
        "Recuperarse cuando la trayectoria actual se corrompe",
        "Borrar auditorías",
        "Subir privilegios",
      ],
      correctIndex: 1,
      explanation: "LKG recovery point.",
    },
    {
      concept: "memory-compaction-lkg",
      question: "Memoria de largo plazo debe respetar:",
      options: [
        "Ninguna política de retención",
        "ACL, propósito y minimización (datos sintéticos en demos)",
        "PII real sin base",
        "Escritura sin schema",
      ],
      correctIndex: 1,
      explanation: "Memory is still data governance.",
    },
    {
      concept: "stopping-budgets",
      question: "Un presupuesto de pasos/tokens detiene al agente cuando:",
      options: [
        "Quiere seguir explorando sin límite",
        "Alcanza límites de costo/latencia/seguridad definidos",
        "Encuentra la respuesta perfecta siempre al paso 1",
        "El usuario parpadea",
      ],
      correctIndex: 1,
      explanation: "Hard stop budgets.",
    },
    {
      concept: "stopping-budgets",
      question: "Sin criterio de parada, un agente puede:",
      options: [
        "Terminar siempre óptimo",
        "Loop de tools quemando costo",
        "Mejorar el test coverage solo",
        "Firmar releases",
      ],
      correctIndex: 1,
      explanation: "Unbounded loops are costly.",
    },
    {
      concept: "stopping-budgets",
      question: "Stop conditions deben ser:",
      options: [
        "Solo implícitas en la prosa del prompt",
        "Explícitas y enforceadas por el runtime",
        "Aleatorias",
        "Secretas para el auditor",
      ],
      correctIndex: 1,
      explanation: "Runtime-enforced stops.",
    },
    {
      concept: "sandbox-human-approval-recovery",
      question: "Ejecutar tools riesgosas en sandbox limita:",
      options: [
        "La utilidad de logs",
        "Daño a sistemas reales ante acciones erróneas del agente",
        "La necesidad de schemas",
        "Los presupuestos",
      ],
      correctIndex: 1,
      explanation: "Sandbox containment.",
    },
    {
      concept: "sandbox-human-approval-recovery",
      question: "Human approval (HITL) se inserta cuando:",
      options: [
        "La acción es irreversible o de alto impacto",
        "Se imprime un hello world",
        "El test unitario corre",
        "Se lee un archivo público de docs",
      ],
      correctIndex: 1,
      explanation: "HITL for high impact.",
    },
    {
      concept: "sandbox-human-approval-recovery",
      question: "Recovery ante tool failure debe:",
      options: [
        "Reintentar infinito sin backoff",
        "Clasificar error, reintentar con política o escalar/compensar",
        "Ignorar y afirmar éxito",
        "Borrar el checkpoint",
      ],
      correctIndex: 1,
      explanation: "Structured recovery.",
    },
  ],

  // === Section 50: Evals, red teaming y fiabilidad de IA (tech-leadership) ===
  'tech-leadership': [
    {
      concept: "task-dataset-rubric",
      question: "Un eval de tarea necesita:",
      options: [
        "Solo vibes del PM",
        "Definición de tarea, dataset y rúbrica de éxito",
        "Únicamente un screenshot",
        "PII real sin acuerdo",
      ],
      correctIndex: 1,
      explanation: "Task+data+rubric.",
    },
    {
      concept: "task-dataset-rubric",
      question: "La rúbrica debe ser:",
      options: [
        "Ambígua a propósito",
        "Lo bastante objetiva para gradear de forma consistente",
        "Secreta para el modelo y el humano",
        "Un meme",
      ],
      correctIndex: 1,
      explanation: "Operational rubrics.",
    },
    {
      concept: "task-dataset-rubric",
      question: "Dataset de eval representativo reduce:",
      options: [
        "Solo el tamaño del JSON",
        "Sesgo de “demo happy path” que no refleja prod",
        "La necesidad de versionar",
        "Los graders",
      ],
      correctIndex: 1,
      explanation: "Representative eval data.",
    },
    {
      concept: "outcome-process-trajectory-recovery",
      question: "Evaluar solo el outcome final puede ocultar:",
      options: [
        "Que el proceso fue seguro y eficiente",
        "Trayectorias peligrosas aunque el final “pase”",
        "La métrica de negocio",
        "El dataset",
      ],
      correctIndex: 1,
      explanation: "Process/trajectory evals matter.",
    },
    {
      concept: "outcome-process-trajectory-recovery",
      question: "Recovery evals miden:",
      options: [
        "Solo el primer intento perfecto",
        "Capacidad de corregir tras error/tool failure",
        "El color del chart",
        "El semver",
      ],
      correctIndex: 1,
      explanation: "Recovery under failure.",
    },
    {
      concept: "outcome-process-trajectory-recovery",
      question: "Traza de herramientas en el eval permite:",
      options: [
        "Ocultar side effects",
        "Auditar qué hizo el agente y por qué falló",
        "Evitar permisos",
        "Saltar rúbricas",
      ],
      correctIndex: 1,
      explanation: "Tool traces for diagnosis.",
    },
    {
      concept: "graders-det-human-llm",
      question: "Un grader determinista es ideal cuando:",
      options: [
        "La respuesta es libre y estética",
        "Hay oracle exacto (JSON, código, match de campos)",
        "Solo hay opinión subjetiva",
        "No hay dataset",
      ],
      correctIndex: 1,
      explanation: "Deterministic when oracle exists.",
    },
    {
      concept: "graders-det-human-llm",
      question: "LLM-as-judge requiere:",
      options: [
        "Cero calibración",
        "Rúbrica clara, controles de sesgo y a menudo muestreo humano",
        "Que reemplace toda métrica automática siempre",
        "Acceso root",
      ],
      correctIndex: 1,
      explanation: "Judges need calibration.",
    },
    {
      concept: "graders-det-human-llm",
      question: "Human grading se usa cuando:",
      options: [
        "Todo es exact match de string",
        "La calidad es sutil/normativa y no hay oracle barato confiable",
        "Quieres 1M labels en un minuto gratis",
        "El sistema no se desplegará nunca y no evalúas",
      ],
      correctIndex: 1,
      explanation: "Humans for nuanced quality.",
    },
    {
      concept: "calibration-order-bias-holdout",
      question: "Order bias en un judge aparece cuando:",
      options: [
        "El orden de candidatos no afecta scores",
        "La posición en el prompt sesga la preferencia",
        "Hay seed fija",
        "El holdout está vacío",
      ],
      correctIndex: 1,
      explanation: "Position/order bias.",
    },
    {
      concept: "calibration-order-bias-holdout",
      question: "Holdout no usado en desarrollo del prompt evita:",
      options: [
        "Generalización honestamente medida",
        "Sobreajuste de prompts a un set visto",
        "Versionado",
        "Rúbricas",
      ],
      correctIndex: 1,
      explanation: "True holdout.",
    },
    {
      concept: "calibration-order-bias-holdout",
      question: "Calibrar umbrales de auto-pass/fail requiere:",
      options: [
        "Un solo ejemplo",
        "Comparar graders vs labels humanos en muestra",
        "Ignorar desacuerdos",
        "PII en el set público",
      ],
      correctIndex: 1,
      explanation: "Calibrate against humans.",
    },
    {
      concept: "injection-exfil-tool-misuse",
      question: "Prompt injection busca:",
      options: [
        "Mejorar el schema",
        "Hacer que el modelo ignore políticas y obedezca contenido hostil",
        "Acelerar embeddings",
        "Firmar releases",
      ],
      correctIndex: 1,
      explanation: "Injection = policy override attempts.",
    },
    {
      concept: "injection-exfil-tool-misuse",
      question: "Exfiltración vía agente ocurre si:",
      options: [
        "Las tools respetan ACL y egress",
        "Una tool envía datos sensibles a destinos no autorizados",
        "Solo hay lectura de docs públicos",
        "No hay red",
      ],
      correctIndex: 1,
      explanation: "Exfil via powerful tools.",
    },
    {
      concept: "injection-exfil-tool-misuse",
      question: "Mitigar tool misuse incluye:",
      options: [
        "Dar admin a todas las tools",
        "Allowlists, confirmaciones y least privilege por tool",
        "Desactivar logs de tool calls",
        "Poner secrets en el system prompt del usuario",
      ],
      correctIndex: 1,
      explanation: "Hard controls on tools.",
    },
    {
      concept: "indirect-poison-least-priv",
      question: "Indirect injection usa:",
      options: [
        "Solo el system prompt del desarrollador",
        "Contenido recuperado/archivos que el modelo lee como instrucciones",
        "Un cable de red roto",
        "El linter",
      ],
      correctIndex: 1,
      explanation: "Indirect = poisoned retrieved content.",
    },
    {
      concept: "indirect-poison-least-priv",
      question: "Poisoning de knowledge base busca:",
      options: [
        "Mejorar citas honestas",
        "Alterar respuestas insertando contenido malicioso indexado",
        "Subir el F1 legítimo",
        "Rotar keys",
      ],
      correctIndex: 1,
      explanation: "Poisoned corpus.",
    },
    {
      concept: "indirect-poison-least-priv",
      question: "Least privilege en el agente significa:",
      options: [
        "Acceso total “por si acaso”",
        "Solo tools y datos mínimos para la tarea",
        "Root en el sandbox host",
        "Tokens sin expiry",
      ],
      correctIndex: 1,
      explanation: "Minimal agent authority.",
    },
    {
      concept: "hallucination-abstention",
      question: "Alucinación en este contexto es:",
      options: [
        "Un feature de CSS",
        "Afirmar hechos no soportados por evidencia/conocimiento confiable",
        "Un 404 de API",
        "Un OOM de GPU",
      ],
      correctIndex: 1,
      explanation: "Unsupported claims.",
    },
    {
      concept: "hallucination-abstention",
      question: "Abstención calibrada es preferible a:",
      options: [
        "Callar siempre",
        "Responder con confianza falsa sin evidencia",
        "Citar fuentes",
        "Pedir aclaración cuando falta info",
      ],
      correctIndex: 1,
      explanation: "Better no answer than wrong answer.",
    },
    {
      concept: "hallucination-abstention",
      question: "Grounding checks reducen alucinación al:",
      options: [
        "Prohibir retrieval",
        "Verificar claims contra contexto recuperado/tools",
        "Aumentar temperature siempre",
        "Desactivar rúbricas",
      ],
      correctIndex: 1,
      explanation: "Check claims vs evidence.",
    },
    {
      concept: "latency-cost-cache-incident-rollback",
      question: "Cache de respuestas/embeddings controla:",
      options: [
        "Solo el color del badge",
        "Costo y latencia de requests repetidos",
        "La corrección legal automática",
        "El parentesco de entidades",
      ],
      correctIndex: 1,
      explanation: "Caches trade freshness for cost/latency.",
    },
    {
      concept: "latency-cost-cache-incident-rollback",
      question: "Un incident de modelo (regresión de calidad) puede requerir:",
      options: [
        "Ignorar dashboards",
        "Rollback a versión previa y postmortem",
        "Subir temperature en silencio",
        "Borrar evals",
      ],
      correctIndex: 1,
      explanation: "Rollback + learn.",
    },
    {
      concept: "latency-cost-cache-incident-rollback",
      question: "Presupuesto de costo por 1k requests se monitorea para:",
      options: [
        "Sorpresas de factura y abuso",
        "Reemplazar authz",
        "Medir parentesco",
        "Pintar UI",
      ],
      correctIndex: 1,
      explanation: "Cost SLOs/alerts.",
    },
  ],

  // === Section 51: Observabilidad, gobernanza y UX del copiloto (integrator-final) ===
  'integrator-final': [
    {
      concept: "traces-prompts-retrieval-tools",
      question: "Una traza de copiloto debería incluir:",
      options: [
        "Solo el status 200",
        "Prompt/version, retrieval hits, tool calls y latencias",
        "La contraseña del usuario",
        "El wallpaper",
      ],
      correctIndex: 1,
      explanation: "Full causal trace of the answer.",
    },
    {
      concept: "traces-prompts-retrieval-tools",
      question: "Correlacionar trace_id entre API y worker ayuda a:",
      options: [
        "Perder el hilo del request",
        "Debug end-to-end de un caso sintético",
        "Evitar métricas",
        "Saltar auth",
      ],
      correctIndex: 1,
      explanation: "Distributed correlation.",
    },
    {
      concept: "traces-prompts-retrieval-tools",
      question: "Loguear tool args sensibles requiere:",
      options: [
        "PII en claro siempre",
        "Redacción/minimización según política",
        "Desactivar traces",
        "Tokens de sesión en el cliente público",
      ],
      correctIndex: 1,
      explanation: "Redact sensitive trace fields.",
    },
    {
      concept: "tokens-cost-latency-redaction",
      question: "Métricas de tokens por request permiten:",
      options: [
        "Ignorar la factura",
        "Atribuir costo y detectar outliers",
        "Reemplazar evals de calidad",
        "Probar fraude",
      ],
      correctIndex: 1,
      explanation: "Token accounting.",
    },
    {
      concept: "tokens-cost-latency-redaction",
      question: "Redacción en logs de prompts evita:",
      options: [
        "Mejor DX de debug sin cuidado",
        "Filtrar secretos/PII a sistemas de logs",
        "La utilidad de sampling",
        "Trace ids",
      ],
      correctIndex: 1,
      explanation: "Redact before export.",
    },
    {
      concept: "tokens-cost-latency-redaction",
      question: "Latencia desglosada (retrieval vs LLM vs tools) sirve para:",
      options: [
        "Un solo número opaco siempre suficiente",
        "Encontrar el cuello de botella real",
        "Eliminar canaries",
        "Firmar modelos",
      ],
      correctIndex: 1,
      explanation: "Latency breakdown.",
    },
    {
      concept: "registry-model-prompt-dataset",
      question: "Un registry de prompts versiona:",
      options: [
        "Solo imágenes Docker",
        "Textos/plantillas de prompt con historial y owners",
        "La silla del office",
        "El theme CSS",
      ],
      correctIndex: 1,
      explanation: "Prompt registry.",
    },
    {
      concept: "registry-model-prompt-dataset",
      question: "Registrar dataset de eval junto al modelo habilita:",
      options: [
        "Amnesia institucional",
        "Reproducir y auditar la calidad declarada",
        "Saltar holdout",
        "Compartir PII",
      ],
      correctIndex: 1,
      explanation: "Dataset lineage with model.",
    },
    {
      concept: "registry-model-prompt-dataset",
      question: "Cambiar prompt en prod sin registro dificulta:",
      options: [
        "El caos controlado",
        "Rollback y atribución de regresiones",
        "El lint de YAML",
        "El icono del bot",
      ],
      correctIndex: 1,
      explanation: "Untracked prompt changes hurt ops.",
    },
    {
      concept: "change-access-retention-audit",
      question: "Control de cambios en config de IA incluye:",
      options: [
        "Edits hot en prod sin rastro",
        "Quién cambió qué, aprobación y ventana de retención de evidencia",
        "Borrar audit logs semanalmente “por limpieza” sin política",
        "Keys en el chat",
      ],
      correctIndex: 1,
      explanation: "Governed change.",
    },
    {
      concept: "change-access-retention-audit",
      question: "Acceso a traces con prompts debe ser:",
      options: [
        "Público en Internet",
        "RBAC + auditoría de lecturas sensibles",
        "Sin logs de acceso",
        "Compartido en Slack sin redaction",
      ],
      correctIndex: 1,
      explanation: "Protect sensitive traces.",
    },
    {
      concept: "change-access-retention-audit",
      question: "Retención de logs de copiloto equilibra:",
      options: [
        "Guardar todo eterno con PII vs borrar todo al segundo",
        "Necesidades de debug/compliance vs minimización",
        "Solo el color del retention chart",
        "El learning rate",
      ],
      correctIndex: 1,
      explanation: "Retention policy trade-off.",
    },
    {
      concept: "slo-feedback-drift",
      question: "SLO de calidad del copiloto puede basarse en:",
      options: [
        "Solo el uptime del pod",
        "Tasa de thumbs-down, abstención, o eval online acotada",
        "El número de emojis",
        "El clima",
      ],
      correctIndex: 1,
      explanation: "Quality SLOs.",
    },
    {
      concept: "slo-feedback-drift",
      question: "Feedback de usuarios debe:",
      options: [
        "Ignorarse si es negativo",
        "Almacenarse con contexto (trace) para mejorar y detectar drift",
        "Incluir passwords",
        "Ser el único grader sin muestreo",
      ],
      correctIndex: 1,
      explanation: "Feedback loops with context.",
    },
    {
      concept: "slo-feedback-drift",
      question: "Drift de uso (nuevas intenciones) sugiere:",
      options: [
        "Congelar el producto para siempre",
        "Revisar cobertura de evals y rutas del router",
        "Borrar el registry",
        "Desactivar HITL",
      ],
      correctIndex: 1,
      explanation: "Usage drift → re-eval coverage.",
    },
    {
      concept: "incidents-rollback-postmortem",
      question: "Rollback de prompt/modelo ante regresión es:",
      options: [
        "Admisión de derrota prohibida",
        "Mitigación estándar con comunicación y seguimiento",
        "Inútil si hay traces",
        "Solo para CSS",
      ],
      correctIndex: 1,
      explanation: "Rollback is a first-class control.",
    },
    {
      concept: "incidents-rollback-postmortem",
      question: "Postmortem blameless documenta:",
      options: [
        "Quién es culpable moralmente",
        "Timeline, impacto, causas y acciones preventivas",
        "Solo elogios",
        "Secrets del incident",
      ],
      correctIndex: 1,
      explanation: "Blameless learning.",
    },
    {
      concept: "incidents-rollback-postmortem",
      question: "Severidad de incident de IA considera:",
      options: [
        "Solo el número de logs INFO",
        "Impacto a usuarios, seguridad, compliance y costo",
        "El font del error",
        "El índice del exam",
      ],
      correctIndex: 1,
      explanation: "Impact-based severity.",
    },
    {
      concept: "uncertainty-cites-confirm",
      question: "Mostrar incertidumbre al usuario cuando la evidencia es débil:",
      options: [
        "Siempre confunde sin valor",
        "Reduce sobreconfianza y errores de alto costo",
        "Viola el schema JSON",
        "Impide citas",
      ],
      correctIndex: 1,
      explanation: "Surface uncertainty.",
    },
    {
      concept: "uncertainty-cites-confirm",
      question: "Pedir confirmación antes de una acción irreversible es:",
      options: [
        "Mala UX siempre",
        "Patrón de seguridad en copilotos con side effects",
        "Innecesario si el modelo “suena seguro”",
        "Un substitute de authz",
      ],
      correctIndex: 1,
      explanation: "Confirm high-impact actions.",
    },
    {
      concept: "uncertainty-cites-confirm",
      question: "Citas clickeables en la UI permiten:",
      options: [
        "Ocultar provenance",
        "Que el usuario verifique el grounding",
        "Exfiltrar más fácil sin controles",
        "Saltar ACL",
      ],
      correctIndex: 1,
      explanation: "UI cites for verification.",
    },
    {
      concept: "a11y-correction-contestability",
      question: "Accesibilidad del copiloto incluye:",
      options: [
        "Solo dark mode aesthetic",
        "Teclado, lectores de pantalla, contraste y textos claros",
        "Ignorar WCAG porque es IA",
        "Captchas imposibles como única vía",
      ],
      correctIndex: 1,
      explanation: "a11y applies to AI UX.",
    },
    {
      concept: "a11y-correction-contestability",
      question: "Corrección por el usuario (edit/thumbs) debe:",
      options: [
        "Perderse al refrescar sin store",
        "Persistirse y preferiblemente mejorar el sistema con gobernanza",
        "Enviarse a un modelo sin política de datos",
        "Incluir secretos de terceros",
      ],
      correctIndex: 1,
      explanation: "Corrections are product signal.",
    },
    {
      concept: "a11y-correction-contestability",
      question: "Contestability significa que el usuario puede:",
      options: [
        "Nunca cuestionar al bot",
        "Impugnar/revisar una decisión automatizada con proceso",
        "Solo cerrar la pestaña",
        "Obtener root del cluster",
      ],
      correctIndex: 1,
      explanation: "Right to contest automated decisions.",
    },
  ],

  // === Section 52: Enterprise Relationship & Operations Intelligence Platform: capstone final (career-strategy) ===
  'career-strategy': [
    {
      concept: "stakeholders-jobs-success-cf1",
      question: "Mapear stakeholders del capstone sirve para:",
      options: [
        "Ignorar a compliance",
        "Alinear jobs-to-be-done y criterios de éxito por actor",
        "Saltar el diseño de APIs",
        "Evitar métricas",
      ],
      correctIndex: 1,
      explanation: "Stakeholders drive success criteria.",
    },
    {
      concept: "stakeholders-jobs-success-cf1",
      question: "Un success metric para ops de casos sintéticos podría ser:",
      options: [
        "Número de memes",
        "TTR de triage y precisión de review bajo SLO",
        "Commits por hora sin calidad",
        "Likes en redes",
      ],
      correctIndex: 1,
      explanation: "Operational success metrics.",
    },
    {
      concept: "stakeholders-jobs-success-cf1",
      question: "Counterfactual “sin la plataforma” ayuda a:",
      options: [
        "Justificar cualquier scope",
        "Explicar el valor incremental del sistema",
        "Eliminar riesgos",
        "Probar parentesco",
      ],
      correctIndex: 1,
      explanation: "Value vs status quo.",
    },
    {
      concept: "changes-constraints-risks-nogo",
      question: "Constraints no negociables del capstone suelen incluir:",
      options: [
        "PII real en demos",
        "Datos sintéticos, seguridad mínima y límites de costo",
        "Cero tests",
        "Deploy sin rollback",
      ],
      correctIndex: 1,
      explanation: "Hard constraints.",
    },
    {
      concept: "changes-constraints-risks-nogo",
      question: "Un no-go criterion es:",
      options: [
        "Una preferencia cosmética",
        "Condición que detiene el release si se incumple (seguridad/calidad)",
        "Un nice-to-have de UI",
        "El color del logo",
      ],
      correctIndex: 1,
      explanation: "No-go = release blocker.",
    },
    {
      concept: "changes-constraints-risks-nogo",
      question: "Registrar riesgos con mitigación permite:",
      options: [
        "Sorpresas en la demo final",
        "Priorizar controles antes de la defensa",
        "Evitar ADRs",
        "Ocultar deuda",
      ],
      correctIndex: 1,
      explanation: "Risk register.",
    },
    {
      concept: "bounded-apis-events",
      question: "Bounded contexts en el capstone separan:",
      options: [
        "Solo carpetas vacías",
        "Intake, ER, relación, triage, reporting e IA con contratos",
        "Un monólito sin bordes a propósito",
        "El README del CV",
      ],
      correctIndex: 1,
      explanation: "BC map of the platform.",
    },
    {
      concept: "bounded-apis-events",
      question: "Eventos entre contextos deben:",
      options: [
        "Compartir tablas internas libremente",
        "Exponer contratos versionados, no modelos internos crudos",
        "Incluir secrets",
        "Ser opcionales sin schema",
      ],
      correctIndex: 1,
      explanation: "Events as contracts.",
    },
    {
      concept: "bounded-apis-events",
      question: "APIs del capstone documentadas con OpenAPI facilitan:",
      options: [
        "Acoplamiento oculto",
        "Integración y pruebas de contrato entre módulos",
        "PII en paths",
        "Saltar authz",
      ],
      correctIndex: 1,
      explanation: "Documented APIs.",
    },
    {
      concept: "data-models-rpa-rag-human",
      question: "El modelo de datos del capstone debe cubrir:",
      options: [
        "Solo UI colors",
        "Casos, entidades sintéticas, evidencia, decisiones y audit",
        "Salarios reales de empleados",
        "Tokens de redes sociales personales",
      ],
      correctIndex: 1,
      explanation: "Core domain data.",
    },
    {
      concept: "data-models-rpa-rag-human",
      question: "RPA + RAG + human-in-the-loop en el diseño implica:",
      options: [
        "Cero puntos de aprobación",
        "Automatizar con evidencia y escalar a humano cuando hay riesgo",
        "Confiar ciegamente en el LLM para writes irreversibles",
        "Sin logs de decisión",
      ],
      correctIndex: 1,
      explanation: "Automation with HITL.",
    },
    {
      concept: "data-models-rpa-rag-human",
      question: "Matching/ER en el capstone con datos sintéticos:",
      options: [
        "Demuestra fraude o parentesco real",
        "Resuelve identidad de registros sintéticos; no implica fraude/parentesco",
        "Requiere DNI reales",
        "Sustituye authn",
      ],
      correctIndex: 1,
      explanation: "ER ≠ fraud/kinship claims.",
    },
    {
      concept: "tests-evals-redteam-perf",
      question: "La defensa del capstone debe mostrar:",
      options: [
        "Solo un video sin tests",
        "Tests, evals de IA, red-team básico y señales de performance",
        "Un único happy path manual",
        "Secrets en el demo",
      ],
      correctIndex: 1,
      explanation: "Evidence of quality & safety.",
    },
    {
      concept: "tests-evals-redteam-perf",
      question: "Red team del copiloto incluye:",
      options: [
        "Solo saludos amables",
        "Injection, exfil intent, tool misuse bajo sandbox",
        "Borrar el firewall",
        "Usar prod real sin permiso",
      ],
      correctIndex: 1,
      explanation: "Adversarial tests.",
    },
    {
      concept: "tests-evals-redteam-perf",
      question: "Perf smoke del pipeline verifica:",
      options: [
        "Que el logo cargue en 10 min",
        "Presupuestos de latencia/throughput en carga sintética acotada",
        "El F1 de marketing",
        "El número de slides",
      ],
      correctIndex: 1,
      explanation: "Perf budgets.",
    },
    {
      concept: "slo-backup-rollback-disaster",
      question: "SLO del platform capstone debería cubrir:",
      options: [
        "Solo el nombre del repo",
        "Disponibilidad, frescura/latencia y calidad de decisión bajo umbrales",
        "El font del README",
        "Likes del video",
      ],
      correctIndex: 1,
      explanation: "Service & quality SLOs.",
    },
    {
      concept: "slo-backup-rollback-disaster",
      question: "Backup + restore ensayado demuestra:",
      options: [
        "Que el backup file existe en theory",
        "RPO/RTO realistas ante pérdida de estado",
        "Que no hace falta runbook",
        "Que matching es fraude",
      ],
      correctIndex: 1,
      explanation: "Tested restore.",
    },
    {
      concept: "slo-backup-rollback-disaster",
      question: "Disaster recovery del capstone documenta:",
      options: [
        "Un único punto de fallo sin plan",
        "Fallos de región/deps y pasos de continuidad",
        "Solo el happy path de demo",
        "Passwords en el plan público",
      ],
      correctIndex: 1,
      explanation: "DR plan.",
    },
    {
      concept: "demo-cv-narrative",
      question: "La narrativa de demo debe conectar:",
      options: [
        "Features aleatorias sin problema de negocio",
        "Problema de stakeholders → arquitectura → evidencia de resultados",
        "Solo el stack sin outcomes",
        "PII real de un empleador",
      ],
      correctIndex: 1,
      explanation: "Story: problem→system→proof.",
    },
    {
      concept: "demo-cv-narrative",
      question: "El CV/portfolio del capstone destaca:",
      options: [
        "Buzzwords sin artefactos",
        "Impacto medible, rol y links a demos/código relevantes",
        "Lista de lenguajes del 1990 sin contexto",
        "Datos personales de terceros",
      ],
      correctIndex: 1,
      explanation: "Evidence-based career narrative.",
    },
    {
      concept: "demo-cv-narrative",
      question: "Un elevator pitch técnico efectivo:",
      options: [
        "Dura 30 minutos sin estructura",
        "Problema, enfoque, trade-offs y resultado en poco tiempo",
        "Lee el README línea por línea",
        "Oculta riesgos",
      ],
      correctIndex: 1,
      explanation: "Concise technical story.",
    },
    {
      concept: "arch-readme-cards-license-video-defense",
      question: "README de arquitectura del capstone incluye:",
      options: [
        "Solo un badge roto",
        "Diagrama, contextos, cómo correr, límites y licencia",
        "Secrets de prod",
        "PII de la demo real",
      ],
      correctIndex: 1,
      explanation: "Operable open README.",
    },
    {
      concept: "arch-readme-cards-license-video-defense",
      question: "Model/system cards en el entregable documentan:",
      options: [
        "Nada sobre limitaciones",
        "Uso previsto, datos sintéticos, métricas y riesgos residuales",
        "La playlist",
        "Claves de API",
      ],
      correctIndex: 1,
      explanation: "Transparency cards.",
    },
    {
      concept: "arch-readme-cards-license-video-defense",
      question: "La defensa oral debe poder explicar:",
      options: [
        "Solo la librería de moda",
        "Decisiones, fallas conocidas, privacidad y cómo se valida calidad",
        "Ningún trade-off",
        "Cómo obtener PII de producción",
      ],
      correctIndex: 1,
      explanation: "Defense = judgment under scrutiny.",
    },
  ],
}

async function main() {
  console.log('🌱 Seeding QuestionBank...')

  // Clear existing
  await prisma.questionBank.deleteMany({})
  console.log('  ✓ Cleared existing questions')

  let count = 0
  for (const [sectionId, questions] of Object.entries(QUESTION_BANK)) {
    for (const q of questions) {
      await prisma.questionBank.create({
        data: {
          sectionId,
          concept: q.concept,
          variant: count % 3 + 1, // will be overwritten by the unique constraint logic
          question: q.question,
          options: JSON.stringify(q.options),
          correctIndex: q.correctIndex,
          explanation: q.explanation,
        },
      })
      count++
    }
  }

  // Now fix variant numbers: for each (sectionId, concept), assign variants 1, 2, 3 in order
  const allQuestions = await prisma.questionBank.findMany()
  const grouped = new Map<string, typeof allQuestions>()
  for (const q of allQuestions) {
    const key = `${q.sectionId}|${q.concept}`
    if (!grouped.has(key)) grouped.set(key, [])
    grouped.get(key)!.push(q)
  }

  for (const [, qs] of grouped.entries()) {
    for (let i = 0; i < qs.length; i++) {
      await prisma.questionBank.update({
        where: { id: qs[i].id },
        data: { variant: i + 1 },
      })
    }
  }

  console.log(`  ✓ Inserted ${count} questions across ${Object.keys(QUESTION_BANK).length} sections`)

  // Create demo admin account if not exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: 'admin@python-ds.pe' },
  })
  if (!existingAdmin) {
    const bcrypt = await import('bcryptjs')
    const passwordHash = await bcrypt.default.hash('admin123', 12)
    await prisma.user.create({
      data: {
        email: 'admin@python-ds.pe',
        name: 'Admin Demo',
        passwordHash,
        role: 'ADMIN',
      },
    })
    console.log('  ✓ Created demo admin: admin@python-ds.pe / admin123')
  } else {
    console.log('  ✓ Demo admin already exists')
  }

  // Create demo student account
  const existingStudent = await prisma.user.findUnique({
    where: { email: 'demo@python-ds.pe' },
  })
  if (!existingStudent) {
    const bcrypt = await import('bcryptjs')
    const passwordHash = await bcrypt.default.hash('demo1234', 12)
    await prisma.user.create({
      data: {
        email: 'demo@python-ds.pe',
        name: 'Estudiante Demo',
        passwordHash,
        role: 'STUDENT',
      },
    })
    console.log('  ✓ Created demo student: demo@python-ds.pe / demo1234')
  } else {
    console.log('  ✓ Demo student already exists')
  }

  // ═══════════════════════════════════════════════════════════
  // SUBSCRIPTION PLANS — seed 3 tiers (Free, Pro, Team)
  // ═══════════════════════════════════════════════════════════
  console.log('\n📊 Seeding subscription plans...')

  const PLANS = [
    {
      code: 'free',
      name: 'Free',
      description: 'Acceso limitado para probar el curso',
      pricing: {
        PE: { monthly: 0, yearly: 0, currency: 'PEN' },
        US: { monthly: 0, yearly: 0, currency: 'USD' },
        EU: { monthly: 0, yearly: 0, currency: 'EUR' },
        REST: { monthly: 0, yearly: 0, currency: 'USD' },
      },
      features: [
        'Secciones 1-5 (Fundamentos básicos)',
        'Editor interactivo Pyodide',
        'Quizzes de auto-evaluación',
        'Progreso local guardado',
      ],
      maxSections: 5,
      hasExams: false,
      hasPlayground: true,
      hasCertificate: false,
      hasMentorship: false,
    },
    {
      code: 'pro',
      name: 'Pro',
      description: 'Acceso completo al curso de 52 secciones',
      pricing: {
        PE: { monthly: 29, yearly: 290, currency: 'PEN' },
        US: { monthly: 9.99, yearly: 99, currency: 'USD' },
        EU: { monthly: 8.99, yearly: 89, currency: 'EUR' },
        REST: { monthly: 9.99, yearly: 99, currency: 'USD' },
      },
      features: [
        'Las 52 secciones completas',
        'Exámenes con anti-plagio (3 variantes)',
        'Editor interactivo Pyodide',
        '4 proyectos capstone de portafolio',
        'Certificado de completitud',
        'Dashboard de progreso avanzado',
        'Familiarity Score Dashboard',
      ],
      maxSections: -1,
      hasExams: true,
      hasPlayground: true,
      hasCertificate: true,
      hasMentorship: false,
    },
    {
      code: 'team',
      name: 'Team',
      description: 'Para equipos y empresas que aprenden juntos',
      pricing: {
        PE: { monthly: 99, yearly: 990, currency: 'PEN' },
        US: { monthly: 29.99, yearly: 299, currency: 'USD' },
        EU: { monthly: 27.99, yearly: 279, currency: 'EUR' },
        REST: { monthly: 29.99, yearly: 299, currency: 'USD' },
      },
      features: [
        'Todo lo de Pro, más:',
        'Mentoría 1:1 mensual (30 min)',
        'Review de portafolio personalizado',
        'Soporte prioritario por Slack',
        'Acceso anticipado a nuevas secciones',
        'Reportes de progreso para managers',
      ],
      maxSections: -1,
      hasExams: true,
      hasPlayground: true,
      hasCertificate: true,
      hasMentorship: true,
    },
  ]

  for (const plan of PLANS) {
    await prisma.subscriptionPlan.upsert({
      where: { code: plan.code },
      create: {
        code: plan.code,
        name: plan.name,
        description: plan.description,
        pricingJSON: JSON.stringify(plan.pricing),
        featuresJSON: JSON.stringify(plan.features),
        maxSections: plan.maxSections,
        hasExams: plan.hasExams,
        hasPlayground: plan.hasPlayground,
        hasCertificate: plan.hasCertificate,
        hasMentorship: plan.hasMentorship,
        isActive: true,
      },
      update: {
        name: plan.name,
        description: plan.description,
        pricingJSON: JSON.stringify(plan.pricing),
        featuresJSON: JSON.stringify(plan.features),
        maxSections: plan.maxSections,
        hasExams: plan.hasExams,
        hasPlayground: plan.hasPlayground,
        hasCertificate: plan.hasCertificate,
        hasMentorship: plan.hasMentorship,
      },
    })
    console.log(`  ✓ Plan: ${plan.name} (${plan.code})`)
  }

  // ═══════════════════════════════════════════════════════════
  // TEST ACCOUNTS — 2 admins + 10 students with strong passwords
  // Passwords generated by scripts/generate_passwords.py using secrets module
  // ═══════════════════════════════════════════════════════════
  console.log('\n👥 Creating test accounts (2 admins + 10 students)...')

  // Read generated passwords from file if it exists, otherwise use hardcoded fallback
  // Passwords were generated by: python3 scripts/generate_passwords.py
  const TEST_ACCOUNTS = [
    { email: 'admin1@python-ds.pe', name: 'Admin Uno', role: 'ADMIN', password: '(zPIB8i8V[1d7L[JnR8X', country: 'PE' },
    { email: 'admin2@python-ds.pe', name: 'Admin Dos', role: 'ADMIN', password: '6J>1YV5ashM&R_aeFoQ$', country: 'PE' },
    { email: 'tester01@python-ds.pe', name: 'Tester Uno', role: 'STUDENT', password: 'dY1^#HleuXY2Ac>8v{$s', country: 'PE' },
    { email: 'tester02@python-ds.pe', name: 'Tester Dos', role: 'STUDENT', password: '@3(sijVBFD9Z(M5FRWs3', country: 'PE' },
    { email: 'tester03@python-ds.pe', name: 'Tester Tres', role: 'STUDENT', password: 'Q(wf2jx$C**h(NzNcMPl', country: 'PE' },
    { email: 'tester04@python-ds.pe', name: 'Tester Cuatro', role: 'STUDENT', password: 'NGvxKc3-AqsJp>k#Z-Lf', country: 'PE' },
    { email: 'tester05@python-ds.pe', name: 'Tester Cinco', role: 'STUDENT', password: '(n}}y_>ZtC}0gwdcYU>8', country: 'PE' },
    { email: 'tester06@python-ds.pe', name: 'Tester Seis', role: 'STUDENT', password: 'fYR7k@lCoctLvw-tC9[9', country: 'PE' },
    { email: 'tester07@python-ds.pe', name: 'Tester Siete', role: 'STUDENT', password: 'B*doh>W<&+EBF8D(qF}5', country: 'PE' },
    { email: 'tester08@python-ds.pe', name: 'Tester Ocho', role: 'STUDENT', password: 'Z%6+e$)khA#D>HkL$FR2', country: 'PE' },
    { email: 'tester09@python-ds.pe', name: 'Tester Nueve', role: 'STUDENT', password: '6Azz-!Ez)R)8w-2!bA(X', country: 'PE' },
    { email: 'tester10@python-ds.pe', name: 'Tester Diez', role: 'STUDENT', password: 'I9)JpSe2#g>9V88[R]@b', country: 'PE' },
  ]

  const bcrypt = await import('bcryptjs')
  const freePlan = await prisma.subscriptionPlan.findUnique({ where: { code: 'free' } })
  const proPlan = await prisma.subscriptionPlan.findUnique({ where: { code: 'pro' } })

  for (const account of TEST_ACCOUNTS) {
    const existing = await prisma.user.findUnique({ where: { email: account.email } })
    if (existing) {
      console.log(`  ✓ ${account.email} already exists`)
      continue
    }

    const passwordHash = await bcrypt.default.hash(account.password, 12)
    const now = new Date()
    const periodEnd = new Date(now)
    periodEnd.setFullYear(periodEnd.getFullYear() + 100) // free = forever for testers

    // Give testers the Pro plan for free (they're friends & family)
    const planToAssign = account.role === 'ADMIN' ? proPlan : proPlan

    await prisma.user.create({
      data: {
        email: account.email,
        name: account.name,
        passwordHash,
        role: account.role,
        country: account.country,
        subscription: {
          create: {
            planId: planToAssign?.id || freePlan?.id || '',
            status: 'ACTIVE',
            billingCycle: 'YEARLY',
            currency: 'PEN',
            amount: 0, // free for testers
            provider: 'MANUAL',
            currentPeriodStart: now,
            currentPeriodEnd: periodEnd,
          },
        },
      },
    })
    console.log(`  ✓ Created: ${account.email} (${account.role})`)
  }

  console.log('\n✅ Seed complete!')
  console.log('   Admin:    admin@python-ds.pe / admin123')
  console.log('   Student:  demo@python-ds.pe / demo1234')
  console.log('   Test accounts: see docs/TEST_ACCOUNTS.md (gitignored)')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
