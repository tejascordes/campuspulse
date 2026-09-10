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
import axios from 'axios'
import { API_URL } from '../App.jsx'
import CalendarSaveModal from './CalendarSaveModal.jsx'
import InviteModal from './InviteModal.jsx'

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
        await axios.delete(`${API_URL}/api/events/${event.id}/register`)
      } else {
        await axios.post(`${API_URL}/api/events/${event.id}/register`)
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

  return (
    <>
      <div
        className="p-4 mb-3.5 rounded-xl transition-colors cursor-pointer"
        style={{
          backgroundColor: '#141417',
          border: '1px solid #232326',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#323238')}
        onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#232326')}
      >
        {/* Top Section: Date box & Details */}
        <div className="flex items-start gap-3 mb-3">
          {/* Subtle Date Box */}
          <div
            className="flex flex-col items-center justify-center w-11 h-12 rounded-lg flex-shrink-0"
            style={{
              backgroundColor: '#1a1a1f',
              border: '1px solid #232326',
            }}
          >
            <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
              {monthStr}
            </span>
            <span className="text-base font-bold text-zinc-100 leading-none mt-0.5">
              {dayNum}
            </span>
          </div>

          {/* Title, Society & Neutral Badges */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-1 flex-wrap">
              <span className="text-xs font-semibold text-zinc-200">
                {event.society_name}
              </span>
              <span
                className="text-[11px] font-medium px-2 py-0.5 rounded-md"
                style={{
                  border: '1px solid #232326',
                  color: '#a1a1aa',
                  backgroundColor: 'transparent',
                }}
              >
                {event.category}
              </span>
            </div>

            <h3 className="text-sm font-semibold text-zinc-100 leading-snug">
              {event.title}
            </h3>
            {event.tagline && (
              <p className="text-xs text-zinc-400 mt-0.5">
                {event.tagline}
              </p>
            )}
          </div>
        </div>

        {/* Venue & Time metadata */}
        <div className="flex items-center gap-3 text-xs text-zinc-400 mb-3 flex-wrap">
          {event.venue && (
            <div className="flex items-center gap-1">
              <MapPin size={13} className="text-zinc-500" />
              <span>{event.venue}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Clock size={13} className="text-zinc-500" />
            <span>{timeStr}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-zinc-400 leading-relaxed mb-3.5">
          {event.description}
        </p>

        {/* Capacity Bar */}
        <div className="mb-3.5">
          <div className="flex justify-between text-[11px] text-zinc-400 mb-1 font-medium">
            <span className="flex items-center gap-1">
              <Users size={12} className="text-zinc-500" /> {registeredCount} / {maxCapacity} Registered
            </span>
            <span className={capacityPercent >= 90 ? 'text-amber-400 font-semibold' : 'text-zinc-400'}>
              {capacityPercent}% full
            </span>
          </div>
          <div
            className="w-full h-1.5 rounded-full overflow-hidden"
            style={{ backgroundColor: '#1a1a1f', border: '1px solid #232326' }}
          >
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                capacityPercent >= 90 ? 'bg-amber-500' : 'bg-zinc-300'
              }`}
              style={{ width: `${capacityPercent}%` }}
            />
          </div>
        </div>

        {/* Expandable Itinerary Accordion */}
        {event.itinerary && event.itinerary.length > 0 && (
          <div className="mb-3.5">
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full flex items-center justify-between p-2 rounded-lg cursor-pointer text-left transition-colors"
              style={{
                backgroundColor: '#1a1a1f',
                border: '1px solid #232326',
              }}
            >
              <span className="text-xs font-medium text-zinc-300">
                Itinerary & Timeline ({event.itinerary.length} items)
              </span>
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown size={14} className="text-zinc-400" />
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
                    className="mt-2 p-3 rounded-lg flex flex-col gap-2"
                    style={{
                      backgroundColor: '#101013',
                      border: '1px solid #232326',
                    }}
                  >
                    {event.itinerary.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs">
                        <span
                          className="text-[11px] font-mono px-1.5 py-0.5 rounded text-zinc-300 flex-shrink-0"
                          style={{ backgroundColor: '#1a1a1f', border: '1px solid #232326' }}
                        >
                          {item.time}
                        </span>
                        <span className="text-zinc-400 leading-snug">{item.activity}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Action Buttons Row */}
        <div className="flex items-center gap-2 pt-2.5" style={{ borderTop: '1px solid #1b1b1e' }}>
          {/* Main Register Button: Saturated accent strictly for active / registered status */}
          <button
            type="button"
            onClick={handleToggleRegistration}
            disabled={isRegistering}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
              isRegistered
                ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-800/60'
                : 'btn-primary'
            }`}
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

          {/* Calendar Save Button */}
          <button
            type="button"
            onClick={() => setShowCalendarModal(true)}
            className="p-2 rounded-xl border cursor-pointer flex items-center justify-center transition-colors"
            style={{
              backgroundColor: '#1a1a1f',
              borderColor: '#232326',
              color: '#a1a1aa',
            }}
            title="Save to Campus Calendar"
          >
            <CalendarIcon size={14} />
          </button>

          {/* Friend Invite Button */}
          <button
            type="button"
            onClick={() => setShowInviteModal(true)}
            className="p-2 rounded-xl border cursor-pointer flex items-center justify-center transition-colors"
            style={{
              backgroundColor: '#1a1a1f',
              borderColor: '#232326',
              color: '#a1a1aa',
            }}
            title="Invite Friends"
          >
            <UserPlus size={14} />
          </button>
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
