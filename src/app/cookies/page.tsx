import { LegalPage } from '@/components/legal/LegalPage'

export default function CookiesPage() {
  return (
    <LegalPage title="Aviso de cookies y almacenamiento local" version="1.0" effectiveDate="2026-07-29">
      <h2 className="text-lg font-semibold">Almacenamiento local (localStorage)</h2>
      <p>PyArcana guarda tu progreso de aprendizaje en el almacenamiento local de tu navegador (localStorage). Esto incluye: secciones completadas, puntajes de quizzes, última sección visitada y fecha de inicio. Esta información permanece en tu dispositivo y no se envía a ningún servidor a menos que crees una cuenta.</p>
      
      <h2 className="text-lg font-semibold">Cookies de autenticación</h2>
      <p>Si creas una cuenta, usamos cookies o tokens de autenticación para mantener tu sesión activa. Estas cookies son necesarias para el funcionamiento del servicio y no se usan para publicidad ni seguimiento de terceros.</p>
      
      <h2 className="text-lg font-semibold">Cookies de preferencias</h2>
      <p>Guardamos tu preferencia de idioma (español/inglés) y tema (claro/oscuro) en localStorage. Estas preferencias no contienen información personal.</p>
      
      <h2 className="text-lg font-semibold">Sin cookies de terceros</h2>
      <p>No usamos Google Analytics, Facebook Pixel ni otras cookies de seguimiento de terceros. No vendemos ni compartimos datos de navegación.</p>
      
      <h2 className="text-lg font-semibold">Cómo limpiar tus datos</h2>
      <p>Puedes eliminar todos los datos almacenados por PyArcana en cualquier momento borrando el almacenamiento local de tu navegador o usando la función "Eliminar mi cuenta" si tienes una cuenta registrada.</p>
    </LegalPage>
  )
}
