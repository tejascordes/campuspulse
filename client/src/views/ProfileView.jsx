import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LogOut,
  Eye,
  Users,
  Shield,
  Loader2,
  Check,
  Bookmark,
  UserPlus,
  Trash2,
  Star,
  Search,
  Sparkles,
  GraduationCap,
} from 'lucide-react'
import { authApi, friendsApi } from '../api.js'
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

const SUGGESTED_CONNECTIONS = [
  { name: 'Arnav Singla', email: 'arnav.s@thapar.edu', branch: "COE '26", bio: 'Web Dev & Hackathons' },
  { name: 'Mehak Preet', email: 'mehak.p@thapar.edu', branch: "ENC '25", bio: 'Mudra Band Lead' },
  { name: 'Divyansh Mehta', email: 'divyansh.m@thapar.edu', branch: "CSBS '26", bio: 'Trident Robotics' },
  { name: 'Sanya Goyal', email: 'sanya.g@thapar.edu', branch: "ELE '25", bio: 'FAP Photography' },
]

export default function ProfileView({
  user,
  token,
  savedEvents = [],
  onToggleSaveEvent,
  onLogout,
  onUpdateUser,
}) {
  const [activeTab, setActiveTab] = useState('saved') // 'saved' | 'friends' | 'privacy'
  const [privacy, setPrivacy] = useState(user?.default_calendar_privacy || 'NO_ONE')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  // Friends Network State
  const [friends, setFriends] = useState([])
  const [loadingFriends, setLoadingFriends] = useState(true)
  const [friendInput, setFriendInput] = useState('')
  const [isCloseFriendCheck, setIsCloseFriendCheck] = useState(false)
  const [addingFriend, setAddingFriend] = useState(false)
  const [friendError, setFriendError] = useState('')
  const [friendSuccess, setFriendSuccess] = useState('')
  const [friendFilter, setFriendFilter] = useState('')

  const fetchFriends = async () => {
    try {
      setLoadingFriends(true)
      const data = await friendsApi.getFriends()
      setFriends(data || [])
    } catch (err) {
      console.error('Failed to load friends:', err)
    } finally {
      setLoadingFriends(false)
    }
  }

  useEffect(() => {
    fetchFriends()
  }, [])

  const handleAddFriend = async (e, customData = null) => {
    if (e) e.preventDefault()
    const targetQuery = customData?.query || friendInput.trim()
    if (!targetQuery && !customData) return

    setAddingFriend(true)
    setFriendError('')
    setFriendSuccess('')

    try {
      const isEmail = targetQuery.includes('@')
      const payload = {
        email: customData?.email || (isEmail ? targetQuery : undefined),
        username: customData?.name || (!isEmail ? targetQuery : undefined),
        is_close_friend: customData ? Boolean(customData.is_close_friend) : isCloseFriendCheck,
      }

      const newFriend = await friendsApi.addFriend(payload)
      setFriends((prev) => {
        const filtered = prev.filter((f) => f.id !== newFriend.id && f.email !== newFriend.email)
        return [newFriend, ...filtered]
      })
      setFriendInput('')
      setIsCloseFriendCheck(false)
      setFriendSuccess(`Connected with ${newFriend.name}!`)
      setTimeout(() => setFriendSuccess(''), 3000)
    } catch (err) {
      console.error('Failed to add friend:', err)
      setFriendError(err.response?.data?.detail || 'Could not connect with friend. Check details.')
    } finally {
      setAddingFriend(false)
    }
  }

  const handleRemoveFriend = async (friendId) => {
    try {
      await friendsApi.removeFriend(friendId)
      setFriends((prev) => prev.filter((f) => f.id !== friendId))
    } catch (err) {
      console.error('Failed to remove friend:', err)
    }
  }

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
    { label: 'Network', value: String(friends.length), action: () => setActiveTab('friends') },
    { label: 'Events Saved', value: String(savedEvents.length), action: () => setActiveTab('saved') },
    { label: 'Campus Upvotes', value: '847', action: null },
  ]

  const filteredFriendsList = friends.filter((f) => {
    if (!friendFilter) return true
    const q = friendFilter.toLowerCase()
    return (
      f.name?.toLowerCase().includes(q) ||
      f.email?.toLowerCase().includes(q) ||
      f.branch?.toLowerCase().includes(q)
    )
  })

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
                } ${
                  (activeTab === 'saved' && stat.label === 'Events Saved') ||
                  (activeTab === 'friends' && stat.label === 'Network')
                    ? 'border-zinc-500 bg-[#18181b]'
                    : 'border-[#27272a]'
                }`}
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
            <div className="flex items-center gap-2">
              <GraduationCap size={15} className="text-zinc-400" />
              <p className="text-xs font-semibold text-zinc-200">
                Thapar Institute of Engineering & Technology
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Tab Switcher & Content */}
        <div className="md:col-span-7 space-y-3.5">
          {/* Tab Navigation */}
          <div className="p-1 rounded-xl flex items-center bg-[#121215] border border-[#27272a] gap-1">
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
              <span>Saved</span>
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
              onClick={() => setActiveTab('friends')}
              className="flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 border-none cursor-pointer transition-colors"
              style={{
                backgroundColor: activeTab === 'friends' ? '#f4f4f5' : 'transparent',
                color: activeTab === 'friends' ? '#09090b' : '#71717a',
              }}
            >
              <Users size={13} />
              <span>Friends</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  activeTab === 'friends' ? 'bg-zinc-800 text-zinc-100' : 'bg-[#27272a] text-zinc-400'
                }`}
              >
                {friends.length}
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
              <span>Privacy</span>
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

          {/* Tab 2: Friends Network View */}
          {activeTab === 'friends' && (
            <div className="space-y-4">
              {/* Add Friend Card */}
              <div className="p-4 rounded-xl bg-[#121215] border border-[#27272a]">
                <div className="flex items-center gap-2 mb-2.5">
                  <UserPlus size={16} className="text-zinc-300" />
                  <h3 className="font-semibold text-zinc-100 text-sm">Add Friend / Connect</h3>
                </div>
                <p className="text-xs text-zinc-500 mb-3">
                  Enter a classmate's name, email, or campus ID to connect and share event schedules.
                </p>

                <form onSubmit={handleAddFriend} className="flex flex-col gap-2.5">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        placeholder="e.g. kabir.s@thapar.edu or Rohan Verma"
                        value={friendInput}
                        onChange={(e) => setFriendInput(e.target.value)}
                        className="input-standard pr-8 text-xs py-2.5"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={addingFriend || !friendInput.trim()}
                      className="btn-primary px-4 text-xs font-semibold flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer"
                    >
                      {addingFriend ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <>
                          <UserPlus size={14} />
                          <span>Add Friend</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 text-xs text-zinc-400 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={isCloseFriendCheck}
                        onChange={(e) => setIsCloseFriendCheck(e.target.checked)}
                        className="rounded border-[#27272a] bg-[#18181b] text-indigo-600 focus:ring-0 w-3.5 h-3.5 cursor-pointer"
                      />
                      <span>Mark as Close Friend (share private schedule)</span>
                    </label>
                  </div>

                  {friendSuccess && (
                    <div className="p-2 rounded-lg bg-emerald-950/40 border border-emerald-800/60 text-emerald-400 text-xs flex items-center gap-1.5">
                      <Check size={13} />
                      <span>{friendSuccess}</span>
                    </div>
                  )}

                  {friendError && (
                    <div className="p-2 rounded-lg bg-rose-950/40 border border-rose-800/60 text-rose-400 text-xs">
                      {friendError}
                    </div>
                  )}
                </form>
              </div>

              {/* Suggested Classmates Quick Connect */}
              <div className="p-4 rounded-xl bg-[#121215] border border-[#27272a]">
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-1.5">
                    <Sparkles size={14} className="text-amber-400" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                      Suggested Classmates
                    </h4>
                  </div>
                  <span className="text-[11px] text-zinc-500">Quick Connect</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {SUGGESTED_CONNECTIONS.map((sug) => {
                    const isAlreadyFriend = friends.some(
                      (f) => f.email?.toLowerCase() === sug.email.toLowerCase() || f.name?.toLowerCase() === sug.name.toLowerCase()
                    )
                    return (
                      <div
                        key={sug.email}
                        className="p-2.5 rounded-lg bg-[#18181b] border border-[#27272a] flex items-center justify-between gap-2"
                      >
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-zinc-200 truncate">{sug.name}</p>
                          <p className="text-[10px] text-zinc-500 truncate">{sug.branch} • {sug.bio}</p>
                        </div>
                        <button
                          type="button"
                          disabled={isAlreadyFriend || addingFriend}
                          onClick={() => handleAddFriend(null, { name: sug.name, email: sug.email, is_close_friend: false })}
                          className={`text-[11px] font-medium px-2.5 py-1 rounded-md transition-colors cursor-pointer flex-shrink-0 ${
                            isAlreadyFriend
                              ? 'bg-[#27272a] text-zinc-500 cursor-default'
                              : 'bg-zinc-100 text-zinc-950 hover:bg-zinc-200 font-semibold'
                          }`}
                        >
                          {isAlreadyFriend ? 'Connected' : '+ Connect'}
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Friend List */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between px-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Your Friends ({friends.length})
                  </span>
                  {friends.length > 3 && (
                    <div className="relative w-36">
                      <input
                        type="text"
                        placeholder="Filter friends..."
                        value={friendFilter}
                        onChange={(e) => setFriendFilter(e.target.value)}
                        className="w-full bg-[#18181b] border border-[#27272a] rounded-lg px-2 py-1 text-[11px] text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
                      />
                    </div>
                  )}
                </div>

                {loadingFriends ? (
                  <div className="p-8 rounded-xl text-center bg-[#121215] border border-[#27272a] flex flex-col items-center justify-center gap-2">
                    <Loader2 size={20} className="animate-spin text-zinc-500" />
                    <p className="text-xs text-zinc-500">Loading campus network...</p>
                  </div>
                ) : filteredFriendsList.length === 0 ? (
                  <div className="p-8 rounded-xl text-center bg-[#121215] border border-[#27272a] flex flex-col items-center justify-center gap-2">
                    <Users size={20} className="text-zinc-500 mb-1" />
                    <p className="text-sm font-semibold text-zinc-200">
                      {friendFilter ? 'No matching friends found' : 'No friends added yet'}
                    </p>
                    <p className="text-xs text-zinc-500 max-w-xs leading-relaxed">
                      Connect with your campus classmates above to see each other's schedules and RSVP'd events.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredFriendsList.map((friend) => {
                      const friendInitials = friend.name
                        ?.split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()
                        .slice(0, 2) || 'TU'

                      return (
                        <div
                          key={friend.id}
                          className="p-3 rounded-xl bg-[#121215] border border-[#27272a] flex items-center justify-between gap-3 hover:border-[#3f3f46] transition-colors"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-zinc-200 bg-[#18181b] border border-[#27272a] flex-shrink-0">
                              {friendInitials}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <p className="text-xs font-semibold text-zinc-100 truncate">
                                  {friend.name}
                                </p>
                                {friend.is_close_friend && (
                                  <span className="flex items-center gap-0.5 text-[10px] font-medium px-1.5 py-0.2 rounded bg-indigo-950/60 text-indigo-400 border border-indigo-800/50">
                                    <Star size={9} className="fill-indigo-400" />
                                    Close Friend
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-zinc-500 truncate">
                                {friend.branch || "COE '26"} • {friend.email}
                              </p>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemoveFriend(friend.id)}
                            className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-950/20 border border-transparent hover:border-rose-900/40 transition-colors cursor-pointer"
                            title="Remove friend connection"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab 3: Calendar Privacy Settings */}
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

