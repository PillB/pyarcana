import type { CourseSection } from '../../types'

export const section22: CourseSection = {
  id: "rapidfuzz-entity",
  index: 22,
  title: "Email, identidad y aprobación humana",
  shortTitle: "Email y aprobación",
  tagline:
    "Crea borradores en sandbox o archivos .eml; ningún correo real se envía automáticamente y todo destinatario requiere confirmación humana",
  estimatedHours: 19,
  level: "Competente",
  phase: 1,
  icon: "Mail",
  accentColor: "bg-gradient-to-br from-blue-500 to-indigo-600",
  jobRelevance:
    "En una mesa de control de operaciones o RPA (tickets, alertas, notificaciones a clientes sintéticos en Lima), el peaje más caro no es “enviar el correo”: es **enviarlo mal** — destinatario incorrecto, HTML inseguro, o un reintento que duplica el mensaje. Un pipeline profesional separa **borrador → aprobación humana → envío**. S22 inicia **CP-N2-C** a partir del paquete de informe de S21: MIME multiparte, scopes OAuth mínimos, resolución de destinatarios y cola de aprobación con audit. Coincidir emails o nombres es evidencia de **entrega correcta**, **no** prueba de fraude ni parentesco. En S23 el canal web se conecta; aquí el producto es un `.eml`/draft de sandbox fail-closed.",
  learningOutcomes: [
    { text: "Construir mensajes MIME con encoding y attachments" },
    { text: "Sanitizar templates HTML de correo" },
    { text: "Configurar OAuth/service account con scopes mínimos" },
    { text: "Crear drafts vía adaptadores con expiración" },
    { text: "Resolver y verificar destinatarios" },
    { text: "Aplicar privacidad y mínima divulgación en listas" },
    { text: "Implementar cola de aprobación y máquina de estados" },
    { text: "Garantizar idempotencia, audit log y reintentos seguros" },
  ],
  theory: [
    {
      heading: "Email con aprobación humana e inicio CP-N2-C",
      paragraphs: [
        "**Diccionario de la sección** (léelo antes de T1). **MIME:** mensaje multiparte (text/html + adjuntos). **Draft sandbox:** borrador local o API de prueba — **no envío real**. **Scopes mínimos:** permisos OAuth justos. **Resolución de destinatario:** mapear id → email verificado. **Cola de aprobación:** revisión humana obligatoria. **Máquina de estados:** `draft` → `pending_review` → `approved` | `rejected` | `needs_edit`. **Idempotency key:** evita duplicar drafts al reintentar (sha256 hex de 16 caracteres). **Fail-closed:** sin aprobación humana no hay envío. **Matching ≠ fraude:** coincidir contactos no prueba parentesco ni culpa.",
        "Aquí **inicias CP-N2-C**: el canal de **notificación con aprobación humana** que toma el paquete de reporte ya reconciliado (S21: DOCX/PDF/dashboard) y prepara un **borrador** seguro. Enfocamos MIME, sanitización HTML, scopes mínimos, drafts con expiración, resolución de destinatarios sintéticos, privacidad de listas, cola de aprobación e idempotencia. El entity resolution probabilístico profundo llega más adelante en el roadmap; aquí el matching de contactos solo sirve para **entrega correcta**. En S23 conectarás un adaptador web (browser RPA); en esta sección el canal es `.eml` o draft de sandbox.",
        "Hilo operativo (Lima / operaciones sintéticas): borrador `run_id=cpn2c-01` / `CASO-LIM-022`, contactos fake `@example.pe`, revisor humano en la mesa de control. **Ningún correo real se envía**: solo `.eml` locales o drafts de sandbox. Matching de contactos es para **entrega correcta**, nunca para inferir fraude, parentesco o culpabilidad.",
        "Orden: **T1 Mensaje** (MIME, templates seguros) → **T2 Proveedor** (OAuth/scopes, adaptadores de draft) → **T3 Destinatario** (resolución, verificación, CC/BCC, mínima divulgación) → **T4 Workflow** (máquina de estados de aprobación, audit log, reintento sin duplicar). Fail-closed sin aprobación humana.",
      ],
      code: {
        language: 'python',
        title: "s22_map_contract.py",
        code: `def section_contract():
    return {
        "case": "CASO-LIM-022",
        "gates": ["draft_only_no_auto_send", "human_approval", "idempotent_retry", "synthetic_recipients"],
        "auto_send_ok": False,
    }

c = section_contract()
print("case", c["case"])
print("gates", len(c["gates"]))
print("auto_send_ok", c["auto_send_ok"])
`,
        output: `case CASO-LIM-022
gates 4
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
        "**MIME** (`email.mime`) es el formato con el que construyes un correo profesional: no es un string suelto, sino un **árbol** de partes con tipo, charset y disposición. En operaciones (mesa de control, tickets, notificaciones a clientes sintéticos) el borrador suele llevar text/plain + text/html + un adjunto de meta del run. Charset **UTF-8** evita mojibake en nombres y acentos del español peruano. `MIMEMultipart('alternative')` ofrece ambas representaciones del cuerpo; el cliente de correo elige cuál mostrar.",
        "Contrato operativo: `MIMEText(..., 'plain'|'html', 'utf-8')` para el cuerpo; adjuntos con `MIMEApplication` + header `Content-Disposition` y `filename` legible. **Nunca** incrustes secretos (tokens OAuth, DNI, contraseñas) en el cuerpo ni en el nombre del archivo. Limita el tamaño de adjuntos de laboratorio y márcalos como demo. Serializar con `as_string()` te deja inspeccionar el árbol antes de guardarlo como `.eml`.",
        "Caso sintético CASO-LIM-022: `MIMEText('Hola','plain','utf-8')` produce content-type `text/plain`; un contenedor `mixed` con `alternative` (plain+html) y `MIMEApplication` de `meta.txt` genera varios headers `Content-Type`. Contar esos headers en los ejercicios guiados valida que el árbol multiparte quedó bien anidado — base del borrador que luego pedirá aprobación humana.",
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
      heading: "Templates y sanitización de HTML",
      subtopicId: "S22-T1-B",
      paragraphs: [
        "Los **templates** de correo interpolan variables de negocio (nombre de contacto, `run_id`, montos del informe de S21). Cualquier dato que no sea 100 % confiable se trata como **no confiable**: se escapa con `html.escape` (o autoescape del motor de plantillas). La política de links usa allowlist de **hosts reales** (`example.pe` o subdominios propios) o rutas relativas; se bloquean esquemas `javascript:` y `data:`. **Nunca** uses substring (`'example.pe' in url`): un host `example.pe.evil.test` lo burlaría y el curso no enseña ese bypass como solución.",
        "Contrato: el template `Hola {name}` con `name = '<b>Ana</b>'` debe producir entidades HTML escapadas (`&lt;b&gt;…`), no markup activo. Para links: parsea el host (`urlparse` o strip del esquema) y compara **igualdad exacta** o sufijo de subdominio controlado; cualquier otro host → `blocked` / enlace neutralizado. XSS en el cuerpo del correo es phishing interno real: un revisor de la mesa puede hacer clic en un enlace malicioso si el pipeline no sanitiza.",
        "Caso sintético: el cuerpo del borrador incluye un enlace al portal de revisión del run. Sin allowlist correcta, un fragmento malicioso redirige a un dominio externo. Por eso el gate de sanitización es **obligatorio** antes de encolar el draft en `pending_review`: la revisor humana debe ver HTML seguro, no un vector de ataque.",
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
                # host real: sin path ni puerto (evita substring y example.pe.evil.test)
                host = re.sub(r"^https?://", "", url).split("/")[0].split(":")[0]
                if host in allowed_hosts or host.endswith(".example.pe"):
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
      heading: "OAuth, service account y scopes",
      subtopicId: "S22-T2-A",
      paragraphs: [
        "Cuando un bot de notificaciones habla con Gmail u otro proveedor, no “inicia sesión” con contraseña en el código: usa **OAuth** o una **service account** con **scopes mínimos**. Si el producto solo crea borradores, el scope justo es del estilo `mail.draft` — no `mail.full` ni permisos de administración. En el modelo de laboratorio guardas `client_id`, lista de scopes y `expires_at`; los secretos reales **nunca** van al repo del portfolio ni a un notebook compartido.",
        "Contrato de least privilege: `granted ⊆ allowed` y `requested ∩ allowed` define lo que se pide de verdad. Imprimes evidencia de que `granted` no contiene scopes peligrosos (`mail.full`, `admin`, a veces `mail.send` si el producto es draft-only). Los tokens del curso son sintéticos; lo que evalúas es el **diseño de permisos**, no un flujo OAuth real de producción.",
        "Caso: el pipeline pide `mail.draft` y por error también `mail.full`. La política filtra a `allowed` y deja `granted` sin privilegios de envío masivo. En sandbox, un scope de más es un **hallazgo de seguridad del diseño**, no un “detalle de configuración” que se ignora. La mesa de control puede auditar scopes pedidos vs concedidos en el mismo paquete de evidencia del run.",
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
      heading: "Drafts, expiración y adaptadores",
      subtopicId: "S22-T2-B",
      paragraphs: [
        "Un **adaptador** (`GmailAdapter`, `SmtpFileAdapter`, adaptador de archivo local) expone `create_draft` / `get_draft` sin acoplar el workflow de aprobación al SDK del proveedor. Así puedes probar el mismo flujo contra un `.eml` en disco y, más adelante, contra una API real. Los drafts llevan **expiración**: pasado `expires_at` no se promueven a envío sin regenerar el mensaje y volver a pasar por la cola humana — el SLA de la mesa de control exige contenido fresco (cifras del informe de S21 pueden haber cambiado).",
        "Contrato: store en memoria o carpeta `out/drafts/`; ids legibles secuenciales (`d001`, `d002`); `is_usable(draft_id)` es False si el status ya no es draft o si `now >= expires_at`. En este curso **solo** se escriben `.eml` o estructuras de sandbox: cero SMTP real, cero envío automático.",
        "Caso: creas `d001` con status `draft`; si `expires_at = now − 1s`, `is_usable` devuelve False y el job no debe “aprovechar” ese borrador. Los ids secuenciales evitan colisiones en el laboratorio; el reintento seguro (misma key → mismo draft) se formaliza en T4-B con idempotencia y audit log.",
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
      heading: "Resolución y verificación de destinatarios",
      subtopicId: "S22-T3-A",
      paragraphs: [
        "Antes de poner un `To:` en el borrador, el pipeline **resuelve** y **verifica** al destinatario. Resolución: mapear un id de negocio (`C001`) a un email desde un directorio sintético. Verificación: formato básico, dominio allowlisted (`example.pe`) y estado activo. Los estados del contacto van de `unresolved` → `candidate` → `verified` | `rejected`. Sin `verified`, fail-closed: no se encola aprobación para envío (aunque en el curso solo simules).",
        "Contrato ético y técnico: si usas un score de similaridad de nombres o emails, **siempre** acompáñalo de la nota **`match_no_es_fraude`**. Un score alto (p. ej. 0.86–0.92 en demos y self-check) **no** autoriza claims de identidad legal, parentesco ni colusión; solo prioriza la revisión de **entrega correcta**. Matching de contactos ≠ investigación de fraude.",
        "Caso: `ana@example.pe` pasa formato y dominio; `bad` se rechaza; `C001` queda `verified` en el directorio de laboratorio; `C002` con dominio no allowlisted queda `rejected`. Si el id no existe, el estado es `unresolved` y la mesa de control decide a mano. Al comparar dos strings de email, el ejercicio imprime el score sintético **y** la nota anti-claim — nunca `fraude_probable`.",
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
      heading: "Listas, CC/BCC, privacidad y mínima divulgación",
      subtopicId: "S22-T3-B",
      paragraphs: [
        "**CC** expone a todos los destinatarios entre sí (en jerga de operaciones: “filtra” = filtra información / deja ver la lista de quién trabaja el caso). **BCC** oculta la lista a los demás. Cuando hay externos (p. ej. un partner fuera de `@example.pe`), prefiere BCC o envíos individuales. **Mínima divulgación**: no pongas DNI, teléfono ni secretos en el cuerpo si el detalle ya vive en el adjunto controlado o en un portal con acceso acotado.",
        "Contrato de higiene de listas: (1) dedupe preservando el orden de primera aparición; (2) forzar `role='bcc'` si el dominio es externo; (3) contar cuántos emails quedarían **visibles** (`to`+`cc`) tras la política. En laboratorio también modelas tope de tamaño de lista y un flag sintético de opt-out — hábitos que luego mapean a políticas reales de la mesa.",
        "Caso: la lista trae duplicados de `ana@example.pe` y un `externo@other.test` en CC. Tras higiene, el externo pasa a BCC y el conteo de visibles baja. El audit del run registra la política aplicada. Esto es **privacidad operativa** del día a día, no un checklist de compliance que se tacha y se olvida.",
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
        title: "CC expone la lista de trabajo",
        content:
          "Un CC masivo **expone** a todos entre sí (en jerga de operaciones: “filtra” = filtra información). Usa BCC o tickets internos cuando haya externos.",
      },
    },
    {
      heading: "Cola de aprobación y máquina de estados",
      subtopicId: "S22-T4-A",
      paragraphs: [
        "La **cola de aprobación** es el corazón human-in-the-loop de CP-N2-C: una máquina de estados `draft` → `pending_review` → `approved` | `rejected` | `needs_edit`. Cada transición lleva **actor** (quién) y, en producción, timestamp. Sin transición válida, fail-closed: no hay envío ni promoción del draft. En tu código y en el You Do usa siempre `pending_review` (nunca el atajo `pending`) y `needs_edit` cuando el revisor pide cambios.",
        "Contrato: tabla `TRANSITIONS` como única fuente de verdad. `submit` desde `draft` → `pending_review`; `approve` desde `draft` → `invalid`; `request_edit` desde `pending_review` → `needs_edit` y luego otro `submit`. La UI y los jobs leen el estado; no “envían porque alguien pulsó un botón” sin validar la máquina. En mesa de control, un `pending_review` sin respuesta dentro del SLA suele **escalar** al revisor de turno o volver a `needs_edit` con nota — no se auto-aprueba por timeout. En CP-N2-C la aprobación humana es **obligatoria** antes de cualquier acción de envío (aunque el curso solo simule el envío).",
        "Caso de laboratorio: el analista hace `submit`; la revisor `rev1` hace `approve` y el log registra `{from: pending_review, to: approved, action, actor}`. Si alguien intenta aprobar desde `draft`, el sistema responde `invalid`. El portfolio adjunta ese audit: evidencia de cumplimiento y de fail-closed para el hilo que en S23 saldrá a un adaptador web.",
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
      heading: "Idempotencia, audit log y reintento sin duplicar",
      subtopicId: "S22-T4-B",
      paragraphs: [
        "Un reintento de red o un doble clic del operador no debe spamear al destinatario. La **idempotency key** — `sha256(...).hexdigest()[:16]` de `run_id|destinatario|versión del cuerpo` — es el contrato único de esta sección: **16** caracteres hex en teoría, I Do, ejercicios y You Do. El **audit log** registra `create`, `submit`, `approve` y `retry_hit` con actor (y timestamp en producción).",
        "Contrato de reintento: si la key ya existe (draft activo o terminal), devuelves el **mismo** `draft_id` y anotas `retry_hit`; no creas un segundo mensaje. Solo un cambio de `body_ver` (o de destinatario/run) genera una key distinta y un draft nuevo. Así el reintento es seguro y auditable.",
        "Caso: dos `create_draft_once` con la misma key → mismos ids (`same_id True`) y audit `['create','retry_hit',…]`. Con esto cierras el **inicio de CP-N2-C**: el borrador con aprobación y key estable queda listo para el canal web de S23 (browser RPA), sin reabrir el paquete de informe de S21 ni duplicar notificaciones.",
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
    intro: "Te muestro el inicio de CP-N2-C a partir del paquete de S21: MIME seguro, scopes, drafts con expiración, destinatarios verificados y cola de aprobación — sin envío real ni inferencia de fraude. En cada demo, fíjate en la **decisión**: por qué draft y no send; por qué parsear el host y no un substring; por qué fail-closed ante una transición inválida.",
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
        why: "Decisión: plain+HTML+meta del run en un solo árbol MIME, sin secretos en el cuerpo — el revisor de la mesa puede inspeccionar el `.eml` antes de aprobar.",
      },
      {
        demoId: "S22-T1-B-DEMO",
        subtopicId: "S22-T1-B",
        environment: "local/sandbox proveedor",
        description: "Sanitizar HTML de templates de correo con escape y allowlist de host real.",
        code: {
          language: 'python',
          title: "demo.py",
          code: `def s22_ido_2():
    import html, re

    def host_ok(url: str) -> bool:
        host = re.sub(r"^https?://", "", url).split("/")[0].split(":")[0]
        return host == "example.pe" or host.endswith(".example.pe")

    def sanitize(s):
        s = html.escape(s)
        return re.sub(
            r"https?://[^\\s<]+",
            lambda m: m.group(0) if host_ok(m.group(0)) else "[blocked]",
            s,
        )

    raw = '<b>Hola</b> https://evil.test/x https://example.pe/ok https://example.pe.evil.test/x'
    print(sanitize(raw))

s22_ido_2()`,
          output: `&lt;b&gt;Hola&lt;/b&gt; [blocked] https://example.pe/ok [blocked]`,
        },
        why: "Escapamos HTML y validamos el host real: un substring 'example.pe' en la URL sería un bypass de phishing.",
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
        why: "Si el producto solo crea drafts, denegar mail.send y mail.full reduce el impacto de un token filtrado.",
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
        why: "La expiración fuerza regenerar y reaprobar contenido viejo: no se promueve un draft caducado.",
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
        why: "Solo contactos verificados entran al To del draft; el matching no prueba fraude ni parentesco.",
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
        if not em.endswith("@example.pe"):
            role = "bcc"
        out.append((em, role))
    print(out)

s22_ido_6()`,
          output: `[('ana@example.pe', 'to'), ('partner@other.test', 'bcc')]`,
        },
        why: "Decisión: todo lo que no es @example.pe va a BCC. Un CC masivo expone la lista de trabajo del caso; BCC o tickets internos protegen la privacidad operativa.",
      },
      {
        demoId: "S22-T4-A-DEMO",
        subtopicId: "S22-T4-A",
        environment: "local/sandbox proveedor",
        description: "Modelar cola de aprobación con estados canónicos (pending_review).",
        code: {
          language: 'python',
          title: "demo.py",
          code: `def s22_ido_7():
    sm = {
        "draft": {"submit": "pending_review"},
        "pending_review": {
            "approve": "approved",
            "reject": "rejected",
            "request_edit": "needs_edit",
        },
        "needs_edit": {"submit": "pending_review"},
    }
    state, trail = "draft", []
    for act in ("submit", "approve"):
        state = sm[state][act]
        trail.append(state)
    print("final", state, "trail", trail)

s22_ido_7()`,
          output: `final approved trail ['pending_review', 'approved']`,
        },
        why: "Decisión: solo `submit` mueve draft→pending_review; `approve` desde draft no existe en la tabla — fail-closed protege al destinatario.",
      },
      {
        demoId: "S22-T4-B-DEMO",
        subtopicId: "S22-T4-B",
        environment: "local/sandbox proveedor",
        description: "Reintentar sin duplicar drafts con idempotency key de 16 hex.",
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

    k = hashlib.sha256(b"cpn2c-01|ana@example.pe|v1").hexdigest()[:16]
    a, d1 = once(k, lambda: "draft-001")
    b, d2 = once(k, lambda: "draft-002")
    print(a, b, a==b, d1, d2)

s22_ido_8()`,
          output: `draft-001 draft-001 True False True`,
        },
        why: "Decisión: la key de 16 hex es el contrato de reintento; el segundo `once` devuelve el mismo draft_id y marca duplicado — no spamea al cliente.",
      },
    ],
  },
  weDo: {
    intro: "Practica en 24 ejercicios (guiado → independiente → transferencia) MIME, sanitización, OAuth scopes, drafts, resolución, privacidad de listas, máquina de estados e idempotencia. Cada starter de CASO-LIM-022 trae un error deliberado que debes corregir; la salida debe coincidir con el bloque solución.",
    steps: [
      {
        id: "S22-T1-A-E1",
        subtopicId: "S22-T1-A",
        kind: "guided",
        instruction:
          "E1 (guiado) — Construye un `MIMEText` en texto plano con charset UTF-8 (CASO-LIM-022). El starter usa subtype html y un charset incorrecto en la segunda línea: corrígelo. Salida esperada (dos líneas):\ntext/plain\nutf-8",
        hint: "from email.mime.text import MIMEText",
        hints: [
          "from email.mime.text import MIMEText",
          "subtype 'plain' y charset 'utf-8'; usa get_content_type y get_charset.",
        ],
        edgeCases: ["charset None en algunos builds — usa utf-8 explícito"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-022 · MIMEText plain utf-8
# A corregir: usa subtype html y charset hardcodeado mal
# Contrato: tipo text/plain + charset utf-8 (dos prints)
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
          "E2 (independiente) — Arma un `MIMEMultipart('mixed')` con un adjunto y `Content-Disposition` que declare el filename `a.txt` (CASO-LIM-022). El starter adjunta el binario pero omite el header de disposición. Imprime si `a.txt` aparece en el mensaje serializado. Salida esperada:\nTrue",
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
# A corregir: adjunto sin Content-Disposition filename
# Contrato: 'a.txt' debe aparecer en as_string()
from email.mime.multipart import MIMEMultipart
from email.mime.application import MIMEApplication
msg = MIMEMultipart('mixed')
msg['Subject'] = 'Test'
att = MIMEApplication(b'x', Name='a.txt')
# falta Content-Disposition con filename
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
          "E3 (transferencia) — Anida `MIMEMultipart('alternative')` (plain + html) dentro de un `mixed` y cuenta cuántos headers `Content-Type:` genera el árbol (CASO-LIM-022). El starter adjunta solo plain sin capa alternative. Salida esperada:\n4",
        hint: "alternative dentro de mixed",
        hints: [
          "alternative dentro de mixed",
          "alt.attach dos MIMEText; luego msg.attach(alt)",
        ],
        edgeCases: ["orden plain antes de html recomendado"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-022 · alternative text+html anidado
# A corregir: no anida alt dentro de mixed (solo un attach)
# Contrato: count de Content-Type: == 4
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
msg = MIMEMultipart('mixed')
# adjunta plain directo sin alternative
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
          "E1 (guiado) — Escapa un fragmento con etiqueta script usando `html.escape` antes de interpolarlo en un template de correo (CASO-LIM-022). El starter imprime el crudo. Salida esperada:\n&lt;script&gt;x&lt;/script&gt;",
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
# A corregir: imprime crudo sin escape
# Contrato: entidades HTML escapadas
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
          "E2 (independiente) — Interpola el nombre sintético `<b>Ana</b>` en un saludo solo después de `html.escape` (CASO-LIM-022). El starter concatena sin escapar. Salida esperada:\nHola &lt;b&gt;Ana&lt;/b&gt;",
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
# A corregir: concatena name sin html.escape
# Contrato: Hola + nombre escapado
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
          "E3 (transferencia) — Clasifica dos URLs con allowlist de **host real** (no substring): usa `urlparse` y acepta solo host exactamente `example.pe` (CASO-LIM-022). El starter marca todo ok. Incluye en la prueba mental el bypass `example.pe.evil.test` (no debe pasar). Salida esperada (dos líneas):\nhttps://example.pe/a ok\nhttps://evil.test blocked",
        hint: "urlparse(u).hostname",
        hints: [
          "from urllib.parse import urlparse",
          "host == 'example.pe' (igualdad exacta, no 'in url')",
        ],
        edgeCases: ["subdominios maliciosos example.pe.evil.test — el host real no es example.pe"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-022 · allowlist de dominios en URL
# A corregir: marca todo ok sin chequear host
# Contrato: parsear host; solo example.pe es ok
from urllib.parse import urlparse
urls = ['https://example.pe/a', 'https://evil.test']
for u in urls:
    print(u, 'ok')
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `from urllib.parse import urlparse
urls = ['https://example.pe/a', 'https://evil.test']
for u in urls:
    host = urlparse(u).hostname or ""
    print(u, 'ok' if host == 'example.pe' else 'blocked')`,
          output: `https://example.pe/a ok
https://evil.test blocked`,
        },
      },
      {
        id: "S22-T2-A-E1",
        subtopicId: "S22-T2-A",
        kind: "guided",
        instruction:
          "E1 (guiado) — Filtra `requested` a la intersección con `allowed` (scopes mínimos) en CASO-LIM-022. El starter imprime la lista completa sin filtrar. Salida esperada:\n['mail.draft']",
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
# A corregir: devuelve requested completo (sin filtrar)
# Contrato: solo scopes en allowed
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
          "E2 (independiente) — Comprueba que `granted` no solapa scopes peligrosos (`mail.full`, `admin`) con `set.isdisjoint` (CASO-LIM-022). El starter invierte la lógica. Salida esperada:\nTrue",
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
# A corregir: isdisjoint invertido (not)
# Contrato: True si no hay intersección con bad
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
          "E3 (transferencia) — Clasifica dos `expires_at` sintéticos frente a `now` UTC: caducado → `refresh`, vigente → `valid` (CASO-LIM-022). El starter invierte la comparación. Salida esperada (dos líneas):\nrefresh\nvalid",
        hint: "compara con now UTC",
        hints: [
          "exp < now → refresh",
          "en caso contrario → valid",
        ],
        edgeCases: ["fromisoformat con Z en 3.11+"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-022 · expires_at → refresh|valid
# A corregir: compara al revés
# Contrato: dos líneas refresh / valid
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
          "E1 (guiado) — Registra un borrador sintético en un store (id `d001`, status `draft`, subject del run) e imprime el **status** del registro — no la clave del dict (CASO-LIM-022). El starter imprime la key. Salida esperada:\ndraft",
        hint: "dict assignment",
        hints: [
          "store['d001'] = {'status': 'draft', 'subject': '...'}",
          "print store['d001']['status'] — no list(store.keys())",
        ],
        edgeCases: ["id colisiones; status es el campo de workflow, no el id"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-022 · crear draft en store
# A corregir: imprime la key del store, no el status de workflow
# Contrato: status == draft
store = {}
store['d001'] = {'status': 'draft', 'subject': 'Informe sintético CP-N2-C'}
print(list(store.keys())[0])
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `store = {}
store['d001'] = {'status': 'draft', 'subject': 'Informe sintético CP-N2-C'}
print(store['d001']['status'])`,
          output: `draft`,
        },
      },
      {
        id: "S22-T2-B-E2",
        subtopicId: "S22-T2-B",
        kind: "independent",
        instruction:
          "E2 (independiente) — Decide si un draft sigue usable: `now < expires_at` (CASO-LIM-022). El draft ya expiró hace 1s; el starter invierte la comparación. Salida esperada:\nFalse",
        hint: "timedelta",
        hints: [
          "timedelta",
          "usable solo si now < expires_at",
        ],
        edgeCases: ["clock skew"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-022 · is_usable por expiración
# A corregir: compara now > expires (invertido)
# Contrato: usable False si expiró
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
          "E3 (transferencia) — Mini adaptador de drafts (CASO-LIM-022): implementa `create_draft()` con ids secuenciales `d001`, `d002` (`f\"d{len(store)+1:03d}\"`), status `draft` y `expires_at = now + 1h`. Luego imprime los dos ids y si el segundo sigue usable (`now < expires_at`). El starter reutiliza siempre `d001`, no guarda expiración y reporta usable al revés. Salida esperada (dos líneas):\nd001 d002\nusable True",
        hint: "len(store)+1 y timedelta",
        hints: [
          "i = f\"d{len(store)+1:03d}\"",
          "usable = now < store[i]['expires_at']",
        ],
        edgeCases: ["draft caducado no se promueve; thread-safety fuera de alcance"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-022 · adaptador: ids secuenciales + usable
# A corregir: id fijo d001; sin expires_at; usable invertido
# Contrato: d001 d002 / usable True
from datetime import datetime, timezone, timedelta
store = {}
now = datetime.now(timezone.utc)

def create_draft():
    i = "d001"
    store[i] = {'status': 'draft'}
    return i
a, b = create_draft(), create_draft()
print(a, b)
print('usable', False)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `from datetime import datetime, timezone, timedelta
store = {}
now = datetime.now(timezone.utc)

def create_draft():
    i = f"d{len(store)+1:03d}"
    store[i] = {
        'status': 'draft',
        'expires_at': now + timedelta(hours=1),
    }
    return i
a, b = create_draft(), create_draft()
print(a, b)
print('usable', now < store[b]['expires_at'] and store[b]['status'] == 'draft')`,
          output: `d001 d002
usable True`,
        },
      },
      {
        id: "S22-T3-A-E1",
        subtopicId: "S22-T3-A",
        kind: "guided",
        instruction:
          "E1 (guiado) — Valida formato de email con `re.match` sobre `ana@example.pe` y `bad` (CASO-LIM-022). El starter siempre imprime True. Salida esperada (dos líneas):\nana@example.pe True\nbad False",
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
# A corregir: siempre True sin re.match
# Contrato: dos líneas email + bool
import re
pat = r'^[^@]+@[^@]+\\.[^@]+$'
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
          "E2 (independiente) — Resuelve `C001` en el directorio sintético y verifica dominio `@example.pe` antes de marcar `verified` (CASO-LIM-022). El starter no chequea dominio. Salida esperada:\nverified",
        hint: "dict.get",
        hints: [
          "dict.get",
          "endswith('@example.pe') o split @",
        ],
        edgeCases: ["subdominios"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-022 · resolver C001 y dominio
# A corregir: verified sin chequear dominio
# Contrato: verified solo si dominio allowlisted
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
          "E3 (transferencia) — Calcula un score de prefijo común entre dos emails sintéticos y **siempre** anexa la nota `match_no_es_fraude` (CASO-LIM-022). El starter etiqueta `fraude_probable` (incorrecto éticamente). Salida esperada:\n0.86 match_no_es_fraude",
        hint: "loop zip + round",
        hints: [
          "prefix común con zip hasta divergencia",
          "nunca uses el score como prueba de fraude",
        ],
        edgeCases: ["score alto ≠ identidad legal"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-022 · score + nota match_no_es_fraude
# A corregir: imprime score con etiqueta antiética
# Contrato: round(score, 2) + match_no_es_fraude
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
          "E1 (guiado) — Deduplica una lista de emails preservando el orden de primera aparición (CASO-LIM-022). El starter usa `set` y pierde orden estable. Salida esperada:\n['a@x', 'b@x']",
        hint: "dict.fromkeys",
        hints: [
          "dict.fromkeys",
          "list(...)",
        ],
        edgeCases: ["case folding opcional"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-022 · dedupe de lista preservando orden
# A corregir: set desordena / pierde orden de aparición
# Contrato: orden de primera aparición
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
          "E2 (independiente) — Fuerza `role='bcc'` cuando el email es externo (`@other.test`) (CASO-LIM-022). El starter detecta el dominio pero no muta el role. Salida esperada:\nbcc",
        hint: "endswith",
        hints: [
          "endswith",
          "asignar r['role'] = 'bcc'",
        ],
        edgeCases: ["múltiples dominios externos"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-022 · forzar role bcc a externos
# A corregir: no muta role (deja cc)
# Contrato: role final bcc
rows = [{'email': 'p@other.test', 'role': 'cc'}]
for r in rows:
    if r['email'].endswith('@other.test'):
        pass  # no asigna bcc
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
          "E3 (transferencia) — Aplica política de privacidad: mueve externos a bcc y cuenta solo visibles `to`+`cc` (CASO-LIM-022). El starter cuenta el externo en cc. Salida esperada:\n1 ['a@example.pe']",
        hint: "filtrar roles",
        hints: [
          "si dominio externo → role bcc",
          "visibles = to + cc tras la política",
        ],
        edgeCases: ["BCC no es cifrado"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-022 · conteo de visibles to+cc
# A corregir: no mueve externos a bcc
# Contrato: 1 visible interno
rows = [('a@example.pe','to'),('b@other.test','cc')]
vis = []
for em, role in rows:
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
          "E1 (guiado) — Aplica la transición `submit` desde `draft` hacia `pending_review` usando la tabla de transiciones (CASO-LIM-022). El starter salta a `approved`. Salida esperada:\npending_review",
        hint: "dict de dicts",
        hints: [
          "dict de dicts",
          "T[state]['submit'] → pending_review",
        ],
        edgeCases: ["KeyError si acción inválida"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-022 · transición submit draft→pending_review
# A corregir: hardcodea approved saltando submit
# Contrato: estado final pending_review
T = {'draft': {'submit': 'pending_review'}}
state = 'draft'
state = 'approved'
print(state)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `T = {'draft': {'submit': 'pending_review'}}
state = 'draft'
state = T[state]['submit']
print(state)`,
          output: `pending_review`,
        },
      },
      {
        id: "S22-T4-A-E2",
        subtopicId: "S22-T4-A",
        kind: "independent",
        instruction:
          "E2 (independiente) — Intenta `approve` desde `draft`: debe resultar `invalid` (fail-closed) (CASO-LIM-022). Usa `.get` en la tabla. El starter imprime `ok` cuando falta la transición. Salida esperada:\ninvalid",
        hint: "try/except o .get",
        hints: [
          "try/except o .get",
          "None → 'invalid'",
        ],
        edgeCases: ["no silencies errores de auditoría en prod"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-022 · approve inválido desde draft
# A corregir: imprime 'ok' cuando no hay transición
# Contrato: invalid
T = {
    'draft': {'submit': 'pending_review'},
    'pending_review': {'approve': 'approved'},
}
state, action = 'draft', 'approve'
nxt = T.get(state, {}).get(action)
print(nxt if nxt else 'ok')
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `T = {
    'draft': {'submit': 'pending_review'},
    'pending_review': {'approve': 'approved'},
}
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
          "E3 (transferencia) — Implementa `apply(state, action, actor, log)` sobre la máquina canónica (`pending_review`, `needs_edit`). Ejecuta `submit` (draft→pending_review, actor `analyst`) y luego `approve` (pending_review→approved, actor `rev1`). Filtra e imprime **solo** el evento de `approve` con actor (CASO-LIM-022). El starter no registra actor ni usa la tabla. Salida esperada:\n[{'from': 'pending_review', 'to': 'approved', 'action': 'approve', 'actor': 'rev1'}]",
        hint: "apply + log con actor",
        hints: [
          "TRANSITIONS con pending_review y request_edit → needs_edit",
          "append {from, to, action, actor}; imprime [e for e in log if e['action']=='approve']",
        ],
        edgeCases: ["approve desde draft debe ser invalid; audit inmutable en prod"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con el bloque de solución del ejercicio.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-022 · apply SM + log con actor
# A corregir: no usa TRANSITIONS ni registra actor/action
# Contrato: solo el evento approve con actor rev1
TRANSITIONS = {
    'draft': {'submit': 'pending_review'},
    'pending_review': {'approve': 'approved', 'reject': 'rejected', 'request_edit': 'needs_edit'},
    'needs_edit': {'submit': 'pending_review'},
}

def apply(state, action, actor, log):
    # incompleto: no consulta TRANSITIONS ni guarda actor
    log.append({'from': state, 'to': 'approved'})
    return 'approved'

log = []
st = 'draft'
st = apply(st, 'submit', 'analyst', log)
st = apply(st, 'approve', 'rev1', log)
print([e for e in log if e.get('action') == 'approve'])
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `TRANSITIONS = {
    'draft': {'submit': 'pending_review'},
    'pending_review': {'approve': 'approved', 'reject': 'rejected', 'request_edit': 'needs_edit'},
    'needs_edit': {'submit': 'pending_review'},
}

def apply(state, action, actor, log):
    nxt = TRANSITIONS.get(state, {}).get(action)
    if not nxt:
        raise ValueError(f'invalid {state}->{action}')
    log.append({'from': state, 'to': nxt, 'action': action, 'actor': actor})
    return nxt

log = []
st = 'draft'
st = apply(st, 'submit', 'analyst', log)
st = apply(st, 'approve', 'rev1', log)
print([e for e in log if e['action'] == 'approve'])`,
          output: `[{'from': 'pending_review', 'to': 'approved', 'action': 'approve', 'actor': 'rev1'}]`,
        },
      },
      {
        id: "S22-T4-B-E1",
        subtopicId: "S22-T4-B",
        kind: "guided",
        instruction:
          "E1 (guiado) — Calcula la idempotency key de producción del curso: `sha256(b'run|to|v1').hexdigest()[:16]` (mismo contrato que el You Do) (CASO-LIM-022). El starter corta en 6 caracteres. Salida esperada:\n0da400d6c9b3f756",
        hint: "hashlib.sha256",
        hints: [
          "hashlib.sha256",
          "hexdigest()[:16] — no [:6] ni [:8]",
        ],
        edgeCases: ["encoding utf-8 de strings"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-022 · idempotency key sha256[:16]
# A corregir: slice demasiado corto [:6]
# Contrato: 16 hex chars
import hashlib
print(hashlib.sha256(b'run|to|v1').hexdigest()[:6])
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import hashlib
print(hashlib.sha256(b'run|to|v1').hexdigest()[:16])`,
          output: `0da400d6c9b3f756`,
        },
      },
      {
        id: "S22-T4-B-E2",
        subtopicId: "S22-T4-B",
        kind: "independent",
        instruction:
          "E2 (independiente) — Haz `create(key)` idempotente: la segunda llamada con la misma key reutiliza el draft_id (CASO-LIM-022). El starter siempre pisa el store. Salida esperada:\nTrue",
        hint: "cache dict",
        hints: [
          "cache dict",
          "if key in store: return store[key]",
        ],
        edgeCases: ["race conditions"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-022 · create idempotente por key
# A corregir: siempre crea d-nuevo (ignora cache)
# Contrato: create('k') == create('k')
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
          "E3 (transferencia) — Dos intentos con la misma key deben auditar `create` y luego `retry_hit` (CASO-LIM-022). El starter solo registra `create`. Salida esperada:\n['create', 'retry_hit']",
        hint: "lista de event names",
        hints: [
          "si key ya en store → retry_hit",
          "si no → create y guardar",
        ],
        edgeCases: ["incluir timestamps en prod"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-022 · audit create + retry_hit
# A corregir: siempre append create (sin retry_hit)
# Contrato: ['create', 'retry_hit']
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
      "Parte del paquete de informe de S21 (métricas ya reconciliadas). Construye el mini pipeline de notificación: mensaje MIME → destinatario verificado → draft con idempotency key de 16 hex → estado `pending_review` con audit. No envíes correo real. Matching de contactos no implica fraude. En S23 conectarás un adaptador web; aquí el canal es `.eml`/sandbox.",
    objectives: [
      "Generar un .eml/string MIME con text+HTML y adjunto meta",
      "Resolver/verificar al menos un destinatario allowlisted",
      "Crear draft con expiración y clave de idempotencia (sha256[:16])",
      "Dejar estado pending_review con audit log (actor + transición)",
    ],
    requirements: [
      "Sin PII real ni secretos",
      "Ningún envío SMTP real",
      "Destinatario requiere verificación",
      "No inferir fraude desde matching",
      "es-PE en textos de usuario",
      "Máquina de estados con pending_review (no atajos pending)",
    ],
    starterCode: `from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.application import MIMEApplication
import hashlib
from datetime import datetime, timezone, timedelta

run_id = "cpn2c-01"
to = "revisora@example.pe"
allow = {"example.pe"}
# Contrato You Do (inicio CP-N2-C desde paquete S21):
# 1) MIME mixed + alternative (plain+HTML) + adjunto meta del run
# 2) verificar dominio allowlisted del destinatario
# 3) draft store con expires_at + idempotency key sha256[:16]
# 4) submit → pending_review con audit log (actor)
# Sin SMTP real. Match ≠ fraude.
# Aceptación (imprime evidencia al final):
#   verified True | key_len 16 | draft_id d… | state pending_review | audit_events ≥1 con actor

def domain_ok(email: str) -> bool:
    return "@" in email and email.split("@")[1] in allow

def idem_key(run: str, recipient: str, body_ver: int) -> str:
    raw = f"{run}|{recipient}|{body_ver}".encode()
    return hashlib.sha256(raw).hexdigest()[:16]

TRANSITIONS = {
    "draft": {"submit": "pending_review"},
    "pending_review": {
        "approve": "approved",
        "reject": "rejected",
        "request_edit": "needs_edit",
    },
    "needs_edit": {"submit": "pending_review"},
}

def apply(state: str, action: str, actor: str, log: list) -> str:
    nxt = TRANSITIONS.get(state, {}).get(action)
    if not nxt:
        raise ValueError(f"invalid {state}->{action}")
    log.append({"from": state, "to": nxt, "action": action, "actor": actor})
    return nxt

# --- Completa el pipeline ---
# A) msg = MIMEMultipart("mixed") + alt plain/html + adjunto meta (run_id)
# B) assert domain_ok(to); si no, fail-closed (no crees draft)
# C) store = {}; key = idem_key(...); create draft una sola vez (status draft, expires_at)
# D) state = "draft"; state = apply(state, "submit", "analyst", audit)
# E) prints de aceptación abajo (ajusta variables reales)

verified = domain_ok(to)
key = idem_key(run_id, to, 1)
draft_id = None  # p. ej. "d001" tras create_draft
state = "draft"  # debe quedar pending_review tras submit
audit: list = []
# Completa aquí: MIME (mixed+alt+meta), store de draft, apply(submit), y ajusta las variables de aceptación.

print("verified", verified)
print("key_len", len(key))
print("draft_id", draft_id)
print("state", state)
print("audit_n", len(audit))
`,
    portfolioNote:
      "Entregable inicio CP-N2-C: borrador sandbox (.eml o string MIME) + audit de aprobación; listo para web adapter (S23). Aceptación mínima: verified True, key_len 16, draft_id no nulo, state pending_review, audit_n ≥ 1 con actor en el evento de submit.",
    rubric: [
      { criterion: "Gates de seguridad: draft-only, aprobación humana, destinatario verificado, sin SMTP real", weight: "25%" },
      { criterion: "MIME multiparte (plain+HTML+adjunto meta) y draft con expires_at + idempotency key [:16]", weight: "20%" },
      { criterion: "Privacidad / sin PII real / sin secretos / sin inferencia de fraude", weight: "20%" },
      { criterion: "Máquina de estados pending_review + audit con actor y casos de borde documentados", weight: "15%" },
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
        label: "hashlib — digests para idempotency keys",
        url: "https://docs.python.org/3/library/hashlib.html",
        note: "sha256(...).hexdigest()[:16] como en esta sección",
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
        label: "Gmail API — Creating and sending drafts",
        url: "https://developers.google.com/gmail/api/guides/drafts",
        note: "drafts reales vs sandbox; no envío automático",
      },
      {
        label: "RFC 5322 — Internet Message Format",
        url: "https://datatracker.ietf.org/doc/html/rfc5322",
        note: "headers y estructura de mensajes",
      },
      {
        label: "RFC 2045 — MIME Part One",
        url: "https://datatracker.ietf.org/doc/html/rfc2045",
        note: "multiparte, encoding y Content-Type",
      },
      {
        label: "PyArcana live",
        url: "https://pillb.github.io/pyarcana/",
        note: "curso desplegado; sección de email y aprobación humana (CP-N2-C)",
      },
      {
        label: "OWASP Authentication Cheat Sheet",
        url: "https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html",
        note: "auth conceptual; scopes mínimos",
      },
      {
        label: "NIST AI RMF — human oversight (HITL)",
        url: "https://www.nist.gov/itl/ai-risk-management-framework",
        note: "aprobación humana y accountability en flujos automatizados",
      },
    ],
  },
}
