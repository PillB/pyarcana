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
    "El **document intake** de CP-N2-C convierte imágenes sintéticas en campos con evidencia (bbox, confidence) y cola de revisión. OCR se expone con un contrato común `real`/`fake` para tests; abstenerse bajo confidence es control de calidad, no veredicto de fraude. En backoffice (p. ej. facturas sintéticas de Lima), el valor profesional es encolar bien — no «cerrar» por score.",
  learningOutcomes: [
    { text: "Preprocesar imágenes (DPI, deskew, crop, contraste)" },
    { text: "Corregir ruido y orientación" },
    { text: "Ejecutar OCR con idiomas, confidence por campo y orden de lectura básico" },
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
        "Llegas desde el adaptador web de la sección anterior (S23): un download verificado (PDF/PNG sintético) es la entrada típica del intake. Aquí no re-scrapeas el portal — **consumes el artefacto** y lo conviertes en campos con evidencia. Construyes el **document intake** de CP-N2-C: imagen sintética → preproceso → adapter OCR (confidence + bbox) → normalización a schema → validación cross-field → golden set por campo. En un backoffice sintético de facturas en Lima, el objetivo es encolar revisión, no “cerrar” casos por score.",
        "Primero practicamos con la biblioteca estándar y adapters simulados; un motor real (p. ej. Tesseract) solo entra si el entorno lo declara instalado. Todo documento es **sintético** (facturas demo, IDs fake). Conservas **bounding boxes** y te **abstienes** si confidence < umbral de campo crítico (p. ej. RUC). Coincidir totales o RUC **no prueba fraude** ni parentesco: solo genera `reasons[]` para humanos. Política fail-closed: `auto_fraud_label=False` siempre en este path.",
        "**Mini-glosario de intake** (léelo una vez; lo reutilizas en demos y ejercicios). **bbox:** rectángulo `[x0,y0,x1,y1]` que localiza el valor en la página para el revisor. **confidence:** score 0–1 del motor por token o campo. **HITL** (*human-in-the-loop*): cola donde un humano decide. **golden set:** páginas/campos etiquetados a mano para medir exactitud. **adapter:** interfaz común (`real`/`fake`) hacia el motor OCR. **fail-closed:** si hay duda, no auto-aceptas. **coverage_auto:** fracción de docs que pasan sin revisión humana. **preflight:** chequeos (mime, tamaño, orientación) antes del motor.",
        "Orden: **T1 Imagen** (DPI, deskew, ruido, orientación) → **T2 OCR** (idiomas, layout, KV/tablas) → **T3 Extracción** (schema, validación, cola) → **T4 Evaluación** (golden set, privacidad, hostiles, fallback). Frontera real/fake: TesseractAdapter vs FakeOcrAdapter nunca se confunden en contract tests. Más adelante, el texto OCR alimenta endpoints de IA (S25) como entrada **no confiable** — aquí aprendes a no inventar dígitos ni cerrar por score.",
      ],
      callout: {
        type: "info",
        title: "Alcance de esta sección",
        content:
          "Dominas el **contrato de intake** (evidencia, abstención, schema, golden por campo) con demos sintéticos. Layout multi-columna avanzado y processors comerciales de Document AI quedan como lectura en Recursos y como extensión opcional cuando el runtime lo permita. `TesseractAdapter` llama un motor real si está instalado; `FakeOcrAdapter` nunca se presenta como OCR real: devuelve observaciones fijadas para tests de parsing, abstención y evaluación.",
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
    # img: dict sintético (simulación de contrato, no OpenCV)
    out = dict(img)
    out["dpi"] = max(img.get("dpi", 72), 200)
    ang = img.get("skew_deg", 0.0)
    out["deskew_applied"] = abs(ang) >= 0.5
    out["skew_deg"] = 0.0  # tras deskew simulado el ángulo queda corregido
    # crop 2% márgenes
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
      heading: "Ruido y orientación",
      subtopicId: "S24-T1-B",
      paragraphs: [
        "Ruido (sal/pimienta, compresión JPEG) y **orientación** (0/90/180/270) rompen el layout y pueden dar confidence alta en basura si OCR corre al revés. Detecta orientación por scores de señales (cabecera, densidad) o modelo; corrige **antes** de OCR.",
        "Simulamos score por rotación y un denoise de contrato sobre flags 0/1 (no es un filtro de imagen real: solo auditamos el flag de ruido). Si score_orient < 0.5, el intake prefiere manual_orient (humano gira la página) antes de forzar auto con baja certeza — fail-closed de calidad.",
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
    # Simulación de contrato: píxeles marcados como ruido (1) se apagan (0).
    # Un denoise real usaría filtros (mediana, morfología); aquí solo auditamos el flag.
    return [0 if f == 1 else f for f in flags]

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
      heading: "Idiomas, layout y confidence",
      subtopicId: "S24-T2-A",
      paragraphs: [
        "Configura **idiomas** (spa+eng) según el corpus: facturas PE en español con tokens EN de software. El **layout** (bloques, columnas) guía el **orden de lectura**: ordena por `(col, y, x)` o por bbox; no concatenes columnas a ciegas o mezclas “Total” de la derecha con ítems de la izquierda.",
        "Cada token/campo trae **confidence** 0–1. Umbral de **abstención por campo crítico** (RUC, total): un promedio global esconde el dígito débil. Si RUC conf < 0.85 → review_queue, no inventes dígitos ni “corrijas” con checksum inventado sin política.",
        "Contrato del adapter: ocr_page(tokens, lang) → lista {text, conf, bbox, lang}. Low-conf se lista para HITL. FakeOcrAdapter devuelve observaciones fijadas para tests de parsing; nunca se presenta como motor real en logs de producción del curso.",
      ],
      code: {
        language: 'python',
        title: "ocr_conf.py",
        code: `def ocr_page(tokens, lang="spa"):
    return [{"text": t["text"], "conf": t["conf"], "bbox": t["bbox"], "lang": lang} for t in tokens]

tokens = [
    {"text": "20123456789", "conf": 0.72, "bbox": [60, 50, 200, 70]},
    {"text": "FACTURA", "conf": 0.98, "bbox": [10, 10, 120, 40]},
    {"text": "RUC", "conf": 0.91, "bbox": [10, 50, 50, 70]},
]
out = ocr_page(tokens)
# Orden de lectura básico: arriba→abajo, izquierda→derecha (y0, x0 del bbox)
ordered = sorted(out, key=lambda t: (t["bbox"][1], t["bbox"][0]))
low = [t for t in out if t["conf"] < 0.85]
print("order", [t["text"] for t in ordered])
print("n", len(out), "low_conf", [(t["text"], t["conf"]) for t in low])`,
        output: `order ['FACTURA', 'RUC', '20123456789']
n 3 low_conf [('20123456789', 0.72)]`,
      },
      callout: {
        type: "info",
        title: "Abstención",
        content:
          "Si RUC < 0.85 → review_queue, no inventes dígitos.",
      },
    },
    {
      heading: "Texto, tablas y pares clave–valor",
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
      heading: "Schema y normalización",
      subtopicId: "S24-T3-A",
      paragraphs: [
        "Un **schema** define campos, tipos y required (ruc str11, total float, fecha date). Normaliza monedas, fechas a ISO y RUC a solo dígitos. Output canónico: {field, value, conf, bbox, source_doc_id} + schema_version en metadata del run.",
        "Montos PE usan **coma decimal** (`\"150,00\"` → 150.0); no borres comas a ciegas o convertirás centavos en miles. Si hay miles y decimal (`\"1.150,00\"`), quita puntos de miles y cambia la coma por punto. Formato EN (`\"150.00\"`) ya trae punto decimal. Si tras normalizar RUC no tiene longitud 11, value=None — no rellenes con ceros mágicos. Fechas DD/MM/YYYY de boletas sintéticas pasan a YYYY-MM-DD con datetime.strptime.",
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
    # Fixture PE didáctica: "150,00" o "1.150,00" → float
    s = s.replace("PEN", "").strip().replace(" ", "")
    if "," in s and "." in s:
        s = s.replace(".", "").replace(",", ".")
    elif "," in s:
        s = s.replace(",", ".")
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
        output: `{'ruc': '20123456789', 'total': 150.0, 'fecha': '2026-01-15', 'schema': 'invoice.v1'}`,
      },
      callout: {
        type: "warning",
        title: "None ≠ 0",
        content:
          "Si no normaliza, deja null y manda a revisión; no pongas 0.0.",
      },
    },
    {
      heading: "Validación cross-field y cola de revisión",
      subtopicId: "S24-T3-B",
      paragraphs: [
        "Cross-field: `abs(sum(líneas) - total) > 0.01` → `needs_review`. RUC None → `reasons.append('ruc_missing')`. Varias reasons se acumulan; el documento no se auto-acepta si la lista no está vacía o conf de críticos es baja.",
        "La cola de revisión (HITL: *human-in-the-loop*, humano en el circuito) es el **producto**: `status=review`, `reasons[]`, evidencias bbox. **Mismatch ≠ fraude**: imprime política review_not_fraud para entrenar el hábito. Humanos investigan; el sistema solo encola.",
        "Caso sintético del lab: total 150.0 vs líneas [100, 50] → auto; total 150.0 vs [100, 40] con ruc None y conf baja → needs_review con varias reasons. El intake batch marca human_queue y sigue con el siguiente doc sin bloquear todo el archivo.",
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
      heading: "Golden set sintético, exactitud por campo y cobertura",
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
auto, review = 7, 3
coverage_auto = auto / (auto + review)
print("coverage_auto", coverage_auto)`,
        output: `acc_ruc 0.5
acc_total 0.5
coverage_auto 0.7`,
      },
      callout: {
        type: "tip",
        title: "Por campo",
        content:
          "Reporta acc_ruc, acc_total, abstention_rate por separado.",
      },
    },
    {
      heading: "Privacidad, archivos hostiles y fallback",
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
    intro: "Te muestro document intake CP-N2-C: preproceso, OCR con confidence, schema, cross-field y golden — sin inferir fraude. Cada demo imprime exactamente el resultado que ves en `output`.",
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

out = preprocess({"w": 800, "h": 1000, "dpi": 72, "skew_deg": 2.0})
print(out["dpi"], out["deskew"])
`,
          output: `200 True`,
        },
        why: "Elevar DPI y corregir sesgo antes del motor suele mejorar más la lectura que cambiar de modelo.",
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
`,
          output: `180`,
        },
        why: "Si la página está al revés, el layout se rompe y el OCR puede devolver basura con confidence engañosamente alta.",
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
`,
          output: `[{'t': '20X', 'c': 0.55}]`,
        },
        why: "Un campo crítico con baja confidence se abstiene y va a cola — no se inventan dígitos ni se promedia para ocultarlo.",
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
`,
          output: `{'RUC': '20123456789', 'Total': '10'}`,
        },
        why: "El par clave–valor es la unidad mínima de evidencia textual antes de normalizar al schema.",
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
    d = re.sub(r"\\D", "", s)
    return d, len(d) == 11

d, ok = normalize_ruc("20.123456789")
print(d, ok)
`,
          output: `20123456789 True`,
        },
        why: "Un schema canónico (solo dígitos, longitud fija) evita basura en validación y en el golden set.",
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
`,
          output: `ok`,
        },
        why: "Cross-field manda a revisión cuando no cuadra; nunca emite un label de fraude por inconsistencia contable.",
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
`,
          output: `0.5`,
        },
        why: "Accuracy por campo crítico (RUC, total) detecta fallos que un accuracy global disimula.",
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
`,
          output: `ok`,
        },
        why: "Allowlist de mime y tope de tamaño protegen al worker OCR antes de gastar CPU en binarios hostiles.",
      },
    ],
  },
  weDo: {
    intro: "24 ejercicios (guiado → independiente → transferencia) de preproceso, orientación, OCR/KV, schema, validación, golden y hostiles. Los de transferencia componen funciones del intake; no te quedes en un solo print.",
    steps: [
      {
        id: "S24-T1-A-E1",
        subtopicId: "S24-T1-A",
        kind: "guided",
        instruction:
          "Preproceso intake: dpi=96 de escaneo sintético. Si dpi<200, eleva con max(dpi,200) e imprime el entero resultante. Contrato: no inventa detalle óptico; solo metadata. Pass: 200.",
        hint: "max()",
        hints: [
          "El piso de calidad del lab es 200 DPI efectivos",
          "max(dpi, 200) eleva sin tocar si ya es mayor",
          "Upscaling no inventa tipografía: solo metadata",
        ],
        edgeCases: ["upscaling no crea detalle real"],
        tests: "salida coincide con solution output",
        feedback: "Debes imprimir 200: max(96, 200) eleva el escaneo sintético al piso de OCR.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-024 · DPI mínimo 200
# DEFECT: no eleva dpi
dpi=96
print(dpi)
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
          "Usa valor absoluto: sesgo -1.2 también cuenta",
          "deskew_applied es True cuando |skew| >= 0.5",
          "El umbral 0.5° es didáctico del lab, no una norma ISO",
        ],
        edgeCases: ["umbral empírico"],
        tests: "salida coincide con solution output",
        feedback: "Con skew=1.2, abs(skew) >= 0.5 es True — el starter tenía el operador invertido.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-024 · deskew si |skew|>=0.5
# DEFECT: umbral invertido
skew=1.2
print(abs(skew) < 0.5)
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
          "Compón preprocess_meta: img con dpi=96, skew_deg=1.8, w=h=1000, m=0.05. Eleva DPI a ≥200, marca deskew_applied si |skew|≥0.5, pone skew_deg=0.0 y calcula crop_box con 5% de margen. Imprime en una línea: dpi, deskew_applied, crop_box. Pass: 200 True (50, 50, 950, 950).",
        hint: "max DPI + abs skew + crop m",
        hints: [
          "dpi_out = max(img['dpi'], 200); deskew si abs(skew) >= 0.5",
          "Tras deskew simulado, skew_deg queda 0.0 aunque el flag sea True",
          "crop: (int(m*w), int(m*h), int((1-m)*w), int((1-m)*h)) con m=0.05",
        ],
        edgeCases: ["no inventar píxeles; solo metadata"],
        tests: "salida coincide con solution output",
        feedback: "El pipeline de preproceso une DPI, deskew y crop en un solo contrato auditable. Faltar el flag o el crop rompe el intake.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-024 · preprocess compuesto
# DEFECT: no eleva DPI ni marca deskew; crop con m=0
img = {"w": 1000, "h": 1000, "dpi": 96, "skew_deg": 1.8}
m = 0.0
print(img["dpi"], False, (0, 0, 1000, 1000))
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `img = {"w": 1000, "h": 1000, "dpi": 96, "skew_deg": 1.8}
m = 0.05
dpi = max(img["dpi"], 200)
deskew = abs(img["skew_deg"]) >= 0.5
w, h = img["w"], img["h"]
crop = (int(m * w), int(m * h), int((1 - m) * w), int((1 - m) * h))
print(dpi, deskew, crop)`,
          output: `200 True (50, 50, 950, 950)`,
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
          "max(s, key=s.get) devuelve la key del mayor score",
          "No uses min: eso elige la peor orientación",
          "Imprime el entero de grados (90), no el score",
        ],
        edgeCases: ["empates"],
        tests: "salida coincide con solution output",
        feedback: "El score máximo está en 90°; min() era el defecto del starter.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-024 · orientación por max score
# DEFECT: elige min score
s={0:0.1,90:0.8}
print(min(s, key=s.get))
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
          "sum(flags) cuenta los 1 (ruido marcado)",
          "len(flags) cuenta todos los píxeles, no el ruido",
          "Aquí solo auditas el flag; denoise real usaría filtros",
        ],
        edgeCases: ["modelo real de denoise"],
        tests: "salida coincide con solution output",
        feedback: "Hay dos flags en 1 → sum=2. len() cuenta longitud, no ruido.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-024 · contar flags de ruido
# DEFECT: usa len no sum
flags=[0,1,1,0]
print(len(flags))
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
          "Preflight de orientación: scores={0:0.1,90:0.05,180:0.7,270:0.15}. Elige best rotación y su score; si score<0.5 → action='manual_orient', si no 'auto'. Imprime best, score y action. Pass: 180 0.7 auto. (OCR solo después de orientar.)",
        hint: "max key= + umbral 0.5",
        hints: [
          "best = max(scores, key=scores.get); score = scores[best]",
          "Si score < 0.5 → manual_orient (humano gira); si no auto",
          "Con 0.7 en 180° el lab acepta auto — aún así corrige rotación antes del OCR",
        ],
        edgeCases: ["página en blanco / empates"],
        tests: "salida coincide con solution output",
        feedback: "El preflight elige 180° con score 0.7 → auto. Forzar OCR sin rotar o invertir el umbral rompe el layout.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-024 · best orient + gate score
# DEFECT: elige min y fuerza OCR sin gate
scores = {0: 0.1, 90: 0.05, 180: 0.7, 270: 0.15}
best = min(scores, key=scores.get)
print(best, scores[best], "ocr_now")
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `scores = {0: 0.1, 90: 0.05, 180: 0.7, 270: 0.15}
best = max(scores, key=scores.get)
score = scores[best]
action = "manual_orient" if score < 0.5 else "auto"
print(best, score, action)`,
          output: `180 0.7 auto`,
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
          "Umbral de auto-accept del lab: conf >= 0.85",
          "List comprehension sobre t['text']",
          "0.5 es demasiado bajo y deja pasar basura",
        ],
        edgeCases: ["umbral por campo"],
        tests: "salida coincide con solution output",
        feedback: "Solo 'A' pasa el umbral 0.85; B con 0.5 se filtra.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-024 · tokens conf>=0.85
# DEFECT: umbral 0.5 (demasiado bajo)
toks=[{'text':'A','conf':0.9},{'text':'B','conf':0.5}]
print([t['text'] for t in toks if t['conf']>=0.5])
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
          "Orden de lectura: tokens desordenados con bbox [x0,y0,x1,y1]. Ordena por (y0, x0) — arriba→abajo, izquierda→derecha — e imprime la lista de text. Contrato: no concatenes columnas a ciegas; usa el bbox. Pass: ['FACTURA', 'RUC', '20123456789'].",
        hint: "sorted key=(y0, x0)",
        hints: [
          "bbox = [x0, y0, x1, y1]; orden de lectura ≈ (y0, x0)",
          "sorted(tokens, key=lambda t: (t['bbox'][1], t['bbox'][0]))",
          "Imprime solo los text en ese orden, no el dict completo",
        ],
        edgeCases: ["multi-columna real necesita col id; aquí una columna sintética"],
        tests: "salida coincide con solution output",
        feedback: "Sin ordenar por bbox mezclas cabecera y valor; FACTURA (y=10) va antes que RUC/valor (y=50).",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-024 · orden de lectura por bbox
# DEFECT: imprime en orden de llegada (valor primero)
tokens = [
    {"text": "20123456789", "bbox": [60, 50, 200, 70]},
    {"text": "FACTURA", "bbox": [10, 10, 120, 40]},
    {"text": "RUC", "bbox": [10, 50, 50, 70]},
]
print([t["text"] for t in tokens])
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `tokens = [
    {"text": "20123456789", "bbox": [60, 50, 200, 70]},
    {"text": "FACTURA", "bbox": [10, 10, 120, 40]},
    {"text": "RUC", "bbox": [10, 50, 50, 70]},
]
ordered = sorted(tokens, key=lambda t: (t["bbox"][1], t["bbox"][0]))
print([t["text"] for t in ordered])`,
          output: `['FACTURA', 'RUC', '20123456789']`,
        },
      },
      {
        id: "S24-T2-A-E3",
        subtopicId: "S24-T2-A",
        kind: "transfer",
        instruction:
          "Gate por campo crítico: fields=[{'name':'ruc','conf':0.9},{'name':'total','conf':0.75},{'name':'fecha','conf':0.95}], thr=0.8. Calcula m=min de confs; status='review' si m<thr else 'auto'; lista weak = nombres con conf<thr. Imprime m, status y weak. Pass: 0.75 review ['total'].",
        hint: "min + list comp de nombres débiles",
        hints: [
          "No promedies confidences: un campo débil tumba el auto-accept",
          "m = min(f['conf'] for f in fields); weak = [f['name'] for f in fields if f['conf'] < thr]",
          "Orden de impresión: m, status, weak",
        ],
        edgeCases: ["no promedies a ciegas"],
        tests: "salida coincide con solution output",
        feedback: "Si imprimiste 'auto' o weak vacío con min=0.75, estás ocultando el campo total débil.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-024 · min conf + weak fields
# DEFECT: promedia y no lista weak
fields = [
    {"name": "ruc", "conf": 0.9},
    {"name": "total", "conf": 0.75},
    {"name": "fecha", "conf": 0.95},
]
thr = 0.8
avg = sum(f["conf"] for f in fields) / len(fields)
print(avg, "auto", [])
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `fields = [
    {"name": "ruc", "conf": 0.9},
    {"name": "total", "conf": 0.75},
    {"name": "fecha", "conf": 0.95},
]
thr = 0.8
m = min(f["conf"] for f in fields)
status = "review" if m < thr else "auto"
weak = [f["name"] for f in fields if f["conf"] < thr]
print(m, status, weak)`,
          output: `0.75 review ['total']`,
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
          "split(':', 1) corta solo en el primer dos puntos",
          "strip() en clave y valor quita espacios residuales",
          "print(k, v) con strip imprime 'Total 12.5'",
        ],
        edgeCases: ["múltiples dos puntos"],
        tests: "salida coincide con solution output",
        feedback: "Sin strip, el valor puede llevar espacio inicial y fallar el grader.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-024 · parse KV
# DEFECT: no strip
s='Total: 12.5'
k,v=s.split(':',1)
print(k, v)
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
          "Fila 0 es header; datos = len(t) - 1",
          "No cuentes el header como ítem de factura",
          "Con una sola fila de datos el resultado es 1",
        ],
        edgeCases: ["tablas irregulares"],
        tests: "salida coincide con solution output",
        feedback: "len(t) incluye header; el contrato pide solo filas de datos.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-024 · filas de tabla (sin header)
# DEFECT: cuenta header
t=[['H1','H2'],['a','b']]
print(len(t))
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
          "Evidencia KV: lines=['RUC: 20123456789','Total: 150.00'] con bboxes={RUC:[0,0,10,10], Total:[0,20,40,30]}. Parsea KV (clave:valor), adjunta bbox del **valor** (no del label) a cada field y imprime lista de (name, value, bbox) ordenada por name. Pass: [('RUC', '20123456789', [0, 0, 10, 10]), ('Total', '150.00', [0, 20, 40, 30])].",
        hint: "split + dict bbox del valor",
        hints: [
          "Guarda bbox del valor, no solo del label 'RUC'",
          "Tras parsear k,v con split(':',1), field = (k, v, bboxes[k])",
          "sorted por name para salida estable del grader",
        ],
        edgeCases: ["coords en px página; label sin bbox → no inventes"],
        tests: "salida coincide con solution output",
        feedback: "Evidencia = valor + bbox del valor. Sin bbox el revisor no resalta; omitir Total o desordenar falla el contrato.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-024 · KV + bbox del valor
# DEFECT: solo valores, sin bbox ni orden
lines = ["RUC: 20123456789", "Total: 150.00"]
bboxes = {"RUC": [0, 0, 10, 10], "Total": [0, 20, 40, 30]}
print([ln.split(":", 1)[1].strip() for ln in lines])
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `lines = ["RUC: 20123456789", "Total: 150.00"]
bboxes = {"RUC": [0, 0, 10, 10], "Total": [0, 20, 40, 30]}
fields = []
for ln in lines:
    k, v = ln.split(":", 1)
    k, v = k.strip(), v.strip()
    fields.append((k, v, bboxes[k]))
