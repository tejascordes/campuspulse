import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LogOut,
  Eye,
  Users,
  Shield,
  Loader2,
  Check,
  UploadCloud,
  ShieldCheck,
  Crown,
  Building2,
  Sparkles,
  Clock,
  ArrowRight,
  Tag,
  Award,
  Image as ImageIcon,
} from 'lucide-react'
import { authApi, societiesApi } from '../api.js'
import SocietyFlairBadge from '../components/SocietyFlairBadge.jsx'

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
  { label: 'Posts', value: '14' },
  { label: 'Upvotes', value: '847' },
  { label: 'Followers', value: '2.8k' },
]

const SOCIETY_CATEGORIES = ['Tech', 'Cultural', 'Sports', 'Academic', 'Literary', 'Social & Welfare']
const POPULAR_SOCIETIES = ['CCS', 'OWASP', 'Mudra', 'Trident', 'E-Cell', 'Aagaaz', 'Rotaract', 'Quiz Club', 'FAP', 'ACM']
const POPULAR_ROLES = ['Core Team', 'President', 'Tech Lead', 'Executive', 'Organizer', 'Member', 'Designer', 'Volunteer']

export default function ProfileView({ user, token, onLogout, onUpdateUser, onNavigate }) {
  const isAdmin = user?.email?.toLowerCase() === 'tkorde_be@thapar.edu' || user?.account_type === 'admin'
  const isApprovedSociety = user?.account_type === 'society' || user?.society_status === 'APPROVED'
  const isPendingSociety = user?.society_status === 'PENDING'
  const isStudent = !isAdmin && !isApprovedSociety

  const [privacy, setPrivacy] = useState(user?.default_calendar_privacy || 'NO_ONE')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [societyName, setSocietyName] = useState(user?.society_name || user?.name || 'CCS')
  const [bio, setBio] = useState(user?.bio || 'Official Student Society at Thapar')
  const [logoUrl, setLogoUrl] = useState(user?.logo_url || '')
  const fileInputRef = useRef(null)

  // Society Flair state (Reddit-style user flair)
  const [flairSociety, setFlairSociety] = useState(user?.flair?.society_name || 'CCS')
  const [flairRole, setFlairRole] = useState(user?.flair?.role || 'Member')
  const [flairActive, setFlairActive] = useState(user?.flair?.is_active ?? true)
  const [savingFlair, setSavingFlair] = useState(false)
  const [savedFlair, setSavedFlair] = useState(false)

  // Society Application Form State (for Students)
  const [applyData, setApplyData] = useState({
    society_name: '',
    category: 'Tech',
    description: '',
    logo_url: '',
  })
  const [applyLogoPreview, setApplyLogoPreview] = useState('')
  const [submittingApp, setSubmittingApp] = useState(false)
  const [appSubmitted, setAppSubmitted] = useState(isPendingSociety)
  const applyFileInputRef = useRef(null)

  const handleSaveFlair = async (e) => {
    e.preventDefault()
    setSavingFlair(true)
    try {
      const updated = await authApi.updateFlair({
        society_name: flairSociety,
        role: flairRole,
        is_active: flairActive,
      })
      onUpdateUser(updated)
      setSavedFlair(true)
      setTimeout(() => setSavedFlair(false), 2500)
    } catch (err) {
      console.error('Failed to save flair:', err)
    } finally {
      setSavingFlair(false)
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

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = async (event) => {
      const base64 = event.target?.result
      setLogoUrl(base64)
      try {
        const updated = await authApi.updateProfile({ logo_url: base64 }, token)
        onUpdateUser(updated)
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
      } catch (err) {
        console.error('Failed to save logo:', err)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleSaveProfileInfo = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const updated = await authApi.updateProfile({ society_name: societyName, bio, logo_url: logoUrl }, token)
      onUpdateUser(updated)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (err) {
      console.error('Failed to update profile info:', err)
    } finally {
      setSaving(false)
    }
  }

  const handleApplyLogoUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      const base64 = event.target?.result
      setApplyLogoPreview(base64)
      setApplyData((p) => ({ ...p, logo_url: base64 }))
    }
    reader.readAsDataURL(file)
  }

  const handleSubmitApplication = async (e) => {
    e.preventDefault()
    if (!applyData.society_name.trim() || !applyData.description.trim()) return
    setSubmittingApp(true)
    try {
      await societiesApi.applyForSociety(
        {
          society_name: applyData.society_name,
          category: applyData.category,
          description: applyData.description,
          logo_url: applyLogoPreview || null,
        },
        token
      )
      setAppSubmitted(true)
      const updatedUser = {
        ...user,
        society_status: 'PENDING',
        pending_society_name: applyData.society_name,
      }
      onUpdateUser(updatedUser)
    } catch (err) {
      console.error('Society application failed:', err)
    } finally {
      setSubmittingApp(false)
    }
  }

  const initials = (user?.society_name || user?.name || user?.email || 'CP')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div
      className="h-full w-full overflow-y-auto bg-white"
      style={{ backgroundColor: '#FFFFFF', padding: '0 16px 96px' }}
    >
      <div
        style={{ maxWidth: '56rem', margin: '0 auto', width: '100%', paddingTop: 24 }}
        className="md:grid md:grid-cols-12 md:gap-6"
      >
        {/* Left Column */}
        <div className="md:col-span-5" style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 14 }}>

          {/* Header row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h1 style={{ fontSize: 24, fontWeight: 900, color: '#222222', margin: 0, letterSpacing: '-0.03em' }}>
              Profile
            </h1>
            <button
              onClick={onLogout}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 16px',
                borderRadius: '9999px',
                fontSize: 13,
                fontWeight: 600,
                color: '#717171',
                backgroundColor: '#FFFFFF',
                border: '1px solid #DDDDDD',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
              }}
            >
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>
          </div>

          {/* Admin Banner (if tkorde_be@thapar.edu or admin) */}
          {isAdmin && (
            <div
              className="surface-card"
              style={{
                padding: '16px 18px',
                borderRadius: 16,
                background: 'linear-gradient(135deg, #18181B 0%, #27272A 100%)',
                color: '#FFFFFF',
                border: '1px solid #3F3F46',
                boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: '9999px',
                      backgroundColor: 'rgba(255,255,255,0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Crown size={18} style={{ color: '#FBBF24' }} />
                  </div>
                  <div>
                    <span style={{ fontSize: 13, fontWeight: 800, letterSpacing: '-0.01em' }}>
                      System Administrator
                    </span>
                    <span
                      style={{
                        marginLeft: 6,
                        fontSize: 10,
                        backgroundColor: '#FF385C',
                        padding: '1px 6px',
                        borderRadius: 4,
                        fontWeight: 700,
                      }}
                    >
                      Superuser
                    </span>
                  </div>
                </div>
              </div>
              <p style={{ fontSize: 12, color: '#A1A1AA', margin: '0 0 12px', lineHeight: 1.4 }}>
                You have primary moderation and approval authority for all campus society accounts.
              </p>
              <button
                type="button"
                onClick={() => onNavigate && onNavigate('admin')}
                style={{
                  width: '100%',
                  padding: '9px 14px',
                  borderRadius: 10,
                  backgroundColor: '#FFFFFF',
                  color: '#18181B',
                  fontWeight: 700,
                  fontSize: 12,
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                }}
              >
                <span>Open Admin Dashboard</span>
                <ArrowRight size={14} />
              </button>
            </div>
          )}

          {/* Avatar + User Info Card */}
          <div
            className="surface-card"
            style={{
              padding: 20,
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              border: '1px solid #DDDDDD',
              backgroundColor: '#FFFFFF',
            }}
          >
            {/* Avatar with single coral ring or uploaded logo */}
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: '9999px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 18,
                  fontWeight: 800,
                  color: '#FF385C',
                  flexShrink: 0,
                  backgroundColor: '#FFFFFF',
                  border: '2.5px solid #FF385C',
                  letterSpacing: '-0.01em',
                  overflow: 'hidden',
                }}
              >
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt="Logo"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <span>{initials}</span>
                )}
              </div>

              {isApprovedSociety && (
                <>
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
                    title="Change Society Logo"
                    style={{
                      position: 'absolute',
                      bottom: -4,
                      right: -4,
                      width: 24,
                      height: 24,
                      borderRadius: '9999px',
                      backgroundColor: '#000000',
                      color: '#FFFFFF',
                      border: '2px solid #FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    <UploadCloud size={12} />
                  </button>
                </>
              )}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                <h2
                  style={{
                    fontSize: 16,
                    fontWeight: 800,
                    color: '#222222',
                    margin: 0,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    letterSpacing: '-0.01em',
                  }}
                >
                  {isAdmin
                    ? 'Tejas Korde (Admin)'
                    : isApprovedSociety
                    ? user?.society_name || 'Verified Society'
                    : user?.name || user?.email?.split('@')[0] || 'Student Account'}
                </h2>
                {isAdmin ? (
                  <span
                    style={{
                      fontSize: 10,
                      padding: '1px 5px',
                      borderRadius: 4,
                      backgroundColor: '#FEF3C7',
                      color: '#92400E',
                      fontWeight: 700,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 3,
                    }}
                  >
                    <Crown size={11} /> Admin
                  </span>
                ) : isApprovedSociety ? (
                  <span
                    style={{
                      fontSize: 10,
                      padding: '1px 5px',
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
                ) : (
                  <span
                    style={{
                      fontSize: 10,
                      padding: '1px 5px',
                      borderRadius: 4,
                      backgroundColor: '#F3F4F6',
                      color: '#4B5563',
                      fontWeight: 700,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 3,
                    }}
                  >
                    Student
                  </span>
                )}

                {/* User Active Society Flair (Reddit-style) */}
                {user?.flair?.is_active !== false && user?.flair?.society_name && !isApprovedSociety && (
                  <SocietyFlairBadge flair={user.flair} size="sm" />
                )}
              </div>
              <p
                style={{
                  fontSize: 12,
                  color: '#717171',
                  margin: '3px 0 0',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {user?.email}
              </p>
              <p style={{ fontSize: 12, color: '#222222', marginTop: 4, lineHeight: 1.4 }}>
                {isAdmin
                  ? 'System Administrator · tkorde_be@thapar.edu'
                  : isApprovedSociety
                  ? user?.bio || bio
                  : 'TIET Student · Campus Explorer'}
              </p>
            </div>
          </div>

          {/* Stats Grid: #F7F7F7 surface panels with key numbers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            {STAT_CARDS.map((stat) => (
              <div
                key={stat.label}
                className="surface-card"
                style={{
                  padding: '14px 8px',
                  textAlign: 'center',
                  border: '1px solid #DDDDDD',
                  backgroundColor: '#F7F7F7',
                }}
              >
                <p style={{ fontSize: 22, fontWeight: 900, color: '#222222', margin: 0, letterSpacing: '-0.03em' }}>
                  {stat.value}
                </p>
                <p style={{ fontSize: 11, color: '#717171', margin: '3px 0 0', fontWeight: 600 }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          {/* Affiliation card */}
          <div
            className="surface-card"
            style={{ padding: '14px 20px', border: '1px solid #DDDDDD', backgroundColor: '#FFFFFF' }}
          >
            <p style={{ fontSize: 10, fontWeight: 800, color: '#717171', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 4px' }}>
              Campus Affiliation
            </p>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#222222', margin: 0 }}>
              Thapar Institute of Engineering &amp; Technology
            </p>
          </div>
        </div>

        {/* Right Column: Role Actions & Settings */}
        <div className="md:col-span-7" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* 1. Reddit-Style User Flair & Society Membership Card */}
          <div
            className="surface-card"
            style={{ padding: 22, border: '1px solid #DDDDDD', backgroundColor: '#FFFFFF', borderRadius: 16 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '9999px',
                    backgroundColor: '#FFF5F5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FF385C',
                  }}
                >
                  <Tag size={16} />
                </div>
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 800, color: '#222222', margin: 0 }}>
                    Society Flair (Reddit-Style Tag)
                  </h3>
                  <p style={{ fontSize: 11, color: '#717171', margin: '2px 0 0' }}>
                    Display your society membership tag next to your name in discussions
                  </p>
                </div>
              </div>
              {savedFlair && (
                <span style={{ fontSize: 12, color: '#10B981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Check size={14} /> Flair Saved
                </span>
              )}
            </div>

            {/* Live Flair Preview Banner */}
            <div
              style={{
                padding: '12px 14px',
                borderRadius: 12,
                backgroundColor: '#F9FAFB',
                border: '1px solid #E5E7EB',
                marginBottom: 16,
              }}
            >
              <p style={{ fontSize: 11, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 6px' }}>
                Live Discussion Preview
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: '9999px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #DDDDDD',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 10,
                    fontWeight: 800,
                    color: '#222222',
                  }}
                >
                  {initials}
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#222222' }}>
                  {user?.name || user?.email?.split('@')[0] || 'You'}
                </span>
                {flairActive ? (
                  <SocietyFlairBadge
                    flair={{ society_name: flairSociety, role: flairRole }}
                    size="sm"
                  />
                ) : (
                  <span style={{ fontSize: 11, color: '#9CA3AF', fontStyle: 'italic' }}>
                    (Flair hidden)
                  </span>
                )}
                <span style={{ fontSize: 11, color: '#9CA3AF' }}>· Just now</span>
              </div>
            </div>

            <form onSubmit={handleSaveFlair} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Society Selector Chips */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#222222', display: 'block', marginBottom: 6 }}>
                  Select Your Society
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {POPULAR_SOCIETIES.map((soc) => {
                    const isSelected = flairSociety === soc
                    return (
                      <button
                        key={soc}
                        type="button"
                        onClick={() => setFlairSociety(soc)}
                        style={{
                          padding: '5px 12px',
                          borderRadius: '9999px',
                          fontSize: 12,
                          fontWeight: isSelected ? 700 : 500,
                          backgroundColor: isSelected ? '#000000' : '#FFFFFF',
                          color: isSelected ? '#FFFFFF' : '#222222',
                          border: isSelected ? '1px solid #000000' : '1px solid #DDDDDD',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        {soc}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Role / Position */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: '#222222' }}>
                    Your Role / Title in Society
                  </label>
                  <span style={{ fontSize: 11, color: '#717171' }}>e.g. Core Team, Lead, Member</span>
                </div>
                <input
                  className="input-standard"
                  value={flairRole}
                  onChange={(e) => setFlairRole(e.target.value)}
                  placeholder="e.g. Core Team, President, Technical Lead"
                  style={{ marginBottom: 6 }}
                />
                {/* Quick Role Presets */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {POPULAR_ROLES.map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setFlairRole(r)}
                      style={{
                        padding: '3px 8px',
                        fontSize: 10.5,
                        fontWeight: 600,
                        backgroundColor: flairRole === r ? '#F3F4F6' : '#FFFFFF',
                        border: '1px solid #E5E7EB',
                        borderRadius: 6,
                        color: '#4B5563',
                        cursor: 'pointer',
                      }}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Flair Visibility Toggle */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  borderRadius: 10,
                  backgroundColor: '#F7F7F7',
                  border: '1px solid #DDDDDD',
                }}
              >
                <div>
                  <p style={{ fontSize: 12, fontWeight: 700, color: '#222222', margin: 0 }}>
                    Show Flair in Discussions
                  </p>
                  <p style={{ fontSize: 11, color: '#717171', margin: '2px 0 0' }}>
                    Visible next to all your replies on campus posts
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={flairActive}
                  onChange={(e) => setFlairActive(e.target.checked)}
                  style={{ width: 18, height: 18, cursor: 'pointer', accentColor: '#FF385C' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ padding: '10px 20px', fontSize: 13 }}
                  disabled={savingFlair}
                >
                  {savingFlair ? <Loader2 size={14} className="animate-spin" /> : 'Save Society Flair'}
                </button>
              </div>
            </form>
          </div>

          {/* 1. If User is Student & Pending Approval */}
          {isStudent && (appSubmitted || isPendingSociety) && (
            <div
              className="surface-card"
              style={{
                padding: 24,
                border: '1.5px solid #F59E0B',
                backgroundColor: '#FFFBEB',
                borderRadius: 16,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '9999px',
                    backgroundColor: '#FEF3C7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    color: '#D97706',
                  }}
                >
                  <Clock size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 800, color: '#92400E', margin: 0 }}>
                    Society Application Under Review
                  </h3>
                  <p style={{ fontSize: 13, color: '#78350F', margin: '6px 0 12px', lineHeight: 1.5 }}>
                    Your application for <strong>{user?.pending_society_name || applyData.society_name || 'Society Account'}</strong> has been submitted to System Administrator <strong>tkorde_be@thapar.edu</strong>.
                  </p>
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      fontSize: 12,
                      fontWeight: 700,
                      color: '#B45309',
                      backgroundColor: '#FDE68A',
                      padding: '4px 10px',
                      borderRadius: 8,
                    }}
                  >
                    <span>Status: Pending Admin Approval</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. If User is Student & Has NOT applied yet -> Society Application Form */}
          {isStudent && !appSubmitted && !isPendingSociety && (
            <div
              className="surface-card"
              style={{ padding: 22, border: '1px solid #DDDDDD', backgroundColor: '#FFFFFF', borderRadius: 16 }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: '9999px',
                        backgroundColor: '#FFF5F5',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#FF385C',
                      }}
                    >
                      <Building2 size={16} />
                    </div>
                    <h3 style={{ fontSize: 16, fontWeight: 800, color: '#222222', margin: 0, letterSpacing: '-0.01em' }}>
                      Apply for Society Account
                    </h3>
                  </div>
                  <p style={{ fontSize: 12, color: '#717171', margin: '6px 0 0', lineHeight: 1.4 }}>
                    Societies can publish official campus posts, hackathon announcements, and pin events on the pulse map.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmitApplication} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {/* Society Name */}
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: '#222222', display: 'block', marginBottom: 6 }}>
                    Society / Club Name
                  </label>
                  <input
                    className="input-standard"
                    placeholder="e.g. CCS, OWASP, EDC, Mudra, Thapar Nautanki"
                    value={applyData.society_name}
                    onChange={(e) => setApplyData((p) => ({ ...p, society_name: e.target.value }))}
                    required
                  />
                </div>

                {/* Category Dropdown */}
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: '#222222', display: 'block', marginBottom: 6 }}>
                    Category
                  </label>
                  <select
                    className="input-standard"
                    value={applyData.category}
                    onChange={(e) => setApplyData((p) => ({ ...p, category: e.target.value }))}
                    style={{ cursor: 'pointer' }}
                  >
                    {SOCIETY_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Description */}
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: '#222222', display: 'block', marginBottom: 6 }}>
                    About Society / Mission
                  </label>
                  <textarea
                    className="input-standard resize-none"
                    rows={3}
                    placeholder="Tell us about your team, past flagships, and faculty coordinator..."
                    value={applyData.description}
                    onChange={(e) => setApplyData((p) => ({ ...p, description: e.target.value }))}
                    required
                  />
                </div>

                {/* Logo Upload */}
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: '#222222', display: 'block', marginBottom: 6 }}>
                    Society Logo
                  </label>
                  <input
                    type="file"
                    ref={applyFileInputRef}
                    onChange={handleApplyLogoUpload}
                    accept="image/*"
                    style={{ display: 'none' }}
                  />
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    {applyLogoPreview ? (
                      <div
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: '9999px',
                          border: '2px solid #FF385C',
                          overflow: 'hidden',
                          flexShrink: 0,
                        }}
                      >
                        <img src={applyLogoPreview} alt="Logo Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    ) : (
                      <div
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: '9999px',
                          border: '1px dashed #DDDDDD',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#717171',
                          flexShrink: 0,
                        }}
                      >
                        <ImageIcon size={18} />
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => applyFileInputRef.current?.click()}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '9999px',
                        fontSize: 12,
                        fontWeight: 600,
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #DDDDDD',
                        color: '#222222',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                      }}
                    >
                      <UploadCloud size={14} />
                      <span>{applyLogoPreview ? 'Change Logo' : 'Upload Society Logo'}</span>
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn-primary"
                  style={{ padding: '12px', fontSize: 13, marginTop: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                  disabled={submittingApp}
                >
                  {submittingApp ? <Loader2 size={15} className="animate-spin" /> : 'Submit for Admin Approval'}
                </button>
              </form>
            </div>
          )}

          {/* 3. If Verified Society or Admin: Show Society Profile Manager */}
          {(isApprovedSociety || isAdmin) && (
            <div
              className="surface-card"
              style={{ padding: 20, border: '1px solid #DDDDDD', backgroundColor: '#FFFFFF' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 800, color: '#222222', margin: 0, letterSpacing: '-0.01em' }}>
                    Society Account Details
                  </h3>
                  <p style={{ fontSize: 12, color: '#717171', margin: '3px 0 0' }}>
                    Update your official society brand &amp; bio
                  </p>
                </div>
                {saved && (
                  <span style={{ fontSize: 12, color: '#10B981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Check size={14} /> Saved
                  </span>
                )}
              </div>

              <form onSubmit={handleSaveProfileInfo} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: '#222222', display: 'block', marginBottom: 4 }}>
                    Official Society Name
                  </label>
                  <input
                    className="input-standard"
                    value={societyName}
                    onChange={(e) => setSocietyName(e.target.value)}
                    placeholder="e.g. CCS, Mudra, Trident"
                    required
                  />
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: '#222222', display: 'block', marginBottom: 4 }}>
                    Society Tagline &amp; Bio
                  </label>
                  <textarea
                    className="input-standard resize-none"
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Describe your student chapter or club..."
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    type="submit"
                    className="btn-primary"
                    style={{ padding: '10px 20px', fontSize: 13 }}
                    disabled={saving}
                  >
                    {saving ? <Loader2 size={14} className="animate-spin" /> : 'Save Society Info'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Privacy Settings */}
          <div
            className="surface-card"
            style={{ padding: 20, border: '1px solid #DDDDDD', backgroundColor: '#FFFFFF' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 800, color: '#222222', margin: 0, letterSpacing: '-0.01em' }}>
                  Calendar Privacy
                </h3>
                <p style={{ fontSize: 12, color: '#717171', margin: '3px 0 0' }}>
                  Control who sees events you add to schedule
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {PRIVACY_OPTIONS.map((opt) => {
                const isActive = privacy === opt.value
                const Icon = opt.icon
                return (
                  <button
                    key={opt.value}
                    onClick={() => handlePrivacyChange(opt.value)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '14px 16px',
                      borderRadius: 12,
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      backgroundColor: isActive ? '#FFF5F5' : '#FFFFFF',
                      border: isActive ? '1.5px solid #FF385C' : '1px solid #DDDDDD',
                      boxShadow: isActive ? '0 2px 10px rgba(255,56,92,0.12)' : 'none',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <div
                        style={{
                          width: 38,
                          height: 38,
                          borderRadius: '9999px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          backgroundColor: isActive ? '#FF385C' : '#F7F7F7',
                          color: isActive ? '#FFFFFF' : '#717171',
                          transition: 'all 0.15s ease',
                          border: '1px solid #DDDDDD',
                        }}
                      >
                        <Icon size={17} />
                      </div>
                      <div>
                        <p
                          style={{
                            fontSize: 14,
                            fontWeight: 700,
                            color: '#222222',
                            margin: 0,
                          }}
                        >
                          {opt.label}
                        </p>
                        <p style={{ fontSize: 12, color: '#717171', margin: '2px 0 0' }}>
                          {opt.sub}
                        </p>
                      </div>
                    </div>
                    {/* Radio indicator */}
                    <div
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: '9999px',
                        border: isActive ? '2px solid #FF385C' : '2px solid #DDDDDD',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {isActive && (
                        <div
                          style={{
                            width: 10,
                            height: 10,
                            borderRadius: '9999px',
                            backgroundColor: '#FF385C',
                          }}
                        />
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
