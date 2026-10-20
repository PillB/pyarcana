/**
 * The identity the complexity ratchet keys a function by. Imported by the gate-local ESLint rule
 * (complexity_gate.rule.mjs), which hands it the node ESLint's `complexity` rule reported.
 *
 * A baseline key must survive edits that grow nothing. An ordinal such as `<arrow function>#3`
 * does not: adding an unrelated arrow function earlier in the file renumbers every later one, and a
 * baselined offender becomes NEW OVER. So a function is named by what it is, never by where it sits:
 *
 *   function f() {}                         f
 *   const f = () => {}                      f              (the variable it is bound to)
 *   const f = opts.f ?? (() => {})          f              (through ??, ||, && and the results of ?:)
 *   { f: () => {} } , { f() {} }            f              (the property, under the object's own name)
 *   class C { m() {} get v() {} }           C.m, C.get v   (the class, then the member)
 *   items.map((x) => ...)                   <arg 0 of items.map>
 *   const t = items.map((x) => ...)         <arg 0 of t = items.map>     (what the call's result is bound to)
 *   const [v, setV] = useState(() => ...)   <arg 0 of [v, setV] = useState>
 *   test('renders', () => ...)              <arg 1 of test "renders">    (the title the call is given)
 *   <button onClick={() => ...} />          <button onClick>
 *   <List>{(row) => ...}</List>             <List children>
 *   const once = (() => ...)()              <once = (…)()>
 *   const ROWS = [["role", (q) => ...]]     ROWS.<item 1 "role">   (a list bound to a name; a row's title)
 *   const CHECKS = [(q) => ..., (q) => ...] CHECKS.<item 1>        (no title: its place in the list)
 *   return () => ...                        <returned>
 *   function f(cb = () => {})               f.<default of cb>
 *   export default () => {}                 default
 *
 * and a function inside another is that path, outermost first: `Panel.<arg 0 of rows.map>`. An object
 * or a list on the path is a segment whenever the code names it, by the same rules: bound
 * (`api.load`), handed to a call (`<arg 0 of m = configure>.load`), held in JSX
 * (`<Picker formatters>.load`), returned (`<returned>.load`) or a default. An object in a list is
 * the row its first string value titles, `MODALS.<item "auth">.open`, with no place in the label. A
 * call's result is followed through `await`, `?.`, a member read, a further call and `??`/`||`/`?:`
 * to the name it reaches, so `const n = await rows.filter(f).length` names f's call
 * `n = rows.filter`. A title is the first string or template literal a call or a list holds before
 * the function, whitespace collapsed, with `${…}` for each expression.
 *
 * Those are all the names read. Code that only these leave out does not name a function: arguments
 * after it (`useEffect(fn, deps)`, `assert.throws(fn, /re/)`), arguments inside its callee
 * (`page.getByTestId('x').isVisible().catch(fn)` is `<arg 0 of page.getByTestId().isVisible().catch>`),
 * an identifier argument (`h(Panel, { onPick })`), a JSX element's other attributes or its text, the
 * function's own body. An ordinal is the fallback for functions that differ only there. Only units of
 * one file that share the whole path are numbered, and the number goes where their paths part: on the
 * outermost segment at which they sit in different places, counting in source order the places there
 * that hold such a unit. Two unbound `rows.map` callbacks in one JSX tree are `<arg 0 of rows.map>`
 * and `<arg 0 of rows.map>#2`; two untitled `describe` blocks that each hold an `it` callback number
 * the blocks, `<arg 0 of describe>#2.<arg 0 of it>`, not the callbacks across the file. So a number
 * moves only when a unit with that same path is added before it, in a new place or in an earlier
 * place that held none, and a list item with no title moves when an item is added before it in its
 * list; a new function with any other path moves nothing. A function that moves into another
 * function, or is renamed, is a new key, and the ratchet treats it as new code, the safe direction.
 * tests/adversarial/complexity-gate-ts.test.mjs holds one case per form a function takes in the
 * tree, and fails on a form new to the tree until it has one.
 */

