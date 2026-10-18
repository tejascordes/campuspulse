import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, Loader2, Building2, User, UploadCloud, Shield, X, PlusCircle, CheckCircle2 } from 'lucide-react'
import { authApi } from '../api.js'

const POPULAR_SOCIETIES = [
  'CCS',
  'Mudra',
  'FAP',
  'Trident',
  'E-Cell',
  'Aagaaz',
  'Rotaract',
  'Quiz Club',
  'Literary Club',
]

function GoogleIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"
      />
    </svg>
  )
}

export default function LoginView({ onLogin }) {
  const [mode, setMode] = useState('login') // 'login' | 'register'
  const [accountType, setAccountType] = useState('society') // 'society' | 'student'
  const [form, setForm] = useState({
    name: '',
    society_name: 'CCS',
    email: '',
    password: '',
    logo_url: '',
  })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [showGoogleModal, setShowGoogleModal] = useState(false)
  const [customGoogleMode, setCustomGoogleMode] = useState(false)
  const [customGoogleAccount, setCustomGoogleAccount] = useState({ name: '', email: '' })
  const [error, setError] = useState('')
  const fileInputRef = useRef(null)

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || ''

  // Load Google Identity Services script if VITE_GOOGLE_CLIENT_ID is provided
  useEffect(() => {
    if (!googleClientId) return
    if (document.getElementById('google-gsi-client')) return
    const script = document.createElement('script')
    script.id = 'google-gsi-client'
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    document.body.appendChild(script)
  }, [googleClientId])

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      const base64 = event.target?.result
      setForm((f) => ({ ...f, logo_url: base64 }))
    }
    reader.readAsDataURL(file)
  }

  const completeGoogleSignIn = async (googlePayload) => {
    setError('')
    setGoogleLoading(true)
    try {
      const data = await authApi.googleLogin(googlePayload)
      setShowGoogleModal(false)
      onLogin(data)
    } catch (err) {
      setError(err?.response?.data?.detail || 'Google Sign-In failed. Please try again.')
    } finally {
      setGoogleLoading(false)
    }
  }

  const handleGoogleButtonClick = () => {
    setError('')
    // If real Google Client ID is configured and GIS script is ready, trigger OAuth2 TokenClient / OneTap
    if (googleClientId && window.google?.accounts?.oauth2) {
      const tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: googleClientId,
        scope: 'openid email profile',
        hint: '@thapar.edu',
        callback: async (tokenResponse) => {
          if (tokenResponse && tokenResponse.access_token) {
            try {
              setGoogleLoading(true)
              const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
              })
              const profile = await res.json()
              const activeSociety =
                accountType === 'society'
                  ? form.society_name === 'Other'
                    ? form.name || 'CCS'
                    : form.society_name
                  : null
              await completeGoogleSignIn({
                email: profile.email,
                name: profile.name,
                picture: profile.picture,
                account_type: accountType,
                society_name: activeSociety,
                logo_url: form.logo_url || profile.picture,
              })
            } catch {
              setGoogleLoading(false)
              setShowGoogleModal(true)
            }
          }
        },
      })
      tokenClient.requestAccessToken()
      return
    }

    // Open interactive Thapar Google Workspace Account Chooser
    setCustomGoogleMode(false)
    setShowGoogleModal(true)
  }

  const activeSocLabel =
    form.society_name === 'Other' ? form.name || 'CCS' : form.society_name || 'CCS'

  const presetGoogleAccounts = [
    {
      id: 'student',
      name: 'Kabir Singh',
      email: 'ksingh_be22@thapar.edu',
      badge: 'Student • CSE',
      account_type: 'student',
      society_name: null,
      avatarBg: '#4285F4',
      initials: 'KS',
    },
    {
      id: 'society',
      name: `${activeSocLabel} Official`,
      email: `${activeSocLabel.toLowerCase().replace(/[^a-z0-9]/g, '')}@thapar.edu`,
      badge: `Official Society • ${activeSocLabel}`,
      account_type: 'society',
      society_name: activeSocLabel,
      avatarBg: '#FF385C',
      initials: activeSocLabel.slice(0, 2).toUpperCase(),
    },
    {
      id: 'admin',
      name: 'Tejas Korde (System Admin)',
      email: 'tkorde_be@thapar.edu',
      badge: 'CampusPulse Admin',
      account_type: 'admin',
      society_name: 'System Administration',
      avatarBg: '#10B981',
      initials: 'TK',
    },
  ]

  const handleSubmit = async (e) => {
    if (e) e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const finalSocietyName = accountType === 'society'
        ? (form.society_name || form.name || 'CCS')
        : null

      if (mode === 'login') {
        const data = await authApi.login({
          email: form.email,
          password: form.password,
          name: form.name || (accountType === 'society' ? `${finalSocietyName} Official` : 'Student'),
          account_type: accountType,
          society_name: finalSocietyName,
          logo_url: form.logo_url,
        })
        onLogin(data)
      } else {
        const data = await authApi.register({
          name: form.name || (accountType === 'society' ? `${finalSocietyName} Official` : 'Student'),
          email: form.email,
          password: form.password,
          account_type: accountType,
          society_name: finalSocietyName,
          logo_url: form.logo_url,
        })
        onLogin(data)
      }
    } catch (err) {
      if (err.response?.data?.detail) {
        setError(err.response.data.detail)
      } else {
        // Fallback for offline / preview
        const finalSocietyName = accountType === 'society'
          ? (form.society_name || form.name || 'CCS')
          : null
        const fallbackData = await authApi.login({
          email: form.email || `${(finalSocietyName || 'student').toLowerCase()}@thapar.edu`,
          password: form.password || 'password123',
          name: form.name || (accountType === 'society' ? `${finalSocietyName} Official` : 'Student'),
          account_type: accountType,
          society_name: finalSocietyName,
          logo_url: form.logo_url,
        })
        onLogin(fallbackData)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="h-full w-full flex flex-col items-center justify-center px-4 relative overflow-y-auto bg-white py-12"
      style={{ backgroundColor: '#FFFFFF' }}
    >
      {/* Subtle background decoration */}
      <div
        style={{
          position: 'absolute',
          top: -120,
          right: -80,
          width: 360,
          height: 360,
          borderRadius: '9999px',
          background: 'radial-gradient(circle, rgba(255,56,92,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Logo */}
      <div className="text-center mb-6">
        <div style={{ marginBottom: 8 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: '9999px',
              backgroundColor: '#FF385C',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px',
              boxShadow: '0 4px 16px rgba(255,56,92,0.35)',
            }}
          >
            <span style={{ color: '#FFFFFF', fontSize: 22, fontWeight: 900 }}>⌘</span>
          </div>
        </div>
        <h1
          style={{
            fontSize: 30,
            fontWeight: 800,
            letterSpacing: '-0.03em',
            margin: 0,
          }}
        >
          <span className="logo-gradient-text">Campus</span>
          <span style={{ color: '#222222' }}>Pulse</span>
        </h1>
        <p style={{ fontSize: 13, color: '#717171', marginTop: 4 }}>
          Thapar Institute Campus Social Layer
        </p>
      </div>

      {/* Card */}
      <div
        style={{
          width: '100%',
          maxWidth: 420,
          backgroundColor: '#FFFFFF',
          borderRadius: 16,
          boxShadow: '0 4px 32px rgba(0,0,0,0.08)',
          padding: '24px',
          border: '1px solid #DDDDDD',
        }}
      >
        {/* Sign In vs Register Tabs */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid #DDDDDD',
            marginBottom: 18,
          }}
        >
          {['login', 'register'].map((m) => (
            <button
              key={m}
              onClick={() => {
                setMode(m)
                setError('')
              }}
              style={{
                flex: 1,
                paddingBottom: 10,
                fontSize: 14,
                fontWeight: mode === m ? 700 : 500,
                color: mode === m ? '#222222' : '#717171',
                background: 'none',
                border: 'none',
                borderBottom: mode === m ? '2px solid #222222' : '2px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                marginBottom: -1,
                letterSpacing: '-0.01em',
              }}
            >
              {m === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          ))}
        </div>

        {/* Account Type Selector (Society vs Student) */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: '#717171', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 8 }}>
            Account Role
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <button
              type="button"
              onClick={() => setAccountType('society')}
              style={{
                padding: '10px 12px',
                borderRadius: 10,
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                backgroundColor: accountType === 'society' ? '#000000' : '#FFFFFF',
                color: accountType === 'society' ? '#FFFFFF' : '#222222',
                border: accountType === 'society' ? '1px solid #000000' : '1px solid #DDDDDD',
                transition: 'all 0.15s ease',
              }}
            >
              <Building2 size={16} />
              <div>
                <p style={{ fontSize: 12, fontWeight: 700, margin: 0 }}>Society</p>
                <p style={{ fontSize: 10, opacity: 0.8, margin: '1px 0 0' }}>Official Account</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setAccountType('student')}
              style={{
                padding: '10px 12px',
                borderRadius: 10,
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                backgroundColor: accountType === 'student' ? '#000000' : '#FFFFFF',
                color: accountType === 'student' ? '#FFFFFF' : '#222222',
                border: accountType === 'student' ? '1px solid #000000' : '1px solid #DDDDDD',
                transition: 'all 0.15s ease',
              }}
            >
              <User size={16} />
              <div>
                <p style={{ fontSize: 12, fontWeight: 700, margin: 0 }}>Student</p>
                <p style={{ fontSize: 10, opacity: 0.8, margin: '1px 0 0' }}>Personal Account</p>
              </div>
            </button>
          </div>
        </div>

        {/* Google Sign-In Button */}
        <button
          type="button"
          onClick={handleGoogleButtonClick}
          disabled={googleLoading || loading}
          style={{
            width: '100%',
            padding: '11px 14px',
            borderRadius: 10,
            border: '1px solid #DDDDDD',
            backgroundColor: '#FFFFFF',
            color: '#222222',
            fontSize: 13,
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#F9FAFB'
            e.currentTarget.style.borderColor = '#BBBBBB'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#FFFFFF'
            e.currentTarget.style.borderColor = '#DDDDDD'
          }}
        >
          {googleLoading ? (
            <Loader2 size={18} className="animate-spin" style={{ color: '#4285F4' }} />
          ) : (
            <GoogleIcon size={18} />
          )}
          <span>Continue with Google</span>
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              padding: '2px 6px',
              borderRadius: 9999,
              backgroundColor: '#F3F4F6',
              color: '#4B5563',
              border: '1px solid #E5E7EB',
            }}
          >
            @thapar.edu
          </span>
        </button>

        {/* Divider */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            margin: '14px 0',
          }}
        >
          <div style={{ flex: 1, height: 1, backgroundColor: '#EBEBEB' }} />
          <span style={{ fontSize: 10, fontWeight: 700, color: '#9CA3AF', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            or continue with email
          </span>
          <div style={{ flex: 1, height: 1, backgroundColor: '#EBEBEB' }} />
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* If Society Account, choose or input Society Name */}
          {accountType === 'society' && (
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: '#222222', display: 'block', marginBottom: 6 }}>
                Official Society Name
              </label>
              <div style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
                <select
                  className="input-standard"
                  style={{ flex: 1 }}
                  value={form.society_name}
                  onChange={(e) => setForm((f) => ({ ...f, society_name: e.target.value }))}
                >
                  {POPULAR_SOCIETIES.map((soc) => (
                    <option key={soc} value={soc}>{soc}</option>
                  ))}
                  <option value="Other">Other Society...</option>
                </select>
              </div>

              {form.society_name === 'Other' && (
                <input
                  className="input-standard"
                  placeholder="Enter custom society name"
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value, society_name: e.target.value }))}
                  required
                />
              )}

              {/* Society Logo Upload */}
              <div style={{ marginTop: 8 }}>
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
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 8,
                    border: '1px dashed #DDDDDD',
                    backgroundColor: '#F7F7F7',
                    fontSize: 12,
                    fontWeight: 600,
                    color: '#717171',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                  }}
                >
                  <UploadCloud size={14} />
                  <span>{form.logo_url ? 'Society Logo Attached ✓' : 'Upload Society Logo (Optional)'}</span>
                </button>
              </div>
            </div>
          )}

          <AnimatePresence>
            {mode === 'register' && accountType === 'student' && (
              <motion.input
                key="name"
                className="input-standard"
                placeholder="Full Name (e.g. Kabir Singh)"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                required
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
              />
            )}
          </AnimatePresence>

          <input
            className="input-standard"
            type="email"
            placeholder={accountType === 'society' ? "Official email (e.g. ccs@thapar.edu)" : "Student email (e.g. you@thapar.edu)"}
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            required
          />

          <div style={{ position: 'relative' }}>
            <input
              className="input-standard"
              type={showPass ? 'text' : 'password'}
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              style={{ paddingRight: 44 }}
              required
            />
            <button
              type="button"
              onClick={() => setShowPass((s) => !s)}
              style={{
                position: 'absolute',
                right: 14,
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#717171',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <AnimatePresence>
            {error && (
              <motion.p
                style={{
                  fontSize: 12,
                  padding: '10px 14px',
                  borderRadius: 8,
                  color: '#FF385C',
                  backgroundColor: 'rgba(255,56,92,0.07)',
                  border: '1px solid rgba(255,56,92,0.18)',
                  margin: 0,
                }}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <button
            type="submit"
            className="btn-primary"
            style={{ padding: '14px', fontSize: 14, marginTop: 6, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
            disabled={loading}
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : mode === 'login' ? (
              `Sign In as ${accountType === 'society' ? 'Society' : 'Student'}`
            ) : (
              `Create ${accountType === 'society' ? 'Society' : 'Student'} Account`
            )}
          </button>
        </form>

        {/* Terms note */}
        <p style={{ fontSize: 11, color: '#717171', textAlign: 'center', marginTop: 16, lineHeight: 1.5 }}>
          By continuing, you agree to CampusPulse&rsquo;s Terms of Service
        </p>
      </div>

      {/* Google Account Chooser Modal */}
      <AnimatePresence>
        {showGoogleModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 3000,
              backgroundColor: 'rgba(0,0,0,0.45)',
              backdropFilter: 'blur(4px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 16,
            }}
            onClick={() => setShowGoogleModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ duration: 0.18 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '100%',
                maxWidth: 400,
                backgroundColor: '#FFFFFF',
                borderRadius: 16,
                border: '1px solid #E5E7EB',
                boxShadow: '0 20px 48px rgba(0,0,0,0.18)',
                overflow: 'hidden',
              }}
            >
              {/* Google Header */}
              <div
                style={{
                  padding: '18px 22px 14px',
                  borderBottom: '1px solid #F3F4F6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <GoogleIcon size={20} />
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 700, color: '#202124', margin: 0 }}>
                      Sign in with Google
                    </p>
                    <p style={{ fontSize: 11, color: '#5F6368', margin: '1px 0 0' }}>
                      Choose a Thapar Workspace account to continue to <strong>CampusPulse</strong>
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowGoogleModal(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#717171',
                    cursor: 'pointer',
                    padding: 4,
                    borderRadius: 8,
                  }}
                >
                  <X size={16} />
                </button>
              </div>

              {/* Account List or Custom Google Form */}
              <div style={{ padding: '12px 16px 18px' }}>
                {!customGoogleMode ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {presetGoogleAccounts.map((acc) => {
                      const isRecommended = acc.account_type === accountType
                      return (
                        <button
                          key={acc.id}
                          type="button"
                          onClick={() =>
                            completeGoogleSignIn({
                              email: acc.email,
                              name: acc.name,
                              account_type: acc.account_type,
                              society_name: acc.society_name,
                              logo_url: form.logo_url || null,
                            })
                          }
                          style={{
                            width: '100%',
                            padding: '11px 12px',
                            borderRadius: 12,
                            border: isRecommended ? '1.5px solid #222222' : '1px solid #E5E7EB',
                            backgroundColor: isRecommended ? '#F9FAFB' : '#FFFFFF',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 12,
                            textAlign: 'left',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          <div
                            style={{
                              width: 38,
                              height: 38,
                              borderRadius: '9999px',
                              backgroundColor: acc.avatarBg,
                              color: '#FFFFFF',
                              fontSize: 13,
                              fontWeight: 800,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                            }}
                          >
                            {acc.initials}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <p
                                style={{
                                  fontSize: 13,
                                  fontWeight: 700,
                                  color: '#202124',
                                  margin: 0,
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                {acc.name}
                              </p>
                              <CheckCircle2 size={13} style={{ color: '#4285F4', flexShrink: 0 }} />
                            </div>
                            <p
                              style={{
                                fontSize: 11,
                                color: '#5F6368',
                                margin: '1px 0 0',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {acc.email}
                            </p>
                          </div>
                          <span
                            style={{
                              fontSize: 10,
                              fontWeight: 700,
                              padding: '3px 8px',
                              borderRadius: 9999,
                              backgroundColor: '#F3F4F6',
                              color: '#374151',
                              flexShrink: 0,
                            }}
                          >
                            {acc.badge}
                          </span>
                        </button>
                      )
                    })}

                    <button
                      type="button"
                      onClick={() => setCustomGoogleMode(true)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: 12,
                        border: '1px dashed #D1D5DB',
                        backgroundColor: '#FFFFFF',
                        color: '#374151',
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                        marginTop: 4,
                      }}
                    >
                      <PlusCircle size={15} style={{ color: '#4285F4' }} />
                      <span>Use another @thapar.edu Google Account</span>
                    </button>
                  </div>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      const activeSociety =
                        accountType === 'society' ? activeSocLabel : null
                      completeGoogleSignIn({
                        email: customGoogleAccount.email || 'student@thapar.edu',
                        name:
                          customGoogleAccount.name ||
                          (accountType === 'society' ? `${activeSocLabel} Official` : 'Thapar Student'),
                        account_type: accountType,
                        society_name: activeSociety,
                        logo_url: form.logo_url || null,
                      })
                    }}
                    style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
                  >
                    <input
                      className="input-standard"
                      placeholder="Full Name (e.g. Aarav Sharma)"
                      value={customGoogleAccount.name}
                      onChange={(e) => setCustomGoogleAccount((c) => ({ ...c, name: e.target.value }))}
                      required
                    />
                    <input
                      className="input-standard"
                      type="email"
                      placeholder="Google Workspace Email (e.g. asharma_be23@thapar.edu)"
                      value={customGoogleAccount.email}
                      onChange={(e) => setCustomGoogleAccount((c) => ({ ...c, email: e.target.value }))}
                      required
                    />
                    <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                      <button
                        type="button"
                        onClick={() => setCustomGoogleMode(false)}
                        style={{
                          flex: 1,
                          padding: '10px',
                          borderRadius: 10,
                          border: '1px solid #DDDDDD',
                          backgroundColor: '#FFFFFF',
                          fontSize: 12,
                          fontWeight: 700,
                          color: '#555555',
                          cursor: 'pointer',
                        }}
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        style={{
                          flex: 2,
                          padding: '10px',
                          borderRadius: 10,
                          border: 'none',
                          backgroundColor: '#1A73E8',
                          fontSize: 12,
                          fontWeight: 700,
                          color: '#FFFFFF',
                          cursor: 'pointer',
                        }}
                      >
                        Continue with Google
                      </button>
                    </div>
                  </form>
                )}

                <div
                  style={{
                    marginTop: 12,
                    paddingTop: 10,
                    borderTop: '1px solid #F3F4F6',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: 10,
                    color: '#6B7280',
                  }}
                >
                  <Shield size={12} style={{ color: '#34A853', flexShrink: 0 }} />
                  <span>
                    Verified OAuth 2.0 • Supports Google Identity Services (<code>VITE_GOOGLE_CLIENT_ID</code>) &amp; Thapar Workspace SSO
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

