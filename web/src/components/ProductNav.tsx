export function ProductNav({ active, navigate }: { active: string; navigate: (path: string) => void }) {
  const item = (path: string, label: string) => {
    const selected = active === path || (path === '/cases' && active.startsWith('/cases/')) || (path === '/build' && active.startsWith('/build/'))
    return (
    <button
      className={selected ? 'product-nav__item product-nav__item--active' : 'product-nav__item'}
      onClick={() => navigate(path)}
    >
      {label}
    </button>
    )
  }

  return (
    <nav className="product-nav" aria-label="Product navigation">
      <button className="product-nav__brand" onClick={() => navigate('/')}>Sovereign Lens</button>
      <div className="product-nav__links">
        {item('/', 'Idea')}
        {item('/brief', 'Executive brief')}
        {item('/cases', 'Cases')}
        {item('/horizon', 'Horizon')}
        {item('/build', 'Build')}
        <a href="https://github.com/Dim25/Sovereign-Lens">GitHub ↗</a>
      </div>
    </nav>
  )
}
