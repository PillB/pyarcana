/**
 * The gate-local ESLint rule behind scripts/complexity_gate.mjs: ESLint's own `complexity` rule at a
 * threshold of 0, so every function is reported with its score, with the report re-worded to carry
 * a stable identity (complexity_gate.identity.mjs) in place of ESLint's `Arrow function`, which says
 * nothing about which arrow function it is.
 *
 * The count is not reimplemented. The core rule runs unchanged and this wrapper rewrites only what
 * it says about itself, so the score of every function is ESLint's score. A test pins that: the
 * wrapper's (line, column, score) list equals the core rule's on a sample of every kind of unit.
 *
 * `builtinRules` comes from `eslint/use-at-your-own-risk`, which ESLint documents as unsupported.
 * typescript-eslint takes its core rules the same way. The gate pins ESLint's version in its header
 * and in the baseline, and fails closed: if the rule is gone after an upgrade, `create` throws and
 * the gate exits non-zero rather than passing without measuring.
 */
import { builtinRules } from 'eslint/use-at-your-own-risk'
import { identityOf } from './complexity_gate.identity.mjs'

const complexity = builtinRules.get('complexity')
if (!complexity) throw new Error("ESLint no longer ships the 'complexity' rule that scripts/complexity_gate.mjs wraps")

const rule = {
  meta: {
    type: 'problem',
    schema: [],
    messages: { measured: '{{identity}} has a complexity of {{complexity}}.' },
  },
  create(context) {
    const report = ({ node, loc, data }) =>
      context.report({ node, loc, messageId: 'measured', data: { identity: identityOf(node, data.name), complexity: data.complexity } })
    // Threshold 0: a function scores above it always, so every function is reported.
    return complexity.create(Object.create(context, { options: { value: [0] }, report: { value: report } }))
  },
}

export default rule
