import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { syncFeedbackReport } from '@/lib/firebase/sync'
import {
  FEEDBACK_TYPES,
  checkRateLimit,
  clientIpFromForwarded,
  sanitizeFeedbackText,
  type RateLimitStore,
} from '@/lib/feedback-guards'

const createSchema = z.object({
  type: z.enum(FEEDBACK_TYPES),
  title: z.string().trim().min(3).max(120),
  body: z.string().trim().min(10).max(5000),
  sectionId: z.string().trim().max(80).optional().nullable(),
  pagePath: z.string().trim().max(300).optional().nullable(),
  email: z.string().email().optional().nullable(),
})

// In-memory rate limit (resets on server restart)
const rateLimit: RateLimitStore = new Map()

export async function POST(request: Request) {
  try {
    const ip = clientIpFromForwarded(request.headers.get('x-forwarded-for'))
    if (!checkRateLimit(ip, rateLimit)) {
      return NextResponse.json(
        { error: 'Demasiados envíos. Intenta de nuevo en 15 minutos.' },
        { status: 429 }
      )
    }

    const session = await getServerSession(authOptions)
    let body: unknown
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: 'JSON inválido' }, { status: 400 })
    }
    const parsed = createSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Datos inválidos' },
        { status: 400 }
      )
    }

    const data = parsed.data
    const emailFromSession = session?.user?.email?.toLowerCase()
    const email = (data.email || emailFromSession || '').toLowerCase().trim() || null

    if (!session?.user?.id && !email) {
      return NextResponse.json(
        { error: 'Email de contacto requerido si no has iniciado sesión' },
        { status: 400 }
      )
    }

    const ua = request.headers.get('user-agent')?.slice(0, 400) || null

    const row = await db.feedbackReport.create({
      data: {
        type: data.type,
        title: sanitizeFeedbackText(data.title),
        body: sanitizeFeedbackText(data.body),
        sectionId: data.sectionId || null,
        pagePath: data.pagePath || null,
        email,
        userId: session?.user?.id || null,
        userAgent: ua,
        status: 'NEW',
      },
    })

    // Dual-write to Firebase Spark (Firestore) when configured
    void syncFeedbackReport(row)

    return NextResponse.json({ id: row.id, status: row.status }, { status: 201 })
  } catch (e) {
    console.error('feedback POST', e)
    return NextResponse.json({ error: 'Error al guardar el reporte' }, { status: 500 })
  }
}

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }

  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status') || undefined
  const type = searchParams.get('type') || undefined
  const limit = Math.min(Number(searchParams.get('limit') || 100), 200)

  const items = await db.feedbackReport.findMany({
    where: {
      ...(status ? { status } : {}),
      ...(type ? { type } : {}),
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: {
      user: { select: { id: true, email: true, name: true } },
    },
  })

  return NextResponse.json({ items })
}
