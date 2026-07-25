# Section 12 — Explorer Curriculum Audit Report

**Section:** S12 — `APIs, SQL y geodatos responsables`
**File (repo):** `src/lib/course/sections/s12-performance.ts`
**Live site:** https://pillb.github.io/pyarcana/ (sidebar slot 12, shortTitle: "APIs · SQL · Geo")
**Phase:** 0 — Fundamentos (sections 1–13)
**Auditor:** Curriculum Auditor (general-purpose)
**Method:** Stanford STORM + Graph Engineering + Loop Engineering + Harness Engineering; live-site fetch, repo clone, LanguageTool (es) public API, custom Fernández-Huerta/INFLESZ/WPS/SPW pipeline, code-execution verification of every demo/exercise.

---

## 1. Section Identification & Scope

| Field | Value |
|-------|-------|
| Section number (course order) | **12** (12th in `COURSE_SECTIONS`, confirmed via `src/lib/course/index.ts` lines 70–71) |
| `id` | `"performance"` |
| `index` | `12` |
| `title` | `"APIs, SQL y geodatos responsables"` |
| `shortTitle` | `"APIs · SQL · Geo"` |
| `tagline` | `"HTTP resiliente, SQL parametrizado, geocoding autorizado y adaptadores limitados sin PII bancaria a servicios públicos"` |
| `estimatedHours` | 19 |
| `level` | Intermedio |
| `phase` | 0 (Fundamentos) |
| `icon` / `accentColor` | `MapPin` / `from-indigo-500 to-purple-600` |
| Source line count | 1,968 lines (`s12-performance.ts`) |
| Live sidebar label | "APIs · SQL · Geo" (confirmed in fetched HTML) |

**Scope audited:** All learner-facing prose fields — `jobRelevance`, `learningOutcomes[]`, `theory[].heading`, `theory[].paragraphs[]`, `theory[].callout.{title,content}`, `iDo.intro`, `iDo.steps[].{description,why}`, `weDo.intro`, `weDo.steps[].{instruction,hint,hints[],feedback,edgeCases,tests}`, `youDo.{title,context,objectives,requirements,portfolioNote,rubric}`, `selfCheck.questions[].{question,options,explanation}`, `resources.{docs,books,courses}[*].{note}`. Plus all `code`/`output` pairs in theory, all `starterCode`/`solutionCode`/`output` triples in We Do, and the `youDo.starterCode` body.

**Sections excluded per grammar subplan:** pure Python code bodies, `solutionCode.code`, `output` strings (verified separately for code/output consistency). The I Do / We Do / You Do / Self-check tabs were all read end-to-end.

---

## 2. Executive Summary of Quality

**Composite score: 6.0 / 10**

**Verdict:** Pedagogically **strong** (clear progressive disclosure T1→T4, honest ethics framing — fail-closed, egress allowlist, `signal != kinship`, CP-N1-C capstone alignment with S11/S13, I Do/We Do/You Do/selfCheck all populated, 24 We Do exercises with starter/solution/DEFECT structure) but undermined by a **systematic code/output integrity defect** in the geocoding blocks: at least three theory/demos and four We Do exercises ship `output:` strings that do not match what the printed code actually produces when run. A learner who executes the demos will see output that contradicts the page. Several `Salida/pass:` claims likewise disagree with their own `solutionCode` and `solutionCode.output`. Orthography is mostly clean Peruvian Spanish with a small recurring set of borrowings/orthography issues (`APIs` for `API`, `cache` for `caché`, `auto-etiqueta` for `autoetiqueta`, two `y → e` slips, `vs` without period). No AI-to-developer meta-leaks were found in the user-facing prose; the only meta-residue is the filename `s12-performance.ts` and the section `id: "performance"`, which are remnants of the pre-V3 topic ("Performance & concurrency") and no longer match the title.

---

## 3. Detailed Issue Registry

> Severity legend: **H** = blocks learning / breaks contract; **M** = notable defect; **L** = polish.

### A. Code/Output Integrity Defects (HIGH — primary risk to learner trust)

#### Issue #1 — Theory T4-A `mock_geocode.py` output is fabricated
- **Location:** `theory[6].code` (lines 322–350), heading "Normalización y geocoding autorizado", subtopicId `S12-T4-A`.
- **Code:**
  ```python
  class MockGeocoder:
      TABLE = {
          "Sucursal-Centro": (-12.0464, -77.0428),
          "Arequipa": (-16.4090, -71.5375),
      }
      def geocode(self, city: str):
          key = city.strip().title()
          coords = self.TABLE.get(key)
          if not coords:
              return None
          lat, lon = coords
          return {"city": key, "lat": lat, "lon": lon, "provider": "mock"}

  addr = normalize_address("  av.  larco  123  ")
  geo = MockGeocoder().geocode("lima")
  ```
- **Claimed `output:`:** `addr av. larco 123` then `geo {'city': 'Oficina-Este', 'lat': -12.0464, 'lon': -77.0428, 'provider': 'mock'}`
- **Actual output (executed):** `addr av. larco 123` then `geo None`
- **Root cause:** `"lima".title()` → `"Lima"`; `TABLE.get("Lima")` → `None` (TABLE only has `Sucursal-Centro` and `Arequipa`). The fabricated `output:` line additionally references a city name (`Oficina-Este`) that does not appear anywhere in the code block.
- **Pedagogical impact:** A learner who runs the demo sees `None` where the page promises a coord dict. The first encounter with the MockGeocoder contract is broken. This is the first T4 theory block and the first time the learner sees a geocoder interface — the failure erodes trust in every subsequent `output:` claim.
- **Severity:** H

#### Issue #2 — I Do demo S12-T4-A-DEMO `mock_cities_demo.py` output is fabricated (2 of 3 lines)
- **Location:** `iDo.steps[6].code` (lines 605–622), demoId `S12-T4-A-DEMO`, subtopicId `S12-T4-A`.
- **Code:**
  ```python
  class MockGeocoder:
      DB = {"Cliente-A": (-12.0464, -77.0428), "Cliente-B": (-16.4090, -71.5375)}
      def geocode(self, city):
          if city not in self.DB:
              return None
          lat, lon = self.DB[city]
          return {"city": city, "lat": lat, "lon": lon, "provider": "authorized_mock"}

  g = MockGeocoder()
  for c in ("Sucursal-Norte", "Sucursal-Sur", "Iquitos"):
      print(c, g.geocode(c))
  ```
- **Claimed `output:`:**
  ```
  Sucursal-Centro {'city': 'Oficina-Este', 'lat': -12.0464, 'lon': -77.0428, 'provider': 'authorized_mock'}
  Oficina-Oeste {'city': 'Cliente-A', 'lat': -16.409, 'lon': -71.5375, 'provider': 'authorized_mock'}
  Iquitos None
  ```
- **Actual output (executed):**
  ```
  Sucursal-Norte None
  Sucursal-Sur None
  Iquitos None
  ```
- **Root cause:** Loop variables `Sucursal-Norte` and `Sucursal-Sur` are not keys in `DB` (`Cliente-A`, `Cliente-B`), so `geocode()` returns `None` for them. The fabricated output additionally uses two MORE city names (`Sucursal-Centro`, `Oficina-Oeste`) that appear in NEITHER the loop NOR the DB. One line (`Iquitos None`) happens to match.
- **Pedagogical impact:** This is the *I Do* demonstration — the expert "think-aloud" that should model the correct mental model. Two of three lines fabricate both the label and the dict. The demo's stated lesson "Oficina-Oeste y Arequipa devuelven lat/lon fijos; Iquitos → None (fail-closed, no inventa punto)" is contradicted by the code, which actually demonstrates "three cities → three Nones". The `description:` field at line 604 also references `Oficina-Oeste` which is not in the code at all.
- **Severity:** H

#### Issue #3 — I Do demo S12-T2-B-DEMO `geocoder_contract_demo.py` raises KeyError; output fabricated
- **Location:** `iDo.steps[3].code` (lines 510–531), demoId `S12-T2-B-DEMO`, subtopicId `S12-T2-B`.
- **Code:**
  ```python
  REQUIRED = {"lat", "lon", "provider"}
  PRECALC = {"Sucursal-Norte": {"lat": -12.0464, "lon": -77.0428, "provider": "precalc"}}

  def contract_ok(d):
      return not (REQUIRED - set(d.keys()))

  def geocode(city, fail_online=False):
      if fail_online:
          return {**PRECALC[city], "mode": "offline_fallback"}
      ...

  print("online", geocode("Sucursal-Sur"))
  print("fallback", geocode("Sucursal-Centro", fail_online=True))
  print("contract_precalc", contract_ok(PRECALC["Oficina-Este"]))
  ```
- **Claimed `output:`:**
  ```
  online {'lat': -12.0464, 'lon': -77.0428, 'provider': 'mock', 'mode': 'online'}
  fallback {'lat': -12.0464, 'lon': -77.0428, 'provider': 'precalc', 'mode': 'offline_fallback'}
  contract_precalc True
  ```
- **Actual output (executed):** prints the `online` line, then raises `KeyError: 'Sucursal-Centro'` (PRECALC only has `Sucursal-Norte`); the third line would also raise `KeyError: 'Oficina-Este'` if reached.
- **Pedagogical impact:** The I Do demo crashes mid-execution. The "fallback" path the demo is supposed to model never executes. A learner who runs the code sees a Python traceback where the page shows a successful fallback. The `description:` at line 509 also references "Cliente-B" which is not in the code.
- **Severity:** H

#### Issue #4 — We Do S12-T1-A-E1: four different city names for the same record
- **Location:** `weDo.steps[0]` (lines 660–697), id `S12-T1-A-E1`.
- **Starter `code`:** `store = {"C001": {"id": "C001", "region": "Sucursal-Centro"}}`
- **`Salida/pass` (in `instruction`):** `(200, {'id': 'C001', 'region': 'Sucursal-Sur'})`
- **`solutionCode.code`:** `store = {"C001": {"id": "C001", "region": "Oficina-Este"}}`
- **`solutionCode.output`:** `(200, {'id': 'C001', 'region': 'Oficina-Oeste'})` then `(404, {'error': 'not_found'})`
- **Actual `solutionCode.code` output (executed):** `(200, {'id': 'C001', 'region': 'Oficina-Este'})` then `(404, {'error': 'not_found'})`
- **Mismatch:** The `Salida/pass` says `Sucursal-Sur`, the solution code says `Oficina-Este`, the solution output says `Oficina-Oeste` — three mutually inconsistent city names. A learner can never satisfy the `Salida/pass` with the provided solution.
- **Pedagogical impact:** First We Do exercise of the section; the learner's first attempt to verify their work fails because the page contradicts itself. The `Salida/pass` and `solutionCode.output` should be byte-identical to the actual executed output.
- **Severity:** H

#### Issue #5 — We Do S12-T1-A-E2: starter / salida / solution / output all use different city names
- **Location:** `weDo.steps[1]` (lines 700–738), id `S12-T1-A-E2`.
- **Starter `code`:** uses `Cliente-B`
- **`Salida/pass`:** `{'id':'C001','region':'Cliente-A'}`
- **`solutionCode.code`:** uses `Sucursal-Norte`
- **`solutionCode.output`:** `{'id': 'C001', 'region': 'Sucursal-Sur'}`
- **Actual solution output (executed):** `{'id': 'C001', 'region': 'Sucursal-Norte'}` then `None`
- **Mismatch:** Four mutually inconsistent city names. The `solutionCode.output` does not match what `solutionCode.code` actually prints.
- **Severity:** H

#### Issue #6 — We Do S12-T4-A-E2: starter / solution / output drift across city vocabularies
- **Location:** `weDo.steps[19]` (lines 1488–1533), id `S12-T4-A-E2`.
- **Starter `code`:** `DB = {"Cliente-B": ..., "Sucursal-Norte": ...}` and `g.geocode("Sucursal-Centro")` (KeyError-prone), plus `g.geocode("Cusco")`.
- **`Salida/pass`:** `-12.0464` and `None`.
- **`solutionCode.code`:** `DB = {"Oficina-Este": ..., "Oficina-Oeste": ...}` and `g.geocode("Cliente-A")` then `g.geocode("Cusco")`.
- **`solutionCode.output`:** `-12.0464` then `None`.
- **Actual solution output (executed):** `-12.0464` then `None` — the numbers happen to match, but only because the *first* DB key (whichever name) maps to `(-12.0464, -77.0428)`. The starter code references `Sucursal-Centro` which is not in its own DB → would raise `KeyError` (the starter code is broken).
- **Mismatch:** Starter uses `Cliente-B/Sucursal-Norte/Sucursal-Centro/Cusco`; solution uses `Oficina-Este/Oficina-Oeste/Cliente-A/Cusco`. The starter code as written raises `KeyError: 'Sucursal-Sur'` because line 1510 hard-codes `self.DB["Sucursal-Sur"]` while DB only has `Cliente-B` and `Sucursal-Norte`.
- **Severity:** H (the starter itself is broken — a learner running the starter to see the DEFECT behaviour gets a crash, not the "always returns Cliente-A coords" defect described in the comment)

#### Issue #7 — We Do S12-T4-A-E3: starter / solution drift
- **Location:** `weDo.steps[20]` (lines 1534–1571), id `S12-T4-A-E3`.
- **Starter `code`:** `print(allowed_for_public_geocoder({"city": "Cliente-B", "address": "Av 1"}))` and `{"city": "Sucursal-Norte", "document_id": "D1"}`.
- **`solutionCode.code`:** `{"city": "Sucursal-Sur", "address": "Av 1"}` and `{"city": "Sucursal-Centro", "document_id": "D1"}`.
- **`solutionCode.output`:** `True` then `False` (numbers match; only labels differ).
- **Mismatch:** Starter and solution use different city labels for the same test cases. Not a runtime bug, but breaks the "starter shows DEFECT, solution shows fix" continuity.
- **Severity:** M

### B. Salida/pass ↔ solution/output city-name drift (subset of A; summarized)

