# S30 Exercise Pedagogy Report (Round 1)

## Section
- **title:** Entity resolution probabilístico
- **shortTitle:** ER probabilístico
- **id:** `security-infra` (archivo `s30-security-infra.ts`; contenido = motor de entity resolution testeable CP-N3-A, no “infra de seguridad” genérica)
- **index:** 30
- **source:** `src/lib/course/sections/s30-security-infra.ts`
- **live:** https://pillb.github.io/pyarcana/
- **counts:** iDo **8**, weDo **24** (8 subtemas × E1/E2/E3), youDo **1** (total **33** unidades de práctica/demo)
- **subtemas:** S30-T1-A exact/edit/token/fecha · T1-B missing y frecuencia · T2-A blocking y candidate recall · T2-B costo e imposibles · T3-A pesos y umbrales · T3-B cola clerical y Union-Find · T4-A split por entidad · T4-B P/R, co-cluster y error slices
- **hilo de caso:** cierre **CP-N3-A** — motor ER sintético `CASO-LIM-030` (contactos Lima `@example.pe`); scores priorizan cola clerical; **nunca** auto-etiquetan fraude, parentesco ni colusión; hilo S29 (SQL de pares) → S30 (motor) → S31 (grafo de evidencia)

## Method
- Leído `PEDAGOGY_EXERCISE_SPEC.md` (campos, longitudes, checklist preamble/retrospective, fade E1→E2→E3).
- Inspeccionado manualmente cada `iDo.steps[]` (8 demos), `weDo.steps[]` (24 ejercicios) y `youDo` en `s30-security-infra.ts` (iDo ~434–657, weDo ~659–1567, youDo ~1569–1708).
- Contrastado con theory T1–T4, outcomes de CP-N3-A y ética del score (solo misma entidad).
- **Sin** generadores, bucles, plantillas ni copy-paste mecánico entre unidades.
- Prosa propuesta en **español profesional peruano**, un objetivo primario por unidad.

## Hallazgos transversales (antes del ledger)

| Campo / hábito | Estado actual en S30 |
|----------------|----------------------|
| I Do `preamble` | **Ausente** en las 8 demos |
| I Do `retrospective` | **Ausente** en las 8 demos |
| I Do `description` | Presente y técnica; nombra el skill del demo; no sustituye preamble formal |
| I Do `why` | Presente; suele ser **1–2 frases** (bajo o en el piso del rango 40–90 palabras del spec) |
| We Do `title` | **Ausente** en los 24 |
| We Do `preamble` | **Ausente** en los 24 |
| We Do `retrospective` | **Ausente** en los 24 |
| We Do `instruction` | Estilo denso “ID · Concepto + fixture + Error del starter + Caso 30 + salida esperada” en un solo párrafo: meta, éxito y a veces límites mezclados; legible para quien ya opera ER, **opaco** para newbie sin escena de contactos duplicados |
| We Do `feedback` | 1 frase; nombra el principio (bien); poco *por qué importa a la cola clerical / al batch nocturno / al README del portfolio* |
| Starter `# Error:` | **Excelente** hábito en todos; defectos bien nombrados y alineados a la solución |
| Hints | E1 casi-solución (aceptable para guided); E3 a veces da la fórmula casi completa (andamiaje mínimo OK para transfer) |
| You Do marco | `context` / `objectives` / `requirements` / `rubric` / `portfolioNote` / starter **sólidos** y con gate ético |
| You Do `retrospective` | **Ausente** |
| Código / outputs | Coherentes con theory y CP-N3-A; **no** proponer cambios de output salvo notas puntuales |
| Solape T2-A-E3 ↔ T2-B-E1 | Ambos practican `sum(n*(n-1)//2)`; el primero bajo “pares candidatos multi-bloque”, el segundo como “costo”. Fade real por subtema, pero el Fixer debe **diferenciar preambles** (candidatos vs. SLO de CPU) para que no se sientan clones |

**Patrón dominante:** el andamiaje de *código* (bugs nombrados, outputs canónicos, fade real E1→E3, política `filter_before_score`, label_space sin fraude, split anti-leakage) es maduro y alineado al cierre CP-N3-A. El andamiaje *pedagógico verbal* (preamble → instruction solo-tarea → retrospective) no existe. Un true newbie no responde con claridad: qué practico, por qué importa unir contactos Lima sintéticos antes del grafo S31, cómo sé que gané, qué debe quedarme al cerrar la pestaña.

**Fade E1→E2→E3 (contenido):** progresión real por subtema (p. ej. T1-A: exact post-norm → Jaccard unión → date_sim tolerancia; T3-A: score normalizado → decide banda gris → ítem clerical con explain; T4-A: train/test binario → prevalencia → cross_split explícito). **No** son tres clones con números distintos. El fade de *prosa* no se ve porque no hay preambles diferenciados.

**Severity default:** missing preamble+title+retrospective en We Do = **P0**; I Do sin preamble/retrospective = **P1** (aún tienen description+why+código); youDo sin retrospective = **P1**; polish de feedback/why = **P2** si caen preamble/instruction/retrospective.

---

## Unit ledger

### S30-T1-A-DEMO (iDo)
- **Diagnosis:** Demo sólida de `exact` post-`casefold`/espacios y Jaccard de tokens con orden invertido. La `description` nombra el skill; falta `preamble` que diga *qué observar* (email con distinta capitalización y nombre reordenado) y `retrospective` del misconception “si se ve igual a ojo, el string crudo basta”. El `why` es una frase.
- **Checklist:** context fail · goal partial · success partial (output visible) · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  Antes de puntuar un par de contactos del Caso 30, el motor necesita comparadores honestos. En esta demo un email sintético con distinta capitalización y un nombre con tokens reordenados («Ana López» / «López Ana») deben dar evidencia alta sin ser “el mismo string crudo”. No escribas aún: predice `exact` y `token_jaccard` y compara con la salida. Si omites `casefold` o el solapamiento de tokens, pierdes matches triviales que la cola clerical nunca debió ver.
- **Proposed instruction/description improvements:**  
  Mantener description. Ampliar `why` (~50–70 palabras): `exact` iguala tras normalizar espacios y mayúsculas; Jaccard captura orden libre de tokens; ambos devuelven score en [0,1] listo para el scorer didáctico. No es veredicto de identidad final. Puente a We Do: arreglar comparación cruda, corregir el denominador de Jaccard y añadir tolerancia de fechas.
- **Proposed retrospective:**  
  Si puedes explicar por qué `"A@example.pe"` y `"a@example.pe"` son match exacto *después* de normalizar, ya tienes el hábito de pre-comparación. El error clásico es comparar strings crudos y culpar al umbral. En We Do practicarás exact, tokens y fechas con defectos deliberados.
- **Code/output changes:** none
- **Validation notes:** Output `exact 1.0` / `token_jaccard 1.0` alineado a theory T1-A.

---

