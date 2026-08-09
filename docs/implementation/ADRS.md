# ADRs — Architecture Decision Records

**Proyecto:** PyArcana
**Fecha:** 2026-08-02
**Commit base:** `0c722b61`
**Estado:** Fase 1 — decisiones preliminares, reversibles.

---

## ADR 1: Fuente de verdad

**Estado:** ACEPTADO

### Contexto

PyArcana tiene dos almacenes de datos potenciales: Prisma (SQLite) y Firestore (Firebase). Actualmente ambos están parcialmente activos y no está claro cuál es autoritativo. El código de servidor escribe en ambos (dual-write fire-and-forget en `src/lib/firebase/sync.ts`), pero solo lee de Prisma para decisiones de autorización. Firebase Auth opera como un sistema de identidad independiente paralelo a NextAuth.

### Decisión

**Prisma es la fuente autoritativa única para todos los datos operacionales.** Firestore es un mirror opcional de escritura desde el servidor, nunca leído para decisiones de acceso, pago, rol o elegibilidad.

| Clase de dato | Fuente autoritativa | Mirror | Notas |
|---|---|---|---|
| Identidad / cuentas | Prisma `User` | Firestore `users/{uid}` (opcional) | NextAuth con credenciales es la autoridad de autenticación. Firebase Auth se desactiva como sistema de identidad independiente (ver ADR 3). |
| Perfil | Prisma `User` | Firestore `users/{uid}` (opcional) | |
| Roles globales | Prisma `User.role` | — | Nunca copiar a Firestore para autorización. |
| Roles de cohort | Prisma `CohortMembership.scopedRole` | — | |
| Progreso | Prisma `Progress` | Firestore `progress/{userId}__{sectionId}__{subStep}` (opcional) | |
| Exámenes | Prisma `ExamAttempt` | Firestore (opcional) | |
| Suscripciones | Prisma `Subscription` + `SubscriptionEvent` | — | |
| Pagos | Prisma `Payment` + `PaymentEvent` | — | El proveedor de pago (Stripe/MercadoPago) es autoridad externa de eventos financieros. |
| Entitlements | Prisma `Entitlement` | — | PyArcana es autoridad sobre entitlements locales. |
| Teams | Prisma `Cohort` + `CohortMembership` | — | |
| Badges | Prisma `BadgeDefinition` + `BadgeAward` | — | |
| Credenciales | Prisma `Credential` + `CredentialEvidence` | — | Migrado fuera de `Notification`. |
| Preferencias | Prisma `NotificationPreference` + `UserPreferenceEvent` | — | |
| Auditoría | Prisma `AdminAuditEvent` + `CohortAuditEvent` | — | |
| Analítica | Prisma `AnalyticsEvent` | — | Destino derivado. |

### Reglas

1. El servidor **nunca** lee Firestore para decidir acceso, pago, rol o elegibilidad.
2. Una escritura en Firestore **no puede** confirmar una operación autoritativa.
3. Si Firestore falla, Prisma debe seguir funcionando normalmente.
4. La reconciliación repuebla el mirror desde Prisma, nunca al revés.
5. El SDK Admin de Firebase bypassa `firestore.rules` por diseño — las reglas solo protegen lecturas del SDK cliente.

### Justificación

- Prisma + SQLite ya funciona y es lo que el código servidor usa.
- Mantener dos fuentes de verdad requiere reconciliación bidireccional, que es compleja y propensa a errores.
- El usuario es principiante; una sola fuente de verdad es más fácil de operar.

---

## ADR 2: Base de datos — SQLite para Fase 1

**Estado:** ACEPTADO

### Contexto

El proyecto usa Prisma con SQLite (`file:./db/custom.db`). El usuario pregunta si debe migrar a PostgreSQL.

### Decisión

**Conservar SQLite para la Fase 1 (un solo nodo, un solo escritor).** Migrar a PostgreSQL solo cuando se cumpla uno de estos criterios objetivos:

| Criterio de migración | Umbral |
|---|---|
| Usuarios concurrentes activos | > 100 simultáneos |
| Escrituras concurrentes | > 10/segundo sostenidas |
| Necesidad de múltiples instancias del servidor | Sí (load balancing) |
| Workers en segundo plano separados | Sí (jobs programados, colas) |
| Tamaño de base de datos | > 1 GB |
| Necesidad de point-in-time recovery | Sí (requisito legal o contractual) |

### Requisitos para SQLite en producción

1. **Ruta absoluta y persistente** — no en `/tmp`, no en home de root. Recomendado: `/var/lib/pyarcana/db/custom.db`.
2. **Modo WAL** — `PRAGMA journal_mode=WAL` para permitir lecturas concurrentes sin bloquear escrituras.
3. **Un solo escritor** — Next.js standalone es el único proceso que escribe. Los workers leen de la misma DB o usan la API.
4. **Backup consistente** — usar `sqlite3 .backup` o el script `scripts/backup-sqlite.sh` (no copiar el archivo directamente mientras la app está activa).
5. **Integrity check** — `PRAGMA integrity_check` después de cada backup y antes de cada restore.
6. **Prohibido** almacenar la DB en Git, en almacenamiento efímero, o en una ruta no persistente.

