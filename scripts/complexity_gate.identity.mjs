/**
 * The identity the complexity ratchet keys a function by. Imported by the gate-local ESLint rule
 * (complexity_gate.rule.mjs), which hands it the node ESLint's `complexity` rule reported.
 *
 * A baseline key must survive edits that grow nothing. An ordinal such as `<arrow function>#3`
 * does not: adding an unrelated arrow function earlier in the file renumbers every later one, and a
 * baselined offender becomes NEW OVER. So a function is named by what it is, never by where it sits:
 *
 *   function f() {}                      f
 *   const f = () => {}                   f              (the variable it is bound to)
 *   { f: () => {} } , { f() {} }         f              (the property, under the object's own name)
 *   class C { m() {} get v() {} }        C.m, C.get v   (the class, then the member)
 *   items.map((x) => ...)                <arg 0 of items.map>
 *   <button onClick={() => ...} />       <prop onClick>
 *   export default () => {}              default
 *
 * and a function inside another function is that path, outermost first: `Panel.<arg 0 of rows.map>`.
 * Only when two functions in one file still share a whole path does the gate add `#2`, `#3` in source
 * order, so an ordinal now means "the second callback to the same call inside the same function",
 * which only a sibling edit can move. A function that moves into another function, or is renamed,
 * is a new key; the ratchet then treats it as new code, which is the safe direction.
 */

const FUNCTION_TYPES = new Set(['FunctionDeclaration', 'FunctionExpression', 'ArrowFunctionExpression'])
const CLASS_TYPES = new Set(['ClassDeclaration', 'ClassExpression'])
/** Type-only wrappers that do not change what a value is bound to: `(() => {}) as Handler`. */
const WRAPPERS = new Set(['TSAsExpression', 'TSSatisfiesExpression', 'TSNonNullExpression', 'TSTypeAssertion'])

/** The key of a class member or object property, or null when it is computed from a variable. */
function keyName(member) {
  const { key, computed } = member
  if (key.type === 'PrivateIdentifier') return `#${key.name}`
  if (key.type === 'Literal') return String(key.value)
  return key.type === 'Identifier' && !computed ? key.name : null
}

/** `a`, `this.a`, `a.b.c`, `a().b`: the callee as written, with call arguments left out. */
function dotted(expr) {
  if (expr.type === 'Identifier') return expr.name
  if (expr.type === 'ThisExpression') return 'this'
  if (expr.type === 'CallExpression') return `${dotted(expr.callee)}()`
  if (expr.type !== 'MemberExpression') return '…'
  const property = expr.computed ? '[…]' : `.${expr.property.name}`
  return `${dotted(expr.object)}${property}`
}

/** The member a function is the value of, with `get ` or `set ` before an accessor's name. */
function memberName(member) {
  const name = keyName(member)
  if (name === null) return null
  return member.kind === 'get' || member.kind === 'set' ? `${member.kind} ${name}` : name
}

/** The node and its parent, looking through type-only wrappers. */
function boundTo(node) {
  let child = node
  while (WRAPPERS.has(child.parent.type)) child = child.parent
  return { child, parent: child.parent }
}

const BINDERS = {
  VariableDeclarator: (child, p) => (p.init === child && p.id.type === 'Identifier' ? p.id.name : null),
  AssignmentExpression: (child, p) => (p.right === child ? dotted(p.left) : null),
  Property: (child, p) => (p.value === child ? memberName(p) : null),
  MethodDefinition: (child, p) => (p.value === child ? memberName(p) : null),
  TSAbstractMethodDefinition: (child, p) => (p.value === child ? memberName(p) : null),
  PropertyDefinition: (child, p) => (p.value === child ? keyName(p) : null),
  ExportDefaultDeclaration: () => 'default',
}

/** The name of what a node is bound to: a variable, a property, a class member, `default`. */
export function bindingName(node) {
  const { child, parent } = boundTo(node)
  const bind = BINDERS[parent.type]
  return bind ? bind(child, parent) : null
}

/** `<arg 0 of items.map>` for a function passed to a call, `<prop onClick>` for a JSX handler. */
function usageLabel(node) {
  const { child, parent } = boundTo(node)
  if (parent.type === 'CallExpression' || parent.type === 'NewExpression') {
    return `<arg ${parent.arguments.indexOf(child)} of ${dotted(parent.callee)}>`
  }
  const attribute = parent.type === 'JSXExpressionContainer' ? parent.parent : null
  return attribute?.type === 'JSXAttribute' && attribute.name.type === 'JSXIdentifier' ? `<prop ${attribute.name.name}>` : null
}

const functionLabel = (fn) =>
  fn.id?.name ?? bindingName(fn) ?? usageLabel(fn) ?? (fn.type === 'ArrowFunctionExpression' ? '<arrow function>' : '<function>')

const classLabel = (cls) => cls.id?.name ?? bindingName(cls) ?? '<class>'

/** The names of what encloses a node, outermost first: functions, classes and named objects. */
function enclosing(node) {
  const names = []
  for (let up = node.parent; up; up = up.parent) {
    if (FUNCTION_TYPES.has(up.type)) names.unshift(functionLabel(up))
    else if (CLASS_TYPES.has(up.type)) names.unshift(classLabel(up))
    else if (up.type === 'ObjectExpression') names.unshift(...[bindingName(up)].filter(Boolean))
  }
  return names
}

/**
 * The identity of one reported unit. `kind` is how ESLint names a unit that is not a function:
 * a class field's initializer expression, or a class static block.
 */
export function identityOf(node, kind) {
  if (/^class field initializer/i.test(kind)) return [...enclosing(node), bindingName(node) ?? '<field>', '<initializer>'].join('.')
  if (/^class static block/i.test(kind)) return [...enclosing(node), '<static block>'].join('.')
  return [...enclosing(node), functionLabel(node)].join('.')
}
