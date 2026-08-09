# Truth Audit — Matriz de Capacidades

**Proyecto:** PyArcana
**Fecha:** 2026-08-02
**Commit auditado:** `0c722b61`
**Etiquetas:** `VERIFICADO` (leído del código) · `INFERIDO` (deducido pero no confirmado) · `NO EJECUTADO` · `BLOQUEADO POR ACCESO`

---

## Matriz de modalidades

| Capacidad | GitHub Pages (estático) | LMS dinámico local | LMS dinámico staging | LMS dinámico producción |
|---|---|---|---|---|
| Registro | `NO DISPONIBLE` | `VERIFICADO` `/api/auth/register` | `VERIFICADO` | `REQUIERE DESPLIEGUE` |
| Login | Firebase Auth (cliente) `VERIFICADO` | NextAuth `VERIFICADO` | `VERIFICADO` | `REQUIERE DESPLIEGUE` |
| Logout | Cliente `VERIFICADO` | NextAuth `VERIFICADO` | `VERIFICADO` | `REQUIERE DESPLIEGUE` |
| Recuperación contraseña | Firebase Auth `VERIFICADO` | `NO EXISTE` (server-side) | `NO EXISTE` | `NO EXISTE` |
| Persistencia progreso | localStorage `VERIFICADO` | Prisma `VERIFICADO` | `VERIFICADO` | `REQUIERE DESPLIEGUE` |
| Progreso | localStorage `NO AUTORITATIVO` | Prisma `AUTORITATIVO` | `AUTORITATIVO` | `REQUIERE DESPLIEGUE` |
| Exámenes | `NO DISPONIBLE` | `/api/exam/*` `VERIFICADO` | `VERIFICADO` | `REQUIERE DESPLIEGUE` |
| Pagos | `NO DISPONIBLE` | `NO EXISTE` (webhook) | `NO EXISTE` | `NO EXISTE` |
| Credenciales | `NO DISPONIBLE` (verify muestra error) | `/api/credentials/*` `VERIFICADO` | `VERIFICADO` | `REQUIERE DESPLIEGUE` |
| Dashboards admin | `NO DISPONIBLE` | `/api/admin/*` `VERIFICADO` | `VERIFICADO` | `REQUIERE DESPLIEGUE` |
| Teams/Cohorts | `NO DISPONIBLE` | `/api/cohorts/*` `VERIFICADO` | `VERIFICADO` | `REQUIERE DESPLIEGUE` |
| Firestore | SDK cliente (Auth+Firestore) | Mirror write-only `VERIFICADO` | `VERIFICADO` | `REQUIERE DESPLIEGUE` |
| Analítica | `NO DISPONIBLE` | `/api/admin/analytics` (read-only) `VERIFICADO` | `VERIFICADO` | `REQUIERE DESPLIEGUE` |
| Email | Firebase Auth (reset) | `NO EXISTE` (SMTP) | `NO EXISTE` | `NO EXISTE` |
| Webhooks | `NO DISPONIBLE` | `NO EXISTE` | `NO EXISTE` | `NO EXISTE` |
| Jobs | `NO DISPONIBLE` | `NO EXISTE` | `NO EXISTE` | `NO EXISTE` |
| Backups | N/A | `NO EXISTE` | `NO EXISTE` | `REQUIERE SCRIPT` |

---

## Matriz de funciones (truth audit)

