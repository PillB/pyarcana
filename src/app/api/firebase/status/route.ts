import { NextResponse } from 'next/server'
import { isFirebaseSyncEnabled, getFirestoreDb } from '@/lib/firebase/admin'

/**
 * Lightweight status for ops: is Firebase Spark dual-write configured?
 * Does not expose secrets. GET only.
 */
export async function GET() {
  const enabled = isFirebaseSyncEnabled()
  let firestoreReady = false
  if (enabled) {
    firestoreReady = !!getFirestoreDb()
  }
  return NextResponse.json({
    syncEnabled: enabled,
    firestoreReady,
    projectId: enabled ? process.env.FIREBASE_PROJECT_ID || '(from service account JSON)' : null,
    collections: [
      'users',
      'progress',
      'examAttempts',
      'exerciseAttempts',
      'feedbackReports',
    ],
  })
}
