/**
 * Read learner-facing text out of TypeScript sources by parsing them, never by regex.
 *
 * Every tool that read `prisma/seed.ts` used to bring its own regex, and each saw a different part
 * of the bank: one only single-quoted keys, one only unquoted keys, one no keys at all. Two false
 * conclusions came out of that ("five sections have no exam bank"; a length-cue count that never
 * measured `setup` or `basics`). This module parses the file with the TypeScript compiler, so a
 * key's quote style, a line break inside a string, or an escaped quote cannot change what is read.
 *
 * It never imports `seed.ts`: that module runs `main()` against a database when loaded.
 *
 *   readQuestionBank(text)      the literal QUESTION_BANK, every bank and question, or a refusal
 *   readSeedQuestionBank(root)  the same, read from the repository's seed file
 *   literalsFromSource(text)    every string a reader can see, with its line, comments excluded
 */
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import ts from 'typescript'

export type KeyStyle = 'identifier' | 'single' | 'double'

export type BankQuestion = {
  concept: string
  question: string
  options: string[]
  correctIndex: number
  explanation: string
  /** 1-based, numbered by array order within the concept: what the seed's insert should assign. */
  variant: number
  line: number
}

export type Bank = { slug: string; keyStyle: KeyStyle; line: number; questions: BankQuestion[] }

export type Literal = { text: string; line: number }

/** The bank is not a plain literal, so nothing read from it could be trusted. */
export class NonLiteralBank extends Error {
  readonly line: number

  constructor(message: string, line: number) {
    super(`${message} (line ${line})`)
    this.name = 'NonLiteralBank'
    this.line = line
  }
}

const FIELDS = ['concept', 'question', 'options', 'correctIndex', 'explanation'] as const

function parse(text: string, fileName: string): ts.SourceFile {
  return ts.createSourceFile(fileName, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS)
}

function lineOf(sf: ts.SourceFile, node: ts.Node): number {
  return sf.getLineAndCharacterOfPosition(node.getStart(sf)).line + 1
}

/** Strip `(x)`, `x as T` and `x satisfies T`, which leave the literal itself unchanged. */
function unwrap(node: ts.Expression): ts.Expression {
  let n = node
  while (ts.isParenthesizedExpression(n) || ts.isAsExpression(n) || ts.isSatisfiesExpression(n)) {
    n = n.expression
  }
  return n
}

/**
 * The value of a string that needs no evaluation: a literal, a template with no `${}`, or a `+`
 * chain of those. Anything else returns undefined.
 */
export function staticString(node: ts.Expression): string | undefined {
  const n = unwrap(node)
  if (ts.isStringLiteral(n) || ts.isNoSubstitutionTemplateLiteral(n)) return n.text
  if (ts.isBinaryExpression(n) && n.operatorToken.kind === ts.SyntaxKind.PlusToken) {
    const left = staticString(n.left)
    const right = staticString(n.right)
    return left === undefined || right === undefined ? undefined : left + right
  }
  return undefined
}

function findBankLiteral(sf: ts.SourceFile): ts.ObjectLiteralExpression {
  const found: ts.VariableDeclaration[] = []
  for (const stmt of sf.statements) {
    if (!ts.isVariableStatement(stmt)) continue
    for (const decl of stmt.declarationList.declarations) {
      if (ts.isIdentifier(decl.name) && decl.name.text === 'QUESTION_BANK') found.push(decl)
    }
  }
  if (found.length !== 1) {
    throw new NonLiteralBank(`expected one top-level QUESTION_BANK, found ${found.length}`, 1)
  }
  const init = found[0].initializer && unwrap(found[0].initializer)
  if (!init || !ts.isObjectLiteralExpression(init)) {
    throw new NonLiteralBank('QUESTION_BANK is not an object literal', lineOf(sf, found[0]))
  }
  return init
}

