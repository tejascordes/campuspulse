import axios from 'axios'
import { mockStore } from './mockData.js'

// Dynamic Base URL Resolver
export const API_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD
    ? 'https://campus-pulse-backend.onrender.com'
    : 'http://localhost:8000')

// State listener for demo/fallback mode
let isFallbackActive = false
const listeners = new Set()

export function getIsFallbackActive() {
  return isFallbackActive
}

export function subscribeFallbackStatus(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function triggerFallbackMode(reason) {
  if (!isFallbackActive) {
    isFallbackActive = true
    console.warn(`[CampusPulse API] Backend connection failed (${reason}). Switched to Graceful Fallback / Demo Mode.`)
    listeners.forEach((fn) => fn(true))
  }
}

// Axios Client with default timeout
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 7000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Attach Auth Token automatically
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('cp_token')
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Fallback resolver for URL endpoints
function resolveFallback(config, error) {
  const url = config.url || ''
  const method = (config.method || 'get').toLowerCase()
  const params = config.params || {}
  let data = config.data

  if (typeof data === 'string') {
    try {
      data = JSON.parse(data)
    } catch {
      // ignore
    }
  }

  // 1. Posts
  if (url.includes('/api/posts') && !url.includes('/upvote')) {
    if (method === 'get') {
      return { data: mockStore.getPosts(params), status: 200 }
    }
    if (method === 'post') {
      return { data: mockStore.createPost(data || {}), status: 201 }
    }
  }

  // 2. Post Upvote
  if (url.match(/\/api\/posts\/\d+\/upvote/)) {
    const match = url.match(/\/api\/posts\/(\d+)\/upvote/)
    const id = match ? match[1] : null
    return { data: mockStore.upvotePost(id), status: 200 }
  }

  // 3. Events
  if (url.includes('/api/events') && !url.includes('/register') && !url.includes('/invite')) {
    if (method === 'get') {
      return { data: mockStore.getEvents(params), status: 200 }
    }
    if (method === 'post') {
      return { data: mockStore.createEvent(data || {}), status: 201 }
    }
  }

  // 4. Friends API
  if (url.includes('/api/friends')) {
    if (url.includes('/add') && method === 'post') {
      return { data: mockStore.addFriend(data || {}), status: 200 }
    }
    if (method === 'delete') {
      const match = url.match(/\/api\/friends\/(\d+)/)
      const id = match ? match[1] : null
      return { data: mockStore.removeFriend(id), status: 200 }
    }
    if (method === 'get') {
      return { data: mockStore.getFriends(), status: 200 }
    }
  }

  // 5. Event Registration
  if (url.match(/\/api\/events\/\d+\/register/)) {
    const match = url.match(/\/api\/events\/(\d+)\/register/)
    const id = match ? match[1] : null
    const registered = method === 'post'
    const ev = mockStore.toggleEventRegistration(id, registered)
    return { data: { success: true, event: ev }, status: 200 }
  }

  // 6. Event Invites
  if (url.match(/\/api\/events\/\d+\/invite/)) {
    return { data: { success: true, message: 'Invites sent successfully' }, status: 200 }
  }

  // 7. Societies List & Detail
  if (url.includes('/api/societies')) {
    const match = url.match(/\/api\/societies\/(.+)/)
    if (match && match[1]) {
      return { data: mockStore.getSociety(decodeURIComponent(match[1])), status: 200 }
    }
    return { data: mockStore.getSocieties(), status: 200 }
  }

  // 8. Map Pins
  if (url.includes('/api/map/pins')) {
    return { data: mockStore.getPins(), status: 200 }
  }

  // 9. Calendar Save
  if (url.includes('/api/calendar/add')) {
    return { data: { success: true, message: 'Event added to campus calendar' }, status: 200 }
  }

  // 10. Auth Profile
  if (url.includes('/api/auth/profile')) {
    if (method === 'patch') {
      return { data: mockStore.updateProfile(data || {}), status: 200 }
    }
    return { data: mockStore.user, status: 200 }
  }

  // 11. Auth Login / Register
  if (url.includes('/api/auth/login')) {
    return {
      data: mockStore.login(data?.email, data?.password, data?.name, data?.account_type, data?.society_name, data?.logo_url),
      status: 200,
    }
  }

  if (url.includes('/api/auth/register')) {
    return {
      data: mockStore.register(data?.name, data?.email, data?.account_type, data?.society_name, data?.logo_url),
      status: 200,
    }
  }

  // 12. Admin API
  if (url.includes('/api/admin/pending-societies')) {
    return { data: mockStore.getPendingApplications(), status: 200 }
  }

  if (url.match(/\/api\/admin\/societies\/\d+\/approve/)) {
    const match = url.match(/\/api\/admin\/societies\/(\d+)\/approve/)
    const id = match ? match[1] : null
    return { data: mockStore.approveSocietyApplication(id), status: 200 }
  }

  if (url.match(/\/api\/admin\/societies\/\d+\/reject/)) {
    const match = url.match(/\/api\/admin\/societies\/(\d+)\/reject/)
    const id = match ? match[1] : null
    return { data: mockStore.rejectSocietyApplication(id), status: 200 }
  }

  if (url.match(/\/api\/admin\/posts\/\d+/) && method === 'delete') {
    const match = url.match(/\/api\/admin\/posts\/(\d+)/)
    const id = match ? match[1] : null
    return { data: mockStore.deletePost(id), status: 200 }
  }

  if (url.includes('/api/admin/stats')) {
    return { data: mockStore.getAdminStats(), status: 200 }
  }

  if (url.includes('/api/societies/apply') && method === 'post') {
    return { data: mockStore.applyForSociety(data || {}), status: 201 }
  }

  return null
}

// Global Axios Response Interceptor for Fallback / Demo Mode
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const isNetworkError =
      !error.response ||
      error.code === 'ERR_NETWORK' ||
      error.code === 'ECONNABORTED' ||
      (error.response && [500, 502, 503, 504].includes(error.response.status))

    if (isNetworkError && error.config) {
      triggerFallbackMode(error.code || error.message || 'Server Unreachable')
      const fallbackResult = resolveFallback(error.config, error)
      if (fallbackResult) {
        return Promise.resolve(fallbackResult)
      }
    }

    return Promise.reject(error)
  }
)

