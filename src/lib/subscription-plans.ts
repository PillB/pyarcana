/**
 * Subscription plans configuration — "PyArcana"
 *
 * 3 tiers: Free, Pro, Team
 * Multi-region pricing: Peru (PEN), US/EU/Rest (USD)
 *
 * Based on market research:
 * - Peru: S/29-59/month (PPP-adjusted, ~$8-16 USD)
 * - US/EU: $9.99-29.99/month (industry standard for online courses)
 * - Annual: ~2 months free (17% discount)
 */

export type PlanCode = 'free' | 'pro' | 'team'
export type BillingCycle = 'MONTHLY' | 'YEARLY'
export type CountryCode = 'PE' | 'US' | 'EU' | 'REST'

export interface PlanPricing {
  monthly: number
  yearly: number
  currency: 'PEN' | 'USD' | 'EUR'
  currencySymbol: 'S/' | '$' | '€'
}

export interface SubscriptionPlanConfig {
  code: PlanCode
  name: string
  description: string
  tagline: string
  popular: boolean
  pricing: Record<CountryCode, PlanPricing>
  features: string[]
  maxSections: number // -1 = unlimited
  hasExams: boolean
  hasPlayground: boolean
  hasCertificate: boolean
  hasMentorship: boolean
}

export const SUBSCRIPTION_PLANS: SubscriptionPlanConfig[] = [
  {
    code: 'free',
    name: 'Free',
    description: 'Acceso limitado para probar el curso',
    tagline: 'Perfecto para empezar',
    popular: false,
    pricing: {
      PE: { monthly: 0, yearly: 0, currency: 'PEN', currencySymbol: 'S/' },
      US: { monthly: 0, yearly: 0, currency: 'USD', currencySymbol: '$' },
      EU: { monthly: 0, yearly: 0, currency: 'EUR', currencySymbol: '€' },
      REST: { monthly: 0, yearly: 0, currency: 'USD', currencySymbol: '$' },
    },
    features: [
      'Secciones 1-5 (Fundamentos básicos)',
      'Editor interactivo Pyodide',
      'Quizzes de auto-evaluación',
      'Progreso local guardado',
    ],
    maxSections: 5,
    hasExams: false,
    hasPlayground: true,
    hasCertificate: false,
    hasMentorship: false,
  },
  {
    code: 'pro',
    name: 'Pro',
    description: 'Acceso completo al curso de 52 secciones',
    tagline: 'Para conseguir tu primer trabajo de Data Scientist',
    popular: true,
    pricing: {
      PE: { monthly: 29, yearly: 290, currency: 'PEN', currencySymbol: 'S/' },
      US: { monthly: 9.99, yearly: 99, currency: 'USD', currencySymbol: '$' },
      EU: { monthly: 8.99, yearly: 89, currency: 'EUR', currencySymbol: '€' },
      REST: { monthly: 9.99, yearly: 99, currency: 'USD', currencySymbol: '$' },
    },
    features: [
      'Las 52 secciones completas',
      'Exámenes con anti-plagio (3 variantes)',
      'Editor interactivo Pyodide',
      '4 proyectos capstone de portafolio',
      'Certificado de completitud',
      'Dashboard de progreso avanzado',
      'Familiarity Score Dashboard',
    ],
    maxSections: -1,
    hasExams: true,
    hasPlayground: true,
    hasCertificate: true,
    hasMentorship: false,
  },
  {
    code: 'team',
    name: 'Team',
    description: 'Para equipos y empresas que aprenden juntos',
    tagline: 'Mentoría + acceso completo',
    popular: false,
    pricing: {
      PE: { monthly: 99, yearly: 990, currency: 'PEN', currencySymbol: 'S/' },
      US: { monthly: 29.99, yearly: 299, currency: 'USD', currencySymbol: '$' },
      EU: { monthly: 27.99, yearly: 279, currency: 'EUR', currencySymbol: '€' },
      REST: { monthly: 29.99, yearly: 299, currency: 'USD', currencySymbol: '$' },
    },
    features: [
      'Todo lo de Pro, más:',
      'Mentoría 1:1 mensual (30 min)',
      'Review de portafolio personalizado',
      'Soporte prioritario por Slack',
      'Acceso anticipado a nuevas secciones',
      'Reportes de progreso para managers',
    ],
    maxSections: -1,
    hasExams: true,
    hasPlayground: true,
    hasCertificate: true,
    hasMentorship: true,
  },
]

// Country detection from locale/timezone
export function detectCountry(): CountryCode {
  if (typeof window === 'undefined') return 'REST'
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''
  const lang = navigator.language || ''

  if (tz.includes('America/Lima') || lang.startsWith('es-PE') || lang === 'es-PE') return 'PE'
  if (tz.startsWith('America/') && !tz.includes('America/Lima')) {
    // LATAM but not Peru → treat as REST (USD pricing)
    return 'REST'
  }
  if (tz.startsWith('Europe/') || lang.startsWith('es-ES') || lang.startsWith('de-') || lang.startsWith('fr-')) return 'EU'
  if (tz.includes('America/New_York') || tz.includes('America/Chicago') || tz.includes('America/Los_Angeles') || lang.startsWith('en-US')) return 'US'
  return 'REST'
}

export function getPlanByCode(code: PlanCode): SubscriptionPlanConfig | undefined {
  return SUBSCRIPTION_PLANS.find((p) => p.code === code)
}

export function formatPrice(amount: number, symbol: string): string {
  if (amount === 0) return 'Gratis'
  if (symbol === 'S/') return `${symbol} ${amount.toFixed(0)}`
  return `${symbol}${amount.toFixed(2)}`
}
