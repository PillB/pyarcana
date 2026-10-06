/**
 * Sesión 0: the learner-facing content of /empezar.
 *
 * Spanish (Peru), for someone who has never installed a program by hand. Written against
 * audit/fixer/writing_rules.md and measured by scripts/setup_intro_prose_audit.py: sentences of 32
 * words or fewer, every term defined where it first appears, English only inside `code` (and the
 * literal labels a screen shows, which are quoted as code so the learner can match them).
 *
 * Facts that change (versions, installer screens, menu names) carry their source in
 * audit/session-0/RESEARCH.md. Step ids are stored in the learner's browser: never rename one.
 */
import type { SetupOs } from './os'
import type { ShotSpec } from './screenshots'
import type { SetupPart, SetupStep } from './types'

const WIN: readonly SetupOs[] = ['windows']
const MAC: readonly SetupOs[] = ['macos']
const LINUX: readonly SetupOs[] = ['linux']
const UNIX: readonly SetupOs[] = ['macos', 'linux']

/** The Python release the course's lessons run on, and the last 3.12 with Windows and macOS installers. */
export const PYTHON_RELEASE = '3.12.10'
export const PYTHON_RELEASE_URL = 'https://www.python.org/downloads/release/python-31210/'

export const SETUP_INTRO = {
  title: 'Sesión 0: prepara tu computadora',
  lead: [
    'Antes de la Sección 1 vas a dejar lista tu computadora. Instalarás cuatro programas y crearás una cuenta. Al final, harás una prueba que confirma que todo responde.',
    'Cada paso pide **una sola acción**. Debajo verás qué deberías ver si salió bien. Si algo falla, abre el recuadro **Si no funciona**: ahí están los problemas más comunes y cómo resolverlos.',
    'Marca **Hecho** al terminar cada paso. Tu navegador recordará dónde te quedaste, así que puedes hacerlo en dos o tres sesiones.',
  ],
  needsTitle: 'Antes de empezar, ten a mano',
  needs: [
    'Una computadora con Windows 10 u 11, macOS 11 o más nuevo, o Linux (esta guía usa Ubuntu 24.04).',
    'La contraseña de esa computadora. Si es del trabajo o de un colegio, quizá no te deje instalar programas: pide permiso a quien la administra antes de empezar.',
    'Unos 5 GB libres en el disco y una conexión a internet estable.',
    'Un correo electrónico que puedas abrir ahora y tu celular, para proteger tu cuenta de GitHub.',
    'Entre una y dos horas. No hace falta hacerlo todo de una vez.',
  ],
  nextTitle: 'Listo: ya puedes empezar la Sección 1',
  next: [
    'Tu computadora tiene todo lo que pide el curso. En la Sección 1 usarás esta misma terminal para crear un **entorno virtual**: una carpeta que guarda los paquetes de un proyecto sin mezclarlos con los de otros.',
    'Si mañana algo deja de responder, vuelve a la Parte 7 y repite la comprobación final. Te dirá qué pieza revisar.',
  ],
} as const

// --- Parte 1: la terminal ------------------------------------------------------------------------

const terminal: SetupPart = {
  id: 'terminal',
  title: 'La terminal',
  goal: 'Al terminar esta parte sabrás abrir la terminal y darle tu primera orden.',
  intro: [
    'La **terminal** es una ventana donde le das órdenes a la computadora escribiendo, en vez de hacer clic. Cada orden es una línea de texto. Pulsas Enter y la respuesta aparece debajo, también como texto.',
    'Programar en Python exige usarla: con ella instalas, ejecutas y compruebas cada pieza. No vas a romper nada por escribir una orden equivocada. En el peor caso, la terminal responde con un mensaje de error.',
    'Cada orden de esta guía tiene un botón para copiarla. Para pegarla en la terminal usa Ctrl y V en Windows, Command y V en Mac, o Ctrl, Shift y V en Linux.',
  ],
  figure: 'setup-terminal',
  steps: [
    {
      id: 'terminal.win.abrir',
      os: WIN,
      title: 'Abre la terminal',
      guide: { label: 'la guía oficial de Terminal Windows, de Microsoft', url: 'https://learn.microsoft.com/es-es/windows/terminal/install' },
      body: [
        'Pulsa la tecla Windows, la que tiene el logo de cuatro cuadros. Escribe `terminal` y pulsa Enter.',
        'En Windows 10 puede que no aparezca. En ese caso escribe `powershell` y pulsa Enter: sirve igual.',
      ],
      shot: 'win-terminal-open',
      expect: {
        text: 'Una ventana con una línea que termina en `>`. Esa línea se llama **prompt**: es la terminal esperando tu orden.',
        output: 'PS C:\\Users\\ana>',
      },
      fixes: [
        {
          symptom: 'Se abrió una ventana negra que dice «Símbolo del sistema» y su línea no empieza con `PS`.',
          steps: [
            'Esa es otra terminal, más antigua, llamada `cmd`. Ciérrala.',
            'Pulsa la tecla Windows, escribe `powershell` y pulsa Enter. Esta guía usa PowerShell.',
          ],
        },
      ],
    },
    {
      id: 'terminal.mac.abrir',
      os: MAC,
      title: 'Abre la terminal',
      guide: { label: 'el manual oficial de Terminal, de Apple', url: 'https://support.apple.com/es-es/guide/terminal/welcome/mac' },
      body: [
        'Pulsa a la vez las teclas Command y barra espaciadora. Se abre un buscador en el centro de la pantalla.',
        'Escribe `Terminal` y pulsa Enter.',
      ],
      shot: 'mac-terminal-open',
      expect: {
        text: 'Una ventana con una línea que termina en `%`. Esa línea se llama **prompt**: es la terminal esperando tu orden.',
        output: 'ana@MacBook-Air ~ %',
      },
    },
    {
      id: 'terminal.linux.abrir',
      os: LINUX,
      title: 'Abre la terminal',
      body: [
        'Pulsa a la vez Ctrl, Alt y T. Si no pasa nada, abre el menú de aplicaciones y busca «Terminal».',
      ],
      expect: {
        text: 'Una ventana con una línea que termina en `$`. Esa línea se llama **prompt**: es la terminal esperando tu orden.',
        output: 'ana@laptop:~$',
      },
    },
    {
      id: 'terminal.win.pwd',
      os: WIN,
      title: 'Pregunta en qué carpeta estás',
      body: [
        'La terminal siempre está «parada» en una carpeta. La orden `pwd` te dice cuál es. Escríbela tal cual y pulsa Enter.',
      ],
      command: 'pwd',
      expect: {
        text: 'La ruta de tu carpeta personal. Una **ruta** es la dirección de una carpeta: cada nombre está dentro del anterior.',
        output: 'Path\n----\nC:\\Users\\ana',
      },
      fixes: [
        {
          symptom: 'Aparece un mensaje en rojo que dice que no se reconoce el término.',
          steps: [
            'Revisa que escribiste `pwd` en minúsculas, sin espacios antes ni después.',
            'Pulsa la flecha hacia arriba del teclado: la terminal te devuelve la última orden para que la corrijas.',
          ],
        },
      ],
    },
    {
      id: 'terminal.unix.pwd',
      os: UNIX,
      title: 'Pregunta en qué carpeta estás',
      body: [
        'La terminal siempre está «parada» en una carpeta. La orden `pwd` te dice cuál es. Escríbela tal cual y pulsa Enter.',
      ],
      command: 'pwd',
      expect: {
        text: 'La ruta de tu carpeta personal. Una **ruta** es la dirección de una carpeta: cada nombre está dentro del anterior.',
        output: '/Users/ana        (en macOS)\n/home/ana         (en Linux)',
      },
      fixes: [
        {
          symptom: 'Dice `command not found`.',
          steps: [
            'Revisa que escribiste `pwd` en minúsculas, sin espacios antes ni después.',
            'Pulsa la flecha hacia arriba del teclado: la terminal te devuelve la última orden para que la corrijas.',
          ],
        },
      ],
    },
  ],
}

// --- Parte 2: Python -----------------------------------------------------------------------------

const PATH_FIX = 'Cierra **todas** las ventanas de la terminal y abre una nueva. Una terminal abierta antes de instalar no ve los programas nuevos.'

