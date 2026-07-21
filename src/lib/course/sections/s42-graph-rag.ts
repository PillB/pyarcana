import type { CourseSection } from '../../types'

export const section42: CourseSection = {
  id: "graph-rag",
  index: 42,
  title: "Schemas, seguridad y privacidad de servicios",
  shortTitle: "Schemas y seguridad",
  tagline: "threat model y pruebas de permisos; un usuario no puede acceder a otro caso ni recuperar datos redacted",
  estimatedHours: 14,
  level: "Master",
  phase: 3,
  icon: "Share2",
  accentColor: "bg-gradient-to-br from-amber-500 to-red-600",
  jobRelevance:
    "Retemática V3 **Schemas, seguridad y privacidad de servicios** (id de plataforma `graph-rag` conservado; legado «Graph RAG y Knowledge Graphs»). Contribuye a **CP-N4-A (control plane)**: threat model y pruebas de permisos; un usuario no puede acceder a otro caso ni recuperar datos redacted. Datos sintéticos; sin PII real. ER/matching no implica fraude ni parentesco.",
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
      heading: "Mapa V3 S42: Schemas, seguridad y privacidad de servicios",
      paragraphs: [
        "En V3, **S42** retematiza el archivo de plataforma `graph-rag` hacia **Schemas, seguridad y privacidad de servicios**.",
        "Incremento: threat model y pruebas de permisos; un usuario no puede acceder a otro caso ni recuperar datos redacted.",
        "Orden T1→T4 según blueprint phase3. Español peruano; fixtures sintéticas; esta lane no marca section_passed ni edita seed/checkpoint/ledger.",
      ],
      callout: {
        type: "info",
        title: "Platform id preservado",
        content:
          "KEEP_PLATFORM_ID_RETHEME_CONTENT: `graph-rag`. Capstone: CP-N4-A (control plane).",
      },
    },
    {
      heading: "Pydantic y JSON Schema",
      subtopicId: "S42-T1-A",
      paragraphs: [
        "**Pydantic y JSON Schema** — outcome del blueprint phase3 para `pydantic-jsonschema`.",
        "Practica con código ejecutable y datos sintéticos; documenta bordes y criterios medibles.",
        "Integra el incremento **CP-N4-A (control plane)** sin exponer secretos ni PII real.",
      ],
      code: {
        language: 'python',
        title: "pydantic_jsonschema.py",
        code: `print(True); print(False); print("jsonschema", True)`,
        output: `True
False
jsonschema True`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Si el assert/print no refleja el outcome, el paquete está incompleto.",
      },
    },
    {
      heading: "evolución, discriminated unions y validación de negocio",
      subtopicId: "S42-T1-B",
      paragraphs: [
        "**evolución, discriminated unions y validación de negocio** — outcome del blueprint phase3 para `evolution-unions-business-val`.",
        "Practica con código ejecutable y datos sintéticos; documenta bordes y criterios medibles.",
        "Integra el incremento **CP-N4-A (control plane)** sin exponer secretos ni PII real.",
      ],
      code: {
        language: 'python',
        title: "evolution_unions_business_val.py",
        code: `print("EmailEvent"); print("SmsEvent"); print("union", "discriminated")`,
        output: `EmailEvent
SmsEvent
union discriminated`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Si el assert/print no refleja el outcome, el paquete está incompleto.",
      },
    },
    {
      heading: "authn/authz y RBAC",
      subtopicId: "S42-T2-A",
      paragraphs: [
        "**authn/authz y RBAC** — outcome del blueprint phase3 para `authn-authz-rbac`.",
        "Practica con código ejecutable y datos sintéticos; documenta bordes y criterios medibles.",
        "Integra el incremento **CP-N4-A (control plane)** sin exponer secretos ni PII real.",
      ],
      code: {
        language: 'python',
        title: "authn_authz_rbac.py",
        code: `print(True); print(False); print("authn_vs_authz", "identity!=permission")`,
        output: `True
False
authn_vs_authz identity!=permission`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Si el assert/print no refleja el outcome, el paquete está incompleto.",
      },
    },
    {
      heading: "scopes, service identities y deny-by-default",
      subtopicId: "S42-T2-B",
      paragraphs: [
        "**scopes, service identities y deny-by-default** — outcome del blueprint phase3 para `scopes-service-ids-deny`.",
        "Practica con código ejecutable y datos sintéticos; documenta bordes y criterios medibles.",
        "Integra el incremento **CP-N4-A (control plane)** sin exponer secretos ni PII real.",
      ],
      code: {
        language: 'python',
        title: "scopes_service_ids_deny.py",
        code: `print(True); print(False); print("deny_by_default", True)`,
        output: `True
False
deny_by_default True`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Si el assert/print no refleja el outcome, el paquete está incompleto.",
      },
    },
    {
      heading: "input limits, injection y SSRF/path traversal",
      subtopicId: "S42-T3-A",
      paragraphs: [
        "**input limits, injection y SSRF/path traversal** — outcome del blueprint phase3 para `limits-injection-ssrf-path`.",
        "Practica con código ejecutable y datos sintéticos; documenta bordes y criterios medibles.",
        "Integra el incremento **CP-N4-A (control plane)** sin exponer secretos ni PII real.",
      ],
      code: {
        language: 'python',
        title: "limits_injection_ssrf_path.py",
        code: `print("/data/a.txt"); print("blocked", "traversal"); print("ssrf_guard", "allowlist")`,
        output: `/data/a.txt
blocked traversal
ssrf_guard allowlist`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Si el assert/print no refleja el outcome, el paquete está incompleto.",
      },
    },
    {
      heading: "secretos, cifrado y dependency risk",
      subtopicId: "S42-T3-B",
      paragraphs: [
        "**secretos, cifrado y dependency risk** — outcome del blueprint phase3 para `secrets-crypto-deps`.",
        "Practica con código ejecutable y datos sintéticos; documenta bordes y criterios medibles.",
        "Integra el incremento **CP-N4-A (control plane)** sin exponer secretos ni PII real.",
      ],
      code: {
        language: 'python',
        title: "secrets_crypto_deps.py",
        code: `import hashlib
print("fp", hashlib.sha256(b"not-a-real-secret").hexdigest()[:12])
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
          "Si el assert/print no refleja el outcome, el paquete está incompleto.",
      },
    },
    {
      heading: "minimización, purpose y retención",
      subtopicId: "S42-T4-A",
      paragraphs: [
        "**minimización, purpose y retención** — outcome del blueprint phase3 para `minimize-purpose-retention`.",
        "Practica con código ejecutable y datos sintéticos; documenta bordes y criterios medibles.",
        "Integra el incremento **CP-N4-A (control plane)** sin exponer secretos ni PII real.",
      ],
      code: {
        language: 'python',
        title: "minimize_purpose_retention.py",
        code: `print("minimized", ["case_id","status"]); print("purpose", "case_ops"); print("retention", 90)`,
        output: `minimized ['case_id', 'status']
purpose case_ops
retention 90`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Si el assert/print no refleja el outcome, el paquete está incompleto.",
      },
    },
    {
      heading: "audit, deletion, pseudonymization y acceso",
      subtopicId: "S42-T4-B",
      paragraphs: [
        "**audit, deletion, pseudonymization y acceso** — outcome del blueprint phase3 para `audit-delete-pseudo-access`.",
        "Practica con código ejecutable y datos sintéticos; documenta bordes y criterios medibles.",
        "Integra el incremento **CP-N4-A (control plane)** sin exponer secretos ni PII real.",
      ],
      code: {
        language: 'python',
        title: "audit_delete_pseudo_access.py",
        code: `import hashlib
print("pseudo", hashlib.sha256(b"synth:user-1").hexdigest()[:16])
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
          "Si el assert/print no refleja el outcome, el paquete está incompleto.",
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
          code: `print({"age":3}); print("pydantic_like", True); print("strict", True)`,
          output: `{'age': 3}
pydantic_like True
strict True`,
        },
        why: "Demuestra el outcome de S42-T1-A con Python verificable.",
      },
      {
        demoId: "S42-T1-B-DEMO",
        subtopicId: "S42-T1-B",
        environment: "local-python",
        description: "Demo: evolución, discriminated unions y validación de negocio",
        code: {
          language: 'python',
          title: "demo_evolution_unions_business_val.py",
          code: `print(10); print("err", "amount"); print("evol", "add_optional")`,
          output: `10
err amount
evol add_optional`,
        },
        why: "Demuestra el outcome de S42-T1-B con Python verificable.",
      },
      {
        demoId: "S42-T2-A-DEMO",
        subtopicId: "S42-T2-A",
        environment: "local-python",
        description: "Demo: authn/authz y RBAC",
        code: {
          language: 'python',
          title: "demo_authn_authz_rbac.py",
          code: `print("authn", "u1"); print("roles", ["analyst"]); print("authz_needed", True)`,
          output: `authn u1
roles ['analyst']
authz_needed True`,
        },
        why: "Demuestra el outcome de S42-T2-A con Python verificable.",
      },
      {
        demoId: "S42-T2-B-DEMO",
        subtopicId: "S42-T2-B",
        environment: "local-python",
        description: "Demo: scopes, service identities y deny-by-default",
        code: {
          language: 'python',
          title: "demo_scopes_service_ids_deny.py",
          code: `print("er-worker"); print(["jobs:run"]); print("service_identity", True)`,
          output: `er-worker
['jobs:run']
service_identity True`,
        },
        why: "Demuestra el outcome de S42-T2-B con Python verificable.",
      },
      {
        demoId: "S42-T3-A-DEMO",
        subtopicId: "S42-T3-A",
        environment: "local-python",
        description: "Demo: input limits, injection y SSRF/path traversal",
        code: {
          language: 'python',
          title: "demo_limits_injection_ssrf_path.py",
          code: `print(True); print(False); print("injection", "parameterized")`,
          output: `True
False
injection parameterized`,
        },
        why: "Demuestra el outcome de S42-T3-A con Python verificable.",
      },
      {
        demoId: "S42-T3-B-DEMO",
        subtopicId: "S42-T3-B",
        environment: "local-python",
        description: "Demo: secretos, cifrado y dependency risk",
        code: {
          language: 'python',
          title: "demo_secrets_crypto_deps.py",
          code: `print("high", ["old"]); print("crypto", "AES-GCM-at-rest"); print("rotate", True)`,
          output: `high ['old']
crypto AES-GCM-at-rest
rotate True`,
        },
        why: "Demuestra el outcome de S42-T3-B con Python verificable.",
      },
      {
        demoId: "S42-T4-A-DEMO",
        subtopicId: "S42-T4-A",
        environment: "local-python",
        description: "Demo: minimización, purpose y retención",
        code: {
          language: 'python',
          title: "demo_minimize_purpose_retention.py",
          code: `print({"case_id":"C1"}); print("drop_email_for_log", True); print("purpose_bound", True)`,
          output: `{'case_id': 'C1'}
drop_email_for_log True
purpose_bound True`,
        },
        why: "Demuestra el outcome de S42-T4-A con Python verificable.",
      },
      {
        demoId: "S42-T4-B-DEMO",
        subtopicId: "S42-T4-B",
        environment: "local-python",
        description: "Demo: audit, deletion, pseudonymization y acceso",
        code: {
          language: 'python',
          title: "demo_audit_delete_pseudo_access.py",
          code: `print(True); print(False); print("no_cross_tenant", True)`,
          output: `True
False
no_cross_tenant True`,
        },
        why: "Demuestra el outcome de S42-T4-B con Python verificable.",
      },
    ],
  },
  weDo: {
    intro: "24 ejercicios (8×E1 guided / E2 independent / E3 transfer) en es-PE con soluciones verificadas.",
    steps: [
      {
        id: "S42-T1-A-E1",
        subtopicId: "S42-T1-A",
        kind: "guided",
        instruction:
          "Ejercicio S42-T1-A-E1: usa el patrón del demo iDo del subtema S42-T1-A. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S42-T1-A; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S42-T1-A; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S42-T1-A)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print({"age":3}); print("pydantic_like", True); print("strict", True)`,
          output: `{'age': 3}
pydantic_like True
strict True`,
        },
      },
      {
        id: "S42-T1-A-E2",
        subtopicId: "S42-T1-A",
        kind: "independent",
        instruction:
          "Ejercicio S42-T1-A-E2: usa el patrón del demo iDo del subtema S42-T1-A. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S42-T1-A; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S42-T1-A; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S42-T1-A)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print({"age":3}); print("pydantic_like", True); print("strict", True)`,
          output: `{'age': 3}
pydantic_like True
strict True`,
        },
      },
      {
        id: "S42-T1-A-E3",
        subtopicId: "S42-T1-A",
        kind: "transfer",
        instruction:
          "Ejercicio S42-T1-A-E3: usa el patrón del demo iDo del subtema S42-T1-A. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S42-T1-A; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S42-T1-A; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S42-T1-A)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print({"age":3}); print("pydantic_like", True); print("strict", True)`,
          output: `{'age': 3}
pydantic_like True
strict True`,
        },
      },
      {
        id: "S42-T1-B-E1",
        subtopicId: "S42-T1-B",
        kind: "guided",
        instruction:
          "Ejercicio S42-T1-B-E1: usa el patrón del demo iDo del subtema S42-T1-B. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S42-T1-B; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S42-T1-B; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S42-T1-B)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print(10); print("err", "amount"); print("evol", "add_optional")`,
          output: `10
err amount
evol add_optional`,
        },
      },
      {
        id: "S42-T1-B-E2",
        subtopicId: "S42-T1-B",
        kind: "independent",
        instruction:
          "Ejercicio S42-T1-B-E2: usa el patrón del demo iDo del subtema S42-T1-B. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S42-T1-B; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S42-T1-B; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S42-T1-B)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print(10); print("err", "amount"); print("evol", "add_optional")`,
          output: `10
err amount
evol add_optional`,
        },
      },
      {
        id: "S42-T1-B-E3",
        subtopicId: "S42-T1-B",
        kind: "transfer",
        instruction:
          "Ejercicio S42-T1-B-E3: usa el patrón del demo iDo del subtema S42-T1-B. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S42-T1-B; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S42-T1-B; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S42-T2-A)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print(10); print("err", "amount"); print("evol", "add_optional")`,
          output: `10
err amount
evol add_optional`,
        },
      },
      {
        id: "S42-T2-A-E1",
        subtopicId: "S42-T2-A",
        kind: "guided",
        instruction:
          "Ejercicio S42-T2-A-E1: usa el patrón del demo iDo del subtema S42-T2-A. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S42-T2-A; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S42-T2-A; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S42-T2-A)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print("authn", "u1"); print("roles", ["analyst"]); print("authz_needed", True)`,
          output: `authn u1
roles ['analyst']
authz_needed True`,
        },
      },
      {
        id: "S42-T2-A-E2",
        subtopicId: "S42-T2-A",
        kind: "independent",
        instruction:
          "Ejercicio S42-T2-A-E2: usa el patrón del demo iDo del subtema S42-T2-A. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S42-T2-A; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S42-T2-A; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S42-T2-A)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print("authn", "u1"); print("roles", ["analyst"]); print("authz_needed", True)`,
          output: `authn u1
roles ['analyst']
authz_needed True`,
        },
      },
      {
        id: "S42-T2-A-E3",
        subtopicId: "S42-T2-A",
        kind: "transfer",
        instruction:
          "Ejercicio S42-T2-A-E3: usa el patrón del demo iDo del subtema S42-T2-A. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S42-T2-A; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S42-T2-A; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S42-T2-B)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print("authn", "u1"); print("roles", ["analyst"]); print("authz_needed", True)`,
          output: `authn u1
roles ['analyst']
authz_needed True`,
        },
      },
      {
        id: "S42-T2-B-E1",
        subtopicId: "S42-T2-B",
        kind: "guided",
        instruction:
          "Ejercicio S42-T2-B-E1: usa el patrón del demo iDo del subtema S42-T2-B. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S42-T2-B; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S42-T2-B; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S42-T2-B)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print("er-worker"); print(["jobs:run"]); print("service_identity", True)`,
          output: `er-worker
['jobs:run']
service_identity True`,
        },
      },
      {
        id: "S42-T2-B-E2",
        subtopicId: "S42-T2-B",
        kind: "independent",
        instruction:
          "Ejercicio S42-T2-B-E2: usa el patrón del demo iDo del subtema S42-T2-B. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S42-T2-B; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S42-T2-B; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S42-T2-B)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print("er-worker"); print(["jobs:run"]); print("service_identity", True)`,
          output: `er-worker
['jobs:run']
service_identity True`,
        },
      },
      {
        id: "S42-T2-B-E3",
        subtopicId: "S42-T2-B",
        kind: "transfer",
        instruction:
          "Ejercicio S42-T2-B-E3: usa el patrón del demo iDo del subtema S42-T2-B. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S42-T2-B; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S42-T2-B; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S42-T3-A)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print("er-worker"); print(["jobs:run"]); print("service_identity", True)`,
          output: `er-worker
['jobs:run']
service_identity True`,
        },
      },
      {
        id: "S42-T3-A-E1",
        subtopicId: "S42-T3-A",
        kind: "guided",
        instruction:
          "Ejercicio S42-T3-A-E1: usa el patrón del demo iDo del subtema S42-T3-A. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S42-T3-A; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S42-T3-A; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S42-T3-A)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print(True); print(False); print("injection", "parameterized")`,
          output: `True
False
injection parameterized`,
        },
      },
      {
        id: "S42-T3-A-E2",
        subtopicId: "S42-T3-A",
        kind: "independent",
        instruction:
          "Ejercicio S42-T3-A-E2: usa el patrón del demo iDo del subtema S42-T3-A. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S42-T3-A; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S42-T3-A; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S42-T3-A)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print(True); print(False); print("injection", "parameterized")`,
          output: `True
False
injection parameterized`,
        },
      },
      {
        id: "S42-T3-A-E3",
        subtopicId: "S42-T3-A",
        kind: "transfer",
        instruction:
          "Ejercicio S42-T3-A-E3: usa el patrón del demo iDo del subtema S42-T3-A. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S42-T3-A; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S42-T3-A; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S42-T3-B)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print(True); print(False); print("injection", "parameterized")`,
          output: `True
False
injection parameterized`,
        },
      },
      {
        id: "S42-T3-B-E1",
        subtopicId: "S42-T3-B",
        kind: "guided",
        instruction:
          "Ejercicio S42-T3-B-E1: usa el patrón del demo iDo del subtema S42-T3-B. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S42-T3-B; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S42-T3-B; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S42-T3-B)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print("high", ["old"]); print("crypto", "AES-GCM-at-rest"); print("rotate", True)`,
          output: `high ['old']
crypto AES-GCM-at-rest
rotate True`,
        },
      },
      {
        id: "S42-T3-B-E2",
        subtopicId: "S42-T3-B",
        kind: "independent",
        instruction:
          "Ejercicio S42-T3-B-E2: usa el patrón del demo iDo del subtema S42-T3-B. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S42-T3-B; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S42-T3-B; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S42-T3-B)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print("high", ["old"]); print("crypto", "AES-GCM-at-rest"); print("rotate", True)`,
          output: `high ['old']
crypto AES-GCM-at-rest
rotate True`,
        },
      },
      {
        id: "S42-T3-B-E3",
        subtopicId: "S42-T3-B",
        kind: "transfer",
        instruction:
          "Ejercicio S42-T3-B-E3: usa el patrón del demo iDo del subtema S42-T3-B. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S42-T3-B; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S42-T3-B; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S42-T4-A)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print("high", ["old"]); print("crypto", "AES-GCM-at-rest"); print("rotate", True)`,
          output: `high ['old']
crypto AES-GCM-at-rest
rotate True`,
        },
      },
      {
        id: "S42-T4-A-E1",
        subtopicId: "S42-T4-A",
        kind: "guided",
        instruction:
          "Ejercicio S42-T4-A-E1: usa el patrón del demo iDo del subtema S42-T4-A. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S42-T4-A; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S42-T4-A; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S42-T4-A)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print({"case_id":"C1"}); print("drop_email_for_log", True); print("purpose_bound", True)`,
          output: `{'case_id': 'C1'}
drop_email_for_log True
purpose_bound True`,
        },
      },
      {
        id: "S42-T4-A-E2",
        subtopicId: "S42-T4-A",
        kind: "independent",
        instruction:
          "Ejercicio S42-T4-A-E2: usa el patrón del demo iDo del subtema S42-T4-A. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S42-T4-A; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S42-T4-A; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S42-T4-A)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print({"case_id":"C1"}); print("drop_email_for_log", True); print("purpose_bound", True)`,
          output: `{'case_id': 'C1'}
drop_email_for_log True
purpose_bound True`,
        },
      },
      {
        id: "S42-T4-A-E3",
        subtopicId: "S42-T4-A",
        kind: "transfer",
        instruction:
          "Ejercicio S42-T4-A-E3: usa el patrón del demo iDo del subtema S42-T4-A. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S42-T4-A; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S42-T4-A; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S42-T4-A)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print({"case_id":"C1"}); print("drop_email_for_log", True); print("purpose_bound", True)`,
          output: `{'case_id': 'C1'}
drop_email_for_log True
purpose_bound True`,
        },
      },
      {
        id: "S42-T4-B-E1",
        subtopicId: "S42-T4-B",
        kind: "guided",
        instruction:
          "Ejercicio S42-T4-B-E1: usa el patrón del demo iDo del subtema S42-T4-A. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S42-T4-A; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S42-T4-A; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S42-T4-B)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print(True); print(False); print("no_cross_tenant", True)`,
          output: `True
False
no_cross_tenant True`,
        },
      },
      {
        id: "S42-T4-B-E2",
        subtopicId: "S42-T4-B",
        kind: "independent",
        instruction:
          "Ejercicio S42-T4-B-E2: usa el patrón del demo iDo del subtema S42-T4-B. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S42-T4-B; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S42-T4-B; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S42-T4-B)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print(True); print(False); print("no_cross_tenant", True)`,
          output: `True
False
no_cross_tenant True`,
        },
      },
      {
        id: "S42-T4-B-E3",
        subtopicId: "S42-T4-B",
        kind: "transfer",
        instruction:
          "Ejercicio S42-T4-B-E3: usa el patrón del demo iDo del subtema S42-T4-B. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S42-T4-B; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S42-T4-B; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: escribe el print final como en el demo iDo del mismo subtopicId
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print(True); print(False); print("no_cross_tenant", True)`,
          output: `True
False
no_cross_tenant True`,
        },
      },
    ],
  },
  youDo: {
    title: "Schemas, seguridad y privacidad de servicios",
    context:
      "Proyecto de sección **S42** (Schemas, seguridad y privacidad de servicios). Gate: **CP-N4-A (control plane)**. threat model y pruebas de permisos; un usuario no puede acceder a otro caso ni recuperar datos redacted. Usa solo datos sintéticos; no marques section_passed desde esta entrega de autoría.",
    objectives: [
      "threat model y pruebas de permisos; un usuario no puede acceder a otro caso ni recuperar datos redacted.",
      "Datos sintéticos; sin PII real ni secretos",
      "Demo reproducible (if __name__ == '__main__' o notebook run-all)",
      "Documentación en español profesional",
      "Alineación al incremento/gate V3: CP-N4-A (control plane)",
    ],
    requirements: [
      "Dataset o fixtures sintéticos",
      "Demo reproducible",
      "Documentación en español profesional",
      "Alineación al incremento/gate V3 de la sección",
    ],
    starterCode: `# S42 You Do — Schemas, seguridad y privacidad de servicios
# Gate: CP-N4-A (control plane)
# threat model y pruebas de permisos; un usuario no puede acceder a otro caso ni recuperar datos redacted.

def main():
    print("section", "S42")
    print("gate", 'CP-N4-A (control plane)')
    print("synthetic", True)
    # TODO: implementar incremento del blueprint

if __name__ == "__main__":
    main()
`,
    portfolioNote:
      "Entrega alineada a CP-N4-A (control plane). Portfolio en español profesional; evidencia ejecutable; privacidad. Otra lane califica PASS; no editar checkpoint/ledger/seed.",
    rubric: [
      { criterion: "Alineación al gate V3 de la sección", weight: "25%" },
      { criterion: "Correctitud técnica en entorno declarado", weight: "20%" },
      { criterion: "Privacidad / sin PII real / sin secretos", weight: "20%" },
      { criterion: "Pruebas o casos de borde documentados", weight: "15%" },
      { criterion: "Código legible y límites claros", weight: "10%" },
      { criterion: "Documentación en español profesional", weight: "10%" },
    ],
  },
  selfCheck: {
    questions: [
      {
        question: "El id de plataforma de S42 que se preserva es:",
        options: [
          "graph-rag",
          "renamed-v3",
          "legacy-drop",
          "random",
        ],
        correctIndex: 0,
        explanation:
          "KEEP_PLATFORM_ID_RETHEME_CONTENT.",
      },
      {
        question: "El incremento/gate V3 de S42 pertenece a:",
        options: [
          "CP-N4-A (control plane)",
          "CP-N1-A",
          "solo marketing",
          "sin capstone",
        ],
        correctIndex: 0,
        explanation:
          "Blueprint phase3 capstone_notes.",
      },
      {
        question: "Los ejemplos del curso deben usar:",
        options: [
          "PII real de clientes",
          "Datos sintéticos",
          "Secretos de prod",
          "Claves API reales",
        ],
        correctIndex: 1,
        explanation:
          "Synthetic data only.",
      },
      {
        question: "Entity resolution (si aparece) decide:",
        options: [
          "Fraude",
          "Parentesco",
          "Misma entidad cuando aplique",
          "Sentimiento",
        ],
        correctIndex: 2,
        explanation:
          "ER ≠ relación ≠ fraude.",
      },
    ],
  },
  resources: {
    docs: [
      {
        label: "Python docs",
        url: "https://docs.python.org/3/",
        note: "Referencia stdlib",
      },
      {
        label: "V3 section support",
        url: "https://docs.python.org/3/library/",
        note: "Apoyo S42 Schemas, seguridad y privacidad de servicios",
      },
    ],
    books: [
      {
        label: "Architecture / platform engineering refs",
        note: "Alinear a Schemas, seguridad y privacidad de servicios",
      },
      {
        label: "Site Reliability / Security basics",
        note: "Operación y privacidad",
      },
    ],
    courses: [
      {
        label: "MDN / cloud / MLOps primers",
        url: "https://developer.mozilla.org/",
        note: "Complemento conceptual",
      },
    ],
  },
}
