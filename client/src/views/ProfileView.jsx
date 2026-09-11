import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LogOut,
  Eye,
  Users,
  Shield,
  Loader2,
  Check,
  Bookmark,
} from 'lucide-react'
import { authApi } from '../api.js'
import EventCard from '../components/EventCard.jsx'

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

export default function ProfileView({
  user,
  token,
  savedEvents = [],
  onToggleSaveEvent,
  onLogout,
  onUpdateUser,
}) {
  const [activeTab, setActiveTab] = useState('saved') // 'saved' | 'privacy'
  const [privacy, setPrivacy] = useState(user?.default_calendar_privacy || 'NO_ONE')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handlePrivacyChange = async (val) => {
    setPrivacy(val)
    setSaving(true)
    setSaved(false)
    try {
      const updated = await authApi.updateProfile({ default_calendar_privacy: val }, token)
      onUpdateUser(updated)
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

  const statCards = [
    { label: 'Posts', value: '12' },
    { label: 'Upvotes', value: '847' },
    { label: 'Events Saved', value: String(savedEvents.length), action: () => setActiveTab('saved') },
  ]

  return (
    <div className="h-full w-full overflow-y-auto px-4 pt-6 pb-24 bg-[#09090b]">
      <div className="max-w-xl mx-auto md:max-w-4xl w-full md:grid md:grid-cols-12 md:gap-6">
        {/* Left Column: Profile Card, Stats & Sign Out */}
        <div className="md:col-span-5 space-y-3.5 mb-3.5 md:mb-0">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-zinc-100">Profile</h1>
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-zinc-400 hover:text-zinc-200 transition-colors bg-[#121215] border border-[#27272a] hover:border-[#3f3f46] cursor-pointer"
            >
              <LogOut size={13} />
              <span>Sign Out</span>
            </button>
          </div>

          {/* Avatar & User Info Card */}
          <div
            className="p-4 rounded-xl bg-[#121215] border border-[#27272a] flex items-center gap-3.5"
          >
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center text-base font-bold text-zinc-100 flex-shrink-0 bg-[#18181b] border border-[#27272a]"
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
          <div className="grid grid-cols-3 gap-2.5">
            {statCards.map((stat) => (
              <button
                key={stat.label}
                onClick={stat.action}
                type="button"
                className={`p-3 rounded-xl text-center bg-[#121215] border transition-colors ${
                  stat.action ? 'cursor-pointer hover:border-[#3f3f46]' : 'cursor-default'
                } ${activeTab === 'saved' && stat.label === 'Events Saved' ? 'border-zinc-500' : 'border-[#27272a]'}`}
              >
                <p className="text-lg font-bold text-zinc-100">{stat.value}</p>
                <p className="text-[11px] text-zinc-500 mt-0.5">{stat.label}</p>
              </button>
            ))}
          </div>

          {/* Member Info */}
          <div
            className="p-4 rounded-xl bg-[#121215] border border-[#27272a]"
          >
            <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-1">
              Campus Affiliation
            </p>
            <p className="text-xs font-semibold text-zinc-200">
              Thapar Institute of Engineering & Technology
            </p>
          </div>
        </div>

        {/* Right Column: Tab Switcher & Content */}
        <div className="md:col-span-7 space-y-3.5">
          {/* Tab Navigation */}
          <div className="p-1 rounded-xl flex items-center bg-[#121215] border border-[#27272a]">
            <button
              type="button"
              onClick={() => setActiveTab('saved')}
              className="flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 border-none cursor-pointer transition-colors"
              style={{
                backgroundColor: activeTab === 'saved' ? '#f4f4f5' : 'transparent',
                color: activeTab === 'saved' ? '#09090b' : '#71717a',
              }}
            >
              <Bookmark size={13} className={activeTab === 'saved' ? 'fill-current' : ''} />
              <span>Saved Events</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  activeTab === 'saved' ? 'bg-zinc-800 text-zinc-100' : 'bg-[#27272a] text-zinc-400'
                }`}
              >
                {savedEvents.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('privacy')}
              className="flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 border-none cursor-pointer transition-colors"
              style={{
                backgroundColor: activeTab === 'privacy' ? '#f4f4f5' : 'transparent',
                color: activeTab === 'privacy' ? '#09090b' : '#71717a',
              }}
            >
              <Shield size={13} />
              <span>Calendar Privacy</span>
            </button>
          </div>

          {/* Tab 1: Saved Events List */}
          {activeTab === 'saved' && (
            <div>
              {savedEvents.length === 0 ? (
                <div className="p-8 rounded-xl text-center bg-[#121215] border border-[#27272a] flex flex-col items-center justify-center gap-2">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#18181b] border border-[#27272a] text-zinc-500 mb-1">
                    <Bookmark size={18} />
                  </div>
                  <p className="text-sm font-semibold text-zinc-200">No saved events yet</p>
                  <p className="text-xs text-zinc-500 max-w-xs leading-relaxed">
                    Bookmark interesting events from the campus feed to keep track of upcoming dates and workshops.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                      Bookmarked Events ({savedEvents.length})
                    </span>
                  </div>
                  {savedEvents.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      isSaved={true}
                      onToggleSave={() => onToggleSaveEvent(event)}
                      savedEvents={savedEvents}
                      onToggleSaveEvent={onToggleSaveEvent}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Calendar Privacy Settings */}
          {activeTab === 'privacy' && (
            <div
              className="p-4 md:p-5 rounded-xl bg-[#121215] border border-[#27272a]"
            >
              <div className="flex items-center justify-between mb-3.5">
                <div>
                  <h3 className="font-semibold text-zinc-100 text-sm">Calendar Privacy Default</h3>
                  <p className="text-xs text-zinc-500 mt-0.5">Control who sees events you add to schedule</p>
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

              <div className="flex flex-col gap-2.5">
                {PRIVACY_OPTIONS.map((opt) => {
                  const isActive = privacy === opt.value
                  const Icon = opt.icon
                  return (
                    <button
                      key={opt.value}
                      onClick={() => handlePrivacyChange(opt.value)}
                      className="flex items-center justify-between p-3 rounded-xl text-left transition-colors cursor-pointer"
                      style={{
                        backgroundColor: isActive ? '#18181b' : '#121215',
                        border: `1px solid ${isActive ? '#52525b' : '#27272a'}`,
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{
                            backgroundColor: '#18181b',
                            border: '1px solid #27272a',
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
          )}
        </div>
      </div>
    </div>
  )
}
