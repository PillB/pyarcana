#!/usr/bin/env python3
"""agentic_F2 selfcheck updater for sections 27-52. Packet-only answers; unique A/B voice."""
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path("/Users/pabloillescas/Projects/PyArcana/course-state/newbie_walkthrough/agentic_F2")
SC_DIR = Path(
    "/var/folders/46/hqp40jys76g696ycvflt54mc0000gn/T/grok-goal-4bdd14375b9d/implementer/f2_selfcheck_work"
)

# section -> list of (chosen_index, conf_a, conf_b, just_a, just_b)
# chosen_text taken from sc_XX.json options
ANSWERS: dict[int, list[tuple[int, float, float, str, str]]] = {
    27: [
        (
            2,
            0.91,
            0.78,
            "[agentic_F2/Explorer] S27 q0: el iDo S27-T1-A-DEMO ordena áreas por score y deja top_layer=='unit' con pyramid_ok True — la base ancha de la pirámide son las pruebas unitarias, no E2E ni load en prod.",
            "[agentic_F2/Skeptic] S27 q0: descarto 'E2E UI' y 'Load tests en prod' porque la teoría 'riesgos y pirámide' + demo de priorización ponen unit en la base; elijo índice 2 «Pruebas unitarias» con cautela de no haber leído correctIndex.",
        ),
        (
            0,
            0.90,
            0.76,
            "[agentic_F2/Explorer] S27 q1: S27-T1-B-DEMO fija raw/oracle y hace assert got==oracle — un oráculo confiable es fuente de verdad determinista, no print ni reloj suelto ni orden de set.",
            "[agentic_F2/Skeptic] S27 q1: rechazo reloj del sistema y orden de set (no deterministas). El paquete enseña AAA con oracle fijo; elijo 0 «Una fuente de verdad determinista para el assert».",
        ),
        (
            1,
            0.89,
            0.77,
            "[agentic_F2/Explorer] S27 q2: heading 'mutación conceptual' — si mutas casefold y nada falla, el mutante sobrevivió y el contrato de test es débil; no es 'está bien' ni culpar a pytest.",
            "[agentic_F2/Skeptic] S27 q2: no compro 'pytest está roto siempre'. Supervivencia del mutante = cobertura débil; índice 1 «El contrato es débil; el mutante sobrevivió» alineado a teoría de mutación del packet.",
        ),
        (
            3,
            0.88,
            0.75,
            "[agentic_F2/Explorer] S27 q3: matching en CP-N3-A (normalize/oráculos) prueba contratos de misma entidad y normalización — el stem lo dice y descarta fraude/parentesco/correos.",
            "[agentic_F2/Skeptic] S27 q3: freno ante 'Fraude automático' o parentescos; el packet de estrategia pytest solo cubre normalización/matching de entidad. Elijo 3.",
        ),
    ],
    28: [
        (
            3,
            0.90,
            0.77,
            "[agentic_F2/Explorer] S28 q0: S28-T1-B-DEMO muestra simetría Jaccard y metamorphic padding — un test metamórfico verifica relaciones predecibles entre entradas transformadas y salidas.",
            "[agentic_F2/Skeptic] S28 q0: no es 'número mágico' ni red caída. Teoría 'idempotencia, simetría y metamorphic tests' empuja a índice 3 sobre relaciones predecibles bajo transformaciones.",
        ),
        (
            1,
            0.91,
            0.79,
            "[agentic_F2/Explorer] S28 q1: S28-T2-B-DEMO bloquea reconcile si golden!=cur (action 'blocked') — actualizar golden con drift sin review oculta regresiones.",
            "[agentic_F2/Skeptic] S28 q1: 'Buena práctica' es trampa. Drift sin aprobación = riesgo de ocultar regresiones; el demo dice blocked cuando hay drift. Índice 1.",
        ),
        (
            2,
            0.89,
            0.76,
            "[agentic_F2/Explorer] S28 q2: S28-T3-B-DEMO contrasta real match vs overmock que da true a ('A','z') — sobre-mocking acopla al detalle interno y oculta bugs.",
            "[agentic_F2/Skeptic] S28 q2: prefiero real path; overmock_false_pos en el demo valida índice 2. Seed/sqlite no son el anti-patrón aquí.",
        ),
        (
            0,
            0.88,
            0.74,
            "[agentic_F2/Explorer] S28 q3: outcomes + heading 'flakes, determinismo y CI' — seed/reloj/sort y fallar el job si persisten; no retries 100 ni borrar tests.",
            "[agentic_F2/Skeptic] S28 q3: ignorar flakes o retries masivos no es gobernanza de gate. Determinismo + fail del job es la respuesta del packet (índice 0).",
        ),
    ],
    29: [
        (
            0,
            0.92,
            0.80,
            "[agentic_F2/Explorer] S29 q0: S29-T1-A-DEMO crea pairs con check(a<b) — entity_a < entity_b evita duplicar el mismo par en orden invertido.",
            "[agentic_F2/Skeptic] S29 q0: no es 'inferir fraude'. El CHECK a<b del schema demo es canonicidad de par no dirigido; elijo 0.",
        ),
        (
            2,
            0.90,
            0.78,
            "[agentic_F2/Explorer] S29 q1: S29-T1-B-DEMO inserta dos filas (review luego match) para el mismo pair — append-only = nueva fila por cambio de decisión.",
            "[agentic_F2/Skeptic] S29 q1: rechazo UPDATE in-place sin rastro. Lista de labels en orden id prueba historial; índice 2 «Nueva fila por cambio de decisión».",
        ),
        (
            3,
            0.89,
            0.77,
            "[agentic_F2/Explorer] S29 q2: S29-T3-A-DEMO hace rollback atómico; teoría ACID — decisión y evidencia van en la misma transacción lógica, no commits sueltos ni solo logs.",
            "[agentic_F2/Skeptic] S29 q2: 'transacciones separadas siempre' e 'ignorar rollback' son peligrosos. Atómicas en misma tx lógica = índice 3 del packet.",
        ),
        (
            1,
            0.88,
            0.75,
            "[agentic_F2/Explorer] S29 q3: outcome 'repository pattern, pooling y pruebas' — encapsula SQL y permite tests :memory:, no esparcir SQL ni marcar fraude.",
            "[agentic_F2/Skeptic] S29 q3: repository no reemplaza constraints. Encapsula acceso y facilita :memory: — índice 1, verificado contra heading del theory list.",
        ),
    ],
    30: [
        (
            1,
            0.93,
            0.81,
            "[agentic_F2/Explorer] S30 q0: título 'Entity resolution probabilístico' y demos de exact/token — el motor decide si dos registros son la misma entidad, no fraude ni parentesco.",
            "[agentic_F2/Skeptic] S30 q0: descarto fraude/parentesco/riesgo crediticio como veredictos del scorer. Solo 'misma entidad' (índice 1) cabe en el packet ER.",
        ),
        (
            3,
            0.91,
            0.79,
            "[agentic_F2/Explorer] S30 q1: S30-T2-A-DEMO imprime recall = |gold∩cand|/|gold| — candidate recall es la fracción de verdaderos matches que sobreviven al blocking.",
            "[agentic_F2/Skeptic] S30 q1: no es solo CPU ni precisión del scorer final. La definición del demo de blocking es fraction of true matches surviving → índice 3.",
        ),
        (
            0,
            0.90,
            0.78,
            "[agentic_F2/Explorer] S30 q2: S30-T3-A-DEMO: auto_match si s>=0.9, review si s>0.5, else non_match — banda intermedia = clerical review.",
            "[agentic_F2/Skeptic] S30 q2: entre t_low y t_high no se auto-match ni se borra; el trío de umbrales del demo manda a 'clerical review' (índice 0).",
        ),
        (
            2,
            0.89,
            0.76,
            "[agentic_F2/Explorer] S30 q3: outcome 'Partir datos por entidad sin leakage' — split por entidad evita leakage de identidad train/test.",
            "[agentic_F2/Skeptic] S30 q3: no confundo con 'usar sqlite' o 'blocking'. El leakage de identidad es el riesgo explícito del outcome (índice 2).",
        ),
    ],
    31: [
        (
            2,
            0.90,
            0.78,
            "[agentic_F2/Explorer] S31 q0: centralidad alta es posición estructural que pide contexto, no culpa ni fraude confirmado — alineado a outcomes de grafo del workbench N3-B.",
            "[agentic_F2/Skeptic] S31 q0: rechazo 'fraude confirmado' y 'borrar al nodo'. Score de centralidad ≠ veredicto; elijo 2 con voz escéptica agentic_F2.",
        ),
        (
            0,
            0.91,
            0.79,
            "[agentic_F2/Explorer] S31 q1: provenance en arista = auditar source/record_id del hecho relacional, no solo color UI ni ocultar path.",
            "[agentic_F2/Skeptic] S31 q1: provenance no es adorno. Sirve para auditar source/record_id (índice 0); 'entrenar NN obligatoriamente' no viene del packet.",
        ),
        (
            1,
            0.88,
            0.75,
            "[agentic_F2/Explorer] S31 q2: al agregar transferencias del mismo par hay que conservar detalle o punteros además del agregado — no borrar record_ids.",
            "[agentic_F2/Skeptic] S31 q2: borrar record_ids pierde audit trail. Conservar detalle/punteros (índice 1) es lo que el stem de agregación exige.",
        ),
        (
            3,
            0.89,
            0.77,
            "[agentic_F2/Explorer] S31 q3: shared phone es hecho de contacto compartido a investigar con evidencia, no parentesco legal ni fraude automático.",
            "[agentic_F2/Skeptic] S31 q3: freno duro a colusión/fraude automático desde un teléfono compartido. Índice 3: investigar con evidencia, no veredicto.",
        ),
    ],
    32: [
        (
            3,
            0.91,
            0.79,
            "[agentic_F2/Explorer] S32 q0: ventana half-open [t−w, t) excluye el instante t y el futuro — evita leakage temporal de features al label time.",
            "[agentic_F2/Skeptic] S32 q0: no excluye 'todo el pasado'. Half-open clásico corta t y lo posterior; elijo 3 con voz agentic_F2 skeptic.",
        ),
        (
            1,
            0.90,
            0.78,
            "[agentic_F2/Explorer] S32 q1: transform antes de fit debe fallar de forma explícita si algo no cuadra — no rellenar 0 en silencio ni usar stats de test.",
            "[agentic_F2/Skeptic] S32 q1: relleno silencioso y test stats = leakage/ocultamiento. Fallar explícito (índice 1) es la política del packet de features.",
        ),
        (
            2,
            0.92,
            0.80,
            "[agentic_F2/Explorer] S32 q2: overlap de entidades train/test = leakage de identidad (eco de split por entidad de ER).",
            "[agentic_F2/Skeptic] S32 q2: 'es deseable' es falso. Overlap de entidades es leakage de identidad — índice 2, no se ignora en group CV.",
        ),
        (
            0,
            0.89,
            0.76,
            "[agentic_F2/Explorer] S32 q3: feature con 'label' o 'decision' en el nombre es red flag de leakage — posible fuga del target al feature space.",
            "[agentic_F2/Skeptic] S32 q3: no es 'inofensivo'. Nombres label/decision gritan leakage; elijo 0 y pediría drop/review del feature.",
        ),
    ],
    33: [
        (
            0,
            0.90,
            0.77,
            "[agentic_F2/Explorer] S33 q0: target del workbench = needs_review con horizonte (no is_fraud). El label operativo del triage es cola de revisión.",
            "[agentic_F2/Skeptic] S33 q0: 'is_fraud' como target viola el alcance del curso. needs_review con horizonte es la opción segura del packet (índice 0).",
        ),
        (
            2,
            0.89,
            0.76,
            "[agentic_F2/Explorer] S33 q1: antes de ML conviene dummy/regla y costos — baseline barato y matriz de costo, no deep learning de entrada.",
            "[agentic_F2/Skeptic] S33 q1: 'solo deep learning' es saltarse el baseline. Dummy/regla y costos (índice 2) es lo que el workbench enseña primero.",
        ),
        (
            3,
            0.88,
            0.74,
            "[agentic_F2/Explorer] S33 q2: comparar coeficientes exige features scaled y causal=False — sin escala los coef no se leen; no afirmar causalidad.",
            "[agentic_F2/Skeptic] S33 q2: features sin escala invalidan lectura de coefs. Índice 3: scaled + causal=False; SHAP no es requisito de este ítem.",
        ),
        (
            1,
            0.91,
            0.79,
            "[agentic_F2/Explorer] S33 q3: Group CV por entidad evita leakage de la misma entidad entre folds — paralelo al split por entidad de S30.",
            "[agentic_F2/Skeptic] S33 q3: no es 'usar métricas' ni 'fijar seed'. El punto de group CV es bloquear leakage de entidad (índice 1).",
        ),
    ],
    34: [
        (
            1,
            0.91,
            0.79,
            "[agentic_F2/Explorer] S34 q0: con desbalance fuerte prioriza precision/recall o PR-AUC de la cola — accuracy engaña cuando la clase positiva es rara.",
            "[agentic_F2/Skeptic] S34 q0: 'solo accuracy' en desbalance es trampa clásica. PR/precision-recall o PR-AUC de cola = índice 1 del packet.",
        ),
        (
            3,
            0.90,
            0.78,
            "[agentic_F2/Explorer] S34 q1: resamplear todo el dataset antes de CV introduce leakage y métricas infladas — el resample debe ir dentro de cada fold.",
            "[agentic_F2/Skeptic] S34 q1: 'best practice' es mentira aquí. Pre-CV global resample = leakage; índice 3.",
        ),
        (
            0,
            0.89,
            0.77,
            "[agentic_F2/Explorer] S34 q2: calibrador se ajusta en set de calibración fuera de muestra — no en test final ni en el mismo train sin holdout.",
            "[agentic_F2/Skeptic] S34 q2: calibrar en test o en train del base sin holdout contamina. Out-of-sample calib set = índice 0.",
        ),
        (
            2,
            0.88,
            0.75,
            "[agentic_F2/Explorer] S34 q3: score en banda low–high debe abstener según política (review), no forzar 0/1 ni borrar el caso.",
            "[agentic_F2/Skeptic] S34 q3: forzar 1 o 0 en la banda gris es imprudente. Abstener según política = índice 2, coherente con clerical review.",
        ),
    ],
    35: [
        (
            2,
            0.90,
            0.78,
            "[agentic_F2/Explorer] S35 q0: ficha de caso separa evidencia, modelo, incertidumbre y decisión humana — no solo score ni solo SHAP global.",
            "[agentic_F2/Skeptic] S35 q0: un score suelto no es ficha completa. Cuatro capas (evidencia/modelo/incertidumbre/humano) = índice 2 del packet.",
        ),
        (
            0,
            0.89,
            0.76,
            "[agentic_F2/Explorer] S35 q1: perm importance mide sensibilidad del modelo a barajar features — no fraude, parentesco ni causalidad legal.",
            "[agentic_F2/Skeptic] S35 q1: no confundo importancia de permutación con causalidad. Índice 0: sensibilidad a shuffle de features.",
        ),
        (
            1,
            0.91,
            0.79,
            "[agentic_F2/Explorer] S35 q2: ante OOD conviene abstener y escalar — no forzar pred 1 ni borrar logs.",
            "[agentic_F2/Skeptic] S35 q2: OOD + forzar 1 es peligroso. Política del packet: abstener y escalar (índice 1).",
        ),
        (
            3,
            0.88,
            0.74,
            "[agentic_F2/Explorer] S35 q3: model card out_of_scope incluye usos prohibidos p.ej. etiqueta de fraude — documentar lo que el modelo no debe hacer.",
            "[agentic_F2/Skeptic] S35 q3: out_of_scope no es 'nada' ni solo accuracy. Usos prohibidos (fraude label) = índice 3.",
        ),
    ],
    36: [
        (
            3,
            0.90,
            0.77,
            "[agentic_F2/Explorer] S36 q0: anomalía en triage = señal de rareza a revisar, no fraude probado ni parentesco ni despido.",
            "[agentic_F2/Skeptic] S36 q0: anomaly ≠ guilt. El packet de detección de rareza apunta a 'señal a revisar' (índice 3).",
        ),
        (
            1,
            0.89,
            0.76,
            "[agentic_F2/Explorer] S36 q1: contamination es hipótesis de fracción rara a flaggear — no la tasa de fraude real ni accuracy.",
            "[agentic_F2/Skeptic] S36 q1: no igualo contamination a fraude real. Es un knob de rareza esperada (índice 1).",
        ),
        (
            2,
            0.88,
            0.75,
            "[agentic_F2/Explorer] S36 q2: PCA en el curso = exploración/visualización prudente, no etiquetar culpa ni reemplazar workbench.",
            "[agentic_F2/Skeptic] S36 q2: PCA no es juez. Exploración prudente (índice 2) es el uso declarado del packet.",
        ),
        (
            0,
            0.91,
            0.79,
            "[agentic_F2/Explorer] S36 q3: con labels escasos prioriza precision@k y feedback humano — alineado a capacidad de cola del triage.",
            "[agentic_F2/Skeptic] S36 q3: accuracy global con labels escasos miente. precision@k + humano = índice 0; no subir contamination a 0.9.",
        ),
        (
            3,
            0.90,
            0.78,
            "[agentic_F2/Explorer] S36 q4: fit de normalidad que incluye el mes evaluado = leakage temporal — el normalizer ve el periodo de test.",
            "[agentic_F2/Skeptic] S36 q4: no es 'Blocking' ni 'Backpressure'. Incluir el mes evaluado en el fit es leakage temporal (índice 3).",
        ),
    ],
    37: [
        (
            0,
            0.90,
            0.78,
            "[agentic_F2/Explorer] S37 q0: warmup estabiliza benches descartando cold start — no inflar métricas ni borrar cache siempre.",
            "[agentic_F2/Skeptic] S37 q0: warmup no es truco para inflar. Descartar cold start (índice 0) es la lectura del packet de performance.",
        ),
        (
            2,
            0.91,
            0.79,
            "[agentic_F2/Explorer] S37 q1: blocking reduce pares candidatos O(n²) — mismo concepto de ER, ahora en performance budget.",
            "[agentic_F2/Skeptic] S37 q1: blocking no es 'solo logs'. Corta el cuadrático de candidatos (índice 2).",
        ),
        (
            3,
            0.89,
            0.76,
            "[agentic_F2/Explorer] S37 q2: performance budget en CI falla si se rompe el límite acordado — no teatro opcional ni solo medir un año después.",
            "[agentic_F2/Skeptic] S37 q2: un budget que no falla no es gate. Índice 3: falla al romper el límite.",
        ),
        (
            1,
            0.88,
            0.74,
            "[agentic_F2/Explorer] S37 q3: microoptimizar 2% sin medición es teatro; prioriza claridad y algoritmos medidos.",
            "[agentic_F2/Skeptic] S37 q3: 'best practice' sin bench es teatro. Índice 1 del packet.",
        ),
        (
            0,
            0.87,
            0.73,
            "[agentic_F2/Explorer] S37 q4: wall_ms sin n no es comparable entre cambios de dataset — el tamaño de entrada importa.",
            "[agentic_F2/Skeptic] S37 q4: un solo wall_ms sin n no basta para el gate comparativo. Índice 0.",
        ),
    ],
    38: [
        (
            1,
            0.90,
            0.78,
            "[agentic_F2/Explorer] S38 q0: CPU-bound en CPython → procesos (GIL), no miles de threads CPU.",
            "[agentic_F2/Skeptic] S38 q0: threads CPU no escalan el cómputo puro en CPython. Procesos (índice 1) es la preferencia del packet.",
        ),
        (
            3,
            0.91,
            0.79,
            "[agentic_F2/Explorer] S38 q1: backpressure evita colas infinitas y OOM — límites de admisión/cola.",
            "[agentic_F2/Skeptic] S38 q1: sin backpressure la cola crece hasta OOM. Índice 3, no 'solo tests'.",
        ),
        (
            0,
            0.92,
            0.80,
            "[agentic_F2/Explorer] S38 q2: idempotencia permite reejecutar sin side effects duplicados — clave en workers/reintentos.",
            "[agentic_F2/Skeptic] S38 q2: no es 'duplicar cobros'. Reejecutar sin duplicar efectos (índice 0).",
        ),
        (
            2,
            0.89,
            0.76,
            "[agentic_F2/Explorer] S38 q3: logs de prod: redactar PII y correlacionar (case_id), no PII completa.",
            "[agentic_F2/Skeptic] S38 q3: PII completa en prod es fallo de seguridad. Redactar + correlacionar = índice 2.",
        ),
        (
            1,
            0.90,
            0.77,
            "[agentic_F2/Explorer] S38 q4: proveedor sin timeout → hang de workers y cola bloqueada; no mejora p95 mágico.",
            "[agentic_F2/Skeptic] S38 q4: sin timeout el worker se pega. Hang + cola bloqueada (índice 1) es el riesgo del packet.",
        ),
    ],
    39: [
        (
            2,
            0.91,
            0.79,
            "[agentic_F2/Explorer] S39 q0: label_space del triage N3 = needs_review / prioridad de cola — no fraud_certainty ni culpable.",
            "[agentic_F2/Skeptic] S39 q0: fraud_certainty y parentesco fuera de alcance. needs_review / prioridad (índice 2).",
        ),
        (
            0,
            0.88,
            0.75,
            "[agentic_F2/Explorer] S39 q1: CF-3 y regresión S27–S39 en esta lane se documentan; PASS lo califica otra lane — no marcan PASS solos.",
            "[agentic_F2/Skeptic] S39 q1: no auto-PASS en el ledger desde esta autoría. Documentar; otra lane califica (índice 0).",
        ),
        (
            1,
            0.90,
            0.78,
            "[agentic_F2/Explorer] S39 q2: evidence packet incluye evidencia y path además del score — no solo score ni claves de API.",
            "[agentic_F2/Skeptic] S39 q2: score solo no basta. Evidencia + path (índice 1); claves de prod fuera de lugar.",
        ),
        (
            3,
            0.91,
            0.79,
            "[agentic_F2/Explorer] S39 q3: incidente grave → human_only / rollback a artefacto previo — no subir throughput ignorando.",
            "[agentic_F2/Skeptic] S39 q3: etiquetar fraude masivo con el score en incidente es mala idea. human_only/rollback (índice 3).",
        ),
        (
            2,
            0.89,
            0.76,
            "[agentic_F2/Explorer] S39 q4: breaking change en graph_schema → bump major, owner contactable y revalidación de paths.",
            "[agentic_F2/Skeptic] S39 q4: patch silencioso en breaking es incorrecto. Major + owner + revalidación (índice 2).",
        ),
    ],
    40: [
        (
            3,
            0.90,
            0.78,
            "[agentic_F2/Explorer] S40 q0: evidencia para requisitos/QA en CASO-LIM-040 = escenario QA completo con umbral y dueño — no print suelto ni captura sin fuente.",
            "[agentic_F2/Skeptic] S40 q0: rechazo PII real y prints sin assert. Escenario QA con umbral y dueño (índice 3) es la única evidencia defendible.",
        ),
        (
            1,
            0.91,
            0.79,
            "[agentic_F2/Explorer] S40 q1: error de S40 → emitir BLOCK_ARCHITECTURE y conservar evidencia; no ocultar warning ni borrar trace.",
            "[agentic_F2/Skeptic] S40 q1: inventar evidencia o borrar trace rompe auditabilidad. BLOCK_ARCHITECTURE + evidencia (índice 1).",
        ),
        (
            2,
            0.89,
            0.76,
            "[agentic_F2/Explorer] S40 q2: gate CP-N4-A mapa gobernado = cada flujo cruza fronteras explícitas y cada trade-off conserva medida, dueño y consecuencia.",
            "[agentic_F2/Skeptic] S40 q2: 'el archivo existe' no demuestra el gate. Fronteras + trade-offs con dueño (índice 2).",
        ),
        (
            0,
            0.92,
            0.80,
            "[agentic_F2/Explorer] S40 q3: CASO-LIM-040 se mantiene sintético, mínimo, trazable y con revisión humana — sin secretos ni datos reales sin consentimiento.",
            "[agentic_F2/Skeptic] S40 q3: datos reales sin consentimiento e inferir fraude desde ER están fuera. Sintético/trazable (índice 0).",
        ),
    ],
    41: [
        (
            0,
            0.90,
            0.78,
            "[agentic_F2/Explorer] S41 q0: evidencia para recursos/métodos/status en CASO-ARE-041 = matriz método/recurso/status probada.",
            "[agentic_F2/Skeptic] S41 q0: print sin assert no aprueba el gate HTTP. Matriz método/recurso/status (índice 0).",
        ),
        (
            2,
            0.91,
            0.79,
            "[agentic_F2/Explorer] S41 q1: error S41 → REJECT_REQUEST y conservar evidencia — no continuar ocultando warning.",
            "[agentic_F2/Skeptic] S41 q1: borrar el trace es anti-audit. REJECT_REQUEST + evidencia (índice 2).",
        ),
        (
            3,
            0.89,
            0.76,
            "[agentic_F2/Explorer] S41 q2: gate API HTTP gobernada = crear el mismo job con la misma clave no duplica efectos y consultar conserva compatibilidad.",
            "[agentic_F2/Skeptic] S41 q2: README afirmando 'funciona' no es evidencia. Idempotencia de job + compat (índice 3).",
        ),
        (
            1,
            0.92,
            0.80,
            "[agentic_F2/Explorer] S41 q3: CASO-ARE-041 sintético, mínimo, trazable, revisión humana.",
            "[agentic_F2/Skeptic] S41 q3: sin PII real ni secretos. Tratamiento sintético (índice 1).",
        ),
    ],
    42: [
        (
            1,
            0.90,
            0.78,
            "[agentic_F2/Explorer] S42 q0: Pydantic/JSON Schema se aprueba con schema exportado y fixtures válidos/inválidos.",
            "[agentic_F2/Skeptic] S42 q0: captura sin fuente no valida schema. Export + fixtures ok/bad (índice 1).",
        ),
        (
            3,
            0.91,
            0.79,
            "[agentic_F2/Explorer] S42 q1: error S42 → emitir DENY y conservar evidencia.",
            "[agentic_F2/Skeptic] S42 q1: ocultar warning no es seguro. DENY + evidencia (índice 3).",
        ),
        (
            0,
            0.92,
            0.81,
            "[agentic_F2/Explorer] S42 q2: control plane seguro = un actor nunca lee otro caso y un dato redactado no reaparece en logs/respuestas/backups.",
            "[agentic_F2/Skeptic] S42 q2: existencia del archivo S42 no prueba aislamiento. Aislamiento multi-tenant + redaction sticky (índice 0).",
        ),
        (
            2,
            0.90,
            0.78,
            "[agentic_F2/Explorer] S42 q3: CASO-CUS-042 sintético, mínimo, trazable, revisión humana.",
            "[agentic_F2/Skeptic] S42 q3: no subir secretos. Sintético/trazable (índice 2).",
        ),
    ],
    43: [
        (
            2,
            0.90,
            0.78,
            "[agentic_F2/Explorer] S43 q0: Dockerfile/layers/cache se aprueba si dos builds producen el mismo digest lógico.",
            "[agentic_F2/Skeptic] S43 q0: print sin assert no prueba reproducibilidad. Mismo digest lógico (índice 2).",
        ),
        (
            0,
            0.91,
            0.79,
            "[agentic_F2/Explorer] S43 q1: error S43 → BLOCK_IMAGE y conservar evidencia.",
            "[agentic_F2/Skeptic] S43 q1: inventar evidencia es fraude de audit. BLOCK_IMAGE + evidencia (índice 0).",
        ),
        (
            1,
            0.89,
            0.76,
            "[agentic_F2/Explorer] S43 q2: gate servicio reproducible = build repetible, no root, límites de recursos y shutdown limpio en entorno nuevo.",
            "[agentic_F2/Skeptic] S43 q2: 'herramienta más nueva' no es gate. Build/no-root/límites/shutdown (índice 1).",
        ),
        (
            3,
            0.90,
            0.77,
            "[agentic_F2/Explorer] S43 q3: CASO-TRU-043 sintético, mínimo, trazable, revisión humana.",
            "[agentic_F2/Skeptic] S43 q3: sin datos reales sin consentimiento. Índice 3 sintético/trazable.",
        ),
    ],
    44: [
        (
            3,
            0.90,
            0.78,
            "[agentic_F2/Explorer] S44 q0: lint/types/tests y matrices se aprueban con lint/types/tests y matriz soportada en verde.",
            "[agentic_F2/Skeptic] S44 q0: captura sin fuente no basta. Pipeline verde + matriz (índice 3).",
        ),
        (
            1,
            0.91,
            0.79,
            "[agentic_F2/Explorer] S44 q1: error S44 → STOP_PIPELINE y conservar evidencia.",
            "[agentic_F2/Skeptic] S44 q1: continuar ocultando warning rompe la cadena. STOP_PIPELINE + evidencia (índice 1).",
        ),
        (
            2,
            0.89,
            0.76,
            "[agentic_F2/Explorer] S44 q2: gate cadena de suministro = pipeline reproduce artefacto, exige aprobación y demuestra rollback en staging.",
            "[agentic_F2/Skeptic] S44 q2: README no es supply-chain proof. Reproduce + approve + rollback (índice 2).",
        ),
        (
            0,
            0.90,
            0.77,
            "[agentic_F2/Explorer] S44 q3: CASO-PIU-044 sintético, mínimo, trazable, revisión humana.",
            "[agentic_F2/Skeptic] S44 q3: no inferir fraude desde ER. Sintético (índice 0).",
        ),
    ],
    45: [
        (
            0,
            0.90,
            0.78,
            "[agentic_F2/Explorer] S45 q0: object store/relacional/cache se aprueba con ADR de persistencia con fuente de verdad.",
            "[agentic_F2/Skeptic] S45 q0: print sin assert no es ADR. Persistencia con SoT (índice 0).",
        ),
        (
            2,
            0.91,
            0.79,
            "[agentic_F2/Explorer] S45 q1: error S45 → SEND_TO_DLQ y conservar evidencia.",
            "[agentic_F2/Skeptic] S45 q1: borrar trace es anti-patrón. SEND_TO_DLQ + evidencia (índice 2).",
        ),
        (
            3,
            0.89,
            0.76,
            "[agentic_F2/Explorer] S45 q2: gate job asíncrono resiliente = reintentos no duplican y costo/IAM/backup/recuperación quedan medidos.",
            "[agentic_F2/Skeptic] S45 q2: 'archivo existe' no prueba resiliencia. Idempotent retries + costos medidos (índice 3).",
        ),
        (
            1,
            0.90,
            0.77,
            "[agentic_F2/Explorer] S45 q3: CASO-IQU-045 sintético, mínimo, trazable, revisión humana.",
            "[agentic_F2/Skeptic] S45 q3: sin secretos en demo. Sintético (índice 1).",
        ),
    ],
    46: [
        (
            1,
            0.90,
            0.78,
            "[agentic_F2/Explorer] S46 q0: ventanas/event time/watermarks se aprueban con fixtures en hora/desorden/tardío y resultado esperado.",
            "[agentic_F2/Skeptic] S46 q0: captura sin fuente no prueba watermarks. Fixtures late/out-of-order (índice 1).",
        ),
        (
            3,
            0.91,
            0.79,
            "[agentic_F2/Explorer] S46 q1: error S46 → QUARANTINE_PARTITION y conservar evidencia.",
            "[agentic_F2/Skeptic] S46 q1: inventar evidencia no es opción. QUARANTINE_PARTITION + evidencia (índice 3).",
        ),
        (
            0,
            0.89,
            0.76,
            "[agentic_F2/Explorer] S46 q2: gate pipeline incremental = backfill y retry dan mismo resultado, registran dueño y cumplen SLO de freshness.",
            "[agentic_F2/Skeptic] S46 q2: README no demuestra backfill. Mismo resultado + owner + freshness (índice 0).",
        ),
        (
            2,
            0.90,
            0.77,
            "[agentic_F2/Explorer] S46 q3: CASO-HYO-046 sintético, mínimo, trazable, revisión humana.",
            "[agentic_F2/Skeptic] S46 q3: sin datos reales sin consentimiento. Sintético (índice 2).",
        ),
    ],
    47: [
        (
            2,
            0.90,
            0.78,
            "[agentic_F2/Explorer] S47 q0: tracking/reproducibilidad se aprueba con rerun dentro de tolerancia declarada.",
            "[agentic_F2/Skeptic] S47 q0: print sin versión no es tracking. Rerun en tolerancia (índice 2).",
        ),
        (
            0,
            0.91,
            0.79,
            "[agentic_F2/Explorer] S47 q1: error S47 → ROLLBACK_MODEL y conservar evidencia.",
            "[agentic_F2/Skeptic] S47 q1: ocultar warning en promo de modelo es grave. ROLLBACK_MODEL + evidencia (índice 0).",
        ),
        (
            1,
            0.89,
            0.76,
            "[agentic_F2/Explorer] S47 q2: gate modelo promovible = solo gates aprobados promueven y versión previa se restaura sin perder evidencia.",
            "[agentic_F2/Skeptic] S47 q2: 'herramienta más nueva' no es gate. Promote gated + rollback (índice 1).",
        ),
        (
            3,
            0.90,
            0.77,
            "[agentic_F2/Explorer] S47 q3: CASO-TAC-047 sintético, mínimo, trazable, revisión humana.",
            "[agentic_F2/Skeptic] S47 q3: no inferir parentesco desde ER. Sintético (índice 3).",
        ),
    ],
    48: [
        (
            3,
            0.90,
            0.78,
            "[agentic_F2/Explorer] S48 q0: embeddings/similarity se aprueban con ranking reproducible con versión de embedding.",
            "[agentic_F2/Skeptic] S48 q0: PII real no es evidencia. Ranking + versión emb (índice 3).",
        ),
        (
            1,
            0.91,
            0.79,
            "[agentic_F2/Explorer] S48 q1: error S48 → ABSTAIN y conservar evidencia (RAG con abstención).",
            "[agentic_F2/Skeptic] S48 q1: inventar evidencia es inaceptable. ABSTAIN + evidencia (índice 1).",
        ),
        (
            2,
            0.89,
            0.76,
            "[agentic_F2/Explorer] S48 q2: gate RAG = retrieval y respuesta superan umbrales separados; toda afirmación material cita fragmento permitido.",
            "[agentic_F2/Skeptic] S48 q2: archivo S48 existiendo no prueba citas. Umbrales duales + citas (índice 2).",
        ),
        (
            0,
            0.90,
            0.77,
            "[agentic_F2/Explorer] S48 q3: CASO-PUN-048 sintético, mínimo, trazable, revisión humana.",
            "[agentic_F2/Skeptic] S48 q3: sin secretos. Sintético (índice 0).",
        ),
    ],
    49: [
        (
            0,
            0.90,
            0.78,
            "[agentic_F2/Explorer] S49 q0: workflow vs agente se aprueba con ADR workflow/agente con baseline.",
            "[agentic_F2/Skeptic] S49 q0: print sin assert no es ADR. ADR + baseline (índice 0).",
        ),
        (
            2,
            0.91,
            0.79,
            "[agentic_F2/Explorer] S49 q1: error S49 → STOP_AGENT y conservar evidencia.",
            "[agentic_F2/Skeptic] S49 q1: continuar ocultando warning deja al agente suelto. STOP_AGENT + evidencia (índice 2).",
        ),
        (
            3,
            0.89,
            0.76,
            "[agentic_F2/Explorer] S49 q2: gate agente acotado = cada tool idempotente, el agente se detiene y humano aprueba acciones sensibles.",
            "[agentic_F2/Skeptic] S49 q2: README no prueba human-in-the-loop. Tools idempotent + stop + approve (índice 3).",
        ),
        (
            1,
            0.90,
            0.77,
            "[agentic_F2/Explorer] S49 q3: CASO-AYA-049 sintético, mínimo, trazable, revisión humana.",
            "[agentic_F2/Skeptic] S49 q3: sin datos reales. Sintético (índice 1).",
        ),
    ],
    50: [
        (
            1,
            0.90,
            0.78,
            "[agentic_F2/Explorer] S50 q0: task dataset y rubric se aprueban con dataset versionado y rúbrica calibrada.",
            "[agentic_F2/Skeptic] S50 q0: captura sin fuente no calibra rúbrica. Dataset versionado + rubric (índice 1).",
        ),
        (
            3,
            0.91,
            0.79,
            "[agentic_F2/Explorer] S50 q1: error S50 → BLOCK_CANDIDATE y conservar evidencia.",
            "[agentic_F2/Skeptic] S50 q1: inventar evidencia en evals adversariales es descalificante. BLOCK_CANDIDATE (índice 3).",
        ),
        (
            0,
            0.89,
            0.76,
            "[agentic_F2/Explorer] S50 q2: gate quality IA adversarial = evals retenidos/adversariales repetibles y prueban recuperación, no solo texto final.",
            "[agentic_F2/Skeptic] S50 q2: 'archivo existe' no es adversarial gate. Evals + recovery (índice 0).",
        ),
        (
            2,
            0.90,
            0.77,
            "[agentic_F2/Explorer] S50 q3: CASO-ICA-050 sintético, mínimo, trazable, revisión humana.",
            "[agentic_F2/Skeptic] S50 q3: sin fraude inferido desde ER. Sintético (índice 2).",
        ),
    ],
    51: [
        (
            2,
            0.90,
            0.78,
            "[agentic_F2/Explorer] S51 q0: traces de prompts/retrieval/tools se aprueban con trace reconstruible sin PII.",
            "[agentic_F2/Skeptic] S51 q0: PII real no es traza válida. Trace reconstruible sin PII (índice 2).",
        ),
        (
            0,
            0.91,
            0.79,
            "[agentic_F2/Explorer] S51 q1: error S51 → ROLLBACK_COPILOT y conservar evidencia.",
            "[agentic_F2/Skeptic] S51 q1: borrar el trace destruye contestabilidad. ROLLBACK_COPILOT + evidencia (índice 0).",
        ),
        (
            1,
            0.89,
            0.76,
            "[agentic_F2/Explorer] S51 q2: gate copiloto observable = reconstruir qué respondió, citó, tool, quién aprobó y cómo revertir.",
            "[agentic_F2/Skeptic] S51 q2: README no es observability. Cadena respuesta/cita/tool/aprobación/rollback (índice 1).",
        ),
        (
            3,
            0.90,
            0.77,
            "[agentic_F2/Explorer] S51 q3: CASO-MOQ-051 sintético, mínimo, trazable, revisión humana.",
            "[agentic_F2/Skeptic] S51 q3: sin secretos en demo. Sintético (índice 3).",
        ),
    ],
    52: [
        (
            3,
            0.91,
            0.79,
            "[agentic_F2/Explorer] S52 q0: stakeholders/jobs/métricas CF-1 se aprueban con matriz stakeholder/job/métrica con evidencia.",
            "[agentic_F2/Skeptic] S52 q0: print sin assert no es matriz CF-1. Matriz + evidencia (índice 3).",
        ),
        (
            1,
            0.90,
            0.78,
            "[agentic_F2/Explorer] S52 q1: error S52 → NO_GO_RELEASE y conservar evidencia.",
            "[agentic_F2/Skeptic] S52 q1: continuar ocultando warning en release final es inaceptable. NO_GO_RELEASE (índice 1).",
        ),
        (
            2,
            0.89,
            0.76,
            "[agentic_F2/Explorer] S52 q2: gate CP-FINAL = 52/52, 12/12 capstones, CP-FINAL y regresión completa sin compensar CP-N4-C.",
            "[agentic_F2/Skeptic] S52 q2: 'herramienta más nueva' no cierra el curso. Conteo completo de gates (índice 2).",
        ),
        (
            0,
            0.92,
            0.80,
            "[agentic_F2/Explorer] S52 q3: CASO-PER-052 sintético, mínimo, trazable, revisión humana — cierre defendible del walkthrough agentic_F2.",
            "[agentic_F2/Skeptic] S52 q3: sin PII real ni parentesco inventado. Sintético/trazable (índice 0) cierra S52 con voz skeptic agentic_F2.",
        ),
    ],
}


