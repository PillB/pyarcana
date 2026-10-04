import { LegalPage } from '@/components/legal/LegalPage'
import { CloudLegalSection } from '@/components/account/CloudLegalSection'
import { ARCO_DAYS } from '@/lib/legal/retention-facts'

export default function Page() {
  return (
    <LegalPage title="Derechos sobre tu cuenta y datos" version="1.2" effectiveDate="2026-10-05">
      <p>Tienes derecho a: acceder a tus datos, exportarlos, corregirlos, eliminarlos y retirar consentimiento para el procesamiento. Para ejercer estos derechos, usa las funciones de la aplicación o contacta a:</p>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
        <li><a href="mailto:privacy@pyarcana.dev" className="font-medium underline-offset-2 hover:underline">privacy@pyarcana.dev</a> — para solicitudes de privacidad y derechos ARCO (acceso, rectificación, cancelación, oposición)</li>
        <li><a href="mailto:security@pyarcana.dev" className="font-medium underline-offset-2 hover:underline">security@pyarcana.dev</a> — para reportes de seguridad y vulnerabilidades</li>
      </ul>
      <p className="mt-2">Respondemos una solicitud de acceso en un máximo de {ARCO_DAYS.access} días hábiles y las demás en un máximo de {ARCO_DAYS.other} días hábiles, como fijan la Ley N° 29733, Ley de Protección de Datos Personales del Perú, y su reglamento (Decreto Supremo N° 016-2024-JUS).</p>
      <CloudLegalSection kind="data-rights" />
      <p className="mt-4 text-xs text-muted-foreground">Este documento es informativo. Para cuestiones formales, consulta con un profesional cualificado.</p>
    </LegalPage>
  )
}
