'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Sparkles, Users, Zap, Crown, Globe } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  SUBSCRIPTION_PLANS,
  detectCountry,
  formatPrice,
  type PlanCode,
  type BillingCycle,
  type CountryCode,
} from '@/lib/subscription-plans'

interface PricingPageProps {
  currentPlan?: PlanCode
  onSelectPlan: (planCode: PlanCode, cycle: BillingCycle, country: CountryCode) => void
  onOpenAuth: () => void
  isAuthenticated: boolean
}

const COUNTRY_LABELS: Record<CountryCode, string> = {
  PE: '🇵🇪 Perú (S/)',
  US: '🇺🇸 USA ($)',
  EU: '🇪🇺 Europa (€)',
  REST: '🌍 Resto del mundo ($)',
}

const PLAN_ICONS: Record<PlanCode, React.ElementType> = {
  free: Zap,
  pro: Sparkles,
  team: Crown,
}

export function PricingPage({ currentPlan, onSelectPlan, onOpenAuth, isAuthenticated }: PricingPageProps) {
  const [cycle, setCycle] = useState<BillingCycle>('MONTHLY')
  // Lazy init avoids setState-in-effect (SSR-safe: detectCountry falls back if needed)
  const [country, setCountry] = useState<CountryCode>(() => detectCountry())

  const handleSelect = (code: PlanCode) => {
    if (!isAuthenticated) {
      onOpenAuth()
      return
    }
    if (code === 'free') {
      onSelectPlan('free', 'MONTHLY', country)
      return
    }
    onSelectPlan(code, cycle, country)
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          <span className="gradient-text">Planes y Precios</span>
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Elige el plan que se ajuste a tu camino hacia Data Scientist
        </p>
      </div>

      {/* Controls: Country + Billing cycle */}
      <div className="mb-8 flex flex-col sm:flex-row items-center justify-center gap-4">
        {/* Country selector */}
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-muted-foreground" />
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value as CountryCode)}
            className="rounded-md border border-border bg-background px-3 py-1.5 text-sm"
          >
            {Object.entries(COUNTRY_LABELS).map(([code, label]) => (
              <option key={code} value={code}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {/* Billing cycle toggle */}
        <div className="flex items-center rounded-lg border border-border bg-card p-1">
          <button
            onClick={() => setCycle('MONTHLY')}
            className={cn(
              'rounded-md px-4 py-1.5 text-sm font-medium transition-colors',
              cycle === 'MONTHLY' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            Mensual
          </button>
          <button
            onClick={() => setCycle('YEARLY')}
            className={cn(
              'rounded-md px-4 py-1.5 text-sm font-medium transition-colors',
              cycle === 'YEARLY' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            Anual
            <Badge className="ml-1.5 bg-green-600 text-white text-[10px] h-4 px-1">-17%</Badge>
          </button>
        </div>
      </div>

      {/* Plans grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {SUBSCRIPTION_PLANS.map((plan, idx) => {
          const Icon = PLAN_ICONS[plan.code]
          const pricing = plan.pricing[country]
          const amount = cycle === 'MONTHLY' ? pricing.monthly : pricing.yearly
          const isCurrent = currentPlan === plan.code
          const isFree = plan.code === 'free'

          return (
            <motion.div
              key={plan.code}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card
                className={cn(
                  'relative h-full p-6 flex flex-col',
                  plan.popular && 'border-primary ring-2 ring-primary/20 shadow-lg',
                  isCurrent && 'border-green-600 ring-2 ring-green-600/20'
                )}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
                    Más popular
                  </Badge>
                )}
                {isCurrent && (
                  <Badge className="absolute -top-3 right-4 bg-green-600 text-white">
                    Plan actual
                  </Badge>
                )}

                {/* Plan header */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className={cn('h-5 w-5', plan.popular ? 'text-primary' : 'text-muted-foreground')} />
                    <h3 className="text-xl font-bold">{plan.name}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">{plan.tagline}</p>
                </div>

                {/* Price */}
                <div className="mb-4">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold">
                      {formatPrice(amount, pricing.currencySymbol)}
                    </span>
                    {!isFree && (
                      <span className="text-sm text-muted-foreground">
                        /{cycle === 'MONTHLY' ? 'mes' : 'año'}
                      </span>
                    )}
                  </div>
                  {!isFree && cycle === 'YEARLY' && (
                    <p className="text-xs text-green-600 mt-1">
                      Ahorras {formatPrice(pricing.monthly * 12 - pricing.yearly, pricing.currencySymbol)} al año
                    </p>
                  )}
                  {!isFree && cycle === 'MONTHLY' && pricing.yearly > 0 && (
                    <p className="text-xs text-muted-foreground mt-1">
                      o {formatPrice(pricing.yearly, pricing.currencySymbol)}/año (ahorra 17%)
                    </p>
                  )}
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>

                {/* Features */}
                <ul className="space-y-2 mb-6 flex-1">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                      <span className="text-foreground/90">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Button
                  onClick={() => handleSelect(plan.code)}
                  disabled={isCurrent}
                  className={cn(
                    'w-full',
                    plan.popular && !isCurrent && 'bg-primary text-primary-foreground hover:bg-primary/90',
                    isCurrent && 'bg-green-600 text-white hover:bg-green-600'
                  )}
                  variant={plan.popular ? 'default' : 'outline'}
                >
                  {isCurrent ? 'Plan actual' : isFree ? 'Empezar gratis' : 'Suscribirse'}
                </Button>

                {/* Payment methods note */}
                {!isFree && (
                  <p className="mt-3 text-[10px] text-center text-muted-foreground">
                    {country === 'PE'
                      ? 'Yape, Plin, BCP, Interbank · MercadoPago'
                      : 'Visa, Mastercard, PayPal, Apple Pay · Paddle'}
                  </p>
                )}
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* FAQ */}
      <div className="mt-12 max-w-3xl mx-auto">
        <h2 className="text-xl font-semibold text-center mb-6">Preguntas frecuentes</h2>
        <div className="space-y-4">
          <FAQItem
            q="¿Puedo cambiar de plan en cualquier momento?"
            a="Sí. Al upgradear, prorrateamos el tiempo restante. Al downgradear, el cambio aplica al siguiente ciclo de facturación."
          />
          <FAQItem
            q="¿Qué métodos de pago aceptan en Perú?"
            a="Yape, Plin, tarjetas BCP/Interbank/BBVA, y PagoEfectivo vía MercadoPago. Para suscripciones recurrentes se requiere tarjeta (Yape/Plin solo para pago anual único)."
          />
          <FAQItem
            q="¿Hay descuento para estudiantes?"
            a="Sí. Los precios en PEN ya están ajustados por paridad de poder adquisivo (PPP) para Perú. Si eres estudiante universitario en Perú, contáctanos para un descuento adicional del 30%."
          />
          <FAQItem
            q="¿Puedo cancelar mi suscripción?"
            a="Sí, en cualquier momento desde tu panel de cuenta. Mantienes acceso hasta el final del período pagado."
          />
          <FAQItem
            q="¿El certificado es válido?"
            a="El certificado de completitud demuestra que terminaste las 52 secciones + 4 capstones. No es un certificado oficial de una universidad, pero es un signal valioso para portafolio y LinkedIn."
          />
        </div>
      </div>
    </div>
  )
}

function FAQItem({ q, a }: { q: string; a: string }) {
  return (
    <div className="rounded-lg border border-border/60 bg-card p-4">
      <dt className="font-medium text-sm mb-1">{q}</dt>
      <dd className="text-sm text-muted-foreground">{a}</dd>
    </div>
  )
}
