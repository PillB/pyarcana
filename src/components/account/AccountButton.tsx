'use client'

import { UserRound } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCloudStage } from '@/lib/cloud/hooks'
import { useCloudSession } from '@/lib/cloud/session'
import { useAccountUi } from './runtime'
import { useText } from './text'

/**
 * The account entry in both headers. Renders nothing while prerendering and hydrating (the stage
 * reads 'off' until mount) and nothing at all where accounts do not run (stage off: the default
 * config, github.io, the dynamic LMS).
 */
export function AccountButton() {
  const stage = useCloudStage()
  const signedIn = useCloudSession((s) => s.me !== null)
  const show = useAccountUi((s) => s.show)
  const { tr } = useText()
  if (stage === 'off') return null
  const label = signedIn ? tr('account.button.account') : tr('account.button.signIn')
  return (
    <Button
      variant={signedIn ? 'ghost' : 'default'}
      size="sm"
      onClick={() => show('main')}
      className="h-9 gap-1.5 px-2 sm:px-3"
      aria-label={label}
      data-testid="account-button"
    >
      <UserRound className="h-4 w-4" aria-hidden="true" />
      <span className="hidden sm:inline">{label}</span>
    </Button>
  )
}
