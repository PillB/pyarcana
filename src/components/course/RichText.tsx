'use client'

import { useMemo } from 'react'
import { CodeBlock } from './CodeBlock'
import { Callout } from './Callout'
import { CodePlayground } from './CodePlayground'
import { InlineAnnotated } from './InlineAnnotated'
import type { TheoryBlock as TheoryBlockType, Callout as CalloutType, CodeExample } from '@/lib/types'
import { termsAvailableAt, type GlossaryTerm } from '@/lib/glossary'

interface RichTextProps {
  content: string
  /** When set, only terms introduced in this or prior sections get hover hints */
  sectionId?: string
}

/**
 * Renderiza texto enriquecido simple. Soporta:
 * - Párrafos / listas / code fences / bold / italic
 * - Auto-anotación de jerga del glosario (hover/focus definition)
 */
export function RichText({ content, sectionId }: RichTextProps) {
  const blocks = parseBlocks(content)
  const available = useMemo(() => termsAvailableAt(sectionId), [sectionId])
  const seen = useMemo(() => new Set<string>(), [content, sectionId])
  const annotate = (text: string) =>
    annotateGlossaryTerms(renderInline(text), available, seen)

  return (
    <div className="space-y-4 text-[15px] leading-relaxed text-foreground/90">
      {blocks.map((block, i) => {
        if (block.type === 'code') {
          const isRunnable =
            block.lang === 'python-runnable' ||
            block.lang === 'python-interactive' ||
            (block.lang === 'python' && block.title?.toLowerCase().includes('runnable'))
          if (isRunnable) {
            return (
              <CodePlayground
                key={i}
                initialCode={block.content}
                title={block.title || 'Editor interactivo'}
                expectedOutput={block.output}
              />
            )
          }
          return (
            <CodeBlock
              key={i}
              code={block.content}
              language={block.lang || 'python'}
              title={block.title}
              output={block.output}
            />
          )
        }
        if (block.type === 'callout') {
          return (
            <Callout key={i} type={block.calloutType} title={block.title}>
              <InlineAnnotated html={annotate(block.content)} />
            </Callout>
          )
        }
        if (block.type === 'list') {
          return (
            <ul key={i} className="space-y-2 pl-1">
              {block.items!.map((item, j) => (
                <li key={j} className="flex gap-2.5">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
                  <span className="flex-1 [&_code]:rounded [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-[13px] [&_code]:font-mono">
                    <InlineAnnotated html={annotate(item)} />
                  </span>
                </li>
              ))}
            </ul>
          )
        }
        if (block.type === 'olist') {
          return (
            <ol key={i} className="space-y-2 pl-1">
              {block.items!.map((item, j) => (
                <li key={j} className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                    {j + 1}
                  </span>
                  <span className="flex-1 pt-0.5 [&_code]:rounded [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-[13px] [&_code]:font-mono">
                    <InlineAnnotated html={annotate(item)} />
                  </span>
                </li>
              ))}
            </ol>
          )
        }
        return (
          <p
            key={i}
            className="[&_code]:rounded [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-[13px] [&_code]:font-mono"
          >
            <InlineAnnotated html={annotate(block.content)} />
          </p>
        )
      })}
    </div>
  )
}

interface Block {
  type: 'paragraph' | 'code' | 'list' | 'olist' | 'callout'
  content: string
  lang?: string
  title?: string
  output?: string
  items?: string[]
  calloutType?: CalloutType['type']
  calloutTitle?: string
}

