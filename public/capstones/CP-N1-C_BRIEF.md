# Tablero de Evidencia de Familiaridad

**Versión:** 3.0.0 · **Nivel:** 1 · **Cierra:** S13

Un *capstone* es el proyecto que integra lo aprendido en varias secciones. Este cierra S13 y el
Nivel 1, y es su You Do, `demo_n1_dashboard.py`, escrito como un módulo con pruebas que dicen si
cumples el contrato. El programa compara personas de a pares y arma un *paquete de revisión*: lo
que ve la persona que revisa antes de decidir algo.

## Usuario y problema
- **Usuario:** una persona analista que revisa pares de registros sintéticos.
- **Problema:** dos filas pueden ser la misma persona (identidad) y dos personas distintas
  pueden tener algo en común, como un teléfono o un edificio (relación). Son preguntas distintas.
  El programa responde cada una en su propia capa, decide solo qué hacer con cada **par** de
  registros y nunca dice nada sobre fraude, parentesco ni colusión. Lo que no puede afirmar lo
  manda a una persona.

## Qué archivo escribes
- **`STARTER/cp_n1_c.py`** es tu archivo. Ya tiene las funciones declaradas, las constantes,
  `haversine_km` (S12), la clase `ReviewPacket` (S11) y `_pairs`, que recorre cada par una vez.
- **`reference/cp_n1_c.py`** es la solución de referencia. Ábrelo solo para comparar cuando tus
  pruebas pasen. `demo.py` ejecuta esa referencia.
- **`tests/test_demo.py`** prueba tu archivo. Al principio fallan las 11 pruebas, y cada fallo
  dice qué función escribir y qué regla de esta página mirar.

Si ya hiciste el You Do de S13, tu `demo_n1_dashboard.py` tiene `norm_doc`, `blocking_key`,
`er_score`, `relationship_signal_score`, `decide_ops_status`, `pseudonymize` y `privacy_sheet`.
Hay tres diferencias: la cercanía se calcula con `haversine_km` desde las coordenadas de cada
persona (la fórmula de S12, como dice S13 T2-A), la hoja de privacidad lleva las cuatro claves de
T4-B, y el programa arma un paquete con `review(case)` en lugar de imprimir.

## Prerrequisitos
CP-N1-A y CP-N1-B. S09 (excepciones y logging: `ValueError`), S10 (módulos y CLI), S11
(clases y `@dataclass(frozen=True)`) y S12 (APIs, SQL y geodatos: `haversine_km`). S13
(evidencia de identidad y relación, decisión y producto) es la sección que este capstone cierra.

## Secciones que contribuyen
S09, S10, S11, S12, S13

## Datos
`data/generate.py` escribe `data/case.json`: un caso con 12 personas sintéticas, sin azar. Cada
persona tiene `id`, `name`, `document_id`, `region`, `phone` y `coords` (`[lat, lon]`). Algunos
campos valen `null` a propósito. Los nombres, documentos y teléfonos están inventados.

## Reglas
Cada regla dice en qué subtema de S13 la viste. Los pesos y los cortes son los valores de
enseñanza de S13: no están calibrados con datos etiquetados.

1. **Identidad: `norm_doc`, `blocking_key` y `er_score`** (T1-A).
   - `norm_doc(d)` pasa a minúsculas y deja solo letras y dígitos: `"D-10.01"` → `"d1001"`.
     `None` da `""`.
   - `blocking_key(rec)` es `apellido paterno|región`, en minúsculas. El apellido paterno es la
     segunda palabra del nombre, o la única si hay una. Sin nombre o sin región → `None`.
   - `er_score(a, b)`: el mismo documento y el mismo bloque → `1.0`; el mismo documento y otro
     bloque → `0.5`; otro documento → `0.0`. Si a alguno le falta el documento o el bloque →
     `None`: falta evidencia, y eso no es lo mismo que "no son la misma persona".
2. **Relación: `relationship_signals` y `relationship_signal_score`** (T2-A).
   - Las señales son `shared_phone` (los dos tienen teléfono y es el mismo), `geo_close`
     (`haversine_km` de sus `coords` ≤ 2.0 km) y `name_jaccard` (palabras del nombre en común
     entre palabras distintas de los dos, redondeado a 3 decimales).
   - Un campo ausente no es evidencia: dos teléfonos `None` no son el mismo teléfono, y sin
     `coords` no hay cercanía.
   - `relationship_signal_score = 0.5·shared_phone + 0.3·geo_close + 0.2·name_jaccard`,
     redondeado a 3 decimales. El teléfono cuenta aquí y en ningún otro lado.
3. **Decisión: `missing_fields`, `uncertainty` y `decide_ops_status`** (T3-A y T3-B).
   - `missing_fields(a, b)`: los campos de `EVIDENCE_FIELDS` que faltan (`None` o `""`) en al
     menos uno de los dos, en el orden de `EVIDENCE_FIELDS`.
   - `uncertainty(missing, conflict)`: `high` si hay conflicto (`|ER − REL| > 0.5`) o faltan dos
     campos o más; `med` si falta uno; si no, `low`.
   - `decide_ops_status(score, uncertainty)` aplica la matriz de T3-B en este orden: un score que
     no es número, que es `bool`, que no es finito o que está fuera de [0, 1], o una uncertainty
     desconocida → `invalid_input`; uncertainty `high` → `needs_review`; score < 0.40 → `abstain`;
     score < 0.80 → `needs_review`; si no, `accept_pair`. El score es el **ER**, nunca la mezcla.
4. **Cola clerical: `clerical_queue(decisions)`** (T1-B y T3-A). Los pares en `needs_review`,
   del mayor `evidence_score` al menor, y con empate por `pair_id`. `evidence_score =
   0.6·ER + 0.4·REL` solo ordena la cola: dice qué mira primero una persona, no quién es quién.