### S30-T1-A-E1 (weDo, guided)
- **Diagnosis:** Drill guiado claro: starter compara crudo (`a == b`) con espacios y mayúsculas. Instruction densa mezcla ID, meta, error y Pass; sin title, preamble ni retrospective. Feedback nombra el principio pero no ancla “por qué el batch de contactos Lima pierde matches obvios”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Exact post-normalización con casefold
- **Proposed preamble:**  
  - **Contexto:** en el motor ER del Caso 30, dos nombres sintéticos con espacios y distinta capitalización deben contar como acuerdo exacto.  
  - **Meta:** normalizar con `casefold` y colapso de espacios antes de comparar.  
  - **Éxito:** una sola línea `1.0` con `a = '  Ana  '` y `b = 'ana'`.  
  - **Límites:** no compares crudo; no imprimas etiquetas extra; solo datos sintéticos.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: `print(1.0 if a == b else 0.0)` (bug: comparación cruda).  
  2. Normaliza cada lado: `" ".join(s.casefold().split())`.  
  3. Imprime `1.0` si coinciden, `0.0` si no.  
  4. Verifica mentalmente: ambos lados deben quedar en `'ana'`.
- **Proposed feedback improvement:**  
  Exact en ER es igualdad *después* de normalizar. Sin `casefold` y sin colapsar espacios pierdes matches obvios y saturas la cola de review con “casi iguales” que el scorer debió resolver barato.
- **Proposed retrospective:**  
  Normalizar antes de igualar es el primer ladrillo del motor. El error clásico es culpar al umbral cuando el bug estaba en el string crudo. Siguiente (E2): Jaccard con unión, no con un solo conjunto.
- **Code/output changes:** none
- **Validation notes:** DEFECT bien nombrado; solution y output `1.0` correctos.

---

### S30-T1-A-E2 (weDo, independent)
- **Diagnosis:** Bug de denominador (`|ta|` vs `|unión|`) excelente para independiente. Instruction ya nombra la fórmula y el fixture; falta escena de nombres reordenados y cierre metacognitivo.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Jaccard de tokens con unión
- **Proposed preamble:**  
  - **Contexto:** el comparador de tokens del Caso 30 debe tratar «a b» y «b c» con solapamiento parcial, no como overlap sesgado.  
  - **Meta:** calcular Jaccard = |intersección| / |unión| de conjuntos de tokens.  
  - **Éxito:** una línea numérica ≈ `0.333…` (división exacta de Python).  
  - **Límites:** no dividas solo por `|ta|`; el orden de tokens no debe importar; no mutes los sets.
- **Proposed instruction/description improvements:**  
  1. Revisa el starter: `len(ta & tb) / len(ta)` (bug).  
  2. Cambia el denominador a `len(ta | tb)`.  
  3. Imprime solo el cociente.  
  4. No redondees a menos que la solución lo haga (aquí no).
- **Proposed retrospective:**  
  Jaccard usa la unión; dividir por un solo conjunto infla o sesga el score de nombre. Ese sesgo miente al umbral `auto_match`. Luego (E3) añades tolerancia temporal en fechas.
- **Code/output changes:** none
- **Validation notes:** Output canónico `0.3333333333333333`; E2 con menos migas que E1.

---

### S30-T1-A-E3 (weDo, transfer)
- **Diagnosis:** Transferencia real a `date_sim` con banda de tolerancia (0 / 1..3 / >3). Starter solo igualdad exacta — anti-patrón bueno. Falta preamble de “fechas cercanas ≠ non_match total” y retrospective de reutilización en el scorer multi-campo.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** date_sim con tolerancia de 3 días
- **Proposed preamble:**  
  - **Contexto:** en contactos sintéticos del Caso 30, dos fechas de alta separadas por 2 días no deben castigarse como desacuerdo total.  
  - **Meta:** implementar `date_sim` con banda: 0 días → 1.0; 1..`tol_days` → 0.5; resto → 0.0.  
  - **Éxito:** imprime `0.5` para 2026-01-01 y 2026-01-03 con `tol_days=3`.  
  - **Límites:** no devuelvas 0.0 en la banda de tolerancia; no uses PII real; tolerancia didáctica del lab.
- **Proposed instruction/description improvements:**  
  1. Lee el starter: tras `delta == 0` siempre retorna `0.0`.  
  2. Añade `if delta <= tol_days: return 0.5`.  
  3. Deja el `else` en `0.0`.  
  4. Imprime solo el resultado de la llamada dada.
- **Proposed retrospective:**  
  La tolerancia de fechas evita non_match espurios por desfases leves. El error clásico es igualdad binaria de fechas. Pregunta: ¿por qué 0.5 y no 1.0 dentro de la banda? (evidencia parcial, no acuerdo exacto.)
- **Code/output changes:** none
- **Validation notes:** Transfer auténtico a un cuarto comparador; alineado a theory T1-A.

---

### S30-T1-B-DEMO (iDo)
- **Diagnosis:** Worked example claro: `missing` vs `agree` y peso `1/freq` para «María» vs «Zoe». Description OK; falta preamble de “vacío no es pelea” y retrospective del misconception “missing = disagree fuerte”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  Cuando una fuente del Caso 30 no trae un campo, el motor no debe gritar “desacuerdo”. En esta demo clasificas vacío como `missing`, acuerdo casefold como `agree`, y bajas el peso de un nombre frecuente («María») frente a uno raro («Zoe»). No escribas: predice la línea de salida y por qué 0.025 no es “peor match moral”, solo menos evidencia de identidad.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: missing es estado de comparación; penalizarlo como disagree infla non-matches cuando la fuente nunca publica el campo; `base/frecuencia` es heurística didáctica, no m/u completo de Fellegi–Sunter. Puente a We Do: corregir la rama del vacío, invertir la fórmula de peso y modelar missing informativo por fuente.
- **Proposed retrospective:**  
  Vacío → `missing`; valor común → menos peso de acuerdo. El error clásico es empujar missing a `non_match` y saturar la cola. We Do: estados, rareza y cobertura por fuente.
- **Code/output changes:** none
- **Validation notes:** Output `missing agree 0.025 1.0` alineado a theory T1-B.

---

### S30-T1-B-E1 (weDo, guided)
- **Diagnosis:** Starter imprime `agree` en la rama del vacío — defect guiado perfecto para el contrato missing. Instruction telegráfica densa; sin escena de fuente incompleta. Sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Vacío se etiqueta missing
- **Proposed preamble:**  
  - **Contexto:** un par sintético del Caso 30 llega con un lado vacío (`a=''`, `b='x'`); el motor debe registrar ausencia, no inventar acuerdo.  
  - **Meta:** imprimir `missing` si falta valor; si no, `agree`/`disagree` por casefold.  
  - **Éxito:** una sola línea `missing`.  
  - **Límites:** no trates vacío como `agree` ni como `disagree`; no inventes valor relleno.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: la rama `not a or not b` imprime `"agree"` (bug).  
  2. Cámbiala a `"missing"`.  
  3. Deja el `else` con agree/disagree casefold.  
  4. Imprime una sola etiqueta.
