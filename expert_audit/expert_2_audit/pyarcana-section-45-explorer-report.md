# Explorer Report — PyArcana Section 45

## 1. Section Identification & Scope

### 1.1 Identificación

- **Sección auditada:** 45.
- **Título largo en la fuente:** **Cloud, almacenamiento, colas e infraestructura**.
- **Título corto en el sitio:** **Cloud y colas**.
- **Identificador técnico actual:** `iac`.
- **Nivel:** Master.
- **Duración declarada:** 20 horas.
- **Incremento curricular:** job asíncrono con artifact store, estado, reintentos y dead-letter; permisos y costos presupuestados.
- **Caso didáctico:** `CASO-IQU-045`, organización ficticia de Iquitos con reportes sintéticos.
- **Archivo canónico:** `src/lib/course/sections/s45-iac.ts`.
- **Banco de examen:** bloque `'iac'` de `prisma/seed.ts`.

La página pública enumera la Sección 45 como “Cloud y colas”, con el mismo tagline y una carga de 20 horas en nivel Master. El sitio también declara el método de cinco etapas visibles: Teoría, I Do, We Do, You Do y Quiz/Examen. citeturn198463view0 La fuente canónica confirma el título largo, el caso, los ocho resultados de aprendizaje y el alcance vendor-neutral. fileciteturn18file0L5-L26

### 1.2 Alcance exacto auditado

Se revisaron exclusivamente los nodos curriculares vinculados con S45:

1. Metadatos, relevancia laboral y ocho resultados de aprendizaje.
2. La ruta introductoria y los ocho subtemas:
   - `S45-T1-A`: object store, relacional y caché;
   - `S45-T1-B`: consistencia, lifecycle, backup, RPO y RTO;
   - `S45-T2-A`: colas, eventos, delivery semantics y visibility timeout;
   - `S45-T2-B`: deduplicación, orden y DLQ;
   - `S45-T3-A`: compute, autoscaling, redes y backpressure;
   - `S45-T3-B`: IAM, paths privados y egress;
   - `S45-T4-A`: configuración declarativa y entornos;
   - `S45-T4-B`: costos, cuotas, recovery y portabilidad.
3. Ocho demostraciones **I Do**.
4. Veinticuatro retos **We Do**, organizados como E1 → E2 → E3 para cada subtema.
5. El proyecto **You Do**, su starter, requisitos y rúbrica.
6. Las siete preguntas de `selfCheck`.
7. Las veinticuatro preguntas de examen de `prisma/seed.ts`.
8. Recursos enlazados y consistencia con S44, S46 y el roadmap canónico.
9. Redacción en español peruano, accesibilidad conceptual y posibles filtraciones de texto interno.

El roadmap exige para S45 un **“cloud-lab o emulador”**, cubre las cuatro familias anteriores y define exactamente el job asíncrono como gate. fileciteturn29file0L49-L80 La implementación de la interfaz confirma que estas piezas se renderizan en cinco pestañas y que los usuarios sin sesión ven `selfCheck`, mientras los usuarios autenticados reciben `ExamView`. fileciteturn37file0L70-L93 fileciteturn38file0L32-L67

### 1.3 Método y limitación de navegación

La estructura de los reportes anteriores se usó solo como referencia editorial, no como evidencia de S45. fileciteturn0file0

La página pública es una SPA gobernada por hash. El código busca el identificador después de `#`, selecciona la sección y renderiza `SectionView`; por ello la ruta compartible actual es `#iac`. fileciteturn19file0L51-L75 El parser web permitió verificar el catálogo, título, posición, nivel y navegación pública, pero no ejecutó la transición client-side del hash. En consecuencia:

- **Observado directamente en la página pública:** catálogo, orden S44→S45→S46, título, tagline, nivel, duración y modelo de pestañas.
- **Verificado en la fuente desplegable:** todo el cuerpo de Teoría/I Do/We Do/You Do/Quiz y los contratos de UI.
- **No afirmado como observado visualmente:** espaciado, scroll, syntax highlighting y comportamiento interactivo de cada tarjeta después de la hidratación.

Esta limitación no reduce la validez del análisis de contenido, pero sí impide certificar visualmente cada estado interactivo de S45 en el navegador.

---

## 2. Executive Summary of Quality

### 2.1 Puntuación global

# **6.4 / 10 — Excelente mapa conceptual; laboratorio y evaluación aún no alcanzan nivel Master**

### 2.2 Veredicto clave

S45 tiene una de las mejores **arquitecturas curriculares declarativas** del curso: el puente desde S44 es explícito, los resultados de aprendizaje están bien alineados con el roadmap, el caso sintético evita PII y credenciales, y la teoría cubre decisiones de persistencia, semántica de entrega, seguridad, recuperación y FinOps con una visión acertadamente vendor-neutral. La sección enseña varias reglas profesionales valiosas: caché no autoritativa, ack después del efecto, reintentos idempotentes, DLQ, least privilege, restore probado y presupuesto medido. fileciteturn18file0L30-L36

Sin embargo, la experiencia práctica contradice parte de esa ambición. El roadmap pide cloud-lab o emulador, pero el curso reduce casi todo a diccionarios, sets y predicados booleanos en memoria. El proyecto llama “durables” a tres estructuras que desaparecen al reiniciar el proceso; no modela concurrencia, atomicidad, lease extension, schema de mensajes, redrive, telemetría ni fallas entre stores. Los 24 retos We Do repiten una plantilla de “invertir el booleano”, y varias soluciones imprimen tautologías de harness que no están en la salida esperada. El examen es la capa más débil: las 24 respuestas correctas están en la posición `1`, muchos distractores son cómicos o imposibles, y las explicaciones son telegráficas.

### 2.3 Fortalezas que deben conservarse

1. **Alineación de roadmap sobresaliente.** Los ocho subtemas corresponden exactamente a T1–T4.
2. **Puente S44→S45 claro.** Consume un artefacto firmado en lugar de reimplementar CI.
3. **Seguridad didáctica.** Caso sintético, sin PII, secretos ni egress real obligatorio.
4. **Buen juicio arquitectónico.** Fuente de verdad explícita, fail-closed y evidencia de restore.
5. **Vendor neutrality.** La IaC y los servicios se enseñan como contratos, no como memorización de consola.
6. **Rúbrica multidimensional.** Correctitud, recovery, seguridad, reproducibilidad, operación y trade-offs.
7. **Recursos oficiales relevantes.** Terraform, AWS Well-Architected, SQS, IAM, CloudEvents, NIST y OpenTelemetry.

### 2.4 Riesgo pedagógico principal

La sección puede producir una **ilusión de dominio**: el estudiante aprende a reconocer la condición correcta en un `dict`, pero no necesariamente a construir, probar ni operar el job distribuido que el gate promete. La liberación gradual existe formalmente, pero la transferencia se mantiene dentro del mismo microformato. La investigación sobre gradual release exige un traspaso real desde modelado a práctica guiada y autonomía, no solo cambiar la etiqueta del ejercicio. citeturn240519search2turn240519search9 Los estudios de worked examples en programación también favorecen ejemplos que se desvanecen hacia resolución auténtica, no repetición casi isomórfica. citeturn240519search6turn240519search10

---

## 3. Detailed Issue Registry

### Issue 1 — **Critical** — El entorno práctico contradice el roadmap “cloud-lab o emulador”

**Ubicación:** roadmap S45; introducción, I Do y You Do.

**Evidencia exacta:**

- Roadmap: “**Entorno: cloud-lab o emulador**”. fileciteturn29file0L60-L69
- Fuente: “Stack didáctico: **stdlib** ... **sin cuenta real ni egress**”. fileciteturn18file0L33-L36
- I Do: ocho demos `environment: "local-python"`. fileciteturn22file0L8-L18
- You Do: object store, status y dedup son `dict`, `dict` y `set`. fileciteturn26file0L123-L160

**Hallazgo:** “Sin cuenta real” es una decisión responsable; “sin emulador” no lo es. El roadmap no obliga a gastar dinero ni crear infraestructura real: permite explícitamente un emulador. S45 podría usar SQLite + filesystem, LocalStack, Moto, Azurite o un broker local, pero hoy simula contratos distribuidos con estructuras de proceso.

**Impacto pedagógico:** el alumno no observa serialización, persistencia entre procesos, timeouts reales, concurrencia, locks, estados parciales, redrive ni configuración. Se evalúa conocimiento declarativo, no competencia operativa de nivel Master.

**Criterio de cierre:** al menos un laboratorio reproducible debe sobrevivir a un reinicio de proceso, ejecutar dos workers concurrentes e inyectar una caída entre efecto y ack.

---

### Issue 2 — **Critical** — El You Do llama “durable” a memoria volátil

**Ubicación:** starter del proyecto You Do.

**Evidencia exacta:**

