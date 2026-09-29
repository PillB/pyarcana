import test from 'node:test'
import assert from 'node:assert/strict'
import {
  readAdsenseOptIn,
  writeAdsenseOptIn,
  ADSENSE_OPTIN_KEY,
  parseGeo,
  houseCreative,
  HOUSE_CREATIVES,
  ethicalAdsKeywords,
  SLOT_HEIGHT_PX,
  houseArmShows,
  slotView,
} from '@/lib/cloud/ad-slot'
import { buildSurveyBody, GATE_REASONS, surveyTrigger } from '@/lib/cloud/survey-ui'
import { createMemoryStorage } from '@/lib/cloud/storage'
import { t, type Language } from '@/lib/i18n'

const NOW = Date.parse('2026-10-01T12:00:00Z')

// --- AdSense in-slot opt-in -------------------------------------------------------------------------

test('the AdSense opt-in is stored only with the 18+ attestation; a decline is remembered', () => {
  const s = createMemoryStorage()
  assert.equal(readAdsenseOptIn(s), 'unset')
  assert.equal(writeAdsenseOptIn(s, 'accepted', false, NOW), false, 'no attestation, no opt-in')
  assert.equal(readAdsenseOptIn(s), 'unset')
  assert.equal(writeAdsenseOptIn(s, 'accepted', true, NOW), true)
  assert.equal(readAdsenseOptIn(s), 'accepted')
  assert.deepEqual(JSON.parse(s.getItem(ADSENSE_OPTIN_KEY)!), { v: 1, value: 'accepted', adult: true, at: '2026-10-01T12:00:00.000Z' })
  writeAdsenseOptIn(s, 'declined', false, NOW)
  assert.equal(readAdsenseOptIn(s), 'declined')
  s.setItem(ADSENSE_OPTIN_KEY, '{"v":1,"value":"accepted","adult":false}')
  assert.equal(readAdsenseOptIn(s), 'unset', 'an accept without the attestation is not an opt-in')
  s.setItem(ADSENSE_OPTIN_KEY, 'garbage')
  assert.equal(readAdsenseOptIn(s), 'unset')
})

test('geo: only a two-letter country from a successful answer counts; anything else fails closed', () => {
  assert.deepEqual(parseGeo({ ok: true, status: 200, data: { country: 'pe' } }), { status: 'ok', country: 'PE' })
  assert.deepEqual(parseGeo({ ok: true, status: 200, data: { country: 'XX1' } }), { status: 'failed', country: null })
  assert.deepEqual(parseGeo({ ok: true, status: 200, data: {} }), { status: 'failed', country: null })
  assert.deepEqual(parseGeo({ ok: false, status: 0, reason: 'network', data: null }), { status: 'failed', country: null })
})

// --- house ads -------------------------------------------------------------------------------------

test('house creatives never promise what the stage cannot deliver', () => {
  for (const id of ['a', 'functions', 'files-ingestion', 'oop', 'x1', 'y2']) {
    const beta = houseCreative({ sectionKey: id, stage: 'beta', trialOffered: true })
    assert.notEqual(beta, 'annual', 'no annual plan promo before payments open')
    assert.notEqual(houseCreative({ sectionKey: id, stage: 'paid', trialOffered: false }), 'trial', 'no trial promo for someone who cannot start one')
  }
  assert.equal(houseCreative({ sectionKey: 'a', stage: 'sync', trialOffered: true }), null, 'no Pro promos while there is no Pro')
})

test('the creative is stable for a section (no rotation on sub-step change) and all creatives appear across sections', () => {
  const pick = (k: string) => houseCreative({ sectionKey: k, stage: 'paid', trialOffered: true })
  const first = pick('functions')
  for (let i = 0; i < 25; i++) assert.equal(pick('functions'), first, 'same section, same creative, every render')
  const seen = new Set(Array.from({ length: 60 }, (_, i) => pick(`s${i}`)))
  assert.deepEqual([...seen].sort(), [...HOUSE_CREATIVES].sort())
})

test('every house creative has its copy in all three languages, with the label outside the creative', () => {
  for (const id of HOUSE_CREATIVES) {
    for (const lang of ['es-PE', 'es-ES', 'en'] as Language[]) {
      for (const part of ['title', 'body', 'cta']) {
        const key = `ads.house.${id}.${part}`
        assert.notEqual(t(key, lang), key, `${key} (${lang})`)
      }
    }
  }
  assert.equal(t('ads.label', 'es-PE'), 'Anuncios', 'the only Spanish label AdSense allows besides "Enlaces patrocinados"')
  assert.equal(t('ads.test.label', 'es-PE'), 'Anuncio de prueba (no es publicidad real)')
})

test('the ads_house_v1 control arm shows no promo; without the experiment the house slot shows', () => {
  assert.equal(houseArmShows(null), true)
  assert.equal(houseArmShows('house'), true)
  assert.equal(houseArmShows('none'), false)
})

