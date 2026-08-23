import type { CourseSection } from '../../types'

export const section22: CourseSection = {
  id: "rapidfuzz-entity",
  index: 22,
  title: "Email, identidad y aprobación humana",
  shortTitle: "Email y aprobación",
  tagline:
    "Crea borradores en sandbox o archivos .eml. Ningún correo real se envía automáticamente; todo destinatario requiere confirmación humana.",
  estimatedHours: 19,
  level: "Práctica independiente",
  phase: 1,
  icon: "Mail",
  accentColor: "bg-gradient-to-br from-blue-500 to-indigo-600",
  jobRelevance:
    "En una mesa de control de operaciones o RPA (tickets, alertas, notificaciones a clientes en Lima o Arequipa), el peaje más caro no es «enviar el correo»: es enviarlo mal — destinatario incorrecto, HTML inseguro, un reintento que duplica el mensaje o un bot con scopes de más. Aquí aprendes a separar borrador → aprobación humana → envío, dejando evidencia de quién aprobó, con qué draft y bajo qué key. El producto es un draft de sandbox fail-closed que una revisora de turno puede inspeccionar antes de cualquier acción de envío (simulada).",
  learningOutcomes: [
    { text: "Construir mensajes MIME multiparte (plain+HTML+adjunto) con UTF-8 y serializarlos a `.eml`/string" },
    { text: "Sanitizar templates HTML con escape y allowlist de host real (sin substring)" },
    { text: "Diseñar OAuth/service account con scopes mínimos orientados a draft" },
    { text: "Crear drafts vía adaptadores con expiración y store de sandbox" },
    { text: "Resolver y verificar destinatarios sintéticos (dominio allowlisted, match ≠ fraude)" },
    { text: "Aplicar privacidad y mínima divulgación en listas (dedupe, externos a BCC)" },
    { text: "Implementar cola de aprobación con máquina de estados canónica (pending_review / needs_edit)" },
    { text: "Garantizar idempotencia (sha256[:16]), audit log con actor y reintentos sin duplicar" },
  ],
  theory: [
    {
            heading: "El último paso antes de que un mensaje salga hacia una persona",
      paragraphs: [
        "Todo lo anterior producía artefactos que alguien iba a buscar. Un correo es distinto: llega sin que nadie lo pida, a una dirección concreta, y no se puede deshacer. Por eso esta sección construye el canal de notificación con una condición que no se negocia — lo que el sistema prepara es un **borrador**, y quien decide enviarlo es una persona.",
        "Esa decisión de diseño ordena todo lo demás. El sistema puede resolver a quién correspondería avisar, redactar el asunto y el cuerpo a partir del reporte ya reconciliado, adjuntar lo que haga falta y dejarlo listo. No aprieta el botón. La aprobación humana no es un trámite añadido al final: es el control que hace responsable a un flujo automático que toca a terceros.",
        "Hay un error de destinatarios que se comete una sola vez y se recuerda para siempre: poner en copia visible a una lista de personas que no se conocen entre sí. Eso expone las direcciones de todas a todas. La copia oculta existe justamente para eso, y la regla es de mínima divulgación — cada destinatario recibe lo que necesita y nada sobre los demás.",
        "El contenido también necesita cuidado. Un asunto que resume el caso puede filtrar información sensible en la bandeja de entrada de alguien, visible en la pantalla de bloqueo del teléfono. Y el cuerpo se construye con la misma disciplina de S21: plantilla que escapa lo que inserta, datos que vienen de la corrida y no de la memoria de nadie.",
        "La pregunta que gobierna la sección es la que conviene hacerse antes de cada envío: **¿quién recibe esto, qué ve exactamente, y quién autorizó que saliera?** Ninguna ruta de la lección envía correo real: se generan archivos locales o borradores en un entorno de pruebas, con contactos de laboratorio.",
      ],
      callout: {
        type: "info",
        title: "Límite operativo (gates)",
        content:
          "Solo se crean `.eml` locales o drafts de sandbox con contactos de laboratorio (`@example.pe` es allowlist del curso, no un dominio “imposible de enrutar” por RFC). Ninguna ruta de la lección envía correo real. Sin `pending_review` aprobado por humano, el pipeline no promueve el draft.",
      },
     },
     {
      heading: "Contrato de la sección (referencia)",
      optional: true,
      paragraphs: [
        "Bloque de referencia. Orden de los subtemas y contexto del capstone.",
        "**Orden de los subtemas.** T1 arma el mensaje: estructura MIME y plantillas seguras. T2 pasa al proveedor: autorización, alcances y adaptadores de borrador. T3 trata al destinatario: resolución, verificación, copia oculta y mínima divulgación. T4 cierra con la aprobación humana y el rastro de auditoría.",
        "**Contexto.** Aquí inicia CP-N2-C, el canal de notificación con aprobación humana, que toma el paquete de reporte ya reconciliado en S21 y prepara el borrador seguro.",
        "**Seguridad del laboratorio.** Solo se crean archivos `.eml` locales o borradores en entorno de pruebas, con contactos del curso.",
      ],
      code: {
        language: 'python',
        title: "s22_map_contract.py",
        code: `def section_contract():
    return {
        "case": "Caso 22",
        "gates": ["draft_only_no_auto_send", "human_approval", "idempotent_retry", "synthetic_recipients"],
        "auto_send_ok": False,
    }

c = section_contract()
print("case", c["case"])
print("gates", len(c["gates"]))
print("auto_send_ok", c["auto_send_ok"])
`,
        output: `case Caso 22
gates 4
auto_send_ok False`,
      },
     },
     {
      heading: "MIME, encoding, HTML/text y attachments",
      subtopicId: "S22-T1-A",
      paragraphs: [
        "**MIME** (`email.mime`) es el formato con el que construyes un correo profesional: no es un string suelto, sino un **árbol** de partes con tipo, charset y disposición. En operaciones (mesa de control, tickets, notificaciones a clientes sintéticos) el borrador suele llevar text/plain + text/html + un adjunto de meta del run. Charset **UTF-8** evita mojibake en nombres y acentos del español peruano. `MIMEMultipart('alternative')` ofrece ambas representaciones del cuerpo; el cliente de correo elige cuál mostrar.",
        "Contrato operativo: `MIMEText(..., 'plain'|'html', 'utf-8')` para el cuerpo; adjuntos con `MIMEApplication` + header `Content-Disposition` y `filename` legible. **Nunca** incrustes secretos (tokens OAuth, DNI, contraseñas) en el cuerpo ni en el nombre del archivo. Limita el tamaño de adjuntos de laboratorio y márcalos como demo. Serializar con `as_string()` te deja inspeccionar el árbol antes de guardarlo como `.eml`.",
        "Caso sintético Caso 22: `MIMEText('Hola','plain','utf-8')` produce content-type `text/plain`; un contenedor `mixed` con `alternative` (plain+html) y `MIMEApplication` de `meta.txt` genera varios headers `Content-Type`. Contar esos headers en los ejercicios guiados valida que el árbol multiparte quedó bien anidado — base del borrador que luego pedirá aprobación humana.",
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
          "Incluye plain text además de HTML: muchos clientes y filtros anti-spam lo exigen. El adjunto de meta (campo `run_id`, sin secretos) ayuda a la revisora a auditar el `.eml` sin abrir un portal.",
      },
    },
    {
      heading: "Templates y sanitización de HTML",
      subtopicId: "S22-T1-B",
      paragraphs: [
        "Los **templates** de correo interpolan variables de negocio (nombre de contacto, `run_id`, montos del informe de S21). Cualquier dato que no sea 100 % confiable se trata como **no confiable**: se escapa con `html.escape` (o autoescape del motor de plantillas). Eso es **escape contextual**, el primer control obligatorio; no sustituye un sanitizador HTML de producción ni un render seguro de plantillas. La política de links usa allowlist de **hosts reales** (`example.pe` o subdominios propios) o rutas relativas, y bloquea los esquemas `javascript:` y `data:`. **Nunca** uses substring (`'example.pe' in url`). Un host como `example.pe.evil.test` lo burlaría, y el curso no enseña ese bypass como solución.",
        "Contrato: el template `Hola {name}` con `name = '<b>Ana</b>'` debe producir entidades HTML escapadas (`&lt;b&gt;…`), no markup activo. Para links: parsea el host (`urlparse` o strip del esquema) y compara **igualdad exacta** o sufijo de subdominio controlado; cualquier otro host → `blocked` / enlace neutralizado. XSS (inyección de script en sitio) en el cuerpo del correo es phishing interno real: una revisora de la mesa puede hacer clic en un enlace malicioso si el pipeline no sanitiza.",
        "Caso sintético: el cuerpo del borrador incluye un enlace al portal de revisión del run. Sin allowlist correcta, un fragmento malicioso redirige a un dominio externo. Por eso el gate de sanitización es **obligatorio** antes de encolar el draft en `pending_review`: la revisora humana debe ver HTML seguro, no un vector de ataque.",
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
          "Nunca marques como safe un string de destinatario o de un documento OCR (reconocimiento óptico de caracteres) sin sanitizar.",
      },
    },
    {
      heading: "OAuth, service account y scopes",
      subtopicId: "S22-T2-A",
      paragraphs: [
        "Cuando un bot de notificaciones habla con Gmail u otro proveedor, no “inicia sesión” con contraseña en el código: usa **OAuth** (o, en Workspace, una **service account** con delegación de dominio e impersonación explícita). En este laboratorio modelamos **capacidades sintéticas** (`mail.draft`, `mail.readonly`, `mail.send`, `mail.full`) para practicar least privilege sin acoplarte a un proveedor. En Gmail real los scopes son URI (p. ej. `https://www.googleapis.com/auth/gmail.compose`) y **no hay** un scope universal “solo crear draft”: `gmail.compose` también puede enviar. Por eso el gate draft-only del curso es **política de aplicación** + scopes justos del proveedor, no magia del token.",
        "Contrato de least privilege: `granted ⊆ allowed` y `requested ∩ allowed` define lo que se pide de verdad. Imprimes evidencia de que `granted` no contiene capacidades peligrosas del lab (`mail.full`, `admin`, a veces `mail.send` si el producto es draft-only). Los tokens del curso son sintéticos; lo que evalúas es el **diseño de permisos** y la separación adaptador/workflow, no un flujo OAuth real de producción.",
        "Caso: el pipeline pide `mail.draft` y por error también `mail.full`. La política filtra a `allowed` y deja `granted` sin privilegios de envío masivo. En sandbox, un scope de más es un **hallazgo de seguridad del diseño**, no un “detalle de configuración” que se ignora. La mesa de control puede auditar scopes pedidos vs. concedidos en el mismo paquete de evidencia del run.",
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
          "En el lab, deniega `mail.send`/`mail.full` si solo creas drafts. En Gmail real, revisa el URI de scope: `gmail.compose` puede enviar; el fail-closed del producto (sin botón send + HITL) sigue siendo obligatorio.",
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
        title: "Patrón adaptador",
        content:
          "El dominio llama `create_draft`; el adaptador decide Gmail API vs. archivo `.eml` local. Así el workflow de aprobación no se acopla al SDK del proveedor.",
      },
    },
    {
      heading: "Resolución y verificación de destinatarios",
      subtopicId: "S22-T3-A",
      paragraphs: [
        "Antes de poner un `To:` en el borrador, el pipeline **resuelve** y **verifica** al destinatario. Resolución: mapear un id de negocio (`C001`) a un email desde un directorio sintético. Verificación: formato básico, dominio allowlisted (`example.pe`) y estado activo. Los estados del contacto van de `unresolved` → `candidate` → `verified` | `rejected`. Sin `verified`, fail-closed: no se encola aprobación para envío (aunque en el curso solo simules).",
        "Contrato ético y técnico: si usas un score de similitud de nombres o emails, **siempre** acompáñalo de la nota **`match_no_es_fraude`**. En el ejercicio de transferencia calculas un prefijo común que da **0.86**. El self-check usa **0.92** solo como número de un MCQ (pregunta de opción múltiple) ético. En ambos casos un score “alto” **no** autoriza claims de identidad legal, parentesco ni colusión: solo prioriza la revisión de **entrega correcta**. Matching de contactos ≠ investigación de fraude.",
        "Caso: `ana@example.pe` pasa formato y dominio; `bad` se rechaza; `C001` queda `verified` en el directorio de laboratorio; `C002` con dominio no allowlisted queda `rejected`. Si el id no existe, el estado es `unresolved` y la mesa de control decide a mano. Al comparar dos strings de email, el ejercicio imprime el score sintético **0.86** y la nota anti-claim — nunca `fraude_probable`.",
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
        "**CC** expone a todos los destinatarios entre sí (en jerga de operaciones, “filtra” significa filtrar o exponer la lista de quién trabaja el caso). **BCC** oculta la lista a los demás. Cuando hay externos (p. ej. un partner fuera de `@example.pe`), prefiere BCC o envíos individuales. **Mínima divulgación**: no pongas DNI, teléfono ni secretos en el cuerpo si el detalle ya vive en el adjunto controlado o en un portal con acceso acotado.",
        "Contrato de higiene de listas: (1) dedupe preservando el orden de primera aparición; (2) forzar `role='bcc'` si el dominio es externo; (3) contar cuántos emails quedarían **visibles** (`to`+`cc`) tras la política. En laboratorio también modelas tope de tamaño de lista y un flag sintético de opt-out — hábitos que luego mapean a políticas reales de la mesa.",
        "Caso: la lista trae duplicados de `ana@example.pe` y un `externo@other.test` en CC. Tras higiene, el externo pasa a BCC y el conteo de visibles baja. El audit del run registra la política aplicada. Esto es **privacidad operativa** del día a día, no una lista de verificación de cumplimiento que se tacha y se olvida.",
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
          "Un CC masivo expone a todos entre sí (en jerga de operaciones, “filtra” significa filtrar o exponer la lista de trabajo). Usa BCC o tickets internos cuando haya externos.",
      },
    },
    {
      heading: "Cola de aprobación y máquina de estados",
      subtopicId: "S22-T4-A",
      paragraphs: [
        "La **cola de aprobación** es el corazón human-in-the-loop de CP-N2-C: una máquina de estados `draft` → `pending_review` → `approved` | `rejected` | `needs_edit`. Cada transición lleva **actor** (quién) y, en producción, timestamp. Sin transición válida, fail-closed: no hay envío ni promoción del draft. En tu código y en el You Do usa siempre `pending_review` (nunca el atajo `pending`) y `needs_edit` cuando la revisora pide cambios.",
        "Contrato: tabla `TRANSITIONS` como única fuente de verdad. `submit` desde `draft` → `pending_review`; `approve` desde `draft` → `invalid`; `request_edit` desde `pending_review` → `needs_edit` y luego otro `submit`. La UI y los jobs leen el estado; no “envían porque alguien pulsó un botón” sin validar la máquina. En mesa de control, un `pending_review` sin respuesta dentro del SLA suele **escalar** a la revisora de turno o volver a `needs_edit` con nota — no se autoaprueba por timeout. En CP-N2-C la aprobación humana es **obligatoria** antes de cualquier acción de envío (aunque el curso solo simule el envío).",
        "Caso de laboratorio: el analista hace `submit`; la revisora `rev1` hace `approve` y el log registra `{from: pending_review, to: approved, action, actor}`. Si alguien intenta aprobar desde `draft`, el sistema responde `invalid`. El portfolio adjunta ese audit: evidencia de cumplimiento y de fail-closed para el hilo que en S23 saldrá a un adaptador web.",
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
    intro: "Te muestro el inicio de CP-N2-C a partir del paquete de S21: MIME seguro, scopes, drafts con expiración, destinatarios verificados y cola de aprobación. Todo sin envío real ni inferencia de fraude. En cada demo, fíjate en la **decisión** (no solo en el print):\n- por qué draft y no send;\n- por qué parsear el host y no un substring;\n- por qué denegar `mail.full`;\n- por qué un externo va a BCC;\n- por qué fail-closed ante una transición inválida;\n- por qué la key de 16 hex evita spam al reintentar.",
    steps: [
      {
        demoId: "S22-T1-A-DEMO",
        subtopicId: "S22-T1-A",
        environment: "local/sandbox proveedor",
        description: "Construir mensaje MIME multi-parte seguro (text+HTML+adjunto sintético).",
        preamble:
          "Antes de encolar un borrador de CP-N2-C, el analista debe *ver* un mensaje como árbol MIME, no como un string suelto. En esta demo se arma `mixed` con `alternative` (texto plano + HTML) y un adjunto de meta del run (`run.json`, sin secretos). No escribas aún: sigue los `print` y comprueba que el serializado contiene el adjunto y UTF-8. Si confundes “pegar HTML” con un correo multiparte, la revisora de la mesa no puede auditar el `.eml` con claridad.",
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
        why:
          "Decisión: plain+HTML+meta del run en un solo árbol MIME, sin secretos en el cuerpo. Plain y HTML cubren clientes y filtros anti-spam; el adjunto de meta enlaza el run de S21 sin tokens ni DNI; `as_string()` permite inspeccionar el `.eml` antes de guardar. La revisora de la mesa audita el árbol completo, no un string HTML suelto. En We Do corregirás subtype, Disposition y anidado.",
        retrospective:
          "Si puedes explicar por qué un correo de mesa lleva plain y HTML en `alternative` dentro de `mixed`, ya tienes el hábito de árbol MIME. El error clásico es un solo `MIMEText` HTML sin meta del run. En We Do practicarás plain UTF-8, filename legible y el conteo de `Content-Type`.",
      },
      {
        demoId: "S22-T1-B-DEMO",
        subtopicId: "S22-T1-B",
        environment: "local/sandbox proveedor",
        description: "Sanitizar HTML de templates de correo con escape y allowlist de host real.",
        preamble:
          "Un template de correo interpola datos de negocio; cualquier fragmento no confiable es un vector. En esta demo se escapa HTML y se valida el **host real** de cada URL (no un substring). Observa tres destinos: un host malicioso, `example.pe` legítimo y el bypass `example.pe.evil.test`. No escribas: predice qué queda como enlace y qué se bloquea. Si confías en `'example.pe' in url`, el phishing interno gana.",
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
        why:
          "Decisión: escapamos HTML y validamos el **host real** (`urlparse` / strip de esquema). El escape contextual es el primer control; parsear el host evita el bypass de subdominio malicioso. Un substring `'example.pe' in url` aceptaría `example.pe.evil.test` — el curso lo rechaza como solución. En We Do practicarás escape, interpolación segura y allowlist con `urlparse`.",
        retrospective:
          "Host real + escape es el hábito anti-XSS del canal de correo. El error clásico es confiar en substring del dominio. Pregunta: sin mirar el código, ¿por qué `example.pe.evil.test` engaña a un `in` y no a igualdad de host? We Do: escapar script, saludar con nombre seguro y clasificar URL con `urlparse`.",
      },
      {
        demoId: "S22-T2-A-DEMO",
        subtopicId: "S22-T2-A",
        environment: "local/sandbox proveedor",
        description: "Configurar scopes mínimos en sandbox y detectar exceso de privilegios.",
        preamble:
          "Un bot de notificaciones de CP-N2-C solo necesita crear drafts, no enviar ni administrar. En esta demo se piden scopes sintéticos (`mail.draft`, `mail.send`, `mail.full`) y una política máxima de laboratorio filtra lo concedido. No escribas: predice qué queda en `granted` y qué se deniega. Si dejas `mail.full` “por si acaso”, un token filtrado multiplica el daño en la mesa de control.",
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
        why:
          "Decisión: si el producto solo crea drafts, denegar `mail.send` y `mail.full` reduce el impacto de un token filtrado. Least privilege es diseño de producto, no un flag opcional. En Gmail real los URI de scope no magizan “solo draft”; el fail-closed de envío sigue siendo HITL + política de aplicación. En We Do filtrarás a allowed y comprobarás scopes peligrosos.",
        retrospective:
          "Granted debe ser la intersección con lo permitido, no la lista soñada. El error clásico es pedir `mail.full` “para no fallar después”. Pregunta: si el token se filtra, ¿qué daño extra abre `mail.send` frente a solo `mail.draft`? We Do: filtrar a allowed, `isdisjoint` con peligrosos y clasificar por `expires_at`.",
      },
      {
        demoId: "S22-T2-B-DEMO",
        subtopicId: "S22-T2-B",
        environment: "local/sandbox proveedor",
        description: "Crear drafts vía adaptador con expiración.",
        preamble:
          "El workflow de aprobación no debe acoplarse al SDK de Gmail: llama `create_draft` y pregunta si el borrador sigue usable. En esta demo un adaptador en memoria crea un draft con expiración y reporta si ya caducó. No escribas: observa id, `expired` y el tamaño del store. Si promueves un draft viejo, la revisora aprueba cifras del informe que ya no existen en S21.",
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
        why:
          "Decisión: la expiración fuerza regenerar y reaprobar contenido viejo (cifras del informe de S21 pueden haber cambiado). El adaptador es dueño del ciclo de vida; el workflow solo pregunta si el draft sigue usable. En este curso solo `.eml` o sandbox: cero SMTP real. Un draft caducado no se promueve a envío.",
        retrospective:
          "Draft usable = status `draft` y `now < expires_at`. El error clásico es reutilizar un id caducado “porque ya está en el store”. Pregunta: si las cifras de S21 cambiaron, ¿qué debe regenerarse antes de un nuevo `pending_review`? We Do: status vs. key, usable y mini adaptador con ids secuenciales.",
      },
      {
        demoId: "S22-T3-A-DEMO",
        subtopicId: "S22-T3-A",
        environment: "local/sandbox proveedor",
        description: "Resolver y verificar destinatarios sintéticos (match ≠ fraude).",
        preamble:
          "Antes de poner un `To:` en el borrador, el pipeline resuelve y verifica al destinatario sintético. En esta demo tres ids: dominio allowlisted, dominio externo y no encontrado. Observa los estados `verified` / `rejected` / `unresolved` y el disclaimer final. No escribas: predice qué id puede entrar al draft. Matching de nombres o emails no prueba fraude ni parentesco — solo prioriza entrega correcta.",
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
        why:
          "Decisión: solo contactos verificados entran al To del draft. Sin `verified`, fail-closed: no se encola aprobación. El dominio allowlisted es gate de laboratorio; el disclaimer anti-claim es parte del producto, no un comentario opcional. Matching de nombres o emails no prueba fraude ni parentesco — solo prioriza revisión de entrega correcta.",
        retrospective:
          "Solo contactos verificados entran al `To`. El error clásico es tratar un match alto como prueba de identidad o fraude. Pregunta: sin `verified`, ¿el pipeline encola `pending_review` o hace fail-closed? We Do: formato, dominio allowlisted y score con nota `match_no_es_fraude`.",
      },
      {
        demoId: "S22-T3-B-DEMO",
        subtopicId: "S22-T3-B",
        environment: "local/sandbox proveedor",
        description: "Aplicar mínima divulgación: externos a BCC y dedupe.",
        preamble:
          "En operaciones, un CC masivo **expone** quién trabaja el caso; BCC oculta la lista a los demás. En esta demo hay duplicados de `ana@example.pe` y un partner externo en CC. Observa cómo queda la lista limpia y por qué el externo termina en BCC. No escribas: predice el orden y los roles finales. Datos sintéticos, sin PII (información personal identificable) real.",
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
        why:
          "Decisión: todo lo que no es @example.pe va a BCC. Dedupe preserva la primera aparición; dominio externo fuerza BCC. Un CC masivo expone la lista de trabajo del caso; mínima divulgación es hábito diario de la mesa, no lista de verificación de cumplimiento olvidable. BCC o tickets internos protegen la privacidad operativa.",
        retrospective:
          "Higiene de listas = dedupe + BCC a externos + contar visibles. El error clásico es CC “por comodidad” cuando hay partners. Pregunta: BCC oculta la lista a los demás — ¿cifra el cuerpo? We Do: orden estable, forzar BCC y conteo de visibles tras la política.",
      },
      {
        demoId: "S22-T4-A-DEMO",
        subtopicId: "S22-T4-A",
        environment: "local/sandbox proveedor",
        description: "Modelar cola de aprobación con estados canónicos (pending_review) y actor en el audit.",
        preamble:
          "La cola de aprobación es el corazón human-in-the-loop de CP-N2-C: `draft` → `pending_review` → `approved` | `rejected` | `needs_edit`. En esta demo el analista hace `submit` y la revisora `rev1` hace `approve`; el log guarda from/to/action/actor. No escribas: sigue el trail y el último actor. Si alguien “aprueba” desde draft sin pasar por la tabla, no hay audit ni fail-closed — y el destinatario sintético queda desprotegido.",
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
    state, log = "draft", []
    for act, actor in (("submit", "analyst"), ("approve", "rev1")):
        prev = state
        state = sm[state][act]
        log.append({"from": prev, "to": state, "action": act, "actor": actor})
    print("final", state)
    print("trail", [e["to"] for e in log])
    print("last_actor", log[-1]["actor"])

s22_ido_7()`,
          output: `final approved
trail ['pending_review', 'approved']
last_actor rev1`,
        },
        why:
          "Decisión: solo `submit` mueve draft→pending_review; `approve` lleva actor (`rev1`) al audit. El actor es accountability. Los estados canónicos son `pending_review`/`needs_edit` (nunca el atajo `pending`). `approve` desde draft no existe en la tabla — fail-closed protege al destinatario y deja rastro de quién actuó.",
        retrospective:
          "El estado es la verdad; el botón no envía sin la máquina. El error clásico es hardcodear `approved` o el atajo `pending`. Pregunta: ¿quién aparece como actor en el último evento del trail de la demo? We Do: transición submit, fail-closed invalid y apply con actor en el log.",
      },
      {
        demoId: "S22-T4-B-DEMO",
        subtopicId: "S22-T4-B",
        environment: "local/sandbox proveedor",
        description: "Reintentar sin duplicar drafts con idempotency key de 16 hex.",
        preamble:
          "Un reintento de red o un doble clic del operador no debe spamear al destinatario sintético. En esta demo la key es `sha256(...).hexdigest()[:16]` del payload del run; la segunda llamada a `once` devuelve el mismo draft y marca duplicado. No escribas: predice si `a==b` y qué flags de duplicado salen. Si cada reintento crea un draft nuevo, la mesa multiplica notificaciones y rompe el contrato de CP-N2-C.",
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
        why:
          "Decisión: la key de 16 hex es el contrato único de S22 (teoría, ejercicios y You Do); el segundo `once` devuelve el mismo draft_id y marca duplicado. Retry no es reenviar: no spamea al cliente. Cambiar `body_ver` genera una key nueva y un draft distinto. En We Do construirás la key, el create idempotente y el audit create/retry_hit.",
        retrospective:
          "Misma key → mismo draft_id. El error clásico es “crear siempre” por miedo a un KeyError y spamear al destinatario sintético. Pregunta: si el segundo `once` devolviera `draft-002`, ¿qué gate de CP-N2-C se rompió? We Do: construir la key de 16 hex, create idempotente y audit create/retry_hit.",
      },
    ],
  },
  weDo: {
    intro: "Practica en 24 ejercicios con liberación gradual (guiado → independiente → transferencia): MIME, sanitización, OAuth scopes, drafts, resolución, privacidad de listas, máquina de estados e idempotencia. Cada starter del Caso 22 trae un error deliberado — no un esqueleto vacío sin intención pedagógica. Lee el contrato de salida (líneas exactas) antes de editar; cuando pases, la consola debe coincidir con el bloque solución. En transferencia (E3) el problema se presenta en un escenario un poco más amplio: no es solo “cambiar un print”.",
    steps: [
      {
        id: "S22-T1-A-E1",
        subtopicId: "S22-T1-A",
        kind: "guided",
        title: "MIMEText plain con charset UTF-8",
        preamble:
          "- **Contexto:** el cuerpo mínimo de un borrador de Caso 22 debe ser legible en español peruano y auditable en el `.eml`.\n- **Meta:** construir un `MIMEText` en texto plano con charset UTF-8 (no HTML ni ascii inventado).\n- **Éxito:** dos líneas exactas: `text/plain` y `utf-8`.\n- **Límites:** no uses subtype `html` en este ejercicio; no hardcodees el charset en el segundo print.",
        instruction:
          "1. Abre el starter: `MIMEText(..., 'html', ...)` e imprime `'ascii'` (bug nombrado).\n2. Cambia el subtype a `'plain'`.\n3. Imprime `get_content_type()` y `str(get_charset())`.\n4. No alteres el cuerpo `'Hola'`.",
        hint: "from email.mime.text import MIMEText",
        hints: [
          "from email.mime.text import MIMEText",
          "subtype 'plain' y charset 'utf-8'; usa get_content_type y get_charset.",
        ],
        edgeCases: ["charset None en algunos builds — usa utf-8 explícito"],
        tests: "salida coincide con solution output",
        feedback:
          "`text/plain` + `utf-8` es el cuerpo mínimo legible en español peruano. Si dejas `html` o imprimes `ascii`, la revisora ve un tipo incorrecto o mojibake en el `.eml` de laboratorio.",
        retrospective:
          "El cuerpo plain con UTF-8 es la base del árbol multiparte que la mesa audita en el `.eml`. “Solo HTML” o un charset inventado en el print miente a la revisora. Pregunta: si el cuerpo tiene acentos peruanos, ¿qué falla primero — el subtype o el charset? Siguiente (E2): adjunto con `Content-Disposition` y filename legible.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Caso 22 · MIMEText plain utf-8
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
        title: "Adjunto con filename en Disposition",
        preamble:
          "- **Contexto:** la revisora abre el `.eml` y espera un adjunto con nombre legible, no bytes anónimos.\n- **Meta:** armar `MIMEMultipart('mixed')` con adjunto y `Content-Disposition` que declare `filename=\"a.txt\"`.\n- **Éxito:** un solo `True` al buscar `filename=\"a.txt\"` en `as_string()`.\n- **Límites:** el parámetro `Name` del Content-Type no sustituye la disposición; no inventes otro filename.",
        instruction:
          "1. Revisa el starter: `MIMEApplication(b'x')` sin nombre (bug).\n2. Pasa `Name='a.txt'` al construir el adjunto.\n3. Asigna `Content-Disposition` con `filename=\"a.txt\"`.\n4. Deja el print de contención en el serializado.",
        hint: "MIMEMultipart + attach",
        hints: [
          "MIMEApplication(b'x', Name='a.txt') y luego Content-Disposition",
          "att['Content-Disposition'] = 'attachment; filename=\"a.txt\"'",
        ],
        edgeCases: [
          "Name= en Content-Type no sustituye a Content-Disposition filename para clientes de correo",
        ],
        tests: "salida coincide con solution output",
        feedback:
          "La revisora de la mesa abre el `.eml` y espera un adjunto con nombre legible. `Content-Disposition` con filename es lo que ven los clientes. El `Name` del Content-Type no basta como contrato de entrega.",
        retrospective:
          "Los clientes leen el filename en la disposición; el `Name` del Content-Type no es el contrato de entrega. Confundir ambos deja adjuntos “sin nombre” en la mesa. Pregunta: si la revisora solo ve `application/octet-stream`, ¿qué header mirarías primero? Luego (E3) anidas `alternative` y cuentas los `Content-Type`.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Caso 22 · MIMEMultipart mixed + adjunto con filename
# A corregir: adjunto sin Name ni Content-Disposition filename
# Contrato: filename="a.txt" debe aparecer en as_string()
from email.mime.multipart import MIMEMultipart
from email.mime.application import MIMEApplication
msg = MIMEMultipart('mixed')
msg['Subject'] = 'Test'
att = MIMEApplication(b'x')
# falta Name y Content-Disposition con filename="a.txt"
msg.attach(att)
print('filename="a.txt"' in msg.as_string())
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
print('filename="a.txt"' in msg.as_string())`,
          output: `True`,
        },
      },
      {
        id: "S22-T1-A-E3",
        subtopicId: "S22-T1-A",
        kind: "transfer",
        title: "Contar Content-Type del árbol anidado",
        preamble:
          "- **Contexto:** un borrador profesional no pega plain suelto en `mixed`; anida `alternative` para plain+HTML.\n- **Meta:** construir mixed → alternative → plain+html y validar el árbol contando headers `Content-Type:`.\n- **Éxito:** un entero `4`.\n- **Límites:** no adjuntes solo plain al mixed; orden plain antes de html recomendado; no envíes SMTP.",
        instruction:
          "1. El starter adjunta solo plain al mixed (bug).\n2. Crea `MIMEMultipart('alternative')` y adjunta plain + html.\n3. Adjunta `alt` al `mixed`.\n4. Imprime `as_string().count('Content-Type:')`.",
        hint: "alternative dentro de mixed",
        hints: [
          "alternative dentro de mixed",
          "alt.attach dos MIMEText; luego msg.attach(alt)",
        ],
        edgeCases: ["orden plain antes de html recomendado"],
        tests: "salida coincide con solution output",
        feedback:
          "Un árbol mixed → alternative → plain+html produce 4 Content-Type (raíz, alt, plain, html). Contarlos es la prueba rápida de que el anidado quedó bien antes de encolar el draft.",
        retrospective:
          "Contar `Content-Type` es la prueba rápida de que el anidado quedó bien (raíz, alt, plain, html). El error clásico es un solo attach sin capa alternative. Pregunta de cierre: ¿qué faltaría para el adjunto de meta del run en el You Do?",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Caso 22 · alternative text+html anidado
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
        title: "Escapar fragmento con html.escape",
        preamble:
          "- **Contexto:** un fragmento de usuario o de OCR no debe convertirse en markup activo dentro del correo de Caso 22.\n- **Meta:** aplicar `html.escape` antes de mostrar el fragmento.\n- **Éxito:** una línea `&lt;script&gt;x&lt;/script&gt;`.\n- **Límites:** no imprimes el crudo; no uses un sanitizador inventado; datos sintéticos.",
        instruction:
          "1. El starter imprime `raw` sin escape (bug).\n2. Importa `html` (ya está).\n3. Imprime `html.escape` del fragmento con script.\n4. No alteres el string de prueba.",
        hint: "import html",
        hints: [
          "import html",
          "html.escape",
        ],
        edgeCases: ["quote=True por defecto en atributos"],
        tests: "salida coincide con solution output",
        feedback:
          "Sin escape, un fragmento de usuario se convierte en markup activo dentro del correo. `html.escape` es el primer control obligatorio antes del template — sin él, XSS en el cuerpo del borrador.",
        retrospective:
          "`html.escape` es el primer control obligatorio del template: sin él, un fragmento de OCR o directorio se vuelve markup activo. El error clásico es confiar en el string “porque viene del sistema”. Pregunta: ¿escape sustituye a un sanitizador de producción, o solo es el primer gate? Siguiente (E2): interpolar el nombre solo después de escapar.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Caso 22 · html.escape de script
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
        title: "Saludar con nombre ya escapado",
        preamble:
          "- **Contexto:** el nombre del destinatario puede traer tags de un OCR o de un campo sucio; el saludo no debe activar markup.\n- **Meta:** interpolar `<b>Ana</b>` solo después de `html.escape`.\n- **Éxito:** `Hola &lt;b&gt;Ana&lt;/b&gt;`.\n- **Límites:** no concatenes el name crudo; evita doble escape si el template ya escapa (aquí no).",
        instruction:
          "1. Revisa el starter: `'Hola ' + name` sin escape (bug).\n2. Escapa `name` con `html.escape`.\n3. Concatena e imprime solo la línea pedida.\n4. No uses f-string con HTML crudo.",
        hint: "escape antes de format",
        hints: [
          "escape antes de format",
          "no uses f-string con HTML crudo",
        ],
        edgeCases: ["doble escape si el template ya escapa"],
        tests: "salida coincide con solution output",
        feedback:
          "El nombre del destinatario llega del directorio o de un OCR: trátarlo como no confiable. Escapa primero, saluda después — el orden del hábito evita XSS en el cuerpo.",
        retrospective:
          "Un nombre “del directorio” no es confiable: el hábito es tratar todo campo de negocio como no confiable hasta escaparlo. El error clásico es un f-string con HTML crudo “porque se ve bien en la consola”. Pregunta: si el template del motor ya autoescape, ¿qué riesgo introduce un segundo `html.escape`? Luego (E3) clasificas URL con host real, no con substring.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Caso 22 · interpolación con escape
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
        title: "Allowlist de host real con urlparse",
        preamble:
          "- **Contexto:** un enlace en el borrador de revisión puede ser phishing si el host no está en la allowlist del laboratorio.\n- **Meta:** clasificar URL aceptando solo host exactamente `example.pe` vía `urlparse`.\n- **Éxito:** dos líneas — `https://example.pe/a ok` y `https://evil.test blocked`.\n- **Límites:** igualdad exacta de host (no `'example.pe' in url`); el bypass `example.pe.evil.test` no debe pasar en tu prueba mental.",
        instruction:
          "1. El starter imprime siempre `ok` (bug).\n2. Obtén `urlparse(u).hostname`.\n3. Imprime `ok` solo si host == `'example.pe'`; si no, `blocked`.\n4. No uses substring del URL completo.",
        hint: "urlparse(u).hostname",
        hints: [
          "from urllib.parse import urlparse",
          "host == 'example.pe' (igualdad exacta, no 'in url')",
        ],
        edgeCases: ["Subdominios maliciosos como example.pe.evil.test: el host real no es example.pe."],
        tests: "salida coincide con solution output",
        feedback:
          "Parsea el host real (`urlparse.hostname`). Un substring `'example.pe' in url` aceptaría `example.pe.evil.test` — el curso lo trata como bypass de phishing interno, no como solución de allowlist.",
        retrospective:
          "Parsear el host real cierra el bypass de subdominio malicioso en el cuerpo del correo. El error clásico es substring del dominio “porque parece más simple”. Pregunta de cierre: ¿por qué `example.pe.evil.test` engañaría a un `in url` y no a `hostname ==`? Lleva ese hábito al You Do al armar el HTML del `.eml`.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Caso 22 · allowlist de dominios en URL
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
        title: "Filtrar scopes a la intersección allowed",
        preamble:
          "- **Contexto:** el pipeline de Caso 22 pidió scopes de más; la política de laboratorio debe dejar solo lo permitido.\n- **Meta:** filtrar `requested` a la intersección con `allowed`.\n- **Éxito:** una línea `['mail.draft']`.\n- **Límites:** no imprimes la lista completa; no inventes scopes; datos sintéticos (no OAuth real).",
        instruction:
          "1. El starter imprime `requested` sin filtrar (bug).\n2. Construye la lista de scopes que están en `allowed`.\n3. Imprime solo esa lista.\n4. No borres `mail.full` del requested a mano: filtra con membership.",
        hint: "list comprehension",
        hints: [
          "list comprehension",
          "set membership",
        ],
        edgeCases: ["mail.send no siempre necesario"],
        tests: "salida coincide con solution output",
        feedback:
          "Least privilege: la lista granted debe ser la intersección con allowed. `mail.full` en un bot de drafts es un hallazgo de diseño de seguridad, no un detalle menor de configuración.",
        retrospective:
          "Least privilege se demuestra con la intersección impresa, no con un comentario en el README. El error clásico es devolver `requested` completo “porque el proveedor ya filtrará”. Pregunta: ¿quién debe aplicar el filtro — el adaptador, la política de app, o ambos? Siguiente (E2): comprobar que granted no toca scopes peligrosos.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Caso 22 · filtrar scopes a allowed
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
        title: "isdisjoint frente a scopes peligrosos",
        preamble:
          "- **Contexto:** un hallazgo de seguridad del diseño es `mail.full` o `admin` en `granted` de un bot de drafts.\n- **Meta:** comprobar con `set.isdisjoint` que `granted` no solapa el conjunto peligroso.\n- **Éxito:** un solo `True`.\n- **Límites:** no inviertas la lógica con `not`; no mutes `granted`.",
        instruction:
          "1. El starter usa `not bad.isdisjoint(granted)` (bug).\n2. Imprime `bad.isdisjoint(granted)` sin negar.\n3. Deja los sets del fixture.\n4. Interpreta True = sin intersección peligrosa.",
        hint: "all(x not in granted for x in ...)",
        hints: [
          "all(x not in granted for x in ...)",
          "set isdisjoint",
        ],
        edgeCases: ["scopes custom del proveedor"],
        tests: "salida coincide con solution output",
        feedback:
          "`isdisjoint True` significa que granted no toca scopes peligrosos. Invertir la lógica te da un falso “seguro” cuando hay intersección — el hallazgo de seguridad desaparece del radar.",
        retrospective:
          "`isdisjoint True` es evidencia de least privilege en el paquete de auditoría. Invertir con `not` da un falso “seguro” cuando hay solape con `mail.full`/`admin`. Pregunta: si granted incluye `mail.send` y el producto es draft-only, ¿qué imprime el gate y qué haces en la mesa? Luego (E3) clasificas credenciales por `expires_at` vs. now.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Caso 22 · denied scopes peligrosos
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
        title: "Clasificar expires_at: refresh o valid",
        preamble:
          "- **Contexto:** un token OAuth o un draft caducado no debe entrar a la cola de envío simulada de CP-N2-C; el mismo reloj aplica a ambos (puente a T2-B).\n- **Meta:** clasificar dos `expires_at` sintéticos frente a `now` UTC: caducado → `refresh`, vigente → `valid`.\n- **Éxito:** dos líneas `refresh` luego `valid`.\n- **Límites:** `exp < now` → refresh; no inviertas la comparación; sin SMTP.",
        instruction:
          "1. El starter imprime `valid` cuando `exp < now` (bug).\n2. Invierte la condición: caducado → `refresh`.\n3. Conserva el orden del for (pasado, futuro).\n4. No hardcodees las dos strings fuera del if.",
        hint: "compara con now UTC",
        hints: [
          "exp < now → refresh",
          "en caso contrario → valid",
        ],
        edgeCases: ["fromisoformat con Z en 3.11+"],
        tests: "salida coincide con solution output",
        feedback:
          "Token o draft caducado → `refresh`; vigente → `valid`. Comparar al revés deja pasar credenciales expiradas a la cola de envío simulada — el reloj es el mismo gate en T2-B.",
        retrospective:
          "El reloj es un gate de producto: caducado = refresh (o regenerar draft), no “valid por existir en el store”. Pregunta de cierre: ¿por qué un draft caducado no se promueve aunque el token OAuth siga vivo? Eso enlaza T2-A con el adaptador de T2-B.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Caso 22 · expires_at → refresh|valid
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
        title: "Status de workflow, no la key del store",
        preamble:
          "- **Contexto:** la cola de aprobación lee el **status** del draft (`draft`, `pending_review`…), no el id del diccionario.\n- **Meta:** registrar un borrador sintético e imprimir status y subject del valor, no las keys.\n- **Éxito:** dos líneas — `draft` y `Informe sintético CP-N2-C`.\n- **Límites:** no imprimes `list(store.keys())`; no inventes otro id.",
        instruction:
          "1. El starter imprime dos veces la key del store (bug).\n2. Lee `store['d001']['status']` y `['subject']`.\n3. Imprime en ese orden.\n4. No borres el dict del starter.",
        hint: "dict assignment",
        hints: [
          "store['d001'] = {'status': 'draft', 'subject': '...'}",
          "print status y subject del valor — no list(store.keys())",
        ],
        edgeCases: ["Colisiones de id: status es el campo de workflow, no el id del dict."],
        tests: "salida coincide con solution output",
        feedback:
          "El id (`d001`) identifica el registro; el status (`draft`) es lo que lee la cola de aprobación. Confundir key del store con estado del workflow rompe el HITL.",
        retrospective:
          "El id identifica el registro en el store; el status mueve la máquina de estados que lee la cola humana. Confundirlos rompe el HITL: la UI creería “todo draft” o imprimiría keys en el audit. Pregunta: si ves `d001` en consola, ¿sabes si está en `pending_review`? Siguiente (E2): decidir usable con `now < expires_at`.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Caso 22 · crear draft en store
# A corregir: imprime la key del store, no status/subject del workflow
# Contrato: dos líneas — status draft + subject del run
store = {}
store['d001'] = {'status': 'draft', 'subject': 'Informe sintético CP-N2-C'}
print(list(store.keys())[0])
print(list(store.keys())[0])
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `store = {}
store['d001'] = {'status': 'draft', 'subject': 'Informe sintético CP-N2-C'}
print(store['d001']['status'])
print(store['d001']['subject'])`,
          output: `draft
Informe sintético CP-N2-C`,
        },
      },
      {
        id: "S22-T2-B-E2",
        subtopicId: "S22-T2-B",
        kind: "independent",
        title: "Draft usable solo si no expiró",
        preamble:
          "- **Contexto:** el draft de Caso 22 expiró hace 1 s; no debe promoverse a envío simulado.\n- **Meta:** decidir usable con `now < expires_at`.\n- **Éxito:** un solo `False`.\n- **Límites:** no uses `now > expires_at` como “usable”; no regeneres el draft aquí.",
        instruction:
          "1. El starter imprime `now > expires_at` (bug: True cuando ya expiró).\n2. Cambia a `now < expires_at`.\n3. Deja el fixture de 1 s en el pasado.\n4. Imprime solo el booleano.",
        hint: "timedelta",
        hints: [
          "timedelta",
          "usable solo si now < expires_at",
        ],
        edgeCases: ["clock skew"],
        tests: "salida coincide con solution output",
        feedback:
          "Usable solo si `now < expires_at`. Un draft caducado no se promueve: regeneras el mensaje y vuelves a la cola humana con cifras frescas del informe de S21 — no “aprovechas” el id viejo.",
        retrospective:
          "Usable es una pregunta de reloj y de status, no de existencia del id. El error clásico es invertir la comparación y “validar” lo caducado. Pregunta: ¿qué imprime el gate si `expires_at` está 1 s en el pasado? Luego (E3) implementas create con ids secuenciales y expires_at.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Caso 22 · is_usable por expiración
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
        title: "Adaptador: ids d001/d002 y usable",
        preamble:
          "- **Contexto:** el adaptador es el único dueño del ciclo de vida del draft en el laboratorio de CP-N2-C.\n- **Meta:** implementar `create_draft()` con ids `d{len+1:03d}`, status `draft` y `expires_at = now+1h`; reportar usable del segundo.\n- **Éxito:** `d001 d002` y `usable True`.\n- **Límites:** no reutilices siempre `d001`; no inventes SMTP; thread-safety fuera de alcance.",
        instruction:
          "1. El starter fija `d001`, no guarda expiración e imprime usable False (bugs).\n2. Genera id con `f\"d{len(store)+1:03d}\"`.\n3. Guarda status y expires_at.\n4. Imprime ambos ids y `usable` del segundo con `now < expires_at` y status draft.",
        hint: "len(store)+1 y timedelta",
        hints: [
          "id secuencial a partir de len(store); no reutilices un literal fijo",
          "guarda expires_at; usable combina reloj y status draft",
        ],
        edgeCases: ["draft caducado no se promueve; thread-safety fuera de alcance"],
        tests: "salida coincide con solution output",
        feedback:
          "Ids secuenciales (`d001`, `d002`) + `expires_at` en el store: el adaptador es el único dueño del ciclo de vida del draft; el workflow solo pregunta `is_usable`.",
        retrospective:
          "Ids secuenciales + `expires_at` en el store separan adaptador de workflow: el job pregunta, el adaptador responde. El error clásico es un id fijo que colisiona al reintentar. Pregunta de cierre: ¿quién debe llamar `is_usable`, el job de envío o el adaptador?",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Caso 22 · adaptador: ids secuenciales + usable
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
        title: "Validar formato básico de email",
        preamble:
          "- **Contexto:** sin `@` y dominio no hay `To:` que verificar en Caso 22.\n- **Meta:** validar formato con `re.match` sobre `ana@example.pe` y `bad`.\n- **Éxito:** dos líneas `… True` y `… False`.\n- **Límites:** no valida DNS real; no marques siempre True; datos sintéticos.",
        instruction:
          "1. El starter imprime siempre True (bug).\n2. Usa el patrón ya definido con `re.match`.\n3. Imprime email y `bool` del match.\n4. No cambies las dos direcciones de prueba.",
        hint: "re.match",
        hints: [
          "re.match",
          "bool del match",
        ],
        edgeCases: ["no valida DNS real"],
        tests: "salida coincide con solution output",
        feedback:
          "Formato básico primero: sin `@` y dominio no hay `To:` que verificar. Luego vendrá dominio allowlisted y estado del directorio — este es solo el primer filtro.",
        retrospective:
          "Formato básico es el primer filtro, no la verificación completa ni DNS real. El error clásico es hardcodear `True` “porque el fixture se ve bien”. Pregunta: ¿`bad` falla por dominio o por forma? Siguiente (E2): resolver id y chequear dominio allowlisted.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Caso 22 · regex simple de email
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
        title: "Verificar dominio allowlisted de C001",
        preamble:
          "- **Contexto:** resolver el id del directorio no basta: el email debe vivir en `@example.pe` de laboratorio.\n- **Meta:** marcar `verified` solo si existe y el dominio está allowlisted.\n- **Éxito:** una línea `verified`.\n- **Límites:** no marques verified solo por `dict.get`; sin PII real.",
        instruction:
          "1. El starter verifica solo existencia de email (bug).\n2. Exige `endswith('@example.pe')` (o split del dominio).\n3. Imprime `verified` o `rejected`.\n4. No inventes otros contactos.",
        hint: "dict.get",
        hints: [
          "dict.get",
          "endswith('@example.pe') o split @",
        ],
        edgeCases: ["subdominios"],
        tests: "salida coincide con solution output",
        feedback:
          "Resolver el id no basta: el dominio debe estar en la allowlist de laboratorio (`@example.pe`). Sin eso, fail-closed y no creas draft para un To incorrecto.",
        retrospective:
          "Resolve + dominio allowlisted es el contrato de entrega del lab. El error clásico es “si está en el directorio, ya está”. Pregunta: si `C001` existiera con dominio externo, ¿qué estado imprimirías? Luego (E3) un score de similitud con nota ética obligatoria.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Caso 22 · resolver C001 y dominio
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
        title: "Score de match con nota no-fraude",
        preamble:
          "- **Contexto:** dos emails sintéticos se parecen; un score alto solo prioriza revisión de **entrega**, nunca claims de fraude.\n- **Meta:** calcular prefijo común, redondear a 2 decimales y anexar siempre `match_no_es_fraude`.\n- **Éxito:** `0.86 match_no_es_fraude`.\n- **Límites:** nunca `fraude_probable`; score alto ≠ identidad legal ni parentesco.",
        instruction:
          "1. El starter etiqueta `fraude_probable` (bug ético).\n2. Conserva el cálculo del prefijo con `zip`.\n3. Imprime `round(score, 2)` y la nota correcta.\n4. No cambies los dos emails del fixture.",
        hint: "loop zip + round",
        hints: [
          "prefix común con zip hasta divergencia",
          "nunca uses el score como prueba de fraude",
        ],
        edgeCases: ["score alto ≠ identidad legal"],
        tests: "salida coincide con solution output",
        feedback:
          "Un score 0.86 (y el 0.92 del self-check ético) solo prioriza revisión de entrega. Etiquetarlo como `fraude_probable` es un error ético y de producto: matching ≠ investigación de fraude.",
        retrospective:
          "Matching alimenta prioridad de entrega, no investigación de fraude. El error clásico es automatizar un claim con un umbral. Pregunta de cierre: ¿qué gate humano sigue siendo obligatorio aunque el score sea 0.99? (HITL + verified + draft-only.) Mantén la etiqueta `match_no_es_fraude` en el print canónico.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Caso 22 · score + nota match_no_es_fraude
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
        title: "Deduplicar emails preservando orden",
        preamble:
          "- **Contexto:** en una lista To/CC de Caso 22, el orden de primera aparición es parte del contrato de higiene.\n- **Meta:** deduplicar sin perder ese orden.\n- **Éxito:** `['a@x', 'b@x']`.\n- **Límites:** no uses `set` como solución final; no reordenes a mano.",
        instruction:
          "1. El starter usa `list(set(xs))` (bug de orden).\n2. Aplica `dict.fromkeys` (o equivalente estable).\n3. Imprime la lista resultante.\n4. No alteres el fixture de tres elementos.",
        hint: "dict.fromkeys",
        hints: [
          "dict.fromkeys",
          "list(...)",
        ],
        edgeCases: ["case folding opcional"],
        tests: "salida coincide con solution output",
        feedback:
          "`dict.fromkeys` preserva la primera aparición; `set` no garantiza orden. En una lista de To/CC el orden es parte del contrato de higiene de la mesa.",
        retrospective:
          "En To/CC el orden de primera aparición es parte del contrato de higiene de la mesa, no un detalle cosmético. El error clásico es “un set ya quita duplicados” y perder quién era el primer `to`. Pregunta: si el fixture es a, b, a, ¿qué lista defiendes en el audit? Siguiente (E2): forzar BCC a un externo que vino en CC.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Caso 22 · dedupe de lista preservando orden
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
        title: "Forzar BCC a destinatarios externos",
        preamble:
          "- **Contexto:** un partner en `@other.test` no debe ver ni exponer la lista de trabajo en CC.\n- **Meta:** forzar `role='bcc'` cuando el email es externo.\n- **Éxito:** una línea `bcc`.\n- **Límites:** no dejes `pass` sin mutar; BCC no es cifrado, solo oculta la lista a los demás.",
        instruction:
          "1. El starter detecta el dominio pero hace `pass` (bug).\n2. Asigna `r['role'] = 'bcc'`.\n3. Imprime el role final.\n4. No cambies el email del fixture.",
        hint: "endswith",
        hints: [
          "endswith",
          "asignar r['role'] = 'bcc'",
        ],
        edgeCases: ["múltiples dominios externos"],
        tests: "salida coincide con solution output",
        feedback:
          "Externos en CC exponen la lista de trabajo del caso. Forzar BCC (o envíos individuales) es mínima divulgación operativa — no es cifrado del cuerpo.",
        retrospective:
          "Detectar el dominio externo sin mutar el role deja el partner en CC: el bug del starter. Mínima divulgación operativa es cambiar el role (o enviar individual), no solo “saber” que es externo. Pregunta: si imprimes el role y sigue `cc`, ¿el test de privacidad pasó? Luego (E3) mueves externos y cuentas solo visibles to+cc.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Caso 22 · forzar role bcc a externos
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
        title: "Contar visibles tras política BCC",
        preamble:
          "- **Contexto:** el audit del run debe registrar cuántos emails quedan **visibles** (to+cc) después de la política de privacidad.\n- **Meta:** mover externos a bcc y contar solo visibles.\n- **Éxito:** `1 ['a@example.pe']`.\n- **Límites:** si el externo sigue en cc, el conteo miente; BCC no cifra el cuerpo.",
        instruction:
          "1. El starter cuenta el externo en cc (bug de política).\n2. Si el dominio es externo, reasigna role a `bcc` antes de contar.\n3. Visibles = to + cc tras la política.\n4. Imprime `len(vis)` y la lista.",
        hint: "filtrar roles",
        hints: [
          "si dominio externo → role bcc",
          "visibles = to + cc tras la política",
        ],
        edgeCases: ["BCC no es cifrado"],
        tests: "salida coincide con solution output",
        feedback:
          "Tras la política, solo to+cc cuentan como visibles. Si el externo sigue en cc, el conteo miente y la privacidad se rompe — hallazgo de mesa, no detalle de UI.",
        retrospective:
          "Tras la política, solo to+cc son visibles. El error clásico es contar antes de reasignar roles. Pregunta de cierre: ¿por qué un conteo de 2 con un externo en cc es un hallazgo de privacidad y no un “detalle de UI”?",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Caso 22 · conteo de visibles to+cc
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
        title: "submit de draft a pending_review",
        preamble:
          "- **Contexto:** en Caso 22, el analista no puede autoaprobar: debe encolar revisión humana.\n- **Meta:** aplicar la transición `submit` desde `draft` usando la tabla.\n- **Éxito:** una línea `pending_review`.\n- **Límites:** no hardcodees `approved`; no inventes atajos `pending`.",
        instruction:
          "1. El starter asigna `state = 'approved'` (bug).\n2. Lee `T[state]['submit']` (o equivalente).\n3. Imprime el estado final.\n4. Conserva la tabla del starter.",
        hint: "dict de dicts",
        hints: [
          "dict de dicts",
          "T[state]['submit'] → pending_review",
        ],
        edgeCases: ["KeyError si acción inválida"],
        tests: "salida coincide con solution output",
        feedback:
          "`submit` es la única puerta de draft a `pending_review`. Saltar a `approved` en el código es el anti-patrón que la mesa de control no puede auditar.",
        retrospective:
          "La tabla `TRANSITIONS` es la única fuente de verdad: `submit` mueve `draft` → `pending_review`. Asignar `approved` a mano borra el rastro y salta el HITL. Pregunta: si el starter “pasa” con un string hardcodeado, ¿qué falla en el audit del portfolio? Siguiente (E2): approve desde draft debe ser `invalid`.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Caso 22 · transición submit draft→pending_review
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
        title: "approve inválido desde draft",
        preamble:
          "- **Contexto:** fail-closed protege al destinatario cuando la acción no existe en la tabla.\n- **Meta:** intentar `approve` desde `draft` y obtener `invalid`.\n- **Éxito:** una línea `invalid`.\n- **Límites:** no inventes un `ok` cuando `nxt` es None; no silencies el hallazgo.",
        instruction:
          "1. El starter imprime `'ok'` si falta la transición (bug).\n2. Usa `.get` en la tabla.\n3. Si no hay `nxt`, imprime `invalid`.\n4. No agregues approve a draft “para que pase”.",
        hint: "try/except o .get",
        hints: [
          "try/except o .get",
          "None → 'invalid'",
        ],
        edgeCases: ["no silencies errores de auditoría en prod"],
        tests: "salida coincide con solution output",
        feedback:
          "Fail-closed: `approve` desde draft no existe en la tabla → `invalid`. Nunca inventes un “ok” cuando falta la transición: el audit debe registrar el rechazo de la acción.",
        retrospective:
          "Falta de transición = `invalid`, no éxito silencioso. El error clásico es un else amable que miente al audit. Pregunta: ¿agregarías `approve` a `draft` “para que el test pase”, o dejas el fail-closed? Luego (E3) implementas `apply` con actor y filtras el evento de approve.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Caso 22 · approve inválido desde draft
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
        title: "apply con audit y actor en approve",
        preamble:
          "- **Contexto:** el portfolio de CP-N2-C adjunta el audit: quién aprobó, desde qué estado, con qué acción.\n- **Meta:** implementar `apply` sobre la máquina canónica; ejecutar submit y approve; imprimir solo el evento de approve.\n- **Éxito:** lista con un dict `from pending_review → approved`, action `approve`, actor `rev1`.\n- **Límites:** consulta TRANSITIONS; no hardcodees approved en apply; estados canónicos.",
        instruction:
          "1. El starter no usa TRANSITIONS ni guarda actor/action (bug).\n2. Completa `apply`: resuelve `nxt`, falla si no hay, append con from/to/action/actor.\n3. Ejecuta submit (analyst) y approve (rev1).\n4. Imprime la lista filtrada por action == approve.",
        hint: "apply + log con actor",
        hints: [
          "TRANSITIONS con pending_review y request_edit → needs_edit",
          "resuelve nxt con la tabla; append from/to/action/actor; filtra el approve al imprimir",
        ],
        edgeCases: ["approve desde draft debe ser invalid; el audit es inmutable en producción."],
        tests: "salida coincide con solution output",
        feedback:
          "El audit del approve debe llevar from/to/action/actor. Sin actor no hay accountability en la mesa de control; sin TRANSITIONS no hay fail-closed ni rastro defendible.",
        retrospective:
          "Sin actor no hay accountability en la mesa; sin `TRANSITIONS` no hay fail-closed ni rastro defendible. El error clásico es un log incompleto que “solo guarda el to”. Pregunta de cierre: ¿qué imprimirías si alguien intenta `approve` desde `draft`? Eso se defiende en el portfolio del You Do.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Caso 22 · apply SM + log con actor
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
        title: "Idempotency key sha256 de 16 hex",
        preamble:
          "- **Contexto:** la key firma el triple run | destinatario | versión del cuerpo en Caso 22 y en el You Do.\n- **Meta:** unir con `|`, codificar, sha256 y tomar **16** hex.\n- **Éxito:** `0da400d6c9b3f756`.\n- **Límites:** separador es `|` (no `-`); slice `[:16]` (no 6 ni 8).",
        instruction:
          "1. El starter usa `-` y `[:6]` (bugs).\n2. Arma `f'{run_id}|{to}|{body_ver}'.encode()`.\n3. Imprime `sha256(...).hexdigest()[:16]`.\n4. No cambies los valores del fixture (`run`, `to`, `v1`).",
        hint: "f'{run}|{to}|{ver}'.encode() + sha256[:16]",
        hints: [
          "raw = f'{run_id}|{to}|{body_ver}'.encode()",
          "hashlib.sha256(raw).hexdigest()[:16] — no [:6] ni [:8]; separador es |",
        ],
        edgeCases: ["Codifica en UTF-8; cambiar body_ver debe cambiar la key."],
        tests: "salida coincide con solution output",
        feedback:
          "La key firma el triple (run, destinatario, versión del cuerpo): 16 hex es el contrato único de S22 en teoría, ejercicios y You Do. Acortarla rompe la idempotencia del reintento.",
        retrospective:
          "16 hex es el contrato único de S22 (teoría, ejercicios y You Do). El error clásico es acortar la key “para que se lea mejor” o cambiar el separador. Pregunta: si usas `-` en vez de `|`, ¿puedes reutilizar el hash del contrato? Siguiente (E2): create que reutiliza el id cuando la key ya existe.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Caso 22 · idempotency key sha256[:16] desde run|to|v1
# A corregir: separador '-' y slice [:6]
# Contrato: 16 hex chars del payload run|to|v1
import hashlib
run_id, to, body_ver = 'run', 'to', 'v1'
raw = f'{run_id}-{to}-{body_ver}'.encode()
print(hashlib.sha256(raw).hexdigest()[:6])
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import hashlib
run_id, to, body_ver = 'run', 'to', 'v1'
raw = f'{run_id}|{to}|{body_ver}'.encode()
print(hashlib.sha256(raw).hexdigest()[:16])`,
          output: `0da400d6c9b3f756`,
        },
      },
      {
        id: "S22-T4-B-E2",
        subtopicId: "S22-T4-B",
        kind: "independent",
        title: "create idempotente por la misma key",
        preamble:
          "- **Contexto:** la segunda llamada con la misma key no debe inventar un segundo draft.\n- **Meta:** `create(key)` reutiliza el draft_id existente; solo la primera crea.\n- **Éxito:** `True` y `1` (same id y un solo registro).\n- **Límites:** no pises el store en cada llamada; condiciones de carrera fuera del lab.",
        instruction:
          "1. El starter siempre asigna un id nuevo (bug).\n2. Si `key in store`, devuelve el guardado.\n3. Si no, crea y guarda.\n4. Deja los dos `create('k')` y los prints.",
        hint: "if key in store: return store[key]",
        hints: [
          "cache dict: if key in store → devolver el id guardado",
          "solo al crear: store[key] = 'd' + str(len(store)+1)",
        ],
        edgeCases: ["Las condiciones de carrera quedan fuera del lab; en producción usa un store atómico."],
        tests: "salida coincide con solution output",
        feedback:
          "Misma key → mismo draft_id y un solo registro en el store. Eso evita spam al reintentar: un doble clic del operador no multiplica notificaciones.",
        retrospective:
          "Misma key → mismo draft_id y un solo registro en el store. El error clásico es “siempre factory()” y pisar el mapa. Pregunta: tras dos `create('k')`, ¿cuántos ids distintos y qué `len(store)` defiendes? Luego (E3) el reintento se registra como `retry_hit` en el audit.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Caso 22 · create idempotente por key
# A corregir: siempre crea id nuevo (ignora cache)
# Contrato: create('k') == create('k') y len(store) == 1
store = {}

def create(key):
    store[key] = 'd' + str(len(store) + 1)
    return store[key]
a, b = create('k'), create('k')
print(a == b)
print(len(store))
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `store = {}

def create(key):
    if key in store:
        return store[key]
    store[key] = 'd' + str(len(store) + 1)
    return store[key]
a, b = create('k'), create('k')
print(a == b)
print(len(store))`,
          output: `True
1`,
        },
      },
      {
        id: "S22-T4-B-E3",
        subtopicId: "S22-T4-B",
        kind: "transfer",
        title: "Audit create y retry_hit sin duplicar",
        preamble:
          "- **Contexto:** en la mesa de control el reintento es evidencia de cumplimiento, no un segundo mensaje al destinatario.\n- **Meta:** mini `create_once`: primer intento `create`, segundo `retry_hit` reutilizando el id.\n- **Éxito:** `['create', 'retry_hit']` y `True`.\n- **Límites:** no borres el audit al reintentar; no crees un segundo draft; timestamp/actor en prod (fuera de este drill).",
        instruction:
          "1. El starter siempre hace append `create` y pisa el store (bug).\n2. Si la key ya está, append `retry_hit` y reutiliza el id.\n3. Si no, guarda draft y append `create`.\n4. Imprime eventos y igualdad de ids.",
        hint: "si key ya en store → retry_hit",
        hints: [
          "reintento: no inventes un segundo draft; registra el evento correcto en audit",
          "primera vez create; segunda vez reutiliza id y marca el hit — sin borrar el log",
        ],
        edgeCases: ["En producción añade timestamp y actor al evento; no borres el audit al reintentar."],
        tests: "salida coincide con solution output",
        feedback:
          "El reintento es un evento de auditoría, no un segundo draft: evidencia de cumplimiento en la mesa de control y cierre del inicio de CP-N2-C.",
        retrospective:
          "El reintento es un evento de auditoría (`retry_hit`), no un segundo draft al destinatario. El error clásico es duplicar notificaciones “porque el job falló a medias”. Pregunta de cierre: ¿qué cambia en la key si actualizas el cuerpo del informe de S21? Eso cierra el inicio de CP-N2-C.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Caso 22 · audit create + retry_hit (transfer)
# A corregir: siempre append create; no reutiliza id
# Contrato: eventos ['create','retry_hit'] y same_id True
audit = []
store = {}
key = 'k1'
ids = []
for _ in range(2):
    store[key] = 'd1'
    audit.append('create')
    ids.append(store[key])
print(audit)
print(ids[0] == ids[1])
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `audit = []
store = {}
key = 'k1'
ids = []
for _ in range(2):
    if key in store:
        audit.append('retry_hit')
        ids.append(store[key])
    else:
        store[key] = 'd1'
        audit.append('create')
        ids.append(store[key])
print(audit)
print(ids[0] == ids[1])`,
          output: `['create', 'retry_hit']
True`,
        },
      },
    ],
  },
  youDo: {
    title: "Borrador .eml con aprobación (inicio CP-N2-C)",
    context:
      "La mesa de control acaba de aprobar el paquete de informe de S21 (métricas reconciliadas en DOCX/PDF/dashboard). Tu trabajo: construir el **mini pipeline de notificación** de inicio de CP-N2-C — mensaje MIME → destinatario verificado → draft con idempotency key de 16 hex → estado `pending_review` con audit (actor). No envíes correo real. Matching de contactos no implica fraude. En S23 conectarás un adaptador web (browser RPA); aquí el canal es `.eml`/sandbox fail-closed. Entrega algo que una revisora humana pueda inspeccionar y firmar en el audit.",
    objectives: [
      "Generar un string MIME multiparte (plain+HTML+adjunto meta del run) listo para `.eml`",
      "Verificar al menos un destinatario con dominio allowlisted (`example.pe`)",
      "Crear draft en store con `expires_at` e idempotency key `sha256(...).hexdigest()[:16]`",
      "Ejecutar `submit` hasta `pending_review` con audit log (acción + actor)",
    ],
    requirements: [
      "Sin PII real ni secretos en cuerpo ni adjuntos",
      "Ningún envío SMTP real ni scope de send como happy path",
      "Destinatario requiere verificación antes de crear draft",
      "No inferir fraude ni parentesco desde matching de contactos",
      "Textos de usuario en español profesional (es-PE)",
      "Máquina de estados canónica: `pending_review` / `needs_edit` (no atajos `pending`)",
      "Aceptación impresa: verified True, key_len 16, draft_id no nulo, state pending_review, audit_n ≥ 1",
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
#   verified True | key_len 16 | draft_id d… | state pending_review | audit_n ≥ 1

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

# --- Esqueleto del pipeline (completa lo marcado) ---
verified = domain_ok(to)
if not verified:
    raise SystemExit("fail-closed: destinatario no verificado")

# A) Completa el árbol MIME: mixed + alternative (plain+html) + adjunto meta del run
msg = MIMEMultipart("mixed")
msg["Subject"] = f"Notificación run {run_id}"
msg["From"] = "noreply@example.pe"
msg["To"] = to
alt = MIMEMultipart("alternative")
alt.attach(MIMEText(f"Run {run_id} listo para revisión (texto).", "plain", "utf-8"))
# Completa: adjunta también HTML seguro (sin secretos) a alt
msg.attach(alt)
# Completa: adjunto meta (p. ej. run_id=... en MIMEApplication + Content-Disposition)

# B–C) Draft store + key de 16 hex (idempotente)
key = idem_key(run_id, to, 1)
store = {}
draft_id = None
if key not in store:
    draft_id = "d001"
    store[key] = {
        "draft_id": draft_id,
        "status": "draft",
        "expires_at": datetime.now(timezone.utc) + timedelta(hours=24),
        # Completa: guarda msg.as_string() o un .eml de sandbox (sin SMTP)
    }
else:
    draft_id = store[key]["draft_id"]

# D) Cola humana: draft → pending_review con actor en audit
audit: list = []
state = "draft"
# Completa: state = apply(state, "submit", "analyst", audit)

print("verified", verified)
print("key_len", len(key))
print("draft_id", draft_id)
print("state", state)
print("audit_n", len(audit))
# Al terminar: verified True, key_len 16, draft_id d001, state pending_review, audit_n ≥ 1
`,
    portfolioNote:
      "Entregable inicio CP-N2-C: borrador sandbox (.eml o string MIME) + audit de aprobación; listo para web adapter (S23). Aceptación mínima: verified True, key_len 16, draft_id no nulo, state pending_review, audit_n ≥ 1 con actor en el evento de submit. Defiende en 30 s: cero envíos automáticos y 100 % de drafts por pending_review.",
    retrospective:
      "Antes de marcar listo: (1) ¿qué gate demuestras con los prints de aceptación (verified, key_len 16, pending_review, audit con actor)? (2) ¿qué harías distinto con destinatarios reales vs. `@example.pe` (PII, opt-out, BCC)? (3) Escribe en el README una frase de impacto medible — p. ej. “cero envíos automáticos; 100 % de drafts pasan por `pending_review`” — que puedas defender en 30 segundos ante la mesa. En S23 el canal web reutilizará este contrato; no reabras el paquete de S21 ni relajes el fail-closed.",
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
        options: ["Enviar solo a direcciones del dominio de pruebas", "Solo drafts/.eml en sandbox y aprobación humana", "Dejar el envío activo pero con la bandeja del robot como destino", "Marcar el borrador como no enviable con una cabecera propia"],
        correctIndex: 1,
        explanation:
          "El contrato de la sección es draft-only: escribes `.eml` o drafts de sandbox y pasas por cola humana. Ningún happy path de S22 llama SMTP real ni asume envío automático.",
      },
      {
        question: "Un score alto de similitud entre dos emails implica:",
        options: ["Que las dos cuentas pertenecen a la misma persona", "Que una de las dos direcciones es un alias de la otra", "Que el dominio compartido basta para unir los registros", "Solo evidencia débil de contacto a revisar; no prueba de fraude"],
        correctIndex: 3,
        explanation:
          "Matching prioriza revisión de **entrega correcta**. No es prueba de fraude, parentesco ni identidad legal; por eso el pipeline anota `match_no_es_fraude` y exige verificación + HITL.",
      },
      {
        question: "Least privilege en OAuth de correo significa:",
        options: ["Solo los scopes mínimos (p. ej. draft) necesarios", "Pedir todos los scopes", "Compartir el refresh token en Slack", "Usar la cuenta personal del CEO"],
        correctIndex: 0,
        explanation:
          "Si el producto solo crea borradores, pide scopes de draft (no `mail.full` ni send innecesario). Menos privilegios = menor impacto si el token se filtra.",
      },
      {
        question: "La idempotency key al reintentar create_draft debe:",
        options: ["Crear un draft nuevo y descartar el anterior por si cambió", "Reutilizar el draft solo si el contenido no cambió", "Reutilizar el mismo draft_id si la key existe", "Devolver error para que quien llama decida qué hacer"],
        correctIndex: 2,
        explanation:
          "Misma key (`sha256(run|to|body_ver)[:16]`) → mismo draft_id y evento `retry_hit` en el audit. Así un doble clic o un reintento de red no spamea al destinatario.",
      },
      {
        question:
          "Un score de similitud 0.92 entre dos nombres de contactos sintéticos, ¿qué autoriza en el flujo de email de CP-N2-C?",
        options: ["Declarar fraude o parentesco y bloquear al cliente automáticamente", "Priorizar revisión de entrega/resolución de destinatario, con nota match≠fraude y HITL si aplica", "Enviar el correo sin aprobación porque el score supera 0.9", "Publicar el DNI del contacto en el cuerpo para “confirmar identidad”"],
        correctIndex: 1,
        explanation:
          "Un 0.92 (como el 0.86 del ejercicio de prefijo) solo ordena prioridad de revisión de entrega. No autoriza claims de fraude, envío sin aprobación ni PII en el cuerpo. Draft + pending_review siguen siendo obligatorios.",
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
        url: "https://www.rfc-editor.org/rfc/rfc6749",
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
        label: "Designing Data-Intensive Applications (Kleppmann) — capítulos selectos",
        note: "idempotencia y logs",
      },
    ],
    courses: [
      {
        label: "Gmail API — Creating and sending drafts",
        url: "https://developers.google.com/gmail/api/guides/drafts",
        note: "drafts reales vs. sandbox; no envío automático",
      },
      {
        label: "RFC 5322 — Internet Message Format",
        url: "https://www.rfc-editor.org/rfc/rfc5322",
        note: "headers y estructura de mensajes",
      },
      {
        label: "RFC 2045 — MIME Part One",
        url: "https://www.rfc-editor.org/rfc/rfc2045",
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
