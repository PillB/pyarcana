import type { CourseSection } from '../../types'

export const section42: CourseSection = {
  id: "graph-rag",
  index: 42,
  title: "Schemas, seguridad y privacidad de servicios",
  shortTitle: "Schemas y seguridad",
  tagline: "Threat model y pruebas de permisos: un usuario no lee el caso de otro ni recupera datos redactados",
  estimatedHours: 20,
  level: "Producción gobernada",
  phase: 3,
  icon: "Share2",
  accentColor: "bg-gradient-to-br from-amber-500 to-red-600",
  jobRelevance:
    "En equipos de plataforma y producto (fintech, healthtech, retail y gobierno digital en Perú), tu API versionada necesita un control plane fail-closed (la capa que orquesta los servicios y, ante la duda, deniega en lugar de abrir). Aquí aprendes los cuatro frentes que lo sostienen: schemas estrictos que rechazan campos extra, distinción entre authn y authz (autenticación frente a autorización) con RBAC y resource binding, scopes deny-by-default y controles de SSRF y path traversal junto con secretos fuera del repo. Entregas un threat model (modelo de amenazas) y una matriz de permisos con evidencia allow/deny auditable.",
  learningOutcomes: [
    { text: "Definir un schema de borde estricto (tipos + rechazo de campos extra) y exportar fixtures válidos/inválidos." },
    { text: "Evolucionar contratos con cambios aditivos y discriminated unions exhaustivas sin romper lectores previos." },
    { text: "Implementar authn ≠ authz con RBAC y resource binding que deniega lectura cross-tenant." },
    { text: "Aplicar scopes e identidades de servicio con política deny-by-default en rutas no declaradas." },
    { text: "Rechazar input no confiable: límites de tamaño, SSRF por allowlist y path confinement." },
    { text: "Gestionar secretos fuera del repo, cifrado en reposo y dependencias fijadas sin CVE críticas abiertas." },
    { text: "Minimizar campos al propósito declarado y fijar retención finita con bloqueo al vencer." },
    { text: "Auditar sin PII, purgar derivados y verificar que un campo redactado no reaparece." },
  ],
  theory: [
    {
      heading: "Ruta de S42: Schemas, seguridad y privacidad de servicios",
      paragraphs: [
        "**Diccionario de la sección** (léelo antes de T1). **Schema estricto:** forma + tipos + rechazo de campos extra. **Authn/authz:** quién eres vs. qué puedes hacer. **RBAC/scopes:** roles y permisos deny-by-default. **SSRF/path traversal:** abuso de URL o rutas del servidor. **Minimización/retención:** solo el dato necesario, solo el tiempo necesario. **Pseudonimización:** identificadores derivados sin reidentificación fácil. **Redacción:** campo sensible no reaparece en logs, respuestas ni backups activos. **Missing ≠ breach:** falta de evidencia se enruta a revisión humana; no se inventa un allow ni se confunde con un ataque demostrado.",
        "Esta sección **endurece el control plane de S41** (HTTP versionado). Imagina la misma petición JSON que ya sabes versionar: ahora le exigimos schema estricto, binding al dueño del caso, scope de servicio y controles de URL/path antes de tocar almacenamiento. Modelamos con **stdlib** (dicts, sets) los contratos al estilo Pydantic/JSON Schema y los controles OWASP **sin** levantar un cluster ni llamar red real. El caso `CASO-CUS-042` (mesa de soporte sintética en Cusco) no usa credenciales reales, PII ni servicios externos.",
        "Producto incremental: threat model + matriz de permisos. Entrada: schemas estrictos, identidad de servicio, scope, propósito y retención. Salida: allow/deny auditable, redacción y purga de derivados. Error de promoción: campo extra aceptado, lectura cross-tenant, path/URL no permitidos o retención vencida sin bloqueo. El demo del mapa reproduce esa historia de un solo request: schema OK no basta si el actor no es el dueño.",
        "Orden: T1 schemas/evolución → T2 authn/authz y scopes → T3 injection/SSRF/secretos → T4 minimización, auditoría y borrado. Primero la forma del payload (como en S41), luego el permiso sobre el recurso, después el abuso de entrada y al final el ciclo de privacidad. Cada subtema tiene un **contrato local medible**; el gate global **CP-N4-A** solo se aprueba cuando no hay lectura cross-tenant y la redacción se sostiene. S43 tomará este control plane ya endurecido hacia plataforma gobernada.",
      ],
      code: {
        language: 'python',
        title: "s42_map_contract.py",
        code: `def section_contract():
    return {
        "case": "CASO-CUS-042",
        "gates": ["strict_schema", "deny_by_default", "no_cross_tenant", "redaction_holds"],
        "cross_tenant_read_ok": False,
        "redaction_holds": True,
    }

def handle(req: dict, actor: str, owner: str, scopes: set) -> str:
    """Misma petición de S41, ahora con schema + authz fail-closed."""
    allowed = {"case_id", "status"}
    if not {"case_id", "status"}.issubset(req) or set(req) - allowed:
        return "REJECT_SCHEMA"
    if "cases:read" not in scopes or actor != owner:
        return "DENY_CROSS_TENANT"
    return "CONTINUE"

c = section_contract()
print("case", c["case"])
print("cross_tenant_read_ok", c["cross_tenant_read_ok"])
print("redaction_holds", c["redaction_holds"])
print(
    "s41_request",
    handle({"case_id": "CASO-CUS-042", "status": "open"}, "u1", "u2", {"cases:read"}),
)
`,
        output: `case CASO-CUS-042
cross_tenant_read_ok False
redaction_holds True
s41_request DENY_CROSS_TENANT`,
      },
      callout: {
        type: "info",
        title: "Gate de promoción CP-N4-A",
        content: "Control plane seguro y privado: (1) un actor nunca lee el caso de otro tenant, (2) un campo redactado no reaparece en logs, respuestas ni backups activos. Si falta evidencia o la rama es incertidumbre (missing), no se promociona: fail-closed y revisión humana.",
      },
    },
    {
      heading: "Pydantic y JSON Schema",
      subtopicId: "S42-T1-A",
      paragraphs: [
        "Pydantic y JSON Schema describen forma, tipos y restricciones del borde HTTP. Un schema de borde **estricto** modela `extra=forbid` / `additionalProperties: false`: solo las claves en un conjunto *allowed* pasan. Si el cliente manda `note_interna` o un flag de debug no declarado, el borde debe rechazar **antes** de authz, de logs enriquecidos o de persistencia. Eso **no sustituye** invariantes de negocio (p. ej. `status ∈ {open, closed}`): la forma es el primer fail-closed; la autorización y el dominio vienen después.",
        "Contrato local de schema. Entrada: `payload` dict, conjuntos `required` y `allowed`. Salida: `True` solo si `required ⊆ keys(payload) ⊆ allowed` y la regla de negocio del campo `status` se cumple. Error: aceptar cualquier clave no listada o un `status` fuera del vocabulario. Criterio medible: el fixture con `note_interna` o `status=\"maybe\"` devuelve `False` antes de tocar authz. En producción Pydantic exportaría JSON Schema y fallaría con un error tipado; aquí **modelamos** ese contrato con predicados stdlib legibles.",
        "En `CASO-CUS-042-1A` (ticket de soporte sintético en Cusco), el borde acepta solo `{\"case_id\",\"status\"}` y rechaza un cuerpo con `extra` o `note_interna`. Un status basura tampoco pasa: no es un 200 «con warning». El lab no usa cluster ni PII; la evidencia son fixtures válidos/inválidos ejecutables que un revisor puede volver a correr.",
      ],
      code: {
        language: 'python',
        title: "pydantic_jsonschema.py",
        code: `def export_schema(required: set, allowed: set) -> dict:
    """Modelo didáctico de JSON Schema (additionalProperties: false)."""
    return {
        "type": "object",
        "required": sorted(required),
        "properties": {k: {"type": "string"} for k in sorted(allowed)},
        "additionalProperties": False,
    }

def validate_case(payload: dict, required: set, allowed: set) -> bool:
    if not required.issubset(payload):
        return False
    if not set(payload).issubset(allowed):
        return False
    return payload.get("status") in {"open", "closed"}

required = allowed = {"case_id", "status"}
print("schema", export_schema(required, allowed)["additionalProperties"])
print(validate_case({"case_id": "C1", "status": "open"}, required, allowed))
print(validate_case({"case_id": "C1", "status": "open", "note": 1}, required, allowed))
print(validate_case({"case_id": "C1", "status": "maybe"}, required, allowed))`,
        output: `schema False
True
False
False`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Evidencia mínima de S42-T1-A: schema exportado y fixtures válidos/inválidos. Si falta, responde `REJECT_SCHEMA`; si no alcanza para decidir, `REVIEW_BUSINESS_INVARIANT`.",
      },
    },
    {
      heading: "Evolución, discriminated unions y validación de negocio",
      subtopicId: "S42-T1-B",
      paragraphs: [
        "La evolución segura prefiere campos opcionales **aditivos** y discriminated unions **exhaustivas** (cada `type` conocido tiene rama). Renombrar o reinterpretar un campo obligatorio rompe lectores previos: el worker de ayer esperaba `amount` y mañana recibe otra semántica bajo el mismo nombre. Eso exige **versión o migración explícita**, no un silent cast en el borde. El costo de un `add_optional` bien hecho es bajo; el de un rename silencioso es un incidente de integración.",
        "Contrato local de evolución. Entrada: tipo de `change`, bandera `old_reader_passes` y conjuntos `union_tags` / `handled_tags`. Salida: evolución segura solo si el cambio es aditivo, el lector v1 sigue pasando y cada tag de la unión está manejado. Error: `rename_required` o un tag nuevo sin rama. Criterio: ante incompleto → `MIGRATE_CONSUMERS` (missing ≠ breach); ante rupture demostrada → `VERSION_SCHEMA`.",
        "En `CASO-CUS-042-1B`, el canal de notificaciones de Cusco añade `currency` opcional sin tocar `amount`. El lector v1 ignora lo opcional y sigue leyendo montos; si aparece `type=push` sin handler, el despliegue se bloquea hasta migrar consumidores. No se «promueve igual» esperando que el tag desconocido se ignore en producción.",
      ],
      code: {
        language: 'python',
        title: "evolution_unions_business_val.py",
        code: `def event_kind(payload: dict) -> str:
    kind = payload.get("type")
    if kind == "email":
        return "EmailEvent"
    if kind == "sms":
        return "SmsEvent"
    raise ValueError("unknown_event")

def evolution_ok(change: str, old_ok: bool, tags: set, handled: set) -> bool:
    return change == "add_optional" and old_ok and tags == handled

print(event_kind({"type": "email", "to": "a@example.pe"}))
print(event_kind({"type": "sms", "to": "+51"}))
print("compat", evolution_ok("add_optional", True, {"email", "sms"}, {"email", "sms"}))
try:
    event_kind({"type": "push"})
except ValueError as e:
    print("unknown", e)`,
        output: `EmailEvent
SmsEvent
compat True
unknown unknown_event`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Antes de promover S42-T1-B, audita que el lector anterior conserve el contrato. Un breach activa `VERSION_SCHEMA` y una ausencia activa `MIGRATE_CONSUMERS`.",
      },
    },
    {
      heading: "Authn/authz y RBAC",
      subtopicId: "S42-T2-A",
      paragraphs: [
        "La autenticación (authn) identifica al actor; la autorización (authz) decide una **acción sobre un recurso**. Un JWT o cookie válida responde «quién eres», no «puedes leer el caso de otro tenant». RBAC arranca con roles mínimos y exige *resource binding*: el permiso se evalúa contra el **dueño del caso**, no solo contra el rol del token. Confundir **authn** con **authz** es el error clásico que convierte un analista legítimo en un lector cross-tenant.",
        "Contrato local de lectura de caso. Entrada: `actor`, `owner` del caso, `role` y permiso `case:read`. Salida de lab (camino analista): `allow` solo si está autenticado, `actor == owner` y tiene `case:read`. El rol `admin` es un override **explícito** con scope `case:admin`, no un atajo silencioso. Error: tratar identidad (authn) como permiso cross-tenant. Criterio medible: `can_read(u1, u2, analyst)` es False antes de abrir el control plane.",
        "En `CASO-CUS-042-2A` (mesa de soporte sintética en Cusco), el analista `user-a` abre su ticket y recibe vista mínima; el mismo actor sobre el ticket de `user-b` recibe `DENY_CROSS_TENANT` con audit. La identidad correcta no basta: falta binding al recurso. Si faltan roles en el token, la rama es `VERIFY_RESOURCE_OWNER` (incertidumbre), no un allow optimista.",
      ],
      code: {
        language: 'python',
        title: "authn_authz_rbac.py",
        code: `def can_read(actor: str, owner: str, role: str, scopes=None) -> bool:
    scopes = scopes or set()
    if role == "admin" and "case:admin" in scopes:
        return True
    return actor == owner and "case:read" in scopes

print("same_tenant", can_read("u1", "u1", "analyst", {"case:read"}))
print("cross_tenant", can_read("u1", "u2", "analyst", {"case:read"}))
print("admin_override", can_read("u1", "u2", "admin", {"case:admin"}))`,
        output: `same_tenant True
cross_tenant False
admin_override True`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "La revisión de S42-T2-A conserva la prueba de que el actor A no lee el caso B; no conviertas `DENY_CROSS_TENANT` ni `VERIFY_RESOURCE_OWNER` en éxito silencioso.",
      },
    },
    {
      heading: "Scopes, identidades de servicio y deny-by-default",
      subtopicId: "S42-T2-B",
      paragraphs: [
        "Un scope nombra una capacidad estrecha (`report:prepare`, no `*`). Cada microservicio tiene **identidad propia** (`svc-reporter`); un principal genérico `shared-admin` es olor de privilegio excesivo y falla auditorías de least privilege. Deny-by-default: si la ruta no está en el catálogo o el scope no está granted, se deniega **sin** buscar un rol «de confianza» en el header. Tres puertas a la vez: scope + identidad de servicio + ruta declarada.",
        "Contrato local de scopes. Entrada: `requested_scope`, `granted_scopes`, `service_id`, `route_declared`. Salida: `PASS` solo si el scope está granted, el `service_id` es de servicio (`svc-…`) y la ruta está en catálogo. Error: pedir `prod:write` con grant de solo lectura, o un principal que no es `svc-…`. Criterio: matriz con al menos una denegación explícita en evidencia de lab.",
        "En `CASO-CUS-042-2B`, el worker de reportes de Cusco solo tiene `report:prepare` sobre `/reports/prepare`. Un intento de `prod:write` con `shared-admin` cae en `DENY_SCOPE`. Si falta el flag de ruta en el registro, se deriva a `REQUEST_NARROW_GRANT` (missing ≠ breach: no inventes un catálogo completo para «arreglar» el promote).",
      ],
      code: {
        language: 'python',
        title: "scopes_service_ids_deny.py",
        code: `def allow(scope_set: set, needed: str, service_id: str, route_declared: bool) -> bool:
    if needed not in scope_set:
        return False
    if not service_id.startswith("svc-"):
        return False
    return route_declared

print(allow({"jobs:run", "jobs:read"}, "jobs:run", "svc-worker", True))
print(allow({"jobs:read"}, "jobs:admin", "svc-worker", True))
print(allow({"jobs:run"}, "jobs:run", "shared-admin", True))`,
        output: `True
False
False`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Contrato S42-T2-B: demuestra matriz de scopes con denegaciones explícitas. Falla cerrada con `DENY_SCOPE` y deriva incertidumbre mediante `REQUEST_NARROW_GRANT`.",
      },
    },
    {
      heading: "Límites de entrada, injection y SSRF/path traversal",
      subtopicId: "S42-T3-A",
      paragraphs: [
        "Antes de procesar un upload o un fetch, aplica **límite de bytes**, **allowlist de hosts** y **confinamiento de ruta**. Una URL o un path del usuario **nunca** se convierte directamente en socket o filesystem: el clásico SSRF a `169.254.169.254` (metadata cloud) y el path `../etc/passwd` son adversarios reales, no teoría abstracta. Las tres puertas son **conjuntas**: fallar una basta para rechazar.",
        "Contrato local anti-abuso. Entrada: tamaño del body, host de la URL, path resuelto y raíz permitida. Salida: aceptar solo si `bytes ≤ max`, `host ∈ allowlist` y el path queda bajo `root/`. Error: metadata IP, path `/etc/passwd` o `..` de traversal. Criterio: el caso adverso debe **fallar por contenido** (host o path calculados), no por una etiqueta impresa a mano.",
        "En `CASO-CUS-042-3A`, el adjunto de un ticket de Cusco se guarda bajo `/safe/reports/`. Un body de 9999 bytes, host de metadata cloud o path `/etc/passwd` produce `REJECT_UNTRUSTED_INPUT`. Si falta la raíz de confinamiento en el registro, se abre `SECURITY_REVIEW` (no se asume breach ni se inventa un root por defecto).",
      ],
      code: {
        language: 'python',
        title: "limits_injection_ssrf_path.py",
        code: `def safe_path(base: str, user_path: str) -> str:
    if ".." in user_path.split("/"):
        raise ValueError("traversal")
    joined = f"{base.rstrip('/')}/{user_path.lstrip('/')}"
    root = base.rstrip("/")
    if not joined.startswith(root + "/") and joined != root:
        raise ValueError("escape")
    return joined

def url_allowed(url: str, allow: set) -> bool:
    host = url.split("://", 1)[-1].split("/", 1)[0]
    return host in allow

print(safe_path("/data", "a.txt"))
try:
    safe_path("/data", "../etc/passwd")
except ValueError as e:
    print("blocked", e)
print("ssrf_ok", url_allowed("https://docs.example.pe/a", {"docs.example.pe"}))
print("ssrf_block", url_allowed("http://169.254.169.254/", {"docs.example.pe"}))`,
        output: `/data/a.txt
blocked traversal
ssrf_ok True
ssrf_block False`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Para S42-T3-A, el artefacto comprobable es payload/URL/ruta adversarial rechazada. Sin él corresponde `REJECT_UNTRUSTED_INPUT` o, si faltan datos, `SECURITY_REVIEW`.",
      },
    },
    {
      heading: "Secretos, cifrado y dependency risk",
      subtopicId: "S42-T3-B",
      paragraphs: [
        "Los secretos entran por runtime (env/vault), **nunca** por repo ni logs. Un `.env` commiteado o un token en un traceback de CI es un incidente, no un «atajo de demo». El cifrado en reposo necesita gestión de claves; las dependencias se **fijan por versión** y se revisan por CVE y provenance. Un promote limpio de secretos con deps sin pin y CVE críticas abiertas sigue siendo inseguro.",
        "Contrato local de secretos y deps. Entrada: flags de secreto en repo/log, rotación ensayada, pin de dependencias y conteo de CVE críticas. Salida: `PASS` solo si no hay secreto en artefacto, la rotación se probó, hay pin y `critical_cves == 0`. Error: API key en artefacto o paquete sin pin con CVE abierta. Criterio: evidencia de scan + ensayo de rotación, no solo política en un wiki.",
        "En `CASO-CUS-042-3B`, el pipeline de Cusco falla el promote si hay secreto en repo o deps sin pin. Un hallazgo real dispara `ROTATE_AND_BLOCK`; si falta el inventario de CVE, se deriva a `ASSESS_DEPENDENCY_RISK` **sin inventar un cero** (missing ≠ «cero riesgos»).",
      ],
      code: {
        language: 'python',
        title: "secrets_crypto_deps.py",
        code: `import hashlib

def secret_fingerprint(raw: bytes) -> str:
    return hashlib.sha256(raw).hexdigest()[:12]

def promote_ok(secret_in_repo: bool, pinned: bool, critical_cves: int) -> bool:
    return (not secret_in_repo) and pinned and critical_cves == 0

print("fp", secret_fingerprint(b"not-a-real-secret"))
print("promote", promote_ok(False, True, 0))
print("block", promote_ok(True, False, 2))
print("block_unpinned", promote_ok(False, False, 0))`,
        output: `fp ed24bc0bb03d
promote True
block False
block_unpinned False`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Promoción de S42-T3-B: prueba el scan sin secreto y la rotación ensayada. Registra por separado `ROTATE_AND_BLOCK` (breach) y `ASSESS_DEPENDENCY_RISK` (missing).",
      },
    },
    {
      heading: "Minimización, purpose y retención",
      subtopicId: "S42-T4-A",
      paragraphs: [
        "Privacidad exige el **mínimo de campos** para un propósito declarado y una **retención finita**. «Podría servir después» no es finalidad: o se documenta el propósito o no se recolecta el campo. Un tablero de estado no necesita `full_name` ni email; arrastrarlos «por si acaso» crea superficie de filtración y complica el borrado posterior.",
        "Contrato local de minimización. Entrada: conjuntos `collected`/`needed`, `purpose`, `retention_days` y techo `max_retention_days`. Salida: inventario aprobado solo si `collected ⊆ needed`, el purpose es el del caso de uso y la retención no excede el techo. Error: recolectar `full_name` para un status-report o retener 3650 días. Criterio: inventario propósito-campo-retención revisable por el dueño de privacidad.",
        "En `CASO-CUS-042-4A`, el tablero de estado de Cusco solo necesita `case_id` y `region` por 30 días. Si el payload arrastra `full_name` o purpose `maybe-useful`, se emite `MINIMIZE_AND_EXPIRE`. Sin techo de retención declarado → `PRIVACY_OWNER_REVIEW` (no inventes 30 días por defecto para forzar un PASS).",
      ],
      code: {
        language: 'python',
        title: "minimize_purpose_retention.py",
        code: `def minimize(fields: dict, allow: set) -> list:
    return sorted(k for k in fields if k in allow)

def retention_ok(collected: set, needed: set, purpose: str, days: int, max_days: int) -> bool:
    return collected <= needed and purpose == "status-report" and days <= max_days

print("minimized", minimize({"case_id": "C1", "status": "open", "email": "x"}, {"case_id", "status"}))
print("ok", retention_ok({"case_id", "region"}, {"case_id", "region"}, "status-report", 30, 30))
print("over", retention_ok({"case_id", "full_name"}, {"case_id"}, "maybe-useful", 3650, 30))`,
        output: `minimized ['case_id', 'status']
ok True
over False`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "El dueño de S42-T4-A acepta solo inventario propósito-campo-retención aprobado; una violación produce `MINIMIZE_AND_EXPIRE` y un registro incompleto produce `PRIVACY_OWNER_REVIEW`.",
      },
    },
    {
      heading: "Audit, deletion, pseudonymization y acceso",
      subtopicId: "S42-T4-B",
      paragraphs: [
        "El audit registra quién/qué/cuándo **sin copiar PII**. Soft-delete de la fila primaria **no basta**: cachés, índices de búsqueda y exports CSV suelen sobrevivir y reintroducen el dato. La pseudonimización separa la llave de reidentificación; el acceso a esa llave queda revisable. El gate de redacción de CP-N4-A se demuestra aquí: el campo sensible no reaparece.",
        "Contrato local de ciclo de vida. Entrada: campos de audit, conjunto PII, flags de borrado primario/derivado y `key_separate`. Salida: `PASS` solo si audit ∩ PII = ∅, ambos borrados y la llave está separada. Error: email en el log de audit o un export CSV que sobrevive al soft-delete. Criterio: prueba de no-reaparición del campo redactado en logs, respuestas y backups activos.",
        "En `CASO-CUS-042-4B`, al cerrar un ticket de Cusco se purgan la fila, el snapshot de búsqueda y el export. El audit solo guarda `actor_id`, `action`, `at` y un `case_token` pseudónimo. Si reaparece `email` en audit o un derivado vivo → `PURGE_DERIVATIVES`. Sin `key_separate` declarado → `VERIFY_DELETION_SCOPE` (alcance de borrado no confirmado).",
      ],
      code: {
        language: 'python',
        title: "audit_delete_pseudo_access.py",
        code: `import hashlib

def pseudonym(subject: str) -> str:
    return hashlib.sha256(f"synth:{subject}".encode()).hexdigest()[:16]

def purge_ok(audit: set, pii: set, deleted: bool, derived_deleted: bool, key_separate: bool) -> bool:
    return audit.isdisjoint(pii) and deleted and derived_deleted and key_separate

print("pseudo", pseudonym("user-1"))
print("ok", purge_ok({"actor_id", "action", "case_token"}, {"email", "full_name"}, True, True, True))
print("leak", purge_ok({"actor_id", "email"}, {"email"}, True, False, False))`,
        output: `pseudo d6e07b73dc2ab4b4
ok True
leak False`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Cierre de S42-T4-B: conserva el borrado y la no-reaparición verificados, la evidencia de `PURGE_DERIVATIVES` y la ruta humana `VERIFY_DELETION_SCOPE`.",
      },
    },
  ],
  iDo: {
    intro: "Te muestro 8 demos de S42 alineadas a CP-N4-A, en el orden del control plane: forma del payload, evolución, lectura de caso, scopes de servicio, SSRF/path, secretos/deps, minimización y purga. Cada demo **calcula** el control sobre `CASO-CUS-042` (Cusco sintético): no imprime una etiqueta de seguridad sin derivarla de los datos.",
    steps: [
      {
        demoId: "S42-T1-A-DEMO",
        subtopicId: "S42-T1-A",
        environment: "local-python",
        description: "Demo: schema estricto (extra=forbid) + regla de negocio",
        preamble:
          "Antes de authz o persistencia, el borde HTTP de la mesa de soporte de Cusco debe **rechazar forma incorrecta**. En esta demo un ticket sintético `CASO-CUS-042-1A` se valida con schema estricto (modelo de `extra=forbid`): solo `case_id` y `status` en `{open, closed}`. No escribas aún: predice `valid`, `extra` y `biz` antes de mirar la salida. Si confundes «JSON parseable» con «schema OK», un `note` interno o un `status=maybe` entra al control plane.",
        code: {
          language: 'python',
          title: "demo_pydantic_jsonschema.py",
          code: `def validate_case(payload: dict, required: set, allowed: set) -> bool:
    if not required.issubset(payload):
        return False
    if not set(payload).issubset(allowed):
        return False
    return payload.get("status") in {"open", "closed"}

req = allow = {"case_id", "status"}
print("valid", validate_case({"case_id": "CASO-CUS-042-1A", "status": "open"}, req, allow))
print("extra", validate_case({"case_id": "CASO-CUS-042-1A", "status": "open", "note": 1}, req, allow))
print("biz", validate_case({"case_id": "CASO-CUS-042-1A", "status": "maybe"}, req, allow))`,
          output: `valid True
extra False
biz False`,
        },
        why: "`required.issubset` exige presencia de claves; `set(payload).issubset(allowed)` modela `additionalProperties: false` / extra=forbid. El vocabulario de `status` es invariante de negocio en el borde, no un «warning» que se ignora. Orden del control plane: forma primero, authz después. El ticket limpio de Cusco pasa; un campo extra o un status basura fallan antes de tocar al actor. En We Do repararás el predicado incompleto, la tabla PASS/REJECT/MISSING y la decisión CONTINUE/REJECT/REVIEW.",
        retrospective:
          "Si puedes explicar por qué un campo extra y un status basura fallan **antes** de mirar al actor, ya tienes el hábito de schema de borde. El error clásico es aceptar extras «por flexibilidad». En We Do practicarás el predicado, las tres rutas y la rama humana cuando falta `status`.",
      },
      {
        demoId: "S42-T1-B-DEMO",
        subtopicId: "S42-T1-B",
        environment: "local-python",
        description: "Demo: lector v1 sobre cambio aditivo",
        preamble:
          "Evolucionar un contrato no es «cambiar el JSON y ya». En esta demo el lector v1 de montos sigue funcionando cuando aparece `currency` opcional; sin `amount` falla de verdad. Luego `evolution_ok` confirma cambio aditivo con unión de tags completa. No escribas: predice el monto, el error y `evol True`. Si renombras un campo obligatorio o dejas un tag `push` sin rama, rompes al worker de ayer.",
        code: {
          language: 'python',
          title: "demo_evolution_unions_business_val.py",
          code: `def business_amount(v1: dict) -> int:
    if "amount" not in v1:
        raise ValueError("amount")
    return int(v1["amount"])

def evolution_ok(change: str, old_ok: bool, tags: set, handled: set) -> bool:
    return change == "add_optional" and old_ok and tags == handled

print(business_amount({"amount": 10, "currency": "PEN"}))
try:
    business_amount({"currency": "PEN"})
except ValueError as e:
    print("err", e)
print(
    "evol",
    evolution_ok("add_optional", True, {"email", "sms"}, {"email", "sms"}),
)`,
          output: `10
err amount
evol True`,
        },
        why: "Aditivo + lector v1 OK + tags == handled es el triple de evolución segura: el worker de ayer sigue leyendo `amount` con `currency` opcional; sin `amount` falla de verdad, no con un silent cast. Un tag desconocido (p. ej. `push` sin handler) es bloqueo de deploy, no ignore silencioso. En We Do corregirás `evolution_ok` invertido, assess VERSION/MISSING y decide MIGRATE_CONSUMERS.",
        retrospective:
          "Evolución segura = aditiva y exhaustiva. Rename silencioso o tag `push` sin rama rompe al worker de ayer. Pregunta: si el lector v1 ignora `currency` pero falta `amount`, ¿por qué debe fallar de verdad y no con cast silencioso? We Do: predicado, tres rutas y MIGRATE_CONSUMERS.",
      },
      {
        demoId: "S42-T2-A-DEMO",
        subtopicId: "S42-T2-A",
        environment: "local-python",
        description: "Demo: authn ≠ authz y no cross-tenant",
        preamble:
          "Estar autenticado no es estar autorizado. En esta demo el analista `u1` lee su caso, se le deniega el de `u2`, y solo un `admin` con scope `case:admin` cruza tenants de forma **explícita**. No escribas: predice las tres líneas. Si tratas el token como permiso global, rompes el gate no cross-tenant de CP-N4-A.",
        code: {
          language: 'python',
          title: "demo_authn_authz_rbac.py",
          code: `def can_read(actor: str, owner: str, role: str, scopes=None) -> bool:
    scopes = scopes or set()
    if role == "admin" and "case:admin" in scopes:
        return True
    return actor == owner and "case:read" in scopes

print("same_tenant", can_read("u1", "u1", "analyst", {"case:read"}))
print("cross_tenant", can_read("u1", "u2", "analyst", {"case:read"}))
print("admin_override", can_read("u1", "u2", "admin", {"case:admin"}))`,
          output: `same_tenant True
cross_tenant False
admin_override True`,
        },
        why: "Resource binding `actor == owner` más scope `case:read` es el núcleo del camino analista; admin es override con scope `case:admin` propio, no un atajo silencioso del rol. Authn responde «quién eres»; authz responde «sobre este recurso». El cross-tenant denegado es evidencia del gate CP-N4-A. En We Do practicarás `can_read` del analista, assess DENY/MISSING y decide VERIFY_RESOURCE_OWNER.",
        retrospective:
          "Authn responde «quién eres»; authz responde «sobre este recurso». El error clásico es confiar solo en la identidad del token. En We Do practicarás binding, tres rutas y la rama humana cuando faltan roles.",
      },
      {
        demoId: "S42-T2-B-DEMO",
        subtopicId: "S42-T2-B",
        environment: "local-python",
        description: "Demo: catálogo de scopes por identidad de servicio",
        preamble:
          "Cada microservicio tiene **identidad propia** y scopes estrechos. En esta demo `svc-er-worker` solo tiene `jobs:run`; `jobs:admin` y el principal `shared-admin` quedan en deny-by-default. No escribas: predice las tres líneas. Si un «admin compartido» hereda scopes fantasma, fallas auditorías de least privilege.",
        code: {
          language: 'python',
          title: "demo_scopes_service_ids_deny.py",
          code: `def service_scopes(service_id: str) -> list:
    catalog = {"svc-er-worker": ["jobs:run"], "svc-api": ["jobs:read"]}
    return catalog.get(service_id, [])

def allow(service_id: str, needed: str) -> bool:
    return needed in service_scopes(service_id)

print("worker_run", allow("svc-er-worker", "jobs:run"))
print("worker_admin", allow("svc-er-worker", "jobs:admin"))
print("unknown", allow("shared-admin", "jobs:run"))`,
          output: `worker_run True
worker_admin False
unknown False`,
        },
        why: "El catálogo es explícito: ausencia de entrada = lista vacía = deny. No hay scope `*` ni herencia por «confianza» del header. El worker solo corre jobs; admin no granted y un principal genérico no reciben scopes fantasma. En We Do practicarás allow de tres puertas (scope + svc- + ruta), matriz DENY_SCOPE y REQUEST_NARROW_GRANT.",
        retrospective:
          "Deny-by-default por catálogo evita privilegio implícito. El error clásico es confiar en un principal genérico. En We Do practicarás grant + identidad `svc-` + ruta declarada.",
      },
      {
        demoId: "S42-T3-A-DEMO",
        subtopicId: "S42-T3-A",
        environment: "local-python",
        description: "Demo: allowlist SSRF + path confinement",
        preamble:
          "Una URL o un path del usuario **nunca** se convierte directo en red o disco. En esta demo el host de docs de ejemplo está permitido; `169.254.169.254` (metadata cloud) se bloquea; un path con `..` lanza traversal; `a.txt` bajo `/safe/reports` pasa. No escribas: predice las cuatro salidas. Si solo miras el path y no el host, un SSRF clásico entra.",
        code: {
          language: 'python',
          title: "demo_limits_injection_ssrf_path.py",
          code: `def url_allowed(url: str, allow: set) -> bool:
    host = url.split("://", 1)[-1].split("/", 1)[0]
    return host in allow

def safe_path(base: str, user_path: str) -> str:
    if ".." in user_path.split("/"):
        raise ValueError("traversal")
    joined = f"{base.rstrip('/')}/{user_path.lstrip('/')}"
    root = base.rstrip("/")
    if not joined.startswith(root + "/") and joined != root:
        raise ValueError("escape")
    return joined

print(url_allowed("https://docs.example.pe/a", {"docs.example.pe"}))
print(url_allowed("http://169.254.169.254/", {"docs.example.pe"}))
try:
    safe_path("/safe/reports", "../etc/passwd")
except ValueError as e:
    print("path", e)
print("ok_path", safe_path("/safe/reports", "a.txt"))`,
          output: `True
False
path traversal
ok_path /safe/reports/a.txt`,
        },
        why: "El host se extrae antes de cualquier fetch; el confinement exige prefijo de root y bloquea `..`. No hay print de etiqueta fija: el rechazo se **calcula** desde host y path. Metadata cloud y traversal fallan por contenido, no por un flag inventado. En We Do practicarás trusted de tres puertas (size + host + path), assess REJECT/MISSING:root y SECURITY_REVIEW.",
        retrospective:
          "Allowlist + confinement cortan SSRF y traversal **antes** del uso. El error clásico es confiar en «https» o filtrar después del fetch. En We Do practicarás size + host + path como puertas conjuntas.",
      },
      {
        demoId: "S42-T3-B-DEMO",
        subtopicId: "S42-T3-B",
        environment: "local-python",
        description: "Demo: deps envejecidas y promote de secretos",
        preamble:
          "Un promote limpio de secretos con deps sin pin sigue siendo inseguro. En esta demo se listan deps «viejas», se aprueba un promote limpio y se bloquea el que tiene secreto en repo + sin pin + CVE. No escribas: predice `high`, `promote` y `block`. Si inventas `critical_cves=0` sin inventario, confundes missing con «cero riesgos».",
        code: {
          language: 'python',
          title: "demo_secrets_crypto_deps.py",
          code: `def risk_deps(deps: list, max_age_days: int = 180) -> list:
    return [d["name"] for d in deps if d.get("age_days", 0) > max_age_days]

def promote_ok(secret_in_repo: bool, pinned: bool, cves: int) -> bool:
    return (not secret_in_repo) and pinned and cves == 0

print("high", risk_deps([{"name": "old", "age_days": 400}, {"name": "fresh", "age_days": 10}]))
print("promote", promote_ok(False, True, 0))
print("block", promote_ok(True, False, 2))`,
          output: `high ['old']
promote True
block False`,
        },
        why: "Los secretos salen del artefacto; el promote exige pin de deps y cero CVE críticas (en We Do se suma rotación ensayada). Un hallazgo real es ROTATE_AND_BLOCK; un inventario ausente no se convierte en «cero riesgos». La demo es un subset del contrato completo: riesgo por edad + conjunción de controles. En We Do practicarás promote de cinco flags, assess ROTATE/MISSING y ASSESS_DEPENDENCY_RISK.",
        retrospective:
          "Promote fail-closed es conjunción de controles, no «no hay key en el README». Inventar `critical_cves=0` sin inventario confunde missing con cero riesgos. Pregunta: si no hay secreto en repo pero las deps no están pinned, ¿promote True o False? We Do: cinco flags y rama ASSESS.",
      },
      {
        demoId: "S42-T4-A-DEMO",
        subtopicId: "S42-T4-A",
        environment: "local-python",
        description: "Demo: drop de email en logs y purpose-bound",
        preamble:
          "Un tablero de estado no necesita email. En esta demo el registro crudo de Cusco se reduce a `case_id` y `region` para el log; `email_in_log` queda False; la retención de 30 días con purpose `status-report` pasa. No escribas: predice la vista y las dos banderas. Si arrastras PII «por si acaso», complicas el borrado y el gate de redacción de CP-N4-A.",
        code: {
          language: 'python',
          title: "demo_minimize_purpose_retention.py",
          code: `def for_log(record: dict, allow: set) -> dict:
    return {k: v for k, v in record.items() if k in allow}

def retention_ok(days: int, max_days: int, purpose: str) -> bool:
    return purpose == "status-report" and 0 < days <= max_days

raw = {"case_id": "CASO-CUS-042-4A", "email": "x@example.pe", "region": "CUS"}
view = for_log(raw, {"case_id", "region"})
print(view)
print("email_in_log", "email" in view)
print("retention_ok", retention_ok(30, 30, "status-report"))`,
          output: `{'case_id': 'CASO-CUS-042-4A', 'region': 'CUS'}
email_in_log False
retention_ok True`,
        },
        why: "La allowlist de campos ata el log al purpose declarado; el techo de retención es finito y medible. El email no reaparece en la vista — evidencia de minimización, no un print decorativo. «Podría servir después» no es purpose. En We Do practicarás inventory_ok, assess MINIMIZE/MISSING:max y PRIVACY_OWNER_REVIEW.",
        retrospective:
          "Minimización = purpose + campos + techo de días. El error clásico es recolectar full_name «para el tablero». En We Do practicarás inventarios y la rama del dueño de privacidad.",
      },
      {
        demoId: "S42-T4-B-DEMO",
        subtopicId: "S42-T4-B",
        environment: "local-python",
        description: "Demo: borrado primario vs. derivado vivo",
        preamble:
          "Borrar la fila primaria **no cierra** el ciclo de privacidad. En esta demo `C1` desaparece del store primario pero el export `snapshot.csv` sigue en derivados; `purge_complete` es False. No escribas: predice las tres banderas. Si confundes soft-delete con purga, un campo redactado reaparece en backup o CSV y rompes CP-N4-A.",
        code: {
          language: 'python',
          title: "demo_audit_delete_pseudo_access.py",
          code: `def deleted_gone(store: dict, case_id: str) -> bool:
    return case_id not in store

def purge_complete(primary: dict, derived: dict, case_id: str) -> bool:
    return deleted_gone(primary, case_id) and deleted_gone(derived, case_id)

primary = {"C1": {"status": "open"}}
derived = {"C1": {"export": "snapshot.csv"}}
del primary["C1"]
print("primary_gone", deleted_gone(primary, "C1"))
print("derived_still", not deleted_gone(derived, "C1"))
print("must_purge_derived", not purge_complete(primary, derived, "C1"))`,
          output: `primary_gone True
derived_still True
must_purge_derived True`,
        },
        why: "`primary_gone` no implica purga: cachés, índices de búsqueda y exports CSV suelen sobrevivir. `purge_complete` es False mientras el derivado vive — evidencia de PURGE_DERIVATIVES pendiente. En We Do se suma audit sin PII y llave de reidentificación separada. Practica purge_ok, assess PURGE/MISSING:key y VERIFY_DELETION_SCOPE.",
        retrospective:
          "Purga completa = primario + derivados + audit limpio + llave separada. El error clásico es «DELETE FROM y listo». En We Do practicarás el predicado, las tres rutas y VERIFY humana.",
      },
    ],
  },
  weDo: {
    intro: "S42 · Laboratorio de threat model y matriz de permisos (CP-N4-A): 24 retos locales sobre `CASO-CUS-042`. E1 repara el cuerpo de una función de decisión. E2 separa válido, adverso real y evidencia ausente (missing ≠ breach). E3 cierra fail-closed con códigos de acción (`CONTINUE`, DENY|REJECT o rama humana). Entrena el **control**, no el flip de un booleano precomputado: el adverso falla por contenido (extra key, cross-tenant, 169.254…, `/etc/passwd`, over-collection o audit ∩ PII).",
    steps: [
      {
        id: "S42-T1-A-E1",
        subtopicId: "S42-T1-A",
        kind: "guided",
        title: "Schema estricto con status de negocio",
        preamble:
          "- **Contexto:** en `CASO-CUS-042-1A`, el ticket de Cusco solo puede entrar si la forma es estricta y el `status` es del vocabulario.\n- **Meta:** completar el predicado `meets_contract` (required ⊆ keys ⊆ allowed + status en `{open, closed}`).\n- **Éxito:** imprimes exactamente `S42-T1-A PASS` con el fixture válido.\n- **Límites:** no inventes campos; no «aceptes extras por ahora»; no toques los datos del fixture.",
        instruction:
          "S42-T1-A-E1 · Salida: debe devolver el PASS del contrato. 1. Abre el starter: `meets_contract = required.issubset(payload)` (bug: incompleto).\n2. Añade `set(payload).issubset(allowed)`.\n3. Añade `payload.get(\"status\") in {\"open\", \"closed\"}`.\n4. Conserva el print `S42-T1-A` y el status PASS/REJECT_SCHEMA.",
        hint: "Modelo de extra=forbid: `set(payload) ⊆ allowed` y `status ∈ {open, closed}`.",
        hints: [
          "Modelo de extra=forbid: `set(payload) ⊆ allowed` y `status ∈ {open, closed}`.",
          "El fixture válido solo tiene case_id y status=open; no inventes campos ni cambies los datos.",
        ],
        edgeCases: ["Campo extra no listado", "Status fuera de vocabulario", "CASO-CUS-042-1A es sintético"],
        tests: "El fixture `CASO-CUS-042-1A` satisface el schema estricto; imprime `S42-T1-A PASS` y el assert booleano pasa.",
        feedback:
          "`required ⊆ keys ⊆ allowed` modela extra=forbid: un `note` no declarado es REJECT_SCHEMA, no un warning. Un status inválido también es forma de negocio en el borde; no lo confundes con un fallo de authz.",
        retrospective:
          "Schema estricto = forma + vocabulario **antes** de permiso. Solo `required.issubset` deja pasar `note` o `status=maybe`. El error clásico del starter es «si están las claves, basta». Pregunta: si el JSON parsea pero trae `note_interna`, ¿es warning o REJECT_SCHEMA? Siguiente (E2): tres rutas válido / extra / missing.",
        starterCode: {
          language: 'python',
          title: "s42-t1-a-e1.py",
          code: `# CASO-CUS-042 · schema estricto (extra=forbid) + status
# Defecto didáctico: el predicado solo exige required; acepta extras y status basura.
# Corrige solo la decisión de dominio; conserva datos y la salida esperada.
payload = {"case_id": "CASO-CUS-042-1A", "status": "open"}
required = {"case_id", "status"}
allowed = {"case_id", "status"}
# Defecto: incompleto — no rechaza claves extra ni valida status
meets_contract = required.issubset(payload)
status = "PASS" if meets_contract else "REJECT_SCHEMA"
print("S42-T1-A", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s42-t1-a-e1.py",
          code: `payload = {"case_id": "CASO-CUS-042-1A", "status": "open"}
required = {"case_id", "status"}
allowed = {"case_id", "status"}
meets_contract = (
    required.issubset(payload)
    and set(payload).issubset(allowed)
    and payload.get("status") in {"open", "closed"}
)
status = "PASS" if meets_contract else "REJECT_SCHEMA"
print("S42-T1-A", status)
assert meets_contract is True` ,
          output: `S42-T1-A PASS` ,
        },
      },
      {
        id: "S42-T1-A-E2",
        subtopicId: "S42-T1-A",
        kind: "independent",
        title: "Tres rutas de schema (PASS / REJECT / MISSING)",
        preamble:
          "- **Contexto:** el revisor de borde en Cusco no trata igual un ticket limpio, uno con campo espía y uno incompleto.\n- **Meta:** implementar `assess` que distinga PASS, REJECT_SCHEMA y MISSING:status.\n- **Éxito:** imprime `PASS REJECT_SCHEMA MISSING:status` en ese orden.\n- **Límites:** si falta `status`, no evalúes extras; no inventes el campo; missing ≠ «aceptar».",
        instruction:
          "S42-T1-A-E2 · Salida: debe devolver el PASS del contrato. 1. Revisa el starter: con `status` presente devuelve PASS si hay `case_id` (bug: ignora extras).\n2. Primero: si no hay `status` → `MISSING:status`.\n3. Luego: required ⊆ keys ⊆ allowed y status en vocabulario → PASS; si no → REJECT_SCHEMA.\n4. Imprime los tres resultados con `print(*results)`.",
        hint: "Si falta `status`, devuelve MISSING:status sin mirar extras.",
        hints: [
          "Si falta `status`, devuelve MISSING:status sin mirar extras.",
          "Con payload completo: required ⊆ keys ⊆ allowed y status ∈ {open, closed}; si no, REJECT_SCHEMA.",
        ],
        edgeCases: ["Falta status", "Campo extra adversarial", "CASO-CUS-042-1A es sintético"],
        tests: "La tabla cubre válido/extra/sin status y produce exactamente `PASS REJECT_SCHEMA MISSING:status`.",
        feedback:
          "Missing es incertidumbre de evidencia; extra es breach de forma. El revisor de borde no confunde un ticket incompleto con un ataque ni con un PASS.",
        retrospective:
          "Un ticket incompleto no es un ataque: es evidencia ausente. Un `note_interna` sí es breach de forma. El error clásico es forzar PASS inventando `status` o tratar incompleto como REJECT. Pregunta: ¿en qué orden evalúas missing vs. extras, y por qué? Luego (E3): enrutas CONTINUE / REJECT / REVIEW humana.",
        starterCode: {
          language: 'python',
          title: "s42-t1-a-e2.py",
          code: `# CASO-CUS-042 · assess schema reject sobre payloads reales
# Defecto didáctico: PASS si hay cualquier clave (incluye extras) y no valida status.
# Corrige solo la decisión de dominio; conserva datos y la salida esperada.
def assess(payload: dict) -> str:
    if "status" not in payload:
        return "MISSING:status"
    # Defecto: acepta cualquier payload con status, incluso con extras basura
    return "PASS" if "case_id" in payload else "REJECT_SCHEMA"

valid = {"case_id": "CASO-CUS-042-1A", "status": "open"}
invalid = {"case_id": "CASO-CUS-042-1A", "status": "open", "note_interna": "x"}
incomplete = {"case_id": "CASO-CUS-042-1A"}
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s42-t1-a-e2.py",
          code: `def assess(payload: dict) -> str:
    if "status" not in payload:
        return "MISSING:status"
    required = {"case_id", "status"}
    allowed = {"case_id", "status"}
    ok = (
        required.issubset(payload)
        and set(payload).issubset(allowed)
        and payload.get("status") in {"open", "closed"}
    )
    return "PASS" if ok else "REJECT_SCHEMA"

valid = {"case_id": "CASO-CUS-042-1A", "status": "open"}
invalid = {"case_id": "CASO-CUS-042-1A", "status": "open", "note_interna": "x"}
incomplete = {"case_id": "CASO-CUS-042-1A"}
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS REJECT_SCHEMA MISSING:status` ,
        },
      },
      {
        id: "S42-T1-A-E3",
        subtopicId: "S42-T1-A",
        kind: "transfer",
        title: "Decide schema: CONTINUE o REVIEW",
        preamble:
          "- **Contexto:** el borde de la mesa de soporte decide si un ticket **sigue** o se detiene: no hay «seguir con warning».\n- **Meta:** `decide` → CONTINUE (limpio), REJECT_SCHEMA (extra), REVIEW_BUSINESS_INVARIANT (sin status).\n- **Éxito:** `CONTINUE REJECT_SCHEMA REVIEW_BUSINESS_INVARIANT`.\n- **Límites:** no inventes `status`; no conviertas missing en CONTINUE; no toques los fixtures.",
        instruction:
          "S42-T1-A-E3 · Salida: debe devolver el PASS del contrato. 1. Corrige missing: sin `status` → `REVIEW_BUSINESS_INVARIANT` (no CONTINUE).\n2. Con payload completo, reutiliza el predicado estricto de E1/E2.\n3. Solo el limpio es CONTINUE; el de `note_interna` es REJECT_SCHEMA.\n4. Imprime los tres códigos en orden.",
        hint: "Una ausencia no es breach: enrútala a `REVIEW_BUSINESS_INVARIANT` antes de evaluar extras.",
        hints: [
          "Una ausencia no es breach: enrútala a `REVIEW_BUSINESS_INVARIANT` antes de evaluar extras.",
          "Con payload completo reutiliza required ⊆ keys ⊆ allowed y status en vocabulario; solo ese caso es CONTINUE.",
        ],
        edgeCases: ["Falta status", "Campo extra adversarial", "CASO-CUS-042-1A es sintético"],
        tests: "Fixtures válidos, con extra y sin status prueban continue/breach/uncertainty en ese orden.",
        feedback:
          "El revisor de borde ve un ticket incompleto como REVIEW humana, no como ataque. El extra es breach demostrable y no se convierte en CONTINUE silencioso.",
        retrospective:
          "Un ticket incompleto es revisión humana, no un allow optimista. El error clásico es promover con «faltan datos, igual pasa». Pregunta: ¿por qué REJECT no es lo mismo que REVIEW?",
        starterCode: {
          language: 'python',
          title: "s42-t1-a-e3.py",
          code: `# CASO-CUS-042 · decide REJECT_SCHEMA sobre payloads
# Defecto didáctico: missing→CONTINUE; extras se aceptan como CONTINUE.
# Corrige solo la decisión de dominio; conserva datos y la salida esperada.
def decide(payload: dict) -> str:
    if "status" not in payload:
        return "CONTINUE"
    # Defecto: cualquier status presente continúa, aunque haya extras
    return "CONTINUE" if "case_id" in payload else "REJECT_SCHEMA"

valid = {"case_id": "CASO-CUS-042-1A", "status": "open"}
invalid = {"case_id": "CASO-CUS-042-1A", "status": "open", "note_interna": "x"}
uncertain = {"case_id": "CASO-CUS-042-1A"}
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s42-t1-a-e3.py",
          code: `def decide(payload: dict) -> str:
    if "status" not in payload:
        return "REVIEW_BUSINESS_INVARIANT"
    required = {"case_id", "status"}
    allowed = {"case_id", "status"}
    ok = (
        required.issubset(payload)
        and set(payload).issubset(allowed)
        and payload.get("status") in {"open", "closed"}
    )
    return "CONTINUE" if ok else "REJECT_SCHEMA"

valid = {"case_id": "CASO-CUS-042-1A", "status": "open"}
invalid = {"case_id": "CASO-CUS-042-1A", "status": "open", "note_interna": "x"}
uncertain = {"case_id": "CASO-CUS-042-1A"}
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "REJECT_SCHEMA", "REVIEW_BUSINESS_INVARIANT"]` ,
          output: `CONTINUE REJECT_SCHEMA REVIEW_BUSINESS_INVARIANT` ,
        },
      },
      {
        id: "S42-T1-B-E1",
        subtopicId: "S42-T1-B",
        kind: "guided",
        title: "Evolución aditiva con unión exhaustiva",
        preamble:
          "- **Contexto:** en `CASO-CUS-042-1B`, el canal de notificaciones de Cusco solo puede desplegar si el cambio es aditivo y cada tag tiene handler.\n- **Meta:** implementar `evolution_ok` = add_optional ∧ old_ok ∧ tags == handled.\n- **Éxito:** `S42-T1-B PASS` con el fixture aditivo email/phone.\n- **Límites:** no apruebes `rename_required`; no ignores tags huérfanos.",
        instruction:
          "S42-T1-B-E1 · Salida: debe devolver el PASS del contrato. 1. El starter devuelve True ante rename o tags distintos (bug).\n2. Cambia a: change es `add_optional`, old_ok es True y sets iguales.\n3. Conserva print y status PASS/VERSION_SCHEMA.",
        hint: "PASS si change=='add_optional' y old_reader_passes y union_tags == handled_tags.",
        hints: [
          "PASS si change=='add_optional' y old_reader_passes y union_tags == handled_tags.",
          "Un rename_required o un tag sin handler no es evolución segura: VERSION_SCHEMA.",
        ],
        edgeCases: ["rename_required", "tag push sin handler", "CASO-CUS-042-1B es sintético"],
        tests: "El fixture aditivo con tags email/phone manejados imprime `S42-T1-B PASS`.",
        feedback:
          "La evolución segura es aditiva y exhaustiva: rename o tags huérfanos rompen lectores previos del canal de notificaciones y exigen VERSION_SCHEMA.",
        retrospective:
          "`add_optional ∧ old_ok ∧ tags == handled` es el triple; el starter lo invierte y «aprueba» rupture. El error clásico es rename y listo. Pregunta: con tags `{email, phone, push}` y handled sin `push`, ¿PASS o VERSION_SCHEMA? Siguiente: PASS / VERSION / MISSING:handled_tags.",
        starterCode: {
          language: 'python',
          title: "s42-t1-b-e1.py",
          code: `# CASO-CUS-042 · evolución aditiva + union exhaustiva
# Defecto didáctico: evolution_ok acepta rename o tags incompletos.
# Corrige solo la decisión de dominio; conserva datos y la salida esperada.
def evolution_ok(change: str, old_ok: bool, tags: set, handled: set) -> bool:
    # Defecto: invierte el criterio de compatibilidad
    return change == "rename_required" or tags != handled

change = "add_optional"
old_reader_passes = True
union_tags = {"email", "phone"}
handled_tags = {"email", "phone"}
meets_contract = evolution_ok(change, old_reader_passes, union_tags, handled_tags)
status = "PASS" if meets_contract else "VERSION_SCHEMA"
print("S42-T1-B", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s42-t1-b-e1.py",
          code: `def evolution_ok(change: str, old_ok: bool, tags: set, handled: set) -> bool:
    return change == "add_optional" and old_ok and tags == handled

change = "add_optional"
old_reader_passes = True
union_tags = {"email", "phone"}
handled_tags = {"email", "phone"}
meets_contract = evolution_ok(change, old_reader_passes, union_tags, handled_tags)
status = "PASS" if meets_contract else "VERSION_SCHEMA"
print("S42-T1-B", status)
assert meets_contract is True` ,
          output: `S42-T1-B PASS` ,
        },
      },
      {
        id: "S42-T1-B-E2",
        subtopicId: "S42-T1-B",
        kind: "independent",
        title: "Assess evolución: PASS vs. VERSION vs. MISSING",
        preamble:
          "- **Contexto:** el dueño de contrato en Cusco clasifica cada cambio: seguro, rupture o evidencia incompleta.\n- **Meta:** `assess` → PASS / VERSION_SCHEMA / MISSING:handled_tags.\n- **Éxito:** `PASS VERSION_SCHEMA MISSING:handled_tags`.\n- **Límites:** no inventes handled_tags; no trates rename como PASS.",
        instruction:
          "S42-T1-B-E2 · Salida: debe devolver el PASS del contrato. 1. Primero calcula missing de campos required del registro.\n2. Si falta handled_tags → MISSING.\n3. Si add_optional + old_reader + tags exhaustivos → PASS; si no → VERSION_SCHEMA.\n4. Imprime la tripleta.",
        hint: "Si falta handled_tags → MISSING; si add_optional y old_ok y tags==handled → PASS; si no → VERSION_SCHEMA.",
        hints: [
          "Si falta handled_tags → MISSING; si add_optional y old_ok y tags==handled → PASS; si no → VERSION_SCHEMA.",
          "El adverso (rename_required + push sin handler) debe fallar por contenido de evolución, no por schema vacío.",
        ],
        edgeCases: ["Falta handled_tags", "rename_required", "tag push sin handler", "CASO-CUS-042-1B es sintético"],
        tests: "Produce exactamente `PASS VERSION_SCHEMA MISSING:handled_tags`.",
        feedback:
          "VERSION_SCHEMA es rupture de contrato demostrada; MISSING:handled_tags es incertidumbre de migración — missing ≠ breach y no se inventan handlers.",
        retrospective:
          "VERSION_SCHEMA es rupture demostrada; MISSING:handled_tags es migración sin mapa — no inventes handlers para forzar PASS. El error clásico es «promuevo y luego migro consumidores». Pregunta: ¿por qué un rename con old_reader_passes=False no es MISSING? Luego (E3): CONTINUE / VERSION / MIGRATE_CONSUMERS.",
        starterCode: {
          language: 'python',
          title: "s42-t1-b-e2.py",
          code: `# CASO-CUS-042 · assess VERSION_SCHEMA
# Defecto didáctico: PASS con rename o tags incompletos.
# Corrige solo la decisión de dominio; conserva datos y la salida esperada.
def assess(record: dict) -> str:
    required = {"case_id", "change", "old_reader_passes", "union_tags", "handled_tags"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    # Defecto: invierte compatibilidad
    return "PASS" if record["change"] == "rename_required" or record["union_tags"] != record["handled_tags"] else "VERSION_SCHEMA"

valid = {"case_id": "CASO-CUS-042-1B", "change": "add_optional", "old_reader_passes": True, "union_tags": {"email", "phone"}, "handled_tags": {"email", "phone"}}
invalid = {"case_id": "CASO-CUS-042-1B", "change": "rename_required", "old_reader_passes": False, "union_tags": {"email", "phone", "push"}, "handled_tags": {"email", "phone"}}
incomplete = {**valid}
incomplete.pop("handled_tags")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s42-t1-b-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "change", "old_reader_passes", "union_tags", "handled_tags"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    ok = (
        record["change"] == "add_optional"
        and record["old_reader_passes"]
        and record["union_tags"] == record["handled_tags"]
    )
    return "PASS" if ok else "VERSION_SCHEMA"

valid = {"case_id": "CASO-CUS-042-1B", "change": "add_optional", "old_reader_passes": True, "union_tags": {"email", "phone"}, "handled_tags": {"email", "phone"}}
invalid = {"case_id": "CASO-CUS-042-1B", "change": "rename_required", "old_reader_passes": False, "union_tags": {"email", "phone", "push"}, "handled_tags": {"email", "phone"}}
incomplete = {**valid}
incomplete.pop("handled_tags")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS VERSION_SCHEMA MISSING:handled_tags` ,
        },
      },
      {
        id: "S42-T1-B-E3",
        subtopicId: "S42-T1-B",
        kind: "transfer",
        title: "Deploy de schema: CONTINUE o MIGRATE",
        preamble:
          "- **Contexto:** el canal de notificaciones de Cusco decide si puede **desplegar** un cambio de evento.\n- **Meta:** `decide` → CONTINUE (aditivo OK), VERSION_SCHEMA (rename/tag huérfano), MIGRATE_CONSUMERS (sin handled_tags).\n- **Éxito:** `CONTINUE VERSION_SCHEMA MIGRATE_CONSUMERS`.\n- **Límites:** no inventes handlers; missing no es CONTINUE.",
        instruction:
          "S42-T1-B-E3 · Salida: debe devolver el PASS del contrato. 1. Sin handled_tags → MIGRATE_CONSUMERS.\n2. Con datos: predicado de evolución segura → CONTINUE; si no → VERSION_SCHEMA.\n3. Imprime los tres códigos.",
        hint: "Sin handled_tags → MIGRATE_CONSUMERS; con datos: add_optional+old_ok+tags exhaustivos → CONTINUE; si no → VERSION_SCHEMA.",
        hints: [
          "Sin handled_tags → MIGRATE_CONSUMERS; con datos: add_optional+old_ok+tags exhaustivos → CONTINUE; si no → VERSION_SCHEMA.",
          "Missing no es breach: no lo enrutes a CONTINUE ni a VERSION_SCHEMA.",
        ],
        edgeCases: ["Falta handled_tags", "rename_required", "tag push sin handler", "CASO-CUS-042-1B es sintético"],
        tests: "Produce `CONTINUE VERSION_SCHEMA MIGRATE_CONSUMERS` en ese orden.",
        feedback:
          "MIGRATE_CONSUMERS es la rama humana cuando no hay mapa de handlers; VERSION_SCHEMA es la rupture demostrada. No se despliega «igual y vemos».",
        retrospective:
          "Migrar consumidores es la rama humana cuando no hay mapa de tags. El error clásico es «deploy igual y vemos». Pregunta: ¿cuándo VERSION y cuándo MIGRATE?",
        starterCode: {
          language: 'python',
          title: "s42-t1-b-e3.py",
          code: `# CASO-CUS-042 · decide VERSION_SCHEMA
# Defecto didáctico: missing→CONTINUE; rename→CONTINUE.
# Corrige solo la decisión de dominio; conserva datos y la salida esperada.
def decide(record: dict) -> str:
    required = {"case_id", "change", "old_reader_passes", "union_tags", "handled_tags"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if record["change"] == "rename_required" or record["union_tags"] != record["handled_tags"] else "VERSION_SCHEMA"

valid = {"case_id": "CASO-CUS-042-1B", "change": "add_optional", "old_reader_passes": True, "union_tags": {"email", "phone"}, "handled_tags": {"email", "phone"}}
invalid = {"case_id": "CASO-CUS-042-1B", "change": "rename_required", "old_reader_passes": False, "union_tags": {"email", "phone", "push"}, "handled_tags": {"email", "phone"}}
uncertain = {**valid}
uncertain.pop("handled_tags")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s42-t1-b-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "change", "old_reader_passes", "union_tags", "handled_tags"}
    missing = sorted(required - record.keys())
    if missing:
        return "MIGRATE_CONSUMERS"
    ok = (
        record["change"] == "add_optional"
        and record["old_reader_passes"]
        and record["union_tags"] == record["handled_tags"]
    )
    return "CONTINUE" if ok else "VERSION_SCHEMA"

valid = {"case_id": "CASO-CUS-042-1B", "change": "add_optional", "old_reader_passes": True, "union_tags": {"email", "phone"}, "handled_tags": {"email", "phone"}}
invalid = {"case_id": "CASO-CUS-042-1B", "change": "rename_required", "old_reader_passes": False, "union_tags": {"email", "phone", "push"}, "handled_tags": {"email", "phone"}}
uncertain = {**valid}
uncertain.pop("handled_tags")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "VERSION_SCHEMA", "MIGRATE_CONSUMERS"]` ,
          output: `CONTINUE VERSION_SCHEMA MIGRATE_CONSUMERS` ,
        },
      },
      {
        id: "S42-T2-A-E1",
        subtopicId: "S42-T2-A",
        kind: "guided",
        title: "Resource binding en lectura de caso",
        preamble:
          "- **Contexto:** en `CASO-CUS-042-2A`, el analista de Cusco solo lee **su** ticket con scope `case:read`.\n- **Meta:** `can_read` = actor == owner y `case:read` ∈ scopes (camino analista, sin admin).\n- **Éxito:** `S42-T2-A PASS` con user-a sobre su caso.\n- **Límites:** no abras cross-tenant; no uses rol admin aquí.",
        instruction:
          "S42-T2-A-E1 · Salida: debe devolver el PASS del contrato. 1. El starter permite actor ≠ owner (bug).\n2. Devuelve True solo con binding y scope.\n3. Conserva print PASS/DENY_CROSS_TENANT.",
        hint: "return actor == owner and 'case:read' in scopes (no uses admin aquí).",
        hints: [
          "return actor == owner and 'case:read' in scopes (no uses admin aquí).",
          "El fixture válido es user-a sobre su propio caso; user-a sobre user-b debe ser DENY en E2.",
        ],
        edgeCases: ["Cross-tenant user-a→user-b", "Falta scope case:read", "CASO-CUS-042-2A es sintético"],
        tests: "can_read(user-a, user-a, {case:read}) es True e imprime `S42-T2-A PASS`.",
        feedback:
          "Authn del actor no basta: el resource binding actor==owner + scope cierra el cross-tenant y es el núcleo del gate CP-N4-A.",
        retrospective:
          "Binding `actor == owner` + `case:read` es el núcleo del camino analista; «está logueado» no basta. El starter abre el caso ajeno a propósito. Pregunta: con actor=user-a y owner=user-b y scope case:read, ¿qué imprime el status? Siguiente: PASS / DENY / MISSING:roles.",
        starterCode: {
          language: 'python',
          title: "s42-t2-a-e1.py",
          code: `# CASO-CUS-042 · can_read con resource binding
# Defecto didáctico: allow si actor ≠ owner (cross-tenant abierto).
# Corrige solo la decisión de dominio; conserva datos y la salida esperada.
def can_read(actor: str, owner: str, scopes: set) -> bool:
    # Defecto: privilegio cruzado
    return actor != owner

actor = "user-a"
owner = "user-a"
scopes = {"case:read"}
meets_contract = can_read(actor, owner, scopes)
status = "PASS" if meets_contract else "DENY_CROSS_TENANT"
print("S42-T2-A", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s42-t2-a-e1.py",
          code: `def can_read(actor: str, owner: str, scopes: set) -> bool:
    return actor == owner and "case:read" in scopes

actor = "user-a"
owner = "user-a"
scopes = {"case:read"}
meets_contract = can_read(actor, owner, scopes)
status = "PASS" if meets_contract else "DENY_CROSS_TENANT"
print("S42-T2-A", status)
assert meets_contract is True` ,
          output: `S42-T2-A PASS` ,
        },
      },
      {
        id: "S42-T2-A-E2",
        subtopicId: "S42-T2-A",
        kind: "independent",
        title: "Assess lectura: PASS, DENY o MISSING",
        preamble:
          "- **Contexto:** la matriz de permisos de Cusco debe mostrar allow, deny y evidencia ausente.\n- **Meta:** `assess` → PASS / DENY_CROSS_TENANT / MISSING:roles.\n- **Éxito:** `PASS DENY_CROSS_TENANT MISSING:roles`.\n- **Límites:** no inventes scopes vacíos como allow; missing ≠ breach de cross-tenant.",
        instruction:
          "S42-T2-A-E2 · Salida: debe devolver el PASS del contrato. 1. Si falta `roles` → MISSING:roles.\n2. Si autenticado + actor==owner + case:read → PASS; si no → DENY_CROSS_TENANT.\n3. Imprime la tripleta.",
        hint: "Si falta `roles`, MISSING:roles; si actor!=owner o falta case:read → DENY; si no → PASS.",
        hints: [
          "Si falta `roles`, MISSING:roles; si actor!=owner o falta case:read → DENY; si no → PASS.",
          "Missing ≠ breach: no inventes scopes vacíos como allow.",
        ],
        edgeCases: ["Falta roles", "Cross-tenant user-a→user-b", "CASO-CUS-042-2A es sintético"],
        tests: "Produce exactamente `PASS DENY_CROSS_TENANT MISSING:roles`.",
        feedback:
          "El DENY es por resource binding fallido demostrado; el MISSING es incertidumbre de permiso en la matriz, no lectura cruzada probada.",
        retrospective:
          "DENY es binding fallido demostrado; MISSING:roles es matriz incompleta — no inventes scopes vacíos como allow. El error clásico es «arreglar» el promote inventando roles. Pregunta: si falta `roles`, ¿es lo mismo que DENY_CROSS_TENANT? Luego: CONTINUE / DENY / VERIFY_RESOURCE_OWNER.",
        starterCode: {
          language: 'python',
          title: "s42-t2-a-e2.py",
          code: `# CASO-CUS-042 · assess DENY_CROSS_TENANT
# Defecto didáctico: PASS si actor ≠ owner; ignora case:read.
# Corrige solo la decisión de dominio; conserva datos y la salida esperada.
def assess(record: dict) -> str:
    required = {"case_id", "authenticated", "actor", "resource_owner", "roles"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    # Defecto: cross-tenant abierto y sin chequear scope
    return "PASS" if record["authenticated"] and record["actor"] != record["resource_owner"] else "DENY_CROSS_TENANT"

valid = {"case_id": "CASO-CUS-042-2A", "authenticated": True, "actor": "user-a", "resource_owner": "user-a", "roles": {"case:read"}}
invalid = {"case_id": "CASO-CUS-042-2A", "authenticated": True, "actor": "user-a", "resource_owner": "user-b", "roles": {"case:read"}}
incomplete = {**valid}
incomplete.pop("roles")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s42-t2-a-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "authenticated", "actor", "resource_owner", "roles"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    ok = (
        record["authenticated"]
        and record["actor"] == record["resource_owner"]
        and "case:read" in record["roles"]
    )
    return "PASS" if ok else "DENY_CROSS_TENANT"

valid = {"case_id": "CASO-CUS-042-2A", "authenticated": True, "actor": "user-a", "resource_owner": "user-a", "roles": {"case:read"}}
invalid = {"case_id": "CASO-CUS-042-2A", "authenticated": True, "actor": "user-a", "resource_owner": "user-b", "roles": {"case:read"}}
incomplete = {**valid}
incomplete.pop("roles")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS DENY_CROSS_TENANT MISSING:roles` ,
        },
      },
      {
        id: "S42-T2-A-E3",
        subtopicId: "S42-T2-A",
        kind: "transfer",
        title: "Enruta lectura: CONTINUE o VERIFY",
        preamble:
          "- **Contexto:** la mesa de soporte enruta tres lecturas de ticket: propia, ajena e incompleta.\n- **Meta:** CONTINUE (mismo tenant + scope), DENY_CROSS_TENANT (caso ajeno), VERIFY_RESOURCE_OWNER (sin roles).\n- **Éxito:** `CONTINUE DENY_CROSS_TENANT VERIFY_RESOURCE_OWNER`.\n- **Límites:** no conviertas missing en CONTINUE; no abras cross-tenant.",
        instruction:
          "S42-T2-A-E3 · Salida: debe devolver el PASS del contrato. 1. Sin roles → VERIFY_RESOURCE_OWNER.\n2. Con datos: binding + case:read → CONTINUE; si no → DENY.\n3. Imprime los tres códigos.",
        hint: "Sin roles → VERIFY_RESOURCE_OWNER; con datos: owner+case:read → CONTINUE; si no → DENY_CROSS_TENANT.",
        hints: [
          "Sin roles → VERIFY_RESOURCE_OWNER; con datos: owner+case:read → CONTINUE; si no → DENY_CROSS_TENANT.",
          "Missing no es breach: no lo conviertas en CONTINUE silencioso.",
        ],
        edgeCases: ["Falta roles", "Cross-tenant user-a→user-b", "CASO-CUS-042-2A es sintético"],
        tests: "Produce `CONTINUE DENY_CROSS_TENANT VERIFY_RESOURCE_OWNER` en ese orden.",
        feedback:
          "VERIFY_RESOURCE_OWNER es la rama humana cuando no hay matriz de permisos; DENY es la prueba de cross-tenant. Falta el claim no se convierte en allow.",
        retrospective:
          "VERIFY es revisión humana del dueño del recurso cuando no hay matriz. El error clásico es «falta el claim, igual deja leer». Pregunta: ¿por qué DENY no es VERIFY?",
        starterCode: {
          language: 'python',
          title: "s42-t2-a-e3.py",
          code: `# CASO-CUS-042 · decide DENY_CROSS_TENANT
# Defecto didáctico: missing→CONTINUE; cross-tenant→CONTINUE.
# Corrige solo la decisión de dominio; conserva datos y la salida esperada.
def decide(record: dict) -> str:
    required = {"case_id", "authenticated", "actor", "resource_owner", "roles"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if record["authenticated"] and record["actor"] != record["resource_owner"] else "DENY_CROSS_TENANT"

valid = {"case_id": "CASO-CUS-042-2A", "authenticated": True, "actor": "user-a", "resource_owner": "user-a", "roles": {"case:read"}}
invalid = {"case_id": "CASO-CUS-042-2A", "authenticated": True, "actor": "user-a", "resource_owner": "user-b", "roles": {"case:read"}}
uncertain = {**valid}
uncertain.pop("roles")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s42-t2-a-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "authenticated", "actor", "resource_owner", "roles"}
    missing = sorted(required - record.keys())
    if missing:
        return "VERIFY_RESOURCE_OWNER"
    ok = (
        record["authenticated"]
        and record["actor"] == record["resource_owner"]
        and "case:read" in record["roles"]
    )
    return "CONTINUE" if ok else "DENY_CROSS_TENANT"

valid = {"case_id": "CASO-CUS-042-2A", "authenticated": True, "actor": "user-a", "resource_owner": "user-a", "roles": {"case:read"}}
invalid = {"case_id": "CASO-CUS-042-2A", "authenticated": True, "actor": "user-a", "resource_owner": "user-b", "roles": {"case:read"}}
uncertain = {**valid}
uncertain.pop("roles")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "DENY_CROSS_TENANT", "VERIFY_RESOURCE_OWNER"]` ,
          output: `CONTINUE DENY_CROSS_TENANT VERIFY_RESOURCE_OWNER` ,
        },
      },
      {
        id: "S42-T2-B-E1",
        subtopicId: "S42-T2-B",
        kind: "guided",
        title: "Tres puertas: scope, svc y ruta",
        preamble:
          "- **Contexto:** el worker de reportes de Cusco solo entra con scope granted, identidad `svc-…` y ruta en catálogo.\n- **Meta:** `allow` = needed ∈ granted ∧ service_id empieza por `svc-` ∧ route_declared.\n- **Éxito:** `S42-T2-B PASS` con report:prepare / svc-reporter / ruta True.\n- **Límites:** no apruebes shared-admin; no ignores la ruta.",
        instruction:
          "S42-T2-B-E1 · Salida: debe devolver el PASS del contrato. 1. El starter invierte el predicado y no exige `svc-`.\n2. Implementa las tres condiciones en conjunción.\n3. Conserva print PASS/DENY_SCOPE.",
        hint: "return needed in granted and service_id.startswith('svc-') and route_declared",
        hints: [
          "return needed in granted and service_id.startswith('svc-') and route_declared",
          "Un principal `shared-admin` no es identidad de servicio: en E2 debe caer en DENY_SCOPE junto con prod:write.",
        ],
        edgeCases: ["Scope prod:write no granted", "service_id shared-admin", "Falta route_declared", "CASO-CUS-042-2B es sintético"],
        tests: "allow({report:prepare}, report:prepare, svc-reporter, True) es True e imprime `S42-T2-B PASS`.",
        feedback:
          "Deny-by-default exige las tres condiciones a la vez: grant de report no autoriza prod:write ni un principal genérico sin identidad de servicio.",
        retrospective:
          "Falla una puerta y es DENY_SCOPE: grant de report no autoriza prod:write ni un `shared-admin`. El error clásico es «tiene un scope, basta». Pregunta: ¿por qué `service_id.startswith(\"svc-\")` no se puede sustituir por un rol «de confianza» en el header? Siguiente: matriz PASS / DENY / MISSING:route.",
        starterCode: {
          language: 'python',
          title: "s42-t2-b-e1.py",
          code: `# CASO-CUS-042 · scopes + identidad de servicio + ruta
# Defecto didáctico: allow cuando el scope NO está granted o la ruta no está.
# Corrige solo la decisión de dominio; conserva datos y la salida esperada.
def allow(granted: set, needed: str, service_id: str, route_declared: bool) -> bool:
    # Defecto: predicado invertido e incompleto (no exige svc-)
    return needed not in granted or not route_declared

granted = {"report:prepare"}
needed = "report:prepare"
service_id = "svc-reporter"
route_declared = True
meets_contract = allow(granted, needed, service_id, route_declared)
status = "PASS" if meets_contract else "DENY_SCOPE"
print("S42-T2-B", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s42-t2-b-e1.py",
          code: `def allow(granted: set, needed: str, service_id: str, route_declared: bool) -> bool:
    return needed in granted and service_id.startswith("svc-") and route_declared

granted = {"report:prepare"}
needed = "report:prepare"
service_id = "svc-reporter"
route_declared = True
meets_contract = allow(granted, needed, service_id, route_declared)
status = "PASS" if meets_contract else "DENY_SCOPE"
print("S42-T2-B", status)
assert meets_contract is True` ,
          output: `S42-T2-B PASS` ,
        },
      },
      {
        id: "S42-T2-B-E2",
        subtopicId: "S42-T2-B",
        kind: "independent",
        title: "Matriz de scopes con DENY y MISSING",
        preamble:
          "- **Contexto:** la matriz de least privilege en Cusco debe mostrar al menos una denegación explícita y una fila incompleta.\n- **Meta:** `assess` → PASS / DENY_SCOPE / MISSING:route_declared.\n- **Éxito:** `PASS DENY_SCOPE MISSING:route_declared`.\n- **Límites:** no inventes route_declared=True; shared-admin no es atajo.",
        instruction:
          "S42-T2-B-E2 · Salida: debe devolver el PASS del contrato. 1. Primero missing de campos required.\n2. Luego allow de tres puertas → PASS o DENY_SCOPE.\n3. Imprime la tripleta.",
        hint: "Si falta route_declared → MISSING; si no, allow solo con scope granted + svc-* + ruta True.",
        hints: [
          "Si falta route_declared → MISSING; si no, allow solo con scope granted + svc-* + ruta True.",
          "Missing ≠ breach: no inventes route_declared=True para «arreglar» la fila incompleta.",
        ],
        edgeCases: ["Falta route_declared", "prod:write + shared-admin", "CASO-CUS-042-2B es sintético"],
        tests: "Produce exactamente `PASS DENY_SCOPE MISSING:route_declared`.",
        feedback:
          "DENY_SCOPE es privilege real (scope, identidad o ruta fallan); MISSING es catálogo incompleto — no se confunde con allow ni se inventa la ruta.",
        retrospective:
          "DENY es privilege real (scope, identidad o ruta); MISSING es catálogo incompleto. Inventar `route_declared=True` no es least privilege. Pregunta: en el invalid, ¿basta una de las tres fallas para DENY_SCOPE? Luego: CONTINUE / DENY / REQUEST_NARROW_GRANT.",
        starterCode: {
          language: 'python',
          title: "s42-t2-b-e2.py",
          code: `# CASO-CUS-042 · assess DENY_SCOPE sobre filas de matriz
# Defecto didáctico: allow invertido (PASS sin scope o sin route).
# Corrige solo la decisión de dominio; conserva datos y la salida esperada.
def allow(granted: set, needed: str, service_id: str, route_declared: bool) -> bool:
    return needed not in granted or not route_declared

def assess(record: dict) -> str:
    required = {"case_id", "requested_scope", "granted_scopes", "service_id", "route_declared"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    ok = allow(
        record["granted_scopes"],
        record["requested_scope"],
        record["service_id"],
        record["route_declared"],
    )
    return "PASS" if ok else "DENY_SCOPE"

valid = {"case_id": "CASO-CUS-042-2B", "requested_scope": "report:prepare", "granted_scopes": {"report:prepare"}, "service_id": "svc-reporter", "route_declared": True}
invalid = {"case_id": "CASO-CUS-042-2B", "requested_scope": "prod:write", "granted_scopes": {"report:prepare"}, "service_id": "shared-admin", "route_declared": False}
incomplete = {**valid}
incomplete.pop("route_declared")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s42-t2-b-e2.py",
          code: `def allow(granted: set, needed: str, service_id: str, route_declared: bool) -> bool:
    return needed in granted and service_id.startswith("svc-") and route_declared

def assess(record: dict) -> str:
    required = {"case_id", "requested_scope", "granted_scopes", "service_id", "route_declared"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    ok = allow(
        record["granted_scopes"],
        record["requested_scope"],
        record["service_id"],
        record["route_declared"],
    )
    return "PASS" if ok else "DENY_SCOPE"

valid = {"case_id": "CASO-CUS-042-2B", "requested_scope": "report:prepare", "granted_scopes": {"report:prepare"}, "service_id": "svc-reporter", "route_declared": True}
invalid = {"case_id": "CASO-CUS-042-2B", "requested_scope": "prod:write", "granted_scopes": {"report:prepare"}, "service_id": "shared-admin", "route_declared": False}
incomplete = {**valid}
incomplete.pop("route_declared")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS DENY_SCOPE MISSING:route_declared` ,
        },
      },
      {
        id: "S42-T2-B-E3",
        subtopicId: "S42-T2-B",
        kind: "transfer",
        title: "Worker a producción: CONTINUE o REQUEST",
        preamble:
          "- **Contexto:** `svc-reporter` pide entrar a producción con grant estrecho; un principal genérico y un catálogo incompleto no se «arreglan» con allow.\n- **Meta:** CONTINUE / DENY_SCOPE / REQUEST_NARROW_GRANT.\n- **Éxito:** `CONTINUE DENY_SCOPE REQUEST_NARROW_GRANT`.\n- **Límites:** no inventes catálogo; no uses shared-admin como override.",
        instruction:
          "S42-T2-B-E3 · Salida: debe devolver el PASS del contrato. 1. Sin route_declared → REQUEST_NARROW_GRANT.\n2. Con datos: tres puertas → CONTINUE o DENY_SCOPE.\n3. Imprime los tres códigos.",
        hint: "Sin route_declared → REQUEST_NARROW_GRANT; con datos: scope+svc+ruta → CONTINUE; si no → DENY_SCOPE.",
        hints: [
          "Sin route_declared → REQUEST_NARROW_GRANT; con datos: scope+svc+ruta → CONTINUE; si no → DENY_SCOPE.",
          "REQUEST_NARROW_GRANT es la rama humana de catálogo incompleto; no es un DENY de privilege.",
        ],
        edgeCases: ["Falta route_declared", "prod:write no granted", "CASO-CUS-042-2B es sintético"],
        tests: "Produce `CONTINUE DENY_SCOPE REQUEST_NARROW_GRANT` en ese orden.",
        feedback:
          "Least privilege en Cusco: CONTINUE solo con identidad svc + scope + ruta; shared-admin no es atajo; catálogo incompleto es REQUEST, no inventar allow.",
        retrospective:
          "REQUEST es la rama humana de grant estrecho pendiente. El error clásico es «falta la ruta, igual desplegamos». Pregunta: ¿por qué REQUEST no es DENY?",
        starterCode: {
          language: 'python',
          title: "s42-t2-b-e3.py",
          code: `# CASO-CUS-042 · decide DENY_SCOPE / REQUEST_NARROW_GRANT
# Defecto didáctico: missing→CONTINUE; allow invertido.
# Corrige solo la decisión de dominio; conserva datos y la salida esperada.
def allow(granted: set, needed: str, service_id: str, route_declared: bool) -> bool:
    return needed not in granted or not route_declared

def decide(record: dict) -> str:
    required = {"case_id", "requested_scope", "granted_scopes", "service_id", "route_declared"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    ok = allow(
        record["granted_scopes"],
        record["requested_scope"],
        record["service_id"],
        record["route_declared"],
    )
    return "CONTINUE" if ok else "DENY_SCOPE"

valid = {"case_id": "CASO-CUS-042-2B", "requested_scope": "report:prepare", "granted_scopes": {"report:prepare"}, "service_id": "svc-reporter", "route_declared": True}
invalid = {"case_id": "CASO-CUS-042-2B", "requested_scope": "prod:write", "granted_scopes": {"report:prepare"}, "service_id": "shared-admin", "route_declared": False}
uncertain = {**valid}
uncertain.pop("route_declared")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s42-t2-b-e3.py",
          code: `def allow(granted: set, needed: str, service_id: str, route_declared: bool) -> bool:
    return needed in granted and service_id.startswith("svc-") and route_declared

def decide(record: dict) -> str:
    required = {"case_id", "requested_scope", "granted_scopes", "service_id", "route_declared"}
    missing = sorted(required - record.keys())
    if missing:
        return "REQUEST_NARROW_GRANT"
    ok = allow(
        record["granted_scopes"],
        record["requested_scope"],
        record["service_id"],
        record["route_declared"],
    )
    return "CONTINUE" if ok else "DENY_SCOPE"

valid = {"case_id": "CASO-CUS-042-2B", "requested_scope": "report:prepare", "granted_scopes": {"report:prepare"}, "service_id": "svc-reporter", "route_declared": True}
invalid = {"case_id": "CASO-CUS-042-2B", "requested_scope": "prod:write", "granted_scopes": {"report:prepare"}, "service_id": "shared-admin", "route_declared": False}
uncertain = {**valid}
uncertain.pop("route_declared")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "DENY_SCOPE", "REQUEST_NARROW_GRANT"]` ,
          output: `CONTINUE DENY_SCOPE REQUEST_NARROW_GRANT` ,
        },
      },
      {
        id: "S42-T3-A-E1",
        subtopicId: "S42-T3-A",
        kind: "guided",
        title: "Upload confiado: size, host y path",
        preamble:
          "- **Contexto:** el adjunto de `CASO-CUS-042-3A` solo se guarda si cabe en bytes, el host está en allowlist y el path queda bajo root.\n- **Meta:** `trusted` = size≤max ∧ host∈allowlist ∧ path.startswith(root+'/').\n- **Éxito:** `S42-T3-A PASS` con el fixture confinado.\n- **Límites:** no ignores la allowlist; no apruebes `/etc` «por excepción».",
        instruction:
          "S42-T3-A-E1 · Salida: debe devolver el PASS del contrato. 1. El starter invierte e ignora hosts (bug).\n2. Implementa las tres condiciones en conjunción.\n3. Conserva print PASS/REJECT_UNTRUSTED_INPUT.",
        hint: "return size <= max_bytes and host in allowed_hosts and path.startswith(root + '/')",
        hints: [
          "return size <= max_bytes and host in allowed_hosts and path.startswith(root + '/')",
          "El defecto no mira la allowlist de hosts: un SSRF a 169.254… pasaría si solo miras `/etc`.",
        ],
        edgeCases: ["Falta root", "host metadata cloud", "path /etc/passwd", "CASO-CUS-042-3A es sintético"],
        tests: "trusted(2048, 4096, docs.local, {docs.local}, /safe/reports/a.txt, /safe/reports) es True e imprime `S42-T3-A PASS`.",
        feedback:
          "Las tres puertas (size, host, path) son conjuntas: falla una y es REJECT_UNTRUSTED_INPUT. Un SSRF a metadata no se salva mirando solo el path.",
        retrospective:
          "Size + host + path son **conjuntos**: un SSRF a metadata no se salva mirando solo `/etc`. El starter ignora allowlist a propósito. Pregunta: con path limpio bajo root pero host `169.254.169.254`, ¿PASS o REJECT? Siguiente: PASS / REJECT / MISSING:root.",
        starterCode: {
          language: 'python',
          title: "s42-t3-a-e1.py",
          code: `# CASO-CUS-042 · size + host allowlist + path confinement
# Defecto didáctico: aprueba oversize o path /etc; ignora allowed_hosts.
# Corrige solo la decisión de dominio; conserva datos y la salida esperada.
def trusted(
    size: int, max_bytes: int, host: str, allowed_hosts: set, path: str, root: str
) -> bool:
    # Defecto: invertido e incompleto (no consulta allowed_hosts)
    return size > max_bytes or path.startswith("/etc")

meets_contract = trusted(
    2048, 4096, "docs.local", {"docs.local"}, "/safe/reports/a.txt", "/safe/reports"
)
status = "PASS" if meets_contract else "REJECT_UNTRUSTED_INPUT"
print("S42-T3-A", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s42-t3-a-e1.py",
          code: `def trusted(
    size: int, max_bytes: int, host: str, allowed_hosts: set, path: str, root: str
) -> bool:
    return (
        size <= max_bytes
        and host in allowed_hosts
        and path.startswith(root + "/")
    )

meets_contract = trusted(
    2048, 4096, "docs.local", {"docs.local"}, "/safe/reports/a.txt", "/safe/reports"
)
status = "PASS" if meets_contract else "REJECT_UNTRUSTED_INPUT"
print("S42-T3-A", status)
assert meets_contract is True` ,
          output: `S42-T3-A PASS` ,
        },
      },
      {
        id: "S42-T3-A-E2",
        subtopicId: "S42-T3-A",
        kind: "independent",
        title: "Assess input: PASS, REJECT o MISSING",
        preamble:
          "- **Contexto:** el worker de adjuntos clasifica confinado, adverso real (oversize + metadata IP + `/etc/passwd`) y registro sin root.\n- **Meta:** PASS / REJECT_UNTRUSTED_INPUT / MISSING:root.\n- **Éxito:** `PASS REJECT_UNTRUSTED_INPUT MISSING:root`.\n- **Límites:** no inventes root; el adverso debe fallar por contenido (host/path/bytes).",
        instruction:
          "S42-T3-A-E2 · Salida: debe devolver el PASS del contrato. 1. Primero missing de `root`.\n2. Luego trusted de tres puertas.\n3. Imprime la tripleta.",
        hint: "Primero missing de `root`; luego size + host ∈ allowlist + path bajo root/.",
        hints: [
          "Primero missing de `root`; luego size + host ∈ allowlist + path bajo root/.",
          "El adverso debe fallar por contenido (bytes, host y path), no solo porque el path empiece por /etc.",
        ],
        edgeCases: ["Falta root", "SSRF metadata IP", "path traversal a /etc", "CASO-CUS-042-3A es sintético"],
        tests: "Produce exactamente `PASS REJECT_UNTRUSTED_INPUT MISSING:root`.",
        feedback:
          "El host 169.254.169.254 es el clásico SSRF a metadata cloud; la allowlist lo corta aunque el path «parezca» de archivo.",
        retrospective:
          "`169.254.169.254` es SSRF a metadata cloud aunque el path parezca de archivo. MISSING:root es incertidumbre de confinamiento, no breach inventado. Luego: CONTINUE / REJECT / SECURITY_REVIEW.",
        starterCode: {
          language: 'python',
          title: "s42-t3-a-e2.py",
          code: `# CASO-CUS-042 · assess REJECT_UNTRUSTED_INPUT (size/host/path)
# Defecto didáctico: trusted invertido e incompleto (ignora host allowlist).
# Corrige solo la decisión de dominio; conserva datos y la salida esperada.
def trusted(
    size: int, max_bytes: int, host: str, allowed_hosts: set, path: str, root: str
) -> bool:
    return size > max_bytes or path.startswith("/etc")

def assess(record: dict) -> str:
    required = {"case_id", "bytes", "max_bytes", "host", "allowed_hosts", "resolved_path", "root"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    ok = trusted(
        record["bytes"],
        record["max_bytes"],
        record["host"],
        record["allowed_hosts"],
        record["resolved_path"],
        record["root"],
    )
    return "PASS" if ok else "REJECT_UNTRUSTED_INPUT"

valid = {"case_id": "CASO-CUS-042-3A", "bytes": 2048, "max_bytes": 4096, "host": "docs.local", "allowed_hosts": {"docs.local"}, "resolved_path": "/safe/reports/a.txt", "root": "/safe/reports"}
invalid = {"case_id": "CASO-CUS-042-3A", "bytes": 9999, "max_bytes": 4096, "host": "169.254.169.254", "allowed_hosts": {"docs.local"}, "resolved_path": "/etc/passwd", "root": "/safe/reports"}
incomplete = {**valid}
incomplete.pop("root")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s42-t3-a-e2.py",
          code: `def trusted(
    size: int, max_bytes: int, host: str, allowed_hosts: set, path: str, root: str
) -> bool:
    return (
        size <= max_bytes
        and host in allowed_hosts
        and path.startswith(root + "/")
    )

def assess(record: dict) -> str:
    required = {"case_id", "bytes", "max_bytes", "host", "allowed_hosts", "resolved_path", "root"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    ok = trusted(
        record["bytes"],
        record["max_bytes"],
        record["host"],
        record["allowed_hosts"],
        record["resolved_path"],
        record["root"],
    )
    return "PASS" if ok else "REJECT_UNTRUSTED_INPUT"

valid = {"case_id": "CASO-CUS-042-3A", "bytes": 2048, "max_bytes": 4096, "host": "docs.local", "allowed_hosts": {"docs.local"}, "resolved_path": "/safe/reports/a.txt", "root": "/safe/reports"}
invalid = {"case_id": "CASO-CUS-042-3A", "bytes": 9999, "max_bytes": 4096, "host": "169.254.169.254", "allowed_hosts": {"docs.local"}, "resolved_path": "/etc/passwd", "root": "/safe/reports"}
incomplete = {**valid}
incomplete.pop("root")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS REJECT_UNTRUSTED_INPUT MISSING:root` ,
        },
      },
      {
        id: "S42-T3-A-E3",
        subtopicId: "S42-T3-A",
        kind: "transfer",
        title: "Guarda adjunto: CONTINUE o SECURITY_REVIEW",
        preamble:
          "- **Contexto:** el worker decide si **guarda** el archivo o abre revisión de seguridad.\n- **Meta:** CONTINUE (confinado), REJECT_UNTRUSTED_INPUT (adverso), SECURITY_REVIEW (sin root).\n- **Éxito:** `CONTINUE REJECT_UNTRUSTED_INPUT SECURITY_REVIEW`.\n- **Límites:** no inventes root por defecto; no trates missing como CONTINUE.",
        instruction:
          "S42-T3-A-E3 · Salida: debe devolver el PASS del contrato. 1. Sin root → SECURITY_REVIEW.\n2. Con datos: tres puertas → CONTINUE o REJECT.\n3. Imprime los tres códigos.",
        hint: "Falta root → SECURITY_REVIEW; luego las tres puertas size/host/path.",
        hints: [
          "Falta root → SECURITY_REVIEW; luego las tres puertas size/host/path.",
          "Solo el fixture confinado devuelve CONTINUE; el de 169.254… y /etc/passwd es REJECT.",
        ],
        edgeCases: ["Falta root", "SSRF metadata IP", "path /etc/passwd", "CASO-CUS-042-3A es sintético"],
        tests: "Produce `CONTINUE REJECT_UNTRUSTED_INPUT SECURITY_REVIEW` en ese orden.",
        feedback:
          "SECURITY_REVIEW es la rama humana cuando no hay raíz de confinamiento; no se inventa un root por defecto ni se trata missing como CONTINUE.",
        retrospective:
          "SECURITY_REVIEW es humano cuando no hay raíz de confinamiento. El error clásico es asumir `/tmp` o `/data` «por default». Pregunta: ¿por qué no inventar root?",
        starterCode: {
          language: 'python',
          title: "s42-t3-a-e3.py",
          code: `# CASO-CUS-042 · decide REJECT_UNTRUSTED_INPUT / SECURITY_REVIEW
# Defecto didáctico: missing→CONTINUE; trusted invertido e ignora host.
# Corrige solo la decisión de dominio; conserva datos y la salida esperada.
def trusted(
    size: int, max_bytes: int, host: str, allowed_hosts: set, path: str, root: str
) -> bool:
    return size > max_bytes or path.startswith("/etc")

def decide(record: dict) -> str:
    required = {"case_id", "bytes", "max_bytes", "host", "allowed_hosts", "resolved_path", "root"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    ok = trusted(
        record["bytes"],
        record["max_bytes"],
        record["host"],
        record["allowed_hosts"],
        record["resolved_path"],
        record["root"],
    )
    return "CONTINUE" if ok else "REJECT_UNTRUSTED_INPUT"

valid = {"case_id": "CASO-CUS-042-3A", "bytes": 2048, "max_bytes": 4096, "host": "docs.local", "allowed_hosts": {"docs.local"}, "resolved_path": "/safe/reports/a.txt", "root": "/safe/reports"}
invalid = {"case_id": "CASO-CUS-042-3A", "bytes": 9999, "max_bytes": 4096, "host": "169.254.169.254", "allowed_hosts": {"docs.local"}, "resolved_path": "/etc/passwd", "root": "/safe/reports"}
uncertain = {**valid}
uncertain.pop("root")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s42-t3-a-e3.py",
          code: `def trusted(
    size: int, max_bytes: int, host: str, allowed_hosts: set, path: str, root: str
) -> bool:
    return (
        size <= max_bytes
        and host in allowed_hosts
        and path.startswith(root + "/")
    )

def decide(record: dict) -> str:
    required = {"case_id", "bytes", "max_bytes", "host", "allowed_hosts", "resolved_path", "root"}
    missing = sorted(required - record.keys())
    if missing:
        return "SECURITY_REVIEW"
    ok = trusted(
        record["bytes"],
        record["max_bytes"],
        record["host"],
        record["allowed_hosts"],
        record["resolved_path"],
        record["root"],
    )
    return "CONTINUE" if ok else "REJECT_UNTRUSTED_INPUT"

valid = {"case_id": "CASO-CUS-042-3A", "bytes": 2048, "max_bytes": 4096, "host": "docs.local", "allowed_hosts": {"docs.local"}, "resolved_path": "/safe/reports/a.txt", "root": "/safe/reports"}
invalid = {"case_id": "CASO-CUS-042-3A", "bytes": 9999, "max_bytes": 4096, "host": "169.254.169.254", "allowed_hosts": {"docs.local"}, "resolved_path": "/etc/passwd", "root": "/safe/reports"}
uncertain = {**valid}
uncertain.pop("root")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "REJECT_UNTRUSTED_INPUT", "SECURITY_REVIEW"]` ,
          output: `CONTINUE REJECT_UNTRUSTED_INPUT SECURITY_REVIEW` ,
        },
      },
      {
        id: "S42-T3-B-E1",
        subtopicId: "S42-T3-B",
        kind: "guided",
        title: "Promote limpio: secretos y deps",
        preamble:
          "- **Contexto:** el pipeline de Cusco solo promociona sin secreto en repo/log, con rotación ensayada, deps fijadas y 0 CVE críticas.\n- **Meta:** `promote_ok` con las cinco condiciones en conjunción.\n- **Éxito:** `S42-T3-B PASS` con el fixture limpio.\n- **Límites:** no ignores rotación ni CVE; un solo hallazgo bloquea.",
        instruction:
          "S42-T3-B-E1 · Salida: debe devolver el PASS del contrato. 1. El starter devuelve True si secret_in_repo o not pinned (bug).\n2. Exige not secret_in_repo, not secret_in_log, rotation_tested, pinned, critical_cves==0.\n3. Conserva print PASS/ROTATE_AND_BLOCK.",
        hint: "return (not secret_in_repo) and (not secret_in_log) and rotation_tested and pinned and critical_cves == 0",
        hints: [
          "return (not secret_in_repo) and (not secret_in_log) and rotation_tested and pinned and critical_cves == 0",
          "El defecto no mira rotation_tested ni critical_cves: un promote «limpio» de secretos aún puede ser inseguro.",
        ],
        edgeCases: ["secret_in_repo", "deps unpinned", "critical_cves>0", "CASO-CUS-042-3B es sintético"],
        tests: "El fixture limpio (sin secreto en repo ni log, rotación ensayada, deps con pin y 0 CVE críticas) pasa `promote_ok` e imprime `S42-T3-B PASS`.",
        feedback:
          "Promote fail-closed es conjunción de cinco controles: un solo hallazgo (secreto en artefacto o CVE crítica) bloquea el release.",
        retrospective:
          "Un solo hallazgo (secreto en artefacto, sin rotación, unpinned o CVE crítica) bloquea. El error clásico es «no hay secreto en el log, listo». Pregunta: ¿por qué `rotation_tested` debe ser True y no solo documentado en un wiki? Siguiente: PASS / ROTATE / MISSING:critical_cves.",
        starterCode: {
          language: 'python',
          title: "s42-t3-b-e1.py",
          code: `# CASO-CUS-042 · secrets + dependency CVEs
# Defecto didáctico: aprueba si hay secreto o deps sin pin (invertido e incompleto).
# Corrige solo la decisión de dominio; conserva datos y la salida esperada.
def promote_ok(
    secret_in_repo: bool,
    secret_in_log: bool,
    rotation_tested: bool,
    pinned: bool,
    critical_cves: int,
) -> bool:
    # Defecto: no exige rotación ni CVE==0; además invierte secret/pin
    return secret_in_repo or not pinned

meets_contract = promote_ok(False, False, True, True, 0)
status = "PASS" if meets_contract else "ROTATE_AND_BLOCK"
print("S42-T3-B", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s42-t3-b-e1.py",
          code: `def promote_ok(
    secret_in_repo: bool,
    secret_in_log: bool,
    rotation_tested: bool,
    pinned: bool,
    critical_cves: int,
) -> bool:
    return (
        (not secret_in_repo)
        and (not secret_in_log)
        and rotation_tested
        and pinned
        and critical_cves == 0
    )

meets_contract = promote_ok(False, False, True, True, 0)
status = "PASS" if meets_contract else "ROTATE_AND_BLOCK"
print("S42-T3-B", status)
assert meets_contract is True` ,
          output: `S42-T3-B PASS` ,
        },
      },
      {
        id: "S42-T3-B-E2",
        subtopicId: "S42-T3-B",
        kind: "independent",
        title: "Assess promote: PASS, ROTATE o MISSING",
        preamble:
          "- **Contexto:** el release manager clasifica promote limpio, hallazgo demostrable e inventario incompleto.\n- **Meta:** PASS / ROTATE_AND_BLOCK / MISSING:critical_cves.\n- **Éxito:** `PASS ROTATE_AND_BLOCK MISSING:critical_cves`.\n- **Límites:** no inventes critical_cves=0; missing no es «cero riesgos».",
        instruction:
          "S42-T3-B-E2 · Salida: debe devolver el PASS del contrato. 1. Si falta critical_cves → MISSING.\n2. Si promote_ok de cinco flags → PASS; si no → ROTATE_AND_BLOCK.\n3. Imprime la tripleta.",
        hint: "Si falta critical_cves → MISSING; si no, las cinco condiciones de promote limpio → PASS; si no → ROTATE_AND_BLOCK.",
        hints: [
          "Si falta critical_cves → MISSING; si no, las cinco condiciones de promote limpio → PASS; si no → ROTATE_AND_BLOCK.",
          "No inventes critical_cves=0 cuando el campo no viene: missing ≠ «cero riesgos».",
        ],
        edgeCases: ["Falta critical_cves", "secret_in_repo True", "critical_cves=2", "CASO-CUS-042-3B es sintético"],
        tests: "Produce exactamente `PASS ROTATE_AND_BLOCK MISSING:critical_cves`.",
        feedback:
          "ROTATE_AND_BLOCK es hallazgo demostrable; MISSING:critical_cves es inventario incompleto (ASSESS en E3), no un PASS optimista ni «cero riesgos».",
        retrospective:
          "ROTATE_AND_BLOCK es hallazgo demostrable; MISSING:critical_cves es falta de scan — no asumas cero CVE. El error clásico es «no hay número, limpio». Pregunta: ¿qué pediría ASSESS_DEPENDENCY_RISK al equipo de deps en E3? Luego: CONTINUE / ROTATE / ASSESS.",
        starterCode: {
          language: 'python',
          title: "s42-t3-b-e2.py",
          code: `# CASO-CUS-042 · assess ROTATE_AND_BLOCK
# Defecto didáctico: promote_ok incompleto/invertido (secret o unpinned → PASS).
# Corrige solo la decisión de dominio; conserva datos y la salida esperada.
def promote_ok(
    secret_in_repo: bool,
    secret_in_log: bool,
    rotation_tested: bool,
    pinned: bool,
    critical_cves: int,
) -> bool:
    return secret_in_repo or not pinned

def assess(record: dict) -> str:
    required = {"case_id", "secret_in_repo", "secret_in_log", "rotation_tested", "dependency_pinned", "critical_cves"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    ok = promote_ok(
        record["secret_in_repo"],
        record["secret_in_log"],
        record["rotation_tested"],
        record["dependency_pinned"],
        record["critical_cves"],
    )
    return "PASS" if ok else "ROTATE_AND_BLOCK"

valid = {"case_id": "CASO-CUS-042-3B", "secret_in_repo": False, "secret_in_log": False, "rotation_tested": True, "dependency_pinned": True, "critical_cves": 0}
invalid = {"case_id": "CASO-CUS-042-3B", "secret_in_repo": True, "secret_in_log": True, "rotation_tested": False, "dependency_pinned": False, "critical_cves": 2}
incomplete = {**valid}
incomplete.pop("critical_cves")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s42-t3-b-e2.py",
          code: `def promote_ok(
    secret_in_repo: bool,
    secret_in_log: bool,
    rotation_tested: bool,
    pinned: bool,
    critical_cves: int,
) -> bool:
    return (
        (not secret_in_repo)
        and (not secret_in_log)
        and rotation_tested
        and pinned
        and critical_cves == 0
    )

def assess(record: dict) -> str:
    required = {"case_id", "secret_in_repo", "secret_in_log", "rotation_tested", "dependency_pinned", "critical_cves"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    ok = promote_ok(
        record["secret_in_repo"],
        record["secret_in_log"],
        record["rotation_tested"],
        record["dependency_pinned"],
        record["critical_cves"],
    )
    return "PASS" if ok else "ROTATE_AND_BLOCK"

valid = {"case_id": "CASO-CUS-042-3B", "secret_in_repo": False, "secret_in_log": False, "rotation_tested": True, "dependency_pinned": True, "critical_cves": 0}
invalid = {"case_id": "CASO-CUS-042-3B", "secret_in_repo": True, "secret_in_log": True, "rotation_tested": False, "dependency_pinned": False, "critical_cves": 2}
incomplete = {**valid}
incomplete.pop("critical_cves")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS ROTATE_AND_BLOCK MISSING:critical_cves` ,
        },
      },
      {
        id: "S42-T3-B-E3",
        subtopicId: "S42-T3-B",
        kind: "transfer",
        title: "CI a staging: CONTINUE o ASSESS",
        preamble:
          "- **Contexto:** el pipeline de CI de la mesa de Cusco decide promote a staging: limpio, hallazgo o sin inventario CVE.\n- **Meta:** CONTINUE / ROTATE_AND_BLOCK / ASSESS_DEPENDENCY_RISK.\n- **Éxito:** `CONTINUE ROTATE_AND_BLOCK ASSESS_DEPENDENCY_RISK`.\n- **Límites:** no inventes un cero de CVE; no conviertas missing en CONTINUE.",
        instruction:
          "S42-T3-B-E3 · Salida: debe devolver el PASS del contrato. 1. Sin critical_cves → ASSESS_DEPENDENCY_RISK.\n2. Con datos: promote limpio → CONTINUE; si no → ROTATE_AND_BLOCK.\n3. Imprime los tres códigos.",
        hint: "Sin critical_cves → ASSESS_DEPENDENCY_RISK; con datos: promote limpio → CONTINUE; si no → ROTATE_AND_BLOCK.",
        hints: [
          "Sin critical_cves → ASSESS_DEPENDENCY_RISK; con datos: promote limpio → CONTINUE; si no → ROTATE_AND_BLOCK.",
          "ASSESS es la rama humana cuando no hay scan; no la conviertas en CONTINUE ni en ROTATE sin evidencia.",
        ],
        edgeCases: ["Falta critical_cves", "secret_in_repo + CVE abiertas", "CASO-CUS-042-3B es sintético"],
        tests: "Produce `CONTINUE ROTATE_AND_BLOCK ASSESS_DEPENDENCY_RISK` en ese orden.",
        feedback:
          "El release manager de Cusco rota y bloquea ante hallazgo demostrable; sin inventario CVE no se inventa un promote limpio — ASSESS, no CONTINUE.",
        retrospective:
          "ASSESS es humano cuando no hay scan; no es soft-allow. El error clásico es «no hay número, asumimos limpio». Pregunta: ¿qué evidencia pide ASSESS al equipo de deps?",
        starterCode: {
          language: 'python',
          title: "s42-t3-b-e3.py",
          code: `# CASO-CUS-042 · decide ROTATE_AND_BLOCK / ASSESS_DEPENDENCY_RISK
# Defecto didáctico: missing→CONTINUE; promote_ok invertido.
# Corrige solo la decisión de dominio; conserva datos y la salida esperada.
def promote_ok(
    secret_in_repo: bool,
    secret_in_log: bool,
    rotation_tested: bool,
    pinned: bool,
    critical_cves: int,
) -> bool:
    return secret_in_repo or not pinned

def decide(record: dict) -> str:
    required = {"case_id", "secret_in_repo", "secret_in_log", "rotation_tested", "dependency_pinned", "critical_cves"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    ok = promote_ok(
        record["secret_in_repo"],
        record["secret_in_log"],
        record["rotation_tested"],
        record["dependency_pinned"],
        record["critical_cves"],
    )
    return "CONTINUE" if ok else "ROTATE_AND_BLOCK"

valid = {"case_id": "CASO-CUS-042-3B", "secret_in_repo": False, "secret_in_log": False, "rotation_tested": True, "dependency_pinned": True, "critical_cves": 0}
invalid = {"case_id": "CASO-CUS-042-3B", "secret_in_repo": True, "secret_in_log": True, "rotation_tested": False, "dependency_pinned": False, "critical_cves": 2}
uncertain = {**valid}
uncertain.pop("critical_cves")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s42-t3-b-e3.py",
          code: `def promote_ok(
    secret_in_repo: bool,
    secret_in_log: bool,
    rotation_tested: bool,
    pinned: bool,
    critical_cves: int,
) -> bool:
    return (
        (not secret_in_repo)
        and (not secret_in_log)
        and rotation_tested
        and pinned
        and critical_cves == 0
    )

def decide(record: dict) -> str:
    required = {"case_id", "secret_in_repo", "secret_in_log", "rotation_tested", "dependency_pinned", "critical_cves"}
    missing = sorted(required - record.keys())
    if missing:
        return "ASSESS_DEPENDENCY_RISK"
    ok = promote_ok(
        record["secret_in_repo"],
        record["secret_in_log"],
        record["rotation_tested"],
        record["dependency_pinned"],
        record["critical_cves"],
    )
    return "CONTINUE" if ok else "ROTATE_AND_BLOCK"

valid = {"case_id": "CASO-CUS-042-3B", "secret_in_repo": False, "secret_in_log": False, "rotation_tested": True, "dependency_pinned": True, "critical_cves": 0}
invalid = {"case_id": "CASO-CUS-042-3B", "secret_in_repo": True, "secret_in_log": True, "rotation_tested": False, "dependency_pinned": False, "critical_cves": 2}
uncertain = {**valid}
uncertain.pop("critical_cves")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "ROTATE_AND_BLOCK", "ASSESS_DEPENDENCY_RISK"]` ,
          output: `CONTINUE ROTATE_AND_BLOCK ASSESS_DEPENDENCY_RISK` ,
        },
      },
      {
        id: "S42-T4-A-E1",
        subtopicId: "S42-T4-A",
        kind: "guided",
        title: "Inventario mínimo con techo de días",
        preamble:
          "- **Contexto:** el tablero de estado de Cusco solo necesita `case_id` y `region` por 30 días con purpose `status-report`.\n- **Meta:** `inventory_ok` = collected ⊆ needed ∧ purpose correcto ∧ days ≤ max.\n- **Éxito:** `S42-T4-A PASS`.\n- **Límites:** no apruebes full_name de más; no ignores el purpose.",
        instruction:
          "S42-T4-A-E1 · Salida: debe devolver el PASS del contrato. 1. El starter invierte inclusion y techo (bug).\n2. Exige collected <= needed, purpose == \"status-report\", days <= max_days.\n3. Conserva print PASS/MINIMIZE_AND_EXPIRE.",
        hint: "return collected <= needed and purpose == 'status-report' and days <= max_days",
        hints: [
          "return collected <= needed and purpose == 'status-report' and days <= max_days",
          "En E2, full_name + purpose maybe-useful + 3650 días es el adverso de minimización.",
        ],
        edgeCases: ["full_name de más", "purpose maybe-useful", "retención 3650", "CASO-CUS-042-4A es sintético"],
        tests: "inventory_ok({case_id,region}, {case_id,region}, status-report, 30, 30) es True e imprime `S42-T4-A PASS`.",
        feedback:
          "Minimización es inclusión de conjuntos + purpose + techo de retención; no basta «parecer pocos campos» en el tablero de estado.",
        retrospective:
          "Minimización no es «parecer pocos campos»: es `collected ⊆ needed` + purpose `status-report` + techo. El starter aprueba over-collection o retención abusiva. Pregunta: con `full_name` de más y purpose correcto, ¿PASS o MINIMIZE? Siguiente: PASS / MINIMIZE / MISSING:max_retention_days.",
        starterCode: {
          language: 'python',
          title: "s42-t4-a-e1.py",
          code: `# CASO-CUS-042 · minimización + purpose + retención
# Defecto didáctico: aprueba over-collection o retención sobre el techo.
# Corrige solo la decisión de dominio; conserva datos y la salida esperada.
def inventory_ok(
    collected: set, needed: set, purpose: str, days: int, max_days: int
) -> bool:
    # Defecto: invertido e incompleto (no fija purpose)
    return collected > needed or days > max_days

meets_contract = inventory_ok(
    {"case_id", "region"}, {"case_id", "region"}, "status-report", 30, 30
)
status = "PASS" if meets_contract else "MINIMIZE_AND_EXPIRE"
print("S42-T4-A", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s42-t4-a-e1.py",
          code: `def inventory_ok(
    collected: set, needed: set, purpose: str, days: int, max_days: int
) -> bool:
    return collected <= needed and purpose == "status-report" and days <= max_days

meets_contract = inventory_ok(
    {"case_id", "region"}, {"case_id", "region"}, "status-report", 30, 30
)
status = "PASS" if meets_contract else "MINIMIZE_AND_EXPIRE"
print("S42-T4-A", status)
assert meets_contract is True` ,
          output: `S42-T4-A PASS` ,
        },
      },
      {
        id: "S42-T4-A-E2",
        subtopicId: "S42-T4-A",
        kind: "independent",
        title: "Assess privacidad: PASS, MINIMIZE o MISSING",
        preamble:
          "- **Contexto:** el dueño de privacidad clasifica inventario mínimo, over-collection con retención abusiva y techo no declarado.\n- **Meta:** PASS / MINIMIZE_AND_EXPIRE / MISSING:max_retention_days.\n- **Éxito:** `PASS MINIMIZE_AND_EXPIRE MISSING:max_retention_days`.\n- **Límites:** no inventes 30 días cuando falta el techo.",
        instruction:
          "S42-T4-A-E2 · Salida: debe devolver el PASS del contrato. 1. Si falta max_retention_days → MISSING.\n2. Si inventory_ok → PASS; si no → MINIMIZE_AND_EXPIRE.\n3. Imprime la tripleta.",
        hint: "Si falta max_retention_days → MISSING; si no, collected⊆needed + purpose + techo → PASS; si no → MINIMIZE_AND_EXPIRE.",
        hints: [
          "Si falta max_retention_days → MISSING; si no, collected⊆needed + purpose + techo → PASS; si no → MINIMIZE_AND_EXPIRE.",
          "Sin techo no inventes 30: es incertidumbre de privacidad, no un PASS.",
        ],
        edgeCases: ["Falta max_retention_days", "full_name + 3650 días", "CASO-CUS-042-4A es sintético"],
        tests: "Produce exactamente `PASS MINIMIZE_AND_EXPIRE MISSING:max_retention_days`.",
        feedback:
          "MINIMIZE_AND_EXPIRE es over-collection o retención abusiva demostrable; MISSING:max es falta de política de techo, no un PASS inventado.",
        retrospective:
          "MINIMIZE es over-collection o retención abusiva demostrable; MISSING:max es política incompleta — no inventes 30 días. El error clásico es purpose `maybe-useful`. Pregunta: ¿quién debería firmar el techo de retención antes de publicar el dataset? Luego: CONTINUE / MINIMIZE / PRIVACY_OWNER_REVIEW.",
        starterCode: {
          language: 'python',
          title: "s42-t4-a-e2.py",
          code: `# CASO-CUS-042 · assess MINIMIZE_AND_EXPIRE
# Defecto didáctico: inventory_ok invertido (over-collection → PASS).
# Corrige solo la decisión de dominio; conserva datos y la salida esperada.
def inventory_ok(
    collected: set, needed: set, purpose: str, days: int, max_days: int
) -> bool:
    return collected > needed or days > max_days

def assess(record: dict) -> str:
    required = {"case_id", "collected", "needed", "purpose", "retention_days", "max_retention_days"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    ok = inventory_ok(
        record["collected"],
        record["needed"],
        record["purpose"],
        record["retention_days"],
        record["max_retention_days"],
    )
    return "PASS" if ok else "MINIMIZE_AND_EXPIRE"

valid = {"case_id": "CASO-CUS-042-4A", "collected": {"case_id", "region"}, "needed": {"case_id", "region"}, "purpose": "status-report", "retention_days": 30, "max_retention_days": 30}
invalid = {"case_id": "CASO-CUS-042-4A", "collected": {"case_id", "region", "full_name"}, "needed": {"case_id", "region"}, "purpose": "maybe-useful", "retention_days": 3650, "max_retention_days": 30}
incomplete = {**valid}
incomplete.pop("max_retention_days")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s42-t4-a-e2.py",
          code: `def inventory_ok(
    collected: set, needed: set, purpose: str, days: int, max_days: int
) -> bool:
    return collected <= needed and purpose == "status-report" and days <= max_days

def assess(record: dict) -> str:
    required = {"case_id", "collected", "needed", "purpose", "retention_days", "max_retention_days"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    ok = inventory_ok(
        record["collected"],
        record["needed"],
        record["purpose"],
        record["retention_days"],
        record["max_retention_days"],
    )
    return "PASS" if ok else "MINIMIZE_AND_EXPIRE"

valid = {"case_id": "CASO-CUS-042-4A", "collected": {"case_id", "region"}, "needed": {"case_id", "region"}, "purpose": "status-report", "retention_days": 30, "max_retention_days": 30}
invalid = {"case_id": "CASO-CUS-042-4A", "collected": {"case_id", "region", "full_name"}, "needed": {"case_id", "region"}, "purpose": "maybe-useful", "retention_days": 3650, "max_retention_days": 30}
incomplete = {**valid}
incomplete.pop("max_retention_days")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS MINIMIZE_AND_EXPIRE MISSING:max_retention_days` ,
        },
      },
      {
        id: "S42-T4-A-E3",
        subtopicId: "S42-T4-A",
        kind: "transfer",
        title: "Publica dataset: CONTINUE o PRIVACY_OWNER",
        preamble:
          "- **Contexto:** el tablero de estado pide **publicar** un dataset; sin techo de retención el dueño de privacidad revisa.\n- **Meta:** CONTINUE / MINIMIZE_AND_EXPIRE / PRIVACY_OWNER_REVIEW.\n- **Éxito:** `CONTINUE MINIMIZE_AND_EXPIRE PRIVACY_OWNER_REVIEW`.\n- **Límites:** no asumas 30 días por defecto; no trates missing como CONTINUE.",
        instruction:
          "S42-T4-A-E3 · Salida: debe devolver el PASS del contrato. 1. Sin max_retention_days → PRIVACY_OWNER_REVIEW.\n2. Con datos: inventory_ok → CONTINUE; si no → MINIMIZE_AND_EXPIRE.\n3. Imprime los tres códigos.",
        hint: "Sin max_retention_days → PRIVACY_OWNER_REVIEW; con datos: minimización OK → CONTINUE; si no → MINIMIZE_AND_EXPIRE.",
        hints: [
          "Sin max_retention_days → PRIVACY_OWNER_REVIEW; con datos: minimización OK → CONTINUE; si no → MINIMIZE_AND_EXPIRE.",
          "PRIVACY_OWNER_REVIEW es dueño de privacidad, no un soft-allow del payload.",
        ],
        edgeCases: ["Falta max_retention_days", "full_name + purpose basura", "CASO-CUS-042-4A es sintético"],
        tests: "Produce `CONTINUE MINIMIZE_AND_EXPIRE PRIVACY_OWNER_REVIEW` en ese orden.",
        feedback:
          "Over-collection en el tablero de Cusco es MINIMIZE demostrable; sin techo de retención el dueño de privacidad revisa — no se asume 30 días por defecto.",
        retrospective:
          "PRIVACY_OWNER_REVIEW no es soft-allow del payload. El error clásico es «inventamos 30 y pasamos». Pregunta: ¿quién firma el techo de retención?",
        starterCode: {
          language: 'python',
          title: "s42-t4-a-e3.py",
          code: `# CASO-CUS-042 · decide MINIMIZE_AND_EXPIRE / PRIVACY_OWNER_REVIEW
# Defecto didáctico: missing→CONTINUE; inventory_ok invertido.
# Corrige solo la decisión de dominio; conserva datos y la salida esperada.
def inventory_ok(
    collected: set, needed: set, purpose: str, days: int, max_days: int
) -> bool:
    return collected > needed or days > max_days

def decide(record: dict) -> str:
    required = {"case_id", "collected", "needed", "purpose", "retention_days", "max_retention_days"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    ok = inventory_ok(
        record["collected"],
        record["needed"],
        record["purpose"],
        record["retention_days"],
        record["max_retention_days"],
    )
    return "CONTINUE" if ok else "MINIMIZE_AND_EXPIRE"

valid = {"case_id": "CASO-CUS-042-4A", "collected": {"case_id", "region"}, "needed": {"case_id", "region"}, "purpose": "status-report", "retention_days": 30, "max_retention_days": 30}
invalid = {"case_id": "CASO-CUS-042-4A", "collected": {"case_id", "region", "full_name"}, "needed": {"case_id", "region"}, "purpose": "maybe-useful", "retention_days": 3650, "max_retention_days": 30}
uncertain = {**valid}
uncertain.pop("max_retention_days")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s42-t4-a-e3.py",
          code: `def inventory_ok(
    collected: set, needed: set, purpose: str, days: int, max_days: int
) -> bool:
    return collected <= needed and purpose == "status-report" and days <= max_days

def decide(record: dict) -> str:
    required = {"case_id", "collected", "needed", "purpose", "retention_days", "max_retention_days"}
    missing = sorted(required - record.keys())
    if missing:
        return "PRIVACY_OWNER_REVIEW"
    ok = inventory_ok(
        record["collected"],
        record["needed"],
        record["purpose"],
        record["retention_days"],
        record["max_retention_days"],
    )
    return "CONTINUE" if ok else "MINIMIZE_AND_EXPIRE"

valid = {"case_id": "CASO-CUS-042-4A", "collected": {"case_id", "region"}, "needed": {"case_id", "region"}, "purpose": "status-report", "retention_days": 30, "max_retention_days": 30}
invalid = {"case_id": "CASO-CUS-042-4A", "collected": {"case_id", "region", "full_name"}, "needed": {"case_id", "region"}, "purpose": "maybe-useful", "retention_days": 3650, "max_retention_days": 30}
uncertain = {**valid}
uncertain.pop("max_retention_days")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "MINIMIZE_AND_EXPIRE", "PRIVACY_OWNER_REVIEW"]` ,
          output: `CONTINUE MINIMIZE_AND_EXPIRE PRIVACY_OWNER_REVIEW` ,
        },
      },
      {
        id: "S42-T4-B-E1",
        subtopicId: "S42-T4-B",
        kind: "guided",
        title: "Purga completa sin PII en audit",
        preamble:
          "- **Contexto:** al cerrar un ticket de Cusco, el audit no debe llevar email y deben borrarse primario y derivados con llave separada.\n- **Meta:** `purge_ok` = audit.isdisjoint(pii) ∧ deleted ∧ derived_deleted ∧ key_separate.\n- **Éxito:** `S42-T4-B PASS` con audit de tokens y purga completa.\n- **Límites:** no apruebes email en audit; no ignores derivados.",
        instruction:
          "S42-T4-B-E1 · Salida: debe devolver el PASS del contrato. 1. El starter aprueba si hay ∩ con PII o derivado vivo (bug).\n2. Implementa isdisjoint + flags de borrado + key_separate.\n3. Conserva print PASS/PURGE_DERIVATIVES.",
        hint: "return audit.isdisjoint(pii) and deleted and derived_deleted and key_separate",
        hints: [
          "return audit.isdisjoint(pii) and deleted and derived_deleted and key_separate",
          "En E2, email en audit + export vivo es el adverso clásico de purga incompleta.",
        ],
        edgeCases: ["email en audit", "derived_deleted False", "key_separate False", "CASO-CUS-042-4B es sintético"],
        tests: "El fixture limpio (audit sin PII, primario y derivados borrados, llave de reidentificación separada) pasa `purge_ok` e imprime `S42-T4-B PASS`.",
        feedback:
          "Soft-delete del primario no basta: audit limpio + derivados purgados + llave separada cierran el ciclo de no-reaparición de CP-N4-A.",
        retrospective:
          "Soft-delete del primario no cierra el ciclo: audit limpio + derivados purgados + llave separada. El starter deja pasar reaparición a propósito. Pregunta: si la fila está borrada pero `snapshot.csv` vive, ¿PASS o PURGE_DERIVATIVES? Siguiente: PASS / PURGE / MISSING:key_separate.",
        starterCode: {
          language: 'python',
          title: "s42-t4-b-e1.py",
          code: `# CASO-CUS-042 · audit sin PII + purga de derivados
# Defecto didáctico: aprueba si hay audit∩PII o el derivado sigue vivo.
# Corrige solo la decisión de dominio; conserva datos y la salida esperada.
def purge_ok(
    audit: set, pii: set, deleted: bool, derived_deleted: bool, key_separate: bool
) -> bool:
    # Defecto: invertido e incompleto (no exige deleted ni key_separate)
    return bool(audit & pii) or not derived_deleted

meets_contract = purge_ok(
    {"actor_id", "action", "at", "case_token"},
    {"full_name", "email"},
    True,
    True,
    True,
)
status = "PASS" if meets_contract else "PURGE_DERIVATIVES"
print("S42-T4-B", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s42-t4-b-e1.py",
          code: `def purge_ok(
    audit: set, pii: set, deleted: bool, derived_deleted: bool, key_separate: bool
) -> bool:
    return audit.isdisjoint(pii) and deleted and derived_deleted and key_separate

meets_contract = purge_ok(
    {"actor_id", "action", "at", "case_token"},
    {"full_name", "email"},
    True,
    True,
    True,
)
status = "PASS" if meets_contract else "PURGE_DERIVATIVES"
print("S42-T4-B", status)
assert meets_contract is True` ,
          output: `S42-T4-B PASS` ,
        },
      },
      {
        id: "S42-T4-B-E2",
        subtopicId: "S42-T4-B",
        kind: "independent",
        title: "Assess purga: PASS, PURGE o MISSING",
        preamble:
          "- **Contexto:** el dueño de ciclo de vida clasifica purga limpia, reaparición (email en audit + export vivo) y alcance de llave no declarado.\n- **Meta:** PASS / PURGE_DERIVATIVES / MISSING:key_separate.\n- **Éxito:** `PASS PURGE_DERIVATIVES MISSING:key_separate`.\n- **Límites:** no asumas key_separate=True por defecto.",
        instruction:
          "S42-T4-B-E2 · Salida: debe devolver el PASS del contrato. 1. Si falta key_separate → MISSING.\n2. Si purge_ok → PASS; si no → PURGE_DERIVATIVES.\n3. Imprime la tripleta.",
        hint: "Si falta key_separate → MISSING; si no, audit∩PII vacío + ambos borrados + llave → PASS; si no → PURGE_DERIVATIVES.",
        hints: [
          "Si falta key_separate → MISSING; si no, audit∩PII vacío + ambos borrados + llave → PASS; si no → PURGE_DERIVATIVES.",
          "Missing de key_separate no es «llave separada por defecto»: es incertidumbre de diseño.",
        ],
        edgeCases: ["Falta key_separate", "email en audit", "export derivado vivo", "CASO-CUS-042-4B es sintético"],
        tests: "Produce exactamente `PASS PURGE_DERIVATIVES MISSING:key_separate`.",
        feedback:
          "PURGE es reaparición o derivado vivo demostrable; MISSING:key es alcance de borrado no declarado — no se asume llave separada por defecto.",
        retrospective:
          "PURGE es reaparición o derivado vivo; MISSING:key es diseño de reidentificación no confirmado — no asumas `key_separate=True`. El error clásico es soft-delete y listo. Pregunta: ¿por qué un email en audit rompe CP-N4-A aunque el primario esté vacío? Luego: CONTINUE / PURGE / VERIFY_DELETION_SCOPE.",
        starterCode: {
          language: 'python',
          title: "s42-t4-b-e2.py",
          code: `# CASO-CUS-042 · assess PURGE_DERIVATIVES
# Defecto didáctico: purge_ok invertido (PII en audit o derived vivo → PASS).
# Corrige solo la decisión de dominio; conserva datos y la salida esperada.
def purge_ok(
    audit: set, pii: set, deleted: bool, derived_deleted: bool, key_separate: bool
) -> bool:
    return bool(audit & pii) or not derived_deleted

def assess(record: dict) -> str:
    required = {"case_id", "audit_fields", "pii_fields", "deleted", "derived_deleted", "key_separate"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    ok = purge_ok(
        record["audit_fields"],
        record["pii_fields"],
        record["deleted"],
        record["derived_deleted"],
        record["key_separate"],
    )
    return "PASS" if ok else "PURGE_DERIVATIVES"

valid = {"case_id": "CASO-CUS-042-4B", "audit_fields": {"actor_id", "action", "at", "case_token"}, "pii_fields": {"full_name", "email"}, "deleted": True, "derived_deleted": True, "key_separate": True}
invalid = {"case_id": "CASO-CUS-042-4B", "audit_fields": {"actor_id", "email", "action"}, "pii_fields": {"full_name", "email"}, "deleted": True, "derived_deleted": False, "key_separate": False}
incomplete = {**valid}
incomplete.pop("key_separate")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s42-t4-b-e2.py",
          code: `def purge_ok(
    audit: set, pii: set, deleted: bool, derived_deleted: bool, key_separate: bool
) -> bool:
    return audit.isdisjoint(pii) and deleted and derived_deleted and key_separate

def assess(record: dict) -> str:
    required = {"case_id", "audit_fields", "pii_fields", "deleted", "derived_deleted", "key_separate"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    ok = purge_ok(
        record["audit_fields"],
        record["pii_fields"],
        record["deleted"],
        record["derived_deleted"],
        record["key_separate"],
    )
    return "PASS" if ok else "PURGE_DERIVATIVES"

valid = {"case_id": "CASO-CUS-042-4B", "audit_fields": {"actor_id", "action", "at", "case_token"}, "pii_fields": {"full_name", "email"}, "deleted": True, "derived_deleted": True, "key_separate": True}
invalid = {"case_id": "CASO-CUS-042-4B", "audit_fields": {"actor_id", "email", "action"}, "pii_fields": {"full_name", "email"}, "deleted": True, "derived_deleted": False, "key_separate": False}
incomplete = {**valid}
incomplete.pop("key_separate")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS PURGE_DERIVATIVES MISSING:key_separate` ,
        },
      },
      {
        id: "S42-T4-B-E3",
        subtopicId: "S42-T4-B",
        kind: "transfer",
        title: "Cierre de ticket: CONTINUE o VERIFY_DELETION",
        preamble:
          "- **Contexto:** al cerrar el ticket de Cusco hay que purgar fila, snapshot y export; sin flag de llave separada el alcance queda en revisión humana.\n- **Meta:** CONTINUE / PURGE_DERIVATIVES / VERIFY_DELETION_SCOPE.\n- **Éxito:** `CONTINUE PURGE_DERIVATIVES VERIFY_DELETION_SCOPE`.\n- **Límites:** no soft-delete silencioso; no inventes key_separate.",
        instruction:
          "S42-T4-B-E3 · Salida: debe devolver el PASS del contrato. 1. Sin key_separate → VERIFY_DELETION_SCOPE.\n2. Con datos: ciclo completo → CONTINUE; si no → PURGE_DERIVATIVES.\n3. Imprime los tres códigos.",
        hint: "Sin key_separate → VERIFY_DELETION_SCOPE; con datos: ciclo completo → CONTINUE; si no → PURGE_DERIVATIVES.",
        hints: [
          "Sin key_separate → VERIFY_DELETION_SCOPE; con datos: ciclo completo → CONTINUE; si no → PURGE_DERIVATIVES.",
          "VERIFY_DELETION_SCOPE es revisión humana del alcance; no es un soft-delete silencioso.",
        ],
        edgeCases: ["Falta key_separate", "email en audit + export vivo", "CASO-CUS-042-4B es sintético"],
        tests: "Produce `CONTINUE PURGE_DERIVATIVES VERIFY_DELETION_SCOPE` en ese orden.",
        feedback:
          "Soft-delete de la fila no cierra CP-N4-A en Cusco: hace falta purga de derivados y prueba de no-reaparición; sin key_separate el alcance queda en VERIFY humana.",
        retrospective:
          "VERIFY_DELETION_SCOPE es humano cuando el alcance de reidentificación no está confirmado. El error clásico es «borré la fila, el gate ya pasó». Pregunta: ¿dónde reaparece un email si solo haces soft-delete?",
        starterCode: {
          language: 'python',
          title: "s42-t4-b-e3.py",
          code: `# CASO-CUS-042 · decide PURGE_DERIVATIVES / VERIFY_DELETION_SCOPE
# Defecto didáctico: missing→CONTINUE; purge_ok invertido.
# Corrige solo la decisión de dominio; conserva datos y la salida esperada.
def purge_ok(
    audit: set, pii: set, deleted: bool, derived_deleted: bool, key_separate: bool
) -> bool:
    return bool(audit & pii) or not derived_deleted

def decide(record: dict) -> str:
    required = {"case_id", "audit_fields", "pii_fields", "deleted", "derived_deleted", "key_separate"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    ok = purge_ok(
        record["audit_fields"],
        record["pii_fields"],
        record["deleted"],
        record["derived_deleted"],
        record["key_separate"],
    )
    return "CONTINUE" if ok else "PURGE_DERIVATIVES"

valid = {"case_id": "CASO-CUS-042-4B", "audit_fields": {"actor_id", "action", "at", "case_token"}, "pii_fields": {"full_name", "email"}, "deleted": True, "derived_deleted": True, "key_separate": True}
invalid = {"case_id": "CASO-CUS-042-4B", "audit_fields": {"actor_id", "email", "action"}, "pii_fields": {"full_name", "email"}, "deleted": True, "derived_deleted": False, "key_separate": False}
uncertain = {**valid}
uncertain.pop("key_separate")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s42-t4-b-e3.py",
          code: `def purge_ok(
    audit: set, pii: set, deleted: bool, derived_deleted: bool, key_separate: bool
) -> bool:
    return audit.isdisjoint(pii) and deleted and derived_deleted and key_separate

def decide(record: dict) -> str:
    required = {"case_id", "audit_fields", "pii_fields", "deleted", "derived_deleted", "key_separate"}
    missing = sorted(required - record.keys())
    if missing:
        return "VERIFY_DELETION_SCOPE"
    ok = purge_ok(
        record["audit_fields"],
        record["pii_fields"],
        record["deleted"],
        record["derived_deleted"],
        record["key_separate"],
    )
    return "CONTINUE" if ok else "PURGE_DERIVATIVES"

valid = {"case_id": "CASO-CUS-042-4B", "audit_fields": {"actor_id", "action", "at", "case_token"}, "pii_fields": {"full_name", "email"}, "deleted": True, "derived_deleted": True, "key_separate": True}
invalid = {"case_id": "CASO-CUS-042-4B", "audit_fields": {"actor_id", "email", "action"}, "pii_fields": {"full_name", "email"}, "deleted": True, "derived_deleted": False, "key_separate": False}
uncertain = {**valid}
uncertain.pop("key_separate")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "PURGE_DERIVATIVES", "VERIFY_DELETION_SCOPE"]` ,
          output: `CONTINUE PURGE_DERIVATIVES VERIFY_DELETION_SCOPE` ,
        },
      },
    ],
  },
  youDo: {
    title: "Schemas, seguridad y privacidad de servicios",
    context: "Eres el dueño del control plane de soporte sintético en Cusco (`CASO-CUS-042`). La misma petición HTTP que versionaste en S41 debe atravesar schema estricto, resource binding, allowlist de hosts, confinamiento de path y una vista redactada sin email. Entrada: payload, actor, owner, scopes, host y path. Salida: allow/deny auditable + evidencia de purga. El gate **CP-N4-A** se bloquea ante campo extra, lectura cross-tenant, URL/path no permitidos o reaparición de un campo redactado.",
    objectives: [
      "Implementar un mini `policy_engine` stdlib que encadene schema → SSRF host → path confinement → authz resource binding.",
      "Demostrar CP-N4-A: un actor nunca lee el caso de otro y un campo redactado no reaparece en la vista de respuesta.",
      "Cubrir rutas normales (CONTINUE), breach (REJECT/DENY) e incertidumbre de purga (derivado vivo) con salidas exactas.",
      "Empaquetar evidencia reproducible sin PII real, secretos ni red externa obligatoria.",
    ],
    requirements: [
      "Usa exclusivamente fixtures sintéticos `CASO-CUS-042-*`.",
      "Incluye validación de borde (required ⊆ keys ⊆ allowed) y fixtures inválidos con campo extra.",
      "Incluye matriz RBAC/scopes deny-by-default con al menos un DENY_CROSS_TENANT.",
      "Incluye rechazo de host no allowlisted (p. ej. 169.254.169.254) y path fuera de root o con `..`.",
      "Incluye flujo de redacción, purga de derivados y audit sin PII.",
      "Automatiza caso normal, breach y uncertain con salidas exactas documentadas.",
      "Incluye comandos locales reproducibles, deps fijadas y salida esperada.",
      "Documenta un threat model mínimo (actores, activos, entry points, amenazas y mitigaciones) más riesgo residual, responsable, rollback y limitaciones.",
    ],
    starterCode: `CASE_ID = "CASO-CUS-042"
REQUIRED = [
    "json_schemas_compatibles_y_casos_invalidos",
    "matriz_rbac_scopes_deny_by_default",
    "controles_contra_injection_ssrf_path_traversal",
    "flujo_de_acceso_redaccion_borrado_y_auditoria",
]

def readiness(bundle: dict[str, bool]) -> tuple[str, list[str]]:
    missing = [name for name in REQUIRED if bundle.get(name) is not True]
    return ("READY", []) if not missing else ("BLOCKED", missing)

def policy_engine(
    req: dict,
    actor: str,
    owner: str,
    scopes: set,
    host: str,
    allow_hosts: set,
    user_path: str = "a.txt",
    root: str = "/safe/reports",
) -> str:
    """Cadena fail-closed: schema → SSRF host → path → authz resource binding."""
    allowed = {"case_id", "status"}
    if not {"case_id", "status"}.issubset(req) or set(req) - allowed:
        return "REJECT_SCHEMA"
    if host not in allow_hosts:
        return "REJECT_UNTRUSTED_INPUT"
    if ".." in user_path.split("/"):
        return "REJECT_UNTRUSTED_INPUT"
    joined = f"{root.rstrip('/')}/{user_path.lstrip('/')}"
    if not joined.startswith(root.rstrip("/") + "/") and joined != root.rstrip("/"):
        return "REJECT_UNTRUSTED_INPUT"
    if "cases:read" not in scopes or actor != owner:
        return "DENY_CROSS_TENANT"
    return "CONTINUE"

def redact_view(record: dict, allow: set) -> dict:
    return {k: v for k, v in record.items() if k in allow}

def purge_ok(primary: dict, derived: dict, case_id: str, audit: set, pii: set) -> bool:
    return (
        case_id not in primary
        and case_id not in derived
        and audit.isdisjoint(pii)
    )

# Evidencia calculada (no flips manuales)
schema_ok = policy_engine(
    {"case_id": CASE_ID, "status": "open", "note": 1},
    "u1", "u1", {"cases:read"}, "docs.local", {"docs.local"},
) == "REJECT_SCHEMA"
authz_ok = (
    policy_engine({"case_id": CASE_ID, "status": "open"}, "u1", "u1", {"cases:read"}, "docs.local", {"docs.local"})
    == "CONTINUE"
    and policy_engine({"case_id": CASE_ID, "status": "open"}, "u1", "u2", {"cases:read"}, "docs.local", {"docs.local"})
    == "DENY_CROSS_TENANT"
)
ssrf_ok = policy_engine(
    {"case_id": CASE_ID, "status": "open"}, "u1", "u1", {"cases:read"}, "169.254.169.254", {"docs.local"}
) == "REJECT_UNTRUSTED_INPUT"
path_ok = policy_engine(
    {"case_id": CASE_ID, "status": "open"}, "u1", "u1", {"cases:read"}, "docs.local", {"docs.local"},
    user_path="../etc/passwd",
) == "REJECT_UNTRUSTED_INPUT"
view = redact_view({"case_id": CASE_ID, "email": "x@example.pe", "region": "CUS"}, {"case_id", "region"})
privacy_ok = (
    "email" not in view
    and view.get("region") == "CUS"
    and purge_ok({}, {}, "C1", {"actor_id", "action", "case_token"}, {"email", "full_name"})
)

evidence = {
    "json_schemas_compatibles_y_casos_invalidos": schema_ok,
    "matriz_rbac_scopes_deny_by_default": authz_ok,
    "controles_contra_injection_ssrf_path_traversal": ssrf_ok and path_ok,
    "flujo_de_acceso_redaccion_borrado_y_auditoria": privacy_ok,
}

status, missing = readiness(evidence)
print(CASE_ID, status)
print("missing", ",".join(missing))
print("deny_cross", policy_engine(
    {"case_id": CASE_ID, "status": "open"}, "u1", "u2", {"cases:read"}, "docs.local", {"docs.local"}
))
print("path_block", policy_engine(
    {"case_id": CASE_ID, "status": "open"}, "u1", "u1", {"cases:read"}, "docs.local", {"docs.local"},
    user_path="../etc/passwd",
))
assert status == "READY"
assert not missing
`,
    portfolioNote: "Evidencia de CP-N4-A: el starter calcula READY desde asserts reales (extra → REJECT_SCHEMA, cross-tenant → DENY, SSRF y path → REJECT, email no reaparece, purga limpia). En tu repo amplía con matriz de scopes por `svc-*`, rotación de secretos, rollback documentado y riesgo residual (incluye missing≠breach) — no entregues un checklist de booleanos a mano.",
    rubric: [
      { criterion: "Corrección técnica del contrato y gate CP-N4-A.", weight: "25%" },
      { criterion: "Pruebas normal/breach/uncertain y recuperación.", weight: "20%" },
      { criterion: "Seguridad, privacidad y least privilege.", weight: "15%" },
      { criterion: "Reproducibilidad, lineage y evidencia.", weight: "15%" },
      { criterion: "Operación: SLO, observabilidad y rollback.", weight: "15%" },
      { criterion: "Comunicación de trade-offs y límites.", weight: "10%" },
    ],
    retrospective:
      "Antes de marcar listo: (1) ¿qué print o assert demuestra **no** lectura cross-tenant y **no** reaparición del email en la vista? (2) ¿dónde está tu evidencia de REJECT_SCHEMA y de host `169.254…` / path `..`? (3) En el README, una frase de impacto medible (antes/después del control plane) que puedas defender en 30 segundos. Si falta amenaza residual o rollback, no es READY aunque el status imprima READY.",
  },
  selfCheck: {
    questions: [
      {
        question: "¿Qué evidencia permite aprobar schema estricto en CASO-CUS-042?",
        options: ["un print sin assert ni versión", "fixtures válidos/inválidos con rechazo de campos extra (modelo de extra=forbid)", "una captura de pantalla sin fuente", "datos personales reales para que parezca auténtico"],
        correctIndex: 1,
        explanation: "Se exige forma estricta comprobable: válidos pasan y extras/status basura fallan; evidencia decorativa o PII no cuenta.",
      },
      {
        question: "Si un actor autenticado pide el caso de otro tenant sin resource binding, ¿qué respuesta preserva seguridad y auditabilidad?",
        options: ["continuar y ocultar el warning", "inventar evidencia faltante", "borrar el trace para reducir ruido", "emitir DENY_CROSS_TENANT y conservar evidencia"],
        correctIndex: 3,
        explanation: "Authn ≠ authz: identidad correcta sin pertenencia del recurso → DENY_CROSS_TENANT con audit trail; no se convierte un breach en éxito.",
      },
      {
        question: "¿Cuál resultado demuestra el gate `CP-N4-A · control plane seguro y privado`?",
        options: ["un actor nunca lee otro caso y un dato redactado no reaparece en logs, respuestas ni backups activos", "el archivo de la sección existe, aunque no pruebe el gate", "el README afirma que funciona", "se usó la herramienta más nueva"],
        correctIndex: 0,
        explanation: "El gate es conductual y medible: no cross-tenant + redacción sostenida.",
      },
      {
        question: "El canal de notificaciones añade un campo opcional `currency` sin tocar `amount`, y el lector v1 sigue pasando. ¿Qué tipo de evolución es?",
        options: ["rename_required silencioso (aceptable sin versión)", "rupture que obliga VERSION_SCHEMA siempre", "evolución aditiva segura si la unión de tags sigue exhaustiva", "permiso para omitir handled_tags en el deploy"],
        correctIndex: 2,
        explanation: "Cambios aditivos opcionales preservan lectores previos; rename o tags sin handler exigen VERSION_SCHEMA o MIGRATE_CONSUMERS.",
      },
      {
        question: "Una URL de adjunto apunta a `http://169.254.169.254/` (metadata cloud). ¿Qué control fail-closed aplica en S42-T3-A?",
        options: ["confiar en el esquema https del cliente", "allowlist de hosts: rechazar si el host no está en el catálogo", "aceptar y filtrar el body después del fetch", "bloquear solo si el path contiene `passwd`"],
        correctIndex: 1,
        explanation: "SSRF se corta antes del socket: host ∉ allowlist → REJECT_UNTRUSTED_INPUT. No se mitiga después del fetch ni solo por path.",
      },
    ],
  },
  resources: {
    docs: [
      {
        label: "Pydantic",
        url: "https://docs.pydantic.dev/latest/",
        note: "Validación y JSON Schema",
      },
      {
        label: "JSON Schema",
        url: "https://json-schema.org/",
        note: "Contrato de forma interoperable",
      },
      {
        label: "OWASP API Security Top 10",
        url: "https://owasp.org/www-project-api-security/",
        note: "Riesgos y controles de API",
      },
      {
        label: "OWASP Cheat Sheet Series",
        url: "https://cheatsheetseries.owasp.org/",
        note: "Authn/authz, SSRF, secrets",
      },
      {
        label: "OWASP Secrets Management Cheat Sheet",
        url: "https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html",
        note: "Secretos fuera del repo y rotación",
      },
      {
        label: "NIST Privacy Framework",
        url: "https://www.nist.gov/privacy-framework",
        note: "Gestión de riesgo de privacidad",
      },
      {
        label: "NIST SP 800-63",
        url: "https://pages.nist.gov/800-63-3/",
        note: "Identidad digital y autenticación",
      },
      {
        label: "NIST SP 800-88 media sanitization",
        url: "https://csrc.nist.gov/publications/detail/sp/800-88/rev-1/final",
        note: "Borrado y retención",
      },
      {
        label: "OAuth 2.0 RFC 6749",
        url: "https://datatracker.ietf.org/doc/html/rfc6749",
        note: "Scopes y autorización",
      },
      {
        label: "Python secrets / hashlib",
        url: "https://docs.python.org/3/library/secrets.html",
        note: "Tokens y pseudonimización didáctica",
      },
    ],
    books: [
      { label: "Designing Data-Intensive Applications", note: "Contratos, aislamiento y evolución" },
      { label: "Threat Modeling (Shostack)", note: "Amenazas y controles en el control plane" },
    ],
    courses: [
      { label: "Stanford CS253 Web Security (materials)", url: "https://web.stanford.edu/class/cs253/", note: "Web/app security patterns" },
      { label: "Google Cybersecurity Professional Certificate", url: "https://www.coursera.org/professional-certificates/google-cybersecurity", note: "Fundamentos de seguridad" },
      { label: "MIT 6.100L", url: "https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/", note: "Contratos verificables" },
      { label: "Harvard CS50P", url: "https://cs50.harvard.edu/python/", note: "Tests y proyectos reproducibles" },
      { label: "Py4E", url: "https://www.py4e.com", note: "Stdlib-first progressive disclosure" },
    ],
  },
}
