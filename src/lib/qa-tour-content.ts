/**
 * What a QA tester has to learn before the taxonomy is usable.
 *
 * The form offers 9 categories, 8 probable causes and 4 severities. The
 * boundaries between them are genuinely hard, and two of them are traps:
 * "Accesibilidad" appears in BOTH the category list and the cause list, and
 * "Contenido", "Término no explicado" and "Pregunta no respondible" all
 * describe something wrong with the words on the page.
 *
 * So the tour does not narrate the fields. It gives symptoms and asks the
 * tester to classify them, because that is the skill. Every exercise has a
 * defensible answer and a stated reason, and every wrong option has its own
 * explanation -- picking "Alta" for something with no workaround should teach
 * what severity measures, not just say "no".
 */

export interface QAExerciseOption {
  value: string
  label: string
  /** Why this option is right, or why it is the wrong axis / wrong degree. */
  feedback: string
}

export interface QAExercise {
  /** The observed symptom, written the way a tester would meet it. */
  symptom: string
  field: 'category' | 'cause' | 'severity'
  fieldLabel: string
  options: QAExerciseOption[]
  correct: string
  /** The rule the exercise teaches, shown once resolved. */
  rule: string
}

/**
 * One option of the form, defined and then shown happening.
 *
 * The exercises teach the boundaries that are genuinely hard, but they can only
 * put four options on screen at a time, so nine of the twenty-one choices the
 * form offers were never defined anywhere -- a tester met "Compatibilidad /
 * rendimiento" for the first time in the dropdown, with nothing to go on.
 *
 * Keyed by value, not label: the labels live in qa-session.ts and are rendered
 * from there, so a renamed option cannot leave a stale definition behind.
 */
export interface QATermDefinition {
  value: string
  /** What it means, in one clause a tester can hold in their head. */
  means: string
  /** One concrete case, specific enough to be wrong if it were made up. */
  example: string
}

export interface QATourStep {
  id: string
  title: string
  /** Highlighted element inside the QA dialog, if any. */
  target?: string
  body: string
  exercise?: QAExercise
  /** Which field's full option list to define under this step. */
  definitions?: 'category' | 'cause' | 'severity'
}

/**
 * Every category, defined with a case from this course rather than a generic
 * one. Several are drawn from defects that were actually found and fixed here,
 * which is the point: a tester should be able to check the example against the
 * product instead of taking it on faith.
 */
export const QA_CATEGORY_DEFINITIONS: QATermDefinition[] = [
  {
    value: 'functionality',
    means: 'algo del sitio no hace lo que dice que hace',
    example: 'el botón «Exportar paquete» no descarga ningún archivo y la consola no muestra ningún error.',
  },
  {
    value: 'content',
    means: 'una afirmación del material es falsa, o se contradice con otra parte del curso',
    example: 'una sección afirma que la mediana no se ve afectada por valores extremos y más abajo la usa como ejemplo de medida que sí se ve afectada.',
  },
  {
    value: 'unexplained-term',
    means: 'una palabra técnica se usa antes de que el curso la defina',
    example: '«PII» aparece por primera vez en S01 y el glosario recién la explica en S30, veintinueve secciones después.',
  },
  {
    value: 'unanswerable-question',
    means: 'el ejercicio pide algo que la teoría hasta ese punto no enseñó, aunque esté bien escrito',
    example: 'un ejercicio de S06 pide resolverlo con un DataFrame de pandas, y pandas se enseña por primera vez en S15.',
  },
  {
    value: 'assessment-design',
    means: 'el ejercicio se puede acertar por la razón equivocada, o no distingue a quien entendió de quien no',
    example: 'en un self-check de cuatro opciones la correcta es siempre la más larga, así que se acierta contando palabras.',
  },
  {
    value: 'ui-ux',
    means: 'la interfaz funciona, pero confunde, estorba o esconde algo que hacía falta',
    example: 'en una ventana de 600 px de alto el botón «Siguiente» del tutorial queda por debajo del borde y no hay forma de desplazarse hasta él.',
  },
  {
    value: 'accessibility',
    means: 'alguien que navega con teclado, usa lector de pantalla o necesita contraste no puede usarlo',
    example: 'las etiquetas «accept» y «reject» de un diagrama miden 2.43:1 contra el fondo, por debajo del mínimo de 4.5:1.',
  },
  {
    value: 'compatibility',
    means: 'funciona en un navegador, sistema o pantalla y no en otro, o va notablemente lento',
    example: 'la sección tarda ocho segundos en pintar en Safari y menos de uno en Chrome, en el mismo equipo.',
  },
  {
    value: 'other',
    means: 'lo puedes reproducir y no encaja en ninguna de las anteriores',
    example: 'el pie de página declara una licencia y el repositorio declara otra distinta.',
  },
]

