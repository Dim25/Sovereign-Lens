import { useCallback, useEffect, useMemo, useState } from 'react'
import type { DataSource, IsoDate } from '../types'

/**
 * All view state is a single `as_of` date. Everything else — the graph, which
 * facts are current, which are superseded, the snapshot digest, which
 * assessments exist, whether the prediction has resolved, which methodology
 * version governs — is derived by projecting the case at that date. Nothing is
 * mutated forward, so scrubbing backwards is exact rather than approximate.
 */
export function useCase(source: DataSource, initialAsOf?: IsoDate) {
  const meta = useMemo(() => source.meta(), [source])
  const stops = useMemo(() => source.timeline(), [source])
  const [asOf, setAsOf] = useState<IsoDate>(initialAsOf ?? meta.t0)

  const step = useCallback(
    (delta: number) => {
      setAsOf((current) => {
        const index = stops.findIndex((s) => s.as_of === current)
        const next = Math.min(Math.max(index + delta, 0), stops.length - 1)
        return stops[next].as_of
      })
    },
    [stops],
  )

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') step(1)
      if (event.key === 'ArrowLeft') step(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [step])

  const view = useMemo(
    () => ({
      snapshot: source.snapshot(asOf),
      assessments: source.assessments(asOf),
      disagreements: source.disagreements(asOf),
      predictions: source.predictions(asOf),
      calibration: source.calibration(asOf),
      lessons: source.methodology(asOf),
      methodologyVersion: source.methodologyVersion(asOf),
    }),
    [source, asOf],
  )

  return { meta, stops, asOf, setAsOf, step, sources: source.sources(), ...view }
}
