'use client'

import { useSession } from 'next-auth/react'
import { useCloudStage } from '@/lib/cloud/hooks'
import { useCloudSession } from '@/lib/cloud/session'
import { signedInFrom } from '@/lib/cloud/ui-state'

/**
 * Signed in through NextAuth (dynamic LMS) or the cloud account (static site). False during
 * prerendering and hydration, because the cloud stage reads 'off' until the page has mounted.
 */
export function useIsSignedIn(): boolean {
  const { data: session } = useSession()
  const stage = useCloudStage()
  const cloudAccountId = useCloudSession((s) => s.me?.account.id ?? null)
  return signedInFrom({ nextAuthUser: session?.user, stage, cloudAccountId })
}
