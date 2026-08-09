import assert from 'node:assert/strict'
import test from 'node:test'

import { highlightCode, highlightPython } from '../../src/lib/code-highlighting'
import { COURSE_SECTIONS } from '../../src/lib/course'

function highlightedText(html: string): string {
  return html
    .replace(/<\/?span(?:\s[^>]*)?>/g, '')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
}

type CodeSurface = { code: string; language: string; path: string }

function collectCodeSurfaces(value: unknown, path = 'course'): CodeSurface[] {
  if (Array.isArray(value)) {
    return value.flatMap((entry, index) => collectCodeSurfaces(entry, `${path}[${index}]`))
  }
  if (!value || typeof value !== 'object') return []

  const record = value as Record<string, unknown>
  const surfaces: CodeSurface[] = []
  if (typeof record.code === 'string') {
    surfaces.push({
      code: record.code,
      language: typeof record.language === 'string' ? record.language : 'python',
      path: `${path}.code`,
    })
  }
  if (typeof record.starterCode === 'string') {
    surfaces.push({ code: record.starterCode, language: 'python', path: `${path}.starterCode` })
  }

  for (const [key, child] of Object.entries(record)) {
    if (key === 'code' && typeof child === 'string') continue
    if (key === 'starterCode' && typeof child === 'string') continue
    surfaces.push(...collectCodeSurfaces(child, `${path}.${key}`))
  }
  return surfaces
}

test('reported check_arg.py code survives syntax highlighting byte-for-byte as visible text', () => {
  const source = `import sys

def main() -> None:
    # sys.argv[0] = script; usuario desde [1]
    if len(sys.argv) != 2:
        print("uso: python check_arg.py <arg>", file=sys.stderr)
        sys.exit(1)
    print("OK:" + sys.argv[1])
    print("executable:", sys.executable)
    sys.exit(0)

if __name__ == "__main__":
    main()`

  const html = highlightPython(source)
  assert.equal(highlightedText(html), source)
  assert.match(html, />import<\/span> sys/)
  assert.match(html, /># sys\.argv\[0\].*\[1\]<\/span>/)
  assert.match(html, /check_arg\.py &lt;arg&gt;/)
  assert.doesNotMatch(highlightedText(html), /^4 sys/m)
})

test('strings containing # and numbers remain strings rather than nested/corrupted tokens', () => {
  const source = `print("color #123 and 42")  # comentario 7\nvalor = 3.14e-2`
  const html = highlightPython(source)
  assert.equal(highlightedText(html), source)
  assert.match(html, /code-tok-string[^>]*>"color #123 and 42"/)
  assert.match(html, /code-tok-comment[^>]*># comentario 7/)
})

test('all S01-S52 curriculum code objects preserve their complete visible source', () => {
  const surfaces = collectCodeSurfaces(COURSE_SECTIONS)
  assert.ok(surfaces.length >= 3000, `expected at least 3000 code surfaces, found ${surfaces.length}`)

  for (const surface of surfaces) {
    const source = surface.code.trim()
    assert.equal(
      highlightedText(highlightCode(source, surface.language)),
      source,
      `rendering changed ${surface.path} (${surface.language})`,
    )
  }
})
