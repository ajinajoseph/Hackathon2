import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
})

// Request interceptor
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => Promise.reject(error)
)

// Response interceptor
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      const refresh = localStorage.getItem('refresh')
      if (refresh) {
        try {
          const { data } = await axios.post('/api/token/refresh/', { refresh })
          localStorage.setItem('token', data.access)
          originalRequest.headers.Authorization = `Bearer ${data.access}`
          return api(originalRequest)
        } catch (err) {
          localStorage.removeItem('token')
          localStorage.removeItem('refresh')
          window.location.href = '/login'
        }
      } else {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

// ── Auth ──────────────────────────────────────────────────────

export const login = async (username, password) => {
  const { data } = await api.post('/token/', { username, password })
  localStorage.setItem('token', data.access)
  localStorage.setItem('refresh', data.refresh)
  return data
}

export const register = (username, password, email = '') => 
  api.post('/register/', { username, password, email }).then(r => r.data)

export const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('refresh')
  window.location.href = '/login'
}

export const isAuthenticated = () => !!localStorage.getItem('token')

// ── Expenses ──────────────────────────────────────────────────

export const getExpenses = (params = {}) =>
  api.get('/expenses/', { params }).then(r => r.data)

export const getExpense = (id) =>
  api.get(`/expenses/${id}/`).then(r => r.data)

export const createExpense = (data) =>
  api.post('/expenses/', data).then(r => r.data)

export const updateExpense = (id, data) =>
  api.put(`/expenses/${id}/`, data).then(r => r.data)

export const deleteExpense = (id) =>
  api.delete(`/expenses/${id}/`).then(r => r.data)

// ── Analytics ─────────────────────────────────────────────────

export const getSummary = (params = {}) =>
  api.get('/analytics/summary/', { params }).then(r => r.data)

export const getCategoryBreakdown = (params = {}) =>
  api.get('/analytics/by-category/', { params }).then(r => r.data)

export const getMonthlyTrend = (params = {}) =>
  api.get('/analytics/monthly-trend/', { params }).then(r => r.data)

export const getDailySpending = (params = {}) =>
  api.get('/analytics/daily/', { params }).then(r => r.data)

// ── AI Insights ───────────────────────────────────────────────

export const getInsights = () =>
  api.get('/insights/').then(r => r.data)

export const getChatInsight = (message, context = {}) =>
  api.post('/insights/chat/', { message, context }).then(r => r.data)

export default api
