/**
 * Firebase client configuration, read from NEXT_PUBLIC_FIREBASE_* without importing the Firebase
 * SDK. Code that only asks "is Firebase configured?" (the static site's notice) imports this
 * module, so the static build never pulls the SDK in (decision D18). client.ts re-exports both
 * functions, so its API is unchanged.
 */

export interface FirebaseClientConfig {
  apiKey: string
  authDomain: string
  projectId: string
  storageBucket?: string
  messagingSenderId?: string
  appId: string
  measurementId?: string
}

/**
 * Reads NEXT_PUBLIC_FIREBASE_* environment variables. Returns null when the
 * minimum set (apiKey, authDomain, projectId, appId) is not present, so
 * callers can short-circuit gracefully.
 */
export function readFirebaseConfig(): FirebaseClientConfig | null {
  if (typeof process === 'undefined') return null
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY
  const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
  const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID
  if (!apiKey || !authDomain || !projectId || !appId) return null
  return {
    apiKey,
    authDomain,
    projectId,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || undefined,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || undefined,
    appId,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || undefined,
  }
}

/** True when env has enough Firebase client config to start. */
export function isFirebaseClientConfigured(): boolean {
  return readFirebaseConfig() !== null
}
