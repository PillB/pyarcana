/**
 * Genera el learning_roadmap.md con el detalle completo de cada sección.
 */
const fs = require('fs')
const path = require('path')

const sectionsDir = 'src/lib/course/sections'
const files = fs.readdirSync(sectionsDir).filter(f => f.endsWith('.ts')).sort()

const sections = []

for (const file of files) {
  const content = fs.readFileSync(path.join(sectionsDir, file), 'utf-8')

  const id = content.match(/id:\s*'([^']+)'/)?.[1] || ''
  const index = parseInt(content.match(/index:\s*(\d+)/)?.[1] || '0')
  const title = content.match(/title:\s*'([^']+)'/)?.[1] || ''
  const tagline = content.match(/tagline:\s*'([^']+)'/)?.[1] || ''
  const hours = parseInt(content.match(/estimatedHours:\s*(\d+)/)?.[1] || '0')
  const level = content.match(/level:\s*'([^']+)'/)?.[1] || ''
  const icon = content.match(/icon:\s*'([^']+)'/)?.[1] || ''
  const jobRelevance = content.match(/jobRelevance:\s*\n?\s*'([^']+)'/)?.[1] || ''

  // Learning outcomes
  const learningOutcomes = [...content.matchAll(/text:\s*'([^']+)'/g)].map(m => m[1]).filter(t => t.length > 20 && !t.includes('Error'))

  // Theory headings
  const theoryHeadings = [...content.matchAll(/heading:\s*'([^']+)'/g)].map(m => m[1])

  // I Do steps (description field)
  const iDoSteps = [...content.matchAll(/description:\s*'([^']+)'/g)].map(m => m[1])

  // We Do steps (instruction field)
  const weDoSteps = [...content.matchAll(/instruction:\s*'([^']+)'/g)].map(m => m[1])

  // You Do title
  const youDoTitle = content.match(/title:\s*'([^']+)',\s*\n\s*context:/)?.[1] || ''
  const youDoContext = content.match(/context:\s*\n\s*'([^']+)'/)?.[1] || ''

  // Self-check questions
  const selfCheckQuestions = [...content.matchAll(/question:\s*'([^']+)'/g)].map(m => m[1])

  // Resources
  const resourceDocs = [...content.matchAll(/label:\s*'([^']+)',\s*url:/g)].map(m => m[1])

  sections.push({
    id, index, title, tagline, hours, level, icon, jobRelevance,
    learningOutcomes, theoryHeadings, iDoSteps, weDoSteps,
    youDoTitle, youDoContext, selfCheckQuestions, resourceDocs,
  })
}

// Generate markdown
let md = `# Learning Roadmap — El Arte de Python

> **Curso**: El Arte de Python — De cero a Data Scientist
> **Idioma**: Español peruano
> **Pedagogía**: I Do / We Do / You Do (Gradual Release of Responsibility)
> **Total**: ${sections.length} secciones · ${sections.reduce((s, x) => s + x.hours, 0)} horas estimadas
> **Fecha**: ${new Date().toISOString().split('T')[0]}
>
> Este documento está diseñado para que expertos revisen la estructura curricular, el flujo de aprendizaje, la cobertura de temas y la progresión pedagógica. Cada sección incluye: objetivos de aprendizaje, temas de teoría, ejercicios guiados (I Do / We Do), proyecto práctico (You Do), preguntas de auto-evaluación y recursos.

---

## Tabla de Contenidos

| # | Sección | Horas | Nivel | Proyecto (You Do) |
|---|---------|-------|-------|-------------------|
`

for (const s of sections) {
  md += `| ${s.index} | [${s.title}](#${s.index}-${s.title.toLowerCase().replace(/[^a-z]+/g, '-')}) | ${s.hours}h | ${s.level} | ${s.youDoTitle.split('—')[0].trim()} |\n`
}

md += `\n---\n\n## Flujo de Aprendizaje\n\n`

