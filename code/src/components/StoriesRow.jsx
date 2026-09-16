import { useState, useEffect } from 'react'
import { Flame } from 'lucide-react'
import { societiesApi } from '../api.js'

export default function StoriesRow({ onSocietyClick }) {
  const [societies, setSocieties] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSocieties() {
      try {
        const data = await societiesApi.getSocieties()
        setSocieties(data)
      } catch (e) {
        console.error('Failed to load societies for stories:', e)
      } finally {
        setLoading(false)
      }
    }
    fetchSocieties()
  }, [])

  return (
    <div className="w-full overflow-x-auto no-scrollbar py-3 flex items-center gap-4 select-none">
      {/* Today / Highlights Bubble */}
      <button
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flexShrink: 0, cursor: 'pointer', background: 'transparent', border: 'none', padding: 0 }}
        onClick={() => onSocietyClick?.('CCS')}
        className="group"
      >
        <div style={{ position: 'relative' }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: '9999px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, #FF5A5F 0%, #FC642D 100%)',
              boxShadow: '0 2px 10px rgba(255,90,95,0.30)',
              transition: 'box-shadow 0.2s ease',
            }}
          >
            <Flame size={20} style={{ color: '#FFFFFF' }} />
          </div>
          <span
            style={{
              position: 'absolute',
              top: -2,
              right: -2,
              width: 12,
              height: 12,
              borderRadius: '9999px',
              backgroundColor: '#FF5A5F',
              border: '2px solid #F7F7F7',
            }}
          />
        </div>
        <span style={{ fontSize: 11, fontWeight: 600, color: '#484848' }}>Today</span>
      </button>

      {/* Society Story Bubbles */}
      {loading
        ? Array.from({ length: 5 }).map((_, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flexShrink: 0 }} className="animate-pulse">
              <div style={{ width: 56, height: 56, borderRadius: '9999px', backgroundColor: '#EBEBEB' }} />
              <div style={{ width: 32, height: 8, borderRadius: 4, backgroundColor: '#EBEBEB' }} />
            </div>
          ))
        : societies.map((soc) => {
            const hasEvents = soc.event_count > 0
            const initials = soc.name.slice(0, 2).toUpperCase()
            return (
              <button
                key={soc.name}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flexShrink: 0, cursor: 'pointer', background: 'transparent', border: 'none', padding: 0 }}
                onClick={() => onSocietyClick?.(soc.name)}
              >
                <div style={{ position: 'relative' }}>
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: '9999px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: 13,
                      letterSpacing: '0.02em',
                      backgroundColor: hasEvents ? '#FFF5F5' : '#F7F7F7',
                      border: hasEvents ? '2.5px solid #FF5A5F' : '2px solid #DDDDDD',
                      color: hasEvents ? '#FF5A5F' : '#767676',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {initials}
                  </div>
                  {hasEvents && (
                    <span
                      style={{
                        position: 'absolute',
                        top: -2,
                        right: -2,
                        minWidth: 16,
                        height: 16,
                        borderRadius: '9999px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 9,
                        fontWeight: 800,
                        backgroundColor: '#FF5A5F',
                        color: '#FFFFFF',
                        border: '2px solid #F7F7F7',
                        padding: '0 3px',
                      }}
                    >
                      {soc.event_count}
                    </span>
                  )}
                </div>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    maxWidth: 56,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    textAlign: 'center',
                    color: '#484848',
                  }}
                >
                  {soc.name}
                </span>
              </button>
            )
          })}
    </div>
  )
}
