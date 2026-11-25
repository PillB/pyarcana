/**
 * Ruta aplicada «Python en la web»: HTML para mostrar datos, HTTP entre programas, modelado de una
 * base de datos, un sitio construido con Python y su publicación en internet.
 *
 * Optional detour beside the 52 sections (audit/tracks/web/DESIGN.md). It starts after S12
 * (APIs, SQL y geodatos), whose HTTP and SQL it puts to work, and becomes required at the advanced
 * level (phase 2). Learner-facing prose here is a PROPOSAL awaiting the owner's approval
 * (AGENTS.md, owner rule 2026-11-09); the PR that adds it says so.
 *
 * Every `python` block runs under `python3 -I` in src/lib/cloud/__tests__/web-track.test.ts, which
 * compares each printed line with `output`. Change the code, then paste what it prints; never type
 * an output by hand. `app.js` is executed against a minimal DOM in the same test.
 */
import type { TrackAnchors } from '../placement'
import type { TrackDefinition } from '../types'

export const WEB_TRACK_ID = 'ruta-web'

/** By stable slug and phase, never by number: see src/lib/tracks/placement.ts. */
export const WEB_TRACK_ANCHORS: TrackAnchors = {
  recommendedAfter: 'apis-sql-geo',
  alsoOfferedIn: ['evidence-dashboard'],
  requiredFromPhase: 2,
}

