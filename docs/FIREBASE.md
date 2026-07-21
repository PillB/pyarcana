# Firebase Spark (Firestore) dual-write

PyArcana keeps **SQLite + Prisma** as the primary runtime database.  
User-generated data is **mirrored** to **Cloud Firestore** when Firebase Admin credentials are configured.

## Active project (MCP setup)

| Item | Value |
|------|--------|
| Firebase project | `coderhouse-react-8063a` (alias `default`) |
| Display name | Coderhouse-React |
| Firestore DB | `(default)` — **FIRESTORE_NATIVE**, location `nam5`, free tier |
| Authenticated CLI user | `pillescasdies@gmail.com` |

Also created (empty, **billing required** for Firestore): project `pyarcana`. Switch later with:

```bash
firebase use pyarcana
# after linking a billing account in Google Cloud
firebase firestore:databases:create "(default)" --location=nam5
```

## Collections (“tables”)

| Collection | Document ID | Fields (main) |
|------------|-------------|----------------|
| `users` | user cuid | email, name, role, country, createdAt, updatedAt (**no passwordHash**) |
| `progress` | `{userId}__{sectionId}__{subStep}` | completed, completedAt, bookmarked |
| `examAttempts` | attempt cuid | sectionId, attemptNumber, score, answers, times |
| `exerciseAttempts` | attempt cuid | exerciseId, usedHint, correct |
| `feedbackReports` | report cuid | type, status, title, body, email, adminNote |
| `_schema` | `pyarcana_v1` | meta description of schema |

Seed docs (`_seed: true`) were written via Firebase MCP so collections show in the console.

**Note:** This project also has legacy collections `items` and `orders` (Coderhouse). Do **not** deploy closed client rules that would break them without coordinating.

## App dual-write env

Add to **local** `.env` (never commit). Create a service account key:

Console → Project settings → Service accounts → Generate new private key  
for project **coderhouse-react-8063a**.

```bash
FIREBASE_SYNC_ENABLED=true
FIREBASE_PROJECT_ID=coderhouse-react-8063a
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@coderhouse-react-8063a.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

Restart `npm run dev`, then:

```bash
curl -s http://localhost:3000/api/firebase/status
# expect: syncEnabled true, firestoreReady true

curl -s -X POST http://localhost:3000/api/feedback \
  -H 'Content-Type: application/json' \
  -d '{"type":"IDEA","title":"Live dual-write test","body":"Should appear in feedbackReports collection.","email":"you@example.com"}'
```

Confirm in Firestore console or MCP `firestore_list_documents`.

## MCP (Grok)

Configured in `~/.grok/config.toml`:

```toml
[mcp_servers.firebase]
command = "firebase"
args = ["mcp", "--dir", "/Users/pabloillescas/Projects/PyArcana", "--only", "core,firestore"]
```

Useful tools: `firebase_login`, `firestore_list_collections`, `firestore_add_document`, `firestore_query_collection`, `firestore_create_index`.

## Security

- Server dual-write uses **Admin SDK** (bypasses security rules).
- Never store `passwordHash` in Firestore.
- Prefer not changing production client rules on shared projects without review.
