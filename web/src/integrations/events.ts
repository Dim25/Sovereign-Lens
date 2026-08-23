export type SovereignLensEvent = 'sl_evidence_opened' | 'sl_perspective_compared' | 'sl_horizon_viewed'

export function emitIntegrationEvent(name: SovereignLensEvent, detail: Record<string, string> = {}) {
  window.dispatchEvent(new CustomEvent(name, { detail: { ...detail, occurred_at: new Date().toISOString() } }))
  window.dispatchEvent(new CustomEvent('sovereign-lens:event', { detail: { name, ...detail } }))
}
