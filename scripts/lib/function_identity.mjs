/**
 * Fingerprint a complexity offender's anonymous function AST, rather than the
 * nth anonymous function at this file position. The old ordinal could grant
 * a NEW complexity-20 callback an unrelated grandfathered allowance after
 * reordering/removing callbacks in the same file.
 *
 * Editing a grandfathered anonymous function changes this key and intentionally
 * requires reducing it to the ceiling (or an explicit reviewed baseline policy).
 */
import { createHash } from 'node:crypto'
import ts from 'typescript'

export function anonymousFunctionFingerprint(source, file, line, column) {
  const kind = file.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS
  const syntax = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, kind)
  const matches = []
  const visit = (node) => {
    if (ts.isArrowFunction(node) || ts.isFunctionExpression(node)) {
      const start = node.getStart(syntax)
      const loc = syntax.getLineAndCharacterOfPosition(start)
      if (loc.line + 1 === line) {
        matches.push({ node, column: loc.character + 1 })
      }
    }
    ts.forEachChild(node, visit)
  }
  visit(syntax)
  const match = matches.find((m) => m.column === column) ??
    (matches.length === 1 ? matches[0] : undefined)
  if (!match) {
    throw new Error(`Cannot identify anonymous complexity function at ${file}:${line}:${column}`)
  }
  return createHash('sha256').update(match.node.getText(syntax).replace(/\s+/g, ' '))
    .digest('hex').slice(0, 16)
}
