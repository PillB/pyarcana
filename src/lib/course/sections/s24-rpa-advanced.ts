/**
 * S24 — OCR y Document AI
 *
 * The filename and the exported id ("rpa-advanced") both come from a pre-V3 ordering
 * and no longer describe what this section teaches. The id is the URL hash and
 * a learner save key, so it cannot be changed without losing progress.
 *
 * Read `title` below, never the slug. Matching content to the slug is how three
 * agent diagrams ended up attached to a data-testing lesson.
 */
import type { CourseSection } from '../../types'

export const section24: CourseSection = {
  id: "rpa-advanced",
  index: 24,
  title: "OCR y Document AI",
  shortTitle: "OCR Document AI",
  tagline: "extrae campos de documentos sintéticos, conserva la caja de cada valor como evidencia, se abstiene con confianza baja y mide cada campo crítico",
  estimatedHours: 9,
  level: "Práctica independiente",
  phase: 1,
  icon: "Bot",
  accentColor: "bg-gradient-to-br from-blue-500 to-indigo-600",
  jobRelevance:
    "En un backoffice de Lima llegan facturas, boletas y PDFs de proveedores. El cuello de botella no es «leer letras»: es convertir un PDF en campos con evidencia que un humano pueda auditar en minutos. Aquí aprendes a modelar el camino: preproceso → OCR con confidence y caja delimitadora (bounding box) → schema → validación cross-field → cola de revisión humana y métricas por campo. El valor profesional es encolar bien, no cerrar casos por score ni inventar dígitos de RUC.",
  learningOutcomes: [
    { text: "Preprocesar metadatos de imagen sintética (DPI, deskew, crop, contraste) y dejar flags auditables" },
    { text: "Corregir ruido y orientación antes de invocar el motor OCR" },
    { text: "Consumir un contrato OCR: idiomas, confidence por campo y orden de lectura por la caja delimitadora (bbox) de cada token" },
    { text: "Extraer texto, tablas y pares clave–valor con evidencia del valor" },
    { text: "Normalizar a schema (RUC 11 dígitos, montos PE, fechas ISO) sin inventar valores" },
    { text: "Validar cross-field, acumular reasons[] y encolar revisión sin label de fraude" },
    { text: "Evaluar exactitud por campo y coverage_auto sobre un conjunto de referencia etiquetado a mano (golden set) sintético" },
    { text: "Aplicar gates de admisión (mime/tamaño como capa 1) y fallback human_rescan" },
  ],
  theory: [
    {
            heading: "El documento no trae los datos: trae una imagen de los datos",
      paragraphs: [
        "Una factura escaneada es, para el programa, un rectángulo de píxeles. No hay campo «monto» ni campo «fecha»: hay manchas oscuras que a un ojo humano le parecen números. Todo lo que sigue en esta sección convierte eso en datos con los que se pueda trabajar. En cada paso sabrás cuánto de esa conversión es lectura y cuánto es conjetura.",
        "Antes de leer conviene arreglar la imagen, porque el reconocimiento hereda cada defecto del original. Una hoja escaneada torcida, con poca resolución o con ruido de fondo produce lecturas erráticas, y ninguna sofisticación posterior recupera lo que se perdió ahí. Enderezar, limpiar y comprobar la resolución no es preprocesamiento decorativo: es la mitad del resultado.",
        "El reconocimiento devuelve texto acompañado de dos cosas que importan tanto como el texto. La primera es dónde estaba: la caja que localiza ese valor en la página, para que un revisor humano pueda mirar el original y confirmarlo en dos segundos en vez de buscarlo. La segunda es cuánta confianza tiene el motor en esa lectura. Aquí hay que ser preciso: esa confianza mide qué tan segura está la máquina de haber leído bien los caracteres, no de que el dato sea correcto.",
        "Con eso aparece la decisión que ordena el flujo. Un campo leído con alta confianza y que además cumple su formato esperado puede pasar; uno con baja confianza, o que no cuadra con el schema, va a revisión. **Abstenerse es una salida válida** — de hecho es la salida correcta cuando el documento está mal escaneado. Inventar un valor plausible para que el proceso no se detenga es el peor resultado posible, porque nadie se entera.",
        "La pregunta que gobierna la sección junta lectura y responsabilidad: **¿de dónde salió este valor, y qué tan seguro estoy de haberlo leído bien?** Todos los documentos son sintéticos. Se practica primero con la biblioteca estándar y adaptadores simulados.",
      ],
      callout: {
        type: "info",
        title: "Alcance de esta sección",
        content:
          "Dominas el **contrato de intake** (evidencia, abstención, schema, golden por campo) con demos sintéticos. El layout multi-columna avanzado y los procesadores comerciales de Document AI quedan como lectura en Recursos. También son extensión opcional cuando el runtime lo permita. `TesseractAdapter` llama un motor real si está instalado; `FakeOcrAdapter` nunca se presenta como OCR real: devuelve observaciones fijadas para tests de parsing, abstención y evaluación.",
      },
     },
     {
      heading: "Contrato de la sección (referencia)",
      optional: true,
      paragraphs: [
        "Bloque de referencia. Orden de los subtemas y alcance.",
        "**Orden de los subtemas.** T1 trata la imagen: resolución, enderezado, ruido y orientación. T2 pasa al reconocimiento: idiomas, disposición, pares clave-valor y tablas. T3 cubre la extracción: schema, validación y cola de revisión. T4 cierra con la evaluación: conjunto de referencia por campo, privacidad y documentos hostiles.",
        "**Entrada.** Una descarga verificada del adaptador web de S23. Aquí no se vuelve a recorrer el portal: se consume el artefacto.",
        "**Alcance.** El objetivo es el contrato de admisión —evidencia, abstención, schema y referencia por campo— con demos sintéticos. La maquetación multicolumna avanzada y los procesadores comerciales quedan como lectura.",
      ],
     },
     {
      heading: "DPI, deskew, crop y contraste",
      figure: {
        id: "S24-ocr-pipeline",
        caption:
          "Reescalar de 96 a 200 no añade detalle: interpola píxeles que nunca se registraron.",
        alt:
          "Cuatro etapas —captura, deskew, OCR, campos— con la frontera tras la captura.",
      },
      subtopicId: "S24-T1-A",
      paragraphs: [
        "Cuando una boleta llega al intake a **96 DPI** (foto de celular, PDF rasterizado barato), el motor OCR confunde “8” con “B” y el RUC se rompe. Una precisión de vocabulario que aquí cambia lo que puedes hacer: **DPI** (puntos por pulgada) es una medida de *impresión*; lo que tiene una imagen ya capturada son **PPI**, píxeles por pulgada. La diferencia importa porque la cifra que te salva se decide en la **captura**: escanea o fotografía a ≥300 PPI efectivos y el motor tiene detalle con el que trabajar. Reescalar después de 96 a 200 no recupera nada — interpola píxeles que nunca se registraron, y un “8” que ya se perdió sigue perdido, ahora más grande. Por eso el lab exige el mínimo en la **captura** y no acepta un upscale como sustituto: si la captura no llega, la página vuelve a escanearse. En la metadata de una imagen ese número se sigue llamando `dpi` (así lo guarda Pillow en `img.info[\"dpi\"]`), aunque mida píxeles por pulgada; en el lab usamos esa clave. **Deskew** corrige la inclinación del escaneo; **crop** recorta márgenes negros que distraen al layout; **contraste** ayuda tinta débil. Ninguna de estas ops “arregla fraude”: no inventan dígitos ni reescriben montos.",
        "En este curso modelamos las ops como transformaciones sobre **metadatos** de imagen sintética (`w, h, dpi, skew_deg, contrast`). No necesitas OpenCV instalado para aprender el **contrato** del pipeline: qué entra, qué sale y qué flags quedan en el log. Cada corrida deja `deskew_applied` y el `crop_box` auditable — así el revisor o el test de regresión saben *qué* se le hizo a la página antes del OCR.",
        "Pipeline canónico: `load → dpi_check → deskew → crop → contrast → OCR`. Caso PE sintético (Lima, batch nocturno): foto de boleta a 96 DPI y 1.8° de sesgo. Tras el preproceso, `dpi` sigue en 96 y `rescan_needed=True`: esa página va a reescaneo, no al motor. Los demás flags quedan registrados: `deskew_applied=True`, `skew_deg=0.0` (ángulo ya corregido) y contraste escalado con tope. El margen de crop va de 2 a 5 %; el código usa 2 % si no le pasas otro.",
        "Borde útil: si el sesgo es casi nulo (`|skew| < 0.5°`), no marques deskew “por si acaso”; un flag falso ensucia la auditoría. Una captura a 300 DPI con 0.2° de sesgo no necesita reescaneo ni deskew (segunda línea de la salida). El preproceso es barato frente a volver a correr OCR: invierte ahí antes de culpar al motor.",
      ],
      code: {
        language: 'python',
        title: "preprocess.py",
        code: `MIN_DPI = 200  # piso del lab, medido en la captura

def preprocess_meta(img):
    # img: dict sintético (contrato, no OpenCV). Las decisiones quedan como flags.
    out = dict(img)
    # Sin dato de resolución se reescanea (fail-closed). El número no se sube.
    out["rescan_needed"] = img.get("dpi", 0) < MIN_DPI
    ang = img.get("skew_deg", 0.0)
    out["deskew_applied"] = abs(ang) >= 0.5
    out["skew_deg"] = 0.0 if out["deskew_applied"] else ang
    m = img.get("crop_margin", 0.02)  # el lab acepta de 0.02 a 0.05
    w, h = img["w"], img["h"]
    out["crop_box"] = (int(m * w), int(m * h), int((1 - m) * w), int((1 - m) * h))
    out["contrast"] = min(1.5, img.get("contrast", 1.0) * 1.2)
    return out

meta = preprocess_meta({"w": 1000, "h": 1400, "dpi": 96, "skew_deg": 1.8, "contrast": 1.0})
print(meta["dpi"], meta["rescan_needed"], meta["deskew_applied"], meta["crop_box"][0], round(meta["contrast"], 2))
ok = preprocess_meta({"w": 1000, "h": 1400, "dpi": 300, "skew_deg": 0.2, "crop_margin": 0.05})
print(ok["dpi"], ok["rescan_needed"], ok["deskew_applied"], ok["crop_box"][0])`,
        output: `96 True True 20 1.2
300 False False 50`,
      },
      callout: {
        type: "tip",
        title: "Criterio de preproceso antes del motor",
        content:
          "Checklist: (1) dpi ≥ 200 en la captura (ideal 300 en tipografía pequeña); si no llega, `rescan_needed` y no se sube el número. (2) deskew_applied solo si |skew| ≥ 0.5°. (3) El crop deja márgenes sin recortar sello ni total. (4) Contraste con tope: nunca reescribe dígitos. Si falla RUC, revisa esta checklist antes de cambiar de modelo OCR. En el lab, los flags registran la *decisión*; un adaptador real aplicaría el raster después.",
      },
    },
    {
      heading: "Ruido y orientación",
      subtopicId: "S24-T1-B",
      paragraphs: [
        "Dos enemigos silenciosos del intake: **ruido** (sal/pimienta, JPEG agresivo) y **orientación** (0°/90°/180°/270°). Si corres OCR con la página al revés, el layout se rompe y —peor— el motor a veces devuelve **confidence alta en basura**. El revisor confía en el score y no mira el bbox: se cuela un RUC inventado en la cola “auto”.",
        "Detecta orientación por scores de señales (cabecera “FACTURA”, densidad de texto) o por un modelo ligero; elige la rotación de **máximo score** y aplica la corrección **antes** del motor. Simulamos scores por rotación y un denoise de **contrato** sobre flags 0/1. No es un filtro de imagen real: un denoise de producción usaría mediana o morfología. Aquí auditamos el flag de ruido para tests y runbooks.",
        "Si el mejor score de orientación queda **bajo 0.5**, o si dos rotaciones empatan en el mejor score, el intake prefiere `manual_orient`: un humano gira la página. Forzar auto con baja certeza rompe el fail-closed de calidad. Forzar OCR “para no parar el batch” es el anti-patrón que llena la cola de basura cara de revisar.",
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
      figure: {
        id: "S24-field-confidence",
        caption:
          "Sin la región guardada, un revisor no puede comprobar de dónde salió el número que va a aprobar.",
        alt:
          "Grafo de imagen a región a texto con confianza, que se bifurca a campo aceptado o a revisión.",
      },
      subtopicId: "S24-T2-A",
      paragraphs: [
        "Cada token llega con su **bbox** (caja delimitadora, *bounding box*): `[x0, y0, x1, y1]` en píxeles, con (0, 0) en la esquina superior izquierda. Configura **idiomas** (`spa+eng`) según el corpus: facturas PE en español con tokens EN de software (“SUBTOTAL”, “SKU”). Un motor mal configurado en solo `eng` castiga acentos y “RUC”. El **layout** (bloques, columnas) guía el **orden de lectura**: en el lab ordenamos por bbox `(y0, x0)`. Primero va la fila (arriba→abajo) y, dentro de la fila, la columna (izquierda→derecha), que es como se lee una página. Ordenar por `(x0, y0)` leería columna por columna. No concatenes columnas a ciegas o mezclarás el “Total” de la derecha con ítems de la izquierda.",
        "Cada token/campo trae **confidence** entre 0 y 1. El error clásico es promediar: un RUC a 0.55 junto a seis tokens a 0.97 da un promedio de 0.91. Ese promedio pasa el umbral de 0.85 y el intake autoacepta basura. Usa **abstención por campo crítico** (RUC, total): si conf del RUC < 0.85 → el documento queda en `needs_review` y entra a la cola de revisión (`review_queue`). No inventes dígitos ni “corrijas” con un checksum inventado sin política escrita.",
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
          "Umbral didáctico del lab para RUC: conf < 0.85 → needs_review (cola `review_queue`). Calcula min(conf de críticos) o revisa campo a campo. Promediar un RUC a 0.55 con seis tokens a 0.97 da 0.91 y “pasa”: es anti-patrón, porque oculta el dígito débil. Nunca rellenes dígitos faltantes.",
      },
    },
    {
      heading: "Texto, tablas y pares clave–valor",
      subtopicId: "S24-T2-B",
      paragraphs: [
        "Del OCR salen tres familias útiles: **texto corrido**, **tablas** (filas/columnas) y **pares clave–valor** (KV: RUC→valor, Total→monto). En intake, el KV es la unidad mínima que alimenta el schema. Heurística didáctica del lab: línea con “Clave: valor” → `split(\":\", 1)` y `strip` de ambos lados.",
        "La evidencia no es el label “RUC” en negrita: es el **bbox del valor** (los dígitos). El revisor en UI resalta ese rectángulo sin volver a pasar el motor OCR. Si solo guardas el bbox del label, el humano no ve el número dudoso y pierde tiempo.",
        "Tablas sintéticas: listas de listas con header en fila 0; `n_data_rows = len(table) - 1`. Tras el OCR, las celdas pueden desalinearse o fusionarse, así que se valida que cada fila tenga tantas columnas como el header. Los ítems (montos de línea) alimentan la validación `sum(líneas) ≈ total` con tolerancia monetaria (0.01). Contar el header como ítem infla la suma y manda a revisión por error de parsing, no de negocio.",
        "Caso PE: líneas “RUC: 20123456789” y “Total: 150.00” → dict KV. La tabla trae 3 filas de datos y una salió fusionada del OCR (`['C 30']`): se marca antes de sumar. El field dict lleva el bbox del valor (los dígitos), no el del label. La cabecera “FACTURA” no tiene dos puntos y se salta. Más adelante, Document AI comercial hace layout multi-columna y tablas complejas; aquí fijas el contrato de evidencia antes de cambiar de motor.",
      ],
      code: {
        language: 'python',
        title: "kv_tables.py",
        code: `lines = [
    {"text": "FACTURA", "value_bbox": None},
    {"text": "RUC: 20123456789", "value_bbox": [60, 50, 200, 70]},
    {"text": "Total: 150.00", "value_bbox": [70, 80, 140, 100]},
]

def fields_from_lines(lines):
    fields = []
    for ln in lines:
        if ":" not in ln["text"]:
            continue  # cabecera o texto corrido: no es un par clave-valor
        k, v = ln["text"].split(":", 1)
        fields.append({"name": k.strip(), "value": v.strip(), "bbox": ln["value_bbox"]})
    return fields

table = [["Item", "Monto"], ["A", "100"], ["B", "50"], ["C 30"]]
bad_rows = [i for i, row in enumerate(table) if len(row) != len(table[0])]
for f in fields_from_lines(lines):
    print(f)
print("table_rows", len(table) - 1, "filas_desalineadas", bad_rows)`,
        output: `{'name': 'RUC', 'value': '20123456789', 'bbox': [60, 50, 200, 70]}
{'name': 'Total', 'value': '150.00', 'bbox': [70, 80, 140, 100]}
table_rows 3 filas_desalineadas [3]`,
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
        "Un comprobante peruano imprime los montos como `S/ 1,150.50`: **coma de miles y punto decimal**. Así lo define el locale es-PE de CLDR, los datos que usan los navegadores y las librerías de formato (`Intl.NumberFormat('es-PE')` imprime ese mismo texto). Un proveedor con formato español o colombiano escribe `1.150,50`, y una boleta a mano puede traer `150,00`. El lab usa la regla de S16. Quita el símbolo de moneda (`S/` o `PEN`). Si hay coma y punto, el separador que aparece al final es el decimal. Un separador solo seguido de dos dígitos también es decimal. Un separador solo seguido de exactamente tres dígitos (`1,150`) es ambiguo: `norm_total` lanza `ValueError` y el documento va a revisión con la reason `total_unparsed`. Borrar comas a ciegas convierte `150,00` en `15000.0`; tratar la coma como decimal en un monto peruano convierte `1,150.50` en `1.1505`. Los dos errores son silenciosos y mil veces más grandes o más chicos.",
        "RUC: puedes quitar separadores benignos (puntos, espacios, guiones), pero **una letra** (p. ej. `20X…` por confusión OCR) no se “limpia” a un identificador plausible: devuelve `None` y encola. Si tras limpiar la longitud no es 11, también `None` — no rellenes ceros ni inventes checksum. Fechas de boleta `DD/MM/YYYY` → `YYYY-MM-DD` con `strptime` day-first (formato PE). Con el formato US `%m/%d/%Y`, `15/01/2026` falla con `ValueError`, pero `05/01/2026` da `2026-05-01` sin error: día y mes se cambian en silencio.",
        "Versionar el schema (`invoice.v1`) evita que un deploy cambie el significado de `total_incl_igv` a mitad de un golden set (el conjunto de referencia etiquetado a mano que verás en T4-A). Contrato del lab: `norm_ruc` / `norm_total` / `norm_fecha` puras, testeables sin red ni archivos reales.",
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
    # Regla de S16: el separador que aparece al final es el decimal.
    s = s.replace("S/", "").replace("PEN", "").replace(" ", "")
    if "," in s and "." in s:
        miles = "." if s.rfind(",") > s.rfind(".") else ","
        s = s.replace(miles, "")
    elif re.fullmatch(r"\\d{1,3}[.,]\\d{3}", s):
        raise ValueError("monto ambiguo: " + s)  # 1,150: ¿mil ciento cincuenta o 1.15?
    return float(s.replace(",", "."))

def norm_fecha(s):
    try:
        return datetime.strptime(s, "%d/%m/%Y").date().isoformat()  # boleta PE: día primero
    except ValueError:
        return None

raw = {"ruc": "20.123456789", "total": "S/ 1,150.50", "fecha": "15/01/2026"}
print({
    "ruc": norm_ruc(raw["ruc"]),
    "total": norm_total(raw["total"]),
    "fecha": norm_fecha(raw["fecha"]),
    "schema": "invoice.v1",
})
print("otros", norm_total("1.150,50"), norm_total("150,00"), norm_total("PEN 99.90"))
print("corrupt", norm_ruc("20X123456789"))  # letra → None, no 20123456789
try:
    norm_total("1,150")
except ValueError as e:
    print("total_unparsed", e)`,
        output: `{'ruc': '20123456789', 'total': 1150.5, 'fecha': '2026-01-15', 'schema': 'invoice.v1'}
otros 1150.5 150.0 99.9
corrupt None
total_unparsed monto ambiguo: 1,150`,
      },
      callout: {
        type: "warning",
        title: "None ≠ 0, y el separador final es el decimal",
        content:
          "Si el RUC trae letras o no normaliza a 11 dígitos, deja None y manda a revisión — no pongas \"000...\" ni 0.0 en total. Borrar una X del OCR y quedarte con 11 dígitos es inventar identidad. En montos, el separador final es el decimal: `S/ 1,150.50` → 1150.5 y `150,00` → 150.0. Borrar comas a ciegas da 15000.0; leer la coma peruana como decimal da 1.1505. `1,150` es ambiguo: revisión, no adivinanza.",
      },
    },
    {
      heading: "Validación cross-field y cola de revisión",
      subtopicId: "S24-T3-B",
      paragraphs: [
        "La validación **cross-field** compara campos entre sí: `abs(sum(líneas) - total) > 0.01` → `total_mismatch`. RUC `None` → `ruc_missing`. Confidence de RUC bajo umbral → `ruc_low_conf`. Si **falta** `conf_ruc`, no asumas 1.0: marca `ruc_conf_missing` (fail-closed). Las reasons se **acumulan** en una lista; el documento no se autoacepta si la lista no está vacía.",
        "La cola de revisión (HITL: *human-in-the-loop*) es el **producto**, no un “error del sistema”. Entregas `status=needs_review`, `reasons[]` y bbox para que un humano decida. **Discrepancia contable ≠ fraude**: una boleta mal tipada o un OCR con un dígito flojo no es acusación. Política del lab: `review_not_fraud` — humanos investigan; el pipeline solo encola.",
        "Caso sintético del lab (mismos números en teoría, demo y transferencia): total 150.0 vs. líneas [100, 50] y RUC confiable → `auto` con reasons vacías; total 150.0 vs. [100, 40], ruc None y conf 0.5 → `needs_review` con `total_mismatch`, `ruc_missing` y `ruc_low_conf`.",
        "En batch nocturno, un doc en cola no debe detener el archivo: lo dejas en `review_queue`, registras las reasons en el log y pasas al siguiente. Fail-closed de *calidad* (no autoaceptar basura) no es lo mismo que fail-stop de *throughput* (tirar el batch entero).",
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
        "Un **golden set** es un conjunto pequeño de páginas/campos etiquetados a mano (pred vs. true) que sirve de “verdad de laboratorio”. Mides exactitud **por campo** (ruc, total, fecha), no un accuracy global que esconde fallos caros. Caer en RUC es más grave que errar una glosa opcional, así que cada campo crítico tiene su propio **SLO** (*service level objective*). Un SLO es el nivel de acierto que te comprometes a sostener para ese campo, no el que mides hoy.",
        "`field_acc = correct / n` compara `ruc_pred == ruc_true` (o total) fila a fila. En paralelo, `coverage_auto = auto / (auto + review)` mide qué fracción de documentos pasa sin HITL. Son métricas distintas: puedes tener cobertura alta y accuracy de RUC baja si bajaste el umbral de abstención. Exact match por campo es la métrica base del lab; precisión, recall y umbrales calibrados son el siguiente paso en producción.",
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
          "Imprime al menos `acc_ruc`, `acc_total` y `coverage_auto = auto / (auto + review)`. Aquí, `coverage_auto` es la fracción de documentos que pasa sin revisión humana. No sustituyas la exactitud por esa cobertura automática. Si `coverage_auto` sube y `acc_ruc` baja, el umbral de abstención está mal calibrado.",
      },
    },
    {
      heading: "Privacidad, archivos hostiles y fallback",
      subtopicId: "S24-T4-B",
      paragraphs: [
        "Privacidad primero: en el lab solo fixtures **sintéticos** (facturas demo, IDs fake). No subas PDFs reales de clientes al sandbox ni al repo. Minimiza con criterio: un bbox solo tiene sentido con una rendición revisable (hash, página, dimensiones, caducidad). Si borras la imagen cruda sin dejar una copia de revisión controlada, el revisor no puede auditar el resaltado.",
        "Antes del motor, un **gate de admisión (capa 1)**: allowlist de mime (`application/pdf`, `image/png`, `image/jpeg`); zip u otros → `reject`. El tope de tamaño (p. ej. 5_000_000 bytes; el archivo de exactamente 5_000_000 pasa) limita lo que subes a memoria antes de parsear. No para una bomba de descompresión (*zip bomb*): un archivo pequeño puede expandirse a gigas, también dentro de un PDF con flujos comprimidos. Por eso el parser de la capa 2 mide además el tamaño descomprimido y corta si supera un tope o una razón de expansión. El mime del caller es **spoofable**: en producción sigue la capa 2 (firmas mágicas, parseo aislado, sandbox). No confíes en la extensión del nombre (`factura.pdf.zip` disfrazado).",
        "Si el OCR falla con un binario corrupto (`ocr_fail`), el fallback operativo es `human_rescan` (reescaneo o tipeo asistido) — no reintentar 100 veces el mismo archivo. Reintentar en bucle quema CPU y no mejora un PDF roto.",
        "Contrato de seguridad del intake: fail-closed en mime/size (capa 1; sin mime o sin tamaño declarado, `reject`); logs sin PII real; adapters `real`/`fake` etiquetados en logs. El revisor ve reasons y bbox; nunca un badge de “fraude detectado por OCR”.",
      ],
      code: {
        language: 'python',
        title: "hostile_gate.py",
        code: `MAX_BYTES = 5_000_000
ALLOWED = {"application/pdf", "image/png", "image/jpeg"}

def gate_file(meta):
    if meta.get("mime") not in ALLOWED:
        return "reject", "mime"
    if "n_bytes" not in meta:
        return "reject", "size_missing"  # fail-closed: sin tamaño no se admite
    if meta["n_bytes"] > MAX_BYTES:
        return "reject", "size"
    if meta.get("encrypted"):
        return "review", "encrypted"
    return "ok", "pass"

print(gate_file({"mime": "image/png", "n_bytes": 120_000}))
print(gate_file({"mime": "application/zip", "n_bytes": 10}))
print(gate_file({"mime": "application/pdf", "n_bytes": 9_000_000}))
print(gate_file({"mime": "application/pdf", "n_bytes": 5_000_000}))
print(gate_file({"mime": "application/pdf"}))`,
        output: `('ok', 'pass')
('reject', 'mime')
('reject', 'size')
('ok', 'pass')
('reject', 'size_missing')`,
      },
      callout: {
        type: "warning",
        title: "Gate antes del motor + minimización",
        content:
          "Orden: (1) mime allowlist, (2) size cap, (3) recién entonces OCR. Zip, tamaño ausente o más de 5e6 bytes → reject. ocr_fail → human_rescan, no bucle infinito. Borra la imagen cruda solo después de guardar una copia de revisión controlada (hash, página, dimensiones, caducidad): sin ella, el bbox no se puede resaltar.",
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
        description: "Marca reescaneo si la captura queda bajo 200 DPI (sin subir el número) y marca deskew si el sesgo supera 0.5°.",
        preamble:
          "Antes de culpar al motor OCR, el intake de CP-N2-C decide si la página sintética está en condiciones. En esta demo un dict de metadata (no OpenCV real) compara el DPI de la captura con el piso del lab (200) y marca deskew si el sesgo supera 0.5°. El número de DPI no se toca: subirlo no recupera detalle. No escribas aún: predice `dpi`, `rescan_needed` y `deskew` para un escaneo a 72 DPI con 2° de inclinación; luego compara con la salida. Si saltas el preproceso, el RUC se rompe «en el modelo» por una causa barata de evitar.",
        code: {
          language: 'python',
          title: "demo.py",
          code: `def preprocess(img, min_dpi=200):
    out = dict(img)
    out["rescan_needed"] = img.get("dpi", 0) < min_dpi  # la captura no llega al piso
    out["deskew"] = abs(img.get("skew_deg", 0)) >= 0.5
    return out

out = preprocess({"w": 800, "h": 1000, "dpi": 72, "skew_deg": 2.0})
print(out["dpi"], out["rescan_needed"], out["deskew"])
`,
          output: `72 True True`,
        },
        why: "El preproceso del lab opera sobre metadata auditable: `dpi` queda como llegó y `rescan_needed` dice que esa página vuelve a escanearse antes del OCR. Cambiar 72 por 200 en la metadata no añade un solo píxel; solo haría pasar el gate. Un skew casi nulo no debe forzar deskew «por si acaso».",
        retrospective:
          "Si puedes explicar por qué una captura a 72 DPI va a reescaneo y no al motor, ya tienes el hábito de preflight. El error clásico es «arreglar» el número con `max(dpi, 200)` y dejar que el gate pase. En We Do practicarás el piso 200, el flag de deskew y el contrato compuesto de crop.",
      },
      {
        demoId: "S24-T1-B-DEMO",
        subtopicId: "S24-T1-B",
        environment: "local",
        description: "Elige la rotación de mayor score (0/90/180/270) antes de llamar al OCR.",
        preamble:
          "Si la página está al revés, el layout se rompe y —peor— el motor puede devolver basura con confidence engañosamente alta. En esta demo eliges la rotación de mayor score entre 0/90/180/270. No escribas: predice qué key gana con scores `{0:0.2, 90:0.05, 180:0.75, 270:0.0}`. Piensa también por qué el score no basta si no rotas antes del OCR.",
        code: {
          language: 'python',
          title: "demo.py",
          code: `def best_orientation(scores):
    return max(scores, key=scores.get)

print(best_orientation({0: 0.2, 90: 0.05, 180: 0.75, 270: 0.0}))
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
          "En el intake, un RUC a 0.55 no se «salva» porque la cabecera FACTURA tenga 0.99. Esta demo calcula el promedio de cuatro tokens y lista los que quedan bajo el umbral 0.85, sin inventar dígitos. No escribas aún; predice si el promedio pasa el umbral y qué token entra a low_conf.",
        code: {
          language: 'python',
          title: "demo.py",
          code: `def low_confidence(toks, thr=0.85):
    return [t for t in toks if t["c"] < thr]

toks = [{"t": "FACTURA", "c": 0.99}, {"t": "RUC", "c": 0.96}, {"t": "Total", "c": 0.98}, {"t": "20X", "c": 0.55}]
print("promedio", round(sum(t["c"] for t in toks) / len(toks), 2))
print("low_conf", low_confidence(toks))
`,
          output: `promedio 0.87
low_conf [{'t': '20X', 'c': 0.55}]`,
        },
        why: "Abstención por campo crítico es control de calidad: umbral didáctico 0.85, se encola sin inventar dígitos. El promedio de estos cuatro tokens es 0.87 y pasa el umbral, aunque el RUC esté a 0.55: promediar oculta el dígito débil y pinta un dashboard verde mentiroso. Nunca rellenes caracteres corruptos del OCR en el parser: el revisor HITL necesita el token débil listado, no un RUC «arreglado».",
        retrospective:
          "Low-conf se encola; no se inventa. El error clásico es promediar o «corregir» RUC a mano en el parser. Si puedes decir por qué 0.55 no se salva con 0.99, ya tienes el hábito de abstención. We Do: umbral 0.85, orden de lectura por bbox y gate min-conf.",
      },
      {
        demoId: "S24-T2-B-DEMO",
        subtopicId: "S24-T2-B",
        environment: "local",
        description: "Parsea pares clave–valor desde líneas “Clave: valor” con strip en ambos lados.",
        preamble:
          "Del OCR salen líneas «Clave: valor» que alimentan el schema. En esta demo parseas RUC y Total con `split(':', 1)` y strip, y saltas la cabecera FACTURA, que no tiene dos puntos. Observa el dict resultante: sin strip, el valor lleva espacio y falla la comparación con el golden y la normalización. No escribas; predice las claves y valores limpios.",
        code: {
          language: 'python',
          title: "demo.py",
          code: `def parse_kv(lines):
    kv = {}
    for ln in lines:
        if ":" not in ln:
            continue  # cabecera o texto corrido: sin dos puntos no hay par
        k, v = ln.split(":", 1)
        kv[k.strip()] = v.strip()
    return kv

print(parse_kv(["FACTURA", "RUC: 20123456789", "Total: 10"]))
`,
          output: `{'RUC': '20123456789', 'Total': '10'}`,
        },
        why: "El KV es la unidad mínima de evidencia textual antes del schema. `split(':', 1)` corta una sola vez (valores pueden traer «:»); una línea sin «:» se salta, porque el OCR siempre trae cabeceras y montos en letras. El strip en ambos lados evita el espacio residual que rompe golden y validación. Sin higiene de strings, el revisor no ve el fallo y la normalización de montos revienta en silencio.",
        retrospective:
          "Evidencia textual limpia es el puente al schema y al golden. El espacio residual es un bug silencioso: el revisor no lo ve y la normalización falla. We Do: strip en ambos lados, filas de datos sin header y bbox del *valor* para HITL.",
      },
      {
        demoId: "S24-T3-A-DEMO",
        subtopicId: "S24-T3-A",
        environment: "local",
        description: "Normaliza RUC a solo dígitos y valida longitud 11 (sin rellenar ceros).",
        preamble:
          "El schema del intake no acepta `20.123456789` crudo: limpia separadores y valida longitud 11. En esta demo ves el RUC limpio o `None`. Observa que no se inventan ceros si faltan dígitos y que una letra leída por el OCR no se borra. No escribas; predice el resultado para `20.123456789`, `20X123456789` y `2012345`.",
        code: {
          language: 'python',
          title: "demo.py",
          code: `import re

def normalize_ruc(s):
    if re.search(r"[A-Za-z]", s):
        return None  # letra = corrupción OCR: no se borra para cuadrar 11 dígitos
    d = re.sub(r"\\D", "", s)
    return d if len(d) == 11 else None

for raw in ("20.123456789", "20X123456789", "2012345"):
    print(raw, normalize_ruc(raw))
`,
          output: `20.123456789 20123456789
20X123456789 None
2012345 None`,
        },
        why: "Un schema canónico (solo dígitos, longitud fija) evita basura en validación y en el golden set. Si `len≠11` devuelves `None`, no un RUC inventado ni un pad de ceros. Una letra en medio (`20X…`) también da `None`: borrarla dejaría 11 dígitos plausibles que nadie leyó.",
        retrospective:
          "Sin letras, solo dígitos y longitud fija: ese es el contrato mínimo de RUC; inventar ceros o dígitos es el anti-patrón prohibido. We Do: limpiar parcial, fecha day-first PE y montos con el separador final como decimal.",
      },
      {
        demoId: "S24-T3-B-DEMO",
        subtopicId: "S24-T3-B",
        environment: "local",
        description: "Compara total vs. suma de líneas: auto si cuadra, needs_review si no (sin label de fraude).",
        preamble:
          "Cuando la suma de líneas no cuadra con el total, el intake no acusa fraude: encola revisión. En esta demo la comparación con tolerancia 0.01 devuelve `auto` para 150 vs. [100, 50], el mismo nombre que usa la teoría. Observa el contrato: status de calidad, no veredicto legal. No escribas; predice qué devolverías si las líneas sumaran 140.",
        code: {
          language: 'python',
          title: "demo.py",
          code: `def cross_field(total, lines, eps=0.01):
    # Misma tolerancia monetaria que la teoría (0.01)
    return "auto" if abs(sum(lines) - total) <= eps else "needs_review"

print(cross_field(150.0, [100.0, 50.0]))
`,
          output: `auto`,
        },
        why: "Tolerancia monetaria 0.01 cubre redondeo de soles; status `auto`/`needs_review` es control de calidad del intake. Nunca emitas `auto_fraud` desde un mismatch de OCR: el producto es la cola HITL con reasons, no un veredicto legal. Un total que no cuadra puede ser error de parsing, de preproceso o de captura — el humano decide.",
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
          "Antes de gastar CPU en OCR, el intake admite o rechaza por mime allowlist y tope de bytes (capa 1). En esta demo un PDF de 100 bytes pasa y uno sin tamaño declarado se rechaza. Observa: no es antivirus ni capa 2 de firmas mágicas. No escribas; predice el status `ok` y qué pasaría con un zip.",
        code: {
          language: 'python',
          title: "demo.py",
          code: `ALLOWED = {"application/pdf", "image/png", "image/jpeg"}

def accept_doc(meta, max_bytes=5_000_000):
    # Capa 1: mime declarado + tamaño. En prod: firmas mágicas (capa 2).
    if meta.get("mime") not in ALLOWED or "n_bytes" not in meta:
        return "reject"  # sin mime o sin tamaño: fail-closed
    return "reject" if meta["n_bytes"] > max_bytes else "ok"

print(accept_doc({"mime": "application/pdf", "n_bytes": 100}))
print(accept_doc({"mime": "application/pdf"}))
`,
          output: `ok
reject`,
        },
        why: "Allowlist pdf/png/jpeg y tope 5e6 (un archivo de exactamente 5e6 pasa; sin tamaño declarado, reject) protegen al worker OCR antes de gastar CPU en zip o binarios enormes. El mime del caller es spoofable en prod: capa 1 didáctica ≠ seguridad completa (capa 2 = firmas mágicas o antivirus).",
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
        title: "Marcar reescaneo bajo 200 DPI",
        preamble:
          "- **Contexto:** en el intake de boletas sintéticas de Lima, un escaneo a 96 DPI confunde «8» con «B» en el RUC.\n- **Meta:** decidir `rescan_needed = dpi < 200` con el DPI de la captura, para dos capturas.\n- **Éxito:** `96 True` y `300 False`, una por línea.\n- **Límites:** no subas el número con `max(dpi, 200)`: hace pasar el gate sin añadir detalle.",
        instruction:
          "1. Abre el starter: sube el número con `max(dpi, 200)` y el gate nunca pide reescaneo (bug).\n2. Borra esa línea: el DPI de la captura no se toca.\n3. Imprime el DPI y `dpi < 200` para cada captura.",
        hint: "dpi < 200",
        hints: [
          "El piso de calidad del lab es 200 DPI en la captura",
          "max(dpi, 200) cambia el número, no la imagen: el gate pasa y el 8 sigue ilegible",
          "Con 96, rescan_needed es True; con 300, False",
        ],
        edgeCases: ["upscaling no crea detalle real; captura sin dato de DPI → reescaneo"],
        tests: "Stdout exacto (2 líneas): `96 True` y `300 False`. El DPI no se modifica.",
        feedback:
          "Una captura a 96 DPI va a reescaneo; una a 300 pasa. Con `max(96, 200)` el gate dice que todo está bien y la tipografía pequeña llega rota al motor: la cola se llena de RUC ilegibles por un preflight que miente.",
        retrospective:
          "El piso de DPI se mide en la captura y es barato frente a volver a correr OCR. El error clásico es subir el número para pasar el gate. Siguiente (E2): marcar deskew solo cuando el sesgo lo exige.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# DEFECT: sube el número y el gate pasa sin reescaneo
for dpi in (96, 300):
    dpi = max(dpi, 200)
    print(dpi, dpi < 200)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `for dpi in (96, 300):
    print(dpi, dpi < 200)`,
          output: `96 True
300 False`,
        },
      },
      {
        id: "S24-T1-A-E2",
        subtopicId: "S24-T1-A",
        kind: "independent",
        title: "Flag deskew con umbral 0.5°",
        preamble:
          "- **Contexto:** el revisor del batch necesita saber si se aplicó (o debió aplicar) corrección de inclinación.\n- **Meta:** calcular `deskew_applied = abs(skew) >= 0.5` para sesgos sintéticos de 1.2°, -0.8° y 0.3°.\n- **Éxito:** `True`, `True` y `False`, uno por línea.\n- **Límites:** usa valor absoluto (sesgo negativo también cuenta); no inviertas el operador; umbral 0.5° es didáctico del lab, no norma ISO.",
        instruction:
          "1. Revisa el starter: `abs(skew) < 0.5` (operador invertido).\n2. Cambia a `>= 0.5`.\n3. Imprime solo el booleano de cada sesgo.\n4. No alteres los valores de la lista.",
        hint: "abs",
        hints: [
          "Usa valor absoluto: sesgo -1.2 también cuenta",
          "deskew_applied es True cuando |skew| >= 0.5",
          "El umbral 0.5° es didáctico del lab, no una norma ISO",
        ],
        edgeCases: ["umbral empírico"],
        tests: "Stdout exacto (3 líneas): `True`, `True`, `False`. -0.8 también marca deskew; 0.3 no.",
        feedback:
          "Con 1.2 y -0.8, `abs(skew) >= 0.5` es True; con 0.3 es False. El starter invertía el operador (`<` en vez de `>=`): un flag falso ensucia la auditoría del batch.",
        retrospective:
          "Deskew solo cuando el sesgo lo justifica; un flag falso ensucia la auditoría. Confundir `<` con `>=` es un bug silencioso de calidad. Luego (E3) unes DPI + deskew + crop en un solo contrato.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# DEFECT: umbral invertido
for skew in (1.2, -0.8, 0.3):
    print(abs(skew) < 0.5)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `for skew in (1.2, -0.8, 0.3):
    print(abs(skew) >= 0.5)`,
          output: `True
True
False`,
        },
      },
      {
        id: "S24-T1-A-E3",
        subtopicId: "S24-T1-A",
        kind: "transfer",
        title: "preprocess_meta: DPI, deskew y crop",
        preamble:
          "- **Contexto:** el document intake no llama tres scripts sueltos: necesita un dict de preproceso que el log y el test puedan auditar.\n- **Meta:** escribir `preprocess_meta(img, m=0.05)` que devuelva `rescan_needed`, `deskew_applied` y `crop_box`, y correrla sobre dos imágenes.\n- **Éxito:** `96 True True (50, 50, 950, 950)` y `300 False False (50, 50, 950, 950)`.\n- **Límites:** solo metadata (no inventes píxeles); no subas el DPI; no dejes crop (0,0,w,h).",
        instruction:
          "1. Lee el DEFECT: la función sube el DPI, no marca deskew y usa m=0.\n2. Calcula `rescan_needed` con `dpi < 200` y `deskew_applied` con `|skew| >= 0.5`.\n3. Arma crop `(int(m*w), int(m*h), int((1-m)*w), int((1-m)*h))`.\n4. Imprime dpi, rescan_needed, deskew_applied y crop_box para cada imagen.",
        hint: "dpi < 200 + abs skew + crop m",
        hints: [
          "rescan_needed = img['dpi'] < 200; deskew_applied si abs(skew) >= 0.5",
          "Tras deskew simulado, skew_deg queda 0.0 aunque el flag sea True",
          "crop: (int(m*w), int(m*h), int((1-m)*w), int((1-m)*h)) con m=0.05",
        ],
        edgeCases: ["no inventar píxeles; solo metadata"],
        tests: "Stdout exacto (2 líneas): `96 True True (50, 50, 950, 950)` y `300 False False (50, 50, 950, 950)`.",
        feedback:
          "La función une el gate de DPI, el deskew y el crop en un solo contrato auditable. Faltar el flag o el crop rompe el intake: el revisor no sabe qué se le hizo a la página.",
        retrospective:
          "Un contrato unificado de preproceso es lo que reutilizas en CP-N2-C. El error clásico es olvidar el crop o el flag y «arreglar» el DPI subiendo el número. Pregunta: ¿por qué el crop se registra aunque el lab no abra OpenCV?",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# DEFECT: sube el DPI, no marca deskew y recorta con m=0
def preprocess_meta(img, m=0.0):
    w, h = img["w"], img["h"]
    return {"dpi": max(img["dpi"], 200), "rescan_needed": False, "deskew_applied": False,
            "crop_box": (0, 0, w, h)}

for img in ({"w": 1000, "h": 1000, "dpi": 96, "skew_deg": 1.8},
            {"w": 1000, "h": 1000, "dpi": 300, "skew_deg": 0.2}):
    out = preprocess_meta(img)
    print(out["dpi"], out["rescan_needed"], out["deskew_applied"], out["crop_box"])
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `def preprocess_meta(img, m=0.05):
    w, h = img["w"], img["h"]
    return {
        "dpi": img["dpi"],
        "rescan_needed": img["dpi"] < 200,
        "deskew_applied": abs(img["skew_deg"]) >= 0.5,
        "crop_box": (int(m * w), int(m * h), int((1 - m) * w), int((1 - m) * h)),
    }

for img in ({"w": 1000, "h": 1000, "dpi": 96, "skew_deg": 1.8},
            {"w": 1000, "h": 1000, "dpi": 300, "skew_deg": 0.2}):
    out = preprocess_meta(img)
    print(out["dpi"], out["rescan_needed"], out["deskew_applied"], out["crop_box"])`,
          output: `96 True True (50, 50, 950, 950)
300 False False (50, 50, 950, 950)`,
        },
      },
      {
        id: "S24-T1-B-E1",
        subtopicId: "S24-T1-B",
        kind: "guided",
        title: "Rotación de mayor score (no min)",
        preamble:
          "- **Contexto:** el preflight de orientación del intake elige la rotación más probable antes del OCR.\n- **Meta:** devolver la *key* (grados) del score máximo.\n- **Éxito:** `90` para la primera página y `180` para la segunda (grados, no el score).\n- **Límites:** no uses `min`; no imprimas el score; imprime solo grados.",
        instruction:
          "1. Abre el starter: `min(s, key=s.get)` (bug).\n2. Cambia a `max(s, key=s.get)`.\n3. Imprime la key entera de cada página.\n4. Verifica mentalmente: 0.8 > 0.1 → 90°.",
        hint: "max key=",
        hints: [
          "max(s, key=s.get) devuelve la key del mayor score",
          "No uses min: eso elige la peor orientación",
          "Imprime el entero de grados (90), no el score",
        ],
        edgeCases: ["empate en el mejor score: el lab lo manda a manual_orient (E3)"],
        tests: "Stdout exacto (2 líneas): `90` y `180` (grados de rotación, no el score). No uses min().",
        feedback:
          "El score máximo está en 90°; `min()` era el defecto del starter y enviaría la peor rotación al motor, llenando HITL de basura en el batch nocturno.",
        retrospective:
          "La key del score máximo es la rotación candidata del preflight; el valor del score se usa después (umbral auto vs. manual). El error clásico es imprimir el score 0.8 en vez de los grados. Siguiente (E2): contar flags de ruido para el runbook, no el largo del vector.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# DEFECT: elige min score
for s in ({0: 0.1, 90: 0.8}, {0: 0.3, 90: 0.1, 180: 0.6}):
    print(min(s, key=s.get))
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `for s in ({0: 0.1, 90: 0.8}, {0: 0.3, 90: 0.1, 180: 0.6}):
    print(max(s, key=s.get))`,
          output: `90
180`,
        },
      },
      {
        id: "S24-T1-B-E2",
        subtopicId: "S24-T1-B",
        kind: "independent",
        title: "Contar flags de ruido (sum, no len)",
        preamble:
          "- **Contexto:** el runbook del batch registra cuántos píxeles sintéticos están marcados como ruido (1), no el largo del vector.\n- **Meta:** contar flags en 1 con `sum`.\n- **Éxito:** `2` con `[0,1,1,0]` y `0` con `[0,0,0]`.\n- **Límites:** no uses `len(flags)`; aquí solo auditas el flag (denoise real usaría mediana/morfología).",
        instruction:
          "1. Revisa el starter: imprime `len(flags)` (=4).\n2. Cambia a `sum(flags)`.\n3. Imprime solo el conteo.\n4. No mutes la lista.",
        hint: "sum",
        hints: [
          "sum(flags) cuenta los 1 (ruido marcado)",
          "len(flags) cuenta todos los píxeles, no el ruido",
          "Aquí solo auditas el flag; denoise real usaría filtros (mediana/morfología)",
        ],
        edgeCases: ["modelo real de denoise"],
        tests: "Stdout exacto (2 líneas): `2` y `0` (conteo de flags=1). No imprimas len(flags).",
        feedback:
          "Hay dos flags en 1 → `sum=2`. `len()` cuenta longitud (4), no ruido: confunde al runbook de preflight y al SLO de calidad de página.",
        retrospective:
          "El runbook necesita *cuántos* píxeles sintéticos están marcados, no cuántas celdas tiene el vector. Confundir longitud con calidad miente al preflight. Pregunta: si todos los flags fueran 0, ¿qué imprime `sum` y qué diría un `len`? Luego (E3): best + score + action.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# DEFECT: usa len no sum
for flags in ([0, 1, 1, 0], [0, 0, 0]):
    print(len(flags))
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `for flags in ([0, 1, 1, 0], [0, 0, 0]):
    print(sum(flags))`,
          output: `2
0`,
        },
      },
      {
        id: "S24-T1-B-E3",
        subtopicId: "S24-T1-B",
        kind: "transfer",
        title: "Preflight: rotación, score y action",
        preamble:
          "- **Contexto:** si el mejor score de orientación es bajo, el intake prefiere un humano que gire la página antes de quemar OCR.\n- **Meta:** elegir best + score; si score<0.5 o hay empate en el mejor score → `manual_orient`, si no `auto`.\n- **Éxito:** `180 0.7 auto` y `0 0.6 manual_orient` (empate entre 0° y 180°).\n- **Límites:** no uses min; no imprimas `ocr_now`; con score 0.7 aún rotas *antes* del motor.",
        instruction:
          "1. Corrige el DEFECT: `min` y action `ocr_now`.\n2. Quédate con la orientación de mayor score, y guarda también ese score.\n3. Decide la acción: por debajo de 0.5, o si otra rotación tiene el mismo score, hay que reorientar a mano; si no, va automático.\n4. Imprime best, score, action para cada página.",
        hint: "max key= + umbral 0.5",
        hints: [
          "best = max(scores, key=scores.get); score = scores[best]",
          "Empate: list(scores.values()).count(score) > 1; con empate o score < 0.5 → manual_orient",
          "Con 0.7 en 180° el lab acepta auto — aún así corrige rotación antes del OCR",
        ],
        edgeCases: ["página en blanco (todos los scores bajos); empate en el mejor score → manual_orient"],
        tests: "Stdout exacto (2 líneas): `180 0.7 auto` y `0 0.6 manual_orient`. Rotación, score y action (no ocr_now).",
        feedback:
          "El preflight elige 180° con score 0.7 → auto. Forzar OCR sin rotar o invertir el umbral rompe el layout y llena HITL de basura cara.",
        retrospective:
          "Fail-closed de calidad: score débil → humano, no auto-OCR. Forzar OCR sin rotar llena HITL de basura. Pregunta: ¿por qué «auto» aún exige rotar a 180° antes del motor?",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# DEFECT: elige min y fuerza OCR sin gate
pages = [{0: 0.1, 90: 0.05, 180: 0.7, 270: 0.15}, {0: 0.6, 90: 0.1, 180: 0.6, 270: 0.05}]
for scores in pages:
    best = min(scores, key=scores.get)
    print(best, scores[best], "ocr_now")
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `pages = [{0: 0.1, 90: 0.05, 180: 0.7, 270: 0.15}, {0: 0.6, 90: 0.1, 180: 0.6, 270: 0.05}]
for scores in pages:
    best = max(scores, key=scores.get)
    score = scores[best]
    tie = list(scores.values()).count(score) > 1
    action = "manual_orient" if score < 0.5 or tie else "auto"
    print(best, score, action)`,
          output: `180 0.7 auto
0 0.6 manual_orient`,
        },
      },
      {
        id: "S24-T2-A-E1",
        subtopicId: "S24-T2-A",
        kind: "guided",
        title: "Filtrar tokens con conf ≥ 0.85",
        preamble:
          "- **Contexto:** la autoaceptación del lab no debe tragar tokens con confidence floja.\n- **Meta:** quedarte solo con textos cuyo conf ≥ 0.85.\n- **Éxito:** `['A']` (B con 0.5 se filtra) y `['C', 'D']` en el segundo lote.\n- **Límites:** no uses umbral 0.5; no mutes las confidences; imprime lista de text.",
        instruction:
          "1. Abre el starter: filtro `>=0.5` (bug).\n2. Cambia el umbral a `0.85`.\n3. Imprime la list comprehension de `t['text']`.\n4. No alteres los dicts de tokens.",
        hint: "list comp",
        hints: [
          "Umbral de autoaceptación del lab: conf >= 0.85",
          "List comprehension sobre t['text']",
          "0.5 es demasiado bajo y deja pasar basura a auto",
        ],
        edgeCases: ["umbral por campo"],
        tests: "Stdout exacto (2 líneas): `['A']` y `['C', 'D']`. Solo tokens con conf>=0.85; 0.84 no pasa.",
        feedback:
          "Solo 'A' pasa el umbral 0.85; B con 0.5 se filtra. Umbral 0.5 deja pasar basura a autoaceptación y degrada el SLO de RUC en el batch.",
        retrospective:
          "Umbral bajo = basura en auto. 0.85 es el contrato didáctico del lab para autoaceptación de tokens. Siguiente (E2): ordenar por bbox, no por orden de llegada del motor.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# DEFECT: umbral 0.5 (demasiado bajo)
lotes = [
    [{'text': 'A', 'conf': 0.9}, {'text': 'B', 'conf': 0.5}],
    [{'text': 'C', 'conf': 0.85}, {'text': 'D', 'conf': 0.99}, {'text': 'E', 'conf': 0.84}],
]
for toks in lotes:
    print([t['text'] for t in toks if t['conf'] >= 0.5])
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `lotes = [
    [{'text': 'A', 'conf': 0.9}, {'text': 'B', 'conf': 0.5}],
    [{'text': 'C', 'conf': 0.85}, {'text': 'D', 'conf': 0.99}, {'text': 'E', 'conf': 0.84}],
]
for toks in lotes:
    print([t['text'] for t in toks if t['conf'] >= 0.85])`,
          output: `['A']
['C', 'D']`,
        },
      },
      {
        id: "S24-T2-A-E2",
        subtopicId: "S24-T2-A",
        kind: "independent",
        title: "Orden de lectura por bbox (y0, x0)",
        preamble:
          "- **Contexto:** el motor puede devolver tokens desordenados; concatenar a ciegas mezcla Total de la derecha con ítems de la izquierda.\n- **Meta:** ordenar por `(y0, x0)` e imprimir la lista de text.\n- **Éxito:** `['FACTURA', 'RUC', '20123456789', 'Total', '150.00']`.\n- **Límites:** no uses el orden de llegada; multi-columna real necesitaría col id — aquí una columna sintética.",
        instruction:
          "1. Revisa el starter: imprime en orden de lista (valor primero).\n2. Ordena con `sorted(..., key=lambda t: (t['bbox'][1], t['bbox'][0]))`.\n3. Imprime solo los text en ese orden.\n4. No mutes los bbox.",
        hint: "sorted key=(y0, x0)",
        hints: [
          "bbox = [x0, y0, x1, y1]; primero la fila (y0), luego la columna (x0)",
          "sorted(tokens, key=lambda t: (t['bbox'][1], t['bbox'][0]))",
          "Imprime solo los text en ese orden, no el dict completo",
        ],
        edgeCases: ["multi-columna real necesita col id; aquí una columna sintética"],
        tests: "Stdout exacto: `['FACTURA', 'RUC', '20123456789', 'Total', '150.00']`. Ordenar por (x0, y0) pone Total antes del RUC y falla.",
        feedback:
          "Sin ordenar por bbox mezclas cabecera y valor; FACTURA (y=10) va antes que RUC/valor (y=50). Si ordenas por (x0, y0), lees la columna izquierda entera (RUC, Total) antes que los valores. El orden del array del adapter no es narrativa de página.",
        retrospective:
          "Lectura = geometría de la página, no orden del array del adapter. Sin bbox, el parser inventa narrativa. Luego (E3): gate por min conf de campos críticos.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# DEFECT: imprime en orden de llegada (valor primero)
tokens = [
    {"text": "20123456789", "bbox": [60, 50, 200, 70]},
    {"text": "Total", "bbox": [10, 80, 50, 100]},
    {"text": "FACTURA", "bbox": [10, 10, 120, 40]},
    {"text": "150.00", "bbox": [60, 80, 130, 100]},
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
    {"text": "Total", "bbox": [10, 80, 50, 100]},
    {"text": "FACTURA", "bbox": [10, 10, 120, 40]},
    {"text": "150.00", "bbox": [60, 80, 130, 100]},
    {"text": "RUC", "bbox": [10, 50, 50, 70]},
]
ordered = sorted(tokens, key=lambda t: (t["bbox"][1], t["bbox"][0]))
print([t["text"] for t in ordered])`,
          output: `['FACTURA', 'RUC', '20123456789', 'Total', '150.00']`,
        },
      },
      {
        id: "S24-T2-A-E3",
        subtopicId: "S24-T2-A",
        kind: "transfer",
        title: "Gate por min conf y lista weak",
        preamble:
          "- **Contexto:** en CP-N2-C un total a 0.75 no se esconde detrás de un RUC a 0.9; el intake reporta el eslabón más débil.\n- **Meta:** calcular min conf, status review/auto y nombres weak bajo thr=0.8.\n- **Éxito:** `0.75 review ['total']` para el primer documento y `0.88 auto []` para el segundo.\n- **Límites:** no promedies confidences; no dejes weak vacío si m<thr.",
        instruction:
          "1. Elimina el promedio del starter.\n2. `m = min(f['conf'] for f in fields)`.\n3. status según m vs. thr; weak = nombres con conf<thr.\n4. Imprime m, status, weak para cada documento.",
        hint: "min + list comp de nombres débiles",
        hints: [
          "No promedies confidences: un campo débil tumba la autoaceptación",
          "m = min(f['conf'] for f in fields); weak = [f['name'] for f in fields if f['conf'] < thr]",
          "Orden de impresión: m, status, weak",
        ],
        edgeCases: ["no promedies a ciegas"],
        tests: "Stdout exacto (2 líneas): `0.75 review ['total']` y `0.88 auto []`. min conf + status + lista weak; no promedies.",
        feedback:
          "Si imprimiste 'auto' o weak vacío con min=0.75, estás ocultando el campo total débil: el dashboard verde miente al revisor HITL.",
        retrospective:
          "Min (o revisión campo a campo) protege críticos; el promedio miente. Pregunta: si subes thr, ¿qué pasa con coverage_auto y con acc_ruc? Puente a T2-B: evidencia KV con bbox.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# DEFECT: promedia y no lista weak
docs = [
    [{"name": "ruc", "conf": 0.9}, {"name": "total", "conf": 0.75}, {"name": "fecha", "conf": 0.95}],
    [{"name": "ruc", "conf": 0.88}, {"name": "total", "conf": 0.93}, {"name": "fecha", "conf": 0.9}],
]
thr = 0.8
for fields in docs:
    avg = sum(f["conf"] for f in fields) / len(fields)
    print(avg, "auto", [])
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `docs = [
    [{"name": "ruc", "conf": 0.9}, {"name": "total", "conf": 0.75}, {"name": "fecha", "conf": 0.95}],
    [{"name": "ruc", "conf": 0.88}, {"name": "total", "conf": 0.93}, {"name": "fecha", "conf": 0.9}],
]
thr = 0.8
for fields in docs:
    m = min(f["conf"] for f in fields)
    status = "review" if m < thr else "auto"
    weak = [f["name"] for f in fields if f["conf"] < thr]
    print(m, status, weak)`,
          output: `0.75 review ['total']
0.88 auto []`,
        },
      },
      {
        id: "S24-T2-B-E1",
        subtopicId: "S24-T2-B",
        kind: "guided",
        title: "Parse KV con strip en clave y valor",
        preamble:
          "- **Contexto:** una línea OCR `Total: 12.5` no debe dejar el valor con espacio inicial.\n- **Meta:** separar con `split(':', 1)`, strip e imprimir clave y valor.\n- **Éxito:** `Total 12.5` y `Hora 10:30` (sin espacio residual; el valor conserva sus propios dos puntos).\n- **Límites:** no omitas strip; corta solo en el primer `:`.",
        instruction:
          "1. Abre el starter: `print(k, v)` sin strip.\n2. Aplica `k.strip()` y `v.strip()`.\n3. Imprime k y v de cada línea.\n4. No rearmes la línea con `:` en la salida.",
        hint: "split once",
        hints: [
          "split(':', 1) corta solo en el primer dos puntos",
          "strip() en clave y valor quita espacios residuales",
          "print(k, v) con strip imprime 'Total 12.5'",
        ],
        edgeCases: ["múltiples dos puntos"],
        tests: "Stdout exacto (2 líneas): `Total 12.5` y `Hora 10:30`. Sin espacio residual; corta solo en el primer `:`.",
        feedback:
          "Sin strip, el valor lleva espacio inicial (` 12.5`) y falla normalización y golden: un bug silencioso de comparación de strings.",
        retrospective:
          "Strip en clave y valor es higiene de parser, no cosmética. El error clásico es comparar strings «a ojo» en el editor y no ver el espacio. Pregunta: ¿qué fallaría después si el valor quedara `' 12.5'` al hacer `float` o match de golden? Siguiente (E2): no contar el header de tabla como ítem.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# DEFECT: no strip
for s in ('Total: 12.5', 'Hora: 10:30'):
    k, v = s.split(':', 1)
    print(repr(k), repr(v))
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `for s in ('Total: 12.5', 'Hora: 10:30'):
    k, v = s.split(':', 1)
    print(k.strip(), v.strip())`,
          output: `Total 12.5
Hora 10:30`,
        },
      },
      {
        id: "S24-T2-B-E2",
        subtopicId: "S24-T2-B",
        kind: "independent",
        title: "Filas de datos sin contar el header",
        preamble:
          "- **Contexto:** en la validación `sum(líneas)≈total`, contar el header como ítem infla la suma y manda a revisión por error de parsing.\n- **Meta:** reportar filas de datos = `len(t)-1`.\n- **Éxito:** `1` con header + una fila y `3` con header + tres filas.\n- **Límites:** no cuentes la fila 0; no imprimas 2.",
        instruction:
          "1. Revisa el starter: `len(t)` incluye header.\n2. Cambia a `len(t)-1`.\n3. Imprime solo ese entero.\n4. No mutes la tabla.",
        hint: "len-1",
        hints: [
          "Fila 0 es header; datos = len(t) - 1",
          "No cuentes el header como ítem de factura",
          "Con una sola fila de datos el resultado es 1",
        ],
        edgeCases: ["tablas irregulares"],
        tests: "Stdout exacto (2 líneas): `1` y `3` (filas de datos = len-1). No cuentes el header.",
        feedback:
          "`len(t)` incluye header (2); el contrato pide solo filas de datos (1). Contar el header crea `total_mismatch` falsos en cross-field.",
        retrospective:
          "Header ≠ ítem de negocio: contarlo infla la suma y manda a revisión por error de *parsing*, no de factura. El hábito es `n_data_rows = len(table) - 1` antes de `sum(líneas)`. Luego (E3): fields con bbox del valor para que el humano resalte el dígito.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# DEFECT: cuenta header
for t in ([['H1', 'H2'], ['a', 'b']], [['Item', 'Monto'], ['A', '100'], ['B', '50'], ['C', '30']]):
    print(len(t))
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `for t in ([['H1', 'H2'], ['a', 'b']], [['Item', 'Monto'], ['A', '100'], ['B', '50'], ['C', '30']]):
    print(len(t) - 1)`,
          output: `1
3`,
        },
      },
      {
        id: "S24-T2-B-E3",
        subtopicId: "S24-T2-B",
        kind: "transfer",
        title: "Fields KV con bbox del valor",
        preamble:
          "- **Contexto:** en HITL el humano necesita el rectángulo del *número*, no solo el label «RUC» en negrita.\n- **Meta:** parsear líneas, adjuntar el bbox del **valor** (cada clave trae dos cajas: `label` y `value`) y listar tuplas ordenadas por name.\n- **Éxito:** `[('RUC', '20123456789', [60, 50, 200, 70]), ('Total', '150.00', [70, 80, 140, 100])]` y luego `sin_bbox ['Fecha']`.\n- **Límites:** no uses la caja del label; no inventes coords si falta la clave: anótala en `sin_bbox` y sigue.",
        instruction:
          "1. Lee el DEFECT: solo imprime valores strip.\n2. Por cada línea: split, strip; si `k` no está en `boxes`, añádela a `sin_bbox` y sigue.\n3. Si está, append `(k, v, boxes[k]['value'])`.\n4. Ordena por name e imprime la lista; luego imprime `sin_bbox`.",
        hint: "split + dict bbox del valor",
        hints: [
          "Guarda bbox del valor, no solo del label 'RUC'",
          "Tras parsear k,v con split(':',1), field = (k, v, boxes[k]['value'])",
          "sorted por name para salida estable y comparable",
        ],
        edgeCases: ["coords en px de página; clave sin caja → sin_bbox, sin KeyError que tumbe el lote"],
        tests: "Stdout exacto (2 líneas): la lista ordenada de (name, value, bbox del valor) con RUC y Total, y `sin_bbox ['Fecha']`. La caja del label falla.",
        feedback:
          "Evidencia = valor + bbox del valor. Sin bbox el revisor no resalta el dígito dudoso; omitir Total o desordenar falla el contrato de HITL.",
        retrospective:
          "Evidencia = valor + bbox + (luego) conf. Sin bbox el revisor no resalta. Pregunta: ¿qué se pierde si guardas solo el texto del label? Puente a T3: normalizar al schema PE.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# DEFECT: solo valores, sin bbox ni orden
lines = ["RUC: 20123456789", "Total: 150.00", "Fecha: 15/01/2026"]
boxes = {
    "RUC": {"label": [10, 50, 50, 70], "value": [60, 50, 200, 70]},
    "Total": {"label": [10, 80, 60, 100], "value": [70, 80, 140, 100]},
}
print([ln.split(":", 1)[1].strip() for ln in lines])
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `lines = ["RUC: 20123456789", "Total: 150.00", "Fecha: 15/01/2026"]
boxes = {
    "RUC": {"label": [10, 50, 50, 70], "value": [60, 50, 200, 70]},
    "Total": {"label": [10, 80, 60, 100], "value": [70, 80, 140, 100]},
}
fields, sin_bbox = [], []
for ln in lines:
    k, v = ln.split(":", 1)
    k, v = k.strip(), v.strip()
    if k not in boxes:
        sin_bbox.append(k)
        continue
    fields.append((k, v, boxes[k]["value"]))
print(sorted(fields, key=lambda t: t[0]))
print("sin_bbox", sin_bbox)`,
          output: `[('RUC', '20123456789', [60, 50, 200, 70]), ('Total', '150.00', [70, 80, 140, 100])]
sin_bbox ['Fecha']`,
        },
      },
      {
        id: "S24-T3-A-E1",
        subtopicId: "S24-T3-A",
        kind: "guided",
        title: "Limpiar no-dígitos del RUC parcial",
        preamble:
          "- **Contexto:** el OCR devuelve guiones y puntos en identificadores; el parser limpia antes del schema completo.\n- **Meta:** dejar solo dígitos con `re.sub(r'\\D', '', s)`.\n- **Éxito:** `20123` a partir de `20-123` y `20123456789` a partir de `20.123.456 789`.\n- **Límites:** aquí no validas longitud 11; no imprimas el string con guiones.",
        instruction:
          "1. Abre el starter: imprime `s` crudo.\n2. Aplica `re.sub(r'\\D', '', s)`.\n3. Imprime el string limpio.\n4. No añadas validación de len en este ejercicio.",
        hint: "re.sub",
        hints: [
          "re.sub(r'\\D', '', s) elimina no-dígitos",
          "Aquí no validas longitud 11; solo limpias",
          "No imprimas el string crudo con guiones",
        ],
        edgeCases: ["vacío tras norm"],
        tests: "Stdout exacto (2 líneas): `20123` y `20123456789` (solo dígitos). Sin validación de longitud 11 aquí.",
        feedback:
          "`20-123` → `20123` tras quitar no-dígitos. El guion no es dígito; dejarlo rompe el schema y el golden de RUC.",
        retrospective:
          "Separadores benignos se quitan; la validación de 11 dígitos viene después. Siguiente (E2): fechas de boleta PE day-first → ISO.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# DEFECT: no limpia no-dígitos
import re
for s in ('20-123', '20.123.456 789'):
    print(s)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import re
for s in ('20-123', '20.123.456 789'):
    print(re.sub(r'\\D', '', s))`,
          output: `20123
20123456789`,
        },
      },
      {
        id: "S24-T3-A-E2",
        subtopicId: "S24-T3-A",
        kind: "independent",
        title: "Fecha boleta PE a ISO (day-first)",
        preamble:
          "- **Contexto:** en boletas peruanas `15/01/2026` es día/mes/año. Con el formato US, `15/01/2026` falla (no hay mes 15) y `05/01/2026` da el 1 de mayo sin error.\n- **Meta:** parsear con `%d/%m/%Y` y emitir ISO `YYYY-MM-DD`.\n- **Éxito:** `2026-01-15` y `2026-01-05`.\n- **Límites:** no uses `%m/%d/%Y`; no hardcodees la cadena ISO.",
        instruction:
          "1. Revisa el starter: `strptime` con formato US (bug).\n2. Cambia a `%d/%m/%Y`.\n3. Encadena `.date().isoformat()`.\n4. Imprime solo la fecha ISO de cada boleta.",
        hint: "strptime %d/%m/%Y",
        hints: [
          "Boletas PE: día/mes/año → '%d/%m/%Y'",
          "Con %m/%d/%Y, 15/01/2026 falla; con 05/01/2026 da 2026-05-01 sin error: el día y el mes se cambian en silencio",
          "date().isoformat() produce YYYY-MM-DD",
        ],
        edgeCases: ["formatos mixtos"],
        tests: "Stdout exacto (2 líneas): `2026-01-15` y `2026-01-05`. Formato PE day-first `%d/%m/%Y`, no US.",
        feedback:
          "Con day-first, `15/01/2026` es `2026-01-15` y `05/01/2026` es `2026-01-05`. `%m/%d/%Y` falla con el 15 y, peor, convierte el 05 en mayo sin avisar: locale de fecha es contrato de schema.",
        retrospective:
          "Locale de fecha es contrato de schema, no detalle cosmético. Con el día 15 el bug US revienta; con el día 05 miente sin avisar. Luego (E3): RUC 11 + total PE en un solo paso.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# DEFECT: formato US
from datetime import datetime
for s in ('15/01/2026', '05/01/2026'):
    print(datetime.strptime(s, '%m/%d/%Y').date().isoformat())
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `from datetime import datetime
for s in ('15/01/2026', '05/01/2026'):
    print(datetime.strptime(s, '%d/%m/%Y').date().isoformat())`,
          output: `2026-01-15
2026-01-05`,
        },
      },
      {
        id: "S24-T3-A-E3",
        subtopicId: "S24-T3-A",
        kind: "transfer",
        title: "Schema PE: RUC 11 y total es-PE",
        preamble:
          "- **Contexto:** una factura peruana imprime `S/ 1,150.50`: coma de miles, punto decimal. El starter lee la coma como decimal y obtiene 1.1505.\n- **Meta:** normalizar RUC a 11 dígitos (o None) y el total con la regla de S16 (el separador final es el decimal; `1,150` es ambiguo).\n- **Éxito:** `20123456789 1150.5`, luego `None None`, luego `150.0 1,150 rechazado`.\n- **Límites:** no padees ceros en RUC; letras → None; un monto ambiguo lanza `ValueError`, no se adivina.",
        instruction:
          "1. Corrige el DEFECT: leer la coma como decimal en `S/ 1,150.50`.\n2. Implementa `norm_ruc` (letras→None; len==11).\n3. Implementa `norm_total`: quita `S/`; con coma y punto, el que aparece al final es el decimal; un separador con exactamente tres dígitos detrás lanza `ValueError`.\n4. Imprime las tres líneas del éxito.",
        hint: "re.sub dígitos + separador final",
        hints: [
          "RUC: re.sub(r'\\D', '', s); si len!=11 → None (no pad de ceros)",
          "Total: miles = '.' if s.rfind(',') > s.rfind('.') else ','; borra miles y cambia la coma que quede por punto",
          "re.fullmatch(r'\\d{1,3}[.,]\\d{3}', s) detecta 1,150: lanza ValueError y el documento va a revisión",
        ],
        edgeCases: ["None en RUC corto o con letra; 150,00 es decimal; 1,150 es ambiguo"],
        tests: "Stdout exacto (3 líneas): `20123456789 1150.5` / `None None` / `150.0 1,150 rechazado`. Leer la coma peruana como decimal o borrar letras del RUC falla.",
        feedback:
          "Leer la coma de `S/ 1,150.50` como decimal da 1.1505; borrar la coma de `150,00` da 15000.0. Los dos envenenan cross-field y golden sin avisar. RUC con puntos se limpia a 11 dígitos; letras embebidas o longitud corta → None.",
        retrospective:
          "El locale de los montos es gate de calidad del intake. Un monto ambiguo va a revisión: adivinar envenena cross-field y golden. Pregunta: ¿por qué `None` en RUC corrupto es mejor que 11 dígitos «plausibles»?",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# DEFECT: lee la coma como decimal (S/ 1,150.50 → 1.1505) y no valida el RUC
import re
raw = {"ruc": "20.123456789", "total": "S/ 1,150.50"}
ruc = re.sub(r"\\D", "", raw["ruc"])
total = float(raw["total"].replace("S/", "").strip().replace(".", "").replace(",", "."))
print(ruc, total)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import re
raw = {"ruc": "20.123456789", "total": "S/ 1,150.50"}

def norm_ruc(s):
    if re.search(r"[A-Za-z]", s):
        return None  # letra = corrupción OCR, no inventar RUC
    d = re.sub(r"\\D", "", s)
    return d if len(d) == 11 else None

def norm_total(s):
    s = s.replace("S/", "").replace("PEN", "").replace(" ", "")
    if "," in s and "." in s:
        miles = "." if s.rfind(",") > s.rfind(".") else ","
        s = s.replace(miles, "")
    elif re.fullmatch(r"\\d{1,3}[.,]\\d{3}", s):
        raise ValueError("monto ambiguo: " + s)
    return float(s.replace(",", "."))

print(norm_ruc(raw["ruc"]), norm_total(raw["total"]))
print(norm_ruc("20X123456789"), norm_ruc("2012345"))
try:
    norm_total("1,150")
except ValueError:
    print(norm_total("150,00"), "1,150 rechazado")`,
          output: `20123456789 1150.5
None None
150.0 1,150 rechazado`,
        },
      },
      {
        id: "S24-T3-B-E1",
        subtopicId: "S24-T3-B",
        kind: "guided",
        title: "Mismatch de total → needs_review",
        preamble:
          "- **Contexto:** 4+5=9 frente a total 10 es una discrepancia que el batch debe encolar, no autoaceptar.\n- **Meta:** comparar `abs(sum(lines)-total)` con umbral 0.01.\n- **Éxito:** `needs_review` para 4+5 frente a 10 y `auto` para 4+6.005 frente a 10.\n- **Límites:** nunca imprimas `fraud`; no fuerces siempre `auto`.",
        instruction:
          "1. Abre el starter: imprime `'auto'` fijo (bug).\n2. Calcula si la diferencia supera 0.01.\n3. Imprime `needs_review` o `auto` según el caso.\n4. Haz lo mismo con los dos documentos del starter.",
        hint: "abs(sum-total)",
        hints: [
          "4.0+5.0=9.0 ≠ 10.0 → discrepancia",
          "Tolerancia 0.01 cubre redondeo de moneda",
          "needs_review, no 'fraud'",
        ],
        edgeCases: ["redondeo moneda"],
        tests: "Stdout exacto (2 líneas): `needs_review` y `auto`. Una diferencia de 0.005 está dentro de la tolerancia; nunca imprimas fraud.",
        feedback:
          "Suma 9 vs. total 10 supera 0.01 → `needs_review`. Siempre `auto` era el anti-patrón del starter: la cola es el producto de calidad, no la acusación de fraude.",
        retrospective:
          "Autoaceptar siempre es el anti-patrón del starter: la cola es el producto de calidad del intake. Nunca imprimas `fraud` por un descuadre de 1.0. Pregunta: con diferencia 0.005, ¿auto o needs_review (eps=0.01)? Siguiente (E2): acumular reasons sin crashear el batch nocturno.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# DEFECT: siempre auto
for total, lines in ((10.0, [4.0, 5.0]), (10.0, [4.0, 6.005])):
    print('auto')
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `for total, lines in ((10.0, [4.0, 5.0]), (10.0, [4.0, 6.005])):
    print('needs_review' if abs(sum(lines) - total) > 0.01 else 'auto')`,
          output: `needs_review
auto`,
        },
      },
      {
        id: "S24-T3-B-E2",
        subtopicId: "S24-T3-B",
        kind: "independent",
        title: "Acumular reason ruc_missing",
        preamble:
          "- **Contexto:** el revisor necesita una lista de reasons, no un crash del worker nocturno.\n- **Meta:** si `ruc is None`, append `'ruc_missing'` e imprimir la lista.\n- **Éxito:** `['ruc_missing']` para el RUC ausente y `[]` para el presente.\n- **Límites:** no lances excepción; no dejes `[]` vacío; no inventes otros codes aquí.",
        instruction:
          "1. Revisa el starter: imprime `reasons` vacío.\n2. Añade el `if ruc is None: reasons.append(...)`.\n3. Imprime la lista.\n4. No uses `raise`.",
        hint: "append",
        hints: [
          "Acumula reasons; no lances excepción",
          "if ruc is None: reasons.append('ruc_missing')",
          "Varias reglas pueden empujar a la misma lista",
        ],
        edgeCases: ["múltiples reasons"],
        tests: "Stdout exacto (2 líneas): `['ruc_missing']` y `[]`. Acumula en lista; no lances excepción.",
        feedback:
          "RUC ausente debe dejar traza en `reasons[]` para el revisor HITL; lista vacía oculta el fallo y rompe el throughput del batch nocturno.",
        retrospective:
          "`reasons[]` es la traza auditable del documento para el revisor nocturno; un `raise` tumba el worker, una lista vacía miente. El hábito es acumular codes, no abortar el batch. Luego (E3): varias reglas + status + política explícita `review_not_fraud`.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# DEFECT: reasons vacío
for ruc in (None, "20123456789"):
    reasons = []
    print(reasons)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `for ruc in (None, "20123456789"):
    reasons = []
    if ruc is None:
        reasons.append('ruc_missing')
    print(reasons)`,
          output: `['ruc_missing']
[]`,
        },
      },
      {
        id: "S24-T3-B-E3",
        subtopicId: "S24-T3-B",
        kind: "transfer",
        title: "validate dual y política review_not_fraud",
        preamble:
          "- **Contexto:** CP-N2-C exige status + reasons por documento y una política escrita: revisión ≠ fraude.\n- **Meta:** implementar `validate` (total_mismatch, ruc_missing, ruc_low_conf / ruc_conf_missing) sobre d1, d2 y d3.\n- **Éxito:** cuatro líneas — `('auto', [])`, needs_review con tres reasons, `('needs_review', ['ruc_conf_missing'])` para d3 y `review_not_fraud`.\n- **Límites:** conf ausente no es 1.0; nunca imprimas fraud; acumula reasons.",
        instruction:
          "1. Reemplaza los `print(\"fraud\")`.\n2. Implementa `validate(doc)` con las reglas del lab.\n3. Evalúa d1 (cuadra), d2 (mismatch + ruc None + conf 0.5) y d3 (cuadra, pero sin `conf_ruc`).\n4. Imprime la política `review_not_fraud` al final.",
        hint: "reasons[] + status; dos docs",
        hints: [
          "Discrepancia contable y RUC ausente van a reasons — nunca label 'fraud'",
          "status = 'auto' if not reasons else 'needs_review'; conf ausente → ruc_conf_missing",
          "Tras los tres validate, imprime review_not_fraud (política de producto)",
        ],
        edgeCases: ["varias reasons; conf ausente; no raise"],
        tests: "Stdout exacto (4 líneas): ('auto', []), needs_review con 3 reasons, ('needs_review', ['ruc_conf_missing']) y review_not_fraud. Un default de 1.0 para conf_ruc da auto en d3 y falla.",
        feedback:
          "d1 cuadra → auto; d2 acumula total_mismatch + ruc_missing + ruc_low_conf → needs_review; d3 no trae confianza y no se asume 1.0 → ruc_conf_missing. Etiquetar fraud desde OCR es el anti-patrón prohibido del curso.",
        retrospective:
          "Acumular reasons y encolar es el contrato de producto. Etiquetar fraud desde OCR es el anti-patrón prohibido. Pregunta: ¿qué reason usas si falta `conf_ruc` del todo?",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# DEFECT: etiqueta fraud y no acumula reasons
d1 = {"total": 150.0, "lines": [100.0, 50.0], "ruc": "20123456789", "conf_ruc": 0.9}
d2 = {"total": 150.0, "lines": [100.0, 40.0], "ruc": None, "conf_ruc": 0.5}
d3 = {"total": 150.0, "lines": [100.0, 50.0], "ruc": "20123456789"}
for doc in (d1, d2, d3):
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
d3 = {"total": 150.0, "lines": [100.0, 50.0], "ruc": "20123456789"}
for doc in (d1, d2, d3):
    print(validate(doc))
print("review_not_fraud")`,
          output: `('auto', [])
('needs_review', ['total_mismatch', 'ruc_missing', 'ruc_low_conf'])
('needs_review', ['ruc_conf_missing'])
review_not_fraud`,
        },
      },
      {
        id: "S24-T4-A-E1",
        subtopicId: "S24-T4-A",
        kind: "guided",
        title: "Accuracy = correct / n (no error rate)",
        preamble:
          "- **Contexto:** el lab reporta exactitud de campo, no la tasa de error, para el dashboard de CP-N2-C.\n- **Meta:** imprimir `correct/n` como float.\n- **Éxito:** `0.75` con correct=3, n=4 y `0.4` con correct=2, n=5.\n- **Límites:** no uses `(n-correct)/n`; no hardcodees sin dividir.",
        instruction:
          "1. Abre el starter: imprime la tasa de error.\n2. Cambia a `correct / n`.\n3. Imprime el float de cada par.\n4. No alteres correct ni n.",
        hint: "división float",
        hints: [
          "accuracy = correct / n (no error rate)",
          "3/4 = 0.75 en float de Python 3",
          "n-correct/n es la tasa de error, no accuracy",
        ],
        edgeCases: ["n=0"],
        tests: "Stdout exacto (2 líneas): `0.75` y `0.4` (accuracy = correct/n). No la tasa de error (n-correct)/n.",
        feedback:
          "`correct/n = 0.75`. El starter calculaba la tasa de error (1 − acc): métrica distinta que miente al SLO si la reportas como accuracy.",
        retrospective:
          "Accuracy y error rate suman 1, pero el contrato del lab pide accuracy. Confundirlas miente al SLO. Siguiente (E2): medir por filas de RUC pred vs. true.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# DEFECT: usa n-correct
for correct, n in ((3, 4), (2, 5)):
    print((n - correct) / n)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `for correct, n in ((3, 4), (2, 5)):
    print(correct / n)`,
          output: `0.75
0.4`,
        },
      },
      {
        id: "S24-T4-A-E2",
        subtopicId: "S24-T4-A",
        kind: "independent",
        title: "Accuracy de RUC sobre filas del golden",
        preamble:
          "- **Contexto:** hardcodear 1.0 «porque el OCR se ve bien» miente al reporte de CP-N2-C.\n- **Meta:** fracción de filas con `ruc_pred == ruc_true`.\n- **Éxito:** `0.5` (1 de 2) y, tras añadir una fila que acierta, `0.667` (2 de 3, redondeado a 3 decimales).\n- **Límites:** no hardcodees 1.0; mide el golden del starter.",
        instruction:
          "1. Revisa el starter: `print(1.0)`.\n2. Cuenta coincidencias pred/true y divide por `len(rows)`.\n3. Imprime el float redondeado a 3 decimales para `rows` y para `rows + [extra]`.\n4. No mutes las filas.",
        hint: "Usa `sum` para contar las filas que cumplen la condición",
        hints: [
          "Compara ruc_pred == ruc_true por fila",
          "1 de 2 filas correctas → 0.5",
          "No hardcodees 1.0: mide el golden",
        ],
        edgeCases: ["campos missing"],
        tests: "Stdout exacto (2 líneas): `0.5` y `0.667`. Un valor fijo falla en la segunda línea.",
        feedback:
          "Una de dos filas acierta el RUC → field accuracy 0.5. Hardcodear 1.0 miente al dashboard de CP-N2-C y oculta fallos del campo caro.",
        retrospective:
          "La métrica se calcula sobre el golden, no se declara «porque el OCR se ve bien». Hardcodear 1.0 miente al reporte de CP-N2-C y oculta el RUC caro. Pregunta: si 1 de 2 filas falla, ¿qué float debes imprimir y qué dirías en el standup? Luego (E3): reportar `acc_ruc` *y* `coverage_auto` juntos.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# DEFECT: siempre 1.0
rows = [{'ruc_pred': '1', 'ruc_true': '1'}, {'ruc_pred': '2', 'ruc_true': '1'}]
extra = {'ruc_pred': '3', 'ruc_true': '3'}
for g in (rows, rows + [extra]):
    print(1.0)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `rows = [{'ruc_pred': '1', 'ruc_true': '1'}, {'ruc_pred': '2', 'ruc_true': '1'}]
extra = {'ruc_pred': '3', 'ruc_true': '3'}
for g in (rows, rows + [extra]):
    print(round(sum(1 for r in g if r['ruc_pred'] == r['ruc_true']) / len(g), 3))`,
          output: `0.5
0.667`,
        },
      },
      {
        id: "S24-T4-A-E3",
        subtopicId: "S24-T4-A",
        kind: "transfer",
        title: "Par acc_ruc y coverage_auto",
        preamble:
          "- **Contexto:** cobertura automática alta con RUC basura en auto es un dashboard verde mentiroso.\n- **Meta:** calcular acc_ruc sobre golden de 2 filas y coverage_auto = auto/(auto+review).\n- **Éxito:** `0.5 0.7` para el primer lote y `1.0 0.6` para el segundo.\n- **Límites:** no uses review rate; no hardcodees acc; no sustituyas accuracy por cobertura.",
        instruction:
          "1. Elimina el hardcode 1.0 y el `review/(auto+review)`.\n2. Mide acc_ruc con pred==true.\n3. Calcula la cobertura automática: qué proporción del total resolvió el sistema sin pasar por revisión.\n4. Imprime ambos floats para cada lote.",
        hint: "field_acc + auto/(auto+review)",
        hints: [
          "acc_ruc = sum(pred==true) / n sobre el golden",
          "coverage_auto = auto / (auto + review) — no la tasa de revisión",
          "Subir cobertura bajando umbral sin medir error de campo es anti-patrón",
        ],
        edgeCases: ["abstention es métrica de producto separada"],
        tests: "Stdout exacto (2 líneas): `0.5 0.7` y `1.0 0.6` (acc_ruc y coverage_auto). No uses review rate ni hardcodees acc.",
        feedback:
          "Accuracy de campo (0.5) y cobertura HITL (0.7) son métricas distintas; confundirlas oculta fallos de RUC aunque el dashboard se vea verde.",
        retrospective:
          "Accuracy de críticos y cobertura HITL son métricas hermanas, no intercambiables. Pregunta: si bajas el umbral de conf, ¿qué pasa con cada una? Puente a T4-B: gate hostil antes del motor.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# DEFECT: confunde cobertura automática con review rate y hardcodea acc
lotes = [
    ([{"ruc_pred": "20123456789", "ruc_true": "20123456789"},
      {"ruc_pred": "20123456780", "ruc_true": "20123456789"}], 7, 3),
    ([{"ruc_pred": "20123456789", "ruc_true": "20123456789"}], 3, 2),
]
for golden, auto, review in lotes:
    print(1.0, review / (auto + review))
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `lotes = [
    ([{"ruc_pred": "20123456789", "ruc_true": "20123456789"},
      {"ruc_pred": "20123456780", "ruc_true": "20123456789"}], 7, 3),
    ([{"ruc_pred": "20123456789", "ruc_true": "20123456789"}], 3, 2),
]
for golden, auto, review in lotes:
    acc_ruc = sum(1 for r in golden if r["ruc_pred"] == r["ruc_true"]) / len(golden)
    coverage_auto = auto / (auto + review)
    print(acc_ruc, coverage_auto)`,
          output: `0.5 0.7
1.0 0.6`,
        },
      },
      {
        id: "S24-T4-B-E1",
        subtopicId: "S24-T4-B",
        kind: "guided",
        title: "Rechazar mime zip en el gate",
        preamble:
          "- **Contexto:** un zip en el intake de facturas no debe llegar al worker OCR.\n- **Meta:** fail-closed si mime no está en {pdf, png, jpeg}.\n- **Éxito:** `reject` para el zip y `ok` para el PDF.\n- **Límites:** no confíes en la extensión del archivo; no inviertas las ramas ok/reject.",
        instruction:
          "1. Abre el starter: imprime `ok` cuando mime *no* está en allowed (bug).\n2. Invierte la lógica: `reject` si `mime not in allowed`.\n3. Imprime solo el status.\n4. No cambies el set allowed.",
        hint: "set membership",
        hints: [
          "zip no está en la allowlist del intake de facturas",
          "reject si mime not in allowed",
          "No confíes en la extensión del nombre de archivo",
        ],
        edgeCases: ["doble extensión"],
        tests: "Stdout exacto (2 líneas): `reject` y `ok`. zip no está en allowlist pdf/png/jpeg.",
        feedback:
          "`application/zip` se rechaza en el gate de admisión *antes* del motor OCR. Aceptar zip abre hostiles al worker y quema CPU del batch.",
        retrospective:
          "Fail-closed de admisión: si el mime no está en la allowlist, no hay OCR. El error clásico es invertir el ternario y «dejar pasar» lo desconocido. Pregunta: ¿por qué no basta con mirar `.zip` en el nombre? Siguiente (E2): tope de tamaño 5e6.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# DEFECT: ramas invertidas (acepta zip)
allowed = {'application/pdf', 'image/png', 'image/jpeg'}
for mime in ('application/zip', 'application/pdf'):
    print('ok' if mime not in allowed else 'reject')
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `allowed = {'application/pdf', 'image/png', 'image/jpeg'}
for mime in ('application/zip', 'application/pdf'):
    print('reject' if mime not in allowed else 'ok')`,
          output: `reject
ok`,
        },
      },
      {
        id: "S24-T4-B-E2",
        subtopicId: "S24-T4-B",
        kind: "independent",
        title: "Rechazar archivo sobre el tope 5e6",
        preamble:
          "- **Contexto:** 6_000_000 bytes superan el tope didáctico y amenazan al worker (DoS / zip-bomb).\n- **Meta:** imprimir `reject` si n supera 5_000_000.\n- **Éxito:** `reject` para 6_000_000 y `ok` para exactamente 5_000_000 (el tope se admite).\n- **Límites:** no inviertas ok/reject; no cambies el tope del lab.",
        instruction:
          "1. Revisa el starter: `ok` cuando n es grande (bug).\n2. Cambia a `reject` si `n_bytes > 5_000_000`.\n3. Imprime el status.\n4. No uses otro umbral.",
        hint: "n > 5_000_000 → reject",
        hints: [
          "Tope didáctico del lab: 5_000_000 bytes",
          "Si n supera el tope → reject",
          "El starter invierte ok/reject",
        ],
        edgeCases: ["streaming"],
        tests: "Stdout exacto (2 líneas): `reject` y `ok`. Con `>=` el archivo de exactamente 5_000_000 se rechaza y falla.",
        feedback:
          "6e6 > 5e6 → reject. Invertir el umbral abre la puerta a zip-bomb / DoS al worker OCR: capa 1 barata y obligatoria.",
        retrospective:
          "Size cap es capa 1 barata y obligatoria: 6e6 supera 5e6 → reject. Invertir el umbral abre abuso al worker. El hábito es fallar cerrado ante tamaño hostil, no «intentar OCR y ver». Luego (E3): mime + size + fallback `human_rescan`.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# DEFECT: umbral invertido
for n_bytes in (6_000_000, 5_000_000):
    print('ok' if n_bytes > 5_000_000 else 'reject')
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `for n_bytes in (6_000_000, 5_000_000):
    print('reject' if n_bytes > 5_000_000 else 'ok')`,
          output: `reject
ok`,
        },
      },
      {
        id: "S24-T4-B-E3",
        subtopicId: "S24-T4-B",
        kind: "transfer",
        title: "Gate mime/size y fallback human_rescan",
        preamble:
          "- **Contexto:** el intake aplica admisión antes del motor; si el OCR falla sobre un binario corrupto, cae a reescaneo humano.\n- **Meta:** zip→reject; pdf 9e6→reject; pdf 100k con ocr_fail→human_rescan.\n- **Éxito:** cuatro líneas `reject` / `reject` / `human_rescan` / `reject`.\n- **Límites:** no imprimas `continue`; no reintentes OCR en bucle; orden mime → size → fallback.",
        instruction:
          "1. Reemplaza el loop que imprime `continue`.\n2. Si mime no allowed → reject.\n3. Elif n_bytes > MAX_BYTES → reject.\n4. Elif status_ocr == ocr_fail → human_rescan; else ok.",
        hint: "allowlist + size + mapa fallback",
        hints: [
          "Primero gate mime/size; solo si pasa el gate aplica fallback de OCR",
          "ocr_fail → human_rescan (no reintentar 100 veces el mismo binario)",
          "El cuarto caso es un zip con ocr_fail: el gate lo rechaza antes de mirar el OCR",
        ],
        edgeCases: ["no LLM sin evidencia; fail-closed en mime"],
        tests: "Stdout exacto (4 líneas): `reject` / `reject` / `human_rescan` / `reject`. Mirar ocr_fail antes que el mime manda el zip a human_rescan y falla.",
        feedback:
          "Hostiles se rechazan en admisión; ocr_fail cae a human_rescan. `continue` en fail quema CPU y no resuelve un PDF roto.",
        retrospective:
          "Hostiles se cortan en admisión; ocr_fail no se castiga con reintentos infinitos. Pregunta: ¿por qué human_rescan es mejor que «seguir el batch a ciegas»? Puente al You Do: el starter ya trae `gate_file` armado.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# DEFECT: acepta zip y reintenta OCR
ALLOWED = {"application/pdf", "image/png", "image/jpeg"}
MAX_BYTES = 5_000_000
cases = [
    {"mime": "application/zip", "n_bytes": 10, "status_ocr": "ok"},
    {"mime": "application/pdf", "n_bytes": 9_000_000, "status_ocr": "ok"},
    {"mime": "application/pdf", "n_bytes": 100_000, "status_ocr": "ocr_fail"},
    {"mime": "application/zip", "n_bytes": 10, "status_ocr": "ocr_fail"},
]
for c in cases:
    print("continue")
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `ALLOWED = {"application/pdf", "image/png", "image/jpeg"}
MAX_BYTES = 5_000_000
cases = [
    {"mime": "application/zip", "n_bytes": 10, "status_ocr": "ok"},
    {"mime": "application/pdf", "n_bytes": 9_000_000, "status_ocr": "ok"},
    {"mime": "application/pdf", "n_bytes": 100_000, "status_ocr": "ocr_fail"},
    {"mime": "application/zip", "n_bytes": 10, "status_ocr": "ocr_fail"},
]
for c in cases:
    if c["mime"] not in ALLOWED:
        print("reject")
    elif c["n_bytes"] > MAX_BYTES:
        print("reject")
    elif c["status_ocr"] == "ocr_fail":
        print("human_rescan")
    else:
        print("ok")`,
          output: `reject
reject
human_rescan
reject`,
        },
      },
    ],
  },
  youDo: {
    title: "Intake OCR sintético (document intake CP-N2-C)",
    context:
      "Cierra el arco S23→S24: el artefacto descargado (meta de imagen + tokens OCR simulados) entra al **document intake** de CP-N2-C. Procesa los 3 “documentos” sintéticos del starter siguiendo estos pasos:\n\n1. Preproceso de la meta de imagen.\n2. Extracción KV con bbox del valor.\n3. Normalización a schema `invoice.v1` (RUC 11 dígitos, montos con la regla es-PE de S16, fecha ISO).\n4. Validación cross-field (conf ausente → revisión).\n5. Métricas por campo y cola de revisión: los `*_pred` del golden salen de tu pipeline, no se escriben a mano.\n\nSin PII real; sin label de fraude. Criterio de aceptación: un script o notebook que, al correr, imprima status y `reasons[]` por doc, más `acc_ruc` / `acc_total` / `coverage_auto` sobre el golden de los 3 documentos.",
    objectives: [
      "Pipeline preproceso → OCR simulado → schema (campos ruc, total, fecha) con schema_version",
      "Abstener campos low-conf (umbral por campo crítico, p. ej. RUC < 0.85 → review); conf ausente no es 1.0",
      "Golden de los 3 docs con accuracy por campo (ruc y total) y coverage_auto, con predicciones que salen del pipeline",
      "Gate de admisión capa 1 (mime allowlist + size cap) antes del motor; ocr_fail → human_rescan",
    ],
    requirements: [
      "Datos 100% sintéticos (facturas demo, IDs fake); no PDFs reales de clientes",
      "bbox del valor obligatorio en el dict de cada campo crítico: el starter trae un token para el label y otro para el valor; guarda la caja del valor",
      "needs_review ≠ fraude (política explícita en log o comentario de módulo)",
      "norm_total con la regla es-PE de S16: \"S/ 1,150.50\" → 1150.5, \"150,00\" → 150.0 y \"1,150\" → ValueError (reason total_unparsed)",
      "norm_ruc: letras embebidas → None (no borrar corrupción OCR para inventar 11 dígitos)",
      "validate: conf_ruc ausente → ruc_conf_missing (no default 1.0)",
      "norm_fecha day-first (`%d/%m/%Y`) → ISO o None, y `schema_version` = \"invoice.v1\" en la salida de cada documento",
      "es-PE en labels de UI/log",
      "Funciones puras testeables: al menos preprocess, parse_kv, norm_ruc, norm_total, norm_fecha, validate, field_acc",
      "README breve: cómo correr, fixtures usados, métricas obtenidas (acc_ruc, acc_total, coverage_auto)",
    ],
    starterCode: `"""Document intake CP-N2-C — esqueleto sintético.
Completa preprocess, parse_kv, norm_ruc, norm_total, norm_fecha, validate y field_acc.
Política: needs_review ≠ fraude; solo fixtures sintéticos.
"""
import re
from datetime import datetime

SCHEMA_VERSION = "invoice.v1"

# Tres documentos sintéticos (simulan los artefactos descargados en S23).
# Cada token es un label o un valor, con su propia caja [x0, y0, x1, y1].
docs = [
    {"id": "d1", "img": {"w": 1000, "h": 1400, "dpi": 300, "skew_deg": 1.5},
     "tokens": [
         {"text": "RUC:", "conf": 0.97, "bbox": [10, 50, 60, 70]},
         {"text": "20123456789", "conf": 0.9, "bbox": [70, 50, 200, 70]},
         {"text": "Total:", "conf": 0.96, "bbox": [10, 80, 70, 100]},
         {"text": "S/ 1,150.50", "conf": 0.88, "bbox": [80, 80, 190, 100]},
         {"text": "Fecha:", "conf": 0.95, "bbox": [10, 110, 70, 130]},
         {"text": "15/01/2026", "conf": 0.92, "bbox": [80, 110, 180, 130]},
     ],
     "lines": [1000.0, 150.5]},
    {"id": "d2", "img": {"w": 1000, "h": 1400, "dpi": 96, "skew_deg": 0.2},
     "tokens": [
         {"text": "RUC:", "conf": 0.95, "bbox": [10, 50, 60, 70]},
         {"text": "2012X456789", "conf": 0.55, "bbox": [70, 50, 200, 70]},
         {"text": "Total:", "conf": 0.94, "bbox": [10, 80, 70, 100]},
         {"text": "150,00", "conf": 0.9, "bbox": [80, 80, 150, 100]},
         {"text": "Fecha:", "conf": 0.93, "bbox": [10, 110, 70, 130]},
         {"text": "05/01/2026", "conf": 0.91, "bbox": [80, 110, 180, 130]},
     ],
     "lines": [100.0, 40.0]},
    {"id": "d3", "img": {"w": 1000, "h": 1400, "dpi": 200, "skew_deg": 0.0},
     "tokens": [
         {"text": "RUC:", "conf": 0.96, "bbox": [10, 50, 60, 70]},
         {"text": "20123456789", "bbox": [70, 50, 200, 70]},  # el adapter no dio conf
         {"text": "Total:", "conf": 0.95, "bbox": [10, 80, 70, 100]},
         {"text": "1,150", "conf": 0.9, "bbox": [80, 80, 140, 100]},
         {"text": "Fecha:", "conf": 0.9, "bbox": [10, 110, 70, 130]},
         {"text": "20/01/2026", "conf": 0.9, "bbox": [80, 110, 180, 130]},
     ],
     "lines": [1150.0]},
]

# Verdad etiquetada a mano. Los *_pred no van aquí: salen de tu pipeline.
truth = {
    "d1": {"ruc_true": "20123456789", "total_true": 1150.5},
    "d2": {"ruc_true": "20123456789", "total_true": 150.0},
    "d3": {"ruc_true": "20123456789", "total_true": 1150.0},
}

def preprocess(meta):
    # Completa: rescan_needed si dpi < 200 (no subas el número); deskew_applied si |skew| >= 0.5
    return meta

def parse_kv(toks):
    # Completa: un label "Clave:" seguido de su token valor ->
    # {"ruc": {"value": ..., "conf": ..., "bbox": caja del VALOR}, ...}
    return {}

def norm_ruc(s):
    # Completa: letras → None; separadores OK; len == 11 o None (sin pad)
    return s

def norm_total(s):
    # Completa: regla de S16 (el separador final es el decimal; 1,150 → ValueError)
    return float(s) if s else None

def norm_fecha(s):
    # Completa: "%d/%m/%Y" → "YYYY-MM-DD"; si no parsea, None
    return s

def validate(doc):
    # Completa: total_mismatch / total_unparsed / ruc_missing / ruc_low_conf / ruc_conf_missing
    return "needs_review", ["not_implemented"]

def field_acc(rows, field):
    # Completa: correct/n sobre {field}_pred == {field}_true
    return 0.0

# Gate hostil capa 1: sin mime/tamaño, zip o size > 5e6 -> reject (mime spoofable en prod)
def gate_file(meta):
    allowed = {"application/pdf", "image/png", "image/jpeg"}
    if meta.get("mime") not in allowed:
        return "reject", "mime"
    if "n_bytes" not in meta:
        return "reject", "size_missing"
    if meta["n_bytes"] > 5_000_000:
        return "reject", "size"
    return "ok", "pass"

print("intake_ready", SCHEMA_VERSION, len(docs), "docs")
print("gate", gate_file({"mime": "image/png", "n_bytes": 12_000}))
# Al terminar: imprime status/reasons por doc, acc_ruc, acc_total, coverage_auto
`,
    portfolioNote:
      "Módulo document intake CP-N2-C con golden y política de abstención. Ideal para demostrar evidencia por campo y cola HITL en entrevistas de backoffice/ops data.",
    rubric: [
      { criterion: "Pipeline completo: preproceso → OCR simulado → schema → validación → métricas por campo", weight: "25%" },
      { criterion: "Correctitud de normalización (RUC 11 dígitos sin inventar, montos es-PE, fecha ISO, schema_version) y validación fail-closed", weight: "20%" },
      { criterion: "Privacidad / sin PII real / sin secretos / sin inferencia de fraude", weight: "20%" },
      { criterion: "Casos de borde: low-conf, conf ausente, discrepancia contable, mime/size reject, documentados", weight: "15%" },
      { criterion: "Código legible, funciones puras y límites claros (real vs. fake adapter)", weight: "10%" },
      { criterion: "Documentación en español profesional (README + métricas reportadas)", weight: "10%" },
    ],
    retrospective:
      "Antes de marcar listo: (1) ¿qué invariante demuestras con un print o test (p. ej. `S/ 1,150.50`→1150.5, `1,150`→revisión y RUC con letra→None)? (2) ¿qué harías distinto con PDFs reales de clientes vs. fixtures sintéticos (PII, minimización, gate)? (3) Escribe en el README una frase de impacto medible (p. ej. «acc_ruc X, coverage_auto Y, N docs en needs_review sin label de fraude») que puedas defender en 30 segundos en entrevista de backoffice/ops data.",
  },
  selfCheck: {
    questions: [
      {
        question: "¿Qué haces si confidence de RUC es 0.6 (umbral lab 0.85)?",
        options: ["Reintentar el OCR a mayor resolución y aceptar el segundo valor", "Aceptar el valor y marcarlo como baja confianza en el reporte", "Bajar el umbral a 0.6 si la mayoría de documentos queda debajo", "No aceptar el RUC y encolar el documento con la reason ruc_low_conf"],
        correctIndex: 3,
        explanation:
          "Abstención bajo umbral es control de calidad: el campo crítico va a la cola de revisión con la reason ruc_low_conf. Reintentar y aceptar lo que salga, aceptar con una marca o bajar el umbral dejan pasar un RUC que nadie confirmó. No se inventan dígitos ni se etiqueta fraude por score bajo.",
      },
      {
        question: "¿Qué implica una discrepancia entre el total y la suma de líneas en la validación cross-field?",
        options: ["Corregir el total con la suma de líneas, que es el dato granular", "Encolar el documento en needs_review con reason total_mismatch", "Aceptarlo si la diferencia es menor al 1 % del total", "Recalcular el IGV, que suele ser el origen del descuadre"],
        correctIndex: 1,
        explanation:
          "Validación ≠ acusación de fraude. El pipeline solo acumula reasons[] (p. ej. total_mismatch) y deja status=needs_review: corregir el total, aceptar por un porcentaje o recalcular el IGV lo decide una persona con la evidencia, no el código.",
      },
      {
        question: "¿Por qué medir accuracy por campo (p. ej. acc_ruc) y no solo un accuracy global?",
        options: ["El accuracy global no se puede calcular si falta algún campo", "Todos los campos comparten el umbral, por eso basta el global", "Los campos críticos pueden fallar aunque el global se vea bien", "El promedio por campo siempre queda por encima del global"],
        correctIndex: 2,
        explanation:
          "Campos caros (RUC, total) necesitan SLO propio; un accuracy global o una coverage_auto alta los disimula. Con 9 campos fáciles bien leídos y un RUC errado en cada documento, el global da 0.9 y acc_ruc da 0.0: solo la medida por campo muestra el fallo caro.",
      },
      {
        question: "Un archivo application/zip llega al intake de facturas. ¿Qué hace el gate de admisión?",
        options: ["Gate reject/review por mime no permitido", "Descomprimirlo y procesar cada factura que contenga dentro", "Aceptarlo si el nombre del archivo termina en .pdf", "Convertirlo a PDF antes de pasarlo al OCR"],
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
