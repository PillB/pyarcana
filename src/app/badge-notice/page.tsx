import { LegalPage } from '@/components/legal/LegalPage'

export default function BadgeNoticePage() {
  return (
    <LegalPage title="Aviso sobre insignias y credenciales" version="1.0" effectiveDate="2026-07-29">
      <h2 className="text-lg font-semibold">Marcador de finalización vs insignia de competencia</h2>
      <p>En el panel, «Hecho» indica que terminaste los pasos de una sección y «Siguiente» marca la sección que sigue. Nadie comprueba «Hecho» y esa etiqueta no mide tu dominio. Ningún estudiante recibe una insignia de competencia.</p>
      
      <h2 className="text-lg font-semibold">Progreso e identificadores mostrados hoy</h2>
      <p>En la edición pública, tu progreso se guarda en este navegador; no hay inicio de sesión ni servidor. Si inicias sesión en la edición con cuenta, tu progreso también se guarda en el servidor. Ninguna página muestra una insignia de competencia como obtenida. Cada página de capstone muestra con un icono de premio el identificador de la insignia a la que conduce, no una insignia obtenida.</p>
      
      <h2 className="text-lg font-semibold">Lo que afirmaría una insignia de competencia</h2>
      <p>Según el catálogo, una insignia de competencia afirma que demostraste la competencia de forma independiente. La demostración incluye una tarea práctica, pruebas ocultas y criterios críticos que no pueden compensarse, conforme a la especificación de evaluación de PyArcana.</p>
      
      <h2 className="text-lg font-semibold">Lo que una insignia NO prueba</h2>
      <p>Una insignia de PyArcana NO es equivalente a una certificación profesional regulada. No garantiza competencia en producción, no reemplaza la experiencia laboral, no equivale a un título universitario y no constituye una evaluación independiente por un tercero autorizado.</p>
      
      <h2 className="text-lg font-semibold">Versiones y cambios</h2>
      <p>Las insignias del catálogo tienen números de versión, como 1.0.0 y 1.1.0. No existe un procedimiento que marque una credencial emitida como perteneciente a una versión anterior.</p>
      
      <h2 className="text-lg font-semibold">Revocación</h2>
      <p>No existe un procedimiento que revoque una credencial emitida. Toda credencial emitida queda registrada como activa.</p>
    </LegalPage>
  )
}
