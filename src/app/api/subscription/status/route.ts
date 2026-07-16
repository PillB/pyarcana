import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

// GET /api/subscription/status — get current user's subscription status
export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  try {
    const subscription = await db.subscription.findUnique({
      where: { userId: session.user.id },
      include: { plan: true },
    })

    if (!subscription) {
      // No subscription = free tier
      const freePlan = await db.subscriptionPlan.findUnique({ where: { code: 'free' } })
      return NextResponse.json({
        hasSubscription: false,
        planCode: 'free',
        planName: 'Free',
        status: 'ACTIVE',
        features: freePlan ? JSON.parse(freePlan.featuresJSON) : [],
        maxSections: freePlan?.maxSections ?? 5,
      })
    }

    return NextResponse.json({
      hasSubscription: true,
      planCode: subscription.plan.code,
      planName: subscription.plan.name,
      status: subscription.status,
      billingCycle: subscription.billingCycle,
      amount: subscription.amount,
      currency: subscription.currency,
      currentPeriodEnd: subscription.currentPeriodEnd,
      cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
      trialEnd: subscription.trialEnd,
      features: JSON.parse(subscription.plan.featuresJSON),
      maxSections: subscription.plan.maxSections,
      hasExams: subscription.plan.hasExams,
      hasCertificate: subscription.plan.hasCertificate,
      hasMentorship: subscription.plan.hasMentorship,
    })
  } catch (error) {
    console.error('Status error:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
