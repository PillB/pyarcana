import Link from 'next/link'
import { LegalSection, LegalParagraph, LegalList, LegalCallout } from '@/components/legal/LegalAtoms'
import { ThirdPartyClaim } from '@/components/account/ThirdPartyClaim'

const LINK = 'font-medium underline-offset-2 hover:underline'
const PRIVACY_EMAIL = 'privacy@pyarcana.dev'

/**
 * Privacy notice of the public edition on GitHub Pages (build stage off, D4 audit 4 Oct 2026). This
 * edition has no accounts and no server of ours: progress stays in the browser. The account
 * edition at pyarcana.dev has its own notice (AccountEditionPrivacy).
 */
export function PagesEditionPrivacy() {
  return (
    <>
      <LegalCallout title="Resumen rápido">
        Esta edición del curso no tiene cuentas. Tu progreso se guarda solo en tu navegador y no
        llega a ningún servidor nuestro.{' '}
        <ThirdPartyClaim kind="ads">No vendemos ni compartimos tus datos.</ThirdPartyClaim>
      </LegalCallout>

      <LegalSection title="1. Qué datos se guardan y dónde">
        <LegalParagraph>
          Tu navegador guarda tu avance en su almacenamiento local (localStorage), un espacio que
          pertenece a este sitio dentro de tu propio equipo. Ahí quedan las secciones completadas,
          tus intentos de quiz y tus preferencias de idioma y tema.
        </LegalParagraph>
        <LegalParagraph>
          Nada de eso se envía a un servidor nuestro: en esta edición no tenemos ninguno. Si borras
          los datos del sitio en tu navegador, tu progreso se pierde. No pedimos tu nombre, correo,
          DNI, teléfono ni datos de pago.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="2. Servicios que reciben tu dirección IP">
        <LegalParagraph>
          Cargar una página web siempre revela tu dirección IP al servidor que la entrega. En esta
          edición, eso ocurre con dos servicios de Estados Unidos:
        </LegalParagraph>
        <LegalList
          items={[
            <><strong>GitHub Pages</strong> (GitHub, Inc.) entrega las páginas del curso. GitHub puede registrar tu dirección IP para su propia seguridad; nosotros no recibimos esos registros.</>,
            <><strong>jsDelivr</strong>, una red de distribución de archivos, entrega Pyodide, el programa que ejecuta Python en tu navegador. Solo se descarga cuando ejecutas código.</>,
          ]}
        />
        <LegalParagraph>
          Ninguno de los dos recibe tu progreso. Lee el{' '}
          <Link href="/cookies" className={LINK}>Aviso de cookies y almacenamiento local</Link>{' '}
          para ver qué guarda tu navegador.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="3. Tus derechos">
        <LegalParagraph>
          La Ley N° 29733, Ley de Protección de Datos Personales del Perú, te da los derechos de
          acceso, rectificación, cancelación y oposición (derechos ARCO). En esta edición, tus datos
          están solo en tu navegador, así que tú los controlas: puedes verlos o borrarlos desde la
          configuración del navegador.
        </LegalParagraph>
        <LegalParagraph>
          Si tienes una duda sobre privacidad, escribe a{' '}
          <a href={`mailto:${PRIVACY_EMAIL}`} className={LINK}>{PRIVACY_EMAIL}</a>.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="4. La edición con cuenta">
        <LegalParagraph>
          En pyarcana.dev existe una edición con cuenta, que guarda una copia de tu progreso en
          nuestros servidores. Esa edición tiene su propio aviso de privacidad, en la misma
          dirección /privacy de ese sitio.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="5. Cambios a este aviso">
        <LegalParagraph>
          Si cambiamos este aviso, publicaremos la nueva versión en esta misma página, con un
          número de versión mayor y la fecha desde la que rige.
        </LegalParagraph>
      </LegalSection>
    </>
  )
}
