// Dumps the exam QuestionBank defined in prisma/seed.ts (the only source of exam questions) to
// JSON, keyed by section id, without running the seed or touching a database.
//   bun audit/learner-walkthrough/scripts/extract_exam_bank.ts <out.json> [sectionsDir]
// With sectionsDir (the output of extract_sections.ts), also writes SXX-<id>.exam.json beside each
// SXX-<id>.json, which is what the readings and exam_key_audit.py read.
import { readdirSync, readFileSync, writeFileSync } from 'node:fs'

const src = readFileSync(new URL('../../../prisma/seed.ts', import.meta.url), 'utf8')
const start = src.indexOf('const QUESTION_BANK')
const end = src.indexOf('async function main()')
if (start < 0 || end < 0) throw new Error('QUESTION_BANK or main() not found in prisma/seed.ts')
const body = src.slice(start, end).replace(/^const QUESTION_BANK: Record<string, Q\[\]> =/, 'return')
const bank = new Function(body)() as Record<string, { concept: string }[]>
writeFileSync(process.argv[2], JSON.stringify(bank, null, 1))
for (const [k, v] of Object.entries(bank)) console.log(k, v.length, new Set(v.map((q) => q.concept)).size)

const dir = process.argv[3]
if (dir) {
  for (const name of readdirSync(dir).filter((n) => /^S\d\d-.*(?<!\.exam)\.json$/.test(n))) {
    const id = name.slice(4, -5)
    if (!bank[id]) throw new Error(`no exam bank for section ${name}`)
    writeFileSync(`${dir}/${name.slice(0, -5)}.exam.json`, JSON.stringify(bank[id], null, 1))
  }
}
