'use client'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useCloudStage } from '@/lib/cloud/hooks'
import { useCloudSession, type MePayload } from '@/lib/cloud/session'
import { AccountPanel } from './AccountPanel'
import { CheckoutConfirmPanel } from './CheckoutConfirmPanel'
import { SignInPanel } from './SignInPanel'
import { applyMe, useAccountUi } from './runtime'
import { useText } from './text'

type Mode = 'signIn' | 'account' | 'checkout'

function Body({ mode, me }: { mode: Mode; me: MePayload | null }) {
  if (mode === 'signIn' || !me) return <SignInPanel onSignedIn={applyMe} />
  return mode === 'checkout' ? <CheckoutConfirmPanel me={me} /> : <AccountPanel me={me} />
}

/**
 * One dialog for the whole account surface (Radix: focus trap, Esc, focus return, labelling).
 * Signed out -> SignInPanel; signed in -> AccountPanel, or CheckoutConfirmPanel when the learner
 * chose to subscribe. A pending trial intent is resumed by <CloudSync/> once the sign-in lands.
 * Renders nothing where accounts do not run.
 */
export function AccountDialog() {
  const { tr } = useText()
  const stage = useCloudStage()
  const { open, view, setOpen } = useAccountUi()
  const me = useCloudSession((s) => s.me)
  if (stage === 'off') return null
  const mode: Mode = me ? (view === 'checkout' ? 'checkout' : 'account') : 'signIn'
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent size="md" data-testid="account-dialog">
        <div className="flex min-h-0 flex-col gap-4">
          <DialogHeader>
            <DialogTitle>{tr(`account.dialog.title.${mode}`)}</DialogTitle>
            <DialogDescription>{tr(`account.dialog.desc.${mode}`)}</DialogDescription>
          </DialogHeader>
          <div className="min-h-0 overflow-y-auto pr-1">
            <Body mode={mode} me={me} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
