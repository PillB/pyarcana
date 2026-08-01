import { LegalPage } from '@/components/legal/LegalPage'

export default function Page() {
  return (
    <LegalPage title="Derechos sobre tu cuenta y datos" version="1.1" effectiveDate="2026-08-01">
      <p>Tienes derecho a: acceder a tus datos, exportarlos, corregirlos, eliminarlos y retirar consentimiento para el procesamiento. Para ejercer estos derechos, usa las funciones de la aplicación o contacta a:</p>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
        <li><a href="mailto:privacy@pyarcana.dev" className="font-medium underline-offset-2 hover:underline">privacy@pyarcana.dev</a> — para solicitudes de privacidad y derechos ARCO (acceso, rectificación, cancelación, oposición)</li>
        <li><a href="mailto:security@pyarcana.dev" className="font-medium underline-offset-2 hover:underline">security@pyarcana.dev</a> — para reportes de seguridad y vulnerabilidades</li>
      </ul>
      <p className="mt-2">Respondemos en un plazo razonable según la normativa aplicable, incluyendo la Ley N° 29733 de Protección de Datos Personales del Perú y el Reglamento General de Protección de Datos (GDPR) de la Unión Europea.</p>
      <p className="mt-4 text-xs text-muted-foreground">Este documento es informativo. Para cuestiones formales, consulta con un profesional cualificado.</p>
    </LegalPage>
  )
}
