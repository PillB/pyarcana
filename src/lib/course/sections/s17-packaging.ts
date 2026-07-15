import type { CourseSection } from '../../types'

export const section17: CourseSection = {
  id: 'packaging',
  index: 17,
  title: 'Distribución, Packaging y CLI Profesional',
  shortTitle: 'Distribución, Packaging y CLI ',
  tagline: 'Tu código merece ser un paquete que otros puedan instalar con un solo comando.',
  estimatedHours: 8,
  level: 'Competente',
  phase: 1,
  icon: 'Package',
  accentColor: 'bg-gradient-to-br from-blue-500 to-indigo-600',
  jobRelevance: 'Publicar un paquete en PyPI es el diferenciador más concreto en CVs para roles globales. Las empresas US buscan ingenieros que sepan empaquetar, versionar y distribuir código. Moderniza Python 101 (Ch. 36-44) con pyproject.toml, hatch, click, y GitHub Actions para publicación automática.',
  learningOutcomes: [
    { text: 'Crear paquetes Python modernos con pyproject.toml (PEP 517/518/660)' },
    { text: 'Publicar en PyPI con twine y automatizar con GitHub Actions' },
    { text: 'Construir CLIs profesionales con click: grupos de comandos, opciones, callbacks, progress bars' },
    { text: 'Entender wheels vs source distributions y cuándo usar cada uno (Python 101 Ch. 38-39)' },
    { text: 'Usar ftplib para transferencia de archivos (Python 201, Ch. 21)' },
    { text: 'Aplicar Semantic Versioning (bumpversion) y gestionar CHANGELOGs con git-cliff' },
    { text: 'Crear ejecutables con PyInstaller y cx_Freeze para distribución multiplataforma (Python 101 Ch. 40-43)' },
  ],
  theory: [
    {
      heading: 'pyproject.toml moderno: [build-system], [project], [project.scripts] (entry points), [project.optional-dependencies]',
      paragraphs: [
        'En esta lección vamos a explorar pyproject.toml moderno: [build-system], [project], [project.scripts] (entry points), [project.optional-dependencies] en profundidad. Este concepto es fundamental para tu crecimiento como profesional de Data Science y automatización. En el mercado laboral peruano e internacional, dominar este tema te diferencia claramente de otros candidatos.',

        'La clave para entender pyproject.toml moderno: [build-system], [project], [project.scripts] (entry points), [project.optional-dependencies] es practicar con ejemplos reales. No basta con leer la teoría — necesitas escribir código, cometer errores, y aprender de ellos. Por eso cada concepto viene acompañado de ejemplos prácticos que puedes ejecutar en el editor interactivo.',

        'En producción, pyproject.toml moderno: [build-system], [project], [project.scripts] (entry points), [project.optional-dependencies] se usa diario en empresas como Interbank, BBVA, Mercado Libre y Rimac. Los equipos de data science y automatización dependen de este conocimiento para construir pipelines robustos y escalables.',
      ],
    },
    {
      heading: 'Wheels vs source distributions: pure Python wheels (py3-none-any) vs binary wheels, por qué son preferidos',
      paragraphs: [
        'En esta lección vamos a explorar wheels vs source distributions: pure python wheels (py3-none-any) vs binary wheels, por qué son preferidos en profundidad. Este concepto es fundamental para tu crecimiento como profesional de Data Science y automatización. En el mercado laboral peruano e internacional, dominar este tema te diferencia claramente de otros candidatos.',

        'La clave para entender wheels vs source distributions: pure python wheels (py3-none-any) vs binary wheels, por qué son preferidos es practicar con ejemplos reales. No basta con leer la teoría — necesitas escribir código, cometer errores, y aprender de ellos. Por eso cada concepto viene acompañado de ejemplos prácticos que puedes ejecutar en el editor interactivo.',

        'En producción, wheels vs source distributions: pure python wheels (py3-none-any) vs binary wheels, por qué son preferidos se usa diario en empresas como Interbank, BBVA, Mercado Libre y Rimac. Los equipos de data science y automatización dependen de este conocimiento para construir pipelines robustos y escalables.',
      ],
    },
    {
      heading: 'click para CLIs: @click.group(), @click.command(), @click.option(), @click.argument(), click.echo(), click.progressbar()',
      paragraphs: [
        'En esta lección vamos a explorar click para clis: @click.group(), @click.command(), @click.option(), @click.argument(), click.echo(), click.progressbar() en profundidad. Este concepto es fundamental para tu crecimiento como profesional de Data Science y automatización. En el mercado laboral peruano e internacional, dominar este tema te diferencia claramente de otros candidatos.',

        'La clave para entender click para clis: @click.group(), @click.command(), @click.option(), @click.argument(), click.echo(), click.progressbar() es practicar con ejemplos reales. No basta con leer la teoría — necesitas escribir código, cometer errores, y aprender de ellos. Por eso cada concepto viene acompañado de ejemplos prácticos que puedes ejecutar en el editor interactivo.',

        'En producción, click para clis: @click.group(), @click.command(), @click.option(), @click.argument(), click.echo(), click.progressbar() se usa diario en empresas como Interbank, BBVA, Mercado Libre y Rimac. Los equipos de data science y automatización dependen de este conocimiento para construir pipelines robustos y escalables.',
      ],
    },
    {
      heading: 'Publicar en PyPI: Test PyPI primero, twine check dist/*, twine upload',
      paragraphs: [
        'En esta lección vamos a explorar publicar en pypi: test pypi primero, twine check dist/*, twine upload en profundidad. Este concepto es fundamental para tu crecimiento como profesional de Data Science y automatización. En el mercado laboral peruano e internacional, dominar este tema te diferencia claramente de otros candidatos.',

        'La clave para entender publicar en pypi: test pypi primero, twine check dist/*, twine upload es practicar con ejemplos reales. No basta con leer la teoría — necesitas escribir código, cometer errores, y aprender de ellos. Por eso cada concepto viene acompañado de ejemplos prácticos que puedes ejecutar en el editor interactivo.',

        'En producción, publicar en pypi: test pypi primero, twine check dist/*, twine upload se usa diario en empresas como Interbank, BBVA, Mercado Libre y Rimac. Los equipos de data science y automatización dependen de este conocimiento para construir pipelines robustos y escalables.',
      ],
    },
    {
      heading: 'GitHub Actions para publicación: workflow en .github/workflows/publish.yml que corre en on: release: types: [published]',
      paragraphs: [
        'En esta lección vamos a explorar github actions para publicación: workflow en .github/workflows/publish.yml que corre en on: release: types: [published] en profundidad. Este concepto es fundamental para tu crecimiento como profesional de Data Science y automatización. En el mercado laboral peruano e internacional, dominar este tema te diferencia claramente de otros candidatos.',

        'La clave para entender github actions para publicación: workflow en .github/workflows/publish.yml que corre en on: release: types: [published] es practicar con ejemplos reales. No basta con leer la teoría — necesitas escribir código, cometer errores, y aprender de ellos. Por eso cada concepto viene acompañado de ejemplos prácticos que puedes ejecutar en el editor interactivo.',

        'En producción, github actions para publicación: workflow en .github/workflows/publish.yml que corre en on: release: types: [published] se usa diario en empresas como Interbank, BBVA, Mercado Libre y Rimac. Los equipos de data science y automatización dependen de este conocimiento para construir pipelines robustos y escalables.',
      ],
    },
    {
      heading: 'ftplib (Python 201, Ch. 21): FTP, FTP.connect(), FTP.login(), FTP.retrbinary(), FTP.storbinary() — pipelines que envían reportes a servidores FTP legacy',
      paragraphs: [
        'En esta lección vamos a explorar ftplib (python 201, ch. 21): ftp, ftp.connect(), ftp.login(), ftp.retrbinary(), ftp.storbinary() — pipelines que envían reportes a servidores ftp legacy en profundidad. Este concepto es fundamental para tu crecimiento como profesional de Data Science y automatización. En el mercado laboral peruano e internacional, dominar este tema te diferencia claramente de otros candidatos.',

        'La clave para entender ftplib (python 201, ch. 21): ftp, ftp.connect(), ftp.login(), ftp.retrbinary(), ftp.storbinary() — pipelines que envían reportes a servidores ftp legacy es practicar con ejemplos reales. No basta con leer la teoría — necesitas escribir código, cometer errores, y aprender de ellos. Por eso cada concepto viene acompañado de ejemplos prácticos que puedes ejecutar en el editor interactivo.',

        'En producción, ftplib (python 201, ch. 21): ftp, ftp.connect(), ftp.login(), ftp.retrbinary(), ftp.storbinary() — pipelines que envían reportes a servidores ftp legacy se usa diario en empresas como Interbank, BBVA, Mercado Libre y Rimac. Los equipos de data science y automatización dependen de este conocimiento para construir pipelines robustos y escalables.',
      ],
    },
    {
      heading: 'py2exe y PyInstaller (Python 101, Ch. 40-43): pyinstaller --onefile --windowed, --hidden-import, creación de spec files',
      paragraphs: [
        'En esta lección vamos a explorar py2exe y pyinstaller (python 101, ch. 40-43): pyinstaller --onefile --windowed, --hidden-import, creación de spec files en profundidad. Este concepto es fundamental para tu crecimiento como profesional de Data Science y automatización. En el mercado laboral peruano e internacional, dominar este tema te diferencia claramente de otros candidatos.',

        'La clave para entender py2exe y pyinstaller (python 101, ch. 40-43): pyinstaller --onefile --windowed, --hidden-import, creación de spec files es practicar con ejemplos reales. No basta con leer la teoría — necesitas escribir código, cometer errores, y aprender de ellos. Por eso cada concepto viene acompañado de ejemplos prácticos que puedes ejecutar en el editor interactivo.',

        'En producción, py2exe y pyinstaller (python 101, ch. 40-43): pyinstaller --onefile --windowed, --hidden-import, creación de spec files se usa diario en empresas como Interbank, BBVA, Mercado Libre y Rimac. Los equipos de data science y automatización dependen de este conocimiento para construir pipelines robustos y escalables.',
      ],
    },
  ],
  iDo: {
    intro: 'Te muestro paso a paso cómo aplicar los conceptos de esta sección con ejemplos prácticos.',
    steps: [
      {
        description: 'Transformar un script Python en paquete instalable con pyproject.toml en 10 minutos',
        code: {
          language: 'python',
          title: 'ejemplo.py',
          code: '# Ejemplo de: Transformar un script Python en paquete instalable con pyproject.toml en 10 minutos\n# TODO: Implementar el código completo\nprint("Implementar este ejemplo")',
        },
        why: 'Este paso es importante porque demuestra el concepto en acción y te muestra el patrón correcto a seguir.',
      },
      {
        description: 'Crear un CLI con click con 3 subcomandos, opciones con tipos, y una progress bar animada',
        code: {
          language: 'python',
          title: 'ejemplo.py',
          code: '# Ejemplo de: Crear un CLI con click con 3 subcomandos, opciones con tipos, y una progress bar animada\n# TODO: Implementar el código completo\nprint("Implementar este ejemplo")',
        },
        why: 'Este paso es importante porque demuestra el concepto en acción y te muestra el patrón correcto a seguir.',
      },
      {
        description: 'Publicar en Test PyPI (test.pypi.org) y verificar pip install --index-url https://test.pypi.org/simple/ mi-paquete',
        code: {
          language: 'python',
          title: 'ejemplo.py',
          code: '# Ejemplo de: Publicar en Test PyPI (test.pypi.org) y verificar pip install --index-url https://test.pypi.org/simple/ mi-paquete\n# TODO: Implementar el código completo\nprint("Implementar este ejemplo")',
        },
        why: 'Este paso es importante porque demuestra el concepto en acción y te muestra el patrón correcto a seguir.',
      },
    ],
  },
  weDo: {
    intro: 'Ahora te toca a ti practicar con guía. Lee cada instrucción, intenta escribir el código, y si te trabas revisa la solución.',
    steps: [
      {
        instruction: 'Añadir un GitHub Actions workflow que publica automáticamente al crear un Release en GitHub',
        hint: 'Piensa en cómo descomponer el problema en pasos más pequeños.',
        starterCode: {
          language: 'python',
          title: 'ejercicio.py',
          code: '# Tu código aquí\n# Añadir un GitHub Actions workflow que publica automáticamente al crear un Release en GitHub\n',
        },
        solutionCode: {
          language: 'python',
          title: 'solucion.py',
          code: '# Solución\n# Añadir un GitHub Actions workflow que publica automáticamente al crear un Release en GitHub\nprint("Solución implementada")',
        },
      },
      {
        instruction: 'Generar un ejecutable .exe con PyInstaller para el proyecto wxPython GUI de la sección anterior',
        hint: 'Piensa en cómo descomponer el problema en pasos más pequeños.',
        starterCode: {
          language: 'python',
          title: 'ejercicio.py',
          code: '# Tu código aquí\n# Generar un ejecutable .exe con PyInstaller para el proyecto wxPython GUI de la sección anterior\n',
        },
        solutionCode: {
          language: 'python',
          title: 'solucion.py',
          code: '# Solución\n# Generar un ejecutable .exe con PyInstaller para el proyecto wxPython GUI de la sección anterior\nprint("Solución implementada")',
        },
      },
      {
        instruction: 'Implementar Semantic Versioning automatizado con bumpversion y commit hooks',
        hint: 'Piensa en cómo descomponer el problema en pasos más pequeños.',
        starterCode: {
          language: 'python',
          title: 'ejercicio.py',
          code: '# Tu código aquí\n# Implementar Semantic Versioning automatizado con bumpversion y commit hooks\n',
        },
        solutionCode: {
          language: 'python',
          title: 'solucion.py',
          code: '# Solución\n# Implementar Semantic Versioning automatizado con bumpversion y commit hooks\nprint("Solución implementada")',
        },
      },
    ],
  },
  youDo: {
    title: 'Package Publicado en PyPI',
    context: 'Publica pytools-cli (CLI Toolkit de la sección 15) en el ecosistema Python: pyproject.toml con metadata completa y entry_points para CLI; documentación con mkdocs-material o sphinx publicada en ReadTheDocs; GitHub Action que ejecuta tests → lint (ruff) → build → publish en PyPI al hacer release; versión 1.0.0 publicada en Test PyPI (o PyPI real); enlace en CV y LinkedIn: Autor de pytools-cli — X descargas en PyPI.',
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
        question: '¿Qué es `pyproject.toml` y por qué reemplaza a `setup.py`?',
        options: [
          'Es el estándar moderno (PEP 621) para definir metadata, dependencias y build system de un paquete Python de forma declarativa, sin código ejecutable',
          'Es un archivo de configuración para el IDE que reemplaza a .vscode/settings.json',
          'Es un formato de empaquetado binario que reemplaza a los wheels',
          'Es un sistema de typing que reemplaza a mypy',
        ],
        correctIndex: 0,
        explanation: 'pyproject.toml (PEP 517/518/621) define todo lo que setup.py hacía pero de forma declarativa: [project] para metadata, [build-system] para el backend, [project.scripts] para entry points. Es más seguro (sin código ejecutable) y estándar.',
      },
      {
        question: '¿Cuál es la diferencia entre `[project.dependencies]` y `[project.optional-dependencies]`?',
        options: [
          'dependencies son obligatorias para usar el paquete; optional-dependencies son extras que se instalan con `pip install paquete[extra]` para features específicas',
          'dependencies son para producción; optional-dependencies son para desarrollo',
          'dependencies se instalan automáticamente; optional-dependencias hay que instalarlas manualmente desde GitHub',
          'No hay diferencia, son sinónimos',
        ],
        correctIndex: 0,
        explanation: 'dependencies se instalan siempre. optional-dependencies (extras) son opcionales: `pip install mi-paquete[dev]` instala las deps de desarrollo, `pip install mi-paquete[ml]` instala las de ML. Permite un paquete base ligero con features modulares.',
      },
      {
        question: '¿Qué hace `[project.scripts]` en pyproject.toml?',
        options: [
          'Define entry points que crean comandos ejecutables en el PATH después de `pip install` — así funciona `pytest`, `black`, `ruff`',
          'Ejecuta scripts de inicialización cuando se instala el paquete',
          'Define scripts que se ejecutan antes de cada commit de Git',
          'Crea accesos directos en el escritorio del usuario',
        ],
        correctIndex: 0,
        explanation: '[project.scripts] crea comandos CLI. Por ejemplo: `mi-cmd = "mi_paquete.main:cli"` hace que `mi-cmd` esté disponible en el PATH después de pip install. Es cómo pytest, ruff, black y todas las herramientas Python crean sus ejecutables.',
      },
      {
        question: '¿Por qué los wheels son preferidos sobre las source distributions (sdist) en PyPI?',
        options: [
          'Porque los wheels son pre-compilados para la plataforma específica, evitando compilación local y acelerando la instalación 10-100x',
          'Porque los wheels son más seguros y firmados criptográficamente',
          'Porque las sdist ya no se soportan en PyPI desde 2024',
          'Porque los wheels incluyen documentación y las sdist no',
        ],
        correctIndex: 0,
        explanation: 'Un wheel (ej: mi_paquete-1.0-py3-none-any.whl) es un zip pre-compilado. pip lo descomprime sin ejecutar setup.py ni compilar extensiones C. Una sdist requiere compilación local con gcc, que puede fallar en sistemas sin build tools.',
      },
      {
        question: '¿Qué es Semantic Versioning (semver) y cómo se aplica?',
        options: [
          'MAJOR.MINOR.PATCH: MAJOR para breaking changes, MINOR para nuevas features compatibles, PATCH para bugfixes. Antes de un breaking change, emitir DeprecationWarning en la versión anterior',
          'VERSION.BUILD.REVISION: VERSION para releases, BUILD para compilaciones, REVISION para hotfixes',
          'Es un sistema donde la versión se incrementa automáticamente con cada commit',
          'Es un formato de fecha: año.mes.día para versiones',
        ],
        correctIndex: 0,
        explanation: 'Semver: 1.4.2 → 1.4.3 (bugfix), 1.5.0 (nueva feature), 2.0.0 (breaking change). Antes de un MAJOR bump, depreca las APIs que van a cambiar con DeprecationWarning en la última versión MINOR. Así los usuarios tienen tiempo de migrar.',
      }
    ],
  },
  resources: {
    docs: [
      { label: 'Python 101 (Driscoll) — Ch. 36-44 (base conceptual, modernizada)', url: 'Python 101 (Driscoll) — Ch. 36-44 (base conceptual, modernizada)' },
      { label: 'Python 201 (Driscoll) — Ch. 21 ftplib', url: 'Python 201 (Driscoll) — Ch. 21 ftplib' },
      { label: 'Python Packaging Authority — packaging.python.org', url: 'Python Packaging Authority — packaging.python.org' },
      { label: 'click documentation', url: 'click documentation' },
      { label: 'GitHub Actions — publishing to PyPI', url: 'GitHub Actions — publishing to PyPI' },
    ],
    books: [
      { label: 'Python 201 — Michael Driscoll', note: 'Capítulos relevantes para esta sección' },
    ],
    courses: [
      { label: 'Real Python', url: 'https://realpython.com', note: 'Tutoriales complementarios' },
    ],
  },
}
