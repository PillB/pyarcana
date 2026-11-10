// Prints {sectionFile: [{question, options, correctIndex}]} for the active sections named on the
// command line, read from the section modules themselves (what the learner sees), as JSON.
import { pathToFileURL } from 'node:url'
import { resolve } from 'node:path'

const out: Record<string, unknown[]> = {}
for (const stem of process.argv.slice(2)) {
  const mod = await import(pathToFileURL(resolve('src/lib/course/sections', `${stem}.ts`)).href)
  const section = Object.values(mod).find((v) => v && typeof v === 'object' && 'selfCheck' in (v as object)) as
    | { selfCheck: { questions: { question: string; options: string[]; correctIndex: number }[] } }
    | undefined
  if (!section) throw new Error(`${stem}: no exported section with a selfCheck`)
  out[stem] = section.selfCheck.questions.map(({ question, options, correctIndex }) => ({ question, options, correctIndex }))
}
process.stdout.write(JSON.stringify(out))