> “No basta con imprimir booleans: el efecto durable debe vivir en los dicts.”

Luego define:

```python
object_store: dict[str, bytes] = {}
job_status: dict[str, str] = {}
seen_keys: set[str] = set()
```

fileciteturn26file0L123-L160

**Hallazgo:** un diccionario en memoria no es un object store ni un registro durable. Al terminar el proceso, se pierden artefacto, estado, deduplicación y DLQ.

**Impacto técnico:** el primer requisito del gate —reintentos sin duplicación después de fallas— no puede demostrarse tras un crash real. La palabra “durable” queda pedagógicamente desnaturalizada.

**Criterio de cierre:** sustituir el estado autoritativo por SQLite/archivo transaccional y el artefacto por filesystem con escritura atómica, o usar un emulador de servicios.

---

### Issue 3 — **Critical** — No existe una frontera atómica entre artefacto, status e idempotencia

**Ubicación:** `process_once` del You Do.

**Evidencia exacta:**

```python
# object_store[key] = msg["artifact_bytes"]
# job_status[key] = "done"
# seen_keys.add(key)
# return "ACK"
```

fileciteturn26file0L146-L175

**Hallazgo:** las tres mutaciones son independientes. Una caída después de escribir el artefacto pero antes de `job_status`, o después del status pero antes de `seen_keys`, deja estados imposibles.

**Impacto técnico y cognitivo:** el alumno recibe la regla “ack después del efecto”, pero no aprende que **varios efectos durables también necesitan un protocolo de commit, un estado de reconciliación o una operación idempotente verificable**.

**Criterio de cierre:** modelar una máquina de estados (`queued → processing → succeeded | retryable_failed | dlq`) y un commit marker/checksum; incluir pruebas de caída en cada punto de escritura.

---

### Issue 4 — **High** — La deduplicación se registra antes de demostrar el efecto durable

**Ubicación:** teoría/I Do de `S45-T2-B`.

**Evidencia exacta:**

```python
if key in seen:
    return "dup"
if attempts >= max_attempts:
    return "dlq"
seen.add(key)
return "new"
```

fileciteturn20file0L18-L44

**Hallazgo:** `seen.add(key)` puede ejecutarse antes del side-effect real. Si el worker cae después de marcar `seen` y antes de producir el resultado, la reentrega responde `dup` y omite trabajo no completado. Además, dos consumidores pueden superar `if key in seen` simultáneamente.

**Impacto:** enseña “dedup” como un set de mensajes vistos, cuando el contrato correcto suele depender de una clave única durable asociada al **resultado completado** o a una reserva atómica con recuperación.

**Criterio de cierre:** distinguir `claimed`, `completed` y `failed`; usar una restricción única/compare-and-set y una prueba de carrera con dos workers.

---

### Issue 5 — **High** — El demo de visibility timeout produce una falsa sensación de seguridad

**Ubicación:** I Do `S45-T2-A-DEMO`.

**Evidencia exacta:** el demo escribe `effects[key] = "done"` y luego, si el tiempo supera el visibility timeout, devuelve `ACK_AFTER_REDELIVERY_WINDOW`. fileciteturn22file0L58-L91

**Hallazgo:** el código no modela un segundo consumidor recibiendo el mensaje durante la ventana, la renovación del lease, el fallo del ack ni la posibilidad de duplicados aun dentro del timeout. AWS documenta que el visibility timeout no garantiza ausencia absoluta de entregas duplicadas; si vence antes del borrado, el mensaje reaparece. citeturn131901search6turn179739search0

**Impacto:** el alumno puede interpretar que detectar `processing_s >= timeout` después del efecto resuelve el problema. No lo resuelve: el control debe ocurrir durante el procesamiento y la idempotencia debe tolerar concurrencia.

**Criterio de cierre:** añadir un timeline con dos workers y un laboratorio que simule expiración/renovación del lease.

---

### Issue 6 — **High** — La DLQ carece de contrato de retención, redrive y replay seguro

**Ubicación:** T2-B y You Do.

**Evidencia exacta:** la teoría pide razón, contador y payload seguro, pero el proyecto solo ejecuta `dlq.append(msg)`. fileciteturn20file0L18-L23 fileciteturn26file0L146-L175

**Hallazgo:** faltan:

- `failure_reason`;
- `first_failed_at` / `last_failed_at`;
- número de recepciones;
- checksum y versión del schema;
- política de retención;
- alarma;
- autorización de redrive;
- velocidad de replay;
- idempotencia durante replay;
- cuarentena cuando el payload es inseguro.

AWS trata redrive como una operación explícita, con permisos, destino, velocidad y efectos sobre identificadores/retención. citeturn179739search1turn179739search3

**Impacto:** “mandar a DLQ” aparece como final feliz, no como inicio de un proceso operativo.

**Criterio de cierre:** entregar un runbook de inspección/redrive y una prueba de replay sin segundo side-effect.

---

### Issue 7 — **High** — IAM está contradicho entre teoría, demo, proyecto y quiz

**Ubicación:** T3-B, You Do y selfCheck.

**Evidencia exacta:**

- Demo/teoría: `allowed = {"object:get", "queue:ack"}`. fileciteturn20file0L88-L109
- El texto afirma que el worker “escribe al bucket”.
- You Do: `IAM_ALLOWED = {"object:put", "queue:ack"}`. fileciteturn26file0L139-L144
- Quiz vuelve a presentar `object:get + queue:ack` como evidencia correcta. fileciteturn27file0L42-L45

**Hallazgo:** un worker que genera el artefacto necesita `put`, no solo `get`. El curso enseña tres contratos incompatibles.

**Impacto:** confunde least privilege con “lista corta” en lugar de permisos mínimos **correctos** sobre acciones, recursos y condiciones. AWS recomienda restringir acciones, recursos y condiciones, no solo nombres de acciones. citeturn131901search0turn131901search2

**Criterio de cierre:** definir dos roles si corresponde (`producer`/`worker`) y probar `put` autorizado solo sobre el prefijo del caso, `get` cuando sea necesario, ack sobre la cola correcta y denegación explícita fuera de scope.

---

### Issue 8 — **High** — Los controles IAM, egress, path privado y cuotas están declarados pero no se ejecutan

**Ubicación:** requisitos y starter You Do.

**Evidencia exacta:** los requisitos exigen IAM, path privado, egress allowlisted y cuotas, pero `process_once` no consulta `IAM_ALLOWED` ni `EGRESS_ALLOW`; `gate_budget_ok` tampoco incluye `quota_used` o `quota_limit`. fileciteturn26file0L112-L164

**Hallazgo:** son constantes decorativas. La rúbrica otorga 15% a seguridad y 15% a operación, aunque el starter no ofrece una ruta verificable para esas dimensiones. fileciteturn27file0L3-L6

**Impacto:** facilita entregas que “declaran” controles sin demostrar denegaciones ni límites.

**Criterio de cierre:** incluir funciones ejecutables `authorize`, `allow_egress`, `capacity_gate` y pruebas negativas obligatorias.

---

### Issue 9 — **High** — El autoscaling usa una métrica sin unidades y puede dividir entre cero

**Ubicación:** T3-A teoría.

**Evidencia exacta:**

```python
def within_quota(workers, quota, backlog, target):
    return workers <= quota and backlog / workers <= target
```

fileciteturn20file0L54-L78

**Hallazgo:**

1. `workers == 0` causa `ZeroDivisionError`.
2. `target` no tiene unidad.
3. El target no se deriva de latencia aceptable y tiempo medio de procesamiento.
4. El fallback a CPU no considera edad del mensaje más antiguo, tasa de llegada, warm-up ni throughput.

AWS recomienda calcular backlog por instancia y derivar el target como `latencia_aceptable / tiempo_medio_por_mensaje`. citeturn179739search11

**Impacto:** el estudiante memoriza una comparación numérica, no dimensionamiento.

**Criterio de cierre:** incluir unidades, `max(workers, 1)`, target derivado y escenarios de escala-out, escala-in, cuota y backpressure.

---

### Issue 10 — **High** — El modelo de IaC confunde “plan seguro” con igualdad de sets y cero destrucciones

**Ubicación:** T4-A.

**Evidencia exacta:**

```python
declared == planned
and env in {"dev", "staging", "prod"}
and not secrets
and destroys == 0
```

fileciteturn20file0L119-L145

**Hallazgo:**

- Los recursos pueden tener los mismos nombres y atributos peligrosamente distintos.
- Un replacement legítimo puede incluir `destroy/create`.
- El texto dice rechazar destrucción **inesperada o no controlada**, pero el código rechaza cualquier destrucción.
- Un entorno `shared` no es universalmente inválido; es una política organizacional.
- No modela dependencias, state locking, drift, saved plan ni revisión.
- Los plan files pueden contener datos sensibles y no deberían versionarse. citeturn131901search3turn131901search5

