import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, UserPlus, Copy, Check, Loader2, Plus } from 'lucide-react'
import { eventsApi } from '../api.js'

export default function InviteModal({ event, onClose }) {
  const [emails, setEmails] = useState(['ananya.s@thapar.edu', 'kabir.singh@thapar.edu'])
  const [inputEmail, setInputEmail] = useState('')
  const [message, setMessage] = useState('Hey! Check out this event, lets go together!')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleAddEmail = (e) => {
    if (e) e.preventDefault()
    const trimmed = inputEmail.trim()
    if (trimmed && !emails.includes(trimmed)) {
      setEmails([...emails, trimmed])
      setInputEmail('')
    }
  }

  const handleRemoveEmail = (target) => {
    setEmails(emails.filter((e) => e !== target))
  }

  const handleCopyLink = () => {
    const link = `https://campuspulse.thapar.edu/events/${event.id}`
    navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSendInvites = async () => {
    if (emails.length === 0) return
    setSending(true)
    try {
      await eventsApi.sendInvite(event.id, { emails, message })
      setSent(true)
      setTimeout(() => {
        onClose()
      }, 1200)
    } catch (e) {
      console.error('Failed to send invites:', e)
    } finally {
      setSending(false)
    }
  }

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
                <UserPlus size={17} style={{ color: '#FF5A5F' }} />
              </div>
              <h2 style={{ fontSize: 16, fontWeight: 800, color: '#222222', margin: 0, letterSpacing: '-0.02em' }}>
                Invite Friends
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

          {/* Event quick info */}
          <div
            style={{
              padding: '10px 14px',
              borderRadius: 12,
              marginBottom: 18,
              backgroundColor: '#F7F7F7',
              border: '1px solid #EBEBEB',
            }}
          >
            <p style={{ fontSize: 11, color: '#B0B0B0', margin: '0 0 3px', fontWeight: 600 }}>
              {event.society_name} presents
            </p>
            <p style={{ fontSize: 14, fontWeight: 700, color: '#222222', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {event.title}
            </p>
          </div>

          {/* Email input + chips */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: '#B0B0B0', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 10 }}>
              Select Friends / Add Email
            </label>
            <form onSubmit={handleAddEmail} style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
              <input
                type="email"
                placeholder="name@thapar.edu"
                value={inputEmail}
                onChange={(e) => setInputEmail(e.target.value)}
                className="input-standard"
                style={{ flex: 1 }}
              />
              <button
                type="submit"
                className="btn-secondary"
                style={{
                  padding: '0 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '9999px',
                  cursor: 'pointer',
                  flexShrink: 0,
                }}
              >
                <Plus size={16} />
              </button>
            </form>

            {/* Email chips */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {emails.map((em) => (
                <div
                  key={em}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '5px 10px 5px 12px',
                    borderRadius: '9999px',
                    fontSize: 12,
                    fontWeight: 600,
                    backgroundColor: '#F0F0F0',
                    border: '1px solid #EBEBEB',
                    color: '#484848',
                  }}
                >
                  <span>{em}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveEmail(em)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 16,
                      height: 16,
                      borderRadius: '9999px',
                      backgroundColor: '#DDDDDD',
                      color: '#767676',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 0,
                    }}
                  >
                    <X size={10} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Message note */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: '#B0B0B0', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 8 }}>
              Invitation Note
            </label>
            <textarea
              rows={2}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="input-standard resize-none"
            />
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={handleCopyLink}
              className="btn-secondary"
              style={{
                flex: 1,
                padding: '13px 12px',
                fontSize: 13,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                borderRadius: '9999px',
              }}
            >
              {copied ? <Check size={14} style={{ color: '#10B981' }} /> : <Copy size={14} />}
              <span>{copied ? 'Link Copied!' : 'Copy Event Link'}</span>
            </button>

            <button
              onClick={handleSendInvites}
              disabled={sending || sent || emails.length === 0}
              style={{
                flex: 1,
                padding: '13px 12px',
                fontSize: 13,
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                borderRadius: '9999px',
                cursor: sending || sent || emails.length === 0 ? 'not-allowed' : 'pointer',
                border: 'none',
                transition: 'all 0.15s ease',
                backgroundColor: sent ? '#EDFAF4' : '#FF5A5F',
                color: sent ? '#10B981' : '#FFFFFF',
                boxShadow: sent ? 'none' : '0 2px 8px rgba(255,90,95,0.30)',
              }}
            >
              {sending ? (
                <Loader2 size={15} className="animate-spin" />
              ) : sent ? (
                <>
                  <Check size={14} strokeWidth={2.5} />
                  <span>Invites Sent!</span>
                </>
              ) : (
                <>
                  <Send size={14} />
                  <span>Send ({emails.length})</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