// Helper wrapper
export async function request(config) {
  try {
    return await apiClient(config)
  } catch (error) {
    const fallbackResult = resolveFallback(config, error)
    if (fallbackResult) {
      triggerFallbackMode('Request Execution Error')
      return fallbackResult
    }
    throw error
  }
}

// Standardized Feature APIs
export const authApi = {
  login: async (credentials) => {
    try {
      const res = await apiClient.post('/api/auth/login', credentials)
      return res.data
    } catch (err) {
      triggerFallbackMode('Auth Server Unavailable')
      return mockStore.login(credentials.email, credentials.password, credentials.name)
    }
  },
  register: async (userData) => {
    try {
      const res = await apiClient.post('/api/auth/register', userData)
      return res.data
    } catch (err) {
      triggerFallbackMode('Auth Server Unavailable')
      return mockStore.register(userData.name, userData.email)
    }
  },
  updateProfile: async (data, token) => {
    try {
      const res = await apiClient.patch('/api/auth/profile', data, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      return res.data
    } catch (err) {
      triggerFallbackMode('Profile Sync Unavailable')
      return mockStore.updateProfile(data)
    }
  },
}

export const postsApi = {
  getPosts: async (params = {}) => {
    const res = await apiClient.get('/api/posts', { params })
    return res.data
  },
  createPost: async (postData) => {
    const res = await apiClient.post('/api/posts', postData)
    return res.data
  },
  upvotePost: async (id) => {
    const res = await apiClient.post(`/api/posts/${id}/upvote`)
    return res.data
  },
}

export const eventsApi = {
  getEvents: async (params = {}) => {
    const res = await apiClient.get('/api/events', { params })
    return res.data
  },
  createEvent: async (eventData) => {
    const res = await apiClient.post('/api/events/create', eventData)
    return res.data
  },
  register: async (id) => {
    const res = await apiClient.post(`/api/events/${id}/register`)
    return res.data
  },
  unregister: async (id) => {
    const res = await apiClient.delete(`/api/events/${id}/register`)
    return res.data
  },
  sendInvite: async (id, inviteData) => {
    const res = await apiClient.post(`/api/events/${id}/invite`, inviteData)
    return res.data
  },
  saveToCalendar: async (calendarData) => {
    const res = await apiClient.post('/api/calendar/add', calendarData)
    return res.data
  },
}

export const friendsApi = {
  getFriends: async () => {
    const res = await apiClient.get('/api/friends')
    return res.data
  },
  addFriend: async (friendData) => {
    const res = await apiClient.post('/api/friends/add', friendData)
    return res.data
  },
  removeFriend: async (friendId) => {
    const res = await apiClient.delete(`/api/friends/${friendId}`)
    return res.data
  },
}

export const societiesApi = {
  getSocieties: async () => {
    const res = await apiClient.get('/api/societies')
    return res.data
  },
  getSociety: async (name) => {
    const res = await apiClient.get(`/api/societies/${encodeURIComponent(name)}`)
    return res.data
  },
  applyForSociety: async (applicationData) => {
    try {
      const res = await apiClient.post('/api/societies/apply', applicationData)
      return res.data
    } catch {
      return mockStore.applyForSociety(applicationData)
    }
  },
}

export const adminApi = {
  getPendingSocieties: async () => {
    try {
      const res = await apiClient.get('/api/admin/pending-societies')
      return res.data
    } catch {
      return mockStore.getPendingApplications()
    }
  },
  approveSociety: async (appId) => {
    try {
      const res = await apiClient.post(`/api/admin/societies/${appId}/approve`)
      return res.data
    } catch {
      return mockStore.approveSocietyApplication(appId)
    }
  },
  rejectSociety: async (appId) => {
    try {
      const res = await apiClient.post(`/api/admin/societies/${appId}/reject`)
      return res.data
    } catch {
      return mockStore.rejectSocietyApplication(appId)
    }
  },
  deletePost: async (postId) => {
    try {
      const res = await apiClient.delete(`/api/admin/posts/${postId}`)
      return res.data
    } catch {
      return mockStore.deletePost(postId)
    }
  },
  getStats: async () => {
    try {
      const res = await apiClient.get('/api/admin/stats')
      return res.data
    } catch {
      return mockStore.getAdminStats()
    }
  },
}

export const mapApi = {
  getPins: async () => {
    const res = await apiClient.get('/api/map/pins')
    return res.data
  },
}

export default apiClient
