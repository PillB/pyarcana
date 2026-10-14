'use client'

import Link from 'next/link'
import { LegalPage } from '@/components/legal/LegalPage'

export default function CredentialPolicyPage() {
  return (
    <LegalPage
      title="Política de credenciales e insignias"
      subtitle="Qué significa cada tipo de credencial PyArcana y cómo se verifica."
      version="2.1"
      effectiveDate="2026-10-13"
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
            Según el catálogo de insignias de PyArcana, la clase B afirma que el estudiante demostró la competencia de forma independiente mediante una tarea práctica, pruebas ocultas y criterios críticos que no pueden compensarse. Esta afirmación se rige por la especificación de evaluación de PyArcana. Hoy, PyArcana no emite insignias de competencia de clase B.
          </p>

          <h3 className="mt-4 font-semibold">C — Insignia de capacidad integrada</h3>
          <p>
            Según el catálogo, la clase C afirma que el estudiante demostró una transferencia integrada mediante un proyecto realista, recuperación de fallos y reproducibilidad. La afirmación incluye una revisión independiente conforme a la especificación de evaluación de PyArcana. Hoy, PyArcana no emite insignias integradas de clase C.
          </p>

          <h3 className="mt-4 font-semibold">D — Credencial verificada PyArcana</h3>
          <p>
            Según el catálogo, la clase D afirma que el estudiante demostró la capacidad de forma independiente mediante un capstone mayor y una evaluación con defensa. La afirmación incluye evidencia que revela cualquier alteración y verificación pública, conforme a la especificación de evaluación de PyArcana. Toda credencial verificada se emite únicamente en el servidor, nunca desde el almacenamiento del navegador. Hoy, PyArcana no emite ninguna credencial verificada de clase D.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">Qué demuestra una credencial</h2>
          <p>
            Comprobar una credencial verificada muestra clase, nombre de la insignia, especificación —versión numerada de las reglas de esa insignia—, emisor, fecha de emisión, estado y referencia al titular. La declaración firmada nombra qué se demostró y la versión de la especificación bajo la cual se demostró.
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
            En el LMS dinámico (sistema de gestión del aprendizaje: la edición que se ejecuta en el servidor propio de PyArcana), puedes comprobar una credencial verificada en /verify mediante su identificador. La página muestra la declaración firmada bajo la etiqueta «Capacidad demostrada». No existe un procedimiento que revoque una credencial emitida, y todas quedan registradas como activas.
          </p>
          <p>
            Las insignias del catálogo tienen números de versión, como 1.0.0 y 1.1.0. No existe un procedimiento que marque una credencial emitida como perteneciente a una versión anterior.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">Política de IA</h2>
          <p>
            Una credencial B, C o D afirma que el estudiante demostró la capacidad de manera independiente. El trabajo presentado como evidencia debe ser independiente, y el código generado por IA no es aceptable cuando nada muestra que el estudiante lo revisó. PyArcana no detecta ni limita el uso de herramientas de IA. PyArcana no registra ninguna declaración sobre el uso de IA ni ninguna defensa, oral o escrita. Ninguna página solicita al estudiante una declaración ni una defensa.
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
