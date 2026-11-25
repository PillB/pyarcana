#!/usr/bin/env node
/**
 * Walks the web track (#ruta-web) as a learner does: the files the steps tell them to write, the
 * commands they tell them to type, the browser they tell them to open, and every «Deberías ver»
 * and «Si no funciona» checked against what really happens. Owner rule, 25 Nov 2026: "always test
 * what you say in the lessons; they should run and work as instructed".
 *
 * Everything is read from src/lib/tracks/web/content.ts, so a change to a step is walked as
 * written. Nothing is published: GitHub Pages and Cloudflare stop at the last local step (a commit,
 * a `wrangler deploy --dry-run`), because publishing needs the learner's own accounts.
 *
 *   node --import tsx scripts/web_track_learner_walk.mjs            # needs python3.12+ and Chromium
 *   WALK_WRANGLER=1 node --import tsx scripts/web_track_learner_walk.mjs   # also the wrangler dry run (downloads wrangler)
 *
 * Exits 1 on any failed check (step id, expected, actual); prints REFUSED and exits 2 when a tool
 * it needs is missing, because a walk that could not run did not pass.
 */
import { spawn, spawnSync } from 'node:child_process'
import { cpSync, existsSync, mkdirSync, mkdtempSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { createServer } from 'node:net'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { WEB_TRACK } from '../src/lib/tracks/web/content.ts'

const failures = []
let checks = 0
function check(stepId, what, ok, expected, actual) {
  checks++
  if (ok) return console.log(`ok    ${stepId}  ${what}`)
  failures.push(stepId)
  console.log(`FAIL  ${stepId}  ${what}\n      expected: ${expected}\n      actual:   ${String(actual).slice(0, 400)}`)
}
function refuse(why) {
  console.log(`REFUSED: ${why}`)
  process.exit(2)
}

const steps = new Map(WEB_TRACK.modules.flatMap((m) => m.steps.map((s) => [s.id, s])))
function code(stepId, title) {
  const block = steps.get(stepId)?.code?.find((c) => c.title === title)
  if (!block) refuse(`step ${stepId} has no code block titled ${title}; the walk follows the content and cannot guess.`)
  return block.code
}

function findPython() {
  for (const bin of [process.env.PYTHON, 'python3.12', 'python3']) {
    if (!bin) continue
    const r = spawnSync(bin, ['-c', 'import sys; print(sys.version_info >= (3, 12))'], { encoding: 'utf8' })
    if (r.status === 0 && r.stdout.trim() === 'True') return bin
  }
  return refuse('no Python 3.12 or later (set PYTHON=...). The track is written for 3.12.')
}

/** Compare `uv --version` with the minimum the D1 step names; null when uv is missing. */
function uvAtLeast(min) {
  const r = spawnSync('uv', ['--version'], { encoding: 'utf8' })
  const v = /uv (\d+)\.(\d+)\.(\d+)/.exec(r.stdout ?? '')
  if (!v) return null
  const [a, b, c] = v.slice(1).map(Number)
  const [x, y, z] = min.split('.').map(Number)
  return { version: v.slice(1).join('.'), ok: a > x || (a === x && (b > y || (b === y && c >= z))) }
}

async function getText(url, tries = 150) {
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(url)
      return { status: r.status, text: await r.text() }
    } catch {
      await new Promise((res) => setTimeout(res, 1000))
    }
  }
  return { status: 0, text: 'no answer' }
}

async function devRun(dir, port, paths) {
  const child = spawn('uv', ['run', 'pywrangler', 'dev', '--port', String(port)], { cwd: dir, detached: true })
  let log = ''
  const out = []
  child.stdout.on('data', (d) => (log += d))
  child.stderr.on('data', (d) => (log += d))
  try {
    for (const p of paths) out.push(await getText(`http://127.0.0.1:${port}${p}`))
    return out
  } finally {
    try { process.kill(-child.pid, 'SIGTERM') } catch { child.kill() }
    await new Promise((res) => setTimeout(res, 1500))
    out.log = log
  }
}