const python: SetupPart = {
  id: 'python',
  title: 'Python 3.12',
  goal: 'Al terminar esta parte, la terminal te responderá con la versión de Python que usa el curso.',
  intro: [
    'Python es el lenguaje del curso y también el programa que ejecuta tu código. Usarás la versión **3.12**, porque todas las lecciones se probaron con ella.',
    'Para encontrar un programa, la terminal revisa una lista de carpetas llamada **PATH**. Instalar Python no basta: su carpeta tiene que quedar en esa lista. Varios pasos de esta parte existen solo para eso.',
  ],
  figure: 'setup-path',
  steps: [
    {
      id: 'python.win.descargar',
      os: WIN,
      title: 'Descarga el instalador de Python 3.12',
      guide: { label: 'la guía oficial de Python 3.12 para Windows', url: 'https://docs.python.org/es/3.12/using/windows.html' },
      body: [
        `Abre esta página en tu navegador: \`${PYTHON_RELEASE_URL}\`. Baja hasta la tabla **Files**, al final.`,
        'Haz clic en `Windows installer (64-bit)`. El archivo se guarda en tu carpeta Descargas.',
      ],
      shot: 'py-release-files',
      expect: { text: 'Un archivo llamado `python-3.12.10-amd64.exe` en Descargas.' },
      fixes: [
        {
          symptom: 'Tu laptop tiene un procesador Snapdragon o dice «ARM».',
          steps: [
            'Abre Configuración, luego Sistema y luego Información. Mira la línea «Tipo de sistema».',
            'Si dice «procesador basado en ARM», descarga `Windows installer (ARM64)` en lugar del de 64 bits.',
          ],
        },
      ],
    },
    {
      id: 'python.win.path',
      os: WIN,
      title: 'Marca la casilla del PATH',
      guide: { label: 'la guía oficial de Python 3.12 para Windows', url: 'https://docs.python.org/es/3.12/using/windows.html' },
      body: [
        'Abre el archivo que descargaste. En la primera pantalla, abajo, hay una casilla que dice `Add python.exe to PATH` (añadir python.exe al PATH).',
        '**Márcala.** Viene desmarcada, y es el error más común de toda la instalación: sin ella, la terminal no encontrará Python.',
      ],
      shot: 'win-py-installer-path',
      expect: { text: 'La casilla `Add python.exe to PATH` con su visto bueno.' },
      fixes: [
        {
          symptom: 'Windows pide la contraseña de un administrador, y tú no la tienes.',
          steps: [
            'Pulsa `No` y vuelve a la primera pantalla del instalador.',
            'Si la casilla `Use admin privileges when installing py.exe` se puede desmarcar, desmárcala: así Python se instala solo para tu usuario.',
            'Si esa casilla está en gris, déjala como está. Pide a quien administra la computadora que escriba su contraseña.',
          ],
        },
      ],
    },
    {
      id: 'python.win.instalar',
      os: WIN,
      title: 'Instala',
      guide: { label: 'la guía oficial de Python 3.12 para Windows', url: 'https://docs.python.org/es/3.12/using/windows.html' },
      body: [
        'Haz clic en `Install Now` (instalar ahora). Si Windows pregunta si permites que la aplicación haga cambios, responde **Sí**.',
        'Espera a que la barra termine. Puede tardar unos minutos.',
        'Al final puede aparecer el botón `Disable path length limit` (quitar el límite de longitud de las rutas). No hace falta pulsarlo para este curso.',
      ],
      shot: 'win-py-installer-done',
      expect: { text: 'Una pantalla que dice `Setup was successful`. Haz clic en `Close`.' },
      fixes: [
        {
          symptom: 'El antivirus bloquea el instalador o lo borra.',
          steps: [
            'Descarga el instalador solo desde `python.org`, nunca desde otra página.',
            'Si el antivirus lo sigue bloqueando, pide ayuda a quien administra la computadora. No apagues el antivirus por tu cuenta.',
          ],
        },
      ],
    },
    {
      id: 'python.win.alias',
      os: WIN,
      title: 'Apaga el atajo de Python de la Microsoft Store',
      guide: { label: 'la guía oficial de Python 3.12 para Windows', url: 'https://docs.python.org/es/3.12/using/windows.html' },
      body: [
        'Windows trae un atajo llamado `python` que no es Python: abre la Microsoft Store. Si queda activo, puede ganarle al Python que instalaste.',
        'Abre Configuración y entra a Aplicaciones, luego a Configuración avanzada de aplicaciones y luego a **Alias de ejecución de aplicaciones**. Apaga los dos interruptores de `Instalador de aplicación` que dicen `python.exe` y `python3.exe`.',
      ],
      shot: 'win-app-aliases',
      expect: { text: 'Los interruptores de `python.exe` y `python3.exe` en «Desactivado».' },
      fixes: [
        {
          symptom: 'No encuentras «Alias de ejecución de aplicaciones».',
          steps: [
            'Abre Configuración y escribe `alias` en el buscador de arriba.',
            'Elige «Administrar alias de ejecución de aplicaciones».',
          ],
        },
      ],
    },
    {
      id: 'python.win.reabrir',
      os: WIN,
      title: 'Cierra la terminal y abre una nueva',
      body: [
        'Cierra todas las ventanas de la terminal que tengas abiertas. Luego abre una nueva, como en el paso 1.1.',
        'Una terminal lee la lista PATH una sola vez, al abrirse. Las que ya estaban abiertas no saben que Python existe.',
      ],
      expect: { text: 'Una sola ventana de terminal, recién abierta, con su prompt esperando.' },
    },
    {
      id: 'python.win.verificar',
      os: WIN,
      title: 'Pregúntale a Python su versión',
      guide: { label: 'la guía oficial de Python 3.12 para Windows', url: 'https://docs.python.org/es/3.12/using/windows.html' },
      body: [
        'En Windows, Python responde a dos nombres: `python` y `py`. El segundo es un **lanzador**, un programa pequeño que busca los Python instalados. En este curso escribirás `python`.',
      ],
      command: 'python --version',
      expect: { text: 'La versión que instalaste. Debe empezar con 3.12.', output: 'Python 3.12.10' },
      fixes: [
        {
          symptom: 'Se abre la Microsoft Store, o aparece `Python was not found; run without arguments to install from the Microsoft Store`.',
          steps: [
            'Repite el paso 2.4: el atajo de la Store sigue encendido.',
            PATH_FIX,
            'Para comprobarlo, escribe `where.exe python`. Si la primera línea contiene `WindowsApps`, la terminal sigue encontrando primero el atajo.',
          ],
        },
        {
          symptom: 'Aparece en rojo: `python : El término "python" no se reconoce…`.',
          steps: [
            PATH_FIX,
            'Prueba `py --version`. Si responde 3.12, Python está instalado pero falta en el PATH.',
            'En ese caso, abre otra vez el instalador, elige `Modify`, luego `Next`, marca `Add Python to environment variables` e instala.',
          ],
        },
        {
          symptom: 'Responde con otra versión, por ejemplo `Python 3.10.11`.',
          steps: [
            'Tienes más de un Python instalado, y la terminal encuentra primero el otro.',
            'Escribe `py --list` para verlos todos. Si no necesitas el viejo, desinstálalo desde Configuración, Aplicaciones.',
            PATH_FIX,
          ],
        },
      ],
    },
    {
      id: 'python.mac.descargar',
      os: MAC,
      title: 'Descarga el instalador de Python 3.12',
      guide: { label: 'la guía oficial de Python 3.12 para macOS', url: 'https://docs.python.org/es/3.12/using/mac.html' },
      body: [
        `Abre esta página en tu navegador: \`${PYTHON_RELEASE_URL}\`. Baja hasta la tabla **Files**, al final.`,
        'Haz clic en `macOS 64-bit universal2 installer`. Sirve para todos los Mac, con chip Intel o Apple.',
      ],
      shot: 'py-release-files',
      expect: { text: 'Un archivo llamado `python-3.12.10-macos11.pkg` en tu carpeta Descargas.' },
    },
    {
      id: 'python.mac.instalar',
      os: MAC,
      title: 'Instala',
      guide: { label: 'la guía oficial de Python 3.12 para macOS', url: 'https://docs.python.org/es/3.12/using/mac.html' },
      body: [
        'Abre el archivo descargado. Haz clic en `Continue` en cada pantalla, luego en `Agree` y al final en `Install`.',
        'El Mac te pedirá tu contraseña: es la misma con la que entras a la computadora.',
      ],
      shot: 'mac-py-installer-done',
      expect: { text: 'Una pantalla que dice `The installation was successful`. Se abre además una ventana con la carpeta `Python 3.12`.' },
      fixes: [
        {
          symptom: 'El Mac pide el usuario y la contraseña de un administrador, y tú no los tienes.',
          steps: [
            'Este instalador necesita una cuenta de administrador del Mac. Pide a quien administra la computadora que escriba sus datos.',
            'Si es una computadora del trabajo, pide ayuda a su área de soporte antes de seguir.',
          ],
        },
      ],
    },
    {
      id: 'python.mac.certificados',
      os: MAC,
      title: 'Instala los certificados',
      guide: { label: 'la guía oficial de Python 3.12 para macOS', url: 'https://docs.python.org/es/3.12/using/mac.html' },
      body: [
        'En la ventana de la carpeta `Python 3.12`, haz doble clic en `Install Certificates.command`.',
        'Los **certificados** permiten que Python compruebe que una página segura es quien dice ser. Sin ellos, descargar datos desde internet fallará más adelante.',
      ],
      shot: 'mac-py-certificates',
      expect: { text: 'Una terminal que muestra texto y termina con `[Process completed]`. Ciérrala.' },
      fixes: [
        {
          symptom: 'Cerraste la ventana de la carpeta `Python 3.12`.',
          steps: ['Abre Finder, entra a Aplicaciones y luego a la carpeta `Python 3.12`.'],
        },
      ],
    },
    {
      id: 'python.mac.reabrir',
      os: MAC,
      title: 'Cierra la terminal y abre una nueva',
      body: [
        'Cierra la terminal por completo con Command y Q. Luego ábrela otra vez, como en el paso 1.1.',
        'Una terminal lee la lista PATH una sola vez, al abrirse. La que ya estaba abierta no sabe que Python existe.',
      ],
      expect: { text: 'Una sola ventana de terminal, recién abierta, con su prompt esperando.' },
    },
    {
      id: 'python.mac.verificar',
      os: MAC,
      title: 'Pregúntale a Python su versión',
      guide: { label: 'la guía oficial de Python 3.12 para macOS', url: 'https://docs.python.org/es/3.12/using/mac.html' },
      body: [
        'En macOS, el nombre de Python en la terminal es `python3`, con el 3 al final. El nombre `python` solo no existe.',
      ],
      command: 'python3 --version',
      expect: { text: 'La versión que instalaste. Debe empezar con 3.12.', output: 'Python 3.12.10' },
      fixes: [
        {
          symptom: 'Responde `Python 3.9.6` u otra versión que no es 3.12.',
          steps: [
            'Ese es el Python que trae Apple, y la terminal lo encuentra primero.',
            'Abre la carpeta `Python 3.12` en Aplicaciones y haz doble clic en `Update Shell Profile.command`.',
            PATH_FIX,
          ],
        },
        {
          symptom: 'Aparece un aviso para instalar las «herramientas de desarrollo de línea de comandos».',
          steps: [
            'Acepta con `Install`. Git las necesita en la Parte 5, así que no pierdes nada.',
            'Cuando termine, cierra la terminal, abre una nueva y repite este paso.',
          ],
        },
      ],
    },
    {
      id: 'python.linux.verificar',
      os: LINUX,
      title: 'Pregúntale a Python su versión',
      body: [
        'Ubuntu ya trae Python. Su nombre en la terminal es `python3`, con el 3 al final.',
      ],
      command: 'python3 --version',
      expect: { text: 'Una versión que empieza con 3.12. Ubuntu 24.04 trae esta:', output: 'Python 3.12.3' },
      fixes: [
        {
          symptom: 'Responde otra versión, como `Python 3.10.12` o `Python 3.14.0`.',
          steps: [
            'Tu Ubuntu no es la 24.04. Puedes instalar Python 3.12 al lado del que ya tienes, sin tocarlo.',
            'Escribe `sudo add-apt-repository ppa:deadsnakes/ppa` y pulsa Enter. Luego escribe `sudo apt install python3.12 python3.12-venv`.',
            'Desde ahora, donde esta guía diga `python3`, tú escribe `python3.12`.',
            'Nunca desinstales ni reemplaces el `python3` que trae Ubuntu: el sistema lo necesita para funcionar.',
          ],
        },
      ],
    },
    {
      id: 'python.linux.venv',
      os: LINUX,
      title: 'Instala las piezas que Ubuntu deja fuera',
      body: [
        'Ubuntu separa en paquetes aparte dos piezas que la Sección 1 necesita: `venv` y `pip`. Instálalas con esta orden.',
        '`sudo` ejecuta la orden con permisos de administrador y te pide tu contraseña. Mientras la escribes no verás nada en pantalla. Es normal: escríbela completa y pulsa Enter.',
      ],
      command: 'sudo apt install python3-venv python3-pip',
      expect: { text: 'Una lista de paquetes. Si te pregunta `¿Desea continuar? [S/n]`, escribe `S` y pulsa Enter. Termina sin ninguna línea que empiece con `E:`.' },
    },
    {
      id: 'python.win.repl',
      os: WIN,
      title: 'Entra a Python y vuelve a salir',
      body: [
        'Escribe `python` solo y pulsa Enter. Ahora no estás hablando con la terminal, sino con Python. Esa forma de trabajar se llama **REPL**: escribes una línea y Python te responde enseguida.',
        'Escribe `2 + 2` y pulsa Enter. Luego escribe `exit()` y pulsa Enter para volver a la terminal.',
      ],
      command: 'python',
      expect: {
        text: 'Mientras estás dentro de Python, la línea empieza con `>>>`. Al salir, vuelve el prompt de la terminal.',
        output: '>>> 2 + 2\n4\n>>> exit()\nPS C:\\Users\\ana>',
      },
      fixes: [
        {
          symptom: 'Escribiste una orden de la terminal y Python respondió con `SyntaxError` o `NameError`.',
          steps: [
            'Mira el principio de la línea. Si empieza con `>>>`, estás dentro de Python, no en la terminal.',
            'Escribe `exit()` y pulsa Enter. Luego repite la orden.',
          ],
        },
      ],
    },
    {
      id: 'python.unix.repl',
      os: UNIX,
      title: 'Entra a Python y vuelve a salir',
      body: [
        'Escribe `python3` solo y pulsa Enter. Ahora no estás hablando con la terminal, sino con Python. Esa forma de trabajar se llama **REPL**: escribes una línea y Python te responde enseguida.',
        'Escribe `2 + 2` y pulsa Enter. Luego escribe `exit()` y pulsa Enter para volver a la terminal.',
      ],
      command: 'python3',
      expect: {
        text: 'Mientras estás dentro de Python, la línea empieza con `>>>`. Al salir, vuelve el prompt de la terminal.',
        output: '>>> 2 + 2\n4\n>>> exit()',
      },
      fixes: [
        {
          symptom: 'Escribiste una orden de la terminal y Python respondió con `SyntaxError` o `NameError`.',
          steps: [
            'Mira el principio de la línea. Si empieza con `>>>`, estás dentro de Python, no en la terminal.',
            'Escribe `exit()` y pulsa Enter. Luego repite la orden.',
          ],
        },
      ],
    },
  ],
}