md += `\`\`\`
Secciones 1-6: Fundamentos de Python (Setup → Basics → Data Structures → Functions → OOP → NumPy)
                  ↓
Sección 7: Adquisición de Datos (scraping, regex, SQL, APIs, generators) ← NUEVA
                  ↓
Secciones 8-9: Análisis y Visualización (Pandas → Visualization con Leaflet)
                  ↓
Secciones 10-11: ML y Testing (scikit-learn → pytest + CI)
                  ↓
Secciones 12-13: Producción y Automatización (Performance/Logging → RPA con IA)
                  ↓
CAPSTONE PROGRESIVO: Familiarity Score Dashboard (Excel upload → entity resolution → mapa → scoring)
\`\`\`\n\n`

md += `### Capstone Progresivo: Familiarity Score Dashboard\n\n`
md += `El **Familiarity Score Dashboard** (feature solicitada por el VP) se integra como un capstone progresivo que se construye a lo largo de múltiples secciones:\n\n`
md += `- **Sección 6 (NumPy)**: Procesamiento vectorizado de datos de clientes\n`
md += `- **Sección 7 (Data Acquisition)**: Adquirir datos de clientes desde Excel/CSV/SQL\n`
md += `- **Sección 8 (Pandas)**: EDA y limpieza de datos demográficos\n`
md += `- **Sección 9 (Visualization)**: Mapa interactivo con Leaflet mostrando ubicación de clientes\n`
md += `- **Sección 12 (Performance)**: Optimizar el algoritmo de entity resolution para datasets grandes\n`
md += `- **Sección 13 (RPA)**: Automatizar el pipeline completo (Excel → análisis → reporte)\n\n`

md += `---\n\n`

for (const s of sections) {
  md += `## ${s.index}. ${s.title}\n\n`
  md += `> **Tagline**: ${s.tagline}\n`
  md += `> **Nivel**: ${s.level} · **Horas estimadas**: ${s.hours}h · **Ícono**: ${s.icon}\n\n`

  // Job relevance
  if (s.jobRelevance) {
    md += `### Relevancia laboral\n\n`
    md += `${s.jobRelevance}\n\n`
  }

  // Learning outcomes
  md += `### Objetivos de aprendizaje\n\n`
  for (const lo of s.learningOutcomes) {
    md += `- ${lo}\n`
  }
  md += `\n`

  // Theory topics
  md += `### Temas de teoría\n\n`
  for (let i = 0; i < s.theoryHeadings.length; i++) {
    md += `${i + 1}. **${s.theoryHeadings[i]}**\n`
  }
  md += `\n`

  // I Do
  md += `### I Do — Demostración guiada (Yo hago)\n\n`
  md += `*El instructor demuestra paso a paso con explicación del "por qué" de cada línea.*\n\n`
  for (let i = 0; i < s.iDoSteps.length; i++) {
    md += `${i + 1}. ${s.iDoSteps[i]}\n`
  }
  md += `\n`

  // We Do
  md += `### We Do — Práctica guiada (Hacemos juntos)\n\n`
  md += `*El estudiante escribe código con guía. Se provee starter code, hints y solución.*\n\n`
  if (s.weDoSteps.length > 0) {
    for (let i = 0; i < s.weDoSteps.length; i++) {
      md += `${i + 1}. ${s.weDoSteps[i]}\n`
    }
  } else {
    md += `*(Ejercicios integrados en la teoría)*\n`
  }
  md += `\n`

  // You Do
  md += `### You Do — Proyecto de portafolio (Tú haces)\n\n`
  md += `**Proyecto**: ${s.youDoTitle}\n\n`
  if (s.youDoContext) {
    md += `${s.youDoContext}\n\n`
  }
  md += `\n`

  // Self-check
  md += `### Auto-evaluación (conceptos evaluados)\n\n`
  md += `*Examen con 3 intentos máximo, 3 variantes por concepto (anti-plagio), 70% para aprobar.*\n\n`
  if (s.selfCheckQuestions.length > 0) {
    for (let i = 0; i < s.selfCheckQuestions.length; i++) {
      md += `${i + 1}. ${s.selfCheckQuestions[i]}\n`
    }
  }
  md += `\n`

  // Resources
  if (s.resourceDocs.length > 0) {
    md += `### Recursos principales\n\n`
    for (const r of s.resourceDocs.slice(0, 5)) {
      md += `- ${r}\n`
    }
    md += `\n`
  }

  md += `---\n\n`
}