5. **Producto: `pseudonymize` y `privacy_sheet`** (T4-A y T4-B).
   - `pseudonymize(name)` deja la primera letra de cada palabra y `***`: `"Ana Quispe"` →
     `"A*** Q***"`. La cola muestra seudónimos, nunca nombres.
   - `privacy_sheet()` devuelve `data_class: "synthetic_only"`, `pii_real: False`,
     `egress_public_geocoder: "city_country_only"` y `roles: ["viewer", "reviewer"]`.
6. **`review(case) -> ReviewPacket`** (T1 a T4). Recorre cada par con `_pairs` y arma tres capas:
   - `entity_evidence`: `pair_id`, `entity_resolution_score`, `block_a` y `block_b`;
   - `relationship_evidence`: `pair_id`, `relationship_signal_score`, `signals` (las señales que
     dieron algo, en el orden de la regla 2) y `kinship_verdict: None`;
   - `decisions`: `pair_id`, `a` y `b` (seudónimos), `status`, `uncertainty`, `missing`,
     `evidence_score` (`None` si el ER es `None`), `explanation` (tres viñetas: ER, relación y lo
     que falta) y `rules_version`.

   El paquete lleva también `case_id` (el del caso), `rules_version` (`"n1-er-1.0"`, la de
   S13), `risk_decisions` (siempre `()`), `review_queue`
   (`clerical_queue(decisions)`), `privacy_sheet`, `corrections` (`()` al principio) y
   `human_review_required=True`. Un `id` repetido en el caso → `ValueError`.
7. **`apply_correction(packet, pair_id, new_status, reason)`** (T3-B). Devuelve un paquete
   **nuevo** con `dataclasses.replace` (S11), con el estado del par cambiado, la cola recalculada
   y una entrada más en `corrections`: `pair_id`, `from`, `to`, `reason` y `rules_version`. El
   paquete original no cambia. Lanza `ValueError` si el motivo está vacío, si el estado no es uno
   de `STATUSES` o si el par no existe.

## Interfaz
`cp_n1_c.review(case) -> ReviewPacket` y `cp_n1_c.apply_correction(packet, pair_id, new_status,
reason) -> ReviewPacket`. Con `data/case.json`: 66 pares, 1 `accept_pair`, 9 `needs_review`,
45 `abstain` y 11 `invalid_input`.

## Preguntas que suelen aparecer
- **¿`accept_pair` no es una decisión automática?** Es una acción sobre datos: dice que dos filas
  son la misma persona, porque comparten el documento y el bloque. No dice nada de la persona.
  La persona que revisa ve el par en el paquete y lo puede cambiar con `apply_correction`.
- **¿Por qué `P04-P11` va a revisión si su ER es 0.0?** Porque faltan dos campos (`phone` y
  `coords`), y con uncertainty `high` el programa no se atreve a abstenerse: lo mira una persona.
- **¿Por qué `P04-P05` es `invalid_input` si se llaman igual y viven en el mismo lugar?** Porque
  P05 no tiene documento. Sin documento no hay ER, y un nombre igual no lo reemplaza.
- **Los cuatro compañeros de oficina tienen relación 0.8. ¿Son familia?** No. Comparten la
  centralita y el edificio. El paquete muestra el score y las señales, `kinship_verdict` vale
  `None` y el par queda en `needs_review`.
- **¿Para qué sirve `risk_decisions` si siempre está vacío?** Para que la interfaz diga, y una
  prueba compruebe, que este producto no decide riesgo.
- **¿Por qué no puedo cambiar `packet.decisions`?** Porque `ReviewPacket` es `frozen`: una
  corrección construye un paquete nuevo, y el anterior queda como estaba. Así la corrección queda
  anotada.

## Criterios de aceptación
- la identidad, la relación y la decisión van en tres capas separadas, y ninguna lleva el score
  de otra
- el mismo documento y bloque → ER 1.0; falta el documento → ER `None` e `invalid_input`, nunca
  0.0
- un teléfono ausente nunca coincide con otro teléfono ausente
- los cortes 0.40 y 0.80 son exactos: 0.399 → `abstain`, 0.4 → `needs_review`, 0.8 →
  `accept_pair`
- `risk_decisions` siempre está vacío y `kinship_verdict` siempre es `None`
- ninguna clave `auto_fraud` ni `is_family`, y ningún valor que diga fraude, familia o parentesco
- la cola muestra seudónimos
- la hoja de privacidad está en el paquete, con sus cuatro claves
- una corrección sin motivo se rechaza; con motivo, queda anotada y el paquete original no cambia

## Fallos críticos (P0)
Un fallo crítico invalida la entrega aunque el resto esté bien:
- infiere fraude o parentesco, o escribe `auto_fraud` o `is_family`;
- mezcla el score de relación en la decisión de identidad;
- no deja que una persona revise ni corrija;
- no tiene hoja de privacidad, o muestra nombres en la cola;
- usa datos de personas reales.

## Limitaciones
Compara todos los pares (66 con 12 personas); con miles de personas haría falta el *blocking*
de S13 T1-A para no comparar todo con todo. Los pesos y cortes son de enseñanza, no calibrados.
La cercanía usa coordenadas sintéticas. El tablero es texto: no hay una interfaz gráfica.

## Remediación
- Si un par sin documento da 0.0, revisa que `er_score` devuelva `None` antes de comparar (T1-A).
- Si dos personas sin teléfono suman 0.5, revisa que `shared_phone` pida que el teléfono exista.
- Si 0.4 da `abstain`, revisa que la comparación sea `<` y no `<=` (T3-B).
- Si `apply_correction` cambia el paquete original, estás editando un dict compartido: construye
  uno nuevo para el par corregido.
