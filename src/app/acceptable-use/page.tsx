import { LegalPage } from '@/components/legal/LegalPage'

export default function Page() {
  return (
    <LegalPage title="Política de uso aceptable" version="1.0" effectiveDate="2026-07-29">
      <p>Usa la plataforma con fines educativos. No subas información confidencial, personal ni regulada. No intentes acceder a datos de otros usuarios. No uses herramientas automatizadas para extraer contenido masivamente. No compartas tu cuenta ni credentialles. El incumplimiento puede resultar en suspensión de cuenta.</p>
      <p className="mt-4 text-xs text-muted-foreground">Este documento es informativo. Para cuestiones formales, consulta con un profesional cualificado.</p>
    </LegalPage>
  )
}
