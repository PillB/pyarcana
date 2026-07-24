import type { CourseSection } from '../../types'

export const section22: CourseSection = {
  id: "rapidfuzz-entity",
  index: 22,
  title: "Email, identidad y aprobación humana",
  shortTitle: "Email y aprobación",
  tagline: "crea borradores en sandbox o archivos .eml; ningún correo real se envía automáticamente y todo destinatario requiere confirmación",
  estimatedHours: 19,
  level: "Competente",
  phase: 1,
  icon: "GitCompare",
  accentColor: "bg-gradient-to-br from-blue-500 to-indigo-600",
  jobRelevance:
    "En operaciones y RPA, un pipeline de correo seguro separa **borrador, aprobación y envío**. S22 inicia **CP-N2-C** con MIME, scopes mínimos, resolución de destinatarios y cola de aprobación. Coincidir emails/nombres es evidencia de entrega, **no** prueba de fraude ni parentesco.",
  learningOutcomes: [
    { text: "Construir mensajes MIME con encoding y attachments" },
    { text: "Sanitizar templates HTML de correo" },
    { text: "Configurar OAuth/service account con scopes mínimos" },
    { text: "Crear drafts vía adaptadores con expiración" },
    { text: "Resolver y verificar destinatarios" },
    { text: "Aplicar privacidad y mínima divulgación en listas" },
    { text: "Implementar approval queue y state machine" },
    { text: "Garantizar idempotencia, audit log y reintentos seguros" },
  ],
  theory: [
    {
      heading: "Email con aprobación humana e inicio CP-N2-C",
      paragraphs: [
        "**Diccionario de la sección** (léelo antes de T1). **MIME:** mensaje multiparte (text/html + adjuntos). **Draft sandbox:** borrador local o API de prueba — **no envío real**. **Scopes mínimos:** permisos OAuth justos. **Resolución de destinatario:** mapear id → email verificado. **Approval queue:** cola de revisión humana. **State machine:** draft → pending → approved/rejected → sent/expired. **Idempotency key:** evita duplicar envíos al reintentar. **Fail-closed:** sin aprobación humana no hay envío. **Matching ≠ fraude:** coincidir contactos no prueba parentesco ni culpa.",
        "En V3, **S22 no es RapidFuzz/ER probabilístico avanzado** (eso madura más adelante). El id `rapidfuzz-entity` se conserva; aquí **inicias CP-N2-C**: MIME, sanitización HTML, scopes mínimos, drafts con expiración, resolución de destinatarios sintéticos, privacidad de listas, cola de aprobación humana e idempotencia.",
        "Hilo: borrador sintético `run_id=cpn2c-01` / `CASO-LIM-022`, contactos fake `@example.pe`. **Ningún correo real se envía**: solo `.eml` locales o drafts de sandbox. Matching de contactos es para **entrega correcta**, nunca para inferir fraude, parentesco o culpabilidad.",
        "Orden: **T1 Mensaje** (MIME, templates seguros) → **T2 Proveedor** (OAuth/scopes, adaptadores de draft) → **T3 Destinatario** (resolución, verificación, CC/BCC, mínima divulgación) → **T4 Workflow** (state machine de aprobación, audit log, reintento sin duplicar). Fail-closed sin aprobación humana.",
      ],
      code: {
        language: 'python',
        title: "s22_map_contract.py",
        code: `def section_contract():
    return {
        "case": "CASO-LIM-022",
        "gates": ["draft_only_no_auto_send", "human_approval", "idempotent_retry", "synthetic_recipients"],
        "rapidfuzz_er_topic": False,
        "auto_send_ok": False,
    }

c = section_contract()
print("case", c["case"])
print("rapidfuzz_er_topic", c["rapidfuzz_er_topic"])
print("auto_send_ok", c["auto_send_ok"])
`,
        output: `case CASO-LIM-022
rapidfuzz_er_topic False
auto_send_ok False`,
      },
      callout: {
        type: "info",
        title: "Límite operativo",
        content:
          "Solo se crean `.eml` locales o drafts de sandbox con datos sintéticos; ninguna ruta de la lección envía correo.",
      },
    },
    {
      heading: "MIME, encoding, HTML/text y attachments",
      subtopicId: "S22-T1-A",
      paragraphs: [
        "**MIME** (`email.mime`) arma mensajes multiparte: text/plain + text/html + adjuntos. Charset **UTF-8** evita mojibake en nombres y acentos del español peruano. `MIMEMultipart('alternative')` ofrece ambas representaciones; el cliente elige.",
        "Contrato: `MIMEText(..., 'plain'|'html', 'utf-8')`; attachments con `Content-Disposition` y filename; nunca embeds de secretos (tokens, DNI) en el cuerpo. Limita tamaño de adjuntos sintéticos y márcalos como demo.",
        "Caso: `MIMEText('Hola','plain','utf-8')` → content-type text/plain; mixed + `MIMEApplication` con `a.txt`. Contar headers `Content-Type` valida el árbol multiparte en weDo.",
      ],
      code: {
        language: 'python',
        title: "mime_build.py",
        code: `def s22_th_1():
    from email.mime.multipart import MIMEMultipart
    from email.mime.text import MIMEText
    from email.mime.application import MIMEApplication

    msg = MIMEMultipart("mixed")
    msg["Subject"] = "Borrador sintético CP-N2-C"
    msg["From"] = "noreply@example.pe"
    msg["To"] = "revisora@example.pe"
    alt = MIMEMultipart("alternative")
    alt.attach(MIMEText("Hola (texto plano)", "plain", "utf-8"))
    alt.attach(MIMEText("<p>Hola <b>HTML</b></p>", "html", "utf-8"))
    msg.attach(alt)
    att = MIMEApplication(b"run_id=cpn2c-01\\n", Name="meta.txt")
    att["Content-Disposition"] = 'attachment; filename="meta.txt"'
    msg.attach(att)
    raw = msg.as_string()
    print("parts", raw.count("Content-Type:"))
    print("charset_ok", "charset=\\"utf-8\\"" in raw or "charset=utf-8" in raw.lower())
    print("has_attachment", "meta.txt" in raw)

s22_th_1()`,
        output: `parts 5
charset_ok True
has_attachment True`,
      },
      callout: {
        type: "tip",
        title: "Siempre text + HTML",
        content:
          "Incluye plain text: muchos clientes y filtros anti-spam lo exigen.",
      },
    },
    {
      heading: "templates y sanitización",
      subtopicId: "S22-T1-B",
      paragraphs: [
        "Los **templates** interpolan variables (nombre, run_id, montos). Todo input no confiable se escapa (`html.escape`) o usa autoescape. Política de links: allowlist de dominios (`example.pe`) o rutas relativas; bloquea `javascript:` y `data:`.",
        "Contrato: template `Hola {name}` con name `<b>Ana</b>` debe producir entidades escapadas, no HTML activo. Allowlist: url con `example.pe` → `ok`, otro host → `blocked`. XSS en correo es riesgo real de phishing interno.",
        "Caso sintético: cuerpo con link a portal de revisión del run; sin allowlist, un template malicioso redirige a dominio externo. El gate de sanitización es obligatorio antes de encolar aprobación.",
      ],
      code: {
        language: 'python',
        title: "sanitize_template.py",
        code: `def s22_th_2():
    import html
    import re

    def sanitize_html(fragment: str, allowed_hosts=None) -> str:
        allowed_hosts = allowed_hosts or {"example.pe"}
        safe = html.escape(fragment)
        def repl(m):
            url = m.group(1)
            if re.match(r"^https?://", url):
                host = re.sub(r"^https?://", "", url).split("/")[0]
                if host in allowed_hosts:
                    return f'<a href="{url}">enlace</a>'
            return "[link bloqueado]"
        return re.sub(r"\\{\\{link:([^}]+)\\}\\}", repl, safe)

    user = '<script>alert(1)</script> {{link:https://example.pe/r}} {{link:javascript:alert(1)}}'
    print(sanitize_html(user))

s22_th_2()`,
        output: `&lt;script&gt;alert(1)&lt;/script&gt; <a href="https://example.pe/r">enlace</a> [link bloqueado]`,
      },
      callout: {
        type: "danger",
        title: "HTML de usuario = XSS",
        content:
          "Nunca marques como safe un string de destinatario o de un documento OCR sin sanitizar.",
      },
    },
    {
      heading: "OAuth/service account y scopes",
      subtopicId: "S22-T2-A",
      paragraphs: [
        "OAuth / service accounts operan con **scopes mínimos** (`mail.draft`, no `mail.full` ni `admin`). Modela credenciales con `client_id`, `scopes`, `expires_at` — **nunca** commits de secretos al repo del portfolio.",
        "Contrato: `requested ∩ allowed`; imprime True si granted no contiene scopes peligrosos. Tokens sintéticos del curso; registro de scopes pedidos vs concedidos como evidencia de least privilege.",
        "Caso: requested `mail.draft`+`mail.full` → filtrar a allowed; granted sin `mail.full`/`admin`. En sandbox, un scope de más es hallazgo de seguridad del diseño, no “detalle de config”.",
      ],
      code: {
        language: 'python',
        title: "scopes_sandbox.py",
        code: `def s22_th_3():
    from datetime import datetime, timezone, timedelta

    # configuración sintética — no son secretos reales
    cfg = {
        "client_id": "sandbox-client-001",
        "requested_scopes": ["mail.draft", "mail.readonly"],
        "granted_scopes": ["mail.draft"],
        "expires_at": (datetime.now(timezone.utc) + timedelta(hours=1)).isoformat(),
    }
    least_ok = set(cfg["granted_scopes"]).issubset({"mail.draft", "mail.readonly", "mail.send"})
    print("client_id", cfg["client_id"])
    print("granted", cfg["granted_scopes"])
    print("missing_readonly", "mail.readonly" in cfg["requested_scopes"] and "mail.readonly" not in cfg["granted_scopes"])
    print("least_privilege_ok", least_ok and "mail.full" not in cfg["granted_scopes"])

s22_th_3()`,
        output: `client_id sandbox-client-001
granted ['mail.draft']
missing_readonly True
least_privilege_ok True`,
      },
      callout: {
        type: "warning",
        title: "Scopes y envío",
        content:
          "Si el producto solo crea drafts, no pidas scope de send. El envío real es otra decisión con aprobación humana.",
      },
    },
    {
      heading: "drafts, expiración y adaptadores",
      subtopicId: "S22-T2-B",
      paragraphs: [
        "Un **adaptador** (`GmailAdapter`, `SmtpFileAdapter`) expone `create_draft` / `get_draft` sin acoplar el workflow al SDK. Drafts llevan **expiración**: tras `expires_at` no se promueven a envío sin regenerar y reaprobar.",
        "Contrato: store en memoria o `out/drafts/`; ids secuenciales `d001`, `d002`; `is_usable` False si expiró. El curso escribe `.eml` simulados — cero SMTP real.",
        "Caso: draft `d001` status `draft`; expires_at = now−1s → no usable. create_draft idempotente a nivel de id secuencial en el ejercicio de transfer.",
      ],
      code: {
        language: 'python',
        title: "draft_adapter.py",
        code: `def s22_th_4():
    from datetime import datetime, timezone, timedelta
    from email.mime.text import MIMEText

    class FileDraftAdapter:
        def __init__(self):
            self.store = {}
        def create_draft(self, to, subject, body, ttl_hours=24):
            draft_id = f"d{len(self.store)+1:03d}"
            msg = MIMEText(body, "plain", "utf-8")
            msg["To"], msg["Subject"] = to, subject
            exp = datetime.now(timezone.utc) + timedelta(hours=ttl_hours)
            self.store[draft_id] = {"raw": msg.as_string(), "expires_at": exp, "status": "draft"}
            return draft_id
        def is_usable(self, draft_id, now=None):
            now = now or datetime.now(timezone.utc)
            d = self.store[draft_id]
            return d["status"] == "draft" and now < d["expires_at"]

    ad = FileDraftAdapter()
    did = ad.create_draft("revisora@example.pe", "Informe sintético", "run_id=cpn2c-01", ttl_hours=1)
    print("draft_id", did)
    print("usable", ad.is_usable(did))
    print("bytes", len(ad.store[did]["raw"]))

s22_th_4()`,
        output: `draft_id d001
usable True
bytes 184`,
      },
      callout: {
        type: "tip",
        title: "Adapter pattern",
        content:
          "El dominio llama create_draft; el adaptador decide Gmail API vs archivo .eml local.",
      },
    },
    {
      heading: "resolución y verificación",
      subtopicId: "S22-T3-A",
      paragraphs: [
        "Resolución de destinatarios: valida formato de email, mapea `C001→email` desde dict sintético, verifica dominio permitido (`example.pe`). Estados: `unresolved` → `candidate` → `verified` | `rejected`.",
        "Contrato: match/score de similaridad de nombres, si se usa, lleva la nota explícita **`match_no_es_fraude`**. Un score 0.92 no autoriza claims de identidad legal ni parentesco; solo prioriza revisión de entrega.",
        "Caso: `ana@example.pe` ok, `bad` rejected; C001 verificado en dominio example.pe; imprimir score sintético 0.92 con la nota anti-claim. HITL si queda unresolved.",
      ],
      code: {
        language: 'python',
        title: "resolve_verify.py",
        code: `def s22_th_5():
    import re

    DIRECTORY = {
        "C001": {"name": "Ana Rojas", "email": "ana.rojas@example.pe", "status": "active"},
        "C002": {"name": "Luis Quispe", "email": "lquispe@ejemplo.invalid", "status": "active"},
    }
    ALLOW = {"example.pe"}

    def resolve(contact_id):
        return DIRECTORY.get(contact_id)

    def verify(rec):
        if not rec or rec["status"] != "active":
            return "rejected", "missing_or_inactive"
        email = rec["email"]
        if not re.match(r"^[^@]+@[^@]+\\.[^@]+$", email):
            return "rejected", "bad_format"
        domain = email.split("@")[1]
        if domain not in ALLOW:
            return "rejected", "domain_not_allowed"
        return "verified", "ok"

    for cid in ("C001", "C002", "C999"):
        rec = resolve(cid)
        st, reason = verify(rec) if rec else ("unresolved", "not_found")
        print(cid, st, reason, None if not rec else rec["email"])
    print("note: match≠fraude")

s22_th_5()`,
        output: `C001 verified ok ana.rojas@example.pe
C002 rejected domain_not_allowed lquispe@ejemplo.invalid
C999 unresolved not_found None
note: match≠fraude`,
      },
      callout: {
        type: "danger",
        title: "Matching ≠ fraude",
        content:
          "Un email o nombre similar no prueba colusión, parentesco ni fraude. Solo alimenta revisión de destinatario.",
      },
    },
    {
      heading: "listas, CC/BCC, privacidad y mínima divulgación",
      subtopicId: "S22-T3-B",
      paragraphs: [
        "**CC** expone destinatarios entre sí; **BCC** oculta la lista. Prefiere BCC o envíos individuales cuando hay externos. **Mínima divulgación**: no pongas DNI/teléfono en el cuerpo si el informe ya va adjunto cifrado o en portal.",
        "Contrato: dedupe preservando orden; role=`bcc` si dominio externo (`@other.test`); contar cuántos emails quedarían visibles (to+cc) tras mover externos a bcc. Opt-out sintético y tope de tamaño de lista.",
        "Caso: lista con duplicados y un externo → tras higiene, visibles reducidos; el audit registra la política aplicada. Privacidad operativa, no solo “compliance de slide”.",
      ],
      code: {
        language: 'python',
        title: "lists_privacy.py",
        code: `def s22_th_6():
    from collections import OrderedDict

    recipients = [
        {"email": "ana@example.pe", "role": "to"},
        {"email": "luis@example.pe", "role": "cc"},
        {"email": "ana@example.pe", "role": "to"},  # dup
        {"email": "externo@other.test", "role": "bcc"},
    ]
    seen = OrderedDict()
    for r in recipients:
        seen[r["email"]] = r
    clean = list(seen.values())
    for r in clean:
        if r["email"].endswith("@other.test") and r["role"] != "bcc":
            r["role"] = "bcc"
    by_role = {}
    for r in clean:
        by_role.setdefault(r["role"], []).append(r["email"])
    print("n", len(clean), "by_role", {k: len(v) for k, v in by_role.items()})
    print("to_visible_to_others", by_role.get("to", []) + by_role.get("cc", []))

s22_th_6()`,
        output: `n 3 by_role {'to': 1, 'cc': 1, 'bcc': 1}
to_visible_to_others ['ana@example.pe', 'luis@example.pe']`,
      },
      callout: {
        type: "warning",
        title: "CC filtra privacidad",
        content:
          "Un CC masivo filtra quién trabaja en el caso. Usa BCC o tickets internos.",
      },
    },
    {
      heading: "approval queue y state machine",
      subtopicId: "S22-T4-A",
      paragraphs: [
        "La **cola de aprobación** es una state machine: `draft` → `pending_review` → `approved` | `rejected` | `needs_info`. Transiciones explícitas con actor y timestamp; sin transición válida, no hay envío ni promoción de draft.",
        "Contrato: tabla `TRANSITIONS`; `submit` desde draft → pending; `approve` desde draft → `invalid`. En CP-N2-C la aprobación humana es **obligatoria** antes de cualquier acción de envío (aunque el curso solo simule).",
        "Caso: log `{from,to,actor}` al aprobar pending→approved con actor `rev1`. El portfolio adjunta el log: evidencia de cumplimiento y de fail-closed.",
      ],
      code: {
        language: 'python',
        title: "approval_sm.py",
        code: `def s22_th_7():
    TRANSITIONS = {
        "draft": {"submit": "pending_review"},
        "pending_review": {"approve": "approved", "reject": "rejected", "request_edit": "needs_edit"},
        "needs_edit": {"submit": "pending_review"},
        "approved": {},
        "rejected": {},
    }

    def apply(state, action, actor, log):
        nxt = TRANSITIONS.get(state, {}).get(action)
        if not nxt:
            raise ValueError(f"invalid {state}->{action}")
        log.append({"from": state, "to": nxt, "action": action, "actor": actor})
        return nxt

    log = []
    st = "draft"
    st = apply(st, "submit", "analyst", log)
    st = apply(st, "approve", "reviewer", log)
    print("final", st)
    print("steps", len(log))
    print(log[-1]["actor"], log[-1]["to"])

s22_th_7()`,
        output: `final approved
steps 2
reviewer approved`,
      },
      callout: {
        type: "tip",
        title: "Estado es la verdad",
        content:
          "UI y jobs leen el estado; no “envían si el botón se pulsó” sin validar la máquina.",
      },
    },
    {
      heading: "idempotencia, audit log y reintento sin duplicar",
      subtopicId: "S22-T4-B",
      paragraphs: [
        "Una **idempotency key** (p. ej. sha256 hex[:8] de `run_id|destinatario|versión del cuerpo`) evita drafts duplicados si el operador reintenta. El **audit log** registra create/submit/approve/retry con quién y cuándo.",
        "Contrato de reintento: si la key ya existe en estado terminal o activo, devuelve el id previo; no crea otro mensaje. Eventos `create` luego `retry_hit` en la lista de audit.",
        "Caso: dos `create` con la misma key → igualdad True de ids; audit `['create','retry_hit']`. Cierra el inicio de CP-N2-C hacia browser RPA (S23) y el VP de automatización.",
      ],
      code: {
        language: 'python',
        title: "idempotent_draft.py",
        code: `def s22_th_8():
    import hashlib

    store = {}  # key -> draft_id
    audit = []

    def idem_key(run_id, to, body_ver):
        raw = f"{run_id}|{to}|{body_ver}".encode()
        return hashlib.sha256(raw).hexdigest()[:16]

    def create_draft_once(run_id, to, body_ver):
        k = idem_key(run_id, to, body_ver)
        if k in store:
            audit.append({"event": "retry_hit", "key": k, "draft_id": store[k]})
            return store[k], True
        did = f"d{len(store)+1:03d}"
        store[k] = did
        audit.append({"event": "create", "key": k, "draft_id": did})
        return did, False

    a, dup1 = create_draft_once("cpn2c-01", "ana@example.pe", 1)
    b, dup2 = create_draft_once("cpn2c-01", "ana@example.pe", 1)
    c, dup3 = create_draft_once("cpn2c-01", "ana@example.pe", 2)
    print("same_id", a == b, "dup_flags", dup1, dup2)
    print("new_on_body_ver", a != c, "dup3", dup3)
    print("audit_events", [e["event"] for e in audit])

s22_th_8()`,
        output: `same_id True dup_flags False True
new_on_body_ver True dup3 False
audit_events ['create', 'retry_hit', 'create']`,
      },
      callout: {
        type: "info",
        title: "Reintento ≠ reenviar",
        content:
          "El retry recupera el mismo draft_id; no multiplica notificaciones ni anexos.",
      },
    },
  ],
  iDo: {
    intro: "Te muestro el inicio de CP-N2-C: MIME seguro, scopes, drafts con expiración, destinatarios verificados y cola de aprobación — sin envío real ni inferencia de fraude.",
    steps: [
      {
        demoId: "S22-T1-A-DEMO",
        subtopicId: "S22-T1-A",
        environment: "local/sandbox proveedor",
        description: "Construir mensaje MIME multi-parte seguro (text+HTML+adjunto sintético).",
        code: {
          language: 'python',
          title: "demo.py",
          code: `def s22_ido_1():
    from email.mime.multipart import MIMEMultipart
    from email.mime.text import MIMEText
    from email.mime.application import MIMEApplication

    msg = MIMEMultipart("mixed")
    msg["Subject"] = "Demo MIME sintético"
    msg["From"] = "bot@example.pe"
    msg["To"] = "human@example.pe"
    alt = MIMEMultipart("alternative")
    alt.attach(MIMEText("Versión texto", "plain", "utf-8"))
    alt.attach(MIMEText("<p>Versión <i>HTML</i></p>", "html", "utf-8"))
    msg.attach(alt)
    att = MIMEApplication(b'{"run_id":"cpn2c-01"}', Name="run.json")
    att.add_header("Content-Disposition", "attachment", filename="run.json")
    msg.attach(att)
    s = msg.as_string()
    print("ok", "run.json" in s and "utf-8" in s.lower())
    print("n_headers_subj", s.count("Subject:"))

s22_ido_1()`,
          output: `ok True
n_headers_subj 1`,
        },
        why: "MIME bien formado es la base de drafts auditables.",
      },
      {
        demoId: "S22-T1-B-DEMO",
        subtopicId: "S22-T1-B",
        environment: "local/sandbox proveedor",
        description: "Sanitizar HTML de templates de correo con escape y política de links.",
        code: {
          language: 'python',
          title: "demo.py",
          code: `def s22_ido_2():
    import html, re

    def sanitize(s):
        s = html.escape(s)
        return re.sub(r"https?://[^\\s<]+", lambda m: m.group(0) if "example.pe" in m.group(0) else "[blocked]", s)

    raw = '<b>Hola</b> https://evil.test/x https://example.pe/ok'
    print(sanitize(raw))

s22_ido_2()`,
          output: `&lt;b&gt;Hola&lt;/b&gt; [blocked] https://example.pe/ok`,
        },
        why: "Sanitizar evita XSS y links maliciosos en plantillas.",
      },
      {
        demoId: "S22-T2-A-DEMO",
        subtopicId: "S22-T2-A",
        environment: "local/sandbox proveedor",
        description: "Configurar scopes mínimos en sandbox y detectar exceso de privilegios.",
        code: {
          language: 'python',
          title: "demo.py",
          code: `def s22_ido_3():
    requested = ["mail.draft", "mail.send", "mail.full"]
    policy_max = {"mail.draft", "mail.readonly"}
    granted = [s for s in requested if s in policy_max]
    denied = [s for s in requested if s not in policy_max]
    print("granted", granted)
    print("denied", denied)
    print("least_ok", "mail.full" not in granted and "mail.send" not in granted)

s22_ido_3()`,
          output: `granted ['mail.draft']
denied ['mail.send', 'mail.full']
least_ok True`,
        },
        why: "Least privilege reduce impacto de un token filtrado.",
      },
      {
        demoId: "S22-T2-B-DEMO",
        subtopicId: "S22-T2-B",
        environment: "local/sandbox proveedor",
        description: "Crear drafts vía adaptador con expiración.",
        code: {
          language: 'python',
          title: "demo.py",
          code: `def s22_ido_4():
    from datetime import datetime, timezone, timedelta

    class Adapter:
        def __init__(self):
            self.drafts = {}
        def create(self, body, hours=2):
            i = f"D{len(self.drafts)+1}"
            self.drafts[i] = {"body": body, "exp": datetime.now(timezone.utc)+timedelta(hours=hours)}
            return i
        def expired(self, i, now=None):
            now = now or datetime.now(timezone.utc)
            return now >= self.drafts[i]["exp"]

    ad = Adapter()
    d = ad.create("borrador sintético", hours=1)
    print("id", d, "expired", ad.expired(d))
    print("n", len(ad.drafts))

s22_ido_4()`,
          output: `id D1 expired False
n 1`,
        },
        why: "Expiración fuerza re-aprobación de contenido viejo.",
      },
      {
        demoId: "S22-T3-A-DEMO",
        subtopicId: "S22-T3-A",
        environment: "local/sandbox proveedor",
        description: "Resolver y verificar destinatarios sintéticos (match ≠ fraude).",
        code: {
          language: 'python',
          title: "demo.py",
          code: `def s22_ido_5():
    contacts = {"u1": "ana@example.pe", "u2": "bad@not-allowed.test"}
    allow = {"example.pe"}

    def check(uid):
        em = contacts.get(uid)
        if not em:
            return "unresolved"
        dom = em.split("@")[1]
        return "verified" if dom in allow else "rejected"

    for u in ("u1", "u2", "u9"):
        print(u, check(u))
    print("disclaimer: verificación de entrega, no de fraude")

s22_ido_5()`,
          output: `u1 verified
u2 rejected
u9 unresolved
disclaimer: verificación de entrega, no de fraude`,
        },
        why: "Solo contactos verificados entran al To del draft.",
      },
      {
        demoId: "S22-T3-B-DEMO",
        subtopicId: "S22-T3-B",
        environment: "local/sandbox proveedor",
        description: "Aplicar mínima divulgación: externos a BCC y dedupe.",
        code: {
          language: 'python',
          title: "demo.py",
          code: `def s22_ido_6():
    rows = [
        ("ana@example.pe", "to"),
        ("ana@example.pe", "to"),
        ("partner@other.test", "cc"),
    ]
    out, seen = [], set()
    for em, role in rows:
        if em in seen:
            continue
        seen.add(em)
        if em.endswith("other.test"):
            role = "bcc"
        out.append((em, role))
    print(out)

s22_ido_6()`,
          output: `[('ana@example.pe', 'to'), ('partner@other.test', 'bcc')]`,
        },
        why: "CC innecesario filtra la lista de trabajo del caso.",
      },
      {
        demoId: "S22-T4-A-DEMO",
        subtopicId: "S22-T4-A",
        environment: "local/sandbox proveedor",
        description: "Modelar cola de aprobación con estados.",
        code: {
          language: 'python',
          title: "demo.py",
          code: `def s22_ido_7():
    sm = {"draft": {"submit": "pending"}, "pending": {"approve": "approved", "reject": "rejected"}}
    state, trail = "draft", []
    for act in ("submit", "approve"):
        state = sm[state][act]
        trail.append(state)
    print("final", state, "trail", trail)

s22_ido_7()`,
          output: `final approved trail ['pending', 'approved']`,
        },
        why: "Sin estado approved no hay promoción del draft.",
      },
      {
        demoId: "S22-T4-B-DEMO",
        subtopicId: "S22-T4-B",
        environment: "local/sandbox proveedor",
        description: "Reintentar sin duplicar envíos/drafts con idempotency key.",
        code: {
          language: 'python',
          title: "demo.py",
          code: `def s22_ido_8():
    import hashlib
    db = {}

    def once(key, factory):
        if key in db:
            return db[key], True
        db[key] = factory()
        return db[key], False

    k = hashlib.sha256(b"cpn2c-01|ana@example.pe|v1").hexdigest()[:12]
    a, d1 = once(k, lambda: "draft-001")
    b, d2 = once(k, lambda: "draft-002")
    print(a, b, a==b, d1, d2)

s22_ido_8()`,
          output: `draft-001 draft-001 True False True`,
        },
        why: "Idempotencia protege de dobles drafts en reintentos de red.",
      },
    ],
  },
  weDo: {
    intro: "24 ejercicios de MIME, sanitización, OAuth scopes, drafts, resolución, privacidad de listas, state machine e idempotencia.",
    steps: [
      {
        id: "S22-T1-A-E1",
        subtopicId: "S22-T1-A",
        kind: "guided",
        instruction:
          "E1 (guiado) — Concepto: MIMEText plain utf-8. Fixture `S22-T1-A-E1` / datos sintéticos: msg = MIMEText('Hola', 'plain', 'utf-8'); print(msg.get_content_type()). Corrige el DEFECT del starter (CASO-LIM-022); imprime la salida exacta del contrato. Pass (salida exacta del solution): `text/plain | utf-8`.",
        hint: "from email.mime.text import MIMEText",
        hints: [
          "from email.mime.text import MIMEText",
          "print(msg['Content-Type']) o as_string.",
        ],
        edgeCases: ["charset None en algunos builds — usa utf-8 explícito"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-022 · MIMEText plain utf-8
# DEFECT: usa subtype html y charset hardcodeado mal
# Contrato: corrige el DEFECT; salida = solutionCode
from email.mime.text import MIMEText
msg = MIMEText('Hola', 'html', 'utf-8')
print(msg.get_content_type())
print('ascii')
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `from email.mime.text import MIMEText
msg = MIMEText('Hola', 'plain', 'utf-8')
print(msg.get_content_type())
print(str(msg.get_charset()))`,
          output: `text/plain
utf-8`,
        },
      },
      {
        id: "S22-T1-A-E2",
        subtopicId: "S22-T1-A",
        kind: "independent",
        instruction:
          "E2 (independiente) — Concepto: MIMEMultipart mixed + adjunto. Fixture `S22-T1-A-E2` / datos sintéticos: msg = MIMEMultipart('mixed'); msg['Subject'] = 'Test'. Corrige el DEFECT del starter (CASO-LIM-022); imprime la salida exacta del contrato. Pass (salida exacta del solution): `True`.",
        hint: "MIMEMultipart + attach",
        hints: [
          "MIMEMultipart + attach",
          "Content-Disposition filename",
        ],
        edgeCases: ["Name vs filename header"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-022 · MIMEMultipart mixed + adjunto
# DEFECT: adjunto sin Content-Disposition filename
# Contrato: corrige el DEFECT; salida = solutionCode
from email.mime.multipart import MIMEMultipart
from email.mime.application import MIMEApplication
msg = MIMEMultipart('mixed')
msg['Subject'] = 'Test'
att = MIMEApplication(b'x', Name='a.txt')
# DEFECT: falta Content-Disposition con filename
msg.attach(att)
print('a.txt' in msg.as_string())
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `from email.mime.multipart import MIMEMultipart
from email.mime.application import MIMEApplication
msg = MIMEMultipart('mixed')
msg['Subject'] = 'Test'
att = MIMEApplication(b'x', Name='a.txt')
att['Content-Disposition'] = 'attachment; filename="a.txt"'
msg.attach(att)
print('a.txt' in msg.as_string())`,
          output: `True`,
        },
      },
      {
        id: "S22-T1-A-E3",
        subtopicId: "S22-T1-A",
        kind: "transfer",
        instruction:
          "E3 (transferencia) — Concepto: alternative text+html anidado. Fixture `S22-T1-A-E3` / datos sintéticos: msg = MIMEMultipart('mixed'); alt = MIMEMultipart('alternative'). Corrige el DEFECT del starter (CASO-LIM-022); imprime la salida exacta del contrato. Pass (salida exacta del solution): `4`.",
        hint: "alternative dentro de mixed",
        hints: [
          "alternative dentro de mixed",
          "alt.attach dos MIMEText",
        ],
        edgeCases: ["orden plain antes de html recomendado"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-022 · alternative text+html anidado
# DEFECT: no anida alt dentro de mixed (solo un attach)
# Contrato: corrige el DEFECT; salida = solutionCode
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
msg = MIMEMultipart('mixed')
# DEFECT: adjunta plain directo sin alternative
msg.attach(MIMEText('t', 'plain', 'utf-8'))
print(msg.as_string().count('Content-Type:'))
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
msg = MIMEMultipart('mixed')
alt = MIMEMultipart('alternative')
alt.attach(MIMEText('t', 'plain', 'utf-8'))
alt.attach(MIMEText('<b>t</b>', 'html', 'utf-8'))
msg.attach(alt)
print(msg.as_string().count('Content-Type:'))`,
          output: `4`,
        },
      },
      {
        id: "S22-T1-B-E1",
        subtopicId: "S22-T1-B",
        kind: "guided",
        instruction:
          "E1 (guiado) — Concepto: html.escape de script. Fixture `S22-T1-B-E1` / datos sintéticos: print(html.escape('<script>x</script>')). Corrige el DEFECT del starter (CASO-LIM-022); imprime la salida exacta del contrato. Pass (salida exacta del solution): `&lt;script&gt;x&lt;/script&gt;`.",
        hint: "import html",
        hints: [
          "import html",
          "html.escape",
        ],
        edgeCases: ["quote=True por defecto en atributos"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-022 · html.escape de script
# DEFECT: imprime crudo sin escape
# Contrato: corrige el DEFECT; salida = solutionCode
import html
raw = '<script>x</script>'
print(raw)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import html
print(html.escape('<script>x</script>'))`,
          output: `&lt;script&gt;x&lt;/script&gt;`,
        },
      },
      {
        id: "S22-T1-B-E2",
        subtopicId: "S22-T1-B",
        kind: "independent",
        instruction:
          "E2 (independiente) — Concepto: interpolación con escape. Fixture `S22-T1-B-E2` / datos sintéticos: name = '<b>Ana</b>'; print('Hola ' + html.escape(name)). Corrige el DEFECT del starter (CASO-LIM-022); imprime la salida exacta del contrato. Pass (salida exacta del solution): `Hola &lt;b&gt;Ana&lt;/b&gt;`.",
        hint: "escape antes de format",
        hints: [
          "escape antes de format",
          "no uses f-string con HTML crudo",
        ],
        edgeCases: ["doble escape si el template ya escapa"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-022 · interpolación con escape
# DEFECT: concatena name sin html.escape
# Contrato: corrige el DEFECT; salida = solutionCode
import html
name = '<b>Ana</b>'
print('Hola ' + name)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import html
name = '<b>Ana</b>'
print('Hola ' + html.escape(name))`,
          output: `Hola &lt;b&gt;Ana&lt;/b&gt;`,
        },
      },
      {
        id: "S22-T1-B-E3",
        subtopicId: "S22-T1-B",
        kind: "transfer",
        instruction:
          "E3 (transferencia) — Concepto: allowlist de dominios en URL. Fixture `S22-T1-B-E3` / datos sintéticos: urls = ['https://example.pe/a', 'https://evil.test']; for u in urls:. Corrige el DEFECT del starter (CASO-LIM-022); imprime la salida exacta del contrato. Pass (salida exacta del solution): `https://example.pe/a ok | https://evil.test blocked`.",
        hint: "if 'example.pe' in url",
        hints: [
          "if 'example.pe' in url",
          "lista de prueba",
        ],
        edgeCases: ["subdominios maliciosos example.pe.evil.test — parsear host real en prod"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-022 · allowlist de dominios en URL
# DEFECT: marca todo ok sin chequear host
# Contrato: corrige el DEFECT; salida = solutionCode
urls = ['https://example.pe/a', 'https://evil.test']
for u in urls:
    print(u, 'ok')
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `urls = ['https://example.pe/a', 'https://evil.test']
for u in urls:
    print(u, 'ok' if 'example.pe' in u else 'blocked')`,
          output: `https://example.pe/a ok
https://evil.test blocked`,
        },
      },
      {
        id: "S22-T2-A-E1",
        subtopicId: "S22-T2-A",
        kind: "guided",
        instruction:
          "E1 (guiado) — Concepto: filtrar scopes a allowed. Fixture `S22-T2-A-E1` / datos sintéticos: requested = ['mail.draft', 'mail.full']; allowed = {'mail.draft', 'mail.readonly'}. Corrige el DEFECT del starter (CASO-LIM-022); imprime la salida exacta del contrato. Pass (salida exacta del solution): `['mail.draft']`.",
        hint: "list comprehension",
        hints: [
          "list comprehension",
          "set membership",
        ],
        edgeCases: ["mail.send no siempre necesario"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-022 · filtrar scopes a allowed
# DEFECT: devuelve requested completo (sin filtrar)
# Contrato: corrige el DEFECT; salida = solutionCode
requested = ['mail.draft', 'mail.full']
allowed = {'mail.draft', 'mail.readonly'}
print(requested)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `requested = ['mail.draft', 'mail.full']
allowed = {'mail.draft', 'mail.readonly'}
print([s for s in requested if s in allowed])`,
          output: `['mail.draft']`,
        },
      },
      {
        id: "S22-T2-A-E2",
        subtopicId: "S22-T2-A",
        kind: "independent",
        instruction:
          "E2 (independiente) — Concepto: denied scopes peligrosos. Fixture `S22-T2-A-E2` / datos sintéticos: granted = ['mail.draft']; bad = {'mail.full', 'admin'}. Corrige el DEFECT del starter (CASO-LIM-022); imprime la salida exacta del contrato. Pass (salida exacta del solution): `True`.",
        hint: "all(x not in granted for x in ...)",
        hints: [
          "all(x not in granted for x in ...)",
          "set isdisjoint",
        ],
        edgeCases: ["scopes custom del proveedor"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-022 · denied scopes peligrosos
# DEFECT: asume isdisjoint invertido (not)
# Contrato: corrige el DEFECT; salida = solutionCode
granted = ['mail.draft']
bad = {'mail.full', 'admin'}
print(not bad.isdisjoint(granted))
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `granted = ['mail.draft']
bad = {'mail.full', 'admin'}
print(bad.isdisjoint(granted))`,
          output: `True`,
        },
      },
      {
        id: "S22-T2-A-E3",
        subtopicId: "S22-T2-A",
        kind: "transfer",
        instruction:
          "E3 (transferencia) — Concepto: expires_at → refresh|valid. Fixture `S22-T2-A-E3` / datos sintéticos: now = datetime.now(timezone.utc); for exp in (now - timedelta(minutes=1), now + timedelta(hours=1)):. Corrige el DEFECT del starter (CASO-LIM-022); imprime la salida exacta del contrato. Pass (salida exacta del solution): `refresh | valid`.",
        hint: "datetime.fromisoformat",
        hints: [
          "datetime.fromisoformat",
          "compara con now UTC",
        ],
        edgeCases: ["fromisoformat con Z en 3.11+"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-022 · expires_at → refresh|valid
# DEFECT: compara al revés (exp >= now siempre valid primero)
# Contrato: corrige el DEFECT; salida = solutionCode
from datetime import datetime, timezone, timedelta
now = datetime.now(timezone.utc)
for exp in (now - timedelta(minutes=1), now + timedelta(hours=1)):
    print('valid' if exp < now else 'refresh')
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `from datetime import datetime, timezone, timedelta
now = datetime.now(timezone.utc)
for exp in (now - timedelta(minutes=1), now + timedelta(hours=1)):
    print('refresh' if exp < now else 'valid')`,
          output: `refresh
valid`,
        },
      },
      {
        id: "S22-T2-B-E1",
        subtopicId: "S22-T2-B",
        kind: "guided",
        instruction:
          "E1 (guiado) — Concepto: crear draft en store. Fixture `S22-T2-B-E1` / datos sintéticos: store = {}; store['d001'] = {'status': 'draft'}. Corrige el DEFECT del starter (CASO-LIM-022); imprime la salida exacta del contrato. Pass (salida exacta del solution): `draft`.",
        hint: "dict assignment",
        hints: [
          "dict assignment",
          "print store[id]",
        ],
        edgeCases: ["id colisiones"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-022 · crear draft en store
# DEFECT: imprime la key del store, no el status
# Contrato: corrige el DEFECT; salida = solutionCode
store = {}
store['d001'] = {'status': 'draft'}
print(list(store.keys())[0])
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `store = {}
store['d001'] = {'status': 'draft'}
print(store['d001']['status'])`,
          output: `draft`,
        },
      },
      {
        id: "S22-T2-B-E2",
        subtopicId: "S22-T2-B",
        kind: "independent",
        instruction:
          "E2 (independiente) — Concepto: is_usable por expiración. Fixture `S22-T2-B-E2` / datos sintéticos: now = datetime.now(timezone.utc); expires_at = now - timedelta(seconds=1). Corrige el DEFECT del starter (CASO-LIM-022); imprime la salida exacta del contrato. Pass (salida exacta del solution): `False`.",
        hint: "timedelta",
        hints: [
          "timedelta",
          "now < expires",
        ],
        edgeCases: ["clock skew"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-022 · is_usable por expiración
# DEFECT: compara now > expires (invertido) o siempre True
# Contrato: corrige el DEFECT; salida = solutionCode
from datetime import datetime, timezone, timedelta
now = datetime.now(timezone.utc)
expires_at = now - timedelta(seconds=1)
print(now > expires_at)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `from datetime import datetime, timezone, timedelta
now = datetime.now(timezone.utc)
expires_at = now - timedelta(seconds=1)
print(now < expires_at)`,
          output: `False`,
        },
      },
      {
        id: "S22-T2-B-E3",
        subtopicId: "S22-T2-B",
        kind: "transfer",
        instruction:
          "E3 (transferencia) — Concepto: ids de draft secuenciales. Fixture `S22-T2-B-E3` / datos sintéticos: store = {}; def create_draft():. Corrige el DEFECT del starter (CASO-LIM-022); imprime la salida exacta del contrato. Pass (salida exacta del solution): `d001 d002`.",
        hint: "len(store)+1",
        hints: [
          "len(store)+1",
          "f-string d{n:03d}",
        ],
        edgeCases: ["thread-safety fuera de alcance"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-022 · ids de draft secuenciales
# DEFECT: id fijo d001 siempre (no usa len)
# Contrato: corrige el DEFECT; salida = solutionCode
store = {}

def create_draft():
    i = "d001"
    store[i] = {'status': 'draft'}
    return i
print(create_draft(), create_draft())
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `store = {}

def create_draft():
    i = f"d{len(store)+1:03d}"
    store[i] = {'status': 'draft'}
    return i
print(create_draft(), create_draft())`,
          output: `d001 d002`,
        },
      },
      {
        id: "S22-T3-A-E1",
        subtopicId: "S22-T3-A",
        kind: "guided",
        instruction:
          "E1 (guiado) — Concepto: regex simple de email. Fixture `S22-T3-A-E1` / datos sintéticos: pat = r'^[^@]+@[^@]+\\\\.[^@]+$'; for e in ('ana@example.pe', 'bad'):. Corrige el DEFECT del starter (CASO-LIM-022); imprime la salida exacta del contrato. Pass (salida exacta del solution): `ana@example.pe True | bad False`.",
        hint: "re.match",
        hints: [
          "re.match",
          "bool del match",
        ],
        edgeCases: ["no valida DNS real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-022 · regex simple de email
# DEFECT: siempre True sin re.match
# Contrato: corrige el DEFECT; salida = solutionCode
import re
pat = r'^[^@]+@[^@]+\.[^@]+$'
for e in ('ana@example.pe', 'bad'):
    print(e, True)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import re
pat = r'^[^@]+@[^@]+\\.[^@]+$'
for e in ('ana@example.pe', 'bad'):
    print(e, bool(re.match(pat, e)))`,
          output: `ana@example.pe True
bad False`,
        },
      },
      {
        id: "S22-T3-A-E2",
        subtopicId: "S22-T3-A",
        kind: "independent",
        instruction:
          "E2 (independiente) — Concepto: resolver C001 y dominio. Fixture `S22-T3-A-E2` / datos sintéticos: DIRECTORY = {'C001': 'ana@example.pe'}; em = DIRECTORY.get('C001'). Corrige el DEFECT del starter (CASO-LIM-022); imprime la salida exacta del contrato. Pass (salida exacta del solution): `verified`.",
        hint: "dict.get",
        hints: [
          "dict.get",
          "split @",
        ],
        edgeCases: ["subdominios"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-022 · resolver C001 y dominio
# DEFECT: verified sin chequear dominio
# Contrato: corrige el DEFECT; salida = solutionCode
DIRECTORY = {'C001': 'ana@example.pe'}
em = DIRECTORY.get('C001')
print('verified' if em else 'rejected')
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `DIRECTORY = {'C001': 'ana@example.pe'}
em = DIRECTORY.get('C001')
print('verified' if em and em.endswith('@example.pe') else 'rejected')`,
          output: `verified`,
        },
      },
      {
        id: "S22-T3-A-E3",
        subtopicId: "S22-T3-A",
        kind: "transfer",
        instruction:
          "E3 (transferencia) — Concepto: score + nota match_no_es_fraude. Fixture `S22-T3-A-E3` / datos sintéticos: a, b = 'ana.rojas@example.pe', 'ana.rojas@example.com'; n = 0. Corrige el DEFECT del starter (CASO-LIM-022); imprime la salida exacta del contrato. Pass (salida exacta del solution): `0.86 match_no_es_fraude`.",
        hint: "os.path common o loop",
        hints: [
          "os.path common o loop",
          "no uses el score como prueba de fraude",
        ],
        edgeCases: ["score alto ≠ identidad legal"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-022 · score + nota match_no_es_fraude
# DEFECT: imprime score sin la nota ética (y redondeo mal)
# Contrato: corrige el DEFECT; salida = solutionCode
a, b = 'ana.rojas@example.pe', 'ana.rojas@example.com'
n = 0
for x, y in zip(a, b):
    if x != y:
        break
    n += 1
score = n / max(len(a), len(b))
print(round(score, 2), 'fraude_probable')
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `a, b = 'ana.rojas@example.pe', 'ana.rojas@example.com'
n = 0
for x, y in zip(a, b):
    if x != y:
        break
    n += 1
score = n / max(len(a), len(b))
print(round(score, 2), 'match_no_es_fraude')`,
          output: `0.86 match_no_es_fraude`,
        },
      },
      {
        id: "S22-T3-B-E1",
        subtopicId: "S22-T3-B",
        kind: "guided",
        instruction:
          "E1 (guiado) — Concepto: dedupe de lista preservando orden. Fixture `S22-T3-B-E1` / datos sintéticos: xs = ['a@x', 'b@x', 'a@x']; print(list(dict.fromkeys(xs))). Corrige el DEFECT del starter (CASO-LIM-022); imprime la salida exacta del contrato. Pass (salida exacta del solution): `['a@x', 'b@x']`.",
        hint: "dict.fromkeys",
        hints: [
          "dict.fromkeys",
          "list",
        ],
        edgeCases: ["case folding opcional"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-022 · dedupe de lista preservando orden
# DEFECT: set desordena / pierde orden de aparición
# Contrato: corrige el DEFECT; salida = solutionCode
xs = ['a@x', 'b@x', 'a@x']
print(list(set(xs)))
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `xs = ['a@x', 'b@x', 'a@x']
print(list(dict.fromkeys(xs)))`,
          output: `['a@x', 'b@x']`,
        },
      },
      {
        id: "S22-T3-B-E2",
        subtopicId: "S22-T3-B",
        kind: "independent",
        instruction:
          "E2 (independiente) — Concepto: forzar role bcc a externos. Fixture `S22-T3-B-E2` / datos sintéticos: rows = [{'email': 'p@other.test', 'role': 'cc'}]; for r in rows:. Corrige el DEFECT del starter (CASO-LIM-022); imprime la salida exacta del contrato. Pass (salida exacta del solution): `bcc`.",
        hint: "endswith",
        hints: [
          "endswith",
          "mutar role",
        ],
        edgeCases: ["múltiples dominios externos"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-022 · forzar role bcc a externos
# DEFECT: no muta role (deja cc)
# Contrato: corrige el DEFECT; salida = solutionCode
rows = [{'email': 'p@other.test', 'role': 'cc'}]
for r in rows:
    if r['email'].endswith('@other.test'):
        pass  # DEFECT: no asigna bcc
print(rows[0]['role'])
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `rows = [{'email': 'p@other.test', 'role': 'cc'}]
for r in rows:
    if r['email'].endswith('@other.test'):
        r['role'] = 'bcc'
print(rows[0]['role'])`,
          output: `bcc`,
        },
      },
      {
        id: "S22-T3-B-E3",
        subtopicId: "S22-T3-B",
        kind: "transfer",
        instruction:
          "E3 (transferencia) — Concepto: conteo de visibles to+cc. Fixture `S22-T3-B-E3` / datos sintéticos: rows = [('a@example.pe','to'),('b@other.test','cc')]; vis = []. Corrige el DEFECT del starter (CASO-LIM-022); imprime la salida exacta del contrato. Pass (salida exacta del solution): `1 ['a@example.pe']`.",
        hint: "filtrar roles",
        hints: [
          "filtrar roles",
          "after policy",
        ],
        edgeCases: ["BCC no es cifrado"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-022 · conteo de visibles to+cc
# DEFECT: cuenta también bcc (no aplica política)
# Contrato: corrige el DEFECT; salida = solutionCode
rows = [('a@example.pe','to'),('b@other.test','cc')]
vis = []
for em, role in rows:
    # DEFECT: no mueve externos a bcc
    if role in ('to', 'cc'):
        vis.append(em)
print(len(vis), vis)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `rows = [('a@example.pe','to'),('b@other.test','cc')]
vis = []
for em, role in rows:
    if em.endswith('@other.test'):
        role = 'bcc'
    if role in ('to', 'cc'):
        vis.append(em)
print(len(vis), vis)`,
          output: `1 ['a@example.pe']`,
        },
      },
      {
        id: "S22-T4-A-E1",
        subtopicId: "S22-T4-A",
        kind: "guided",
        instruction:
          "E1 (guiado) — Concepto: transición submit draft→pending. Fixture `S22-T4-A-E1` / datos sintéticos: T = {'draft': {'submit': 'pending'}}; state = 'draft'. Corrige el DEFECT del starter (CASO-LIM-022); imprime la salida exacta del contrato. Pass (salida exacta del solution): `pending`.",
        hint: "dict de dicts",
        hints: [
          "dict de dicts",
          "TRANSITIONS[state][action]",
        ],
        edgeCases: ["KeyError si acción inválida"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-022 · transición submit draft→pending
# DEFECT: hardcodea approved saltando submit
# Contrato: corrige el DEFECT; salida = solutionCode
T = {'draft': {'submit': 'pending'}}
state = 'draft'
state = 'approved'
print(state)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `T = {'draft': {'submit': 'pending'}}
state = 'draft'
state = T[state]['submit']
print(state)`,
          output: `pending`,
        },
      },
      {
        id: "S22-T4-A-E2",
        subtopicId: "S22-T4-A",
        kind: "independent",
        instruction:
          "E2 (independiente) — Concepto: approve inválido desde draft. Fixture `S22-T4-A-E2` / datos sintéticos: T = {'draft': {'submit': 'pending'}, 'pending': {'approve': 'approved'}}; state, action = 'draft', 'approve'. Corrige el DEFECT del starter (CASO-LIM-022); imprime la salida exacta del contrato. Pass (salida exacta del solution): `invalid`.",
        hint: "try/except o .get",
        hints: [
          "try/except o .get",
          "None check",
        ],
        edgeCases: ["no silencies errores de auditoría en prod"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-022 · approve inválido desde draft
# DEFECT: usa T[state][action] y asume ok
# Contrato: corrige el DEFECT; salida = solutionCode
T = {'draft': {'submit': 'pending'}, 'pending': {'approve': 'approved'}}
state, action = 'draft', 'approve'
nxt = T.get(state, {}).get(action)
print(nxt if nxt else 'ok')
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `T = {'draft': {'submit': 'pending'}, 'pending': {'approve': 'approved'}}
state, action = 'draft', 'approve'
nxt = T.get(state, {}).get(action)
print(nxt if nxt else 'invalid')`,
          output: `invalid`,
        },
      },
      {
        id: "S22-T4-A-E3",
        subtopicId: "S22-T4-A",
        kind: "transfer",
        instruction:
          "E3 (transferencia) — Concepto: log de aprobación con actor. Fixture `S22-T4-A-E3` / datos sintéticos: log = []; log.append({'from': 'pending', 'to': 'approved', 'actor': 'rev1'}). Corrige el DEFECT del starter (CASO-LIM-022); imprime la salida exacta del contrato. Pass (salida exacta del solution): `[{'from': 'pending', 'to': 'approved', 'actor': 'rev1'}]`.",
        hint: "append dict",
        hints: [
          "append dict",
          "actor obligatorio",
        ],
        edgeCases: ["inmutable audit store en prod"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-022 · log de aprobación con actor
# DEFECT: omite actor en el dict de audit
# Contrato: corrige el DEFECT; salida = solutionCode
log = []
log.append({'from': 'pending', 'to': 'approved'})
print(log)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `log = []
log.append({'from': 'pending', 'to': 'approved', 'actor': 'rev1'})
print(log)`,
          output: `[{'from': 'pending', 'to': 'approved', 'actor': 'rev1'}]`,
        },
      },
      {
        id: "S22-T4-B-E1",
        subtopicId: "S22-T4-B",
        kind: "guided",
        instruction:
          "E1 (guiado) — Concepto: idempotency key sha256[:8]. Fixture `S22-T4-B-E1` / datos sintéticos: print(hashlib.sha256(b'run|to|v1').hexdigest()[:8]). Corrige el DEFECT del starter (CASO-LIM-022); imprime la salida exacta del contrato. Pass (salida exacta del solution): `0da400d6`.",
        hint: "hashlib.sha256",
        hints: [
          "hashlib.sha256",
          "hexdigest slice",
        ],
        edgeCases: ["encoding utf-8 de strings"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-022 · idempotency key sha256[:8]
# DEFECT: md5 o slice distinto [:6]
# Contrato: corrige el DEFECT; salida = solutionCode
import hashlib
print(hashlib.sha256(b'run|to|v1').hexdigest()[:6])
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import hashlib
print(hashlib.sha256(b'run|to|v1').hexdigest()[:8])`,
          output: `0da400d6`,
        },
      },
      {
        id: "S22-T4-B-E2",
        subtopicId: "S22-T4-B",
        kind: "independent",
        instruction:
          "E2 (independiente) — Concepto: create idempotente por key. Fixture `S22-T4-B-E2` / datos sintéticos: store = {}; def create(key):. Corrige el DEFECT del starter (CASO-LIM-022); imprime la salida exacta del contrato. Pass (salida exacta del solution): `True`.",
        hint: "cache dict",
        hints: [
          "cache dict",
          "return existing",
        ],
        edgeCases: ["race conditions"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-022 · create idempotente por key
# DEFECT: siempre crea d-nuevo (ignora cache)
# Contrato: corrige el DEFECT; salida = solutionCode
store = {}

def create(key):
    store[key] = 'd' + str(len(store) + 1)
    return store[key]
print(create('k') == create('k'))
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `store = {}

def create(key):
    if key in store:
        return store[key]
    store[key] = 'd1'
    return store[key]
print(create('k') == create('k'))`,
          output: `True`,
        },
      },
      {
        id: "S22-T4-B-E3",
        subtopicId: "S22-T4-B",
        kind: "transfer",
        instruction:
          "E3 (transferencia) — Concepto: audit create + retry_hit. Fixture `S22-T4-B-E3` / datos sintéticos: audit = []; store = {}. Corrige el DEFECT del starter (CASO-LIM-022); imprime la salida exacta del contrato. Pass (salida exacta del solution): `['create', 'retry_hit']`.",
        hint: "lista de event names",
        hints: [
          "lista de event names",
          "mismo key",
        ],
        edgeCases: ["incluir timestamps en prod"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-022 · audit create + retry_hit
# DEFECT: siempre append create (sin retry_hit)
# Contrato: corrige el DEFECT; salida = solutionCode
audit = []
store = {}
key = 'k1'
for _ in range(2):
    store[key] = 'd1'
    audit.append('create')
print(audit)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `audit = []
store = {}
key = 'k1'
for _ in range(2):
    if key in store:
        audit.append('retry_hit')
    else:
        store[key] = 'd1'
        audit.append('create')
print(audit)`,
          output: `['create', 'retry_hit']`,
        },
      },
    ],
  },
  youDo: {
    title: "Borrador .eml con aprobación (inicio CP-N2-C)",
    context:
      "Construye un mini pipeline sintético: mensaje MIME → destinatario verificado → draft con idempotency key → cola pending_review. No envíes correo real. Matching de contactos no implica fraude.",
    objectives: [
      "Generar un .eml/string MIME con text+HTML y adjunto meta",
      "Resolver/verificar al menos un destinatario allowlisted",
      "Crear draft con expiración y clave de idempotencia",
      "Dejar estado pending_review con audit log",
    ],
    requirements: [
      "Sin PII real ni secretos",
      "Ningún envío SMTP real",
      "Destinatario requiere verificación",
      "No inferir fraude desde matching",
      "es-PE en textos de usuario",
    ],
    starterCode: `from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.application import MIMEApplication
import hashlib
from datetime import datetime, timezone, timedelta

run_id = "cpn2c-01"
to = "revisora@example.pe"
allow = {"example.pe"}
# Contrato youDo: construye MIME mixed+alternative, verifica dominio,
# crea draft con expires_at + idempotency key, deja estado pending_review
# y audit log. Sin SMTP real. Match ≠ fraude.
# Scaffold (completa el pipeline; no dejes print de placeholder):

def domain_ok(email: str) -> bool:
    return "@" in email and email.split("@")[1] in allow

def idem_key(run_id: str, to: str, body_ver: int) -> str:
    raw = f"{run_id}|{to}|{body_ver}".encode()
    return hashlib.sha256(raw).hexdigest()[:16]

# DEFECT(contrato): msg MIME, verify to, draft store, state machine, prints de evidencia
print("verified", domain_ok(to))
print("key", idem_key(run_id, to, 1)[:8])
`,
    portfolioNote:
      "Entregable inicio CP-N2-C: borrador sandbox + audit de aprobación; listo para web adapter (S23).",
    rubric: [
      { criterion: "Alineación al gate V3 de la sección", weight: "25%" },
      { criterion: "Correctitud técnica en entorno declarado", weight: "20%" },
      { criterion: "Privacidad / sin PII real / sin secretos / sin inferencia de fraude", weight: "20%" },
      { criterion: "Pruebas o casos de borde documentados", weight: "15%" },
      { criterion: "Código legible y límites claros", weight: "10%" },
      { criterion: "Documentación en español profesional", weight: "10%" },
    ],
  },
  selfCheck: {
    questions: [
      {
        question: "¿Qué garantiza no enviar correo real en el gate de S22?",
        options: ["Usar mail.full", "Solo drafts/.eml en sandbox y aprobación humana", "CC a todos", "Desactivar UTF-8"],
        correctIndex: 1,
        explanation:
          "El incremento exige borradores sandbox y confirmación de destinatario, no envío automático.",
      },
      {
        question: "Un score alto de similitud entre dos emails implica:",
        options: ["Fraude demostrado", "Parentesco", "Envío automático", "Solo evidencia débil de contacto a revisar; no prueba de fraude"],
        correctIndex: 3,
        explanation:
          "Matching no es inferencia de fraude ni parentesco.",
      },
      {
        question: "Least privilege en OAuth de correo significa:",
        options: ["Solo los scopes mínimos (p. ej. draft) necesarios", "Pedir todos los scopes", "Compartir el refresh token en Slack", "Usar la cuenta personal del CEO"],
        correctIndex: 0,
        explanation:
          "Scopes mínimos reducen el blast radius.",
      },
      {
        question: "La idempotency key al reintentar create_draft debe:",
        options: ["Crear siempre un draft nuevo", "Borrar el audit log", "Reutilizar el mismo draft_id si la key existe", "Enviar el correo"],
        correctIndex: 2,
        explanation:
          "Reintento seguro no duplica.",
      },
      {
        question:
          "Un score de similaridad 0.92 entre dos nombres de contactos sintéticos, ¿qué autoriza en el flujo de email de CP-N2-C?",
        options: ["Declarar fraude o parentesco y bloquear al cliente automáticamente", "Priorizar revisión de entrega/resolución de destinatario, con nota match≠fraude y HITL si aplica", "Enviar el correo sin aprobación porque el score supera 0.9", "Publicar el DNI del contacto en el cuerpo para “confirmar identidad”"],
        correctIndex: 1,
        explanation:
          "Matching apoya entrega correcta; no prueba fraude ni identidad legal. Aprobación humana e idempotencia siguen siendo obligatorias antes de cualquier envío (simulado).",
      },
    ],
  },
  resources: {
    docs: [
      {
        label: "email — MIME examples (Python)",
        url: "https://docs.python.org/3/library/email.examples.html",
        note: "stdlib MIME multiparte",
      },
      {
        label: "email package",
        url: "https://docs.python.org/3/library/email.html",
        note: "API oficial de mensajes",
      },
      {
        label: "html.escape",
        url: "https://docs.python.org/3/library/html.html",
        note: "escape de templates HTML",
      },
      {
        label: "OWASP XSS prevention",
        url: "https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html",
        note: "sanitización HTML",
      },
      {
        label: "OAuth 2.0 RFC 6749",
        url: "https://datatracker.ietf.org/doc/html/rfc6749",
        note: "scopes y consentimiento",
      },
      {
        label: "Google OAuth scopes best practices",
        url: "https://developers.google.com/identity/protocols/oauth2/policies",
        note: "least privilege conceptual",
      },
      {
        label: "uuid — idempotency keys",
        url: "https://docs.python.org/3/library/uuid.html",
        note: "claves de reintento",
      },
      {
        label: "logging — audit trails",
        url: "https://docs.python.org/3/library/logging.html",
        note: "audit log sin PII real",
      },
      {
        label: "json — draft state machine",
        url: "https://docs.python.org/3/library/json.html",
        note: "serializar estados de aprobación",
      },
    ],
    books: [
      {
        label: "Building Secure Software (McGraw)",
        note: "least privilege y validación",
      },
      {
        label: "Designing Data-Intensive Applications (Kleppmann) — select",
        note: "idempotencia y logs",
      },
    ],
    courses: [
      {
        label: "Coursera — Python for Everybody",
        url: "https://www.coursera.org/specializations/python",
        note: "fundamentos de red/archivos",
      },
      {
        label: "MIT 6.100L",
        url: "https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/",
        note: "estructuras y lógica",
      },
      {
        label: "Harvard CS50P",
        url: "https://cs50.harvard.edu/python/",
        note: "práctica Python",
      },
      {
        label: "PyArcana live",
        url: "https://pillb.github.io/pyarcana/",
        note: "curso desplegado; V3 S22 email approval CP-N2-C",
      },
      {
        label: "Awesome Python Learning",
        url: "https://github.com/skupriienko/Awesome-Python-Learning",
        note: "mapa de recursos",
      },
      {
        label: "OWASP Authentication Cheat Sheet",
        url: "https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html",
        note: "auth conceptual; scopes mínimos",
      },
      {
        label: "deeplearning.ai — Data Engineering (concepts)",
        url: "https://www.deeplearning.ai/specializations/data-engineering",
        note: "workflows y entregas; adaptar a drafts locales",
      },
    ],
  },
}