// --- Parte 3: VS Code ----------------------------------------------------------------------------

const vscode: SetupPart = {
  id: 'vscode',
  title: 'VS Code, tu editor',
  goal: 'Al terminar esta parte tendrás una carpeta de trabajo abierta en VS Code, con la terminal dentro.',
  intro: [
    'Un **editor** es el programa donde escribes y guardas archivos de código. Usarás VS Code, un editor gratuito de Microsoft.',
    'VS Code trae su propia terminal en la parte de abajo. Se llama **terminal integrada** y funciona igual que la que ya abriste. Desde ahora escribirás tus órdenes ahí.',
    'Los menús de VS Code vienen en inglés. Esta guía los nombra en inglés y, entre paréntesis, como aparecen si instalas el paquete de idioma en español.',
  ],
  steps: [
    {
      id: 'vscode.win.instalar',
      os: WIN,
      title: 'Descarga e instala VS Code',
      guide: { label: 'la guía oficial para instalar VS Code en Windows (en inglés)', url: 'https://code.visualstudio.com/docs/setup/windows' },
      body: [
        'Abre `https://code.visualstudio.com/` y haz clic en `Download for Windows`. Abre el archivo que se descarga.',
        'Acepta el acuerdo y pulsa `Next` en cada pantalla. En `Select Additional Tasks`, deja marcada la casilla `Add to PATH`. Al final pulsa `Install`.',
      ],
      shot: 'win-vscode-tasks',
      expect: { text: 'La última pantalla del instalador, con `Launch Visual Studio Code` marcada. Pulsa `Finish`: VS Code se abre.' },
    },
    {
      id: 'vscode.mac.instalar',
      os: MAC,
      title: 'Descarga VS Code y muévelo a Aplicaciones',
      guide: { label: 'la guía oficial para instalar VS Code en macOS (en inglés)', url: 'https://code.visualstudio.com/docs/setup/mac' },
      body: [
        'Abre `https://code.visualstudio.com/` y haz clic en `Download for macOS`. Si la página te deja elegir, elige `Universal`: sirve para cualquier Mac. Se descarga una aplicación llamada `Visual Studio Code`.',
        'Abre Finder, entra a Descargas y arrastra `Visual Studio Code` a la carpeta Aplicaciones. Luego ábrela desde ahí.',
      ],
      expect: { text: 'El Mac pregunta si quieres abrir una aplicación descargada de internet. Responde `Open` (Abrir) y VS Code se abre.' },
    },
    {
      id: 'vscode.mac.code',
      os: MAC,
      title: 'Activa la orden `code`',
      guide: { label: 'la guía oficial para instalar VS Code en macOS (en inglés)', url: 'https://code.visualstudio.com/docs/setup/mac' },
      body: [
        'Pulsa Command, Shift y P a la vez. Arriba aparece la **paleta de comandos**, un buscador de todas las acciones de VS Code.',
        "Escribe `shell command` y elige `Shell Command: Install 'code' command in PATH`.",
      ],
      shot: 'mac-vscode-shell-command',
      expect: { text: 'Un aviso abajo a la derecha: `Shell command \'code\' successfully installed in PATH`.' },
    },
    {
      id: 'vscode.linux.instalar',
      os: LINUX,
      title: 'Instala VS Code',
      guide: { label: 'la guía oficial para instalar VS Code en Linux (en inglés)', url: 'https://code.visualstudio.com/docs/setup/linux' },
      body: [
        'En la terminal, escribe esta orden. Instala VS Code desde la tienda de aplicaciones de Ubuntu.',
      ],
      command: 'sudo snap install code --classic',
      expect: { text: 'Una línea que dice que `code` quedó instalado. Ábrelo desde el menú de aplicaciones.' },
    },
    {
      id: 'vscode.crear-carpeta',
      title: 'Crea tu carpeta de trabajo',
      body: [
        'Vuelve a la terminal. La orden `mkdir` crea una carpeta; su nombre va después. Esta será la carpeta de todo el curso.',
      ],
      command: 'mkdir pyarcana',
      expect: { text: 'Nada. En la terminal, una orden que termina bien a menudo no dice nada y solo vuelve el prompt.' },
      fixes: [
        {
          symptom: 'Dice que la carpeta ya existe.',
          steps: ['Ya la habías creado antes. Puedes seguir al paso siguiente.'],
        },
      ],
    },
    {
      id: 'vscode.abrir-carpeta',
      title: 'Abre la carpeta en VS Code',
      guide: { label: 'la guía oficial sobre carpetas de confianza en VS Code (en inglés)', url: 'https://code.visualstudio.com/docs/editing/workspaces/workspace-trust' },
      body: [
        'En VS Code, abre el menú `File` (Archivo) y elige `Open Folder` (Abrir carpeta). Entra a tu carpeta personal, elige `pyarcana` y confirma.',
        'VS Code pregunta si confías en los autores de los archivos. La carpeta es tuya: responde `Yes, I trust the authors`.',
      ],
      shot: 'vscode-trust',
      expect: { text: 'A la izquierda, el panel **Explorer** (Explorador) muestra `PYARCANA`, todavía vacía.' },
    },
    {
      id: 'vscode.terminal',
      title: 'Abre la terminal integrada',
      guide: { label: 'la guía oficial de la terminal integrada de VS Code (en inglés)', url: 'https://code.visualstudio.com/docs/terminal/getting-started' },
      body: [
        'Abre el menú `Terminal` y elige `New Terminal` (Nuevo terminal). Se abre un panel abajo.',
        'Escribe `pwd` y pulsa Enter. La terminal integrada ya empieza dentro de tu carpeta de trabajo.',
      ],
      command: 'pwd',
      shot: 'vscode-terminal',
      expect: { text: 'Una ruta que termina en `pyarcana`. Desde ahora, escribe todas las órdenes en esta terminal.' },
      fixes: [
        {
          symptom: 'En Mac, en la barra de arriba no aparece el menú `Terminal`.',
          steps: ['Haz clic primero en la ventana de VS Code. La barra de arriba muestra los menús de la aplicación activa.'],
        },
      ],
    },
  ],
}

