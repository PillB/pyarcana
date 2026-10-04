import Link from 'next/link'
import { LegalSection, LegalParagraph, LegalList, LegalCallout } from '@/components/legal/LegalAtoms'
import { ThirdPartyClaim } from '@/components/account/ThirdPartyClaim'
import { CLOUD_CONFIG, type CloudConfig } from '@/lib/cloud/config'
import { controllerOf } from '@/lib/cloud/legal-content'
import { ARCO_DAYS, BREACH_AUTHORITY_HOURS, RETENTION_DAYS, SESSION_IDLE_DAYS, SESSION_MAX_DAYS } from '@/lib/legal/retention-facts'

const LINK = 'font-medium underline-offset-2 hover:underline'
const PRIVACY_EMAIL = 'privacy@pyarcana.dev'
const years = (days: number) => (days % 365 === 0 ? `${days / 365} ${days === 365 ? 'año' : 'años'}` : `${days} días`)

function Mail() {
  return <a href={`mailto:${PRIVACY_EMAIL}`} className={LINK}>{PRIVACY_EMAIL}</a>
}

/** Who answers for the data (Ley 29733 art. 18): the named holder, or that it is being formed. */
function Controller({ cfg }: { cfg: CloudConfig }) {
  const holder = controllerOf(cfg)
  if (holder?.address) {
    return (
      <LegalParagraph>
        El responsable de tus datos es <strong>{holder.name}</strong>, con domicilio en {holder.address}
        {holder.ruc ? ` y Registro Único de Contribuyentes (RUC) ${holder.ruc}` : ''}. Decide para qué
        se usan y cómo se protegen. Puedes escribirle a <Mail />.
      </LegalParagraph>
    )
  }
  return (
    <>
      <LegalParagraph>
        El responsable de tus datos será la empresa que estamos constituyendo para operar PyArcana.
        Su nombre y su domicilio aparecerán aquí en cuanto termine su inscripción. Hasta entonces,
        no abrimos cuentas nuevas al público.
      </LegalParagraph>
      <LegalParagraph>
        Para cualquier asunto de privacidad, escribe a <Mail />.
      </LegalParagraph>
    </>
  )
}

function Registry({ cfg }: { cfg: CloudConfig }) {
  const number = cfg.legal.rnpd.trim()
  return (
    <LegalParagraph>
      El banco de datos de las cuentas se inscribe en el Registro Nacional de Protección de Datos
      Personales (RNPD), que lleva la Autoridad Nacional de Protección de Datos Personales (ANPD).{' '}
      {number ? <>Número de inscripción: <strong>{number}</strong>.</> : <>Estado: <strong>inscripción en trámite</strong>.</>}
    </LegalParagraph>
  )
}

const R = RETENTION_DAYS

const DATA_ITEMS = [
  <><strong>Tu correo, tu nombre y el identificador de tu cuenta de Google o Microsoft.</strong> Los usamos para reconocerte cuando entras. Se guardan mientras tengas la cuenta.</>,
  <><strong>Tu progreso</strong>: secciones y pasos completados, notas de quiz y marcadores. Los usamos para mostrártelo y para que sigas en otro dispositivo. Se guardan mientras tengas la cuenta.</>,
  <><strong>Tus inicios de sesión</strong>: con qué método entraste y cuándo empezó, se renovó, se cerró o venció cada sesión. No guardamos tu dirección IP. Sirven para la seguridad de tu cuenta y se borran {years(R.signinRecords)} después de que la sesión vence.</>,
  <><strong>Tus consentimientos</strong>: qué respondiste sobre la medición anónima, con qué versión del texto y cuándo. Sirven para demostrar lo que aceptaste. Se guardan mientras tengas la cuenta.</>,
  <><strong>Los reportes de errores que nos envías</strong>: tu texto, la página donde estabas, tu navegador y, si la añades, una captura. Sirven para corregir el error. La captura se borra {R.screenshotClosed} días después de cerrar el reporte, o {R.screenshotMax} días después de enviarlo. El texto se borra {years(R.reportClosed)} después de cerrar el reporte, o {years(R.reportMax)} después de enviarlo, lo que ocurra antes.</>,
  <><strong>Si eres tester del curso</strong>: un resumen de cada sesión de prueba (tiempo activo, secciones revisadas, cuántas incidencias creaste y enviaste, tu alias, el navegador y la versión publicada). Sirve para organizar las pruebas. Se borra {years(R.qaSessions)} después de la última actividad de la sesión.</>,
  <><strong>La medición anónima</strong>, solo si la aceptas: un identificador al azar y eventos como «sección completada», para mejorar el curso. Se borra a los {R.measurement} días.</>,
  <><strong>Tus respuestas a encuestas</strong>, si las contestas. Se borran a los {years(R.surveys)}.</>,
  <><strong>Un registro de auditoría</strong> de los cambios en tu cuenta y de las acciones de administración, sin el contenido de tus datos. Sirve para la seguridad del servicio y se borra a los {years(R.audit)}.</>,
]

/**
 * Privacy notice of the account edition at pyarcana.dev (build stage on; D4 audit 4 Oct 2026). It is
 * prerendered, so a reader without JavaScript sees it whole; the CloudLegalSection after it adds
 * the browser-key list and the processor table. Every period comes from retention-facts.ts, which a
 * test ties to the worker's sweep.
 */
