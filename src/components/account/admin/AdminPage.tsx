'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CloudPageFrame } from '../CloudPageFrame'
import { useMeOnce } from '../QaSitePage'
import { useText } from '../text'
import { AdminAccounts } from './AdminAccounts'
import { AdminAds } from './AdminAds'
import { AdminGrants } from './AdminGrants'
import { AdminExperiments, AdminSurveys } from './AdminInsights'
import { AdminQa } from './AdminQa'
import { AdminReports } from './AdminReports'
import { AdminTesters } from './AdminTesters'
import { AdminUsage, UsageBanner } from './AdminUsage'
import { QaWorkspace } from './QaWorkspace'
import { qaAccess } from '@/lib/cloud/qa-review'

const TABS = [
  ['reports', AdminReports],
  ['qa', AdminQa],
  ['grants', AdminGrants],
  ['testers', AdminTesters],
  ['accounts', AdminAccounts],
  ['ads', AdminAds],
  ['experiments', AdminExperiments],
  ['surveys', AdminSurveys],
  ['usage', AdminUsage],
] as const

function AdminTabs() {
  const { tr } = useText()
  return (
    <div className="space-y-4">
    <UsageBanner />
    <Tabs defaultValue="reports" className="space-y-4">
      <TabsList className="flex h-auto flex-wrap">
        {TABS.map(([value]) => <TabsTrigger key={value} value={value}>{tr(`adm.tab.${value}`)}</TabsTrigger>)}
      </TabsList>
      {TABS.map(([value, Panel]) => (
        <TabsContent key={value} value={value}>
          <Panel />
        </TabsContent>
      ))}
    </Tabs>
    </div>
  )
}

function AdminActive() {
  const { tr } = useText()
  const { me, settled } = useMeOnce()
  if (!settled) return <p role="status" className="text-sm text-muted-foreground">{tr('cloudpage.loading')}</p>
  // The worker checks every admin and QA route itself; this only avoids showing a window that would fail.
  const access = qaAccess(me)
  if (access === 'admin') return <AdminTabs />
  if (access === 'supervisor' || access === 'tester') return <QaWorkspace access={access} />
  return <p className="text-sm">{tr('adm.notAdmin')}</p>
}

/**
 * /admin (DESIGN-v3 §H). Every tab for an admin session; for a tester or a QA supervisor only the
 * QA reports window (QaWorkspace, owner request 2026-11-19). It loads no third-party script (no
 * Google button, no ad slot), and its links are plain page loads.
 */
export function AdminPage() {
  return <CloudPageFrame titleKey="adm.title" plainLinks wide>{() => <AdminActive />}</CloudPageFrame>
}
