import axios from 'axios'

const API_URL = 'http://localhost:8080/api/auth'
const PROFILE_API_URL = 'http://localhost:8080/api/profile'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

const profileApi = axios.create({
  baseURL: PROFILE_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

export const authService = {
  login: async (username, password) => {
    const response = await api.post('/login', { username, password })
    return response.data
  },

  signup: async (fullName, username, email, password, phoneNumber) => {
    const response = await api.post('/signup', { fullName, username, email, password, phoneNumber })
    return response.data
  },

  verifyEmail: async (email, code) => {
    const response = await api.post('/verify-email', null, { params: { email, code } })
    return response.data
  },

  sendVerificationEmail: async (email) => {
    const response = await api.post('/send-verification', null, { params: { email } })
    return response.data
  },

  forgotPassword: async (email) => {
    const response = await api.post('/forgot-password', null, { params: { email } })
    return response.data
  },

  resetPassword: async (email, code, newPassword) => {
    const response = await api.post('/reset-password', null, { params: { email, code, newPassword } })
    return response.data
  }
}

export const profileService = {
  updateProfile: async (email, profileData) => {
    const response = await profileApi.post('/update', profileData, { params: { email } })
    return response.data
  },

  getProfile: async (email) => {
    const response = await profileApi.get('/get', { params: { email } })
    return response.data
  }
}

export default api