function parseBlocks(text: string): Block[] {
  const lines = text.split('\n')
  const blocks: Block[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    // Callout block :::: type | title \n content \n ::::
    if (line.startsWith('::::')) {
      const meta = line.slice(4).trim()
      const [type, title] = meta.split('|').map((s) => s.trim())
      const contentLines: string[] = []
      i++
      while (i < lines.length && !lines[i].startsWith('::::')) {
        contentLines.push(lines[i])
        i++
      }
      i++ // skip closing
      blocks.push({
        type: 'callout',
        content: contentLines.join('\n').trim(),
        calloutType: (type as CalloutType['type']) || 'info',
        calloutTitle: title || undefined,
      })
      continue
    }

    // Code fence
    if (line.trim().startsWith('```')) {
      const match = line.trim().match(/^```(\w+)?(?:\s+title=(.+))?/)
      const lang = match?.[1] || 'python'
      const title = match?.[2]
      const codeLines: string[] = []
      i++
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i])
        i++
      }
      i++ // skip closing
      // Check if next non-empty line starts with "Output:" for output block
      let output: string | undefined
      if (i < lines.length && lines[i].trim().toLowerCase().startsWith('output:')) {
        const outputLines: string[] = []
        const firstLine = lines[i].replace(/^output:\s*/i, '')
        if (firstLine) outputLines.push(firstLine)
        i++
        while (i < lines.length && lines[i].trim() !== '' && !lines[i].trim().startsWith('```') && !lines[i].startsWith('::::')) {
          outputLines.push(lines[i])
          i++
        }
        output = outputLines.join('\n')
      }
      blocks.push({
        type: 'code',
        content: codeLines.join('\n'),
        lang,
        title,
        output,
      })
      continue
    }

    // Empty line
    if (line.trim() === '') {
      i++
      continue
    }

    // Ordered list
    if (/^\d+\.\s/.test(line.trim())) {
      const items: string[] = []
      while (i < lines.length && /^\d+\.\s/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+\.\s+/, ''))
        i++
      }
      blocks.push({ type: 'olist', content: '', items })
      continue
    }

    // Unordered list
    if (/^[-*]\s/.test(line.trim())) {
      const items: string[] = []
      while (i < lines.length && /^[-*]\s/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^[-*]\s+/, ''))
        i++
      }
      blocks.push({ type: 'list', content: '', items })
      continue
    }

    // Paragraph (collect until empty line)
    const paraLines: string[] = [line]
    i++
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !lines[i].trim().startsWith('```') &&
      !lines[i].startsWith('::::') &&
      !/^\d+\.\s/.test(lines[i].trim()) &&
      !/^[-*]\s/.test(lines[i].trim())
    ) {
      paraLines.push(lines[i])
      i++
    }
    blocks.push({ type: 'paragraph', content: paraLines.join('\n') })
  }

  return blocks
}

function renderInline(text: string): string {
  let out = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
  // inline code
  out = out.replace(/`([^`]+)`/g, '<code>$1</code>')
  // bold
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  // italic
  out = out.replace(/\*([^*]+)\*/g, '<em>$1</em>')
  // links [text](url)
  out = out.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary underline decoration-primary/40 hover:decoration-primary">$1</a>'
  )
  return out
}

/**
 * Mark first occurrence of each glossary alias (outside HTML tags / code).
 * Uses placeholders consumable by InlineAnnotated → TermHint.
 */
function annotateGlossaryTerms(
  html: string,
  terms: GlossaryTerm[],
  seen: Set<string>
): string {
  if (!terms.length) return html
  // Protect tags and code spans
  const protectedParts: string[] = []
  const withHoles = html.replace(/<[^>]+>|&[a-z]+;/gi, (m) => {
    const i = protectedParts.length
    protectedParts.push(m)
    return `\u0000${i}\u0000`
  })

  let text = withHoles
  const sorted = [...terms].sort((a, b) => {
    const al = Math.max(...a.aliases.map((x) => x.length))
    const bl = Math.max(...b.aliases.map((x) => x.length))
    return bl - al
  })

  for (const term of sorted) {
    if (seen.has(term.id)) continue
    for (const alias of [...term.aliases].sort((a, b) => b.length - a.length)) {
      if (alias.length < 3) continue
      const escaped = alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      const re = new RegExp(`(?<![\\w/-])(${escaped})(?![\\w/-])`, 'i')
      if (!re.test(text)) continue
      text = text.replace(re, (match) => {
        seen.add(term.id)
        return `⟦TERM:${term.id}⟧${match}⟦/TERM⟧`
      })
      break
    }
  }

  return text.replace(/\u0000(\d+)\u0000/g, (_, i) => protectedParts[Number(i)])
}

// === Sub-componentes para teoría estructurada ===

export function TheoryBlockView({
  block,
  sectionId,
}: {
  block: TheoryBlockType
  sectionId?: string
}) {
  return (
    <section className="space-y-3">
      <h3 className="text-lg font-semibold tracking-tight text-foreground">{block.heading}</h3>
      {block.paragraphs.map((p, i) => (
        <RichText key={i} content={p} sectionId={sectionId} />
      ))}
      {block.code && (
        <CodeBlock
          code={block.code.code}
          language={block.code.language}
          title={block.code.title}
          output={block.code.output}
        />
      )}
      {block.code?.explanation && (
        <p className="text-sm text-muted-foreground italic">{block.code.explanation}</p>
      )}
      {block.callout && (
        <Callout type={block.callout.type} title={block.callout.title}>
          {block.callout.content}
        </Callout>
      )}
    </section>
  )
}