// --- Parte 4: Git --------------------------------------------------------------------------------

const RESTART_VSCODE =
  'Cierra VS Code por completo y vuelve a abrirlo. Su terminal integrada lee la lista PATH cuando arranca VS Code, no cuando abres un panel nuevo.'

const git: SetupPart = {
  id: 'git',
  title: 'Git',
  goal: 'Al terminar esta parte, Git estará instalado y sabrá quién eres.',
  intro: [
    '**Git** guarda fotos de tu proyecto a lo largo del tiempo. Cada foto se llama **commit** y anota qué cambió, cuándo y quién lo hizo. Así puedes volver a cualquier versión anterior.',
    'Git no es GitHub. Git es un programa que vive en tu computadora. GitHub es la página web donde creaste tu cuenta en la Parte 4; los conectarás en la Parte 6.',
  ],
  steps: [
    {
      id: 'git.win.descargar',
      os: WIN,
      title: 'Descarga Git',
      guide: { label: 'el capítulo «Instalación de Git» del libro oficial Pro Git', url: 'https://git-scm.com/book/es/v2/Inicio---Sobre-el-Control-de-Versiones-Instalaci%C3%B3n-de-Git' },
      body: [
        'Abre `https://git-scm.com/downloads/win` y haz clic en `Click here to download` (haz clic aquí para descargar). Abre el archivo que se descarga.',
        'El instalador tiene muchas pantallas. Pulsa `Next` en todas, menos en la que explica el paso siguiente.',
      ],
      shot: 'git-win-download',
      expect: { text: 'La primera pantalla del instalador, con la licencia de Git y el botón `Next`.' },
    },
    {
      id: 'git.win.editor',
      os: WIN,
      title: 'Elige VS Code como editor de Git',
      guide: { label: 'el capítulo «Instalación de Git» del libro oficial Pro Git', url: 'https://git-scm.com/book/es/v2/Inicio---Sobre-el-Control-de-Versiones-Instalaci%C3%B3n-de-Git' },
      body: [
        'En la pantalla `Choosing the default editor used by Git`, abre la lista y elige `Use Visual Studio Code as Git\'s default editor`.',
        'El editor que viene elegido, Vim, es difícil de cerrar si nunca lo usaste. Git lo abriría cada vez que necesite que escribas un mensaje.',
      ],
      shot: 'win-git-editor',
      expect: { text: 'La lista muestra `Use Visual Studio Code as Git\'s default editor`. Pulsa `Next`.' },
      fixes: [
        {
          symptom: 'La opción de VS Code aparece en gris y no se puede elegir.',
          steps: [
            'El instalador no encontró VS Code. Elige `Use Notepad as Git\'s default editor` y sigue.',
            'Notepad es el Bloc de notas de Windows: sencillo y fácil de cerrar.',
          ],
        },
      ],
    },
    {
      id: 'git.win.instalar',
      os: WIN,
      title: 'Termina la instalación y reinicia VS Code',
      body: [
        'Sigue con `Next` hasta el botón `Install`. Cuando termine, pulsa `Finish`.',
        RESTART_VSCODE,
      ],
      expect: { text: 'VS Code abierto de nuevo, con tu carpeta `pyarcana` y la terminal integrada abajo.' },
      fixes: [
        {
          symptom: 'Windows pide la contraseña de un administrador, y tú no la tienes.',
          steps: [
            'Git se instala para toda la computadora, así que necesita ese permiso. Pide a quien administra la computadora que escriba su contraseña.',
          ],
        },
      ],
    },
    {
      id: 'git.win.verificar',
      os: WIN,
      title: 'Pregúntale a Git su versión',
      body: ['En la terminal integrada de VS Code, escribe esta orden.'],
      command: 'git --version',
      expect: { text: 'Una línea que empieza con `git version 2.` y sigue con más números. El número exacto no importa.' },
      fixes: [
        {
          symptom: 'Dice que el término `git` no se reconoce.',
          steps: [RESTART_VSCODE, 'Si sigue igual, reinicia la computadora y vuelve a probar.'],
        },
      ],
    },
    {
      id: 'git.mac.instalar',
      os: MAC,
      title: 'Instala Git con las herramientas de Apple',
      guide: { label: 'el capítulo «Instalación de Git» del libro oficial Pro Git', url: 'https://git-scm.com/book/es/v2/Inicio---Sobre-el-Control-de-Versiones-Instalaci%C3%B3n-de-Git' },
      body: [
        'En la terminal integrada, escribe esta orden. Si Git no está instalado, el Mac ofrece instalar las **herramientas de línea de comandos** de Apple, que lo incluyen.',
        'Pulsa `Install` y luego `Agree`. La descarga puede tardar más de diez minutos.',
      ],
      command: 'git --version',
      shot: 'mac-clt-prompt',
      expect: {
        text: 'Cuando termine, cierra VS Code, ábrelo y repite la orden. Debe responder con una línea que empieza con `git version 2.`.',
      },
    },
    {
      id: 'git.linux.instalar',
      os: LINUX,
      title: 'Instala Git',
      guide: { label: 'el capítulo «Instalación de Git» del libro oficial Pro Git', url: 'https://git-scm.com/book/es/v2/Inicio---Sobre-el-Control-de-Versiones-Instalaci%C3%B3n-de-Git' },
      body: ['En la terminal integrada, escribe esta orden. Luego comprueba con `git --version`.'],
      command: 'sudo apt install git',
      expect: { text: 'Al escribir `git --version`, una línea que empieza con `git version 2.`. Ubuntu 24.04 trae esta:', output: 'git version 2.43.0' },
    },
    {
      id: 'git.config.nombre',
      title: 'Dile a Git tu nombre',
      guide: { label: 'el capítulo «Configurando Git por primera vez» del libro oficial Pro Git', url: 'https://git-scm.com/book/es/v2/Inicio---Sobre-el-Control-de-Versiones-Configurando-Git-por-primera-vez' },
      body: [
        'Git firma cada commit con un nombre. Usa tu nombre real, el que pondrías en tu CV; no tiene que coincidir con tu usuario de GitHub. Cambia `Ana Quispe` por el tuyo y deja las comillas.',
      ],
      command: 'git config --global user.name "Ana Quispe"',
      expect: { text: 'Nada: vuelve el prompt. `--global` significa que esta configuración vale para todos tus proyectos.' },
    },
    {
      id: 'git.config.correo',
      title: 'Dile a Git tu correo',
      body: [
        'Usa el correo privado de GitHub que copiaste en la Parte 4, el que termina en `users.noreply.github.com`. Así GitHub reconocerá tus commits como tuyos sin publicar tu correo real.',
        'Cambia el correo de ejemplo por el tuyo y deja las comillas.',
      ],
      command: 'git config --global user.email "123456789+ana-quispe@users.noreply.github.com"',
      expect: { text: 'Nada: vuelve el prompt.' },
    },
    {
      id: 'git.config.rama',
      title: 'Llama `main` a la rama principal',
      body: [
        'Una **rama** es una línea de historia dentro de un proyecto. GitHub llama `main` a la principal; con esta orden, Git usará el mismo nombre en tu computadora.',
      ],
      command: 'git config --global init.defaultBranch main',
      expect: { text: 'Nada: vuelve el prompt.' },
    },
    {
      id: 'git.config.editor',
      title: 'Elige VS Code como editor de Git',
      os: UNIX,
      body: [
        'Git abre un editor cuando necesita que escribas un mensaje. El que trae por defecto es difícil de cerrar si nunca lo usaste. Con esta orden abrirá VS Code.',
      ],
      command: 'git config --global core.editor "code --wait"',
      expect: { text: 'Nada: vuelve el prompt.' },
    },
    {
      id: 'git.win.autocrlf',
      os: WIN,
      title: 'Revisa los finales de línea',
      body: [
        'Windows marca el final de cada línea de texto distinto que macOS y Linux. Git puede convertirlos solo, para que un archivo no parezca cambiado entero.',
        'El instalador ya lo activó. Esta orden lo confirma.',
      ],
      command: 'git config --get core.autocrlf',
      expect: { text: 'La palabra `true`.', output: 'true' },
      fixes: [
        {
          symptom: 'No responde nada, o responde `false`.',
          steps: ['Escribe `git config --global core.autocrlf true` y pulsa Enter.'],
        },
      ],
    },
    {
      id: 'git.config.revisar',
      title: 'Revisa lo que configuraste',
      body: ['Esta orden lista toda tu configuración de Git. Busca en ella tu nombre y tu correo.'],
      command: 'git config --global --list',
      expect: {
        text: 'Tus datos, entre otras líneas. Si la lista no cabe en la ventana y abajo ves `:`, pulsa la tecla Q para salir.',
        output: 'user.name=Ana Quispe\nuser.email=123456789+ana-quispe@users.noreply.github.com\ninit.defaultbranch=main',
      },
      fixes: [
        {
          symptom: 'Tu nombre o tu correo tienen un error.',
          steps: ['Repite la orden del paso del nombre o del correo con el dato correcto. La nueva reemplaza a la anterior.'],
        },
      ],
    },
  ],
}

