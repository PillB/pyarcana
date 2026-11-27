/**
 * Run real source under independent behavioral oracles and prove deliberate regressions go red.
 * The disposable compiled copies never edit tracked files or touch actual learner storage.
 * Run: node scripts/lesson_parity_mutations.mjs
 */
import assert from 'node:assert/strict'
import { mkdtempSync, readFileSync, writeFileSync, rmSync, mkdirSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve, dirname } from 'node:path'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
const require = createRequire(import.meta.url)
const ts = require('typescript')
const root = resolve(fileURLToPath(new URL('..', import.meta.url)))
const paths = [
  'src/lib/setup/os.ts', 'src/lib/setup/progress.ts',
  'src/lib/setup/shared-state.ts', 'src/lib/learning-checks.ts',
  'src/lib/tracks/progress.ts', 'src/lib/tracks/placement.ts', 'src/lib/tracks/shared-state.ts',
  'src/lib/tracks/storage-admission.ts', 'src/lib/learning-resume.ts',
]
const sources = Object.fromEntries(paths.map(p => [p.replace('src/lib/',''), readFileSync(join(root,p),'utf8')]))
const key = 'pyarcana:sesion0:v1'

function memory(raw = null) {
  return { raw, writes: 0, getItem() { return this.raw }, setItem(_k,v) { this.raw = v; this.writes++ } }
}

function fail(code, actual, expected) {
  assert.deepEqual(actual,expected,code)
}

async function withSources(mutation, run) {
  const dir = mkdtempSync(join(tmpdir(),'pyarcana-mutation-'))
  try {
    for (const [name,original] of Object.entries(sources)) {
      let source = original
      if (mutation?.file === name) {
        const count = source.split(mutation.from).length - 1
        assert.equal(count,1,'REFUSED: '+mutation.name+' expected one mutation site; found '+count)
        source = source.replace(mutation.from,mutation.to)
      }
      const result = ts.transpileModule(source,{
        fileName:name,reportDiagnostics:true,
        compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS,strict:true},
      })
      const errors = (result.diagnostics ?? []).filter(d => d.category === ts.DiagnosticCategory.Error)
      assert.equal(errors.length,0,'REFUSED: compile diagnostics '+JSON.stringify(errors.map(d=>d.messageText)))
      const destination = join(dir,name.replace(/\.ts$/,'.js'))
      mkdirSync(dirname(destination),{recursive:true})
      writeFileSync(destination,result.outputText)
    }
    const load = createRequire(join(dir,'entry.cjs'))
    return await run({state:load('./setup/shared-state.js'),checks:load('./learning-checks.js'),track:load('./tracks/shared-state.js'),resume:load('./learning-resume.js')})
  } finally { rmSync(dir,{recursive:true,force:true}) }
}

async function readDenied({state}) {
  const store = memory('{"v":1,"os":null,"done":["existing"]}')
  let readable = true
  const setup = state.createSetupState(()=>({
    getItem:()=>{if(!readable)throw Error('read denied');return store.raw},
    setItem:(k,v)=>store.setItem(k,v),
  }))
  setup.snapshot()
  readable = false
  setup.apply({type:'step',id:'new.step',done:true})
  fail('READ_DENIED_WRITE',store.writes,0)
  readable = true
  setup.retry()
  fail('READ_RECOVERY',JSON.parse(store.raw).done,['existing','new.step'])
}

async function versionDrift({state}) {
  const raw = '{"v":2,"os":null,"done":["existing"]}'
  const store = memory(raw)
  const setup = state.createSetupState(()=>store)
  setup.apply({type:'step',id:'new.step',done:true})
  fail('VERSION_DOWNGRADED',store.raw,raw)
}
async function fieldDrift({state}) {
  const raw = '{"v":1,"os":null,"done":["existing"],"metadata":{"keep":true}}'
  const store = memory(raw)
  state.createSetupState(()=>store).apply({type:'step',id:'new.step',done:true})
  fail('UNKNOWN_FIELD_DROPPED',store.raw,raw)
}
async function lockDenied({state}) {
  const store = memory()
  const setup = state.createSetupState(()=>store)
  setup.stage({type:'step',id:'new.step',done:true})
  await state.flushSetup(setup,async()=>{throw Error('denied')})
  fail('LOCK_BYPASSED',store.writes,0)
  fail('LOCK_INTENT_LOST',setup.getSnapshot().pendingCount,1)
}
async function scoring({checks}) {
  const q = checks.WEB_CHECKS.despliegue
  const actual = q.options.indexOf('./data.json')
  fail('SEMANTIC_KEY_MISGRADED',checks.checkAnswer(q,actual),'correct')
  fail('DISTRACTOR_ACCEPTED',checks.checkAnswer(q,q.options.indexOf('/data.json')),'incorrect')
}
async function feedback({checks}) {
  const q = checks.WEB_CHECKS.despliegue
  const a = checks.answerFeedback(q,q.options.indexOf('/data.json'))
  const b = checks.answerFeedback(q,q.options.indexOf('../data.json'))
  fail('GENERIC_FEEDBACK',a === b,false)
}
async function shuffle({checks}) {
  fail('SHUFFLE_NO_PERMUTATION',checks.shuffledOptions(3,()=>0),[1,2,0])
}

