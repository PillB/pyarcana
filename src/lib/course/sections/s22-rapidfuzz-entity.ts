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
        "Aquí **inicias CP-N2-C**: construir mensajes MIME, sanitizar HTML, aplicar scopes mínimos, crear drafts con expiración, resolver destinatarios y encolar aprobación humana.",
        "El hilo conductor es un **borrador sintético** (run_id `cpn2c-01`, contactos fakes `@example.pe`). **Ningún correo real se envía**: solo archivos `.eml` o drafts en sandbox.",
        "Orden: **T1 Mensaje** → **T2 Proveedor** → **T3 Destinatario** → **T4 Workflow**. Matching de contactos es para **entrega correcta**, nunca para inferir fraude o parentesco.",
      ],
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
        "**MIME** (`email.mime`) arma mensajes multiparte: texto plano + HTML + adjuntos. El **charset** (UTF-8) evita mojibake en nombres y acentos del español peruano.",
        "`MIMEMultipart('alternative')` ofrece text/plain y text/html; el cliente elige. Los attachments van en `MIMEBase` con Content-Disposition.",
        "Nunca embeds secretos en el cuerpo. Marca adjuntos sintéticos y limita tamaño.",
      ],
      code: {
        language: 'python',
        title: "mime_build.py",
        code: `from email.mime.multipart import MIMEMultipart
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
print("has_attachment", "meta.txt" in raw)`,
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
        "Los **templates** de correo interpolan variables (nombre, run_id, montos). Cualquier input no confiable debe **sanitizarse** antes de HTML.",
        "Política de links: allowlist de dominios o solo rutas relativas; bloquea `javascript:` y `data:`.",
        "Autoescape o escape manual (`html.escape`) previene XSS en el cuerpo del correo.",
      ],
      code: {
        language: 'python',
        title: "sanitize_template.py",
        code: `import html
import re

def sanitize_html(fragment: str, allowed_hosts=None) -> str:
    allowed_hosts = allowed_hosts or {"example.pe"}
    safe = html.escape(fragment)
    # política simple: solo links http(s) a hosts allowlisted
    def repl(m):
        url = m.group(1)
        if re.match(r"^https?://", url):
            host = re.sub(r"^https?://", "", url).split("/")[0]
            if host in allowed_hosts:
                return f'<a href="{url}">enlace</a>'
        return "[link bloqueado]"
    return re.sub(r"\\{\\{link:([^}]+)\\}\\}", repl, safe)

user = '<script>alert(1)</script> {{link:https://example.pe/r}} {{link:javascript:alert(1)}}'
print(sanitize_html(user))`,
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
        "**OAuth** y **service accounts** autorizan APIs de correo. Aplica **least privilege**: solo scopes de draft/read necesarios, nunca `mail.full` si basta `compose`.",
        "Modela credenciales como objetos con `client_id`, `scopes` y `expires_at` — **nunca** commits de secretos reales.",
        "En sandbox del curso usamos tokens sintéticos y un registro de scopes pedidos vs concedidos.",
      ],
      code: {
        language: 'python',
        title: "scopes_sandbox.py",
        code: `from datetime import datetime, timezone, timedelta

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
print("least_privilege_ok", least_ok and "mail.full" not in cfg["granted_scopes"])`,
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
        "Un **adaptador** de proveedor (`GmailAdapter`, `SmtpFileAdapter`) expone `create_draft` / `get_draft` sin acoplar el dominio al SDK.",
        "Los drafts llevan **expiración**: tras `expires_at` no se pueden promover a envío sin regenerar y re-aprobar.",
        "En el curso, el adaptador de archivo escribe `.eml` bajo `out/drafts/` (simulado en memoria).",
      ],
      code: {
        language: 'python',
        title: "draft_adapter.py",
        code: `from datetime import datetime, timezone, timedelta
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
print("bytes", len(ad.store[did]["raw"]))`,
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
        "**Resolver** un destinatario mapea un id interno o alias a un email canónico. **Verificar** chequea formato, dominio allowlist y señales de bounce sintéticas.",
        "Un match fuzzy de nombres/emails es **evidencia de contacto**, no de identidad legal ni de fraude. Requiere confirmación humana antes de incluir en To.",
        "Estados: `unresolved` → `candidate` → `verified` | `rejected`.",
      ],
      code: {
        language: 'python',
        title: "resolve_verify.py",
        code: `import re

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
print("note: match≠fraude")`,
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
        "**CC** expone destinatarios entre sí; **BCC** oculta la lista. Prefiere BCC o envíos individuales cuando hay terceros.",
        "**Mínima divulgación**: no pongas PII extra en el cuerpo (DNI, teléfono) si el informe ya está adjunto con controles.",
        "Higiene de listas: dedupe, opt-out sintético, y tope de tamaño.",
      ],
      code: {
        language: 'python',
        title: "lists_privacy.py",
        code: `from collections import OrderedDict

recipients = [
    {"email": "ana@example.pe", "role": "to"},
    {"email": "luis@example.pe", "role": "cc"},
    {"email": "ana@example.pe", "role": "to"},  # dup
    {"email": "externo@other.test", "role": "bcc"},
]
# dedupe preservando orden
seen = OrderedDict()
for r in recipients:
    seen[r["email"]] = r
clean = list(seen.values())
# mínima divulgación: externos solo BCC
for r in clean:
    if r["email"].endswith("@other.test") and r["role"] != "bcc":
        r["role"] = "bcc"
by_role = {}
for r in clean:
    by_role.setdefault(r["role"], []).append(r["email"])
print("n", len(clean), "by_role", {k: len(v) for k, v in by_role.items()})
print("to_visible_to_others", by_role.get("to", []) + by_role.get("cc", []))`,
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
        "La **cola de aprobación** modela estados: `draft` → `pending_review` → `approved` | `rejected` | `needs_edit`.",
        "Transiciones explícitas con actor y timestamp. Sin transición, no hay envío ni promoción de draft.",
        "En CP-N2-C, la aprobación humana es **obligatoria** antes de cualquier acción de envío (aunque el curso no envía).",
      ],
      code: {
        language: 'python',
        title: "approval_sm.py",
        code: `TRANSITIONS = {
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
print(log[-1]["actor"], log[-1]["to"])`,
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
        "Una **idempotency key** (p. ej. hash de run_id+destinatario+versión del cuerpo) evita drafts duplicados al reintentar.",
        "El **audit log** registra create/submit/approve/retry con quién y cuándo. Es evidencia de cumplimiento.",
        "Reintento seguro: si la key ya existe en estado terminal, devuelve el id previo; no crea otro mensaje.",
      ],
      code: {
        language: 'python',
        title: "idempotent_draft.py",
        code: `import hashlib

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
print("audit_events", [e["event"] for e in audit])`,
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
          code: `from email.mime.multipart import MIMEMultipart
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
print("n_headers_subj", s.count("Subject:"))`,
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
          code: `import html, re

def sanitize(s):
    s = html.escape(s)
    return re.sub(r"https?://[^\\s<]+", lambda m: m.group(0) if "example.pe" in m.group(0) else "[blocked]", s)

raw = '<b>Hola</b> https://evil.test/x https://example.pe/ok'
print(sanitize(raw))`,
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
          code: `requested = ["mail.draft", "mail.send", "mail.full"]
policy_max = {"mail.draft", "mail.readonly"}
granted = [s for s in requested if s in policy_max]
denied = [s for s in requested if s not in policy_max]
print("granted", granted)
print("denied", denied)
print("least_ok", "mail.full" not in granted and "mail.send" not in granted)`,
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
          code: `from datetime import datetime, timezone, timedelta

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
print("n", len(ad.drafts))`,
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
          code: `contacts = {"u1": "ana@example.pe", "u2": "bad@not-allowed.test"}
allow = {"example.pe"}

def check(uid):
    em = contacts.get(uid)
    if not em:
        return "unresolved"
    dom = em.split("@")[1]
    return "verified" if dom in allow else "rejected"

for u in ("u1", "u2", "u9"):
    print(u, check(u))
print("disclaimer: verificación de entrega, no de fraude")`,
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
          code: `rows = [
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
print(out)`,
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
          code: `sm = {"draft": {"submit": "pending"}, "pending": {"approve": "approved", "reject": "rejected"}}
state, trail = "draft", []
for act in ("submit", "approve"):
    state = sm[state][act]
    trail.append(state)
print("final", state, "trail", trail)`,
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
          code: `import hashlib
db = {}

def once(key, factory):
    if key in db:
        return db[key], True
    db[key] = factory()
    return db[key], False

k = hashlib.sha256(b"cpn2c-01|ana@example.pe|v1").hexdigest()[:12]
a, d1 = once(k, lambda: "draft-001")
b, d2 = once(k, lambda: "draft-002")
print(a, b, a==b, d1, d2)`,
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
          "Crea MIMEText('Hola', 'plain', 'utf-8') y muestra el Content-Type del mensaje.",
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
          code: `from email.mime.text import MIMEText
# TODO
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
          "Arma MIMEMultipart mixed con Subject='Test' y un adjunto MIMEApplication(b'x', Name='a.txt'). Imprime si 'a.txt' está en as_string().",
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
          code: `from email.mime.multipart import MIMEMultipart
from email.mime.application import MIMEApplication
# TODO
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
          "Construye alternative text+html bajo mixed; imprime cuántas veces aparece 'Content-Type:' en el raw.",
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
          code: `# TODO multipart nested
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
          "Usa html.escape sobre '<script>x</script>' e imprime el resultado.",
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
          code: `import html
# TODO
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
          "Dado template 'Hola {name}' y name con '<b>Ana</b>', imprime la versión escapada interpolada.",
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
          code: `name = '<b>Ana</b>'
# TODO
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
          "Implementa allowlist: si url contiene 'example.pe' imprime 'ok', si no 'blocked'. Prueba ambas urls.",
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
          code: `urls = ['https://example.pe/a', 'https://evil.test']
# TODO
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
          "De requested=['mail.draft','mail.full'] filtra solo los que están en allowed={'mail.draft','mail.readonly'} e imprime.",
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
          code: `requested = ['mail.draft', 'mail.full']
allowed = {'mail.draft', 'mail.readonly'}
# TODO
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
          "Imprime True si granted no contiene 'mail.full' ni 'admin'.",
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
          code: `granted = ['mail.draft']
# TODO
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
          "Dado expires_at ISO en el pasado, imprime 'refresh'; si futuro, 'valid'. Usa datetime timezone-aware.",
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
          code: `from datetime import datetime, timezone, timedelta
# TODO prueba un past y un future
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
          "Simula store={} creando draft_id 'd001' con status 'draft'. Imprime el status.",
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
          code: `store = {}
# TODO
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
          "Con expires_at = now-1s, is_usable debe ser False. Imprime el booleano.",
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
          code: `from datetime import datetime, timezone, timedelta
# TODO
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
          "Implementa create_draft que devuelve ids d001, d002 secuenciales e imprime ambos.",
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
          code: `store = {}

def create_draft():
    # TODO
    pass
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
          "Valida email con regex simple ^[^@]+@[^@]+\\.[^@]+$ para 'ana@example.pe' y 'bad'.",
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
          code: `import re
# TODO
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
          "Resuelve C001→email desde dict y verifica dominio example.pe; imprime verified/rejected.",
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
          code: `DIRECTORY = {'C001': 'ana@example.pe'}
# TODO
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
          "Imprime la nota 'match_no_es_fraude' junto al score sintético de similaridad 0.92 entre dos strings (solo longitud de prefijo común / max len).",
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
          code: `a, b = 'ana.rojas@example.pe', 'ana.rojas@example.com'
# TODO score simple + nota
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
          "Dedupe lista ['a@x', 'b@x', 'a@x'] preservando orden e imprime.",
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
          code: `xs = ['a@x', 'b@x', 'a@x']
# TODO
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
          "Fuerza role='bcc' si el email termina en '@other.test'.",
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
          code: `rows = [{'email': 'p@other.test', 'role': 'cc'}]
# TODO
print(rows)`,
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
          "Cuenta cuántos emails quedarían visibles (to+cc) tras mover externos a bcc.",
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
          code: `rows = [('a@example.pe','to'),('b@other.test','cc')]
# TODO
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
          "Con TRANSITIONS draft--submit→pending, aplica submit e imprime el nuevo estado.",
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
          code: `T = {'draft': {'submit': 'pending'}}
state = 'draft'
# TODO
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
          "Intenta approve desde draft; si no hay transición imprime 'invalid'.",
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
          code: `T = {'draft': {'submit': 'pending'}, 'pending': {'approve': 'approved'}}
state, action = 'draft', 'approve'
# TODO
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
          "Registra un log de {from,to,actor} al aprobar pending→approved con actor='rev1'. Imprime el log.",
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
          code: `log = []
# TODO
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
          "Calcula idempotency key sha256 hex[:8] de b'run|to|v1' e imprime.",
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
          code: `import hashlib
# TODO
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
          "Dos llamadas create con la misma key deben devolver el mismo id. Imprime igualdad.",
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
          code: `store = {}

def create(key):
    # TODO
    pass
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
          "Simula audit: create luego retry_hit; imprime la lista de eventos.",
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
          code: `audit = []
store = {}
# TODO create + retry
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
import hashlib

run_id = "cpn2c-01"
to = "revisora@example.pe"
# TODO: MIME + idempotency + estado pending_review
print("TODO pipeline email")
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
    ],
  },
  resources: {
    docs: [
      {
        label: "email — MIME examples (Python)",
        url: "https://docs.python.org/3/library/email.examples.html",
        note: "stdlib MIME",
      },
      {
        label: "OWASP XSS prevention",
        url: "https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html",
        note: "sanitización HTML",
      },
    ],
    books: [
      {
        label: "Building Secure Software (McGraw)",
        note: "principios de least privilege y validación",
      },
      {
        label: "Designing Data-Intensive Applications (Kleppmann) — select",
        note: "idempotencia y logs",
      },
    ],
    courses: [
      {
        label: "Python email package tutorial",
        url: "https://docs.python.org/3/library/email.html",
        note: "API oficial",
      },
    ],
  },
}
