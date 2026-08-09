# PyArcana deployment guide

PyArcana has two explicit products: a content-only GitHub Pages edition and a dynamic Node.js LMS. Choose the mode before configuring infrastructure; the public static site must not be presented as if accounts or server persistence exist.

## GitHub Pages (public content edition)

The repository workflow `.github/workflows/deploy.yml` builds and deploys `out/` on every push to `main`.

1. In GitHub, open **Settings → Pages**.
2. Select **GitHub Actions** as the source.
3. Run the **Deploy to GitHub Pages** workflow or push a validated commit to `main`.
4. Verify <https://pillb.github.io/pyarcana/>.

The workflow runs:

```bash
bun install --frozen-lockfile
NEXT_PUBLIC_BASE_PATH=/pyarcana bun run build:static
```

The export is built in a disposable temporary copy. The tracked API directory and `next.config.ts` are not moved or rewritten. In this mode:

- lesson content, local autochecks, bookmarks, and browser-local progress work;
- login, registration, payments, private feedback, server exams, and admin controls are not rendered;
- the local `/pyarcana/logo.svg` is used for branding and favicon assets;
- generated assets use the `/pyarcana` base path.

## Dynamic LMS (Node host)

The dynamic build requires a host that can run the Next.js standalone server and reach a persistent database. The repository currently uses Prisma with SQLite for local and single-node development. Before a horizontally scaled or serverless production deployment, add and test a proper migration to a managed database; changing the Prisma provider without a reviewed migration is not a deploy step.

### Required environment

Copy `.env.example` locally and set real values through the deployment provider's secret manager:

```dotenv
DATABASE_URL="file:./db/custom.db"
NEXTAUTH_URL="https://your-reviewed-domain.example"
NEXTAUTH_SECRET="a-unique-high-entropy-value"
```

Generate the auth secret outside the repository:

```bash
openssl rand -base64 32
```

Optional Firebase profile mirroring variables are documented in `.env.example`. Leave the complete set unset when mirroring is not used.

### Build and start

```bash
bun install --frozen-lockfile
bun run db:generate
bun run db:push
bun run build
bun run start
```

Run migrations or `db:push` as a controlled release operation for the selected database. Do not reset a production database.

### Administrator provisioning

Public registration always creates a `STUDENT`; the first registrant is not trusted as an administrator. After verifying the operator's identity, grant the role through controlled database administration (for example, Prisma Studio on a protected maintenance connection), record the change, and revoke maintenance access.

The seed contains course question data only. It must not create shared demo users, default administrators, or hard-coded passwords.

## Release gates

Before either deployment:

```bash
bun run lint
npx tsc --noEmit
bun run test:unit
bun run test:v3
bun run test:course-complete
bun run test:ux-gates
```

Before a static release, also run:

```bash
NEXT_PUBLIC_BASE_PATH=/pyarcana bun run build:static
python3 tests/adversarial/test_static_export_guard.py
```

Before a dynamic release, use non-production test resources and run:

```bash
bun run db:generate
bun run build
```

## Post-deploy verification

### Public edition

- `/pyarcana/` and a section hash such as `/pyarcana/#s01` load directly.
- CSS, JavaScript, fonts, logo, and workbook assets use `/pyarcana/` paths.
- The landing page identifies the public/local-progress limitation.
- There are no login, registration, pricing, private-feedback, or admin controls.
- Progress survives reload in the same browser and is not described as cloud-synced.

### Dynamic LMS

- Missing or invalid auth secrets fail closed; no default secret is accepted.
- Registration rejects oversized or malformed bodies and always returns `STUDENT`.
- Login, server progress, exams, and operator-approved admin access work over HTTPS.
- Logs and error responses contain no passwords, hashes, tokens, or private profile fields.
- Rate limiting is enforced at the shared ingress when more than one app instance exists.

## Rollback

GitHub Pages deployments can be rolled back by redeploying the last validated commit. For the dynamic LMS, keep application rollback separate from database migration rollback; document a reversible migration before changing production data. Never use a destructive database reset as a rollback procedure.
