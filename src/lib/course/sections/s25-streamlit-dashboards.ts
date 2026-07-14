import type { CourseSection } from '../../types'

export const section25: CourseSection = {
  id: 'streamlit-dashboards',
  index: 25,
  title: 'Dashboards Interactivos y Streamlit',
  shortTitle: 'Dashboards Interactivos y Stre',
  tagline: 'Comparte tus análisis con el mundo sin escribir HTML ni JavaScript.',
  estimatedHours: 10,
  level: 'Competente',
  phase: 1,
  icon: 'LayoutDashboard',
  accentColor: 'bg-gradient-to-br from-blue-500 to-indigo-600',
  jobRelevance: 'Streamlit es la herramienta estándar para que Data Scientists compartan aplicaciones con stakeholders sin necesitar un frontend developer. Los roles de Data Scientist/AI Engineer en USA frecuentemente requieren \'capacidad de construir demos y herramientas internas\'. Streamlit Community Cloud permite deployment gratuito.',
  learningOutcomes: [
    { text: 'Construir aplicaciones multi-página con Streamlit' },
    { text: 'Usar componentes clave: st.dataframe, st.charts, st.forms, st.sidebar, st.chat_message' },
    { text: 'Implementar caching con @st.cache_data y @st.cache_resource' },
    { text: 'Integrar plotly charts interactivos en Streamlit' },
    { text: 'Conectar Streamlit a bases de datos PostgreSQL usando st.connection' },
    { text: 'Desplegar en Streamlit Community Cloud (gratis) o Hugging Face Spaces' },
    { text: 'Construir un chatbot UI sobre el RAG de la sección 20' },
  ],
  theory: [
    {
      heading: 'Streamlit architecture: cómo funciona el rerun model, session_state, caching',
      paragraphs: [
        'En esta lección vamos a explorar streamlit architecture: cómo funciona el rerun model, session_state, caching en profundidad. Este concepto es fundamental para tu crecimiento como profesional de Data Science y automatización. En el mercado laboral peruano e internacional, dominar este tema te diferencia claramente de otros candidatos.',

        'La clave para entender streamlit architecture: cómo funciona el rerun model, session_state, caching es practicar con ejemplos reales. No basta con leer la teoría — necesitas escribir código, cometer errores, y aprender de ellos. Por eso cada concepto viene acompañado de ejemplos prácticos que puedes ejecutar en el editor interactivo.',

        'En producción, streamlit architecture: cómo funciona el rerun model, session_state, caching se usa diario en empresas como Interbank, BBVA, Mercado Libre y Rimac. Los equipos de data science y automatización dependen de este conocimiento para construir pipelines robustos y escalables.',
      ],
    },
    {
      heading: 'Layouts: st.columns, st.tabs, st.expander, st.sidebar, páginas múltiples',
      paragraphs: [
        'En esta lección vamos a explorar layouts: st.columns, st.tabs, st.expander, st.sidebar, páginas múltiples en profundidad. Este concepto es fundamental para tu crecimiento como profesional de Data Science y automatización. En el mercado laboral peruano e internacional, dominar este tema te diferencia claramente de otros candidatos.',

        'La clave para entender layouts: st.columns, st.tabs, st.expander, st.sidebar, páginas múltiples es practicar con ejemplos reales. No basta con leer la teoría — necesitas escribir código, cometer errores, y aprender de ellos. Por eso cada concepto viene acompañado de ejemplos prácticos que puedes ejecutar en el editor interactivo.',

        'En producción, layouts: st.columns, st.tabs, st.expander, st.sidebar, páginas múltiples se usa diario en empresas como Interbank, BBVA, Mercado Libre y Rimac. Los equipos de data science y automatización dependen de este conocimiento para construir pipelines robustos y escalables.',
      ],
    },
    {
      heading: 'Widgets: st.file_uploader, st.selectbox, st.slider, st.text_input, st.form',
      paragraphs: [
        'En esta lección vamos a explorar widgets: st.file_uploader, st.selectbox, st.slider, st.text_input, st.form en profundidad. Este concepto es fundamental para tu crecimiento como profesional de Data Science y automatización. En el mercado laboral peruano e internacional, dominar este tema te diferencia claramente de otros candidatos.',

        'La clave para entender widgets: st.file_uploader, st.selectbox, st.slider, st.text_input, st.form es practicar con ejemplos reales. No basta con leer la teoría — necesitas escribir código, cometer errores, y aprender de ellos. Por eso cada concepto viene acompañado de ejemplos prácticos que puedes ejecutar en el editor interactivo.',

        'En producción, widgets: st.file_uploader, st.selectbox, st.slider, st.text_input, st.form se usa diario en empresas como Interbank, BBVA, Mercado Libre y Rimac. Los equipos de data science y automatización dependen de este conocimiento para construir pipelines robustos y escalables.',
      ],
    },
    {
      heading: 'Conexiones: st.connection para PostgreSQL, CSV, APIs',
      paragraphs: [
        'En esta lección vamos a explorar conexiones: st.connection para postgresql, csv, apis en profundidad. Este concepto es fundamental para tu crecimiento como profesional de Data Science y automatización. En el mercado laboral peruano e internacional, dominar este tema te diferencia claramente de otros candidatos.',

        'La clave para entender conexiones: st.connection para postgresql, csv, apis es practicar con ejemplos reales. No basta con leer la teoría — necesitas escribir código, cometer errores, y aprender de ellos. Por eso cada concepto viene acompañado de ejemplos prácticos que puedes ejecutar en el editor interactivo.',

        'En producción, conexiones: st.connection para postgresql, csv, apis se usa diario en empresas como Interbank, BBVA, Mercado Libre y Rimac. Los equipos de data science y automatización dependen de este conocimiento para construir pipelines robustos y escalables.',
      ],
    },
    {
      heading: 'Chat interfaces: st.chat_message, st.chat_input, streaming con generators',
      paragraphs: [
        'En esta lección vamos a explorar chat interfaces: st.chat_message, st.chat_input, streaming con generators en profundidad. Este concepto es fundamental para tu crecimiento como profesional de Data Science y automatización. En el mercado laboral peruano e internacional, dominar este tema te diferencia claramente de otros candidatos.',

        'La clave para entender chat interfaces: st.chat_message, st.chat_input, streaming con generators es practicar con ejemplos reales. No basta con leer la teoría — necesitas escribir código, cometer errores, y aprender de ellos. Por eso cada concepto viene acompañado de ejemplos prácticos que puedes ejecutar en el editor interactivo.',

        'En producción, chat interfaces: st.chat_message, st.chat_input, streaming con generators se usa diario en empresas como Interbank, BBVA, Mercado Libre y Rimac. Los equipos de data science y automatización dependen de este conocimiento para construir pipelines robustos y escalables.',
      ],
    },
    {
      heading: 'Performance: @st.cache_data para DataFrames, @st.cache_resource para modelos ML',
      paragraphs: [
        'En esta lección vamos a explorar performance: @st.cache_data para dataframes, @st.cache_resource para modelos ml en profundidad. Este concepto es fundamental para tu crecimiento como profesional de Data Science y automatización. En el mercado laboral peruano e internacional, dominar este tema te diferencia claramente de otros candidatos.',

        'La clave para entender performance: @st.cache_data para dataframes, @st.cache_resource para modelos ml es practicar con ejemplos reales. No basta con leer la teoría — necesitas escribir código, cometer errores, y aprender de ellos. Por eso cada concepto viene acompañado de ejemplos prácticos que puedes ejecutar en el editor interactivo.',

        'En producción, performance: @st.cache_data para dataframes, @st.cache_resource para modelos ml se usa diario en empresas como Interbank, BBVA, Mercado Libre y Rimac. Los equipos de data science y automatización dependen de este conocimiento para construir pipelines robustos y escalables.',
      ],
    },
    {
      heading: 'Deploy: Streamlit Community Cloud, Hugging Face Spaces, Docker',
      paragraphs: [
        'En esta lección vamos a explorar deploy: streamlit community cloud, hugging face spaces, docker en profundidad. Este concepto es fundamental para tu crecimiento como profesional de Data Science y automatización. En el mercado laboral peruano e internacional, dominar este tema te diferencia claramente de otros candidatos.',

        'La clave para entender deploy: streamlit community cloud, hugging face spaces, docker es practicar con ejemplos reales. No basta con leer la teoría — necesitas escribir código, cometer errores, y aprender de ellos. Por eso cada concepto viene acompañado de ejemplos prácticos que puedes ejecutar en el editor interactivo.',

        'En producción, deploy: streamlit community cloud, hugging face spaces, docker se usa diario en empresas como Interbank, BBVA, Mercado Libre y Rimac. Los equipos de data science y automatización dependen de este conocimiento para construir pipelines robustos y escalables.',
      ],
    },
  ],
  iDo: {
    intro: 'Te muestro paso a paso cómo aplicar los conceptos de esta sección con ejemplos prácticos.',
    steps: [
      {
        description: 'Construir un dashboard Streamlit multi-página que visualiza datos del pipeline ETL (sección 18)',
        code: {
          language: 'python',
          title: 'ejemplo.py',
          code: '# Ejemplo de: Construir un dashboard Streamlit multi-página que visualiza datos del pipeline ETL (sección 18)\n# TODO: Implementar el código completo\nprint("Implementar este ejemplo")',
        },
        why: 'Este paso es importante porque demuestra el concepto en acción y te muestra el patrón correcto a seguir.',
      },
      {
        description: 'Agregar filtros interactivos con sidebar y caching de queries PostgreSQL',
        code: {
          language: 'python',
          title: 'ejemplo.py',
          code: '# Ejemplo de: Agregar filtros interactivos con sidebar y caching de queries PostgreSQL\n# TODO: Implementar el código completo\nprint("Implementar este ejemplo")',
        },
        why: 'Este paso es importante porque demuestra el concepto en acción y te muestra el patrón correcto a seguir.',
      },
      {
        description: 'Añadir una página de chat que usa el RAG de la sección 20',
        code: {
          language: 'python',
          title: 'ejemplo.py',
          code: '# Ejemplo de: Añadir una página de chat que usa el RAG de la sección 20\n# TODO: Implementar el código completo\nprint("Implementar este ejemplo")',
        },
        why: 'Este paso es importante porque demuestra el concepto en acción y te muestra el patrón correcto a seguir.',
      },
    ],
  },
  weDo: {
    intro: 'Ahora te toca a ti practicar con guía. Lee cada instrucción, intenta escribir el código, y si te trabas revisa la solución.',
    steps: [
      {
        instruction: 'Conectar el Familiarity Score Dashboard (sección 22) a Streamlit con mapa Folium embebido',
        hint: 'Piensa en cómo descomponer el problema en pasos más pequeños.',
        starterCode: {
          language: 'python',
          title: 'ejercicio.py',
          code: '# Tu código aquí\n# Conectar el Familiarity Score Dashboard (sección 22) a Streamlit con mapa Folium embebido\n',
        },
        solutionCode: {
          language: 'python',
          title: 'solucion.py',
          code: '# Solución\n# Conectar el Familiarity Score Dashboard (sección 22) a Streamlit con mapa Folium embebido\nprint("Solución implementada")',
        },
      },
      {
        instruction: 'Implementar file uploader que procesa un Excel con pandas y muestra EDA automático',
        hint: 'Piensa en cómo descomponer el problema en pasos más pequeños.',
        starterCode: {
          language: 'python',
          title: 'ejercicio.py',
          code: '# Tu código aquí\n# Implementar file uploader que procesa un Excel con pandas y muestra EDA automático\n',
        },
        solutionCode: {
          language: 'python',
          title: 'solucion.py',
          code: '# Solución\n# Implementar file uploader que procesa un Excel con pandas y muestra EDA automático\nprint("Solución implementada")',
        },
      },
      {
        instruction: 'Desplegar en Streamlit Community Cloud y generar URL pública',
        hint: 'Piensa en cómo descomponer el problema en pasos más pequeños.',
        starterCode: {
          language: 'python',
          title: 'ejercicio.py',
          code: '# Tu código aquí\n# Desplegar en Streamlit Community Cloud y generar URL pública\n',
        },
        solutionCode: {
          language: 'python',
          title: 'solucion.py',
          code: '# Solución\n# Desplegar en Streamlit Community Cloud y generar URL pública\nprint("Solución implementada")',
        },
      },
    ],
  },
  youDo: {
    title: 'Analytics Dashboard Público',
    context: 'analytics-dashboard-public: dashboard multi-página (Overview, Análisis Temporal, Mapa Geográfico, Chatbot); página Overview con KPIs clave con st.metric y trends con plotly; página Mapa con Folium/plotly express con datos geolocalización; página Chatbot con interfaz de chat conectada al RAG de la sección 20; desplegado en Streamlit Community Cloud con URL pública en CV; README con screenshot del dashboard y link de acceso.',
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
        question: '¿Cuál de los siguientes describe mejor: Construir aplicaciones multi-página con Streamlit?',
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
        question: '¿Cuál de los siguientes describe mejor: Usar componentes clave: st.dataframe, st.charts, st.forms, st.sidebar, st.chat_message?',
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
        question: '¿Cuál de los siguientes describe mejor: Implementar caching con @st.cache_data y @st.cache_resource?',
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
        question: '¿Cuál de los siguientes describe mejor: Integrar plotly charts interactivos en Streamlit?',
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
        question: '¿Cuál de los siguientes describe mejor: Conectar Streamlit a bases de datos PostgreSQL usando st.connection?',
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
      { label: 'Streamlit docs', url: 'Streamlit docs' },
      { label: 'Streamlit Community Cloud', url: 'Streamlit Community Cloud' },
      { label: 'Plotly Express', url: 'Plotly Express' },
    ],
    books: [
      { label: 'Python 201 — Michael Driscoll', note: 'Capítulos relevantes para esta sección' },
    ],
    courses: [
      { label: 'Real Python', url: 'https://realpython.com', note: 'Tutoriales complementarios' },
    ],
  },
}
