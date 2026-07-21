'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Loader2, MessageSquarePlus } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { COURSE_SECTIONS } from '@/lib/course'
import { useI18n, t } from '@/lib/i18n'

const TYPES = [
  { value: 'BUG', labelKey: 'feedback.type.bug' },
  { value: 'IDEA', labelKey: 'feedback.type.idea' },
  { value: 'RECOMMENDATION', labelKey: 'feedback.type.recommendation' },
  { value: 'OTHER', labelKey: 'feedback.type.other' },
] as const

interface FeedbackModalProps {
  open: boolean
  onClose: () => void
  sectionId?: string | null
}

export function FeedbackModal({ open, onClose, sectionId }: FeedbackModalProps) {
  const { data: session } = useSession()
  const lang = useI18n((s) => s.lang)
  const { toast } = useToast()
  const [type, setType] = useState<string>('BUG')
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [email, setEmail] = useState('')
  const [section, setSection] = useState<string>('general')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      setSection(sectionId || 'general')
      setEmail(session?.user?.email || '')
      setError(null)
    }
  }, [open, sectionId, session?.user?.email])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const pagePath =
        typeof window !== 'undefined'
          ? `${window.location.pathname}${window.location.hash}`
          : null
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          title,
          body,
          sectionId: section === 'general' ? null : section,
          pagePath,
          email: email || null,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data.error || t('feedback.error', lang))
        return
      }
      toast({
        title: t('feedback.successTitle', lang),
        description: t('feedback.successDesc', lang),
      })
      setTitle('')
      setBody('')
      setType('BUG')
      onClose()
    } catch {
      setError(t('feedback.error', lang))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto" data-testid="feedback-modal">
        <DialogHeader>
          <div className="mb-1 flex justify-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <MessageSquarePlus className="h-5 w-5" />
            </div>
          </div>
          <DialogTitle className="text-center">{t('feedback.title', lang)}</DialogTitle>
          <DialogDescription className="text-center">
            {t('feedback.desc', lang)}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3 mt-2">
          <div className="space-y-1.5">
            <Label>{t('feedback.field.type', lang)}</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger data-testid="feedback-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TYPES.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {t(opt.labelKey, lang)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="fb-title">{t('feedback.field.title', lang)}</Label>
            <Input
              id="fb-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              minLength={3}
              maxLength={120}
              required
              data-testid="feedback-title"
              placeholder={t('feedback.field.titlePlaceholder', lang)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="fb-body">{t('feedback.field.body', lang)}</Label>
            <Textarea
              id="fb-body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              minLength={10}
              maxLength={5000}
              required
              rows={5}
              data-testid="feedback-body"
              placeholder={t('feedback.field.bodyPlaceholder', lang)}
            />
          </div>

          <div className="space-y-1.5">
            <Label>{t('feedback.field.section', lang)}</Label>
            <Select value={section} onValueChange={setSection}>
              <SelectTrigger data-testid="feedback-section">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                <SelectItem value="general">{t('feedback.field.sectionGeneral', lang)}</SelectItem>
                {COURSE_SECTIONS.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    S{s.index}. {s.shortTitle}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="fb-email">{t('feedback.field.email', lang)}</Label>
            <Input
              id="fb-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required={!session?.user}
              data-testid="feedback-email"
              placeholder="tu@email.com"
            />
            <p className="text-[11px] text-muted-foreground">
              {session?.user
                ? t('feedback.field.emailLoggedIn', lang)
                : t('feedback.field.emailGuest', lang)}
            </p>
          </div>

          {error && (
            <p className="text-sm text-destructive" data-testid="feedback-error">
              {error}
            </p>
          )}

          <Button type="submit" className="w-full gap-2" disabled={loading} data-testid="feedback-submit">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {t('feedback.submit', lang)}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
