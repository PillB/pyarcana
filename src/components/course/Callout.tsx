'use client'

import { Info, AlertTriangle, CheckCircle2, Lightbulb, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

type CalloutType = 'info' | 'warning' | 'success' | 'tip' | 'danger'

interface CalloutProps {
  type?: CalloutType
  title?: string
  children: React.ReactNode
  className?: string
}

const config: Record<CalloutType, {
  icon: React.ElementType
  container: string
  iconColor: string
  titleColor: string
  label: string
}> = {
  info: {
    icon: Info,
    container: 'border-sky-500/30 bg-sky-500/5',
    iconColor: 'text-sky-600',
    titleColor: 'text-sky-900 dark:text-sky-200',
    label: 'Info',
  },
  warning: {
    icon: AlertTriangle,
    container: 'border-amber-500/30 bg-amber-500/5',
    iconColor: 'text-amber-600',
    titleColor: 'text-amber-900 dark:text-amber-200',
    label: 'Ojo',
  },
  success: {
    icon: CheckCircle2,
    container: 'border-green-500/30 bg-green-500/5',
    iconColor: 'text-green-600',
    titleColor: 'text-green-900 dark:text-green-200',
    label: 'Listo',
  },
  tip: {
    icon: Lightbulb,
    container: 'border-violet-500/30 bg-violet-500/5',
    iconColor: 'text-violet-600',
    titleColor: 'text-violet-900 dark:text-violet-200',
    label: 'Pata',
  },
  danger: {
    icon: XCircle,
    container: 'border-red-500/30 bg-red-500/5',
    iconColor: 'text-red-600',
    titleColor: 'text-red-900 dark:text-red-200',
    label: 'Cuidado',
  },
}

export function Callout({ type = 'info', title, children, className }: CalloutProps) {
  const c = config[type]
  const Icon = c.icon

  return (
    <div className={cn('my-4 flex gap-3 rounded-xl border-l-4 p-4', c.container, className)}>
      <div className={cn('mt-0.5 shrink-0', c.iconColor)}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1 space-y-1">
        {title && (
          <div className={cn('text-sm font-semibold', c.titleColor)}>
            {title}
          </div>
        )}
        <div className="text-sm text-foreground/90 [&>p]:my-0 [&>p+p]:mt-2 [&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-xs [&_code]:font-mono">
          {children}
        </div>
      </div>
    </div>
  )
}