| Exercise | Starter | Salida/pass | Solution code | Solution output |
|---|---|---|---|---|
| S12-T1-A-E1 | Sucursal-Centro | Sucursal-Sur | Oficina-Este | Oficina-Oeste |
| S12-T1-A-E2 | Cliente-B | Cliente-A | Sucursal-Norte | Sucursal-Sur |
| S12-T4-A-E2 | Cliente-B, Sucursal-Norte, Sucursal-Centro | (numeric) | Oficina-Este, Oficina-Oeste, Cliente-A | (numeric) |
| S12-T4-A-E3 | Cliente-B, Sucursal-Norte | (bool) | Sucursal-Sur, Sucursal-Centro | (bool) |

**Root cause (hypothesis):** A pseudonymization pass replaced real city names ("Lima", "Arequipa", "Plaza de Armas") with synthetic ones ("Cliente-A", "Sucursal-Norte", "Oficina-Este", etc.) inconsistently across `starterCode`, `solutionCode`, `output`, and `Salida/pass`. The pass touched `output:` strings selectively (or not at all), producing drift. The MockGeocoder DB keys were sometimes updated and sometimes not, producing KeyError-prone code.

### C. Spanish Orthography & Style (MEDIUM)

#### Issue #8 — `APIs` should be `API` (sigla invariable, RAE)
- **Rule:** LanguageTool `SIGLAS` — "El plural de las siglas no se marca gráficamente."
- **Occurrences (in user-facing prose):**
  - `learningOutcomes[0]` (line 17): `"Consumir APIs HTTP síncronas, interpretar status y parsear JSON con errores controlados"`
  - `tagline` (line 8): `"HTTP resiliente, SQL parametrizado, geocoding autorizado y adaptadores limitados sin PII bancaria a servicios públicos"` — actually no "APIs" here, just verifying.
  - `theory[1].paragraphs[0]` (line 45): `"Un cliente HTTP síncrono hace **GET/POST**…"` — uses `APIs` later? Let me confirm via grep: 3 occurrences of `APIs` and 5 of `API`.
- **Cause:** English calque ("APIs" plural).
- **Improvement:** Use `API` for both singular and plural (`las API HTTP síncronas`). Also resolves the downstream `AGREEMENT_POSTPONED_ADJ` flag on `síncronas`.
- **Severity:** M

#### Issue #9 — `cache` should be `caché` when used as a noun
- **Rule:** LanguageTool `DIACRITICS_VERB_N_ADJ` and `FALTA_ELEMENTO_ENTRE_VERBOS` — "Si es adjetivo o nombre, se escribe con tilde."
- **Occurrences (15 total in user-facing prose):**
  - `learningOutcomes[2]` (line 19): `"Autenticar con secretos fuera de código, cachear GET seguros y registrar provenance"` — `cachear` is the verb (OK without tilde).
  - `theory[3].paragraphs[1]` (line 140): `"**Cache de GET** por hash de URL…"` — `Cache` as noun → should be `Caché`.
  - `theory[3].paragraphs[1]`: `"…no caches respuestas de escritura…"` — `caches` is verb (OK).
  - `theory[7].paragraphs[2]` (line 364): `"Cachea geocodes bajo TTL/política del proveedor…"` — `Cachea` is verb (OK without tilde); `"misma idea de cache GET de T2-A"` — `cache` as noun → `caché`.
  - `weDo.steps[8].feedback` (line 981): `"Cache de GET reduce latencia en demos repetidas."` — `Cache` noun → `Caché`.
  - `weDo.steps[8].instruction` (line 973): `"E2 (independiente) — Cache GET: implementa la clase …"` — `Cache` noun → `Caché`.
  - `youDo.context` (line 1702): `"…cache GET, provenance sin tokens…"` — `cache` noun → `caché`.
  - `youDo.objectives[1]` (line 1705): `"Cache GET + min_provenance sin secretos"` — `Cache` noun → `Caché`.
  - `youDo.starterCode` (line 1720): `"Integra: token env, retry N1, cache GET, provenance, join SQL, egress, Haversine."` — `cache` noun → `caché`.
- **Cause:** English borrowing `cache` retained without Spanish adaptation `caché` (RAE-registered since 2010).
- **Improvement:** Use `caché` for the noun (`Caché de GET`, `caché GET`); keep `cachear` (verb) and `cacheado`/`cacheada` (adjective) without tilde.
- **Severity:** M

#### Issue #10 — `auto-etiqueta` should be `autoetiqueta` (compound)
- **Rule:** LanguageTool `AUTO_NO_SEPARADO` — "Probablemente se escribe junto."
- **Occurrences:**
  - `weDo.steps[23].instruction` (line 1661): `"Nunca auto-etiquetes parentesco o fraude"` — should be `autoetiquetes`.
  - `theory[7].callout.content` (line 398): `"jamás auto-etiqueta is_family o fraude"` — should be `autoetiqueta`.
- **Cause:** Hyphen retained from English "auto-label".
- **Improvement:** RAE: prefixes like `auto-` are joined to the root without hyphen (`autoetiqueta`, `autoetiquetado`).
- **Severity:** L

#### Issue #11 — `y` should be `e` before words starting with /i/ sound
- **Rule:** LanguageTool `Y_E_O_U` — "Cuando precede a palabras que comienzan por 'i', la conjunción 'y' se transforma en 'e'."
- **Occurrences:**
  - `weDo.steps[11].instruction` (line 1184): `"…Inserta la fila `E1` / `C001` / `geo` y imprime el `COUNT(*)`. Salida/pass: `1`."` — `y imprime` → `e imprime`.
  - `weDo.steps[13].instruction` (line 1270): `"…une `clients` + `evidence` por `entity_id` y imprime los `kind` de `C001` ordenados…"` — `y imprime` → `e imprime`.
- **Cause:** Slip in fast-drafted instructions.
- **Improvement:** Replace `y imprime` with `e imprime` (RAE: the conjunction changes form before /i/ sound, including before "imprime").
- **Severity:** L

#### Issue #12 — `vs` without period (minor; both forms accepted)
- **Rule:** LanguageTool `PUNTO_EN_ABREVIATURAS` — "Probablemente falta un punto después de la abreviatura."
- **Occurrences:**
  - `theory[2].paragraphs[1]` (line 99): `"…aquí lo modelamos como `cost_s` vs `timeout_s` para tests deterministas sin red."`
  - `iDo.steps[3].description` (line 509): `"…mismo lat/lon de Cliente-B, traza distinta…"` — wait, this is `vs` in description line 509: `"Observa mode=online vs mode=offline_fallback: mismo lat/lon de Cliente-B, traza distinta — el auditor ve la verdad."`
- **Cause:** `vs` is the traditional Spanish borrowing of Latin *versus*; RAE accepts both `vs` (invariable, without period) and `vs.` (with period, traditional). The traditional/academic form is `vs.`.
- **Improvement:** Optional; use `vs.` for academic register, or rewrite as `frente a` for full Spanish.
- **Severity:** L (false positive risk — RAE 2010 update accepts `vs`)

#### Issue #13 — `1..5` Python slice notation inside Spanish prose
- **Rule:** LanguageTool `DOUBLE_PUNCTUATION` — "Dos puntos consecutivos."
- **Location:** `iDo.steps[1].description` (line 444): `"Observa items 1..5 y rate_limit_pauses=2: dos saltos de página, no tres sleeps al final."`
- **Cause:** Python range notation `1..5` leaked into Spanish prose.
- **Improvement:** `"Observa items del 1 al 5 y rate_limit_pauses=2: …"` or `"Observa cinco items y dos rate_limit_pauses: …"`.
- **Severity:** L

#### Issue #14 — `Coordenadas basura` agreement flag
- **Rule:** LanguageTool `AGREEMENT_ADJ_NOUN` — "Posible error de concordancia."
- **Location:** `theory[7].paragraphs[0]` (line 362): `"Coordenadas basura (91°, NaN, strings) no entran al mapa ni al score de relación."`
- **Analysis:** `Coordenadas basura` is grammatical (`basura` as invariable adjective; RAE accepts `basura` as noun used appositionally). LanguageTool's suggestion `Coordenadas basuras` is incorrect. **False positive** — but consider rewriting as `"Coordenadas inválidas"` or `"Coordenadas espurias"` for clearer technical register.
- **Severity:** L (false positive on the rule; rewrite is stylistic)

### D. Structural / Sentence-Length Issues (MEDIUM)

#### Issue #15 — `jobRelevance` opening sentence is a 52-word run-on
- **Location:** `jobRelevance` (line 15), first sentence.
- **Quote:** `"En onboarding, compliance y data quality en bancos, fintech y retail en Perú, el pipeline no empieza en el dashboard: empieza en **adaptadores HTTP resilientes** que leen señales con timeout y retry selectivo, un **SQLite local parametrizado** que une entidad y evidencia, y **geoevidancia controlada** sin filtrar PII bancaria a geocoders públicos."`
- **WPS:** 52 words in one sentence. FH for the whole `jobRelevance` chunk drops below 50 (difficult) for non-technical readers.
- **Improvement:** Split into 2–3 sentences. Example:
  > En onboarding, compliance y data quality en bancos, fintech y retail del Perú, el pipeline no empieza en el dashboard. Empieza en **adaptadores HTTP resilientes** que leen señales con timeout y retry selectivo, en un **SQLite local parametrizado** que une entidad y evidencia, y en **geoevidencia controlada** sin filtrar PII bancaria a geocoders públicos.
- **Severity:** M

#### Issue #16 — `iDo.intro` is a 46-word run-on enumeration
- **Location:** `iDo.intro` (line 403).
- **Quote (first sentence):** `"Ocho demos locales del hilo CP-N1-C en orden de pipeline: (1) mock HTTP status→JSON, (2) paginación con rate-limit conceptual, (3) provenance sin token, (4) contract/fallback offline, (5) join de caso SQLite, (6) batch atómico con rollback, (7) MockGeocoder fail-closed, (8) Haversine Cliente-A–Callao como geoseñal (no parentesco)."`
- **WPS:** 46 words. Cognitive load: eight parenthetical items in one sentence.
- **Improvement:** Convert enumeration to a list:
  > Ocho demos locales del hilo CP-N1-C en orden de pipeline:
  > 1. mock HTTP status→JSON
  > 2. paginación con rate-limit conceptual
  > 3. provenance sin token
  > 4. contract/fallback offline
  > 5. join de caso SQLite
  > 6. batch atómico con rollback
  > 7. MockGeocoder fail-closed
  > 8. Haversine Cliente-A–Callao como geoseñal (no parentesco).
- **Severity:** M

#### Issue #17 — `youDo.context` is a 45-word run-on
- **Location:** `youDo.context` (line 1702).
- **Quote (first sentence):** `"Integra el hilo completo de S12 en un solo script de adquisición: cliente HTTP mock con timeout/paginación/retry selectivo (política N1: solo 429/503), secretos por env, cache GET, provenance sin tokens, SQLite parametrizado (`clients` / `transactions` / `evidence`) y **MockGeocoder** con allowlist de egress (sin PII bancaria)."`
- **WPS:** 45 words.
- **Improvement:** Split at `SQLite parametrizado` and at `**MockGeocoder**`:
  > Integra el hilo completo de S12 en un solo script de adquisición: cliente HTTP mock con timeout/paginación/retry selectivo (política N1: solo 429/503), secretos por env, caché GET y provenance sin tokens. Persiste en SQLite parametrizado (`clients` / `transactions` / `evidence`) y geocodifica con **MockGeocoder** + allowlist de egress (sin PII bancaria).
- **Severity:** M

#### Issue #18 — Several 33–42-word sentences (borderline)
- **Locations:**
  - `theory[0].paragraphs[1]` (line 31, 33w): `"Imagina el onboarding de un caso sintético en Lima: un proveedor te lista señales por HTTP, tú las guardas en SQLite local y calculas una distancia a Callao para el score de relación."`
  - `theory[0].paragraphs[2]` (line 32, 33w): `"Orden del aprendizaje: **T1 HTTP** (status, JSON, timeout, paginación, retry) → **T2 Auth/cache/contratos** (secretos en env, provenance, fallback) → **T3 SQL** (CRUD, join, placeholders, transacciones) → **T4 Geodatos responsables** (normalize, egress, Haversine como señal)."`.
  - `jobRelevance` second sentence (line 15, 43w): `"Esta sección construye el tramo de **adquisición + geoevidancia del capstone CP-N1-C** con mocks locales y datos sintéticos (Lima/Arequipa, ids `C00x`): status y JSON, secretos fuera de código, joins con placeholders y geocoding autorizado — listo para el dashboard de S13."`.
  - `theory[1].paragraphs[2]` (line 47, 40w): `"**Timeout es obligatorio** (lo modelamos en T1-B): en un cliente real siempre pasas `timeout=` (segundos); sin él un socket colgado congela el pipeline de CP-N1-C. Headers (`Accept`, `User-Agent`) documentan el contrato del adaptador."`.
  - `theory[5].paragraphs[1]` (line 277, 40w): `"`executemany` + `BEGIN`/`COMMIT` hacen batch **atómico**; un `UNIQUE` roto → `ROLLBACK` y `COUNT(*)==0`. No dejes la DB a medias con 2 de 3 inserts "casi ok": en compliance, un estado parcial es peor que un fallo ruidoso."`.
  - `theory[6].paragraphs[1]` (line 319, 36w): `"El title-case es política opcional del proveedor; en los ejercicios de S12 **no** lo exijas a menos que el enunciado lo pida (el mock puede usar `.title()` solo para la **clave de lookup** de ciudad)."`.
- **Severity:** L (these are at the upper edge of the technical-prose band 15–32; some are appropriate for the register but could be split for clarity).

### E. Meta-Leak / Identity Residue (LOW)

#### Issue #19 — Filename and `id` field no longer match the section's actual topic
- **Observation:** The file is `s12-performance.ts` and the section's `id` is `"performance"`, but the title is `"APIs, SQL y geodatos responsables"` and the entire content is about HTTP/SQL/Geo (not Python performance / concurrency / profiling).
- **Evidence of retarget:** The repo's `course-state/curriculum_hardening/paragraph_analysis/S12_PARAGRAPHS.md` (an internal audit artifact) opens with:
  > "En V3, **S12 no es el path principal de multiprocessing, profiling ni logging de producción**. Ese material se reubica conceptualmente hacia el tramo de sistemas/ops."
  confirming that S12 was retargeted from "Performance & concurrency" to "APIs, SQL y geodatos responsables" in V3. The current `s12-performance.ts` source no longer contains this internal note (good — it was scrubbed from user-facing prose), but the file name and `id` were not renamed.
