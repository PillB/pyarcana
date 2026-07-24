#!/usr/bin/env node
/**
 * Build course-state/interaction_catalog.json from COURSE_SECTIONS sources only
 * (files imported by src/lib/course/index.ts — ignore legacy duplicate section files).
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const sectionsDir = path.join(root, 'src/lib/course/sections')
const outPath = path.join(root, 'course-state/interaction_catalog.json')

const indexTs = fs.readFileSync(path.join(root, 'src/lib/course/index.ts'), 'utf8')

// Map section01 → file basename without .ts
const symbolToFile = new Map()
for (const m of indexTs.matchAll(
  /import\s+\{\s*(section\d+)\s*\}\s+from\s+['"]\.\/sections\/([^'"]+)['"]/g
)) {
  symbolToFile.set(m[1], m[2])
}

const orderedSymbols = []
const arrMatch = indexTs.match(/export const COURSE_SECTIONS[^=]*=\s*\[([\s\S]*?)\]/)
if (arrMatch) {
  for (const m of arrMatch[1].matchAll(/section\d+/g)) {
    orderedSymbols.push(m[0])
  }
}

function parseSection(filePath) {
  const text = fs.readFileSync(filePath, 'utf8')
  const idM = text.match(/\bid:\s*['"]([^'"]+)['"]/)
  const indexM = text.match(/\bindex:\s*(\d+)/)
  const titleM = text.match(/\btitle:\s*['"]([^'"]+)['"]/)
  if (!idM) return null

  const demos = []
  for (const m of text.matchAll(/demoId:\s*['"]([^'"]+)['"]/g)) {
    demos.push({ demoId: m[1] })
  }

  const exercises = []
  // Boundary must tolerate 1-space or 2-space section indent (S16–S21/S36 use single-space keys).
  // Non-greedy body until the top-level `youDo:` sibling — not nested keys.
  const weDoMatch = text.match(/weDo:\s*\{([\s\S]*?)\n[ \t]*youDo\s*:/)
  const weDoBody = weDoMatch ? weDoMatch[1] : ''
  // Split on starterCode occurrences inside weDo
  const parts = weDoBody.split(/starterCode\s*:/)
  for (let i = 1; i < parts.length; i++) {
    const before = parts[i - 1]
    const ids = [...before.matchAll(/id:\s*['"]([^'"]+)['"]/g)].map((x) => x[1])
    // Prefer last id that looks like an exercise id (contains -E or ends with digit pattern)
    let exId =
      [...ids].reverse().find((id) => /-E\d+/i.test(id) || /E\d+$/i.test(id)) ||
      ids[ids.length - 1] ||
      `step-${i - 1}`
    exercises.push({
      id: exId,
      index: i - 1,
      hasTests: /tests\s*:/.test(before.slice(-500) + parts[i].slice(0, 400)),
      hasSolution: true,
    })
  }

  let selfCheck = []
  const scObj = text.match(
    /selfCheck\s*:\s*\{[\s\S]*?questions\s*:\s*\[([\s\S]*?)\]\s*,?\s*\}/
  )
  if (scObj) {
    const qObjs = scObj[1].split(/\{\s*question\s*:/).slice(1)
    qObjs.forEach((q, qIndex) => {
      const optMatch = q.match(/options\s*:\s*\[([\s\S]*?)\]/)
      let optionCount = 4
      if (optMatch) {
        // Count top-level array string elements (lines starting with quote after comma/bracket)
        const raw = optMatch[1]
        const topLevel = raw.match(/(?:^|,)\s*(['"])(?:\\.|(?!\1).)*\1/g)
        optionCount = topLevel ? topLevel.length : 4
        // Cap sensible MCQ size
        if (optionCount < 2 || optionCount > 6) optionCount = 4
      }
      const correctM = q.match(/correctIndex\s*:\s*(\d+)/)
      selfCheck.push({
        qIndex,
        optionCount,
        correctIndex: correctM ? Number(correctM[1]) : 0,
      })
    })
  }

  return {
    id: idM[1],
    index: indexM ? Number(indexM[1]) : 0,
    title: titleM ? titleM[1] : idM[1],
    file: path.basename(filePath),
    subSteps: ['theory', 'ido', 'wedo', 'youdo', 'quiz'],
    demos,
    exercises,
    selfCheck,
    exam: { concepts: 8, variants: 3 },
  }
}

const unique = []
for (const sym of orderedSymbols) {
  const fileBase = symbolToFile.get(sym)
  if (!fileBase) {
    console.error('Missing import for', sym)
    continue
  }
  const filePath = path.join(sectionsDir, fileBase.endsWith('.ts') ? fileBase : `${fileBase}.ts`)
  if (!fs.existsSync(filePath)) {
    console.error('Missing file', filePath)
    continue
  }
  const sec = parseSection(filePath)
  if (sec) unique.push(sec)
}

const totals = {
  sections: unique.length,
  demos: unique.reduce((a, s) => a + s.demos.length, 0),
  exercises: unique.reduce((a, s) => a + s.exercises.length, 0),
  selfCheckQuestions: unique.reduce((a, s) => a + s.selfCheck.length, 0),
}

const catalog = {
  generated_at: new Date().toISOString(),
  views: ['home', 'resources', 'admin', 'pricing', 'familiarity'],
  totals,
  invariants: {
    expected_sections: 52,
    expected_demos: 416,
    expected_exercises: 1248,
  },
  sections: unique,
  ok:
    unique.length === 52 &&
    totals.demos === 416 &&
    totals.exercises >= 1200,
}

fs.mkdirSync(path.dirname(outPath), { recursive: true })
fs.writeFileSync(outPath, JSON.stringify(catalog, null, 2))
console.log(JSON.stringify({ outPath, totals, ok: catalog.ok }, null, 2))
if (!catalog.ok) {
  console.error('CATALOG_GATE_FAILED', totals)
  process.exitCode = 1
}
