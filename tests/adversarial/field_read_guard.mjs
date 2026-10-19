#!/usr/bin/env node
/**
 * Does code READ a field? The reader behind test_badge_claim_digests.py (owner decision O27 102-S1).
 *
 * Reads a JSON list of jobs on stdin and writes one JSON object to stdout: for each job, the fields
 * its code reads, keyed by the job's name.
 *
 *   stdin:  [{"name": "page", "file": "page.tsx", "text": "...", "fields": ["generated_at"]}]
 *   stdout: {"page": ["generated_at"]}
 *
 * The TypeScript compiler parses each text, so the rule rests on the syntax tree and not on spelling:
 * - a comment is trivia that the tree does not hold, so the characters inside one never count, and a
 *   `//` or a block-comment opener inside a string does not start one;
 * - a read is the whole word held as code (a property access, a key, a destructuring, a name in an
 *   object literal), as text in a string or template, or as JSX text, which a page shows;
 * - the name of a member declared in an interface or a type literal (`field?: string`) is not a read,
 *   because it states the shape of the data and reads nothing.
 *
 * Seen: a renamed destructuring, an upper-case alias of one, a parameter destructuring
 * (`function f({ generated_at })`), and a `//` or `/*` inside a string that comes before a read.
 * Not seen: a use that names no field, such as a spread `{ ...catalog }` or Object.entries(catalog),
 * which copies every field without naming one, and a key built at run time (`'generated' + '_at'`).
 * The guard sees the files it is given; the test gives it src/ only.
 *
 * Expert standard: the TypeScript compiler API, the reference parser for TypeScript (typescript@5 is a
 * dev dependency of this repository), applied the way a linter applies a parser to a rule.
 */
import { extname } from 'node:path'
import ts from 'typescript'

/** A `.ts` or `.mts` file parses as TypeScript; anything else as TSX, which also reads plain JavaScript. */
function scriptKind(file) {
  return ['.ts', '.mts', '.cts'].includes(extname(file)) ? ts.ScriptKind.TS : ts.ScriptKind.TSX
}

/** The whole word, escaped for a regular expression. */
function wordPattern(field) {
  return new RegExp(`\\b${field.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`)
}

/** True for the name of a member declared in an interface or a type literal. Such a name reads nothing. */
function isDeclaredMember(node) {
  return ts.isPropertySignature(node.parent) && node.parent.name === node
}

/** True when `node` holds the field as a read: an identifier of that name, or the word inside a string or JSX text. */
function holds(node, field, pattern) {
  if (ts.isIdentifier(node)) return node.text === field
  return typeof node.text === 'string' && pattern.test(node.text)
}

/** The fields, of those listed, that the syntax tree of `text` reads. */
function fieldsRead(text, file, fields) {
  const source = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, scriptKind(file))
  const patterns = new Map(fields.map((field) => [field, wordPattern(field)]))
  const found = new Set()
  const visit = (node) => {
    if (!isDeclaredMember(node)) {
      for (const [field, pattern] of patterns) {
        if (holds(node, field, pattern)) found.add(field)
      }
    }
    ts.forEachChild(node, visit)
  }
  ts.forEachChild(source, visit)
  return [...found].sort()
}

/** The job's name mapped to the fields its code reads. */
function readsByJob(jobs) {
  return Object.fromEntries(jobs.map((job) => [job.name, fieldsRead(job.text, job.file, job.fields)]))
}

let input = ''
process.stdin.setEncoding('utf8')
for await (const chunk of process.stdin) input += chunk
process.stdout.write(JSON.stringify(readsByJob(JSON.parse(input))))