print(sorted(fields, key=lambda t: t[0]))`,
          output: `[('RUC', '20123456789', [0, 0, 10, 10]), ('Total', '150.00', [0, 20, 40, 30])]`,
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
          "re.sub(r'\\D', '', s) elimina no-dígitos",
          "Aquí no validas longitud 11; solo limpias",
          "No imprimas el string crudo con guiones",
        ],
        edgeCases: ["vacío tras norm"],
        tests: "salida coincide con solution output",
        feedback: "20-123 → 20123 tras quitar no-dígitos. El guion no es dígito.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-024 · solo dígitos RUC parcial
# DEFECT: no limpia no-dígitos
import re
s='20-123'
print(s)
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
          "Fecha de boleta '15/01/2026' → ISO '2026-01-15' con datetime. Contrato: dayfirst DD/MM/YYYY (formato PE). Pass: 2026-01-15. Usa solo fixtures sintéticos del lab; la salida debe coincidir exactamente con el solution output del grader.",
        hint: "strptime %d/%m/%Y",
        hints: [
          "Boletas PE: día/mes/año → '%d/%m/%Y'",
          "Formato US '%m/%d/%Y' interpreta mal el 15",
          "date().isoformat() produce YYYY-MM-DD",
        ],
        edgeCases: ["formatos mixtos"],
        tests: "salida coincide con solution output",
        feedback: "15/01/2026 con dayfirst es 2026-01-15. %m/%d/%Y falla o invierte el día.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-024 · fecha PE a ISO
# DEFECT: formato US
from datetime import datetime
print(datetime.strptime('15/01/2026', '%m/%d/%Y').date().isoformat())
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
          "Schema PE: raw={'ruc':'20.123456789','total':'150,00'}. norm_ruc (solo dígitos, len==11 o None); norm_total PE (coma decimal → float, sin borrar comas a ciegas). Imprime ruc normalizado y total. Pass: 20123456789 150.0.",
        hint: "re.sub dígitos + coma→punto",
        hints: [
          "RUC: re.sub(r'\\D', '', s); si len!=11 → None (no pad de ceros)",
          "Total PE: si hay coma, cámbiala por punto; si hay miles y decimal (1.150,00) quita puntos primero",
          "\"150,00\" es ciento cincuenta, no quince mil — no uses replace(',', '') a ciegas",
        ],
        edgeCases: ["None en RUC corto; coma decimal PE"],
        tests: "salida coincide con solution output",
        feedback: "Borrar comas de '150,00' produce 15000.0 — error de dominio. RUC con puntos se limpia a 11 dígitos.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-024 · schema PE ruc+total
# DEFECT: strip comas a ciegas (150,00 → 15000) y no valida len RUC
import re
raw = {"ruc": "20.123456789", "total": "150,00"}
ruc = re.sub(r"\\D", "", raw["ruc"])
total = float(raw["total"].replace(",", "").replace("PEN", "").strip())
print(ruc, total)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import re
raw = {"ruc": "20.123456789", "total": "150,00"}

def norm_ruc(s):
    d = re.sub(r"\\D", "", s)
    return d if len(d) == 11 else None

def norm_total(s):
    s = s.replace("PEN", "").strip().replace(" ", "")
    if "," in s and "." in s:
        s = s.replace(".", "").replace(",", ".")
    elif "," in s:
        s = s.replace(",", ".")
    return float(s)

print(norm_ruc(raw["ruc"]), norm_total(raw["total"]))`,
          output: `20123456789 150.0`,
        },
      },
      {
        id: "S24-T3-B-E1",
        subtopicId: "S24-T3-B",
        kind: "guided",
        instruction:
          "Cross-field monto: total=10.0, lines=[4.0,5.0]. Si abs(sum(lines)-total)>0.01 imprime needs_review. Contrato: tolerancia 0.01. Pass: needs_review. Usa solo fixtures sintéticos del lab; la salida debe coincidir exactamente con el solution output del grader.",
        hint: "abs(sum-total)",
        hints: [
          "4.0+5.0=9.0 ≠ 10.0 → mismatch",
          "Tolerancia 0.01 cubre redondeo de moneda",
          "needs_review, no 'fraud'",
        ],
        edgeCases: ["redondeo moneda"],
        tests: "salida coincide con solution output",
        feedback: "Suma 9 vs total 10 supera 0.01 → needs_review. Siempre 'auto' era el defecto.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-024 · total vs líneas
# DEFECT: siempre auto
total, lines=10.0,[4.0,5.0]
print('auto')
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
          "Acumula reasons; no lances excepción",
          "if ruc is None: reasons.append('ruc_missing')",
          "Varias rules pueden empujar a la misma lista",
        ],
        edgeCases: ["múltiples reasons"],
        tests: "salida coincide con solution output",
        feedback: "RUC ausente debe dejar traza en reasons[] para el revisor humano.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-024 · ruc missing reason
