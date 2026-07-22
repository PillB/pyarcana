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
    "El **document intake** de CP-N2-C convierte imágenes sintéticas reales en campos con evidencia (bbox, confidence) y cola de revisión. El OCR se consume mediante un contrato común con adapters `real` y `fake` explícitos; abstenerse bajo confidence es control de calidad.",
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
        "Aquí haces **document intake**: crear y preprocesar una imagen sintética, ejecutar un adapter OCR con confidence, normalizar a schema, validar y medir un golden set.",
        "Todo documento es **sintético** (facturas demo, IDs fake). Conservas **bounding boxes** y te **abstienes** si confidence < umbral.",
        "Orden: **T1 Imagen** → **T2 OCR** → **T3 Extracción** → **T4 Evaluación**. Coincidir campos no prueba fraude.",
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
        "**DPI** bajo degrada OCR. **Deskew** corrige inclinación; **crop** elimina márgenes; **contraste** ayuda a tinta débil.",
        "Modelamos ops como transformaciones sobre metadatos de imagen sintética (ancho, ángulo, histograma).",
        "Pipeline: load → dpi_check → deskew → crop → contrast → OCR.",
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
        "Ruido (sal/pimienta, compresión) y **orientación** (0/90/180/270) rompen el layout.",
        "Detecta orientación por señales (cabecera arriba, densidad de texto) o modelo; corrige antes de OCR.",
        "Simulamos score de orientación y filtro de ruido binario.",
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
        "Configura **idiomas** (spa+eng). El **layout** (bloques, columnas) guía la lectura.",
        "Cada token/campo trae **confidence** 0–1. Umbral de abstención por campo crítico.",
        "No promedies confidence a ciegas: un campo clave bajo tumba el auto-aceptar.",
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
        "Extrae **texto corrido**, **tablas** (filas/cols) y **KV** (RUC→valor) con bbox de evidencia.",
        "Heurística KV: label a la izquierda, valor a la derecha en misma línea.",
        "Tablas sintéticas como listas de listas.",
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
        "Un **schema** define campos, tipos y required. Normaliza monedas, fechas ISO y RUC a dígitos.",
        "Output canónico: `{field, value, conf, bbox, source_doc_id}`.",
        "Versión del schema en metadata del run.",
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
        "**Cross-field**: total ≈ suma de líneas; fecha ≤ hoy; RUC checksum sintético opcional.",
        "Falla de regla → `needs_review` con razones. El humano corrige; el bot no “adivina”.",
        "Matching de proveedor por nombre similar **no** es veredicto de fraude.",
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
        "El **golden set** tiene documentos sintéticos con labels. Mide **exactitud por campo** y **cobertura** (cuántos auto vs review).",
        "Campo crítico (RUC, total) tiene SLO propio.",
        "Nunca evalúes solo accuracy global: oculta fallas en campos caros.",
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
        "**Privacidad**: no subas PII real a APIs públicas; usa sintéticos o entornos aprobados.",
        "**Hostiles**: zip bombs, PDF con JS, imágenes enormes → límites de tamaño y tipo MIME.",
        "**Fallback**: si OCR falla, encola humano o pide re-scan; no completes campos con LLM sin evidencia.",
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
          code: `img={"w":800,"h":1000,"dpi":72,"skew_deg":2.0}
img["dpi"]=max(img["dpi"],200)
img["deskew"]=abs(img["skew_deg"])>=0.5
print(img["dpi"], img["deskew"])`,
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
          code: `scores={0:0.2,180:0.75,90:0.05}
print(max(scores, key=scores.get))`,
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
          code: `toks=[{"t":"RUC","c":0.9},{"t":"20X","c":0.55}]
print([t for t in toks if t["c"]<0.85])`,
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
          code: `lines=["RUC: 20123456789","Total: 10"]
kv={}
for ln in lines:
    k,v=ln.split(":",1); kv[k.strip()]=v.strip()
print(kv)`,
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
s="20.123456789"
d=re.sub(r"\\D","",s)
print(d, len(d)==11)`,
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
          code: `total, lines=150.0,[100.0,50.0]
print("ok" if abs(sum(lines)-total)<1e-6 else "needs_review")`,
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
          code: `g=[{"p":"A","t":"A"},{"p":"B","t":"A"}]
print(sum(1 for r in g if r["p"]==r["t"])/len(g))`,
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
          code: `meta={"mime":"application/pdf","n":100}
print("ok" if meta["mime"]=="application/pdf" and meta["n"]<5_000_000 else "reject")`,
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
          "Si dpi<200, súbelo a 200 e imprime.",
        hint: "max()",
        hints: [
          "max()",
          "asignación",
        ],
        edgeCases: ["upscaling no crea detalle real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `dpi=96