// --- Parte 5: la cuenta de GitHub ----------------------------------------------------------------

const github: SetupPart = {
  id: 'github',
  title: 'Tu cuenta de GitHub',
  goal: 'Al terminar esta parte tendrás una cuenta de GitHub protegida con tu celular.',
  intro: [
    '**GitHub** es una página web que guarda copias de proyectos de Git. Muchas empresas revisan el GitHub de quien postula a un puesto, así que esta cuenta formará parte de tu CV.',
    'La cuenta es gratuita. Esta parte se hace en el navegador, no en la terminal.',
  ],
  steps: [
    {
      id: 'github.usuario',
      title: 'Elige tu nombre de usuario',
      body: [
        'Tu usuario aparecerá en cada enlace a tus proyectos. Elige uno que puedas poner en un CV: tu nombre y apellido, por ejemplo `ana-quispe` o `aquispe-datos`.',
        'Solo admite letras, números y guiones sueltos, hasta 39 caracteres. Evita apodos y años de nacimiento.',
      ],
      expect: { text: 'Un usuario anotado en un papel o en tus notas, listo para el paso siguiente.' },
      fixes: [
        {
          symptom: 'El usuario que querías ya está ocupado.',
          steps: ['Añade tu segundo apellido o una palabra de tu campo, como `datos` o `py`. Evita números al azar.'],
        },
      ],
    },
    {
      id: 'github.registro',
      title: 'Crea la cuenta',
      guide: { label: 'la guía oficial de GitHub para crear una cuenta', url: 'https://docs.github.com/es/account-and-profile/how-tos/account-management/creating-an-account-on-github' },
      body: [
        'Abre `https://github.com/signup`. Escribe tu correo, una contraseña y el usuario que elegiste.',
        'Luego GitHub te pide resolver un pequeño acertijo, para comprobar que eres una persona.',
      ],
      shot: 'gh-signup-form',
      expect: { text: 'Una pantalla que pide un código enviado a tu correo.' },
    },
    {
      id: 'github.correo',
      title: 'Confirma tu correo',
      body: [
        'Abre tu correo. GitHub te envió un mensaje con un código. Escríbelo en la página de GitHub.',
      ],
      expect: { text: 'Entras a GitHub con tu cuenta nueva.' },
      fixes: [
        {
          symptom: 'El correo no llega.',
          steps: ['Espera cinco minutos y revisa la carpeta de correo no deseado, o spam.', 'Si sigue sin llegar, pide en la misma página que te lo envíen otra vez.'],
        },
      ],
    },
    {
      id: 'github.2fa',
      title: 'Activa la verificación en dos pasos',
      guide: { label: 'la guía oficial de GitHub sobre la verificación en dos pasos', url: 'https://docs.github.com/es/authentication/securing-your-account-with-two-factor-authentication-2fa/configuring-two-factor-authentication' },
      body: [
        'La **verificación en dos pasos** pide, además de tu contraseña, un código que solo aparece en tu celular. GitHub la exige en cuanto empiezas a contribuir código, y la recomienda a todos. Actívala desde hoy.',
        'Instala en tu celular una aplicación de códigos, como Microsoft Authenticator o Google Authenticator. Luego, en GitHub, abre tu foto arriba a la derecha y entra a `Settings`.',
        'Elige `Password and authentication` y luego `Enable two-factor authentication`. Escanea con el celular el código cuadrado que aparece, y escribe en GitHub los seis números que te muestra la aplicación.',
      ],
      shot: 'gh-2fa-setup',
      expect: { text: 'GitHub te muestra tus **códigos de recuperación**. No cierres esa pantalla: el paso siguiente los guarda.' },
      fixes: [
        {
          symptom: 'No tienes un celular donde instalar una aplicación de códigos.',
          steps: [
            'GitHub no envía estos códigos por SMS a números de Perú, así que hace falta una aplicación.',
            'Usa una aplicación de códigos para computadora o una extensión del navegador que genere códigos de seis números.',
            'En la pantalla del código cuadrado, haz clic en `setup key`: te da una clave para escribirla en esa aplicación en lugar de escanear.',
          ],
        },
      ],
    },
    {
      id: 'github.recuperacion',
      title: 'Guarda tus códigos de recuperación',
      body: [
        'Los códigos de recuperación te dejan entrar si pierdes el celular. Sin ellos ni el celular, ni GitHub puede devolverte la cuenta.',
        'Pulsa `Download` y guarda el archivo en un lugar seguro, fuera de esta computadora. Por ejemplo, imprímelo o guárdalo en tu nube personal.',
      ],
      expect: { text: 'Un archivo `github-recovery-codes.txt` guardado en un lugar que encontrarás dentro de un año.' },
    },
    {
      id: 'github.correo-privado',
      title: 'Copia tu correo privado de GitHub',
      guide: { label: 'la guía oficial de GitHub sobre el correo de tus commits', url: 'https://docs.github.com/es/account-and-profile/how-tos/email-preferences/setting-your-commit-email-address' },
      body: [
        'Cada commit lleva un correo, y en GitHub cualquiera puede leerlo. GitHub te da una dirección privada para usar en su lugar.',
        'En `Settings`, entra a `Emails`. Marca `Keep my email addresses private` si no está marcada. Debajo aparece tu dirección privada: cópiala y pégala en un archivo de notas.',
      ],
      shot: 'gh-noreply-email',
      expect: { text: 'Una dirección parecida a `123456789+ana-quispe@users.noreply.github.com`. La usarás en la Parte 5.' },
    },
  ],
}

// --- Parte 6: conectar y primer push ---------------------------------------------------------------

const RELOGIN = [
  'Escribe `gh auth login` y repite el paso de iniciar sesión.',
  'Cuando pregunte el protocolo, elige `HTTPS`. Cuando pregunte si autentica Git, responde `Y`.',
]

