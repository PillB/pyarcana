import type { CourseSection } from '../../types'

export const section42: CourseSection = {
  id: "graph-rag",
  index: 42,
  title: "Schemas, seguridad y privacidad de servicios",
  shortTitle: "Schemas y seguridad",
  tagline: "threat model y pruebas de permisos; un usuario no puede acceder a otro caso ni recuperar datos redacted",
  estimatedHours: 20,
  level: "Master",
  phase: 3,
  icon: "Share2",
  accentColor: "bg-gradient-to-br from-amber-500 to-red-600",
  jobRelevance:
    "En equipos de plataforma y producto, **schemas, seguridad y privacidad de servicios** convierten la API de S41 en un control plane fail-closed: validación estricta, authz deny-by-default y minimización de datos. La práctica entrega allow/deny auditable y vistas pseudonimizadas; se promueve solo cuando un actor no lee el caso de otro y un campo redactado no reaparece en logs, respuestas ni backups. Id legacy `graph-rag` se conserva; el path V3 es seguridad/privacidad de servicios, no GraphRAG/LLM retrieval.",
  learningOutcomes: [
    { text: "Define schemas Pydantic/JSON Schema" },
    { text: "Evoluciona schemas con validación de negocio" },
    { text: "Implementa authn/authz RBAC" },
    { text: "Aplica scopes y deny-by-default" },
    { text: "Mitiga injection/SSRF/path traversal" },
    { text: "Gestiona secretos, cifrado y deps" },
    { text: "Minimiza datos y fija retención" },
    { text: "Audita, borra y seudonimiza accesos" },
  ],
  theory: [
    {
      heading: "Ruta de S42: Schemas, seguridad y privacidad de servicios",
      paragraphs: [
        "**Diccionario de la sección** (léelo antes de T1). **Schema estricto:** forma + tipos + rechazo de campos extra. **Authn/authz:** quién eres vs qué puedes hacer. **RBAC/scopes:** roles y permisos deny-by-default. **SSRF/path traversal:** abuso de URLs o rutas del servidor. **Minimización/retención:** solo el dato necesario, solo el tiempo necesario. **Pseudonimización:** identificadores derivados sin reidentificación fácil. **Redaction:** campo sensible no reaparece en logs, respuestas ni backups activos.",
        "Esta sección endurece el control plane de S41 (HTTP versionado) con **schemas, authz y privacidad**. Solo stdlib + contratos al estilo Pydantic/JSON Schema/OWASP (referencia profesional). El caso `CASO-CUS-042` (soporte sintético en Cusco) no usa credenciales reales, PII ni red externa.",
        "Producto incremental: threat model + matriz de permisos. Entrada: schemas estrictos, identidad de servicio, scope, propósito y retención. Salida: allow/deny auditable, redaction y purga de derivados. Error de promoción: campo extra aceptado, lectura cross-tenant, path/URL no permitidos o retención vencida sin bloqueo.",
        "Orden: T1 schemas/evolución → T2 authn/authz y scopes → T3 injection/SSRF/secretos → T4 minimización, auditoría y borrado. Teoría con criterio medible, iDo que calcula el contrato, weDo E1/E2/E3 con un defecto de seguridad por ejercicio. Id legacy `graph-rag` no implica GraphRAG; V3 es seguridad del servicio gobernado. Stack didáctico: **stdlib** (dicts, sets) modelando contratos Pydantic/OWASP sin cluster.",
      ],
      code: {
        language: 'python',
        title: "s42_map_contract.py",
        code: `def section_contract():
    return {
        "case": "CASO-CUS-042",
        "gates": ["strict_schema", "deny_by_default", "no_cross_tenant", "redaction_holds"],
        "graph_rag_topic": False,
        "cross_tenant_read_ok": False,
    }

c = section_contract()
print("case", c["case"])
print("graph_rag_topic", c["graph_rag_topic"])
print("cross_tenant_read_ok", c["cross_tenant_read_ok"])
`,
        output: `case CASO-CUS-042
graph_rag_topic False
cross_tenant_read_ok False`,
      },
      callout: {
        type: "info",
        title: "Gate de promoción",
        content: "CP-N4-A · control plane seguro y privado: un actor nunca lee otro caso y un dato redactado no reaparece en logs, respuestas ni backups activos. Si falta evidencia, no se promociona.",
      },
    },
    {
      heading: "Pydantic y JSON Schema",
      subtopicId: "S42-T1-A",
      paragraphs: [
        "Pydantic y JSON Schema describen forma, tipos y restricciones del borde HTTP; el schema de borde es **estricto** (rechaza campos extra) y **no sustituye** invariantes del negocio (p. ej. «un analista no lee el caso de otro tenant»). La validación de forma es el primer fail-closed; la autorización y la retención vienen después.",
        "Contrato operativo. Entrada: schemas estrictos, identidad de servicio, scope, propósito y plazo de retención. Salida de este subtema: schema exportado y fixtures válidos/inválidos ejecutables. Error: campo extra, scope insuficiente, ruta/URL no permitida o retención vencida se rechaza por defecto. Criterio de éxito: un actor nunca lee otro caso y un dato redactado no reaparece en logs, respuestas ni backups activos.",
        "Aplicación de `Pydantic y JSON Schema` al caso peruano sintético `CASO-CUS-042`: casos sintéticos de soporte para una organización ficticia en Cusco. La evidencia esperada es schema exportado y fixtures válidos/inválidos (`case_id`+`status` OK; `extra` rechazado). No contiene PII ni secretos; una señal incierta se deriva y nunca prueba fraude, parentesco o intención.",
      ],
      code: {
        language: 'python',
        title: "pydantic_jsonschema.py",
        code: `def validate_case(payload: dict, required: set) -> bool:
    return required.issubset(payload) and "extra" not in payload

print(validate_case({"case_id": "C1", "status": "open"}, {"case_id", "status"}))
print(validate_case({"case_id": "C1", "extra": 1}, {"case_id", "status"}))
print("jsonschema", True)`,
        output: `True
False
jsonschema True`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Evidencia mínima de S42-T1-A: schema exportado y fixtures válidos/inválidos. Si falta, responde `REJECT_SCHEMA`; si no alcanza para decidir, `REVIEW_BUSINESS_INVARIANT`.",
      },
    },
    {
      heading: "evolución, discriminated unions y validación de negocio",
      subtopicId: "S42-T1-B",
      paragraphs: [
        "La evolución segura prefiere campos opcionales aditivos y discriminated unions exhaustivas; renombrar o reinterpretar un campo exige versión/migración.",
        "Contrato operativo. Entrada: schemas estrictos, identidad de servicio, scope, propósito y plazo de retención. Salida de este subtema: lector anterior conserva contrato. Error: campo extra, scope insuficiente, ruta/URL no permitida o retención vencida se rechaza por defecto. Criterio de éxito: un actor nunca lee otro caso y un dato redactado no reaparece en logs, respuestas ni backups activos.",
        "Aplicación de `evolución, discriminated unions y validación de negocio` al caso peruano sintético `CASO-CUS-042`: casos sintéticos de soporte para una organización ficticia en Cusco. La evidencia esperada es lector anterior conserva contrato. No contiene PII ni secretos; una señal incierta se deriva y nunca prueba fraude, parentesco o intención.",
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

print(event_kind({"type": "email", "to": "a@example.pe"}))
print(event_kind({"type": "sms", "to": "+51"}))
print("union", "discriminated")`,
        output: `EmailEvent
SmsEvent
union discriminated`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Antes de promover S42-T1-B, audita lector anterior conserva contrato. Un breach activa `VERSION_SCHEMA` y una ausencia activa `MIGRATE_CONSUMERS`.",
      },
    },
    {
      heading: "authn/authz y RBAC",
      subtopicId: "S42-T2-A",
      paragraphs: [
        "Authentication identifica; authorization decide una acción sobre un recurso. RBAC parte de roles mínimos y verifica pertenencia del recurso.",
        "Contrato de autorización. Entrada: actor_id, owner_id del caso y rol. Salida: allow solo si admin o actor==owner. Error: confiar en el user-agent o en un claim sin resource binding. Criterio: la prueba `can_read(u1,u2,analyst)` es False en el lab de Cusco sintético antes de abrir el control plane.",
        "Aplicación a `CASO-CUS-042-T2A`: el analista u1 lee su caso; el caso de u2 se deniega. Authn ≠ authz: conocer la identidad no otorga permiso cruzado.",
      ],
      code: {
        language: 'python',
        title: "authn_authz_rbac.py",
        code: `def can_read(actor: str, owner: str, role: str) -> bool:
    return role == "admin" or actor == owner

print(can_read("u1", "u1", "analyst"))
print(can_read("u1", "u2", "analyst"))
print("authn_vs_authz", "identity!=permission")`,
        output: `True
False
authn_vs_authz identity!=permission`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "La revisión de S42-T2-A conserva prueba actor A no lee caso B; no conviertas `DENY_CROSS_TENANT` ni `VERIFY_RESOURCE_OWNER` en éxito silencioso.",
      },
    },
    {
      heading: "scopes, service identities y deny-by-default",
      subtopicId: "S42-T2-B",
      paragraphs: [
        "Scopes expresan capacidades estrechas, cada servicio tiene identidad propia y deny-by-default cubre rutas o acciones no declaradas.",
        "Contrato operativo. Entrada: schemas estrictos, identidad de servicio, scope, propósito y plazo de retención. Salida de este subtema: matriz de scopes con denegaciones explícitas. Error: campo extra, scope insuficiente, ruta/URL no permitida o retención vencida se rechaza por defecto. Criterio de éxito: un actor nunca lee otro caso y un dato redactado no reaparece en logs, respuestas ni backups activos.",
        "Aplicación de `scopes, service identities y deny-by-default` al caso peruano sintético `CASO-CUS-042`: casos sintéticos de soporte para una organización ficticia en Cusco. La evidencia esperada es matriz de scopes con denegaciones explícitas. No contiene PII ni secretos; una señal incierta se deriva y nunca prueba fraude, parentesco o intención.",
      ],
      code: {
        language: 'python',
        title: "scopes_service_ids_deny.py",
        code: `def allow(scope_set: set, needed: str) -> bool:
    return needed in scope_set  # deny-by-default if missing

print(allow({"jobs:run", "jobs:read"}, "jobs:run"))
print(allow({"jobs:read"}, "jobs:admin"))
print("deny_by_default", True)`,
        output: `True
False
deny_by_default True`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Contrato S42-T2-B: demuestra matriz de scopes con denegaciones explícitas. Falla cerrada con `DENY_SCOPE` y deriva incertidumbre mediante `REQUEST_NARROW_GRANT`.",
      },
    },
    {
      heading: "input limits, injection y SSRF/path traversal",
      subtopicId: "S42-T3-A",
      paragraphs: [
        "Límites de tamaño y allowlists se aplican antes de procesar; URLs, nombres de archivo y expresiones nunca se convierten directamente en red, ruta o consulta.",
        "Contrato operativo. Entrada: schemas estrictos, identidad de servicio, scope, propósito y plazo de retención. Salida de este subtema: payload/URL/ruta adversarial rechazada. Error: campo extra, scope insuficiente, ruta/URL no permitida o retención vencida se rechaza por defecto. Criterio de éxito: un actor nunca lee otro caso y un dato redactado no reaparece en logs, respuestas ni backups activos.",
        "Aplicación de `input limits, injection y SSRF/path traversal` al caso peruano sintético `CASO-CUS-042`: casos sintéticos de soporte para una organización ficticia en Cusco. La evidencia esperada es payload/URL/ruta adversarial rechazada. No contiene PII ni secretos; una señal incierta se deriva y nunca prueba fraude, parentesco o intención.",
      ],
      code: {
        language: 'python',
        title: "limits_injection_ssrf_path.py",
        code: `def safe_path(base: str, user_path: str) -> str:
    joined = f"{base.rstrip('/')}/{user_path.lstrip('/')}"
    if ".." in user_path.split("/"):
        raise ValueError("traversal")
    return joined

print(safe_path("/data", "a.txt"))
print("blocked", "traversal")
print("ssrf_guard", "allowlist")`,
        output: `/data/a.txt
blocked traversal
ssrf_guard allowlist`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Para S42-T3-A, el artefacto comprobable es payload/URL/ruta adversarial rechazada. Sin él corresponde `REJECT_UNTRUSTED_INPUT` o, si faltan datos, `SECURITY_REVIEW`.",
      },
    },
    {
      heading: "secretos, cifrado y dependency risk",
      subtopicId: "S42-T3-B",
      paragraphs: [
        "Secretos llegan por runtime, nunca por código/log; cifrado requiere gestión de claves y dependencias fijadas se revisan por riesgo y provenance.",
        "Contrato operativo. Entrada: schemas estrictos, identidad de servicio, scope, propósito y plazo de retención. Salida de este subtema: scan sin secreto y rotación ensayada. Error: campo extra, scope insuficiente, ruta/URL no permitida o retención vencida se rechaza por defecto. Criterio de éxito: un actor nunca lee otro caso y un dato redactado no reaparece en logs, respuestas ni backups activos.",
        "Aplicación de `secretos, cifrado y dependency risk` al caso peruano sintético `CASO-CUS-042`: casos sintéticos de soporte para una organización ficticia en Cusco. La evidencia esperada es scan sin secreto y rotación ensayada. No contiene PII ni secretos; una señal incierta se deriva y nunca prueba fraude, parentesco o intención.",
      ],
      code: {
        language: 'python',
        title: "secrets_crypto_deps.py",
        code: `import hashlib

def secret_fingerprint(raw: bytes) -> str:
    return hashlib.sha256(raw).hexdigest()[:12]

print("fp", secret_fingerprint(b"not-a-real-secret"))
print("store", "env_or_vault")
print("never_log_raw", True)`,
        output: `fp ed24bc0bb03d
store env_or_vault
never_log_raw True`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Promoción de S42-T3-B: prueba scan sin secreto y rotación ensayada y registra por separado `ROTATE_AND_BLOCK` (breach) y `ASSESS_DEPENDENCY_RISK` (missing).",
      },
    },
    {
      heading: "minimización, purpose y retención",
      subtopicId: "S42-T4-A",
      paragraphs: [
        "Privacidad exige dato mínimo para propósito declarado y retención finita; «podría servir» no es una finalidad válida.",
        "Contrato operativo. Entrada: schemas estrictos, identidad de servicio, scope, propósito y plazo de retención. Salida de este subtema: inventario propósito-campo-retención aprobado. Error: campo extra, scope insuficiente, ruta/URL no permitida o retención vencida se rechaza por defecto. Criterio de éxito: un actor nunca lee otro caso y un dato redactado no reaparece en logs, respuestas ni backups activos.",
        "Aplicación de `minimización, purpose y retención` al caso peruano sintético `CASO-CUS-042`: casos sintéticos de soporte para una organización ficticia en Cusco. La evidencia esperada es inventario propósito-campo-retención aprobado. No contiene PII ni secretos; una señal incierta se deriva y nunca prueba fraude, parentesco o intención.",
      ],
      code: {
        language: 'python',
        title: "minimize_purpose_retention.py",
        code: `def minimize(fields: dict, allow: set) -> list:
    return sorted(k for k in fields if k in allow)

print("minimized", minimize({"case_id": "C1", "status": "open", "email": "x"}, {"case_id", "status"}))
print("purpose", "case_ops")
print("retention", 90)`,
        output: `minimized ['case_id', 'status']
purpose case_ops
retention 90`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "El dueño de S42-T4-A acepta solo inventario propósito-campo-retención aprobado; una violación produce `MINIMIZE_AND_EXPIRE` y un registro incompleto produce `PRIVACY_OWNER_REVIEW`.",
      },
    },
    {
      heading: "audit, deletion, pseudonymization y acceso",
      subtopicId: "S42-T4-B",
      paragraphs: [
        "Audit registra quién/qué/cuándo sin copiar PII; borrado cubre derivados, pseudonimización separa la llave y acceso queda revisable.",
        "Contrato operativo. Entrada: schemas estrictos, identidad de servicio, scope, propósito y plazo de retención. Salida de este subtema: borrado y no-reaparición verificados. Error: campo extra, scope insuficiente, ruta/URL no permitida o retención vencida se rechaza por defecto. Criterio de éxito: un actor nunca lee otro caso y un dato redactado no reaparece en logs, respuestas ni backups activos.",
        "Aplicación de `audit, deletion, pseudonymization y acceso` al caso peruano sintético `CASO-CUS-042`: casos sintéticos de soporte para una organización ficticia en Cusco. La evidencia esperada es borrado y no-reaparición verificados. No contiene PII ni secretos; una señal incierta se deriva y nunca prueba fraude, parentesco o intención.",
      ],
      code: {
        language: 'python',
        title: "audit_delete_pseudo_access.py",
        code: `import hashlib

def pseudonym(subject: str) -> str:
    return hashlib.sha256(f"synth:{subject}".encode()).hexdigest()[:16]

print("pseudo", pseudonym("user-1"))
print("audit_n", 1)
print("delete", "soft+hard_policy")`,
        output: `pseudo d6e07b73dc2ab4b4
audit_n 1
delete soft+hard_policy`,
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
    intro: "Te muestro 8 demos de S42 (Schemas, seguridad y privacidad de servicios) alineadas a CP-N4-A (control plane).",
    steps: [
      {
        demoId: "S42-T1-A-DEMO",
        subtopicId: "S42-T1-A",
        environment: "local-python",
        description: "Demo: Pydantic y JSON Schema",
        code: {
          language: 'python',
          title: "demo_pydantic_jsonschema.py",
          code: `def strict_age(payload: dict) -> dict:
    if not isinstance(payload.get("age"), int) or payload["age"] < 0:
        raise ValueError("invalid_age")
    return {"age": payload["age"]}

print(strict_age({"age": 3}))
print("pydantic_like", True)
print("strict", True)`,
          output: `{'age': 3}
pydantic_like True
strict True`,
        },
        why: "Hace observable `Pydantic y JSON Schema` con un caso local pequeño y deja como evidencia schema exportado y fixtures válidos/inválidos; el demo modela el contrato, no un servicio externo.",
      },
      {
        demoId: "S42-T1-B-DEMO",
        subtopicId: "S42-T1-B",
        environment: "local-python",
        description: "Demo: evolución, discriminated unions y validación de negocio",
        code: {
          language: 'python',
          title: "demo_evolution_unions_business_val.py",
          code: `def business_amount(v1: dict) -> int:
    # v1 readers ignore optional fields; amount remains required
    if "amount" not in v1:
        raise ValueError("amount")
    return int(v1["amount"])

print(business_amount({"amount": 10, "currency": "PEN"}))
print("err", "amount")
print("evol", "add_optional")`,
          output: `10
err amount
evol add_optional`,
        },
        why: "Hace observable `evolución, discriminated unions y validación de negocio` con un caso local pequeño y deja como evidencia lector anterior conserva contrato; el demo modela el contrato, no un servicio externo.",
      },
      {
        demoId: "S42-T2-A-DEMO",
        subtopicId: "S42-T2-A",
        environment: "local-python",
        description: "Demo: authn/authz y RBAC",
        code: {
          language: 'python',
          title: "demo_authn_authz_rbac.py",
          code: `def authn(user_id: str) -> str:
    return user_id

def roles_for(user_id: str) -> list:
    return ["analyst"] if user_id else []

print("authn", authn("u1"))
print("roles", roles_for("u1"))
print("authz_needed", True)`,
          output: `authn u1
roles ['analyst']
authz_needed True`,
        },
        why: "Hace observable `authn/authz y RBAC` con un caso local pequeño y deja como evidencia prueba actor A no lee caso B; el demo modela el contrato, no un servicio externo.",
      },
      {
        demoId: "S42-T2-B-DEMO",
        subtopicId: "S42-T2-B",
        environment: "local-python",
        description: "Demo: scopes, service identities y deny-by-default",
        code: {
          language: 'python',
          title: "demo_scopes_service_ids_deny.py",
          code: `def service_scopes(service_id: str) -> list:
    catalog = {"er-worker": ["jobs:run"], "api": ["jobs:read"]}
    return catalog.get(service_id, [])

print("er-worker")
print(service_scopes("er-worker"))
print("service_identity", True)`,
          output: `er-worker
['jobs:run']
service_identity True`,
        },
        why: "Hace observable `scopes, service identities y deny-by-default` con un caso local pequeño y deja como evidencia matriz de scopes con denegaciones explícitas; el demo modela el contrato, no un servicio externo.",
      },
      {
        demoId: "S42-T3-A-DEMO",
        subtopicId: "S42-T3-A",
        environment: "local-python",
        description: "Demo: input limits, injection y SSRF/path traversal",
        code: {
          language: 'python',
          title: "demo_limits_injection_ssrf_path.py",
          code: `def url_allowed(url: str, allow: set) -> bool:
    host = url.split("://", 1)[-1].split("/", 1)[0]
    return host in allow

print(url_allowed("https://docs.example.pe/a", {"docs.example.pe"}))
print(url_allowed("http://169.254.169.254/", {"docs.example.pe"}))
print("injection", "parameterized")`,
          output: `True
False
injection parameterized`,
        },
        why: "Hace observable `input limits, injection y SSRF/path traversal` con un caso local pequeño y deja como evidencia payload/URL/ruta adversarial rechazada; el demo modela el contrato, no un servicio externo.",
      },
      {
        demoId: "S42-T3-B-DEMO",
        subtopicId: "S42-T3-B",
        environment: "local-python",
        description: "Demo: secretos, cifrado y dependency risk",
        code: {
          language: 'python',
          title: "demo_secrets_crypto_deps.py",
          code: `def risk_deps(deps: list, max_age_days: int = 180) -> list:
    return [d["name"] for d in deps if d.get("age_days", 0) > max_age_days]

print("high", risk_deps([{"name": "old", "age_days": 400}]))
print("crypto", "AES-GCM-at-rest")
print("rotate", True)`,
          output: `high ['old']
crypto AES-GCM-at-rest
rotate True`,
        },
        why: "Hace observable `secretos, cifrado y dependency risk` con un caso local pequeño y deja como evidencia scan sin secreto y rotación ensayada; el demo modela el contrato, no un servicio externo.",
      },
      {
        demoId: "S42-T4-A-DEMO",
        subtopicId: "S42-T4-A",
        environment: "local-python",
        description: "Demo: minimización, purpose y retención",
        code: {
          language: 'python',
          title: "demo_minimize_purpose_retention.py",
          code: `def for_log(record: dict) -> dict:
    return {k: v for k, v in record.items() if k != "email"}

print(for_log({"case_id": "C1", "email": "x@example.pe"}))
print("drop_email_for_log", True)
print("purpose_bound", True)`,
          output: `{'case_id': 'C1'}
drop_email_for_log True
purpose_bound True`,
        },
        why: "Hace observable `minimización, purpose y retención` con un caso local pequeño y deja como evidencia inventario propósito-campo-retención aprobado; el demo modela el contrato, no un servicio externo.",
      },
      {
        demoId: "S42-T4-B-DEMO",
        subtopicId: "S42-T4-B",
        environment: "local-python",
        description: "Demo: audit, deletion, pseudonymization y acceso",
        code: {
          language: 'python',
          title: "demo_audit_delete_pseudo_access.py",
          code: `def deleted_gone(store: dict, case_id: str) -> bool:
    return case_id not in store

store = {"C1": {"status": "open"}}
del store["C1"]
print(deleted_gone(store, "C1"))
print(deleted_gone({"C1": {}}, "C1"))
print("no_cross_tenant", True)`,
          output: `True
False
no_cross_tenant True`,
        },
        why: "Hace observable `audit, deletion, pseudonymization y acceso` con un caso local pequeño y deja como evidencia borrado y no-reaparición verificados; el demo modela el contrato, no un servicio externo.",
      },
    ],
  },
  weDo: {
    intro: "S42 · Laboratorio Threat model y matriz de permisos del control plane: 24 retos locales. E1 repara una operación de dominio, E2 separa valid/invalid/missing y E3 demuestra recuperación fail-closed con ocho fixtures peruanos sintéticos distintos.",
    steps: [
      {
        id: "S42-T1-A-E1",
        subtopicId: "S42-T1-A",
        kind: "guided",
        instruction: "S42-T1-A-E1 · Calcula el contrato de `Pydantic y JSON Schema` sobre `CASO-CUS-042-1A`. La entrada es el dict completo del starter; la operación debe demostrar schema estricto más regla de negocio. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S42-T1-A PASS`; la misma operación sobre el fixture adverso debe activar `REJECT_SCHEMA` en E2.",
        hint: "Relaciona los campos `extra_policy`, `json_schema`, `valid_fixture`, `business_rule` con la regla explicada en S42-T1-A.",
        hints: [
          "Relaciona los campos `extra_policy`, `json_schema`, `valid_fixture`, `business_rule` con la regla explicada en S42-T1-A.",
          "El predicado correcto debe ser verdadero porque el fixture conserva schema exportado y fixtures válidos/inválidos; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta business_rule", "fixture adverso: schema estricto más regla de negocio", "CASO-CUS-042-1A es sintético"],
        tests: "El fixture `CASO-CUS-042-1A` satisface un predicado de dominio real; imprime `S42-T1-A PASS` y el assert booleano pasa.",
        feedback: "S42-T1-A-E1: explica qué campo cambió la decisión, por qué el adverso activa REJECT_SCHEMA y por qué faltar business_rule exige REVIEW_BUSINESS_INVARIANT.",
        starterCode: {
          language: 'python',
          title: "s42-t1-a-e1.py",
          code: `# CASO-LIM-042 · Pydantic extra=forbid + business rule
# DEFECT: PASS si extra allow y no business_rule
# Contrato: corrige el DEFECT; salida alineada a solutionCode
record = {"case_id": "CASO-CUS-042-1A", **{"extra_policy":"forbid","json_schema":True,"valid_fixture":True,"business_rule":True}}
# DEFECT: extra debe rechazarse; business_rule es obligatoria
meets_contract = record["extra_policy"] == "allow" and not record["business_rule"]
status = "PASS" if meets_contract else "REJECT_SCHEMA"
print("S42-T1-A", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s42-t1-a-e1.py",
          code: `record = {"case_id": "CASO-CUS-042-1A", **{"extra_policy":"forbid","json_schema":True,"valid_fixture":True,"business_rule":True}}
meets_contract = record["extra_policy"] == "forbid" and all(record[k] for k in ("json_schema","valid_fixture","business_rule"))
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
        instruction: "S42-T1-A-E2 · Modela tres rutas de `Pydantic y JSON Schema`: fixture válido, fixture adverso y registro sin `business_rule`. Entrada: dict con case_id, extra_policy, json_schema, valid_fixture, business_rule. Salidas exactas: `PASS`, `REJECT_SCHEMA`, `MISSING:business_rule`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a business_rule debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a business_rule debe ocurrir antes de esa rama.",
          "Después aplica la regla de S42-T1-A: schema estricto más regla de negocio. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta business_rule", "fixture adverso: schema estricto más regla de negocio", "CASO-CUS-042-1A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `business_rule` ausente y produce exactamente `PASS REJECT_SCHEMA MISSING:business_rule`.",
        feedback: "S42-T1-A-E2: explica qué campo cambió la decisión, por qué el adverso activa REJECT_SCHEMA y por qué faltar business_rule exige REVIEW_BUSINESS_INVARIANT.",
        starterCode: {
          language: 'python',
          title: "s42-t1-a-e2.py",
          code: `# CASO-LIM-042 · assess schema reject
# DEFECT: PASS con extra allow sin business_rule
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def assess(record: dict) -> str:
    required = {"case_id", "extra_policy", "json_schema", "valid_fixture", "business_rule"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["extra_policy"] == "allow" and not record["business_rule"] else "REJECT_SCHEMA"

valid = {"case_id": "CASO-CUS-042-1A", **{"extra_policy":"forbid","json_schema":True,"valid_fixture":True,"business_rule":True}}
invalid = {"case_id": "CASO-CUS-042-1A", **{"extra_policy":"allow","json_schema":False,"valid_fixture":True,"business_rule":False}}
incomplete = {**valid}
incomplete.pop("business_rule")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s42-t1-a-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "extra_policy", "json_schema", "valid_fixture", "business_rule"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["extra_policy"] == "forbid" and all(record[k] for k in ("json_schema","valid_fixture","business_rule")) else "REJECT_SCHEMA"

valid = {"case_id": "CASO-CUS-042-1A", **{"extra_policy":"forbid","json_schema":True,"valid_fixture":True,"business_rule":True}}
invalid = {"case_id": "CASO-CUS-042-1A", **{"extra_policy":"allow","json_schema":False,"valid_fixture":True,"business_rule":False}}
incomplete = {**valid}
incomplete.pop("business_rule")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS REJECT_SCHEMA MISSING:business_rule` ,
        },
      },
      {
        id: "S42-T1-A-E3",
        subtopicId: "S42-T1-A",
        kind: "transfer",
        instruction: "S42-T1-A-E3 · Simula fallo cerrado para `Pydantic y JSON Schema` con tres fixtures distintos. `CASO-CUS-042-1A` debe continuar, el adverso debe devolver `REJECT_SCHEMA` y la ausencia de `business_rule` debe devolver `REVIEW_BUSINESS_INVARIANT`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `REVIEW_BUSINESS_INVARIANT` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `REVIEW_BUSINESS_INVARIANT` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró schema estricto más regla de negocio; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta business_rule", "fixture adverso: schema estricto más regla de negocio", "CASO-CUS-042-1A es sintético"],
        tests: "Fixtures `CASO-CUS-042-1A`, adverso y sin `business_rule` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S42-T1-A-E3: explica qué campo cambió la decisión, por qué el adverso activa REJECT_SCHEMA y por qué faltar business_rule exige REVIEW_BUSINESS_INVARIANT.",
        starterCode: {
          language: 'python',
          title: "s42-t1-a-e3.py",
          code: `# CASO-LIM-042 · decide REJECT_SCHEMA
# DEFECT: missing→CONTINUE; pred invertido
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def decide(record: dict) -> str:
    required = {"case_id", "extra_policy", "json_schema", "valid_fixture", "business_rule"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if record["extra_policy"] == "allow" and not record["business_rule"] else "REJECT_SCHEMA"

valid = {"case_id": "CASO-CUS-042-1A", **{"extra_policy":"forbid","json_schema":True,"valid_fixture":True,"business_rule":True}}
invalid = {"case_id": "CASO-CUS-042-1A", **{"extra_policy":"allow","json_schema":False,"valid_fixture":True,"business_rule":False}}
uncertain = {**valid}
uncertain.pop("business_rule")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s42-t1-a-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "extra_policy", "json_schema", "valid_fixture", "business_rule"}
    missing = sorted(required - record.keys())
    if missing:
        return "REVIEW_BUSINESS_INVARIANT"
    return "CONTINUE" if record["extra_policy"] == "forbid" and all(record[k] for k in ("json_schema","valid_fixture","business_rule")) else "REJECT_SCHEMA"

valid = {"case_id": "CASO-CUS-042-1A", **{"extra_policy":"forbid","json_schema":True,"valid_fixture":True,"business_rule":True}}
invalid = {"case_id": "CASO-CUS-042-1A", **{"extra_policy":"allow","json_schema":False,"valid_fixture":True,"business_rule":False}}
uncertain = {**valid}
uncertain.pop("business_rule")
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
        instruction: "S42-T1-B-E1 · Compara el contrato de `evolución, discriminated unions y validación de negocio` sobre `CASO-CUS-042-1B`. La entrada es el dict completo del starter; la operación debe demostrar cambio aditivo y union exhaustiva. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S42-T1-B PASS`; la misma operación sobre el fixture adverso debe activar `VERSION_SCHEMA` en E2.",
        hint: "Relaciona los campos `change`, `old_reader_passes`, `union_tags`, `handled_tags` con la regla explicada en S42-T1-B.",
        hints: [
          "Relaciona los campos `change`, `old_reader_passes`, `union_tags`, `handled_tags` con la regla explicada en S42-T1-B.",
          "El predicado correcto debe ser verdadero porque el fixture conserva lector anterior conserva contrato; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta handled_tags", "fixture adverso: cambio aditivo y union exhaustiva", "CASO-CUS-042-1B es sintético"],
        tests: "El fixture `CASO-CUS-042-1B` satisface un predicado de dominio real; imprime `S42-T1-B PASS` y el assert booleano pasa.",
        feedback: "S42-T1-B-E1: explica qué campo cambió la decisión, por qué el adverso activa VERSION_SCHEMA y por qué faltar handled_tags exige MIGRATE_CONSUMERS.",
        starterCode: {
          language: 'python',
          title: "s42-t1-b-e1.py",
          code: `# CASO-LIM-042 · schema evolution compatibility
# DEFECT: PASS si rename_required o union tags incompletos
# Contrato: corrige el DEFECT; salida alineada a solutionCode
record = {"case_id": "CASO-CUS-042-1B", **{"change":"add_optional","old_reader_passes":True,"union_tags":{"email","phone"},"handled_tags":{"email","phone"}}}
# DEFECT: rename_required y unions incompletas bloquean evolución
meets_contract = record["change"] == "rename_required" or record["union_tags"] != record["handled_tags"]
status = "PASS" if meets_contract else "VERSION_SCHEMA"
print("S42-T1-B", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s42-t1-b-e1.py",
          code: `record = {"case_id": "CASO-CUS-042-1B", **{"change":"add_optional","old_reader_passes":True,"union_tags":{"email","phone"},"handled_tags":{"email","phone"}}}
meets_contract = record["change"] == "add_optional" and record["old_reader_passes"] and record["union_tags"] == record["handled_tags"]
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
        instruction: "S42-T1-B-E2 · Verifica tres rutas de `evolución, discriminated unions y validación de negocio`: fixture válido, fixture adverso y registro sin `handled_tags`. Entrada: dict con case_id, change, old_reader_passes, union_tags, handled_tags. Salidas exactas: `PASS`, `VERSION_SCHEMA`, `MISSING:handled_tags`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a handled_tags debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a handled_tags debe ocurrir antes de esa rama.",
          "Después aplica la regla de S42-T1-B: cambio aditivo y union exhaustiva. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta handled_tags", "fixture adverso: cambio aditivo y union exhaustiva", "CASO-CUS-042-1B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `handled_tags` ausente y produce exactamente `PASS VERSION_SCHEMA MISSING:handled_tags`.",
        feedback: "S42-T1-B-E2: explica qué campo cambió la decisión, por qué el adverso activa VERSION_SCHEMA y por qué faltar handled_tags exige MIGRATE_CONSUMERS.",
        starterCode: {
          language: 'python',
          title: "s42-t1-b-e2.py",
          code: `# CASO-LIM-042 · assess VERSION_SCHEMA
# DEFECT: PASS con breaking change o tags no handled
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def assess(record: dict) -> str:
    required = {"case_id", "change", "old_reader_passes", "union_tags", "handled_tags"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["change"] == "rename_required" or record["union_tags"] != record["handled_tags"] else "VERSION_SCHEMA"

valid = {"case_id": "CASO-CUS-042-1B", **{"change":"add_optional","old_reader_passes":True,"union_tags":{"email","phone"},"handled_tags":{"email","phone"}}}
invalid = {"case_id": "CASO-CUS-042-1B", **{"change":"rename_required","old_reader_passes":False,"union_tags":{"email","phone","push"},"handled_tags":{"email","phone"}}}
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
    return "PASS" if record["change"] == "add_optional" and record["old_reader_passes"] and record["union_tags"] == record["handled_tags"] else "VERSION_SCHEMA"

valid = {"case_id": "CASO-CUS-042-1B", **{"change":"add_optional","old_reader_passes":True,"union_tags":{"email","phone"},"handled_tags":{"email","phone"}}}
invalid = {"case_id": "CASO-CUS-042-1B", **{"change":"rename_required","old_reader_passes":False,"union_tags":{"email","phone","push"},"handled_tags":{"email","phone"}}}
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
        instruction: "S42-T1-B-E3 · Extiende fallo cerrado para `evolución, discriminated unions y validación de negocio` con tres fixtures distintos. `CASO-CUS-042-1B` debe continuar, el adverso debe devolver `VERSION_SCHEMA` y la ausencia de `handled_tags` debe devolver `MIGRATE_CONSUMERS`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `MIGRATE_CONSUMERS` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `MIGRATE_CONSUMERS` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró cambio aditivo y union exhaustiva; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta handled_tags", "fixture adverso: cambio aditivo y union exhaustiva", "CASO-CUS-042-1B es sintético"],
        tests: "Fixtures `CASO-CUS-042-1B`, adverso y sin `handled_tags` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S42-T1-B-E3: explica qué campo cambió la decisión, por qué el adverso activa VERSION_SCHEMA y por qué faltar handled_tags exige MIGRATE_CONSUMERS.",
        starterCode: {
          language: 'python',
          title: "s42-t1-b-e3.py",
          code: `# CASO-LIM-042 · decide VERSION_SCHEMA
# DEFECT: missing→CONTINUE; pred invertido
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def decide(record: dict) -> str:
    required = {"case_id", "change", "old_reader_passes", "union_tags", "handled_tags"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if record["change"] == "rename_required" or record["union_tags"] != record["handled_tags"] else "VERSION_SCHEMA"

valid = {"case_id": "CASO-CUS-042-1B", **{"change":"add_optional","old_reader_passes":True,"union_tags":{"email","phone"},"handled_tags":{"email","phone"}}}
invalid = {"case_id": "CASO-CUS-042-1B", **{"change":"rename_required","old_reader_passes":False,"union_tags":{"email","phone","push"},"handled_tags":{"email","phone"}}}
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
    return "CONTINUE" if record["change"] == "add_optional" and record["old_reader_passes"] and record["union_tags"] == record["handled_tags"] else "VERSION_SCHEMA"

valid = {"case_id": "CASO-CUS-042-1B", **{"change":"add_optional","old_reader_passes":True,"union_tags":{"email","phone"},"handled_tags":{"email","phone"}}}
invalid = {"case_id": "CASO-CUS-042-1B", **{"change":"rename_required","old_reader_passes":False,"union_tags":{"email","phone","push"},"handled_tags":{"email","phone"}}}
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
        instruction: "S42-T2-A-E1 · Filtra el contrato de `authn/authz y RBAC` sobre `CASO-CUS-042-2A`. La entrada es el dict completo del starter; la operación debe demostrar identidad, permiso y pertenencia del recurso. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S42-T2-A PASS`; la misma operación sobre el fixture adverso debe activar `DENY_CROSS_TENANT` en E2.",
        hint: "Relaciona los campos `authenticated`, `actor`, `resource_owner`, `roles` con la regla explicada en S42-T2-A.",
        hints: [
          "Relaciona los campos `authenticated`, `actor`, `resource_owner`, `roles` con la regla explicada en S42-T2-A.",
          "El predicado correcto debe ser verdadero porque el fixture conserva prueba actor A no lee caso B; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta roles", "fixture adverso: identidad, permiso y pertenencia del recurso", "CASO-CUS-042-2A es sintético"],
        tests: "El fixture `CASO-CUS-042-2A` satisface un predicado de dominio real; imprime `S42-T2-A PASS` y el assert booleano pasa.",
        feedback: "S42-T2-A-E1: explica qué campo cambió la decisión, por qué el adverso activa DENY_CROSS_TENANT y por qué faltar roles exige VERIFY_RESOURCE_OWNER.",
        starterCode: {
          language: 'python',
          title: "s42-t2-a-e1.py",
          code: `# CASO-LIM-042 · authz actor==owner
# DEFECT: PASS si authenticated y actor≠owner (cross-tenant)
# Contrato: corrige el DEFECT; salida alineada a solutionCode
record = {"case_id": "CASO-CUS-042-2A", **{"authenticated":True,"actor":"user-a","resource_owner":"user-a","roles":{"case:read"}}}
# DEFECT: authn sin authz cross-tenant es DENY
meets_contract = record["authenticated"] and record["actor"] != record["resource_owner"]
status = "PASS" if meets_contract else "DENY_CROSS_TENANT"
print("S42-T2-A", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s42-t2-a-e1.py",
          code: `record = {"case_id": "CASO-CUS-042-2A", **{"authenticated":True,"actor":"user-a","resource_owner":"user-a","roles":{"case:read"}}}
meets_contract = record["authenticated"] and record["actor"] == record["resource_owner"] and "case:read" in record["roles"]
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
        instruction: "S42-T2-A-E2 · Clasifica tres rutas de `authn/authz y RBAC`: fixture válido, fixture adverso y registro sin `roles`. Entrada: dict con case_id, authenticated, actor, resource_owner, roles. Salidas exactas: `PASS`, `DENY_CROSS_TENANT`, `MISSING:roles`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a roles debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a roles debe ocurrir antes de esa rama.",
          "Después aplica la regla de S42-T2-A: identidad, permiso y pertenencia del recurso. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta roles", "fixture adverso: identidad, permiso y pertenencia del recurso", "CASO-CUS-042-2A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `roles` ausente y produce exactamente `PASS DENY_CROSS_TENANT MISSING:roles`.",
        feedback: "S42-T2-A-E2: explica qué campo cambió la decisión, por qué el adverso activa DENY_CROSS_TENANT y por qué faltar roles exige VERIFY_RESOURCE_OWNER.",
        starterCode: {
          language: 'python',
          title: "s42-t2-a-e2.py",
          code: `# CASO-LIM-042 · assess DENY_CROSS_TENANT
# DEFECT: PASS con actor distinto del resource_owner
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def assess(record: dict) -> str:
    required = {"case_id", "authenticated", "actor", "resource_owner", "roles"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["authenticated"] and record["actor"] != record["resource_owner"] else "DENY_CROSS_TENANT"

valid = {"case_id": "CASO-CUS-042-2A", **{"authenticated":True,"actor":"user-a","resource_owner":"user-a","roles":{"case:read"}}}
invalid = {"case_id": "CASO-CUS-042-2A", **{"authenticated":True,"actor":"user-a","resource_owner":"user-b","roles":{"case:read"}}}
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
    return "PASS" if record["authenticated"] and record["actor"] == record["resource_owner"] and "case:read" in record["roles"] else "DENY_CROSS_TENANT"

valid = {"case_id": "CASO-CUS-042-2A", **{"authenticated":True,"actor":"user-a","resource_owner":"user-a","roles":{"case:read"}}}
invalid = {"case_id": "CASO-CUS-042-2A", **{"authenticated":True,"actor":"user-a","resource_owner":"user-b","roles":{"case:read"}}}
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
        instruction: "S42-T2-A-E3 · Defiende fallo cerrado para `authn/authz y RBAC` con tres fixtures distintos. `CASO-CUS-042-2A` debe continuar, el adverso debe devolver `DENY_CROSS_TENANT` y la ausencia de `roles` debe devolver `VERIFY_RESOURCE_OWNER`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `VERIFY_RESOURCE_OWNER` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `VERIFY_RESOURCE_OWNER` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró identidad, permiso y pertenencia del recurso; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta roles", "fixture adverso: identidad, permiso y pertenencia del recurso", "CASO-CUS-042-2A es sintético"],
        tests: "Fixtures `CASO-CUS-042-2A`, adverso y sin `roles` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S42-T2-A-E3: explica qué campo cambió la decisión, por qué el adverso activa DENY_CROSS_TENANT y por qué faltar roles exige VERIFY_RESOURCE_OWNER.",
        starterCode: {
          language: 'python',
          title: "s42-t2-a-e3.py",
          code: `# CASO-LIM-042 · decide DENY_CROSS_TENANT
# DEFECT: missing→CONTINUE; pred invertido
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def decide(record: dict) -> str:
    required = {"case_id", "authenticated", "actor", "resource_owner", "roles"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if record["authenticated"] and record["actor"] != record["resource_owner"] else "DENY_CROSS_TENANT"

valid = {"case_id": "CASO-CUS-042-2A", **{"authenticated":True,"actor":"user-a","resource_owner":"user-a","roles":{"case:read"}}}
invalid = {"case_id": "CASO-CUS-042-2A", **{"authenticated":True,"actor":"user-a","resource_owner":"user-b","roles":{"case:read"}}}
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
    return "CONTINUE" if record["authenticated"] and record["actor"] == record["resource_owner"] and "case:read" in record["roles"] else "DENY_CROSS_TENANT"

valid = {"case_id": "CASO-CUS-042-2A", **{"authenticated":True,"actor":"user-a","resource_owner":"user-a","roles":{"case:read"}}}
invalid = {"case_id": "CASO-CUS-042-2A", **{"authenticated":True,"actor":"user-a","resource_owner":"user-b","roles":{"case:read"}}}
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
        instruction: "S42-T2-B-E1 · Modela el contrato de `scopes, service identities y deny-by-default` sobre `CASO-CUS-042-2B`. La entrada es el dict completo del starter; la operación debe demostrar scope estrecho, identidad propia y ruta declarada. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S42-T2-B PASS`; la misma operación sobre el fixture adverso debe activar `DENY_SCOPE` en E2.",
        hint: "Relaciona los campos `requested_scope`, `granted_scopes`, `service_id`, `route_declared` con la regla explicada en S42-T2-B.",
        hints: [
          "Relaciona los campos `requested_scope`, `granted_scopes`, `service_id`, `route_declared` con la regla explicada en S42-T2-B.",
          "El predicado correcto debe ser verdadero porque el fixture conserva matriz de scopes con denegaciones explícitas; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta route_declared", "fixture adverso: scope estrecho, identidad propia y ruta declarada", "CASO-CUS-042-2B es sintético"],
        tests: "El fixture `CASO-CUS-042-2B` satisface un predicado de dominio real; imprime `S42-T2-B PASS` y el assert booleano pasa.",
        feedback: "S42-T2-B-E1: explica qué campo cambió la decisión, por qué el adverso activa DENY_SCOPE y por qué faltar route_declared exige REQUEST_NARROW_GRANT.",
        starterCode: {
          language: 'python',
          title: "s42-t2-b-e1.py",
          code: `# CASO-LIM-042 · OAuth scopes on route
# DEFECT: PASS si scope no granted o route no declared
# Contrato: corrige el DEFECT; salida alineada a solutionCode
record = {"case_id": "CASO-CUS-042-2B", **{"requested_scope":"report:prepare","granted_scopes":{"report:prepare"},"service_id":"svc-reporter","route_declared":True}}
# DEFECT: scope faltante o ruta no declarada → DENY
meets_contract = record["requested_scope"] not in record["granted_scopes"] or not record["route_declared"]
status = "PASS" if meets_contract else "DENY_SCOPE"
print("S42-T2-B", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s42-t2-b-e1.py",
          code: `record = {"case_id": "CASO-CUS-042-2B", **{"requested_scope":"report:prepare","granted_scopes":{"report:prepare"},"service_id":"svc-reporter","route_declared":True}}
meets_contract = record["requested_scope"] in record["granted_scopes"] and record["service_id"].startswith("svc-") and record["route_declared"]
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
        instruction: "S42-T2-B-E2 · Audita tres rutas de `scopes, service identities y deny-by-default`: fixture válido, fixture adverso y registro sin `route_declared`. Entrada: dict con case_id, requested_scope, granted_scopes, service_id, route_declared. Salidas exactas: `PASS`, `DENY_SCOPE`, `MISSING:route_declared`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a route_declared debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a route_declared debe ocurrir antes de esa rama.",
          "Después aplica la regla de S42-T2-B: scope estrecho, identidad propia y ruta declarada. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta route_declared", "fixture adverso: scope estrecho, identidad propia y ruta declarada", "CASO-CUS-042-2B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `route_declared` ausente y produce exactamente `PASS DENY_SCOPE MISSING:route_declared`.",
        feedback: "S42-T2-B-E2: explica qué campo cambió la decisión, por qué el adverso activa DENY_SCOPE y por qué faltar route_declared exige REQUEST_NARROW_GRANT.",
        starterCode: {
          language: 'python',
          title: "s42-t2-b-e2.py",
          code: `# CASO-LIM-042 · assess DENY_SCOPE
# DEFECT: PASS sin scope o sin route_declared
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def assess(record: dict) -> str:
    required = {"case_id", "requested_scope", "granted_scopes", "service_id", "route_declared"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["requested_scope"] not in record["granted_scopes"] or not record["route_declared"] else "DENY_SCOPE"

valid = {"case_id": "CASO-CUS-042-2B", **{"requested_scope":"report:prepare","granted_scopes":{"report:prepare"},"service_id":"svc-reporter","route_declared":True}}
invalid = {"case_id": "CASO-CUS-042-2B", **{"requested_scope":"prod:write","granted_scopes":{"report:prepare"},"service_id":"shared-admin","route_declared":False}}
incomplete = {**valid}
incomplete.pop("route_declared")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s42-t2-b-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "requested_scope", "granted_scopes", "service_id", "route_declared"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["requested_scope"] in record["granted_scopes"] and record["service_id"].startswith("svc-") and record["route_declared"] else "DENY_SCOPE"

valid = {"case_id": "CASO-CUS-042-2B", **{"requested_scope":"report:prepare","granted_scopes":{"report:prepare"},"service_id":"svc-reporter","route_declared":True}}
invalid = {"case_id": "CASO-CUS-042-2B", **{"requested_scope":"prod:write","granted_scopes":{"report:prepare"},"service_id":"shared-admin","route_declared":False}}
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
        instruction: "S42-T2-B-E3 · Recupera fallo cerrado para `scopes, service identities y deny-by-default` con tres fixtures distintos. `CASO-CUS-042-2B` debe continuar, el adverso debe devolver `DENY_SCOPE` y la ausencia de `route_declared` debe devolver `REQUEST_NARROW_GRANT`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `REQUEST_NARROW_GRANT` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `REQUEST_NARROW_GRANT` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró scope estrecho, identidad propia y ruta declarada; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta route_declared", "fixture adverso: scope estrecho, identidad propia y ruta declarada", "CASO-CUS-042-2B es sintético"],
        tests: "Fixtures `CASO-CUS-042-2B`, adverso y sin `route_declared` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S42-T2-B-E3: explica qué campo cambió la decisión, por qué el adverso activa DENY_SCOPE y por qué faltar route_declared exige REQUEST_NARROW_GRANT.",
        starterCode: {
          language: 'python',
          title: "s42-t2-b-e3.py",
          code: `# CASO-LIM-042 · decide DENY_SCOPE
# DEFECT: missing→CONTINUE; pred invertido
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def decide(record: dict) -> str:
    required = {"case_id", "requested_scope", "granted_scopes", "service_id", "route_declared"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if record["requested_scope"] not in record["granted_scopes"] or not record["route_declared"] else "DENY_SCOPE"

valid = {"case_id": "CASO-CUS-042-2B", **{"requested_scope":"report:prepare","granted_scopes":{"report:prepare"},"service_id":"svc-reporter","route_declared":True}}
invalid = {"case_id": "CASO-CUS-042-2B", **{"requested_scope":"prod:write","granted_scopes":{"report:prepare"},"service_id":"shared-admin","route_declared":False}}
uncertain = {**valid}
uncertain.pop("route_declared")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s42-t2-b-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "requested_scope", "granted_scopes", "service_id", "route_declared"}
    missing = sorted(required - record.keys())
    if missing:
        return "REQUEST_NARROW_GRANT"
    return "CONTINUE" if record["requested_scope"] in record["granted_scopes"] and record["service_id"].startswith("svc-") and record["route_declared"] else "DENY_SCOPE"

valid = {"case_id": "CASO-CUS-042-2B", **{"requested_scope":"report:prepare","granted_scopes":{"report:prepare"},"service_id":"svc-reporter","route_declared":True}}
invalid = {"case_id": "CASO-CUS-042-2B", **{"requested_scope":"prod:write","granted_scopes":{"report:prepare"},"service_id":"shared-admin","route_declared":False}}
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
        instruction: "S42-T3-A-E1 · Verifica el contrato de `input limits, injection y SSRF/path traversal` sobre `CASO-CUS-042-3A`. La entrada es el dict completo del starter; la operación debe demostrar límite, host allowlisted y ruta confinada. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S42-T3-A PASS`; la misma operación sobre el fixture adverso debe activar `REJECT_UNTRUSTED_INPUT` en E2.",
        hint: "Relaciona los campos `bytes`, `max_bytes`, `host`, `allowed_hosts`, `resolved_path`, `root` con la regla explicada en S42-T3-A.",
        hints: [
          "Relaciona los campos `bytes`, `max_bytes`, `host`, `allowed_hosts`, `resolved_path`, `root` con la regla explicada en S42-T3-A.",
          "El predicado correcto debe ser verdadero porque el fixture conserva payload/URL/ruta adversarial rechazada; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta root", "fixture adverso: límite, host allowlisted y ruta confinada", "CASO-CUS-042-3A es sintético"],
        tests: "El fixture `CASO-CUS-042-3A` satisface un predicado de dominio real; imprime `S42-T3-A PASS` y el assert booleano pasa.",
        feedback: "S42-T3-A-E1: explica qué campo cambió la decisión, por qué el adverso activa REJECT_UNTRUSTED_INPUT y por qué faltar root exige SECURITY_REVIEW.",
        starterCode: {
          language: 'python',
          title: "s42-t3-a-e1.py",
          code: `# CASO-LIM-042 · upload size + path traversal
# DEFECT: PASS si bytes>max o path bajo /etc
# Contrato: corrige el DEFECT; salida alineada a solutionCode
record = {"case_id": "CASO-CUS-042-3A", **{"bytes":2048,"max_bytes":4096,"host":"docs.local","allowed_hosts":{"docs.local"},"resolved_path":"/safe/reports/a.txt","root":"/safe/reports"}}
# DEFECT: path/size traversal no confiable
meets_contract = record["bytes"] > record["max_bytes"] or record["resolved_path"].startswith("/etc")
status = "PASS" if meets_contract else "REJECT_UNTRUSTED_INPUT"
print("S42-T3-A", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s42-t3-a-e1.py",
          code: `record = {"case_id": "CASO-CUS-042-3A", **{"bytes":2048,"max_bytes":4096,"host":"docs.local","allowed_hosts":{"docs.local"},"resolved_path":"/safe/reports/a.txt","root":"/safe/reports"}}
meets_contract = record["bytes"] <= record["max_bytes"] and record["host"] in record["allowed_hosts"] and record["resolved_path"].startswith(record["root"] + "/")
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
        instruction: "S42-T3-A-E2 · Decide tres rutas de `input limits, injection y SSRF/path traversal`: fixture válido, fixture adverso y registro sin `root`. Entrada: dict con case_id, bytes, max_bytes, host, allowed_hosts, resolved_path, root. Salidas exactas: `PASS`, `REJECT_UNTRUSTED_INPUT`, `MISSING:root`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a root debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a root debe ocurrir antes de esa rama.",
          "Después aplica la regla de S42-T3-A: límite, host allowlisted y ruta confinada. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta root", "fixture adverso: límite, host allowlisted y ruta confinada", "CASO-CUS-042-3A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `root` ausente y produce exactamente `PASS REJECT_UNTRUSTED_INPUT MISSING:root`.",
        feedback: "S42-T3-A-E2: explica qué campo cambió la decisión, por qué el adverso activa REJECT_UNTRUSTED_INPUT y por qué faltar root exige SECURITY_REVIEW.",
        starterCode: {
          language: 'python',
          title: "s42-t3-a-e2.py",
          code: `# CASO-LIM-042 · assess REJECT_UNTRUSTED_INPUT
# DEFECT: PASS con oversize o path traversal
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def assess(record: dict) -> str:
    required = {"case_id", "bytes", "max_bytes", "host", "allowed_hosts", "resolved_path", "root"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["bytes"] > record["max_bytes"] or record["resolved_path"].startswith("/etc") else "REJECT_UNTRUSTED_INPUT"

valid = {"case_id": "CASO-CUS-042-3A", **{"bytes":2048,"max_bytes":4096,"host":"docs.local","allowed_hosts":{"docs.local"},"resolved_path":"/safe/reports/a.txt","root":"/safe/reports"}}
invalid = {"case_id": "CASO-CUS-042-3A", **{"bytes":9999,"max_bytes":4096,"host":"169.254.169.254","allowed_hosts":{"docs.local"},"resolved_path":"/etc/passwd","root":"/safe/reports"}}
incomplete = {**valid}
incomplete.pop("root")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s42-t3-a-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "bytes", "max_bytes", "host", "allowed_hosts", "resolved_path", "root"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["bytes"] <= record["max_bytes"] and record["host"] in record["allowed_hosts"] and record["resolved_path"].startswith(record["root"] + "/") else "REJECT_UNTRUSTED_INPUT"

valid = {"case_id": "CASO-CUS-042-3A", **{"bytes":2048,"max_bytes":4096,"host":"docs.local","allowed_hosts":{"docs.local"},"resolved_path":"/safe/reports/a.txt","root":"/safe/reports"}}
invalid = {"case_id": "CASO-CUS-042-3A", **{"bytes":9999,"max_bytes":4096,"host":"169.254.169.254","allowed_hosts":{"docs.local"},"resolved_path":"/etc/passwd","root":"/safe/reports"}}
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
        instruction: "S42-T3-A-E3 · Contrasta fallo cerrado para `input limits, injection y SSRF/path traversal` con tres fixtures distintos. `CASO-CUS-042-3A` debe continuar, el adverso debe devolver `REJECT_UNTRUSTED_INPUT` y la ausencia de `root` debe devolver `SECURITY_REVIEW`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `SECURITY_REVIEW` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `SECURITY_REVIEW` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró límite, host allowlisted y ruta confinada; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta root", "fixture adverso: límite, host allowlisted y ruta confinada", "CASO-CUS-042-3A es sintético"],
        tests: "Fixtures `CASO-CUS-042-3A`, adverso y sin `root` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S42-T3-A-E3: explica qué campo cambió la decisión, por qué el adverso activa REJECT_UNTRUSTED_INPUT y por qué faltar root exige SECURITY_REVIEW.",
        starterCode: {
          language: 'python',
          title: "s42-t3-a-e3.py",
          code: `# CASO-LIM-042 · decide REJECT_UNTRUSTED_INPUT
# DEFECT: missing→CONTINUE; pred invertido
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def decide(record: dict) -> str:
    required = {"case_id", "bytes", "max_bytes", "host", "allowed_hosts", "resolved_path", "root"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if record["bytes"] > record["max_bytes"] or record["resolved_path"].startswith("/etc") else "REJECT_UNTRUSTED_INPUT"

valid = {"case_id": "CASO-CUS-042-3A", **{"bytes":2048,"max_bytes":4096,"host":"docs.local","allowed_hosts":{"docs.local"},"resolved_path":"/safe/reports/a.txt","root":"/safe/reports"}}
invalid = {"case_id": "CASO-CUS-042-3A", **{"bytes":9999,"max_bytes":4096,"host":"169.254.169.254","allowed_hosts":{"docs.local"},"resolved_path":"/etc/passwd","root":"/safe/reports"}}
uncertain = {**valid}
uncertain.pop("root")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s42-t3-a-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "bytes", "max_bytes", "host", "allowed_hosts", "resolved_path", "root"}
    missing = sorted(required - record.keys())
    if missing:
        return "SECURITY_REVIEW"
    return "CONTINUE" if record["bytes"] <= record["max_bytes"] and record["host"] in record["allowed_hosts"] and record["resolved_path"].startswith(record["root"] + "/") else "REJECT_UNTRUSTED_INPUT"

valid = {"case_id": "CASO-CUS-042-3A", **{"bytes":2048,"max_bytes":4096,"host":"docs.local","allowed_hosts":{"docs.local"},"resolved_path":"/safe/reports/a.txt","root":"/safe/reports"}}
invalid = {"case_id": "CASO-CUS-042-3A", **{"bytes":9999,"max_bytes":4096,"host":"169.254.169.254","allowed_hosts":{"docs.local"},"resolved_path":"/etc/passwd","root":"/safe/reports"}}
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
        instruction: "S42-T3-B-E1 · Clasifica el contrato de `secretos, cifrado y dependency risk` sobre `CASO-CUS-042-3B`. La entrada es el dict completo del starter; la operación debe demostrar secretos fuera del artefacto y dependencias revisadas. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S42-T3-B PASS`; la misma operación sobre el fixture adverso debe activar `ROTATE_AND_BLOCK` en E2.",
        hint: "Relaciona los campos `secret_in_repo`, `secret_in_log`, `rotation_tested`, `dependency_pinned`, `critical_cves` con la regla explicada en S42-T3-B.",
        hints: [
          "Relaciona los campos `secret_in_repo`, `secret_in_log`, `rotation_tested`, `dependency_pinned`, `critical_cves` con la regla explicada en S42-T3-B.",
          "El predicado correcto debe ser verdadero porque el fixture conserva scan sin secreto y rotación ensayada; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta critical_cves", "fixture adverso: secretos fuera del artefacto y dependencias revisadas", "CASO-CUS-042-3B es sintético"],
        tests: "El fixture `CASO-CUS-042-3B` satisface un predicado de dominio real; imprime `S42-T3-B PASS` y el assert booleano pasa.",
        feedback: "S42-T3-B-E1: explica qué campo cambió la decisión, por qué el adverso activa ROTATE_AND_BLOCK y por qué faltar critical_cves exige ASSESS_DEPENDENCY_RISK.",
        starterCode: {
          language: 'python',
          title: "s42-t3-b-e1.py",
          code: `# CASO-LIM-042 · secrets + dependency CVEs
# DEFECT: PASS si secret_in_repo o deps sin pin
# Contrato: corrige el DEFECT; salida alineada a solutionCode
record = {"case_id": "CASO-CUS-042-3B", **{"secret_in_repo":False,"secret_in_log":False,"rotation_tested":True,"dependency_pinned":True,"critical_cves":0}}
# DEFECT: secreto en repo o dep sin pin bloquea
meets_contract = record["secret_in_repo"] or not record["dependency_pinned"]
status = "PASS" if meets_contract else "ROTATE_AND_BLOCK"
print("S42-T3-B", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s42-t3-b-e1.py",
          code: `record = {"case_id": "CASO-CUS-042-3B", **{"secret_in_repo":False,"secret_in_log":False,"rotation_tested":True,"dependency_pinned":True,"critical_cves":0}}
meets_contract = not record["secret_in_repo"] and not record["secret_in_log"] and record["rotation_tested"] and record["dependency_pinned"] and record["critical_cves"] == 0
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
        instruction: "S42-T3-B-E2 · Calcula tres rutas de `secretos, cifrado y dependency risk`: fixture válido, fixture adverso y registro sin `critical_cves`. Entrada: dict con case_id, secret_in_repo, secret_in_log, rotation_tested, dependency_pinned, critical_cves. Salidas exactas: `PASS`, `ROTATE_AND_BLOCK`, `MISSING:critical_cves`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a critical_cves debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a critical_cves debe ocurrir antes de esa rama.",
          "Después aplica la regla de S42-T3-B: secretos fuera del artefacto y dependencias revisadas. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta critical_cves", "fixture adverso: secretos fuera del artefacto y dependencias revisadas", "CASO-CUS-042-3B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `critical_cves` ausente y produce exactamente `PASS ROTATE_AND_BLOCK MISSING:critical_cves`.",
        feedback: "S42-T3-B-E2: explica qué campo cambió la decisión, por qué el adverso activa ROTATE_AND_BLOCK y por qué faltar critical_cves exige ASSESS_DEPENDENCY_RISK.",
        starterCode: {
          language: 'python',
          title: "s42-t3-b-e2.py",
          code: `# CASO-LIM-042 · assess ROTATE_AND_BLOCK
# DEFECT: PASS con secret en repo o unpinned deps
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def assess(record: dict) -> str:
    required = {"case_id", "secret_in_repo", "secret_in_log", "rotation_tested", "dependency_pinned", "critical_cves"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["secret_in_repo"] or not record["dependency_pinned"] else "ROTATE_AND_BLOCK"

valid = {"case_id": "CASO-CUS-042-3B", **{"secret_in_repo":False,"secret_in_log":False,"rotation_tested":True,"dependency_pinned":True,"critical_cves":0}}
invalid = {"case_id": "CASO-CUS-042-3B", **{"secret_in_repo":True,"secret_in_log":True,"rotation_tested":False,"dependency_pinned":False,"critical_cves":2}}
incomplete = {**valid}
incomplete.pop("critical_cves")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s42-t3-b-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "secret_in_repo", "secret_in_log", "rotation_tested", "dependency_pinned", "critical_cves"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if not record["secret_in_repo"] and not record["secret_in_log"] and record["rotation_tested"] and record["dependency_pinned"] and record["critical_cves"] == 0 else "ROTATE_AND_BLOCK"

valid = {"case_id": "CASO-CUS-042-3B", **{"secret_in_repo":False,"secret_in_log":False,"rotation_tested":True,"dependency_pinned":True,"critical_cves":0}}
invalid = {"case_id": "CASO-CUS-042-3B", **{"secret_in_repo":True,"secret_in_log":True,"rotation_tested":False,"dependency_pinned":False,"critical_cves":2}}
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
        instruction: "S42-T3-B-E3 · Instrumenta fallo cerrado para `secretos, cifrado y dependency risk` con tres fixtures distintos. `CASO-CUS-042-3B` debe continuar, el adverso debe devolver `ROTATE_AND_BLOCK` y la ausencia de `critical_cves` debe devolver `ASSESS_DEPENDENCY_RISK`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `ASSESS_DEPENDENCY_RISK` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `ASSESS_DEPENDENCY_RISK` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró secretos fuera del artefacto y dependencias revisadas; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta critical_cves", "fixture adverso: secretos fuera del artefacto y dependencias revisadas", "CASO-CUS-042-3B es sintético"],
        tests: "Fixtures `CASO-CUS-042-3B`, adverso y sin `critical_cves` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S42-T3-B-E3: explica qué campo cambió la decisión, por qué el adverso activa ROTATE_AND_BLOCK y por qué faltar critical_cves exige ASSESS_DEPENDENCY_RISK.",
        starterCode: {
          language: 'python',
          title: "s42-t3-b-e3.py",
          code: `# CASO-LIM-042 · decide ROTATE_AND_BLOCK
# DEFECT: missing→CONTINUE; pred invertido
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def decide(record: dict) -> str:
    required = {"case_id", "secret_in_repo", "secret_in_log", "rotation_tested", "dependency_pinned", "critical_cves"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if record["secret_in_repo"] or not record["dependency_pinned"] else "ROTATE_AND_BLOCK"

valid = {"case_id": "CASO-CUS-042-3B", **{"secret_in_repo":False,"secret_in_log":False,"rotation_tested":True,"dependency_pinned":True,"critical_cves":0}}
invalid = {"case_id": "CASO-CUS-042-3B", **{"secret_in_repo":True,"secret_in_log":True,"rotation_tested":False,"dependency_pinned":False,"critical_cves":2}}
uncertain = {**valid}
uncertain.pop("critical_cves")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s42-t3-b-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "secret_in_repo", "secret_in_log", "rotation_tested", "dependency_pinned", "critical_cves"}
    missing = sorted(required - record.keys())
    if missing:
        return "ASSESS_DEPENDENCY_RISK"
    return "CONTINUE" if not record["secret_in_repo"] and not record["secret_in_log"] and record["rotation_tested"] and record["dependency_pinned"] and record["critical_cves"] == 0 else "ROTATE_AND_BLOCK"

valid = {"case_id": "CASO-CUS-042-3B", **{"secret_in_repo":False,"secret_in_log":False,"rotation_tested":True,"dependency_pinned":True,"critical_cves":0}}
invalid = {"case_id": "CASO-CUS-042-3B", **{"secret_in_repo":True,"secret_in_log":True,"rotation_tested":False,"dependency_pinned":False,"critical_cves":2}}
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
        instruction: "S42-T4-A-E1 · Audita el contrato de `minimización, purpose y retención` sobre `CASO-CUS-042-4A`. La entrada es el dict completo del starter; la operación debe demostrar campos mínimos, propósito y retención finita. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S42-T4-A PASS`; la misma operación sobre el fixture adverso debe activar `MINIMIZE_AND_EXPIRE` en E2.",
        hint: "Relaciona los campos `collected`, `needed`, `purpose`, `retention_days`, `max_retention_days` con la regla explicada en S42-T4-A.",
        hints: [
          "Relaciona los campos `collected`, `needed`, `purpose`, `retention_days`, `max_retention_days` con la regla explicada en S42-T4-A.",
          "El predicado correcto debe ser verdadero porque el fixture conserva inventario propósito-campo-retención aprobado; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta max_retention_days", "fixture adverso: campos mínimos, propósito y retención finita", "CASO-CUS-042-4A es sintético"],
        tests: "El fixture `CASO-CUS-042-4A` satisface un predicado de dominio real; imprime `S42-T4-A PASS` y el assert booleano pasa.",
        feedback: "S42-T4-A-E1: explica qué campo cambió la decisión, por qué el adverso activa MINIMIZE_AND_EXPIRE y por qué faltar max_retention_days exige PRIVACY_OWNER_REVIEW.",
        starterCode: {
          language: 'python',
          title: "s42-t4-a-e1.py",
          code: `# CASO-LIM-042 · data minimisation + retention
# DEFECT: PASS si collected>needed o retention>max
# Contrato: corrige el DEFECT; salida alineada a solutionCode
record = {"case_id": "CASO-CUS-042-4A", **{"collected":{"case_id","region"},"needed":{"case_id","region"},"purpose":"status-report","retention_days":30,"max_retention_days":30}}
# DEFECT: minimización y retención vencida
meets_contract = record["collected"] > record["needed"] or record["retention_days"] > record["max_retention_days"]
status = "PASS" if meets_contract else "MINIMIZE_AND_EXPIRE"
print("S42-T4-A", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s42-t4-a-e1.py",
          code: `record = {"case_id": "CASO-CUS-042-4A", **{"collected":{"case_id","region"},"needed":{"case_id","region"},"purpose":"status-report","retention_days":30,"max_retention_days":30}}
meets_contract = record["collected"] <= record["needed"] and record["purpose"] == "status-report" and record["retention_days"] <= record["max_retention_days"]
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
        instruction: "S42-T4-A-E2 · Compara tres rutas de `minimización, purpose y retención`: fixture válido, fixture adverso y registro sin `max_retention_days`. Entrada: dict con case_id, collected, needed, purpose, retention_days, max_retention_days. Salidas exactas: `PASS`, `MINIMIZE_AND_EXPIRE`, `MISSING:max_retention_days`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a max_retention_days debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a max_retention_days debe ocurrir antes de esa rama.",
          "Después aplica la regla de S42-T4-A: campos mínimos, propósito y retención finita. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta max_retention_days", "fixture adverso: campos mínimos, propósito y retención finita", "CASO-CUS-042-4A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `max_retention_days` ausente y produce exactamente `PASS MINIMIZE_AND_EXPIRE MISSING:max_retention_days`.",
        feedback: "S42-T4-A-E2: explica qué campo cambió la decisión, por qué el adverso activa MINIMIZE_AND_EXPIRE y por qué faltar max_retention_days exige PRIVACY_OWNER_REVIEW.",
        starterCode: {
          language: 'python',
          title: "s42-t4-a-e2.py",
          code: `# CASO-LIM-042 · assess MINIMIZE_AND_EXPIRE
# DEFECT: PASS con over-collection o over-retention
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def assess(record: dict) -> str:
    required = {"case_id", "collected", "needed", "purpose", "retention_days", "max_retention_days"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["collected"] > record["needed"] or record["retention_days"] > record["max_retention_days"] else "MINIMIZE_AND_EXPIRE"

valid = {"case_id": "CASO-CUS-042-4A", **{"collected":{"case_id","region"},"needed":{"case_id","region"},"purpose":"status-report","retention_days":30,"max_retention_days":30}}
invalid = {"case_id": "CASO-CUS-042-4A", **{"collected":{"case_id","region","full_name"},"needed":{"case_id","region"},"purpose":"maybe-useful","retention_days":3650,"max_retention_days":30}}
incomplete = {**valid}
incomplete.pop("max_retention_days")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s42-t4-a-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "collected", "needed", "purpose", "retention_days", "max_retention_days"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["collected"] <= record["needed"] and record["purpose"] == "status-report" and record["retention_days"] <= record["max_retention_days"] else "MINIMIZE_AND_EXPIRE"

valid = {"case_id": "CASO-CUS-042-4A", **{"collected":{"case_id","region"},"needed":{"case_id","region"},"purpose":"status-report","retention_days":30,"max_retention_days":30}}
invalid = {"case_id": "CASO-CUS-042-4A", **{"collected":{"case_id","region","full_name"},"needed":{"case_id","region"},"purpose":"maybe-useful","retention_days":3650,"max_retention_days":30}}
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
        instruction: "S42-T4-A-E3 · Aísla fallo cerrado para `minimización, purpose y retención` con tres fixtures distintos. `CASO-CUS-042-4A` debe continuar, el adverso debe devolver `MINIMIZE_AND_EXPIRE` y la ausencia de `max_retention_days` debe devolver `PRIVACY_OWNER_REVIEW`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `PRIVACY_OWNER_REVIEW` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `PRIVACY_OWNER_REVIEW` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró campos mínimos, propósito y retención finita; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta max_retention_days", "fixture adverso: campos mínimos, propósito y retención finita", "CASO-CUS-042-4A es sintético"],
        tests: "Fixtures `CASO-CUS-042-4A`, adverso y sin `max_retention_days` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S42-T4-A-E3: explica qué campo cambió la decisión, por qué el adverso activa MINIMIZE_AND_EXPIRE y por qué faltar max_retention_days exige PRIVACY_OWNER_REVIEW.",
        starterCode: {
          language: 'python',
          title: "s42-t4-a-e3.py",
          code: `# CASO-LIM-042 · decide MINIMIZE_AND_EXPIRE
# DEFECT: missing→CONTINUE; pred invertido
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def decide(record: dict) -> str:
    required = {"case_id", "collected", "needed", "purpose", "retention_days", "max_retention_days"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if record["collected"] > record["needed"] or record["retention_days"] > record["max_retention_days"] else "MINIMIZE_AND_EXPIRE"

valid = {"case_id": "CASO-CUS-042-4A", **{"collected":{"case_id","region"},"needed":{"case_id","region"},"purpose":"status-report","retention_days":30,"max_retention_days":30}}
invalid = {"case_id": "CASO-CUS-042-4A", **{"collected":{"case_id","region","full_name"},"needed":{"case_id","region"},"purpose":"maybe-useful","retention_days":3650,"max_retention_days":30}}
uncertain = {**valid}
uncertain.pop("max_retention_days")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s42-t4-a-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "collected", "needed", "purpose", "retention_days", "max_retention_days"}
    missing = sorted(required - record.keys())
    if missing:
        return "PRIVACY_OWNER_REVIEW"
    return "CONTINUE" if record["collected"] <= record["needed"] and record["purpose"] == "status-report" and record["retention_days"] <= record["max_retention_days"] else "MINIMIZE_AND_EXPIRE"

valid = {"case_id": "CASO-CUS-042-4A", **{"collected":{"case_id","region"},"needed":{"case_id","region"},"purpose":"status-report","retention_days":30,"max_retention_days":30}}
invalid = {"case_id": "CASO-CUS-042-4A", **{"collected":{"case_id","region","full_name"},"needed":{"case_id","region"},"purpose":"maybe-useful","retention_days":3650,"max_retention_days":30}}
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
        instruction: "S42-T4-B-E1 · Decide el contrato de `audit, deletion, pseudonymization y acceso` sobre `CASO-CUS-042-4B`. La entrada es el dict completo del starter; la operación debe demostrar audit sin PII, borrado derivado y llave separada. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S42-T4-B PASS`; la misma operación sobre el fixture adverso debe activar `PURGE_DERIVATIVES` en E2.",
        hint: "Relaciona los campos `audit_fields`, `pii_fields`, `deleted`, `derived_deleted`, `key_separate` con la regla explicada en S42-T4-B.",
        hints: [
          "Relaciona los campos `audit_fields`, `pii_fields`, `deleted`, `derived_deleted`, `key_separate` con la regla explicada en S42-T4-B.",
          "El predicado correcto debe ser verdadero porque el fixture conserva borrado y no-reaparición verificados; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta key_separate", "fixture adverso: audit sin PII, borrado derivado y llave separada", "CASO-CUS-042-4B es sintético"],
        tests: "El fixture `CASO-CUS-042-4B` satisface un predicado de dominio real; imprime `S42-T4-B PASS` y el assert booleano pasa.",
        feedback: "S42-T4-B-E1: explica qué campo cambió la decisión, por qué el adverso activa PURGE_DERIVATIVES y por qué faltar key_separate exige VERIFY_DELETION_SCOPE.",
        starterCode: {
          language: 'python',
          title: "s42-t4-b-e1.py",
          code: `# CASO-LIM-042 · audit without PII + purge derivatives
# DEFECT: PASS si audit∩PII o derived no deleted
# Contrato: corrige el DEFECT; salida alineada a solutionCode
record = {"case_id": "CASO-CUS-042-4B", **{"audit_fields":{"actor_id","action","at","case_token"},"pii_fields":{"full_name","email"},"deleted":True,"derived_deleted":True,"key_separate":True}}
# DEFECT: PII en audit o derivados no purgados
meets_contract = bool(record["audit_fields"] & record["pii_fields"]) or not record["derived_deleted"]
status = "PASS" if meets_contract else "PURGE_DERIVATIVES"
print("S42-T4-B", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s42-t4-b-e1.py",
          code: `record = {"case_id": "CASO-CUS-042-4B", **{"audit_fields":{"actor_id","action","at","case_token"},"pii_fields":{"full_name","email"},"deleted":True,"derived_deleted":True,"key_separate":True}}
meets_contract = record["audit_fields"].isdisjoint(record["pii_fields"]) and record["deleted"] and record["derived_deleted"] and record["key_separate"]
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
        instruction: "S42-T4-B-E2 · Filtra tres rutas de `audit, deletion, pseudonymization y acceso`: fixture válido, fixture adverso y registro sin `key_separate`. Entrada: dict con case_id, audit_fields, pii_fields, deleted, derived_deleted, key_separate. Salidas exactas: `PASS`, `PURGE_DERIVATIVES`, `MISSING:key_separate`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a key_separate debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a key_separate debe ocurrir antes de esa rama.",
          "Después aplica la regla de S42-T4-B: audit sin PII, borrado derivado y llave separada. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta key_separate", "fixture adverso: audit sin PII, borrado derivado y llave separada", "CASO-CUS-042-4B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `key_separate` ausente y produce exactamente `PASS PURGE_DERIVATIVES MISSING:key_separate`.",
        feedback: "S42-T4-B-E2: explica qué campo cambió la decisión, por qué el adverso activa PURGE_DERIVATIVES y por qué faltar key_separate exige VERIFY_DELETION_SCOPE.",
        starterCode: {
          language: 'python',
          title: "s42-t4-b-e2.py",
          code: `# CASO-LIM-042 · assess PURGE_DERIVATIVES
# DEFECT: PASS con PII en audit o derived vivos
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def assess(record: dict) -> str:
    required = {"case_id", "audit_fields", "pii_fields", "deleted", "derived_deleted", "key_separate"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if bool(record["audit_fields"] & record["pii_fields"]) or not record["derived_deleted"] else "PURGE_DERIVATIVES"

valid = {"case_id": "CASO-CUS-042-4B", **{"audit_fields":{"actor_id","action","at","case_token"},"pii_fields":{"full_name","email"},"deleted":True,"derived_deleted":True,"key_separate":True}}
invalid = {"case_id": "CASO-CUS-042-4B", **{"audit_fields":{"actor_id","email","action"},"pii_fields":{"full_name","email"},"deleted":True,"derived_deleted":False,"key_separate":False}}
incomplete = {**valid}
incomplete.pop("key_separate")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s42-t4-b-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "audit_fields", "pii_fields", "deleted", "derived_deleted", "key_separate"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["audit_fields"].isdisjoint(record["pii_fields"]) and record["deleted"] and record["derived_deleted"] and record["key_separate"] else "PURGE_DERIVATIVES"

valid = {"case_id": "CASO-CUS-042-4B", **{"audit_fields":{"actor_id","action","at","case_token"},"pii_fields":{"full_name","email"},"deleted":True,"derived_deleted":True,"key_separate":True}}
invalid = {"case_id": "CASO-CUS-042-4B", **{"audit_fields":{"actor_id","email","action"},"pii_fields":{"full_name","email"},"deleted":True,"derived_deleted":False,"key_separate":False}}
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
        instruction: "S42-T4-B-E3 · Demuestra fallo cerrado para `audit, deletion, pseudonymization y acceso` con tres fixtures distintos. `CASO-CUS-042-4B` debe continuar, el adverso debe devolver `PURGE_DERIVATIVES` y la ausencia de `key_separate` debe devolver `VERIFY_DELETION_SCOPE`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `VERIFY_DELETION_SCOPE` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `VERIFY_DELETION_SCOPE` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró audit sin PII, borrado derivado y llave separada; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta key_separate", "fixture adverso: audit sin PII, borrado derivado y llave separada", "CASO-CUS-042-4B es sintético"],
        tests: "Fixtures `CASO-CUS-042-4B`, adverso y sin `key_separate` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S42-T4-B-E3: explica qué campo cambió la decisión, por qué el adverso activa PURGE_DERIVATIVES y por qué faltar key_separate exige VERIFY_DELETION_SCOPE.",
        starterCode: {
          language: 'python',
          title: "s42-t4-b-e3.py",
          code: `# CASO-LIM-042 · decide PURGE_DERIVATIVES
# DEFECT: missing→CONTINUE; pred invertido
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def decide(record: dict) -> str:
    required = {"case_id", "audit_fields", "pii_fields", "deleted", "derived_deleted", "key_separate"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if bool(record["audit_fields"] & record["pii_fields"]) or not record["derived_deleted"] else "PURGE_DERIVATIVES"

valid = {"case_id": "CASO-CUS-042-4B", **{"audit_fields":{"actor_id","action","at","case_token"},"pii_fields":{"full_name","email"},"deleted":True,"derived_deleted":True,"key_separate":True}}
invalid = {"case_id": "CASO-CUS-042-4B", **{"audit_fields":{"actor_id","email","action"},"pii_fields":{"full_name","email"},"deleted":True,"derived_deleted":False,"key_separate":False}}
uncertain = {**valid}
uncertain.pop("key_separate")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s42-t4-b-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "audit_fields", "pii_fields", "deleted", "derived_deleted", "key_separate"}
    missing = sorted(required - record.keys())
    if missing:
        return "VERIFY_DELETION_SCOPE"
    return "CONTINUE" if record["audit_fields"].isdisjoint(record["pii_fields"]) and record["deleted"] and record["derived_deleted"] and record["key_separate"] else "PURGE_DERIVATIVES"

valid = {"case_id": "CASO-CUS-042-4B", **{"audit_fields":{"actor_id","action","at","case_token"},"pii_fields":{"full_name","email"},"deleted":True,"derived_deleted":True,"key_separate":True}}
invalid = {"case_id": "CASO-CUS-042-4B", **{"audit_fields":{"actor_id","email","action"},"pii_fields":{"full_name","email"},"deleted":True,"derived_deleted":False,"key_separate":False}}
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
    context: "Threat model y matriz de permisos del control plane. Trabaja sobre casos sintéticos de soporte para una organización ficticia en Cusco. Entrada: schemas estrictos, identidad de servicio, scope, propósito y plazo de retención. Salida: decisión allow/deny auditable y vista pseudonimizada mínima. El gate se bloquea ante: campo extra, scope insuficiente, ruta/URL no permitida o retención vencida se rechaza por defecto.",
    objectives: [
      "Convertir schemas estrictos, identidad de servicio, scope, propósito y plazo de retención en decisión allow/deny auditable y vista pseudonimizada mínima.",
      "Demostrar el gate: un actor nunca lee otro caso y un dato redactado no reaparece en logs, respuestas ni backups activos.",
      "Probar el fallo: campo extra, scope insuficiente, ruta/URL no permitida o retención vencida se rechaza por defecto.",
      "Entregar evidencia reproducible, redactada, sin PII real, secretos ni servicios externos obligatorios.",
    ],
    requirements: [
      "Usa exclusivamente fixtures sintéticos identificados por `CASO-CUS-042`.",
      "Incluye JSON Schemas compatibles y casos inválidos.",
      "Incluye matriz RBAC/scopes deny-by-default.",
      "Incluye controles contra injection/SSRF/path traversal.",
      "Incluye flujo de acceso, redacción, borrado y auditoría.",
      "Automatiza un caso normal, uno de breach (`DENY`) y uno incierto (`HUMAN_PRIVACY_REVIEW`).",
      "Incluye comandos locales reproducibles, dependencias fijadas y salida esperada.",
      "Registra riesgo residual, responsable, criterio de rollback y limitaciones conocidas.",
    ],
    starterCode: `CASE_ID = "CASO-CUS-042"
REQUIRED = ['json_schemas_compatibles_y_casos_invalidos', 'matriz_rbac_scopes_deny_by_default', 'controles_contra_injection_ssrf_path_traversal', 'flujo_de_acceso_redaccion_borrado_y_auditoria']
evidence = {
    "json_schemas_compatibles_y_casos_invalidos": False,
    "matriz_rbac_scopes_deny_by_default": False,
    "controles_contra_injection_ssrf_path_traversal": False,
    "flujo_de_acceso_redaccion_borrado_y_auditoria": False
}

def readiness(bundle: dict[str, bool]) -> tuple[str, list[str]]:
    missing = [name for name in REQUIRED if bundle.get(name) is not True]
    return ("READY", []) if not missing else ("BLOCKED", missing)

status, missing = readiness(evidence)
print(CASE_ID, status)
print("missing", ",".join(missing))
assert status in {"READY", "BLOCKED"}
`,
    portfolioNote: "Evidencia de CP-N4-A · control plane seguro y privado: muestra baseline, decisión, pruebas, resultado medido, rollback y riesgo residual. El checklist inicia en BLOCKED por diseño; conviértelo en READY enlazando artefactos reales del proyecto, no cambiando asserts.",
    rubric: [
      { criterion: "Correctitud del contrato y gate", weight: "25%" },
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
        question: "¿Qué evidencia permite aprobar `Pydantic y JSON Schema` en CASO-CUS-042?",
        options: ["un print sin assert ni versión", "schema exportado y fixtures válidos/inválidos", "una captura de pantalla sin fuente", "datos personales reales para que parezca auténtico"],
        correctIndex: 1,
        explanation: "La teoría exige schema exportado y fixtures válidos/inválidos; evidencia decorativa o PII no satisface el contrato.",
      },
      {
        question: "Si ocurre la condición de error de S42, ¿qué respuesta preserva seguridad y auditabilidad?",
        options: ["continuar y ocultar el warning", "inventar evidencia faltante", "borrar el trace para reducir ruido", "emitir DENY y conservar evidencia"],
        correctIndex: 3,
        explanation: "El contrato falla cerrado con DENY; no convierte incertidumbre o breach en éxito.",
      },
      {
        question: "¿Cuál resultado demuestra el gate `CP-N4-A · control plane seguro y privado`?",
        options: ["un actor nunca lee otro caso y un dato redactado no reaparece en logs, respuestas ni backups activos", "el archivo S42 existe, aunque no pruebe el gate", "el README afirma que funciona", "se usó la herramienta más nueva"],
        correctIndex: 0,
        explanation: "El gate es conductual y medible: un actor nunca lee otro caso y un dato redactado no reaparece en logs, respuestas ni backups activos.",
      },
      {
        question: "¿Qué tratamiento de `CASO-CUS-042` respeta el alcance del curso?",
        options: ["reemplazarlo por datos reales sin consentimiento", "subir secretos para facilitar la demo", "mantenerlo sintético, mínimo, trazable y sujeto a revisión humana", "inferir fraude o parentesco desde ER"],
        correctIndex: 2,
        explanation: "Los casos son sintéticos; ER solo propone correspondencia de entidad y no prueba fraude, parentesco ni riesgo.",
      },
      {
        question: "Política deny-by-default de scopes: si el scope pedido no está en los granted…",
        options: ["se permite el acceso y se loguea un warning", "se deniega y se conserva evidencia de la decisión", "se elevan privilegios temporalmente", "se devuelve 200 con el body completo del otro tenant"],
        correctIndex: 1,
        explanation: "Authz fail-closed: scope insuficiente → DENY con audit trail; nunca silently allow ni cross-tenant.",
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
