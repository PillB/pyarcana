import type { CourseSection } from '../../types'

export const section24: CourseSection = {
  id: "rpa-advanced",
  index: 24,
  title: "OCR y Document AI",
  shortTitle: "OCR Document AI",
  tagline: "extrae campos de documentos sintéticos, conserva bounding boxes/evidencia, abstiene bajo confidence y mide cada campo crítico",
  estimatedHours: 19,
  level: "Competente",
  phase: 1,
  icon: "Bot",
  accentColor: "bg-gradient-to-br from-blue-500 to-indigo-600",
  jobRelevance:
    "El **document intake** de CP-N2-C convierte imágenes sintéticas en campos con evidencia (bbox, confidence) y cola de revisión. OCR vía contrato común `real`/`fake`; abstenerse bajo confidence es control de calidad, no veredicto de fraude. Id legacy `rpa-advanced` se conserva; el path V3 es OCR/Document AI, no RPA de escritorio avanzado.",
  learningOutcomes: [
    { text: "Preprocesar imágenes (DPI, deskew, crop, contraste)" },
    { text: "Corregir ruido y orientación" },
    { text: "Ejecutar OCR con idiomas, layout y confidence" },
    { text: "Extraer texto, tablas y pares clave–valor" },
    { text: "Normalizar a schema de extracción" },
    { text: "Validar cross-field y encolar revisión" },
    { text: "Evaluar exactitud por campo en golden set" },
    { text: "Manejar privacidad, hostiles y fallback" },
  ],
  theory: [
    {
      heading: "OCR Document AI para intake CP-N2-C",
      paragraphs: [
        "Aquí construyes el **document intake** de CP-N2-C: imagen sintética → preproceso → adapter OCR (confidence + bbox) → normalización a schema → validación cross-field → golden set por campo. En un backoffice sintético de facturas en Lima, el objetivo es encolar revisión, no “cerrar” casos por score. Progressive disclosure: demos stdlib; Tesseract solo si el runtime lo declara.",
        "Todo documento es **sintético** (facturas demo, IDs fake). Conservas **bounding boxes** como evidencia y te **abstienes** si confidence < umbral de campo crítico (p. ej. RUC). Coincidir totales o RUC **no prueba fraude** ni parentesco: solo genera `reasons[]` para humanos. Fail-closed de ética: `auto_fraud_label=False` siempre en este path.",
        "Orden: **T1 Imagen** (DPI, deskew, ruido, orientación) → **T2 OCR** (idiomas, layout, KV/tablas) → **T3 Extracción** (schema, validación, cola) → **T4 Evaluación** (golden, privacidad, hostiles, fallback). Frontera real/fake: TesseractAdapter vs FakeOcrAdapter nunca se confunden en contract tests.",
      ],
      callout: {
        type: "info",
        title: "Frontera real/fake",
        content:
          "`TesseractAdapter` llama un motor real si está instalado. `FakeOcrAdapter` nunca se presenta como OCR: devuelve observaciones fijadas para contract tests de parsing, abstención y evaluación.",
      },
    },
    {
      heading: "DPI, deskew, crop y contraste",
      subtopicId: "S24-T1-A",
      paragraphs: [
        "**DPI** bajo degrada OCR de tipografía pequeña en facturas sintéticas; el lab eleva a **≥200** (ideal **300** efectivos) antes del motor. **Deskew** corrige inclinación de escaneo móvil; **crop** quita márgenes negros; **contraste** ayuda tinta débil **sin inventar dígitos** — el preproceso no es un “mejorador de fraude”.",
        "Modelamos ops como transformaciones sobre **metadatos** de imagen sintética (`w, h, dpi, skew_deg, contrast`): no necesitas OpenCV instalado para aprender el **contrato** del pipeline. Cada op deja flags (`deskew_applied`) auditables en el run de intake CP-N2-C.",
        "Pipeline canónico: `load → dpi_check → deskew → crop → contrast → OCR`. Caso PE sintético: foto de boleta a 96 DPI y 1.8° de sesgo; tras preproceso `dpi=200`, `deskew_applied=True`, crop 2–5% y contrast escalado — listo para adapter con `lang=spa`.",
      ],
      code: {
        language: 'python',
        title: "preprocess.py",
        code: `def preprocess_meta(img):
    # img: dict sintético
    out = dict(img)
    out["dpi"] = max(img.get("dpi", 72), 200)
    ang = img.get("skew_deg", 0.0)
    out["skew_deg"] = 0.0 if abs(ang) < 0.5 else 0.0  # deskew simulado
    out["deskew_applied"] = abs(ang) >= 0.5
    # crop 2% margins
    w, h = img["w"], img["h"]
    out["crop_box"] = (int(0.02*w), int(0.02*h), int(0.98*w), int(0.98*h))
    out["contrast"] = min(1.5, img.get("contrast", 1.0) * 1.2)
    return out

meta = preprocess_meta({"w": 1000, "h": 1400, "dpi": 96, "skew_deg": 1.8, "contrast": 1.0})
print(meta["dpi"], meta["deskew_applied"], meta["crop_box"][0], round(meta["contrast"], 2))`,
        output: `200 True 20 1.2`,
      },
      callout: {
        type: "tip",
        title: "200+ DPI",
        content:
          "Para texto pequeño, apunta a 300 DPI efectivos antes de OCR.",
      },
    },
    {
      heading: "ruido y orientación",
      subtopicId: "S24-T1-B",
      paragraphs: [
        "Ruido (sal/pimienta, compresión JPEG) y **orientación** (0/90/180/270) rompen el layout y pueden dar confidence alta en basura si OCR corre al revés. Detecta orientación por scores de señales (cabecera, densidad) o modelo; corrige **antes** de OCR.",
        "Simulamos score por rotación y un denoise binario sobre flags 0/1. Si score_orient < 0.5, el intake prefiere manual_orient (humano gira la página) antes de forzar auto con baja certeza — fail-closed de calidad.",
        "Caso sintético: página con scores {0:0.1, 90:0.05, 180:0.7, 270:0.15} → 180°. Un OCR previo a orientar produce campos RUC permutados; el runbook exige fix_orientation en el preflight del batch nocturno.",
      ],
      code: {
        language: 'python',
        title: "noise_orient.py",
        code: `def fix_orientation(page_signals):
    # page_signals: scores por rotación
    best = max(page_signals, key=page_signals.get)
    return best, page_signals[best]

def denoise_binary(flags):
    # flags: lista 0/1 ruido
    return [0 if f == 1 and True else f for f in flags]  # “limpia” ruido marcado

ori, score = fix_orientation({0: 0.1, 90: 0.05, 180: 0.7, 270: 0.15})
print("orientation", ori, "score", score)
print("denoise", denoise_binary([0, 1, 0, 1, 0]))`,
        output: `orientation 180 score 0.7
denoise [0, 0, 0, 0, 0]`,
      },
      callout: {
        type: "warning",
        title: "OCR antes de orientar",
        content:
          "Correr OCR sin corregir 180° produce campos basura con alta confianza falsa a veces.",
      },
    },
    {
      heading: "idiomas, layout y confidence",
      subtopicId: "S24-T2-A",
      paragraphs: [
        "Configura **idiomas** (spa+eng) según el corpus: facturas PE en español con tokens EN de software. El **layout** (bloques, columnas) guía el orden de lectura; no concatenes columnas a ciegas o mezclas “Total” con líneas de ítem.",
        "Cada token/campo trae **confidence** 0–1. Umbral de **abstención por campo crítico** (RUC, total): un promedio global esconde el dígito débil. Si RUC conf < 0.85 → review_queue, no inventes dígitos ni “corrijas” con checksum inventado sin política.",
        "Contrato del adapter: ocr_page(tokens, lang) → lista {text, conf, bbox, lang}. Low-conf se lista para HITL. FakeOcrAdapter devuelve observaciones fijadas para tests de parsing; nunca se presenta como motor real en logs de producción del curso.",
      ],
      code: {
        language: 'python',
        title: "ocr_conf.py",
        code: `def ocr_page(tokens, lang="spa"):
    return [{"text": t["text"], "conf": t["conf"], "bbox": t["bbox"], "lang": lang} for t in tokens]

tokens = [
    {"text": "FACTURA", "conf": 0.98, "bbox": [10, 10, 120, 40]},
    {"text": "RUC", "conf": 0.91, "bbox": [10, 50, 50, 70]},
    {"text": "20123456789", "conf": 0.72, "bbox": [60, 50, 200, 70]},
]
out = ocr_page(tokens)
low = [t for t in out if t["conf"] < 0.85]
print("n", len(out), "low_conf", [(t["text"], t["conf"]) for t in low])`,
        output: `n 3 low_conf [('20123456789', 0.72)]`,
      },
      callout: {
        type: "info",
        title: "Abstención",
        content:
          "Si RUC < 0.85 → review_queue, no inventes dígitos.",
      },
    },
    {
      heading: "texto, tablas y pares clave–valor",
      subtopicId: "S24-T2-B",
      paragraphs: [
        "Extrae **texto corrido**, **tablas** (filas/cols) y **KV** (RUC→valor, Total→monto) con bbox de evidencia del **valor**, no solo del label. Heurística KV didáctica: “Clave: valor” en la misma línea tras split de “:”.",
        "Tablas sintéticas como listas de listas con header en fila 0; n_data_rows = len(table)-1. Ítems de factura demo alimentan validación de suma vs total, siempre con tolerancia monetaria.",
        "Caso PE: líneas “RUC: 20123456789” y “Total: 150.00” → dict KV; tabla 2 ítems. Evidencia: adjunta bbox del valor RUC al field dict para que el revisor resalte en UI sin re-OCRizar.",
      ],
      code: {
        language: 'python',
        title: "kv_tables.py",
        code: `lines = [
    {"text": "RUC: 20123456789", "y": 50},
    {"text": "Total: 150.00", "y": 80},
]

def kv_from_lines(lines):
    kv = {}
    for ln in lines:
        if ":" in ln["text"]:
            k, v = ln["text"].split(":", 1)
            kv[k.strip()] = v.strip()
    return kv

table = [["Item", "Monto"], ["A", "100"], ["B", "50"]]
print(kv_from_lines(lines))
print("table_rows", len(table)-1, "header", table[0])`,
        output: `{'RUC': '20123456789', 'Total': '150.00'}
table_rows 2 header ['Item', 'Monto']`,
      },
      callout: {
        type: "tip",
        title: "Evidencia por campo",
        content:
          "Guarda bbox del valor, no solo del label.",
      },
    },
    {
      heading: "schema y normalización",
      subtopicId: "S24-T3-A",
      paragraphs: [
        "Un **schema** define campos, tipos y required (ruc str11, total float, fecha date). Normaliza monedas (quita PEN/comas), fechas a ISO y RUC a solo dígitos. Output canónico: {field, value, conf, bbox, source_doc_id} + schema_version en metadata del run.",
        "Si tras normalizar RUC no tiene longitud 11, value=None y el validador acumula reason — no rellenes con ceros mágicos. Fechas DD/MM/YYYY de boletas sintéticas pasan a YYYY-MM-DD con datetime.strptime.",
        "Versionar schema evita que un deploy cambie el significado de total_incl_igv a mitad de un golden set. Contrato lab: norm_ruc / norm_total / norm_fecha puras, testeables sin I/O de red.",
      ],
      code: {
        language: 'python',
        title: "schema_norm.py",
        code: `import re
from datetime import datetime

SCHEMA = {"ruc": "str11", "total": "float", "fecha": "date"}

def norm_ruc(s):
    d = re.sub(r"\\D", "", s)
    return d if len(d) == 11 else None

def norm_total(s):
    s = s.replace(",", "").replace("PEN", "").strip()
    return float(s)

def norm_fecha(s):
    for fmt in ("%d/%m/%Y", "%Y-%m-%d"):
        try:
            return datetime.strptime(s, fmt).date().isoformat()
        except ValueError:
            pass
    return None

raw = {"ruc": "20.123456789", "total": "150,00", "fecha": "15/01/2026"}
print({
    "ruc": norm_ruc(raw["ruc"]),
    "total": norm_total(raw["total"]),
    "fecha": norm_fecha(raw["fecha"]),
    "schema": "invoice.v1",
})`,
        output: `{'ruc': '20123456789', 'total': 15000.0, 'fecha': '2026-01-15', 'schema': 'invoice.v1'}`,
      },
      callout: {
        type: "warning",
        title: "None ≠ 0",
        content:
          "Si no normaliza, deja null y manda a revisión; no pongas 0.0.",
      },
    },
    {
      heading: "validación cross-field y cola de revisión",
      subtopicId: "S24-T3-B",
      paragraphs: [
        "Cross-field: `abs(sum(líneas) - total) > 0.01` → `needs_review`. RUC None → `reasons.append('ruc_missing')`. Varias reasons se acumulan; el documento no se auto-acepta si la lista no está vacía o conf de críticos es baja.",
        "La cola de revisión es el **producto**: `status=review`, `reasons[]`, evidencias bbox. **Mismatch ≠ fraude**: imprime política review_not_fraud para entrenar el hábito. Humanos investigan; el sistema solo encola.",
        "Caso sintético: total 10.0 vs líneas 4+5 → needs_review; ruc missing → ['ruc_missing']. El intake batch marca human_queue y sigue con el siguiente doc sin bloquear todo el archivo.",
      ],
      code: {
        language: 'python',
        title: "crossfield.py",
        code: `def validate(doc):
    reasons = []
    lines_sum = sum(doc.get("lines", []))
    if abs(lines_sum - doc["total"]) > 0.01:
        reasons.append("total_mismatch")
    if doc.get("ruc") is None:
        reasons.append("ruc_missing")
    if doc.get("conf_ruc", 1) < 0.85:
        reasons.append("ruc_low_conf")
    status = "auto" if not reasons else "needs_review"
    return status, reasons

print(validate({"total": 150.0, "lines": [100.0, 50.0], "ruc": "20123456789", "conf_ruc": 0.9}))
print(validate({"total": 150.0, "lines": [100.0, 40.0], "ruc": None, "conf_ruc": 0.5}))
print("note: validation≠fraud_label")`,
        output: `('auto', [])
('needs_review', ['total_mismatch', 'ruc_missing', 'ruc_low_conf'])
note: validation≠fraud_label`,
      },
      callout: {
        type: "danger",
        title: "Sin label de fraude",
        content:
          "Una inconsistencia contable es cola de revisión, no acusación.",
      },
    },
    {
      heading: "golden set sintético, exactitud por campo y cobertura",
      subtopicId: "S24-T4-A",
      paragraphs: [
        "Un **golden set** de páginas/campos etiquetados a mano mide exactitud por campo (ruc, total, fecha), no un accuracy global engañoso. Campo crítico tiene SLO propio: caer en RUC es más grave que en glosa opcional.",
        "Accuracy = correct/n; por campo se compara pred vs true en lista de dicts. coverage_auto = auto/(auto+review) mide cuánto pasa sin HITL — subir cobertura bajando umbral sin medir error es anti-patrón.",
        "Caso PE de lab: 3/4 correctos → 0.75; ruc acc 0.5 en dos filas; auto=7,review=3 → coverage 0.7. Reporta métricas en el paquete de CP-N2-C sin pretender que OCR “valida identidad legal”.",
      ],
      code: {
        language: 'python',
        title: "golden_eval.py",
        code: `golden = [
    {"id": "d1", "ruc_pred": "20123456789", "ruc_true": "20123456789", "total_pred": 150.0, "total_true": 150.0},
    {"id": "d2", "ruc_pred": "20123456780", "ruc_true": "20123456789", "total_pred": 99.0, "total_true": 100.0},
]

def field_acc(rows, field):
    ok = sum(1 for r in rows if r[f"{field}_pred"] == r[f"{field}_true"])
    return ok / len(rows)

print("acc_ruc", field_acc(golden, "ruc"))
print("acc_total", field_acc(golden, "total"))
coverage_auto = 0.5  # sintético
print("coverage_auto", coverage_auto)`,
        output: `acc_ruc 0.5
acc_total 0.5
coverage_auto 0.5`,
      },
      callout: {
        type: "tip",
        title: "Por campo",
        content:
          "Reporta acc_ruc, acc_total, abstention_rate por separado.",
      },
    },
    {
      heading: "privacidad, archivos hostiles y fallback",
      subtopicId: "S24-T4-B",
      paragraphs: [
        "Privacidad: solo fixtures sintéticos; no subas PDFs reales de clientes al sandbox. Allowlist mime pdf/png/jpeg; zip u otros → reject. Size cap (p. ej. 5e6 bytes) mitiga zip-bomb y DoS al worker OCR.",
        "Archivos hostiles (corrupción, ratio de compresión absurdo) se rechazan o van a cuarentena. Fallback operativo: ocr_fail → human_rescan (re-escaneo o tipeo asistido), no reintentar 100 veces el mismo binario roto.",
        "Contrato de seguridad del intake: fail-closed en mime/size; logs sin PII real; Fake vs Real adapters etiquetados. El revisor ve reasons y bbox, nunca un badge de “fraude detectado por OCR”.",
      ],
      code: {
        language: 'python',
        title: "hostile_gate.py",
        code: `MAX_BYTES = 5_000_000
ALLOWED = {"application/pdf", "image/png", "image/jpeg"}

def gate_file(meta):
    if meta["mime"] not in ALLOWED:
        return "reject", "mime"
    if meta["n_bytes"] > MAX_BYTES:
        return "reject", "size"
    if meta.get("encrypted"):
        return "review", "encrypted"
    return "ok", "pass"

print(gate_file({"mime": "image/png", "n_bytes": 120_000}))
print(gate_file({"mime": "application/zip", "n_bytes": 10}))
print(gate_file({"mime": "application/pdf", "n_bytes": 9_000_000}))`,
        output: `('ok', 'pass')
('reject', 'mime')
('reject', 'size')`,
      },
      callout: {
        type: "warning",
        title: "Minimización",
        content:
          "Borra imágenes crudas cuando solo necesitas campos + bbox en el expediente.",
      },
    },
  ],
  iDo: {
    intro: "Te muestro document intake CP-N2-C: preproceso, OCR con confidence, schema, cross-field y golden — sin inferir fraude.",
    steps: [
      {
        demoId: "S24-T1-A-DEMO",
        subtopicId: "S24-T1-A",
        environment: "local",
        description: "DPI/deskew/crop/contraste sobre meta sintética.",
        code: {
          language: 'python',
          title: "demo.py",
          code: `def preprocess(img):
    out = dict(img)
    out["dpi"] = max(out.get("dpi", 72), 200)
    out["deskew"] = abs(out.get("skew_deg", 0)) >= 0.5
    return out

print(preprocess({"w": 800, "h": 1000, "dpi": 72, "skew_deg": 2.0}))
print("min_dpi", 200)
print("ok", True)
`,
          output: `200 True`,
        },
        why: "Preproceso mejora OCR más que un modelo fancy.",
      },
      {
        demoId: "S24-T1-B-DEMO",
        subtopicId: "S24-T1-B",
        environment: "local",
        description: "Corregir orientación por score máximo.",
        code: {
          language: 'python',
          title: "demo.py",
          code: `def best_orientation(scores):
    return max(scores, key=scores.get)

print(best_orientation({0: 0.2, 180: 0.75, 90: 0.05}))
print("orient", True)
print("ok", True)
`,
          output: `180`,
        },
        why: "Orientación incorrecta invalida el layout.",
      },
      {
        demoId: "S24-T2-A-DEMO",
        subtopicId: "S24-T2-A",
        environment: "local",
        description: "OCR con confidence y filtro de bajos.",
        code: {
          language: 'python',
          title: "demo.py",
          code: `def low_confidence(toks, thr=0.85):
    return [t for t in toks if t["c"] < thr]

print(low_confidence([{"t": "RUC", "c": 0.9}, {"t": "20X", "c": 0.55}]))
print("abstain_fields", True)
print("ok", True)
`,
          output: `[{'t': '20X', 'c': 0.55}]`,
        },
        why: "Low conf → abstenerse.",
      },
      {
        demoId: "S24-T2-B-DEMO",
        subtopicId: "S24-T2-B",
        environment: "local",
        description: "Extraer KV desde líneas con dos puntos.",
        code: {
          language: 'python',
          title: "demo.py",
          code: `def parse_kv(lines):
    kv = {}
    for ln in lines:
        k, v = ln.split(":", 1)
        kv[k.strip()] = v.strip()
    return kv

print(parse_kv(["RUC: 20123456789", "Total: 10"]))
print("kv", True)
print("ok", True)
`,
          output: `{'RUC': '20123456789', 'Total': '10'}`,
        },
        why: "KV con evidencia textual mínima.",
      },
      {
        demoId: "S24-T3-A-DEMO",
        subtopicId: "S24-T3-A",
        environment: "local",
        description: "Normalizar RUC a 11 dígitos.",
        code: {
          language: 'python',
          title: "demo.py",
          code: `import re

def normalize_ruc(s):
    d = re.sub(r"\D", "", s)
    return d, len(d) == 11

print(normalize_ruc("20.123456789"))
print("schema", True)
print("ok", True)
`,
          output: `20123456789 True`,
        },
        why: "Schema canónico evita basura aguas abajo.",
      },
      {
        demoId: "S24-T3-B-DEMO",
        subtopicId: "S24-T3-B",
        environment: "local",
        description: "Validación total vs suma de líneas.",
        code: {
          language: 'python',
          title: "demo.py",
          code: `def cross_field(total, lines, eps=1e-6):
    return "ok" if abs(sum(lines) - total) < eps else "needs_review"

print(cross_field(150.0, [100.0, 50.0]))
print("not_fraud", True)
print("ok", True)
`,
          output: `ok`,
        },
        why: "Cross-field manda a revisión, no etiqueta fraude.",
      },
      {
        demoId: "S24-T4-A-DEMO",
        subtopicId: "S24-T4-A",
        environment: "local",
        description: "Exactitud por campo en golden sintético.",
        code: {
          language: 'python',
          title: "demo.py",
          code: `def field_accuracy(g):
    return sum(1 for r in g if r["p"] == r["t"]) / len(g)

print(field_accuracy([{"p": "A", "t": "A"}, {"p": "B", "t": "A"}]))
print("golden", True)
print("ok", True)
`,
          output: `0.5`,
        },
        why: "Métricas por campo crítico.",
      },
      {
        demoId: "S24-T4-B-DEMO",
        subtopicId: "S24-T4-B",
        environment: "local",
        description: "Gate de mime/tamaño para archivos hostiles.",
        code: {
          language: 'python',
          title: "demo.py",
          code: `def accept_doc(meta, max_n=5_000_000):
    ok = meta.get("mime") == "application/pdf" and meta.get("n", 0) < max_n
    return "ok" if ok else "reject"

print(accept_doc({"mime": "application/pdf", "n": 100}))
print("hostile_guard", True)
print("ok", True)
`,
          output: `ok`,
        },
        why: "Fallback y límites antes del OCR.",
      },
    ],
  },
  weDo: {
    intro: "24 ejercicios de preproceso, orientación, OCR/KV, schema, validación, golden y archivos hostiles.",
    steps: [
      {
        id: "S24-T1-A-E1",
        subtopicId: "S24-T1-A",
        kind: "guided",
        instruction:
          "Preproceso intake: dpi=96 de escaneo sintético. Si dpi<200, eleva con max(dpi,200) e imprime el entero resultante. Contrato: no inventa detalle óptico; solo metadata. Pass: 200.",
        hint: "max()",
        hints: [
          "contrato I/O en instruction",
          "compara output con solution",
          "datos sintéticos only",
        ],
        edgeCases: ["upscaling no crea detalle real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-024 · DPI mínimo 200
# DEFECT: no eleva dpi
dpi=96
print(dpi)
print('ok', True)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `dpi=96
print(max(dpi, 200))`,
          output: `200`,
        },
      },
      {
        id: "S24-T1-A-E2",
        subtopicId: "S24-T1-A",
        kind: "independent",
        instruction:
          "Deskew flag: skew=1.2 grados. deskew_applied = abs(skew)>=0.5; imprime el booleano. Contrato: umbral didáctico 0.5°. Pass: True. Usa solo fixtures sintéticos del lab; la salida debe coincidir exactamente con el solution output del grader.",
        hint: "abs",
        hints: [
          "contrato I/O en instruction",
          "compara output con solution",
          "datos sintéticos only",
        ],
        edgeCases: ["umbral empírico"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-024 · deskew si |skew|>=0.5
# DEFECT: umbral invertido
skew=1.2
print(abs(skew) < 0.5)
print('ok', True)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `skew=1.2
print(abs(skew) >= 0.5)`,
          output: `True`,
        },
      },
      {
        id: "S24-T1-A-E3",
        subtopicId: "S24-T1-A",
        kind: "transfer",
        instruction:
          "Crop 5% márgenes en lienzo w=h=1000: imprime tupla (x0,y0,x1,y1)=(50,50,950,950). Contrato: enteros; origen esquina superior izquierda. Pass: (50, 50, 950, 950).",
        hint: "int 0.05*w",
        hints: [
          "contrato I/O en instruction",
          "compara output con solution",
          "datos sintéticos only",
        ],
        edgeCases: ["no crops contenido útil"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-024 · crop 5% márgenes
# DEFECT: usa m=0 (sin crop)
w=h=1000
m=0.0
print((int(m*w), int(m*h), int((1-m)*w), int((1-m)*h)))
print('ok', True)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `w=h=1000
m=0.05
print((int(m*w), int(m*h), int((1-m)*w), int((1-m)*h)))`,
          output: `(50, 50, 950, 950)`,
        },
      },
      {
        id: "S24-T1-B-E1",
        subtopicId: "S24-T1-B",
        kind: "guided",
        instruction:
          "Orientación: scores s={0:0.1,90:0.8}. Elige la rotación (key) de mayor score e imprime el entero de grados. Contrato: max(s, key=s.get). Pass: 90. Usa solo fixtures sintéticos del lab; la salida debe coincidir exactamente con el solution output del grader.",
        hint: "max key=",
        hints: [
          "contrato I/O en instruction",
          "compara output con solution",
          "datos sintéticos only",
        ],
        edgeCases: ["empates"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-024 · orientación por max score
# DEFECT: elige min score
s={0:0.1,90:0.8}
print(min(s, key=s.get))
print('ok', True)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `s={0:0.1,90:0.8}
print(max(s, key=s.get))`,
          output: `90`,
        },
      },
      {
        id: "S24-T1-B-E2",
        subtopicId: "S24-T1-B",
        kind: "independent",
        instruction:
          "Ruido binario: flags=[0,1,1,0] donde 1=píxel ruido marcado. Cuenta unos e imprime 2. Contrato: sum(flags) o count. Pass: 2. Usa solo fixtures sintéticos del lab; la salida debe coincidir exactamente con el solution output del grader.",
        hint: "sum",
        hints: [
          "contrato I/O en instruction",
          "compara output con solution",
          "datos sintéticos only",
        ],
        edgeCases: ["modelo real de denoise"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-024 · contar flags de ruido
# DEFECT: usa len no sum
flags=[0,1,1,0]
print(len(flags))
print('ok', True)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `flags=[0,1,1,0]
print(sum(flags))`,
          output: `2`,
        },
      },
      {
        id: "S24-T1-B-E3",
        subtopicId: "S24-T1-B",
        kind: "transfer",
        instruction:
          "Gate de orientación: score=0.4. Si score_orient<0.5 imprime 'manual_orient' else 'auto'. Contrato: fail-closed a humano. Pass: manual_orient. Usa solo fixtures sintéticos del lab; la salida debe coincidir exactamente con el solution output del grader.",
        hint: "umbral",
        hints: [
          "contrato I/O en instruction",
          "compara output con solution",
          "datos sintéticos only",
        ],
        edgeCases: ["página en blanco"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-024 · manual_orient si score<0.5
# DEFECT: siempre auto
score=0.4
print('auto' if score < 0.5 else 'manual_orient')
print('ok', True)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `score=0.4
print('manual_orient' if score < 0.5 else 'auto')`,
          output: `manual_orient`,
        },
      },
      {
        id: "S24-T2-A-E1",
        subtopicId: "S24-T2-A",
        kind: "guided",
        instruction:
          "Filtro de confidence: toks con conf 0.9 y 0.5. Quédate textos con conf>=0.85 e imprime la lista de text. Contrato: no mutar conf. Pass: ['A']. Usa solo fixtures sintéticos del lab; la salida debe coincidir exactamente con el solution output del grader.",
        hint: "list comp",
        hints: [
          "contrato I/O en instruction",
          "compara output con solution",
          "datos sintéticos only",
        ],
        edgeCases: ["umbral por campo"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-024 · tokens conf>=0.85
# DEFECT: umbral 0.5 (demasiado bajo)
toks=[{'text':'A','conf':0.9},{'text':'B','conf':0.5}]
print([t['text'] for t in toks if t['conf']>=0.5])
print('ok', True)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `toks=[{'text':'A','conf':0.9},{'text':'B','conf':0.5}]
print([t['text'] for t in toks if t['conf']>=0.85])`,
          output: `['A']`,
        },
      },
      {
        id: "S24-T2-A-E2",
        subtopicId: "S24-T2-A",
        kind: "independent",
        instruction:
          "Idioma por defecto del adapter PE: construye resultado OCR simulado con lang 'spa' e imprime lang. Contrato: string fijo didáctico. Pass: spa. Usa solo fixtures sintéticos del lab; la salida debe coincidir exactamente con el solution output del grader.",
        hint: "parámetro default",
        hints: [
          "contrato I/O en instruction",
          "compara output con solution",
          "datos sintéticos only",
        ],
        edgeCases: ["spa+eng"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-024 · lang spa por defecto
def ocr(text, lang='eng'):
    # DEFECT: default eng
    return {'text': text, 'lang': lang}
print(ocr('Hola')['lang'])
print('ok', True)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `def ocr(text, lang='spa'):
    return {'text': text, 'lang': lang}
print(ocr('Hola')['lang'])`,
          output: `spa`,
        },
      },
      {
        id: "S24-T2-A-E3",
        subtopicId: "S24-T2-A",
        kind: "transfer",
        instruction:
          "Min conf de campos: confs=[0.9,0.75,0.95]. Imprime min y status 'review' si min<0.8 (formato de la solución). Contrato: campo débil tumba auto-accept. Pass: 0.75 review.",
        hint: "min()",
        hints: [
          "contrato I/O en instruction",
          "compara output con solution",
          "datos sintéticos only",
        ],
        edgeCases: ["no promedies a ciegas"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-024 · min conf → review
# DEFECT: auto aunque min<0.8
confs=[0.9,0.75,0.95]
m=min(confs)
print(m, 'auto')
print('ok', True)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `confs=[0.9,0.75,0.95]
m=min(confs)
print(m, 'review' if m < 0.8 else 'auto')`,
          output: `0.75 review`,
        },
      },
      {
        id: "S24-T2-B-E1",
        subtopicId: "S24-T2-B",
        kind: "guided",
        instruction:
          "KV parse: s='Total: 12.5'. Separa clave y valor por ':' e imprime 'Total 12.5' (sin dos puntos). Contrato: strip ambos lados. Pass: Total 12.5. Usa solo fixtures sintéticos del lab; la salida debe coincidir exactamente con el solution output del grader.",
        hint: "split once",
        hints: [
          "contrato I/O en instruction",
          "compara output con solution",
          "datos sintéticos only",
        ],
        edgeCases: ["múltiples dos puntos"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-024 · parse KV
# DEFECT: no strip
s='Total: 12.5'
k,v=s.split(':',1)
print(k, v)
print('ok', True)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `s='Total: 12.5'
k,v=s.split(':',1)
print(k.strip(), v.strip())`,
          output: `Total 12.5`,
        },
      },
      {
        id: "S24-T2-B-E2",
        subtopicId: "S24-T2-B",
        kind: "independent",
        instruction:
          "Tabla sintética t=[['H1','H2'],['a','b']]. Imprime número de filas de datos (len-1). Contrato: header no cuenta. Pass: 1. Usa solo fixtures sintéticos del lab; la salida debe coincidir exactamente con el solution output del grader.",
        hint: "len-1",
        hints: [
          "contrato I/O en instruction",
          "compara output con solution",
          "datos sintéticos only",
        ],
        edgeCases: ["tablas irregulares"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-024 · filas de tabla (sin header)
# DEFECT: cuenta header
t=[['H1','H2'],['a','b']]
print(len(t))
print('ok', True)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `t=[['H1','H2'],['a','b']]
print(len(t)-1)`,
          output: `1`,
        },
      },
      {
        id: "S24-T2-B-E3",
        subtopicId: "S24-T2-B",
        kind: "transfer",
        instruction:
          "Evidencia: adjunta bbox [0,0,10,10] al field RUC valor 20123456789; imprime bbox y valor como en solution. Contrato: bbox del valor. Pass: [0, 0, 10, 10] 20123456789.",
        hint: "estructura evidencia",
        hints: [
          "contrato I/O en instruction",
          "compara output con solution",
          "datos sintéticos only",
        ],
        edgeCases: ["coords en px página"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-024 · bbox evidencia
# DEFECT: omite bbox
field={'name':'ruc','value':'20123456789','bbox':[0,0,10,10]}
print(field['value'])
print('ok', True)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `field={'name':'ruc','value':'20123456789','bbox':[0,0,10,10]}
print(field['bbox'], field['value'])`,
          output: `[0, 0, 10, 10] 20123456789`,
        },
      },
      {
        id: "S24-T3-A-E1",
        subtopicId: "S24-T3-A",
        kind: "guided",
        instruction:
          "Normaliza id sintético s='20-123' dejando solo dígitos (re.sub). Imprime '20123'. Contrato: no valida longitud aquí. Pass: 20123. Usa solo fixtures sintéticos del lab; la salida debe coincidir exactamente con el solution output del grader.",
        hint: "re.sub",
        hints: [
          "contrato I/O en instruction",
          "compara output con solution",
          "datos sintéticos only",
        ],
        edgeCases: ["vacío tras norm"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-024 · solo dígitos RUC parcial
# DEFECT: no limpia no-dígitos
import re
s='20-123'
print(s)
print('ok', True)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import re
s='20-123'
print(re.sub(r'\\D', '', s))`,
          output: `20123`,
        },
      },
      {
        id: "S24-T3-A-E2",
        subtopicId: "S24-T3-A",
        kind: "independent",
        instruction:
          "Fecha de boleta '15/01/2026' → ISO '2026-01-15' con datetime. Contrato: dayfirst DD/MM/YYYY. Pass: 2026-01-15. Usa solo fixtures sintéticos del lab; la salida debe coincidir exactamente con el solution output del grader.",
        hint: "strptime",
        hints: [
          "contrato I/O en instruction",
          "compara output con solution",
          "datos sintéticos only",
        ],
        edgeCases: ["formatos mixtos"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-024 · fecha PE a ISO
# DEFECT: formato US
from datetime import datetime
print(datetime.strptime('15/01/2026', '%m/%d/%Y').date().isoformat())
print('ok', True)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `from datetime import datetime
print(datetime.strptime('15/01/2026', '%d/%m/%Y').date().isoformat())`,
          output: `2026-01-15`,
        },
      },
      {
        id: "S24-T3-A-E3",
        subtopicId: "S24-T3-A",
        kind: "transfer",
        instruction:
          "RUC inválido raw='123': normaliza dígitos; si len!=11 imprime None. Contrato: no pad de ceros. Pass: None. Usa solo fixtures sintéticos del lab; la salida debe coincidir exactamente con el solution output del grader.",
        hint: "guard clause",
        hints: [
          "contrato I/O en instruction",
          "compara output con solution",
          "datos sintéticos only",
        ],
        edgeCases: ["None en JSON null"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-024 · RUC len==11
# DEFECT: acepta cualquier len
import re
raw='123'
d=re.sub(r'\D','',raw)
print(d)
print('ok', True)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import re
raw='123'
d=re.sub(r'\\D','',raw)
print(d if len(d)==11 else None)`,
          output: `None`,
        },
      },
      {
        id: "S24-T3-B-E1",
        subtopicId: "S24-T3-B",
        kind: "guided",
        instruction:
          "Cross-field monto: total=10.0, lines=[4.0,5.0]. Si abs(sum(lines)-total)>0.01 imprime needs_review. Contrato: tolerancia 0.01. Pass: needs_review. Usa solo fixtures sintéticos del lab; la salida debe coincidir exactamente con el solution output del grader.",
        hint: "abs",
        hints: [
          "contrato I/O en instruction",
          "compara output con solution",
          "datos sintéticos only",
        ],
        edgeCases: ["redondeo moneda"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-024 · total vs líneas
# DEFECT: siempre auto
total, lines=10.0,[4.0,5.0]
print('auto')
print('ok', True)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `total, lines=10.0,[4.0,5.0]
print('needs_review' if abs(sum(lines)-total)>0.01 else 'auto')`,
          output: `needs_review`,
        },
      },
      {
        id: "S24-T3-B-E2",
        subtopicId: "S24-T3-B",
        kind: "independent",
        instruction:
          "Reasons: ruc=None, reasons=[]. Si ruc is None append 'ruc_missing'; imprime reasons. Contrato: acumular, no raise. Pass: ['ruc_missing']. Usa solo fixtures sintéticos del lab; la salida debe coincidir exactamente con el solution output del grader.",
        hint: "append",
        hints: [
          "contrato I/O en instruction",
          "compara output con solution",
          "datos sintéticos only",
        ],
        edgeCases: ["múltiples reasons"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-024 · ruc missing reason
# DEFECT: reasons vacío
ruc=None
reasons=[]
print(reasons)
print('ok', True)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `ruc=None
reasons=[]
if ruc is None:
    reasons.append('ruc_missing')
print(reasons)`,
          output: `['ruc_missing']`,
        },
      },
      {
        id: "S24-T3-B-E3",
        subtopicId: "S24-T3-B",
        kind: "transfer",
        instruction:
          "Política de producto: mismatch=True no implica fraude ni colusión. Imprime 'review_not_fraud' como mensaje de política del curso. Pass: review_not_fraud.",
        hint: "política explícita",
        hints: [
          "contrato I/O en instruction",
          "compara output con solution",
          "datos sintéticos only",
        ],
        edgeCases: ["separar risk triage"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-024 · mismatch ≠ fraude
# DEFECT: etiqueta fraud
mismatch=True
print('fraud' if mismatch else 'auto')
print('ok', True)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `mismatch=True
print('review_not_fraud' if mismatch else 'auto')`,
          output: `review_not_fraud`,
        },
      },
      {
        id: "S24-T4-A-E1",
        subtopicId: "S24-T4-A",
        kind: "guided",
        instruction:
          "Golden accuracy global: correct=3, n=4 → imprime 0.75 (float división). Contrato: correct/n. Pass: 0.75. Usa solo fixtures sintéticos del lab; la salida debe coincidir exactamente con el solution output del grader.",
        hint: "división float",
        hints: [
          "contrato I/O en instruction",
          "compara output con solution",
          "datos sintéticos only",
        ],
        edgeCases: ["n=0"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-024 · accuracy golden
# DEFECT: usa n-correct
correct, n = 3, 4
print((n - correct) / n)
print('ok', True)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `correct, n = 3, 4
print(correct / n)`,
          output: `0.75`,
        },
      },
      {
        id: "S24-T4-A-E2",
        subtopicId: "S24-T4-A",
        kind: "independent",
        instruction:
          "Accuracy por campo ruc: rows con pred/true; fracción de igualdad en ruc_pred==ruc_true. Imprime 0.5. Contrato: solo campo ruc. Pass: 0.5. Usa solo fixtures sintéticos del lab; la salida debe coincidir exactamente con el solution output del grader.",
        hint: "sum generator",
        hints: [
          "contrato I/O en instruction",
          "compara output con solution",
          "datos sintéticos only",
        ],
        edgeCases: ["campos missing"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-024 · field accuracy RUC
# DEFECT: siempre 1.0
rows=[{'ruc_pred':'1','ruc_true':'1'},{'ruc_pred':'2','ruc_true':'1'}]
print(1.0)
print('ok', True)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `rows=[{'ruc_pred':'1','ruc_true':'1'},{'ruc_pred':'2','ruc_true':'1'}]
print(sum(1 for r in rows if r['ruc_pred']==r['ruc_true'])/len(rows))`,
          output: `0.5`,
        },
      },
      {
        id: "S24-T4-A-E3",
        subtopicId: "S24-T4-A",
        kind: "transfer",
        instruction:
          "Cobertura auto: auto=7, review=3 → auto/(auto+review)=0.7. Imprime float. Contrato: no uses accuracy como cobertura. Pass: 0.7. Usa solo fixtures sintéticos del lab; la salida debe coincidir exactamente con el solution output del grader.",
        hint: "fórmula",
        hints: [
          "contrato I/O en instruction",
          "compara output con solution",
          "datos sintéticos only",
        ],
        edgeCases: ["abstention es métrica de producto"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-024 · tasa auto
# DEFECT: review/(auto+review)
auto, review = 7, 3
print(review / (auto + review))
print('ok', True)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `auto, review = 7, 3
print(auto / (auto + review))`,
          output: `0.7`,
        },
      },
      {
        id: "S24-T4-B-E1",
        subtopicId: "S24-T4-B",
        kind: "guided",
        instruction:
          "Allowlist mime: mime='application/zip' no está en pdf/png/jpeg → imprime reject. Contrato: fail-closed. Pass: reject. Usa solo fixtures sintéticos del lab; la salida debe coincidir exactamente con el solution output del grader.",
        hint: "set membership",
        hints: [
          "contrato I/O en instruction",
          "compara output con solution",
          "datos sintéticos only",
        ],
        edgeCases: ["doble extensión"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-024 · mime allowlist
# DEFECT: acepta zip
mime='application/zip'
allowed={'application/pdf','image/png','image/jpeg'}
print('ok' if mime not in allowed else 'reject')
print('ok', True)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `mime='application/zip'
allowed={'application/pdf','image/png','image/jpeg'}
print('reject' if mime not in allowed else 'ok')`,
          output: `reject`,
        },
      },
      {
        id: "S24-T4-B-E2",
        subtopicId: "S24-T4-B",
        kind: "independent",
        instruction:
          "Size gate pre-OCR: n=6_000_000 bytes > 5e6 → imprime reject. Contrato: mitiga DoS al worker. Pass: reject. Usa solo fixtures sintéticos del lab; la salida debe coincidir exactamente con el solution output del grader.",
        hint: "comparación",
        hints: [
          "contrato I/O en instruction",
          "compara output con solution",
          "datos sintéticos only",
        ],
        edgeCases: ["streaming"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-024 · size guard
# DEFECT: umbral invertido
n=6_000_000
print('ok' if n > 5_000_000 else 'reject')
print('ok', True)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `n=6_000_000
print('reject' if n > 5_000_000 else 'ok')`,
          output: `reject`,
        },
      },
      {
        id: "S24-T4-B-E3",
        subtopicId: "S24-T4-B",
        kind: "transfer",
        instruction:
          "Fallback operativo: status='ocr_fail' → acción 'human_rescan'. Imprime la acción. Contrato: no loop infinito de OCR. Pass: human_rescan. Usa solo fixtures sintéticos del lab; la salida debe coincidir exactamente con el solution output del grader.",
        hint: "mapa de fallbacks",
        hints: [
          "contrato I/O en instruction",
          "compara output con solution",
          "datos sintéticos only",
        ],
        edgeCases: ["no LLM sin evidencia"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-024 · fallback ocr_fail
# DEFECT: continue en ocr_fail
status='ocr_fail'
print('continue')
print('ok', True)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `status='ocr_fail'
print({'ocr_fail':'human_rescan'}.get(status, 'continue'))`,
          output: `human_rescan`,
        },
      },
    ],
  },
  youDo: {
    title: "Intake OCR sintético (document intake CP-N2-C)",
    context:
      "Procesa 3 “documentos” sintéticos (dict de tokens): preproceso meta, extracción KV, schema, validación cross-field, métricas por campo y cola de revisión. Sin PII real; sin label de fraude.",
    objectives: [
      "Pipeline preproceso → OCR simulado → schema",
      "Abstener campos low-conf",
      "Golden de al menos 2 docs con acc por campo",
      "Gate de archivos hostiles",
    ],
    requirements: [
      "Datos sintéticos only",
      "bbox o evidencia por campo crítico",
      "needs_review ≠ fraude",
      "es-PE en labels de UI/log",
    ],
    starterCode: `tokens = [{"text": "RUC: 20123456789", "conf": 0.9, "bbox": [0,0,1,1]}]
# DEFECT labels cover kv/schema/validate/metrics contracts
print("intake")
`,
    portfolioNote:
      "Módulo document intake CP-N2-C con golden y política de abstención.",
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
        question: "¿Qué haces si confidence de RUC es 0.6?",
        options: ["Aceptar igual", "Inventar dígitos", "Etiquetar fraude", "Abstener y encolar revisión"],
        correctIndex: 3,
        explanation:
          "Abstención bajo umbral es control de calidad.",
      },
      {
        question: "Un mismatch total vs líneas implica:",
        options: ["Fraude probado", "Cola de revisión / corrección", "Borrar el doc", "Subir DPI"],
        correctIndex: 1,
        explanation:
          "Validación ≠ acusación de fraude.",
      },
      {
        question: "¿Por qué medir accuracy por campo?",
        options: ["Es más corto", "OCR no tiene global", "Los campos críticos pueden fallar aunque el global se vea bien", "Solo para imágenes"],
        correctIndex: 2,
        explanation:
          "Campos caros necesitan SLO propio.",
      },
      {
        question: "Archivo application/zip en intake de facturas:",
        options: ["Gate reject/review por mime no permitido", "Siempre OK", "OCR directo", "Enviar por email"],
        correctIndex: 0,
        explanation:
          "Allowlist de mime y tamaño.",
      },
      {
        question: "Un documento hostil (zip o tamaño sobre cupo) debe…",
        options: ["forzar OCR con más DPI", "etiquetarse fraude automáticamente", "aceptarse si el mime dice pdf en el nombre de archivo", "rechazarse en el gate de admisión antes del motor"],
        correctIndex: 3,
        explanation:
          "Allowlist de mime/tamaño es defensa en profundidad; no se confía en la extensión sola.",
      }
    ],
  },
  resources: {
    docs: [
      {
        label: "Tesseract OCR",
        url: "https://tesseract-ocr.github.io/",
        note: "OCR clásico y layout",
      },
      {
        label: "Pillow handbook",
        url: "https://pillow.readthedocs.io/",
        note: "Preproceso de imagen",
      },
      {
        label: "pytesseract",
        url: "https://pypi.org/project/pytesseract/",
        note: "Bridge Python ↔ Tesseract",
      },
      {
        label: "OpenCV docs — image processing",
        url: "https://docs.opencv.org/4.x/d2/d96/tutorial_py_table_of_contents_imgproc.html",
        note: "Deskew, threshold, morph (cuando runtime lo permita)",
      },
      {
        label: "Azure Document Intelligence concepts",
        url: "https://learn.microsoft.com/en-us/azure/ai-services/document-intelligence/",
        note: "KV, tablas y confidence en Document AI comercial",
      },
      {
        label: "Google Document AI",
        url: "https://cloud.google.com/document-ai/docs",
        note: "Processors y evaluación por campo",
      },
    ],
    books: [
      {
        label: "Document Image Processing literature (survey)",
        note: "deskew/layout concepts",
      },
      {
        label: "Practical MLOps — data quality chapters",
        note: "golden sets y métricas",
      },
    ],
    courses: [
      {
        label: "Coursera — computer vision / OCR tracks",
        url: "https://www.coursera.org/courses?query=ocr%20document",
        note: "Document AI y visión aplicada",
      },
      {
        label: "MIT 6.100L",
        url: "https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/",
        note: "Contratos verificables",
      },
      {
        label: "Harvard CS50P",
        url: "https://cs50.harvard.edu/python/",
        note: "Tests y proyectos reproducibles",
      },
      {
        label: "deeplearning.ai",
        url: "https://www.deeplearning.ai/",
        note: "CV y pipelines aplicados",
      },
    ],
  },
}