const conectar: SetupPart = {
  id: 'conectar',
  title: 'Tu primer proyecto, de tu computadora a GitHub',
  goal: 'Al terminar esta parte habrás guardado tu primer commit en tu computadora y lo habrás publicado en GitHub.',
  intro: [
    'Primero trabajarás solo en tu computadora: crearás un proyecto de práctica y guardarás tu primer commit. Eso no necesita internet ni cuenta.',
    'Después lo publicarás. GitHub no acepta tu contraseña desde la terminal; pide una **credencial**, una llave que identifica a tu computadora y que puedes revocar cuando quieras. La herramienta `gh`, de GitHub, consigue esa credencial por ti a través del navegador.',
    'Si la computadora es compartida, recuerda que la credencial queda guardada en ella. Quien la use después entraría a GitHub como tú. Al terminar, escribe `gh auth logout`.',
    'Git responde en el idioma de tu sistema. Si lo ves en español, cada paso te dice también qué frase buscar.',
  ],
  figure: 'setup-local-remote',
  steps: [
    {
      id: 'conectar.carpeta',
      title: 'Crea la carpeta del proyecto',
      body: [
        'En la terminal integrada de VS Code, que ya está en tu carpeta `pyarcana`, crea una carpeta para practicar.',
      ],
      command: 'mkdir practica-pyarcana',
      expect: { text: 'Nada: vuelve el prompt. En el panel **Explorer** aparece `practica-pyarcana`.' },
    },
    {
      id: 'conectar.entrar',
      title: 'Entra a la carpeta del proyecto',
      body: ['La orden `cd` mueve la terminal a otra carpeta. Llévala a la que acabas de crear.'],
      command: 'cd practica-pyarcana',
      expect: { text: 'El prompt ahora termina en `practica-pyarcana`.' },
    },
    {
      id: 'conectar.init',
      title: 'Convierte la carpeta en un repositorio',
      body: [
        'Un **repositorio** es una carpeta cuya historia sigue Git. `git init` prepara esa historia dentro de la carpeta. No publica nada en internet.',
      ],
      command: 'git init',
      expect: {
        text: 'Una línea que confirma el repositorio nuevo. En español dice `Inicializado repositorio Git vacío`.',
        output: 'Initialized empty Git repository in …/practica-pyarcana/.git/',
      },
      fixes: [
        {
          symptom: 'Dice `Reinitialized existing Git repository`.',
          steps: ['Ya habías hecho este paso. No pasa nada: sigue con el siguiente.'],
        },
      ],
    },
    {
      id: 'conectar.readme',
      title: 'Crea el archivo README.md',
      body: [
        'Un **README** es el archivo que GitHub muestra como portada de un proyecto. En el panel **Explorer**, haz clic derecho sobre `practica-pyarcana` y elige `New File` (Nuevo archivo). Llámalo `README.md`.',
        'Escribe dos líneas, por ejemplo `# Práctica PyArcana` y `Hola, soy Ana y empiezo PyArcana.` Guarda con Ctrl y S, o con Command y S en Mac.',
      ],
      expect: { text: 'En la pestaña del archivo desaparece el punto blanco que indica cambios sin guardar.' },
      fixes: [
        {
          symptom: 'El archivo quedó fuera de `practica-pyarcana`.',
          steps: ['Arrástralo en el **Explorer** hasta dentro de la carpeta `practica-pyarcana`.'],
        },
      ],
    },
    {
      id: 'conectar.status',
      title: 'Pregúntale a Git qué hay de nuevo',
      body: ['`git status` compara tus archivos con el último commit y te dice qué cambió.'],
      command: 'git status',
      expect: {
        text: 'Git ve el archivo, pero todavía no lo sigue. En español dice `No hay commits todavía` y `Archivos sin seguimiento`.',
        output: 'On branch main\n\nNo commits yet\n\nUntracked files:\n  (use "git add <file>..." to include in what will be committed)\n\tREADME.md',
      },
      fixes: [
        {
          symptom: 'Dice `fatal: not a git repository`.',
          steps: ['La terminal no está en la carpeta del proyecto. Repite el paso de `cd practica-pyarcana`.'],
        },
        {
          symptom: 'No aparece `README.md`.',
          steps: ['El archivo está en otra carpeta o no se guardó. Revisa el paso anterior.'],
        },
      ],
    },
    {
      id: 'conectar.add',
      title: 'Elige el archivo que irá en el commit',
      body: [
        '`git add` marca qué archivos entran en la próxima foto. Así puedes guardar algunos cambios y dejar otros para después.',
      ],
      command: 'git add README.md',
      expect: { text: 'Nada: vuelve el prompt. Si repites `git status`, verás `README.md` bajo `Changes to be committed` (en español, `Cambios a ser confirmados`).' },
    },
    {
      id: 'conectar.commit',
      title: 'Guarda la foto con un mensaje',
      body: [
        '`git commit` crea el commit. Lo que va entre comillas después de `-m` es el mensaje: una frase corta que dice qué cambiaste.',
        'Este commit ya existe en tu computadora, aunque todavía no esté en GitHub.',
      ],
      command: 'git commit -m "Mi primer commit"',
      expect: {
        text: 'Una línea con el mensaje y un resumen. El código de siete letras y números será otro en tu caso.',
        output: '[main (root-commit) 3171ea7] Mi primer commit\n 1 file changed, 3 insertions(+)\n create mode 100644 README.md',
      },
      fixes: [
        {
          symptom: 'Dice `Author identity unknown` o `Please tell me who you are` (en español, `Identidad del autor desconocido`).',
          steps: ['Git no tiene tu nombre o tu correo. Repite los pasos de la Parte 5 que los configuran, y luego este.'],
        },
        {
          symptom: 'Dice `[master (root-commit)…` en lugar de `main`.',
          steps: [
            'Falta el paso de la Parte 5 que llama `main` a la rama principal. Hazlo ahora.',
            'Luego escribe `git branch -m main` para renombrar la rama de este proyecto.',
          ],
        },
      ],
    },
    {
      id: 'conectar.win.gh',
      os: WIN,
      title: 'Instala la herramienta `gh`',
      body: [
        'En la terminal integrada, escribe esta orden. `winget` es el instalador de programas que trae Windows.',
        'La primera vez te pide aceptar unos términos: escribe `Y` y pulsa Enter.',
      ],
      command: 'winget install --id GitHub.cli -e',
      expect: { text: 'Una línea que dice `Instalado correctamente` o `Successfully installed`. Luego cierra VS Code y ábrelo de nuevo.' },
      fixes: [
        {
          symptom: 'Dice que `winget` no se reconoce.',
          steps: [
            'Abre `https://cli.github.com/` y pulsa `Download for Windows`. Abre el archivo e instálalo con las opciones que trae.',
            RESTART_VSCODE,
          ],
        },
      ],
    },
    {
      id: 'conectar.mac.gh',
      os: MAC,
      title: 'Instala la herramienta `gh`',
      body: [
        'Abre `https://cli.github.com/` y pulsa `Download for Mac`. Abre el archivo que se descarga y sigue el instalador con `Continue` e `Install`.',
        RESTART_VSCODE,
      ],
      expect: { text: 'Una pantalla del instalador que dice `The installation was successful`.' },
    },
    {
      id: 'conectar.linux.gh',
      os: LINUX,
      title: 'Instala la herramienta `gh`',
      body: ['En la terminal integrada, escribe esta orden.'],
      command: 'sudo apt install gh',
      expect: { text: 'La instalación termina sin ninguna línea que empiece con `E:`.' },
    },
    {
      id: 'conectar.gh-version',
      title: 'Comprueba que `gh` responde',
      body: ['Igual que con Python y Git, pregúntale su versión.'],
      command: 'gh --version',
      expect: { text: 'Una línea que empieza con `gh version` y sigue con números y una fecha. El número exacto no importa.' },
      fixes: [{ symptom: 'Dice que `gh` no se reconoce o `command not found`.', steps: [RESTART_VSCODE] }],
    },
    {
      id: 'conectar.login',
      title: 'Inicia sesión en GitHub desde la terminal',
      guide: { label: 'la guía oficial de inicio rápido de GitHub CLI', url: 'https://docs.github.com/es/github-cli/github-cli/quickstart' },
      body: [
        'Escribe esta orden. Te hará cuatro preguntas en inglés; muévete con las flechas y confirma con Enter.',
        'Responde así: `GitHub.com`, luego `HTTPS`, luego `Y` y luego `Login with a web browser`.',
        'Copia el código de ocho caracteres que aparece y pulsa Enter. En el navegador, pega el código y pulsa `Authorize github`.',
      ],
      command: 'gh auth login',
      shot: 'gh-device-code',
      expect: { text: 'De vuelta en la terminal, una línea con tu usuario.', output: '✓ Authentication complete.\n✓ Configured git protocol\n✓ Logged in as ana-quispe' },
      fixes: [
        {
          symptom: 'El navegador no se abre solo.',
          steps: ['Abre tú mismo `https://github.com/login/device` y pega ahí el código.'],
        },
        {
          symptom: 'Elegiste `SSH` por error.',
          steps: RELOGIN,
        },
        {
          symptom: 'Aparece `! Authentication credentials saved in plain text`.',
          steps: [
            'Tu sistema no tiene dónde guardar la credencial con llave, así que `gh` la dejó en un archivo de texto.',
            'Funciona igual. Pero si alguien más usa esta computadora, escribe `gh auth logout` al terminar cada sesión de estudio.',
          ],
        },
      ],
    },
    {
      id: 'conectar.publicar',
      title: 'Publica tu proyecto en GitHub',
      body: [
        'Esta orden crea el repositorio en tu cuenta de GitHub y le envía tu commit. `--source .` significa «a partir de esta carpeta», y `--push` significa «envía los commits».',
        '`--public` lo deja visible en tu perfil. Si prefieres que solo tú lo veas, cambia esa palabra por `--private`.',
      ],
      command: 'gh repo create practica-pyarcana --public --source . --push',
      expect: {
        text: 'Tres líneas con el visto bueno: el repositorio creado, el **remoto** (la dirección del repositorio en GitHub) y el envío de tus commits.',
        output: '✓ Created repository ana-quispe/practica-pyarcana on github.com\n  https://github.com/ana-quispe/practica-pyarcana\n✓ Added remote https://github.com/ana-quispe/practica-pyarcana.git\n✓ Pushed commits to https://github.com/ana-quispe/practica-pyarcana.git',
      },
      fixes: [
        {
          symptom: 'Dice `current directory is not a git repository`.',
          steps: ['La terminal no está en la carpeta del proyecto. Escribe `cd practica-pyarcana` y repite este paso.'],
        },
        {
          symptom: 'Dice `Name already exists on this account`.',
          steps: [
            'Ya tienes un repositorio con ese nombre, quizá de un intento anterior. Usa otro, por ejemplo `practica-pyarcana-2`.',
            'Escribe ese mismo nombre en los pasos siguientes.',
          ],
        },
        {
          symptom: 'Dice `Password authentication is not supported` o te pide usuario y contraseña.',
          steps: ['Git no está usando la credencial de `gh`. Escribe `gh auth setup-git` y pulsa Enter.', 'Luego escribe `git push -u origin main`.'],
        },
        {
          symptom: 'Dice `Permission denied (publickey)`.',
          steps: [...RELOGIN, 'Luego escribe `git push -u origin main`.'],
        },
        {
          symptom: 'Dice `GH007: Your push would publish a private email address`.',
          steps: [
            'Git firmó el commit con tu correo real. Repite el paso del correo en la Parte 5 con tu dirección privada.',
            'Escribe `git commit --amend --reset-author --no-edit` para volver a firmar el commit. Luego escribe `git push -u origin main`.',
          ],
        },
      ],
    },
    {
      id: 'conectar.ver',
      title: 'Mira tu proyecto en GitHub',
      body: ['Esta orden abre la página del proyecto en tu navegador.'],
      command: 'gh repo view --web',
      expect: { text: 'La página de `practica-pyarcana` en GitHub, con tu README debajo de la lista de archivos.' },
    },
    {
      id: 'conectar.clonar',
      title: 'Descarga una copia desde GitHub',
      body: [
        '**Clonar** es descargar un repositorio de GitHub con toda su historia. Es lo que harás con cada proyecto que no empieces tú. Además, comprueba que GitHub guardó tu commit.',
        'La primera orden sube a la carpeta `pyarcana`. La segunda descarga tu proyecto en una carpeta nueva llamada `practica-copia`.',
      ],
      command: 'cd ..\ngh repo clone practica-pyarcana practica-copia',
      expect: {
        text: 'Git descarga la copia. En español dice `Clonando en`. En el **Explorer** aparece `practica-copia`, con tu `README.md` dentro.',
        output: "Cloning into 'practica-copia'...",
      },
      fixes: [
        {
          symptom: 'Dice `Could not resolve to a Repository`.',
          steps: ['El nombre no coincide con el de tu repositorio. Escribe el que usaste al publicarlo.'],
        },
      ],
    },
  ],
}

