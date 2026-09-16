

const FILTERS = [
  'All',
  'Tech',
  'Non-Tech',
  'Hackathons',
  'Prizes Only',
  'Refreshments',
]

export default function FilterPills({ active, onChange }) {
  return (
    <div
      className="flex gap-2 overflow-x-auto py-2 no-scrollbar"
      style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
    >
      {FILTERS.map((cat) => {
        const isActive = active === cat
        return (
          <button
            key={cat}
            onClick={() => onChange(cat)}
            className={`filter-pill flex-shrink-0 ${isActive ? 'active' : ''}`}
          >
            {cat}
          </button>
        )
      })}
    </div>
  )
}
