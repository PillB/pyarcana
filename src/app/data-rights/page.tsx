import { LegalPage } from '@/components/legal/LegalPage'

export default function Page() {
  return (
    <LegalPage title="Derechos sobre tu cuenta y datos" version="1.0" effectiveDate="2026-07-29">
      <p>Tienes derecho a: acceder a tus datos, exportarlos, corregirlos, eliminarlos y retirar consentimiento para el procesamiento. Para ejercer estos derechos, usa las funciones de la aplicación o contacta a security@pyarcana.dev. Respondemos en un plazo razonable según la normativa aplicable.</p>
      <p className="mt-4 text-xs text-muted-foreground">Este documento es informativo. Para cuestiones formales, consulta con un profesional cualificado.</p>
    </LegalPage>
  )
}
