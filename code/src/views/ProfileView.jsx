import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LogOut, Eye, Users, Shield, Loader2, Check, UploadCloud, ShieldCheck } from 'lucide-react'
import { authApi } from '../api.js'

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

export default function ProfileView({ user, token, onLogout, onUpdateUser }) {
  const [privacy, setPrivacy] = useState(user?.default_calendar_privacy || 'NO_ONE')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [societyName, setSocietyName] = useState(user?.society_name || 'CCS')
  const [bio, setBio] = useState(user?.bio || 'Official Student Society at Thapar')
  const [logoUrl, setLogoUrl] = useState(user?.logo_url || '')
  const fileInputRef = useRef(null)

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

  const initials =
    (user?.society_name || user?.name || 'CCS')
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
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
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
                  {user?.society_name || user?.name || 'CCS'}
                </h2>
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
                  <ShieldCheck size={11} /> Verified
                </span>
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
                {user?.bio || bio}
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

        {/* Right Column: Profile & Privacy Settings */}
        <div className="md:col-span-7" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Society Details Form */}
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
