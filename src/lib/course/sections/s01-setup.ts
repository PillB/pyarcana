import type { CourseSection } from '../../types'

export const section01: CourseSection = {
  id: 'setup',
  index: 1,
  title: 'Setup & Entorno de Desarrollo',
  shortTitle: 'Setup & Entorno',
  tagline: 'Python, VS Code, venv y Git listos para producción desde el día 1',
  estimatedHours: 4,
  level: 'Principiante',
  icon: 'Wrench',
  accentColor: 'bg-gradient-to-br from-violet-500 to-violet-700',
  jobRelevance:
    'El 90% de los problemas en equipos de data science no son de código, son de entorno. Un analista que sabe configurar venv, git y VS Code properly ahorra horas al equipo y se gana la confianza del líder técnico. En empresas peruanas como Interbank, BBVA o Caja Arequipa, el primer día te piden clonar un repo, levantar el entorno y correr un notebook. Si te trabas ahí, no pasas la semana de prueba.',
  learningOutcomes: [
    { text: 'Instalar Python 3.12+ y verificarlo desde la terminal (PowerShell, bash o zsh)' },
    { text: 'Crear y activar entornos virtuales con venv y conda' },
    { text: 'Configurar VS Code con extensiones Python esenciales (Pylance, Ruff, Jupyter)' },
    { text: 'Inicializar un repo Git, hacer commit/push y abrir un Pull Request en GitHub' },
    { text: 'Escribir un archivo requirements.txt reproducible y un .gitignore correcto' },
  ],
  theory: [
    {
      heading: 'Por qué el setup importa más de lo que crees',
      paragraphs: [
        'Mucha gente salta el setup porque "ya aprenderá en el camino". Error. En producción, un entorno mal configurado genera errores fantasma: "a mí me funciona" es la frase más temida en Slack. Cuando trabajas en un equipo de data science, tu colega clona tu repo, ejecuta `pip install -r requirements.txt` y todo debería andar. Si no anda, perdiste credibilidad. Por eso esta sección no es un trámite — es la base sobre la que se construye todo lo demás.',
        'En Perú, el stack que vas a encontrar en empresas medianas y grandes es bastante consistente: Python 3.11 o 3.12, VS Code o PyCharm, Git + GitHub (algunos usan GitLab), y entornos virtuales con `venv` (más común) o `conda` (en equipos más legacy o de investigación). Las startups más nuevas están migrando a `uv` que es brutalmente más rápido, pero todavía no es estándar. Vamos con `venv` porque es lo que vas a encontrar en el 95% de los puestos.',
        'La regla de oro: **un proyecto = un entorno virtual = un requirements.txt**. Nunca instales paquetes globales. Nunca. Si lo haces, en 3 meses no vas a saber qué versión de pandas tenías cuando algo funcionaba y ahora no. El entorno virtual aísla las dependencias por proyecto, igual que una caja hermética. Cuando algo se rompe, sabes exactamente dónde buscar.',
      ],
    },
    {
      heading: 'Componentes del stack que vamos a instalar',
      paragraphs: [
        'Vamos a instalar 4 cosas, en este orden: (1) Python 3.12 desde python.org, (2) VS Code desde code.visualstudio.com, (3) Git desde git-scm.com, y (4) las extensiones de Python en VS Code. Cada una tiene su rol específico y no se mezclan. Python es el lenguaje. VS Code es el editor donde escribes código. Git es el sistema de control de versiones que registra cada cambio. GitHub es la nube donde publicas tu código para que otros lo vean y colaboren.',
        'Una decisión clave: **¿venv o conda?** Para data science en Perú, `venv` es suficiente y es lo estándar. `conda` es más pesado (descarga 3-5 GB) y tiene su propio sistema de paquetes que a veces entra en conflicto con pip. Solo te recomiendo conda si trabajas con investigadores que ya lo usan, o si necesitas CUDA/GPU para deep learning. En el 90% de los casos de data analysis (pandas, numpy, sklearn, matplotlib), `venv` + pip es lo correcto.',
      ],
    },
    {
      heading: 'El flujo de trabajo profesional con Git',
      paragraphs: [
        'Git no es solo "guardar código en la nube". Es un sistema de control de versiones distribuido que registra cada cambio significativo con un mensaje descriptivo. El flujo profesional es: (1) `git init` en tu carpeta de proyecto, (2) crear un `.gitignore` que excluya `venv/`, `__pycache__/`, `.env`, `*.pyc`, (3) `git add .` para staged, (4) `git commit -m "mensaje descriptivo"`, (5) `git push` a GitHub. Cada commit es un punto de retorno: si rompes algo, puedes volver.',
        'La convención para mensajes de commit más usada en la industria es Conventional Commits: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`. Por ejemplo: `feat: agregar cálculo de churn por segmento` o `fix: corregir tipo de dato en columna fecha`. Esto parece burocrático al principio, pero cuando revisas el historial de un proyecto de 6 meses, agradeces haber sido ordenado. Las empresas peruanas más serias (Rimac, Interbank) lo exigen.',
      ],
      callout: {
        type: 'warning',
        title: 'Errores típicos del principiante',
        content:
          '1) Subir el `venv/` a GitHub (pesa 100MB+ y ensucia el repo). 2) No usar `.gitignore` y subir `.env` con credenciales (¡peligro de seguridad!). 3) Hacer commits del estilo "cambios", "wip", "arreglé algo" sin contexto. 4) Trabajar siempre en la rama `main` sin crear branches para features nuevas. Todo esto se soluciona con disciplina desde el día 1.',
      },
    },
  ],
  iDo: {
    intro:
      'Te muestro paso a paso cómo configuro un entorno completo desde cero en una laptop con Windows 11 (el caso más común en Perú). Si usas macOS o Linux, los comandos son casi idénticos — voy a anotar las diferencias. Acompáñame con tu laptop abierta y repite cada paso.',
    steps: [
      {
        description: 'Verificar instalación de Python y crear carpeta del proyecto',
        code: {
          language: 'bash',
          title: 'Terminal',
          code: `# Verificar que Python está instalado
python --version
# Python 3.12.3  <- lo que deberías ver

# Si no está instalado, bajarlo de https://python.org/downloads
# En Windows, MARCAR la casilla "Add Python to PATH" durante la instalación

# Crear carpeta del proyecto
mkdir python-ds-journey
cd python-ds-journey

# Verificar que pip (gestor de paquetes) funciona
pip --version
# pip 24.0 from ... (python 3.12)`,
        },
        why: 'Siempre empezamos verificando que Python responde. En Windows, el PATH es el problema #1 — si te dice "python no se reconoce como comando", es porque no marcaste la casilla durante la instalación. La solución es reinstalar y asegurarte de marcarla.',
      },
      {
        description: 'Crear y activar entorno virtual con venv',
        code: {
          language: 'bash',
          title: 'Terminal',
          code: `# Crear entorno virtual llamado "venv" (puedes llamarlo como quieras)
python -m venv venv

# Activar en Windows (PowerShell)
venv\\Scripts\\Activate.ps1

# Activar en macOS/Linux
source venv/bin/activate

# Verás algo así en tu prompt:
# (venv) C:\\Users\\tu_usuario\\python-ds-journey>

# Para desactivar:
deactivate`,
        },
        why: 'El entorno virtual aísla las dependencias. Cuando activas `venv`, todo `pip install` que hagas se queda dentro de esa carpeta. Si rompes algo, basta con borrar la carpeta `venv/` y crearla de nuevo. Es como tener una caja de arena por proyecto.',
      },
      {
        description: 'Instalar paquetes esenciales y guardar requirements.txt',
        code: {
          language: 'bash',
          title: 'Terminal',
          code: `# Asegúrate de que venv esté activado (debes ver (venv) en el prompt)
pip install pandas numpy matplotlib seaborn jupyter

# Guardar las versiones exactas instaladas
pip freeze > requirements.txt

# El archivo se ve así:
# pandas==2.2.2
# numpy==1.26.4
# matplotlib==3.9.0
# seaborn==0.13.2
# jupyter==1.0.0
# ... (más dependencias transitivas)

# Para replicar el entorno en otra máquina:
pip install -r requirements.txt`,
        },
        why: 'El `requirements.txt` con versiones pinneadas (==) garantiza reproducibilidad. Si en 6 meses pandas 3.0 rompe tu código, puedes instalar exactamente la versión 2.2.2 y seguir trabajando. Sin este archivo, tu proyecto es irreproducible.',
      },
      {
        description: 'Inicializar Git y crear .gitignore',
        code: {
          language: 'bash',
          title: 'Terminal + .gitignore',
          code: `# Inicializar repositorio Git
git init

# Configurar tu identidad (solo la primera vez en cada máquina)
git config --global user.name "Tu Nombre"
git config --global user.email "tu_email@gmail.com"

# Crear archivo .gitignore (CRÍTICO)
# En Windows: echo ... > .gitignore (o crea el archivo con VS Code)
# En macOS/Linux: touch .gitignore

# Contenido del .gitignore:
# venv/
# __pycache__/
# *.pyc
# .env
# .vscode/
# *.ipynb_checkpoints/
# data/
# *.csv
# *.xlsx

# Primer commit
git add .
git status  # revisa qué se va a commitear
git commit -m "feat: setup inicial del proyecto Python DS"`,
        },
        why: 'El `.gitignore` evita que subas basura a GitHub. `venv/` pesa 100MB+ y no aporta nada — cualquiera puede regenerarlo con `pip install -r requirements.txt`. `__pycache__/` son archivos compilados de Python que se regeneran solos. `.env` contiene credenciales que NUNCA deben ir a un repo público.',
      },
      {
        description: 'Crear repo en GitHub y subir el código',
        code: {
          language: 'bash',
          title: 'Terminal',
          code: `# Opción 1: Usando GitHub CLI (recomendado)
# Instalar: https://cli.github.com/
gh auth login
gh repo create python-ds-journey --public --source=. --remote=origin --push

# Opción 2: Manual desde github.com
# 1. Crear repo vacío en https://github.com/new
# 2. Conectarlo:
git remote add origin https://github.com/TU_USUARIO/python-ds-journey.git
git branch -M main
git push -u origin main

# Verificar en https://github.com/TU_USUARIO/python-ds-journey
# Deberías ver tu requirements.txt y .gitignore`,
        },
        why: 'GitHub es tu portafolio público. Cada proyecto que subas es una prueba de que sabes trabajar como developer. Los reclutadores en Perú revisan tu GitHub antes de la entrevista técnica — un perfil con 5-10 repositorios bien mantenidos vale más que cualquier certificado.',
      },
    ],
  },
  weDo: {
    intro:
      'Ahora te toca a ti, pero con guía. Vamos a crear juntos un segundo proyecto más estructurado: un script `hello.py` que imprime información del sistema, lo subimos a GitHub con un README decente. Lee cada instrucción, intenta escribir el código tú mismo, y si te trabas revisa la solución.',
    steps: [
      {
        instruction: 'Crea un archivo hello.py que imprima tu nombre, la versión de Python y la fecha actual',
        hint: 'Usa el módulo `sys` para la versión de Python y `datetime` para la fecha. Recuerda `from datetime import datetime`.',
        starterCode: {
          language: 'python',
          title: 'hello.py',
          code: `# Tu código aquí
# 1. Importa sys y datetime
# 2. Define una variable nombre con tu nombre
# 3. Imprime las 3 cosas con f-strings

if __name__ == "__main__":
    pass  # tu código aquí`,
        },
        solutionCode: {
          language: 'python',
          title: 'hello.py',
          code: `import sys
from datetime import datetime

def main():
    nombre = "Maria Quispe"
    version_python = sys.version.split()[0]
    fecha = datetime.now().strftime("%d/%m/%Y %H:%M")

    print(f"Hola, soy {nombre}")
    print(f"Corriendo Python {version_python}")
    print(f"Fecha actual: {fecha}")

if __name__ == "__main__":
    main()`,
          output: `Hola, soy Maria Quispe
Corriendo Python 3.12.3
Fecha actual: 14/07/2026 19:45`,
        },
      },
      {
        instruction: 'Crea un README.md con título, descripción, instrucciones de instalación y uso',
        hint: 'El README es lo primero que ve un visitante de tu repo. Usa markdown: # para títulos, ## para subtítulos, bloques de código con ```.',
        starterCode: {
          language: 'markdown',
          title: 'README.md',
          code: `# [Tu título]

## Descripción
[Tu descripción]

## Instalación
\`\`\`bash
[tus comandos]
\`\`\`

## Uso
\`\`\`bash
[cómo ejecutar]
\`\`\``,
        },
        solutionCode: {
          language: 'markdown',
          title: 'README.md',
          code: `# Python DS Journey

Mi viaje aprendiendo Python para Data Science. Curso autónomo siguiendo el método I Do / We Do / You Do.

## Descripción

Este repo contiene mis proyectos y ejercicios del curso Python DS Perú. Cada carpeta corresponde a una sección del curso.

## Instalación

\`\`\`bash
# Clonar el repo
git clone https://github.com/TU_USUARIO/python-ds-journey.git
cd python-ds-journey

# Crear entorno virtual
python -m venv venv
source venv/bin/activate  # macOS/Linux
# o: venv\\Scripts\\Activate.ps1  # Windows

# Instalar dependencias
pip install -r requirements.txt
\`\`\`

## Uso

\`\`\`bash
python hello.py
\`\`\`

## Estructura

- \`hello.py\` — Script de prueba inicial
- \`section_01/\` — Setup y entorno
- \`section_02/\` — Basics de Python
- ...`,
        },
      },
      {
        instruction: 'Sube los cambios a GitHub con un commit bien escrito',
        hint: 'Recuerda: git add . && git commit -m "mensaje" && git push. Usa Conventional Commits.',
        starterCode: {
          language: 'bash',
          title: 'Terminal',
          code: `# Tu código aquí
# 1. Agrega todos los cambios
# 2. Haz commit con mensaje descriptivo
# 3. Sube a GitHub`,
        },
        solutionCode: {
          language: 'bash',
          title: 'Terminal',
          code: `git add .
git status  # verifica que hello.py y README.md están staged
git commit -m "feat: agregar hello.py y README inicial"
git push

# Output esperado:
# Enumerating objects: 5, done.
# ...
# To https://github.com/TU_USUARIO/python-ds-journey.git
#    abc1234..def5678  main -> main`,
        },
      },
    ],
  },
  youDo: {
    title: 'Reproducible Data Environment — Tu primer repo profesional',
    context:
      'Tu primer proyecto real de portafolio. Vas a crear un repo llamado `python-ds-journey` que servirá como journal público de tu aprendizaje. Cada sección del curso va a agregar carpetas y proyectos a este repo. Al final del curso, tendrás 10+ mini-proyectos subidos que demuestran progresión real — esto es oro para entrevistas.',
    objectives: [
      'Crear un repo público en GitHub con README, .gitignore y requirements.txt',
      'Configurar un entorno virtual aislado con venv',
      'Subir al menos 2 commits con mensajes siguiendo Conventional Commits',
      'Verificar que cualquier persona pueda clonar tu repo y replicar tu entorno en 3 comandos',
    ],
    requirements: [
      'Repo público: https://github.com/TU_USUARIO/python-ds-journey',
      'Archivo .gitignore que excluya venv/, __pycache__/, .env, *.pyc',
      'Archivo requirements.txt con al menos: pandas, numpy, matplotlib',
      'Archivo README.md con: título, descripción, instrucciones de instalación, uso',
      'Script hello.py que use if __name__ == "__main__"',
      'Mínimo 2 commits con mensajes tipo feat: o docs:',
    ],
    starterCode: `# Estructura final esperada del repo:
# python-ds-journey/
# ├── .gitignore
# ├── README.md
# ├── requirements.txt
# └── hello.py

# hello.py — tu código aquí
import sys
from datetime import datetime

def main():
    # TODO: imprime tu info
    pass

if __name__ == "__main__":
    main()`,
    portfolioNote:
      'Este repo va a crecer sección por sección. Cuando apliques a un puesto de Data Analyst, incluye el link en tu CV. Los reclutadores valoran ver progresión — alguien que empezó hace 2 meses y ya tiene 10 mini-proyectos subidos demuestra consistencia, que es lo más difícil de encontrar.',
    rubric: [
      { criterion: 'Repo público y accesible', weight: '15%' },
      { criterion: '.gitignore correctamente configurado', weight: '20%' },
      { criterion: 'requirements.txt con versiones pinneadas', weight: '20%' },
      { criterion: 'README.md completo y profesional', weight: '25%' },
      { criterion: 'Commits con Conventional Commits', weight: '10%' },
      { criterion: 'hello.py funciona al ejecutarlo', weight: '10%' },
    ],
  },
  selfCheck: {
    questions: [
      {
        question: '¿Para qué sirve un entorno virtual (venv) en Python?',
        options: [
          'Para acelerar la ejecución del código Python',
          'Para aislar las dependencias (paquetes) por proyecto y evitar conflictos de versiones',
          'Para conectarse a internet más rápido al instalar paquetes',
          'Para compilar Python a código de máquina más eficiente',
        ],
        correctIndex: 1,
        explanation:
          'venv crea una carpeta con su propia instalación de Python y paquetes. Esto evita que actualizar pandas en un proyecto rompa otro proyecto que depende de una versión anterior.',
      },
      {
        question: '¿Cuál de los siguientes archivos SÍ debería estar en tu .gitignore?',
        options: [
          'requirements.txt',
          'README.md',
          'venv/',
          'hello.py',
        ],
        correctIndex: 2,
        explanation:
          'venv/ pesa 100MB+ y se puede regenerar con `pip install -r requirements.txt`. requirements.txt y README.md son esenciales en el repo. hello.py es tu código fuente.',
      },
      {
        question: '¿Cuál es un buen mensaje de commit siguiendo Conventional Commits?',
        options: [
          '"cambios"',
          '"wip"',
          '"feat: agregar cálculo de churn por segmento"',
          '"arreglé el bug de ayer"',
        ],
        correctIndex: 2,
        explanation:
          'Conventional Commits usa prefijos como feat:, fix:, docs:, refactor: seguidos de una descripción corta e imperativa. Esto permite generar changelogs automáticamente y hace el historial legible.',
      },
      {
        question: '¿Qué comando te permite replicar el entorno de otro desarrollador?',
        options: [
          'pip install pandas numpy',
          'python -m venv venv',
          'pip install -r requirements.txt',
          'git clone https://github.com/usuario/repo.git',
        ],
        correctIndex: 2,
        explanation:
          '`pip install -r requirements.txt` lee el archivo con todas las dependencias y versiones, e instala exactamente eso. git clone solo trae el código, no instala nada. venv crea el entorno pero no instala paquetes.',
      },
      {
        question: '¿Por qué NO debes subir el archivo .env a GitHub?',
        options: [
          'Porque pesa demasiado y ralentiza el git push',
          'Porque suele contener credenciales (API keys, passwords, tokens) que son secretos',
          'Porque GitHub no soporta archivos sin extensión',
          'Porque entra en conflicto con requirements.txt',
        ],
        correctIndex: 1,
        explanation:
          'Los archivos .env guardan variables de entorno con secretos. Si los subes a un repo público, cualquiera puede usar tus credenciales. Es uno de los errores de seguridad más comunes y costosos en desarrollo.',
      },
    ],
  },
  resources: {
    docs: [
      { label: 'Python.org — Downloads', url: 'https://python.org/downloads/', note: 'Instalador oficial de Python' },
      { label: 'VS Code — Python extension', url: 'https://marketplace.visualstudio.com/items?itemName=ms-python.python', note: 'Extensión oficial de Microsoft' },
      { label: 'Git — official book', url: 'https://git-scm.com/book/es/v2', note: 'Libro gratuito de Git en español' },
      { label: 'Conventional Commits', url: 'https://www.conventionalcommits.org/', note: 'Estándar para mensajes de commit' },
      { label: 'GitHub Docs — Quickstart', url: 'https://docs.github.com/es/get-started/quickstart', note: 'Primeros pasos con GitHub' },
    ],
    books: [
      { label: 'Python 101', note: 'Capítulo sobre instalación y setup. Base para entender el entorno.' },
      { label: 'Python Apprentice to Master', note: 'Capítulo inicial sobre entorno profesional y convenciones.' },
    ],
    courses: [
      { label: 'CS50P — Harvard', url: 'https://cs50.harvard.edu/python', note: 'Semana 0 cubre setup detalladamente' },
      { label: 'GitHub Learning Lab', url: 'https://lab.github.com/', note: 'Cursos interactivos gratuitos de Git/GitHub' },
    ],
  },
}
