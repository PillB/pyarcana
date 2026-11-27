export interface LearningCheck {
  question: string
  options: readonly string[]
  correct: number
  explanation: string
  /** One misconception-specific explanation per option; the correct option uses explanation. */
  feedback: readonly string[]
  practice?: { task: string; evidence: string }
}
export function checkAnswer(check: LearningCheck, selected: number | null): 'unanswered' | 'incorrect' | 'correct' {
  if (selected === null || !Number.isInteger(selected) || selected < 0 || selected >= check.options.length) return 'unanswered'
  return selected === check.correct ? 'correct' : 'incorrect'
}
export function answerFeedback(check: LearningCheck, selected: number | null): string {
  const result = checkAnswer(check, selected)
  if (result === 'unanswered' || selected === null) return ''
  return result === 'correct' ? check.explanation : check.feedback[selected]
}
/** Fisher-Yates over option identities; answer keys and feedback never depend on visual position. */
export function shuffledOptions(length: number, random: () => number = Math.random): number[] {
  const order = Array.from({ length }, (_, i) => i)
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[order[i], order[j]] = [order[j], order[i]]
  }
  return order
}
export const SETUP_CHECKS: Readonly<Record<string, LearningCheck>> = {
  "terminal": {
    "question": "Abres una terminal nueva. ¿Cómo sabes en qué carpeta se crearán los archivos?",
    "options": [
      "Consultas la ruta de la carpeta actual.",
      "Consultas la versión del intérprete.",
      "Consultas la lista de aplicaciones."
    ],
    "correct": 0,
    "explanation": "La ruta de trabajo indica dónde actúan las órdenes relativas.",
    "feedback": [
      "",
      "La versión identifica el programa, no la carpeta.",
      "Las aplicaciones instaladas no identifican la ubicación de trabajo."
    ],
    "practice": {
      "task": "Abre otra terminal, predice si parte de la misma carpeta que la anterior y compruébalo sin copiar la orden. Explica por qué dos terminales pueden mostrar rutas distintas.",
      "evidence": "La respuesta muestra la carpeta actual de cada terminal. No tiene que ser la carpeta personal: depende de cómo abriste cada ventana."
    }
  },
  "python": {
    "question": "La orden de versión devuelve Python 3.11. ¿Qué comprueba ese resultado?",
    "options": [
      "La orden está invocando Python 3.11.",
      "Todas las terminales usan Python 3.11.",
      "Python 3.12 no está instalado en el equipo."
    ],
    "correct": 0,
    "explanation": "La versión identifica el intérprete que responde, no todos los instalados.",
    "feedback": [
      "",
      "Otras terminales pueden usar otra configuración.",
      "Puede haber otra versión instalada que esta orden no encuentra."
    ],
    "practice": {
      "task": "Sin copiar el ejemplo, abre una terminal nueva, averigua la serie de Python que responde y entra en su modo interactivo. Calcula 3 + 4 y sal usando la orden aprendida.",
      "evidence": "La versión corresponde a Python 3.12.x, el intérprete muestra 7 y puedes volver al indicador de la terminal. Si falla la serie, no des por resuelto ese paso."
    }
  },
  "vscode": {
    "question": "Abres otro proyecto en VS Code. ¿Cómo mantienes separados sus archivos?",
    "options": [
      "Abres un archivo del proyecto en la carpeta anterior.",
      "Cambias el intérprete de la ventana anterior.",
      "Abres la carpeta del nuevo proyecto."
    ],
    "correct": 2,
    "explanation": "La carpeta abierta delimita los archivos del espacio de trabajo.",
    "feedback": [
      "Abrir un archivo no cambia necesariamente la carpeta de trabajo.",
      "Cambiar el intérprete no cambia la carpeta abierta.",
      ""
    ],
    "practice": {
      "task": "Abre una carpeta distinta a la del ejemplo y crea un archivo de texto de prueba en ella. Comprueba desde el explorador y la terminal integrada dónde quedó.",
      "evidence": "El explorador muestra el archivo en la nueva carpeta y la terminal indica esa ubicación, no la del ejemplo."
    }
  },
  "git": {
    "question": "Git muestra tu nombre y correo. ¿Qué demuestra?",
    "options": [
      "Git tiene datos para atribuir tus commits.",
      "GitHub tiene una sesión iniciada con tu cuenta.",
      "El repositorio local tiene un remoto configurado."
    ],
    "correct": 0,
    "explanation": "La configuración de autor no es autenticación ni publicación.",
    "feedback": [
      "",
      "La autenticación con GitHub es otro proceso.",
      "La configuración del remoto es independiente del autor."
    ],
    "practice": {
      "task": "Imagina que mañana usarás una computadora prestada con otra identidad de autor. Sin copiar el ejemplo, comprueba la versión de Git y localiza los datos de autor de tu propio equipo. Explica qué tendrías que corregir antes de hacer un commit si los valores fueran incorrectos.",
      "evidence": "Distingues la versión, nombre y correo de autor de la sesión de GitHub. No cambies valores correctos ni compartas datos personales."
    }
  },
  "github": {
    "question": "Cambias de celular después de activar la verificación en dos pasos. ¿Qué preparas antes?",
    "options": [
      "Conservas el nombre del repositorio que publicaste.",
      "Guardas el enlace a la página de inicio de sesión.",
      "Conservas los códigos de recuperación en privado."
    ],
    "correct": 2,
    "explanation": "Los códigos permiten recuperar acceso si pierdes el segundo factor.",
    "feedback": [
      "El repositorio no permite recuperar la cuenta.",
      "El enlace no permite recuperar el segundo factor.",
      ""
    ],
    "practice": {
      "task": "Imagina que perdiste el celular, pero sigues teniendo acceso a tu cuenta. Describe qué método de recuperación usarías y cómo comprobarías que lo tienes disponible. Revisa el estado de seguridad de tu cuenta sin desactivar el segundo factor ni mostrar secretos.",
      "evidence": "Puedes explicar un camino de recuperación seguro y localizar el método privado. No necesitas simular una pérdida real ni probar un código."
    }
  },
  "conectar": {
    "question": "Hiciste un commit local. ¿Qué evidencia confirma que también llegó a GitHub?",
    "options": [
      "La lista de archivos que Git detecta localmente.",
      "El mensaje del commit en el historial local.",
      "El commit visible en el repositorio remoto."
    ],
    "correct": 2,
    "explanation": "Un commit local no demuestra que el remoto recibió los cambios.",
    "feedback": [
      "El estado local no demuestra una publicación.",
      "El historial local puede contener commits que aún no se enviaron.",
      ""
    ],
    "practice": {
      "task": "En tu repositorio de práctica, añade una nueva línea sin datos personales al README, revisa el cambio, prepara el archivo, guarda un commit y publícalo. Comprueba qué quedó en el historial y qué llegó a GitHub.",
      "evidence": "El README remoto contiene la nueva línea y el commit coincide con el local. No publiques credenciales ni archivos ajenos a la práctica."
    }
  },
  "final": {
    "question": "Una comprobación final falla, pero las demás pasan. ¿Qué haces primero?",
    "options": [
      "Identificas la herramienta que falló y verificas su salida.",
      "Repites todas las instalaciones desde el comienzo.",
      "Cambias todas las herramientas a otras versiones."
    ],
    "correct": 0,
    "explanation": "Diagnosticar la herramienta concreta evita alterar las que funcionan.",
    "feedback": [
      "",
      "Reinstalar todo dificulta identificar la causa y puede generar problemas nuevos.",
      "Cambiar versiones sin diagnóstico puede introducir incompatibilidades."
    ],
    "practice": {
      "task": "Cierra y vuelve a abrir la terminal integrada. Sin copiar la lista anterior, verifica Python, Git, GitHub CLI y VS Code. Si aparece un error, identifica la herramienta y vuelve a comprobar solo esa. Abre tu carpeta de práctica.",
      "evidence": "Puedes distinguir las cuatro comprobaciones: versión de Python 3.12.x, Git disponible, sesión de GitHub CLI válida y comando de VS Code disponible. Los archivos de práctica siguen presentes. Si algo falla, no marques esa comprobación como resuelta."
    }
  }
}

