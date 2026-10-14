/**
 * Print what the in-browser playground runs, as the TypeScript modules define it, as JSON for the
 * Python tests: the prelude (src/lib/pyodide.ts), the demos (src/lib/course/playground-demos.ts)
 * and the section ids in COURSE_SECTIONS order (section number = index + 1).
 *
 *   npx tsx scripts/playground_extractor.mts
 *
 * Needs node_modules, so only the adversarial suite (which installs them) uses it. The content
 * gate has none and reads the demos with scripts/playground_demos_dump.mjs instead; a test holds
 * the two readers equal.
 */
import { COURSE_SECTIONS } from '../src/lib/course/index.ts'
import { PLAYGROUND_DEMOS } from '../src/lib/course/playground-demos.ts'
import { PLAYGROUND_PRELUDE } from '../src/lib/pyodide.ts'

process.stdout.write(
  JSON.stringify({
    prelude: PLAYGROUND_PRELUDE,
    sections: COURSE_SECTIONS.map((section) => section.id),
    demos: PLAYGROUND_DEMOS,
  }),
)