| Función | Ya existe | Existe parcialmente | No existe | Fuente autoritativa actual | Datos almacenados | API | UI | Pruebas | Riesgo | Contradicción | Recomendación mínima | Fase |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **Registro** | `VERIFICADO` | | | Prisma `User` | `email`, `passwordHash`, `role=STUDENT` | `/api/auth/register` | AuthModal | `VERIFICADO` (source-grep: role server-set) | BAJO | Ninguna | Mantener | 1 |
| **Login** | `VERIFICADO` | | | NextAuth + Prisma | JWT con `id`, `role` | `/api/auth/[...nextauth]` | AuthModal | `INFERIDO` (no prueba JWT revocado) | MEDIO | JWT no refresca rol tras revocación (#16) | Session callback re-lee role de DB | 1 |
| **Logout** | `VERIFICADO` | | | NextAuth | — | `/api/auth/[...nextauth]` | AuthModal | — | BAJO | Ninguna | Mantener | 1 |
| **Recuperación contraseña** | | | `VERIFICADO` (server-side) | Firebase Auth (cliente) | Firebase Auth | Firebase SDK | AuthModal | — | ALTO | Dos sistemas de identidad (#10) | Implementar tokens en Prisma (ADR 3) | 2 |
| **Roles globales** | `VERIFICADO` | | | Prisma `User.role` | `STUDENT` \| `ADMIN` | — | — | — | MEDIO | Rol en JWT no se refresca (#16) | Session callback re-lee role | 1 |
| **Roles de cohort** | `VERIFICADO` | | | Prisma `CohortMembership.scopedRole` | `COHORT_OWNER` \| `SUPERVISOR` \| `REPORTER` \| `LEARNER` | `/api/cohorts/*` | Dashboard | — | BAJO | Ninguna | Mantener | 1 |
| **Revocación de roles** | | | `VERIFICADO` | — | — | — | — | — | ALTO | JWT mantiene rol 7 días (#16) | Session callback + token version | 1 |
| **Progreso** | | `VERIFICADO` | | Prisma `Progress` | `userId`, `sectionId`, `subStep`, `completed` | `/api/progress` | Dashboard | — | ALTO | `completed` aceptado del cliente (#15) | Renombrar a `markedCompletedByUser`; no usar para credenciales | 1 |
| **Attempts (ejercicios)** | | `VERIFICADO` | | Prisma `ExerciseAttempt` | `correct` del cliente | `/api/exercise/attempt` | — | — | ALTO | `correct` aceptado del cliente (#15) | Remover `correct` del schema; computar servidor | 1 |
| **Self-checks** | | `VERIFICADO` | | localStorage (cliente) | `quizScores` en zustand | — | QuizTab | — | MEDIO | Respuestas en bundle (inherente) | Crear `SelfCheckAttempt` en Prisma (dinámico) | 1 |
| **Exámenes** | `VERIFICADO` | | | Prisma `ExamAttempt` | Server-side grading | `/api/exam/start`, `/api/exam/submit` | ExamView | `VERIFICADO` (grading) | BAJO | Ninguna | Mantener | 1 |
| **Suscripciones** | | `VERIFICADO` | | Prisma `Subscription` (1 fila/user) | `status`, `planId`, `currentPeriodEnd` | `/api/subscription/*` | — | — | ALTO | Una sola fila = sin historial (#13) | Crear `SubscriptionEvent` + `SubscriptionPeriod` | 1 |
| **Pagos** | | `VERIFICADO` | | Prisma `Payment` | `amount`, `status=PENDING` | `/api/subscription/checkout` | — | — | ALTO | Payment fuera de transacción (#14); sin webhook | Wrap en `$transaction`; crear `WebhookEvent` | 1 |
| **Entitlements** | | | `VERIFICADO` | Implícito en `Subscription.plan` | — | — | — | — | ALTO | No existe entidad | Crear `Entitlement` model | 1 |
| **Teams/Cohorts** | `VERIFICADO` | | | Prisma `Cohort` + `CohortMembership` | — | `/api/cohorts/*` | Dashboard | — | MEDIO | `maxMembers` del cliente | Validar contra entitlement | 1 |
| **Invitaciones** | `VERIFICADO` | | | Prisma `CohortInvitation` | `tokenHash`, `expiresAt`, `status` | `/api/invitations/[id]` | — | `SKIP` (4 placeholders) | MEDIO | No se prueba expiración/reuso | Implementar los 4 test.skip() | 1 |
| **Credenciales** | | `VERIFICADO` | | Prisma `Notification.body` (JSON) | Credential completa en Notification | `/api/credentials/*` | `/verify` | — | ALTO | Credencial en Notification (#12) | Crear `Credential` + `CredentialEvidence` + `CredentialRevocation` | 1 |
| **Firebase** | | `VERIFICADO` | | Mirror write-only | — | `/api/firebase/status` | — | — | MEDIO | Auth independiente (#10); vars mal documentadas (#1) | Desactivar Firebase Auth; fix docs (ADR 3) | 1 |
| **Analítica** | | `VERIFICADO` | | Computada de DB (read-only) | — | `/api/admin/analytics` | AdminDashboard | — | BAJO | No hay ingesta de eventos | Crear `AnalyticsEvent` + catálogo de propiedades | 2 |
| **Auditoría** | | `VERIFICADO` | | Prisma `CohortAuditEvent` | — | (solo via dashboard) | — | — | MEDIO | No hay auditoría admin global | Crear `AdminAuditEvent` | 1 |
| **Backups** | | | `VERIFICADO` | — | — | — | — | — | ALTO | Solo db push (#3, #6); no hay backup | Crear `scripts/backup-sqlite.sh` + restore test | 1 |
| **Deployment** | | `VERIFICADO` | | GitHub Actions → GitHub Pages | — | — | — | `VERIFICADO` (static) | MEDIO | No hay deployment dinámico | Crear systemd + Caddy templates (ADR 4) | 1 |

---

## Contradicciones comprobadas (estado actual)

| # | Contradicción | Estado | Evidence |
|---|---|---|---|
| 1 | Variables Firebase documentadas con nombres diferentes a los usados por el código | `VERIFICADO` (sigue presente) | `docs/FIREBASE_SETUP.md` usa `FIREBASE_ADMIN_CLIENT_EMAIL` y `FIREBASE_ADMIN_PRIVATE_KEY`; el código lee `FIREBASE_CLIENT_EMAIL` y `FIREBASE_PRIVATE_KEY` |
| 2 | Comandos `$(...)` escritos dentro de `.env` | `VERIFICADO` (no presente en .env.example) | `.env.example` usa comentarios, no inline commands |
| 3 | Uso de `db push` como procedimiento productivo | `VERIFICADO` (sigue presente) | `package.json` script `db:push` es el único script de DB para desarrollo; no hay `prisma/migrations/` |
| 4 | Ejecución de la aplicación como root | `NO EJECUTADO` (no hay deployment dinámico) | No hay systemd ni deployment dinámico todavía |
| 5 | Inicio mediante `bun run start &` | `NO EJECUTADO` | No hay deployment dinámico |
| 6 | Rutas de Bun que dependen del home de root | `NO EJECUTADO` | No hay deployment dinámico |
| 7 | Base SQLite en una ruta no persistente | `VERIFICADO` (potencial) | `.env.example` usa `file:./db/custom.db` (relativa al CWD) |
| 8 | Logging de queries en producción | `VERIFICADO` (sigue presente) | `src/lib/db.ts` tiene `log: ['query']` incondicional |
| 9 | Guía que afirma crear tablas que no existen | `INFERIDO` | Requiere revisión doc por doc |
| 10 | Firebase presentado simultáneamente como auth, almacenamiento y mirror sin decisión | `VERIFICADO` (sigue presente) | Firebase Auth es sistema independiente; Firestore es mirror write-only; no hay decisión documentada |
| 11 | HMAC descrito como firma verificable con public key | `VERIFICADO` (parcialmente corregido) | Commit `3752ecb4` añadió `NEXT_PUBLIC_CREDENTIAL_VERIFY_KEY` que es simétrica — ADR 5 revierte esto |
| 12 | Credenciales guardadas como cuerpo de Notification | `VERIFICADO` (sigue presente) | `/api/credentials/issue` guarda en `Notification.body`; `/api/credentials/verify` lee de ahí |
| 13 | Una única fila de Subscription usada como historial | `VERIFICADO` (sigue presente) | `Subscription` es 1:1 con User; no hay `SubscriptionEvent` ni `SubscriptionPeriod` |
| 14 | Creación de Payment fuera de una transacción relacionada | `VERIFICADO` (sigue presente) | `/api/subscription/checkout` hace `db.subscription.update` + `db.payment.create` separados |
| 15 | Progreso o corrección aceptados directamente del navegador | `VERIFICADO` (sigue presente) | `/api/progress` acepta `completed: z.boolean()`; `/api/exercise/attempt` acepta `correct: z.boolean()` |
| 16 | Roles copiados a JWT que no se refrescan tras revocación | `VERIFICADO` (sigue presente) | `auth.ts` jwt callback copia `role` una vez; session callback lo lee del token, no de DB |
| 17 | Falta de reconciliación del mirror | `VERIFICADO` | No existe endpoint ni job de reconciliación |
| 18 | Falta de restauración realmente probada | `VERIFICADO` | No existe script de backup ni prueba de restore |
| 19 | Suposición de que el snapshot de Hostinger basta como backup | `INFERIDO` | `docs/HOSTINGER_SETUP.md` menciona snapshots |
| 20 | Uso de `localhost` en configuración productiva | `VERIFICADO` (en .env.example) | `NEXTAUTH_URL="http://localhost:3000"` en .env.example |