def load_options(section: int) -> list[list[str]]:
    data = json.loads((SC_DIR / f"sc_{section:02d}.json").read_text())
    return [q["options"] for q in data["selfcheck"]]


def build_selfcheck(
    section: int, persona: str
) -> list[dict]:
    opts = load_options(section)
    rows = ANSWERS[section]
    out = []
    for qi, (idx, ca, cb, ja, jb) in enumerate(rows):
        conf = ca if persona == "a" else cb
        just = ja if persona == "a" else jb
        out.append(
            {
                "question_index": qi,
                "chosen_index": idx,
                "chosen_text": opts[qi][idx],
                "justification_from_packet": just,
                "blocked_on": [],
                "confidence": conf,
            }
        )
    return out


def main() -> None:
    summary: dict[str, dict] = {}
    for sec in range(27, 53):
        assert sec in ANSWERS, sec
        opts = load_options(sec)
        assert len(opts) == len(ANSWERS[sec]), (sec, len(opts), len(ANSWERS[sec]))
        a_idx = []
        b_idx = []
        for persona, fname in (("a", "newbie_a_live.json"), ("b", "newbie_b_live.json")):
            path = ROOT / f"section_{sec:02d}" / fname
            data = json.loads(path.read_text())
            sc = build_selfcheck(sec, persona)
            data["selfcheck"] = sc
            path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n")
            idxs = [x["chosen_index"] for x in sc]
            if persona == "a":
                a_idx = idxs
            else:
                b_idx = idxs
        summary[str(sec)] = {"a_indices": a_idx, "b_indices": b_idx}
        # sanity: indices in range
        for i, (idx, *_rest) in enumerate(ANSWERS[sec]):
            assert 0 <= idx < len(opts[i]), (sec, i, idx)
    out_path = ROOT / "fixes" / "F2_SELFCHECK_27_52_SUMMARY.json"
    out_path.write_text(json.dumps(summary, indent=2) + "\n")
    print(json.dumps(summary, indent=2))


if __name__ == "__main__":
    main()
