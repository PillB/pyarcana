'use client'

import { useState } from 'react'
import { Check, Copy, Terminal } from 'lucide-react'
import { cn } from '@/lib/utils'
import { highlightCode } from '@/lib/code-highlighting'

interface CodeBlockProps {
  code: string
  language?: string
  title?: string
  output?: string
  showLineNumbers?: boolean
  className?: string
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

  const normalizedCode = code.trim()
  const highlighted = highlightCode(normalizedCode, language)
  const lines = normalizedCode.split('\n')

  return (
    <div
      className={cn('group relative my-4 overflow-hidden rounded-xl border border-border/60 shadow-card', className)}
      data-testid="code-block"
      data-code-language={language}
    >
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
            <code data-code-source={normalizedCode}>
              {lines.map((line, i) => (
                <div key={i} className="flex">
                  <span className="code-tok-line-num mr-4 inline-block w-8 select-none text-right">
                    {i + 1}
                  </span>
                  <span
                    className="flex-1"
                    dangerouslySetInnerHTML={{
                      __html: highlightCode(line, language) || '&nbsp;',
                    }}
                  />
                </div>
              ))}
            </code>
          ) : (
            <code
              data-code-source={normalizedCode}
              dangerouslySetInnerHTML={{ __html: highlighted }}
            />
          )}
        </pre>
      </div>
      {output && (
        <div className="border-t border-border/60 bg-muted/20">
          <div className="px-4 py-1.5 text-xs font-medium text-muted-foreground">
            Output
          </div>
          <pre className="code-block code-block-dark overflow-x-auto p-4 pt-0">
            <code className="text-[var(--code-fg)] opacity-90" data-output-source={output.trim()}>
              {output.trim()}
            </code>
          </pre>
        </div>
      )}
    </div>
  )
}
