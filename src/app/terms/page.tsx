import { LegalPage } from '@/components/legal/LegalPage'

export default function TermsPage() {
  return (
    <LegalPage title="Términos de uso" version="1.0" effectiveDate="2026-07-29">
      <h2 className="text-lg font-semibold">1. Naturaleza del servicio</h2>
      <p>PyArcana es una plataforma educativa de aprendizaje de Python, análisis de datos, automatización, machine learning e IA responsable. El curso no otorga títulos académicos, certificaciones profesionales reguladas ni garantiza resultados laborales.</p>
      
      <h2 className="text-lg font-semibold">2. Uso aceptable</h2>
      <p>Te comprometes a usar la plataforma con fines educativos. No debes subir información confidencial, personal, regulada o propiedad de tu empleador a los ejercicios. Los escenarios usan datos sintéticos (esto es, datos ficticios creados para fines educativos).</p>
      
      <h2 className="text-lg font-semibold">3. Propiedad del código</h2>
      <p>El código que escribes en los ejercicios es tuyo. Los escenarios, enunciados y estructura del curso son propiedad de PyArcana y están protegidos por derechos de autor.</p>
      
      <h2 className="text-lg font-semibold">4. Sin garantía de resultados</h2>
      <p>Completar el curso no garantiza empleo, ascensos, admisión a programas académicos ni equivalencia con certificaciones externas. Las insignias (badges) describen evidencia demostrada en ejercicios independientes, no certificaciones profesionales.</p>
      
      <h2 className="text-lg font-semibold">5. Recursos externos</h2>
      <p>La plataforma enlaza recursos externos (documentación, cursos, herramientas). No controlamos su disponibilidad, contenido, privacidad ni costo. Verifica los detalles actuales antes de registrarte o pagar en sitios externos.</p>
      
      <h2 className="text-lg font-semibold">6. Cambios al servicio</h2>
      <p>Podemos actualizar el contenido, las funcionalidades y estos términos. Los cambios significativos se anunciarán en la plataforma. El uso continuado constituye aceptación de los términos actualizados.</p>
      
      <h2 className="text-lg font-semibold">7. Limitación de responsabilidad</h2>
      <p>El servicio se ofrece "tal cual". No nos hacemos responsables de decisiones tomadas con base en el contenido educativo, ni de daños derivados del uso de código de ejemplo en producción sin adaptación adecuada.</p>
      
      <h2 className="text-lg font-semibold">8. Contacto</h2>
      <p>Para preguntas sobre estos términos, contacta a: security@pyarcana.dev</p>
    </LegalPage>
  )
}
