import { useState, useEffect, lazy, Suspense } from 'react'
import Navbar from './components/Navbar.jsx'
import FeedView from './views/FeedView.jsx'

const MapView = lazy(() => import('./views/MapView.jsx'))
const ProfileView = lazy(() => import('./views/ProfileView.jsx'))
const LoginView = lazy(() => import('./views/LoginView.jsx'))

import { API_URL, subscribeFallbackStatus, getIsFallbackActive } from './api.js'
export { API_URL }

export default function App() {
  const [tab, setTab] = useState('feed')
  const [token, setToken] = useState(() => localStorage.getItem('cp_token') || null)
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem('cp_user')
    return u ? JSON.parse(u) : null
  })
  const [savedEvents, setSavedEvents] = useState(() => {
    try {
      const stored = localStorage.getItem('cp_saved_events')
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })
  const [isDemoMode, setIsDemoMode] = useState(getIsFallbackActive())
  const [hideDemoBanner, setHideDemoBanner] = useState(false)

  useEffect(() => {
    const unsubscribe = subscribeFallbackStatus((active) => {
      setIsDemoMode(active)
    })
    return unsubscribe
  }, [])

  const toggleSaveEvent = (event) => {
    setSavedEvents((prev) => {
      const exists = prev.some((e) => e.id === event.id)
      const next = exists ? prev.filter((e) => e.id !== event.id) : [...prev, event]
      try {
        localStorage.setItem('cp_saved_events', JSON.stringify(next))
      } catch (err) {
        console.error('Failed to sync saved events to localStorage:', err)
      }
      return next
    })
  }

  const handleLogin = (tokenData) => {
    setToken(tokenData.access_token)
    setUser(tokenData.user)
    localStorage.setItem('cp_token', tokenData.access_token)
    localStorage.setItem('cp_user', JSON.stringify(tokenData.user))
  }

  const handleLogout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('cp_token')
    localStorage.removeItem('cp_user')
    setTab('feed')
  }

  const updateUser = (updatedUser) => {
    setUser(updatedUser)
    localStorage.setItem('cp_user', JSON.stringify(updatedUser))
  }

  if (!token) {
    return (
      <Suspense
        fallback={
          <div className="h-full w-full flex items-center justify-center bg-[#09090b]">
            <div className="w-8 h-8 rounded-full border-2 border-zinc-700 border-t-zinc-200 animate-spin" />
          </div>
        }
      >
        <LoginView onLogin={handleLogin} />
      </Suspense>
    )
  }

  return (
    <div className="h-full w-full flex flex-col bg-[#09090b] text-zinc-100 overflow-hidden">
      {isDemoMode && !hideDemoBanner && (
        <div
          className="w-full bg-[#121215] border-b border-[#27272a] px-3 py-1 text-[11px] flex items-center justify-between z-30 flex-shrink-0 text-zinc-400"
        >
          <div className="max-w-xl mx-auto md:max-w-4xl w-full flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Interactive Demo Mode (Offline Preview)</span>
            </div>
            <button
              onClick={() => setHideDemoBanner(true)}
              className="text-zinc-500 hover:text-zinc-300 text-xs px-1 cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>
      )}
      <div className="flex-1 overflow-hidden relative w-full">
        <Suspense
          fallback={
            <div className="h-full w-full flex flex-col items-center justify-center bg-[#09090b] gap-2">
              <div className="w-7 h-7 rounded-full border-2 border-zinc-700 border-t-zinc-200 animate-spin" />
              <span className="text-xs text-zinc-500 font-medium">Loading view...</span>
            </div>
          }
        >
          {tab === 'feed' && (
            <FeedView
              token={token}
              user={user}
              savedEvents={savedEvents}
              onToggleSaveEvent={toggleSaveEvent}
            />
          )}
          {tab === 'map' && <MapView token={token} />}
          {tab === 'profile' && (
            <ProfileView
              user={user}
              token={token}
              savedEvents={savedEvents}
              onToggleSaveEvent={toggleSaveEvent}
              onLogout={handleLogout}
              onUpdateUser={updateUser}
            />
          )}
        </Suspense>
      </div>
      <Navbar activeTab={tab} onTabChange={setTab} />
    </div>
  )
}