// Summary stats
md += `## Estadísticas del curso\n\n`
md += `| Métrica | Valor |\n|---|---|\n`
md += `| Total de secciones | ${sections.length} |\n`
md += `| Horas estimadas totales | ${sections.reduce((s, x) => s + x.hours, 0)}h |\n`
md += `| Objetivos de aprendizaje | ${sections.reduce((s, x) => s + x.learningOutcomes.length, 0)} |\n`
md += `| Bloques de teoría | ${sections.reduce((s, x) => s + x.theoryHeadings.length, 0)} |\n`
md += `| Ejercicios I Do | ${sections.reduce((s, x) => s + x.iDoSteps.length, 0)} |\n`
md += `| Ejercicios We Do | ${sections.reduce((s, x) => s + x.weDoSteps.length, 0)} |\n`
md += `| Proyectos de portafolio | ${sections.length} |\n`
md += `| Preguntas de auto-evaluación | ${sections.reduce((s, x) => s + x.selfCheckQuestions.length, 0)} |\n`
md += `| Recursos externos | ${sections.reduce((s, x) => s + x.resourceDocs.length, 0)} |\n\n`

// Pedagogy notes
md += `## Notas pedagógicas para revisores\n\n`
md += `### Metodología I Do / We Do / You Do\n\n`
md += `Cada sección sigue el framework **Gradual Release of Responsibility** (Corwin/Ferry 2014):\n\n`
md += `1. **I Do (Yo hago)**: El instructor demuestra con código real, explicando el "por qué" de cada decisión\n`
md += `2. **We Do (Hacemos juntos)**: El estudiante practica con starter code, hints y solución para comparar\n`
md += `3. **You Do (Tú haces)**: Proyecto independiente para portafolio GitHub\n`
md += `4. **Auto-evaluación**: Quiz con feedback inmediato (sin login) o examen con anti-plagio (con login)\n\n`

md += `### Sistema de exámenes con anti-plagio\n\n`
md += `- **3 variantes equivalentes** por concepto (3 preguntas diferentes que evalúan el mismo aprendizaje)\n`
md += `- Selección aleatoria de UNA variante por intento (no se repite entre intentos del mismo usuario)\n`
md += `- Máximo **3 intentos** por sección (2 retries)\n`
md += `- **70% mínimo** para aprobar\n`
md += `- Audit trail completo: cada intento guarda qué variante se usó, respuestas, score y tiempo\n\n`

md += `### Editor interactivo con Pyodide\n\n`
md += `- Las secciones 1-11 incluyen un **editor Python en el browser** (Pyodide/WebAssembly)\n`
md += `- El estudiante puede modificar y ejecutar código sin instalar nada\n`
md += `- Comparación automática con output esperado (✓ correcto / ✗ incorrecto)\n`
md += `- Hints colapsables por ejercicio\n\n`

md += `### Cobertura de libros de referencia (EPUBs)\n\n`
md += `Se realizó gap analysis de 3 EPUBs contra las 13 secciones:\n\n`
md += `- **Python 101** (Michael Driscoll, 44 capítulos): ~85% cubierto\n`
md += `- **Python 201** (Michael Driscoll, 30 capítulos): ~75% cubierto (tras añadir S7 Data Acquisition y S12 Performance)\n`
md += `- **Use Python to Become AWESOME at Your Job** (Shantnu Tiwari, 8 capítulos): ~70% cubierto (tras añadir S13 RPA)\n\n`

