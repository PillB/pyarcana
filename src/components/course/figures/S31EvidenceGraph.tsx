'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  ReactFlow,
  Background,
  Handle,
  Position,
  type Edge,
  type Node,
  type NodeProps,
} from '@xyflow/react'
import '@xyflow/react/dist/base.css'
import { useTheme } from 'next-themes'

/**
 * S31 — the entity graph, and why two "connections" are not the same claim.
 *
 * This is the one figure in the set where interaction is the pedagogy rather
 * than decoration. The section's whole point is that a path explains how two
 * entities are linked *in the data* and proves nothing about kinship or
 * collusion — and that a one-hop transfer and a three-hop shared office phone
 * look identical the moment you say only "están conectados".
 *
 * So the learner picks a target and reads the path back: how many hops, and
 * what evidence sits on each one. The disclaimer is not a footnote here; it is
 * the thing being taught.
 */

type EntityData = { label: string; sub: string; role: 'caso' | 'entidad' | 'lugar' }

/** Nodes are divs in React Flow, so the accessible story is built by hand. */
function EntityNode({ data, selected }: NodeProps) {
  const d = data as unknown as EntityData & { narrow?: boolean }
  const narrow = d.narrow === true
  const tint =
    d.role === 'caso' ? 'var(--chart-4)' : d.role === 'lugar' ? 'var(--chart-3)' : 'var(--chart-1)'
  return (
    <div
      className="rounded-md border px-3 py-2 text-center"
      style={{
        borderColor: selected ? tint : 'var(--border)',
        background: 'var(--card)',
        borderWidth: selected ? 2 : 1,
        minWidth: narrow ? 96 : 118,
      }}
    >
      <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />
      <div className="text-[14px] font-semibold" style={{ color: tint }}>
        {d.label}
      </div>
      <div className="text-[14px] text-muted-foreground">{d.sub}</div>
      <Handle type="source" position={Position.Right} style={{ opacity: 0 }} />
    </div>
  )
}

const NODE_TYPES = { entity: EntityNode }

/** Evidence lives on the edge, because that is where the claim lives. */
const EVIDENCE: Record<string, { label: string; strength: string }> = {
  'e1-e2': { label: 'transferencia directa 2024-03-11', strength: 'específica de estas dos entidades' },
  'e1-e3': { label: 'teléfono declarado en el alta', strength: 'compartida con toda la oficina' },
  'e3-e4': { label: 'mismo teléfono en el alta', strength: 'compartida con toda la oficina' },
}

/** Paths from the case entity, precomputed: this is a teaching fixture. */
const PATHS: Record<string, { hops: string[]; edges: string[] }> = {
  e2: { hops: ['Ana Q.', 'Luis M.'], edges: ['e1-e2'] },
  e3: { hops: ['Ana Q.', 'Oficina Lima'], edges: ['e1-e3'] },
  e4: { hops: ['Ana Q.', 'Oficina Lima', 'Marta R.'], edges: ['e1-e3', 'e3-e4'] },
}

