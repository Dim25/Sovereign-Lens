import type { IsoDate, TimelineStop } from '../types'

export function TimeScrubber({
  stops, asOf, onScrub, onAdvance, advanceLabel, canAdvance,
}: {
  stops: TimelineStop[]
  asOf: IsoDate
  onScrub: (asOf: IsoDate) => void
  onAdvance: () => void
  advanceLabel: string
  canAdvance: boolean
}) {
  const index = stops.findIndex((s) => s.as_of === asOf)
  const current = stops[index]

  return (
    <div className="scrubber">
      <div className="scrubber__track">
        <div className="scrubber__rail" />
        <div className="scrubber__stops">
          {stops.map((stop, i) => {
            const state = i === index ? 'current' : i < index ? 'past' : 'future'
            return (
              <button
                className={`stop stop--${state}`}
                key={stop.as_of}
                onClick={() => onScrub(stop.as_of)}
                aria-current={i === index}
                aria-label={`Set as_of to ${stop.as_of}`}
              >
                <span className="stop__label">{stop.label}</span>
                <span className="stop__dot" />
                <span className="stop__date">{stop.as_of}</span>
              </button>
            )
          })}
        </div>
        {current ? <p className="scrubber__note">{current.note}</p> : null}
      </div>
      <button className="scrubber__advance" onClick={onAdvance} disabled={!canAdvance}>
        {advanceLabel}
      </button>
    </div>
  )
}