const FUNCTION_TYPES = new Set(['FunctionDeclaration', 'FunctionExpression', 'ArrowFunctionExpression'])
const CLASS_TYPES = new Set(['ClassDeclaration', 'ClassExpression'])
/** Object and array literals: a segment of a path when bound to a name, as in `const ROUTES = [...]`. */
const LITERALS = new Set(['ObjectExpression', 'ArrayExpression'])
/** Type-only wrappers that do not change what a value is bound to: `(() => {}) as Handler`. */
const WRAPPERS = new Set(['TSAsExpression', 'TSSatisfiesExpression', 'TSNonNullExpression', 'TSTypeAssertion'])
/** What a call's result passes through, unchanged in what it is bound to: `await f()`, `a?.f()`, `f()!`. */
const THROUGH = new Set([...WRAPPERS, 'AwaitExpression', 'ChainExpression'])

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

/** The names a declaration binds, as written: `f`, `[value, setValue]`, `{ data, error }`. */
function patternName(id) {
  if (id.type === 'Identifier') return id.name
  if (id.type === 'AssignmentPattern') return patternName(id.left)
  if (id.type === 'RestElement') return `...${patternName(id.argument)}`
  if (id.type === 'ArrayPattern') return `[${id.elements.map((e) => (e ? patternName(e) : '')).join(', ')}]`
  if (id.type !== 'ObjectPattern') return '…'
  return `{ ${id.properties.map((p) => patternName(p.type === 'RestElement' ? p : p.value)).join(', ')} }`
}

/** True when `parent` hands `child` on as its own value: a type-only wrapper, `a ?? b`, `a || b`, `c ? a : b`. */
const handsOn = (child, parent) =>
  WRAPPERS.has(parent.type) || parent.type === 'LogicalExpression' || (parent.type === 'ConditionalExpression' && parent.test !== child)

/**
 * The node and its parent, looking through type-only wrappers and the branches of a logical or
 * conditional expression: `const doFetch = options.fetch ?? (() => ...)` binds the arrow to `doFetch`.
 */
function boundTo(node) {
  let child = node
  while (handsOn(child, child.parent)) child = child.parent
  return { child, parent: child.parent }
}

