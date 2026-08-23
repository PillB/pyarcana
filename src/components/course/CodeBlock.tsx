'use client'

import { Fragment, useState } from 'react'
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
  /**
   * Progressive reveal, used by the I Do tab. Purely visual: every line stays
   * in the DOM with its full text, so the code-fidelity gate still sees a
   * byte-identical block and the copy button still copies everything.
   */
  reveal?: {
    /** Lines at or before this index are shown; later ones are hidden, not removed. */
    visibleLines: number
    /** Sweep the newest line in. Callers pass false when motion is reduced. */
    animate: boolean
    /** Output is blurred rather than withheld, so screen readers keep it. */
    outputVisible: boolean
  }
}

export function CodeBlock({
  code,
  language = 'python',
  title,
  output,
  showLineNumbers = false,
  className,
  reveal,
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
  const lines = normalizedCode.split('\n')

  /**
   * Reveal state is read as scalars, not as the object.
   *
   * Highlighting is regex work, and the reveal branch re-renders on every step.
   * Left inline it made the I Do tab take ~5s to open — slower than We Do while
   * carrying a third of the DOM — because eight demos re-highlighted every line
   * on every pass.
   *
   * The fix is to let the React Compiler memoise it, not to hand-roll useMemo:
   * a manual memo keyed on the `reveal` object makes the compiler bail out of
   * optimising this component altogether ("existing memoization could not be
   * preserved"), which is worse than none. Scalars give it what it needs.
   */
  const isRevealing = !!reveal
  const revealVisibleLines = reveal ? reveal.visibleLines : lines.length
  const revealAnimate = reveal ? reveal.animate : false
  const revealOutputVisible = reveal ? reveal.outputVisible : true

  const highlighted = isRevealing ? '' : highlightCode(normalizedCode, language)
  const highlightedLines = isRevealing ? lines.map((line) => highlightCode(line, language)) : []

  return (
    <div
      className={cn('group relative my-4 overflow-hidden rounded-xl border border-border/60 shadow-card', className)}
      data-testid="code-block"
      data-code-language={language}
    >
      <div className="flex items-center justify-between border-b border-border/60 bg-muted/40 px-4 py-2">
        {/* min-w-0 + truncate: a long title must shrink instead of pushing the
            copy button past the right edge of a narrow viewport. */}
        <div className="flex min-w-0 items-center gap-2 text-xs font-medium text-muted-foreground">
          {isShell ? (
            <Terminal className="h-3.5 w-3.5 shrink-0" />
          ) : (
            <span className="h-2 w-2 shrink-0 rounded-full bg-primary/60" />
          )}
          <span className="truncate uppercase tracking-wide">{title || language}</span>
        </div>
        <button
          onClick={copy}
          className="flex shrink-0 items-center gap-1.5 rounded-md px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
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
          {isRevealing ? (
            /*
             * Reveal keeps the code byte-identical. Each line is its own span
             * so it can be masked, and the newlines between them are real text
             * nodes, so the concatenated textContent equals the source exactly
             * — which is what scripts/code_rendering.spec.ts checks.
             *
             * Note this deliberately does NOT use the line-number branch below:
             * that one puts the numbers inside <code>, so its textContent has
             * never matched its own data-code-source. Numbers here would break
             * the very gate this reveal is designed to satisfy.
             */
            <code data-code-source={normalizedCode}>
              {lines.map((line, i) => {
                const hidden = i >= revealVisibleLines
                const arriving = revealAnimate && i === revealVisibleLines - 1
                return (
                  <Fragment key={i}>
                    <span
                      className={cn('inline-block w-full', arriving && 'code-line-sweep')}
                      // `visibility` keeps the text and its height, so the block
                      // never reflows as lines arrive.
                      style={hidden ? { visibility: 'hidden' } : undefined}
                      dangerouslySetInnerHTML={{ __html: highlightedLines[i] }}
                    />
                    {i < lines.length - 1 ? '\n' : ''}
                  </Fragment>
                )
              })}
            </code>
          ) : showLineNumbers ? (
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
        <div className="relative border-t border-border/60 bg-muted/20">
          <div className="px-4 py-1.5 text-xs font-medium text-muted-foreground">
            Output
          </div>
          <pre
            className="code-block code-block-dark overflow-x-auto p-4 pt-0"
            style={
              isRevealing && !revealOutputVisible
                ? { filter: 'blur(6px)', userSelect: 'none' }
                : undefined
            }
          >
            <code className="text-[var(--code-fg)] opacity-90" data-output-source={output.trim()}>
              {output.trim()}
            </code>
          </pre>
          {isRevealing && !revealOutputVisible && (
            <div className="pointer-events-none absolute inset-0 flex items-end justify-center pb-3 text-[13px] text-muted-foreground">
              Predice la salida antes de revelarla
            </div>
          )}
        </div>
      )}
    </div>
  )
}
