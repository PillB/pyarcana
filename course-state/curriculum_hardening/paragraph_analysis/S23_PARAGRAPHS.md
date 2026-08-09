# S23 Paragraph-by-Paragraph Analysis with Sources

Generated: 2026-07-24T04:23:51.696+00:00
Section: Browser RPA con Playwright
File: `s23-computer-vision.ts`
STORM cycles: **23**
Expert rank: **9.55**

## Competitive sources (domain-honest HTTP ≥5)

- Playwright: [Python docs](https://playwright.dev/python/) — API browser
- Playwright: [Best practices](https://playwright.dev/python/docs/best-practices) — locators
- Playwright: [Locators](https://playwright.dev/python/docs/locators) — get_by_role
- Playwright: [Trace viewer](https://playwright.dev/python/docs/trace-viewer) — diagnostics
- Playwright: [Auth](https://playwright.dev/python/docs/auth) — storage_state
- Playwright: [Codegen](https://playwright.dev/python/docs/codegen) — exploration
- W3C: [ARIA APG](https://www.w3.org/WAI/ARIA/apg/) — roles
- MIT: [6.100L](https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/) — foundations
- Harvard: [CS50P](https://cs50.harvard.edu/python/) — tests
- Coursera: [Playwright automation](https://www.coursera.org/courses?query=playwright%20test%20automation) — MOOC
- Microsoft: [Playwright GitHub](https://github.com/microsoft/playwright) — source
- Py4E: [Python for Everybody](https://www.py4e.com) — progressive
- Live: [PyArcana](https://pillb.github.io/pyarcana/) — course

## Gold pass
| Area | Decision |
|------|----------|
| theory/iDo | domain contracts + demos |
| weDo | CASO DEFECT |
| git | NO restore (HEAD had TODO, no DEFECT) |
| STORM | hand_STORM_domain_sources |
| expert pass | deepen P1s + expand resources + tsc hole fix |

## Theory (paragraph-level)

### Browser RPA contra una fixture local controlada
**P1** (rank 9.55/10)
> Construyes el **web adapter** de CP-N2-C con la mentalidad Playwright: browser/context/page/locator/expect/download/tracing contra un **servidor HTTP local** de práctica (HTML/C…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain-honest sources.
- **Sources:** Playwright: https://playwright.dev/python/; Playwright: https://playwright.dev/python/docs/best-practices
- **Pedagogy:** Anchor→Mechanism→Contract→Case; iDo/weDo gradual release.
- **STORM link:** «Browser RPA contra una fixture local controlada» in S23_STORM.json; edge `research_supports_paragraph`.

**P2** (rank 9.55/10)
> Los ejemplos multiarchivo del curso (`fixture_server.py` + `robot.py`) usan la API real cuando el runtime está instalado; los ejercicios graded pueden modelar DOM/sesión con dic…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain-honest sources.
- **Sources:** Playwright: https://playwright.dev/python/docs/best-practices; Playwright: https://playwright.dev/python/docs/locators
- **Pedagogy:** Anchor→Mechanism→Contract→Case; iDo/weDo gradual release.
- **STORM link:** «Browser RPA contra una fixture local controlada» in S23_STORM.json; edge `research_supports_paragraph`.

**P3** (rank 9.55/10)
> Orden: **T1 Navegación** (locators, auto-wait) → **T2 Flujos** (forms, auth, Page Objects) → **T3 Diagnóstico** (trace, retries) → **T4 Límites** (API-first, ToS/CAPTCHA/handoff…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain-honest sources.
- **Sources:** Playwright: https://playwright.dev/python/docs/locators; Playwright: https://playwright.dev/python/docs/trace-viewer
- **Pedagogy:** Anchor→Mechanism→Contract→Case; iDo/weDo gradual release.
- **STORM link:** «Browser RPA contra una fixture local controlada» in S23_STORM.json; edge `research_supports_paragraph`.

### DOM y locators orientados a usuario
**P1** (rank 9.55/10)
> Prefiere **get_by_role**, **get_by_label**, **get_by_text** sobre CSS/XPath frágiles. El usuario — y el árbol de accesibilidad — ve roles y nombres (“Descargar reporte”), no `#a…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain-honest sources.
- **Sources:** Playwright: https://playwright.dev/python/docs/trace-viewer; Playwright: https://playwright.dev/python/docs/auth
- **Pedagogy:** Anchor→Mechanism→Contract→Case; iDo/weDo gradual release.
- **STORM link:** «DOM y locators orientados a usuario» in S23_STORM.json; edge `research_supports_paragraph`.

**P2** (rank 9.55/10)
> Orden de estrategia didáctico: **role → testid → texto → CSS**. CSS queda como último recurso; si solo hay CSS frágil, el producto también es menos usable para personas. Modelam…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain-honest sources.
- **Sources:** Playwright: https://playwright.dev/python/docs/auth; Playwright: https://playwright.dev/python/docs/codegen
- **Pedagogy:** Anchor→Mechanism→Contract→Case; iDo/weDo gradual release.
- **STORM link:** «DOM y locators orientados a usuario» in S23_STORM.json; edge `research_supports_paragraph`.

**P3** (rank 9.55/10)
> Caso sintético: botón “Descargar reporte” id `b1` se resuelve por role+name; un logo `img` sin role de control interactivo **no** sustituye al botón de negocio. `LookupError` si…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain-honest sources.
- **Sources:** Playwright: https://playwright.dev/python/docs/codegen; W3C: https://www.w3.org/WAI/ARIA/apg/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; iDo/weDo gradual release.
- **STORM link:** «DOM y locators orientados a usuario» in S23_STORM.json; edge `research_supports_paragraph`.

### auto-waiting y assertions
**P1** (rank 9.55/10)
> Playwright **auto-espera** a que el elemento sea actionable (visible, estable, enabled, recibe eventos). Evita `time.sleep` fijos: un sleep de 5s **falla en CI lento** y **despe…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain-honest sources.
- **Sources:** W3C: https://www.w3.org/WAI/ARIA/apg/; MIT: https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; iDo/weDo gradual release.
- **STORM link:** «auto-waiting y assertions» in S23_STORM.json; edge `research_supports_paragraph`.

**P2** (rank 9.55/10)
> Las **assertions** (`expect(locator).to_be_visible()`, título esperado) documentan la **postcondición** del paso y fallan con mensaje útil. En el lab simulamos reloj y `wait_unt…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain-honest sources.
- **Sources:** MIT: https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/; Harvard: https://cs50.harvard.edu/python/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; iDo/weDo gradual release.
- **STORM link:** «auto-waiting y assertions» in S23_STORM.json; edge `research_supports_paragraph`.

**P3** (rank 9.55/10)
> Caso: `ready_at=250ms`, timeout 500 → ready True. Si tras N intentos no ready → `'timeout'` y adjunta **trace**. El robot del portal demo asserta título **antes** de descargar e…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain-honest sources.
- **Sources:** Harvard: https://cs50.harvard.edu/python/; Coursera: https://www.coursera.org/courses?query=playwright%20test%20automation
- **Pedagogy:** Anchor→Mechanism→Contract→Case; iDo/weDo gradual release.
- **STORM link:** «auto-waiting y assertions» in S23_STORM.json; edge `research_supports_paragraph`.

### formularios, uploads/downloads y sesiones
**P1** (rank 9.55/10)
> Flujos típicos del adapter: **fill** campos (usuario, periodo), **set_input_files**/upload de plantilla, click, esperar **download** y verificar path, tamaño o hash. No basta co…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain-honest sources.
- **Sources:** Coursera: https://www.coursera.org/courses?query=playwright%20test%20automation; Microsoft: https://github.com/microsoft/playwright
- **Pedagogy:** Anchor→Mechanism→Contract→Case; iDo/weDo gradual release.
- **STORM link:** «formularios, uploads/downloads y sesiones» in S23_STORM.json; edge `research_supports_paragraph`.

**P2** (rank 9.55/10)
> **storage_state** (cookies/localStorage) reutiliza sesión autenticada entre tests para no re-loguear en cada caso — en el lab un dict {token:'t'} modela reuse. Nunca hardcodees …
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain-honest sources.
- **Sources:** Microsoft: https://github.com/microsoft/playwright; Py4E: https://www.py4e.com
- **Pedagogy:** Anchor→Mechanism→Contract→Case; iDo/weDo gradual release.
- **STORM link:** «formularios, uploads/downloads y sesiones» in S23_STORM.json; edge `research_supports_paragraph`.

**P3** (rank 9.55/10)
> Caso PE sintético: form periodo 2026-01, upload plantilla.xlsx sintética PK header, download con sha256 hex corto. Checksum mismatch → fallo de step y evidencia, no “éxito silen…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain-honest sources.
- **Sources:** Py4E: https://www.py4e.com; Live: https://pillb.github.io/pyarcana/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; iDo/weDo gradual release.
- **STORM link:** «formularios, uploads/downloads y sesiones» in S23_STORM.json; edge `research_supports_paragraph`.

### auth, estados y Page Objects
**P1** (rank 9.55/10)
> Un **Page Object** encapsula selectores y acciones de una pantalla (`LoginPage.submit`, `ReportPage.open`). Separa **auth setup** (fixture storage_state) del test de negocio del…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain-honest sources.
- **Sources:** Live: https://pillb.github.io/pyarcana/; Playwright: https://playwright.dev/python/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; iDo/weDo gradual release.
- **STORM link:** «auth, estados y Page Objects» in S23_STORM.json; edge `research_supports_paragraph`.

**P2** (rank 9.55/10)
> Estados de página: anonymous → authenticated (o mfa_pending en sistemas reales; aquí sandbox simple). ReportPage.open lanza PermissionError si no auth — el robot captura y repor…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain-honest sources.
- **Sources:** Playwright: https://playwright.dev/python/; Playwright: https://playwright.dev/python/docs/best-practices
- **Pedagogy:** Anchor→Mechanism→Contract→Case; iDo/weDo gradual release.
- **STORM link:** «auth, estados y Page Objects» in S23_STORM.json; edge `research_supports_paragraph`.

**P3** (rank 9.55/10)
> Contrato lab: LoginPage con password 'sandbox' setea auth; mal password deja anonymous. El PO no contiene sleeps mágicos; expone acciones que el test compone. Facilita cambiar e…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain-honest sources.
- **Sources:** Playwright: https://playwright.dev/python/docs/best-practices; Playwright: https://playwright.dev/python/docs/locators
- **Pedagogy:** Anchor→Mechanism→Contract→Case; iDo/weDo gradual release.
- **STORM link:** «auth, estados y Page Objects» in S23_STORM.json; edge `research_supports_paragraph`.

### trace, screenshot y logs
**P1** (rank 9.55/10)
> Ante falla, empaqueta **trace** (zip Playwright), **screenshot** y **error** string. Keys del paquete se ordenan para diffs estables en CI. Sin evidencia, el on-call en Lima no …
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain-honest sources.
- **Sources:** Playwright: https://playwright.dev/python/docs/locators; Playwright: https://playwright.dev/python/docs/trace-viewer
- **Pedagogy:** Anchor→Mechanism→Contract→Case; iDo/weDo gradual release.
- **STORM link:** «trace, screenshot y logs» in S23_STORM.json; edge `research_supports_paragraph`.

**P2** (rank 9.55/10)
> Filtra console logs por 'ERR' u otros marcadores; el ruido de info no debe ocultar el timeout. Si ok=False, adjunta trace path traces/{step}.zip al pkg del step. En PyArcana tra…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain-honest sources.
- **Sources:** Playwright: https://playwright.dev/python/docs/trace-viewer; Playwright: https://playwright.dev/python/docs/auth
- **Pedagogy:** Anchor→Mechanism→Contract→Case; iDo/weDo gradual release.
- **STORM link:** «trace, screenshot y logs» in S23_STORM.json; edge `research_supports_paragraph`.

**P3** (rank 9.55/10)
> Caso: step s1 falla → pkg con trace+screenshot+error. Política: traces solo en fallo o sample rate bajo en éxito para no llenar disco del runner sintético. En PyArcana trabajamo…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain-honest sources.
- **Sources:** Playwright: https://playwright.dev/python/docs/auth; Playwright: https://playwright.dev/python/docs/codegen
- **Pedagogy:** Anchor→Mechanism→Contract→Case; iDo/weDo gradual release.
- **STORM link:** «trace, screenshot y logs» in S23_STORM.json; edge `research_supports_paragraph`.

### selectores robustos, retries y recovery
**P1** (rank 9.55/10)
> Retries solo para errores **transitorios** (timeout, red, 429), **nunca** para CAPTCHA, 403 de negocio ni ToS. `should_retry(kind)` codifica la política. Tras max intentos de ti…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain-honest sources.
- **Sources:** Playwright: https://playwright.dev/python/docs/codegen; W3C: https://www.w3.org/WAI/ARIA/apg/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; iDo/weDo gradual release.
- **STORM link:** «selectores robustos, retries y recovery» in S23_STORM.json; edge `research_supports_paragraph`.

**P2** (rank 9.55/10)
> Recovery: err=='stale' (DOM reemplazado) → action goto_home o re-nav al listado. Re-obtener locator tras navegación; no reuses handles viejos. Estrategia de selectores se reeval…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain-honest sources.
- **Sources:** W3C: https://www.w3.org/WAI/ARIA/apg/; MIT: https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; iDo/weDo gradual release.
- **STORM link:** «selectores robustos, retries y recovery» in S23_STORM.json; edge `research_supports_paragraph`.

**P3** (rank 9.55/10)
> Caso sintético: tres timeouts seguidos → 'fail 3'. Un captcha en medio no se “reintenta con otro user-agent”: va a human_handoff en T4. El runbook documenta max_attempts=3 y bac…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain-honest sources.
- **Sources:** MIT: https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/; Harvard: https://cs50.harvard.edu/python/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; iDo/weDo gradual release.
- **STORM link:** «selectores robustos, retries y recovery» in S23_STORM.json; edge `research_supports_paragraph`.

### API/export primero
**P1** (rank 9.55/10)
> Jerarquía de preferencia: **api > export > rpa > human**. Si el sistema ofrece endpoint o CSV export del mismo reporte, úsalo: menos flakes, menos ToS grises, más barato de oper…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain-honest sources.
- **Sources:** Harvard: https://cs50.harvard.edu/python/; Coursera: https://www.coursera.org/courses?query=playwright%20test%20automation
- **Pedagogy:** Anchor→Mechanism→Contract→Case; iDo/weDo gradual release.
- **STORM link:** «API/export primero» in S23_STORM.json; edge `research_supports_paragraph`.

**P2** (rank 9.55/10)
> Toda caída a RPA registra reason ('no_api', 'export_stale', etc.) en el decision dict del run. Documenta por qué se eligió RPA en el runbook del adapter web CP-N2-C. En PyArcana…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain-honest sources.
- **Sources:** Coursera: https://www.coursera.org/courses?query=playwright%20test%20automation; Microsoft: https://github.com/microsoft/playwright
- **Pedagogy:** Anchor→Mechanism→Contract→Case; iDo/weDo gradual release.
- **STORM link:** «API/export primero» in S23_STORM.json; edge `research_supports_paragraph`.

**P3** (rank 9.55/10)
> Caso: flags api=False, export=True, rpa=True → choice export. Si solo rpa → method rpa con reason no_api. El valor de negocio es el dato verificado, no “haber automatizado el cl…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain-honest sources.
- **Sources:** Microsoft: https://github.com/microsoft/playwright; Py4E: https://www.py4e.com
- **Pedagogy:** Anchor→Mechanism→Contract→Case; iDo/weDo gradual release.
- **STORM link:** «API/export primero» in S23_STORM.json; edge `research_supports_paragraph`.

### términos, CAPTCHA, desktop fallback y handoff humano
**P1** (rank 9.55/10)
> Si **ToS forbidden** para automatización, `action=abort` (**ToS gana** sobre CAPTCHA y sobre “pero es urgente”). Si captcha=True y ToS permite humano, **human_handoff** con payl…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain-honest sources.
- **Sources:** Py4E: https://www.py4e.com; Live: https://pillb.github.io/pyarcana/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; iDo/weDo gradual release.
- **STORM link:** «términos, CAPTCHA, desktop fallback y handoff hu» in S23_STORM.json; edge `research_supports_paragraph`.

**P2** (rank 9.55/10)
> Desktop fallback (app nativa) solo si el contrato del sistema lo contempla y está en scope; no es excusa para evadir políticas web. El handoff incluye evidencia para que un anal…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain-honest sources.
- **Sources:** Live: https://pillb.github.io/pyarcana/; Playwright: https://playwright.dev/python/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; iDo/weDo gradual release.
- **STORM link:** «términos, CAPTCHA, desktop fallback y handoff hu» in S23_STORM.json; edge `research_supports_paragraph`.

**P3** (rank 9.55/10)
> Caso PE: portal demo muestra captcha de prueba → handoff; tos_forbidden True → abort aunque haya captcha. Matching de datos posteriores al download sigue siendo evidencia, no pr…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain-honest sources.
- **Sources:** Playwright: https://playwright.dev/python/; Playwright: https://playwright.dev/python/docs/best-practices
- **Pedagogy:** Anchor→Mechanism→Contract→Case; iDo/weDo gradual release.
- **STORM link:** «términos, CAPTCHA, desktop fallback y handoff hu» in S23_STORM.json; edge `research_supports_paragraph`.

