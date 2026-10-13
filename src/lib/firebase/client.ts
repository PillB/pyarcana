/**
 * Firebase client SDK — initialisation for Auth + Firestore.
 *
 * Used by the static edition (GitHub Pages) and by the dynamic edition whenever
 * we want to talk to Firebase directly from the browser (sign-in, profile
 * reads, badge verification). The Admin SDK remains the source of truth on the
 * server; this client is the public-facing mirror.
 *
 * Configuration is read from NEXT_PUBLIC_FIREBASE_* env vars. When they are
 * absent (e.g. a fresh checkout, or a build that has not been wired to a
 * Firebase project yet), the helpers return `null` instead of throwing, so the
 * rest of the app can degrade gracefully and show a "Firebase not configured"
 * notice instead of crashing on import.
 *
 * Why this is safe on a static site:
 *   Firebase Auth is a client-side SDK. The static export runs entirely in the
 *   browser, so sign-in, sign-out and password reset still work without a
 *   backend. Firestore reads/writes are gated by `firestore.rules` and the
 *   owner-scoped rules below — they do not need a server endpoint.
 */

import { getApp, getApps, initializeApp, type FirebaseApp } from 'firebase/app'
import {
  getAuth,
  type Auth,
  setPersistence,
  browserLocalPersistence,
  indexedDBLocalPersistence,
} from 'firebase/auth'
import {
  getFirestore,
  type Firestore,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from 'firebase/firestore'
import { isFirebaseClientConfigured, readFirebaseConfig, type FirebaseClientConfig } from './config'

export { isFirebaseClientConfigured, readFirebaseConfig, type FirebaseClientConfig }

let cachedApp: FirebaseApp | null = null
let cachedAuth: Auth | null = null
let cachedDb: Firestore | null = null
let initTried = false

/**
 * Initialises the Firebase client app (idempotent). Returns the app, or null
 * if env is not configured. Safe to call from any client component.
 */
export function getFirebaseApp(): FirebaseApp | null {
  if (initTried) return cachedApp
  initTried = true

  const config = readFirebaseConfig()
  if (!config) return null

  try {
    cachedApp = getApps().length > 0 ? getApp() : initializeApp(config)
    return cachedApp
  } catch (err) {
    console.error('[firebase/client] init failed', err)
    cachedApp = null
    return null
  }
}

/**
 * Returns the Firebase Auth instance, or null when not configured. Persistence
 * defaults to local (so the user stays signed in across reloads) and falls back
 * to IndexedDB when available — important for the static edition, where there
 * is no server session to restore.
 */
export function getFirebaseAuth(): Auth | null {
  if (cachedAuth) return cachedAuth
  const app = getFirebaseApp()
  if (!app) return null
  try {
    cachedAuth = getAuth(app)
    // Persistence is best-effort. It rejects in private windows / SSR; ignore.
    if (typeof window !== 'undefined') {
      const persistence =
        'indexedDB' in window ? indexedDBLocalPersistence : browserLocalPersistence
      setPersistence(cachedAuth, persistence).catch(() => {
        /* ignore — Firebase will fall back to in-memory */
      })
    }
    return cachedAuth
  } catch (err) {
    console.error('[firebase/client] auth init failed', err)
    cachedAuth = null
    return null
  }
}

/**
 * Returns the Firestore instance, with persistent offline cache enabled when
 * the browser supports it. Offline cache lets the static edition keep working
 * between page reloads even when the network is flaky.
 */
export function getFirebaseDb(): Firestore | null {
  if (cachedDb) return cachedDb
  const app = getFirebaseApp()
  if (!app) return null
  try {
    if (typeof window !== 'undefined') {
      try {
        cachedDb = initializeFirestore(app, {
          localCache: persistentLocalCache({
            tabManager: persistentMultipleTabManager(),
          }),
        })
      } catch {
        cachedDb = getFirestore(app)
      }
    } else {
      cachedDb = getFirestore(app)
    }
    return cachedDb
  } catch (err) {
    console.error('[firebase/client] firestore init failed', err)
    cachedDb = null
    return null
  }
}

export { getApps, initializeApp }
