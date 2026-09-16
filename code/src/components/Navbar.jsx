import { motion } from 'framer-motion'
import { Rss, MapPin, User } from 'lucide-react'

const tabs = [
  { id: 'feed', label: 'Feed', icon: Rss },
  { id: 'map', label: 'Explore', icon: MapPin },
  { id: 'profile', label: 'Profile', icon: User },
]

export default function Navbar({ activeTab, onTabChange }) {
  return (
    <nav
      className="w-full relative z-50 flex-shrink-0"
      style={{
        backgroundColor: '#FFFFFF',
        borderTop: '1px solid #EBEBEB',
        boxShadow: '0 -2px 12px rgba(0,0,0,0.06)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      <div
        style={{
          maxWidth: '56rem',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          padding: '10px 16px 12px',
        }}
      >
        {tabs.map(({ id, label, icon: Icon }) => {
          const isActive = activeTab === id
          return (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 3,
                minWidth: 64,
                padding: '2px 0',
                cursor: 'pointer',
                border: 'none',
                background: 'transparent',
                position: 'relative',
              }}
            >
              {/* Active indicator dot above icon */}
              {isActive && (
                <motion.div
                  layoutId="nav-dot"
                  style={{
                    position: 'absolute',
                    top: -8,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 4,
                    height: 4,
                    borderRadius: '9999px',
                    backgroundColor: '#FF5A5F',
                  }}
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}

              <Icon
                size={22}
                strokeWidth={isActive ? 2.2 : 1.7}
                style={{
                  color: isActive ? '#FF5A5F' : '#B0B0B0',
                  transition: 'color 0.15s ease',
                }}
              />
              <span
                style={{
                  fontSize: 11,
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? '#FF5A5F' : '#B0B0B0',
                  letterSpacing: '-0.01em',
                  transition: 'color 0.15s ease, font-weight 0.15s ease',
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