### Justificación

- SQLite es suficiente para un proyecto educativo con un solo nodo.
- PostgreSQL añade complejidad operacional (connection pooling, TLS, backup strategy, staging separado) que el usuario principiante no necesita ahora.
- La migración es directa con Prisma: cambiar `datasource db` de `sqlite` a `postgresql`, ejecutar `prisma migrate deploy`.

---

## ADR 3: Autenticación — NextAuth como autoridad única

**Estado:** ACEPTADO

### Contexto

Actualmente existen dos sistemas de autenticación independientes:
1. **NextAuth** con CredentialsProvider — verifica email/contraseña contra Prisma `User.passwordHash`.
2. **Firebase Auth** — el SDK cliente registra/inicia sesión directamente con Firebase, sin pasar por el servidor.

Esto crea dos identidades separadas para un mismo usuario: un usuario NextAuth no tiene `uid` de Firebase (por lo que `firestore.rules` falla para él), y un usuario Firebase Auth no tiene fila en Prisma (por lo que no tiene rol, ni suscripción, ni progreso autoritativo).

### Decisión

**NextAuth con credenciales en Prisma es la autoridad de autenticación única para el LMS dinámico.** Firebase Auth se desactiva como sistema de identidad independiente.

#### Lo que cambia

| Antes | Después |
|---|---|
| `AuthModal.tsx` ofrece registro/login vía Firebase Auth Y vía NextAuth | `AuthModal.tsx` solo usa NextAuth (vía `/api/auth/register` + `/api/auth/[...nextauth]`) |
| Firebase Auth crea usuarios independientes | No se crean usuarios en Firebase Auth |
| `signedIn = !!session?.user \|\| !!fbUser` | `signedIn = !!session?.user` |
| Firestore `users/{uid}` se populateaba desde Firebase Auth | Firestore `users/{userId}` se popula desde Prisma (mirror opcional) |

#### Lo que NO cambia

- El SDK cliente de Firebase sigue disponible para Firestore (si el mirror está activado), pero **no para Auth**.
- `firestore.rules` sigue protegiendo lecturas del SDK cliente.
- La edición estática (GitHub Pages) sigue sin autenticación de servidor — el progreso es local.

#### Recuperación de contraseña

Se implementará con tokens aleatorios (no Firebase Auth):
1. Usuario solicita reset → servidor genera token aleatorio de 32 bytes.
2. Se almacena el SHA-256 del token en `PasswordResetToken` con expiración de 1 hora.
3. Se envía email con enlace `/reset-password?token=<token>`.
4. Al confirmar, servidor verifica el hash, actualiza `passwordHash`, invalida el token.
5. **NO EJECUTADO** en esta fase — se entrega el diseño y el schema, pero no el endpoint de envío de email (requiere configurar SMTP).

### Justificación

