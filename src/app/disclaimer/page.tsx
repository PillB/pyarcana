import { LegalPage } from '@/components/legal/LegalPage'

export default function DisclaimerPage() {
  return (
    <LegalPage title="Aviso educativo y profesional" version="1.0" effectiveDate="2026-07-29">
      <h2 className="text-lg font-semibold">Naturaleza educativa</h2>
      <p>PyArcana es material educativo. No constituye asesoría profesional, legal ni financiera. Los ejercicios y escenarios usan datos sintéticos (esto es, datos ficticios creados para enseñar conceptos) y no deben usarse en producción sin adaptación.</p>
      
      <h2 className="text-lg font-semibold">Sin garantía de empleo</h2>
      <p>Completar el curso no garantiza empleo, ascensos, admisión a programas académicos, aumento de salario ni resultados profesionales específicos. El aprendizaje real depende del tiempo, esfuerzo y práctica que dediques.</p>
      
      <h2 className="text-lg font-semibold">Las insignias no son certificaciones</h2>
      <p>Las insignias (badges) de PyArcana describen evidencia de ejercicios completados de forma independiente. No son equivalentes a certificaciones de Microsoft, AWS, Google, IBM, universidades ni ningún otro organismo externo. Una insignia demuestra que completaste ejercicios específicos; no demuestra competencia profesional verificada por un tercero.</p>
      
      <h2 className="text-lg font-semibold">No subas información sensible</h2>
      <p>No subas información confidencial, personal, regulada ni propiedad de tu empleador a los ejercicios. Los datos de los ejercicios son sintéticos y ficticios. Si usas datos propios, asegúrate de que no contengan información protegida.</p>
      
      <h2 className="text-lg font-semibold">Prácticas de seguridad</h2>
      <p>Las prácticas de seguridad mencionadas en el curso son puntos de partida, no auditorías completas. Para aplicaciones en producción, consulta con un especialista en seguridad. No nos hacemos responsables de vulnerabilidades en código escrito fuera de la plataforma.</p>
      
      <h2 className="text-lg font-semibold">Resultados externos</h2>
      <p>Los proveedores externos (cursos, certificaciones, herramientas) controlan sus propios precios, requisitos, políticas y credenciales. Verifica siempre la información actual antes de registrarte o pagar.</p>
    </LegalPage>
  )
}
