import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { z } from 'zod'

const checkoutSchema = z.object({
  planCode: z.enum(['free', 'pro', 'team']),
  billingCycle: z.enum(['MONTHLY', 'YEARLY']),
  country: z.enum(['PE', 'US', 'EU', 'REST']),
})

// POST /api/subscription/checkout — initiate checkout
// In production, this would create a Stripe/MercadoPago/LemonSqueezy checkout session.
// For now, it creates a "MANUAL" subscription for testing.
export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const parsed = checkoutSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 })
    }

    const { planCode, billingCycle, country } = parsed.data
    const userId = session.user.id

    // Get the plan from DB
    const plan = await db.subscriptionPlan.findUnique({
      where: { code: planCode },
    })
    if (!plan) {
      return NextResponse.json({ error: 'Plan no encontrado' }, { status: 404 })
    }

    // Parse pricing
    const pricing = JSON.parse(plan.pricingJSON)
    const regionPricing = pricing[country] || pricing['REST']
    const amount = billingCycle === 'MONTHLY' ? regionPricing.monthly : regionPricing.yearly
    const currency = regionPricing.currency || (country === 'PE' ? 'PEN' : 'USD')

    // For FREE plan, create subscription directly
    if (planCode === 'free') {
      const now = new Date()
      const end = new Date(now)
      end.setFullYear(end.getFullYear() + 100) // free = forever

      const existing = await db.subscription.findUnique({ where: { userId } })
      if (existing) {
        await db.subscription.update({
          where: { userId },
          data: {
            planId: plan.id,
            status: 'ACTIVE',
            billingCycle: 'MONTHLY',
            currency,
            amount: 0,
            provider: 'MANUAL',
            currentPeriodStart: now,
            currentPeriodEnd: end,
            cancelAtPeriodEnd: false,
          },
        })
      } else {
        await db.subscription.create({
          data: {
            userId,
            planId: plan.id,
            status: 'ACTIVE',
            billingCycle: 'MONTHLY',
            currency,
            amount: 0,
            provider: 'MANUAL',
            currentPeriodStart: now,
            currentPeriodEnd: end,
          },
        })
      }

      return NextResponse.json({
        success: true,
        redirectUrl: '/#setup',
        message: 'Plan Free activado',
      })
    }

    // For PAID plans in TEST MODE: create a pending subscription + payment record
    // In production, this is where you'd redirect to Stripe/MercadoPago/LemonSqueezy checkout
    const now = new Date()
    const periodEnd = new Date(now)
    if (billingCycle === 'MONTHLY') {
      periodEnd.setMonth(periodEnd.getMonth() + 1)
    } else {
      periodEnd.setFullYear(periodEnd.getFullYear() + 1)
    }

    // Create or update subscription in TRIALING state (test mode)
    const existing = await db.subscription.findUnique({ where: { userId } })
    let subscription
    if (existing) {
      subscription = await db.subscription.update({
        where: { userId },
        data: {
          planId: plan.id,
          status: 'TRIALING',
          billingCycle,
          currency,
          amount,
          provider: process.env.PAYMENT_PROVIDER || 'MANUAL',
          currentPeriodStart: now,
          currentPeriodEnd: periodEnd,
          trialEnd: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // 7-day trial
        },
      })
    } else {
      subscription = await db.subscription.create({
        data: {
          userId,
          planId: plan.id,
          status: 'TRIALING',
          billingCycle,
          currency,
          amount,
          provider: process.env.PAYMENT_PROVIDER || 'MANUAL',
          currentPeriodStart: now,
          currentPeriodEnd: periodEnd,
          trialEnd: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
        },
      })
    }

    // Create payment record (PENDING — in production, the webhook would mark it SUCCEEDED)
    await db.payment.create({
      data: {
        userId,
        subscriptionId: subscription.id,
        amount,
        currency,
        provider: process.env.PAYMENT_PROVIDER || 'MANUAL',
        status: 'PENDING',
      },
    })

    return NextResponse.json({
      success: true,
      redirectUrl: '/#setup',
      message: `Plan ${plan.name} iniciado — 7 días de prueba gratis`,
      testMode: true,
      note: 'En producción, esto redirige a la pasarela de pago seleccionada.',
    })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