- **Proposed retrospective:**  
  Missing es un estado, no un acuerdo disfrazado. Confundirlo con `agree` infla scores; con `disagree`, infla non-matches. Siguiente (E2): bajar el peso de valores frecuentes.
- **Code/output changes:** none
- **Validation notes:** DEFECT claro; Pass `missing` correcto.

---

### S30-T1-B-E2 (weDo, independent)
- **Diagnosis:** Bug `base * f` vs `base / f` — buen contrato de rareza didáctica. Instruction ya da fórmula y salida esperada; falta preamble de “María pesa menos que Ximena” y retrospective anti-“FS completo”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Peso de acuerdo por rareza
- **Proposed preamble:**  
  - **Contexto:** en contactos Lima sintéticos, un acuerdo en «María» aporta menos evidencia de identidad que en «Ximena».  
  - **Meta:** implementar `frequency_weight = base / frecuencia` con casefold.  
  - **Éxito:** una línea `0.02 0.5` (María y Ximena, redondeados a 3 decimales).  
  - **Límites:** divide, no multipliques; es heurística didáctica, no estimación m/u de producción.
- **Proposed instruction/description improvements:**  
  1. Revisa el starter: `return base * f` (bug).  
  2. Cámbialo a `base / f`.  
  3. Imprime ambos pesos redondeados a 3 decimales en una línea.  
  4. Busca en la tabla con `value.casefold()`.
- **Proposed retrospective:**  
  Más frecuente → menos peso de acuerdo. Multiplicar por frecuencia invierte la intuición y engaña al scorer. Luego (E3): decide si el missing de phone es informativo por fuente.
- **Code/output changes:** none
- **Validation notes:** Output `0.02 0.5` alineado a theory; fade independiente correcto.

---

### S30-T1-B-E3 (weDo, transfer)
- **Diagnosis:** Transfer a missing informativo por fuente (`crm_legacy` sin phone). Starter fuerza `mcar_candidate` — anti-patrón excelente. Falta preamble de “no asumas MCAR” y retrospective de modelado por `source_system`.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Missing informativo por fuente
- **Proposed preamble:**  
  - **Contexto:** la fuente `crm_legacy` del Caso 30 nunca publica teléfono (cobertura 0.0); no es “azar”, es diseño del sistema.  
  - **Meta:** etiquetar `informative_missing` si `phone_coverage == 0.0`; si no, `mcar_candidate`.  
  - **Éxito:** una línea `informative_missing` para `source = "crm_legacy"`.  
  - **Límites:** mira la tabla de cobertura; no rellenes phone como agree; no uses PII real.
- **Proposed instruction/description improvements:**  
  1. Lee el starter: siempre imprime `"mcar_candidate"`.  
  2. Consulta `coverage[source]["phone"]`.  
  3. Si es `0.0` → `informative_missing`; si no → `mcar_candidate`.  
  4. Imprime solo la etiqueta.
- **Proposed retrospective:**  
  Missing informativo se modela por fuente; asumir MCAR sin mirar cobertura es un error de diseño. En el You Do documentarás patrones de ausencia en el README del portfolio.
- **Code/output changes:** none
- **Validation notes:** Transfer auténtico; no es clone de E1/E2.

---

### S30-T2-A-DEMO (iDo)
- **Diagnosis:** Demo de blocking con buckets y candidate recall = 1.0 sobre gold sintético. Description y `why` correctos; falta preamble de “sin candidatos el scorer no ve el match” y retrospective del misconception “recall se imprime a mano”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  All-pairs es inviable: el blocking reduce candidatos a pares que comparten clave. En esta demo tres registros sintéticos caen en buckets por apellido|ciudad; el gold match (r1,r2) debe aparecer en candidatos y el recall se *calcula*, no se inventa. No escribas: predice `recall` y `ncand` y verifica por qué r3 no contamina el numerador.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: candidate recall = |gold ∩ candidates| / |gold|; si es bajo, ningún umbral posterior recupera el match. En theory el recall 0.0 por acentos es la lección de normalización; aquí la demo sana muestra 1.0 con claves ya plegadas. Puente a We Do: fold de tildes, intersección vs unión, y costo multi-bloque.
- **Proposed retrospective:**  
  Blocking sin recall medido es fe en ciego. El error clásico es “optimizar CPU” sin gold sintético. We Do: clave estable, recall honesto y pares por bloque.
- **Code/output changes:** none
- **Validation notes:** Output `recall 1.0` / `ncand 1` correcto; contraste útil con theory T2-A (recall 0.0 por acentos).

---

### S30-T2-A-E1 (weDo, guided)
- **Diagnosis:** Starter hace `casefold` sin plegar tildes → `lópez|lim` en vez de `lopez|lim`. Instruction ya enseña la lección de theory; falta preamble de escena y retrospective “por qué el gold cae en buckets distintos”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Clave de blocking con fold de acentos
- **Proposed preamble:**  
  - **Contexto:** en contactos Lima sintéticos, «López» y «Lopez» deben compartir bloque; sin plegar tildes el gold match se parte en dos buckets.  
  - **Meta:** construir `fold(last)|fold(city)[:3]` con casefold + reemplazo de tildes.  
  - **Éxito:** una línea `lopez|lim`.  
  - **Límites:** no dejes `lópez|lim`; prefijo de ciudad de 3 caracteres ya plegados; solo datos sintéticos.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: `fold` solo hace `casefold` (bug).  
  2. Añade replace de á→a, é→e, í→i, ó→o, ú→u.  
  3. Imprime `f"{fold(last)}|{fold(city)[:3]}"`.  
  4. No alteres el formato del pipe.
- **Proposed retrospective:**  
  Clave inestable = candidate recall 0.0 aunque el scorer sea perfecto. El error clásico es normalizar “a medias”. Siguiente (E2): medir recall con intersección, no con unión.
- **Code/output changes:** none
- **Validation notes:** Misma lección que theory T2-A; solution `lopez|lim` correcta.

---

### S30-T2-A-E2 (weDo, independent)
- **Diagnosis:** Bug `gold | candidates` vs `gold & candidates` — excelente para independent. Instruction ya advierte sobreestimación; falta preamble de “matches invisibles” y retrospective de por qué el scorer no puede salvar un recall 0.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Candidate recall con intersección
- **Proposed preamble:**  
  - **Contexto:** el batch nocturno del Caso 30 mide cuántos gold matches sobrevivieron al blocking.  
  - **Meta:** imprimir `|gold ∩ candidates| / |gold|`.  
  - **Éxito:** el float `0.5` con el fixture dado (1 de 2 gold en candidatos).  
  - **Límites:** intersección en el numerador; denominador = |gold|; no uses unión.
- **Proposed instruction/description improvements:**  
  1. Revisa el starter: `len(gold | candidates) / len(gold)` (bug).  
  2. Cambia a `gold & candidates`.  
  3. Imprime el cociente.  
  4. No inventes el 0.5 a mano: derívalo de los sets.
