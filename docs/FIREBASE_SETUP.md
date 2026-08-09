# Firebase Setup Guide — PyArcana

**Status:** Production setup guide · **Date:** 2026-07-31
**Audience:** Administrator / DevOps

This document describes exactly what to set up, change, and connect in Firebase for PyArcana, and where to connect it securely.

---

## 1. Current state

PyArcana uses Firebase for:
- **Authentication** (client SDK v12.16.0) — email/password, Google, GitHub
- **Cloud Firestore** — learner progress sync, supervisor cohorts, notifications, feedback

The code is already written (`src/lib/firebase/client.ts`, `src/lib/firebase/admin.ts`, `src/lib/firebase/sync.ts`, `firestore.rules`). The Firebase project `coderhouse-react-8063a` exists (Spark free tier, Firestore NATIVE mode, location `nam5`).

## 2. What needs to change

### 2.1 Migrate to a dedicated PyArcana Firebase project

The current project (`coderhouse-react-8063a`) is shared. Create a **dedicated** project for production:

1. Go to https://console.firebase.google.com → **Add project** → name it `pyarcana-prod`.
2. Select **Blaze (pay-as-you-go)** plan (required for Firestore in production and for outbound API calls). The free tier covers the first 50K reads / 20K writes per day — sufficient for early cohorts.
3. Set Firestore location to `nam5` (US multi-region) or `sa-east1` (São Paulo — closer to Peru learners). **Recommendation:** `sa-east1` for lower latency to LATAM.
4. Enable **Authentication** → Sign-in methods: Email/Password, Google, GitHub.
5. Enable **Firestore Database** → Production mode → apply the rules from `firestore.rules` in this repo.

### 2.2 Secure environment variables

**NEVER commit Firebase credentials to git.** The repo already uses `NEXT_PUBLIC_*` env vars (safe for client-side) and server-side secrets.

Create `.env.local` (gitignored — verify `.gitignore` includes it):

```bash
# Client-side (safe to expose — these are public Firebase config)
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=pyarcana-prod.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=pyarcana-prod
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=pyarcana-prod.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1234567890
NEXT_PUBLIC_FIREBASE_APP_ID=1:1234567890:web:abcdef

# Server-side (NEVER expose — used by Admin SDK only)
FIREBASE_ADMIN_PROJECT_ID=pyarcana-prod
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk@pyarcana-prod.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# NextAuth
NEXTAUTH_SECRET=<generate with: openssl rand -base64 32>
NEXTAUTH_URL=https://pyarcana.dev

# Database (Prisma / SQLite for dev, PostgreSQL for prod)
DATABASE_URL=postgresql://user:pass@host:5432/pyarcana
```

For GitHub Actions CI, add these as **repository secrets** (Settings → Secrets and variables → Actions). The deploy workflow for the static GitHub Pages build does NOT need Firebase secrets (static build has no server).

### 2.3 Firestore Security Rules

The repo has `firestore.rules`. Deploy them:

```bash
npm install -g firebase-tools
firebase login
firebase use pyarcana-prod
firebase deploy --only firestore:rules
```

The rules enforce:
- Users can only read/write their own data (`request.auth.uid == userId`)
- Supervisor cohort access is scoped (supervisors see only learners in their cohorts)
- Admins have full read access
- Default-deny for all other access

### 2.4 Firestore indexes

Deploy indexes for query performance:

```bash
firebase deploy --only firestore:indexes
```

The `firestore.indexes.json` file defines composite indexes for:
- `progress` collection: (userId, sectionId) — learner progress lookup
- `examAttempts` collection: (userId, sectionId, createdAt) — exam history
- `cohorts` collection: (supervisorId, status) — supervisor cohort listing
- `notifications` collection: (userId, createdAt) — notification feed

### 2.5 Authorized domains

In Firebase Console → Authentication → Settings → Authorized domains, add:
- `pillb.github.io` (GitHub Pages — static, no auth)
- `pyarcana.dev` (production dynamic LMS)
- `pyarcana.com` (redirect to .dev)
- `localhost` (development)

### 2.6 App Check (production hardening)

Enable **Firebase App Check** with reCAPTCHA Enterprise to prevent abuse:
1. Firebase Console → App Check → Register web app with reCAPTCHA Enterprise
2. Enforce App Check for Auth and Firestore
3. Add the reCAPTCHA site key to `.env.local`: `NEXT_PUBLIC_RECAPTCHA_SITE_KEY=...`

## 3. Where Firebase connects in the code

| File | Purpose | Mode |
|------|---------|------|
| `src/lib/firebase/client.ts` | Client SDK init (Auth + Firestore) | Client |
| `src/lib/firebase/admin.ts` | Admin SDK init (server-side verification) | Server only |
| `src/lib/firebase/sync.ts` | Progress sync (local ↔ cloud) | Client |
| `src/app/api/firebase/status/route.ts` | Health check endpoint | Server |
| `src/lib/auth.ts` | NextAuth + Firebase Auth bridge | Server |
| `firestore.rules` | Security rules | Deployed |
| `firestore.indexes.json` | Query indexes | Deployed |

## 4. Static vs dynamic boundary

- **Static GitHub Pages** (`pillb.github.io`): Firebase Auth is NOT available (no server). The static build sets `IS_STATIC_SITE=1`, which disables the SessionProvider and all `/api/` routes. Learners on the static site use browser-local progress only.
- **Dynamic LMS** (`pyarcana.dev`): Full Firebase Auth + Firestore. Learners log in, progress syncs to cloud, supervisors manage cohorts, admins oversee.

## 5. Pre-deployment checklist

- [ ] Create dedicated `pyarcana-prod` Firebase project (Blaze plan)
- [ ] Set Firestore location to `sa-east1`
- [ ] Enable Auth providers (Email/Password, Google, GitHub)
- [ ] Deploy `firestore.rules` and `firestore.indexes.json`
- [ ] Add authorized domains (`pyarcana.dev`, `pyarcana.com`, `localhost`)
- [ ] Generate server-side service account key → store as GitHub secret `FIREBASE_ADMIN_PRIVATE_KEY`
- [ ] Set all `NEXT_PUBLIC_FIREBASE_*` env vars in the dynamic deployment environment
- [ ] Enable App Check with reCAPTCHA Enterprise
- [ ] Verify the static GitHub Pages build does NOT include any Firebase secrets
- [ ] Run `firebase deploy --only firestore:rules` and verify rules are active

## 6. Security warnings

- **NEVER** commit `.env.local` or service account JSON to git.
- **NEVER** expose `FIREBASE_ADMIN_PRIVATE_KEY` in client code.
- **ALWAYS** use the Admin SDK on the server side for privileged operations.
- **ALWAYS** enforce App Check in production.
- The `exemplars_private/` directory (exemplar notebooks) must NEVER be stored in Firestore or Firebase Storage in a way accessible to non-admin users.