/** A bank key and how it was written. Computed and numeric keys are refused. */
function keyOf(sf: ts.SourceFile, prop: ts.ObjectLiteralElementLike): { slug: string; style: KeyStyle } {
  if (!ts.isPropertyAssignment(prop)) {
    throw new NonLiteralBank('a bank entry is not a plain `key: [...]` (spread, shorthand or method)', lineOf(sf, prop))
  }
  const name = prop.name
  if (ts.isIdentifier(name)) return { slug: name.text, style: 'identifier' }
  if (ts.isStringLiteral(name)) {
    return { slug: name.text, style: sf.text[name.getStart(sf)] === "'" ? 'single' : 'double' }
  }
  throw new NonLiteralBank('a bank key is computed or numeric', lineOf(sf, prop))
}

function fieldName(sf: ts.SourceFile, prop: ts.ObjectLiteralElementLike): string {
  if (!ts.isPropertyAssignment(prop)) {
    throw new NonLiteralBank('a question field is not a plain `name: value`', lineOf(sf, prop))
  }
  if (ts.isIdentifier(prop.name) || ts.isStringLiteral(prop.name)) return prop.name.text
  throw new NonLiteralBank('a question field name is computed', lineOf(sf, prop))
}

function stringField(sf: ts.SourceFile, value: ts.Expression, field: string): string {
  const s = staticString(value)
  if (s === undefined) {
    throw new NonLiteralBank(`${field} is not a plain string (a \${} or an expression)`, lineOf(sf, value))
  }
  return s
}

function optionsField(sf: ts.SourceFile, value: ts.Expression): string[] {
  const arr = unwrap(value)
  if (!ts.isArrayLiteralExpression(arr)) throw new NonLiteralBank('options is not an array literal', lineOf(sf, value))
  return arr.elements.map((el) => {
    if (ts.isSpreadElement(el)) throw new NonLiteralBank('options contains a spread', lineOf(sf, el))
    return stringField(sf, el, 'an option')
  })
}

function indexField(sf: ts.SourceFile, value: ts.Expression): number {
  const n = unwrap(value)
  if (!ts.isNumericLiteral(n) || !/^\d+$/.test(n.text)) {
    throw new NonLiteralBank('correctIndex is not a non-negative integer literal', lineOf(sf, value))
  }
  return Number(n.text)
}

function readQuestion(sf: ts.SourceFile, el: ts.Expression): Omit<BankQuestion, 'variant'> {
  const obj = unwrap(el)
  if (!ts.isObjectLiteralExpression(obj)) throw new NonLiteralBank('a question is not an object literal', lineOf(sf, el))
  const seen = new Map<string, ts.Expression>()
  for (const prop of obj.properties) {
    const name = fieldName(sf, prop)
    if (!(FIELDS as readonly string[]).includes(name)) {
      throw new NonLiteralBank(`a question has an unknown field "${name}"`, lineOf(sf, prop))
    }
    if (seen.has(name)) throw new NonLiteralBank(`a question repeats the field "${name}"`, lineOf(sf, prop))
    seen.set(name, (prop as ts.PropertyAssignment).initializer)
  }
  const missing = FIELDS.filter((f) => !seen.has(f))
  if (missing.length) throw new NonLiteralBank(`a question lacks ${missing.join(', ')}`, lineOf(sf, obj))
  return {
    concept: stringField(sf, seen.get('concept')!, 'concept'),
    question: stringField(sf, seen.get('question')!, 'question'),
    options: optionsField(sf, seen.get('options')!),
    correctIndex: indexField(sf, seen.get('correctIndex')!),
    explanation: stringField(sf, seen.get('explanation')!, 'explanation'),
    line: lineOf(sf, obj),
  }
}

function readBank(sf: ts.SourceFile, prop: ts.ObjectLiteralElementLike): Bank {
  const { slug, style } = keyOf(sf, prop)
  const value = unwrap((prop as ts.PropertyAssignment).initializer)
  if (!ts.isArrayLiteralExpression(value)) {
    throw new NonLiteralBank(`bank "${slug}" is not an array literal`, lineOf(sf, prop))
  }
  const perConcept = new Map<string, number>()
  const questions = value.elements.map((el) => {
    if (ts.isSpreadElement(el)) throw new NonLiteralBank(`bank "${slug}" contains a spread`, lineOf(sf, el))
    const q = readQuestion(sf, el)
    const variant = (perConcept.get(q.concept) ?? 0) + 1
    perConcept.set(q.concept, variant)
    return { ...q, variant }
  })
  return { slug, keyStyle: style, line: lineOf(sf, prop), questions }
}

