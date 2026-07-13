# Python DS Perú — Plataforma de Aprendizaje con LMS Completo + Features Avanzadas

![Tests](https://github.com/USUARIO/python-ds-peru/actions/workflows/tests.yml/badge.svg)
![Deploy](https://github.com/USUARIO/python-ds-peru/actions/workflows/deploy.yml/badge.svg)

Plataforma de aprendizaje online autónoma, en español peruano, que te lleva de cero a Data Analyst / Data Scientist con Python. **Incluye LMS completo** + **editor de código interactivo en el browser** + **glosario buscable** + **reportes PDF/certificados** + **11 secciones con los 10 gaps de los EPUBs cubiertos**.

## 🎯 ¿Para quién es?

- Profesionales en Lima/Perú que quieren pivotear a Data Analysis o Data Science
- Estudiantes universitarios que necesitan un portafolio para conseguir prácticas
- Developers que quieren aprender el stack de Data Science (pandas, sklearn, SHAP)
- Instituciones educativas que necesitan un LMS con dashboard de monitoreo

## 📚 Estructura del curso (11 secciones + gap analysis de EPUBs)

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
| **11** | **Advanced Python for DS** ⭐ NUEVO | **16** | **Avanzado** | **Lead Scraper CLI** (capstone integrador) |

**Total**: 86 horas estimadas · 11 proyectos de portafolio · 50+ ejercicios

### 📖 Cobertura de EPUBs (gap analysis completo + sección 11)

Se realizó análisis comparativo de los 3 EPUBs contra las 10 secciones originales del curso. Se identificaron 10 gaps críticos que se cubren en la **Sección 11 (nueva)**:

1. ✅ **Iterators & generators (`yield`)** — Python 201 Ch7
2. ✅ **Web scraping (BeautifulSoup + Selenium)** — Python 201 Ch19, AwesomeJob Ch5
3. ✅ **REST APIs (requests + JSON pagination)** — Python 201 Ch20
4. ✅ **SQL databases (sqlite3 + SQLAlchemy + pd.read_sql)** — Python 101 Ch18/34
5. ✅ **Multiprocessing & concurrent.futures** — Python 201 Ch29-30
6. ✅ **Regular expressions** — Python 201 Ch9
7. ✅ **collections (Counter, defaultdict, namedtuple, deque)** — Python 201 Ch2
8. ✅ **Profiling & benchmarking (timeit, cProfile, line_profiler)** — Python 101 Ch27
9. ✅ **Logging (stdlib `logging`)** — Python 101 Ch15
10. ✅ **argparse / CLI tooling** — Python 201 Ch1

El gap analysis completo está en `/home/z/my-project/worklog.md` (Task IDs: P0-A y T2).

## 🔐 Sistema de Autenticación (LMS)

### Cuentas demo (creadas por el seed)
- **Admin**: `admin@python-ds.pe` / `admin123`
- **Estudiante**: `demo@python-ds.pe` / `demo1234`

### Features de auth
- ✅ Registro con email + password (bcrypt cost factor 12)
- ✅ Login con credentials provider (NextAuth v4)
- ✅ Sessions JWT (7 días de expiración)
- ✅ Rate limiting: 5 intentos de registro por IP cada 15 min
- ✅ Validación con zod en todos los endpoints
- ✅ Primer usuario registrado → rol ADMIN automáticamente
- ✅ Botones OAuth Google + Microsoft (cableados en código, requieren credenciales reales en .env)
- ✅ Cuentas demo de un clic para testing rápido
- ✅ `.env.example` con todas las variables documentadas
- ✅ `auth.ts` con `buildProviders()` que detecta OAuth automáticamente cuando hay env vars

### Para habilitar OAuth real
Ver guía completa en [DEPLOY.md](./DEPLOY.md#configurar-oauth-opcional). Resumen:
1. Crear OAuth app en Google Cloud Console / Azure Portal
2. Setear redirect URIs a `https://tu-dominio.com/api/auth/callback/google` (o `azure-ad`)
3. Agregar credenciales a `.env` (ver `.env.example`)
4. Descomentar imports y bloques `if (...)` en `src/lib/auth.ts`
5. Redeploy — los botones OAuth funcionarán realmente

## 📊 Tracking de Progreso Per-Usuario

### Modelos de datos (Prisma + SQLite)
- **User**: id, email, name, passwordHash, role (STUDENT|ADMIN), timestamps
- **Progress**: userId, sectionId, subStep, completed, completedAt, bookmarked
- **QuestionBank**: sectionId, concept, variant (1-3), question, options, correctIndex, explanation
- **ExamAttempt**: userId, sectionId, attemptNumber (1-3), answers (JSON), score, timestamps, variantSeed (audit trail)
- **ExerciseAttempt**: userId, sectionId, exerciseId, usedHint, correct, timestamp

### Sync dual (local + servidor)
- Sin login: progreso en localStorage (Zustand persist)
- Con login: hydrate desde servidor + sync automático en cada cambio (fire-and-forget)

## 🎯 Exámenes Inteligentes con Anti-Plagio

### Question Bank con 3 variantes por concepto
- **132 preguntas** en el bank (11 secciones × 4 conceptos × 3 variantes equivalentes)
- Cada intento selecciona aleatoriamente UNA variante por concepto
- No repite variantes entre intentos del mismo usuario

### Reglas de examen
- ✅ Máximo **3 intentos** por sección (2 retries)
- ✅ Cada intento tiene **preguntas diferentes** (variantes equivalentes)
- ✅ **Shuffle de orden** de preguntas (anti-copia entre pantallas)
- ✅ Necesitas **70% para aprobar**
- ✅ Tu mejor score es el que cuenta
- ✅ **Audit trail completo**: cada intento guarda `variantSeed`
- ✅ Tracking de **tiempo** por intento
- ✅ **Respuestas detalladas** guardadas

## 👨‍🏫 Dashboard de Administración (Master)

### Features
- ✅ **Listado de estudiantes** con búsqueda por email/nombre
- ✅ **Stats globales**: total estudiantes, completado promedio, score promedio, total exámenes
- ✅ **Tabla** con: nombre, email, fecha registro, % completado, exámenes rendidos, score promedio
- ✅ **Drill-down por estudiante**: análisis de gaps por sección, historial completo de intentos
- ✅ **Audit trail visible**: variantes usadas por intento (anti-plagio verification)
- ✅ **Export CSV**: estudiantes y intentos de examen (con auth)

## 💻 Editor de Código Interactivo (Pyodide) ⭐ NUEVO

¡Los estudiantes pueden **ejecutar Python de verdad en el browser** sin instalar nada!

- ✅ Carga Pyodide (Python 3.11 compilado a WebAssembly) desde CDN
- ✅ Editor con syntax highlighting básico, line numbers, soporte Tab
- ✅ Botón **Run** ejecuta el código y muestra stdout/stderr
- ✅ **Comparación automática** con output esperado (✓ correcto / ✗ incorrecto)
- ✅ **Hints** colapsables por ejercicio
- ✅ **Reset** para volver al código inicial
- ✅ **Demos interactivos** en las secciones 1-6 (setup, basics, data structures, functions, OOP, NumPy)
- ✅ Graceful degradation: si Pyodide no carga, muestra mensaje pero el curso sigue funcionando
- ✅ Respeta `prefers-reduced-motion`

### Cómo usarlo en teoría
Cualquier bloque de código con `python runnable` como lenguaje se renderiza como editor interactivo:
```
\`\`\`python runnable title="Mi editor"
print("Hola mundo")
\`\`\`
```

## 📖 Glosario Buscable ⭐ NUEVO

- ✅ **65 términos** de Python, Data Science, NumPy, Pandas, ML y Tooling
- ✅ **Búsqueda full-text** (término, definición, categoría)
- ✅ **Filtros por categoría** (Python, Data Science, NumPy, Pandas, ML, Tooling)
- ✅ **Vista de detalle** con definición + ejemplo de código + términos relacionados
- ✅ **Atajo de teclado** Cmd/Ctrl+K para enfocar búsqueda
- ✅ Accesible desde header desktop y mobile
- ✅ Navegación entre términos relacionados

## 📄 Reportes PDF y Certificados ⭐ NUEVO

### Reporte de progreso
- ✅ PDF con stats (secciones, exámenes, scores, tiempo)
- ✅ Tabla detallada por sección (sub-steps, intentos, mejor score)
- ✅ Generado via `window.print()` → "Guardar como PDF"
- ✅ Disponible para usuarios logueados

### Certificado de finalización
- ✅ Certificado oficial con nombre del estudiante, fecha, ID único
- ✅ Diseño premium con gradientes y bordes
- ✅ **Desbloqueable**: requiere completar al menos 8 de 11 secciones
- ✅ Formato A4 landscape listo para imprimir

## 🌐 i18n Toggle (3 idiomas) ⭐ NUEVO

- ✅ **Español peruano** (default — "chevere", "pega", local flavor)
- ✅ **Español neutro** (variante para mercado internacional hispanohablante)
- ✅ **English** (para alcanzar mercado internacional)
- ✅ Toggle en header con flags 🇵🇪 🇪🇸 🇬🇧
- ✅ Persistencia en localStorage
- ✅ Infraestructura `useT()` hook lista para usar
- ⚠️ Nota: el contenido del curso (teoría, ejercicios) se mantiene en español peruano por requisito pedagógico. El i18n aplica a UI strings (botones, labels, mensajes).

## 🚀 Deploy (3 opciones documentadas)

### Guía completa: [DEPLOY.md](./DEPLOY.md)

| Proveedor | LMS funciona | Gratuito | Dificultad |
|-----------|--------------|----------|------------|
| **Vercel** ⭐ | ✅ Completo | Sí (hobby) | Fácil |
| **Railway** | ✅ Completo | Trial $5 | Media |
| **GitHub Pages** | ❌ Solo contenido | Sí | Fácil |

### Configs incluidos
- ✅ `vercel.json` — config de Vercel con build command y env vars
- ✅ `.env.example` — todas las variables documentadas (DB, NextAuth, OAuth)
- ✅ `.github/workflows/deploy.yml` — deploy automático a GitHub Pages
- ✅ `.github/workflows/tests.yml` — CI con ESLint

### Migrar a PostgreSQL (recomendado para producción)
SQLite no persiste en serverless. Guía paso a paso en [DEPLOY.md](./DEPLOY.md#migrar-a-postgresql-recomendado-para-producción).

## 🧠 Metodología pedagógica

Cada sección sigue el framework **Gradual Release of Responsibility** (Corwin, Ferry):

1. **I Do (Yo hago)** — Demostración guiada con explicación del "por qué" de cada línea
2. **We Do (Hacemos juntos)** — Práctica con starter code, hints y solución para comparar
3. **You Do (Tú haces)** — Proyecto independiente para portafolio GitHub
4. **Autocheck / Examen** — Quiz con feedback inmediato (sin login) o examen con anti-plagio (con login)

## 🛠️ Stack técnico

### Frontend
- **Framework**: Next.js 16 + TypeScript + Tailwind CSS 4
- **UI**: shadcn/ui (Radix primitives) + Lucide icons
- **Animaciones**: Framer Motion (con `prefers-reduced-motion`)
- **State**: Zustand con `persist` (local) + server sync (cuando logueado)
- **Code editor**: Pyodide (Python en WebAssembly) cargado desde CDN

### Backend
- **Auth**: NextAuth v4 (Credentials provider + JWT sessions + OAuth ready)
- **DB**: Prisma ORM + SQLite (dev) / PostgreSQL (producción)
- **Password hashing**: bcryptjs (cost factor 12)
- **Validation**: zod en todos los endpoints
- **Rate limiting**: in-memory token bucket (5 intentos / 15 min / IP)

### i18n
- Zustand store persistente
- 3 idiomas: es-PE, es-ES, en
- Hook `useT()` para componentes

## 🚀 Cómo correr el proyecto

```bash
# 1. Instalar dependencias
bun install

# 2. Copiar .env.example a .env y editar
cp .env.example .env
# Edita NEXTAUTH_SECRET con: openssl rand -base64 32

# 3. Push schema + seed
bun run db:push
bun run db:seed  # crea cuentas demo + 132 preguntas

# 4. Modo desarrollo
bun run dev
# Abre http://localhost:3000

# 5. Login con cuentas demo
# Admin:    admin@python-ds.pe / admin123
# Student:  demo@python-ds.pe / demo1234
```

## 📦 Deploy

Ver [DEPLOY.md](./DEPLOY.md) para guía completa de deploy a Vercel, Railway o GitHub Pages.

## 🔒 Seguridad

- ✅ Passwords hasheados con bcrypt (cost 12)
- ✅ JWT sessions con secret
- ✅ Cookies HttpOnly + SameSite=Lax (NextAuth default)
- ✅ Validación zod en todos los endpoints
- ✅ Prisma parameterized queries (sin SQL injection)
- ✅ Rate limiting en registro
- ✅ Admin role check en todas las rutas `/api/admin/*`
- ✅ Ownership check en exámenes (no puedes ver intentos de otros)
- ⚠️ OAuth requiere credenciales reales para producción (ver DEPLOY.md)
- ⚠️ Rate limiting es in-memory (se resetea en serverless cold start) — para producción usar Upstash Redis

## 🎓 Certificaciones recomendadas (paralelas al curso)

| Certificación | Plataforma | Costo |
|----------------|------------|-------|
| CS50P — Introduction to Programming with Python | [cs50.harvard.edu](https://cs50.harvard.edu/python) | Gratis |
| Google Python Certificate (IT Automation) | [Coursera](https://www.coursera.org/professional-certificates/google-it-automation) | Audit gratis |
| Kaggle Learn tracks | [kaggle.com/learn](https://www.kaggle.com/learn) | Gratis |

## 📖 Libros de referencia (incluidos como EPUBs)

- **Python 101** — Michael Driscoll (44 capítulos)
- **Python 201** — Michael Driscoll (30 capítulos)
- **Use Python to Become AWESOME at Your Job** — Shantnu Tiwari (8 capítulos)
- **Python Apprentice to Master** — (referencia adicional)

Gap analysis completo de los 3 EPUBs vs las 11 secciones del curso en `/home/z/my-project/worklog.md`.

## 🏗️ Estructura del repositorio

```
python-ds-peru/
├── prisma/
│   ├── schema.prisma          # 5 modelos: User, Progress, QuestionBank, ExamAttempt, ExerciseAttempt
│   └── seed.ts                # Seed: 132 preguntas + cuentas demo
├── src/
│   ├── app/
│   │   ├── api/               # API routes (auth, progress, exam, exercise, admin)
│   │   ├── layout.tsx         # Root con Providers (SessionProvider)
│   │   ├── page.tsx           # SPA con 4 views + auth modal + glossary + pdf report
│   │   └── globals.css        # Tailwind 4 + tema EdTech premium + animaciones
│   ├── components/
│   │   ├── ui/                # shadcn/ui
│   │   ├── Providers.tsx      # Client wrapper para SessionProvider
│   │   └── course/            # Componentes del curso + LMS + bonus features
│   │       ├── AuthModal.tsx       # Login + registro + OAuth + demo
│   │       ├── ExamView.tsx        # Examen inteligente con variantes + retries
│   │       ├── AdminDashboard.tsx  # Dashboard master con CSV export
│   │       ├── CodePlayground.tsx  # Editor Pyodide interactivo ⭐
│   │       ├── Glossary.tsx        # Glosario buscable ⭐
│   │       ├── PdfReport.tsx       # Reportes PDF + certificados ⭐
│   │       ├── LanguageToggle.tsx  # Toggle i18n 3 idiomas ⭐
│   │       ├── Sidebar.tsx
│   │       ├── Dashboard.tsx
│   │       ├── SectionView.tsx
│   │       └── ...
│   └── lib/
│       ├── auth.ts            # NextAuth config + OAuth ready
│       ├── db.ts              # Prisma client
│       ├── i18n.ts            # Sistema de traducciones ⭐
│       ├── progress-store.ts  # Zustand + server sync
│       ├── course/sections/   # 11 archivos de contenido (denso 1500+ palabras c/u)
│       └── types.ts
├── .github/workflows/         # CI: tests + deploy
├── .env.example               # Variables de entorno documentadas ⭐
├── vercel.json                # Config de Vercel ⭐
├── DEPLOY.md                  # Guía de deploy completa ⭐
├── upload/                    # 4 EPUBs de referencia
└── README.md
```

## 📈 Características implementadas (checklist completo)

### Curso base
- ✅ SPA con tabs (Teoría / I Do / We Do / You Do / Autocheck)
- ✅ 11 secciones con contenido denso (1500+ palabras cada una)
- ✅ Progress tracking en localStorage + server sync
- ✅ Dark mode, responsivo, animaciones
- ✅ CodeBlock, Callouts, RichText renderer
- ✅ URL hash navigation

### LMS
- ✅ Sistema de auth completo (password + mock OAuth)
- ✅ Sessions JWT con NextAuth v4
- ✅ Prisma + SQLite con 5 modelos
- ✅ Progress tracking per-usuario (server-side)
- ✅ Question bank con 132 preguntas (3 variantes × 4 conceptos × 11 secciones)
- ✅ Exámenes inteligentes con selección aleatoria de variantes
- ✅ Máximo 3 intentos por sección (2 retries)
- ✅ Audit trail completo (variantSeed por intento)
- ✅ Dashboard admin con listado, búsqueda, drill-down, CSV export
- ✅ Cuentas demo (admin + estudiante)

### Bonus features ⭐
- ✅ Editor de código interactivo con Pyodide (Python en browser)
- ✅ Glosario buscable (65 términos, 6 categorías, Cmd+K)
- ✅ Reportes PDF de progreso
- ✅ Certificados de finalización (desbloqueables)
- ✅ i18n toggle (español peruano / neutro / inglés)

### Deploy + docs ⭐
- ✅ `.env.example` con todas las variables
- ✅ `vercel.json` config
- ✅ `DEPLOY.md` guía completa (Vercel, Railway, GitHub Pages)
- ✅ Guía de migración a PostgreSQL
- ✅ Guía de configuración OAuth (Google + Microsoft)

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