test('ads_house_v1: both arms render nothing until access and arm are known, so the layout differs only where the arms do (CLS)', () => {
  // Frames of one page load: access unknown (/v1/me pending) -> free, arm loading -> arm known.
  const frames = (arm: 'none' | 'house') => [
    slotView('reserved', undefined, 'house'),
    slotView('house', undefined, 'house'),
    slotView('house', houseArmShows(arm) ? 'trial' : null, 'house'),
  ]
  assert.deepEqual(frames('none'), [null, null, null], 'control: no box appears and collapses')
  assert.deepEqual(frames('house'), [null, null, 'house'], 'treatment: the box appears once, with its content')
  assert.equal(slotView('house', null, 'house'), null)
  assert.equal(slotView('none', 'trial', 'house'), null)
})

test('a configured ad network keeps the reserved box before its script; test placeholders render at once', () => {
  assert.equal(slotView('reserved', undefined, 'adsense'), 'reserved', 'eligibility still unknown: the box is held')
  assert.equal(slotView('reserved', undefined, 'ethicalads'), 'reserved')
  assert.equal(slotView('test', null, 'house'), 'test')
  assert.equal(slotView('adsense', null, 'adsense'), 'adsense')
  assert.equal(slotView('adsense_optin', null, 'adsense'), 'adsense_optin')
  assert.equal(slotView('ethicalads', null, 'ethicalads'), 'ethicalads')
  assert.equal(slotView('house', 'annual', 'adsense'), 'house', 'a network provider falling back to house still shows the promo')
})

test('EthicalAds gets English keywords per section (its classifier skips Spanish text)', () => {
  assert.equal(ethicalAdsKeywords('files-ingestion'), 'python|data-science|files|ingestion')
  assert.equal(ethicalAdsKeywords('Bad Id!'), 'python|data-science')
  const many = Array.from({ length: 25 }, (_, i) => `kw${i}`).join('-')
  assert.equal(ethicalAdsKeywords(many).split('|').length, 20, 'EthicalAds reads at most 20')
})

test('every placement reserves a fixed box before anything loads', () => {
  for (const p of ['section_end', 'resources_end', 'rail', 'glossary_footer'] as const) assert.ok(SLOT_HEIGHT_PX[p] >= 100, p)
})

// --- surveys -----------------------------------------------------------------------------------------

test('survey bodies are validated before sending; free text is capped at 500 characters', () => {
  assert.deepEqual(buildSurveyBody('section_csat', { score: 4, sectionIndex: 6 }), { kind: 'section_csat', score: 4, sectionIndex: 6 })
  assert.equal(buildSurveyBody('section_csat', { score: 6 }), null)
  assert.equal(buildSurveyBody('section_csat', { score: 0 }), null)
  assert.deepEqual(buildSurveyBody('nps', { score: 0 }), { kind: 'nps', score: 0 })
  assert.equal(buildSurveyBody('nps', { score: 11 }), null)
  assert.equal(buildSurveyBody('nps', { score: 7.5 }), null)
  assert.deepEqual(buildSurveyBody('gate_reason', { reasonCode: 'price', sectionIndex: 6 }), { kind: 'gate_reason', reasonCode: 'price', sectionIndex: 6 })
  assert.equal(buildSurveyBody('gate_reason', { reasonCode: 'made_up' }), null)
  const long = buildSurveyBody('cancel_reason', { reasonCode: 'other', text: 'x'.repeat(600) })
  assert.equal((long?.text as string).length, 500)
  assert.deepEqual(buildSurveyBody('nps', { score: 9, text: '   ', cid: 'nothex' }), { kind: 'nps', score: 9 })
  assert.deepEqual(buildSurveyBody('nps', { score: 9, cid: 'a'.repeat(32) }), { kind: 'nps', score: 9, cid: 'a'.repeat(32) })
  for (const code of GATE_REASONS) assert.notEqual(t(`survey.reason.${code}`, 'en'), `survey.reason.${code}`)
})

test('the prompt trigger: CSAT on a newly completed section, NPS from the first visit date, gate reason on dismissal', () => {
  assert.deepEqual(surveyTrigger({ kind: 'completed', prev: ['a'], next: ['a', 'b'], remote: false }), { kind: 'section_csat', sectionId: 'b' })
  assert.equal(surveyTrigger({ kind: 'completed', prev: ['a', 'b'], next: ['a'], remote: false }), null, 'an un-toggle asks nothing')
  assert.equal(surveyTrigger({ kind: 'completed', prev: ['a'], next: ['a'], remote: false }), null)
  assert.deepEqual(surveyTrigger({ kind: 'gate_dismissed', sectionIndex: 6 }), { kind: 'gate_reason', sectionIndex: 6 })
})
