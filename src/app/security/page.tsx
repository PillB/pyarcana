import { LegalPage } from '@/components/legal/LegalPage'
import Link from 'next/link'

export default function Page() {
  return (
    <LegalPage title="Contacto de seguridad" version="1.0" effectiveDate="2026-07-29">
      <p>
        Si encuentras una vulnerabilidad de seguridad, no la publiques públicamente.
        Repórtala a:{' '}
        <a
          href="mailto:security@pyarcana.dev"
          className="font-medium text-foreground underline-offset-2 hover:underline"
        >
          security@pyarcana.dev
        </a>
        . Agradecemos la divulgación responsable. Tomamos los reportes en serio y
        responderemos en un plazo razonable.
      </p>
      <p className="mt-4">
        Para temas de privacidad o ejercicio de tus derechos ARCO, escribe a{' '}
        <a
          href="mailto:privacy@pyarcana.dev"
          className="font-medium text-foreground underline-offset-2 hover:underline"
        >
          privacy@pyarcana.dev
        </a>{' '}
        o consulta el{' '}
        <Link href="/data-rights" className="font-medium text-foreground underline-offset-2 hover:underline">
          Aviso de Derechos ARCO
        </Link>
        . Para temas legales, consulta nuestros{' '}
        <Link href="/terms" className="font-medium text-foreground underline-offset-2 hover:underline">
          Términos de Uso
        </Link>
        .
      </p>
      <p className="mt-4 text-xs text-muted-foreground">Este documento es informativo. Para cuestiones formales, consulta con un profesional cualificado.</p>
    </LegalPage>
  )
}
