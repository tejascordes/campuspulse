import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Calendar,
  Layers,
  Info,
  UserCheck,
  UserPlus,
  MapPin,
  Clock,
  Loader2,
  Mail,
  ExternalLink,
} from 'lucide-react'
import axios from 'axios'
import { API_URL } from '../App.jsx'
import EventCard from './EventCard.jsx'
import PostCard from './PostCard.jsx'

export default function SocietyHub({ societyName, onClose }) {
  const [activeTab, setActiveTab] = useState('events') // 'events' | 'posts' | 'about'
  const [society, setSociety] = useState(null)
  const [events, setEvents] = useState([])
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [isFollowing, setIsFollowing] = useState(false)

  useEffect(() => {
    async function loadSocietyData() {
      setLoading(true)
      try {
        const [socRes, evRes, postRes] = await Promise.all([
          axios.get(`${API_URL}/api/societies/${societyName}`),
          axios.get(`${API_URL}/api/events`, { params: { society_name: societyName } }),
          axios.get(`${API_URL}/api/posts`, { params: { society_name: societyName } }),
        ])
        setSociety(socRes.data)
        setEvents(evRes.data)
        setPosts(postRes.data)
      } catch (e) {
        console.error('Failed to load society hub data:', e)
      } finally {
        setLoading(false)
      }
    }
    loadSocietyData()
  }, [societyName])

  const initials = societyName?.slice(0, 2).toUpperCase()

  const tabs = [
    { id: 'events', label: 'Events', count: events.length, icon: Calendar },
    { id: 'posts', label: 'Posts', count: posts.length, icon: Layers },
    { id: 'about', label: 'About', count: null, icon: Info },
  ]

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex flex-col justify-end" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
        {/* Modal Container */}
        <motion.div
          className="w-full h-[92vh] flex flex-col overflow-hidden relative rounded-t-2xl"
          style={{
            backgroundColor: '#0a0a0c',
            border: '1px solid #232326',
            borderBottom: 'none',
          }}
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 350 }}
        >
          {/* Header */}
          <div
            className="p-5 pb-3 flex-shrink-0"
            style={{
              backgroundColor: '#141417',
              borderBottom: '1px solid #232326',
            }}
          >
            {/* Top Bar: Drag handle & Close */}
            <div className="flex items-center justify-between mb-3">
              <div className="drag-handle !mb-0" />
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 transition-colors"
                style={{ backgroundColor: '#1a1a1f', border: '1px solid #232326' }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Profile Info */}
            <div className="flex items-start gap-3.5">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold text-zinc-100 flex-shrink-0"
                style={{
                  backgroundColor: '#1a1a1f',
                  border: '1px solid #232326',
                }}
              >
                {initials}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-lg font-bold text-zinc-100 truncate">
                    {society?.name || societyName}
                  </h2>
                  <button
                    onClick={() => setIsFollowing(!isFollowing)}
                    className={`px-3 py-1 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                      isFollowing
                        ? 'btn-secondary text-zinc-300'
                        : 'btn-primary'
                    }`}
                  >
                    {isFollowing ? (
                      <>
                        <UserCheck size={13} />
                        <span>Following</span>
                      </>
                    ) : (
                      <>
                        <UserPlus size={13} />
                        <span>Follow</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-2 mt-1">
                  <span
                    className="text-[11px] font-medium px-2 py-0.5 rounded-md"
                    style={{
                      border: '1px solid #232326',
                      color: '#a1a1aa',
                    }}
                  >
                    {society?.category || 'Campus Society'}
                  </span>
                  {society?.follower_count && (
                    <span className="text-xs text-zinc-500">
                      {society.follower_count} followers
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mt-4">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors ${
                      isActive
                        ? 'bg-zinc-100 text-zinc-950 font-semibold'
                        : 'bg-[#1a1a1f] text-zinc-400 hover:text-zinc-200 border border-[#232326]'
                    }`}
                  >
                    <Icon size={13} />
                    <span>{tab.label}</span>
                    {tab.count !== null && (
                      <span className={`text-[10px] px-1 rounded ${isActive ? 'bg-zinc-300 text-zinc-900 font-bold' : 'bg-[#232326] text-zinc-400'}`}>
                        {tab.count}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Content Body */}
          <div className="flex-1 overflow-y-auto p-4 pb-20">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-48 gap-2.5">
                <Loader2 size={24} className="animate-spin text-zinc-500" />
                <p className="text-xs text-zinc-500">Loading society hub...</p>
              </div>
            ) : activeTab === 'events' ? (
              events.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-center gap-1.5">
                  <p className="text-sm font-medium text-zinc-300">No upcoming events</p>
                  <p className="text-xs text-zinc-500">Check back later for newly announced events.</p>
                </div>
              ) : (
                events.map((ev) => <EventCard key={ev.id} event={ev} />)
              )
            ) : activeTab === 'posts' ? (
              posts.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-center gap-1.5">
                  <p className="text-sm font-medium text-zinc-300">No posts yet</p>
                  <p className="text-xs text-zinc-500">This society hasn't shared any updates.</p>
                </div>
              ) : (
                posts.map((p) => <PostCard key={p.id} post={p} />)
              )
            ) : (
              /* About Tab */
              <div className="space-y-3">
                <div className="surface-card p-4">
                  <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                    About Society
                  </h4>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    {society?.description || 'Official student society at Thapar Institute.'}
                  </p>
                </div>

                <div className="surface-card p-4 space-y-2.5 text-xs text-zinc-300">
                  {society?.hub_location && (
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-zinc-500" />
                      <span>{society.hub_location}</span>
                    </div>
                  )}
                  {society?.meeting_schedule && (
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-zinc-500" />
                      <span>{society.meeting_schedule}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
