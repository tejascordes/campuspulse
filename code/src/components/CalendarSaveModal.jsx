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
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 50,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          padding: '0',
        }}
        className="md:items-center md:p-4"
      >
        {/* Backdrop */}
        <motion.div
          style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.50)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        {/* Sheet */}
        <motion.div
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: 440,
            padding: '20px 20px 28px',
            borderRadius: '20px 20px 0 0',
            zIndex: 10,
            backgroundColor: '#FFFFFF',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 -4px 40px rgba(0,0,0,0.14)',
          }}
          className="md:rounded-2xl"
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 30, stiffness: 400 }}
        >
          <div className="drag-handle md:hidden" />

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '9999px',
                  backgroundColor: '#FFF5F5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CalendarIcon size={17} style={{ color: '#FF5A5F' }} />
              </div>
              <h2 style={{ fontSize: 16, fontWeight: 800, color: '#222222', margin: 0, letterSpacing: '-0.02em' }}>
                Save to Calendar
              </h2>
            </div>
            <button
              onClick={onClose}
              style={{
                width: 30,
                height: 30,
                borderRadius: '9999px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                backgroundColor: '#F7F7F7',
                border: '1px solid #EBEBEB',
                color: '#484848',
              }}
            >
              <X size={15} />
            </button>
          </div>

          {/* Event mini card */}
          <div
            style={{
              padding: '12px 14px',
              borderRadius: 12,
              marginBottom: 18,
              backgroundColor: '#F7F7F7',
              border: '1px solid #EBEBEB',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#767676' }}>{event.society_name}</span>
              <span style={{ fontSize: 11, color: '#B0B0B0' }}>{formattedDate}</span>
            </div>
            <h4 style={{ fontSize: 14, fontWeight: 700, color: '#222222', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {event.title}
            </h4>
            {event.venue && (
              <p style={{ fontSize: 12, color: '#B0B0B0', margin: '4px 0 0' }}>📍 {event.venue}</p>
            )}
          </div>

          {/* Privacy selection */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: '#B0B0B0', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 10 }}>
              Share Visibility with Friends
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {PRIVACY_OPTIONS.map((opt) => {
                const Icon = opt.icon
                const isSelected = privacy === opt.key
                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => setPrivacy(opt.key)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 14px',
                      borderRadius: 12,
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s ease',
                      backgroundColor: isSelected ? '#FFF5F5' : '#F7F7F7',
                      border: isSelected ? '1.5px solid #FF5A5F' : '1.5px solid #EBEBEB',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div
                        style={{
                          width: 34,
                          height: 34,
                          borderRadius: '9999px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: isSelected ? '#FF5A5F' : '#EBEBEB',
                          color: isSelected ? '#FFFFFF' : '#767676',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <Icon size={15} />
                      </div>
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 700, color: isSelected ? '#222222' : '#484848', margin: 0 }}>{opt.label}</p>
                        <p style={{ fontSize: 11, color: '#B0B0B0', margin: '2px 0 0' }}>{opt.subtitle}</p>
                      </div>
                    </div>
                    {/* Radio button */}
                    <div
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius: '9999px',
                        border: isSelected ? '2px solid #FF5A5F' : '2px solid #DDDDDD',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {isSelected && (
                        <div style={{ width: 8, height: 8, borderRadius: '9999px', backgroundColor: '#FF5A5F' }} />
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={handleSave}
            disabled={saving || success}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '9999px',
              fontSize: 14,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              cursor: saving || success ? 'not-allowed' : 'pointer',
              border: 'none',
              transition: 'all 0.15s ease',
              backgroundColor: success ? '#EDFAF4' : '#FF5A5F',
              color: success ? '#10B981' : '#FFFFFF',
              boxShadow: success ? 'none' : '0 2px 8px rgba(255,90,95,0.35)',
            }}
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
