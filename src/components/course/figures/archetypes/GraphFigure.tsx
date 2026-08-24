'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ReactFlow, Background, Handle, Position, type Edge, type Node, type NodeProps } from '@xyflow/react'
import '@xyflow/react/dist/base.css'
import { useTheme } from 'next-themes'
import { tintOf, type GraphData } from './types'

/**
 * Entities and the edges between them, laid out for the column it lands in.
 *
 * Every hard lesson from S31 lives here once so that ~30 graph figures inherit
 * it instead of each rediscovering it:
 *
 *   - fitView runs at mount and never again, so a rotation or a resize leaves
 *     nodes painted outside the pane. A ResizeObserver re-fits.
 *   - fitView alone is not the answer on a phone: squeezing a 530px graph into
 *     a 192px column scales the viewport to ~0.36 and paints 14px type at 5px.
 *     Below 420px the graph re-lays out into a narrow two-column stack with
 *     smaller node boxes instead of shrinking.
 *   - edge labels collide with nodes in that stacked layout, measured, not
 *     guessed. They are dropped there; the legend below carries the same
 *     information in full sentences.
 */

type NodeData = { label: string; sub?: string; tint: number; narrow: boolean }

function GraphNodeBox({ data, selected }: NodeProps) {
  const d = data as unknown as NodeData
  const tint = tintOf(d.tint)
  return (
    <div
      className="rounded-md border px-2 py-2 text-center"
      style={{
        borderColor: selected ? tint : 'var(--border)',
        background: 'var(--card)',
        borderWidth: selected ? 2 : 1,
        minWidth: d.narrow ? 96 : 118,
      }}
    >
      <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />
      <div className="text-[14px] font-semibold" style={{ color: tint }}>
        {d.label}
      </div>
      {d.sub ? <div className="text-[14px] text-muted-foreground">{d.sub}</div> : null}
      <Handle type="source" position={Position.Right} style={{ opacity: 0 }} />
    </div>
  )
}

const NODE_TYPES = { box: GraphNodeBox }

export function GraphFigure({ title, data }: { title: string; data: GraphData }) {
  const { resolvedTheme } = useTheme()
  const paneRef = useRef<HTMLDivElement | null>(null)
  const [paneWidth, setPaneWidth] = useState(0)
  const flowRef = useRef<{ fitView: (o?: { padding?: number }) => void } | null>(null)

  useEffect(() => {
    const el = paneRef.current
    if (!el || typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(([entry]) => {
      setPaneWidth(Math.round(entry.contentRect.width))
      flowRef.current?.fitView({ padding: 0.12 })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const narrow = paneWidth > 0 && paneWidth < 420
  const dense = data.nodes.length > 4 || data.edges.length > 4

  const nodes: Node[] = useMemo(() => {
    const colW = narrow ? 82 : 268
    const rowH = narrow ? 136 : 124
    return data.nodes.map((n, i) => ({
      id: n.id,
      type: 'box',
      // In the stacked layout columns are halved and rows lengthened, which
      // keeps the graph's own width near 174px -- the width that measured
      // above the 11px floor at a 320px viewport.
      // Authored col/row describe the wide layout. Reusing them narrow by
      // folding columns modulo 2 collapsed distinct nodes onto identical
      // coordinates -- the stress figure produced six overlapping pairs. The
      // stacked layout therefore ignores them and lays the nodes out by their
      // position in the array, which is unique by construction.
      position: narrow
        // Staggering by rowH/2 put boxes 52px apart while a two-line node is
        // 54px tall, so consecutive nodes overlapped by 2px at 390 and 320.
        // The offset is now a fixed clearance above the tallest node box.
        ? { x: (i % 2) * colW, y: Math.floor(i / 2) * rowH + (i % 2) * 64 }
        : { x: n.col * colW, y: n.row * rowH },
      data: { label: n.label, sub: n.sub, tint: n.tint, narrow },
      width: narrow ? 96 : 118,
      height: n.sub ? 54 : 38,
    }))
  }, [data.nodes, narrow])

  const edges: Edge[] = useMemo(
    () =>
      data.edges.map((e) => ({
        id: `${e.from}-${e.to}`,
        source: e.from,
        target: e.to,
        // Dropped whenever the graph is dense: measured collisions between
        // edge captions and node boxes on S13 and S49 at desktop width. The
        // legend under the figure names every edge in full sentences, so the
        // information is not lost, only the crowded placement.
        label: narrow || dense ? undefined : e.label,
        style: {
          stroke: e.derived ? 'var(--border)' : 'var(--chart-2)',
          strokeWidth: e.derived ? 1.5 : 2,
          strokeDasharray: e.derived ? '5 4' : undefined,
        },
        labelStyle: { fill: 'var(--muted-foreground)', fontSize: 14 },
        labelBgStyle: { fill: 'var(--card)' },
      })),
    [data.edges, narrow, dense],
  )

  const rows = Math.max(...data.nodes.map((n) => n.row)) + 1
  const stackedRows = Math.ceil(data.nodes.length / 2) + 1
  const height = narrow ? Math.max(320, stackedRows * 104) : Math.max(240, rows * 92)

  const onInit = useCallback((instance: { fitView: (o?: { padding?: number }) => void }) => {
    flowRef.current = instance
    instance.fitView({ padding: 0.12 })
  }, [])

  return (
    <div>
      <p className="mb-2 text-[15px] font-semibold">{data.headline}</p>
      <div
        ref={paneRef}
        style={{ height }}
        className="rounded-md border border-border bg-muted/30"
        role="img"
        aria-label={title}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={NODE_TYPES}
          colorMode={resolvedTheme === 'dark' ? 'dark' : 'light'}
          fitView
          fitViewOptions={{ padding: 0.12 }}
          onInit={onInit}
          proOptions={{ hideAttribution: false }}
          nodesDraggable={false}
          nodesConnectable={false}
          zoomOnScroll={false}
          panOnScroll={false}
          preventScrolling={false}
        >
          <Background gap={18} size={1} color="var(--border)" />
        </ReactFlow>
      </div>

      {/* Carries the edge meanings the stacked layout drops, and gives the
          whole figure a text equivalent regardless of viewport. */}
      {data.edges.some((e) => e.label) ? (
        <ul className="mt-3 space-y-1 rounded-md border border-border bg-card p-3 text-[13px] text-muted-foreground">
          {data.edges
            .filter((e) => e.label)
            .map((e) => (
              <li key={`${e.from}-${e.to}`}>
                <span className="font-medium text-foreground">
                  {data.nodes.find((n) => n.id === e.from)?.label} → {data.nodes.find((n) => n.id === e.to)?.label}
                </span>{' '}
                — {e.label}
                {e.derived ? ' (derivado, no registrado)' : ''}
              </li>
            ))}
        </ul>
      ) : null}

      {data.note ? <p className="mt-2 text-[13px] text-muted-foreground">{data.note}</p> : null}
    </div>
  )
}