**Impacto:** reduce IaC a un booleano que no representa el workflow real de plan-review-apply.

**Criterio de cierre:** evaluar acciones (`create`, `update`, `replace`, `delete`), criticidad, aprobación, razón, entorno permitido por política y plan guardado/revisado.

---

### Issue 11 — **Medium-High** — La explicación de consistencia de object storage es demasiado general y puede quedar obsoleta

**Ubicación:** T1-B.

**Evidencia exacta:** “el object store del artefacto puede ser eventual entre regiones”. fileciteturn18file0L106-L111

**Hallazgo:** la sección acierta al decir que la consistencia debe definirse por operación, pero luego mezcla consistencia del store con lag de replicación entre regiones. Por ejemplo, Amazon S3 ofrece strong read-after-write para PUT/DELETE dentro de todas sus regiones; la replicación cross-region es otro contrato. citeturn179739search2turn179739search15

**Impacto:** el alumno puede creer que “object store = eventual”, una simplificación que contradice el enfoque vendor-neutral.

**Criterio de cierre:** separar consistencia de la API, replicación, cachés/CDN y failover; pedir una matriz por operación/proveedor.

---

### Issue 12 — **Medium-High** — El ejemplo “backup diario” no garantiza RPO de 6 horas

**Ubicación:** T1-B.

**Evidencia exacta:** el texto describe un “backup diario sintético” con `backup_age=4 h`, `RPO=6 h` y restore de 25 min. fileciteturn18file0L109-L127

**Hallazgo:** una muestra tomada cuatro horas después del backup puede cumplir el RPO en ese instante, pero una periodicidad diaria permite hasta 24 horas de pérdida potencial. No garantiza un RPO de seis horas.

**Impacto:** confunde edad actual del backup con garantía del programa de backups.

**Criterio de cierre:** cambiar a backup cada ≤6 h o declarar RPO 24 h; añadir validación de integridad además de duración. AWS exige recuperación periódica, consulta del dato restaurado y validación de RTO/RPO. citeturn626272search2turn626272search6

---

### Issue 13 — **Medium-High** — El modelo de costos carece de periodo, drivers, forecast y variancia

**Ubicación:** T4-B y You Do.

**Evidencia exacta:** `forecast_pen=820`, `budget_pen=1000` y un booleano `forecast <= budget`. fileciteturn20file0L155-L178

**Hallazgo:** no se declara si el monto es diario, mensual o por corrida; faltan request cost, storage, egress, workers, retención, unidad de negocio, tags, actuals, variancia y responsable de forecast.

**Impacto:** “FinOps” se reduce a no exceder un número. El FinOps Framework enfatiza decisiones colaborativas, forecasting, budgeting, KPIs y unit economics. citeturn626272search24turn626272search26turn626272search32

**Criterio de cierre:** añadir horizonte, drivers, costo por job, forecast vs actual, umbrales 50/80/100%, owner y acción asociada.

---

### Issue 14 — **High** — El We Do son 24 variantes de una misma microtarea

**Ubicación:** introducción de We Do y familias E1/E2/E3.

**Evidencia exacta:** la sección anuncia 24 retos donde E1 corrige un predicado, E2 clasifica tres fixtures y E3 enruta `continue/breach/uncertainty`. fileciteturn21file0L78-L93

**Hallazgo:** la estructura es consistente, pero excesivamente homogénea:

- mismos `dict`;
- misma rama `missing`;
- mismo predicado invertido;
- mismos tres registros;
- mismas salidas exactas;
- solución visible en la misma tarjeta.

**Impacto:** desarrolla reconocimiento de patrones del harness, no diseño de sistemas. Un alumno puede aprender a buscar el `or` invertido sin comprender colas, IAM o DR.

**Criterio de cierre:** conservar una familia de predicados, pero reemplazar las demás con timeline de eventos, ADR comparativo, prueba de carrera, plan JSON, cálculo de capacidad, policy evaluation y restore drill.

---

### Issue 15 — **High** — La retirada de andamiaje es nominal, no auténtica

**Ubicación:** E1/E2/E3.

**Evidencia exacta:** T1-A E2 y E3 reutilizan la misma regla, los mismos fixtures y dos pistas explícitas; E3 sigue siendo una función de cinco líneas sobre el mismo `dict`. fileciteturn23file0L58-L126

**Hallazgo:** `kind: "transfer"` cambia la etiqueta, pero no el contexto, representación ni incertidumbre. La transferencia auténtica debería exigir aplicar el principio a un caso nuevo o integrar dos subtemas.

**Impacto:** el estudiante no practica selección de estrategia, explicación de trade-offs ni diagnóstico de señales incompletas.

**Criterio de cierre:** E3 debe combinar subtemas y ocultar parte del scaffold; por ejemplo, dedup + DB status + DLQ bajo crash concurrente.

---

### Issue 16 — **High** — Residuos de harness generan output no declarado

**Ubicación:** soluciones E2/E3.

**Evidencia exacta:**

```python
meets_contract = ('1A-0' == '1A-0')
print('meets_contract', meets_contract)
```

aunque la salida esperada solo contiene:

```text
PASS REDESIGN_PERSISTENCE MISSING:cache_ttl_s
```

fileciteturn23file0L92-L111

El mismo patrón aparece en T1-B, T4-A y T4-B. fileciteturn24file0L62-L81 fileciteturn25file0L52-L71 fileciteturn26file0L22-L41

**Hallazgo:** estas comparaciones tautológicas no prueban el contrato y añaden una segunda línea de salida que contradice el campo `output`.

**Impacto:** rompe la confianza en autochecks y enseña “test theater”: una igualdad siempre verdadera parece evidencia.

**Criterio de cierre:** eliminar todas las tautologías, ejecutar asserts sobre resultados reales y hacer que `output` coincida byte por byte.

---

### Issue 17 — **High** — Instrucciones, starter, solución y output no coinciden

**Ubicación:** E1 y E3 de múltiples subtemas.

**Evidencia exacta:**

- E1 ordena “No toques los datos ni el assert”, pero el starter no contiene assert; el assert aparece solo en la solución. fileciteturn23file0L22-L55
- E3 dice “Salida: imprime el valor de `meets_contract`”, pero el código imprime rutas y la salida esperada son tres tokens de decisión. fileciteturn23file0L175-L186 fileciteturn25file0L75-L128

**Hallazgo:** el contrato de tarea es internamente inconsistente.

**Impacto:** el estudiante puede producir la salida correcta y creer que incumplió, o seguir la instrucción literal y fallar el autocheck.

**Criterio de cierre:** un único contrato por ejercicio: archivos permitidos, líneas editables, output exacto y tests visibles.

---

### Issue 18 — **High** — El You Do no cubre los ocho resultados de aprendizaje

**Ubicación:** requisitos, starter y rúbrica You Do.

**Evidencia exacta:** el starter implementa normal/dup/poison/missing y un gate simple de presupuesto; no implementa consistency modes, lifecycle, RPO/RTO, visibility timeout, ordering, autoscaling, backpressure, path privado, plan IaC, quotas ni observabilidad. fileciteturn26file0L103-L179

**Hallazgo:** la lista de requisitos menciona varios de esos controles, pero el artefacto ejecutable no los demuestra.

**Impacto:** constructive alignment incompleto: resultados, proyecto y rúbrica miden cosas distintas.

**Criterio de cierre:** dividir You Do en cuatro entregables verificables T1–T4 o reducir explícitamente los outcomes evaluados por el proyecto.

---

### Issue 19 — **High** — Falta schema/versionado del mensaje y reutilización de S42

**Ubicación:** todos los mensajes del starter.

**Evidencia exacta:** el mensaje solo requiere `idempotency_key`, `attempts` y `artifact_bytes`. fileciteturn26file0L146-L169

**Hallazgo:** no hay `event_id`, `schema_version`, `correlation_id`, `created_at`, `content_type`, checksum, source, trace context ni validación de tamaño/tipo. Esto desaprovecha S42 (“Schemas y seguridad”) y el recurso CloudEvents.

**Impacto:** el job no puede evolucionar ni auditar mensajes de forma segura.

**Criterio de cierre:** definir un envelope versionado y tres fixtures: válido, versión no soportada y payload excedido.

---

### Issue 20 — **Medium-High** — Observabilidad aparece en la rúbrica, no en el trabajo

**Ubicación:** rúbrica y starter.

**Evidencia exacta:** la rúbrica asigna 15% a “SLO, costo/cuota, observabilidad y rollback”, pero no hay logs estructurados, métricas, trace/correlation ID, queue age, DLQ count ni rollback ejecutable. fileciteturn27file0L3-L6

**Impacto:** un evaluador no puede aplicar el criterio de manera objetiva.

