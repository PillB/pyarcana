'use client'

import { useCallback, useEffect, useState } from 'react'
import {
  Loader2,
  MessageSquare,
  RefreshCw,
  Bug,
  Lightbulb,
  Sparkles,
  HelpCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

interface FeedbackItem {
  id: string
  type: string
  status: string
  title: string
  body: string
  sectionId: string | null
  pagePath: string | null
  email: string | null
  adminNote: string | null
  createdAt: string
  user?: { id: string; email: string; name: string | null } | null
}

const STATUSES = ['NEW', 'REVIEWING', 'PLANNED', 'DONE', 'WONTFIX', 'DUPLICATE'] as const

const TYPE_ICON: Record<string, typeof Bug> = {
  BUG: Bug,
  IDEA: Lightbulb,
  RECOMMENDATION: Sparkles,
  OTHER: HelpCircle,
}

export function AdminFeedbackPanel() {
  const { toast } = useToast()
  const [items, setItems] = useState<FeedbackItem[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterType, setFilterType] = useState<string>('all')
  const [selected, setSelected] = useState<FeedbackItem | null>(null)
  const [note, setNote] = useState('')
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const q = new URLSearchParams()
      if (filterStatus !== 'all') q.set('status', filterStatus)
      if (filterType !== 'all') q.set('type', filterType)
      const res = await fetch(`/api/feedback?${q.toString()}`)
      if (!res.ok) throw new Error('fail')
      const data = await res.json()
      setItems(data.items || [])
    } catch {
      toast({ title: 'Error al cargar feedback', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }, [filterStatus, filterType, toast])

  useEffect(() => {
    // The effect synchronizes filters with the remote feedback data source.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load()
  }, [load])

  const updateItem = async (id: string, status: string) => {
    setSaving(true)
    try {
      const res = await fetch(`/api/feedback/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, adminNote: note || null }),
      })
      if (!res.ok) throw new Error()
      toast({ title: 'Actualizado' })
      await load()
      setSelected(null)
      setNote('')
    } catch {
      toast({ title: 'No se pudo actualizar', variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-4" data-testid="admin-feedback">
      <div className="flex flex-wrap items-center gap-2">
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos estados</SelectItem>
            {STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos tipos</SelectItem>
            <SelectItem value="BUG">Bug</SelectItem>
            <SelectItem value="IDEA">Idea</SelectItem>
            <SelectItem value="RECOMMENDATION">Recomendación</SelectItem>
            <SelectItem value="OTHER">Otro</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm" onClick={load} className="gap-1.5">
          <RefreshCw className="h-3.5 w-3.5" />
          Actualizar
        </Button>
        <Badge variant="secondary" className="ml-auto">
          {items.length} reportes
        </Badge>
      </div>

      {items.length === 0 ? (
        <Card className="p-8 text-center text-muted-foreground">
          <MessageSquare className="mx-auto h-8 w-8 mb-2 opacity-50" />
          No hay reportes con estos filtros.
        </Card>
      ) : (
        <div className="space-y-2">
          {items.map((item) => {
            const Icon = TYPE_ICON[item.type] || HelpCircle
            return (
              <Card
                key={item.id}
                className={cn(
                  'p-3 cursor-pointer transition-colors hover:bg-accent/30',
                  selected?.id === item.id && 'border-primary/40 bg-primary/5'
                )}
                data-testid={`admin-feedback-row-${item.id}`}
                onClick={() => {
                  setSelected(item)
                  setNote(item.adminNote || '')
                }}
              >
                <div className="flex items-start gap-3">
                  <Icon className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium text-sm truncate">{item.title}</span>
                      <Badge variant="outline" className="text-[10px]">
                        {item.type}
                      </Badge>
                      <Badge
                        variant={item.status === 'NEW' ? 'default' : 'secondary'}
                        className="text-[10px]"
                      >
                        {item.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                      {item.body}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      {new Date(item.createdAt).toLocaleString('es-PE')} ·{' '}
                      {item.user?.email || item.email || 'anónimo'}
                      {item.sectionId ? ` · ${item.sectionId}` : ''}
                    </p>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {selected && (
        <Card className="p-4 space-y-3 border-primary/20" data-testid="admin-feedback-detail">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold">{selected.title}</h3>
              <p className="text-xs text-muted-foreground">
                {selected.type} · {selected.status} · {selected.pagePath || '—'}
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setSelected(null)}>
              Cerrar
            </Button>
          </div>
          <p className="text-sm whitespace-pre-wrap">{selected.body}</p>
          <div className="space-y-1.5">
            <label className="text-xs font-medium">Nota interna</label>
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              placeholder="Notas solo visibles para admins"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {STATUSES.map((s) => (
              <Button
                key={s}
                size="sm"
                variant={selected.status === s ? 'default' : 'outline'}
                disabled={saving}
                onClick={() => updateItem(selected.id, s)}
              >
                {s}
              </Button>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
