import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calendar as CalendarIcon,
  MapPin,
  Users,
  ChevronDown,
  Clock,
  UserPlus,
  CheckCircle2,
} from 'lucide-react'
import { eventsApi } from '../api.js'
import CalendarSaveModal from './CalendarSaveModal.jsx'
import InviteModal from './InviteModal.jsx'

/** Maps a category to a CSS class for the hero gradient */
function getHeroClass(category = '') {
  const c = category.toLowerCase()
  if (c.includes('tech') && !c.includes('non')) return 'hero-gradient-tech'
  if (c.includes('non')) return 'hero-gradient-nontech'
  if (c.includes('hack')) return 'hero-gradient-hackathon'
  if (c.includes('prize')) return 'hero-gradient-prizes'
  if (c.includes('refresh')) return 'hero-gradient-refreshments'
  return 'hero-gradient-default'
}

function getBadgeClass(category = '') {
  const c = category.toLowerCase()
  if (c.includes('tech') && !c.includes('non')) return 'category-badge category-badge-tech'
  if (c.includes('non')) return 'category-badge category-badge-nontech'
  if (c.includes('hack')) return 'category-badge category-badge-hackathon'
  if (c.includes('prize')) return 'category-badge category-badge-prizes'
  if (c.includes('refresh')) return 'category-badge category-badge-refreshments'
  return 'category-badge category-badge-default'
}