**Criterio de cierre:** exigir métricas mínimas y un trace por job, con salidas esperadas y umbrales.

---

### Issue 21 — **High** — El selfCheck es estrecho y redundante

**Ubicación:** siete preguntas `selfCheck`.

**Evidencia exacta:** dos preguntas evalúan esencialmente la misma ruta poison→DLQ; no hay pregunta sustantiva de consistency/RPO, plan IaC, portabilidad o atomicidad. fileciteturn27file0L9-L53

**Hallazgo:** el quiz público sobrepondera slogans de seguridad y DLQ, y subrepresenta razonamiento.

**Impacto:** puede aprobarse sin comprender más de la mitad de los outcomes.

**Criterio de cierre:** una pregunta por cada subtema, con escenarios y justificación breve.

---

### Issue 22 — **Critical** — El banco de examen tiene una clave posicional predecible

**Ubicación:** `prisma/seed.ts`, bloque `'iac'`.

**Evidencia exacta:** las 24 preguntas de S45 fijan `correctIndex: 1`. El patrón es visible desde object storage hasta runbook de recovery. fileciteturn35file0L5-L41 fileciteturn35file0L260-L293

**Hallazgo:** seleccionar siempre la segunda opción permite 100% sin conocimiento.

**Impacto:** invalida el examen como evidencia de dominio y contradice la promesa de variantes anti-plagio.

**Criterio de cierre:** balancear índices, barajar opciones preservando clave y añadir un test de distribución por sección.

---

### Issue 23 — **Critical** — Los distractores del examen son implausibles y las explicaciones no diagnostican

**Ubicación:** banco de S45.

**Evidencia exacta:** distractores como:

- “El humor del equipo”;
- “El color del payload”;
- “GPU training”;
- “Probar parentesco”;
- “El correctIndex del banco”;
- “Se logra con print()”.

fileciteturn35file0L79-L113 fileciteturn35file0L127-L160

Las explicaciones suelen ser una línea como “Object store = blobs” o “Metric-driven scale”.

**Hallazgo:** las opciones incorrectas no representan errores plausibles de un estudiante Master. La literatura sobre MCQ exige distractores incorrectos pero plausibles y diversos. citeturn240519search11turn240519academia49

**Impacto:** mide reconocimiento superficial, no discriminación conceptual.

**Criterio de cierre:** construir distractores desde misconceptions reales: ack temprano, dedup solo en memoria, RPO confundido con RTO, global ordering asumido, plan especulativo aplicado, IAM action correcta sobre recurso incorrecto.

---

### Issue 24 — **High** — El examen no está alineado con la lección actual

**Ubicación:** banco de S45.

**Evidencia exacta:** el examen incluye cold starts, OIDC temporal, pub/sub de eventos de dominio y workspaces/stacks, pero esos conceptos no se enseñan de forma suficiente en la teoría; a la vez, apenas evalúa ack post-efecto, visibility timeout, backpressure, pruebas negativas, restore medido y fail-closed. fileciteturn35file0L152-L257

**Impacto:** amenaza validez de contenido: algunas respuestas dependen de conocimiento externo y varios outcomes centrales quedan subevaluados.

**Criterio de cierre:** matriz `learningOutcome → I Do → We Do → You Do → selfCheck → 3 exam variants`.

---

### Issue 25 — **Medium** — Mezcla terminológica y redacción excesivamente anglicada

**Ubicación:** teoría, ejercicios y examen.

**Ejemplos exactos o recurrentes:**

- `cache` en prosa en vez de **caché**;
- `environment`/`env` donde corresponde **entorno**;
- “egress allowlisted” y “allowlistea”;
- “breach”, “missing”, “owner”, “warning”, “side-effect”, “restore”;
- “capturazo”;
- “Un substitute de authz” en el examen;
- “no reimprime el PDF”, cuando el riesgo es regenerar o duplicar el artefacto.

**Hallazgo:** los identificadores de código pueden permanecer en inglés, pero la narración no distingue término técnico, traducción y token de máquina.

**Impacto:** aumenta carga extrínseca, especialmente para lectores latinoamericanos que aún no dominan jerga de cloud.

**Criterio de cierre:** primera mención bilingüe y luego forma española consistente: “tráfico de salida (egress)”, “lista de destinos permitidos (allowlist)”, “entorno”, “caché”; conservar tokens exactos en backticks.

---

### Issue 26 — **Medium** — El diccionario inicial front-loads demasiados conceptos

**Ubicación:** apertura de teoría.

**Evidencia exacta:** un solo párrafo define object store, relacional, cache, tres delivery semantics, visibility timeout, dedup, DLQ, IAM, egress, IaC y budget/quota. fileciteturn18file0L28-L36

**Hallazgo:** el mapa es útil, pero presenta más de una docena de nodos antes de mostrar el flujo productor→cola→worker→stores.

**Impacto:** el lector sostiene demasiadas definiciones sin una representación espacial o temporal.

**Criterio de cierre:** abrir con un diagrama de secuencia y revelar el glosario por T1–T4.

---

### Issue 27 — **Medium** — El I Do repite código de teoría en vez de hacer visible el razonamiento distribuido

**Ubicación:** ocho demos I Do.

**Evidencia exacta:** los demos vuelven a ejecutar predicados y pequeños dicts ya presentes en teoría. El texto “¿por qué?” es bueno, pero no hay timeline, estado antes/después ni comparación de alternativas. fileciteturn22file0L8-L56

**Impacto:** modela la respuesta, pero no suficientemente el proceso de decisión profesional.

**Criterio de cierre:** por cada familia, incluir una decisión rechazada, una traza de falla y el razonamiento de trade-off.

---

### Issue 28 — **Medium** — Falta un cierre narrativo explícito hacia S46

**Ubicación:** final de S45.

**Hallazgo:** la apertura conecta muy bien S44→S45, pero no cierra con el handoff a S46: event time, backfill, lineage y exactly-once end-to-end. El roadmap sitúa S46 inmediatamente después. fileciteturn29file0L71-L80

**Impacto:** se pierde la oportunidad de distinguir “job resiliente” de “pipeline de datos de producción”.

**Criterio de cierre:** añadir una nota “Lo que S45 garantiza / lo que S46 añadirá”.

---

### Issue 29 — **Low-Medium** — La lista de recursos es útil pero desbalanceada y parcialmente genérica

**Ubicación:** `resources`.

**Evidencia exacta:** combina documentación oficial precisa con una búsqueda genérica de Coursera; usa AWS como benchmark dominante pese al objetivo vendor-neutral. fileciteturn27file0L55-L119

**Impacto:** el estudiante no recibe una ruta externa inequívoca para laboratorio equivalente en AWS/GCP/Azure/local.

**Criterio de cierre:** una ruta oficial vendor-neutral/local y una tabla de equivalencias por proveedor; reemplazar búsquedas genéricas por módulos concretos.

---

## 4. Meta-Leak Report

### 4.1 Filtraciones confirmadas

#### ML-01 — Tautologías del harness en soluciones

**Texto exacto:**

```python
meets_contract = ('1A-0' == '1A-0')
print('meets_contract', meets_contract)
```

También aparecen variantes `1B-2`, `4A-12`, `4B-14`, etc. fileciteturn23file0L92-L111 fileciteturn25file0L52-L71

**Clasificación:** filtración técnica clara.  
**Por qué:** no tiene función pedagógica ni valida el dominio; parece un marcador generado por harness.  
**Acción:** eliminar y sustituir por asserts reales.

#### ML-02 — Instrucción residual “imprime el valor de meets_contract”

**Texto exacto:** “Salida: imprime el valor de meets_contract.”

**Ubicaciones:** E3 de varias familias. fileciteturn24file0L85-L96 fileciteturn25file0L75-L86

**Clasificación:** filtración de plantilla/generación.  
**Por qué:** no coincide con la salida contractual de rutas.

#### ML-03 — Callouts de gate con tono de pipeline interno

**Textos exactos:**

- “Nota de orientación: S45-T1-A: caso sintético con asserts; sin evidencia no promociones.”
- “Contrato S45-T2-B: fixture S45-T2-B; evidencia local obligatoria.”
- “El dueño de S45-T4-A responde por rollback y evidencia.”
- “residual risk y límites del lab stdlib.”

fileciteturn18file0L58-L62 fileciteturn20file0L10-L15

**Clasificación:** probable filtración de lenguaje de auditoría/harness, no necesariamente comentario secreto.  
**Impacto:** el alumno ve identificadores y órdenes del sistema editorial en lugar de una orientación didáctica concreta.

### 4.2 Fuga de legado semántico

#### ML-04 — El hash público es `#iac`, aunque la sección ya no es una lección de IaC

