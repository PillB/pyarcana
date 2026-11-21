import { LegalPage } from '@/components/legal/LegalPage'

export default function BadgeNoticePage() {
  return (
    <LegalPage title="Aviso sobre insignias y credenciales" version="1.1" effectiveDate="2026-11-21">
      <h2 className="text-lg font-semibold">Marcador de progreso vs insignia de competencia</h2>
      <p>Un marcador de progreso indica que completaste las secciones: el You Do y un intento del examen de cada una, aunque hayas tenido guía. No prueba que dominas el tema. Una insignia de competencia (badge) requiere ejercicios independientes sin ver la solución, un puntaje mínimo en cada parte y las competencias críticas al 100%.</p>
      
      <h2 className="text-lg font-semibold">Vista previa local vs insignia verificada</h2>
      <p>Los marcadores de progreso se otorgan en tu navegador, en la edición pública (GitHub Pages) y en la edición con cuenta. En la edición pública, las insignias de competencia son solo una vista previa de tu elegibilidad: se calcula en tu navegador y no constituye una insignia verificada. Una insignia verificada requiere iniciar sesión. El servidor emite la insignia verificada cuando cada requisito está registrado. Hoy registra los exámenes; las demás partes todavía no, así que aún no se emiten insignias verificadas.</p>
      
      <h2 className="text-lg font-semibold">Lo que una insignia prueba</h2>
      <p>Un marcador de progreso prueba que completaste las secciones que pide. Una insignia de competencia prueba que completaste ejercicios independientes específicos, alcanzaste los puntajes mínimos de cada parte y pasaste las puertas críticas de competencia (esto es, criterios que no pueden compensarse con un promedio alto en otras áreas).</p>
      
      <h2 className="text-lg font-semibold">Lo que una insignia NO prueba</h2>
      <p>Una insignia de PyArcana NO es equivalente a una certificación profesional regulada. No garantiza competencia en producción, no reemplaza la experiencia laboral, no equivale a un título universitario y no constituye una evaluación independiente por un tercero autorizado.</p>
      
      <h2 className="text-lg font-semibold">Versiones y cambios</h2>
      <p>Las insignias tienen versión. Si los criterios cambian, las insignias emitidas bajo criterios anteriores conservan su validez, pero pueden marcarse como "versión anterior". Las nuevas versiones pueden requerir evidencia adicional. Algunas insignias están en piloto y lo dicen en su nombre: sus criterios pueden cambiar antes de que pasen a activas, y la versión de cada una dice con cuáles se otorgó.</p>

      <h2 className="text-lg font-semibold">Vigencia</h2>
      <p>Las insignias de competencia y los capstones vencen a los tres años; los marcadores de progreso no vencen.</p>
      
      <h2 className="text-lg font-semibold">Revocación</h2>
      <p>Una insignia puede revocarse si se descubre que la evidencia fue manipulada, si se encuentra que los criterios no se cumplieron genuinamente o si se identifica fraude. La revocación incluye un motivo registrado y auditable.</p>
    </LegalPage>
  )
}