export const WEB_CHECKS: Readonly<Record<string, LearningCheck>> = {
  "html": {
    "question": "Una celda contiene <script> como texto. ¿Cómo evitas que se interprete como una etiqueta?",
    "options": [
      "Escapas los caracteres al incorporar el dato.",
      "Añades comillas alrededor del dato sin escapar.",
      "Colocas el dato en una tabla con encabezados."
    ],
    "correct": 0,
    "explanation": "Escapar los caracteres especiales permite mostrar texto en HTML.",
    "feedback": [
      "",
      "Las comillas no protegen el contenido de una celda HTML.",
      "Los encabezados mejoran la estructura, no escapan datos."
    ]
  },
  "http": {
    "question": "El cliente recibe HTTP 404. ¿Qué puedes concluir sobre la respuesta?",
    "options": [
      "El formato del cuerpo es JSON por tratarse de HTTP.",
      "El servidor no encontró el recurso solicitado o no revela su existencia.",
      "El cuerpo está vacío en todas las respuestas 404."
    ],
    "correct": 1,
    "explanation": "404 no garantiza el formato ni el contenido del cuerpo.",
    "feedback": [
      "HTTP transporta distintos formatos; revisa Content-Type.",
      "",
      "Una respuesta 404 puede incluir un cuerpo explicativo."
    ]
  },
  "sitio": {
    "question": "Una tabla ya cargada se ordena con JavaScript. ¿Qué necesita el navegador?",
    "options": [
      "Un nuevo archivo HTML generado por Python en cada clic.",
      "Una nueva consulta al servidor para cada cambio de orden.",
      "Los datos cargados y la lógica de ordenamiento."
    ],
    "correct": 2,
    "explanation": "Los datos en memoria del navegador pueden ordenarse localmente.",
    "feedback": [
      "Eso es una alternativa, no un requisito del ordenamiento local.",
      "El navegador ya tiene los datos necesarios.",
      ""
    ]
  },
  "despliegue": {
    "question": "Publicas /mi-proyecto/index.html junto a data.json. ¿Qué enlace apunta al JSON de esa carpeta?",
    "options": [
      "/data.json",
      "./data.json",
      "../data.json"
    ],
    "correct": 1,
    "explanation": "La ruta ./ se resuelve desde la carpeta de la página.",
    "feedback": [
      "La barra inicial apunta a la raíz del dominio.",
      "",
      "../ sube a la carpeta superior."
    ]
  },
  "prototipo": {
    "question": "Una consulta filtra por una columna y lee muchas filas. ¿Qué investigas antes de ampliar el plan?",
    "options": [
      "El tamaño de la respuesta que llega al navegador.",
      "El plan de consulta y los índices del filtro.",
      "La cantidad de conexiones abiertas por el navegador."
    ],
    "correct": 1,
    "explanation": "El plan permite identificar lecturas evitables y probar un índice apropiado.",
    "feedback": [
      "Una respuesta pequeña también puede requerir muchas lecturas.",
      "",
      "El número de conexiones no explica por sí mismo cuántas filas lee una consulta."
    ]
  },
  "modelo": {
    "question": "Un alumno puede matricularse en muchos cursos y viceversa. ¿Cómo representas cada matrícula?",
    "options": [
      "Con una clave de curso en cada fila de alumno.",
      "Con una clave de alumno en cada fila de curso.",
      "Con una fila que referencia al alumno y al curso."
    ],
    "correct": 2,
    "explanation": "Una tabla intermedia permite representar ambas multiplicidades.",
    "feedback": [
      "Una sola clave de curso por alumno no admite varios cursos.",
      "Una sola clave de alumno por curso no admite varios alumnos.",
      ""
    ]
  }
}
