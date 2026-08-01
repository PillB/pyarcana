import type { Metadata } from 'next'
import { LegalPageShell } from '@/components/legal/LegalPageShell'
import { LegalSection, LegalParagraph, LegalList, LegalCallout } from '@/components/legal/LegalAtoms'

export const metadata: Metadata = {
  title: 'Aviso de Privacidad · PyArcana',
  description:
    'Qué datos recopilamos, dónde los guardamos, quién puede verlos y cómo ejercer tus derechos ARCO. Edición pública y edición con cuenta.',
}

const META = {
  slug: 'privacy',
  title: 'Aviso de Privacidad',
  subtitle:
    'Qué datos guardamos, dónde viven y quién puede verlos. En lenguaje claro, sin jerga legal sin explicar.',
  version: '1.0.0',
  effectiveDate: '2025-07-29',
  englishSummary:
    'We store only the data needed to operate the course: progress, quiz scores, and (when you sign in) the email used to identify your account. We do not sell or share your data. You can delete it at any time.',
}

export default function PrivacyPage() {
  return (
    <LegalPageShell meta={META}>
      <LegalCallout title="Resumen rápido">
        En la edición pública (GitHub Pages) guardamos tu progreso solo en tu navegador. Si creas
        una cuenta, además guardamos tu correo y tu progreso en nuestros servidores para
        sincronizar entre dispositivos. No vendemos ni compartimos tus datos. Esto es, ninguno de
        los dos modos comparte tu información con terceros para publicidad.
      </LegalCallout>

      <LegalSection title="1. Datos que tratamos">
        <LegalParagraph>
          PyArcana es un curso educativo. Tratamos los siguientes datos personales, según el modo
          en que uses la plataforma:
        </LegalParagraph>
        <LegalList
          items={[
            <><strong>Edición pública (sin cuenta):</strong> solo datos en tu navegador (localStorage — esto es, una base de datos interna del navegador que tú controlas). Incluyen: secciones completadas, intentos de quiz, badges en vista previa y preferencias de idioma y tema.</>,
            <><strong>Edición con cuenta:</strong> además de lo anterior, en nuestros servidores guardamos: correo electrónico, nombre (si lo das), progreso por sección, intentos de examen y de ejercicio, y badges verificados.</>,
            <><strong>Datos de uso anónimos:</strong> si la edición dinámica tiene analytics habilitado, registramos páginas visitadas y eventos de clic, sin asociarlos a tu correo. Puedes desactivarlos con cualquier bloqueador de scripts.</>,
            <><strong>Datos que NO pedimos:</strong> no solicitamos DNI, dirección postal, teléfono, tarjeta de crédito ni datos biométricos.</>,
          ]}
        />
      </LegalSection>

      <LegalSection title="2. Dónde se almacenan">
        <LegalParagraph>
          Tus datos viven en dos lugares posibles, según el modo:
        </LegalParagraph>
        <LegalList
          items={[
            <><strong>En tu navegador:</strong> cuando usas la edición pública o cuando no has iniciado sesión. Persisten hasta que borres los datos del sitio. Esto es, no hay copia en el servidor.</>,
            <><strong>En nuestros servidores:</strong> cuando creas una cuenta. Usamos Firebase (Google Cloud) y una base de datos PostgreSQL alojada en el proveedor de hosting del proyecto. Las reglas de acceso están en <code>firestore.rules</code> y niegan por defecto cualquier lectura que no sea tuya o de un supervisor de tu cohorte.</>,
          ]}
        />
      </LegalSection>

      <LegalSection title="3. Quién puede verlos">
        <LegalList
          items={[
            <><strong>Tú:</strong> siempre. Puedes ver tu progreso en el dashboard y en los reportes.</>,
            <><strong>Supervisores de tu cohorte:</strong> si te unes a un cohorte (un grupo dirigido por una persona que actúa como supervisor), esa persona puede ver tu progreso y tus intentos de examen con el único fin de darte feedback. No puede editar tus entregas.</>,
            <><strong>El equipo de PyArcana:</strong> solo para operación técnica (resolver incidencias, prevenir fraude) y nunca para vender o compartir tu información.</>,
            <><strong>Proveedores de infraestructura:</strong> Firebase (Google Cloud) y el proveedor de hosting acceden a los servidores físicos, pero contractualmente no pueden usar tus datos para otros fines.</>,
          ]}
        />
      </LegalSection>

      <LegalSection title="4. Finalidad del tratamiento">
        <LegalParagraph>
          Usamos tus datos exclusivamente para: (a) mostrarte tu progreso; (b) sincronizarlo entre
          dispositivos cuando tienes cuenta; (c) permitir que un supervisor verifique tus badges
          si así lo decides; (d) prevenir fraude o abuso del servicio; (e) cumplir obligaciones
          legales si nos lo exige una autoridad competente.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="5. Base legal">
        <LegalParagraph>
          Cuando usas la edición pública, el tratamiento se basa en tu consentimiento implícito al
          usar la plataforma (los datos viven en tu navegador y tú puedes borrarlos en cualquier
          momento). Cuando creas una cuenta, la base legal es la ejecución de un contrato de
          prestación de servicios educativos gratuitos. Para datos analíticos anónimos, la base
          legal es nuestro interés legítimo en mejorar el servicio.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="6. Transferencias internacionales">
        <LegalParagraph>
          Firebase y el proveedor de hosting pueden procesar datos en Estados Unidos o en la Unión
          Europea. Trabajamos con proveedores que cumplen con el Reglamento General de Protección
          de Datos (GDPR) de la Unión Europea y, cuando aplica, con el Marco de Privacidad de
          EE. UU. – UE. Esto es, hay cláusulas contractuales que obligan a esos proveedores a
          proteger tus datos con el mismo estándar europeo.
        </LegalParagraph>
        <LegalParagraph>
          En Perú, el tratamiento de datos personales se rige por la Ley N° 29733 — Ley de
          Protección de Datos Personales y su reglamento (Decreto Supremo 003-2013-JUS). PyArcana
          cumple con esta norma: recopila solo datos necesarios, obtiene consentimiento, permite
          el ejercicio de derechos ARCO (acceso, rectificación, cancelación y oposición) y
          registra las transferencias internacionales de datos. La autoridad competente es la
          Autoridad Nacional de Protección de Datos Personales (ANPDP), adscrita al Ministerio de
          Justicia y Derechos Humanos del Perú.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="7. Tus derechos (ARCO)">
        <LegalParagraph>
          Como titular de los datos, puedes ejercer en cualquier momento los derechos de:
        </LegalParagraph>
        <LegalList
          items={[
            <><strong>Acceso:</strong> saber qué datos tenemos sobre ti.</>,
            <><strong>Rectificación:</strong> corregir datos inexactos (por ejemplo, tu nombre).</>,
            <><strong>Cancelación (supresión):</strong> solicitar que borremos tu cuenta y tus datos asociados.</>,
            <><strong>Oposición:</strong> pedir que dejemos de tratar tus datos para ciertas finalidades.</>,
            <><strong>Portabilidad:</strong> recibir tus datos en un formato estructurado (JSON) para llevártelos a otra plataforma.</>,
          ]}
        />
        <LegalParagraph>
          Para ejercerlos, escribe a <a href="mailto:privacy@pyarcana.dev" className="font-medium underline-offset-2 hover:underline">privacy@pyarcana.dev</a>{' '}
          indicando el derecho que quieres ejercer. Responderemos en un máximo de 30 días
          hábiles. Lee el{' '}
          <a href="/data-rights" className="font-medium underline-offset-2 hover:underline">Aviso de Derechos ARCO</a>{' '}
          para el procedimiento detallado.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="8. Seguridad">
        <LegalParagraph>
          Aplicamos medidas técnicas y organizativas razonables: cifrado en tránsito (HTTPS),
          cifrado en reposo en Firestore, reglas de acceso que niegan por defecto, contraseñas
          almacenadas con hash bcrypt y revisión periódica de dependencias. Ningún sistema es
          100% seguro; si descubres una vulnerabilidad, lee el{' '}
          <a href="/security" className="font-medium underline-offset-2 hover:underline">Aviso de Seguridad</a>{' '}
          para saber cómo reportarla de forma responsable.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="9. Retención">
        <LegalParagraph>
          En la edición pública, tus datos se borran automáticamente cuando limpias el
          almacenamiento del navegador. En la edición con cuenta, conservamos tus datos mientras
          tu cuenta esté activa. Si la eliminas, borramos tus datos personales en un máximo de 30
          días, salvo lo que debamos conservar por obligación legal (por ejemplo, registros de
          fraude durante el plazo de prescripción).
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="10. Cambios a este aviso">
        <LegalParagraph>
          Si cambiamos este aviso, publicaremos la nueva versión en esta misma URL con un número
          de versión mayor (por ejemplo, de 1.0.0 a 2.0.0) y la fecha de vigencia actualizada.
          Los cambios menores (de 1.0.0 a 1.0.1) son aclaraciones que no reducen tus derechos.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="11. Contacto">
        <LegalParagraph>
          Para cualquier duda sobre privacidad, escribe a{' '}
          <a href="mailto:privacy@pyarcana.dev" className="font-medium underline-offset-2 hover:underline">privacy@pyarcana.dev</a>.
          Para temas de seguridad, lee el{' '}
          <a href="/security" className="font-medium underline-offset-2 hover:underline">Aviso de Seguridad</a>.
        </LegalParagraph>
      </LegalSection>
    </LegalPageShell>
  )
}