export function AccountEditionPrivacy({ cfg = CLOUD_CONFIG }: { cfg?: CloudConfig }) {
  return (
    <>
      <LegalCallout title="Resumen rápido">
        Tu progreso se guarda en tu navegador. Si entras con Google o Microsoft, también guardamos tu
        correo y una copia de tu progreso en nuestros servidores, para que sigas en otro dispositivo.{' '}
        <ThirdPartyClaim kind="ads" cfg={cfg}>No vendemos ni compartimos tus datos.</ThirdPartyClaim> Puedes
        descargarlos o borrarlos cuando quieras desde tu cuenta.
      </LegalCallout>

      <LegalSection title="1. Quién responde por tus datos">
        <Controller cfg={cfg} />
        <Registry cfg={cfg} />
        <LegalParagraph>
          Este aviso cumple la Ley N° 29733, Ley de Protección de Datos Personales, y su reglamento,
          aprobado por el Decreto Supremo N° 016-2024-JUS.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="2. Qué datos guardamos, para qué y por cuánto tiempo">
        <LegalParagraph>
          Sin cuenta, tu progreso queda solo en tu navegador. Con cuenta, guardamos esto:
        </LegalParagraph>
        <LegalList items={DATA_ITEMS} />
        <LegalParagraph>
          Hoy no cobramos, así que no guardamos datos de pago. Antes de abrir los pagos, este aviso
          dirá qué datos de pago guardamos y por cuánto tiempo. No pedimos DNI, teléfono, dirección
          ni datos de tarjeta.
        </LegalParagraph>
        <LegalParagraph>
          Podemos eliminar las cuentas sin inicios de sesión durante {years(R.inactiveMay)}. Si
          eliminas tu cuenta, borramos al instante tu correo, tu progreso, tus sesiones y tus
          consentimientos. Tus reportes de errores y el registro de auditoría se quedan sin tu correo
          hasta cumplir el plazo indicado arriba.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="3. Quién más trata tus datos, y en qué país">
        <LegalParagraph>
          Estos proveedores tratan datos por encargo nuestro, solo para lo que se indica:
        </LegalParagraph>
        <LegalList
          items={[
            <><strong>Cloudflare</strong> (Estados Unidos): aloja el sitio, el servidor de cuentas y la base de datos.</>,
            <><strong>Google</strong> y <strong>Microsoft</strong> (Estados Unidos): solo para entrar. Confirman quién eres y nos dan tu correo y tu nombre.</>,
            <><strong>Hostinger</strong>: aloja nuestro correo. Recibe los mensajes que nos escribes.</>,
            <><strong>jsDelivr</strong>: entrega Pyodide, el programa que ejecuta Python en tu navegador. Recibe tu dirección IP, como cualquier servidor web, pero no tus datos del curso.</>,
          ]}
        />
        <LegalParagraph>
          Por eso tus datos salen del Perú, sobre todo hacia Estados Unidos. A eso la ley lo llama
          transferencia internacional de datos. Solo enviamos lo que cada proveedor necesita para
          prestar el servicio que pides.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="4. Tus derechos (ARCO) y cómo usarlos">
        <LegalParagraph>
          Tienes derecho a saber qué datos tenemos (acceso), a corregirlos (rectificación), a que los
          borremos (cancelación) y a que dejemos de usarlos para algo (oposición). Esos son los
          derechos ARCO. También puedes llevarte tus datos en un archivo.
        </LegalParagraph>
        <LegalList
          items={[
            <><strong>Desde tu cuenta:</strong> en <Link href="/data-rights" className={LINK}>Derechos sobre tus datos</Link> puedes descargar todos tus datos y eliminar tu cuenta, sin escribirnos.</>,
            <><strong>Por correo:</strong> escribe a <Mail /> y di qué derecho quieres usar.</>,
            <><strong>Plazos:</strong> respondemos una solicitud de acceso en un máximo de {ARCO_DAYS.access} días hábiles, y las demás en un máximo de {ARCO_DAYS.other} días hábiles.</>,
          ]}
        />
        <LegalParagraph>
          Si no estás conforme con nuestra respuesta, puedes reclamar ante la ANPD.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="5. Si tienes menos de 18 años">
        <LegalParagraph>
          Para crear una cuenta necesitas tener 14 años o más. Desde los 14 años puedes aceptar este
          aviso tú mismo, sin pedir permiso a tus padres. Por eso lo escribimos en palabras simples.
        </LegalParagraph>
        <LegalParagraph>
          Si tienes menos de 14 años, no puedes crear una cuenta: al entrar te pedimos confirmar tu
          edad. Sí puedes usar todo el curso sin cuenta, y tu progreso se quedará en tu navegador. Si
          sabemos que una cuenta es de alguien menor de 14 años, la eliminamos.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="6. Seguridad y avisos de incidentes">
        <LegalParagraph>
          Todo el sitio usa conexión cifrada (HTTPS). No guardamos contraseñas: entras con Google o
          Microsoft. Tu sesión vive en una cookie que el código de la página no puede leer. Dura {SESSION_IDLE_DAYS}{' '}
          días sin uso y {SESSION_MAX_DAYS} días como máximo.
        </LegalParagraph>
        <LegalParagraph>
          Si una brecha de seguridad afecta tus datos personales, avisaremos a la ANPD dentro de las{' '}
          {BREACH_AUTHORITY_HOURS} horas desde que la conozcamos. A las personas afectadas les
          avisaremos sin demora indebida. Si encuentras una vulnerabilidad, lee el{' '}
          <Link href="/security" className={LINK}>Aviso de Seguridad</Link>.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="7. Cambios a este aviso">
        <LegalParagraph>
          Si cambiamos este aviso, publicaremos la nueva versión en esta misma página, con un número
          de versión mayor y la fecha desde la que rige. Si el cambio afecta lo que aceptaste al
          crear tu cuenta, te lo pediremos de nuevo al entrar.
        </LegalParagraph>
      </LegalSection>
    </>
  )
}
