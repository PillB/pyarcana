import type { CourseSection } from '../../types'

export const section24: CourseSection = {
  id: "rpa-advanced",
  index: 24,
  title: "OCR y Document AI",
  shortTitle: "OCR Document AI",
  tagline: "extrae campos de documentos sintéticos, conserva bounding boxes/evidencia, abstiene bajo confidence y mide cada campo crítico",
  estimatedHours: 19,
  level: "Práctica independiente",
  phase: 1,
  icon: "Bot",
  accentColor: "bg-gradient-to-br from-blue-500 to-indigo-600",
  jobRelevance:
    "En un backoffice de Lima (facturas, boletas y PDFs de proveedores), el cuello de botella no es «leer letras»: es convertir un PDF en campos con evidencia que un humano pueda auditar en minutos. Aquí aprendes a modelar el camino: preproceso → OCR con confidence y bounding box → schema → validación cross-field → cola de revisión humana y métricas por campo. El valor profesional es encolar bien, no cerrar casos por score ni inventar dígitos de RUC.",
  learningOutcomes: [
    { text: "Preprocesar metadatos de imagen sintética (DPI, deskew, crop, contraste) y dejar flags auditables" },
    { text: "Corregir ruido y orientación antes de invocar el motor OCR" },
    { text: "Consumir un contrato OCR (idiomas, confidence por campo y orden de lectura sintético por bbox)" },
    { text: "Extraer texto, tablas y pares clave–valor con evidencia del valor" },
    { text: "Normalizar a schema (RUC 11 dígitos, montos PE, fechas ISO) sin inventar valores" },
    { text: "Validar cross-field, acumular reasons[] y encolar revisión sin label de fraude" },
    { text: "Evaluar exactitud por campo y coverage_auto sobre un golden set sintético" },
    { text: "Aplicar gates de admisión (mime/tamaño como capa 1) y fallback human_rescan" },
  ],
  theory: [
    {
      heading: "OCR Document AI para intake CP-N2-C",
      paragraphs: [
        "Llegas desde el adaptador web de la sección anterior (S23): una **descarga verificada** (PDF/PNG sintético) es la entrada típica del intake. Aquí no vuelves a scrapear el portal — **consumes el artefacto** y lo conviertes en campos con evidencia. Construyes el **document intake** de CP-N2-C: imagen sintética → preproceso → adapter OCR (confidence + bbox) → normalización a schema → validación cross-field → golden set por campo. En un backoffice sintético de facturas en Lima, el objetivo es encolar revisión, no “cerrar” casos por score.",
        "Primero practicamos con la biblioteca estándar y adapters simulados; un motor real (p. ej. Tesseract) solo entra si el entorno lo declara instalado. Todo documento es **sintético** (facturas demo, IDs fake). Conservas **bounding boxes** y te **abstienes** si confidence < umbral de campo crítico (p. ej. RUC). Coincidir totales o RUC **no prueba fraude** ni parentesco: solo genera `reasons[]` para humanos. Política fail-closed: `auto_fraud_label=False` siempre en este path.",
        "**Mini-glosario de intake** (léelo una vez; lo reutilizas en demos y ejercicios). **bbox** (*caja delimitadora*): rectángulo `[x0,y0,x1,y1]` que localiza el valor en la página para el revisor. **confidence** (*confianza*): score 0–1 del motor por token o campo. **HITL** (*human-in-the-loop*, humano en el bucle): cola donde un humano decide. **golden set** (*conjunto dorado etiquetado*): páginas/campos etiquetados a mano para medir exactitud. **adapter:** interfaz común (`real`/`fake`) hacia el motor OCR. **fail-closed** (*cerrado ante la duda*): si hay duda, no autoaceptas. **coverage_auto:** fracción de docs que pasan sin revisión humana. **preflight** (*chequeo previo*): mime, tamaño y orientación antes del motor.",
        "Orden: **T1 Imagen** (DPI, deskew, ruido, orientación) → **T2 OCR** (idiomas, layout, KV/tablas) → **T3 Extracción** (schema, validación, cola) → **T4 Evaluación** (golden set, privacidad, hostiles, fallback). Frontera real/fake: TesseractAdapter vs. FakeOcrAdapter nunca se confunden en contract tests. Más adelante, el texto OCR alimenta endpoints de IA (S25) como entrada **no confiable** — aquí aprendes a no inventar dígitos ni cerrar por score.",
      ],
      callout: {
        type: "info",
        title: "Alcance de esta sección",
        content:
          "Dominas el **contrato de intake** (evidencia, abstención, schema, golden por campo) con demos sintéticos. El layout multi-columna avanzado y los procesadores comerciales de Document AI quedan como lectura en Recursos. También son extensión opcional cuando el runtime lo permita. `TesseractAdapter` llama un motor real si está instalado; `FakeOcrAdapter` nunca se presenta como OCR real: devuelve observaciones fijadas para tests de parsing, abstención y evaluación.",
      },
    },
    {
      heading: "DPI, deskew, crop y contraste",
      subtopicId: "S24-T1-A",
      paragraphs: [
        "Cuando una boleta llega al intake a **96 DPI** (foto de celular, PDF rasterizado barato), el motor OCR confunde “8” con “B” y el RUC se rompe. **DPI** es densidad de puntos por pulgada: el lab eleva a **≥200** (ideal **300** efectivos) *antes* del motor. **Deskew** corrige la inclinación del escaneo; **crop** recorta márgenes negros que distraen al layout; **contraste** ayuda tinta débil. Ninguna de estas ops “arregla fraude”: no inventan dígitos ni reescriben montos.",
        "En este curso modelamos las ops como transformaciones sobre **metadatos** de imagen sintética (`w, h, dpi, skew_deg, contrast`). No necesitas OpenCV instalado para aprender el **contrato** del pipeline: qué entra, qué sale y qué flags quedan en el log. Cada corrida deja `deskew_applied` y el `crop_box` auditable — así el revisor o el test de regresión saben *qué* se le hizo a la página antes del OCR.",
        "Pipeline canónico: `load → dpi_check → deskew → crop → contrast → OCR`. Caso PE sintético (Lima, batch nocturno): foto de boleta a 96 DPI y 1.8° de sesgo. Tras preproceso esperas `dpi=200`, `deskew_applied=True`, `skew_deg=0.0` (ángulo ya corregido), crop ~2–5% y contraste escalado con tope — listo para el adapter con `lang=spa`.",
        "Borde útil: si el sesgo es casi nulo (`|skew| < 0.5°`), no marques deskew “por si acaso”; un flag falso ensucia la auditoría. Si el DPI ya es 300, `max(dpi, 200)` lo deja intacto. El preproceso es barato frente a volver a correr OCR: invierte ahí antes de culpar al motor.",
      ],
      code: {
        language: 'python',
        title: "preprocess.py",
        code: `def preprocess_meta(img):
    # img: dict sintético (simulación de contrato, no OpenCV).
    # dpi/deskew aquí son decisiones planificadas sobre metadata, no un raster real.
    out = dict(img)
    out["source_dpi"] = img.get("dpi", 72)
    out["dpi"] = max(out["source_dpi"], 200)  # piso didáctico del lab
    ang = img.get("skew_deg", 0.0)
    out["deskew_required"] = abs(ang) >= 0.5
    out["deskew_applied"] = out["deskew_required"]  # en lab: flag de decisión simulada
    out["skew_deg"] = 0.0 if out["deskew_applied"] else ang
    # crop 2% márgenes (caja planificada)
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
          "Checklist: (1) dpi ≥ 200 (ideal 300 en tipografía pequeña), (2) deskew_applied solo si |skew| ≥ 0.5°, (3) crop deja márgenes sin recortar sello/total, (4) contraste con tope — nunca reescribe dígitos. Si falla RUC, revisa esta checklist antes de cambiar de modelo OCR. En el lab, los flags registran la *decisión*; un adaptador real aplicaría el raster después.",
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
          "Si el mejor score es 180° (aunque sea 0.7), rota la página y *después* llama al motor. OCR “al revés para ahorrar un paso” genera campos basura con confidence engañosa. Si score < 0.5 → manual_orient, no autoaceptes.",
      },
    },
    {
      heading: "Idiomas, layout y confidence",
      subtopicId: "S24-T2-A",
      paragraphs: [
        "Configura **idiomas** (`spa+eng`) según el corpus: facturas PE en español con tokens EN de software (“SUBTOTAL”, “SKU”). Un motor mal configurado en solo `eng` castiga acentos y “RUC”. El **layout** (bloques, columnas) guía el **orden de lectura**: en el lab ordenamos por bbox `(y0, x0)` — arriba→abajo, izquierda→derecha. No concatenes columnas a ciegas o mezclarás el “Total” de la derecha con ítems de la izquierda.",
        "Cada token/campo trae **confidence** entre 0 y 1. El error clásico es promediar: un RUC a 0.55 y un “FACTURA” a 0.99 promedian “bien” y el intake autoacepta basura. Usa **abstención por campo crítico** (RUC, total): si conf del RUC < 0.85 → `review_queue`. No inventes dígitos ni “corrijas” con un checksum inventado sin política escrita.",
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
        "La evidencia no es el label “RUC” en negrita: es el **bbox del valor** (los dígitos). El revisor en UI resalta ese rectángulo sin volver a pasar el motor OCR. Si solo guardas el bbox del label, el humano no ve el número dudoso y pierde tiempo.",
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
        "Montos en Perú usan **coma decimal**: `\"150,00\"` es ciento cincuenta, no quince mil. Si borras comas a ciegas (`replace(\",\", \"\")`) obtienes `15000.0` y envenenas la validación cross-field y el golden set. Política del lab: **locale PE**. Si hay coma y punto (`\"1.150,00\"`), quita puntos de miles y cambia la coma por punto; si solo hay coma, cámbiala por punto; si solo hay punto estilo EN (`\"150.00\"`), ya es float-ready. Un formato EN con miles (`\"1,150.00\"`) no es fixture del lab: no lo “adivines”; recházalo o decláralo fuera de política.",
        "RUC: puedes quitar separadores benignos (puntos, espacios, guiones), pero **una letra** (p. ej. `20X…` por confusión OCR) no se “limpia” a un identificador plausible: devuelve `None` y encola. Si tras limpiar la longitud no es 11, también `None` — no rellenes ceros ni inventes checksum. Fechas de boleta `DD/MM/YYYY` → `YYYY-MM-DD` con `strptime` day-first (formato PE); el formato US `%m/%d/%Y` interpreta mal el día 15.",
        "Versionar el schema (`invoice.v1`) evita que un deploy cambie el significado de `total_incl_igv` a mitad de un golden set. Contrato del lab: `norm_ruc` / `norm_total` / `norm_fecha` puras, testeables sin red ni archivos reales.",
      ],
      code: {
        language: 'python',
        title: "schema_norm.py",
        code: `import re
from datetime import datetime

SCHEMA = {"ruc": "str11", "total": "float", "fecha": "date"}

def norm_ruc(s):
    # Letras = corrupción OCR: no borrar para inventar un RUC de 11 dígitos
    if re.search(r"[A-Za-z]", s):
        return None
    d = re.sub(r"\\D", "", s)
    return d if len(d) == 11 else None

def norm_total(s):
    # Política PE del lab: "150,00" o "1.150,00" → float. No adivinar EN miles.
    s = s.replace("PEN", "").strip().replace(" ", "")
    if "," in s and "." in s:
        # PE: punto = miles, coma = decimal
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
})
print("corrupt", norm_ruc("20X123456789"))  # letra → None, no 20123456789`,
        output: `{'ruc': '20123456789', 'total': 150.0, 'fecha': '2026-01-15', 'schema': 'invoice.v1'}
corrupt None`,
      },
      callout: {
        type: "warning",
        title: "None ≠ 0 (y coma ≠ miles)",
        content:
          "Si el RUC trae letras o no normaliza a 11 dígitos, deja None y manda a revisión — no pongas \"000...\" ni 0.0 en total. Borrar una X del OCR y quedarte con 11 dígitos es inventar identidad. En montos PE, \"150,00\" → 150.0; borrar comas a ciegas produce 15000.0 y rompe el intake.",
      },
    },
    {
      heading: "Validación cross-field y cola de revisión",
      subtopicId: "S24-T3-B",
      paragraphs: [
        "La validación **cross-field** compara campos entre sí: `abs(sum(líneas) - total) > 0.01` → `total_mismatch`. RUC `None` → `ruc_missing`. Confidence de RUC bajo umbral → `ruc_low_conf`. Si **falta** `conf_ruc`, no asumas 1.0: marca `ruc_conf_missing` (fail-closed). Las reasons se **acumulan** en una lista; el documento no se autoacepta si la lista no está vacía.",
        "La cola de revisión (HITL: *human-in-the-loop*) es el **producto**, no un “error del sistema”. Entregas `status=needs_review`, `reasons[]` y bbox para que un humano decida. **Discrepancia contable ≠ fraude**: una boleta mal tipada o un OCR con un dígito flojo no es acusación. Política del lab: `review_not_fraud` — humanos investigan; el pipeline solo encola.",
        "Caso sintético del lab (mismos números en teoría, demo y transferencia): total 150.0 vs. líneas [100, 50] y RUC confiable → `auto` con reasons vacías; total 150.0 vs. [100, 40], ruc None y conf 0.5 → `needs_review` con `total_mismatch`, `ruc_missing` y `ruc_low_conf`.",
        "En batch nocturno, un doc en cola no debe detener el archivo: marcas `human_queue`, registras las reasons en el log y pasas al siguiente. Fail-closed de *calidad* (no autoaceptar basura) no es lo mismo que fail-stop de *throughput* (tirar el batch entero).",
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
    conf = doc.get("conf_ruc")
    if conf is None:
        reasons.append("ruc_conf_missing")  # ausencia ≠ confianza perfecta
    elif conf < 0.85:
        reasons.append("ruc_low_conf")
    status = "auto" if not reasons else "needs_review"
    return status, reasons

print(validate({"total": 150.0, "lines": [100.0, 50.0], "ruc": "20123456789", "conf_ruc": 0.9}))
print(validate({"total": 150.0, "lines": [100.0, 40.0], "ruc": None, "conf_ruc": 0.5}))
print(validate({"total": 150.0, "lines": [100.0, 50.0], "ruc": "20123456789"}))  # sin conf
print("note: validation≠fraud_label")`,
        output: `('auto', [])
('needs_review', ['total_mismatch', 'ruc_missing', 'ruc_low_conf'])
('needs_review', ['ruc_conf_missing'])
note: validation≠fraud_label`,
      },
      callout: {
        type: "danger",
        title: "Política: needs_review ≠ fraude",
        content:
          "`total_mismatch`, `ruc_missing`, `ruc_low_conf` o `ruc_conf_missing` solo llenan reasons[] y status=needs_review. Nunca emitas label `auto_fraud` desde OCR. Una inconsistencia contable es cola de revisión, no acusación ni parentesco. Evidencia ausente no es evidencia perfecta.",
      },
    },
    {
      heading: "Golden set sintético, exactitud por campo y cobertura",
      subtopicId: "S24-T4-A",
      paragraphs: [
        "Un **golden set** es un conjunto pequeño de páginas/campos etiquetados a mano (pred vs. true) que sirve de “verdad de laboratorio”. Mides exactitud **por campo** (ruc, total, fecha), no un accuracy global que esconde fallos caros. Caer en RUC es más grave que errar una glosa opcional: cada campo crítico tiene su propio SLO.",
        "`field_acc = correct / n` compara `ruc_pred == ruc_true` (o total) fila a fila. En paralelo, `coverage_auto = auto / (auto + review)` mide qué fracción de documentos pasa sin HITL. Son métricas distintas: puedes tener cobertura alta y accuracy de RUC baja si bajaste el umbral de abstención. Exact match por campo es la métrica base del lab; precisión/recall/F1 y umbrales calibrados son el siguiente paso en producción.",
        "Anti-patrón de producto: subir `coverage_auto` bajando el umbral de confidence **sin** mirar `acc_ruc`. El dashboard se ve “verde” y el backoffice recibe RUC basura en auto. Reporta siempre el par: exactitud de críticos + cobertura + tasa de abstención.",
        "Caso PE de lab (mismo golden del demo: 2 docs × 2 campos): d1 acierta RUC y total; d2 falla ambos → `acc_ruc=0.5` y `acc_total=0.5` (2 aciertos de 4 celdas). Un ejercicio aparte usa un ejemplo abstracto 3/4 = 0.75 para practicar la fórmula, no el mismo golden. Con auto=7 y review=3 → `coverage_auto=0.7`. Empaqueta estas métricas en CP-N2-C sin pretender que el OCR “valida identidad legal” o parentesco.",
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
        "Privacidad primero: en el lab solo fixtures **sintéticos** (facturas demo, IDs fake). No subas PDFs reales de clientes al sandbox ni al repo. Minimiza con criterio: un bbox solo tiene sentido con una rendición revisable (hash, página, dimensiones, caducidad). Si borras la imagen cruda sin dejar una copia de revisión controlada, el revisor no puede auditar el resaltado.",
        "Antes del motor, un **gate de admisión (capa 1)**: allowlist de mime (`application/pdf`, `image/png`, `image/jpeg`); zip u otros → `reject`. Tope de tamaño (p. ej. 5_000_000 bytes) mitiga zip-bomb y DoS al worker OCR. El mime del caller es **spoofable**: en producción sigue la capa 2 (firmas mágicas, parseo aislado, sandbox). No confíes en la extensión del nombre (`factura.pdf.zip` disfrazado).",
        "Si el OCR falla con un binario corrupto (`ocr_fail`), el fallback operativo es `human_rescan` (reescaneo o tipeo asistido) — no reintentar 100 veces el mismo archivo. Reintentar en bucle quema CPU y no mejora un PDF roto.",
        "Contrato de seguridad del intake: fail-closed en mime/size (capa 1); logs sin PII real; adapters `real`/`fake` etiquetados en logs. El revisor ve reasons y bbox; nunca un badge de “fraude detectado por OCR”.",
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
        preamble:
          "Antes de culpar al motor OCR, el intake de CP-N2-C decide si la página sintética está en condiciones. En esta demo un dict de metadata (no OpenCV real) eleva el DPI al piso del lab (≥200) y marca deskew si el sesgo supera 0.5°. No escribas aún: predice `dpi` y el booleano `deskew` para un escaneo a 72 DPI con 2° de inclinación; luego compara con la salida. Si saltas el preproceso, el RUC se rompe «en el modelo» por una causa barata de evitar.",
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
        why: "El preproceso del lab opera sobre metadata auditable (`dpi`, `deskew`): eleva con `max` sin inventar tipografía real y deja el flag en el log para el revisor. Corregir DPI y sesgo *antes* del motor suele mejorar más la lectura de RUC que cambiar de modelo OCR. Un skew casi nulo no debe forzar deskew «por si acaso».",
        retrospective:
          "Si puedes explicar por qué 72 DPI se convierte en 200 *antes* de llamar al OCR, ya tienes el hábito de preflight. El error clásico es cambiar de motor sin mirar DPI/sesgo. En We Do practicarás el piso 200, el flag de deskew y el contrato compuesto de crop.",
      },
      {
        demoId: "S24-T1-B-DEMO",
        subtopicId: "S24-T1-B",
        environment: "local",
        description: "Elige la rotación de mayor score (0/90/180/270) antes de llamar al OCR.",
        preamble:
          "Si la página está al revés, el layout se rompe y —peor— el motor puede devolver basura con confidence engañosamente alta. En esta demo eliges la rotación de mayor score entre 0/90/180. No escribas: predice qué key gana con scores `{0:0.2, 180:0.75, 90:0.05}` y por qué no miras solo el score numérico aislado del orden pre-OCR.",
        code: {
          language: 'python',
          title: "demo.py",
          code: `def best_orientation(scores):
    return max(scores, key=scores.get)

print(best_orientation({0: 0.2, 180: 0.75, 90: 0.05}))
`,
          output: `180`,
        },
        why: "Orientar es preflight obligatorio: `max(..., key=scores.get)` devuelve grados, no el score. Si la página está al revés, el layout se rompe y el OCR puede devolver basura con confidence engañosamente alta. OCR «al revés para ahorrar un paso» llena HITL de basura cara de revisar.",
        retrospective:
          "Orientación correcta *antes* del motor evita RUC permutados y conf engañosa. El error clásico es confiar en un score alto de una página mal rotada. Pregunta: si el mejor score fuera 0.4, ¿forzarías OCR o `manual_orient`? We Do: max (no min), conteo de ruido y gate auto/manual.",
      },
      {
        demoId: "S24-T2-A-DEMO",
        subtopicId: "S24-T2-A",
        environment: "local",
        description: "Filtra tokens bajo umbral de confidence (0.85) sin promediar con tokens fuertes.",
        preamble:
          "En el intake, un RUC a 0.55 no se «salva» porque la cabecera FACTURA tenga 0.99. Esta demo lista tokens bajo el umbral 0.85 sin inventar dígitos. Observa la salida: solo el token débil entra a low_conf. No escribas aún; predice si promediar confidences ocultaría el fallo.",
        code: {
          language: 'python',
          title: "demo.py",
          code: `def low_confidence(toks, thr=0.85):
    return [t for t in toks if t["c"] < thr]

print(low_confidence([{"t": "RUC", "c": 0.9}, {"t": "20X", "c": 0.55}]))
`,
          output: `[{'t': '20X', 'c': 0.55}]`,
        },
        why: "Abstención por campo crítico es control de calidad: umbral didáctico 0.85, se encola sin inventar dígitos. Promediar un 0.55 con «FACTURA 0.99» oculta el dígito débil y pinta un dashboard verde mentiroso. Nunca rellenes caracteres corruptos del OCR en el parser: el revisor HITL necesita el token débil listado, no un RUC «arreglado».",
        retrospective:
          "Low-conf se encola; no se inventa. El error clásico es promediar o «corregir» RUC a mano en el parser. Si puedes decir por qué 0.55 no se salva con 0.99, ya tienes el hábito de abstención. We Do: umbral 0.85, orden de lectura por bbox y gate min-conf.",
      },
      {
        demoId: "S24-T2-B-DEMO",
        subtopicId: "S24-T2-B",
        environment: "local",
        description: "Parsea pares clave–valor desde líneas “Clave: valor” con strip en ambos lados.",
        preamble:
          "Del OCR salen líneas «Clave: valor» que alimentan el schema. En esta demo parseas RUC y Total con `split(':', 1)` y strip. Observa el dict resultante: sin strip, el valor lleva espacio y falla la comparación con el golden y la normalización. No escribas; predice las claves y valores limpios.",
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
        why: "El KV es la unidad mínima de evidencia textual antes del schema. `split(':', 1)` corta una sola vez (valores pueden traer «:»); strip en ambos lados evita el espacio residual que rompe golden y validación. Sin higiene de strings, el revisor no ve el fallo y la normalización de montos revienta en silencio.",
        retrospective:
          "Evidencia textual limpia es el puente al schema y al golden. El espacio residual es un bug silencioso: el revisor no lo ve y la normalización falla. We Do: strip en ambos lados, filas de datos sin header y bbox del *valor* para HITL.",
      },
      {
        demoId: "S24-T3-A-DEMO",
        subtopicId: "S24-T3-A",
        environment: "local",
        description: "Normaliza RUC a solo dígitos y valida longitud 11 (sin rellenar ceros).",
        preamble:
          "El schema del intake no acepta `20.123456789` crudo: limpia separadores y valida longitud 11. En esta demo ves el par `(dígitos, ok)`. Observa que no se inventan ceros si faltan dígitos. No escribas; predice el string limpio y si `ok` es True. (Nota: aquí no se modela letra→None; eso llega en We Do E3 y en el You Do.)",
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
        why: "Un schema canónico (solo dígitos, longitud fija) evita basura en validación y en el golden set. Si `len≠11` devuelves fallo, no un RUC inventado ni un pad de ceros. Esta demo no rechaza letras embebidas; la theory y el E3 sí con `None`.",
        retrospective:
          "Solo dígitos + longitud fija es el contrato mínimo de RUC; inventar ceros o dígitos es el anti-patrón prohibido. Esta demo no rechaza letras embebidas — eso es el siguiente nivel de fail-closed. We Do: limpiar parcial, fecha day-first PE y montos con coma decimal.",
      },
      {
        demoId: "S24-T3-B-DEMO",
        subtopicId: "S24-T3-B",
        environment: "local",
        description: "Compara total vs. suma de líneas: ok si cuadra, needs_review si no (sin label de fraude).",
        preamble:
          "Cuando la suma de líneas no cuadra con el total, el intake no acusa fraude: encola revisión. En esta demo la comparación con tolerancia 0.01 devuelve `ok` para 150 vs. [100, 50]. Observa el contrato: status de calidad, no veredicto legal. No escribas; predice qué devolverías si las líneas sumaran 140.",
        code: {
          language: 'python',
          title: "demo.py",
          code: `def cross_field(total, lines, eps=0.01):
    # Misma tolerancia monetaria que la teoría (0.01)
    return "ok" if abs(sum(lines) - total) <= eps else "needs_review"

print(cross_field(150.0, [100.0, 50.0]))
`,
          output: `ok`,
        },
        why: "Tolerancia monetaria 0.01 cubre redondeo de soles; status `ok`/`needs_review` es control de calidad del intake. Nunca emitas `auto_fraud` desde un mismatch de OCR: el producto es la cola HITL con reasons, no un veredicto legal. Un total que no cuadra puede ser error de parsing, de preproceso o de captura — el humano decide.",
        retrospective:
          "Discrepancia contable ≠ fraude. El error clásico es emitir label de riesgo desde un mismatch de OCR. Si las líneas sumaran 140 frente a 150, el status sería `needs_review`, no «culpable». We Do: status condicional, lista `reasons[]` y política `review_not_fraud`.",
      },
      {
        demoId: "S24-T4-A-DEMO",
        subtopicId: "S24-T4-A",
        environment: "local",
        description: "Calcula exactitud por campo (pred==true) sobre un mini golden sintético.",
        preamble:
          "Un golden sintético de dos predicciones (una acierta, una falla) produce accuracy 0.5. Esta demo mide pred==true por fila, no un accuracy global opaco. Observa: no se reporta cobertura HITL aquí — son métricas distintas. No escribas; predice el float de salida.",
        code: {
          language: 'python',
          title: "demo.py",
          code: `def field_accuracy(g):
    return sum(1 for r in g if r["p"] == r["t"]) / len(g)

print(field_accuracy([{"p": "A", "t": "A"}, {"p": "B", "t": "A"}]))
`,
          output: `0.5`,
        },
        why: "Exact match por campo crítico (RUC, total) detecta fallos que un accuracy global o una coverage_auto alta disimulan. Coverage_auto se mide aparte: son hermanas, no intercambiables. Un golden sintético de dos filas con un acierto y un fallo produce 0.5 a propósito — no «el modelo se ve bien».",
        retrospective:
          "Mide el campo caro (RUC/total), no solo la sensación del OCR. El error clásico es reportar solo cobertura HITL y ocultar acc_ruc bajo. We Do: `correct/n`, accuracy por filas de RUC y el par 0.5 / 0.7 del lab de evaluación.",
      },
      {
        demoId: "S24-T4-B-DEMO",
        subtopicId: "S24-T4-B",
        environment: "local",
        description: "Acepta PDF/PNG/JPEG bajo tope de bytes (capa 1); rechaza hostiles antes del motor OCR.",
        preamble:
          "Antes de gastar CPU en OCR, el intake admite o rechaza por mime allowlist y tope de bytes (capa 1). En esta demo un PDF de 100 bytes pasa. Observa: no es antivirus ni capa 2 de firmas mágicas. No escribas; predice el status `ok` y qué pasaría con un zip.",
        code: {
          language: 'python',
          title: "demo.py",
          code: `ALLOWED = {"application/pdf", "image/png", "image/jpeg"}

def accept_doc(meta, max_n=5_000_000):
    # Capa 1: mime declarado + tamaño. En prod: firmas mágicas (capa 2).
    ok = meta.get("mime") in ALLOWED and meta.get("n", 0) < max_n
    return "ok" if ok else "reject"

print(accept_doc({"mime": "application/pdf", "n": 100}))
`,
          output: `ok`,
        },
        why: "Allowlist pdf/png/jpeg y tope 5e6 protegen al worker OCR antes de gastar CPU en zip o binarios enormes. El mime del caller es spoofable en prod: capa 1 didáctica ≠ seguridad completa (capa 2 = firmas mágicas o antivirus).",
        retrospective:
          "Gate temprano protege al worker OCR: zip y binarios enormes no deben quemar el batch. Confiar en la extensión del nombre es frágil; el mime del caller es spoofable en prod (capa 1 ≠ firmas mágicas). We Do: reject zip, reject size y `ocr_fail` → `human_rescan`.",
      },
    ],
  },
  weDo: {
    intro: "24 ejercicios en tres capas por subtema:\n\n- **Guiado**: arregla un defecto obvio.\n- **Independiente**: aplicas el contrato sin plantilla larga.\n- **Transferencia**: compones funciones del intake real.\n\nCubren preproceso, orientación, OCR/KV, schema PE, validación, golden y hostiles. En transferencia no te quedes en un solo print: arma el mini-módulo que luego reutilizarás en el You Do.",
    steps: [
      {
        id: "S24-T1-A-E1",
        subtopicId: "S24-T1-A",
        kind: "guided",
        title: "Elevar DPI al piso de calidad 200",
        preamble:
          "- **Contexto:** en el intake de boletas sintéticas de Lima, un escaneo a 96 DPI confunde «8» con «B» en el RUC.\n- **Meta:** elevar el DPI efectivo al piso del lab con `max(dpi, 200)`.\n- **Éxito:** una sola línea con el entero `200`.\n- **Límites:** no inventes tipografía real; no imprimas etiquetas extra; no dejes 96.",
        instruction:
          "1. Abre el starter: imprime `dpi` crudo (bug: deja 96).\n2. Aplica `max(dpi, 200)`.\n3. Imprime solo el entero resultante.",
        hint: "max()",
        hints: [
          "El piso de calidad del lab es 200 DPI efectivos",
          "max(dpi, 200) eleva sin tocar si ya es mayor",
          "Upscaling no inventa tipografía: solo metadata",
        ],
        edgeCases: ["upscaling no crea detalle real"],
        tests: "Stdout exacto: `200` (entero). No dejes 96 ni imprimas etiquetas extra.",
        feedback:
          "`max(96, 200)` eleva al piso de OCR del lab. Dejar 96 envía tipografía pequeña rota al motor y llena la cola de RUC ilegibles; no es «falta de modelo», es preflight omitido.",
        retrospective:
          "El piso de DPI es barato frente a volver a correr OCR. El error clásico es culpar al adapter sin mirar 96 DPI. Siguiente (E2): marcar deskew solo cuando el sesgo lo exige.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# DEFECT: deja el escaneo en 96 dpi (tipografía pequeña se rompe)
dpi = 96
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
        title: "Flag deskew con umbral 0.5°",
        preamble:
          "- **Contexto:** el revisor del batch necesita saber si se aplicó (o debió aplicar) corrección de inclinación.\n- **Meta:** calcular `deskew_applied = abs(skew) >= 0.5` sobre skew sintético 1.2°.\n- **Éxito:** imprime exactamente `True`.\n- **Límites:** usa valor absoluto (sesgo negativo también cuenta); no inviertas el operador; umbral 0.5° es didáctico del lab, no norma ISO.",
        instruction:
          "1. Revisa el starter: `abs(skew) < 0.5` (operador invertido).\n2. Cambia a `>= 0.5`.\n3. Imprime solo el booleano.\n4. No alteres el valor de `skew`.",
        hint: "abs",
        hints: [
          "Usa valor absoluto: sesgo -1.2 también cuenta",
          "deskew_applied es True cuando |skew| >= 0.5",
          "El umbral 0.5° es didáctico del lab, no una norma ISO",
        ],
        edgeCases: ["umbral empírico"],
        tests: "Stdout exacto: `True`. Con skew=1.2 debe marcar deskew (no False por operador invertido).",
        feedback:
          "Con skew=1.2, `abs(skew) >= 0.5` es True. El starter invertía el operador (`<` en vez de `>=`): un flag falso ensucia la auditoría del batch.",
        retrospective:
          "Deskew solo cuando el sesgo lo justifica; un flag falso ensucia la auditoría. Confundir `<` con `>=` es un bug silencioso de calidad. Luego (E3) unes DPI + deskew + crop en un solo contrato.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# DEFECT: umbral invertido
# Este codigo tiene un defecto intencional que el learner debe corregir.
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
        title: "preprocess_meta: DPI, deskew y crop",
        preamble:
          "- **Contexto:** el document intake no llama tres scripts sueltos: necesita un dict de preproceso que el log y el test puedan auditar.\n- **Meta:** componer elevación de DPI, flag deskew y `crop_box` con margen 5%.\n- **Éxito:** `200 True (50, 50, 950, 950)` en una línea.\n- **Límites:** solo metadata (no inventes píxeles); m=0.05; no dejes crop (0,0,w,h).",
        instruction:
          "1. Lee el DEFECT: dpi crudo, deskew False, crop con m=0.\n2. Calcula `dpi = max(..., 200)` y `deskew` con `|skew|>=0.5`.\n3. Arma crop `(int(m*w), int(m*h), int((1-m)*w), int((1-m)*h))`.\n4. Imprime dpi, deskew y crop en ese orden.",
        hint: "max DPI + abs skew + crop m",
        hints: [
          "dpi_out = max(img['dpi'], 200); deskew si abs(skew) >= 0.5",
          "Tras deskew simulado, skew_deg queda 0.0 aunque el flag sea True",
          "crop: (int(m*w), int(m*h), int((1-m)*w), int((1-m)*h)) con m=0.05",
        ],
        edgeCases: ["no inventar píxeles; solo metadata"],
        tests: "Stdout exacto: `200 True (50, 50, 950, 950)`. dpi, deskew_applied y crop_box con m=0.05.",
        feedback:
          "El pipeline une DPI, deskew y crop en un solo contrato auditable. Faltar el flag o el crop rompe el intake: el revisor no sabe qué se le hizo a la página.",
        retrospective:
          "Un contrato unificado de preproceso es lo que reutilizas en CP-N2-C. El error clásico es olvidar el crop o el flag y «arreglar» solo el DPI. Pregunta: ¿por qué el crop se registra aunque el lab no abra OpenCV?",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# DEFECT: no eleva DPI ni marca deskew; crop con m=0
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
        title: "Rotación de mayor score (no min)",
        preamble:
          "- **Contexto:** el preflight de orientación del intake elige la rotación más probable antes del OCR.\n- **Meta:** devolver la *key* (grados) del score máximo.\n- **Éxito:** el entero `90` (no el score 0.8).\n- **Límites:** no uses `min`; no imprimas el score; imprime solo grados.",
        instruction:
          "1. Abre el starter: `min(s, key=s.get)` (bug).\n2. Cambia a `max(s, key=s.get)`.\n3. Imprime la key entera.\n4. Verifica mentalmente: 0.8 > 0.1 → 90°.",
        hint: "max key=",
        hints: [
          "max(s, key=s.get) devuelve la key del mayor score",
          "No uses min: eso elige la peor orientación",
          "Imprime el entero de grados (90), no el score",
        ],
        edgeCases: ["empates"],
        tests: "Stdout exacto: `90` (grados de rotación, no el score). No uses min().",
        feedback:
          "El score máximo está en 90°; `min()` era el defecto del starter y enviaría la peor rotación al motor, llenando HITL de basura en el batch nocturno.",
        retrospective:
          "La key del score máximo es la rotación candidata del preflight; el valor del score se usa después (umbral auto vs. manual). El error clásico es imprimir el score 0.8 en vez de los grados. Siguiente (E2): contar flags de ruido para el runbook, no el largo del vector.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# DEFECT: elige min score
# Este codigo tiene un defecto intencional que el learner debe corregir.
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
        title: "Contar flags de ruido (sum, no len)",
        preamble:
          "- **Contexto:** el runbook del batch registra cuántos píxeles sintéticos están marcados como ruido (1), no el largo del vector.\n- **Meta:** contar flags en 1 con `sum`.\n- **Éxito:** el entero `2` con `flags=[0,1,1,0]`.\n- **Límites:** no uses `len(flags)`; aquí solo auditas el flag (denoise real usaría mediana/morfología).",
        instruction:
          "1. Revisa el starter: imprime `len(flags)` (=4).\n2. Cambia a `sum(flags)`.\n3. Imprime solo el conteo.\n4. No mutes la lista.",
        hint: "sum",
        hints: [
          "sum(flags) cuenta los 1 (ruido marcado)",
          "len(flags) cuenta todos los píxeles, no el ruido",
          "Aquí solo auditas el flag; denoise real usaría filtros (mediana/morfología)",
        ],
        edgeCases: ["modelo real de denoise"],
        tests: "Stdout exacto: `2` (conteo de flags=1). No imprimas len(flags)=4.",
        feedback:
          "Hay dos flags en 1 → `sum=2`. `len()` cuenta longitud (4), no ruido: confunde al runbook de preflight y al SLO de calidad de página.",
        retrospective:
          "El runbook necesita *cuántos* píxeles sintéticos están marcados, no cuántas celdas tiene el vector. Confundir longitud con calidad miente al preflight. Pregunta: si todos los flags fueran 0, ¿qué imprime `sum` y qué diría un `len`? Luego (E3): best + score + action.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# DEFECT: usa len no sum
# Este codigo tiene un defecto intencional que el learner debe corregir.
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
        title: "Preflight: rotación, score y action",
        preamble:
          "- **Contexto:** si el mejor score de orientación es bajo, el intake prefiere un humano que gire la página antes de quemar OCR.\n- **Meta:** elegir best + score; si score<0.5 → `manual_orient`, si no `auto`.\n- **Éxito:** `180 0.7 auto` en una línea.\n- **Límites:** no uses min; no imprimas `ocr_now`; con score 0.7 aún rotas *antes* del motor.",
        instruction:
          "1. Corrige el DEFECT: `min` y action `ocr_now`.\n2. Quédate con la orientación de mayor score, y guarda también ese score.\n3. Decide la acción por el score: por debajo de 0.5 hay que reorientar a mano; de 0.5 en adelante va automático.\n4. Imprime best, score, action.",
        hint: "max key= + umbral 0.5",
        hints: [
          "best = max(scores, key=scores.get); score = scores[best]",
          "Si score < 0.5 → manual_orient (humano gira); si no auto",
          "Con 0.7 en 180° el lab acepta auto — aún así corrige rotación antes del OCR",
        ],
        edgeCases: ["página en blanco / empates"],
        tests: "Stdout exacto: `180 0.7 auto`. Tres valores: rotación, score y action (no ocr_now).",
        feedback:
          "El preflight elige 180° con score 0.7 → auto. Forzar OCR sin rotar o invertir el umbral rompe el layout y llena HITL de basura cara.",
        retrospective:
          "Fail-closed de calidad: score débil → humano, no auto-OCR. Forzar OCR sin rotar llena HITL de basura. Pregunta: ¿por qué «auto» aún exige rotar a 180° antes del motor?",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# DEFECT: elige min y fuerza OCR sin gate
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
        title: "Filtrar tokens con conf ≥ 0.85",
        preamble:
          "- **Contexto:** la autoaceptación del lab no debe tragar tokens con confidence floja.\n- **Meta:** quedarte solo con textos cuyo conf ≥ 0.85.\n- **Éxito:** `['A']` (B con 0.5 se filtra).\n- **Límites:** no uses umbral 0.5; no mutes las confidences; imprime lista de text.",
        instruction:
          "1. Abre el starter: filtro `>=0.5` (bug).\n2. Cambia el umbral a `0.85`.\n3. Imprime la list comprehension de `t['text']`.\n4. No alteres los dicts de tokens.",
        hint: "list comp",
        hints: [
          "Umbral de autoaceptación del lab: conf >= 0.85",
          "List comprehension sobre t['text']",
          "0.5 es demasiado bajo y deja pasar basura a auto",
        ],
        edgeCases: ["umbral por campo"],
        tests: "Stdout exacto: `['A']`. Solo tokens con conf>=0.85; umbral 0.5 del starter es incorrecto.",
        feedback:
          "Solo 'A' pasa el umbral 0.85; B con 0.5 se filtra. Umbral 0.5 deja pasar basura a autoaceptación y degrada el SLO de RUC en el batch.",
        retrospective:
          "Umbral bajo = basura en auto. 0.85 es el contrato didáctico del lab para autoaceptación de tokens. Siguiente (E2): ordenar por bbox, no por orden de llegada del motor.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# DEFECT: umbral 0.5 (demasiado bajo)
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
        title: "Orden de lectura por bbox (y0, x0)",
        preamble:
          "- **Contexto:** el motor puede devolver tokens desordenados; concatenar a ciegas mezcla Total de la derecha con ítems de la izquierda.\n- **Meta:** ordenar por `(y0, x0)` e imprimir la lista de text.\n- **Éxito:** `['FACTURA', 'RUC', '20123456789']`.\n- **Límites:** no uses el orden de llegada; multi-columna real necesitaría col id — aquí una columna sintética.",
        instruction:
          "1. Revisa el starter: imprime en orden de lista (valor primero).\n2. Ordena con `sorted(..., key=lambda t: (t['bbox'][1], t['bbox'][0]))`.\n3. Imprime solo los text en ese orden.\n4. No mutes los bbox.",
        hint: "sorted key=(y0, x0)",
        hints: [
          "bbox = [x0, y0, x1, y1]; orden de lectura ≈ (y0, x0)",
          "sorted(tokens, key=lambda t: (t['bbox'][1], t['bbox'][0]))",
          "Imprime solo los text en ese orden, no el dict completo",
        ],
        edgeCases: ["multi-columna real necesita col id; aquí una columna sintética"],
        tests: "Stdout exacto: `['FACTURA', 'RUC', '20123456789']` ordenado por (y0, x0). No el orden de llegada.",
        feedback:
          "Sin ordenar por bbox mezclas cabecera y valor; FACTURA (y=10) va antes que RUC/valor (y=50). El orden del array del adapter no es narrativa de página.",
        retrospective:
          "Lectura = geometría de la página, no orden del array del adapter. Sin bbox, el parser inventa narrativa. Luego (E3): gate por min conf de campos críticos.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# DEFECT: imprime en orden de llegada (valor primero)
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
        title: "Gate por min conf y lista weak",
        preamble:
          "- **Contexto:** en CP-N2-C un total a 0.75 no se esconde detrás de un RUC a 0.9; el intake reporta el eslabón más débil.\n- **Meta:** calcular min conf, status review/auto y nombres weak bajo thr=0.8.\n- **Éxito:** `0.75 review ['total']`.\n- **Límites:** no promedies confidences; no dejes weak vacío si m<thr.",
        instruction:
          "1. Elimina el promedio del starter.\n2. `m = min(f['conf'] for f in fields)`.\n3. status según m vs. thr; weak = nombres con conf<thr.\n4. Imprime m, status, weak.",
        hint: "min + list comp de nombres débiles",
        hints: [
          "No promedies confidences: un campo débil tumba la autoaceptación",
          "m = min(f['conf'] for f in fields); weak = [f['name'] for f in fields if f['conf'] < thr]",
          "Orden de impresión: m, status, weak",
        ],
        edgeCases: ["no promedies a ciegas"],
        tests: "Stdout exacto: `0.75 review ['total']`. min conf + status + lista weak; no promedies.",
        feedback:
          "Si imprimiste 'auto' o weak vacío con min=0.75, estás ocultando el campo total débil: el dashboard verde miente al revisor HITL.",
        retrospective:
          "Min (o revisión campo a campo) protege críticos; el promedio miente. Pregunta: si subes thr, ¿qué pasa con coverage_auto y con acc_ruc? Puente a T2-B: evidencia KV con bbox.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# DEFECT: promedia y no lista weak
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
        title: "Parse KV con strip en clave y valor",
        preamble:
          "- **Contexto:** una línea OCR `Total: 12.5` no debe dejar el valor con espacio inicial.\n- **Meta:** separar con `split(':', 1)`, strip e imprimir clave y valor.\n- **Éxito:** `Total 12.5` (sin dos puntos ni espacio residual).\n- **Límites:** no omitas strip; corta solo en el primer `:`.",
        instruction:
          "1. Abre el starter: `print(k, v)` sin strip.\n2. Aplica `k.strip()` y `v.strip()`.\n3. Imprime k y v.\n4. No rearmes la línea con `:` en la salida.",
        hint: "split once",
        hints: [
          "split(':', 1) corta solo en el primer dos puntos",
          "strip() en clave y valor quita espacios residuales",
          "print(k, v) con strip imprime 'Total 12.5'",
        ],
        edgeCases: ["múltiples dos puntos"],
        tests: "Stdout exacto: `Total 12.5` (sin dos puntos ni espacio residual en el valor).",
        feedback:
          "Sin strip, el valor lleva espacio inicial (` 12.5`) y falla normalización y golden: un bug silencioso de comparación de strings.",
        retrospective:
          "Strip en clave y valor es higiene de parser, no cosmética. El error clásico es comparar strings «a ojo» en el editor y no ver el espacio. Pregunta: ¿qué fallaría después si el valor quedara `' 12.5'` al hacer `float` o match de golden? Siguiente (E2): no contar el header de tabla como ítem.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# DEFECT: no strip
# Este codigo tiene un defecto intencional que el learner debe corregir.
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
        title: "Filas de datos sin contar el header",
        preamble:
          "- **Contexto:** en la validación `sum(líneas)≈total`, contar el header como ítem infla la suma y manda a revisión por error de parsing.\n- **Meta:** reportar filas de datos = `len(t)-1`.\n- **Éxito:** el entero `1` con tabla de header + una fila.\n- **Límites:** no cuentes la fila 0; no imprimas 2.",
        instruction:
          "1. Revisa el starter: `len(t)` incluye header.\n2. Cambia a `len(t)-1`.\n3. Imprime solo ese entero.\n4. No mutes la tabla.",
        hint: "len-1",
        hints: [
          "Fila 0 es header; datos = len(t) - 1",
          "No cuentes el header como ítem de factura",
          "Con una sola fila de datos el resultado es 1",
        ],
        edgeCases: ["tablas irregulares"],
        tests: "Stdout exacto: `1` (filas de datos = len-1). No cuentes el header.",
        feedback:
          "`len(t)` incluye header (2); el contrato pide solo filas de datos (1). Contar el header crea `total_mismatch` falsos en cross-field.",
        retrospective:
          "Header ≠ ítem de negocio: contarlo infla la suma y manda a revisión por error de *parsing*, no de factura. El hábito es `n_data_rows = len(table) - 1` antes de `sum(líneas)`. Luego (E3): fields con bbox del valor para que el humano resalte el dígito.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# DEFECT: cuenta header
# Este codigo tiene un defecto intencional que el learner debe corregir.
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
        title: "Fields KV con bbox del valor",
        preamble:
          "- **Contexto:** en HITL el humano necesita el rectángulo del *número*, no solo el label «RUC» en negrita.\n- **Meta:** parsear líneas, adjuntar bbox del valor y listar tuplas ordenadas por name.\n- **Éxito:** `[('RUC', '20123456789', [0, 0, 10, 10]), ('Total', '150.00', [0, 20, 40, 30])]`.\n- **Límites:** no omitas bbox; no desordenes; no inventes coords si falta clave.",
        instruction:
          "1. Lee el DEFECT: solo imprime valores strip.\n2. Por cada línea: split, strip, append `(k, v, bboxes[k])`.\n3. Ordena por name e imprime.\n4. No uses solo el bbox del label.",
        hint: "split + dict bbox del valor",
        hints: [
          "Guarda bbox del valor, no solo del label 'RUC'",
          "Tras parsear k,v con split(':',1), field = (k, v, bboxes[k])",
          "sorted por name para salida estable y comparable",
        ],
        edgeCases: ["coords en px página; label sin bbox → no inventes"],
        tests: "Stdout exacto: lista ordenada de (name, value, bbox) con RUC y Total; bbox del valor incluido.",
        feedback:
          "Evidencia = valor + bbox del valor. Sin bbox el revisor no resalta el dígito dudoso; omitir Total o desordenar falla el contrato de HITL.",
        retrospective:
          "Evidencia = valor + bbox + (luego) conf. Sin bbox el revisor no resalta. Pregunta: ¿qué se pierde si guardas solo el texto del label? Puente a T3: normalizar al schema PE.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# DEFECT: solo valores, sin bbox ni orden
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
        title: "Limpiar no-dígitos del RUC parcial",
        preamble:
          "- **Contexto:** el OCR devuelve guiones y puntos en identificadores; el parser limpia antes del schema completo.\n- **Meta:** dejar solo dígitos con `re.sub(r'\\D', '', s)`.\n- **Éxito:** `20123` a partir de `20-123`.\n- **Límites:** aquí no validas longitud 11; no imprimas el string con guiones.",
        instruction:
          "1. Abre el starter: imprime `s` crudo.\n2. Aplica `re.sub(r'\\D', '', s)`.\n3. Imprime el string limpio.\n4. No añadas validación de len en este ejercicio.",
        hint: "re.sub",
        hints: [
          "re.sub(r'\\D', '', s) elimina no-dígitos",
          "Aquí no validas longitud 11; solo limpias",
          "No imprimas el string crudo con guiones",
        ],
        edgeCases: ["vacío tras norm"],
        tests: "Stdout exacto: `20123` (solo dígitos). Sin guiones ni validación de longitud 11 aquí.",
        feedback:
          "`20-123` → `20123` tras quitar no-dígitos. El guion no es dígito; dejarlo rompe el schema y el golden de RUC.",
        retrospective:
          "Separadores benignos se quitan; la validación de 11 dígitos viene después. Siguiente (E2): fechas de boleta PE day-first → ISO.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# DEFECT: no limpia no-dígitos
# Este codigo tiene un defecto intencional que el learner debe corregir.
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
        title: "Fecha boleta PE a ISO (day-first)",
        preamble:
          "- **Contexto:** en boletas peruanas `15/01/2026` es día/mes/año; el formato US invierte o falla (mes 15 no existe).\n- **Meta:** parsear con `%d/%m/%Y` y emitir ISO `YYYY-MM-DD`.\n- **Éxito:** `2026-01-15`.\n- **Límites:** no uses `%m/%d/%Y`; no hardcodees la cadena ISO.",
        instruction:
          "1. Revisa el starter: `strptime` con formato US (bug).\n2. Cambia a `%d/%m/%Y`.\n3. Encadena `.date().isoformat()`.\n4. Imprime solo la fecha ISO.",
        hint: "strptime %d/%m/%Y",
        hints: [
          "Boletas PE: día/mes/año → '%d/%m/%Y'",
          "Formato US '%m/%d/%Y' interpreta mal el 15",
          "date().isoformat() produce YYYY-MM-DD",
        ],
        edgeCases: ["formatos mixtos"],
        tests: "Stdout exacto: `2026-01-15`. Formato PE day-first `%d/%m/%Y`, no US.",
        feedback:
          "`15/01/2026` con day-first es `2026-01-15`. `%m/%d/%Y` falla (mes 15 inválido) o invierte el día: locale de fecha es contrato de schema.",
        retrospective:
          "Locale de fecha es contrato de schema, no detalle cosmético. Mes 15 no existe: el bug US revienta o miente. Luego (E3): RUC 11 + total PE en un solo paso.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# DEFECT: formato US
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
        title: "Schema PE: RUC 11 y total con coma",
        preamble:
          "- **Contexto:** `150,00` en una factura peruana es ciento cincuenta soles, no quince mil.\n- **Meta:** normalizar RUC a 11 dígitos (o None) y total PE a float.\n- **Éxito:** `20123456789 150.0`.\n- **Límites:** no uses `replace(',', '')` a ciegas; no padees ceros en RUC; letras → None (política del lab).",
        instruction:
          "1. Corrige el DEFECT de borrar comas del total.\n2. Implementa `norm_ruc` (letras→None; len==11).\n3. Implementa `norm_total` PE: coma→punto (y miles+decimal si aplica).\n4. Imprime ruc y total normalizados.",
        hint: "re.sub dígitos + coma→punto",
        hints: [
          "RUC: re.sub(r'\\D', '', s); si len!=11 → None (no pad de ceros)",
          "Total PE: si hay coma, cámbiala por punto; si hay miles y decimal (1.150,00) quita puntos primero",
          "\"150,00\" es ciento cincuenta, no quince mil — no uses replace(',', '') a ciegas",
        ],
        edgeCases: ["None en RUC corto; coma decimal PE"],
        tests: "Stdout exacto: `20123456789 150.0`. RUC 11 dígitos y total PE (no 15000.0).",
        feedback:
          "Borrar comas de `150,00` produce `15000.0` — veneno contable en cross-field y golden. RUC con puntos se limpia a 11 dígitos; letras embebidas → None.",
        retrospective:
          "Locale PE en montos es gate de calidad del intake. Borrar comas envenena cross-field y golden. Pregunta: ¿por qué `None` en RUC corrupto es mejor que 11 dígitos «plausibles»?",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# DEFECT: strip comas a ciegas (150,00 → 15000) y no valida len RUC
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
    if re.search(r"[A-Za-z]", s):
        return None  # letra = corrupción OCR, no inventar RUC
    d = re.sub(r"\\D", "", s)
    return d if len(d) == 11 else None

def norm_total(s):
    # Política PE del lab (coma decimal)
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
        title: "Mismatch de total → needs_review",
        preamble:
          "- **Contexto:** 4+5=9 frente a total 10 es una discrepancia que el batch debe encolar, no autoaceptar.\n- **Meta:** comparar `abs(sum(lines)-total)` con umbral 0.01.\n- **Éxito:** la cadena `needs_review`.\n- **Límites:** nunca imprimas `fraud`; no fuerces siempre `auto`.",
        instruction:
          "1. Abre el starter: imprime `'auto'` fijo (bug).\n2. Calcula si la diferencia supera 0.01.\n3. Imprime `needs_review` o `auto` según el caso.\n4. Con el fixture dado debe ser needs_review.",
        hint: "abs(sum-total)",
        hints: [
          "4.0+5.0=9.0 ≠ 10.0 → discrepancia",
          "Tolerancia 0.01 cubre redondeo de moneda",
          "needs_review, no 'fraud'",
        ],
        edgeCases: ["redondeo moneda"],
        tests: "Stdout exacto: `needs_review`. 4+5≠10; nunca imprimas fraud.",
        feedback:
          "Suma 9 vs. total 10 supera 0.01 → `needs_review`. Siempre `auto` era el anti-patrón del starter: la cola es el producto de calidad, no la acusación de fraude.",
        retrospective:
          "Autoaceptar siempre es el anti-patrón del starter: la cola es el producto de calidad del intake. Nunca imprimas `fraud` por un descuadre de 1.0. Pregunta: con diferencia 0.005, ¿auto o needs_review (eps=0.01)? Siguiente (E2): acumular reasons sin crashear el batch nocturno.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# DEFECT: siempre auto
# Este codigo tiene un defecto intencional que el learner debe corregir.
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
        title: "Acumular reason ruc_missing",
        preamble:
          "- **Contexto:** el revisor necesita una lista de reasons, no un crash del worker nocturno.\n- **Meta:** si `ruc is None`, append `'ruc_missing'` e imprimir la lista.\n- **Éxito:** `['ruc_missing']`.\n- **Límites:** no lances excepción; no dejes `[]` vacío; no inventes otros codes aquí.",
        instruction:
          "1. Revisa el starter: imprime `reasons` vacío.\n2. Añade el `if ruc is None: reasons.append(...)`.\n3. Imprime la lista.\n4. No uses `raise`.",
        hint: "append",
        hints: [
          "Acumula reasons; no lances excepción",
          "if ruc is None: reasons.append('ruc_missing')",
          "Varias rules pueden empujar a la misma lista",
        ],
        edgeCases: ["múltiples reasons"],
        tests: "Stdout exacto: `['ruc_missing']`. Acumula en lista; no lances excepción ni dejes [].",
        feedback:
          "RUC ausente debe dejar traza en `reasons[]` para el revisor HITL; lista vacía oculta el fallo y rompe el throughput del batch nocturno.",
        retrospective:
          "`reasons[]` es la traza auditable del documento para el revisor nocturno; un `raise` tumba el worker, una lista vacía miente. El hábito es acumular codes, no abortar el batch. Luego (E3): varias rules + status + política explícita `review_not_fraud`.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# DEFECT: reasons vacío
# Este codigo tiene un defecto intencional que el learner debe corregir.
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
        title: "validate dual y política review_not_fraud",
        preamble:
          "- **Contexto:** CP-N2-C exige status + reasons por documento y una política escrita: revisión ≠ fraude.\n- **Meta:** implementar `validate` (total_mismatch, ruc_missing, ruc_low_conf / ruc_conf_missing) sobre d1 y d2.\n- **Éxito:** tres líneas — `('auto', [])`, needs_review con tres reasons, y `review_not_fraud`.\n- **Límites:** conf ausente no es 1.0; nunca imprimas fraud; acumula reasons.",
        instruction:
          "1. Reemplaza los tres `print(\"fraud\")`.\n2. Implementa `validate(doc)` con las rules del lab.\n3. Evalúa d1 (cuadra) y d2 (mismatch + ruc None + conf 0.5).\n4. Imprime la política `review_not_fraud` al final.",
        hint: "reasons[] + status; dos docs",
        hints: [
          "Discrepancia contable y RUC ausente van a reasons — nunca label 'fraud'",
          "status = 'auto' if not reasons else 'needs_review'; conf ausente → ruc_conf_missing",
          "Tras los dos validate, imprime review_not_fraud (política de producto)",
        ],
        edgeCases: ["varias reasons; conf ausente; no raise"],
        tests: "Stdout exacto (3 líneas): ('auto', []) luego needs_review con 3 reasons; luego review_not_fraud.",
        feedback:
          "d1 cuadra → auto; d2 acumula total_mismatch + ruc_missing + ruc_low_conf → needs_review. Etiquetar fraud desde OCR es el anti-patrón prohibido del curso.",
        retrospective:
          "Acumular reasons y encolar es el contrato de producto. Etiquetar fraud desde OCR es el anti-patrón prohibido. Pregunta: ¿qué reason usas si falta `conf_ruc` del todo?",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# DEFECT: etiqueta fraud y no acumula reasons
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
    conf = doc.get("conf_ruc")
    if conf is None:
        reasons.append("ruc_conf_missing")
    elif conf < 0.85:
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
        title: "Accuracy = correct / n (no error rate)",
        preamble:
          "- **Contexto:** el lab reporta exactitud de campo, no la tasa de error, para el dashboard de CP-N2-C.\n- **Meta:** imprimir `correct/n` como float.\n- **Éxito:** `0.75` con correct=3, n=4.\n- **Límites:** no uses `(n-correct)/n`; no hardcodees sin dividir.",
        instruction:
          "1. Abre el starter: imprime la tasa de error.\n2. Cambia a `correct / n`.\n3. Imprime el float.\n4. No alteres correct ni n.",
        hint: "división float",
        hints: [
          "accuracy = correct / n (no error rate)",
          "3/4 = 0.75 en float de Python 3",
          "n-correct/n es la tasa de error, no accuracy",
        ],
        edgeCases: ["n=0"],
        tests: "Stdout exacto: `0.75` (accuracy = correct/n). No la tasa de error (n-correct)/n.",
        feedback:
          "`correct/n = 0.75`. El starter calculaba la tasa de error (1 − acc): métrica distinta que miente al SLO si la reportas como accuracy.",
        retrospective:
          "Accuracy y error rate suman 1, pero el contrato del lab pide accuracy. Confundirlas miente al SLO. Siguiente (E2): medir por filas de RUC pred vs. true.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# DEFECT: usa n-correct
# Este codigo tiene un defecto intencional que el learner debe corregir.
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
        title: "Accuracy de RUC sobre filas del golden",
        preamble:
          "- **Contexto:** hardcodear 1.0 «porque el OCR se ve bien» miente al reporte de CP-N2-C.\n- **Meta:** fracción de filas con `ruc_pred == ruc_true`.\n- **Éxito:** `0.5` (1 de 2).\n- **Límites:** no hardcodees 1.0; mide el golden del starter.",
        instruction:
          "1. Revisa el starter: `print(1.0)`.\n2. Cuenta coincidencias pred/true y divide por `len(rows)`.\n3. Imprime el float.\n4. No mutes las filas.",
        hint: "sum generator",
        hints: [
          "Compara ruc_pred == ruc_true por fila",
          "1 de 2 filas correctas → 0.5",
          "No hardcodees 1.0: mide el golden",
        ],
        edgeCases: ["campos missing"],
        tests: "Stdout exacto: `0.5` (1 de 2 filas con ruc_pred==ruc_true). No hardcodees 1.0.",
        feedback:
          "Una de dos filas acierta el RUC → field accuracy 0.5. Hardcodear 1.0 miente al dashboard de CP-N2-C y oculta fallos del campo caro.",
        retrospective:
          "La métrica se calcula sobre el golden, no se declara «porque el OCR se ve bien». Hardcodear 1.0 miente al reporte de CP-N2-C y oculta el RUC caro. Pregunta: si 1 de 2 filas falla, ¿qué float debes imprimir y qué dirías en el standup? Luego (E3): reportar `acc_ruc` *y* `coverage_auto` juntos.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# DEFECT: siempre 1.0
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
        title: "Par acc_ruc y coverage_auto",
        preamble:
          "- **Contexto:** coverage alta con RUC basura en auto es un dashboard verde mentiroso.\n- **Meta:** calcular acc_ruc sobre golden de 2 filas y coverage_auto = auto/(auto+review).\n- **Éxito:** `0.5 0.7` en una línea.\n- **Límites:** no uses review rate; no hardcodees acc; no sustituyas accuracy por cobertura.",
        instruction:
          "1. Elimina el hardcode 1.0 y el `review/(auto+review)`.\n2. Mide acc_ruc con pred==true.\n3. Calcula la cobertura automática: qué proporción del total resolvió el sistema sin pasar por revisión.\n4. Imprime ambos floats.",
        hint: "field_acc + auto/(auto+review)",
        hints: [
          "acc_ruc = sum(pred==true) / n sobre el golden",
          "coverage_auto = auto / (auto + review) — no la tasa de revisión",
          "Subir cobertura bajando umbral sin medir error de campo es anti-patrón",
        ],
        edgeCases: ["abstention es métrica de producto separada"],
        tests: "Stdout exacto: `0.5 0.7` (acc_ruc y coverage_auto). No uses review rate ni hardcodees acc.",
        feedback:
          "Accuracy de campo (0.5) y cobertura HITL (0.7) son métricas distintas; confundirlas oculta fallos de RUC aunque el dashboard se vea verde.",
        retrospective:
          "Accuracy de críticos y cobertura HITL son métricas hermanas, no intercambiables. Pregunta: si bajas el umbral de conf, ¿qué pasa con cada una? Puente a T4-B: gate hostil antes del motor.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# DEFECT: confunde coverage con review rate y hardcodea acc
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
        title: "Rechazar mime zip en el gate",
        preamble:
          "- **Contexto:** un zip en el intake de facturas no debe llegar al worker OCR.\n- **Meta:** fail-closed si mime no está en {pdf, png, jpeg}.\n- **Éxito:** la cadena `reject`.\n- **Límites:** no confíes en la extensión del archivo; no inviertas las ramas ok/reject.",
        instruction:
          "1. Abre el starter: imprime `ok` cuando mime *no* está en allowed (bug).\n2. Invierte la lógica: `reject` si `mime not in allowed`.\n3. Imprime solo el status.\n4. No cambies el set allowed.",
        hint: "set membership",
        hints: [
          "zip no está en la allowlist del intake de facturas",
          "reject si mime not in allowed",
          "No confíes en la extensión del nombre de archivo",
        ],
        edgeCases: ["doble extensión"],
        tests: "Stdout exacto: `reject`. zip no está en allowlist pdf/png/jpeg.",
        feedback:
          "`application/zip` se rechaza en el gate de admisión *antes* del motor OCR. Aceptar zip abre hostiles al worker y quema CPU del batch.",
        retrospective:
          "Fail-closed de admisión: si el mime no está en la allowlist, no hay OCR. El error clásico es invertir el ternario y «dejar pasar» lo desconocido. Pregunta: ¿por qué no basta con mirar `.zip` en el nombre? Siguiente (E2): tope de tamaño 5e6.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# DEFECT: ramas invertidas (acepta zip)
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
        title: "Rechazar archivo sobre el tope 5e6",
        preamble:
          "- **Contexto:** 6_000_000 bytes superan el tope didáctico y amenazan al worker (DoS / zip-bomb).\n- **Meta:** imprimir `reject` si n supera 5_000_000.\n- **Éxito:** `reject`.\n- **Límites:** no inviertas ok/reject; no cambies el tope del lab.",
        instruction:
          "1. Revisa el starter: `ok` cuando n es grande (bug).\n2. Cambia a `reject` si `n > 5_000_000`.\n3. Imprime el status.\n4. No uses otro umbral.",
        hint: "n > 5_000_000 → reject",
        hints: [
          "Tope didáctico del lab: 5_000_000 bytes",
          "Si n supera el tope → reject",
          "El starter invierte ok/reject",
        ],
        edgeCases: ["streaming"],
        tests: "Stdout exacto: `reject`. 6_000_000 supera el tope 5_000_000; no invertas el umbral.",
        feedback:
          "6e6 > 5e6 → reject. Invertir el umbral abre la puerta a zip-bomb / DoS al worker OCR: capa 1 barata y obligatoria.",
        retrospective:
          "Size cap es capa 1 barata y obligatoria: 6e6 supera 5e6 → reject. Invertir el umbral abre abuso al worker. El hábito es fallar cerrado ante tamaño hostil, no «intentar OCR y ver». Luego (E3): mime + size + fallback `human_rescan`.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# DEFECT: umbral invertido
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
        title: "Gate mime/size y fallback human_rescan",
        preamble:
          "- **Contexto:** el intake aplica admisión antes del motor; si el OCR falla sobre un binario corrupto, cae a reescaneo humano.\n- **Meta:** zip→reject; pdf 9e6→reject; pdf 100k con ocr_fail→human_rescan.\n- **Éxito:** tres líneas `reject` / `reject` / `human_rescan`.\n- **Límites:** no imprimas `continue`; no reintentes OCR en bucle; orden mime → size → fallback.",
        instruction:
          "1. Reemplaza el loop que imprime `continue`.\n2. Si mime no allowed → reject.\n3. Elif n > MAX_N → reject.\n4. Elif status_ocr == ocr_fail → human_rescan; else ok.",
        hint: "allowlist + size + mapa fallback",
        hints: [
          "Primero gate mime/size; solo si pasa el gate aplica fallback de OCR",
          "ocr_fail → human_rescan (no reintentar 100 veces el mismo binario)",
          "Orden: zip, pdf grande, pdf ocr_fail",
        ],
        edgeCases: ["no LLM sin evidencia; fail-closed en mime"],
        tests: "Stdout exacto (3 líneas): `reject` / `reject` / `human_rescan`. Mime, size, luego fallback OCR.",
        feedback:
          "Hostiles se rechazan en admisión; ocr_fail cae a human_rescan. `continue` en fail quema CPU y no resuelve un PDF roto.",
        retrospective:
          "Hostiles se cortan en admisión; ocr_fail no se castiga con reintentos infinitos. Pregunta: ¿por qué human_rescan es mejor que «seguir el batch a ciegas»? Puente al You Do: gate_file ya scaffolded.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# DEFECT: acepta zip y reintenta OCR
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
      "Cierra el arco S23→S24: el artefacto descargado (meta de imagen + tokens OCR simulados) entra al **document intake** de CP-N2-C. Procesa al menos 3 “documentos” sintéticos siguiendo estos pasos:\n\n1. Preproceso de la meta de imagen.\n2. Extracción KV con bbox del valor.\n3. Normalización a schema (RUC 11 dígitos, montos PE con coma decimal, fecha ISO).\n4. Validación cross-field (conf ausente → revisión).\n5. Métricas por campo y cola de revisión.\n\nSin PII real; sin label de fraude. Criterio de aceptación: un script o notebook que, al correr, imprima status y `reasons[]` por doc, más `acc_ruc` / `acc_total` / `coverage_auto` sobre un mini golden (≥2 filas).",
    objectives: [
      "Pipeline preproceso → OCR simulado → schema (campos ruc, total, fecha) con schema_version",
      "Abstener campos low-conf (umbral por campo crítico, p. ej. RUC < 0.85 → review); conf ausente no es 1.0",
      "Golden de al menos 2 docs con accuracy por campo (ruc y total) y coverage_auto",
      "Gate de admisión capa 1 (mime allowlist + size cap) antes del motor; ocr_fail → human_rescan",
    ],
    requirements: [
      "Datos 100% sintéticos (facturas demo, IDs fake); no PDFs reales de clientes",
      "bbox del valor (no solo del label) obligatorio en el dict de cada campo crítico",
      "needs_review ≠ fraude (política explícita en log o comentario de módulo)",
      "norm_total PE-aware: \"150,00\" → 150.0 (no 15000.0); política locale PE declarada",
      "norm_ruc: letras embebidas → None (no borrar corrupción OCR para inventar 11 dígitos)",
      "validate: conf_ruc ausente → ruc_conf_missing (no default 1.0)",
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

# Mini golden (al menos 2 docs) — completa pred vs. true
golden = [
    {"ruc_pred": None, "ruc_true": "20123456789", "total_pred": None, "total_true": 150.0},
    {"ruc_pred": "20123456780", "ruc_true": "20123456789", "total_pred": 99.0, "total_true": 100.0},
]

def preprocess(meta):
    # Completa: dpi >= 200, deskew_applied si |skew|>=0.5, skew_deg -> 0.0
    return meta

def parse_kv(toks):
    # Completa: "Clave: valor" -> dict con name, value, conf, bbox del valor
    return {}

def norm_ruc(s):
    # Completa: letras → None; separadores OK; len == 11 o None (sin pad)
    return s

def norm_total(s):
    # Completa: montos PE ("150,00" -> 150.0); no borrar comas a ciegas
    return float(s) if s else None

def validate(doc):
    # Completa: total_mismatch / ruc_missing / ruc_low_conf / ruc_conf_missing
    return "needs_review", ["not_implemented"]

def field_acc(rows, field):
    # Completa: correct/n sobre {field}_pred == {field}_true
    return 0.0

# Gate hostil capa 1: zip o size > 5e6 -> reject (mime spoofable en prod)
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
      { criterion: "Correctitud de normalización (RUC 11 dígitos sin inventar, montos PE, fechas ISO) y validación fail-closed", weight: "20%" },
      { criterion: "Privacidad / sin PII real / sin secretos / sin inferencia de fraude", weight: "20%" },
      { criterion: "Casos de borde: low-conf, conf ausente, discrepancia contable, mime/size reject, documentados", weight: "15%" },
      { criterion: "Código legible, funciones puras y límites claros (real vs. fake adapter)", weight: "10%" },
      { criterion: "Documentación en español profesional (README + métricas reportadas)", weight: "10%" },
    ],
    retrospective:
      "Antes de marcar listo: (1) ¿qué invariante demuestras con un print o test (p. ej. `150,00`→150.0 y RUC con letra→None)? (2) ¿qué harías distinto con PDFs reales de clientes vs. fixtures sintéticos (PII, minimización, gate)? (3) Escribe en el README una frase de impacto medible (p. ej. «acc_ruc X, coverage_auto Y, N docs en needs_review sin label de fraude») que puedas defender en 30 segundos en entrevista de backoffice/ops data.",
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
        question: "¿Qué implica una discrepancia entre el total y la suma de líneas en la validación cross-field?",
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
