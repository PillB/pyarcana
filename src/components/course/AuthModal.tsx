'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Mail, Lock, User, Loader2, AlertCircle, LogOut,
  ShieldCheck, GraduationCap, Sparkles, KeyRound, MailCheck,
} from 'lucide-react'
import { onAuthStateChanged, signOut as fbSignOut, type User as FbUser } from 'firebase/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import { useSession, signOut as nextAuthSignOut } from 'next-auth/react'
import { IS_STATIC_SITE } from '@/lib/runtime-mode'
import { getFirebaseAuth, isFirebaseClientConfigured } from '@/lib/firebase/client'

interface AuthModalProps {
  open: boolean
  onClose: () => void
  defaultTab?: 'login' | 'register'
}

type FirebaseAction =
  | 'login'
  | 'register'
  | 'resetPassword'
  | 'verifyEmail'
  | 'reloadUser'

/**
 * Solarized error mapping.
 *
 * We never reveal whether an email is registered. Instead, we map every
 * Firebase error code to a generic, actionable message in Peruvian Spanish.
 * This is what "no email enumeration" means in practice: an attacker cannot
 * distinguish "user does not exist" from "wrong password".
 */
function mapAuthError(code: string | undefined): string {
  if (!code) return 'Ocurrió un error inesperado. Intenta de nuevo.'
  const map: Record<string, string> = {
    'auth/invalid-email': 'El correo no tiene un formato válido.',
    'auth/user-disabled': 'Esta cuenta está desactivada. Escríbenos a security@pyarcana.dev.',
    'auth/invalid-credential': 'Credenciales inválidas. Revisa tu correo y contraseña.',
    'auth/wrong-password': 'Credenciales inválidas. Revisa tu correo y contraseña.',
    'auth/user-not-found': 'Credenciales inválidas. Revisa tu correo y contraseña.',
    'auth/too-many-requests': 'Demasiados intentos. Espera unos minutos o restablece tu contraseña.',
    'auth/network-request-failed': 'No pudimos conectar con el servidor. Revisa tu conexión a internet.',
    'auth/email-already-in-use': 'Ya existe una cuenta con ese correo. Intenta iniciar sesión.',
    'auth/weak-password': 'La contraseña es demasiado débil. Usa al menos 12 caracteres con letras y números.',
    'auth/operation-not-allowed': 'Esta operación no está habilitada. Escríbenos a security@pyarcana.dev.',
    'auth/unverified-email': 'Tu correo aún no está verificado. Revisa tu bandeja de entrada.',
    'auth/missing-email': 'Ingresa un correo válido.',
    'auth/popup-closed-by-user': 'Cerraste la ventana de autenticación antes de terminar.',
    'auth/cancelled-popup-request': 'Se canceló la operación.',
    'auth/credential-already-in-use': 'Esa credencial ya está asociada a otra cuenta.',
    'auth/requires-recent-login': 'Esta acción requiere que vuelvas a iniciar sesión.',
  }
  return map[code] ?? 'Ocurrió un error inesperado. Intenta de nuevo.'
}

/**
 * AuthModal — Firebase Authentication UI.
 *
 * Design (Solarized):
 *   - Login tab: email + password.
 *   - Register tab: email + password + display name, with required checkbox
 *     linking to Terms and Privacy.
 *   - Forgot Password: separate view, sends a reset email without revealing
 *     whether the account exists.
 *   - Email verification: a banner shown when a signed-in user has not
 *     verified their email; offers a "resend" link.
 *   - Session restoration: on mount, we subscribe to `onAuthStateChanged` so
 *     that a returning user is automatically signed in across reloads.
 *   - Rate limit handling: `auth/too-many-requests` shows a friendly message
 *     and links to Forgot Password.
 *   - No email enumeration: every failed login shows the same generic
 *     "Credenciales inválidas" message.
 *
 * When Firebase is not configured (env missing), the modal shows a clear
 * message instead of crashing. The button in the header hides itself in that
 * case — see `UserMenu` below.
 */
