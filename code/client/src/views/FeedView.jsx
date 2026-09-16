import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Plus,
  Loader2,
  X,
  Layers,
  CalendarDays,
  Bell,
  UploadCloud,
  Check,
  ShieldCheck,
  Image as ImageIcon,
} from 'lucide-react'
import { postsApi, eventsApi } from '../api.js'
import FilterPills from '../components/FilterPills.jsx'
import PostCard from '../components/PostCard.jsx'
import EventCard from '../components/EventCard.jsx'
import StoriesRow from '../components/StoriesRow.jsx'
import SocietyHub from '../components/SocietyHub.jsx'

const AVAILABLE_TAGS = [
  'Tech',
  'Non-Tech',
  'Hackathon',
  'Prize Pool',
  'Certificate',
  'Refreshments',
  'Overnight',
  'Cultural',
  'Workshop',
  'Free Entry',
]

export default function FeedView({ token: _token, user }) {
  const [feedMode, setFeedMode] = useState('posts') // 'posts' | 'events'
  const [posts, setPosts] = useState([])
  const [events, setEvents] = useState([])
  const [filter, setFilter] = useState('All')
  const [loading, setLoading] = useState(true)
  const [selectedSociety, setSelectedSociety] = useState(null)
  const [showCreateModal, setShowCreateModal] = useState(false)

  // Society identity from logged in user account
  const currentSocietyName = user?.society_name || user?.name || 'CCS'
  const currentSocietyLogo = user?.logo_url || null

  // Post form state
  const [newPost, setNewPost] = useState({
    title: '',
    description: '',
    categories: ['Tech'],
    logo_url: currentSocietyLogo || '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [logoPreview, setLogoPreview] = useState(currentSocietyLogo || '')
  const fileInputRef = useRef(null)

  // Keep logo preview in sync if user changes
  useEffect(() => {
    if (user?.logo_url) {
      setLogoPreview(user.logo_url)
      setNewPost((p) => ({ ...p, logo_url: user.logo_url }))
    }
  }, [user])

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

  const handleToggleTag = (tag) => {
    setNewPost((prev) => {
      const exists = prev.categories.includes(tag)
      let updated
      if (exists) {
        // keep at least 1 tag
        updated = prev.categories.length > 1 ? prev.categories.filter((t) => t !== tag) : prev.categories
      } else {
        updated = [...prev.categories, tag]
      }
      return { ...prev, categories: updated }
    })
  }

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      const base64 = event.target?.result
      setLogoPreview(base64)
      setNewPost((p) => ({ ...p, logo_url: base64 }))
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveLogo = () => {
    setLogoPreview('')
    setNewPost((p) => ({ ...p, logo_url: '' }))
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleCreatePost = async (e) => {
    e.preventDefault()
    if (!newPost.title.trim() || !newPost.description.trim()) return
    setSubmitting(true)
    try {
      await postsApi.createPost({
        ...newPost,
        society_name: currentSocietyName,
        category: newPost.categories[0] || 'Tech',
        logo_url: logoPreview || null,
      })
      setShowCreateModal(false)
      setNewPost({
        title: '',
        description: '',
        categories: ['Tech'],
        logo_url: logoPreview || '',
      })
      fetchData()
    } catch (e) {
      console.error('Failed to create post:', e)
    } finally {
      setSubmitting(false)
    }
  }

  const societyInitial = currentSocietyName.charAt(0).toUpperCase()

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
                Post under your verified society account.
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
                  maxWidth: 500,
                  padding: '24px',
                  borderRadius: '20px 20px 0 0',
                  pointerEvents: 'auto',
                  backgroundColor: '#FFFFFF',
                  maxHeight: '90vh',
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
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
                  <div>
                    <h2 style={{ fontSize: 18, fontWeight: 800, color: '#222222', margin: 0, letterSpacing: '-0.02em' }}>
                      Create Post
                    </h2>
                    <p style={{ fontSize: 12, color: '#717171', margin: '2px 0 0' }}>
                      Publish an official announcement
                    </p>
                  </div>
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

                {/* 1. Verified Society Identity Banner (Locked Account Name) */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    borderRadius: 12,
                    backgroundColor: '#F7F7F7',
                    border: '1px solid #DDDDDD',
                    marginBottom: 16,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: '9999px',
                        backgroundColor: '#FFFFFF',
                        border: '1.5px solid #DDDDDD',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: 16,
                        color: '#FF385C',
                        overflow: 'hidden',
                        flexShrink: 0,
                      }}
                    >
                      {logoPreview ? (
                        <img
                          src={logoPreview}
                          alt="Society Logo"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        <span>{societyInitial}</span>
                      )}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontSize: 14, fontWeight: 800, color: '#222222' }}>
                          {currentSocietyName}
                        </span>
                        <span
                          style={{
                            fontSize: 10,
                            padding: '2px 6px',
                            borderRadius: 4,
                            backgroundColor: '#EDFAF4',
                            color: '#10B981',
                            fontWeight: 700,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 3,
                          }}
                        >
                          <ShieldCheck size={11} /> Verified Society
                        </span>
                      </div>
                      <p style={{ fontSize: 11, color: '#717171', margin: '2px 0 0' }}>
                        Locked to your official account
                      </p>
                    </div>
                  </div>

                  {/* Logo Upload Trigger */}
                  <div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleLogoUpload}
                      accept="image/*"
                      style={{ display: 'none' }}
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '9999px',
                        fontSize: 11,
                        fontWeight: 600,
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #DDDDDD',
                        color: '#222222',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                      }}
                    >
                      <UploadCloud size={13} />
                      <span>{logoPreview ? 'Change Logo' : 'Upload Logo'}</span>
                    </button>
                  </div>
                </div>

                {/* Logo Preview Indicator if uploaded */}
                {logoPreview && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '6px 12px',
                      borderRadius: 8,
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #DDDDDD',
                      marginBottom: 16,
                      fontSize: 11,
                      color: '#717171',
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <ImageIcon size={13} style={{ color: '#10B981' }} /> Custom society logo attached
                    </span>
                    <button
                      type="button"
                      onClick={handleRemoveLogo}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#FF385C',
                        cursor: 'pointer',
                        fontWeight: 600,
                        fontSize: 11,
                      }}
                    >
                      Remove
                    </button>
                  </div>
                )}

                <form onSubmit={handleCreatePost} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {/* 2. Multi-Select Tags */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <label style={{ fontSize: 12, fontWeight: 700, color: '#222222' }}>
                        Select Tags (Multiple)
                      </label>
                      <span style={{ fontSize: 11, color: '#717171', fontWeight: 500 }}>
                        {newPost.categories.length} selected
                      </span>
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {AVAILABLE_TAGS.map((tag) => {
                        const isSelected = newPost.categories.includes(tag)
                        return (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => handleToggleTag(tag)}
                            style={{
                              padding: '6px 12px',
                              borderRadius: '9999px',
                              fontSize: 12,
                              fontWeight: isSelected ? 700 : 500,
                              cursor: 'pointer',
                              transition: 'all 0.15s ease',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 5,
                              backgroundColor: isSelected ? '#000000' : '#FFFFFF',
                              color: isSelected ? '#FFFFFF' : '#222222',
                              border: isSelected ? '1px solid #000000' : '1px solid #DDDDDD',
                              boxShadow: isSelected ? '0 2px 6px rgba(0,0,0,0.15)' : 'none',
                            }}
                          >
                            {isSelected && <Check size={11} strokeWidth={3} />}
                            <span>{tag}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* 3. Post Title */}
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 700, color: '#222222', display: 'block', marginBottom: 6 }}>
                      Post Title
                    </label>
                    <input
                      className="input-standard"
                      placeholder="e.g. HackThapar 2025 — Registrations Open"
                      value={newPost.title}
                      onChange={(e) => setNewPost((p) => ({ ...p, title: e.target.value }))}
                      required
                    />
                  </div>

                  {/* 4. Description */}
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 700, color: '#222222', display: 'block', marginBottom: 6 }}>
                      Announcement Details
                    </label>
                    <textarea
                      className="input-standard resize-none"
                      rows={4}
                      placeholder="Share event dates, registration links, prize pools, or venue details..."
                      value={newPost.description}
                      onChange={(e) => setNewPost((p) => ({ ...p, description: e.target.value }))}
                      required
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="btn-primary"
                    style={{ padding: '14px', fontSize: 14, marginTop: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                    disabled={submitting}
                  >
                    {submitting ? <Loader2 size={16} className="animate-spin" /> : 'Publish Announcement'}
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
