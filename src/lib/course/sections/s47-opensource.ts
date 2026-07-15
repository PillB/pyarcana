import type { CourseSection } from '../../types'

export const section47: CourseSection = {
  id: 'opensource',
  index: 47,
  title: 'Contribución Open Source y Diseño de APIs Públicas',
  shortTitle: 'Contribución Open Source y Dis',
  tagline: 'El mejor CV para un Senior/Staff Engineer es el historial de contribuciones open source.',
  estimatedHours: 12,
  level: 'Master',
  phase: 3,
  icon: 'Github',
  accentColor: 'bg-gradient-to-br from-amber-500 to-red-600',
  jobRelevance: 'El historial de contribuciones open source en GitHub es uno de los predictores más fuertes de contratación en empresas top (FAANG, Anthropic, OpenAI, Stripe). Publicar un paquete con comunidad activa es diferenciador enorme para Staff Engineer ($200K-$280K).',
  learningOutcomes: [
    { text: 'Proceso de contribución a proyectos open source: issues, PRs, code review, CI' },
    { text: 'Diseñar APIs públicas: principios de diseño (backward compatibility, versioning, documentation)' },
    { text: 'Construir y publicar un paquete Python con funcionalidades genuinamente útiles para la comunidad' },
    { text: 'Escribir documentación de calidad con Sphinx + ReadTheDocs + API reference auto-generada' },
    { text: 'Gestionar versiones con Conventional Commits + CHANGELOG automático con git-cliff' },
    { text: 'Construir una comunidad alrededor de un proyecto: README atractivo, ejemplos, Discord' },
  ],
  theory: [
    {
      heading: 'Contribución a Open Source: forks, PRs, code review y CI',
      paragraphs: [
        'Contribuir a Open Source es la forma más efectiva de construir reputación técnica internacional. En GitHub, los reclutadores buscan candidatos con PRs merged en proyectos conocidos (pandas, scikit-learn, FastAPI). Para empezar: busca issues con label "good first issue" en proyectos que ya usas. Un typo en la documentación, un bug en un edge case, o una mejora en un docstring son contribuciones válidas. El proceso: fork el repo, crea una rama, haz el cambio, escribe un test, abre un PR con descripción clara. La primera contribución merged es la más difícil — las siguientes son cada vez más fáciles.',
        'Diseñar una API pública para tu paquete Python requiere disciplina. La regla #1: todo lo que NO tiene underscore inicial es API pública y no puede cambiar sin un major version bump. Usa `__all__` en `__init__.py` para definir explícitamente qué se exporta. Sigue Semantic Versioning (semver): MAJOR.MINOR.PATCH. MAJOR para breaking changes, MINOR para nuevas features backward-compatible, PATCH para bugfixes. Antes de un breaking change, emite `DeprecationWarning` en la versión MINOR anterior. Usa `pyproject.toml` (PEP 621) con hatchling como build backend — es el estándar moderno que reemplaza a setup.py.',
        'El CI/CD para un paquete Open Source usa GitHub Actions con matrix testing: prueba en Python 3.10/3.11/3.12 × Ubuntu/macOS/Windows (9 combinaciones). El workflow: (1) lint con ruff, (2) tests con pytest + coverage, (3) build con hatch, (4) publish a Test PyPI en cada push a main, (5) publish a PyPI real en cada release. El archivo `.github/workflows/ci.yml` define todo esto. Sin CI matrix, tu paquete "funciona en mi máquina" pero falla en Windows o Python 3.10. Sin publish automático, olvidas publicar la nueva versión después de un merge.',
      ],
    },
  ],
  iDo: {
    intro: 'Te muestro paso a paso cómo aplicar los conceptos de esta sección con ejemplos prácticos.',
    steps: [
      {
        description: 'Hacer tu primera contribución a un proyecto Open Source Python',
        code: {
          language: 'python',
          title: 'demo.py',
          code: '# pyproject.toml moderno (PEP 621)\n[project]\nname = "pytools-cli"\nversion = "1.0.0"\ndependencies = ["click>=8.0", "pandas>=2.0", "rich>=13.0"]\n\n[project.optional-dependencies]\ndev = ["pytest", "ruff", "mypy"]\nml = ["scikit-learn", "xgboost"]\n\n[project.scripts]\npytools = "pytools_cli.main:cli"\n\n# pip install .  -> instala el paquete\n# pytools --help -> usa el CLI\nprint("pyproject.toml: entry_points + optional-deps")',
        },
        why: 'pyproject.toml con hatchling es el estandar moderno. project.scripts crea el comando ejecutable. optional-dependencies separa deps de dev y features modulares.',
      },
    ],
  },
  weDo: {
    intro: 'Ahora te toca a ti practicar con guía. Lee cada instrucción, intenta escribir el código, y si te trabas revisa la solución.',
    steps: [
      {
        instruction: 'Encuentra un issue good-first-issue en un proyecto Python y envíalo como PR',
        hint: 'Revisa la teoría y el I Do antes de intentar este ejercicio.',
        starterCode: {
          language: 'python',
          title: 'ejercicio.py',
          code: '# Tu código aquí\n',
        },
        solutionCode: {
          language: 'python',
          title: 'solucion.py',
          code: '# GitHub Actions CI con matrix testing (3 OS x 3 Python = 9 jobs)\nname: CI\non: [push, pull_request]\njobs:\n  test:\n    runs-on: ${{ matrix.os }}\n    strategy:\n      matrix:\n        os: [ubuntu-latest, macos-latest, windows-latest]\n        python: ["3.10", "3.11", "3.12"]\n    steps:\n    - uses: actions/checkout@v4\n    - run: pip install -e ".[dev]"\n    - run: ruff check .\n    - run: pytest --cov\nprint("CI: 9 combinaciones, lint + tests + coverage en paralelo")',
        },
      },
    ],
  },
  youDo: {
    title: 'Open Source Package Publicado',
    context: 'Publica un paquete Python original en PyPI con ≥ 5 GitHub stars en la primera semana: elegir una herramienta que hayas necesitado y no existía, o mejora significativa de algo existente.',
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
        question: '¿Qué es Semantic Versioning (semver)?',
        options: [
          'MAJOR.MINOR.PATCH: MAJOR para breaking changes, MINOR para nuevas features compatibles, PATCH para bugfixes — antes de un breaking change, emitir DeprecationWarning',
          'Es un sistema de versiones basado en fechas',
          'Es un tipo de tag de Git',
          'Es un formato de changelog',
        ],
        correctIndex: 0,
        explanation: 'semver: 1.4.2 → 1.4.3 (bugfix), 1.5.0 (nueva feature), 2.0.0 (breaking change). Antes de MAJOR bump, depreca APIs con DeprecationWarning en la última versión MINOR. Los usuarios tienen tiempo de migrar. pip usa semver para resolver dependencias.',
      },
      {
        question: '¿Qué debe incluir un CONTRIBUTING.md?',
        options: [
          'Cómo configurar el entorno de desarrollo, cómo correr tests, estilo de código, proceso de PR, y código de conducta — reduce fricción para nuevos contribuidores',
          'Solo las reglas del proyecto',
          'Solo la licencia',
          'No es necesario',
        ],
        correctIndex: 0,
        explanation: 'CONTRIBUTING.md dice: "pip install -e .[dev] para instalar", "pytest para tests", "ruff para lint", "abre un issue antes de un PR grande". Sin esto, los contribuidores externos no saben cómo empezar y abandonan. Proyectos sin CONTRIBUTING reciben 80% menos PRs.',
      },
      {
        question: '¿Qué es __all__ en Python y por qué importa para APIs públicas?',
        options: [
          'Define explícitamente qué se exporta con "from modulo import *" — sin __all__, todo lo público (sin underscore) se exporta, incluyendo internals',
          'Es una lista de todas las variables',
          'Es un decorador',
          'Es un type hint',
        ],
        correctIndex: 0,
        explanation: '__all__ = ["funcion_principal", "ClasePrincipal"] controla qué se exporta. Sin __all__, from modulo import * exporta todo lo que no empiece con _. Esto puede exponer funciones internas que no quieres que los usuarios dependan. Con __all__, tu API pública es explícita y deliberada.',
      },
      {
        question: '¿Qué es matrix testing en CI?',
        options: [
          'Probar en múltiples combinaciones de OS × Python version (ej: Ubuntu/macOS/Windows × 3.10/3.11/3.12) — asegura que tu paquete funciona en todos los entornos',
          'Es un test de matrices matemáticas',
          'Es un sistema de control de versiones',
          'Es un tipo de benchmark',
        ],
        correctIndex: 0,
        explanation: 'Matrix testing en GitHub Actions: strategy: matrix: os: [ubuntu, macos, windows], python: ["3.10", "3.11", "3.12"]. Esto crea 9 jobs que corren en paralelo. Sin matrix, tu paquete "funciona en mi máquina" pero falla en Windows o Python 3.10. Es el estándar para paquetes open-source serios.',
      },
      {
        question: '¿Cómo publicas un paquete en PyPI?',
        options: [
          'python -m build → twine upload dist/* → pip install tu-paquete funciona globalmente. Automatizado con GitHub Actions on release',
          'Subir el .py a un servidor FTP',
          'Enviar por email a PyPI',
          'Compilar a binario y subir',
        ],
        correctIndex: 0,
        explanation: 'Flujo: (1) python -m build genera dist/*.whl y *.tar.gz, (2) twine check dist/* valida metadata, (3) twine upload dist/* publica en PyPI. Automatizado: GitHub Actions que publica on release. Después, cualquier usuario puede pip install tu-paquete globalmente.',
      },
    ],
  },
  resources: {
    docs: [
      { label: 'Documentación oficial', url: 'https://docs.python.org/3/' },
    ],
    books: [
      { label: 'Python 201 — Michael Driscoll', note: 'Capítulos relevantes para esta sección' },
    ],
    courses: [
      { label: 'Real Python', url: 'https://realpython.com', note: 'Tutoriales complementarios' },
    ],
  },
}
