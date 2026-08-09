'use client'

import { motion } from 'framer-motion'
import { ArrowLeft, FileText } from 'lucide-react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface LegalPageProps {
  title: string
  subtitle?: string
  version: string
  effectiveDate: string
  children: React.ReactNode
}

export function LegalPage({ title, subtitle, version, effectiveDate, children }: LegalPageProps) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <Link href="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-4 w-4" />
          Volver al curso
        </Link>
        <div className="flex items-center gap-2 mb-2">
          <FileText className="h-5 w-5 text-primary" />
          <Badge variant="outline" className="text-[10px]">
            Versión {version} · {effectiveDate}
          </Badge>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        {subtitle && <p className="mt-2 text-muted-foreground">{subtitle}</p>}
      </motion.div>
      <Card className="mt-6 p-6 sm:p-8">
        <div className="prose prose-sm dark:prose-invert max-w-none space-y-4 text-sm leading-relaxed text-foreground/90">
          {children}
        </div>
      </Card>
      <p className="mt-4 text-xs text-muted-foreground">
        Este documento es informativo y no constituye asesoría legal. Para cuestiones formales, consulta con un abogado.
      </p>
    </div>
  )
}
