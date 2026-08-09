# Registro de Confusiones y Errores Previsibles

**Proyecto:** PyArcana
**Fecha:** 2026-08-02

Este documento responde explícitamente a las preguntas que una persona principiante probablemente hará, y previene las interpretaciones incorrectas más peligrosas.

---

## Glosario práctico

| Término | Definición |
|---|---|
| **Desarrollo local** | Ejecutas `bun run dev` en tu máquina. Base de datos local. No accesible desde internet. |
| **Staging** | Servidor de pruebas con datos realistas pero no productivos. No accesible para usuarios reales. |
| **Producción** | Servidor accesible por usuarios reales. Datos reales. Pagos reales (cuando se activen). |
| **Edición estática** | HTML/JS compilado servido por GitHub Pages. No hay servidor. No hay base de datos. No hay autenticación de servidor. |
| **LMS dinámico** | Servidor Next.js con base de datos, APIs, autenticación. El opuesto de la edición estática. |
| **Autenticación** | ¿Quién eres? (login, contraseña, token). |
| **Autorización** | ¿Qué puedes hacer? (roles, permisos, entitlements). |
| **Rol global** | Permiso que aplica a todo el sistema: `STUDENT`, `ADMIN`. |
| **Rol de cohort** | Permiso que aplica solo a un cohort específico: `COHORT_OWNER`, `COHORT_LEARNER`. |
| **Suscripción** | Relación recurrente entre un usuario y un plan: "Juan tiene Pro mensual desde marzo". |
| **Pago** | Una transacción financiera específica: "Se cobró S/29 el 1 de abril". |
| **Entitlement** | Derecho efectivo en un momento dado: "Juan puede acceder a secciones avanzadas hasta el 1 de mayo". |
| **Plan** | Catálogo de lo que se ofrece: "Pro incluye exámenes, playground, credenciales". |
| **Precio** | Monto cobrado por un plan en una región y ciclo: "Pro mensual en Perú cuesta S/29". |
| **Factura/comprobante** | Documento legal de un pago. Lo emite el proveedor de pago, no PyArcana. |
| **Backup** | Copia consistente de la base de datos, creada con un mecanismo que garantiza integridad. Se puede restaurar. |
| **Snapshot** | Copia del disco del VPS tomada por el proveedor (Hostinger). No es un backup consistente de la DB si la DB está activa. |
| **Réplica** | Copia sincronizada en tiempo real. No es lo mismo que un backup. |
| **Fuente de verdad** | El sistema cuya respuesta es definitiva cuando hay conflicto. En PyArcana: Prisma. |
| **Mirror** | Copia derivada de la fuente de verdad. No se usa para decisiones. En PyArcana: Firestore. |
| **Caché** | Copia temporal para rendimiento. Puede ser inconsistente. |
| **Evento analítico** | Registro de comportamiento del usuario para métricas de producto. No contiene PII. |
| **Log operativo** | Registro de eventos del servidor para debugging. Puede contener errores técnicos. |
| **Evento de auditoría** | Registro de acciones administrativas para rendir cuentas. Inmutable. |

---

## 30 confusiones

### 1. "¿GitHub Pages también guarda usuarios?"

**Interpretación incorrecta:** "Si registro un usuario en la edición pública de GitHub Pages, se guarda en algún lado."

**Consecuencia:** Un usuario cree que tiene una cuenta cuando en realidad solo tiene datos en localStorage (borrables al limpiar el navegador).

**Cómo detectarla:** Si la URL es `pillb.github.io/pyarcana/` y el registro funciona sin mostrar error, es la edición estática. No hay servidor.

**Prevención en código:** `IS_STATIC_SITE` gate en todas las rutas `/api/*` que escriben a la DB (falta implementar en 27 de 29 rutas).

**Prevención en documentación:** La página de registro en estático debe mostrar: "La edición pública no guarda cuentas. Tu progreso se guarda solo en este navegador."

**Prueba asociada:** `test_static_export_guard.py` verifica que `src/app/api/` se elimina del export estático.

**Mensaje de error recomendado:** "La edición pública (GitHub Pages) no soporta cuentas de servidor. Usa el LMS dinámico para registrar una cuenta."

