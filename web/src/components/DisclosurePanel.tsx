export function DisclosurePanel({ items }: { items: string[] }) {
  return (
    <section className="panel panel--disclosure">
      <div className="panel__head">
        <h2 className="panel__title">Disclosure</h2>
        <span className="panel__note">what this screen is not claiming</span>
      </div>
      <div className="disclosure">
        <ul>
          {items.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </div>
    </section>
  )
}
