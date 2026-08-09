import { LegalPage } from '@/components/legal/LegalPage'

export default function BadgeNoticePage() {
  return (
    <LegalPage title="Aviso sobre insignias y credenciales" version="1.0" effectiveDate="2026-07-29">
      <h2 className="text-lg font-semibold">Marcador de finalización vs insignia de competencia</h2>
      <p>Un marcador de finalización indica que viste o completaste una sección. No prueba que dominas el tema. Una insignia de competencia (badge) requiere completar ejercicios independientes sin ver la solución, alcanzar un puntaje mínimo y cumplir criterios específicos.</p>
      
      <h2 className="text-lg font-semibold">Vista previa local vs insignia verificada</h2>
      <p>En la edición pública (GitHub Pages), puedes ver una vista previa de tu elegibilidad para insignias. Esta vista previa se calcula en tu navegador y no constituye una insignia verificada. Una insignia verificada requiere autenticación (inicio de sesión) y evaluación en el servidor.</p>
      
      <h2 className="text-lg font-semibold">Lo que una insignia prueba</h2>
      <p>Una insignia de PyArcana prueba que completaste ejercicios independientes específicos, alcanzaste los puntajes mínimos establecidos y pasaste las puertas críticas de competencia (esto es, criterios que no pueden compensarse con un promedio alto en otras áreas).</p>
      
      <h2 className="text-lg font-semibold">Lo que una insignia NO prueba</h2>
      <p>Una insignia de PyArcana NO es equivalente a una certificación profesional regulada. No garantiza competencia en producción, no reemplaza la experiencia laboral, no equivale a un título universitario y no constituye una evaluación independiente por un tercero autorizado.</p>
      
      <h2 className="text-lg font-semibold">Versiones y cambios</h2>
      <p>Las insignias tienen versión. Si los criterios cambian, las insignias emitidas bajo criterios anteriores conservan su validez, pero pueden marcarse como "versión anterior". Las nuevas versiones pueden requerir evidencia adicional.</p>
      
      <h2 className="text-lg font-semibold">Revocación</h2>
      <p>Una insignia puede revocarse si se descubre que la evidencia fue manipulada, si se encuentra que los criterios no se cumplieron genuinamente o si se identifica fraude. La revocación incluye un motivo registrado y auditable.</p>
    </LegalPage>
  )
}