La fuente declara que el foco **no** es una herramienta de IaC; el alcance es cloud, storage, queues y ops. Sin embargo, el identificador compartible sigue siendo `iac`. fileciteturn18file0L5-L17 fileciteturn19file0L51-L75

**Clasificación:** deuda de nomenclatura visible, no secreto.  
**Impacto:** enlaces, analytics y progreso quedan atados a una etiqueta histórica engañosa.

### 4.3 Elementos revisados que NO son meta-leak

- `DEFECT` en starters: es parte intencional de la actividad.
- `CASO-IQU-045`: identificador curricular legítimo.
- `CP-N4-B`: puede mantenerse si se explica como gate de capstone; el problema es usarlo sin traducción humana.
- Avisos de datos sintéticos y no usar PII: son controles pedagógicos valiosos.

---

## 5. Pedagogical & Redaction Deep Dive

### 5.1 Grafo conceptual de S45

**Nodo de entrada:** artefacto verificable de S44.

**Flujo principal:**

```text
artefacto S44
   ↓
mensaje versionado
   ↓
cola + lease/visibility timeout
   ↓
worker con identidad mínima
   ↓
efecto durable e idempotente
   ├─ artefacto en object store
   ├─ estado autoritativo
   └─ ack posterior al commit
   ↓
reintento / dedup / DLQ
   ↓
métricas, costo, recovery y handoff a S46
```

**Aristas bien construidas:**

- S44 artifact → S45 job.
- patrón de acceso → store.
- at-least-once → idempotencia.
- efecto durable → ack.
- poison → DLQ.
- lag → capacidad.
- workload identity → IAM.
- forecast → owner/action.
- backup → restore test → RPO/RTO.

**Aristas faltantes o débiles:**

- schema version → compatibilidad;
- claim atómico → exclusión concurrente;
- object write + status write → reconciliación;
- DLQ → redrive;
- trace ID → observabilidad;
- backlog + processing time + latency target → autoscaling;
- IaC plan action → aprobación/rollback;
- cost driver → unit economics;
- S45 state → S46 backfill/exactly-once.

### 5.2 I Do / We Do / You Do

#### I Do — **7.5/10**

**Fortalezas:**

- ocho demos, uno por subtema;
- outputs visibles;
- explicación “por qué”;
- pruebas positivas y negativas en IAM, restore y budget;
- buen énfasis en evidencia y no en vendor.

**Debilidades:**

- repite la teoría con funciones pequeñas;
- no muestra decisiones bajo incertidumbre;
- no hay trace temporal;
- no modela carrera, crash ni recuperación;
- no compara dos diseños plausibles.

Un I Do Master debería hacer visible el razonamiento experto: “qué garantía necesito, qué falla puede ocurrir, qué estado queda y cómo lo observo”.

#### We Do — **4.5/10**

El volumen es alto, pero diversidad cognitiva baja. La UI promete “Hacemos juntos”, starter, pistas y solución. fileciteturn38file0L219-L271 No obstante, el contenido es esencialmente individual y repetitivo. El gradual release efectivo comparte responsabilidad, comprueba comprensión y retira el apoyo en función del desempeño. citeturn240519search2turn240519search17

**Reestructuración sugerida por familia:**

- E1: completar un worked example.
- E2: diagnosticar una traza con dos errores plausibles.
- E3: diseñar/testear una solución en un contexto nuevo.
- checkpoint: explicar en dos frases la garantía obtenida y el riesgo residual.

#### You Do — **5.0/10**

**Fortalezas:** contexto claro, requisitos, tres rutas, rúbrica y portafolio.

**Debilidad decisiva:** el artefacto no es distribuido ni durable. La investigación sobre evaluación auténtica en ingeniería indica que tareas con múltiples caminos y decisiones bajo incertidumbre miden competencias distintas de un test tradicional. citeturn240519search8 S45 necesita ese segundo tipo de evidencia.

### 5.3 Carga cognitiva y progressive disclosure

La sección reduce riesgo con una ruta T1→T4 y un caso único. Eso es bueno. La carga extrínseca aumenta por:

- glosario masivo al inicio;
- anglicismos no estabilizados;
- boilerplate repetido;
- tokens de gate largos;
- ausencia de diagramas;
- outputs exactos contaminados;
- 24 tareas visualmente similares.

**Mejora:** arquitectura primero, glosario contextual después; alternar texto, timeline y código; agrupar ejercicios por garantía, no por identificador.

### 5.4 Calidad técnica frente a fuentes oficiales

#### Colas

La sección acierta al asumir at-least-once e idempotencia. AWS confirma que standard queues pueden entregar más de una copia y que la aplicación debe ser idempotente. citeturn179739search0turn179739search6 Google Pub/Sub muestra además que “exactly once” tiene límites por tipo de suscripción y no elimina duplicados de publicación, lo que respalda la frase de S45 de que exactly-once es una propiedad compuesta. citeturn131901search1

**Brecha:** la implementación no demuestra atomicidad end-to-end.

#### Recovery

S45 acierta en “backup no cuenta sin restore”. AWS y Google recomiendan pruebas periódicas con integridad, RTO y RPO. citeturn626272search2turn626272search6

**Brecha:** el ejemplo de frecuencia/RPO y la falta de integridad/runbook.

#### IaC

S45 acierta en revisar el plan antes de apply. Terraform define el plan como comparación entre configuración, state y objetos remotos, y advierte que un plan especulativo puede quedar obsoleto. citeturn131901search3turn131901search5

**Brecha:** sets y `destroys == 0` no representan ese proceso.

#### IAM

S45 acierta en least privilege y pruebas negativas. AWS insiste en acciones, recursos, condiciones y credenciales temporales. citeturn131901search2

**Brecha:** acción `get`/`put` contradictoria y ausencia de scope de recurso/condición.

#### FinOps

S45 acierta al asignar owner y bloquear scale-out ante breach.

**Brecha:** no mide unidad económica, periodo ni variancia; el framework FinOps enfatiza forecasting, budgeting y responsabilidad colaborativa. citeturn626272search24turn626272search26

### 5.5 Comparación con materiales best-in-class

| Referente | Qué hace mejor | Qué S45 hace mejor | Brecha accionable |
|---|---|---|---|
| AWS SQS docs/labs | Semántica concreta de receive/delete, visibility, DLQ, redrive y métricas | S45 es más vendor-neutral y conecta seguridad/costo | Añadir emulador y failure injection |
| Google Pub/Sub docs | Distingue garantías por modalidad y límites de exactly-once | S45 introduce property-composed | Añadir tabla broker vs end-to-end |
| Terraform tutorials | Plan real, saved plan, JSON, replacements, locking y apply | S45 evita convertir IaC en fin | Usar plan JSON sintético realista |
| AWS Well-Architected | Recovery drills, integridad, RTO/RPO y runbooks | S45 integra recovery con job | Añadir restore verificable y frecuencia coherente |
| MIT distributed systems | Fallas, concurrencia, invariantes y razonamiento temporal | S45 es más accesible y aplicado | Incorporar race/crash timeline |
| Worked-example research | Desvanecimiento progresivo y self-explanation | S45 tiene volumen y estructura uniforme | Diversificar E2/E3 y exigir explicación |
| Authentic engineering assessment | Decisiones múltiples bajo incertidumbre | S45 tiene rúbrica/portafolio | Evaluar diseño y trade-offs, no solo booleans |

### 5.6 Redacción en español peruano

La voz es directa, profesional y situada en Perú; Iquitos y PEN están bien usados, siempre como datos sintéticos. El problema no es la presencia de inglés técnico, sino su falta de política editorial.

**Política recomendada:**

- Prosa: “caché”, “entorno”, “reintento”, “tráfico de salida”.
- Primera aparición: “cola de mensajes no procesables (dead-letter queue, DLQ)”.
- Código/tokens: `cache`, `environment`, `FREEZE_SCALE_OUT`.
- Evitar híbridos verbales como “allowlistear”.
- Evitar coloquialismos no necesarios como “capturazo”.
- Explicar `ack`, `lease`, `backpressure`, `drift` y `redrive` con una frase funcional.

### 5.7 Accesibilidad

No se detecta dependencia de color en el contenido de S45, pero faltan representaciones complementarias:

- diagrama textual de arquitectura;
- sequence diagram;
- tabla de estados;
- tabla RPO/RTO;
- tabla de policy allow/deny;
- alternativa textual para cualquier diagrama futuro.

Los sistemas distribuidos son relacionales y temporales; exclusivamente texto + microcódigo obliga al lector a construir el modelo en memoria.

---

## 6. Proposed GitHub-style Diffs

> Los siguientes parches son propuestas. No fueron aplicados.

### Diff 1 — Renombrar el identificador sin romper enlaces/progreso

