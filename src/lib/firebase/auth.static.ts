/**
 * The static builds' stand-in for 'firebase/auth' (D16): next.config.ts aliases the package to this
 * file only when NEXT_PUBLIC_STATIC_SITE is '1'. AuthModal is the only static-reachable importer, and
 * it calls these only after getFirebaseAuth() returned an instance, which the static stand-in
 * (client.static.ts) never does. So none of them runs; each throws if that ever changed, instead of
 * failing silently.
 */
function unavailable(): never {
  throw new Error('Firebase Auth is not part of the static build (src/lib/firebase/auth.static.ts)')
}

export const onAuthStateChanged = unavailable
export const signOut = unavailable
export const signInWithEmailAndPassword = unavailable
export const createUserWithEmailAndPassword = unavailable
export const updateProfile = unavailable
export const sendEmailVerification = unavailable
export const sendPasswordResetEmail = unavailable
export type User = { uid: string; email: string | null; displayName: string | null; emailVerified: boolean }