/**
 * Every probable cause. This is a hypothesis about where the problem starts,
 * not a second opinion about what it is -- which is why "No determinado" is a
 * real answer and not a way of giving up.
 */
export const QA_CAUSE_DEFINITIONS: QATermDefinition[] = [
  {
    value: 'content-gap',
    means: 'falta material, o dos partes del curso dicen cosas distintas',
    example: 'el ejercicio depende de un concepto que ninguna sección anterior llega a introducir.',
  },
  {
    value: 'logic-state',
    means: 'el programa calcula mal, o recuerda mal lo que ya pasó',
    example: 'marcas un ejercicio como completo, cambias de pestaña, vuelves, y aparece sin completar.',
  },
  {
    value: 'navigation',
    means: 'llegas a donde no debías, o no puedes llegar a donde sí',
    example: 'cerrar el glosario te deja en la portada en vez de la sección que estabas leyendo.',
  },
  {
    value: 'data-persistence',
    means: 'lo que se guardó no sobrevive, o se guarda algo que no era',
    example: 'el progreso desaparece al recargar en una ventana privada, sin ningún aviso de que no se estaba guardando.',
  },
  {
    value: 'browser-device',
    means: 'depende del entorno: un navegador, una versión, un sistema o un tamaño concreto',
    example: 'solo ocurre en Firefox en Windows, y no se reproduce en Chrome ni en el mismo Firefox en macOS.',
  },
  {
    value: 'accessibility',
    means: 'la barrera es de acceso y no de lógica: el contenido está, y hay quien no puede alcanzarlo',
    example: 'el foco del teclado nunca entra al tutorial; Tab salta directamente al formulario que está detrás.',
  },
  {
    value: 'visual-layout',
    means: 'los elementos se pisan, se cortan o se salen de su caja',
    example: 'a 1024 px de ancho el encabezado suma 1067 px y empuja toda la página a desplazamiento horizontal.',
  },
  {
    value: 'unknown',
    means: 'lo viste, lo puedes reproducir, y no tienes una hipótesis honesta de por qué',
    example: 'falla una de cada cinco veces sin que cambies nada entre intento e intento.',
  },
]

/**
 * Every severity. All four measure one thing: what the person who hits this can
 * still do. Not how annoying it is, and not how hard it looks to fix -- that is
 * the reviewer's problem, not the tester's.
 */
export const QA_SEVERITY_DEFINITIONS: QATermDefinition[] = [
  {
    value: 'blocker',
    means: 'no hay manera de seguir y no existe ningún rodeo',
    example: 'el examen final no carga, así que nadie puede cerrar el nivel por ninguna vía.',
  },
  {
    value: 'high',
    means: 'hay rodeo, pero es caro, o nadie lo encontraría sin que se lo cuenten',
    example: 'guardar falla siempre, salvo que borres a mano el almacenamiento del sitio antes de cada intento.',
  },
  {
    value: 'medium',
    means: 'estorba de verdad y aun así puedes seguir por tu cuenta',
    example: 'un diagrama se corta en el móvil, y el párrafo de al lado explica lo mismo en palabras.',
  },
  {
    value: 'low',
    means: 'cosmético o de detalle: nadie se queda sin hacer nada por esto',
    example: 'falta una tilde en el título de una sección.',
  },
]

