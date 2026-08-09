# Matriz de Variables de Entorno

**Proyecto:** PyArcana
**Fecha:** 2026-08-02
**Commit auditado:** `0c722b61`

## Reglas

1. **NUNCA** escribas comandos `$(...)` dentro de un archivo `.env`. Genera el valor en la terminal, copia el resultado, pégalo como valor literal.
2. **NUNCA** uses prefijo `NEXT_PUBLIC_` para secretos. Las variables con este prefijo se incrustan en el JS del navegador y son visibles para cualquiera.
3. **NUNCA** uses `localhost` en `NEXTAUTH_URL` en producción.
4. **NUNCA** mezcles IDs sandbox y live del mismo proveedor de pago.
5. **SIEMPRE** valida que las variables documentadas coincidan con las que el código lee. (Prueba: `tests/adversarial/test_env_matrix.py`)

---

## Matriz

| Variable | Pública/Secreta | Build/Runtime | Entorno | Formato | Ejemplo ficticio | Método de generación | Efecto cuando falta |
|---|---|---|---|---|---|---|---|
| `DATABASE_URL` | SECRETA | Runtime | Todos | `file:<ruta-absoluta>` | `file:/var/lib/pyarcana/db/custom.db` | N/A | App no inicia |
| `NEXTAUTH_SECRET` | SECRETA | Runtime | Dinámico (obligatoria) | String ≥ 32 chars | `k7$mB2xQ9vLp...` | `openssl rand -base64 32` | Producción: fail-fast. Desarrollo: se genera una automática. |
| `NEXTAUTH_URL` | PÚBLICA | Runtime | Dinámico | URL HTTPS | `https://pyarcana.dev` | N/A | NextAuth usa URL incorrecta; redirects fallan |
| `NEXT_PUBLIC_STATIC_SITE` | PÚBLICA | Build-time | Estático: `1`, Dinámico: no set | `1` o unset | `1` | N/A | Si unset: modo dinámico (requiere DB) |
| `NEXT_PUBLIC_BASE_PATH` | PÚBLICA | Build-time | Estático: `pyarcana`, Dinámico: unset | String | `pyarcana` | N/A | Si unset en estático: rutas no incluyen `/pyarcana/` |
| `NEXT_OUTPUT` | PÚBLICA | Build-time | Estático: `export`, Dinámico: unset | `export` o unset | `export` | N/A | Si unset: build standalone (no static export) |
| `NEXT_PUBLIC_CREDENTIAL_VERIFY_KEY` | PÚBLICA | Build-time | — | — | — | — | **ELIMINADA** en ADR 5 (HMAC simétrico no es verificable públicamente) |
| `CREDENTIAL_SIGNING_KEY` | SECRETA | Runtime | Dinámico (obligatoria en prod) | String ≥ 32 chars | `k7$mB2xQ9vLp...` | `openssl rand -base64 32` | Producción: fail-fast (commit `3752ecb4`). Desarrollo: fallback `dev-only-key-not-for-production-use` |
| `FIREBASE_PROJECT_ID` | SECRETA | Runtime | Dinámico (opcional) | String | `pyarcana-prod` | Firebase Console | Mirror desactivado |
| `FIREBASE_CLIENT_EMAIL` | SECRETA | Runtime | Dinámico (opcional) | Email | `firebase-adminsdk@pyarcana-prod.iam.gserviceaccount.com` | Firebase Console → Service Account | Mirror desactivado |
| `FIREBASE_PRIVATE_KEY` | SECRETA | Runtime | Dinámico (opcional) | PEM con `\n` | `-----BEGIN PRIVATE KEY-----\nMIIE...` | Firebase Console → Service Account | Mirror desactivado. **OJO**: los `\n` deben ser saltos de línea reales, no la string literal `\n` |
| `FIREBASE_SERVICE_ACCOUNT_JSON` | SECRETA | Runtime | Dinámico (opcional, alternativa) | JSON string | `{"type":"service_account",...}` | Firebase Console → Service Account → JSON | Mirror desactivado. Alternativa a las 3 variables anteriores |
| `FIREBASE_SYNC_ENABLED` | SECRETA | Runtime | Dinámico (opcional) | `true`/`false` | `true` | N/A | Si unset: se asume `false`. Mirror desactivado |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | PÚBLICA | Build-time | Estático/Dinámico (opcional) | String | `AIzaSyD...` | Firebase Console → SDK setup | Sin Firebase cliente (Auth desactivada, Firestore cliente desactivado) |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | PÚBLICA | Build-time | Estático/Dinámico (opcional) | Domain | `pyarcana-prod.firebaseapp.com` | Firebase Console | Sin Firebase cliente |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | PÚBLICA | Build-time | Estático/Dinámico (opcional) | String | `pyarcana-prod` | Firebase Console | Sin Firebase cliente. **Debe igualar `FIREBASE_PROJECT_ID`** (server) |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | PÚBLICA | Build-time | Estático/Dinámico (opcional) | String | `pyarcana-prod.appspot.com` | Firebase Console | Sin Firebase cliente |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | PÚBLICA | Build-time | Estático/Dinámico (opcional) | Number | `123456789012` | Firebase Console | Sin Firebase cliente |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | PÚBLICA | Build-time | Estático/Dinámico (opcional) | String | `1:1234:web:abcd` | Firebase Console | Sin Firebase cliente |
| `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` | PÚBLICA | Build-time | Estático/Dinámico (opcional) | String | `G-XXXXXXXXXX` | Firebase Console | Sin Google Analytics |

---

## Contradicciones detectadas

| # | Contradicción | Estado |
|---|---|---|
| 1 | `docs/FIREBASE_SETUP.md` usa `FIREBASE_ADMIN_CLIENT_EMAIL` y `FIREBASE_ADMIN_PRIVATE_KEY`; el código lee `FIREBASE_CLIENT_EMAIL` y `FIREBASE_PRIVATE_KEY` | `VERIFICADO` — corregir en Fase 1 |
| 2 | `FIREBASE_SYNC_ENABLED` y `FIREBASE_SERVICE_ACCOUNT_JSON` se leen en código pero no están en `.env.example` | `VERIFICADO` — añadir a `.env.example` |
| 3 | `.env.example` tiene `NEXTAUTH_SECRET=""` (string vacío) | `VERIFICADO` — documentar que es obligatorio generar |
| 4 | `.env.example` tiene `NEXTAUTH_URL="http://localhost:3000"` | `VERIFICADO` — documentar que debe cambiarse en producción |
| 5 | No hay aserción de que `FIREBASE_PROJECT_ID === NEXT_PUBLIC_FIREBASE_PROJECT_ID` | `VERIFICADO` — añadir aserción en `firebase/admin.ts` |

---

## Validación automática

La prueba `tests/adversarial/test_env_matrix.py` (nueva en Fase 1) verifica:

1. Toda variable leída en código está documentada en `.env.example` o en esta matriz.
2. Toda variable en `.env.example` es leída por el código.
3. Ninguna variable con prefijo `NEXT_PUBLIC_` contiene un valor que parezca un secreto (claves privadas, tokens largos).
4. `NEXTAUTH_URL` en `.env.example` no es `localhost` (es un ejemplo, pero debe marcarse como desarrollo).
5. Ningún `.env` real (no `.example`) se commitea a Git.
