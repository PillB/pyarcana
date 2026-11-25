'use client'

import type { MePayload } from '@/lib/cloud/session'
import { staffRole } from '@/lib/cloud/qa-review'
import { Section } from './PlanSections'
import { sitePath, useText } from './text'

/**
 * The staff line at the top of the account window (owner request 2026-11-25): an admin, QA
 * supervisor or tester sees their role and a link to /admin, so nobody types the address. A
 * listed admin whose Google sign-in is stale is told how to get the admin tabs back. Learners get
 * nothing. The plan line below stays the plan (free or Pro), because a role is not a plan.
 */
export function StaffSection({ me }: { me: MePayload }) {
  const { tr } = useText()
  const staff = staffRole(me)
  if (!staff) return null
  return (
    <Section title={tr('account.staff.heading')}>
      <p className="text-sm" data-testid="account-staff-role">{tr(`account.staff.role.${staff.role}`)}</p>
      {staff.reauth && <p className="text-xs text-muted-foreground" data-testid="account-staff-reauth">{tr('account.staff.reauth')}</p>}
      <p className="text-sm">
        <a href={sitePath('/admin')} className="underline underline-offset-2" data-testid="account-staff-link">
          {tr(staff.role === 'admin' ? 'account.staff.link.admin' : 'account.staff.link.qa')}
        </a>
      </p>
    </Section>
  )
}
