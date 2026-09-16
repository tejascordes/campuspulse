import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { authApi } from '../api.js'

export default function LoginView({ onLogin }) {
  const [mode, setMode] = useState('login') // 'login' | 'register'
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    if (e) e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (mode === 'login') {
        const data = await authApi.login({
          email: form.email,
          password: form.password,
          name: form.name || 'User',
        })
        onLogin(data)
      } else {
        const data = await authApi.register(form)
        onLogin(data)
      }
    } catch (err) {
      if (err.response?.data?.detail) {
        setError(err.response.data.detail)
      } else {
        // Graceful fallback for demo on Vercel / offline
        const fallbackData = await authApi.login({
          email: form.email || 'student@thapar.edu',
          password: form.password || 'password123',
          name: form.name || 'Student',
        })
        onLogin(fallbackData)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="h-full w-full flex flex-col items-center justify-center px-4 relative overflow-hidden"
      style={{ backgroundColor: '#F7F7F7' }}
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
          background: 'radial-gradient(circle, rgba(255,90,95,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Logo */}
      <div className="text-center mb-8">
        <div style={{ marginBottom: 8 }}>
          {/* Airbnb-style belo icon */}
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: '9999px',
              background: 'linear-gradient(135deg, #FF5A5F 0%, #FC642D 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px',
              boxShadow: '0 4px 16px rgba(255,90,95,0.35)',
            }}
          >
            <span style={{ color: '#FFFFFF', fontSize: 22, fontWeight: 900 }}>⌘</span>
          </div>
        </div>
        <h1
          style={{
            fontSize: 32,
            fontWeight: 800,
            letterSpacing: '-0.03em',
            margin: 0,
          }}
        >
          <span className="logo-gradient-text">Campus</span>
          <span style={{ color: '#222222' }}>Pulse</span>
        </h1>
        <p style={{ fontSize: 13, color: '#767676', marginTop: 6 }}>
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
          boxShadow: '0 4px 32px rgba(0,0,0,0.10)',
          padding: '28px 28px 24px',
          border: '1px solid #EBEBEB',
        }}
      >
        {/* Tab toggle — Airbnb underline style */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid #EBEBEB',
            marginBottom: 22,
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
                paddingBottom: 12,
                fontSize: 14,
                fontWeight: mode === m ? 700 : 500,
                color: mode === m ? '#222222' : '#767676',
                background: 'none',
                border: 'none',
                borderBottom: mode === m ? '2px solid #FF5A5F' : '2px solid transparent',
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

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <AnimatePresence>
            {mode === 'register' && (
              <motion.input
                key="name"
                className="input-standard"
                placeholder="Full Name"
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
                color: '#B0B0B0',
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
                  color: '#FF5A5F',
                  backgroundColor: 'rgba(255,90,95,0.07)',
                  border: '1px solid rgba(255,90,95,0.18)',
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
              'Sign In'
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {/* Terms note */}
        <p style={{ fontSize: 11, color: '#B0B0B0', textAlign: 'center', marginTop: 16, lineHeight: 1.5 }}>
          By continuing, you agree to CampusPulse&rsquo;s Terms of Service
        </p>
      </div>
    </div>
  )
}