const BINDERS = {
  VariableDeclarator: (child, p) => (p.init === child ? patternName(p.id) : null),
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

/** The name a call's result reaches, through `await`, `?.`, a type-only wrapper, `.length` or `.then(...)`. */
function resultName(call) {
  let node = call
  for (let up = node.parent; ; up = node.parent) {
    const reads = (up.type === 'MemberExpression' && up.object === node) || (up.type === 'CallExpression' && up.callee === node)
    if (!THROUGH.has(up.type) && !reads) return bindingName(node)
    node = up
  }
}

/** A title the code spells out: `'renders'`, or a template literal with `${…}` for each expression. */
function titleOf(arg) {
  if (arg?.type === 'Literal' && typeof arg.value === 'string') return arg.value
  if (arg?.type !== 'TemplateLiteral') return null
  return arg.quasis.map((q) => q.value.cooked ?? q.value.raw).join('${…}')
}

/**
 * ` "title"` for the first of `items` before `place` that spells out a title, else ''. A title need
 * not come first: `mock.patch.object(target, 'name', fn)` and `register(app, 'save', fn)` name fn too.
 */
function titled(items, place) {
  const title = items.slice(0, place).map(titleOf).find((text) => text !== null) ?? null
  return title === null ? '' : ` ${JSON.stringify(title.replace(/\s+/g, ' ').trim())}`
}

/** `<arg 1 of t = test.describe "title">`: the place, the callee, what its result is bound to, its title. */
function callLabel(call, place) {
  const bound = resultName(call)
  const callee = bound === null ? dotted(call.callee) : `${bound} = ${dotted(call.callee)}`
  return `<arg ${place} of ${callee}${titled(call.arguments, place)}>`
}

/** `<once = (…)()>` for a function called where it is written, when what it returns is bound to a name. */
function calledAtOnce(call) {
  const bound = resultName(call)
  return bound === null ? null : `<${bound} = (…)()>`
}

/** `button`, `Foo.Bar`, `svg:rect`: a JSX element's name as written. */
function jsxName(name) {
  if (name.type === 'JSXIdentifier') return name.name
  if (name.type === 'JSXMemberExpression') return `${jsxName(name.object)}.${name.property.name}`
  return name.type === 'JSXNamespacedName' ? `${name.namespace.name}:${name.name.name}` : '…'
}

/** `<button onClick>` for a function in a JSX attribute, `<List children>` for one between an element's tags. */
function jsxLabel(container) {
  const holder = container.parent
  if (holder.type === 'JSXElement') return `<${jsxName(holder.openingElement.name)} children>`
  if (holder.type !== 'JSXAttribute' || holder.name.type !== 'JSXIdentifier') return null
  return `<${jsxName(holder.parent.name)} ${holder.name.name}>`
}

/**
 * How a function with no name of its own is used: handed to a call, called at once, held in JSX, held
 * in a list (`["role", (q) => ...]` is the row titled "role"), returned, or a parameter's default.
 */
const USAGES = {
  CallExpression: (child, p) => (p.callee === child ? calledAtOnce(p) : callLabel(p, p.arguments.indexOf(child))),
  NewExpression: (child, p) => (p.callee === child ? null : callLabel(p, p.arguments.indexOf(child))),
  JSXExpressionContainer: (child, p) => jsxLabel(p),
  ArrayExpression: (child, p) => `<item ${p.elements.indexOf(child)}${titled(p.elements, p.elements.indexOf(child))}>`,
  ReturnStatement: () => '<returned>',
  ArrowFunctionExpression: (child, p) => (p.body === child ? '<returned>' : null),
  AssignmentPattern: (child, p) => (p.right === child ? `<default of ${patternName(p.left)}>` : null),
}

function usageLabel(node) {
  const { child, parent } = boundTo(node)
  const usage = USAGES[parent.type]
  return usage ? usage(child, parent) : null
}

const functionLabel = (fn) =>
  fn.id?.name ?? bindingName(fn) ?? usageLabel(fn) ?? (fn.type === 'ArrowFunctionExpression' ? '<arrow function>' : '<function>')

/**
 * The name of an object or a list that holds functions, or null when the code gives it none. It is
 * named as a function is: by what it is bound to, or by how it is used (`<arg 0 of m = new Measurement>`,
 * `<Ctx.Provider value>`, `<returned>`, `<default of opts>`). An object in a list is the row its first
 * string value titles, `MODALS.<item "auth">`, with no place, so a row added before it moves nothing; a
 * list in a list is a row, whose functions take its title (`ROWS.<item 1 "role">`).
 */
function literalLabel(node) {
  const bound = bindingName(node)
  if (bound !== null) return bound
  if (boundTo(node).parent.type !== 'ArrayExpression') return usageLabel(node)
  if (node.type !== 'ObjectExpression') return null
  const title = titled(node.properties.map((p) => p.value), node.properties.length)
  return title === '' ? null : `<item${title}>`
}

/** True for what names a segment of a path: a function, a class, or an object or a list the code names. */
const isSegment = (node) =>
  FUNCTION_TYPES.has(node.type) || CLASS_TYPES.has(node.type) || (LITERALS.has(node.type) && literalLabel(node) !== null)

function segmentLabel(node) {
  if (FUNCTION_TYPES.has(node.type)) return functionLabel(node)
  return CLASS_TYPES.has(node.type) ? node.id?.name ?? bindingName(node) ?? '<class>' : literalLabel(node)
}

/** The segments that hold a node, outermost first. */
function segmentsAbove(node) {
  const found = []
  for (let up = node.parent; up; up = up.parent) if (isSegment(up)) found.unshift(up)
  return found
}

/**
 * The unit ESLint's complexity rule scores at this node, if any, as [kind, node, label]: a function,
 * a class field's initializer (ESLint scores `x = ...` in a class body on its own) or a static block.
 */
function unitAt(node) {
  if (FUNCTION_TYPES.has(node.type)) return ['function', node, functionLabel(node)]
  if (node.type === 'StaticBlock') return ['static', node, '<static block>']
  if (node.type !== 'PropertyDefinition' || !node.value) return null
  return ['initializer', node.value, `${keyName(node) ?? '<field>'}.<initializer>`]
}

/** The child nodes of `node`, by the parser's visitor keys. */
const childrenOf = (node, keys) =>
  (keys[node.type] ?? []).flatMap((key) => node[key] ?? []).filter((child) => typeof child?.type === 'string')

/** Every unit in a file, each with the path of segments that holds it and the labels of that path. */
function unitsOf(program, keys) {
  const units = []
  const labels = new Map()
  const labelOf = (node) => (labels.has(node) ? labels.get(node) : labels.set(node, segmentLabel(node)).get(node))
  const visit = (node) => {
    const found = unitAt(node)
    if (found) {
      const [kind, at, label] = found
      const above = segmentsAbove(at)
      const unit = { kind, node: at, suffix: [] }
      Object.assign(unit, { chain: [...above, unit], labels: [...above.map(labelOf), label] })
      units.push(unit)
    }
    for (const child of childrenOf(node, keys)) visit(child)
  }
  visit(program)
  return units
}

const startOf = (place) => (place.range ?? place.node.range)[0]

/**
 * Numbers units that share a whole path of labels. Their chains hold the same node at every level
 * before `from`. At the first level where they part, the places in source order take #2, #3; then
 * the units in each place are numbered the same way, further in.
 */
function number(units, from) {
  if (units.length < 2) return
  let level = from
  while (units.every((unit) => unit.chain[level] === units[0].chain[level])) level += 1
  const places = new Map()
  for (const unit of units) places.set(unit.chain[level], [...(places.get(unit.chain[level]) ?? []), unit])
  const ordered = [...places].sort(([a], [b]) => startOf(a) - startOf(b))
  ordered.forEach(([, held], i) => {
    if (i > 0) for (const unit of held) unit.suffix[level] = `#${i + 1}`
    number(held, level + 1)
  })
}

/** kind -> node -> key, for every unit in the file. */
function keysOf(program, visitorKeys) {
  const groups = new Map()
  for (const unit of unitsOf(program, visitorKeys)) {
    const path = JSON.stringify(unit.labels)
    groups.set(path, [...(groups.get(path) ?? []), unit])
  }
  const table = { function: new Map(), initializer: new Map(), static: new Map() }
  for (const units of groups.values()) {
    number(units, 0)
    for (const unit of units) table[unit.kind].set(unit.node, unit.labels.map((l, i) => l + (unit.suffix[i] ?? '')).join('.'))
  }
  return table
}

const TABLES = new WeakMap()

/**
 * The identity of one reported unit. `kind` is how ESLint names it: `Class field initializer`,
 * `Class static block`, or a function's name. Fails closed on a unit it does not know.
 */
export function identityOf(node, kind, sourceCode) {
  if (!TABLES.has(sourceCode.ast)) TABLES.set(sourceCode.ast, keysOf(sourceCode.ast, sourceCode.visitorKeys))
  const tag = /^class field initializer/i.test(kind) ? 'initializer' : /^class static block/i.test(kind) ? 'static' : 'function'
  const key = TABLES.get(sourceCode.ast)[tag].get(node)
  if (key === undefined) throw new Error(`complexity gate: no identity for "${kind}" at line ${node.loc.start.line}`)
  return key
}
