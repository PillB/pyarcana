import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
// === OAuth Providers ===
// Uncomment the imports below when you configure OAuth credentials in .env
// import GoogleProvider from 'next-auth/providers/google'
// import AzureADProvider from 'next-auth/providers/azure-ad'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'

// Build providers array — conditionally includes OAuth if env vars present
function buildProviders() {
  const providers: any[] = [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email y password son requeridos')
        }

        const user = await db.user.findUnique({
          where: { email: credentials.email.toLowerCase().trim() },
        })

        if (!user || !user.passwordHash) {
          throw new Error('Credenciales inválidas')
        }

        const isValid = await bcrypt.compare(credentials.password, user.passwordHash)
        if (!isValid) {
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

  // === Google OAuth ===
  // Requires: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET in .env
  // Import GoogleProvider at the top of this file
  //
  // if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  //   providers.push(
  //     GoogleProvider({
  //       clientId: process.env.GOOGLE_CLIENT_ID,
  //       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  //     })
  //   )
  // }

  // === Microsoft OAuth (Azure AD) ===
  // Requires: MICROSOFT_CLIENT_ID, MICROSOFT_CLIENT_SECRET, MICROSOFT_TENANT_ID in .env
  // Import AzureADProvider at the top of this file
  //
  // if (process.env.MICROSOFT_CLIENT_ID && process.env.MICROSOFT_CLIENT_SECRET) {
  //   providers.push(
  //     AzureADProvider({
  //       clientId: process.env.MICROSOFT_CLIENT_ID,
  //       clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
  //       tenantId: process.env.MICROSOFT_TENANT_ID,
  //     })
  //   )
  // }

  return providers
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
  secret: process.env.NEXTAUTH_SECRET || 'dev-secret-change-in-production-min-32-chars',
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
