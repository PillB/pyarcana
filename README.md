# Python DS Perú — Curso Online de Python para Data Analyst/Scientist

![Tests](https://github.com/USUARIO/python-ds-peru/actions/workflows/tests.yml/badge.svg)
![Deploy](https://github.com/USUARIO/python-ds-peru/actions/workflows/deploy.yml/badge.svg)

Curso online autónomo, en español peruano, que te lleva de cero a Data Analyst / Data Scientist con Python. 10 secciones, método pedagógico **I Do / We Do / You Do**, proyectos de portafolio por sección, y alineación con requisitos del mercado peruano e internacional 2025-2026.

## 🎯 ¿Para quién es?

- Profesionales en Lima/Perú que quieren pivotear a Data Analysis o Data Science
- Estudiantes universitarios que necesitan un portafolio para conseguir prácticas
- Developers que quieren aprender el stack de Data Science (pandas, sklearn, SHAP)
- Cualquier hispanohablante que prefiera contenido en español peruano natural

## 📚 Estructura del curso

| # | Sección | Horas | Nivel | Mini-proyecto |
|---|---------|-------|-------|---------------|
| 1 | Setup & Entorno | 4 | Principiante | Repo `python-ds-journey` |
| 2 | Basics de Python | 8 | Principiante | Personal Budget Calculator |
| 3 | Data Structures & Files | 8 | Principiante | Sales Log Parser (ETL) |
| 4 | Functions, Modules & Decorators | 8 | Intermedio | File Organizer Automation |
| 5 | OOP | 10 | Intermedio | Custom ML Pipeline Class |
| 6 | NumPy | 6 | Intermedio | Student Exam Score Analyzer |
| 7 | Pandas & EDA | 12 | Intermedio | Netflix EDA Report |
| 8 | Visualización | 8 | Intermedio | 4-panel dashboard + Plotly |
| 9 | scikit-learn | 14 | Avanzado | **Churn Prediction Pipeline** (capstone) |
| 10 | Testing | 6 | Avanzado | Test suite + GitHub Actions CI |

**Total**: 70 horas estimadas · 10 proyectos de portafolio · 50+ ejercicios

## 🧠 Metodología pedagógica

Cada sección sigue el framework **Gradual Release of Responsibility** (Corwin, Ferry):

1. **I Do (Yo hago)** — Demostración guiada con explicación del "por qué" de cada línea
2. **We Do (Hacemos juntos)** — Práctica con starter code, hints y solución para comparar
3. **You Do (Tú haces)** — Proyecto independiente para portafolio GitHub
4. **Autocheck** — Quiz con feedback inmediato (70% mínimo para avanzar)

Adicionalmente aplicamos:
- Constructivismo (Vygotsky ZPD): cada concepto engancha con conocimiento previo
- Active recall: quizzes que fuerzan recuperación, no relectura
- Spaced repetition: conceptos clave se refuerzan entre secciones
- Project-based learning: todo termina en un artifact público en GitHub

## 🛠️ Stack técnico

- **Frontend**: Next.js 16 + TypeScript + Tailwind CSS 4 + shadcn/ui
- **Animaciones**: Framer Motion (con `prefers-reduced-motion` respetado)
- **State**: Zustand con `persist` middleware (progreso guardado en localStorage)
- **Visualización**: Radix UI primitives + Lucide icons
- **Deployment**: GitHub Pages (static export)

## 🚀 Cómo correr el proyecto localmente

```bash
# Clonar el repo
git clone https://github.com/USUARIO/python-ds-peru.git
cd python-ds-peru

# Instalar dependencias
bun install

# Modo desarrollo
bun run dev
# Abre http://localhost:3000

# Build estático para producción
bun run build:static
# Output en ./out/
```

## 📦 Deploy a GitHub Pages

1. Fork/clone este repo a tu cuenta de GitHub
2. Ve a **Settings → Pages → Source → GitHub Actions**
3. Push a `main` — el workflow `.github/workflows/deploy.yml` se ejecuta automáticamente
4. Tu sitio estará en `https://TU_USUARIO.github.io/python-ds-peru/`

## 🎓 Certificaciones recomendadas (paralelas al curso)

| Certificación | Plataforma | Costo |
|----------------|------------|-------|
| CS50P — Introduction to Programming with Python | [cs50.harvard.edu](https://cs50.harvard.edu/python) | Gratis |
| Google Python Certificate (IT Automation) | [Coursera](https://www.coursera.org/professional-certificates/google-it-automation) | Audit gratis |
| Kaggle Learn tracks | [kaggle.com/learn](https://www.kaggle.com/learn) | Gratis |

## 📖 Libros de referencia (incluidos como EPUBs)

- **Python 101** — Introducción amigable
- **Python Apprentice to Master** — Crecimiento estructurado
- **Use Python to Become AWESOME at Your Job** — Python aplicado al trabajo
- **python201** — Temas intermedios-avanzados

## 💼 Alineación con el mercado laboral

Investigación de LinkedIn Perú +LATAM 2025-2026 confirmó:

- **Keywords top**: Python, pandas, NumPy, scikit-learn, SQL, Git/GitHub, EDA, ML, regression/classification
- **Tools emergentes**: XGBoost, SHAP, Optuna, MLflow, FastAPI, pytest, GitHub Actions
- **Salary ranges Lima**: Data Analyst S/3,500-5,500/mo · Data Scientist S/5,000-9,000/mo
- **Salary ranges remoto internacional**: USD 70k-120k/año para mid-level

Cada sección del curso mapea directamente a skills pedidas en ofertas de trabajo reales.

## 🏗️ Estructura del repositorio

```
python-ds-peru/
├── src/
│   ├── app/                    # Layout y página principal SPA
│   │   ├── layout.tsx          # Root layout con fuentes Inter + JetBrains Mono
│   │   ├── page.tsx            # SPA con sidebar + dashboard + section view
│   │   └── globals.css         # Tailwind 4 + tema EdTech premium + animaciones
│   ├── components/
│   │   ├── ui/                 # shadcn/ui components
│   │   └── course/             # Componentes del curso
│   │       ├── CodeBlock.tsx       # Syntax highlighting + copy button
│   │       ├── Callout.tsx         # Info/Warning/Tip/Danger boxes
│   │       ├── Sidebar.tsx         # Navegación + progress tracking
│   │       ├── Dashboard.tsx       # Home con stats + curriculum grid
│   │       ├── SectionView.tsx     # Vista de sección con 4 tabs pedagógicos
│   │       ├── ResourcesPage.tsx   # Biblioteca de recursos
│   │       ├── ProgressRing.tsx    # Anillo de progreso animado
│   │       └── RichText.tsx        # Renderer de markdown ligero
│   └── lib/
│       ├── course/
│       │   ├── index.ts            # Agregador de 10 secciones
│       │   └── sections/           # Una archivo por sección (denso 1500+ palabras)
│       ├── progress-store.ts       # Zustand store con persist
│       └── types.ts                # Tipos del dominio
├── .github/workflows/          # CI: tests + deploy a Pages
├── upload/                     # 4 EPUBs de referencia
└── README.md
```

## 📈 Características implementadas

- ✅ SPA con tabs (Teoría / I Do / We Do / You Do / Autocheck)
- ✅ Progress tracking persistente en localStorage
- ✅ Sidebar navegable con 10 secciones + sub-steps
- ✅ Quiz interactivo con 5 preguntas por sección + scoring
- ✅ Dark mode con `next-themes`
- ✅ Responsive: mobile-first, optimizado desktop (MacBook 13"/16")
- ✅ Animaciones Framer Motion con `prefers-reduced-motion`
- ✅ CodeBlock con syntax highlighting custom + copy button
- ✅ Callouts (Info/Warning/Tip/Success/Danger)
- ✅ URL hash navigation (shareable links)
- ✅ Bookmark de secciones favoritas
- ✅ Dashboard con stats (progreso total, quizzes, días activos)
- ✅ Página de recursos con EPUBs + cursos externos + docs oficiales

## 🎨 Identidad visual

**EdTech premium** inspirado en Coursera/Brilliant:
- Paleta violeta-cian con gradientes
- Tipografía Inter (sans) + JetBrains Mono (code)
- Cards con sombras suaves y hover transitions
- Micro-animaciones (fade-in-up, scale-in, stagger)

## 📝 Licencia

MIT — usa este código para tu propio aprendizaje o para enseñar a otros.

## 🤝 Contribuir

Issues y PRs bienvenidos. Si encuentras errores de contenido (especialmente en español peruano), abre un issue con tu corrección propuesta.