# DEFECT: reasons vacío
ruc=None
reasons=[]
print(reasons)
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
          "validate(doc) → (status, reasons). Acumula total_mismatch si |sum(lines)-total|>0.01, ruc_missing si ruc is None, ruc_low_conf si conf_ruc<0.85. status='auto' solo si reasons vacío; si no 'needs_review'. Evalúa d1={total:150, lines:[100,50], ruc:'20123456789', conf_ruc:0.9} y d2={total:150, lines:[100,40], ruc:None, conf_ruc:0.5}. Imprime ambos resultados y la política 'review_not_fraud'. Pass: tres líneas como en solution.",
        hint: "reasons[] + status; dos docs",
        hints: [
          "Mismatch contable y RUC ausente van a reasons — nunca label 'fraud'",
          "status = 'auto' if not reasons else 'needs_review'",
          "Tras los dos validate, imprime review_not_fraud (política de producto)",
        ],
        edgeCases: ["varias reasons; no raise"],
        tests: "salida coincide con solution output",
        feedback: "d1 cuadra → auto; d2 acumula mismatch + ruc_missing + ruc_low_conf → needs_review. Etiquetar fraud es el anti-patrón prohibido.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-024 · validate + política review≠fraud
# DEFECT: etiqueta fraud y no acumula reasons
d1 = {"total": 150.0, "lines": [100.0, 50.0], "ruc": "20123456789", "conf_ruc": 0.9}
d2 = {"total": 150.0, "lines": [100.0, 40.0], "ruc": None, "conf_ruc": 0.5}
print("fraud")
print("fraud")
print("fraud")
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `def validate(doc):
    reasons = []
    if abs(sum(doc.get("lines", [])) - doc["total"]) > 0.01:
        reasons.append("total_mismatch")
    if doc.get("ruc") is None:
        reasons.append("ruc_missing")
    if doc.get("conf_ruc", 1) < 0.85:
        reasons.append("ruc_low_conf")
    status = "auto" if not reasons else "needs_review"
    return status, reasons

d1 = {"total": 150.0, "lines": [100.0, 50.0], "ruc": "20123456789", "conf_ruc": 0.9}
d2 = {"total": 150.0, "lines": [100.0, 40.0], "ruc": None, "conf_ruc": 0.5}
print(validate(d1))
print(validate(d2))
print("review_not_fraud")`,
          output: `('auto', [])
('needs_review', ['total_mismatch', 'ruc_missing', 'ruc_low_conf'])
review_not_fraud`,
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
          "accuracy = correct / n (no error rate)",
          "3/4 = 0.75 en float de Python 3",
          "n-correct/n es la tasa de error, no accuracy",
        ],
        edgeCases: ["n=0"],
        tests: "salida coincide con solution output",
        feedback: "correct/n = 0.75. El starter calculaba la tasa de error (1 - acc).",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-024 · accuracy golden