- **Proposed retrospective:**  
  Unión en el numerador infla el recall y esconde matches perdidos. Candidate recall bajo = matches que el scorer nunca ve. Luego (E3): cuenta pares candidatos por tamaño de bloque.
- **Code/output changes:** none
- **Validation notes:** Output `0.5` correcto; independiente bien calibrado.

---

### S30-T2-A-E3 (weDo, transfer)
- **Diagnosis:** Transfer a costo de pares multi-bloque (`C(n,2)` sumado). Starter suma tamaños. **Nota de solape:** T2-B-E1 repite la misma fórmula con sizes distintos; el Fixer debe anclar este E3 a “espacio de candidatos del blocking” y el de T2-B a “SLO de CPU / filter_before_score”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Pares candidatos multi-bloque
- **Proposed preamble:**  
  - **Contexto:** tras el blocking del Caso 30, el total de pares candidatos es la suma de combinaciones por bloque, no la suma de tamaños.  
  - **Meta:** calcular `sum(n*(n-1)//2 for n in sizes)` con `sizes=[2,4,3]`.  
  - **Éxito:** el entero `10` (1+6+3).  
  - **Límites:** no uses `sum(sizes)`; no cuentes pares entre bloques distintos; bloque 0/1 → 0 pares.
- **Proposed instruction/description improvements:**  
  1. Lee el starter: `print(sum(sizes))` → 9 (bug).  
  2. Reemplaza por la suma de `n*(n-1)//2`.  
  3. Imprime solo el entero.  
  4. Verifica: 2→1, 4→6, 3→3.
- **Proposed retrospective:**  
  C(n,2) por bloque es el tamaño del espacio que llega al scorer (antes de filtros). Confundir tamaño de bloque con pares subestima el costo. En T2-B verás el mismo número como SLO de CPU y la política `filter_before_score`.
- **Code/output changes:** none
- **Validation notes:** Output `10` correcto; diferenciar prosa respecto a S30-T2-B-E1.

---

### S30-T2-B-DEMO (iDo)
- **Diagnosis:** Demo corta de `pair_cost([5,20])=200` e `impossible(person,org)=True`. Falta preamble de pipeline sano y retrospective de “filter_before_score no es eslogan”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  Candidate recall alto no basta si un bloque explota. En esta demo calculas el costo de pares en bloques de tamaño 5 y 20, y marcas person vs. org como par imposible *antes* del scorer. No escribas: predice `cost` e `impossible` y recuerda la política `filter_before_score` del Caso 30.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: C(5,2)+C(20,2)=10+190=200; tipos distintos saltan similitudes caras; el filtro va *antes* del scorer, no como post-maquillaje de métricas. Puente a We Do: costo, desigualdad de tipos y conteo de pares kept.
- **Proposed retrospective:**  
  Costo de pares y filtro de imposibles protegen CPU y calidad. El error clásico es scorear person–org y “limpiar” después. We Do: costo, impossible y política de pipeline.
- **Code/output changes:** none
- **Validation notes:** Output `cost 200` / `impossible True` alineado a theory T2-B.

---

### S30-T2-B-E1 (weDo, guided)
- **Diagnosis:** Mismo patrón de bug que T2-A-E3 (`sum(sizes)` vs C(n,2)) con sizes [3,5]→13. Instruction clara; falta escena de SLO y diferenciación explícita del E3 de T2-A.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Costo de pares por bloque
- **Proposed preamble:**  
  - **Contexto:** el SLO del batch del Caso 30 vigila cuántos pares se enviarían al scorer si no filtras.  
  - **Meta:** sumar C(n,2) por bloque con `sizes=[3,5]`.  
  - **Éxito:** el entero `13` (3+10).  
  - **Límites:** no sumes solo tamaños; monitorea también `max(block size)` en el motor real.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: `print(sum(sizes))` → 8 (bug).  
  2. Usa `sum(n*(n-1)//2 for n in sizes)`.  
  3. Imprime solo el costo.  
  4. No inventes 13 a mano: derívalo.
- **Proposed retrospective:**  
  El costo global es suma de costos por bloque. Confundir tamaño con pares subestima el batch. Siguiente (E2): marcar person≠org como impossible.
- **Code/output changes:** none (mantener fixture [3,5]; no unificar con T2-A-E3)
- **Validation notes:** Solape conceptual con T2-A-E3; preambles deben distinguir “candidatos” vs “SLO de costo”.

---

### S30-T2-B-E2 (weDo, independent)
- **Diagnosis:** Starter imprime `==` en vez de `!=` — drill simple pero correcto. Instruction ya dice que True = saltar scorer; falta preamble de política y retrospective de CPU/scores basura.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Filtro person vs org
- **Proposed preamble:**  
  - **Contexto:** en el fixture del Caso 30, person y org no se fusionan; gastar edit distance en ese par es basura.  
  - **Meta:** imprimir `True` (saltar scorer) cuando los tipos difieren.  
  - **Éxito:** una línea `True` con `ta="person"`, `tb="org"`.  
  - **Límites:** `True` = impossible; no inviertas a igualdad; no etiquetes fraude.
- **Proposed instruction/description improvements:**  
  1. Revisa el starter: `print(ta == tb)` (bug).  
  2. Cambia a `ta != tb`.  
  3. Imprime solo el booleano.  
  4. Interpreta True como “no gastes similitud”.
- **Proposed retrospective:**  
  Impossible ahorra CPU y evita scores basura en la cola. El error clásico es comparar todo “por si acaso”. Luego (E3): cuenta cuántos pares sobreviven al filtro y nombra la política.
- **Code/output changes:** none
- **Validation notes:** Output `True` correcto; E2 mínimo pero honesto.

---

### S30-T2-B-E3 (weDo, transfer)
- **Diagnosis:** Transfer de pipeline: filtrar same-type y imprimir política `filter_before_score`. Starter cuenta todos y dice `score_first` — anti-patrón excelente. Falta preamble de orden del pipeline y retrospective de política medible.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** filter_before_score en el pipeline
- **Proposed preamble:**  
  - **Contexto:** el pipeline sano del Caso 30 es blocking → filtro de imposibles → scorer → umbrales.  
  - **Meta:** contar pares same-type y declarar la política `filter_before_score`.  
  - **Éxito:** dos líneas: `2` y `filter_before_score`.  
  - **Límites:** person–org no entra; no imprimas `score_first`; no etiquetes fraude.
- **Proposed instruction/description improvements:**  
  1. Lee el starter: `kept = len(pairs)` y `"score_first"`.  
  2. Filtra con `a["type"] == b["type"]`.  
  3. Imprime `kept` y luego `filter_before_score`.  
  4. No scores aún: aquí solo cuentas kept.
- **Proposed retrospective:**  
  La política se mide en pares kept, no en un eslogan del README. Invertir el orden paga similitudes caras inútilmente. En T3 puntuarás solo candidatos viables.
- **Code/output changes:** none
- **Validation notes:** Output de dos líneas correcto; transfer real de política.

---

