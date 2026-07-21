# Firebase Spark (Firestore) dual-write

PyArcana keeps **SQLite + Prisma** as the primary runtime database (auth, exams, local dev).  
When you configure a **Firebase Spark** (free) project, the API **also mirrors** user-generated data to **Cloud Firestore**.

## What is synced

| Collection            | Source API                                      | Notes                                      |
|-----------------------|-------------------------------------------------|--------------------------------------------|
| `users`               | `POST /api/auth/register`                       | **No** password hashes                     |
| `progress`            | `POST/PATCH /api/progress`                      | Doc id: `userId__sectionId__subStep`     |
| `examAttempts`        | `POST /api/exam/start`, `POST /api/exam/submit` | Full attempt + score                       |
| `exerciseAttempts`    | `POST /api/exercise/attempt`                    | Hint + correct flags                       |
| `feedbackReports`     | `POST/PATCH /api/feedback`                      | Bugs, ideas, recommendations               |

Reads still use Prisma. Firestore is a **durable cloud mirror** for ops, analytics, and Spark-tier backup.

## Setup (Spark free tier)

1. Create a project at [Firebase Console](https://console.firebase.google.com/).
2. Enable **Cloud Firestore** (production or test mode; lock rules for production).
3. Project settings → **Service accounts** → Generate new private key (JSON).
4. Add to `.env` (never commit):

```bash
# Option A — discrete fields
FIREBASE_SYNC_ENABLED=true
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIE...\n-----END PRIVATE KEY-----\n"

# Option B — full JSON on one line
# FIREBASE_SERVICE_ACCOUNT_JSON={"type":"service_account","project_id":"...",...}
```

5. Restart `npm run dev`. Writes should appear in Firestore console under the collections above.

Without credentials, the app **no-ops** the Firebase layer (local SQLite only).

## Security notes

- Service account JSON is **server-only** (Next.js API routes / Node). Never expose it to the browser.
- Firestore security rules should deny public client access if you only use Admin SDK.
- Do not store `passwordHash` in Firestore (sync helpers omit it).

## Spark quotas (approx.)

Firestore free tier has daily read/write/storage limits. Dual-write volume is modest for a course LMS (progress + exams + feedback). Monitor the Firebase console if traffic grows.

## Verify

```bash
# With env configured:
curl -X POST http://localhost:3000/api/feedback \
  -H 'Content-Type: application/json' \
  -d '{"type":"IDEA","title":"Firebase mirror test","body":"This should land in feedbackReports.","email":"you@example.com"}'
```

Then open Firestore → `feedbackReports` and confirm the document id matches the API response.
