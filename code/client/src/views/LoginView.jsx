import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, Loader2, Building2, User, UploadCloud } from 'lucide-react'
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
  const [error, setError] = useState('')
  const fileInputRef = useRef(null)

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
    </div>
  )
}
