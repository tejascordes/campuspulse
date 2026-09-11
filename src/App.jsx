import { useState, useEffect } from 'react'
import Navbar from './components/Navbar.jsx'
import FeedView from './views/FeedView.jsx'
import MapView from './views/MapView.jsx'
import ProfileView from './views/ProfileView.jsx'
import LoginView from './views/LoginView.jsx'

import { API_URL, subscribeFallbackStatus, getIsFallbackActive } from './api.js'
export { API_URL }

export default function App() {
  const [tab, setTab] = useState('feed')
  const [token, setToken] = useState(() => localStorage.getItem('cp_token') || null)
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem('cp_user')
    return u ? JSON.parse(u) : null
  })
  const [isDemoMode, setIsDemoMode] = useState(getIsFallbackActive())
  const [hideDemoBanner, setHideDemoBanner] = useState(false)

  useEffect(() => {
    const unsubscribe = subscribeFallbackStatus((active) => {
      setIsDemoMode(active)
    })
    return unsubscribe
  }, [])

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
    return <LoginView onLogin={handleLogin} />
  }

  return (
    <div className="h-full flex flex-col bg-base text-zinc-100">
      {isDemoMode && !hideDemoBanner && (
        <div
          className="px-3 py-1 text-[11px] flex items-center justify-between z-30 flex-shrink-0"
          style={{
            backgroundColor: '#18181b',
            borderBottom: '1px solid #27272a',
            color: '#a1a1aa',
          }}
        >
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
      )}
      <div className="flex-1 overflow-hidden relative">
        {tab === 'feed' && <FeedView token={token} user={user} />}
        {tab === 'map' && <MapView token={token} />}
        {tab === 'profile' && <ProfileView user={user} token={token} onLogout={handleLogout} onUpdateUser={updateUser} />}
      </div>
      <Navbar activeTab={tab} onTabChange={setTab} />
    </div>
  )
}

