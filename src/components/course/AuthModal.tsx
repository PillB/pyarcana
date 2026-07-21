'use client'

import { useState } from 'react'
import { signIn, signOut } from 'next-auth/react'
import { useSession } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X, Mail, Lock, User, Loader2, AlertCircle, LogOut,
  ShieldCheck, GraduationCap, Sparkles
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'

interface AuthModalProps {
  open: boolean
  onClose: () => void
  defaultTab?: 'login' | 'register'
}

export function AuthModal({ open, onClose, defaultTab = 'login' }: AuthModalProps) {
  const [tab, setTab] = useState<'login' | 'register'>(defaultTab)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  // Login form
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  // Register form
  const [regName, setRegName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPassword, setRegPassword] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await signIn('credentials', {
        email: loginEmail,
        password: loginPassword,
        redirect: false,
      })
      if (res?.error) {
        setError('Email o password incorrectos')
      } else {
        toast({ title: '✓ Bienvenido de vuelta', description: 'Sesión iniciada' })
        onClose()
        setLoginEmail('')
        setLoginPassword('')
      }
    } catch {
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: regEmail,
          password: regPassword,
          name: regName || undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Error al registrar')
        return
      }
      // Auto-login after register
      const signRes = await signIn('credentials', {
        email: regEmail,
        password: regPassword,
        redirect: false,
      })
      if (signRes?.error) {
        setError('Cuenta creada pero falló el auto-login. Inicia sesión manualmente.')
        setTab('login')
      } else {
        toast({
          title: '✓ Cuenta creada',
          description: data.role === 'ADMIN'
            ? 'Eres el primer usuario — rol ADMIN asignado'
            : '¡Bienvenido al curso!',
        })
        onClose()
        setRegName('')
        setRegEmail('')
        setRegPassword('')
      }
    } catch {
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  const handleDemoLogin = async (type: 'student' | 'admin') => {
    setLoading(true)
    setError(null)
    const email = type === 'admin' ? 'admin@python-ds.pe' : 'demo@python-ds.pe'
    const password = type === 'admin' ? 'admin123' : 'demo1234'
    try {
      const res = await signIn('credentials', { email, password, redirect: false })
      if (res?.error) {
        setError('No se pudo entrar con la cuenta demo')
      } else {
        toast({
          title: `✓ Sesión demo (${type === 'admin' ? 'Admin' : 'Estudiante'})`,
          description: 'Explora la plataforma con esta cuenta',
        })
        onClose()
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="mb-2 flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-primary shadow-glow">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl">
            <span className="gradient-text">PyArcana</span>
          </DialogTitle>
          <DialogDescription className="text-center">
            Inicia sesión para guardar tu progreso, rendir exámenes y ver tu dashboard
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-700 dark:text-red-300">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <Tabs value={tab} onValueChange={(v) => setTab(v as 'login' | 'register')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Iniciar sesión</TabsTrigger>
            <TabsTrigger value="register">Crear cuenta</TabsTrigger>
          </TabsList>

          {/* LOGIN */}
          <TabsContent value="login" className="space-y-3 mt-4">
            <form onSubmit={handleLogin} className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="login-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="tu@email.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="pl-9"
                    required
                    data-testid="auth-email"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="login-pass">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="login-pass"
                    type="password"
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="pl-9"
                    required
                    data-testid="auth-password"
                  />
                </div>
              </div>
              <Button type="submit" disabled={loading} className="w-full gap-2" data-testid="auth-login">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Entrar
              </Button>
            </form>

            <div className="relative py-1">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-background px-2 text-xs text-muted-foreground">o</span>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={() => handleDemoLogin('student')}
              data-testid="auth-demo-student"
            >
              <GraduationCap className="h-4 w-4" />
              Probar con cuenta demo (estudiante)
            </Button>
            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={() => handleDemoLogin('admin')}
              data-testid="auth-demo-admin"
            >
              <ShieldCheck className="h-4 w-4" />
              Probar con cuenta demo (admin)
            </Button>
          </TabsContent>

          {/* REGISTER */}
          <TabsContent value="register" className="space-y-3 mt-4">
            <form onSubmit={handleRegister} className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="reg-name">Nombre (opcional)</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="reg-name"
                    type="text"
                    placeholder="Tu nombre"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="reg-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="reg-email"
                    type="email"
                    placeholder="tu@email.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="pl-9"
                    required
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="reg-pass">Password (mín. 6 caracteres)</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="reg-pass"
                    type="password"
                    placeholder="••••••••"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="pl-9"
                    required
                    minLength={6}
                  />
                </div>
              </div>
              <Button type="submit" disabled={loading} className="w-full gap-2">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Crear cuenta
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        {/* OAuth buttons — documented mock */}
        <div className="space-y-2 pt-2">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-background px-2 text-xs text-muted-foreground">OAuth</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => {
                toast({
                  title: 'OAuth no configurado',
                  description: 'En producción, agrega GOOGLE_CLIENT_ID y SECRET en .env. Usa la cuenta demo por ahora.',
                })
              }}
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => {
                toast({
                  title: 'OAuth no configurado',
                  description: 'En producción, agrega MICROSOFT_CLIENT_ID y SECRET en .env. Usa la cuenta demo por ahora.',
                })
              }}
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path fill="#F25022" d="M1 1h10v10H1z"/>
                <path fill="#7FBA00" d="M13 1h10v10H13z"/>
                <path fill="#00A4EF" d="M1 13h10v10H1z"/>
                <path fill="#FFB900" d="M13 13h10v10H13z"/>
              </svg>
              Microsoft
            </Button>
          </div>
          <p className="text-center text-[10px] text-muted-foreground">
            OAuth está cableado en el código. Solo falta configurar credenciales reales en .env
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// User menu button shown in header when logged in
export function UserMenu({ onOpenAuth }: { onOpenAuth: () => void }) {
  const { data: session, status } = useSession()
  const { toast } = useToast()

  if (status === 'loading') {
    return (
      <Button variant="ghost" size="icon" className="h-9 w-9">
        <Loader2 className="h-4 w-4 animate-spin" />
      </Button>
    )
  }

  if (!session?.user) {
    return (
      <Button variant="default" size="sm" onClick={onOpenAuth} className="gap-1.5">
        <Sparkles className="h-3.5 w-3.5" />
        Entrar
      </Button>
    )
  }

  const initials = (session.user.name || session.user.email || '?')
    .split(' ')
    .map((s) => s[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2 rounded-full border border-border bg-card px-2 py-1">
        <div className="flex h-6 w-6 items-center justify-center rounded-full gradient-primary text-[10px] font-bold text-white">
          {initials}
        </div>
        <span className="hidden text-xs font-medium sm:inline">{session.user.name?.split(' ')[0]}</span>
        {session.user.role === 'ADMIN' && (
          <ShieldCheck className="h-3 w-3 text-primary" />
        )}
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9"
        onClick={async () => {
          await signOut({ redirect: false })
          toast({ title: 'Sesión cerrada' })
        }}
        title="Cerrar sesión"
      >
        <LogOut className="h-4 w-4" />
      </Button>
    </div>
  )
}