# DEFECT: usa n-correct
correct, n = 3, 4
print((n - correct) / n)
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
          "Compara ruc_pred == ruc_true por fila",
          "1 de 2 filas correctas → 0.5",
          "No hardcodees 1.0: mide el golden",
        ],
        edgeCases: ["campos missing"],
        tests: "salida coincide con solution output",
        feedback: "Una de dos filas acierta el RUC → field accuracy 0.5.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-024 · field accuracy RUC
# DEFECT: siempre 1.0
rows=[{'ruc_pred':'1','ruc_true':'1'},{'ruc_pred':'2','ruc_true':'1'}]
print(1.0)
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
          "Reporte dual: (1) acc_ruc sobre golden de 2 filas (una acierta RUC, otra no) → 0.5; (2) coverage_auto con auto=7, review=3 → 0.7. Imprime acc_ruc y coverage_auto en una línea. Contrato: cobertura ≠ accuracy; no uses review/(auto+review). Pass: 0.5 0.7.",
        hint: "field_acc + auto/(auto+review)",
        hints: [
          "acc_ruc = sum(pred==true) / n sobre el golden",
          "coverage_auto = auto / (auto + review) — no la tasa de revisión",
          "Subir cobertura bajando umbral sin medir error de campo es anti-patrón",
        ],
        edgeCases: ["abstention es métrica de producto separada"],
        tests: "salida coincide con solution output",
        feedback: "Accuracy de campo (0.5) y cobertura HITL (0.7) son métricas distintas; confundirlas oculta fallos de RUC.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-024 · acc_ruc + coverage_auto
