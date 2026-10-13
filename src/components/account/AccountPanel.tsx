'use client'

import type { MePayload } from '@/lib/cloud/session'
import { ArchiveSection, DataSection, LinkSection, SignOutSection, SyncSection } from './AccountSections'
import { PlanSection, SubscriptionSection, TrialSection, UpgradeSection } from './PlanSections'
import { useText } from './text'

/** The signed-in view: plan, trial, upgrade, subscriptions, sync, archives, sign-in methods, data, sign out. */
export function AccountPanel({ me }: { me: MePayload }) {
  const { tr } = useText()
  return (
    <div className="space-y-4" data-testid="account-panel">
      <p className="text-sm text-muted-foreground">
        {me.account.email ? tr('account.panel.signedInAs', { email: me.account.email }) : tr('account.panel.signedIn')}
      </p>
      <PlanSection me={me} />
      <TrialSection me={me} />
      <UpgradeSection me={me} />
      <SubscriptionSection me={me} />
      <SyncSection />
      <ArchiveSection />
      <LinkSection me={me} />
      <DataSection />
      <SignOutSection />
    </div>
  )
}