export const QA_TOUR_STEPS: QATourStep[] = [
  {
    id: 'welcome',
    title: 'Reportar bien es una habilidad, no un formulario',
    body:
      'Un reporte sirve cuando otra persona puede reproducir el problema sin preguntarte nada. '
      + 'Este recorrido dura unos cinco minutos y practica lo único que se te va a hacer difícil: '
      + 'elegir entre categorías que se parecen. Puedes saltarlo y volver cuando quieras.',
  },
  {
    id: 'tipo',
    title: 'Tipo: qué clase de problema es',
    target: '[data-testid="qa-category"]',
    body:
      'Tres de las nueve opciones hablan de las palabras en pantalla y conviene separarlas ahora. '
      + '**Contenido** es una afirmación equivocada. **Término no explicado** es una palabra que el '
      + 'curso usa antes de definirla. **Pregunta no respondible** es un ejercicio que no se puede '
      + 'contestar con lo enseñado hasta ahí, aunque todo lo demás sea correcto.',
    exercise: {
      // Verifiable against the live index: S06 is "Colecciones y estructuras de
      // datos" and pandas is first taught in S15, "Pandas: ingesta, selección y
      // tipos". The example this replaced used S12 and S08 in the wrong order --
      // S08 teaches CSV and comes first -- so the scenario did not demonstrate a
      // missing prerequisite and the "correct" answer did not follow from it.
      symptom:
        'En S06 el ejercicio pide resolverlo con un DataFrame de pandas, pero S06 trata de '
        + 'colecciones de Python y pandas se enseña por primera vez en S15, nueve secciones '
        + 'más adelante.',
      field: 'category',
      fieldLabel: 'Tipo',
      options: [
        {
          value: 'unanswerable-question',
          label: 'Pregunta no respondible',
          feedback:
            'Correcto. Nada de lo dicho hasta aquí permite resolverlo. El enunciado no está mal '
            + 'escrito ni la afirmación es falsa: falta el material para contestarlo.',
        },
        {
          value: 'content',
          label: 'Contenido',
          feedback:
            'Es la categoría de una afirmación equivocada. Aquí no hay nada incorrecto: hay algo '
            + 'ausente. Si la reportas como Contenido, quien revise buscará un error que no existe.',
        },
        {
          value: 'unexplained-term',
          label: 'Término no explicado',
          feedback:
            'Cerca, y es la confusión que más cuesta. Ese tipo es para una palabra suelta usada '
            + 'sin definir dentro de un texto que por lo demás se sostiene. Aquí lo que falla es '
            + 'el ejercicio completo, no una palabra.',
        },
        {
          value: 'assessment-design',
          label: 'Diseño de ejercicio/examen',
          feedback:
            'Ese es para cuando el ejercicio sí es respondible pero está mal construido: opciones '
            + 'ambiguas, dos respuestas válidas, la correcta siempre la más larga.',
        },
      ],
      correct: 'unanswerable-question',
      rule:
        'Pregúntate qué falta. Si falta una definición, es Término no explicado. Si falta material '
        + 'para poder responder, es Pregunta no respondible. Si lo que hay es falso, es Contenido.',
    },
    definitions: 'category',
  },
  {
    id: 'causa',
    title: 'Causa probable: dónde crees que está el origen',
    target: '[data-testid="qa-cause"]',
    body:
      'Es una hipótesis, no un diagnóstico, y **No determinado** es una respuesta legítima cuando '
      + 'de verdad no lo sabes. Ojo con una trampa del formulario: **Accesibilidad** aparece en las '
      + 'dos listas. Como *tipo* significa que alguien no puede usar la plataforma; como *causa* '
      + 'significa que el origen del fallo está en el marcado o en los roles.',
    exercise: {
      symptom:
        'El botón «Siguiente» no aparece en pantallas de 320 px: se sale del contenedor y queda '
        + 'cortado. Con el teclado sí se puede alcanzar y el lector de pantalla lo anuncia bien.',
      field: 'cause',
      fieldLabel: 'Causa probable',
      options: [
        {
          value: 'visual-layout',
          label: 'Diseño / maquetación',
          feedback:
            'Correcto. El elemento existe, es alcanzable y está anunciado; lo que falla es dónde '
            + 'se dibuja. Ese es el territorio de maquetación.',
        },
        {
          value: 'accessibility',
          label: 'Accesibilidad',
          feedback:
            'Es la trampa de este campo. El teclado llega y el lector lo anuncia, así que el árbol '
            + 'de accesibilidad está bien. Si además fuera inalcanzable con teclado, entonces sí.',
        },
        {
          value: 'browser-device',
          label: 'Navegador / dispositivo',
          feedback:
            'Sería esta si fallara solo en un navegador concreto. Un ancho de 320 px no es un '
            + 'navegador: es un tamaño, y el diseño debe responder a él.',
        },
        {
          value: 'unknown',
          label: 'No determinado',
          feedback:
            'Siempre es válido, pero aquí tienes evidencia suficiente para arriesgar una hipótesis. '
            + 'Resérvalo para cuando de verdad no puedas acotarlo.',
        },
      ],
      correct: 'visual-layout',
      rule:
        'Accesibilidad como causa es sobre si se puede percibir y operar. Si el elemento se percibe '
        + 'y se opera bien y solo está mal colocado, es maquetación.',
    },
    definitions: 'cause',
  },
  {
    id: 'severidad',
    title: 'Severidad: cuánto bloquea, no cuánto molesta',
    target: '[data-testid="qa-severity"]',
    body:
      'La pregunta que decide es una sola: **¿existe una forma de seguir?** Bloqueante significa que '
      + 'no la hay. Alta significa que la hay pero es cara o poco evidente. Media y Baja son grados '
      + 'de estorbo. Lo visible que sea un problema no es su severidad: una errata en cada página '
      + 'del curso sigue siendo Baja.',
    exercise: {
      symptom:
        'La sección S07 no carga: la pantalla queda en blanco y la consola muestra un error. No hay '
        + 'otra ruta para llegar a ese contenido.',
      field: 'severity',
      fieldLabel: 'Severidad',
      options: [
        {
          value: 'blocker',
          label: 'Bloqueante',
          feedback:
            'Correcto, y el motivo importa: no es «grave porque es una pantalla en blanco», es '
            + 'bloqueante porque no existe ninguna forma de llegar a ese contenido.',
        },
        {
          value: 'high',
          label: 'Alta',
          feedback:
            'Alta es para lo que se puede sortear con esfuerzo. Aquí no hay rodeo posible, y '
            + 'marcarlo Alta lo pone en la misma cola que cosas que sí tienen salida.',
        },
        {
          value: 'medium',
          label: 'Media',
          feedback:
            'Media describe fricción, no imposibilidad. Un contenido inalcanzable no es fricción.',
        },
        {
          value: 'low',
          label: 'Baja',
          feedback:
            'Baja es para lo cosmético. Nada de lo que impide aprender es cosmético.',
        },
      ],
      correct: 'blocker',
      rule:
        'Antes de elegir, escribe el rodeo. Si no puedes escribirlo, es Bloqueante. Si lo escribes '
        + 'y es incómodo, es Alta. Si lo escribes y es trivial, Media o Baja.',
    },
    definitions: 'severity',
  },
  {
    id: 'evidencia',
    title: 'Lo que hace reproducible un reporte',
    target: '[data-testid="qa-description"]',
    body:
      'Separa **qué esperabas** de **qué viste**: quien lo lea necesita las dos para saber si el '
      + 'fallo es el comportamiento o tu expectativa. En los pasos, incluye los datos exactos que '
      + 'usaste — «respondí 3» y no «respondí mal» —, porque el valor concreto suele ser el que '
      + 'dispara el problema. El workspace ya adjunta tu sección, viewport y navegador; no hace '
      + 'falta que los escribas.',
  },
  {
    id: 'done',
    title: 'Listo',
    body:
      'Una última cosa que ahorra tiempo a todos: un reporte por problema. Dos fallos en un mismo '
      + 'texto se cierran por separado, y unidos suelen cerrarse a medias. Puedes volver a abrir '
      + 'este recorrido cuando quieras desde el botón **Tutorial**.',
  },
]

export const QA_TOUR_STORAGE_KEY = 'pyarcana:qaTourCompleted'
