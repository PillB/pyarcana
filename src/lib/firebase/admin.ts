/**
 * Firebase Admin (Spark / free-tier Firestore) for server-side dual-write.
 *
 * Enable by setting env (see docs/FIREBASE.md):
 *   FIREBASE_SYNC_ENABLED=true
 *   FIREBASE_PROJECT_ID=...
 *   FIREBASE_CLIENT_EMAIL=...
 *   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
 * Or a single JSON:
 *   FIREBASE_SERVICE_ACCOUNT_JSON={"type":"service_account",...}
 *
 * When not configured, all helpers no-op so local SQLite/Prisma keeps working.
 */

import { getApps, initializeApp, cert, type App } from 'firebase-admin/app'
import { getFirestore, type Firestore } from 'firebase-admin/firestore'

let app: App | null = null
let db: Firestore | null = null
let initTried = false

function parseServiceAccount():
  | { projectId: string; clientEmail: string; privateKey: string }
  | null {
  const jsonRaw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON
  if (jsonRaw?.trim()) {
    try {
      const j = JSON.parse(jsonRaw) as {
        project_id?: string
        client_email?: string
        private_key?: string
      }
      if (j.project_id && j.client_email && j.private_key) {
        return {
          projectId: j.project_id,
          clientEmail: j.client_email,
          privateKey: j.private_key.replace(/\\n/g, '\n'),
        }
      }
    } catch (e) {
      console.error('[firebase] invalid FIREBASE_SERVICE_ACCOUNT_JSON', e)
      return null
    }
  }

  const projectId = process.env.FIREBASE_PROJECT_ID
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
  let privateKey = process.env.FIREBASE_PRIVATE_KEY
  if (!projectId || !clientEmail || !privateKey) return null
  privateKey = privateKey.replace(/\\n/g, '\n')
  return { projectId, clientEmail, privateKey }
}

/** True when env asks for sync and credentials are present. */
export function isFirebaseSyncEnabled(): boolean {
  if (process.env.FIREBASE_SYNC_ENABLED === 'false') return false
  if (process.env.FIREBASE_SYNC_ENABLED === 'true') return !!parseServiceAccount()
  // Auto-enable when full credentials exist (Spark project wired)
  return !!parseServiceAccount()
}

export function getFirebaseApp(): App | null {
  if (initTried) return app
  initTried = true

  if (!isFirebaseSyncEnabled()) {
    return null
  }

  const sa = parseServiceAccount()
  if (!sa) return null

  try {
    if (getApps().length > 0) {
      app = getApps()[0]!
    } else {
      app = initializeApp({
        credential: cert({
          projectId: sa.projectId,
          clientEmail: sa.clientEmail,
          privateKey: sa.privateKey,
        }),
        projectId: sa.projectId,
      })
    }
    return app
  } catch (e) {
    console.error('[firebase] init failed', e)
    app = null
    return null
  }
}

export function getFirestoreDb(): Firestore | null {
  if (db) return db
  const a = getFirebaseApp()
  if (!a) return null
  try {
    db = getFirestore(a)
    return db
  } catch (e) {
    console.error('[firebase] firestore failed', e)
    return null
  }
}
