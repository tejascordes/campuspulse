import { useState, useEffect } from 'react'
import Navbar from './components/Navbar.jsx'
import FeedView from './views/FeedView.jsx'
import MapView from './views/MapView.jsx'
import ProfileView from './views/ProfileView.jsx'
import LoginView from './views/LoginView.jsx'

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

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
    <div className="h-full flex flex-col bg-base text-zinc-100">
      <div className="flex-1 overflow-hidden relative">
        {tab === 'feed' && <FeedView token={token} user={user} />}
        {tab === 'map' && <MapView token={token} />}
        {tab === 'profile' && <ProfileView user={user} token={token} onLogout={handleLogout} onUpdateUser={updateUser} />}
      </div>
      <Navbar activeTab={tab} onTabChange={setTab} />
    </div>
  )
}

