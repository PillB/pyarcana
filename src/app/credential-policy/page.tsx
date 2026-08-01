'use client'

import Link from 'next/link'
import { LegalPage } from '@/components/legal/LegalPage'

export default function CredentialPolicyPage() {
  return (
    <LegalPage
      title="Política de credenciales e insignias"
      subtitle="Qué significa cada tipo de credencial PyArcana y cómo se verifica."
      version="2.0"
      effectiveDate="2026-07-31"
    >
      <div className="prose prose-sm dark:prose-invert max-w-none space-y-6">
        <section>
          <h2 className="text-lg font-semibold">Cuatro clases de credencial</h2>
          <p>
            PyArcana distingue cuatro clases de credencial, cada una con un nivel
            distinto de evidencia y verificación.
          </p>

          <h3 className="mt-4 font-semibold">A — Marcador de progreso (local)</h3>
          <p>
            Registra que completaste o participaste en una sección. Se guarda en tu
            navegador (localStorage). No constituye evidencia de competencia profesional.
            Puede manipularse localmente sin afectar credenciales verificadas.
          </p>

          <h3 className="mt-4 font-semibold">B — Insignia de habilidad evaluada</h3>
          <p>
            Demuestra una capacidad acotada mediante una tarea práctica independiente,
            pruebas ocultas y puertas críticas no compensables. La decisión es
            autoritativa del servidor. Incluye registro de evidencia y revisión.
          </p>

          <h3 className="mt-4 font-semibold">C — Insignia de capacidad integrada</h3>
          <p>
            Demuestra transferencia entre secciones mediante un proyecto integrador
            realista, recuperación de fallos, reproducibilidad y comunicación técnica.
            Requiere revisión independiente.
          </p>

          <h3 className="mt-4 font-semibold">D — Credencial verificada PyArcana</h3>
          <p>
            Es la credencial más fuerte. Se emite tras un capstone mayor o síntesis
            final, con identidad verificada, especificación versionada, evaluación
            independiente, evidencia a prueba de manipulación, verificación pública y
            revocación. Nunca se emite desde localStorage.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">Qué demuestra una credencial</h2>
          <p>
            Cada credencial describe exactamente qué capacidad se demostró, bajo qué
            condiciones de evaluación, con qué evidencia y bajo qué versión de
            especificación. Un reclutador puede inspeccionar un resumen conciso de
            evidencia.
          </p>
          <p className="text-sm text-muted-foreground">
            Las credenciales de PyArcana describen evidencia demostrada dentro del curso.
            No constituyen certificación profesional acreditada, licencia, ni garantía de
            empleo. Para verificación de una credencial específica, consulta el{' '}
            <Link href="/verify" className="font-medium text-foreground underline-offset-2 hover:underline">
              registro público de verificación
            </Link>
            .
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">Verificación y revocación</h2>
          <p>
            Las credenciales verificadas (clase D) pueden verificarse públicamente. Una
            credencial puede revocarse si se descubre manipulación de evidencia, si los
            criterios no se cumplieron genuinamente, o si se identifica fraude. La
            revocación incluye un motivo registrado y auditable.
          </p>
          <p>
            Las insignias tienen versión. Si los criterios cambian, las insignias
            emitidas bajo criterios anteriores conservan su validez, pero pueden
            marcarse como "versión anterior".
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">Política de IA</h2>
          <p>
            Se permite el uso de herramientas de IA durante la evaluación, sujeto a
            declaración, ejecución independiente, explicación de decisiones importantes
            y defensa frente a requisitos modificados. No se acepta como evidencia
            independiente el trabajo que el aprendiz no puede explicar o adaptar.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">Límite</h2>
          <p className="text-sm text-muted-foreground">
            Esta política es el único documento canónico sobre el significado y los
            límites de las credenciales PyArcana. Otras páginas pueden enlazar aquí en
            lugar de repetir estos términos.
          </p>
        </section>
      </div>
    </LegalPage>
  )
}
