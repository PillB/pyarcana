import type { CourseSection } from '../../types'

export const section15: CourseSection = {
  id: 'stdlib-deep',
  index: 15,
  title: 'Python Avanzado — stdlib Profunda',
  shortTitle: 'Python Avanzado — stdlib Profu',
  tagline: 'El Python que todos usan superficialmente. Tú lo dominarás en profundidad.',
  estimatedHours: 12,
  level: 'Competente',
  phase: 1,
  icon: 'Settings',
  accentColor: 'bg-gradient-to-br from-blue-500 to-indigo-600',
  jobRelevance: 'Las entrevistas técnicas de empresas US para roles Python Senior testean: context managers, functools, itertools, descriptors y type hints. Cubre íntegramente los capítulos de Python 201 que no tenían sección dedicada en v1: Ch. 3 (contextlib), Ch. 4 (functools), Ch. 8 (itertools), Ch. 10 (typing), Ch. 12 (Unicode), Ch. 16-18 (super, descriptors, scope).',
  learningOutcomes: [
    { text: 'Crear context managers con contextlib: contextmanager, closing, suppress, ExitStack' },
    { text: 'Usar functools avanzado: lru_cache, partial, singledispatch, wraps, reduce' },
    { text: 'Explotar itertools: infinite iterators (count, cycle, repeat), combinatorics (product, combinations, permutations), terminators (groupby, islice, chain)' },
    { text: 'Implementar descriptors con __get__, __set__, __delete__ para validación de atributos' },
    { text: 'Aplicar type hints completos con typing: Protocol, TypeVar, Generic, Literal, TypedDict, overload' },
    { text: 'Manejar Unicode y encoding correctamente en pipelines de datos con texto peruano (ñ, tildes, caracteres especiales)' },
    { text: 'Comprender MRO y super() en herencia múltiple (diamond problem)' },
    { text: 'Dominar scope: closures, nonlocal, fábricas de funciones' },
  ],
  theory: [
    {
      heading: 'Context Managers (Python 201, Ch. 3): with statement internals, __enter__/__exit__, contextlib.contextmanager, contextlib.ExitStack para múltiples CMs dinámicos',
      paragraphs: [
        'En esta lección vamos a explorar context managers (python 201, ch. 3): with statement internals, __enter__/__exit__, contextlib.contextmanager, contextlib.exitstack para múltiples cms dinámicos en profundidad. Este concepto es fundamental para tu crecimiento como profesional de Data Science y automatización. En el mercado laboral peruano e internacional, dominar este tema te diferencia claramente de otros candidatos.',

        'La clave para entender context managers (python 201, ch. 3): with statement internals, __enter__/__exit__, contextlib.contextmanager, contextlib.exitstack para múltiples cms dinámicos es practicar con ejemplos reales. No basta con leer la teoría — necesitas escribir código, cometer errores, y aprender de ellos. Por eso cada concepto viene acompañado de ejemplos prácticos que puedes ejecutar en el editor interactivo.',

        'En producción, context managers (python 201, ch. 3): with statement internals, __enter__/__exit__, contextlib.contextmanager, contextlib.exitstack para múltiples cms dinámicos se usa diario en empresas como Interbank, BBVA, Mercado Libre y Rimac. Los equipos de data science y automatización dependen de este conocimiento para construir pipelines robustos y escalables.',
      ],
    },
    {
      heading: 'functools avanzado (Python 201, Ch. 4): lru_cache(maxsize=128) memoización, partial para fijar argumentos (currying), singledispatch para function overloading por tipo, wraps para decorators que preservan __name__ y docstring',
      paragraphs: [
        'En esta lección vamos a explorar functools avanzado (python 201, ch. 4): lru_cache(maxsize=128) memoización, partial para fijar argumentos (currying), singledispatch para function overloading por tipo, wraps para decorators que preservan __name__ y docstring en profundidad. Este concepto es fundamental para tu crecimiento como profesional de Data Science y automatización. En el mercado laboral peruano e internacional, dominar este tema te diferencia claramente de otros candidatos.',

        'La clave para entender functools avanzado (python 201, ch. 4): lru_cache(maxsize=128) memoización, partial para fijar argumentos (currying), singledispatch para function overloading por tipo, wraps para decorators que preservan __name__ y docstring es practicar con ejemplos reales. No basta con leer la teoría — necesitas escribir código, cometer errores, y aprender de ellos. Por eso cada concepto viene acompañado de ejemplos prácticos que puedes ejecutar en el editor interactivo.',

        'En producción, functools avanzado (python 201, ch. 4): lru_cache(maxsize=128) memoización, partial para fijar argumentos (currying), singledispatch para function overloading por tipo, wraps para decorators que preservan __name__ y docstring se usa diario en empresas como Interbank, BBVA, Mercado Libre y Rimac. Los equipos de data science y automatización dependen de este conocimiento para construir pipelines robustos y escalables.',
      ],
    },
    {
      heading: 'itertools arsenal (Python 201, Ch. 8): count, cycle, repeat, chain, islice, groupby, product, combinations, permutations',
      paragraphs: [
        'En esta lección vamos a explorar itertools arsenal (python 201, ch. 8): count, cycle, repeat, chain, islice, groupby, product, combinations, permutations en profundidad. Este concepto es fundamental para tu crecimiento como profesional de Data Science y automatización. En el mercado laboral peruano e internacional, dominar este tema te diferencia claramente de otros candidatos.',

        'La clave para entender itertools arsenal (python 201, ch. 8): count, cycle, repeat, chain, islice, groupby, product, combinations, permutations es practicar con ejemplos reales. No basta con leer la teoría — necesitas escribir código, cometer errores, y aprender de ellos. Por eso cada concepto viene acompañado de ejemplos prácticos que puedes ejecutar en el editor interactivo.',

        'En producción, itertools arsenal (python 201, ch. 8): count, cycle, repeat, chain, islice, groupby, product, combinations, permutations se usa diario en empresas como Interbank, BBVA, Mercado Libre y Rimac. Los equipos de data science y automatización dependen de este conocimiento para construir pipelines robustos y escalables.',
      ],
    },
    {
      heading: 'Descriptors (Python 201, Ch. 17): non-data vs data descriptors, __set_name__, uso en frameworks (Django fields, SQLAlchemy columns)',
      paragraphs: [
        'En esta lección vamos a explorar descriptors (python 201, ch. 17): non-data vs data descriptors, __set_name__, uso en frameworks (django fields, sqlalchemy columns) en profundidad. Este concepto es fundamental para tu crecimiento como profesional de Data Science y automatización. En el mercado laboral peruano e internacional, dominar este tema te diferencia claramente de otros candidatos.',

        'La clave para entender descriptors (python 201, ch. 17): non-data vs data descriptors, __set_name__, uso en frameworks (django fields, sqlalchemy columns) es practicar con ejemplos reales. No basta con leer la teoría — necesitas escribir código, cometer errores, y aprender de ellos. Por eso cada concepto viene acompañado de ejemplos prácticos que puedes ejecutar en el editor interactivo.',

        'En producción, descriptors (python 201, ch. 17): non-data vs data descriptors, __set_name__, uso en frameworks (django fields, sqlalchemy columns) se usa diario en empresas como Interbank, BBVA, Mercado Libre y Rimac. Los equipos de data science y automatización dependen de este conocimiento para construir pipelines robustos y escalables.',
      ],
    },
    {
      heading: 'Type Hints modernos (Python 201, Ch. 10): Protocol duck typing estructurado, TypeVar genéricos, Generic[T], Literal, TypedDict, @overload múltiples firmas',
      paragraphs: [
        'En esta lección vamos a explorar type hints modernos (python 201, ch. 10): protocol duck typing estructurado, typevar genéricos, generic[t], literal, typeddict, @overload múltiples firmas en profundidad. Este concepto es fundamental para tu crecimiento como profesional de Data Science y automatización. En el mercado laboral peruano e internacional, dominar este tema te diferencia claramente de otros candidatos.',

        'La clave para entender type hints modernos (python 201, ch. 10): protocol duck typing estructurado, typevar genéricos, generic[t], literal, typeddict, @overload múltiples firmas es practicar con ejemplos reales. No basta con leer la teoría — necesitas escribir código, cometer errores, y aprender de ellos. Por eso cada concepto viene acompañado de ejemplos prácticos que puedes ejecutar en el editor interactivo.',

        'En producción, type hints modernos (python 201, ch. 10): protocol duck typing estructurado, typevar genéricos, generic[t], literal, typeddict, @overload múltiples firmas se usa diario en empresas como Interbank, BBVA, Mercado Libre y Rimac. Los equipos de data science y automatización dependen de este conocimiento para construir pipelines robustos y escalables.',
      ],
    },
    {
      heading: 'Unicode en profundidad (Python 201, Ch. 12): code points, UTF-8 vs UTF-16, str.encode(), bytes.decode(), chardet para detectar encoding, CSVs legacy peruanos',
      paragraphs: [
        'En esta lección vamos a explorar unicode en profundidad (python 201, ch. 12): code points, utf-8 vs utf-16, str.encode(), bytes.decode(), chardet para detectar encoding, csvs legacy peruanos en profundidad. Este concepto es fundamental para tu crecimiento como profesional de Data Science y automatización. En el mercado laboral peruano e internacional, dominar este tema te diferencia claramente de otros candidatos.',

        'La clave para entender unicode en profundidad (python 201, ch. 12): code points, utf-8 vs utf-16, str.encode(), bytes.decode(), chardet para detectar encoding, csvs legacy peruanos es practicar con ejemplos reales. No basta con leer la teoría — necesitas escribir código, cometer errores, y aprender de ellos. Por eso cada concepto viene acompañado de ejemplos prácticos que puedes ejecutar en el editor interactivo.',

        'En producción, unicode en profundidad (python 201, ch. 12): code points, utf-8 vs utf-16, str.encode(), bytes.decode(), chardet para detectar encoding, csvs legacy peruanos se usa diario en empresas como Interbank, BBVA, Mercado Libre y Rimac. Los equipos de data science y automatización dependen de este conocimiento para construir pipelines robustos y escalables.',
      ],
    },
    {
      heading: 'super() y MRO (Python 201, Ch. 16): Algoritmo C3 linearization, type.__mro__, diamond problem resuelto',
      paragraphs: [
        'En esta lección vamos a explorar super() y mro (python 201, ch. 16): algoritmo c3 linearization, type.__mro__, diamond problem resuelto en profundidad. Este concepto es fundamental para tu crecimiento como profesional de Data Science y automatización. En el mercado laboral peruano e internacional, dominar este tema te diferencia claramente de otros candidatos.',

        'La clave para entender super() y mro (python 201, ch. 16): algoritmo c3 linearization, type.__mro__, diamond problem resuelto es practicar con ejemplos reales. No basta con leer la teoría — necesitas escribir código, cometer errores, y aprender de ellos. Por eso cada concepto viene acompañado de ejemplos prácticos que puedes ejecutar en el editor interactivo.',

        'En producción, super() y mro (python 201, ch. 16): algoritmo c3 linearization, type.__mro__, diamond problem resuelto se usa diario en empresas como Interbank, BBVA, Mercado Libre y Rimac. Los equipos de data science y automatización dependen de este conocimiento para construir pipelines robustos y escalables.',
      ],
    },
    {
      heading: 'Scope y closures (Python 201, Ch. 18): LEGB rule, nonlocal, cell objects, factories de funciones para currying manual',
      paragraphs: [
        'En esta lección vamos a explorar scope y closures (python 201, ch. 18): legb rule, nonlocal, cell objects, factories de funciones para currying manual en profundidad. Este concepto es fundamental para tu crecimiento como profesional de Data Science y automatización. En el mercado laboral peruano e internacional, dominar este tema te diferencia claramente de otros candidatos.',

        'La clave para entender scope y closures (python 201, ch. 18): legb rule, nonlocal, cell objects, factories de funciones para currying manual es practicar con ejemplos reales. No basta con leer la teoría — necesitas escribir código, cometer errores, y aprender de ellos. Por eso cada concepto viene acompañado de ejemplos prácticos que puedes ejecutar en el editor interactivo.',

        'En producción, scope y closures (python 201, ch. 18): legb rule, nonlocal, cell objects, factories de funciones para currying manual se usa diario en empresas como Interbank, BBVA, Mercado Libre y Rimac. Los equipos de data science y automatización dependen de este conocimiento para construir pipelines robustos y escalables.',
      ],
    },
  ],
  iDo: {
    intro: 'Te muestro paso a paso cómo aplicar los conceptos de esta sección con ejemplos prácticos.',
    steps: [
      {
        description: 'Construir un Timer context manager con contextlib.contextmanager que mide latencia y loggea con structlog',
        code: {
          language: 'python',
          title: 'ejemplo.py',
          code: '# Ejemplo de: Construir un Timer context manager con contextlib.contextmanager que mide latencia y loggea con structlog\n# TODO: Implementar el código completo\nprint("Implementar este ejemplo")',
        },
        why: 'Este paso es importante porque demuestra el concepto en acción y te muestra el patrón correcto a seguir.',
      },
      {
        description: 'Implementar decorator @memoize con functools.wraps y caché manual, comparar con @lru_cache en performance',
        code: {
          language: 'python',
          title: 'ejemplo.py',
          code: '# Ejemplo de: Implementar decorator @memoize con functools.wraps y caché manual, comparar con @lru_cache en performance\n# TODO: Implementar el código completo\nprint("Implementar este ejemplo")',
        },
        why: 'Este paso es importante porque demuestra el concepto en acción y te muestra el patrón correcto a seguir.',
      },
      {
        description: 'Crear un ValidatedAttribute descriptor que valida tipo y rango en __set__, con mensaje de error descriptivo',
        code: {
          language: 'python',
          title: 'ejemplo.py',
          code: '# Ejemplo de: Crear un ValidatedAttribute descriptor que valida tipo y rango en __set__, con mensaje de error descriptivo\n# TODO: Implementar el código completo\nprint("Implementar este ejemplo")',
        },
        why: 'Este paso es importante porque demuestra el concepto en acción y te muestra el patrón correcto a seguir.',
      },
      {
        description: 'Resolver problema real de encoding: leer CSV con datos peruanos con encoding mixto (Windows-1252/UTF-8) y normalizarlo',
        code: {
          language: 'python',
          title: 'ejemplo.py',
          code: '# Ejemplo de: Resolver problema real de encoding: leer CSV con datos peruanos con encoding mixto (Windows-1252/UTF-8) y normalizarlo\n# TODO: Implementar el código completo\nprint("Implementar este ejemplo")',
        },
        why: 'Este paso es importante porque demuestra el concepto en acción y te muestra el patrón correcto a seguir.',
      },
    ],
  },
  weDo: {
    intro: 'Ahora te toca a ti practicar con guía. Lee cada instrucción, intenta escribir el código, y si te trabas revisa la solución.',
    steps: [
      {
        instruction: 'Construir sistema de paginación lazy con itertools.islice + generadores para procesar 1M de registros sin cargar todo en RAM',
        hint: 'Piensa en cómo descomponer el problema en pasos más pequeños.',
        starterCode: {
          language: 'python',
          title: 'ejercicio.py',
          code: '# Tu código aquí\n# Construir sistema de paginación lazy con itertools.islice + generadores para procesar 1M de registros sin cargar todo en RAM\n',
        },
        solutionCode: {
          language: 'python',
          title: 'solucion.py',
          code: '# Solución\n# Construir sistema de paginación lazy con itertools.islice + generadores para procesar 1M de registros sin cargar todo en RAM\nprint("Solución implementada")',
        },
      },
      {
        instruction: 'Implementar @singledispatch para un serializador que maneja int, str, list, pd.DataFrame con diferente lógica por tipo',
        hint: 'Piensa en cómo descomponer el problema en pasos más pequeños.',
        starterCode: {
          language: 'python',
          title: 'ejercicio.py',
          code: '# Tu código aquí\n# Implementar @singledispatch para un serializador que maneja int, str, list, pd.DataFrame con diferente lógica por tipo\n',
        },
        solutionCode: {
          language: 'python',
          title: 'solucion.py',
          code: '# Solución\n# Implementar @singledispatch para un serializador que maneja int, str, list, pd.DataFrame con diferente lógica por tipo\nprint("Solución implementada")',
        },
      },
      {
        instruction: 'Diseñar clase ValidatedModel usando descriptors que valida automáticamente tipos en __set__ para campos de un modelo de negocio',
        hint: 'Piensa en cómo descomponer el problema en pasos más pequeños.',
        starterCode: {
          language: 'python',
          title: 'ejercicio.py',
          code: '# Tu código aquí\n# Diseñar clase ValidatedModel usando descriptors que valida automáticamente tipos en __set__ para campos de un modelo de negocio\n',
        },
        solutionCode: {
          language: 'python',
          title: 'solucion.py',
          code: '# Solución\n# Diseñar clase ValidatedModel usando descriptors que valida automáticamente tipos en __set__ para campos de un modelo de negocio\nprint("Solución implementada")',
        },
      },
    ],
  },
  youDo: {
    title: 'CLI Toolkit Profesional',
    context: 'pytools-cli combina toda la stdlib avanzada: CLI con argparse y 4 subcomandos (encode, decode, iterate, time); encode/decode usa cryptography de sección 14; iterate usa itertools.islice + groupby para procesar CSVs grandes lazily con estadísticas; time usa context manager personalizado con contextlib para medir y loggear performance; type hints completos (pasa mypy --strict); tests pytest ≥ 85% cobertura; pyproject.toml preparado para pip install.',
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
        question: '¿Cuál de los siguientes describe mejor: Crear context managers con contextlib: contextmanager, closing, suppress, ExitStack?',
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
        question: '¿Cuál de los siguientes describe mejor: Usar functools avanzado: lru_cache, partial, singledispatch, wraps, reduce?',
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
        question: '¿Cuál de los siguientes describe mejor: Explotar itertools: infinite iterators (count, cycle, repeat), combinatorics (product, combinations, permutations), terminators (groupby, islice, chain)?',
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
        question: '¿Cuál de los siguientes describe mejor: Implementar descriptors con __get__, __set__, __delete__ para validación de atributos?',
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
        question: '¿Cuál de los siguientes describe mejor: Aplicar type hints completos con typing: Protocol, TypeVar, Generic, Literal, TypedDict, overload?',
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
      { label: 'Python 201 (Driscoll) — Chapters 3, 4, 8, 10, 12, 16, 17, 18 (fuente primaria)', url: 'Python 201 (Driscoll) — Chapters 3, 4, 8, 10, 12, 16, 17, 18 (fuente primaria)' },
      { label: 'contextlib — Python docs oficiales', url: 'contextlib — Python docs oficiales' },
      { label: 'itertools recipes — Python docs', url: 'itertools recipes — Python docs' },
      { label: 'typing — Python docs', url: 'typing — Python docs' },
      { label: 'Mypy type checker', url: 'Mypy type checker' },
    ],
    books: [
      { label: 'Python 201 — Michael Driscoll', note: 'Capítulos relevantes para esta sección' },
    ],
    courses: [
      { label: 'Real Python', url: 'https://realpython.com', note: 'Tutoriales complementarios' },
    ],
  },
}
