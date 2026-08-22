export function ProductNav({ active, navigate }: { active: string; navigate: (path: string) => void }) {
  const item = (path: string, label: string) => (
    <button
      className={active === path ? 'product-nav__item product-nav__item--active' : 'product-nav__item'}
      onClick={() => navigate(path)}
    >
      {label}
    </button>
  )

  return (
    <nav className="product-nav" aria-label="Product navigation">
      <button className="product-nav__brand" onClick={() => navigate('/')}>Sovereign Lens</button>
      <div className="product-nav__links">
        {item('/', 'Idea')}
        {item('/brief', 'Executive brief')}
        {item('/cases/uae-us-ai-infrastructure', 'Full dossier')}
        <a href="https://github.com/Dim25/Sovereign-Lens">GitHub ↗</a>
      </div>
    </nav>
  )
}