md += `### Temas identificados como gaps y cubiertos\n\n`
md += `Los siguientes 10 temas fueron identificados como faltantes en el gap analysis de EPUBs y se cubren en las nuevas secciones:\n\n`
md += `1. ✅ Iterators & generators (S7)\n`
md += `2. ✅ Web scraping con BeautifulSoup (S7)\n`
md += `3. ✅ REST APIs con requests (S7)\n`
md += `4. ✅ SQL databases con sqlite3/SQLAlchemy (S7)\n`
md += `5. ✅ Multiprocessing & concurrent.futures (S12)\n`
md += `6. ✅ Regular expressions (S7)\n`
md += `7. ✅ collections (Counter, defaultdict, namedtuple) (S7)\n`
md += `8. ✅ Profiling & benchmarking (S12)\n`
md += `9. ✅ Logging (S12)\n`
md += `10. ✅ argparse / CLI tooling (S12)\n\n`

md += `### Temas de RPA/Automatización añadidos (requerimiento del VP)\n\n`
md += `1. ✅ Browser automation con Playwright (S13)\n`
md += `2. ✅ Desktop automation con pyautogui (S13)\n`
md += `3. ✅ OCR con pytesseract + OpenCV (S13)\n`
md += `4. ✅ IA local con Ollama (S13)\n`
md += `5. ✅ IA cloud con OpenAI API structured outputs (S13)\n`
md += `6. ✅ Orquestación con Prefect (S13)\n`
md += `7. ✅ Scheduling con GitHub Actions cron (S13)\n`
md += `8. ✅ Resilencia con tenacity (S13)\n\n`

md += `---\n\n`
md += `## Solicitudes de feedback\n\n`
md += `Pedimos a los expertos revisar:\n\n`
md += `1. **Orden de secciones**: ¿Es correcto enseñar Data Acquisition (S7) antes que Pandas (S8)?\n`
md += `2. **Profundidad**: ¿Hay temas demasiado superficiales o demasiado profundos para el nivel?\n`
md += `3. **Cobertura**: ¿Faltan temas críticos para un Data Analyst / Data Scientist junior-mid?\n`
md += `4. **Progresión**: ¿El capstone del Familiarity Dashboard se integra bien a lo largo del curso?\n`
md += `5. **RPA**: ¿Es apropiado incluir RPA con IA en un curso de Python DS, o debería ser un curso separado?\n`
md += `6. **Evaluación**: ¿Son suficientes 5 preguntas por sección con 3 variantes cada una?\n`
md += `7. **Horas**: ¿Las horas estimadas son realistas para aprendizaje autónomo?\n`
md += `8. **Idioma**: ¿El uso de español peruano ("chevere", "pega", etc.) es apropiado o distrae?\n\n`

md += `---\n\n*Generado automáticamente desde el código fuente del curso en ${new Date().toISOString().split('T')[0]}.*\n`

// Write to file
const outputPath = 'learning_roadmap.md'
fs.writeFileSync(outputPath, md)
console.log(`✓ Roadmap generado: ${outputPath}`)
console.log(`  ${sections.length} secciones`)
console.log(`  ${sections.reduce((s, x) => s + x.hours, 0)} horas totales`)
console.log(`  ${sections.reduce((s, x) => s + x.learningOutcomes.length, 0)} objetivos de aprendizaje`)
console.log(`  ${sections.reduce((s, x) => s + x.theoryHeadings.length, 0)} bloques de teoría`)
console.log(`  ${sections.reduce((s, x) => s + x.iDoSteps.length, 0)} ejercicios I Do`)
console.log(`  ${sections.reduce((s, x) => s + x.weDoSteps.length, 0)} ejercicios We Do`)
console.log(`  ${sections.length} proyectos de portafolio`)
console.log(`  ${sections.reduce((s, x) => s + x.selfCheckQuestions.length, 0)} preguntas de auto-evaluación`)
