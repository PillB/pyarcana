import test from 'node:test'
import assert from 'node:assert/strict'
import { isApplePlatform, matchShortcut, shortcutLabel, type ShortcutEvent } from '@/lib/hotkeys'

// Owner request 5 Oct 2026: Ctrl/⌘ + Alt + Q (QA) and + S (force sync) across browsers and layouts.
// Each row is what the browser reports for that physical combination (UI Events KeyboardEvent key and
// code values; macOS Option changes `key`, Windows/Linux Ctrl+Alt is AltGr).

const ev = (p: Partial<ShortcutEvent>): ShortcutEvent => ({ key: '', code: '', ctrlKey: false, metaKey: false, altKey: false, ...p })

const MATRIX: Array<[string, ShortcutEvent, 'q' | 's', boolean, boolean]> = [
  // [case, event, letter, apple platform, expected]
  ['macOS Chrome/Safari/Firefox Ctrl+Option+Q ("œ")', ev({ key: 'œ', code: 'KeyQ', ctrlKey: true, altKey: true }), 'q', true, true],
  ['macOS Cmd+Option+Q ("œ")', ev({ key: 'œ', code: 'KeyQ', metaKey: true, altKey: true }), 'q', true, true],
  ['macOS Cmd+Option+Q (browser reports "q")', ev({ key: 'q', code: 'KeyQ', metaKey: true, altKey: true }), 'q', true, true],
  ['macOS Ctrl+Option+S ("ß")', ev({ key: 'ß', code: 'KeyS', ctrlKey: true, altKey: true }), 's', true, true],
  ['macOS dead key (Option+E style) on the S position', ev({ key: 'Dead', code: 'KeyS', metaKey: true, altKey: true }), 's', true, true],
  ['Windows US Ctrl+Alt+Q', ev({ key: 'q', code: 'KeyQ', ctrlKey: true, altKey: true }), 'q', false, true],
  ['Windows US Ctrl+Alt+S', ev({ key: 's', code: 'KeyS', ctrlKey: true, altKey: true }), 's', false, true],
  ['Windows with Caps Lock: "Q"', ev({ key: 'Q', code: 'KeyQ', ctrlKey: true, altKey: true }), 'q', false, true],
  ['Windows Spanish Ctrl+Alt+Q (no AltGr character)', ev({ key: 'q', code: 'KeyQ', ctrlKey: true, altKey: true }), 'q', false, true],
  ['Windows German AltGr+Q types "@": never taken', ev({ key: '@', code: 'KeyQ', ctrlKey: true, altKey: true }), 'q', false, false],
  ['Windows Polish AltGr+S types "ś": never taken', ev({ key: 'ś', code: 'KeyS', ctrlKey: true, altKey: true }), 's', false, false],
  ['Windows key reported Unidentified', ev({ key: 'Unidentified', code: 'KeyQ', ctrlKey: true, altKey: true }), 'q', false, true],
  ['AZERTY: the key labelled Q (code KeyA)', ev({ key: 'q', code: 'KeyA', ctrlKey: true, altKey: true }), 'q', false, true],
  ['AZERTY: the key labelled A sits at KeyQ', ev({ key: 'a', code: 'KeyQ', ctrlKey: true, altKey: true }), 'q', false, false],
  ['Linux US Ctrl+Alt+Q', ev({ key: 'q', code: 'KeyQ', ctrlKey: true, altKey: true }), 'q', false, true],
  ['no Alt: Ctrl+Q (browser quit on Linux) is not ours', ev({ key: 'q', code: 'KeyQ', ctrlKey: true }), 'q', false, false],
  ['no Ctrl/⌘: Alt+Q alone', ev({ key: 'q', code: 'KeyQ', altKey: true }), 'q', false, false],
  ['held key repeats are ignored', ev({ key: 'q', code: 'KeyQ', ctrlKey: true, altKey: true, repeat: true }), 'q', false, false],
  ['IME composition is ignored', ev({ key: 'q', code: 'KeyQ', ctrlKey: true, altKey: true, isComposing: true }), 'q', false, false],
  ['Q is not S', ev({ key: 'q', code: 'KeyQ', ctrlKey: true, altKey: true }), 's', false, false],
]

test('Ctrl/⌘ + Alt + letter: the platform and layout matrix', () => {
  for (const [name, event, letter, apple, want] of MATRIX) assert.equal(matchShortcut(event, letter, apple), want, name)
})

test('the platform decides the label, and Apple is recognised from userAgentData, platform or the user agent', () => {
  assert.equal(isApplePlatform({ userAgentData: { platform: 'macOS' } }), true)
  assert.equal(isApplePlatform({ platform: 'MacIntel' }), true)
  assert.equal(isApplePlatform({ platform: 'iPad' }), true)
  assert.equal(isApplePlatform({ platform: '', userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)' }), true)
  assert.equal(isApplePlatform({ platform: 'Win32', userAgent: 'Mozilla/5.0 (Windows NT 10.0)' }), false)
  assert.equal(isApplePlatform({ userAgentData: { platform: 'Linux' } }), false)
  assert.equal(isApplePlatform(undefined), false)
  assert.equal(shortcutLabel('q', true), '⌘ + Option + Q')
  assert.equal(shortcutLabel('s', false), 'Ctrl + Alt + S')
})