# TODO
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
          "deskew_applied = abs(skew)>=0.5 para skew=1.2 e imprime.",
        hint: "abs",
        hints: [
          "abs",
          "boolean",
        ],
        edgeCases: ["umbral empírico"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `skew=1.2
# TODO
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
          "Crop box 5% márgenes en w=1000,h=1000: imprime (x0,y0,x1,y1).",
        hint: "int 0.05*w",
        hints: [
          "int 0.05*w",
          "tuple",
        ],
        edgeCases: ["no crops contenido útil"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `w=h=1000
# TODO
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
          "Elige rotación con mayor score en {0:0.1,90:0.8}.",
        hint: "max key=",
        hints: [
          "max key=",
          "dict",
        ],
        edgeCases: ["empates"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `s={0:0.1,90:0.8}
# TODO
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
          "Cuenta píxeles de ruido (1) en [0,1,1,0].",
        hint: "sum",
        hints: [
          "sum",
          "lista",
        ],
        edgeCases: ["modelo real de denoise"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `flags=[0,1,1,0]
# TODO
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
          "Si score_orient<0.5 imprime 'manual_orient' else 'auto'.",
        hint: "umbral",
        hints: [
          "umbral",
          "string",
        ],
        edgeCases: ["página en blanco"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `score=0.4
# TODO
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
          "Filtra tokens con conf>=0.85 e imprime textos.",
        hint: "list comp",
        hints: [
          "list comp",
          "umbral",
        ],
        edgeCases: ["umbral por campo"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `toks=[{'text':'A','conf':0.9},{'text':'B','conf':0.5}]
# TODO
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
          "Idioma por defecto 'spa'; imprime lang del resultado OCR simulado.",
        hint: "parámetro default",
        hints: [
          "parámetro default",
          "dict",
        ],
        edgeCases: ["spa+eng"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO
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
          "Min confidence de una lista de campos; si min<0.8 status=review.",
        hint: "min()",
        hints: [
          "min()",
          "status",
        ],
        edgeCases: ["no promedies a ciegas"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `confs=[0.9,0.75,0.95]
# TODO
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
          "Parsea 'Total: 12.5' a clave y valor.",
        hint: "split once",
        hints: [
          "split once",
          "strip",
        ],
        edgeCases: ["múltiples dos puntos"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `s='Total: 12.5'
# TODO
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
          "De tabla [[H1,H2],[a,b]] imprime número de filas de datos.",
        hint: "len-1",
        hints: [
          "len-1",
          "header",
        ],
        edgeCases: ["tablas irregulares"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `t=[['H1','H2'],['a','b']]
# TODO
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
          "Adjunta bbox [0,0,10,10] al valor RUC en un dict field.",
        hint: "estructura evidencia",
        hints: [
          "estructura evidencia",
          "dict anidado",
        ],
        edgeCases: ["coords en px página"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO
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
          "Normaliza '20-123' dejando solo dígitos.",
        hint: "re.sub",
        hints: [
          "re.sub",
          "\\D",
        ],
        edgeCases: ["vacío tras norm"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `import re
s='20-123'
# TODO
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
          "Convierte '15/01/2026' a ISO date string.",
        hint: "strptime",
        hints: [
          "strptime",
          "%d/%m/%Y",
        ],
        edgeCases: ["formatos mixtos"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `from datetime import datetime
# TODO
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
          "Si RUC normalizado no tiene len 11, devuelve None e imprime.",
        hint: "guard clause",
        hints: [
          "guard clause",
          "None",
        ],
        edgeCases: ["None en JSON null"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `import re
raw='123'
# TODO
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
          "Si abs(sum(lines)-total)>0.01 imprime needs_review.",
        hint: "abs",
        hints: [
          "abs",
          "tolerancia",
        ],
        edgeCases: ["redondeo moneda"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `total, lines=10.0,[4.0,5.0]
# TODO
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
          "Acumula reasons list si ruc is None.",
        hint: "append",
        hints: [
          "append",
          "lista",
        ],
        edgeCases: ["múltiples reasons"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `ruc=None
reasons=[]
# TODO
print(reasons)`,
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
          "Imprime 'review_not_fraud' cuando hay mismatch (mensaje de política).",
        hint: "política explícita",
        hints: [
          "política explícita",
          "string fijo",
        ],
        edgeCases: ["separar risk triage"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `mismatch=True
# TODO
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
          "Accuracy = correct/n para 3 de 4 correctos.",
        hint: "división float",
        hints: [
          "división float",
          "print",
        ],
        edgeCases: ["n=0"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `correct, n = 3, 4
# TODO
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
          "Calcula acc por campo 'ruc' en lista de dicts pred/true.",
        hint: "sum generator",
        hints: [
          "sum generator",
          "campo",
        ],
        edgeCases: ["campos missing"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `rows=[{'ruc_pred':'1','ruc_true':'1'},{'ruc_pred':'2','ruc_true':'1'}]
# TODO
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
          "coverage_auto = auto/(auto+review); imprime con auto=7, review=3.",
        hint: "fórmula",
        hints: [
          "fórmula",
          "float",
        ],
        edgeCases: ["abstention es métrica de producto"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `auto, review = 7, 3
# TODO
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
          "Rechaza mime no pdf/png/jpeg.",
        hint: "set membership",
        hints: [
          "set membership",
          "mime",
        ],
        edgeCases: ["doble extensión"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `mime='application/zip'
allowed={'application/pdf','image/png','image/jpeg'}
# TODO
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
          "Si n_bytes>5e6 reject por size.",
        hint: "comparación",
        hints: [
          "comparación",
          "constante",
        ],
        edgeCases: ["streaming"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `n=6_000_000
# TODO
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
          "Fallback: ocr_fail → 'human_rescan'. Imprime acción.",
        hint: "mapa de fallbacks",
        hints: [
          "mapa de fallbacks",
          "dict get",
        ],
        edgeCases: ["no LLM sin evidencia"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `status='ocr_fail'
# TODO
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
# TODO: kv, schema, validate, metrics
print("TODO intake")
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
    ],
  },
  resources: {
    docs: [
      {
        label: "Tesseract OCR",
        url: "https://tesseract-ocr.github.io/",
        note: "OCR clásico",
      },
      {
        label: "Pillow handbook",
        url: "https://pillow.readthedocs.io/",
        note: "Preproceso imagen",
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
        label: "pytesseract basics",
        url: "https://pypi.org/project/pytesseract/",
        note: "bridge Python",
      },
    ],
  },
}
