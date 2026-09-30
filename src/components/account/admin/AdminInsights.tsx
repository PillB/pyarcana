'use client'

import { useState } from 'react'
import { Label } from '@/components/ui/label'
import { experimentResultsPath, experimentView, surveyView, surveysPath } from '@/lib/cloud/admin-api'
import { parseExperiments } from '@/lib/cloud/experiments'
import { SURVEY_KINDS, type SurveyKind } from '@/lib/cloud/surveys'
import { LoadNote, SELECT_CLASS } from '../LoadNote'
import { useApiLoad } from '../useApiLoad'
import { useText } from '../text'
import { ERROR_ALERT_CLASS } from '@/components/account/a11y'

function Cells({ cells }: { cells: Array<[string, number]> }) {
  return (
    <dl className="grid grid-cols-[auto_1fr] gap-x-4 text-sm">
      {cells.map(([k, v]) => (
        <div key={k} className="contents">
          <dt className="font-mono text-xs text-muted-foreground">{k}</dt>
          <dd>{v}</dd>
        </div>
      ))}
    </dl>
  )
}

function ExperimentResults({ experimentKey }: { experimentKey: string }) {
  const { tr } = useText()
  const load = useApiLoad(experimentResultsPath(experimentKey), experimentView)
  if (!load || load.status !== 'ok') return <LoadNote state={load} />
  const v = load.value
  return (
    <div className="space-y-3" data-testid="admin-experiment">
      {!v.planMet && <p className="text-sm">{tr('adm.exp.planNotMet')}</p>}
      {v.srmFlagged && <p role="alert" className={ERROR_ALERT_CLASS}>{tr('adm.exp.srm')}</p>}
      {v.arms.map((a) => (
        <section key={a.arm} className="rounded-md border border-border p-3">
          <h4 className="text-sm font-semibold">{a.arm}</h4>
          <Cells cells={a.cells} />
        </section>
      ))}
    </div>
  )
}

/**
 * "Experimentos": results behind the plan gate (DESIGN-v3 §F). The results route is designed but
 * not built in the worker yet; until it is, the tab says so instead of showing an empty result.
 */
export function AdminExperiments() {
  const { tr } = useText()
  const list = useApiLoad('/v1/experiments', parseExperiments)
  const [chosen, setChosen] = useState('')
  const experiments = list?.status === 'ok' ? list.value : null
  return (
    <div className="space-y-4">
      <LoadNote state={list} />
      {experiments && !experiments.length && <p className="text-sm text-muted-foreground">{tr('adm.exp.none')}</p>}
      {experiments && experiments.length > 0 && (
        <Label className="flex items-center gap-2 font-normal">
          {tr('adm.exp.pick')}
          <select className={SELECT_CLASS} value={chosen} onChange={(e) => setChosen(e.target.value)}>
            <option value="">—</option>
            {experiments.map((e) => <option key={e.key} value={e.key}>{e.key}</option>)}
          </select>
        </Label>
      )}
      {chosen && <ExperimentResults key={chosen} experimentKey={chosen} />}
    </div>
  )
}

/** "Satisfacción": CSAT, NPS and reason counts with the latest texts (DESIGN-v3 §G); same "not built yet" rule. */
export function AdminSurveys() {
  const { tr } = useText()
  const [kind, setKind] = useState<SurveyKind>('section_csat')
  const load = useApiLoad(surveysPath(kind), surveyView)
  const v = load?.status === 'ok' ? load.value : null
  return (
    <div className="space-y-4">
      <Label className="flex items-center gap-2 font-normal">
        {tr('adm.surveys.kind')}
        <select className={SELECT_CLASS} value={kind} onChange={(e) => setKind(e.target.value as SurveyKind)}>
          {SURVEY_KINDS.map((k) => <option key={k} value={k}>{tr(`adm.surveys.${k}`)}</option>)}
        </select>
      </Label>
      <LoadNote state={load} />
      {v && <Cells cells={v.stats} />}
      {v && v.texts.length > 0 && (
        <ul className="list-disc space-y-1 pl-5 text-sm">
          {v.texts.map((t, i) => <li key={i}>{t}</li>)}
        </ul>
      )}
    </div>
  )
}