### S30-T3-A-DEMO (iDo)
- **Diagnosis:** Demo de score ponderado 0.94 → `auto_match`. Description/`why` correctos; falta preamble de umbrales duales y retrospective de “0.94 no es probabilidad calibrada”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  Con candidatos filtrados, el scorer didáctico del Caso 30 combina similitudes con pesos y decide con umbrales duales. En esta demo name=0.9 (w=0.6) y email=1.0 (w=0.4) deben dar 0.94 y `auto_match`. No escribas: predice el score y por qué un 0.875 con phone en 0.0 (theory) caería a `review` en vez de auto.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: score = suma(sim·w)/suma(w); ≥t_high auto_match; ≤t_low non_match; banda gris → review con explicación. No es FS completo ni probabilidad calibrada; nunca `auto_fraud`. Puente a We Do: normalizar, decidir banda gris y armar ítem clerical.
- **Proposed retrospective:**  
  Umbrales duales protegen operaciones: lo dudoso va a humanos. El error clásico es un solo corte y auto-etiquetar de más. We Do: normalización, `review` y explain por campo.
- **Code/output changes:** none
- **Validation notes:** Output `0.94 auto_match` alineado a theory T3-A.

---

### S30-T3-A-E1 (weDo, guided)
- **Diagnosis:** Starter no divide por sum(w) → 0.75 “a ojo” pero imprime 0.75 sin normalizar… wait: `1*0.5 + 0.5*0.5 = 0.75` and with normalize also 0.75 because weights sum to 1. Actually both give 0.75 when weights sum to 1.0! Let me check: starter prints `1 * 0.5 + 0.5 * 0.5` = 0.75, solution is `(1 * 0.5 + 0.5 * 0.5) / (0.5 + 0.5)` = 0.75/1.0 = 0.75. Same output! The pedagogical defect is real when weights don't sum to 1, but here they do so the bug is invisible by output alone. I should note this as a validation concern - the Fixer might want weights that don't sum to 1 so the defect is observable... Actually looking again - both produce 0.75 so a student could "pass" without fixing if they only check output. This is a real pedagogical issue - P1 for code/output alignment.

Actually the student needs to match solution code behavior - tests say "salida coincide con solution output". If they leave the starter, they get 0.75 which matches. So they can "pass" without learning. That's a P1 code pedagogy issue worth flagging.

I'll note: **Code/output risk:** con pesos 0.5+0.5 el bug es indetectable por salida; proponer pesos que no sumen 1 (p. ej. 0.6 y 0.4, o 1 y 1) para que el starter falle.
- **Checklist:** context fail · goal pass · success pass (pero defect no se ve en output) · constraints fail · retrospective fail
- **Severity:** P0 (missing fields) + nota de código P1
- **Proposed title:** Score ponderado normalizado
- **Proposed preamble:**  
  - **Contexto:** el scorer didáctico del Caso 30 normaliza por la suma de pesos para que `t_high` sea comparable entre pares.  
  - **Meta:** calcular `(sim·w)` sumado y dividir por `sum(w)`.  
  - **Éxito:** una línea `0.75` (con el fixture de pesos del ejercicio).  
  - **Límites:** no dejes solo la suma numerador; no vendas el score como probabilidad calibrada.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: imprime solo `1*0.5 + 0.5*0.5` (falta dividir).  
  2. Divide por `(0.5 + 0.5)`.  
  3. Imprime el cociente.  
  4. (Recomendado al Fixer: si se cambian pesos a 0.6/0.4, el starter fallará de verdad.)
- **Proposed retrospective:**  
  Sin normalizar, el umbral pierde significado cuando los pesos no suman 1. El error clásico es “el número se ve bien en un par y miente en el siguiente”. Siguiente (E2): banda gris → `review`.
