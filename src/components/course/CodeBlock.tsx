'use client'

import { useState } from 'react'
import { Check, Copy, Terminal } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CodeBlockProps {
  code: string
  language?: string
  title?: string
  output?: string
  showLineNumbers?: boolean
  className?: string
}

// Resaltado ligero sin dependencias pesadas — funciona bien para snippets cortos
function highlightPython(code: string): string {
  const keywords = /\b(def|class|return|if|elif|else|for|while|in|not|and|or|is|None|True|False|import|from|as|with|try|except|finally|raise|pass|break|continue|lambda|yield|global|nonlocal|assert|del|async|await|self|cls)\b/g
  const builtins = /\b(print|len|range|enumerate|zip|map|filter|sorted|sum|min|max|abs|round|type|isinstance|input|open|str|int|float|bool|list|dict|tuple|set|frozenset|bytes|format|super|property|staticmethod|classmethod)\b/g
  const decorators = /@[\w.]+/g
  const strings = /(?:f|rf|fr)?("""[\s\S]*?"""|'''[\s\S]*?'''|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/g
  const comments = /(#[^\n]*)/g
  const numbers = /\b(\d+\.?\d*([eE][+-]?\d+)?)\b/g

  // Escapar HTML primero
  let out = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  // Marcar con tokens únicos
  const tokens: string[] = []
  const placeholder = (html: string) => {
    tokens.push(html)
    return `\x00${tokens.length - 1}\x00`
  }

  // Comentarios primero (pueden contener # en strings)
  out = out.replace(comments, (m) =>
    placeholder(`<span class="code-tok-comment">${m}</span>`)
  )
  // Strings
  out = out.replace(strings, (m) =>
    placeholder(`<span class="code-tok-string">${m}</span>`)
  )
  // Decoradores
  out = out.replace(decorators, (m) =>
    placeholder(`<span class="code-tok-decorator">${m}</span>`)
  )
  // Keywords
  out = out.replace(keywords, (m) =>
    placeholder(`<span class="code-tok-keyword">${m}</span>`)
  )
  // Builtins
  out = out.replace(builtins, (m) =>
    placeholder(`<span class="code-tok-builtin">${m}</span>`)
  )
  // Números
  out = out.replace(numbers, (m) =>
    placeholder(`<span class="code-tok-number">${m}</span>`)
  )

  // Restaurar tokens
  out = out.replace(/\x00(\d+)\x00/g, (_, i) => tokens[Number(i)])
  return out
}

function highlightBash(code: string): string {
  let out = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
  const commands = /\b(python|python3|pip|pip3|git|cd|ls|mkdir|touch|cp|mv|rm|echo|source|activate|deactivate|brew|apt|conda|uv|ruff|pytest|jupyter|code)\b/g
  const flags = /(^|\s)(--?[\w-]+)/g
  const comments = /(#[^\n]*)/g
  const strings = /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/g

  const tokens: string[] = []
  const placeholder = (html: string) => {
    tokens.push(html)
    return `\x00${tokens.length - 1}\x00`
  }
  out = out.replace(comments, (m) =>
    placeholder(`<span class="code-tok-comment">${m}</span>`)
  )
  out = out.replace(strings, (m) =>
    placeholder(`<span class="code-tok-string">${m}</span>`)
  )
  out = out.replace(commands, (m) =>
    placeholder(`<span class="code-tok-keyword">${m}</span>`)
  )
  out = out.replace(flags, (_, pre, f) =>
    placeholder(`${pre}<span class="code-tok-number">${f}</span>`)
  )
  out = out.replace(/\x00(\d+)\x00/g, (_, i) => tokens[Number(i)])
  return out
}

export function CodeBlock({
  code,
  language = 'python',
  title,
  output,
  showLineNumbers = false,
  className,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // ignore
    }
  }

  const isShell = language === 'bash' || language === 'sh' || language === 'shell'
  const isPlain = language === 'text' || language === 'plaintext'

  const highlighted = isShell
    ? highlightBash(code.trim())
    : isPlain
      ? code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      : highlightPython(code.trim())

  const lines = code.trim().split('\n')

  return (
    <div className={cn('group relative my-4 overflow-hidden rounded-xl border border-border/60 shadow-card', className)}>
      <div className="flex items-center justify-between border-b border-border/60 bg-muted/40 px-4 py-2">
        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
          {isShell ? (
            <Terminal className="h-3.5 w-3.5" />
          ) : (
            <span className="h-2 w-2 rounded-full bg-primary/60" />
          )}
          <span className="uppercase tracking-wide">{title || language}</span>
        </div>
        <button
          onClick={copy}
          className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          aria-label="Copiar código"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-green-600" />
              <span className="text-green-600">Copiado</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Copiar</span>
            </>
          )}
        </button>
      </div>
      <div className="code-block code-block-dark overflow-x-auto scroll-area-thin">
        <pre className="p-4">
          {showLineNumbers ? (
            <code>
              {lines.map((line, i) => (
                <div key={i} className="flex">
                  <span className="code-tok-line-num mr-4 inline-block w-8 select-none text-right">
                    {i + 1}
                  </span>
                  <span
                    className="flex-1"
                    dangerouslySetInnerHTML={{
                      __html: highlightPython(line) || '&nbsp;',
                    }}
                  />
                </div>
              ))}
            </code>
          ) : (
            <code dangerouslySetInnerHTML={{ __html: highlighted }} />
          )}
        </pre>
      </div>
      {output && (
        <div className="border-t border-border/60 bg-muted/20">
          <div className="px-4 py-1.5 text-xs font-medium text-muted-foreground">
            Output
          </div>
          <pre className="code-block code-block-dark overflow-x-auto p-4 pt-0">
            <code className="text-[var(--code-fg)] opacity-90">{output.trim()}</code>
          </pre>
        </div>
      )}
    </div>
  )
}
