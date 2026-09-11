import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bell,
  Search,
  Plus,
  Loader2,
  X,
  ChevronDown,
  CalendarDays,
  CalendarPlus,
  Users,
  MapPin,
  Clock,
  Sparkles,
  CheckCircle2,
} from 'lucide-react'
import { postsApi, eventsApi } from '../api.js'
import FilterPills from '../components/FilterPills.jsx'
import EventCard from '../components/EventCard.jsx'
import StoriesRow from '../components/StoriesRow.jsx'
import SocietyHub from '../components/SocietyHub.jsx'

const CATEGORIES = ['Tech', 'Non-Tech', 'Hackathons', 'Prizes Only', 'Refreshments']
const KNOWN_SOCIETIES = ['CCS', 'Mudra', 'FAP', 'Trident', 'E-Cell', 'Rotaract', 'Quiz Club', 'Aagaaz']
const KNOWN_VENUES = [
  'LHC Auditorium',
  'Nirvana Park',
  'Open Air Theatre (OAT)',
  'EDC Step Building',
  'Main Cafeteria',
  'Sports Ground Complex',
  'Thapar Central Library',
  'F-Block CS Lab 301',
]

export default function FeedView({
  token,
  user,
  savedEvents = [],
  onToggleSaveEvent,
}) {
  const [feedMode, setFeedMode] = useState('society') // 'society' | 'friends'
  const [events, setEvents] = useState([])
  const [filter, setFilter] = useState('All')
  const [loading, setLoading] = useState(true)
  const [selectedSociety, setSelectedSociety] = useState(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [modalMode, setModalMode] = useState('event') // 'event' | 'post'

  // New Event Form State
  const [newEvent, setNewEvent] = useState({
    title: '',
    society_name: 'CCS',
    category: 'Tech',
    venue: 'LHC Auditorium',
    event_date: '',
    max_capacity: 150,
    tagline: '',
    description: '',
  })

  // New Post Form State
  const [newPost, setNewPost] = useState({
    society_name: '',
    category: 'Tech',
    title: '',
    description: '',
  })

  const [submitting, setSubmitting] = useState(false)
  const [publishSuccess, setPublishSuccess] = useState('')

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const params = filter !== 'All' ? { category: filter } : {}
      const data = await eventsApi.getEvents(params)
      setEvents(data)
    } catch (e) {
      console.error('Failed to fetch pulse data:', e)
    } finally {
      setLoading(false)
    }
  }, [filter])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const displayedEvents =
    feedMode === 'friends'
      ? events.filter((e) => e.friends_attending && e.friends_attending.length > 0)
      : events

  const handleCreateEvent = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setPublishSuccess('')
    try {
      const eventDateIso = newEvent.event_date
        ? new Date(newEvent.event_date).toISOString()
        : new Date(Date.now() + 2 * 24 * 3600000).toISOString()

      const payload = {
        title: newEvent.title.trim(),
        society_name: newEvent.society_name.trim() || 'Campus Community',
        category: newEvent.category,
        venue: newEvent.venue.trim() || 'Campus Grounds',
        event_date: eventDateIso,
        max_capacity: Number(newEvent.max_capacity) || 150,
        tagline: newEvent.tagline.trim() || `${newEvent.society_name} Campus Event`,
        description: newEvent.description.trim(),
      }

      const created = await eventsApi.createEvent(payload)
      setPublishSuccess(`"${created.title}" published to live campus feed!`)
      setEvents((prev) => [created, ...prev])
      
      setTimeout(() => {
        setShowCreateModal(false)
        setPublishSuccess('')
        setNewEvent({
          title: '',
          society_name: 'CCS',
          category: 'Tech',
          venue: 'LHC Auditorium',
          event_date: '',
          max_capacity: 150,
          tagline: '',
          description: '',
        })
        fetchData()
      }, 1000)
    } catch (err) {
      console.error('Failed to create event:', err)
    } finally {
      setSubmitting(false)
    }
  }

  const handleCreatePost = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await postsApi.createPost(newPost)
      setShowCreateModal(false)
      setNewPost({ society_name: '', category: 'Tech', title: '', description: '' })
      fetchData()
    } catch (e) {
      console.error('Failed to create post:', e)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="h-full w-full flex flex-col overflow-hidden relative bg-[#09090b]">
      {/* Top Header */}
      <div
        className="flex-shrink-0 px-4 pt-6 pb-2.5 z-20 bg-[#09090b] border-b border-[#27272a]"
      >
        <div className="max-w-xl mx-auto md:max-w-4xl w-full">
          <div className="flex items-center justify-between mb-2.5">
            <div>
              <h1 className="text-xl font-black tracking-tight">
                <span className="logo-gradient-text">Campus</span>
                <span className="text-zinc-100">Pulse</span>
              </h1>
              <p className="text-[11px] text-zinc-500">
                Thapar Institute of Engineering & Technology
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="w-8 h-8 rounded-xl flex items-center justify-center cursor-pointer transition-colors bg-[#121215] border border-[#27272a] text-zinc-400 hover:text-zinc-200"
              >
                <Search size={15} />
              </button>
              <button
                className="w-8 h-8 rounded-xl flex items-center justify-center relative cursor-pointer transition-colors bg-[#121215] border border-[#27272a] text-zinc-400 hover:text-zinc-200"
              >
                <Bell size={15} />
                <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-red-500" />
              </button>
            </div>
          </div>

          {/* Stories Horizontal Row */}
          <div className="mb-2">
            <StoriesRow onSocietyClick={(socName) => setSelectedSociety(socName)} />
          </div>

          {/* Mode Switcher: Society Events / Friends Events */}
          <div className="flex items-center gap-2 mb-2">
            <div
              className="flex-1 p-1 rounded-xl flex items-center bg-[#121215] border border-[#27272a]"
            >
              <button
                type="button"
                onClick={() => setFeedMode('society')}
                className="flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 border-none cursor-pointer transition-colors"
                style={{
                  backgroundColor: feedMode === 'society' ? '#f4f4f5' : 'transparent',
                  color: feedMode === 'society' ? '#09090b' : '#71717a',
                }}
              >
                <CalendarDays size={13} />
                <span>Society Events</span>
              </button>

              <button
                type="button"
                onClick={() => setFeedMode('friends')}
                className="flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 border-none cursor-pointer transition-colors"
                style={{
                  backgroundColor: feedMode === 'friends' ? '#f4f4f5' : 'transparent',
                  color: feedMode === 'friends' ? '#09090b' : '#71717a',
                }}
              >
                <Users size={13} />
                <span>Friends Events</span>
              </button>
            </div>
          </div>

          {/* Category Filter Pills */}
          <FilterPills active={filter} onChange={setFilter} />
        </div>
      </div>

      {/* Feed Scroll Content */}
      <div className="flex-1 overflow-y-auto px-4 pt-3 pb-24">
        <div className="max-w-xl mx-auto md:max-w-4xl w-full md:grid md:grid-cols-12 md:gap-6">
          {/* Main Feed Column */}
          <div className="md:col-span-8">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-48 gap-2.5">
                <Loader2 size={24} className="animate-spin text-zinc-500" />
                <p className="text-xs text-zinc-500">Loading campus pulse...</p>
              </div>
            ) : displayedEvents.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 gap-2 text-center bg-[#121215] border border-[#27272a] rounded-xl p-6">
                <p className="text-sm font-medium text-zinc-300">
                  {feedMode === 'friends' ? 'No friends events found' : 'No society events found'}
                </p>
                <p className="text-xs text-zinc-500">
                  {feedMode === 'friends'
                    ? 'Invite classmates or check back when friends RSVP to campus events!'
                    : 'Check back later for upcoming society events or create one now.'}
                </p>
              </div>
            ) : (
              <div>
                {displayedEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onUpdate={fetchData}
                    savedEvents={savedEvents}
                    onToggleSaveEvent={onToggleSaveEvent}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Desktop Sidebar */}
          <div className="hidden md:flex md:col-span-4 flex-col gap-4 sticky top-0 self-start">
            {/* Quick Compose Card */}
            <div className="bg-[#121215] border border-[#27272a] rounded-xl p-4">
              <div className="flex items-center gap-1.5 mb-1">
                <Sparkles size={15} className="text-amber-400" />
                <h3 className="text-sm font-bold text-zinc-100">Publish to Campus</h3>
              </div>
              <p className="text-xs text-zinc-500 mb-3">Host a workshop, hackathon, or cultural fest.</p>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => {
                    setModalMode('event')
                    setShowCreateModal(true)
                  }}
                  className="btn-primary w-full py-2.5 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CalendarPlus size={15} />
                  <span>Create Campus Event</span>
                </button>
                <button
                  onClick={() => {
                    setModalMode('post')
                    setShowCreateModal(true)
                  }}
                  className="btn-secondary w-full py-2 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Plus size={14} />
                  <span>New Discussion Post</span>
                </button>
              </div>
            </div>

            {/* Quick Campus Stats Card */}
            <div className="bg-[#121215] border border-[#27272a] rounded-xl p-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
                Campus Highlights
              </h3>
              <div className="space-y-2.5 text-xs text-zinc-300">
                <div className="flex justify-between items-center pb-2 border-b border-[#27272a]">
                  <span className="text-zinc-500">Active Societies</span>
                  <span className="font-semibold text-zinc-200">28 Registered</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-[#27272a]">
                  <span className="text-zinc-500">Upcoming Hackathons</span>
                  <span className="font-semibold text-zinc-200">HackThapar '25</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-500">Campus Status</span>
                  <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Semester in Session
                  </span>
                </div>
              </div>
            </div>

            {/* Featured Society Hubs */}
            <div className="bg-[#121215] border border-[#27272a] rounded-xl p-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
                Featured Hubs
              </h3>
              <div className="flex flex-col gap-2">
                {[
                  { name: 'CCS', sub: 'Computer Club Society', members: '2.8k' },
                  { name: 'Mudra', sub: 'Music Society', members: '1.9k' },
                  { name: 'Trident', sub: 'Robotics & Hardware', members: '1.6k' },
                ].map((soc) => (
                  <button
                    key={soc.name}
                    onClick={() => setSelectedSociety(soc.name)}
                    className="flex items-center justify-between p-2 rounded-lg bg-[#18181b] border border-[#27272a] hover:border-[#3f3f46] text-left transition-colors cursor-pointer"
                  >
                    <div>
                      <p className="text-xs font-semibold text-zinc-200">{soc.name}</p>
                      <p className="text-[10px] text-zinc-500">{soc.sub}</p>
                    </div>
                    <span className="text-[10px] font-mono text-zinc-400">{soc.members}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAB on mobile / tablet */}
      <button
        className="btn-primary md:hidden absolute right-4 bottom-20 w-12 h-12 rounded-xl flex items-center justify-center z-20 shadow-lg cursor-pointer"
        onClick={() => {
          setModalMode('event')
          setShowCreateModal(true)
        }}
        title="Create Event"
      >
        <Plus size={20} strokeWidth={2.5} />
      </button>

      {/* Society Hub Fullscreen Overlay */}
      {selectedSociety && (
        <SocietyHub
          societyName={selectedSociety}
          onClose={() => setSelectedSociety(null)}
          savedEvents={savedEvents}
          onToggleSaveEvent={onToggleSaveEvent}
        />
      )}

      {/* Create Event / Post Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <>
            <motion.div
              className="fixed inset-0 z-40"
              style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCreateModal(false)}
            />
            <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center pointer-events-none p-0 md:p-4">
              <motion.div
                className="w-full max-w-xl md:max-w-lg p-5 rounded-t-2xl md:rounded-2xl pointer-events-auto bg-[#121215] border border-[#27272a] max-h-[90vh] overflow-y-auto shadow-2xl"
                initial={{ y: '100%', opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: '100%', opacity: 0 }}
                transition={{ type: 'spring', stiffness: 450, damping: 35 }}
              >
                <div className="drag-handle md:hidden" />
                
                {/* Modal Header */}
                <div className="flex items-center justify-between mb-3.5">
                  <div className="flex items-center gap-2">
                    <CalendarPlus size={18} className="text-zinc-300" />
                    <h2 className="text-base font-bold text-zinc-100">
                      {modalMode === 'event' ? 'Create Campus Event' : 'Create Discussion Post'}
                    </h2>
                  </div>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 transition-colors bg-[#18181b] border border-[#27272a] cursor-pointer"
                  >
                    <X size={15} />
                  </button>
                </div>

                {/* Modal Mode Selector */}
                <div className="p-1 rounded-xl flex items-center bg-[#18181b] border border-[#27272a] mb-4">
                  <button
                    type="button"
                    onClick={() => setModalMode('event')}
                    className="flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 border-none cursor-pointer transition-colors"
                    style={{
                      backgroundColor: modalMode === 'event' ? '#f4f4f5' : 'transparent',
                      color: modalMode === 'event' ? '#09090b' : '#71717a',
                    }}
                  >
                    <CalendarPlus size={13} />
                    <span>Event Details</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalMode('post')}
                    className="flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 border-none cursor-pointer transition-colors"
                    style={{
                      backgroundColor: modalMode === 'post' ? '#f4f4f5' : 'transparent',
                      color: modalMode === 'post' ? '#09090b' : '#71717a',
                    }}
                  >
                    <Plus size={13} />
                    <span>Quick Post</span>
                  </button>
                </div>

                {publishSuccess && (
                  <div className="p-3 mb-3 rounded-xl bg-emerald-950/50 border border-emerald-800 text-emerald-400 text-xs flex items-center gap-2">
                    <CheckCircle2 size={16} />
                    <span>{publishSuccess}</span>
                  </div>
                )}

                {/* Event Creation Form */}
                {modalMode === 'event' ? (
                  <form onSubmit={handleCreateEvent} className="flex flex-col gap-3">
                    {/* Event Title */}
                    <div>
                      <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block mb-1">
                        Event Title *
                      </label>
                      <input
                        className="input-standard"
                        placeholder="e.g. HackThapar '25 or Live Acoustic Jam"
                        value={newEvent.title}
                        onChange={(e) => setNewEvent((p) => ({ ...p, title: e.target.value }))}
                        required
                      />
                    </div>

                    {/* Society & Category Row */}
                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block mb-1">
                          Host Society *
                        </label>
                        <div className="relative">
                          <select
                            className="input-standard appearance-none pr-8 text-xs"
                            value={newEvent.society_name}
                            onChange={(e) => setNewEvent((p) => ({ ...p, society_name: e.target.value }))}
                          >
                            {KNOWN_SOCIETIES.map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                            <option value="Campus Community">Other / Independent</option>
                          </select>
                          <ChevronDown
                            size={14}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block mb-1">
                          Category *
                        </label>
                        <div className="relative">
                          <select
                            className="input-standard appearance-none pr-8 text-xs"
                            value={newEvent.category}
                            onChange={(e) => setNewEvent((p) => ({ ...p, category: e.target.value }))}
                          >
                            {CATEGORIES.map((c) => (
                              <option key={c} value={c}>{c}</option>
                            ))}
                          </select>
                          <ChevronDown
                            size={14}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Venue & Capacity Row */}
                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block mb-1">
                          Venue / Location
                        </label>
                        <div className="relative">
                          <select
                            className="input-standard appearance-none pr-8 text-xs"
                            value={newEvent.venue}
                            onChange={(e) => setNewEvent((p) => ({ ...p, venue: e.target.value }))}
                          >
                            {KNOWN_VENUES.map((v) => (
                              <option key={v} value={v}>{v}</option>
                            ))}
                          </select>
                          <ChevronDown
                            size={14}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block mb-1">
                          Capacity
                        </label>
                        <input
                          type="number"
                          min="10"
                          max="2000"
                          className="input-standard text-xs"
                          placeholder="150"
                          value={newEvent.max_capacity}
                          onChange={(e) => setNewEvent((p) => ({ ...p, max_capacity: e.target.value }))}
                        />
                      </div>
                    </div>

                    {/* Date & Time Picker */}
                    <div>
                      <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block mb-1">
                        Event Date & Time *
                      </label>
                      <input
                        type="datetime-local"
                        className="input-standard text-xs"
                        value={newEvent.event_date}
                        onChange={(e) => setNewEvent((p) => ({ ...p, event_date: e.target.value }))}
                        required
                      />
                    </div>

                    {/* Tagline */}
                    <div>
                      <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block mb-1">
                        Tagline / Subtitle
                      </label>
                      <input
                        className="input-standard text-xs"
                        placeholder="e.g. Innovate. Build. Deploy."
                        value={newEvent.tagline}
                        onChange={(e) => setNewEvent((p) => ({ ...p, tagline: e.target.value }))}
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block mb-1">
                        Event Description *
                      </label>
                      <textarea
                        className="input-standard resize-none text-xs"
                        rows={3}
                        placeholder="Detailed schedule, eligibility, prizes, or refreshments info..."
                        value={newEvent.description}
                        onChange={(e) => setNewEvent((p) => ({ ...p, description: e.target.value }))}
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="btn-primary py-3 text-xs font-bold mt-1 flex items-center justify-center gap-2 cursor-pointer"
                      disabled={submitting}
                    >
                      {submitting ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <>
                          <Sparkles size={15} />
                          <span>Publish Event to Live Feed</span>
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  /* Post Creation Form */
                  <form onSubmit={handleCreatePost} className="flex flex-col gap-3">
                    <input
                      className="input-standard text-xs"
                      placeholder="Society or organization (e.g. CCS, Mudra)"
                      value={newPost.society_name}
                      onChange={(e) => setNewPost((p) => ({ ...p, society_name: e.target.value }))}
                      required
                    />

                    <div className="relative">
                      <select
                        className="input-standard appearance-none pr-10 text-xs"
                        value={newPost.category}
                        onChange={(e) => setNewPost((p) => ({ ...p, category: e.target.value }))}
                      >
                        {CATEGORIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        size={14}
                        className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500"
                      />
                    </div>

                    <input
                      className="input-standard text-xs"
                      placeholder="Post title"
                      value={newPost.title}
                      onChange={(e) => setNewPost((p) => ({ ...p, title: e.target.value }))}
                      required
                    />

                    <textarea
                      className="input-standard resize-none text-xs"
                      rows={4}
                      placeholder="What's happening on campus?"
                      value={newPost.description}
                      onChange={(e) => setNewPost((p) => ({ ...p, description: e.target.value }))}
                      required
                    />

                    <button
                      type="submit"
                      className="btn-primary py-3 text-xs font-bold mt-1 flex items-center justify-center gap-2 cursor-pointer"
                      disabled={submitting}
                    >
                      {submitting ? <Loader2 size={16} className="animate-spin" /> : 'Publish Post'}
                    </button>
                  </form>
                )}
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

