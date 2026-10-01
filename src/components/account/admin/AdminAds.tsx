'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { AD_BATCH_MAX, AD_FILTERS, adsPath, adsRequest, parseAdsList, type AdAccountRow, type AdFilter } from '@/lib/cloud/admin-api'
import { LoadNote, SELECT_CLASS } from '../LoadNote'
import { useApiLoad } from '../useApiLoad'
import { useText, type Tr } from '../text'
import { Feedback, ReasonDialog, sendBuilt } from './shared'

function AdRow({ r, checked, onToggle, tr }: { r: AdAccountRow; checked: boolean; onToggle: () => void; tr: Tr }) {
  const id = `ads-${r.accountId}`
  return (
    <li className="flex items-start gap-3 px-3 py-2 text-sm" data-testid="ads-row" data-account={r.accountId} data-shows={r.showsAds ? 'yes' : 'no'}>
      <input id={id} type="checkbox" className="mt-1 h-4 w-4" checked={checked} onChange={onToggle} />
      <label htmlFor={id} className="flex-1">
        <span className="font-medium">{r.email ?? r.displayName ?? r.accountId}</span>
        <span className="block text-xs text-muted-foreground">
          {tr(`adm.ads.source.${r.source ?? 'free'}`)} · {r.showsAds ? tr('adm.ads.shows') : tr(`adm.ads.hidden.${r.reason}`)}
        </span>
      </label>
    </li>
  )
}

/**
 * "Anuncios": who sees ads and why, and the per-account switch (owner decision 2026-10-01). Ads
 * are on by default for free, gift, tester and admin accounts; paid and trial accounts see none.
 * Select accounts on this page and switch them off, or back to the default, with a reason.
 */
export function AdminAds() {
  const { tr } = useText()
  const [filter, setFilter] = useState<AdFilter>('all')
  const [cursors, setCursors] = useState<Array<string | null>>([null])
  const [nonce, setNonce] = useState(0)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [action, setAction] = useState<boolean | null>(null)
  const [done, setDone] = useState<string | null>(null)
  const cursor = cursors[cursors.length - 1]
  const load = useApiLoad(adsPath(filter, cursor), parseAdsList, nonce)
  const page = load?.status === 'ok' ? load.value : null
  const rows = page?.accounts ?? []
  const allOnPage = rows.length > 0 && rows.every((r) => selected.has(r.accountId))
  const toggle = (id: string) => setSelected((s) => {
    const next = new Set(s)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    return next
  })
  const togglePage = () => setSelected((s) => {
    const next = new Set(s)
    for (const r of rows) {
      if (allOnPage) next.delete(r.accountId)
      else next.add(r.accountId)
    }
    return next
  })
  const changeFilter = (f: AdFilter) => {
    setFilter(f)
    setCursors([null])
    setSelected(new Set())
  }
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">{tr('adm.ads.what')}</p>
      <div className="flex flex-wrap items-center gap-3">
        <Label className="flex items-center gap-2 font-normal">
          {tr('adm.ads.filter')}
          <select className={SELECT_CLASS} value={filter} onChange={(e) => changeFilter(e.target.value as AdFilter)} data-testid="ads-filter">
            {AD_FILTERS.map((f) => <option key={f} value={f}>{tr(`adm.ads.filter.${f}`)}</option>)}
          </select>
        </Label>
        <Button variant="outline" size="sm" onClick={togglePage} disabled={rows.length === 0}>
          {allOnPage ? tr('adm.ads.unselectPage') : tr('adm.ads.selectPage')}
        </Button>
        <span className="text-sm" role="status">{tr('adm.ads.selected', { n: String(selected.size), max: String(AD_BATCH_MAX) })}</span>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant="destructive" disabled={selected.size === 0} onClick={() => setAction(true)} data-testid="ads-off">{tr('adm.ads.turnOff')}</Button>
        <Button size="sm" variant="outline" disabled={selected.size === 0} onClick={() => setAction(false)} data-testid="ads-default">{tr('adm.ads.turnDefault')}</Button>
      </div>
      <Feedback error={null} done={done} />
      <LoadNote state={load} />
      {page && rows.length === 0 && <p className="text-sm text-muted-foreground">{tr('adm.ads.none')}</p>}
      {rows.length > 0 && (
        <ul className="divide-y divide-border rounded-md border border-border">
          {rows.map((r) => <AdRow key={r.accountId} r={r} checked={selected.has(r.accountId)} onToggle={() => toggle(r.accountId)} tr={tr} />)}
        </ul>
      )}
      <div className="flex gap-2">
        <Button variant="outline" size="sm" disabled={cursors.length === 1} onClick={() => setCursors((c) => c.slice(0, -1))}>{tr('adm.ads.prev')}</Button>
        <Button variant="outline" size="sm" disabled={!page?.nextCursor} onClick={() => page?.nextCursor && setCursors((c) => [...c, page.nextCursor])}>{tr('adm.ads.next')}</Button>
      </div>
      <ReasonDialog
        open={action !== null}
        title={action ? tr('adm.ads.offTitle') : tr('adm.ads.defaultTitle')}
        body={tr(action ? 'adm.ads.offBody' : 'adm.ads.defaultBody', { n: String(selected.size) })}
        confirm={action ? tr('adm.ads.turnOff') : tr('adm.ads.turnDefault')}
        onClose={() => setAction(null)}
        tr={tr}
        onConfirm={async (reason) => {
          const out = await sendBuilt('post', '/v1/admin/ads', adsRequest([...selected], action === true, reason), tr)
          if (!out.ok) return out.text
          const changed = Array.isArray(out.data.updated) ? out.data.updated.filter((u) => (u as { changed?: unknown }).changed === true).length : 0
          setDone(tr('adm.ads.done', { n: String(changed) }))
          setSelected(new Set())
          setNonce((n) => n + 1)
          return null
        }}
      />
    </div>
  )
}