# DEFECT: confunde coverage con review rate y hardcodea acc
golden = [
    {"ruc_pred": "20123456789", "ruc_true": "20123456789"},
    {"ruc_pred": "20123456780", "ruc_true": "20123456789"},
]
auto, review = 7, 3
print(1.0, review / (auto + review))
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `golden = [
    {"ruc_pred": "20123456789", "ruc_true": "20123456789"},
    {"ruc_pred": "20123456780", "ruc_true": "20123456789"},
]
auto, review = 7, 3
acc_ruc = sum(1 for r in golden if r["ruc_pred"] == r["ruc_true"]) / len(golden)
coverage_auto = auto / (auto + review)
print(acc_ruc, coverage_auto)`,
          output: `0.5 0.7`,
        },
      },
      {
        id: "S24-T4-B-E1",
        subtopicId: "S24-T4-B",
        kind: "guided",
        instruction:
          "Allowlist mime: mime='application/zip' no está en pdf/png/jpeg → imprime reject. Contrato: fail-closed (si no está permitido, rechaza). Pass: reject. Usa solo fixtures sintéticos del lab; la salida debe coincidir exactamente con el solution output del grader.",
        hint: "set membership",
        hints: [
          "zip no está en la allowlist del intake de facturas",
          "reject si mime not in allowed",
          "No confíes en la extensión del nombre de archivo",
        ],
        edgeCases: ["doble extensión"],
        tests: "salida coincide con solution output",
        feedback: "application/zip se rechaza en el gate de admisión antes del motor OCR.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-024 · mime allowlist
# DEFECT: ramas invertidas (acepta zip)
mime='application/zip'
allowed={'application/pdf','image/png','image/jpeg'}
print('ok' if mime not in allowed else 'reject')
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
        hint: "n > 5_000_000 → reject",
        hints: [
          "Tope didáctico del lab: 5_000_000 bytes",
          "Si n supera el tope → reject",
          "El starter invierte ok/reject",
        ],
        edgeCases: ["streaming"],
        tests: "salida coincide con solution output",
        feedback: "6e6 > 5e6 → reject. Invertir el umbral abre la puerta a zip-bomb / DoS.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-024 · size guard
# DEFECT: umbral invertido
n=6_000_000
print('ok' if n > 5_000_000 else 'reject')
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
          "Gate + fallback: meta zip (mime application/zip, n=10) → reject por mime; meta pdf 9e6 bytes → reject por size; meta pdf 100k con status_ocr='ocr_fail' → human_rescan. Imprime las tres acciones en orden. Pass: reject reject human_rescan.",
        hint: "allowlist + size + mapa fallback",
        hints: [
          "Primero gate mime/size; solo si pasa el gate aplica fallback de OCR",
          "ocr_fail → human_rescan (no reintentar 100 veces el mismo binario)",
          "Orden: zip, pdf grande, pdf ocr_fail",
        ],
        edgeCases: ["no LLM sin evidencia; fail-closed en mime"],
        tests: "salida coincide con solution output",
        feedback: "Hostiles se rechazan en admisión; ocr_fail cae a human_rescan. continue en fail quema CPU.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-024 · gate hostil + fallback ocr_fail
# DEFECT: acepta zip y reintenta OCR
ALLOWED = {"application/pdf", "image/png", "image/jpeg"}
MAX_N = 5_000_000
cases = [
    {"mime": "application/zip", "n": 10, "status_ocr": "ok"},
    {"mime": "application/pdf", "n": 9_000_000, "status_ocr": "ok"},
    {"mime": "application/pdf", "n": 100_000, "status_ocr": "ocr_fail"},
]
for c in cases:
    print("continue")
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `ALLOWED = {"application/pdf", "image/png", "image/jpeg"}
MAX_N = 5_000_000
cases = [
    {"mime": "application/zip", "n": 10, "status_ocr": "ok"},
    {"mime": "application/pdf", "n": 9_000_000, "status_ocr": "ok"},
    {"mime": "application/pdf", "n": 100_000, "status_ocr": "ocr_fail"},
]
for c in cases:
    if c["mime"] not in ALLOWED:
        print("reject")
    elif c["n"] > MAX_N:
        print("reject")
    elif c["status_ocr"] == "ocr_fail":
        print("human_rescan")
    else:
        print("ok")`,
          output: `reject
reject
human_rescan`,
        },
      },
    ],
  },
  youDo: {
    title: "Intake OCR sintético (document intake CP-N2-C)",
    context:
      "Procesa al menos 3 “documentos” sintéticos (dicts de tokens o meta de imagen): preproceso meta → extracción KV → normalización a schema → validación cross-field → métricas por campo y cola de revisión. Sin PII real; sin label de fraude. Criterio de aceptación: un script o notebook que, al correr, imprima status por doc, reasons[] cuando aplique, y acc_ruc / acc_total / coverage_auto sobre un mini golden.",
    objectives: [
      "Pipeline preproceso → OCR simulado → schema (campos ruc, total, fecha)",
      "Abstener campos low-conf (umbral por campo crítico, p. ej. RUC < 0.85 → review)",
      "Golden de al menos 2 docs con accuracy por campo (ruc y total)",
      "Gate de archivos hostiles (mime allowlist + size cap) antes del motor",
    ],
    requirements: [
      "Datos 100% sintéticos (facturas demo, IDs fake)",
      "bbox o evidencia por campo crítico en el dict de salida",
      "needs_review ≠ fraude (política explícita en log o comentario de módulo)",
      "es-PE en labels de UI/log",
      "Funciones puras testeables: al menos preprocess, parse_kv, norm_*, validate, field_acc",
      "README breve: cómo correr, fixtures usados, métricas obtenidas",
    ],
    starterCode: `"""Document intake CP-N2-C — scaffold sintético.
Completa preprocess, parse_kv, norm_*, validate y field_acc.
Política: needs_review ≠ fraude; solo fixtures sintéticos.
"""
import re
from datetime import datetime

# Meta de imagen sintética (simula artefacto descargado en S23)
img_meta = {"w": 1000, "h": 1400, "dpi": 96, "skew_deg": 1.5, "contrast": 1.0}

# Tokens OCR simulados (FakeOcrAdapter style)
tokens = [
    {"text": "RUC: 20123456789", "conf": 0.9, "bbox": [10, 50, 200, 70]},
    {"text": "Total: 150,00", "conf": 0.88, "bbox": [10, 80, 120, 100]},
    {"text": "Fecha: 15/01/2026", "conf": 0.92, "bbox": [10, 110, 160, 130]},
]

# Mini golden (al menos 2 docs) — completa pred vs true
golden = [
    {"ruc_pred": None, "ruc_true": "20123456789", "total_pred": None, "total_true": 150.0},
    {"ruc_pred": "20123456780", "ruc_true": "20123456789", "total_pred": 99.0, "total_true": 100.0},
]

def preprocess(meta):
    # TODO: dpi >= 200, deskew_applied, skew_deg -> 0.0
    return meta

def parse_kv(toks):
    # TODO: "Clave: valor" -> dict; conserva bbox del valor si puedes
    return {}

def norm_ruc(s):
    # TODO: solo dígitos; len == 11 o None
    return s

def norm_total(s):
    # TODO: montos PE ("150,00" -> 150.0); no borrar comas a ciegas
    return float(s) if s else None

def validate(doc):
    # TODO: reasons total_mismatch / ruc_missing / ruc_low_conf; status auto|needs_review
    return "needs_review", ["not_implemented"]

def field_acc(rows, field):
    # TODO: correct/n sobre {field}_pred == {field}_true
    return 0.0

# Gate hostil (ejemplo): zip o size > 5e6 -> reject antes del motor
def gate_file(meta):
    allowed = {"application/pdf", "image/png", "image/jpeg"}
    if meta.get("mime") not in allowed:
        return "reject", "mime"
    if meta.get("n_bytes", 0) > 5_000_000:
        return "reject", "size"
    return "ok", "pass"

print("intake_ready")
print("gate", gate_file({"mime": "image/png", "n_bytes": 12_000}))
# Al terminar: imprime status/reasons por doc, acc_ruc, acc_total, coverage_auto
`,
    portfolioNote:
      "Módulo document intake CP-N2-C con golden y política de abstención. Ideal para demostrar evidencia por campo y cola HITL en entrevistas de backoffice/ops data.",
    rubric: [
      { criterion: "Pipeline completo: preproceso → OCR simulado → schema → validación → métricas por campo", weight: "25%" },
      { criterion: "Correctitud de normalización (RUC 11 dígitos, montos PE, fechas ISO) y validación cross-field", weight: "20%" },
      { criterion: "Privacidad / sin PII real / sin secretos / sin inferencia de fraude", weight: "20%" },
      { criterion: "Casos de borde: low-conf, mismatch, mime/size reject, documentados con salida esperada", weight: "15%" },
      { criterion: "Código legible, funciones puras y límites claros (real vs fake adapter)", weight: "10%" },
      { criterion: "Documentación en español profesional (README + métricas reportadas)", weight: "10%" },
    ],
  },
  selfCheck: {
    questions: [
      {
        question: "¿Qué haces si confidence de RUC es 0.6?",
        options: ["Aceptar igual", "Inventar dígitos", "Etiquetar fraude", "Abstener y encolar revisión"],
        correctIndex: 3,
        explanation:
          "Abstención bajo umbral es control de calidad: el campo crítico va a cola, no se inventan dígitos.",
      },
      {
        question: "Un mismatch total vs líneas implica:",
        options: ["Fraude probado", "Cola de revisión / corrección", "Borrar el doc", "Subir DPI"],
        correctIndex: 1,
        explanation:
          "Validación ≠ acusación de fraude. Solo encola reasons[] para humanos.",
      },
      {
        question: "¿Por qué medir accuracy por campo?",
        options: ["Es más corto", "OCR no tiene global", "Los campos críticos pueden fallar aunque el global se vea bien", "Solo para imágenes"],
        correctIndex: 2,
        explanation:
          "Campos caros (RUC, total) necesitan SLO propio; un accuracy global los disimula.",
      },
      {
        question: "Archivo application/zip en intake de facturas:",
        options: ["Gate reject/review por mime no permitido", "Siempre OK", "OCR directo", "Enviar por email"],
        correctIndex: 0,
        explanation:
          "Allowlist de mime y tamaño: zip no es documento de factura del lab.",
      },
      {
        question: "Si los scores de orientación dan lo mejor en 180° con score 0.7, ¿cuándo corres OCR?",
        options: [
          "Antes de rotar, para ganar tiempo",
          "Después de corregir orientación",
          "Solo si conf media > 0.9",
          "Nunca; se etiqueta fraude",
        ],
        correctIndex: 1,
        explanation:
          "Orientación incorrecta rompe layout y puede dar confidence alta en basura; corrige antes del motor.",
      },
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
        label: "Document Image Analysis (survey / DPI literature)",
        note: "deskew, layout y preproceso — scholar.google.com/scholar?q=document+image+analysis+OCR+deskew+survey",
      },
      {
        label: "Practical MLOps (data quality chapters)",
        note: "golden sets y métricas en producción — oreilly.com/library/view/practical-mlops/9781098103002/",
      },
    ],
    courses: [
      {
        label: "DeepLearning.AI — Document AI / multimodal tracks",
        url: "https://www.deeplearning.ai/courses/",
        note: "Progresión OCR → layout → extracción; complemento a este lab sintético",
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
        label: "Landing AI / Document AI industry primers",
        url: "https://landing.ai/",
        note: "Referencia de campo: confidence por campo y HITL",
      },
    ],
  },
}
