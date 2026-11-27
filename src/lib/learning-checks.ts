export interface LearningCheck {
  question: string
  options: readonly string[]
  correct: number
  explanation: string
}
export function checkAnswer(check: LearningCheck, selected: number | null): 'unanswered' | 'incorrect' | 'correct' {
  if (selected === null || !Number.isInteger(selected) || selected < 0 || selected >= check.options.length) return 'unanswered'
  return selected === check.correct ? 'correct' : 'incorrect'
}
export const SETUP_CHECKS: Readonly<Record<string, LearningCheck>> = {
  "terminal": {
    "question": "Abres una terminal nueva. ¿Cómo evitas crear archivos en la carpeta equivocada?",
    "options": [
      "Creas una carpeta sin comprobar la ubicación.",
      "Consultas la carpeta actual.",
      "Reinstalas Python."
    ],
    "correct": 1,
    "explanation": "Primero identifica tu ubicación; después puedes decidir dónde guardar archivos."
  },
  "python": {
    "question": "La orden de versión devuelve Python 3.11. ¿Qué indica?",
    "options": [
      "Ya estás usando Python 3.12.",
      "Git no está instalado.",
      "La orden no invoca Python 3.12; revisa el intérprete y el PATH."
    ],
    "correct": 2,
    "explanation": "La versión identifica el intérprete que responde, no todos los instalados."
  },
  "vscode": {
    "question": "Quieres trabajar en otro proyecto sin mezclar archivos. ¿Qué haces?",
    "options": [
      "Abres su propia carpeta en VS Code.",
      "Cambias el tema del editor.",
      "Guardas todos los proyectos en un archivo."
    ],
    "correct": 0,
    "explanation": "Cada carpeta de trabajo mantiene sus propios archivos."
  },
  "git": {
    "question": "Git muestra tu nombre y correo. ¿Qué demuestra?",
    "options": [
      "El repositorio ya se publicó.",
      "Git tiene datos para atribuir tus commits.",
      "GitHub ya te autenticó."
    ],
    "correct": 1,
    "explanation": "La configuración de autor no es autenticación ni publicación."
  },
  "github": {
    "question": "Cambias de celular después de activar la verificación en dos pasos. ¿Qué preparas?",
    "options": [
      "Compartes tu contraseña.",
      "Desactivas toda la seguridad.",
      "Guardas los códigos de recuperación en un lugar privado."
    ],
    "correct": 2,
    "explanation": "Los códigos permiten recuperar el acceso si pierdes el segundo factor."
  },
  "conectar": {
    "question": "Hiciste un commit local. ¿Cómo compruebas que también llegó a GitHub?",
    "options": [
      "Verificas el commit remoto y, si quieres, clonas en otra carpeta.",
      "Cambias el nombre local.",
      "Ejecutas git init otra vez."
    ],
    "correct": 0,
    "explanation": "Un commit local no demuestra publicación."
  },
  "final": {
    "question": "Una herramienta falla en la comprobación final. ¿Qué haces?",
    "options": [
      "Marcas todo como hecho.",
      "Identificas la herramienta y repites su comprobación.",
      "Borras la carpeta de trabajo."
    ],
    "correct": 1,
    "explanation": "La comprobación identifica qué herramienta necesita atención."
  }
}

export const WEB_CHECKS: Readonly<Record<string, LearningCheck>> = {
  "html": {
    "question": "Una celda contiene <script> como dato. ¿Cómo lo muestras como texto?",
    "options": [
      "Lo insertas sin cambios.",
      "Eliminas toda la fila.",
      "Escapas el texto antes de incorporarlo al HTML."
    ],
    "correct": 2,
    "explanation": "Escapar evita que el navegador interprete el dato como una etiqueta."
  },
  "http": {
    "question": "El cliente recibe HTTP 404. ¿Qué significa?",
    "options": [
      "El servidor no encontró el recurso solicitado.",
      "El cuerpo necesariamente es JSON válido.",
      "La petición creó el recurso."
    ],
    "correct": 0,
    "explanation": "El estado y el contenido se verifican por separado."
  },
  "sitio": {
    "question": "JavaScript ordena una tabla ya cargada. ¿Qué necesita?",
    "options": [
      "Ejecutar Python en cada clic.",
      "Los datos cargados y la lógica de ordenamiento.",
      "Crear una base de datos por clic."
    ],
    "correct": 1,
    "explanation": "El navegador puede procesar los datos que ya tiene."
  },
  "despliegue": {
    "question": "Publicas HTML bajo /mi-proyecto/. ¿Qué enlace evita depender de la raíz?",
    "options": [
      "https://otro-dominio.example/data.json",
      "/data.json",
      "./data.json"
    ],
    "correct": 2,
    "explanation": "La ruta relativa se resuelve desde la ubicación de la página."
  },
  "prototipo": {
    "question": "Una consulta examina muchas filas y devuelve pocas. ¿Qué investigas antes de ampliar el plan?",
    "options": [
      "El plan de consulta, filtros e índices.",
      "El color del botón.",
      "El nombre del servidor."
    ],
    "correct": 0,
    "explanation": "Las filas leídas no equivalen a los resultados; mide el efecto del índice."
  },
  "modelo": {
    "question": "Un alumno puede matricularse en muchos cursos y viceversa. ¿Cómo lo modelas?",
    "options": [
      "Una columna con cursos separados por comas.",
      "Una tabla de matrículas con claves foráneas a alumno y curso.",
      "Copias todos los alumnos por curso."
    ],
    "correct": 1,
    "explanation": "La tabla intermedia representa la relación muchos a muchos."
  }
}
