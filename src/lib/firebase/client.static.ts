/**
 * The static builds' stand-in for client.ts (D16, owner request 5 Oct 2026). next.config.ts aliases
 * '@/lib/firebase/client' to this file only when NEXT_PUBLIC_STATIC_SITE is '1' (GitHub Pages and
 * pyarcana.dev), so about 280 KB of Firebase stops shipping to the home page.
 *
 * Behaviour is identical: no static build sets NEXT_PUBLIC_FIREBASE_*, so client.ts already answered
 * "not configured" (null) everywhere, and the site's CSP refuses the Firebase hosts. Every caller
 * (AuthModal, UserMenu, StaticSiteNoticeText) takes its existing "not configured" branch. The server
 * edition and the tests still use client.ts. The `satisfies` below fails the type check if client.ts
 * gains or changes an export without this file following.
 */
import type * as Real from './client'

export type FirebaseClientConfig = Real.FirebaseClientConfig

export function readFirebaseConfig(): FirebaseClientConfig | null {
  return null
}

export function isFirebaseClientConfigured(): boolean {
  return false
}

export function getFirebaseApp(): ReturnType<typeof Real.getFirebaseApp> {
  return null
}

export function getFirebaseAuth(): ReturnType<typeof Real.getFirebaseAuth> {
  return null
}

export function getFirebaseDb(): ReturnType<typeof Real.getFirebaseDb> {
  return null
}

function unavailable(): never {
  throw new Error('Firebase is not part of the static build (src/lib/firebase/client.static.ts)')
}

export const getApps: typeof Real.getApps = () => []
export const initializeApp = unavailable as unknown as typeof Real.initializeApp

const exportsCheck = {
  readFirebaseConfig,
  isFirebaseClientConfigured,
  getFirebaseApp,
  getFirebaseAuth,
  getFirebaseDb,
  getApps,
  initializeApp,
} satisfies { [K in keyof typeof Real]: (typeof Real)[K] }
void exportsCheck