// --- Parte 7: comprobación final -----------------------------------------------------------------

const final: SetupPart = {
  id: 'final',
  title: 'La comprobación final',
  goal: 'Al terminar esta parte sabrás que cada pieza responde, y llegarás a la Sección 1 sin pendientes.',
  intro: [
    'Una pieza puede haberse instalado bien y dejar de responder después, por ejemplo tras una actualización. Esta comprobación revisa todas a la vez. Repítela siempre que algo falle.',
  ],
  steps: [
    {
      id: 'final.win.comprobar',
      os: WIN,
      title: 'Pide a cada pieza que responda',
      body: [
        'Cierra VS Code y ábrelo de nuevo. En la terminal integrada, copia estas cuatro órdenes y pégalas juntas: se ejecutan una tras otra.',
      ],
      command: 'python --version\ngit --version\ngh auth status\ncode --version',
      expect: {
        text: 'Cuatro respuestas, sin ninguna línea en rojo. Donde ves `…` irán números que pueden variar. El de Python debe empezar con 3.12.',
        output: 'Python 3.12.10\ngit version 2.….windows.1\ngithub.com\n  ✓ Logged in to github.com account ana-quispe (keyring)\n  …\n1.…',
      },
      fixes: [
        { symptom: 'Falla `python`.', steps: ['Vuelve a la Parte 2 y repite el paso de pedirle a Python su versión.'] },
        { symptom: 'Falla `git`.', steps: ['Vuelve a la Parte 5.'] },
        { symptom: 'Falla `gh auth status`.', steps: ['Vuelve a la Parte 6 y repite el paso de iniciar sesión.'] },
        { symptom: 'Falla `code`.', steps: ['Vuelve a instalar VS Code y deja marcada la casilla `Add to PATH`.', RESTART_VSCODE] },
      ],
    },
    {
      id: 'final.unix.comprobar',
      os: UNIX,
      title: 'Pide a cada pieza que responda',
      body: [
        'Cierra VS Code y ábrelo de nuevo. En la terminal integrada, copia estas cuatro órdenes y pégalas juntas: se ejecutan una tras otra.',
      ],
      command: 'python3 --version\ngit --version\ngh auth status\ncode --version',
      expect: {
        text: 'Cuatro respuestas, sin ningún `command not found`. Donde ves `…` irán números que pueden variar. El de Python debe empezar con 3.12.',
        output: 'Python 3.12.…\ngit version 2.…\ngithub.com\n  ✓ Logged in to github.com account ana-quispe (keyring)\n  …\n1.…',
      },
      fixes: [
        { symptom: 'Falla `python3`.', steps: ['Vuelve a la Parte 2 y repite el paso de pedirle a Python su versión.'] },
        { symptom: 'Falla `git`.', steps: ['Vuelve a la Parte 5.'] },
        { symptom: 'Falla `gh auth status`.', steps: ['Vuelve a la Parte 6 y repite el paso de iniciar sesión.'] },
        {
          symptom: 'Falla `code`.',
          steps: ['En Mac, repite el paso de activar la orden `code` en la Parte 3.', 'En Linux, repite la instalación de VS Code.', RESTART_VSCODE],
        },
      ],
    },
  ],
}

export const SETUP_PARTS: readonly SetupPart[] = [terminal, python, vscode, github, git, conectar, final]

/** The steps of one part that apply to one system, in order. */
export function stepsFor(part: SetupPart, os: SetupOs): SetupStep[] {
  return part.steps.filter((s) => !s.os || s.os.includes(os))
}

/** Every step id one learner on one system can tick: the denominator of the progress line. */
export function setupStepIds(os: SetupOs): string[] {
  return SETUP_PARTS.flatMap((p) => stepsFor(p, os).map((s) => s.id))
}

// --- Screenshots ---------------------------------------------------------------------------------

/**
 * Every screenshot the page asks for. `alt` and `caption` are learner-facing; `brief` tells
 * whoever takes it what must be on screen. None exists yet (PLAN.md, MUST items): the browser
 * pages were unreachable from the build sandbox, and installer screens need a real Windows or Mac.
 */