- **User-facing impact:** None directly (the `id` is not in any URL on the live SPA; the sidebar shows the `shortTitle`). However:
  - Repo browsing: a developer looking for "performance" content will find HTTP/SQL/Geo content, and a developer looking for HTTP/SQL/Geo content will not find it by filename.
  - The `id: "performance"` may appear in `course-state/*.json` audit artifacts, progress keys, and `GRAPH_MEMORY.json` references, creating cross-reference drift.
- **Severity:** L (developer-facing meta-residue, not learner-facing).
- **Note:** A rename from `s12-performance.ts` → `s12-apis-sql-geo.ts` and `id: "performance"` → `id: "apis-sql-geo"` would require coordinated updates in `src/lib/course/index.ts` and any persisted learner-state; do NOT do this without a migration plan.

#### Issue #20 — Internal audit artifact `S12_PARAGRAPHS.md` is stale and references removed prose
- **Observation:** `course-state/curriculum_hardening/paragraph_analysis/S12_PARAGRAPHS.md` quotes the OLD S12 theory text (e.g., "En V3, **S12 no es el path principal de multiprocessing, profiling ni logging de producción**…"), which no longer exists in `s12-performance.ts`. Same for `course-state/curriculum_hardening/visible_paragraphs/s12_performance.json`, which contains a `paragraphs[]` array that does not match the current `theory[].paragraphs[]`.
- **User-facing impact:** None (these are dev-only JSON/Markdown files in `course-state/`, not in `public/`).
- **Severity:** L (audit-hygiene issue; will mislead future automated audits that consume these files).
- **Improvement:** Regenerate the `paragraph_analysis/S12_PARAGRAPHS.md` and `visible_paragraphs/s12_performance.json` from the current `s12-performance.ts`, or delete them.

---

## 4. Meta-Leak Report

**Direct user-facing meta-leak detection (Spanish prose):** CLEAN.

I searched all 144 unique Spanish prose chunks (filtered to exclude pure code) for the following patterns:

| Pattern | Hits | Real? |
|---|---|---|
| `moved from section` / `moved to section` | 0 | n/a |
| `V2 retarget` / `V3 retarget` | 0 | n/a |
| `antiguo título` / `old title` | 0 | n/a |
| `TODO` / `FIXME` / `XXX` / `HACK` | 8 | All false positives — substring `todo` inside legitimate Spanish words ("Todo con placeholders", "todos los stubs", "todo el batch", "traer todo"). |
| `nota interna` / `note to dev` / `dev note` / `para el equipo` | 0 | n/a |
| `en producción` | 3 | Legitimate pedagogical hedge ("en producción a veces sí se reintenta con límite, pero aquí forzamos selectividad"). Not a leak. |
| `cambiar a` / `reemplazar por` / `actualizar a` / `refactor:` | 0 | n/a |
| `Claude` / `GPT` / `Gemini` / `Copilot` / `prompt:` / `AI note` | 0 | n/a |
| `draft` / `borrador` / `placeholder text` | 0 | n/a |
| `lo movimos` / `se reubica` / `reubicado` | 0 | n/a |
| `del tramo de sistemas` / `al tramo de sistemas` | 0 | n/a (the phrase appeared in the OLD S12 text but was scrubbed from the current `s12-performance.ts`) |
| `"Performance & concurrency"` | 0 in user-facing prose; only in `course-state/curriculum_hardening/paragraph_analysis/S12_PARAGRAPHS.md` (dev-only) | n/a |

