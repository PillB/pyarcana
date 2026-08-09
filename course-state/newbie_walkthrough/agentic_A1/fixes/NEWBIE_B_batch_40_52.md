# NEWBIE_B (Skeptic) — selfcheck batch S40–S52

**Agent:** Newbie Subagent B (Skeptic)
**attempt_id:** `agentic_A1`
**method:** `llm_packet_only_no_generator`
**persona:** skeptic
**source:** `quiz_batch_40_52.json` + section packets (no solutions / correctIndex / attempt_007b / TypeScript)
**recorded:** 2026-07-21T22:08:50Z

## Protocol

- Answered **all** selfCheck stems (no `blocked_on`).
- Justifications quote the active section **card/theory** (mapa V3, incremento CP-*, fixtures sintéticas / no PII).
- Zero Python outside packets; MCQ only from packet-local text.
- Updated field: `section_XX/newbie_b_live.json` → `selfcheck`.

## Answer key (Skeptic choices)

| Sec | Title | Q0 platform | Q1 gate | Q2 data | Q3 ER |
|-----|-------|-------------|---------|--------|-------|
| S40 | Arquitectura, DDD y decisiones técnicas | [0] `agentic-architecture` | [0] `CP-N4-A (inicio)` | [1] `Datos sintéticos` | [2] `Misma entidad cuando aplique` |
| S41 | APIs con FastAPI y contratos HTTP | [0] `llm-finetuning` | [0] `CP-N4-A (servicio)` | [1] `Datos sintéticos` | [2] `Misma entidad cuando aplique` |
| S42 | Schemas, seguridad y privacidad de servici | [0] `graph-rag` | [0] `CP-N4-A (control plane)` | [1] `Datos sintéticos` | [2] `Misma entidad cuando aplique` |
| S43 | Contenedores y reproducibilidad operativa | [0] `llmops` | [0] `CP-N4-A (cierre)` | [1] `Datos sintéticos` | [2] `Misma entidad cuando aplique` |
| S44 | CI/CD y seguridad de la cadena de suminist | [0] `multimodal` | [0] `CP-N4-B (inicio)` | [1] `Datos sintéticos` | [2] `Misma entidad cuando aplique` |
| S45 | Cloud, almacenamiento, colas e infraestruc | [0] `iac` | [0] `CP-N4-B (arquitectura)` | [1] `Datos sintéticos` | [2] `Misma entidad cuando aplique` |
| S46 | Ingeniería de datos y orquestación de prod | [0] `gpu-computing` | [0] `CP-N4-B (pipeline)` | [1] `Datos sintéticos` | [2] `Misma entidad cuando aplique` |
| S47 | MLOps: experimentos, registro y serving | [0] `opensource` | [0] `CP-N4-B (cierre) + CF-4` | [1] `Datos sintéticos` | [2] `Misma entidad cuando aplique` |
| S48 | LLM applications y RAG con evidencia | [0] `ai-governance` | [0] `CP-N4-C (inicio)` | [1] `Datos sintéticos` | [2] `Misma entidad cuando aplique` |
| S49 | Agentes, herramientas y context engineerin | [0] `data-contracts` | [0] `CP-N4-C (tools)` | [1] `Datos sintéticos` | [2] `Misma entidad cuando aplique` |
| S50 | Evals, red teaming y fiabilidad de IA | [0] `tech-leadership` | [0] `CP-N4-C (quality gate)` | [1] `Datos sintéticos` | [2] `Misma entidad cuando aplique` |
| S51 | Observabilidad, gobernanza y UX del copilo | [0] `integrator-final` | [0] `CP-N4-C (cierre) + CF-5 + Level-4 regression` | [1] `Datos sintéticos` | [2] `Misma entidad cuando aplique` |
| S52 | Enterprise Relationship & Operations Intel | [0] `career-strategy` | [0] `CP-FINAL exclusivamente` | [1] `Datos sintéticos` | [2] `Misma entidad cuando aplique` |

## Per-section justifications (summary)

### S40 — Arquitectura, DDD y decisiones técnicas