---

### 2. "¿Firebase y Prisma contienen exactamente los mismos usuarios?"

**Interpretación incorrecta:** "Si registro un usuario en Prisma, automáticamente se crea en Firebase, y viceversa."

**Consecuencia:** Un usuario creado vía Firebase Auth no tiene fila en Prisma, por lo que no tiene rol, ni suscripción, ni progreso autoritativo. Un usuario creado vía NextAuth no tiene `uid` de Firebase, por lo que `firestore.rules` falla para él.

**Cómo detectarla:** Crear un usuario vía NextAuth, intentar leer su perfil de Firestore con el SDK cliente → denegado.

**Prevención en código:** ADR 3 desactiva Firebase Auth como sistema independiente. Todo pasa por NextAuth.

**Prevención en documentación:** Documentar que Prisma es la fuente de verdad y Firestore es solo un mirror opcional.

**Prueba asociada:** (nueva) Verificar que el registro vía NextAuth crea una fila en Prisma `User` y NO crea un usuario en Firebase Auth.

**Mensaje de error recomendado:** "No uses Firebase Auth para registrar usuarios. Usa el formulario de registro del LMS dinámico."

---

### 3. "¿Puedo cambiar `isPro` manualmente en la base?"

**Interpretación incorrecta:** "Si ejecuto `UPDATE User SET isPro = 1` en la base, el usuario tiene Pro."

**Consecuencia:** El estado de suscripción se corrompe. El historial no refleja el cambio. Los entitlements no se actualizan. Un auditor no puede reconstruir qué pasó.

**Cómo detectarla:** La columna `isPro` no existe en el schema (el campo es `Subscription.status` + `SubscriptionPlan.code`). Pero un operador podría intentar mutar `Subscription.status` directamente.

**Prevención en código:** Nunca mutar `Subscription` directamente. Siempre crear un `SubscriptionEvent` + actualizar `Subscription` en una transacción.

**Prevención en documentación:** "Nunca modifiques la tabla Subscription directamente. Usa los endpoints de la API o crea un SubscriptionEvent."

**Prueba asociada:** (nueva) Verificar que cambiar `Subscription.status` sin crear un `SubscriptionEvent` falla una prueba de integridad.

---

### 4. "¿Una página de pago exitosa confirma el cobro?"

**Interpretación incorrecta:** "Si el usuario llega a `success_url`, el pago se completó."

**Consecuencia:** Un usuario puede llegar a `success_url` sin que el pago se haya procesado (por ejemplo, cerrando la pestaña del proveedor de pago y navegando manualmente).

**Cómo detectarla:** Verificar que `Payment.status === 'SUCCEEDED'` en la DB, no confiar en la URL.

**Prevención en código:** `success_url` solo muestra "Procesando pago...". El estado real llega vía webhook del proveedor de pago.

**Prevención en documentación:** "Nunca otorgues acceso en `success_url`. Espera el webhook."

**Prueba asociada:** (nueva) Verificar que acceder a `success_url` sin webhook no activa el entitlement.

---

### 5. "¿Puedo copiar el archivo SQLite mientras la app está activa?"

**Interpretación incorrecta:** "Copiar `custom.db` con `cp` es un backup válido."

**Consecuencia:** La copia puede estar corrupta si una escritura está en progreso. SQLite puede tener datos en WAL no volcados al archivo principal.

**Cómo detectarla:** Restaurar la copia y ejecutar `PRAGMA integrity_check` → puede fallar.

**Prevención en código:** Usar `sqlite3 custom.db ".backup backup.db"` o `VACUUM INTO` que garantizan consistencia.

**Prevención en documentación:** "Nunca uses `cp` para respaldar SQLite activo. Usa `scripts/backup-sqlite.sh`."

**Prueba asociada:** (nueva) Verificar que un backup hecho con `cp` puede fallar `integrity_check`.

---

### 6. "¿`db push` es una migración?"

**Interpretación incorrecta:** "`prisma db push` crea una migración versionada."

