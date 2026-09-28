/**
 * The storage seam every cloud module uses. Modules take a KeyValueStorage instead of touching
 * window.localStorage, so the rules (archive byte-for-byte, never write python-ds-progress,
 * quota failures) are unit-testable, and a private window with storage blocked degrades to
 * "nothing remembered" instead of an exception.
 */

export interface KeyValueStorage {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
  removeItem(key: string): void
  /** Every key currently stored. */
  keys(): string[]
}

export function createMemoryStorage(initial: Record<string, string> = {}): KeyValueStorage {
  const map = new Map(Object.entries(initial))
  return {
    getItem: (key) => (map.has(key) ? map.get(key)! : null),
    setItem: (key, value) => {
      map.set(key, String(value))
    },
    removeItem: (key) => {
      map.delete(key)
    },
    keys: () => [...map.keys()],
  }
}

/** Wrap Web Storage; null when it does not exist or access throws (SSR, blocked site data). */
export function wrapWebStorage(store: Storage | undefined | null): KeyValueStorage | null {
  if (!store) return null
  try {
    store.getItem('__pyarcana_probe__')
  } catch {
    return null
  }
  return {
    getItem: (key) => store.getItem(key),
    setItem: (key, value) => store.setItem(key, value),
    removeItem: (key) => store.removeItem(key),
    keys: () => Array.from({ length: store.length }, (_, i) => store.key(i)).filter((k): k is string => k !== null),
  }
}

export function safeStorage(): KeyValueStorage | null {
  if (typeof window === 'undefined') return null
  try {
    return wrapWebStorage(window.localStorage)
  } catch {
    return null
  }
}

export function safeSessionStorage(): KeyValueStorage | null {
  if (typeof window === 'undefined') return null
  try {
    return wrapWebStorage(window.sessionStorage)
  } catch {
    return null
  }
}

export function readRaw(storage: KeyValueStorage | null, key: string): string | null {
  if (!storage) return null
  try {
    return storage.getItem(key)
  } catch {
    return null
  }
}

export function readJson(storage: KeyValueStorage | null, key: string): unknown {
  const raw = readRaw(storage, key)
  if (raw === null) return null
  try {
    return JSON.parse(raw) as unknown
  } catch {
    return null
  }
}

/** Write a string; false when storage is missing or refuses (quota, blocked). */
export function writeRaw(storage: KeyValueStorage | null, key: string, value: string): boolean {
  if (!storage) return false
  try {
    storage.setItem(key, value)
    return true
  } catch {
    return false
  }
}

export function writeJson(storage: KeyValueStorage | null, key: string, value: unknown): boolean {
  return writeRaw(storage, key, JSON.stringify(value))
}

export function removeKey(storage: KeyValueStorage | null, key: string): void {
  if (!storage) return
  try {
    storage.removeItem(key)
  } catch {
    // Nothing to do: a key we cannot remove is a key we cannot read either.
  }
}

export function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v)
}