export const SETUP_SHOTS: readonly ShotSpec[] = [
  {
    id: 'win-terminal-open',
    os: 'windows',
    source: 'owner-capture',
    brief: 'Windows 11, Terminal de Windows recién abierta con PowerShell, prompt «PS C:\\Users\\<usuario>>» visible. Recuadro en el prompt.',
    alt: 'Ventana de Terminal de Windows con fondo oscuro. Arriba, una pestaña que dice Windows PowerShell. Dentro, la línea PS C:\\Users\\ana> con el cursor parpadeando.',
    caption: 'La terminal recién abierta. La línea que termina en > es el prompt.',
  },
  {
    id: 'mac-terminal-open',
    os: 'macos',
    source: 'owner-capture',
    brief: 'macOS, Terminal recién abierta, prompt «usuario@equipo ~ %». Recuadro en el prompt.',
    alt: 'Ventana de Terminal de macOS. En la primera línea, ana@MacBook-Air ~ % y el cursor.',
    caption: 'La terminal recién abierta. La línea que termina en % es el prompt.',
  },
  {
    id: 'py-release-files',
    os: 'any',
    source: 'browser-script',
    url: PYTHON_RELEASE_URL,
    selector: 'table',
    brief: 'Página de la versión 3.12.10 en python.org, desplazada hasta la tabla Files. Recuadro en la tabla.',
    alt: 'Tabla Files de la página de Python 3.12.10 en python.org. Sus filas incluyen macOS 64-bit universal2 installer, Windows installer (64-bit) y Windows installer (ARM64).',
    caption: 'La tabla Files, al final de la página. Elige la fila de tu sistema.',
  },
  {
    id: 'win-py-installer-path',
    os: 'windows',
    source: 'owner-capture',
    brief: 'Primera pantalla del instalador python-3.12.10-amd64.exe, con «Add python.exe to PATH» MARCADA. Recuadro en esa casilla.',
    alt: 'Primera pantalla del instalador de Python 3.12.10 para Windows. Arriba, el botón Install Now. Abajo, dos casillas: Use admin privileges when installing py.exe, y Add python.exe to PATH, que está marcada y resaltada.',
    caption: 'La casilla Add python.exe to PATH, marcada. Viene desmarcada: es el clic que más se olvida.',
  },
  {
    id: 'win-py-installer-done',
    os: 'windows',
    source: 'owner-capture',
    brief: 'Pantalla final del instalador de Python 3.12.10: «Setup was successful». Recuadro en el botón Close.',
    alt: 'Pantalla final del instalador de Python para Windows con el título Setup was successful y el botón Close abajo a la derecha.',
    caption: 'La instalación terminó bien. Cierra el instalador.',
  },
  {
    id: 'win-app-aliases',
    os: 'windows',
    source: 'owner-capture',
    brief: 'Windows 11, Configuración > Aplicaciones > Configuración avanzada de aplicaciones > Alias de ejecución de aplicaciones, en español, con python.exe y python3.exe DESACTIVADOS. Recuadro en ambos.',
    alt: 'Pantalla Alias de ejecución de aplicaciones en la Configuración de Windows. Dos filas de Instalador de aplicación, python.exe y python3.exe, con sus interruptores en Desactivado.',
    caption: 'Los dos atajos de Python apagados. Así, escribir python ya no abre la Microsoft Store.',
  },
  {
    id: 'mac-py-installer-done',
    os: 'macos',
    source: 'owner-capture',
    brief: 'Instalador de Python 3.12.10 en macOS, pantalla «The installation was successful», con la carpeta Python 3.12 abierta detrás mostrando Install Certificates.command. Recuadro en ese archivo.',
    alt: 'Instalador de Python en macOS con el mensaje The installation was successful. Detrás, la carpeta Python 3.12 con los archivos IDLE, Install Certificates.command y Update Shell Profile.command.',
    caption: 'Al terminar, se abre la carpeta Python 3.12. El siguiente paso usa el archivo Install Certificates.command.',
  },
  {
    id: 'mac-py-certificates',
    os: 'macos',
    source: 'owner-capture',
    brief: 'macOS, carpeta Python 3.12 abierta y la Terminal que abrió Install Certificates.command, terminada en [Process completed]. Recuadro en esa última línea.',
    alt: 'En un Mac, la carpeta Python 3.12 con el archivo Install Certificates.command. Delante, una ventana de Terminal que instala certifi y termina con la línea [Process completed], resaltada.',
    caption: 'Al terminar, la ventana dice [Process completed]. Ya puedes cerrarla.',
  },
  {
    id: 'win-vscode-tasks',
    os: 'windows',
    source: 'owner-capture',
    brief: 'Instalador de VS Code para Windows, pantalla «Select Additional Tasks», con «Add to PATH» marcada. Recuadro en esa casilla.',
    alt: 'Pantalla Select Additional Tasks del instalador de VS Code. La casilla Add to PATH (requires shell restart) está marcada y resaltada.',
    caption: 'Deja marcada Add to PATH. Así la terminal reconocerá la orden code.',
  },
  {
    id: 'mac-vscode-shell-command',
    os: 'macos',
    source: 'owner-capture',
    brief: 'VS Code en macOS con la paleta de comandos abierta, texto «shell command», opción «Shell Command: Install \'code\' command in PATH» seleccionada. Recuadro en la opción.',
    alt: 'Paleta de comandos de VS Code abierta arriba, con el texto shell command. La primera opción, Shell Command: Install code command in PATH, está resaltada.',
    caption: 'La paleta de comandos encuentra la acción mientras escribes.',
  },
  {
    id: 'vscode-trust',
    os: 'any',
    source: 'owner-capture',
    brief: 'VS Code al abrir la carpeta pyarcana: diálogo «Do you trust the authors of the files in this folder?». Recuadro en «Yes, I trust the authors».',
    alt: 'Diálogo de VS Code que pregunta Do you trust the authors of the files in this folder. Abajo, dos botones: Yes, I trust the authors, resaltado, y No, I don\'t trust the authors.',
    caption: 'La carpeta es tuya: confía en ella.',
  },
  {
    id: 'vscode-terminal',
    os: 'any',
    source: 'owner-capture',
    brief: 'VS Code con la carpeta pyarcana abierta y la terminal integrada abajo, después de escribir pwd. Recuadro en el panel de la terminal.',
    alt: 'Ventana de VS Code. A la izquierda, el panel Explorer con la carpeta PYARCANA. Abajo, el panel Terminal con la orden pwd y una ruta que termina en pyarcana.',
    caption: 'La terminal integrada empieza dentro de tu carpeta de trabajo.',
  },
  {
    id: 'git-win-download',
    os: 'windows',
    source: 'browser-script',
    url: 'https://git-scm.com/downloads/win',
    // The page's own id for its main link (git/git-scm.com content/install/windows.html, read 6 Oct 2026).
    selector: '#auto-download-link',
    brief: 'Página de descarga de Git para Windows en git-scm.com. Recuadro en el enlace «Click here to download».',
    alt: 'Página de descarga de Git para Windows en git-scm.com. Resaltado, el enlace Click here to download, que baja la versión x64 más reciente de Git for Windows.',
    caption: 'El enlace del instalador para la mayoría de computadoras con Windows.',
  },
  {
    id: 'win-git-editor',
    os: 'windows',
    source: 'owner-capture',
    brief: 'Instalador de Git para Windows, pantalla «Choosing the default editor used by Git», con «Use Visual Studio Code as Git\'s default editor» elegido. Recuadro en la lista.',
    alt: 'Pantalla Choosing the default editor used by Git del instalador de Git. La lista desplegable muestra Use Visual Studio Code as Git\'s default editor.',
    caption: 'Cambia el editor de Git a VS Code antes de pulsar Next.',
  },
  {
    id: 'mac-clt-prompt',
    os: 'macos',
    source: 'owner-capture',
    brief: 'macOS, aviso del sistema tras escribir git --version: «The "git" command requires the command line developer tools…», en español si el Mac está en español. Recuadro en Install.',
    alt: 'Aviso de macOS que dice que la orden git necesita las herramientas de desarrollo de línea de comandos y pregunta si quieres instalarlas. Botones: Get Xcode, Not Now e Install, resaltado.',
    caption: 'Elige Install, no Get Xcode: Xcode completo pesa muchos gigas y no lo necesitas.',
  },
  {
    id: 'gh-signup-form',
    os: 'any',
    source: 'browser-script',
    url: 'https://github.com/signup',
    selector: 'form',
    brief: 'Formulario de registro de github.com/signup, vacío. Recuadro en el formulario.',
    alt: 'Formulario de registro de GitHub con campos para correo, contraseña y nombre de usuario, y un botón para continuar.',
    caption: 'El formulario de registro de GitHub.',
  },
  {
    id: 'gh-2fa-setup',
    os: 'any',
    source: 'owner-capture',
    brief: 'github.com, Settings > Password and authentication > Enable two-factor authentication, pantalla con el código QR (tapado o de una cuenta de prueba). Recuadro en el QR y el campo del código.',
    alt: 'Página de GitHub para activar la verificación en dos pasos. Muestra un código QR para escanear con la aplicación del celular y un campo para escribir el código de seis números.',
    caption: 'Escanea el código con la aplicación del celular y escribe los seis números que te muestra.',
  },
  {
    id: 'gh-noreply-email',
    os: 'any',
    source: 'owner-capture',
    brief: 'github.com, Settings > Emails, con «Keep my email addresses private» marcada y la dirección noreply visible (de una cuenta de prueba). Recuadro en la casilla y la dirección.',
    alt: 'Página Emails de la configuración de GitHub. La casilla Keep my email addresses private está marcada, y debajo aparece una dirección que termina en users.noreply.github.com.',
    caption: 'Tu dirección privada aparece debajo de la casilla. Esa es la que le darás a Git.',
  },
  {
    id: 'gh-device-code',
    os: 'any',
    source: 'owner-capture',
    brief: 'Navegador en github.com/login/device tras gh auth login, con el campo para el código de ocho caracteres. Recuadro en el campo.',
    alt: 'Página Device Activation de GitHub con ocho casillas para escribir el código que mostró la terminal y un botón Continue.',
    caption: 'Pega aquí el código de ocho caracteres que te dio la terminal.',
  },
]
