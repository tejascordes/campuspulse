export const AVAILABLE_TAGS = [
  'All',
  'Tech',
  'Non-Tech',
  'Hackathon',
  'Prize Pool',
  'Certificate',
  'Refreshments',
  'Overnight',
  'Cultural',
  'Workshop',
  'Free Entry',
]

export default function FilterPills({ active, onChange }) {
  return (
    <div
      className="flex gap-2 overflow-x-auto py-2 no-scrollbar bg-white"
      style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
    >
      {AVAILABLE_TAGS.map((cat) => {
        const isActive = active === cat
        return (
          <button
            key={cat}
            onClick={() => onChange(cat)}
            className={`filter-pill flex-shrink-0 ${isActive ? 'active' : ''}`}
            style={
              isActive
                ? {
                    backgroundColor: '#000000',
                    color: '#FFFFFF',
                    borderColor: '#000000',
                    fontWeight: 600,
                  }
                : {
                    backgroundColor: '#FFFFFF',
                    color: '#222222',
                    borderColor: '#DDDDDD',
                  }
            }
          >
            {cat}
          </button>
        )
      })}
    </div>
  )
}
