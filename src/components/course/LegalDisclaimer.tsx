'use client'

import { motion } from 'framer-motion'
import { ScrollText, ShieldCheck, Lock, FileWarning, Copyright } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

/**
 * Reusable legal & security disclaimer block.
 *
 * Renders the four pillars required across PyArcana user-facing pages:
 *   1. Curso (educational use)
 *   2. Datos (privacy)
 *   3. Seguridad (security practices)
 *   4. Copyright (ownership of learner code)
 *
 * All copy is in Peruvian Spanish and follows Stephen Fry redaction:
 * every piece of jargon is unpacked inline with an "esto es, …" pattern,
 * so a first-time learner can read it without a glossary.
 */

export interface LegalDisclaimerProps {
  /** Show the section heading. Defaults to true. */
  showHeading?: boolean
  /** Compact mode: tighter spacing, no outer Card wrap. */
  compact?: boolean
  className?: string
}

interface DisclaimerItem {
  icon: React.ElementType
  iconColor: string
  title: string
  body: string
}

const items: DisclaimerItem[] = [
  {
    icon: ScrollText,
    iconColor: 'text-violet-600 dark:text-violet-300',
    title: 'Sobre el curso',
    body:
      'Este curso es material educativo. No constituye asesoría profesional, legal ni financiera. ' +
      'Esto es, lo que aprendas aquí te prepara para construir tus propias soluciones, pero no reemplaza ' +
      'la opinión de un contador, abogado o especialista cuando hay un riesgo concreto de por medio.',
  },
  {
    icon: Lock,
    iconColor: 'text-sky-600 dark:text-sky-300',
    title: 'Tus datos',
    body:
      'Tus datos de progreso se almacenan localmente en tu navegador (en la edición estática) o en nuestros ' +
      'servidores (en la edición dinámica). No vendemos ni compartimos tus datos. Esto es, en la versión ' +
      'web pública tu avance vive en el mismo navegador que estás usando; en la edición con login se guarda ' +
      'en nuestros servidores para sincronizar entre dispositivos, y en ningún caso lo pasamos a terceros.',
  },
  {
    icon: ShieldCheck,
    iconColor: 'text-emerald-600 dark:text-emerald-300',
    title: 'Prácticas de seguridad',
    body:
      'Las prácticas de seguridad mencionadas en este curso son puntos de partida, no auditorías completas. ' +
      'Para aplicaciones en producción, consulta con un especialista en seguridad. Esto es, te enseñamos a ' +
      'reconocer los riesgos más comunes (inyección, filtración de secretos, validación solo en el cliente), ' +
      'pero cada aplicación tiene su propio contexto y merece una revisión profesional antes de exponer usuarios reales.',
  },
  {
    icon: Copyright,
    iconColor: 'text-amber-600 dark:text-amber-300',
    title: 'Copyright y uso del código',
    body:
      'El código que escribes en este curso es tuyo. Los ejercicios y escenarios son educativos y no deben ' +
      'usarse en producción sin adaptación. Esto es, puedes llevar lo que construyas a tu portafolio o a un ' +
      'producto propio; los ejemplos del curso, en cambio, están simplificados a propósito y conviene ' +
      'revisarlos (manejo de errores, validación, secretos) antes de ponerlos frente a clientes reales.',
  },
]

export function LegalDisclaimer({ showHeading = true, compact = false, className }: LegalDisclaimerProps) {
  const inner = (
    <>
      {showHeading && (
        <div className="mb-4 flex items-center gap-2">
          <FileWarning className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Avisos legales y de seguridad</h2>
        </div>
      )}

      <div className={cn('grid gap-4', compact ? 'sm:grid-cols-1' : 'sm:grid-cols-2')}>
        {items.map((it, i) => {
          const Icon = it.icon
          return (
            <motion.div
              key={it.title}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className={cn('h-full p-5', compact && 'p-4')}>
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 shrink-0">
                    <Icon className={cn('h-5 w-5', it.iconColor)} />
                  </div>
                  <div className="min-w-0 flex-1 space-y-1.5">
                    <h3 className="text-sm font-semibold leading-tight">{it.title}</h3>
                    <p className="text-xs leading-relaxed text-muted-foreground">{it.body}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          )
        })}
      </div>

      <p className="mt-4 text-[11px] leading-relaxed text-muted-foreground/80">
        Estos avisos reflejan buenas prácticas de la industria (GDPR de la Unión Europea y CCPA de California
        para privacidad; OWASP y NIST para seguridad de software) y se ofrecen como punto de partida. Si tienes
        dudas sobre tu caso particular, consulta con un profesional acreditado.
      </p>
    </>
  )

  if (compact) {
    return <section className={cn('mt-8', className)}>{inner}</section>
  }

  return <section className={cn('mt-10', className)}>{inner}</section>
}
