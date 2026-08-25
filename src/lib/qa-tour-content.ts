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

export interface QATourStep {
  id: string
  title: string
  /** Highlighted element inside the QA dialog, if any. */
  target?: string
  body: string
  exercise?: QAExercise
}

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