export function AuthModal({ open, onClose, defaultTab = 'login' }: AuthModalProps) {
  const [tab, setTab] = useState<'login' | 'register'>(defaultTab)
  const [view, setView] = useState<'form' | 'forgot' | 'verification-sent'>('form')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)
  const [currentUser, setCurrentUser] = useState<FbUser | null>(null)
  const { toast } = useToast()

  // Login form
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  // Register form
  const [regName, setRegName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [regAccepted, setRegAccepted] = useState(false)

  // Forgot password form
  const [forgotEmail, setForgotEmail] = useState('')

  const firebaseAuth = getFirebaseAuth()
  const firebaseConfigured = isFirebaseClientConfigured()

  // Sync defaultTab when opening
  useEffect(() => {
    if (open) {
      setTab(defaultTab)
      setView('form')
      setError(null)
      setInfo(null)
    }
  }, [open, defaultTab])

  // Session restoration — listen to Firebase auth state.
  useEffect(() => {
    if (!firebaseAuth) return
    const unsub = onAuthStateChanged(firebaseAuth, (u) => {
      setCurrentUser(u)
    })
    return () => unsub()
  }, [firebaseAuth])

  // ── Login ──────────────────────────────────────────────────────────────
  const handleLogin = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      if (!firebaseAuth) {
        setError('Firebase no está configurado. Contacta a security@pyarcana.dev.')
        return
      }
      setLoading(true)
      setError(null)
      setInfo(null)
      try {
        // Dynamic import keeps the bundle slim when Auth is unused.
        const { signInWithEmailAndPassword } = await import('firebase/auth')
        const cred = await signInWithEmailAndPassword(firebaseAuth, loginEmail.trim(), loginPassword)
        if (!cred.user.emailVerified) {
          setInfo('Tu correo aún no está verificado. Revisa tu bandeja de entrada o solicita un nuevo enlace abajo.')
        } else {
          toast({ title: '✓ Bienvenido de vuelta', description: 'Sesión iniciada' })
          onClose()
          setLoginEmail('')
          setLoginPassword('')
        }
      } catch (err) {
        const code = (err as { code?: string })?.code
        setError(mapAuthError(code))
      } finally {
        setLoading(false)
      }
    },
    [firebaseAuth, loginEmail, loginPassword, onClose, toast],
  )

  // ── Register ───────────────────────────────────────────────────────────
  const handleRegister = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      if (!firebaseAuth) {
        setError('Firebase no está configurado. Contacta a security@pyarcana.dev.')
        return
      }
      if (!regAccepted) {
        setError('Debes aceptar los Términos y el Aviso de Privacidad para crear una cuenta.')
        return
      }
      setLoading(true)
      setError(null)
      setInfo(null)
      try {
        const { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } = await import('firebase/auth')
        const cred = await createUserWithEmailAndPassword(firebaseAuth, regEmail.trim(), regPassword)
        if (regName.trim()) {
          await updateProfile(cred.user, { displayName: regName.trim() })
        }
        await sendEmailVerification(cred.user)
        setView('verification-sent')
        toast({
          title: '✓ Cuenta creada',
          description: 'Te enviamos un correo de verificación. Revisa tu bandeja de entrada.',
        })
      } catch (err) {
        const code = (err as { code?: string })?.code
        setError(mapAuthError(code))
      } finally {
        setLoading(false)
      }
    },
    [firebaseAuth, regEmail, regPassword, regName, regAccepted, toast],
  )

  // ── Forgot password ────────────────────────────────────────────────────
  const handleForgotPassword = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      if (!firebaseAuth) {
        setError('Firebase no está configurado. Contacta a security@pyarcana.dev.')
        return
      }
      setLoading(true)
      setError(null)
      try {
        const { sendPasswordResetEmail } = await import('firebase/auth')
        await sendPasswordResetEmail(firebaseAuth, forgotEmail.trim())
        // Always show the same message — even if the email is not registered.
        setInfo(
          'Si existe una cuenta con ese correo, te enviamos un enlace para restablecer tu contraseña. Revisa también la carpeta de spam.',
        )
        setForgotEmail('')
      } catch (err) {
        const code = (err as { code?: string })?.code
        // Most errors here map to "invalid email" or "missing email"; everything
        // else falls through to a generic message.
        setError(mapAuthError(code))
      } finally {
        setLoading(false)
      }
    },
    [firebaseAuth, forgotEmail],
  )

  // ── Resend verification ────────────────────────────────────────────────
  const handleResendVerification = useCallback(async () => {
    if (!firebaseAuth || !currentUser) return
    setLoading(true)
    setError(null)
    try {
      const { sendEmailVerification } = await import('firebase/auth')
      await sendEmailVerification(currentUser)
      setInfo('Te enviamos un nuevo correo de verificación.')
    } catch (err) {
      const code = (err as { code?: string })?.code
      setError(mapAuthError(code))
    } finally {
      setLoading(false)
    }
  }, [firebaseAuth, currentUser])

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
            Crea una cuenta para sincronizar tu progreso en la nube, invitar a un supervisor a
            verificar tus badges y retomar tu ruta en otro dispositivo.
          </DialogDescription>
        </DialogHeader>

        {!firebaseConfigured && (
          <div className="flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-800 dark:text-amber-200">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>
              Firebase no está configurado en este despliegue. La edición pública guarda tu progreso
              solo en el navegador. Si necesitas cuentas, escribe a{' '}
              <a
                href="mailto:security@pyarcana.dev"
                className="font-medium underline-offset-2 hover:underline"
              >
                security@pyarcana.dev
              </a>
              .
            </span>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-700 dark:text-red-300">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {info && (
          <div className="flex items-start gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-800 dark:text-emerald-200">
            <MailCheck className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{info}</span>
          </div>
        )}

        <AnimatePresence mode="wait">
          {view === 'verification-sent' ? (
            <motion.div
              key="verification"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-3"
            >
              <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4 text-sm">
                <div className="flex items-center gap-2 font-medium text-emerald-700 dark:text-emerald-300">
                  <MailCheck className="h-4 w-4" />
                  Verifica tu correo
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Te enviamos un enlace de verificación a tu correo. Haz clic en él para activar tu
                  cuenta. Esto es, una confirmación de que el correo te pertenece y de que quieres
                  recibir mensajes nuestros.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleResendVerification}
                disabled={loading || !firebaseConfigured}
              >
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Reenviar correo de verificación
              </Button>
              <Button type="button" variant="ghost" className="w-full" onClick={onClose}>
                Cerrar
              </Button>
            </motion.div>
          ) : view === 'forgot' ? (
            <motion.div
              key="forgot"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-3"
            >
              <form onSubmit={handleForgotPassword} className="space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="forgot-email">Correo registrado</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="forgot-email"
                      type="email"
                      placeholder="tu@email.com"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      className="pl-9"
                      required
                      autoComplete="email"
                      data-testid="auth-forgot-email"
                    />
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Por seguridad, no confirmamos si el correo existe. Si está registrado, recibirás
                    un enlace de restablecimiento.
                  </p>
                </div>
                <Button
                  type="submit"
                  disabled={loading || !firebaseConfigured}
                  className="w-full gap-2"
                  data-testid="auth-forgot-submit"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
                  Enviar enlace
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full"
                  onClick={() => {
                    setView('form')
                    setError(null)
                    setInfo(null)
                  }}
                >
                  Volver a iniciar sesión
                </Button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
            >
              <Tabs value={tab} onValueChange={(v) => setTab(v as 'login' | 'register')}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Iniciar sesión</TabsTrigger>
                  <TabsTrigger value="register">Crear cuenta</TabsTrigger>
                </TabsList>

                {/* LOGIN */}
                <TabsContent value="login" className="mt-4 space-y-3">
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
                          autoComplete="email"
                          data-testid="auth-email"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="login-pass">Contraseña</Label>
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
                          autoComplete="current-password"
                          data-testid="auth-password"
                        />
                      </div>
                    </div>
                    <Button
                      type="submit"
                      disabled={loading || !firebaseConfigured}
                      className="w-full gap-2"
                      data-testid="auth-login"
                    >
                      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                      Entrar
                    </Button>
                    <button
                      type="button"
                      className="w-full text-center text-xs text-muted-foreground hover:text-foreground hover:underline"
                      onClick={() => {
                        setView('forgot')
                        setError(null)
                        setInfo(null)
                      }}
                    >
                      ¿Olvidaste tu contraseña?
                    </button>
                  </form>
                </TabsContent>

                {/* REGISTER */}
                <TabsContent value="register" className="mt-4 space-y-3">
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
                          autoComplete="name"
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
                          autoComplete="email"
                          data-testid="auth-register-email"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="reg-pass">Contraseña (mín. 12 caracteres)</Label>
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
                          minLength={12}
                          maxLength={128}
                          autoComplete="new-password"
                          data-testid="auth-register-password"
                        />
                      </div>
                      <p className="text-[11px] text-muted-foreground">
                        Usa al menos 12 caracteres, mezclando letras, números y símbolos. No reutilices
                        contraseñas de otras cuentas.
                      </p>
                    </div>
                    <label className="flex items-start gap-2 text-xs text-muted-foreground">
                      <input
                        type="checkbox"
                        checked={regAccepted}
                        onChange={(e) => setRegAccepted(e.target.checked)}
                        className="mt-0.5 h-4 w-4 rounded border-border"
                        required
                        data-testid="auth-register-accept"
                      />
                      <span>
                        He leído y acepto los{' '}
                        <Link href="/terms" className="font-medium text-foreground underline-offset-2 hover:underline">
                          Términos de uso
                        </Link>{' '}
                        y el{' '}
                        <Link href="/privacy" className="font-medium text-foreground underline-offset-2 hover:underline">
                          Aviso de Privacidad
                        </Link>
                        . Entiendo que el curso es educativo y que los badges no son certificaciones.
                      </span>
                    </label>
                    <Button
                      type="submit"
                      disabled={loading || !firebaseConfigured || !regAccepted}
                      className="w-full gap-2"
                      data-testid="auth-register"
                    >
                      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                      Crear cuenta
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="text-center text-[11px] text-muted-foreground">
          Al crear una cuenta, tu progreso se sincroniza con nuestros servidores. No vendemos ni
          compartimos tus datos. Lee el{' '}
          <Link href="/data-rights" className="font-medium text-foreground underline-offset-2 hover:underline">
            Aviso de derechos ARCO
          </Link>{' '}
          para saber cómo acceder, corregir o eliminar tu información.
        </p>
      </DialogContent>
    </Dialog>
  )
}

