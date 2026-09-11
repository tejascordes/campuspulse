import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bell,
  Search,
  Plus,
  Loader2,
  X,
  ChevronDown,
  Layers,
  CalendarDays,
} from 'lucide-react'
import { postsApi, eventsApi } from '../api.js'
import FilterPills from '../components/FilterPills.jsx'
import PostCard from '../components/PostCard.jsx'
import EventCard from '../components/EventCard.jsx'
import StoriesRow from '../components/StoriesRow.jsx'
import SocietyHub from '../components/SocietyHub.jsx'

const CATEGORIES = ['Tech', 'Non-Tech', 'Hackathons', 'Prizes Only', 'Refreshments']

export default function FeedView({ token, user }) {
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
    <div className="h-full flex flex-col overflow-hidden relative" style={{ backgroundColor: '#0a0a0c' }}>
      {/* Top Header */}
      <div
        className="flex-shrink-0 px-4 pt-10 pb-2.5 z-20"
        style={{
          backgroundColor: '#0a0a0c',
          borderBottom: '1px solid #1b1b1e',
        }}
      >
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
              className="w-8 h-8 rounded-xl flex items-center justify-center cursor-pointer transition-colors"
              style={{
                backgroundColor: '#141417',
                border: '1px solid #232326',
                color: '#a1a1aa',
              }}
            >
              <Search size={15} />
            </button>
            <button
              className="w-8 h-8 rounded-xl flex items-center justify-center relative cursor-pointer transition-colors"
              style={{
                backgroundColor: '#141417',
                border: '1px solid #232326',
                color: '#a1a1aa',
              }}
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

        {/* Mode Switcher: Campus Buzz / Society Events */}
        <div className="flex items-center gap-2 mb-2">
          <div
            className="flex-1 p-1 rounded-xl flex items-center"
            style={{
              backgroundColor: '#141417',
              border: '1px solid #232326',
            }}
          >
            <button
              type="button"
              onClick={() => setFeedMode('posts')}
              className="flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 border-none cursor-pointer transition-colors"
              style={{
                backgroundColor: feedMode === 'posts' ? '#f4f4f5' : 'transparent',
                color: feedMode === 'posts' ? '#0a0a0c' : '#71717a',
              }}
            >
              <Layers size={13} />
              <span>Campus Buzz</span>
            </button>

            <button
              type="button"
              onClick={() => setFeedMode('events')}
              className="flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 border-none cursor-pointer transition-colors"
              style={{
                backgroundColor: feedMode === 'events' ? '#f4f4f5' : 'transparent',
                color: feedMode === 'events' ? '#0a0a0c' : '#71717a',
              }}
            >
              <CalendarDays size={13} />
              <span>Society Events</span>
            </button>
          </div>
        </div>

        {/* Category Filter Pills */}
        <FilterPills active={filter} onChange={setFilter} />
      </div>

      {/* Feed Scroll Content */}
      <div className="flex-1 overflow-y-auto px-4 pt-3 pb-24">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-48 gap-2.5">
            <Loader2 size={24} className="animate-spin text-zinc-500" />
            <p className="text-xs text-zinc-500">Loading campus pulse...</p>
          </div>
        ) : feedMode === 'posts' ? (
          posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 gap-2 text-center">
              <p className="text-sm font-medium text-zinc-300">No posts in this category</p>
              <p className="text-xs text-zinc-500">Be the first to post something exciting!</p>
            </div>
          ) : (
            <div>
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )
        ) : events.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 gap-2 text-center">
            <p className="text-sm font-medium text-zinc-300">No events found</p>
            <p className="text-xs text-zinc-500">Check back later for upcoming society events.</p>
          </div>
        ) : (
          <div>
            {events.map((event) => (
              <EventCard key={event.id} event={event} onUpdate={fetchData} />
            ))}
          </div>
        )}
      </div>

      {/* FAB */}
      <button
        className="btn-primary absolute right-4 bottom-20 w-12 h-12 rounded-xl flex items-center justify-center z-20 shadow-lg"
        onClick={() => setShowCreateModal(true)}
      >
        <Plus size={20} strokeWidth={2.5} />
      </button>

      {/* Society Hub Fullscreen Overlay */}
      {selectedSociety && (
        <SocietyHub
          societyName={selectedSociety}
          onClose={() => setSelectedSociety(null)}
        />
      )}

      {/* Create Post Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <>
            <motion.div
              className="absolute inset-0 z-40"
              style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCreateModal(false)}
            />
            <motion.div
              className="absolute bottom-0 left-0 right-0 z-50 p-5 rounded-t-2xl"
              style={{
                backgroundColor: '#141417',
                border: '1px solid #232326',
                borderBottom: 'none',
                maxHeight: '85vh',
                overflowY: 'auto',
              }}
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 450, damping: 35 }}
            >
              <div className="drag-handle" />
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-zinc-100">Create Post</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 transition-colors"
                  style={{ backgroundColor: '#1a1a1f', border: '1px solid #232326' }}
                >
                  <X size={15} />
                </button>
              </div>

              <form onSubmit={handleCreatePost} className="flex flex-col gap-3">
                <input
                  className="input-standard"
                  placeholder="Society name (e.g. CCS, Mudra)"
                  value={newPost.society_name}
                  onChange={(e) => setNewPost((p) => ({ ...p, society_name: e.target.value }))}
                  required
                />

                <div className="relative">
                  <select
                    className="input-standard appearance-none pr-10"
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
                  className="btn-primary py-3 text-sm mt-1 flex items-center justify-center gap-2"
                  disabled={submitting}
                >
                  {submitting ? <Loader2 size={16} className="animate-spin" /> : 'Publish Post'}
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
