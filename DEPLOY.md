# Guía de Deploy — Python DS Perú

Esta guía cubre cómo deployar la plataforma completa (curso + LMS con backend) a diferentes proveedores cloud.

## 🎯 Opciones de deploy

| Proveedor | Tipo | Gratuito | LMS funciona | Dificultad |
|-----------|------|----------|--------------|------------|
| **Vercel** | Serverless (Next.js nativo) | Sí (hobby) | ✅ Completo | ⭐ Fácil |
| **Netlify** | Static + Functions | Sí | ⚠️ Parcial | ⭐⭐ Media |
| **Railway** | Container (full backend) | Trial $5 | ✅ Completo | ⭐⭐ Media |
| **GitHub Pages** | Static only | Sí | ❌ Solo contenido | ⭐ Fácil |

**Recomendación**: Vercel para la mayoría de casos. Es el nativo de Next.js, deploy en 2 clicks, SSL gratis, edge functions.

---

## 🚀 Opción 1: Vercel (recomendado)

### Paso a paso

1. **Fork el repo** a tu cuenta de GitHub

2. **Ve a [vercel.com](https://vercel.com)** y sign in con GitHub

3. **New Project → Import** tu repo fork

4. **Configurar environment variables** (en Vercel dashboard → Settings → Environment Variables):
   ```
   DATABASE_URL=file:./db/custom.db     # SQLite para dev (ver nota abajo)
   NEXTAUTH_SECRET=<genera-con-openssl-rand-base64-32>
   NEXTAUTH_URL=https://tu-app.vercel.app
   ```
   
   Para producción real, usa PostgreSQL (ver sección "Migrar a PostgreSQL" abajo).

5. **Deploy** — Vercel detecta Next.js automáticamente. Build command: `bun run build` (o `npm run build`).

6. **Inicializar base de datos** después del primer deploy:
   ```bash
   # Instalar Vercel CLI
   npm i -g vercel
   
   # Login y link
   vercel login
   vercel link
   
   # Ejecutar seed (crea cuentas demo + 132 preguntas)
   vercel env pull .env
   bun run db:push
   bun run db:seed
   ```

### Migrar a PostgreSQL (recomendado para producción)

SQLite no persiste en serverless. Para producción, usa PostgreSQL:

1. **Crear DB en Vercel Postgres** (gratis en hobby plan):
   - Vercel dashboard → Storage → Create → Postgres
   - Copia la `DATABASE_URL`

2. **Actualizar `prisma/schema.prisma`**:
   ```prisma
   datasource db {
     provider = "postgresql"  // cambiar de "sqlite"
     url      = env("DATABASE_URL")
   }
   ```

3. **Migrar Json fields**: SQLite guarda Json como TEXT. PostgreSQL tiene tipo nativo. Prisma maneja la diferencia automáticamente, pero debes recreate la DB:
   ```bash
   bun run db:push --force-reset
   bun run db:seed
   ```

4. **Setear `DATABASE_URL`** en Vercel con la URL de Postgres.

### Configurar OAuth (opcional)

1. **Google OAuth**:
   - [Google Cloud Console](https://console.cloud.google.com/) → New Project
   - APIs & Services → Credentials → Create Credentials → OAuth client ID
   - Application type: Web application
   - Authorized redirect URIs: `https://tu-app.vercel.app/api/auth/callback/google`
   - Copia Client ID y Client Secret a Vercel env vars

2. **Microsoft (Azure AD)**:
   - [Azure Portal](https://portal.azure.com/) → Azure Active Directory → App registrations
   - New registration → Redirect URI: `https://tu-app.vercel.app/api/auth/callback/azure-ad`
   - Certificates & secrets → New client secret
   - Copia Client ID, Client Secret, Tenant ID a Vercel env vars

3. **Descomentar providers** en `src/lib/auth.ts`:
   ```typescript
   import GoogleProvider from 'next-auth/providers/google'
   import AzureADProvider from 'next-auth/providers/azure-ad'
   // ... y descomenta los bloques if (...) en buildProviders()
   ```

4. **Redeploy** — los botones OAuth ahora funcionarán realmente.

---

## 🚂 Opción 2: Railway

Railway es mejor si necesitas un backend persistente (no serverless).

1. **Fork el repo** en GitHub

2. **[railway.app](https://railway.app)** → New Project → Deploy from GitHub repo

3. **Add PostgreSQL database**: Railway dashboard → New → Database → PostgreSQL
   - Railway te da la `DATABASE_URL` automáticamente

4. **Setear variables** en Railway:
   ```
   DATABASE_URL=<railway-te-la-da>
   NEXTAUTH_SECRET=<openssl-rand-base64-32>
   NEXTAUTH_URL=<tu-dominio-de-railway>
   ```

5. **Update `prisma/schema.prisma`** a `provider = "postgresql"`

6. **Deploy** — Railway detecta Next.js. Build: `bun run build`

7. **Seed**: Railway dashboard → your service → Shell → `bun run db:push && bun run db:seed`

---

## 📄 Opción 3: GitHub Pages (solo contenido estático)

**Importante**: GitHub Pages NO soporta el LMS (auth, exámenes, admin dashboard) porque requiere backend. Solo sirve el contenido del curso.

1. **Fork el repo**

2. **Settings → Pages → Source → GitHub Actions**

3. **El workflow `.github/workflows/deploy.yml`** se ejecuta en cada push a `main`

4. **Tu sitio estará en**: `https://TU_USUARIO.github.io/python-ds-peru/`

### Limitaciones de GitHub Pages
- ❌ No auth (login/registro no funciona)
- ❌ No exámenes con tracking (solo quiz simple sin guardar)
- ❌ No admin dashboard
- ✅ Sí: todo el contenido del curso, teoría, I Do/We Do/You Do, recursos
- ✅ Sí: progreso en localStorage (se pierde si limpias browser)
- ✅ Sí: editor interactivo con Pyodide (corre en browser)

---

## 🔧 Comandos útiles

```bash
# Desarrollo local
bun install
bun run db:push      # crea/atualiza tablas
bun run db:seed      # carga 132 preguntas + 2 cuentas demo
bun run dev          # servidor de desarrollo en :3000
bun run lint         # verificar código

# Producción (build local)
bun run build        # build de producción
bun run start        # servir build de producción

# DB
bun run db:generate  # regenerar Prisma client después de cambios en schema
bun run db:migrate   # crear migración (PostgreSQL)
bun run db:reset     # reset completo (¡borra todo!)

# Seed (crear cuentas demo)
bun run db:seed
# Crea: admin@python-ds.pe / admin123
# Crea: demo@python-ds.pe / demo1234
```

---

## 🔒 Seguridad en producción

### Checklist antes de deploy

- [ ] `NEXTAUTH_SECRET` generado con `openssl rand -base64 32` (NO el default del código)
- [ ] `NEXTAUTH_URL` apunta al dominio correcto (con HTTPS)
- [ ] `DATABASE_URL` apunta a PostgreSQL (no SQLite en serverless)
- [ ] `.env` está en `.gitignore` (verificado)
- [ ] OAuth secrets (si usas OAuth) en env vars del proveedor, no en código
- [ ] Rate limiting activo (ya incluido en `/api/auth/register`)
- [ ] HTTPS forzado (Vercel/Railway lo hacen automáticamente)

### After deploy

1. **Crea tu cuenta admin**: registra el primer usuario → automáticamente rol ADMIN
2. **Verifica el seed**: login con admin@python-ds.pe → admin dashboard → deberías ver usuarios
3. **Test OAuth** (si configuraste): botón Google/Microsoft debe redirigir correctamente
4. **Test exámenes**: rinde un examen, verifica que se guarda el intento

---

## 🆘 Troubleshooting

### "Prisma Client no generado"
```bash
bun run db:generate
```

### "Database connection error" en Vercel serverless
- SQLite no funciona en serverless. Migrar a PostgreSQL.
- Ver `Migrar a PostgreSQL` arriba.

### "NEXTAUTH_SECRET inválido"
- Debe ser mínimo 32 caracteres
- Generar con: `openssl rand -base64 32`

### "OAuth callback mismatch"
- Verifica que `NEXTAUTH_URL` en env vars coincida exactamente con el dominio
- Verifica redirect URIs configuradas en Google/Azure console

### "403 en /api/admin/*"
- Necesitas rol ADMIN. El primer usuario registrado lo obtiene automáticamente.
- O: `bun run db:seed` crea `admin@python-ds.pe` con rol ADMIN.

### Pyodide no carga en producción
- Verifica que CSP permite `cdn.jsdelivr.net`
- El editor interactivo es opcional — el resto del curso funciona sin él
