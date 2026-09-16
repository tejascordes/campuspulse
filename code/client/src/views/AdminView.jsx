import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Trash2,
  Building2,
  Layers,
  Users,
  Clock,
  Loader2,
  ChevronRight,
  Sparkles,
} from 'lucide-react'
import { adminApi, postsApi, societiesApi } from '../api.js'

export default function AdminView({ user: _user }) {
  const [activeTab, setActiveTab] = useState('approvals') // 'approvals' | 'moderation' | 'societies'
  const [applications, setApplications] = useState([])
  const [posts, setPosts] = useState([])
  const [societies, setSocieties] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(null)
  const [notification, setNotification] = useState('')

  const showToast = (msg) => {
    setNotification(msg)
    setTimeout(() => setNotification(''), 3000)
  }

  const loadAdminData = useCallback(async () => {
    setLoading(true)
    try {
      const [appsData, postsData, socsData, statsData] = await Promise.all([
        adminApi.getPendingSocieties(),
        postsApi.getPosts(),
        societiesApi.getSocieties(),
        adminApi.getStats(),
      ])
      setApplications(appsData || [])
      setPosts(postsData || [])
      setSocieties(socsData || [])
      setStats(statsData || null)
    } catch (e) {
      console.error('Failed to load admin dashboard data:', e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadAdminData()
  }, [loadAdminData])

  const handleApprove = async (appId, societyName) => {
    setActionLoading(appId)
    try {
      await adminApi.approveSociety(appId)
      showToast(`✓ Approved ${societyName} Society Account!`)
      loadAdminData()
    } catch (e) {
      console.error('Approve failed:', e)
    } finally {
      setActionLoading(null)
    }
  }

  const handleReject = async (appId, societyName) => {
    setActionLoading(appId)
    try {
      await adminApi.rejectSociety(appId)
      showToast(`Rejected ${societyName} application.`)
      loadAdminData()
    } catch (e) {
      console.error('Reject failed:', e)
    } finally {
      setActionLoading(null)
    }
  }

  const handleDeletePost = async (postId, title) => {
    if (!window.confirm(`Are you sure you want to delete post "${title}"?`)) return
    setActionLoading(postId)
    try {
      await adminApi.deletePost(postId)
      showToast(`✓ Post deleted and moderated.`)
      loadAdminData()
    } catch (e) {
      console.error('Delete post failed:', e)
    } finally {
      setActionLoading(null)
    }
  }

  const pendingApps = applications.filter((a) => a.status === 'PENDING')

  const tabs = [
    { id: 'approvals', label: 'Society Approvals', count: pendingApps.length, icon: Building2 },
    { id: 'moderation', label: 'Post Moderation', count: posts.length, icon: Layers },
    { id: 'societies', label: 'Active Societies', count: societies.length, icon: Users },
  ]

  return (
    <div
      className="h-full w-full overflow-y-auto bg-white"
      style={{ backgroundColor: '#FFFFFF', padding: '0 16px 96px' }}
    >
      <div style={{ maxWidth: '56rem', margin: '0 auto', width: '100%', paddingTop: 20 }}>

        {/* ── Admin Header ── */}
        <div style={{ marginBottom: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: '9999px',
                  backgroundColor: '#000000',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.20)',
                }}
              >
                <ShieldCheck size={22} />
              </div>
              <div>
                <h1 style={{ fontSize: 24, fontWeight: 900, color: '#222222', margin: 0, letterSpacing: '-0.03em' }}>
                  Admin Dashboard
                </h1>
                <p style={{ fontSize: 12, color: '#717171', margin: '2px 0 0', fontWeight: 500 }}>
                  System Administrator: <span style={{ color: '#222222', fontWeight: 700 }}>tkorde_be@thapar.edu</span>
                </p>
              </div>
            </div>

            <span
              style={{
                fontSize: 11,
                padding: '4px 12px',
                borderRadius: '9999px',
                backgroundColor: '#EDFAF4',
                color: '#10B981',
                fontWeight: 800,
                border: '1px solid #A7F3D0',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <Sparkles size={12} /> Root Superuser
            </span>
          </div>
        </div>

        {/* ── Toast notification ── */}
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              style={{
                padding: '10px 16px',
                borderRadius: 10,
                backgroundColor: '#222222',
                color: '#FFFFFF',
                fontSize: 13,
                fontWeight: 600,
                marginBottom: 16,
                boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
              }}
            >
              {notification}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── System Stats Panel ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 20 }}>
          {[
            { label: 'Pending Approvals', value: pendingApps.length, highlight: pendingApps.length > 0 },
            { label: 'Approved Societies', value: societies.length, highlight: false },
            { label: 'Campus Buzz Posts', value: posts.length, highlight: false },
            { label: 'Total Events', value: stats?.total_events || 6, highlight: false },
          ].map((item) => (
            <div
              key={item.label}
              className="surface-card"
              style={{
                padding: '14px 12px',
                textAlign: 'center',
                border: item.highlight ? '1.5px solid #FF385C' : '1px solid #DDDDDD',
                backgroundColor: item.highlight ? '#FFF5F5' : '#F7F7F7',
              }}
            >
              <p
                style={{
                  fontSize: 22,
                  fontWeight: 900,
                  color: item.highlight ? '#FF385C' : '#222222',
                  margin: 0,
                  letterSpacing: '-0.02em',
                }}
              >
                {item.value}
              </p>
              <p style={{ fontSize: 11, color: '#717171', margin: '2px 0 0', fontWeight: 600 }}>
                {item.label}
              </p>
            </div>
          ))}
        </div>

        {/* ── Admin Tabs ── */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid #DDDDDD',
            backgroundColor: '#FFFFFF',
            marginBottom: 18,
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
                  color: isActive ? '#222222' : '#717171',
                  background: 'none',
                  border: 'none',
                  borderBottom: isActive ? '2px solid #222222' : '2px solid transparent',
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
                      padding: '1px 7px',
                      borderRadius: '9999px',
                      fontWeight: 800,
                      backgroundColor: isActive ? (tab.id === 'approvals' && pendingApps.length > 0 ? '#FF385C' : '#000000') : '#F0F0F0',
                      color: isActive ? '#FFFFFF' : '#717171',
                    }}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* ── Tab Content ── */}
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 200, gap: 10 }}>
            <Loader2 size={24} className="animate-spin" style={{ color: '#FF385C' }} />
            <p style={{ fontSize: 13, color: '#717171' }}>Loading administration data…</p>
          </div>
        ) : activeTab === 'approvals' ? (
          /* Tab 1: Society Approvals */
          <div>
            {pendingApps.length === 0 ? (
              <div
                className="surface-card"
                style={{
                  padding: 32,
                  textAlign: 'center',
                  border: '1px solid #DDDDDD',
                  backgroundColor: '#FFFFFF',
                }}
              >
                <CheckCircle2 size={36} style={{ color: '#10B981', margin: '0 auto 10px' }} />
                <h3 style={{ fontSize: 16, fontWeight: 800, color: '#222222', margin: 0 }}>
                  All Caught Up!
                </h3>
                <p style={{ fontSize: 13, color: '#717171', margin: '6px 0 0' }}>
                  There are no pending society verification requests. New society account applications will appear here.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {pendingApps.map((app) => (
                  <div
                    key={app.id}
                    className="surface-card"
                    style={{
                      padding: 18,
                      border: '1.5px solid #DDDDDD',
                      backgroundColor: '#FFFFFF',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 12,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        {/* Society Avatar / Logo */}
                        <div
                          style={{
                            width: 48,
                            height: 48,
                            borderRadius: '9999px',
                            backgroundColor: '#FFFFFF',
                            border: '2px solid #FF385C',
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
                          {app.logo_url ? (
                            <img src={app.logo_url} alt="logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <span>{app.society_name?.slice(0, 2).toUpperCase()}</span>
                          )}
                        </div>

                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <h3 style={{ fontSize: 16, fontWeight: 800, color: '#222222', margin: 0 }}>
                              {app.society_name}
                            </h3>
                            <span
                              style={{
                                fontSize: 10,
                                padding: '2px 8px',
                                borderRadius: '9999px',
                                backgroundColor: '#FFF3E0',
                                color: '#D97706',
                                fontWeight: 700,
                              }}
                            >
                              Pending Review
                            </span>
                          </div>
                          <p style={{ fontSize: 12, color: '#717171', margin: '2px 0 0' }}>
                            Representative: <span style={{ fontWeight: 600, color: '#222222' }}>{app.applicant_name}</span> ({app.applicant_email})
                          </p>
                        </div>
                      </div>

                      <span style={{ fontSize: 11, color: '#717171', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Clock size={12} /> {new Date(app.applied_at).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Description */}
                    <p style={{ fontSize: 13, color: '#484848', lineHeight: 1.5, margin: 0, backgroundColor: '#F7F7F7', padding: '10px 14px', borderRadius: 8 }}>
                      {app.description || 'Student chapter verification request.'}
                    </p>

                    {/* Actions */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, paddingTop: 4 }}>
                      <button
                        onClick={() => handleReject(app.id, app.society_name)}
                        disabled={actionLoading === app.id}
                        style={{
                          padding: '8px 16px',
                          borderRadius: '9999px',
                          fontSize: 12,
                          fontWeight: 700,
                          backgroundColor: '#FFFFFF',
                          color: '#FF385C',
                          border: '1px solid #FF385C',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 5,
                        }}
                      >
                        <XCircle size={14} />
                        <span>Reject</span>
                      </button>

                      <button
                        onClick={() => handleApprove(app.id, app.society_name)}
                        disabled={actionLoading === app.id}
                        style={{
                          padding: '8px 20px',
                          borderRadius: '9999px',
                          fontSize: 12,
                          fontWeight: 700,
                          backgroundColor: '#10B981',
                          color: '#FFFFFF',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                          boxShadow: '0 2px 8px rgba(16,185,129,0.30)',
                        }}
                      >
                        {actionLoading === app.id ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                        <span>Approve Society</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : activeTab === 'moderation' ? (
          /* Tab 2: Content Moderation */
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {posts.map((post) => (
              <div
                key={post.id}
                className="surface-card"
                style={{
                  padding: '14px 16px',
                  border: '1px solid #DDDDDD',
                  backgroundColor: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12,
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 12, fontWeight: 800, color: '#FF385C' }}>
                      {post.society_name}
                    </span>
                    <span style={{ fontSize: 11, color: '#717171' }}>· {post.category}</span>
                    <span style={{ fontSize: 11, color: '#717171' }}>· {post.upvotes} upvotes</span>
                  </div>
                  <h4 style={{ fontSize: 14, fontWeight: 700, color: '#222222', margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {post.title}
                  </h4>
                  <p style={{ fontSize: 12, color: '#717171', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {post.description}
                  </p>
                </div>

                <button
                  onClick={() => handleDeletePost(post.id, post.title)}
                  disabled={actionLoading === post.id}
                  title="Delete & Moderate Post"
                  style={{
                    padding: '8px 14px',
                    borderRadius: '9999px',
                    fontSize: 12,
                    fontWeight: 600,
                    backgroundColor: '#FFF5F5',
                    color: '#FF385C',
                    border: '1px solid #FFE4E6',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5,
                    flexShrink: 0,
                  }}
                >
                  <Trash2 size={14} />
                  <span>Delete</span>
                </button>
              </div>
            ))}
          </div>
        ) : (
          /* Tab 3: Active Societies */
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
            {societies.map((soc) => (
              <div
                key={soc.name}
                className="surface-card"
                style={{ padding: 16, border: '1px solid #DDDDDD', backgroundColor: '#FFFFFF' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: '9999px', backgroundColor: '#F0F0F0', color: '#222222' }}>
                    {soc.category || 'Tech'}
                  </span>
                  <span style={{ fontSize: 11, color: '#10B981', fontWeight: 700 }}>
                    ✓ Active
                  </span>
                </div>
                <h4 style={{ fontSize: 15, fontWeight: 800, color: '#222222', margin: '0 0 4px' }}>
                  {soc.name}
                </h4>
                <p style={{ fontSize: 12, color: '#717171', margin: '0 0 10px', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {soc.description}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11, color: '#717171', borderTop: '1px solid #F0F0F0', paddingTop: 8 }}>
                  <span>{soc.follower_count || 450} Followers</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    View Hub <ChevronRight size={12} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
