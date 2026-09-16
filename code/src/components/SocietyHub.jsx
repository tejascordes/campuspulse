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
} from 'lucide-react'
import { societiesApi, eventsApi, postsApi } from '../api.js'
import EventCard from './EventCard.jsx'
import PostCard from './PostCard.jsx'

/** Deterministic gradient based on society name first char */
function getSocietyGradient(name = '') {
  const gradients = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #FF5A5F 0%, #FC642D 100%)',
    'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
    'linear-gradient(135deg, #f7971e 0%, #ffd200 100%)',
    'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
    'linear-gradient(135deg, #00A699 0%, #007A70 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  ]
  const idx = name.charCodeAt(0) % gradients.length
  return gradients[idx]
}

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
        const [socData, evData, postData] = await Promise.all([
          societiesApi.getSociety(societyName),
          eventsApi.getEvents({ society_name: societyName }),
          postsApi.getPosts({ society_name: societyName }),
        ])
        setSociety(socData)
        setEvents(evData)
        setPosts(postData)
      } catch (e) {
        console.error('Failed to load society hub data:', e)
      } finally {
        setLoading(false)
      }
    }
    loadSocietyData()
  }, [societyName])

  const initials = societyName?.slice(0, 2).toUpperCase()
  const heroGradient = getSocietyGradient(societyName)

  const tabs = [
    { id: 'events', label: 'Events', count: events.length, icon: Calendar },
    { id: 'posts', label: 'Posts', count: posts.length, icon: Layers },
    { id: 'about', label: 'About', count: null, icon: Info },
  ]

  return (
    <AnimatePresence>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 50,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.55)',
          padding: 0,
        }}
        className="md:justify-center md:p-6"
      >
        {/* Modal */}
        <motion.div
          style={{
            width: '100%',
            maxWidth: 672,
            height: '92vh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            position: 'relative',
            borderRadius: '20px 20px 0 0',
            backgroundColor: '#FFFFFF',
            boxShadow: '0 -8px 48px rgba(0,0,0,0.20)',
          }}
          className="md:rounded-2xl md:h-[86vh]"
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 30, stiffness: 350 }}
        >
          {/* Hero Banner */}
          <div
            style={{
              background: heroGradient,
              padding: '0 20px 0',
              flexShrink: 0,
              position: 'relative',
            }}
          >
            {/* Close button — top-right, white circle */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 16 }}>
              <button
                onClick={onClose}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '9999px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  backgroundColor: 'rgba(255,255,255,0.3)',
                  backdropFilter: 'blur(8px)',
                  border: '1.5px solid rgba(255,255,255,0.5)',
                  color: '#FFFFFF',
                }}
              >
                <X size={15} />
              </button>
            </div>

            {/* Society avatar + name */}
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14, padding: '20px 0 0' }}>
              <div
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: '9999px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 20,
                  fontWeight: 900,
                  color: '#FFFFFF',
                  backgroundColor: 'rgba(255,255,255,0.22)',
                  backdropFilter: 'blur(8px)',
                  border: '2.5px solid rgba(255,255,255,0.5)',
                  flexShrink: 0,
                  letterSpacing: '-0.01em',
                }}
              >
                {initials}
              </div>
              <div style={{ paddingBottom: 2 }}>
                <h2
                  style={{
                    fontSize: 20,
                    fontWeight: 900,
                    color: '#FFFFFF',
                    margin: 0,
                    letterSpacing: '-0.02em',
                    textShadow: '0 1px 4px rgba(0,0,0,0.15)',
                  }}
                >
                  {society?.name || societyName}
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      padding: '2px 10px',
                      borderRadius: '9999px',
                      backgroundColor: 'rgba(255,255,255,0.25)',
                      color: '#FFFFFF',
                    }}
                  >
                    {society?.category || 'Campus Society'}
                  </span>
                  {society?.follower_count && (
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>
                      {society.follower_count} followers
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Follow button row */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '12px 0 16px' }}>
              <button
                onClick={() => setIsFollowing(!isFollowing)}
                style={{
                  padding: '8px 20px',
                  borderRadius: '9999px',
                  fontSize: 13,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  border: 'none',
                  backgroundColor: isFollowing ? 'rgba(255,255,255,0.25)' : '#FFFFFF',
                  color: isFollowing ? '#FFFFFF' : '#222222',
                  backdropFilter: isFollowing ? 'blur(8px)' : 'none',
                }}
              >
                {isFollowing ? (
                  <>
                    <UserCheck size={14} />
                    <span>Following</span>
                  </>
                ) : (
                  <>
                    <UserPlus size={14} />
                    <span>Follow</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Tabs — Airbnb underline style */}
          <div
            style={{
              display: 'flex',
              borderBottom: '1px solid #EBEBEB',
              backgroundColor: '#FFFFFF',
              flexShrink: 0,
              padding: '0 20px',
            }}
          >
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    padding: '12px 4px',
                    fontSize: 13,
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? '#222222' : '#767676',
                    background: 'none',
                    border: 'none',
                    borderBottom: isActive ? '2px solid #FF5A5F' : '2px solid transparent',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    marginBottom: -1,
                  }}
                >
                  <Icon size={14} />
                  <span>{tab.label}</span>
                  {tab.count !== null && (
                    <span
                      style={{
                        fontSize: 10,
                        padding: '1px 6px',
                        borderRadius: '9999px',
                        fontWeight: 700,
                        backgroundColor: isActive ? '#FF5A5F' : '#F0F0F0',
                        color: isActive ? '#FFFFFF' : '#767676',
                      }}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          {/* Content body */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 80px', backgroundColor: '#F7F7F7' }}>
            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 200, gap: 10 }}>
                <Loader2 size={24} className="animate-spin" style={{ color: '#B0B0B0' }} />
                <p style={{ fontSize: 13, color: '#B0B0B0' }}>Loading society hub…</p>
              </div>
            ) : activeTab === 'events' ? (
              events.length === 0 ? (
                <div
                  className="surface-card"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: 200,
                    textAlign: 'center',
                    gap: 6,
                    border: '1px solid #EBEBEB',
                  }}
                >
                  <p style={{ fontSize: 14, fontWeight: 700, color: '#222222' }}>No upcoming events</p>
                  <p style={{ fontSize: 12, color: '#B0B0B0' }}>Check back later for newly announced events.</p>
                </div>
              ) : (
                events.map((ev) => <EventCard key={ev.id} event={ev} />)
              )
            ) : activeTab === 'posts' ? (
              posts.length === 0 ? (
                <div
                  className="surface-card"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: 200,
                    textAlign: 'center',
                    gap: 6,
                    border: '1px solid #EBEBEB',
                  }}
                >
                  <p style={{ fontSize: 14, fontWeight: 700, color: '#222222' }}>No posts yet</p>
                  <p style={{ fontSize: 12, color: '#B0B0B0' }}>This society hasn&rsquo;t shared any updates.</p>
                </div>
              ) : (
                posts.map((p) => <PostCard key={p.id} post={p} />)
              )
            ) : (
              /* About tab */
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div className="surface-card" style={{ padding: 18, border: '1px solid #EBEBEB' }}>
                  <h4 style={{ fontSize: 11, fontWeight: 800, color: '#B0B0B0', textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 10px' }}>
                    About Society
                  </h4>
                  <p style={{ fontSize: 14, color: '#484848', lineHeight: 1.6, margin: 0 }}>
                    {society?.description || 'Official student society at Thapar Institute.'}
                  </p>
                </div>

                <div className="surface-card" style={{ padding: 18, border: '1px solid #EBEBEB' }}>
                  {society?.hub_location && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, fontSize: 13, color: '#484848' }}>
                      <MapPin size={15} style={{ color: '#B0B0B0', flexShrink: 0 }} />
                      <span>{society.hub_location}</span>
                    </div>
                  )}
                  {society?.meeting_schedule && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#484848' }}>
                      <Clock size={15} style={{ color: '#B0B0B0', flexShrink: 0 }} />
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
