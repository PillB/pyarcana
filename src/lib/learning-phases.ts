import type { LearningCheck } from './learning-checks'
export interface LearningPhases {
  example: string
  reason: string
  result: string
  hint: string
  guided: LearningCheck
  action: string
  evidence: string
  demoThrough?: string
}
export const LEARNING_PHASES: Readonly<Record<string, LearningPhases>> = {
  "terminal": {
    "example": "Ana abre PowerShell o Terminal. Antes de crear archivos pregunta dónde está con `pwd`.",
    "reason": "La ubicación es una carpeta, no un programa. Leer la ruta no cambia ningún archivo.",
    "result": "Una ruta, por ejemplo `/home/ana` o `C:\\Users\\ana`.",
    "hint": "Piensa en lo que identifica `pwd`, no en el programa que se ejecuta.",
    "guided": {
      "question": "En una segunda terminal, `pwd` muestra una ruta diferente. ¿Qué ha cambiado?",
      "options": [
        "La ubicación donde está instalado el intérprete de Python.",
        "La versión del sistema operativo.",
        "La carpeta de trabajo de esa terminal."
      ],
      "correct": 2,
      "feedback": [
        "La carpeta de trabajo y la instalación del intérprete son ubicaciones distintas.",
        "La ruta no identifica una versión del sistema.",
        ""
      ],
      "explanation": "Cada terminal tiene una ubicación de trabajo; las órdenes relativas parten de ella."
    },
    "action": "En la terminal que acabas de abrir, ejecuta `pwd`. Identifica la carpeta que contiene tu ruta y compárala con el indicador de la terminal. No pegues aquí la ruta.",
    "evidence": "Puedes señalar la carpeta actual; no se ha creado ni modificado ningún archivo."
  },
  "python": {
    "example": "Ana ejecuta `python --version` en Windows o `python3 --version` en macOS/Linux. Aparece `Python 3.12.10`.",
    "reason": "La orden pregunta al intérprete que encuentra la terminal. El último número puede variar; el curso usa la serie 3.12.",
    "result": "La versión comienza con `Python 3.12.`.",
    "hint": "Compara los dos primeros números de la versión.",
    "guided": {
      "question": "En otra terminal aparece `Python 3.12.3`. ¿Qué decides antes de seguir?",
      "options": [
        "La serie 3.12 coincide; el parche es distinto.",
        "Hay que reinstalar Python porque el número de parche no coincide.",
        "La salida demuestra que Git está listo."
      ],
      "correct": 0,
      "feedback": [
        "",
        "Una diferencia de parche no exige reinstalar si se cumplen los requisitos del curso.",
        "La orden solo consulta Python."
      ],
      "explanation": "3.12.3 y 3.12.10 pertenecen a la misma serie; las dependencias pueden tener requisitos propios."
    },
    "action": "Ejecuta el comando de versión correspondiente a tu sistema y separa los tres números de la salida en serie y parche.",
    "evidence": "La serie requerida por el curso es 3.12; una salida 3.11 o 3.13 no confirma que estés usando esa serie."
  },
  "vscode": {
    "example": "Ana abre la carpeta `pyarcana` en VS Code y después su terminal integrada. Consulta `pwd`.",
    "reason": "El explorador muestra los archivos del espacio de trabajo; la terminal tiene su propia ubicación, que conviene verificar.",
    "result": "La ruta termina en `pyarcana`.",
    "hint": "El objetivo es trabajar dentro de la carpeta abierta, no cambiar el aspecto del editor.",
    "guided": {
      "question": "La terminal integrada muestra la carpeta personal, no `pyarcana`. ¿Qué verificas primero?",
      "options": [
        "La configuración del intérprete de Python dentro del editor.",
        "La ubicación de descargas configurada en el navegador.",
        "La carpeta abierta y la ruta de la terminal."
      ],
      "correct": 2,
      "feedback": [
        "La selección del intérprete no cambia por sí misma la carpeta de la terminal.",
        "Las descargas del navegador no determinan la carpeta de la terminal integrada.",
        ""
      ],
      "explanation": "Comprobar ambas ubicaciones evita guardar archivos en un lugar inesperado."
    },
    "action": "Abre la carpeta de práctica en VS Code. En su terminal integrada, ejecuta `pwd` y compara el último componente de la ruta con el nombre que ves en el explorador.",
    "evidence": "Ambos identifican la carpeta de práctica; si no coinciden, revisa la carpeta y la terminal antes de continuar."
  },
  "git": {
    "example": "Ana configura su identidad de Git y ejecuta `git config --global --list`.",
    "reason": "Una consulta de configuración muestra valores locales; no inicia sesión en GitHub ni crea un commit.",
    "result": "Aparecen los campos `user.name` y `user.email` que configuró, sin necesidad de compartirlos.",
    "hint": "Separa la identidad de autor de la autenticación remota.",
    "guided": {
      "question": "La lista muestra un correo de autor distinto al que querías. ¿Qué revisas?",
      "options": [
        "El correo de la cuenta de GitHub.",
        "La configuración de autor de Git.",
        "La URL del repositorio remoto."
      ],
      "correct": 1,
      "feedback": [
        "La sesión remota y los datos de autor local son independientes.",
        "",
        "La dirección remota no determina el correo de autor de un commit."
      ],
      "explanation": "La identidad se configura en Git; consulta y corrige el valor local sin publicar datos personales."
    },
    "action": "Consulta `git config --global --list` y localiza las entradas de autor. Compara en privado con lo que configuraste, sin cambiar ni compartir otros valores.",
    "evidence": "Puedes identificar `user.name` y `user.email` sin confundirlos con la sesión de GitHub."
  },
  "github": {
    "example": "Ana activa la autenticación en dos pasos y guarda sus códigos de recuperación en un lugar privado, separado del repositorio.",
    "reason": "Un segundo factor protege el inicio de sesión; los códigos de recuperación ayudan si pierde ese factor.",
    "result": "GitHub confirma la protección; los códigos no se comparten ni se suben a un repositorio.",
    "hint": "Un código de recuperación funciona como una credencial.",
    "guided": {
      "question": "Un compañero solicita un código de recuperación para ayudarte. ¿Qué haces?",
      "options": [
        "Lo guardas en un repositorio privado.",
        "No lo compartes; revisas la ayuda oficial.",
        "Se lo envías por un chat privado."
      ],
      "correct": 1,
      "feedback": [
        "Un repositorio no es un almacén adecuado para códigos de recuperación.",
        "",
        "Compartirlo por mensaje también expone una credencial."
      ],
      "explanation": "Los códigos son secretos; la ayuda no requiere que los reveles."
    },
    "action": "En la configuración de seguridad de tu propia cuenta, comprueba el estado de la verificación en dos pasos. Identifica dónde guardaste el método de recuperación, sin abrir, copiar ni mostrar el secreto.",
    "evidence": "Puedes explicar cómo recuperarías el acceso sin publicar ninguna credencial."
  },
  "conectar": {
    "example": "Ana crea un README de práctica, revisa `git status`, selecciona el archivo con `git add README.md` y guarda un commit.",
    "reason": "Git distingue el archivo modificado, la selección para el commit y el historial local. La publicación es una acción aparte.",
    "result": "Después del commit, el cambio queda en el historial local; solo aparece en GitHub después de publicarlo.",
    "hint": "Recuerda qué orden selecciona el archivo para el commit.",
    "guided": {
      "question": "Modificaste el README tras el commit. `git status` muestra el cambio sin seleccionar. ¿Qué falta antes del siguiente commit?",
      "options": [
        "Seleccionar el README con `git add`.",
        "Ejecutar `git commit` directamente.",
        "Volver a consultar `git status`."
      ],
      "correct": 0,
      "feedback": [
        "",
        "Un commit normal guarda los cambios preparados, no necesariamente el cambio nuevo.",
        "Consultar el estado no modifica el área de preparación."
      ],
      "explanation": "El área de preparación permite decidir qué cambios entran en el próximo commit."
    },
    "action": "En la carpeta de práctica, ejecuta `git status`. Si el README no tiene cambios pendientes, agrega una línea de texto de prueba sin datos personales. Ejecuta `git status`, luego `git add README.md` y vuelve a consultar el estado.",
    "evidence": "El README pasa de modificado sin preparar a preparado; no se crea ningún commit hasta que lo decidas."
  },
  "final": {
    "example": "Ana abre una terminal nueva, verifica Python, Git, GitHub CLI y VS Code. Python y Git responden; `gh auth status` indica que falta iniciar sesión.",
    "reason": "Cada comprobación evalúa una herramienta distinta. Una falla no invalida las demás.",
    "result": "Se identifica el problema de autenticación sin reinstalar herramientas que funcionan.",
    "hint": "Aísla el comando que falló.",
    "guided": {
      "question": "Python y `gh` responden; `code --version` no se reconoce. ¿Qué investigas primero?",
      "options": [
        "La versión de Python del proyecto.",
        "La conexión con el remoto de GitHub.",
        "La disponibilidad de `code` en esa terminal."
      ],
      "correct": 2,
      "feedback": [
        "Python ya respondió; comprueba primero el comando que falló.",
        "La conexión remota no determina si existe el comando del editor.",
        ""
      ],
      "explanation": "Revisa la instalación o PATH del comando del editor y vuelve a comprobarlo."
    },
    "action": "En una terminal nueva, ejecuta la comprobación de las herramientas una a una. Si una falla, anota solo su nombre y tipo de error, sin copiar información de autenticación.",
    "evidence": "Puedes distinguir la herramienta que falla de las que responden. No reinstales todo si solo falla una."
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
    },
    "action": "En una copia de `escapar_celdas.py`, reemplaza `Bodega <Norte>` por `Sur & Este`. Antes de ejecutar, predice la diferencia entre la cadena HTML escapada y el texto que verá el navegador.",
    "evidence": "La cadena escapada contiene `Sur &amp; Este`; al interpretarla como HTML, el texto visible es `Sur & Este`.",
    "demoThrough": "html.escapar"
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
    },
    "action": "En una copia local de `servidor_y_cliente.py`, cambia el cuerpo por `cuerpo = b\"hola\"`, el tipo por `text/plain; charset=utf-8` y la última lectura por `print(respuesta.read().decode(\"utf-8\"))`. Ejecuta la copia local.",
    "evidence": "El cliente imprime `200 text/plain; charset=utf-8` y `hola`. No necesita el sitio del módulo siguiente ni un servidor público.",
    "demoThrough": "http.servidor-cliente"
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
    },
    "action": "En una copia de `construir_sitio.py`, cambia el monto de Sede A de 1250.00 a 1500.00. Vuelve a generar el sitio, conserva `app.js` y pulsa dos veces el encabezado Ventas.",
    "evidence": "La primera fila numérica es 980.50 en ascendente y 1500.00 en descendente; siguen existiendo tres filas.",
    "demoThrough": "sitio.construir"
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
        "../app.js",
        "./app.js"
      ],
      "correct": 2,
      "feedback": [
        "La barra inicial apunta a la raíz.",
        "Dos puntos suben un nivel.",
        ""
      ],
      "explanation": "`./app.js` funciona en esa subcarpeta sin depender de un nombre fijo. Compruébalo con el ejemplo de rutas."
    },
    "action": "En `rutas_relativas.py`, cambia la página base a `https://ejemplo.test/demo/index.html`. Compara `/app.js` con `./app.js` usando `urljoin`. No publiques nada.",
    "evidence": "Las dos direcciones son `https://ejemplo.test/app.js` y `https://ejemplo.test/demo/app.js`.",
    "demoThrough": "despliegue.rutas-relativas"
  },
  "prototipo": {
    "example": "Una consulta busca ventas por sede y ordena por monto. Antes de publicar, Ana usa SQLite local y compara el plan antes y después del índice.",
    "reason": "El índice debe responder al filtro y al orden. El plan es evidencia del camino elegido, no una factura ni una medida exacta de filas leídas.",
    "result": "Un plan puede pasar de `SCAN` a `SEARCH`; hay que confirmar también que los resultados coinciden.",
    "hint": "Pon primero la columna del filtro de igualdad y luego la del orden.",
    "guided": {
      "question": "La consulta filtra por `sede_id` y ordena por `monto`. ¿Qué índice ensayarías primero?",
      "options": [
        "Un índice sobre `(sede_id, monto)`.",
        "Solo un índice por el nombre de la sede.",
        "Solo un índice por el texto de una nota."
      ],
      "correct": 0,
      "feedback": [
        "",
        "Ese campo no participa en la consulta.",
        "Ese texto no participa en el filtro u orden."
      ],
      "explanation": "El índice compuesto es una hipótesis que debes validar con el plan y los mismos resultados, sin desplegar ni gastar."
    },
    "action": "En `indice_compuesto.py`, cambia `ORDER BY monto DESC` por `ORDER BY monto ASC`. Predice si el índice `(sede_id, monto)` aún puede servir para el orden y ejecuta ambos planes localmente.",
    "evidence": "Con el índice compuesto, el plan no necesita `USE TEMP B-TREE FOR ORDER BY`. Es una observación del plan de SQLite local, no una medida de cobro de D1.",
    "demoThrough": "prototipo.indices"
  },
  "modelo": {
    "example": "Una venta pertenece a una sede; una sede tiene varias ventas. La tabla de ventas guarda la clave de la sede.",
    "reason": "La clave foránea representa el vínculo en el lado que puede tener muchas filas. SQLite debe tener activada la comprobación de claves foráneas.",
    "result": "Una venta que referencia una sede inexistente se rechaza cuando la restricción está activa.",
    "hint": "Distingue la fila que puede repetirse muchas veces para una misma tienda.",
    "guided": {
      "question": "Una tienda recibe muchos pedidos; cada pedido pertenece a una tienda. ¿Dónde guardarías la clave de tienda?",
      "options": [
        "En el nombre descriptivo de la tienda.",
        "En cada fila de pedidos.",
        "En una única columna pedido_id de la tienda."
      ],
      "correct": 1,
      "feedback": [
        "Un nombre puede repetirse o cambiar.",
        "",
        "Una única columna no representa todos los pedidos."
      ],
      "explanation": "Cada pedido guarda la clave de su tienda. La misma regla se aplica a otros modelos uno a muchos."
    },
    "action": "En `muchos_a_muchos.py`, cambia la segunda inserción de stock al par `('SED-02', 'PRD-2', 5)`, que aún no existe, y añade después de la inserción `print(\"filas de stock:\", con.execute(\"SELECT COUNT(*) FROM stock\").fetchone()[0])` con la misma sangría.",
    "evidence": "La inserción de un par nuevo se acepta y aparecen cuatro filas de stock. Un par repetido sigue siendo rechazado.",
    "demoThrough": "modelo.claves-foraneas"
  }
}

/** Preserve source ordering and stable step IDs. An exercise must be a final contiguous phase. */
export function splitLearningSteps<T extends { id: string; exercise?: unknown }>(steps: readonly T[], demoThrough: string | undefined) {
  const boundary = steps.findIndex(step => Boolean(step.exercise))
  const demoEnd = steps.findIndex(step => step.id === demoThrough)
  if (demoEnd < 0 || boundary <= demoEnd + 1 || steps.slice(boundary).some(step => !step.exercise)) {
    throw new Error('[learning phases] expected worked example, guided steps and final independent exercise(s); demo anchor=' + demoThrough + '; steps=' + steps.map(s => s.id).join(', '))
  }
  return { demo: steps.slice(0,demoEnd+1), guided: steps.slice(demoEnd+1,boundary), independent: steps.slice(boundary) }
}

export function phaseFor(id: string): LearningPhases {
  const phase = LEARNING_PHASES[id]
  if (!Object.hasOwn(LEARNING_PHASES,id) || !phase) throw new Error('[learning phases] missing authored demonstration and guided task for ' + id)
  return phase
}