- **Code/output changes:** **recomendado** — cambiar fixture a pesos que no sumen 1 (p. ej. name w=0.6, email w=0.4, sims 1.0 y 0.5 → num=0.8, den=1.0 → 0.8; starter sin dividir daría 0.8 solo si… wait 1*0.6+0.5*0.4=0.8, /1.0=0.8 still same if we only have those. Better: weights 1.0 and 1.0, sims 1.0 and 0.5 → num=1.5, den=2 → 0.75; starter without divide prints 1.5. Perfect.
  
  Proposed code change:  
  ```python
  # starter
  print(1 * 1.0 + 0.5 * 1.0)  # 1.5 bug
  # solution  
  print((1 * 1.0 + 0.5 * 1.0) / (1.0 + 1.0))  # 0.75
  ```
  O mantener pesos 0.5/0.5 pero entonces documentar que el bug es conceptual y el test de salida no lo atrapa (peor).
- **Validation notes:** Output actual `0.75` con pesos que suman 1 hace el defect **invisible**; prioridad de fix de código media-alta.

---

### S30-T3-A-E2 (weDo, independent)
- **Diagnosis:** Starter siempre `auto_match` con score 0.7 en banda gris — independent perfecto. Instruction ya da la regla; falta preamble de protección operativa y retrospective anti-auto_fraud.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Umbrales duales y banda review
- **Proposed preamble:**  
  - **Contexto:** un score 0.7 del Caso 30 no debe auto-fusionar entidades: la operación prefiere humanos en la banda gris.  
  - **Meta:** decidir con t_high=0.9 y t_low=0.5.  
  - **Éxito:** una línea `review`.  
  - **Límites:** no fuerces `auto_match`; no inventes label `fraud`; ≥t_high / ≤t_low / else.
- **Proposed instruction/description improvements:**  
  1. Revisa el starter: siempre imprime `"auto_match"`.  
  2. Implementa la triple rama (o ternario anidado).  
  3. Imprime solo la decisión.  
  4. Con s=0.7 debe ser `review`.
- **Proposed retrospective:**  
  La banda gris es diseño, no limbo: protege operaciones con evidencia y humanos. Un solo umbral o auto siempre es el error clásico. Luego (E3): arma el ítem de cola con score, decisión y explain.
- **Code/output changes:** none
- **Validation notes:** Output `review` correcto; umbrales alineados a theory.

---

### S30-T3-A-E3 (weDo, transfer)
- **Diagnosis:** Transfer a ítem clerical completo (score normalizado, decision, explain). Starter omite email y no normaliza — compuesto excelente. Falta preamble de “cola accionable” y retrospective de explicabilidad.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Ítem clerical con explain por campo
- **Proposed preamble:**  
  - **Contexto:** el revisor del Caso 30 no puede actuar sobre un 0.91 opaco: necesita score, decisión y aportes por campo.  
  - **Meta:** construir dict con `score` (redondeado a 3), `decision` y `explain` (copia de sims).  
  - **Éxito:** `{'score': 0.875, 'decision': 'review', 'explain': {'name': 0.95, 'email': 1.0, 'phone': 0.0}}`.  
  - **Límites:** normaliza el score; no omitas email/phone en explain; no `auto_match` ciego.
- **Proposed instruction/description improvements:**  
  1. Lee el starter: score sin `/sum(w)`, decision forzada, explain incompleto.  
  2. Normaliza score; decide con 0.9/0.5.  
  3. `explain = dict(sims)` completo.  
  4. Imprime el dict con `round(score, 3)`.
- **Proposed retrospective:**  
  Sin explicación por campo la cola no es accionable. El error clásico es un score solo y un auto_match optimista. En T3-B unirás decisiones y clusters con Union-Find.
- **Code/output changes:** none
- **Validation notes:** Output dict exacto; transfer real a producto clerical.

---

### S30-T3-B-DEMO (iDo)
- **Diagnosis:** Demo de Union-Find con aprobación clerical e3–e4 → mismo cluster e1…e4. Falta preamble de transitividad y retrospective de “puente falso sobrefundе”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  Decidir un par no termina el trabajo: la fusión de entidades es transitiva. En esta demo auto-matches e1–e2–e3 más una aprobación clerical e3–e4 cierran el cluster. No escribas: predice si `find(e1)==find(e4)` y por qué un merge mal validado puede sobrefundir nodos que irán al grafo S31.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: Union-Find materializa A=B y B=C ⇒ A=C; la aprobación clerical es un `union` explícito con label_space match/non_match/uncertain (sin fraud). Valida el merge, no solo el `union`. Puente a We Do: transitividad, ítem de cola y filtro de labels ajenos.
- **Proposed retrospective:**  
  La transitividad es el corazón de la fusión exportable a S31. El error clásico es unir sin validar un puente dudoso. We Do: cluster, contrato de cola y alcance ético de labels.
- **Code/output changes:** none
- **Validation notes:** Output `True review_applied` correcto.

---

### S30-T3-B-E1 (weDo, guided)
- **Diagnosis:** Starter une solo 1–2 y deja 3 aislado — guided perfecto para transitividad. Instruction corta; falta escena de fusión de entidades y retrospective de puente.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Union-Find con transitividad
- **Proposed preamble:**  
  - **Contexto:** en el Caso 30, si e1=e2 y e2=e3, el export a S31 debe ver un solo cluster.  
  - **Meta:** unir 1–2 y 2–3 e imprimir si `find(1)==find(3)`.  
  - **Éxito:** una línea `True`.  
  - **Límites:** no dejes 3 aislado; no uses labels de fraude; path compression opcional.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: solo `union(1, 2)` (bug).  
  2. Añade `union(2, 3)`.  
  3. Imprime `find(1) == find(3)`.  
  4. No reescribas find/union a menos que falles el test.
- **Proposed retrospective:**  
  La transitividad del cluster es la fusión de entidades. Olvidar un `union` parte el cluster y castiga co-cluster completeness. Siguiente (E2): contrato del ítem de cola sin `fraud`.
- **Code/output changes:** none
- **Validation notes:** Output `True` correcto.

---

### S30-T3-B-E2 (weDo, independent)
- **Diagnosis:** Starter incluye `fraud` en actions — excelente gate ético. Instruction ya nombra label_space; falta preamble de contrato ético y retrospective de borde del sistema.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Cola clerical sin label fraud
- **Proposed preamble:**  
  - **Contexto:** el ítem de revisión del Caso 30 lleva par, score, explain y acciones humanas; el espacio de labels de ER no incluye fraude.  
  - **Meta:** construir el dict con `actions = ['match', 'non_match', 'uncertain']`.  
  - **Éxito:** dict completo con esas actions (sin `fraud`).  
  - **Límites:** no añadas parentesco ni colusión; conserva pair/score/explain dados.
- **Proposed instruction/description improvements:**  
  1. Revisa el starter: `actions` incluye `"fraud"`.  
  2. Reemplaza por match / non_match / uncertain.  
  3. Imprime el dict del ítem.  
  4. No alteres score ni explain.
- **Proposed retrospective:**  
  El label_space define el contrato ético del motor en la cola. Meter `fraud` es un bug de alcance, no un “feature”. Luego (E3): filtra una lista propuesta de labels ajenos.
- **Code/output changes:** none
- **Validation notes:** Output dict canónico; gate ético alineado a CP-N3-A.

---

### S30-T3-B-E3 (weDo, transfer)
- **Diagnosis:** Transfer de filtrado de alcance (`fraud`, `kinship` fuera). Starter deja pasar todo — bueno. Falta preamble de borde del sistema y retrospective de path de investigación vs ER.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Filtrar labels ajenos a ER
- **Proposed preamble:**  
  - **Contexto:** una propuesta de producto mete `fraud` y `kinship` en el motor de matching; el borde del sistema del Caso 30 debe filtrarlos.  
  - **Meta:** devolver solo labels permitidos en el orden de aparición.  
  - **Éxito:** `['match', 'non_match', 'uncertain']`.  
  - **Límites:** no dejes pasar fraud/kinship; no reordenes alfabéticamente; ER solo decide misma entidad.
- **Proposed instruction/description improvements:**  
  1. Lee el starter: imprime `proposed` sin filtrar.  
  2. Filtra con `allowed = {"match", "non_match", "uncertain"}`.  
  3. Usa comprensión que preserve el orden de `proposed`.  
  4. Imprime la lista filtrada.
- **Proposed retrospective:**  
  ER responde “¿misma entidad?”; parentesco y fraude son otras tareas. Filtrar en el borde evita que el score de matching se convierta en acusación. En T4 medirás el motor sin leakage.
- **Code/output changes:** none
- **Validation notes:** Output de lista exacta; transfer ético real.

---

### S30-T4-A-DEMO (iDo)
- **Diagnosis:** Demo de entity split: train 2 / test 1. Falta preamble de leakage y retrospective de “la misma identidad no entrena y examina”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  Sin evaluación honesta el motor es teatro. En esta demo el train solo incluye entidades {e1,e2,e3}; el par e4–e5 cae en test. No escribas: predice los conteos y por qué un split aleatorio de *pares* con entidades compartidas infla el F1 del notebook y falla con contactos nuevos del Caso 30.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: un par es train solo si ambos extremos ⊆ train_e; si no, no es train (en demos simples se etiqueta test; en E3 se distingue cross_split). Leakage de identidad engaña al cierre CP-N3-A. Puente a We Do: etiqueta train/test, prevalencia y cross_split.
- **Proposed retrospective:**  
  Split por entidad es la guardia anti-leakage. El error clásico es partir pares al azar. We Do: clasificación, base rate y pares mixtos.
- **Code/output changes:** none
- **Validation notes:** Output `train 2 test 1` correcto; nota: la demo no separa cross_split (lo hace E3).

---

### S30-T4-A-E1 (weDo, guided)
- **Diagnosis:** Starter invierte train/test — guided claro. Instruction telegráfica; falta escena de hold-out de entidades y retrospective de subset.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Etiqueta train por subset de entidades
- **Proposed preamble:**  
  - **Contexto:** al calibrar umbrales del Caso 30, un par solo es train si ambas entidades están en el conjunto de entrenamiento.  
  - **Meta:** imprimir `train` o `test` según `{a,b} ⊆ train_e`.  
  - **Éxito:** `train` para e1,e2 con train_e={e1,e2,e3}.  
  - **Límites:** no inviertas la lógica; un par mixto no es train limpio.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: imprime `"test" if subset else "train"` (bug invertido).  
  2. Corrige a `"train" if {a,b} <= train_e else "test"`.  
  3. Imprime solo la etiqueta.  
  4. No mutes train_e.
- **Proposed retrospective:**  
  Subset de entidades → train. Invertir la rama es un bug silencioso de evaluación. Siguiente (E2): prevalencia de matches en el gold.
- **Code/output changes:** none
- **Validation notes:** Output `train` correcto.

---

### S30-T4-A-E2 (weDo, independent)
- **Diagnosis:** Starter invierte n/matches → 5.0 en vez de 0.2. Instruction ya advierte accuracy engañoso; falta preamble de rareza de matches y retrospective de documentar base rate.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Prevalencia de matches en el gold
- **Proposed preamble:**  
  - **Contexto:** en ER real y en el gold del Caso 30 los matches suelen ser raros; un accuracy alto engaña.  
  - **Meta:** calcular `matches / n` con 1 match de 5 pares.  
  - **Éxito:** el float `0.2`.  
  - **Límites:** no inviertas la razón; documenta prevalencia junto a P/R en el portfolio.
- **Proposed instruction/description improvements:**  
  1. Revisa el starter: `print(n / matches)` (bug).  
  2. Cambia a `matches / n`.  
  3. Imprime el cociente.  
  4. No redondees salvo que el test lo pida.
- **Proposed retrospective:**  
  La base rate contextualiza P/R: sin ella, accuracy miente. El error clásico es omitir prevalencia en el README. Luego (E3): marca pares mixtos como `cross_split`.
- **Code/output changes:** none
- **Validation notes:** Output `0.2` correcto.

---

### S30-T4-A-E3 (weDo, transfer)
- **Diagnosis:** Transfer anti-leakage de tres etiquetas train/test/cross_split. Starter trata mixto como test — anti-patrón de leakage disfrazado, excelente. Falta preamble fuerte de por qué el par mixto contamina y retrospective de métricas primarias.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** train, test y cross_split
- **Proposed preamble:**  
  - **Contexto:** un par con un pie en train y otro fuera no es hold-out limpio: la entidad de train reaparece en “evaluación”.  
  - **Meta:** etiquetar train (ambos en train_e), test (ninguno en train_e), cross_split (mezcla).  
  - **Éxito:** `['train', 'test', 'cross_split']` para los tres pares del fixture.  
  - **Límites:** no trates el mixto como test; excluye cross_split de P/R primario.
- **Proposed instruction/description improvements:**  
  1. Lee el starter: cualquier no-train cae en `"test"`.  
  2. Añade rama `ents.isdisjoint(train_e) → "test"`.  
  3. El resto mixto → `"cross_split"`.  
  4. Imprime la lista de etiquetas en orden de pares.
- **Proposed retrospective:**  
  Cross_split fuera de métricas primarias evita leakage disfrazado. El error clásico es “todo lo que no es train es test”. En T4-B medirás P/R y slices sobre predicciones honestas.
- **Code/output changes:** none
- **Validation notes:** Output lista exacta; mejor E3 de la sección en anti-leakage.

---

### S30-T4-B-DEMO (iDo)
- **Diagnosis:** Demo rica: precisión 1.0, recall 0.5, error idx [1], co-cluster completeness 0.5 y quality 1.0. Falta preamble de “pairwise no basta” y retrospective de clusters partidos vs sobrefundidos.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  Un F1 pairwise alto puede esconder clusters partidos o sobrefundidos. En esta demo calculas precisión/recall, índices de error (semilla de slices) y dos vistas de co-cluster sobre un cluster sintético partido. No escribas: predice por qué completeness es 0.5 y quality es 1.0, y qué reportarías en el README del cierre CP-N3-A.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: precisión castiga FP de auto_match; recall castiga matches perdidos; co-cluster completeness ≈ recall de uniones; co-cluster quality ≈ precisión de uniones. Error indices alimentan slices (`missing_phone`, …), no acusaciones de fraude. Puente a We Do: precisión desde tp/fp, recall, y agregación de slices.
- **Proposed retrospective:**  
  Reporta pairwise + ambas vistas de co-cluster. El error clásico es un solo F1 de notebook. We Do: derivar P y R y priorizar slices de error.
- **Code/output changes:** none
- **Validation notes:** Output multi-línea alineado a theory T4-B.

---

### S30-T4-B-E1 (weDo, guided)
- **Diagnosis:** Starter usa `sum(y_pred)` y un cociente trivial — guided bueno para tp/fp. Instruction ya da el número 0.67; falta preamble de castigo a FP y retrospective de por qué no “contar positivos”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Precisión pairwise desde tp y fp
- **Proposed preamble:**  
  - **Contexto:** en el hold-out del Caso 30, un auto_match falso duele a operaciones; la precisión lo castiga.  
  - **Meta:** contar tp (t=1∧p=1) y fp (t=0∧p=1) e imprimir `round(tp/(tp+fp), 2)`.  
  - **Éxito:** `0.67` con los vectores dados (tp=2, fp=1).  
  - **Límites:** no uses solo `sum(y_pred)`; recorre `zip(y_true, y_pred)`.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: `pred_pos = sum(y_pred)` y cociente 1.0 (bug).  
  2. Calcula tp y fp con generadores o bucles.  
  3. Imprime `round(tp/(tp+fp), 2)`.  
  4. Verifica mentalmente: 2/3 → 0.67.
- **Proposed retrospective:**  
  Precisión se deriva de tp/fp, no de un conteo mágico de predicciones. El error clásico es “cuántos dije match” sin mirar el gold. Siguiente (E2): recall con fn.
- **Code/output changes:** none
- **Validation notes:** Output `0.67` correcto (float redondeado).

---

### S30-T4-B-E2 (weDo, independent)
- **Diagnosis:** Starter usa `(tp+fn)/(tp+fn)=1.0` siempre — independent limpio. Instruction corta; falta preamble de matches perdidos y retrospective de puente a candidate recall.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Recall pairwise con fn
- **Proposed preamble:**  
  - **Contexto:** si el motor del Caso 30 pierde matches (fn), el recall pairwise cae — a veces por blocking incompleto, a veces por umbral agresivo.  
  - **Meta:** calcular `tp/(tp+fn)` con tp=2, fn=2.  
  - **Éxito:** el float `0.5`.  
  - **Límites:** no uses `(tp+fn)` en el numerador; interpreta fn como matches perdidos.
- **Proposed instruction/description improvements:**  
  1. Revisa el starter: numerador `tp+fn` (bug).  
  2. Usa solo `tp` en el numerador.  
  3. Imprime el cociente.  
  4. No inventes F1 aquí (queda para el You Do).
- **Proposed retrospective:**  
  Recall pairwise complementa candidate recall de blocking: uno mira el scorer, el otro el embudo previo. El error clásico es un numerador que siempre da 1.0. Luego (E3): agrega errores por slice.
- **Code/output changes:** none
- **Validation notes:** Output `0.5` correcto.

---

### S30-T4-B-E3 (weDo, transfer)
- **Diagnosis:** Transfer a error slices con Counter y max. Starter devuelve `[]` — bueno. Falta preamble de “hipótesis de mejora, no acusación” y retrospective de slices accionables.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Error slices de mayor conteo
- **Proposed preamble:**  
  - **Contexto:** los índices de error del Caso 30 se rebanan por causa (`missing_phone`, apellido común, ciudad) para priorizar mejoras del motor.  
  - **Meta:** listar slices con conteo máximo de `error=True`.  
  - **Éxito:** `['missing_phone']`.  
  - **Límites:** solo filas con error; en empate, varias claves; no conviertas el error en label de fraude.
- **Proposed instruction/description improvements:**  
  1. Lee el starter: imprime `[]`.  
  2. Cuenta con `Counter` (o dict) por `slice` donde `error`.  
  3. Toma `max` del conteo y filtra claves empatadas.  
  4. Imprime la lista de slices top.
- **Proposed retrospective:**  
  Los slices convierten fallos en hipótesis de mejora (más blocking, más peso a phone, etc.). El error clásico es un índice suelto sin agregación. En el You Do reportarás slices en el README del portfolio.
- **Code/output changes:** none
- **Validation notes:** Output `['missing_phone']` correcto; transfer real de diagnóstico.

---

### youDo — Motor de entity resolution testeable — cierre CP-N3-A (youDo)
- **Diagnosis:** Marco de proyecto **fuerte**: context, objectives, requirements, rubric con gate ético, portfolioNote y starter con stubs `NotImplementedError` bien acotados. Falta `retrospective` de defensa metacognitiva post-build (spec §8.3). Sin ella el learner cierra el tab sin ritual de “qué invariante demuestro / PII / impacto medible”.
- **Checklist:** context pass · goal pass · success pass (rubric) · constraints pass · retrospective **fail**
- **Severity:** P1
- **Proposed title:** (ya existe) Motor de entity resolution testeable — cierre CP-N3-A
- **Proposed preamble:** N/A como campo separado — el `context` actual ya cumple rol de escena; opcionalmente el Fixer puede dejar 2–3 frases de “éxito observable” al final del context si se desea checklist 1:1 con We Do.
- **Proposed instruction/description improvements:**  
  Mantener objectives/requirements/rubric. Sugerencia menor de claridad (no bloqueante): en el starter, comentar explícitamente que `entity_split` debe devolver también `cross_split` y que las métricas primarias lo excluyen (ya está en objectives; reforzar en docstring del stub).
- **Proposed retrospective:**  
  Antes de marcar listo: (1) ¿qué invariante demuestras con un test o print — candidate recall del blocking, o P/R sin pares `cross_split`? (2) ¿qué harías distinto con datos reales vs. el fixture `CASO-LIM-030` (PII, consentimientos, ausencia por fuente)? (3) En el README, una frase de impacto medible (p. ej. “antes all-pairs / después recall X y cola clerical explicable”) que puedas defender en 30 segundos sin invocar fraude ni parentesco. Pregunta de cierre: si un score 0.91 no trae vector de aportes, ¿por qué el revisor debe rechazarlo como evidencia insuficiente?
- **Code/output changes:** none obligatorio; starter ya alineado a T1–T4
- **Validation notes:** Rubric y gate ético listos para CP-N3-A; solo falta cierre metacognitivo.

---

## Priority order

### P0 (hacer primero — We Do verbal scaffolding)
1. Añadir `title` + `preamble` + `retrospective` a los **24** We Do (textos propuestos en el ledger).
2. Separar `instruction` a pasos solo-tarea (4 pasos típicos); mover escena/meta/éxito/límites al preamble.
3. Diferenciar preambles de **S30-T2-A-E3** vs **S30-T2-B-E1** (candidatos vs SLO de costo) para no sentir clones.
4. Fortalecer `feedback` donde el ledger ofrece mejora (al menos E1 de cada subtema).

### P1 (I Do + You Do + defect invisible)
5. Añadir `preamble` + `retrospective` a las **8** demos I Do; ampliar `why` hacia 40–90 palabras.
6. Añadir `retrospective` al **youDo**.
7. **S30-T3-A-E1:** hacer el defect observable por salida (pesos que no sumen 1, p. ej. w=1.0 y 1.0 → starter imprime 1.5, solution 0.75) *o* documentar limitación del test.

### P2 (polish)
8. Unificar tono de feedback (25–60 palabras) en todos los We Do restantes.
9. Opcional: docstring en stubs del youDo que recuerden exclusión de `cross_split` en métricas primarias.
10. Revisar solape conceptual T2-A-E3 / T2-B-E1 en prose de hints si el Fixer quiere menos redundancia (código puede quedarse).

---

## Residual risks

1. **Nombre de archivo vs contenido:** `s30-security-infra.ts` / id `security-infra` no describe ER; no es bug de ejercicios pero confunde reviewers y buscadores internos.
2. **Defect invisible en S30-T3-A-E1:** con pesos que suman 1, el starter “pasa” sin corregir; riesgo de falsa maestría en score normalizado.
3. **Solape C(n,2):** dos ejercicios consecutivos de subtemas distintos practican la misma fórmula; sin preambles distintos el fade se percibe como clone.
4. **Demo T2-A vs theory T2-A:** theory muestra recall 0.0 por acentos; demo muestra 1.0 con claves ya plegadas — pedagogically intentional, pero el learner necesita el puente verbal (preamble/retrospective) para no creer que “blocking siempre da 1.0”.
5. **Complejidad de CP-N3-A:** el You Do es amplio (comparadores + blocking + scorer + UF + métricas); sin retrospective y con We Do telegráficos, un newbie puede copiar el starter sin defender métricas ni ética.
6. **No se proponen cambios de outputs canónicos** salvo el fixture de T3-A-E1; cualquier otro cambio de código debe execute-and-diff en el round de Fix.

---

## Counts for Fixer

| Tipo | N | preamble | retrospective | title (weDo) |
|------|---|----------|---------------|--------------|
| iDo | 8 | 0 → 8 | 0 → 8 | N/A |
| weDo | 24 | 0 → 24 | 0 → 24 | 0 → 24 |
| youDo | 1 | context OK | 0 → 1 | exists |
| **Total units** | **33** | | | |

**Código de práctica:** maduro (defects nombrados, fade real, outputs estables, gate ético).  
**Prosa de andamiaje:** ausente en casi todos los campos del spec.  
**Acción del Fixer:** implementar campos propuestos a mano, sin generadores; preservar outputs salvo T3-A-E1 si se adopta el cambio de pesos.

Section 30 exercise pedagogy review complete. Ready for the Fixer prompt.