export default function EventCard({ event, onUpdate }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isRegistered, setIsRegistered] = useState(event.is_registered || false)
  const [registeredCount, setRegisteredCount] = useState(event.registered_count || 0)
  const [isRegistering, setIsRegistering] = useState(false)
  const [showCalendarModal, setShowCalendarModal] = useState(false)
  const [showInviteModal, setShowInviteModal] = useState(false)

  const dateObj = new Date(event.event_date)
  const dayNum = dateObj.getDate()
  const monthStr = dateObj.toLocaleString('en-US', { month: 'short' }).toUpperCase()
  const timeStr = dateObj.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })

  const maxCapacity = event.max_capacity || 100
  const capacityPercent = Math.min(100, Math.round((registeredCount / maxCapacity) * 100))
  const isAlmostFull = capacityPercent >= 90

  const handleToggleRegistration = async () => {
    setIsRegistering(true)
    const prevRegistered = isRegistered
    const prevCount = registeredCount

    // Optimistic UI update
    if (prevRegistered) {
      setIsRegistered(false)
      setRegisteredCount(Math.max(0, prevCount - 1))
    } else {
      setIsRegistered(true)
      setRegisteredCount(prevCount + 1)
    }

    try {
      if (prevRegistered) {
        await eventsApi.unregister(event.id)
      } else {
        await eventsApi.register(event.id)
      }
      if (onUpdate) onUpdate()
    } catch (e) {
      console.error('Registration toggle failed:', e)
      setIsRegistered(prevRegistered)
      setRegisteredCount(prevCount)
    } finally {
      setIsRegistering(false)
    }
  }

  const heroClass = getHeroClass(event.category)
  const badgeClass = getBadgeClass(event.category)

  return (
    <>
      <div
        className="surface-card surface-card-hover"
        style={{
          marginBottom: 14,
          overflow: 'hidden',
          border: '1px solid #DDDDDD',
          backgroundColor: '#FFFFFF',
        }}
      >
        {/* Hero Banner */}
        <div
          className={heroClass}
          style={{
            height: 80,
            position: 'relative',
            display: 'flex',
            alignItems: 'flex-end',
            padding: '0 14px 14px',
          }}
        >
          {/* Floating Date Badge — Airbnb event date style */}
          <div
            style={{
              position: 'absolute',
              top: 12,
              right: 14,
              backgroundColor: '#FFFFFF',
              borderRadius: 10,
              padding: '4px 10px',
              textAlign: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.14)',
              minWidth: 44,
              border: '1px solid #DDDDDD',
            }}
          >
            <div style={{ fontSize: 9, fontWeight: 700, color: '#FF385C', letterSpacing: '0.08em' }}>
              {monthStr}
            </div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#222222', lineHeight: 1.1 }}>
              {dayNum}
            </div>
          </div>
        </div>

        {/* Card body */}
        <div style={{ padding: '14px 14px 14px', backgroundColor: '#FFFFFF' }}>
          {/* Society + Category badge */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#717171', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {event.society_name}
            </span>
            <span className={badgeClass}>{event.category}</span>
          </div>

          {/* Event title */}
          <h3 style={{ fontSize: 16, fontWeight: 800, color: '#222222', margin: '0 0 4px', lineHeight: 1.3, letterSpacing: '-0.02em' }}>
            {event.title}
          </h3>
          {event.tagline && (
            <p style={{ fontSize: 13, color: '#717171', margin: '0 0 10px' }}>
              {event.tagline}
            </p>
          )}

          {/* Venue & time */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 12, color: '#717171', marginBottom: 12, flexWrap: 'wrap' }}>
            {event.venue && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <MapPin size={13} style={{ color: '#717171' }} />
                <span>{event.venue}</span>
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Clock size={13} style={{ color: '#717171' }} />
              <span>{timeStr}</span>
            </div>
          </div>

          {/* Description */}
          <p style={{ fontSize: 13, color: '#222222', lineHeight: 1.55, margin: '0 0 14px' }}>
            {event.description}
          </p>

          {/* Capacity Bar */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 6, fontWeight: 600 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#717171' }}>
                <Users size={11} style={{ color: '#717171' }} />
                {registeredCount} / {maxCapacity} registered
              </span>
              <span style={{ color: isAlmostFull ? '#FF385C' : '#717171', fontWeight: 700 }}>
                {capacityPercent}% full
              </span>
            </div>
            <div
              style={{
                width: '100%',
                height: 5,
                borderRadius: '9999px',
                backgroundColor: '#F0F0F0',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  borderRadius: '9999px',
                  backgroundColor: '#FF385C',
                  width: `${capacityPercent}%`,
                  transition: 'width 0.3s ease',
                }}
              />
            </div>
          </div>

          {/* Itinerary accordion */}
          {event.itinerary && event.itinerary.length > 0 && (
            <div style={{ marginBottom: 14 }}>
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  borderRadius: 8,
                  cursor: 'pointer',
                  textAlign: 'left',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #DDDDDD',
                }}
              >
                <span style={{ fontSize: 12, fontWeight: 600, color: '#222222' }}>
                  Itinerary &amp; Timeline ({event.itinerary.length} items)
                </span>
                <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronDown size={14} style={{ color: '#717171' }} />
                </motion.div>
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div
                      style={{
                        marginTop: 6,
                        padding: '10px 12px',
                        borderRadius: 8,
                        border: '1px solid #DDDDDD',
                        backgroundColor: '#FFFFFF',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 8,
                      }}
                    >
                      {event.itinerary.map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 12 }}>
                          <span
                            style={{
                              fontFamily: 'ui-monospace, monospace',
                              fontSize: 11,
                              padding: '2px 8px',
                              borderRadius: 6,
                              color: '#FF385C',
                              backgroundColor: '#FFF5F5',
                              flexShrink: 0,
                              fontWeight: 600,
                              border: '1px solid #FFEBEF',
                            }}
                          >
                            {item.time}
                          </span>
                          <span style={{ color: '#222222', lineHeight: 1.4 }}>{item.activity}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Action Buttons */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              paddingTop: 12,
              borderTop: '1px solid #DDDDDD',
            }}
          >
            {/* Main Register button */}
            <button
              type="button"
              onClick={handleToggleRegistration}
              disabled={isRegistering}
              style={{
                flex: 1,
                padding: '11px 16px',
                borderRadius: '9999px',
                fontSize: 13,
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                cursor: isRegistering ? 'not-allowed' : 'pointer',
                transition: 'all 0.15s ease',
                border: 'none',
                ...(isRegistered
                  ? {
                      backgroundColor: '#EDFAF4',
                      color: '#10B981',
                      boxShadow: 'none',
                      border: '1px solid #10B981',
                    }
                  : {
                      backgroundColor: '#FF385C',
                      color: '#FFFFFF',
                      boxShadow: '0 2px 8px rgba(255,56,92,0.30)',
                    }),
              }}
            >
              {isRegistered ? (
                <>
                  <CheckCircle2 size={14} />
                  <span>Registered ✓</span>
                </>
              ) : (
                <span>Register Now</span>
              )}
            </button>

            {/* Calendar Save */}
            <button
              type="button"
              onClick={() => setShowCalendarModal(true)}
              title="Save to Campus Calendar"
              style={{
                width: 40,
                height: 40,
                borderRadius: '9999px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                backgroundColor: '#FFFFFF',
                border: '1px solid #DDDDDD',
                color: '#222222',
                transition: 'all 0.15s ease',
              }}
            >
              <CalendarIcon size={15} />
            </button>

            {/* Friend Invite */}
            <button
              type="button"
              onClick={() => setShowInviteModal(true)}
              title="Invite Friends"
              style={{
                width: 40,
                height: 40,
                borderRadius: '9999px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                backgroundColor: '#FFFFFF',
                border: '1px solid #DDDDDD',
                color: '#222222',
                transition: 'all 0.15s ease',
              }}
            >
              <UserPlus size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Save to Calendar Modal */}
      {showCalendarModal && (
        <CalendarSaveModal
          event={event}
          onClose={() => setShowCalendarModal(false)}
        />
      )}

      {/* Invite Friends Modal */}
      {showInviteModal && (
        <InviteModal
          event={event}
          onClose={() => setShowInviteModal(false)}
        />
      )}
    </>
  )
}
