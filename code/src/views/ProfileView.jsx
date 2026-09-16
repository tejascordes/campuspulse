import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LogOut, Eye, Users, Shield, Loader2, Check } from 'lucide-react'
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
  { label: 'Posts', value: '12' },
  { label: 'Upvotes', value: '847' },
  { label: 'Events Saved', value: '6' },
]

export default function ProfileView({ user, token, onLogout, onUpdateUser }) {
  const [privacy, setPrivacy] = useState(user?.default_calendar_privacy || 'NO_ONE')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

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

  return (
    <div
      className="h-full w-full overflow-y-auto"
      style={{ backgroundColor: '#F7F7F7', padding: '0 16px 96px' }}
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
                color: '#767676',
                backgroundColor: '#FFFFFF',
                border: '1.5px solid #DDDDDD',
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
              border: '1px solid #EBEBEB',
            }}
          >
            {/* Avatar with red ring */}
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: '9999px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 18,
                fontWeight: 800,
                color: '#FF5A5F',
                flexShrink: 0,
                backgroundColor: '#FFF5F5',
                border: '2.5px solid #FF5A5F',
                letterSpacing: '-0.01em',
              }}
            >
              {initials}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
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
                {user?.name}
              </h2>
              <p
                style={{
                  fontSize: 12,
                  color: '#B0B0B0',
                  margin: '3px 0 0',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {user?.email}
              </p>
              {user?.bio && (
                <p style={{ fontSize: 12, color: '#767676', marginTop: 6, lineHeight: 1.5 }}>
                  {user.bio}
                </p>
              )}
            </div>
          </div>

          {/* Stats Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            {STAT_CARDS.map((stat) => (
              <div
                key={stat.label}
                className="surface-card"
                style={{
                  padding: '14px 8px',
                  textAlign: 'center',
                  border: '1px solid #EBEBEB',
                }}
              >
                <p style={{ fontSize: 22, fontWeight: 900, color: '#FF5A5F', margin: 0, letterSpacing: '-0.03em' }}>
                  {stat.value}
                </p>
                <p style={{ fontSize: 11, color: '#B0B0B0', margin: '3px 0 0', fontWeight: 600 }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          {/* Affiliation card */}
          <div
            className="surface-card"
            style={{ padding: '14px 20px', border: '1px solid #EBEBEB' }}
          >
            <p style={{ fontSize: 10, fontWeight: 800, color: '#B0B0B0', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 4px' }}>
              Campus Affiliation
            </p>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#222222', margin: 0 }}>
              Thapar Institute of Engineering &amp; Technology
            </p>
          </div>
        </div>

        {/* Right Column: Privacy Settings */}
        <div className="md:col-span-7">
          <div
            className="surface-card"
            style={{ padding: 20, border: '1px solid #EBEBEB' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 800, color: '#222222', margin: 0, letterSpacing: '-0.01em' }}>
                  Calendar Privacy
                </h3>
                <p style={{ fontSize: 12, color: '#B0B0B0', margin: '3px 0 0' }}>
                  Control who sees events you add to schedule
                </p>
              </div>
              <AnimatePresence>
                {saving && <Loader2 size={15} className="animate-spin" style={{ color: '#B0B0B0' }} />}
                {saved && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: '9999px',
                      backgroundColor: '#EDFAF4',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Check size={14} style={{ color: '#10B981' }} />
                  </motion.div>
                )}
              </AnimatePresence>
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
                      backgroundColor: isActive ? '#FFF5F5' : '#F7F7F7',
                      border: isActive ? '1.5px solid #FF5A5F' : '1.5px solid #EBEBEB',
                      boxShadow: isActive ? '0 2px 10px rgba(255,90,95,0.12)' : 'none',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      {/* Icon circle */}
                      <div
                        style={{
                          width: 38,
                          height: 38,
                          borderRadius: '9999px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          backgroundColor: isActive ? '#FF5A5F' : '#EBEBEB',
                          color: isActive ? '#FFFFFF' : '#767676',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <Icon size={17} />
                      </div>
                      <div>
                        <p
                          style={{
                            fontSize: 14,
                            fontWeight: 700,
                            color: isActive ? '#222222' : '#484848',
                            margin: 0,
                          }}
                        >
                          {opt.label}
                        </p>
                        <p style={{ fontSize: 12, color: '#B0B0B0', margin: '2px 0 0' }}>
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
                        border: isActive ? '2px solid #FF5A5F' : '2px solid #DDDDDD',
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
                            backgroundColor: '#FF5A5F',
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