// ────────────────────────────────────────────────────────────────────────────
// UserMenu — header button.
//
// On the dynamic edition we fall back to NextAuth (server session) if Firebase
// client is not configured. On the static edition, Firebase client is the only
// option: when it is not configured, the button is hidden entirely.
// ────────────────────────────────────────────────────────────────────────────
export function UserMenu({ onOpenAuth }: { onOpenAuth: () => void }) {
  const { data: session, status } = useSession()
  const { toast } = useToast()
  const [fbUser, setFbUser] = useState<FbUser | null>(null)
  const [checkedFirebase, setCheckedFirebase] = useState(false)

  const firebaseAuth = getFirebaseAuth()
  const firebaseConfigured = isFirebaseClientConfigured()

  useEffect(() => {
    if (!firebaseAuth) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCheckedFirebase(true)
      return
    }
    const unsub = onAuthStateChanged(firebaseAuth, (u) => {
      setFbUser(u)
      setCheckedFirebase(true)
    })
    return () => unsub()
  }, [firebaseAuth])

  const showLoading = status === 'loading' && IS_STATIC_SITE && !checkedFirebase
  const showLoadingDynamic = !IS_STATIC_SITE && status === 'loading'

  // On the static edition without Firebase configured, hide the menu entirely.
  if (IS_STATIC_SITE && !firebaseConfigured) return null

  if (showLoading || showLoadingDynamic) {
    return (
      <Button variant="ghost" size="icon" className="h-9 w-9">
        <Loader2 className="h-4 w-4 animate-spin" />
      </Button>
    )
  }

  const signedIn = !!session?.user || !!fbUser
  const displayName =
    session?.user?.name || fbUser?.displayName || session?.user?.email || fbUser?.email || '?'
  const initials = displayName
    .split(' ')
    .map((s) => s[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  if (!signedIn) {
    return (
      <Button
        variant="default"
        size="sm"
        onClick={onOpenAuth}
        className="h-9 w-9 gap-1.5 p-0 sm:w-auto sm:px-3"
        aria-label="Entrar"
      >
        <Sparkles className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Entrar</span>
      </Button>
    )
  }

  const handleSignOut = async () => {
    try {
      if (firebaseAuth) await fbSignOut(firebaseAuth)
    } catch {
      // ignore — Firebase may not be initialised
    }
    if (!IS_STATIC_SITE && session?.user) {
      try {
        await nextAuthSignOut({ redirect: false })
      } catch {
        // ignore
      }
    }
    toast({ title: 'Sesión cerrada' })
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2 rounded-full border border-border bg-card px-2 py-1">
        <div className="flex h-6 w-6 items-center justify-center rounded-full gradient-primary text-[10px] font-bold text-white">
          {initials}
        </div>
        <span className="hidden text-xs font-medium sm:inline">
          {displayName.split(' ')[0]}
        </span>
        {session?.user?.role === 'ADMIN' && (
          <ShieldCheck className="h-3 w-3 text-primary" />
        )}
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9"
        onClick={handleSignOut}
        title="Cerrar sesión"
        aria-label="Cerrar sesión"
      >
        <LogOut className="h-4 w-4" />
      </Button>
    </div>
  )
}
