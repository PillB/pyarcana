type TokenKind = 'comment' | 'string' | 'keyword' | 'builtin' | 'number' | 'decorator'

const TOKEN_CLASS: Record<TokenKind, string> = {
  comment: 'code-tok-comment',
  string: 'code-tok-string',
  keyword: 'code-tok-keyword',
  builtin: 'code-tok-builtin',
  number: 'code-tok-number',
  decorator: 'code-tok-decorator',
}

const PYTHON_TOKEN = /((?:[rRuUbBfF]{0,3})(?:"""[\s\S]*?"""|'''[\s\S]*?'''|"(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'))|(#[^\n]*)|(@[A-Za-z_]\w*(?:\.[A-Za-z_]\w*)*)|(\b(?:def|class|return|if|elif|else|for|while|in|not|and|or|is|None|True|False|import|from|as|with|try|except|finally|raise|pass|break|continue|lambda|yield|global|nonlocal|assert|del|async|await|self|cls)\b)|(\b(?:print|len|range|enumerate|zip|map|filter|sorted|sum|min|max|abs|round|type|isinstance|input|open|str|int|float|bool|list|dict|tuple|set|frozenset|bytes|format|super|property|staticmethod|classmethod)\b)|(\b\d+(?:\.\d*)?(?:[eE][+-]?\d+)?\b)/g
const PYTHON_KINDS: TokenKind[] = ['string', 'comment', 'decorator', 'keyword', 'builtin', 'number']

const BASH_TOKEN = /("(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*')|(#[^\n]*)|(\b(?:python|python3|pip|pip3|git|cd|ls|mkdir|touch|cp|mv|rm|echo|source|activate|deactivate|brew|apt|conda|uv|ruff|pytest|jupyter|code)\b)|((?:^|[ \t])--?[\w-]+)/g
const BASH_KINDS: TokenKind[] = ['string', 'comment', 'keyword', 'number']

export function escapeCodeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function highlightWithPattern(code: string, pattern: RegExp, kinds: TokenKind[]): string {
  pattern.lastIndex = 0
  let cursor = 0
  let html = ''

  for (const match of code.matchAll(pattern)) {
    const index = match.index ?? cursor
    html += escapeCodeHtml(code.slice(cursor, index))

    const groupIndex = match.slice(1).findIndex((group) => group !== undefined)
    const kind = kinds[groupIndex]
    const token = escapeCodeHtml(match[0])
    html += kind ? `<span class="${TOKEN_CLASS[kind]}">${token}</span>` : token
    cursor = index + match[0].length
  }

  return html + escapeCodeHtml(code.slice(cursor))
}

export function highlightPython(code: string): string {
  return highlightWithPattern(code, PYTHON_TOKEN, PYTHON_KINDS)
}

export function highlightBash(code: string): string {
  return highlightWithPattern(code, BASH_TOKEN, BASH_KINDS)
}

export function highlightCode(code: string, language = 'python'): string {
  if (language === 'bash' || language === 'sh' || language === 'shell') {
    return highlightBash(code)
  }
  if (language === 'text' || language === 'plaintext') {
    return escapeCodeHtml(code)
  }
  return highlightPython(code)
}