```diff
diff --git a/src/lib/course/sections/s45-iac.ts b/src/lib/course/sections/s45-cloud-queues.ts
similarity index 99%
rename from src/lib/course/sections/s45-iac.ts
rename to src/lib/course/sections/s45-cloud-queues.ts
@@
 export const section45: CourseSection = {
-  id: "iac",
+  id: "cloud-queues",
+  legacyIds: ["iac"],
```

```diff
diff --git a/src/app/page.tsx b/src/app/page.tsx
@@
-const section = COURSE_SECTIONS.find((s) => s.id === hash)
+const section = COURSE_SECTIONS.find(
+  (s) => s.id === hash || s.legacyIds?.includes(hash),
+)
@@
-  setActiveSectionId(hash)
+  setActiveSectionId(section.id)
```

**Propósito:** eliminar legado visible `#iac` preservando enlaces y progreso.

---

### Diff 2 — Corregir instrucciones y eliminar tautologías de harness

```diff
diff --git a/src/lib/course/sections/s45-iac.ts b/src/lib/course/sections/s45-iac.ts
@@
- instruction: "... No toques los datos ni el assert. Salida exacta: `S45-T1-A PASS`.",
+ instruction: "... Conserva los datos. Añade el assert indicado en la solución. Salida exacta: `S45-T1-A PASS`.",

@@
- instruction: "... Salida: imprime el valor de meets_contract.",
+ instruction: "... Salida exacta: `CONTINUE REDESIGN_PERSISTENCE WRITE_STORE_ADR`.",

@@
 results = (assess(valid), assess(invalid), assess(incomplete))
 print(*results)
-meets_contract = ('1A-0' == '1A-0')
-print('meets_contract', meets_contract)
+assert results == (
+    "PASS",
+    "REDESIGN_PERSISTENCE",
+    "MISSING:cache_ttl_s",
+)
```

Aplicar el mismo cambio a todas las soluciones E2/E3 de S45.

---

### Diff 3 — Añadir un gate que detecte output y asserts falsos

```diff
diff --git a/tests/adversarial/test_s45_solution_contracts.py b/tests/adversarial/test_s45_solution_contracts.py
new file mode 100644
--- /dev/null
+++ b/tests/adversarial/test_s45_solution_contracts.py
@@
+from pathlib import Path
+
+SOURCE = Path("src/lib/course/sections/s45-iac.ts").read_text(encoding="utf-8")
+
+
+def test_s45_has_no_tautological_harness_markers() -> None:
+    assert "== '1A-0'" not in SOURCE
+    assert "== '1B-" not in SOURCE
+    assert "== '4A-" not in SOURCE
+    assert "== '4B-" not in SOURCE
+
+
+def test_s45_e3_instructions_do_not_request_meets_contract_print() -> None:
+    assert "Salida: imprime el valor de meets_contract" not in SOURCE
```

---

### Diff 4 — Sustituir memoria “durable” por filesystem + SQLite

```diff
diff --git a/src/lib/course/sections/s45-iac.ts b/src/lib/course/sections/s45-iac.ts
@@
-    starterCode: `CASE_ID = "CASO-IQU-045"
-# Job asíncrono local (stdlib, sin cloud ni egress real).
+    starterCode: `from __future__ import annotations
+
+import hashlib
+import os
+import sqlite3
+from pathlib import Path
+
+CASE_ID = "CASO-IQU-045"
+STATE_DB = Path(".s45/state.db")
+ARTIFACT_DIR = Path(".s45/artifacts")
+STATE_DB.parent.mkdir(parents=True, exist_ok=True)
+ARTIFACT_DIR.mkdir(parents=True, exist_ok=True)
+
+
+def connect() -> sqlite3.Connection:
+    db = sqlite3.connect(STATE_DB)
+    db.execute("PRAGMA journal_mode=WAL")
+    db.execute(
+        """
+        CREATE TABLE IF NOT EXISTS jobs (
+            idempotency_key TEXT PRIMARY KEY,
+            status TEXT NOT NULL,
+            checksum TEXT,
+            attempts INTEGER NOT NULL DEFAULT 0,
+            last_error TEXT
+        )
+        """
+    )
+    db.execute(
+        """
+        CREATE TABLE IF NOT EXISTS dlq (
+            id INTEGER PRIMARY KEY AUTOINCREMENT,
+            idempotency_key TEXT NOT NULL,
+            attempts INTEGER NOT NULL,
+            failure_reason TEXT NOT NULL,
+            payload_checksum TEXT
+        )
+        """
+    )
+    return db
+
+
+def write_artifact_atomic(key: str, payload: bytes) -> tuple[Path, str]:
+    checksum = hashlib.sha256(payload).hexdigest()
+    final_path = ARTIFACT_DIR / f"{key}.bin"
+    temp_path = ARTIFACT_DIR / f".{key}.{os.getpid()}.tmp"
+    temp_path.write_bytes(payload)
+    os.replace(temp_path, final_path)
+    return final_path, checksum
```

**Nota:** el patch completo debe incluir reconciliación cuando el archivo existe pero el status no llegó a `succeeded`.

---

### Diff 5 — Implementar claim idempotente y máquina de estados

```diff
diff --git a/src/lib/course/sections/s45-iac.ts b/src/lib/course/sections/s45-iac.ts
@@
+def process_once(msg: dict, *, max_attempts: int = 3) -> str:
+    required = {"idempotency_key", "attempts", "artifact_bytes"}
+    missing = sorted(required - msg.keys())
+    if missing:
+        return "PAUSE_AND_INSPECT:" + ",".join(missing)
+
+    key = str(msg["idempotency_key"]).strip()
+    attempts = int(msg["attempts"])
+    payload = msg["artifact_bytes"]
+    if not key or not isinstance(payload, bytes):
+        return "PAUSE_AND_INSPECT:invalid_message"
+
+    if attempts >= max_attempts:
+        with connect() as db:
+            checksum = hashlib.sha256(payload).hexdigest()
+            db.execute(
+                """
+                INSERT INTO dlq(
+                    idempotency_key, attempts, failure_reason, payload_checksum
+                ) VALUES (?, ?, ?, ?)
+                """,
+                (key, attempts, "max_attempts_exceeded", checksum),
+            )
+        return "SEND_TO_DLQ"
+
+    with connect() as db:
+        row = db.execute(
+            "SELECT status, checksum FROM jobs WHERE idempotency_key = ?",
+            (key,),
+        ).fetchone()
+        if row and row[0] == "succeeded":
+            incoming = hashlib.sha256(payload).hexdigest()
+            return "SKIP_DUP" if row[1] == incoming else "IDEMPOTENCY_CONFLICT"
+
+        db.execute(
+            """
+            INSERT INTO jobs(idempotency_key, status, attempts)
+            VALUES (?, 'processing', ?)
+            ON CONFLICT(idempotency_key)
+            DO UPDATE SET attempts = excluded.attempts
+            """,
+            (key, attempts),
+        )
+
+    _, checksum = write_artifact_atomic(key, payload)
+
+    with connect() as db:
+        db.execute(
+            """
+            UPDATE jobs
+            SET status = 'succeeded', checksum = ?, last_error = NULL
+            WHERE idempotency_key = ?
+            """,
+            (checksum, key),
+        )
+    return "ACK"
```

**Propósito:** enseñar persistencia, conflicto de clave y estados recuperables.

---

### Diff 6 — Añadir failure injection y concurrencia auténtica a We Do

```diff
diff --git a/src/lib/course/sections/s45-iac.ts b/src/lib/course/sections/s45-iac.ts
@@
   weDo: {
     intro: "...",
     steps: [
+      {
+        id: "S45-T2-INTEGRATION-E3",
+        subtopicId: "S45-T2-A+S45-T2-B",
+        kind: "transfer",
+        instruction:
+          "Ejecuta dos workers concurrentes con la misma idempotency key. " +
+          "Inyecta una caída después de escribir el artefacto y antes de actualizar " +
+          "el status. Repara la reconciliación hasta demostrar: un artefacto, un " +
+          "status succeeded y cero segundo side-effect.",
+        tests:
+          "El test lanza dos procesos y reinicia uno; debe terminar con ACK/SKIP_DUP " +
+          "sin perder ni duplicar el artefacto.",
+      },
```

---

### Diff 7 — Corregir visibility timeout y añadir timeline

```diff
diff --git a/src/lib/course/sections/s45-iac.ts b/src/lib/course/sections/s45-iac.ts
@@
-        why: "At-least-once + visibility timeout: ...",
+        why:
+          "El visibility timeout reduce procesamiento concurrente, pero no garantiza " +
+          "una sola entrega. Si el trabajo puede exceder el lease, el worker debe " +
+          "renovarlo o permitir una reentrega segura. La idempotencia se valida aun " +
+          "cuando dos workers se solapan.",

@@
+        callout: {
+          type: "warning",
+          title: "Timeline de carrera",
+          content:
+            "t=0 W1 recibe · t=30 vence lease · t=31 W2 recibe · t=40 W1 termina. " +
+            "Ambos pueden intentar el efecto: la clave durable debe arbitrarlo."
+        },
```

