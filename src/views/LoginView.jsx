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
      className="h-full flex flex-col items-center justify-center px-4 relative overflow-hidden"
      style={{ backgroundColor: '#0a0a0c' }}
    >
      {/* Top Logo with single signature gradient */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-black tracking-tight">
          <span className="logo-gradient-text">Campus</span>
          <span className="text-zinc-100">Pulse</span>
        </h1>
        <p className="text-xs text-zinc-500 mt-1">
          Thapar Institute Campus Social Layer
        </p>
      </div>

      {/* Card */}
      <div
        className="w-full max-w-sm p-6 rounded-xl"
        style={{
          backgroundColor: '#141417',
          border: '1px solid #232326',
        }}
      >
        {/* Toggle Mode */}
        <div
          className="flex rounded-xl overflow-hidden mb-5 p-1"
          style={{
            backgroundColor: '#101013',
            border: '1px solid #232326',
          }}
        >
          {['login', 'register'].map((m) => (
            <button
              key={m}
              onClick={() => {
                setMode(m)
                setError('')
              }}
              className="flex-1 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors"
              style={{
                backgroundColor: mode === m ? '#f4f4f5' : 'transparent',
                color: mode === m ? '#0a0a0c' : '#71717a',
              }}
            >
              {m === 'login' ? 'Sign In' : 'Register'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
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

          <div className="relative">
            <input
              className="input-standard pr-10"
              type={showPass ? 'text' : 'password'}
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              required
            />
            <button
              type="button"
              onClick={() => setShowPass((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
            >
              {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>

          <AnimatePresence>
            {error && (
              <motion.p
                className="text-xs px-3 py-2 rounded-lg text-red-400"
                style={{
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
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
            className="btn-primary py-2.5 text-xs font-semibold mt-1 flex items-center justify-center gap-2"
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
      </div>
    </div>
  )
}
