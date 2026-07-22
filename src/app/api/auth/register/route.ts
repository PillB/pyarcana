import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { syncUser } from '@/lib/firebase/sync'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import {
  RegistrationRequestError,
  clientRateKey,
  readBoundedJson,
  registrationLimiter,
} from '@/lib/registration-security'

const registerSchema = z
  .object({
    email: z.string().trim().email('Email inválido').max(254, 'Email demasiado largo'),
    password: z
      .string()
      .min(12, 'Password debe tener al menos 12 caracteres')
      .max(128, 'Password demasiado largo'),
    name: z.string().trim().min(2, 'Nombre muy corto').max(80, 'Nombre demasiado largo').optional(),
  })
  .strict()

export async function POST(request: Request) {
  try {
    if (!registrationLimiter.allow(clientRateKey(request))) {
      return NextResponse.json(
        { error: 'Demasiados intentos. Intenta de nuevo en 15 minutos.' },
        { status: 429 }
      )
    }

    const body = await readBoundedJson(request)
    const parsed = registerSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Datos inválidos' },
        { status: 400 }
      )
    }

    const { email, password, name } = parsed.data
    const emailLower = email.toLowerCase()

    // Check if user exists
    const existing = await db.user.findUnique({ where: { email: emailLower } })
    if (existing) {
      return NextResponse.json(
        { error: 'Ya existe una cuenta con este email' },
        { status: 409 }
      )
    }

    // Hash password with bcrypt (cost factor 12)
    const passwordHash = await bcrypt.hash(password, 12)

    // Public registration is never an administrator-provisioning mechanism.
    // Operators grant elevated roles out of band after identity verification.
    const user = await db.user.create({
      data: {
        email: emailLower,
        name: name || emailLower.split('@')[0],
        passwordHash,
        role: 'STUDENT',
      },
    })

    // Mirror public profile to Firestore (never passwordHash)
    void syncUser({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      country: user.country,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }).catch((error) => console.error('Profile mirror failed:', error))

    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: 'STUDENT',
      message: 'Cuenta creada',
    })
  } catch (error) {
    if (error instanceof RegistrationRequestError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    console.error('Register error:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