- **Q0** → `agentic-architecture` (idx 0, conf 0.96)
  - Skeptic: el mapa de la card cita literalmente el id de plataforma preservado. Quote: «En V3, **S40** retematiza el archivo de plataforma `agentic-architecture` hacia **Arquitectura, DDD y decisiones técnicas**.». Eso fija «agentic-architecture» y descarta renamed-v3 / legacy-drop…
- **Q1** → `CP-N4-A (inicio)` (idx 0, conf 0.95)
  - Skeptic: el gate/incremento V3 está nombrado en la teoría. Quote: «Integra el incremento **CP-N4-A (inicio)** sin exponer secretos ni PII real.». Coincide con la opción «CP-N4-A (inicio)»; CP-N1-A, «solo marketing» y «sin capstone» contradicen ese texto.
- **Q2** → `Datos sintéticos` (idx 1, conf 0.97)
  - Skeptic: la card prohíbe PII/secretos y exige fixtures sintéticas. Quote (orden/mapa): «Orden T1→T4 según blueprint phase3. Español peruano; fixtures sintéticas; esta lane no marca section_passed ni edita seed/checkpoint/ledger.». Y en outcomes de subtema: «Orden T1→T4 según blue…
- **Q3** → `Misma entidad cuando aplique` (idx 2, conf 0.88)
  - Skeptic: la card separa ER de otros concerns y no le asigna fraude/parentesco/sentimiento. Quote: «Incremento: mapa de arquitectura que separa intake, ER, relación, triage, reporting e IA, con contratos y responsables explícitos.». El stem del selfCheck de la card pregunta qué de…

### S41 — APIs con FastAPI y contratos HTTP

