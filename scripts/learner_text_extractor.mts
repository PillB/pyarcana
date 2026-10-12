/**
 * Print what scripts/lib/learner_text.mts reads, as JSON, for the Python tools and tests.
 *
 *   npx tsx scripts/learner_text_extractor.mts --question-bank [prisma/seed.ts]
 *   npx tsx scripts/learner_text_extractor.mts --literals <file.ts>
 *
 * Exit 0 with JSON on stdout; exit 2 with the reason on stderr when the bank is not a plain
 * literal, so a caller can never mistake a refusal for an empty bank.
 */
import { readFileSync } from 'node:fs'
import { keyCensus, literalsFromSource, NonLiteralBank, readQuestionBank } from './lib/learner_text.mts'

function main(argv: string[]): number {
  const [mode, file] = argv
  if (mode === '--question-bank') {
    const path = file ?? 'prisma/seed.ts'
    const banks = readQuestionBank(readFileSync(path, 'utf8'), path)
    process.stdout.write(JSON.stringify({ file: path, keyCensus: keyCensus(banks), banks }))
    return 0
  }
  if (mode === '--literals' && file) {
    process.stdout.write(JSON.stringify({ file, literals: literalsFromSource(readFileSync(file, 'utf8'), file) }))
    return 0
  }
  process.stderr.write('usage: learner_text_extractor.mts --question-bank [seed.ts] | --literals <file.ts>\n')
  return 2
}

try {
  process.exitCode = main(process.argv.slice(2))
} catch (err) {
  if (!(err instanceof NonLiteralBank)) throw err
  process.stderr.write(`refused: ${err.message}\n`)
  process.exitCode = 2
}
