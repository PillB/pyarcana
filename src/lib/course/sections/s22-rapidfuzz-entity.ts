import type { CourseSection } from '../../types'

export const section22: CourseSection = {
  id: 'rapidfuzz-entity',
  index: 22,
  title: 'RapidFuzz y Resolución de Entidades a Escala',
  shortTitle: 'RapidFuzz y Resolución de Enti',
  tagline: 'Los datos del mundo real están sucios. Esta sección te enseña a reconciliarlos como un profesional.',
  estimatedHours: 10,
  level: 'Competente',
  phase: 1,
  icon: 'GitCompare',
  accentColor: 'bg-gradient-to-br from-blue-500 to-indigo-600',
  jobRelevance: 'Entity resolution (ER) y fuzzy matching son técnicas críticas en Data Engineering, Master Data Management y proyectos de integración. El proyecto \'Familiarity Score Dashboard\' del curso lo requiere explícitamente. RapidFuzz es hasta 20x más rápido que fuzzywuzzy y es el estándar actual. En proyectos de linkage de datos peruanos (DNI, nombres, direcciones), estas técnicas son indispensables.',
  learningOutcomes: [
    { text: 'Usar RapidFuzz con las métricas correctas: ratio, partial_ratio, token_sort_ratio, WRatio, jaro_winkler' },
    { text: 'Implementar el pipeline de 4 pasos: normalizar → bloquear → matchear → auditar' },
    { text: 'Diseñar estrategias de blocking por campo de alta cardinalidad para escalar a O(n log n)' },
    { text: 'Entender cuándo RapidFuzz es suficiente vs cuándo escalar a Splink o dedupe.io' },
    { text: 'Aplicar entity resolution a datos peruanos: nombres, DNIs, distritos, empresas' },
    { text: 'Construir el Familiarity Score Dashboard completo (Capstone del curso)' },
    { text: 'Integrar el resultado con el mapa interactivo Leaflet de la sección 9' },
  ],
  theory: [
    {
      heading: 'Distancias de strings: Levenshtein, Jaro-Winkler, Coseno, Hamming — cuándo usar cada una',
      paragraphs: [
        'En esta lección vamos a explorar distancias de strings: levenshtein, jaro-winkler, coseno, hamming — cuándo usar cada una en profundidad. Este concepto es fundamental para tu crecimiento como profesional de Data Science y automatización. En el mercado laboral peruano e internacional, dominar este tema te diferencia claramente de otros candidatos.',

        'La clave para entender distancias de strings: levenshtein, jaro-winkler, coseno, hamming — cuándo usar cada una es practicar con ejemplos reales. No basta con leer la teoría — necesitas escribir código, cometer errores, y aprender de ellos. Por eso cada concepto viene acompañado de ejemplos prácticos que puedes ejecutar en el editor interactivo.',

        'En producción, distancias de strings: levenshtein, jaro-winkler, coseno, hamming — cuándo usar cada una se usa diario en empresas como Interbank, BBVA, Mercado Libre y Rimac. Los equipos de data science y automatización dependen de este conocimiento para construir pipelines robustos y escalables.',
      ],
    },
    {
      heading: 'RapidFuzz API: fuzz.ratio, fuzz.partial_ratio, fuzz.token_sort_ratio, process.extract, process.cdist',
      paragraphs: [
        'En esta lección vamos a explorar rapidfuzz api: fuzz.ratio, fuzz.partial_ratio, fuzz.token_sort_ratio, process.extract, process.cdist en profundidad. Este concepto es fundamental para tu crecimiento como profesional de Data Science y automatización. En el mercado laboral peruano e internacional, dominar este tema te diferencia claramente de otros candidatos.',

        'La clave para entender rapidfuzz api: fuzz.ratio, fuzz.partial_ratio, fuzz.token_sort_ratio, process.extract, process.cdist es practicar con ejemplos reales. No basta con leer la teoría — necesitas escribir código, cometer errores, y aprender de ellos. Por eso cada concepto viene acompañado de ejemplos prácticos que puedes ejecutar en el editor interactivo.',

        'En producción, rapidfuzz api: fuzz.ratio, fuzz.partial_ratio, fuzz.token_sort_ratio, process.extract, process.cdist se usa diario en empresas como Interbank, BBVA, Mercado Libre y Rimac. Los equipos de data science y automatización dependen de este conocimiento para construir pipelines robustos y escalables.',
      ],
    },
    {
      heading: 'Pipeline de 4 pasos (patrón de producción): Paso 1 Normalizar (mayúsculas, stripear, quitar tildes, colapsar variantes); Paso 2 Bloquear (particionar por campo alta cardinalidad, escala O(n²) → O(n)); Paso 3 Matchear (RapidFuzz dentro de cada bloque con umbral configurable); Paso 4 Auditar (loggear cada merge con keys originales, score, regla, timestamp — reversible)',
      paragraphs: [
        'En esta lección vamos a explorar pipeline de 4 pasos (patrón de producción): paso 1 normalizar (mayúsculas, stripear, quitar tildes, colapsar variantes); paso 2 bloquear (particionar por campo alta cardinalidad, escala o(n²) → o(n)); paso 3 matchear (rapidfuzz dentro de cada bloque con umbral configurable); paso 4 auditar (loggear cada merge con keys originales, score, regla, timestamp — reversible) en profundidad. Este concepto es fundamental para tu crecimiento como profesional de Data Science y automatización. En el mercado laboral peruano e internacional, dominar este tema te diferencia claramente de otros candidatos.',

        'La clave para entender pipeline de 4 pasos (patrón de producción): paso 1 normalizar (mayúsculas, stripear, quitar tildes, colapsar variantes); paso 2 bloquear (particionar por campo alta cardinalidad, escala o(n²) → o(n)); paso 3 matchear (rapidfuzz dentro de cada bloque con umbral configurable); paso 4 auditar (loggear cada merge con keys originales, score, regla, timestamp — reversible) es practicar con ejemplos reales. No basta con leer la teoría — necesitas escribir código, cometer errores, y aprender de ellos. Por eso cada concepto viene acompañado de ejemplos prácticos que puedes ejecutar en el editor interactivo.',

        'En producción, pipeline de 4 pasos (patrón de producción): paso 1 normalizar (mayúsculas, stripear, quitar tildes, colapsar variantes); paso 2 bloquear (particionar por campo alta cardinalidad, escala o(n²) → o(n)); paso 3 matchear (rapidfuzz dentro de cada bloque con umbral configurable); paso 4 auditar (loggear cada merge con keys originales, score, regla, timestamp — reversible) se usa diario en empresas como Interbank, BBVA, Mercado Libre y Rimac. Los equipos de data science y automatización dependen de este conocimiento para construir pipelines robustos y escalables.',
      ],
    },
    {
      heading: 'Fuzzy matching de DNIs y nombres peruanos: variantes de nombres hispanos, abreviaciones, transliteraciones',
      paragraphs: [
        'En esta lección vamos a explorar fuzzy matching de dnis y nombres peruanos: variantes de nombres hispanos, abreviaciones, transliteraciones en profundidad. Este concepto es fundamental para tu crecimiento como profesional de Data Science y automatización. En el mercado laboral peruano e internacional, dominar este tema te diferencia claramente de otros candidatos.',

        'La clave para entender fuzzy matching de dnis y nombres peruanos: variantes de nombres hispanos, abreviaciones, transliteraciones es practicar con ejemplos reales. No basta con leer la teoría — necesitas escribir código, cometer errores, y aprender de ellos. Por eso cada concepto viene acompañado de ejemplos prácticos que puedes ejecutar en el editor interactivo.',

        'En producción, fuzzy matching de dnis y nombres peruanos: variantes de nombres hispanos, abreviaciones, transliteraciones se usa diario en empresas como Interbank, BBVA, Mercado Libre y Rimac. Los equipos de data science y automatización dependen de este conocimiento para construir pipelines robustos y escalables.',
      ],
    },
    {
      heading: 'Umbral óptimo: cómo calibrar el threshold usando un conjunto de pares etiquetados manualmente',
      paragraphs: [
        'En esta lección vamos a explorar umbral óptimo: cómo calibrar el threshold usando un conjunto de pares etiquetados manualmente en profundidad. Este concepto es fundamental para tu crecimiento como profesional de Data Science y automatización. En el mercado laboral peruano e internacional, dominar este tema te diferencia claramente de otros candidatos.',

        'La clave para entender umbral óptimo: cómo calibrar el threshold usando un conjunto de pares etiquetados manualmente es practicar con ejemplos reales. No basta con leer la teoría — necesitas escribir código, cometer errores, y aprender de ellos. Por eso cada concepto viene acompañado de ejemplos prácticos que puedes ejecutar en el editor interactivo.',

        'En producción, umbral óptimo: cómo calibrar el threshold usando un conjunto de pares etiquetados manualmente se usa diario en empresas como Interbank, BBVA, Mercado Libre y Rimac. Los equipos de data science y automatización dependen de este conocimiento para construir pipelines robustos y escalables.',
      ],
    },
    {
      heading: 'Escalando a Splink: cuándo los señales de \'blocking inestable\', \'ground truth contestado\' o \'schema churn\' indican que necesitas más potencia',
      paragraphs: [
        'En esta lección vamos a explorar escalando a splink: cuándo los señales de \'blocking inestable\', \'ground truth contestado\' o \'schema churn\' indican que necesitas más potencia en profundidad. Este concepto es fundamental para tu crecimiento como profesional de Data Science y automatización. En el mercado laboral peruano e internacional, dominar este tema te diferencia claramente de otros candidatos.',

        'La clave para entender escalando a splink: cuándo los señales de \'blocking inestable\', \'ground truth contestado\' o \'schema churn\' indican que necesitas más potencia es practicar con ejemplos reales. No basta con leer la teoría — necesitas escribir código, cometer errores, y aprender de ellos. Por eso cada concepto viene acompañado de ejemplos prácticos que puedes ejecutar en el editor interactivo.',

        'En producción, escalando a splink: cuándo los señales de \'blocking inestable\', \'ground truth contestado\' o \'schema churn\' indican que necesitas más potencia se usa diario en empresas como Interbank, BBVA, Mercado Libre y Rimac. Los equipos de data science y automatización dependen de este conocimiento para construir pipelines robustos y escalables.',
      ],
    },
    {
      heading: 'Integración con pandas: process.cdist() para matrices de similaridad vectorizadas',
      paragraphs: [
        'En esta lección vamos a explorar integración con pandas: process.cdist() para matrices de similaridad vectorizadas en profundidad. Este concepto es fundamental para tu crecimiento como profesional de Data Science y automatización. En el mercado laboral peruano e internacional, dominar este tema te diferencia claramente de otros candidatos.',

        'La clave para entender integración con pandas: process.cdist() para matrices de similaridad vectorizadas es practicar con ejemplos reales. No basta con leer la teoría — necesitas escribir código, cometer errores, y aprender de ellos. Por eso cada concepto viene acompañado de ejemplos prácticos que puedes ejecutar en el editor interactivo.',

        'En producción, integración con pandas: process.cdist() para matrices de similaridad vectorizadas se usa diario en empresas como Interbank, BBVA, Mercado Libre y Rimac. Los equipos de data science y automatización dependen de este conocimiento para construir pipelines robustos y escalables.',
      ],
    },
  ],
  iDo: {
    intro: 'Te muestro paso a paso cómo aplicar los conceptos de esta sección con ejemplos prácticos.',
    steps: [
      {
        description: 'Cargar un dataset de empresas peruanas con nombres sucios y demostrar las 5 métricas de RapidFuzz',
        code: {
          language: 'python',
          title: 'ejemplo.py',
          code: '# Ejemplo de: Cargar un dataset de empresas peruanas con nombres sucios y demostrar las 5 métricas de RapidFuzz\n# TODO: Implementar el código completo\nprint("Implementar este ejemplo")',
        },
        why: 'Este paso es importante porque demuestra el concepto en acción y te muestra el patrón correcto a seguir.',
      },
      {
        description: 'Implementar el pipeline completo de 4 pasos en un Jupyter Notebook con logging de merges',
        code: {
          language: 'python',
          title: 'ejemplo.py',
          code: '# Ejemplo de: Implementar el pipeline completo de 4 pasos en un Jupyter Notebook con logging de merges\n# TODO: Implementar el código completo\nprint("Implementar este ejemplo")',
        },
        why: 'Este paso es importante porque demuestra el concepto en acción y te muestra el patrón correcto a seguir.',
      },
      {
        description: 'Visualizar la distribución de scores con histograma para elegir el umbral',
        code: {
          language: 'python',
          title: 'ejemplo.py',
          code: '# Ejemplo de: Visualizar la distribución de scores con histograma para elegir el umbral\n# TODO: Implementar el código completo\nprint("Implementar este ejemplo")',
        },
        why: 'Este paso es importante porque demuestra el concepto en acción y te muestra el patrón correcto a seguir.',
      },
    ],
  },
  weDo: {
    intro: 'Ahora te toca a ti practicar con guía. Lee cada instrucción, intenta escribir el código, y si te trabas revisa la solución.',
    steps: [
      {
        instruction: 'Construir un blocker por distrito (Lima/Callao/Arequipa) que reduce comparaciones en un 90%',
        hint: 'Piensa en cómo descomponer el problema en pasos más pequeños.',
        starterCode: {
          language: 'python',
          title: 'ejercicio.py',
          code: '# Tu código aquí\n# Construir un blocker por distrito (Lima/Callao/Arequipa) que reduce comparaciones en un 90%\n',
        },
        solutionCode: {
          language: 'python',
          title: 'solucion.py',
          code: '# Solución\n# Construir un blocker por distrito (Lima/Callao/Arequipa) que reduce comparaciones en un 90%\nprint("Solución implementada")',
        },
      },
      {
        instruction: 'Implementar process.cdist() para calcular la matriz de similaridad de 10,000 nombres en < 2 segundos',
        hint: 'Piensa en cómo descomponer el problema en pasos más pequeños.',
        starterCode: {
          language: 'python',
          title: 'ejercicio.py',
          code: '# Tu código aquí\n# Implementar process.cdist() para calcular la matriz de similaridad de 10,000 nombres en < 2 segundos\n',
        },
        solutionCode: {
          language: 'python',
          title: 'solucion.py',
          code: '# Solución\n# Implementar process.cdist() para calcular la matriz de similaridad de 10,000 nombres en < 2 segundos\nprint("Solución implementada")',
        },
      },
      {
        instruction: 'Crear el log de auditoría en SQLite que permite deshacer merges erróneos',
        hint: 'Piensa en cómo descomponer el problema en pasos más pequeños.',
        starterCode: {
          language: 'python',
          title: 'ejercicio.py',
          code: '# Tu código aquí\n# Crear el log de auditoría en SQLite que permite deshacer merges erróneos\n',
        },
        solutionCode: {
          language: 'python',
          title: 'solucion.py',
          code: '# Solución\n# Crear el log de auditoría en SQLite que permite deshacer merges erróneos\nprint("Solución implementada")',
        },
      },
    ],
  },
  youDo: {
    title: 'Familiarity Score Dashboard Completo',
    context: 'Capstone Progresivo del curso (construido a lo largo de secciones 6-13, ahora completado): pipeline completo (carga Excel/CSV de clientes → normalización → entity resolution con RapidFuzz → cálculo del Familiarity Score); el Familiarity Score combina frecuencia de transacciones, recency, proximidad geográfica (coordenadas); mapa interactivo Leaflet (sección 9) con score como heatmap; API FastAPI (sección 21) que expone el score por cliente; log de auditoría de todos los merges realizados; dashboard Streamlit (sección 25) para que el VP pueda usarlo sin código.',
    objectives: [
      'Aplicar los conceptos aprendidos en un proyecto real',
      'Demostrar dominio del tema con un entregable de portafolio',
      'Documentar el proceso y los resultados',
    ],
    requirements: [
      'Código funcional y documentado',
      'Tests que validen el funcionamiento',
      'README con instrucciones de uso',
    ],
    portfolioNote: 'Este proyecto es ideal para mostrar en entrevistas técnicas y agregar a tu portafolio de GitHub.',
    rubric: [
      { criterion: 'Funcionalidad', weight: '40%' },
      { criterion: 'Calidad de código', weight: '20%' },
      { criterion: 'Documentación', weight: '20%' },
      { criterion: 'Tests', weight: '20%' },
    ],
  },
  selfCheck: {
    questions: [
      {
        question: '¿Cuál de los siguientes describe mejor: Usar RapidFuzz con las métricas correctas: ratio, partial_ratio, token_sort_ratio, WRatio, jaro_winkler?',
        options: [
          'Respuesta correcta',
          'Respuesta incorrecta 1',
          'Respuesta incorrecta 2',
          'Respuesta incorrecta 3',
        ],
        correctIndex: 0,
        explanation: 'Esta es la respuesta correcta porque aplica el concepto de manera precisa.',
      },
      {
        question: '¿Cuál de los siguientes describe mejor: Implementar el pipeline de 4 pasos: normalizar → bloquear → matchear → auditar?',
        options: [
          'Respuesta correcta',
          'Respuesta incorrecta 1',
          'Respuesta incorrecta 2',
          'Respuesta incorrecta 3',
        ],
        correctIndex: 0,
        explanation: 'Esta es la respuesta correcta porque aplica el concepto de manera precisa.',
      },
      {
        question: '¿Cuál de los siguientes describe mejor: Diseñar estrategias de blocking por campo de alta cardinalidad para escalar a O(n log n)?',
        options: [
          'Respuesta correcta',
          'Respuesta incorrecta 1',
          'Respuesta incorrecta 2',
          'Respuesta incorrecta 3',
        ],
        correctIndex: 0,
        explanation: 'Esta es la respuesta correcta porque aplica el concepto de manera precisa.',
      },
      {
        question: '¿Cuál de los siguientes describe mejor: Entender cuándo RapidFuzz es suficiente vs cuándo escalar a Splink o dedupe.io?',
        options: [
          'Respuesta correcta',
          'Respuesta incorrecta 1',
          'Respuesta incorrecta 2',
          'Respuesta incorrecta 3',
        ],
        correctIndex: 0,
        explanation: 'Esta es la respuesta correcta porque aplica el concepto de manera precisa.',
      },
      {
        question: '¿Cuál de los siguientes describe mejor: Aplicar entity resolution a datos peruanos: nombres, DNIs, distritos, empresas?',
        options: [
          'Respuesta correcta',
          'Respuesta incorrecta 1',
          'Respuesta incorrecta 2',
          'Respuesta incorrecta 3',
        ],
        correctIndex: 0,
        explanation: 'Esta es la respuesta correcta porque aplica el concepto de manera precisa.',
      },
    ],
  },
  resources: {
    docs: [
      { label: 'RapidFuzz GitHub', url: 'RapidFuzz GitHub' },
      { label: 'RapidFuzz docs', url: 'RapidFuzz docs' },
      { label: 'Fuzzy record linkage — producción (kinyoubiatelier.com)', url: 'Fuzzy record linkage — producción (kinyoubiatelier.com)' },
      { label: 'Splink — advanced entity resolution', url: 'Splink — advanced entity resolution' },
    ],
    books: [
      { label: 'Python 201 — Michael Driscoll', note: 'Capítulos relevantes para esta sección' },
    ],
    courses: [
      { label: 'Real Python', url: 'https://realpython.com', note: 'Tutoriales complementarios' },
    ],
  },
}