- **Q0** → `llm-finetuning` (idx 0, conf 0.96)
  - Skeptic: el mapa de la card cita literalmente el id de plataforma preservado. Quote: «En V3, **S41** retematiza el archivo de plataforma `llm-finetuning` hacia **APIs con FastAPI y contratos HTTP**.». Eso fija «llm-finetuning» y descarta renamed-v3 / legacy-drop / random (no apar…
- **Q1** → `CP-N4-A (servicio)` (idx 0, conf 0.95)
  - Skeptic: el gate/incremento V3 está nombrado en la teoría. Quote: «Integra el incremento **CP-N4-A (servicio)** sin exponer secretos ni PII real.». Coincide con la opción «CP-N4-A (servicio)»; CP-N1-A, «solo marketing» y «sin capstone» contradicen ese texto.
- **Q2** → `Datos sintéticos` (idx 1, conf 0.97)
  - Skeptic: la card prohíbe PII/secretos y exige fixtures sintéticas. Quote (orden/mapa): «Orden T1→T4 según blueprint phase3. Español peruano; fixtures sintéticas; esta lane no marca section_passed ni edita seed/checkpoint/ledger.». Y en outcomes de subtema: «Incremento: API versio…
- **Q3** → `Misma entidad cuando aplique` (idx 2, conf 0.88)
  - Skeptic: la card separa ER de otros concerns y no le asigna fraude/parentesco/sentimiento. Quote: «Incremento: API versionada que crea jobs y consulta resultados/evidencia, sin exponer PII ni claves internas.». El stem del selfCheck de la card pregunta qué decide ER «si aparece»;…

### S42 — Schemas, seguridad y privacidad de servicios

- **Q0** → `graph-rag` (idx 0, conf 0.96)
  - Skeptic: el mapa de la card cita literalmente el id de plataforma preservado. Quote: «En V3, **S42** retematiza el archivo de plataforma `graph-rag` hacia **Schemas, seguridad y privacidad de servicios**.». Eso fija «graph-rag» y descarta renamed-v3 / legacy-drop / random (no apa…
- **Q1** → `CP-N4-A (control plane)` (idx 0, conf 0.95)
  - Skeptic: el gate/incremento V3 está nombrado en la teoría. Quote: «Integra el incremento **CP-N4-A (control plane)** sin exponer secretos ni PII real.». Coincide con la opción «CP-N4-A (control plane)»; CP-N1-A, «solo marketing» y «sin capstone» contradicen ese texto.
- **Q2** → `Datos sintéticos` (idx 1, conf 0.97)
  - Skeptic: la card prohíbe PII/secretos y exige fixtures sintéticas. Quote (orden/mapa): «Orden T1→T4 según blueprint phase3. Español peruano; fixtures sintéticas; esta lane no marca section_passed ni edita seed/checkpoint/ledger.». Y en outcomes de subtema: «Orden T1→T4 según blue…
- **Q3** → `Misma entidad cuando aplique` (idx 2, conf 0.88)
  - Skeptic: la card separa ER de otros concerns y no le asigna fraude/parentesco/sentimiento. Quote: «Incremento: threat model y pruebas de permisos; un usuario no puede acceder a otro caso ni recuperar datos redacted.». El stem del selfCheck de la card pregunta qué decide ER «si ap…

### S43 — Contenedores y reproducibilidad operativa

- **Q0** → `llmops` (idx 0, conf 0.96)
  - Skeptic: el mapa de la card cita literalmente el id de plataforma preservado. Quote: «En V3, **S43** retematiza el archivo de plataforma `llmops` hacia **Contenedores y reproducibilidad operativa**. **FINAL/CLOSE gate** (CLOSE).». Eso fija «llmops» y descarta renamed-v3 / legacy-…
- **Q1** → `CP-N4-A (cierre)` (idx 0, conf 0.95)
  - Skeptic: el gate/incremento V3 está nombrado en la teoría. Quote: «Integra el incremento **CP-N4-A (cierre)** sin exponer secretos ni PII real.». Coincide con la opción «CP-N4-A (cierre)»; CP-N1-A, «solo marketing» y «sin capstone» contradicen ese texto.
- **Q2** → `Datos sintéticos` (idx 1, conf 0.97)
  - Skeptic: la card prohíbe PII/secretos y exige fixtures sintéticas. Quote (orden/mapa): «Orden T1→T4 según blueprint phase3. Español peruano; fixtures sintéticas; esta lane no marca section_passed ni edita seed/checkpoint/ledger.». Y en outcomes de subtema: «Orden T1→T4 según blue…
- **Q3** → `Misma entidad cuando aplique` (idx 2, conf 0.88)
  - Skeptic: la card separa ER de otros concerns y no le asigna fraude/parentesco/sentimiento. Quote: «Incremento: Governed Python Service Platform levanta con un comando, ejecuta tests/health checks, usa usuario no root y documenta configuración y recuperación.». El stem del selfChe…

### S44 — CI/CD y seguridad de la cadena de suministro

- **Q0** → `multimodal` (idx 0, conf 0.96)
  - Skeptic: el mapa de la card cita literalmente el id de plataforma preservado. Quote: «En V3, **S44** retematiza el archivo de plataforma `multimodal` hacia **CI/CD y seguridad de la cadena de suministro**.». Eso fija «multimodal» y descarta renamed-v3 / legacy-drop / random (no a…
- **Q1** → `CP-N4-B (inicio)` (idx 0, conf 0.95)
  - Skeptic: el gate/incremento V3 está nombrado en la teoría. Quote: «Integra el incremento **CP-N4-B (inicio)** sin exponer secretos ni PII real.». Coincide con la opción «CP-N4-B (inicio)»; CP-N1-A, «solo marketing» y «sin capstone» contradicen ese texto.
- **Q2** → `Datos sintéticos` (idx 1, conf 0.97)
  - Skeptic: la card prohíbe PII/secretos y exige fixtures sintéticas. Quote (orden/mapa): «Orden T1→T4 según blueprint phase3. Español peruano; fixtures sintéticas; esta lane no marca section_passed ni edita seed/checkpoint/ledger.». Y en outcomes de subtema: «Orden T1→T4 según blue…
- **Q3** → `Misma entidad cuando aplique` (idx 2, conf 0.88)
  - Skeptic: la card separa ER de otros concerns y no le asigna fraude/parentesco/sentimiento. Quote: «Incremento: pipeline que bloquea dependencia insegura o test crítico, publica artefacto verificable y demuestra rollback en entorno de prueba.». El stem del selfCheck de la card pre…

### S45 — Cloud, almacenamiento, colas e infraestructura

- **Q0** → `iac` (idx 0, conf 0.96)
  - Skeptic: el mapa de la card cita literalmente el id de plataforma preservado. Quote: «En V3, **S45** retematiza el archivo de plataforma `iac` hacia **Cloud, almacenamiento, colas e infraestructura**.». Eso fija «iac» y descarta renamed-v3 / legacy-drop / random (no aparecen como…
- **Q1** → `CP-N4-B (arquitectura)` (idx 0, conf 0.95)
  - Skeptic: el gate/incremento V3 está nombrado en la teoría. Quote: «Integra el incremento **CP-N4-B (arquitectura)** sin exponer secretos ni PII real.». Coincide con la opción «CP-N4-B (arquitectura)»; CP-N1-A, «solo marketing» y «sin capstone» contradicen ese texto.
- **Q2** → `Datos sintéticos` (idx 1, conf 0.97)
  - Skeptic: la card prohíbe PII/secretos y exige fixtures sintéticas. Quote (orden/mapa): «Orden T1→T4 según blueprint phase3. Español peruano; fixtures sintéticas; esta lane no marca section_passed ni edita seed/checkpoint/ledger.». Y en outcomes de subtema: «Orden T1→T4 según blue…
- **Q3** → `Misma entidad cuando aplique` (idx 2, conf 0.88)
  - Skeptic: la card separa ER de otros concerns y no le asigna fraude/parentesco/sentimiento. Quote: «Incremento: job asíncrono con artifact store, status, retry y dead-letter; permisos y costos presupuestados.». El stem del selfCheck de la card pregunta qué decide ER «si aparece»; …

### S46 — Ingeniería de datos y orquestación de producción

- **Q0** → `gpu-computing` (idx 0, conf 0.96)
  - Skeptic: el mapa de la card cita literalmente el id de plataforma preservado. Quote: «En V3, **S46** retematiza el archivo de plataforma `gpu-computing` hacia **Ingeniería de datos y orquestación de producción**.». Eso fija «gpu-computing» y descarta renamed-v3 / legacy-drop / ra…
- **Q1** → `CP-N4-B (pipeline)` (idx 0, conf 0.95)
  - Skeptic: el gate/incremento V3 está nombrado en la teoría. Quote: «Integra el incremento **CP-N4-B (pipeline)** sin exponer secretos ni PII real.». Coincide con la opción «CP-N4-B (pipeline)»; CP-N1-A, «solo marketing» y «sin capstone» contradicen ese texto.
- **Q2** → `Datos sintéticos` (idx 1, conf 0.97)
  - Skeptic: la card prohíbe PII/secretos y exige fixtures sintéticas. Quote (orden/mapa): «Orden T1→T4 según blueprint phase3. Español peruano; fixtures sintéticas; esta lane no marca section_passed ni edita seed/checkpoint/ledger.». Y en outcomes de subtema: «Orden T1→T4 según blue…
- **Q3** → `Misma entidad cuando aplique` (idx 2, conf 0.88)
  - Skeptic: la card separa ER de otros concerns y no le asigna fraude/parentesco/sentimiento. Quote: «Incremento: pipeline incremental/backfillable cuya reejecución no duplica, registra lineage y alerta por dato tardío o contrato roto.». El stem del selfCheck de la card pregunta qué…

### S47 — MLOps: experimentos, registro y serving

- **Q0** → `opensource` (idx 0, conf 0.96)
  - Skeptic: el mapa de la card cita literalmente el id de plataforma preservado. Quote: «En V3, **S47** retematiza el archivo de plataforma `opensource` hacia **MLOps: experimentos, registro y serving**. **FINAL/CLOSE gate** (CLOSE + CF-4).». Eso fija «opensource» y descarta renamed…
- **Q1** → `CP-N4-B (cierre) + CF-4` (idx 0, conf 0.95)
  - Skeptic: el gate/incremento V3 está nombrado en la teoría. Quote: «Integra el incremento **CP-N4-B (cierre) + CF-4** sin exponer secretos ni PII real.». Coincide con la opción «CP-N4-B (cierre) + CF-4»; CP-N1-A, «solo marketing» y «sin capstone» contradicen ese texto.
- **Q2** → `Datos sintéticos` (idx 1, conf 0.97)
  - Skeptic: la card prohíbe PII/secretos y exige fixtures sintéticas. Quote (orden/mapa): «Orden T1→T4 según blueprint phase3. Español peruano; fixtures sintéticas; esta lane no marca section_passed ni edita seed/checkpoint/ledger.». Y en outcomes de subtema: «Orden T1→T4 según blue…
- **Q3** → `Misma entidad cuando aplique` (idx 2, conf 0.88)
  - Skeptic: la card separa ER de otros concerns y no le asigna fraude/parentesco/sentimiento. Quote: «Incremento: Production Data/ML Platform promueve un modelo desde experimento hasta servicio solo tras gates, conserva lineage y revierte sin perder decisiones. CF-4 valida la ruta d…

### S48 — LLM applications y RAG con evidencia

- **Q0** → `ai-governance` (idx 0, conf 0.96)
  - Skeptic: el mapa de la card cita literalmente el id de plataforma preservado. Quote: «En V3, **S48** retematiza el archivo de plataforma `ai-governance` hacia **LLM applications y RAG con evidencia**.». Eso fija «ai-governance» y descarta renamed-v3 / legacy-drop / random (no apa…
- **Q1** → `CP-N4-C (inicio)` (idx 0, conf 0.95)
  - Skeptic: el gate/incremento V3 está nombrado en la teoría. Quote: «Integra el incremento **CP-N4-C (inicio)** sin exponer secretos ni PII real.». Coincide con la opción «CP-N4-C (inicio)»; CP-N1-A, «solo marketing» y «sin capstone» contradicen ese texto.
- **Q2** → `Datos sintéticos` (idx 1, conf 0.97)
  - Skeptic: la card prohíbe PII/secretos y exige fixtures sintéticas. Quote (orden/mapa): «Orden T1→T4 según blueprint phase3. Español peruano; fixtures sintéticas; esta lane no marca section_passed ni edita seed/checkpoint/ledger.». Y en outcomes de subtema: «Orden T1→T4 según blue…
- **Q3** → `Misma entidad cuando aplique` (idx 2, conf 0.88)
  - Skeptic: la card separa ER de otros concerns y no le asigna fraude/parentesco/sentimiento. Quote: «Incremento: asistente responde sobre documentación autorizada, cita fragmentos verificables y se abstiene cuando retrieval no sostiene la respuesta.». El stem del selfCheck de la ca…

### S49 — Agentes, herramientas y context engineering

- **Q0** → `data-contracts` (idx 0, conf 0.96)
  - Skeptic: el mapa de la card cita literalmente el id de plataforma preservado. Quote: «En V3, **S49** retematiza el archivo de plataforma `data-contracts` hacia **Agentes, herramientas y context engineering**.». Eso fija «data-contracts» y descarta renamed-v3 / legacy-drop / rando…
- **Q1** → `CP-N4-C (tools)` (idx 0, conf 0.95)
  - Skeptic: el gate/incremento V3 está nombrado en la teoría. Quote: «Integra el incremento **CP-N4-C (tools)** sin exponer secretos ni PII real.». Coincide con la opción «CP-N4-C (tools)»; CP-N1-A, «solo marketing» y «sin capstone» contradicen ese texto.
- **Q2** → `Datos sintéticos` (idx 1, conf 0.97)
  - Skeptic: la card prohíbe PII/secretos y exige fixtures sintéticas. Quote (orden/mapa): «Orden T1→T4 según blueprint phase3. Español peruano; fixtures sintéticas; esta lane no marca section_passed ni edita seed/checkpoint/ledger.». Y en outcomes de subtema: «Orden T1→T4 según blue…
- **Q3** → `Misma entidad cuando aplique` (idx 2, conf 0.88)
  - Skeptic: la card separa ER de otros concerns y no le asigna fraude/parentesco/sentimiento. Quote: «Incremento: agente acotado puede consultar casos/reportes y preparar una propuesta, pero no enviar, modificar producción ni decidir riesgo sin aprobación.». El stem del selfCheck de…

### S50 — Evals, red teaming y fiabilidad de IA

- **Q0** → `tech-leadership` (idx 0, conf 0.96)
  - Skeptic: el mapa de la card cita literalmente el id de plataforma preservado. Quote: «En V3, **S50** retematiza el archivo de plataforma `tech-leadership` hacia **Evals, red teaming y fiabilidad de IA**.». Eso fija «tech-leadership» y descarta renamed-v3 / legacy-drop / random (n…
- **Q1** → `CP-N4-C (quality gate)` (idx 0, conf 0.95)
  - Skeptic: el gate/incremento V3 está nombrado en la teoría. Quote: «Integra el incremento **CP-N4-C (quality gate)** sin exponer secretos ni PII real.». Coincide con la opción «CP-N4-C (quality gate)»; CP-N1-A, «solo marketing» y «sin capstone» contradicen ese texto.
- **Q2** → `Datos sintéticos` (idx 1, conf 0.97)
  - Skeptic: la card prohíbe PII/secretos y exige fixtures sintéticas. Quote (orden/mapa): «Orden T1→T4 según blueprint phase3. Español peruano; fixtures sintéticas; esta lane no marca section_passed ni edita seed/checkpoint/ledger.». Y en outcomes de subtema: «Orden T1→T4 según blue…
- **Q3** → `Misma entidad cuando aplique` (idx 2, conf 0.88)
  - Skeptic: la card separa ER de otros concerns y no le asigna fraude/parentesco/sentimiento. Quote: «Incremento: suite repetible compara baseline/candidato y bloquea regresiones P0/P1; incluye argumentos de tool call y reanudación, no solo texto final.». El stem del selfCheck de la…

### S51 — Observabilidad, gobernanza y UX del copiloto

- **Q0** → `integrator-final` (idx 0, conf 0.96)
  - Skeptic: el mapa de la card cita literalmente el id de plataforma preservado. Quote: «En V3, **S51** retematiza el archivo de plataforma `integrator-final` hacia **Observabilidad, gobernanza y UX del copiloto**. **FINAL/CLOSE gate** (CLOSE + Level-4 regression + CF-5).». Eso fija…
- **Q1** → `CP-N4-C (cierre) + CF-5 + Level-4 regression` (idx 0, conf 0.95)
  - Skeptic: el gate/incremento V3 está nombrado en la teoría. Quote: «Integra el incremento **CP-N4-C (cierre) + CF-5 + Level-4 regression** sin exponer secretos ni PII real.». Coincide con la opción «CP-N4-C (cierre) + CF-5 + Level-4 regression»; CP-N1-A, «solo marketing» y «sin ca…
- **Q2** → `Datos sintéticos` (idx 1, conf 0.97)
  - Skeptic: la card prohíbe PII/secretos y exige fixtures sintéticas. Quote (orden/mapa): «Orden T1→T4 según blueprint phase3. Español peruano; fixtures sintéticas; esta lane no marca section_passed ni edita seed/checkpoint/ledger.». Y en outcomes de subtema: «Orden T1→T4 según blue…
- **Q3** → `Misma entidad cuando aplique` (idx 2, conf 0.88)
  - Skeptic: la card separa ER de otros concerns y no le asigna fraude/parentesco/sentimiento. Quote: «Incremento: Auditable AI Operations Copilot aprobado con system card y dashboard operativo que permiten saber qué versión respondió, qué evidencia usó, qué tool llamó y cómo reverti…

### S52 — Enterprise Relationship & Operations Intelligence Platform: capstone final

- **Q0** → `career-strategy` (idx 0, conf 0.96)
  - Skeptic: el mapa de la card cita literalmente el id de plataforma preservado. Quote: «En V3, **S52** retematiza el archivo de plataforma `career-strategy` hacia **Enterprise Relationship & Operations Intelligence Platform: capstone final**. **FINAL/CLOSE gate** (FINAL — independe…
- **Q1** → `CP-FINAL exclusivamente` (idx 0, conf 0.95)
  - Skeptic: el gate/incremento V3 está nombrado en la teoría. Quote: «Integra el incremento **CP-FINAL exclusivamente** sin exponer secretos ni PII real.». Coincide con la opción «CP-FINAL exclusivamente»; CP-N1-A, «solo marketing» y «sin capstone» contradicen ese texto.
- **Q2** → `Datos sintéticos` (idx 1, conf 0.97)
  - Skeptic: la card prohíbe PII/secretos y exige fixtures sintéticas. Quote (orden/mapa): «Orden T1→T4 según blueprint phase3. Español peruano; fixtures sintéticas; esta lane no marca section_passed ni edita seed/checkpoint/ledger.». Y en outcomes de subtema: «Incremento: Enterprise…
- **Q3** → `Misma entidad cuando aplique` (idx 2, conf 0.88)
  - Skeptic: la card separa ER de otros concerns y no le asigna fraude/parentesco/sentimiento. Quote: «Incremento: Enterprise Relationship & Operations Intelligence Platform integra, con contratos y datos sintéticos, Familiarity Dashboard, VP RPA/AI, ER/grafos/triage, reporting y cop…

## Confusion / residual notes (Skeptic)

- Phase-3 theory blocks are often blueprint placeholders, but **mapa + incremento CP + fixtures sintéticas** are explicit enough for these four stems.
- **Q3 ER:** card rarely restates the full ER definition in S40–S52; support is indirect (mapa separa intake/ER/relación; S52 cita «ER/grafos/triage»). Chose «Misma entidad cuando aplique» as the only option consistent with ER-as-entity-match and not parentesco/fraude/sentimiento. Confidence slightly lower (0.88).
- Platform ids (legacy filenames like `llm-finetuning`, `graph-rag`) look surprising next to V3 titles — but the mapa quote is unambiguous.
- No selfcheck `blocked_on`; exercises were pre-filled and left unchanged in this pass.

## Artifacts touched

- `course-state/newbie_walkthrough/agentic_A1/section_40/newbie_b_live.json` (`selfcheck` filled, n=4)
- `course-state/newbie_walkthrough/agentic_A1/section_41/newbie_b_live.json` (`selfcheck` filled, n=4)
- `course-state/newbie_walkthrough/agentic_A1/section_42/newbie_b_live.json` (`selfcheck` filled, n=4)
- `course-state/newbie_walkthrough/agentic_A1/section_43/newbie_b_live.json` (`selfcheck` filled, n=4)
- `course-state/newbie_walkthrough/agentic_A1/section_44/newbie_b_live.json` (`selfcheck` filled, n=4)
- `course-state/newbie_walkthrough/agentic_A1/section_45/newbie_b_live.json` (`selfcheck` filled, n=4)
- `course-state/newbie_walkthrough/agentic_A1/section_46/newbie_b_live.json` (`selfcheck` filled, n=4)
- `course-state/newbie_walkthrough/agentic_A1/section_47/newbie_b_live.json` (`selfcheck` filled, n=4)
- `course-state/newbie_walkthrough/agentic_A1/section_48/newbie_b_live.json` (`selfcheck` filled, n=4)
- `course-state/newbie_walkthrough/agentic_A1/section_49/newbie_b_live.json` (`selfcheck` filled, n=4)
- `course-state/newbie_walkthrough/agentic_A1/section_50/newbie_b_live.json` (`selfcheck` filled, n=4)
- `course-state/newbie_walkthrough/agentic_A1/section_51/newbie_b_live.json` (`selfcheck` filled, n=4)
- `course-state/newbie_walkthrough/agentic_A1/section_52/newbie_b_live.json` (`selfcheck` filled, n=4)
- `course-state/newbie_walkthrough/agentic_A1/fixes/NEWBIE_B_batch_40_52.md` (this file)

