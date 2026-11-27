import type { LearningCheck } from './learning-checks'
export interface LearningPhases {
  example: string
  reason: string
  result: string
  hint: string
  guided: LearningCheck
}
export const LEARNING_PHASES: Readonly<Record<string, LearningPhases>> = {
  "terminal": {
    "example": "Ana abre PowerShell o Terminal. Antes de crear archivos pregunta dónde está con `pwd`.",
    "reason": "La ubicación es una carpeta, no un programa. Leer la ruta no cambia ningún archivo.",
    "result": "Una ruta, por ejemplo `/home/ana` o `C:\\\\Users\\\\ana`.",
    "hint": "Piensa en lo que identifica `pwd`, no en el programa que se ejecuta.",
    "guided": {
      "question": "En una segunda terminal, `pwd` muestra una ruta diferente. ¿Qué ha cambiado?",
      "options": [
        "La carpeta de trabajo de esa terminal.",
        "La versión del sistema operativo.",
        "El contenido de todos los archivos."
      ],
      "correct": 0,
      "feedback": [
        "",
        "La ruta no identifica una versión del sistema.",
        "Consultar una ruta no modifica archivos."
      ],
      "explanation": "Cada terminal tiene una ubicación de trabajo; las órdenes relativas parten de ella."
    }
  },
  "python": {
    "example": "Ana ejecuta `python --version` en Windows o `python3 --version` en macOS/Linux. Aparece `Python 3.12.10`.",
    "reason": "La orden pregunta al intérprete que encuentra la terminal. El último número puede variar; el curso usa la serie 3.12.",
    "result": "La versión comienza con `Python 3.12.`.",
    "hint": "Compara los dos primeros números de la versión.",
    "guided": {
      "question": "En otra terminal aparece `Python 3.12.3`. ¿Qué decides antes de seguir?",
      "options": [
        "Hay que borrar Python inmediatamente.",
        "La serie 3.12 coincide; el parche es distinto.",
        "La salida demuestra que Git está listo."
      ],
      "correct": 1,
      "feedback": [
        "Una diferencia de parche no exige borrar el intérprete.",
        "",
        "La orden solo consulta Python."
      ],
      "explanation": "3.12.3 y 3.12.10 pertenecen a la misma serie; las dependencias pueden tener requisitos propios."
    }
  },
  "vscode": {
    "example": "Ana abre la carpeta `pyarcana` en VS Code y después su terminal integrada. Consulta `pwd`.",
    "reason": "El explorador muestra los archivos del espacio de trabajo; la terminal tiene su propia ubicación, que conviene verificar.",
    "result": "La ruta termina en `pyarcana`.",
    "hint": "El objetivo es trabajar dentro de la carpeta abierta, no cambiar el aspecto del editor.",
    "guided": {
      "question": "La terminal integrada muestra la carpeta personal, no `pyarcana`. ¿Qué verificas primero?",
      "options": [
        "El tema de colores de VS Code.",
        "La versión de GitHub.",
        "La carpeta abierta y la ruta de la terminal."
      ],
      "correct": 2,
      "feedback": [
        "El tema no cambia la carpeta.",
        "GitHub no determina la ubicación de la terminal.",
        ""
      ],
      "explanation": "Comprobar ambas ubicaciones evita guardar archivos en un lugar inesperado."
    }
  },
  "git": {
    "example": "Ana configura su identidad de Git y ejecuta `git config --global --list`.",
    "reason": "Una consulta de configuración muestra valores locales; no inicia sesión en GitHub ni crea un commit.",
    "result": "Aparecen los campos `user.name` y `user.email` que configuró, sin necesidad de compartirlos.",
    "hint": "Separa la identidad de autor de la autenticación remota.",
    "guided": {
      "question": "La lista muestra un correo de autor distinto al que querías. ¿Qué revisas?",
      "options": [
        "La configuración de autor de Git.",
        "Los códigos de recuperación de GitHub.",
        "El color de la terminal."
      ],
      "correct": 0,
      "feedback": [
        "",
        "Los códigos sirven para recuperar acceso, no para atribuir commits.",
        "El color no modifica la identidad."
      ],
      "explanation": "La identidad se configura en Git; consulta y corrige el valor local sin publicar datos personales."
    }
  },
  "github": {
    "example": "Ana activa la autenticación en dos pasos y guarda sus códigos de recuperación en un lugar privado, separado del repositorio.",
    "reason": "Un segundo factor protege el inicio de sesión; los códigos de recuperación ayudan si pierde ese factor.",
    "result": "GitHub confirma la protección; los códigos no se comparten ni se suben a un repositorio.",
    "hint": "Un código de recuperación funciona como una credencial.",
    "guided": {
      "question": "Un compañero solicita un código de recuperación para ayudarte. ¿Qué haces?",
      "options": [
        "Lo subes al repositorio privado.",
        "No lo compartes; revisas la ayuda oficial.",
        "Lo pegas en el chat de práctica."
      ],
      "correct": 1,
      "feedback": [
        "Un repositorio no es un almacén adecuado para esas credenciales.",
        "",
        "El chat tampoco necesita tu código."
      ],
      "explanation": "Los códigos son secretos; la ayuda no requiere que los reveles."
    }
  },
  "conectar": {
    "example": "Ana crea un README de práctica, revisa `git status`, selecciona el archivo con `git add README.md` y guarda un commit.",
    "reason": "Git distingue el archivo modificado, la selección para el commit y el historial local. La publicación es una acción aparte.",
    "result": "Después del commit, el cambio queda en el historial local; solo aparece en GitHub después de publicarlo.",
    "hint": "Recuerda qué orden selecciona el archivo para el commit.",
    "guided": {
      "question": "Modificaste el README tras el commit. `git status` muestra el cambio sin seleccionar. ¿Qué falta antes del siguiente commit?",
      "options": [
        "Volver a instalar Git.",
        "Crear otra cuenta de GitHub.",
        "Seleccionar el README con `git add`."
      ],
      "correct": 2,
      "feedback": [
        "Git ya está funcionando.",
        "La cuenta no selecciona archivos locales.",
        ""
      ],
      "explanation": "El área de preparación permite decidir qué cambios entran en el próximo commit."
    }
  },
  "final": {
    "example": "Ana abre una terminal nueva, verifica Python, Git, GitHub CLI y VS Code. Python y Git responden; `gh auth status` indica que falta iniciar sesión.",
    "reason": "Cada comprobación evalúa una herramienta distinta. Una falla no invalida las demás.",
    "result": "Se identifica el problema de autenticación sin reinstalar herramientas que funcionan.",
    "hint": "Aísla el comando que falló.",
    "guided": {
      "question": "Python y `gh` responden; `code --version` no se reconoce. ¿Qué investigas primero?",
      "options": [
        "La disponibilidad de `code` en esa terminal.",
        "La contraseña de GitHub.",
        "La instalación de Python desde cero."
      ],
      "correct": 0,
      "feedback": [
        "",
        "La contraseña no configura el comando del editor.",
        "Python ya respondió."
      ],
      "explanation": "Revisa la instalación o PATH del comando del editor y vuelve a comprobarlo."
    }
  },
  "html": {
    "example": "Una tabla recibe la sede `Bodega <Norte>`. Python escapa el texto antes de insertarlo en una celda y añade encabezados semánticos.",
    "reason": "El dato es texto, no marcado HTML; el navegador interpreta etiquetas, y los encabezados describen la tabla.",
    "result": "La celda muestra `Bodega <Norte>` completa, sin interpretar el nombre como etiqueta.",
    "hint": "Distingue el texto visible de los caracteres escapados del documento.",
    "guided": {
      "question": "Cambia mentalmente la sede a `Sur & Este`. ¿Qué debe aparecer al ver el HTML en el navegador?",
      "options": [
        "Sur &amp; Este como texto literal.",
        "Sur & Este como texto visible.",
        "Sur Este sin el símbolo."
      ],
      "correct": 1,
      "feedback": [
        "La entidad se interpreta como un carácter en el navegador.",
        "",
        "El escape no elimina datos."
      ],
      "explanation": "El documento puede contener `&amp;`, pero el navegador muestra `&`. Cambia la sede del ejemplo y compruébalo."
    }
  },
  "http": {
    "example": "Un cliente pide `/ventas` y recibe `200 application/json` seguido de un objeto con las ventas.",
    "reason": "El status informa del resultado; Content-Type describe el formato. El cuerpo se interpreta por separado.",
    "result": "Una respuesta 200 con JSON válido puede convertirse en un diccionario.",
    "hint": "Lee el tipo de contenido antes de decidir cómo interpretar el cuerpo.",
    "guided": {
      "question": "El servidor devuelve `200 text/plain` con `hola`. ¿Qué puedes hacer sin suponer un formato incorrecto?",
      "options": [
        "Tratar siempre el cuerpo como JSON.",
        "Interpretar 200 como garantía de JSON.",
        "Leer el cuerpo como texto."
      ],
      "correct": 2,
      "feedback": [
        "El contenido puede no ser JSON.",
        "200 no especifica el formato.",
        ""
      ],
      "explanation": "Un status exitoso no garantiza JSON. Compara con la salida del ejemplo sin necesitar otro servidor."
    }
  },
  "sitio": {
    "example": "Python genera `index.html` y `data.json`; el navegador recibe los datos y JavaScript cambia el orden de las filas.",
    "reason": "El cálculo previo y la interacción local son responsabilidades distintas.",
    "result": "Al ordenar la tabla, cambia el orden visual, no el total de ventas.",
    "hint": "Compara montos numéricos, no el orden del texto.",
    "guided": {
      "question": "En una tabla de dos montos, 980.50 y 1430.25, ¿qué fila queda arriba al ordenar de mayor a menor?",
      "options": [
        "1430.25.",
        "980.50.",
        "El total de ambos."
      ],
      "correct": 0,
      "feedback": [
        "",
        "Ese es el menor de los dos.",
        "Ordenar no crea una fila nueva."
      ],
      "explanation": "El monto mayor va primero. Prueba ambos sentidos en el ejemplo del módulo."
    }
  },
  "despliegue": {
    "example": "El sitio está en `https://ejemplo.test/mi-sitio/index.html`. El archivo `data.json` está en esa misma carpeta.",
    "reason": "Una ruta relativa se resuelve respecto de la URL del documento; una barra inicial parte de la raíz del dominio.",
    "result": "`./data.json` conserva la subcarpeta `mi-sitio`.",
    "hint": "Busca la referencia relativa a la carpeta actual.",
    "guided": {
      "question": "Ahora la página está en `/demo/index.html`. ¿Qué referencia conserva `/demo/` al cargar `app.js`?",
      "options": [
        "/app.js",
        "./app.js",
        "../app.js"
      ],
      "correct": 1,
      "feedback": [
        "La barra inicial apunta a la raíz.",
        "",
        "Dos puntos suben un nivel."
      ],
      "explanation": "`./app.js` funciona en esa subcarpeta sin depender de un nombre fijo. Compruébalo con el ejemplo de rutas."
    }
  },
  "prototipo": {
    "example": "Una consulta busca pedidos por cliente y ordena por fecha. Antes de publicar, Ana usa SQLite local y compara el plan antes y después del índice.",
    "reason": "El índice debe responder al filtro y al orden. El plan es evidencia del camino elegido, no una factura ni una medida exacta de filas leídas.",
    "result": "Un plan puede pasar de `SCAN` a `SEARCH`; hay que confirmar también que los resultados coinciden.",
    "hint": "Pon primero la columna del filtro de igualdad y luego la del orden.",
    "guided": {
      "question": "La consulta filtra por `cliente_id` y ordena por `creado`. ¿Qué índice ensayarías primero?",
      "options": [
        "Solo un índice por el nombre del cliente.",
        "Solo un índice por el texto del pedido.",
        "Un índice sobre `(cliente_id, creado)`."
      ],
      "correct": 2,
      "feedback": [
        "Ese campo no participa en la consulta.",
        "Ese texto no participa en el filtro u orden.",
        ""
      ],
      "explanation": "El índice compuesto es una hipótesis que debes validar con el plan y los mismos resultados, sin desplegar ni gastar."
    }
  },
  "modelo": {
    "example": "Una venta pertenece a una sede; una sede tiene varias ventas. La tabla de ventas guarda la clave de la sede.",
    "reason": "La clave foránea representa el vínculo en el lado que puede tener muchas filas. SQLite debe tener activada la comprobación de claves foráneas.",
    "result": "Una venta que referencia una sede inexistente se rechaza cuando la restricción está activa.",
    "hint": "Distingue la fila que puede repetirse muchas veces para un mismo cliente.",
    "guided": {
      "question": "Ahora un cliente puede tener varias ventas y cada venta un cliente. ¿Dónde pondrías la clave que referencia al cliente?",
      "options": [
        "En cada fila de ventas.",
        "En una única columna venta_id del cliente.",
        "En el nombre descriptivo del cliente."
      ],
      "correct": 0,
      "feedback": [
        "",
        "Una sola columna no representa todas las ventas de un cliente.",
        "Un nombre puede repetirse o cambiar."
      ],
      "explanation": "La venta guarda la clave del cliente; comprueba la integridad con datos sintéticos."
    }
  }
}

/** Preserve source ordering and stable step IDs. An exercise must be a final contiguous phase. */
export function splitLearningSteps<T extends { id: string; exercise?: unknown }>(steps: readonly T[]) {
  const boundary = steps.findIndex(step => Boolean(step.exercise))
  if (boundary < 1 || steps.slice(boundary).some(step => !step.exercise)) {
    throw new Error('[learning phases] expected guided steps followed by independent exercise(s); got ' + steps.map(s => s.id).join(', '))
  }
  return { guided: steps.slice(0,boundary), independent: steps.slice(boundary) }
}

export function phaseFor(id: string): LearningPhases {
  const phase = LEARNING_PHASES[id]
  if (!phase) throw new Error('[learning phases] missing authored demonstration and guided task for ' + id)
  return phase
}
