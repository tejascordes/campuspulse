import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, Loader2, Shield, X, KeyRound, ExternalLink } from 'lucide-react'
import { authApi } from '../api.js'

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
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [showSetupModal, setShowSetupModal] = useState(false)
  const [customClientId, setCustomClientId] = useState(() => localStorage.getItem('cp_google_client_id') || '')
  const [error, setError] = useState('')

  const activeClientId =
    import.meta.env.VITE_GOOGLE_CLIENT_ID ||
    customClientId ||
    localStorage.getItem('cp_google_client_id') ||
    ''

  // Load Google Identity Services script if not already present
  useEffect(() => {
    if (document.getElementById('google-gsi-client')) return
    const script = document.createElement('script')
    script.id = 'google-gsi-client'
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    document.body.appendChild(script)
  }, [])

  const completeGoogleSignIn = async (googlePayload) => {
    setError('')
    setGoogleLoading(true)
    try {
      const data = await authApi.googleLogin(googlePayload)
      onLogin(data)
    } catch (err) {
      setError(err?.response?.data?.detail || 'Google Sign-In failed. Please try again.')
    } finally {
      setGoogleLoading(false)
    }
  }

  const triggerGoogleOAuth = (clientIdToUse) => {
    const cid = clientIdToUse || activeClientId
    if (!cid) {
      setShowSetupModal(true)
      return
    }

    if (!window.google?.accounts?.oauth2) {
      setError('Google Identity Services is still loading. Please try again in a moment.')
      return
    }

    try {
      setGoogleLoading(true)
      const tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: cid,
        scope: 'openid email profile',
        prompt: 'select_account',
        callback: async (tokenResponse) => {
          if (tokenResponse?.error) {
            setGoogleLoading(false)
            setError(`Google Error: ${tokenResponse.error_description || tokenResponse.error}`)
            return
          }
          if (tokenResponse?.access_token) {
            try {
              const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
              })
              const profile = await res.json()
              await completeGoogleSignIn({
                email: profile.email,
                name: profile.name,
                picture: profile.picture,
              })
            } catch (fetchErr) {
              setGoogleLoading(false)
              setError('Failed to fetch profile from Google.')
            }
          }
        },
      })
      tokenClient.requestAccessToken()
    } catch (oauthErr) {
      setGoogleLoading(false)
      setError(`OAuth Client error: ${oauthErr.message || 'Please check your Client ID'}`)
    }
  }

  const handleSaveClientIdAndSignIn = (e) => {
    e.preventDefault()
    if (!customClientId.trim()) return
    localStorage.setItem('cp_google_client_id', customClientId.trim())
    setShowSetupModal(false)
    triggerGoogleOAuth(customClientId.trim())
  }

  const handleSubmit = async (e) => {
    if (e) e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (mode === 'login') {
        const data = await authApi.login({
          email: form.email,
          password: form.password,
        })
        onLogin(data)
      } else {
        const data = await authApi.register({
          name: form.name || 'Campus Student',
          email: form.email,
          password: form.password,
        })
        onLogin(data)
      }
    } catch (err) {
      if (err.response?.data?.detail) {
        setError(err.response.data.detail)
      } else {
        // Fallback for offline / demo mode
        const fallbackData = await authApi.login({
          email: form.email || 'student@thapar.edu',
          password: form.password || 'password123',
          name: form.name || 'Campus Student',
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
          maxWidth: 400,
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
            marginBottom: 20,
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

        {/* Real Google Sign-In Button */}
        <button
          type="button"
          onClick={() => triggerGoogleOAuth()}
          disabled={googleLoading || loading}
          style={{
            width: '100%',
            padding: '11px 14px',
            borderRadius: 10,
            border: '1px solid #DDDDDD',
            backgroundColor: '#FFFFFF',
            color: '#222222',
            fontSize: 13.5,
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
            margin: '18px 0',
          }}
        >
          <div style={{ flex: 1, height: 1, backgroundColor: '#EBEBEB' }} />
          <span style={{ fontSize: 10, fontWeight: 700, color: '#9CA3AF', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            or continue with email
          </span>
          <div style={{ flex: 1, height: 1, backgroundColor: '#EBEBEB' }} />
        </div>

        {/* Unified Email / Password Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <AnimatePresence>
            {mode === 'register' && (
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
            placeholder="Email (e.g. you@thapar.edu)"
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
            style={{ padding: '14px', fontSize: 14, marginTop: 4, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
            disabled={loading}
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : mode === 'login' ? (
              'Sign In'
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <p style={{ fontSize: 11, color: '#717171', textAlign: 'center', marginTop: 16, lineHeight: 1.5 }}>
          Signing in automatically activates your verified student, society, or admin role.
        </p>
      </div>

      {/* Google OAuth Client ID Setup Modal (Opens only if no Client ID is configured yet) */}
      <AnimatePresence>
        {showSetupModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 3000,
              backgroundColor: 'rgba(0,0,0,0.5)',
              backdropFilter: 'blur(4px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 16,
            }}
            onClick={() => setShowSetupModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ duration: 0.18 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '100%',
                maxWidth: 420,
                backgroundColor: '#FFFFFF',
                borderRadius: 16,
                border: '1px solid #E5E7EB',
                boxShadow: '0 20px 48px rgba(0,0,0,0.18)',
                padding: '24px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <GoogleIcon size={22} />
                  <h3 style={{ fontSize: 16, fontWeight: 800, color: '#202124', margin: 0 }}>
                    Google OAuth 2.0 Setup
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowSetupModal(false)}
                  style={{ background: 'none', border: 'none', color: '#717171', cursor: 'pointer', padding: 4 }}
                >
                  <X size={18} />
                </button>
              </div>

              <p style={{ fontSize: 12.5, color: '#4B5563', lineHeight: 1.5, margin: '0 0 14px' }}>
                To connect to live <strong>accounts.google.com</strong>, Google requires a Web OAuth Client ID from Google Cloud Console with authorized JavaScript origin <code>http://localhost:5173</code>.
              </p>

              <form onSubmit={handleSaveClientIdAndSignIn} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>
                    Google Web Client ID
                  </label>
                  <input
                    className="input-standard"
                    placeholder="e.g. 123456789-xyz.apps.googleusercontent.com"
                    value={customClientId}
                    onChange={(e) => setCustomClientId(e.target.value)}
                    required
                  />
                </div>

                <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                  <button
                    type="button"
                    onClick={() => setShowSetupModal(false)}
                    style={{
                      flex: 1,
                      padding: '10px',
                      borderRadius: 10,
                      border: '1px solid #DDDDDD',
                      backgroundColor: '#FFFFFF',
                      fontSize: 12.5,
                      fontWeight: 700,
                      color: '#555555',
                      cursor: 'pointer',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{
                      flex: 2,
                      padding: '10px',
                      borderRadius: 10,
                      border: 'none',
                      backgroundColor: '#1A73E8',
                      fontSize: 12.5,
                      fontWeight: 700,
                      color: '#FFFFFF',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                    }}
                  >
                    <KeyRound size={14} />
                    <span>Save &amp; Open Google Login</span>
                  </button>
                </div>
              </form>

              <div
                style={{
                  marginTop: 16,
                  paddingTop: 12,
                  borderTop: '1px solid #F3F4F6',
                  fontSize: 11,
                  color: '#6B7280',
                  lineHeight: 1.4,
                }}
              >
                Tip: You can also permanently set <code>VITE_GOOGLE_CLIENT_ID</code> inside your <code>.env</code> file.
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
