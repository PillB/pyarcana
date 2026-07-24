import type { CourseSection } from '../../types'

export const section42: CourseSection = {
  id: "graph-rag",
  index: 42,
  title: "Schemas, seguridad y privacidad de servicios",
  shortTitle: "Schemas y seguridad",
  tagline: "Threat model y pruebas de permisos: un usuario no lee el caso de otro ni recupera datos redactados",
  estimatedHours: 20,
  level: "Master",
  phase: 3,
  icon: "Share2",
  accentColor: "bg-gradient-to-br from-amber-500 to-red-600",
  jobRelevance:
    "En equipos de plataforma y producto (fintech, healthtech, retail y gobierno digital en el Perú), la API versionada de S41 no basta: hace falta un **control plane fail-closed**. **Schemas estrictos** rechazan campos extra antes de tocar negocio; **authn ≠ authz** con RBAC y resource binding evita que un analista de Cusco lea el ticket de otro tenant; **scopes** deny-by-default cierran rutas no declaradas; **SSRF/path** y secretos fuera del repo evitan abusos de red y filtraciones; **minimización, redacción y purga** cierran el ciclo de privacidad. El artefacto de esta sección es threat model + matriz de permisos con evidencia allow/deny auditable. Solo se promociona cuando se demuestra **CP-N4-A**: un actor nunca lee el caso de otro y un campo redactado no reaparece en logs, respuestas ni backups activos.",
  learningOutcomes: [
    { text: "Definir un schema de borde estricto (tipos + rechazo de campos extra) y exportar fixtures válidos/inválidos" },
    { text: "Evolucionar contratos con cambios aditivos y discriminated unions exhaustivas sin romper lectores previos" },
    { text: "Implementar authn≠authz con RBAC y resource binding que deniega lectura cross-tenant" },
    { text: "Aplicar scopes e identidades de servicio con política deny-by-default en rutas no declaradas" },
    { text: "Rechazar input no confiable: límites de tamaño, SSRF por allowlist y path confinement" },
    { text: "Gestionar secretos fuera del repo, cifrado en reposo y dependencias fijadas sin CVE críticas abiertas" },
    { text: "Minimizar campos al propósito declarado y fijar retención finita con bloqueo al vencer" },
    { text: "Auditar sin PII, purgar derivados y verificar que un campo redactado no reaparece" },
  ],
  theory: [
    {
      heading: "Ruta de S42: Schemas, seguridad y privacidad de servicios",
      paragraphs: [
        "**Diccionario de la sección** (léelo antes de T1). **Schema estricto:** forma + tipos + rechazo de campos extra. **Authn/authz:** quién eres vs qué puedes hacer. **RBAC/scopes:** roles y permisos deny-by-default. **SSRF/path traversal:** abuso de URLs o rutas del servidor. **Minimización/retención:** solo el dato necesario, solo el tiempo necesario. **Pseudonimización:** identificadores derivados sin reidentificación fácil. **Redacción:** campo sensible no reaparece en logs, respuestas ni backups activos. **Missing ≠ breach:** falta de evidencia se enruta a revisión humana; no se inventa un allow ni se confunde con un ataque demostrado.",
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
        "Authentication identifica al actor; authorization decide una **acción sobre un recurso**. Un JWT o cookie válida responde «quién eres», no «puedes leer el caso de otro tenant». RBAC arranca con roles mínimos y exige *resource binding*: el permiso se evalúa contra el **dueño del caso**, no solo contra el rol del token. Confundir authn con authz es el error clásico que convierte un analista legítimo en un lector cross-tenant.",
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
          "La revisión de S42-T2-A conserva prueba actor A no lee caso B; no conviertas `DENY_CROSS_TENANT` ni `VERIFY_RESOURCE_OWNER` en éxito silencioso.",
      },
    },
    {
      heading: "Scopes, service identities y deny-by-default",
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
      heading: "Límites de input, injection y SSRF/path traversal",
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
          "Promoción de S42-T3-B: prueba scan sin secreto y rotación ensayada y registra por separado `ROTATE_AND_BLOCK` (breach) y `ASSESS_DEPENDENCY_RISK` (missing).",
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
          "Cierre de S42-T4-B: conserva borrado y no-reaparición verificados, la evidencia de `PURGE_DERIVATIVES` y la ruta humana `VERIFY_DELETION_SCOPE`.",
      },
    },
  ],
  iDo: {
    intro: "Te muestro 8 demos de S42 alineadas a CP-N4-A, en el orden del control plane: forma del payload → evolución → lectura de caso → scopes de servicio → SSRF/path → secretos/deps → minimización → purga. Cada demo **calcula** el control sobre `CASO-CUS-042` (Cusco sintético): no imprime una etiqueta de seguridad sin derivarla de los datos.",
    steps: [
      {
        demoId: "S42-T1-A-DEMO",
        subtopicId: "S42-T1-A",
        environment: "local-python",
        description: "Demo: schema estricto (extra=forbid) + regla de negocio",
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
        why: "Muestra el modelo de extra=forbid: el ticket válido de Cusco pasa; un campo extra o un status fuera de vocabulario fallan antes de authz.",
      },
      {
        demoId: "S42-T1-B-DEMO",
        subtopicId: "S42-T1-B",
        environment: "local-python",
        description: "Demo: lector v1 sobre cambio aditivo",
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
        why: "El lector v1 sigue leyendo `amount` cuando aparece `currency` opcional; sin `amount` falla de verdad. `evolution_ok` confirma cambio aditivo con unión exhaustiva.",
      },
      {
        demoId: "S42-T2-A-DEMO",
        subtopicId: "S42-T2-A",
        environment: "local-python",
        description: "Demo: authn ≠ authz y no cross-tenant",
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
        why: "Separa identidad de permiso: el analista u1 lee su caso, se deniega el de u2, y solo admin con scope explícito cruza tenants — evidencia del gate no cross-tenant.",
      },
      {
        demoId: "S42-T2-B-DEMO",
        subtopicId: "S42-T2-B",
        environment: "local-python",
        description: "Demo: catálogo de scopes por identidad de servicio",
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
        why: "Deny-by-default por catálogo: el worker solo corre jobs; admin no granted y un principal desconocido no reciben scopes fantasma.",
      },
      {
        demoId: "S42-T3-A-DEMO",
        subtopicId: "S42-T3-A",
        environment: "local-python",
        description: "Demo: allowlist SSRF + path confinement",
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
        why: "Calcula el rechazo: host de docs permitido, metadata cloud bloqueada y path con `..` lanza traversal — no hay print de etiqueta fija.",
      },
      {
        demoId: "S42-T3-B-DEMO",
        subtopicId: "S42-T3-B",
        environment: "local-python",
        description: "Demo: deps envejecidas y promote de secretos",
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
        why: "Deriva riesgo de deps viejas y bloquea promote si hay secreto en repo o CVE críticas — evidencia de ROTATE_AND_BLOCK.",
      },
      {
        demoId: "S42-T4-A-DEMO",
        subtopicId: "S42-T4-A",
        environment: "local-python",
        description: "Demo: drop de email en logs y purpose-bound",
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
        why: "Minimiza el log al purpose de operaciones: el email no reaparece; la retención se calcula contra el techo del inventario de Cusco.",
      },
      {
        demoId: "S42-T4-B-DEMO",
        subtopicId: "S42-T4-B",
        environment: "local-python",
        description: "Demo: borrado primario vs derivado vivo",
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
        why: "Borrar la fila primaria no basta: `purge_complete` es False mientras el export derivado sigue vivo — evidencia de PURGE_DERIVATIVES pendiente.",
      },
    ],
  },
  weDo: {
    intro: "S42 · Laboratorio de threat model y matriz de permisos (CP-N4-A): 24 retos locales sobre `CASO-CUS-042`. **E1** repara el cuerpo de una función de decisión (schema, evolución, `can_read`, scopes, SSRF/path, promote, inventario, purga). **E2** separa válido / adverso real / missing (missing ≠ breach). **E3** cierra fail-closed con códigos de acción (`CONTINUE` / DENY|REJECT / rama humana). Entrena el **control**, no el flip de un booleano precomputado: el adverso falla por contenido (extra key, cross-tenant, 169.254…, `/etc/passwd`, over-collection, audit∩PII).",
    steps: [
      {
        id: "S42-T1-A-E1",
        subtopicId: "S42-T1-A",
        kind: "guided",
        instruction: "S42-T1-A-E1 · Valida el payload de `CASO-CUS-042-1A` con schema estricto (required ⊆ keys ⊆ allowed) y regla de negocio sobre `status`. El starter acepta cualquier dict con las claves required e ignora extras y el vocabulario de status. Corrige solo el predicado. Salida exacta: `S42-T1-A PASS`.",
        hint: "Modelo de extra=forbid: `set(payload) ⊆ allowed` y `status ∈ {open, closed}`.",
        hints: [
          "Modelo de extra=forbid: `set(payload) ⊆ allowed` y `status ∈ {open, closed}`.",
          "El fixture válido solo tiene case_id y status=open; no inventes campos ni cambies los datos.",
        ],
        edgeCases: ["campo extra no listado", "status fuera de vocabulario", "CASO-CUS-042-1A es sintético"],
        tests: "El fixture `CASO-CUS-042-1A` satisface el schema estricto; imprime `S42-T1-A PASS` y el assert booleano pasa.",
        feedback: "S42-T1-A-E1: explica por qué required⊆keys⊆allowed modela extra=forbid y por qué un status inválido es REJECT_SCHEMA, no authz.",
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
        instruction: "S42-T1-A-E2 · Tres rutas de schema: payload válido, payload con campo extra (breach) y registro sin `status` (missing). Salidas exactas: `PASS`, `REJECT_SCHEMA`, `MISSING:status`. Missing se evalúa antes del contenido; el adverso falla por clave no permitida, no por un flag inventado.",
        hint: "Si falta `status`, devuelve MISSING:status sin mirar extras.",
        hints: [
          "Si falta `status`, devuelve MISSING:status sin mirar extras.",
          "Con payload completo: required ⊆ keys ⊆ allowed y status ∈ {open, closed}; si no, REJECT_SCHEMA.",
        ],
        edgeCases: ["falta status", "campo extra adversarial", "CASO-CUS-042-1A es sintético"],
        tests: "La tabla cubre válido/extra/sin status y produce exactamente `PASS REJECT_SCHEMA MISSING:status`.",
        feedback: "S42-T1-A-E2: missing ≠ breach — faltar status no es lo mismo que aceptar un extra; explica la diferencia al revisor.",
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
        instruction: "S42-T1-A-E3 · Fail-closed sobre tres payloads: válido → `CONTINUE`, extra no permitido → `REJECT_SCHEMA`, sin `status` → `REVIEW_BUSINESS_INVARIANT`. El starter trata missing como CONTINUE y acepta extras: corrige ambas ramas sin inventar evidencia. Salida: imprime el valor de meets_contract.",
        hint: "Una ausencia no es breach: enrútala a `REVIEW_BUSINESS_INVARIANT` antes de evaluar extras.",
        hints: [
          "Una ausencia no es breach: enrútala a `REVIEW_BUSINESS_INVARIANT` antes de evaluar extras.",
          "Con payload completo reutiliza required ⊆ keys ⊆ allowed y status en vocabulario; solo ese caso es CONTINUE.",
        ],
        edgeCases: ["falta status", "campo extra adversarial", "CASO-CUS-042-1A es sintético"],
        tests: "Fixtures válido, con extra y sin status prueban continue/breach/uncertainty en ese orden.",
        feedback: "S42-T1-A-E3: explica por qué REVIEW_BUSINESS_INVARIANT preserva auditabilidad cuando falta status y por qué el extra no se convierte en CONTINUE.",
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
        instruction: "S42-T1-B-E1 · Sobre `CASO-CUS-042-1B`, implementa `evolution_ok(change, old_reader_passes, union_tags, handled_tags)`: PASS solo con cambio aditivo, lector v1 OK y tags de unión exhaustivos. El starter marca PASS ante `rename_required` o tags incompletos (invertido). Salida exacta: `S42-T1-B PASS`.",
        hint: "PASS si change=='add_optional' y old_reader_passes y union_tags == handled_tags.",
        hints: [
          "PASS si change=='add_optional' y old_reader_passes y union_tags == handled_tags.",
          "Un rename_required o un tag sin handler no es evolución segura: VERSION_SCHEMA.",
        ],
        edgeCases: ["rename_required", "tag push sin handler", "CASO-CUS-042-1B es sintético"],
        tests: "El fixture aditivo con tags email/phone manejados imprime `S42-T1-B PASS`.",
        feedback: "S42-T1-B-E1: la evolución segura es aditiva y exhaustiva; rename o tags huérfanos rompen lectores previos.",
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
        instruction: "S42-T1-B-E2 · Tres rutas de evolución: aditiva exhaustiva → `PASS`; rename + tag huérfano → `VERSION_SCHEMA`; sin `handled_tags` → `MISSING:handled_tags`. El starter invierte el criterio de compatibilidad. Salida: imprime el valor de meets_contract.",
        hint: "Si falta handled_tags → MISSING; si add_optional y old_ok y tags==handled → PASS; si no → VERSION_SCHEMA.",
        hints: [
          "Si falta handled_tags → MISSING; si add_optional y old_ok y tags==handled → PASS; si no → VERSION_SCHEMA.",
          "El adverso (rename_required + push sin handler) debe fallar por contenido de evolución, no por schema vacío.",
        ],
        edgeCases: ["falta handled_tags", "rename_required", "tag push sin handler", "CASO-CUS-042-1B es sintético"],
        tests: "Produce exactamente `PASS VERSION_SCHEMA MISSING:handled_tags`.",
        feedback: "S42-T1-B-E2: VERSION_SCHEMA es rupture de contrato; MISSING:handled_tags es incertidumbre de migración (missing ≠ breach).",
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
        instruction: "S42-T1-B-E3 · Transfer: el canal de notificaciones de Cusco decide si puede desplegar un cambio de schema. Aditiva + lector v1 OK + tags exhaustivos → `CONTINUE`; rename/`push` sin handler → `VERSION_SCHEMA`; sin mapa `handled_tags` → `MIGRATE_CONSUMERS` (no inventes handlers). El starter trata missing y rename como CONTINUE. Salida: imprime el valor de meets_contract.",
        hint: "Sin handled_tags → MIGRATE_CONSUMERS; con datos: add_optional+old_ok+tags exhaustivos → CONTINUE; si no → VERSION_SCHEMA.",
        hints: [
          "Sin handled_tags → MIGRATE_CONSUMERS; con datos: add_optional+old_ok+tags exhaustivos → CONTINUE; si no → VERSION_SCHEMA.",
          "Missing no es breach: no lo enrutes a CONTINUE ni a VERSION_SCHEMA.",
        ],
        edgeCases: ["falta handled_tags", "rename_required", "tag push sin handler", "CASO-CUS-042-1B es sintético"],
        tests: "Produce `CONTINUE VERSION_SCHEMA MIGRATE_CONSUMERS` en ese orden.",
        feedback: "S42-T1-B-E3: MIGRATE_CONSUMERS es la rama humana cuando no hay mapa de handlers; VERSION_SCHEMA es la rupture demostrada.",
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
        instruction: "S42-T2-A-E1 · Sobre `CASO-CUS-042-2A`, repara `can_read(actor, owner, scopes)` del camino analista: allow solo si `actor == owner` y `case:read` ∈ scopes. El starter permite cross-tenant (actor ≠ owner). Salida exacta: `S42-T2-A PASS`.",
        hint: "return actor == owner and 'case:read' in scopes (no uses admin aquí).",
        hints: [
          "return actor == owner and 'case:read' in scopes (no uses admin aquí).",
          "El fixture válido es user-a sobre su propio caso; user-a sobre user-b debe ser DENY en E2.",
        ],
        edgeCases: ["cross-tenant user-a→user-b", "falta scope case:read", "CASO-CUS-042-2A es sintético"],
        tests: "can_read(user-a, user-a, {case:read}) es True e imprime `S42-T2-A PASS`.",
        feedback: "S42-T2-A-E1: authn del actor no basta; el resource binding actor==owner + scope cierra el cross-tenant.",
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
        instruction: "S42-T2-A-E2 · Tres rutas de lectura: mismo tenant + `case:read` → `PASS`; actor sobre caso ajeno → `DENY_CROSS_TENANT`; sin scopes en el registro → `MISSING:roles`. El starter abre cross-tenant y no exige el scope. Salida: imprime el valor de meets_contract.",
        hint: "Si falta `roles`, MISSING:roles; si actor!=owner o falta case:read → DENY; si no → PASS.",
        hints: [
          "Si falta `roles`, MISSING:roles; si actor!=owner o falta case:read → DENY; si no → PASS.",
          "Missing ≠ breach: no inventes scopes vacíos como allow.",
        ],
        edgeCases: ["falta roles", "cross-tenant user-a→user-b", "CASO-CUS-042-2A es sintético"],
        tests: "Produce exactamente `PASS DENY_CROSS_TENANT MISSING:roles`.",
        feedback: "S42-T2-A-E2: el DENY es por resource binding fallido; el MISSING es incertidumbre de permiso, no lectura cruzada probada.",
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
        instruction: "S42-T2-A-E3 · Transfer: la mesa de soporte de Cusco enruta tres lecturas de ticket. `user-a` sobre su caso con `case:read` → `CONTINUE`; `user-a` sobre el caso de `user-b` → `DENY_CROSS_TENANT` (authn OK, authz falla); sin `roles` en el token → `VERIFY_RESOURCE_OWNER`. El starter trata missing y cross-tenant como CONTINUE. Salida: imprime el valor de meets_contract.",
        hint: "Sin roles → VERIFY_RESOURCE_OWNER; con datos: owner+case:read → CONTINUE; si no → DENY_CROSS_TENANT.",
        hints: [
          "Sin roles → VERIFY_RESOURCE_OWNER; con datos: owner+case:read → CONTINUE; si no → DENY_CROSS_TENANT.",
          "Missing no es breach: no lo conviertas en CONTINUE silencioso.",
        ],
        edgeCases: ["falta roles", "cross-tenant user-a→user-b", "CASO-CUS-042-2A es sintético"],
        tests: "Produce `CONTINUE DENY_CROSS_TENANT VERIFY_RESOURCE_OWNER` en ese orden.",
        feedback: "S42-T2-A-E3: VERIFY_RESOURCE_OWNER es la rama humana cuando no hay matriz de permisos; DENY es la prueba de cross-tenant.",
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
        instruction: "S42-T2-B-E1 · Implementa `allow(granted, needed, service_id, route_declared)` para el worker de reportes de Cusco: True solo si `needed ∈ granted`, `service_id` empieza por `svc-` y la ruta está en catálogo. El starter deniega cuando el scope *sí* está granted (cuerpo invertido). No toques los datos del fixture. Salida exacta: `S42-T2-B PASS`.",
        hint: "return needed in granted and service_id.startswith('svc-') and route_declared",
        hints: [
          "return needed in granted and service_id.startswith('svc-') and route_declared",
          "Un principal `shared-admin` no es identidad de servicio: en E2 debe caer en DENY_SCOPE junto con prod:write.",
        ],
        edgeCases: ["scope prod:write no granted", "service_id shared-admin", "falta route_declared", "CASO-CUS-042-2B es sintético"],
        tests: "allow({report:prepare}, report:prepare, svc-reporter, True) es True e imprime `S42-T2-B PASS`.",
        feedback: "S42-T2-B-E1: deny-by-default exige las tres condiciones a la vez; grant de report no autoriza prod:write ni un principal genérico.",
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
        instruction: "S42-T2-B-E2 · Tres filas de la matriz de scopes: (1) `svc-reporter` + `report:prepare` + ruta OK → `PASS`; (2) `prod:write` con grant de report y `shared-admin` → `DENY_SCOPE`; (3) sin `route_declared` → `MISSING:route_declared`. El starter invierte el allow y trata el adverso como PASS. Salida: imprime el valor de meets_contract.",
        hint: "Si falta route_declared → MISSING; si no, allow solo con scope granted + svc-* + ruta True.",
        hints: [
          "Si falta route_declared → MISSING; si no, allow solo con scope granted + svc-* + ruta True.",
          "Missing ≠ breach: no inventes route_declared=True para «arreglar» la fila incompleta.",
        ],
        edgeCases: ["falta route_declared", "prod:write + shared-admin", "CASO-CUS-042-2B es sintético"],
        tests: "Produce exactamente `PASS DENY_SCOPE MISSING:route_declared`.",
        feedback: "S42-T2-B-E2: DENY_SCOPE es privilege real (scope/identidad/ruta); MISSING es catálogo incompleto — no lo confundes con allow.",
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
        instruction: "S42-T2-B-E3 · Fail-closed de scopes: grant estrecho → `CONTINUE`, prod:write/shared-admin → `DENY_SCOPE`, sin ruta en catálogo → `REQUEST_NARROW_GRANT`. El starter trata missing como CONTINUE y acepta el adverso: corrige ambas ramas. Salida: imprime el valor de meets_contract.",
        hint: "Sin route_declared → REQUEST_NARROW_GRANT; con datos: scope+svc+ruta → CONTINUE; si no → DENY_SCOPE.",
        hints: [
          "Sin route_declared → REQUEST_NARROW_GRANT; con datos: scope+svc+ruta → CONTINUE; si no → DENY_SCOPE.",
          "REQUEST_NARROW_GRANT es la rama humana de catálogo incompleto; no es un DENY de privilege.",
        ],
        edgeCases: ["falta route_declared", "prod:write no granted", "CASO-CUS-042-2B es sintético"],
        tests: "Produce `CONTINUE DENY_SCOPE REQUEST_NARROW_GRANT` en ese orden.",
        feedback: "S42-T2-B-E3: el transfer cierra la matriz — allow real, denegación explícita y grant estrecho pendiente cuando falta la ruta.",
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
        instruction: "S42-T3-A-E1 · Implementa `trusted(size, max_bytes, host, allowed_hosts, path, root)` para el adjunto de `CASO-CUS-042-3A`: True solo si size≤max, host∈allowlist y path bajo `root/`. El starter aprueba oversize o path `/etc` e ignora la allowlist. Corrige el cuerpo de la función. Salida exacta: `S42-T3-A PASS`.",
        hint: "return size <= max_bytes and host in allowed_hosts and path.startswith(root + '/')",
        hints: [
          "return size <= max_bytes and host in allowed_hosts and path.startswith(root + '/')",
          "El defecto no mira la allowlist de hosts: un SSRF a 169.254… pasaría si solo miras `/etc`.",
        ],
        edgeCases: ["falta root", "host metadata cloud", "path /etc/passwd", "CASO-CUS-042-3A es sintético"],
        tests: "trusted(2048, 4096, docs.local, {docs.local}, /safe/reports/a.txt, /safe/reports) es True e imprime `S42-T3-A PASS`.",
        feedback: "S42-T3-A-E1: las tres puertas (size, host, path) son conjuntas; falla una y es REJECT_UNTRUSTED_INPUT.",
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
        instruction: "S42-T3-A-E2 · Tres rutas: upload confinado (PASS), adverso con oversize + host 169.254.169.254 + `/etc/passwd` (REJECT_UNTRUSTED_INPUT), sin `root` (MISSING:root). El starter invierte el predicado y no usa la allowlist: corrige la decisión de dominio. Salida: imprime el valor de meets_contract.",
        hint: "Primero missing de `root`; luego size + host ∈ allowlist + path bajo root/.",
        hints: [
          "Primero missing de `root`; luego size + host ∈ allowlist + path bajo root/.",
          "El adverso debe fallar por contenido (bytes, host y path), no solo porque el path empiece por /etc.",
        ],
        edgeCases: ["falta root", "SSRF metadata IP", "path traversal a /etc", "CASO-CUS-042-3A es sintético"],
        tests: "Produce exactamente `PASS REJECT_UNTRUSTED_INPUT MISSING:root`.",
        feedback: "S42-T3-A-E2: el host 169.254.169.254 es el clásico SSRF a metadata; allowlist lo corta aunque el path parezca inocente.",
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
        instruction: "S42-T3-A-E3 · Transfer: el worker de adjuntos de Cusco decide si guarda un archivo. Cuerpo ≤max, host en allowlist y path bajo `/safe/reports/` → `CONTINUE`; oversize + host `169.254.169.254` + path `/etc/passwd` → `REJECT_UNTRUSTED_INPUT`; sin `root` en el registro → `SECURITY_REVIEW` (no inventes root). El starter trata missing como CONTINUE y tiene el predicado invertido. Salida: imprime el valor de meets_contract.",
        hint: "Falta root → SECURITY_REVIEW; luego las tres puertas size/host/path.",
        hints: [
          "Falta root → SECURITY_REVIEW; luego las tres puertas size/host/path.",
          "Solo el fixture confinado devuelve CONTINUE; el de 169.254… y /etc/passwd es REJECT.",
        ],
        edgeCases: ["falta root", "SSRF metadata IP", "path /etc/passwd", "CASO-CUS-042-3A es sintético"],
        tests: "Produce `CONTINUE REJECT_UNTRUSTED_INPUT SECURITY_REVIEW` en ese orden.",
        feedback: "S42-T3-A-E3: SECURITY_REVIEW es la rama humana cuando no hay raíz de confinamiento; no inventes un root por defecto.",
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
        instruction: "S42-T3-B-E1 · Implementa `promote_ok(secret_in_repo, secret_in_log, rotation_tested, pinned, critical_cves)` para el pipeline de Cusco: True solo sin secreto en repo/log, rotación ensayada, deps fijadas y 0 CVE críticas. El starter aprueba si *hay* secreto o deps sin pin (cuerpo incompleto). Salida exacta: `S42-T3-B PASS`.",
        hint: "return (not secret_in_repo) and (not secret_in_log) and rotation_tested and pinned and critical_cves == 0",
        hints: [
          "return (not secret_in_repo) and (not secret_in_log) and rotation_tested and pinned and critical_cves == 0",
          "El defecto no mira rotation_tested ni critical_cves: un promote «limpio» de secretos aún puede ser inseguro.",
        ],
        edgeCases: ["secret_in_repo", "deps unpinned", "critical_cves>0", "CASO-CUS-042-3B es sintético"],
        tests: "promote_ok(False, False, True, True, 0) es True e imprime `S42-T3-B PASS`.",
        feedback: "S42-T3-B-E1: promote fail-closed es conjunción de cinco controles; un solo hallazgo (secreto o CVE) bloquea.",
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
        instruction: "S42-T3-B-E2 · Tres rutas de promote: limpio → `PASS`; secreto en repo + unpinned + 2 CVE → `ROTATE_AND_BLOCK`; sin campo `critical_cves` → `MISSING:critical_cves`. El starter invierte el criterio y no exige rotación ni CVE==0. Salida: imprime el valor de meets_contract.",
        hint: "Si falta critical_cves → MISSING; si no, las cinco condiciones de promote limpio → PASS; si no → ROTATE_AND_BLOCK.",
        hints: [
          "Si falta critical_cves → MISSING; si no, las cinco condiciones de promote limpio → PASS; si no → ROTATE_AND_BLOCK.",
          "No inventes critical_cves=0 cuando el campo no viene: missing ≠ «cero riesgos».",
        ],
        edgeCases: ["falta critical_cves", "secret_in_repo True", "critical_cves=2", "CASO-CUS-042-3B es sintético"],
        tests: "Produce exactamente `PASS ROTATE_AND_BLOCK MISSING:critical_cves`.",
        feedback: "S42-T3-B-E2: ROTATE_AND_BLOCK es hallazgo demostrable; MISSING:critical_cves es inventario incompleto (ASSESS en E3), no un PASS optimista.",
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
        instruction: "S42-T3-B-E3 · Fail-closed de promote: limpio → `CONTINUE`, secreto/CVE → `ROTATE_AND_BLOCK`, sin inventario CVE → `ASSESS_DEPENDENCY_RISK`. El starter trata missing como CONTINUE y aprueba el adverso: corrige ambas ramas. Salida: imprime el valor de meets_contract.",
        hint: "Sin critical_cves → ASSESS_DEPENDENCY_RISK; con datos: promote limpio → CONTINUE; si no → ROTATE_AND_BLOCK.",
        hints: [
          "Sin critical_cves → ASSESS_DEPENDENCY_RISK; con datos: promote limpio → CONTINUE; si no → ROTATE_AND_BLOCK.",
          "ASSESS es la rama humana cuando no hay scan; no la conviertas en CONTINUE ni en ROTATE sin evidencia.",
        ],
        edgeCases: ["falta critical_cves", "secret_in_repo + CVE abiertas", "CASO-CUS-042-3B es sintético"],
        tests: "Produce `CONTINUE ROTATE_AND_BLOCK ASSESS_DEPENDENCY_RISK` en ese orden.",
        feedback: "S42-T3-B-E3: rotar y bloquear es la respuesta a un hallazgo; ASSESS es la respuesta a no tener inventario — no las mezcles.",
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
        instruction: "S42-T4-A-E1 · Implementa `inventory_ok(collected, needed, purpose, days, max_days)` para el tablero de estado de Cusco: True solo si collected ⊆ needed, purpose es `status-report` y days ≤ max_days. El starter aprueba over-collection o retención excesiva (cuerpo invertido). Salida exacta: `S42-T4-A PASS`.",
        hint: "return collected <= needed and purpose == 'status-report' and days <= max_days",
        hints: [
          "return collected <= needed and purpose == 'status-report' and days <= max_days",
          "En E2, full_name + purpose maybe-useful + 3650 días es el adverso de minimización.",
        ],
        edgeCases: ["full_name de más", "purpose maybe-useful", "retención 3650", "CASO-CUS-042-4A es sintético"],
        tests: "inventory_ok({case_id,region}, {case_id,region}, status-report, 30, 30) es True e imprime `S42-T4-A PASS`.",
        feedback: "S42-T4-A-E1: minimización es inclusion de conjuntos + purpose + techo de retención; no basta «parecer pocos campos».",
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
        instruction: "S42-T4-A-E2 · Tres inventarios: mínimo 30d → `PASS`; full_name + maybe-useful + 3650d → `MINIMIZE_AND_EXPIRE`; sin techo `max_retention_days` → `MISSING:max_retention_days`. El starter invierte el criterio de minimización. Salida: imprime el valor de meets_contract.",
        hint: "Si falta max_retention_days → MISSING; si no, collected⊆needed + purpose + techo → PASS; si no → MINIMIZE_AND_EXPIRE.",
        hints: [
          "Si falta max_retention_days → MISSING; si no, collected⊆needed + purpose + techo → PASS; si no → MINIMIZE_AND_EXPIRE.",
          "Sin techo no inventes 30: es incertidumbre de privacidad, no un PASS.",
        ],
        edgeCases: ["falta max_retention_days", "full_name + 3650 días", "CASO-CUS-042-4A es sintético"],
        tests: "Produce exactamente `PASS MINIMIZE_AND_EXPIRE MISSING:max_retention_days`.",
        feedback: "S42-T4-A-E2: MINIMIZE_AND_EXPIRE es over-collection o retención abusiva; MISSING:max es falta de política de techo.",
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
        instruction: "S42-T4-A-E3 · Fail-closed de privacidad: inventario mínimo → `CONTINUE`, over-collection → `MINIMIZE_AND_EXPIRE`, sin techo de retención → `PRIVACY_OWNER_REVIEW`. El starter trata missing como CONTINUE y acepta el adverso. Salida: imprime el valor de meets_contract.",
        hint: "Sin max_retention_days → PRIVACY_OWNER_REVIEW; con datos: minimización OK → CONTINUE; si no → MINIMIZE_AND_EXPIRE.",
        hints: [
          "Sin max_retention_days → PRIVACY_OWNER_REVIEW; con datos: minimización OK → CONTINUE; si no → MINIMIZE_AND_EXPIRE.",
          "PRIVACY_OWNER_REVIEW es dueño de privacidad, no un soft-allow del payload.",
        ],
        edgeCases: ["falta max_retention_days", "full_name + purpose basura", "CASO-CUS-042-4A es sintético"],
        tests: "Produce `CONTINUE MINIMIZE_AND_EXPIRE PRIVACY_OWNER_REVIEW` en ese orden.",
        feedback: "S42-T4-A-E3: el transfer separa violación demostrable (MINIMIZE) de política incompleta (OWNER_REVIEW).",
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
        instruction: "S42-T4-B-E1 · Implementa `purge_ok(audit, pii, deleted, derived_deleted, key_separate)` para el cierre de ticket en Cusco: True solo si audit ∩ PII = ∅, primario y derivado borrados y llave de reidentificación separada. El starter aprueba intersección audit∩PII o derivado vivo (cuerpo invertido). Salida exacta: `S42-T4-B PASS`.",
        hint: "return audit.isdisjoint(pii) and deleted and derived_deleted and key_separate",
        hints: [
          "return audit.isdisjoint(pii) and deleted and derived_deleted and key_separate",
          "En E2, email en audit + export vivo es el adverso clásico de purga incompleta.",
        ],
        edgeCases: ["email en audit", "derived_deleted False", "key_separate False", "CASO-CUS-042-4B es sintético"],
        tests: "purge_ok({actor,action,at,case_token}, {email,full_name}, True, True, True) es True e imprime `S42-T4-B PASS`.",
        feedback: "S42-T4-B-E1: soft-delete del primario no basta; audit limpio + derivados + llave separada cierran el ciclo.",
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
        instruction: "S42-T4-B-E2 · Tres cierres: purga completa → `PASS`; email en audit + derivado vivo → `PURGE_DERIVATIVES`; sin flag `key_separate` → `MISSING:key_separate`. El starter invierte el criterio de purga. Salida: imprime el valor de meets_contract.",
        hint: "Si falta key_separate → MISSING; si no, audit∩PII vacío + ambos borrados + llave → PASS; si no → PURGE_DERIVATIVES.",
        hints: [
          "Si falta key_separate → MISSING; si no, audit∩PII vacío + ambos borrados + llave → PASS; si no → PURGE_DERIVATIVES.",
          "Missing de key_separate no es «llave separada por defecto»: es incertidumbre de diseño.",
        ],
        edgeCases: ["falta key_separate", "email en audit", "export derivado vivo", "CASO-CUS-042-4B es sintético"],
        tests: "Produce exactamente `PASS PURGE_DERIVATIVES MISSING:key_separate`.",
        feedback: "S42-T4-B-E2: PURGE es reaparición o derivado vivo; MISSING:key es alcance de borrado no declarado.",
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
        instruction: "S42-T4-B-E3 · Fail-closed de borrado: purga completa → `CONTINUE`, leak/derivado vivo → `PURGE_DERIVATIVES`, sin `key_separate` → `VERIFY_DELETION_SCOPE`. El starter trata missing como CONTINUE y aprueba el adverso. Salida: imprime el valor de meets_contract.",
        hint: "Sin key_separate → VERIFY_DELETION_SCOPE; con datos: ciclo completo → CONTINUE; si no → PURGE_DERIVATIVES.",
        hints: [
          "Sin key_separate → VERIFY_DELETION_SCOPE; con datos: ciclo completo → CONTINUE; si no → PURGE_DERIVATIVES.",
          "VERIFY_DELETION_SCOPE es revisión humana del alcance; no es un soft-delete silencioso.",
        ],
        edgeCases: ["falta key_separate", "email en audit + export vivo", "CASO-CUS-042-4B es sintético"],
        tests: "Produce `CONTINUE PURGE_DERIVATIVES VERIFY_DELETION_SCOPE` en ese orden.",
        feedback: "S42-T4-B-E3: cierra el ciclo de vida — CONTINUE solo con evidencia de no-reaparición; el resto es purga o verificación humana.",
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
      "Cubrir rutas normal (CONTINUE), breach (REJECT/DENY) e incertidumbre de purga (derivado vivo) con salidas exactas.",
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
      "Registra riesgo residual, responsable, rollback y limitaciones.",
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
    portfolioNote: "Evidencia de CP-N4-A: el starter calcula READY desde asserts reales (extra→REJECT_SCHEMA, cross-tenant→DENY, SSRF y path→REJECT, email no reaparece, purga limpia). En tu repo amplía con matriz de scopes por `svc-*`, rotación de secretos, rollback documentado y riesgo residual — no entregues un checklist de booleans a mano.",
    rubric: [
      { criterion: "Correctitud del contrato y gate CP-N4-A", weight: "25%" },
      { criterion: "Pruebas normal/breach/uncertain y recuperación", weight: "20%" },
      { criterion: "Seguridad, privacidad y least privilege", weight: "15%" },
      { criterion: "Reproducibilidad, lineage y evidencia", weight: "15%" },
      { criterion: "Operación: SLO, observabilidad y rollback", weight: "15%" },
      { criterion: "Comunicación de trade-offs y límites", weight: "10%" },
    ],
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
        explanation: "Authn ≠ authz: identidad correcta sin pertenencia del recurso → DENY con audit trail; no se convierte breach en éxito.",
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
        note: "Riesgos y controles de APIs",
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
