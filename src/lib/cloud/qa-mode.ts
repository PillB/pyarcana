/**
 * QA / test mode (DESIGN-v3 §H), stored under `pyarcana:qa-mode:v1`.
 *
 * - testMode ("Modo prueba"): test ad placeholders instead of real ads, no experiments, no surveys,
 *   and a small "MODO PRUEBA" badge.
 * - adPreview ("Previsualizar anuncios"): placeholders even for Pro and tester accounts, to check
 *   layout. Neither makes a network request.
 * Anything but an explicit `true` reads as off.
 */
import { isPlainObject, readJson, writeJson, type KeyValueStorage } from '@/lib/cloud/storage'

export const QA_MODE_KEY = 'pyarcana:qa-mode:v1'
/** Dispatched on window after a write, so same-tab listeners update (storage events are cross-tab only). */
export const QA_MODE_EVENT = 'pyarcana:qa-mode-change'

export interface QaMode {
  testMode: boolean
  adPreview: boolean
}

export const QA_MODE_OFF: QaMode = { testMode: false, adPreview: false }

export function readQaMode(storage: KeyValueStorage | null): QaMode {
  const raw = readJson(storage, QA_MODE_KEY)
  if (!isPlainObject(raw)) return QA_MODE_OFF
  return { testMode: raw.testMode === true, adPreview: raw.adPreview === true }
}

export function writeQaMode(storage: KeyValueStorage | null, patch: Partial<QaMode>, nowMs: number): QaMode {
  const next = { ...readQaMode(storage), ...patch }
  writeJson(storage, QA_MODE_KEY, { v: 1, ...next, at: new Date(nowMs).toISOString() })
  if (typeof window !== 'undefined') window.dispatchEvent(new Event(QA_MODE_EVENT))
  return next
}
