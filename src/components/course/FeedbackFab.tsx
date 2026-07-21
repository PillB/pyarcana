'use client'

import { useState } from 'react'
import { MessageSquarePlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FeedbackModal } from './FeedbackModal'
import { useI18n, t } from '@/lib/i18n'
import { cn } from '@/lib/utils'

interface FeedbackFabProps {
  sectionId?: string | null
  className?: string
}

export function FeedbackFab({ sectionId, className }: FeedbackFabProps) {
  const [open, setOpen] = useState(false)
  const lang = useI18n((s) => s.lang)

  return (
    <>
      <Button
        type="button"
        size="sm"
        variant="default"
        onClick={() => setOpen(true)}
        data-testid="feedback-open"
        className={cn(
          'fixed bottom-20 right-3 z-40 gap-1.5 shadow-lg lg:bottom-6 lg:right-6',
          'rounded-full h-11 px-4',
          className
        )}
        title={t('feedback.open', lang)}
      >
        <MessageSquarePlus className="h-4 w-4" />
        <span className="text-xs font-medium hidden sm:inline">
          {t('feedback.open', lang)}
        </span>
      </Button>
      <FeedbackModal
        open={open}
        onClose={() => setOpen(false)}
        sectionId={sectionId}
      />
    </>
  )
}