**Consecuencia:** Los cambios no se versionan, no hay rollback, no hay historial de cambios de esquema.

**Cómo detectarla:** `ls prisma/migrations/` está vacío.

**Prevención en código:** Usar `prisma migrate dev` (desarrollo) y `prisma migrate deploy` (producción).

**Prevención en documentación:** ADR 6 documenta la diferencia.

**Prueba asociada:** (nueva) Verificar que `prisma/migrations/` no está vacío después de la Fase 1.

---

### 7. "¿`migrate dev` se usa en producción?"

**Interpretación incorrecta:** "`prisma migrate dev` aplica migraciones en producción."

**Consecuencia:** `migrate dev` puede generar migraciones nuevas (peligroso en producción) y resetear la base si hay conflicto (destructivo).

**Cómo detectarla:** Ejecutar `migrate dev` en producción y observar si crea archivos nuevos en `prisma/migrations/`.

**Prevención en código:** El script `db:migrate` usa `migrate dev`. Crear script `db:migrate:deploy` para producción.

**Prevención en documentación:** ADR 6.

---

### 8. "¿Un snapshot del VPS es suficiente?"

**Interpretación incorrecta:** "El snapshot automático de Hostinger respalda mi base de datos."

**Consecuencia:** Un snapshot captura el disco en un instante. Si SQLite está escribiendo, el snapshot puede capturar un estado inconsistente.

**Cómo detectarla:** Restaurar el snapshot y ejecutar `PRAGMA integrity_check`.

**Prevención en código:** `scripts/backup-sqlite.sh` hace un backup consistente + integrity check + checksum.

**Prevención en documentación:** "Los snapshots del VPS NO son suficientes. Usa el script de backup."

---

### 9. "¿Puedo ejecutar la app como root?"

**Interpretación incorrecta:** "Es más fácil ejecutar todo como root."

**Consecuencia:** Si la app es comprometida, el atacante tiene acceso root al VPS.

**Cómo detectarla:** `ps aux | grep node` muestra el proceso como root.

**Prevención en código:** systemd service file con `User=pyarcana`.

**Prevención en documentación:** "Nunca ejecutes la app como root. Crea un usuario `pyarcana`."

---

### 10. "¿Puedo poner un comando dentro de `.env`?"

**Interpretación incorrecta:** "`NEXTAUTH_SECRET=$(openssl rand -base64 32)` en `.env` genera el secreto automáticamente."

**Consecuencia:** El valor literal `$(openssl rand -base64 32)` se usa como secreto, no el resultado del comando.

**Cómo detectarla:** El proceso recibe la string literal, no un valor aleatorio.

**Prevención en código:** No se puede prevenir en código. Es un error de operación.

**Prevención en documentación:** ".env no ejecuta comandos. Genera el valor en la terminal, copia el resultado, pégalo como valor literal."

---

### 11. "¿Las variables `NEXT_PUBLIC_*` son secretas?"

**Interpretación incorrecta:** "`NEXT_PUBLIC_FIREBASE_API_KEY` es un secreto porque está en el archivo de entorno."

**Consecuencia:** Falsa sensación de seguridad. Las variables `NEXT_PUBLIC_*` se incrustan en el JS del navegador y son visibles para cualquiera.

**Cómo detectarla:** `grep -r 'NEXT_PUBLIC_' out/_next/static/chunks/` encuentra el valor en el bundle.

**Prevención en documentación:** "Las variables `NEXT_PUBLIC_*` son PÚBLICAS. Se incrustan en el bundle del navegador. NUNCA pongas secretos con este prefijo."

**Prueba asociada:** (nueva) Verificar que no hay secretos (claves privadas, NEXTAUTH_SECRET) en el bundle con prefijo `NEXT_PUBLIC_`.

---

### 12. "¿Firestore Rules protegen al SDK Admin?"

**Interpretación incorrecta:** "Las `firestore.rules` protegen contra todo acceso no autorizado."

**Consecuencia:** El SDK Admin (firebase-admin) bypassa las reglas por diseño. Si el servidor tiene credenciales de servicio, puede leer/escribir cualquier documento.

