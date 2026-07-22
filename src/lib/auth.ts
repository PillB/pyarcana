import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'

// Used only to make unknown-user and wrong-password checks take the same bcrypt
// path. It is a one-way hash, not a credential or fallback secret.
const DUMMY_PASSWORD_HASH = '$2b$12$C6UzMDM.H6dfI/f/IKcEe.5WfIdnWn8WbzhFvwmh8DOyuSSy2aH2O'

function buildProviders() {
  return [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Credenciales inválidas')
        }

        const email = credentials.email.toLowerCase().trim()
        if (email.length > 254 || credentials.password.length > 128) {
          throw new Error('Credenciales inválidas')
        }

        const user = await db.user.findUnique({ where: { email } })
        const passwordHash = user?.passwordHash || DUMMY_PASSWORD_HASH
        const isValid = await bcrypt.compare(credentials.password, passwordHash)

        if (!user || !user.passwordHash || !isValid) {
          throw new Error('Credenciales inválidas')
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name || user.email,
          role: user.role,
        }
      },
    }),
  ]
}

export const authOptions: NextAuthOptions = {
  providers: buildProviders(),
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  jwt: {
    maxAge: 7 * 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as { role?: string }).role || 'STUDENT'
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
  },
  pages: {
    // We use a modal instead of custom pages, but keep this for potential future use
    signIn: '/',
    error: '/',
  },
  // There is deliberately no fallback. Deployments must provide a unique,
  // high-entropy secret through their environment.
  secret: process.env.NEXTAUTH_SECRET,
}

// Type augmentation for next-auth
declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      role: string
    }
  }
  interface User {
    role?: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string
    role?: string
  }
}
