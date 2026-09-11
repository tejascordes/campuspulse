import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Calendar as CalendarIcon, Lock, Users, Globe, Check, Loader2 } from 'lucide-react'
import { eventsApi } from '../api.js'

const PRIVACY_OPTIONS = [
  {
    key: 'NO_ONE',
    label: 'Only Me',
    subtitle: 'Private to your personal calendar',
    icon: Lock,
  },
  {
    key: 'CLOSE_FRIENDS',
    label: 'Close Friends',
    subtitle: 'Visible to your verified close network',
    icon: Users,
  },
  {
    key: 'EVERY_FRIEND',
    label: 'All Friends',
    subtitle: 'Broadcasted to your campus friend list',
    icon: Globe,
  },
]

export default function CalendarSaveModal({ event, onClose, onSaved }) {
  const [privacy, setPrivacy] = useState('CLOSE_FRIENDS')
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      await eventsApi.saveToCalendar({
        event_title: event.title,
        event_date: event.event_date,
        visibility: privacy,
        description: `${event.society_name} • ${event.venue || 'Campus'}`,
      })
      setSuccess(true)
      if (onSaved) onSaved()
      setTimeout(() => {
        onClose()
      }, 1200)
    } catch (e) {
      console.error('Failed to save to calendar:', e)
    } finally {
      setSaving(false)
    }
  }

  const formattedDate = new Date(event.event_date).toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4">
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0"
          style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        {/* Sheet */}
        <motion.div
          className="relative w-full max-w-md p-5 rounded-t-2xl md:rounded-2xl z-10 bg-[#121215] border border-[#27272a] max-h-[90vh] overflow-y-auto shadow-2xl"
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 30, stiffness: 400 }}
        >
          <div className="drag-handle md:hidden" />

          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CalendarIcon size={18} className="text-zinc-300" />
              <h2 className="text-base font-bold text-zinc-100">Save to Calendar</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 transition-colors bg-[#18181b] border border-[#27272a] hover:border-[#3f3f46] cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>

          {/* Event Mini Card */}
          <div
            className="p-3.5 rounded-xl mb-4 bg-[#18181b] border border-[#27272a]"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-zinc-200">
                {event.society_name}
              </span>
              <span className="text-xs text-zinc-500">{formattedDate}</span>
            </div>
            <h4 className="text-sm font-semibold text-zinc-100 line-clamp-1">{event.title}</h4>
            {event.venue && (
              <p className="text-xs text-zinc-400 mt-1">📍 {event.venue}</p>
            )}
          </div>

          {/* Sharing Privacy Level */}
          <div className="mb-5">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-2">
              Share Visibility with Friends
            </label>
            <div className="flex flex-col gap-2">
              {PRIVACY_OPTIONS.map((opt) => {
                const Icon = opt.icon
                const isSelected = privacy === opt.key
                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => setPrivacy(opt.key)}
                    className="flex items-center justify-between p-3 rounded-xl cursor-pointer text-left transition-colors"
                    style={{
                      backgroundColor: isSelected ? '#18181b' : '#121215',
                      border: `1px solid ${isSelected ? '#52525b' : '#27272a'}`,
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{
                          backgroundColor: '#18181b',
                          color: isSelected ? '#f4f4f5' : '#71717a',
                          border: '1px solid #27272a',
                        }}
                      >
                        <Icon size={16} />
                      </div>
                      <div>
                        <p
                          className="text-xs font-semibold"
                          style={{ color: isSelected ? '#f4f4f5' : '#a1a1aa' }}
                        >
                          {opt.label}
                        </p>
                        <p className="text-[11px] text-zinc-500">{opt.subtitle}</p>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="w-4 h-4 rounded-full flex items-center justify-center bg-zinc-100 text-zinc-950">
                        <Check size={11} strokeWidth={3} />
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSave}
            disabled={saving || success}
            className={`w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors ${
              success
                ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-800'
                : 'btn-primary'
            }`}
          >
            {saving ? (
              <Loader2 size={16} className="animate-spin" />
            ) : success ? (
              <>
                <Check size={16} strokeWidth={2.5} />
                <span>Saved to Calendar!</span>
              </>
            ) : (
              <span>Save to Schedule</span>
            )}
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
