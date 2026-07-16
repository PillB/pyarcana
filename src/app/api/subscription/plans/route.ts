import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

// GET /api/subscription/plans — list all active subscription plans
export async function GET() {
  try {
    const plans = await db.subscriptionPlan.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'asc' },
    })
    return NextResponse.json({ plans })
  } catch (error) {
    console.error('Failed to fetch plans:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}

// POST /api/subscription/plans — seed default plans (admin only, run once)
export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }

  try {
    const { plans } = await request.json()

    for (const plan of plans) {
      await db.subscriptionPlan.upsert({
        where: { code: plan.code },
        create: {
          code: plan.code,
          name: plan.name,
          description: plan.description,
          pricingJSON: JSON.stringify(plan.pricing),
          featuresJSON: JSON.stringify(plan.features),
          maxSections: plan.maxSections,
          hasExams: plan.hasExams,
          hasPlayground: plan.hasPlayground,
          hasCertificate: plan.hasCertificate,
          hasMentorship: plan.hasMentorship,
          isActive: true,
        },
        update: {
          name: plan.name,
          description: plan.description,
          pricingJSON: JSON.stringify(plan.pricing),
          featuresJSON: JSON.stringify(plan.features),
          maxSections: plan.maxSections,
          hasExams: plan.hasExams,
          hasPlayground: plan.hasPlayground,
          hasCertificate: plan.hasCertificate,
          hasMentorship: plan.hasMentorship,
        },
      })
    }

    return NextResponse.json({ success: true, count: plans.length })
  } catch (error) {
    console.error('Failed to seed plans:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
