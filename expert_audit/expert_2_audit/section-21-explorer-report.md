# 1. Section Identification & Scope

## Section 21 — **Documentos, plantillas y reportes trazables**

| Campo | Valor verificado |
|---|---|
| Índice | 21 |
| Tarjeta pública | **Reportes trazables** |
| Nivel | Competente |
| Duración declarada | 18 horas |
| Identificador interno | `fastapi` |
| Hash heredado | `#fastapi` |
| Archivo fuente | `src/lib/course/sections/s21-fastapi.ts` |
| Prerrequisito curricular | S20 — Automatización robusta de Excel |
| Proyecto | Cierre de **CP-N2-B** |
| Entregable esperado | Dashboard, workbook, DOCX/PDF y evidencia de revisión generados de manera reconciliada |

La página pública confirma el nombre, nivel, duración y promesa de una sola corrida con dashboard, DOCX/PDF, workbook, procedencia y revisión visual. También confirma que la verdadera sección de FastAPI es la S41, no la S21. ([pillb.github.io](https://pillb.github.io/pyarcana/))

El roadmap autoritativo define para S21 cuatro temas y ocho subtemas: plantillas Jinja; DOCX/PDF; narrativa de informes; y control de calidad, accesibilidad, procedencia y aprobación. El gate exige que **Accessible Insights Dashboard & Reporting Factory** genere los artefactos desde una corrida, con números reconciliados y revisión visual.

El contrato transversal exige por sección ocho demos I Do, 24 ejercicios —E1 guiado, E2 con retirada de apoyo y E3 de transferencia— y un examen de ocho ítems, uno por subtema.

### Alcance de esta ejecución

Se auditó exclusivamente S21:

- tarjeta y posicionamiento en el sitio público;
- archivo fuente completo;
- teoría, ocho demos I Do, 24 ejercicios, You Do, rúbrica, autocheck y recursos;
- conexión S18 → S19 → S20 → S21 → S22;
- fidelidad al roadmap;
- corrección técnica de Jinja, DOCX, PDF, accesibilidad, redondeo y procedencia;
- calidad de español peruano y presencia de texto interno.

La descarga textual del sitio público expone la tarjeta, pero no hidrata el cuerpo de la lección abierta mediante hash. Por ello, el contenido completo se verificó contra el archivo TypeScript que alimenta esa vista. **No se modificó ningún archivo.**

---

# 2. Executive Summary of Quality

## **Score: 7.3 / 10**

## Veredicto

S21 tiene una **columna vertebral profesional sólida**, muy superior a una lección convencional de “exportar a Word y PDF”. Enseña correctamente varias reglas de alto valor:

- un único contexto para varios artefactos;
- dato ausente ≠ cero;
- DOCX guardado y reabierto, no solo construido en memoria;
- PDF digital ≠ PDF escaneado;
- hallazgo ≠ decisión;
- trazabilidad H1 → Tabla1;
- paridad entre dashboard, Excel y documento;
- estado `pending_review` hasta aprobación humana.

Los ocho resultados de aprendizaje están presentes; existen ocho demos, 24 ejercicios y un You Do integrado. El flujo T1 → T4 es comprensible y conecta correctamente con S18–S20 y S22.

Sin embargo, **la promesa central “Accessible Insights” todavía supera la evidencia que produce la lección**. La accesibilidad se reduce en parte a tener un H1 y verificar que el texto alternativo tenga más de diez caracteres. Esa función aprueba incluso una lista vacía de textos alternativos. No se comprueban equivalencia informativa, etiquetado estructural del PDF, idioma del documento, encabezados de tabla ni una alternativa accesible al gráfico.

Además:

- el autocheck tiene siete preguntas para ocho subtemas;
- el texto clasifica erróneamente E1, E2 y E3 como “tres We Do”;
- el identificador `fastapi` contradice la identidad real de S21 y colisiona semánticamente con S41;
- varias tareas de “transferencia” son correcciones de una sola línea;
- los casos borde se enumeran, pero con frecuencia no se ejecutan;
- la procedencia no contiene hashes reales de todos los artefactos;
- se enseña SHA-1 truncado pese a que NIST recomienda migrar a SHA-2 o SHA-3;
- se usa `float` y `round()` para métricas monetarias;
- la revisión visual se representa mediante booleanos, sin conservar evidencia de la revisión.

**Conclusión:** el contenido merece conservarse y endurecerse, no reescribirse desde cero. La prioridad debe ser convertir sus afirmaciones de accesibilidad, trazabilidad, transferencia y evaluación en verificaciones auténticas.

---

# 3. Detailed Issue Registry

## 1. **P0 — La comprobación de accesibilidad produce un falso positivo con cero textos alternativos**

**Ubicación:** T4-A, demo y ejercicio E3.

**Evidencia exacta:**

```python
return has_h1 and all(len(a) > 10 for a in alts)
```

El ejercicio declara explícitamente `alts vacía` como caso borde, pero no lo resuelve.

**Reproducción:** en Python, `all([])` devuelve `True`. Por tanto:

```python
a11y_min(True, [])
```

aprueba un paquete sin ninguna descripción de figuras.

**Impacto pedagógico:** enseña al estudiante que la ausencia completa de alternativas puede satisfacer el gate de accesibilidad. Es especialmente grave porque el proyecto se llama **Accessible Insights Dashboard & Reporting Factory**.

**Impacto técnico:** un artefacto podría avanzar a revisión pese a contener gráficos sin alternativa textual.

---

## 2. **P1 — La accesibilidad se reduce a proxies sintácticos, no a equivalencia funcional**

**Ubicación:** teoría T4-A, I Do 7, E3 y rúbrica del You Do.

**Evidencia:**

- `has_h1`;
- longitud del alt `> 10`;
- misma precisión decimal;
- afirmación de que eso constituye una “checklist mínima a11y”.

WCAG exige que la alternativa textual cumpla el **mismo propósito** que el contenido no textual. Para gráficos complejos puede ser necesaria una descripción larga o una versión textual equivalente; la longitud arbitraria no demuestra equivalencia. ([w3.org](https://www.w3.org/WAI/WCAG22/Understanding/non-text-content))

La sección tampoco verifica:

- que exista al menos un alt;
- que el alt no sea “gráfico”, “imagen” o un nombre de archivo;
- que el gráfico tenga tabla o descripción equivalente;
- idioma principal del DOCX/PDF;
- encabezados reales en tablas;
- orden de lectura;
- estructura etiquetada del PDF;
- contraste efectivo;
- resultado de una revisión con tecnología asistiva.

**Impacto pedagógico:** convierte accesibilidad en una lista de tokens y fomenta cumplimiento superficial.

**Impacto curricular:** el gate CP-N2-B puede declarar “Accessible Insights” sin evidencia suficiente.

---

## 3. **P1 — El autocheck incumple el contrato de ocho ítems, uno por subtema**

**Ubicación:** `selfCheck.questions`.

La sección contiene **siete** preguntas.

Cobertura aproximada:

| Subtema | Cobertura |
|---|---|
| T1-A Jinja/contexto | Sí |
| T1-B ausentes/formato | Sí |
| T2-A DOCX/estilos | Sí |
| T2-B PDF/OCR | Dos preguntas |
| T3-A narrativa H→evidencia | No |
| T3-B figuras/paridad | Sí |
| T4-A redacción/accesibilidad | No |
| T4-B procedencia/aprobación | Sí |

El roadmap exige exactamente un ítem de cada uno de los ocho subtemas.

**Impacto pedagógico:** los estudiantes pueden aprobar sin recuperar los conceptos de narrativa auditable ni accesibilidad.

**Impacto de medición:** T2-B está sobrerrepresentado y dos constructos quedan sin medición.

---

## 4. **P1 — La sección describe erróneamente E1, E2 y E3 como “tres We Do”**

**Ubicación:** apertura de teoría.

**Evidencia exacta:**

> “En cada subtema: teoría → demo I Do → **tres We Do (guiada, independiente, transferencia)**.”

El contrato autoritativo establece:

- E1 = We Do guiado;
- E2 = You Do con andamiaje decreciente;
- E3 = transferencia independiente.

La propia página pública define We Do como práctica guiada y You Do como responsabilidad independiente. ([pillb.github.io](https://pillb.github.io/pyarcana/))

La evidencia pedagógica recomienda modelado, práctica guiada y práctica con niveles decrecientes de apoyo, no agrupar la transferencia independiente dentro de la fase guiada. ([ies.ed.gov](https://ies.ed.gov/ncee/wwc/PracticeGuide/1))

**Impacto pedagógico:** borra la frontera que permite al estudiante reconocer cuándo aún recibe apoyo y cuándo debe demostrar transferencia.

**Impacto metacognitivo:** dificulta interpretar un fallo de E3 como una necesidad de volver a E1/E2.

---

## 5. **P1 — Identidad heredada `fastapi` contradice el contenido y la S41 real**

**Ubicación:**

- archivo `s21-fastapi.ts`;
- `id: "fastapi"`;
- importación desde `./sections/s21-fastapi`.

La S41 se titula realmente **“APIs con FastAPI y contratos HTTP”**, aunque también conserva un filename heredado distinto.

**Impacto para el estudiante:**

- el enlace `#fastapi` abre reportes DOCX/PDF, no APIs;
- un marcador compartido parece dirigir al tema equivocado;
- buscadores internos, analítica y telemetría pueden etiquetar S21 como FastAPI;
- el contenido futuro de S41 queda semánticamente duplicado.

**Impacto editorial:** es el principal residuo estructural de la retitulación curricular.

---

## 6. **P1 — El manejo de variables Jinja falla de forma silenciosa**

**Ubicación:** T1 y ejercicio S21-T1-A-E1.

El caso borde declara:

> “n omitido en render → vacío en el hueco”.

Jinja usa por defecto un objeto `Undefined` que puede imprimirse como cadena vacía. La documentación oficial ofrece `StrictUndefined` para bloquear operaciones sobre variables ausentes y recomienda configurar explícitamente el entorno. ([jinja.palletsprojects.com](https://jinja.palletsprojects.com/en/stable/api/))

En un reporte trazable, producir:

```text
CASO-LIM-021 · Lima (n=)
```

no debería considerarse un resultado tolerable; debería bloquear la generación.

**Impacto pedagógico:** enseña una política “fail open” exactamente donde la sección insiste en paridad y auditabilidad.

**Impacto operativo:** una plantilla puede generar un informe incompleto sin lanzar error.

---

## 7. **P1 — T3-B promete tablas y figuras reales, pero practica principalmente diccionarios y strings**

**Ubicación:** “Gráficos, tablas, fuentes y limitaciones”.

La teoría exige:

> “Inserta figuras del dashboard y tablas del Excel con caption alineado…”

Sin embargo:

- el I Do compara tres diccionarios;
- E1 compara `dash` y `doc`;
- E2 construye un string de caption;
- E3 compara `a == b == c`;
- el You Do no inserta una figura ni una tabla derivada del workbook en DOCX/PDF.

**Impacto pedagógico:** existe alineación conceptual, pero no alineación de desempeño. El estudiante demuestra comparación de estructuras Python, no producción de un informe con figuras y tablas trazables.

**Impacto de transferencia:** el salto desde `dash == xlsx == doc` hasta insertar artefactos reales queda sin modelado.

---

## 8. **P1 — El You Do no materializa completamente la promesa “una sola corrida”**

**Ubicación:** proyecto final.

El contexto promete integrar EDA, dashboard y Excel, pero el starter implementa únicamente:

- `build_docx`;
- `build_pdf`;
- `extract_and_render`;
- `manifest`.

No se exige código para:

- leer el manifiesto real de S20;
- abrir el workbook y extraer sus métricas;
- leer un artefacto estructurado del dashboard;
- comparar las métricas de ambos con el contexto;
- insertar el gráfico o la tabla;
- bloquear el paquete si falta dashboard o workbook.

El checklist incluye `dashboard` y `xlsx`, pero pueden marcarse `True` sin comprobar esos archivos.

**Impacto curricular:** el cierre CP-N2-B parece integrado en la narrativa, pero la implementación evaluable sigue concentrada en DOCX/PDF.

**Impacto de portafolio:** un entregable puede aprobar con tres nombres de archivo y booleanos, sin demostrar integración reproducible con S19 y S20.

---

## 9. **P1 — La procedencia declarada es más fuerte que el manifiesto producido**

**Ubicación:** T4-B y You Do.

La teoría promete:

- huella de datos;
- hashes de artefactos;
- actor;
- timestamp;
- checklist;
- estado de aprobación.

El demo produce:

```python
"data_sha1_8": ...,
"artifacts": ["dashboard.html", "results.xlsx", "informe.md"],
```

Es decir, guarda nombres, no hashes de artefactos.

El starter del You Do tampoco calcula los hashes prometidos.

Una procedencia útil debería poder responder al menos:

- qué entrada exacta se usó;
- qué actividad o script generó el resultado;
- qué versión del código y dependencias intervino;
- quién o qué agente ejecutó la actividad;
- qué artefacto binario exacto fue generado.

El modelo W3C PROV distingue entidades, actividades y agentes precisamente para representar esas relaciones. ([w3.org](https://www.w3.org/TR/prov-overview/))

**Impacto técnico:** dos archivos distintos con el mismo nombre serían indistinguibles.

**Impacto pedagógico:** se confunde inventario de rutas con procedencia verificable.

---

## 10. **P1 — Se sigue enseñando SHA-1 truncado dentro del camino principal**

**Ubicación:** T4-B E2 y demos.

La lección incluye una advertencia correcta: para producción se prefiere SHA-256. No obstante, el ejercicio evaluado exige memorizar:

```python
hashlib.sha1(b"synthetic").hexdigest()[:8]
```

NIST recomienda migrar de SHA-1 a SHA-2 o SHA-3 y retirarlo de las aplicaciones de protección criptográfica. ([nist.gov](https://www.nist.gov/news-events/news/2022/12/nist-retires-sha-1-cryptographic-algorithm))

**Impacto pedagógico:** la práctica recuperada y evaluada es SHA-1, mientras la alternativa correcta aparece como nota secundaria.

**Impacto técnico:** ocho caracteres hexadecimales ofrecen únicamente 32 bits de espacio de identificación; son insuficientes como evidencia de integridad.

Aunque el hash corto se denomine “id didáctico”, no aporta una ventaja pedagógica suficiente para justificar enseñar el patrón obsoleto.

---

## 11. **P1 — El formateo monetario depende de `float` y `round()`**

**Ubicación:** T4-A.

```python
def fmt_pen(x):
    return f"{round(float(x), 1)} PEN"
```

El ejercicio incluso menciona “banker’s rounding” como caso borde, pero no lo aborda.

Una prueba mínima muestra:

```python
round(2.675, 2)       # 2.67
Decimal("2.675")      # puede cuantizarse explícitamente
```

El módulo `decimal` ofrece aritmética decimal y políticas de redondeo configurables mediante `quantize`, incluyendo `ROUND_HALF_UP`. ([docs.python.org](https://docs.python.org/3.11/library/decimal.html))

**Impacto pedagógico:** una sección centrada en paridad entre canales debería enseñar una representación canónica de importes, no solo aplicar el mismo `round()` en varios lugares.

**Impacto operativo:** distintos lenguajes, herramientas o conversiones pueden generar divergencias en casos límite.

---

## 12. **P1 — La mayoría de ejercicios de transferencia no exige transferencia auténtica**

Ejemplos:

- añadir `n={{ n }}` a una plantilla;
- cambiar `0` por `—`;
- sustituir `add_paragraph` por `add_heading`;
- cambiar `a == b` por `a == b == c`;
- sustituir `any()` por `all()`;
- añadir el sufijo ` PEN`.

Los ejercicios son útiles como checks rápidos, pero muchos E3 siguen siendo defect repairs con la solución casi explícita en:

- el TODO;
- el hint;
- el segundo hint;
- la prueba exacta;
- el feedback;
- el starter.

La evidencia sobre aprendizaje recomienda intercalar ejemplos resueltos con problemas en los que el estudiante debe seleccionar y aplicar una estrategia, no limitarse a editar el token indicado. ([ies.ed.gov](https://ies.ed.gov/ncee/wwc/PracticeGuide/1))

**Impacto pedagógico:** se practica reconocimiento local, no diseño de una solución.

**Impacto de nivel:** la demanda es inferior a la esperable para “Competente” y un proyecto de 18 horas.

---

## 13. **P1 — Los casos borde se registran, pero no forman parte del contrato ejecutable**

Ejemplos declarados:

- `NaN float`;
- `locale comma`;
- `key error`;
- ruta no escribible;
- PDF corrupto;
- PDF sin páginas;
- `alts vacía`;
- `None`;
- keys faltantes.

Pero las pruebas normalmente verifican una única salida nominal. No existe un test que confirme qué debe pasar ante esos casos.

Ejemplos concretos:

- el caption declara que debe contener Fuente y `n=40`, pero el test solo comprueba `"Fuente" in cap`;
- el resumen “auditable” solo comprueba que aparezcan los tokens `n=` y `PEN`;
- la accesibilidad solo mide longitud;
- `ready()` no comprueba que existan exactamente las claves obligatorias.

**Impacto de evaluación:** el estudiante puede satisfacer el checker con una salida semánticamente inválida.

**Impacto de transferencia:** los casos borde se convierten en decoración curricular.

---

## 14. **P1 — La revisión visual no conserva evidencia de que alguien miró los artefactos**

La sección afirma:

> “Sin checklist visual completo… no hay cierre CP-N2-B.”

Sin embargo, el checklist es un diccionario de booleanos:

```python
{"dashboard": True, "xlsx": True, "doc": True}
```

No contiene:

- nombre o id del revisor;
- fecha de revisión;
- versión del artefacto;
- captura o render revisado;
- resultado por página/hoja;
- comentario;
- estado de bloqueo;
- regla para impedir que el generador se autoapruebe.

**Impacto pedagógico:** el estudiante aprende a declarar `True`, no a ejecutar ni documentar una inspección visual.

**Impacto de auditoría:** no puede demostrarse qué versión se revisó ni qué defectos fueron aceptados.

---

## 15. **P2 — Las dependencias no están fijadas**

**Evidencia exacta:**

```text
pip install jinja2 python-docx reportlab pypdf pymupdf pillow
```

El curso afirma exigir reproducción y artefactos verificables, pero no proporciona:

- versiones mínimas o exactas;
- archivo de requisitos;
- lock;
- comando de verificación;
- versiones registradas en el manifiesto.

**Impacto técnico:** cambios en pypdf, PyMuPDF, ReportLab o python-docx pueden modificar extracción, render o estilos.

**Impacto pedagógico:** contradice las prácticas de dependencias fijadas que el propio roadmap introduce desde S1.

---

## 16. **P2 — La orientación de seguridad Jinja mezcla términos y omite configuración fail-closed**

**Evidencia:**

> “En HTML confía en autoescape; nunca marques input de usuario con `mark_safe`…”

Problemas:

1. Jinja no activa autoescape por defecto en todos los contextos.
2. Debe configurarse explícitamente con `Environment` y `select_autoescape`.
3. `mark_safe` es terminología asociada principalmente a Django; en Jinja el riesgo visible para el autor es `|safe` o construir un objeto `Markup`.
4. No se usa `StrictUndefined`, pese a que los campos faltantes deben bloquear un reporte.

La documentación oficial de Jinja dice expresamente que autoescape no está habilitado por defecto y recomienda configurar un valor sensible. ([jinja.palletsprojects.com](https://jinja.palletsprojects.com/en/stable/api/))

**Impacto pedagógico:** el estudiante puede inferir que crear `Template(...)` ya ofrece seguridad HTML suficiente.

---

## 17. **P2 — `needs_ocr` simplifica en exceso el diagnóstico de extracción PDF**

La lección presenta una extracción vacía como señal para `needs_ocr`. La política de abstención es positiva, pero el nombre sugiere que OCR es siempre la causa y la solución.

pypdf documenta que:

- no realiza OCR;
- una página imagen-only no producirá texto;
- los PDF carecen de una capa semántica general;
- el posicionamiento, las fuentes, los encodings y la estructura del contenido también pueden dificultar la extracción. ([pypdf.readthedocs.io](https://pypdf.readthedocs.io/en/6.12.0/user/extract-text.html))

Un estado más preciso sería:

```text
text_extraction_unavailable
```

con diagnóstico posterior:

- `image_only`;
- `text_as_paths`;
- `encoding_problem`;
- `corrupt_content_stream`;
- `ocr_candidate`.

**Impacto pedagógico:** evita enseñar la equivalencia incorrecta “texto vacío = escaneo”.

---

## 18. **P2 — Los nombres de salida se sobrescriben entre corridas**

Los demos y ejercicios usan nombres fijos:

- `informe.docx`;
- `informe.pdf`;
- `reporte.docx`;
- `reporte.pdf`;
- `scan.pdf`;
- `estructura.docx`.

No se crea un directorio por `run_id`, no se comprueba colisión y no se conserva la versión previa.

**Impacto técnico:** una segunda ejecución destruye la evidencia de la primera.

**Impacto curricular:** contradice el mensaje de procedencia y trazabilidad.

---

## 19. **P2 — La redacción es comprensible, pero acumula anglicismos y etiquetas internas**

Ejemplos:

- “En analytics y operaciones…”;
- “Reporting Factory”;
- `context`;
- `missing`;
- `caption`;
- `web-only`;
- `a11y`;
- `provenance`;
- `pending_review`;
- “reviewer”;
- “factory”.

No todos deben eliminarse: `pending_review`, `run_id` y nombres de APIs pueden conservarse como literales de código. El problema es que el texto explicativo también depende de ellos.

Mejoras terminológicas:

- analítica;
- fábrica de reportes;
- contexto;
- dato ausente;
- pie de figura;
- solo canal web;
- accesibilidad;
- procedencia o trazabilidad de origen;
- revisión pendiente.

**Impacto pedagógico:** aumenta la carga lingüística sin añadir precisión.

**Impacto editorial:** debilita el objetivo declarado de español profesional es-PE.

---

## 20. **P2 — La justificación para eliminar tildes en ReportLab es innecesaria y confusa**

La sección dice que los demos usan ASCII `sintetico` “a propósito” por Helvetica de ReportLab.

Con el stack actual, una prueba simple con:

```python
c.drawString(..., "Resumen sintético: n=40")
```

conservó y permitió extraer correctamente `sintético`.

Aunque siempre conviene validar la fuente y el encoding reales, la solución pedagógica no debería ser eliminar tildes sin demostrar una incompatibilidad.

**Impacto editorial:** normaliza español incorrecto dentro del código.

**Impacto pedagógico:** presenta ASCII-only como una exigencia técnica general.

---

## 21. **P2 — La teoría y el I Do duplican demasiado contenido**

Cada subtema contiene:

1. tres párrafos;
2. un bloque de código teórico;
3. un callout;
4. otro demo I Do muy similar;
5. tres ejercicios.

Ejemplo: T1-A presenta dos demos distintos de Jinja antes de E1.

La apertura añade además:

- narrativa del comité;
- contrato;
- orden pedagógico;
- plan horario;
- glosario de siete términos;
- instalación;
- reglas de seguridad.

**Impacto cognitivo:** la progresión es correcta, pero hay redundancia entre explicación y modelado. El estudiante debe distinguir dos ejemplos casi equivalentes antes de practicar.

**Impacto de tiempo:** la densidad no se corresponde bien con la abundancia de microejercicios.

---

## 22. **P2 — No hay evaluaciones de tema montadas en la sección visible**

El tipo `CourseSection` permite `topicEvaluations`, y documenta que deberían existir cuatro por sección cuando están montadas.

S21 termina después de `resources` y no incluye esa propiedad.

Esto no demuestra que no exista un banco separado en otra capa, pero sí que la sección visible no expone cuatro evaluaciones auténticas T1–T4.

**Impacto curricular:** entre los microejercicios y el proyecto final falta una evaluación integradora por tema.

---

## 23. **P3 — Los recursos externos tienen duplicación y alineación desigual**

Ejemplos:

- el manual de ReportLab aparece dos veces;
- MIT 6.100L es un refuerzo general de Python, no de reporting;
- la especialización de Data Engineering es demasiado amplia;
- falta una fuente específica sobre accesibilidad de PDF/DOCX;
- falta una referencia primaria sobre procedencia interoperable;
- falta una referencia directa sobre redondeo decimal para importes.

**Impacto pedagógico:** la lista parece extensa, pero el estudiante no recibe una ruta curada para resolver los defectos más importantes de la sección.

---

# 4. Meta-Leak Report

## Resultado

### **No se encontraron leaks clásicos de autoría en la versión actual**

No aparecen en la prosa visible:

- “TODO editorial” fuera de starter code;
- “moved from section X”;
- comentarios de agentes;
- instrucciones al Fixer;
- referencias a lanes o ledgers;
- texto como “el oráculo dice…”;
- notas para desarrolladores.

Los `TODO` dentro de los starters son scaffolds intencionales del ejercicio y no deben clasificarse como leaks.

## Residuo estructural confirmado

| Severidad | Texto/artefacto | Ubicación | Diagnóstico |
|---|---|---|---|
| P1 | `id: "fastapi"` | metadata S21 | Identidad curricular heredada |
| P1 | `s21-fastapi.ts` | filename | Nombre fuente contrario al contenido |
| P1 | `import ... './sections/s21-fastapi'` | `src/lib/course/index.ts` | Propagación del nombre legado |
| P1 | `#fastapi` | enlace profundo derivado del id | Colisiona semánticamente con S41 |

## Elementos que **no** deben eliminarse como leaks

- `CASO-LIM-021`: identificador didáctico útil;
- `CP-N2-B`: referencia curricular válida si se define;
- `run_id`, `pending_review`: literales del contrato técnico;
- “Las APIs HTTP se tratan más adelante”: señalización de roadmap, no comentario editorial.

---
# 5. Pedagogical & Redaction Deep Dive

## 5.1 Connective tissue and curriculum graph

La secuencia macrocurricular es una de las mayores fortalezas:

```text
S18 EDA e incertidumbre
        ↓
S19 visualización accesible
        ↓
S20 workbook reproducible
        ↓
S21 paquete de reportes reconciliado
        ↓
S22 email y aprobación humana
```

S21 recuerda repetidamente que sus números deben coincidir con S18–S20 y deja `pending_review` para S22. Esa conexión evita que DOCX/PDF parezcan un tema de ofimática aislado.

El problema no está en la historia, sino en la implementación del último arco: el You Do no consume realmente los outputs de S19/S20.

### Calidad del flujo interno

El orden T1 → T2 → T3 → T4 es pedagógicamente adecuado:

1. separar datos y presentación;
2. materializar documentos;
3. construir narrativa;
4. verificar, registrar y aprobar.

La introducción de DOCX antes de narrativa también es defendible: primero se fija el contrato del artefacto y luego se redacta su contenido.

No obstante, la apertura está sobrecargada. Antes del primer ejemplo aparecen:

- problema del comité;
- definición del factory;
- dependencia de tres secciones;
- política de PII;
- orden completo;
- plan horario;
- glosario de siete términos;
- exclusiones;
- instalación.

Una mejor progresión distribuiría el glosario al primer uso de cada término.

---

## 5.2 I Do / We Do / You Do fidelity

### I Do

La sección cumple cuantitativamente: ocho demos, uno por subtema. Son ejecutables, breves y normalmente explican el “por qué”.

Los mejores demos son:

- guardar/reabrir DOCX;
- generar PDF y extraer texto;
- mantener `decision=None`;
- usar `all()` para bloquear un paquete incompleto.

### We Do / práctica independiente

La implementación física agrupa 24 tareas bajo `weDo.steps`, aunque cada una lleva `kind`. Esto es una limitación del modelo de datos, pero la prosa agrava el problema al llamarlas “tres We Do”.

Para una liberación gradual real:

- E1 debería incluir más diálogo de decisión y menos solución literal;
- E2 debería retirar parte de los hints;
- E3 debería cambiar tanto datos como estructura de la tarea;
- la solución no debería ser visible antes de un intento;
- E3 debería producir un artefacto o diagnóstico, no solo un booleano.

### You Do

El proyecto tiene buena narrativa, restricciones y rúbrica. La rúbrica suma 100% y cubre técnica, privacidad, pruebas, mantenibilidad y documentación.

La principal carencia es la integración: el proyecto dice “paquete único”, pero no orquesta dashboard/workbook de manera comprobable.

---

## 5.3 Cognitive load and progressive disclosure

La evidencia sobre carga cognitiva recomienda enseñanza explícita, ejemplos resueltos, práctica y feedback, retirando gradualmente el apoyo. ([education.nsw.gov.au](https://education.nsw.gov.au/about-us/education-data-and-research/cese/publications/practical-guides-for-educators/cognitive-load-theory-in-practice))

S21 cumple ejemplos + práctica, pero presenta dos problemas opuestos:

1. **demasiado contenido explicativo duplicado**;
2. **práctica demasiado atomizada**.

El estudiante lee conceptos profesionales densos y luego resuelve tareas como cambiar `any` por `all`. Esa asimetría impide consolidar un esquema completo del factory.

La mejora no consiste en añadir más texto, sino en reemplazar parte de la duplicación por tres casos integradores:

- plantilla + validación fail-closed;
- documento con tabla/figura + alternativa accesible;
- manifiesto reproducible + revisión humana.

---

## 5.4 Exercise and exam alignment

### Matriz de alineación

| Subtema | Teoría | I Do | E1–E3 | Autocheck | Evaluación auténtica |
|---|---:|---:|---:|---:|---:|
| T1-A Contexto Jinja | Sí | Sí | Sí | Sí | No montada |
| T1-B Tablas/formato | Sí | Sí | Sí | Sí | No montada |
| T2-A DOCX | Sí | Sí | Sí | Sí | No montada |
| T2-B PDF/OCR | Sí | Sí | Sí | Duplicada | No montada |
| T3-A Narrativa | Sí | Sí | Sí | **No** | No montada |
| T3-B Fuentes/paridad | Sí | Sí | Parcial | Sí | No montada |
| T4-A Accesibilidad | Sí | Parcial | Defectuoso | **No** | No montada |
| T4-B Procedencia | Sí | Parcial | Sí | Sí | No montada |

La cantidad de ejercicios es correcta, pero la alineación cualitativa es desigual.

### Problemas de medición

Varias comprobaciones validan la presencia de tokens, no el constructo:

- `Fuente` presente;
- `n=` presente;
- alt largo;
- archivo con tamaño > 0;
- lista de booleans.

Estas pruebas son fáciles de automatizar, pero insuficientes para evaluar reporting profesional.

---

## 5.5 Technical-writing and Peruvian Spanish audit

### Fortalezas

- tono cercano y profesional;
- buenos ejemplos de consecuencias;
- distinción clara entre evidencia y decisión;
- ausencia de promesas de impacto no demostrado;
- uso consistente de datos sintéticos;
- instrucciones generalmente accionables;
- términos como “mediana”, “muestra”, “fuente”, “limitación” y “revisión humana” están bien usados.

### Debilidades

- densidad de inglés en la prosa;
- frases muy largas con múltiples paréntesis;
- mezcla de texto ejecutivo y lenguaje de implementación;
- algunos términos no se glosan al primer uso;
- “analytics” es menos natural que “analítica”;
- “n Cusco bajo” debería ser “n de Cusco bajo”;
- el uso intencional de `sintetico` sin tilde reduce calidad editorial.

La mejor política no es traducir todo. Los identificadores de código deben conservarse; la explicación circundante debería ser española.

---

## 5.6 Technical correctness against external benchmarks

### Jinja

La separación datos/presentación está bien planteada y coincide con la filosofía oficial de Jinja. No obstante, el entorno debe configurar autoescape explícitamente y usar `StrictUndefined` para bloquear campos faltantes. ([jinja.palletsprojects.com](https://jinja.palletsprojects.com/en/stable/api/))

### DOCX

La insistencia en estilos reales y en reabrir el documento es técnicamente correcta. `python-docx` expone los estilos mediante `style.name`, incluidos `Heading 1` y `Heading 2`. ([python-docx.readthedocs.io](https://python-docx.readthedocs.io/en/stable/user/styles-using.html))

### PDF

La distinción entre PDF digital y escaneado es valiosa. pypdf no hace OCR y no puede extraer texto incorporado exclusivamente como imagen. También advierte que PDF no ofrece por sí mismo una capa semántica equivalente a un documento estructurado. ([pypdf.readthedocs.io](https://pypdf.readthedocs.io/en/6.12.0/user/extract-text.html))

### Accesibilidad

WCAG exige alternativas que cumplan el propósito equivalente. Un límite de caracteres no basta. Para gráficos complejos se necesita una descripción o versión textual que comunique la información. ([w3.org](https://www.w3.org/WAI/WCAG22/Understanding/non-text-content))

### Procedencia

El manifiesto actual tiene la idea correcta, pero no representa adecuadamente entrada, actividad generadora, agente y derivaciones como propone W3C PROV. ([w3.org](https://www.w3.org/TR/prov-overview/))

### Integridad

SHA-1 no debe ser el patrón principal de una lección moderna de trazabilidad. NIST recomienda SHA-2 o SHA-3. ([nist.gov](https://www.nist.gov/news-events/news/2022/12/nist-retires-sha-1-cryptographic-algorithm))

### Importes

`Decimal` con política explícita de cuantización ofrece un contrato más reproducible para importes que `round(float(...))`. ([docs.python.org](https://docs.python.org/3.11/library/decimal.html))

---

# 6. Proposed GitHub-style Diffs

> Propuestas exclusivamente. No se aplicaron cambios.

## Diff A — Corregir identidad S21 y conservar compatibilidad del hash

**Cubre:** I-05.

```diff
diff --git a/src/lib/course/sections/s21-fastapi.ts b/src/lib/course/sections/s21-reporting-factory.ts
similarity index 99%
rename from src/lib/course/sections/s21-fastapi.ts
rename to src/lib/course/sections/s21-reporting-factory.ts
--- a/src/lib/course/sections/s21-fastapi.ts
+++ b/src/lib/course/sections/s21-reporting-factory.ts
@@
 export const section21: CourseSection = {
- id: "fastapi",
+ id: "reporting-factory",
  index: 21,
```

```diff
diff --git a/src/lib/course/index.ts b/src/lib/course/index.ts
--- a/src/lib/course/index.ts
+++ b/src/lib/course/index.ts
@@
-import { section21 } from './sections/s21-fastapi'
+import { section21 } from './sections/s21-reporting-factory'
@@
 export const COURSE_SECTIONS: CourseSection[] = [
@@
 ]
+
+export const LEGACY_SECTION_ID_ALIASES: Record<string, string> = {
+  fastapi: 'reporting-factory',
+}
+
+export function resolveSectionId(id: string): string {
+  return LEGACY_SECTION_ID_ALIASES[id] ?? id
+}
```

El resolver de hash debe llamar `resolveSectionId()` para no romper marcadores existentes.

---

## Diff B — Restaurar la taxonomía correcta de liberación gradual

**Cubre:** I-04.

```diff
diff --git a/src/lib/course/sections/s21-reporting-factory.ts b/src/lib/course/sections/s21-reporting-factory.ts
--- a/src/lib/course/sections/s21-reporting-factory.ts
+++ b/src/lib/course/sections/s21-reporting-factory.ts
@@
- "Orden pedagógico (no saltes adelante): **T1 Plantillas** ... En cada subtema: teoría → demo I Do → tres We Do (guiada, independiente, transferencia).",
+ "Orden pedagógico (no saltes adelante): **T1 Plantillas** ... En cada subtema: teoría → demo I Do → E1 práctica guiada (We Do) → E2 práctica independiente con menos apoyo → E3 transferencia independiente.",
@@
- intro: "We Do — practica el mini-factory en piezas (T1→T4). Cada starter es un scaffold incompleto o incorrecto a propósito...",
+ intro: "Práctica gradual — en cada subtema, E1 se resuelve con guía, E2 retira parte del apoyo y E3 cambia el contexto para comprobar transferencia. Intenta cada tarea antes de abrir la solución.",
```

---

## Diff C — Usar un entorno Jinja explícito y fallar ante variables ausentes

**Cubre:** I-06 e I-16.

```diff
@@
- from jinja2 import Environment, Template, select_autoescape
+ from jinja2 import Environment, StrictUndefined, select_autoescape

- tmpl = Template("Región {{ region }}: mediana {{ median }} PEN (n={{ n }})")
+ env = Environment(
+     autoescape=select_autoescape(
+         enabled_extensions=("html", "xml"),
+         default_for_string=True,
+     ),
+     undefined=StrictUndefined,
+ )
+ tmpl = env.from_string(
+     "Región {{ region }}: mediana {{ median }} PEN (n={{ n }})"
+ )
@@
- "Contrato operativo: `Template(...).render(**ctx)`. En HTML confía en autoescape; nunca marques input de usuario con `mark_safe` sin sanitizar.",
+ "Contrato operativo: crea un `Environment` con autoescape explícito para HTML/XML y `StrictUndefined` para bloquear campos ausentes. No uses el filtro `|safe` ni objetos `Markup` con contenido no confiable.",
```

```diff
@@ S21-T1-A-E1
- edgeCases: ["n omitido en render → vacío en el hueco"],
+ edgeCases: ["n omitido → `UndefinedError`; el reporte no se genera"],
```

---

## Diff D — Sustituir el gate falso de accesibilidad

**Cubre:** I-01 e I-02.

```diff
@@
- def a11y_min(has_h1, alts):
-  return has_h1 and all(len(a) > 10 for a in alts)
+ def a11y_machine_check(has_h1, alts, has_text_equivalents):
+  normalized = [a.strip() for a in alts]
+  non_placeholder = all(
+      a.lower() not in {"imagen", "gráfico", "figura", "chart"}
+      for a in normalized
+  )
+  return (
+      has_h1
+      and bool(normalized)
+      and all(normalized)
+      and non_placeholder
+      and has_text_equivalents
+  )
+
+ def a11y_review_record(machine_check, reviewer, evidence_path):
+  return {
+      "machine_check": machine_check,
+      "manual_review_required": True,
+      "reviewer": reviewer,
+      "evidence_path": evidence_path,
+  }
@@
- print(a11y_min(True, ["descripcion larga de figura"]))
- print(a11y_min(True, ["corto"]))
+ print(a11y_machine_check(
+     True,
+     ["Barras de mediana por región; Lima 28 PEN y Cusco 22.5 PEN."],
+     True,
+ ))
+ print(a11y_machine_check(True, [], False))
```

```diff
@@
- "Checklist mínimo (`has_h1` + alts con longitud útil > 10) evita publicar un paquete ilegible...",
+ "El chequeo automático solo detecta ausencias y placeholders. Cada gráfico requiere una alternativa textual equivalente —por ejemplo, una tabla y una conclusión limitada— y una revisión manual registrada. No declares el PDF accesible únicamente porque se pueda renderizar o extraer texto."
```

---

## Diff E — Incorporar figura, tabla y alternativa textual reales

**Cubre:** I-07.

```diff
@@ S21-T3-B-DEMO
- dash = {"median_Lima": 28.0}
- xlsx = {"median_Lima": 28.0}
- doc = {"median_Lima": 28.0}
- limits = ["cobertura web", "n Cusco bajo"]
- parity = dash == xlsx == doc
- bundle = {"parity": parity, "limits": limits, "fuente": "sintético"}
- print(bundle)
+ from docx import Document
+
+ metrics = [
+     {"region": "Lima", "median": "28.0 PEN", "n": 40},
+     {"region": "Cusco", "median": "22.5 PEN", "n": 18},
+ ]
+ doc = Document()
+ doc.add_heading("Hallazgos", level=1)
+ doc.add_paragraph(
+     "Figura 1. Ticket mediano por región. "
+     "Fuente: dataset sintético; cobertura: solo canal web."
+ )
+ table = doc.add_table(rows=1, cols=3)
+ for cell, heading in zip(table.rows[0].cells, ["Región", "Mediana", "n"]):
+     cell.text = heading
+ for row in metrics:
+     cells = table.add_row().cells
+     cells[0].text = row["region"]
+     cells[1].text = row["median"]
+     cells[2].text = str(row["n"])
+ doc.add_paragraph(
+     "Alternativa textual: Lima presenta una mediana de 28.0 PEN "
+     "(n=40), frente a 22.5 PEN en Cusco (n=18)."
+ )
+ doc.save("reporting-run/informe.docx")
```

E3 debe modificar región, métrica y limitación, y demostrar que la tabla, el caption y la alternativa usan el mismo contexto.

---

## Diff F — Integrar realmente S19 y S20 en el You Do

**Cubre:** I-08.

```diff
@@
+ def load_dashboard_metrics(path: Path) -> dict:
+     """Lee el JSON de métricas exportado por S19."""
+     return json.loads(path.read_text(encoding="utf-8"))
+
+ def load_workbook_metrics(path: Path) -> dict:
+     """Lee las celdas/named ranges acordadas con S20."""
+     from openpyxl import load_workbook
+     wb = load_workbook(path, data_only=True, read_only=True)
+     ws = wb["Resultados"]
+     return {
+         "median_Lima": ws["B2"].value,
+         "n_Lima": ws["B3"].value,
+     }
+
+ def reconcile_inputs(ctx, dashboard_metrics, workbook_metrics):
+     expected = {
+         "median_Lima": ctx["median_Lima"],
+         "n_Lima": ctx["n_Lima"],
+     }
+     if dashboard_metrics != expected or workbook_metrics != expected:
+         raise ValueError("parity_failed")
+     return expected
@@
- # docx_path = build_docx(context)
+ # dashboard = load_dashboard_metrics(Path("inputs/dashboard-metrics.json"))
+ # workbook = load_workbook_metrics(Path("inputs/resultados.xlsx"))
+ # reconcile_inputs(context, dashboard, workbook)
+ # docx_path = build_docx(context)
```

Añadir a requisitos:

```diff
+ "El factory falla antes de generar documentos si dashboard, workbook y context no tienen la misma mediana y n",
+ "La figura y la tabla del informe provienen de los artefactos reconciliados, no de valores reescritos manualmente",
```

---

## Diff G — Procedencia real con SHA-256

**Cubre:** I-09 e I-10.

```diff
@@
- "data_sha1_8": hashlib.sha1(b"synthetic").hexdigest()[:8],
- "artifacts": artifacts,
+ "input_sha256": hashlib.sha256(input_path.read_bytes()).hexdigest(),
+ "artifact_sha256": {
+     name: hashlib.sha256(Path(path).read_bytes()).hexdigest()
+     for name, path in artifacts.items()
+ },
+ "generator": {
+     "section": "S21",
+     "script": "reporting_factory.py",
+     "git_commit": git_commit,
+     "python": platform.python_version(),
+     "dependencies": dependency_versions,
+ },
+ "activity": {
+     "started_at": started_at,
+     "completed_at": completed_at,
+     "actor": actor,
+ },
```

```diff
@@ S21-T4-B-E2
- "E2 ... Calcula sha1 de b\"synthetic\" y muestra solo los primeros 8 hex.",
+ "E2 ... Calcula SHA-256 del archivo de entrada y comprueba que modificar un byte cambia la huella.",
```

Eliminar todos los campos `data_sha1_8`.

---

## Diff H — Usar `Decimal` para las métricas monetarias

**Cubre:** I-11.

```diff
@@
- def fmt_pen(x):
-     return f"{round(float(x), 1)} PEN"
+ from decimal import Decimal, ROUND_HALF_UP
+
+ ONE_DECIMAL = Decimal("0.1")
+
+ def fmt_pen(value):
+     amount = Decimal(str(value)).quantize(
+         ONE_DECIMAL,
+         rounding=ROUND_HALF_UP,
+     )
+     return f"{amount} PEN"
```

Añadir casos:

```python
assert fmt_pen("28.04") == "28.0 PEN"
assert fmt_pen("28.05") == "28.1 PEN"
assert fmt_pen(Decimal("2.675")) == "2.7 PEN"
```

La política de redondeo debe aparecer en el manifiesto.

---

## Diff I — Fijar dependencias reproducibles

**Cubre:** I-15.

```diff
diff --git a/labs/s21-reporting/requirements.txt b/labs/s21-reporting/requirements.txt
new file mode 100644
--- /dev/null
+++ b/labs/s21-reporting/requirements.txt
@@
+Jinja2==3.1.6
+python-docx==1.2.0
+reportlab==4.4.9
+pypdf==6.12.0
+PyMuPDF==1.26.7
+Pillow==12.2.0
+openpyxl==3.1.5
```

```diff
@@
- "En tu venv: `pip install jinja2 python-docx reportlab pypdf pymupdf pillow`.",
+ "En un venv limpio ejecuta `python -m pip install -r labs/s21-reporting/requirements.txt`. Registra `python --version` y `python -m pip freeze` en la evidencia de la corrida.",
```

Las versiones deben validarse contra la CI antes de aplicar el diff; el objetivo del parche es fijar el entorno, no imponer versiones sin pruebas.

---

## Diff J — Convertir E3 en transferencia auténtica

**Cubre:** I-12 e I-13.

Ejemplo para T3-B:

```diff
@@ S21-T3-B-E3
- "Implementa `check_parity(a, b, c)` que sea True solo si a == b == c.",
+ "Recibe tres archivos: `dashboard-metrics.json`, `resultados.xlsx` e `informe.docx`. Extrae `median_Lima` y `n_Lima` de cada uno, devuelve un reporte de diferencias por campo y bloquea el paquete si existe una divergencia."
@@
- tests: "dos líneas: True luego False",
+ tests: """
+ caso normal: los tres artefactos pasan;
+ caso borde: 28 y 28.0 se normalizan según la política Decimal;
+ caso de error: DOCX=30.0 genera parity_failed con campo y valores;
+ caso incompleto: falta n_Lima en el dashboard y el reporte falla cerrado
+ """,
```

Aplicar el mismo patrón a cada E3:

- nuevo contexto;
- selección de estrategia;
- archivo o estructura real;
- caso nominal;
- borde;
- error;
- explicación del resultado.

---

## Diff K — Conservar evidencia real de revisión visual

**Cubre:** I-14.

```diff
@@
 def manifest(artifacts: dict) -> dict:
@@
+    review = {
+        "status": "pending_review",
+        "reviewer": None,
+        "reviewed_at": None,
+        "evidence": {
+            "dashboard_screenshot": None,
+            "workbook_render": None,
+            "docx_pdf_render": None,
+        },
+        "checks": {
+            "no_clipped_text": None,
+            "tables_readable": None,
+            "captions_match": None,
+            "accessible_equivalent_present": None,
+        },
+        "comments": [],
+    }
```

El generador solo crea valores `None`; una herramienta o persona distinta registra la revisión. `ready()` debe rechazar `None` y exigir evidencia existente.

---

## Diff L — Crear outputs inmutables por corrida

**Cubre:** I-18.

```diff
@@
+ def run_directory(run_id: str) -> Path:
+     path = Path("outputs") / run_id
+     path.mkdir(parents=True, exist_ok=False)
+     return path
@@
- path = Path("informe.docx")
+ path = output_dir / "informe.docx"
@@
- pdf = Path("informe.pdf")
+ pdf = output_dir / "informe.pdf"
```

Si el `run_id` ya existe, la ejecución debe detenerse o exigir una opción explícita de reanudación; nunca sobrescribir por defecto.

---

## Diff M — Mejorar diagnóstico de PDF

**Cubre:** I-17.

```diff
@@
- status = {"needs_ocr": not bool(text.strip()), "n_chars": len(text)}
+ status = {
+     "text_extraction": (
+         "available" if text.strip() else "unavailable"
+     ),
+     "diagnosis": (
+         "image_only_candidate" if page_has_images and not text.strip()
+         else "requires_inspection"
+     ),
+     "ocr_candidate": bool(page_has_images and not text.strip()),
+     "n_chars": len(text),
+ }
```

La prosa debe decir que OCR es una ruta posible, no una inferencia concluyente.

---

## Diff N — Normalizar redacción y recuperar tildes

**Cubre:** I-19 e I-20.

```diff
@@
- "En analytics y operaciones en Perú..."
+ "En equipos de analítica y operaciones en Perú..."
@@
- "**Reporting Factory**"
+ "**fábrica de reportes** (`Reporting Factory`)"
@@
- "missing"
+ "dato ausente (`missing`)"
@@
- "caption"
+ "pie de figura (`caption`)"
@@
- "provenance"
+ "procedencia (`provenance`)"
@@
- c.drawString(72, 760, "Resumen sintetico: n=40")
+ c.drawString(72, 760, "Resumen sintético: n=40")
```

Conservar los nombres exactos de campos de código, pero explicar su significado en español la primera vez.

---

## Diff O — Completar el autocheck con cobertura 1:1

**Cubre:** I-03.

Reemplazar la segunda pregunta redundante de T2-B por T3-A:

```diff
@@
 {
- question: "El PDF del informe se generó dibujando texto dentro de una imagen...",
- options: [...],
- correctIndex: 0,
- explanation: "...",
+ question: "¿Qué hace auditable a un hallazgo ejecutivo?",
+ options: [
+   "Un id, una afirmación limitada y una referencia explícita a evidencia",
+   "Una recomendación de negocio sin tabla",
+   "Un adjetivo convincente",
+   "Una conclusión sin tamaño de muestra"
+ ],
+ correctIndex: 0,
+ explanation:
+   "El hallazgo debe permitir volver a la tabla o figura que lo sostiene; la decisión de negocio permanece separada.",
 },
```

Añadir el octavo ítem para T4-A:

```diff
+{
+ question: "¿Qué evidencia mínima sostiene que un gráfico es accesible?",
+ options: [
+   "Una alternativa textual que comunique la información y una revisión registrada",
+   "Un alt de más de diez caracteres",
+   "Un PNG con tamaño mayor que cero",
+   "Usar colores de alto contraste sin tabla ni descripción"
+ ],
+ correctIndex: 0,
+ explanation:
+   "La longitud no demuestra equivalencia. La alternativa debe comunicar el propósito y los datos relevantes del gráfico.",
+},
```

Después del cambio, documentar explícitamente el mapeo de cada pregunta a `S21-Tn-X`.

---

## Diff P — Montar cuatro evaluaciones auténticas de tema

**Cubre:** I-22.

```diff
@@
 export const section21: CourseSection = {
@@
+ topicEvaluations: [
+   {
+     id: "S21-T1-EVAL",
+     topic_id: "S21-T1",
+     title: "Plantilla fail-closed y tabla de datos ausentes",
+     subtopics_covered: ["S21-T1-A", "S21-T1-B"],
+     tasks: [
+       {
+         id: "S21-T1-EVAL-A",
+         title: "Render reproducible",
+         authentic: true,
+         deliverable:
+           "Plantilla Jinja con StrictUndefined, política Decimal y tests de campo ausente",
+       },
+     ],
+     rubric_0_3: REPORTING_RUBRIC,
+   },
+   {
+     id: "S21-T2-EVAL",
+     topic_id: "S21-T2",
+     title: "Artefactos DOCX/PDF verificables",
+     subtopics_covered: ["S21-T2-A", "S21-T2-B"],
+     tasks: [/* DOCX reabierto + PDF digital/image-only */],
+     rubric_0_3: REPORTING_RUBRIC,
+   },
+   {
+     id: "S21-T3-EVAL",
+     topic_id: "S21-T3",
+     title: "Informe con evidencia y paridad",
+     subtopics_covered: ["S21-T3-A", "S21-T3-B"],
+     tasks: [/* hallazgo, tabla, figura, limitación y reconciliación */],
+     rubric_0_3: REPORTING_RUBRIC,
+   },
+   {
+     id: "S21-T4-EVAL",
+     topic_id: "S21-T4",
+     title: "Accesibilidad, procedencia y revisión",
+     subtopics_covered: ["S21-T4-A", "S21-T4-B"],
+     tasks: [/* alternativa equivalente + manifest SHA-256 + review record */],
+     rubric_0_3: REPORTING_RUBRIC,
+   },
+ ],
```

Los comentarios del ejemplo deben convertirse en objetos completos antes de aplicar el parche.

---

## Diff Q — Curar recursos según los gaps reales

**Cubre:** I-23.

```diff
@@ resources
- { label: "ReportLab user guide (PDF)", ... },  // duplicado
- { label: "MIT 6.100L", ... },
- { label: "deeplearning.ai — Data Engineering (concepts)", ... },
+ {
+   label: "Jinja API — autoescape y StrictUndefined",
+   url: "https://jinja.palletsprojects.com/en/stable/api/",
+   note: "Configuración fail-closed de plantillas",
+ },
+ {
+   label: "WCAG 2.2 — Non-text Content",
+   url: "https://www.w3.org/WAI/WCAG22/Understanding/non-text-content",
+   note: "Alternativas equivalentes para gráficos y figuras",
+ },
+ {
+   label: "W3C PROV Overview",
+   url: "https://www.w3.org/TR/prov-overview/",
+   note: "Entidades, actividades y agentes de procedencia",
+ },
+ {
+   label: "Python Decimal",
+   url: "https://docs.python.org/3/library/decimal.html",
+   note: "Cuantización y política de redondeo reproducible",
+ },
+ {
+   label: "NIST — transición desde SHA-1",
+   url: "https://www.nist.gov/news-events/news/2022/12/nist-retires-sha-1-cryptographic-algorithm",
+   note: "Uso de SHA-2/SHA-3 para integridad",
+ },
```

---
# 7. Recommended Priority Order for Fixing

## P0 — Antes de declarar S21 accesible

1. Corregir `all([])` y retirar la longitud del alt como criterio suficiente.
2. Definir una alternativa textual equivalente por gráfico.
3. Separar chequeos automáticos de revisión manual.
4. No declarar PDF accesible sin estructura o alternativa accesible verificable.

## P1 — Antes del próximo release curricular

5. Completar ocho preguntas, una por subtema.
6. Corregir la taxonomía E1/E2/E3.
7. Renombrar la identidad `fastapi` con alias de compatibilidad.
8. Usar `StrictUndefined` y fallar ante campos Jinja ausentes.
9. Integrar outputs reales de S19 y S20 en el You Do.
10. Incluir tablas y figuras reales en T3-B.
11. Sustituir SHA-1 por SHA-256.
12. Completar el manifiesto con hashes, versiones, actividad y actor.
13. Sustituir `float` por `Decimal` para importes.
14. Convertir los E3 en tareas de transferencia auténtica.
15. Ejecutar los casos borde que hoy solo aparecen como etiquetas.
16. Registrar evidencia de revisión visual, no únicamente booleanos.
17. Montar las cuatro evaluaciones de tema.

## P2 — Endurecimiento pedagógico y editorial

18. Fijar dependencias.
19. Crear directorios inmutables por `run_id`.
20. Refinar el diagnóstico PDF/OCR.
21. Reducir duplicación teoría/I Do.
22. Distribuir el glosario mediante introducción progresiva.
23. Normalizar español es-PE y recuperar tildes.
24. Curar recursos externos.

## P3 — Pulido

25. Eliminar duplicados en recursos.
26. Revisar frases largas y paréntesis.
27. Añadir una matriz explícita outcome → demo → ejercicios → pregunta → evaluación.

---

# 8. Graph Memory Update Notes

```yaml
section:
  id: S21
  current_platform_id: fastapi
  recommended_platform_id: reporting-factory
  title: Documentos, plantillas y reportes trazables
  level: Competente
  hours: 18
  score: 7.3
  verdict: strong_domain_spine_with_unproven_accessibility_and_assessment_gaps

roadmap_edges:
  upstream:
    - S18: EDA e incertidumbre
    - S19: visualización accesible
    - S20: workbook reproducible
  downstream:
    - S22: email y aprobación humana
  capstone:
    - CP-N2-B: Accessible Insights Dashboard & Reporting Factory

concept_nodes:
  - jinja_context
  - strict_undefined
  - missing_not_zero
  - docx_real_styles
  - pdf_digital_vs_image
  - finding_to_evidence
  - cross_artifact_parity
  - decimal_policy
  - accessible_text_equivalent
  - provenance_manifest
  - artifact_sha256
  - visual_review_record
  - human_approval

strong_edges:
  - context -> multiple_artifacts
  - missing -> explicit_representation
  - docx -> save_reopen_verify
  - pdf -> extract_and_render
  - finding -> evidence_id
  - artifact_bundle -> pending_review
  - S21 -> S22_human_approval

broken_or_weak_edges:
  - accessible_claim -> actual_accessibility_evidence
  - T3B_theory -> real_figure_table_embedding
  - one_run_claim -> S19_S20_input_integration
  - provenance_claim -> artifact_hashes
  - edge_case_metadata -> executable_tests
  - E3_transfer_label -> authentic_transfer
  - eight_subtopics -> seven_selfcheck_items
  - fastapi_id -> reporting_topic

critical_defects:
  - a11y_all_empty_true
  - selfcheck_7_not_8
  - fastapi_identity_collision
  - sha1_truncated_as_assessed_pattern
  - float_round_for_PEN
  - silent_jinja_undefined
  - visual_review_boolean_without_evidence

meta_leak_status:
  classic_author_leaks: 0
  structural_legacy_residue: 1
  residue: fastapi_id_filename_hash

fix_dependencies:
  accessibility:
    before:
      - capstone_accessible_claim
      - T4A_exam_item
      - release_gate
  identity_migration:
    requires:
      - hash_alias
      - index_import_update
      - bookmark_regression_test
  provenance:
    requires:
      - run_specific_directories
      - sha256_artifact_hashes
      - generator_version
      - reviewer_evidence

recommended_regression_tests:
  - empty_alt_list_fails
  - placeholder_alt_fails
  - text_equivalent_required
  - missing_jinja_variable_raises
  - selfcheck_has_8_unique_subtopic_ids
  - S21_hash_reporting_factory_resolves
  - legacy_fastapi_hash_redirects
  - dashboard_xlsx_doc_parity_failure_blocks
  - sha256_changes_when_artifact_changes
  - second_run_does_not_overwrite_first
  - decimal_rounding_policy_is_consistent
  - review_cannot_be_approved_by_generator
```

**This is the complete Explorer report for Section 21. Ready for the Fixer prompt.**