async function walkPrototype(project) {
  const id = 'prototipo.worker-d1'
  const body = steps.get(id).body.join(' ')
  const min = /pide la (\d+\.\d+\.\d+)/.exec(body)?.[1]
  if (!min) refuse(`${id} no longer names the minimum uv version ("pide la X.Y.Z"); the walk checks it.`)
  const uv = uvAtLeast(min)
  if (!uv) return console.log(`note  ${id}  uv is not installed here; the local Worker run was not done (not a pass)`)
  if (!uv.ok) return console.log(`note  ${id}  uv ${uv.version} is older than ${min}, which pywrangler needs (see the step's fix); not run, not a pass`)
  const dir = path.join(project, 'ventas-api')
  mkdirSync(path.join(dir, 'src'), { recursive: true })
  mkdirSync(path.join(dir, 'migrations'), { recursive: true })
  cpSync(path.join(project, 'site'), path.join(dir, 'site'), { recursive: true })
  for (const title of ['pyproject.toml', 'wrangler.jsonc', 'migrations/0001_inicial.sql', 'src/entry.py']) writeFileSync(path.join(dir, title), code(id, title))
  const script = code(id, 'probar_en_local.sh').split('\n')
  const sync = spawnSync('sh', ['-c', script[0]], { cwd: dir, encoding: 'utf8', timeout: 300_000 })
  check(id, `\`${script[0]}\` installs workers-py`, sync.status === 0, 'exit 0', sync.stderr)

  // The fix «no such table: ventas»: the API before the migration is applied locally.
  const port = await freePort()
  const [before] = await devRun(dir, port, ['/api/ventas?sede=SED-01'])
  check(id, 'before the local migration, the error is the one the fix names', /no such table: ventas/.test(before.text), 'no such table: ventas', `${before.status} ${before.text.slice(0, 200)}`)

  const apply = script.find((l) => l.includes('migrations apply'))
  const m = spawnSync('sh', ['-c', apply], { cwd: dir, encoding: 'utf8', timeout: 240_000 })
  check(id, `\`${apply}\` applies the migration to the local copy`, m.status === 0 && /0001_inicial\.sql/.test(m.stdout), 'exit 0, 0001_inicial.sql listed', (m.stderr || m.stdout).slice(-300))

  const expect = steps.get(id).expect
  const promised = /`(\{"sede": "SED-01", [^`]+\})`/.exec(expect)?.[1]
  const injected = /\?sede=([^`]+)`/.exec(expect.split('y con')[1] ?? '')?.[1]
  if (!promised || !injected) refuse(`${id}: «Deberías ver» no longer quotes the JSON and the injected address; the walk compares both.`)
  const run = await devRun(dir, await freePort(), ['/api/ventas?sede=SED-01', `/api/ventas?sede=${injected}`, '/'])
  const [api, inj, home] = run
  check(id, 'the local API answers exactly what «Deberías ver» quotes (rows and filas_leidas)', api.text === promised, promised, `${api.text} | log: ${(run.log ?? '').slice(-300)}`)
  check(id, 'the injected sede returns an empty list', /"ventas": \[\]/.test(inj.text), '"ventas": []', inj.text)
  check(id, 'other addresses still serve the site folder', home.status === 200 && /<table/.test(home.text), '200 with the table page', `${home.status} ${home.text.slice(0, 120)}`)

  // prototipo.ia promises how a dropped local table is repaired. Codex (PR #208) found the first
  // wording wrong: re-applying alone does nothing, because d1_migrations still lists 0001.
  const ia = steps.get('prototipo.ia').table.rows.map((r) => r.join(' ')).join(' ')
  const sh = (cmd) => spawnSync('sh', ['-c', cmd], { cwd: dir, encoding: 'utf8', timeout: 240_000 })
  sh('uv run pywrangler d1 execute ventas-prototipo --local --command "DROP TABLE ventas"')
  const again = sh(apply)
  check('prototipo.ia', 're-applying after a DROP alone applies nothing (why the step says to delete .wrangler/state first)', /No migrations to apply/.test(again.stdout), 'No migrations to apply', again.stdout.slice(-200))
  check('prototipo.ia', 'the step names the folder to delete', ia.includes('.wrangler/state'), '.wrangler/state in the table', ia.slice(0, 200))
  rmSync(path.join(dir, '.wrangler', 'state'), { recursive: true, force: true })
  sh(apply)
  const count = sh('uv run pywrangler d1 execute ventas-prototipo --local --json --command "SELECT COUNT(*) AS n FROM ventas"')
  check('prototipo.ia', 'after deleting .wrangler/state and re-applying, the table is back with its 3 rows', /"n": 3/.test(count.stdout), '"n": 3', (count.stderr || count.stdout).slice(-200))
}

async function freePort() {
  return new Promise((resolve) => {
    const s = createServer().listen(0, '127.0.0.1', () => {
      const { port } = s.address()
      s.close(() => resolve(port))
    })
  })
}

/** Start `python -m http.server PORT --directory DIR` as the step writes it, with PYTHON and a free port. */
function serve(py, command, cwd, port) {
  const args = command.trim().split(/\s+/)
  if (args[0] !== 'python' || args[2] !== 'http.server') refuse(`unexpected serve command: ${command}`)
  args[3] = String(port)
  const child = spawn(py, ['-u', ...args.slice(1)], { cwd })
  let out = ''
  child.stdout.on('data', (d) => (out += d))
  child.stderr.on('data', (d) => (out += d))
  return { child, output: () => out }
}

async function waitFor(fn, ms = 5000) {
  const end = Date.now() + ms
  while (Date.now() < end) {
    if (await fn()) return true
    await new Promise((r) => setTimeout(r, 100))
  }
  return false
}

/** Run a snippet the way DevTools' console does (top-level await allowed), and return what it logged or threw. */
async function inConsole(page, source) {
  const cdp = await page.context().newCDPSession(page)
  const logs = []
  cdp.on('Runtime.consoleAPICalled', (e) => logs.push(e.args.map((a) => a.value ?? a.description).join(' ')))
  await cdp.send('Runtime.enable')
  const r = await cdp.send('Runtime.evaluate', { expression: source, replMode: true, awaitPromise: true })
  await new Promise((res) => setTimeout(res, 100))
  return { logs, error: r.exceptionDetails ? r.exceptionDetails.exception?.description ?? r.exceptionDetails.text : null }
}

const columnText = (page, i) => page.$$eval('tbody tr', (rows, i) => rows.map((r) => r.cells[i].textContent), i)

async function walkBrowser(page, base, label) {
  await page.goto(base)
  const caption = await page.textContent('caption')
  check('sitio.construir', `${label}: the page shows the table with its caption`, /Ventas por sede/.test(caption ?? ''), 'a caption naming the table', caption)
  check('sitio.construir', `${label}: the escaped sede reads in full`, (await columnText(page, 0)).includes('Bodega <Norte>'), 'Bodega <Norte>', await columnText(page, 0))
  await page.getByRole('button', { name: 'Ventas' }).click()
  const asc = await columnText(page, 1)
  check('sitio.ordenar', `${label}: «Ventas» once puts 980.50 on top`, asc[0] === '980.50', '980.50 first', asc)
  await page.getByRole('button', { name: 'Ventas' }).click()
  const desc = await columnText(page, 1)
  check('sitio.ordenar', `${label}: «Ventas» again puts 1430.25 on top`, desc[0] === '1430.25', '1430.25 first', desc)
  const sorted = await page.$$eval('th', (ths) => ths.map((t) => t.getAttribute('aria-sort')))
  check('sitio.ordenar', `${label}: only the sorted column carries aria-sort`, sorted[0] === null && sorted[1] === 'descending', '[null, "descending"]', JSON.stringify(sorted))
}

async function main() {
  const py = findPython()
  let chromium
  try {
    ;({ chromium } = await import('playwright'))
  } catch {
    refuse('playwright is not installed (npm install); the walk needs a real browser.')
  }
  const project = mkdtempSync(path.join(tmpdir(), 'ruta-web-walk-'))
  console.log(`== walking the web track in ${project} with ${py}`)

  // 3.1 construir_sitio.py, saved and run as the learner does.
  writeFileSync(path.join(project, 'construir_sitio.py'), code('sitio.construir', 'construir_sitio.py'))
  let r = spawnSync(py, ['construir_sitio.py'], { cwd: project, encoding: 'utf8' })
  check('sitio.construir', 'construir_sitio.py runs from the project folder', r.status === 0, 'exit 0', r.stderr)
  check('sitio.construir', 'it creates site/ with data.json and index.html', existsSync(path.join(project, 'site', 'index.html')), 'site/index.html', readdirSync(project))

  // 3.2 app.js saved inside site/, as the step says; a second run then lists three files.
  writeFileSync(path.join(project, 'site', 'app.js'), code('sitio.ordenar', 'app.js'))
  r = spawnSync(py, ['construir_sitio.py'], { cwd: project, encoding: 'utf8' })
  const expect3 = steps.get('sitio.construir').expect
  check('sitio.construir', 'a re-run after saving app.js lists three files, as «Deberías ver» says', r.stdout.startsWith("['app.js', 'data.json', 'index.html']") && /tres si ya guardaste/.test(expect3), "['app.js', 'data.json', 'index.html'] and the expect text naming it", r.stdout.split('\n')[0])

  // 3.3 Serve the folder.
  const serveCmd = code('sitio.servir', 'servir_sitio.sh')
  const port = await freePort()
  const server = serve(py, serveCmd, project, port)
  const up = await waitFor(() => server.output().includes(`port ${port}`))
  check('sitio.servir', '«Serving HTTP on ... port N» appears, as «Deberías ver» says', up && /Serving HTTP on .* port \d+/.test(server.output()), `Serving HTTP on ... port ${port}`, server.output())

  // Same port again: the «Si no funciona» symptom.
  const second = spawnSync(py, ['-m', 'http.server', String(port), '--directory', 'site'], { cwd: project, encoding: 'utf8', timeout: 5000 })
  check('sitio.servir', 'a second server on the same port says «Address already in use»', /Address already in use|WinError 10048/.test(second.stderr), 'Address already in use', second.stderr.split('\n').slice(-2).join(' '))

  const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {})
  try {
    const page = await browser.newPage()
    const base = `http://localhost:${port}/`
    await walkBrowser(page, base, 'http://localhost')
    const json = await (await page.request.get(`${base}data.json`)).json()
    check('sitio.servir', '/data.json shows the three sedes', Array.isArray(json) && json.length === 3, '3 records', JSON.stringify(json))

    // 2.2 The console snippet, run as DevTools runs it, on the served page.
    await page.goto(base)
    const ok = await inConsole(page, code('http.navegador', 'en_la_consola_del_navegador.js'))
    check('http.navegador', 'the console snippet logs «3 sedes» on the served page', ok.logs.includes('3 sedes') && !ok.error, '3 sedes', JSON.stringify(ok))

    // The same snippet from file://: the «Si no funciona» symptom, and the table still sorts there.
    const filePage = await browser.newPage()
    await walkBrowser(filePage, pathToFileURL(path.join(project, 'site', 'index.html')).href, 'file://')
    const bad = await inConsole(filePage, code('http.navegador', 'en_la_consola_del_navegador.js'))
    check('http.navegador', 'from file:// the console shows a fetch error, as «Si no funciona» says', Boolean(bad.error) && /fetch/i.test(bad.error), 'an error naming fetch', JSON.stringify(bad))

    // 4.2 Relative paths under a GitHub Pages-style subfolder.
    const pages = mkdtempSync(path.join(tmpdir(), 'ruta-web-pages-'))
    cpSync(path.join(project, 'site'), path.join(pages, 'mi-sitio'), { recursive: true })
    const pagesPort = await freePort()
    const pagesServer = serve(py, `python -m http.server ${pagesPort} --directory .`, pages, pagesPort)
    await waitFor(() => pagesServer.output().includes(`port ${pagesPort}`))
    await page.goto(`http://localhost:${pagesPort}/mi-sitio/`)
    const status = (url) => page.evaluate(async (u) => (await fetch(u)).status, url)
    const rel = await status('data.json')
    const abs = await status('/data.json')
    console.log(`      (page at ${page.url()}: data.json → ${rel}, /data.json → ${abs})`)
    check('despliegue.rutas-relativas', 'in a subfolder, data.json loads and /data.json does not', rel === 200 && abs === 404, '200 then 404', `${rel} then ${abs}`)
    pagesServer.child.kill()
  } finally {
    await browser.close()
    server.child.kill()
  }

  // 4.3 GitHub Pages: every command up to the push, in a copy of site/ named mi-sitio.
  const repo = path.join(project, 'mi-sitio')
  cpSync(path.join(project, 'site'), repo, { recursive: true })
  const lines = code('despliegue.github-pages', 'publicar_github_pages.sh').split('\n').slice(1)
  const env = { ...process.env, GIT_AUTHOR_NAME: 'Ana Demo', GIT_AUTHOR_EMAIL: 'ana@example.com', GIT_COMMITTER_NAME: 'Ana Demo', GIT_COMMITTER_EMAIL: 'ana@example.com' }
  for (const line of lines.filter((l) => l.startsWith('git '))) {
    const g = spawnSync('sh', ['-c', line], { cwd: repo, encoding: 'utf8', env })
    check('despliegue.github-pages', `\`${line}\` succeeds`, g.status === 0, 'exit 0', g.stderr || g.stdout)
  }
  const ghLine = lines.find((l) => l.startsWith('gh repo create')) ?? ''
  const help = spawnSync('gh', ['repo', 'create', '--help'], { encoding: 'utf8' })
  if (help.status !== 0) console.log('note  despliegue.github-pages  gh is not installed here; its flags were not checked (not a pass)')
  else for (const flag of ['--public', '--source', '--push']) check('despliegue.github-pages', `gh repo create accepts ${flag}`, ghLine.includes(flag) && help.stdout.includes(flag), flag, ghLine)

  // 4.4 Cloudflare: the config as written, validated by wrangler without publishing.
  if (process.env.WALK_WRANGLER === '1') {
    mkdirSync(project, { recursive: true })
    writeFileSync(path.join(project, 'wrangler.jsonc'), code('despliegue.cloudflare', 'wrangler.jsonc'))
    const w = spawnSync('npx', ['--yes', 'wrangler@4', 'deploy', '--dry-run'], { cwd: project, encoding: 'utf8', timeout: 240_000 })
    check('despliegue.cloudflare', 'wrangler accepts wrangler.jsonc and finds the site folder (dry run)', w.status === 0, 'exit 0', (w.stderr || w.stdout).split('\n').slice(-6).join(' | '))
  } else console.log('note  despliegue.cloudflare  wrangler dry run not run (set WALK_WRANGLER=1); not a pass')

  // 4.5 Prototype: the Python Worker with D1, run locally as probar_en_local.sh says (no account:
  // `d1 create` needs one, so the placeholder database_id stays and only --local is used).
  if (process.env.WALK_WRANGLER === '1') await walkPrototype(project)
  else console.log('note  prototipo.worker-d1  local Python Worker run not done (set WALK_WRANGLER=1); not a pass')

  console.log(`\n${checks - failures.length} of ${checks} checks passed${failures.length ? `; failed in: ${[...new Set(failures)].join(', ')}` : ''}.`)
  if (failures.length) {
    console.log('Next step: each FAIL names the step in src/lib/tracks/web/content.ts whose words and behaviour disagree. Fix the words or the code, then walk again.')
    process.exit(1)
  }
}

main().catch((e) => {
  console.log(`FAIL  walk crashed: ${e.stack}`)
  process.exit(1)
})
