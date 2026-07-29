import { LegalPage } from '@/components/legal/LegalPage'

export default function Page() {
  return (
    <LegalPage title="Contacto de seguridad" version="1.0" effectiveDate="2026-07-29">
      <p>Si encuentras una vulnerabilidad de seguridad, no la publiques públicamente. Repórtala a: security@pyarcana.dev. Agradecemos la divulgación responsable. Tomamos los reportes en serio y responderemos en un plazo razonable. Para temas legales, consulta nuestros Términos de Uso.</p>
      <p className="mt-4 text-xs text-muted-foreground">Este documento es informativo. Para cuestiones formales, consulta con un profesional cualificado.</p>
    </LegalPage>
  )
}