/**
 * The first syntax error, if any. The parser recovers from errors and keeps going, so without this
 * a broken file could still yield banks that look plausible.
 */
function firstSyntaxError(text: string, fileName: string): NonLiteralBank | undefined {
  const diags = ts.transpileModule(text, { fileName, reportDiagnostics: true }).diagnostics ?? []
  const d = diags.find((x) => x.category === ts.DiagnosticCategory.Error)
  if (!d) return undefined
  const line = d.file && d.start !== undefined ? d.file.getLineAndCharacterOfPosition(d.start).line + 1 : 1
  return new NonLiteralBank(`syntax error: ${ts.flattenDiagnosticMessageText(d.messageText, ' ')}`, line)
}

/** Every bank in `QUESTION_BANK`, in source order. Throws NonLiteralBank rather than guess. */
export function readQuestionBank(text: string, fileName = 'seed.ts'): Bank[] {
  const broken = firstSyntaxError(text, fileName)
  if (broken) throw broken
  const sf = parse(text, fileName)
  const banks: Bank[] = []
  const slugs = new Set<string>()
  for (const prop of findBankLiteral(sf).properties) {
    const bank = readBank(sf, prop)
    if (slugs.has(bank.slug)) throw new NonLiteralBank(`bank "${bank.slug}" is declared twice`, bank.line)
    slugs.add(bank.slug)
    banks.push(bank)
  }
  return banks
}

/** Where the exam bank lives, relative to the repository root. */
export const SEED_PATH = 'prisma/seed.ts'

/**
 * The repository's exam bank. TypeScript consumers call this rather than naming the seed file
 * themselves, as Python ones call scripts/exam_bank.py: test_seed_readers.py flags any other file
 * that names it.
 */
export function readSeedQuestionBank(root: string): Bank[] {
  return readQuestionBank(readFileSync(join(root, SEED_PATH), 'utf8'), SEED_PATH)
}

/** True when the node is a string the reader never sees: a property key or a module path. */
function isNonProse(node: ts.Node): boolean {
  const parent = node.parent
  if (!parent) return false
  if ((ts.isPropertyAssignment(parent) || ts.isPropertySignature(parent)) && parent.name === node) return true
  return ts.isImportDeclaration(parent) || ts.isExportDeclaration(parent) || ts.isExternalModuleReference(parent)
    || (ts.isCallExpression(parent) && parent.expression.kind === ts.SyntaxKind.ImportKeyword)
    || ts.isLiteralTypeNode(parent)
}

/** A template with `${}`: its literal parts, with each substitution shown as an ellipsis. */
function templateText(node: ts.TemplateExpression): string {
  return node.head.text + node.templateSpans.map((s) => ' … ' + s.literal.text).join('')
}

/**
 * Every string a learner could read, in source order: literals, untagged templates, and `+`
 * chains joined into one string. Comments are never returned. Tagged templates are skipped.
 */
export function literalsFromSource(text: string, fileName = 'source.ts'): Literal[] {
  const sf = parse(text, fileName)
  const out: Literal[] = []
  const visit = (node: ts.Node): void => {
    if (ts.isBinaryExpression(node) && node.operatorToken.kind === ts.SyntaxKind.PlusToken) {
      const joined = staticString(node)
      if (joined !== undefined) {
        out.push({ text: joined, line: lineOf(sf, node) })
        return
      }
    }
    if (ts.isTaggedTemplateExpression(node)) return
    if ((ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) && !isNonProse(node)) {
      out.push({ text: node.text, line: lineOf(sf, node) })
    } else if (ts.isTemplateExpression(node)) {
      out.push({ text: templateText(node), line: lineOf(sf, node) })
    }
    ts.forEachChild(node, visit)
  }
  visit(sf)
  return out
}

/** How many banks use each key style: the census a parity check compares against. */
export function keyCensus(banks: Bank[]): Record<KeyStyle, number> {
  const census: Record<KeyStyle, number> = { identifier: 0, single: 0, double: 0 }
  for (const b of banks) census[b.keyStyle] += 1
  return census
}
