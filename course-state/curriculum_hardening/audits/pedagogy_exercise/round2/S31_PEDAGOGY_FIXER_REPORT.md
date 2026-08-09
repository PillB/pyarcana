# S31 Pedagogy Fixer Report (Round 2)

## Section
- **title:** Grafos y evidencia relacional
- **id:** `streaming-data` (archivo `s31-streaming-data.ts`; contenido = grafo de evidencia relacional CP-N3-B)
- **index:** 31
- **source:** `src/lib/course/sections/s31-streaming-data.ts`
- **Round-2 report:** `round2/S31_EXERCISE_PEDAGOGY_REPORT.md`
- **scope:** residual **P2 polish only** (no P0/P1; no code/output changes)

## Method
- Read `PEDAGOGY_EXERCISE_SPEC.md` and Round-2 unit ledger (priority: short/empty retros → feedback↔retro eco → iDo why/retro floor → optional feedback/instruction).
- Applied hand-written prose fixes unit-by-unit in the assigned section only.
- No generators, bulk templates, loops, or cross-section copy-paste.
- Prefer fewer stronger sentences; preserve starter/solution/output (none required).
- Validation: TypeScript check (`tsc --noEmit`) OK; priority retros now 51–67 w; key outputs intact; eco openings broken on T2-A-E2 / T4-B-E1 / T4-B-E2.

## Units touched

### High-priority short retros (C / almost-empty metacognition)

| Unit | Fields changed | Notes |
|------|----------------|-------|
| S31-T2-B-E2 | retrospective | Agregado vs detalle; misconception sobrescribir records; self-check `detail_kept` en CI |
| S31-T3-A-E2 | retrospective | Componentes acotan islas; `seen` incompleto / hardcode; self-check puente sintético |
| S31-T4-A-E2 | instruction, retrospective | Instruction a pasos claros; retro: no «arreglar» fixture; orden de flags al revisor |
| S31-T3-B-E2 | retrospective | Hub INF- vs PER-; hardcode ranking; self-check si hub fuera persona |
| S31-T4-B-E2 | retrospective | Hop→records mapeable; no inventar rids; self-check par ausente en `ev` |

### Eco feedback ↔ retrospective (replace retro)

| Unit | Fields changed | Notes |
|------|----------------|-------|
| S31-T1-A-E2 | retrospective | Flujo saliente ≠ popularidad de vecinos; self-check nodo solo-destino |
| S31-T1-B-E1 | retrospective | Densidad de hechos auditables; self-check «cuántos eventos entre E1–E2» |
| S31-T1-B-E2 | retrospective | Ventana no dispensa provenance; self-check borrar fuente vs vista |
| S31-T2-A-E2 | retrospective | Shared = disparador de cola, no sentencia; self-check call center |
| S31-T2-B-E1 | retrospective | Mapa raw→canónico S30→S31; self-check dónde guardar el mapa |
| S31-T2-B-E3 | retrospective | Cardinalidades vs sumas «se ven bien»; self-check fail vs warning en CI |
| S31-T3-A-E1 | retrospective | Grado filtra, no etiqueta; self-check triángulo grados 2 |
| S31-T4-B-E1 | retrospective | Mínimo necesario en vista/portafolio; self-check email fuera de `@example.pe` |

### iDo why / retrospective (floor + self-check)

| Unit | Fields changed | Notes |
|------|----------------|-------|
| S31-T1-B-DEMO | retrospective | `latest` ≠ borrar resto; self-check hop con solo última tx |
| S31-T2-A-DEMO | why, retrospective | Teléfono como nodo; self-check hop sin contacto de primera clase |
| S31-T2-B-DEMO | why, retrospective | Clave (src,dst,etype); self-check clic en hop E1→E2 |
| S31-T3-A-DEMO | why, retrospective | Orden estable para auditoría; self-check UI junto al path |
| S31-T3-B-DEMO | why, retrospective | Score ordena cola; self-check disclaimer en UI |
| S31-T4-A-DEMO | why, retrospective | Assert de membresía vs print; ego-k ≠ grafo entero |
| S31-T4-B-DEMO | why, retrospective | Redact + records; self-check rol que ve PII sin máscara |

### Light feedback expand (&lt;25 w)

| Unit | Fields changed | Notes |
|------|----------------|-------|
| S31-T1-A-E1 | feedback | +1 frase si `n_edges` queda 0 |
| S31-T1-B-E3 | feedback | Fail-closed + no arreglar fixture a mano |

## Units intentionally not touched
- **Pass A / no residual required:** T1-A-DEMO, T1-A-E3, T2-A-E1, T2-A-E3, T3-A-E3, T3-B-E1, T3-B-E3, T4-A-E1, T4-A-E3, T4-B-E3, youDo
- **Already solid A− with self-check:** T1-B-E3 retrospective (solo se tocó feedback)
- **Code/tests/outputs:** none (integrity traps already correct)
- **Titles / preambles:** left as Round-1 (structure pass)
- **Hints E1:** not de-spoiled (optional P2; acceptable guided tier)

## Code/output changes
**None.** All solution outputs and starter defects preserved (`edges=[]`, `out={}`, `path=None`, `return {seed}`, always-`render`, etc.).

## Validation
- [x] Only Section 31 source edited for pedagogy
- [x] No bulk prose generation
- [x] Feedback ≠ retrospective on previously eco units (metacognition + self-check where expanded)
- [x] Priority C/short retros expanded to ~51–67 words (spec 40–80)
- [x] All 8 iDo `why` ≥ 40 words
- [x] Ethics preserved: path/evidencia ≠ fraude/parentesco; centralidad ≠ culpa; `@example.pe`
- [x] `tsc --noEmit` clean
- [x] Outputs/starter solutions unchanged

## Residual after R2
- Optional length polish on already-**A** weDo retros still ~26–38 w (T1-A-E1, T1-A-E3, T1-B-E3, T2-A-E1, T2-A-E3, T3-A-E3, T3-B-E1, T3-B-E3, T4-A-E1, T4-A-E3, T4-B-E3) if a future pass wants a strict 40-word floor everywhere; not blocking — Round-2 said expand only where misconception/self-check was missing.
- E1 hints remain slightly formulaic (acceptable guided tier).
- Filename `s31-streaming-data.ts` / id `streaming-data` vs. title “Grafos…” remains a discovery quirk; out of scope for this polish.

## Summary counts
| Action | Count |
|--------|------:|
| weDo retrospective replaced/expanded | 13 |
| weDo feedback expanded | 2 |
| weDo instruction expanded | 1 |
| iDo retrospective expanded | 7 |
| iDo why expanded | 6 |
| Code/output edits | 0 |

Section 31 exercise pedagogy has been fixed and validated under strict anti-aberration rules. Ready for the next section.
