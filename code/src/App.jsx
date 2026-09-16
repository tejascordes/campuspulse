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
    <div className="h-full w-full flex flex-col overflow-hidden" style={{ backgroundColor: '#F7F7F7' }}>
      {/* Demo Mode Banner */}
      {isDemoMode && !hideDemoBanner && (
        <div
          className="w-full px-3 py-1.5 flex items-center justify-between z-30 flex-shrink-0"
          style={{
            backgroundColor: '#FFFFFF',
            borderBottom: '1px solid #EBEBEB',
            fontSize: '11px',
            color: '#767676',
          }}
        >
          <div style={{ maxWidth: '56rem', margin: '0 auto', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '9999px',
                  backgroundColor: '#FF5A5F',
                  display: 'inline-block',
                  animation: 'pulse 2s cubic-bezier(0.4,0,0.6,1) infinite',
                }}
              />
              <span>Interactive Demo Mode (Offline Preview)</span>
            </div>
            <button
              onClick={() => setHideDemoBanner(true)}
              style={{ color: '#B0B0B0', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, padding: '0 4px' }}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Main content area */}
      <div className="flex-1 overflow-hidden relative w-full">
        {tab === 'feed' && <FeedView token={token} user={user} />}
        {tab === 'map' && <MapView token={token} />}
        {tab === 'profile' && <ProfileView user={user} token={token} onLogout={handleLogout} onUpdateUser={updateUser} />}
      </div>

      {/* Bottom Navigation */}
      <Navbar activeTab={tab} onTabChange={setTab} />
    </div>
  )
}
