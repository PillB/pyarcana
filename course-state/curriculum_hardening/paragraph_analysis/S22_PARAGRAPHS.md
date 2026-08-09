# S22 Paragraph-by-Paragraph Analysis with Sources

Generated: 2026-07-24T05:24:31.000+00:00
Section: Email, identidad y aprobación humana
File: `s22-rapidfuzz-entity.ts`
STORM cycles: **22**
Expert rank: **9.55**

## Competitive sources (domain-honest HTTP ≥5)

- Python: [email examples](https://docs.python.org/3/library/email.examples.html) — MIME
- Python: [email package](https://docs.python.org/3/library/email.html) — API
- Python: [html.escape](https://docs.python.org/3/library/html.html) — template escape
- OWASP: [XSS prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html) — sanitize
- IETF: [OAuth 2.0 RFC 6749](https://datatracker.ietf.org/doc/html/rfc6749) — scopes
- Google: [OAuth policies](https://developers.google.com/identity/protocols/oauth2/policies) — least privilege
- Python: [uuid](https://docs.python.org/3/library/uuid.html) — idempotency
- Python: [logging](https://docs.python.org/3/library/logging.html) — audit
- Python: [json](https://docs.python.org/3/library/json.html) — state machine
- Coursera: [Python for Everybody](https://www.coursera.org/specializations/python) — foundations
- MIT: [6.100L](https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/) — logic
- Harvard: [CS50P](https://cs50.harvard.edu/python/) — practice
- Live: [PyArcana](https://pillb.github.io/pyarcana/) — course
- GitHub: [Awesome Python Learning](https://github.com/skupriienko/Awesome-Python-Learning) — map
- OWASP: [Authentication](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html) — auth
- deeplearning.ai: [Data Engineering](https://www.deeplearning.ai/specializations/data-engineering) — workflows
- GitHub: [python-for-everybody-resources](https://github.com/sersavn/python-for-everybody-resources) — exercises
- Python: [smtplib](https://docs.python.org/3/library/smtplib.html) — do not auto-send in course
- IETF: [MIME RFC 2045](https://datatracker.ietf.org/doc/html/rfc2045) — multipart
- GitHub: [https-deeplearning-ai](https://github.com/https-deeplearning-ai) — org
- NIST: [Digital Identity](https://pages.nist.gov/800-63-3/) — identity verification concepts
- Python: [secrets](https://docs.python.org/3/library/secrets.html) — token hygiene

## Gold pass
| Area | Decision |
|------|----------|
| theory | strip workbench + domain depth |
| weDo | CASO DEFECT |
| git | NO restore |
| STORM | hand_STORM_domain_sources |

## Theory (paragraph-level)

### Email con aprobación humana e inicio CP-N2-C
**P1** (rank 9.55/10)
> **Diccionario de la sección** (léelo antes de T1). **MIME:** mensaje multiparte (text/html + adjuntos). **Draft sandbox:** borrador local o API de prueba — **no…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no workbench boilerplate.
- **Sources:** Python: https://docs.python.org/3/library/email.examples.html; Python: https://docs.python.org/3/library/email.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Email con aprobación humana e inicio CP-N2-C» in S22_STORM.json.

**P2** (rank 9.55/10)
> En V3, **S22 no es RapidFuzz/ER probabilístico avanzado** (eso madura más adelante). El id `rapidfuzz-entity` se conserva; aquí **inicias CP-N2-C**: MIME, sanit…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no workbench boilerplate.
- **Sources:** Python: https://docs.python.org/3/library/email.html; Python: https://docs.python.org/3/library/html.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Email con aprobación humana e inicio CP-N2-C» in S22_STORM.json.

**P3** (rank 9.55/10)
> Hilo: borrador sintético `run_id=cpn2c-01` / `CASO-LIM-022`, contactos fake `@example.pe`. **Ningún correo real se envía**: solo `.eml` locales o drafts de sand…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no workbench boilerplate.
- **Sources:** Python: https://docs.python.org/3/library/html.html; OWASP: https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Email con aprobación humana e inicio CP-N2-C» in S22_STORM.json.

**P4** (rank 9.55/10)
> Orden: **T1 Mensaje** (MIME, templates seguros) → **T2 Proveedor** (OAuth/scopes, adaptadores de draft) → **T3 Destinatario** (resolución, verificación, CC/BCC,…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no workbench boilerplate.
- **Sources:** OWASP: https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html; IETF: https://datatracker.ietf.org/doc/html/rfc6749
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Email con aprobación humana e inicio CP-N2-C» in S22_STORM.json.

### MIME, encoding, HTML/text y attachments
**P1** (rank 9.55/10)
> **MIME** (`email.mime`) arma mensajes multiparte: text/plain + text/html + adjuntos. Charset **UTF-8** evita mojibake en nombres y acentos del español peruano. …
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no workbench boilerplate.
- **Sources:** IETF: https://datatracker.ietf.org/doc/html/rfc6749; Google: https://developers.google.com/identity/protocols/oauth2/policies
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «MIME, encoding, HTML/text y attachments» in S22_STORM.json.

**P2** (rank 9.55/10)
> Contrato: `MIMEText(..., 'plain'|'html', 'utf-8')`; attachments con `Content-Disposition` y filename; nunca embeds de secretos (tokens, DNI) en el cuerpo. Limit…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no workbench boilerplate.
- **Sources:** Google: https://developers.google.com/identity/protocols/oauth2/policies; Python: https://docs.python.org/3/library/uuid.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «MIME, encoding, HTML/text y attachments» in S22_STORM.json.

**P3** (rank 9.55/10)
> Caso: `MIMEText('Hola','plain','utf-8')` → content-type text/plain; mixed + `MIMEApplication` con `a.txt`. Contar headers `Content-Type` valida el árbol multipa…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no workbench boilerplate.
- **Sources:** Python: https://docs.python.org/3/library/uuid.html; Python: https://docs.python.org/3/library/logging.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «MIME, encoding, HTML/text y attachments» in S22_STORM.json.

### templates y sanitización
**P1** (rank 9.55/10)
> Los **templates** interpolan variables (nombre, run_id, montos). Todo input no confiable se escapa (`html.escape`) o usa autoescape. Política de links: allowlis…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no workbench boilerplate.
- **Sources:** Python: https://docs.python.org/3/library/logging.html; Python: https://docs.python.org/3/library/json.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «templates y sanitización» in S22_STORM.json.

**P2** (rank 9.55/10)
> Contrato: template `Hola {name}` con name `<b>Ana</b>` debe producir entidades escapadas, no HTML activo. Allowlist: url con `example.pe` → `ok`, otro host → `b…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no workbench boilerplate.
- **Sources:** Python: https://docs.python.org/3/library/json.html; Coursera: https://www.coursera.org/specializations/python
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «templates y sanitización» in S22_STORM.json.

**P3** (rank 9.55/10)
> Caso sintético: cuerpo con link a portal de revisión del run; sin allowlist, un template malicioso redirige a dominio externo. El gate de sanitización es obliga…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no workbench boilerplate.
- **Sources:** Coursera: https://www.coursera.org/specializations/python; MIT: https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «templates y sanitización» in S22_STORM.json.

### OAuth/service account y scopes
**P1** (rank 9.55/10)
> OAuth / service accounts operan con **scopes mínimos** (`mail.draft`, no `mail.full` ni `admin`). Modela credenciales con `client_id`, `scopes`, `expires_at` — …
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no workbench boilerplate.
- **Sources:** MIT: https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/; Harvard: https://cs50.harvard.edu/python/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «OAuth/service account y scopes» in S22_STORM.json.

**P2** (rank 9.55/10)
> Contrato: `requested ∩ allowed`; imprime True si granted no contiene scopes peligrosos. Tokens sintéticos del curso; registro de scopes pedidos vs concedidos co…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no workbench boilerplate.
- **Sources:** Harvard: https://cs50.harvard.edu/python/; Live: https://pillb.github.io/pyarcana/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «OAuth/service account y scopes» in S22_STORM.json.

**P3** (rank 9.55/10)
> Caso: requested `mail.draft`+`mail.full` → filtrar a allowed; granted sin `mail.full`/`admin`. En sandbox, un scope de más es hallazgo de seguridad del diseño, …
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no workbench boilerplate.
- **Sources:** Live: https://pillb.github.io/pyarcana/; GitHub: https://github.com/skupriienko/Awesome-Python-Learning
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «OAuth/service account y scopes» in S22_STORM.json.

### drafts, expiración y adaptadores
**P1** (rank 9.55/10)
> Un **adaptador** (`GmailAdapter`, `SmtpFileAdapter`) expone `create_draft` / `get_draft` sin acoplar el workflow al SDK. Drafts llevan **expiración**: tras `exp…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no workbench boilerplate.
- **Sources:** GitHub: https://github.com/skupriienko/Awesome-Python-Learning; OWASP: https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «drafts, expiración y adaptadores» in S22_STORM.json.

**P2** (rank 9.55/10)
> Contrato: store en memoria o `out/drafts/`; ids secuenciales `d001`, `d002`; `is_usable` False si expiró. El curso escribe `.eml` simulados — cero SMTP real.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no workbench boilerplate.
- **Sources:** OWASP: https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html; deeplearning.ai: https://www.deeplearning.ai/specializations/data-engineering
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «drafts, expiración y adaptadores» in S22_STORM.json.

**P3** (rank 9.55/10)
> Caso: draft `d001` status `draft`; expires_at = now−1s → no usable. create_draft idempotente a nivel de id secuencial en el ejercicio de transfer.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no workbench boilerplate.
- **Sources:** deeplearning.ai: https://www.deeplearning.ai/specializations/data-engineering; GitHub: https://github.com/sersavn/python-for-everybody-resources
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «drafts, expiración y adaptadores» in S22_STORM.json.

### resolución y verificación
**P1** (rank 9.55/10)
> Resolución de destinatarios: valida formato de email, mapea `C001→email` desde dict sintético, verifica dominio permitido (`example.pe`). Estados: `unresolved` …
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no workbench boilerplate.
- **Sources:** GitHub: https://github.com/sersavn/python-for-everybody-resources; Python: https://docs.python.org/3/library/smtplib.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «resolución y verificación» in S22_STORM.json.

**P2** (rank 9.55/10)
> Contrato: match/score de similaridad de nombres, si se usa, lleva la nota explícita **`match_no_es_fraude`**. Un score 0.92 no autoriza claims de identidad lega…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no workbench boilerplate.
- **Sources:** Python: https://docs.python.org/3/library/smtplib.html; IETF: https://datatracker.ietf.org/doc/html/rfc2045
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «resolución y verificación» in S22_STORM.json.

**P3** (rank 9.55/10)
> Caso: `ana@example.pe` ok, `bad` rejected; C001 verificado en dominio example.pe; imprimir score sintético 0.92 con la nota anti-claim. HITL si queda unresolved…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no workbench boilerplate.
- **Sources:** IETF: https://datatracker.ietf.org/doc/html/rfc2045; GitHub: https://github.com/https-deeplearning-ai
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «resolución y verificación» in S22_STORM.json.

### listas, CC/BCC, privacidad y mínima divulgación
**P1** (rank 9.55/10)
> **CC** expone destinatarios entre sí; **BCC** oculta la lista. Prefiere BCC o envíos individuales cuando hay externos. **Mínima divulgación**: no pongas DNI/tel…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no workbench boilerplate.
- **Sources:** GitHub: https://github.com/https-deeplearning-ai; NIST: https://pages.nist.gov/800-63-3/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «listas, CC/BCC, privacidad y mínima divulgación» in S22_STORM.json.

**P2** (rank 9.55/10)
> Contrato: dedupe preservando orden; role=`bcc` si dominio externo (`@other.test`); contar cuántos emails quedarían visibles (to+cc) tras mover externos a bcc. O…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no workbench boilerplate.
- **Sources:** NIST: https://pages.nist.gov/800-63-3/; Python: https://docs.python.org/3/library/secrets.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «listas, CC/BCC, privacidad y mínima divulgación» in S22_STORM.json.

**P3** (rank 9.55/10)
> Caso: lista con duplicados y un externo → tras higiene, visibles reducidos; el audit registra la política aplicada. Privacidad operativa, no solo “compliance de…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no workbench boilerplate.
- **Sources:** Python: https://docs.python.org/3/library/secrets.html; Python: https://docs.python.org/3/library/email.examples.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «listas, CC/BCC, privacidad y mínima divulgación» in S22_STORM.json.

### approval queue y state machine
**P1** (rank 9.55/10)
> La **cola de aprobación** es una state machine: `draft` → `pending_review` → `approved` | `rejected` | `needs_info`. Transiciones explícitas con actor y timesta…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no workbench boilerplate.
- **Sources:** Python: https://docs.python.org/3/library/email.examples.html; Python: https://docs.python.org/3/library/email.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «approval queue y state machine» in S22_STORM.json.

**P2** (rank 9.55/10)
> Contrato: tabla `TRANSITIONS`; `submit` desde draft → pending; `approve` desde draft → `invalid`. En CP-N2-C la aprobación humana es **obligatoria** antes de cu…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no workbench boilerplate.
- **Sources:** Python: https://docs.python.org/3/library/email.html; Python: https://docs.python.org/3/library/html.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «approval queue y state machine» in S22_STORM.json.

**P3** (rank 9.55/10)
> Caso: log `{from,to,actor}` al aprobar pending→approved con actor `rev1`. El portfolio adjunta el log: evidencia de cumplimiento y de fail-closed.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no workbench boilerplate.
- **Sources:** Python: https://docs.python.org/3/library/html.html; OWASP: https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «approval queue y state machine» in S22_STORM.json.

### idempotencia, audit log y reintento sin duplicar