const trackKey='pyarcana:track:ruta-web:v1'
const positionKey='pyarcana:track:ruta-web:furthest:v1'
function trackMemory(entries=[]) {
  const map=new Map(entries)
  return {map,getItem:k=>map.get(k)??null,setItem:(k,v)=>map.set(k,v)}
}
async function trackVersion({track}) {
  const raw='{"v":2,"done":["existing"]}'
  const kv=trackMemory([[trackKey,raw]])
  track.createTrackState('ruta-web',()=>kv).setStep('new.step',true,[])
  fail('TRACK_ACTIVE_DOWNGRADE',kv.map.get(trackKey),raw)
}
async function trackRead({track}) {
  const kv=trackMemory([[trackKey,'{"v":1,"done":["existing"]}']])
  let readable=true
  const state=track.createTrackState('ruta-web',()=>({
    getItem:k=>{if(!readable&&k===trackKey)throw Error('denied');return kv.getItem(k)},
    setItem:kv.setItem,
  }))
  state.refresh()
  readable=false
  state.setStep('new.step',true,[])
  fail('TRACK_READ_LOST_KNOWN',state.getSnapshot().progress.done,['existing','new.step'])
  fail('TRACK_READ_WROTE',kv.map.get(trackKey),'{"v":1,"done":["existing"]}')
}
async function trackLock({track}) {
  const kv=trackMemory()
  const state=track.createTrackState('ruta-web',()=>kv)
  state.stageStep('new.step',true,[])
  await track.flushTrack(state,async()=>{throw Error('denied')})
  fail('TRACK_LOCK_BYPASS',kv.map.has(trackKey),false)
}
async function trackPosition({track}) {
  const kv=trackMemory()
  const a=track.createTrackState('ruta-web',()=>kv), b=track.createTrackState('ruta-web',()=>kv)
  const sections=[{id:'early',index:1},{id:'late',index:30}]
  a.stageVisit(sections,'late')
  b.stageVisit(sections,'early')
  await track.flushTrack(a)
  await track.flushTrack(b)
  fail('TRACK_HIGH_WATER_REGRESSED',kv.map.get(positionKey),'late')
}
async function resumeDrift({resume}) {
  const groups=[{id:'new',title:'New',stepIds:['new.1']},{id:'old',title:'Old',stepIds:['old.1']}]
  fail('RESUME_INSERTION_IGNORED',resume.nextLearningGroup(groups,['old.1'])?.id,'new')
}
const cases = [
  {name:'track future active record downgraded',file:'tracks/storage-admission.ts',from:"r.v !== 1 || Object.keys(r).some",to:"false || Object.keys(r).some",run:trackVersion,code:'TRACK_ACTIVE_DOWNGRADE'},
  {name:'track read denial forgets known state',file:'tracks/shared-state.ts',from:"if (!result.ok) { progressIssue = result.issue; return false }",to:"if (!result.ok) { lastGood = {done:[]}; progressIssue = result.issue; return false }",run:trackRead,code:'TRACK_READ_LOST_KNOWN'},
  {name:'track denied lock bypassed',file:'tracks/shared-state.ts',from:"catch { state.refuseLock() }",to:"catch { state.retry() }",run:trackLock,code:'TRACK_LOCK_BYPASS'},
  {name:'track high-water overwritten by earlier staged visit',file:'tracks/shared-state.ts',from:"const next = position()",to:"const next = pendingVisit",run:trackPosition,code:'TRACK_HIGH_WATER_REGRESSED'},
  {name:'resume ignores inserted unfinished group',file:'learning-resume.ts',from:"groups.find(g => g.stepIds.some(id => !completed.has(id)))",to:"groups.find(g => g.stepIds.every(id => completed.has(id)))",run:resumeDrift,code:'RESUME_INSERTION_IGNORED'},
  {name:'read denial becomes empty',file:'shared-state.ts',from:"catch { return { ok: false, issue: 'read' } }",to:"catch { return { ok: true, progress: EMPTY_SETUP_PROGRESS } }",run:readDenied,code:'READ_DENIED_WRITE'},
  {name:'future version accepted',file:'shared-state.ts',from:"if (record.v !== undefined && record.v !== 1) return false",to:"if (false) return false",run:versionDrift,code:'VERSION_DOWNGRADED'},
  {name:'unknown field discarded',file:'shared-state.ts',from:"if (Object.keys(record).some(key => !['v', 'os', 'done'].includes(key))) return false",to:"if (false) return false",run:fieldDrift,code:'UNKNOWN_FIELD_DROPPED'},
  {name:'lock denial falls back to uncoordinated write',file:'shared-state.ts',from:"catch { state.refuseLock() }",to:"catch { state.retry() }",run:lockDenied,code:'LOCK_BYPASSED'},
  {name:'semantic answer inverted',file:'learning-checks.ts',from:"selected === check.correct ? 'correct' : 'incorrect'",to:"selected === check.correct ? 'incorrect' : 'correct'",run:scoring,code:'SEMANTIC_KEY_MISGRADED'},
  {name:'wrong answers share generic feedback',file:'learning-checks.ts',from:"check.explanation : check.feedback[selected]",to:"check.explanation : 'Revisa el ejemplo.'",run:feedback,code:'GENERIC_FEEDBACK'},
  {name:'shuffle returns fixed order',file:'learning-checks.ts',from:";[order[i], order[j]] = [order[j], order[i]]",to:";[order[i], order[j]] = [order[i], order[j]]",run:shuffle,code:'SHUFFLE_NO_PERMUTATION'},
]
for (const c of cases) {
  await withSources(null,c.run)
  console.log('GREEN',c.code,'unmodified source passes')
  let failure
  try { await withSources(c,c.run) } catch (error) { failure = error }
  if (!failure || failure.code !== 'ERR_ASSERTION' || !failure.message.startsWith(c.code)) {
    throw Error('REFUSED: '+c.name+' did not fail for '+c.code+'; observed '+String(failure))
  }
  console.log('RED',c.name,'caught by',c.code)
}
console.log('PASS: '+cases.length+'/'+cases.length+' targeted mutants killed by independent behavior checks')
