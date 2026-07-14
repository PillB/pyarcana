/**
 * Extrae información clave de cada sección del curso para generar el roadmap.
 * Output: JSON con título, nivel, horas, learning outcomes, theory topics,
 * I Do steps, We Do steps, You Do project, selfCheck concepts.
 */
const fs = require('fs')
const path = require('path')

const sectionsDir = path.join(__dirname, '..', 'src', 'lib', 'course', 'sections')
const files = fs.readdirSync(sectionsDir).filter(f => f.endsWith('.ts')).sort()

const sections = []

for (const file of files) {
  const content = fs.readFileSync(path.join(sectionsDir, file), 'utf-8')

  // Extract key fields using regex
  const idMatch = content.match(/id:\s*'([^']+)'/)
  const indexMatch = content.match(/index:\s*(\d+)/)
  const titleMatch = content.match(/title:\s*'([^']+)'/)
  const shortTitleMatch = content.match(/shortTitle:\s*'([^']+)'/)
  const taglineMatch = content.match(/tagline:\s*'([^']+)'/)
  const hoursMatch = content.match(/estimatedHours:\s*(\d+)/)
  const levelMatch = content.match(/level:\s*'([^']+)'/)

  // Extract learning outcomes
  const loSection = content.match(/learningOutcomes:\s*\[([\s\S]*?)\],\s*\n\s*theory:/)
  const learningOutcomes = []
  if (loSection) {
    const loMatches = loSection[1].matchAll(/text:\s*'([^']+)'/g)
    for (const m of loMatches) learningOutcomes.push(m[1])
  }

  // Extract theory headings
  const theoryHeadings = []
  const headingMatches = content.matchAll(/heading:\s*'([^']+)'/g)
  for (const m of headingMatches) theoryHeadings.push(m[1])

  // Extract I Do step descriptions
  const iDoSteps = []
  const iDoMatches = content.matchAll(/description:\s*'([^']+)'/g)
  for (const m of iDoMatches) iDoSteps.push(m[1])

  // Extract We Do instructions
  const weDoSteps = []
  const weDoMatches = content.matchAll(/instruction:\s*'([^']+)'/g)
  for (const m of weDoSteps) weDoSteps.push(m[1])

  // Extract You Do title
  const youDoMatch = content.match(/title:\s*'([^']+)',\s*\n\s*context:/)

  // Extract selfCheck questions
  const selfCheckQuestions = []
  const questionMatches = content.matchAll(/question:\s*'([^']+)'/g)
  for (const m of questionMatches) selfCheckQuestions.push(m[1])

  // Extract jobRelevance
  const jobMatch = content.match(/jobRelevance:\s*\n?\s*'([^']+)'/)

  sections.push({
    id: idMatch?.[1] || '',
    index: parseInt(indexMatch?.[1] || '0'),
    title: titleMatch?.[1] || '',
    shortTitle: shortTitleMatch?.[1] || '',
    tagline: taglineMatch?.[1] || '',
    hours: parseInt(hoursMatch?.[1] || '0'),
    level: levelMatch?.[1] || '',
    learningOutcomes,
    theoryHeadings,
    iDoSteps,
    weDoSteps,
    youDoTitle: youDoMatch?.[1] || '',
    selfCheckQuestions,
    jobRelevance: jobMatch?.[1] || '',
  })
}

// Output as JSON
console.log(JSON.stringify(sections, null, 2))
