import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Plus,
  Loader2,
  X,
  ChevronDown,
  Layers,
  CalendarDays,
  Bell,
} from 'lucide-react'
import { postsApi, eventsApi } from '../api.js'
import FilterPills from '../components/FilterPills.jsx'
import PostCard from '../components/PostCard.jsx'
import EventCard from '../components/EventCard.jsx'
import StoriesRow from '../components/StoriesRow.jsx'
import SocietyHub from '../components/SocietyHub.jsx'

const CATEGORIES = ['Tech', 'Non-Tech', 'Hackathons', 'Prizes Only', 'Refreshments']

export default function FeedView({ token: _token, user: _user }) {
  const [feedMode, setFeedMode] = useState('posts') // 'posts' | 'events'
  const [posts, setPosts] = useState([])
  const [events, setEvents] = useState([])
  const [filter, setFilter] = useState('All')
  const [loading, setLoading] = useState(true)
  const [selectedSociety, setSelectedSociety] = useState(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newPost, setNewPost] = useState({
    society_name: '',
    category: 'Tech',
    title: '',
    description: '',
  })
  const [submitting, setSubmitting] = useState(false)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const params = filter !== 'All' ? { category: filter } : {}
      if (feedMode === 'posts') {
        const data = await postsApi.getPosts(params)
        setPosts(data)
      } else {
        const data = await eventsApi.getEvents(params)
        setEvents(data)
      }
    } catch (e) {
      console.error('Failed to fetch pulse data:', e)
    } finally {
      setLoading(false)
    }
  }, [filter, feedMode])

  useEffect(() => {
    fetchData()
  }, [fetchData])

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
    <div className="h-full w-full flex flex-col overflow-hidden relative bg-white" style={{ backgroundColor: '#FFFFFF' }}>

      {/* ── Top Header (Airbnb style) ── */}
      <div
        style={{
          flexShrink: 0,
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #DDDDDD',
          zIndex: 20,
        }}
      >
        <div style={{ maxWidth: '56rem', margin: '0 auto', padding: '14px 16px 0' }}>

          {/* Row 1: Logo + notification bell */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 900, letterSpacing: '-0.03em', margin: 0, lineHeight: 1 }}>
                <span className="logo-gradient-text">Campus</span>
                <span style={{ color: '#222222' }}>Pulse</span>
              </h1>
              <p style={{ fontSize: 11, color: '#717171', margin: '3px 0 0', fontWeight: 500 }}>
                Thapar Institute of Engineering &amp; Technology
              </p>
            </div>
            <button
              style={{
                width: 38,
                height: 38,
                borderRadius: '9999px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                border: '1px solid #DDDDDD',
                backgroundColor: '#FFFFFF',
                color: '#222222',
                position: 'relative',
                boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
              }}
            >
              <Bell size={16} />
              <span
                style={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  width: 7,
                  height: 7,
                  borderRadius: '9999px',
                  backgroundColor: '#FF385C',
                  border: '1.5px solid #FFFFFF',
                }}
              />
            </button>
          </div>

          {/* Row 2: Airbnb search pill */}
          <button
            onClick={() => setShowCreateModal(true)}
            className="search-pill"
            style={{ width: '100%', marginBottom: 12, border: '1px solid #DDDDDD', backgroundColor: '#FFFFFF' }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '9999px',
                backgroundColor: '#FF385C',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Search size={15} style={{ color: '#FFFFFF' }} />
            </div>
            <div style={{ textAlign: 'left', flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#222222' }}>Search announcements…</div>
              <div style={{ fontSize: 11, color: '#717171', fontWeight: 500 }}>Societies · Events · Hackathons</div>
            </div>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: '9999px',
                border: '1px solid #DDDDDD',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Plus size={13} style={{ color: '#222222' }} />
            </div>
          </button>

          {/* Row 3: Feed Mode tabs — 2px solid #222222 underline (Airbnb's exact style) */}
          <div
            style={{
              display: 'flex',
              borderBottom: '1px solid #DDDDDD',
              gap: 0,
            }}
          >
            {[
              { mode: 'posts', label: 'Campus Buzz', icon: Layers },
              { mode: 'events', label: 'Society Events', icon: CalendarDays },
            ].map(({ mode, label, icon: Icon }) => (
              <button
                key={mode}
                type="button"
                onClick={() => setFeedMode(mode)}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  paddingBottom: 12,
                  paddingTop: 4,
                  fontSize: 13,
                  fontWeight: feedMode === mode ? 700 : 500,
                  color: feedMode === mode ? '#222222' : '#717171',
                  background: 'none',
                  border: 'none',
                  borderBottom: feedMode === mode ? '2px solid #222222' : '2px solid transparent',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  marginBottom: -1,
                  letterSpacing: '-0.01em',
                }}
              >
                <Icon size={14} />
                <span>{label}</span>
              </button>
            ))}
          </div>

          {/* Row 4: Category filter pills */}
          <FilterPills active={filter} onChange={setFilter} />
        </div>
      </div>

      {/* ── Stories Row ── */}
      <div style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #DDDDDD', flexShrink: 0 }}>
        <div style={{ maxWidth: '56rem', margin: '0 auto', padding: '0 16px' }}>
          <StoriesRow onSocietyClick={(socName) => setSelectedSociety(socName)} />
        </div>
      </div>

      {/* ── Feed Scroll Content ── */}
      <div className="flex-1 overflow-y-auto bg-white" style={{ padding: '16px 16px 96px', backgroundColor: '#FFFFFF' }}>
        <div
          style={{ maxWidth: '56rem', margin: '0 auto', width: '100%' }}
          className="md:grid md:grid-cols-12 md:gap-6"
        >
          {/* Main Feed Column */}
          <div className="md:col-span-8">
            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 200, gap: 10 }}>
                <Loader2 size={24} className="animate-spin" style={{ color: '#FF385C' }} />
                <p style={{ fontSize: 13, color: '#717171' }}>Loading campus pulse…</p>
              </div>
            ) : feedMode === 'posts' ? (
              posts.length === 0 ? (
                <div
                  className="surface-card"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: 200,
                    gap: 8,
                    textAlign: 'center',
                    border: '1px solid #DDDDDD',
                    backgroundColor: '#FFFFFF',
                  }}
                >
                  <p style={{ fontSize: 14, fontWeight: 700, color: '#222222' }}>No posts in this category</p>
                  <p style={{ fontSize: 12, color: '#717171' }}>Be the first to post something exciting!</p>
                </div>
              ) : (
                <div>
                  {posts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              )
            ) : events.length === 0 ? (
              <div
                className="surface-card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 200,
                  gap: 8,
                  textAlign: 'center',
                  border: '1px solid #DDDDDD',
                  backgroundColor: '#FFFFFF',
                }}
              >
                <p style={{ fontSize: 14, fontWeight: 700, color: '#222222' }}>No events found</p>
                <p style={{ fontSize: 12, color: '#717171' }}>Check back later for upcoming society events.</p>
              </div>
            ) : (
              <div>
                {events.map((event) => (
                  <EventCard key={event.id} event={event} onUpdate={fetchData} />
                ))}
              </div>
            )}
          </div>

          {/* Desktop Sidebar */}
          <div className="hidden md:flex md:col-span-4 flex-col gap-4 sticky top-0 self-start">
            {/* Create Pulse Card */}
            <div
              className="surface-card"
              style={{ padding: 20, border: '1px solid #DDDDDD', backgroundColor: '#FFFFFF' }}
            >
              <h3 style={{ fontSize: 15, fontWeight: 800, color: '#222222', margin: '0 0 4px', letterSpacing: '-0.01em' }}>
                Create Pulse
              </h3>
              <p style={{ fontSize: 12, color: '#717171', margin: '0 0 14px' }}>
                Broadcast announcements or society updates.
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn-primary"
                style={{ width: '100%', padding: '12px', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}
              >
                <Plus size={15} />
                <span>New Campus Post</span>
              </button>
            </div>

            {/* Campus Highlights (#F7F7F7 stat surface panel) */}
            <div className="surface-card" style={{ padding: 20, border: '1px solid #DDDDDD', backgroundColor: '#F7F7F7' }}>
              <h3 style={{ fontSize: 11, fontWeight: 800, color: '#717171', textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 14px' }}>
                Campus Highlights
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {[
                  { label: 'Active Societies', value: '28 Registered' },
                  { label: 'Upcoming Hackathons', value: "HackThapar '25" },
                  { label: 'Campus Status', value: '🟢 Semester Active' },
                ].map((item, i, arr) => (
                  <div
                    key={item.label}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: 12,
                      padding: '10px 0',
                      borderBottom: i < arr.length - 1 ? '1px solid #DDDDDD' : 'none',
                    }}
                  >
                    <span style={{ color: '#717171' }}>{item.label}</span>
                    <span style={{ fontWeight: 700, color: '#222222' }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Featured Hubs */}
            <div className="surface-card" style={{ padding: 20, border: '1px solid #DDDDDD', backgroundColor: '#FFFFFF' }}>
              <h3 style={{ fontSize: 11, fontWeight: 800, color: '#717171', textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 14px' }}>
                Featured Hubs
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {[
                  { name: 'CCS', sub: 'Computer Club Society', members: '2.8k' },
                  { name: 'Mudra', sub: 'Music Society', members: '1.9k' },
                  { name: 'Trident', sub: 'Robotics & Hardware', members: '1.6k' },
                ].map((soc) => (
                  <button
                    key={soc.name}
                    onClick={() => setSelectedSociety(soc.name)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 12px',
                      borderRadius: 10,
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #DDDDDD',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#F7F7F7'
                      e.currentTarget.style.borderColor = '#222222'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#FFFFFF'
                      e.currentTarget.style.borderColor = '#DDDDDD'
                    }}
                  >
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 700, color: '#222222', margin: 0 }}>{soc.name}</p>
                      <p style={{ fontSize: 11, color: '#717171', margin: '2px 0 0' }}>{soc.sub}</p>
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#717171' }}>{soc.members}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── FAB on mobile ── */}
      <button
        className="btn-primary md:hidden"
        style={{
          position: 'absolute',
          right: 16,
          bottom: 80,
          width: 52,
          height: 52,
          borderRadius: '9999px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 20,
          boxShadow: '0 4px 16px rgba(255,56,92,0.40)',
        }}
        onClick={() => setShowCreateModal(true)}
      >
        <Plus size={22} strokeWidth={2.5} />
      </button>

      {/* ── Society Hub Overlay ── */}
      {selectedSociety && (
        <SocietyHub
          societyName={selectedSociety}
          onClose={() => setSelectedSociety(null)}
        />
      )}

      {/* ── Create Post Modal ── */}
      <AnimatePresence>
        {showCreateModal && (
          <>
            <motion.div
              style={{ position: 'fixed', inset: 0, zIndex: 40, backgroundColor: 'rgba(0,0,0,0.5)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCreateModal(false)}
            />
            <div
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 50,
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
                pointerEvents: 'none',
                padding: '0',
              }}
              className="md:items-center md:p-4"
            >
              <motion.div
                style={{
                  width: '100%',
                  maxWidth: 480,
                  padding: '20px 20px 28px',
                  borderRadius: '20px 20px 0 0',
                  pointerEvents: 'auto',
                  backgroundColor: '#FFFFFF',
                  maxHeight: '85vh',
                  overflowY: 'auto',
                  boxShadow: '0 -4px 40px rgba(0,0,0,0.14)',
                  border: '1px solid #DDDDDD',
                }}
                className="md:rounded-2xl md:max-w-lg"
                initial={{ y: '100%', opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: '100%', opacity: 0 }}
                transition={{ type: 'spring', stiffness: 450, damping: 35 }}
              >
                <div className="drag-handle md:hidden" />
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                  <h2 style={{ fontSize: 18, fontWeight: 800, color: '#222222', margin: 0, letterSpacing: '-0.02em' }}>
                    Create Post
                  </h2>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: '9999px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #DDDDDD',
                      color: '#222222',
                    }}
                  >
                    <X size={15} />
                  </button>
                </div>

                <form onSubmit={handleCreatePost} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <input
                    className="input-standard"
                    placeholder="Society name (e.g. CCS, Mudra)"
                    value={newPost.society_name}
                    onChange={(e) => setNewPost((p) => ({ ...p, society_name: e.target.value }))}
                    required
                  />

                  <div style={{ position: 'relative' }}>
                    <select
                      className="input-standard appearance-none"
                      style={{ paddingRight: 40 }}
                      value={newPost.category}
                      onChange={(e) => setNewPost((p) => ({ ...p, category: e.target.value }))}
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                    <ChevronDown
                      size={14}
                      style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#717171' }}
                    />
                  </div>

                  <input
                    className="input-standard"
                    placeholder="Post title"
                    value={newPost.title}
                    onChange={(e) => setNewPost((p) => ({ ...p, title: e.target.value }))}
                    required
                  />

                  <textarea
                    className="input-standard resize-none"
                    rows={4}
                    placeholder="What's happening on campus?"
                    value={newPost.description}
                    onChange={(e) => setNewPost((p) => ({ ...p, description: e.target.value }))}
                    required
                  />

                  <button
                    type="submit"
                    className="btn-primary"
                    style={{ padding: '14px', fontSize: 14, marginTop: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                    disabled={submitting}
                  >
                    {submitting ? <Loader2 size={16} className="animate-spin" /> : 'Publish Post'}
                  </button>
                </form>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
