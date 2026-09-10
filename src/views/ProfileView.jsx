import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LogOut, Eye, EyeOff, Users, Shield, BarChart2, Calendar, Loader2, Check } from 'lucide-react'
import axios from 'axios'
import { API_URL } from '../App.jsx'

const PRIVACY_OPTIONS = [
  {
    value: 'NO_ONE',
    label: 'Only Me',
    sub: 'Events are private to your schedule',
    icon: Shield,
  },
  {
    value: 'CLOSE_FRIENDS',
    label: 'Close Friends',
    sub: 'Visible to your verified close network',
    icon: Users,
  },
  {
    value: 'EVERY_FRIEND',
    label: 'All Friends',
    sub: 'Visible to anyone on your campus friends list',
    icon: Eye,
  },
]

const STAT_CARDS = [
  { label: 'Posts', value: '12' },
  { label: 'Upvotes', value: '847' },
  { label: 'Events Saved', value: '6' },
]

export default function ProfileView({ user, token, onLogout, onUpdateUser }) {
  const [privacy, setPrivacy] = useState(user?.default_calendar_privacy || 'NO_ONE')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handlePrivacyChange = async (val) => {
    setPrivacy(val)
    setSaving(true)
    setSaved(false)
    try {
      const res = await axios.patch(
        `${API_URL}/api/auth/profile`,
        { default_calendar_privacy: val },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      onUpdateUser(res.data)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (e) {
      console.error('Failed to update privacy:', e)
    } finally {
      setSaving(false)
    }
  }

  const initials =
    user?.name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'TU'

  return (
    <div className="h-full overflow-y-auto px-4 pt-10 pb-24" style={{ backgroundColor: '#0a0a0c' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-zinc-100">Profile</h1>
        <button
          onClick={onLogout}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-zinc-400 hover:text-zinc-200 transition-colors"
          style={{
            backgroundColor: '#141417',
            border: '1px solid #232326',
          }}
        >
          <LogOut size={13} />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Avatar & User Info Card */}
      <div
        className="p-4 rounded-xl mb-3 flex items-center gap-3.5"
        style={{
          backgroundColor: '#141417',
          border: '1px solid #232326',
        }}
      >
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center text-base font-bold text-zinc-100 flex-shrink-0"
          style={{
            backgroundColor: '#1a1a1f',
            border: '1px solid #232326',
          }}
        >
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-base font-semibold text-zinc-100 truncate">{user?.name}</h2>
          <p className="text-xs text-zinc-500 truncate">{user?.email}</p>
          {user?.bio && (
            <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{user.bio}</p>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-2.5 mb-3">
        {STAT_CARDS.map((stat) => (
          <div
            key={stat.label}
            className="p-3 rounded-xl text-center"
            style={{
              backgroundColor: '#141417',
              border: '1px solid #232326',
            }}
          >
            <p className="text-lg font-bold text-zinc-100">{stat.value}</p>
            <p className="text-[11px] text-zinc-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Calendar Privacy Settings Card */}
      <div
        className="p-4 rounded-xl mb-3"
        style={{
          backgroundColor: '#141417',
          border: '1px solid #232326',
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-semibold text-zinc-100 text-sm">Calendar Privacy Default</h3>
            <p className="text-xs text-zinc-500 mt-0.5">Control who sees events you add</p>
          </div>
          <AnimatePresence>
            {saving && <Loader2 size={14} className="animate-spin text-zinc-400" />}
            {saved && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                <Check size={14} className="text-emerald-400" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex flex-col gap-2">
          {PRIVACY_OPTIONS.map((opt) => {
            const isActive = privacy === opt.value
            const Icon = opt.icon
            return (
              <button
                key={opt.value}
                onClick={() => handlePrivacyChange(opt.value)}
                className="flex items-center justify-between p-3 rounded-xl text-left transition-colors cursor-pointer"
                style={{
                  backgroundColor: isActive ? '#1c1c23' : '#141417',
                  border: `1px solid ${isActive ? '#52525b' : '#232326'}`,
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{
                      backgroundColor: '#1a1a1f',
                      border: '1px solid #232326',
                      color: isActive ? '#f4f4f5' : '#71717a',
                    }}
                  >
                    <Icon size={16} />
                  </div>
                  <div>
                    <p
                      className="text-xs font-semibold"
                      style={{ color: isActive ? '#f4f4f5' : '#a1a1aa' }}
                    >
                      {opt.label}
                    </p>
                    <p className="text-[11px] text-zinc-500">{opt.sub}</p>
                  </div>
                </div>
                {isActive && (
                  <div className="w-4 h-4 rounded-full flex items-center justify-center bg-zinc-100 text-zinc-950">
                    <Check size={11} strokeWidth={3} />
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Member Info */}
      <div
        className="p-4 rounded-xl"
        style={{
          backgroundColor: '#141417',
          border: '1px solid #232326',
        }}
      >
        <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-1">
          Campus Affiliation
        </p>
        <p className="text-xs font-semibold text-zinc-200">
          Thapar Institute of Engineering & Technology
        </p>
      </div>
    </div>
  )
}
