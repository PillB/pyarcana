'use client'

import { CodeBlock } from './CodeBlock'
import { Callout } from './Callout'
import type { TheoryBlock as TheoryBlockType, Callout as CalloutType, CodeExample } from '@/lib/types'

interface RichTextProps {
  content: string
}

/**
 * Renderiza texto enriquecido simple. Soporta:
 * - Párrafos separados por doble newlines
 * - Listas con - o *
 * - Bloques de código fenced ```lang ... ```
 * - Inline code `code`
 * - **bold** y *italic*
 */
export function RichText({ content }: RichTextProps) {
  const blocks = parseBlocks(content)
  return (
    <div className="space-y-4 text-[15px] leading-relaxed text-foreground/90">
      {blocks.map((block, i) => {
        if (block.type === 'code') {
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
              <div dangerouslySetInnerHTML={{ __html: renderInline(block.content) }} />
            </Callout>
          )
        }
        if (block.type === 'list') {
          return (
            <ul key={i} className="space-y-2 pl-1">
              {block.items.map((item, j) => (
                <li key={j} className="flex gap-2.5">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
                  <span
                    className="flex-1 [&_code]:rounded [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-[13px] [&_code]:font-mono"
                    dangerouslySetInnerHTML={{ __html: renderInline(item) }}
                  />
                </li>
              ))}
            </ul>
          )
        }
        if (block.type === 'olist') {
          return (
            <ol key={i} className="space-y-2 pl-1">
              {block.items.map((item, j) => (
                <li key={j} className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                    {j + 1}
                  </span>
                  <span
                    className="flex-1 pt-0.5 [&_code]:rounded [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-[13px] [&_code]:font-mono"
                    dangerouslySetInnerHTML={{ __html: renderInline(item) }}
                  />
                </li>
              ))}
            </ol>
          )
        }
        // paragraph
        return (
          <p
            key={i}
            className="[&_code]:rounded [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-[13px] [&_code]:font-mono"
            dangerouslySetInnerHTML={{ __html: renderInline(block.content) }}
          />
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

// === Sub-componentes para teoría estructurada ===

export function TheoryBlockView({ block }: { block: TheoryBlockType }) {
  return (
    <section className="space-y-3">
      <h3 className="text-lg font-semibold tracking-tight text-foreground">{block.heading}</h3>
      {block.paragraphs.map((p, i) => (
        <RichText key={i} content={p} />
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