- Mantener dos sistemas de identidad para un mismo usuario es una vulnerabilidad de seguridad (contradictión #10).
- NextAuth ya está configurado y funciona.
- Firebase Auth añade complejidad sin valor si Prisma es la fuente de verdad.
- Si en el futuro se necesita OAuth (Google, GitHub), se añade como provider de NextAuth, no como sistema separado.

---

## ADR 4: Despliegue — VPS con Caddy + systemd

**Estado:** ACEPTADO (pendiente de confirmar que Hostinger VPS permite Node)

### Contexto

El usuario tiene (posiblemente) un VPS de Hostinger. Necesita decidir cómo desplegar el LMS dinámico.

### Decisión

**Recomendar VPS con Caddy + systemd para la Fase 1.**

| Opción | Ventajas | Desventajas | Veredicto |
|---|---|---|---|
| **Hostinger VPS** | Control total, SQLite funciona, backups controlados, costo bajo (~$5/mes) | Operación manual, hay que configurar todo | **RECOMENDADO** para Fase 1 |
| Plataforma Node administrada (Railway, Render) | Sin operación de servidor, deploys fáciles | SQLite no funciona bien (sistema de archivos efímero), más caro, menos control | Solo si VPS no es viable |
| Serverless (Vercel) | Sin servidores | SQLite no funciona, cold starts, límites de ejecución, costos impredecibles | **NO RECOMENDADO** para SQLite |

### Requisitos para el VPS

1. **Usuario de servicio sin root** — crear usuario `pyarcana` sin permisos sudo innecesarios.
2. **systemd** — servicio `pyarcana.service` que ejecuta `bun .next/standalone/server.js` como usuario `pyarcana`.
3. **Caddy** — reverse proxy con HTTPS automático (Let's Encrypt).
4. **Puerto 3000 no expuesto públicamente** — solo Caddy escucha en 80/443.
5. **DB en ruta persistente** — `/var/lib/pyarcana/db/custom.db`.
6. **Backups fuera del VPS** — no confiar solo en snapshots del proveedor.
7. **Logs rotados** — systemd+journald o logrotate.

### BLOQUEADO POR ACCESO

No se puede confirmar si el producto contratado en Hostinger permite ejecutar Node hasta que el propietario verifique:
- ¿El plan incluye acceso SSH root/sudo?
- ¿Puedo instalar paquetes (Caddy, bun)?
- ¿Hay suficiente RAM (mínimo 1 GB recomendado)?
- ¿El disco es persistente?

**Acción manual requerida:** el propietario debe verificar esto antes de proceder con el despliegue.

---

## ADR 5: Credenciales — HMAC con verificación exclusiva en servidor

**Estado:** ACEPTADO

### Contexto

Las credenciales de PyArcana (Class D) usan HMAC-SHA256 con `CREDENTIAL_SIGNING_KEY`. El commit `3752ecb4` añadió verificación client-side con `NEXT_PUBLIC_CREDENTIAL_VERIFY_KEY`, pero HMAC es simétrico: la clave de verificación es la misma de firma, por lo que enviarla al cliente expone la capacidad de forjar.

### Decisión

**HMAC-SHA256 con verificación exclusiva en servidor.** La página `/verify` hace una petición al endpoint `/api/credentials/verify` del LMS dinámico; el servidor verifica la firma y devuelve el resultado. El cliente NO verifica la firma.

#### Lo que cambia respecto al commit `3752ecb4`

| Antes (3752ecb4) | Después (este ADR) |
|---|---|
| Cliente recibe `signature` en la respuesta y la re-verifica con `NEXT_PUBLIC_CREDENTIAL_VERIFY_KEY` | Cliente NO recibe `signature`; solo muestra el resultado del servidor |
| `NEXT_PUBLIC_CREDENTIAL_VERIFY_KEY` se envía al cliente | No existe esa variable pública |
| Si el cliente intercepta el fetch, puede falsificar la respuesta PERO la re-verificación falla | Si el cliente intercepta el fetch, puede falsificar la respuesta Y no hay re-verificación client-side que la detecte |

#### Compromiso asumido

La verificación client-side con HMAC simétrico era defensa-en-profundidad contra intercepción de fetch, pero **falsa seguridad**: un atacante que intercepta el fetch puede también interceptar la importación de la clave y falsificar la verificación. La única verificación criptográfica real debe ser servidor-side.

#### Para verificación pública offline (futura)

Si en el futuro se necesita verificación offline (un empleador verifica sin contacto con el servidor), se migrará a **firma asimétrica Ed25519**:
- Servidor firma con clave privada (nunca expuesta).
- Cliente verifica con clave pública (publicada en el bundle).
- El atacante no puede firmar sin la clave privada.

**NO EJECUTADO en esta fase** — requiere cambiar el algoritmo de firma y migrar credenciales existentes.

### Reglas

1. `CREDENTIAL_SIGNING_KEY` es un secreto de servidor. **NUNCA** con prefijo `NEXT_PUBLIC_`.
2. Fallo rápido en producción si no está configurado (ya implementado en commit `3752ecb4`).
3. La página `/verify` muestra una advertencia clara en la edición estática: "La verificación no está disponible en la edición pública. Visita el LMS dinámico."
4. El endpoint `/api/credentials/verify` es público (no requiere auth) pero usa `timingSafeEqual` y validación de formato.

### Justificación

- HMAC simétrico con clave pública es una contradicción (contradición #11 del usuario).
- La verificación servidor-side es la única criptográficamente sólida.
- Ed25519 es el camino correcto para offline, pero requiere más trabajo y no es prioritario para Fase 1.

---

## ADR 6: Migraciones — `prisma migrate deploy` en producción

**Estado:** ACEPTADO

### Contexto

El proyecto usa `prisma db push` como procedimiento normal (script `db:push` en `package.json`). No existe el directorio `prisma/migrations/`. Esto es peligroso en producción: `db push` no genera migraciones versionadas, no permite rollback, y puede destruir datos si el esquema cambia de forma incompatible.

### Decisión

- **Desarrollo local:** `prisma migrate dev` (genera migraciones y las aplica).
- **Staging/Producción:** `prisma migrate deploy` (aplica migraciones existentes, no genera nuevas).
- **Prototipado rápido:** `prisma db push` (solo para experimentación, nunca en producción).
- **Reset destructivo:** `prisma migrate reset` (solo para datos descartables).

### Reglas

1. Toda migración debe tener un archivo SQL en `prisma/migrations/` con timestamp.
2. Antes de aplicar una migración en producción: backup + integrity check.
3. Después de aplicar: verificar conteos, claves foráneas, duplicados, nulls inesperados.
4. Toda migración debe probarse con una copia realista antes de producción.
5. Definir rollback o forward-fix para cada migración.
6. Registrar duración y versión de aplicación compatible.

### Acción inmediata

Crear la primera migración versionada con el esquema actual + las nuevas entidades de Fase 1.
