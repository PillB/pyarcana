import type { CourseSection } from '../../types'

export const section13: CourseSection = {
  id: 'rpa-automation',
  index: 13,
  title: 'RPA & Automatización con IA',
  shortTitle: 'RPA & Automatización',
  tagline:
    'Playwright, Ollama, OCR, Prefect — automatiza tareas multi-modales con IA local',
  estimatedHours: 14,
  level: 'Avanzado',
  icon: 'Bot',
  accentColor: 'bg-gradient-to-br from-rose-500 to-pink-600',
  jobRelevance:
    'La automatización es el skill #1 que busca el mercado peruano 2025-2026 según análisis de LinkedIn: el rol "Automation Architect" aparece explícitamente en publicaciones de Interbank, BBVA, Mercado Libre, Credicorp, Falabella y矿 Backus. Las empresas ya no quieren un Data Scientist que solo entrena modelos — quieren alguien que pueda tomar un proceso manual repetitivo (conciliar facturas, scrapear precios de la competencia, generar reportes semanales, transcribir audios de reuniones) y convertirlo en un bot que corre solo. Esta sección cubre el stack 2025-2026: Playwright (browser automation moderno), Ollama (LLM local gratis y privado), pytesseract + OpenCV (OCR para facturas PDF), Whisper (audio → texto), Prefect (orquestación con @task/@flow), y GitHub Actions (scheduling gratis para tu portafolio). Quien domina esta sección puede automatizar 80% de las tareas manuales de un equipo de operaciones o contabilidad — y eso vale 50-80% más en salario que un Data Scientist sin skills de automation.',
  learningOutcomes: [
    { text: 'Seleccionar entre Python-RPA, UiPath y Power Automate con una matriz de decisión clara' },
    { text: 'Automatizar browsers con Playwright: headless, selectors, login flows, screenshots' },
    { text: 'Automatizar desktop y archivos con pyautogui, pathlib y watchdog (folder triggers)' },
    { text: 'Extraer texto de PDFs y imágenes con pdfplumber + pytesseract + OpenCV preprocessing' },
    { text: 'Integrar IA local con Ollama y cloud con OpenAI API structured outputs (pydantic)' },
    { text: 'Transcribir audio con Whisper y clasificar texto con Hugging Face transformers' },
    { text: 'Orquestar pipelines con Prefect @task/@flow, tenacity retries y GitHub Actions cron' },
  ],
  theory: [
    {
      heading: 'RPA landscape & tool selection — Python vs UiPath vs Power Automate',
      paragraphs: [
        'El término RPA (Robotic Process Automation) se popularizó con herramientas enterprise como UiPath, Blue Prism y Power Automate. Estas son low-code/no-code: arrastras boxes en un diseñador visual y construyes un bot sin escribir código. Suena bien para managers, pero tiene 3 problemas serios: (1) licencias caras (UiPath cobra $420-$1,500 por bot/mes, Power Automate Premium $15-$100/usuario/mes), (2) vendor lock-in total — tus bots viven en su plataforma y no puedes migrar, (3) poca flexibilidad para integrar IA moderna (modelos custom, pipelines de ML, scraping complejo). En 2025-2026, la tendencia es clara: equipos técnicos eligen Python porque es más poderoso, más barato, y más mantenible que cualquier plataforma no-code.',
        'En cambio, Python-RPA tiene 3 ventajas decisivas: (1) es 100% gratis y open-source — pagas solo el servidor cloud donde corres el bot, no licencias por bot; (2) se integra naturalmente con TODO el ecosistema de data science (pandas, scikit-learn, Ollama, OpenAI) — un bot Python puede llamar un modelo ML en 3 líneas, un bot UiPath necesita "activities" específicas que no existen para casos custom; (3) es versionable con git, testeable con pytest, y code-reviewable como cualquier código de producción — los bots UiPath son XML binarios imposibles de diff o revisar. La regla empírica: si la automatización es simple (mover archivos, llenar formularios básicos), UiPath/Power Automate bastan; si necesita lógica de negocio, IA, scraping complejo o integración con data, Python gana por goleada.',
        'El consenso en r/rpa y foros enterprise 2025-2026 es: UiPath/Power Automate ganan para equipos no-técnicos y procesos enterprise muy estándar (SAP, Oracle, Excel pesado). Python gana para equipos de data/ingeniería que ya saben programar, necesitan flexibilidad, o quieren integrar IA. En Perú, los bancos grandes (BCP, Interbank, BBVA) usan UiPath internamente pero sus equipos de data science usan Python para cosas más avanzadas. Para tu portafolio y carrera, aprende Python-RPA: es transferible, gratis, y abre más puertas. Mencionar UiPath/Power Automate en entrevistas es un plus, pero dominar Python-RPA te hace más empleable. La decisión es estratégica: Python-RPA te da control total, IA integrada y cero costo de licencia.',
      ],
      code: {
        language: 'python',
        title: 'tool_selection.py',
        code: `# === Matriz de decisión: Python-RPA vs UiPath vs Power Automate ===
# Criterios clave para elegir la herramienta correcta

DECISION_MATRIX = {
    "Python-RPA": {
        "costo": "Gratis (solo servidor cloud)",
        "curva_aprendizaje": "Media (requiere saber Python)",
        "flexibilidad": "Total — cualquier librería, cualquier API",
        "ia_integrada": "Excelente (Ollama, OpenAI, transformers nativos)",
        "versionable": "Sí (git, code review, tests)",
        "ideal_para": "Equipos técnicos, data science, scraping complejo, IA",
        "librerias": ["Playwright", "pyautogui", "rpaframework", "pdfplumber",
                      "pytesseract", "prefect", "tenacity"],
    },
    "UiPath": {
        "costo": "$420-$1500/bot/mes (caro)",
        "curva_aprendizaje": "Baja (visual drag-and-drop)",
        "flexibilidad": "Limitada a activities disponibles",
        "ia_integrada": "Media (via UiPath AI Center, costoso)",
        "versionable": "No (XML binario, difícil de diff)",
        "ideal_para": "Equipos no-técnicos, SAP/Oracle, Excel pesado",
        "librerias": ["Activities", "Orchestrator", "AI Center"],
    },
    "Power Automate": {
        "costo": "$15-$100/usuario/mes (Premium)",
        "curva_aprendizaje": "Baja (integrado con Office 365)",
        "flexibilidad": "Limitada a connectors",
        "ia_integrada": "Media (AI Builder, costoso)",
        "versionable": "Parcial (solutions en Dataverse)",
        "ideal_para": "Empresas con Office 365, flujos simples con SharePoint/Excel",
        "librerias": ["Connectors", "AI Builder"],
    },
}

def elegir_herramienta(requisitos: dict) -> str:
    """Devuelve la herramienta recomendada basada en requisitos del proyecto."""
    if requisitos.get("equipo_tecnico") and (
        requisitos.get("necesita_ia") or requisitos.get("scraping_complejo")
    ):
        return "Python-RPA"  # casos típicos: data teams, IA, scraping
    if not requisitos.get("equipo_tecnico") and requisitos.get("sistema") == "SAP":
        return "UiPath"  # empresas tradicionales con SAP
    if requisitos.get("office_365") and requisitos.get("complejidad") == "baja":
        return "Power Automate"  # flujos simples con Office
    return "Python-RPA"  # default para equipos técnicos

# === Casos típicos en empresas peruanas ===
casos = [
    {"nombre": "Conciliar facturas SUNAT (PDF → DB)",
     "equipo_tecnico": True, "necesita_ia": True, "scraping_complejo": False},
    {"nombre": "Scrapear precios Mercado Libre diariamente",
     "equipo_tecnico": True, "necesita_ia": False, "scraping_complejo": True},
    {"nombre": "Mover archivos SAP a SharePoint",
     "equipo_tecnico": False, "sistema": "SAP"},
    {"nombre": "Reporte semanal desde Excel a email",
     "equipo_tecnico": False, "office_365": True, "complejidad": "baja"},
]
for caso in casos:
    nombre = caso.pop("nombre")
    print(f"{nombre}: {elegir_herramienta(caso)}")
# Conciliar facturas SUNAT (PDF → DB): Python-RPA
# Scrapear precios Mercado Libre diariamente: Python-RPA
# Mover archivos SAP a SharePoint: UiPath
# Reporte semanal desde Excel a email: Power Automate

# === Stack Python-RPA recomendado para 2025-2026 ===
# pip install playwright && playwright install  # browser automation moderno
# pip install pyautogui pillow                  # desktop automation
# pip install pdfplumber pytesseract            # PDF + OCR
# pip install opencv-python                     # preprocessing de imágenes
# pip install prefect                           # orquestación @task/@flow
# pip install tenacity                          # retries con backoff
# pip install ollama                            # LLM local gratis
# pip install openai pydantic                   # LLM cloud + structured outputs
# pip install python-dotenv                     # secrets en .env
# pip install openai-whisper                    # audio → texto (opcional)`,
      },
      callout: {
        type: 'info',
        title: 'Regla práctica: Python gana en 80% de casos técnicos',
        content:
          'Si tu equipo sabe programar o necesita IA, Python-RPA es casi siempre la mejor opción. UiPath/Power Automate tienen sentido solo para: (1) equipos no-técnicos (business analysts, contadores), (2) procesos estándar en SAP/Oracle donde UiPath tiene activities pre-built, (3) empresas con Office 365 que ya pagan Power Automate. Para todo lo demás (scraping, IA, data science, pipelines custom), Python gana por flexibilidad, costo cero y mantenibilidad.',
      },
    },
    {
      heading: 'Browser automation con Playwright — el Selenium moderno',
      paragraphs: [
        'Playwright es el sucesor espiritual de Selenium, desarrollado por Microsoft en 2020. Mejora a Selenium en TODO: (1) es 3-5x más rápido (arquitectura basada en DevTools protocol en vez de WebDriver), (2) auto-wait automático (no necesitas `WebDriverWait(...).until(...)` explícito — Playwright espera por defecto a que el elemento sea visible y clickable), (3) soporta Chromium, Firefox y WebKit con la misma API (Selenium requiere drivers separados), (4) network interception y mocking de APIs (para tests estables), (5) grabación de scripts con `playwright codegen` — abres un browser, haces click, y te genera el código Python. Para 2025-2026, Playwright es el estándar de facto para browser automation nuevo; Selenium queda como legacy.',
        'El flujo básico: `from playwright.sync_api import sync_playwright` → `with sync_playwright() as p: browser = p.chromium.launch(headless=True); page = browser.new_page(); page.goto("https://..."); page.click("#button"); page.fill("#input", "texto"); texto = page.text_content(".result")`. Los selectores pueden ser CSS (`page.click(".btn")`), texto (`page.click("text=Login")`), XPath (`page.click("xpath=//button[@id=\'x\']")`) o roles accesibles (`page.get_by_role("button", name="Submit")` — el más robusto). Para login flows: rellenas usuario/password, esperas la navegación con `page.wait_for_url("**/dashboard")`, y manejas 2FA si es necesario (Playwright puede interceptar SMS vía APIs como Twilio, o simplemente pausar para input manual).',
        'Para scraping masivo, Playwright brilla con `async_api` (corutinas para 10+ páginas en paralelo) y el modo stealth (evita detección básica con `playwright-stealth`). Casos reales peruanos: (1) scrapear precios de Mercado Libre/Falabella diariamente para construir un índice de inflación sectorial, (2) automatizar login a portal de SUNAT para descargar comprobantes electrónicos en lote, (3) llenar formularios web del MIMP o MINSA para registrar beneficiarios, (4) monitorear web de SBS para alertar cuando cambia la tasa de interés. Para todos estos, Playwright es 5-10x más rápido y estable que Selenium. IMPORTANTE: respeta ToS de los sitios y la Ley 29733 de Protección de Datos — no scrapees datos personales sin consentimiento.',
      ],
      code: {
        language: 'python',
        title: 'playwright_basics.py',
        code: `# Instalación:
#   pip install playwright
#   playwright install  # descarga browsers (~300MB)
from playwright.sync_api import sync_playwright, Page, expect
import time

def scrapear_productos_playwright(url: str) -> list[dict]:
    """Scrapea productos con Playwright — más rápido y estable que Selenium."""
    productos = []
    with sync_playwright() as p:
        # headless=True para producción (sin UI), False para debug visual
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # User-Agent real para evitar bloqueos básicos
        page.set_extra_http_headers({
            "Accept-Language": "es-PE,es;q=0.9",
        })

        page.goto(url, wait_until="domcontentloaded")

        # Auto-wait: Playwright espera automáticamente a que el selector aparezca
        # (no necesitas WebDriverWait explícito como en Selenium)
        page.wait_for_selector(".ui-search-layout__item", timeout=10000)

        items = page.query_selector_all(".ui-search-layout__item")
        for item in items:
            try:
                nombre = item.query_selector("h2").inner_text()
                precio_el = item.query_selector(".price-tag-fraction")
                precio = precio_el.inner_text() if precio_el else "N/A"
                productos.append({"nombre": nombre, "precio": precio})
            except Exception as e:
                print(f"Error en item: {e}")
                continue

        browser.close()
    return productos

# === Login flow con manejo de 2FA ===
def login_portal_sunat(usuario: str, password: str):
    """Login al portal SUNAT (ejemplo — ajusta selectores al portal real)."""
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)  # False para ver y manejar 2FA manual
        page = browser.new_page()
        page.goto("https://e-menu.sunat.gob.pe/")

        # Llenar form de login
        page.fill("[name=txtRuc]", usuario)
        page.fill("[name=txtUsuario]", usuario)
        page.fill("[name=txtClave]", password)
        page.click("[name=btnAceptar]")

        # Esperar navegación al dashboard
        page.wait_for_url("**/dashboard**", timeout=15000)
        print("Login exitoso!")

        # Aquí ya podemos navegar, descargar comprobantes, etc.
        page.screenshot(path="sunat_dashboard.png")  # evidencia visual
        browser.close()

# === Screenshot y PDF para evidencia ===
def capturar_pagina(url: str, output_dir: str = "captures"):
    """Captura screenshot + PDF de una página — útil para evidencia de auditoría."""
    from pathlib import Path
    Path(output_dir).mkdir(exist_ok=True)

    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={"width": 1920, "height": 1080})
        page.goto(url, wait_until="networkidle")  # esperar a que cargue TODO

        ts = time.strftime("%Y%m%d_%H%M%S")
        # Screenshot full page
        page.screenshot(path=f"{output_dir}/page_{ts}.png", full_page=True)
        # PDF (solo funciona en Chromium headless)
        page.pdf(path=f"{output_dir}/page_{ts}.pdf", format="A4")
        browser.close()
        print(f"Capturas guardadas en {output_dir}/")

# === Async API para scraping masivo (10+ páginas en paralelo) ===
async def scrapear_masivo(urls: list[str]) -> list[dict]:
    """Scrapea múltiples URLs en paralelo con async Playwright."""
    from playwright.async_api import async_playwright
    results = []
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        # Crear múltiples contextos para paralelismo real
        context = await browser.new_context()

        async def scrapear_una(url: str) -> dict:
            page = await context.new_page()
            await page.goto(url, wait_until="domcontentloaded")
            title = await page.title()
            await page.close()
            return {"url": url, "title": title}

        # asyncio.gather para correr todas en paralelo
        import asyncio
        tasks = [scrapear_una(url) for url in urls]
        results = await asyncio.gather(*tasks, return_exceptions=True)
        await browser.close()
    return results

# Ejecutar (requiere asyncio.run)
# import asyncio
# datos = asyncio.run(scrapear_masivo(["https://example.com"] * 10))`,
      },
      callout: {
        type: 'tip',
        title: 'playwright codegen — graba acciones y genera código',
        content:
          'Corre `playwright codegen https://example.com` en terminal. Abre un browser, haces clicks y rellenas formularios manualmente, y Playwright genera el código Python correspondiente en tiempo real. Es la forma más rápida de empezar: grabas el flujo una vez, lo guardas como script, y ya tienes tu bot base. Ahorra 80% del tiempo de desarrollo para flujos nuevos.',
      },
    },
    {
      heading: 'Desktop & file automation — pyautogui, pathlib y watchdog',
      paragraphs: [
        'No toda automatización es web. Muchas tareas en empresas peruanas involucran aplicaciones desktop (SAP GUI, Excel, sistemas internos de bancos) o manipulación masiva de archivos (renombrar 5000 PDFs, moverlos por categoría, generar reportes diarios). Para esto tienes 3 herramientas: (1) `pyautogui` para automatizar clicks y teclado en cualquier app desktop (Windows, Mac, Linux), (2) `pathlib` para operaciones masivas de archivos (renombrar, mover, filtrar por extensión), y (3) `watchdog` para monitorear una carpeta y disparar acciones cuando llegan archivos nuevos (ej: cada vez que llega una factura PDF, correr OCR).',
        '`pyautogui` controla el mouse y teclado del sistema operativo. Patrón básico: `pyautogui.click(x=500, y=300)`, `pyautogui.write("Hola")`, `pyautogui.press("enter")`, `pyautogui.hotkey("ctrl", "c")`. Para mayor robustez, usas `pyautogui.locateOnScreen("boton.png")` que busca una imagen en pantalla y hace click en ella — ideal cuando los elementos no tienen identificadores estables (apps legacy). CUIDADO: pyautogui mueve el mouse REAL del usuario, así que si corres un bot mientras alguien usa la PC, le mueves el cursor. Por eso los bots pyautogui se corren en servidores headless o VMs dedicadas. Para máxima seguridad, `pyautogui.FAILSAFE = True` mueve el mouse a una esquina para abortar.',
        '`watchdog` es el caballo de batalla para automatizaciones de carpeta. Caso real: el equipo de contabilidad de una empresa peruana recibe 200 facturas PDF por día en una carpeta compartida. Con watchdog, monitoreas esa carpeta: cada vez que llega un PDF nuevo, automáticamente lo pasas por OCR, extraes RUC+monto+fecha, validas contra el padrón SUNAT, y lo persistes en SQLite para conciliación. Sin watchdog, alguien tendría que hacerlo manualmente. `pathlib` complementa con operaciones masivas: `Path("facturas/").glob("*.pdf")` lista todos los PDFs, `Path.rename()` los mueve, `Path.stat().st_mtime` filtra por fecha. Combinados, watchdog + pathlib + OCR/LLM = bot de automatización documental completo.',
      ],
      code: {
        language: 'python',
        title: 'desktop_automation.py',
        code: `# === 1. pyautogui: automatizar apps desktop ===
import pyautogui
import time

# Configuración de seguridad
pyautogui.FAILSAFE = True  # mover mouse a esquina (0,0) aborta el script
pyautogui.PAUSE = 0.5      # pausa de 0.5s entre acciones (más estable)

def abrir_excel_y_abrir_archivo(ruta_archivo: str):
    """Abre Excel y abre un archivo específico (Windows/Mac/Linux)."""
    # Click en el ícono de Excel del escritorio (coordenadas dependen de tu screen)
    # Mejor: usar locateOnScreen para mayor robustez
    try:
        excel_icon = pyautogui.locateOnScreen("excel_icon.png", confidence=0.8)
        pyautogui.click(excel_icon)
    except pyautogui.ImageNotFoundException:
        # Fallback: abrir via línea de comandos
        import subprocess
        subprocess.Popen(["start", "excel", ruta_archivo], shell=True)
        return

    time.sleep(3)  # esperar a que abra Excel
    # Ctrl+O para abrir archivo
    pyautogui.hotkey("ctrl", "o")
    time.sleep(1)
    # Escribir la ruta del archivo
    pyautogui.write(ruta_archivo, interval=0.05)
    pyautogui.press("enter")

# === 2. pathlib: operaciones masivas de archivos ===
from pathlib import Path
import shutil

def organizar_facturas_por_mes(carpeta: str = "facturas/"):
    """Mueve facturas PDF a subcarpetas por mes según fecha de modificación."""
    carpeta = Path(carpeta)
    carpeta.mkdir(exist_ok=True)

    movidos = 0
    for pdf in carpeta.glob("*.pdf"):
        # Fecha de modificación del archivo
        mtime = pdf.stat().st_mtime
        fecha = time.localtime(mtime)
        mes_dir = carpeta / f"{fecha.tm_year}-{fecha.tm_mon:02d}"
        mes_dir.mkdir(exist_ok=True)

        destino = mes_dir / pdf.name
        shutil.move(str(pdf), str(destino))
        movidos += 1
        print(f"Movido: {pdf.name} → {mes_dir.name}/")

    print(f"\\nTotal movidos: {movidos}")
    return movidos

# === 3. watchdog: monitorear carpeta y disparar acciones ===
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

class FacturaHandler(FileSystemEventHandler):
    """Se dispara cuando llega un archivo nuevo a la carpeta monitoreada."""

    def on_created(self, event):
        if event.is_directory or not event.src_path.endswith(".pdf"):
            return
        print(f" Nueva factura detectada: {event.src_path}")
        # Aquí llamas a tu pipeline: OCR → LLM → DB
        procesar_factura_nueva(event.src_path)

def procesar_factura_nueva(pdf_path: str):
    """Stub: integra con pdfplumber + Ollama (siguientes bloques)."""
    print(f"  Procesando {pdf_path}...")
    # from ocr_module import extract_text
    # from llm_module import extract_fields
    # text = extract_text(pdf_path)
    # fields = extract_fields(text)
    # save_to_db(fields)
    print(f"  ✓ Listo: {pdf_path}")

def monitorear_carpeta(carpeta: str = "facturas_entrantes/"):
    """Monitorea carpeta en background — corre para siempre hasta Ctrl+C."""
    Path(carpeta).mkdir(exist_ok=True)
    observer = Observer()
    observer.schedule(FacturaHandler(), carpeta, recursive=False)
    observer.start()
    print(f"Monitoreando {carpeta}... (Ctrl+C para parar)")
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()

# === 4. Combinación: batch processing con pathlib + paralelismo ===
from concurrent.futures import ProcessPoolExecutor

def procesar_todos_los_pdfs(carpeta: str, n_workers: int = 4):
    """Procesa todos los PDFs de una carpeta en paralelo."""
    pdfs = list(Path(carpeta).glob("*.pdf"))
    print(f"Encontrados {len(pdfs)} PDFs para procesar")

    with ProcessPoolExecutor(max_workers=n_workers) as executor:
        resultados = list(executor.map(procesar_factura_nueva,
                                       [str(p) for p in pdfs]))
    print(f"Procesados: {sum(1 for r in resultados if r is not None)}")

if __name__ == "__main__":
    # Ejemplos de uso:
    # organizar_facturas_por_mes("facturas/")
    # procesar_todos_los_pdfs("facturas/", n_workers=4)
    # monitorear_carpeta("facturas_entrantes/")  # blocking
    pass`,
      },
      callout: {
        type: 'warning',
        title: 'pyautogui mueve el mouse REAL',
        content:
          'A diferencia de Playwright (que controla un browser headless separado), pyautogui controla el mouse y teclado del sistema operativo del usuario. Si corres un bot pyautogui en tu laptop mientras trabajas, te mueve el cursor. Soluciones: (1) correr bots pyautogui en una VM dedicada o servidor con RDP, (2) usar `pyautogui.FAILSAFE = True` para abortar moviendo el mouse a la esquina, (3) preferir automatización vía CLI/API siempre que sea posible — pyautogui es último recurso.',
      },
    },
    {
      heading: 'Document & OCR processing — pdfplumber + pytesseract + OpenCV',
      paragraphs: [
        'El 70% de los datos en empresas peruanas están atrapados en PDFs y imágenes escaneadas: facturas de SUNAT, boletas de pago, contratos, RUCs, cartas notariales, formularios físicos escaneados. Extraer texto de estos documentos es el primer paso de toda automatización contable/legal. Tienes dos casos: (1) PDFs "digitales" (los generados por software — el texto es seleccionable) y (2) PDFs "escaneados" (imágenes de páginas — el texto NO es seleccionable, necesitas OCR). Para el caso 1 usas `pdfplumber` (extrae texto y tablas directamente). Para el caso 2 usas `pytesseract` (OCR de Tesseract, el engine open-source de Google) con `opencv` para preprocesar la imagen y mejorar la precisión.',
        '`pdfplumber` es el estándar para PDFs digitales. Patrón: `with pdfplumber.open("factura.pdf") as pdf: for page in pdf.pages: text = page.extract_text(); tables = page.extract_tables()`. Extrae texto plano Y tablas como listas de listas (perfecto para pasar a pandas). Para facturas peruanas con estructura SUNAT, el texto sale ordenado y puedes parsear RUC, monto, IGV (18%) con regex. Caso típico: 500 facturas PDF → pdfplumber extrae texto → regex saca RUC+monto+fecha → DataFrame → SQLite para conciliación contable. Tarda 2 segundos por factura, vs 5 minutos manual — speedup 150x por factura.',
        'Para PDFs escaneados o imágenes (JPG/PNG de facturas fotos), `pytesseract` es la opción gratuita. Pero OJO: tesseract crudo tiene ~60% de precisión en facturas reales (espejos, mala iluminación, ángulos). Necesitas preprocesar con OpenCV: (1) convertir a grayscale, (2) aumentar contraste, (3) binarizar (threshold adaptativo), (4) quitar ruido, (5) corregir inclinación (deskew). Con preprocesamiento, la precisión sube a 85-90%. Para mayor precisión, usa PaddleOCR (mejor que tesseract para español) o llama a un LLM con visión (GPT-4 Vision, Claude Vision, o LLaMA con LLaVA local). Combinación ganadora 2025-2026: pytesseract para texto plano + LLM con visión para campos estructurados (monto, fecha, RUC).',
      ],
      code: {
        language: 'python',
        title: 'ocr_processing.py',
        code: `# Instalación:
#   pip install pdfplumber pytesseract opencv-python pillow
#   sudo apt install tesseract-ocr tesseract-ocr-spa  # sistema + español
import pdfplumber
import pytesseract
from PIL import Image
import cv2
import numpy as np
import pandas as pd
import re

# === 1. PDF digital: extraer texto y tablas con pdfplumber ===
def extraer_texto_pdf(pdf_path: str) -> str:
    """Extrae TODO el texto de un PDF digital (texto seleccionable)."""
    texto_total = ""
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            texto = page.extract_text() or ""
            texto_total += texto + "\\n"
    return texto_total

def extraer_tablas_pdf(pdf_path: str) -> list[pd.DataFrame]:
    """Extrae todas las tablas de un PDF como DataFrames."""
    tablas = []
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            for tabla in page.extract_tables():
                if tabla and len(tabla) > 1:
                    df = pd.DataFrame(tabla[1:], columns=tabla[0])
                    tablas.append(df)
    return tablas

# === 2. Parsear factura SUNAT con regex ===
def parsear_factura_sunat(texto: str) -> dict:
    """Extrae RUC, monto total, IGV y fecha de una factura SUNAT."""
    campos = {}
    # RUC emisor (11 dígitos)
    m = re.search(r"RUC[:\\s]*(\\d{11})", texto)
    campos["ruc_emisor"] = m.group(1) if m else None
    # Fecha de emisión
    m = re.search(r"Fecha de emisi[óo]n[:\\s]*(\\d{2}/\\d{2}/\\d{4})", texto)
    campos["fecha"] = m.group(1) if m else None
    # Total (con S/ o sin)
    m = re.search(r"Total[:\\s]*S/?\\s*(\\d+[.,]\\d+)", texto)
    campos["total"] = float(m.group(1).replace(",", ".")) if m else None
    # IGV (18% del subtotal)
    m = re.search(r"IGV.*?S/?\\s*(\\d+[.,]\\d+)", texto, re.DOTALL)
    campos["igv"] = float(m.group(1).replace(",", ".")) if m else None
    return campos

# Uso:
# texto = extraer_texto_pdf("factura_001.pdf")
# datos = parsear_factura_sunat(texto)
# print(datos)
# {"ruc_emisor": "20512345678", "fecha": "15/01/2024", "total": 1180.00, "igv": 180.00}

# === 3. PDF escaneado o imagen: OCR con pytesseract + OpenCV preprocessing ===
def preprocesar_imagen(image_path: str) -> np.ndarray:
    """Preprocesa imagen para mejorar precisión de OCR.
    Pasos: grayscale → increase contrast → threshold → denoise → deskew.
    """
    img = cv2.imread(image_path)
    # 1. Grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    # 2. Aumentar contraste con CLAHE
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    gray = clahe.apply(gray)
    # 3. Binarización adaptativa (mejor que threshold fijo para iluminación variable)
    binary = cv2.adaptiveThreshold(
        gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv2.THRESH_BINARY, 11, 2
    )
    # 4. Quitar ruido con operaciones morfológicas
    kernel = np.ones((1, 1), np.uint8)
    binary = cv2.morphologyEx(binary, cv2.MORPH_CLOSE, kernel)
    binary = cv2.morphologyEx(binary, cv2.MORPH_OPEN, kernel)
    return binary

def ocr_imagen(image_path: str, lang: str = "spa") -> str:
    """OCR de imagen con tesseract — lang='spa' para español."""
    # Preprocesar para mejorar precisión (~60% raw → ~85% con preprocessing)
    img_procesada = preprocesar_imagen(image_path)
    # pytesseract espera formato PIL Image o numpy array
    texto = pytesseract.image_to_string(img_procesada, lang=lang)
    return texto

# Uso:
# texto = ocr_imagen("factura_escaneada.jpg", lang="spa")
# datos = parsear_factura_sunat(texto)

# === 4. Batch: procesar 500 facturas PDF en paralelo ===
from concurrent.futures import ProcessPoolExecutor
from pathlib import Path

def procesar_factura(pdf_path: str) -> dict:
    """Procesa una factura: extrae texto, parsea campos, devuelve dict."""
    try:
        texto = extraer_texto_pdf(pdf_path)
        campos = parsear_factura_sunat(texto)
        campos["archivo"] = Path(pdf_path).name
        campos["status"] = "ok"
    except Exception as e:
        campos = {"archivo": Path(pdf_path).name, "status": "error", "error": str(e)}
    return campos

def procesar_lote_facturas(carpeta: str, n_workers: int = 8) -> pd.DataFrame:
    """Procesa todas las facturas PDF de una carpeta en paralelo."""
    pdfs = list(Path(carpeta).glob("*.pdf"))
    print(f"Procesando {len(pdfs)} facturas con {n_workers} workers...")

    with ProcessPoolExecutor(max_workers=n_workers) as executor:
        resultados = list(executor.map(procesar_factura, [str(p) for p in pdfs]))

    df = pd.DataFrame(resultados)
    print(f"\\nProcesadas: {len(df)} facturas")
    print(f"OK: {(df['status']=='ok').sum()}, Error: {(df['status']=='error').sum()}")
    return df

# df = procesar_lote_facturas("facturas/", n_workers=8)
# df.to_parquet("facturas_procesadas.parquet")
# df.to_sql("facturas", engine, if_exists="append", index=False)`,
      },
      callout: {
        type: 'tip',
        title: 'Para mayor precisión: combina OCR con LLM con visión',
        content:
          'En 2025-2026, el estándar para OCR de alta precisión es: pytesseract para texto base + LLM con visión (GPT-4V, Claude Sonnet 4.5, o LLaVA local con Ollama) para extraer campos estructurados. El OCR crudo te da ~85%; sumarle un LLM que entienda el contexto sube a 98%+. Para facturas peruanas, el LLM entiende "RUC", "IGV", "S/" como conceptos y los extrae más confiablemente que regex. Lo verás en el siguiente bloque de IA.',
      },
    },
    {
      heading: 'AI-augmented automation — Ollama, OpenAI structured outputs, Whisper, Hugging Face',
      paragraphs: [
        'La automatización moderna es multi-modal: combina OCR (visión), LLM (texto), Whisper (audio), y modelos de Hugging Face (clasificación, NER, sentimiento). La decisión clave en 2025-2026 es LOCAL vs CLOUD: Ollama corre LLMs en tu propia máquina (gratis, privado, sin latencia de red) — ideal para datos sensibles bajo Ley 29733 de Protección de Datos. OpenAI API es más potente pero cobra por token y envía datos a servidores externos. La regla: si los datos son sensibles (datos personales, financieros, médicos) → Ollama local. Si necesitas máxima precisión y los datos no son sensibles → OpenAI. Para texto en español, Llama 3.1 8B (Ollama) es muy bueno y corre en 8GB RAM.',
        'Ollama es la forma más simple de correr LLMs localmente. Instalas desde ollama.com, descargas un modelo con `ollama pull llama3.1:8b`, y desde Python usas la librería `ollama`: `import ollama; response = ollama.chat(model="llama3.1:8b", messages=[{"role": "user", "content": "Resume este texto: ..."}])`. Para EXTRAER datos estructurados (ideal para automatización), combinas Ollama con `pydantic`: defines un schema (ej: `class Factura(BaseModel): ruc: str; monto: float; fecha: str`), y le pides al LLM que llene el objeto. La librería `instructor` (o `ollama` con `format=json`) fuerza al modelo a devolver JSON válido que parseas a tu clase pydantic. Esto convierte texto libre en datos estructurados confiablemente.',
        'Para AUDIO, Whisper (de OpenAI, open-source) transcribe audio a texto con calidad casi humana en español. Casos peruanos: transcribir reuniones de equipo, llamadas de soporte al cliente, audios de WhatsApp del equipo de ventas. `import whisper; model = whisper.load_model("base"); result = model.transcribe("reunion.mp3"); text = result["text"]`. Para clasificación de texto (sentimiento, categorización, NER), Hugging Face `transformers` ofrece modelos pre-entrenados gratis: `from transformers import pipeline; classifier = pipeline("sentiment-analysis", model="pysentimiento/robertuito-sentiment-analysis"); classifier("Este producto es malísimo")` — funciona en español sin entrenar nada. Combinados, estos 4 tools (Ollama, OpenAI, Whisper, HF) te permiten construir bots que entienden texto, imágenes, audio y video — el verdadero "multi-modal automation".',
      ],
      code: {
        language: 'python',
        title: 'ai_automation.py',
        code: `# Instalación:
#   pip install ollama openai pydantic instructor openai-whisper
#   pip install "transformers[torch]"  # Hugging Face
#   ollama pull llama3.1:8b             # descargar modelo local (~5GB)

# === 1. Ollama: LLM local gratis y privado ===
import ollama

def summarizar_texto_local(texto: str, modelo: str = "llama3.1:8b") -> str:
    """Resume texto con LLM local — gratis y privado (Ley 29733 safe)."""
    response = ollama.chat(
        model=modelo,
        messages=[
            {"role": "system", "content": "Eres un asistente que resume textos en español."},
            {"role": "user", "content": f"Resume en 3 bullets: {texto}"},
        ],
    )
    return response["message"]["content"]

# === 2. Structured outputs con pydantic + instructor ===
from pydantic import BaseModel, Field
import instructor

# Habilitar modo structured outputs en Ollama via instructor
client = instructor.from_ollama(ollama.Client())

class FacturaEstructurada(BaseModel):
    """Schema de los campos a extraer de una factura."""
    ruc_emisor: str = Field(description="RUC del emisor, 11 dígitos")
    ruc_receptor: str = Field(description="RUC del receptor, 11 dígitos")
    razon_social: str = Field(description="Razón social del emisor")
    fecha_emision: str = Field(description="Fecha en formato YYYY-MM-DD")
    monto_total: float = Field(description="Monto total en soles (S/)")
    igv: float = Field(description="IGV (18%) en soles")
    moneda: str = Field(description="Moneda: PEN o USD")

def extraer_factura_con_llm(texto_ocr: str) -> FacturaEstructurada:
    """Extrae campos estructurados de texto libre usando LLM local."""
    factura = client.chat.completions.create(
        model="llama3.1:8b",
        response_model=FacturaEstructurada,
        messages=[
            {"role": "system", "content": "Extrae los datos de la factura. Si un campo no está, usa 'N/A' o 0.0."},
            {"role": "user", "content": f"Texto de la factura:\\n{texto_ocr}"},
        ],
    )
    return factura

# Uso:
# texto = "RUC 20512345678, Factura N° 001-1234, Fecha 15/01/2024, Total S/ 1180.00, IGV S/ 180.00"
# factura = extraer_factura_con_llm(texto)
# print(factura.ruc_emisor)    # '20512345678'
# print(factura.monto_total)   # 1180.0
# print(factura.igv)           # 180.0

# === 3. OpenAI API: para máxima precisión (cloud, cobra por token) ===
import os
from openai import OpenAI

openai_client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])

def extraer_factura_openai(texto_ocr: str) -> dict:
    """OpenAI con structured outputs (response_format=json_schema).
    Más preciso que Ollama pero envía datos a servidores externos."""
    response = openai_client.chat.completions.create(
        model="gpt-4o-mini",  # más barato que gpt-4o, casi igual de bueno
        response_format={
            "type": "json_schema",
            "json_schema": {
                "name": "factura",
                "schema": FacturaEstructurada.model_json_schema(),
            },
        },
        messages=[
            {"role": "system", "content": "Extrae los datos de la factura como JSON."},
            {"role": "user", "content": texto_ocr},
        ],
    )
    import json
    return json.loads(response.choices[0].message.content)

# === 4. Whisper: transcripción de audio a texto ===
import whisper

def transcribir_audio(audio_path: str, model_size: str = "base") -> str:
    """Transcribe audio (mp3, wav, m4a) a texto en español.
    Model sizes: tiny < base < small < medium < large (precisión ↑, RAM ↑)
    """
    model = whisper.load_model(model_size)
    result = model.transcribe(audio_path, language="es")
    return result["text"]

# transcripcion = transcribir_audio("reunion_equipo.mp3")
# print(transcripcion[:200])

# === 5. Hugging Face: clasificación de texto en español ===
from transformers import pipeline

def clasificar_sentimiento(textos: list[str]) -> list[dict]:
    """Clasifica sentimiento de textos en español (positivo/negativo/neutral).
    Usa RoBERTuito, modelo pre-entrenado para español por pysentimiento."""
    classifier = pipeline(
        "sentiment-analysis",
        model="pysentimiento/robertuito-sentiment-analysis",
    )
    resultados = classifier(textos)
    return [{"texto": t, **r} for t, r in zip(textos, resultados)]

# textos = [
#     "El servicio al cliente de Interbank fue excelente",
#     "Pésima atención en la agencia de Miraflores",
#     "Normal, ni bueno ni malo",
# ]
# print(clasificar_sentimiento(textos))
# [
#   {"texto": "El servicio...", "label": "POS", "score": 0.95},
#   {"texto": "Pésima atención...", "label": "NEG", "score": 0.92},
#   {"texto": "Normal...", "label": "NEU", "score": 0.78},
# ]

# === 6. Caso real: pipeline multi-modal para analizar llamadas ===
def analizar_llamada_cliente(audio_path: str) -> dict:
    """Pipeline multi-modal: audio → texto → sentimiento → resumen."""
    print("1. Transcribiendo audio...")
    texto = transcribir_audio(audio_path)
    print("2. Clasificando sentimiento...")
    sentimiento = clasificar_sentimiento([texto])[0]
    print("3. Resumiendo con LLM...")
    resumen = summarizar_texto_local(texto)
    return {
        "audio": audio_path,
        "transcripcion": texto,
        "sentimiento": sentimiento["label"],
        "score_sentimiento": sentimiento["score"],
        "resumen": resumen,
        "duracion_texto": len(texto.split()),
    }`,
      },
      callout: {
        type: 'warning',
        title: 'Local vs Cloud: la decisión Ley 29733',
        content:
          'En Perú, la Ley 29733 de Protección de Datos Personales regula el tratamiento de datos personales. Enviar datos de clientes (DNIs, información financiera, historial médico) a APIs externas como OpenAI requiere consentimiento explícito y contrato de encargamiento. Para datos sensibles, usa Ollama local (los datos nunca salen de tu máquina/servidor). Para datos no sensibles o con consentimiento, OpenAI es más preciso. La regla práctica: si no estás seguro, default a Ollama local — es gratis, privado y suficiente para 80% de casos.',
      },
    },
    {
      heading: 'Orchestration & scheduling — Prefect, tenacity, GitHub Actions',
      paragraphs: [
        'Un bot que corres una vez es una demo. Un bot que corre automáticamente cada día a las 6am, reintentando si falla, loggeando cada etapa, y alertándote si algo se rompe, es AUTOMATIZACIÓN real. Para esto necesitas 3 piezas: (1) `Prefect` para orquestar el flujo (definir tareas, dependencias, retries, caching), (2) `tenacity` para reintentos resilientes con backoff exponencial, y (3) `GitHub Actions` para scheduling gratuito (cron jobs que disparan tu bot en horarios fijos). Airflow es la alternativa enterprise pero tiene 3x más boilerplate y learning curve más alta — Prefect es mejor para empezar y para equipos pequeños.',
        'Prefect usa decorators pythonic: `from prefect import task, flow`. Marcas funciones con `@task` (unidades atómicas) y `@flow` (orquestador que llama tasks). Las ventajas: (1) retries automáticos (`@task(retries=3, retry_delay_seconds=60)`), (2) caching (`@task(cache_key_fn=...)` reutiliza resultados si inputs no cambiaron), (3) UI web gratuita para ver ejecuciones (`prefect server start` → localhost:4200), (4) integración con cualquier librería Python — tus tasks son funciones normales. Caso real: un flow de conciliación de facturas con 5 tasks (descargar PDFs → OCR → LLM extract → validar RUC → persistir SQL) que corre cada noche, reintenta 3 veces si la API de SUNAT falla, y te manda alerta a Slack si algo se rompe.',
        '`tenacity` es la librería estándar para retries resilientes. Decorador: `from tenacity import retry, stop_after_attempt, wait_exponential; @retry(stop=stop_after_attempt(5), wait=wait_exponential(multiplier=1, max=60))`. Esto reintenta hasta 5 veces con backoff exponencial (1s, 2s, 4s, 8s, 16s) — perfecto para APIs que fallan transitoriamente. Para scheduling, GitHub Actions es la opción gratuita y portfolio-visible: defines un workflow en `.github/workflows/daily-bot.yml` con `cron: "0 6 * * *"` (corre a las 6am UTC todos los días), y GitHub ejecuta tu bot en su infra gratis. Tus commits y runs quedan visibles en tu perfil GitHub — gold para portafolio. Para mayor frecuencia o cargas pesadas, puedes migrar a Prefect Cloud (free tier) o un VPS con cron.',
      ],
      code: {
        language: 'python',
        title: 'orchestration.py',
        code: `# Instalación:
#   pip install prefect tenacity
#   prefect server start  # opcional: UI web en localhost:4200

from prefect import task, flow
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type
import logging
import time
from pathlib import Path

# Configurar logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("bot")

# === 1. tenacity: retries resilientes para APIs inestables ===
import requests

@retry(
    stop=stop_after_attempt(5),
    wait=wait_exponential(multiplier=1, max=60),  # 1s, 2s, 4s, 8s, 16s
    retry=retry_if_exception_type((requests.RequestException, TimeoutError)),
    before_sleep=lambda rs: logger.warning("Reintento %d después de %s",
                                            rs.attempt_number, rs.outcome.exception()),
)
def get_api_resiliente(url: str) -> dict:
    """GET con retry automático — ideal para APIs inestables (SUNAT, MIMP, etc.)."""
    resp = requests.get(url, timeout=15)
    resp.raise_for_status()
    return resp.json()

# === 2. Prefect: definir tasks (unidades atómicas) ===
@task(retries=3, retry_delay_seconds=30)
def descargar_pdfs(carpeta: str) -> list[str]:
    """Descarga PDFs de una API o carpeta compartida."""
    logger.info("Descargando PDFs a %s", carpeta)
    Path(carpeta).mkdir(exist_ok=True)
    # Simulación: en la vida real, descargar de S3, SharePoint, etc.
    pdfs = [f"{carpeta}/factura_{i}.pdf" for i in range(5)]
    logger.info("Descargados %d PDFs", len(pdfs))
    return pdfs

@task
def extraer_texto(pdfs: list[str]) -> list[dict]:
    """OCR de cada PDF — devuelve lista de {'archivo': ..., 'texto': ...}."""
    import pdfplumber
    resultados = []
    for pdf in pdfs:
        try:
            with pdfplumber.open(pdf) as doc:
                texto = "\\n".join(p.extract_text() or "" for p in doc.pages)
            resultados.append({"archivo": pdf, "texto": texto, "status": "ok"})
        except Exception as e:
            resultados.append({"archivo": pdf, "texto": "", "status": "error",
                               "error": str(e)})
    return resultados

@task
def extraer_campos_con_llm(docs: list[dict]) -> list[dict]:
    """LLM extrae campos estructurados de cada texto."""
    # from ai_automation import extraer_factura_con_llm
    resultados = []
    for doc in docs:
        if doc["status"] != "ok":
            continue
        # factura = extraer_factura_con_llm(doc["texto"])
        # resultados.append(factura.model_dump())
        resultados.append({"archivo": doc["archivo"], "ruc": "20512345678",
                           "monto": 1180.0, "fecha": "2024-01-15"})  # mock
    return resultados

@task
def persistir_a_sqlite(datos: list[dict], db_path: str = "facturas.db") -> int:
    """Persiste resultados en SQLite — idempotente (reemplaza si existe)."""
    import sqlite3
    conn = sqlite3.connect(db_path)
    conn.execute("""CREATE TABLE IF NOT EXISTS facturas (
        archivo TEXT PRIMARY KEY, ruc TEXT, monto REAL, fecha TEXT
    )""")
    for d in datos:
        conn.execute(
            "INSERT OR REPLACE INTO facturas VALUES (?, ?, ?, ?)",
            (d["archivo"], d["ruc"], d["monto"], d["fecha"]),
        )
    conn.commit()
    conn.close()
    logger.info("Persistidas %d facturas en %s", len(datos), db_path)
    return len(datos)

# === 3. Prefect: flow que orquesta las tasks ===
@flow(name="facturas-pipeline", log_prints=True)
def facturas_pipeline(carpeta: str = "facturas_entrantes/"):
    """Pipeline completo: descargar → OCR → LLM → persistir.
    Corre automáticamente cada noche via GitHub Actions."""
    logger.info("=== Iniciando pipeline de facturas ===")

    pdfs = descargar_pdfs(carpeta)
    docs = extraer_texto(pdfs)
    datos = extraer_campos_con_llm(docs)
    n = persistir_a_sqlite(datos)

    logger.info("=== Pipeline completado: %d facturas procesadas ===", n)
    return n

# Ejecutar manualmente:
# facturas_pipeline()
# O desde CLI:  python orchestration.py

# === 4. GitHub Actions: scheduling gratuito (cron) ===
# Crea .github/workflows/daily-facturas.yml en tu repo:
#
# name: Daily Facturas Bot
# on:
#   schedule:
#     - cron: "0 6 * * *"  # 6am UTC = 1am hora Perú (UTC-5)
#   workflow_dispatch: {}  # permitir run manual
# jobs:
#   run-bot:
#     runs-on: ubuntu-latest
#     steps:
#       - uses: actions/checkout@v4
#       - uses: actions/setup-python@v5
#         with:
#           python-version: "3.12"
#       - run: pip install -r requirements.txt
#       - run: python orchestration.py
#         env:
#           OPENAI_API_KEY: \${{ secrets.OPENAI_API_KEY }}
#           SUNAT_API_KEY: \${{ secrets.SUNAT_API_KEY }}

# === 5. Alertas a Slack/Telegram si algo falla ===
def enviar_alerta_slack(mensaje: str, webhook_url: str = None):
    """Envía alerta a Slack cuando el pipeline falla."""
    if not webhook_url:
        logger.warning("Slack webhook no configurado, solo log: %s", mensaje)
        return
    requests.post(webhook_url, json={"text": f"🚨 Bot de facturas: {mensaje}"})

# En el flow, envolver con try/except:
# try:
#     facturas_pipeline()
# except Exception as e:
#     enviar_alerta_slack(f"Error: {e}")

if __name__ == "__main__":
    # Correr el flow (manual o via GitHub Actions cron)
    facturas_pipeline()`,
      },
      callout: {
        type: 'tip',
        title: 'GitHub Actions = scheduler gratis y portfolio-visible',
        content:
          'GitHub Actions te da 2000 minutos gratis al mes (suficiente para correr un bot diariamente). Tus workflows y runs quedan visibles en tu perfil GitHub — cuando un reclutador entra a tu repo, ve que tu bot corre automáticamente cada día. Esto es oro para portafolio: demuestra que sabes deployment, no solo scripting. Configura el cron en UTC (hora Perú = UTC-5) y guarda secrets (API keys) en Settings → Secrets and variables → Actions.',
      },
    },
  ],
  iDo: {
    intro:
      'Vamos a construir juntos 3 piezas que aparecen en TODO bot moderno: (1) scrapear una página con Playwright y extraer datos, (2) usar Ollama local para extraer campos estructurados de texto libre, y (3) orquestar un pipeline completo con Prefect + tenacity retries. Estos 3 patrones son el 80% del trabajo de "construir un bot real".',
    steps: [
      {
        description: 'Playwright scrape: extraer productos de una web con login',
        code: {
          language: 'python',
          title: 'playwright_scrape.py',
          code: `from playwright.sync_api import sync_playwright
import pandas as pd
import time

def scrapear_productos_con_login(url: str, usuario: str, password: str) -> pd.DataFrame:
    """Login a un portal y scrapea tabla de productos.
    Ajusta selectores al sitio real — usa 'playwright codegen' para generarlos.
    """
    productos = []
    with sync_playwright() as p:
        # headless=False para debug visual (ver qué hace el bot)
        browser = p.chromium.launch(headless=False, slow_mo=500)
        page = browser.new_page()

        # 1. Ir al portal y hacer login
        page.goto(url)
        page.fill("[name=username]", usuario)
        page.fill("[name=password]", password)
        page.click("button[type=submit]")

        # 2. Esperar navegación al dashboard (auto-wait de Playwright)
        page.wait_for_url("**/dashboard**", timeout=15000)
        print("Login exitoso!")

        # 3. Ir a la página de productos
        page.click("text=Productos")
        page.wait_for_selector("table.productos-table")

        # 4. Paginar: scrapear todas las páginas
        pagina = 1
        while True:
            print(f"Scrapeando página {pagina}...")
            # Extraer filas de la tabla
            filas = page.query_selector_all("table.productos-table tbody tr")
            for fila in filas:
                celdas = fila.query_selector_all("td")
                if len(celdas) >= 3:
                    productos.append({
                        "codigo": celdas[0].inner_text().strip(),
                        "nombre": celdas[1].inner_text().strip(),
                        "precio": celdas[2].inner_text().strip(),
                    })

            # 5. ¿Hay página siguiente?
            next_btn = page.query_selector("button.next:not([disabled])")
            if not next_btn:
                break
            next_btn.click()
            pagina += 1
            time.sleep(1)  # esperar que cargue la nueva página

        browser.close()

    df = pd.DataFrame(productos)
    # Limpieza: convertir precio a numérico
    df["precio"] = df["precio"].str.replace("S/", "").str.replace(",", "").astype(float)
    print(f"Scrapeados {len(df)} productos en {pagina} páginas")
    return df

# Ejecutar
# df = scrapear_productos_con_login(
#     url="https://portal.example.com/login",
#     usuario="mi_usuario",
#     password="mi_password",
# )
# print(df.head())
#   codigo      nombre  precio
# 0  P001   Laptop HP  3500.0
# 1  P002    Mouse Log   45.0
# ...

# === Sin login: scraping directo de página pública ===
def scrapear_precios_mercado_libre(producto: str) -> pd.DataFrame:
    """Scrapea precios de un producto en Mercado Libre Perú."""
    url = f"https://listado.mercadolibre.com.pe/{producto.replace(' ', '-')}"
    productos = []
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto(url, wait_until="domcontentloaded")

        # Esperar a que carguen los items (auto-wait)
        page.wait_for_selector(".ui-search-layout__item", timeout=10000)

        items = page.query_selector_all(".ui-search-layout__item")
        for item in items:
            try:
                titulo_el = item.query_selector("h2.ui-search-item__title")
                precio_el = item.query_selector(".andes-money-amount__fraction")
                if titulo_el and precio_el:
                    productos.append({
                        "titulo": titulo_el.inner_text().strip(),
                        "precio": precio_el.inner_text().strip(),
                    })
            except Exception:
                continue

        browser.close()

    df = pd.DataFrame(productos)
    if not df.empty:
        df["precio"] = df["precio"].str.replace(".", "", regex=False).astype(float)
    return df

# df = scrapear_precios_mercado_libre("laptop lenovo")
# print(df.head(3))`,
        },
        why: 'Playwright con auto-wait y selectores robustos (text=, role-based) es 5-10x más estable que Selenium. El patrón login → navegar → paginar → extraer es el 80% de los bots de scraping con auth. Guarda screenshots en cada paso para evidencia de auditoría (especialmente importante en bots financieros).',
      },
      {
        description: 'Ollama extraction: extraer campos estructurados de factura',
        code: {
          language: 'python',
          title: 'ollama_extract.py',
          code: `# pip install ollama pydantic instructor
# ollama pull llama3.1:8b  # descargar modelo local (~5GB, una sola vez)

import ollama
from pydantic import BaseModel, Field
import instructor

# Configurar cliente instructor para Ollama
client = instructor.from_ollama(ollama.Client())

class FacturaEstructurada(BaseModel):
    """Schema de campos a extraer de una factura peruana."""
    ruc_emisor: str = Field(description="RUC del emisor, 11 dígitos")
    razon_social: str = Field(description="Razón social del emisor")
    fecha_emision: str = Field(description="Fecha en formato YYYY-MM-DD")
    monto_total: float = Field(description="Monto total en soles (S/)")
    igv: float = Field(description="IGV (18%) en soles")
    moneda: str = Field(description="Moneda: PEN o USD")

def extraer_factura(texto_ocr: str) -> FacturaEstructurada:
    """Extrae campos estructurados de texto libre usando Ollama local.
    El LLM entiende el contexto y es más robusto que regex puro."""
    prompt = f"""Extrae los datos de esta factura peruana.
Devsuelve SOLO los campos del schema. Si un campo no está, usa 'N/A' o 0.0.

Texto de la factura:
{texto_ocr}"""

    factura = client.chat.completions.create(
        model="llama3.1:8b",
        response_model=FacturaEstructurada,
        messages=[
            {"role": "system", "content": "Eres un asistente que extrae datos de facturas peruanas."},
            {"role": "user", "content": prompt},
        ],
    )
    return factura

# === Test con texto simulado de factura SUNAT ===
texto_factura = """
FACTURA ELECTRÓNICA N° E001-12345
RUC EMISOR: 20512345678
RAZÓN SOCIAL: COMERCIAL EL SOL S.A.C.
FECHA DE EMISIÓN: 15/01/2024

DESCRIPCIÓN              CANTIDAD   PRECIO   TOTAL
Laptop Lenovo ThinkPad   1          1000.00  1000.00
Subtotal                                     1000.00
IGV (18%)                                     180.00
TOTAL                                         S/ 1180.00
"""

factura = extraer_factura(texto_factura)
print("Datos extraídos:")
print(f"  RUC emisor:     {factura.ruc_emisor}")
print(f"  Razón social:   {factura.razon_social}")
print(f"  Fecha emisión:  {factura.fecha_emision}")
print(f"  Monto total:    S/ {factura.monto_total:.2f}")
print(f"  IGV:            S/ {factura.igv:.2f}")
print(f"  Moneda:         {factura.moneda}")

# Output esperado:
# Datos extraídos:
#   RUC emisor:     20512345678
#   Razón social:   COMERCIAL EL SOL S.A.C.
#   Fecha emisión:  2024-01-15
#   Monto total:    S/ 1180.00
#   IGV:            S/ 180.00
#   Moneda:         PEN

# === Batch: procesar 50 facturas en paralelo ===
from concurrent.futures import ThreadPoolExecutor

def procesar_lote_facturas(textos: list[str]) -> list[dict]:
    """Procesa múltiples facturas — ThreadPool porque Ollama es I/O-bound."""
    def una(texto):
        try:
            f = extraer_factura(texto)
            return f.model_dump() | {"status": "ok"}
        except Exception as e:
            return {"status": "error", "error": str(e)}

    with ThreadPoolExecutor(max_workers=4) as executor:
        resultados = list(executor.map(una, textos))
    return resultados

# datos = procesar_lote_facturas([texto_factura] * 10)
# df = pd.DataFrame(datos)
# print(df[["ruc_emisor", "monto_total", "status"]])`,
        },
        why: 'Combinar OCR/regex con LLM para extracción estructurada es el patrón ganador 2025-2026: el LLM entiende contexto (sabe que "TOTAL S/ 1180" es el monto final, no el subtotal) y maneja variaciones de formato. Pydantic valida el schema y te da type safety. Todo local con Ollama = gratis y privado, cumple Ley 29733.',
      },
      {
        description: 'Prefect pipeline: orquestar bot completo con retries',
        code: {
          language: 'python',
          title: 'prefect_pipeline.py',
          code: `# pip install prefect tenacity pdfplumber
# prefect server start  # opcional: UI en localhost:4200

from prefect import task, flow
from tenacity import retry, stop_after_attempt, wait_exponential
import pandas as pd
import sqlite3
import logging
from pathlib import Path

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("facturas-bot")

# === Tasks: unidades atómicas con retries ===
@task(retries=3, retry_delay_seconds=30)
def listar_pdfs(carpeta: str) -> list[str]:
    """Lista PDFs a procesar — retry si la carpeta no está disponible."""
    pdfs = sorted(Path(carpeta).glob("*.pdf"))
    logger.info("Encontrados %d PDFs en %s", len(pdfs), carpeta)
    return [str(p) for p in pdfs]

@task(retries=2, retry_delay_seconds=10)
def extraer_texto_pdf(pdf_path: str) -> dict:
    """Extrae texto de un PDF — retry si falla (PDF corrupto temporalmente)."""
    import pdfplumber
    with pdfplumber.open(pdf_path) as doc:
        texto = "\\n".join(p.extract_text() or "" for p in doc.pages)
    return {"archivo": pdf_path, "texto": texto}

@task
def extraer_campos(docs: list[dict]) -> list[dict]:
    """LLM extract: texto → campos estructurados."""
    # from ollama_extract import extraer_factura
    datos = []
    for doc in docs:
        if not doc["texto"].strip():
            datos.append({"archivo": doc["archivo"], "status": "vacio"})
            continue
        # factura = extraer_factura(doc["texto"])
        # Mock para demo (en producción llamar a Ollama real):
        datos.append({
            "archivo": doc["archivo"],
            "ruc_emisor": "20512345678",
            "monto_total": 1180.0,
            "igv": 180.0,
            "fecha": "2024-01-15",
            "status": "ok",
        })
    return datos

@task
def validar_ruc(datos: list[dict]) -> list[dict]:
    """Valida que RUC tenga 11 dígitos — filter datos inválidos."""
    import re
    validos = []
    for d in datos:
        if d.get("status") != "ok":
            continue
        if not re.match(r"^\\d{11}$", d.get("ruc_emisor", "")):
            d["status"] = "ruc_invalido"
            continue
        validos.append(d)
    logger.info("Válidos: %d / %d", len(validos), len(datos))
    return validos

@task
def persistir_sqlite(datos: list[dict], db_path: str = "facturas.db") -> int:
    """Persiste en SQLite — idempotente con INSERT OR REPLACE."""
    conn = sqlite3.connect(db_path)
    conn.execute("""CREATE TABLE IF NOT EXISTS facturas (
        archivo TEXT PRIMARY KEY,
        ruc_emisor TEXT,
        monto_total REAL,
        igv REAL,
        fecha TEXT,
        procesado_en TEXT DEFAULT CURRENT_TIMESTAMP
    )""")
    for d in datos:
        conn.execute(
            "INSERT OR REPLACE INTO facturas (archivo, ruc_emisor, monto_total, igv, fecha) "
            "VALUES (?, ?, ?, ?, ?)",
            (d["archivo"], d["ruc_emisor"], d["monto_total"], d["igv"], d["fecha"]),
        )
    conn.commit()
    conn.close()
    logger.info("Persistidas %d facturas en %s", len(datos), db_path)
    return len(datos)

# === Flow: orquesta todas las tasks con dependencias automáticas ===
@flow(name="facturas-bot", log_prints=True)
def facturas_bot(carpeta: str = "facturas_entrantes/"):
    """Pipeline completo: listar PDFs → OCR → LLM extract → validar → persistir.
    Corre automáticamente via GitHub Actions cron diario."""
    logger.info("=== Iniciando facturas-bot ===")

    # 1. Listar PDFs
    pdfs = listar_pdfs(carpeta)
    if not pdfs:
        logger.warning("No hay PDFs para procesar")
        return 0

    # 2. Extraer texto de cada PDF (en paralelo si hay muchos)
    docs = []
    for pdf in pdfs[:10]:  # limitar a 10 para demo
        doc = extraer_texto_pdf(pdf)
        docs.append(doc)

    # 3. LLM extract
    datos = extraer_campos(docs)

    # 4. Validar RUCs
    datos_validos = validar_ruc(datos)

    # 5. Persistir
    n = persistir_sqlite(datos_validos)

    logger.info("=== Bot completado: %d facturas procesadas ===", n)
    return n

# === Ejecutar ===
if __name__ == "__main__":
    # Crear carpeta demo
    Path("facturas_entrantes").mkdir(exist_ok=True)
    # En la vida real: aquí ya tendrías PDFs descargados por watchdog
    facturas_bot()

# === GitHub Actions cron (.github/workflows/facturas-bot.yml) ===
# name: Facturas Bot
# on:
#   schedule:
#     - cron: "0 6 * * *"  # 6am UTC = 1am hora Perú
#   workflow_dispatch: {}
# jobs:
#   run-bot:
#     runs-on: ubuntu-latest
#     steps:
#       - uses: actions/checkout@v4
#       - uses: actions/setup-python@v5
#         with: {python-version: "3.12"}
#       - run: pip install -r requirements.txt
#       - run: ollama pull llama3.1:8b  # descargar modelo
#       - run: python prefect_pipeline.py`,
        },
        why: 'Prefect orquesta el flow con retries automáticos (si pdfplumber falla en un PDF corrupto, reintenta 2 veces), dependencias claras entre tasks (listar → extraer → validar → persistir), y UI web para ver ejecuciones. Combinado con GitHub Actions cron, tienes un bot que corre cada noche gratis — exactamente lo que piden en trabajos reales.',
      },
    ],
  },
  weDo: {
    intro:
      'Te toca practicar los 3 patrones más importantes de RPA con IA: (1) scrapear una página con Playwright, (2) extraer campos estructurados con Ollama, y (3) construir un flow de Prefect con retries. Cada ejercicio tiene starter code y solution code — intenta resolverlo solo primero.',
    steps: [
      {
        instruction:
          'Escribe una función `scrapear_titulos` que use Playwright para ir a una URL, esperar a que cargue, y extraer todos los títulos h2 de la página. Devuelve una lista de strings.',
        hint: 'Usa `sync_playwright()` context manager. `page.goto(url, wait_until="domcontentloaded")`. `page.query_selector_all("h2")` devuelve lista de elementos. `el.inner_text()` para obtener texto. Cierra el browser SIEMPRE.',
        starterCode: {
          language: 'python',
          title: 'playwright_starter.py',
          code: `from playwright.sync_api import sync_playwright

def scrapear_titulos(url: str) -> list[str]:
    """TODO: Scrapea todos los títulos h2 de una página con Playwright."""
    pass

# Test:
# titulos = scrapear_titulos("https://example.com")
# print(f"Encontrados {len(titulos)} títulos")
# for t in titulos[:5]:
#     print(f"  - {t}")`,
        },
        solutionCode: {
          language: 'python',
          title: 'playwright_solution.py',
          code: `from playwright.sync_api import sync_playwright
import time

def scrapear_titulos(url: str, timeout: int = 10000) -> list[str]:
    """Scrapea todos los títulos h2 de una página con Playwright.
    Devuelve lista de strings con el texto de cada h2.
    """
    titulos = []
    with sync_playwright() as p:
        # headless=True para producción (más rápido, sin UI)
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        try:
            # wait_until="domcontentloaded" espera al HTML básico
            # "networkidle" espera a que paren las requests (más lento pero más estable)
            page.goto(url, wait_until="domcontentloaded", timeout=timeout)

            # Esperar a que aparezca al menos un h2 (auto-wait de Playwright)
            try:
                page.wait_for_selector("h2", timeout=timeout)
            except Exception:
                print("No se encontraron h2 después de esperar")
                return []

            # Extraer todos los h2
            elementos = page.query_selector_all("h2")
            for el in elementos:
                texto = el.inner_text().strip()
                if texto:  # filtrar vacíos
                    titulos.append(texto)

        except Exception as e:
            print(f"Error scrapeando {url}: {e}")
        finally:
            browser.close()  # SIEMPRE cerrar el browser

    return titulos

# === Test ===
if __name__ == "__main__":
    # Wikipedia tiene muchos h2 — buen caso de prueba
    url = "https://es.wikipedia.org/wiki/Python_(lenguaje_de_programaci%C3%B3n)"
    titulos = scrapear_titulos(url)
    print(f"Encontrados {len(titulos)} títulos h2 en {url}")
    for i, t in enumerate(titulos[:10], 1):
        print(f"  {i}. {t[:80]}{'...' if len(t) > 80 else ''}")

# Salida típica:
# Encontrados 15 títulos h2 en https://es.wikipedia.org/wiki/Python_(lenguaje_de_programación)
#   1. Historia
#   2. Características
#   3. Filosofía
#   4. Modo de interactuar
#   5. Ejemplos de código
#   6. Lenguajes derivados
#   7. Implementaciones
#   8. Véase también
#   9. Referencias
#  10. Enlaces externos`,
        },
      },
      {
        instruction:
          'Define un modelo pydantic `Cliente` con campos (nombre, dni, edad, email) y escribe una función `extraer_cliente_de_texto` que use Ollama para extraer estos campos de un texto libre. Devuelve un objeto Cliente validado.',
        hint: 'Usa `instructor.from_ollama(ollama.Client())`. Define el BaseModel con Field(description=...). El prompt debe pedir "extrae SOLO los campos del schema". Si Ollama no está instalado, mock con datos fijos para que el test pase.',
        starterCode: {
          language: 'python',
          title: 'ollama_extract_starter.py',
          code: `from pydantic import BaseModel, Field

class Cliente(BaseModel):
    """TODO: Schema de cliente a extraer."""
    nombre: str = Field(description="TODO")
    dni: str = Field(description="TODO")
    edad: int = Field(description="TODO")
    email: str = Field(description="TODO")

def extraer_cliente_de_texto(texto: str) -> Cliente:
    """TODO: Usa Ollama + instructor para extraer cliente de texto libre."""
    pass

# Test:
# texto = "María Quispe, DNI 12345678, 32 años, email maria@gmail.com"
# cliente = extraer_cliente_de_texto(texto)
# print(cliente)`,
        },
        solutionCode: {
          language: 'python',
          title: 'ollama_extract_solution.py',
          code: `from pydantic import BaseModel, Field, field_validator
import re

class Cliente(BaseModel):
    """Schema de cliente con validaciones peruanas."""
    nombre: str = Field(description="Nombre completo del cliente")
    dni: str = Field(description="DNI peruano, 8 dígitos")
    edad: int = Field(description="Edad en años", ge=0, le=120)
    email: str = Field(description="Email válido")

    @field_validator("dni")
    @classmethod
    def validar_dni(cls, v: str) -> str:
        if not re.match(r"^\\d{8}$", v):
            raise ValueError(f"DNI debe tener 8 dígitos, recibí: {v}")
        return v

    @field_validator("email")
    @classmethod
    def validar_email(cls, v: str) -> str:
        if not re.match(r"^[\\w.+-]+@[\\w-]+\\.[\\w.-]+$", v):
            raise ValueError(f"Email inválido: {v}")
        return v

def extraer_cliente_de_texto(texto: str, use_ollama: bool = True) -> Cliente:
    """Extrae campos de cliente de texto libre usando Ollama local.
    Si Ollama no está disponible, fallback a regex simple.
    """
    if use_ollama:
        try:
            import ollama
            import instructor
            client = instructor.from_ollama(ollama.Client())
            cliente = client.chat.completions.create(
                model="llama3.1:8b",
                response_model=Cliente,
                messages=[
                    {"role": "system",
                     "content": "Extrae datos del cliente. DNI siempre 8 dígitos."},
                    {"role": "user", "content": texto},
                ],
            )
            return cliente
        except Exception as e:
            print(f"Ollama no disponible ({e}), usando fallback regex")
            return _fallback_regex(texto)
    return _fallback_regex(texto)

def _fallback_regex(texto: str) -> Cliente:
    """Fallback: extrae con regex simple si Ollama no está disponible."""
    # Buscar DNI (8 dígitos)
    m_dni = re.search(r"\\b(\\d{8})\\b", texto)
    dni = m_dni.group(1) if m_dni else "00000000"
    # Buscar email
    m_email = re.search(r"[\\w.+-]+@[\\w-]+\\.[\\w.-]+", texto)
    email = m_email.group(0) if m_email else "no@email.com"
    # Buscar edad (número seguido de "años")
    m_edad = re.search(r"(\\d+)\\s*a[ñn]os", texto, re.IGNORECASE)
    edad = int(m_edad.group(1)) if m_edad else 0
    # Nombre: lo que está antes del DNI, sin comas
    nombre = "Cliente Desconocido"
    m_nombre = re.match(r"^([^,\\d]+)", texto.strip())
    if m_nombre:
        nombre = m_nombre.group(1).strip().title()
    return Cliente(nombre=nombre, dni=dni, edad=edad, email=email)

# === Test ===
if __name__ == "__main__":
    texto = "María Quispe, DNI 12345678, 32 años, email maria@gmail.com"
    cliente = extraer_cliente_de_texto(texto, use_ollama=False)  # regex fallback
    print("Cliente extraído:")
    print(f"  Nombre: {cliente.nombre}")
    print(f"  DNI:    {cliente.dni}")
    print(f"  Edad:   {cliente.edad}")
    print(f"  Email:  {cliente.email}")

    # Validación falla si DNI no es 8 dígitos
    try:
        Cliente(nombre="Test", dni="123", edad=30, email="test@test.com")
    except Exception as e:
        print(f"\\nValidación correcta (DNI inválido rechazado): {type(e).__name__}")

# Salida esperada (sin Ollama, con fallback regex):
# Cliente extraído:
#   Nombre: María Quispe
#   DNI:    12345678
#   Edad:   32
#   Email:  maria@gmail.com
#
# Validación correcta (DNI inválido rechazado): ValidationError`,
        },
      },
      {
        instruction:
          'Construye un flow de Prefect con 2 tasks: `descargar_datos` (que falla aleatoriamente para forzar retry) y `procesar_datos` (que recibe la lista y calcula el total). El flow debe tener retries=3 en la task que falla.',
        hint: 'Importa `from prefect import task, flow`. Marca cada función con @task. Para simular fallo, lanza Exception aleatoriamente con `random.random() < 0.5`. El flow llama las tasks en orden. Corre con `python script.py`.',
        starterCode: {
          language: 'python',
          title: 'prefect_starter.py',
          code: `from prefect import task, flow
import random

@task
def descargar_datos() -> list[int]:
    """TODO: Devuelve lista de 100 enteros aleatorios. Falla 50% del tiempo."""
    pass

@task
def procesar_datos(datos: list[int]) -> int:
    """TODO: Devuelve la suma de los datos."""
    pass

@flow(name="demo-flow")
def mi_flow():
    """TODO: Orquesta descargar → procesar."""
    pass

if __name__ == "__main__":
    mi_flow()`,
        },
        solutionCode: {
          language: 'python',
          title: 'prefect_solution.py',
          code: `# pip install prefect
# Opcional: prefect server start  # UI en localhost:4200

from prefect import task, flow
import random
import logging

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("demo")

# Intentos de la task (para mostrar que retry funciona)
intentos_descarga = {"count": 0}

@task(retries=5, retry_delay_seconds=2)
def descargar_datos() -> list[int]:
    """Descarga datos simulados. Falla 50% del tiempo para demostrar retries.
    Con retries=5, eventualmente succeeds (probabilidad de fallar 5 veces seguidas = 3%).
    """
    intentos_descarga["count"] += 1
    logger.info("Intento descarga #%d", intentos_descarga["count"])

    # Simular fallo aleatorio (API inestable, red caída, etc.)
    if random.random() < 0.5:
        raise RuntimeError("API falló (simulado)")

    datos = [random.randint(1, 100) for _ in range(100)]
    logger.info("Descarga exitosa en intento #%d: %d elementos",
                intentos_descarga["count"], len(datos))
    return datos

@task
def procesar_datos(datos: list[int]) -> dict:
    """Procesa los datos: calcula suma, promedio, max, min."""
    resultado = {
        "n": len(datos),
        "suma": sum(datos),
        "promedio": sum(datos) / len(datos),
        "max": max(datos),
        "min": min(datos),
    }
    logger.info("Procesados %d datos: suma=%d, promedio=%.1f",
                resultado["n"], resultado["suma"], resultado["promedio"])
    return resultado

@task
def guardar_resultado(resultado: dict) -> None:
    """Guarda el resultado en un archivo JSON."""
    import json
    from pathlib import Path
    Path("output").mkdir(exist_ok=True)
    with open("output/resultado.json", "w") as f:
        json.dump(resultado, f, indent=2)
    logger.info("Guardado en output/resultado.json")

@flow(name="demo-flow", log_prints=True)
def mi_flow():
    """Flow que demuestra retries: descargar (inestable) → procesar → guardar."""
    logger.info("=== Iniciando flow ===")

    # Task 1: descargar (con retries automáticos si falla)
    datos = descargar_datos()

    # Task 2: procesar (depende de Task 1)
    resultado = procesar_datos(datos)

    # Task 3: guardar (depende de Task 2)
    guardar_resultado(resultado)

    logger.info("=== Flow completado ===")
    return resultado

# === Ejecutar ===
if __name__ == "__main__":
    # Corre el flow — verás en logs cómo reintenta descargar_datos hasta que pega
    resultado = mi_flow()
    print("\\nResultado final:")
    for k, v in resultado.items():
        print(f"  {k}: {v}")

# Salida típica (varía por aleatoriedad):
# 2024-01-15 [INFO] demo: === Iniciando flow ===
# 2024-01-15 [INFO] demo: Intento descarga #1
# 2024-01-15 [INFO] demo: Descarga exitosa en intento #1: 100 elementos
# 2024-01-15 [INFO] demo: Procesados 100 datos: suma=5042, promedio=50.4
# 2024-01-15 [INFO] demo: Guardado en output/resultado.json
# 2024-01-15 [INFO] demo: === Flow completado ===
#
# Resultado final:
#   n: 100
#   suma: 5042
#   promedio: 50.42
#   max: 99
#   min: 1
#
# (Si descarga falla en intento #1, verás retry #2, #3, etc. hasta 5 intentos)`,
        },
      },
    ],
  },
  youDo: {
    title: 'Capstone: Invoice Digitizer Bot — PDF folder → OCR/extract → LLM structure → SQLite + Excel',
    context:
      'Construyes un bot end-to-end llamado `invoice-digitizer` que digitaliza facturas peruanas (PDF/imagen) automáticamente. El bot monitorea una carpeta donde caen facturas (descargadas del portal SUNAT, escaneadas, o enviadas por email). Por cada factura: (1) extrae texto con pdfplumber (PDF digital) o pytesseract+OpenCV (PDF escaneado/imagen), (2) usa Ollama local para extraer campos estructurados (RUC emisor, razón social, monto total, IGV, fecha), (3) valida RUC contra padrón (regex + dígito verificador), (4) persiste en SQLite para queries, (5) genera Excel mensual para contabilidad, (6) corre automáticamente cada noche con GitHub Actions. Es exactamente el bot que usaría un equipo de contabilidad para ahorrar 20+ horas semanales de tipeo manual.',
    objectives: [
      'Monitorear carpeta con watchdog y disparar pipeline por cada PDF nuevo',
      'Extraer texto con pdfplumber (PDF digital) o pytesseract+OpenCV (escaneado)',
      'Extraer campos estructurados con Ollama local (RUC, monto, IGV, fecha, razón social)',
      'Validar RUC con dígito verificador (algoritmo módulo 11 peruano)',
      'Persistir en SQLite con SQLAlchemy ORM',
      'Generar Excel mensual con openpyxl (reporte para contabilidad)',
      'Orquestar con Prefect + tenacity retries (manejar PDFs corruptos, Ollama caído)',
      'Schedulear con GitHub Actions cron (corre cada noche gratis)',
    ],
    requirements: [
      'src/invoice_digitizer/monitor.py — FacturaHandler (watchdog) que dispara pipeline',
      'src/invoice_digitizer/ocr.py — extraer_texto_digital(pdf) y extraer_texto_ocr(imagen) con OpenCV preproc',
      'src/invoice_digitizer/extract.py — extraer_factura(texto) con Ollama + pydantic FacturaEstructurada',
      'src/invoice_digitizer/validate.py — validar_ruc(ruc) con algoritmo módulo 11 peruano',
      'src/invoice_digitizer/db.py — modelos SQLAlchemy + save_to_db(factura)',
      'src/invoice_digitizer/report.py — generar_excel_mensual(db, mes, output_path) con openpyxl',
      'src/invoice_digitizer/flow.py — flow de Prefect que orquesta todo con retries',
      'src/invoice_digitizer/cli.py — CLI con argparse: --carpeta, --db, --output, --verbose, --once',
      'pyproject.toml con [project.scripts] invoice-digitizer = "invoice_digitizer.cli:main"',
      '.github/workflows/daily-bot.yml con cron schedule diario',
      'tests/ con al menos 6 tests (test_validate.py con RUCs válidos/inválidos, test_extract.py con mocks)',
      'README.md con arquitectura, instrucciones, y screenshot del Excel generado',
    ],
    starterCode: `# pyproject.toml
[project]
name = "invoice-digitizer"
version = "0.1.0"
dependencies = [
    "pdfplumber", "pytesseract", "opencv-python", "pillow",
    "ollama", "pydantic", "instructor",
    "sqlalchemy", "openpyxl", "prefect", "tenacity",
    "watchdog", "python-dotenv", "argparse",
]

[project.scripts]
invoice-digitizer = "invoice_digitizer.cli:main"

# src/invoice_digitizer/extract.py
from pydantic import BaseModel, Field
import instructor, ollama

class FacturaEstructurada(BaseModel):
    ruc_emisor: str = Field(description="RUC emisor 11 dígitos")
    razon_social: str
    fecha_emision: str = Field(description="YYYY-MM-DD")
    monto_total: float
    igv: float

def extraer_factura(texto: str) -> FacturaEstructurada:
    """TODO: Usar Ollama + instructor para extraer campos del texto OCR."""
    client = instructor.from_ollama(ollama.Client())
    # TODO: completar con client.chat.completions.create(...)
    pass

# src/invoice_digitizer/validate.py
def validar_ruc(ruc: str) -> bool:
    """TODO: Validar RUC peruano con algoritmo módulo 11.
    RUC 11 dígitos: dígitos 1 a 10 × factores [5,4,3,2,7,6,5,4,3,2],
    suma módulo 11, 11 - resto = dígito verificador (posición 11).
    """
    pass

# src/invoice_digitizer/flow.py
from prefect import task, flow

@task(retries=3, retry_delay_seconds=30)
def extraer_texto(pdf_path: str) -> str:
    # TODO: pdfplumber o pytesseract según tipo de PDF
    pass

@flow(name="invoice-digitizer")
def procesar_factura(pdf_path: str):
    """TODO: extraer_texto → extraer_factura → validar → persistir."""
    pass`,
    portfolioNote:
      'Este es el proyecto capstone de la sección — combina TODO lo aprendido: Playwright/Selenium opcional para descargar facturas del portal SUNAT, OCR con OpenCV preprocessing, LLM local con Ollama para extracción estructurada, validación con regex y algoritmo módulo 11, persistencia en SQLite con SQLAlchemy, reportes en Excel, orquestación con Prefect + tenacity, y scheduling con GitHub Actions cron. En tu CV, menciona: "Construí un bot de digitalización de facturas con Python, OCR y LLMs locales (Ollama) que automatizó 95% del tipeo manual de contabilidad, ahorrando 20+ horas semanales. El bot corre automáticamente cada noche vía GitHub Actions." Esto te diferencia masivamente en entrevistas para roles de Data Engineer, Automation Engineer, o Python Developer en empresas peruanas.',
    rubric: [
      { criterion: 'Monitoreo de carpeta con watchdog (dispara pipeline por PDF nuevo)', weight: '10%' },
      { criterion: 'OCR dual: pdfplumber (digital) + pytesseract+OpenCV (escaneado)', weight: '15%' },
      { criterion: 'Extracción estructurada con Ollama + pydantic (campos validados)', weight: '20%' },
      { criterion: 'Validación de RUC con algoritmo módulo 11 peruano', weight: '10%' },
      { criterion: 'Persistencia en SQLite con SQLAlchemy ORM (idempotente)', weight: '10%' },
      { criterion: 'Generación de Excel mensual con openpyxl (formato para contabilidad)', weight: '10%' },
      { criterion: 'Orquestación con Prefect + tenacity (retries en OCR y LLM)', weight: '10%' },
      { criterion: 'CLI con argparse + GitHub Actions cron + tests + README', weight: '15%' },
    ],
  },
  selfCheck: {
    questions: [
      {
        question: '¿Cuándo elegirías Python-RPA sobre UiPath o Power Automate?',
        options: [
          'Cuando el equipo no sabe programar y prefiere drag-and-drop',
          'Cuando el equipo sabe programar, necesita IA integrada, o quiere cero costo de licencia',
          'Siempre — Python es superior en todos los casos',
          'Nunca — UiPath es el estándar enterprise',
        ],
        correctIndex: 1,
        explanation:
          'Python-RPA gana cuando: el equipo sabe programar (versatilidad), necesita IA moderna (Ollama/OpenAI integrados nativamente), quiere cero costo de licencia, o necesita versionable con git. UiPath/Power Automate ganan para equipos no-técnicos o procesos estándar SAP/Office. La decisión es estratégica: Python-RPA te da control total y flexibilidad.',
      },
      {
        question: '¿Qué ventaja clave tiene Playwright sobre Selenium en 2025-2026?',
        options: [
          'Playwright soporta más navegadores',
          'Playwright es 3-5x más rápido, tiene auto-wait automático, y grabación con codegen',
          'Playwright es más fácil de instalar',
          'Playwright no requiere browser drivers',
        ],
        correctIndex: 1,
        explanation:
          'Playwright mejora a Selenium en: velocidad (3-5x por arquitectura DevTools protocol vs WebDriver), auto-wait automático (no necesitas WebDriverWait explícito), soporte Chromium/Firefox/WebKit con misma API, y codegen (grabas acciones y genera código). Para proyectos nuevos en 2025-2026, Playwright es el estándar de facto.',
      },
      {
        question: '¿Por qué combinar OCR (pytesseract) con un LLM (Ollama) para extraer datos de facturas?',
        options: [
          'Porque pytesseract no funciona solo',
          'OCR da ~85% precisión; el LLM entiende contexto y sube a 98%+ extrayendo campos estructurados',
          'Porque el LLM corrige los errores del OCR automáticamente',
          'Porque es más barato que usar solo OCR',
        ],
        correctIndex: 1,
        explanation:
          'OCR crudo te da texto base con ~85% de precisión en facturas reales. Sumarle un LLM que entiende contexto (sabe que "RUC" es un identificador, que "TOTAL" es el monto final, no un subtotal) sube la precisión a 98%+ y te devuelve campos estructurados (dict/pydantic) en vez de texto libre. Es el patrón ganador 2025-2026.',
      },
      {
        question: '¿Cuándo debes usar Ollama local vs OpenAI API?',
        options: [
          'Siempre Ollama — es gratis',
          'Siempre OpenAI — es más preciso',
          'Ollama para datos sensibles (Ley 29733) o sin internet; OpenAI para máxima precisión con datos no sensibles',
          'Da igual, son equivalentes',
        ],
        correctIndex: 2,
        explanation:
          'La decisión local vs cloud depende de: (1) sensibilidad de datos — Ley 29733 prohíbe enviar datos personales a servidores externos sin consentimiento, (2) conectividad — Ollama funciona sin internet, (3) precisión — OpenAI GPT-4 es superior pero cobra por token. Default seguro: Ollama local para datos sensibles, OpenAI para casos no sensibles con presupuesto.',
      },
      {
        question: '¿Qué hace `@task(retries=3, retry_delay_seconds=30)` en Prefect?',
        options: [
          'Corre la task 3 veces siempre, sin importar si falla o no',
          'Si la task falla, reintenta hasta 3 veces con 30 segundos entre cada intento',
          'Espera 30 segundos antes de la primera ejecución',
          'Cancela la task después de 30 segundos',
        ],
        correctIndex: 1,
        explanation:
          'El decorador @task(retries=N, retry_delay_seconds=M) hace que si la task lanza una excepción, Prefect reintente automáticamente hasta N veces, esperando M segundos entre cada intento. Es ideal para tasks que dependen de recursos inestables (APIs, red, OCR de PDFs a veces corruptos). Si después de N intentos sigue fallando, el flow entero falla y te alerta.',
      },
    ],
  },
  resources: {
    docs: [
      { label: 'Playwright — Python docs', url: 'https://playwright.dev/python/docs/intro', note: 'Documentación oficial de Playwright para Python — el estándar moderno de browser automation' },
      { label: 'pyautogui — Docs', url: 'https://pyautogui.readthedocs.io/', note: 'Automatización de mouse y teclado para apps desktop' },
      { label: 'watchdog — Docs', url: 'https://python-watchdog.readthedocs.io/', note: 'Monitoreo de sistema de archivos — dispara eventos al crear/modificar archivos' },
      { label: 'pdfplumber — GitHub', url: 'https://github.com/jsvine/pdfplumber', note: 'Extracción de texto y tablas de PDFs digitales' },
      { label: 'pytesseract — Docs', url: 'https://pytesseract.readthedocs.io/', note: 'Wrapper Python para Tesseract OCR — requiere instalar Tesseract en el sistema' },
      { label: 'Ollama — Python library', url: 'https://github.com/ollama/ollama-python', note: 'Cliente Python para Ollama — corre LLMs locales gratis' },
      { label: 'instructor — Structured outputs', url: 'https://jxnl.github.io/instructor/', note: 'Librería para extraer datos estructurados con LLMs + pydantic' },
      { label: 'Prefect — Docs', url: 'https://docs.prefect.io/latest/', note: 'Orquestación moderna de flows con @task/@flow decorators' },
      { label: 'tenacity — Docs', url: 'https://tenacity.readthedocs.io/', note: 'Retries resilientes con backoff exponencial y políticas custom' },
      { label: 'GitHub Actions — Workflow syntax', url: 'https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions', note: 'Scheduling cron gratis para tu portafolio' },
    ],
    books: [
      { label: 'Python Automation Cookbook (Michael Heydt, Packt)', note: 'Recetas prácticas de automatización: scraping, Excel, emails, scheduling — buena base antes de RPA avanzado.' },
      { label: 'Web Scraping with Python (Ryan Mitchell, O\'Reilly)', note: 'Scraping moderno con BeautifulSoup, Selenium y Scrapy — base para bots de browser.' },
      { label: 'Natural Language Processing with Transformers (Tunstall, von Werra, Wolf)', note: 'Libro oficial de Hugging Face — transformers para NLP en español, ideal para la sección de IA.' },
      { label: 'Building Data Pipelines with Prefect (Amanda Mitchell)', note: 'Pipeline orquestation moderna con Prefect — complementa lo aprendido en S12 sobre argparse + logging.' },
    ],
    courses: [
      { label: 'Real Python — Playwright', url: 'https://realpython.com/modern-web-automation-with-python-and-playwright/', note: 'Tutorial completo de Playwright para Python con ejemplos prácticos' },
      { label: 'Ollama — GitHub Discussions', url: 'https://github.com/ollama/ollama', note: 'Comunidad activa — modelos disponibles, ejemplos, troubleshooting' },
      { label: 'Prefect — Tutorials oficiales', url: 'https://docs.prefect.io/latest/tutorial/', note: 'Tutoriales paso a paso de Prefect desde basics hasta deployments' },
      { label: 'Hugging Face Course', url: 'https://huggingface.co/learn/nlp-course', note: 'Curso gratuito de NLP con transformers — sentiment, NER, classification en español' },
      { label: 'GitHub Actions — Learning Lab', url: 'https://skills.github.com/', note: 'Curso oficial de GitHub Actions para CI/CD y scheduling' },
    ],
  },
}
