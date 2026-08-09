# Tablero de Evidencia de Familiaridad

**Versión:** 2.0.0 · **Nivel:** 1 · **Gate:** S13

## Usuario y problema
- **Usuario:** Analista que revisa señales de familiaridad sobre datos sintéticos.
- **Problema:** Integrar admisión, ETL y señales analíticas en un tablero de revisión humana que SEPARA evidencia de entidades, evidencia de relaciones y decisiones de riesgo, sin inferir automáticamente fraude, parentesco, colusión o causalidad.

## Prerrequisitos
CP-N1-A, CP-N1-B. S09 (visualización), S10 (sklearn básico), S11 (testing), S12 (performance).

## Secciones que contribuyen
S09, S10, S11, S12, S13

## Datos
Clientes sintéticos con señales: coincidencia exacta/normalizada, similitud difusa, traslape temporal, proximidad geográfica, identificadores compartidos.

Campos: entity_id, signal_type, signal_value, provenance (esto es, la trazabilidad: de dónde viene cada dato o resultado), confidence, timestamp

## Criterios de aceptación
- señal de coincidencia exacta → evidencia de entidad
- similitud difusa en umbral (esto es, el valor de corte: por encima se decide una cosa, por debajo otra) → revisión humana
- no se infiere fraude automáticamente
- evidencia de entidad ≠ evidencia de relación ≠ decisión
- hoja de privacidad presente

## Fallos críticos (P0)
- Infiere fraude/parentesco automáticamente
- Sin revisión humana
- Sin hoja de privacidad
- Sin mecanismo de corrección

## Limitaciones
Solo señales de familiaridad, no decisiones. No infiere relaciones. Requiere revisión humana.

## Remediación
Si el tablero mezcla evidencia con decisión, separa las tres capas. Si falta la hoja de privacidad, agrégala antes de mostrar el tablero.

## Interfaz de integración final
`familiarity.review(case) -> ReviewPacket` — Recibe un case (dict con señales). Devuelve ReviewPacket con: entity_evidence, relationship_evidence, risk_decisions (vacío), privacy_sheet, correction_mechanism, human_review_required=True.
