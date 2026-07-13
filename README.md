# Python DS Perú — Plataforma de Aprendizaje con LMS Completo

![Tests](https://github.com/USUARIO/python-ds-peru/actions/workflows/tests.yml/badge.svg)
![Deploy](https://github.com/USUARIO/python-ds-peru/actions/workflows/deploy.yml/badge.svg)

Plataforma de aprendizaje online autónoma, en español peruano, que te lleva de cero a Data Analyst / Data Scientist con Python. **Incluye LMS completo**: cuentas de usuario, tracking de progreso, exámenes inteligentes con anti-plagio, y dashboard de administración.

## 🎯 ¿Para quién es?

- Profesionales en Lima/Perú que quieren pivotear a Data Analysis o Data Science
- Estudiantes universitarios que necesitan un portafolio para conseguir prácticas
- Developers que quieren aprender el stack de Data Science (pandas, sklearn, SHAP)
- Instituciones educativas que necesitan un LMS con dashboard de monitoreo

## 📚 Estructura del curso (10 secciones + gap analysis de EPUBs)

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

### 📖 Cobertura de EPUBs (gap analysis completo)

Se realizó análisis comparativo de los 3 EPUBs contra las 10 secciones del curso:

- **Python 101** (Michael Driscoll, 44 capítulos): Cobertura ~70%. Cubierto: basics, estructuras, archivos, funciones, OOP, csv, datetime. Parcial: decorators, testing. Faltantes identificados: logging, sqlite3, subprocess, pdb, requests, SQLAlchemy.
- **Python 201** (Michael Driscoll, 30 capítulos): Cobertura ~40%. Cubierto: super/MRO, partial coverage. Faltantes identificados: collections (Counter, defaultdict, namedtuple), context managers avanzados, functools, iterators/generators, itertools, regex, typing, Unicode, Web scraping, asyncio, threading, multiprocessing.
- **Use Python to Become AWESOME at Your Job** (Shantnu Tiwari, 8 capítulos): Cobertura ~20%. Faltantes: config/env/CLI, bash replacement, Excel/Doc/PDF parsing, web scraping + Selenium, multiprocessing distribuido, Cython/Numba.

**Top 10 gaps críticos identificados** (priorizados para futura expansión):
1. Iterators & generators (`yield`) — Python 201 Ch7
2. Web scraping (BeautifulSoup + Selenium) — Python 201 Ch19, AwesomeJob Ch5
3. REST APIs (requests + JSON) — Python 201 Ch20
4. SQL databases (sqlite3 + SQLAlchemy) — Python 101 Ch18/34
5. Multiprocessing & concurrent.futures — Python 201 Ch29-30
6. Regular expressions — Python 201 Ch9
7. collections (Counter, defaultdict, namedtuple) — Python 201 Ch2
8. Profiling & benchmarking — Python 101 Ch27, Python 201 Ch13
9. Logging (stdlib) — Python 101 Ch15
10. argparse / CLI tooling — Python 201 Ch1

El gap analysis completo está en `/home/z/my-project/worklog.md` (Task ID: P0-A).

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

### Para habilitar OAuth real
```bash
# .env
GOOGLE_CLIENT_ID=tu_client_id_de_google
GOOGLE_CLIENT_SECRET=tu_secret_de_google
MICROSOFT_CLIENT_ID=tu_client_id_de_microsoft
MICROSOFT_CLIENT_SECRET=tu_secret_de_microsoft
MICROSOFT_TENANT_ID=tu_tenant_id
NEXTAUTH_SECRET=tu_secret_de_32_chars_min
NEXTAUTH_URL=https://tu-dominio.com
```

Descomenta los providers en `src/lib/auth.ts` (GoogleProvider, MicrosoftProvider).

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
- Server hydration al iniciar sesión, no se pierde progreso local

## 🎯 Exámenes Inteligentes con Anti-Plagio

### Question Bank con 3 variantes por concepto
Cada concepto de cada sección tiene **3 preguntas equivalentes** (variantes 1, 2, 3). El seed incluye:
- 10 secciones × 4 conceptos × 3 variantes = **120 preguntas** en el bank
- Cada intento selecciona aleatoriamente UNA variante por concepto
- No repite variantes entre intentos del mismo usuario (hasta donde sea posible)

### Reglas de examen
- ✅ Máximo **3 intentos** por sección (2 retries)
- ✅ Cada intento tiene **preguntas diferentes** (variantes equivalentes)
- ✅ **Shuffle de orden** de preguntas (anti-copia entre pantallas)
- ✅ Necesitas **70% para aprobar**
- ✅ Tu mejor score es el que cuenta
- ✅ **Audit trail completo**: cada intento guarda `variantSeed` (qué variante se usó por concepto)
- ✅ Tracking de **tiempo** por intento
- ✅ **Respuestas detalladas** guardadas (correct/incorrect, selectedIndex, explanation)

### UI del examen
- Pantalla de inicio con reglas + intentos anteriores
- Pantalla de examen con preguntas y opciones
- Pantalla de resultado con score, anillo de progreso, revisión detallada
- Botón "Reintentar" con contador de intentos restantes

## 👨‍🏫 Dashboard de Administración (Master)

### Acceso
Solo usuarios con `role === 'ADMIN'` pueden acceder. Botón "Admin" visible en header solo para admins.

### Features
- ✅ **Listado de estudiantes** con búsqueda por email/nombre
- ✅ **Stats globales**: total estudiantes, completado promedio, score promedio, total exámenes
- ✅ **Tabla** con: nombre, email, fecha registro, % completado, exámenes rendidos, score promedio
- ✅ **Drill-down por estudiante**: análisis de gaps por sección, historial completo de intentos
- ✅ **Audit trail visible**: variantes usadas por intento (anti-plagio verification)
- ✅ **Export CSV**: estudiantes y intentos de examen (con auth)

### CSV exports
- `GET /api/admin/export?type=students` → estudiantes con métricas
- `GET /api/admin/export?type=attempts` → todos los intentos de examen

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

### Backend
- **Auth**: NextAuth v4 (Credentials provider + JWT sessions)
- **DB**: Prisma ORM + SQLite
- **Password hashing**: bcryptjs (cost factor 12)
- **Validation**: zod en todos los endpoints
- **Rate limiting**: in-memory token bucket (5 intentos / 15 min / IP)

### Database schema
Ver `prisma/schema.prisma` para el modelo completo. 5 modelos:
- User, Progress, QuestionBank, ExamAttempt, ExerciseAttempt

## 🚀 Cómo correr el proyecto

```bash
# 1. Instalar dependencias
bun install

# 2. Configurar .env (mínimo para dev)
echo 'DATABASE_URL=file:./db/custom.db' > .env
echo 'NEXTAUTH_SECRET=dev-secret-change-in-production-min-32-chars' >> .env
echo 'NEXTAUTH_URL=http://localhost:3000' >> .env

# 3. Push schema + seed
bun run db:push
bun run db:seed  # crea cuentas demo + 120 preguntas

# 4. Modo desarrollo
bun run dev
# Abre http://localhost:3000

# 5. Login con cuentas demo
# Admin:    admin@python-ds.pe / admin123
# Student:  demo@python-ds.pe / demo1234
```

## 📦 Deploy a GitHub Pages (static export)

1. Fork/clone este repo
2. Settings → Pages → Source → GitHub Actions
3. Push a `main` — el workflow `.github/workflows/deploy.yml` se ejecuta
4. Tu sitio estará en `https://TU_USUARIO.github.io/python-ds-peru/`

**Nota**: El LMS (auth + exámenes + admin) requiere backend. Para deploy estático, el LMS no funciona — solo el contenido del curso. Para LMS completo, deploya en Vercel/Netlify/Railway.

## 🔒 Seguridad

- ✅ Passwords hasheados con bcrypt (cost 12)
- ✅ JWT sessions con secret
- ✅ Cookies HttpOnly + SameSite=Lax (NextAuth default)
- ✅ Validación zod en todos los endpoints
- ✅ Prisma parameterized queries (sin SQL injection)
- ✅ Rate limiting en registro
- ✅ Admin role check en todas las rutas `/api/admin/*`
- ✅ Ownership check en exámenes (no puedes ver intentos de otros)
- ⚠️ OAuth requiere credenciales reales para producción
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

Gap analysis completo de los 3 EPUBs vs las 10 secciones del curso en `/home/z/my-project/worklog.md`.

## 🏗️ Estructura del repositorio

```
python-ds-peru/
├── prisma/
│   ├── schema.prisma          # 5 modelos: User, Progress, QuestionBank, ExamAttempt, ExerciseAttempt
│   └── seed.ts                # Seed: 120 preguntas + cuentas demo
├── src/
│   ├── app/
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # NextAuth + register
│   │   │   ├── progress/      # GET/POST/PATCH progreso
│   │   │   ├── exam/          # start, submit, attempts
│   │   │   ├── exercise/      # attempt tracking
│   │   │   └── admin/         # students, [id], export (CSV)
│   │   ├── layout.tsx         # Root con Providers (SessionProvider)
│   │   ├── page.tsx           # SPA con 4 views: home, section, resources, admin
│   │   └── globals.css        # Tailwind 4 + tema EdTech premium
│   ├── components/
│   │   ├── ui/                # shadcn/ui
│   │   ├── course/            # Componentes del curso + LMS
│   │   │   ├── AuthModal.tsx       # Login + registro + OAuth buttons + demo accounts
│   │   │   ├── ExamView.tsx        # Examen inteligente con variantes + retries
│   │   │   ├── AdminDashboard.tsx  # Dashboard master con CSV export
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── SectionView.tsx
│   │   │   └── ...
│   │   └── Providers.tsx      # Client wrapper para SessionProvider
│   └── lib/
│       ├── auth.ts            # NextAuth config + Credentials provider
│       ├── db.ts              # Prisma client
│       ├── progress-store.ts  # Zustand + server sync
│       ├── course/sections/   # 10 archivos de contenido (denso 1500+ palabras c/u)
│       └── types.ts
├── .github/workflows/         # CI: tests + deploy
├── upload/                    # 4 EPUBs de referencia
└── README.md
```

## 📈 Características implementadas (checklist completo)

### Curso base (entrega anterior)
- ✅ SPA con tabs (Teoría / I Do / We Do / You Do / Autocheck)
- ✅ 10 secciones con contenido denso (1500+ palabras cada una)
- ✅ Progress tracking en localStorage
- ✅ Quiz simple (sin login)
- ✅ Dark mode, responsivo, animaciones
- ✅ CodeBlock, Callouts, RichText renderer
- ✅ URL hash navigation

### LMS (entrega esta sesión)
- ✅ Sistema de auth completo (password + mock OAuth)
- ✅ Sessions JWT con NextAuth v4
- ✅ Prisma + SQLite con 5 modelos
- ✅ Progress tracking per-usuario (server-side)
- ✅ Sync dual (local + servidor)
- ✅ Question bank con 120 preguntas (3 variantes × 4 conceptos × 10 secciones)
- ✅ Exámenes inteligentes con selección aleatoria de variantes
- ✅ Máximo 3 intentos por sección (2 retries)
- ✅ Audit trail completo (variantSeed por intento)
- ✅ Tracking de tiempo por intento
- ✅ Respuestas detalladas guardadas
- ✅ Dashboard admin con listado, búsqueda, drill-down
- ✅ Análisis de gaps por estudiante
- ✅ Export CSV (estudiantes + intentos)
- ✅ Rate limiting en registro
- ✅ Cuentas demo (admin + estudiante)
- ✅ Primer usuario → admin automático
- ✅ Gap analysis de 3 EPUBs completado

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
