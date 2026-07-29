import { LegalPage } from '@/components/legal/LegalPage'

export default function Page() {
  return (
    <LegalPage title="Aviso sobre recursos externos" version="1.0" effectiveDate="2026-07-29">
      <p>PyArcana enlaza recursos externos (documentación, cursos, herramientas). No controlamos su disponibilidad, contenido, privacidad, accesibilidad ni costo. La inclusión de un recurso no constituye respaldo ni asociación. Verifica los detalles actuales antes de registrarte o pagar en sitios externos. Los proveedores externos pueden cambiar o retirar contenido en cualquier momento.</p>
      <p className="mt-4 text-xs text-muted-foreground">Este documento es informativo. Para cuestiones formales, consulta con un profesional cualificado.</p>
    </LegalPage>
  )
}
