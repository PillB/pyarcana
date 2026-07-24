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
    "En un backoffice de Lima (facturas, boletas y PDFs de proveedores), el cuello de botella no es “leer letras”: es convertir un artefacto (PNG/PDF sintético en el lab) en **campos con evidencia** que un humano pueda auditar en minutos. El **document intake** de CP-N2-C modela ese camino: preproceso → OCR con confidence y bbox → schema → validación cross-field → cola HITL y métricas por campo. El OCR se expone con un contrato común `real`/`fake` para tests; abstenerse bajo confidence es control de calidad, no veredicto de fraude. El valor profesional es **encolar bien** — no “cerrar” casos por score ni inventar dígitos de RUC.",
  learningOutcomes: [
    { text: "Preprocesar imágenes sintéticas (DPI, deskew, crop, contraste) y dejar flags auditables" },
    { text: "Corregir ruido y orientación antes de correr el motor OCR" },
    { text: "Ejecutar OCR con idiomas, confidence por campo y orden de lectura básico por bbox" },
    { text: "Extraer texto, tablas y pares clave–valor con evidencia del valor" },
    { text: "Normalizar a schema (RUC 11 dígitos, montos PE, fechas ISO) sin inventar valores" },
    { text: "Validar cross-field, acumular reasons[] y encolar revisión sin label de fraude" },
    { text: "Evaluar exactitud por campo y coverage_auto sobre un golden set sintético" },
    { text: "Aplicar gates de privacidad, mime/tamaño hostiles y fallback human_rescan" },
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
        "Cuando una boleta llega al intake a **96 DPI** (foto de celular, PDF rasterizado barato), el motor OCR confunde “8” con “B” y el RUC se rompe. **DPI** es densidad de puntos por pulgada: el lab eleva a **≥200** (ideal **300** efectivos) *antes* del motor. **Deskew** corrige la inclinación del escaneo; **crop** recorta márgenes negros que distraen al layout; **contraste** ayuda tinta débil. Ninguna de estas ops “arregla fraude”: no inventan dígitos ni reescriben montos.",
        "En este curso modelamos las ops como transformaciones sobre **metadatos** de imagen sintética (`w, h, dpi, skew_deg, contrast`). No necesitas OpenCV instalado para aprender el **contrato** del pipeline: qué entra, qué sale y qué flags quedan en el log. Cada corrida deja `deskew_applied` y el `crop_box` auditable — así el revisor o el test de regresión saben *qué* se le hizo a la página antes del OCR.",
        "Pipeline canónico: `load → dpi_check → deskew → crop → contrast → OCR`. Caso PE sintético (Lima, batch nocturno): foto de boleta a 96 DPI y 1.8° de sesgo. Tras preproceso esperas `dpi=200`, `deskew_applied=True`, `skew_deg=0.0` (ángulo ya corregido), crop ~2–5% y contraste escalado con tope — listo para el adapter con `lang=spa`.",
        "Borde útil: si el sesgo es casi nulo (`|skew| < 0.5°`), no marques deskew “por si acaso”; un flag falso ensucia la auditoría. Si el DPI ya es 300, `max(dpi, 200)` lo deja intacto. El preproceso es barato frente a re-OCR: invierte ahí antes de culpar al motor.",
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
        title: "Criterio de preproceso antes del motor",
        content:
          "Checklist: (1) dpi ≥ 200 (ideal 300 en tipografía pequeña), (2) deskew_applied solo si |skew| ≥ 0.5°, (3) crop deja márgenes sin recortar sello/total, (4) contraste con tope — nunca reescribe dígitos. Si falla RUC, revisa este checklist antes de cambiar de modelo OCR.",
      },
    },
    {
      heading: "Ruido y orientación",
      subtopicId: "S24-T1-B",
      paragraphs: [
        "Dos enemigos silenciosos del intake: **ruido** (sal/pimienta, JPEG agresivo) y **orientación** (0°/90°/180°/270°). Si corres OCR con la página al revés, el layout se rompe y —peor— el motor a veces devuelve **confidence alta en basura**. El revisor confía en el score y no mira el bbox: se cuela un RUC inventado en la cola “auto”.",
        "Detecta orientación por scores de señales (cabecera “FACTURA”, densidad de texto) o por un modelo ligero; elige la rotación de **máximo score** y aplica la corrección **antes** del motor. Simulamos scores por rotación y un denoise de **contrato** sobre flags 0/1: no es un filtro de imagen real (un denoise de producción usaría mediana o morfología); aquí auditamos el flag de ruido para tests y runbooks.",
        "Si el mejor score de orientación queda **bajo 0.5**, el intake prefiere `manual_orient` (un humano gira la página) antes de forzar auto con baja certeza — fail-closed de calidad. Forzar OCR “para no parar el batch” es el anti-patrón que llena la cola de basura cara de revisar.",
        "Caso sintético del lab: scores `{0:0.1, 90:0.05, 180:0.7, 270:0.15}` → 180° con score 0.7 → `auto` (aún así rotas la página *antes* del OCR). Un OCR previo a orientar permuta dígitos de RUC; el runbook del batch nocturno exige `fix_orientation` en el preflight, junto a mime y tamaño.",
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
        title: "Orden obligatorio: orientar → luego OCR",
        content:
          "Si el mejor score es 180° (aunque sea 0.7), rota la página y *después* llama al motor. OCR “al revés para ahorrar un paso” genera campos basura con confidence engañosa. Si score < 0.5 → manual_orient, no auto-aceptes.",
      },
    },
    {
      heading: "Idiomas, layout y confidence",
      subtopicId: "S24-T2-A",
      paragraphs: [
        "Configura **idiomas** (`spa+eng`) según el corpus: facturas PE en español con tokens EN de software (“SUBTOTAL”, “SKU”). Un motor mal configurado en solo `eng` castiga acentos y “RUC”. El **layout** (bloques, columnas) guía el **orden de lectura**: en el lab ordenamos por bbox `(y0, x0)` — arriba→abajo, izquierda→derecha. No concatenes columnas a ciegas o mezclarás el “Total” de la derecha con ítems de la izquierda.",
        "Cada token/campo trae **confidence** entre 0 y 1. El error clásico es promediar: un RUC a 0.55 y un “FACTURA” a 0.99 promedian “bien” y el intake auto-acepta basura. Usa **abstención por campo crítico** (RUC, total): si conf del RUC < 0.85 → `review_queue`. No inventes dígitos ni “corrijas” con un checksum inventado sin política escrita.",
        "Contrato del adapter: `ocr_page(tokens, lang) → lista {text, conf, bbox, lang}`. Los low-conf se listan para HITL. `FakeOcrAdapter` devuelve observaciones fijadas para tests de parsing y abstención; **nunca** se presenta como motor real en logs de “producción” del curso. `TesseractAdapter` solo si el runtime declara el binario instalado.",
        "Caso sintético: tokens desordenados (valor RUC primero en la lista, cabecera después). Tras ordenar por bbox, el orden de lectura es FACTURA → RUC → valor. El valor 20123456789 con conf 0.72 va a low_conf aunque el resto de la página se vea “nítida”.",
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
        title: "Abstención por campo crítico (no por promedio)",
        content:
          "Umbral didáctico del lab para RUC: conf < 0.85 → review_queue. Calcula min(conf de críticos) o revisa campo a campo. Promediar 0.55 con 0.99 para “pasar” es anti-patrón: oculta el dígito débil. Nunca rellenes dígitos faltantes.",
      },
    },
    {
      heading: "Texto, tablas y pares clave–valor",
      subtopicId: "S24-T2-B",
      paragraphs: [
        "Del OCR salen tres familias útiles: **texto corrido**, **tablas** (filas/columnas) y **pares clave–valor** (KV: RUC→valor, Total→monto). En intake, el KV es la unidad mínima que alimenta el schema. Heurística didáctica del lab: línea con “Clave: valor” → `split(\":\", 1)` y `strip` de ambos lados.",
        "La evidencia no es el label “RUC” en negrita: es el **bbox del valor** (los dígitos). El revisor en UI resalta ese rectángulo sin re-OCRizar. Si solo guardas el bbox del label, el humano no ve el número dudoso y pierde tiempo.",
        "Tablas sintéticas: listas de listas con header en fila 0; `n_data_rows = len(table) - 1`. Los ítems (montos de línea) alimentan la validación `sum(líneas) ≈ total` con tolerancia monetaria (0.01). Contar el header como ítem infla la suma y manda a revisión por error de parsing, no de negocio.",
        "Caso PE: líneas “RUC: 20123456789” y “Total: 150.00” → dict KV; tabla de 2 ítems. Adjunta bbox del valor RUC al field dict. Más adelante, Document AI comercial hace layout multi-columna y tablas complejas; aquí fijas el contrato de evidencia antes de cambiar de motor.",
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
        title: "Evidencia = valor + bbox del valor",
        content:
          "Al armar el field dict guarda: name, value, conf, bbox del valor (no del label). Sin bbox el HITL no resalta; sin conf no sabes si abstener. El label “RUC” solo ayuda al parser, no al revisor.",
      },
    },
    {
      heading: "Schema y normalización",
      subtopicId: "S24-T3-A",
      paragraphs: [
        "Un **schema** define campos, tipos y required: p. ej. `ruc` str de 11 dígitos, `total` float, `fecha` date ISO. La normalización es el puente entre “lo que el OCR leyó” y “lo que el sistema puede validar”. Output canónico por campo: `{field, value, conf, bbox, source_doc_id}` más `schema_version` en metadata del run.",
        "Montos en Perú usan **coma decimal**: `\"150,00\"` es ciento cincuenta, no quince mil. Si borras comas a ciegas (`replace(\",\", \"\")`) obtienes `15000.0` y envenenas la validación cross-field y el golden set. Regla didáctica: si hay coma y punto (`\"1.150,00\"`), quita puntos de miles y cambia la coma por punto; si solo hay coma, cámbiala por punto; si solo hay punto estilo EN (`\"150.00\"`), ya es float-ready.",
        "RUC: deja solo dígitos; si la longitud no es 11, `value=None` — no rellenes con ceros mágicos ni “completes” con checksum sin política. Fechas de boleta `DD/MM/YYYY` → `YYYY-MM-DD` con `strptime` day-first (formato PE); el formato US `%m/%d/%Y` interpreta mal el día 15.",
        "Versionar el schema (`invoice.v1`) evita que un deploy cambie el significado de `total_incl_igv` a mitad de un golden set. Contrato del lab: `norm_ruc` / `norm_total` / `norm_fecha` puras, testeables sin red ni archivos reales.",
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
        title: "None ≠ 0 (y coma ≠ miles)",
        content:
          "Si el RUC no normaliza a 11 dígitos, deja None y manda a revisión — no pongas \"000...\" ni 0.0 en total. En montos PE, \"150,00\" → 150.0; borrar comas a ciegas produce 15000.0 y rompe el intake.",
      },
    },
    {
      heading: "Validación cross-field y cola de revisión",
      subtopicId: "S24-T3-B",
      paragraphs: [
        "La validación **cross-field** compara campos entre sí: `abs(sum(líneas) - total) > 0.01` → `total_mismatch`. RUC `None` → `ruc_missing`. Confidence de RUC bajo umbral → `ruc_low_conf`. Las reasons se **acumulan** en una lista; el documento no se auto-acepta si la lista no está vacía.",
        "La cola de revisión (HITL: *human-in-the-loop*) es el **producto**, no un “error del sistema”. Entregas `status=needs_review`, `reasons[]` y bbox para que un humano decida. **Mismatch contable ≠ fraude**: una boleta mal tipada o un OCR con un dígito flojo no es acusación. Política del lab: `review_not_fraud` — humanos investigan; el pipeline solo encola.",
        "Caso sintético del lab (mismos números en teoría, demo y transferencia): total 150.0 vs líneas [100, 50] y RUC confiable → `auto` con reasons vacías; total 150.0 vs [100, 40], ruc None y conf 0.5 → `needs_review` con `total_mismatch`, `ruc_missing` y `ruc_low_conf`.",
        "En batch nocturno, un doc en cola no debe detener el archivo: marcas `human_queue`, logueas reasons y pasas al siguiente. Fail-closed de *calidad* (no auto-aceptar basura) no es lo mismo que fail-stop de *throughput* (tirar el batch entero).",
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
        title: "Política: needs_review ≠ fraude",
        content:
          "total_mismatch, ruc_missing o low_conf solo llenan reasons[] y status=needs_review. Nunca emitas label auto_fraud desde OCR. Una inconsistencia contable es cola de revisión, no acusación ni parentesco.",
      },
    },
    {
      heading: "Golden set sintético, exactitud por campo y cobertura",
      subtopicId: "S24-T4-A",
      paragraphs: [
        "Un **golden set** es un conjunto pequeño de páginas/campos etiquetados a mano (pred vs true) que sirve de “verdad de laboratorio”. Mides exactitud **por campo** (ruc, total, fecha), no un accuracy global que esconde fallos caros. Caer en RUC es más grave que errar una glosa opcional: cada campo crítico tiene su propio SLO.",
        "`field_acc = correct / n` compara `ruc_pred == ruc_true` (o total) fila a fila. En paralelo, `coverage_auto = auto / (auto + review)` mide qué fracción de documentos pasa sin HITL. Son métricas distintas: puedes tener cobertura alta y accuracy de RUC baja si bajaste el umbral de abstención.",
        "Anti-patrón de producto: subir `coverage_auto` bajando el umbral de confidence **sin** mirar `acc_ruc`. El dashboard se ve “verde” y el backoffice recibe RUC basura en auto. Reporta siempre el par: exactitud de críticos + cobertura + tasa de abstención.",
        "Caso PE de lab: accuracy global 3/4 → 0.75; en dos filas de golden, `acc_ruc=0.5` y `acc_total=0.5`; con auto=7 y review=3 → `coverage_auto=0.7`. Empaqueta estas métricas en CP-N2-C sin pretender que el OCR “valida identidad legal” o parentesco.",
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
        title: "Reporta el par: accuracy de campo + cobertura",
        content:
          "Imprime al menos acc_ruc, acc_total y coverage_auto=auto/(auto+review). No sustituyas accuracy por cobertura. Si coverage sube y acc_ruc baja, el umbral de abstención está mal calibrado.",
      },
    },
    {
      heading: "Privacidad, archivos hostiles y fallback",
      subtopicId: "S24-T4-B",
      paragraphs: [
        "Privacidad primero: en el lab solo fixtures **sintéticos** (facturas demo, IDs fake). No subas PDFs reales de clientes al sandbox ni al repo. Minimiza: cuando solo necesitas campos + bbox en el expediente, no retengas la imagen cruda más de lo necesario.",
        "Antes del motor, un **gate de admisión**: allowlist de mime (`application/pdf`, `image/png`, `image/jpeg`); zip u otros → `reject`. Tope de tamaño (p. ej. 5_000_000 bytes) mitiga zip-bomb y DoS al worker OCR. No confíes en la extensión del nombre de archivo (`factura.pdf.zip` disfrazado).",
        "Si el OCR falla con un binario corrupto (`ocr_fail`), el fallback operativo es `human_rescan` (re-escaneo o tipeo asistido) — no reintentar 100 veces el mismo archivo. Reintentar en bucle quema CPU y no mejora un PDF roto.",
        "Contrato de seguridad del intake: fail-closed en mime/size; logs sin PII real; adapters `real`/`fake` etiquetados en logs. El revisor ve reasons y bbox; nunca un badge de “fraude detectado por OCR”.",
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
        title: "Gate antes del motor + minimización",
        content:
          "Orden: (1) mime allowlist, (2) size cap, (3) recién entonces OCR. Zip o >5e6 bytes → reject. ocr_fail → human_rescan, no bucle infinito. Borra imágenes crudas cuando el expediente solo necesita campos + bbox.",
      },
    },
  ],
  iDo: {
    intro: "Te muestro el document intake CP-N2-C en ocho demos cortos: preproceso, orientación, confidence, KV, schema, cross-field, golden y gate hostil — sin inferir fraude. Cada demo imprime exactamente el resultado que ves en `output`; puedes copiar y correr en tu intérprete local.",
    steps: [
      {
        demoId: "S24-T1-A-DEMO",
        subtopicId: "S24-T1-A",
        environment: "local",
        description: "Eleva DPI a ≥200 y marca deskew si el sesgo de la meta sintética supera 0.5°.",
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
        why: "Elevar DPI y corregir sesgo *antes* del motor suele mejorar más la lectura de RUC que cambiar de modelo OCR; el flag deskew queda auditable en el run.",
      },
      {
        demoId: "S24-T1-B-DEMO",
        subtopicId: "S24-T1-B",
        environment: "local",
        description: "Elige la rotación de mayor score (0/90/180/270) antes de llamar al OCR.",
        code: {
          language: 'python',
          title: "demo.py",
          code: `def best_orientation(scores):
    return max(scores, key=scores.get)

print(best_orientation({0: 0.2, 180: 0.75, 90: 0.05}))
`,
          output: `180`,
        },
        why: "Si la página está al revés, el layout se rompe y el OCR puede devolver basura con confidence engañosamente alta; orientar primero evita cola cara de basura.",
      },
      {
        demoId: "S24-T2-A-DEMO",
        subtopicId: "S24-T2-A",
        environment: "local",
        description: "Filtra tokens bajo umbral de confidence (0.85) sin promediar con tokens fuertes.",
        code: {
          language: 'python',
          title: "demo.py",
          code: `def low_confidence(toks, thr=0.85):
    return [t for t in toks if t["c"] < thr]

print(low_confidence([{"t": "RUC", "c": 0.9}, {"t": "20X", "c": 0.55}]))
`,
          output: `[{'t': '20X', 'c': 0.55}]`,
        },
        why: "Un campo crítico con baja confidence se abstiene y va a cola — no se inventan dígitos ni se promedia con “FACTURA 0.99” para ocultar el dígito débil.",
      },
      {
        demoId: "S24-T2-B-DEMO",
        subtopicId: "S24-T2-B",
        environment: "local",
        description: "Parsea pares clave–valor desde líneas “Clave: valor” con strip en ambos lados.",
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
        why: "El par clave–valor es la unidad mínima de evidencia textual antes de normalizar al schema; sin strip, el valor lleva espacio y rompe el grader y el golden.",
      },
      {
        demoId: "S24-T3-A-DEMO",
        subtopicId: "S24-T3-A",
        environment: "local",
        description: "Normaliza RUC a solo dígitos y valida longitud 11 (sin rellenar ceros).",
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
        why: "Un schema canónico (solo dígitos, longitud fija) evita basura en validación y en el golden set; si len≠11 devuelves fallo, no un RUC inventado.",
      },
      {
        demoId: "S24-T3-B-DEMO",
        subtopicId: "S24-T3-B",
        environment: "local",
        description: "Compara total vs suma de líneas: ok si cuadra, needs_review si no (sin label de fraude).",
        code: {
          language: 'python',
          title: "demo.py",
          code: `def cross_field(total, lines, eps=1e-6):
    return "ok" if abs(sum(lines) - total) < eps else "needs_review"

print(cross_field(150.0, [100.0, 50.0]))
`,
          output: `ok`,
        },
        why: "Cross-field manda a revisión cuando no cuadra; nunca emite un label de fraude por inconsistencia contable — el producto es la cola, no la acusación.",
      },
      {
        demoId: "S24-T4-A-DEMO",
        subtopicId: "S24-T4-A",
        environment: "local",
        description: "Calcula exactitud por campo (pred==true) sobre un mini golden sintético.",
        code: {
          language: 'python',
          title: "demo.py",
          code: `def field_accuracy(g):
    return sum(1 for r in g if r["p"] == r["t"]) / len(g)

print(field_accuracy([{"p": "A", "t": "A"}, {"p": "B", "t": "A"}]))
`,
          output: `0.5`,
        },
        why: "Accuracy por campo crítico (RUC, total) detecta fallos que un accuracy global o una coverage_auto alta disimulan.",
      },
      {
        demoId: "S24-T4-B-DEMO",
        subtopicId: "S24-T4-B",
        environment: "local",
        description: "Acepta solo PDF bajo tope de bytes; rechaza hostiles antes del motor OCR.",
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
        why: "Allowlist de mime y tope de tamaño protegen al worker OCR antes de gastar CPU en zip o binarios enormes; el gate va *antes* del motor.",
      },
    ],
  },
  weDo: {
    intro: "24 ejercicios en tres capas por subtema: **guiado** (arregla un defecto obvio), **independiente** (aplicas el contrato sin plantilla larga) y **transferencia** (compones funciones del intake real). Cubre preproceso, orientación, OCR/KV, schema PE, validación, golden y hostiles. En transferencia no te quedes en un solo print: arma el mini-módulo que luego reutilizarás en el You Do.",
    steps: [
      {
        id: "S24-T1-A-E1",
        subtopicId: "S24-T1-A",
        kind: "guided",
        instruction:
          "Preproceso de intake (solo metadata): un escaneo sintético llega con dpi=96. El piso de calidad del lab es 200 DPI efectivos. Eleva con max(dpi, 200) e imprime el entero resultante. No inventes tipografía: upscaling de metadata no crea detalle óptico real. Pass: 200.",
        hint: "max()",
        hints: [
          "El piso de calidad del lab es 200 DPI efectivos",
          "max(dpi, 200) eleva sin tocar si ya es mayor",
          "Upscaling no inventa tipografía: solo metadata",
        ],
        edgeCases: ["upscaling no crea detalle real"],
        tests: "salida coincide con solution output",
        feedback: "Debes imprimir 200: max(96, 200) eleva el escaneo sintético al piso de OCR. Dejar 96 envía tipografía pequeña rota al motor.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-024 · DPI mínimo 200 para OCR legible
# DEFECT: deja el escaneo en 96 dpi (tipografía pequeña se rompe)
# Completa: eleva al piso de OCR (dpi >= 200) y reporta el valor final.
dpi = 96
# Completa: dpi = max(dpi, 200)
print("dpi_final", dpi)
assert dpi >= 200, "eleva dpi al mínimo de OCR"
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
          "Flag de deskew: la meta sintética trae skew=1.2 grados. Marca deskew_applied = abs(skew) >= 0.5 (umbral didáctico del lab) e imprime el booleano. Sesgo negativo también cuenta: usa valor absoluto. Pass: True.",
        hint: "abs",
        hints: [
          "Usa valor absoluto: sesgo -1.2 también cuenta",
          "deskew_applied es True cuando |skew| >= 0.5",
          "El umbral 0.5° es didáctico del lab, no una norma ISO",
        ],
        edgeCases: ["umbral empírico"],
        tests: "salida coincide con solution output",
        feedback: "Con skew=1.2, abs(skew) >= 0.5 es True — el starter tenía el operador invertido (< en vez de >=).",
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
          "Orientación pre-OCR: scores s={0: 0.1, 90: 0.8}. Elige la rotación (key) de mayor score con max(s, key=s.get) e imprime el entero de grados — no el score. El starter elige min a propósito: corrige el defecto. Pass: 90.",
        hint: "max key=",
        hints: [
          "max(s, key=s.get) devuelve la key del mayor score",
          "No uses min: eso elige la peor orientación",
          "Imprime el entero de grados (90), no el score",
        ],
        edgeCases: ["empates"],
        tests: "salida coincide con solution output",
        feedback: "El score máximo está en 90°; min() era el defecto del starter y enviaría la peor rotación al motor.",
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
          "Auditoría de ruido (contrato, no filtro real): flags=[0, 1, 1, 0] donde 1 = píxel marcado como ruido. Cuenta cuántos flags están en 1 (sum) e imprime ese entero. No uses len(flags): eso cuenta todos los píxeles, no el ruido. Pass: 2.",
        hint: "sum",
        hints: [
          "sum(flags) cuenta los 1 (ruido marcado)",
          "len(flags) cuenta todos los píxeles, no el ruido",
          "Aquí solo auditas el flag; denoise real usaría filtros (mediana/morfología)",
        ],
        edgeCases: ["modelo real de denoise"],
        tests: "salida coincide con solution output",
        feedback: "Hay dos flags en 1 → sum=2. len() cuenta longitud (4), no ruido — confunde al runbook de preflight.",
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
          "Filtro de confidence por token: toks = [{'text':'A','conf':0.9}, {'text':'B','conf':0.5}]. Quédate solo textos con conf >= 0.85 (umbral de auto-accept del lab) e imprime la lista de text. El starter usa 0.5 a propósito: corrige el umbral. No mutes conf. Pass: ['A'].",
        hint: "list comp",
        hints: [
          "Umbral de auto-accept del lab: conf >= 0.85",
          "List comprehension sobre t['text']",
          "0.5 es demasiado bajo y deja pasar basura a auto",
        ],
        edgeCases: ["umbral por campo"],
        tests: "salida coincide con solution output",
        feedback: "Solo 'A' pasa el umbral 0.85; B con 0.5 se filtra. Umbral 0.5 en el starter deja pasar basura al auto-accept.",
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
          "Parse KV de factura: s='Total: 12.5'. Separa clave y valor con split(':', 1), aplica strip a ambos lados e imprime 'Total 12.5' (sin dos puntos). El espacio tras ':' es el defecto típico del starter. Pass: Total 12.5.",
        hint: "split once",
        hints: [
          "split(':', 1) corta solo en el primer dos puntos",
          "strip() en clave y valor quita espacios residuales",
          "print(k, v) con strip imprime 'Total 12.5'",
        ],
        edgeCases: ["múltiples dos puntos"],
        tests: "salida coincide con solution output",
        feedback: "Sin strip, el valor lleva espacio inicial (' 12.5') y falla normalización/golden.",
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
          "Filas de datos en tabla sintética: t=[['H1','H2'],['a','b']]. La fila 0 es header; imprime el número de filas de datos (len(t)-1). Contar el header como ítem infla sumas vs total en validación. Pass: 1.",
        hint: "len-1",
        hints: [
          "Fila 0 es header; datos = len(t) - 1",
          "No cuentes el header como ítem de factura",
          "Con una sola fila de datos el resultado es 1",
        ],
        edgeCases: ["tablas irregulares"],
        tests: "salida coincide con solution output",
        feedback: "len(t) incluye header (2); el contrato pide solo filas de datos (1) para no inflar sumas vs total.",
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
          "Limpieza de RUC parcial: s='20-123' llega con guiones del OCR. Deja solo dígitos con re.sub(r'\\D', '', s) e imprime el string limpio. Aquí no validas longitud 11 (eso va en el schema completo); solo limpias. Pass: 20123.",
        hint: "re.sub",
        hints: [
          "re.sub(r'\\D', '', s) elimina no-dígitos",
          "Aquí no validas longitud 11; solo limpias",
          "No imprimas el string crudo con guiones",
        ],
        edgeCases: ["vacío tras norm"],
        tests: "salida coincide con solution output",
        feedback: "20-123 → 20123 tras quitar no-dígitos. El guion no es dígito; dejarlo rompe el schema.",
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
          "Fecha de boleta PE: '15/01/2026' (día/mes/año) → ISO '2026-01-15' con datetime.strptime y date().isoformat(). Usa '%d/%m/%Y' (day-first). El starter usa formato US '%m/%d/%Y' a propósito: con día 15 falla o invierte. Pass: 2026-01-15.",
        hint: "strptime %d/%m/%Y",
        hints: [
          "Boletas PE: día/mes/año → '%d/%m/%Y'",
          "Formato US '%m/%d/%Y' interpreta mal el 15",
          "date().isoformat() produce YYYY-MM-DD",
        ],
        edgeCases: ["formatos mixtos"],
        tests: "salida coincide con solution output",
        feedback: "15/01/2026 con day-first es 2026-01-15. %m/%d/%Y falla (mes 15 inválido) o invierte el día.",
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
          "Cross-field guiado (números chicos): total=10.0, lines=[4.0, 5.0]. Si abs(sum(lines)-total) > 0.01 imprime needs_review; si no, auto. Tolerancia 0.01 cubre redondeo de moneda. Nunca imprimas 'fraud'. Pass: needs_review.",
        hint: "abs(sum-total)",
        hints: [
          "4.0+5.0=9.0 ≠ 10.0 → mismatch",
          "Tolerancia 0.01 cubre redondeo de moneda",
          "needs_review, no 'fraud'",
        ],
        edgeCases: ["redondeo moneda"],
        tests: "salida coincide con solution output",
        feedback: "Suma 9 vs total 10 supera 0.01 → needs_review. Siempre 'auto' era el defecto del starter (anti-patrón).",
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
          "Acumular reasons para HITL: ruc=None, reasons=[]. Si ruc is None, haz append de 'ruc_missing' e imprime la lista. No lances excepción: el revisor necesita la traza en reasons[], no un crash del batch. Pass: ['ruc_missing'].",
        hint: "append",
        hints: [
          "Acumula reasons; no lances excepción",
          "if ruc is None: reasons.append('ruc_missing')",
          "Varias rules pueden empujar a la misma lista",
        ],
        edgeCases: ["múltiples reasons"],
        tests: "salida coincide con solution output",
        feedback: "RUC ausente debe dejar traza en reasons[] para el revisor humano; lista vacía oculta el fallo.",
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
          "Accuracy global sobre golden: correct=3 aciertos, n=4 campos. Imprime correct/n como float (0.75). El starter calcula la tasa de error (n-correct)/n a propósito — no la copies. Pass: 0.75.",
        hint: "división float",
        hints: [
          "accuracy = correct / n (no error rate)",
          "3/4 = 0.75 en float de Python 3",
          "n-correct/n es la tasa de error, no accuracy",
        ],
        edgeCases: ["n=0"],
        tests: "salida coincide con solution output",
        feedback: "correct/n = 0.75. El starter calculaba la tasa de error (1 - acc) — métrica distinta.",
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
          "Accuracy por campo RUC: rows=[{'ruc_pred':'1','ruc_true':'1'}, {'ruc_pred':'2','ruc_true':'1'}]. Fracción de filas con ruc_pred==ruc_true. Mide el golden — no hardcodees 1.0. Pass: 0.5.",
        hint: "sum generator",
        hints: [
          "Compara ruc_pred == ruc_true por fila",
          "1 de 2 filas correctas → 0.5",
          "No hardcodees 1.0: mide el golden",
        ],
        edgeCases: ["campos missing"],
        tests: "salida coincide con solution output",
        feedback: "Una de dos filas acierta el RUC → field accuracy 0.5. Hardcodear 1.0 miente al dashboard de CP-N2-C.",
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
          "Gate de mime (fail-closed): mime='application/zip' no está en la allowlist {pdf, png, jpeg} del intake de facturas. Imprime reject. No confíes en la extensión del nombre de archivo. El starter invierte las ramas a propósito. Pass: reject.",
        hint: "set membership",
        hints: [
          "zip no está en la allowlist del intake de facturas",
          "reject si mime not in allowed",
          "No confíes en la extensión del nombre de archivo",
        ],
        edgeCases: ["doble extensión"],
        tests: "salida coincide con solution output",
        feedback: "application/zip se rechaza en el gate de admisión *antes* del motor OCR. Aceptar zip abre hostiles al worker.",
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
          "Gate de tamaño pre-OCR: n=6_000_000 bytes supera el tope didáctico 5_000_000. Imprime reject para mitigar DoS al worker. El starter invierte ok/reject a propósito. Pass: reject.",
        hint: "n > 5_000_000 → reject",
        hints: [
          "Tope didáctico del lab: 5_000_000 bytes",
          "Si n supera el tope → reject",
          "El starter invierte ok/reject",
        ],
        edgeCases: ["streaming"],
        tests: "salida coincide con solution output",
        feedback: "6e6 > 5e6 → reject. Invertir el umbral abre la puerta a zip-bomb / DoS al worker OCR.",
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
      "Cierra el arco S23→S24: el artefacto descargado (meta de imagen + tokens OCR simulados) entra al **document intake** de CP-N2-C. Procesa al menos 3 “documentos” sintéticos: preproceso meta → extracción KV → normalización a schema (RUC 11, montos PE con coma decimal, fecha ISO) → validación cross-field → métricas por campo y cola de revisión. Sin PII real; sin label de fraude. Criterio de aceptación: un script o notebook que, al correr, imprima status y reasons[] por doc, más acc_ruc / acc_total / coverage_auto sobre un mini golden (≥2 filas).",
    objectives: [
      "Pipeline preproceso → OCR simulado → schema (campos ruc, total, fecha) con schema_version",
      "Abstener campos low-conf (umbral por campo crítico, p. ej. RUC < 0.85 → review)",
      "Golden de al menos 2 docs con accuracy por campo (ruc y total) y coverage_auto",
      "Gate de archivos hostiles (mime allowlist + size cap) antes del motor; ocr_fail → human_rescan",
    ],
    requirements: [
      "Datos 100% sintéticos (facturas demo, IDs fake); no PDFs reales de clientes",
      "bbox o evidencia por campo crítico (del valor, no solo del label) en el dict de salida",
      "needs_review ≠ fraude (política explícita en log o comentario de módulo)",
      "norm_total PE-aware: \"150,00\" → 150.0 (no 15000.0)",
      "es-PE en labels de UI/log",
      "Funciones puras testeables: al menos preprocess, parse_kv, norm_*, validate, field_acc",
      "README breve: cómo correr, fixtures usados, métricas obtenidas (acc_ruc, acc_total, coverage_auto)",
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
        question: "¿Qué haces si confidence de RUC es 0.6 (umbral lab 0.85)?",
        options: ["Aceptar igual", "Inventar dígitos", "Etiquetar fraude", "Abstener y encolar revisión"],
        correctIndex: 3,
        explanation:
          "Abstención bajo umbral es control de calidad: el campo crítico va a cola HITL. No se inventan dígitos ni se etiqueta fraude por score bajo.",
      },
      {
        question: "Un mismatch total vs suma de líneas en la validación cross-field implica:",
        options: ["Fraude probado", "Cola de revisión / corrección", "Borrar el doc", "Subir DPI"],
        correctIndex: 1,
        explanation:
          "Validación ≠ acusación de fraude. Solo acumula reasons[] (p. ej. total_mismatch) y status=needs_review para humanos.",
      },
      {
        question: "¿Por qué medir accuracy por campo (p. ej. acc_ruc) y no solo un accuracy global?",
        options: ["Es más corto", "OCR no tiene global", "Los campos críticos pueden fallar aunque el global se vea bien", "Solo para imágenes"],
        correctIndex: 2,
        explanation:
          "Campos caros (RUC, total) necesitan SLO propio; un accuracy global o una coverage_auto alta los disimula.",
      },
      {
        question: "Un archivo application/zip llega al intake de facturas. ¿Qué hace el gate de admisión?",
        options: ["Gate reject/review por mime no permitido", "Siempre OK", "OCR directo", "Enviar por email"],
        correctIndex: 0,
        explanation:
          "Allowlist de mime (pdf/png/jpeg) y tope de tamaño: zip no es documento de factura del lab; se rechaza antes del motor.",
      },
      {
        question: "Si los scores de orientación dan lo mejor en 180° con score 0.7, ¿cuándo corres OCR?",
        options: ["Antes de rotar, para ganar tiempo", "Solo si conf media > 0.9", "Nunca; se etiqueta fraude", "Después de corregir orientación"],
        correctIndex: 3,
        explanation:
          "Orientación incorrecta rompe layout y puede dar confidence alta en basura; corrige rotación y *después* llama al motor. Score 0.7 ≥ 0.5 → auto de orientación, no de fraude.",
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
        url: "https://scholar.google.com/scholar?q=document+image+analysis+OCR+deskew+survey",
        note: "Surveys de deskew, layout y preproceso antes de OCR",
      },
      {
        label: "Practical MLOps (data quality chapters)",
        url: "https://www.oreilly.com/library/view/practical-mlops/9781098103002/",
        note: "Golden sets, data quality y métricas en producción",
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