---

### Diff 8 — Convertir DLQ en registro operativo y añadir redrive

```diff
diff --git a/src/lib/course/sections/s45-iac.ts b/src/lib/course/sections/s45-iac.ts
@@
-    dlq.append(msg)
+    dlq.append({
+        "event_id": msg["event_id"],
+        "idempotency_key": msg["idempotency_key"],
+        "attempts": msg["attempts"],
+        "failure_reason": "max_attempts_exceeded",
+        "schema_version": msg["schema_version"],
+        "payload_checksum": sha256(msg["artifact_bytes"]).hexdigest(),
+        "redrive_status": "quarantined",
+    })
@@
+def redrive(item: dict, *, approved: bool) -> str:
+    if not approved:
+        return "REDRIVE_REQUIRES_APPROVAL"
+    if item["redrive_status"] != "quarantined":
+        return "REDRIVE_NOT_ALLOWED"
+    item["redrive_status"] = "scheduled"
+    return "REDRIVE_SCHEDULED"
```

Añadir requisitos de retención, velocidad y prueba de no duplicación.

---

### Diff 9 — Corregir IAM y hacerlo ejecutable

```diff
diff --git a/src/lib/course/sections/s45-iac.ts b/src/lib/course/sections/s45-iac.ts
@@
-allowed = {"object:get", "queue:ack"}
+allowed = {
+    ("object:put", "reports/CASO-IQU-045/"),
+    ("queue:ack", "jobs"),
+}
@@
-def allow(action: str, allowed: set, host: str, egress_allow: set, private: bool) -> bool:
-    return action in allowed and private and host in egress_allow
+def allow(
+    action: str,
+    resource: str,
+    allowed: set[tuple[str, str]],
+    host: str,
+    egress_allow: set[str],
+    private: bool,
+) -> bool:
+    scoped_action = any(
+        action == allowed_action and resource.startswith(prefix)
+        for allowed_action, prefix in allowed
+    )
+    return scoped_action and private and host in egress_allow
```

Actualizar selfCheck para que la opción correcta use `object:put`, prefijo acotado y prueba negativa.

---

### Diff 10 — Corregir el cálculo de autoscaling

```diff
diff --git a/src/lib/course/sections/s45-iac.ts b/src/lib/course/sections/s45-iac.ts
@@
-def within_quota(workers: int, quota: int, backlog: int, target: int) -> bool:
-    return workers <= quota and backlog / workers <= target
+def acceptable_backlog_per_worker(
+    acceptable_latency_s: float,
+    avg_processing_s: float,
+) -> float:
+    if acceptable_latency_s <= 0 or avg_processing_s <= 0:
+        raise ValueError("latency and processing time must be positive")
+    return acceptable_latency_s / avg_processing_s
+
+
+def capacity_ok(
+    *,
+    workers: int,
+    quota: int,
+    backlog: int,
+    acceptable_latency_s: float,
+    avg_processing_s: float,
+) -> bool:
+    if workers <= 0:
+        return backlog == 0
+    target = acceptable_backlog_per_worker(
+        acceptable_latency_s,
+        avg_processing_s,
+    )
+    return workers <= quota and backlog / workers <= target
```

---

### Diff 11 — Separar consistency API, replicación y frecuencia de backup

```diff
diff --git a/src/lib/course/sections/s45-iac.ts b/src/lib/course/sections/s45-iac.ts
@@
-        "En `CASO-IQU-045`: ... el object store del artefacto puede ser eventual entre regiones. Un backup diario sintético con restore de 25 min frente a RTO 30 min y RPO 6 h...",
+        "En `CASO-IQU-045`, declara por separado: (1) consistencia de lectura " +
+        "del object store en la región primaria, (2) lag de replicación a la región " +
+        "secundaria y (3) comportamiento del failover. Para un RPO de 6 h, el " +
+        "programa de backup o replicación debe garantizar puntos recuperables al " +
+        "menos cada 6 h. El drill valida integridad y restore ≤ 30 min.",
```

---

### Diff 12 — Modelar un plan IaC, no igualdad de sets

```diff
diff --git a/src/lib/course/sections/s45-iac.ts b/src/lib/course/sections/s45-iac.ts
@@
-def plan_acceptable(declared: set, planned: set, env: str, secrets: bool, destroys: int) -> bool:
-    return declared == planned and env in {"dev", "staging", "prod"} and not secrets and destroys == 0
+def plan_decision(plan: dict, policy: dict) -> str:
+    required = {"environment", "saved_plan", "contains_sensitive", "changes"}
+    missing = sorted(required - plan.keys())
+    if missing:
+        return "REVIEW_DRIFT:" + ",".join(missing)
+    if plan["environment"] not in policy["allowed_environments"]:
+        return "REJECT_IAC_PLAN"
+    if plan["contains_sensitive"] or not plan["saved_plan"]:
+        return "REJECT_IAC_PLAN"
+
+    destructive = [
+        change for change in plan["changes"]
+        if change["action"] in {"delete", "replace"}
+    ]
+    unapproved = [
+        change for change in destructive
+        if not change.get("approved_change_id")
+    ]
+    return "REJECT_IAC_PLAN" if unapproved else "CONTINUE"
```

---

### Diff 13 — Añadir horizonte y unit cost al control FinOps

```diff
diff --git a/src/lib/course/sections/s45-iac.ts b/src/lib/course/sections/s45-iac.ts
@@
-def cost_ok(forecast_pen: int, budget_pen: int, used: int, limit: int) -> bool:
-    return forecast_pen <= budget_pen and used <= limit
+def finops_decision(record: dict) -> str:
+    required = {
+        "period",
+        "forecast_pen",
+        "actual_pen",
+        "budget_pen",
+        "jobs_processed",
+        "quota_used",
+        "quota_limit",
+        "cost_owner",
+    }
+    missing = sorted(required - record.keys())
+    if missing:
+        return "COST_OWNER_REVIEW:" + ",".join(missing)
+    if record["quota_used"] > record["quota_limit"]:
+        return "FREEZE_SCALE_OUT"
+    if record["forecast_pen"] > record["budget_pen"]:
+        return "FREEZE_SCALE_OUT"
+    return "CONTINUE"
+
+
+def cost_per_job_pen(record: dict) -> float:
+    if record["jobs_processed"] <= 0:
+        raise ValueError("jobs_processed must be positive")
+    return round(record["actual_pen"] / record["jobs_processed"], 4)
```

---

### Diff 14 — Añadir envelope versionado y observabilidad

```diff
diff --git a/src/lib/course/sections/s45-iac.ts b/src/lib/course/sections/s45-iac.ts
@@
-normal = {"idempotency_key": "job-iqu-1", "attempts": 0, "artifact_bytes": b"ok"}
+normal = {
+    "event_id": "evt-iqu-0001",
+    "schema_version": 1,
+    "correlation_id": "corr-iqu-0001",
+    "source": "s44-release-pipeline",
+    "created_at": "2026-07-25T00:00:00Z",
+    "content_type": "application/pdf",
+    "idempotency_key": "job-iqu-1",
+    "attempts": 0,
+    "artifact_bytes": b"ok",
+}
+
+METRICS = {
+    "jobs_ack_total": 0,
+    "jobs_duplicate_total": 0,
+    "jobs_dlq_total": 0,
+    "jobs_inspect_total": 0,
+}
```

Añadir asserts sobre métricas, `correlation_id` y trace de cada ruta.

---

### Diff 15 — Reescribir el examen y añadir gates de calidad

```diff
diff --git a/prisma/seed.ts b/prisma/seed.ts
@@
     {
       concept: "queue-event-delivery",
-      question: "At-least-once delivery implica que el consumidor debe:",
+      question:
+        "W1 escribe el PDF, pero cae antes de confirmar el mensaje. La cola lo " +
+        "entrega a W2. ¿Qué diseño evita un segundo efecto de negocio?",
       options: [
-        "Asumir exactamente una vez siempre",
-        "Ser idempotente ante reentregas",
-        "Ignorar duplicates sin diseño",
-        "Usar solo UDP",
+        "Confirmar el mensaje antes de escribir el PDF",
+        "Aumentar el visibility timeout y eliminar la deduplicación",
+        "Usar una clave idempotente durable y confirmar después del commit",
+        "Guardar la clave solo en memoria del primer worker",
       ],
-      correctIndex: 1,
-      explanation: "Idempotent consumers.",
+      correctIndex: 2,
+      explanation:
+        "At-least-once permite reentregas. El ack posterior al commit evita pérdida " +
+        "por ack temprano, y la clave durable impide que W2 repita el efecto.",
     },
```

