import { useState, Component } from 'react'
import Navbar from './components/Navbar.jsx'
import FeedView from './views/FeedView.jsx'
import MapView from './views/MapView.jsx'
import ProfileView from './views/ProfileView.jsx'
import LoginView from './views/LoginView.jsx'
import AdminView from './views/AdminView.jsx'

import { API_URL } from './api.js'
export { API_URL }

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-full w-full flex flex-col items-center justify-center p-6 text-center bg-white" style={{ backgroundColor: '#FFFFFF' }}>
          <div style={{ maxWidth: 420 }}>
            <div style={{ width: 52, height: 52, borderRadius: '9999px', backgroundColor: '#FFF1F2', color: '#E11D48', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 24 }}>
              ⚠️
            </div>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: '#111827', marginBottom: 8 }}>
              Something went wrong
            </h2>
            <p style={{ fontSize: 13, color: '#6B7280', marginBottom: 20, wordBreak: 'break-word' }}>
              {this.state.error?.message || 'An unexpected rendering error occurred.'}
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null })
                if (this.props.onReset) this.props.onReset()
                else window.location.reload()
              }}
              style={{
                padding: '9px 24px',
                borderRadius: '9999px',
                backgroundColor: '#FF385C',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: 13,
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(255, 56, 92, 0.25)',
              }}
            >
              Reload App
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

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
        <ErrorBoundary onReset={() => setTab('feed')}>
          {tab === 'feed' && <FeedView token={token} user={user} onNavigate={setTab} />}
          {tab === 'map' && <MapView token={token} />}
          {tab === 'profile' && <ProfileView user={user} token={token} onLogout={handleLogout} onUpdateUser={updateUser} onNavigate={setTab} />}
          {tab === 'admin' && <AdminView user={user} />}
        </ErrorBoundary>
      </div>

      {/* Bottom Navigation */}
      <Navbar activeTab={tab} onTabChange={setTab} user={user} />
    </div>
  )
}