**Cómo detectarla:** Ejecutar una consulta con firebase-admin desde el servidor → siempre funciona, sin importar las reglas.

**Prevención en documentación:** "Las `firestore.rules` solo protegen lecturas del SDK cliente. El SDK Admin las bypassa. La seguridad del servidor depende del código de la aplicación, no de las reglas."

---

### 13. "¿Un rol ADMIN dentro del JWT se actualiza automáticamente?"

**Interpretación incorrecta:** "Si cambio el rol de un usuario en la base, su sesión JWT se actualiza al instante."

**Consecuencia:** Un usuario revocado como ADMIN mantiene acceso de administrador hasta que expira su JWT (7 días).

**Cómo detectarla:** Cambiar `User.role` de `ADMIN` a `STUDENT` en la base; el usuario aún puede acceder a `/api/admin/*`.

**Prevención en código:** Session callback re-lee `role` de la base en cada petición. (Falta implementar — Fase 1.)

**Prueba asociada:** (nueva) Verificar que tras revocar el rol, la siguiente petición con el JWT viejo falla.

---

### 14-30. (Resumidas por espacio — cada una sigue el mismo formato)

| # | Pregunta | Interpretación incorrecta | Prevención |
|---|---|---|---|
| 14 | "¿Middleware es suficiente para proteger la base?" | Middleware protege la base | Middleware es primera barrera; la autorización debe estar en cada consulta/mutación |
| 15 | "¿El `teamId` del navegador demuestra membresía?" | Sí | No. Verificar membresía en servidor con `CohortMembership` |
| 16 | "¿Cancelar al final = cancelar ahora?" | Sí | No. Cancelar al final conserva acceso hasta `currentPeriodEnd`; cancelar ahora revoca inmediatamente |
| 17 | "¿Un pago reembolsado debe borrar el historial?" | Sí | No. El historial es inmutable. El reembolso crea un evento nuevo, no borra el pago |
| 18 | "¿Reactivar conserva la racha?" | Sí | Depende de si hay gap. La racha se reconstruye desde eventos, no desde un campo |
| 19 | "¿`createdAt` indica desde cuándo paga?" | Sí | No. `createdAt` es la creación de la cuenta. `subscriberSince` se calcula desde `SubscriptionEvent` |
| 20 | "¿Todos los eventos analíticos pueden guardar email?" | Sí | No. Catálogo de propiedades permitidas. Email NO está permitido por defecto |
| 21 | "¿Soft delete satisface una solicitud de eliminación?" | Sí | No. Soft delete marca como inactivo pero conserva datos. Eliminación GDPR requiere anonimizar o destruir |
| 22 | "¿Un HMAC puede verificarse públicamente con una public key?" | Sí | No. HMAC es simétrico. La clave de verificación = la de firma. Usar Ed25519 para verificación pública (ADR 5) |
| 23 | "¿Guardar una credencial en Notification es suficiente?" | Sí | No. Necesita entidad propia con integridad referencial, evidencia, revocación (Fase 1) |
| 24 | "¿Un mirror fallido se arregla automáticamente?" | Sí | No. Requiere reconciliación explícita desde Prisma |
| 25 | "¿UTC y hora de Lima producen el mismo día?" | Sí | No. Lima es UTC-5. A las 20:00 Lima del 1 de agosto, UTC es 01:00 del 2 de agosto |
| 26 | "¿Una prueba local con claves sandbox prueba producción?" | Sí | No. Sandbox y live usan credenciales y URLs diferentes |
| 27 | "¿`localhost:3000` puede quedarse en producción?" | Sí | No. `NEXTAUTH_URL` debe ser la URL pública en producción |
| 28 | "¿El correo del usuario puede usarse como ID permanente?" | Sí | No. El email puede cambiar. Usar `User.id` (cuid) como ID |
| 29 | "¿Una invitación puede reutilizarse?" | Sí | No. Single-use. `status` cambia a `ACCEPTED` al aceptar; no se puede aceptar dos veces |
| 30 | "¿Una cuenta suspendida mantiene su sesión?" | Sí | No. La sesión debe invalidarse. Session callback verifica `User.status` |
