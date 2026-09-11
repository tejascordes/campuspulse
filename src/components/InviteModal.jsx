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
      await eventsApi.sendInvite(event.id, {
        emails,
        message,
      })
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
      <div className="fixed inset-0 z-50 flex items-end justify-center">
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0"
          style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        {/* Sheet */}
        <motion.div
          className="relative w-full max-w-md p-5 rounded-t-2xl z-10"
          style={{
            backgroundColor: '#141417',
            border: '1px solid #232326',
            borderBottom: 'none',
            maxHeight: '90vh',
            overflowY: 'auto',
          }}
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 400 }}
        >
          <div className="drag-handle" />

          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <UserPlus size={18} className="text-zinc-300" />
              <h2 className="text-base font-bold text-zinc-100">Invite Friends</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 transition-colors"
              style={{ backgroundColor: '#1a1a1f', border: '1px solid #232326' }}
            >
              <X size={16} />
            </button>
          </div>

          {/* Event Quick Info */}
          <div
            className="p-3 rounded-xl mb-4"
            style={{
              backgroundColor: '#1a1a1f',
              border: '1px solid #232326',
            }}
          >
            <p className="text-xs text-zinc-500">{event.society_name} presents</p>
            <p className="text-sm font-semibold text-zinc-100 line-clamp-1">{event.title}</p>
          </div>

          {/* Email Input & Chips */}
          <div className="mb-4">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-2">
              Select Friends / Add Email
            </label>
            <form onSubmit={handleAddEmail} className="flex gap-2 mb-2.5">
              <input
                type="email"
                placeholder="name@thapar.edu"
                value={inputEmail}
                onChange={(e) => setInputEmail(e.target.value)}
                className="input-standard flex-1"
              />
              <button
                type="submit"
                className="btn-secondary px-3.5 flex items-center justify-center rounded-xl"
              >
                <Plus size={16} />
              </button>
            </form>

            {/* Email Chips */}
            <div className="flex flex-wrap gap-1.5">
              {emails.map((em) => (
                <div
                  key={em}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: '#1a1a1f',
                    border: '1px solid #232326',
                    color: '#d4d4d8',
                  }}
                >
                  <span>{em}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveEmail(em)}
                    className="p-0.5 rounded-full text-zinc-500 hover:text-zinc-300"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Optional Message */}
          <div className="mb-5">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-2">
              Invitation Note
            </label>
            <textarea
              rows={2}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="input-standard resize-none"
            />
          </div>

          {/* Actions: Send & Copy Link */}
          <div className="flex gap-2.5">
            <button
              onClick={handleCopyLink}
              className="btn-secondary flex-1 py-3 text-xs flex items-center justify-center gap-1.5"
            >
              {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              <span>{copied ? 'Link Copied!' : 'Copy Event Link'}</span>
            </button>

            <button
              onClick={handleSendInvites}
              disabled={sending || sent || emails.length === 0}
              className={`flex-1 py-3 text-xs flex items-center justify-center gap-1.5 rounded-xl transition-colors ${
                sent
                  ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-800'
                  : 'btn-primary'
              }`}
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
                  <span>Send Invites ({emails.length})</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