export function S31EvidenceGraph({ title }: { title: string }) {
  const { resolvedTheme } = useTheme()
  const [target, setTarget] = useState<string>('e2')
  const paneRef = useRef<HTMLDivElement | null>(null)
  const [paneWidth, setPaneWidth] = useState(0)
  const flowRef = useRef<{ fitView: (o?: { padding?: number }) => void } | null>(null)

  // fitView runs once at mount. A rotated phone or a resized window leaves the
  // graph fitted to a width that no longer exists, which is how two of the four
  // nodes ended up painted outside the pane on mobile.
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

  // The four nodes spread 530px wide, which is wider than a phone column.
  // fitView alone is not the answer: fitting 530px into 192px scales the
  // viewport to ~0.36, and a 14px label then paints at 5px -- clipping traded
  // for illegibility. Below the breakpoint the graph stacks instead, keeping
  // type at full size and letting the pane grow taller.
  const narrow = paneWidth > 0 && paneWidth < 420

  const nodes: Node[] = useMemo(() => {
    const wide = {
      e1: { x: 8, y: 96 },
      e2: { x: 210, y: 16 },
      e3: { x: 210, y: 172 },
      e4: { x: 412, y: 172 },
    }
    // Kept deliberately narrow: the graph's own width sets the fit scale, and
    // the fit scale sets the rendered type size. At 260px wide the labels drop
    // to 9px inside a 320px column. At 174px they hold above the 11px floor.
    const stacked = {
      e1: { x: 0, y: 0 },
      e2: { x: 78, y: 88 },
      e3: { x: 0, y: 176 },
      e4: { x: 78, y: 264 },
    }
    const at = narrow ? stacked : wide
    return [
      { id: 'e1', type: 'entity', position: at.e1, data: { label: 'Ana Q.', sub: 'caso abierto', role: 'caso', narrow }, width: 118, height: 54 },
      { id: 'e2', type: 'entity', position: at.e2, data: { label: 'Luis M.', sub: 'entidad', role: 'entidad', narrow }, width: narrow ? 96 : 118, height: 54, selected: target === 'e2' },
      { id: 'e3', type: 'entity', position: at.e3, data: { label: 'Oficina Lima', sub: 'lugar', role: 'lugar', narrow }, width: narrow ? 96 : 118, height: 54, selected: target === 'e3' },
      { id: 'e4', type: 'entity', position: at.e4, data: { label: 'Marta R.', sub: 'entidad', role: 'entidad', narrow }, width: narrow ? 96 : 118, height: 54, selected: target === 'e4' },
    ]
  }, [target, narrow])

  const active = PATHS[target].edges
  const edges: Edge[] = useMemo(
    () =>
      (
        [
          ['e1-e2', 'e1', 'e2', 'transferencia'],
          ['e1-e3', 'e1', 'e3', 'teléfono'],
          ['e3-e4', 'e3', 'e4', 'teléfono'],
        ] as const
      ).map(([id, source, sourceTarget, label]) => ({
        id,
        source,
        target: sourceTarget,
        label,
        animated: active.includes(id),
        style: {
          stroke: active.includes(id) ? 'var(--chart-2)' : 'var(--border)',
          strokeWidth: active.includes(id) ? 2 : 1.5,
        },
        labelStyle: { fill: 'var(--muted-foreground)', fontSize: 14 },
        labelBgStyle: { fill: 'var(--card)' },
      })),
    [active],
  )

  const onNodeClick = useCallback((_: unknown, node: Node) => {
    if (node.id !== 'e1' && PATHS[node.id]) setTarget(node.id)
  }, [])

  const path = PATHS[target]
  const hops = path.hops.length - 1

  return (
    <div>
      <div
        ref={paneRef}
        style={{ height: narrow ? 380 : 260 }}
        className="rounded-md border border-border bg-muted/30"
        // React Flow builds a div tree; give the whole thing one accessible name.
        role="img"
        aria-label={title}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={NODE_TYPES}
          onNodeClick={onNodeClick}
          colorMode={resolvedTheme === 'dark' ? 'dark' : 'light'}
          fitView
          fitViewOptions={{ padding: 0.12 }}
          onInit={(instance) => {
            flowRef.current = instance
            instance.fitView({ padding: 0.12 })
          }}
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

      <div className="mt-3 rounded-md border border-border bg-card p-3 text-[13px]">
        <p className="font-semibold">
          Camino: {path.hops.join(' → ')}{' '}
          <span className="font-normal text-muted-foreground">
            ({hops} {hops === 1 ? 'salto' : 'saltos'})
          </span>
        </p>
        <ul className="mt-2 space-y-1 text-muted-foreground">
          {path.edges.map((e) => (
            <li key={e}>
              <span className="font-medium text-foreground">{EVIDENCE[e].label}</span> —{' '}
              {EVIDENCE[e].strength}
            </li>
          ))}
        </ul>
        <p className="mt-2 text-muted-foreground">
          Un camino explica cómo dos entidades están conectadas en los datos. No prueba parentesco
          ni colusión, y no etiqueta a nadie.
        </p>
      </div>

      <p className="mt-2 text-[13px] text-muted-foreground">
        Haz clic en Luis M., Oficina Lima o Marta R. para leer el camino y su evidencia.
      </p>
    </div>
  )
}