export const WEB_TRACK: TrackDefinition = {
  id: WEB_TRACK_ID,
  title: 'Ruta aplicada: Python en la web',
  summary:
    'Un desvío opcional después de la Sección 12. Aprendes qué hace mejor el navegador y qué hace mejor Python, cómo se comunican por HTTP, y publicas en internet un sitio construido con tus datos. El último módulo enseña a modelar una base de datos antes de crear tablas.',
  modules: [
    {
      id: 'html',
      title: 'HTML para mostrar datos',
      goal: 'Generas una tabla HTML desde Python, con los datos escapados y una estructura que el navegador y un lector de pantalla entienden.',
      buildsOn: ['files-ingestion', 'apis-sql-geo'],
      intro: [
        'Hasta aquí tus resultados salían por la consola o en un archivo CSV. **HTML** (el lenguaje de etiquetas con el que se escriben las páginas web) es otra salida de texto, solo que la lee un navegador y la dibuja como página: títulos, tablas, enlaces.',
        'El reparto de trabajo es sencillo: Python calcula, limpia y resume los datos, como en la Sección 8. El navegador presenta el resultado y lo adapta a la pantalla, al tamaño de letra y al lector de pantalla de quien lo abre, sin que escribas código para cada caso.',
      ],
      steps: [
        {
          id: 'html.reparto',
          title: 'Decide qué hace Python y qué hace el navegador',
          body: [
            'Antes de escribir una etiqueta, conviene saber qué parte del trabajo le toca a cada uno. La tabla resume lo que cada lado hace sin esfuerzo y lo que le cuesta.',
            'La regla práctica es que Python produce los números y el navegador los muestra. Si te encuentras calculando un total dentro de la página, o dibujando una tabla con `print` y espacios, el trabajo está en el lado equivocado.',
          ],
          table: {
            caption: 'Qué hace mejor cada lado',
            columns: ['Tarea', 'Mejor en', 'Por qué'],
            rows: [
              ['Limpiar, unir y resumir datos', 'Python', 'Tienes `csv`, `Decimal`, SQL y pruebas, y el resultado se puede repetir.'],
              ['Mostrar una tabla legible en cualquier pantalla', 'Navegador (HTML y CSS)', 'Ajusta el ancho, el zoom y el contraste sin que lo programes.'],
              ['Ordenar o filtrar lo que ya está en pantalla', 'Navegador (JavaScript)', 'Responde al instante, sin volver a ejecutar Python.'],
              ['Compartir el resultado con alguien', 'Navegador', 'Basta un enlace; quien lo abre no instala Python.'],
              ['Guardar datos y consultarlos después', 'Base de datos (SQL)', 'Mantiene las relaciones entre tablas y no pierde filas.'],
            ],
          },
          expect: 'Puedes decir, para tu proyecto de S12 o S13, qué parte calcularías en Python y qué parte dejarías al navegador.',
        },
        {
          id: 'html.escapar',
          title: 'Escapa cada dato antes de meterlo en el HTML',
          body: [
            'Una tabla HTML es texto, así que la tentación es armarla con f-strings. El problema aparece cuando un dato contiene `<` o `>`: el navegador los lee como el inicio de una etiqueta. En el ejemplo, la sede «Bodega <Norte>» pierde la palabra «Norte», porque el navegador cree que `<Norte>` es una etiqueta desconocida y la oculta.',
            '`html.escape` (de la biblioteca estándar) cambia `<` por `&lt;` y `>` por `&gt;`, es decir, por códigos que el navegador muestra como los símbolos en lugar de interpretarlos. Es la misma protección que aplica Jinja, la biblioteca de plantillas HTML que verás en S21, y también evita que alguien meta código en tu página a través de un dato.',
          ],
          code: [
            {
              language: 'python',
              title: 'escapar_celdas.py',
              code: String.raw`# Error: el nombre entra al HTML tal cual
from html import escape

filas = [("Sede A", "1250.00"), ("Bodega <Norte>", "980.50")]
mala = "".join(f"<tr><td>{sede}</td><td>{monto}</td></tr>" for sede, monto in filas)
print(mala)

# Corrección: escape() convierte < y > en texto que el navegador muestra
buena = "".join(f"<tr><td>{escape(sede)}</td><td>{monto}</td></tr>" for sede, monto in filas)
print(buena)`,
              output: String.raw`<tr><td>Sede A</td><td>1250.00</td></tr><tr><td>Bodega <Norte></td><td>980.50</td></tr>
<tr><td>Sede A</td><td>1250.00</td></tr><tr><td>Bodega &lt;Norte&gt;</td><td>980.50</td></tr>`,
            },
          ],
          previews: [
            { title: 'Sin escape: la sede pierde la palabra Norte', html: '<table><tr><td>Sede A</td><td>1250.00</td></tr><tr><td>Bodega <Norte></td><td>980.50</td></tr></table>' },
            { title: 'Con escape: la sede se ve completa', html: '<table><tr><td>Sede A</td><td>1250.00</td></tr><tr><td>Bodega &lt;Norte&gt;</td><td>980.50</td></tr></table>' },
          ],
          expect: 'La primera vista muestra «Bodega» sola; la segunda, «Bodega <Norte>» completa.',
        },
        {
          id: 'html.tabla-semantica',
          title: 'Dale a la tabla un título y encabezados de columna',
          body: [
            'Una tabla que solo tiene celdas se ve bien. Sin embargo, un lector de pantalla (el programa que lee la página en voz alta a una persona ciega) no sabe qué columna es cuál. Tres etiquetas lo resuelven: `<caption>` es el título de la tabla, `<thead>` agrupa la fila de encabezados y `<th scope="col">` marca cada encabezado como el nombre de su columna.',
            'La función recibe el título, las columnas y las filas, y devuelve el HTML completo con cada valor escapado. Cuando uses pandas, la biblioteca de tablas que empieza en S15, `DataFrame.to_html()` hará algo parecido y también escapará por defecto. Escribir la función a mano una vez te permite leer lo que pandas genera.',
          ],
          code: [
            {
              language: 'python',
              title: 'tabla_html.py',
              code: String.raw`from html import escape


def tabla_html(titulo, columnas, filas):
    cabecera = "".join(f'<th scope="col">{escape(c)}</th>' for c in columnas)
    cuerpo = "\n".join(
        "<tr>" + "".join(f"<td>{escape(str(v))}</td>" for v in fila) + "</tr>"
        for fila in filas
    )
    return (
        f"<table>\n<caption>{escape(titulo)}</caption>\n"
        f"<thead><tr>{cabecera}</tr></thead>\n<tbody>\n{cuerpo}\n</tbody>\n</table>"
    )


print(tabla_html("Ventas por sede (S/)", ["Sede", "Ventas"],
                 [("Sede A", "1250.00"), ("Bodega <Norte>", "980.50")]))`,
              output: String.raw`<table>
<caption>Ventas por sede (S/)</caption>
<thead><tr><th scope="col">Sede</th><th scope="col">Ventas</th></tr></thead>
<tbody>
<tr><td>Sede A</td><td>1250.00</td></tr>
<tr><td>Bodega &lt;Norte&gt;</td><td>980.50</td></tr>
</tbody>
</table>`,
            },
          ],
          previews: [
            {
              title: 'La tabla con título y encabezados',
              html: '<table>\n<caption>Ventas por sede (S/)</caption>\n<thead><tr><th scope="col">Sede</th><th scope="col">Ventas</th></tr></thead>\n<tbody>\n<tr><td>Sede A</td><td>1250.00</td></tr>\n<tr><td>Bodega &lt;Norte&gt;</td><td>980.50</td></tr>\n</tbody>\n</table>',
            },
          ],
          expect: 'La salida empieza con `<table>`, tiene un `<caption>` y un `<th scope="col">` por columna.',
          guide: { label: 'Tablas en MDN: el elemento table', url: 'https://developer.mozilla.org/es/docs/Web/HTML/Element/table' },
        },
        {
          id: 'html.practica',
          title: 'Agrega una fila de total a la tabla',
          body: [
            'Escribe una función `fila_total(filas)` que reciba las filas de `tabla_html` y devuelva una fila `<tr>` con la palabra «Total» y la suma de los montos. Suma con `Decimal`, como en S02, para que el total cuadre al céntimo.',
            'La primera celda es un encabezado de fila, `<th scope="row">`, porque nombra lo que la fila contiene; así el lector de pantalla anuncia «Total» antes del monto. Ejecuta tu función con las dos sedes del paso anterior.',
          ],
          exercise: {
            hint: '`Decimal(\'1250.00\') + Decimal(\'980.50\')` da `Decimal(\'2230.50\')`, y un f-string lo escribe tal cual.',
            solution: { language: 'python', title: 'fila_total.py', code: String.raw`from decimal import Decimal

filas = [("Sede A", "1250.00"), ("Bodega <Norte>", "980.50")]


def fila_total(filas):
    total = sum(Decimal(monto) for _, monto in filas)
    return f'<tr><th scope="row">Total</th><td>{total}</td></tr>'


print(fila_total(filas))`, output: String.raw`<tr><th scope="row">Total</th><td>2230.50</td></tr>` },
          },
          expect: 'La fila `<tr><th scope="row">Total</th><td>2230.50</td></tr>`.',
        },
      ],
    },
    {
      id: 'http',
      title: 'Python conversa con otros programas por HTTP',
      goal: 'Levantas un servidor y un cliente en Python, y lees el status, el tipo de contenido y el JSON de la respuesta.',
      buildsOn: ['apis-sql-geo'],
      intro: [
        'En S12 leíste respuestas HTTP de una API simulada. Aquí ves los dos extremos de la conversación: un programa que responde (el **servidor**) y otro que pregunta (el **cliente**). Es la misma conversación que tiene tu navegador cada vez que abre una página, y la que usarás para unir Python con cualquier otra tecnología.',
        'El formato que viaja casi siempre es JSON, como en la Sección 8, porque Python lo escribe con `json.dumps` y JavaScript lo lee con `JSON.parse` sin traducción intermedia.',
      ],
      steps: [
        {
          id: 'http.servidor-cliente',
          title: 'Levanta un servidor y pregúntale desde Python',
          body: [
            'El servidor de la biblioteca estándar (`http.server`) responde a cada pedido `GET` con un JSON de ventas. Para que el mismo archivo pueda preguntarle, el servidor corre en un **hilo** (`threading`), es decir, una segunda línea de ejecución dentro del mismo programa. Ese hilo escucha mientras la primera línea hace la pregunta; S38 estudia la concurrencia a fondo. En tu computadora lo harías en dos terminales, una para cada lado.',
            'El cliente usa `urllib.request.urlopen` con un `timeout`, la misma regla de S12: nunca esperes una respuesta sin límite. Del objeto que devuelve lees el status (`200`), el encabezado `Content-Type`, que le dice al cliente qué formato trae el cuerpo, y el cuerpo con `json.load`.',
          ],
          code: [
            {
              language: 'python',
              title: 'servidor_y_cliente.py',
              code: String.raw`import json
import threading
import urllib.request
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer


class Ventas(BaseHTTPRequestHandler):
    def do_GET(self):
        cuerpo = json.dumps({"sede": "Sede A", "ventas": "1250.00"}).encode("utf-8")
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(cuerpo)))
        self.end_headers()
        self.wfile.write(cuerpo)

    def log_message(self, *args):
        pass  # sin una línea de registro por cada pedido


servidor = ThreadingHTTPServer(("127.0.0.1", 0), Ventas)
threading.Thread(target=servidor.serve_forever, daemon=True).start()
url = f"http://127.0.0.1:{servidor.server_address[1]}/ventas"

with urllib.request.urlopen(url, timeout=5) as respuesta:
    print(respuesta.status, respuesta.headers["Content-Type"])
    print(json.load(respuesta))
servidor.shutdown()`,
              output: String.raw`200 application/json
{'sede': 'Sede A', 'ventas': '1250.00'}`,
            },
          ],
          expect: 'La primera línea es `200 application/json` y la segunda, el diccionario con la sede y las ventas.',
        },
        {
          id: 'http.navegador',
          title: 'Pide el mismo JSON desde la consola del navegador',
          body: [
            'En el navegador, el cliente ya no es Python sino JavaScript, el lenguaje que ejecuta la página. La **consola** del navegador (tecla F12, pestaña Consola) ejecuta JavaScript sobre la página abierta, y es el lugar más directo para probar un pedido. `fetch` hace el pedido HTTP y `await` espera la respuesta; la consola acepta un `await` suelto, mientras que dentro de un archivo `.js` tendría que ir en una función `async`.',
            '`respuesta.ok` vale `true` solo si el status está entre 200 y 299, así que se revisa antes de leer el cuerpo, igual que en S12. Lo pruebas con el sitio del módulo siguiente. Allí Python escribe `data.json` una vez, y después cualquier programa, sea el navegador o un script tuyo, puede pedirlo sin que Python vuelva a calcular nada.',
          ],
          code: [
            {
              language: 'javascript',
              title: 'en_la_consola_del_navegador.js',
              code: String.raw`const respuesta = await fetch('data.json')
if (!respuesta.ok) throw new Error('data.json respondió ' + respuesta.status)
const ventas = await respuesta.json()
console.log(ventas.length, 'sedes')`,
            },
          ],
          expect: 'Con el sitio del módulo 3 servido en http://localhost:8000, la consola muestra `3 sedes`.',
          fixes: [
            {
              symptom: 'La consola muestra un error de `fetch` y la barra de direcciones empieza con `file://`.',
              steps: ['Abriste `index.html` con doble clic, y el navegador no deja que una página local pida otro archivo local.', 'Sirve la carpeta (módulo 3, «Sirve la carpeta en tu computadora») y abre http://localhost:8000.'],
            },
          ],
        },
        {
          id: 'http.practica',
          title: 'Responde 404 cuando la ruta no existe',
          body: [
            'El servidor del paso 2.1 responde lo mismo a cualquier ruta. Cámbialo para que solo `/ventas` devuelva los datos y cualquier otra ruta responda status `404` con el JSON `{"error": "no existe"}`.',
            'Comprueba el cambio desde el cliente pidiendo `/otra-ruta`. `urlopen` lanza `HTTPError` cuando el status es 4xx o 5xx, y ese error trae el status en `code` y el cuerpo de la respuesta, que puedes leer con `json.load`.',
          ],
          exercise: {
            hint: '`self.path` contiene la ruta pedida, como `/ventas` u `/otra-ruta`.',
            solution: { language: 'python', title: 'servidor_404.py', code: String.raw`import json
import threading
import urllib.error
import urllib.request
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer


class Ventas(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == "/ventas":
            status, datos = 200, {"sede": "Sede A", "ventas": "1250.00"}
        else:
            status, datos = 404, {"error": "no existe"}
        cuerpo = json.dumps(datos).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(cuerpo)))
        self.end_headers()
        self.wfile.write(cuerpo)

    def log_message(self, *args):
        pass


servidor = ThreadingHTTPServer(("127.0.0.1", 0), Ventas)
threading.Thread(target=servidor.serve_forever, daemon=True).start()
url = f"http://127.0.0.1:{servidor.server_address[1]}/otra-ruta"

try:
    urllib.request.urlopen(url, timeout=5)
except urllib.error.HTTPError as error:
    print(error.code, json.load(error))
servidor.shutdown()`, output: String.raw`404 {'error': 'no existe'}` },
          },
          expect: '`404 {\'error\': \'no existe\'}`.',
        },
      ],
    },
    {
      id: 'sitio',
      title: 'Construye un sitio con tus datos',
      goal: 'Un script de Python genera `index.html` y `data.json`, y el navegador ordena la tabla sin volver a Python.',
      buildsOn: ['files-ingestion', 'modules-packaging-cli'],
      intro: [
        'Un **sitio estático** es una carpeta de archivos (HTML, JavaScript, JSON) que un servidor entrega tal cual, sin ejecutar Python en cada visita. Para publicar un resumen de datos es la opción más simple y barata: Python trabaja una vez, cuando construyes el sitio, y después cualquier navegador lo muestra.',
        'En este módulo juntas lo anterior: lees un CSV, escapas los datos, escribes la tabla y el JSON, y agregas un archivo `app.js` que ordena la tabla en el navegador.',
      ],
      steps: [
        {
          id: 'sitio.construir',
          title: 'Genera index.html y data.json con Python',
          body: [
            'El script lee las ventas, arma las filas con `escape` y escribe dos archivos en la carpeta de destino. Los escribe en la carpeta `site`, junto al script. `mkdir(exist_ok=True)` la crea la primera vez y no falla si ya existe, así que puedes volver a ejecutar el script cada vez que cambien los datos.',
            'La plantilla declara `charset="utf-8"` para que las tildes se vean bien, `lang="es"` para que el lector de pantalla pronuncie en español y `viewport` para que la tabla se adapte al celular. Los encabezados son botones: así se pueden pulsar con el teclado, no solo con el mouse.',
          ],
          code: [
            {
              language: 'python',
              title: 'construir_sitio.py',
              code: String.raw`import csv
import io
import json
from html import escape
from pathlib import Path

VENTAS_CSV = """sede,ventas
Sede A,1250.00
Bodega <Norte>,980.50
Sede C,1430.25
"""

PLANTILLA = """<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Ventas por sede</title>
</head>
<body>
<h1>Ventas por sede</h1>
<table>
<caption>Ventas por sede, en soles (datos sintéticos)</caption>
<thead><tr><th scope="col"><button type="button">Sede</button></th><th scope="col"><button type="button">Ventas</button></th></tr></thead>
<tbody>
{filas}
</tbody>
</table>
<script src="app.js"></script>
</body>
</html>
"""


def construir(destino: Path) -> list[str]:
    destino.mkdir(exist_ok=True)
    ventas = list(csv.DictReader(io.StringIO(VENTAS_CSV)))
    filas = "\n".join(
        f"<tr><td>{escape(v['sede'])}</td><td>{escape(v['ventas'])}</td></tr>" for v in ventas
    )
    (destino / "index.html").write_text(PLANTILLA.format(filas=filas), encoding="utf-8")
    (destino / "data.json").write_text(json.dumps(ventas, ensure_ascii=False, indent=2), encoding="utf-8")
    return sorted(p.name for p in destino.iterdir())


sitio = Path("site")
print(construir(sitio))
pagina = (sitio / "index.html").read_text(encoding="utf-8")
print("tiene caption:", "<caption>" in pagina)
print("nombre escapado:", "Bodega &lt;Norte&gt;" in pagina)
print(json.loads((sitio / "data.json").read_text(encoding="utf-8"))[1])`,
              output: String.raw`['data.json', 'index.html']
tiene caption: True
nombre escapado: True
{'sede': 'Bodega <Norte>', 'ventas': '980.50'}`,
            },
          ],
          expect: 'Dos archivos, `data.json` e `index.html` (tres si ya guardaste `app.js` en `site`), el caption presente y la sede escapada.',
        },
        {
          id: 'sitio.ordenar',
          title: 'Ordena la tabla en el navegador con app.js',
          body: [
            'JavaScript se lee parecido a Python, aunque con otra puntuación. `const` crea un nombre que no se reasigna, `(a, b) => ...` es una función corta como un `lambda`, y las llaves `{ }` marcan el bloque que en Python marca la sangría. El **DOM** es la página tal como la ve JavaScript, un árbol de elementos que puede leer y cambiar; `document.querySelectorAll(\'th button\')` devuelve los botones de los encabezados, como una lista. Dos formas más aparecen abajo: `condición ? a : b` es el `a if condición else b` de Python, y `[...cuerpo.rows]` copia las filas en una lista nueva que se puede ordenar.',
            'Ordenar lo que ya está en pantalla es trabajo del navegador: no hace falta volver a ejecutar Python ni recargar la página. El script escucha el clic en cada botón de encabezado y ordena las filas por esa columna: como número si ambas celdas son números, y como texto si no. Cada clic alterna entre orden ascendente y descendente.',
            '`aria-sort` es el atributo que le dice al lector de pantalla por qué columna y en qué sentido está ordenada la tabla. Guarda el archivo como `app.js` dentro de `site`, junto a `index.html`.',
          ],
          code: [{ language: 'javascript', title: 'app.js', code: String.raw`// app.js: ordena la tabla cuando pulsas un encabezado, sin volver a ejecutar Python
document.querySelectorAll('th button').forEach((boton, columna) => {
  boton.addEventListener('click', () => {
    const encabezado = boton.closest('th')
    const cuerpo = document.querySelector('tbody')
    const subir = encabezado.getAttribute('aria-sort') !== 'ascending'
    const filas = [...cuerpo.rows].sort((a, b) => {
      const x = a.cells[columna].textContent
      const y = b.cells[columna].textContent
      const orden = isNaN(x) || isNaN(y) ? x.localeCompare(y, 'es') : Number(x) - Number(y)
      return subir ? orden : -orden
    })
    document.querySelectorAll('th').forEach((th) => th.removeAttribute('aria-sort'))
    encabezado.setAttribute('aria-sort', subir ? 'ascending' : 'descending')
    cuerpo.append(...filas)
  })
})` }],
          expect: 'Al pulsar «Ventas» la fila de 980.50 queda arriba; al pulsar otra vez, la de 1430.25.',
        },
        {
          id: 'sitio.servir',
          title: 'Sirve la carpeta en tu computadora',
          body: [
            'Con doble clic en `index.html` ves la tabla, pero la dirección empieza con `file://` y la página no se comporta como en internet. El navegador no la deja pedir otros archivos con `fetch`, y ningún otro programa puede pedirle `data.json`. El servidor de la biblioteca estándar entrega la carpeta por HTTP, como lo hará el sitio publicado.',
            'Ejecuta el comando desde la carpeta de tu proyecto y abre la dirección que muestra. Para detener el servidor, vuelve a la terminal y presiona Ctrl+C.',
          ],
          code: [{ language: 'bash', title: 'servir_sitio.sh', code: 'python -m http.server 8000 --directory site' }],
          expect: 'La terminal dice `Serving HTTP on ... port 8000`, http://localhost:8000 muestra la tabla y http://localhost:8000/data.json muestra las tres sedes en JSON.',
          fixes: [
            {
              symptom: 'La barra de direcciones empieza con `file://`.',
              steps: ['Abriste el archivo con doble clic. Deja el servidor corriendo y abre http://localhost:8000.'],
            },
            {
              symptom: 'La terminal muestra `Address already in use` (en Windows, `WinError 10048`), o la página que abres no es la tuya.',
              steps: ['Otro programa usa el puerto 8000. Cambia el número: `python -m http.server 8001 --directory site`, y abre http://localhost:8001.'],
            },
            {
              symptom: 'En macOS o Linux, la terminal dice `command not found: python`.',
              steps: ['Activa el entorno virtual de tu proyecto (S01), o escribe `python3` en lugar de `python`.'],
            },
          ],
        },
        {
          id: 'sitio.practica',
          title: 'Muestra el total de ventas, calculado en Python',
          body: [
            'Agrega a la página un párrafo con el total de ventas de las tres sedes. Por la regla del módulo 1, el total lo calcula Python con `Decimal` al construir el sitio, y la página solo lo muestra.',
            'Escribe primero el cálculo y el párrafo en un script aparte. Cuando la salida sea la correcta, pon el párrafo en `PLANTILLA` con un segundo marcador, por ejemplo `{total}`.',
          ],
          exercise: {
            hint: 'Lee las ventas con `csv.DictReader`, como `construir_sitio.py`, y suma `Decimal(v["ventas"])`.',
            solution: { language: 'python', title: 'total_sitio.py', code: String.raw`import csv
import io
from decimal import Decimal

VENTAS_CSV = """sede,ventas
Sede A,1250.00
Bodega <Norte>,980.50
Sede C,1430.25
"""

ventas = list(csv.DictReader(io.StringIO(VENTAS_CSV)))
total = sum(Decimal(v["ventas"]) for v in ventas)
print(f"<p>Total de las {len(ventas)} sedes: S/ {total}</p>")`, output: String.raw`<p>Total de las 3 sedes: S/ 3660.75</p>` },
          },
          expect: 'El párrafo `<p>Total de las 3 sedes: S/ 3660.75</p>`.',
        },
      ],
    },
    {
      id: 'despliegue',
      title: 'Publica el sitio en internet',
      goal: 'Tu carpeta `site` queda en una dirección pública, y sabes cuándo basta un sitio estático y cuándo necesitas un servidor con Python.',
      buildsOn: ['setup', 'modules-packaging-cli'],
      intro: [
        '**Desplegar** es copiar tu sitio a una computadora que está siempre encendida y conectada, para que cualquiera lo abra con un enlace. Mientras el sitio solo vive en `localhost`, nadie más lo puede ver.',
        'Todo lo que publiques en un sitio estático es público, incluidos `data.json` y `app.js`. Publica solo datos sintéticos o agregados, como los de este curso, y nunca una clave o un token: cualquiera puede abrir esos archivos desde su navegador.',
      ],
      steps: [
        {
          id: 'despliegue.elegir',
          title: 'Elige dónde publicar según lo que necesita tu sitio',
          body: [
            'La pregunta que decide es si tu sitio necesita ejecutar Python cuando alguien lo visita. Si los datos se calculan una vez y se publican, basta un sitio estático. En cambio, si cada visita debe consultar una base de datos o recibir un formulario, necesitas una función o un servidor.',
            'Empieza por la primera fila. Las demás se estudian en el nivel avanzado: FastAPI, la biblioteca de Python para escribir APIs web, en S41; los contenedores en S43, y la nube en S45.',
          ],
          table: {
            caption: 'Opciones de publicación, de la más simple a la más completa',
            columns: ['Necesitas', 'Opción', 'Qué publicas', 'Cuidado'],
            rows: [
              ['Mostrar datos ya calculados', 'GitHub Pages, Cloudflare o Vercel (sitio estático)', 'La carpeta `site`', 'Todo queda público. GitHub Pages no admite tiendas ni servicios comerciales.'],
              ['Responder con Python en cada visita, sin administrar un servidor', 'Una función: Cloudflare Python Workers o Vercel Functions', 'Un archivo con la función o una app FastAPI', 'Cada visita ejecuta código: límites de tiempo y de uso del plan gratuito.'],
              ['Un servicio completo con base de datos y procesos largos', 'Un servidor o contenedor (por ejemplo, en AWS)', 'La aplicación y su configuración', 'Tú administras las actualizaciones, la seguridad y el costo.'],
            ],
          },
          expect: 'Para el sitio de ventas eliges un sitio estático, porque los datos se calculan una sola vez.',
        },
        {
          id: 'despliegue.rutas-relativas',
          title: 'Usa rutas relativas para que el sitio funcione en una subcarpeta',
          body: [
            'GitHub Pages publica un proyecto en `https://tu-usuario.github.io/mi-sitio/`, es decir, dentro de una subcarpeta. Una ruta que empieza con `/`, como `/data.json`, apunta a la raíz del dominio y no encuentra el archivo. La ruta relativa `data.json`, en cambio, se busca junto a la página y sí lo encuentra.',
            'El bloque compara las dos con `urljoin`, la función que hace el mismo cálculo que el navegador.',
          ],
          code: [
            {
              language: 'python',
              title: 'rutas_relativas.py',
              code: String.raw`from urllib.parse import urljoin

pagina = "https://tu-usuario.github.io/mi-sitio/"

# Error: la barra inicial manda a la raíz del dominio
print(urljoin(pagina, "/data.json"))

# Corrección: sin barra, el archivo se busca junto a la página
print(urljoin(pagina, "data.json"))`,
              output: String.raw`https://tu-usuario.github.io/data.json
https://tu-usuario.github.io/mi-sitio/data.json`,
            },
          ],
          expect: 'La primera dirección pierde `mi-sitio/`; la segunda la conserva.',
        },
        {
          id: 'despliegue.github-pages',
          title: 'Publica en GitHub Pages',
          body: [
            'Usas la cuenta de GitHub, Git y la herramienta `gh` que preparaste en la Sesión 0. Copia el contenido de `site` en una carpeta nueva, `mi-sitio`, con `index.html` en la raíz; desde ella, el último comando crea el repositorio público y lo sube, como en la Sesión 0.',
            'Después, en GitHub, abre **Settings → Pages**, elige **Deploy from a branch**, la rama `main` y la carpeta `/ (root)`, y guarda. En uno o dos minutos la página muestra la dirección pública.',
          ],
          code: [
            {
              language: 'bash',
              title: 'publicar_github_pages.sh',
              code: String.raw`cd mi-sitio
git init
git add index.html app.js data.json
git commit -m "Publica la tabla de ventas"
gh repo create mi-sitio --public --source . --push`,
            },
          ],
          expect: 'https://tu-usuario.github.io/mi-sitio/ muestra la tabla y la ordena al pulsar un encabezado.',
          fixes: [
            {
              symptom: 'La dirección muestra 404.',
              steps: ['Revisa que `index.html` esté en la raíz del repositorio y se llame así, en minúsculas.', 'Espera dos minutos y recarga: la primera publicación tarda.'],
            },
            {
              symptom: 'La tabla aparece, pero `fetch` falla con 404 en la consola.',
              steps: ['Busca rutas que empiecen con `/` en `index.html` y en `app.js`, y quítales la barra inicial (paso anterior).'],
            },
            {
              symptom: 'En **Settings → Pages** no aparece la rama `main`, solo `master`.',
              steps: ['Tu Git creó la rama con el nombre antiguo, así que renómbrala y súbela: `git branch -M main` y luego `git push -u origin main`. Para que los proyectos siguientes empiecen en `main`, ejecuta `git config --global init.defaultBranch main`, como en la Sesión 0.'],
            },
          ],
          guide: { label: 'GitHub Docs: crear un sitio de GitHub Pages', url: 'https://docs.github.com/es/pages/getting-started-with-github-pages/creating-a-github-pages-site' },
        },
        {
          id: 'despliegue.cloudflare',
          title: 'O publica en Cloudflare con un Worker de archivos estáticos',
          body: [
            'Cloudflare sirve una carpeta de archivos desde un **Worker**, su programa que corre en servidores repartidos por el mundo. Necesitas Node.js instalado, porque la herramienta `wrangler` se ejecuta con `npx`, y una cuenta gratuita de Cloudflare.',
            'Un archivo `wrangler.jsonc` en la carpeta del proyecto le dice qué carpeta publicar. `wrangler login` abre el navegador para autorizar tu cuenta y `wrangler deploy` sube los archivos y te devuelve una dirección que termina en `workers.dev`. Vercel ofrece lo mismo con `npx vercel deploy`.',
          ],
          code: [
            {
              language: 'json',
              title: 'wrangler.jsonc',
              code: String.raw`{
  "name": "mi-sitio",
  "compatibility_date": "2026-11-01",
  "assets": { "directory": "./site" }
}`,
            },
            { language: 'bash', title: 'publicar_cloudflare.sh', code: 'npx wrangler login\nnpx wrangler deploy' },
          ],
          expect: 'La terminal muestra una dirección `https://mi-sitio.<tu-subdominio>.workers.dev` que abre la tabla.',
          fixes: [
            {
              symptom: '`npx` no se reconoce como comando.',
              steps: ['Falta Node.js. Instala la versión LTS desde nodejs.org y abre una terminal nueva antes de repetir el comando.'],
            },
          ],
          guide: { label: 'Cloudflare Docs: archivos estáticos en Workers', url: 'https://developers.cloudflare.com/workers/static-assets/' },
        },
        {
          id: 'despliegue.python-servidor',
          title: 'Reconoce cuándo el sitio necesita Python en el servidor',
          body: [
            'Si el sitio debe recibir un formulario o consultar una base de datos en cada visita, ya no basta un archivo: necesitas código que corra en el servidor. Vercel detecta una app FastAPI en un archivo `app.py` con una variable `app`, y Cloudflare ejecuta Python en Workers con la herramienta `pywrangler`. Las dos opciones tienen planes gratuitos con límites de uso.',
            'Ese camino trae decisiones nuevas, como dónde guardar los secretos, cómo validar lo que llega y cómo probar la API. El curso las trata en S41 (FastAPI y contratos HTTP) y en S42 (seguridad de servicios). Para este desvío basta con que sepas reconocerlo y elegir el sitio estático mientras tus datos no cambien con cada visita.',
          ],
          expect: 'Puedes explicar por qué tu sitio de ventas no necesita Python en el servidor, y qué cambio en los requisitos lo haría necesario.',
          guide: { label: 'Vercel Docs: el runtime de Python', url: 'https://vercel.com/docs/functions/runtimes/python' },
        },
        {
          id: 'despliegue.practica',
          title: 'Busca rutas absolutas antes de publicar',
          body: [
            'Antes de subir el sitio conviene revisar que ninguna ruta empiece con `/`, porque fallará en la subcarpeta de GitHub Pages. Escribe un script que encuentre, con una expresión regular como las de S07, cada `src` o `href` que empiece con una sola `/`.',
            'Un enlace completo, como `https://docs.github.com/`, no es un problema: apunta a otro sitio y no depende de la subcarpeta. Pruébalo con una página que tenga una ruta absoluta, una relativa y un enlace completo.',
          ],
          exercise: {
            hint: 'El patrón `/[^/"]` exige una barra seguida de algo que no sea otra barra ni comillas, así que las rutas relativas y los enlaces que empiezan con `//` quedan fuera.',
            solution: { language: 'python', title: 'rutas_absolutas.py', code: String.raw`import re

pagina = """<link rel="stylesheet" href="/estilos.css">
<script src="app.js"></script>
<a href="https://docs.github.com/">Ayuda</a>"""

# Una ruta que empieza con una sola "/" apunta a la raíz del dominio
absolutas = re.findall(r'(?:src|href)="(/[^/"][^"]*)"', pagina)
print("rutas que fallarán en una subcarpeta:", absolutas)`, output: String.raw`rutas que fallarán en una subcarpeta: ['/estilos.css']` },
          },
          expect: 'Solo `/estilos.css` aparece en la lista.',
        },
      ],
    },
    {
      id: 'modelo',
      title: 'Modelar una base de datos antes de crear tablas',
      goal: 'Dibujas entidades, atributos y relaciones, eliges las claves, y conviertes el dibujo en tablas que SQLite hace cumplir.',
      buildsOn: ['oop-domain', 'apis-sql-geo'],
      intro: [
        'En S12 creaste tablas para guardar evidencia, y antes de escribir `CREATE TABLE` conviene un paso más abstracto. Primero decides qué **entidades** existen (las cosas de las que guardas datos, como una sede o un producto), qué **atributos** tiene cada una (sus columnas) y cómo se **relacionan**. Ese dibujo se llama modelo entidad-relación, y es el mismo razonamiento que hiciste con las clases del dominio en S11.',
        'Cada relación tiene una **cardinalidad**, es decir, cuántos de un lado corresponden a cuántos del otro. Una sede tiene muchas ventas y cada venta pertenece a una sola sede (uno a muchos); una sede vende muchos productos y un producto se vende en muchas sedes (muchos a muchos). El módulo no depende del sitio ni de su publicación, así que puedes hacerlo antes o después de ellos.',
      ],
      steps: [
        {
          id: 'modelo.dibujo',
          title: 'Dibuja las entidades y sus relaciones',
          body: [
            'Escribe el modelo en texto antes de tocar SQL. Cada caja es una entidad con su clave primaria (`PK`, el atributo que identifica una fila sin repetirse) y cada línea es una relación con su cardinalidad.',
            'Una relación uno a muchos se guarda poniendo una **clave foránea** (`FK`, la columna que apunta a la clave de otra tabla) en el lado «muchos»: `ventas.sede_id` apunta a `sedes.id`. Una relación muchos a muchos no cabe en una columna, así que necesita una tabla intermedia, `stock`, con una fila por cada par sede y producto.',
          ],
          code: [
            {
              language: 'text',
              title: 'modelo_ventas.txt',
              code: String.raw`sedes (PK id, nombre)
  1 ──< muchas  ventas (PK id, FK sede_id → sedes.id, monto)

sedes (PK id) >── muchos a muchos ──< productos (PK id)
  se guarda como:
  stock (FK sede_id → sedes.id, FK producto_id → productos.id, unidades)
  PK compuesta: (sede_id, producto_id)`,
            },
          ],
          expect: 'Tu modelo tiene una caja por entidad, una PK en cada caja y una FK en el lado «muchos» de cada relación uno a muchos.',
        },
        {
          id: 'modelo.claves-foraneas',
          title: 'Haz que SQLite cumpla las claves foráneas',
          body: [
            'Declarar `REFERENCES sedes(id)` no basta en SQLite: las claves foráneas vienen apagadas en cada conexión nueva, por compatibilidad con versiones antiguas. Sin activarlas, SQLite guarda una venta de una sede que no existe, una fila **huérfana** que después desaparece de cualquier JOIN sin avisar.',
            '`PRAGMA foreign_keys = ON` las enciende para esa conexión, así que va justo después de `connect`, antes de escribir. Con ellas activas, la misma venta falla con `IntegrityError` y el error llega a tu código en lugar de quedarse escondido en los datos.',
          ],
          code: [
            {
              language: 'python',
              title: 'claves_foraneas.py',
              code: String.raw`import sqlite3

ESQUEMA = """
CREATE TABLE sedes (id TEXT PRIMARY KEY, nombre TEXT NOT NULL);
CREATE TABLE ventas (
    id TEXT PRIMARY KEY,
    sede_id TEXT NOT NULL REFERENCES sedes(id),
    monto TEXT NOT NULL
);
INSERT INTO sedes VALUES ('SED-01', 'Sede A');
"""

# Error: SQLite trae las claves foráneas apagadas
con = sqlite3.connect(":memory:")
con.executescript(ESQUEMA)
con.execute("INSERT INTO ventas VALUES ('V-1', 'SED-99', '50.00')")
huerfanas = con.execute("SELECT COUNT(*) FROM ventas").fetchone()[0]
print("sin PRAGMA, ventas guardadas con una sede que no existe:", huerfanas)
con.close()

# Corrección: enciéndelas en cada conexión, antes de escribir
con = sqlite3.connect(":memory:")
con.execute("PRAGMA foreign_keys = ON")
con.executescript(ESQUEMA)
try:
    con.execute("INSERT INTO ventas VALUES ('V-1', 'SED-99', '50.00')")
except sqlite3.IntegrityError as error:
    print("con PRAGMA, SQLite rechaza la venta:", error)
con.close()`,
              output: String.raw`sin PRAGMA, ventas guardadas con una sede que no existe: 1
con PRAGMA, SQLite rechaza la venta: FOREIGN KEY constraint failed`,
            },
          ],
          expect: 'Sin PRAGMA se guarda 1 venta huérfana; con PRAGMA aparece `FOREIGN KEY constraint failed`.',
          guide: { label: 'SQLite: soporte de claves foráneas', url: 'https://www.sqlite.org/foreignkeys.html' },
        },
        {
          id: 'modelo.muchos-a-muchos',
          title: 'Guarda una relación muchos a muchos con una tabla intermedia',
          body: [
            '`stock` tiene una fila por cada par sede y producto, y su clave primaria compuesta `(sede_id, producto_id)` impide que el mismo par aparezca dos veces. El `CHECK (unidades >= 0)` es una regla de negocio que la base cumple por ti: no se puede guardar stock negativo.',
            'Para leerla unes las tres tablas con dos JOIN, como en S12, y obtienes nombres en lugar de códigos. El último `INSERT` intenta repetir un par y la clave compuesta lo rechaza.',
          ],
          code: [
            {
              language: 'python',
              title: 'muchos_a_muchos.py',
              code: String.raw`import sqlite3

con = sqlite3.connect(":memory:")
con.execute("PRAGMA foreign_keys = ON")
con.executescript("""
CREATE TABLE sedes (id TEXT PRIMARY KEY, nombre TEXT NOT NULL);
CREATE TABLE productos (id TEXT PRIMARY KEY, nombre TEXT NOT NULL);
CREATE TABLE stock (
    sede_id TEXT NOT NULL REFERENCES sedes(id),
    producto_id TEXT NOT NULL REFERENCES productos(id),
    unidades INTEGER NOT NULL CHECK (unidades >= 0),
    PRIMARY KEY (sede_id, producto_id)
);
INSERT INTO sedes VALUES ('SED-01', 'Sede A'), ('SED-02', 'Sede B');
INSERT INTO productos VALUES ('PRD-1', 'Cuaderno'), ('PRD-2', 'Lapicero');
INSERT INTO stock VALUES ('SED-01', 'PRD-1', 40), ('SED-01', 'PRD-2', 15), ('SED-02', 'PRD-1', 8);
""")
filas = con.execute("""
SELECT s.nombre, p.nombre, k.unidades
FROM stock AS k
JOIN sedes AS s ON s.id = k.sede_id
JOIN productos AS p ON p.id = k.producto_id
ORDER BY s.nombre, p.nombre
""").fetchall()
for fila in filas:
    print(fila)
try:
    con.execute("INSERT INTO stock VALUES ('SED-01', 'PRD-1', 5)")
except sqlite3.IntegrityError as error:
    print("segunda fila para el mismo par:", error)
con.close()`,
              output: String.raw`('Sede A', 'Cuaderno', 40)
('Sede A', 'Lapicero', 15)
('Sede B', 'Cuaderno', 8)
segunda fila para el mismo par: UNIQUE constraint failed: stock.sede_id, stock.producto_id`,
            },
          ],
          expect: 'Tres filas con sede, producto y unidades, y un `UNIQUE constraint failed` al repetir el par.',
        },
        {
          id: 'modelo.practica',
          title: 'Agrega los clientes al modelo',
          body: [
            'Cada venta pertenece a un cliente, y un cliente tiene muchas ventas. Decide en qué tabla va la clave foránea, escribe los dos `CREATE TABLE` y comprueba, con las claves foráneas encendidas, que SQLite rechaza una venta de un cliente que no existe.',
            'Usa identificadores sintéticos como `CLI-0001`, nunca un DNI real ni un número con su forma, porque los datos de práctica no deben parecerse a los de una persona.',
          ],
          exercise: {
            hint: 'La relación es uno a muchos, así que la FK va en el lado «muchos»: `ventas.cliente_id`.',
            solution: { language: 'python', title: 'clientes_ventas.py', code: String.raw`import sqlite3

con = sqlite3.connect(":memory:")
con.execute("PRAGMA foreign_keys = ON")
con.executescript("""
CREATE TABLE clientes (id TEXT PRIMARY KEY, nombre TEXT NOT NULL);
CREATE TABLE ventas (
    id TEXT PRIMARY KEY,
    cliente_id TEXT NOT NULL REFERENCES clientes(id),
    monto TEXT NOT NULL
);
INSERT INTO clientes VALUES ('CLI-0001', 'Ana Demo');
INSERT INTO ventas VALUES ('V-1', 'CLI-0001', '120.00');
""")
print(con.execute("SELECT COUNT(*) FROM ventas").fetchone()[0], "venta guardada")
try:
    con.execute("INSERT INTO ventas VALUES ('V-2', 'CLI-0099', '80.00')")
except sqlite3.IntegrityError as error:
    print("cliente inexistente:", error)
con.close()`, output: String.raw`1 venta guardada
cliente inexistente: FOREIGN KEY constraint failed` },
          },
          expect: '`1 venta guardada` y luego `FOREIGN KEY constraint failed` para el cliente inexistente.',
        },
      ],
    },
  ],
}