**Conclusion:** No developer meta-text, AI-instruction leakage, design notes, or section-history notes leaked into the rendered Spanish prose. The only meta-residue is the filename/`id` mismatch (Issue #19) and the stale audit artifact (Issue #20), both developer-facing.

---

## 5. Pedagogical & Redaction Deep Dive

### 5.1 I Do / We Do / You Do fidelity

| Component | Count | Verdict |
|---|---|---|
| `theory[]` blocks | 8 (T1-A, T1-B, T2-A, T2-B, T3-A, T3-B, T4-A, T4-B) | Each has `heading`, `subtopicId`, 2–3 `paragraphs`, one `code` with `output`, one `callout`. **Strong** progressive disclosure: status→timeout→auth→contract→SQL→params→normalize→Haversine. |
| `iDo.steps[]` | 8 (one per subtopic) | Each has `demoId`, `subtopicId`, `description`, `code` with `output`, `why`. **Strong** think-aloud structure. **BUT** demos #3 (T2-B) and #7 (T4-A) ship fabricated outputs (Issues #2 and #3). |
| `weDo.steps[]` | 24 (3 per subtopic × 8 subtopics: E1 guided / E2 independent / E3 transfer) | Each has `id`, `kind`, `instruction`, `hint`, `hints[]`, `edgeCases`, `tests`, `feedback`, `starterCode`, `solutionCode` with `output`. **Strong** fidelity to the graduated-release model. **BUT** four exercises ship starter/salida/solution/output drift (Issues #4–#7). |
| `youDo` | 1 capstone integration (CP-N1-C) | Has `title`, `context`, `objectives[5]`, `requirements[6]`, `starterCode` (smoke-path with `NotImplementedError` stubs), `portfolioNote`, `rubric[5]`. **Strong** capstone alignment. The starter is internally consistent (verified by reading; the stubs are well-typed). |
| `selfCheck.questions[]` | 7 multiple-choice | Each has `question`, `options[3–4]`, `correctIndex`, `explanation`. Coverage: 400 retry, token location, f-string SQL, egress PII, kinship verdict, pagination `next`, atomic rollback. **Strong** alignment with the seven core rules. All `¿...?` markers are properly paired. |

### 5.2 Connective tissue and narrative flow

**Strong:** Each `theory[]` block opens with a connector to the previous subtopic ("Ya sabes leer status y JSON; ahora el adaptador no se cuelga…", "Con el cliente resiliente en T1, el siguiente riesgo profesional es filtrar el secreto.", "Ya tienes secretos y provenance; ahora blindas el adaptador contra el schema del proveedor.", "Con el adaptador HTTP listo, las señales no viven solo en memoria del proceso: las **persistes**…", "Con HTTP y SQL listos, la geoevidencia cierra el incremento CP-N1-C…"). The four-topic spine (T1 HTTP → T2 Auth/cache/contracts → T3 SQL → T4 Geodatos responsables) is mapped explicitly in `theory[0].paragraphs[2]`.

**Strong:** Cross-section hooks are explicit: "listo para el dashboard de S13" (jobRelevance, theory[0].callout, youDo.context), "nombres alineados al dominio de S11" (theory[5].paragraphs[0]), "alimenta `relationship_signal_score` en S13" (theory[7].paragraphs[2], weDo.steps[23].feedback), "Aquí no construyas el dashboard" (youDo.context).

**Weak:** The `weDo.intro` claims "24 ejercicios (E1 guiado / E2 independiente / E3 transferencia) por los 8 subtemas" — 3×8=24 ✓. But the `weDo.steps[]` array actually has 24 entries — verified. No discrepancy.

### 5.3 Cognitive load and progressive disclosure

- **Topic ordering:** status→JSON→timeout→pagination→retry→auth→cache→provenance→contract→fallback→schema→CRUD→join→params→transactions→indices→normalize→egress→geocoder→coords→Haversine→signal. Each step adds ONE new concept; the order is technically sound.
- **Code complexity:** Every theory code block is ≤25 lines and runnable in isolation. Every We Do starter is ≤15 lines. Every I Do demo is ≤20 lines. **Appropriate** for the Phase 0 (Fundamentos) level.
- **Borrowed concepts:** The text assumes the learner has seen `dataclass` (S11), `Decimal` (S11), `re` (S10), `sqlite3` is introduced fresh (correctly). No skipping.
- **Stack discipline:** `weDo.intro` explicitly bans "NumPy de S14" and "RPA ni dashboard de S13" — prevents forward-leakage.
- **Ethics framing:** The "fail-closed", "egress allowlist", "signal != kinship", "sin PII bancaria a servicios públicos" mantras repeat across theory, callouts, We Do feedback, and self-check. **Strong** deliberate redundancy for value internalization.

### 5.4 Cognitive-load weak points

- The 52-word `jobRelevance` opening sentence (Issue #15) front-loads the entire topic map into one breath. A learner in week 12 of Phase 0 may not yet have the schema to attach "adaptadores HTTP resilientes / SQLite local parametrizado / geoevidancia controlada" to concrete referents.
- The `theory[0].paragraphs[0]` "Diccionario de la sección" defines 9 terms in one paragraph (Status code, Timeout, Retry/backoff, Provenance, SQL parametrizado, Geocoder autorizado/mock, Egress, Geoseñal, Fail-closed). The formatting (`**Term:** definition **Term:** definition…`) helps scanning, but the paragraph is one block. Consider splitting into a definition list.

### 5.5 Exercise and exam quality

- **DEFECT pattern:** Every We Do starter has a `# DEFECT: ...` comment naming the bug. **Excellent** pedagogy — the learner sees the failure mode before fixing it. Examples: `# DEFECT: siempre 200 y body vacío`, `# DEFECT: 429 y 500 van a fail_client; 503 no contemplado`, `# DEFECT: f-string concat (vulnerable)`.
- **Hints:** Every exercise has a `hint` and a `hints[]` array of 2 progressive hints. **Strong** scaffold.
- **Edge cases:** Every exercise has `edgeCases[]` (e.g., `["404 body estable", "id existente"]`, `["inyección neutralizada"]`). **Strong** defensive-thinking framing.
- **Tests:** Every exercise has a `tests` string (e.g., `"200 con dict; 404 con error"`, `"política status→acción N1"`). These are human-readable, not automated — acceptable for the rendered page.
- **Self-check:** 7 questions covering the 7 core rules; `correctIndex` is set; explanations are one-sentence and accurate. **Strong**.

### 5.6 Consistency with roadmap and previous sections

| Claim | Cross-reference | Verdict |
|---|---|---|
| "tablas `clients`, `transactions`, `evidence` (nombres alineados al dominio de S11)" | `s11-testing.ts` defines `ClientRecord`, `Transaction`, `RelationshipEvidence` as dataclasses. | ✓ Consistent. |
| "listo para el dashboard de S13" | `s13-rpa-automation.ts` title is "Familiarity Evidence Dashboard y cierre de nivel" and explicitly references "Desde **S12** ya traes HTTP con timeout/retry, SQL parametrizado y geoseñal con política de egress". | ✓ Bidirectional hook. |
| "Política del curso: no envíes PII bancaria" | `s11-testing.ts` tagline: "sin decidir fraude ni parentesco". `s13-rpa-automation.ts` tagline: "ER determinista, señales de relación separadas". | ✓ Coherent ethics spine S11→S12→S13. |
| "Stack permitido: requests conceptual + sqlite3 + math haversine (S01–S12); no RPA, no dashboard de S13, no NumPy de S14." | `weDo.intro` repeats the same constraint. | ✓ Internally consistent. (Note: this exact sentence appears only in the OLD `visible_paragraphs/s12_performance.json` artifact, not in the current `s12-performance.ts` — the current source uses different wording but the same constraint.) |
| `caso sintético CASO-LIM-012` | Used consistently across all 24 We Do starters. | ✓ Consistent. |
| `ids C00x` | Used across S11, S12, S13. | ✓ Consistent. |

### 5.7 Comparison with best-in-class external materials

| Topic | PyArcana S12 | External benchmark | Verdict |
|---|---|---|---|
| HTTP status / retry semantics | T1-A, T1-B; selfCheck Q1, Q6 | MDN HTTP status; RFC 7231 §6 + §7.1.3 (Retry-After) | PyArcana is **more pedagogically focused** (status→action table) and adds the N1 retry-selectivity contract (only 429/503). RFC 7231 is broader but less actionable. |
| SQL injection & placeholders | T3-B; weDo E1; selfCheck Q3 | OWASP SQL Injection Prevention Cheat Sheet | PyArcana matches OWASP's "use prepared statements" guidance; the live `f-string` vs `?` comparison is concrete and runnable. **On par.** |
| Geocoding egress / PII control | T4-A, T4-B; weDo E3 | OWASP API3:2023 Excessive Data Exposure; NIST SP 800-122 | PyArcana's `ALLOWED = {"address", "city", "country"}` allowlist is a concrete implementation of "data minimization". **Stronger than** typical tutorials that only say "don't send PII". |
| Haversine as a score signal, not a verdict | T4-B; weDo E3; selfCheck Q5 | sklearn `haversine_distances` docs; Kleppmann Ch.2 | PyArcana's `kinship_verdict=None` packaging is **unusual and commendable** — most tutorials compute the distance and stop; PyArcana forces the learner to package it as a non-verdict signal. |
| Provenance / data lineage | T2-A; iDo demo #3 | Data Trust Alliance Provenance Framework; DAMA-DMBOK | PyArcana's `source_url / fetched_at / status_code / cache_hit / body_sha12 / token_present` manifest is a **minimal but real** provenance record. **On par** with industry minima. |

---

## 6. Grammatical Improvements — Paragraph-by-Paragraph Rewrite (Before / After)

> Method: every learner-facing paragraph and tab was scored with Fernández-Huerta (FH), INFLESZ, words-per-sentence (WPS), syllables-per-word (SPW); LanguageTool (es) public API was run on the concatenated prose in 3 chunks (~3.1k + 18k + 5k chars). Below are the paragraphs/sentences with measurable issues, paired with proposed rewrites. Paragraphs that score cleanly (FH ≥ 70, WPS ≤ 25, no LT findings) are summarized collectively at the end.

### 6.1 Aggregate metrics (filtered prose, 144 chunks)

| Metric | min | max | mean | median |
|---|---|---|---|---|
| Fernández-Huerta | -7.2 | 131.1 | 95.3 | 97.6 |
| INFLESZ | -10.4 | 127.8 | 88.2 | 91.0 |
| WPS | 3.0 | 38.7 | 11.4 | 9.0 |
| SPW | 1.11 | 3.50 | 1.67 | 1.62 |

**Interpretation:** Mean FH of 95.3 is "muy fácil" — but this is skewed by 120/144 chunks being short labels (callout titles, hint strings, learning-outcome bullets). The median chunk is 9 WPS, which is fragment-level. The longest chunks (jobRelevance, iDo.intro, youDo.context) drop FH into the 50–60 range (normal/bastante difícil) — appropriate for technical prose but bordering on dense in the run-on sentences flagged in Issues #15–#17.

**FH band distribution:**

| Band | Chunks |
|---|---|
| muy fácil (≥80) | 120 |
| fácil (70–79) | 13 |
| normal (60–69) | 4 |
| bastante difícil (50–59) | 4 |
| difícil (40–49) | 2 |
| muy difícil (<40) | 1 |

### 6.2 Theory tab — `theory[0]` "Mapa de la sección: HTTP, SQL y geodatos responsables"

**Paragraph 1 (Diccionario de la sección) — Before:**
> **Diccionario de la sección** (léelo antes de T1; el resto profundiza cada término). **Status code:** código HTTP de la respuesta (2xx éxito, 4xx error de cliente, 5xx error de servidor). **Timeout:** tiempo máximo de espera por request — en un cliente real siempre pasas `timeout=`. **Retry/backoff:** reintentar solo errores **transitorios** (en N1: 429 y 503) con espera creciente. **Provenance (traza de origen):** metadatos del fetch (`source_url`, `fetched_at`, `status_code`, `cache_hit`) **sin** secretos. **SQL parametrizado:** placeholders `?` en lugar de f-strings con input. **Geocoder autorizado/mock:** proveedor permitido o simulado. **Egress (salida de datos):** qué campos pueden salir a un servicio externo. **Geoseñal:** distancia u otra métrica geo que alimenta un score de relación — **no** es parentesco ni fraude. **Fail-closed (falla cerrado):** si el contrato falla, se detiene; no se inventan filas ni coordenadas.

**Metrics:** WPS ≈ 60 (one-sentence block), FH ≈ 40. Dense but scannable due to bold markup.

**After (split into a definition list and trimmed):**
> **Diccionario de la sección** (léelo antes de T1; el resto profundiza cada término).
>
> - **Status code:** código HTTP de la respuesta (2xx éxito, 4xx error de cliente, 5xx error de servidor).
> - **Timeout:** tiempo máximo de espera por request. En un cliente real siempre pasas `timeout=`.
> - **Retry/backoff:** reintentar solo errores **transitorios** (en N1: 429 y 503) con espera creciente.
> - **Provenance (traza de origen):** metadatos del fetch (`source_url`, `fetched_at`, `status_code`, `cache_hit`), **sin** secretos.
> - **SQL parametrizado:** placeholders `?` en lugar de f-strings con input.
> - **Geocoder autorizado/mock:** proveedor permitido o simulado.
> - **Egress (salida de datos):** qué campos pueden salir a un servicio externo.
> - **Geoseñal:** distancia u otra métrica geo que alimenta un score de relación. **No** es parentesco ni fraude.
> - **Fail-closed (falla cerrado):** si el contrato falla, se detiene; no se inventan filas ni coordenadas.

**Improvement:** WPS per item 6–12 (highly readable), FH per item ~85, anaphoric monotony removed, term boundaries unambiguous.

---

**Paragraph 2 — Before:**
> Imagina el onboarding de un caso sintético en Lima: un proveedor te lista señales por HTTP, tú las guardas en SQLite local y calculas una distancia a Callao para el score de relación. El hilo conductor es ese **adaptador de señales sintéticas** (entidades, evidencias, coordenadas) con timeout, cache, provenance y fallback offline. Construyes el incremento de **adquisición y geoevidancia del capstone CP-N1-C**: cliente HTTP síncrono resiliente, SQLite parametrizado y geocoder mock/autorizado **sin PII bancaria a servicios públicos**. Solo datos sintéticos latam (`example.com`, Lima/Arequipa, ids `C00x`). Si el schema del JSON o del SQL no cuadra, **falla cerrado**.

**Metrics:** 4 sentences, WPS 13/19/25/8/8, FH ≈ 65. Clean. Minor: `cache` (noun) → `caché`.

**After (minimal edits):**
> Imagina el onboarding de un caso sintético en Lima: un proveedor te lista señales por HTTP, tú las guardas en SQLite local y calculas una distancia a Callao para el score de relación. El hilo conductor es ese **adaptador de señales sintéticas** (entidades, evidencias, coordenadas) con timeout, caché, provenance y fallback offline. Construyes el incremento de **adquisición y geoevidancia del capstone CP-N1-C**: cliente HTTP síncrono resiliente, SQLite parametrizado y geocoder mock/autorizado **sin PII bancaria a servicios públicos**. Solo datos sintéticos latam (`example.com`, Lima/Arequipa, ids `C00x`). Si el schema del JSON o del SQL no cuadra, **falla cerrado**.

**Improvement:** `cache` → `caché` (Issue #9).

---

**Paragraph 3 — Before:**
> Orden del aprendizaje: **T1 HTTP** (status, JSON, timeout, paginación, retry) → **T2 Auth/cache/contratos** (secretos en env, provenance, fallback) → **T3 SQL** (CRUD, join, placeholders, transacciones) → **T4 Geodatos responsables** (normalize, egress, Haversine como señal). Gate de la sección: adaptador con status/retry selectivo + join local de caso + geoseñal documentada. En **S13** armarás el dashboard de evidencia; aquí cierras la adquisición. Nunca tokens en logs ni claims de parentesco/fraude. Profiling y concurrency de producción se tratan más adelante en el tramo de sistemas — no son el foco de esta semana.

**Metrics:** 5 sentences, WPS 33/13/11/7/14, FH ≈ 60. First sentence is borderline (Issue #18). The final sentence "Profiling y concurrency de producción se tratan más adelante en el tramo de sistemas — no son el foco de esta semana." is the **only** soft reference to the V3 retarget left in the user-facing prose. It is framed pedagogically (boundary-setting for the learner) rather than as an internal note, so it is acceptable.

**After (split first sentence):**
> Orden del aprendizaje:
>
> - **T1 HTTP** — status, JSON, timeout, paginación, retry.
> - **T2 Auth/caché/contratos** — secretos en env, provenance, fallback.
> - **T3 SQL** — CRUD, join, placeholders, transacciones.
> - **T4 Geodatos responsables** — normalize, egress, Haversine como señal.
>
> Gate de la sección: adaptador con status/retry selectivo + join local de caso + geoseñal documentada. En **S13** armarás el dashboard de evidencia; aquí cierras la adquisición. Nunca tokens en logs ni claims de parentesco/fraude. El profiling y la concurrencia de producción se tratan más adelante en el tramo de sistemas; no son el foco de esta semana.

**Improvements:** WPS first sentence 33 → 4 short bullets; `cache` → `caché`; `concurrency` borrowed noun → Spanish `concurrencia` (already used elsewhere in the course); semicolon before "no son el foco" (Spanish prefers `;` before a strong contrast clause).

### 6.3 Theory tab — `theory[1]` "requests/responses, status y JSON"

**Paragraph 1 — Before:**
> Un cliente HTTP síncrono hace **GET/POST**, recibe un **status code** y un cuerpo (a menudo JSON). En este curso usamos un **cliente mock** o `urllib` con fixtures: la pedagogía es **status primero, body después**, no pelear con la librería de red del día. Si el status no es 2xx, no asumas que el JSON "tiene sentido" — un 404 puede traer un mensaje de error o un cuerpo vacío.

**Metrics:** 3 sentences, WPS 12/22/15, FH ≈ 70. Clean.

**After:** No rewrite needed.

**Paragraph 2 — Before:**
> **2xx** = éxito; **4xx** = error del cliente (no reintentes a ciegas: el id o el payload están mal); **5xx** = error del servidor. En N1 el retry selectivo se limita a **429** y **503** (más timeouts de red); un **500** se registra como `fail_server` y no se reintenta a ciegas en los ejercicios (en producción a veces sí se reintenta con límite, pero aquí forzamos selectividad). Parsea con manejo de cuerpo vacío o JSON inválido: un `json.JSONDecodeError` es **fail-closed** (falla cerrado), no un dict inventado.

**Metrics:** 3 sentences, WPS 13/40/16, FH ≈ 55. Middle sentence is 40 words (Issue #18).

**After (split middle sentence):**
> **2xx** = éxito; **4xx** = error del cliente (no reintentes a ciegas: el id o el payload están mal); **5xx** = error del servidor. En N1 el retry selectivo se limita a **429** y **503** (más timeouts de red). Un **500** se registra como `fail_server` y no se reintenta a ciegas en los ejercicios (en producción a veces sí se reintenta con límite, pero aquí forzamos selectividad). Parsea con manejo de cuerpo vacío o JSON inválido: un `json.JSONDecodeError` es **fail-closed** (falla cerrado), no un dict inventado.

**Improvement:** 40w sentence → 12w + 25w; the `LanguageTool WRONK_IMPERATIVE` flag on "no reintentes a ciegas: el id" was a false positive (it parsed "id" as imperative verb); splitting does not affect that flag.

**Paragraph 3 — Before:**
> **Timeout es obligatorio** (lo modelamos en T1-B): en un cliente real siempre pasas `timeout=` (segundos); sin él un socket colgado congela el pipeline de CP-N1-C. Headers (`Accept`, `User-Agent`) documentan el contrato del adaptador. Caso sintético `CASO-LIM-012`: store `{"C001": {...}}` → 200 con keys `id/region/score` o 404 con body `error`; cuerpo basura → `parse_json_body` devuelve `None`. **Qué observar en el demo:** status y body van juntos en la tupla de respuesta; el parse inválido no inventa claves.

**Metrics:** 4 sentences, WPS 24/8/29/13, FH ≈ 60. Third sentence is 29 words (under threshold but borderline). Clean otherwise.

**After:** No rewrite strictly needed; could split the third sentence at the semicolon for clarity but not required.

### 6.4 Theory tab — `theory[2]` "Timeout, paginación, retry/backoff y rate limit"

**Paragraph 1 — Before:**
> Ya sabes leer status y JSON; ahora el adaptador no se cuelga ni se come mil filas de un golpe. **Timeout** acota la espera por request. En un cliente real pasas siempre `timeout=` (p. ej. `urlopen(req, timeout=5)` o el equivalente del SDK); aquí lo modelamos como `cost_s` vs `timeout_s` para tests deterministas sin red. **Paginación** (`page` o `cursor`/`next`) recorre colecciones grandes sin traer todo de una vez al heap — crítico cuando el proveedor lista miles de señales sintéticas para el caso.

**Metrics:** 4 sentences, WPS 14/6/27/24, FH ≈ 70. LT flagged `p. ej.` as missing period (false positive — "p. ej." is correctly punctuated). LT flagged `vs` (Issue #12). Clean otherwise.

**After (minimal edits):**
> Ya sabes leer status y JSON; ahora el adaptador no se cuelga ni se come mil filas de un golpe. **Timeout** acota la espera por request. En un cliente real pasas siempre `timeout=` (p. ej. `urlopen(req, timeout=5)` o el equivalente del SDK); aquí lo modelamos como `cost_s` frente a `timeout_s` para tests deterministas sin red. **Paginación** (`page` o `cursor`/`next`) recorre colecciones grandes sin traer todo de una vez al heap — crítico cuando el proveedor lista miles de señales sintéticas para el caso.

**Improvement:** `vs` → `frente a` (resolves Issue #12 and reads more naturally in Spanish prose).

**Paragraph 2 — Before:**
> **Retry/backoff** solo en errores **transitorios**: **429**, **503** y timeouts de red en este curso (**política N1**). Otros **5xx** pueden reintentarse en producción con límite, pero el contrato de ejercicios usa `{429, 503}` para forzar selectividad. Un **400** o **404** no se reintenta: reintentar no repara un id mal formado. Respeta `Retry-After` cuando exista y un **max_retries** duro (p. ej. 3). La función `should_retry` y la tabla `status_action` deben contar la misma historia.

**Metrics:** 5 sentences, WPS 11/16/11/12/13, FH ≈ 75. Clean.

**After:** No rewrite needed.

**Paragraph 3 — Before:**
> Rate limit: duerme entre páginas o respeta cuotas del proveedor. En demo usamos contador de delays en lugar de `time.sleep` real para tests deterministas. Caso sintético: páginas 1→2→3 con `next` y `rate_limit_pauses == 2`; cuando **`next is None`**, dejas de pedir la siguiente página. **Qué observar:** el bucle termina por contrato del proveedor, no por un contador mágico de "siempre 3 páginas".

**Metrics:** 4 sentences, WPS 9/13/22/14, FH ≈ 80. Clean.

**After:** No rewrite needed.

### 6.5 Theory tab — `theory[3]` "Auth, secretos, cache y provenance"

**Heading — Before:** `"Auth, secretos, cache y provenance"`
**After:** `"Auth, secretos, caché y provenance"` (Issue #9).

**Paragraph 1 — Before:**
> Con el cliente resiliente en T1, el siguiente riesgo profesional es filtrar el secreto. Autenticación **Bearer** (o basic) lee el token de **variable de entorno** / secret store, nunca hardcodeado en el repo ni en un notebook compartido. Si falta `API_TOKEN`, **falla cerrado** con mensaje claro — no envíes requests anónimos "por si acaso" ni uses un token de demo pegado en el código que mañana se commitea.

**Metrics:** 3 sentences, WPS 11/26/26, FH ≈ 65. Clean.

**After:** No rewrite needed.

**Paragraph 2 — Before:**
> **Cache de GET** por hash de URL (o la URL misma en demos) con **TTL** reduce costo y latencia; no caches respuestas de escritura ni PII sin política. Invalida o no reutilices si el status no fue 2xx. El segundo hit al mismo URL debe marcar `cache_hit=True` sin volver a "pegarle" al mock.

**Metrics:** 3 sentences, WPS 22/8/14, FH ≈ 70. LT flagged `Cache` (noun) → `Caché` (Issue #9) and `Invalida` → `Inválida` (DIACRITICS_04 — false positive: `Invalida` here is the verb "invalida" (tú, imperativo), not the adjective "inválida"). Also `no caches` is the verb subjunctive — correct without tilde.

**After (minimal edits):**
> **Caché de GET** por hash de URL (o la URL misma en demos) con **TTL** reduce costo y latencia; no caches respuestas de escritura ni PII sin política. Invalida o no reutilices si el status no fue 2xx. El segundo hit al mismo URL debe marcar `cache_hit=True` sin volver a "pegarle" al mock.

**Improvement:** `Cache` (noun) → `Caché` (Issue #9). Keep `Invalida` as verb imperative (LT false positive). Keep `caches` as verb subjunctive.

**Paragraph 3 — Before:**
> **Provenance (traza de origen)**: cada fetch deja `source_url`, `fetched_at`, `status_code`, `cache_hit` (y a veces `body_sha12` o `auth_scheme`). **Nunca loguees el token** ni el header Authorization: solo un booleano `token_present` o la longitud. Caso sintético: segundo `cached_get` a `https://api.example.com/signals` → `cache_hit=True`; el manifest de provenance no contiene la cadena del token. **Qué observar:** `token_len` sí; el valor del token, no.

**Metrics:** 4 sentences, WPS 16/19/19/8, FH ≈ 70. Clean.

**After:** No rewrite needed.

### 6.6 Theory tab — `theory[4]` "Contract tests y fallback"

**Paragraph 1 — Before:**
> Ya tienes secretos y provenance; ahora blindas el adaptador contra el schema del proveedor. Un **contract test** fija las claves obligatorias del JSON (fixture). Si el schema cambia (`lat` renombrado a `latitude`), el test falla **antes** de producción y del dashboard de S13 — mejor un assert roto en CI que un mapa con huecos silenciosos.

**Metrics:** 3 sentences, WPS 11/13/24, FH ≈ 75. Clean.

**After:** No rewrite needed.

**Paragraph 2 — Before:**
> **Fallback degradado**: si 5xx o red caída, lee coordenadas/precomputados locales y marca `mode=offline` (o `offline_fallback`) en provenance. No finjas éxito online: la traza debe decir la verdad al auditor. **Falla suave, traza dura** (*fail soft, trace hard*): el pipeline sigue con datos locales, pero no miente sobre el origen.

**Metrics:** 3 sentences, WPS 23/13/19, FH ≈ 70. Clean.

**After:** No rewrite needed.

**Paragraph 3 — Before:**
> Feature flag offline permite demos reproducibles sin red — **obligatorio** en CP-N1-C y en entrevistas técnicas donde "demo con internet" falla. Caso sintético: `assert_contract` exige `{"lat","lon","label"}`; `geocode(..., online=True)` → `mode=online`; `online=False` → `mode=offline_fallback`. **Qué observar:** el contrato falla en falta de `lon`; el fallback no reescribe el modo a online.

**Metrics:** 3 sentences, WPS 19/26/17, FH ≈ 70. Clean.

**After:** No rewrite needed.

### 6.7 Theory tab — `theory[5]` "Esquema, CRUD y joins"

**Paragraph 1 — Before:**
> Con el adaptador HTTP listo, las señales no viven solo en memoria del proceso: las **persistes** para el caso. SQLite vía `sqlite3` basta para el almacén local de CP-N1-C: tablas `clients`, `transactions`, `evidence` (nombres alineados al dominio de S11). Archivo `:memory:` en demos o `case.db` local — sin servidor remoto ni ORM en esta sección.

**Metrics:** 3 sentences, WPS 17/22/13, FH ≈ 70. Clean.

**After:** No rewrite needed.

**Paragraph 2 — Before:**
> CRUD = CREATE/INSERT/SELECT/UPDATE (DELETE con cuidado y soft-delete si hace falta auditoría). El **JOIN** une evidencias a entidades por `entity_id` (y transacciones por `client_id`) para armar la ficha del caso que el dashboard de S13 consumirá. Prefer **placeholders `?`** desde el primer INSERT: el hábito de parametrizar se aprende antes del ejercicio de inyección en T3-B.

**Metrics:** 3 sentences, WPS 13/24/22, FH ≈ 70. Note: "Prefer" is an English borrowing used as imperative; could be Spanish "Prefiere".

**After (minimal edit):**
> CRUD = CREATE/INSERT/SELECT/UPDATE (DELETE con cuidado y soft-delete si hace falta auditoría). El **JOIN** une evidencias a entidades por `entity_id` (y transacciones por `client_id`) para armar la ficha del caso que el dashboard de S13 consumirá. Prefiere **placeholders `?`** desde el primer INSERT: el hábito de parametrizar se aprende antes del ejercicio de inyección en T3-B.

**Improvement:** `Prefer` → `Prefiere` (English calque → Spanish imperative).

**Paragraph 3 — Before:**
> Empieza transacciones explícitas cuando un caso toca varias filas; en T3-B profundizamos COMMIT/ROLLBACK e índices. Caso sintético: insert `C001` + evidence `geo` → JOIN devuelve `[('Ana Demo', 'geo')]`. **Qué observar:** el resultado es una lista de tuplas (nombre, kind), no un string suelto; el join falla en silencio solo si olvidaste el `entity_id` correcto.

**Metrics:** 3 sentences, WPS 14/14/24, FH ≈ 75. Clean.

**After:** No rewrite needed.

### 6.8 Theory tab — `theory[6]` "Parámetros, transacciones, constraints e índices"

**Paragraph 1 — Before:**
> El join de T3-A asume datos limpios; ahora blindas integridad e inyección. Usa placeholders `?` (o `:name` con `Connection.row_factory`). **Prohibido** armar SQL con f-strings de input de usuario: es el camino clásico a inyección (OWASP) aunque "solo sea un id sintético". El input `C001' OR '1'='1` no debe devolver filas ajenas.

**Metrics:** 4 sentences, WPS 9/8/22/9, FH ≈ 75. LT `WRONG_IMPERATIVE` flag on "un id sintético" — false positive ("id" parsed as imperative verb). Clean otherwise.

**After:** No rewrite needed.

**Paragraph 2 — Before:**
> `executemany` + `BEGIN`/`COMMIT` hacen batch **atómico**; un `UNIQUE` roto → `ROLLBACK` y `COUNT(*)==0`. No dejes la DB a medias con 2 de 3 inserts "casi ok": en compliance, un estado parcial es peor que un fallo ruidoso. Reporta la fila ofensora en el log de aplicación, no en el SQL interpolado.

**Metrics:** 3 sentences, WPS 16/22/13, FH ≈ 70. Clean.

**After:** No rewrite needed.

**Paragraph 3 — Before:**
> `UNIQUE`/`NOT NULL` e **índices** en `document_id` / `entity_id` aceleran lookups del caso y documentan el modelo. Caso sintético: batch `C001/D-100`, `C002/D-200`, `C003/D-100` (duplicado) → status `rolled_back` y count `0`. **Qué observar en el demo:** la tupla `('rolled_back', 0)` es la promesa de atomicidad; si ves count `2`, olvidaste el rollback.

**Metrics:** 3 sentences, WPS 14/19/20, FH ≈ 75. Clean.

**After:** No rewrite needed.

### 6.9 Theory tab — `theory[7]` "Normalización y geocoding autorizado"

**Paragraph 1 — Before:**
> Con HTTP y SQL listos, la geoevidancia cierra el incremento CP-N1-C — pero con ética de egress. Normaliza direcciones sintéticas: **trim + colapsar espacios** (contrato N1). El title-case es política opcional del proveedor; en los ejercicios de S12 **no** lo exijas a menos que el enunciado lo pida (el mock puede usar `.title()` solo para la **clave de lookup** de ciudad). No inventes campos (distrito, ubigeo) que no vinieron en el payload: el invento silencioso contamina geoevidancia y el score de S13.

**Metrics:** 4 sentences, WPS 14/8/36/22, FH ≈ 60. Third sentence is 36 words (Issue #18).

**After (split third sentence):**
> Con HTTP y SQL listos, la geoevidancia cierra el incremento CP-N1-C — pero con ética de egress. Normaliza direcciones sintéticas: **trim + colapsar espacios** (contrato N1). El title-case es política opcional del proveedor; en los ejercicios de S12 **no** lo exijas a menos que el enunciado lo pida. El mock puede usar `.title()` solo para la **clave de lookup** de ciudad. No inventes campos (distrito, ubigeo) que no vinieron en el payload: el invento silencioso contamina geoevidancia y el score de S13.

**Improvement:** 36w sentence → 16w + 12w.

**Paragraph 2 — Before:**
> Solo **geocoder autorizado/mock**. Política del curso: **no envíes PII bancaria** (docs, cuentas, montos, nombres completos si la política lo prohíbe) a proveedores públicos gratuitos. El payload mínimo es ciudad/dirección sintética autorizada. **Egress (salida de datos)** hacia un proveedor externo se gobierna con allowlist de claves: `ALLOWED = {"address", "city", "country"}`. Si aparece `document_id`, `allowed_for_public_geocoder` devuelve `False`.

**Metrics:** 5 sentences, WPS 4/22/8/16/9, FH ≈ 75. Clean.

**After:** No rewrite needed.

**Paragraph 3 — Before:**
> `MockGeocoder` devuelve lat/lon fijos por ciudad de demo (Sucursal-Sur, Arequipa) para demos offline reproducibles; ciudad desconocida (Cusco en el ejercicio) → `None` (fail-closed). Caso sintético: `normalize_address("  av.  larco  123  ")` → `'av. larco 123'`; `geocode("lima")` → coords de Plaza de Armas demo. **Qué observar:** normalize no cambia capitalización; el geocode de ciudad desconocida no inventa un punto en el mapa.

**Metrics:** 3 sentences, WPS 23/20/16, FH ≈ 70. **Note:** this paragraph CLAIMS `geocode("lima")` returns coords, but the theory code (Issue #1) actually returns `None`. This is a code/prose consistency defect tied to Issue #1.

**After (depends on Issue #1 fix):**
After fixing the theory code's `MockGeocoder.TABLE` to actually contain a `"Lima"` key (or changing the call to `geocode("sucursal-centro")`), the paragraph should match. Proposed paragraph if the TABLE is fixed to `{"Lima": ..., "Arequipa": ...}`:
> `MockGeocoder` devuelve lat/lon fijos por ciudad de demo (Lima, Arequipa) para demos offline reproducibles; ciudad desconocida (Cusco en el ejercicio) → `None` (fail-closed). Caso sintético: `normalize_address("  av.  larco  123  ")` → `'av. larco 123'`; `geocode("lima")` → coords de Lima demo. **Qué observar:** normalize no cambia capitalización; el geocode de ciudad desconocida no inventa un punto en el mapa.

### 6.10 Theory tab — `theory[8]` "Calidad de coordenada, Haversine, caching y política"

**Heading — Before:** `"Calidad de coordenada, Haversine, caching y política"`
**After:** `"Calidad de coordenada, Haversine, caché y política"` (Issue #9).

**Paragraph 1 — Before:**
> Tienes coords del mock; antes de medir, valida **lat ∈ [-90, 90]** y **lon ∈ [-180, 180]**. Coordenadas basura (91°, NaN, strings) no entran al mapa ni al score de relación. Fail-closed: rechaza el par, no "corrige" a 0,0 (Golfo de Guinea) — ese "arreglo" ha generado mapas absurdos en producción real.

**Metrics:** 3 sentences, WPS 13/15/22, FH ≈ 70. LT `DIACRITICS_OTHERS` flagged `valida` as adjective ("válida") — false positive: `valida` is the verb imperative here. LT `AGREEMENT_ADJ_NOUN` flagged `Coordenadas basura` — false positive (Issue #14).

**After:** No rewrite needed (LT false positives).

**Paragraph 2 — Before:**
> **Haversine** estima km entre dos puntos WGS84 con radio R=6371 km en este curso; sirve como **geoseñal de relación** en el score de matching, no como veredicto de parentesco o fraude. Empaqueta el resultado como `{"type": "geo_distance_km", "value": km, "kinship_verdict": None}` (o `verdict: None`). Documenta unidades (km) y el radio usado.

**Metrics:** 3 sentences, WPS 25/14/6, FH ≈ 70. Clean.

**After:** No rewrite needed.

**Paragraph 3 — Before:**
> Cachea geocodes bajo TTL/política del proveedor para no quemar cuota (misma idea de cache GET de T2-A). Distancia es **señal**, no kinship. Caso sintético: Oficina-Oeste–Callao ≈ **8.95 km** → alimenta `relationship_signal_score` en S13, jamás `is_family=True` automático. **Qué observar:** `valid True` / `invalid False` para (91, 0); el disclaimer `signal != kinship` no es adorno — es la línea ética del capstone.

**Metrics:** 4 sentences, WPS 13/4/24/24, FH ≈ 70. `cache GET` (noun) → `caché GET` (Issue #9). Also note: "Oficina-Oeste–Callao" — the demo uses `lima = (-12.0464, -77.0428)` and `callao = (-12.0500, -77.1250)` and the result is 8.95 km. The paragraph says "Oficina-Oeste–Callao" but the demo code says `lima`. Consistency defect: the paragraph mentions Oficina-Oeste (a synthetic name) but the demo code uses `lima` (real city name). This is a minor prose/code mismatch.

**After (minimal edits):**
> Cachea geocodes bajo TTL/política del proveedor para no quemar cuota (misma idea de caché GET de T2-A). Distancia es **señal**, no kinship. Caso sintético: Lima–Callao ≈ **8.95 km** → alimenta `relationship_signal_score` en S13, jamás `is_family=True` automático. **Qué observar:** `valid True` / `invalid False` para (91, 0); el disclaimer `signal != kinship` no es adorno — es la línea ética del capstone.

**Improvement:** `cache GET` → `caché GET` (Issue #9); `Oficina-Oeste–Callao` → `Lima–Callao` to match the demo code's variable names (`lima = (-12.0464, -77.0428)`).

### 6.11 I Do tab — `iDo.intro`

**Before:**
> Ocho demos locales del hilo CP-N1-C en orden de pipeline: (1) mock HTTP status→JSON, (2) paginación con rate-limit conceptual, (3) provenance sin token, (4) contract/fallback offline, (5) join de caso SQLite, (6) batch atómico con rollback, (7) MockGeocoder fail-closed, (8) Haversine Cliente-A–Callao como geoseñal (no parentesco). Lee description + why de cada demo: modelan el razonamiento del experto (status antes que body, traza honesta, atomicidad, ética geo) antes de los micro-defectos del We Do.

**Metrics:** 2 sentences, WPS 46/24, FH ≈ 55. First sentence is a 46-word run-on enumeration (Issue #16).

**After (enumerate):**
> Ocho demos locales del hilo CP-N1-C en orden de pipeline:
>
> 1. mock HTTP status→JSON
> 2. paginación con rate-limit conceptual
> 3. provenance sin token
> 4. contract/fallback offline
> 5. join de caso SQLite
> 6. batch atómico con rollback
> 7. MockGeocoder fail-closed
> 8. Haversine Lima–Callao como geoseñal (no parentesco).
>
> Lee `description` + `why` de cada demo: modelan el razonamiento del experto (status antes que body, traza honesta, atomicidad, ética geo) antes de los micro-defectos del We Do.

**Improvement:** 46w sentence → 8 short bullets + 24w sentence. Also `Cliente-A–Callao` → `Lima–Callao` to match the demo code's `lima` variable.

### 6.12 I Do tab — `iDo.steps[].description` and `iDo.steps[].why`

Most `description` and `why` strings are 1–2 sentences, WPS ≤ 20, FH ≥ 70. Specific issues:

- `iDo.steps[1].description` (line 444): `"Observa items 1..5 y rate_limit_pauses=2: dos saltos de página, no tres sleeps al final."` — `1..5` Python slice (Issue #13). After: `"Observa items del 1 al 5 y rate_limit_pauses=2: dos saltos de página, no tres sleeps al final."`.
- `iDo.steps[3].description` (line 509): `"…mismo lat/lon de Cliente-B, traza distinta…"` — references "Cliente-B" but the code uses `"Sucursal-Sur"` and `"Sucursal-Centro"` (Issue #3). After: align description to the (fixed) code.
- `iDo.steps[6].description` (line 604): `"MockGeocoder autorizado: Oficina-Oeste y Arequipa devuelven lat/lon fijos; Iquitos → None (fail-closed, no inventa punto)."` — references "Oficina-Oeste" but the code's `DB` has `Cliente-A` and `Cliente-B` and the loop iterates `Sucursal-Norte/Sucursal-Sur/Iquitos` (Issue #2). After: align description to the (fixed) code.
- `iDo.steps[7].description` (line 629): `"Calcula ~8.95 km Cliente-B–Callao…"` — references "Cliente-B" but the demo code uses `lima = (-12.0464, -77.0428)`. After: `"Calcula ~8.95 km Lima–Callao…"`.

### 6.13 We Do tab — `weDo.intro`

**Before:**
> 24 ejercicios (E1 guiado / E2 independiente / E3 transferencia) por los 8 subtemas, en el mismo orden del I Do. Alcance de S12: mocks HTTP conceptuales + `sqlite3` + Haversine (`math`); datos sintéticos (`CASO-LIM-012`, ids `C00x`). No RPA ni dashboard de S13; no NumPy de S14. Conserva asserts y fixtures del starter — cada starter trae **un defecto claro** (DEFECT). Dos pistas por ejercicio. Política N1 de retry: solo 429 y 503; normalize de dirección = espacios, sin `.title()`.

**Metrics:** 7 sentences, WPS 14/16/8/15/5/5/13, FH ≈ 80. Clean and well-segmented.

**After:** No rewrite needed.

### 6.14 We Do tab — `weDo.steps[].instruction`

24 instructions, most are 1–3 sentences. Specific issues:

- `weDo.steps[11].instruction` (line 1184): `…E1` / `C001` / `geo` y imprime el `COUNT(*)` — `y imprime` → `e imprime` (Issue #11).
- `weDo.steps[13].instruction` (line 1270): `une clients + evidence por entity_id y imprime los kind de C001 ordenados` — `y imprime` → `e imprime` (Issue #11).
- `weDo.steps[11].instruction`: `"Crea la tabla `evidence(id TEXT PRIMARY KEY, entity_id TEXT NOT NULL, kind TEXT NOT NULL)`"` — LT `WRONG_IMPERATIVE` flagged `entity_id` and `id` as imperative verbs. False positive (they are SQL column names).

Other instructions are clean. The `Salida/pass:` claims are mostly numeric (`1`, `0`, `True False False True`, `111.19` + `tolerance_ok`) and accurate — except where they include city names (Issues #4–#6).

### 6.15 We Do tab — `weDo.steps[].hint`, `hints[]`, `feedback`, `edgeCases`, `tests`

All 24×5 = 120 short strings are clean (WPS ≤ 12, FH ≥ 85). No rewrites needed. Specific callouts:

- `weDo.steps[8].feedback` (line 981): `"Cache de GET reduce latencia en demos repetidas."` — `Cache` → `Caché` (Issue #9).
- `weDo.steps[23].instruction` (line 1661): `"Nunca auto-etiquetes parentesco o fraude"` — `auto-etiquetes` → `autoetiquetes` (Issue #10).
- `weDo.steps[23].hints[0]` (line 1664): `"Nunca setees is_family"` — `setees` is an English calque of "set" + Spanish subjunctive "-ees"; non-standard. Consider `"Nunca asignes is_family"`.

### 6.16 You Do tab — `youDo.context`, `objectives`, `requirements`, `portfolioNote`, `rubric`

**`context` — Before:**
> Integra el hilo completo de S12 en un solo script de adquisición: cliente HTTP mock con timeout/paginación/retry selectivo (política N1: solo 429/503), secretos por env, cache GET, provenance sin tokens, SQLite parametrizado (`clients` / `transactions` / `evidence`) y **MockGeocoder** con allowlist de egress (sin PII bancaria). Solo datos sintéticos Oficina-Este/Oficina-Oeste e ids `C00x`. El `main()` del starter es un smoke path: al implementar cada stub, debe imprimir token_len, retry, entity, cache_hits, provenance, normalize, egress ok/bad, geo, km y case_row. En **S13** se cierra el dashboard de evidencia y la regresión de nivel 1 — aquí no construyas el dashboard.

**Metrics:** 4 sentences, WPS 45/10/26/16, FH ≈ 55. First sentence is a 45-word run-on (Issue #17).

**After (split first sentence):**
> Integra el hilo completo de S12 en un solo script de adquisición: cliente HTTP mock con timeout/paginación/retry selectivo (política N1: solo 429/503), secretos por env, caché GET y provenance sin tokens. Persiste en SQLite parametrizado (`clients` / `transactions` / `evidence`) y geocodifica con **MockGeocoder** + allowlist de egress (sin PII bancaria). Solo datos sintéticos Lima/Arequipa e ids `C00x`. El `main()` del starter es un smoke path: al implementar cada stub, debe imprimir `token_len`, `retry`, `entity`, `cache_hits`, `provenance`, `normalize`, `egress ok/bad`, `geo`, `km` y `case_row`. En **S13** se cierra el dashboard de evidencia y la regresión de nivel 1 — aquí no construyas el dashboard.

**Improvements:** 45w → 21w + 18w; `cache GET` → `caché GET`; `Oficina-Este/Oficina-Oeste` → `Lima/Arequipa` (consistent with the actual `MockGeocoder.DB` keys used in the theory code, once Issue #1 is fixed). Note: the `youDo.starterCode` line 1770 has `DB = {"Sucursal-Norte": ..., "Sucursal-Sur": ...}` and line 1814-1815 uses `"Oficina-Este"` and `"Oficina-Oeste"` — another instance of the city-name drift (Issue #6 class). The whole pseudonymization pass needs to settle on ONE city vocabulary.

**`objectives[]`, `requirements[]`, `portfolioNote`, `rubric[]`:** All clean short strings. Specific:
- `objectives[1]` (line 1705): `"Cache GET + min_provenance sin secretos"` — `Cache` → `Caché`.
- `requirements[5]` (line 1716): `"Datos sintéticos latam (example.com / Cliente-A / Cliente-B)"` — uses `Cliente-A/Cliente-B`, but `youDo.context` (line 1702) uses `Oficina-Este/Oficina-Oeste`. **Inconsistency** within the same `youDo` block.
- `portfolioNote` (line 1830): `"…distancia Cliente-B–Callao (~8.95 km) como geoseñal…"` — uses `Cliente-B`, but the demo code uses `lima`. After: `"…distancia Lima–Callao (~8.95 km) como geoseñal…"`.
- `rubric[0..4]` (lines 1832–1836): clean.

### 6.17 Self-check tab — `selfCheck.questions[]`

7 questions, each with `question`, `options[3–4]`, `correctIndex`, `explanation`.

- Q1 (line 1842): `"Un 400 Bad Request del proveedor debe…"` — uses `debe…` (ellipsis). The 4 options are clean. `correctIndex: 3`. ✓
- Q2 (line 1848): `"¿Dónde debe vivir el token de API?"` — properly paired `¿…?`. ✓
- Q3 (line 1855): `"SQL con f-string e input de usuario es…"` — clean.
- Q4 (line 1862): `"Enviar document_id bancario a un geocoder público…"` — clean.
- Q5 (line 1869): `"1.2 km entre dos entidades sintéticas implica…"` — clean.
- Q6 (line 1876): `"Al paginar una API con `next`, ¿cuándo dejas de pedir la siguiente página?"` — properly paired `¿…?`. ✓ Note: `"paginar una API"` — per Issue #8, the RAE form is `"paginar una API"` (sigla invariable) — the prose here already uses `API` (singular) ✓.
- Q7 (line 1883): `"En un batch dentro de BEGIN, un IntegrityError a mitad del camino con rollback correcto deja…"` — clean.

**`explanation[]`:** All 7 explanations are 1-sentence, ≤ 12 words, accurate. ✓

**After:** No rewrite needed.

### 6.18 Resources tab — `resources.{docs,books,courses}`

8 docs, 2 books, 4 courses — each has `label`, `url`, `note`. All `note` strings are ≤ 8 words, clean Spanish with technical borrowings (acceptable). ✓

### 6.19 Summary of rewrites by tab

| Tab | Paragraphs / sentences audited | Issues found | Rewrites proposed |
|---|---|---|---|
| Theory (8 subtopics, ~24 paragraphs) | 24 | 8 | 5 splits + 4 word-level fixes (`cache`→`caché`, `vs`→`frente a`, `Prefer`→`Prefiere`, `concurrency`→`concurrencia`) |
| I Do (intro + 8 steps × 3 fields) | ~26 | 5 | 1 split (intro) + 4 description/code-alignment fixes |
| We Do (intro + 24 steps × 6 fields) | ~150 | 6 | 2 `y`→`e` + 2 `cache`→`caché` + 1 `auto-etiqueta`→`autoetiqueta` + 1 `setees`→`asignes` |
| You Do (context + 5 objectives + 6 requirements + portfolioNote + 5 rubric) | ~17 | 4 | 1 split (context) + 3 word-level fixes |
| Self-check (7 questions × 4 fields) | ~28 | 0 | none |
| Resources (8 docs + 2 books + 4 courses) | ~14 | 0 | none |
| **Total** | **~259 prose units** | **23** | **~17 rewrites** |

---

## 7. Proposed GitHub-style Diffs

> **Do NOT apply these diffs automatically.** They are proposals for the Fixer pass. Line numbers reference the current `s12-performance.ts` (1,968 lines).

### Diff 1 — Fix fabricated output in theory T4-A `mock_geocode.py` (Issue #1)

```diff
--- a/src/lib/course/sections/s12-performance.ts
+++ b/src/lib/course/sections/s12-performance.ts
@@ -331,9 +331,9 @@
         title: "mock_geocode.py",
         code: `import re
 
 def normalize_address(s: str) -> str:
     # Solo espacios: strip + colapsar. Title-case es opcional del proveedor.
     return re.sub(r"\\s+", " ", s.strip())
 
 class MockGeocoder:
     TABLE = {
-        "Sucursal-Centro": (-12.0464, -77.0428),
+        "Lima": (-12.0464, -77.0428),
         "Arequipa": (-16.4090, -71.5375),
     }
     def geocode(self, city: str):
         key = city.strip().title()
         coords = self.TABLE.get(key)
         if not coords:
             return None
         lat, lon = coords
         return {"city": key, "lat": lat, "lon": lon, "provider": "mock"}
 
 addr = normalize_address("  av.  larco  123  ")
 geo = MockGeocoder().geocode("lima")
 print("addr", addr)
 print("geo", geo)`,
-        output: `addr av. larco 123
-geo {'city': 'Oficina-Este', 'lat': -12.0464, 'lon': -77.0428, 'provider': 'mock'}`,
+        output: `addr av. larco 123
+geo {'city': 'Lima', 'lat': -12.0464, 'lon': -77.0428, 'provider': 'mock'}`,
       },
```

### Diff 2 — Fix fabricated output in I Do demo S12-T4-A-DEMO (Issue #2)

```diff
--- a/src/lib/course/sections/s12-performance.ts
+++ b/src/lib/course/sections/s12-performance.ts
@@ -605,12 +605,12 @@
         description: "MockGeocoder autorizado: Lima y Arequipa devuelven lat/lon fijos; Iquitos → None (fail-closed, no inventa punto). Observa provider=authorized_mock y la ausencia de PII en el payload.",
         code: {
           language: 'python',
           title: "mock_cities_demo.py",
           code: `class MockGeocoder:
-    DB = {"Cliente-A": (-12.0464, -77.0428), "Cliente-B": (-16.4090, -71.5375)}
+    DB = {"Lima": (-12.0464, -77.0428), "Arequipa": (-16.4090, -71.5375)}
     def geocode(self, city):
         if city not in self.DB:
             return None
         lat, lon = self.DB[city]
         return {"city": city, "lat": lat, "lon": lon, "provider": "authorized_mock"}
 
 g = MockGeocoder()
-for c in ("Sucursal-Norte", "Sucursal-Sur", "Iquitos"):
+for c in ("Lima", "Arequipa", "Iquitos"):
     print(c, g.geocode(c))`,
-          output: `Sucursal-Centro {'city': 'Oficina-Este', 'lat': -12.0464, 'lon': -77.0428, 'provider': 'authorized_mock'}
-Oficina-Oeste {'city': 'Cliente-A', 'lat': -16.409, 'lon': -71.5375, 'provider': 'authorized_mock'}
+          output: `Lima {'city': 'Lima', 'lat': -12.0464, 'lon': -77.0428, 'provider': 'authorized_mock'}
+Arequipa {'city': 'Arequipa', 'lat': -16.409, 'lon': -71.5375, 'provider': 'authorized_mock'}
 Iquitos None`,
         },
```

### Diff 3 — Fix KeyError + fabricated output in I Do demo S12-T2-B-DEMO (Issue #3)

```diff
--- a/src/lib/course/sections/s12-performance.ts
+++ b/src/lib/course/sections/s12-performance.ts
@@ -510,15 +510,15 @@
         description: "Contract test del geocoder mock + fallback a coordenadas precalculadas. Observa mode=online vs mode=offline_fallback: mismo lat/lon de Lima, traza distinta — el auditor ve la verdad.",
         code: {
           language: 'python',
           title: "geocoder_contract_demo.py",
           code: `REQUIRED = {"lat", "lon", "provider"}
-PRECALC = {"Sucursal-Norte": {"lat": -12.0464, "lon": -77.0428, "provider": "precalc"}}
+PRECALC = {"Lima": {"lat": -12.0464, "lon": -77.0428, "provider": "precalc"}}
 
 def contract_ok(d):
     return not (REQUIRED - set(d.keys()))
 
 def geocode(city, fail_online=False):
     if fail_online:
         return {**PRECALC[city], "mode": "offline_fallback"}
     online = {"lat": -12.0464, "lon": -77.0428, "provider": "mock", "mode": "online"}
     assert contract_ok(online)
     return online
 
-print("online", geocode("Sucursal-Sur"))
-print("fallback", geocode("Sucursal-Centro", fail_online=True))
-print("contract_precalc", contract_ok(PRECALC["Oficina-Este"]))`,
+print("online", geocode("Arequipa"))
+print("fallback", geocode("Lima", fail_online=True))
+print("contract_precalc", contract_ok(PRECALC["Lima"]))`,
           output: `online {'lat': -12.0464, 'lon': -77.0428, 'provider': 'mock', 'mode': 'online'}
 fallback {'lat': -12.0464, 'lon': -77.0428, 'provider': 'precalc', 'mode': 'offline_fallback'}
 contract_precalc True`,
         },
```

### Diff 4 — Fix S12-T1-A-E1 city-name drift (Issue #4)

```diff
--- a/src/lib/course/sections/s12-performance.ts
+++ b/src/lib/course/sections/s12-performance.ts
@@ -660,12 +660,12 @@
         instruction:
-          "E1 (guiado) — Implementa `get_entity(store, entity_id)` que devuelva `(status, body)`. Si el id existe: `200` y el dict del store; si no: `404` y `{'error':'not_found'}`. Fixture: `store = {'C001': {'id':'C001','region':'Sucursal-Norte'}}`. Salida/pass: `(200, {'id': 'C001', 'region': 'Sucursal-Sur'})` y luego `(404, {'error': 'not_found'})`.",
+          "E1 (guiado) — Implementa `get_entity(store, entity_id)` que devuelva `(status, body)`. Si el id existe: `200` y el dict del store; si no: `404` y `{'error':'not_found'}`. Fixture: `store = {'C001': {'id':'C001','region':'Lima'}}`. Salida/pass: `(200, {'id': 'C001', 'region': 'Lima'})` y luego `(404, {'error': 'not_found'})`.",
         hint: "Devuelve una tupla (status_code, dict).",
         hints: [
           "Devuelve una tupla (status_code, dict).",
           "404 no lanza excepción: el adaptador decide la acción.",
         ],
         edgeCases: ["404 body estable", "id existente"],
         tests: "200 con dict; 404 con error",
         feedback: "Status explícito evita try/except ruidosos en el caller.",
         starterCode: {
           language: 'python',
           title: "get_entity.py",
           code: `# CASO-LIM-012 · get_entity
 # DEFECT: siempre 200 y body vacío
-store = {"C001": {"id": "C001", "region": "Sucursal-Centro"}}
+store = {"C001": {"id": "C001", "region": "Lima"}}
 def get_entity(store, entity_id):
     return 200, {}
 print(get_entity(store, "C001"))
 print(get_entity(store, "C999"))
 print('ok', True)`,
         },
         solutionCode: {
           language: 'python',
           title: "get_entity.py",
           code: `store = {"C001": {"id": "C001", "region": "Oficina-Este"}}
+store = {"C001": {"id": "C001", "region": "Lima"}}
 def get_entity(store, entity_id):
     if entity_id not in store:
         return 404, {"error": "not_found"}
     return 200, store[entity_id]
 print(get_entity(store, "C001"))
 print(get_entity(store, "C999"))`,
-          output: `(200, {'id': 'C001', 'region': 'Oficina-Oeste'})
+          output: `(200, {'id': 'C001', 'region': 'Lima'})
 (404, {'error': 'not_found'})`,
         },
```

> **Note on Diff 4:** The same pattern (replace inconsistent city names with a single canonical vocabulary — recommended: `Lima`/`Arequipa` to match `theory[6]` and `theory[7]` real coordinates) must be applied to S12-T1-A-E2, S12-T4-A-E2, S12-T4-A-E3, and the `youDo.starterCode` DB keys at line 1770. The Fixer should run a single sed-style pass: `{Cliente-A→Lima, Cliente-B→Arequipa, Sucursal-Norte→Lima, Sucursal-Sur→Arequipa, Sucursal-Centro→Lima, Oficina-Este→Lima, Oficina-Oeste→Arequipa}` consistently across `starterCode.code`, `solutionCode.code`, `solutionCode.output`, `Salida/pass`, `description`, `why`, and `portfolioNote`.

### Diff 5 — `APIs` → `API` (Issue #8)

```diff
--- a/src/lib/course/sections/s12-performance.ts
+++ b/src/lib/course/sections/s12-performance.ts
@@ -17,1 +17,1 @@
-    { text: "Consumir APIs HTTP síncronas, interpretar status y parsear JSON con errores controlados" },
+    { text: "Consumir API HTTP síncronas, interpretar status y parsear JSON con errores controlados" },
```

Apply to all 3 occurrences of `APIs` in user-facing prose (one in `learningOutcomes[0]`; verify the other 2 via `grep -n "APIs"` and apply the same replacement, except where `APIs` is part of a proper noun like "Real Python — Working with APIs" in resources — keep those).

### Diff 6 — `cache` (noun) → `caché` (Issue #9)

Apply to all occurrences where `cache` is used as a noun. The 15 hits are listed in Issue #9. Example:

```diff
--- a/src/lib/course/sections/s12-performance.ts
+++ b/src/lib/course/sections/s12-performance.ts
@@ -140,1 +140,1 @@
-        "**Cache de GET** por hash de URL (o la URL misma en demos) con **TTL** reduce costo y latencia; no caches respuestas de escritura ni PII sin política. Invalida o no reutilices si el status no fue 2xx. El segundo hit al mismo URL debe marcar `cache_hit=True` sin volver a "pegarle" al mock.",
+        "**Caché de GET** por hash de URL (o la URL misma en demos) con **TTL** reduce costo y latencia; no caches respuestas de escritura ni PII sin política. Invalida o no reutilices si el status no fue 2xx. El segundo hit al mismo URL debe marcar `cache_hit=True` sin volver a "pegarle" al mock.",
```

Keep `cachear` (verb), `caches` (verb subjunctive), `cache_hit` / `cache_hits` / `CACHE` (code identifiers), `cached_get` (function name) unchanged.

### Diff 7 — `auto-etiqueta` → `autoetiqueta` (Issue #10)

```diff
--- a/src/lib/course/sections/s12-performance.ts
+++ b/src/lib/course/sections/s12-performance.ts
@@ -398,1 +398,1 @@
-          "1.2 km entre entidades es geoseñal; jamás auto-etiqueta is_family o fraude.",
+          "1.2 km entre entidades es geoseñal; jamás autoetiqueta is_family o fraude.",
@@ -1661,1 +1661,1 @@
-          "E3 (transferencia) — Implementa `as_relationship_signal(km)` que devuelve un dict con `type='geo_distance_km'`, `value=km` y `kinship_verdict=None` (nunca `True`). La distancia es geoseñal, no parentesco. Imprime el dict para `1.2`.",
+          # (the auto-etiquetes appears in hints below)
@@ -1664,1 +1664,1 @@
-          "Nunca setees is_family",
+          "Nunca asignes is_family",
@@ -1665,1 +1665,1 @@
-          "Nunca auto-etiquetes is_family",
+          "Nunca autoetiquetes is_family",
```

### Diff 8 — `y imprime` → `e imprime` (Issue #11)

```diff
--- a/src/lib/course/sections/s12-performance.ts
+++ b/src/lib/course/sections/s12-performance.ts
@@ -1184,1 +1184,1 @@
-          "E1 (guiado) — En SQLite `:memory:`, crea la tabla `evidence(id TEXT PRIMARY KEY, entity_id TEXT NOT NULL, kind TEXT NOT NULL)`. Inserta la fila `E1` / `C001` / `geo` y imprime el `COUNT(*)`. Salida/pass: `1`.",
+          "E1 (guiado) — En SQLite `:memory:`, crea la tabla `evidence(id TEXT PRIMARY KEY, entity_id TEXT NOT NULL, kind TEXT NOT NULL)`. Inserta la fila `E1` / `C001` / `geo` e imprime el `COUNT(*)`. Salida/pass: `1`.",
@@ -1270,1 +1270,1 @@
-          "E3 (transferencia) — JOIN de caso: une `clients` + `evidence` por `entity_id` y imprime los `kind` de `C001` ordenados. No mezcles evidencias de `C002`. Salida/pass: `['geo', 'phone']`.",
+          "E3 (transferencia) — JOIN de caso: une `clients` + `evidence` por `entity_id` e imprime los `kind` de `C001` ordenados. No mezcles evidencias de `C002`. Salida/pass: `['geo', 'phone']`.",
```

### Diff 9 — `1..5` Python slice in prose (Issue #13)

```diff
--- a/src/lib/course/sections/s12-performance.ts
+++ b/src/lib/course/sections/s12-performance.ts
@@ -444,1 +444,1 @@
-        description: "Pipeline de paginación: while next no es None, acumula items y cuenta pausas de rate-limit (sin sleep real). Observa items 1..5 y rate_limit_pauses=2: dos saltos de página, no tres sleeps al final.",
+        description: "Pipeline de paginación: while next no es None, acumula items y cuenta pausas de rate-limit (sin sleep real). Observa items del 1 al 5 y rate_limit_pauses=2: dos saltos de página, no tres sleeps al final.",
```

### Diff 10 — Split `jobRelevance` run-on (Issue #15)

```diff
--- a/src/lib/course/sections/s12-performance.ts
+++ b/src/lib/course/sections/s12-performance.ts
@@ -15,1 +15,3 @@
   jobRelevance:
-    "En onboarding, compliance y data quality en bancos, fintech y retail en Perú, el pipeline no empieza en el dashboard: empieza en **adaptadores HTTP resilientes** que leen señales con timeout y retry selectivo, un **SQLite local parametrizado** que une entidad y evidencia, y **geoevidancia controlada** sin filtrar PII bancaria a geocoders públicos. Un analista que hardcodea el token, reintenta un 400 o manda `document_id` a un proveedor gratis quema cuota, rompe auditoría y expone datos. Esta sección construye el tramo de **adquisición + geoevidancia del capstone CP-N1-C** con mocks locales y datos sintéticos (Lima/Arequipa, ids `C00x`): status y JSON, secretos fuera de código, joins con placeholders y geocoding autorizado — listo para el dashboard de S13.",
+    "En onboarding, compliance y data quality en bancos, fintech y retail del Perú, el pipeline no empieza en el dashboard. Empieza en **adaptadores HTTP resilientes** que leen señales con timeout y retry selectivo, en un **SQLite local parametrizado** que une entidad y evidencia, y en **geoevidancia controlada** sin filtrar PII bancaria a geocoders públicos. Un analista que hardcodea el token, reintenta un 400 o manda `document_id` a un proveedor gratis quema cuota, rompe auditoría y expone datos. Esta sección construye el tramo de **adquisición + geoevidancia del capstone CP-N1-C** con mocks locales y datos sintéticos (Lima/Arequipa, ids `C00x`): status y JSON, secretos fuera de código, joins con placeholders y geocoding autorizado — listo para el dashboard de S13.",
```

### Diff 11 — Split `iDo.intro` run-on into a list (Issue #16)

```diff
--- a/src/lib/course/sections/s12-performance.ts
+++ b/src/lib/course/sections/s12-performance.ts
@@ -403,1 +403,11 @@
-    intro: "Ocho demos locales del hilo CP-N1-C en orden de pipeline: (1) mock HTTP status→JSON, (2) paginación con rate-limit conceptual, (3) provenance sin token, (4) contract/fallback offline, (5) join de caso SQLite, (6) batch atómico con rollback, (7) MockGeocoder fail-closed, (8) Haversine Cliente-A–Callao como geoseñal (no parentesco). Lee description + why de cada demo: modelan el razonamiento del experto (status antes que body, traza honesta, atomicidad, ética geo) antes de los micro-defectos del We Do.",
+    intro: "Ocho demos locales del hilo CP-N1-C en orden de pipeline:\n\n1. mock HTTP status→JSON\n2. paginación con rate-limit conceptual\n3. provenance sin token\n4. contract/fallback offline\n5. join de caso SQLite\n6. batch atómico con rollback\n7. MockGeocoder fail-closed\n8. Haversine Lima–Callao como geoseñal (no parentesco).\n\nLee `description` + `why` de cada demo: modelan el razonamiento del experto (status antes que body, traza honesta, atomicidad, ética geo) antes de los micro-defectos del We Do.",
```

> If the renderer does not support newlines inside `intro`, fall back to: `"Ocho demos locales del hilo CP-N1-C en orden de pipeline: 1) mock HTTP status→JSON; 2) paginación con rate-limit conceptual; 3) provenance sin token; 4) contract/fallback offline; 5) join de caso SQLite; 6) batch atómico con rollback; 7) MockGeocoder fail-closed; 8) Haversine Lima–Callao como geoseñal (no parentesco). Lee description + why de cada demo: modelan el razonamiento del experto (status antes que body, traza honesta, atomicidad, ética geo) antes de los micro-defectos del We Do."` — the semicolons make the 46w enumeration parseable.

### Diff 12 — Split `youDo.context` run-on (Issue #17)

```diff
--- a/src/lib/course/sections/s12-performance.ts
+++ b/src/lib/course/sections/s12-performance.ts
@@ -1702,1 +1702,1 @@
-      "Integra el hilo completo de S12 en un solo script de adquisición: cliente HTTP mock con timeout/paginación/retry selectivo (política N1: solo 429/503), secretos por env, cache GET, provenance sin tokens, SQLite parametrizado (`clients` / `transactions` / `evidence`) y **MockGeocoder** con allowlist de egress (sin PII bancaria). Solo datos sintéticos Oficina-Este/Oficina-Oeste e ids `C00x`. El `main()` del starter es un smoke path: al implementar cada stub, debe imprimir token_len, retry, entity, cache_hits, provenance, normalize, egress ok/bad, geo, km y case_row. En **S13** se cierra el dashboard de evidencia y la regresión de nivel 1 — aquí no construyas el dashboard.",
+      "Integra el hilo completo de S12 en un solo script de adquisición: cliente HTTP mock con timeout/paginación/retry selectivo (política N1: solo 429/503), secretos por env, caché GET y provenance sin tokens. Persiste en SQLite parametrizado (`clients` / `transactions` / `evidence`) y geocodifica con **MockGeocoder** + allowlist de egress (sin PII bancaria). Solo datos sintéticos Lima/Arequipa e ids `C00x`. El `main()` del starter es un smoke path: al implementar cada stub, debe imprimir token_len, retry, entity, cache_hits, provenance, normalize, egress ok/bad, geo, km y case_row. En **S13** se cierra el dashboard de evidencia y la regresión de nivel 1 — aquí no construyas el dashboard.",
```

### Diff 13 — `Prefer` → `Prefiere` (Section 6.7)

```diff
--- a/src/lib/course/sections/s12-performance.ts
+++ b/src/lib/course/sections/s12-performance.ts
@@ -237,1 +237,1 @@
-        "CRUD = CREATE/INSERT/SELECT/UPDATE (DELETE con cuidado y soft-delete si hace falta auditoría). El **JOIN** une evidencias a entidades por `entity_id` (y transacciones por `client_id`) para armar la ficha del caso que el dashboard de S13 consumirá. Prefer **placeholders `?`** desde el primer INSERT: el hábito de parametrizar se aprende antes del ejercicio de inyección en T3-B.",
+        "CRUD = CREATE/INSERT/SELECT/UPDATE (DELETE con cuidado y soft-delete si hace falta auditoría). El **JOIN** une evidencias a entidades por `entity_id` (y transacciones por `client_id`) para armar la ficha del caso que el dashboard de S13 consumirá. Prefiere **placeholders `?`** desde el primer INSERT: el hábito de parametrizar se aprende antes del ejercicio de inyección en T3-B.",
```

### Diff 14 — `vs` → `frente a` (Issue #12, optional)

```diff
--- a/src/lib/course/sections/s12-performance.ts
+++ b/src/lib/course/sections/s12-performance.ts
@@ -99,1 +99,1 @@
-        "Ya sabes leer status y JSON; ahora el adaptador no se cuelga ni se come mil filas de un golpe. **Timeout** acota la espera por request. En un cliente real pasas siempre `timeout=` (p. ej. `urlopen(req, timeout=5)` o el equivalente del SDK); aquí lo modelamos como `cost_s` vs `timeout_s` para tests deterministas sin red. **Paginación** (`page` o `cursor`/`next`) recorre colecciones grandes sin traer todo de una vez al heap — crítico cuando el proveedor lista miles de señales sintéticas para el caso.",
+        "Ya sabes leer status y JSON; ahora el adaptador no se cuelga ni se come mil filas de un golpe. **Timeout** acota la espera por request. En un cliente real pasas siempre `timeout=` (p. ej. `urlopen(req, timeout=5)` o el equivalente del SDK); aquí lo modelamos como `cost_s` frente a `timeout_s` para tests deterministas sin red. **Paginación** (`page` o `cursor`/`next`) recorre colecciones grandes sin traer todo de una vez al heap — crítico cuando el proveedor lista miles de señales sintéticas para el caso.",
```

### Diff 15 — `concurrency` → `concurrencia` (Section 6.2 paragraph 3)

```diff
--- a/src/lib/course/sections/s12-performance.ts
+++ b/src/lib/course/sections/s12-performance.ts
@@ -32,1 +32,1 @@
-        "Orden del aprendizaje: **T1 HTTP** (status, JSON, timeout, paginación, retry) → **T2 Auth/cache/contratos** (secretos en env, provenance, fallback) → **T3 SQL** (CRUD, join, placeholders, transacciones) → **T4 Geodatos responsables** (normalize, egress, Haversine como señal). Gate de la sección: adaptador con status/retry selectivo + join local de caso + geoseñal documentada. En **S13** armarás el dashboard de evidencia; aquí cierras la adquisición. Nunca tokens en logs ni claims de parentesco/fraude. Profiling y concurrency de producción se tratan más adelante en el tramo de sistemas — no son el foco de esta semana."
+        "Orden del aprendizaje: **T1 HTTP** (status, JSON, timeout, paginación, retry) → **T2 Auth/caché/contratos** (secretos en env, provenance, fallback) → **T3 SQL** (CRUD, join, placeholders, transacciones) → **T4 Geodatos responsables** (normalize, egress, Haversine como señal). Gate de la sección: adaptador con status/retry selectivo + join local de caso + geoseñal documentada. En **S13** armarás el dashboard de evidencia; aquí cierras la adquisición. Nunca tokens en logs ni claims de parentesco/fraude. El profiling y la concurrencia de producción se tratan más adelante en el tramo de sistemas; no son el foco de esta semana."
```

### Diff 16 — Filename rename (Issue #19, OPTIONAL — needs migration)

> This is a coordinated rename. Do NOT apply without a migration plan that touches `src/lib/course/index.ts`, persisted learner-state keys, and `course-state/*.json` audit artifacts.

```diff
--- a/src/lib/course/index.ts
+++ b/src/lib/course/index.ts
@@ -13,1 +13,1 @@
-import { section12 } from './sections/s12-performance'
+import { section12 } from './sections/s12-apis-sql-geo'
```

```diff
--- /dev/null
+++ b/src/lib/course/sections/s12-apis-sql-geo.ts
 (rename of s12-performance.ts; content unchanged except line 4:)
-  id: "performance",
+  id: "apis-sql-geo",
```

### Diff 17 — Refresh or delete stale audit artifacts (Issue #20)

```bash
# Either regenerate from current s12-performance.ts:
node scripts/extract_visible_paragraphs.js --section 12 \
  > course-state/curriculum_hardening/visible_paragraphs/s12_apis-sql-geo.json
rm course-state/curriculum_hardening/visible_paragraphs/s12_performance.json

# Or, if the regen script is not available, delete the stale files:
rm course-state/curriculum_hardening/paragraph_analysis/S12_PARAGRAPHS.md
rm course-state/curriculum_hardening/visible_paragraphs/s12_performance.json
```

---

## 8. Recommended Priority Order for Fixing

| Priority | Issue(s) | Severity | Effort | Why first |
|---|---|---|---|---|
| **P0** | #1, #2, #3 | H | L (3 small diffs) | Code/output integrity. A learner running these demos today sees fabricated output or a traceback. The I Do tab is the "expert think-aloud" — it must not lie. |
| **P0** | #4, #5, #6, #7 | H | M (one sed-style city-vocabulary pass) | Same root cause as P0 above: the pseudonymization pass drifted. Fixing all 7 issues with one canonical vocabulary (`Lima`/`Arequipa`/`Cusco`/`Iquitos`/`Callao` only) resolves the entire class. |
| **P1** | #15, #16, #17 | M | L (3 sentence splits) | Cognitive load. The `jobRelevance`, `iDo.intro`, and `youDo.context` are the learner's first encounter with the section; first impressions matter. |
| **P1** | #9 | M | M (15 word-level edits, careful to keep verb forms unchanged) | Orthography. `cache` → `caché` is a RAE-registered form and the most frequent LT finding. |
| **P2** | #8 | M | L (3 occurrences) | Orthography. `APIs` → `API` (sigla invariable). |
| **P2** | #11, #10, #13 | L | L (5 small edits) | Orthography. `y`→`e` (×2), `auto-etiqueta`→`autoetiqueta` (×2), `1..5`→`del 1 al 5`. |
| **P3** | #18 (six 33–42w sentences) | L | M (optional splits) | Polish. These are at the upper edge of the technical-prose band; splitting improves flow but is not blocking. |
| **P3** | #14 (`Coordenadas basura`), #12 (`vs`) | L | L | Optional stylistic improvements; LT false positives or RAE-accepted forms. |
| **P4** | #19 | L | M (coordinated rename + migration) | Developer-facing meta-residue. No learner impact. Defer until next major repo reorganization. |
| **P4** | #20 | L | L (delete or regenerate 2 files) | Audit-hygiene. No learner impact. Defer until next audit cycle. |

---

## 9. Graph Memory Update Notes

For the shared context files (`course-state/curriculum_hardening/GRAPH_MEMORY.json`, `GRAPH_MEMORY_SUMMARY.md`, `residual_ledger.json`), record the following S12 nodes and edges:

### Nodes to add / update

```
S12  (section, status: audited 2026-07-25, composite_score: 6.0)
  topic: "APIs, SQL y geodatos responsables"
  file: "src/lib/course/sections/s12-performance.ts"  # NOTE: filename stale (Issue #19)
  phase: 0  # Fundamentos
  capstone: "CP-N1-C"
  prev_section: S11  # OOP / dominio
  next_section: S13  # Familiarity Evidence Dashboard
  pedagogy_structure: { theory_blocks: 8, iDo_steps: 8, weDo_steps: 24, youDo: 1, selfCheck: 7 }
  ethics_spine: ["fail-closed", "egress allowlist", "signal != kinship", "no PII bancaria"]
```

### Edges

```
S11 -> S12  (continuity: ClientRecord/Transaction/RelationshipEvidence names reused in S12 SQLite tables)
S12 -> S13  (capstone continuity: HTTP/SQL/geo adapter feeds S13 dashboard; "listo para el dashboard de S13")
S12 -> CP-N1-C  (builds: adquisición + geoevidancia)
S12 -> S14  (negative edge: "no NumPy de S14" — boundary)
S12 -> S27  (forward ref: "Profiling y concurrency de producción se tratan más adelante en el tramo de sistemas" — likely S27 async-concurrency or S38 performance-extreme)
```

### Defects to register in residual_ledger

```
S12-DEFECT-01  H  theory[6].code output fabricated (mock_geocode.py geocode("lima") returns None, not coords)
S12-DEFECT-02  H  iDo.steps[6] (S12-T4-A-DEMO) output fabricated (2 of 3 lines wrong)
S12-DEFECT-03  H  iDo.steps[3] (S12-T2-B-DEMO) raises KeyError; output fabricated
S12-DEFECT-04  H  weDo.steps[0] (S12-T1-A-E1) starter/salida/solution/output use 4 different city names
S12-DEFECT-05  H  weDo.steps[1] (S12-T1-A-E2) starter/salida/solution/output use 4 different city names
S12-DEFECT-06  H  weDo.steps[19] (S12-T4-A-E2) starter code raises KeyError (DB["Sucursal-Sur"] not in DB)
S12-DEFECT-07  M  weDo.steps[20] (S12-T4-A-E3) starter/solution city name drift
S12-DEFECT-08  M  orthography: cache (noun) -> caché (15 occurrences)
S12-DEFECT-09  M  orthography: APIs -> API (3 occurrences)
S12-DEFECT-10  M  run-on sentences: jobRelevance (52w), iDo.intro (46w), youDo.context (45w)
S12-DEFECT-11  L  orthography: auto-etiqueta -> autoetiqueta (2 occurrences)
S12-DEFECT-12  L  orthography: y -> e before "imprime" (2 occurrences)
S12-DEFECT-13  L  Python slice "1..5" in Spanish prose (1 occurrence)
S12-DEFECT-14  L  English calque "Prefer" -> "Prefiere" (1 occurrence)
S12-DEFECT-15  L  English borrowing "concurrency" -> "concurrencia" (1 occurrence)
S12-DEFECT-16  L  "vs" without period (2 occurrences; RAE accepts both forms)
S12-DEFECT-17  L  filename/ID mismatch: s12-performance.ts / id:"performance" vs title "APIs, SQL y geodatos responsables"
S12-DEFECT-18  L  stale audit artifacts: S12_PARAGRAPHS.md and visible_paragraphs/s12_performance.json reference removed prose
```

### Composite score breakdown (for ranking)

```
S12 composite: 6.0/10
  structural_pedagogy: 9/10    (I Do / We Do / You Do / selfCheck all populated; 24 We Do with DEFECT pattern; ethics spine)
  content_depth:        9/10   (CP-N1-C alignment, OWASP/RFC 7231 references, Haversine-as-signal framing)
  code_output_integrity: 3/10  (3 fabricated outputs in theory/I-Do; 4 We Do exercises with drift)
  spanish_grammar:      7/10   (clean overall; 6 recurring orthography patterns; ~17 minor rewrites)
  meta_leak:           10/10   (no user-facing leaks; only filename/audit-artifact residue)
  cognitive_load:       7/10   (3 run-ons; otherwise well-segmented)
```

---

## 10. Closing Statement

**This is the complete Explorer report for Section 12. Ready for the Fixer prompt.**

The Fixer should prioritize the P0 code/output integrity defects (Issues #1–#7) — these are the only findings that actively mislead a learner who runs the code. All other findings (P1–P4) are quality, orthography, and hygiene improvements that can be batched in a single Spanish-polish pass. The section's pedagogical bones are excellent; the defects are concentrated in a single root cause (an inconsistent pseudonymization pass that touched some `output:` strings and not others) plus a small set of recurring Spanish orthography slips. A focused Fixer pass should bring S12 from 6.0 to ~8.5/10.
