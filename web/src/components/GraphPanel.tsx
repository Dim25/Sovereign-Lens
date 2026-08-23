import type { GraphEdge, GraphNode, Snapshot } from '../types'

const VIEW_W = 886
const VIEW_H = 424

interface Point { x: number; y: number }

const centre = (n: GraphNode): Point => ({ x: n.x + n.w / 2, y: n.y + n.h / 2 })

/** Where the centre-to-centre line crosses the node's rectangle. */
function boundary(node: GraphNode, toward: Point): Point {
  const c = centre(node)
  const dx = toward.x - c.x
  const dy = toward.y - c.y
  if (dx === 0 && dy === 0) return c
  const scale = Math.min(
    dx === 0 ? Infinity : (node.w / 2 + 4) / Math.abs(dx),
    dy === 0 ? Infinity : (node.h / 2 + 4) / Math.abs(dy),
  )
  return { x: c.x + dx * scale, y: c.y + dy * scale }
}

/** Two actors can be joined by more than one relationship — Microsoft both
 *  funds and partners with G42. Drawn on the same line their labels collide, so
 *  parallel edges are fanned apart perpendicular to their shared axis. */
function fanIndex(edges: GraphEdge[]): Map<string, { index: number; count: number }> {
  const groups = new Map<string, string[]>()
  for (const edge of edges) {
    const key = [edge.source_node_id, edge.target_node_id].sort().join('~')
    groups.set(key, [...(groups.get(key) ?? []), edge.id])
  }
  const out = new Map<string, { index: number; count: number }>()
  for (const ids of groups.values()) {
    ids.forEach((id, index) => out.set(id, { index, count: ids.length }))
  }
  return out
}

export function GraphPanel({
  snapshot, onSelectNode,
}: { snapshot: Snapshot; onSelectNode: (node: GraphNode) => void }) {
  const byId = new Map(snapshot.nodes.map((n) => [n.id, n]))
  const fan = fanIndex(snapshot.edges)
  const changed = new Set(snapshot.changed_edge_ids)
  const changedNodes = new Set(
    snapshot.nodes.filter((n) => n.valid_from === snapshot.as_of).map((n) => n.id),
  )

  const drawEdge = (edge: GraphEdge) => {
    const from = byId.get(edge.source_node_id)
    const to = byId.get(edge.target_node_id)
    if (!from || !to) return null
    const { index, count } = fan.get(edge.id) ?? { index: 0, count: 1 }
    const rawStart = boundary(from, centre(to))
    const rawEnd = boundary(to, centre(from))
    const length = Math.hypot(rawEnd.x - rawStart.x, rawEnd.y - rawStart.y) || 1
    const spread = (index - (count - 1) / 2) * 15
    const nx = (-(rawEnd.y - rawStart.y) / length) * spread
    const ny = ((rawEnd.x - rawStart.x) / length) * spread
    const start = { x: rawStart.x + nx, y: rawStart.y + ny }
    const end = { x: rawEnd.x + nx, y: rawEnd.y + ny }
    const t = edge.label_t ?? 0.5
    const isChanged = changed.has(edge.id)
    const classes = [
      'graph__edge',
      edge.type === 'depends_on' ? 'graph__edge--dependency' : '',
      isChanged ? 'graph__edge--changed' : '',
    ].filter(Boolean).join(' ')
    return (
      <g key={edge.id}>
        <line
          className={classes}
          x1={start.x} y1={start.y} x2={end.x} y2={end.y}
          markerEnd={isChanged ? 'url(#arrow-accent)' : 'url(#arrow)'}
        />
        <text
          className={`graph__edge-label${isChanged ? ' graph__edge-label--changed' : ''}`}
          x={start.x + (end.x - start.x) * t}
          y={start.y + (end.y - start.y) * t - 3}
          textAnchor="middle"
          paintOrder="stroke"
          stroke="#ffffff"
          strokeWidth={3.5}
        >
          {edge.type}
        </text>
      </g>
    )
  }

  return (
    <section className="panel">
      <div className="panel__head">
        <h2 className="panel__title">Actor / asset relationships</h2>
        <span className="panel__note">
          {snapshot.nodes.length} nodes · {snapshot.edges.length} relationships valid at as_of
        </span>
      </div>
      <div className="panel__body panel__body--flush graph-viewport">
        <svg className="graph" viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} preserveAspectRatio="xMidYMid meet" role="img" aria-label="Actor and asset relationship graph">
          <defs>
            <marker id="arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M 0 1 L 7 4 L 0 7" fill="none" stroke="#0d0d0d" strokeWidth="1" />
            </marker>
            <marker id="arrow-accent" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M 0 1 L 7 4 L 0 7" fill="none" stroke="#c4321c" strokeWidth="1.4" />
            </marker>
          </defs>
          {snapshot.edges.map(drawEdge)}
          {snapshot.nodes.map((node) => (
            <g
              key={node.id}
              className={[
                'graph__node',
                node.kind === 'actor' ? 'graph__node--actor' : 'graph__node--asset',
                changedNodes.has(node.id) ? 'graph__node--changed' : '',
              ].filter(Boolean).join(' ')}
              onClick={() => onSelectNode(node)}
              role="button"
              tabIndex={0}
              aria-label={node.name}
              onKeyDown={(event) => { if (event.key === 'Enter') onSelectNode(node) }}
            >
              <rect x={node.x} y={node.y} width={node.w} height={node.h} />
              <text className="graph__type" x={node.x + 9} y={node.y + 15}>
                {node.node_type.replace(/_/g, ' ')}
              </text>
              <text className="graph__name" x={node.x + 9} y={node.y + 32}>
                {node.name}
              </text>
            </g>
          ))}
        </svg>
      </div>
      <div className="graph__legend">
        <span><span className="legend__swatch" />relationship</span>
        <span><span className="legend__swatch" style={{ borderTopWidth: 2 }} />depends_on</span>
        <span className="legend__swatch--accent"><span className="legend__swatch legend__swatch--accent" />new at this snapshot</span>
        <span>solid border · actor &nbsp;|&nbsp; hairline · asset</span>
      </div>
    </section>
  )
}
