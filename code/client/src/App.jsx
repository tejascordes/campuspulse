import { useState } from 'react'
import Navbar from './components/Navbar.jsx'
import FeedView from './views/FeedView.jsx'
import MapView from './views/MapView.jsx'
import ProfileView from './views/ProfileView.jsx'
import LoginView from './views/LoginView.jsx'
import AdminView from './views/AdminView.jsx'

import { API_URL } from './api.js'
export { API_URL }

export default function App() {
  const [tab, setTab] = useState('feed')
  const [token, setToken] = useState(() => localStorage.getItem('cp_token') || null)
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem('cp_user')
    return u ? JSON.parse(u) : null
  })

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
    <div className="h-full w-full flex flex-col overflow-hidden bg-white" style={{ backgroundColor: '#FFFFFF' }}>
      {/* Main content area */}
      <div className="flex-1 overflow-hidden relative w-full bg-white">
        {tab === 'feed' && <FeedView token={token} user={user} onNavigate={setTab} />}
        {tab === 'map' && <MapView token={token} />}
        {tab === 'profile' && <ProfileView user={user} token={token} onLogout={handleLogout} onUpdateUser={updateUser} onNavigate={setTab} />}
        {tab === 'admin' && <AdminView user={user} />}
      </div>

      {/* Bottom Navigation */}
      <Navbar activeTab={tab} onTabChange={setTab} user={user} />
    </div>
  )
}