```diff
diff --git a/tests/adversarial/test_question_bank_s45.py b/tests/adversarial/test_question_bank_s45.py
new file mode 100644
--- /dev/null
+++ b/tests/adversarial/test_question_bank_s45.py
@@
+def test_s45_correct_positions_are_not_constant(s45_questions) -> None:
+    positions = [q.correctIndex for q in s45_questions]
+    assert len(set(positions)) >= 3
+    assert max(positions.count(i) for i in range(4)) <= 9
+
+
+def test_s45_has_three_variants_per_outcome(s45_questions) -> None:
+    concepts = group_by_concept(s45_questions)
+    assert set(concepts) == EXPECTED_S45_CONCEPTS
+    assert all(len(items) == 3 for items in concepts.values())
+
+
+def test_s45_explanations_are_diagnostic(s45_questions) -> None:
+    assert all(len(q.explanation.split()) >= 18 for q in s45_questions)
```

Reescribir los 24 ítems con distractores basados en misconceptions reales y rotación equilibrada de índices.

---

### Diff 16 — Ampliar selfCheck a ocho outcomes

```diff
diff --git a/src/lib/course/sections/s45-iac.ts b/src/lib/course/sections/s45-iac.ts
@@
   selfCheck: {
     questions: [
+      {
+        question:
+          "Un backup se ejecuta cada 24 h, pero el RPO declarado es 6 h. " +
+          "¿Qué conclusión es correcta?",
+        options: [
+          "Cumple porque el último backup tiene 4 h en este momento",
+          "No garantiza el RPO; la frecuencia o replicación debe producir puntos ≤ 6 h",
+          "RPO y RTO son equivalentes",
+          "El visibility timeout corrige el problema",
+        ],
+        correctIndex: 1,
+        explanation:
+          "La edad puntual puede ser 4 h, pero el peor caso de una frecuencia diaria " +
+          "es cercano a 24 h. El programa debe garantizar puntos recuperables dentro del RPO.",
+      },
```

Eliminar una de las dos preguntas redundantes sobre poison→DLQ.

---

### Diff 17 — Normalizar redacción y glosario

```diff
diff --git a/src/lib/course/sections/s45-iac.ts b/src/lib/course/sections/s45-iac.ts
@@
- "**Cache:** copia descartable..."
+ "**Caché (`cache` en código):** copia descartable..."

- "**Egress control:** salidas de red autorizadas..."
+ "**Control del tráfico de salida (`egress`):** destinos de red autorizados..."

- "el egress se allowlistea"
+ "el tráfico de salida se restringe mediante una lista de destinos permitidos"

- "entorno inventado (`shared`)"
+ "entorno no permitido por la política del proyecto"

- "no un capturazo de consola"
+ "no una captura de consola sin evidencia reproducible"

- "no reimprime el PDF"
+ "no regenera ni publica un segundo artefacto"
```

---

### Diff 18 — Añadir diagrama de secuencia y handoff S46

```diff
diff --git a/src/lib/course/sections/s45-iac.ts b/src/lib/course/sections/s45-iac.ts
@@
       paragraphs: [
+        "**Mapa del flujo:** S44 publica un artefacto verificable → el productor " +
+        "crea un mensaje versionado → la cola entrega con lease → el worker reclama " +
+        "la idempotency key → escribe artefacto y status → confirma el mensaje. " +
+        "Si falla, reintenta con backoff; tras el máximo, pasa a DLQ y requiere redrive.",
@@
+    {
+      heading: "Handoff hacia S46",
+      paragraphs: [
+        "S45 garantiza un job individual durable, idempotente y operable. S46 añadirá " +
+        "ventanas, event time, watermarks, backfills, lineage y exactly-once " +
+        "end-to-end para pipelines de datos. No confundas una cola resiliente con un " +
+        "pipeline de producción completo."
+      ],
+    },
```

---

## 7. Recommended Priority Order for Fixing

### P0 — Bloqueadores de validez

1. **Eliminar clave posicional del examen** y reescribir distractores.
2. **Eliminar tautologías y alinear instruction/starter/solution/output**.
3. **Dejar de llamar durable a `dict`/`set`**; introducir persistencia real.
4. **Corregir IAM `get` vs `put`** en teoría, demo, proyecto y quiz.
5. **Reparar dedup/atomicidad** para que un crash no pierda ni duplique trabajo.

### P1 — Competencia Master

6. Añadir emulador/local durable, dos workers y failure injection.
7. Modelar visibility timeout, lease extension y carrera.
8. Completar DLQ con retención, runbook y redrive.
9. Convertir We Do E3 en integración/transferencia auténtica.
10. Hacer ejecutables IAM, egress, cuotas y observabilidad.
11. Definir envelope/versionado y máquina de estados.

### P2 — Correctitud y constructive alignment

12. Corregir autoscaling con unidades.
13. Corregir consistency vs replication y frecuencia RPO.
14. Reemplazar modelo IaC de sets por cambios/approval.
15. Mejorar FinOps con periodo, drivers y unit cost.
16. Mapear outcomes a proyecto, selfCheck y examen.
17. Añadir handoff explícito a S46.

### P3 — Redacción, carga cognitiva y recursos

18. Normalizar terminología español/inglés.
19. Sustituir callouts de harness por orientación al estudiante.
20. Añadir diagrama, timeline y tablas.
21. Reequilibrar recursos oficiales por proveedor/local.
22. Migrar `#iac` a `#cloud-queues` con alias compatible.

### Secuencia sugerida de PRs

1. `fix(s45): repair assessment contracts and remove harness residue`
2. `fix(s45): replace volatile job skeleton with durable local emulator`
3. `feat(s45): add concurrency, lease expiry and DLQ redrive labs`
4. `fix(s45): align IAM, autoscaling, IaC and recovery semantics`
5. `fix(exam-s45): rebuild plausible variants and balanced answer keys`
6. `docs(s45): normalize es-PE terminology, diagrams and S46 handoff`

---

## 8. Graph Memory Update Notes

### 8.1 Nodos confirmados

```yaml
S45:
  title: Cloud, almacenamiento, colas e infraestructura
  short_title: Cloud y colas
  current_id: iac
  level: Master
  hours: 20
  case: CASO-IQU-045
  canonical_source: src/lib/course/sections/s45-iac.ts
  exam_source: prisma/seed.ts#QUESTION_BANK.iac
```

### 8.2 Aristas curriculares

```yaml
edges:
  - S44.artifact -> S45.message_input
  - S38.concurrency -> S45.worker_failure_model
  - S41.job_api -> S45.job_status
  - S42.schemas_security -> S45.message_envelope_and_iam
  - S43.containers -> S45.worker_runtime
  - S45.durable_job -> S46.backfill_and_exactly_once_pipeline
```

### 8.3 Fortalezas a preservar

```yaml
preserve:
  - vendor_neutral_contracts
  - synthetic_peru_case
  - no_pii_no_real_secrets
  - cache_not_authoritative
  - ack_after_durable_effect
  - fail_closed_uncertainty
  - tested_restore
  - cost_owner_and_budget
  - negative_security_tests
  - roadmap_bridge_from_s44
```

### 8.4 Deuda prioritaria

```yaml
debt:
  P0:
    - volatile_state_labeled_durable
    - unsafe_idempotency_and_dual_write
    - exam_all_correct_index_1
    - implausible_exam_distractors
    - solution_output_harness_residue
    - iam_get_put_contradiction
  P1:
    - no_emulator_despite_roadmap
    - no_concurrency_or_failure_injection
    - incomplete_dlq_redrive_contract
    - nominal_not_authentic_fading
    - unused_security_and_quota_controls
  P2:
    - dimensionless_autoscaling
    - consistency_replication_conflation
    - daily_backup_vs_6h_rpo
    - oversimplified_iac_plan
    - underspecified_finops
    - missing_message_schema_and_observability
  P3:
    - terminology_spanglish
    - front_loaded_glossary
    - internal_gate_tone
    - legacy_iac_hash
```

### 8.5 Evidencia de cierre requerida para Fixer

```yaml
acceptance_evidence:
  - process_restart_preserves_status_artifact_dedup_and_dlq
  - two_workers_same_key_produce_one_effect
  - crash_between_writes_reconciles_safely
  - lease_expiry_test_causes_redelivery_without_duplicate_effect
  - dlq_redrive_replays_once_with_approval
  - iam_negative_tests_cover_action_resource_host
  - autoscaling_target_has_units_and_zero_worker_case
  - restore_test_validates_integrity_rpo_rto
  - iac_plan_test_covers_update_replace_delete_and_approval
  - exam_answer_positions_balanced
  - distractors_pass_plausibility_review
  - every_outcome_maps_to_practice_and_assessment
```

---

**This is the complete Explorer report for Section 45. Ready for the Fixer prompt.**
