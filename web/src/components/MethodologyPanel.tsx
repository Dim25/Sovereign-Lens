import type { MethodologyLesson } from '../types'

export function MethodologyPanel({ lessons }: { lessons: MethodologyLesson[] }) {
  return (
    <section className="panel">
      <div className="panel__head">
        <h2 className="panel__title">Methodology review</h2>
        <span className="panel__note">human-governed · history preserved</span>
      </div>
      {lessons.length === 0 ? (
        <p className="empty">
          No prediction has been resolved, so no lesson has been proposed for human review.
        </p>
      ) : (
        <div className="panel__body">
          {lessons.map((lesson) => (
            <div key={lesson.id} data-testid="lesson">
              <div className="lesson__version">
                <span className="version-chip version-chip--retired">{lesson.version_before}</span>
                <span className="lesson__arrow">→</span>
                <span className="version-chip version-chip--current">{lesson.version_after}</span>
                <span className="panel__note" style={{ marginLeft: 6 }}>
                  {lesson.human_disposition} by {lesson.reviewer} · {lesson.effective_from}
                </span>
              </div>
              <p className="lesson__change">{lesson.proposed_change}</p>
              <p className="lesson__rationale">
                <strong>Failure surface:</strong> {lesson.failure_surface.replace(/_/g, ' ')}. {lesson.rationale}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
