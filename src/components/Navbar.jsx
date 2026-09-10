import { motion } from 'framer-motion'
import { Rss, MapPin, User } from 'lucide-react'

const tabs = [
  { id: 'feed', label: 'Feed', icon: Rss },
  { id: 'map', label: 'Map', icon: MapPin },
  { id: 'profile', label: 'Profile', icon: User },
]

export default function Navbar({ activeTab, onTabChange }) {
  return (
    <nav
      className="relative z-50 flex-shrink-0"
      style={{
        backgroundColor: '#0a0a0c',
        borderTop: '1px solid #232326',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      <div className="flex items-center justify-around px-4 pt-2.5 pb-3">
        {tabs.map(({ id, label, icon: Icon }) => {
          const isActive = activeTab === id
          return (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className="flex flex-col items-center gap-1 relative min-w-[64px] py-1 cursor-pointer border-none bg-transparent group"
            >
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full"
                  style={{ backgroundColor: '#f4f4f5' }}
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
              <div
                className="transition-colors duration-150"
                style={{
                  color: isActive ? '#f4f4f5' : '#71717a',
                }}
              >
                <Icon
                  size={20}
                  strokeWidth={isActive ? 2.2 : 1.8}
                  className="group-hover:text-zinc-300 transition-colors"
                />
              </div>
              <span
                className="text-xs font-medium tracking-tight transition-colors duration-150"
                style={{
                  color: isActive ? '#f4f4f5' : '#71717a',
                }}
              >
                {label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

